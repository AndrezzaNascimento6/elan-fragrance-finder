"""Validate the authored CSV and atomically prepare deterministic static JSON."""
import argparse
import csv
import io
import json
import os
import re
import sys
import tempfile
from decimal import Decimal
from pathlib import Path

import pandas as pd

HEADERS = ['id','name','price','currency','image_src','image_alt','key_notes','intensity','feeling_tags','occasion_tags','product_path']
ROOT = Path(__file__).resolve().parents[1]
MAX_CENTS = 9007199254740991

class Invalid(ValueError):
    def __init__(self,field,reason):
        self.field,self.reason=field,reason
        super().__init__(f'{field}:{reason}')

def require(condition,field,reason):
    if not condition: raise Invalid(field,reason)

def nested(raw,field):
    try: return json.loads(raw)
    except (ValueError,TypeError): raise Invalid(field,'invalid-json') from None

def enum_set(value,vocabulary,field):
    require(isinstance(value,list),field,'invalid-array')
    require(all(isinstance(x,str) and x in vocabulary for x in value),field,'invalid-enum')
    return sorted(set(value))

def parse(row,taxonomy):
    r={k:v.strip() for k,v in row.items()}
    require(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',r['id']), 'id','invalid-slug')
    for field in ['name','image_alt']: require(bool(r[field]),field,'required')
    require(re.fullmatch(r'[0-9]+(?:\.[0-9]{1,2})?',r['price']), 'price','invalid-decimal')
    cents=int(Decimal(r['price'])*100)
    require(cents<=MAX_CENTS,'price','unsafe-integer')
    require(r['currency']=='USD','currency','unsupported')
    require(re.fullmatch(r'/images/fragrances/[a-zA-Z0-9_-]+(?:/[a-zA-Z0-9_-]+)*\.(?:svg|webp|png|jpg|jpeg|avif)',r['image_src']), 'image_src','invalid-local-path')
    asset=ROOT/'public'/r['image_src'].lstrip('/')
    require(asset.resolve().is_relative_to((ROOT/'public/images/fragrances').resolve()),'image_src','invalid-local-path')
    require(asset.is_file(),'image_src','missing-asset')
    require(r['product_path']==f"#/products/{r['id']}",'product_path','identity-mismatch')
    require(r['intensity'] in taxonomy['intensity'],'intensity','invalid-enum')
    notes=nested(r['key_notes'],'key_notes')
    require(isinstance(notes,list) and len(notes)>0,'key_notes','required')
    parsed_notes=[]
    for note in notes:
        require(isinstance(note,dict) and isinstance(note.get('name'),str) and bool(note['name'].strip()),'key_notes','invalid-note')
        categories=enum_set(note.get('categories'),taxonomy['category'],'key_notes')
        require(bool(categories),'key_notes','invalid-categories')
        parsed_notes.append({'name':note['name'].strip(),'categories':categories})
    tags={}
    for field,dimension in [('feeling_tags','feeling'),('occasion_tags','occasion')]:
        tags[field]=None if not r[field] else enum_set(nested(r[field],field),taxonomy[dimension],field)
    return dict(id=r['id'],name=r['name'],priceCents=cents,currency='USD',imageSrc=r['image_src'],imageAlt=r['image_alt'],keyNotes=parsed_notes,intensity=r['intensity'],feelingTags=tags['feeling_tags'],occasionTags=tags['occasion_tags'],productPath=r['product_path'])

def prepare(source,taxonomy_path):
    text=source.read_text(encoding='utf-8')
    raw=list(csv.reader(io.StringIO(text),strict=True))
    require(bool(raw) and len(raw[0])==len(HEADERS) and set(raw[0])==set(HEADERS),'headers','invalid-headers')
    require(all(len(r)==len(HEADERS) for r in raw[1:]),'csv','invalid-structure')
    taxonomy=json.loads(taxonomy_path.read_text(encoding='utf-8'))
    require(isinstance(taxonomy,dict) and all(isinstance(taxonomy.get(k),dict) and taxonomy[k] for k in ['feeling','occasion','category','intensity','budget']),'taxonomy','invalid-schema')
    frame=pd.read_csv(io.StringIO(text),dtype=str,keep_default_na=False,na_filter=False,skip_blank_lines=False)
    rows=frame.to_dict(orient='records')
    diagnostics=dict(sourceRows=len(rows),excludedRows=0,identicalDuplicateRows=0,unknownAttributeProducts=0,issues=[])
    groups={}
    def issue(number,identity,field,reason): diagnostics['issues'].append(dict(row=number,identity=identity,field=field,reason=reason))
    for number,r in enumerate(rows,2):
        identity=r['id'].strip()
        parsed,error=None,None
        try: parsed=parse(r,taxonomy)
        except Invalid as e: error=e
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',identity):
            diagnostics['excludedRows']+=1;issue(number,None,'id','invalid-slug');continue
        fingerprint=json.dumps(parsed if parsed is not None else r,sort_keys=True,ensure_ascii=False)
        groups.setdefault(identity,[]).append((number,parsed,error,fingerprint))
    products=[]
    for identity,group in sorted(groups.items()):
        if len({r[3] for r in group})>1:
            diagnostics['excludedRows']+=len(group)
            for number,_,_,_ in group: issue(number,identity,'id','identity-conflict')
        elif group[0][1] is None:
            diagnostics['excludedRows']+=len(group)
            for number,_,error,_ in group: issue(number,identity,error.field,error.reason)
        else:
            products.append(group[0][1]);diagnostics['identicalDuplicateRows']+=len(group)-1
    diagnostics['unknownAttributeProducts']=sum(p['feelingTags'] is None or p['occasionTags'] is None for p in products)
    diagnostics['issues'].sort(key=lambda i:(i['row'],i['identity'] or '',i['field'],i['reason']))
    return dict(schemaVersion=1,products=products,diagnostics=diagnostics)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input',type=Path,required=True);parser.add_argument('--taxonomy',type=Path,required=True);parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--check',action='store_true');parser.add_argument('--allow-exclusions',action='store_true')
    args=parser.parse_args()
    try:
        document=prepare(args.input,args.taxonomy)
        print(json.dumps(document['diagnostics'],sort_keys=True),file=sys.stderr)
        if document['diagnostics']['sourceRows'] and not document['products']: return 1
        if document['diagnostics']['excludedRows'] and not args.allow_exclusions: return 1
        expected=(json.dumps(document,ensure_ascii=False,indent=2)+'\n').encode('utf-8')
        if args.check:
            if not args.output.is_file() or args.output.read_bytes()!=expected:
                print('Generated catalog is stale; regenerate explicitly.',file=sys.stderr);return 1
            return 0
        args.output.parent.mkdir(parents=True,exist_ok=True)
        temporary=None
        try:
            with tempfile.NamedTemporaryFile(dir=args.output.parent,delete=False) as f:
                temporary=Path(f.name);f.write(expected);f.flush();os.fsync(f.fileno())
            os.replace(temporary,args.output)
        finally:
            if temporary and temporary.exists(): temporary.unlink()
        return 0
    except (OSError,UnicodeError,ValueError,csv.Error,pd.errors.ParserError) as e:
        print(f'Catalog validation failed: {e}',file=sys.stderr);return 1

if __name__=='__main__': sys.exit(main())

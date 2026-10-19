import { taxonomy, emptyDiagnostics, type Catalog, type Fragrance, type Diagnostics, type Issue } from './types';
const object = (x: unknown): x is Record<string,unknown> => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;
const count = (x: unknown): x is number => Number.isSafeInteger(x) && (x as number) >= 0;
const slug = (x: unknown): x is string => typeof x === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x);
function set(value: unknown, vocabulary: object, nullable = false): string[] | null {
 if (nullable && (value === null || value === undefined)) return null;
 if (!Array.isArray(value) || value.some(v => typeof v !== 'string' || !Object.hasOwn(vocabulary,v))) throw Error('invalid-enum-array');
 return [...new Set(value)].sort();
}
export function parseProduct(value: unknown): Fragrance {
 if (!object(value)) throw Error('record:invalid-object');
 const p = value;
 for (const field of ['name','imageAlt']) if (!text(p[field])) throw Error(`${field}:required`);
 if (!slug(p.id)) throw Error('id:invalid-slug');
 if (!count(p.priceCents)) throw Error('priceCents:invalid-price');
 if (p.currency !== 'USD') throw Error('currency:unsupported');
 if (typeof p.imageSrc !== 'string' || !/^\/images\/fragrances\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.(?:svg|webp|png|jpg|jpeg|avif)$/.test(p.imageSrc)) throw Error('imageSrc:invalid-local-path');
 if (p.productPath !== `#/products/${p.id}`) throw Error('productPath:identity-mismatch');
 if (typeof p.intensity !== 'string' || !Object.hasOwn(taxonomy.intensity,p.intensity)) throw Error('intensity:invalid-enum');
 if (!Array.isArray(p.keyNotes) || !p.keyNotes.length) throw Error('keyNotes:required');
 const keyNotes = p.keyNotes.map(n=>{
  if (!object(n) || !text(n.name)) throw Error('keyNotes:invalid-note');
  const categories=set(n.categories,taxonomy.category);
  if (!categories?.length) throw Error('keyNotes:invalid-categories');
  return {name:n.name.trim(),categories};
 });
 let feelingTags, occasionTags;
 try { feelingTags=set(p.feelingTags,taxonomy.feeling,true); } catch { throw Error('feelingTags:invalid-enum-array'); }
 try { occasionTags=set(p.occasionTags,taxonomy.occasion,true); } catch { throw Error('occasionTags:invalid-enum-array'); }
 return {id:p.id,name:(p.name as string).trim(),priceCents:p.priceCents as number,currency:'USD',imageSrc:p.imageSrc,imageAlt:(p.imageAlt as string).trim(),keyNotes,intensity:p.intensity,feelingTags,occasionTags,productPath:p.productPath} as Fragrance;
}
function diagnostics(value: unknown): Diagnostics {
 if (!object(value)) throw Error('Invalid catalog diagnostics');
 for (const field of ['sourceRows','excludedRows','identicalDuplicateRows','unknownAttributeProducts']) if (!count(value[field])) throw Error('Invalid catalog diagnostics');
 if (!Array.isArray(value.issues) || value.issues.some(i=>!object(i)||!count(i.row)||(i.identity!==null&&typeof i.identity!=='string')||!text(i.field)||!text(i.reason))) throw Error('Invalid catalog issues');
 if ((value.excludedRows as number)+(value.identicalDuplicateRows as number)>(value.sourceRows as number)) throw Error('Inconsistent catalog diagnostics');
 return {...value,issues:value.issues.map(i=>({...i}))} as unknown as Diagnostics;
}
export function normalizeCatalog(input: unknown): Catalog {
 if (!object(input) || input.schemaVersion!==1 || !Array.isArray(input.products)) throw Error('Unsupported catalog document');
 const previous=diagnostics(input.diagnostics);
 if (previous.sourceRows !== input.products.length + previous.excludedRows + previous.identicalDuplicateRows) throw Error('Inconsistent catalog source count');
 const current=emptyDiagnostics(), groups=new Map<string,{row:number;parsed?:Fragrance;raw:unknown;error?:string}[]>();
 input.products.forEach((raw,index)=>{
  const row=index+2, id=object(raw)&&slug(raw.id)?raw.id:null;
  let parsed: Fragrance | undefined,error: string | undefined;
  try { parsed=parseProduct(raw); } catch(e) { error=e instanceof Error?e.message:'record:invalid'; }
  if (!id) { current.excludedRows++;current.issues.push({row,identity:null,field:'id',reason:'invalid-slug'});return; }
  groups.set(id,[...(groups.get(id)??[]),{row,parsed,raw,error}]);
 });
 const products: Fragrance[]=[];
 for (const [id,rows] of groups) {
  const fingerprints=rows.map(r=>r.parsed?JSON.stringify(r.parsed):JSON.stringify(r.raw));
  if (new Set(fingerprints).size>1) {
   current.excludedRows+=rows.length; rows.forEach(r=>current.issues.push({row:r.row,identity:id,field:'id',reason:'identity-conflict'}));continue;
  }
  if (!rows[0].parsed) {
   current.excludedRows+=rows.length;rows.forEach(r=>{ const [field,reason]=r.error?.split(':')??['record','invalid'];current.issues.push({row:r.row,identity:id,field,reason}); });continue;
  }
  products.push(rows[0].parsed);current.identicalDuplicateRows+=rows.length-1;
 }
 products.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
 const merged: Diagnostics={sourceRows:previous.sourceRows,excludedRows:previous.excludedRows+current.excludedRows,identicalDuplicateRows:previous.identicalDuplicateRows+current.identicalDuplicateRows,unknownAttributeProducts:products.filter(p=>p.feelingTags===null||p.occasionTags===null).length,issues:[...previous.issues,...current.issues].sort((a:Issue,b:Issue)=>a.row-b.row || (a.field<b.field?-1:a.field>b.field?1:0))};
 if (!products.length && merged.sourceRows>0) throw Error('Catalog has no usable products');
 return {schemaVersion:1,products,diagnostics:merged};
}

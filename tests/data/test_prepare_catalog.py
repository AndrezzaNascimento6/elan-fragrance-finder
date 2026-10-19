import csv
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HEADERS = ['id','name','price','currency','image_src','image_alt','key_notes','intensity','feeling_tags','occasion_tags','product_path']

def row(**changes):
    value = dict(zip(HEADERS, ['a','Morning, Glass','49.99','USD','/images/fragrances/test-fixture.svg','Fictional clear glass bottle',json.dumps([{'name':'Bergamot','categories':['citrus']}]),'light','["fresh"]','["everyday"]','#/products/a']))
    return value | changes

class Preparation(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.base = Path(self.tmp.name)
        self.source = self.base/'source.csv'
        self.output = self.base/'catalog.json'
    def tearDown(self):
        self.tmp.cleanup()
    def write(self, rows, headers=HEADERS):
        with self.source.open('w',newline='',encoding='utf-8') as f:
            writer=csv.DictWriter(f,fieldnames=headers);writer.writeheader();writer.writerows(rows)
    def run_command(self,*args):
        return subprocess.run([sys.executable,str(ROOT/'scripts/prepare_catalog.py'),'--input',str(self.source),'--taxonomy',str(ROOT/'data/taxonomy.json'),'--output',str(self.output),*args],capture_output=True,text=True)
    def doc(self): return json.loads(self.output.read_text())
    def test_quoting_decimal_and_reproducibility(self):
        for price,cents in [('0',0),('49.99',4999),('50',5000),('99.99',9999),('100',10000)]:
            with self.subTest(price=price):
                self.write([row(price=price)]);self.assertEqual(self.run_command().returncode,0)
                self.assertEqual(self.doc()['products'][0]['priceCents'],cents)
                before=self.output.read_bytes();self.assertEqual(self.run_command('--check').returncode,0);self.assertEqual(before,self.output.read_bytes())
    def test_invalid_rows_leave_existing_output_atomic(self):
        for changes in [dict(price=p) for p in ['-1','NaN','Infinity','1e2','0.001','90071992547409.92']]+[{'currency':'EUR'},{'key_notes':'bad'},{'intensity':'soft'},{'feeling_tags':'["weird"]'},{'occasion_tags':'null'},{'image_src':'/images/fragrances/../secret.svg'},{'image_src':'/images/fragrances/missing.svg'},{'image_src':'https://external/x.svg'},{'product_path':'#/products/wrong'},{'image_alt':''}]:
            with self.subTest(changes=changes):
                self.output.write_text('sentinel');self.write([row(**changes)]);result=self.run_command();self.assertEqual(result.returncode,1,result.stderr);self.assertEqual(self.output.read_text(),'sentinel')
    def test_unknown_is_not_empty(self):
        self.write([row(feeling_tags=''),row(id='b',product_path='#/products/b',feeling_tags='[]')]);self.assertEqual(self.run_command().returncode,0)
        self.assertEqual([p['feelingTags'] for p in self.doc()['products']],[None,[]]);self.assertEqual(self.doc()['diagnostics']['unknownAttributeProducts'],1)
    def test_canonical_duplicates_and_identity_conflicts(self):
        self.write([row(feeling_tags='["fresh","warm"]'),row(feeling_tags='["warm","fresh"]')]);self.assertEqual(self.run_command().returncode,0);self.assertEqual(self.doc()['diagnostics']['identicalDuplicateRows'],1)
        for pair in [[row(),row(price='bad')],[row(price='bad'),row()],[row(),row(price='50')]]:
            self.write(pair+[row(id='b',product_path='#/products/b')]);self.assertEqual(self.run_command().returncode,1)
            self.assertEqual(self.run_command('--allow-exclusions').returncode,0);self.assertEqual([p['id'] for p in self.doc()['products']],['b']);self.assertEqual(self.doc()['diagnostics']['excludedRows'],2)
    def test_headers_encoding_and_csv_structure(self):
        for source in [','.join(HEADERS[:-1])+'\n',','.join(HEADERS+['id'])+'\n',','.join(HEADERS)+'\n"unterminated',','.join(HEADERS)+'\n'+','.join(['x']*12)]:
            self.source.write_text(source);self.assertEqual(self.run_command().returncode,1)
        self.source.write_bytes(b'\xff');self.assertEqual(self.run_command().returncode,1)
    def test_empty_unusable_staleness_and_invocation(self):
        self.write([]);self.assertEqual(self.run_command().returncode,0);self.assertEqual(self.doc()['products'],[])
        self.output.write_text('old');self.assertEqual(self.run_command('--check').returncode,1);self.assertEqual(self.output.read_text(),'old')
        self.write([row(price='bad')]);self.assertEqual(self.run_command('--allow-exclusions').returncode,1)
        self.assertEqual(self.run_command('--unknown').returncode,2)
    def test_diagnostics_are_stable(self):
        self.write([row(price='bad'),row(id='b',product_path='#/products/b')]);self.assertEqual(self.run_command('--allow-exclusions').returncode,0)
        before=self.output.read_bytes();self.assertEqual(self.run_command('--allow-exclusions').returncode,0);self.assertEqual(before,self.output.read_bytes());self.assertEqual(self.doc()['diagnostics']['issues'][0]['row'],2)

if __name__=='__main__': unittest.main()

import { describe,it,expect } from 'vitest';
import { recommend } from '../../src/domain/recommend';
import { normalizeCatalog } from '../../src/domain/catalog';
import { product,document,preferences } from './fixtures';
import type { PreferenceSet } from '../../src/domain/types';
const run=(products:unknown[],p:PreferenceSet=preferences)=>recommend(normalizeCatalog(document(products)),p);
describe('deterministic recommendations',()=>{
 it.each([[4999,'under-50'],[5000,'50-under-100'],[9999,'50-under-100'],[10000,'100-plus']] as const)('keeps %i in only %s', (priceCents,band)=>{
  for(const budget of ['under-50','50-under-100','100-plus'] as const){const result=run([product({priceCents})],{...preferences,budget});expect(result.status).toBe(budget===band?'success':'empty');}
 });
 it('counts exactly four equally weighted dimensions with only one category point',()=>{
  const result=run([product({keyNotes:[{name:'Bergamot',categories:['citrus']},{name:'Lemon',categories:['citrus']}]}),product({id:'b',productPath:'#/products/b',intensity:'intense'})]);
  if(result.status==='invalid-preferences') throw Error();expect(result.recommendations.map(r=>r.score)).toEqual([4,3]);
 });
 it('excludes zero scores and respects known empty and unknown',()=>{
  const result=run([product({feelingTags:null,occasionTags:[],intensity:'intense',keyNotes:[{name:'Rose',categories:['floral']}]})]);expect(result.status).toBe('empty');
 });
 it('takes three unique ASCII ties irrespective of permutations and never mutates input',()=>{
  const rows=['d','b','c','a'].map(id=>product({id,productPath:`#/products/${id}`}));
  const original=JSON.stringify(rows);
  for(const permutation of [rows,[...rows].reverse(),[rows[2],rows[0],rows[3],rows[1]]]) {
   const result=run(permutation);if(result.status==='invalid-preferences')throw Error();expect(result.recommendations.map(r=>r.product.id)).toEqual(['a','b','c']);expect(result.recommendations.every(r=>r.tied)).toBe(true);
  }
  expect(JSON.stringify(rows)).toBe(original);
 });
 it.each([{}, {...preferences,feeling:'happy'},{...preferences,gender:'all'},{...preferences,budget:null}])('rejects incomplete/noncanonical preferences',p=>expect(run([product()],p as PreferenceSet).status).toBe('invalid-preferences'));
});

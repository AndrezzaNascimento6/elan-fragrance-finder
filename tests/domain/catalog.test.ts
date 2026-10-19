import { describe, it, expect } from 'vitest';
import { normalizeCatalog } from '../../src/domain/catalog';
import { product, document } from './fixtures';
describe('catalog boundary', () => {
 it('rejects malformed envelopes and unsupported versions', () => {
  for (const input of [null, [], {}, {...document([]),schemaVersion:2}, {...document([]),diagnostics:{}}, {...document([]),diagnostics:{...document([]).diagnostics,sourceRows:2}}]) expect(()=>normalizeCatalog(input)).toThrow();
 });
 it('distinguishes valid empty from unusable source', () => {
  expect(normalizeCatalog(document([])).products).toEqual([]);
  expect(()=>normalizeCatalog({...document([]),diagnostics:{...document([]).diagnostics,sourceRows:1,excludedRows:1}})).toThrow();
 });
 it('retains unknown optional tags but not empty sets as unknown', () => {
  const { feelingTags: _unused, ...missing } = product();
  const c=normalizeCatalog(document([missing,product({id:'b',productPath:'#/products/b',feelingTags:[]})]));
  expect(c.products.map(p=>p.feelingTags)).toEqual([null,[]]);
  expect(c.diagnostics.unknownAttributeProducts).toBe(1);
 });
 it.each([{priceCents:-1},{priceCents:1.5},{priceCents:Infinity},{currency:'EUR'},{imageSrc:'/images/fragrances/../x.svg'},{imageSrc:'https://x/x.svg'},{imageAlt:''},{intensity:'soft'},{feelingTags:['invented']},{keyNotes:[]},{occasionTags:'work'},{productPath:'#/products/other'}])('quarantines damaged records %j', bad => {
  const c=normalizeCatalog(document([product(bad),product({id:'b',productPath:'#/products/b'})]));
  expect(c.products.map(p=>p.id)).toEqual(['b']); expect(c.diagnostics.excludedRows).toBe(1);
 });
 it('conflicts exclude the identity before invalid filtering', () => {
  const a=product(),bad=product({priceCents:-1}),b=product({id:'b',productPath:'#/products/b'});
  for(const rows of [[a,bad,b],[bad,b,a]]) expect(normalizeCatalog(document(rows)).products.map(p=>p.id)).toEqual(['b']);
 });
 it('deduplicates canonical set order, preserves note order, and preparation issues',()=>{
  const a=product({feelingTags:['fresh','warm']}),b=product({feelingTags:['warm','fresh']});
  const input=document([a,b]); input.diagnostics.issues=[{row:4,identity:'x',field:'name',reason:'invalid'}];
  const c=normalizeCatalog(input); expect(c.products).toHaveLength(1); expect(c.diagnostics.identicalDuplicateRows).toBe(1); expect(c.diagnostics.issues).toContainEqual(input.diagnostics.issues[0]);
 });
});

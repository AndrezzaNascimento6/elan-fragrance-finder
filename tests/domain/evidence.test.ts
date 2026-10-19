import { it,expect } from 'vitest';
import { evidenceFor, evidenceText } from '../../src/domain/evidence';
import { product,preferences,document } from './fixtures';
import { recommend } from '../../src/domain/recommend';
import { normalizeCatalog } from '../../src/domain/catalog';
it('orders four dimensions and grounds category matches in named notes',()=>{
 const evidence=evidenceFor(product(),preferences);
 expect(evidence.map(e=>e.dimension)).toEqual(['feeling','occasion','category','intensity']);expect(evidence.every(e=>e.status==='matched')).toBe(true);expect(evidence[2].sources).toEqual(['Bergamot']);expect(evidenceText(evidence[2])).toContain('Bergamot');
});
it('distinguishes unknown, known empty, mismatches and actual values',()=>{
 const e=evidenceFor(product({feelingTags:null,occasionTags:[],intensity:'balanced'}),preferences);
 expect(e.map(x=>x.status)).toEqual(['unknown','mismatched','matched','mismatched']);expect(evidenceText(e[0])).toContain('unspecified');expect(evidenceText(e[1])).toContain('no occasion tags');expect(evidenceText(e[3])).toContain('Balanced');
});
it('score equals matched evidence for the complete preference space',()=>{
 for(const feeling of ['fresh','warm','elegant','bold'] as const) for(const occasion of ['everyday','work','date-night','special-occasions'] as const) for(const category of ['citrus','floral','woody','sweet','spicy'] as const) for(const intensity of ['light','balanced','intense'] as const) {
  const result=recommend(normalizeCatalog(document([product()])),{...preferences,feeling,occasion,category,intensity});
  if(result.status==='success') for(const r of result.recommendations) expect(r.score).toBe(r.evidence.filter(e=>e.status==='matched').length);
 }
});

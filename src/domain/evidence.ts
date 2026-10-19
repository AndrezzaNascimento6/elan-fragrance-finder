import { label, type Fragrance, type PreferenceSet, type Evidence } from './types';
export function evidenceFor(product: Fragrance, p: PreferenceSet): Evidence[] {
 const tags=(dimension:'feeling'|'occasion', values:string[]|null): Evidence => ({dimension,selected:p[dimension],status:values===null?'unknown':values.includes(p[dimension])?'matched':'mismatched',actual:values??[],sources:values??[]});
 const notes=product.keyNotes.filter(note=>note.categories.includes(p.category));
 return [tags('feeling',product.feelingTags),tags('occasion',product.occasionTags),{dimension:'category',selected:p.category,status:notes.length?'matched':'mismatched',actual:[...new Set(product.keyNotes.flatMap(n=>n.categories))],sources:notes.map(n=>n.name)},{dimension:'intensity',selected:p.intensity,status:product.intensity===p.intensity?'matched':'mismatched',actual:[product.intensity],sources:[product.intensity]}];
}
export function evidenceText(e: Evidence): string {
 const selected=label(e.dimension,e.selected);
 if(e.status==='unknown') return `${selected} selected; ${e.dimension} is unspecified in the catalog.`;
 if(e.status==='matched') return e.dimension==='category'?`${selected} matches ${e.sources.join(', ')} in the key notes.`:`${selected} matches the catalog ${e.dimension}${e.dimension==='intensity'?'':' tags'}.`;
 const actual=e.actual.length?e.actual.map(v=>label(e.dimension,v)).join(', '):`no ${e.dimension} tags`;
 return `${selected} selected; the catalog lists ${actual}.`;
}

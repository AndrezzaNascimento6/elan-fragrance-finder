import { evidenceFor } from './evidence';
import { taxonomy, dimensions, type Catalog, type PreferenceSet, type RecommendationResult } from './types';
export function validPreferences(value: unknown): value is PreferenceSet {
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==5)return false;
 const v=value as Record<string,unknown>;
 return dimensions.every(d=>typeof v[d]==='string' && Object.hasOwn(taxonomy[d],v[d] as string));
}
export function recommend(catalog: Catalog, preferences: PreferenceSet): RecommendationResult {
 if(!validPreferences(preferences))return {status:'invalid-preferences',message:'Choose one answer for each of the five questions.'};
 const inBudget=(cents:number)=>preferences.budget==='under-50'?cents<5000:preferences.budget==='50-under-100'?cents>=5000&&cents<10000:cents>=10000;
 const ranked=catalog.products.filter(p=>inBudget(p.priceCents)).map(product=>{
  const evidence=evidenceFor(product,preferences);
  return {product,evidence,score:evidence.filter(e=>e.status==='matched').length};
 }).filter(r=>r.score>0).sort((a,b)=>b.score-a.score || (a.product.id<b.product.id?-1:a.product.id>b.product.id?1:0));
 const recommendations=ranked.slice(0,3).map((r,i)=>({...r,rank:i+1,tied:ranked.some(other=>other.product.id!==r.product.id&&other.score===r.score)}));
 return {status:recommendations.length?'success':'empty',recommendations,diagnostics:catalog.diagnostics};
}

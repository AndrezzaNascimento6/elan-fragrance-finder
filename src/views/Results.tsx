import { dimensions,label,type PreferenceSet,type RecommendationResult } from '../domain/types';
import { FragranceRecommendation } from '../components/FragranceRecommendation';
export function ActivePreferences({preferences}:{preferences:PreferenceSet}) {
 return <section className="active-preferences" aria-label="Your active preferences"><p className="eyebrow">THE FIVE THINGS THAT MAKE IT YOURS</p><dl>{dimensions.map(d=><div key={d}><dt>{d==='category'?'Notes':d[0].toUpperCase()+d.slice(1)}</dt><dd>{label(d,preferences[d])}</dd></div>)}</dl></section>;
}
export function Results({result,preferences}:{result:Exclude<RecommendationResult,{status:'invalid-preferences'}>;preferences:PreferenceSet}) {
 const count=result.recommendations.length,diagnostics=result.diagnostics;
 return <section className="results">
  <div className="results-heading"><p className="eyebrow">PERSONAL PREFERENCES. CONSIDERED DISCOVERIES.</p><h1 tabIndex={-1} data-view-heading>{count?'Your fragrance edit':'A different direction awaits'}</h1><p className="muted">{count?'A small collection of possibilities, with every choice explained.':'No fragrance matches a preference within this budget. Your answers are preserved.'}</p>
   {count>0&&count<3&&<p>We found {count} suitable {count===1?'fragrance':'fragrances'} in your budget, so your edit contains {count} {count===1?'suggestion':'suggestions'}.</p>}
   {(diagnostics.excludedRows>0||diagnostics.unknownAttributeProducts>0)&&<p className="limitation">Some catalog information is unavailable. Unspecified preferences are identified in each explanation; incomplete required records are excluded.</p>}
  </div>
  <ActivePreferences preferences={preferences}/>
  {count>1&&<nav className="alternatives" aria-label="Browse your recommendations">{result.recommendations.map(r=><a href={`#recommendation-${r.rank}`} key={r.product.id}>View recommendation {r.rank} of {count}<span aria-hidden="true"> ↓</span></a>)}</nav>}
  {result.recommendations.map(r=><FragranceRecommendation key={r.product.id} recommendation={r} preferences={preferences} total={count}/>)}
  <p className="result-disclosure small muted">Fictional fragrances. Feeling and occasion tags describe this curated catalog; they cannot predict your personal scent experience.</p>
 </section>;
}

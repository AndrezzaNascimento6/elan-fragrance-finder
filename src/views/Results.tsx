import { Icon } from '../components/Icon';
import { motion } from 'motion/react';
import { useMotionPolicy } from '../motion/MotionProvider';
import { headingReveal } from '../motion/variants';
import { dimensions,label,type PreferenceSet,type RecommendationResult } from '../domain/types';
import { FragranceRecommendation } from '../components/FragranceRecommendation';
export function ActivePreferences({preferences}:{preferences:PreferenceSet}) {
 return <section className="active-preferences" aria-label="Your active preferences"><p className="eyebrow">THE FIVE THINGS THAT MAKE IT YOURS</p><dl>{dimensions.map(d=><div key={d}><dt>{d==='category'?'Notes':d[0].toUpperCase()+d.slice(1)}</dt><dd>{label(d,preferences[d])}</dd></div>)}</dl></section>;
}
export function Results({result,preferences}:{result:Exclude<RecommendationResult,{status:'invalid-preferences'}>;preferences:PreferenceSet}) {
 const count=result.recommendations.length,diagnostics=result.diagnostics,reduced=useMotionPolicy();
 return <section className="results">
  <div className="results-heading"><p className="eyebrow">PERSONAL PREFERENCES. CONSIDERED DISCOVERIES.</p><motion.h1 {...headingReveal(reduced)} tabIndex={-1} data-view-heading>{count?'Your fragrance edit':'A different direction awaits'}</motion.h1><p className="muted">{count?'A small collection of possibilities, with every choice explained.':'No fragrance matches a preference within this budget. Your answers are preserved.'}</p>
   {count>0&&count<3&&<p>We found {count} suitable {count===1?'fragrance':'fragrances'} in your budget, so your edit contains {count} {count===1?'suggestion':'suggestions'}.</p>}
   {(diagnostics.excludedRows>0||diagnostics.unknownAttributeProducts>0)&&<p className="limitation">Some catalog information is unavailable. Unspecified preferences are identified in each explanation; incomplete required records are excluded.</p>}
  </div>
  {count>1&&<nav className="alternatives" aria-label="Browse your recommendations">{result.recommendations.map(r=><a href={`#recommendation-${r.rank}`} key={r.product.id} aria-label={`View recommendation ${r.rank} of ${count}`}>View <span className="browse-number">0{r.rank}</span> of 0{count}<span className="browse-circle"><Icon name="chevron"/></span></a>)}</nav>}
  {result.recommendations[0]&&<FragranceRecommendation recommendation={result.recommendations[0]} preferences={preferences} total={count}/>}
  <ActivePreferences preferences={preferences}/>
  {result.recommendations.slice(1).map(r=><FragranceRecommendation key={r.product.id} recommendation={r} preferences={preferences} total={count}/>)}
  <p className="result-disclosure small muted">Fictional fragrances. Feeling and occasion tags describe this curated catalog; they cannot predict your personal scent experience.</p>
 </section>;
}

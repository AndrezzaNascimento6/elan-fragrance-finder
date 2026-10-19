import { motion } from 'motion/react';
import { ProductImage } from './ProductImage';
import { evidenceText } from '../domain/evidence';
import { label,type Recommendation,type PreferenceSet } from '../domain/types';
import { useMotionPolicy } from '../motion/MotionProvider';
import { bottleReveal } from '../motion/variants';
export const money=(cents:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
export function FragranceRecommendation({recommendation:r,preferences,total}:{recommendation:Recommendation;preferences:PreferenceSet;total:number}) {
 const p=r.product,reduced=useMotionPolicy();
 return <article className="recommendation" id={`recommendation-${r.rank}`} aria-labelledby={`name-${p.id}`}>
  <motion.div className="result-art" {...(r.rank===1?bottleReveal(reduced):{})} initial={r.rank===1?bottleReveal(reduced).initial:{opacity:1,y:reduced?0:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}}><ProductImage product={p} priority={r.rank===1}/><span className="art-index" aria-hidden="true">0{r.rank} / 0{total}</span></motion.div>
  <div className="result-copy">
   <p className="eyebrow">{r.rank===1?'YOUR FIRST DISCOVERY':'ANOTHER FACET OF YOU'}</p>
   <h2 id={`name-${p.id}`}>{p.name}</h2>
   <p className="product-meta">{money(p.priceCents)} USD <span aria-hidden="true">/</span> {label('intensity',p.intensity)} intensity</p>
   <p className="match-count">Matches {r.score} of 4 preferences — {r.score===4?'exact match':'partial match'}</p>
   <p className="notes"><span className="muted">Key notes</span><br/>{p.keyNotes.map(n=>n.name).join(' · ')}</p>
   <h3 className="evidence-heading">Why it’s in your edit</h3>
   <ul className="evidence">{r.evidence.map(e=><li key={e.dimension}><span className="evidence-status">{e.status==='matched'?'✓ Match':e.status==='unknown'?'? Unspecified':'— Different'}</span><span>{evidenceText(e)}</span></li>)}</ul>
   <p className="budget-note">Within your {label('budget',preferences.budget)} budget. Budget determines eligibility and is separate from the four matches.</p>
   {r.tied&&<p className="small muted">Other eligible fragrances match the same number of preferences. Ties use a stable product-ID order, which does not indicate stronger suitability.</p>}
   <a className="detail-link" id={`detail-${p.id}`} href={p.productPath}>Explore {p.name}<span aria-hidden="true"> ↗</span></a>
   {r.rank>1&&<a className="back-primary small" href="#recommendation-1">Return to the first recommendation ↑</a>}
  </div>
 </article>;
}

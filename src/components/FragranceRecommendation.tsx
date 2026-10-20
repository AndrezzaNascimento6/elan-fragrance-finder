import { useRef } from 'react';
import { motion,useInView,useIsPresent } from 'motion/react';
import { ProductImage } from './ProductImage';
import { Icon } from './Icon';
import { evidenceText } from '../domain/evidence';
import { label,type Recommendation,type PreferenceSet } from '../domain/types';
import { useMotionPolicy } from '../motion/MotionProvider';
import { cinematicEase } from '../motion/variants';
export const money=(cents:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
export function FragranceRecommendation({recommendation:r,preferences,total}:{recommendation:Recommendation;preferences:PreferenceSet;total:number}) {
 const p=r.product,reduced=useMotionPolicy(),present=useIsPresent();
 const art=useRef<HTMLDivElement>(null),visible=useInView(art,{amount:.1});
 return <article className="recommendation" id={`recommendation-${r.rank}`} aria-labelledby={`name-${p.id}`}>
  <motion.header className="product-heading" initial={{y:reduced?0:44,x:reduced?0:20}} whileInView={{y:0,x:0}} viewport={{once:true,amount:.1}} transition={{duration:reduced?.1:1,ease:cinematicEase}}>
   <p className="eyebrow">{r.rank===1?'YOUR FIRST DISCOVERY':'ANOTHER FACET OF YOU'}</p>
   <motion.span className="script product-script" aria-hidden="true" initial={reduced?false:{x:-46,y:26,rotate:-4}} whileInView={{x:0,y:0,rotate:0}} viewport={{once:true}} transition={{duration:reduced?.1:.95,ease:cinematicEase}}>{r.rank===1?'A little more you':'Another possibility'}</motion.span>
   <motion.h2 initial={reduced?false:{x:-70,y:38,scale:.9,rotateY:-9}} whileInView={{x:0,y:0,scale:1,rotateY:0}} viewport={{once:true,amount:.1}} transition={{duration:reduced?.1:1.2,ease:cinematicEase}} id={`name-${p.id}`}>{p.name}</motion.h2>
   <p className="product-meta">{money(p.priceCents)} USD <span aria-hidden="true">/</span> {label('intensity',p.intensity)} intensity</p>
   <div className="match-composition"><div className="match-marks" aria-hidden="true">{[1,2,3,4].map(n=><motion.i initial={{scaleX:reduced?1:0}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{duration:reduced?.1:.7,delay:reduced?0:n*.08}} className={n<=r.score?'matched':''} key={n}/>)}</div><p className="match-count">Matches {r.score} of 4 preferences — {r.score===4?'exact match':'partial match'}</p></div>
</motion.header>
  <div className="result-art" ref={art}>
   <motion.div className="result-photo" initial={false} animate={reduced||!visible||!present?{scale:1,y:0,x:0,rotateY:0}:{scale:[1.52,1],y:[68,0],x:[-26,0],rotateY:[-7,0]}} transition={{duration:reduced||!visible||!present?0:1.65,ease:cinematicEase}}><ProductImage product={p} priority={r.rank===1}/></motion.div>
   <motion.div className="result-light" aria-hidden="true" initial={false} animate={{opacity:reduced||!visible||!present?0:[.45,.12,0]}} transition={{duration:reduced?0:1.5}}/><span className="art-index" aria-hidden="true">0{r.rank}<i/>0{total}</span>
   <span className="art-caption" aria-hidden="true">ÉLAN · THE FICTIONAL COLLECTION</span>
  </div>
  <motion.div className="result-copy" initial={{y:reduced?0:44,x:reduced?0:20}} whileInView={{y:0,x:0}} viewport={{once:true,amount:.1}} transition={{duration:reduced?.1:1,ease:cinematicEase}}>
   <p className="notes"><span className="eyebrow">KEY NOTES</span><br/>{p.keyNotes.map(n=>n.name).join(' · ')}</p>
   <h3 className="evidence-heading">Why it’s in your edit</h3>
   <ul className="evidence">{r.evidence.map(e=><li key={e.dimension}><span className="evidence-status"><Icon name={e.status==='matched'?'check':e.status==='unknown'?'unknown':'difference'}/>{e.status==='matched'?'Match':e.status==='unknown'?'Unspecified':'Different'}</span><span>{evidenceText(e)}</span></li>)}</ul>
   <p className="budget-note">Within your {label('budget',preferences.budget)} budget. Budget determines eligibility and is separate from the four matches.</p>
   {r.tied&&<p className="small muted">Other eligible fragrances match the same number of preferences. Ties use a stable product-ID order, which does not indicate stronger suitability.</p>}
   <a className="detail-link" id={`detail-${p.id}`} href={p.productPath}>Explore {p.name}<Icon/></a>
   {r.rank>1&&<a className="back-primary small" href="#recommendation-1"><Icon name="chevron" className="up"/>Return to the first recommendation</a>}
  </motion.div>
 </article>;
}

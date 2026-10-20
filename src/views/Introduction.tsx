import { motion,useIsPresent } from 'motion/react';
import { useMotionPolicy } from '../motion/MotionProvider';
import { cinematicEase,headingReveal } from '../motion/variants';
import { Icon } from '../components/Icon';
import { MoodImage,moodCopy,type Mood } from '../components/MoodImage';
import { taxonomy } from '../domain/types';

export function Introduction({onStart}:{onStart:()=>void}) {
 const reduced=useMotionPolicy(),present=useIsPresent();
 return <section className="introduction">
  <div className="hero" id="home">
   <div className="hero-shade" aria-hidden="true"/>
   <div className="hero-copy">
    <motion.p className="script hero-script" aria-hidden="true" initial={reduced?false:{opacity:0,x:-70,y:30,rotate:-6}} animate={reduced?{opacity:1,x:0,y:0,rotate:0}:present?{opacity:1,x:0,y:0,rotate:0}:{opacity:0,x:-100,y:-40,rotate:-6}} transition={{duration:reduced?.1:present?1.1:.5,ease:cinematicEase}}>A more personal kind of luxury</motion.p>
    <h1 tabIndex={-1} data-view-heading><motion.span {...headingReveal(reduced,.08)} animate={reduced?{y:0,x:0,rotateX:0}:present?headingReveal(false,.08).animate:{y:-90,x:-40,rotateX:-16,transition:{duration:.55,ease:cinematicEase}}}>Find the fragrance</motion.span>{' '}<motion.span {...headingReveal(reduced,.24)} animate={reduced?{y:0,x:0,rotateX:0}:present?headingReveal(false,.24).animate:{y:-130,x:45,rotateX:-20,transition:{duration:.6,ease:cinematicEase}}}>that feels like you</motion.span></h1>
    <motion.p className="hero-description" {...headingReveal(reduced,.3)}>A guided experience to help you discover fragrances based on how you want to feel, your occasion, preferred notes, intensity and budget.</motion.p>
    <motion.button className="primary hero-cta" initial={reduced?false:{y:64,x:16,scale:.86,rotateX:12}} animate={reduced?{y:0,x:0,scale:1,rotateX:0}:present?{y:0,x:0,scale:1,rotateX:0}:{y:50,x:0,scale:.8,rotateX:-12}} transition={{duration:reduced?.1:present?1:.45,delay:reduced||!present?0:.38,ease:cinematicEase}} aria-label="Start discovering" onClick={onStart} whileHover={reduced?{}:{y:-2}} whileTap={reduced?{}:{scale:.97}}><span>Start discovery</span><Icon/></motion.button>
    <p className="hero-caption">Five simple questions. A more personal discovery.</p>
   </div>
   <aside className="hero-aside" aria-hidden="true"><span>MORE<br/>THAN<br/>A SCENT</span><i/><span className="script">A feeling</span></aside>
  </div>
  <section className="feeling-preview" id="feeling-preview" aria-labelledby="feeling-preview-heading">
   <div className="preview-progress" aria-hidden="true">{[1,2,3,4,5].map(n=><span className={n===1?'active':''} key={n}><b>0{n}</b><i/></span>)}</div>
   <p className="eyebrow">A PERSONAL JOURNEY IN FIVE QUESTIONS</p>
   <h2 id="feeling-preview-heading">How do you want to feel?</h2>
   <p className="section-description">A feeling is a beautiful place to begin.</p>
   <ul className="mood-preview-grid">{Object.entries(taxonomy.feeling).map(([key,value])=><motion.li key={key} initial={{y:reduced?0:24}} whileInView={{y:0}} viewport={{once:true,amount:.15}} transition={{duration:reduced?.1:.6}}>
    <MoodImage mood={key as Mood}/><div className="card-shade"/><div className="mood-preview-copy"><h3>{value}</h3><p>{moodCopy[key as Mood]}</p></div>
   </motion.li>)}</ul>
  </section>
  <section className="approach" id="approach" aria-labelledby="approach-heading"><span className="script" aria-hidden="true">Considered. Never prescribed.</span><h2 id="approach-heading">Your preferences.<br/>A world of possibilities.</h2><p>A fictional collection, guided by five simple answers. Every recommendation comes with a clear explanation. A starting point for exploration, not a guarantee of personal satisfaction.</p></section>
 </section>;
}

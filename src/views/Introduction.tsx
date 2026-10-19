import { motion } from 'motion/react';
import { useMotionPolicy } from '../motion/MotionProvider';
import { reveal,bottleReveal } from '../motion/variants';
export function Introduction({onStart}:{onStart:()=>void}) {
 const reduced=useMotionPolicy();
 return <section className="introduction">
  <motion.div className="intro-copy" {...reveal(reduced)}>
   <p className="eyebrow">THE FRAGRANCE FINDER</p>
   <h1>A little of you.<br/>A scent <em>of your own.</em></h1>
   <p className="intro-description">Some things are felt before they’re understood. Let’s find a fragrance that speaks your language.</p>
   <button onClick={onStart}>Start discovering<span aria-hidden="true">↗</span></button>
   <p className="small muted">Five simple questions · No fragrance expertise needed</p>
  </motion.div>
  <figure className="intro-art">
   <motion.img {...bottleReveal(reduced)} src="/images/fragrances/aube.svg" alt="Fictional Élan Aube glass bottle in a warm pool of light." width="900" height="1125" fetchPriority="high"/>
   <figcaption><span>THE ÉLAN COLLECTION</span><span>A study in individuality</span></figcaption>
  </figure>
  <p className="intro-disclosure small muted">A fictional collection, guided by your preferences. Suggestions are a starting point for exploration, not a guarantee of personal satisfaction.</p>
 </section>;
}

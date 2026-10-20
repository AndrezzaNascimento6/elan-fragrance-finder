import { motion,useIsPresent } from 'motion/react';
import type { PropsWithChildren } from 'react';
import { useMotionPolicy } from './MotionProvider';
import { cinematicEase } from './variants';
export function ViewStage({children,view}:{view:string}&PropsWithChildren){
 const present=useIsPresent(),reduced=useMotionPolicy();
 return <motion.div className={`view-stage view-${view}`} data-present={present} inert={!present} aria-hidden={!present||undefined}
  initial={reduced?{opacity:1,scale:1,x:0,y:0}:{opacity:1,scale:view==='results'?1.08:.96,x:view==='questions'?80:0,y:view==='results'?55:0}}
  animate={{opacity:1,scale:1,x:0,y:0,transition:{duration:reduced?.1:.86,ease:cinematicEase}}}
  exit={reduced?{opacity:0,scale:1,x:0,y:0,transition:{duration:.1}}:{opacity:0,scale:.88,x:-80,y:-35,transition:{duration:.6,ease:cinematicEase}}}>
  {children}
 </motion.div>;
}

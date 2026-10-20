import { useRef } from 'react';
import { motion,useInView } from 'motion/react';
import { useMotionPolicy } from './MotionProvider';
import { cinematicEase } from './variants';
export function CampaignCamera({view}:{view:string}){
 const reduced=useMotionPolicy(),frame=useRef<HTMLDivElement>(null),visible=useInView(frame,{amount:.05});
 const drifting=view==='intro'&&visible&&!reduced;
 const poses:Record<string,{scale:number;x:number;y:number;rotate:number}>={
  intro:{scale:1,x:0,y:0,rotate:0},
  questions:{scale:1.19,x:-56,y:-28,rotate:-.7},
  processing:{scale:1.37,x:28,y:-42,rotate:.8},
  results:{scale:1.02,x:-12,y:0,rotate:0},
  error:{scale:1.02,x:0,y:0,rotate:0},
 };
 return <div className="experience-camera" ref={frame} aria-hidden="true" data-scene={view}>
  <motion.picture className="hero-art" initial={reduced?false:{scale:1.46,x:86,y:-28,rotate:1.4}}
   animate={reduced?{scale:1,x:0,y:0,rotate:0}:poses[view]}
   transition={{duration:reduced?.1:view==='intro'?1.8:1.1,ease:cinematicEase}}>
   <motion.img className="hero-drift" initial={false} animate={drifting?{scale:[1,1.28,1],x:[0,-38,0],y:[0,18,0]}:{scale:1,x:0,y:0}}
    transition={drifting?{duration:14,repeat:Infinity,ease:'easeInOut'}:{duration:reduced?0:.35}}
    src="/images/campaign/hero.webp" srcSet="/images/campaign/hero-640.webp 640w, /images/campaign/hero.webp 1536w" sizes="100vw" alt="" width="1536" height="1024" fetchPriority="high"/>
  </motion.picture>
  <motion.div className="camera-veil" initial={false} animate={{opacity:view==='intro'?0:view==='questions'?.75:.94}} transition={{duration:reduced?.1:.8}}/>
 </div>;
}

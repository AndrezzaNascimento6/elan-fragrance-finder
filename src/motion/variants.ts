import type { Variants } from 'motion/react';
export const cinematicEase = [0.22, 1, 0.36, 1] as const;
export const headingReveal = (reduced:boolean, delay=0) => ({
 initial: {y:reduced?0:64,rotateX:reduced?0:12,x:reduced?0:-22},
 animate: {y:0,rotateX:0,x:0,transition:{duration:reduced?.1:1.1,delay:reduced?0:delay,ease:cinematicEase}},
});
export const questionVariants=(reduced:boolean):Variants=>({
 enter:(data:{direction:number})=>reduced?{opacity:1,x:0,y:0,scale:1,rotateY:0}:{opacity:1,x:160*data.direction,y:24,scale:1.08,rotateY:8*data.direction},
 center:{opacity:1,x:0,y:0,scale:1,rotateY:0,transition:{duration:reduced?.1:.76,ease:cinematicEase}},
 exit:(data:{direction:number})=>reduced?{opacity:0,x:0,y:0,scale:1,rotateY:0,transition:{duration:.1}}:{opacity:0,x:-180*data.direction,y:-30,scale:.85,rotateY:-8*data.direction,transition:{duration:.6,ease:cinematicEase}},
});

import { useId,useRef,useEffect } from 'react';
import { motion } from 'motion/react';
import { taxonomy,type Dimension } from '../domain/types';
import { useMotionPolicy } from '../motion/MotionProvider';
import { cinematicEase } from '../motion/variants';
import { Icon } from './Icon';
import { MoodImage,moodCopy,type Mood } from './MoodImage';
export const prompts:Record<Dimension,string>={feeling:'How do you want to feel?',occasion:'What’s the occasion?',category:'Which notes draw you in?',intensity:'How much presence?',budget:'What’s your budget?'};
export const hints:Record<Dimension,string>={feeling:'Choose the feeling that resonates with you most right now.',occasion:'For everyday rituals, memorable evenings, and everything in between.',category:'Follow the notes you’re drawn to. No expertise needed.',intensity:'A quiet impression or a little more presence. It’s yours to choose.',budget:'We’ll keep every suggestion within your chosen band.'};
const moodOrder:Mood[]=['fresh','warm','elegant','bold'];
const moodFor=(dimension:Dimension,index:number):Mood=>dimension==='occasion'?(['fresh','elegant','warm','bold'] as Mood[])[index]:moodOrder[index%4];
interface Props{dimension:Dimension;value?:string;onChange:(value:string)=>void;error?:boolean;focus?:boolean;direct?:boolean;exiting?:boolean}
export function PreferenceQuestion({dimension,value,onChange,error,focus,direct=false,exiting=false}:Props){
 const id=useId(),legend=useRef<HTMLLegendElement>(null),reduced=useMotionPolicy();
 useEffect(()=>{if(focus||error)legend.current?.focus({preventScroll:true});},[focus,error,dimension,direct]);
 const description=`${id}-hint${direct?` ${id}-action`:''}${error?` ${id}-error`:''}`;
 return <fieldset aria-describedby={description} aria-invalid={error||undefined}>
  <legend ref={legend} tabIndex={-1}>{prompts[dimension]}</legend>
  <p id={`${id}-hint`} className="section-description">{hints[dimension]}</p>
  {direct&&<p id={`${id}-action`} className="action-instruction">{dimension==='budget'?'Choose a budget to see your fragrances.':'Choose an option to continue to the next question.'} Use Back to revisit answers.</p>}
  <div className={`options options-${dimension}`}>{Object.entries(taxonomy[dimension]).map(([key,text],i)=>{
   const mood=moodFor(dimension,i),selected=value===key;
   const movement=reduced?{scale:1,y:0,rotateX:0,opacity:1}:exiting?{scale:selected?1.22:.83,y:selected?-24:35,rotateX:selected?-5:6,opacity:selected?1:.3}:{scale:1,y:0,rotateX:0,opacity:1};
   const tileMotion={initial:reduced?false as const:{scale:1.12,y:38,rotateX:7},animate:movement,transition:{duration:reduced?.1:exiting?.55:.74,delay:reduced||exiting?0:i*.045,ease:cinematicEase},whileHover:reduced||exiting?{}:{y:-8,scale:1.025},whileTap:reduced||exiting?{}:{scale:.94}};
   const content=<>
    <motion.div className="option-photograph" initial={reduced?false:{scale:1.32,x:14}} animate={reduced?{scale:1,x:0}:exiting?{scale:selected?1.3:.95,x:selected?-12:0}:{scale:selected?1.15:1.03,x:selected?-5:0}} transition={{duration:reduced?.1:exiting?.55:1.1,ease:cinematicEase}}><MoodImage mood={mood} priority={dimension==='feeling'}/></motion.div>
    <span className="card-shade" aria-hidden="true"/>
    <span className="option-top" aria-hidden="true"><span>0{i+1}</span>{selected&&<span>Selected</span>}</span>
    <span className="option-copy"><span className="option-title">{text}</span>{dimension==='feeling'&&<span className="option-description" aria-hidden="true">{moodCopy[mood]}</span>}</span>
    <span className="option-indicator" aria-hidden="true"><Icon name={selected?'check':'arrow'}/></span>
   </>;
   return direct?<motion.button {...tileMotion} type="button" className={`option option-action ${selected?'selected':''}`} key={key} disabled={exiting} aria-label={`${selected?'Selected. ':''}Choose ${text} and ${dimension==='budget'?'see fragrances':'continue'}`} aria-describedby={description} onClick={()=>onChange(key)}>{content}</motion.button>:<motion.label {...tileMotion} className={`option ${selected?'selected':''}`} key={key}>
    <input aria-label={text} type="radio" name={id} value={key} checked={selected} disabled={exiting} onChange={()=>onChange(key)}/>{content}
   </motion.label>;
  })}</div>
  {error&&<p className="error" role="alert" id={`${id}-error`}>Choose one answer to continue.</p>}
 </fieldset>;
}

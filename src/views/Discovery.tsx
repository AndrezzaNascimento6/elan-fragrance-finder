import { useState } from 'react';
import { motion } from 'motion/react';
import { PreferenceQuestion } from '../components/PreferenceQuestion';
import { dimensions, type PreferenceSet } from '../domain/types';
import { validPreferences } from '../domain/recommend';
import { useMotionPolicy } from '../motion/MotionProvider';
import { reveal } from '../motion/variants';
export function Discovery({onComplete}:{onComplete:(p:PreferenceSet)=>void}) {
 const [answers,setAnswers]=useState<Partial<PreferenceSet>>({}),[step,setStep]=useState(0),[error,setError]=useState(false),[direction,setDirection]=useState(1);
 const dimension=dimensions[step],reduced=useMotionPolicy();
 function next(){
  if(!answers[dimension]){setError(true);return;}
  setError(false);setDirection(1);
  if(step<4)setStep(step+1);else if(validPreferences(answers))onComplete(answers);
 }
 return <section className="discovery" aria-label="Discover your preferences">
  <h1 className="sr-only">Find your fragrance</h1><div className="question-meta"><span>YOUR SCENT, YOUR WAY</span><p>Question {step+1} of 5</p></div>
  <div className="progress" aria-hidden="true">{dimensions.map((d,i)=><span className={i<=step?'active':''} key={d}/>)}</div>
  <motion.div key={dimension} {...reveal(reduced,direction)}>
   <PreferenceQuestion dimension={dimension} value={answers[dimension]} onChange={value=>{setAnswers({...answers,[dimension]:value});setError(false);}} error={error} focus/>
  </motion.div>
  <nav className="question-nav" aria-label="Question navigation">
   {step>0?<button className="secondary" onClick={()=>{setError(false);setDirection(-1);setStep(step-1);}}>Back</button>:<span/>}
   <button onClick={next}>{step===4?'Find my fragrances':'Continue'}<span aria-hidden="true">↗</span></button>
  </nav>
  <p className="question-footnote">Five preferences. A more personal place to begin.</p>
 </section>;
}

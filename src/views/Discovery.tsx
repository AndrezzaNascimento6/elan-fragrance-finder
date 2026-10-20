import { useRef,useState } from 'react';
import { AnimatePresence,motion,useIsPresent,usePresenceData } from 'motion/react';
import { PreferenceQuestion } from '../components/PreferenceQuestion';
import { Icon } from '../components/Icon';
import { dimensions,type Dimension,type PreferenceSet } from '../domain/types';
import { validPreferences } from '../domain/recommend';
import { useDirectChoice } from '../hooks/useDirectChoice';
import { useMotionPolicy } from '../motion/MotionProvider';
import { questionVariants } from '../motion/variants';
type TransitionData={direction:number;answers:Partial<PreferenceSet>};
interface StageProps{dimension:Dimension;answers:Partial<PreferenceSet>;direction:number;direct:boolean;error:boolean;activeView:boolean;onChoose:(value:string)=>void}
function QuestionStage({dimension,answers,direction,direct,error,activeView,onChoose}:StageProps){
 const localPresence=useIsPresent(),present=localPresence&&activeView,latest=usePresenceData() as TransitionData|undefined,reduced=useMotionPolicy();
 const current=present?answers:latest?.answers??answers;
 return <motion.div className="question-stage" data-present={present} inert={!present} aria-hidden={!present||undefined}
  custom={{direction,answers}} variants={questionVariants(reduced)} initial="enter" animate={activeView?"center":"exit"} exit="exit">
  <PreferenceQuestion dimension={dimension} value={current[dimension]} onChange={value=>{if(present)onChoose(value);}} error={error&&present} focus={present} direct={direct} exiting={!present}/>
 </motion.div>;
}
export function Discovery({onComplete,onHome}:{onComplete:(p:PreferenceSet)=>void;onHome?:()=>void}) {
 const [answers,setAnswers]=useState<Partial<PreferenceSet>>({}),[step,setStep]=useState(0),[error,setError]=useState(false),[direction,setDirection]=useState(1);
 const viewPresent=useIsPresent();
 const activeStep=useRef(0),dimension=dimensions[step],reduced=useMotionPolicy(),direct=useDirectChoice();
 function advance(nextAnswers:Partial<PreferenceSet>){
  if(activeStep.current!==step)return;
  if(!nextAnswers[dimension]){setError(true);return;}
  setError(false);setDirection(1);activeStep.current=step+1;
  if(step<4)setStep(step+1);else if(validPreferences(nextAnswers))onComplete(nextAnswers);
 }
 function choose(value:string){
  if(activeStep.current!==step)return;
  const nextAnswers={...answers,[dimension]:value};setAnswers(nextAnswers);setError(false);
  if(direct)advance(nextAnswers);
 }
 function back(){
  if(step===0){onHome?.();return;}
  setError(false);setDirection(-1);activeStep.current=step-1;setStep(step-1);
 }
 return <section className="discovery" data-direct={direct} aria-label="Discover your preferences">
  <div className="discovery-atmosphere" aria-hidden="true"/>
  <h1 className="sr-only">Find your fragrance</h1>
  <div className="question-meta"><span className="script" aria-hidden="true">A little closer to you</span><p>Question {step+1} of 5</p></div>
  <div className="progress" aria-hidden="true">{dimensions.map((d,i)=><span className={i<=step?'active':''} key={d}><b>0{i+1}</b><motion.i initial={false} animate={{scale:reduced?1:i===step?1.4:1}} transition={{duration:reduced?0:.35}}/><motion.s initial={false} animate={{scaleX:i<step?1:0}} transition={{duration:reduced?.1:.65}}/></span>)}</div>
  <div className="question-frame"><AnimatePresence initial custom={{direction,answers}} mode="sync">
   <QuestionStage key={dimension} dimension={dimension} answers={answers} direction={direction} direct={direct} activeView={viewPresent} onChoose={choose} error={error}/>
  </AnimatePresence></div>
  <nav className="question-nav" aria-label="Question navigation">
   {(step>0||onHome)?<motion.button className="secondary" whileTap={reduced?{}:{scale:.94}} onClick={back}><Icon className="reverse"/>Back</motion.button>:<span/>}
   {!direct&&<motion.button className="primary" whileHover={reduced?{}:{y:-5}} whileTap={reduced?{}:{scale:.94}} onClick={()=>advance(answers)}>{step===4?'Find my fragrances':'Continue'}<Icon/></motion.button>}
  </nav>
  <p className="question-footnote">Five preferences. A more personal place to begin.</p>
 </section>;
}

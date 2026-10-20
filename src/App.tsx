import { useReducer,useRef,useEffect,useState } from 'react';
import { AnimatePresence,motion,useIsPresent } from 'motion/react';
import { CampaignCamera } from './motion/CampaignCamera';
import { ViewStage } from './motion/ViewStage';
import { Introduction } from './views/Introduction';
import { Discovery } from './views/Discovery';
import { Results,ActivePreferences } from './views/Results';
import { loadCatalog } from './data/loadCatalog';
import { recommend } from './domain/recommend';
import { label,dimensions,type PreferenceSet,type RecommendationResult } from './domain/types';
import { MotionProvider,useMotionPolicy } from './motion/MotionProvider';
import './styles/app.css';
type Result=Exclude<RecommendationResult,{status:'invalid-preferences'}>;
type State={view:'intro'|'questions'|'processing'|'results'|'error';applied:PreferenceSet|null;requestId:number;catalogRevision:number;result:Result|null;error:string;lastSuccess:Result|null;editor:null;detail:null};
type Action={type:'home';id:number}|{type:'start'}|{type:'request';id:number;preferences:PreferenceSet}|{type:'resolve';id:number;result:Result}|{type:'reject';id:number;message:string};
const initial:State={view:'intro',applied:null,requestId:0,catalogRevision:0,result:null,error:'',lastSuccess:null,editor:null,detail:null};
export function visitReducer(state:State,action:Action):State {
 switch(action.type){
  case 'home':return {...initial,requestId:action.id};
  case 'start':return {...state,view:'questions'};
  case 'request':return {...state,view:'processing',applied:{...action.preferences},requestId:action.id,result:null,error:''};
  case 'resolve':return action.id!==state.requestId?state:{...state,view:'results',result:action.result,lastSuccess:action.result,catalogRevision:state.catalogRevision+1};
  case 'reject':return action.id!==state.requestId?state:{...state,view:'error',error:action.message,result:null};
 }
}
function PendingAtmosphere({preferences}:{preferences:PreferenceSet}) {
 const policy=useMotionPolicy(),present=useIsPresent(),reduced=policy||!present,[visible,setVisible]=useState(!document.hidden);
 useEffect(()=>{const change=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change);},[]);
 return <div className="pending-atmosphere" aria-hidden="true"><motion.div className="scent-orbit" animate={reduced||!visible?{rotate:0}:{rotate:360}} transition={reduced||!visible?{duration:0}:{duration:8,repeat:Infinity,ease:"linear"}}><i/><i/><i/></motion.div><div className="pending-words">{dimensions.slice(0,4).map((d,i)=><motion.span key={d} initial={false} animate={reduced||!visible?{y:0}:{y:[0,-7,0]}} transition={reduced||!visible?{duration:0}:{duration:2.4,delay:i*.15,repeat:Infinity,ease:'easeInOut'}}>{label(d,preferences[d])}</motion.span>)}</div></div>;
}
function Finder(){
 const [state,dispatch]=useReducer(visitReducer,initial),sequence=useRef(0),main=useRef<HTMLElement>(null),mounted=useRef(false);
 const reduced=useMotionPolicy();
 const [visit,setVisit]=useState(0);
 function home(){
  const id=++sequence.current;setVisit(v=>v+1);dispatch({type:'home',id});
  window.history.replaceState(null,'','#home');
  window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});
 }
 function start(){dispatch({type:'start'});window.scrollTo({top:0,behavior:'instant'});}
 useEffect(()=>{
  if(!mounted.current){mounted.current=true;return;}
  if(state.view!=='questions') main.current?.querySelector<HTMLElement>('.view-stage[data-present="true"] [data-view-heading]')?.focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'instant'});
 },[state.view,visit]);
 useEffect(()=>()=>{sequence.current++;},[]);
 async function run(preferences:PreferenceSet){
  const id=++sequence.current,snapshot={...preferences};dispatch({type:'request',id,preferences:snapshot});
  try { const catalog=await loadCatalog();if(id!==sequence.current)return;const result=recommend(catalog,snapshot);if(result.status==='invalid-preferences')throw Error(result.message);dispatch({type:'resolve',id,result}); }
  catch(error){if(id===sequence.current)dispatch({type:'reject',id,message:error instanceof Error?error.message:'The catalog is unavailable. Please retry.'});}
 }
 return <div className={`app-shell is-${state.view}`}><CampaignCamera view={state.view}/><a className="skip-link" href="#main">Skip to content</a>
  <header className="site-header">
   <motion.a className="wordmark" href="#home" aria-label="Élan — Home" onClick={e=>{e.preventDefault();home();}} whileHover={reduced?{}:{y:-2}} whileTap={reduced?{}:{scale:.94}}>ÉLAN</motion.a>
   {state.view==='intro'?<nav className="brand-nav" aria-label="Élan navigation"><a href="#feeling-preview">The collection</a><button onClick={start}>Discover</button><a href="#approach">Our approach</a></nav>:<span className="header-description">THE ART OF FINDING YOU</span>}
   <span className="header-edition">FRAGRANCE FINDER <i aria-hidden="true"/></span>
  </header>
  <main tabIndex={-1} id="main" ref={main} aria-busy={state.view==='processing'}>
   <div className="view-frame"><AnimatePresence initial={false} mode="sync"><ViewStage key={`${state.view}-${visit}`} view={state.view}>
   {state.view==='intro'&&<Introduction onStart={start}/>}
   {state.view==='questions'&&<Discovery onComplete={p=>void run(p)} onHome={home}/>}
   {state.view==='processing'&&<section className="terminal"><p className="eyebrow">YOUR PREFERENCES, CONSIDERED</p><h1 tabIndex={-1} data-view-heading>Finding your edit</h1><p>Loading the catalog and comparing your preferences.</p>{state.applied&&<PendingAtmosphere preferences={state.applied}/>}{state.applied&&<ActivePreferences preferences={state.applied}/>}</section>}
   {state.view==='results'&&state.result&&state.applied&&<Results result={state.result} preferences={state.applied}/>}
   {state.view==='error'&&<section className="terminal"><p className="eyebrow">LET’S TRY THAT AGAIN</p><h1 tabIndex={-1} data-view-heading>A moment to reconnect</h1><p role="alert">{state.error}</p><button onClick={()=>state.applied&&void run(state.applied)}>Retry</button>{state.applied&&<ActivePreferences preferences={state.applied}/>}</section>}
   </ViewStage></AnimatePresence></div>
  </main>
  <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{state.view==='processing'?'Finding fragrances for your current preferences.':state.view==='results'?`${state.result?.recommendations.length??0} fragrance recommendations ready.`:''}</div>
  <footer className="site-footer"><span>ÉLAN — A FICTIONAL FRAGRANCE EXPERIENCE</span><span>Made of small discoveries.</span></footer></div>;
}

export default function App(){return <MotionProvider><Finder/></MotionProvider>;}

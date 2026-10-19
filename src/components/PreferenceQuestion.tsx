import { useId, useRef, useEffect } from 'react';
import { taxonomy, type Dimension } from '../domain/types';
export const prompts: Record<Dimension,string>={ feeling:'How do you want to feel?', occasion:'What’s the occasion?', category:'Which notes draw you in?', intensity:'How much presence?', budget:'What’s your budget?' };
export const hints: Record<Dimension,string>={ feeling:'A feeling is a beautiful place to begin.',occasion:'For the moments you want to make your own.',category:'Follow your curiosity. No expertise needed.',intensity:'Choose the kind of impression you prefer.',budget:'We’ll keep every suggestion within your chosen band.' };
interface Props { dimension:Dimension; value?:string; onChange:(value:string)=>void; error?:boolean; focus?:boolean }
export function PreferenceQuestion({dimension,value,onChange,error,focus}:Props) {
 const id=useId(),legend=useRef<HTMLLegendElement>(null);
 useEffect(()=>{if(focus||error)legend.current?.focus();},[focus,error,dimension]);
 return <fieldset aria-describedby={`${id}-hint${error?` ${id}-error`:''}`} aria-invalid={error||undefined}>
  <legend ref={legend} tabIndex={-1}>{prompts[dimension]}</legend>
  <p id={`${id}-hint`} className="muted">{hints[dimension]}</p>
  <div className="options">{Object.entries(taxonomy[dimension]).map(([key,text],i)=><label className={`option ${value===key?'selected':''}`} key={key}>
   <input type="radio" name={id} value={key} checked={value===key} onChange={()=>onChange(key)}/>
   <span className="option-number" aria-hidden="true">0{i+1}</span><span>{text}</span><span className="selection" aria-hidden="true">{value===key?'✓':'+'}</span>
  </label>)}</div>
  {error&&<p className="error" role="alert" id={`${id}-error`}>Choose one answer to continue.</p>}
 </fieldset>;
}

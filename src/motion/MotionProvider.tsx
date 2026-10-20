import { MotionConfig, useReducedMotion } from 'motion/react';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
const ReducedContext=createContext(false);
export const useMotionPolicy=()=>useContext(ReducedContext);
export function MotionProvider({children}:PropsWithChildren) {
 const initialPreference=useReducedMotion();
 const [reduced,setReduced]=useState(!!initialPreference);
 const [hidden,setHidden]=useState(document.hidden);
 useEffect(()=>{
  // The installed Motion hook reads its initial preference only. Subscribe as
  // well so a setting changed during the visit immediately reaches variants.
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const preferenceChanged=()=>setReduced(media.matches);
  const visibilityChanged=()=>setHidden(document.hidden);
  preferenceChanged();
  media.addEventListener('change',preferenceChanged);
  document.addEventListener('visibilitychange',visibilityChanged);
  return()=>{
   media.removeEventListener('change',preferenceChanged);
   document.removeEventListener('visibilitychange',visibilityChanged);
  };
 },[]);
 return <MotionConfig reducedMotion={reduced||hidden?'always':'user'}><ReducedContext.Provider value={reduced||hidden}>{children}</ReducedContext.Provider></MotionConfig>;
}

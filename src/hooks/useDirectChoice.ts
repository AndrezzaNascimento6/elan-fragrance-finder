import { useEffect, useState } from 'react';

// Narrow layouts and touch-first landscape devices use explicit action buttons.
const query = '(max-width: 700px), (hover: none) and (pointer: coarse)';
export function useDirectChoice() {
 const [direct,setDirect]=useState(()=>window.matchMedia(query).matches);
 useEffect(()=>{
  const media=window.matchMedia(query);
  const changed=()=>setDirect(media.matches);
  changed();media.addEventListener('change',changed);
  return()=>media.removeEventListener('change',changed);
 },[]);
 return direct;
}

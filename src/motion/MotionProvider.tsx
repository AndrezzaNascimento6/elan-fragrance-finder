import { MotionConfig, useReducedMotion } from 'motion/react';
import { createContext, useContext, type PropsWithChildren } from 'react';
const ReducedContext=createContext(false);
export const useMotionPolicy=()=>useContext(ReducedContext);
export function MotionProvider({children}:PropsWithChildren) {
 const reduced=!!useReducedMotion();
 return <MotionConfig reducedMotion="user"><ReducedContext.Provider value={reduced}>{children}</ReducedContext.Provider></MotionConfig>;
}

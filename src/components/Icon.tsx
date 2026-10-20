import type { CSSProperties } from 'react';

type IconName = 'arrow' | 'chevron' | 'check' | 'difference' | 'unknown';
export function Icon({name='arrow',className='',style}:{name?:IconName;className?:string;style?:CSSProperties}) {
 const paths:Record<IconName,string>={
  arrow:'M4 12h16m-6-6 6 6-6 6',
  chevron:'m7 10 5 5 5-5',
  check:'m5 12 4 4L19 6',
  difference:'M5 12h14',
  unknown:'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 4v.1',
 };
 return <svg className={`icon ${className}`} style={style} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]}/></svg>;
}

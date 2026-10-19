export const reveal = (reduced: boolean, direction = 1) => ({
 initial: reduced ? {opacity:1} : {opacity:1,y:12*direction},
 animate: {opacity:1,y:0,transition:{duration:reduced?.1:.28}},
});
export const bottleReveal = (reduced: boolean) => ({
 initial: reduced ? {opacity:1} : {opacity:.6,y:18},
 animate: {opacity:1,y:0,transition:{duration:reduced?.1:.6}},
});

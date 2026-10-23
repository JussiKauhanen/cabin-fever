"use strict";
/* Boot: scale the canvas to the window, build levels, run the frame loop. */
function fit(){const aw=innerWidth-32,ah=innerHeight-24;let s=Math.min(aw/W,ah/H);s=s>=1?Math.floor(s):Math.max(.5,s);cv.style.width=Math.round(W*s)+'px';cv.style.height=Math.round(H*s)+'px';}
addEventListener('resize',fit);fit();
buildGeo();
let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;S.clock+=dt;try{update(dt);draw();}catch(err){console.error(err);}seqTick();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
setTimeout(()=>{try{cv.focus();}catch(e){}},50);

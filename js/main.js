"use strict";
/* Boot: scale the canvas to the window, build levels, run the frame loop. */
function fit(){layoutMobile();} // mobile: screen + control layout and scaling live in touch.js
addEventListener('resize',fit);fit();
buildGeo();
let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;S.clock+=dt;try{update(dt);draw();syncTouch();}catch(err){console.error(err);}seqTick();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
setTimeout(()=>{try{cv.focus();}catch(e){}},50);

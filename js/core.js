"use strict";
/* Constants, canvas, pixel drawing helpers (R, disc, ell), random + colour utils. */
const W=320,H=240,T=16,COLS=20,ROWS=14,OY=16; // internal resolution, tile size, grid, HUD height
const cv=document.getElementById('g'); const ctx=cv.getContext('2d'); ctx.imageSmoothingEnabled=false;
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return [c,x];}
let G=ctx;
function R(x,y,w,h,c){G.fillStyle=c;G.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function disc(cx,cy,r,c){G.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);const rr=Math.floor(r);for(let dy=-rr;dy<=rr;dy++){const w=Math.floor(Math.sqrt(Math.max(0,r*r-dy*dy+r*.6)));G.fillRect(cx-w,cy+dy,2*w+1,1);}}
function ell(cx,cy,rx,ry,c){G.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);const rr=Math.floor(ry);for(let dy=-rr;dy<=rr;dy++){const w=Math.floor(rx*Math.sqrt(Math.max(0,1-(dy*dy)/(ry*ry+.6))));G.fillRect(cx-w,cy+dy,2*w+1,1);}}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hx(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
function mix(a,b,t){const A=hx(a),B=hx(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')';}
function ss(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);}
const pick=a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

"use strict";
/* Global game state (S), per-level state (L) and level setup. */
const S={mode:'title',t:0,clock:0,page:0,pageT:0,level:0,zombies:1,score:0,stats:null,scores:loadScores(),entry:null,lastIdx:-1,card:null,won:false,prev:null,cp:-1,cpScore:0,lvScore:0}; // cp = level of the last checkpoint found, -1 = none
let L=null;
const keys={};
const tkeys={}; // mobile: directions held on the touch stick
const down=k=>!!keys[k]||!!tkeys[k];
// DEV SHORTCUT (remove before release): index.html?level=5 starts new games and restarts on that level.
const URL_LEVEL=typeof location==='object'?parseInt(new URLSearchParams(location.search).get('level'),10):NaN;
function startGame(){S.score=0;S.zombies=1;S.level=Math.max(0,Math.min(LEVELS.length-1,(URL_LEVEL||CFG.startLevel||1)-1));S.won=false;S.stats={mags:0,lines:0,caught:0,esc:0,reached:'L1'};S.lastIdx=-1;S.cp=-1;toIntro(false);}
function toIntro(recap){if(!recap)S.lvScore=S.score;setupLevel();L.recap=recap;S.mode='intro';S.t=0;}
function newZombie(x,y,i){return {x,y,dir:0,anim:0,spd:CFG.zombieSpeed+i*1.5+Math.random()*4,pukeT:3+Math.random()*3+i*.8,puke:0,puked:false,read:0,readK:1,bubbleT:1.5+Math.random()*3+i*1.4,say:'',sayT:0,lure:null,still:0};}
function setupLevel(){
  const d=LEVELS[S.level],g=GEO[S.level];
  L={d,g,solid:g.solid.map(r=>r.slice()),time:0,open:false,grace:1.6,
     p:{x:d.start[0]*16,y:d.start[1]*16,vx:0,vy:0,dir:1,anim:0,mags:CFG.magsStart,mic:false,slip:0,wasOn:false,zombie:false},
     zs:[],puddles:[],items:[],projs:[],mushrooms:[],parts:[],floats:[],smoke:[],vibe:0,stashT:3,micT:14,smokeT:0,banner:null,fields:{},rap:null,bonus:0,
     grannySaved:false,grannyBonus:0,recap:false};
  for(const [c,r] of g.doors)L.solid[r][c]=true;
  if(d.setup)d.setup();
  if(d.waves)startWaves(d); // new levels: zombies and guests arrive in waves through the night (enemies.js)
  else for(let i=0;i<S.zombies;i++){const s=d.zs[i%d.zs.length];L.zs.push(newZombie(s[0]*16,s[1]*16,i));}
  if(d.cp&&S.cp!==S.level)L.items.push({type:'cp',x:d.cp[0],y:d.cp[1],t:0}); // the level's hidden checkpoint
  S.stats.reached='L'+(S.level+1);
}

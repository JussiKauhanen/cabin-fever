"use strict";
/* Global game state (S), per-level state (L) and level setup. */
const S={mode:'title',t:0,clock:0,page:0,pageT:0,level:0,zombies:1,score:0,stats:null,scores:loadScores(),entry:null,lastIdx:-1,card:null,won:false,prev:null};
let L=null;
const keys={};
const down=k=>!!keys[k];
function startGame(){S.score=0;S.zombies=1;S.level=0;S.won=false;S.stats={mags:0,lines:0,caught:0,esc:0,reached:'L1'};S.lastIdx=-1;toIntro(false);}
function toIntro(recap){setupLevel();L.recap=recap;S.mode='intro';S.t=0;}
function newZombie(x,y,i){return {x,y,dir:0,anim:0,spd:CFG.zombieSpeed+i*1.5+Math.random()*4,pukeT:3+Math.random()*3+i*.8,puke:0,puked:false,read:0,readK:1,bubbleT:1.5+Math.random()*3+i*1.4,say:'',sayT:0,lure:null,still:0};}
function setupLevel(){
  const d=LEVELS[S.level],g=GEO[S.level];
  L={d,g,solid:g.solid.map(r=>r.slice()),time:0,open:false,grace:1.6,
     p:{x:d.start[0]*16,y:d.start[1]*16,vx:0,vy:0,dir:1,anim:0,mags:CFG.magsStart,mic:false,slip:0,wasOn:false,zombie:false},
     zs:[],puddles:[],items:[],projs:[],parts:[],floats:[],smoke:[],vibe:0,stashT:3,micT:14,smokeT:0,banner:null,fields:{},rap:null,bonus:0,recap:false};
  for(const [c,r] of g.doors)L.solid[r][c]=true;
  for(let i=0;i<S.zombies;i++){const s=d.zs[i%d.zs.length];L.zs.push(newZombie(s[0]*16,s[1]*16,i));}
  S.stats.reached='L'+(S.level+1);
}

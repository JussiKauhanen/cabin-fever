"use strict";
/* The metro platform's own rules (hooked in through LEVELS: setup, tick, escape). Trains rush through every few seconds after
   a warning; anyone on that track gets hit (the inspector is only grazed). Zombies come back from the tunnel later, the player counts as caught.
   An announcer chimes in now and then. At 6:00 AM the first train stops on track 2 and its doors are the exit. */
const ST_TRACKS=[96,128];          // top y of track 1 (trains run right) and track 2 (trains run left), 32 px each
const TRAIN_LEN=304,TRAIN_DOORS=[40,110,194,264]; // door centres from the train's left end
function onTrack(e,k){const top=ST_TRACKS[k];return e.y>top+2&&e.y<top+34;}
function stationTrains(){const st=L.station;return st.final?st.trains.concat([st.final]):st.trains;}
function setupStation(){L.station={trains:[],nextT:CFG.trainFirst,last:1,back:[],final:null,annT:CFG.announceEvery*.6,ann:shuffle(ANNOUNCE.slice())};}
function newTrain(k,final){const dir=k?-1:1;
  return {k,dir,x:dir>0?-TRAIN_LEN-30:350,spd:final?260:CFG.trainSpeed,warn:final?1.8:CFG.trainWarn,bellT:0,final:!!final,stopped:false,openT:0,open:false};}
function stationTick(dt){const st=L.station;
  for(const b of st.back){b.t-=dt;if(b.t<=0)trainReturn(b.z);}st.back=st.back.filter(b=>b.t>0);
  st.annT-=dt;if(st.annT<=0&&!L.banner&&!L.open){st.annT=CFG.announceEvery;if(!st.ann.length)st.ann=shuffle(ANNOUNCE.slice());
    const soon=L.d.night-L.time<20;L.banner={a:'ANNOUNCEMENT',b:soon?'THE FIRST TRAIN ARRIVES AT 6:00 AM ON TRACK 2.':st.ann.pop(),c:'',t:4.5};SFX.chime();}
  if(!L.open){st.nextT-=dt;if(st.nextT<=0){st.nextT=CFG.trainEvery[0]+Math.random()*(CFG.trainEvery[1]-CFG.trainEvery[0]);
    st.last=Math.random()<.7?1-st.last:st.last;st.trains.push(newTrain(st.last));}}
  else if(!st.final&&!st.trains.length)st.final=newTrain(1,true);   // the first train waits for the last night train to clear
  for(const tr of stationTrains()){
    if(tr.warn>0){tr.warn-=dt;tr.bellT-=dt;if(tr.bellT<=0){tr.bellT=.45;SFX.bell();}if(tr.warn<=0)SFX.train();continue;}
    if(tr.final){finalTrain(tr,dt);if(S.mode!=='play')return;continue;}
    tr.x+=tr.dir*tr.spd*dt;trainHits(tr);if(S.mode!=='play')return;
    if(tr.dir>0?tr.x>340:tr.x<-TRAIN_LEN-40)tr.gone=true;}
  st.trains=st.trains.filter(tr=>!tr.gone);
}
function finalTrain(tr,dt){
  if(!tr.stopped){const v=Math.max(30,Math.min(tr.spd,(tr.x-8)*1.6));tr.x=Math.max(8,tr.x-v*dt);trainHits(tr);
    if(tr.x<=8){tr.stopped=true;tr.openT=.8;for(const r of [8,9])for(let c=0;c<COLS;c++)L.solid[r][c]=true;L.fields={};}return;}
  if(!tr.open){tr.openT-=dt;if(tr.openT<=0){tr.open=true;SFX.doors();floater(160,150,'DOORS OPEN! GET ON!','#f8c840');}}
}
function trainHits(tr){const x0=tr.x-4,x1=tr.x+TRAIN_LEN+4,p=L.p;
  if(onTrack(p,tr.k)&&p.x>x0&&p.x<x1){caught({k:'train'});return;}
  for(const z of L.zs.slice())if(onTrack(z,tr.k)&&z.x>x0&&z.x<x1)trainHit(z,tr);}
function trainHit(z,tr){
  if(z.k&&FOES[z.k].grazed){trainGraze(z,tr);return;}
  L.zs.splice(L.zs.indexOf(z),1);z.lure=null;z.wander=null;z.read=0;z.busy=0;
  for(let k=0;k<14;k++)L.parts.push({x:z.x,y:z.y,z:8,vx:tr.dir*(60+Math.random()*90),vy:(Math.random()-.5)*50,vz:30+Math.random()*50,t:.8,col:pick(['#9dbb6c','#6f8f4c','#3e8f8c','#d8dc5a'])});
  S.score+=CFG.trainHitPoints;floater(z.x,z.y-24,'+'+CFG.trainHitPoints+' MIND THE GAP!','#9dbb6c');SFX.splat();
  L.station.back.push({z,t:CFG.trainReturn});}
/* only grazed: thrown onto the platform next to that track, dizzy for a moment, no points */
function trainGraze(z,tr){z.y=tr.k?166:92;z.x=Math.max(24,Math.min(296,z.x+tr.dir*14));z.lure=null;z.wander=null;z.read=0;z.busy=0;
  z.dizzy=CFG.inspectorDizzy;z.say=pick(FOEQ.inspector.dizzy);z.sayT=2.5;z.bubbleT=Math.max(z.bubbleT,z.dizzy+1);
  for(let k=0;k<8;k++)L.parts.push({x:z.x,y:z.y,z:10,vx:tr.dir*(30+Math.random()*50),vy:(Math.random()-.5)*30,vz:20+Math.random()*30,t:.6,col:pick(['#2a3a6a','#f8c840','#c8c0b0'])});
  floater(z.x,z.y-26,'GRAZED!','#5ad8f8');SFX.slip();}
/* back from the tunnel at the platform end farthest from the player */
function trainReturn(z){let best=null,bd=-1;
  for(const s of L.d.zs){const x=s[0]*16,y=s[1]*16,d=Math.hypot(x-L.p.x,y-L.p.y);if(d>bd){bd=d;best=[x,y];}}
  z.x=best[0];z.y=best[1];z.still=0;L.zs.push(z);
  for(let k=0;k<8;k++)L.parts.push({x:z.x+(Math.random()-.5)*12,y:z.y,z:4,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*10,vz:20+Math.random()*30,t:.6,col:pick(['#c8c0b0','#8a8a9a'])});
  floater(z.x,z.y-26,'BACK FROM THE TUNNEL!',z.k?'#f8c840':'#9dbb6c');(z.k?FOES[z.k].voice:SFX.grumble)();}
/* the open doors of the stopped first train, reached from the lower platform */
function stationEscape(p){const f=L.station&&L.station.final;
  return !!(f&&f.open&&p.y<=171&&TRAIN_DOORS.some(dx=>Math.abs(p.x-(f.x+dx))<9));}

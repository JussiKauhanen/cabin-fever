"use strict";
/* Per-frame game logic: player, zombies, puke, items, magazines, rap battle, getting caught. */
function update(dt){
  S.t+=dt;
  const m=S.mode;
  music(m==='title'||m==='entry'||m==='scores'?'title':m==='rap'?'rap':(m==='play'||m==='intro'||m==='pause')?'night':null);
  if(m==='title'){S.pageT+=dt;if(S.pageT>7){S.pageT=0;S.page=(S.page+1)%3;}return;}
  if(m==='intro'){if(S.t>(L.zs.some(z=>z.k==='granny')?CFG.grannyIntroTime:3.2)){S.mode='play';S.t=0;}return;}
  if(m==='play')updPlay(dt);
  else if(m==='rap')updRap(dt);
  else if(m==='caught')updCaught(dt);
  if(L&&(m==='play'||m==='rap'||m==='caught'||m==='clear')){updFx(dt);}
}
function updFx(dt){
  for(const p of L.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=(p.g==null?240:p.g)*dt;p.t-=dt;}
  L.parts=L.parts.filter(p=>p.t>0&&p.z>-1);
  for(const f of L.floats){f.t-=dt;f.y-=14*dt;}L.floats=L.floats.filter(f=>f.t>0);
  if(L.g.smoke){L.smokeT-=dt;if(L.smokeT<=0){L.smokeT=.5;L.smoke.push({x:L.g.smoke[0],y:L.g.smoke[1],r:2,t:3});}for(const s of L.smoke){s.t-=dt;s.y-=8*dt;s.x+=4*dt;s.r+=dt*.8;}L.smoke=L.smoke.filter(s=>s.t>0);}
  if(L.banner){L.banner.t-=dt;if(L.banner.t<=0)L.banner=null;}
}
function updPlay(dt){
  const p=L.p,d=L.d;
  L.time+=dt;if(L.grace>0)L.grace-=dt;else S.score+=10*dt;
  if(!L.open&&L.time>=d.night){L.open=true;for(const [c,r] of L.g.doors)L.solid[r][c]=false;L.fields={};SFX.sun();
    const granny=L.zs.find(z=>z.k==='granny'&&z.grannyState==='healthy');
    if(granny){L.grannySaved=true;L.grannyBonus=CFG.grannySafeBonus;S.score+=L.grannyBonus;
      granny.say="YOU'RE A DEAR!";granny.sayT=3;floater(granny.x,granny.y-26,'+'+L.grannyBonus+' GRANNY SAVED!','#9dbb6c');}
    L.banner={a:'6:00 AM - SUNRISE!',b:d.why[0],c:L.grannySaved?'GRANNY SAVED! +'+L.grannyBonus:d.why[1],t:5.5};}
  if(L.pending&&L.pending.length)waveTick(); // new levels: the next wave arrives
  // input
  let ix=(down('arrowright')||down('d')?1:0)-(down('arrowleft')||down('a')?1:0),iy=(down('arrowdown')||down('s')?1:0)-(down('arrowup')||down('w')?1:0);
  if(ix&&iy){ix*=.7071;iy*=.7071;}
  if(ix||iy){if(Math.abs(ix)>Math.abs(iy))p.dir=ix>0?2:3;else p.dir=iy>0?0:1;}
  const on=onPuddle(p.x,p.y);
  if(on&&!p.wasOn){p.slip=CFG.slipTime;floater(p.x,p.y-20,'SLIP!','#d8dc5a');SFX.slip();}
  p.wasOn=on;
  let spd=CFG.playerSpeed;if(p.slip>0){spd*=.3;p.slip-=dt;}else if(on)spd*=.5;
  const tr=on||p.slip>0?3:18;
  p.vx+=(ix*spd-p.vx)*Math.min(1,tr*dt);p.vy+=(iy*spd-p.vy)*Math.min(1,tr*dt);
  const mv=moveEnt(p,p.vx*dt,p.vy*dt);p.anim+=mv*.13;if(!ix&&!iy&&mv<.05)p.anim=0;
  // escape
  if(L.open&&p.y>216){const bonus=CFG.escapeBonus*(S.level+1)*S.zombies;S.score+=bonus;L.bonus=bonus;S.stats.esc++;S.stats.reached=S.level===LEVELS.length-1?'ESC':'L'+(S.level+2);S.mode='clear';S.t=0;SFX.win();return;}
  // items
  L.stashT-=dt;if(L.stashT<=0){L.stashT=CFG.stashEvery;if(L.items.filter(i=>i.type==='stash').length<2){const s=freeSpot(70);if(s)L.items.push({type:'stash',x:s.x,y:s.y,t:0});}}
  L.micT-=dt;if(L.micT<=0){L.micT=8;if(!p.mic&&!L.items.some(i=>i.type==='mic')){const s=freeSpot(80);if(s){L.items.push({type:'mic',x:s.x,y:s.y,t:0});L.micT=CFG.micEvery;}}}
  for(const it of L.items){it.t+=dt;if(it.type==='lure'){it.life-=dt;continue;}
    if(Math.hypot(it.x-p.x,it.y-p.y)<11){it.gone=true;
      if(it.type==='stash'){const n=Math.min(CFG.magsMax,p.mags+CFG.magsPerStash)-p.mags;p.mags+=n;S.score+=25;floater(it.x,it.y-14,'+'+(n||0)+' ART & DANCE MAGS','#f0a0c8');SFX.pick();}
      else if(it.type==='cp')gotCheckpoint(it);
      else{p.mic=true;floater(it.x,it.y-14,KT('MIC! PRESS R TO RAP','MIC! TAP THE RAP BUTTON'),'#d8dc5a');SFX.mic();}}}
  L.items=L.items.filter(i=>!i.gone&&!(i.type==='lure'&&i.life<=0));
  // projectiles
  for(const pr of L.projs){const nx=pr.x+pr.vx*dt,ny=pr.y+pr.vy*dt;pr.t-=dt;pr.spin+=dt*20;
    const hitZ=L.zs.find(z=>canReadMag(z)&&z.read<=0&&Math.hypot(z.x-nx,z.y-ny)<11);
    if(hitZ){pr.done=true;startRead(hitZ);S.score+=50;floater(hitZ.x,hitZ.y-26,'+50 BOOKWORMED!','#3ac0d0');SFX.hit();continue;}
    if(boxHits(nx,ny,2,2)||pr.t<=0){pr.done=true;const lure={type:'lure',x:pr.x,y:pr.y,t:0,life:12,k:pr.k};L.items.push(lure);
      let best=null,bd=1e9;for(const z of L.zs){if(z.read>0||!canReadMag(z))continue;const dd=Math.hypot(z.x-lure.x,z.y-lure.y);if(dd<bd){bd=dd;best=z;}}if(best)best.lure=lure;continue;}
    pr.x=nx;pr.y=ny;}
  L.projs=L.projs.filter(p=>!p.done);
  if(L.vibe>0){L.vibe-=dt;if(Math.random()<dt*3){const z=pick(L.zs);L.parts.push({x:z.x+(Math.random()*10-5),y:z.y,z:22,vx:0,vy:0,vz:18,g:0,t:1.2,note:1,col:pick(['#d8dc5a','#f0a0c8','#3ac0d0'])});}}
  // zombies
  for(const z of L.zs)updZombie(z,dt);
  checkGrannyInfection(); // check touching before separation pushes the actors apart
  for(let i=0;i<L.zs.length;i++)for(let j=i+1;j<L.zs.length;j++){const a=L.zs[i],b=L.zs[j];const dx=b.x-a.x,dy=b.y-a.y,dd=Math.hypot(dx,dy);if(dd<10&&dd>0){const push=(10-dd)/2/dd;moveEnt(a,-dx*push,-dy*push);moveEnt(b,dx*push,dy*push);}}
  updMushrooms(dt);
  // puddles
  for(const pd of L.puddles)pd.t-=dt;L.puddles=L.puddles.filter(pd=>pd.t>0);
  // caught?
  if(L.grace<=0&&L.vibe<=0)for(const z of L.zs){if(z.read>0||z.calm)continue;if(Math.hypot(z.x-p.x,z.y-p.y)<(z.cr||9)){caught(z);break;}}
}
function canReadMag(z){return z.k!=='granny'||z.grannyState==='infected';}
function startRead(z){if(!canReadMag(z))return;z.read=CFG.readTime;z.readK=1+Math.floor(Math.random()*2);z.lure=null;z.say=pick(READQ);z.sayT=3.5;S.stats.mags++;if(z.k)foeRead(z);}
function updMushrooms(dt){
  if(L.grace>0||L.vibe>0)return;
  for(const m of L.mushrooms){const travel=Math.max(0,Math.min(dt,m.t));m.t-=travel;m.age+=travel;let hitPlayer=false;
    // Small movement steps keep fast mushrooms from crossing a wall or skipping the player.
    const steps=Math.max(1,Math.ceil(Math.hypot(m.vx,m.vy)*travel/3));
    for(let i=0;i<steps;i++){const nx=m.x+m.vx*travel/steps,ny=m.y+m.vy*travel/steps;
      if(boxHits(nx,ny,2,2)){m.done=true;break;}
      m.x=nx;m.y=ny;
      if(Math.hypot(m.x-L.p.x,m.y-L.p.y)<8){m.done=true;hitPlayer=true;L.p.slip=Math.max(L.p.slip,CFG.slipTime);
        floater(L.p.x,L.p.y-20,'SLIP!','#f8c840');SFX.slip();break;}}
    if(m.t<=0)m.done=true;
    if(m.done){spawnMushroomBits(m.x,m.y);if(hitPlayer)L.p.wasOn=onPuddle(L.p.x,L.p.y);}}
  L.mushrooms=L.mushrooms.filter(m=>!m.done);
}
function spawnMushroomBits(x,y){if(boxHits(x,y,2,2))return;const chunks=[[0,0]];
  for(let i=0;i<6;i++){const dx=Math.round((Math.random()-.5)*10),dy=Math.round((Math.random()-.5)*6);
    if(!solidAt(x+dx,y+dy))chunks.push([dx,dy]);}
  L.puddles.push({x,y,mushroom:true,t:CFG.mushroomBitsLife,blobs:[[0,0,6,4]],chunks});}
function updZombie(z,dt){
  if(z.k){updFoe(z,dt);return;} // new levels: guests move their own way (enemies.js)
  z.bubbleT-=dt;if(z.sayT>0)z.sayT-=dt;
  if(z.bubbleT<=0){z.bubbleT=6+Math.random()*7;if(z.read<=0&&L.vibe<=0){z.say=pick(QUOTES);z.sayT=3.4;SFX.grumble();}}
  if(L.grace>0||L.vibe>0)return;
  if(z.read>0){z.read-=dt;z.dir=0;return;}
  if(z.puke>0){z.puke-=dt;const [vx,vy]=dirVec(z.dir);
    for(let k=0;k<3;k++)L.parts.push({x:z.x+vx*4,y:z.y+(vy>0?2:0),z:9,vx:vx*55+(Math.random()-.5)*40,vy:vy*40+(Math.random()-.5)*30,vz:20+Math.random()*30,t:1,col:pick(['#b8c43a','#d8dc5a','#8a9a2a','#e0e46a'])});
    if(z.puke<=.2&&!z.puked){z.puked=true;spawnPuddle(z.x+vx*9,z.y+vy*6+1);}return;}
  z.pukeT-=dt;if(z.pukeT<=0){z.puke=.75;z.puked=false;z.pukeT=CFG.pukeEvery[0]+Math.random()*(CFG.pukeEvery[1]-CFG.pukeEvery[0]);SFX.puke();return;}
  let tx=L.p.x,ty=L.p.y;
  if(z.lure&&L.items.includes(z.lure)){tx=z.lure.x;ty=z.lure.y;}else z.lure=null;
  for(const it of L.items){if(it.type==='lure'&&Math.hypot(it.x-z.x,it.y-z.y)<10){it.life=0;it.gone=true;startRead(z);z.readK=it.k||1;return;}}
  const [sx,sy]=steer(z,tx,ty);const spd=z.spd*(1+CFG.zombieSpeedupAtDawn*Math.min(1,L.time/L.d.night));
  const mv=moveEnt(z,sx*spd*dt,sy*spd*dt);z.anim+=mv*.1;
  if(Math.abs(sx)>Math.abs(sy))z.dir=sx>0?2:3;else z.dir=sy>0?0:1;
  if(mv<.05){z.still+=dt;if(z.still>.6){moveEnt(z,(Math.random()-.5)*6,(Math.random()-.5)*6);z.still=0;}}else z.still=0;
}
function spawnPuddle(x,y,beer){const blobs=[[0,0,9,5]];const n=3+Math.floor(Math.random()*3);for(let i=0;i<n;i++)blobs.push([(Math.random()-.5)*14,(Math.random()-.5)*7,3+Math.random()*4,2+Math.random()*2]);
  L.puddles.push({x,y,beer:!!beer,t:CFG.puddleLife,blobs,chunks:[...Array(4)].map(()=>[(Math.random()-.5)*12,(Math.random()-.5)*5])});}
function throwMag(){const p=L.p;if(p.mags<=0){floater(p.x,p.y-22,'NO MAGS!','#e04a3a');SFX.miss();return;}
  p.mags--;const [vx,vy]=dirVec(p.dir);L.projs.push({x:p.x+vx*6,y:p.y+vy*4,vx:vx*175,vy:vy*175,t:.55,spin:0,k:1+Math.floor(Math.random()*2)});SFX.throw();}
function gotCheckpoint(it){S.cp=S.level;S.cpScore=S.lvScore;S.score+=100;floater(it.x,it.y-22,'+100','#f8c840');
  L.banner={a:'CHECKPOINT!',b:'GAME OVER? YOU CAN RETRY LEVEL '+(S.level+1)+'.',c:'',t:3};SFX.flag();}
function caught(z){S.mode='caught';S.t=0;S.stats.caught++;z.say=z.k?FOEQ[z.k].caught:'WELCOME TO THE CLUB.';z.sayT=3;L.catcher=z.k||null;SFX.caught();L.banner=null;}
function updCaught(dt){
  const p=L.p;if(S.t>.4&&S.t<1.9&&Math.random()<.9){for(let k=0;k<2;k++)L.parts.push({x:p.x,y:p.y+2,z:9,vx:(Math.random()-.5)*60,vy:20+Math.random()*30,vz:20+Math.random()*30,t:1,col:pick(['#b8c43a','#d8dc5a','#8a9a2a'])});}
  if(S.t>1.25&&!p.zombie){p.zombie=true;spawnPuddle(p.x,p.y+6);}
  for(const z of L.zs)if(z.sayT>0)z.sayT-=dt;
  if(S.t>3.4){S.zombies++;if(S.zombies>MAXZ){S.mode='gameover';S.t=0;}else toIntro(true);}
}
/* ---- rap ---- */
function startRap(){const p=L.p;if(!p.mic){floater(p.x,p.y-22,'FIND A MIC FIRST','#e04a3a');SFX.miss();return;}
  p.mic=false;L.micT=CFG.micEvery;S.mode='rap';S.t=0;for(const k in keys)keys[k]=false;L.p.vx=L.p.vy=0;
  L.rap={done:0,pool:shuffle(RAPS.slice()),line:'',idx:0,t:0,tmax:1,miss:0,cool:1.2,fresh:0};newRapLine();}
function newRapLine(){const r=L.rap;if(!r.pool.length)r.pool=shuffle(RAPS.slice());r.line=r.pool.pop();r.idx=0;r.tmax=(CFG.rapBaseTime+CFG.rapTimePerChar*r.line.length)*Math.max(.55,1-.07*r.done)*(TOUCH?CFG.touchRapSlack:1);r.t=r.tmax;}
function updRap(dt){const r=L.rap;if(r.miss>0)r.miss-=dt;if(r.fresh>0)r.fresh-=dt;if(r.cool>0){r.cool-=dt;return;}r.t-=dt;if(r.t<=0)endRap();}
function rapKey(e){const r=L.rap;if(e.key==='Escape'){endRap();return;}if(r.cool>0||e.repeat)return;
  const ch=e.key.toLowerCase();if(ch.length!==1)return;const exp=r.line[r.idx];
  if(ch===exp){r.idx++;S.score+=5;SFX.key();if(r.idx>=r.line.length){r.done++;S.stats.lines++;S.score+=150;r.fresh=1;r.cool=.7;SFX.line();newRapLine();}}
  else{r.miss=.25;r.t-=.4;SFX.miss();}}
function endRap(){const r=L.rap;S.mode='play';
  if(r.done>0){L.vibe=CFG.vibeBase+CFG.vibePerLine*r.done;L.banner={a:'ZOMBIES ARE VIBING!',b:r.done+' LINE'+(r.done>1?'S':'')+' = '+Math.round(L.vibe)+' SECONDS OF HEADBOPPING',c:'',t:2.6};for(const z of L.zs){z.say=pick(z.k?FOEQ[z.k].vibe:VIBEQ);z.sayT=2.5;z.bubbleT=Math.max(z.bubbleT,L.vibe);}}
  else L.banner={a:'YOU CHOKED!',b:'THE ZOMBIES ARE NOT IMPRESSED.',c:'',t:2.2};
  L.rap=null;}

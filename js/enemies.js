"use strict";
/* Guests who chase you besides the zombies: the bear and the mushroom granny (forest), the spurgu and the nisti (Kontula).
   They live in L.zs next to the zombies (z.k = kind) and play by the same rules: magazines stop them, raps make them vibe,
   touching one gets you caught. Each kind adds one move of its own:
   bear = growls, then charges in a straight line and needs a breather; granny = fast nordic walker who stops to pick mushrooms;
   spurgu = wobbles, naps (harmless while asleep) and spills slippery beer; nisti = dashes and twitches, drifts off now and then. */
const PG={o:'#24161e',skin:'#f0caa8',skinDk:'#d4a68a',hair:'#c8382e',hairLt:'#f0e2d0',shirt:'#7a5a9a',shirtDk:'#5a3e76',pants:'#3a2c3a',shoe:'#2e5a34',eye:'#24161e',cheek:'#ec9a8e'};
const PS={o:'#24161e',skin:'#e8a88a',skinDk:'#c8846c',hair:'#3a6a8a',hairLt:'#5a8aaa',shirt:'#6a6a42',shirtDk:'#4a4a2c',pants:'#3a3a4c',shoe:'#24161e',eye:'#24161e',cheek:'#e06060'};
const PN={o:'#24161e',skin:'#dcc8bc',skinDk:'#b8a49a',hair:'#4c4c60',hairLt:'#5e5e74',shirt:'#4c4c60',shirtDk:'#38384a',pants:'#2a3a6c',shoe:'#e8e8f0',eye:'#24161e',cheek:'#a094b0'};
const PB={o:'#1a100c',fur:'#6a4426',furDk:'#4a2c18',furLt:'#8a5e36',snout:'#c09060',nose:'#120a08'};
const FOES={
  bear:{name:'BEAR',spd:30,read:.6,cr:11,bh:28,act:actBear,move:(z,sx,sy)=>z.st==='charge'?[z.cx,z.cy,3.1]:[sx,sy,1],draw:drawBear,
    voice:()=>tn(70+Math.random()*20,.35,'sawtooth',.05,45)},
  granny:{name:'MUSHROOM GRANNY',spd:40,read:1.5,act:actGranny,draw:(c,z,hb)=>drawGuest(c,z,hb,PG,accGranny),
    voice:()=>{tn(620,.07,'square',.02,700);tn(560,.07,'square',.02,null,anow()+.08);}},
  spurgu:{name:'SPURGU',spd:18,read:1.2,act:actSpurgu,move:moveSpurgu,draw:(c,z,hb)=>drawGuest(c,z,hb,PS,accSpurgu),
    voice:()=>tn(150+Math.random()*30,.3,'sawtooth',.03,100)},
  nisti:{name:'NISTI',spd:56,read:.6,noDawn:true,act:actNisti,move:(z,sx,sy)=>[sx,sy,1.25],draw:(c,z,hb)=>drawGuest(c,z,hb,PN,accNisti),
    voice:()=>{for(let i=0;i<3;i++)tn(300+Math.random()*200,.04,'square',.02,null,anow()+i*.05);}}
};
function newFoe(k,x,y){const K=FOES[k];
  return {k,x,y,dir:0,anim:0,spd:K.spd,read:0,readK:1,bubbleT:2+Math.random()*3,say:'',sayT:0,lure:null,still:0,t:Math.random()*9,cr:K.cr||9,bh:K.bh||22,
    st:'prowl',stT:0,cd:3,cx:0,cy:0,hit:0,busy:0,calm:false,pickT:5+Math.random()*4,napT:9+Math.random()*5,spillT:5+Math.random()*4,dashT:.8,wanderT:8+Math.random()*4,wander:null,wanderLeft:0};}
/* a magazine reaches a guest (startRead in update.js calls this) */
function foeRead(z){z.read=CFG.readTime*FOES[z.k].read;z.say=pick(FOEQ[z.k].read);z.busy=0;z.calm=false;z.st='prowl';z.wander=null;}

/* ---- waves: on levels with d.waves, everyone arrives in order, one slot every d.waveEvery seconds ---- */
function planWaves(d){const out=[];let zi=0;
  d.waves.forEach((slot,si)=>{for(const k of slot){const t=si*d.waveEvery;
    if(k==='Z'){if(zi>=S.zombies)continue;const s=d.zs[zi%d.zs.length];out.push({t,k:null,x:s[0]*16,y:s[1]*16,i:zi});zi++;}
    else{const s=d.guestAt[k];out.push({t,k,x:s[0]*16,y:s[1]*16});}}});
  return out;}
function startWaves(d){const plan=planWaves(d);L.pending=plan.filter(w=>w.t>0);for(const w of plan)if(w.t===0)L.zs.push(w.k?newFoe(w.k,w.x,w.y):newZombie(w.x,w.y,w.i));}
function waveTick(){while(L.pending.length&&L.pending[0].t<=L.time)arrive(L.pending.shift());}
function arrive(w){let x=w.x,y=w.y;
  if(Math.hypot(x-L.p.x,y-L.p.y)<90){let bd=-1;for(const s of L.d.zs.concat(Object.values(L.d.guestAt))){const dd=Math.hypot(s[0]*16-L.p.x,s[1]*16-L.p.y);if(dd>bd){bd=dd;x=s[0]*16;y=s[1]*16;}}}
  L.zs.push(w.k?newFoe(w.k,x,y):newZombie(x,y,w.i));
  for(let k=0;k<10;k++)L.parts.push({x:x+(Math.random()-.5)*12,y,z:4,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*10,vz:20+Math.random()*30,t:.6,col:pick(['#c8c0b0','#8a8a9a','#e8e4dc'])});
  floater(x,y-26,(w.k?FOES[w.k].name:'ZOMBIE')+'!',w.k?'#f8c840':'#9dbb6c');(w.k?FOES[w.k].voice:SFX.grumble)();}

/* ---- per frame (updZombie hands guests over to this) ---- */
function updFoe(z,dt){const K=FOES[z.k],Q=FOEQ[z.k];
  z.t+=dt;z.bubbleT-=dt;if(z.sayT>0)z.sayT-=dt;
  if(z.bubbleT<=0){z.bubbleT=6+Math.random()*7;if(z.read<=0&&L.vibe<=0&&!(z.busy>0)){z.say=pick(Q.say);z.sayT=3.4;K.voice();}}
  if(L.grace>0||L.vibe>0)return;
  if(z.read>0){z.read-=dt;z.dir=0;return;}
  for(const it of L.items){if(it.type==='lure'&&Math.hypot(it.x-z.x,it.y-z.y)<10){it.life=0;it.gone=true;startRead(z);z.readK=it.k||1;return;}}
  if(z.lure&&!L.items.includes(z.lure))z.lure=null;
  if(K.act(z,dt))return;
  let tx=L.p.x,ty=L.p.y;if(z.lure){tx=z.lure.x;ty=z.lure.y;}else if(z.wander){tx=z.wander.x;ty=z.wander.y;}
  const [sx,sy]=steer(z,tx,ty),[mx,my,f]=K.move?K.move(z,sx,sy):[sx,sy,1];
  const spd=z.spd*f*(K.noDawn?1:1+CFG.zombieSpeedupAtDawn*Math.min(1,L.time/L.d.night)),mv=moveEnt(z,mx*spd*dt,my*spd*dt);z.anim+=mv*.1;
  if(z.st==='charge'&&mv<spd*dt*.3)z.hit+=dt;
  if(Math.abs(mx)>Math.abs(my))z.dir=mx>0?2:3;else z.dir=my>0?0:1;
  if(mv<.05){z.still+=dt;if(z.still>.6){moveEnt(z,(Math.random()-.5)*6,(Math.random()-.5)*6);z.still=0;}}else z.still=0;}
/* each act() returns true while the guest is busy and stands still this frame */
function actBear(z,dt){z.cd-=dt;
  if(z.st==='windup'){z.stT-=dt;if(z.stT<=0){const dx=L.p.x-z.x,dy=L.p.y-z.y,d=Math.hypot(dx,dy)||1;z.cx=dx/d;z.cy=dy/d;z.st='charge';z.stT=1.2;z.hit=0;}return true;}
  if(z.st==='rest'){z.stT-=dt;if(z.stT<=0)z.st='prowl';return true;}
  if(z.st==='charge'){z.stT-=dt;if(z.stT<=0||z.hit>.12){z.st='rest';z.stT=1.5;z.cd=3+Math.random()*2;z.say=pick(FOEQ.bear.rest);z.sayT=1.2;return true;}return false;}
  if(z.cd<=0&&!z.lure&&Math.hypot(L.p.x-z.x,L.p.y-z.y)<130&&los(z.x,z.y,L.p.x,L.p.y)){z.st='windup';z.stT=.65;z.say='GRRR!';z.sayT=.9;SFX.growl();return true;}
  return false;}
function actGranny(z,dt){
  if(z.busy>0){z.busy-=dt;z.dir=0;return true;}
  z.pickT-=dt;if(z.pickT<=0&&!z.lure){z.pickT=7+Math.random()*5;z.busy=1.5;z.say=pick(FOEQ.granny.pick);z.sayT=1.5;return true;}
  return false;}
function actSpurgu(z,dt){
  if(z.busy>0){z.busy-=dt;if(z.busy<=0)z.calm=false;return true;}
  z.napT-=dt;if(z.napT<=0&&!z.lure){z.napT=11+Math.random()*6;z.busy=2.6;z.calm=true;z.say=pick(FOEQ.spurgu.nap);z.sayT=2.4;return true;}
  z.spillT-=dt;if(z.spillT<=0){z.spillT=7+Math.random()*4;spawnPuddle(z.x,z.y+4,true);z.say=pick(FOEQ.spurgu.spill);z.sayT=1.6;SFX.spill();}
  return false;}
function moveSpurgu(z,sx,sy){const w=Math.sin(z.t*2.6)*.75;const mx=sx-sy*w,my=sy+sx*w,d=Math.hypot(mx,my)||1;return [mx/d,my/d,.8+.35*Math.abs(Math.sin(z.t*1.3))];}
function actNisti(z,dt){
  z.dashT-=dt;if(z.dashT<=-.35)z.dashT=.8+Math.random()*.5;
  if(z.wander){z.wanderLeft-=dt;if(z.wanderLeft<=0||Math.hypot(z.wander.x-z.x,z.wander.y-z.y)<8)z.wander=null;}
  else{z.wanderT-=dt;if(z.wanderT<=0&&!z.lure){z.wanderT=9+Math.random()*5;const s=freeSpot(0);if(s){z.wander=s;z.wanderLeft=2.4;z.say=pick(FOEQ.nisti.wander);z.sayT=1.8;}}}
  return z.dashT<0;}

/* ---- drawing ---- */
const F=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
function drawGuest(c,z,hb,P,acc){const busy=z.busy>0,rd=z.read>0;let dx=0,dy=0;
  if(z.k==='spurgu'&&!busy&&!rd&&!hb)dx=Math.round(Math.sin(z.t*2.6)*1.4);
  if(z.k==='nisti'&&z.dashT<0&&!hb)dx=Math.floor(S.clock*30)%2?1:-1;
  if(busy)dy=z.k==='spurgu'?3:1;
  const dir=hb||rd||busy?0:z.dir,fr=hb||rd||busy?0:Math.floor(z.anim);
  drawHuman(c,z.x,z.y,dir,fr,P,{dx,dy,hb,read:rd?z.readK:0});
  acc(c,Math.round(z.x)-6+dx,Math.round(z.y)-17+dy,dir,hb||0,z);
  if(busy&&z.k==='spurgu'&&Math.floor(S.clock*2)%2){const pg=G;G=c;txt('Z',Math.round(z.x)+8,Math.round(z.y)-24,'#c8c8e8',1,'c','#140a14');G=pg;}}
function accGranny(c,ox,oy,dir,hb,z){const side=dir>=2;
  if(!side){F(c,ox+1,oy+11,10,4,PG.o);F(c,ox+2,oy+12,8,2,'#5a3a6a');F(c,ox+2,oy+14,8,1,'#7a5a8a');}   // skirt
  else{F(c,ox+2,oy+11,8,4,PG.o);F(c,ox+3,oy+12,6,2,'#5a3a6a');F(c,ox+3,oy+14,6,1,'#7a5a8a');}
  if(dir===0)F(c,ox+5,oy+8+hb,2,1,'#8a2424');                                                           // scarf knot
  const bx=dir===0?ox+9:dir===1?ox-2:dir===3?ox-3:ox+9,by=oy+9;                                         // basket of chanterelles
  F(c,bx,by-2,5,1,PG.o);F(c,bx,by-2,1,3,PG.o);F(c,bx+4,by-2,1,3,PG.o);
  F(c,bx-1,by,7,5,PG.o);F(c,bx,by+1,5,3,'#a8783a');F(c,bx,by+2,5,1,'#7a5428');F(c,bx+1,by,1,1,'#f2b030');F(c,bx+3,by,1,1,'#f2b030');
  if(z.busy>0)F(c,ox+1,oy+14,2,2,'#f2b030');}
function accSpurgu(c,ox,oy,dir,hb){const fl=dir===3;
  F(c,ox+5,oy-1+hb,2,1,'#e8e4dc');                                                                       // beanie pompom
  if(dir===0){F(c,ox+3,oy+7+hb,6,1,'#8a786c');F(c,ox+4,oy+7+hb,1,1,'#6a5a50');F(c,ox+7,oy+7+hb,1,1,'#6a5a50');F(c,ox+5,oy+6+hb,2,1,'#d04848');}
  else if(dir>=2){F(c,fl?ox+3:ox+8,oy+7+hb,1,1,'#8a786c');F(c,fl?ox+2:ox+9,oy+6+hb,1,1,'#d04848');}
  const cx=dir===0?ox+10:dir===1?ox:fl?ox+1:ox+9;F(c,cx-1,oy+9,4,5,PS.o);F(c,cx,oy+10,2,3,'#c8ccd8');F(c,cx,oy+11,2,1,'#3a6ac0');}   // can
function accNisti(c,ox,oy,dir){
  if(dir<2){F(c,ox+3,oy+13,1,3,'#e8e8f0');F(c,ox+8,oy+13,1,3,'#e8e8f0');}else F(c,dir===3?ox+5:ox+6,oy+13,1,3,'#e8e8f0');   // tracksuit stripes
  if(dir===0){F(c,ox+4,oy+8,1,2,'#d8d8e0');F(c,ox+7,oy+8,1,2,'#d8d8e0');}}                                                   // hoodie strings
function drawBear(c,z,hb){const pg=G;G=c;
  const rest=z.st==='rest',up=z.st==='windup',dir=hb||z.read>0||rest||up?0:z.dir,st=Math.floor(z.anim)&3,P=PB,b=hb||0;
  const X=Math.round(z.x),Y=Math.round(z.y)+(rest?1:0)-(up?2:0);
  ell(X,Y+(up?2:0),10,2,'rgba(12,6,20,.38)');
  if(dir<2){const l1=st===1?1:0,l2=st===3?1:0,hy=Y-17+b;
    R(X-8,Y-5-l1,5,5,P.o);R(X+3,Y-5-l2,5,5,P.o);R(X-7,Y-4-l1,3,3,P.furDk);R(X+4,Y-4-l2,3,3,P.furDk);                        // paws
    ell(X,Y-9+b,9,7,P.o);disc(X-5,hy-4,2,P.o);disc(X+5,hy-4,2,P.o);disc(X,hy,6,P.o);                                         // outline
    ell(X,Y-9+b,8,6,P.fur);ell(X-2,Y-11+b,5,3,P.furLt);disc(X-5,hy-4,1,P.furDk);disc(X+5,hy-4,1,P.furDk);disc(X,hy,5,P.fur);
    if(dir===0){ell(X,hy+2,3,2,P.snout);R(X-1,hy+1,2,1,P.nose);R(X-3,hy-2,1,1,P.nose);R(X+2,hy-2,1,1,P.nose);R(X,hy+3,1,1,'#3a2016');
      if(z.read>0){R(X-5,hy+2,10,5,P.o);R(X-4,hy+3,4,3,'#f2e6d0');R(X,hy+3,4,3,'#e8dcc8');R(X-3,hy+4,2,1,z.readK===1?'#e05a8a':'#3ac0d0');}}
    else{R(X-2,hy-3,4,2,P.furLt);R(X-1,Y-4+b,2,2,P.furDk);}}
  else{const s=dir===2?1:-1,hx=X+9*s,hy=Y-12+b;
    for(let i=0;i<4;i++){const lx=[-7,-3,3,7][i],lift=(st===1&&i%2===0)||(st===3&&i%2===1)?1:0;R(X+lx*s-2,Y-6-lift,4,6,P.o);R(X+lx*s-1,Y-5-lift,2,4,i%2?P.fur:P.furDk);}
    ell(X-s,Y-9+b,10,6,P.o);disc(X+3*s,Y-13+b,5,P.o);disc(hx-2*s,hy-4,2,P.o);disc(hx,hy,5,P.o);R(s>0?hx+3:hx-7,hy-1,5,4,P.o);   // outline
    ell(X-s,Y-9+b,9,5,P.fur);disc(X+3*s,Y-13+b,4,P.fur);ell(X-2*s,Y-11+b,5,2,P.furLt);disc(hx-2*s,hy-4,1,P.furDk);disc(hx,hy,4,P.fur);
    R(s>0?hx+3:hx-6,hy,3,2,P.snout);R(s>0?hx+6:hx-6,hy,1,1,P.nose);R(hx+s,hy-2,1,1,P.nose);}
  if(up&&Math.floor(S.clock*8)%2)txt('!',X+13,Y-24,'#e04a3a',1,'c','#140a14');
  G=pg;}

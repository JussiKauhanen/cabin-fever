"use strict";
/* Guests share L.zs with zombies (z.k = kind). The mushroom picker is harmless until a zombie bites her;
   infected guests chase you, read magazines and vibe to raps. Each kind adds one move of its own:
   bear = growls, then charges in a straight line and needs a breather; granny = gathers mushrooms, then throws them if infected;
   spurgu = wobbles, naps (harmless while asleep) and spills slippery beer; nisti = dashes and twitches, drifts off now and then;
   inspector = never catches you, but fines you (euros, magazines or points) and checks zombies' tickets in between;
   teekkari = harmless and unpredictable, bumping into him is a lottery; startup founder = appears, sprints at you, vanishes;
   porvari = takes all your money (or the coins on the floor); middle manager = slow, throws meeting invites that root you;
   hr = shows up rarely (office.js) and ends the game on contact. Some of them deal in money (economy.js). */
const PG={o:'#24161e',skin:'#f0caa8',skinDk:'#d4a68a',hair:'#c8382e',hairLt:'#f0e2d0',shirt:'#7a5a9a',shirtDk:'#5a3e76',pants:'#3a2c3a',shoe:'#2e5a34',eye:'#24161e',cheek:'#ec9a8e'};
const PGZ={...PG,skin:'#9dbb6c',skinDk:'#6f8f4c',eye:'#ff4a3a',cheek:'#6f8f4c',z:1};
const PS={o:'#24161e',skin:'#e8a88a',skinDk:'#c8846c',hair:'#3a6a8a',hairLt:'#5a8aaa',shirt:'#6a6a42',shirtDk:'#4a4a2c',pants:'#3a3a4c',shoe:'#24161e',eye:'#24161e',cheek:'#e06060'};
const PN={o:'#24161e',skin:'#dcc8bc',skinDk:'#b8a49a',hair:'#4c4c60',hairLt:'#5e5e74',shirt:'#4c4c60',shirtDk:'#38384a',pants:'#2a3a6c',shoe:'#e8e8f0',eye:'#24161e',cheek:'#a094b0'};
const PI={o:'#24161e',skin:'#f0c0a0',skinDk:'#d09a80',hair:'#8a8a94',hairLt:'#a8a8b4',shirt:'#2a3a6a',shirtDk:'#1e2a4e',pants:'#22223a',shoe:'#14121a',eye:'#24161e',cheek:'#e09080'};
const PT={o:'#24161e',skin:'#f2c8a4',skinDk:'#d8a080',hair:'#8a6a3a',hairLt:'#a8884e',shirt:'#e05aa0',shirtDk:'#b03a7a',pants:'#e05aa0',shoe:'#24161e',eye:'#24161e',cheek:'#f08a8a'};
const PF={o:'#24161e',skin:'#eec4a0',skinDk:'#cc9c7c',hair:'#2a2430',hairLt:'#40384a',shirt:'#34343e',shirtDk:'#22222a',pants:'#3a4a6c',shoe:'#f2f2f2',eye:'#24161e',cheek:'#e09a8a'};
const PV={o:'#24161e',skin:'#f4cdb4',skinDk:'#d8a890',hair:'#c8c8d0',hairLt:'#e4e4ec',shirt:'#22222e',shirtDk:'#14141c',pants:'#4a4a58',shoe:'#14121a',eye:'#24161e',cheek:'#f09a9a'};
const PM={o:'#24161e',skin:'#ecc2a0',skinDk:'#cc9a7c',hair:'#6a5038',hairLt:'#86684c',shirt:'#5a6a8a',shirtDk:'#3e4c68',pants:'#2e3448',shoe:'#14121a',eye:'#24161e',cheek:'#e09080'};
const PH={o:'#24161e',skin:'#f4d0b8',skinDk:'#d8aa94',hair:'#d8b050',hairLt:'#f0d078',shirt:'#a02848',shirtDk:'#741a34',pants:'#e8c8b0',shoe:'#741a34',eye:'#24161e',cheek:'#f09aa0'};
/* office zombies look like colleagues: four of them, so the open-plan floor is not full of clones */
const PO=[{skin:'#e8c0a0',skinDk:'#c09880',hair:'#4a3a2e',hairLt:'#6a5442',shirt:'#a8c8e8',shirtDk:'#7a9cc0',pants:'#2e3448',tie:'#c03a2e'},
  {skin:'#d8a880',skinDk:'#b08460',hair:'#1a1a22',hairLt:'#34343e',shirt:'#e8e4f0',shirtDk:'#b8b4c8',pants:'#4a4a56',tie:'#3a6ac0'},
  {skin:'#f0ccb0',skinDk:'#d0a488',hair:'#c8a040',hairLt:'#e8c868',shirt:'#3a4a6a',shirtDk:'#28344e',pants:'#28344e',tie:'#f8c840'},
  {skin:'#e4b898',skinDk:'#bc9070',hair:'#8a8a94',hairLt:'#a8a8b4',shirt:'#e8b8c0',shirtDk:'#c090a0',pants:'#3a3a46',tie:'#5a3a6a'}]
  .map(p=>Object.assign({o:'#24161e',shoe:'#14121a',eye:'#24161e',cheek:p.skinDk},p));
const PB={o:'#1a100c',fur:'#6a4426',furDk:'#4a2c18',furLt:'#8a5e36',snout:'#c09060',nose:'#120a08'};
const FOES={
  bear:{name:'BEAR',spd:30,read:.6,cr:11,bh:28,act:actBear,move:(z,sx,sy)=>z.st==='charge'?[z.cx,z.cy,3.1]:[sx,sy,1],draw:drawBear,
    voice:()=>tn(70+Math.random()*20,.35,'sawtooth',.05,45)},
  granny:{name:'MUSHROOM GRANNY',spd:40,read:1.5,act:actGranny,draw:drawGranny,buys:z=>z.grannyState==='healthy'&&!(z.sellCd>0),
    voice:()=>{tn(620,.07,'square',.02,700);tn(560,.07,'square',.02,null,anow()+.08);}},
  spurgu:{name:'SPURGU',spd:18,read:1.2,act:actSpurgu,move:moveSpurgu,draw:(c,z,hb)=>drawGuest(c,z,hb,PS,accSpurgu),
    voice:()=>tn(150+Math.random()*30,.3,'sawtooth',.03,100)},
  nisti:{name:'NISTI',spd:56,read:.6,noDawn:true,act:actNisti,touch:touchNisti,move:(z,sx,sy)=>[sx,sy,z.high>0?.4:1.25],draw:(c,z,hb)=>drawGuest(c,z,hb,PN,accNisti),
    voice:()=>{for(let i=0;i<3;i++)tn(300+Math.random()*200,.04,'square',.02,null,anow()+i*.05);}},
  inspector:{name:'TICKET INSPECTOR',spd:46,read:.7,harmless:true,grazed:true,act:actInspector,draw:(c,z,hb)=>drawGuest(c,z,hb,PI,accInspector),
    voice:()=>{tn(1200,.05,'square',.02);tn(1500,.07,'square',.02,null,anow()+.07);}},
  teekkari:{name:'TEEKKARI',spd:44,read:1,harmless:true,noDawn:true,act:actTeekkari,move:moveTeekkari,draw:(c,z,hb)=>drawGuest(c,z,hb,PT,accTeekkari),
    voice:()=>{tn(392,.09,'square',.03);tn(523,.09,'square',.03,null,anow()+.1);tn(330,.14,'square',.03,null,anow()+.2);}},
  startup:{name:'STARTUP FOUNDER',spd:CFG.startupSpeed,read:.5,noDawn:true,act:actStartup,draw:drawStartup,
    voice:()=>{tn(1568,.05,'square',.025);tn(2093,.08,'square',.025,null,anow()+.06);}},
  porvari:{name:'PORVARI',spd:34,read:1.3,harmless:true,noDawn:true,act:actPorvari,draw:(c,z,hb)=>drawGuest(c,z,hb,PV,accPorvari),
    voice:()=>tn(110,.3,'triangle',.06,98)},
  manager:{name:'MIDDLE MANAGER',spd:20,read:1.4,cr:10,act:actManager,draw:(c,z,hb)=>drawGuest(c,z,hb,PM,accManager),
    voice:()=>{tn(196,.12,'square',.03);tn(196,.12,'square',.03,null,anow()+.16);}},
  hr:{name:'HR',spd:CFG.hrSpeed,read:0,noRead:true,noDawn:true,instant:true,act:actHR,draw:drawHR,
    voice:()=>{tn(1047,.05,'square',.03);tn(1047,.05,'square',.03,null,anow()+.14);}}
};
function newFoe(k,x,y){const K=FOES[k];
  const z={k,x,y,dir:0,anim:0,spd:K.spd,read:0,readK:1,bubbleT:2+Math.random()*3,say:'',sayT:0,lure:null,still:0,t:Math.random()*9,cr:K.cr||9,bh:K.bh||22,
    st:'prowl',stT:0,cd:3,cx:0,cy:0,hit:0,busy:0,calm:false,pickT:5+Math.random()*4,napT:9+Math.random()*5,spillT:5+Math.random()*4,dashT:.8,wanderT:8+Math.random()*4,wander:null,wanderLeft:0};
  if(k==='granny'){z.grannyState='healthy';z.turnT=0;z.mushroomT=CFG.mushroomEvery;z.throwT=0;z.calm=true;z.wanderT=0;}
  if(k==='startup'){z.ph='pitch';z.stT=CFG.startupPitch;z.calm=true;}
  if(k==='manager'){z.inviteT=3;z.throwT=0;}
  if(k==='porvari')z.bag=0;
  return z;}
/* a magazine reaches a guest (startRead in update.js calls this) */
function foeRead(z){if(z.k==='granny'&&z.grannyState!=='infected'){z.read=0;z.lure=null;z.calm=true;return;}
  z.read=CFG.readTime*FOES[z.k].read;z.say=pick(FOEQ[z.k].read);z.busy=0;z.calm=false;z.st='prowl';z.wander=null;
  if(z.throwT>0)z.throwT=0; // a magazine interrupts a throw (granny's mushroom, the manager's invite)
  if(z.k==='granny')z.mushroomT=Math.max(z.mushroomT,1);}
/* a healthy picker buys the magazine you throw to her instead (update.js, projectiles) */
function sellMag(z){earn(CFG.magSellPrice,z.x,z.y-26,'SOLD!');z.sellCd=CFG.magSellCooldown;z.say=pick(FOEQ[z.k].buy);z.sayT=2.4;z.bubbleT=Math.max(z.bubbleT,4);z.busy=Math.max(z.busy,.8);}

/* A bite is checked before entity separation; a reading or dancing zombie cannot infect her. */
function infectGranny(z){if(z.k!=='granny'||z.grannyState!=='healthy')return;
  z.grannyState='turning';z.turnT=CFG.grannyTurnTime;z.calm=true;z.read=0;z.busy=0;z.lure=null;z.wander=null;z.throwT=0;
  z.say=pick(FOEQ.granny.turning||['OH DEAR... THAT WAS A BITE.']);z.sayT=z.turnT+.3;z.bubbleT=z.turnT+4;
  floater(z.x,z.y-27,'GRANNY WAS BITTEN!','#e04a3a');SFX.grumble();}
function checkGrannyInfection(){if(L.open||enemiesHeld())return;
  for(const z of L.zs)if(z.k==='granny'&&z.grannyState==='healthy'&&L.zs.some(other=>!other.k&&other.read<=0&&Math.hypot(other.x-z.x,other.y-z.y)<=11&&los(other.x,other.y,z.x,z.y)))infectGranny(z);}

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
  floater(x,y-26,(w.k?FOES[w.k].name:L.d.zskin?L.d.zskin.name:'ZOMBIE')+'!',w.k?'#f8c840':'#9dbb6c');(w.k?FOES[w.k].voice:SFX.grumble)();}

/* ---- per frame (updZombie hands guests over to this) ---- */
function updFoe(z,dt){const K=FOES[z.k],Q=FOEQ[z.k];
  z.t+=dt;
  if(z.hidden){if(!enemiesHeld())K.act(z,dt);return;} // out of sight (the founder between pitches): only his own clock runs
  z.bubbleT-=dt;if(z.sayT>0)z.sayT-=dt;
  const innocent=z.k==='granny'&&z.grannyState!=='infected';
  if(z.bubbleT<=0){z.bubbleT=6+Math.random()*7;if(z.read<=0&&L.vibe<=0&&L.freeze<=0&&!(z.busy>0)&&z.grannyState!=='turning'){
    const lines=z.k==='granny'?(z.grannyState==='healthy'?Q.healthy:Q.infected):Q.say;z.say=pick(lines||Q.say);z.sayT=3.4;K.voice();}}
  if(enemiesHeld())return;
  // Innocent and transforming pickers never read or chase lures, and a magazine cannot undo a bite.
  if(innocent){z.calm=true;z.read=0;z.lure=null;if(K.act(z,dt))return;}
  else{
  if(z.read>0){z.read-=dt;z.dir=0;return;}
  if(!K.noRead)for(const it of L.items){if(it.type==='lure'&&Math.hypot(it.x-z.x,it.y-z.y)<10){it.life=0;it.gone=true;startRead(z);z.readK=it.k||1;return;}}
  if(z.lure&&!L.items.includes(z.lure))z.lure=null;
  if(K.act(z,dt))return;}
  let tx=L.p.x,ty=L.p.y;if(z.lure){tx=z.lure.x;ty=z.lure.y;}else if(z.wander){tx=z.wander.x;ty=z.wander.y;}
  if(innocent&&!z.wander)return;
  const [sx,sy]=steer(z,tx,ty),[mx,my,f]=K.move?K.move(z,sx,sy):[sx,sy,1];
  const spd=z.spd*f*(innocent?.5:K.noDawn?1:1+CFG.zombieSpeedupAtDawn*Math.min(1,L.time/L.d.night)),mv=moveEnt(z,mx*spd*dt,my*spd*dt);z.anim+=mv*.1;
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
  if(z.sellCd>0)z.sellCd-=dt;
  if(z.grannyState==='turning'){z.turnT=Math.max(0,z.turnT-dt);z.dir=0;
    if(z.turnT<=0){z.grannyState='infected';z.calm=false;z.mushroomT=Math.min(1.5,CFG.mushroomEvery);
      z.say=pick(FOEQ.granny.infected||FOEQ.granny.say);z.sayT=3;floater(z.x,z.y-27,'GRANNY TURNED!','#e04a3a');SFX.grumble();}
    return true;}
  if(z.grannyState==='healthy'){
    if(z.busy>0){z.busy-=dt;z.dir=0;return true;}
    z.pickT-=dt;if(z.pickT<=0){z.pickT=5+Math.random()*4;z.busy=1.5;z.say=pick(FOEQ.granny.pick);z.sayT=1.5;return true;}
    z.wanderLeft-=dt;if(!z.wander||z.wanderLeft<=0||Math.hypot(z.wander.x-z.x,z.wander.y-z.y)<7){z.wander=freeSpot(0);z.wanderLeft=5+Math.random()*4;}
    return !z.wander;}
  if(z.throwT>0){z.throwT=Math.max(0,z.throwT-dt);
    if(z.throwT<=0){const dx=z.aimX-z.x,dy=z.aimY-z.y,d=Math.hypot(dx,dy);
      if(d>0&&los(z.x,z.y,z.aimX,z.aimY)){L.mushrooms.push({x:z.x,y:z.y,vx:dx/d*CFG.mushroomSpeed,vy:dy/d*CFG.mushroomSpeed,t:Math.min(CFG.mushroomLife,d/CFG.mushroomSpeed),age:0});SFX.throw();}
      z.mushroomT=CFG.mushroomEvery+Math.random()*.8;}
    return true;}
  z.mushroomT-=dt;
  if(z.mushroomT<=0&&!z.lure){const d=Math.hypot(z.x-L.p.x,z.y-L.p.y);
    if(d>24&&d<CFG.mushroomSpeed*CFG.mushroomLife&&los(z.x,z.y,L.p.x,L.p.y)){z.throwT=.6;z.aimX=L.p.x;z.aimY=L.p.y;
      z.say=pick(FOEQ.granny.throw||['CATCH, DEAR!']);z.sayT=.9;return true;}}
  return false;}
function actSpurgu(z,dt){
  if(z.busy>0){z.busy-=dt;if(z.busy<=0)z.calm=false;return true;}
  z.napT-=dt;if(z.napT<=0&&!z.lure){z.napT=11+Math.random()*6;z.busy=2.6;z.calm=true;z.say=pick(FOEQ.spurgu.nap);z.sayT=2.4;return true;}
  z.spillT-=dt;if(z.spillT<=0){z.spillT=7+Math.random()*4;spawnPuddle(z.x,z.y+4,true);z.say=pick(FOEQ.spurgu.spill);z.sayT=1.6;SFX.spill();}
  return false;}
function moveSpurgu(z,sx,sy){const w=Math.sin(z.t*2.6)*.75;const mx=sx-sy*w,my=sy+sx*w,d=Math.hypot(mx,my)||1;return [mx/d,my/d,.8+.35*Math.abs(Math.sin(z.t*1.3))];}
function farSpot(){let best=null,bd=-1;for(let i=0;i<8;i++){const s=freeSpot(0);if(!s)continue;const d=Math.hypot(s.x-L.p.x,s.y-L.p.y);if(d>bd){bd=d;best=s;}}return best;}
function actNisti(z,dt){
  if(z.high>0||z.flee>0){const k=z.high>0?'high':'flee';z[k]-=dt;z.calm=true; // paid, or running off with your money: harmless for a while
    if(z[k]<=0){z.calm=false;z.wander=null;z.wanderT=6+Math.random()*4;}
    else if(!z.wander||Math.hypot(z.wander.x-z.x,z.wander.y-z.y)<8)z.wander=(k==='flee'?farSpot():freeSpot(0))||z.wander;
    return false;}
  z.dashT-=dt;if(z.dashT<=-.35)z.dashT=.8+Math.random()*.5;
  if(z.wander){z.wanderLeft-=dt;if(z.wanderLeft<=0||Math.hypot(z.wander.x-z.x,z.wander.y-z.y)<8)z.wander=null;}
  else{z.wanderT-=dt;if(z.wanderT<=0&&!z.lure){z.wanderT=9+Math.random()*5;const s=freeSpot(0);if(s){z.wander=s;z.wanderLeft=2.4;z.say=pick(FOEQ.nisti.wander);z.sayT=1.8;}}}
  return z.dashT<0;}
/* touching the nisti: he buys a magic pill if you have one, otherwise he picks your pocket. Only a broke player gets caught. */
function touchNisti(z){const p=L.p,Q=FOEQ.nisti;
  if(S.pills>0){S.pills--;earn(CFG.pillSellPrice,p.x,p.y-22,'PILL SOLD!');z.high=CFG.nistiHigh;z.say=pick(Q.high);}
  else if(S.money>0){const n=payUp(CFG.nistiSteal);floater(p.x,p.y-22,'ROBBED! -'+n+'€','#e04a3a');coinBurst(p.x,p.y,6);z.flee=CFG.nistiFlee;z.say=pick(Q.rob);p.slip=Math.max(p.slip,.4);SFX.rob();}
  else return false;
  z.calm=true;z.wander=null;z.lure=null;z.sayT=2.2;z.bubbleT=Math.max(z.bubbleT,5);return true;}
function actInspector(z,dt){
  if(z.dizzy>0){z.dizzy-=dt;z.dir=0;return true;}   // grazed by a train (station.js)
  if(z.busy>0){z.busy-=dt;z.dir=0;return true;}
  z.fineCd=Math.max(0,(z.fineCd||0)-dt);const p=L.p;
  if(z.fineCd<=0){z.wander=null;if(Math.hypot(p.x-z.x,p.y-z.y)<11){fineInspector(z);return true;}return false;}
  // between fines he walks over to the nearest zombie and checks its ticket, which stops it for a moment
  let near=null,nd=1e9;for(const o of L.zs){if(o.k||o.read>0)continue;const d=Math.hypot(o.x-z.x,o.y-z.y);if(d<nd){nd=d;near=o;}}
  z.wander=near?{x:near.x,y:near.y}:null;
  if(near&&nd<12){near.read=CFG.readTime*.5;near.readK=1;near.lure=null;near.say=pick(FOEQ.inspector.zfine);near.sayT=2.5;
    z.say=pick(FOEQ.inspector.check);z.sayT=1.6;z.busy=.8;floater(near.x,near.y-26,'TICKET CHECK!','#5ad8f8');SFX.fine();return true;}
  return false;}
function fineInspector(z){const p=L.p,n=Math.min(CFG.inspectorFine,p.mags),paid=S.money>=CFG.inspectorFineMoney;
  if(paid){payUp(CFG.inspectorFineMoney);floater(p.x,p.y-22,'FINED! -'+CFG.inspectorFineMoney+'€','#5ad8f8');coinBurst(p.x,p.y,5);}
  else if(n){p.mags-=n;floater(p.x,p.y-22,'FINED! -'+n+' MAG'+(n>1?'S':''),'#5ad8f8');}
  else{const pts=Math.min(Math.floor(S.score),CFG.inspectorFinePoints);S.score-=pts;floater(p.x,p.y-22,'NO TICKET! -'+pts,'#5ad8f8');}
  z.fineCd=CFG.inspectorCooldown;z.busy=1.2;z.say=pick(paid?FOEQ.inspector.pay:FOEQ.inspector.fine);z.sayT=2;p.slip=Math.max(p.slip,.5);SFX.fine();}

/* teekkari: no plan at all. Every few seconds he picks something new to do, and bumping into him is a lottery. */
function actTeekkari(z,dt){const p=L.p;z.cd=Math.max(0,z.cd-dt);
  if(z.busy>0){z.busy-=dt;z.dir=0;return true;}
  if(z.cd<=0&&Math.hypot(p.x-z.x,p.y-z.y)<11){teekkariMeets(z);return true;}
  z.stT-=dt;if(z.wander&&Math.hypot(z.wander.x-z.x,z.wander.y-z.y)<8)z.stT=0;
  if(z.stT<=0){const r=Math.random();z.st=r<.3?'wander':r<.48?'dash':r<.7?'chase':r<.85?'spin':'sing';z.stT=1+Math.random()*2.2;
    z.wander=z.st==='wander'||z.st==='dash'?freeSpot(0):null;
    if(z.st==='sing'){z.say=pick(FOEQ.teekkari.sing);z.sayT=z.stT;z.bubbleT=Math.max(z.bubbleT,z.stT+2);}}
  if(z.st==='spin'){z.dir=[0,2,1,3][Math.floor(z.t*8)&3];return true;}
  if(z.st==='sing'){z.dir=0;return true;}
  return z.st!=='chase'&&!z.wander;}
function teekkariMeets(z){const p=L.p,Q=FOEQ.teekkari,r=Math.random();z.cd=5;z.busy=1;z.stT=0;
  if(r<.4){p.slip=Math.max(p.slip,.6);z.say=pick(Q.hug);floater(p.x,p.y-22,'TEEKKARI HUG!','#f0a0c8');SFX.slip();}
  else if(r<.7){earn(CFG.teekkariGift,p.x,p.y-22);z.say=pick(Q.gift);}
  else if(p.mags>0){p.mags--;z.say=pick(Q.borrow);floater(p.x,p.y-22,'-1 MAG','#f0a0c8');SFX.miss();}
  else{p.mags++;z.say=pick(Q.notes);floater(p.x,p.y-22,'+1 LECTURE NOTES','#f0a0c8');SFX.pick();}
  z.sayT=2.2;z.bubbleT=Math.max(z.bubbleT,4);}
function moveTeekkari(z,sx,sy){const w=Math.sin(z.t*3.1)*.6,mx=sx-sy*w,my=sy+sx*w,d=Math.hypot(mx,my)||1;return [mx/d,my/d,z.st==='dash'?1.7:z.st==='chase'?1.05:.8];}
/* startup founder: away (hidden) > pitch (fades in, harmless) > run (sprints at you) > gone again */
function actStartup(z,dt){
  if(z.ph==='away'){z.stT-=dt;if(z.stT>0)return true;
    const s=freeSpot(CFG.startupNear);if(!s){z.stT=.5;return true;}
    z.x=s.x;z.y=s.y;z.hidden=false;z.calm=true;z.ph='pitch';z.stT=CFG.startupPitch;z.dir=0;z.still=0;
    z.say=pick(FOEQ.startup.say);z.sayT=2;z.bubbleT=6+Math.random()*4;FOES.startup.voice();return true;}
  if(z.ph==='pitch'){z.calm=true;z.dir=0;z.stT-=dt;if(z.stT<=0){z.ph='run';z.stT=CFG.startupRun;z.calm=false;}return true;}
  z.stT-=dt;if(z.stT>0)return false;
  puff(z.x,z.y,['#5ad8f8','#f2f2f2','#c8ccd8']);floater(z.x,z.y-24,pick(FOEQ.startup.exit),'#5ad8f8');SFX.poof();
  z.ph='away';z.hidden=true;z.calm=true;z.say='';z.sayT=0;z.lure=null;z.x=z.y=-99;
  z.stT=CFG.startupAway[0]+Math.random()*(CFG.startupAway[1]-CFG.startupAway[0]);return true;}
/* porvari: walks up and takes all your money. If you are broke he pockets the coins on the floor instead. */
function actPorvari(z,dt){const p=L.p,Q=FOEQ.porvari;
  if(z.busy>0){z.busy-=dt;z.dir=0;return true;}
  if(z.cd>0){z.cd-=dt;if(!z.wander||Math.hypot(z.wander.x-z.x,z.wander.y-z.y)<8)z.wander=farSpot();return !z.wander;} // a stroll after business
  if(S.money>0){z.wander=null;
    if(Math.hypot(p.x-z.x,p.y-z.y)<11){const n=payUp(S.money);z.bag+=n;floater(p.x,p.y-22,'TAXED! -'+n+'€','#e04a3a');coinBurst(p.x,p.y,8);
      z.say=pick(Q.take);z.sayT=2.4;z.bubbleT=Math.max(z.bubbleT,5);z.busy=1.6;z.cd=7;p.slip=Math.max(p.slip,.4);SFX.rob();return true;}
    return false;}
  let coin=null,cd=1e9;for(const it of L.items)if(it.type==='coin'){const d=Math.hypot(it.x-z.x,it.y-z.y);if(d<cd){cd=d;coin=it;}}
  if(coin){z.wander={x:coin.x,y:coin.y};
    if(cd<10){L.items.splice(L.items.indexOf(coin),1);z.bag+=coin.v;floater(coin.x,coin.y-14,'PORVARI +'+coin.v+'€','#9a8aa8');z.say=pick(Q.coin);z.sayT=1.6;z.busy=.7;z.wander=null;return true;}
    return false;}
  if(!z.wander||Math.hypot(z.wander.x-z.x,z.wander.y-z.y)<8)z.wander=freeSpot(0);return !z.wander;}
/* middle manager: slow, but his meeting invites root you to the spot (office.js moves them) */
function actManager(z,dt){const p=L.p;
  if(z.throwT>0){z.throwT=Math.max(0,z.throwT-dt);z.dir=0;
    if(z.throwT<=0){const dx=z.aimX-z.x,dy=z.aimY-z.y,d=Math.hypot(dx,dy);
      if(d>0&&L.office)L.office.invites.push({x:z.x,y:z.y,vx:dx/d*CFG.inviteSpeed,vy:dy/d*CFG.inviteSpeed,t:CFG.inviteLife,age:0});
      z.inviteT=CFG.inviteEvery+Math.random();SFX.throw();}
    return true;}
  z.inviteT-=dt;
  if(z.inviteT<=0&&!z.lure){const d=Math.hypot(z.x-p.x,z.y-p.y);
    if(d>28&&d<CFG.inviteSpeed*CFG.inviteLife&&los(z.x,z.y,p.x,p.y)){z.throwT=.7;z.aimX=p.x;z.aimY=p.y;z.say=pick(FOEQ.manager.throw);z.sayT=1;return true;}}
  return false;}
/* hr: comes for you for a few seconds, then walks back to her door. Magazines mean nothing to her. */
function actHR(z,dt){z.life-=dt;if(z.life>0)return false;
  if(!z.calm){z.calm=true;z.say=pick(FOEQ.hr.leave);z.sayT=2;}
  z.wander=z.home;if(Math.hypot(z.home.x-z.x,z.home.y-z.y)<10||z.life<-6)z.done=true;return z.done;}

/* ---- drawing ---- */
const F=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
function drawGranny(c,z,hb){const green=z.grannyState==='infected'||z.grannyState==='turning'&&Math.floor(S.clock*6)%2;
  drawGuest(c,z,hb,green?PGZ:PG,accGranny);}
function drawGuest(c,z,hb,P,acc){const busy=z.busy>0,rd=z.read>0;let dx=0,dy=0;
  if((z.k==='spurgu'||z.k==='teekkari')&&!busy&&!rd&&!hb)dx=Math.round(Math.sin(z.t*2.6)*1.4);
  if(z.high>0&&!hb)dx=Math.round(Math.sin(z.t*4)*2);
  if(z.k==='nisti'&&z.dashT<0&&!hb)dx=Math.floor(S.clock*30)%2?1:-1;
  if(z.dizzy>0&&!hb)dx=Math.round(Math.sin(z.t*9)*1.5);
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
  if(z.busy>0)F(c,ox+1,oy+14,2,2,'#f2b030');
  if(z.throwT>0){F(c,ox-2,oy+4,2,4,'#f2e6d0');F(c,ox-4,oy+2,6,3,PG.o);F(c,ox-3,oy+2,4,2,'#f2b030');}}
function accSpurgu(c,ox,oy,dir,hb){const fl=dir===3;
  F(c,ox+5,oy-1+hb,2,1,'#e8e4dc');                                                                       // beanie pompom
  if(dir===0){F(c,ox+3,oy+7+hb,6,1,'#8a786c');F(c,ox+4,oy+7+hb,1,1,'#6a5a50');F(c,ox+7,oy+7+hb,1,1,'#6a5a50');F(c,ox+5,oy+6+hb,2,1,'#d04848');}
  else if(dir>=2){F(c,fl?ox+3:ox+8,oy+7+hb,1,1,'#8a786c');F(c,fl?ox+2:ox+9,oy+6+hb,1,1,'#d04848');}
  const cx=dir===0?ox+10:dir===1?ox:fl?ox+1:ox+9;F(c,cx-1,oy+9,4,5,PS.o);F(c,cx,oy+10,2,3,'#c8ccd8');F(c,cx,oy+11,2,1,'#3a6ac0');}   // can
function accNisti(c,ox,oy,dir){
  if(dir<2){F(c,ox+3,oy+13,1,3,'#e8e8f0');F(c,ox+8,oy+13,1,3,'#e8e8f0');}else F(c,dir===3?ox+5:ox+6,oy+13,1,3,'#e8e8f0');   // tracksuit stripes
  if(dir===0){F(c,ox+4,oy+8,1,2,'#d8d8e0');F(c,ox+7,oy+8,1,2,'#d8d8e0');}}                                                   // hoodie strings
function accInspector(c,ox,oy,dir,hb,z){const side=dir>=2,fl=dir===3;
  F(c,ox+1,oy-2+hb,10,4,PI.o);F(c,ox+2,oy-1+hb,8,2,'#1e2a4e');F(c,ox+5,oy-1+hb,2,1,'#f8c840');                     // cap with badge
  if(dir===0)F(c,ox+2,oy+2+hb,8,1,'#101830');else if(side)F(c,fl?ox:ox+8,oy+2+hb,4,1,'#101830');                  // peak
  if(dir===0){F(c,ox+3,oy+9,2,2,'#f8c840');F(c,ox+9,oy+11,3,4,PI.o);F(c,ox+10,oy+12,1,2,'#5ad8f8');}              // badge + card reader
  else if(side)F(c,fl?ox+2:ox+7,oy+10,3,4,PI.o),F(c,fl?ox+3:ox+8,oy+11,1,2,'#5ad8f8');
  if(z&&z.dizzy>0)for(let i=0;i<3;i++){const a=z.t*6+i*2.1;F(c,ox+5+Math.round(Math.cos(a)*7),oy-4+Math.round(Math.sin(a)*2),2,2,'#f8c840');}}   // dizzy stars
/* teekkari: white cap with a tassel, pink overalls with patches */
function accTeekkari(c,ox,oy,dir,hb){const side=dir>=2,fl=dir===3,W='#f4f0e8',K='#1a1a22',hx=side?(fl?ox+2:ox+3):ox+2,hw=side?7:8;
  F(c,hx-1,oy-2+hb,hw+2,5,PT.o);F(c,hx,oy-1+hb,hw,3,W);F(c,hx,oy+2+hb,hw,1,K);                              // cap and band
  if(dir===0)F(c,ox+3,oy+3+hb,6,1,K);else if(side)F(c,fl?ox:ox+9,oy+3+hb,3,1,K);                             // brim
  const tx=dir===0?ox+10:dir===1?ox+1:fl?ox+9:ox+2;F(c,tx,oy+hb,1,5,K);F(c,tx,oy+5+hb,1,2,'#f8c840');        // tassel
  if(dir<2){F(c,ox+3,oy+9,1,1,'#f8c840');F(c,ox+7,oy+10,1,1,'#3ac0d0');F(c,ox+8,oy+14,1,1,'#f2e6d0');F(c,ox+3,oy+15,1,1,'#3ac0d0');} // patches
  else{F(c,fl?ox+6:ox+5,oy+10,1,1,'#f8c840');F(c,fl?ox+5:ox+6,oy+14,1,1,'#3ac0d0');}}
/* startup founder: hoodie, earbuds, laptop; rides a kick scooter while he runs */
function accStartup(c,ox,oy,dir,hb,z){const side=dir>=2,fl=dir===3;
  if(dir===0){F(c,ox+5,oy+9,2,2,'#5ad8f8');F(c,ox+1,oy+5+hb,1,2,'#f2f2f2');F(c,ox+10,oy+5+hb,1,2,'#f2f2f2');}
  else if(side)F(c,fl?ox+7:ox+4,oy+5+hb,1,2,'#f2f2f2');
  const lx=dir===0?ox-1:dir===1?ox+9:fl?ox+7:ox+1;F(c,lx,oy+9,4,5,PF.o);F(c,lx+1,oy+10,2,3,'#c8ccd8');F(c,lx+1,oy+11,2,1,'#5ad8f8');
  if(z.ph==='run'&&!(z.read>0)){
    if(side){F(c,ox-1,oy+17,14,1,'#c8ccd8');F(c,ox-1,oy+17,2,2,'#14121a');F(c,ox+11,oy+17,2,2,'#14121a');F(c,fl?ox:ox+11,oy+6,1,11,'#c8ccd8');F(c,fl?ox-1:ox+10,oy+6,3,1,'#14121a');}
    else{F(c,ox+4,oy+17,4,1,'#c8ccd8');F(c,ox+5,oy+18,2,1,'#14121a');}}}
function drawStartup(c,z,hb){if(z.hidden)return;const ga=c.globalAlpha,pg=G;
  c.globalAlpha=ga*(z.ph==='pitch'?Math.max(.25,1-z.stT/CFG.startupPitch):1);drawGuest(c,z,hb,PF,accStartup);c.globalAlpha=ga;G=c;
  if(z.ph==='pitch')for(let i=0;i<4;i++){const a=S.clock*9+i*1.6;R(Math.round(z.x+Math.cos(a)*9),Math.round(z.y-10+Math.sin(a)*9),1,1,'#5ad8f8');}
  else if(z.ph==='run'&&!(z.read>0)&&!hb&&z.dir>=2){const s=z.dir===2?-1:1;for(let i=0;i<3;i++)if((Math.floor(S.clock*12)+i)%2)R(Math.round(z.x)+s*(9+i*3)-(s>0?0:4),Math.round(z.y)-5-i*4,4,1,'#c8ccd8');}
  G=pg;}
/* porvari: top hat, monocle, moustache and a bag for your money */
function accPorvari(c,ox,oy,dir,hb){const side=dir>=2,fl=dir===3,K='#14121a',hx=side?(fl?ox+2:ox+3):ox+2,hw=side?7:8;
  F(c,hx,oy-6+hb,hw,7,PV.o);F(c,hx+1,oy-5+hb,hw-2,5,K);F(c,hx+1,oy-5+hb,1,4,'#34343e');F(c,hx+1,oy-1+hb,hw-2,1,'#c03a2e');   // top hat, red band
  F(c,hx-2,oy+hb,hw+4,2,PV.o);F(c,hx-1,oy+hb,hw+2,1,K);                                                                      // brim
  if(dir===0){F(c,ox+6,oy+4+hb,3,3,'#f8c840');F(c,ox+7,oy+5+hb,1,1,PV.eye);F(c,ox+9,oy+6+hb,1,3,'#f8c840');                 // monocle on a chain
    F(c,ox+4,oy+7+hb,4,1,'#f2f2f2');F(c,ox+5,oy+8,2,1,'#c03a2e');F(c,ox+5,oy+9,2,3,'#f2f2f2');}                              // moustache, bow tie, shirt front
  else if(side)F(c,fl?ox+2:ox+9,oy+7+hb,1,1,'#f2f2f2');
  const bx=dir===0?ox+10:dir===1?ox-2:fl?ox-1:ox+9,by=oy+10;
  F(c,bx,by-1,4,2,PV.o);F(c,bx-1,by,6,6,PV.o);F(c,bx,by+1,4,4,'#c8a040');F(c,bx+1,by,2,1,'#a8842a');F(c,bx+1,by+2,2,2,'#7a5a14');}
/* middle manager: thinning hair, tie, headset and a clipboard; holds the invite up before he throws it */
function accManager(c,ox,oy,dir,hb,z){const side=dir>=2,fl=dir===3;
  if(dir<2)F(c,ox+4,oy+hb,4,1,PM.skin);
  if(dir===0){F(c,ox+4,oy+8,4,1,'#f2f2f2');F(c,ox+5,oy+8,2,4,'#c03a2e');F(c,ox+1,oy+3+hb,1,3,'#14121a');F(c,ox+1,oy+6+hb,2,1,'#14121a');}
  else if(side){F(c,fl?ox+4:ox+7,oy+9,1,3,'#c03a2e');F(c,fl?ox+8:ox+3,oy+3+hb,1,3,'#14121a');}
  const cx=dir===0?ox+10:dir===1?ox-1:fl?ox:ox+9;F(c,cx-1,oy+9,5,6,PM.o);F(c,cx,oy+10,3,4,'#f2f2f2');F(c,cx,oy+11,3,1,'#9a8aa8');F(c,cx,oy+13,2,1,'#9a8aa8');
  if(z.throwT>0){F(c,ox-4,oy+2,7,5,PM.o);F(c,ox-3,oy+3,5,3,'#f2f2f2');F(c,ox-3,oy+3,5,1,'#5ad8f8');}}
/* hr: blazer, pencil skirt, bun, glasses and your file. The red ring means one touch ends the game. */
function accHR(c,ox,oy,dir,hb){const side=dir>=2,fl=dir===3;
  if(!side){F(c,ox+1,oy+11,10,4,PH.o);F(c,ox+2,oy+12,8,2,PH.shirt);F(c,ox+2,oy+14,8,1,PH.shirtDk);}
  else{F(c,ox+2,oy+11,8,4,PH.o);F(c,ox+3,oy+12,6,2,PH.shirt);F(c,ox+3,oy+14,6,1,PH.shirtDk);}
  if(dir===0){F(c,ox+4,oy-2+hb,4,3,PH.o);F(c,ox+5,oy-1+hb,2,2,PH.hair);F(c,ox+3,oy+4+hb,6,1,'#14121a');
    F(c,ox+3,oy+9,6,4,PH.o);F(c,ox+4,oy+10,4,2,'#f2f2f2');F(c,ox+4,oy+10,4,1,'#c8c8d8');}
  else if(dir===1){F(c,ox+4,oy+1+hb,4,4,PH.o);F(c,ox+5,oy+2+hb,2,2,PH.hairLt);}
  else{F(c,fl?ox+8:ox+1,oy+1+hb,3,4,PH.o);F(c,fl?ox+9:ox+2,oy+2+hb,1,2,PH.hair);F(c,fl?ox+2:ox+8,oy+4+hb,2,1,'#14121a');
    F(c,fl?ox+1:ox+7,oy+9,4,5,PH.o);F(c,fl?ox+2:ox+8,oy+10,2,3,'#f2f2f2');}}
function drawHR(c,z,hb){const pg=G,X=Math.round(z.x),Y=Math.round(z.y),live=z.life>0;G=c;
  if(live)ell(X,Y,10+Math.floor(S.clock*6)%2,3,'rgba(224,74,58,.45)');
  drawGuest(c,z,hb,PH,accHR);G=c;
  if(live&&Math.floor(S.clock*5)%2)txt('!',X,Y-31,'#e04a3a',1,'c','#140a14');
  G=pg;}
/* The office's zombies (LEVELS zskin): ordinary people in shirts and ties with a mug in hand. Same brain as any zombie. */
function drawOfficeZombie(c,z,hb,dir,fr){const P=PO[(z.i||0)%PO.length],ox=Math.round(z.x)-6,oy=Math.round(z.y)-17,rd=z.read>0;
  drawHuman(c,z.x,z.y,dir,fr,P,{hb,read:rd?z.readK:0});if(rd)return;
  if(dir===0){F(c,ox+4,oy+8,4,1,'#f2f2f2');F(c,ox+5,oy+8,2,4,P.tie);F(c,ox+8,oy+10,2,2,'#f2f2f2');           // collar, tie, name badge
    F(c,ox+4,oy+7+hb,1,1,P.skinDk);F(c,ox+7,oy+7+hb,1,1,P.skinDk);}                                          // not enough sleep
  else if(dir>=2)F(c,dir===3?ox+4:ox+7,oy+9,1,3,P.tie);
  const mx=dir===0?ox+10:dir===1?ox-1:dir===3?ox:ox+9;F(c,mx,oy+10,3,4,P.o);F(c,mx+1,oy+11,1,2,'#f2f2f2');}  // the mug never leaves the hand
const ZOFFICE={name:'OFFICE ZOMBIE',say:OFFICEQ,read:OFFICEREADQ,vibe:OFFICEVIBEQ,caught:'WELCOME TO THE TEAM.',catcher:'office',
  puddle:'coffee',spit:['#6a4428','#8a5a3a','#4a2e1a','#c8a878'],draw:drawOfficeZombie};
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

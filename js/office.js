"use strict";
/* The office's own rules (hooked in through LEVELS: setup, tick). The middle manager's meeting invites fly across the floor
   and root you to the spot for a moment. HR shows up rarely, after a warning, at the door farthest from you: she comes for
   you for a few seconds and one touch ends the game, whatever your zombie count. Then she walks back and waits for next time. */
const OFFICE_DOORS=[{x:40,y:42},{x:280,y:42}]; // in front of the lifts, in front of the HR door
function setupOffice(){L.office={hrT:CFG.hrFirst,warn:null,invites:[]};}
function officeTick(dt){const o=L.office;
  if(!enemiesHeld())updInvites(enemyDt(dt));
  if(L.zs.some(z=>z.done)){for(const z of L.zs)if(z.done)puff(z.x,z.y,['#a02848','#f2f2f2','#c8c0b0']);L.zs=L.zs.filter(z=>!z.done);o.hrT=CFG.hrEvery[0]+Math.random()*(CFG.hrEvery[1]-CFG.hrEvery[0]);} // she left: next visit later
  if(o.warn){o.warn.t-=dt;if(o.warn.t<=0){hrArrives(o.warn);o.warn=null;}return;}
  if(L.open||L.zs.some(z=>z.k==='hr'))return;
  o.hrT-=dt;if(o.hrT>0)return;
  let best=OFFICE_DOORS[0],bd=-1;for(const s of OFFICE_DOORS){const d=Math.hypot(s.x-L.p.x,s.y-L.p.y);if(d>bd){bd=d;best=s;}}
  o.warn={x:best.x,y:best.y,t:CFG.hrWarn};L.banner={a:'HR WOULD LIKE A WORD.',b:'ONE TOUCH ENDS THE GAME. KEEP YOUR DISTANCE.',c:'',t:CFG.hrWarn+1.5};SFX.alarm();}
function hrArrives(w){const z=newFoe('hr',w.x,w.y);z.home={x:w.x,y:w.y};z.life=CFG.hrStay;z.say=pick(FOEQ.hr.say);z.sayT=2.5;z.bubbleT=5;L.zs.push(z);
  puff(z.x,z.y,['#a02848','#f2f2f2','#c8c0b0']);floater(z.x,z.y-28,'HR!','#e04a3a');FOES.hr.voice();}
function updInvites(dt){const o=L.office,p=L.p;
  for(const m of o.invites){m.t-=dt;m.age+=dt;const steps=Math.max(1,Math.ceil(CFG.inviteSpeed*dt/3));
    for(let i=0;i<steps;i++){const nx=m.x+m.vx*dt/steps,ny=m.y+m.vy*dt/steps;if(boxHits(nx,ny,2,2)){m.done=true;break;}m.x=nx;m.y=ny;
      if(Math.hypot(m.x-p.x,m.y-p.y)<8){m.done=true;meeting();break;}}
    if(m.t<=0)m.done=true;}
  o.invites=o.invites.filter(m=>!m.done);}
function meeting(){const p=L.p;if(p.meetCd>0)return; // no back-to-back meetings
  p.stuck=CFG.meetingTime;p.meetCd=CFG.meetingTime+CFG.meetingCooldown;p.vx=p.vy=0;floater(p.x,p.y-22,'MEETING!','#5ad8f8');SFX.invite();}

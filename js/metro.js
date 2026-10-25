"use strict";
/* The last metro: change tracks, brake for amber signals, and reach the depot before time runs out. */
const METRO_TRACKS=[80,160,240],METRO_TRAIN_Y=184;

function setupMetro(){
  const m=L.metro={x:160,lane:1,hp:CFG.metroHealth,speed:CFG.metroSpeed,distance:0,timeLeft:CFG.metroTimeLimit,
    objects:[],particles:[],combo:0,comboT:0,maxCombo:0,hits:0,signals:0,crashes:0,hitT:0,scroll:0,
    braking:false,steerHeld:0,repeatT:0,shiftFrom:160,shiftT:CFG.metroLaneTime,feedback:'',feedbackT:0,finished:false,dead:false,failure:''};
  // A repeatable route makes another try something the player can learn.
  const random=rng(505);let id=0,row=0;
  for(let distance=280;distance<CFG.metroLength-240;distance+=CFG.metroRowGap,row++){
    const progress=distance/CFG.metroLength,safe=Math.floor(random()*3),blocked=[0,1,2].filter(lane=>lane!==safe);
    if(random()<.5)blocked.reverse();
    const count=progress>.38&&random()<.55?2:1;
    for(let i=0;i<count;i++){
      const lane=blocked[i],kind=progress>.14&&row%5===3&&i===0?'signal':'debris';
      m.objects.push({id:id++,lane,kind,distance,y:METRO_TRAIN_Y-distance,variant:row%2?'crate':'rubble'});
      // Braking through a caution gives a tempting scoring line, with a clear route alongside it.
      if(kind==='signal')m.objects.push({id:id++,lane,kind:'zombie',distance:distance+38,y:METRO_TRAIN_Y-distance-38});
    }
    m.objects.push({id:id++,lane:safe,kind:'zombie',distance,y:METRO_TRAIN_Y-distance});
  }
  // The station is a checkpoint, so wrecking the train offers a clean metro retry.
  S.cp=S.level;S.cpScore=S.lvScore;S.stats.reached='L'+(S.level+1);
}

function metroSwitch(delta){const m=L&&L.metro;if(!m||m.dead||m.finished)return;
  const lane=Math.max(0,Math.min(2,m.lane+delta));if(lane===m.lane)return;
  m.lane=lane;m.shiftFrom=m.x;m.shiftT=0;
}
function metroKey(e){const m=L&&L.metro;if(!m||S.mode!=='play'||e.repeat)return;
  const key=e.key.toLowerCase(),dir=key==='arrowleft'||key==='a'?-1:key==='arrowright'||key==='d'?1:0;
  if(dir){metroSwitch(dir);m.steerHeld=dir;m.repeatT=.24;}
}
function metroFeedback(text,color){const m=L.metro;m.feedback=text;m.feedbackColor=color||'#f8c840';m.feedbackT=1.1;}
function metroBurst(x,y,color,n){const m=L.metro;
  for(let i=0;i<n;i++)m.particles.push({x,y,vx:(Math.random()-.5)*95,vy:(Math.random()-.5)*85,
    t:.35+Math.random()*.25,life:.6,col:color});
}
function metroDamage(kind){const m=L.metro;if(m.hitT>0||m.dead||m.finished)return;
  m.hp--;m.crashes++;m.combo=0;m.comboT=0;m.hitT=1.2;m.speed=Math.min(m.speed,CFG.metroBrakeSpeed);
  metroFeedback(kind==='signal'?'TOO FAST!':'DEBRIS!','#e04a3a');metroBurst(m.x,METRO_TRAIN_Y-12,'#f8c840',14);SFX.metroCrash();
  if(m.hp<=0)metroFail('METRO WRECKED!');
}
function metroFail(reason){const m=L.metro;if(m.dead||m.finished)return;
  m.dead=true;m.failure=reason;S.mode='gameover';S.t=0;
}
function metroFinish(){const m=L.metro;if(m.dead||m.finished)return;
  m.finished=true;L.bonus=CFG.metroFinishBonus+m.hp*CFG.metroHealthBonus+Math.floor(m.timeLeft)*10;
  S.score+=L.bonus;S.stats.esc++;S.stats.reached='ESC';S.mode='clear';S.t=0;SFX.win();
}
function updateMetro(dt){const m=L&&L.metro;if(!m||S.mode!=='play'||m.dead||m.finished)return;
  // Small steps preserve collision and steering timing even when a browser frame arrives late.
  const steps=Math.max(1,Math.ceil(dt/.025)),step=dt/steps;
  for(let i=0;i<steps&&S.mode==='play';i++)metroStep(step);
}
function metroStep(dt){const m=L.metro;
  if(m.timeLeft<=0){metroFail('TIME RAN OUT!');return;}
  dt=Math.min(dt,m.timeLeft);
  const left=down('arrowleft')||down('a'),right=down('arrowright')||down('d'),dir=(right?1:0)-(left?1:0);
  m.repeatT-=dt;
  if(dir){if(dir!==m.steerHeld||m.repeatT<=0){metroSwitch(dir);m.repeatT=.24;}}else m.repeatT=0;
  m.steerHeld=dir;
  const braking=down(' ')||down('arrowdown')||down('s');
  if(braking&&!m.braking)SFX.metroBrake();m.braking=braking;
  const target=braking?CFG.metroBrakeSpeed:CFG.metroSpeed;
  m.speed+=(target-m.speed)*Math.min(1,dt*(braking?9:3));
  m.shiftT=Math.min(CFG.metroLaneTime,m.shiftT+dt);
  const shift=m.shiftT/CFG.metroLaneTime,ease=shift*shift*(3-2*shift);
  m.x=m.shiftFrom+(METRO_TRACKS[m.lane]-m.shiftFrom)*ease;
  m.hitT=Math.max(0,m.hitT-dt);m.feedbackT=Math.max(0,m.feedbackT-dt);
  m.comboT=Math.max(0,m.comboT-dt);if(!m.comboT)m.combo=0;
  const previous=m.distance;m.distance=Math.min(CFG.metroLength,m.distance+m.speed*dt);m.scroll=m.distance%24;
  m.timeLeft=Math.max(0,m.timeLeft-dt);L.time+=dt;
  for(const o of m.objects){o.y=METRO_TRAIN_Y-(o.distance-m.distance);
    if(o.done||o.distance<previous-13||o.distance>m.distance+13||Math.abs(m.x-METRO_TRACKS[o.lane])>27)continue;
    o.done=true;
    if(o.kind==='zombie'){
      m.hits++;m.combo=Math.min(5,m.combo+1);m.maxCombo=Math.max(m.maxCombo,m.combo);m.comboT=3.4;
      const points=CFG.metroZombiePoints*m.combo;S.score+=points;
      metroFeedback('+'+points+' ZOMBIE!','#9dbb6c');metroBurst(METRO_TRACKS[o.lane],METRO_TRAIN_Y-10,'#9dbb6c',8);SFX.metroHit();
    }else if(o.kind==='signal'&&m.speed<=60){
      m.signals++;S.score+=50;metroFeedback('SLOW SIGNAL +50','#f8c840');SFX.blip();
    }else metroDamage(o.kind);
    if(m.dead)return;
  }
  m.objects=m.objects.filter(o=>!o.done&&o.distance>=m.distance-90);
  for(const p of m.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.t-=dt;}m.particles=m.particles.filter(p=>p.t>0);
  if(m.distance>=CFG.metroLength)metroFinish();else if(m.timeLeft<=0)metroFail('TIME RAN OUT!');
}

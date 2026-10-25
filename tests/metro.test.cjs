const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

// Exercise actual input and game flow without browser graphics or audio devices.
const sources=['core','config','content','enemies','levels','metro','state','physics','update','input']
  .map(name=>[name,fs.readFileSync(path.join(__dirname,'..','js',name+'.js'),'utf8')]);
function game(metro=true){
  const listeners={},canvas={hidden:true,getContext:()=>({}),addEventListener(){}},math=Object.create(Math);math.random=()=>.5;
  const context=vm.createContext({Math:math,window:{},document:{getElementById:()=>canvas},qaListeners:listeners,qaMusic:null,qaSaved:0,qaMetro:metro,
    addEventListener:(name,fn)=>{listeners[name]=fn;},audioInit(){},syncAudioPause(){},loadScores:()=>[],
    saveScores:()=>{context.qaSaved++;},music:m=>{context.qaMusic=m;},tn(){},nz(){},anow:()=>0,SFX:new Proxy({},{get:()=>()=>{}})});
  const run=code=>vm.runInContext(code,context);
  for(const [name,source] of sources)vm.runInContext(source,context,{filename:name+'.js'});
  run(`
    for(const level of LEVELS){const solid=Array.from({length:ROWS},(_,r)=>Array.from({length:COLS},(_,c)=>r===0||r===ROWS-1||c===0||c===COLS-1));
      GEO.push({solid,doors:[[9,13],[10,13]],ok:solid.map(row=>row.map(cell=>!cell))});}
    function press(key){qaListeners.keydown({key,repeat:false,preventDefault(){}});qaListeners.keyup({key});}
    startGame();if(qaMetro){S.level=4;toIntro(false);}S.t=.5;press('Enter');
  `);
  return run;
}

test('new games and pause-menu restarts begin at the cabin',()=>{
  const run=game(false);
  assert.equal(run('S.level'),0);
  assert.equal(run('S.mode'),'play');
  assert.equal(run('S.stats.reached'),'L1');
  assert.equal(run('S.cp'),-1);
  assert.equal(run('L.metro'),undefined);
  run("S.level=4;toIntro(false);S.t=.5;press('Enter');press('p');press('r')");
  assert.equal(run('S.mode'),'intro');
  assert.equal(run('S.level'),0);
  assert.equal(run('L.metro'),undefined);
  assert.equal(run('S.cp'),-1);
});

test('entering the metro creates a station checkpoint',()=>{
  const run=game();
  assert.equal(run('S.level'),4);
  assert.equal(run('S.mode'),'play');
  assert.equal(run('S.stats.reached'),'L5');
  assert.equal(run('S.cp'),4);
  assert.equal(run('L.metro.hp'),run('CFG.metroHealth'));
  assert.equal(run('L.zs.length'),0);
  assert.equal(run('L.metro.distance'),0);
});

test('the cabin starts with walking mechanics and night music',()=>{
  const run=game(false);
  assert.equal(run('S.level'),0);
  assert.equal(run('S.stats.reached'),'L1');
  assert.equal(run('L.metro'),undefined);
  assert.equal(run('L.zs.length'),1);
  run("S.t=.5;press('Enter');update(0)");
  assert.equal(run('qaMusic'),'night');
  run("L.p.mic=true;press('r')");
  assert.equal(run('S.mode'),'rap');
});

test('escaping Kontula advances into the metro instead of ending the game',()=>{
  const run=game();run("S.level=3;toIntro(false);S.mode='clear';S.t=1;press('Enter')");
  assert.equal(run('S.mode'),'intro');
  assert.equal(run('S.level'),4);
  assert.equal(run('Boolean(L.metro)'),true);
  assert.equal(run('S.cp'),4);
});

test('keyboard taps, held keys, and touch stick shift tracks without a doubled first step',()=>{
  const run=game();run("press('ArrowLeft')");
  assert.equal(run('L.metro.lane'),0);
  run("qaListeners.keydown({key:'ArrowRight',repeat:false,preventDefault(){}});updateMetro(.01)");
  assert.equal(run('L.metro.lane'),1);
  run('updateMetro(.6)');
  assert.equal(run('L.metro.lane'),2);
  run("qaListeners.keyup({key:'ArrowRight'});tkeys.arrowleft=true;updateMetro(.6)");
  assert.equal(run('L.metro.lane'),0);
  run('tkeys.arrowleft=false;updateMetro(.2)');
  assert.equal(run('Math.abs(L.metro.x-METRO_TRACKS[0])<.001'),true);
  run("press('ArrowLeft')");
  assert.equal(run('L.metro.lane'),0);
});

test('holding and releasing the brake changes speed without throwing magazines or rapping',()=>{
  const run=game();run("qaListeners.keydown({key:' ',repeat:false,preventDefault(){}});updateMetro(.6)");
  const slow=run('L.metro.speed');
  assert.equal(run('L.metro.braking'),true);
  assert.ok(slow<run('CFG.metroSpeed')*.6);
  assert.equal(run('L.projs.length'),0);
  assert.equal(run('L.p.mags'),run('CFG.magsStart'));
  run("qaListeners.keyup({key:' '});updateMetro(.6)");
  assert.equal(run('L.metro.braking'),false);
  assert.ok(run('L.metro.speed')>slow+20);
  run("tkeys[' ']=true;updateMetro(.6);L.p.mic=true;press('r')");
  assert.equal(run('L.metro.braking'),true);
  assert.equal(run('S.mode'),'play');
  assert.equal(run('L.rap'),null);
});

test('zombie hits score once and build a bounded combo that expires',()=>{
  const run=game();run("L.metro.objects=[{kind:'zombie',lane:1,distance:0}];updateMetro(0)");
  assert.equal(run('S.score'),run('CFG.metroZombiePoints'));
  assert.equal(run('L.metro.hits'),1);
  run('updateMetro(0)');
  assert.equal(run('L.metro.hits'),1);
  run("L.metro.objects=[{kind:'zombie',lane:1,distance:0}];updateMetro(0)");
  assert.equal(run('S.score'),run('CFG.metroZombiePoints*3'));
  run("for(let i=0;i<6;i++){L.metro.objects=[{kind:'zombie',lane:1,distance:0}];updateMetro(0)}");
  assert.equal(run('L.metro.combo'),5);
  assert.equal(run('L.metro.maxCombo'),5);
  run('L.metro.objects=[];updateMetro(3.5)');
  assert.equal(run('L.metro.combo'),0);
});

test('collisions use the moving train position and invulnerability prevents repeated damage',()=>{
  const run=game();run("L.metro.x=L.metro.shiftFrom=80;L.metro.lane=2;L.metro.shiftT=0;L.metro.objects=[{kind:'debris',lane:0,distance:0}];updateMetro(0)");
  assert.equal(run('L.metro.hp'),run('CFG.metroHealth-1'));
  run("L.metro.objects=[{kind:'debris',lane:0,distance:0}];updateMetro(0)");
  assert.equal(run('L.metro.hp'),run('CFG.metroHealth-1'));
  assert.equal(run('L.metro.crashes'),1);
});

test('a wreck can retry from the station with fresh health and the entry score',()=>{
  const run=game();run("S.score=4200;toIntro(false);S.mode='play';L.metro.hp=1;L.metro.objects=[{kind:'debris',lane:1,distance:0}];updateMetro(0)");
  assert.equal(run('S.mode'),'gameover');
  assert.equal(run('L.metro.dead'),true);
  const time=run('L.metro.timeLeft');run('updateMetro(1)');
  assert.equal(run('L.metro.timeLeft'),time);
  run("S.t=1.3;press('Enter')");
  assert.equal(run('S.mode'),'intro');
  assert.equal(run('S.level'),4);
  assert.equal(run('S.score'),4200);
  assert.equal(run('L.metro.hp'),run('CFG.metroHealth'));
  assert.equal(run('L.metro.distance'),0);
  assert.equal(run('L.metro.dead'),false);
});

test('amber signals reward a slow pass and damage a train passing too fast',()=>{
  for(const speed of [42,96]){
    const run=game();run(`L.metro.speed=${speed};L.metro.objects=[{kind:'signal',lane:1,distance:0}];updateMetro(0)`);
    assert.equal(run('L.metro.hp'),run('CFG.metroHealth')-(speed>60?1:0));
    assert.equal(run('L.metro.signals'),speed>60?0:1);
    assert.equal(run('S.score'),speed>60?0:50);
  }
});

test('pause freezes metro movement and the metro music mode stays selected',()=>{
  const run=game();run('update(.1)');
  assert.equal(run('qaMusic'),'metro');
  run("press('p')");const before=run('JSON.stringify(L.metro)');run('update(.6)');
  assert.equal(run('JSON.stringify(L.metro)'),before);
  assert.equal(run('qaMusic'),'metro');
  run("press('Enter');update(.1)");
  assert.equal(run('S.mode'),'play');
  assert.ok(run('L.metro.distance')>0);
});

test('the repeatable route leaves a safe lane and can be completed at full speed without damage',()=>{
  const run=game(),route=run('JSON.stringify(L.metro.objects)');run('setupMetro()');
  assert.equal(run('JSON.stringify(L.metro.objects)'),route);
  assert.equal(run("[...new Set(L.metro.objects.filter(o=>o.kind!=='zombie').map(o=>o.distance))].every(d=>new Set(L.metro.objects.filter(o=>o.distance===d&&o.kind!=='zombie').map(o=>o.lane)).size<=2)"),true);
  run(`for(let i=0;i<6000&&S.mode==='play';i++){
    const m=L.metro,hazards=m.objects.filter(o=>o.kind!=='zombie'&&o.distance>=m.distance-13),d=Math.min(...hazards.map(o=>o.distance));
    const blocked=new Set(hazards.filter(o=>o.distance===d).map(o=>o.lane)),lane=[0,1,2].find(l=>!blocked.has(l));
    tkeys.arrowleft=lane<m.lane;tkeys.arrowright=lane>m.lane;updateMetro(1/60);
  }`);
  assert.equal(run('S.mode'),'clear');
  assert.equal(run('L.metro.hp'),run('CFG.metroHealth'));
  assert.equal(run('L.metro.crashes'),0);
  assert.ok(run('L.metro.timeLeft')>0);
  assert.ok(run('L.bonus')>=run('CFG.metroFinishBonus'));
});

test('holding the brake for the entire trip runs out of time',()=>{
  const run=game();run("L.metro.objects=[];tkeys[' ']=true;updateMetro(CFG.metroTimeLimit+.1)");
  assert.equal(run('S.mode'),'gameover');
  assert.equal(run('L.metro.timeLeft'),0);
  assert.ok(run('L.metro.distance')<run('CFG.metroLength'));
});

test('finishing awards once and continues through victory to a saved score',()=>{
  const run=game();run('L.metro.objects=[];L.metro.distance=CFG.metroLength-1;updateMetro(.05)');
  assert.equal(run('S.mode'),'clear');
  assert.equal(run('S.stats.esc'),1);
  assert.equal(run('S.stats.reached'),'ESC');
  const score=run('S.score');run('updateMetro(1)');
  assert.equal(run('S.score'),score);
  run("S.t=1;press('Enter')");assert.equal(run('S.mode'),'victory');
  assert.equal(run('S.won'),true);
  run("S.t=1.3;press('Enter')");assert.equal(run('S.mode'),'entry');
  run("press('A');press('B');press('C');press('Enter')");
  assert.equal(run('S.mode'),'scores');
  assert.equal(run('S.scores[0].n'),'ABC');
  assert.equal(run('S.scores[0].w'),'ESC');
  assert.equal(run('qaSaved'),1);
});

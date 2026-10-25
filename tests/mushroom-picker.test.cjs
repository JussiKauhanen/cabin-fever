const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Run the real game logic without a browser, rendering, saved scores, or audio.
const sources = ['core', 'config', 'content', 'enemies', 'levels', 'state', 'physics', 'update', 'input']
  .map(name => [name, fs.readFileSync(path.join(__dirname, '..', 'js', name + '.js'), 'utf8')]);
function game() {
  const canvas = {getContext: () => ({}), addEventListener() {}};
  const math = Object.create(Math);math.random = () => .5;
  const context = vm.createContext({Math: math, window: {}, document: {getElementById: () => canvas},
    addEventListener() {}, audioInit() {}, syncAudioPause() {}, loadScores: () => [],
    music() {}, tn() {}, nz() {}, anow: () => 0, SFX: new Proxy({}, {get: () => () => {}})});
  const run = code => vm.runInContext(code, context);
  for (const [name, source] of sources) vm.runInContext(source, context, {filename: name + '.js'});
  run(`
    for(const level of LEVELS){
      const solid=Array.from({length:ROWS},(_,r)=>Array.from({length:COLS},(_,c)=>r===0||r===ROWS-1||c===0||c===COLS-1));
      GEO.push({solid,doors:[[9,13],[10,13]],ok:solid.map(row=>row.map(cell=>!cell))});
    }
    startGame();S.level=2;setupLevel();S.mode='play';S.score=0;
    L.time=10;L.grace=0;L.vibe=0;L.pending=[];L.items=[];L.stashT=L.micT=999;
    L.p.x=240;L.p.y=180;
    var granny=L.zs.find(z=>z.k==='granny');granny.x=80;granny.y=80;granny.pickT=999;granny.bubbleT=999;L.zs=[granny];
    function zombie(x=granny.x+5,y=granny.y){return Object.assign(newZombie(x,y,0),{spd:0,pukeT:999,bubbleT:999,still:-999});}
  `);
  return run;
}

test('healthy picker is harmless and ignores thrown magazines', () => {
  const run=game();
  assert.equal(run('granny.grannyState'), 'healthy');
  assert.equal(run('granny.calm'), true);
  run('granny.x=L.p.x;granny.y=L.p.y;updPlay(0)');
  assert.equal(run('S.mode'), 'play');
  assert.equal(run('canReadMag(granny)'), false);
  run('L.projs.push({x:granny.x,y:granny.y,vx:0,vy:0,t:1,spin:0,k:1});updPlay(0)');
  assert.equal(run('L.projs.length'), 1);
  assert.equal(run('granny.read'), 0);
  assert.equal(run('S.stats.mags'), 0);
  run('startRead(granny)');
  assert.equal(run('granny.calm'), true);
  assert.equal(run('S.stats.mags'), 0);
});

test('ordinary zombie contact in actual play starts a harmless transformation once', () => {
  const run=game();
  run('L.zs.push(zombie());updPlay(0)');
  assert.equal(run('granny.grannyState'), 'turning');
  assert.equal(run('granny.calm'), true);
  assert.equal(run('granny.turnT'), run('CFG.grannyTurnTime'));
  assert.equal(run('Boolean(granny.say&&L.floats.length)'), true);
  run('granny.turnT-=.2;checkGrannyInfection()');
  assert.equal(run('granny.turnT'), run('CFG.grannyTurnTime-.2'));
  run('startRead(granny)');
  assert.equal(run('granny.grannyState'), 'turning');
  assert.equal(run('granny.calm'), true);
  run('updFoe(granny,CFG.grannyTurnTime)');
  assert.equal(run('granny.grannyState'), 'infected');
  assert.equal(run('granny.calm'), false);
});

test('infection requires nearby ordinary, active zombies with a clear path', () => {
  for (const setup of [
    'var z=zombie();z.read=3;L.zs.push(z)',
    "L.zs.push(newFoe('bear',granny.x,granny.y))",
    'L.zs.push(zombie(granny.x+16,granny.y))',
    'L.zs.push(zombie());L.grace=1',
    'L.zs.push(zombie());L.vibe=1',
    'granny.x=78;granny.y=88;L.solid[5][5]=true;L.zs.push(zombie(89,88))'
  ]) {
    const run=game();run(setup+';checkGrannyInfection()');
    assert.equal(run('granny.grannyState'), 'healthy', setup);
  }
});

test('pause, rap, and post-rap vibe freeze a pending transformation', () => {
  const run=game();run('infectGranny(granny)');
  const remaining=run('granny.turnT');
  run("S.mode='pause';update(.2)");
  assert.equal(run('granny.turnT'), remaining);
  run("S.mode='play';L.p.mic=true;startRap();update(.2)");
  assert.equal(run('granny.turnT'), remaining);
  run("S.mode='play';L.vibe=2;updPlay(.1)");
  assert.equal(run('granny.turnT'), remaining);
});

test('infected picker warns before throwing and magazines interrupt the throw', () => {
  const run=game();
  run("granny.grannyState='infected';granny.calm=false;granny.mushroomT=0;L.p.x=160;L.p.y=80;updFoe(granny,.01)");
  assert.equal(run('granny.throwT>0'), true);
  assert.equal(run('L.mushrooms.length'), 0);
  assert.equal(run('Boolean(granny.say)'), true);
  run('updFoe(granny,.7)');
  assert.equal(run('L.mushrooms.length'), 1);
  assert.equal(run('L.mushrooms[0].vx>0&&L.mushrooms[0].vy===0'), true);
  run('granny.mushroomT=0;updFoe(granny,.01);startRead(granny);L.mushrooms=[];updFoe(granny,.7)');
  assert.equal(run('L.mushrooms.length'), 0);
  assert.equal(run('granny.read>0'), true);
});

test('mushrooms cause a slip, stop at walls, and expire without catching the player', () => {
  const run=game();run('L.zs=[];L.p.x=100;L.p.y=88');
  run('L.mushrooms.push({x:96,y:88,vx:100,vy:0,t:1,age:0});updMushrooms(.05)');
  assert.equal(run('L.p.slip>0'), true);
  assert.equal(run('S.mode'), 'play');
  assert.equal(run('S.stats.caught'), 0);
  assert.equal(run('L.mushrooms.length'), 0);
  run('L.p.slip=0;L.solid[5][5]=true;L.mushrooms.push({x:77,y:88,vx:120,vy:0,t:1,age:0});updMushrooms(.05)');
  assert.equal(run('L.mushrooms.length'), 0);
  assert.equal(run('L.p.slip'), 0);
  run('L.mushrooms.push({x:200,y:180,vx:0,vy:0,t:.01,age:0});updMushrooms(.05)');
  assert.equal(run('L.mushrooms.length'), 0);
});

test('pause and rap freeze flying mushrooms; vibe prevents hits', () => {
  const run=game();
  run('L.mushrooms.push({x:100,y:100,vx:100,vy:0,t:1,age:0})');
  const before=run('JSON.stringify(L.mushrooms)');
  run("S.mode='pause';update(.1)");
  assert.equal(run('JSON.stringify(L.mushrooms)'), before);
  run("S.mode='play';L.p.mic=true;startRap();update(.1)");
  assert.equal(run('JSON.stringify(L.mushrooms)'), before);
  run('L.p.x=100;L.p.y=100;L.vibe=1;updMushrooms(.01)');
  assert.equal(run('L.p.slip'), 0);
});

test('saving at sunrise awards one bonus and prevents a later bite', () => {
  const run=game();run('L.time=L.d.night-.01;L.grace=999;updPlay(.02)');
  assert.equal(run('L.grannySaved'), true);
  assert.equal(run('L.grannyBonus'), run('CFG.grannySafeBonus'));
  assert.equal(run('S.score'), run('CFG.grannySafeBonus'));
  run('updPlay(.1)');
  assert.equal(run('S.score'), run('CFG.grannySafeBonus'));
  run('L.grace=0;L.zs.push(zombie());checkGrannyInfection()');
  assert.equal(run('granny.grannyState'), 'healthy');
  run('L.p.y=218;updPlay(0)');
  assert.equal(run('S.score'), run('CFG.grannySafeBonus+CFG.escapeBonus*3*S.zombies'));
});

test('turning or absent pickers receive no bonus', () => {
  for(const setup of ['infectGranny(granny)', 'L.zs=[]']) {
    const run=game();run(setup+';L.time=L.d.night-.01;L.grace=999;updPlay(.02)');
    assert.equal(run('L.grannySaved'), false);
    assert.equal(run('L.grannyBonus'), 0);
    assert.equal(run('S.score'), 0);
  }
});

test('life retries and checkpoint retries reset the encounter', () => {
  for(const retry of ['toIntro(true)', 'S.cp=2;S.cpScore=1234;continueGame()']) {
    const run=game();
    run('infectGranny(granny);L.mushrooms.push({x:100,y:100,vx:100,vy:0,t:1,age:0});L.grannySaved=true;L.grannyBonus=CFG.grannySafeBonus;'+retry);
    assert.equal(run("L.zs.find(z=>z.k==='granny').grannyState"), 'healthy');
    assert.equal(run("L.zs.find(z=>z.k==='granny').calm"), true);
    assert.equal(run('L.mushrooms.length'), 0);
    assert.equal(run('L.grannySaved'), false);
    assert.equal(run('L.grannyBonus'), 0);
  }
});

test('a dodged mushroom lands at its marked target and leaves one small patch', () => {
  const run=game();
  run("granny.grannyState='infected';granny.calm=false;granny.mushroomT=0;L.p.x=160;L.p.y=80;updFoe(granny,.01);updFoe(granny,.7)");
  run('L.p.x=240;L.p.y=180;updMushrooms(CFG.mushroomLife+.1)');
  assert.equal(run('L.mushrooms.length'), 0);
  assert.equal(run('L.puddles.filter(p=>p.mushroom).length'), 1);
  assert.equal(run('Math.abs(L.puddles[0].x-160)<.001&&Math.abs(L.puddles[0].y-80)<.001'), true);
  assert.equal(run('L.puddles[0].t'), run('CFG.mushroomBitsLife'));
  assert.equal(run('onPuddle(160,80)'), true);
  assert.equal(run('onPuddle(180,80)'), false);
});

test('player and wall impacts scatter mushroom pieces on walkable ground', () => {
  for(const setup of [
    'L.p.x=100;L.p.y=88;L.mushrooms.push({x:96,y:88,vx:100,vy:0,t:1,age:0})',
    'L.p.x=100;L.p.y=88;L.solid[5][5]=true;L.mushrooms.push({x:77,y:88,vx:120,vy:0,t:1,age:0})'
  ]) {
    const run=game();run(setup+';updMushrooms(.05)');
    assert.equal(run('L.mushrooms.length'), 0);
    assert.equal(run('L.puddles.filter(p=>p.mushroom).length'), 1);
    assert.equal(run('L.puddles[0].chunks.length>1'), true);
    assert.equal(run('boxHits(L.puddles[0].x,L.puddles[0].y,2,2)'), false);
    assert.equal(run('S.stats.caught'), 0);
  }
});

test('mushroom pieces trip the player briefly and leave no hazard after expiry', () => {
  const run=game();
  run('L.zs=[];L.mushrooms.push({x:120,y:88,vx:0,vy:0,t:.01,age:0});updMushrooms(.05)');
  run('L.p.x=120;L.p.y=88;updPlay(0)');
  assert.equal(run('L.p.slip>0'), true);
  assert.equal(run('S.mode'), 'play');
  run('L.p.x=240;L.p.y=180;L.p.vx=L.p.vy=0;updPlay(CFG.mushroomBitsLife+.01)');
  assert.equal(run('L.puddles.some(p=>p.mushroom)'), false);
  assert.equal(run('onPuddle(120,88)'), false);
  run('L.p.x=120;L.p.y=88;L.p.slip=0;L.p.wasOn=false;updPlay(0)');
  assert.equal(run('L.p.slip'), 0);
});

test('pause and rap preserve mushroom pieces; a level retry clears them', () => {
  const run=game();
  run('L.mushrooms.push({x:120,y:88,vx:0,vy:0,t:.01,age:0});updMushrooms(.05)');
  const before=run('JSON.stringify(L.puddles)');
  run("S.mode='pause';update(.5)");
  assert.equal(run('JSON.stringify(L.puddles)'), before);
  run("S.mode='play';L.p.mic=true;startRap();update(.5)");
  assert.equal(run('JSON.stringify(L.puddles)'), before);
  run("S.mode='play';updPlay(.5)");
  assert.equal(run('L.puddles[0].t'), run('CFG.mushroomBitsLife-.5'));
  run('toIntro(true)');
  assert.equal(run('L.puddles.length'), 0);
});

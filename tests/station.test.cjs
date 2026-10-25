const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Run the real platform rules (trains, inspector, first-train exit) without a browser, rendering or audio.
const sources = ['core', 'config', 'content', 'enemies', 'station', 'levels', 'state', 'physics', 'update', 'input']
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
      GEO.push({solid,doors:[],ok:solid.map(row=>row.map(cell=>!cell))});
    }
    startGame();S.level=LEVELS.findIndex(d=>d.tick);setupLevel();S.mode='play';S.score=0;
    L.time=10;L.grace=0;L.vibe=0;L.pending=[];L.items=[];L.stashT=L.micT=999;L.station.annT=999;L.station.nextT=999;
    L.p.x=160;L.p.y=180;
    function zombie(x,y){return Object.assign(newZombie(x,y,0),{spd:0,pukeT:999,bubbleT:999,still:-999});}
    function pass(k){L.station.trains.push(newTrain(k));for(let i=0;i<120&&S.mode==='play';i++)updPlay(1/30);}
  `);
  return run;
}

test('the platform is the last level and uses its own rules', () => {
  const run=game();
  assert.equal(run('S.level'), run('LEVELS.length-1'));
  assert.equal(run('L.d.music'), 'station');
  assert.equal(run('Boolean(L.station)'), true);
});

test('a warned train hits zombies on its track and they return from the tunnel later', () => {
  const run=game();
  run('var z=zombie(200,112);L.zs=[z];L.station.trains.push(newTrain(0));updPlay(.5)');
  assert.equal(run('L.zs.length'), 1, 'nothing happens while the bell is still ringing');
  run('for(let i=0;i<120;i++)updPlay(1/30)');
  assert.equal(run('L.zs.length'), 0);
  assert.equal(run('S.score>=CFG.trainHitPoints'), true);
  assert.equal(run('L.station.back.length'), 1);
  run('updPlay(CFG.trainReturn)');
  assert.equal(run('L.zs.includes(z)'), true);
  assert.equal(run('Math.hypot(z.x-L.p.x,z.y-L.p.y)>100'), true, 'they climb out far from the player');
});

test('a train only hits its own track; platform edges are safe', () => {
  const run=game();
  run('var a=zombie(200,140),b=zombie(100,95),c=zombie(260,164);L.zs=[a,b,c];L.p.y=95;pass(0)');
  assert.equal(run('S.mode'), 'play');
  assert.equal(run('L.zs.length'), 3);
});

test('a train on the player\'s track counts as getting caught', () => {
  const run=game();
  run('L.zs=[];L.p.y=144;pass(1)');
  assert.equal(run('S.mode'), 'caught');
  assert.equal(run('L.catcher'), 'train');
  assert.equal(run('Array.isArray(FOEQ[L.catcher].card)'), true);
});

test('the inspector fines magazines, then points, and never catches', () => {
  const run=game();
  run('var ins=newFoe("inspector",L.p.x,L.p.y);ins.bubbleT=999;L.zs=[ins];L.p.mags=3;S.score=500;updPlay(0)');
  assert.equal(run('S.mode'), 'play');
  assert.equal(run('L.p.mags'), 1);
  run('ins.busy=0;updPlay(0)');
  assert.equal(run('L.p.mags'), 1, 'one fine per cooldown');
  run('ins.busy=0;ins.fineCd=0;L.p.mags=0;updPlay(0)');
  assert.equal(run('S.score'), 400);
  run('startRead(ins);ins.read=0;ins.busy=0;ins.fineCd=5;updPlay(0)');
  assert.equal(run('S.mode'), 'play', 'reading a magazine does not make him dangerous');
});

test('a train only grazes the inspector: he lands on the platform, dizzy and harmless', () => {
  const run=game();
  run('var ins=newFoe("inspector",200,112);ins.bubbleT=999;L.zs=[ins];L.p.x=60;L.p.y=60;L.p.mags=3;pass(0)');
  assert.equal(run('L.zs.includes(ins)'), true);
  assert.equal(run('L.station.back.length'), 0);
  assert.equal(run('ins.y<96&&ins.x>=24&&ins.x<=296'), true, 'thrown onto the platform beside track 1');
  assert.equal(run('S.score<CFG.trainHitPoints'), true, 'no points for grazing him');
  run('L.p.mags=3;ins.busy=0;ins.dizzy=CFG.inspectorDizzy;ins.fineCd=0;L.p.x=ins.x;L.p.y=ins.y;updPlay(0)');
  assert.equal(run('L.p.mags'), 3, 'no fines while dizzy');
  run('updFoe(ins,CFG.inspectorDizzy);ins.busy=0;updPlay(0)');
  assert.equal(run('L.p.mags'), 1, 'back on duty afterwards');
});

test('between fines the inspector checks a zombie\'s ticket and stops it', () => {
  const run=game();
  run('var ins=newFoe("inspector",60,180),z=zombie(66,180);ins.bubbleT=999;ins.fineCd=5;L.zs=[ins,z];L.p.x=280;updPlay(0)');
  assert.equal(run('z.read>0'), true);
  assert.equal(run('ins.busy>0'), true);
});

test('at 6:00 AM the first train stops on track 2 and only its open doors are the exit', () => {
  const run=game();
  run('L.zs=[];L.time=L.d.night;L.p.x=83;L.p.y=166;updPlay(0)');
  assert.equal(run('L.open'), true);
  assert.equal(run('Boolean(L.station.final)'), true);
  assert.equal(run('stationEscape(L.p)'), false, 'not before it arrives');
  run('for(let i=0;i<300&&!L.station.final.open;i++)updPlay(1/30)');
  assert.equal(run('L.station.final.stopped&&L.station.final.open'), true);
  assert.equal(run('L.solid[8][5]&&L.solid[9][5]'), true, 'the stopped train blocks track 2');
  run('L.p.x=L.station.final.x+TRAIN_DOORS[1]+30;updPlay(0)');
  assert.equal(run('S.mode'), 'play', 'a closed side of the train is not a door');
  run('L.p.x=L.station.final.x+TRAIN_DOORS[1];updPlay(0)');
  assert.equal(run('S.mode'), 'clear');
  assert.equal(run('S.stats.reached'), 'ESC');
});

test('no ordinary trains are scheduled after 6:00 AM', () => {
  const run=game();
  run('L.zs=[];L.time=L.d.night;L.station.nextT=0;updPlay(0)');
  assert.equal(run('L.station.trains.length'), 0);
});

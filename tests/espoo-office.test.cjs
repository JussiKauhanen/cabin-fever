const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Run the real Espoo and office rules (their guests, office zombies, HR) without a browser, rendering or audio.
const sources = ['core', 'config', 'content', 'economy', 'enemies', 'station', 'office', 'levels', 'state', 'physics', 'update', 'input']
  .map(name => [name, fs.readFileSync(path.join(__dirname, '..', 'js', name + '.js'), 'utf8')]);
function game(name) {
  const canvas = {getContext: () => ({}), addEventListener() {}};
  const math = Object.create(Math);math.random = () => .5;
  const context = vm.createContext({Math: math, window: {}, document: {getElementById: () => canvas},
    addEventListener() {}, audioInit() {}, syncAudioPause() {}, loadScores: () => [],
    music() {}, tn() {}, nz() {}, anow: () => 0, SFX: new Proxy({}, {get: () => () => {}})});
  const run = code => vm.runInContext(code, context);
  for (const [file, source] of sources) vm.runInContext(source, context, {filename: file + '.js'});
  run(`
    for(const level of LEVELS){
      const solid=Array.from({length:ROWS},(_,r)=>Array.from({length:COLS},(_,c)=>r===0||r===ROWS-1||c===0||c===COLS-1));
      GEO.push({solid,doors:[[9,13],[10,13]],ok:solid.map(row=>row.map(cell=>!cell))});
    }
    startGame();S.level=LEVELS.findIndex(d=>d.name==='${name}');setupLevel();S.mode='play';S.score=0;
    L.time=10;L.grace=0;L.vibe=0;L.pending=[];L.items=[];L.zs=[];L.stashT=L.micT=L.coinT=L.pillT=999;
    if(L.office)L.office.hrT=999;
    L.p.x=160;L.p.y=180;
    function zombie(x,y){return Object.assign(newZombie(x,y,0),{spd:0,pukeT:999,bubbleT:999,still:-999});}
    function guest(k,x,y){return Object.assign(newFoe(k,x,y),{bubbleT:999});}
  `);
  return run;
}

test('the new levels keep every spawn on free ground and the pond off the path', () => {
  const run=game('ESPOO');
  for (const name of ['level-espoo', 'level-office']) run(fs.readFileSync(path.join(__dirname, '..', 'js', name + '.js'), 'utf8'));
  run(`function spots(name,map){const d=LEVELS.find(l=>l.name===name),solid=map.map(r=>[...r].map(ch=>ch!=='.'));
    const ok=reach(solid,Math.floor(d.start[0]),Math.floor(d.start[1])),pts=[d.start,...d.zs,...Object.values(d.guestAt||{}),[d.cp[0]/16,d.cp[1]/16]];
    return map.length===ROWS&&map.every(r=>r.length===COLS)&&pts.every(([x,y])=>ok[Math.floor(y)][Math.floor(x)])&&solid.every((r,j)=>r.every((s,i)=>s||ok[j][i]));}`);
  assert.equal(run("spots('ESPOO',L6MAP)"), true);
  assert.equal(run("spots('THE OFFICE',L7MAP)"), true);
  assert.equal(run("OFFICE_DOORS.every(p=>L7MAP[Math.floor(p.y/16)][Math.floor(p.x/16)]==='.')"), true, 'HR can step out of both doors');
  assert.equal(run("L6MAP.every(r=>!'~'.includes(r[8])&&!'~'.includes(r[9])&&!'~'.includes(r[10]))"), true, 'the path (cols 9-10) and the tile beside it are dry');
  assert.equal(run("L7MAP.join('').includes('BB')&&L7MAP.join('').includes('oCCo')"), true, 'phone booths and the lounge are on the map');
});

test('Espoo follows the metro and the office is the last level', () => {
  const run=game('ESPOO');
  assert.equal(run('LEVELS.slice(-3).map(d=>d.name).join()'), 'KONTULA METRO,ESPOO,THE OFFICE');
  assert.equal(run('[...new Set(L.d.waves.flat())].sort().join()'), 'Z,porvari,startup,teekkari');
  assert.ok(run('LEVELS.every((d,i)=>i===0||d.night>=LEVELS[i-1].night)'), 'the clock keeps slowing down level by level');
});

test('the teekkari never catches you; bumping into him is a harmless lottery', () => {
  const run=game('ESPOO');
  run("var t=guest('teekkari',L.p.x,L.p.y);t.cd=0;L.zs=[t];updPlay(0)");
  assert.equal(run('S.mode'), 'play');
  assert.equal(run('S.money'), run('CFG.teekkariGift'), 'with this dice roll he hands over bus money');
  run('t.busy=0;updPlay(0)');
  assert.equal(run('S.money'), run('CFG.teekkariGift'), 'one surprise per meeting');
  run('for(let i=0;i<400&&S.mode===\'play\';i++){t.x=L.p.x;t.y=L.p.y;updPlay(1/30);}');
  assert.equal(run('S.mode'), 'play');
  assert.equal(run('S.stats.caught'), 0);
});

test('the startup founder pitches, sprints at you, vanishes and comes back somewhere else', () => {
  const run=game('ESPOO');
  run("var f=guest('startup',60,60);L.zs=[f];L.p.x=260;L.p.y=180;updPlay(0)");
  assert.equal(run("f.ph==='pitch'&&f.calm"), true);
  run('f.x=L.p.x+3;f.y=L.p.y;updPlay(.1)');
  assert.equal(run('S.mode'), 'play', 'harmless while he pitches');
  run('f.x=60;f.y=60;updPlay(CFG.startupPitch);var d0=Math.hypot(f.x-L.p.x,f.y-L.p.y);updPlay(.5)');
  assert.equal(run('f.ph'), 'run');
  assert.ok(run('d0-Math.hypot(f.x-L.p.x,f.y-L.p.y)>CFG.playerSpeed*.5'), 'faster than you');
  run('updPlay(CFG.startupRun)');
  assert.equal(run('f.hidden&&f.calm&&L.zs.includes(f)'), true);
  assert.equal(run('canReadMag(f)'), false);
  run('updPlay(CFG.startupAway[1]+.1)');
  assert.equal(run("!f.hidden&&f.ph==='pitch'"), true);
  assert.ok(run('Math.hypot(f.x-L.p.x,f.y-L.p.y)>=CFG.startupNear'), 'never right next to you');
  run('updPlay(CFG.startupPitch);f.x=L.p.x+3;f.y=L.p.y;updPlay(0)');
  assert.equal(run('S.mode'), 'caught');
  assert.equal(run('L.catcher'), 'startup');
});

test('the porvari takes all your money, never your life, and pockets loose coins when you are broke', () => {
  const run=game('ESPOO');
  run("var v=guest('porvari',L.p.x,L.p.y);v.cd=0;L.zs=[v];S.money=77;updPlay(0)");
  assert.equal(run('S.money'), 0);
  assert.equal(run('v.bag'), 77);
  assert.equal(run('S.mode'), 'play');
  run("v.busy=0;v.cd=0;L.p.x=260;L.items.push({type:'coin',x:100,y:100,t:0,v:5});v.x=95;v.y=100;updPlay(0)");
  assert.equal(run("L.items.some(i=>i.type==='coin')"), false);
  assert.equal(run('v.bag'), 82);
  assert.equal(run('S.money'), 0);
  run('v.busy=0;v.x=L.p.x;v.y=L.p.y;updPlay(0)');
  assert.equal(run('S.mode'), 'play', 'nothing to take, nothing happens');
});

test('office zombies behave like zombies but talk shop and spill coffee', () => {
  const run=game('THE OFFICE');
  assert.equal(run('S.level'), run('LEVELS.length-1'));
  run('var z=zombie(100,100);z.bubbleT=0;L.zs=[z];updPlay(.01)');
  assert.equal(run('OFFICEQ.includes(z.say)'), true);
  run('z.pukeT=0;updPlay(.01);updPlay(.6)');
  assert.equal(run('L.puddles.length===1&&L.puddles[0].coffee'), true);
  run('z.puke=0;z.pukeT=999;z.x=L.p.x+3;z.y=L.p.y;updPlay(0)');
  assert.equal(run('S.mode'), 'caught');
  assert.equal(run('L.catcher'), 'office');
  assert.equal(run('Array.isArray(FOEQ[L.catcher].card)'), true);
});

test('the manager warns, throws a meeting invite, and a hit roots you to the spot', () => {
  const run=game('THE OFFICE');
  run("var m=guest('manager',60,100);m.inviteT=0;L.zs=[m];L.p.x=140;L.p.y=100;updPlay(.01)");
  assert.equal(run('m.throwT>0&&m.aimX===140'), true);
  assert.equal(run('L.office.invites.length'), 0, 'a warning first');
  run('updPlay(.7)');
  assert.equal(run('L.office.invites.length===1&&L.office.invites[0].vx>0'), true);
  run('for(let i=0;i<60&&!(L.p.stuck>0);i++)updPlay(1/30)');
  assert.equal(run('L.p.stuck>0'), true);
  assert.equal(run('S.mode'), 'play');
  run('tkeys.arrowright=true;var x0=L.p.x;updPlay(.2)');
  assert.equal(run('L.p.x'), run('x0'), 'no walking out of a meeting');
  run('L.office.invites=[];m.inviteT=999;updPlay(CFG.meetingTime);updPlay(.2)');
  assert.ok(run('L.p.x>x0'), 'free again');
  run('L.office.invites.push({x:L.p.x-2,y:L.p.y,vx:10,vy:0,t:1,age:0});updPlay(.01)');
  assert.equal(run('L.p.stuck>0'), false, 'no back-to-back meetings');
});

test('a magazine interrupts the manager before he throws', () => {
  const run=game('THE OFFICE');
  run("var m=guest('manager',60,100);m.inviteT=0;L.zs=[m];L.p.x=140;L.p.y=100;updPlay(.01);startRead(m);updPlay(.8)");
  assert.equal(run('L.office.invites.length'), 0);
  assert.equal(run('m.read>0'), true);
});

test('HR comes rarely, after a warning, through the door farthest from you', () => {
  const run=game('THE OFFICE');
  assert.ok(run('CFG.hrFirst>=30&&CFG.hrEvery[0]>=30'));
  run('L.p.x=60;L.office.hrT=0;updPlay(.01)');
  assert.equal(run('Boolean(L.office.warn&&L.banner)'), true);
  assert.equal(run("L.zs.some(z=>z.k==='hr')"), false);
  run("for(let i=0;i<30*CFG.hrWarn+5&&!L.zs.some(z=>z.k==='hr');i++)updPlay(1/30);var hr=L.zs.find(z=>z.k==='hr')");
  assert.equal(run('Boolean(hr)'), true);
  assert.equal(run('hr.home.x'), 280);
  assert.equal(run('canReadMag(hr)'), false);
  run('hr.spd=0;L.projs.push({x:hr.x,y:hr.y,vx:0,vy:0,t:1,spin:0,k:1});updPlay(0)');
  assert.equal(run('hr.read'), 0, 'magazines mean nothing to her');
  run('for(let i=0;i<30*(CFG.hrStay+1)&&L.zs.includes(hr);i++)updPlay(1/30)');
  assert.equal(run('L.zs.includes(hr)'), false, 'she leaves again');
  assert.ok(run('L.office.hrT>=CFG.hrEvery[0]&&L.office.hrT<=CFG.hrEvery[1]'), 'and the next visit is far off');
});

test('one touch from HR ends the game, whatever the zombie count', () => {
  const run=game('THE OFFICE');
  run("S.zombies=1;var hr=guest('hr',L.p.x+3,L.p.y);hr.home={x:40,y:42};hr.life=5;L.zs=[hr];updPlay(0)");
  assert.equal(run('S.mode'), 'caught');
  assert.equal(run('L.instant'), true);
  run('update(3.5)');
  assert.equal(run('S.mode'), 'gameover');
  assert.equal(run('S.zombies'), 1);
});

test('HR stays away after 6:00 AM, and leaving the office wins the game', () => {
  const run=game('THE OFFICE');
  run('L.time=L.d.night;L.office.hrT=0;updPlay(.01)');
  assert.equal(run('L.open'), true);
  assert.equal(run('L.office.warn'), null);
  run('L.p.y=218;updPlay(0)');
  assert.equal(run('S.mode'), 'clear');
  assert.equal(run('S.stats.reached'), 'ESC');
  run("S.t=1;onKey({key:'Enter',repeat:false})");
  assert.equal(run('S.mode'), 'victory');
});

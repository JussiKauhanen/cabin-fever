const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Run the real money, kiosk and pill rules without a browser, rendering or audio.
const sources = ['core', 'config', 'content', 'economy', 'enemies', 'station', 'office', 'levels', 'state', 'physics', 'update', 'input']
  .map(name => [name, fs.readFileSync(path.join(__dirname, '..', 'js', name + '.js'), 'utf8')]);
function game(level = 0) {
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
    startGame();S.level=${level};setupLevel();S.mode='play';S.score=0;
    L.time=10;L.grace=0;L.vibe=0;L.pending=[];L.items=[];L.zs=[];L.stashT=L.micT=L.coinT=L.pillT=999;
    L.p.x=160;L.p.y=180;
    function zombie(x,y){return Object.assign(newZombie(x,y,0),{spd:0,pukeT:999,bubbleT:999,still:-999});}
    function buy(k){openShop();return shopBuy(SHOP.findIndex(it=>it.k===k));}
  `);
  return run;
}
const near = (a, b, tolerance, message) => assert.ok(Math.abs(a - b) <= tolerance, `${message || ''} expected ${b}, got ${a}`);

test('coins appear on a timer up to a limit, and picking one up pays', () => {
  const run=game();
  assert.equal(run('S.money'), 0);
  run('L.coinT=0;updPlay(0)');
  assert.equal(run("L.items.filter(i=>i.type==='coin').length"), 1);
  assert.equal(run('L.coinT'), run('CFG.coinEvery'));
  run('var c=L.items[0];L.p.x=c.x;L.p.y=c.y;updPlay(0)');
  assert.equal(run('S.money'), run('CFG.coinValue'));
  assert.equal(run('L.items.length'), 0);
  run("for(let i=0;i<CFG.coinMax;i++)L.items.push({type:'coin',x:30+i*40,y:40,t:0,v:5});L.coinT=0;updPlay(0)");
  assert.equal(run("L.items.filter(i=>i.type==='coin').length"), run('CFG.coinMax'));
});

test('magic pills are much rarer than magazines and pockets hold only a few', () => {
  const run=game();
  assert.ok(run('CFG.pillEvery>=4*CFG.stashEvery&&CFG.pillFirst>CFG.stashEvery'));
  run('L.p.x=40;L.p.y=40;L.pillT=0;updPlay(0)');
  assert.equal(run("L.items.filter(i=>i.type==='pill').length"), 1);
  run('L.pillT=0;updPlay(0)');
  assert.equal(run("L.items.filter(i=>i.type==='pill').length"), 1, 'never two on the floor');
  run('var c=L.items[0];L.p.x=c.x;L.p.y=c.y;updPlay(0)');
  assert.equal(run('S.pills'), 1);
  run("S.pills=CFG.pillMax;L.items.push({type:'pill',x:L.p.x,y:L.p.y,t:0});updPlay(0)");
  assert.equal(run('S.pills'), run('CFG.pillMax'));
  assert.equal(run('L.items.length'), 1, 'it stays on the floor');
});

test('a magic pill slows the enemies and speeds up the clock for a while', () => {
  const run=game();
  run('usePill()');
  assert.equal(run('L.matrix'), 0, 'no pill, no effect');
  run('var z=zombie(40,100);z.spd=40;L.zs=[z];L.p.x=280;L.p.y=100;var t0=L.time;updPlay(.5);var d1=z.x-40,c1=L.time-t0');
  run('S.pills=1;usePill();z.x=40;t0=L.time;updPlay(.5);var d2=z.x-40,c2=L.time-t0');
  assert.equal(run('S.pills'), 0);
  near(run('d2/d1'), run('CFG.pillSlow'), .03, 'enemy speed');
  near(run('c2/c1'), run('CFG.pillRate'), .001, 'clock speed');
  run('updPlay(CFG.pillTime)');
  assert.equal(run('L.matrix'), 0);
  run('t0=L.time;updPlay(.5)');
  near(run('L.time-t0'), .5, .001, 'normal clock again');
});

test('selling kiosk magazines to the granny never pays more than they cost', () => {
  const run=game();
  assert.ok(run('2*CFG.magSellPrice<CFG.prices.mags'), 'two magazines sell for less than the kiosk charges for them');
  assert.ok(run('CFG.pillSellPrice<CFG.prices.pill'), 'and the same goes for pills sold to the nisti');
});

test('the kiosk pauses the game and sells only what you can afford and carry', () => {
  const run=game();
  assert.ok(run('SHOP.every(it=>CFG.prices[it.k]>0)'));
  run('S.money=100;openShop()');
  assert.equal(run('S.mode'), 'shop');
  run('var t0=L.time;update(1)');
  assert.equal(run('L.time'), run('t0'));
  assert.equal(run("buy('mags')"), true);
  assert.equal(run('L.p.mags'), run('CFG.magsStart+2'));
  assert.equal(run('S.money'), run('100-CFG.prices.mags'));
  assert.equal(run('S.mode'), 'shop', 'supplies keep the kiosk open');
  run('closeShop()');
  assert.equal(run('S.mode'), 'play');
  run("S.money=CFG.prices.mags-1;var m0=L.p.mags");
  assert.equal(run("buy('mags')"), false);
  assert.equal(run('L.p.mags===m0&&S.money===CFG.prices.mags-1'), true);
  run('S.money=100;L.p.mags=CFG.magsMax');
  assert.equal(run("buy('mags')"), false, 'pockets full');
  assert.equal(run('S.money'), 100);
  run("closeShop();S.mode='pause';openShop()");
  assert.equal(run('S.mode'), 'pause', 'only during play');
});

test('DEEP FREEZE stops every enemy and nobody catches you until it thaws', () => {
  const run=game();
  run("var z=zombie(L.p.x+3,L.p.y);z.spd=40;L.zs=[z];S.money=100;buy('freeze')");
  assert.equal(run('S.mode'), 'play', 'it starts at once');
  assert.equal(run('S.money'), run('100-CFG.prices.freeze'));
  run('var x0=z.x;updPlay(.1)');
  assert.equal(run('S.mode'), 'play');
  assert.equal(run('z.x'), run('x0'));
  run('z.spd=0;updPlay(CFG.freezeTime-.3)');
  assert.equal(run('S.mode'), 'play');
  run('updPlay(.3)');
  assert.equal(run('S.mode'), 'caught');
});

test('FAST FORWARD runs the night clock faster, and is not sold after sunrise', () => {
  const run=game();
  run("S.money=100;buy('ff');var t0=L.time;updPlay(1)");
  near(run('L.time-t0'), run('CFG.ffRate'), .001);
  run('updPlay(CFG.ffTime);t0=L.time;updPlay(1)');
  near(run('L.time-t0'), 1, .001);
  run('L.open=true;var m0=S.money');
  assert.equal(run("buy('ff')"), false);
  assert.equal(run('S.money'), run('m0'));
});

test('ZOMBIE RESET takes the count back to one, on the map and on the way', () => {
  const run=game();
  run("S.zombies=4;L.zs=[zombie(40,40),zombie(80,40),zombie(120,40),newFoe('bear',200,40)];");
  run("L.pending=[{t:99,k:null,x:40,y:40,i:3},{t:120,k:'bear',x:40,y:40}];S.money=100;buy('reset')");
  assert.equal(run('S.zombies'), 1);
  assert.equal(run('L.zs.filter(z=>!z.k).length'), 1);
  assert.equal(run("L.zs.some(z=>z.k==='bear')"), true, 'guests stay');
  assert.equal(run('L.pending.map(w=>w.k).join()'), 'bear');
  assert.equal(run('S.mode'), 'play');
  run('var m0=S.money');
  assert.equal(run("buy('reset')"), false, 'nothing to reset');
  assert.equal(run('S.money'), run('m0'));
});

test('the zombie count never passes the maximum', () => {
  const run=game();
  run('S.zombies=2;L.zs=[zombie(L.p.x+3,L.p.y)];updPlay(0);update(3.5)');
  assert.equal(run('S.mode'), 'intro');
  assert.equal(run('S.zombies'), 3);
  run("S.mode='play';L.grace=0;S.zombies=MAXZ;L.zs=[zombie(L.p.x+3,L.p.y)];updPlay(0)");
  assert.equal(run('S.mode'), 'caught');
  run('update(3.5)');
  assert.equal(run('S.mode'), 'gameover');
  assert.equal(run('S.zombies'), run('MAXZ'), 'not one more than the maximum');
});

test('the nisti buys a pill, else picks your pocket, and only catches a broke player', () => {
  const run=game(3);
  run("var n=newFoe('nisti',L.p.x+3,L.p.y);n.bubbleT=999;L.zs=[n];S.pills=1;S.money=30;updPlay(0)");
  assert.equal(run('S.mode'), 'play');
  assert.equal(run('S.pills'), 0);
  assert.equal(run('S.money'), run('30+CFG.pillSellPrice'));
  assert.equal(run('n.calm&&n.high>0'), true);
  run('updFoe(n,CFG.nistiHigh+.1)');
  assert.equal(run('n.calm'), false, 'back to normal afterwards');
  run('var m0=S.money;n.x=L.p.x+3;n.y=L.p.y;n.wander=null;updPlay(0)');
  assert.equal(run('S.mode'), 'play');
  assert.equal(run('m0-S.money'), run('CFG.nistiSteal'));
  assert.equal(run('n.calm&&n.flee>0'), true);
  run('S.money=0;n.flee=0;n.calm=false;n.x=L.p.x+3;n.y=L.p.y;n.wander=null;updPlay(0)');
  assert.equal(run('S.mode'), 'caught');
  assert.equal(run('L.catcher'), 'nisti');
});

test('money and pills carry over between levels and come back with a checkpoint retry', () => {
  const run=game();
  run('S.money=42;S.pills=2;S.level=1;toIntro(false)');
  assert.equal(run('S.money===42&&S.pills===2'), true);
  run("S.mode='play';gotCheckpoint({x:0,y:0});S.money=7;S.pills=0;toIntro(true)");
  assert.equal(run('S.money'), 7, 'a lost life keeps what you have now');
  run('continueGame()');
  assert.equal(run('S.money===42&&S.pills===2'), true);
  run('startGame()');
  assert.equal(run('S.money===0&&S.pills===0'), true);
});

test('keyboard: B opens and closes the kiosk, digits buy, E takes a pill', () => {
  const run=game();
  run("S.money=100;onKey({key:'b',repeat:false})");
  assert.equal(run('S.mode'), 'shop');
  run("onKey({key:'1',repeat:false})");
  assert.equal(run('S.money'), run('100-CFG.prices.mags'));
  run("onKey({key:'ArrowDown',repeat:false});onKey({key:'ArrowDown',repeat:false});onKey({key:'Enter',repeat:false})");
  assert.equal(run('S.pills'), 1, 'the third row is the pill');
  run("onKey({key:'b',repeat:false})");
  assert.equal(run('S.mode'), 'play');
  run("onKey({key:'e',repeat:false})");
  assert.equal(run('L.matrix>0&&S.pills===0'), true);
});

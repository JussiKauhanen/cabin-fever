const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const sources=['audio','input','touch'].map(name=>[name,
  fs.readFileSync(path.join(__dirname,'..','js',name+'.js'),'utf8')]);

// Load the real audio and input handlers. The audio device enforces gesture-only
// resume so a later animation-frame retry cannot accidentally pass these tests.
function game(options={}){
  const listeners=new Map(),elements=new Map(),contexts=[],calls=[];
  let context;
  const register=(map,name,fn)=>{if(!map.has(name))map.set(name,[]);map.get(name).push(fn);};
  function element(id){
    if(elements.has(id))return elements.get(id);
    const events=new Map(),classes=new Set();
    const el={id,events,hidden:id==='share',dataset:{},style:{},
      classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c)},
      addEventListener:(name,fn)=>register(events,name,fn),
      querySelector:selector=>element(id+selector),getContext:()=>({}),focus(){},
      closest(selector){
        if(selector==='#app [data-k]')return this.dataset.k?this:null;
        if(selector==='#app [data-k][data-up]')return this.dataset.k&&this.dataset.up?this:null;
        return null;
      }};
    elements.set(id,el);return el;
  }
  element('bpause').dataset.k='p';element('bthrow').dataset.k=' ';
  const param=()=>({value:1,setValueAtTime(){},exponentialRampToValueAtTime(){}});
  class AudioContext{
    constructor(){
      if(context.qaBlockConstruction)throw new Error('Audio device unavailable');
      this.state=options.initialState||'suspended';this.currentTime=0;this.sampleRate=44100;
      this.destination={};this.sources=[];this.oscillators=[];contexts.push(this);
    }
    createGain(){return {gain:param(),connect(){}};}
    createBuffer(channels,length){return {length,getChannelData:()=>new Float32Array(length)};}
    createBufferSource(){
      const node={connect(){},disconnect(){this.disconnected=true;},
        start(){this.started=true;},stop(){}};
      this.sources.push(node);return node;
    }
    createOscillator(){
      const node={frequency:param(),connect(){},start(){this.started=true;},stop(){}};
      this.oscillators.push(node);return node;
    }
    createBiquadFilter(){return {frequency:param(),connect(){}};}
    resume(){
      calls.push({action:'resume',gesture:context.qaGesture,mode:context.S.mode});
      if(!context.qaGesture||context.qaBlockResume)return Promise.reject(new Error('Gesture required'));
      this.state='running';return Promise.resolve();
    }
    suspend(){calls.push({action:'suspend'});this.state='suspended';return Promise.resolve();}
  }
  const navigator={};
  if(options.session==='supported')navigator.audioSession={type:'auto'};
  if(options.session==='throws')navigator.audioSession={set type(value){throw new Error('Unavailable');}};
  const window=options.prefixed?{webkitAudioContext:AudioContext}:{AudioContext};
  const document={hidden:false,getElementById:element,
    addEventListener:(name,fn)=>register(listeners,'document:'+name,fn)};
  context=vm.createContext({window,document,navigator,cv:element('g'),
    S:{mode:'play',t:1,page:0},L:{metro:null},keys:{},tkeys:{},TOUCH:false,
    qaGesture:false,qaBlockResume:false,qaBlockConstruction:false,
    addEventListener:(name,fn)=>register(listeners,name,fn),setTimeout,
    throwMag(){vm.runInContext('SFX.throw()',context);}});
  const run=code=>vm.runInContext(code,context);
  for(const [name,source] of sources)vm.runInContext(source,context,{filename:name+'.js'});
  function gesture(fn){context.qaGesture=true;try{return fn();}finally{context.qaGesture=false;}}
  function emit(name,props={},trusted=true){
    const e={target:element('g'),key:'',repeat:false,pointerType:'touch',pointerId:1,
      preventDefault(){this.defaultPrevented=true;},...props};
    const fire=()=>{for(const fn of listeners.get(name)||[])fn(e);};
    if(trusted)gesture(fire);else fire();return e;
  }
  function endPriming(){
    for(const ac of contexts)if(ac.state==='running')for(const node of ac.sources){
      if(node.buffer.length===1&&node.started&&!node.ended){node.ended=true;node.onended();}
    }
  }
  return {run,gesture,emit,endPriming,contexts,calls,context,element};
}

test('the first mobile gesture resumes a new suspended device and primes output',()=>{
  const g=game({session:'supported'});
  g.gesture(()=>g.run('audioInit()'));
  assert.equal(g.contexts.length,1);
  assert.equal(g.run('AC.state'),'running');
  assert.equal(g.context.navigator.audioSession.type,'playback');
  assert.deepEqual(g.calls,[{action:'resume',gesture:true,mode:'play'}]);
  const prime=g.contexts[0].sources.find(node=>node.buffer.length===1);
  assert.equal(prime.started,true);
  g.endPriming();
  assert.equal(prime.disconnected,true);
  g.gesture(()=>g.run('audioInit()'));
  assert.equal(g.contexts[0].sources.length,1);
  g.run("music('title');seqTick();SFX.throw()");
  assert.ok(g.contexts[0].oscillators.some(node=>node.started));
  assert.ok(g.contexts[0].sources.some(node=>node.buffer.length>1&&node.started));
});

test('iOS interrupted audio resumes on the next gesture without replacing the device',()=>{
  const g=game();g.gesture(()=>g.run('audioInit()'));g.endPriming();
  g.run("AC.state='interrupted'");
  g.emit('touchend');
  assert.equal(g.run('AC.state'),'running');
  assert.equal(g.contexts.length,1);
  assert.equal(g.calls.filter(call=>call.action==='resume').length,2);
});

test('optional audio session support and the older WebKit constructor remain compatible',()=>{
  for(const options of [{},{session:'throws'},{prefixed:true}]){
    const g=game(options);g.gesture(()=>g.run('audioInit()'));
    assert.equal(g.run('AC.state'),'running');
    assert.equal(g.contexts.length,1);
  }
});

test('blocked resume and device creation can be retried by a later gesture',async()=>{
  const g=game();g.context.qaBlockConstruction=true;
  g.gesture(()=>g.run('audioInit()'));
  assert.equal(g.run('AC'),null);
  g.context.qaBlockConstruction=false;
  g.context.qaBlockResume=true;
  g.gesture(()=>g.run('audioInit()'));
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(g.run('AC.state'),'suspended');
  g.context.qaBlockResume=false;
  g.emit('pointerup');
  assert.equal(g.run('AC.state'),'running');
  assert.equal(g.contexts.length,1);
});

test('keyboard pause and resume change audio inside the keyboard gesture',()=>{
  const g=game();g.gesture(()=>g.run('audioInit()'));g.endPriming();
  g.emit('keydown',{key:'p'});
  assert.equal(g.context.S.mode,'pause');
  assert.equal(g.run('AC.state'),'suspended');
  g.emit('keydown',{key:'Enter'});
  assert.equal(g.context.S.mode,'play');
  assert.equal(g.run('AC.state'),'running');
  assert.deepEqual(g.calls.at(-1),{action:'resume',gesture:true,mode:'play'});
});

test('touch pause and the actual Resume menu handler resume in the same gesture',()=>{
  const g=game();g.gesture(()=>g.run('audioInit()'));g.endPriming();
  const press=g.emit('pointerdown',{target:g.element('bpause')});
  assert.equal(press.defaultPrevented,true);
  assert.equal(g.context.S.mode,'pause');
  assert.equal(g.run('AC.state'),'suspended');
  const resume=g.element('resume');resume.dataset={k:'Enter',up:'1'};
  g.emit('click',{target:resume});
  assert.equal(g.context.S.mode,'play');
  assert.equal(g.run('AC.state'),'running');
  assert.deepEqual(g.calls.at(-1),{action:'resume',gesture:true,mode:'play'});
});

test('pointer release unlocks controls even when touch-down prevents a click',async()=>{
  const g=game();
  const press=g.emit('pointerdown',{target:g.element('bthrow')},false);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(press.defaultPrevented,true);
  assert.equal(g.run('AC.state'),'suspended');
  g.emit('pointerup',{target:g.element('bthrow')});
  assert.equal(g.run('AC.state'),'running');
  assert.deepEqual(g.calls.at(-1),{action:'resume',gesture:true,mode:'play'});
});

test('a stopped audio clock does not accumulate music steps or sound effects',()=>{
  for(const state of ['suspended','interrupted','closed']){
    const g=game();g.gesture(()=>g.run('audioInit()'));g.endPriming();
    g.run(`music('title');AC.state='${state}'`);
    const ac=g.contexts[0],sources=ac.sources.length,oscillators=ac.oscillators.length;
    g.run('for(let i=0;i<5;i++){seqTick();SFX.puke()}');
    assert.equal(g.run('seq.step'),0,state);
    assert.equal(ac.sources.length,sources,state);
    assert.equal(ac.oscillators.length,oscillators,state);
  }
});

test('keyboard and speaker-button mute silence both music and sound effects',()=>{
  const g=game();g.gesture(()=>g.run('audioInit()'));g.endPriming();
  g.emit('keydown',{key:'m'});
  assert.equal(g.run('muted'),true);
  assert.equal(g.run('MG.gain.value'),0);
  const ac=g.contexts[0],sources=ac.sources.length,oscillators=ac.oscillators.length;
  g.run("music('title');seqTick();SFX.puke()");
  assert.equal(ac.sources.length,sources);
  assert.equal(ac.oscillators.length,oscillators);
  g.gesture(()=>{for(const handler of g.element('bsound').events.get('click'))handler();});
  assert.equal(g.run('muted'),false);
  assert.equal(g.run('MG.gain.value'),.3);
  g.run('SFX.puke()');
  assert.ok(ac.sources.length>sources);
  assert.ok(ac.oscillators.length>oscillators);
});

test('returning to a hidden game keeps audio paused until the player resumes',()=>{
  const g=game();g.gesture(()=>g.run('audioInit()'));g.endPriming();
  g.context.document.hidden=true;g.emit('document:visibilitychange',{},false);
  assert.equal(g.context.S.mode,'pause');
  assert.equal(g.run('AC.state'),'suspended');
  const resumes=g.calls.filter(call=>call.action==='resume').length;
  g.context.document.hidden=false;g.emit('document:visibilitychange',{},false);
  assert.equal(g.calls.filter(call=>call.action==='resume').length,resumes);
  g.emit('keydown',{key:'Enter'});
  assert.equal(g.run('AC.state'),'running');
});

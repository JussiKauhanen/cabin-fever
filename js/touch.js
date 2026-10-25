"use strict";
/* Touch play for phones and tablets: screen layout, virtual stick, arcade buttons, per-screen menu buttons
   and an on-screen keyboard for rap lines and initials. Every button goes through tapKey(), the same path a
   key press takes, so the game rules stay in input.js and update.js. */
const $=id=>document.getElementById(id);
const app=$('app'),sysEl=$('sys'),stickEl=$('stick'),baseEl=stickEl.querySelector('.base'),knobEl=stickEl.querySelector('.knob'),actsEl=$('acts');
const menuEl=$('menu'),kbEl=$('kb'),pc=$('prompter'),pctx=pc.getContext('2d');
const bthrow=$('bthrow'),brap=$('brap'),nmags=$('nmags'),bsound=$('bsound'),bpause=$('bpause'),bfull=$('bfull');

/* one press from a button: same flow as the keydown handler in input.js, minus holding the key down */
function tapKey(k){audioInit();const e={key:k,repeat:false,preventDefault(){}};
  if(!shareEl.hidden){if(k==='Escape')closeShare();return;}
  if(S.mode==='rap'){rapKey(e);return;}
  onKey(e);syncAudioPause();}

/* 9x9 pixel icons */
const ico=d=>'<svg viewBox="0 0 9 9" aria-hidden="true"><path d="'+d+'"/></svg>';
const IC={left:ico('M5 1h1v7H5zM4 2h1v5H4zM3 3h1v3H3zM2 4h1v1H2z'),right:ico('M3 1h1v7H3zM4 2h1v5H4zM5 3h1v3H5zM6 4h1v1H6z'),
  pause:ico('M2 1h2v7H2zM5 1h2v7H5z'),sound:ico('M1 3h2v3H1zM3 2h1v5H3zM4 1h1v7H4zM6 3h1v3H6zM8 1h1v7H8z'),
  mute:ico('M1 3h2v3H1zM3 2h1v5H3zM4 1h1v7H4zM6 3h1v1H6zM8 3h1v1H8zM7 4h1v1H7zM6 5h1v1H6zM8 5h1v1H8z'),
  full:ico('M0 0h3v1H1v2H0zM6 0h3v3H8V1H6zM0 6h1v2h2v1H0zM8 6h1v3H6V8h2z'),
  unfull:ico('M2 0h1v3H0V2h2zM6 0h1v2h2v1H6zM0 6h3v3H2V7H0zM6 6h3v1H7v2H6z')};

/* ---- layout: portrait = screen on top, panel below; landscape = stick wing | screen | button wing ---- */
const clamp=(a,v,b)=>Math.max(a,Math.min(b,v));
const apiFS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
const isFS=()=>apiFS()||!!(window.matchMedia&&matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches);
const desktopPointer=window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)');
let orient='',kbRowsN=4,desktopRapY=150;
function layoutMobile(){
  const b=document.body,land=innerWidth>innerHeight*1.1,fs=isFS();orient=land?'land':'port';b.dataset.or=orient;
  if(fs)b.dataset.fs='1';else delete b.dataset.fs;
  const kb=b.dataset.deck==='kb',overlay=kb&&b.dataset.mode==='rap'&&desktopPointer&&desktopPointer.matches;
  b.toggleAttribute('data-kb-overlay',!!overlay);
  bfull.innerHTML=apiFS()?IC.unfull:IC.full;bfull.setAttribute('aria-label',apiFS()?'Leave full screen':'Full screen');
  const cs=getComputedStyle(app),gap=parseFloat(cs.rowGap)||10,sysH=land?34:36,
    W=app.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),H=app.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  const rg=6,n=kbRowsN;let s,kbH=0,topH=0,pw=0;
  if(kb&&!overlay&&land){kbH=n*clamp(34,(H*.52-(n-1)*rg)/n,54)+(n-1)*rg;topH=H-kbH-gap;s=Math.min(topH/240,W*.46/320);}
  else if(kb&&!overlay){kbH=n*clamp(42,(H*.34-(n-1)*rg)/n,54)+(n-1)*rg;pw=Math.min(W,560);const ph=b.dataset.mode==='rap'?pw*48/320:0;
    s=Math.min(W/320,(H-kbH-ph-sysH-3*gap)/240);}
  else if(land)s=Math.min((W-2*(fs?128:140)-2*gap)/320,H/240); // narrowest wings that still hold the controls
  else s=Math.min(W/320,(H-clamp(230,H*.4,400)-sysH-2*gap)/240);
  s=Math.max(.5,s);
  // crisp pixels: whole-number scale on ordinary screens (as before); on dense screens snap to whole device pixels when that
  // loses little. Full screen fills the space instead and only snaps when it costs almost nothing.
  const dpr=devicePixelRatio||1;
  if(fs){const si=Math.floor(s*dpr)/dpr;s=si>=s*.97?si:Math.floor(320*s*dpr)/(320*dpr);}
  else if(dpr<2){if(s>=1)s=Math.floor(s);}else{const si=Math.floor(s*dpr)/dpr;if(si>=s*.92)s=si;}
  const cw=320*s,ch=240*s;cv.style.width=cw+'px';cv.style.height=ch+'px';
  if(kb){
    // Keep the original desktop rap panel above the keys without resizing the game screen.
    if(overlay){kbH=n*clamp(34,(H*.34-(n-1)*rg)/n,54)+(n-1)*rg;
      const bottom=app.getBoundingClientRect().bottom-parseFloat(cs.paddingBottom);
      desktopRapY=clamp(18,Math.floor((bottom-kbH-gap-cv.getBoundingClientRect().top)/s)-84,150);
      app.style.setProperty('--kb-bottom',cs.paddingBottom);}
    else if(land)pw=Math.min(W-cw-gap-10,(topH-sysH-gap)*320/48,640);
    kbEl.style.height=kbH+'px';kbEl.style.width=overlay?Math.min(W,cw,760)+'px':'';pc.style.setProperty('--pml',land&&!overlay?'10px':'0px');
    pc.style.width=pw+'px';pc.style.height=pw*48/320+'px';return;}
  // control sizes and a shared resting height for the stick and the button cluster
  let td,rd,sb,cys,cya;
  if(land){const wing=(W-cw-2*gap)/2,top=sysH+gap;td=clamp(60,wing*.52,104);rd=td*.78;sb=clamp(84,wing*.74,128);
    cys=clamp(sb/2+4,H*.56-top,H-top-sb/2-24);cya=clamp((td+rd*.8)/2,cys+top,H-(td+rd*.8)/2);}
  else{const side=(W-gap)/2,deck=H-ch-sysH-2*gap;td=clamp(72,Math.min(side*.5,deck*.36),108);rd=td*.78;sb=clamp(96,Math.min(side*.72,deck*.5),136);
    cys=cya=clamp(Math.max(sb,td+rd*.8)/2+6,deck*.45,deck-sb/2-26);}
  stickEl.style.setProperty('--sb',Math.round(sb)+'px');stickEl.style.setProperty('--cys',Math.round(cys)+'px');
  actsEl.style.setProperty('--td',Math.round(td)+'px');actsEl.style.setProperty('--rd',Math.round(rd)+'px');actsEl.style.setProperty('--cya',Math.round(cya)+'px');
}

/* ---- stick: appears where the thumb lands, 8 directions like the arrow keys ---- */
let stick=null;
function setDir(x,y){tkeys.arrowright=x>0;tkeys.arrowleft=x<0;tkeys.arrowdown=y>0;tkeys.arrowup=y<0;}
function placeBase(){baseEl.style.left=(stick.x-stick.r.left)+'px';baseEl.style.top=(stick.y-stick.r.top)+'px';}
function releaseStick(){stick=null;stickEl.classList.remove('on');knobEl.style.transform='';baseEl.style.left=baseEl.style.top='';setDir(0,0);}
function moveStick(e){const r=stick.r,SR=stick.sr;let dx=e.clientX-stick.x,dy=e.clientY-stick.y,d=Math.hypot(dx,dy);
  if(d>SR){const k=(d-SR)/d; // a thumb that drifts drags the stick along
    const h=Math.min(stick.br,r.width/2,r.height/2);stick.x=Math.max(r.left+h,Math.min(r.right-h,stick.x+dx*k));stick.y=Math.max(r.top+h,Math.min(r.bottom-h,stick.y+dy*k));placeBase();
    dx=e.clientX-stick.x;dy=e.clientY-stick.y;d=Math.hypot(dx,dy);}
  const kd=Math.min(1,SR/(d||1));knobEl.style.transform='translate('+dx*kd+'px,'+dy*kd+'px)';
  if(d<9){setDir(0,0);return;}
  const v=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]][(Math.round(Math.atan2(dy,dx)/(Math.PI/4))+8)%8];setDir(v[0],v[1]);}
stickEl.addEventListener('pointerdown',e=>{if(stick)return;e.preventDefault();try{stickEl.setPointerCapture(e.pointerId);}catch(_){}
  stick={id:e.pointerId,x:e.clientX,y:e.clientY,r:stickEl.getBoundingClientRect(),sr:baseEl.offsetWidth*.32,br:baseEl.offsetWidth/2};placeBase();stickEl.classList.add('on');moveStick(e);});
stickEl.addEventListener('pointermove',e=>{if(stick&&e.pointerId===stick.id)moveStick(e);});
for(const t of ['pointerup','pointercancel','lostpointercapture'])stickEl.addEventListener(t,e=>{if(stick&&e.pointerId===stick.id)releaseStick();});

/* ---- buttons: [data-k] fires on touch-down (actions, keys); [data-up] fires on release (menus) ---- */
const held=new Map();
addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')TOUCH=true;audioInit();
  const b=e.target.closest&&e.target.closest('#app [data-k]');if(!b||b.dataset.up)return;
  e.preventDefault();b.classList.add('hit');held.set(e.pointerId,b);
  if(L&&L.metro&&S.mode==='play'&&b===bthrow){tkeys[' ']=true;try{b.setPointerCapture(e.pointerId);}catch(_){}}
  tapKey(b.dataset.k);},true);
const unhold=e=>{const b=held.get(e.pointerId);if(b){b.classList.remove('hit');held.delete(e.pointerId);
  if(b===bthrow)tkeys[' ']=[...held.values()].some(button=>button===bthrow);}};
function releaseBrake(){tkeys[' ']=false;for(const [id,b] of held)if(b===bthrow){b.classList.remove('hit');held.delete(id);}}
addEventListener('pointerup',unhold,true);addEventListener('pointercancel',unhold,true);
addEventListener('lostpointercapture',unhold,true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#app [data-k][data-up]');if(b&&!b.classList.contains('wait'))tapKey(b.dataset.k);});
addEventListener('mousedown',e=>{if(e.target.closest&&e.target.closest('#app button'))e.preventDefault();}); // keep keyboard focus on the game
bsound.addEventListener('click',()=>{audioInit();muted=!muted;syncAudioPause();});
bfull.hidden=!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
bfull.addEventListener('click',()=>{const d=document,el=d.documentElement;
  try{if(apiFS())(d.exitFullscreen||d.webkitExitFullscreen).call(d);
    else{const p=(el.requestFullscreen||el.webkitRequestFullscreen).call(el,{navigationUI:'hide'});if(p&&p.catch)p.catch(()=>{bfull.hidden=true;});}}
  catch(_){bfull.hidden=true;}});
for(const t of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(t,()=>{layoutMobile();setTimeout(layoutMobile,250);});

/* ---- taps on the game screen: tap = Enter on menu-like screens, swipe flips title pages ---- */
const TAPGO=['title','intro','pause','clear','gameover','victory','scores'];let ctap=null;
cv.addEventListener('pointerdown',e=>{ctap={id:e.pointerId,x:e.clientX,y:e.clientY};});
cv.addEventListener('pointerup',e=>{if(!ctap||ctap.id!==e.pointerId)return;const dx=e.clientX-ctap.x,dy=e.clientY-ctap.y,m=S.mode;ctap=null;
  if(m==='title'&&Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.5){tapKey(dx<0?'ArrowRight':'ArrowLeft');return;}
  if(Math.hypot(dx,dy)<24&&TAPGO.includes(m))tapKey('Enter');});

/* ---- menu buttons per screen: [label, key, class, aria label] ---- */
function menuFor(m){const last=S.level>=LEVELS.length-1;
  switch(m){
    case 'title':return {rows:[[['START','Enter','go']],[[IC.left,'ArrowLeft','sq','Previous page'],[IC.right,'ArrowRight','sq','Next page']]],hint:'SWIPE THE SCREEN TO FLIP PAGES'};
    case 'intro':return {rows:[[['GO!','Enter','go']]]};
    case 'pause':return {rows:[[['RESUME','Enter','go']],[['RESTART','r'],['QUIT','q']]]};
    case 'clear':return {rows:[[[last?'CONTINUE':'NEXT LEVEL','Enter','go']]]};
    case 'gameover':if(S.cp>=0)return {rows:[[[L&&L.metro?'RETRY METRO':'CONTINUE','Enter','go']],[['GIVE UP','q']]]};return {rows:[[['CONTINUE','Enter','go']]]};
    case 'victory':return {rows:[[['CONTINUE','Enter','go']]]};
    case 'scores':return {rows:[[['TITLE','Enter','go']],[['SHARE CARD','s']]]};
  }return {rows:[]};}
function buildMenu(m){const spec=menuFor(m);menuEl.innerHTML='';
  for(const row of spec.rows){const r=document.createElement('div');r.className='mrow';
    for(const [lab,k,cls,aria] of row){const b=document.createElement('button');b.type='button';b.tabIndex=-1;b.className='mb'+(cls?' '+cls:'');
      b.dataset.k=k;b.dataset.up='1';b.innerHTML=lab;if(aria)b.setAttribute('aria-label',aria);r.appendChild(b);}
    menuEl.appendChild(r);}
  if(spec.hint){const p=document.createElement('p');p.className='mhint';p.textContent=spec.hint;menuEl.appendChild(p);}}

/* ---- on-screen keyboard: one QWERTY block in both orientations.
   Rows are [startColumn, keys]; a key is [label, key, columnSpan, class]; a letter key spans 2 columns. ---- */
const ks=s=>[...s].map(c=>[c.toUpperCase(),c,2]);
const KB={
  rap:{cols:20,rows:[[1,ks('qwertyuiop')],[2,ks('asdfghjkl')],[4,ks('zxcvbnm')],[4,[['SPACE',' ',14,'wide']]]]},
  entry:{cols:22,rows:[[2,ks('1234567890')],[2,ks('qwertyuiop')],[3,ks('asdfghjkl')],[1,[['DEL','Backspace',3,'fn'],...ks('zxcvbnm'),['OK','Enter',5,'go']]]]}};
let keyEls={};
function buildKeys(m){const sp=KB[m==='rap'?'rap':'entry'];kbEl.innerHTML='';keyEls={};kbRowsN=sp.rows.length;
  kbEl.style.setProperty('--cols',sp.cols);kbEl.style.setProperty('--rows',sp.rows.length);
  sp.rows.forEach(([c0,keys],ri)=>{let c=c0;for(const [lab,k,w,cls] of keys){const b=document.createElement('button');b.type='button';b.tabIndex=-1;
    b.className='k'+(cls?' '+cls:'');b.dataset.k=k;b.innerHTML=lab;b.style.gridColumn=c+' / span '+w;b.style.gridRow=String(ri+1);
    if(k===' ')b.setAttribute('aria-label','Space');kbEl.appendChild(b);keyEls[k]=b;c+=w;}});}

/* ---- prompter: the line to type at double size, right above the keyboard, same colours as the in-game rap panel ---- */
function drawPrompt(){const r=L&&L.rap;if(!r)return;const c=pctx,fr=Math.max(0,r.t/r.tmax);
  c.fillStyle='#1a121c';c.fillRect(0,0,320,48);
  const bar=f=>{c.fillStyle='#140a14';c.fillRect(8,41,304,6);c.fillStyle=f>.5?'#5cdc5c':f>.25?'#f8c840':'#e04a3a';c.fillRect(9,42,Math.round(302*f),4);};
  if(r.miss>0){c.fillStyle='#e04a3a';c.fillRect(0,0,320,1);c.fillRect(0,47,320,1);c.fillRect(0,0,1,48);c.fillRect(319,0,1,48);}
  if(r.cool>0&&r.done===0){const t='GET READY...';glyphs(c,t,Math.round(160-tw(t,2)/2),12,'#f2e6d0',2);bar(1);return;}
  const s=r.line.toUpperCase();let parts=[[0,s.length]];
  if(s.length>26){let b=s.lastIndexOf(' ',25);if(b<1)b=25;parts=[[0,b+1],[b+1,s.length]];}
  const sc=parts.every(([a,b])=>b-a<=26)?2:1,lh=7*sc+5,top=parts.length>1?3:Math.round(20-lh/2);
  parts.forEach(([a,b],li)=>{const n=b-a-(li<parts.length-1&&s[b-1]===' '?1:0),x0=Math.round(160-(n*6*sc-sc)/2),ly=top+li*lh;
    for(let i=a;i<b;i++){const ch=s[i],x=x0+(i-a)*6*sc,done=i<r.idx,cur=i===r.idx;
      if(ch===' '){c.fillStyle=done?'#3a8a3a':cur?'#f8c840':'#6a5a6a';c.fillRect(x+2*sc,ly+3*sc,sc,sc);}
      else glyphs(c,ch,x,ly,done?'#5cdc5c':cur?'#f8c840':'#f2e6d0',sc);
      if(cur&&Math.floor(S.clock*6)%2){c.fillStyle='#f8c840';c.fillRect(x-1,ly+7*sc+1,6*sc,sc);}}});
  bar(fr);}
function drawEntryPrompt(){const e=S.entry;if(!e)return;const c=pctx,sc=pad(S.score,7);
  c.fillStyle='#1a121c';c.fillRect(0,0,320,48);
  glyphs(c,'RANK '+(e.rank+1),10,12,'#9dbb6c',1);glyphs(c,'OF 10',10,24,'#9a8aa8',1);
  glyphs(c,'SCORE',310-tw('SCORE',1),12,'#9a8aa8',1);glyphs(c,sc,310-tw(sc,1),24,'#f2e6d0',1);
  for(let i=0;i<3;i++){const x=102+i*42,on=i===e.pos;c.fillStyle='#0e0a12';c.fillRect(x-2,2,36,44);c.fillStyle='#2a1f2c';c.fillRect(x,4,32,40);
    glyphs(c,e.l[i],x+6,9,on?'#f8c840':'#f2e6d0',4);if(on&&Math.floor(S.clock*4)%2){c.fillStyle='#f8c840';c.fillRect(x+4,39,24,2);}}}

/* ---- per frame: match the panel to the current screen ---- */
const READY={intro:.4,clear:.8,gameover:1.2,victory:1.2,scores:.5}; // same waits as onKey() before Enter works
let deckMode=null,lastDrive=false,lastMags=-1,lastMic=null,lastMute=null,lastNext,nextEl=null;
function applyDeck(m){deckMode=m;const d=m==='play'||m==='caught'?'play':m==='rap'||m==='entry'?'kb':'menu';
  document.body.dataset.deck=d;document.body.dataset.mode=m;
  const drive=!!(L&&L.metro&&!['title','entry','scores'].includes(m));lastDrive=drive;
  if(drive)document.body.dataset.drive='metro';else delete document.body.dataset.drive;
  releaseBrake();brap.hidden=nmags.hidden=drive;bthrow.firstChild.nodeValue=drive?'BRAKE':'THROW';
  bthrow.setAttribute('aria-label',drive?'Hold to brake':'Throw a magazine');bthrow.classList.remove('empty');
  stickEl.querySelector('.lbl').textContent=drive?'LEFT / RIGHT':'DRAG TO MOVE';
  if(d!=='play')releaseStick();
  if(d==='menu')buildMenu(m);
  if(d==='kb')buildKeys(m);
  bpause.innerHTML=m==='pause'?IC.right:IC.pause;bpause.setAttribute('aria-label',m==='pause'?'Resume':'Pause');
  lastMags=-1;lastMic=null;lastNext=undefined;nextEl=null;
  layoutMobile();}
function syncTouch(){const m=S.mode,drive=!!(L&&L.metro&&!['title','entry','scores'].includes(m));if(m!==deckMode||drive!==lastDrive)applyDeck(m);
  if(L&&!drive&&(m==='play'||m==='caught')){const p=L.p;
    if(p.mags!==lastMags){lastMags=p.mags;nmags.textContent='X'+p.mags;bthrow.classList.toggle('empty',!p.mags);}
    if(p.mic!==lastMic){lastMic=p.mic;brap.classList.toggle('live',!!p.mic);}}
  if(muted!==lastMute){lastMute=muted;bsound.innerHTML=muted?IC.mute:IC.sound;bsound.setAttribute('aria-label',muted?'Sound is off':'Sound is on');}
  const w=READY[m];if(w!=null){const b=menuEl.querySelector('.go');if(b)b.classList.toggle('wait',S.t<=w);}
  if(m==='rap'&&L&&L.rap){drawPrompt();
    const r=L.rap,want=CFG.touchRapHint&&!(r.cool>0&&r.done===0)?r.line[r.idx]:null; // light up the next key to press
    if(want!==lastNext){lastNext=want;if(nextEl)nextEl.classList.remove('next');nextEl=want!=null?keyEls[want]:null;if(nextEl)nextEl.classList.add('next');}}
  if(m==='entry'&&orient==='land')drawEntryPrompt();}

/* ---- phone housekeeping ---- */
const buzz=p=>{if(TOUCH&&!muted&&navigator.vibrate)try{navigator.vibrate(p);}catch(_){}};
for(const [k,p] of [['caught',[70,50,140]],['slip',30]]){const f=SFX[k];SFX[k]=function(){buzz(p);return f.apply(SFX,arguments);};}
document.addEventListener('visibilitychange',()=>{if(document.hidden){for(const k in keys)keys[k]=false;releaseStick();releaseBrake();if(S.mode==='play')S.mode='pause';}syncAudioPause();});
for(const t of ['gesturestart','gesturechange','dblclick'])document.addEventListener(t,e=>e.preventDefault());
document.addEventListener('contextmenu',e=>{if(!(e.target.closest&&e.target.closest('#share')))e.preventDefault();});
app.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
for(const t of ['touchend','pointerup','click'])addEventListener(t,()=>audioInit(),true); // unlock on release, including controls that prevent a click
if(window.visualViewport)visualViewport.addEventListener('resize',()=>layoutMobile());
if(desktopPointer)desktopPointer.addEventListener('change',layoutMobile);
addEventListener('orientationchange',()=>setTimeout(layoutMobile,150));

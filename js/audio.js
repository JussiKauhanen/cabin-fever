"use strict";
/* WebAudio chiptune: sound effects (SFX) and the step sequencer for music. */
let AC=null,MG=null,NB=null,muted=false,audioPaused=false,audioUnlocked=false;
function audioInit(){if(!AC){
  // Use media volume on iOS, where the default ambient session follows the silent switch.
  try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(_){}
  try{AC=new (window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=muted?0:.3;MG.connect(AC.destination);
    NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}catch(e){AC=null;}}
  resumeAudio();}
function resumeAudio(){if(!AC||AC.state==='closed'||S.mode==='pause'||document.hidden)return;
  // Start a silent buffer in the gesture itself: older iOS versions need this as well as resume().
  if(!audioUnlocked){const s=AC.createBufferSource();s.buffer=AC.createBuffer(1,1,AC.sampleRate);s.connect(MG);
    s.onended=()=>{audioUnlocked=true;s.disconnect();};s.start(0);}
  if(AC.state==='suspended'||AC.state==='interrupted')AC.resume().catch(()=>{});}
const anow=()=>AC?AC.currentTime:0;
function tn(f,d,type,v,f2,at){if(!AC||AC.state!=='running'||muted)return;const t=at||AC.currentTime;const o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(v||.1,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(MG);o.start(t);o.stop(t+d+.03);}
function nz(d,v,freq,at,ft){if(!AC||AC.state!=='running'||muted)return;const t=at||AC.currentTime;const s=AC.createBufferSource();s.buffer=NB;const fl=AC.createBiquadFilter();fl.type=ft||'lowpass';fl.frequency.value=freq||1200;const g=AC.createGain();
  g.gain.setValueAtTime(v||.1,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(fl);fl.connect(g);g.connect(MG);s.start(t,Math.random()*.5);s.stop(t+d+.03);}
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const SFX={
  pick(){tn(660,.08,'square',.07);tn(990,.12,'square',.07,null,anow()+.07);},
  mic(){[523,659,784,1046].forEach((f,i)=>tn(f,.1,'square',.06,null,anow()+i*.06));},
  throw(){nz(.18,.12,2400,0,'bandpass');tn(500,.15,'triangle',.06,180);},
  hit(){tn(300,.1,'square',.08,600);},
  puke(){nz(.55,.22,500);tn(170,.5,'sawtooth',.07,50);},
  slip(){tn(520,.25,'square',.06,120);nz(.1,.08,3000,0,'highpass');},
  key(){tn(1200,.03,'square',.025);},
  miss(){tn(110,.12,'square',.08);},
  line(){[660,880,1320].forEach((f,i)=>tn(f,.09,'square',.06,null,anow()+i*.05));},
  caught(){[392,330,262,196,131].forEach((f,i)=>tn(f,.22,'square',.08,null,anow()+i*.16));nz(.8,.2,400,anow()+.5);},
  sun(){[523,659,784,1046,1318].forEach((f,i)=>tn(f,.3,'triangle',.08,null,anow()+i*.09));},
  win(){[523,523,784,1046,784,1046,1318].forEach((f,i)=>tn(f,.16,'square',.07,null,anow()+i*.11));},
  blip(){tn(880,.05,'square',.05);},
  grumble(){tn(90+Math.random()*30,.25,'sawtooth',.035,60);},
  growl(){nz(.55,.16,320);tn(85,.55,'sawtooth',.08,48);},          // bear winding up a charge
  spill(){nz(.3,.1,900,0,'bandpass');tn(320,.22,'triangle',.04,120);}, // spurgu spills his beer
  flag(){[392,523,659,784,1046].forEach((f,i)=>tn(f,.12,'square',.06,null,anow()+i*.07));}, // checkpoint found
  bell(){tn(1320,.22,'triangle',.05);tn(1980,.12,'sine',.02);},                                 // platform warning bell
  train(){nz(2.4,.2,420);nz(1.6,.06,2600,anow()+.3,'bandpass');tn(72,2.2,'sawtooth',.05,40);tn(392,.35,'square',.035,null,anow()+.1);tn(330,.45,'square',.03,null,anow()+.45);},
  chime(){[784,659,523].forEach((f,i)=>tn(f,.5,'sine',.07,null,anow()+i*.32));},              // announcement ding-dong
  splat(){nz(.25,.18,700);tn(110,.22,'square',.06,40);},                                        // a zombie meets a train
  doors(){tn(880,.14,'square',.03);tn(660,.2,'square',.03,null,anow()+.18);nz(.5,.05,1800,anow()+.4,'highpass');},
  fine(){tn(1200,.06,'square',.03);tn(1600,.09,'square',.03,null,anow()+.08);}                 // card reader beep
};
const seq={next:0,step:0,mode:null};
/* lead line for the metro platform tune: one row of 16 steps per bar, MIDI notes, 0 = rest (a note holds until the next one) */
const STATION_LEAD=[[69,0,72,0,76,0,74,72,0,69,0,67,69,0,0,0],[76,0,76,77,79,0,77,76,74,0,72,0,74,0,76,0],
  [77,0,76,0,72,0,69,0,72,0,74,0,72,0,0,0],[71,0,74,0,79,0,0,77,79,0,81,0,79,77,74,0],
  [81,0,79,0,76,0,79,81,0,76,0,74,76,0,0,0],[72,0,74,76,0,72,74,76,79,0,76,0,74,72,69,0],
  [72,0,77,0,81,0,77,0,72,0,77,0,84,0,81,0],[80,0,0,76,0,0,71,0,74,0,76,0,80,0,83,0]];
function music(m){if(seq.mode!==m){seq.mode=m;seq.step=0;seq.next=anow()+.05;}}
function syncAudioPause(){if(!AC)return;const paused=S.mode==='pause'||document.hidden;MG.gain.value=muted?0:.3;
  if(paused===audioPaused)return;audioPaused=paused;
  // Freezing the audio clock also holds queued notes, so resuming continues the same phrase.
  if(paused)AC.suspend().catch(()=>{});else resumeAudio();}
function seqTick(){syncAudioPause();if(!AC||AC.state!=='running'||audioPaused||!seq.mode)return;const bpm=seq.mode==='station'?150:seq.mode==='rap'?96:seq.mode==='title'?112:84;const sd=60/bpm/4;
  if(seq.next<AC.currentTime-.3)seq.next=AC.currentTime+.02;
  while(seq.next<AC.currentTime+.12){if(!muted)playStep(seq.mode,seq.step,seq.next);seq.next+=sd;seq.step++;}}
function playStep(m,s,t){
  const i=s&15;
  if(m==='night'){const bar=(s>>4)&3;const roots=[45,41,43,40];if(i===0||i===8)tn(NOTE(roots[bar]),.5,'triangle',.11,null,t);
    if(i%4===2){const ch=[[57,60,64],[53,57,60],[55,59,62],[52,56,59]][bar];tn(NOTE(ch[(i>>2)%3]+12),.16,'square',.02,null,t);}
    if(i===12&&bar===3)nz(.05,.03,4000,t,'highpass');}
  else if(m==='rap'){const bar=(s>>4)&1;if(i===0||i===7||i===10)tn(150,.2,'sine',.45,40,t);if(i===4||i===12)nz(.16,.22,1800,t,'bandpass');if(i%2===0)nz(.03,.05,7000,t,'highpass');
    const bass=[40,0,0,40,0,0,43,0,45,0,43,0,40,0,38,0][i];if(bass)tn(NOTE(bass),.2,'square',.06,null,t);if(i===14&&bar)tn(NOTE(76),.08,'square',.03,null,t);}
  else if(m==='title'){const bar=(s>>4)&3;const roots=[45,48,43,40];const arp=[0,7,12,15,12,7,3,7];tn(NOTE(roots[bar]+24+arp[i%8]),.1,'square',.03,null,t);
    if(i%4===0)tn(NOTE(roots[bar]),.22,'triangle',.11,null,t);if(i%8===4)nz(.08,.07,2000,t,'bandpass');if(i%2===0)nz(.02,.025,8000,t,'highpass');}
  else if(m==='station'){
    // 8-bar arcade action loop in A minor (Am Am F G Am Am F E): bouncing octave bass, punchy kit, heroic square lead.
    const b=(s>>4)&7,root=[45,45,41,43,45,45,41,40][b],sd=60/150/4,lead=STATION_LEAD[b];
    if(i%2===0)tn(NOTE(root+[0,12,0,0,12,0,10,12][i>>1]),.12,'triangle',.13,null,t);
    if(i===0||i===8||i===10||(i===6&&b%2))tn(150,.14,'sine',.4,40,t);
    if(i===4||i===12){nz(.12,.16,1900,t,'bandpass');tn(210,.07,'triangle',.05,120,t);}
    nz(.025,i%2?.03:.015,8000,t,'highpass');
    if(i%4===2)for(const iv of b%4<2?[3,7]:[4,7])tn(NOTE(root+12+iv),.08,'square',.012,null,t);
    if(lead[i]){let n=1;while(i+n<16&&!lead[i+n])n++;tn(NOTE(lead[i]),Math.min(n,4)*sd*.9,'square',.034,null,t);
      tn(NOTE(lead[i]-12),Math.min(n,4)*sd*.8,'square',.012,null,t+sd*.5);}                       // a quiet octave echo
    if(b===7&&i>=12)tn(NOTE(52-(i-12)*2),.09,'triangle',.1,null,t);}                              // tom fill into the loop
}

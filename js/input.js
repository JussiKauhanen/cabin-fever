"use strict";
/* Keyboard handling and the screen-to-screen flow (title > intro > play > ... > scores). */
function afterGame(){const sc=Math.floor(S.score);const rank=S.scores.findIndex(s=>sc>s.s);const r=rank<0?(S.scores.length<10?S.scores.length:-1):rank;
  if(r>=0&&r<10){S.entry={l:['A','A','A'],pos:0,rank:r};S.mode='entry';}else{S.lastIdx=-1;S.mode='scores';}S.t=0;}
function submitEntry(){const e=S.entry;const rec={n:e.l.join(''),s:Math.floor(S.score),w:S.stats.reached,d:new Date().toISOString().slice(0,10),z:S.zombies>MAXZ?MAXZ:S.zombies,lines:S.stats.lines,mags:S.stats.mags};
  S.scores.splice(e.rank,0,rec);S.scores=S.scores.slice(0,10);saveScores();S.lastIdx=e.rank;S.card=Object.assign({rank:e.rank},rec);S.mode='scores';S.t=0;SFX.win();}
function continueGame(){S.level=S.cp;S.zombies=1;S.score=S.cpScore;S.cp=-1;S.won=false;SFX.blip();toIntro(false);} // checkpoint: retry that level, fresh lives
const AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
function onKey(e){
  const k=e.key,kl=k.toLowerCase(),m=S.mode;
  if(kl==='m'&&m!=='entry'){muted=!muted;return;}
  if(m==='title'){if(k==='Enter'||k===' '){SFX.blip();startGame();}else if(k==='ArrowRight'){S.page=(S.page+1)%3;S.pageT=0;}else if(k==='ArrowLeft'){S.page=(S.page+2)%3;S.pageT=0;}return;}
  if(m==='intro'){if(k==='Enter'&&S.t>.4){S.mode='play';S.t=0;}return;}
  if(m==='play'){if(L.metro){if(kl==='p'||k==='Escape')S.mode='pause';else metroKey(e);return;}
    if(k===' '&&!e.repeat)throwMag();else if(kl==='r')startRap();else if(kl==='p'||k==='Escape'){S.mode='pause';}return;}
  if(m==='pause'){if(kl==='p'||k==='Escape'||k==='Enter')S.mode='play';else if(kl==='r'){SFX.blip();startGame();}else if(kl==='q'){S.mode='title';S.page=0;L=null;}return;} // r = restart (added with the mobile version)
  if(m==='clear'){if(k==='Enter'&&S.t>.8){if(S.level<LEVELS.length-1){S.level++;toIntro(false);}else{S.mode='victory';S.t=0;S.won=true;}}return;}
  if(m==='gameover'&&S.cp>=0){if(S.t>1.2){if(k==='Enter')continueGame();else if(kl==='q'||k==='Escape')afterGame();}return;}
  if(m==='gameover'||m==='victory'){if(k==='Enter'&&S.t>1.2)afterGame();return;}
  if(m==='entry'){const en=S.entry;
    if(/^[a-z0-9]$/i.test(k)){en.l[en.pos]=k.toUpperCase();SFX.blip();if(en.pos<2)en.pos++;}
    else if(k==='ArrowUp'||k==='ArrowDown'){const i=AZ.indexOf(en.l[en.pos]);en.l[en.pos]=AZ[(i+(k==='ArrowUp'?1:AZ.length-1))%AZ.length];SFX.blip();}
    else if(k==='ArrowLeft'||k==='Backspace'){en.pos=Math.max(0,en.pos-1);}else if(k==='ArrowRight'){en.pos=Math.min(2,en.pos+1);}
    else if(k==='Enter'){if(en.pos<2)en.pos++;else submitEntry();}return;}
  if(m==='scores'){if(k==='Enter'&&S.t>.5){S.mode='title';S.page=1;S.pageT=0;S.score=0;}else if(kl==='s')openShare();return;}
}
const shareEl=document.getElementById('share');
addEventListener('keydown',e=>{
  audioInit();TOUCH=false;
  if(!shareEl.hidden){if(e.key==='Escape'){closeShare();e.preventDefault();}return;}
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Backspace'].includes(e.key))e.preventDefault();
  if(S.mode==='rap'){e.preventDefault();rapKey(e);return;}
  keys[e.key.toLowerCase()]=true;onKey(e);syncAudioPause();
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;if(typeof releaseBrake==='function')releaseBrake();if(S.mode==='play')S.mode='pause';syncAudioPause();});
cv.addEventListener('pointerdown',()=>{cv.focus();audioInit();}); // mobile: taps and swipes on the screen are handled in touch.js

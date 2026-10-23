"use strict";
/* Builds the share card image and wires the Copy buttons. */
let cardBlob=null;
function makeCard(){
  const c0=S.card||{n:'???',s:Math.floor(S.score),rank:0,w:'L1',d:new Date().toISOString().slice(0,10),z:S.zombies,lines:0,mags:0};
  const [c,x]=mk(320,180);const prevG=G;G=x;
  x.drawImage(GEO[1].bgN,0,-34);x.drawImage(GEO[1].fgN,0,-34);R(0,0,320,180,'rgba(10,6,20,.62)');
  R(0,0,320,3,'#7a6470');R(0,177,320,3,'#7a6470');R(0,0,3,180,'#7a6470');R(317,0,3,180,'#7a6470');
  const word=(s,yy,cols,sc,cx)=>{const w=tw(s,sc);let xx=cx-w/2;for(const ch of s){glyphs(x,ch,xx+sc,yy+sc+1,'#140a14',sc);for(const [ox,oy] of [[-1,0],[1,0],[0,-1],[0,1]])glyphs(x,ch,xx+ox*2,yy+oy*2,'#140a14',sc);glyphs(x,ch,xx,yy,cols,sc);xx+=6*sc;}};
  word('CABIN',12,TG,3,90);word('FEVER',12,TR,3,230);
  txt('HALL OF FAME  #'+(c0.rank+1),160,42,'#f8c840',1,'c','#140a14');
  panel(30,56,260,72);
  txt(c0.n,62,66,'#f0a0c8',3,'c','#140a14');txt(pad(c0.s,7),196,66,'#f2e6d0',3,'c','#140a14');
  txt(c0.w==='ESC'?'ESCAPED BOTH LEVELS':'REACHED LEVEL '+String(c0.w).replace('L',''),160,96,c0.w==='ESC'?'#9dbb6c':'#f8c840',1,'c');
  txt((c0.z||1)+' ZOMBIES  '+(c0.lines||0)+' RAP LINES  '+(c0.mags||0)+' MAGS READ',160,110,'#c8b8c8',1,'c');
  drawHuman(x,34,166,2,Math.floor(S.clock*6),PP,{});drawHuman(x,286,166,3,0,PZ,{puke:true});
  for(let i=0;i<5;i++)R(268-i*4,157+i,2,2,TG[i+1]);
  txt((c0.d||'')+'   CAN YOU SURVIVE THE NIGHT?',160,160,'#9a8aa8',1,'c');
  G=prevG;const [b,bx]=mk(960,540);bx.drawImage(c,0,0,960,540);return b;
}
function openShare(){const b=makeCard();document.getElementById('cardimg').src=b.toDataURL('image/png');cardBlob=null;try{b.toBlob(bl=>{cardBlob=bl;},'image/png');}catch(e){}
  document.getElementById('smsg').textContent='';shareEl.hidden=false;document.getElementById('bcopy').focus();}
function closeShare(){shareEl.hidden=true;cv.focus();}
document.getElementById('bclose').addEventListener('click',closeShare);
document.getElementById('bcopy').addEventListener('click',()=>{const msg=document.getElementById('smsg');
  try{if(!cardBlob||!window.ClipboardItem)throw 0;navigator.clipboard.write([new ClipboardItem({'image/png':cardBlob})]).then(()=>{msg.textContent='Image copied. Paste it anywhere.';},()=>{msg.textContent='Copying images is blocked here. Right-click or long-press the image to save it.';});}
  catch(e){msg.textContent='Copying images is blocked here. Right-click or long-press the image to save it.';}});
document.getElementById('btext').addEventListener('click',()=>{const c0=S.card||{n:'???',s:Math.floor(S.score),w:'L1'};const msg=document.getElementById('smsg');
  const t=`${c0.n} scored ${c0.s.toLocaleString('en-US')} in CABIN FEVER${c0.w==='ESC'?' and escaped both levels':''}. The zombie still thinks Toyota is the best car.`;
  const done=()=>{msg.textContent='Brag text copied.';};
  try{navigator.clipboard.writeText(t).then(done,()=>{msg.textContent=t;});}catch(e){msg.textContent=t;}});

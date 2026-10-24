"use strict";
/* Draws the play screen: world layers, entities, lighting, HUD, banners and the rap panel. */
const [lc,lx]=mk(320,224);
let speechState=null,noticeState=null;
function dawnAmt(){return ss(.72,1,L.time/L.d.night);}
function drawWorld(shake){
  const g=L.g,dawn=dawnAmt();
  ctx.save();ctx.translate(shake?Math.round((Math.random()-.5)*3):0,OY);G=ctx;
  ctx.drawImage(g.bgN,0,0);if(g.bgD&&dawn>0){ctx.globalAlpha=dawn;ctx.drawImage(g.bgD,0,0);ctx.globalAlpha=1;}
  g.dyn(dawn,'under');
  // puddles
  for(const pd of L.puddles){
    if(pd.mushroom){ctx.save();ctx.globalAlpha=Math.max(.3,Math.min(1,pd.t/.7));
      pd.chunks.forEach((c,i)=>{const x=pd.x+c[0],y=pd.y+c[1];R(x-1,y,3,2,'#24161e');
        R(x,y,2,1,i%2?'#f2e6d0':'#e88830');R(x-1,y-1,2,1,i%2?'#e88830':'#f8c840');});ctx.restore();continue;}
    if(pd.t<3&&Math.floor(pd.t*8)%2)continue;const pc=pd.beer?['#5a3a12','#c8902a','#e0b44a','#f4ecd8','#fff6d8']:['#4e5a16','#b4c03a','#cdd44e','#8a6a2a','#f0f4a0'];
    for(const b of pd.blobs)ell(pd.x+b[0],pd.y+b[1],b[2]+1,b[3]+1,pc[0]);
    for(const b of pd.blobs)ell(pd.x+b[0],pd.y+b[1],b[2],b[3],pc[1]);
    for(const b of pd.blobs)ell(pd.x+b[0]-1,pd.y+b[1]-1,Math.max(1,b[2]-3),Math.max(1,b[3]-2),pc[2]);
    for(const c of pd.chunks)R(pd.x+c[0],pd.y+c[1],2,1,pc[3]);R(pd.x-3,pd.y-2,2,1,pc[4]);}
  // items
  for(const it of L.items){const x=Math.round(it.x),y=Math.round(it.y),b=Math.round(Math.sin(it.t*4));
    if(it.type==='stash'){ell(x,y,7,2,'rgba(10,6,20,.35)');R(x-6,y-9+b,12,9,'#24161e');R(x-5,y-8+b,10,6,'#e05a8a');R(x-4,y-7+b,5,1,'#fff');R(x-2,y-5+b,4,2,'#f0d040');R(x-5,y-2+b,10,1,'#3ac0d0');R(x-5,y-1+b,10,1,'#f0d040');
      if(Math.floor(it.t*3)%2){R(x+6,y-12+b,1,3,'#fff');R(x+5,y-11+b,3,1,'#fff');}}
    else if(it.type==='mic'){ell(x,y,5,2,'rgba(10,6,20,.35)');R(x-2,y-6+b,4,7,'#24161e');R(x-1,y-5+b,2,5,'#3a3a48');disc(x,y-9+b,3,'#24161e');disc(x,y-9+b,2,'#c8c8d8');R(x-1,y-10+b,1,1,'#fff');R(x,y-8+b,1,1,'#7a7a8a');
      if(Math.floor(it.t*4)%2){R(x+5,y-14+b,1,3,'#d8dc5a');R(x+4,y-13+b,3,1,'#d8dc5a');R(x-6,y-6+b,1,1,'#d8dc5a');}}
    else if(it.type==='cp'){ell(x,y,4,1,'rgba(10,6,20,.35)');R(x-1,y-14,3,15,'#24161e');R(x,y-13,1,13,'#c8c0b0');R(x+1,y-14,9,7,'#24161e');R(x+2,y-13,7,5,'#e04a3a');
      for(let i=0;i<7;i+=2)R(x+2+i,y-13+(i%4?2:0),2,2,'#f2e6d0');R(x+2+(Math.floor(it.t*4)%2?6:5),y-13,1,5,'#c03a2e');}
    else{if(it.life<3&&Math.floor(it.life*8)%2)continue;R(x-6,y-5,12,6,'#24161e');R(x-5,y-4,5,4,'#f2e6d0');R(x,y-4,5,4,'#e8dcc8');R(x-4,y-3,2,2,it.k===1?'#e05a8a':'#3ac0d0');R(x+1,y-3,3,1,'#8a7a8a');R(x+1,y-1,2,1,'#8a7a8a');}}
  // A windup marks the aimed spot, so moving away can dodge the mushroom.
  for(const z of L.zs)if(z.k==='granny'&&z.grannyState==='infected'&&z.throwT>0){const x=Math.round(z.aimX),y=Math.round(z.aimY),col='#f8c840';
    R(x-6,y-3,4,1,col);R(x+3,y-3,4,1,col);R(x-6,y+3,4,1,col);R(x+3,y+3,4,1,col);
    R(x-6,y-2,1,2,col);R(x+6,y-2,1,2,col);R(x-6,y+1,1,2,col);R(x+6,y+1,1,2,col);}
  // entities
  const beat=Math.floor(S.clock*96/60*2)%2;
  const ents=[{p:1,y:L.p.y}].concat(L.zs.map(z=>({z,y:z.y}))).sort((a,b)=>a.y-b.y);
  for(const e of ents){
    if(e.p){const p=L.p;const pal=p.zombie?PZ:PP;let dx=0;if(p.slip>0)dx=Math.floor(S.clock*20)%2?1:-1;if(S.mode==='caught'&&!p.zombie)dx=Math.round((Math.random()-.5)*2);
      const bob=(S.mode==='rap'&&!p.zombie)?beat:0;drawHuman(ctx,p.x,p.y,S.mode==='rap'?0:p.dir,Math.floor(p.anim),pal,{dx,hb:bob,mic:S.mode==='rap',puke:S.mode==='caught'});}
    else{const z=e.z;const vib=(S.mode==='rap'&&L.rap&&L.rap.cool<=0)||L.vibe>0;if(z.k){FOES[z.k].draw(ctx,z,vib?beat:0);continue;}drawHuman(ctx,z.x,z.y,vib||z.read>0?0:z.dir,vib||z.read>0?0:Math.floor(z.anim),PZ,{hb:vib?beat:0,read:z.read>0?z.readK:0,puke:z.puke>0});}}
  // projectiles
  for(const pr of L.projs){const x=Math.round(pr.x),y=Math.round(pr.y);ell(x,y,3,1,'rgba(10,6,20,.35)');const sp=Math.floor(pr.spin)%2;
    if(sp){R(x-5,y-12,10,6,'#24161e');R(x-4,y-11,8,4,pr.k===1?'#e05a8a':'#3ac0d0');R(x-3,y-10,3,1,'#fff');}else{R(x-2,y-14,4,9,'#24161e');R(x-1,y-13,2,7,pr.k===1?'#e05a8a':'#3ac0d0');}}
  for(const m of L.mushrooms){const x=Math.round(m.x),y=Math.round(m.y),arc=8+Math.round(Math.sin(Math.min(1,m.age/CFG.mushroomLife)*Math.PI)*7),my=y-arc;
    ell(x,y,4,1,'rgba(10,6,20,.45)');R(x-2,my+1,4,6,'#24161e');R(x-1,my+2,2,4,'#f2e6d0');
    R(x-4,my-1,8,4,'#24161e');R(x-3,my-2,6,4,'#e88830');R(x-2,my-2,4,1,'#f8c840');R(x-2,my,2,1,'#f2e6d0');R(x+1,my-1,1,1,'#f2e6d0');}
  // particles
  for(const p of L.parts){if(p.note){txt('^',p.x,p.y-p.z,p.col,1,'c');}else R(p.x,p.y-p.z,2,2,p.col);}
  // foreground
  ctx.drawImage(g.fgN,0,0);if(g.fgD&&dawn>0){ctx.globalAlpha=dawn;ctx.drawImage(g.fgD,0,0);ctx.globalAlpha=1;}
  g.dyn(dawn,'over');
  for(const it of L.items)if(it.type==='cp'&&(S.clock+it.x*.01)%2.6<.3){const x=Math.round(it.x)+4,y=Math.round(it.y)-20;R(x,y-2,1,5,'#fff6c0');R(x-2,y,5,1,'#fff6c0');} // hidden checkpoint twinkles
  // lighting
  const t=L.time/L.d.night,dark=g.dark*(1-ss(.5,1,t));
  if(dark>.01){lx.globalCompositeOperation='source-over';lx.clearRect(0,0,320,224);lx.fillStyle='rgba(12,8,34,'+dark.toFixed(3)+')';lx.fillRect(0,0,320,224);
    lx.globalCompositeOperation='destination-out';const fl=Math.sin(S.clock*13)*3+Math.sin(S.clock*7)*2;
    const lights=[[L.p.x,L.p.y-8,44]];if(g.lightsAt)lights.push(...g.lightsAt(fl));else if(g.lights==='l1')lights.push([264,56,74+fl],[160,36,34]);else lights.push([136,190,40+fl],[184,190,40-fl],[132,76,30],[188,76,30],[160,86,24]);
    for(const [x,y,r] of lights){const gr=lx.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.55,'rgba(0,0,0,.7)');gr.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=gr;lx.fillRect(x-r,y-r,2*r,2*r);}
    ctx.drawImage(lc,0,0);
    ctx.globalCompositeOperation='lighter';const warm=g.warmAt?g.warmAt(fl):g.lights==='l1'?[[264,56,50]]:[[136,190,26],[184,190,26]];
    for(const [x,y,r] of warm){const gr=ctx.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(240,138,48,'+(.16*dark/g.dark).toFixed(3)+')');gr.addColorStop(1,'rgba(240,138,48,0)');ctx.fillStyle=gr;ctx.fillRect(x-r,y-r,2*r,2*r);}
    ctx.globalCompositeOperation='source-over';}
  // The picker stays harmless until her bite countdown ends.
  for(const z of L.zs)if(z.k==='granny'&&z.grannyState!=='infected'){
    const safe=z.grannyState==='healthy',label=safe?(L.grannySaved?'SAVED':'SAFE'):'TURNING '+Math.max(1,Math.ceil(z.turnT));
    txtO(label,Math.max(28,Math.min(292,z.x)),Math.min(211,z.y+4),safe?'#9dbb6c':'#f8c840',1,'c','#140a14');}
  // Speech stays attached to its speaker; overlap fades it instead of moving it around.
  if(S.mode==='play')drawGameplaySpeech();
  // floaters
  for(const f of L.floats)txt(f.text,Math.max(tw(f.text,1)/2+2,Math.min(318-tw(f.text,1)/2,f.x)),f.y,f.col,1,'c','#140a14');
  ctx.restore();
}
function rectsOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function actionRects(){
  const p=L.p,rects=[{x:p.x-15,y:p.y-29,w:30,h:41}];
  for(const z of L.zs){const bh=z.bh||22;rects.push({x:z.x-12,y:z.y-bh-4,w:24,h:bh+18});
    if(z.k==='granny'&&z.throwT>0)rects.push({x:z.aimX-10,y:z.aimY-8,w:20,h:16});}
  for(const m of L.mushrooms)rects.push({x:m.x-8,y:m.y-22,w:16,h:27});
  for(const m of L.projs)rects.push({x:m.x-8,y:m.y-18,w:16,h:23});
  for(const pd of L.puddles)if(Math.hypot(pd.x-p.x,pd.y-p.y)<60)for(const b of pd.blobs)
    rects.push({x:pd.x+b[0]-b[2]-2,y:pd.y+b[1]-b[3]-2,w:b[2]*2+4,h:b[3]*2+4});
  return rects;}
/* Positions use world coordinates below the HUD. Each utterance keeps its side and full box size. */
function speechLayout(x,y,s,footY=y+22,page=0,tail){
  const all=wrap(s.toUpperCase(),24);if(!all.length)return null;
  const pages=Math.ceil(all.length/2),lines=all.slice((page%pages)*2,(page%pages)*2+2);
  const w=Math.max(...all.map(l=>tw(l,1)))+8,h=Math.min(2,all.length)*9+4;
  tail=tail||(y-h-10>=4?'bottom':'top');
  return {x:Math.max(4,Math.min(316-w,Math.round(x-w/2))),
    y:Math.max(4,Math.min(220-h,Math.round(tail==='bottom'?y-h-10:footY+18))),w,h,lines,tail};}
function noticeLayout(b,page=0){
  if(!b)return null;const details=[b.b,b.c].filter(Boolean).flatMap(s=>wrap(s.toUpperCase(),48));
  const a=b.a.toUpperCase(),lines=[a];if(details.length)lines.push(details[page%details.length]);
  const w=Math.min(308,Math.max(tw(a,1),...details.map(s=>tw(s,1)))+12),h=lines.length>1?24:14,x=Math.round((320-w)/2);
  return {x,y:2,w,h,lines};}
function overlayOpacity(state,overlap){const target=overlap ? .22 : .86,dt=Math.max(0,Math.min(.1,S.clock-(state.clock??S.clock)));
  state.opacity=state.opacity==null?target:state.opacity+(target-state.opacity)*(1-Math.exp(-dt*12));state.clock=S.clock;return state.opacity;}
function drawGameplaySpeech(){const blocked=actionRects(),notice=noticeLayout(L.banner,Math.floor(S.clock/1.4));
  if(notice)blocked.push({x:notice.x-2,y:notice.y-2,w:notice.w+4,h:notice.h+4});
  if(!speechState||speechState.level!==L||!L.zs.includes(speechState.speaker)||speechState.speaker.sayT<=0||!speechState.speaker.say){
    const urgent=z=>z.throwT>0||z.grannyState==='turning'||z.st==='windup';
    const speakers=L.zs.filter(z=>z.sayT>0&&z.say)
      .sort((a,b)=>Number(urgent(b))-Number(urgent(a))||Math.hypot(a.x-L.p.x,a.y-L.p.y)-Math.hypot(b.x-L.p.x,b.y-L.p.y));
    speechState=speakers.length?{level:L,speaker:speakers[0]}:null;}
  if(!speechState)return;const z=speechState.speaker;
  if(speechState.text!==z.say||z.sayT>speechState.remaining+.05){
    speechState={level:L,speaker:z,text:z.say,startT:z.sayT};}
  const y=z.y-(z.bh||22),page=Math.floor(Math.max(0,speechState.startT-z.sayT)/1.4),r=speechLayout(z.x,y,z.say,z.y,page,speechState.tail);
  if(!r)return;speechState.tail=r.tail;speechState.remaining=z.sayT;
  const outer={x:r.x-4,y:r.y-4,w:r.w+8,h:r.h+8};r.opacity=overlayOpacity(speechState,blocked.some(b=>rectsOverlap(outer,b)));
  bubble(z.x,y,z.say,r);}
function bubble(x,y,s,layout){const lines=layout?layout.lines:wrap(s.toUpperCase(),18),w=layout?layout.w:Math.max(...lines.map(l=>tw(l,1)))+8,h=layout?layout.h:lines.length*9+4;
  let bx=layout?layout.x:Math.max(2,Math.min(318-w,Math.round(x-w/2))),by=layout?layout.y:Math.max(2,Math.round(y-h));
  const alpha=G.globalAlpha,opacity=layout?.opacity??1;G.save();G.globalAlpha=alpha*opacity;
  R(bx-1,by,w+2,h,'#24161e');R(bx,by-1,w,h+2,'#24161e');R(bx,by,w,h,'#f2e6d0');R(bx,by+h-2,w,1,'#c8b8a4');
  const px=Math.max(bx+3,Math.min(bx+w-5,Math.round(x))),py=Math.max(by+3,Math.min(by+h-4,Math.round(y+8))),tail=layout?layout.tail:'bottom';
  if(tail==='bottom'){R(px-1,by+h,4,2,'#24161e');R(px,by+h,2,1,'#f2e6d0');R(px,by+h+2,2,1,'#24161e');}
  else if(tail==='top'){R(px-1,by-3,4,2,'#24161e');R(px,by-2,2,1,'#f2e6d0');R(px,by-4,2,1,'#24161e');}
  else if(tail==='right'){R(bx+w,py-1,3,4,'#24161e');R(bx+w,py,2,2,'#f2e6d0');R(bx+w+3,py,1,2,'#24161e');}
  else{R(bx-3,py-1,3,4,'#24161e');R(bx-2,py,2,2,'#f2e6d0');R(bx-4,py,1,2,'#24161e');}
  G.globalAlpha=alpha*Math.min(1,opacity+.25);lines.forEach((l,i)=>txt(l,bx+4,by+3+i*9,'#24161e',1));G.restore();}
function panel(x,y,w,h){R(x-2,y-2,w+4,h+4,'#0e0a12');R(x,y,w,h,'#2a1f2c');R(x+1,y+1,w-2,1,'#7a6470');R(x+1,y+h-2,w-2,1,'#4a3a46');R(x+1,y+1,1,h-2,'#7a6470');R(x+w-2,y+1,1,h-2,'#4a3a46');}
function sunMoon(x,y,t){if(t<1){disc(x+3,y+3,3,'#e8e0b8');disc(x+5,y+2,2,'#1a121c');}else{disc(x+3,y+3,2,'#f8c840');R(x+3,y-1,1,1,'#f8c840');R(x+3,y+7,1,1,'#f8c840');R(x-1,y+3,1,1,'#f8c840');R(x+7,y+3,1,1,'#f8c840');}}
function drawHUD(){
  G=ctx;R(0,0,320,16,'#1a121c');R(0,15,320,1,'#4a3a46');
  const t=Math.min(1,L.time/L.d.night);sunMoon(4,3,t);
  const mins=Math.floor(t*360),hh=Math.floor(mins/60),mm=mins%60;txt((hh===0?12:hh)+':'+pad(mm,2)+'AM',14,3,t>=1?'#f8c840':'#f2e6d0');
  R(14,12,40,2,'#3a2a46');R(14,12,Math.round(40*t),2,t<1?mix('#7a5ad8','#f8a040',ss(.6,1,t)):'#f8c840');
  txt('L'+(S.level+1),62,4,'#9a8aa8');
  txt('SCORE',80,4,'#9a8aa8');txt(pad(S.score,7),112,4,'#f2e6d0');
  magIcon(168,3);txt('X'+L.p.mags,178,4,L.p.mags?'#f0a0c8':'#5a4a5a');
  if(L.p.mic){micIcon(196,3);if(Math.floor(S.clock*3)%2)txt('R',206,4,'#d8dc5a');}
  if(S.cp>=0){flagIcon(224,3);txt(String(S.cp+1),234,4,'#f8c840');}
  zhead(264,3);txt(S.zombies+'/'+MAXZ,274,4,S.zombies>=4?'#e04a3a':'#9dbb6c');
}
function drawBanner(){const r=noticeLayout(L.banner,Math.floor(S.clock/1.4));if(!r){noticeState=null;return;}
  if(!noticeState||noticeState.level!==L||noticeState.banner!==L.banner)noticeState={level:L,banner:L.banner};
  const outer={x:r.x-2,y:r.y-2,w:r.w+4,h:r.h+4},opacity=overlayOpacity(noticeState,actionRects().some(b=>rectsOverlap(outer,b))),alpha=G.globalAlpha;
  const y=r.y+OY;G.save();G.globalAlpha=alpha*opacity;panel(r.x,y,r.w,r.h);G.globalAlpha=alpha*Math.min(1,opacity+.25);
  txt(r.lines[0],160,y+3,'#f8c840',1,'c','#140a14');if(r.lines[1])txt(r.lines[1],160,y+14,'#f2e6d0',1,'c');G.restore();}
function drawRap(){
  const r=L.rap;
  const y=document.body.hasAttribute('data-kb-overlay')?desktopRapY:150;
  panel(8,y,304,82);if(r.miss>0){R(8,y,304,1,'#e04a3a');R(8,y+81,304,1,'#e04a3a');R(8,y,1,82,'#e04a3a');R(311,y,1,82,'#e04a3a');}
  const beat=Math.floor(S.clock*96/60)%4;
  txt('^ RAP BATTLE ^',16,y+6,'#d8dc5a',1);txt('LINES '+r.done,304,y+6,'#9dbb6c',1,'r');
  for(let i=0;i<4;i++)R(120+i*8,y+7,5,5,i===beat?'#f0a0c8':'#4a3a46');
  if(r.cool>0&&r.done===0){txt('GET READY... TYPE THE LINE!',160,y+30,'#f2e6d0',1,'c');}
  const line=r.line.toUpperCase();const x0=Math.round(160-tw(line,1)/2),ly=y+30;
  if(!(r.cool>0&&r.done===0)){for(let i=0;i<line.length;i++){const ch=line[i],x=x0+i*6;
    if(i<r.idx){if(ch===' ')R(x+2,ly+3,1,1,'#3a8a3a');else glyphs(G,ch,x,ly,'#5cdc5c',1);}
    else{if(ch===' ')R(x+2,ly+3,1,1,i===r.idx?'#f8c840':'#6a5a6a');else glyphs(G,ch,x,ly,i===r.idx?'#f8c840':'#f2e6d0',1);}
    if(i===r.idx&&Math.floor(S.clock*6)%2)R(x-1,ly+9,7,1,'#f8c840');}}
  if(r.fresh>0)txt(['FRESH!','DOPE!','SLICK!'][r.done%3],160,y+46,'#5cdc5c',2,'c','#140a14');
  else txt(KT('TYPE IT EXACTLY. ESC TO DROP THE MIC.','TYPE IT EXACTLY. DROP MIC TO QUIT.'),160,y+50,'#9a8aa8',1,'c');
  const fr=Math.max(0,r.t/r.tmax);R(16,y+66,288,7,'#140a14');R(17,y+67,Math.round(286*fr),5,fr>.5?'#5cdc5c':fr>.25?'#f8c840':'#e04a3a');
  R(17,y+67,Math.round(286*fr),1,'rgba(255,255,255,.35)');
}

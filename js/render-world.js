"use strict";
/* Draws the play screen: world layers, entities, lighting, HUD, banners and the rap panel. */
const [lc,lx]=mk(320,224);
function dawnAmt(){return ss(.72,1,L.time/L.d.night);}
function drawWorld(shake){
  const g=L.g,dawn=dawnAmt();
  ctx.save();ctx.translate(shake?Math.round((Math.random()-.5)*3):0,OY);G=ctx;
  ctx.drawImage(g.bgN,0,0);if(g.bgD&&dawn>0){ctx.globalAlpha=dawn;ctx.drawImage(g.bgD,0,0);ctx.globalAlpha=1;}
  g.dyn(dawn,'under');
  // puddles
  for(const pd of L.puddles){if(pd.t<3&&Math.floor(pd.t*8)%2)continue;
    for(const b of pd.blobs)ell(pd.x+b[0],pd.y+b[1],b[2]+1,b[3]+1,'#4e5a16');
    for(const b of pd.blobs)ell(pd.x+b[0],pd.y+b[1],b[2],b[3],'#b4c03a');
    for(const b of pd.blobs)ell(pd.x+b[0]-1,pd.y+b[1]-1,Math.max(1,b[2]-3),Math.max(1,b[3]-2),'#cdd44e');
    for(const c of pd.chunks)R(pd.x+c[0],pd.y+c[1],2,1,'#8a6a2a');R(pd.x-3,pd.y-2,2,1,'#f0f4a0');}
  // items
  for(const it of L.items){const x=Math.round(it.x),y=Math.round(it.y),b=Math.round(Math.sin(it.t*4));
    if(it.type==='stash'){ell(x,y,7,2,'rgba(10,6,20,.35)');R(x-6,y-9+b,12,9,'#24161e');R(x-5,y-8+b,10,6,'#e05a8a');R(x-4,y-7+b,5,1,'#fff');R(x-2,y-5+b,4,2,'#f0d040');R(x-5,y-2+b,10,1,'#3ac0d0');R(x-5,y-1+b,10,1,'#f0d040');
      if(Math.floor(it.t*3)%2){R(x+6,y-12+b,1,3,'#fff');R(x+5,y-11+b,3,1,'#fff');}}
    else if(it.type==='mic'){ell(x,y,5,2,'rgba(10,6,20,.35)');R(x-2,y-6+b,4,7,'#24161e');R(x-1,y-5+b,2,5,'#3a3a48');disc(x,y-9+b,3,'#24161e');disc(x,y-9+b,2,'#c8c8d8');R(x-1,y-10+b,1,1,'#fff');R(x,y-8+b,1,1,'#7a7a8a');
      if(Math.floor(it.t*4)%2){R(x+5,y-14+b,1,3,'#d8dc5a');R(x+4,y-13+b,3,1,'#d8dc5a');R(x-6,y-6+b,1,1,'#d8dc5a');}}
    else{if(it.life<3&&Math.floor(it.life*8)%2)continue;R(x-6,y-5,12,6,'#24161e');R(x-5,y-4,5,4,'#f2e6d0');R(x,y-4,5,4,'#e8dcc8');R(x-4,y-3,2,2,it.k===1?'#e05a8a':'#3ac0d0');R(x+1,y-3,3,1,'#8a7a8a');R(x+1,y-1,2,1,'#8a7a8a');}}
  // entities
  const beat=Math.floor(S.clock*96/60*2)%2;
  const ents=[{p:1,y:L.p.y}].concat(L.zs.map(z=>({z,y:z.y}))).sort((a,b)=>a.y-b.y);
  for(const e of ents){
    if(e.p){const p=L.p;const pal=p.zombie?PZ:PP;let dx=0;if(p.slip>0)dx=Math.floor(S.clock*20)%2?1:-1;if(S.mode==='caught'&&!p.zombie)dx=Math.round((Math.random()-.5)*2);
      const bob=(S.mode==='rap'&&!p.zombie)?beat:0;drawHuman(ctx,p.x,p.y,S.mode==='rap'?0:p.dir,Math.floor(p.anim),pal,{dx,hb:bob,mic:S.mode==='rap',puke:S.mode==='caught'});}
    else{const z=e.z;const vib=(S.mode==='rap'&&L.rap&&L.rap.cool<=0)||L.vibe>0;drawHuman(ctx,z.x,z.y,vib||z.read>0?0:z.dir,vib||z.read>0?0:Math.floor(z.anim),PZ,{hb:vib?beat:0,read:z.read>0?z.readK:0,puke:z.puke>0});}}
  // projectiles
  for(const pr of L.projs){const x=Math.round(pr.x),y=Math.round(pr.y);ell(x,y,3,1,'rgba(10,6,20,.35)');const sp=Math.floor(pr.spin)%2;
    if(sp){R(x-5,y-12,10,6,'#24161e');R(x-4,y-11,8,4,pr.k===1?'#e05a8a':'#3ac0d0');R(x-3,y-10,3,1,'#fff');}else{R(x-2,y-14,4,9,'#24161e');R(x-1,y-13,2,7,pr.k===1?'#e05a8a':'#3ac0d0');}}
  // particles
  for(const p of L.parts){if(p.note){txt('^',p.x,p.y-p.z,p.col,1,'c');}else R(p.x,p.y-p.z,2,2,p.col);}
  // foreground
  ctx.drawImage(g.fgN,0,0);if(g.fgD&&dawn>0){ctx.globalAlpha=dawn;ctx.drawImage(g.fgD,0,0);ctx.globalAlpha=1;}
  g.dyn(dawn,'over');
  // lighting
  const t=L.time/L.d.night,dark=g.dark*(1-ss(.5,1,t));
  if(dark>.01){lx.globalCompositeOperation='source-over';lx.clearRect(0,0,320,224);lx.fillStyle='rgba(12,8,34,'+dark.toFixed(3)+')';lx.fillRect(0,0,320,224);
    lx.globalCompositeOperation='destination-out';const fl=Math.sin(S.clock*13)*3+Math.sin(S.clock*7)*2;
    const lights=[[L.p.x,L.p.y-8,44]];if(g.lights==='l1')lights.push([264,56,74+fl],[160,36,34]);else lights.push([136,190,40+fl],[184,190,40-fl],[132,76,30],[188,76,30],[160,86,24]);
    for(const [x,y,r] of lights){const gr=lx.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.55,'rgba(0,0,0,.7)');gr.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=gr;lx.fillRect(x-r,y-r,2*r,2*r);}
    ctx.drawImage(lc,0,0);
    ctx.globalCompositeOperation='lighter';const warm=g.lights==='l1'?[[264,56,50]]:[[136,190,26],[184,190,26]];
    for(const [x,y,r] of warm){const gr=ctx.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(240,138,48,'+(.16*dark/g.dark).toFixed(3)+')');gr.addColorStop(1,'rgba(240,138,48,0)');ctx.fillStyle=gr;ctx.fillRect(x-r,y-r,2*r,2*r);}
    ctx.globalCompositeOperation='source-over';}
  // speech bubbles
  for(const z of L.zs)if(z.sayT>0&&z.say)bubble(z.x,z.y-22,z.say);
  // floaters
  for(const f of L.floats)txt(f.text,Math.max(tw(f.text,1)/2+2,Math.min(318-tw(f.text,1)/2,f.x)),f.y,f.col,1,'c','#140a14');
  ctx.restore();
}
function bubble(x,y,s){const lines=wrap(s.toUpperCase(),18);const w=Math.max(...lines.map(l=>tw(l,1)))+8,h=lines.length*9+4;
  let bx=Math.round(x-w/2);bx=Math.max(2,Math.min(318-w,bx));let by=Math.round(y-h);if(by<2)by=2;
  R(bx-1,by,w+2,h,'#24161e');R(bx,by-1,w,h+2,'#24161e');R(bx,by,w,h,'#f2e6d0');R(bx,by+h-2,w,1,'#c8b8a4');
  const px=Math.max(bx+3,Math.min(bx+w-5,Math.round(x)));R(px-1,by+h,4,2,'#24161e');R(px,by+h,2,1,'#f2e6d0');R(px,by+h+2,2,1,'#24161e');
  lines.forEach((l,i)=>txt(l,bx+4,by+3+i*9,'#24161e',1));}
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
  zhead(264,3);txt(S.zombies+'/'+MAXZ,274,4,S.zombies>=4?'#e04a3a':'#9dbb6c');
}
function drawBanner(){if(!L.banner)return;const b=L.banner;const w=Math.max(tw(b.a,2),tw(b.b,1),tw(b.c||'',1))+20;const h=b.c?42:32;const x=160-w/2,y=88;
  panel(x,y,w,h);txt(b.a,160,y+6,'#f8c840',2,'c','#140a14');txt(b.b,160,y+22,'#f2e6d0',1,'c');if(b.c)txt(b.c,160,y+31,'#9a8aa8',1,'c');}
function drawRap(){
  const r=L.rap;const y=150;panel(8,y,304,82);if(r.miss>0){R(8,y,304,1,'#e04a3a');R(8,y+81,304,1,'#e04a3a');R(8,y,1,82,'#e04a3a');R(311,y,1,82,'#e04a3a');}
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
  else txt('TYPE IT EXACTLY. ESC TO DROP THE MIC.',160,y+50,'#9a8aa8',1,'c');
  const fr=Math.max(0,r.t/r.tmax);R(16,y+66,288,7,'#140a14');R(17,y+67,Math.round(286*fr),5,fr>.5?'#5cdc5c':fr>.25?'#f8c840':'#e04a3a');
  R(17,y+67,Math.round(286*fr),1,'rgba(255,255,255,.35)');
}

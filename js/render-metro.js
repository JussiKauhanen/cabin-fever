"use strict";
/* The last metro: an orange cab, three scrolling tracks, and a clear view of what is ahead. */
function metroDrawRails(distance,top,bottom){
  const off=distance%14;
  for(const x of METRO_TRACKS){
    R(x-29,top,58,bottom-top,'#15171d');R(x-27,top,2,bottom-top,'#252934');R(x+25,top,2,bottom-top,'#252934');
    for(let y=top-14+off;y<bottom;y+=14){R(x-23,y,46,4,'#302b30');R(x-22,y,44,1,'#52444a');
      for(const xx of [x-18,x+15]){R(xx,y,3,2,'#7e7d7d');R(xx+1,y+2,1,1,'#17131c');}
      R(x-7,y+7,2,1,'#292d36');R(x+10,y+10,3,1,'#2a2c35');}
    for(const xx of [x-16,x+14]){R(xx-1,top,4,bottom-top,'#090e16');R(xx,top,2,bottom-top,'#737e89');R(xx,top,1,bottom-top,'#b5b5b5');}
    R(x+25,top,2,bottom-top,'#5d5434');R(x+26,top,1,bottom-top,'#b6a46a');}
  // Repeating crossovers make the three running lines read as a rail network.
  const rail=(x0,y0,x1,y1)=>{for(let i=0;i<=40;i++){const t=i/40,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t;
    R(x-1,y-1,3,3,'#0b1019');R(x,y,1,2,'#84909a');}};
  for(let y=top-220+distance%220;y<bottom;y+=220){rail(64,y,144,y+44);rail(94,y,174,y+44);
    rail(144,y+110,224,y+154);rail(174,y+110,254,y+154);}
}
function metroDrawTunnel(m){
  R(0,36,320,204,'#20222d');R(29,36,262,204,'#252632');
  const wall=m.distance%36;
  for(let y=wall; y<260; y+=36){
    for(const x of [0,293]){R(x,y,27,34,'#27212d');R(x+2,y+2,23,29,'#3a303e');R(x+3,y+3,21,1,'#50424f');
      R(x+3,y+17,21,1,'#211d29');R(x+13,y+4,1,12,'#292331');R(x+7,y+19,1,11,'#292331');}
  }
  for(const x of [26,291]){R(x,36,3,204,'#0a1018');R(x+1,36,1,204,'#66545d');}
  for(let y=-64+m.distance%80;y<260;y+=80){
    for(const x of [9,307]){R(x-3,y+8,7,18,'#11131d');R(x-2,y+9,5,14,'#bbc6be');R(x-1,y+10,3,12,'#f2e6d0');R(x-3,y+25,7,2,'#514649');}
    R(33,y+46,3,8,'#6e665c');R(285,y+46,3,8,'#6e665c');}
  metroDrawRails(m.distance,36,240);
  if(m.speed>70)for(let i=0;i<8;i++){const y=38+((m.distance*1.3+i*29)%202),x=i%2?286:32;
    R(x,y,1,7,'#66717c');}
  // The depot appears in the tunnel itself as the route approaches its end.
  const endY=METRO_TRAIN_Y-(CFG.metroLength-m.distance);
  if(endY>-60&&endY<260){
    for(const x of [29,272]){R(x,endY-40,19,77,'#454950');R(x,endY-40,19,3,'#a6b3ad');
      for(let y=endY-34;y<endY+37;y+=8){R(x+2,y,15,1,'#62686c');R(x+2,y+2,3,2,'#d2ba57');}}
    R(37,endY-45,246,15,'#0c1b21');R(38,endY-44,244,1,'#659d81');
    txt('VARIKKO - DEPOT',160,endY-41,'#b8d9b0',1,'c');
    for(const x of METRO_TRACKS){R(x-27,endY,54,2,'#9dbb6c');R(x-27,endY+3,54,1,'#385b49');}}
}
function metroDrawDebris(x,y,variant){
  ell(x,y+3,20,4,'rgba(5,8,16,.7)');
  if(variant==='rubble'){
    for(const [dx,dy,w,h] of [[-15,-2,13,9],[-3,-10,15,16],[9,-3,10,9]]){R(x+dx-1,y+dy-1,w+2,h+2,'#11131b');
      R(x+dx,y+dy,w,h,'#64636e');R(x+dx+1,y+dy+1,w-3,2,'#999198');R(x+dx+w-3,y+dy+3,3,h-3,'#44434f');}
    R(x-20,y-14,5,12,'#21171c');R(x-19,y-13,3,10,'#e88830');R(x-19,y-10,3,2,'#f2e6d0');
  }else{
    for(const [dx,dy,w,h] of [[-16,-10,16,14],[0,-15,17,19]]){R(x+dx-1,y+dy-1,w+2,h+2,'#17131b');R(x+dx,y+dy,w,h,'#8e603c');
      R(x+dx+1,y+dy+1,w-2,2,'#c39559');R(x+dx+2,y+dy+4,w-4,h-6,'#654833');
      for(let i=2;i<w-2;i+=3)R(x+dx+i,y+dy+Math.round(i*(h-3)/w),2,2,'#b5844a');}
  }
  for(const dx of [-20,17]){R(x+dx,y-5,3,9,'#201720');R(x+dx+1,y-5,1,8,'#dd6955');}
  R(x-20,y-8,40,5,'#241820');R(x-19,y-7,38,3,'#e04a3a');
  for(let dx=-16;dx<18;dx+=8)R(x+dx,y-7,4,3,'#f2e6d0');
}
function metroDrawSignal(x,y,safe){const col=safe?'#8fce79':'#f8c840';
  ell(x,y+2,23,3,'rgba(5,8,16,.65)');
  for(const dx of [-23,20]){R(x+dx,y-23,4,27,'#10141e');R(x+dx+1,y-21,2,23,'#7e7885');
    R(x+dx-2,y-28,8,12,'#10141e');R(x+dx-1,y-27,6,10,'#38313d');
    R(x+dx,y-25,4,4,col);R(x+dx+1,y-24,2,2,safe?'#d8f2bb':'#fff3ac');}
  for(let dx=-18;dx<18;dx+=8){R(x+dx,y,5,2,col);R(x+dx+2,y+2,5,2,col);}
  txtO(safe?'OK':'SLOW',x,y-18,col,1,'c','#10101a');
}
function metroDrawTrain(x,y,braking,hit){
  const px=Math.round(x),top=Math.round(y)-11,orange=hit?'#fff0d0':'#e6672d',light=hit?'#fff6e0':'#ff9a49';
  ell(px,top+47,22,7,'rgba(4,7,14,.75)');
  // Wheels and coupler sit below the bright orange Helsinki-style body.
  R(px-17,top+9,34,42,'#0a1018');R(px-19,top+14,4,8,'#3f4851');R(px+15,top+14,4,8,'#3f4851');
  R(px-19,top+38,4,8,'#3f4851');R(px+15,top+38,4,8,'#3f4851');R(px-4,top+55,8,4,'#0b1018');R(px-2,top+57,4,3,'#606773');
  R(px-16,top+3,32,53,'#15131b');R(px-13,top,26,4,'#15131b');R(px-14,top+3,28,51,orange);
  R(px-12,top+1,24,3,light);R(px-13,top+5,26,3,light);R(px-14,top+8,3,42,'#ad3e27');R(px+12,top+8,2,42,'#ff9a49');
  // Front windshield, destination sign, and paired headlights identify the cab.
  R(px-11,top+9,22,10,'#101a24');R(px-10,top+10,20,7,'#3e6677');R(px-9,top+10,8,2,'#89b9b8');R(px+1,top+10,8,2,'#89b9b8');R(px-1,top+10,2,8,'#142630');
  R(px-7,top+3,14,4,'#22212b');R(px-4,top+4,8,1,'#f8c840');
  for(const dx of [-11,8]){R(px+dx,top+20,4,3,'#261b20');R(px+dx+1,top+20,2,2,'#fff3bb');}
  R(px-10,top+25,20,23,'#bb442a');R(px-8,top+26,16,21,'#ef8240');R(px-7,top+27,14,2,'#ffab5d');
  for(let yy=top+31;yy<top+45;yy+=4){R(px-5,yy,10,1,'#b25031');R(px-4,yy+1,8,1,'#ff9a49');}
  for(const dx of [-13,10]){R(px+dx,top+28,3,7,'#14212a');R(px+dx,top+39,3,7,'#14212a');}
  R(px-10,top+49,20,3,'#89322a');
  for(const dx of [-11,8])R(px+dx,top+51,3,2,braking?'#ffdf7a':'#8d2630');
  if(braking){R(px-20,top+40,2,3,'#f8c840');R(px+18,top+43,2,3,'#f8c840');}
}
function metroDrawHUD(m){
  R(0,0,320,36,'#151019');R(0,14,320,1,'#4a3a46');R(0,35,320,1,'#6e5360');
  txt('L'+(S.level+1)+' METRO',6,4,'#e88830');txt('SCORE '+pad(S.score,7),72,4,'#f2e6d0');txt('HP',248,4,'#9a8aa8');
  for(let i=0;i<CFG.metroHealth;i++){const x=269+i*14;R(x,3,9,8,'#3b2e3d');if(i<m.hp){R(x+1,4,7,5,'#e88830');R(x+2,4,5,1,'#ffbc6e');}}
  txt('TIME '+pad(Math.max(0,Math.ceil(m.timeLeft)),2),6,19,m.timeLeft<15?'#f07050':'#f2e6d0');
  txt('SPD '+pad(Math.round(m.speed),3),87,19,m.braking?'#9dbb6c':'#9a8aa8');txt('HITS '+pad(m.hits,2),169,19,'#9dbb6c');
  txt('X'+Math.max(1,m.combo),312,19,m.combo>1?'#f8c840':'#6e5e78',1,'r');
  R(6,30,308,3,'#352837');R(6,30,Math.round(308*Math.max(0,Math.min(1,m.distance/CFG.metroLength))),3,'#f8c840');
  for(let i=1;i<4;i++)R(6+i*77,30,1,3,'#151019');R(312,28,2,7,'#9dbb6c');
}
function drawMetro(){const m=L&&L.metro;if(!m)return;G=ctx;ctx.save();
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';R(0,0,320,240,'#10131c');ctx.beginPath();ctx.rect(0,36,320,204);ctx.clip();
  metroDrawTunnel(m);
  for(const o of m.objects){if(o.done)continue;const y=METRO_TRAIN_Y-(o.distance-m.distance);if(y<12||y>264)continue;
    const x=METRO_TRACKS[o.lane];
    if(o.kind==='zombie'){drawHuman(ctx,x,y,0,Math.floor(S.clock*5+(o.id||0)),PZ,{});}
    else if(o.kind==='signal')metroDrawSignal(x,y,m.speed<=60);
    else metroDrawDebris(x,y,o.variant);}
  metroDrawTrain(m.x,METRO_TRAIN_Y,!!m.braking,m.hitT>0&&Math.floor(m.hitT*8)%2);
  for(const p of m.particles){ctx.globalAlpha=Math.max(0,Math.min(1,p.t/(p.life||1)));R(p.x,p.y,2,2,p.col);}ctx.globalAlpha=1;
  ctx.restore();G=ctx;metroDrawHUD(m);
  if(m.feedbackT>0&&m.feedback)txtO(m.feedback,160,42,m.feedbackColor||'#d8dc5a',1,'c','#10101a');
  if(m.braking)txtO('BRAKING',m.x,232,'#f8c840',1,'c','#10101a');
}
function drawMetroIntro(){G=ctx;ctx.save();R(0,0,320,240,'#0e0a12');
  txtO('LEVEL '+(S.level+1),160,19,'#f8c840',3,'c','#140a14',1);
  txt('THE LAST METRO',160,51,'#f2e6d0',2,'c');txt('KONTULA TO THE DEPOT. YOU ARE THE DRIVER.',160,76,'#9a8aa8',1,'c');
  ctx.save();ctx.beginPath();ctx.rect(24,89,272,78);ctx.clip();metroDrawRails(0,89,167);
  drawHuman(ctx,80,137,0,0,PZ,{});metroDrawTrain(160,110,false,false);metroDrawDebris(240,139,'crate');ctx.restore();
  txt('HIT',80,94,'#9dbb6c',1,'c','#10101a');txt('DODGE',240,94,'#f07050',1,'c','#10101a');
  txt(KT('LEFT / RIGHT OR A / D SWITCH TRACKS','DRAG STICK LEFT / RIGHT TO SWITCH'),160,174,'#f2e6d0',1,'c');
  txt(KT('HOLD SPACE OR DOWN: BRAKE FOR AMBER','HOLD BRAKE TO PASS AMBER SIGNALS'),160,185,'#f8c840',1,'c');
  txt('HIT ZOMBIES. DODGE DEBRIS.',160,196,'#9dbb6c',1,'c');
  txt('REACH THE DEPOT BEFORE TIME RUNS OUT.',160,207,'#9a8aa8',1,'c');
  if(Math.floor(S.clock*2)%2)txt(KT('PRESS ENTER TO DRIVE','TAP GO TO DRIVE'),160,226,'#f8c840',1,'c');ctx.restore();G=ctx;
}

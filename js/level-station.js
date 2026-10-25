"use strict";
/* Level 5: Kontula metro station, down on the platform. Two side platforms with two tracks between them (= is track bed,
   walkable until a train comes). Tiled wall with the station sign and ads, pillars, benches and a coffee machine.
   Trains and the stopped first train are drawn in dynL5 from L.station (station.js). */
const L5MAP=["####################","####################","#v.................#","#...P...bb.....P...#","#..................#","#..................#",
  "#==================#","#==================#","#==================#","#==================#","#..................#","#...bb........bb...#","#..................#","#########SS#########"];
const N5={o:'#14121a',grout:'#2a1e22',tile:'#5e3e36',tileLt:'#6e4a40',tileDk:'#523530',stripe:'#d8642a',stripeLt:'#f08a48',side:'#2a2026',
 floor:'#5a5a66',floorLt:'#64646f',floorDk:'#4e4e5a',seam:'#43434e',speck:'#787884',edge:'#8a8a94',edgeDk:'#6a6a74',yellow:'#e8c030',
 bed:'#1c1a20',bedLt:'#2a2730',bedDk:'#121016',sleeper:'#3a302c',sleeperLt:'#4a3e38',rail:'#9aa0aa',railLt:'#d0d4dc',railDk:'#0c0c10',thirdLt:'#a89440',tunnel:'#08070c',
 pil:'#8a8a92',pilLt:'#a4a4ac',pilDk:'#64646e',sign:'#1e4a8e',signLt:'#3a6ab0',
 wood:'#7a5636',woodLt:'#9a7048',metal:'#6a6e7a',concDk:'#3e3e48',vend:'#a8302e',vendLt:'#c84a3e'};
const L5LAMPS=[[48,52],[128,52],[200,52],[280,52],[48,188],[128,188],[200,188],[280,188]];
function lightsL5(fl){const st=L&&L.station,out=L5LAMPS.map(([x,y],i)=>[x,y,i===5&&Math.floor(S.clock*6)%7<2?8:36+fl*.3]);out.push([24,30,22]);
  if(!st)return out;
  for(const tr of stationTrains()){const cy=ST_TRACKS[tr.k]+16;
    if(tr.warn>0){if(Math.floor(S.clock*4)%2)for(const x of [56,160,264])out.push([x,tr.k?162:92,18]);continue;}
    out.push([tr.dir>0?tr.x+TRAIN_LEN+20:tr.x-20,cy,60],[tr.x+75,cy,46],[tr.x+229,cy,46]);}
  return out;}
function warmL5(){const f=L&&L.station&&L.station.final,out=[[24,28,26]];
  if(f&&f.open)for(const off of TRAIN_DOORS)out.push([f.x+off,ST_TRACKS[f.k]+20,22]);return out;}
function pillar(c,r,P){const x=c*16+1,by=r*16+15;
  R(x-1,0,16,by+1,P.o);R(x,0,14,by,P.pil);R(x,0,3,by,P.pilLt);R(x+11,0,3,by,P.pilDk);
  R(x,26,14,4,P.stripe);R(x,26,14,1,P.stripeLt);
  R(x+2,35,10,10,P.o);R(x+3,36,8,8,P.stripe);glyphs(G,'M',x+4,36,'#ffffff',1);   // metro logo plate
  R(x-1,by-3,16,4,P.o);R(x,by-2,14,2,P.pilDk);}
function coffee(P){ // vending machine on col 1, row 2; the window glows in dynL5
  R(16,11,16,37,P.o);R(17,12,14,35,P.vend);R(17,12,14,1,P.vendLt);R(19,15,10,14,'#1a1420');
  ['#e05a5a','#5ad8f8','#f8c840'].forEach((col,i)=>{R(20+i*3,17,2,4,col);R(20+i*3,23,2,4,col);});R(20,22,8,1,'#5a4a5a');
  R(19,32,10,3,P.o);R(20,33,4,1,'#f8c840');R(24,38,6,6,P.o);R(25,39,4,4,'#3a2a30');}
function poster(x,w,a,b,bg,fg){R(x-1,3,w+2,21,N5.o);R(x,4,w,19,bg);R(x,4,w,1,mix(bg,'#ffffff',.3));txt(a,x+w/2,6,fg,1,'c');txt(b,x+w/2,14,fg,1,'c');}
function L5objs(P){return [{r:2,d:()=>coffee(P)},{r:3,d:()=>pillar(4,3,P)},{r:3,d:()=>pillar(15,3,P)}];}
function paintL5(P){
  const [b,bx]=mk(320,224),[f,fx]=mk(320,224);G=bx;const rnd=rng(505);
  // back wall: brown tiles, the orange metro stripe, station sign and two ads (the clock is animated)
  R(0,0,320,32,P.grout);
  for(let y=0;y<26;y+=6)for(let x=(y/6)%2*5-5;x<320;x+=10){const v=rnd();R(x+1,y+1,9,5,v<.12?P.tileDk:v<.3?P.tileLt:P.tile);}
  R(0,26,320,4,P.stripe);R(0,26,320,1,P.stripeLt);R(0,30,320,2,P.o);
  // the walls between the pillars: station sign with the clock (cols 5-14), an ad and the line map at the ends
  R(85,2,150,22,P.o);R(86,3,148,20,P.sign);R(86,3,148,1,P.signLt);
  R(89,6,10,10,P.o);R(90,7,8,8,P.stripe);glyphs(G,'M',91,7,'#ffffff',1);
  txt('KONTULA',145,5,'#f2f2f2',1,'c');txt('GÅRDSBACKA',145,14,'#b8c8e0',1,'c');
  poster(259,44,'ART &','DANCE','#e05a8a','#fff6e0');
  R(34,3,28,21,P.o);R(35,4,26,19,'#e8e4dc');R(37,13,22,2,P.stripe);for(const x of [38,45,52,58])R(x-1,12,3,4,P.o),R(x,13,1,2,'#ffffff');
  txt('M',48,5,P.stripe,1,'c');R(51,11,3,6,'#e04a3a');                                   // line map: you are here
  // side walls next to the platforms, tunnel mouths next to the tracks
  for(const [x,y,h] of [[0,32,64],[304,32,64],[0,160,48],[304,160,48]]){R(x,y,16,h,P.side);for(let yy=y+4;yy<y+h;yy+=8)R(x+3,yy,10,1,P.grout);R(x?x:15,y,1,h,P.o);}
  // platforms: granite tiles, a concrete lip and the yellow safety line
  for(const [y0,y1] of [[32,96],[160,208]])for(let y=y0;y<y1;y+=16)for(let x=16;x<304;x+=16){const v=rnd();R(x,y,16,16,P.seam);R(x,y,15,15,v<.4?P.floor:v<.8?P.floorLt:P.floorDk);}
  for(let i=0;i<70;i++)R(18+rnd()*284|0,rnd()<.55?34+rnd()*48|0:172+rnd()*34|0,1,1,P.speck);
  R(16,88,288,8,P.edge);R(16,88,288,1,P.speck);R(16,95,288,1,P.edgeDk);R(16,84,288,2,P.yellow);
  R(16,160,288,6,P.edge);R(16,165,288,1,P.edgeDk);R(16,168,288,2,P.yellow);
  for(let x=18;x<304;x+=4){R(x,81,1,1,P.edgeDk);R(x+2,171,1,1,P.edgeDk);}
  // two tracks: gravel, sleepers, running rails and the covered third rail
  for(const top of ST_TRACKS){R(0,top,320,32,P.bed);
    for(let i=0;i<160;i++)R(rnd()*320|0,top+rnd()*32|0,1,1,rnd()<.5?P.bedLt:P.bedDk);
    for(let x=-2;x<320;x+=10){R(x,top+5,6,22,P.sleeper);R(x,top+5,6,1,P.sleeperLt);}
    for(const y of [top+9,top+21]){R(0,y-1,320,1,P.railDk);R(0,y,320,2,P.rail);R(0,y,320,1,P.railLt);R(0,y+2,320,1,P.railDk);}
    R(0,top+27,320,3,P.o);R(0,top+28,320,1,P.thirdLt);}
  R(0,96,320,3,P.bedDk);R(0,127,320,2,P.bedDk);
  for(const x of [0,304]){R(x,96,16,64,P.tunnel);R(x?x:15,96,1,64,P.o);}
  // the near wall and the stairs you came down (the gate shut behind you)
  R(0,208,320,16,P.grout);R(0,208,320,2,P.edgeDk);
  for(let x=0;x<320;x+=10)R(x+1,211,9,5,rnd()<.2?P.tileDk:P.tile);R(0,217,320,3,P.stripe);R(0,217,320,1,P.stripeLt);
  R(143,208,34,16,P.o);for(let i=0;i<5;i++)R(144,209+i*3,32,2,mix(P.edge,'#000000',i/6));
  for(let x=145;x<176;x+=4)R(x,208,1,16,P.metal);R(146,211,28,9,P.o);R(147,212,26,7,'#2a8a4a');txt('EXIT',160,212,'#e8ffe8',1,'c');
  bench(8,3,P);bench(4,11,P);bench(14,11,P); // the wooden bench from level-kontula.js
  const objs=L5objs(P);objs.forEach(o=>o.d());
  G=fx;objs.forEach(o=>{fx.save();fx.beginPath();fx.rect(0,0,320,o.r*16+4);fx.clip();o.d();fx.restore();});
  G=ctx;return {bg:b,fg:f};
}
/* One train = two orange cars seen from above: grey roof, lit windows and doors along the near side. */
function drawTrain(tr){const top=ST_TRACKS[tr.k],o=N5.o;
  for(let c=0;c<2;c++){const cx=Math.round(tr.x)+c*154;
    R(cx+2,top+29,148,3,'rgba(0,0,0,.35)');R(cx,top+2,150,28,o);
    R(cx+1,top+3,148,10,'#bfc2c8');R(cx+1,top+3,148,1,'#e4e6ea');R(cx+1,top+8,148,1,'#a8acb4');
    for(const ax of [18,106]){R(cx+ax,top+4,26,7,o);R(cx+ax+1,top+5,24,5,'#9a9ea8');}
    R(cx+1,top+13,148,16,'#e2642a');R(cx+1,top+13,148,1,'#ff9a52');R(cx+1,top+27,148,2,'#9a3e1a');
    for(let wx=cx+8;wx<cx+138;wx+=16){if(Math.abs(wx+6-cx-40)<14||Math.abs(wx+6-cx-110)<14)continue;
      R(wx,top+15,12,7,o);R(wx+1,top+16,10,5,'#f0d888');R(wx+1,top+16,10,1,'#fff4c8');}
    for(const off of [40,110]){const dx=cx+off;
      if(tr.open){R(dx-8,top+14,16,15,o);R(dx-7,top+15,14,13,'#f8e0a0');R(dx-7,top+26,14,2,'#a89060');R(dx-13,top+14,5,14,'#c8cad0');R(dx+8,top+14,5,14,'#c8cad0');}
      else{R(dx-7,top+14,14,15,o);R(dx-6,top+15,12,13,'#c8cad0');R(dx,top+15,1,13,o);R(dx-5,top+16,4,5,'#3a4a5a');R(dx+2,top+16,4,5,'#3a4a5a');}}
    const end=c?cx+150:cx-4,lead=(tr.dir>0)===(c===1);   // each car ends in a cab; lit headlight at the front, red at the back
    R(end,top+5,4,23,o);R(end+(c?0:1),top+6,3,21,'#e2642a');R(end+(c?0:1),top+14,3,7,'#1a2433');R(end+(c?1:0),top+24,2,2,lead?'#fff6c0':'#e03030');
    if(!c)R(cx+150,top+12,4,10,o);}}
function dynL5(d,layer){
  if(layer==='over')return;
  const t=Math.min(1,L.time/L.d.night),mins=Math.floor(t*360),hh=Math.floor(mins/60);
  R(195,6,36,13,N5.o);R(196,7,34,11,'#0a0a0e');txt((hh===0?12:hh)+':'+pad(mins%60,2),213,9,t>=1?'#9dbb6c':'#f86a3a',1,'c');
  if(Math.floor(S.clock*1.3)%5)R(19,15,10,1,'rgba(200,240,255,.5)');
  const st=L.station;if(!st)return;
  for(const tr of stationTrains()){
    if(tr.warn>0){const on=Math.floor(S.clock*4)%2,ey=tr.k?161:92;
      for(let x=24;x<304;x+=32)R(x,ey,6,2,on?'#f8c840':'#5a4a28');
      if(on)txtO(tr.dir>0?'TRAIN >>>':'<<< TRAIN',160,ST_TRACKS[tr.k]+12,'#f8c840',1,'c','#140a14');}
    else drawTrain(tr);}
}

"use strict";
/* Level 6: Espoo. The first metro took you west and you came up in Otaniemi: the university's red-brick campus with its
   stepped auditorium, the metro pavilion you walked out of, the Startup Sauna and its hot tub, the A! sculpture,
   a pond, flower beds, city bikes, e-scooters and birches.
   The way out is the zebra crossing at the bottom. Nobody in Espoo crosses on red, so it stays shut until the light
   turns green at 6:00 AM. Night + early morning palettes; windows, string lights, the night bus, the lights, the duck,
   a city rabbit and the moths around the lamps are animated. */
const L6MAP=["####################","####################","####################","#.MMMMe.......SSSSt#","#..................#","#......b...........#","#..........AA...RR.#",
  "#..==x.....AA......#","#..................#","#....~~~...........#","#....~~~.....b..==.#","#..................#","#..b...........p...#","#########DD#########"];
const N6={o:'#12121a',grass:'#1e3a30',grassDk:'#19322a',grassLt:'#25463a',tuft:'#2e5440',flower:'#a8a050',
 pave:'#34343f',paveLt:'#3c3c4a',paveDk:'#2c2c36',seam:'#22222c',paint:'#4c4c5e',
 brick:'#5a2e30',brickLt:'#6c3a3a',brickDk:'#44222a',copper:'#2e5a52',copperLt:'#3e7266',marble:'#7e7e90',marbleLt:'#9898aa',marbleDk:'#5c5c72',
 win:'#1a1a2c',winFr:'#2c2c3c',glass:'#24424e',glassLt:'#38606e',metro:'#c85a28',metroLt:'#e87a40',
 conc:'#4a4a5e',concLt:'#5c5c72',concDk:'#36364a',soil:'#2e2624',
 birch:'#a8b0c0',birchMk:'#262630',leaf:'#24483e',leafLt:'#32604e',leafDk:'#183630',
 wood:'#4e3c3e',woodLt:'#6a5254',metal:'#4a4e5e',metalLt:'#62687a',
 sauna:'#5c3c2c',saunaLt:'#76523c',saunaDk:'#3e2618',roof:'#2a2a34',roofLt:'#3c3c4a',sign:'#b8ac98',
 water:'#13284a',waterLt:'#1e3c66',shore:'#3a4648',reed:'#2e4a3a',shine:'#9ab0e0',duck:'#b8b4c0',lily:'#8a5a7a',
 road:'#20202a',roadLt:'#30303c',zebra:'#8a8a9a',curb:'#5a5a6a',hedge:'#1e3a32',hedgeLt:'#2a4c40',
 bike:'#a8902a',bikeDk:'#3a3a46',lampOff:'#5a5a6a',
 art1:'#b8a030',art2:'#b04a4a',fl1:'#8a4a6c',fl3:'#8a3838',scoot:'#2a6a5c',scoot2:'#7a4470',busSign:'#1e3a6e',rab:'#5e584e',tub:'#2a5a7a'};
const D6={o:'#1e1a1e',grass:'#5f9a48',grassDk:'#528a40',grassLt:'#70aa52',tuft:'#86c05a',flower:'#f8e060',
 pave:'#9a969a',paveLt:'#aaa6aa',paveDk:'#8a868a',seam:'#727072',paint:'#d0ccd0',
 brick:'#a8523e',brickLt:'#c0664e',brickDk:'#8a4232',copper:'#5aa08a',copperLt:'#7ac0a8',marble:'#e4e0d8',marbleLt:'#f6f2ea',marbleDk:'#b8b4ac',
 win:'#6a8aa8',winFr:'#e8e4dc',glass:'#8ac0d8',glassLt:'#b4dcee',metro:'#f07030',metroLt:'#ff9a5a',
 conc:'#c0b8ae',concLt:'#d6cec4',concDk:'#9a928a',soil:'#6a4a34',
 birch:'#f2f0e6',birchMk:'#2a2a2a',leaf:'#5aa03e',leafLt:'#86c452',leafDk:'#3e7a32',
 wood:'#9a6a42',woodLt:'#bc8a5a',metal:'#7a8090',metalLt:'#a0a8b8',
 sauna:'#a86a40',saunaLt:'#c88a58',saunaDk:'#7a4a2a',roof:'#5a5a64',roofLt:'#74747e',sign:'#f2e6d0',
 water:'#3a78a8',waterLt:'#5a9ac8',shore:'#9a9070',reed:'#6a8a3a',shine:'#e8f4ff',duck:'#f6f2ea',lily:'#f8b0d0',
 road:'#5a5a62',roadLt:'#6e6e76',zebra:'#f2f2f2',curb:'#b8b4ac',hedge:'#3a7a3a',hedgeLt:'#5a9a48',
 bike:'#f0c020',bikeDk:'#3a3a46',lampOff:'#c8c8d0',
 art1:'#f8d030',art2:'#e04a3a',fl1:'#f070a8',fl3:'#e8483a',scoot:'#30c0a0',scoot2:'#e860b0',busSign:'#2a6ac8',rab:'#b09070',tub:'#5ab0d8'};
const L6LAMPS=[[24,100,1],[296,100,-1],[24,196,1],[296,196,-1]];
const L6POND=[86,150]; // top-left corner of the pond's open water (cols 5-7, rows 9-10)
function lightsL6(fl){return [...L6LAMPS.map(([x,y,s])=>[x+9*s,y-22,46+fl*.4]),[64,60,38],[280,56,24],[192,108,30],[160,200,30]];}
function warmL6(){return [...L6LAMPS.map(([x,y,s])=>[x+9*s,y-18,30]),[280,56,22]];}
function metroPavilion(P){ // cols 2-5, row 3: a glass box with the orange metro band, where you came up
  R(31,19,66,46,P.o);R(32,20,64,11,P.metro);R(32,20,64,1,P.metroLt);R(32,30,64,1,P.o);
  R(34,22,9,8,'#f2f2f2');glyphs(G,'M',36,22,P.metro,1);txt('OTANIEMI',69,23,'#fff6e0',1,'c');
  R(32,31,64,33,P.glass);for(let x=40;x<96;x+=8)R(x,31,1,33,P.glassLt);R(32,31,64,1,P.glassLt);R(32,47,64,1,P.glassLt);
  R(53,37,22,27,P.o);R(54,38,20,26,'#16121c');for(let i=0;i<5;i++)R(56,44+i*4,16,2,mix(P.metal,'#000000',i/6));   // doors and the escalator down
}
function startupSauna(P){ // cols 14-17, row 3: a log hut with a sign, a round window in the door and a smoking chimney
  R(270,10,9,14,P.o);R(271,11,7,12,P.conc);R(271,11,7,1,P.concLt);
  R(219,21,74,11,P.o);R(220,22,72,9,P.roof);R(220,22,72,1,P.roofLt);for(let x=224;x<292;x+=6)R(x,25,1,5,P.roofLt);
  R(223,31,66,34,P.o);R(224,32,64,32,P.sauna);for(let y=36;y<64;y+=5)R(224,y,64,1,P.saunaDk);R(224,32,64,1,P.saunaLt);
  R(226,35,46,17,P.o);R(227,36,44,15,P.sign);txt('STARTUP',249,37,'#24161e',1,'c');txt('SAUNA',249,44,'#a02a20',1,'c');
  R(274,39,12,25,P.o);R(275,40,10,24,P.saunaDk);R(275,40,10,1,P.saunaLt);R(278,44,5,5,P.o);R(283,53,1,2,P.metalLt);
  for(let i=0;i<5;i++){const x=229+i*8;disc(x,60,3,P.o);disc(x,60,2,i%2?P.saunaLt:P.sauna);R(x,60,1,1,P.saunaDk);}                 // firewood
}
function hotTub(P){ // col 18, row 3: a wooden barrel tub beside the sauna (the steam is animated)
  R(290,50,14,13,P.o);R(291,51,12,11,P.sauna);for(let x=293;x<302;x+=3)R(x,52,1,10,P.saunaDk);R(291,55,12,1,P.metalLt);R(291,60,12,1,P.metalLt);
  ell(297,50,7,3,P.o);ell(297,50,6,2,P.tub);R(294,49,3,1,P.shine);R(299,51,2,1,P.shine);
}
function aSculpture(P){ // cols 11-12, rows 6-7: the big A! on a plinth
  ell(192,127,18,3,'rgba(0,0,0,.3)');R(177,117,30,10,P.o);R(178,118,28,8,P.conc);R(178,118,28,1,P.concLt);R(178,124,28,2,P.concDk);
  for(const [ch,x,col] of [['A',180,P.art1],['!',196,P.art2]]){for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])glyphs(G,ch,x+dx,96+dy,P.o,3);glyphs(G,ch,x,96,col,3);}
}
function ring(cx,cy,ro,ri,col){const n=Math.ceil(ro);for(let dy=-n;dy<=n;dy++)for(let dx=-n;dx<=n;dx++){const d=dx*dx+dy*dy;if(d<=ro*ro&&d>ri*ri)R(cx+dx,cy+dy,1,1,col);}}
function bikeWheel(cx,cy,P){ring(cx,cy,4.6,3.3,P.o);ring(cx,cy,3.3,2.3,P.metalLt);                                   // black tyre, silver rim
  R(cx-2,cy,5,1,P.metal);R(cx,cy-2,1,5,P.metal);R(cx,cy,1,1,P.o);}                                                // spokes and hub; the ground shows through
function cityBike(x,y,P,shade){ // a yellow city bike seen from the side, facing right; x,y = rear hub; shade darkens one parked further back
  const col=shade?mix(P.bike,P.o,shade):P.bike;
  bikeWheel(x,y,P);bikeWheel(x+14,y,P);
  const frame=[[x,y-1,7,2],[x+4,y-8,2,8],[x+11,y-8,2,3],[x+13,y-5,1,5],[x-3,y-6,6,1],[x+13,y-10,6,4]];                // chain stay, seat tube, head tube, fork, rear mudguard, front carrier
  for(let i=0;i<5;i++)frame.push([x+6+i,y-2-i,2,2]);                                                              // the low step-through tube
  for(const [fx,fy,w,h] of frame)R(fx-1,fy-1,w+2,h+2,P.o);for(const [fx,fy,w,h] of frame)R(fx,fy,w,h,col);R(x+5,y-8,1,7,mix(col,'#ffffff',.25));
  R(x+14,y-9,4,2,P.o);R(x+15,y-9,2,1,P.duck);                                                                     // the number plate on the carrier
  R(x+4,y-10,1,2,P.o);R(x+1,y-12,6,2,P.o);R(x+2,y-12,3,1,P.bikeDk);                                              // saddle
  R(x+12,y-12,1,4,P.o);R(x+9,y-12,4,1,P.o);R(x+9,y-12,2,1,P.bikeDk);                                             // handlebar
  R(x+5,y,4,1,P.o);R(x+5,y+1,1,1,P.o);}                                                                          // crank and pedal
function bikeStation(P){ // cols 16-17, row 6: two city bikes in their docks and the station's yellow pillar
  R(284,84,7,26,P.o);R(285,85,5,24,P.metal);R(285,85,5,1,P.metalLt);R(285,86,5,7,P.bike);R(286,88,3,3,P.o);R(287,89,1,1,P.duck);R(285,98,5,3,P.bikeDk);
  R(252,97,33,2,P.o);R(253,97,31,1,P.metalLt);                                                                   // the dock rail behind the bikes
  cityBike(258,100,P,.3);cityBike(266,108,P);}
function scooter(x,y,col,P){ // a parked e-scooter, seen from the side
  R(x-1,y-1,3,3,P.o);R(x+7,y-1,3,3,P.o);R(x,y,1,1,P.metalLt);R(x+8,y,1,1,P.metalLt);R(x,y-3,10,2,P.o);R(x+1,y-3,7,1,col);
  R(x+7,y-13,3,11,P.o);R(x+8,y-12,1,9,P.metalLt);R(x+8,y-7,1,3,col);R(x+5,y-15,7,3,P.o);R(x+6,y-14,5,1,col);}
function scooters(P){scooter(98,57,P.scoot,P);scooter(101,62,P.scoot2,P);}                               // col 6, row 3: left by the metro entrance
function litterBin(P){R(83,113,10,15,P.o);R(84,114,8,13,P.metal);R(84,114,8,2,P.metalLt);R(85,118,6,2,P.o);R(84,125,8,2,P.bikeDk);R(87,121,2,2,P.flower);} // col 5, row 7
function busStop(P){ // col 15, row 12: a stop the night bus drives straight past
  R(246,178,3,29,P.o);R(247,179,1,27,P.metalLt);R(241,169,13,11,P.o);R(242,170,11,9,P.busSign);R(242,170,11,1,mix(P.busSign,'#ffffff',.3));
  R(244,172,7,4,'#f2f2f2');R(245,173,2,2,P.busSign);R(248,173,2,2,P.busSign);R(245,176,1,1,P.o);R(249,176,1,1,P.o);
  R(243,186,9,9,P.o);R(244,187,7,7,P.sign);for(let i=0;i<3;i++)R(245,188+i*2,5,1,P.metal);}
function pedLight(x,P){R(x-1,190,3,20,P.o);R(x,191,1,18,P.metalLt);R(x-3,180,7,11,P.o);R(x-2,181,5,9,'#14141a');}
function L6objs(P){
  return [
   {r:3,d:()=>metroPavilion(P)},{r:3,d:()=>startupSauna(P)},{r:3,d:()=>hotTub(P)},{r:3,d:()=>scooters(P)},{r:7,d:()=>aSculpture(P)},{r:7,d:()=>litterBin(P)},
   ...[[7,5],[13,10],[3,12]].map(([c,r])=>({r,d:()=>{planter(c,r,P);birch(c*16+8,r*16+10,P);}})), // planter and birch from the earlier levels
   ...L6LAMPS.map(([x,y,s])=>({r:y>>4,d:()=>lamp(x,y,s,P)})),
   {r:12,d:()=>busStop(P)},{r:13,d:()=>{pedLight(139,P);pedLight(180,P);}}
  ];
}
function paintL6(P){
  const [b,bx]=mk(320,224),[f,fx]=mk(320,224);G=bx;const rnd=rng(606);
  // lawn, with flat tufts and dandelions (nothing on the grass is in the way)
  R(0,48,320,160,P.grass);
  for(let i=0;i<80;i++)disc(16+rnd()*288,84+rnd()*104,2+rnd()*5,rnd()<.5?P.grassDk:P.grassLt);
  for(let i=0;i<140;i++){const x=18+rnd()*284|0,y=82+rnd()*108|0;R(x,y,1,2,P.tuft);if(rnd()<.14)R(x+1,y,1,1,P.flower);}
  // paving: the plaza in front of the campus, the path down to the crossing, the pavement along the road
  const tiles=(x0,y0,w,h)=>{for(let y=y0;y<y0+h;y+=8)for(let x=x0;x<x0+w;x+=8){const v=rnd();R(x,y,8,8,P.seam);R(x,y,7,7,v<.4?P.pave:v<.8?P.paveLt:P.paveDk);}};
  tiles(16,48,288,32);tiles(144,80,32,112);tiles(16,192,288,16);
  // the path is shared: a dashed centre line, a painted bicycle on one side and a walker on the other
  for(let y=84;y<190;y+=10)if(y<118||y>136)R(159,y,1,5,P.paint);
  for(const x of [147,154]){R(x,126,4,1,P.paint);R(x,129,4,1,P.paint);R(x,127,1,2,P.paint);R(x+3,127,1,2,P.paint);}R(150,124,6,1,P.paint);R(152,122,1,3,P.paint);R(155,122,2,1,P.paint);
  R(166,121,2,2,P.paint);R(166,124,2,4,P.paint);R(165,128,1,3,P.paint);R(168,128,1,3,P.paint);R(164,125,6,1,P.paint);
  ell(206,68,7,4,P.o);ell(206,68,6,3,P.metal);for(let x=201;x<212;x+=2)R(x,68,1,1,P.o);                                           // a manhole on the plaza
  // the campus (rows 0-2): red brick, a ribbon of tall windows, a copper roof edge and the stepped auditorium in pale stone
  R(0,0,320,48,P.brick);
  for(let y=6;y<48;y+=4)for(let x=(y>>2)%2*4-4;x<320;x+=8){const v=rnd();R(x,y,7,3,v<.22?P.brickLt:v<.4?P.brickDk:P.brick);}
  for(let i=0;i<90;i++){const x=294+rnd()*26|0,y=7+rnd()*40|0;if(rnd()<.3+(x-294)/40)R(x,y,2,2,rnd()<.5?P.leaf:P.leafLt);}          // ivy on the far corner
  R(0,0,320,5,P.copper);R(0,4,320,1,P.copperLt);R(0,5,320,1,P.o);R(17,6,3,41,P.o);R(18,6,1,41,P.copperLt);                          // and a drainpipe on the near one
  for(let x=8;x<312;x+=14){R(x-1,11,10,20,P.o);R(x,12,8,18,P.win);R(x,12,8,1,P.winFr);R(x+3,12,1,18,P.winFr);}
  R(0,34,320,2,P.brickDk);R(0,46,320,2,P.o);
  for(let i=0;i<4;i++){const w=108-i*22,x=160-w/2,y=36-i*9;R(x-1,y-1,w+2,11,P.o);R(x,y,w,9,i%2?P.marble:P.marbleLt);R(x,y,w,1,P.marbleLt);R(x,y+8,w,1,P.marbleDk);
    for(let k=x+5;k<x+w-3;k+=9)R(k,y+3,1,5,P.marbleDk);}
  R(126,37,68,9,P.marbleLt);txt('UNIVERSITY',160,38,P.marbleDk,1,'c');
  for(const x of [110,197]){R(x,36,13,10,P.o);R(x+1,37,5,9,P.win);R(x+7,37,5,9,P.win);R(x+1,37,11,1,P.winFr);R(x+5,41,1,2,P.winFr);R(x+7,41,1,2,P.winFr);} // entrance doors
  // hedges along the sides, with a few blossoms
  for(const x of [0,304]){R(x,48,16,160,P.hedge);for(let y=48;y<208;y+=6){disc(x+8+((y*5)%5)-2,y+3,5,P.hedgeLt);disc(x+8-((y*3)%4),y+5,3,P.hedge);}}
  for(let i=0;i<22;i++)R((i%2?306:2)+rnd()*11|0,52+rnd()*150|0,1,1,i%3?P.fl1:P.duck);
  // flower beds along the edge of the plaza
  for(const [x0,x1] of [[34,104],[214,286]]){R(x0-1,81,x1-x0+2,7,P.concDk);R(x0,82,x1-x0,5,P.soil);
    for(let x=x0+1;x<x1-1;x+=3){const col=[P.fl1,P.flower,P.fl3,P.duck][rnd()*4|0],up=rnd()<.5?1:0;R(x,83-up,2,2,col);R(x,85-up,1,2+up,P.tuft);}}
  // the road along the bottom, with the zebra crossing as the way out
  R(0,208,320,16,P.road);R(0,208,320,2,P.curb);for(let x=6;x<320;x+=18)if(x<130||x>184)R(x,216,8,1,P.roadLt);
  for(let x=146;x<176;x+=6)R(x,211,4,13,P.zebra);
  // the pond (cols 5-7, rows 9-10), clear of the path, with reeds and lily pads (the duck is animated)
  const [px,py]=L6POND,pond=[];for(let r=9;r<=10;r++)for(let c=5;c<=7;c++)pond.push([c*16+8,r*16+8]);
  for(const [x,y] of pond)disc(x,y,12,P.shore);for(const [x,y] of pond)disc(x,y,10,P.water);R(px,py,36,20,P.water);
  for(let i=0;i<12;i++)R(px-2+rnd()*36|0,py+rnd()*20|0,3+rnd()*4|0,1,P.waterLt);
  for(const [x,y] of [[px-5,py+2],[px+41,py+20],[px+6,py+28],[px+30,py-4],[px+44,py+8]]){R(x,y-6,1,6,P.reed);R(x+2,y-4,1,4,P.reed);R(x,y-7,1,1,P.wood);}
  for(const [x,y,fl] of [[px+2,py+17,1],[px+33,py+3,0],[px+29,py+19,0],[px+8,py+1,0]]){ell(x,y,3,2,P.leafDk);ell(x,y,2,1,P.leafLt);R(x+1,y,2,1,P.water);if(fl)R(x-2,y-2,2,2,P.lily);}
  // benches, the city bike rack, a picnic somebody left in a hurry, an e-scooter in the grass and flyers by the sauna
  bench(3,7,P);bench(16,10,P);
  bikeStation(P);
  R(229,140,26,16,P.o);for(let y=0;y<14;y+=2)for(let x=0;x<24;x+=2)R(230+x,141+y,2,2,(x+y)%4?P.duck:P.fl3);
  R(234,144,9,7,P.o);R(235,145,7,5,P.woodLt);disc(238,147,2,P.flower);R(238,146,1,1,P.fl3);R(239,148,1,1,P.fl3);R(246,145,2,4,P.metalLt);R(246,145,2,1,P.fl3);R(249,150,3,2,P.metalLt);
  R(33,138,2,2,P.bikeDk);R(43,138,2,2,P.bikeDk);R(34,137,10,2,P.o);R(35,137,8,1,P.scoot);R(44,136,8,1,P.metalLt);R(52,134,1,5,P.o);
  for(const [x,y] of [[262,70],[268,75],[292,72],[251,67]]){R(x,y,4,3,P.sign);R(x,y,4,1,P.fl1);}R(257,73,2,3,P.metalLt);R(257,73,2,1,P.fl3);R(97,125,2,2,P.sign);
  const objs=L6objs(P);objs.forEach(o=>o.d());
  G=fx;objs.forEach(o=>{fx.save();fx.beginPath();fx.rect(0,0,320,o.r*16+4);fx.clip();o.d();fx.restore();});
  G=ctx;return {bg:b,fg:f};
}
function dynL6(d,layer){const night=1-d,open=L&&L.open,[px,py]=L6POND;
  if(layer==='over'){ // on top of the foreground copies: lamp heads and their moths, the pedestrian lights, string lights, smoke and steam
    L6LAMPS.forEach(([x,y,s],i)=>{const hx=x+9*s;R(hx-2,y-32,5,1,mix('#fff0b0',D6.lampOff,d));
      if(night>.3)for(let k=0;k<2;k++){const a=S.clock*(2.1+k*.8)+i*2.3+k*3;R(Math.round(hx+Math.cos(a)*6),Math.round(y-30+Math.sin(a*1.7)*4),1,1,'#fff6c0');}});
    for(const x of [139,180]){R(x-1,182,3,3,open?'#3a1414':'#f04a3a');R(x-1,186,3,3,open?'#5cf07c':'#143a1e');}
    for(let i=0;i<9;i++)R(226+i*8,32,2,2,(Math.floor(S.clock*2)+i)%3?['#f8c840','#e05a8a','#3ac0d0'][i%3]:'#3a2a30');
    for(const s of L.smoke){G.globalAlpha=Math.max(0,s.t/3)*.5;disc(s.x,s.y,s.r,mix('#6a7a88','#e8e8f0',d));}
    for(let k=0;k<3;k++){const t=(S.clock*.45+k/3)%1;G.globalAlpha=(1-t)*.4;disc(297+Math.sin(t*5+k*2)*2,47-t*12,1.5+t*1.5,mix('#8a9aa8','#f2f2f8',d));}G.globalAlpha=1; // the tub is still warm
    return;}
  if(night>.02){
    G.globalAlpha=night*.85;R(54,38,20,26,'#f8d880');G.globalAlpha=1;for(let i=0;i<5;i++)R(56,44+i*4,16,1,'#b89850');           // light from the metro hall
    G.globalAlpha=night*.8;for(const x of [111,117,198,204])R(x,38,5,8,'#f8d880');                                               // the lobby lights never go off
    G.globalAlpha=night;for(let i=0;i<22;i++){const x=8+i*14,h=(Math.imul(Math.floor(S.clock/7+i*.41),2654435761)^Math.imul(i,40503))>>>0;
      if(h%100<24&&(x<96||x>212)){R(x,12,8,18,'#f8d880');R(x+3,12,1,18,'#c8a860');}}G.globalAlpha=1;}                               // someone is always finishing a thesis
  R(279,45,3,3,mix('#f8a040','#c89860',d));                                                                                        // the sauna stove glows through the door
  const sh=mix(N6.shine,D6.shine,d);for(let i=0;i<4;i++){const k=Math.floor(S.clock*2+i*1.7);R(px+2+((k*37+i*53)%30),py+2+((k*23+i*31)%16),2+(k%3),1,sh);}
  // the duck sleeps through the night and goes for a paddle when it gets light
  {const awake=d>.35,u=(S.clock*.05)%1,tri=u<.5?u*2:2-u*2,x=awake?Math.round(px+4+tri*26):px+22,y=awake?Math.round(py+10+Math.sin(S.clock*.6)*4):py+11,s=awake&&u>=.5?-1:1,dc=mix(N6.duck,D6.duck,d);
    ell(x,y,3,2,N6.o);ell(x,y,2,1,dc);if(awake){R(x+s*2-(s<0?1:0),y-3,2,2,dc);R(x+s*4,y-2,1,1,'#e8a030');R(x-s*5,y+1,2,1,sh);}else R(x-1,y-1,2,1,mix(N6.metalLt,D6.metal,d));}
  // a city rabbit crosses the lawn now and then
  {const t=S.clock%31;if(t<7.6){const x=Math.round(20+t*37),hop=Math.abs(Math.sin(t*8)),y=Math.round(188-hop*4),c=mix(N6.rab,D6.rab,d);
    R(x-4,y-5,8,5,N6.o);R(x-3,y-4,6,3,c);R(x+1,y-8,5,5,N6.o);R(x+2,y-7,3,3,c);R(x+4,y-6,1,1,N6.o);R(x+1,y-11,2,4,N6.o);R(x+4,y-11,2,4,N6.o);R(x+2,y-10,1,3,c);R(x+4,y-10,1,3,c);
    R(x-4,y-4,1,2,mix(N6.duck,D6.duck,d));if(hop<.4){R(x-3,y-1,2,1,N6.o);R(x+1,y-1,2,1,N6.o);}}}
  // the night bus rolls past now and then; it does not stop here
  if(!open){const bx=Math.round(330-(S.clock%17)*120);if(bx>-70){R(bx,210,62,13,N6.o);R(bx+1,211,60,11,'#e87a30');R(bx+1,211,60,1,'#ffa860');R(bx+1,220,60,2,'#a84a14');
    for(let x=bx+5;x<bx+36;x+=10)R(x,213,7,4,'#f8e0a0');R(bx+38,212,20,9,N6.o);txt('550',bx+57,213,'#f8c840',1,'r');R(bx,216,1,3,'#fff6c0');R(bx+61,216,1,3,'#e03030');}
    if(Math.floor(S.clock*2)%2)txtO('WAIT',160,197,'#f04a3a',1,'c','#140a14');}
  else if(Math.floor(S.clock*3)%2){R(158,196,4,6,'#5cf07c');R(155,202,10,2,'#5cf07c');R(157,204,6,2,'#5cf07c');R(159,206,2,1,'#5cf07c');}
}

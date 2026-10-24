"use strict";
/* Level 4: Kontula, East Helsinki. A 1970s block of flats, the ostari (shopping centre) with a pizzeria, a pub and a kiosk,
   a grilli kiosk in the middle of the plaza, benches and birch planters, and the metro entrance as the exit.
   Night + grey morning palettes; windows, neon signs and street lamps are animated. */
const L4MAP=["####################","####################","####################","#...........########","#..b.............b.#","#..................#","#....==......xx....#",
  "#........GG........#","#..==....GG....==..#","#..................#","#..................#","#..b.............b.#","#......M....M......#","#########DD#########"];
const N4={pave:'#2e2e3c',paveLt:'#363648',paveDk:'#26262f',seam:'#1e1e28',walk:'#34323e',
 conc:'#4a4a5e',concLt:'#5c5c72',concDk:'#36364a',seamW:'#2e2e3e',win:'#1a1a2c',winFr:'#2c2c3c',balc:'#40405a',balcLt:'#525270',
 roof:'#30303a',roofLt:'#3e3e4a',brick:'#4e3a44',brickLt:'#5e4652',brickDk:'#3a2a34',shop:'#221e28',fascia:'#1e1a24',
 hedge:'#1e3a32',hedgeLt:'#2a4c40',soil:'#2e2624',
 birch:'#a8b0c0',birchMk:'#262630',leaf:'#24483e',leafLt:'#32604e',leafDk:'#183630',
 wood:'#4e3c3e',woodLt:'#6a5254',metal:'#4a4e5e',metalLt:'#62687a',
 binG:'#24503e',binB:'#2a3e6a',binK:'#3a3a46',kiosk:'#7a3434',kioskLt:'#9a4444',cream:'#a8a090',
 metro:'#c85a28',chalk:'#7a7a98',tagA:'#a04a7a',tagB:'#3a8a9a',tagC:'#a89a3a',lampOff:'#5a5a6a',signOff:'#3a3440',o:'#12121a'};
const D4={pave:'#8e8a8e',paveLt:'#a09ca0',paveDk:'#7c787c',seam:'#666266',walk:'#9a969a',
 conc:'#c0b8ae',concLt:'#d6cec4',concDk:'#9a928a',seamW:'#8a847c',win:'#6a8aa8',winFr:'#e8e4dc',balc:'#a8a4a0',balcLt:'#c8c4bc',
 roof:'#6a6a70',roofLt:'#82828a',brick:'#a8604e',brickLt:'#c07460',brickDk:'#844a3c',shop:'#4a5a6a',fascia:'#3a3440',
 hedge:'#3a7a3a',hedgeLt:'#5a9a48',soil:'#6a4a34',
 birch:'#f2f0e6',birchMk:'#2a2a2a',leaf:'#5aa03e',leafLt:'#86c452',leafDk:'#3e7a32',
 wood:'#9a6a42',woodLt:'#bc8a5a',metal:'#7a8090',metalLt:'#a0a8b8',
 binG:'#3a8a5a',binB:'#3a5aa8',binK:'#6a6a76',kiosk:'#c84a3a',kioskLt:'#e06a50',cream:'#f0e8d8',
 metro:'#f07030',chalk:'#d4d4dc',tagA:'#e05a9a',tagB:'#3ac0d0',tagC:'#f0d040',lampOff:'#c8c8d0',signOff:'#5a5060',o:'#1e1a1e'};
const L4WIN=[];for(let fl=0;fl<2;fl++)for(let i=0;i<11;i++)L4WIN.push([6+i*17,7+fl*14]);
const L4LAMPS=[[24,90,1],[296,90,-1],[24,186,1],[296,186,-1]];
const L4lampOn=i=>!(i===2&&Math.floor(S.clock*8)%5<2); // the one by the bottom-left planter is broken
function lightsL4(fl){return [...L4LAMPS.map(([x,y,s],i)=>[x+9*s,y-22,L4lampOn(i)?48+fl*.4:6]),[160,148,34],[214,62,28],[256,62,24],[296,62,26],[44,42,20],[140,42,20],[160,186,24]];}
function warmL4(){return L4LAMPS.map(([x,y,s],i)=>[x+9*s,y-18,L4lampOn(i)?32:1]);}
function lamp(x,by,s,P){R(x-1,by-34,3,35,P.o);R(x,by-33,1,33,P.metal);R(x-2,by-3,5,4,P.o);R(x-1,by-2,3,2,P.metalLt);
  const ax=s>0?x:x-10;R(ax,by-37,11,3,P.o);R(ax+1,by-36,9,1,P.metalLt);const hx=x+9*s;R(hx-3,by-35,7,4,P.o);R(hx-2,by-34,5,2,P.metal);}
function planter(c,r,P){const x=c*16,y=r*16;R(x+1,y+6,14,10,P.o);R(x+2,y+7,12,8,P.conc);R(x+2,y+7,12,1,P.concLt);R(x+3,y+8,10,3,P.soil);R(x+2,y+13,12,2,P.concDk);}
function bench(c,r,P){const x=c*16,y=r*16;R(x+3,y+12,4,4,P.o);R(x+25,y+12,4,4,P.o);R(x+4,y+12,2,3,P.concDk);R(x+26,y+12,2,3,P.concDk);
  R(x+1,y+1,30,12,P.o);R(x+2,y+2,28,3,P.wood);R(x+2,y+2,28,1,P.woodLt);R(x+2,y+6,28,2,P.wood);R(x+2,y+9,28,3,P.wood);R(x+2,y+9,28,1,P.woodLt);R(x+2,y+5,28,1,P.metal);}
function bins(P){for(const [x,col] of [[209,P.binG],[219,P.binB],[229,P.binK]]){R(x,98,10,14,P.o);R(x+1,99,8,12,col);R(x+1,99,8,3,mix(col,'#ffffff',.2));R(x+1,102,8,1,P.o);R(x+3,105,4,3,mix(col,'#ffffff',.55));}}
function grilli(P){ // kiosk on cols 9-10, rows 7-8: striped awning, sign, serving window (lit in dynL4)
  ell(160,144,18,3,'rgba(0,0,0,.3)');R(143,114,34,30,P.o);R(144,115,32,28,P.kiosk);R(144,115,32,2,P.kioskLt);R(144,140,32,3,mix(P.kiosk,'#000000',.3));
  R(141,108,38,10,P.o);for(let x=142;x<178;x+=6){R(x,109,3,8,P.cream);R(x+3,109,3,8,P.kioskLt);}R(142,116,36,1,mix(P.kiosk,'#000000',.35));
  R(146,119,28,9,P.o);R(147,120,26,7,P.fascia);
  R(147,129,26,9,P.o);R(148,130,24,7,P.shop);R(146,138,28,2,P.metalLt);R(146,140,28,1,P.o);
}
function metro(P){ // canopy over the stairs, on cols 7-12 of row 12; the orange M on top
  for(const px of [112,192]){R(px+1,186,14,22,P.o);R(px+2,187,12,20,P.conc);R(px+2,203,12,4,P.concDk);}
  R(115,195,5,2,P.tagA);R(117,198,6,1,P.tagA);R(119,193,1,6,P.tagB);R(196,195,7,2,P.tagC);R(198,199,4,1,P.tagB);R(200,193,1,5,P.tagA);
  R(99,181,122,11,P.o);R(100,182,120,9,P.concLt);R(100,182,120,1,mix(P.concLt,'#ffffff',.25));R(100,189,120,2,P.concDk);
  for(let x=104;x<218;x+=12)R(x,185,8,1,P.conc);
  R(151,171,18,13,P.o);R(152,172,16,11,P.metro);R(152,172,16,1,mix(P.metro,'#ffffff',.3));glyphs(G,'M',158,174,'#ffffff',1);
}
function L4objs(P){
  return [
   ...[[3,4],[17,4],[3,11],[17,11]].map(([c,r])=>({r,d:()=>{planter(c,r,P);birch(c*16+8,r*16+10,P);}})),
   {r:8,d:()=>grilli(P)},
   {r:12,d:()=>metro(P)},
   ...L4LAMPS.map(([x,y,s])=>({r:y>>4,d:()=>lamp(x,y,s,P)}))
  ];
}
function paintL4(P){
  const [b,bx]=mk(320,224),[f,fx]=mk(320,224);G=bx;const rnd=rng(404);
  // plaza paving + the pavement in front of the flats
  for(let y=48;y<208;y+=8)for(let x=16;x<304;x+=8){const v=rnd();R(x,y,8,8,P.seam);R(x,y,7,7,v<.4?P.pave:v<.8?P.paveLt:P.paveDk);}
  R(16,48,176,16,P.walk);for(let x=16;x<192;x+=24)R(x,48,1,16,P.seam);R(16,63,176,1,P.seam);
  for(let i=0;i<40;i++)R(20+rnd()*280|0,66+rnd()*136|0,1,1,P.paveDk);
  ell(96,168,7,4,P.o);ell(96,168,6,3,P.metal);for(let x=91;x<101;x+=2)R(x,168,1,1,P.o);
  // chalk hopscotch
  const ch=P.chalk;for(const [x,y,w] of [[200,176,10],[200,166,10],[195,156,10],[205,156,10],[200,146,10]]){R(x,y,w,1,ch);R(x,y+9,w,1,ch);R(x,y,1,10,ch);R(x+w-1,y,1,10,ch);}
  R(202,148,3,1,ch);R(203,170,2,3,ch);
  // the block of flats (cols 0-11, rows 0-2)
  R(0,0,192,48,P.conc);R(0,0,192,4,P.roof);R(0,3,192,1,P.o);
  for(let x=0;x<192;x+=34)R(x,4,1,30,P.seamW);R(0,19,192,1,P.seamW);R(0,33,192,1,P.seamW);
  for(let i=0;i<L4WIN.length;i++){const [x,y]=L4WIN[i];R(x-1,y-1,11,10,P.o);R(x,y,9,8,P.win);R(x,y,9,1,P.winFr);R(x+4,y,1,8,P.winFr);
    if(i%11%3===1){R(x-3,y+8,15,5,P.o);R(x-2,y+8,13,4,P.balc);R(x-2,y+8,13,1,P.balcLt);for(let k=x;k<x+11;k+=3)R(k,y+9,1,3,P.balcLt);}}
  R(0,34,192,14,P.concDk);R(0,34,192,1,P.concLt);
  for(const [dx,ltr] of [[38,'A'],[134,'B']]){R(dx-2,32,20,3,P.o);R(dx-1,32,18,1,P.metalLt);R(dx+1,36,14,12,P.o);R(dx+2,37,12,11,P.win);R(dx+7,37,1,11,P.winFr);R(dx+2,37,12,1,P.winFr);
    R(dx+17,37,7,9,P.o);R(dx+18,38,5,7,'#e8e4dc');txt(ltr,dx+20,38,'#2a2a3a',1,'c');}
  for(const x of [10,70,100,166])R(x,39,12,5,P.o),R(x+1,40,10,3,P.win);
  // the ostari (cols 12-19, rows 0-3): flat roof, signs, shop fronts
  R(192,0,128,26,P.roof);for(let i=0;i<90;i++)R(192+rnd()*128|0,rnd()*24|0,1,1,P.roofLt);R(192,0,1,64,P.o);
  for(const [x,y,w,h] of [[204,5,18,10],[236,8,12,8],[284,4,22,12]]){R(x,y,w,h,P.o);R(x+1,y+1,w-2,h-2,P.metal);R(x+1,y+1,w-2,1,P.metalLt);for(let k=x+3;k<x+w-2;k+=3)R(k,y+3,1,h-5,P.o);}
  R(260,6,1,14,P.o);R(256,10,9,1,P.metalLt);
  R(192,24,128,16,P.o);R(193,25,127,14,P.fascia);R(193,39,127,1,P.brickDk);
  R(193,40,127,24,P.brick);for(let y=43;y<64;y+=4)R(193,y,127,1,P.brickDk);
  for(const [x,w] of [[197,30],[244,20],[281,27]]){R(x-1,42,w+2,20,P.o);R(x,43,w,18,P.shop);R(x,43,w,1,mix(P.shop,'#ffffff',.25));}
  for(const x of [229,266,310]){R(x-1,43,10,21,P.o);R(x,44,8,20,P.win);R(x+4,44,1,20,P.winFr);R(x+6,53,1,3,P.metalLt);}
  R(193,62,127,2,P.concDk);
  // hedges along the sides, low wall along the bottom
  for(const [x,y0,y1] of [[0,48,208],[304,64,208]]){R(x,y0,16,y1-y0,P.hedge);for(let y=y0;y<y1;y+=6){disc(x+8+((y*5)%5)-2,y+3,5,P.hedgeLt);disc(x+8-((y*3)%4),y+5,3,P.hedge);}}
  R(0,208,320,16,P.concDk);R(0,208,320,1,P.concLt);for(let x=8;x<320;x+=24)R(x,209,1,15,P.seam);
  for(let x=0;x<320;x+=10){if(x>=128&&x<192)continue;disc(x+5,214,6,P.hedge);disc(x+3,212,3,P.hedgeLt);}
  // stairs down to the metro (the shutter is animated)
  R(143,203,34,21,P.o);for(let i=0;i<5;i++){R(144,204+i*4,32,3,mix(P.concDk,'#000000',i/7));R(144,204+i*4,32,1,mix(P.concLt,'#000000',i/7));}
  // benches, recycling bins and the rest
  bench(5,6,P);bench(3,8,P);bench(15,8,P);bins(P);
  const objs=L4objs(P);objs.forEach(o=>o.d());
  G=fx;objs.forEach(o=>{fx.save();fx.beginPath();fx.rect(0,0,320,o.r*16+4);fx.clip();o.d();fx.restore();});
  G=ctx;return {bg:b,fg:f};
}
function dynL4(d,layer){
  const night=1-d,P=d<.5?N4:D4;
  const sign=(t,x,y,col,on)=>txt(t,x,y,on?mix(col,'#4a4250',d):mix(N4.signOff,D4.signOff,d),1,'c');
  if(layer==='over'){ // on top of the foreground copies of the grilli and the lamps
    sign('GRILLI',160,121,'#f8a040',true);if(night>.02){G.globalAlpha=night*.85;R(148,130,24,7,'#f8d070');G.globalAlpha=1;}
    L4LAMPS.forEach(([x,y,s],i)=>{const hx=x+9*s;R(hx-2,y-32,5,1,L4lampOn(i)?mix('#fff0b0',D4.lampOff,d):mix(N4.lampOff,D4.lampOff,d));});
    return;}
  // windows light up and go dark through the night; a few are just the TV
  if(night>.02){G.globalAlpha=night;for(let i=0;i<L4WIN.length;i++){const [x,y]=L4WIN[i],h=(Math.imul(Math.floor(S.clock/6+i*.37),2654435761)^Math.imul(i,40503))>>>0;
    if(h%100<40){R(x,y,9,8,h%100<7&&Math.floor(S.clock*5+i)%3?'#7a9af0':'#f8d880');R(x,y,9,1,'#c8a860');R(x+4,y,1,8,'#c8a860');}}G.globalAlpha=1;}
  // neon signs (the pub one flickers), shop windows and the grilli
  const pub=Math.floor(S.clock*7)%23!==0&&Math.floor(S.clock*11)%37!==0;
  sign('PIZZA',213,29,'#f8604a',true);sign('PUB',254,29,'#5af08a',pub);sign('KIOSKI',295,29,'#5ad8f8',true);
  if(night>.02){G.globalAlpha=night*.85;R(197,43,30,18,'#f8b060');R(244,43,20,18,pub?'#a8d870':'#5a7a4a');R(281,43,27,18,'#d8f0f8');G.globalAlpha=1;
    G.globalAlpha=night;for(const [x,y,w] of [[200,50,6],[210,48,4],[218,52,5],[248,52,3],[256,50,3],[284,46,22],[284,52,22]])R(x,y,w,2,'#3a2a30');G.globalAlpha=1;}
  // two pigeons by the grilli
  for(const [px,py,k] of [[138,150,0],[183,153,1]]){const peck=Math.floor(S.clock*3+k*2)%4===0;R(px-2,py-2,6,4,P.o);R(px-1,py-1,4,2,'#8a8a9a');R(px+(k?-3:3),py-(peck?0:2),2,2,P.o);R(px+(k?-2:3),py-(peck?0:2)+0,1,1,'#9a9aaa');R(px,py+2,1,1,'#c87a5a');}
  // the metro shutter rolls up at 6:00 AM
  if(!L||!L.open){const sc=mix('#4a4a58','#9a9aa6',d);R(144,204,32,20,sc);for(let y=206;y<224;y+=3)R(144,y,32,1,mix(sc,'#000000',.3));R(144,204,32,1,mix(sc,'#ffffff',.2));
    txt('6:00',160,206,'#f8c840',1,'c');if(Math.floor(S.clock*2)%2){R(156,216,7,5,'#2a2028');R(157,217,5,3,'#c8a040');R(158,214,3,3,'#2a2028');R(159,215,1,2,sc);}}
  else{G.globalAlpha=.3;R(144,204,32,20,'#fff0b0');G.globalAlpha=1;if(Math.floor(S.clock*3)%2){R(158,196,4,6,'#ffe066');R(155,202,10,2,'#ffe066');R(157,204,6,2,'#ffe066');R(159,206,2,1,'#ffe066');}}
}

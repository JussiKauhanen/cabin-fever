"use strict";
/* Level 7: the Mega Corporation office in Keilaniemi, after hours. An open-plan floor: desks with glowing screens (one is a
   standing desk), a glass meeting room, two phone booths, a kitchenette with a water cooler and a high table, a lounge with
   a sofa and bean bags, a game corner with table football and an arcade cabinet, lifts, the logo wall and the HR door.
   The front door at the bottom needs a badge, and the badge reader reboots at 6:00 AM. One palette: it is always the same
   time under office lights. Meeting invites and the HR warning are drawn here from L.office (office.js). */
const L7MAP=["####################","####################","#.........TTWKKK...#","#..................#","#..DD..DD....DD.C..#","#..................#","#..DD..DD..........#",
  "#P...........GGGG..#","#..........BBGGGG..#","#..DD..DD..........#","#..............SSl.#","#ALFF.........oCCo.#","#..................#","#########DD#########"];
const L7DESKS=[[3,4],[7,4],[13,4],[3,6],[7,6],[3,9],[7,9]];
const deskUp=i=>i===4?5:0; // the desk at [7,6] is a standing desk: its top and its screen sit this much higher
const N7={o:'#14121a',wall:'#c4c0b8',wallDk:'#a4a098',wallLt:'#dcd8d0',skirt:'#6a6a74',
 carpet:'#3e4a5e',carpetLt:'#465468',carpetDk:'#364256',seam:'#2e3a4c',mat:'#2a3040',
 desk:'#b08a5a',deskLt:'#c8a070',deskDk:'#86643c',screen:'#16202e',paper:'#f2f2f2',
 steel:'#8a8e9a',steelLt:'#b0b4c0',steelDk:'#5a5e6a',glass:'#7ab0d0',glassLt:'#c4e4f4',
 plant:'#2e7a3a',plantLt:'#4a9a4a',plantDk:'#1e5a2a',pot:'#a85a3a',sofa:'#d8702a',sofaLt:'#f08a48',sofaDk:'#a8501a',
 counter:'#e8e4dc',counterDk:'#b0aca4',door:'#7a4a3a',doorLt:'#9a6a52',red:'#c03a2e',
 pod:'#e8e6e0',podDk:'#b4b0a8',felt1:'#2e8a8a',felt2:'#d8a030',turf:'#2e6e46',turfLt:'#3a8254',
 rug:'#2e5a66',rugLt:'#3e7682',rugTrim:'#d8c8a0',bag1:'#e05a8a',bag2:'#9ac83a',cab:'#3a2a78',cabLt:'#5a4ab0'};
/* The company colours: a twin-peak M (two overlapping triangles with scanlines cut out of the bottom half) and a rainbow wordmark. */
const MEGA={pink:'#f0508c',gold:'#f8d040',cyan:'#38c8e8',plate:'#161038',grad:['#fff6a0','#f8d040','#f8a030','#f0508c','#d048c0','#7a5af0','#38c8e8']};
function megaMark(x,y,h){const k=h>>1,a1=x+k,a2=a1+k;
  for(let r=0;r<h;r++){if(r>h*.5&&(h-r)%2===0)continue;const o=(r+1)>>1,w=r+2,l0=a1-o,r0=a2-o;
    R(l0,y+r,w,1,MEGA.pink);R(r0,y+r,w,1,MEGA.cyan);if(l0+w>r0)R(r0,y+r,l0+w-r0,1,MEGA.gold);}}
function logoWall(P){ // on the back wall, between the lifts and the clock (the wordmark shimmers in dynL7)
  R(65,2,108,26,P.o);R(66,3,106,24,MEGA.plate);R(66,3,106,1,'#2e2468');R(66,26,106,1,'#0c0820');
  megaMark(69,8,14);glyphs(G,'MEGA',96,5,'#0a0620',2);glyphs(G,'MEGA',95,4,MEGA.grad,2);txt('CORPORATION',95,19,'#c8d0f8',1);
  R(146,5,22,2,MEGA.pink);R(151,9,17,2,MEGA.gold);R(156,13,12,2,MEGA.cyan);}
function lightsL7(fl){const w=L&&L.office&&L.office.warn,out=[[72,84,50],[232,72,46],[72,160,Math.floor(S.clock*7)%11<2?14:44],[176,150,40],[160,200,30],[232,36,26],[40,36,22],[284,36,20],
   [118,16,34],[280,150,38],[192,128,20],[24,170,16]];
  L7DESKS.forEach(([c,r],i)=>out.push([c*16+16,r*16-2-deskUp(i),14]));if(w)out.push([w.x,w.y-10,30]);return out;}
function warmL7(){const w=L&&L.office&&L.office.warn;return [w?[w.x,w.y-8,36]:[220,30,16],[280,150,30]];}
function mug(x,y,col){R(x,y,4,4,N7.o);R(x+1,y+1,2,2,col);}
function desk(c,r,P,i){const x=c*16,y=r*16,up=deskUp(i),ty=y-up; // two tiles wide; the screen stands at the back of the desk and faces you
  R(x+3,ty+12,3,4+up,P.o);R(x+26,ty+12,3,4+up,P.o);R(x+4,ty+12,1,3+up,P.deskDk);R(x+27,ty+12,1,3+up,P.deskDk);
  if(up){R(x+6,y+10,20,1,P.steelDk);R(x+8,y+13,16,3,P.o);R(x+9,y+13,14,2,P.mat);}                                 // standing desk: a crossbar and a mat to stand on
  R(x+1,ty+2,30,12,P.o);R(x+2,ty+3,28,7,P.desk);R(x+2,ty+3,28,1,P.deskLt);R(x+2,ty+10,28,3,P.deskDk);
  R(x+9,ty-9,14,12,P.o);R(x+10,ty-8,12,8,P.screen);R(x+14,ty+1,4,2,P.steelDk);R(x+11,ty+6,10,2,P.o);R(x+11,ty+6,10,1,'#c8ccd8');
  const sheet=()=>{R(x+24,ty+5,4,4,P.o);R(x+25,ty+6,2,2,P.paper);};
  if(i===0){mug(x+4,ty+4,'#e04a3a');R(x+24,ty+5,4,4,P.o);R(x+25,ty+6,2,2,P.pot);disc(x+26,ty+3,2,P.plant);R(x+26,ty+1,1,1,P.plantLt);}                    // a mug and a cactus
  else if(i===1){R(x+23,ty-6,8,9,P.o);R(x+24,ty-5,6,6,'#1a2a44');R(x+25,ty-4,4,1,'#5ad8f8');R(x+25,ty-2,3,1,'#9dbb6c');R(x+3,ty+4,6,1,P.o);R(x+3,ty+5,2,3,P.o);R(x+7,ty+5,2,3,P.o);} // a second screen, headphones
  else if(i===2){R(x+3,ty,7,9,P.o);for(let k=0;k<4;k++)R(x+4,ty+1+k*2,5,1,P.paper);R(x+24,ty+6,5,2,P.o);R(x+24,ty+6,4,1,P.red);}                          // the paperwork pile, a stapler
  else if(i===3){R(x+3,ty+3,8,6,P.o);R(x+4,ty+5,4,3,'#f8d040');R(x+6,ty+4,3,2,'#f8d040');R(x+9,ty+5,1,1,'#f08030');R(x+7,ty+4,1,1,P.o);R(x+8,ty-7,3,3,'#f8d040');R(x+21,ty-2,3,3,'#f0a0c8');sheet();} // a rubber duck, sticky notes
  else if(i===4){R(x+3,ty+2,7,6,P.o);R(x+4,ty+3,5,3,'#5ad8f8');R(x+4,ty+6,5,1,P.steel);R(x+25,ty+1,3,7,P.o);R(x+26,ty+2,1,5,'#5aa8e0');}                    // a laptop, a water bottle
  else if(i===5){R(x+5,ty+1,1,7,P.o);R(x+2,ty-1,7,3,P.o);R(x+3,ty,5,1,'#f8e0a0');R(x+4,ty+7,3,1,P.o);R(x+24,ty+3,5,5,P.o);R(x+25,ty+4,3,3,'#8ac0e0');R(x+26,ty+5,1,2,'#f2c49a');} // a lamp, a framed photo
  else{R(x+2,ty+4,8,5,P.o);R(x+3,ty+5,6,3,'#c8a070');R(x+5,ty+6,2,1,P.red);for(const dx of [24,27]){R(x+dx,ty+4+(dx&1),2,4,P.o);R(x+dx,ty+5+(dx&1),2,1,'#9dbb6c');}} // crunch time: pizza and energy drinks
  if(!up){const col=['#3a8a8a','#5a5e6a','#d8702a','#5a5e6a','','#8a5ab0','#3a8a8a'][i];R(x+11,y+8,10,1,P.o);R(x+10,y+9,12,7,P.o);R(x+11,y+9,10,6,col);R(x+12,y+9,8,1,mix(col,'#ffffff',.35));R(x+11,y+13,10,2,mix(col,'#000000',.35));R(x+15,y+11,2,1,mix(col,'#000000',.35));} // the chair, pushed in
}
function cabinet(P){const x=256,y=64; // col 16, row 4: a tall filing cabinet with a plant on top
  R(x,y-15,16,31,P.o);R(x+1,y-14,14,29,P.steel);R(x+1,y-14,14,1,P.steelLt);for(const dy of [-5,4])R(x+1,y+dy,14,1,P.steelDk);for(const dy of [-10,-1,8])R(x+6,y+dy,4,1,P.steelDk);
  for(const [dx,dy,rr,col] of [[8,-19,6,P.o],[5,-22,4,P.o],[11,-23,4,P.o],[8,-19,5,P.plantDk],[5,-22,3,P.plant],[11,-23,3,P.plantLt]])disc(x+dx,y+dy,rr,col);R(x+5,y-16,6,2,P.pot);}
function meetingRoom(P){ // cols 13-16, rows 7-8: a glass box (neukkari = meeting room) with a table, a wall screen and a door at the front
  R(207,101,66,44,P.o);R(208,102,64,42,P.carpetLt);R(208,102,64,10,P.wallDk);R(225,103,30,8,P.o);R(226,104,28,6,P.screen);
  for(const x of [228,240,250]){R(x,114,5,4,P.o);R(x+1,115,3,2,P.steelDk);R(x,132,5,4,P.o);R(x+1,133,3,2,P.steelDk);}
  R(222,118,36,13,P.o);R(223,119,34,8,P.desk);R(223,119,34,1,P.deskLt);R(223,127,34,3,P.deskDk);R(236,121,8,3,P.paper);
  G.globalAlpha=.3;R(208,102,64,42,P.glass);G.globalAlpha=.5;for(const [x,y,l] of [[212,126,6],[256,112,10],[262,118,6]])for(let i=0;i<l;i++)R(x+i,y-i,1,1,P.glassLt);G.globalAlpha=1;
  for(const x of [208,229,250,271])R(x,102,1,42,P.steelLt);R(208,102,64,1,P.steelLt);R(208,136,64,1,P.steelLt);R(208,143,64,1,P.steelDk);
  [[211,114,0],[215,114,1],[219,115,2],[223,114,3],[211,119,1],[216,120,0],[220,120,3],[212,124,2]].forEach(([x,y,k])=>R(x,y,3,3,['#f8d040','#f0a0c8','#9dbb6c','#5ad8f8'][k])); // the sprint board lives on the glass
  R(255,128,14,16,P.o);R(256,129,12,15,P.glass);R(256,129,12,1,P.glassLt);R(257,136,2,3,P.steelLt);txt('NEUKKARI',232,137,P.o,1,'c');}
function kitchenette(P){ // cols 13-15, row 2: counter, coffee machine, microwave, sink, a fruit bowl and two mugs
  R(207,33,50,16,P.o);R(208,34,48,7,P.counter);R(208,34,48,1,'#ffffff');R(208,41,48,7,P.counterDk);for(const x of [224,240])R(x,42,1,6,P.steelDk);
  R(213,19,13,16,P.o);R(214,20,11,14,'#2a2a34');R(216,22,7,3,P.steelDk);R(217,28,5,5,P.o);R(218,29,3,3,P.paper);
  R(229,23,15,12,P.o);R(230,24,13,10,P.steel);R(231,25,8,8,P.screen);R(241,26,1,1,P.red);
  R(246,31,9,4,P.o);R(247,32,7,2,P.steelLt);R(250,27,2,5,P.steelLt);R(250,27,4,1,P.steelLt);
  R(208,36,5,3,P.steelDk);R(209,35,2,2,'#f8d040');R(211,35,1,1,P.red);R(232,37,2,3,'#e04a3a');R(236,37,2,3,'#5ad8f8');}
function highTable(P){ // cols 10-11, row 2: a standing table with two bar stools, for coffee and gossip
  for(const x of [162,186]){R(x-1,39,7,3,P.o);R(x,40,5,1,P.sofa);R(x+1,42,3,6,P.o);R(x+2,42,1,5,P.steelLt);R(x,45,5,1,P.o);}
  R(174,36,4,11,P.o);R(175,36,2,10,P.steelDk);R(170,46,12,2,P.o);R(171,46,10,1,P.steelDk);
  R(165,32,22,5,P.o);R(166,33,20,2,P.counter);R(166,33,20,1,'#ffffff');R(166,35,20,1,P.counterDk);mug(169,29,'#e04a3a');mug(180,29,'#5ad8f8');}
function waterCooler(P){ // col 12, row 2 (a bubble rises in dynL7)
  R(195,34,10,14,P.o);R(196,35,8,12,P.counter);R(196,35,8,1,'#ffffff');R(196,44,8,3,P.counterDk);R(198,38,1,2,'#3a8af0');R(201,38,1,2,P.red);R(197,41,6,1,P.steelDk);
  R(196,23,8,12,P.o);R(197,24,6,10,'#5aa8e0');R(197,24,1,10,'#b4dcf4');R(198,24,5,1,'#b4dcf4');}
function printer(P){ // col 1, row 7: the copier (its error light blinks in dynL7)
  R(17,104,14,24,P.o);R(18,105,12,22,P.counter);R(18,105,12,3,P.counterDk);R(18,105,12,1,'#ffffff');R(19,110,7,3,P.screen);R(20,111,3,1,'#5ad8f8');
  R(18,115,12,3,P.o);R(20,114,8,2,P.paper);R(18,120,12,1,P.counterDk);R(18,124,12,1,P.counterDk);R(23,121,2,1,P.steelDk);R(23,125,2,1,P.steelDk);}
function phoneBooth(bx,felt,busy,P){ // one tile: a soundproof pod with a glass door (the light over the door is drawn in dynL7)
  R(bx,114,16,30,P.o);R(bx+1,115,14,28,P.pod);R(bx+1,115,14,1,'#ffffff');R(bx+14,116,1,25,P.podDk);R(bx+1,141,14,2,P.podDk);
  R(bx+3,119,10,22,P.o);R(bx+4,120,8,20,felt);R(bx+4,120,8,2,mix(felt,'#000000',.35));R(bx+4,132,8,1,P.deskLt);R(bx+4,133,8,7,mix(felt,'#000000',.45));
  if(busy){R(bx+6,122,4,2,'#4a3a2a');R(bx+6,124,4,3,'#f2c49a');R(bx+5,127,6,5,'#e8e4dc');R(bx+7,127,2,3,P.red);R(bx+10,123,1,4,P.o);}           // the colleague who never came out
  G.globalAlpha=.2;R(bx+4,120,8,20,P.glassLt);G.globalAlpha=.6;for(let i=0;i<4;i++)R(bx+5+i,137-i,1,1,'#ffffff');G.globalAlpha=1;R(bx+11,129,1,4,P.steelLt);
  R(bx+5,116,6,2,P.o);}
function arcade(P){ // col 1, row 11: somebody wheeled in an arcade cabinet (its screen is animated in dynL7)
  R(17,158,14,34,P.o);R(18,159,12,32,P.cab);R(18,159,1,32,P.cabLt);
  R(18,159,12,5,MEGA.gold);R(19,160,10,3,MEGA.pink);for(const x of [20,23,26])R(x,161,2,1,'#ffffff');R(19,165,10,10,P.o);R(20,166,8,8,'#0a0a14');
  R(18,176,12,4,P.o);R(18,176,12,2,'#2a2a34');R(21,174,1,3,P.steelLt);R(20,173,3,2,P.red);R(25,177,1,1,MEGA.gold);R(27,177,1,1,MEGA.cyan);
  for(let y=181;y<189;y+=3){R(19,y,2,1,MEGA.pink);R(27,y,2,1,MEGA.cyan);}R(22,182,4,6,P.o);R(23,183,2,2,'#f8c840');R(18,189,12,2,mix(P.cab,'#000000',.4));}
function foosball(P){const x0=48; // cols 3-4, row 11: table football, red against blue
  for(const x of [x0+3,x0+26]){R(x,186,3,6,P.o);R(x+1,186,1,5,P.deskDk);}
  R(x0+1,173,30,15,P.o);R(x0+2,174,28,10,P.desk);R(x0+2,174,28,1,P.deskLt);R(x0+2,184,28,3,P.deskDk);R(x0+4,176,24,6,'#2e8a4a');R(x0+15,176,1,6,'#bfe8c8');R(x0+4,178,1,2,'#f2f2f2');R(x0+27,178,1,2,'#f2f2f2');
  [7,12,19,24].forEach((dx,i)=>{const x=x0+dx;R(x,172,1,15,P.steelLt);R(x-1,170,3,3,P.o);R(x-1,185,3,3,P.o);const col=i%2?'#3a8af0':'#e04a3a';R(x-1,177,3,2,col);R(x-1,180,3,2,col);});R(x0+17,179,1,1,'#ffffff');}
function officePlant(c,r,P){const x=c*16+8,y=r*16;R(x-6,y+5,12,11,P.o);R(x-5,y+6,10,9,P.pot);R(x-5,y+6,10,2,mix(P.pot,'#ffffff',.25));
  const lv=[[0,-1,7,P.plantDk],[-5,-7,5,P.plant],[5,-9,5,P.plantLt],[0,-14,5,P.plant],[-3,-19,3,P.plantLt]];
  for(const [dx,dy,rr] of lv)disc(x+dx,y+dy,rr+1,P.o);for(const [dx,dy,rr,col] of lv)disc(x+dx,y+dy,rr,col);}
function sofa(P){const x=240,y=160; // cols 15-16, row 10: the back of the lounge
  R(x,y-5,32,21,P.o);R(x+1,y-4,30,9,P.sofa);R(x+1,y-4,30,1,P.sofaLt);R(x+5,y+5,22,1,P.sofaDk);R(x+5,y+6,22,6,P.sofaLt);R(x+16,y+6,1,6,P.sofa);R(x+1,y+12,30,3,P.sofaDk);
  for(const ax of [x+1,x+27]){R(ax,y+2,4,10,P.sofa);R(ax,y+2,4,1,P.sofaLt);R(ax+(ax>x+8?0:3),y+3,1,9,P.sofaDk);}
  R(x+6,y+1,5,5,P.rugLt);R(x+6,y+1,5,1,mix(P.rugLt,'#ffffff',.3));R(x+21,y+1,5,5,MEGA.gold);R(x+21,y+1,5,1,'#fff6c0');}                 // two cushions
function floorLamp(P){ // col 17, row 10
  ell(280,174,5,2,P.o);ell(280,174,4,1,P.steelDk);R(279,151,3,23,P.o);R(280,151,1,22,P.steelLt);R(274,141,13,11,P.o);R(275,142,11,9,'#f8e0a0');R(275,142,11,1,'#fff6d8');R(275,149,11,2,'#e0b870');}
function coffeeTable(P){ // cols 15-16, row 11: a low table with the magazines nobody reads
  R(243,187,3,5,P.o);R(266,187,3,5,P.o);R(241,179,30,10,P.o);R(242,180,28,5,P.deskLt);R(242,180,28,1,'#e8c898');R(242,185,28,3,P.deskDk);
  R(246,180,7,4,P.o);R(247,181,5,2,'#e05a8a');R(251,182,6,4,P.o);R(252,183,4,2,'#3ac0d0');mug(262,179,MEGA.gold);}
function beanBag(cx,col,P){ell(cx,186,7,6,P.o);ell(cx,186,6,5,col);ell(cx-1,183,3,2,mix(col,'#ffffff',.3));R(cx-3,188,7,1,mix(col,'#000000',.3));R(cx,179,1,2,P.o);} // row 11
function L7objs(P){
  return [{r:2,d:()=>kitchenette(P)},{r:2,d:()=>highTable(P)},{r:2,d:()=>waterCooler(P)},{r:4,d:()=>cabinet(P)},{r:7,d:()=>printer(P)},{r:8,d:()=>meetingRoom(P)},
   {r:8,d:()=>{phoneBooth(176,P.felt1,true,P);phoneBooth(192,P.felt2,false,P);}},
   {r:10,d:()=>sofa(P)},{r:10,d:()=>floorLamp(P)},{r:11,d:()=>coffeeTable(P)},{r:11,d:()=>{beanBag(232,P.bag1,P);beanBag(280,P.bag2,P);}},
   {r:11,d:()=>arcade(P)},{r:11,d:()=>foosball(P)},{r:11,d:()=>officePlant(2,11,P)},
   ...L7DESKS.map(([c,r],i)=>({r,d:()=>desk(c,r,P,i)}))];
}
function paintL7(P){
  const [b,bx]=mk(320,224),[f,fx]=mk(320,224);G=bx;const rnd=rng(707);
  // carpet tiles and the mat at the front door
  for(let y=32;y<208;y+=16)for(let x=16;x<304;x+=16){const v=rnd();R(x,y,16,16,P.seam);R(x,y,15,15,v<.4?P.carpet:v<.8?P.carpetLt:P.carpetDk);}
  for(let i=0;i<140;i++)R(18+rnd()*284|0,34+rnd()*172|0,1,1,rnd()<.5?P.carpetLt:P.carpetDk);
  R(138,198,44,10,P.o);R(139,199,42,9,P.mat);for(let x=141;x<180;x+=3)R(x,200,1,7,P.carpetDk);
  // the game corner stands on fake grass, the lounge on a rug
  R(16,166,70,38,P.turf);for(let i=0;i<90;i++)R(17+rnd()*68|0,167+rnd()*36|0,1,2,rnd()<.6?P.turfLt:P.plantDk);R(18,168,66,1,P.turfLt);R(18,201,66,1,P.turfLt);R(18,168,1,34,P.turfLt);R(83,168,1,34,P.turfLt);
  R(220,152,76,48,P.rug);R(222,154,72,44,P.rugLt);R(224,156,68,40,P.rug);for(let x=226;x<290;x+=8){R(x,159,4,1,P.rugTrim);R(x+4,160,4,1,P.rugTrim);R(x,192,4,1,P.rugTrim);R(x+4,191,4,1,P.rugTrim);}
  for(let y=153;y<200;y+=2){R(218,y,2,1,P.rugTrim);R(296,y,2,1,P.rugTrim);}
  // things on the floor: printouts by the copier, a paper plane, a dropped sticky note, a coffee stain
  for(const [x,y] of [[35,120],[42,125]]){R(x,y,5,4,P.paper);R(x+1,y+1,3,1,P.steel);}R(118,151,5,1,P.paper);R(119,150,3,1,P.paper);R(120,149,1,1,P.paper);R(151,121,2,2,'#f8d040');
  G.globalAlpha=.35;ell(228,57,3,2,'#3a2416');G.globalAlpha=1;
  // back wall: lifts, the logo wall, the clock (digits are animated), a chart that only goes down, the HR door
  R(0,0,320,32,P.wall);R(0,0,320,2,P.wallDk);for(let x=8;x<320;x+=44)R(x,2,1,26,P.wallDk);R(0,28,320,3,P.skirt);R(0,31,320,1,P.o);
  R(21,3,40,28,P.o);R(22,4,38,26,P.steelDk);for(const x of [24,42]){R(x,9,16,21,P.o);R(x+1,10,14,20,P.steel);R(x+1,10,14,1,P.steelLt);R(x+7,10,1,20,P.steelDk);}
  R(34,4,14,5,P.o);logoWall(P);
  R(175,7,36,13,P.o);R(176,8,34,11,'#0a0a0e');
  R(228,3,28,16,P.o);R(229,4,26,14,P.paper);for(let i=0;i<6;i++)R(231+i*4,6+i*2,4,1,P.red);R(231,16,22,1,P.steelDk);R(231,5,1,12,P.steelDk);
  R(269,3,30,29,P.o);R(270,4,28,27,P.door);R(270,4,28,1,P.doorLt);R(274,7,20,10,P.o);R(275,8,18,8,P.paper);txt('HR',284,9,P.red,1,'c');R(294,20,2,3,P.steelLt);
  // side walls: posters on the left (the logo, a motivational sunrise, the evacuation plan), tall windows with the night skyline on the right
  R(0,32,16,176,P.wallDk);R(15,32,1,176,P.o);for(const y of [52,104,156])R(3,y,10,16,P.o);
  R(4,53,8,14,MEGA.plate);megaMark(4,56,5);R(5,63,6,1,'#c8d0f8');R(6,65,4,1,'#c8d0f8');
  R(4,105,8,14,'#f8d890');disc(8,110,2,'#f08030');for(let k=0;k<4;k++)R(8-k,113+k,2*k+1,1,'#3a8a5a');R(4,117,8,2,'#2e6e46');
  R(4,157,8,14,P.paper);R(5,158,6,1,P.steel);R(5,161,3,4,'#9dbb6c');R(8,163,3,1,P.red);R(10,163,1,5,P.red);R(9,167,3,1,P.red);R(5,169,6,1,P.steel);
  R(304,32,16,176,P.o);for(let k=0,y=34;y<206;y+=29,k++){R(306,y,13,26,'#101830');R(306,y+16,5,10,'#080e20');R(312,y+11,7,15,'#0a1226');
    for(let j=0;j<6;j++)R(307+rnd()*11|0,y+13+rnd()*12|0,1,1,rnd()<.5?'#f8d880':'#5ad8f8');for(let j=0;j<3;j++)R(306+rnd()*13|0,y+2+rnd()*8|0,1,1,'#8a9ac8');R(306,y,13,1,'#2a3a5a');
    if(k===2)for(let yy=y+1;yy<y+15;yy+=2)R(306,yy,13,1,'#9a9ea8');}                                                                // somebody left the blinds half down
  // front wall: the glass doors (animated), EXIT sign and the badge reader
  R(0,208,320,16,P.wallDk);R(0,208,320,2,P.wallLt);R(0,210,320,1,P.skirt);
  R(107,211,30,10,P.o);R(108,212,28,8,'#2a8a4a');txt('EXIT',122,212,'#e8ffe8',1,'c');
  R(143,208,34,16,P.o);R(180,211,6,10,P.o);R(181,212,4,8,'#2a2a34');
  const objs=L7objs(P);objs.forEach(o=>o.d());
  G=fx;objs.forEach(o=>{fx.save();fx.beginPath();fx.rect(0,0,320,o.r*16+4);fx.clip();o.d();fx.restore();});
  G=ctx;return {bg:b,fg:f};
}
function dynL7(d,layer){const o=L&&L.office,open=L&&L.open,P=N7;
  if(layer==='over'){ // screens and little lights sit on foreground copies; invites fly above everything
    L7DESKS.forEach(([c,r],i)=>{const x=c*16+10,y=r*16-8-deskUp(i),k=Math.floor(S.clock*2+i*1.3);R(x,y,12,8,i%3===2?'#16303a':'#1a2a44');
      if(i%3===0)for(let j=0;j<3;j++)R(x+1,y+1+j*2,3+((k+j*3)%7),1,j===k%3?'#f8c840':'#5ad8f8');                    // a spreadsheet
      else if(i%3===1)for(let j=0;j<3;j++)R(x+1+((j+k)%2)*4,y+1+j*2,6,1,(j+k)%2?'#9dbb6c':'#f2f2f2');              // a chat that never stops
      else R(x+1+(k*3)%9,y+1+(k*2)%5,2,2,'#f0a0c8');                                                               // a screensaver
      if(Math.floor(S.clock*1.5+i)%7===0)R(x+10,y,2,2,'#e04a3a');});                                               // a new notification
    R(226,104,28,6,'#1a2a44');for(let j=0;j<5;j++)R(229+j*5,109-((Math.floor(S.clock)+j*2)%4),3,1+((Math.floor(S.clock)+j*2)%4),'#5ad8f8');
    R(182,117,4,1,Math.floor(S.clock*1.5)%2?'#f04a3a':'#7a1e18');R(198,117,4,1,'#5cf07c');                           // phone booths: one is always taken
    R(27,110,2,2,Math.floor(S.clock*3)%2?'#f8a030':'#5a3a14');                                                      // the copier: paper jam
    {const k=Math.floor(S.clock*4);R(20,166,8,8,'#0a0a14');if(k%8<5)R(21,166,6,1,MEGA.gold);                        // the arcade's attract mode: a zombie chases a red-haired dot
      R(20+(k*3)%7,168+(k*5)%5,2,2,'#e04a3a');R(20+(k*3+4)%7,168+(k*5+2)%5,2,2,'#9dbb6c');}
    {const t=(S.clock*.6)%4;if(t<1)R(199+Math.round(Math.sin(t*9)),32-Math.round(t*7),1,1,'#e8f6ff');}              // a bubble in the water cooler
    if(o)for(const m of o.invites){const x=Math.round(m.x),y=Math.round(m.y)-10+Math.round(Math.sin(m.age*14));ell(x,Math.round(m.y),4,1,'rgba(10,6,20,.4)');
      R(x-5,y-3,10,7,P.o);R(x-4,y-2,8,5,P.paper);R(x-4,y-2,8,1,'#5ad8f8');R(x-1,y,2,2,'#5ad8f8');}
    return;}
  {const ph=S.clock%7;if(ph<1.2){const k=Math.floor(ph*12);glyphs(G,'MEGA',95,4,MEGA.grad.map((_,i)=>MEGA.grad[(i+k)%7]),2);} // the wordmark shimmers, then the peak twinkles
    else if(ph<1.6){R(76,5,1,5,'#ffffff');R(74,7,5,1,'#ffffff');}}
  {const u=(S.clock/44)%1,t=u<.5?u*2:2-u*2,x=Math.round(26+t*266);ell(x,91,6,3,P.o);ell(x,90,5,2,'#c8ccd4');R(x-3,89,6,1,'#eef0f4');R(x-1,90,3,1,'#6a6e7a');   // the robot vacuum does its rounds
    R(x+(u<.5?4:-4),90,1,1,Math.floor(S.clock*2)%2?'#5cf07c':'#1e5a2a');}
  const t=L?Math.min(1,L.time/L.d.night):0,mins=Math.floor(t*360),hh=Math.floor(mins/60);
  txt((hh===0?12:hh)+':'+pad(mins%60,2),193,10,t>=1?'#9dbb6c':'#f86a3a',1,'c');
  for(let j=0;j<3;j++)R(36+j*4,5,2,2,Math.floor(S.clock*1.2)%3===j?'#f8c840':'#3a3440');                           // the lift is always on another floor
  R(222,21,2,1,Math.floor(S.clock*2)%2?'#e04a3a':'#5a1a14');                                                       // coffee machine: descaling, as always
  if(o&&o.warn){const lift=o.warn.x<160,[x,y,w,h]=lift?[21,3,40,28]:[269,3,30,29],on=Math.floor(S.clock*6)%2;      // HR is on her way through this door
    if(on){R(x-2,y-2,w+4,2,'#e04a3a');R(x-2,y+h,w+4,2,'#e04a3a');R(x-2,y,2,h,'#e04a3a');R(x+w,y,2,h,'#e04a3a');}
    ell(o.warn.x,o.warn.y,12+on,4,'rgba(224,74,58,.45)');txtO('HR',o.warn.x,o.warn.y-7,'#e04a3a',1,'c','#140a14');}
  if(!open){R(144,209,32,15,'#22364a');R(144,209,32,1,'#4a6a88');R(159,209,2,15,P.o);R(148,212,1,9,'#3a5672');R(171,212,1,9,'#3a5672');
    R(182,213,2,2,Math.floor(S.clock*2)%2?'#f04a3a':'#5a1a14');txt('6:00',160,201,'#f8c840',1,'c','#140a14');}
  else{R(144,209,32,15,'#fff0b0');R(144,209,5,15,'#22364a');R(171,209,5,15,'#22364a');R(182,213,2,2,'#5cf07c');
    if(Math.floor(S.clock*3)%2){R(158,194,4,6,'#ffe066');R(155,200,10,2,'#ffe066');R(157,202,6,2,'#ffe066');R(159,204,2,1,'#ffe066');}}
}

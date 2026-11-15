"use strict";
/* Level 3: a Finnish forest. Spruce and birch around a mossy clearing, a lake with a jetty, a rowing boat and a fishing rod,
   a lean-to (laavu) with a campfire and a coffee pot, a glacial boulder, duckboards over the bog to the exit.
   Night + misty morning palettes. Animated: the fire, glints and fish jumping on the lake, the float, an owl on the
   lean-to roof and a fox crossing the clearing at night, the mosquito swarm at the exit.
   Reading the ground: anything with a trunk, a dark outline or water blocks the way. Everything flat (berries, ferns,
   mushrooms) is only decoration. The few trees inside the clearing stand on a patch of bare earth. */
const L3MAP=["####################","####################","#~~~~~~...b..LLL...#","#~~~~~~......LLL..##","#~~~p~~............#","##~~p~~......lF....#","#..................#",
  "#..T.....oo........#","#........oo........#","#....b.........b...#","##.................#","#............T....##","##.................#","#########DD#########"];
const L3SPRUCE=[[3,7],[13,11]],L3BIRCH=[[10,2],[5,9],[15,9]]; // the trees inside the clearing (T and b on the map)
const N3={out:'#0e1a20',out2:'#122228',floor:'#26383e',floorDk:'#1f2f35',floorLt:'#30464a',moss:'#2a4a40',mossLt:'#35584a',needle:'#3c3a36',
 bog:'#1a282a',bogLt:'#2a4236',sphag:'#3e5a3a',cotton:'#c8ccd8',bush:'#1c3a34',bushLt:'#28503f',berry:'#5a6ac8',lingon:'#b03a3a',chant:'#c0a040',agaric:'#b0343a',spot:'#d8d0c8',fern:'#2a503e',fernLt:'#3a6a4e',
 spruce:'#122a2c',spruceLt:'#1c3c3a',spruceDk:'#0a1a1e',trunk:'#3a2c2c',trunkLt:'#5a4642',spruceIn:'#1c4038',spruceInLt:'#2e5e4e',root:'#3c3632',rootDk:'#2a2826',
 birch:'#a8b0c0',birchMk:'#262630',leaf:'#24483e',leafLt:'#32604e',leafDk:'#183630',
 water:'#13284a',waterLt:'#1e3c66',waterDk:'#0e1e38',shine:'#9ab0e0',shore:'#3a4648',reed:'#2e4a3a',lily:'#2a5a3a',lilyDk:'#1a3a2a',cat:'#4a342a',
 rock:'#4a5262',rockLt:'#646c7e',rockDk:'#30363f',lichen:'#6a7060',
 wood:'#4e3c3e',woodLt:'#6a5254',woodDk:'#33262a',roof:'#3a3446',roofLt:'#4c4660',roofDk:'#2a2636',pad:'#2a3e5a',inside:'#0a080c',o:'#0a1216',
 pack:'#8a3a2a',packLt:'#a85a3a',pot:'#24242a',potLt:'#55555f',rope:'#8a8068',fox:'#a8582c',owl:'#5e5448',owlLt:'#8a7e6c'};
const D3={out:'#1e3a28',out2:'#24442e',floor:'#5f7d3e',floorDk:'#4f6c34',floorLt:'#76944a',moss:'#6a9a3e',mossLt:'#86b450',needle:'#9a7a4a',
 bog:'#46563a',bogLt:'#728244',sphag:'#a8b04a',cotton:'#ffffff',bush:'#3a7a34',bushLt:'#5a9a44',berry:'#3a4ac8',lingon:'#e03a3a',chant:'#f2b030',agaric:'#e0342a',spot:'#ffffff',fern:'#4a8a3a',fernLt:'#6aaa4a',
 spruce:'#24543a',spruceLt:'#34704a',spruceDk:'#183c2a',trunk:'#5a3a2e',trunkLt:'#7e5642',spruceIn:'#2e6a44',spruceInLt:'#488e56',root:'#8a6c4a',rootDk:'#6c543a',
 birch:'#f2f0e6',birchMk:'#2a2a2a',leaf:'#5aa03e',leafLt:'#86c452',leafDk:'#3e7a32',
 water:'#3a78a8',waterLt:'#5a9ac8',waterDk:'#2e6290',shine:'#e8f4ff',shore:'#9a9070',reed:'#6a8a3a',lily:'#4a8a3a',lilyDk:'#2e6a2e',cat:'#7a4a2a',
 rock:'#8a8c94',rockLt:'#aaacb4',rockDk:'#686a74',lichen:'#b0b07a',
 wood:'#9a6a42',woodLt:'#bc8a5a',woodDk:'#6a4428',roof:'#7a5a4a',roofLt:'#9a7a62',roofDk:'#5a3e34',pad:'#3a6ac0',inside:'#2a2020',o:'#1a1612',
 pack:'#c84a2a',packLt:'#e87a4a',pot:'#2a2a30',potLt:'#7a7a86',rope:'#d8c8a0',fox:'#d8702a',owl:'#8a7a68',owlLt:'#b0a088'};
const L3at=(c,r)=>c<0||r<0||c>=COLS||r>=ROWS?'#':L3MAP[r][c];
function geoL3(){
  const solid=L3MAP.map(r=>[...r].map(ch=>!(ch==='.'||ch==='p')));
  const rnd=rng(303),trees=[],mott=[],deco=[],boards=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){if(L3MAP[r][c]!=='#')continue;
    const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([dc,dr])=>L3at(c+dc,r+dr)!=='#');
    if((edge&&rnd()<.92)||rnd()<.4)trees.push({x:c*16+8+Math.round((rnd()-.5)*6),by:r*16+14+Math.round(rnd()*2),h:24+Math.floor(rnd()*12),r,b:rnd()<.16});
    for(let k=0;k<2;k++)mott.push([c*16+rnd()*16,r*16+rnd()*16,3+rnd()*5]);}
  // ground plants: fewer than before, each one big enough to tell what it is
  for(let k=0;k<600&&deco.length<52;k++){const x=20+rnd()*280,y=24+rnd()*184,c=x/16|0,r=y/16|0;if(L3at(c,r)!=='.'||L3at((x+4)/16|0,r)!=='.'||L3at((x-4)/16|0,r)!=='.')continue;
    if(Math.abs(x-160)<18&&y>136)continue;if(deco.some(([dx,dy])=>Math.abs(dx-x)<10&&Math.abs(dy-y)<7))continue;
    const v=rnd();deco.push([x|0,y|0,v<.32?0:v<.52?1:v<.68?2:v<.88?3:4]);}   // blueberry, fern, chanterelles, lingonberry, fly agaric
  for(let y=216,i=0;y>142;y-=12,i++)boards.push([160+Math.round(Math.sin(i*.9)*3),y]);
  return {solid,trees,mott,deco,boards};
}
/* lift > 0 raises the branches to show a proper trunk and its shadow: used for the trees you can bump into inside the clearing */
function spruce(x,by,h,P,lift){lift=lift||0;const b0=by-lift,tiers=4,tier=t=>[b0-3-h+Math.round(t*h/(tiers+.6)),Math.round(h/(tiers-.8)),2+Math.round(t*1.8)];
  if(lift){ell(x,by,7,2,'rgba(0,0,0,.3)');R(x-2,b0-4,5,lift+5,P.o);R(x-1,b0-4,3,lift+4,P.trunk);R(x-1,b0-4,1,lift+4,P.trunkLt);R(x-3,by-1,7,2,P.o);R(x-2,by-1,5,1,P.trunk);}
  else{R(x-1,by-3,3,4,P.o);R(x,by-3,1,3,P.trunk);}
  for(let t=0;t<tiers;t++){const [top,th,mw]=tier(t);for(let yy=0;yy<th;yy++){const w=Math.round((yy+1)/th*mw);R(x-w-1,top+yy,2*w+3,1,P.o);}}
  R(x,b0-4-h,1,1,P.o);
  for(let t=0;t<tiers;t++){const [top,th,mw]=tier(t);for(let yy=0;yy<th;yy++){const w=Math.round((yy+1)/th*mw);
    R(x-w,top+yy,2*w+1,1,P.spruce);R(x-w,top+yy,Math.max(1,w>>1),1,P.spruceLt);if(yy===th-1){R(x-w,top+yy,2*w+1,1,P.spruceDk);R(x-w-1,top+yy-1,1,2,P.spruceDk);R(x+w+1,top+yy-1,1,2,P.spruceDk);}}}
}
function birch(x,by,P){
  ell(x,by,6,2,'rgba(0,0,0,.25)');R(x-2,by-17,5,18,P.o);R(x-1,by-17,3,17,P.birch);
  R(x-1,by-13,2,1,P.birchMk);R(x,by-9,2,1,P.birchMk);R(x-1,by-5,1,1,P.birchMk);R(x+1,by-15,1,1,P.birchMk);R(x-1,by-2,3,1,P.birchMk);
  disc(x,by-23,9,P.o);disc(x-6,by-19,4,P.o);disc(x+6,by-18,4,P.o);
  disc(x,by-23,8,P.leafDk);disc(x-1,by-25,7,P.leaf);disc(x-6,by-19,3,P.leaf);disc(x+6,by-18,3,P.leafDk);disc(x-3,by-28,3,P.leafLt);disc(x+3,by-29,2,P.leafLt);
  R(x-8,by-17,1,4,P.leafDk);R(x+8,by-16,1,5,P.leafDk);R(x-4,by-14,1,3,P.leaf);
}
function line3(x1,y1,x2,y2,col){const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));for(let k=0;k<=n;k++)R(Math.round(x1+(x2-x1)*k/n),Math.round(y1+(y2-y1)*k/n),1,1,col);}
function oval(cx,cy,rx,ry,col){const n=Math.max(10,Math.round((rx+ry)*3));for(let k=0;k<n;k++){const a=k/n*Math.PI*2;R(Math.round(cx+Math.cos(a)*rx),Math.round(cy+Math.sin(a)*ry),1,1,col);}}
function laavu(P){ // lean-to on cols 13-15, rows 2-3: a plank roof sloping up to the back, open front with a raised floor
  R(205,19,54,29,P.o);R(206,20,52,27,P.roof);
  for(let x=210;x<258;x+=5)R(x,22,1,24,P.roofDk);                                                                    // planks running down the slope
  for(const [x,y,w] of [[208,26,1],[221,37,1],[233,29,1],[247,40,1],[253,24,1]])R(x+1,y,w,1,P.roofLt);              // knots in the planks
  R(206,20,52,2,P.roofLt);R(206,22,52,1,P.roofDk);
  for(const [x,y,r] of [[214,40,3],[217,42,2],[251,27,2]]){disc(x,y,r,P.moss);R(x-1,y-1,1,1,P.mossLt);}             // moss on the old roof
  for(const wx of [205,250]){R(wx,46,9,18,P.o);R(wx+1,46,7,17,P.wood);for(let y=49;y<63;y+=4)R(wx+1,y,7,1,P.woodDk);}
  R(213,46,37,10,P.inside);
  for(const [x,y] of [[216,50],[216,54],[219,52]]){disc(x,y,2,P.o);disc(x,y,1.4,P.woodLt);R(x,y,1,1,P.woodDk);}      // firewood stacked by the wall
  R(222,50,15,6,P.o);R(223,51,13,4,P.pad);R(223,51,13,1,mix(P.pad,'#ffffff',.3));R(223,51,4,4,mix(P.pad,'#000000',.3));R(227,53,9,1,mix(P.pad,'#ffffff',.2)); // a sleeping bag, hood on the left
  R(239,46,9,10,P.o);R(240,47,7,8,P.pack);R(240,47,7,3,P.packLt);R(240,50,7,1,P.o);R(241,52,5,2,P.packLt);R(243,51,1,1,P.o);R(240,48,1,1,P.o);R(246,48,1,1,P.o); // a rucksack with its flap
  R(213,55,37,8,P.o);R(214,56,35,6,P.wood);for(let x=216;x<248;x+=5)R(x,56,1,6,P.woodDk);R(214,56,35,1,P.woodLt);
  R(204,45,56,3,P.o);R(205,46,54,1,P.woodLt);
}
function logBench(P){ // col 13, row 5: a log lying by the fire to sit on, its sawn end towards the fire
  ell(215,94,9,2,'rgba(0,0,0,.3)');R(208,85,14,9,P.o);R(209,86,12,7,P.wood);R(209,86,12,2,P.woodLt);R(209,92,12,1,P.woodDk);
  for(const [x,y] of [[211,89],[215,90],[218,88]])R(x,y,2,1,P.woodDk);R(213,87,1,1,P.woodDk);
  ell(221,89,3,4.5,P.o);ell(221,89,2,3.5,P.woodLt);oval(221,89,1,2,P.wood);R(221,89,1,1,P.woodDk);                     // the sawn end with its rings
}
function boulder(P){ // glacial erratic on cols 9-10, rows 7-8
  ell(160,141,18,4,'rgba(0,0,0,.3)');ell(160,128,17,14,P.o);ell(160,128,16,13,P.rock);ell(163,133,13,8,P.rockDk);ell(158,126,13,9,P.rock);ell(154,122,8,6,P.rockLt);
  ell(159,119,10,4,P.moss);ell(157,118,7,2,P.mossLt);R(168,126,1,5,P.rockDk);R(167,131,1,3,P.rockDk);R(150,133,4,1,P.rockDk);
  R(152,128,1,1,P.lichen);R(170,121,2,1,P.lichen);R(146,124,1,1,P.lichen);R(164,138,2,1,P.lichen);
}
function rowBoat(P){ // in the lake by the jetty (cols 1-3, row 3): a wooden rowing boat, two seats, oars resting in the water, tied to the jetty
  const x0=26,cy=58,n=32,hw=i=>{const t=i/n;return t<.55?Math.round(4+2*t/.55):Math.round(6*Math.sqrt(Math.max(0,1-((t-.55)/.45)**2)));};
  ell(x0+16,cy+2,18,6,P.waterDk);
  for(const s of [-1,1]){const y0=cy+s*7;line3(x0+15,y0,x0+6,y0+s*4,P.o);line3(x0+15,y0-s,x0+7,y0+s*3,P.woodLt);       // oars from the rowlocks
    R(x0+1,y0+s*4-1,6,3,P.o);R(x0+2,y0+s*4,4,1,P.woodLt);}
  for(let i=0;i<=n;i++){const h=hw(i);R(x0+i,cy-h-1,1,2*h+3,P.o);}R(x0-1,cy-hw(0),1,2*hw(0)+1,P.o);R(x0+n+1,cy,1,1,P.o);
  for(let i=0;i<=n;i++){const h=hw(i);R(x0+i,cy-h,1,2*h+1,P.woodLt);if(h>=2&&i>0)R(x0+i,cy-h+1,1,2*h-1,P.woodDk);}
  for(let i=4;i<n-6;i+=3)R(x0+i,cy,2,1,mix(P.woodDk,P.o,.4));                                                          // floorboards
  for(const i of [2,11,21]){const h=hw(i)-1;R(x0+i,cy-h,3,2*h+1,P.wood);R(x0+i,cy-h,1,2*h+1,P.woodLt);}                  // stern seat and two thwarts
  for(const s of [-1,1])R(x0+15,cy+s*(hw(15)+1),2,1,P.rockLt);                                                       // rowlocks
  line3(x0+n+1,cy,63,62,P.rope);                                                                                       // the painter, tied to a jetty post
}
function lilyPad(x,y,P,flower){ell(x,y,4,2,P.lilyDk);ell(x,y,3,1.5,P.lily);R(x+1,y-2,1,2,P.water);R(x+2,y-2,1,1,P.water);R(x-2,y-1,2,1,mix(P.lily,'#ffffff',.25));
  if(flower){R(x-2,y-2,3,1,P.cotton);R(x-1,y-3,1,3,P.cotton);R(x-1,y-2,1,1,P.chant);}}
function cattail(x,y,P,head){R(x-1,y-4,1,4,P.reed);R(x+2,y-3,1,3,P.reed);R(x+1,y-1,1,1,P.reed);R(x,y-9,1,9,P.reed);
  if(head){R(x-1,y-11,3,6,P.o);R(x,y-10,1,4,P.cat);R(x,y-13,1,2,P.reed);}else R(x,y-11,1,2,P.reed);}
function fishingRod(P){ // lying on the end of the jetty, pointing out over the water (its line and float are animated)
  line3(70,73,87,52,P.o);line3(71,73,87,53,P.woodDk);R(69,72,3,4,P.o);R(70,73,1,3,P.woodLt);R(72,69,3,3,P.o);R(73,70,1,1,P.rockLt);}
function coffeePot(P){ // a sooty kettle (nokipannu) on a stone at the edge of the fire
  R(239,81,7,1,P.o);R(239,82,1,2,P.o);R(245,82,1,2,P.o);                                                              // the bail handle
  R(238,84,9,8,P.o);R(239,85,7,6,P.pot);R(239,84,7,1,P.potLt);R(242,83,1,1,P.o);R(240,86,1,3,P.potLt);R(246,86,2,1,P.o);R(247,85,1,1,P.o);}
function L3objs(P){const PI=Object.assign({},P,{spruce:P.spruceIn,spruceLt:P.spruceInLt}); // a shade lighter than the forest wall behind them
  return [
   {r:3,d:()=>laavu(P)},
   {r:5,d:()=>logBench(P)},
   {r:8,d:()=>boulder(P)},
   ...L3SPRUCE.map(([c,r])=>({r,d:()=>spruce(c*16+8,r*16+15,31,PI,9)})),
   ...L3BIRCH.map(([c,r])=>({r,d:()=>birch(c*16+8,r*16+14,P)}))
  ];
}
function paintL3(geo,P){
  const [b,bx]=mk(320,224),[f,fx]=mk(320,224);G=bx;const rnd=rng(77);
  // forest floor: moss and needles
  R(0,0,320,224,P.floor);
  for(let i=0;i<70;i++)disc(16+rnd()*288,16+rnd()*196,3+rnd()*6,rnd()<.5?P.floorDk:P.moss);
  for(let i=0;i<30;i++)disc(16+rnd()*288,16+rnd()*196,2+rnd()*3,P.mossLt);
  for(let i=0;i<200;i++)R(16+rnd()*288|0,16+rnd()*196|0,1,1,rnd()<.6?P.needle:P.floorLt);
  // bog with cotton grass, and the duckboards (pitkospuut) up from the exit: two planks laid lengthwise on a crossbeam
  for(const [x,y] of geo.boards)ell(x,y,17,7,P.bog);
  for(const [x,y] of geo.boards){ell(x-11+((y*7)%22),y+2,4,2,P.bogLt);R(x+12-((y*3)%24),y-3,2,2,P.sphag);}
  geo.boards.forEach(([x,y],i)=>{if(i%3===1)return;const s=i%2?1:-1,tx=x+s*(9+(i*5)%6),ty=y-1+(i*7)%5;R(tx,ty-3,1,4,P.reed);R(tx+2,ty-2,1,3,P.reed);R(tx-1,ty-5,2,2,P.cotton);R(tx+2,ty-4,1,2,P.cotton);});
  for(const [x,y] of geo.boards){R(x-8,y+3,17,3,P.o);R(x-7,y+4,15,1,P.woodDk);}
  for(const [x,y] of geo.boards){R(x-5,y-7,11,14,P.o);for(const px of [x-4,x+1]){R(px,y-6,4,12,P.wood);R(px,y-6,4,1,P.woodLt);R(px,y-5,1,11,P.woodLt);}R(x-2,y-2,1,2,P.woodDk);R(x+3,y+1,1,2,P.woodDk);}
  // dark forest around the edge
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(L3MAP[r][c]==='#')R(c*16,r*16,16,16,P.out);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(L3MAP[r][c]==='#'&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dc,dr])=>'.Tbo'.includes(L3at(c+dc,r+dr))))disc(c*16+8,r*16+8,11,P.out);
  for(const [x,y,rr] of geo.mott)disc(x,y,rr,P.out2);
  // the lake
  const wt=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if('~p'.includes(L3MAP[r][c]))wt.push([c,r]);
  for(const [c,r] of wt)disc(c*16+8,r*16+8,13,P.shore);
  for(const [c,r] of wt)disc(c*16+8,r*16+8,11,P.water);
  for(const [c,r] of wt)if([[1,0],[-1,0],[0,1],[0,-1]].every(([dc,dr])=>'~p#'.includes(L3at(c+dc,r+dr))))R(c*16,r*16,16,16,P.water);
  for(let i=0;i<40;i++){const x=16+rnd()*96|0,y=32+rnd()*60|0;if(L3at(x>>4,y>>4)==='~'&&L3at((x+6)>>4,y>>4)==='~')R(x,y,3+rnd()*5|0,1,P.waterLt);}
  for(const [x,y,fl] of [[32,42,1],[88,47,0],[44,78,0],[94,74,1],[50,88,0]])lilyPad(x,y,P,fl);
  for(const [x,y,hd] of [[106,60,1],[109,84,1],[100,93,0],[30,98,1],[52,99,0],[90,98,1]])cattail(x,y,P,hd);
  ell(98,40,6,3,P.waterLt);ell(98,40,5,2,P.water);ell(98,39,4,3,P.o);ell(98,39,3,2,P.rock);R(96,38,2,1,P.rockLt);R(99,40,1,1,P.lichen); // a stone breaking the surface
  rowBoat(P);
  // jetty, with a fishing rod left on it
  R(65,58,14,42,P.o);R(66,59,12,40,P.wood);for(let y=62;y<99;y+=4)R(66,y,12,1,P.woodDk);R(66,59,12,1,P.woodLt);
  for(const [px,py] of [[63,62],[78,62],[63,90],[78,90]]){R(px,py,3,4,P.o);R(px+1,py,1,3,P.woodDk);}
  fishingRod(P);
  // fire ring (flames are animated) and the coffee pot on its stones
  for(let a=0;a<8;a++){const sx=232+Math.cos(a*Math.PI/4)*6,sy=89+Math.sin(a*Math.PI/4)*4;ell(sx,sy,2.5,2,P.o);ell(sx,sy,2,1.5,P.rock);}ell(232,89,4,2.5,'#1a1414');
  coffeePot(P);
  // ground plants
  for(const [x,y,k] of geo.deco){
    if(k===0||k===3){const lf=k?P.fern:P.bush,lt=k?P.fernLt:P.bushLt,be=k?P.lingon:P.berry;                         // a blueberry or lingonberry sprig
      R(x-3,y-1,7,2,lf);R(x-2,y-2,5,1,lt);R(x-1,y-3,1,1,lt);R(x+2,y-3,1,1,lt);R(x-4,y,1,1,lf);R(x+4,y,1,1,lf);
      R(x-2,y,1,1,be);R(x+1,y-1,1,1,be);R(x+2,y+1,1,1,be);if(k)R(x-1,y+1,1,1,be);}
    else if(k===1){for(const [dx,dy] of [[-5,-2],[-3,-5],[0,-6],[3,-5],[5,-2]])line3(x,y,x+dx,y+dy,P.fern);R(x-4,y-2,1,1,P.fernLt);R(x+4,y-2,1,1,P.fernLt);R(x,y-5,1,1,P.fernLt);} // a fern
    else if(k===2){const dk=mix(P.chant,'#000000',.3),lt=mix(P.chant,'#ffffff',.3);for(const [cx,cy,big] of [[x,y,1],[x+5,y+1,0]]){ // chanterelles: golden funnels
      if(big){R(cx-2,cy-4,5,1,lt);R(cx-2,cy-3,5,1,P.chant);R(cx-1,cy-2,3,1,dk);R(cx,cy-1,1,2,P.chant);}else{R(cx-1,cy-3,3,1,lt);R(cx-1,cy-2,3,1,dk);R(cx,cy-1,1,2,P.chant);}}}
    else{const ed=mix(P.agaric,'#000000',.5);R(x-2,y-5,5,1,ed);R(x-3,y-4,7,2,ed);R(x-2,y-4,5,1,P.agaric);R(x-3,y-3,7,1,P.agaric);R(x-1,y-4,1,1,P.spot);R(x+1,y-3,1,1,P.spot);R(x-2,y-3,1,1,P.spot); // a fly agaric
      R(x-2,y-2,5,1,mix(P.spot,P.o,.4));R(x,y-1,1,1,P.spot);R(x-1,y,3,1,P.spot);}}
  // bare earth under the trees inside the clearing: the tile they block
  for(const [c,r] of L3SPRUCE.concat(L3BIRCH)){const x=c*16+8,y=r*16+12;ell(x,y,9,4,P.rootDk);ell(x,y,8,3,P.root);R(x-5,y+1,2,1,P.rootDk);R(x+3,y-1,2,1,P.rootDk);}
  // objects + edge trees, with the foreground copy for things characters can walk behind
  const objs=L3objs(P);objs.forEach(o=>o.d());
  const tr=t=>t.b?birch(t.x,t.by,P):spruce(t.x,t.by,t.h,P);for(const t of geo.trees)tr(t);
  G=fx;
  objs.forEach(o=>{fx.save();fx.beginPath();fx.rect(0,0,320,o.r*16+4);fx.clip();o.d();fx.restore();});
  for(const t of geo.trees){fx.save();fx.beginPath();fx.rect(0,0,320,t.r*16+4);fx.clip();tr(t);fx.restore();}
  G=ctx;return {bg:b,fg:f};
}
const L3FISH=[[40,40],[100,70],[42,86],[92,44]]; // where fish jump: open water, clear of the boat, the jetty and the pads
function fox(x,y,fr,col,white){ // trotting left
  ell(x,y,7,1.5,'rgba(0,0,0,.3)');
  ell(x+10,y-6,5,2.5,N3.o);ell(x+10,y-6,4,1.5,col);R(x+13,y-7,2,2,white);                                            // the brush, white-tipped
  for(const [lx,up] of [[-3,fr],[-1,1-fr],[4,1-fr],[6,fr]])R(x+lx,y-3-up,1,3,N3.o);
  R(x-4,y-8,12,6,N3.o);R(x-3,y-7,10,4,col);R(x-3,y-4,7,1,mix(col,white,.5));
  R(x-9,y-11,7,6,N3.o);R(x-8,y-10,5,4,col);R(x-12,y-8,4,3,N3.o);R(x-11,y-7,3,1,white);R(x-8,y-7,2,2,white);R(x-7,y-9,1,1,N3.o);
  R(x-8,y-13,2,3,N3.o);R(x-5,y-13,2,3,N3.o);R(x-8,y-12,1,1,col);R(x-5,y-12,1,1,col);}
function owl(x,y,d){ // perched on the lean-to's ridge; it blinks and turns its head now and then
  const c=mix(N3.owl,D3.owl,d),lt=mix(N3.owlLt,D3.owlLt,d),k=S.clock%9,look=k>6?1:k>4.5?-1:0,blink=(S.clock%5)<.18;
  ell(x,y-3,4,5,N3.o);ell(x,y-3,3,4,c);R(x-1,y-3,1,1,N3.o);R(x+1,y-1,1,1,N3.o);R(x,y-5,1,1,lt);
  R(x-4+look,y-11,9,6,N3.o);R(x-3+look,y-10,7,4,c);R(x-4+look,y-12,1,2,N3.o);R(x+4+look,y-12,1,2,N3.o);
  R(x-3+look,y-9,7,2,lt);if(blink){R(x-2+look,y-9,2,1,N3.o);R(x+1+look,y-9,2,1,N3.o);}else{R(x-2+look,y-9,2,2,'#f8d040');R(x+1+look,y-9,2,2,'#f8d040');R(x-1+look,y-8,1,1,N3.o);R(x+1+look,y-8,1,1,N3.o);}
  R(x+look,y-7,1,1,'#c8a040');R(x-2,y+1,2,1,'#c8a040');R(x+1,y+1,2,1,'#c8a040');}
function dynL3(d,layer){
  if(layer==='under'){
    // campfire
    const fl=Math.floor(S.clock*9);R(226,88,12,3,'#a03020');
    for(let i=0;i<4;i++){const h=3+((fl*7+i*13)%6)-Math.round(d*2);if(h>0){R(227+i*3,90-h,3,h,'#f08a30');R(228+i*3,91-h+1,1,Math.max(0,h-2),'#f8d060');}}
    if(fl%3===0)R(229+(fl%7),80+(fl%4),1,1,'#f8d060');
    // moonlight / sunlight glints on the lake
    const sh=mix(N3.shine,D3.shine,d),wl=mix(N3.waterLt,D3.waterLt,d);for(let i=0;i<7;i++){const k=Math.floor(S.clock*2+i*1.7);const gx=20+((k*37+i*53)%80),gy=36+((k*23+i*31)%44);if(L3at(gx>>4,gy>>4)==='~'&&L3at((gx+4)>>4,gy>>4)==='~'&&!(gx<62&&gy>48&&gy<68))R(gx,gy,2+(k%3),1,sh);}
    // a fish jumps every few seconds: a silver flick, then rings spreading on the water
    {const t=S.clock%6.5,[fx,fy]=L3FISH[Math.floor(S.clock/6.5)%L3FISH.length];
      if(t<.45){const up=Math.round(Math.sin(t/.45*Math.PI)*5);R(fx-2,fy-up-1,4,2,N3.o);R(fx-1,fy-up-1,2,1,sh);R(fx+2,fy-up-2,1,1,N3.o);}
      if(t>.3&&t<2.4){const u=(t-.3)/2.1;G.globalAlpha=1-u;oval(fx,fy,2+u*7,1+u*3,wl);if(u>.25)oval(fx,fy,u*5,u*2,wl);G.globalAlpha=1;}}
    // the float bobs at the end of the line, and now and then something bites
    {const t=S.clock%13,bite=t>11.6,bob=Math.round(Math.sin(S.clock*2.3)*.6+.4),fy=60+bob;G.globalAlpha=.6;line3(87,52,91,bite?62:fy-2,mix(N3.cotton,D3.cotton,d));G.globalAlpha=1;
      if(bite)oval(91,62,2+(t-11.6)*3,1+(t-11.6),wl);else{R(90,fy-2,3,4,N3.o);R(91,fy-1,1,1,'#e04a3a');R(91,fy,1,1,'#f2f2f2');}}
    // a fox trots across the clearing in the dark
    if(d<.35){const t=S.clock%38;if(t<12){const x=Math.round(330-t*30);fox(x,170,Math.floor(S.clock*8)%2,mix(N3.fox,D3.fox,d),mix(N3.cotton,D3.cotton,d));}}
    // the exit: a mosquito swarm until 6:00 AM
    if(!L||!L.open){for(let i=0;i<30;i++){const a=S.clock*(2+i%3)+i*2.4,rx=10+(i%5)*2,ry=5+(i%3)*2;R(Math.round(160+Math.cos(a)*rx),Math.round(212+Math.sin(a*1.3)*ry),i%4===0?2:1,1,i%2?'#d8d0c0':'#0c0c10');}
      if(Math.floor(S.clock*2)%2)txt('BZZ',160,196,'#d8d0c0',1,'c','#0a0a0e');}
    else if(Math.floor(S.clock*3)%2){R(158,196,4,6,'#ffe066');R(155,202,10,2,'#ffe066');R(157,204,6,2,'#ffe066');R(159,206,2,1,'#ffe066');}
  }else{
    if(d<.5)owl(238,22,d);                                                                                              // the owl leaves when it gets light
    for(const s of L.smoke){G.globalAlpha=Math.max(0,s.t/3)*.5;disc(s.x,s.y,s.r,mix('#6a7a88','#e8e8f0',d));}G.globalAlpha=1;
    // morning mist
    const m=Math.sin(Math.PI*Math.min(1,d))*.13; // thin enough to still see what is in the way
    if(m>.01){G.globalAlpha=m;for(let i=0;i<5;i++){const y=40+i*38,x=((S.clock*(3+i)+i*70)%440)-60;ell(x,y,70,6,'#e8eef4');ell(x+160,y+14,50,5,'#e8eef4');}G.globalAlpha=1;}
  }
}

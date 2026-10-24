"use strict";
/* Level 3: a Finnish forest. Spruce and birch around a mossy clearing, a lake with a jetty and a rowing boat,
   a lean-to (laavu) with a campfire, a glacial boulder, duckboards over the bog to the exit. Night + misty morning palettes. */
const L3MAP=["####################","####################","#~~~~~~...b..LLL...#","#~~~~~~......LLL..##","#~~~p~~..T.........#","##~~p~~......lFl...#","#..................#",
  "#..T.....oo.....T..#","#........oo........#","#....b.........b...#","##.................#","#.....T......T...b##","##.................#","#########DD#########"];
const N3={out:'#0e1a20',out2:'#122228',floor:'#26383e',floorDk:'#1f2f35',floorLt:'#30464a',moss:'#2a4a40',mossLt:'#35584a',needle:'#3c3a36',
 bog:'#1a282a',bogLt:'#2a4236',sphag:'#3e5a3a',cotton:'#c8ccd8',bush:'#1c3a34',bushLt:'#28503f',berry:'#5a6ac8',lingon:'#b03a3a',chant:'#c0a040',agaric:'#b0343a',spot:'#d8d0c8',fern:'#2a503e',
 spruce:'#122a2c',spruceLt:'#1c3c3a',spruceDk:'#0a1a1e',trunk:'#2a2226',
 birch:'#a8b0c0',birchMk:'#262630',leaf:'#24483e',leafLt:'#32604e',leafDk:'#183630',
 water:'#13284a',waterLt:'#1e3c66',shine:'#9ab0e0',shore:'#3a4648',reed:'#2e4a3a',lily:'#2a5a3a',
 rock:'#4a5262',rockLt:'#646c7e',rockDk:'#30363f',lichen:'#6a7060',
 wood:'#4e3c3e',woodLt:'#6a5254',woodDk:'#33262a',roof:'#3a3446',roofLt:'#4c4660',roofDk:'#2a2636',pad:'#2a3e5a',inside:'#0a080c',o:'#0a1216'};
const D3={out:'#1e3a28',out2:'#24442e',floor:'#5f7d3e',floorDk:'#4f6c34',floorLt:'#76944a',moss:'#6a9a3e',mossLt:'#86b450',needle:'#9a7a4a',
 bog:'#46563a',bogLt:'#728244',sphag:'#a8b04a',cotton:'#ffffff',bush:'#3a7a34',bushLt:'#5a9a44',berry:'#3a4ac8',lingon:'#e03a3a',chant:'#f2b030',agaric:'#e0342a',spot:'#ffffff',fern:'#4a8a3a',
 spruce:'#24543a',spruceLt:'#34704a',spruceDk:'#183c2a',trunk:'#5a3a2e',
 birch:'#f2f0e6',birchMk:'#2a2a2a',leaf:'#5aa03e',leafLt:'#86c452',leafDk:'#3e7a32',
 water:'#3a78a8',waterLt:'#5a9ac8',shine:'#e8f4ff',shore:'#9a9070',reed:'#6a8a3a',lily:'#4a8a3a',
 rock:'#8a8c94',rockLt:'#aaacb4',rockDk:'#686a74',lichen:'#b0b07a',
 wood:'#9a6a42',woodLt:'#bc8a5a',woodDk:'#6a4428',roof:'#7a5a4a',roofLt:'#9a7a62',roofDk:'#5a3e34',pad:'#3a6ac0',inside:'#2a2020',o:'#1a1612'};
const L3at=(c,r)=>c<0||r<0||c>=COLS||r>=ROWS?'#':L3MAP[r][c];
function geoL3(){
  const solid=L3MAP.map(r=>[...r].map(ch=>!(ch==='.'||ch==='p')));
  const rnd=rng(303),trees=[],mott=[],deco=[],boards=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){if(L3MAP[r][c]!=='#')continue;
    const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([dc,dr])=>L3at(c+dc,r+dr)!=='#');
    if((edge&&rnd()<.92)||rnd()<.4)trees.push({x:c*16+8+Math.round((rnd()-.5)*6),by:r*16+14+Math.round(rnd()*2),h:24+Math.floor(rnd()*12),r,b:rnd()<.16});
    for(let k=0;k<2;k++)mott.push([c*16+rnd()*16,r*16+rnd()*16,3+rnd()*5]);}
  for(let k=0;k<600&&deco.length<120;k++){const x=16+rnd()*288,y=16+rnd()*196,c=x/16|0,r=y/16|0;if(L3at(c,r)!=='.')continue;if(Math.abs(x-160)<16&&y>140)continue;
    const v=rnd();deco.push([x|0,y|0,v<.44?0:v<.62?1:v<.77?2:v<.9?3:v<.93?4:5]);}   // bush, fern, chanterelles, lingonberries, fly agaric, stone
  for(let y=216,i=0;y>142;y-=12,i++)boards.push([160+Math.round(Math.sin(i*.9)*3),y]);
  return {solid,trees,mott,deco,boards};
}
function spruce(x,by,h,P){const tiers=4,tier=t=>[by-3-h+Math.round(t*h/(tiers+.6)),Math.round(h/(tiers-.8)),2+Math.round(t*1.8)];
  R(x-1,by-3,3,4,P.o);R(x,by-3,1,3,P.trunk);
  for(let t=0;t<tiers;t++){const [top,th,mw]=tier(t);for(let yy=0;yy<th;yy++){const w=Math.round((yy+1)/th*mw);R(x-w-1,top+yy,2*w+3,1,P.o);}}
  R(x,by-4-h,1,1,P.o);
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
function laavu(P){ // lean-to on cols 13-15, rows 2-3: roof slopes up to the back, open front with a raised floor
  R(205,19,54,29,P.o);R(206,20,52,27,P.roof);
  for(let y=20,i=0;y<46;y+=4,i++){R(206,y+3,52,1,P.roofDk);for(let x=206+(i%2?3:0);x<258;x+=7)R(x,y,1,4,P.roofDk);}
  R(206,20,52,2,P.roofLt);
  for(const wx of [205,250]){R(wx,46,9,18,P.o);R(wx+1,46,7,17,P.wood);for(let y=49;y<63;y+=4)R(wx+1,y,7,1,P.woodDk);}
  R(213,46,37,10,P.inside);R(213,55,37,8,P.o);R(214,56,35,6,P.wood);for(let x=216;x<248;x+=5)R(x,56,1,6,P.woodDk);R(214,56,35,1,P.woodLt);
  R(218,51,13,5,P.o);R(219,52,11,4,P.pad);R(219,52,11,1,mix(P.pad,'#ffffff',.3));R(239,49,3,7,P.o);R(240,50,1,5,P.lingon);
  R(204,45,56,3,P.o);R(205,46,54,1,P.woodLt);
}
function logSeat(x,y,P){R(x+4,y+1,8,14,P.o);R(x+5,y+2,6,12,P.wood);R(x+5,y+2,1,12,P.woodLt);R(x+10,y+2,1,12,P.woodDk);disc(x+8,y+3,3,P.o);disc(x+8,y+3,2,P.woodLt);R(x+8,y+3,1,1,P.woodDk);}
function boulder(P){ // glacial erratic on cols 9-10, rows 7-8
  ell(160,141,18,4,'rgba(0,0,0,.3)');ell(160,128,17,14,P.o);ell(160,128,16,13,P.rock);ell(163,133,13,8,P.rockDk);ell(158,126,13,9,P.rock);ell(154,122,8,6,P.rockLt);
  ell(159,119,10,4,P.moss);ell(157,118,7,2,P.mossLt);R(168,126,1,5,P.rockDk);R(167,131,1,3,P.rockDk);R(150,133,4,1,P.rockDk);
  R(152,128,1,1,P.lichen);R(170,121,2,1,P.lichen);R(146,124,1,1,P.lichen);R(164,138,2,1,P.lichen);
}
function L3objs(P){
  return [
   {r:3,d:()=>laavu(P)},
   {r:5,d:()=>{logSeat(208,80,P);logSeat(240,80,P);}},
   {r:8,d:()=>boulder(P)},
   ...[[9,4],[3,7],[16,7],[6,11],[13,11]].map(([c,r])=>({r,d:()=>spruce(c*16+8,r*16+15,38,P)})),
   ...[[10,2],[5,9],[15,9],[17,11]].map(([c,r])=>({r,d:()=>birch(c*16+8,r*16+14,P)}))
  ];
}
function paintL3(geo,P){
  const [b,bx]=mk(320,224),[f,fx]=mk(320,224);G=bx;const rnd=rng(77);
  // forest floor: moss, needles
  R(0,0,320,224,P.floor);
  for(let i=0;i<70;i++)disc(16+rnd()*288,16+rnd()*196,3+rnd()*6,rnd()<.5?P.floorDk:P.moss);
  for(let i=0;i<30;i++)disc(16+rnd()*288,16+rnd()*196,2+rnd()*3,P.mossLt);
  for(let i=0;i<260;i++)R(16+rnd()*288|0,16+rnd()*196|0,rnd()<.5?2:1,1,rnd()<.6?P.needle:P.floorLt);
  // bog and duckboards up from the exit
  for(const [x,y] of geo.boards)ell(x,y,17,7,P.bog);
  for(const [x,y] of geo.boards){ell(x-11+((y*7)%22),y+2,4,2,P.bogLt);R(x+12-((y*3)%24),y-3,2,2,P.sphag);R(x-13+((y*5)%26),y-1,1,2,P.reed);R(x-13+((y*5)%26),y-2,1,1,P.cotton);}
  for(const [x,y] of geo.boards){R(x-8,y+2,16,3,P.o);R(x-7,y+3,14,1,P.woodDk);R(x-5,y-6,4,11,P.o);R(x+1,y-6,4,11,P.o);R(x-4,y-5,2,9,P.wood);R(x+2,y-5,2,9,P.wood);R(x-4,y-5,2,1,P.woodLt);R(x+2,y-5,2,1,P.woodLt);}
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
  for(const [x,y] of [[30,44],[86,52],[44,76],[94,74]]){ell(x,y,3,2,P.lily);R(x,y-1,1,1,P.water);R(x+1,y,1,1,mix(P.lily,'#ffffff',.3));}R(87,51,1,1,'#e8a0c0');R(45,75,1,1,'#f0f0f0');
  for(const [x,y] of [[106,60],[108,82],[100,92],[22,98],[34,96],[52,99],[90,98]]){R(x,y-6,1,6,P.o);R(x+2,y-5,1,5,P.o);R(x,y-5,1,5,P.reed);R(x+2,y-4,1,4,P.reed);R(x,y-6,1,1,P.woodDk);}
  ell(98,40,4,3,P.o);ell(98,40,3,2,P.rock);R(97,39,1,1,P.rockLt);ell(20,70,3,2,P.o);ell(20,70,2,1,P.rock);
  // rowing boat tied to the jetty
  ell(42,58,11,5,P.o);ell(42,58,10,4,P.woodDk);ell(42,57,8,3,P.wood);R(40,55,4,5,P.woodLt);R(34,57,1,2,P.woodDk);R(50,57,1,2,P.woodDk);R(52,58,13,1,P.lichen);
  // jetty
  R(65,58,14,42,P.o);R(66,59,12,40,P.wood);for(let y=62;y<99;y+=4)R(66,y,12,1,P.woodDk);R(66,59,12,1,P.woodLt);
  for(const [px,py] of [[63,62],[78,62],[63,90],[78,90]]){R(px,py,3,4,P.o);R(px+1,py,1,3,P.woodDk);}
  // fire ring (flames are animated)
  for(let a=0;a<8;a++){const sx=232+Math.cos(a*Math.PI/4)*6,sy=89+Math.sin(a*Math.PI/4)*4;ell(sx,sy,2.5,2,P.o);ell(sx,sy,2,1.5,P.rock);}ell(232,89,4,2.5,'#1a1414');
  // ground plants
  for(const [x,y,k] of geo.deco){
    if(k===0){disc(x,y,3,P.o);disc(x+4,y+1,3,P.o);disc(x,y,2,P.bush);disc(x+4,y+1,2,P.bush);R(x-1,y-1,2,1,P.bushLt);R(x+3,y,2,1,P.bushLt);R(x+1,y+1,1,1,P.berry);R(x+5,y+2,1,1,P.berry);R(x-1,y+1,1,1,P.berry);}
    else if(k===1){R(x,y-3,1,4,P.fern);R(x-2,y-2,2,1,P.fern);R(x+1,y-2,2,1,P.fern);R(x-3,y,3,1,P.fern);R(x+1,y,3,1,P.fern);}
    else if(k===2){R(x,y,2,1,P.chant);R(x+3,y+1,2,1,P.chant);R(x+1,y+1,1,1,mix(P.chant,'#000000',.3));R(x+1,y-1,2,1,P.chant);}
    else if(k===3){R(x,y,1,1,P.lingon);R(x+2,y+1,1,1,P.lingon);R(x+1,y-1,2,1,P.fern);R(x-1,y,1,1,P.fern);}
    else if(k===4){R(x-3,y-3,7,3,P.o);R(x-2,y-3,5,2,P.agaric);R(x-1,y-3,1,1,P.spot);R(x+1,y-2,1,1,P.spot);R(x-1,y,3,2,P.o);R(x,y,1,2,P.spot);}
    else{ell(x,y,3,2,P.o);ell(x,y,2,1,P.rock);}}
  // objects + edge trees, with the foreground copy for things characters can walk behind
  const objs=L3objs(P);objs.forEach(o=>o.d());
  const tr=t=>t.b?birch(t.x,t.by,P):spruce(t.x,t.by,t.h,P);for(const t of geo.trees)tr(t);
  G=fx;
  objs.forEach(o=>{fx.save();fx.beginPath();fx.rect(0,0,320,o.r*16+4);fx.clip();o.d();fx.restore();});
  for(const t of geo.trees){fx.save();fx.beginPath();fx.rect(0,0,320,t.r*16+4);fx.clip();tr(t);fx.restore();}
  G=ctx;return {bg:b,fg:f};
}
function dynL3(d,layer){
  if(layer==='under'){
    // campfire
    const fl=Math.floor(S.clock*9);R(226,88,12,3,'#a03020');
    for(let i=0;i<4;i++){const h=3+((fl*7+i*13)%6)-Math.round(d*2);if(h>0){R(227+i*3,90-h,3,h,'#f08a30');R(228+i*3,91-h+1,1,Math.max(0,h-2),'#f8d060');}}
    if(fl%3===0)R(229+(fl%7),80+(fl%4),1,1,'#f8d060');
    // moonlight / sunlight glints on the lake
    const sh=mix(N3.shine,D3.shine,d);for(let i=0;i<7;i++){const k=Math.floor(S.clock*2+i*1.7);const gx=20+((k*37+i*53)%80),gy=36+((k*23+i*31)%44);if(L3at(gx>>4,gy>>4)==='~'&&L3at((gx+4)>>4,gy>>4)==='~')R(gx,gy,2+(k%3),1,sh);}
    // the exit: a mosquito swarm until 6:00 AM
    if(!L||!L.open){for(let i=0;i<30;i++){const a=S.clock*(2+i%3)+i*2.4,rx=10+(i%5)*2,ry=5+(i%3)*2;R(Math.round(160+Math.cos(a)*rx),Math.round(212+Math.sin(a*1.3)*ry),i%4===0?2:1,1,i%2?'#d8d0c0':'#0c0c10');}
      if(Math.floor(S.clock*2)%2)txt('BZZ',160,196,'#d8d0c0',1,'c','#0a0a0e');}
    else if(Math.floor(S.clock*3)%2){R(158,196,4,6,'#ffe066');R(155,202,10,2,'#ffe066');R(157,204,6,2,'#ffe066');R(159,206,2,1,'#ffe066');}
  }else{
    for(const s of L.smoke){G.globalAlpha=Math.max(0,s.t/3)*.5;disc(s.x,s.y,s.r,mix('#6a7a88','#e8e8f0',d));}G.globalAlpha=1;
    // morning mist
    const m=Math.sin(Math.PI*Math.min(1,d))*.22;
    if(m>.01){G.globalAlpha=m;for(let i=0;i<5;i++){const y=40+i*38,x=((S.clock*(3+i)+i*70)%440)-60;ell(x,y,70,6,'#e8eef4');ell(x+160,y+14,50,5,'#e8eef4');}G.globalAlpha=1;}
  }
}

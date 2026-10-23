"use strict";
/* Level 2: the forest clearing. Generated map, night + day palettes, animated bits. */
const N2={out:'#173f44',out2:'#1b4a4e',grass:'#2c8a76',grassDk:'#22705f',grassLt:'#3ba487',edge:'#1d5f55',dirt:'#5f7f6a',dirtDk:'#4f6c5a',dirtLt:'#6f9078',
 pine:'#163234',pineLt:'#1f4644',pineDk:'#0e2224',leaf:'#1e4c48',leafLt:'#2a625a',leafDk:'#143634',trunk:'#2a2a30',trunkLt:'#3a3a42',
 roof:'#5fb8b4',roofLt:'#86d6cc',roofDk:'#3e8c8e',wall:'#9a4e48',wallDk:'#6e3236',wallLt:'#b2625a',window:'#ffd07a',door:'#4a2a2e',
 stone:'#6a8a8a',stoneLt:'#86a6a2',stoneDk:'#4a6668',water:'#173a48',hay:'#8f8a4a',hayDk:'#6a6438',hayLt:'#aaa45a',fence:'#5a3e46',fenceDk:'#3a2630',fenceLt:'#74525a',
 rock:'#5a7a76',rockLt:'#7a9a92',rockDk:'#3e5a58',metal:'#6a7a8a',metalLt:'#8a9aaa',fl:['#c8d0e8','#d8c86a','#c86a7a'],o:'#0e1e20'};
const D2={out:'#2f6e45',out2:'#3a8050',grass:'#5fae3d',grassDk:'#4b973a',grassLt:'#7cc44a',edge:'#3f8a3a',dirt:'#f0a86e',dirtDk:'#de8c58',dirtLt:'#f7c08a',
 pine:'#2a5e3e',pineLt:'#3f7e4e',pineDk:'#1c4230',leaf:'#3a8a4a',leafLt:'#5aaa52',leafDk:'#2a6a3e',trunk:'#7a3f3a',trunkLt:'#9a5548',
 roof:'#5ab0c8',roofLt:'#7fd0e0',roofDk:'#3a88a0',wall:'#b85a4a',wallDk:'#8a3a36',wallLt:'#d0705a',window:'#f8e8a8',door:'#6a3a34',
 stone:'#a8a8b8',stoneLt:'#c8c8d4',stoneDk:'#7a7a8e',water:'#4aa0c8',hay:'#f2c64a',hayDk:'#d0942a',hayLt:'#f8e070',fence:'#9a5050',fenceDk:'#6a3038',fenceLt:'#b86a62',
 rock:'#c98e6a',rockLt:'#e0aa84',rockDk:'#9a6450',metal:'#8a98b0',metalLt:'#b0bcd0',fl:['#ffffff','#f8d040','#e84a3a'],o:'#22161e'};
const L2OBJ=[[7,2,6,3],[15,4,2,2],[4,4,1,1],[3,7,1,1],[16,8,1,1],[6,11,1,1],[13,11,1,1],[12,7,2,1],[4,9,2,1],[12,9,1,1],[15,6,2,1],[8,12,1,1],[11,12,1,1]];
function geoL2(){
  const forest=[],solid=[];
  for(let r=0;r<ROWS;r++){forest.push([]);solid.push([]);for(let c=0;c<COLS;c++){const dx=(c+.5-10)/9.8,dy=(r+.5-7)/6.9;const f=r===0||r===13||c===0||c===19||dx*dx+dy*dy>1;forest[r].push(f);solid[r].push(f);}}
  forest[13][9]=forest[13][10]=false;
  for(const [c,r,w,h] of L2OBJ)for(let y=r;y<r+h;y++)for(let x=c;x<c+w;x++)solid[y][x]=true;
  const rnd=rng(99),pines=[],tufts=[],flowers=[],mott=[],path=[];
  const isF=(c,r)=>c<0||r<0||c>=COLS||r>=ROWS||forest[r][c];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){if(!forest[r][c])continue;
    const edge=!isF(c+1,r)||!isF(c-1,r)||!isF(c,r+1)||!isF(c,r-1);
    if((edge&&rnd()<.85)||rnd()<.18)pines.push({x:c*16+8+Math.round((rnd()-.5)*6),by:r*16+14+Math.round(rnd()*2),h:18+Math.floor(rnd()*10),r});
    for(let k=0;k<2;k++)mott.push([c*16+rnd()*16,r*16+rnd()*16,3+rnd()*5]);}
  const objAt=(c,r)=>L2OBJ.some(([oc,or,w,h])=>c>=oc&&c<oc+w&&r>=or&&r<or+h);
  for(let k=0;k<400&&(tufts.length<90||flowers.length<34);k++){const x=16+rnd()*288,y=16+rnd()*196,c=x/16|0,r=y/16|0;if(forest[r][c]||objAt(c,r))continue;if(Math.abs(x-160)<16&&y>78)continue;
    if(tufts.length<90&&rnd()<.75)tufts.push([x|0,y|0]);else if(flowers.length<34)flowers.push([x|0,y|0,Math.floor(rnd()*3)]);}
  for(let y=82;y<226;y+=4)path.push([160+Math.sin(y*.06)*4,y,10+rnd()*3]);
  path.push([160,86,17],[144,90,10],[176,90,10]);
  return {forest,solid,pines,tufts,flowers,mott,path};
}
function pine(x,by,h,P){
  R(x-1,by-3,3,4,P.trunk);
  for(let t=0;t<3;t++){const top=by-3-h+Math.round(t*h/3.4),th=Math.round(h/2.6),mw=2+t*2;
    for(let yy=0;yy<th;yy++){const w=Math.round((yy+1)/th*mw);R(x-w-1,top+yy,2*w+3,1,P.o);}}
  R(x,by-4-h,1,1,P.o);
  for(let t=0;t<3;t++){const top=by-3-h+Math.round(t*h/3.4),th=Math.round(h/2.6),mw=2+t*2;
    for(let yy=0;yy<th;yy++){const w=Math.round((yy+1)/th*mw);R(x-w,top+yy,2*w+1,1,P.pine);R(x-w,top+yy,Math.max(1,w>>1),1,P.pineLt);if(yy===th-1)R(x-w,top+yy,2*w+1,1,P.pineDk);}}
}
function tree(tc,tr,P){const tx=tc*16,ty=tr*16;
  ell(tx+8,ty+14,9,3,'rgba(0,0,0,.25)');R(tx+6,ty+5,5,10,P.o);R(tx+7,ty+5,3,9,P.trunk);R(tx+7,ty+5,1,9,P.trunkLt);R(tx+4,ty+13,9,2,P.o);R(tx+5,ty+13,7,1,P.trunk);
  disc(tx+8,ty-3,11,P.o);disc(tx+8,ty-3,10,P.leafDk);disc(tx+7,ty-5,9,P.leaf);disc(tx+3,ty-1,4,P.leaf);disc(tx+13,ty-1,4,P.leafDk);
  disc(tx+4,ty-8,4,P.leafLt);disc(tx+9,ty-10,3,P.leafLt);R(tx+3,ty-9,2,1,mix(P.leafLt,'#ffffff',.25));}
function L2objs(P){
  return [
   {r:2,d:()=>{ // cabin
     R(115,51,90,30,P.o);R(116,52,88,28,P.wall);for(let y=56;y<80;y+=4)R(116,y,88,1,P.wallDk);R(116,52,88,1,P.wallLt);R(116,52,3,28,P.wallDk);R(201,52,3,28,P.wallDk);
     for(const wx of [124,180]){R(wx-1,57,18,14,P.o);R(wx,58,16,12,P.window);R(wx+7,58,2,12,P.wallDk);R(wx,63,16,2,P.wallDk);R(wx,58,16,1,mix(P.window,'#ffffff',.4));R(wx-2,70,20,2,P.wallDk);}
     R(153,60,14,20,P.o);R(154,61,12,19,P.door);R(154,61,12,1,mix(P.door,'#ffffff',.2));R(160,61,1,19,P.o);R(163,70,1,2,P.window);
     R(150,80,20,3,P.stoneDk);R(151,80,18,1,P.stoneLt);
     R(186,15,12,15,P.o);R(187,16,10,13,P.stone);R(187,16,10,2,P.stoneDk);R(187,21,10,1,P.stoneDk);R(192,22,1,6,P.stoneDk);
     R(110,26,100,29,P.o);R(111,27,98,27,P.roof);
     for(let y=31,i=0;y<53;y+=4,i++){R(111,y,98,1,P.roofDk);for(let x=111+(i%2?4:0);x<209;x+=8)R(x,y-3,1,3,P.roofDk);}
     R(111,27,98,2,P.roofLt);R(111,53,98,1,P.roofDk);R(112,55,96,2,P.o);R(116,57,88,1,P.wallDk);}},
   {r:4,d:()=>{ // shed
     R(241,76,30,21,P.o);R(242,77,28,19,P.wall);for(let y=81;y<95;y+=4)R(242,y,28,1,P.wallDk);R(251,82,10,14,P.o);R(252,83,8,13,P.door);
     R(238,60,36,19,P.o);R(239,61,34,17,P.roof);for(let y=65;y<77;y+=4)R(239,y,34,1,P.roofDk);R(239,61,34,2,P.roofLt);R(240,79,32,1,P.o);}},
   {r:4,d:()=>{ // well
     ell(72,75,8,6,P.o);ell(72,75,7,5,P.stone);ell(72,74,4,2,P.water);R(66,71,2,1,P.stoneLt);R(74,79,4,1,P.stoneDk);
     R(63,58,3,16,P.o);R(64,58,1,15,P.fence);R(78,58,3,16,P.o);R(79,58,1,15,P.fence);R(65,60,14,1,P.fenceDk);R(71,60,1,8,'#c8b890');R(70,67,3,3,P.metal);
     R(60,53,24,7,P.o);R(61,54,22,5,P.roofDk);R(61,54,22,1,P.roofLt);}},
   ...[[3,7],[16,8],[6,11],[13,11]].map(([c,r])=>({r,d:()=>tree(c,r,P)})),
   {r:7,d:()=>{for(const tx of [192,208]){R(tx,117,16,2,P.o);R(tx,123,16,2,P.o);R(tx,118,16,1,P.fence);R(tx,124,16,1,P.fence);}for(const px of [193,206,221]){R(px-1,113,4,16,P.o);R(px,114,2,14,P.fence);R(px,114,1,14,P.fenceLt);}}},
   {r:9,d:()=>{for(const tx of [64,80]){R(tx+1,147,14,13,P.o);R(tx+2,148,12,11,P.hay);for(let x=tx+3;x<tx+14;x+=3)R(x,149,1,9,P.hayDk);R(tx+2,148,12,2,P.hayLt);R(tx+2,153,12,1,'#c0482e');}}},
   {r:9,d:()=>{ell(200,152,7,5,P.o);ell(200,152,6,4,P.rock);ell(198,150,3,2,P.rockLt);R(196,155,8,1,P.rockDk);}},
   {r:6,d:()=>{R(241,99,30,12,P.o);R(242,100,28,10,P.metal);R(244,102,24,5,P.water);R(242,100,28,1,P.metalLt);R(246,103,6,1,mix(P.water,'#ffffff',.4));R(243,110,3,3,P.o);R(266,110,3,3,P.o);}},
   ...[[8,12],[11,12]].map(([c,r])=>({r,d:()=>{const tx=c*16,ty=r*16;R(tx+6,ty+3,5,12,P.o);R(tx+7,ty+5,3,10,P.fence);R(tx+7,ty+5,1,10,P.fenceLt);R(tx+5,ty+2,7,3,P.o);R(tx+6,ty+3,5,1,P.metal);}}))
  ];
}
function paintL2(geo,P){
  const [b,bx]=mk(320,224),[f,fx]=mk(320,224);G=bx;
  R(0,0,320,224,P.out);for(const [x,y,r] of geo.mott)disc(x,y,r,P.out2);
  const clear=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(!geo.forest[r][c])clear.push([c,r]);
  for(const [c,r] of clear)disc(c*16+8,r*16+8,13,P.edge);
  for(const [c,r] of clear){disc(c*16+8,r*16+8,11,P.grass);}
  for(const [c,r] of clear)R(c*16,r*16,16,16,P.grass);
  for(let i=0;i<clear.length;i+=3){const [c,r]=clear[i];disc(c*16+((i*7)%16),r*16+((i*5)%16),3+(i%3),P.grassDk);}
  for(const [x,y,rr] of geo.path)disc(x,y,rr,P.dirtDk);for(const [x,y,rr] of geo.path)disc(x,y,rr-2,P.dirt);
  for(let i=0;i<geo.path.length;i+=2){const [x,y]=geo.path[i];R(x-5+(i*3)%10,y,2,1,P.dirtDk);R(x+3-(i*5)%9,y+2,1,1,P.dirtLt);}
  for(const [x,y] of geo.tufts){R(x,y,1,2,P.grassLt);R(x+2,y-1,1,3,P.grassLt);R(x+4,y,1,2,P.grassLt);}
  for(const [x,y,k] of geo.flowers){R(x-1,y,3,1,P.fl[k]);R(x,y-1,1,3,P.fl[k]);R(x,y,1,1,k===1?'#e07a30':'#f8d040');}
  const objs=L2objs(P);objs.forEach(o=>o.d());
  for(const p of geo.pines)pine(p.x,p.by,p.h,P);
  G=fx;
  objs.forEach(o=>{fx.save();fx.beginPath();fx.rect(0,0,320,o.r*16+4);fx.clip();o.d();fx.restore();});
  for(const p of geo.pines){fx.save();fx.beginPath();fx.rect(0,0,320,p.r*16+4);fx.clip();pine(p.x,p.by,p.h,P);fx.restore();}
  G=ctx;return {bg:b,fg:f};
}
function dynL2(d,layer){
  if(layer==='under'){
    const fl=Math.floor(S.clock*10);
    for(const tx of [128,176]){const h=3+((fl+tx)%3);R(tx+6,192-h,5,h+1,'#f08a30');R(tx+7,193-h-1,3,h,'#f8d060');R(tx+8,191-h,1,1,'#fff6c0');}
    const fc=mix(N2.fence,D2.fence,d),fo=mix(N2.o,D2.o,d);
    R(140,206,4,18,fo);R(141,207,2,16,fc);R(176,206,4,18,fo);R(177,207,2,16,fc);
    if(!L||!L.open){R(144,210,32,3,fo);R(144,217,32,3,fo);R(144,211,32,1,fc);R(144,218,32,1,fc);for(const x of [146,158,161,173]){R(x-1,208,3,15,fo);R(x,209,1,13,fc);}
      if(Math.floor(S.clock*2)%2){R(156,212,8,6,'#2a2028');R(157,213,6,4,'#c8a040');}}
    else{for(const x of [144,173]){R(x,204,3,18,fo);R(x+1,205,1,16,fc);}if(Math.floor(S.clock*3)%2){R(158,196,4,6,'#ffe066');R(155,202,10,2,'#ffe066');R(157,204,6,2,'#ffe066');}}
  } else {
    for(const s of L.smoke){G.globalAlpha=Math.max(0,s.t/3)*.6;disc(s.x,s.y,s.r,mix('#8aa8a8','#e8e8f0',d));}G.globalAlpha=1;
  }
}

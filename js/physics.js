"use strict";
/* Tile collision, line of sight and the BFS flow field zombies use to chase. */
function solidAt(px,py){const c=Math.floor(px/16),r=Math.floor(py/16);if(c<0||c>=COLS||r<0||r>=ROWS)return true;return L.solid[r][c];}
function boxHits(x,y,hw,hh){return solidAt(x-hw,y-hh)||solidAt(x+hw,y-hh)||solidAt(x-hw,y-.01)||solidAt(x+hw,y-.01);}
function moveEnt(e,dx,dy){let m=0;if(dx&&!boxHits(e.x+dx,e.y,4,4)){e.x+=dx;m+=Math.abs(dx);}if(dy&&!boxHits(e.x,e.y+dy,4,4)){e.y+=dy;m+=Math.abs(dy);}return m;}
function los(ax,ay,bx,by){const d=Math.hypot(bx-ax,by-ay),n=Math.ceil(d/4);for(let i=1;i<n;i++){const t=i/n;if(boxHits(ax+(bx-ax)*t,ay+(by-ay)*t,4,4))return false;}return true;}
function field(tc,tr){const k=tr*COLS+tc;if(L.fields[k])return L.fields[k];const d=new Int16Array(COLS*ROWS).fill(9999);d[k]=0;const q=[k];let h=0;
  while(h<q.length){const i=q[h++],c=i%COLS,r=(i/COLS)|0;for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]){const nc=c+dc,nr=r+dr;if(nc<0||nr<0||nc>=COLS||nr>=ROWS)continue;const ni=nr*COLS+nc;if(L.solid[nr][nc]||d[ni]<=d[i]+1)continue;d[ni]=d[i]+1;q.push(ni);}}
  return L.fields[k]=d;}
function steer(z,tx,ty){
  if(los(z.x,z.y,tx,ty)){const d=Math.hypot(tx-z.x,ty-z.y)||1;return [(tx-z.x)/d,(ty-z.y)/d];}
  const f=field(Math.max(0,Math.min(COLS-1,Math.floor(tx/16))),Math.max(0,Math.min(ROWS-1,Math.floor((ty-2)/16))));
  const c=Math.floor(z.x/16),r=Math.floor((z.y-2)/16);let best=null,bd=f[r*COLS+c];
  for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nc=c+dc,nr=r+dr;if(nc<0||nr<0||nc>=COLS||nr>=ROWS||L.solid[nr][nc])continue;
    if(dc&&dr&&(L.solid[r][nc]||L.solid[nr][c]))continue;const v=f[nr*COLS+nc]-(dc&&dr?.5:0);if(v<bd){bd=v;best=[nc,nr];}}
  let gx,gy;if(best){gx=best[0]*16+8;gy=best[1]*16+10;}else{gx=tx;gy=ty;}
  const d=Math.hypot(gx-z.x,gy-z.y)||1;return [(gx-z.x)/d,(gy-z.y)/d];
}
function onPuddle(x,y){for(const p of L.puddles)for(const b of p.blobs){const dx=(x-p.x-b[0])/b[2],dy=(y-p.y-b[1])/b[3];if(dx*dx+dy*dy<1)return true;}return false;}
function floater(x,y,text,col){L.floats.push({x,y,text,col:col||'#f2e6d0',t:1.3});}
function dirVec(d){return [[0,1],[0,-1],[1,0],[-1,0]][d];}
function freeSpot(minD){for(let k=0;k<120;k++){const c=1+Math.floor(Math.random()*18),r=1+Math.floor(Math.random()*12);if(L.solid[r][c]||!L.g.ok[r][c])continue;
  const x=c*16+8,y=r*16+11;if(Math.hypot(x-L.p.x,y-L.p.y)<minD)continue;if(L.items.some(it=>Math.hypot(it.x-x,it.y-y)<28))continue;return {x,y};}return null;}

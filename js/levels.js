"use strict";
/* Builds both levels at boot and defines the LEVELS list (night length, spawns, exit joke). */
function reach(solid,sx,sy){const ok=solid.map(r=>r.map(()=>false));const q=[[sx,sy]];ok[sy][sx]=true;while(q.length){const [c,r]=q.shift();for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]){const nc=c+dc,nr=r+dr;if(nc<0||nr<0||nc>=COLS||nr>=ROWS||ok[nr][nc]||solid[nr][nc])continue;ok[nr][nc]=true;q.push([nc,nr]);}}return ok;}
const GEO=[];
function buildGeo(){
  const s1=L1MAP.map(r=>[...r].map(ch=>ch!=='.'));const p1=paintL1();
  GEO.push({solid:s1,doors:[[9,13],[10,13]],bgN:p1.bg,fgN:p1.fg,dyn:dynL1,dark:.5,lights:'l1',ok:reach(s1,9,11)});
  const g2=geoL2();const n=paintL2(g2,N2),dd=paintL2(g2,D2);
  GEO.push({solid:g2.solid,doors:[[9,13],[10,13]],bgN:n.bg,fgN:n.fg,bgD:dd.bg,fgD:dd.fg,dyn:dynL2,dark:.34,lights:'l2',ok:reach(g2.solid,10,11)});
}
const LEVELS=[
  {name:'THE CABIN',night:100,start:[9.5,11.6],zs:[[3.5,7.6],[17.5,4.6],[11.5,4.6],[17.5,9.6],[5.5,5.6]],why:['THE DOOR WAS NEVER LOCKED.','IT WAS JUST TOO DARK TO FIND THE HANDLE.']},
  {name:'THE CLEARING',night:120,start:[10,11.6],zs:[[10,5.6],[2.5,5.6],[17.5,6.6],[15.5,10.6],[14.5,3.6]],why:['THE GATE OPENS AT 6:00 AM SHARP.','RURAL GATES HAVE OFFICE HOURS NOW.']}
];

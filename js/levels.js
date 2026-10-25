"use strict";
/* Builds all levels at boot and defines the LEVELS list: night length (shorter = time runs faster), hidden checkpoint,
   spawns, exit joke. waves = who arrives in each slot of waveEvery seconds ('Z' = the next zombie, if your zombie count has one). */
function reach(solid,sx,sy){const ok=solid.map(r=>r.map(()=>false));const q=[[sx,sy]];ok[sy][sx]=true;while(q.length){const [c,r]=q.shift();for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]){const nc=c+dc,nr=r+dr;if(nc<0||nr<0||nc>=COLS||nr>=ROWS||ok[nr][nc]||solid[nr][nc])continue;ok[nr][nc]=true;q.push([nc,nr]);}}return ok;}
const GEO=[];
function buildGeo(){
  const s1=L1MAP.map(r=>[...r].map(ch=>ch!=='.'));const p1=paintL1();
  GEO.push({solid:s1,doors:[[9,13],[10,13]],bgN:p1.bg,fgN:p1.fg,dyn:dynL1,dark:.5,lights:'l1',ok:reach(s1,9,11)});
  const g2=geoL2();const n=paintL2(g2,N2),dd=paintL2(g2,D2);
  GEO.push({solid:g2.solid,doors:[[9,13],[10,13]],bgN:n.bg,fgN:n.fg,bgD:dd.bg,fgD:dd.fg,dyn:dynL2,dark:.34,lights:'l2',smoke:[192,12],ok:reach(g2.solid,10,11)});
  const g3=geoL3(),n3=paintL3(g3,N3),d3=paintL3(g3,D3);
  GEO.push({solid:g3.solid,doors:[[9,13],[10,13]],bgN:n3.bg,fgN:n3.fg,bgD:d3.bg,fgD:d3.fg,dyn:dynL3,dark:.55,lights:'l3',smoke:[232,82],
    lightsAt:fl=>[[232,84,66+fl],[60,48,30]],warmAt:()=>[[232,88,48]],ok:reach(g3.solid,9,11)});
  const s4=L4MAP.map(r=>[...r].map(ch=>ch!=='.')),n4=paintL4(N4),d4=paintL4(D4);
  GEO.push({solid:s4,doors:[[9,13],[10,13]],bgN:n4.bg,fgN:n4.fg,bgD:d4.bg,fgD:d4.fg,dyn:dynL4,dark:.42,lights:'l4',lightsAt:lightsL4,warmAt:warmL4,ok:reach(s4,10,10)});
  // The platform has no door tiles: the first train's doors are the exit. Pickups never spawn on the tracks.
  const s5=L5MAP.map(r=>[...r].map(ch=>ch!=='.'&&ch!=='=')),n5=paintL5(N5),ok5=reach(s5,10,11).map((row,r)=>row.map(v=>v&&!L5MAP[r].includes('=')));
  GEO.push({solid:s5,doors:[],bgN:n5.bg,fgN:n5.fg,dyn:dynL5,dark:.5,lights:'l5',lightsAt:lightsL5,warmAt:warmL5,ok:ok5});
}
const LEVELS=[
  {name:'THE CABIN',night:70,cp:[280,92],start:[9.5,11.6],zs:[[3.5,7.6],[17.5,4.6],[11.5,4.6],[17.5,9.6],[5.5,5.6]],why:['THE DOOR WAS NEVER LOCKED.','IT WAS JUST TOO DARK TO FIND THE HANDLE.']},
  {name:'THE CLEARING',night:90,cp:[264,124],start:[10,11.6],zs:[[10,5.6],[2.5,5.6],[17.5,6.6],[15.5,10.6],[14.5,3.6]],why:['THE GATE OPENS AT 6:00 AM SHARP.','RURAL GATES HAVE OFFICE HOURS NOW.']},
  {name:'THE DEEP FOREST',sub:'SOMEWHERE IN FINLAND. MIND THE BEAR.',night:110,cp:[84,140],start:[9.5,11.6],zs:[[8.5,2.6],[17.5,7.6],[11.5,6.6],[2.5,9.6],[16.5,10.6]],
   waves:[['granny','Z'],['Z'],['bear'],['Z'],['Z'],['Z']],waveEvery:15,guestAt:{granny:[2.5,7.6],bear:[17.5,3.6]},why:['MOSQUITOES GUARDED THE PATH ALL NIGHT.','AT 6:00 AM THEIR SHIFT ENDED.']},
  {name:'KONTULA',sub:'ITÄ-HELSINKI. THE LAST METRO IS GONE.',night:130,cp:[56,60],start:[10,10.6],zs:[[7.5,5.6],[12.5,5.6],[17.5,7.6],[2.5,7.6],[14.5,10.6]],
   waves:[['Z','spurgu'],['Z'],['Z'],['nisti'],['Z'],['Z']],waveEvery:16,guestAt:{spurgu:[15.5,4.6],nisti:[5.5,4.6]},why:['THE METRO SHUTTER ROLLED UP AT 6:00 AM.','KONTULA SAYS: COME BACK FOR THE KEBAB.']},
  {name:'KONTULA METRO',sub:'THE PLATFORM. FIRST TRAIN AT 6:00 AM.',night:140,cp:[248,44],start:[10,11.6],zs:[[1.5,4.6],[18.5,4.6],[1.5,12.6],[18.5,12.6],[12.5,2.6]],
   waves:[['Z'],['Z','inspector'],['Z'],['Z'],['Z']],waveEvery:16,guestAt:{inspector:[3.5,2.6]},
   music:'station',dawnTitle:'6:00 AM - FIRST TRAIN!',setup:setupStation,tick:stationTick,escape:stationEscape,
   tips:[['TRAINS FLATTEN ANYTHING ON THE TRACKS.','#f2e6d0'],['LURE ZOMBIES THERE. DO NOT STAND THERE.','#f8c840'],['THE INSPECTOR FINES YOU: MAGS OR POINTS.','#5ad8f8'],['6:00 AM: BOARD THE FIRST TRAIN, TRACK 2.','#9dbb6c']],
   why:['THE FIRST TRAIN LEFT AT 6:00 AM SHARP.','NEXT STOP: ANYWHERE BUT HERE.']}
];

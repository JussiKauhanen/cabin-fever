"use strict";
/* Money, the kiosk and the effects it sells.
   Coins lie on the floor (spawned in updPlay), some characters pay you or take your money (enemies.js), and the kiosk
   (B, or the KIOSKI button) sells supplies and three kinds of help: DEEP FREEZE stops every enemy, FAST FORWARD speeds up
   the night clock and ZOMBIE RESET takes the zombie count back to one. A magic pill (E, or the PILL button) does two things
   at once for a few seconds: enemies crawl while the clock races (the matrix effect). */
function earn(n,x,y,note){S.money=Math.min(CFG.moneyMax,S.money+n);floater(x,y,'+'+n+'€'+(note?' '+note:''),'#f8c840');SFX.coin();
  if(!S.tipShop&&S.money>=CFG.prices.mags){S.tipShop=true;if(!L.banner)L.banner={a:'THE KIOSKI IS OPEN!',b:KT('PRESS B TO SPEND YOUR MONEY.','TAP KIOSKI TO SPEND YOUR MONEY.'),c:'',t:3.5};}}
function payUp(n){n=Math.min(S.money,Math.floor(n));S.money-=n;return n;}   // returns what was actually taken
function coinBurst(x,y,n){for(let k=0;k<n;k++)L.parts.push({x,y,z:10,vx:(Math.random()-.5)*70,vy:(Math.random()-.5)*40,vz:40+Math.random()*40,t:.7,col:pick(['#f8c840','#fff6c0','#c89020'])});}
function puff(x,y,cols){for(let k=0;k<10;k++)L.parts.push({x:x+(Math.random()-.5)*12,y,z:4,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*10,vz:20+Math.random()*30,t:.6,col:pick(cols||['#c8c0b0','#8a8a9a','#e8e4dc'])});}

/* ---- effects: update.js asks these every frame ---- */
function enemiesHeld(){return L.grace>0||L.vibe>0||L.freeze>0;}                // nobody hostile moves or catches you
function timeRate(){return (L.ff>0?CFG.ffRate:1)*(L.matrix>0?CFG.pillRate:1);} // how fast the night clock runs
function enemyDt(dt){return L.matrix>0?dt*CFG.pillSlow:dt;}                    // enemies live in slow motion during a pill
function tickEffects(dt){for(const k of ['freeze','ff','matrix'])if(L[k]>0)L[k]=Math.max(0,L[k]-dt);}
function startFreeze(){L.freeze=CFG.freezeTime;
  for(const z of L.zs){if(z.hidden)continue;z.say=pick(FREEZEQ);z.sayT=1.6;z.bubbleT=Math.max(z.bubbleT,CFG.freezeTime+1);}
  L.banner={a:'DEEP FREEZE!',b:'NO ENEMY MOVES FOR '+CFG.freezeTime+' SECONDS.',c:'',t:2.4};SFX.freeze();}
function startFF(){L.ff=CFG.ffTime;L.banner={a:'FAST FORWARD!',b:'THE CLOCK RUNS '+CFG.ffRate+'X FOR '+CFG.ffTime+' SECONDS.',c:'',t:2.4};SFX.ff();}
function usePill(){const p=L.p;if(S.pills<=0){floater(p.x,p.y-22,'NO PILLS!','#e04a3a');SFX.miss();return;}
  if(L.matrix>0)return;                                                        // one at a time
  S.pills--;L.matrix=CFG.pillTime;L.banner={a:'MAGIC PILL!',b:'ENEMIES CRAWL. THE CLOCK RACES.',c:'',t:2.4};SFX.pill();}
/* back to one zombie: the extra ones on the map, in the metro tunnel or still on their way are gone */
function zombieReset(){let keep=1;S.zombies=1;
  for(const z of L.zs.slice())if(!z.k){if(keep>0){keep--;continue;}L.zs.splice(L.zs.indexOf(z),1);puff(z.x,z.y,['#9dbb6c','#6f8f4c','#e8e4dc']);}
  if(L.station)L.station.back=L.station.back.filter(b=>b.z.k||keep-->0);
  if(L.pending)L.pending=L.pending.filter(w=>w.k||keep-->0);
  L.banner={a:'ZOMBIE RESET!',b:'ONE ZOMBIE LEFT. ALL YOUR LIVES ARE BACK.',c:'',t:3};SFX.sun();}

/* ---- the kiosk: a paused screen (S.mode 'shop'). go:true items close it so the effect starts at once ---- */
const SHOPUI={x:30,y:28,w:260,h:192,row0:60,rowH:17}; // panel + first row, shared by drawShop() and taps on the screen
const SHOP=[
 {k:'mags',name:'2 MAGAZINES',desc:'ZOMBIES STOP TO READ THEM.',no:'YOUR POCKETS ARE FULL.',ok:()=>L.p.mags<CFG.magsMax,buy(){L.p.mags=Math.min(CFG.magsMax,L.p.mags+2);}},
 {k:'mic',name:'MICROPHONE',desc:'RAP AND EVERYONE STOPS TO VIBE.',no:'YOU ALREADY HAVE A MIC.',ok:()=>!L.p.mic,buy(){L.p.mic=true;}},
 {k:'pill',name:'MAGIC PILL',desc:'ENEMIES CRAWL, THE CLOCK RACES: '+CFG.pillTime+' S.',no:'YOUR POCKETS ARE FULL.',ok:()=>S.pills<CFG.pillMax,buy(){S.pills++;}},
 {k:'freeze',name:'DEEP FREEZE',desc:'NO ENEMY MOVES FOR '+CFG.freezeTime+' SECONDS.',no:'THEY ARE FROZEN ALREADY.',ok:()=>L.freeze<=0,buy:startFreeze,go:true},
 {k:'ff',name:'FAST FORWARD',desc:'THE CLOCK RUNS '+CFG.ffRate+'X FOR '+CFG.ffTime+' SECONDS.',no:()=>L.open?'IT IS MORNING ALREADY.':'IT IS RUNNING ALREADY.',ok:()=>!L.open&&L.ff<=0,buy:startFF,go:true},
 {k:'reset',name:'ZOMBIE RESET',desc:'BACK TO ONE ZOMBIE. ALL LIVES BACK.',no:'THERE IS ONLY ONE ZOMBIE.',ok:()=>S.zombies>1,buy:zombieReset,go:true}
];
function openShop(){if(S.mode!=='play')return;S.mode='shop';S.t=0;L.shop={sel:L.shopSel||0,msg:'',col:'',msgT:0};L.p.vx=L.p.vy=0;SFX.blip();}
function closeShop(){if(!L.shop)return;L.shopSel=L.shop.sel;L.shop=null;S.mode='play';}
function shopSay(s,col){const sh=L.shop;if(sh){sh.msg=s;sh.col=col;sh.msgT=1.8;}}
function shopBuy(i){const it=SHOP[i],sh=L.shop;if(!it||!sh)return false;sh.sel=i;const price=CFG.prices[it.k];
  if(!it.ok()){shopSay(typeof it.no==='function'?it.no():it.no,'#e04a3a');SFX.miss();return false;}
  if(S.money<price){shopSay('NOT ENOUGH MONEY: '+(price-S.money)+'€ SHORT.','#e04a3a');SFX.miss();return false;}
  S.money-=price;SFX.buy();it.buy();
  if(it.go)closeShop();else shopSay('BOUGHT: '+it.name+'.','#9dbb6c');return true;}
function shopKey(k,kl){const sh=L.shop,n=SHOP.length;
  if(kl==='b'||kl==='p'||k==='Escape'){closeShop();return;}
  if(k==='ArrowUp'||kl==='w'){sh.sel=(sh.sel+n-1)%n;sh.msgT=0;SFX.blip();return;}
  if(k==='ArrowDown'||kl==='s'){sh.sel=(sh.sel+1)%n;sh.msgT=0;SFX.blip();return;}
  if(k==='Enter'||k===' '){shopBuy(sh.sel);return;}
  const i='123456789'.indexOf(k);if(i>=0&&i<n)shopBuy(i);}
function updShop(dt){if(L.shop&&L.shop.msgT>0)L.shop.msgT-=dt;}
function shopRowAt(x,y){const u=SHOPUI,i=Math.floor((y-(u.row0-4))/u.rowH);return x>=u.x+6&&x<=u.x+u.w-6&&i>=0&&i<SHOP.length?i:-1;}

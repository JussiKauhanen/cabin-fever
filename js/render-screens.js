"use strict";
/* Draws title, intro, the kiosk, high score entry, Hall of Fame and end screens. */
const TG=['#f8f4a0','#f0e860','#d8dc5a','#b8c83a','#94b03a','#6f9a3a','#557a30'];
const TR=['#ffd0a0','#ffa070','#f07050','#e04a3a','#c0302a','#9a2424','#701a20'];
function bigTitle(y,sc,wob){
  const word=(s,yy,cols)=>{const w=tw(s,sc);let x=160-w/2;for(let i=0;i<s.length;i++){const dy=wob?Math.round(Math.sin(S.clock*4+i*.7)*2):0;const ch=s[i];
    G=ctx;glyphs(ctx,ch,x+sc,yy+dy+sc+2,'#140a14',sc);for(const [ox,oy] of [[-2,0],[2,0],[0,-2],[0,2],[-2,-2],[2,2],[-2,2],[2,-2]])glyphs(ctx,ch,x+ox,yy+dy+oy,'#140a14',sc);glyphs(ctx,ch,x,yy+dy,cols,sc);x+=6*sc;}};
  word('CABIN',y,TG);word('FEVER',y+8*sc,TR);}
function bgScene(alpha){G=ctx;ctx.drawImage(GEO[1].bgN,0,16);ctx.drawImage(GEO[1].fgN,0,16);R(0,16,320,224,'rgba(10,6,20,'+alpha+')');}
function topBar(){R(0,0,320,16,'#1a121c');R(0,15,320,1,'#4a3a46');txt('1UP',8,4,'#e04a3a');txt(pad(S.score,7),30,4,'#f2e6d0');txt('HI-SCORE',160,4,'#e04a3a',1,'c');txt(pad(S.scores[0]?S.scores[0].s:0,7),312,4,'#f2e6d0',1,'r');}
function demo(){const t=S.clock;const px=((t*48)%420)-50,zx=px-46;
  drawHuman(ctx,px,206,2,Math.floor(t*8),PP,{});drawHuman(ctx,zx,206,2,Math.floor(t*5),PZ,{puke:(t%3)<.7});
  if((t%3)<.7){for(let i=0;i<6;i++){const k=((t*30+i*7)%14);R(zx+4+k*1.5,197+k*.6+(i%3),2,2,TG[(i%4)+2]);}}
  if(Math.floor(t)%6<3)bubble(zx,184,'REAL ART IS PAIN.');}
function drawTitle(){
  bgScene(.55);topBar();
  if(S.page===0){bigTitle(30,5,true);
    txt('A NIGHT OF HOT TAKES & HOT PUKE',160,118,'#9dbb6c',1,'c','#140a14');
    if(Math.floor(S.clock*2)%2)txtO(KT('PRESS ENTER TO START','TAP TO START'),160,140,'#f8c840',1,'c','#140a14');
    txt(KT('ARROWS/WASD MOVE  SPACE THROW  R RAP','DRAG TO MOVE   TAP THROW & RAP'),160,158,'#c8b8c8',1,'c','#140a14');
    demo();
  }else if(S.page===1){drawScoreTable(26,-1);if(Math.floor(S.clock*2)%2)txtO(KT('PRESS ENTER TO START','TAP TO START'),160,214,'#f8c840',1,'c','#140a14');}
  else drawHowTo();
  R(0,230,320,10,'#0e0a12');txt('(C) 2026 PUKEWARE   CREDIT 01   '+KT('M = SOUND ','SOUND ')+(muted?'OFF':'ON'),160,232,'#6a5a6a',1,'c');
  for(let i=0;i<3;i++)R(150+i*8,224,5,2,i===S.page?'#f8c840':'#4a3a46');
}
function drawHowTo(){
  txtO('HOW TO SURVIVE',160,26,'#f8c840',2,'c','#140a14');panel(14,46,292,170);
  let y=53;const row=(icon,a,b)=>{icon(24,y);txt(a,44,y,'#f2e6d0');txt(b,44,y+10,'#9a8aa8');y+=23;};
  row((x,yy)=>{sunMoon(x+2,yy+1,0);},'LAST UNTIL 6:00 AM','THEN THE EXIT OPENS. RUN FOR IT.');
  row((x,yy)=>{G=ctx;ell(x+6,yy+6,7,3,'#4e5a16');ell(x+6,yy+6,6,2,'#b4c03a');},'DODGE THE PUKE','PUDDLES LAST '+CFG.puddleLife+'S AND MAKE YOU SLIP.');
  row((x,yy)=>magIcon(x+2,yy),'GRAB ART & DANCE MAGS',KT('SPACE THROWS ONE. ZOMBIES STOP TO READ.','TAP THROW. ZOMBIES STOP TO READ.'));
  row((x,yy)=>micIcon(x+3,yy),KT('FIND A MIC, PRESS R','FIND A MIC, TAP RAP'),'TYPE EACH RAP LINE BEFORE TIME RUNS OUT.');
  row((x,yy)=>coinIcon(x+3,yy),KT('COLLECT COINS, PRESS B','COLLECT COINS, TAP KIOSKI'),KT('THE KIOSKI SELLS HELP. E = MAGIC PILL.','THE KIOSKI SELLS HELP. PILLS BEND TIME.'));
  row((x,yy)=>zhead(x+3,yy),'GET CAUGHT = YOU TURN','RESTART THE LEVEL WITH ONE MORE ZOMBIE.');
  row((x,yy)=>{if(TOUCH){R(x+3,yy+1,2,7,'#f8c840');R(x+7,yy+1,2,7,'#f8c840');}else txt('P',x+4,yy+2,'#f8c840');},KT('P PAUSE   M MUTE','PAUSE & SOUND BUTTONS'),LEVELS.length+' LEVELS. '+MAXZ+' ZOMBIES MAX, THEN GAME OVER.');
}
function drawScoreTable(y0,hl){
  txtO('HALL OF FAME',160,y0,'#f8c840',2,'c','#140a14');panel(40,y0+20,240,150);
  txt('RANK',52,y0+28,'#9a8aa8');txt('NAME',100,y0+28,'#9a8aa8');txt('SCORE',196,y0+28,'#9a8aa8',1,'r');txt('REACHED',268,y0+28,'#9a8aa8',1,'r');
  const ords=['1ST','2ND','3RD','4TH','5TH','6TH','7TH','8TH','9TH','10TH'];
  S.scores.slice(0,10).forEach((s,i)=>{const yy=y0+42+i*12;const on=i===hl;if(on&&Math.floor(S.clock*4)%2)return;
    const col=on?'#f8c840':i===0?'#f0a0c8':i<3?'#d8dc5a':'#f2e6d0';txt(ords[i],52,yy,col);txt(s.n,100,yy,col);txt(pad(s.s,7),196,yy,col,1,'r');txt(s.w==='ESC'?'ESCAPED':s.w,268,yy,s.w==='ESC'?'#9dbb6c':col,1,'r');});
}
function drawIntro(){
  ctx.fillStyle='#0e0a12';ctx.fillRect(0,0,W,H);G=ctx;
  txtO('LEVEL '+(S.level+1),160,46,'#f8c840',3,'c','#140a14',1);
  txt(L.d.name,160,78,'#f2e6d0',2,'c');
  if(L.recap){txtO('YOU WERE ZOMBIFIED!',160,104,'#9dbb6c',1,'c','#140a14');txt('THE LEVEL RESTARTS. NOW THERE ARE MORE OF THEM.',160,116,'#9a8aa8',1,'c');}else if(L.d.sub)txt(L.d.sub,160,100,'#9a8aa8',1,'c');
  const sk=L.d.zskin,n=L.zs.filter(z=>!z.k).length,foes=L.zs.filter(z=>z.k),forest=foes.some(z=>z.k==='granny'),fy=forest||L.d.tips?140:156,w=n*18+foes.length*24+(foes.length?6:0);
  for(let i=0;i<n;i++){const zx=160-w/2+9+i*18,hb=Math.floor(S.clock*3+i)%2,fr=Math.floor(S.clock*4)+i;
    if(sk)sk.draw(ctx,{x:zx,y:fy,i,read:0},hb,0,fr);else drawHuman(ctx,zx,fy,0,fr,PZ,{hb});}
  foes.forEach((z,i)=>FOES[z.k].draw(ctx,Object.assign({},z,{x:160-w/2+n*18+6+12+i*24,y:fy,dir:0,anim:0,read:0,busy:0,st:'prowl',dashT:1}),Math.floor(S.clock*3+i)%2));
  txt('FACING '+n+' '+(sk?sk.name:'ZOMBIE')+(n>1?'S':'')+foes.map(z=>' + '+(z.k==='granny'?'FRIENDLY GRANNY':FOES[z.k].name)).join(''),160,fy+10,n>=4?'#e04a3a':'#9dbb6c',1,'c');
  if(L.pending&&L.pending.length){const pz=L.pending.filter(w=>!w.k).length;txt('LATER TONIGHT: '+L.pending.filter(w=>w.k).map(w=>FOES[w.k].name).concat(L.d.later||[],pz?[pz+' ZOMBIE'+(pz>1?'S':'')]:[]).join(' + '),160,fy+20,'#9a8aa8',1,'c');}
  if(forest){
    txt('GRANNY IS HARMLESS. KEEP ZOMBIES AWAY.',160,174,'#f2e6d0',1,'c');
    txt('BITTEN? SHE THROWS SLIPPERY MUSHROOMS.',160,185,'#f0a0c8',1,'c');
    txt('KEEP HER SAFE UNTIL SUNRISE: +'+CFG.grannySafeBonus,160,196,'#9dbb6c',1,'c');
    txt('SURVIVE UNTIL 6:00 AM. THEN ESCAPE.',160,207,'#9a8aa8',1,'c');
  }else if(L.d.tips){L.d.tips.forEach(([s,col],i)=>txt(s,160,174+i*11,col,1,'c'));
  }else{const ly=L.pending&&L.pending.length?4:0;txt('SURVIVE UNTIL 6:00 AM',160,186+ly,'#f2e6d0',1,'c');txt('ESCAPE BONUS: '+CFG.escapeBonus+' X LEVEL X ZOMBIES',160,198+ly,'#9a8aa8',1,'c');}
  if(Math.floor(S.clock*2)%2)txt(KT('PRESS ENTER','TAP TO GO'),160,220,'#f8c840',1,'c');
}
function drawCenterCard(a,acol,lines,foot){const w=280,h=26+lines.length*12+24;const x=20,y=120-h/2;panel(x,y,w,h);txt(a,160,y+8,acol,2,'c','#140a14');
  lines.forEach((l,i)=>txt(l[0],160,y+28+i*12,l[1]||'#f2e6d0',1,'c'));if(foot&&Math.floor(S.clock*2)%2)txt(foot,160,y+h-12,'#f8c840',1,'c');}
/* The kiosk: what you can buy, what it costs and what you have. Rows sit at SHOPUI.row0 + i * SHOPUI.rowH (taps use the same numbers). */
const SHOPICON={mags:(x,y)=>magIcon(x,y),mic:(x,y)=>micIcon(x+1,y-1),pill:(x,y)=>pillIcon(x,y),freeze:(x,y)=>txt('*',x+1,y,'#9ad8f8'),ff:(x,y)=>txt('>>',x-2,y,'#f8c840'),reset:(x,y)=>zhead(x,y)};
function drawShop(){const sh=L.shop,u=SHOPUI;if(!sh)return;R(0,16,320,224,'rgba(10,6,20,.6)');panel(u.x,u.y,u.w,u.h);
  txt('KIOSKI',160,u.y+7,'#f8c840',2,'c','#140a14');coinIcon(u.x+10,u.y+10);txt(S.money+'€',u.x+21,u.y+11,'#f8c840');txt('OPEN 24H',u.x+u.w-10,u.y+11,'#9a8aa8',1,'r');
  SHOP.forEach((it,i)=>{const y=u.row0+i*u.rowH,on=i===sh.sel,price=CFG.prices[it.k],can=it.ok()&&S.money>=price;
    if(on){R(u.x+6,y-4,u.w-12,15,'#3a2c3a');R(u.x+6,y-4,2,15,'#f8c840');}
    txt(String(i+1),u.x+14,y,on?'#f8c840':'#9a8aa8');SHOPICON[it.k](u.x+27,y);
    txt(it.name,u.x+44,y,can?'#f2e6d0':'#6a5a6a');txt(price+'€',u.x+u.w-14,y,can?'#f8c840':it.ok()?'#e04a3a':'#6a5a6a',1,'r');});
  const it=SHOP[sh.sel],no=typeof it.no==='function'?it.no():it.no;
  txt(sh.msgT>0?sh.msg:it.ok()?it.desc:no,160,u.y+u.h-40,sh.msgT>0?sh.col:it.ok()?'#9dbb6c':'#9a8aa8',1,'c');
  txt(KT('1-6 OR ENTER BUYS. UP/DOWN PICKS.','TAP AN ITEM, THEN BUY.'),160,u.y+u.h-25,'#9a8aa8',1,'c');txt(KT('B OR ESC GOES BACK TO THE GAME.','CLOSE GOES BACK TO THE GAME.'),160,u.y+u.h-14,'#9a8aa8',1,'c');}
function drawEntry(){
  bgScene(.75);topBar();const e=S.entry;
  txtO('NEW HIGH SCORE!',160,30,'#f8c840',2,'c','#140a14');txt(pad(S.score,7),160,52,'#f2e6d0',3,'c','#140a14');
  txt('RANK '+(e.rank+1)+' OF 10',160,80,'#9dbb6c',1,'c');txt('ENTER YOUR INITIALS',160,100,'#f2e6d0',1,'c');
  for(let i=0;i<3;i++){const x=106+i*40;panel(x,116,28,36);const on=i===e.pos;txt(e.l[i],x+14,124,on?'#f8c840':'#f2e6d0',3,'c');if(on&&Math.floor(S.clock*4)%2)R(x+4,148,20,2,'#f8c840');}
  txt(KT('TYPE A-Z  OR  UP/DOWN TO CHANGE','TAP THE LETTERS ON THE KEYBOARD'),160,170,'#9a8aa8',1,'c');txt(KT('LEFT/RIGHT MOVE   ENTER CONFIRM','DEL GOES BACK   OK CONFIRMS'),160,182,'#9a8aa8',1,'c');
  drawHuman(ctx,60,214,0,Math.floor(S.clock*4),PZ,{hb:Math.floor(S.clock*3)%2});drawHuman(ctx,260,214,0,0,PP,{hb:Math.floor(S.clock*3)%2,mic:true});
}
function drawScores(){
  bgScene(.7);topBar();drawScoreTable(22,S.lastIdx);
  txt(KT('S = MAKE SHARE CARD    ENTER = TITLE','SHARE CARD MAKES AN IMAGE TO BRAG WITH'),160,206,'#f2e6d0',1,'c','#140a14');
  if(Math.floor(S.clock*1.5)%2)txt('* SCREENSHOT THIS SCREEN TO BRAG *',160,220,'#f0a0c8',1,'c');
}
function draw(){
  G=ctx;ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const m=S.mode;
  if(m==='title'){drawTitle();return;}
  if(m==='intro'){drawIntro();return;}
  if(m==='entry'){drawEntry();return;}
  if(m==='scores'){drawScores();return;}
  if(!L)return;
  drawWorld(m==='caught'&&S.t<1.4);drawHUD();G=ctx;
  if(m==='play'||m==='pause'){ctx.save();ctx.translate(0,OY);ctx.restore();drawBanner();
    if(L.grace>0&&m==='play')txtO(L.grace>.5?'GET READY':'GO!',160,96,'#f8c840',2,'c','#140a14');
    if(L.vibe>0)txtO('VIBING '+Math.ceil(L.vibe),160,22,'#f0a0c8',1,'c','#140a14');drawEffects();}
  if(m==='rap')drawRap();
  if(m==='shop')drawShop();
  if(m==='pause')drawCenterCard('PAUSED','#f8c840',[[KT('P OR ENTER TO RESUME','TAP RESUME TO PLAY ON')],[KT('R TO RESTART FROM LEVEL '+(URL_LEVEL||CFG.startLevel||1),'RESTART BEGINS AT LEVEL '+(URL_LEVEL||CFG.startLevel||1)),'#9a8aa8'],[KT('Q TO QUIT TO TITLE','QUIT GOES BACK TO THE TITLE'),'#9a8aa8'],[KT('M SOUND ','SOUND ')+(muted?'OFF':'ON'),'#9a8aa8']],'');
  if(m==='caught'){const cc=L.catcher?FOEQ[L.catcher].card:['ZOMBIFIED!','YOU PUKED. YOU TURNED. YOU RESTART.'];const last=L.instant?'THAT ENDS THE GAME. NO NEXT ROUND.':S.zombies>=MAXZ?'THAT WAS YOUR LAST LIFE.':''; // never promise a round with more zombies than the maximum
    if(S.t>1.3)drawCenterCard(cc[0],'#9dbb6c',[[last&&!L.catcher?'YOU PUKED. YOU TURNED.':cc[1]],last?[last,'#e04a3a']:['NEXT ROUND: '+(S.zombies+1)+' ZOMBIES','#9a8aa8']],'');}
  if(m==='clear'){const lines=[[L.d.why[0]],[L.d.why[1],'#9a8aa8'],['ESCAPE BONUS +'+L.bonus,'#9dbb6c'],[CFG.escapeBonus+' X LEVEL '+(S.level+1)+' X '+S.zombies+' ZOMBIE'+(S.zombies>1?'S':''),'#9a8aa8']];
    if(L.grannySaved)lines.push(['GRANNY SAFE AT SUNRISE +'+L.grannyBonus,'#f8c840']);
    drawCenterCard('YOU ESCAPED!','#f8c840',lines,KT('PRESS ENTER','TAP TO CONTINUE'));}
  if(m==='gameover'&&S.cp>=0){R(0,16,320,224,'rgba(10,6,20,.6)');drawCenterCard('GAME OVER','#e04a3a',[[L.instant?'HR HAS CLEARED YOUR DESK.':'THE CABIN IS ALL ZOMBIES NOW.'],['BUT YOU FOUND A CHECKPOINT!','#f8c840'],
    [KT('ENTER = RETRY LEVEL '+(S.cp+1)+', FRESH LIVES','CONTINUE = RETRY LEVEL '+(S.cp+1)+', FRESH LIVES')],[KT('Q = GIVE UP, SAVE YOUR SCORE','GIVE UP = SAVE YOUR SCORE'),'#9a8aa8']],KT('PRESS ENTER','TAP TO CONTINUE'));}
  else if(m==='gameover'){R(0,16,320,224,'rgba(10,6,20,.6)');drawCenterCard('GAME OVER','#e04a3a',[[L.instant?'HR HAS CLEARED YOUR DESK.':'THE CABIN IS ALL ZOMBIES NOW.'],[L.instant?'YOUR BADGE NO LONGER WORKS.':'THEY ARE ARGUING ABOUT TOYOTAS.','#9a8aa8'],['FINAL SCORE '+pad(S.score,7),'#f8c840']],KT('PRESS ENTER','TAP TO CONTINUE'));}
  if(m==='victory'){R(0,16,320,224,'rgba(10,6,20,.55)');drawCenterCard('YOU SURVIVED!','#f8c840',[[(['ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE'][LEVELS.length-1]||LEVELS.length)+' NIGHTS. ZERO BRAINS EATEN.'],['THE ZOMBIES WENT BACK TO THEIR PODCASTS.','#9a8aa8'],['FINAL SCORE '+pad(S.score,7),'#9dbb6c']],KT('PRESS ENTER','TAP TO CONTINUE'));}
}

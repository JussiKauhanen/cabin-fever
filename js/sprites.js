"use strict";
/* Characters (player + zombie) drawn from rectangles, plus small HUD icons. */
const PP={o:'#24161e',skin:'#f2c49a',skinDk:'#d89a78',hair:'#c8382e',hairLt:'#ec6a50',shirt:'#efe4cf',shirtDk:'#c4b29c',pants:'#3d3558',shoe:'#24161e',eye:'#24161e',cheek:'#e8968a'};
const PZ={o:'#18160f',skin:'#9dbb6c',skinDk:'#6f8f4c',hair:'#3d4a36',hairLt:'#5a6c4c',shirt:'#3e8f8c',shirtDk:'#2a6464',pants:'#4a3d5c',shoe:'#18160f',eye:'#ff4a3a',cheek:'#6f8f4c',z:1};
/* dir: 0 down, 1 up, 2 right, 3 left. (x,y) = feet centre */
function drawHuman(c,x,y,dir,fr,P,o){
  o=o||{};const ox=Math.round(x)-6+(o.dx||0),oy=Math.round(y)-17+(o.dy||0);
  const hb=o.hb||0,flip=dir===3,side=dir>=2,st=fr&3;const parts=[];
  const p=(px,py,w,h,col,hd,no)=>{if(flip)px=12-px-w;parts.push([ox+px,oy+py+(hd?hb:0),w,h,col,no]);};
  c.fillStyle='rgba(12,6,20,.38)';c.fillRect(ox+2,oy+16,8,2);c.fillRect(ox+1,oy+17,10,1);
  if(!side){
    const l1=st===1?1:0,l2=st===3?1:0;
    p(3,13,2,4-l1,P.pants);p(7,13,2,4-l2,P.pants);p(3,16-l1,2,1,P.shoe,0,1);p(7,16-l2,2,1,P.shoe,0,1);
    p(2,8,8,5,P.shirt);p(2,12,8,1,P.shirtDk,0,1);
    if(P.z){p(4,10,1,1,P.skinDk,0,1);p(7,9,1,2,P.skin,0,1);
      if(dir===0){p(1,7,2,4,P.shirtDk);p(9,7,2,4,P.shirtDk);p(1,10,2,2,P.skin);p(9,10,2,2,P.skin);}
      else{p(1,8,1,4,P.shirtDk);p(10,8,1,4,P.shirtDk);}}
    else{const a=st===1?1:st===3?-1:0;p(1,8+Math.max(0,a),1,4,P.shirtDk);p(10,8+Math.max(0,-a),1,4,P.shirtDk);p(1,11+Math.max(0,a),1,1,P.skin,0,1);p(10,11+Math.max(0,-a),1,1,P.skin,0,1);}
    if(dir===0){
      p(2,1,8,7,P.skin,1);p(2,1,8,3,P.hair,1);p(2,4,1,3,P.hair,1,1);p(9,4,1,3,P.hair,1,1);p(3,0,4,1,P.hair,1);p(4,1,3,1,P.hairLt,1,1);
      if(P.z){p(7,0,2,1,P.hair,1);p(4,5,1,1,P.eye,1,1);p(7,5,1,1,P.eye,1,1);p(3,6,1,1,P.cheek,1,1);p(o.puke?4:5,7,o.puke?4:2,1,'#3a1418',1,1);}
      else{p(4,5,1,2,P.eye,1,1);p(7,5,1,2,P.eye,1,1);p(3,6,1,1,P.cheek,1,1);p(8,6,1,1,P.cheek,1,1);}
    }else{p(2,1,8,7,P.hair,1);p(3,0,4,1,P.hair,1);p(3,2,2,4,P.hairLt,1,1);p(7,3,1,3,P.hairLt,1,1);}
  }else{
    const f=st===1||st===3;
    if(!f){p(4,13,2,4,P.pants);p(6,13,2,4,P.pants);p(4,16,2,1,P.shoe,0,1);p(6,16,3,1,P.shoe,0,1);}
    else{p(3,13,2,4,P.pants);p(7,13,2,4,P.pants);p(3,16,2,1,P.shoe,0,1);p(7,16,3,1,P.shoe,0,1);}
    p(3,8,6,5,P.shirt);p(3,12,6,1,P.shirtDk,0,1);
    if(P.z){p(6,9,4,2,P.shirtDk);p(10,9,2,2,P.skin);p(4,10,1,1,P.skinDk,0,1);}
    else{const a=st===1?1:st===3?-1:0;p(5+a,9,2,3,P.shirtDk);p(5+a,12,2,1,P.skin,0,1);}
    p(3,1,7,7,P.skin,1);p(3,1,7,3,P.hair,1);p(3,4,3,3,P.hair,1,1);p(3,0,5,1,P.hair,1);p(5,1,3,1,P.hairLt,1,1);
    p(8,5,1,P.z?1:2,P.eye,1,1);
    if(P.z)p(o.puke?7:8,7,o.puke?3:2,1,'#3a1418',1,1);else p(8,7,1,1,P.cheek,1,1);
  }
  c.fillStyle=P.o;for(const q of parts)if(!q[5])c.fillRect(q[0]-1,q[1]-1,q[2]+2,q[3]+2);
  for(const q of parts){c.fillStyle=q[4];c.fillRect(q[0],q[1],q[2],q[3]);}
  if(o.read){c.fillStyle='#24161e';c.fillRect(ox+1,oy+8,10,7);c.fillStyle='#f2e6d0';c.fillRect(ox+2,oy+9,4,5);c.fillStyle='#e8dcc8';c.fillRect(ox+6,oy+9,4,5);
    c.fillStyle=o.read===1?'#e05a8a':'#3ac0d0';c.fillRect(ox+3,oy+10,2,2);c.fillRect(ox+7,oy+10,2,1);c.fillStyle='#8a7a8a';c.fillRect(ox+7,oy+12,2,1);c.fillRect(ox+3,oy+13,2,1);}
  if(o.mic){const mx=ox+(dir===3?0:10),my=oy+7+hb;c.fillStyle='#24161e';c.fillRect(mx-1,my-1,4,7);c.fillStyle='#c8c8d8';c.fillRect(mx,my,2,2);c.fillStyle='#3a3a48';c.fillRect(mx,my+2,2,3);}
}
function zhead(x,y){R(x,y,7,7,'#18160f');R(x+1,y+1,5,5,'#9dbb6c');R(x+1,y+1,5,2,'#3d4a36');R(x+2,y+4,1,1,'#ff4a3a');R(x+4,y+4,1,1,'#ff4a3a');}
function magIcon(x,y){R(x,y,8,7,'#24161e');R(x+1,y+1,6,5,'#e05a8a');R(x+2,y+2,3,1,'#fff');R(x+3,y+4,2,1,'#f0d040');}
function micIcon(x,y){R(x+1,y,5,5,'#24161e');R(x+2,y+1,3,3,'#c8c8d8');R(x+2,y+4,3,4,'#24161e');R(x+3,y+5,1,2,'#5a5a6a');}

/* HGroup Fundation — opening animation: gold logo, rising chart, money stacks multiplying at its feet. */
(function(){
  const el=document.getElementById('splash');if(!el)return;
  let done=false,raf=0;
  function finish(){if(done)return;done=true;cancelAnimationFrame(raf);el.classList.add('out');setTimeout(()=>{el.remove()},520)}
  el.addEventListener('click',finish);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finish()});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){setTimeout(finish,700);return}
  const cv=document.getElementById('splash-c'),ctx=cv.getContext('2d');
  const END=3.6;

  /* ---------- helpers ---------- */
  const clamp=v=>v<0?0:v>1?1:v;
  const lerp=(a,b,k)=>a+(b-a)*k;
  const eOut=k=>1-Math.pow(1-k,3);
  const eBack=k=>{const c=1.6;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
  const eBounce=k=>{const n=7.5625,d=2.75;if(k<1/d)return n*k*k;if(k<2/d)return n*(k-=1.5/d)*k+.75;if(k<2.5/d)return n*(k-=2.25/d)*k+.9375;return n*(k-=2.625/d)*k+.984375};
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
  function goldGrad(c,x0,y0,x1,y1){const g=c.createLinearGradient(x0,y0,x1,y1);
    g.addColorStop(0,'#5E3B0D');g.addColorStop(.18,'#B07A22');g.addColorStop(.38,'#F3D485');g.addColorStop(.5,'#FFF4D2');g.addColorStop(.62,'#E8B858');g.addColorStop(.82,'#9A651B');g.addColorStop(1,'#4F310A');return g}

  /* ---------- banknote textures ---------- */
  const NOTES={
    g:{a:'#86B48A',b:'#3E6E4B',ink:'#24452F',lite:'#D7E9CF',edge1:'#DCE7D4',edge2:'#A9BFA1',val:'100'},
    o:{a:'#E9AC72',b:'#A65B29',ink:'#6E3612',lite:'#F8DEC0',edge1:'#F1DEC8',edge2:'#C9A27D',val:'50'},
    p:{a:'#B79AD0',b:'#6A4C8C',ink:'#3E2A57',lite:'#E7DCF2',edge1:'#E6DEEE',edge2:'#B3A3C6',val:'500'}
  };
  function makeBill(k,banded){
    const n=NOTES[k],iw=320,ih=160,c=document.createElement('canvas');c.width=iw;c.height=ih;const g=c.getContext('2d');
    const bg=g.createLinearGradient(0,0,iw,ih);bg.addColorStop(0,n.a);bg.addColorStop(1,n.b);
    rr(g,0,0,iw,ih,6);g.fillStyle=bg;g.fill();g.save();rr(g,0,0,iw,ih,6);g.clip();
    g.strokeStyle='rgba(255,255,255,.10)';g.lineWidth=1;
    for(let w=0;w<14;w++){g.beginPath();for(let x=0;x<=iw;x+=4){const y=ih*.5+Math.sin(x*.045+w*.7)*ih*(.08+w*.025);x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
    g.fillStyle='rgba(255,255,255,.22)';rr(g,iw*.56,ih*.16,iw*.28,ih*.68,ih*.14);g.fill();
    g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.stroke();
    g.fillStyle='#F7D96A';for(let s=0;s<12;s++){const a=s/12*Math.PI*2;g.beginPath();g.arc(iw*.2+Math.cos(a)*ih*.2,ih*.5+Math.sin(a)*ih*.2,3.2,0,7);g.fill()}
    g.fillStyle=n.lite;g.font='800 46px -apple-system,system-ui,sans-serif';g.textBaseline='alphabetic';g.fillText(n.val,iw*.33,ih*.44);
    g.font='800 22px -apple-system,system-ui,sans-serif';g.fillStyle='rgba(255,255,255,.75)';g.fillText(n.val,iw*.86-g.measureText(n.val).width*.5,ih*.92);
    g.font='700 13px -apple-system,system-ui,sans-serif';g.fillStyle=n.ink;g.globalAlpha=.7;g.fillText('EURO',iw*.33,ih*.62);g.globalAlpha=1;
    g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=3;rr(g,7,7,iw-14,ih-14,4);g.stroke();
    const vg=g.createRadialGradient(iw/2,ih/2,ih*.3,iw/2,ih/2,iw*.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.28)');g.fillStyle=vg;g.fillRect(0,0,iw,ih);
    if(banded){const bx=iw*.44,bw=iw*.13,bg2=g.createLinearGradient(bx,0,bx+bw,0);bg2.addColorStop(0,'#CDB98A');bg2.addColorStop(.5,'#F6EDD6');bg2.addColorStop(1,'#C3AD79');
      g.fillStyle=bg2;g.fillRect(bx,0,bw,ih);g.fillStyle='#B38A35';g.fillRect(bx,0,2.5,ih);g.fillRect(bx+bw-2.5,0,2.5,ih);
      g.save();g.translate(bx+bw/2,ih/2);g.rotate(-Math.PI/2);g.fillStyle='#8A6420';g.font='800 15px -apple-system,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('10.000 €',0,1);g.restore()}
    g.restore();return c;
  }
  const BILL={},BAND={},EDGE={};
  for(const k in NOTES){BILL[k]=makeBill(k,false);BAND[k]=makeBill(k,true);
    const e=document.createElement('canvas');e.width=1;e.height=6;const eg=e.getContext('2d');
    eg.fillStyle=NOTES[k].edge1;eg.fillRect(0,0,1,6);eg.fillStyle=NOTES[k].edge2;eg.fillRect(0,2,1,1);eg.fillRect(0,5,1,1);EDGE[k]=e}

  /* ---------- layout ---------- */
  let W,H,DPR,S,cx,L,logoTop,floorB,floorF,textY,stacks,chart,bills,dust;
  function layout(){
    S=Math.min(W*.98,H*.6);cx=W/2;L=S*.4;
    const block=L+S*.5;logoTop=Math.max(H*.08,(H-block)/2+H*.02);
    floorB=logoTop+L+S*.07;floorF=floorB+S*.1;textY=floorF+S*.17;
    const w=S*.2,d=S*.1;
    stacks=[
      {x:cx,y:floorF,w,d,h:S*.15,k:'g',o:0},
      {x:cx-S*.115,y:floorB,w,d,h:S*.11,k:'o',o:1},
      {x:cx+S*.115,y:floorB,w,d,h:S*.12,k:'g',o:2},
      {x:cx-S*.23,y:floorF,w,d,h:S*.1,k:'g',o:3},
      {x:cx+S*.23,y:floorF,w,d,h:S*.09,k:'p',o:4},
      {x:cx-S*.34,y:floorB,w,d,h:S*.075,k:'g',o:5},
      {x:cx+S*.34,y:floorB,w,d,h:S*.085,k:'o',o:6}
    ].map(s=>({...s,t0:.75+s.o*.17}));
    stacks.coins=[{x:cx-S*.44,y:floorF+S*.02,n:14,t0:1.85},{x:cx+S*.44,y:floorF+S*.02,n:11,t0:2.0}];
    const R=rng(7),N=26,x0=W*.03,x1=W*.97,yb=floorB-S*.03,yt=Math.max(H*.06,logoTop-S*.2);
    chart={pts:[],yb,yt};
    for(let i=0;i<N;i++){const f=i/(N-1);let y=yb+(yt-yb)*Math.pow(f,1.55)+(R()-.5)*S*.09*(1-f*.6);if(i%5===3)y+=S*.04*(1-f);if(i===N-1)y=yt;chart.pts.push([lerp(x0,x1,f),y])}
    const Rb=rng(11);bills=[];for(let i=0;i<11;i++)bills.push({x:Rb()*W,t0:1.6+Rb()*1.5,vy:H*(.32+Rb()*.25),rot:Rb()*6,vr:(Rb()-.5)*3,ph:Rb()*6,vp:3+Rb()*4,sc:.75+Rb()*.4,k:['g','o','g','p'][i%4],sway:(Rb()-.5)*W*.15});
    const Rd=rng(5);dust=[];for(let i=0;i<70;i++)dust.push({x:Rd()*W,y:Rd()*H,r:.5+Rd()*1.6,sp:8+Rd()*26,ph:Rd()*6});
  }
  function size(){DPR=Math.min(3,window.devicePixelRatio||1);W=window.innerWidth;H=window.innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);layout()}
  size();addEventListener('resize',size);

  /* ---------- drawing ---------- */
  function face(pts){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath()}
  function drawStack(s,t){
    const k=clamp((t-s.t0)/.42);if(k<=0)return;
    const drop=(1-eBounce(k))*S*.55,grow=eOut(clamp((t-s.t0-.18)/.85));
    const h=Math.max(S*.012,Math.floor((S*.012+(s.h-S*.012)*grow)/1.5)*1.5);
    const ox=s.d*.62,oy=-s.d*.5,x0=s.x-s.w/2,x1=s.x+s.w/2,base=s.y-drop,top=base-h;
    ctx.save();ctx.globalAlpha=clamp(k*3);
    // floor shadow
    const sh=ctx.createRadialGradient(s.x+ox*.5,s.y+oy*.3,2,s.x+ox*.5,s.y+oy*.3,s.w*.75);sh.addColorStop(0,'rgba(0,0,0,.6)');sh.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sh;ctx.save();ctx.translate(s.x+ox*.5,s.y+oy*.3);ctx.scale(1,.32);ctx.translate(-(s.x+ox*.5),-(s.y+oy*.3));ctx.beginPath();ctx.arc(s.x+ox*.5,s.y+oy*.3,s.w*.75,0,7);ctx.fill();ctx.restore();
    const pat=ctx.createPattern(EDGE[s.k],'repeat');
    // right side
    face([[x1,top],[x1+ox,top+oy],[x1+ox,base+oy],[x1,base]]);ctx.fillStyle=pat;ctx.fill();ctx.fillStyle='rgba(20,12,0,.38)';ctx.fill();
    // front
    ctx.fillStyle=pat;ctx.fillRect(x0,top,s.w,h);
    const fg=ctx.createLinearGradient(x0,0,x1,0);fg.addColorStop(0,'rgba(0,0,0,.28)');fg.addColorStop(.6,'rgba(255,240,200,.06)');fg.addColorStop(1,'rgba(0,0,0,.12)');ctx.fillStyle=fg;ctx.fillRect(x0,top,s.w,h);
    const vg=ctx.createLinearGradient(0,top,0,base);vg.addColorStop(0,'rgba(255,255,255,.12)');vg.addColorStop(1,'rgba(0,0,0,.3)');ctx.fillStyle=vg;ctx.fillRect(x0,top,s.w,h);
    // band on front + side
    const bx=x0+s.w*.44,bw=s.w*.13,bg=ctx.createLinearGradient(bx,0,bx+bw,0);bg.addColorStop(0,'#B79E66');bg.addColorStop(.5,'#F3E7C9');bg.addColorStop(1,'#A98F58');
    ctx.fillStyle=bg;ctx.fillRect(bx,top,bw,h);ctx.fillStyle='rgba(120,85,25,.9)';ctx.fillRect(bx,top,1,h);ctx.fillRect(bx+bw-1,top,1,h);
    // top face (bill image mapped onto parallelogram)
    const img=BAND[s.k];ctx.save();
    ctx.setTransform(DPR*s.w/img.width,0,-DPR*ox/img.height,-DPR*oy/img.height,DPR*(x0+ox),DPR*(top+oy));
    ctx.drawImage(img,0,0);
    const gl=ctx.createLinearGradient(0,0,img.width,img.height);gl.addColorStop(0,'rgba(255,255,255,.22)');gl.addColorStop(.45,'rgba(255,255,255,0)');gl.addColorStop(1,'rgba(0,0,0,.1)');ctx.fillStyle=gl;ctx.fillRect(0,0,img.width,img.height);
    ctx.restore();
    ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=.6;face([[x0,top],[x1,top],[x1+ox,top+oy],[x0+ox,top+oy]]);ctx.stroke();ctx.strokeRect(x0,top,s.w,h);
    ctx.restore();
    // landing flash
    const lk=(t-s.t0-.42)/.35;if(lk>0&&lk<1){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-lk)*.55;ctx.strokeStyle='#FFD98A';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x+ox*.5,s.y+oy*.3,s.w*(.4+lk*.6),s.w*(.4+lk*.6)*.25,0,0,7);ctx.stroke();ctx.restore()}
    // sparkle
    if(grow>.6){const p=(t*1.1+s.o*.37)%1;if(p<.28){const a=Math.sin(p/.28*Math.PI);star(x0+s.w*(.2+((s.o*37)%60)/100)+ox*.4,top+oy*.4,S*.03*a,a)}}
  }
  function drawCoins(c,t){
    const n=Math.floor(c.n*eOut(clamp((t-c.t0)/.9)));if(n<=0)return;
    const r=S*.048,th=S*.011,ry=r*.34;
    const sh=ctx.createRadialGradient(c.x,c.y,1,c.x,c.y,r*1.6);sh.addColorStop(0,'rgba(0,0,0,.55)');sh.addColorStop(1,'rgba(0,0,0,0)');
    ctx.save();ctx.translate(c.x,c.y);ctx.scale(1,.35);ctx.fillStyle=sh;ctx.beginPath();ctx.arc(0,0,r*1.6,0,7);ctx.fill();ctx.restore();
    for(let i=0;i<n;i++){const x=c.x+Math.sin(i*1.9)*r*.07,yb=c.y-i*th,g=ctx.createLinearGradient(x-r,0,x+r,0);
      g.addColorStop(0,'#5A3A0C');g.addColorStop(.3,'#D9A441');g.addColorStop(.48,'#FFF0BE');g.addColorStop(.7,'#C38A2C');g.addColorStop(1,'#4E3209');
      ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,yb,r,ry,0,0,Math.PI);ctx.lineTo(x-r,yb-th);ctx.ellipse(x,yb-th,r,ry,0,Math.PI,0,true);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(60,35,5,.55)';ctx.lineWidth=.6;ctx.beginPath();ctx.ellipse(x,yb,r,ry,0,0,Math.PI);ctx.stroke();
      if(i===n-1){const tg=ctx.createRadialGradient(x-r*.3,yb-th-ry*.4,1,x,yb-th,r);tg.addColorStop(0,'#FFF6D6');tg.addColorStop(.5,'#E9BC5A');tg.addColorStop(1,'#A06C1E');
        ctx.fillStyle=tg;ctx.beginPath();ctx.ellipse(x,yb-th,r,ry,0,0,7);ctx.fill();ctx.strokeStyle='rgba(120,80,20,.8)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,yb-th,r*.78,ry*.78,0,0,7);ctx.stroke();
        ctx.save();ctx.translate(x,yb-th);ctx.scale(1,.34);ctx.fillStyle='rgba(110,70,15,.85)';ctx.font=`800 ${r*1.05}px -apple-system,system-ui,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('€',0,r*.05);ctx.restore()}
    }
  }
  function star(x,y,s,a){if(s<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.translate(x,y);
    const g=ctx.createRadialGradient(0,0,0,0,0,s);g.addColorStop(0,'rgba(255,255,240,1)');g.addColorStop(.3,'rgba(255,215,130,.8)');g.addColorStop(1,'rgba(255,190,80,0)');ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(0,-s);ctx.quadraticCurveTo(0,0,s,0);ctx.quadraticCurveTo(0,0,0,s);ctx.quadraticCurveTo(0,0,-s,0);ctx.quadraticCurveTo(0,0,0,-s);ctx.fill();ctx.restore()}
  function logoPath(){const w=L*.248,gap=L*.352,tw=w*2+gap,r=L*.05,x=cx-tw/2,y=logoTop,cb=L*.184,c0=y+L/2-cb/2,c1=y+L/2+cb/2,p=new Path2D();
    const B=y+L,xi=x+w,xj=x+w+gap,xr=x+tw;
    p.moveTo(x+r,y);p.arcTo(xi,y,xi,y+r,r);p.lineTo(xi,c0);p.lineTo(xj,c0);p.lineTo(xj,y+r);p.arcTo(xj,y,xj+r,y,r);p.arcTo(xr,y,xr,y+r,r);
    p.arcTo(xr,B,xr-r,B,r);p.arcTo(xj,B,xj,B-r,r);p.lineTo(xj,c1);p.lineTo(xi,c1);p.lineTo(xi,B-r);p.arcTo(xi,B,xi-r,B,r);p.arcTo(x,B,x,B-r,r);p.arcTo(x,y,x+r,y,r);p.closePath();
    return{p,x,y,tw}}
  function drawLogo(t){
    const a=clamp((t-.1)/.45);if(a<=0)return;const sc=.8+.2*eBack(clamp((t-.1)/.7)),{p,x,y,tw}=logoPath(),mx=cx,my=logoTop+L/2;
    ctx.save();ctx.globalAlpha=a;ctx.translate(mx,my);ctx.scale(sc,sc);ctx.translate(-mx,-my);
    ctx.shadowColor='rgba(255,180,60,.55)';ctx.shadowBlur=40*DPR;ctx.fillStyle=goldGrad(ctx,x,y,x+tw,y+L);ctx.fill(p,'nonzero');ctx.shadowBlur=0;
    ctx.fillStyle=goldGrad(ctx,x,y,x+tw,y+L);ctx.fill(p,'nonzero');
    ctx.save();ctx.clip(p,'nonzero');
    const hl=ctx.createLinearGradient(0,y,0,y+L);hl.addColorStop(0,'rgba(255,255,255,.35)');hl.addColorStop(.25,'rgba(255,255,255,0)');hl.addColorStop(.8,'rgba(0,0,0,0)');hl.addColorStop(1,'rgba(0,0,0,.35)');ctx.fillStyle=hl;ctx.fillRect(x-5,y-5,tw+10,L+10);
    for(const [s0,dur] of [[.95,.6],[2.55,.6]]){const k=clamp((t-s0)/dur);if(k>0&&k<1){const sx=lerp(x-L*.6,x+tw+L*.6,eOut(k));ctx.save();ctx.translate(sx,my);ctx.rotate(.35);
      const sg=ctx.createLinearGradient(-L*.16,0,L*.16,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.85)');sg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=sg;ctx.fillRect(-L*.16,-L,L*.32,L*2);ctx.restore()}}
    ctx.restore();
    ctx.lineWidth=Math.max(1,L*.01);const sg=ctx.createLinearGradient(0,y,0,y+L);sg.addColorStop(0,'rgba(255,246,214,.8)');sg.addColorStop(1,'rgba(70,40,5,.8)');ctx.strokeStyle=sg;ctx.stroke(p);
    ctx.restore();
  }
  function drawChart(t){
    const pr=eOut(clamp((t-.25)/1.7));if(pr<=0)return;const P=chart.pts,N=P.length,fi=pr*(N-1),n=Math.floor(fi),fr=fi-n;
    const pts=P.slice(0,n+1);if(n<N-1)pts.push([lerp(P[n][0],P[n+1][0],fr),lerp(P[n][1],P[n+1][1],fr)]);const tip=pts[pts.length-1];
    // volume bars
    ctx.save();ctx.globalAlpha=.09*clamp(t/.8);const R=rng(3);
    for(let i=0;i<N;i++){if(P[i][0]>tip[0])break;const bh=S*(.03+.09*(i/N)+R()*.04);ctx.fillStyle=i%4===2?'#E8B858':'#FFD98A';ctx.fillRect(P[i][0]-S*.012,chart.yb-bh+S*.03,S*.024,bh)}
    ctx.restore();
    // area
    const ag=ctx.createLinearGradient(0,chart.yt,0,chart.yb);ag.addColorStop(0,'rgba(255,196,90,.30)');ag.addColorStop(1,'rgba(255,196,90,0)');
    ctx.beginPath();ctx.moveTo(pts[0][0],chart.yb+S*.03);pts.forEach(q=>ctx.lineTo(q[0],q[1]));ctx.lineTo(tip[0],chart.yb+S*.03);ctx.closePath();ctx.fillStyle=ag;ctx.fill();
    // line
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.shadowColor='rgba(255,190,80,.9)';ctx.shadowBlur=14*DPR;
    const lg=ctx.createLinearGradient(P[0][0],0,P[N-1][0],0);lg.addColorStop(0,'rgba(255,205,120,.35)');lg.addColorStop(1,'#FFE7A6');ctx.strokeStyle=lg;ctx.lineWidth=Math.max(2,S*.008);
    ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.restore();
    // tip
    ctx.save();ctx.globalCompositeOperation='lighter';const ring=(t*1.6)%1;ctx.globalAlpha=1-ring;ctx.strokeStyle='#FFD98A';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(tip[0],tip[1],4+ring*S*.05,0,7);ctx.stroke();
    ctx.globalAlpha=1;star(tip[0],tip[1],S*.045,1);ctx.restore();
    if(pr>=.999){const a=P[N-2],b=P[N-1],ang=Math.atan2(b[1]-a[1],b[0]-a[0]),s=S*.035;ctx.save();ctx.translate(b[0],b[1]);ctx.rotate(ang);ctx.fillStyle='#FFE7A6';ctx.beginPath();ctx.moveTo(s*.9,0);ctx.lineTo(-s*.5,-s*.6);ctx.lineTo(-s*.5,s*.6);ctx.closePath();ctx.fill();ctx.restore()}
  }
  function spaced(str,x,y,spacing){let w=0;const ws=[...str].map(ch=>{const m=ctx.measureText(ch).width;w+=m+spacing;return m});w-=spacing;let px=x-w/2;[...str].forEach((ch,i)=>{ctx.fillText(ch,px,y);px+=ws[i]+spacing})}
  function frame(now){
    const t=(now-t0)/1000;
    ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    ctx.fillStyle='#060708';ctx.fillRect(0,0,W,H);
    const my=logoTop+L/2,glow=clamp(t/.9);
    const bg=ctx.createRadialGradient(cx,my,0,cx,my,S*1.1);bg.addColorStop(0,`rgba(140,92,24,${.55*glow})`);bg.addColorStop(.45,`rgba(60,38,10,${.35*glow})`);bg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    // rays
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(cx,my);ctx.rotate(t*.12);
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2,rg=ctx.createRadialGradient(0,0,L*.2,0,0,S*1.2);rg.addColorStop(0,`rgba(255,200,110,${.11*glow})`);rg.addColorStop(1,'rgba(255,200,110,0)');
      ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,S*1.2,a-.05,a+.05);ctx.closePath();ctx.fill()}
    ctx.restore();
    // grid
    ctx.save();ctx.globalAlpha=.05*clamp((t-.1)/.5);ctx.strokeStyle='#FFE2A8';ctx.lineWidth=1;for(let y=chart.yt;y<chart.yb+S*.05;y+=S*.08){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.restore();
    drawChart(t);
    // floor
    const fa=clamp((t-.5)/.5);const fl=ctx.createLinearGradient(0,floorB-S*.04,0,H);fl.addColorStop(0,`rgba(255,190,90,${.0})`);fl.addColorStop(.04,`rgba(255,190,90,${.10*fa})`);fl.addColorStop(.35,'rgba(0,0,0,0)');ctx.fillStyle=fl;ctx.fillRect(0,floorB-S*.04,W,H);
    const ll=ctx.createLinearGradient(cx-S*.6,0,cx+S*.6,0);ll.addColorStop(0,'rgba(255,200,110,0)');ll.addColorStop(.5,`rgba(255,215,140,${.6*fa})`);ll.addColorStop(1,'rgba(255,200,110,0)');ctx.fillStyle=ll;ctx.fillRect(cx-S*.6,floorB-S*.045,S*1.2,1.2);
    // falling bills
    for(const b of bills){const bt=t-b.t0;if(bt<0)continue;const y=-S*.15+b.vy*bt+H*.12*bt*bt,x=b.x+Math.sin(bt*1.6+b.ph)*b.sway*.5;if(y>H+40)continue;
      const flip=Math.cos(b.ph+bt*b.vp),bw=S*.17*b.sc,bh=bw*.5;ctx.save();ctx.globalAlpha=.8*clamp(bt*3)*(y>floorB?clamp(1-(y-floorB)/(H*.12)):1);
      ctx.translate(x,y);ctx.rotate(b.rot+bt*b.vr);ctx.scale(1,Math.max(.08,Math.abs(flip)));ctx.drawImage(BILL[b.k],-bw/2,-bh/2,bw,bh);if(flip<0){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(-bw/2,-bh/2,bw,bh)}ctx.restore()}
    drawLogo(t);
    stacks.filter(s=>s.y===floorB).forEach(s=>drawStack(s,t));
    stacks.filter(s=>s.y!==floorB).forEach(s=>drawStack(s,t));
    stacks.coins.forEach(c=>drawCoins(c,t));
    // gold dust
    ctx.save();ctx.globalCompositeOperation='lighter';const da=clamp((t-.3)/.6);
    for(const d of dust){const y=((d.y-t*d.sp)%H+H)%H,a=da*(.35+.65*Math.abs(Math.sin(t*2.2+d.ph)))*.7;ctx.fillStyle=`rgba(255,${200+((d.ph*10)|0)%40},120,${a})`;ctx.beginPath();ctx.arc(d.x,y,d.r,0,7);ctx.fill()}
    ctx.restore();
    // title
    const ta=clamp((t-1.55)/.55);if(ta>0){ctx.save();ctx.globalAlpha=ta;const ty=textY+(1-eOut(ta))*S*.04;
      ctx.font=`800 ${S*.085}px -apple-system,system-ui,"SF Pro Display",sans-serif`;ctx.textBaseline='alphabetic';
      ctx.fillStyle=goldGrad(ctx,cx-S*.3,ty-S*.08,cx+S*.3,ty);ctx.shadowColor='rgba(255,180,60,.45)';ctx.shadowBlur=18*DPR;spaced('HGROUP',cx,ty,S*.02);ctx.shadowBlur=0;
      ctx.font=`700 ${S*.032}px -apple-system,system-ui,sans-serif`;ctx.fillStyle='rgba(255,228,170,.7)';spaced('FUNDATION',cx,ty+S*.065,S*.018);ctx.restore()}
    // vignette
    const vg=ctx.createRadialGradient(cx,H*.45,Math.min(W,H)*.35,cx,H*.45,Math.max(W,H)*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.7)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    if(t>=END){finish();return}
    raf=requestAnimationFrame(frame);
  }
  let t0=performance.now();
  raf=requestAnimationFrame(n=>{t0=n;frame(n)});
})();

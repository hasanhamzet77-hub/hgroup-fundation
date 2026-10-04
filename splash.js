/* HGroup Fundation — opening animation: gold logo, rising chart, realistic money stacks multiplying at its feet. */
(function(){
  const el=document.getElementById('splash');if(!el)return;
  let done=false,raf=0;
  function finish(){if(done)return;done=true;cancelAnimationFrame(raf);el.classList.add('out');setTimeout(()=>{el.remove()},420)}
  el.addEventListener('click',finish);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finish()});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){setTimeout(finish,600);return}
  const FREEZE=parseFloat((location.hash.match(/^#t=([\d.]+)/)||[])[1]);
  const SPEED=1.7,END=3.9; // scene time 3.9 → about 2.3 s on screen
  const main=document.getElementById('splash-c'),mctx=main.getContext('2d');
  const layer=document.createElement('canvas'),lctx=layer.getContext('2d');
  let ctx=mctx;

  /* ---------- helpers ---------- */
  const clamp=v=>v<0?0:v>1?1:v;
  const lerp=(a,b,k)=>a+(b-a)*k;
  const eOut=k=>1-Math.pow(1-k,3);
  const eBack=k=>{const c=1.6;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
  const eBounce=k=>{const n=7.5625,d=2.75;if(k<1/d)return n*k*k;if(k<2/d)return n*(k-=1.5/d)*k+.75;if(k<2.5/d)return n*(k-=2.25/d)*k+.9375;return n*(k-=2.625/d)*k+.984375};
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const hexA=(h,a)=>{const[r,g,b]=rgb(h);return`rgba(${r},${g},${b},${a})`};
  const shade=(h,f)=>{const[r,g,b]=rgb(h);return`rgb(${Math.min(255,r*f)|0},${Math.min(255,g*f)|0},${Math.min(255,b*f)|0})`};
  const mixc=(h1,h2,k)=>{const a=rgb(h1),b=rgb(h2);return'#'+a.map((v,i)=>Math.round(lerp(v,b[i],k)).toString(16).padStart(2,'0')).join('')};
  function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
  function goldGrad(c,x0,y0,x1,y1){const g=c.createLinearGradient(x0,y0,x1,y1);
    g.addColorStop(0,'#5E3B0D');g.addColorStop(.18,'#B07A22');g.addColorStop(.38,'#F3D485');g.addColorStop(.5,'#FFF4D2');g.addColorStop(.62,'#E8B858');g.addColorStop(.82,'#9A651B');g.addColorStop(1,'#4F310A');return g}
  function star5(g,x,y,r){g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}g.closePath();g.fill()}
  const FONT='"Helvetica Neue",Helvetica,Arial,-apple-system,sans-serif';

  /* ---------- banknote textures ---------- */
  const IW=600,IH=330,STRIPE={x:IW*.655,w:IW*.072};
  const NOTES={
    50:{paper:'#EFCDA6',main:'#D9894A',dark:'#6E330F',acc:'#F8E0C0'},
    100:{paper:'#CFE2C6',main:'#5B996A',dark:'#1D432C',acc:'#E3F0DC'},
    200:{paper:'#F0E0AC',main:'#C89C3D',dark:'#5E400F',acc:'#F8EDC9'},
    500:{paper:'#DACBE8',main:'#8366A8',dark:'#33214D',acc:'#EEE6F6'}
  };
  function makeBill(v){
    const n=NOTES[v],c=document.createElement('canvas');c.width=IW;c.height=IH;const g=c.getContext('2d'),R=rng(+v*13+1);
    g.fillStyle=n.paper;g.fillRect(0,0,IW,IH);
    let gr=g.createLinearGradient(0,0,IW,IH*.3);gr.addColorStop(0,hexA(n.main,.9));gr.addColorStop(.5,hexA(n.main,.5));gr.addColorStop(1,hexA(n.acc,.25));g.fillStyle=gr;g.fillRect(0,0,IW,IH);
    for(let i=0;i<3200;i++){g.fillStyle=R()<.5?'rgba(0,0,0,.06)':'rgba(255,255,255,.08)';g.fillRect(R()*IW,R()*IH,1,1)}
    g.lineWidth=.6;for(let i=0;i<160;i++){g.strokeStyle=R()<.5?hexA(n.dark,.08):'rgba(255,255,255,.12)';const x=R()*IW,y=R()*IH;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+R()*10-5,y+R()*10-5,x+R()*16-8,y+R()*16-8);g.stroke()}
    const ros=(cx,cy,R0,rings,col,al)=>{g.strokeStyle=hexA(col,al);g.lineWidth=.7;for(let j=0;j<rings;j++){const rad=R0*(.15+.85*j/rings);g.beginPath();for(let a=0;a<=Math.PI*2+.01;a+=.04){const r=rad+Math.sin(a*14+j*.55)*R0*.035;const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;a?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}};
    ros(IW*.25,IH*.5,IH*.5,36,n.dark,.12);ros(IW*.86,IH*.62,IH*.32,22,n.dark,.1);
    g.strokeStyle=hexA(n.dark,.13);g.lineWidth=.8;
    for(let j=0;j<16;j++){g.beginPath();for(let x=0;x<=IW;x+=6){const y=IH*.8+j*3.2+Math.sin(x*.03+j*.6)*4;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
    for(let j=0;j<7;j++){g.beginPath();for(let x=0;x<=IW;x+=6){const y=IH*.075+j*3+Math.sin(x*.05+j)*2.5;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
    const arch=(x,y,w,h)=>{const p=new Path2D();p.moveTo(x,y+h);p.lineTo(x,y+w/2);p.arc(x+w/2,y+w/2,w/2,Math.PI,0);p.lineTo(x+w,y+h);p.closePath();return p};
    g.fillStyle=hexA(n.dark,.18);g.fill(arch(IW*.3,IH*.24,IW*.17,IH*.56));
    const ax=IW*.37,ay=IH*.13,aw=IW*.24,ah=IH*.7,outer=arch(ax,ay,aw,ah);
    gr=g.createLinearGradient(ax,0,ax+aw,0);gr.addColorStop(0,hexA(n.dark,.75));gr.addColorStop(.35,hexA(n.acc,.95));gr.addColorStop(.7,hexA(n.main,.9));gr.addColorStop(1,hexA(n.dark,.8));g.fillStyle=gr;g.fill(outer);
    g.strokeStyle=hexA(n.dark,.55);g.lineWidth=2;g.stroke(outer);
    const ins=aw*.17,inner=arch(ax+ins,ay+ins,aw-ins*2,ah-ins);
    gr=g.createLinearGradient(0,ay,0,ay+ah);gr.addColorStop(0,hexA(n.dark,.95));gr.addColorStop(1,hexA(n.main,.85));g.fillStyle=gr;g.fill(inner);
    const gl=g.createRadialGradient(ax+aw/2,ay+ah*.35,2,ax+aw/2,ay+ah*.35,aw*.5);gl.addColorStop(0,'rgba(255,250,225,.55)');gl.addColorStop(1,'rgba(255,250,225,0)');g.fillStyle=gl;g.fill(inner);
    g.strokeStyle=hexA(n.dark,.4);g.lineWidth=1.2;for(let k=0;k<=12;k++){const a=Math.PI+k/12*Math.PI,cx=ax+aw/2,cy=ay+aw/2;g.beginPath();g.moveTo(cx+Math.cos(a)*(aw/2-ins),cy+Math.sin(a)*(aw/2-ins));g.lineTo(cx+Math.cos(a)*aw/2,cy+Math.sin(a)*aw/2);g.stroke()}
    g.strokeStyle=hexA(n.acc,.75);g.lineWidth=2.2;const mx=ax+aw/2,iw2=(aw-ins*2)/2;
    g.beginPath();g.moveTo(mx,ay+ins+iw2*.9);g.lineTo(mx,ay+ah);g.stroke();
    g.beginPath();g.arc(mx-iw2/2,ay+ins+iw2*1.05,iw2/2,Math.PI,0);g.stroke();g.beginPath();g.arc(mx+iw2/2,ay+ins+iw2*1.05,iw2/2,Math.PI,0);g.stroke();
    g.beginPath();g.arc(mx,ay+ins+iw2*.55,iw2*.22,0,7);g.stroke();
    g.strokeStyle=hexA(n.dark,.5);g.lineWidth=3;g.beginPath();g.moveTo(IW*.52,IH*.9);g.lineTo(IW*.99,IH*.9);g.stroke();
    g.lineWidth=2;for(let k=0;k<5;k++){const x=IW*.56+k*IW*.085;g.beginPath();g.arc(x+IW*.035,IH*.98,IW*.035,Math.PI,0);g.stroke()}
    g.fillStyle='#22409A';rr(g,16,14,78,52,4);g.fill();g.fillStyle='#FFD535';for(let s=0;s<12;s++){const a=s/12*Math.PI*2;star5(g,55+Math.cos(a)*17,40+Math.sin(a)*17,3.6)}
    g.textBaseline='alphabetic';g.font=`900 ${IH*.34}px ${FONT}`;
    gr=g.createLinearGradient(0,IH*.3,0,IH*.62);gr.addColorStop(0,n.main);gr.addColorStop(1,n.dark);
    g.lineWidth=3;g.strokeStyle=hexA(n.acc,.9);g.strokeText(v,18,IH*.64);g.fillStyle=gr;g.fillText(v,18,IH*.64);
    g.font=`800 ${IH*.11}px ${FONT}`;g.fillStyle=hexA(n.dark,.85);g.fillText(v,20,IH*.95);
    gr=g.createLinearGradient(IW*.5,IH*.78,IW*.62,IH*.9);gr.addColorStop(0,'#1E6B55');gr.addColorStop(.5,'#6E3F8F');gr.addColorStop(1,'#2E4F7A');
    g.font=`900 ${IH*.13}px ${FONT}`;g.fillStyle=gr;g.textAlign='right';g.fillText(v,IW*.64,IH*.97);g.textAlign='left';
    g.font=`800 ${IH*.08}px ${FONT}`;g.fillStyle=hexA(n.dark,.85);g.fillText('EURO',20,IH*.76);
    g.font=`700 ${IH*.05}px ${FONT}`;g.fillStyle=hexA(n.dark,.6);g.fillText('ΕΥΡΩ  EVRO',20,IH*.83);
    const sx=STRIPE.x,sw=STRIPE.w;gr=g.createLinearGradient(sx,0,sx+sw,0);gr.addColorStop(0,'#8E949C');gr.addColorStop(.5,'#F4F6F8');gr.addColorStop(1,'#A9AEB5');g.fillStyle=gr;g.fillRect(sx,0,sw,IH);
    gr=g.createLinearGradient(0,0,0,IH);['#ff8fa3','#ffd27a','#9df7c0','#8fd3ff','#c9a3ff','#ff8fa3'].forEach((cl,i,a)=>gr.addColorStop(i/(a.length-1),cl));g.globalAlpha=.32;g.fillStyle=gr;g.fillRect(sx,0,sw,IH);g.globalAlpha=1;
    g.strokeStyle='rgba(60,60,70,.35)';g.lineWidth=1;g.strokeRect(sx+.5,0,sw-1,IH);
    g.font=`800 ${sw*.32}px ${FONT}`;g.textAlign='center';for(let y=20;y<IH;y+=40){g.strokeStyle='rgba(90,90,110,.35)';g.beginPath();g.arc(sx+sw/2,y,sw*.32,0,7);g.stroke();g.fillStyle='rgba(80,80,100,.4)';g.fillText(v,sx+sw/2,y+sw*.12)}g.textAlign='left';
    const wx=IW*.84,wy=IH*.4;gr=g.createRadialGradient(wx,wy,4,wx,wy,IH*.3);gr.addColorStop(0,'rgba(255,255,255,.42)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.ellipse(wx,wy,IW*.085,IH*.3,0,0,7);g.fill();
    g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=2;g.stroke(arch(wx-IW*.04,wy-IH*.18,IW*.08,IH*.34));
    g.font=`600 ${IH*.055}px "Courier New",monospace`;g.fillStyle=hexA(n.dark,.75);const ser='E'+'ABCDEFGHKLMNPR'[(v*7)%14]+String(Math.floor(R()*1e10)).padStart(10,'0');
    g.fillText(ser,IW*.74,IH*.12);g.save();g.translate(IW*.985,IH*.95);g.rotate(-Math.PI/2);g.fillStyle=hexA(n.dark,.55);g.fillText(ser,0,0);g.restore();
    g.font=`600 7px ${FONT}`;g.fillStyle=hexA(n.dark,.3);g.fillText('EURO '.repeat(80),8,IH*.04);g.fillText('EURO '.repeat(80),8,IH*.995);
    g.strokeStyle=hexA(n.dark,.28);g.lineWidth=1.4;g.strokeRect(5,5,IW-10,IH-10);g.strokeStyle=hexA(n.dark,.12);g.strokeRect(10,10,IW-20,IH-20);
    gr=g.createRadialGradient(IW*.45,IH*.4,IH*.2,IW*.5,IH*.5,IW*.65);gr.addColorStop(0,'rgba(255,255,255,.06)');gr.addColorStop(1,'rgba(0,0,0,.18)');g.fillStyle=gr;g.fillRect(0,0,IW,IH);
    return c;
  }
  function makeBand(v){
    const n=NOTES[v],bw=Math.round(IW*.14),c=document.createElement('canvas');c.width=bw;c.height=IH;const g=c.getContext('2d');
    let gr=g.createLinearGradient(0,0,bw,0);gr.addColorStop(0,'#CDBF9C');gr.addColorStop(.5,'#FBF6EA');gr.addColorStop(1,'#C8B891');g.fillStyle=gr;g.fillRect(0,0,bw,IH);
    g.fillStyle=n.dark;g.globalAlpha=.85;g.fillRect(3,0,5,IH);g.fillRect(bw-8,0,5,IH);g.globalAlpha=1;
    g.save();g.translate(bw/2,IH/2);g.rotate(-Math.PI/2);g.textAlign='center';g.textBaseline='middle';
    g.fillStyle='#4A2E12';g.font=`900 ${bw*.3}px ${FONT}`;g.fillText('10.000 €',0,-bw*.08);
    g.font=`700 ${bw*.15}px ${FONT}`;g.fillStyle='rgba(74,46,18,.7)';g.fillText(`100 × ${v} EURO`,0,bw*.22);g.restore();
    g.fillStyle='rgba(40,25,10,.55)';for(let y=10;y<IH*.22;y+=3+((y*7)%4))g.fillRect(bw*.3,y,bw*.4,1.2);
    return c;
  }
  function makeCoin(){
    const S2=256,c=document.createElement('canvas');c.width=c.height=S2;const g=c.getContext('2d'),r=S2/2;
    let gr=g.createRadialGradient(r*.7,r*.6,4,r,r,r);gr.addColorStop(0,'#FFF7DA');gr.addColorStop(.35,'#F1C964');gr.addColorStop(.75,'#C08A2A');gr.addColorStop(1,'#7A5212');
    g.fillStyle=gr;g.beginPath();g.arc(r,r,r-1,0,7);g.fill();
    g.strokeStyle='rgba(90,55,10,.8)';g.lineWidth=5;g.beginPath();g.arc(r,r,r*.86,0,7);g.stroke();
    g.strokeStyle='rgba(255,240,200,.6)';g.lineWidth=2;g.beginPath();g.arc(r,r,r*.82,0,7);g.stroke();
    g.fillStyle='rgba(120,80,15,.85)';for(let s=0;s<12;s++){const a=s/12*Math.PI*2;star5(g,r+Math.cos(a)*r*.7,r+Math.sin(a)*r*.7,r*.05)}
    g.textAlign='center';g.textBaseline='middle';g.font=`900 ${r*.95}px ${FONT}`;
    g.fillStyle='rgba(80,50,8,.7)';g.fillText('€',r+3,r+5);g.fillStyle='rgba(255,248,220,.85)';g.fillText('€',r-2,r-2);g.fillStyle='#D9A441';g.fillText('€',r,r);
    g.strokeStyle='rgba(255,255,255,.05)';g.lineWidth=1;for(let k=0;k<6;k++){g.beginPath();g.arc(r,r,r*(.2+k*.08),0,7);g.stroke()}
    return c;
  }
  const BILL={},BAND={};for(const v in NOTES){BILL[v]=makeBill(v);BAND[v]=makeBand(v)}
  const COIN=makeCoin();
  const REED=(()=>{const c=document.createElement('canvas');c.width=3;c.height=1;const g=c.getContext('2d');g.fillStyle='rgba(60,35,5,.35)';g.fillRect(0,0,1,1);return c})();

  /* ---------- layout ---------- */
  let W,H,DPR,S,cx,L,logoTop,floorB,floorF,mirrorY,textY,stacks,coins,floorCoins,chart,farBills,nearBills,dust;
  function layout(){
    S=Math.min(W*.98,H*.6);cx=W/2;L=S*.4;
    const block=L+S*.5;logoTop=Math.max(H*.08,(H-block)/2+H*.02);
    floorB=logoTop+L+S*.07;floorF=floorB+S*.1;mirrorY=floorF+S*.004;textY=floorF+S*.2;
    const w=S*.2,d=S*.1,lt=Math.max(.9,S*.0042);
    stacks=[
      {x:cx,y:floorF,h:S*.15,v:100,o:0,loose:-.09},
      {x:cx-S*.115,y:floorB,h:S*.11,v:50,o:1},
      {x:cx+S*.115,y:floorB,h:S*.12,v:200,o:2,loose:.07},
      {x:cx-S*.23,y:floorF,h:S*.1,v:100,o:3},
      {x:cx+S*.23,y:floorF,h:S*.09,v:500,o:4},
      {x:cx-S*.34,y:floorB,h:S*.075,v:100,o:5},
      {x:cx+S*.34,y:floorB,h:S*.085,v:50,o:6}
    ].map(s=>({...s,w,d,lt,ox:d*.62,oy:-d*.5,t0:.75+s.o*.17}));
    stacks.forEach(prerender);
    coins=[{x:cx-S*.44,y:floorF+S*.02,n:15,t0:1.85},{x:cx+S*.44,y:floorF+S*.02,n:12,t0:2.0}];
    floorCoins=[[-.36,.07,2.3],[.31,.08,2.42],[-.1,.1,2.55],[.14,.095,2.66]].map(([dx,dy,t0])=>({x:cx+S*dx,y:floorF+S*dy,t0}));
    const R=rng(7),N=26,x0=W*.03,x1=W*.97,yb=floorB-S*.03,yt=Math.max(H*.06,logoTop-S*.2);
    chart={pts:[],yb,yt};
    for(let i=0;i<N;i++){const f=i/(N-1);let y=yb+(yt-yb)*Math.pow(f,1.55)+(R()-.5)*S*.09*(1-f*.6);if(i%5===3)y+=S*.04*(1-f);if(i===N-1)y=yt;chart.pts.push([lerp(x0,x1,f),y])}
    const vals=[100,50,200,500,100,50];
    const Rb=rng(11);farBills=[];for(let i=0;i<10;i++)farBills.push({x:W*(.08+Rb()*.84),t0:1.3+Rb()*1.5,vy:H*(.3+Rb()*.2),rot:Rb()*6,ph:Rb()*6,vp:2.2+Rb()*2.5,sc:.55+Rb()*.3,v:vals[i%6],sway:(Rb()-.5)*W*.2,dim:.75});
    nearBills=[];for(let i=0;i<3;i++)nearBills.push({x:i===1?W*.9:W*(.06+i*.04),t0:1.8+i*.35,vy:H*(.55+Rb()*.15),rot:Rb()*6,ph:Rb()*6,vp:2+Rb()*2,sc:1.25+Rb()*.25,v:vals[(i+1)%6],sway:(Rb()-.5)*W*.12,dim:1});
    const Rd=rng(5);dust=[];for(let i=0;i<70;i++)dust.push({x:Rd()*W,y:Rd()*H,r:.5+Rd()*1.6,sp:8+Rd()*26,ph:Rd()*6});
  }
  /* bake the paper edges of each stack once: every note slightly misaligned, like a real wad */
  function prerender(s){
    const n=NOTES[s.v],R=rng(s.o*31+5),pad=S*.012,cw=s.w+s.ox+pad*2,ch=s.h-s.oy+3,c=document.createElement('canvas');
    c.width=Math.ceil(cw*DPR);c.height=Math.ceil(ch*DPR);const g=c.getContext('2d');g.scale(DPR,DPR);
    const N=Math.floor(s.h/s.lt),lb=ch-1,x0=pad,x1=pad+s.w,light=mixc(n.paper,'#ffffff',.45),dark=mixc(n.paper,'#3a2a1a',.35);
    s.jx=[];let drift=0;
    for(let i=0;i<N;i++){drift=drift*.7+(R()-.5)*S*.006;const j=drift+(R()<.05?(R()-.5)*S*.01:0);s.jx.push(j);
      const y=lb-(i+1)*s.lt,f=.88+R()*.2;
      g.fillStyle=shade(dark,f);g.beginPath();g.moveTo(x1+j,y);g.lineTo(x1+j+s.ox,y+s.oy);g.lineTo(x1+j+s.ox,y+s.oy+s.lt);g.lineTo(x1+j,y+s.lt);g.closePath();g.fill();
      g.fillStyle=shade(light,f);g.fillRect(x0+j,y,s.w,s.lt);
      if(R()<.18){g.fillStyle=hexA(n.main,.55);g.fillRect(x0+j+s.w*R()*.6,y+s.lt*.2,s.w*(.2+R()*.4),s.lt*.6)}
      g.fillStyle='rgba(40,25,10,.16)';g.fillRect(x0+j,y+s.lt-.35,s.w,.35);
    }
    const top=lb-N*s.lt;
    let gr=g.createLinearGradient(x0,0,x1,0);gr.addColorStop(0,'rgba(0,0,0,.26)');gr.addColorStop(.55,'rgba(255,240,210,.06)');gr.addColorStop(1,'rgba(0,0,0,.1)');g.fillStyle=gr;g.fillRect(x0-pad,top,s.w+pad*2,N*s.lt);
    gr=g.createLinearGradient(0,lb-S*.03,0,lb);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.42)');g.fillStyle=gr;g.fillRect(0,lb-S*.03,cw,S*.03+1);
    g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.moveTo(x1,top);g.lineTo(x1+s.ox+pad,top+s.oy);g.lineTo(x1+s.ox+pad,lb+s.oy);g.lineTo(x1,lb);g.closePath();g.fill();
    const bx=x0+s.w*.43,bw=s.w*.14;gr=g.createLinearGradient(bx,0,bx+bw,0);gr.addColorStop(0,'#B9A57A');gr.addColorStop(.5,'#F6EEDA');gr.addColorStop(1,'#AE9A6E');
    g.fillStyle=gr;g.fillRect(bx,top-1,bw,N*s.lt+1);g.fillStyle=hexA(n.dark,.8);g.fillRect(bx+bw*.08,top-1,bw*.1,N*s.lt+1);g.fillRect(bx+bw*.82,top-1,bw*.1,N*s.lt+1);
    g.fillStyle='rgba(0,0,0,.25)';g.fillRect(bx-1,top-1,1,N*s.lt+1);g.fillRect(bx+bw,top-1,1.2,N*s.lt+1);
    s.pre=c;s.pad=pad;s.cw=cw;s.ch=ch;s.N=N;
  }
  function size(){DPR=Math.min(3,window.devicePixelRatio||1);W=window.innerWidth;H=window.innerHeight;
    for(const c of [main,layer]){c.width=Math.round(W*DPR);c.height=Math.round(H*DPR)}
    for(const c of [mctx,lctx])c.imageSmoothingQuality='high';layout()}
  size();addEventListener('resize',size);

  /* ---------- drawing ---------- */
  function quad(pts){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath()}
  function topFace(x0,top,s,lift){ctx.setTransform(DPR*s.w/IW,0,-DPR*s.ox/IH,-DPR*s.oy/IH,DPR*(x0+s.ox),DPR*(top+s.oy-(lift||0)))}
  function holo(t,a){const sx=STRIPE.x,sw=STRIPE.w,p=(t*.6)%1,gr=ctx.createLinearGradient(0,-IH+p*IH*2,0,p*IH*2);
    ['rgba(255,140,170,0)','rgba(255,210,120,.9)','rgba(150,255,200,.9)','rgba(130,200,255,.9)','rgba(210,160,255,0)'].forEach((c,i,arr)=>gr.addColorStop(i/(arr.length-1),c));
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.fillStyle=gr;ctx.fillRect(sx,0,sw,IH);ctx.restore()}
  function sweep(t,off,a){const p=((t*.45+off)%1.6)-.3,gr=ctx.createLinearGradient(IW*p-IW*.25,0,IW*p+IW*.25,IH*.4);
    gr.addColorStop(0,'rgba(255,245,220,0)');gr.addColorStop(.5,`rgba(255,245,220,${a})`);gr.addColorStop(1,'rgba(255,245,220,0)');
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=gr;ctx.fillRect(0,0,IW,IH);ctx.restore()}
  function looseBill(s,x0,top,lift,rot,shift,alpha,t){
    ctx.save();ctx.globalAlpha=alpha*.35;topFace(x0,top,s,0);ctx.translate(IW/2+shift,IH/2);ctx.rotate(rot);ctx.fillStyle='#000';ctx.fillRect(-IW/2,-IH/2+8,IW,IH);ctx.restore();
    ctx.save();ctx.globalAlpha=alpha;topFace(x0,top,s,lift);ctx.translate(IW/2+shift,IH/2);ctx.rotate(rot);ctx.translate(-IW/2,-IH/2);ctx.drawImage(BILL[s.v],0,0);holo(t+s.o,.35);ctx.restore();
  }
  function drawStack(s,t){
    const k=clamp((t-s.t0)/.42);if(k<=0)return;
    const drop=(1-eBounce(k))*S*.55,grow=eOut(clamp((t-s.t0-.15)/.95));
    const n=Math.max(4,Math.round(s.N*(.08+.92*grow))),h=n*s.lt;
    const base=s.y-drop,top=base-h,x0=s.x-s.w/2,x1=s.x+s.w/2,jt=s.jx[n-1]||0;
    ctx.save();ctx.globalAlpha=clamp(k*3);
    ctx.save();ctx.translate(s.x+s.ox*.5,s.y+s.oy*.3);ctx.scale(1,.3);const sh=ctx.createRadialGradient(0,0,2,0,0,s.w*.8);sh.addColorStop(0,'rgba(0,0,0,.75)');sh.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=sh;ctx.beginPath();ctx.arc(0,0,s.w*.8,0,7);ctx.fill();ctx.restore();
    const sy=s.ch-1-h+s.oy-1,shh=s.ch-sy;
    ctx.save();quad([[x0-s.pad,base+1],[x0-s.pad,top],[x1+s.pad+jt,top],[x1+s.ox+s.pad+jt,top+s.oy],[x1+s.ox+s.pad,base+1]]);ctx.clip();
    ctx.drawImage(s.pre,0,sy*DPR,s.pre.width,shh*DPR,x0-s.pad,base-(s.ch-1-sy),s.cw,shh);ctx.restore();
    ctx.save();topFace(x0+jt,top,s);ctx.drawImage(BILL[s.v],0,0);ctx.drawImage(BAND[s.v],IW*.43,0);
    ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(IW*.43-6,0,6,IH);
    sweep(t,s.o*.23,.32);holo(t+s.o*.4,.22);
    ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=3;ctx.strokeRect(0,0,IW,IH);ctx.restore();
    ctx.restore();
    if(grow>0&&grow<.97){const ph=(t*6.5+s.o*.21)%1;looseBill(s,x0+jt,top,(1-ph)*(1-ph)*S*.12,(1-ph)*.3*(s.o%2?1:-1),0,clamp(ph*5),t)}
    else if(grow>=.97&&s.loose)looseBill(s,x0+jt,top,0,s.loose,IW*.06,1,t);
    const lk=(t-s.t0-.42)/.35;if(lk>0&&lk<1){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-lk)*.5;ctx.strokeStyle='#FFD98A';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x+s.ox*.5,s.y+s.oy*.3,s.w*(.4+lk*.6),s.w*(.4+lk*.6)*.25,0,0,7);ctx.stroke();ctx.restore()}
    if(grow>.6){const p=(t*1.1+s.o*.37)%1;if(p<.28){const a=Math.sin(p/.28*Math.PI);star(x0+s.w*(.2+((s.o*37)%60)/100)+s.ox*.4,top+s.oy*.4,S*.032*a,a)}}
  }
  function coinSide(x,yb,r,ry,th){
    const g=ctx.createLinearGradient(x-r,0,x+r,0);g.addColorStop(0,'#4E3209');g.addColorStop(.25,'#C9922F');g.addColorStop(.45,'#FFF0BE');g.addColorStop(.62,'#D9A441');g.addColorStop(1,'#4A2F08');
    ctx.beginPath();ctx.ellipse(x,yb,r,ry,0,0,Math.PI);ctx.lineTo(x-r,yb-th);ctx.ellipse(x,yb-th,r,ry,0,Math.PI,0,true);ctx.closePath();
    ctx.fillStyle=g;ctx.fill();ctx.fillStyle=ctx.createPattern(REED,'repeat');ctx.fill();
    ctx.strokeStyle='rgba(50,30,5,.6)';ctx.lineWidth=.6;ctx.beginPath();ctx.ellipse(x,yb,r,ry,0,0,Math.PI);ctx.stroke();
  }
  function coinTop(x,y,r,ry,spin){ctx.save();ctx.translate(x,y);ctx.scale(1,ry/r);ctx.rotate(spin||0);ctx.drawImage(COIN,-r,-r,r*2,r*2);ctx.restore()}
  function drawCoins(c,t){
    const f=c.n*eOut(clamp((t-c.t0)/1)),n=Math.floor(f);if(f<=0)return;
    const r=S*.05,th=S*.0105,ry=r*.34;
    ctx.save();ctx.translate(c.x,c.y);ctx.scale(1,.35);const sh=ctx.createRadialGradient(0,0,1,0,0,r*1.7);sh.addColorStop(0,'rgba(0,0,0,.6)');sh.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=sh;ctx.beginPath();ctx.arc(0,0,r*1.7,0,7);ctx.fill();ctx.restore();
    for(let i=0;i<n;i++){const x=c.x+Math.sin(i*1.9)*r*.08;coinSide(x,c.y-i*th,r,ry,th);if(i===n-1)coinTop(x,c.y-i*th-th,r,ry,i*.7)}
    if(n<c.n){const ph=f-n,x=c.x+Math.sin(n*1.9)*r*.08,yb=c.y-n*th-(1-ph)*(1-ph)*S*.18;coinSide(x,yb,r,ry,th);coinTop(x,yb-th,r,ry,n*.7+ph*3)}
  }
  function drawFloorCoin(c,t){const k=clamp((t-c.t0)/.4);if(k<=0)return;const r=S*.04,ry=r*.32,th=S*.009,y=c.y-(1-eBounce(k))*S*.25;
    ctx.save();ctx.translate(c.x,c.y);ctx.scale(1,.35);ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.arc(0,0,r*1.3,0,7);ctx.fill();ctx.restore();
    coinSide(c.x,y,r,ry,th);coinTop(c.x,y-th,r,ry,c.t0*3)}
  function star(x,y,s,a){if(s<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.translate(x,y);
    const g=ctx.createRadialGradient(0,0,0,0,0,s);g.addColorStop(0,'rgba(255,255,240,1)');g.addColorStop(.3,'rgba(255,215,130,.8)');g.addColorStop(1,'rgba(255,190,80,0)');ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(0,-s);ctx.quadraticCurveTo(0,0,s,0);ctx.quadraticCurveTo(0,0,0,s);ctx.quadraticCurveTo(0,0,-s,0);ctx.quadraticCurveTo(0,0,0,-s);ctx.fill();ctx.restore()}
  /* a banknote fluttering through the air: bent sheet that flips and catches the light */
  function drawFlying(b,t){
    const bt=t-b.t0;if(bt<0)return;const y=-S*.2+b.vy*bt+H*.1*bt*bt;if(y>H+80)return;
    const x=b.x+Math.sin(bt*1.5+b.ph)*b.sway*.5,flip=Math.cos(b.ph+bt*b.vp),rot=b.rot+Math.sin(bt*1.9+b.ph)*.7+bt*.4,bend=Math.sin(bt*3.1+b.ph)*.5;
    const bw=S*.2*b.sc,bh=bw*IH/IW,fy=Math.max(.07,Math.abs(flip)),M=16,img=BILL[b.v];
    ctx.save();ctx.globalAlpha=b.dim*clamp(bt*3)*(y>floorF?clamp(1-(y-floorF)/(H*.15)):1);ctx.translate(x,y);ctx.rotate(rot);
    for(let j=0;j<M;j++){const u0=j/M,um=(j+.5)/M,z=Math.sin(um*Math.PI)*bend*bh*.22,slope=Math.cos(um*Math.PI)*bend;
      const dx=-bw/2+u0*bw,dy=-bh*fy/2+z;
      ctx.drawImage(img,u0*IW,0,IW/M+1,IH,dx,dy,bw/M+.8,bh*fy);
      const lit=slope*.35+(flip<0?.25:0);if(lit>0){ctx.fillStyle=`rgba(0,0,0,${Math.min(.6,lit)})`;ctx.fillRect(dx,dy,bw/M+.8,bh*fy)}
      else{ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(255,235,190,${Math.min(.35,-lit*.6)})`;ctx.fillRect(dx,dy,bw/M+.8,bh*fy);ctx.restore()}}
    const glint=Math.max(0,1-Math.abs(((rot%(Math.PI*2))+Math.PI*2)%(Math.PI*2)-1)*2)*fy;
    if(glint>.05){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=glint*.6;const gx=-bw/2+bw*STRIPE.x/IW;ctx.fillStyle='rgba(255,240,210,1)';ctx.fillRect(gx,-bh*fy/2,bw*STRIPE.w/IW,bh*fy);ctx.restore()}
    ctx.restore();
  }
  function logoPath(){const w=L*.248,gap=L*.352,tw=w*2+gap,r=L*.05,x=cx-tw/2,y=logoTop,cb=L*.184,c0=y+L/2-cb/2,c1=y+L/2+cb/2,p=new Path2D();
    const B=y+L,xi=x+w,xj=x+w+gap,xr=x+tw;
    p.moveTo(x+r,y);p.arcTo(xi,y,xi,y+r,r);p.lineTo(xi,c0);p.lineTo(xj,c0);p.lineTo(xj,y+r);p.arcTo(xj,y,xj+r,y,r);p.arcTo(xr,y,xr,y+r,r);
    p.arcTo(xr,B,xr-r,B,r);p.arcTo(xj,B,xj,B-r,r);p.lineTo(xj,c1);p.lineTo(xi,c1);p.lineTo(xi,B-r);p.arcTo(xi,B,xi-r,B,r);p.arcTo(x,B,x,B-r,r);p.arcTo(x,y,x+r,y,r);p.closePath();
    return{p,x,y,tw}}
  function drawLogo(t){
    const a=clamp((t-.1)/.45);if(a<=0)return;const sc=.8+.2*eBack(clamp((t-.1)/.7)),{p,x,y,tw}=logoPath(),mx=cx,my=logoTop+L/2;
    ctx.save();ctx.globalAlpha=a;ctx.translate(mx,my);ctx.scale(sc,sc);ctx.translate(-mx,-my);
    ctx.shadowColor='rgba(255,180,60,.55)';ctx.shadowBlur=40*DPR;ctx.fillStyle=goldGrad(ctx,x,y,x+tw,y+L);ctx.fill(p);ctx.shadowBlur=0;
    ctx.fillStyle=goldGrad(ctx,x,y,x+tw,y+L);ctx.fill(p);
    ctx.save();ctx.clip(p);
    const hl=ctx.createLinearGradient(0,y,0,y+L);hl.addColorStop(0,'rgba(255,255,255,.35)');hl.addColorStop(.25,'rgba(255,255,255,0)');hl.addColorStop(.8,'rgba(0,0,0,0)');hl.addColorStop(1,'rgba(0,0,0,.35)');ctx.fillStyle=hl;ctx.fillRect(x-5,y-5,tw+10,L+10);
    for(const [s0,dur] of [[.95,.6],[2.6,.6]]){const k=clamp((t-s0)/dur);if(k>0&&k<1){const sx=lerp(x-L*.6,x+tw+L*.6,eOut(k));ctx.save();ctx.translate(sx,my);ctx.rotate(.35);
      const sg=ctx.createLinearGradient(-L*.16,0,L*.16,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.85)');sg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=sg;ctx.fillRect(-L*.16,-L,L*.32,L*2);ctx.restore()}}
    ctx.restore();
    ctx.lineWidth=Math.max(1,L*.01);const sg=ctx.createLinearGradient(0,y,0,y+L);sg.addColorStop(0,'rgba(255,246,214,.8)');sg.addColorStop(1,'rgba(70,40,5,.8)');ctx.strokeStyle=sg;ctx.stroke(p);
    ctx.restore();
  }
  function drawChart(t){
    const pr=eOut(clamp((t-.25)/1.7));if(pr<=0)return;const P=chart.pts,N=P.length,fi=pr*(N-1),n=Math.floor(fi),fr=fi-n;
    const pts=P.slice(0,n+1);if(n<N-1)pts.push([lerp(P[n][0],P[n+1][0],fr),lerp(P[n][1],P[n+1][1],fr)]);const tip=pts[pts.length-1];
    ctx.save();ctx.globalAlpha=.09*clamp(t/.8);const R=rng(3);
    for(let i=0;i<N;i++){if(P[i][0]>tip[0])break;const bh=S*(.03+.09*(i/N)+R()*.04);ctx.fillStyle=i%4===2?'#E8B858':'#FFD98A';ctx.fillRect(P[i][0]-S*.012,chart.yb-bh+S*.03,S*.024,bh)}
    ctx.restore();
    const ag=ctx.createLinearGradient(0,chart.yt,0,chart.yb);ag.addColorStop(0,'rgba(255,196,90,.30)');ag.addColorStop(1,'rgba(255,196,90,0)');
    ctx.beginPath();ctx.moveTo(pts[0][0],chart.yb+S*.03);pts.forEach(q=>ctx.lineTo(q[0],q[1]));ctx.lineTo(tip[0],chart.yb+S*.03);ctx.closePath();ctx.fillStyle=ag;ctx.fill();
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.shadowColor='rgba(255,190,80,.9)';ctx.shadowBlur=14*DPR;
    const lg=ctx.createLinearGradient(P[0][0],0,P[N-1][0],0);lg.addColorStop(0,'rgba(255,205,120,.35)');lg.addColorStop(1,'#FFE7A6');ctx.strokeStyle=lg;ctx.lineWidth=Math.max(2,S*.008);
    ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.restore();
    ctx.save();ctx.globalCompositeOperation='lighter';const ring=(t*1.6)%1;ctx.globalAlpha=1-ring;ctx.strokeStyle='#FFD98A';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(tip[0],tip[1],4+ring*S*.05,0,7);ctx.stroke();ctx.restore();
    star(tip[0],tip[1],S*.045,1);
    if(pr>=.999){const a=P[N-2],b=P[N-1],ang=Math.atan2(b[1]-a[1],b[0]-a[0]),s=S*.035;ctx.save();ctx.translate(b[0],b[1]);ctx.rotate(ang);ctx.fillStyle='#FFE7A6';ctx.beginPath();ctx.moveTo(s*.9,0);ctx.lineTo(-s*.5,-s*.6);ctx.lineTo(-s*.5,s*.6);ctx.closePath();ctx.fill();ctx.restore()}
  }
  function spaced(str,x,y,spacing){let w=0;const ws=[...str].map(ch=>{const m=ctx.measureText(ch).width;w+=m+spacing;return m});w-=spacing;let px=x-w/2;[...str].forEach((ch,i)=>{ctx.fillText(ch,px,y);px+=ws[i]+spacing})}
  function frame(now){
    const t=isNaN(FREEZE)?(now-t0)/1000*SPEED:FREEZE;
    ctx=mctx;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    ctx.fillStyle='#060708';ctx.fillRect(0,0,W,H);
    const my=logoTop+L/2,glow=clamp(t/.9);
    const bg=ctx.createRadialGradient(cx,my,0,cx,my,S*1.1);bg.addColorStop(0,`rgba(140,92,24,${.55*glow})`);bg.addColorStop(.45,`rgba(60,38,10,${.35*glow})`);bg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(cx,my);ctx.rotate(t*.12);
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2,rg=ctx.createRadialGradient(0,0,L*.2,0,0,S*1.2);rg.addColorStop(0,`rgba(255,200,110,${.1*glow})`);rg.addColorStop(1,'rgba(255,200,110,0)');
      ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,S*1.2,a-.05,a+.05);ctx.closePath();ctx.fill()}
    ctx.restore();
    ctx.save();ctx.globalAlpha=.05*clamp((t-.1)/.5);ctx.strokeStyle='#FFE2A8';ctx.lineWidth=1;for(let y=chart.yt;y<chart.yb+S*.05;y+=S*.08){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.restore();
    drawChart(t);
    farBills.forEach(b=>drawFlying(b,t));
    drawLogo(t);
    const fa=clamp((t-.45)/.5);let fl=ctx.createLinearGradient(0,floorB-S*.05,0,H);fl.addColorStop(0,'rgba(8,8,10,0)');fl.addColorStop(.05,`rgba(10,9,8,${.85*fa})`);fl.addColorStop(1,`rgba(4,4,5,${fa})`);ctx.fillStyle=fl;ctx.fillRect(0,floorB-S*.05,W,H);
    const ll=ctx.createLinearGradient(cx-S*.6,0,cx+S*.6,0);ll.addColorStop(0,'rgba(255,200,110,0)');ll.addColorStop(.5,`rgba(255,215,140,${.55*fa})`);ll.addColorStop(1,'rgba(255,200,110,0)');ctx.fillStyle=ll;ctx.fillRect(cx-S*.6,floorB-S*.048,S*1.2,1.2);
    // money on its own layer so the black floor can reflect it
    ctx=lctx;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,layer.width,layer.height);ctx.setTransform(DPR,0,0,DPR,0,0);
    stacks.filter(s=>s.y===floorB).forEach(s=>drawStack(s,t));
    stacks.filter(s=>s.y!==floorB).forEach(s=>drawStack(s,t));
    coins.forEach(c=>drawCoins(c,t));floorCoins.forEach(c=>drawFloorCoin(c,t));
    ctx=mctx;
    ctx.save();ctx.beginPath();ctx.rect(0,mirrorY,W,H-mirrorY);ctx.clip();ctx.translate(0,mirrorY*2);ctx.scale(1,-1);ctx.globalAlpha=.2;ctx.drawImage(layer,0,0,W,H);ctx.restore();
    fl=ctx.createLinearGradient(0,mirrorY,0,mirrorY+S*.28);fl.addColorStop(0,'rgba(5,5,6,.2)');fl.addColorStop(1,'rgba(5,5,6,1)');ctx.fillStyle=fl;ctx.fillRect(0,mirrorY,W,S*.28+2);
    ctx.drawImage(layer,0,0,W,H);
    ctx.save();ctx.globalCompositeOperation='lighter';const da=clamp((t-.3)/.6);
    for(const d of dust){const y=((d.y-t*d.sp)%H+H)%H,a=da*(.35+.65*Math.abs(Math.sin(t*2.2+d.ph)))*.7;ctx.fillStyle=`rgba(255,${200+((d.ph*10)|0)%40},120,${a})`;ctx.beginPath();ctx.arc(d.x,y,d.r,0,7);ctx.fill()}
    ctx.restore();
    const ta=clamp((t-1.55)/.55);if(ta>0){ctx.save();ctx.globalAlpha=ta;const ty=textY+(1-eOut(ta))*S*.04;
      ctx.font=`800 ${S*.085}px -apple-system,system-ui,"SF Pro Display",sans-serif`;ctx.textBaseline='alphabetic';
      ctx.fillStyle=goldGrad(ctx,cx-S*.3,ty-S*.08,cx+S*.3,ty);ctx.shadowColor='rgba(255,180,60,.45)';ctx.shadowBlur=18*DPR;spaced('HGROUP',cx,ty,S*.02);ctx.shadowBlur=0;
      ctx.font=`700 ${S*.032}px -apple-system,system-ui,sans-serif`;ctx.fillStyle='rgba(255,228,170,.7)';spaced('FUNDATION',cx,ty+S*.065,S*.018);ctx.restore()}
    nearBills.forEach(b=>drawFlying(b,t));
    const vg=ctx.createRadialGradient(cx,H*.45,Math.min(W,H)*.35,cx,H*.45,Math.max(W,H)*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.7)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    if(!isNaN(FREEZE))return;
    if(t>=END){finish();return}
    raf=requestAnimationFrame(frame);
  }
  let t0=performance.now();
  raf=requestAnimationFrame(n=>{t0=n;frame(n)});
})();

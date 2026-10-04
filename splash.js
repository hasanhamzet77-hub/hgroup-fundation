/* HGroup Fundation — opening clip (~2.3 s): the stopwatch spins, the money pile grows,
   the H logo rises out of the dial and the app opens through it. */
(function(){
  const el=document.getElementById('splash');if(!el)return;
  let done=false,raf=0;
  function finish(){if(done)return;done=true;cancelAnimationFrame(raf);el.remove()}
  function skip(){if(done)return;done=true;cancelAnimationFrame(raf);el.classList.add('out');setTimeout(()=>el.remove(),300)}
  el.addEventListener('click',skip);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finish()});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){setTimeout(skip,500);return}
  const FREEZE=parseFloat((location.hash.match(/^#t=([\d.]+)/)||[])[1]);
  const END=2.3;
  const cv=document.getElementById('splash-c'),ctx=cv.getContext('2d');

  /* photo geometry (image pixels, 800×1423) */
  const IMW=800,IMH=1423,STACK={x:63,y:460},PIV={x:411,y:623},DIAL={a:99,b:73,phi:-13*Math.PI/180},GAP=26;
  const HAND={tip:.9,tail:.47,th0:56*Math.PI/180};

  const clamp=v=>v<0?0:v>1?1:v,lerp=(a,b,k)=>a+(b-a)*k;
  const eOut=k=>1-Math.pow(1-k,3),eIn=k=>k*k*k;
  const eBack=k=>{const c=1.5;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
  const eBounce=k=>{const n=7.5625,d=2.75;if(k<1/d)return n*k*k;if(k<2/d)return n*(k-=1.5/d)*k+.75;if(k<2.5/d)return n*(k-=2.25/d)*k+.9375;return n*(k-=2.625/d)*k+.984375};
  function goldGrad(c,x0,y0,x1,y1){const g=c.createLinearGradient(x0,y0,x1,y1);
    g.addColorStop(0,'#5E3B0D');g.addColorStop(.18,'#B07A22');g.addColorStop(.38,'#F3D485');g.addColorStop(.5,'#FFF4D2');g.addColorStop(.62,'#E8B858');g.addColorStop(.82,'#9A651B');g.addColorStop(1,'#4F310A');return g}

  let W,H,DPR,base,cam;
  function size(){DPR=Math.min(3,window.devicePixelRatio||1);W=window.innerWidth;H=window.innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
    const s=Math.max(W/IMW,H/IMH);base={s,ox:(W-IMW*s)/2,oy:(H-IMH*s)/2}}
  size();addEventListener('resize',size);
  const toScreen=(x,y)=>{const z=cam.z;return[cam.fx+(base.ox+x*base.s-cam.fx)*z,cam.fy+(base.oy+y*base.s-cam.fy)*z+cam.dy]};

  /* point on the dial plane (unit circle, 0 = 12 o'clock, clockwise) → image pixels */
  function dialPt(th,r){const u=Math.sin(th)*r,v=-Math.cos(th)*r,c=Math.cos(DIAL.phi),s=Math.sin(DIAL.phi);
    return[PIV.x+u*DIAL.a*c-v*DIAL.b*s,PIV.y+u*DIAL.a*s+v*DIAL.b*c]}

  function drawHand(th,alpha,shadow){
    const tip=dialPt(th,HAND.tip),tail=dialPt(th+Math.PI,HAND.tail),dx=tip[0]-tail[0],dy=tip[1]-tail[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
    const wB=3.4,wT=1.1;
    ctx.save();ctx.globalAlpha=alpha;
    if(shadow){ctx.translate(2.5,4.5);ctx.fillStyle='rgba(0,0,0,.28)'}else{ctx.fillStyle='#17140f'}
    ctx.beginPath();ctx.moveTo(tail[0]+nx*wB*.9,tail[1]+ny*wB*.9);ctx.lineTo(PIV.x+nx*wB,PIV.y+ny*wB);ctx.lineTo(tip[0]+nx*wT,tip[1]+ny*wT);
    ctx.lineTo(tip[0]-nx*wT,tip[1]-ny*wT);ctx.lineTo(PIV.x-nx*wB,PIV.y-ny*wB);ctx.lineTo(tail[0]-nx*wB*.9,tail[1]-ny*wB*.9);ctx.closePath();ctx.fill();
    ctx.restore();
  }
  function drawPivot(){const g=ctx.createRadialGradient(PIV.x-2,PIV.y-2,.5,PIV.x,PIV.y,7);g.addColorStop(0,'#f5ead2');g.addColorStop(.45,'#8a7a5e');g.addColorStop(1,'#1d1a14');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(PIV.x,PIV.y,7,5.6,DIAL.phi,0,7);ctx.fill()}

  function logoPath(cx,cy,L){const w=L*.248,gap=L*.352,tw=w*2+gap,r=L*.05,x=cx-tw/2,y=cy-L/2,cb=L*.184,c0=cy-cb/2,c1=cy+cb/2,p=new Path2D();
    const B=y+L,xi=x+w,xj=x+w+gap,xr=x+tw;
    p.moveTo(x+r,y);p.arcTo(xi,y,xi,y+r,r);p.lineTo(xi,c0);p.lineTo(xj,c0);p.lineTo(xj,y+r);p.arcTo(xj,y,xj+r,y,r);p.arcTo(xr,y,xr,y+r,r);
    p.arcTo(xr,B,xr-r,B,r);p.arcTo(xj,B,xj,B-r,r);p.lineTo(xj,c1);p.lineTo(xi,c1);p.lineTo(xi,B-r);p.arcTo(xi,B,xi-r,B,r);p.arcTo(x,B,x,B-r,r);p.arcTo(x,y,x+r,y,r);p.closePath();
    return{p,x,y,tw}}

  function frame(now,bg,stack){
    const t=isNaN(FREEZE)?(now-t0)/1000:FREEZE;
    ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    ctx.clearRect(0,0,W,H);
    // gentle push-in on the stopwatch
    const fp=[base.ox+PIV.x*base.s,base.oy+PIV.y*base.s];
    cam={fx:fp[0],fy:fp[1],z:1+.07*eOut(clamp(t/1.5)),dy:-H*.015*eOut(clamp(t/1.5))};
    ctx.save();
    const o=toScreen(0,0),z=base.s*cam.z;ctx.transform(z,0,0,z,o[0],o[1]); // image space from here
    ctx.drawImage(bg,0,0,IMW,IMH);
    // money pile grows: new bundles slide out underneath
    const layers=[.12,.36,.6].map((t0,i)=>({i:i+1,k:clamp((t-t0)/.3)}));
    const lowest=layers.reduce((m,l)=>l.k>0?Math.max(m,(l.i-1+eBounce(l.k))*GAP):m,0);
    ctx.save();ctx.translate(lowest*.4,lowest);ctx.globalAlpha=.55;const sh=ctx.createRadialGradient(400,1000,20,400,1000,330);sh.addColorStop(0,'rgba(0,0,0,.85)');sh.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sh;ctx.save();ctx.translate(400,985);ctx.scale(1,.32);ctx.translate(-400,-985);ctx.beginPath();ctx.arc(400,985,330,0,7);ctx.fill();ctx.restore();ctx.restore();
    for(let n=layers.length-1;n>=0;n--){const l=layers[n];if(l.k<=0)continue;const off=(l.i-1+eBounce(l.k))*GAP;
      ctx.save();ctx.beginPath();ctx.rect(0,0,IMW,IMH);ctx.rect(262,450,140,118);ctx.clip('evenodd');
      ctx.drawImage(dark[l.i-1],STACK.x,STACK.y+off);ctx.restore()}
    ctx.drawImage(stack,STACK.x,STACK.y);
    // stopwatch hand spinning faster and faster (with motion blur)
    const spin=t<1.2?2*t*t:2.88+4.8*(t-1.2),th=HAND.th0+spin*Math.PI*2,omega=t<1.2?4*t:4.8;
    const trail=Math.min(1.1,omega*.22);
    drawHand(th,1,true);
    for(let i=7;i>=1;i--)drawHand(th-trail*i/7,.13*(1-i/8),false);
    drawHand(th,1,false);drawPivot();
    // the dial lights up as the logo comes out
    const gk=clamp((t-1.0)/.35);
    if(gk>0){ctx.save();ctx.globalCompositeOperation='lighter';
      const g=ctx.createRadialGradient(PIV.x,PIV.y,2,PIV.x,PIV.y,140);g.addColorStop(0,`rgba(255,226,160,${.95*gk})`);g.addColorStop(.45,`rgba(242,169,59,${.55*gk})`);g.addColorStop(1,'rgba(242,169,59,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(PIV.x,PIV.y,170,140,DIAL.phi,0,7);ctx.fill();
      ctx.translate(PIV.x,PIV.y);ctx.rotate(t*.6);for(let i=0;i<14;i++){const a=i/14*Math.PI*2,rg=ctx.createRadialGradient(0,0,10,0,0,900);rg.addColorStop(0,`rgba(255,205,120,${.22*gk})`);rg.addColorStop(1,'rgba(255,205,120,0)');
        ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,900,a-.04,a+.04);ctx.closePath();ctx.fill()}
      ctx.restore()}
    ctx.restore();
    // dim the photo behind the logo
    const lk=clamp((t-1.1)/.4);
    if(lk>0){ctx.fillStyle=`rgba(6,6,8,${.5*lk})`;ctx.fillRect(0,0,W,H)}
    // H logo rises out of the dial, then the app opens through it
    if(t>=1.1){
      const d=toScreen(PIV.x,PIV.y),Lf=Math.min(W,H)*.34,tx=W/2,ty=Math.min(d[1]-H*.06,H*.42);
      const e=eBack(clamp((t-1.1)/.42)),L0=Lf*(.12+.88*e),cxL=lerp(d[0],tx,eOut(clamp((t-1.1)/.42))),cyL=lerp(d[1],ty,eOut(clamp((t-1.1)/.42)));
      const zk=clamp((t-1.72)/.58),zs=1+eIn(zk)*48,L=L0*zs;
      if(zk>0)el.style.background='transparent';
      const {p,x,y,tw}=logoPath(cxL,cyL,L);
      ctx.save();ctx.globalAlpha=clamp((t-1.1)/.15);
      if(zk<=0){ctx.shadowColor='rgba(255,180,60,.7)';ctx.shadowBlur=40*DPR}
      ctx.fillStyle=goldGrad(ctx,x,y,x+tw,y+L);ctx.fill(p);ctx.shadowBlur=0;
      ctx.save();ctx.clip(p);const hl=ctx.createLinearGradient(0,y,0,y+L);hl.addColorStop(0,'rgba(255,255,255,.35)');hl.addColorStop(.25,'rgba(255,255,255,0)');hl.addColorStop(.8,'rgba(0,0,0,0)');hl.addColorStop(1,'rgba(0,0,0,.35)');ctx.fillStyle=hl;ctx.fillRect(x-5,y-5,tw+10,L+10);
      const sk=clamp((t-1.45)/.35);if(sk>0&&sk<1){const sx=lerp(x-L*.6,x+tw+L*.6,eOut(sk));ctx.translate(sx,cyL);ctx.rotate(.35);const sg=ctx.createLinearGradient(-L*.16,0,L*.16,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.85)');sg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=sg;ctx.fillRect(-L*.16,-L,L*.32,L*2)}
      ctx.restore();
      if(zk>0){ // open a window shaped like the H, framed in gold, and grow it until it fills the screen
        ctx.globalAlpha=1;ctx.globalCompositeOperation='destination-out';ctx.fillStyle='#000';ctx.save();ctx.globalAlpha=clamp(zk*6);ctx.fill(p);ctx.restore();
        ctx.globalCompositeOperation='source-over';ctx.lineWidth=Math.max(1.5,L*.035);ctx.strokeStyle=goldGrad(ctx,x,y,x+tw,y+L);ctx.globalAlpha=1-clamp((zk-.6)/.4);ctx.stroke(p);
        // fade what is left of the scene in the last moments
        if(zk>.4){ctx.globalCompositeOperation='destination-out';ctx.globalAlpha=clamp((zk-.4)/.45);ctx.fillRect(0,0,W,H)}
      }
      ctx.restore();
    }
    // fade in from black
    if(t<.22){ctx.fillStyle=`rgba(6,6,8,${1-t/.22})`;ctx.fillRect(0,0,W,H)}
    if(!isNaN(FREEZE))return;
    if(t>=END){finish();return}
    raf=requestAnimationFrame(n=>frame(n,bg,stack));
  }
  let t0=0,dark=[];
  const load=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src});
  const giveUp=setTimeout(skip,2500);
  Promise.all([load('intro/bg.jpg'),load('intro/stack.webp')]).then(([bg,stack])=>{
    clearTimeout(giveUp);if(done)return;
    // darker copies of the bundle for the lower layers of the pile
    dark=[1,2,3].map(i=>{const c=document.createElement('canvas');c.width=stack.width;c.height=stack.height;const g=c.getContext('2d');g.drawImage(stack,0,0);g.globalCompositeOperation='source-atop';g.fillStyle=`rgba(8,6,3,${.18+i*.1})`;g.fillRect(0,0,c.width,c.height);return c});
    raf=requestAnimationFrame(n=>{t0=n;frame(n,bg,stack)});
  }).catch(()=>{clearTimeout(giveUp);skip()});
})();

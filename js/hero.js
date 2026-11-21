(()=>{
// ---------- hero: 3D figures float, flee from the cursor ----------
const hero=document.getElementById('hero');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// [file, boxLeft, boxTop, boxSize, innerSize, rotation] — from Figma
const F=[['xta5wv',20,306,237,237,0],['sag1ke',11,609,255,255,0],['7fhaq1',175,464,257,257,0],['b3x5l9',304,576,321,321,0],
 ['kzqxp7',634.665,513,286.042,232,15.67],['lcta5k',806,568,336,336,0],['7jkg97',996,445.873,321.742,260,-16.05],
 ['an5jpf',1021,141,263,263,0],['d4ag15',1227,340,213,213,0],['55f6l4',1116,577,260,260,0]];
const figs=F.map(([n,L,T,B,sz,r])=>{
  const el=document.createElement('div');el.className='fig';el.style.width=el.style.height=sz+'px';
  el.innerHTML=`<img src="hero/${n}.webp" alt="">`;hero.appendChild(el);
  const a=Math.random()*Math.PI*2,sp=10+Math.random()*10;
  return {el,x:L+B/2,y:T+B/2,r:sz*.42,size:sz,rot:r,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,vr:(Math.random()-.5)*6,base:sp};
});
// phone: the figures stand still in the lower part of the screen (no physics loop), they only drop in once
if(window.MOB){
  figs.forEach(f=>{const s=f.size*.42;Object.assign(f.el.style,{width:s+'px',height:s+'px',left:(f.x/1440*100)+'%',top:(56+(f.y-260)/640*38)+'%',transform:`translate(-50%,-50%) rotate(${f.rot}deg)`})});
  figs.forEach((f,i)=>f.el.animate([{opacity:0,translate:'0 40px',scale:.6},{opacity:1,translate:'0 0',scale:1}],{duration:reduce?1:800,delay:200+i*90,easing:'cubic-bezier(.34,1.5,.55,1)',fill:'backwards'}));
}else{
// soft no-go zones: title and the weather/nav strip
const zones=[{x:415,y:250,w:610,h:265},{x:90,y:40,w:1260,h:200}];
let mx=-9999,my=-9999;
hero.addEventListener('pointermove',e=>{[mx,my]=window.__deck.toStage(e.clientX,e.clientY)});
hero.addEventListener('pointerleave',()=>{mx=my=-9999});
let last=performance.now();
function step(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  const vis=window.DECK.p<1.05;
  if(vis&&!reduce){
    for(const f of figs){
      // flee from cursor
      const dx=f.x-mx,dy=f.y-my,d=Math.hypot(dx,dy),R=f.r+170;
      if(d<R&&d>0){const k=(1-d/R)*2600;f.vx+=dx/d*k*dt;f.vy+=dy/d*k*dt;f.vr+=(Math.random()-.5)*60*dt}
      // keep off the title & weather
      for(const z of zones){const cx=Math.max(z.x,Math.min(f.x,z.x+z.w)),cy=Math.max(z.y,Math.min(f.y,z.y+z.h));
        const ex=f.x-cx,ey=f.y-cy,ed=Math.hypot(ex,ey),lim=f.r*.75;
        if(ed<lim){const k=(1-ed/lim)*900;const nx=ed?ex/ed:0,ny=ed?ey/ed:1;f.vx+=nx*k*dt;f.vy+=ny*k*dt}}
      // nudge apart from each other
      for(const g of figs){if(g===f)continue;const ax=f.x-g.x,ay=f.y-g.y,ad=Math.hypot(ax,ay),m=(f.r+g.r)*.8;
        if(ad<m&&ad>0){const k=(1-ad/m)*500;f.vx+=ax/ad*k*dt;f.vy+=ay/ad*k*dt}}
      // relax back to a slow drift
      const sp=Math.hypot(f.vx,f.vy);
      if(sp>f.base){const s=Math.max(f.base/sp,1-1.6*dt);f.vx*=s;f.vy*=s}else if(sp<f.base*.7){f.vx*=1.02;f.vy*=1.02}
      f.vr*=1-1.2*dt;if(Math.abs(f.vr)<2)f.vr+=(Math.random()-.5)*.4;
      f.x+=f.vx*dt;f.y+=f.vy*dt;f.rot+=f.vr*dt;
      // bounce on the edges of the browser window (not of the 1440×873 layout)
      const pad=f.r*.6,[L,T,Rr,B]=window.__deck.box();
      if(f.x<L+pad){f.x=L+pad;f.vx=Math.abs(f.vx)}if(f.x>Rr-pad){f.x=Rr-pad;f.vx=-Math.abs(f.vx)}
      if(f.y<T+pad){f.y=T+pad;f.vy=Math.abs(f.vy)}if(f.y>B-pad){f.y=B-pad;f.vy=-Math.abs(f.vy)}
    }
  }
  if(vis)for(const f of figs){const tilt=Math.max(-14,Math.min(14,f.vx*.12));
    f.el.style.transform=`translate(${f.x-f.size/2}px,${f.y-f.size/2}px) rotate(${f.rot}deg) perspective(600px) rotateY(${tilt}deg)`}
  requestAnimationFrame(step);
}
requestAnimationFrame(step);
// intro: figures drop in
figs.forEach((f,i)=>f.el.animate([{opacity:0,translate:'0 60px',scale:.6},{opacity:1,translate:'0 0',scale:1}],{duration:reduce?1:900,delay:200+i*110,easing:'cubic-bezier(.34,1.5,.55,1)',fill:'backwards'}));
}

// ---------- weather in Belgrade: Open-Meteo on the live site, the page's db inside the Claude artifact ----------
const setW=w=>{if(!w)return;
  if(w.temp!=null)document.getElementById('wT').textContent=Math.round(w.temp);
  if(w.precip!=null)document.getElementById('wP').textContent=`вероятность осадков: ${w.precip}%`;
  if(w.humidity!=null)document.getElementById('wH').textContent=`влажность: ${w.humidity}%`;
  if(w.wind!=null)document.getElementById('wW').textContent=`ветер: ${w.wind} км/ч`;};
async function openMeteo(){
  const u='https://api.open-meteo.com/v1/forecast?latitude=44.8125&longitude=20.4612&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=precipitation_probability&timezone=Europe%2FBelgrade&forecast_days=1';
  const r=await fetch(u);if(!r.ok)throw 0;const j=await r.json();
  const h=j.current.time.slice(0,13),k=j.hourly.time.findIndex(x=>x.slice(0,13)===h);
  setW({temp:j.current.temperature_2m,humidity:Math.round(j.current.relative_humidity_2m),wind:Math.round(j.current.wind_speed_10m),precip:k>=0?j.hourly.precipitation_probability[k]:null});
}
(async()=>{
  try{await openMeteo();setInterval(()=>openMeteo().catch(()=>{}),30*60*1000);return}catch(e){}
  try{const c=window.claude;if(!c||!c.use)return;const db=await c.use('db');if(!db)return;
    db.doc('weather/belgrade').onSnapshot(s=>{const v=s&&(typeof s.data==='function'?s.data():s.data);setW(v)},()=>{});}catch(e){}
})();
})();

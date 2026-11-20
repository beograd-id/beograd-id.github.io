// Presentation deck: each gesture moves exactly one screen.
// Wheel / trackpad, touch swipe, keyboard, menu buttons and #hash links all go through DECK.go().
(()=>{
const deck=document.getElementById('deck');
const slides=[...document.querySelectorAll('.slide:not(.off)')];
const IDS=slides.map(s=>s.dataset.hash||s.id);
slides.forEach((s,i)=>{s.style.zIndex=i+1;const sh=document.createElement('div');sh.className='shade';s.appendChild(sh);s._sh=sh});
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let S=1,OX=0,OY=0;
const DECK=window.DECK={idx:0,p:0,indexOf:el=>slides.indexOf(el),go:null};
window.__deck={toStage:(cx,cy)=>[(cx-OX)/S,(cy-OY)/S]};
function fit(){S=Math.min(innerWidth/1440,innerHeight/873);OX=(innerWidth-1440*S)/2;OY=(innerHeight-873*S)/2;
  deck.style.transform=`translate(${OX}px,${OY}px) scale(${S})`;render()}
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const THEMES=slides.map(s=>s.dataset.theme||'light'),hdr=document.getElementById('hdr'),edge=document.getElementById('edge');
function render(){
  const p=DECK.p;let edgeY=-1,edgeT=0;
  slides.forEach((s,i)=>{
    const d=p-i; // 0 = in place; >0 = covered by the next one; <0 = waiting below
    if(d<=-1||d>=1.6){s.style.visibility='hidden';return}
    s.style.visibility='visible';
    if(d<0){ // incoming: a window opens from the bottom, content moves slower (parallax)
      const t=ease(1+d),k=1-t;
      s.style.transform=`translateY(${k*873*.35}px)`;
      s.style.clipPath=k>0.0005?`inset(${k*65}% 0 0 0 round ${k*48}px ${k*48}px 0 0)`:'none';
      s._sh.style.opacity=0;edgeY=k*873;edgeT=t;
    } else { // outgoing: tips back like a page and dims
      const t=Math.min(1,d);
      s.style.transform=t>0.0005?`perspective(1600px) translateY(${-t*70}px) rotateX(${t*7}deg) scale(${1-t*.07})`:'none';
      s.style.clipPath='none';s._sh.style.opacity=t*.6;
      s.style.pointerEvents=t>0.5?'none':'';
    }
  });
  if(edgeY>0&&edgeY<873){edge.style.opacity=Math.sin(edgeT*Math.PI);edge.style.transform=`translateY(${edgeY}px) scaleX(${.15+edgeT*.85})`}else edge.style.opacity=0;
  const cur=Math.min(slides.length-1,Math.max(0,Math.round(p)));
  if(hdr.dataset.theme!==THEMES[cur])hdr.dataset.theme=THEMES[cur];
  hdr.querySelectorAll('[data-go]').forEach(b=>b.classList.toggle('cur',b.classList.contains('pill')&&+b.dataset.go===cur&&cur>0));
  dispatchEvent(new Event('deckchange'));
}
// ---- animated move to a screen; input is locked while it runs ----
let anim=null,busyUntil=0;
function go(n,instant){
  n=Math.max(0,Math.min(slides.length-1,n));
  if(n===DECK.idx&&!anim&&Math.abs(DECK.p-n)<.001)return;
  const from=DECK.p,dur=(instant||reduce)?0:Math.min(1100,650+Math.abs(n-from)*250);
  const entering=n!==DECK.idx,prev=DECK.idx;DECK.idx=n;if(anim)cancelAnimationFrame(anim);
  if(entering)dispatchEvent(new CustomEvent('deckenter',{detail:{idx:n,slide:slides[n],from:prev}}));
  try{history.replaceState(null,'','#'+IDS[n])}catch(e){}
  busyUntil=performance.now()+dur+120;
  if(!dur){DECK.p=n;anim=null;render();return}
  const t0=performance.now();
  const tick=now=>{const k=Math.min(1,(now-t0)/dur);DECK.p=from+(n-from)*(k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2);render();
    if(k<1)anim=requestAnimationFrame(tick);else{anim=null;DECK.p=n;render()}};
  anim=requestAnimationFrame(tick);
}
DECK.go=go;
const busy=()=>performance.now()<busyUntil;
// a screen may have inner steps (slide._step(dir) returns true while it has a page left in that direction):
// the screen stays, only its content changes
function step(dir){const s=slides[DECK.idx];
  if(s._step&&s._step(dir)){busyUntil=performance.now()+(reduce?200:800);return}
  go(DECK.idx+dir)}
// ---- wheel / trackpad: one gesture = one screen (inertia tail is swallowed) ----
let acc=0,lastWheel=0,used=false,innerAt=0;
// a screen with slide._scroller scrolls like a normal page; the deck takes over only at its edges
const scroller=()=>slides[DECK.idx]._scroller;
const canScroll=(sc,dir)=>dir>0?sc.scrollTop+sc.clientHeight<sc.scrollHeight-1:sc.scrollTop>0;
addEventListener('wheel',e=>{
  const now=performance.now(),sc=scroller();
  if(sc&&!busy()&&Math.abs(e.deltaY)>=Math.abs(e.deltaX)&&e.deltaY){
    if(canScroll(sc,Math.sign(e.deltaY))){innerAt=lastWheel=now;used=true;
      if(!sc.contains(e.target)){e.preventDefault();sc.scrollTop+=e.deltaY}return}
    if(now-innerAt<400){innerAt=lastWheel=now;e.preventDefault();return} // inertia reached the edge: same gesture, stay
  }
  e.preventDefault();
  if(busy()){lastWheel=now;used=true;acc=0;return}   // anything during a transition belongs to the same gesture
  if(now-lastWheel>260){used=false;acc=0}            // a real pause starts a new gesture
  lastWheel=now;
  if(used)return;
  if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
  acc+=e.deltaMode===1?e.deltaY*30:e.deltaY;
  if(Math.abs(acc)>35){used=true;step(acc>0?1:-1);acc=0}
},{passive:false});
// ---- touch: vertical swipe changes the screen; horizontal swipes are left to the sliders ----
let ty=null,tx=null,tTop=0;
addEventListener('touchstart',e=>{if(e.touches.length===1){ty=e.touches[0].clientY;tx=e.touches[0].clientX;const sc=scroller();tTop=sc?sc.scrollTop:0}},{passive:true});
addEventListener('touchmove',e=>{const sc=scroller();if(!(sc&&sc.contains(e.target)))e.preventDefault()},{passive:false});
addEventListener('touchend',e=>{if(ty===null)return;const t=e.changedTouches[0],dy=t.clientY-ty,dx=t.clientX-tx;ty=tx=null;
  if(busy())return;const sc=scroller();if(sc&&(sc.scrollTop!==tTop||canScroll(sc,dy<0?1:-1)))return;if(Math.abs(dy)>50&&Math.abs(dy)>Math.abs(dx)*1.2)step(dy<0?1:-1)},{passive:true});
// ---- keyboard ----
addEventListener('keydown',e=>{
  if(e.target.closest&&e.target.closest('input,textarea'))return;
  const k=e.key,sc=scroller();
  if(sc&&['ArrowDown','PageDown',' ','ArrowUp','PageUp'].includes(k)){const dir=['ArrowUp','PageUp'].includes(k)?-1:1;
    if(canScroll(sc,dir)){e.preventDefault();sc.scrollBy({top:dir*(k.startsWith('Arrow')?220:700),behavior:reduce?'auto':'smooth'});return}}
  if(['ArrowDown','PageDown',' '].includes(k)){e.preventDefault();if(!busy())step(1)}
  else if(['ArrowUp','PageUp'].includes(k)){e.preventDefault();if(!busy())step(-1)}
  else if(k==='Home'){e.preventDefault();go(0)}else if(k==='End'){e.preventDefault();go(slides.length-1)}
});
// ---- menu + links ----
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(+b.dataset.go)));
addEventListener('hashchange',()=>{const i=IDS.indexOf(location.hash.slice(1));if(i>=0&&i!==DECK.idx)go(i)});
addEventListener('resize',fit);
// full screen (hidden where the browser can't do it, e.g. iPhone Safari)
const fsBtn=document.getElementById('fsBtn');
if(fsBtn){if(!document.fullscreenEnabled)fsBtn.remove();else fsBtn.addEventListener('click',()=>{
  document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})})}
// #project / #districts are also element ids: stop the browser from scrolling the viewport to them
const vp=document.getElementById('vp');
const pin=()=>{if(vp.scrollTop||vp.scrollLeft){vp.scrollTop=0;vp.scrollLeft=0}if(scrollX||scrollY)scrollTo(0,0)};
vp.addEventListener('scroll',pin);addEventListener('scroll',pin);addEventListener('load',pin);
// start on the screen named in the address (#home, #city, #project, #districts)
const start=IDS.indexOf(location.hash.slice(1));DECK.idx=start>0?start:0;DECK.p=DECK.idx;fit();
// the first screen plays its entrance once every script has attached
addEventListener('DOMContentLoaded',()=>dispatchEvent(new CustomEvent('deckenter',{detail:{idx:DECK.idx,slide:slides[DECK.idx]}})));
})();

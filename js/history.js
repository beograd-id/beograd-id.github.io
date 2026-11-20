(()=>{
const stage=document.getElementById('stage');
// the collage is cropped to the 1440×873 frame: the red margins of a wide window stay empty
const crop=document.createElement('div');crop.className='h-crop';stage.prepend(crop);

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const POP='cubic-bezier(.34,1.6,.55,1)',OUT='cubic-bezier(.5,0,.9,.4)',EASE='cubic-bezier(.6,0,.2,1)';
const SCENE_MS=3600;
// Geometry from Figma: [key, kind, boxLeft, boxTop, boxW, boxH, innerW, innerH, transform, opts]
// kinds: paper (lays down), land (wipes in), card (pops), grow (grows up from its base), detail (pops & sways)
const S=[
 {y:'5000',suf:' до н. э.',cap:'мыс над слиянием Савы и Дуная',els:[
   ['paperB','paper',1094,102,663,286],
   ['vland','land',569,225,992,541],
   ['vhead','detail',729,372,631.019,502.113,559,388,'rotate(167.21deg) scaleY(-1)'],
   ['vobj','detail',1202,198,221,253]]},
 {y:'279',suf:' до н. э.',cap:'кельты · сингидун',els:[
   ['paperB','paper',1067.74,18,715.528,453.991,663,286,'rotate(15.62deg)'],
   ['celts','card',546,288,1034.46,681.35,962.095,536.983,'rotate(-9.03deg)'],
   ['helmet','detail',546,54,831.807,477.683,813.911,443.951,'rotate(177.6deg) scaleY(-1)']]},
 {y:'86',cap:'римляне · сингидунум',els:[
   ['paperB','paper',1109,691,715.528,453.991,663,286,'rotate(15.62deg)'],
   ['hill','land',527,235,1586,531,1586,531,'rotate(180deg) scaleY(-1)',{crop:'left:-3.66%;top:-17.73%;width:107.21%;height:135.74%'}],
   ['roman','grow',1001,100,727,397],
   ['coin','detail',953,607,438,238],
   ['boat','detail',439,388,670,365]]},
 {y:'878',cap:'первое имя · београд',els:[
   ['riverA','land',527,-433,1536.886,1536.886,1526.064,647.421,'rotate(45deg)'],
   ['riverB','land',105,388,1638.33,1166.528,1508.294,639.882,'rotate(-22.41deg)'],
   ['sign','grow',431,221,1168.093,760.379,1086.657,592.722,'rotate(9.29deg)']]},
 {y:'1521',cap:'османы · торговый узел',els:[
   ['plain','land',373,236,1810,768],
   ['cart','detail',587,248,950,518],
   ['pipe','detail',996,126,443.64,313.861,401.101,218.782,'rotate(14.78deg)'],
   ['dzezva','detail',759,152,329,179]]},
 {y:'1717',cap:'австрийская империя',els:[
   ['paperW','paper',493,23,1570,981,0,0,'',{under:true}],
   ['eagle','detail',768,-76,929.406,686.009,830.458,452.977,'rotate(17.87deg)'],
   ['plain','land',373,236,1810,768],
   ['facade','grow',676,236,824,449]]},
 {y:'2012',cap:'новый белград',els:[
   ['paperW','paper',414,-355,1482.398,1818.514,1570,981,'rotate(-68.8deg)'],
   ['tower','grow',817,177,270,619],
   ['bridge','grow',759,-37,1302,710],
   ['waterfront','grow',957,18,260,630],
   ['tram','detail',817,380,877,479]]}
];
const geo=e=>{const [,,L,T,W,H,iw,ih,tr]=e;const w=iw||W,h=ih||H;
  return {left:(L+W/2-w/2)+'px',top:(T+H/2-h/2)+'px',width:w+'px',height:h+'px',transform:tr||'none'}};
// preload
new Set(S.flatMap(s=>s.els.map(e=>e[0]))).forEach(n=>{const im=new Image();im.src=`img/${n}.webp`});
const rnd=(a,b)=>a+Math.random()*(b-a);
const anim=(el,f,o)=>reduce?el.animate([f[f.length-1]],{duration:1,fill:'forwards'}):el.animate(f,o);
const live=new Map(); // key -> {el,fx,kind}

function create(e){
  const [key,kind,,,,,,,,o={}]=e;
  const el=document.createElement('div');el.className='el';
  const fx=document.createElement('div');fx.className='fx'+(o.crop?' crop':'');
  const sw=document.createElement('div');sw.className='sw';
  const img=document.createElement('img');img.src=`img/${key}.webp`;img.alt='';
  if(o.crop){img.style.cssText='position:absolute;max-width:none;object-fit:fill;'+o.crop}
  sw.appendChild(img);fx.appendChild(sw);el.appendChild(fx);
  Object.assign(el.style,geo(e));crop.appendChild(el);
  if(!reduce){
    if(kind==='detail')sw.style.animation=`sway ${rnd(2.8,4).toFixed(2)}s ${(-rnd(0,3)).toFixed(2)}s ease-in-out infinite`;
    if(key.startsWith('river'))sw.style.animation='drift 6s ease-in-out infinite';
  }
  return {el,fx,kind};
}
function enter(r,delay){
  const {fx,kind}=r;
  const F={
    paper:[{transform:'translateY(-50px) rotate(5deg)',opacity:0},{transform:'none',opacity:1}],
    land:[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],
    card:[{transform:'scale(.6) rotate(-6deg)',opacity:0},{transform:'none',opacity:1}],
    grow:[{transformOrigin:'50% 100%',transform:'scaleY(.35)',clipPath:'inset(100% 0 0 0)'},{transformOrigin:'50% 100%',transform:'none',clipPath:'inset(0 0 0 0)'}],
    detail:[{transform:`scale(.15) rotate(${rnd(-20,20)}deg)`,opacity:0},{transform:'none',opacity:1}]}[kind];
  const dur={paper:600,land:800,card:600,grow:900,detail:520}[kind];
  const ease={paper:POP,land:EASE,card:POP,grow:'cubic-bezier(.2,.9,.2,1)',detail:POP}[kind];
  anim(fx,F,{duration:dur,delay,easing:ease,fill:'both'});
}
function leave(r,delay){
  const a=anim(r.fx,[{transform:'none',opacity:1},{transform:`translateY(40px) rotate(${rnd(-10,10)}deg) scale(.8)`,opacity:0}],
    {duration:300,delay,easing:OUT,fill:'forwards'});
  const done=()=>r.el.remove(); if(reduce)done(); else a.onfinish=done;
}
const DELAY={paper:0,land:150,card:300,grow:450,detail:750};
function show(s){
  const keys=new Set(s.els.map(e=>e[0]));
  let i=0;[...live].forEach(([k,r])=>{if(!keys.has(k)){leave(r,i++*50);live.delete(k)}});
  const cnt={};
  s.els.forEach((e,idx)=>{
    const [key,kind,,,,,,,,o={}]=e;const z=o.under?1:10+idx;
    if(live.has(key)){ // carried over: travel to the new position
      const r=live.get(key);r.el.style.zIndex=z;const g=geo(e);const cs=r.el.style;
      const from={left:cs.left,top:cs.top,width:cs.width,height:cs.height,transform:cs.transform||'none'};
      Object.assign(r.el.style,g);
      if(JSON.stringify(from)!==JSON.stringify(g))anim(r.el,[from,g],{duration:900,easing:EASE});
    } else {
      const r=create(e);r.el.style.zIndex=z;live.set(key,r);
      cnt[kind]=(cnt[kind]||0);enter(r,250+DELAY[kind]+cnt[kind]++*(kind==='grow'?220:130));
    }
  });
}
// date strip
const numEl=document.getElementById('num'),capEl=document.querySelector('#cap span'),dot=document.getElementById('dot');
let dotX=0;
function setYear(s,idx){
  anim(capEl,[{transform:'none',opacity:1},{transform:'translateY(-100%)',opacity:0}],{duration:160,fill:'forwards'})
   .onfinish=()=>{capEl.textContent=s.cap;anim(capEl,[{transform:'translateY(100%)',opacity:0},{transform:'none',opacity:1}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'})};
  const x=853*idx/(S.length-1);
  anim(dot,[{transform:`translateX(${dotX}px)`},{transform:`translateX(${x}px)`}],{duration:idx===0?700:600,easing:EASE,fill:'forwards'});dotX=x;
  numEl.innerHTML='';
  const ds=[...s.y].map((ch,i)=>{const d=document.createElement('span');d.className='d';d.textContent=reduce?ch:String(Math.floor(Math.random()*10));numEl.appendChild(d);return [d,ch,i]});
  if(s.suf){const f=document.createElement('span');f.className='suf';f.textContent=s.suf;numEl.appendChild(f);
    anim(f,[{opacity:0},{opacity:1}],{duration:300,delay:450,fill:'both'})}
  if(reduce)return;
  ds.forEach(([d,ch,i])=>{let n=0;const stop=5+i*2;
    const t=setInterval(()=>{
      if(++n>=stop){clearInterval(t);d.textContent=ch;d.animate([{transform:'translateY(-16%) scaleY(1.1)'},{transform:'translateY(4%) scaleY(.94)'},{transform:'none'}],{duration:280,easing:'ease-out'})}
      else d.textContent=String(Math.floor(Math.random()*10));
    },45);});
}
let k=0;
function play(){show(S[k]);setYear(S[k],k);k=(k+1)%S.length}
anim(document.getElementById('line'),[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:800,easing:EASE,fill:'both'});
anim(dot,[{transform:'scale(0)'},{transform:'scale(1)'}],{duration:300,easing:POP});
document.fonts.ready.then(()=>setTimeout(()=>{play();setInterval(()=>{const D=window.DECK;if(!D||Math.abs(D.p-D.indexOf(document.getElementById('stage')))<1)play()},SCENE_MS)},400));
})();

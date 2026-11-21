(()=>{
// ---------- screen 3: the archive as a network — every picture is a node, each fact is a bundle of links; nodes can be dragged ----------
const FACTS=[["Масштаб проекта", "В проект вошли десять городских общин: Стари град, Врачар, Савски венац, Нови Београд, Земун, Палилула, Звездара, Вождовац, Чукарица и Раковица.", ["f1_2"]], ["Почему общины", "В рамках проекта сначала были исследованы кварталы — исторически сложившиеся районы Белграда. Кварталы не имеют официального статуса, а общины закреплены административно: у них есть карты и открытые данные. Поэтому единицей системы стала община.", ["g:vracar", "g:zemun"]], ["Старое ядро", "Врачар, Стари град и Савски венац — самая старая и плотная часть города: фасады вплотную, крыши, дворы. На них я впервые проверяла правила знаков.", ["f3_5"]], ["Откуда названия", "Названия общин растут из мест: Стари град — ядро у Калемегдана, Врачар — холм над городом, Савски венац — гребень над Савой. Топонимику я изучила, но в знаки не переносила: форма следует из истории района, а не из слова.", ["f4_1", "f4_4"]], ["Пиротский килим", "Пиротский килим — тканый безворсовый ковёр из города Пирот на юго-востоке Сербии. Его ткут вручную на вертикальном станке, а узор собирают из простых геометрических знаков: ступеней, ромбов, крючков. Эта геометрия стала одной из отправных точек для знаков проекта.", ["k1", "k2"]], ["Значение цвета", "Изучая пиротский килим, я вышла на старую сербскую одежду. В народном костюме края рубахи — ворот, рукава, подол — обшивали красной каймой: она считалась оберегом. Поэтому красный достался Стари граду, самой старой и важной общине города, — как знак того, что она под защитой.", ["f14_3"]], ["Паттерн как в ковре", "Знаки общин складываются в полотно так же, как мотивы килима: повтор, ритм, кайма. Из десяти знаков получается паттерн для мерча и навигации.", ["f15_1"]], ["Форма + цвет", "Чтобы айдентику было проще читать, у каждой общины есть и своя форма, и свой цвет. Поэтому кроме названий в системе появились знаки: так она понятнее.", ["L:stari-grad", "L:vracar"]]], PH=["p3454", "p4567", "p3051", "p4588", "p3339", "p4570", "p3064_2", "p4576", "p3047", "p4577", "p3049", "p4578", "p3213", "p4595", "p3190", "p4561", "p3148", "p4594", "p3142", "p4579", "p3140", "p4590", "p3139", "p4581", "p3067", "p4582", "p3460", "p4589", "p3137", "p4591", "p3278", "p4572", "p3279", "p4592", "p3284", "p4575", "p3333", "p4574", "p3138", "p4568", "p3313", "p4565", "p3336", "p4563_2", "p3437", "p4569", "p3361", "p4562", "p3453", "p4593", "p3468", "p4583", "p3337", "p4587", "p3466", "p4584", "p3457", "p4586", "p3439", "p4560", "p3328", "p4580", "p3462", "p4573", "p3464", "p4585", "p3430", "p4566", "p3429", "p4564", "p3424", "p3452", "p3447", "p3445", "p3448", "p3451", "p3421"], GN={"stari-grad": "Стари град", "vracar": "Врачар", "savski-venac": "Савски венац", "novi-beograd": "Нови Београд", "zemun": "Земун", "palilula": "Палилула", "zvezdara": "Звездара", "vozdovac": "Вождовац", "cukarica": "Чукарица", "rakovica": "Раковица"};
const P=document.getElementById('project'),svg=document.getElementById('sys'),peek=document.getElementById('ppeek');
const NS='http://www.w3.org/2000/svg',reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mk=(tag,attrs,parent=svg)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);parent.appendChild(e);return e};
const div=(cls,css,html)=>{const e=document.createElement('div');e.className=cls;if(css)e.style.cssText=css;if(html)e.innerHTML=html;P.appendChild(e);return e};
// small files for the tiles, full-size ones only for the hover preview
const src=k=>k.startsWith('g:')?`gerb-s/${k.slice(2)}.webp`:k.startsWith('L:')?`logos/${k.split(':')[1]}.webp`:/^p\d/.test(k)?`ph-s/${k}.webp`:`art-s/${k}.webp`;
const big=k=>k.startsWith('g:')?`gerb/${k.slice(2)}-card.webp`:k.startsWith('L:')?src(k):/^p\d/.test(k)?`ph/${k}.webp`:`art/${k}.webp`;
if(window.MOB){const N=FACTS.length,fN=document.getElementById('fN'),fT=document.getElementById('fT'),fD=document.getElementById('fD'),box=document.getElementById('fact');
  document.getElementById('fOf').textContent='/ '+String(N).padStart(2,'0');
  const pics=document.createElement('div');pics.className='fimgs';box.insertBefore(pics,box.querySelector('.fnav'));
  let c=0;const show=i=>{c=(i+N)%N;const f=FACTS[c];fN.textContent=String(c+1).padStart(2,'0');fT.textContent=f[0];fD.textContent=f[1];
    pics.innerHTML=f[2].map(k=>`<img src="${big(k)}" alt="" loading="lazy" class="${/^[gL]:/.test(k)?'gb':''}">`).join('')};
  document.getElementById('fPrev').addEventListener('click',()=>show(c-1));document.getElementById('fNext').addEventListener('click',()=>show(c+1));
  show(0);return}
// field inside the page margins
const FX0=748,FX1=1340,FY0=100,FY1=842,CXc=(FX0+FX1)/2,CYc=(FY0+FY1)/2;
let seed=7;const rr=()=>(seed=(seed*16807)%2147483647)/2147483647;
const GERBS=['stari-grad','vracar','savski-venac','novi-beograd','zemun','palilula','zvezdara','vozdovac','cukarica','rakovica'].map(n=>'g:'+n);
const nodes=[],edges=[],tiles=[],items=FACTS.map(()=>({specs:[],nodes:[],edges:[]}));
const node=(k,f,s,spec)=>{const n={k,f,s,spec,x:0,y:0,ed:[]};nodes.push(n);items[f].nodes.push(n);return n};
const edge=(a,b,owners,len)=>{const e={a,b,owners,len};edges.push(e);a.ed.push(e);b.ed.push(e);owners.forEach(o=>items[o].edges.push(e));return e};
// nodes: main artifacts are large, city photos come in mixed sizes, coats of arms are small
const SIZES=[20,20,22,22,24,24,26,28,30,34,40,48,58];let pn=0;const per=[5,10,11,10,11,9,11,10];
FACTS.forEach((f,i)=>{const a=(i/FACTS.length)*2*Math.PI-Math.PI/2;
  f[2].forEach((k,j)=>{const n=node(k,i,j?66:86,true);n.x=CXc+Math.cos(a)*95+j*40;n.y=CYc+Math.sin(a)*120+j*30;if(j)edge(items[i].nodes[0],n,[i],85)});
  const hub=items[i].nodes[0];
  (i===0?GERBS:[]).concat(PH.slice(pn,pn+per[i])).forEach(k=>{const n=node(k,i,30,false);
    const b=rr()*6.283,d=60+rr()*120;n.x=hub.x+Math.cos(b)*d;n.y=hub.y+Math.sin(b)*d;edge(hub,n,[i],80+rr()*rr()*240)});pn+=per[i]});
// a fact's pictures also hold on to each other, and the facts are chained in reading order
items.forEach((o,i)=>{const g=o.nodes.filter(n=>!n.spec);g.forEach((n,j)=>{if(rr()<.45)edge(n,g[(j+1+Math.floor(rr()*3))%g.length],[i],110)});
  if(i<items.length-1)edge(o.nodes[0],items[i+1].nodes[0],[i,i+1],210)});
// the web in the background: every picture is also tied to a few others across the field
nodes.forEach(a=>{for(let k=0;k<4;k++){const b=nodes[Math.floor(rr()*nodes.length)];if(a!==b)edge(a,b,[],0)}});
// settle the network once: springs along links, no overlaps, everything stays inside the field
const clamp=n=>{const h=n.s/2;n.x=Math.max(FX0+h,Math.min(FX1-h,n.x));n.y=Math.max(FY0+h,Math.min(FY1-h,n.y))};
for(let it=0;it<760;it++){const al=it<400?1-it/440:.25;
  if(it===400)nodes.forEach(n=>{if(n.spec)return;const d=Math.min(1,Math.hypot((n.x-CXc)/((FX1-FX0)/2),(n.y-CYc)/((FY1-FY0)/2)));
    n.s=Math.round(Math.max(n.k.startsWith('g:')?24:16,46*Math.pow(1-d,1.2)+14))}); // large in the middle, smallest at the rim
  for(const e of edges){if(!e.len||it>=400)continue;const dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,d=Math.hypot(dx,dy)||1,k=(d-e.len)/d*.06*al;e.a.x+=dx*k;e.a.y+=dy*k;e.b.x-=dx*k;e.b.y-=dy*k}
  for(let i=0;i<nodes.length;i++){const a=nodes[i];
    if(it<400){a.x+=(CXc-a.x)*(a.spec?.02:.0012)*al;a.y+=(CYc-a.y)*(a.spec?.016:.0008)*al}
    for(let j=i+1;j<nodes.length;j++){const b=nodes[j];let dx=b.x-a.x,dy=b.y-a.y;const m=(a.s+b.s)/2+(it<400?12:6);
      if(Math.abs(dx)<m&&Math.abs(dy)<m){if(!dx&&!dy){dx=rr()-.5;dy=rr()-.5}
        const ox=m-Math.abs(dx),oy=m-Math.abs(dy);if(ox<oy){const s=Math.sign(dx||1)*ox/2;a.x-=s;b.x+=s}else{const s=Math.sign(dy||1)*oy/2;a.y-=s;b.y+=s}}}}
  nodes.forEach(clamp)}
nodes.forEach(n=>{n.x=Math.round(n.x);n.y=Math.round(n.y)});
// draw
const place=n=>{n.e.style.left=(n.x-n.s/2)+'px';n.e.style.top=(n.y-n.s/2)+'px'};
const lay=e=>{e.l.setAttribute('x1',e.a.x);e.l.setAttribute('y1',e.a.y);e.l.setAttribute('x2',e.b.x);e.l.setAttribute('y2',e.b.y)};
edges.forEach(e=>{e.l=mk('line',{class:'net'+(e.len?'':' bg')});lay(e)});
nodes.forEach(n=>{const k=n.k,e=div('tile card'+(n.spec?' spec':'')+(k.startsWith('g:')||k.startsWith('L:')?' gb':''),`width:${n.s}px;height:${n.s}px`,`<img src="${src(k)}" alt="" draggable="false">`);
  e._k=k;e._f=n.f;e._node=n;n.e=e;place(n);tiles.push(e);if(n.spec)items[n.f].specs.push(e)});
// ---------- hover: the artifact pops out ----------
let pa=null,cur=null;
function openPeek(el){cur=el;const r={x:parseFloat(el.style.left),y:parseFloat(el.style.top),w:parseFloat(el.style.width),h:parseFloat(el.style.height)};
  const k=el._k,im=el.querySelector('img');peek.className=k.endsWith(':gray')?'gray':'';peek.style.backgroundImage=`url(${big(k)})`;
  peek.style.backgroundSize=k.startsWith('L:')?'60% auto':'cover';peek.style.backgroundColor=k.startsWith('L:')?'#fff':'#eee';
  let ar=k.startsWith('g:')||k.startsWith('L:')?1:(im&&im.naturalWidth?im.naturalWidth/im.naturalHeight:1);
  let th=k.startsWith('g:')?360:420,tw=th*ar;if(tw>560){tw=560;th=tw/ar}
  const tx=Math.min(1340-tw,Math.max(748,r.x+r.w/2-tw/2)),ty=Math.min(840-th,Math.max(100,r.y+r.h/2-th/2));
  peek.style.width=tw+'px';peek.style.height=th+'px';pa&&pa.cancel();
  pa=peek.animate([{opacity:0,transform:`translate(${r.x}px,${r.y}px) scale(${r.w/tw},${r.h/th})`},{opacity:1,offset:.3},{opacity:1,transform:`translate(${tx}px,${ty}px) scale(1)`}],
    {duration:reduce?1:380,easing:'cubic-bezier(.2,.9,.2,1)',fill:'forwards'})}
function closePeek(el){if(cur!==el)return;cur=null;const st=getComputedStyle(peek).transform;pa&&pa.cancel();
  pa=peek.animate([{opacity:1,transform:st},{opacity:0,transform:st+' scale(.94)'}],{duration:reduce?1:180,fill:'forwards'})}

// ---------- drag: every card can be moved, its links follow; a reload puts everything back ----------
let drag=null,zTop=10;
tiles.forEach(el=>{const n=el._node;
  el.addEventListener('pointerenter',e=>{if(!drag&&e.pointerType==='mouse')openPeek(el)});el.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')closePeek(el)});
  el.addEventListener('touchstart',e=>e.stopPropagation(),{passive:true});
  el.addEventListener('pointerdown',e=>{if(e.button)return;e.preventDefault();const [sx,sy]=window.__deck.toStage(e.clientX,e.clientY);
    drag={n,dx:n.x-sx,dy:n.y-sy,moved:false};el.setPointerCapture(e.pointerId);el.style.zIndex=++zTop;el.classList.add('drag');closePeek(el)});
  el.addEventListener('pointermove',e=>{if(!drag||drag.n!==n)return;const [sx,sy]=window.__deck.toStage(e.clientX,e.clientY);
    const nx=sx+drag.dx,ny=sy+drag.dy;if(Math.abs(nx-n.x)+Math.abs(ny-n.y)>2)drag.moved=true;n.x=nx;n.y=ny;clamp(n);place(n);n.ed.forEach(lay)});
  const end=e=>{if(!drag||drag.n!==n)return;const moved=drag.moved;drag=null;el.classList.remove('drag');if(!moved){show(n.f,n.f>curF?1:-1);
    // finger or pen: a tap opens the picture (there is no hover), the next tap anywhere closes it
    if(e.type==='pointerup'&&e.pointerType!=='mouse')openPeek(el)}};
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end)});
P.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'&&cur&&!e.target.closest('.tile'))closePeek(cur)});
addEventListener('deckchange',()=>{if(cur)closePeek(cur)});
// ---------- facts: the arrows light up another bundle ----------
const N=FACTS.length,fN=document.getElementById('fN'),fT=document.getElementById('fT'),fD=document.getElementById('fD');
document.getElementById('fOf').textContent='/ '+String(N).padStart(2,'0');
let curF=-1;
function show(i,dir){i=(i+N)%N;if(i===curF)return;curF=i;
  nodes.forEach(n=>n.e.classList.toggle('mine',n.f===i));
  edges.forEach(e=>{const on=e.owners.includes(i);e.l.classList.toggle('on',on);if(on)svg.appendChild(e.l)});
  const swap=()=>{fN.textContent=String(i+1).padStart(2,'0');fT.textContent=FACTS[i][0];fD.textContent=FACTS[i][1]};
  if(reduce)swap();else{const box=document.getElementById('fact');
    box.animate([{opacity:1,transform:'none'},{opacity:0,transform:`translateX(${-(dir||1)*12}px)`}],{duration:150,fill:'forwards'}).onfinish=()=>{swap();
      box.animate([{opacity:0,transform:`translateX(${(dir||1)*16}px)`},{opacity:1,transform:'none'}],{duration:340,easing:'cubic-bezier(.2,.9,.2,1)',fill:'forwards'})}}}
document.getElementById('fPrev').addEventListener('click',()=>show(curF-1,-1));
document.getElementById('fNext').addEventListener('click',()=>show(curF+1,1));
const onP=()=>window.DECK.idx===window.DECK.indexOf(P);
addEventListener('keydown',e=>{if(!onP())return;if(e.key==='ArrowRight')show(curF+1,1);if(e.key==='ArrowLeft')show(curF-1,-1)});
show(0,1);
// ---------- entrance: the network unfolds from the middle ----------
let live=[];
function unfold(){if(reduce)return;live.forEach(x=>x.cancel());live=[];
  nodes.forEach((n,k)=>live.push(n.e.animate([{opacity:0,transform:`translate(${(CXc-n.x)*.8}px,${(CYc-n.y)*.8}px) scale(.3)`},{opacity:1,transform:'none'}],
    {duration:900,delay:420+(n.spec?0:200)+k*6,easing:'cubic-bezier(.2,.9,.2,1)',fill:'backwards'})));
  edges.forEach((e,k)=>live.push(e.l.animate([{opacity:0},{}],{duration:600,delay:1300+k*2,fill:'backwards'})));
}
addEventListener('deckenter',e=>{if(e.detail.slide===P)unfold()});
})();

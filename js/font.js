// «Шрифт»: свободная композиция из знаков SRBPRO по эскизу Алисы
// (её коллаж: знаки и группы знаков разного масштаба вокруг кольца). Цвета — палитра проекта:
// графит — основной, голубой Нового Београда — второй, кольцо — красный Стари града. Подложек нет.
// Каждый знак (и кольцо) перетаскивается отдельно, даже внутри групп; «вернуть на место» собирает композицию заново.
(()=>{
const R=document.getElementById('font');if(!R)return;
const pile=document.getElementById('fPile');
const G='#3b342d',P='#95cbfb',RING='#fc3030';
// [знаки, x, y — левый край и верх прописной на эскизе 850×1100, высота прописной на эскизе, цвет]
const C=[
  ['T',147,120,100],['EFGHI',272,112,40],['“”‘()[]/\\.,:;·…–—',462,150,12],
  ['Ž',290,232,200],['Л',215,228,30],['И',478,203,40],['D',512,222,45],['W',590,178,40],
  ['L',127,270,65],['Б',215,300,85],['ПРС',448,285,28,P],['Щ',450,325,140],['Ё',588,310,70],['K',662,325,40],
  ['J',658,318,135],['ТУФ',630,400,28,P],['X',110,395,40],['R',187,420,38],['Й',130,465,50],['A',605,450,35],
  ['Ш',268,470,115],['ЊЋЏ · ĆČĐŠ',468,520,18],['З',675,512,30],['V',733,520,40],['S',80,535,40],
  ['Љ',118,535,110,P],['H',410,540,40],['Y',438,595,40],['E',493,572,90],['Г',628,555,110],['Ц',690,590,30],
  ['N',748,595,40],['Ч',35,655,22],['ABC',283,630,40],['M',590,630,35],['O',703,668,40],['ЪЫЬЭЮЯ',140,685,40],
  ['Ђ',412,668,35],['J',458,715,65],['Д',565,700,105],['@',670,745,40],['0123456789',140,750,18],
  ['PO',205,760,90,P],['!?&',337,828,38],['X',195,845,25],['U',642,845,40],['Ж',488,830,90],['Z',598,890,28],
  ['K',152,905,125],['B',258,860,85],['#%*+=<>«»',345,935,28],['M',435,985,40],
];
const RINGC=[432,585,220,147]; // центр x, y, внешний и внутренний радиус на эскизе
// эскиз вертикальный, поле — почти квадрат: высоту вписываем целиком, по ширине немного раздвигаем
const X0=30,Y0=105,KX=.80,KY=.655,KS=.66,CAP=.70,ASC=.75;
let z=10;
function build(){
  pile.querySelectorAll('.g,.ring').forEach(e=>e.remove());
  const [cx,cy,ro,ri]=RINGC,r=document.createElement('div');r.className='ring';
  const rw=ro*2*KS;r.style.cssText=`width:${rw}px;height:${rw}px;border:${(ro-ri)*KS}px solid ${RING}`;
  r._x=(cx-X0)*KX-rw/2;r._y=(cy-Y0)*KY-rw/2;r.style.transform=`translate(${r._x}px,${r._y}px)`;r._ox=r._x;r._oy=r._y;pile.appendChild(r);
  // группы вроде ABC или ЪЫЬЭЮЯ разбиваются на отдельные знаки: каждый тащится сам по себе,
  // из них можно складывать свои слова. Место каждого знака — ширина строки до него (с кернингом).
  C.forEach(([t,x,y,h,c])=>{const fs=h/CAP*KS;cv.font=`${fs}px SRBPRO`;
    const x0=(x-X0)*KX,y0=(y-Y0)*KY-(ASC-CAP)*fs;
    [...t].forEach((ch,i)=>{if(ch===' ')return;const e=document.createElement('span');e.className='g';e.textContent=ch;
      e.style.fontSize=fs+'px';e.style.color=c||G;e.style.zIndex=++z;
      e._x=x0+cv.measureText(t.slice(0,i)).width;e._y=y0;e._ox=e._x;e._oy=e._y;
      e.style.transform=`translate(${e._x}px,${e._y}px)`;pile.appendChild(e)})});
}
const cv=document.createElement('canvas').getContext('2d');
// перетаскивание: знаки поднимаются наверх, плашки остаются сзади
let drag=null;
pile.addEventListener('pointerdown',e=>{const g=e.target.closest('.g,.ring');if(!g||e.button)return;e.preventDefault();
  const [sx,sy]=window.__deck.toStage(e.clientX,e.clientY);drag={g,dx:g._x-sx,dy:g._y-sy};
  g.setPointerCapture(e.pointerId);g.classList.add('drag');if(g.classList.contains('g'))g.style.zIndex=++z});
pile.addEventListener('pointermove',e=>{if(!drag)return;const [sx,sy]=window.__deck.toStage(e.clientX,e.clientY);
  const g=drag.g;g._x=sx+drag.dx;g._y=sy+drag.dy;g.style.transform=`translate(${g._x}px,${g._y}px)`});
const end=()=>{if(!drag)return;drag.g.classList.remove('drag');drag=null};
pile.addEventListener('pointerup',end);pile.addEventListener('pointercancel',end);
pile.addEventListener('touchstart',e=>e.stopPropagation(),{passive:true});
// «вернуть на место»: сдвинутые знаки плавно едут обратно, потом все знаки вздрагивают —
// так видно, что их можно трогать и двигать
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function shake(){if(reduce)return;
  pile.querySelectorAll('.g,.ring').forEach(e=>{const a=(Math.random()<.5?-1:1)*(4+Math.random()*6),d=Math.random()*220;
    e.animate([{rotate:'0deg',translate:'0 0'},{rotate:a+'deg',translate:'0 -7px'},{rotate:-a*.6+'deg',translate:'0 2px'},{rotate:a*.25+'deg',translate:'0 -1px'},{rotate:'0deg',translate:'0 0'}],
      {duration:620,delay:d,easing:'ease-out'})})}
document.getElementById('fShuffle').addEventListener('click',()=>{let moved=false;
  pile.querySelectorAll('.g,.ring').forEach(e=>{if(e._x!==e._ox||e._y!==e._oy){moved=true;e._x=e._ox;e._y=e._oy;e.style.transform=`translate(${e._x}px,${e._y}px)`}});
  setTimeout(shake,moved?520:0)});
document.fonts.load('40px SRBPRO').then(build);
})();

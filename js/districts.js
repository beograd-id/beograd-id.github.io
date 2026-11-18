(()=>{
// ---------- screen 4: the ten district signs ----------
const D=[["stari-grad", "Стари град", "Stari grad", "#fc3030", "Зубчатая стена — силуэт Калемегдана. Город начался с крепости на мысу, поэтому знак старейшей общины собран из прямоугольника и прорезей бойниц: самая простая и самая узнаваемая форма.", "Красный — цвет оберега. Красной вышивкой на рукавах и подоле народной рубахи защищались от злых сил; кайма замыкала край. Знак ядра города получил этот цвет.", "Калемегдан, Кнез Михайлова, Дорчол, Скадарлия. Здесь стоял римский Сингидунум и средневековый город деспота Стефана."], ["vracar", "Врачар", "Vračar", "#e7b780", "Ступенчатый крест с куполом — план и силуэт Храма Святого Саввы.", "Тёплый песочный — камень и светлые фасады плотной застройки.", "Самая маленькая и самая плотная община Белграда. Храм Святого Саввы, Каленич-пияца, тихие улицы особняков."], ["savski-venac", "Савски венац", "Savski venac", "#8fd969", "Дуга — «венац», гребень над Савой: холм, спускающийся к реке, и арка моста. Половина окружности с прорезью у основания.", "Светло-зелёный — парки и леса: Топчидер, Сеняк, Дедине.", "Вдоль Савы: правительственный квартал, Белградский вокзал, Савамала, виллы Дедине."], ["novi-beograd", "Нови Београд", "Novi Beograd", "#95cbfb", "Сцепленные прямоугольники — «блокови», модернистские кварталы, которые нумеруются, а не называются. Форма собрана как план застройки сверху.", "Светло-голубой — вода: город построен на болотах между Савой и Дунаем.", "Строится с 1948 года как новая столица Югославии. Блоки, Ушће, Генекс, Арена."], ["zemun", "Земун", "Zemun", "#f6765e", "Островерхая форма — шпиль башни Гардош и крутые крыши. Капля с острым верхом, единственная «вертикальная» среди знаков.", "Кораллово-терракотовый — черепица австрийских крыш над Дунаем.", "До 1918 года — граница Австро-Венгрии, до 1934-го — отдельный город. Гардош, Кей, рыбные рестораны у воды."], ["palilula", "Палилула", "Palilula", "#ffcf49", "Правильный шестигранник — устойчивая форма для самой большой по площади общины, которая лежит по обе стороны Дуная.", "Жёлтый — огонёк трубки: название по легенде от «пали лулу», «зажги трубку».", "Ташмайдан, Ботаническая база, а за Дунаем — Панчевачки рит, поля и сёла."], ["zvezdara", "Звездара", "Zvezdara", "#4f7dff", "Многолучевая звезда — прямо из названия: холм получил имя по Белградской обсерватории.", "Синий — ночное небо над обсерваторией.", "Звездарский лес, обсерватория 1932 года, Мали Мокри Луг, улица Булевар краља Александра."], ["vozdovac", "Вождовац", "Voždovac", "#c77dd6", "Мягкий пятилепестковый цветок — зелень окраин: Баница, склоны Авалы.", "Сиреневый — самый «отдельный» цвет палитры, чтобы знак не путался с соседями.", "Названа в честь вожда Карагеоргия. В общине — гора Авала и Авальская телебашня."], ["cukarica", "Чукарица", "Čukarica", "#2ba59b", "Три округлые вершины — кроны деревьев и холмы: лес Кошутняк и остров Ада Циганлия.", "Бирюзовый — между зелёным и голубым: лес Кошутняк и вода озера Ада.", "Ада Циганлия — главный пляж города, Кошутняк, Баново брдо, Жарково."], ["rakovica", "Раковица", "Rakovica", "#e0607e", "Шестерёнка — индустриальное прошлое: заводы, которые строили южный Белград.", "Розово-красный — кирпич фабричных корпусов, высветленный, чтобы не спорить с красным Стари града.", "Промышленная община XX века, монастырь Раковица, Ресник, Канарево брдо."]];
const R=document.getElementById('districts'),big=document.getElementById('dBig'),strip=document.getElementById('dStrip');
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg',reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad=n=>String(n).padStart(2,'0');
D.forEach((d,i)=>{const t=document.createElement('div');t.className='t';t.innerHTML=`<img src="logos/${d[0]}.webp" alt="${d[1]}">`;t.addEventListener('click',()=>go(i));strip.appendChild(t)});
let cur=-1;
function go(i){
  i=(i+D.length)%D.length;if(i===cur)return;const dir=i>cur?1:-1;cur=i;const d=D[i];
  // info
  const info=R.querySelector('.d-info');
  const fill=()=>{$('dN').textContent=pad(i+1);$('dName').textContent=d[1];$('dLat').textContent=d[2];$('dF').textContent=d[4];$('dC').textContent=d[5];$('dH').textContent=d[6];
    R.querySelector('.d-num').style.color=d[3];['dB1','dB2','dB3'].forEach(k=>$(k).style.color=d[3]==='#ffcf49'||d[3]==='#95cbfb'||d[3]==='#8fd969'||d[3]==='#e7b780'?'#3b342d':d[3]);$('dSw').style.background=d[3]};
  if(reduce)fill();else info.animate([{opacity:1,transform:'none'},{opacity:0,transform:`translateX(${-20*dir}px)`}],{duration:180,fill:'forwards'}).onfinish=()=>{fill();
    info.animate([{opacity:0,transform:`translateX(${24*dir}px)`},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.9,.2,1)',fill:'forwards'})};
  // sign swap: the old sign leaves completely before the new one appears — never overlapping
  const show=()=>{big.innerHTML='';const img=document.createElement('img');img.src=`logos/${d[0]}.webp`;img.alt=d[1];big.appendChild(img);
    if(!reduce)img.animate([{opacity:0,transform:`translateX(${40*dir}px) scale(.92)`},{opacity:1,transform:'none'}],{duration:480,easing:'cubic-bezier(.2,.9,.2,1)',fill:'backwards'})};
  const old=big.querySelector('img');
  if(old&&!reduce){big.getAnimations({subtree:true}).forEach(a=>a.finish());
    old.animate([{opacity:1,transform:'none'},{opacity:0,transform:`translateX(${-40*dir}px) scale(.92)`}],{duration:220,easing:'ease-in',fill:'forwards'}).onfinish=show}
  else show();
  strip.querySelectorAll('.t').forEach((t,k)=>t.classList.toggle('on',k===i));
}
addEventListener('keydown',e=>{if(window.DECK.idx!==window.DECK.indexOf(R))return;
  if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft')go(cur-1);});
// swipe / drag
let sx=null,sy=null;R.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});R.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)go(cur+(dx<0?1:-1))});
go(0);
})();

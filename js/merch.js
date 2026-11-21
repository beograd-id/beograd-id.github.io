// «Носители» — the last screen scrolls like an ordinary web page. Gutter 20 everywhere, every row closes flush: no gaps inside the grid.
// Each item: [file in merch/, caption, x, y, width, height, object-position] in screen pixels (page is 1440 wide).
// To swap a photo, drop a file with the same name into merch/; to move or resize it, edit the numbers.
(()=>{
const slide=document.getElementById('merch');if(!slide)return;
// Y1 / Y2: tops of the photos under the right text and under «применение» — set to the text height + 28 so the columns close flush
const Y1=498,Y2=902;
const ITEMS=[
  // block 1 (164–698): picnic cloth, the blue key (its own tall proportion), the lead text over the street sign
  ['picnic','Плед',100,164,400,534,'50% 50%'],
  ['key-blue','Брелок',520,164,260,534,'50% 40%'],
  ['sign','Табличка',800,Y1,540,698-Y1,'60% 50%'],
  // block 2 (718–1176): plate, «применение» over two small photos, the mural
  ['plate','Тарелка',100,718,400,458,'50% 50%'],
  ['key-beige','Брелок',520,Y2,242,1176-Y2,'50% 56%'],
  ['bracelet','Браслет',782,Y2,242,1176-Y2,'55% 30%'],
  ['facade','Мурал',1044,718,296,458,'50% 50%'],
  // block 3 (1196–1628): «от автора» on the left, socks and necklace
  ['socks-pile','Носки',520,1196,400,432,'0% 50%'],
  ['necklace','Колье',940,1196,400,432,'50% 50%'],
  // block 4 (1648–2182): gloves on the bag next to the scarf
  ['gloves-bag','Перчатки',100,1648,400,534,'55% 50%'],
  ['scarf','Платок',520,1648,820,534,'50% 40%'],
  // block 5 (2202–2662): two halves
  ['gloves-flat','Перчатки',100,2202,610,460,'50% 50%'],
  ['socks-four','Носки',730,2202,610,460,'60% 50%']];
const END=2762; // footer top: 100 below the last row
const sc=slide.querySelector('.g-scroll'),pg=slide.querySelector('.g-page'),box=slide.querySelector('.g-merch');
// the page starts with «Карта города» (one screen, 873 tall); «Носители» begin right under it
const MAP_H=873,wantMerch=location.hash==='#merch';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const tiles=ITEMS.map(([f,cap,x,y,w,h,pos])=>{
  const el=document.createElement('figure');el.className='g-t';
  Object.assign(el.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
  const im=new Image();im.src='merch/'+f+'.webp';im.alt=cap;im.decoding='async';im.loading='lazy';im.style.objectPosition=pos;
  el.append(im);box.appendChild(el);return el});
const foot=document.createElement('footer');foot.className='g-foot';foot.style.top=END+'px';
foot.innerHTML=`<div class="g-fcol g-fmain"><div class="g-fname">Визуальная идентичность Белграда</div><p>Некоммерческий авторский проект, 2026</p>
  <button type="button" class="g-top">в начало<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 11V1M1.5 5.5 6 1l4.5 4.5"/></svg></button></div>
<div class="g-fcol"><b>КОНТАКТЫ</b><a href="mailto:alisanefed@gmail.com">alisanefed@gmail.com</a><p class="g-fstudio">Разработка айдентики и графический дизайн на заказ — <a href="https://alisanefed-bit.github.io/sloya-site/" target="_blank" rel="noopener">студия SLOYA</a></p></div>
<div class="g-fcol"><b>ИЗОБРАЖЕНИЯ</b><p>Гербы общин и фотографии города приводятся в исследовательских целях, права на них принадлежат владельцам. Носители — визуализации, созданные с помощью нейросети.</p></div>
<div class="g-fcol"><b>ДАННЫЕ</b><p>Сайт не использует cookies и не собирает персональные данные. Посещения считаются анонимно через <a href="https://www.goatcounter.com/" target="_blank" rel="noopener">GoatCounter</a>. Шрифт Inter загружается с Google Fonts, погода — с <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> (CC BY 4.0), карта — с OpenFreeMap (© участники <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>): эти сервисы видят технические данные запроса, например IP-адрес.</p></div>
<div class="g-fcopy">© 2026. Знаки общин, шрифт SRBPRO и тексты — авторская работа; использование — с указанием источника.</div>`;
box.appendChild(foot);
foot.querySelector('.g-top').addEventListener('click',()=>DECK.go(0));
pg.style.height=(MAP_H+END+foot.offsetHeight+60)+'px';
// the deck scrolls this element natively and moves to the previous screen only from its very top
slide._scroller=sc;
// photos rise in as they scroll into view (every time the screen is opened)
let io=null;
function arm(){
  if(reduce)return;
  if(io)io.disconnect();
  tiles.forEach(t=>t.classList.add('wait'));
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('wait');io.unobserve(e.target)}}),{root:sc,rootMargin:'0px 0px -8% 0px'});
  tiles.forEach(t=>io.observe(t));
}
let jump=wantMerch;
addEventListener('deckenter',e=>{if(e.detail.slide!==slide)return;sc.scrollTop=jump?MAP_H:0;jump=false;arm()});
// a #merch link opens the page right at «Носители»
window.__toMerch=()=>{if(DECK.idx===DECK.indexOf(slide))sc.scrollTo({top:MAP_H,behavior:'smooth'});else{jump=true;DECK.go(DECK.indexOf(slide))}};
// statistics: «Носители» count as their own screen once the reader scrolls down to them
let counted=false;sc.addEventListener('scroll',()=>{if(!counted&&sc.scrollTop>MAP_H*.6&&window.__stat){counted=true;window.__stat('merch')}},{passive:true});
})();

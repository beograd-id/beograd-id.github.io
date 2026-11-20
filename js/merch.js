// «Носители» — the last screen scrolls like an ordinary web page: a big photo, a loose collage, two big photos.
// Each item: [file in merch/, caption, x, y, width, height, object-position] in screen pixels (page is 1440 wide).
// To swap a photo, drop a file with the same name into merch/; to move or resize it, edit the numbers.
(()=>{
const slide=document.getElementById('merch');if(!slide)return;
const ITEMS=[
  ['socks-pile','Носки',0,180,1440,720,'50% 50%'],
  // collage: three loose columns, edges deliberately not aligned
  ['facade','Мурал',100,1060,360,560,'50% 50%'],
  ['gloves-flat','Перчатки',480,1020,500,300,'50% 45%'],
  ['key-blue','Брелок',480,1340,200,300,'50% 80%'],
  ['plate','Тарелка',700,1400,280,240,'50% 50%'],
  ['key-beige','Брелок',1000,1020,340,420,'42% 50%'],
  ['socks-four','Носки',1000,1460,340,200,'50% 50%'],
  ['scarf','Платок',100,1780,600,760,'62% 50%'],
  ['gloves-bag','Перчатки',720,1840,620,700,'55% 60%']];
const END=2660; // footer top
const sc=slide.querySelector('.g-scroll'),pg=slide.querySelector('.g-page');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const tiles=ITEMS.map(([f,cap,x,y,w,h,pos])=>{
  const el=document.createElement('figure');el.className='g-t';
  Object.assign(el.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
  const im=new Image();im.src='merch/'+f+'.webp';im.alt=cap;im.decoding='async';im.loading='lazy';im.style.objectPosition=pos;
  const c=document.createElement('figcaption');c.textContent=cap;if(w===1440)c.style.left='100px';
  el.append(im,c);pg.appendChild(el);return el});
const foot=document.createElement('div');foot.className='g-foot';foot.style.top=END+'px';
foot.innerHTML='<span>Визуальная идентичность Белграда</span><button type="button" class="g-top">в начало<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 11V1M1.5 5.5 6 1l4.5 4.5"/></svg></button>';
pg.appendChild(foot);pg.style.height=(END+140)+'px';
foot.querySelector('.g-top').addEventListener('click',()=>DECK.go(0));
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
addEventListener('deckenter',e=>{if(e.detail.slide!==slide)return;sc.scrollTop=0;arm()});
})();

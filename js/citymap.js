// «Карта города»: живая карта-путеводитель (опубликована отдельно, репозиторий belgrade-guide) в рамке телефона.
// Карта грузится, только когда человек впервые дошёл до этого экрана, — чтобы не тормозить первые экраны.
(()=>{
const R=document.getElementById('citymap');if(!R)return;
const URL='https://alisanefed-bit.github.io/belgrade-guide/';
const fr=document.getElementById('mFrame');
const load=()=>{if(!fr.src){fr.src=URL;fr.addEventListener('load',()=>R.querySelector('.m-wait').remove(),{once:true})}};
addEventListener('deckenter',e=>{if(e.detail.slide===R)load()});
const btn=document.getElementById('mCopy'),txt=btn.textContent;
btn.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(URL);btn.textContent='Ссылка скопирована'}
  catch(e){btn.textContent=URL}
  setTimeout(()=>btn.textContent=txt,2200)});
})();

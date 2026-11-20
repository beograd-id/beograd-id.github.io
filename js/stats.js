// Visit statistics: GoatCounter (beograd-id.goatcounter.com) — no cookies, no personal data.
// Each screen is counted once per page load as its own path (/home, /city, … /merch), so the dashboard shows how far people get.
(()=>{
const seen=new Set(),queue=[];
const NAMES={home:'Заставка',city:'О городе',project:'О проекте',districts:'Общины',font:'Шрифт',map:'Карта города',merch:'Носители'};
const send=p=>{const gc=window.goatcounter;if(gc&&gc.count)gc.count({path:p.path,title:p.title});else queue.push(p)};
addEventListener('deckenter',e=>{const s=e.detail.slide;if(!s)return;const h=s.dataset.hash||'home';if(seen.has(h))return;seen.add(h);
  send({path:'/'+h,title:NAMES[h]||h})});
// the counter script loads async; flush what arrived before it
const t=setInterval(()=>{const gc=window.goatcounter;if(gc&&gc.count){clearInterval(t);queue.splice(0).forEach(send)}},500);
setTimeout(()=>clearInterval(t),20000);
})();

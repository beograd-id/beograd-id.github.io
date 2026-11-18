// Reveal on arrival: when a screen is scrolled to, its text, pictures and cards fade in,
// slide in from the side or from below, or zoom in. Replays every time the screen is opened.
(()=>{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const FROM={up:{translate:'0 46px'},down:{translate:'0 -30px'},left:{translate:'-70px 0'},right:{translate:'70px 0'},zoom:{scale:'.8'},fade:{}};
// screen id → [selector, how it arrives, start delay ms, step between siblings ms]
const PLAN={
  hero:[['.ttl h1','zoom',0,0],['.ttl p','up',250,0],['.temp','left',300,0],['.wx p','left',420,90],['.fig','zoom',150,70],['.hint','fade',1200,0]],
  stage:[['.title','left',0,0],['.text p:not(.gap)','up',120,70],['#strip','up',500,0]],
  project:[['.p-text h2','left',0,0],['.p-body p:not(.gap)','up',120,70],['#fact','up',520,0],['.credit','fade',900,0]],
  districts:[['.d-title','left',0,0],['.d-lead','up',120,0],['.d-info .d-num','left',220,0],['.d-info .d-name','left',300,0],['.d-info .d-lat','left',360,0],
    ['.d-blocks>div','up',420,110],['.stage','zoom',200,0],['.strip .t','up',500,45]]};
const live=new Map();
function play(slide){const plan=PLAN[slide.id];if(!plan)return;
  (live.get(slide)||[]).forEach(a=>a.cancel());const run=[];
  plan.forEach(([sel,how,delay,step])=>slide.querySelectorAll(sel).forEach((el,i)=>{
    run.push(el.animate([{opacity:0,...FROM[how]},{}],{duration:how==='zoom'?800:650,delay:380+delay+i*step,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'}))}));
  live.set(slide,run)}
addEventListener('deckenter',e=>play(e.detail.slide));
})();

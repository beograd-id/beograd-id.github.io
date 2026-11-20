// Типографика: короткие слова (предлоги, союзы, частицы) не остаются в конце строки,
// тире не начинает строку. Между ними и следующим словом ставится неразрывный пробел.
// Работает на всём сайте, в том числе для текста, который скрипты экранов подставляют позже.
(()=>{
const NB=' ';
const SHORT=/(?<=^|[\s(«„"—–-])([A-Za-zА-Яа-яЁёЂђЈјЉљЊњЋћЏџ]{1,2}|для|без|над|под|при|про|что|как|или|изо|ото|обо|все|это)[ \t\n\r]+(?=\S)/gi;
const fix=t=>{t=t.replace(SHORT,'$1'+NB);
  return t.replace(/ ([—–])/g,NB+'$1').replace(/(\d) (?=\d{3}\b)/g,'$1'+NB)};
const skip=n=>{const e=n.parentElement;return !e||/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(e.tagName)||e.isContentEditable};
function run(root){
  if(root.nodeType===3){if(!skip(root)){const v=fix(root.nodeValue);if(v!==root.nodeValue)root.nodeValue=v}return}
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode()))if(!skip(n)){const v=fix(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v}
}
run(document.body);
new MutationObserver(ms=>ms.forEach(m=>{if(m.type==='characterData')run(m.target);else m.addedNodes.forEach(run)}))
  .observe(document.body,{childList:true,subtree:true,characterData:true});
})();

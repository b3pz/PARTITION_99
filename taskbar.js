/* NOVA 2000 — barra delle applicazioni: pulsante «Mostra desktop» e raggruppamento delle finestre
   dello stesso programma in un unico pulsante con l'elenco (come i sistemi del 2000-2001). */
(()=>{'use strict';
const bar=document.getElementById('task-windows');if(!bar)return;
const css=document.createElement('style');css.textContent=`.p99-showdesk{height:28px;width:30px;padding:0;font-size:15px;flex-shrink:0}
.task-button.p99-grouped{display:none}
.p99-group{font-weight:bold}
.p99-gmenu{position:fixed;z-index:6200;min-width:220px;max-width:min(360px,90vw);background:#c0c0c0;color:#111;border:2px solid;border-color:#fff #555 #555 #fff;box-shadow:2px 2px 0 #111;padding:3px;font:13px Arial}
.p99-gmenu button{display:block;width:100%;text-align:left;border:0;background:transparent;padding:7px 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.p99-gmenu button:hover{background:#1a237e;color:#fff}.p99-gmenu hr{border:0;border-top:1px solid #808080;border-bottom:1px solid #fff;margin:3px 0}`;document.head.append(css);

// Programmi che contano come «la stessa cosa» e nome del loro gruppo sulla barra.
const NAMES={text:'Blocco note',notepad:'Blocco note','notepad-open':'Blocco note','nova-document':'Blocco note',browser:'NavigaNova',chat:'NOVA Messenger',explorer:'Esplora risorse',novamail:'NovaMail','photo99-view':'Immagini','photo99-main':'Immagini'};
const key=app=>NAMES[app]||(/^viewer/.test(app)?'Immagini':app);
const live=()=>[...windows.entries()].filter(([,x])=>x.w.isConnected&&x.task.isConnected);

// Mostra desktop: riduce tutte le finestre; un secondo clic le riporta com'erano.
let stash=[];
const desk=document.createElement('button');desk.className='bevel p99-showdesk';desk.textContent='🖥️';desk.title='Mostra desktop';
desk.onclick=()=>{window.novaSound?.('click');const open=live().filter(([,x])=>!x.w.hidden);
 if(open.length){stash=open.map(([id])=>id);for(const [,x] of open){x.w.hidden=true;x.task.classList.remove('pressed')}}
 else{for(const id of stash){const x=windows.get(id);if(x?.w.isConnected)x.w.hidden=false}stash=[];focusTopAvailable()}
 render()};
bar.before(desk);

// Nome del gruppo: la parte comune dei titoli, oppure il primo pezzo prima di « — ».
function label(items){const t=items.map(([,x])=>x.task.textContent);let p=t[0];for(const s of t)while(!s.startsWith(p))p=p.slice(0,-1);p=p.replace(/[\s—:·-]+$/,'');return p.length>=4?p:t[0].split(' — ')[0]}

let menu=null;
const closeMenu=()=>{menu?.remove();menu=null};
function openMenu(btn,items){closeMenu();menu=document.createElement('div');menu.className='p99-gmenu';
 for(const [id,x] of items){const b=document.createElement('button');b.textContent=x.task.textContent;b.onclick=()=>{closeMenu();if(x.w.hidden)x.w.hidden=false;focusWindow(id);render()};menu.append(b)}
 menu.append(document.createElement('hr'));
 const mk=(t,fn)=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{closeMenu();fn();render()};menu.append(b)};
 mk('Riduci tutte a icona',()=>{for(const [,x] of items){x.w.hidden=true;x.task.classList.remove('pressed')}focusTopAvailable()});
 mk('Chiudi tutte',()=>{for(const [,x] of items)x.w.querySelector('[data-action="close"]')?.click()});
 document.body.append(menu);const r=btn.getBoundingClientRect();menu.style.left=Math.max(4,Math.min(r.left,innerWidth-menu.offsetWidth-4))+'px';menu.style.top=(r.top-menu.offsetHeight-2)+'px'}
addEventListener('pointerdown',e=>{if(menu&&!menu.contains(e.target)&&!e.target.closest('.p99-group'))closeMenu()},true);

const groups=new Map();
function render(){const by=new Map();for(const e of live()){const k=key(e[1].app);if(!by.has(k))by.set(k,[]);by.get(k).push(e)}
 for(const [k,items] of by){const many=items.length>1;for(const [,x] of items)x.task.classList.toggle('p99-grouped',many);
  let g=groups.get(k);
  if(!many){g?.remove();groups.delete(k);continue}
  if(!g){g=document.createElement('button');g.className='task-button bevel p99-group';g.onclick=()=>{if(menu&&menu.dataset.k===k){closeMenu();return}openMenu(g,groups.get(k).items);menu.dataset.k=k};groups.set(k,g)}
  g.items=items;const txt='▸ '+(Object.values(NAMES).includes(k)||k==='Immagini'?k:label(items))+' ('+items.length+')';if(g.textContent!==txt)g.textContent=txt;g.title=items.map(([,x])=>x.task.textContent).join('\n');
  g.classList.toggle('pressed',items.some(([,x])=>x.w.classList.contains('active')&&!x.w.hidden));
  if(g.nextSibling!==items[0][1].task)items[0][1].task.before(g)}
 for(const [k,g] of groups)if(!by.has(k)){g.remove();groups.delete(k)}}

let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})};
// render() è idempotente: se non cambia niente non tocca il DOM, quindi gli osservatori non entrano in ciclo.
new MutationObserver(schedule).observe(bar,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
const wins=document.getElementById('windows');if(wins)new MutationObserver(schedule).observe(wins,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
})();

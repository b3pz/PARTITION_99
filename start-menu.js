/* NOVA 2000 — menu START in stile anni '90: fascia laterale, sottomenu e «Spegni il computer…».
   Riordina i pulsanti già creati dagli altri script (mantenendo i loro gestori) e va caricato per ultimo. */
(()=>{'use strict';
const menu=document.getElementById('start-menu');if(!menu)return;
const css=document.createElement('style');css.textContent=`
button{color:#111;-webkit-tap-highlight-color:transparent}
#start-menu.nova98{display:flex;width:auto;min-width:230px;padding:2px;align-items:stretch}
#start-menu.nova98[hidden]{display:none}
.sm-banner{width:30px;background:linear-gradient(0deg,#000080,#000020);color:#b9c3ff;display:flex;align-items:flex-end;justify-content:center;padding:8px 0}
.sm-banner span{writing-mode:vertical-rl;transform:rotate(180deg);font:22px Arial,Helvetica,sans-serif;white-space:nowrap}
.sm-banner span i{font-style:normal;font-weight:bold;color:#fff}
.sm-banner b{font-weight:normal}
.sm-items{flex:1;display:flex;flex-direction:column;min-width:198px}
.sm-items button{display:flex;align-items:center;gap:8px;width:100%;border:0;background:transparent;color:#111;text-align:left;padding:10px 12px;font:14px Arial,Helvetica,sans-serif;-webkit-appearance:none;appearance:none}
.sm-items button:hover,.sm-items button:focus-visible,.sm-group.open>button{background:#1a237e;color:#fff}
.sm-items .sm-ico{width:30px;text-align:center;font-size:23px}
.sm-sub .sm-ico{width:22px;font-size:17px}
.sm-items .sm-arrow{margin-left:auto;font-size:10px}
.sm-items hr{border:0;border-top:1px solid #808080;border-bottom:1px solid #fff;margin:3px 2px;width:auto}
.sm-group{position:relative}
.sm-sub{position:absolute;left:100%;top:-3px;min-width:215px;background:#c0c0c0;border:2px solid;border-color:#fff #555 #555 #fff;box-shadow:2px 2px 0 #111;padding:2px;z-index:6200}
.sm-sub[hidden]{display:none}
.sm-sub button{padding:7px 10px;font-size:13px}
@media(max-width:600px){.sm-sub{position:static;border:0;box-shadow:none;padding:0 0 0 22px;background:transparent}}
.nova-shutdown{position:fixed;inset:0;z-index:20000;display:flex;align-items:center;justify-content:center;background:repeating-conic-gradient(#0008 0 25%,#0000 0 50%) 0 0/2px 2px}
.nova-shutdown .dlg{width:min(380px,calc(100vw - 24px));background:#c0c0c0;color:#111;border:2px solid;border-color:#fff #444 #444 #fff;box-shadow:3px 3px 0 #000;font:13px Arial,Helvetica,sans-serif}
.nova-shutdown .ttl{background:#1a237e;color:#fff;font-weight:bold;padding:5px 8px}
.nova-shutdown .bd{display:flex;gap:14px;padding:14px}
.nova-shutdown .ico{font-size:34px}
.nova-shutdown label{display:block;margin:8px 0}
.nova-shutdown .btns{display:flex;justify-content:center;gap:8px;padding:0 14px 14px}
.nova-shutdown .btns button{min-width:80px;padding:5px 10px;background:#c0c0c0;border:2px solid;border-color:#fff #444 #444 #fff}
.nova-off{position:fixed;inset:0;z-index:20001;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;text-align:center;cursor:pointer;padding:20px}
.nova-off p{margin:0;color:#f7a21b;font:bold clamp(20px,4vw,34px) Arial,Helvetica,sans-serif}
.nova-off small{color:#666;font:13px Arial,Helvetica,sans-serif}
.nova-closing{position:fixed;inset:0;z-index:20001;background:#1a237e;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font:22px Arial,Helvetica,sans-serif}
`;document.head.append(css);
const all=[...menu.querySelectorAll('button')];
const byApp=a=>all.find(b=>b.dataset.app===a);
const byText=t=>all.find(b=>b.textContent.includes(t));
// Etichetta con icona separata, come nei menu dell'epoca.
function dress(b,ico,label){if(!b)return null;b.textContent='';const i=document.createElement('span');i.className='sm-ico';i.textContent=ico;const s=document.createElement('span');s.textContent=label;b.append(i,s);return b}
const items=document.createElement('div');items.className='sm-items';
function group(ico,label,children,host=items){const g=document.createElement('div');g.className='sm-group';const p=document.createElement('button');p.type='button';p.dataset.sub='1';dress(p,ico,label);const arrow=document.createElement('span');arrow.className='sm-arrow';arrow.textContent='▶';p.append(arrow);const sub=document.createElement('div');sub.className='sm-sub';sub.hidden=true;children.filter(Boolean).forEach(c=>sub.append(c));g.append(p,sub);
 // Con il mouse il sottomenu si apre al passaggio e il clic non lo richiude; al tocco il clic apre e chiude.
 const hover=()=>matchMedia('(hover:hover) and (min-width:601px)').matches;
 p.addEventListener('click',()=>toggle(g,hover()||!g.classList.contains('open')));
 g.addEventListener('mouseenter',()=>{if(hover())toggle(g,true)});
 host.append(g);return g}
function toggle(g,open){const parent=g.parentElement;[...parent.children].filter(x=>x.classList?.contains('sm-group')).forEach(x=>{if(x!==g||!open)close(x)});if(!open)return;g.classList.add('open');const sub=g.querySelector(':scope>.sm-sub');sub.hidden=false;sub.style.top='-3px';const r=sub.getBoundingClientRect(),limit=innerHeight-42;if(r.bottom>limit)sub.style.top=(-3-(r.bottom-limit))+'px'}
function close(g){g.classList.remove('open');g.querySelectorAll('.sm-group').forEach(close);const sub=g.querySelector(':scope>.sm-sub');if(sub)sub.hidden=true}
function closeAll(){items.querySelectorAll(':scope>.sm-group').forEach(close)}
items.addEventListener('mouseover',e=>{if(!matchMedia('(hover:hover) and (min-width:601px)').matches)return;const b=e.target.closest('button');if(!b||b.dataset.sub)return;const host=b.parentElement;[...host.children].filter(x=>x.classList?.contains('sm-group')).forEach(close)});
function sep(){items.append(document.createElement('hr'))}

const games=document.createElement('div');group('🕹️','Giochi',[dress(byApp('maze'),'🟡','Signal Maze 2000'),dress(byApp('runner'),'🏃','Pixel Runner 99'),dress(byApp('bricks'),'🧱','Spaccamattoni 99'),dress(byApp('invaders'),'👾','Difesa Orbitale 2000')],games);
group('📂','Programmi',[games.firstChild,dress(byApp('browser'),'🌐','NavigaNova 1.0'),dress(byApp('chat'),'💬','NOVA Messenger'),dress(byApp('astro'),'⭐','Astro V'),dress(byApp('paint'),'🎨','Disegno'),dress(byApp('recovery'),'🗂️','Registro disco (NovaRescue)'),dress(byApp('dialup'),'📞','Connessione a Internet')]);
group('📁','Documenti',[dress(byApp('documents'),'📁','Documenti'),dress(byApp('archive'),'🗃️','Archivio'),dress(byText('Archivio fotografico'),'📸','Archivio fotografico'),dress(byText('Archivio reperti'),'🗂️','Archivio reperti (56)')]);
group('⚙️','Impostazioni',[dress(byApp('computer'),'🖥️','Risorse del computer'),dress(byApp('disk'),'💾','Utility disco'),dress(byText('Manutenzione'),'🛠️','Manutenzione / Nuova partita')]);
const help=dress(byText('Note e crediti'),'❔','Guida e crediti');if(help)items.append(help);
const run=document.createElement('button');run.type='button';dress(run,'⌨️','Esegui…');run.onclick=runDialog;items.append(run);
sep();
const off=document.createElement('button');off.type='button';dress(off,'⏻','Spegni il computer…');off.onclick=shutdownDialog;items.append(off);

const banner=document.createElement('div');banner.className='sm-banner';banner.innerHTML='<span><i>NOVA</i><b>2000</b></span>';
menu.replaceChildren(banner,items);menu.classList.add('nova98');
const restart=document.getElementById('restart');if(restart){restart.hidden=true;document.body.append(restart)}
document.getElementById('start')?.addEventListener('click',closeAll);
new MutationObserver(()=>{if(menu.hidden)closeAll()}).observe(menu,{attributes:true,attributeFilter:['hidden']});

const RUN={naviganova:'browser',browser:'browser',internet:'browser',messenger:'chat',chat:'chat',astro:'astro',disegno:'paint',paint:'paint',documenti:'documents',archivio:'archive',maze:'maze',signal:'maze',runner:'runner',pixel:'runner',spaccamattoni:'bricks',mattoni:'bricks',breakout:'bricks',arkanoid:'bricks',difesa:'invaders',invaders:'invaders',orbitale:'invaders',diskcheck:'disk',utility:'disk',novarescue:'recovery',registro:'recovery',risorse:'computer',explorer:'computer'};
function runDialog(){menu.hidden=true;const o=document.createElement('div');o.className='nova-shutdown';o.innerHTML='<div class="dlg" role="dialog" aria-label="Esegui"><div class="ttl">Esegui</div><div class="bd"><div class="ico">⌨️</div><div style="flex:1"><p style="margin-top:0">Digitare il nome del programma o l’indirizzo di una pagina Internet.</p><label>Apri: <input data-run style="width:100%;font:14px Arial;padding:3px;border:2px inset #999;background:#fff;color:#111"></label><p data-err style="color:#900;margin:4px 0 0"></p></div></div><div class="btns"><button data-ok>OK</button><button data-cancel>Annulla</button></div></div>';document.body.append(o);const input=o.querySelector('[data-run]');input.focus();
 const go=()=>{const v=input.value.trim();if(!v)return;const low=v.toLowerCase();if(/^(https?:\/\/|www\.)|\.it(\/|$)/.test(low)){o.remove();openApp('browser');const w=[...document.querySelectorAll('.window')].pop();const a=w?.querySelector('.address');if(a){a.value=v;w.querySelector('[data-nav="go"]').click()}return}
  const key=Object.keys(RUN).find(k=>low.replace(/[^a-z]/g,'').startsWith(k));if(key){o.remove();openApp(RUN[key]);return}
  window.novaSound?.('error');o.querySelector('[data-err]').textContent='Impossibile trovare «'+v+'». Verificare il nome e riprovare.'};
 o.querySelector('[data-ok]').onclick=go;input.addEventListener('keydown',e=>{if(e.key==='Enter')go();if(e.key==='Escape')o.remove()});o.querySelector('[data-cancel]').onclick=()=>o.remove()}
function shutdownDialog(){menu.hidden=true;const o=document.createElement('div');o.className='nova-shutdown';o.innerHTML='<div class="dlg" role="dialog" aria-label="Chiudi sessione di NOVA 2000"><div class="ttl">Chiudi sessione di NOVA 2000</div><div class="bd"><div class="ico">🖥️</div><div><b>Scegliere l’operazione da eseguire:</b><label><input type="radio" name="nova-off" value="off" checked> Spegni il computer</label><label><input type="radio" name="nova-off" value="restart"> Riavvia il sistema</label></div></div><div class="btns"><button data-ok>OK</button><button data-cancel>Annulla</button></div></div>';document.body.append(o);
 o.querySelector('[data-cancel]').onclick=()=>o.remove();
 o.querySelector('[data-ok]').onclick=async()=>{const v=o.querySelector('input:checked').value;o.remove();if(v==='restart'){boot();return}
  window.novaSound?.('shutdown');
  const c=document.createElement('div');c.className='nova-closing';c.innerHTML='<b>◈ NOVA 2000</b><span>Arresto del sistema in corso...</span>';document.body.append(c);await sleep(1600);c.remove();
  document.querySelectorAll('.window').forEach(w=>w.remove());document.getElementById('task-windows').innerHTML='';windows.clear();document.getElementById('desktop').classList.remove('ready');
  const s=document.createElement('div');s.className='nova-off';s.innerHTML='<p>Ora è possibile spegnere il computer.</p><small>Tocca lo schermo per riaccenderlo.</small>';document.body.append(s);
  s.onclick=()=>{s.remove();boot()}}}
})();

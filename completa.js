/* PARTITION_99 - servizi di sistema: accesso al registro GM-LAB, manutenzione, note e crediti.
   Il percorso Q3-Q8 e i tre finali sono gestiti da novarescue-explorer.js (openApp('recovery')). */
(()=>{
'use strict';
const KEY='partition99-completa-v1';
function progress(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}

// Archivio: collegamento al registro di recupero come prima voce della colonna, sempre visibile.
const oldArchive=launchArchive;launchArchive=function(){oldArchive();setTimeout(()=>{const nav=document.querySelector('.window.active .archive-nav99');if(!nav)return;const card=document.createElement('div');card.className='story-card';card.innerHTML='<b>🗂️ Registro recupero GM-LAB</b><p>Indice dei volumi recuperati con NovaRescue 1.2.</p>';const btn=document.createElement('button');btn.textContent='Apri registro';btn.onclick=()=>openApp('recovery');card.append(btn);nav.prepend(card)},0)};

// Manutenzione accessibile dal menu START, mai automatica.
const SAVE_KEYS=['partition99-v03','nova99_atto1_progress_v05',KEY,'partition99-reperti-v1','partition99-dialoghi-v3','partition99-rescue-read-v1','partition99-alma-v1','partition99-atto2-v1','partition99-musica-v1','partition99-nuovo-file','partition99-vita-v1','nova2000-cd-v1','nova2000-marco-mail','nova2000-maze-scores','nova2000-mail-read','nova2000-os-v1'];
function systemPanel(){const el=panel('<h2>Manutenzione NOVA 2000</h2><p>Esporta il salvataggio o azzera la partita su questo browser.</p><button data-export>Esporta salvataggio</button> <button data-reset-all>Nuova partita</button><div data-response class="nova-inset" style="padding:12px;margin-top:10px">I dati restano sul tuo computer.</div>');
const response=el.querySelector('[data-response]');el.querySelector('[data-export]').onclick=()=>{const data={version:1,created:new Date().toISOString(),files:gameState,chapter,progress:progress()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='PARTITION99_SALVATAGGIO.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);response.textContent='File di salvataggio esportato.'};
el.querySelector('[data-reset-all]').onclick=()=>{response.innerHTML='<p>Eliminare i progressi della storia e i file salvati? Questa operazione non può essere annullata.</p><button data-yes>Conferma</button> <button data-no>Annulla</button>';response.querySelector('[data-yes]').onclick=()=>{SAVE_KEYS.forEach(k=>localStorage.removeItem(k));try{sessionStorage.removeItem('nova2000-clock-start-v1')}catch{}location.reload()};response.querySelector('[data-no]').onclick=()=>response.textContent='Operazione annullata.'};createWindow('maintenance','Manutenzione del sistema',el,{width:535,height:325})}

// Note e crediti: le avvertenze sulle fonti stanno qui, non dentro le pagine del 1999.
function creditsPanel(){const el=panel(`<h2>ℹ Note e crediti</h2>
<p style="font-size:15px"><b>PARTITION_99</b> — un gioco di <b>b3pz</b>. Storia, mondo, foto e musica (AlpAcA) di b3pz.</p>
<p><b>PARTITION_99</b> è un’opera di finzione. Giuseppe Milano, Matteo Niccheri, Edoardo Cattani, ALMA, Astro V, NOVA OS 2000, NOVANET, Goolarno, Valdarno Oggi e L’Eco della Vallata sono inventati.</p>
<h3>Pagine e giornali</h3>
<p>Articoli, ritagli, riviste, annunci, meteo, prezzi e orari ferroviari sono facsimili scritti per il gioco, non scansioni o trascrizioni di pubblicazioni del 1999. Luoghi, società sportive e locali reali del Valdarno sono citati come contesto; i dettagli degli articoli sono ricostruiti e le persone citate (baristi, dirigenti, abitanti) sono inventate.</p>
<ul><li>Sammezzano: il passaggio di proprietà del 1999 a Sammezzano Castle S.r.l. è documentato; il resto dell’articolo è ricostruito.</li><li>Spedale Serristori: fondato nel 1399; l’articolo celebra il sesto centenario senza attestare cerimonie del 1999.</li><li>Resco Reggello: colori e anno di fondazione dalla storia societaria; nessun risultato stagionale è inventato.</li><li>Recita di Cascia: evento immaginario.</li><li>Pisa-Lucchese del 23/12/1999: fonte Nove da Firenze, 14/12/1999.</li><li>Scena musicale e locali: da testimonianze pubblicate molti anni dopo.</li></ul>
<h3>Fotografie</h3>
<p>Le fotografie di luoghi e persone sono ricostruzioni o rievocazioni, non originali d’epoca; le date indicate negli archivi non sono attestate.</p><h3>Musica</h3><p>Le canzoni degli AlpAcA sono opere originali di proprietà dell’autore del gioco.</p><p><button data-nota>Una nota dell’autore</button></p>`);el.querySelector('[data-nota]').onclick=()=>window.P99AuthorNote?.();createWindow('credits','Note e crediti',el,{width:620,height:520})}

const menu=document.querySelector('#start-menu');
if(menu){for(const [label,fn,app] of [['🗂️ Registro disco',null,'recovery'],['⚙ Manutenzione / Nuova partita',systemPanel],['ℹ Note e crediti',creditsPanel]]){const b=document.createElement('button');b.textContent=label;if(app)b.dataset.app=app;else b.onclick=fn;menu.append(b)}}
})();

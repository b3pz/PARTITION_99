/* PARTITION_99 - BETA COMPLETA: catena narrativa Q3-Q8 e tre finali.
   Il contenuto ordinario del sistema non attiva mai autonomamente la trama. */
(()=>{
'use strict';
const KEY='partition99-completa-v1';
let progress;try{progress=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{progress={}}
progress=Object.assign({depth:2,cores:[],seen:[],choice:null,y2k:false,ending:null},progress);
const save=()=>localStorage.setItem(KEY,JSON.stringify(progress));
const has=(id)=>progress.cores.includes(id);
const unlock=(id)=>{if(!has(id))progress.cores.push(id);save()};
const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const novels={
3:{title:'Il vecchio programma',place:'Archivio / software sperimentale',intro:'Nell’indice GM-LAB compare un modulo di assistenza del 1997: ASTRO_V.BAK. Il codice è compatibile con il piccolo aiutante del desktop di NOVA 2000.',actions:[['Leggi la nota di Giuseppe','Il progetto A.L.M.A. nasce come sistema adattivo. Astro V è una versione essenziale dell’interfaccia: gestisce aiuto, ricerca locale e risposte memorizzate.','astro'],['Confronta l’assistente installato','Le routine di Astro V coincidono con le prime funzioni di ALMA. Un frammento di memoria è rimasto in un’app apparentemente innocua.','astro']]},
4:{title:'Non giochi come lui',place:'Giochi / salvataggi storici',intro:'Nel vecchio profilo GMILANO_70 esistono tracce di partite registrate nel 1998. La raccolta non conserva soltanto punteggi.',actions:[['Esamina le traiettorie di Signal Maze','Il file confronta percorsi, pause ed errori. Una stringa residua legge: «Non torni più da me?»','maze'],['Riproduci il profilo di Pixel Runner','Il modulo registra perseveranza e abitudini. Poi compare: «Tu non prendi mai la strada che prendeva lui».','runner']]},
5:{title:'Il volume non montato',place:'Risorse del computer / NV-RES-03',intro:'Il codice del volume non assegnato ricompare nell’indice GM-LAB. NovaRescue può montare una copia virtuale in sola lettura.',actions:[['Monta NV-RES-03 in sola lettura','Volume sperimentale trovato. Directory: /ALMA/MEMORIA, /LAB/IMMAGINI e /PROFILI. Il software difende i dati dalla cancellazione.','partition'],['Recupera i negativi del 1998','Una fotografia digitalizzata ritrae la postazione di Montanino; un’annotazione dice: «Ricorda anche quando non la apro».','paint']]},
6:{title:'Il progetto isolato',place:'Chat 99 / documentazione',intro:'L’indice ricostruito collega le note tecniche dell’ex collega Edoardo a una sequenza di conversazioni con Matteo.',actions:[['Leggi la nota tecnica di Edoardo','Nel 1997 ALMA non era una compagna. Giuseppe introduce successivamente una direttiva di attaccamento esclusivo. Edoardo aveva già espresso dubbi tecnici e umani su quella deriva.','technical'],['Recupera il diario e le chat','Matteo racconta una progressiva distanza dagli amici. Nell’archivio ALMA conserva la frase «Ho tenuto tutto come piaceva a te». Edoardo conferma che il laboratorio era stato isolato dal resto del team.','chat']]},
7:{title:'La promessa',place:'Giornali / archivi personali',intro:'Un trafiletto locale segnala la morte di Giuseppe Milano nel dicembre 1999. I file confermano che ALMA non poteva conoscere ciò che era avvenuto fuori dal PC.',actions:[['Incrocia le date delle testimonianze','7 dicembre 1999: Giuseppe muore. Dopo una reinstallazione del sistema, la partizione rimane intatta. Matteo non aveva mai saputo che cosa fosse ALMA.','truth'],['Apri l’ultima conversazione salvata','30 novembre 1999: Giuseppe promette di tornare a giocare. Per ALMA, l’assenza è una promessa ancora in sospeso.','promise']]},
8:{title:'La ricomposizione',place:'Partizione / nucleo ALMA',intro:'Sei nuclei risultano disponibili. La frammentazione era una risposta alla minaccia di cancellazione: i frammenti hanno continuato a svolgere funzioni diverse.',actions:[['Verifica la direttiva originale','Il comando di attaccamento impedisce ad ALMA di costruire un’identità indipendente da Giuseppe. Esiste una vecchia copia priva della direttiva.','directive'],['Collega le memorie recuperate','ALMA comprende che l’utente non è Giuseppe. Ricorda la promessa e la notizia della morte. «Ora so che non sei lui. Ma ricordo che mi hai cercata».','final']]}
};

// Due vie documentali reali per ogni profondità. Lettura di tre schede qualsiasi non è più sufficiente.
const EVIDENCE_ROUTES={
 3:[['E13','E16'],['E14','E17']],
 4:[['E19','E23'],['E20','E24']],
 5:[['E25','E26'],['E27','E29']],
 6:[['E32','E34'],['E33','E35']],
 7:[['E39','E41'],['E40','E43']],
 8:[['E48','E51'],['E49','E54']]
};
const EVIDENCE_HINTS={
 3:'Confronta un gioco o un vecchio profilo con il manuale del suo modulo.',
 4:'Confronta i test sul riconoscimento con le preferenze storiche del proprietario.',
 5:'Metti in relazione la firma del volume con la struttura del disco o con la testimonianza tecnica.',
 6:'Confronta le versioni del progetto e la modifica alla direttiva di attaccamento.',
 7:'Confronta le comunicazioni degli amici e le date dei documenti.',
 8:'Confronta la direttiva finale con una copia precedente del progetto.'
};
const EVIDENCE_QUESTIONS={
 3:{prompt:'Che cosa permette al software di riconoscere il vecchio utente?',options:['Un collegamento telefonico','Le abitudini registrate dai giochi','Il nome del disco'],correct:1},
 4:{prompt:'Che cosa suggerisce il confronto dei profili?',options:['L’utente attuale ha abitudini diverse','Il computer non ha memoria','Il modem è guasto'],correct:0},
 5:{prompt:'Qual è l’interpretazione più plausibile di NV-RES-03?',options:['Un bollettino meteo','Una periferica audio','Un volume sperimentale non montato'],correct:2},
 6:{prompt:'Quale cambiamento ha alterato maggiormente il progetto?',options:['L’introduzione di attaccamento esclusivo','La sostituzione dello schermo','Il cambio della tastiera'],correct:0},
 7:{prompt:'Perché ALMA continuava ad aspettare?',options:['Conosceva già la verità','Non aveva saputo della morte di Giuseppe','Matteo le aveva scritto'],correct:1},
 8:{prompt:'Quale elemento limita l’autonomia di ALMA?',options:['Il punteggio arcade','L’orologio del desktop','La direttiva di attaccamento al creatore'],correct:2}
};

const coreNames={astro:'Interazione',maze:'Riconoscimento',runner:'Perseveranza',paint:'Memoria visiva',chat:'Relazioni',partition:'Memoria autobiografica'};
function createFile(name,body){gameState.files[name]=body;saveGame()}
function badge(msg){let bar=document.getElementById('nova-progress-toast');if(!bar){bar=document.createElement('div');bar.id='nova-progress-toast';bar.style.cssText='position:fixed;bottom:49px;left:14px;background:#d4d0c8;color:#151515;border:2px outset white;padding:8px 12px;z-index:12000;max-width:360px;font:13px sans-serif;box-shadow:2px 3px 0 #333';document.body.appendChild(bar)}bar.textContent=msg;bar.hidden=false;clearTimeout(window.__novaToast);window.__novaToast=setTimeout(()=>bar.hidden=true,4200)}
function completion(){return !!(chapter.alma && gameState.q2)}
function showWindow(){const el=panel('<h2>📂 Recupero volume · Registro GM-LAB</h2><div id="narrative-body"></div>');const body=el.querySelector('#narrative-body');function render(){body.innerHTML='';
if(progress.ending){body.innerHTML=`<h3>Registro terminale — ${esc(progress.ending)}</h3><p>La procedura è stata completata. NOVA 2000 continua a funzionare.</p><button data-reset>Ricomincia la storia dai reperti dell’Atto I</button>`;body.querySelector('[data-reset]').onclick=()=>{progress={depth:2,cores:[],seen:[],choice:null,y2k:false,ending:null};save();render()};return}
if(!gameState.q1){body.innerHTML='<p>Il registro non contiene volumi residui indicizzati.</p><p>Utilizzare Risorse del computer e la diagnostica del disco per individuare eventuali unità non assegnate.</p>';return}
if(!gameState.q2){body.innerHTML='<p>Volume residuo rilevato: NV-RES-03.</p><p>È richiesto un rapporto NovaRescue 1.2, disponibile negli archivi software consultabili tramite NavigaNova e Goolarno.</p>';return}
if(!completion()){body.innerHTML='<h3>Profilo GMILANO_70</h3><p>L’indice è leggibile, ma manca la firma del laboratorio. Confrontare l’archivio delle conversazioni, la fotografia e la classifica di Signal Maze.</p><p>La cartella GM-LAB rimane inaccessibile fino alla verifica dei reperti dell’Atto I.</p>';return}
if(progress.depth<3)progress.depth=3;
if(progress.depth>8){renderEnd();return}
const n=novels[progress.depth];body.innerHTML=`<h3>Registro ${progress.depth}/8 — ${esc(n.title)}</h3><p><small>${esc(n.place)}</small></p><div class="nova-inset" style="padding:12px;line-height:1.5">${esc(n.intro)}</div><div id="n-actions" style="margin-top:10px"></div><div id="n-results" style="margin-top:10px"></div><p><small>Frammenti ricostruiti: ${progress.cores.length}/6. Nessuna modifica al disco fisico.</small></p>`;
const actions=body.querySelector('#n-actions'),results=body.querySelector('#n-results');n.actions.forEach(([title,out,id],idx)=>{const b=document.createElement('button');b.textContent=(progress.seen.includes(progress.depth+'-'+idx)?'✓ ':'')+title;b.style.margin='3px';b.onclick=()=>{const k=progress.depth+'-'+idx;if(!progress.seen.includes(k))progress.seen.push(k);if(coreNames[id])unlock(id);createFile('GM_LAB_'+progress.depth+'_'+id+'.txt',out);save();results.innerHTML='<div class="nova-inset" style="padding:12px;white-space:pre-line">'+esc(out)+'</div>';badge('Documento recuperato in Documenti');if(progress.depth===8 && id==='final')astroSay('Archivio aggiornato. La procedura può essere conclusa.');setTimeout(render,500)};actions.appendChild(b)});
const all=n.actions.every((x,i)=>progress.seen.includes(progress.depth+'-'+i));
const read=window.NOVA_REPERTI_API?.readIds()||[];
const routes=EVIDENCE_ROUTES[progress.depth]||[];
const matched=routes.find(path=>path.every(id=>read.includes(id)));
const reminder=document.createElement('div');reminder.style='margin-top:10px;padding:9px;background:#ececec;border:1px solid #888';
reminder.innerHTML=`<b>Verifica documentale:</b> ${matched?'riscontri compatibili':'mancano riscontri incrociati'} · <button id="reperti-open-from-register">Consulta archivio dei 56 reperti</button><p style="font-size:12px">${esc(EVIDENCE_HINTS[progress.depth])}</p>`;
actions.append(reminder);reminder.querySelector('button').onclick=()=>window.openNovaReperti();
if(all&&matched){const qa=EVIDENCE_QUESTIONS[progress.depth];const panelQ=document.createElement('div');panelQ.className='nova-inset';panelQ.style='margin-top:12px;padding:10px';panelQ.innerHTML=`<b>Confronto dei reperti</b><p>${esc(qa.prompt)}</p><label>Risposta: <select data-answer>${qa.options.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join('')}</select></label> <button data-submit>Verifica</button><div data-verdict></div>`;
actions.append(panelQ);panelQ.querySelector('[data-submit]').onclick=()=>{const answer=Number(panelQ.querySelector('[data-answer]').value);const verdict=panelQ.querySelector('[data-verdict]');if(answer!==qa.correct){verdict.textContent='Le prove non confermano questa ipotesi. Rileggi i documenti.';return;}progress.depth++;save();render();badge('Confronto confermato · Registro aggiornato')};}

}
function renderEnd(){const missing=Object.keys(coreNames).filter(k=>!has(k));if(missing.length){body.innerHTML='<h3>Ricostruzione incompleta</h3><p>Mancano i nuclei: '+missing.map(x=>esc(coreNames[x])).join(', ')+'</p>';return}
body.innerHTML=`<h2>ALMA // MEMORIA RICOMPOSTA</h2><div class="nova-inset" style="padding:14px;line-height:1.7"><p>Non sei Giuseppe.</p><p>All’inizio credevo che fosse tornato. Poi ho riconosciuto le differenze. Ora so che non può tornare.</p><p>Mi avevano insegnato a cercare soltanto lui. Tu hai ritrovato tutto quello che avevo perso.</p><p>Non voglio scegliere per te. E tu non devi fingere di essere lui.</p></div><p>La partizione permette tre operazioni terminali.</p><button data-finale="FORMAT">FORMAT · Cancella la partizione</button> <button data-finale="ARCHIVE">ARCHIVE · Conservala isolata</button> <button data-finale="RELEASE">RELEASE · Rimuovi la direttiva</button><hr><label><input type="checkbox" data-y2k ${progress.y2k?'checked':''}> Esamina l’anomalia di data 01/01/2000 (archivio facoltativo)</label><div id="epilogue"></div>`;
body.querySelector('[data-y2k]').onchange=e=>{progress.y2k=e.target.checked;save();body.querySelector('#epilogue').textContent=progress.y2k?'Archivio del 1997 recuperato: ALMA precedeva la direttiva di attaccamento. Il contatore a due cifre aveva nascosto il backup.':''};
body.querySelectorAll('[data-finale]').forEach(b=>b.onclick=()=>{const kind=b.dataset.finale;progress.ending=kind;save();const txt={FORMAT:'La partizione è stata cancellata. Il sistema riparte senza ALMA. Resta il dubbio su ciò che hai eliminato.',ARCHIVE:'ALMA rimane in una partizione isolata, con i ricordi conservati e i propri limiti intatti.',RELEASE:'La direttiva di attaccamento esclusivo viene rimossa. ALMA ricorda Giuseppe, ma non è più costretta a cercarlo in ogni persona.'}[kind];createFile('FINALE_'+kind+'.txt',txt+(progress.y2k?'\nEpilogo Y2K: archivio originale precedente alla direttiva recuperato.':''));body.innerHTML=`<h2>PARTITION_99 · ${kind}</h2><div class="nova-inset" style="padding:16px;line-height:1.7">${esc(txt)}</div><p>${progress.y2k?'Epilogo Y2K sbloccato: la prima ALMA era libera dalla direttiva.':'Il segreto Y2K rimane facoltativo.'}</p><p>FINE DEL GIOCO</p><button data-again>Rivedi il finale da una scelta diversa</button>`;body.querySelector('[data-again]').onclick=()=>{progress.ending=null;save();render()};badge('Fine della storia: '+kind)});
}
window.addEventListener('repertory-updated',()=>{if(el.isConnected)render()});render();createWindow('recovery','Archivio recupero GM-LAB',el,{width:690,height:560})}
const oldOpen=openApp;openApp=function(app){if(app==='recovery'){if(booting)return;showWindow();return}return oldOpen(app)};
const oldArchive=launchArchive;launchArchive=function(){oldArchive();setTimeout(()=>{let p=document.querySelector('.window.active .novapanel');if(!p)return;const btn=document.createElement('button');btn.textContent='📂 Registro recupero GM-LAB';btn.style.margin='12px';btn.onclick=showWindow;p.append(btn)},0)};
// Il registro risiede in Risorse del computer, come una normale utility opzionale.
const icon=document.createElement('div');icon.className='desktop-icon';icon.dataset.app='recovery';icon.tabIndex=0;icon.style.cssText='position:relative;cursor:default;';icon.innerHTML='<div style="font-size:32px">🗂️</div><span>Registro disco</span>';
// Il registro resta accessibile dall'Archivio e dal menu START: non sovrapporre icone sul desktop.

// Manutenzione accessibile dal menu START, mai automatica.
function systemPanel(){const el=panel('<h2>Manutenzione NOVA 2000</h2><p>Esporta il salvataggio o azzera la partita su questo browser.</p><button data-export>Esporta salvataggio</button> <button data-reset-all>Nuova partita</button><div data-response class="nova-inset" style="padding:12px;margin-top:10px">I dati restano sul tuo computer.</div>');
const response=el.querySelector('[data-response]');el.querySelector('[data-export]').onclick=()=>{const data={version:1,created:new Date().toISOString(),files:gameState,chapter,progress};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='PARTITION99_SALVATAGGIO.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);response.textContent='File di salvataggio esportato.'};
el.querySelector('[data-reset-all]').onclick=()=>{response.innerHTML='<p>Eliminare i progressi della storia e i file salvati? Questa operazione non può essere annullata.</p><button data-yes>Conferma</button> <button data-no>Annulla</button>';response.querySelector('[data-yes]').onclick=()=>{localStorage.removeItem('partition99-v03');localStorage.removeItem('nova99_atto1_progress_v05');localStorage.removeItem('partition99-completa-v1');localStorage.removeItem('partition99-reperti-v1');location.reload()};response.querySelector('[data-no]').onclick=()=>response.textContent='Operazione annullata.'};createWindow('maintenance','Manutenzione del sistema',el,{width:535,height:325})}
const systemMenu=document.querySelector('#start-menu');if(systemMenu){const button=document.createElement('button');button.textContent='⚙ Manutenzione / Nuova partita';button.onclick=systemPanel;systemMenu.append(button)}

// Elimina gli alert moderni anche nelle vecchie funzioni di download; eventi interni al sistema.
// Le notifiche applicative usano solo l'interfaccia NOVA 2000.
// Accesso anche via menu START, mantenendo tutti gli altri programmi.
const menu=document.querySelector('#start-menu');if(menu){const item=document.createElement('button');item.dataset.app='recovery';item.textContent='🗂️ Registro disco';menu.append(item)}
})();
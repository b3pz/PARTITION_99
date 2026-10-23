/* NOVA 2000 — archivio fotografico e riviste, revisione 23 dicembre 1999 */
(()=>{'use strict';
const CSS=`
.photo99{height:100%;display:flex;flex-direction:column;background:#c0c0c0;color:#111;font:13px Arial}
.photo99-toolbar{padding:6px;border-bottom:1px solid #888;display:flex;gap:5px;flex-wrap:wrap}
.photo99 button{background:#c0c0c0;border:2px outset white;color:#111;padding:5px 8px;cursor:pointer}
.photo99-body{display:grid;grid-template-columns:170px 1fr;flex:1;min-height:0}
.photo99-folders{border:2px inset #aaa;background:white;overflow:auto;padding:7px}
.photo99-folders button{display:block;width:100%;text-align:left;background:white;border:0;margin:0;padding:10px 5px}
.photo99-folders button.current{background:#000080;color:white}
.photo99-list{border:2px inset #aaa;background:#fff;overflow:auto;padding:8px}
.photo99-row{display:flex;align-items:center;gap:9px;padding:8px;border-bottom:1px dotted #bbb;cursor:pointer}
.photo99-row:hover{background:#e8e9fa}
.photo99-status{border-top:1px solid #888;padding:6px}
.photo99-view{background:#ece8dc;padding:12px;color:#111;overflow:auto;height:100%;font:13px Arial}
.photo99-picture{position:relative;margin:auto;max-width:100%;min-height:220px;overflow:hidden;border:9px solid #eae4d5;box-shadow:2px 4px 5px #3336;background:linear-gradient(175deg,#b9c2bb 0%,#c7c7ae 35%,#718476 36%,#536b5a 65%,#433f33 100%);}
.photo99-picture img{display:block;max-height:55vh;max-width:100%;margin:auto;filter:sepia(.2) contrast(.87) saturate(.73)}
.photo99-picture::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:.13;background:repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 4px)}
.photo99-caption{border-top:1px solid #888;font:12px 'Courier New';margin-top:9px;padding-top:8px}
.photo99-paper{max-width:650px;margin:auto;background:#f2edda;color:#231d16;border:2px solid #6c6250;padding:15px;font:15px/1.55 Georgia,serif}
.photo99-paper h1{font:30px Georgia;border-bottom:4px double #302719}
.photo99-paper small{font:11px Arial}
@media(max-width:600px){.photo99-body{grid-template-columns:112px 1fr}.photo99-folders button{padding:6px 3px}.photo99-paper{font-size:13px;padding:7px}}
`;const style=document.createElement('style');style.textContent=CSS;document.head.append(style);
const P=[
['luoghi','BALZE_1998.JPG','Balze del Valdarno','data non annotata','Le Balze del Valdarno, scansione da album','assets/balze_1998.svg',true],
['luoghi','FIGLINE_STAZIONE_1989.JPG','Stazione di Figline','31/10/1989','Stazione di Figline, archivio ferroviario','assets/stazione_figline_1989.svg',true],
['luoghi','PIAZZA_FICINO.JPG','Figline, piazza del centro','data non annotata','Piazza Ficino, scansione da album','assets/piazza_figline_1998.svg',true],
['luoghi','REGGELLO_PAESE.JPG','Reggello, centro','data non annotata','Reggello, veduta del centro','assets/reggello_centro_1998.svg',true],
['luoghi','CASCIA.JPG','Cascia di Reggello','data non annotata','Cascia di Reggello, scuola elementare','assets/cascia_scuola_1999.svg',true],
['luoghi','NEVE_ARCHIVIO.JPG','Neve a Figline, archivio','data non annotata','Neve a Figline, scatto d’archivio','assets/neve_figline.svg',true],
['persone','GM_LAB_171098.JPG','Giuseppe, Matteo, Edoardo in laboratorio','17/10/1998','Giuseppe, Matteo ed Edoardo nel laboratorio; ricevuta da Matteo tramite NOVA Messenger','foto_laboratorio.svg',false],
['persone','MATTEO_9811.JPG','Matteo Niccheri','data non annotata','Matteo Niccheri, il migliore amico di Giuseppe.','',false],
['persone','EDOARDO_9710.JPG','Edoardo Cattani','data non annotata','Edoardo Cattani, ex collega di Giuseppe.','',false],
['persone','GIUSEPPE_9905.JPG','Giuseppe Milano','data non annotata','Giuseppe Milano, autore di ALMA.','',false],
['stampa','SAMMEZZANO_231299.HTM','Sammezzano cambia proprietà','23/12/1999','Patrimonio, Leccio','www.valdarnoggi.it/storia/sammezzano',true],
['stampa','SERRISTORI_231299.HTM','Sei secoli dello Spedale Serristori','23/12/1999','Storia, Figline','www.valdarnoggi.it/storia/serristori',true],
['stampa','RESCO_231299.HTM','Resco Reggello e il calcio biancoazzurro','23/12/1999','Sport, Reggello','www.valdarnoggi.it/amarcord/resco',true],
['stampa','CASCIA_221299.HTM','Cascia, recita per il nuovo millennio','22/12/1999','Scuola, Cascia','www.valdarnoggi.it/amarcord/cascia',true],
['stampa','CALCIO_231299.HTM','Montevarchi e Sangiovannese','23/12/1999','Sport, Valdarno','www.valdarnoggi.it/amarcord/calcio',true],
['stampa','DISCOTECHE_231299.HTM','La notte nel Valdarno','23/12/1999','Costume, giovani','www.valdarnoggi.it/amarcord/notte',true],
['stampa','MEMORIE_231299.HTM','Libri e cultura locale','23/12/1999','Cultura','www.valdarnoggi.it/amarcord/cultura',true],
['riviste','NOVA_PC_12_99.TXT','NOVA PC — dicembre 1999','01/12/1999','Rubrica modem, giochi e periferiche','',true],
['riviste','ANNUNCI_1999.TXT','Piccoli annunci','22/12/1999','Mercatino del Valdarno in lire','',true],
['riviste','ORARI_FS.TXT','Orari ferroviari','23/12/1999','Treni nel periodo festivo','',true]
];
const MAGAZINES={
'NOVA_PC_12_99.TXT':'<h1>NOVA PC — DICEMBRE 1999</h1><small>SPECIALE FINE MILLENNIO · 3.500 LIRE</small><hr><h2>Un modem per entrare nel Duemila</h2><p>La connessione analogica a 56K è ormai nei desideri di chi vuole navigare più a lungo. La velocità promessa dipende però dalla qualità della linea e dal traffico nelle ore serali.</p><h3>Il software del mese</h3><p>Dischetti, CD-ROM, piccole utility shareware e raccolte arcade continuano a riempire gli scaffali delle edicole. Prima di formattare, ricordatevi sempre di salvare i vostri documenti.</p><h3>Consigli dalla redazione</h3><p>Tenere il disco pulito, annotare i numeri di serie e conservare la copia di emergenza. Attenzione alle date memorizzate con due cifre!</p><hr><small>Pubblicità: MODEM 56K · OFFERTA LANCIO 89.000 LIRE</small>',
'ANNUNCI_1999.TXT':'<h1>LA BACHECA DEL VALDARNO</h1><small>Annunci del 22 dicembre 1999</small><hr><h2>Compro / Vendo</h2><p><b>VENDO:</b> Monitor 15 pollici, ottimo stato, ritiro a Figline. 120.000 lire.</p><p><b>CERCO:</b> Manuale di MS-DOS 6.22 e giochi in confezione originale.</p><p><b>PRESTAZIONI:</b> Riparazioni domestiche, installazione modem e lettori CD-ROM a San Giovanni Valdarno.</p><h3>Rubrica musicale</h3><p>Scambio cassette, raccolte pop e compilation eurodance. Lasciare il recapito in edicola.</p>',
'ORARI_FS.TXT':'<h1>IN TRENO NEL VALDARNO</h1><small>Servizio informativo locale · dicembre 1999</small><hr><h2>Firenze, Figline, Montevarchi e Arezzo</h2><p>Per orari aggiornati rivolgersi alla biglietteria; i treni possono subire variazioni durante le festività.</p><h3>La fotografia del mese</h3><p>Stazione di Figline, archivio ferroviario del 31 ottobre 1989: un ricordo dell’ultimo decennio prima del Duemila.</p>'
};
function show(){
const root=document.createElement('div');root.className='photo99';root.innerHTML='<div class="photo99-toolbar"><b>🗃️ ARCHIVIO FOTOGRAFICO 99</b> <button data-home>Disco locale</button><button data-rotate>Rotazione</button><button data-about>Proprietà</button></div><div class="photo99-body"><div class="photo99-folders"></div><div class="photo99-list"></div></div><div class="photo99-status">Cartelle locali · Consultazione sola lettura</div>';
let folder='luoghi',current=null,rotation=0;
const list=root.querySelector('.photo99-list'),folders=root.querySelector('.photo99-folders'),status=root.querySelector('.photo99-status');
function accessible(rec){if(rec[6])return true;const progress=typeof chapter!=='undefined'?chapter:{};if(rec[1]==='GM_LAB_171098.JPG')return !!progress.receipt;return !!(progress.alma&&progress.receipt)}
function render(){folders.replaceChildren();for(const [id,label] of [['luoghi','📁 Luoghi'],['persone','📁 Persone'],['stampa','📁 Giornali'],['riviste','📁 Riviste']]){const b=document.createElement('button');b.className=folder===id?'current':'';b.textContent=label;b.onclick=()=>{folder=id;current=null;render()};folders.append(b)};list.replaceChildren();for(const p of P.filter(x=>x[0]===folder)){if(!accessible(p))continue;const row=document.createElement('div');row.className='photo99-row';row.textContent=(p[0]==='luoghi'?'📷 ':p[0]==='persone'?'👤 ':'📰 ')+p[1]+' — '+p[2];row.onclick=()=>view(p);list.append(row)}}
function view(p){current=p;rotation=0;status.textContent=p[1]+' · '+p[3]+' · '+p[4];const win=document.createElement('div');win.className='photo99-view';if(p[0]==='stampa'&&typeof SITES!=='undefined'&&SITES[p[5]]){win.innerHTML='<div class="photo99-paper">'+SITES[p[5]]+'</div>'}else if((p[5]&&p[5].endsWith('.svg'))||p[1].endsWith('.JPG')){const pic=document.createElement('div');pic.className='photo99-picture';const img=document.createElement('img');const photos=window.P99_REAL_PHOTOS||{};const key=({'BALZE_1998.JPG':'balze','FIGLINE_STAZIONE_1989.JPG':'stazione','PIAZZA_FICINO.JPG':'piazza','NEVE_ARCHIVIO.JPG':'neve'})[p[1]];const people=window.P99_PEOPLE_PHOTOS||{};const who=({'GM_LAB_171098.JPG':'gruppo','MATTEO_9811.JPG':'matteo','EDOARDO_9710.JPG':'edoardo','GIUSEPPE_9905.JPG':'giuseppe'})[p[1]];img.src=(who&&people[who])||(key&&photos[key])||p[5];if(!img.src||img.src===location.href){img.style.display='none'}img.alt=p[2];pic.append(img);win.append(pic)}else{const sheet=document.createElement('div');sheet.className='photo99-paper';sheet.innerHTML='<h1>'+p[2]+'</h1><p>'+p[4]+'</p><p><small>Registrato il '+p[3]+'</small></p>';if(p[0]==='riviste')sheet.innerHTML=MAGAZINES[p[1]]||sheet.innerHTML;if(p[0]==='persone')sheet.innerHTML+='<p>Materiale personale: la documentazione visiva non era stata conservata nel backup principale.</p>';win.append(sheet)}
const cap=document.createElement('div');cap.className='photo99-caption';const date=p[3].startsWith('data ')?'Data non disponibile':p[3];cap.textContent=p[1]+' | '+date+' | '+(p[0]==='persone'?'Archivio personale':p[0]==='luoghi'?'Album luoghi':'Rassegna stampa');win.append(cap);createWindow('photo99-view',p[1]+' — Visualizzatore NOVA',win,{width:710,height:550})}
root.querySelector('[data-home]').onclick=()=>{folder='luoghi';render()};root.querySelector('[data-rotate]').onclick=()=>{rotation=(rotation+90)%360;const pic=document.querySelector('.photo99-view:last-of-type .photo99-picture img');if(pic)pic.style.transform='rotate('+rotation+'deg)'};root.querySelector('[data-about]').onclick=()=>{status.textContent=current?current[1]+' · '+(current[0]==='persone'?'archivio personale':current[0]==='luoghi'?'album dei luoghi':'rassegna stampa'):'Seleziona un file'};render();createWindow('photo99-main','Archivio fotografico — NOVA 2000',root,{width:840,height:560})}
const previous=openApp;openApp=function(app){if(app==='photo99'){if(booting)return;show();return}return previous(app)};
const menu=document.querySelector('#start-menu');if(menu){const b=document.createElement('button');b.textContent='📸 Archivio fotografico 99';b.onclick=()=>openApp('photo99');menu.append(b)}
window.openPhoto99=show;
})();
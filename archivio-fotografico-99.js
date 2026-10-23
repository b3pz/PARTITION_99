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
['luoghi','BALZE_1998.JPG','Balze del Valdarno','22/11/1998','Paesaggio, tardo autunno','assets/balze_1998.svg',true],
['luoghi','FIGLINE_STAZIONE_1989.JPG','Stazione di Figline','31/10/1989','Immagine rievocativa, riferimento ferroviario precedente al 1999','assets/stazione_figline_1989.svg',true],
['luoghi','PIAZZA_FICINO.JPG','Figline, piazza del centro','06/11/1998','Scorcio urbano del Valdarno','assets/piazza_figline_1998.svg',true],
['luoghi','REGGELLO_PAese.JPG','Reggello, centro','20/12/1998','Scorci del paese alle pendici del Pratomagno','assets/reggello_centro_1998.svg',true],
['luoghi','CASCIA.JPG','Cascia di Reggello','17/12/1999','Edifici e strade del paese','assets/cascia_scuola_1999.svg',true],
['luoghi','NEVE_ARCHIVIO.JPG','Neve a Figline, archivio','[data incerta]','Scatto rievocativo: non attribuito al dicembre 1999','assets/neve_figline.svg',true],
['persone','GM_LAB_171098.JPG','Il laboratorio','17/10/1998','Fotografia inviata da Matteo, con timbro GM-LAB','foto_laboratorio.svg',false],
['persone','MATTEO_9811.TXT','Matteo Niccheri','30/11/1999','Amico personale di Giuseppe. 11 maggio: compleanno.','',false],
['persone','EDOARDO_9710.TXT','Edoardo Cattani','28/10/1997','Collaboratore tecnico. 28 ottobre: compleanno.','',false],
['persone','GIUSEPPE_9905.TXT','Giuseppe Milano','31/05/1999','Programmatore GM-LAB. 31 maggio: compleanno.','',false],
['stampa','RESCO_231299.HTM','Resco Reggello e il calcio biancoazzurro','23/12/1999','Facsimile giornale locale — ricostruzione','www.valdarnoggi.it/amarcord/resco',true],
['stampa','CASCIA_221299.HTM','Cascia, recita per il nuovo millennio','22/12/1999','Facsimile di evento immaginario in stile 1999','www.valdarnoggi.it/amarcord/cascia',true],
['stampa','CALCIO_231299.HTM','Montevarchi e Sangiovannese','23/12/1999','Articolo di costume sportivo, ricostruzione','www.valdarnoggi.it/amarcord/calcio',true],
['stampa','DISCOTECHE_231299.HTM','La notte nel Valdarno','23/12/1999','Testimonianze retrospettive reinterpretate','www.valdarnoggi.it/amarcord/notte',true],
['stampa','MEMORIE_231299.HTM','Libri e cultura locale','23/12/1999','Ricostruzione editoriale','www.valdarnoggi.it/amarcord/cultura',true],
['riviste','NOVA_PC_12_99.TXT','NOVA PC — dicembre 1999','01/12/1999','Rubrica modem, giochi e periferiche','',true],
['riviste','ANNUNCI_1999.TXT','Piccoli annunci','22/12/1999','Mercatino del Valdarno in lire','',true],
['riviste','ORARI_FS.TXT','Orari ferroviari','23/12/1999','Orari dimostrativi, non storici certificati','',true]
];
function show(){
const root=document.createElement('div');root.className='photo99';root.innerHTML='<div class="photo99-toolbar"><b>🗃️ ARCHIVIO FOTOGRAFICO 99</b> <button data-home>Disco locale</button><button data-rotate>Rotazione</button><button data-about>Proprietà</button></div><div class="photo99-body"><div class="photo99-folders"></div><div class="photo99-list"></div></div><div class="photo99-status">Cartelle locali · Consultazione sola lettura</div>';
let folder='luoghi',current=null,rotation=0;
const list=root.querySelector('.photo99-list'),folders=root.querySelector('.photo99-folders'),status=root.querySelector('.photo99-status');
function accessible(rec){return rec[6]||!!(typeof chapter!=='undefined'&&chapter.receipt&&rec[1]==='GM_LAB_171098.JPG')||(!rec[6]&&rec[1]!=='GM_LAB_171098.JPG'&&typeof chapter!=='undefined'&&chapter.alma)}
function render(){folders.replaceChildren();for(const [id,label] of [['luoghi','📁 Luoghi'],['persone','📁 Persone'],['stampa','📁 Giornali'],['riviste','📁 Riviste']]){const b=document.createElement('button');b.className=folder===id?'current':'';b.textContent=label;b.onclick=()=>{folder=id;current=null;render()};folders.append(b)};list.replaceChildren();for(const p of P.filter(x=>x[0]===folder)){if(!accessible(p))continue;const row=document.createElement('div');row.className='photo99-row';row.textContent=(p[0]==='luoghi'?'📷 ':p[0]==='persone'?'👤 ':'📰 ')+p[1]+' — '+p[2];row.onclick=()=>view(p);list.append(row)}}
function view(p){current=p;rotation=0;status.textContent=p[1]+' · '+p[3]+' · '+p[4];const win=document.createElement('div');win.className='photo99-view';if(p[0]==='stampa'&&window.SITES&&SITES[p[5]]){win.innerHTML='<div class="photo99-paper">'+SITES[p[5]]+'</div>'}else if(p[5]&&p[5].endsWith('.svg')){const pic=document.createElement('div');pic.className='photo99-picture';const img=document.createElement('img');img.src=p[5];img.alt='Ricostruzione grafica: '+p[2];pic.append(img);win.append(pic)}else{const sheet=document.createElement('div');sheet.className='photo99-paper';sheet.innerHTML='<h1>'+p[2]+'</h1><p>'+p[4]+'</p><p><small>Registrato il '+p[3]+'</small></p>';if(p[0]==='riviste')sheet.innerHTML+='<p>Rubrica d’epoca ricostruita: <b>'+p[1]+'</b>. Nessuna notizia è spacciata per originale verificato.</p>';if(p[0]==='persone')sheet.innerHTML+='<p>Materiale personale: la documentazione visiva non era stata conservata nel backup principale.</p>';win.append(sheet)}
const cap=document.createElement('div');cap.className='photo99-caption';cap.textContent=p[1]+' · '+p[2]+' · '+p[3]+'. '+p[4]+'. Le fotografie di luoghi sono ricostruzioni illustrative, non scatti storici certificati.';win.append(cap);createWindow('photo99-view',p[1]+' — Visualizzatore NOVA',win,{width:710,height:550})}
root.querySelector('[data-home]').onclick=()=>{folder='luoghi';render()};root.querySelector('[data-rotate]').onclick=()=>{rotation=(rotation+90)%360;const pic=document.querySelector('.photo99-picture img');if(pic)pic.style.transform='rotate('+rotation+'deg)'};root.querySelector('[data-about]').onclick=()=>{status.textContent=current?current[1]+' · originale recuperato: '+(current[6]?'archivio pubblico / ricostruzione':'Chat99 / memoria personale'):'Seleziona un file'};render();createWindow('photo99-main','Archivio fotografico — NOVA 2000',root,{width:840,height:560})}
const previous=openApp;openApp=function(app){if(app==='photo99'){if(booting)return;show();return}return previous(app)};
const menu=document.querySelector('#start-menu');if(menu){const b=document.createElement('button');b.textContent='📸 Archivio fotografico 99';b.onclick=()=>openApp('photo99');menu.append(b)}
window.openPhoto99=show;
})();
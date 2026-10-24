/* NOVA 2000 — Schermo intero. I browser lo concedono solo dopo un gesto dell'utente: il gioco lo chiede al primo clic
   o tasto premuto (una volta sola: se il giocatore esce con Esc non viene forzato di nuovo). START › Impostazioni › Schermo intero
   lo attiva e lo disattiva. Dove non è supportato (es. iPhone) non succede niente. */
(()=>{'use strict';
const root=document.documentElement;
const can=()=>!!(root.requestFullscreen||root.webkitRequestFullscreen);
const isFs=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function enter(){if(!can()||isFs())return;try{const r=(root.requestFullscreen||root.webkitRequestFullscreen).call(root,{navigationUI:'hide'});r?.catch?.(()=>{})}catch{}}
function exit(){try{(document.exitFullscreen||document.webkitExitFullscreen)?.call(document)?.catch?.(()=>{})}catch{}}
let asked=false;
const first=e=>{if(asked)return;if(e.type==='keydown'&&(e.key==='Escape'||e.key==='F11'))return;asked=true;enter();document.removeEventListener('pointerdown',first,true);document.removeEventListener('keydown',first,true)};
document.addEventListener('pointerdown',first,true);document.addEventListener('keydown',first,true);
document.addEventListener('click',e=>{if(e.target.closest?.('[data-fs]')){isFs()?exit():enter()}});
const b=document.querySelector('[data-fs]');if(b&&!can())b.hidden=true;
})();

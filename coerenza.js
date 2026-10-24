/* PARTITION_99 — Coerenza degli allegati (dal playtest): gli appunti di Edoardo e la foto del laboratorio danno
   gli stessi indizi e sbloccano gli stessi passaggi da qualunque punto vengano aperti (Archivio, Download, Disegno).
   Signal Maze rimanda ai profili storici GM-LAB dell'Archivio. */
(()=>{'use strict';
const NOTES='Edoardo Cattani — note sul progetto (1997)\n\nLe routine di interazione si chiamavano A.L.M.A.: un sistema sperimentale di apprendimento.\nIl vecchio riconoscimento comportamentale era collegato alla classifica di Signal Maze.\n\nI vecchi profili e i salvataggi dei giochi sono conservati nell’Archivio, nella cartella giochi/GM-LAB. Il test di riconoscimento chiede la firma del laboratorio.\nFirma dell’ambiente di test (nome di riferimento del laboratorio): MONTANINO.\n\nQuesti appunti non spiegano la versione successiva del progetto.';
const RETRO='Retro della fotografia, scritto a penna:\n\nMontanino · GM-LAB · 17/10/1998\nIo, Matteo ed Edoardo. L’ultima volta tutti e tre in laboratorio.\n\nSigla del negativo: 171098';
window.P99_NOTES=NOTES;window.P99_RETRO=RETRO;
if(gameState.files['appunti_edoardo_97.txt']){gameState.files['appunti_edoardo_97.txt']=NOTES;saveGame()}
const read=k=>{if(typeof chapter!=='undefined'&&!chapter[k]){chapter[k]=true;saveChapter();if(typeof updateClue==='function')updateClue()}};
// Appunti: stesso testo completo ovunque; aprirli conta come «letti».
const baseText=launchText;launchText=function(name,text){if(name==='appunti_edoardo_97.txt'){text=NOTES;read('archive')}return baseText.call(this,name,text)};
// Foto del laboratorio aperta in Disegno: conta come vista e mostra anche il retro.
const baseOpen=window.P99OpenImage;window.P99OpenImage=function(name){baseOpen(name);if(!/foto_laboratorio/i.test(name))return;read('photo');const w=[...document.querySelectorAll('.window')].pop();const bar=w?.querySelector('[data-clear]')?.parentElement;if(bar&&!bar.querySelector('[data-retro]')){const b=document.createElement('button');b.dataset.retro='1';b.textContent='🔄 Retro / annotazioni';b.onclick=()=>launchText('foto_laboratorio_1998 — retro',RETRO);bar.append(b)}};
// Signal Maze: chi cerca la classifica di Giuseppe nel gioco trova il rimando ai profili storici.
const baseMaze=launchMaze;launchMaze=function(){const r=baseMaze.apply(this,arguments);const w=[...document.querySelectorAll('.window')].pop();if(w&&typeof chapter!=='undefined'&&(chapter.giulia||chapter.receipt)&&!chapter.maze){const p=document.createElement('p');p.style.cssText='margin:6px;text-align:center';const b=document.createElement('button');b.textContent='🔒 Profili storici GM-LAB…';b.onclick=()=>{openApp('archive');setTimeout(()=>document.querySelector('.window [data-lab]')?.click(),50)};p.append(b);(w.querySelector('.window-content')||w).append(p)}return r};
})();

/* PARTITION_99 — Chat 99: fiducia progressiva, dialoghi ramificati e salvataggio */
(()=>{
'use strict';
const KEY='partition99-dialoghi-v3';
function load(){let x={};try{x=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}return Object.assign({m:0,e:0,mt:0,et:0,lie:false,referral:false,photo:false,notes:false,history:[]},x)}
let state=load();
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function chat(){
 const el=panel('<h2>💬 Chat 99 — Connessione NOVA</h2><div class="nova-inset"><b>Account locale:</b> NOVA_USER · <b>Profilo storico:</b> '+(gameState.q2?'GMILANO_70':'non rilevato')+'</div><p><button data-m>Matteo_N</button> <button data-e>Edoardo_C</button> <button data-h>Rileggi conversazioni</button></p><div class="nova-inset" data-log style="min-height:270px;max-height:310px;overflow-y:auto;line-height:1.45"></div><div data-opts style="display:flex;flex-wrap:wrap;gap:6px;padding-top:8px"></div><p class="note">Le persone possono interrompere la conversazione, chiedere spiegazioni o rifiutare allegati. La fiducia si costruisce con ciò che scegli di dire.</p>');
 const log=el.querySelector('[data-log]'),opts=el.querySelector('[data-opts]');
 function entry(w,t,store=true){const p=document.createElement('p');p.className='chat-line';const b=document.createElement('b');b.textContent=w+': ';p.append(b,document.createTextNode(t));log.append(p);log.scrollTop=log.scrollHeight;if(store){state.history.push([w,t]);state.history=state.history.slice(-140);persist()}}
 function say(w,t){entry(w,t)}
 function choose(arr){opts.replaceChildren();for(const [label,fn] of arr){const b=document.createElement('button');b.className='story-action';b.textContent=label;b.onclick=()=>{opts.replaceChildren();say('Tu',label);fn()};opts.append(b)}}
 function resume(){opts.replaceChildren();log.replaceChildren();if(state.history.length){for(const [w,t] of state.history)entry(w,t,false)}else entry('Sistema','Connessione inattiva. Scegli un contatto.',false)}
 function referral(){state.referral=true;chapter.matteo=true;saveChapter();persist();say('Matteo_N','Si chiama Edoardo Cattani. Era un collega di Giuseppe, non il suo migliore amico. Vive a San Giovanni Valdarno. Gli ho scritto che potresti contattarlo.');say('Server','Edoardo_C aggiunto alla rubrica.');}
 function photo(){if(state.mt<3){say('Matteo_N','Non me la sento ancora di mandarti quella fotografia. Ho bisogno di sapere cosa ne farai.');return}state.photo=true;chapter.receipt=true;saveChapter();persist();say('Matteo_N','Te la invio. Ti chiedo solo di non mostrarla in giro. Per me non è una prova: è un ricordo.');say('Server','Allegato foto_laboratorio_1998 ricevuto. Ora è in Archivio.')}
 function matteo(){
 if(!gameState.q2){say('Sistema','Profilo remoto non riconosciuto. Prima recupera l’account storico dal disco.');return}
 if(state.m===0){say('Server','Matteo_N è online.');say('Matteo_N','...Giuseppe?');say('Matteo_N','Scusa. Ho visto un nome che non appariva più da settimane. Chi sei?');
 choose([['Ho comprato il computer usato. Non sapevo fosse suo.',()=>{state.mt+=2;state.m=1;persist();say('Matteo_N','Capisco. Vedere quell’account connesso mi ha tolto il fiato. Giuseppe era il mio migliore amico.');}],['Ho trovato dei file e vorrei capire a chi appartenevano.',()=>{state.mt+=1;state.m=1;persist();say('Matteo_N','Non è una curiosità innocente. Non per me. Che cosa cerchi davvero?');}],['Sono Giuseppe.',()=>{state.lie=true;state.mt=-2;state.m=1;persist();say('Matteo_N','Non farlo. Ero presente quando gli abbiamo detto addio. Se è uno scherzo, smettila.');}]]);return}
 if(state.m===1){say('Matteo_N',state.lie?'Se vuoi ancora parlarmi, devi dirmi la verità.':'Prima di continuare: perché stai leggendo i suoi dati?');
 choose([['Hai ragione. Il computer è usato, sto cercando di capirne la storia.',()=>{state.mt=Math.max(1,state.mt+2);state.lie=false;state.m=2;persist();say('Matteo_N','Grazie. Giuseppe aveva smesso di raccontarmi molte cose. Non voglio che venga trattato come un mistero da risolvere per gioco.');}],['Mi preoccupa una frase trovata in un vecchio programma.',()=>{state.mt=Math.max(1,state.mt+1);state.lie=false;state.m=2;persist();say('Matteo_N','Una frase? Non saprei. So soltanto che passava sempre più tempo davanti al PC.');}],['Non sono affari tuoi. Mandami quello che hai.',()=>{state.mt=Math.max(-2,state.mt-1);persist();say('Matteo_N','Allora no. Non ho nulla da condividere con te. Se cambi idea puoi spiegarmi che cosa sta succedendo.');}]]);return}
 if(state.m===2){say('Matteo_N','Ho conservato una vecchia fotografia. Non sono sicuro di volerla mandare a uno sconosciuto.');
 choose([['Non la pubblicherò. Voglio soltanto conoscere la provenienza del computer.',()=>{state.mt+=1;state.m=3;persist();say('Matteo_N','D’accordo. Preferisco che tu sappia chi era, invece di inventarti una storia su di lui.');}],['Puoi almeno dirmi dove lavorava?',()=>{state.mt+=1;state.m=3;persist();say('Matteo_N','Lavorava a programmi sperimentali. Per le questioni tecniche era più preparato un suo collega.');}],['Devi darmi quella foto.',()=>{state.mt=Math.max(-1,state.mt-1);persist();say('Matteo_N','Non devo fare proprio niente. Prova a chiedermelo senza pretendere.');}]]);return}
 say('Matteo_N',state.mt<2?'Non ho dimenticato come mi hai parlato. Se vuoi continuare, dimmi perché queste informazioni sono importanti.':'Sono qui. Alcune cose le so, altre non voglio inventarle.');
 const arr=[];
 if(state.mt<2)arr.push(['Mi dispiace per il tono. Rispetterò quello che decidi.',()=>{state.mt+=2;persist();say('Matteo_N','Apprezzo che tu lo dica. Non è facile parlare di lui.') }]);
 else {if(!state.referral)arr.push(['Chi conosceva i suoi esperimenti informatici?',referral]);if(!state.photo)arr.push(['Posso vedere quella fotografia, solo per riconoscere il luogo?',photo]);}
 arr.push(['Che rapporto avevate?',()=>{state.mt=Math.min(4,state.mt+1);persist();say('Matteo_N','Ci conoscevamo da anni. Negli ultimi mesi ogni invito finiva con un “domani”. Non ho mai smesso di chiedergli come stava.') }]);
 arr.push(['Non voglio disturbarti oltre.',()=>say('Matteo_N','Va bene. Scrivimi se trovi qualcosa che pensi dovrei sapere.')]);
 choose(arr);
 }
 function notes(){if(state.et<2){say('Edoardo_C','Non distribuisco i vecchi appunti a chiunque. Prima spiegami meglio da dove arriva quel computer.');return}state.notes=true;chapter.giulia=true;saveChapter();persist();say('Edoardo_C','Va bene. È soltanto la documentazione iniziale: non conosco la versione che Giuseppe ha sviluppato da solo.');say('Server','Allegato appunti_edoardo_97.txt ricevuto. Ora è in Archivio.')}
 function edoardo(){
 if(!state.referral){say('Sistema','Edoardo_C non è nella rubrica. Occorre ottenere un contatto da qualcuno che lo conosca.');return}
 if(state.e===0){say('Edoardo_C','Matteo mi ha scritto. Mi ha detto che hai un vecchio computer di Giuseppe.');say('Edoardo_C','Non lavoravamo più insieme da un po’. Cosa vuoi sapere?');
 choose([['Voglio capire che cosa è rimasto dopo una reinstallazione.',()=>{state.et+=1;state.e=1;persist();say('Edoardo_C','Allora parliamo del disco, non di voci. Un ripristino può lasciare intatti altri volumi.');}],['Credo che Giuseppe avesse nascosto un programma.',()=>{state.et+=0;state.e=1;persist();say('Edoardo_C','“Nascosto” è una parola grossa. Hai un rapporto del disco oppure solo supposizioni?');}],['Matteo ha detto che sei tu quello che sa tutto.',()=>{state.et-=1;state.e=1;persist();say('Edoardo_C','Matteo non può aver detto questo. Nessuno di noi sapeva tutto di quel progetto.');}]]);return}
 if(state.e===1){say('Edoardo_C','Prima di mandarti qualcosa, dimmi che uso ne faresti.');
 choose([['Solo una copia per consultazione. Non intendo modificare i file.',()=>{state.et+=2;state.e=2;persist();say('Edoardo_C','È la scelta più prudente. Ho visto troppi dati rovinati dai tentativi di riparazione.');}],['Voglio ricostruire il programma e vedere cosa succede.',()=>{state.et-=1;state.e=2;persist();say('Edoardo_C','Non provare a eseguire codice sconosciuto senza capire cosa fa. Mi fermo qui finché non chiarisci le tue intenzioni.');}],['So soltanto che c’è un riferimento a Montanino.',()=>{state.et+=1;state.e=2;persist();say('Edoardo_C','Montanino era legato al laboratorio di Giuseppe. Almeno stai partendo da un dato verificabile.');}]]);return}
 if(state.et<2){say('Edoardo_C','Per ora non posso condividere documentazione.');choose([['Hai ragione. Voglio soltanto leggere i file senza modificarli.',()=>{state.et+=2;persist();say('Edoardo_C','Bene. Allora possiamo parlare con calma.')}],['Perché sei così diffidente?',()=>say('Edoardo_C','Perché conoscevo Giuseppe, ma non il suo ultimo lavoro. Non voglio fare danni a distanza.')]);return}
 say('Edoardo_C','Giuseppe scriveva sistemi di assistenza personalizzati. Il codice finale non l’ho mai visto.');
 choose([...(state.notes?[]:[['Mi invii gli appunti originali del 1997?',notes]]),['Che cosa puoi dirmi di A.L.M.A.?',()=>{state.et=Math.min(4,state.et+1);persist();say('Edoardo_C','All’inizio era un sistema di apprendimento sperimentale. Non era stato pensato come una persona. Poi Giuseppe ha lavorato da solo.') }],['Preferisco fermarmi e verificare i dati.',()=>say('Edoardo_C','È quello che farei anch’io. Confronta sempre almeno due fonti.')]);
 }
 el.querySelector('[data-m]').onclick=matteo;el.querySelector('[data-e]').onclick=edoardo;el.querySelector('[data-h]').onclick=resume;
 resume();
 createWindow('chat','Chat 99 — Conversazioni',el,{width:710,height:595});
 }
 // Sostituiamo solo la UI dei dialoghi: manteniamo invariati i flag di avanzamento del gioco.
 launchStoryChat=chat;
})();

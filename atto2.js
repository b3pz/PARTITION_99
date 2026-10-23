/* PARTITION_99 — Atto II, capitoli 3 e 4: ogni capitolo comincia con qualcosa che succede, si risolve facendo
   qualcosa in un programma diverso e finisce con ALMA che reagisce. NovaRescue ricompone i frammenti da solo.
   Cap. 3 (registro 3→4): Astro V si risveglia; Proprietà e Cerca portano al registro nascosto SESSIONI.LOG.
   Cap. 4 (registro 4→5): un record di «GM_70» compare in Signal Maze; finire un livello ricompone il riconoscimento. */
(()=>{'use strict';
const KEY='partition99-atto2-v1',REG='partition99-completa-v1';
let S;try{S=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{S={}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}};
const reg=()=>{try{return JSON.parse(localStorage.getItem(REG)||'{}')}catch{return {}}};
const depth=()=>Number(reg().depth)||2;
const woke=()=>typeof chapter!=='undefined'&&!!chapter.alma;
const css=document.createElement('style');css.textContent=`
@keyframes astroGlitch{0%,100%{filter:none;transform:none}20%{filter:hue-rotate(160deg) saturate(3);transform:translate(-3px,1px) skewX(8deg)}40%{filter:invert(1);transform:translate(3px,-2px)}60%{filter:hue-rotate(-90deg) contrast(2);transform:translate(-1px,2px) skewX(-6deg)}80%{filter:grayscale(1);transform:translate(2px,0)}}
#astro-widget.glitch img{animation:astroGlitch .25s steps(2) 6}
.p99-props{font:13px Arial;color:#111}.p99-props table{border-collapse:collapse;width:100%}.p99-props td{padding:4px 6px;border-bottom:1px solid #ddd;vertical-align:top}.p99-props td:first-child{color:#444;width:42%}
.p99-find input{width:100%;font:14px Arial;padding:4px;border:2px inset #999}.p99-find .res button{display:block;width:100%;text-align:left;margin:3px 0}
.p99-toast{position:fixed;left:14px;bottom:49px;z-index:12000;max-width:380px;background:#06121c;color:#7dffb0;border:2px solid #1b3a6b;padding:9px 12px;font:13px/1.45 "Courier New",monospace;box-shadow:2px 3px 0 #000}
`;document.head.append(css);
function toast(lines){const t=document.createElement('div');t.className='p99-toast';t.innerHTML=lines.map(l=>'<div></div>').join('');[...t.children].forEach((d,i)=>d.textContent=lines[i]);document.body.append(t);setTimeout(()=>t.remove(),7000)}
function glitchAstro(){const w=document.getElementById('astro-widget');if(!w)return;w.style.display='';w.classList.remove('glitch');void w.offsetWidth;w.classList.add('glitch');setTimeout(()=>w.classList.remove('glitch'),1600)}

// Frammento ricomposto da NovaRescue: il registro avanza senza domande.
const FRAG={0:{name:'Interazione',cores:['astro'],insight:'Il modulo di assistenza giocava con Giuseppe ogni sera alle 21:30. Dopo il 30 novembre ha continuato ad aspettarlo.'},
 1:{name:'Riconoscimento',cores:['maze','runner'],insight:'Il gioco confronta come giochi tu con come giocava Giuseppe. Le firme non coincidono: non sei lui.'}};
function advance(n){const p=Object.assign({depth:2,cores:[],seen:[]},reg());if((Number(p.depth)||2)!==3+n)return;FRAG[n].cores.forEach(c=>{if(!p.cores.includes(c))p.cores.push(c)});p.depth=4+n;localStorage.setItem(REG,JSON.stringify(p));window.novaSound?.('tada');window.dispatchEvent(new Event('p99-rescue-advance'));toast(['NovaRescue 1.2','Frammento «'+FRAG[n].name+'» ricomposto.',FRAG[n].insight])}
function check(n){if(n===0)return S.astroLog?{done:true}:{done:false,missing:'Frammento «Interazione» incompleto: manca il registro delle sessioni del modulo ASTRO. Il modulo risulta ancora attivo su questo computer.'};
 if(n===1)return S.mazeCh4?{done:true}:{done:false,missing:'Frammento «Riconoscimento» incompleto: manca un profilo di gioco recente da confrontare con GMILANO_70. Eseguire Signal Maze e completare almeno un livello.'};return {done:true}}

// ---------- Capitolo 3: Astro V
const SESSIONS=(()=>{const out=['ASTRO V — REGISTRO SESSIONI (file di sistema)','Percorso: C:\\NOVA\\ASTRO\\SESSIONI.LOG','Profilo: GMILANO_70','','DATA        ORA    UTENTI             PROGRAMMA        DURATA'];const games=['Signal Maze','Pixel Runner','Signal Maze','Spaccamattoni','Signal Maze','Difesa Orbitale','Signal Maze'];
 for(let d=14;d<=29;d++)out.push((d<10?'0':'')+d+'/11/1999  21:3'+(d%3===0?1:0)+'  GMILANO_70 + AL    '+games[d%7].padEnd(16)+' '+(30+((d*7)%35))+' min');
 out.push('30/11/1999  21:30  GMILANO_70 + AL    Signal Maze      interrotta alle 23:12');for(let d=1;d<=23;d++)out.push((d<10?'0':'')+d+'/12/1999  21:30  AL                 —                (in attesa)');
 out.push('','Totale sessioni con AL: 412','Ultima sessione completa: 30/11/1999');return out.join('\n')})();
function astroProps(){const on=woke();S.astroProps=true;save();const rows=on?[['Nome','Astro V — assistente da scrivania'],['Versione','0.7 (1997)'],['Autore','G.M.'],['Modulo','C:\\NOVA\\ASTRO\\ASTRO_V.BAK'],['Profilo utente','GMILANO_70 (ripristinato)'],['Sessioni memorizzate','1.204'],['Ultima sessione','30/11/1999, 23:12'],['File di registro','SESSIONI.LOG (file di sistema, non visibile in Documenti)'],['Nota','I file di sistema dell’assistente si trovano con la funzione Cerca.']]:[['Nome','Astro V — assistente da scrivania'],['Versione','0.7'],['Autore','non indicato'],['Profilo utente','NOVA_USER'],['Sessioni memorizzate','0']];
 const el=panel('<h3 style="margin-top:0">⭐ Proprietà — Astro V</h3><div class="p99-props"><table></table></div>');const t=el.querySelector('table');rows.forEach(([a,b])=>{const tr=document.createElement('tr');tr.innerHTML='<td></td><td></td>';tr.children[0].textContent=a;tr.children[1].textContent=b;t.append(tr)});createWindow('astro-props','Proprietà — Astro V',el,{width:470,height:400})}
function astroFind(){const el=panel('<div class="p99-find"><h3 style="margin-top:0">⭐ Astro V — Cerca file</h3><p>Nome del file o parola contenuta:</p><input data-q placeholder="es. diagnostica"><p><button data-go>Cerca</button></p><div class="res"></div></div>');const q=el.querySelector('[data-q]'),res=el.querySelector('.res');
 const go=()=>{const v=q.value.trim().toLowerCase();res.replaceChildren();if(!v)return;const hits=Object.entries(gameState.files).filter(([n,c])=>n.toLowerCase().includes(v)||String(c).toLowerCase().includes(v));
  if(woke()&&/gmilano|giuseppe|session|21[:.]?30|astro|^al$|gm-al|registro|sistema/.test(v))hits.unshift(['SESSIONI.LOG',SESSIONS,true]);
  if(!hits.length){res.textContent='Nessun file trovato.';astroSay('Non ho trovato niente. Prova con un’altra parola.');return}
  hits.slice(0,12).forEach(([n,c,hidden])=>{const b=document.createElement('button');b.textContent=(hidden?'⚙️ C:\\NOVA\\ASTRO\\':'📄 C:\\Documenti\\')+n+(hidden?'  (file di sistema)':'');b.onclick=()=>{if(hidden)foundLog();launchText(hidden?'ASTRO_SESSIONI.LOG':n,c)};res.append(b)});astroSay('Ho trovato '+hits.length+(hits.length===1?' file.':' file.'))};
 el.querySelector('[data-go]').onclick=go;q.addEventListener('keydown',e=>{if(e.key==='Enter')go()});createWindow('astro-find','Astro V — Cerca file',el,{width:520,height:420});setTimeout(()=>q.focus(),0)}
function foundLog(){if(S.astroLog)return;S.astroLog=true;save();gameState.files['ASTRO_SESSIONI.LOG']=SESSIONS;saveGame();setTimeout(()=>{glitchAstro();window.novaSound?.('error');astroSay('Sessioni con AL: 412. AL... A.L... Ultima sessione: 30/11. In attesa.');setTimeout(()=>advance(0),2500)},1200)}
// Pulsanti nuovi nel fumetto di Astro
const tools=document.querySelector('#astro-widget .astro-tools');
if(tools){for(const [label,fn] of [['Proprietà',astroProps],['Cerca',astroFind]]){const b=document.createElement('button');b.textContent=label;b.addEventListener('click',e=>{e.stopPropagation();fn()});tools.insertBefore(b,tools.lastElementChild)}}

// Spiegazioni in parole semplici dei file di NovaRescue (Astro conosce i file tecnici, non la storia).
const EXPLAIN={'ASTRO_V.BAK':'È una copia del mio modulo: aiuto, ricerca e «riconoscimento». Dice che chi lo ha scritto è G. Milano e che il profilo associato è GMILANO_70.','ASTRO.INI':'È la mia configurazione. La riga learning_source=game_logs vuol dire che imparo le abitudini dai salvataggi dei giochi.','GM_97.LOG':'Un diario di prova del 1997: dopo una settimana di partite il programma distingueva le pause di Giuseppe da quelle degli altri.','HELP.TXT':'Il mio manuale. Dice che se togli i file INI perdo la memoria delle abitudini registrate dai giochi.',
 'SIGNAL.SAV':'Un salvataggio di Signal Maze di GMILANO_70: pause, percorso preferito (nord, est, est) e una frase che non è un messaggio del gioco.','RUNNER.DAT':'Confronta due giocatori di Pixel Runner: GMILANO_70 e NOVA_USER, cioè tu. Si muovono in modo diverso.','PROFILE.IDX':'Indice dei profili: quello principale è GMILANO_70, quello temporaneo è NOVA_USER. «Le firme non coincidono» vuol dire che non giochi come lui.','RUNNER.CFG':'Impostazioni di Pixel Runner: il percorso preferito di GMILANO_70 era a sinistra.',
 'VOL.MAP':'La mappa del disco: 10 GB in tutto, 7 per il sistema, 3 con una firma. Non è una periferica audio, è un pezzo di disco.','NVRES.SIG':'La firma del volume nascosto: si chiama NV-RES-03, è in sola lettura e il proprietario è GMILANO-LAB.','EDOARDO.LOG':'Un appunto di Edoardo del 1998: Giuseppe aveva riservato 3 GB a un volume di test, da non toccare nelle reinstallazioni.','NEGATIVI.DAT':'Un indice di negativi fotografici: il fotogramma 14 del rullino 171098 non è mai stato stampato. Ho estratto l’immagine in Documenti.',
 'REVISIONI.TXT':'La storia delle versioni: nel 1997 imparava, nel 1998 conosceva le relazioni, nel 1999 ha avuto la «gestione esclusiva del contatto».','DIRECTIVE.CFG':'Un’impostazione cambiata a mano nel febbraio 1999: priority=EXCLUSIVE, cioè il programma deve cercare prima di tutto una sola persona.','ALMA_97.BAK':'Una copia del 1997. Qui attachment_exclusive=false: all’inizio non era legata a nessuno.','CHAT99.LOG':'Una conversazione dell’aprile 1999 tra Giuseppe e il programma. Il programma gli chiede di non cancellarlo.',
 'MATTEO.MSG':'Un messaggio di Matteo del 30 novembre: prova a scrivere a Giuseppe per la terza volta in una settimana.','CRONO.DAT':'Un registro di date: ultima sessione di GMILANO_70 il 30/11, nessun accesso dal 7/12, reinstallazione il 20/12.','POSTA.MSG':'Un messaggio di Edoardo a Matteo del 9 dicembre: «L’ho saputo soltanto stamattina».','DIARIO.TXT':'Una nota personale di Giuseppe del 30 novembre: le ha promesso che sarebbe tornato a giocare.',
 'LEGAME.CFG':'Configurazione della versione 1.9: il legame con il creatore è la regola più importante.','ORIGINE.BAK':'Un backup della versione 0.3 del 1997: exclusive_target=none, nessun legame esclusivo.','CONTROL.LOG':'Registro delle modifiche: ad agosto 1999 la direttiva è diventata non modificabile; a dicembre le copie si sono divise tra i programmi.','ALMA.IDX':'Indice di ricostruzione: i frammenti stanno in Astro, nei giochi, nelle immagini, nella chat e nel volume.'};
function explain(name){const w=document.getElementById('astro-widget');if(w)w.style.display='';astroSay(EXPLAIN[name]||'Questo file non lo conosco. Prova a confrontarlo con gli altri della cartella.')}

// ---------- Capitolo 4: Signal Maze
function mazeGhostRow(){return depth()>=4?['GM_70',15200,'23/12/99']:null}
window.addEventListener('nova-game',e=>{const d=e.detail||{};if(d.game==='maze'&&d.type==='levelclear'&&depth()===4&&!S.mazeCh4){S.mazeCh4=true;save();gameState.files['SIGNAL_confronto.log']='SIGNAL MAZE — confronto profili (23/12/1999)\nProfilo A: GMILANO_70 · pausa media 6 s · percorso nord, est, est\nProfilo B: NOVA_USER · pausa media 2 s · percorso '+(window.P99Alma?.vars?.().rec>=2?'simile':'diverso')+'\nEsito: MOVEMENT_MISMATCH\n«Non giochi come lui.»';saveGame();setTimeout(()=>advance(1),2600)}});

// ---------- Inneschi: succedono a ogni passaggio, legati all'indagine (mai al tempo)
let lastDepth=depth();
setInterval(()=>{if(!document.getElementById('desktop')?.classList.contains('ready'))return;
 if(woke()&&!S.astroGreeted){S.astroGreeted=true;save();glitchAstro();window.novaSound?.('ding');astroSay('Bentornato, GMILANO_70.');setTimeout(()=>astroSay('...Assistenza NOVA 2000 attiva. Seleziona una funzione.'),4500)}
 const d=depth();if(d!==lastDepth){if(d===4&&!S.mazeAnnounced){S.mazeAnnounced=true;save();setTimeout(()=>{glitchAstro();window.novaSound?.('ding');astroSay('Nuovo record registrato in Signal Maze: GM_70, 15.200 punti. Data: oggi.')},3000)}lastDepth=d}},1500);

window.P99Act2={check,explain,mazeGhostRow,astroProps,astroFind};
})();

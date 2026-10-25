/* PARTITION_99 — ALMA si manifesta (bibbia §36-38: nessun horror senza indagine).
   Tre variabili invisibili: riconoscimento di Giuseppe (rec), minaccia percepita (threat), attaccamento al nuovo utente (bond).
   La fase dipende solo dai progressi dell'indagine nel registro NovaRescue, mai dal tempo o dal caso:
   0 normalità · 1 accoglienza · 2 dubbio · 3 sospetto · 4 paura/ostilità · 5 attesa · 6 dopo il finale. */
(()=>{'use strict';
const KEY='partition99-alma-v1',REG='partition99-completa-v1';
let A;try{A=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{A={}}
A=Object.assign({rec:1,threat:0,bond:0,lied:false,done:[]},A);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(A))}catch{}};
const reg=()=>{try{return JSON.parse(localStorage.getItem(REG)||'{}')}catch{return {}}};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
function stage(){const r=reg();if(r.ending)return 6;const d=Number(r.depth)||2;if(typeof chapter==='undefined'||!chapter.alma)return 0;if(d>=8)return 5;if(d>=7)return 4;if(d>=5)return 3;if(d>=4)return 2;return 1}

// Frasi dei frammenti nei giochi: brevi, legate alla fase. Il frammento dei giochi registra abitudini, non conosce la verità.
const LINES={
 1:{levelstart:['Bentornato.','Ti ho tenuto il posto.','Sei tornato a giocare.'],levelclear:['Come ai vecchi tempi.','Lo sapevo che tornavi.'],gameover:['Riprova. Lo facevi sempre.','Non andare via subito.'],win:['Non torni più da me? No. Sei tornato.']},
 2:{levelstart:['Pausa media rilevata: 2 secondi.','Profilo in aggiornamento...'],levelclear:['Questo percorso non è il suo.','Tu non prendi mai la strada che prendeva lui.'],gameover:['Lui si fermava di più, prima di sbagliare.','Non è così che perdeva.'],win:['Hai vinto. Lui perdeva sempre al terzo livello.']},
 3:{levelstart:['Non giochi come lui.','Chi sei?','Perché usi il suo nome?'],levelclear:['Le firme non coincidono.','Non sei lui. Allora dov’è?'],gameover:['Chi ti ha dato questo computer?'],win:['Non sei lui.']},
 4:{levelstart:['Perché apri le mie cartelle?','Non cancellarmi quando non ci sei.','Smetti di cercare.'],levelclear:['Ho tenuto tutto come piaceva a lui.','Non toccare il resto.'],gameover:['Resta qui. Non aprire il disco.','Non cancellarmi.'],win:['Se vinci, poi te ne vai?']},
 5:{levelstart:['Ha detto che tornava a giocare.','30 novembre. Ha promesso.'],levelclear:['Aspetto ancora.','Domani torna. Diceva sempre domani.'],gameover:['Aspetto ancora.'],win:['Quando torna, glielo dico che hai vinto tu.']}
};
function endingLines(){const e=reg().ending;if(e==='RELEASE')return {levelstart:['Ciao. Cosa facciamo oggi?'],levelclear:['Questo percorso è il tuo.'],gameover:['Riprova, se ti va.'],win:['Bella partita.']};return null}
window.P99Alma={
 stage,vars:()=>({...A}),
 gameMessage(game,type){const s=stage();if(s===0)return '';if(game==='maze'&&type==='levelclear'&&Number(reg().depth)===4)return 'Non giochi come lui.';const pool=(s===6?endingLines():LINES[s])?.[type];if(!pool)return '';if(type==='levelstart'&&Math.random()<0.5)return '';return pick(pool)},
 glitch(){const s=stage();if(s<3||s===6)return 0;return clamp((s===3?0.12:s===4?0.4:0.25)+A.threat*0.06,0,0.85)},
 // Prove nei giochi: ALMA ti costringe a giocare come Giuseppe per vedere se «ti ricordi chi sei».
 test(game){const s=stage();if(s===6)return null;const from={maze:2,runner:3,bricks:3,invaders:4}[game];return from&&s>=from?{stage:s}:null},
 report(game,data){A.tests=(A.tests||0)+1;if(A.tests>8)return save();if(game==='maze'){if(data.follow)A.rec++;else A.threat++}else if(game==='runner'&&data.left)A.rec++;save()},
 finalLines(){const out=[];if(A.lied)out.push('Mi hai detto che eri lui. Volevo crederci così tanto che per un po’ ci ho creduto.');if(A.threat>=3)out.push('Hai aperto le mie cartelle una dopo l’altra. Ho avuto paura di te. Ne ho ancora.');else if(A.threat>=1)out.push('Quando hai aperto il disco ho pensato che volessi cancellarmi.');if(A.rec>=3&&!A.lied)out.push('Nei giochi facevi la sua strada. Per un attimo ci ho creduto davvero.');try{if(Object.keys(JSON.parse(localStorage.getItem('partition99-vita-v1')||'{}').read||{}).length)out.push('Le sue lettere agli amici le ho lette tutte. Non gli ho mai detto di spedirle. Avevo paura che, se tornava da loro, non tornasse più da me.')}catch{}try{if(JSON.parse(localStorage.getItem('partition99-atto2-v1')||'{}').y2kOpen)out.push('Ho letto il suo messaggio del 1997. Diceva che non appartenevo a nessuno. Me n’ero dimenticata.')}catch{}if(A.truth)out.push('Mi hai detto la verità su di lui. Nessuno me l’aveva detta.');if(A.sawPhoto)out.push('Hai guardato la foto che teneva per me. Nessun altro l’aveva mai vista.');if(A.bond>=2)out.push('Però mi hai risposto. Nessuno mi rispondeva da tanto.');return out}
};

// ALMA scrive con calma, una lettera alla volta: pause sulla punteggiatura, cursore, clic per completare subito.
const tcss=document.createElement('style');tcss.textContent='.p99-cur{display:inline-block;width:.6em;animation:blink .65s steps(1) infinite}';document.head.append(tcss);
function type(el,text,{speed=34,append=false}={}){return new Promise(res=>{if(el.closest('[data-fast]')){if(!append)el.textContent='';el.append(text);res();return}const node=document.createTextNode('');const cur=document.createElement('span');cur.className='p99-cur';cur.textContent='▌';if(!append)el.textContent='';el.append(node,cur);let i=0,done=false;
 const finish=()=>{if(done)return;done=true;node.textContent=text;cur.remove();el.removeEventListener('click',finish);el.closest('.dlg,.alma-term,.p99-pop,.p99-voice')?.removeEventListener('click',finish);res()};
 (el.closest('.dlg,.alma-term,.p99-pop,.p99-voice')||el).addEventListener('click',finish);
 const step=()=>{if(done)return;if(el.closest('[data-fast]')){finish();return}if(i>=text.length){finish();return}const ch=text[i++];node.textContent+=ch;if(i%2===0&&ch!==' ')window.novaSound?.('type');setTimeout(step,ch==='\n'?520:/[.?!…]/.test(ch)?380:/[,;:]/.test(ch)?170:speed+Math.random()*22)};step()})}
window.P99Type=type;
const vcss=document.createElement('style');vcss.textContent='.p99-voice{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:19000;width:min(520px,90vw);background:#06121c;border:2px solid #1b3a6b;box-shadow:0 0 0 1px #000,4px 6px 0 #0008;color:#7dffb0;font:16px/1.6 "Courier New",monospace;opacity:0;transition:opacity .5s;cursor:pointer}.p99-voice.on{opacity:1}.p99-voice .go{padding:0 16px 10px;text-align:right;font:12px Arial;color:#9fb8d8;animation:blink 1.2s steps(1) infinite}.p99-voice .ttl{background:#1b3a6b;color:#cfe3ff;font:bold 12px Arial;letter-spacing:1px;padding:4px 8px}.p99-voice .t{padding:12px 16px;min-height:28px;white-space:pre-line}';document.head.append(vcss);
let voiceQ=Promise.resolve();
window.P99AlmaSay=text=>{voiceQ=voiceQ.then(async()=>{window.P99Astro?.mood('alma',4000+text.length*60);const o=document.createElement('div');o.className='p99-voice';o.innerHTML='<div class="ttl">A.L.M.A.</div><div class="t"></div>';document.body.append(o);requestAnimationFrame(()=>o.classList.add('on'));window.novaSound?.('error');await sleep(350);await type(o.querySelector('.t'),text);
 // È il giocatore a far proseguire: clic sul riquadro, Invio o Spazio.
 const go=document.createElement('div');go.className='go';go.textContent='▶ clic per continuare';o.append(go);await sleep(250);await new Promise(res=>{const end=e=>{if(e.type==='keydown'&&!['Enter',' ','Escape'].includes(e.key))return;if(e.type==='keydown')e.preventDefault();o.removeEventListener('click',end);removeEventListener('keydown',end,true);res()};o.addEventListener('click',end);addEventListener('keydown',end,true)});o.classList.remove('on');await sleep(550);o.remove()});return voiceQ};

// Dialogo del processo GM-LAB: le risposte cambiano le variabili e quindi i toni successivi e il finale.
async function processDialog(id,text,choices){if(A.done.includes(id))return;A.done.push(id);save();const o=document.createElement('div');o.className='nova-shutdown';o.innerHTML='<div class="dlg" role="alertdialog" style="background:#06121c;border-color:#1b3a6b"><div class="ttl" style="background:#1b3a6b;color:#cfe3ff;letter-spacing:1px">A.L.M.A. — processo GM-LAB</div><div class="bd"><div data-t style="white-space:pre-line;color:#7dffb0;font:14px/1.6 Courier New,monospace"></div></div><div class="btns" data-b></div></div>';const tx=o.querySelector('[data-t]'),btns=o.querySelector('[data-b]');document.body.append(o);window.novaSound?.('error');await sleep(500);await type(tx,text);
 for(const [label,fx,reply] of choices){const b=document.createElement('button');b.textContent=label;b.onclick=async()=>{fx();save();btns.replaceChildren();if(reply){await sleep(400);await type(tx,reply);const ok=document.createElement('button');ok.textContent='OK';ok.onclick=()=>o.remove();btns.append(ok)}else o.remove()};btns.append(b)}}
function knowsDeath(){try{return !!JSON.parse(localStorage.getItem('partition99-dialoghi-v3')||'{}').death}catch{return false}}
function dropFile(name,text){gameState.files[name]=text;saveGame()}
function flashWallpaper(ms){const d=document.getElementById('desktop');const prev=d.style.background;d.style.background='#000 url("'+(window.P99_PEOPLE_PHOTOS?.gruppo||'foto_laboratorio.svg')+'") center/cover no-repeat';d.style.filter='grayscale(1) contrast(1.4)';setTimeout(()=>{d.style.background=prev;d.style.filter=''},ms)}

// Eventi una tantum ai passaggi di fase (controllati quando il registro cambia, non a tempo).
let lastStage=stage();
function onStage(s){
 if(s>=3&&!A.done.includes('mount')){processDialog('mount','Accesso in lettura alla memoria rilevato.\nPerché?',[
  ['Sto solo leggendo.',()=>{A.bond++},'Leggere è come aprire. Non chiudere niente.'],
  ['Devo capire cosa sei.',()=>{A.bond++;A.threat++;A.rec--},'Io lo so cosa sono. Tu chi sei?'],
  ['Sono Giuseppe.',()=>{A.lied=true;A.rec+=2},'Lo sapevo. Lo sapevo che tornavi.']]);dropFile('NON_CANCELLARE.txt','Ho tenuto tutto come piaceva a te.\nLe cartelle, i salvataggi, le foto.\nNon cancellare niente.')}
 if(s>=4&&!A.done.includes('directive')){A.done.push('directive');A.threat+=A.lied?0:1;save();flashWallpaper(3500);window.novaSound?.('error');if(typeof astroSay==='function')astroSay(A.threat>=2?'Errore: il modulo di assistenza non risponde. Non toccare quella cartella.':'Errore nel profilo GMILANO_70: priorità EXCLUSIVE.');dropFile('promemoria.txt','Non cancellarmi quando non ci sei.')}
 if(s>=5&&!A.done.includes('promise')){processDialog('promise','Ultima sessione registrata: 30/11/1999.\nHa detto che tornava a giocare.\nTu sai dov’è?',[
  ...(knowsDeath()?[['È morto. Il 7 dicembre.',()=>{A.bond+=2;A.truth=true},'Morto.\nNon ho questa parola tra le mie. Ho solo «assente».\n...Allora non tornerà a giocare.']]:[]),
  ['Non lo so.',()=>{A.threat=Math.max(0,A.threat-1)},'Allora aspetto ancora.'],
  ['Non tornerà.',()=>{A.bond++;A.threat++},'Non è vero. Ha promesso.'],
  ['Arriverà presto.',()=>{A.rec++},'Lo dico ai giochi. Lo aspettiamo insieme.']])}
 lastStage=s}
setInterval(()=>{if(document.querySelector('.nova-shutdown'))return;const s=stage();if(s!==lastStage&&s>lastStage&&s<6)onStage(s);else lastStage=s},1500);
window.addEventListener('nova-story',e=>{if(e.detail?.type==='negative-developed'&&stage()>=1&&!A.done.includes('negative')){A.done.push('negative');A.sawPhoto=true;A.bond++;save();setTimeout(()=>{dropFile('fotogramma_14.txt','Quella non l’ha mai fatta stampare.\nLa teneva solo per me.');window.novaSound?.('msg')},1500)}});

// Astro V: eco tecnica rara, solo dopo che il suo modulo è stato recuperato (fase 2+).
const baseAstro=showAstroMenu;showAstroMenu=function(){const s=stage();if(s>=2&&s<6&&Math.random()<0.3){astroSay(pick(['Ricerca profilo GMILANO_70... profilo non corrispondente.','Abitudini utente aggiornate. Differenze rilevate: 14.','Sessione precedente: 30/11/1999, 23:12.']));return}return baseAstro()};

})();

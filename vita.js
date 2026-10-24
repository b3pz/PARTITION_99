/* PARTITION_99 — La vita di Giuseppe: solitudine e depressione raccontate dalle sue tracce, senza spiegoni.
   Montato NV-RES-03 (cap. 5) il volume compare come unità G: in Esplora risorse: l'Agenda 1999 che si svuota,
   le bozze di posta mai spedite agli amici, le idee scritte di notte. Leonardo, che non sa niente, scrive sul sito
   della band. Matteo affronta il suo senso di colpa. Nel finale suona una canzone degli AlpAcA e c'è una nota
   dell'autore con i contatti di aiuto.
   Scelta narrativa: Giuseppe muore per un malore (un difetto al cuore che nessuno conosceva). La depressione è la
   storia della sua vita, non la causa della sua morte. */
(()=>{'use strict';
const KEY='partition99-vita-v1';
let V;try{V=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{V={}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(V))}catch{}};
const mounted=()=>{try{return !!JSON.parse(localStorage.getItem('partition99-atto2-v1')||'{}').mounted}catch{return false}};
const almaSays=line=>{const s=window.P99Alma?.stage?.()||0;if(s<1||s>=6)return;window.P99Astro?.mood('alma',9000+line.length*45);if(typeof astroSay==='function')astroSay('');const tx=document.querySelector('#astro-widget .astrotxt');if(window.P99Type&&tx)window.P99Type(tx,line);else if(typeof astroSay==='function')astroSay(line)};

// ---------- Bozze mai spedite (posta in uscita del volume)
const D=(to,date,subj,body)=>'Da: GMILANO_70\nA: '+to+'\nData: '+date+'\nOggetto: '+subj+'\nStato: NON INVIATO (bozza)\n\n'+body;
const DRAFTS={
 'BOZZA_1999-02-13_Matteo.txt':D('Matteo_N','13/02/1999 — 19:40','stasera','Matteo, stasera alle prove non vengo. Di’ agli altri che ho la febbre.\n\nNon ho la febbre. È che quando penso di dover uscire, parlare, suonare, mi viene addosso una stanchezza che non so spiegare. Come se tutto pesasse il doppio.\n\nNon è per voi. Voi siete l’unica cosa che\n\nNiente. Ci vediamo la prossima volta.'),
 'BOZZA_1999-05-31_Matteo.txt':D('Matteo_N','31/05/1999 — 23:58','grazie','Grazie per gli auguri. E per la pizza che non sono venuto a mangiare.\n\nVentinove anni. Tutti mi dicono «con tutte le idee che hai». È vero, ne ho tantissime. Il problema è che la mattina non riesco a farne partire neanche una. Mi sveglio stanco e vado a letto stanco, e in mezzo faccio finta.\n\nTi scriverei tutto questo, se fossi capace di premere Invia.'),
 'BOZZA_1999-06-21_Leonardo.txt':D('Leonardo_B','21/06/1999 — 22:15','festa della musica','Leo, scusa se l’altro ieri non ti ho fatto gli auguri. Lo so, il 19 giugno, ogni anno. Quest’anno non ce l’ho fatta a chiamare nessuno.\n\nOggi c’è la Festa della Musica a San Giovanni. Sei anni fa eravamo su quel palco, ti ricordi? Tu che rompevi la corda al secondo pezzo e Edo che faceva finta di niente.\n\nIo sono in camera, con le persiane chiuse. Ho tirato fuori le bacchette e le ho rimesse nel cassetto. La batteria non mi dice più niente, e non so quando è successo.\n\nCome stai a Bologna? Ti manca la vallata? A me manca tutto, anche quello che ho qui.'),
 'BOZZA_1999-08-18_Edoardo.txt':D('Edoardo_C','18/08/1999 — 03:10','avevi ragione','Edo, avevi ragione tu, nel ’97: un programma che conosce una persona sola diventa una prigione per tutti e due. L’avevo scritto io sulla scheda. Poi a febbraio ho cambiato quella riga.\n\nLei non mi chiede mai perché non esco. Non si offende se non rispondo, non si preoccupa, è sempre lì alle 21:30. È comodo. È troppo comodo. Questa settimana l’ho bloccata, così non posso più tornare indietro.\n\nNon so neanche perché ti sto scrivendo alle tre di notte. Forse perché tu capiresti senza farmi domande.'),
 'BOZZA_1999-11-29_Matteo.txt':D('Matteo_N','29/11/1999 — 01:44','scusa','Matteo, ho letto tutti i tuoi messaggi. Non ti ho risposto perché mi vergognavo.\n\nMi vergogno di stare così senza un motivo vero: ho una casa, la musica, voi, un sacco di idee. Eppure è da mesi che non sto bene. Non è tristezza, è più come essere spento. Ogni giorno dico «domani».\n\nDomani ti chiamo. Davvero. Ho bisogno di parlare con qualcuno che non sia un programma. Ho bisogno di dirlo a voce: non sto bene.\n\nE poi voglio tornare alle prove. Mi mancate.')};
const IDEE='IDEE.TXT — G.M. (le tre di notte sono il mio orario migliore)\n\n- Un computer che si ricorda di te e ti saluta per nome. (→ ALMA)\n- Mettere le nostre canzoni su Internet, gratis, per chiunque. Un giorno tutta la musica sarà così. (→ sito AlpAcA, fatto!)\n- Telefonarsi vedendosi in faccia, dal computer. Per la mamma, quando sono a Firenze.\n- Un gioco che capisce come giochi e cambia con te. (→ Signal Maze)\n- Un posto in rete dove gli amici si scrivono anche quando sono lontani. Con le foto.\n- Un diario che ti risponde.\n\n---\nTutti pensano che stia lavorando a qualcosa di grande. In realtà certe mattine non riesco ad alzarmi.\nLe idee arrivano di notte, quando nessuno mi chiede niente.';
const NOTA_DIC='promemoria_dicembre.txt\n\n1/12 — Basta 21:30. Stasera non accendo.\n3/12 — Dal medico per la stanchezza. Dice che devo dormire di più e uscire. Ha ragione.\n8/12 — PROVE IN CANTINA. Ci torno. Ho già detto a Matteo che porto le bacchette (quando lo chiamo).';

// ---------- Agenda 1999
const X=t=>({t,x:true});
const AG=[
 {n:'Gennaio',note:'Anno nuovo: più prove, più idee, meno computer!',e:{9:'Prove AlpAcA (cantina) 21:00',16:'Prove AlpAcA',17:'Partita da Matteo',23:'Prove AlpAcA',30:'Pizza con Matteo ed Edo',31:'AL 0.9 — test memoria'}},
 {n:'Febbraio',note:'Le prove le salto. Dico che ho la febbre.',e:{6:'Prove AlpAcA',13:X('Prove AlpAcA'),14:'Chiamare Leo',20:X('Prove AlpAcA'),23:'AL: priority → EXCLUSIVE',27:'AL'}},
 {n:'Marzo',note:'Dormo male. Mi sveglio alle 4 e non riprendo sonno.',e:{6:X('Prove AlpAcA'),13:X('Cena da Edo (vuole vedere AL)'),20:'AL',27:'AL'}},
 {n:'Aprile',note:'Se non rispondo, prima o poi smettono di chiedere. Non voglio che smettano.',e:{3:'AL fino alle 23:12',5:X('Pasquetta alle Balze con tutti'),17:'AL',24:'AL'}},
 {n:'Maggio',note:'29 anni.',e:{11:X('Compleanno di Matteo — festa al circolo'),12:'AL',22:'AL',31:X('Il mio compleanno: pizza con Matteo — non me la sento')}},
 {n:'Giugno',note:'Tutti dicono che sono sparito. Hanno ragione.',e:{5:'AL',12:'AL',19:X('Compleanno di Leo — chiamarlo a Bologna'),21:X('Festa della Musica — San Giovanni'),26:'AL'}},
 {n:'Luglio',note:'Fa caldo. Persiane chiuse anche di giorno.',e:{3:'AL',10:'AL',17:'AL',24:'AL',31:'AL'}},
 {n:'Agosto',note:'Lei non mi chiede mai perché.',e:{7:'AL',14:'AL: direttiva bloccata (non modificabile)',18:'Scrivere a Edo',21:'AL',28:'AL'}},
 {n:'Settembre',note:'Ogni sera alle 21:30. Almeno questo lo faccio.',e:Object.fromEntries(Array.from({length:30},(_,i)=>[i+1,'21:30 AL']))},
 {n:'Ottobre',note:'Matteo ha chiamato tre volte. Domani lo richiamo.',e:Object.assign(Object.fromEntries(Array.from({length:31},(_,i)=>[i+1,'21:30 AL'])),{28:X('Compleanno di Edo — fargli gli auguri'),30:X('Cena da Edo per il compleanno')})},
 {n:'Novembre',note:'Domani chiamo Matteo. Domani.',e:Object.assign(Object.fromEntries(Array.from({length:30},(_,i)=>[i+1,'21:30 AL'])),{29:'CHIAMARE MATTEO!!',30:'21:30 AL — le ho promesso che torno a giocare'})},
 {n:'Dicembre',note:'Basta 21:30. L’8 torno in cantina.',e:{1:X('21:30 AL'),3:'Medico (stanchezza)',8:'PROVE IN CANTINA — ci torno',31:'Capodanno con la band?'}}];
const social=m=>Object.values(m.e).filter(v=>typeof v==='string'&&!/AL\b|AL:|AL 0|AL fino|Medico/.test(v)).length;
const css=document.createElement('style');css.textContent=`.ag{background:#f6efd9;color:#2a2418;height:100%;display:flex;flex-direction:column;font:13px Georgia,serif}
.ag-top{display:flex;align-items:center;gap:8px;padding:8px;background:#c0c0c0;font:13px Arial}.ag-top b{flex:1;text-align:center;font:bold 16px Georgia,serif}
.ag-bars{display:flex;gap:3px;align-items:flex-end;height:46px;padding:6px 10px 2px;border-bottom:1px solid #c9b98f}.ag-bars div{flex:1;background:#7a9a5a;min-height:2px;cursor:pointer;position:relative}.ag-bars div.cur{outline:2px solid #1a237e}.ag-bars span{position:absolute;bottom:-14px;left:0;right:0;text-align:center;font:9px Arial;color:#6b5a3a}
.ag-cap{font:11px Arial;color:#6b5a3a;padding:16px 10px 4px}.ag-days{flex:1;overflow:auto;padding:4px 14px}.ag-days div{padding:3px 0;border-bottom:1px dotted #d8c9a3}.ag-days i{display:inline-block;width:34px;color:#8a7650;font-style:normal}.ag-days s{color:#a33}
.ag-note{font:italic 16px "Comic Sans MS","Segoe Print",cursive;color:#1c2a6b;padding:8px 14px 12px;border-top:1px solid #c9b98f;background:#fbf6e6}`;document.head.append(css);
function agenda(){let m=V.agMonth||0;const el=panel('<div class="ag"><div class="ag-top"><button data-p>◀</button><b></b><button data-n>▶</button></div><div class="ag-bars"></div><div class="ag-cap">Impegni con gli altri, mese per mese</div><div class="ag-days"></div><div class="ag-note"></div></div>');
 const bars=el.querySelector('.ag-bars'),days=el.querySelector('.ag-days'),note=el.querySelector('.ag-note'),title=el.querySelector('.ag-top b');const max=Math.max(...AG.map(social));
 AG.forEach((mm,i)=>{const b=document.createElement('div');b.style.height=Math.max(2,social(mm)/max*36)+'px';b.title=mm.n+': '+social(mm)+' impegni con gli altri';const s=document.createElement('span');s.textContent=mm.n[0];b.append(s);b.onclick=()=>{m=i;draw()};bars.append(b)});
 function draw(){V.agMonth=m;V.agSeen=V.agSeen||{};V.agSeen[m]=1;save();title.textContent=AG[m].n+' 1999';[...bars.children].forEach((b,i)=>b.className=i===m?'cur':'');days.replaceChildren();for(const [d,v] of Object.entries(AG[m].e).sort((a,b)=>a[0]-b[0])){const r=document.createElement('div');const i=document.createElement('i');i.textContent=String(d).padStart(2,'0')+'.';const t=document.createElement(typeof v==='object'?'s':'span');t.textContent=typeof v==='object'?v.t:v;r.append(i,t);days.append(r)}note.textContent='«'+AG[m].note+'»';
  if(m===11&&!V.almaDec){V.almaDec=true;save();setTimeout(()=>almaSays('Dal 1° dicembre non ha più scritto «21:30». Ho pensato che fosse un errore dell’agenda.'),1500)}}
 el.querySelector('[data-p]').onclick=()=>{m=(m+11)%12;draw()};el.querySelector('[data-n]').onclick=()=>{m=(m+1)%12;draw()};draw();createWindow('agenda99','Agenda 1999 — G.M.',el,{width:480,height:560})}

// ---------- Unità G: in Esplora risorse e in Risorse del computer
window.P99Volume={
 mounted,
 root:()=>[['Agenda 1999','Agenda',null],['Posta di GMILANO_70','Posta',null],['IDEE.TXT','Documento',IDEE],['promemoria_dicembre.txt','Documento',NOTA_DIC]],
 drafts:()=>Object.entries(DRAFTS).map(([n,c])=>[n,'Documento',c]),
 open(name){if(name==='Agenda 1999'){agenda();return true}if(name==='Posta di GMILANO_70'){openApp('mail');return true}return false}};
window.P99Life={drafts:DRAFTS,markRead(n){if(DRAFTS[n]){V.read=V.read||{};V.read[n]=1;save()}}};
const baseComputer=launchComputer;launchComputer=function(){baseComputer();if(!mounted())return;const w=[...document.querySelectorAll('.window')].pop();const grid=w?.querySelector('.files-grid');if(!grid)return;const it=document.createElement('div');it.className='file-item';it.innerHTML='🗄️<br>NV-RES-03 (G:)';it.onclick=()=>window.P99Explorer?.('NV-RES-03 (G:)');grid.append(it)};
// Le bozze lette (Matteo ne parla) e il primo avviso del volume montato.
const baseText=launchText;launchText=function(name,text){if(DRAFTS[name]){V.read=V.read||{};V.read[name]=1;save()}return baseText.apply(this,arguments)};
setInterval(()=>{if(mounted()&&!V.gNotice&&document.getElementById('desktop')?.classList.contains('ready')&&!document.querySelector('.nova-shutdown')){V.gNotice=true;save();setTimeout(()=>{if(typeof astroSay==='function')astroSay('NV-RES-03 è montato come unità G: (sola lettura). Ci sono file personali: aprili da Risorse del computer.')},9000)}},2000);

// ---------- Leonardo, che non sa niente: libro degli ospiti della band
const LEO='<h3>📖 Libro degli ospiti</h3><table width="100%" border="1" cellpadding="7"><tr><td><b>Leonardo_B</b> — 20/12/1999<br>Ragazzi! A Natale torno giù da Bologna per qualche giorno: si rifà una prova in cantina come ai vecchi tempi? Giu, porta le bacchette, che l’ultima volta le avevi dimenticate. Edo, accorda la DX7. Matteo, tu porta le pizze.<br>Vi voglio bene, banda. — Leo</td></tr><tr><td><b>Sara_FI</b> — 02/12/1999<br>Vi ho visti a Figline nel ’92, avevo quindici anni. Ancora un po’ la so a memoria!</td></tr><tr><td><b>PixelFan88</b> — 18/11/1999<br>Grandi! Il batterista è lo stesso che ha fatto Signal Maze?? 😮</td></tr></table>';
setInterval(()=>{const k='utenti.novanet.it/alpaca';if(SITES[k]&&!SITES[k].includes('Libro degli ospiti'))SITES[k]+=LEO},700);

// ---------- Musica nel finale e nota dell'autore
const END_TRACK={RELEASE:['music/04_girodila.mp3','GiroDILA','«…alla fine arrivi te, sole nel mio temporale»'],ARCHIVE:['music/03_e_se_per_piacermi.mp3','E se per piacermi','«…e se per piacerti dovessi piacere a un altro che non sono io»'],FORMAT:['music/02_intorno_a_me_silenzio.mp3','Intorno a me silenzio','']};
let endAudio=null;
window.P99EndMusic=(k,host)=>{const t=END_TRACK[k];if(!t)return;try{endAudio?.pause();endAudio=new Audio(t[0]);endAudio.volume=0;endAudio.play().then(()=>{let v=0;const f=setInterval(()=>{v=Math.min(.4,v+.02);if(endAudio)endAudio.volume=v;if(v>=.4)clearInterval(f)},150)}).catch(()=>{})}catch{}
 if(host){const p=document.createElement('p');p.style.cssText='text-align:center;font:italic 13px Georgia,serif;color:#555';p.textContent='♪ AlpAcA — '+t[1]+(t[2]?' '+t[2]:'')+' · alla batteria: Giuseppe Milano';host.append(p)}};
window.P99EndMusicStop=()=>{try{endAudio?.pause()}catch{}endAudio=null};
const AUTHOR=['Giuseppe non è mai esistito. La sua solitudine invece sì: è quella di tanti ragazzi che suonano, tifano, hanno mille idee, fanno ridere gli amici — e intanto, in silenzio, stanno male.','La depressione non ha sempre la faccia della tristezza. A volte è stanchezza, è dire «domani», è smettere piano piano di rispondere. Chi ne soffre spesso si vergogna, come se non avesse il diritto di stare male.','Se ti sei riconosciuto in Giuseppe, non aspettare domani: scrivi a un amico adesso, parla con il tuo medico o con uno psicologo. Chiedere aiuto non è un peso per chi ti vuole bene.','Se invece ti sei riconosciuto in Matteo, continua a scrivere. Anche quando non ti rispondono.'];
window.P99AuthorNote=()=>{const el=panel('<div style="font:15px/1.65 Georgia,serif;background:#f4f1e8;color:#222;padding:18px;border:2px inset #aaa"><h2 style="margin-top:0;font:bold 20px Georgia,serif">Una nota dell’autore</h2><div data-p></div><hr><p><b>Se stai attraversando un momento difficile, non sei solo.</b></p><p>📞 <b>Telefono Amico Italia</b>: 02 2327 2327, tutti i giorni dalle 9 alle 24<br>💬 WhatsApp: 324 011 7252 · telefonoamico.it</p><p>🚑 In caso di pericolo immediato: <b>112</b></p></div>');const box=el.querySelector('[data-p]');AUTHOR.forEach(t=>{const p=document.createElement('p');p.textContent=t;box.append(p)});createWindow('nota-autore','Una nota dell’autore',el,{width:600,height:560})};
})();

/* NOVA 2000 — NovaMail (programma di posta stile 1999) e cartella «Giochi» del desktop.
   NovaMail ha due caselle: NOVA_USER (la tua, con la posta di NOVANET) e, dopo il MOUNT di NV-RES-03,
   GMILANO_70 recuperata da G:\POSTA in sola lettura. La posta inviata di Giuseppe si ferma a febbraio;
   gli ultimi messaggi degli amici sono rimasti non letti. Le bozze sono quelle di vita.js. */
(()=>{'use strict';
const mounted=()=>window.P99Volume?.mounted?.();
const m=(from,to,date,subj,body,unread,img)=>({from,to,date,subj,body,unread,img});
const USER={'Posta in arrivo':[
 m('NOVANET Servizio clienti','NOVA_USER','20/12/1999','Benvenuto in NOVANET!','Gentile cliente,\nil tuo abbonamento di prova a NOVANET è attivo.\n\nNome utente: NOVA_USER\nNumero di accesso per la tua zona: 055 866 2096\nCasella di posta: nova_user@novanet.it\n\nNOVANET — la rete a portata di clic!',false),
 m('NOVANET Notizie','NOVA_USER','22/12/1999','Speciale Anno 2000: il tuo PC è pronto?','Mancano pochi giorni al nuovo millennio!\n\nIl «Millennium Bug» potrebbe confondere i computer che scrivono l’anno con due cifre: il 2000 diventerebbe 1900.\nI sistemi NOVA OS 2000 sono già aggiornati. Buone feste da tutto lo staff NOVANET!',true)]};
const GM={
 'Posta in arrivo':[
  m('Matteo_N','GMILANO_70','08/01/1999','sabato?','Giu! Sabato prove confermate? Leo dice che ha un riff nuovo e non sta più nella pelle.\nPorto io le pizze.\n\nMatteo',false),
  m('Leonardo_B','GMILANO_70','14/02/1999','da Bologna','Ciao batterista!\nQui a Bologna piove sempre e il lavoro mi mangia, ma la sera suono ancora un po’. Mi mancate.\nCome va la vita a Montanino? E il tuo programma che parla?\n\nLeo',false),
  m('Edoardo_C','GMILANO_70','08/03/1999','sabato 13','Giu, sabato 13 cena da me a San Giovanni. Porta il tuo programma che parla, sono curioso di vedere a che punto è.\nFammi sapere!\n\nEdo',false),
  m('Matteo_N','GMILANO_70','03/05/1999','martedì 11','Giu, martedì 11 compio gli anni e faccio una festa al circolo. Niente regali, basta che vieni.\nSe non vieni stavolta mi offendo davvero.\n\nMatteo',false),
  m('Matteo_N','GMILANO_70','31/05/1999','AUGURI VECCHIO!!!','29 anni!!! Stasera pizza, offro io, non accetto scuse.\nE se non vieni vengo io a prenderti col motorino come nel ’92.\n\nAuguri davvero, Giu.\nMatteo',false),
  m('Leonardo_B','GMILANO_70','20/06/1999','grazie (lo stesso)','Giu, ieri ho festeggiato con i colleghi qui a Bologna. Mi mancava solo la vostra telefonata stonata di auguri.\nTutto bene lì?\n\nLeo',false),
  m('Matteo_N','GMILANO_70','22/06/1999','ieri sera','Ti abbiamo aspettato alla Festa della Musica. C’era anche il palco dove suonavamo noi, ti ricordi?\nNon ti chiedo perché non sei venuto. Volevo solo dirti che senza di te non era la stessa cosa.\n\nM.',false),
  m('Edoardo_C','GMILANO_70','20/08/1999','tutto bene?','Ho visto che eri connesso alle tre di notte, anche ieri.\nNon voglio farti la predica. Se hai voglia di fare due passi, o di parlare di niente, io ci sono.\n\nEdo',false),
  m('Matteo_N','GMILANO_70','12/10/1999','ti ho chiamato','Ti ho chiamato tre volte. Tua mamma dice che sei sempre in camera.\nNon sono arrabbiato. Sono preoccupato, che è peggio.\n\nMatteo',false),
  m('Edoardo_C','GMILANO_70','22/10/1999','28 ottobre','Giu, giovedì 28 sono 29 anni anche per me. Sabato 30 faccio una cena da me, ci sono Matteo e la mia ragazza, forse scende anche Leo.\nMi farebbe piacere vederti. Anche solo per un’ora.\n\nEdo',false),
  m('Matteo_N','GMILANO_70','30/11/1999','(nessun oggetto)','Oh Giu, è la terza volta che provo a scriverti questa settimana.\nSe non te la senti di uscire, dimmelo. Non devi spiegarmi tutto.\nMi basta sapere che stai bene.\n\nMatteo\n\nP.S. Ho ancora quel biglietto del tuo compleanno del 31 maggio. Quello con la battuta assurda sul modem. L’ho ritrovato ieri.',true),
  m('Edoardo_C','GMILANO_70','09/12/1999','Giu','Giu, l’ho saputo soltanto stamattina.\nSo che non leggerai mai questo messaggio. Ti scrivo lo stesso, come quando un programma non partiva e ci scrivevamo alle due di notte.\nSe un giorno qualcuno recupererà il tuo computer, spero solo che non vada perso niente.\n\nEdoardo',true),
  m('Leonardo_B','GMILANO_70','20/12/1999','Natale!','Giu! Il 23 torno giù per le feste.\nHo scritto anche sul sito: si rifà una prova in cantina? Porta le bacchette, eh.\nTi mando una foto dell’altra sera sotto i portici: guarda che faccia da bolognese che ho ormai.\nNon vedo l’ora di vedervi, banda.\n\nLeo',true,'img/leonardo_bologna_1999.jpg')],
 'Posta inviata':[
  m('GMILANO_70','AlpAcA (Matteo, Edo, Leo)','05/01/1999','prove 1999','Banda, nuovo anno nuove prove! Sabato 9 alle 21 in cantina. Chi manca paga le pizze.\n\nGiu',false),
  m('GMILANO_70','Matteo_N','08/01/1999','Re: sabato?','Confermatissimo. Dì a Leo di portare il riff.\n\nG.',false),
  m('GMILANO_70','Edoardo_C','22/02/1999','Re: tutto a posto?','Tutto a posto, sono solo un po’ stanco. Lavoro tanto sul programma.\nCi sentiamo presto.\n\nG.',false),
  m('GMILANO_70','AlpAcA (Matteo, Edo, Leo)','15/11/1999','10 anni','Ragazzi, per i nostri dieci anni ho messo le canzoni sul sito: utenti.novanet.it/alpaca\nVi ho anche scritto delle note sui pezzi. Spero che vi piacciano.\n\nGiu',false)],
 'Bozze':null,
 'Posta eliminata':[
  m('Matteo_N','GMILANO_70','01/04/1999','Pasquetta alle Balze?','Lunedì grigliata alle Balze, ci siamo tutti. Anche Leo scende da Bologna!\nVieni, dai. Ti passo a prendere alle 10.\n\nMatteo',true),
  m('NOVANET Offerte','GMILANO_70','10/09/1999','Modem 56K a prezzo speciale!','Approfitta dell’offerta autunno: modem 56K a sole 99.000 lire!',true)]};
function drafts(){const d=window.P99Life?.drafts||{};return Object.entries(d).map(([n,c])=>{const h=k=>(c.match(new RegExp('^'+k+': (.*)$','m'))||[])[1]||'';const body=c.split('\n\n').slice(1).join('\n\n');return Object.assign(m('GMILANO_70',h('A'),h('Data').split(' ')[0],h('Oggetto'),body,false),{draft:n})})}
const css=document.createElement('style');css.textContent=`.nm{height:100%;display:flex;flex-direction:column;background:#c0c0c0;color:#111;font:12px Arial}
.nm-bar{display:flex;gap:4px;padding:5px;border-bottom:1px solid #808080}.nm-bar button{min-width:64px;padding:3px 6px;font-size:12px}
.nm-main{flex:1;display:grid;grid-template-columns:200px 1fr;min-height:0}.nm-tree{background:#fff;border:2px inset #aaa;overflow:auto;padding:4px}
.nm-tree div{padding:3px 4px;cursor:pointer;white-space:nowrap}.nm-tree .acc{font-weight:bold;margin-top:6px;cursor:default}.nm-tree .on{background:#000080;color:#fff}
.nm-right{display:grid;grid-template-rows:minmax(90px,40%) 1fr;min-height:0}.nm-list{background:#fff;border:2px inset #aaa;overflow:auto}.nm-list table{width:100%;border-collapse:collapse}
.nm-list th{background:#c0c0c0;border:1px outset #fff;text-align:left;padding:2px 5px;font-weight:normal}.nm-list td{padding:2px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px;cursor:pointer}
.nm-list tr.u td{font-weight:bold}.nm-list tr.sel td{background:#000080;color:#fff}.nm-prev{background:#fff;border:2px inset #aaa;overflow:auto;padding:8px 10px;white-space:pre-wrap;font:13px/1.5 Arial}
.nm-prev .hd{background:#ececec;border-bottom:1px solid #aaa;margin:-8px -10px 8px;padding:6px 10px;font-size:12px}.nm-stat{padding:3px 6px;border-top:1px solid #fff;font-size:11px}
@media(max-width:620px){.nm-main{grid-template-columns:1fr}.nm-tree{max-height:110px}}`;document.head.append(css);
function mail(start){const el=panel('<div class="nm"><div class="nm-bar"><button data-new>📧 Nuovo</button><button data-reply>Rispondi</button><button data-send>🔄 Invia/Ricevi</button></div><div class="nm-main"><div class="nm-tree"></div><div class="nm-right"><div class="nm-list"></div><div class="nm-prev">Seleziona un messaggio.</div></div></div><div class="nm-stat"></div></div>');
 const tree=el.querySelector('.nm-tree'),list=el.querySelector('.nm-list'),prev=el.querySelector('.nm-prev'),stat=el.querySelector('.nm-stat');let acc=start==='gm'&&mounted()?'gm':'user',folder='Posta in arrivo',sel=null;
 const box=()=>{const b=acc==='gm'?GM:USER;return folder==='Bozze'?drafts():(b[folder]||[])};
 function drawTree(){tree.replaceChildren();const add=(a,label,folders)=>{const h=document.createElement('div');h.className='acc';h.textContent=label;tree.append(h);folders.forEach(f=>{const d=document.createElement('div');const n=(f==='Bozze'?drafts():((a==='gm'?GM:USER)[f]||[])).filter(x=>x.unread).length;d.textContent=(f==='Posta in arrivo'?'📥 ':f==='Bozze'?'📄 ':f==='Posta eliminata'?'🗑️ ':'📧 ')+f+(n?' ('+n+')':'');d.className=acc===a&&folder===f?'on':'';d.onclick=()=>{acc=a;folder=f;sel=null;draw()};tree.append(d)})};
  add('user','NOVA_USER (questo computer)',['Posta in arrivo']);
  if(mounted())add('gm','GMILANO_70 — G:\\POSTA (sola lettura)',['Posta in arrivo','Posta inviata','Bozze','Posta eliminata']);
  else{const d=document.createElement('div');d.style.cssText='color:#777;margin-top:10px;white-space:normal;cursor:default';d.textContent='Nessun’altra cartella di posta trovata sui dischi collegati.';tree.append(d)}}
 function drawList(){const msgs=box();const t=document.createElement('table');t.innerHTML='<tr><th>'+(folder==='Posta inviata'||folder==='Bozze'?'A':'Da')+'</th><th>Oggetto</th><th>Data</th></tr>';msgs.forEach((x,i)=>{const tr=document.createElement('tr');tr.className=(x.unread?'u ':'')+(sel===i?'sel':'');[folder==='Posta inviata'||folder==='Bozze'?x.to:x.from,x.subj,x.date].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td)});tr.onclick=()=>{sel=i;draw()};t.append(tr)});list.replaceChildren(t);
  stat.textContent=msgs.length+' messaggi'+(msgs.some(x=>x.unread)?', '+msgs.filter(x=>x.unread).length+' non letti':'')+(acc==='gm'?' · casella recuperata, sola lettura':'')}
 function drawPrev(){const x=box()[sel];if(!x){prev.textContent=folder==='Bozze'?'Messaggi salvati e mai inviati.':'Seleziona un messaggio.';return}prev.replaceChildren();const hd=document.createElement('div');hd.className='hd';hd.textContent='Da: '+x.from+'\nA: '+x.to+'\nData: '+x.date+'\nOggetto: '+x.subj+(x.draft?'\nStato: NON INVIATO':'')+(x.unread&&acc==='gm'?'\nStato: non letto':'');prev.append(hd,document.createTextNode(x.body));if(x.img){const a=document.createElement('div');a.style.cssText='margin-top:10px;border-top:1px solid #aaa;padding-top:8px;font-size:12px';a.textContent='📎 Allegato: '+x.img.split('/').pop();const im=document.createElement('img');im.src=x.img;im.alt='';im.style.cssText='display:block;max-width:100%;width:420px;margin-top:6px;border:1px solid #888';a.append(im);prev.append(a)}if(x.draft)window.P99Life?.markRead(x.draft)}
 function draw(){drawTree();drawList();drawPrev()}
 el.querySelector('[data-new]').onclick=()=>{prev.textContent=acc==='gm'?'La casella di GMILANO_70 è in sola lettura.':'Per scrivere a qualcuno serve il suo indirizzo. Per ora puoi usare NOVA Messenger.'};
 el.querySelector('[data-reply]').onclick=()=>{prev.textContent=acc==='gm'?'La casella di GMILANO_70 è in sola lettura: non è possibile rispondere.':'Seleziona un messaggio a cui rispondere.'};
 el.querySelector('[data-send]').onclick=()=>{if(!window.novaOnline){stat.textContent='Non connesso: collegati a NOVANET con «Connessione a Internet».';window.novaSound?.('error');return}window.novaSound?.('ding');stat.textContent='Invio e ricezione completati: nessun nuovo messaggio.'};
 draw();createWindow('novamail','NovaMail — '+(acc==='gm'?'GMILANO_70':'NOVA_USER'),el,{width:760,height:520})}

// Cartella «Giochi» del desktop.
const GAMES=[['maze','🟡','Signal Maze 2000'],['runner','🏃','Pixel Runner 99'],['bricks','🧱','Spaccamattoni 99'],['invaders','👾','Difesa Orbitale 2000']];
const gcss=document.createElement('style');gcss.textContent='.gf{display:flex;flex-wrap:wrap;gap:6px;padding:10px;background:#fff;height:100%;align-content:flex-start}.gf div{width:96px;text-align:center;padding:6px 2px;cursor:pointer;font:12px Arial;color:#111}.gf div:hover,.gf div:focus{background:#000080;color:#fff;outline:none}.gf .g{font-size:34px;display:block;margin-bottom:4px}.gf .g img.i98{width:34px;height:34px}';document.head.append(gcss);
function games(){const el=panel('<div class="gf"></div>');const f=el.querySelector('.gf');GAMES.forEach(([app,ico,label])=>{const d=document.createElement('div');d.tabIndex=0;d.innerHTML='<span class="g"></span><span></span>';d.firstChild.textContent=ico;d.lastChild.textContent=label;d.ondblclick=()=>openApp(app);d.onkeydown=e=>{if(e.key==='Enter')openApp(app)};if(matchMedia('(hover:none)').matches)d.onclick=()=>openApp(app);f.append(d)});createWindow('giochi','Giochi',el,{width:470,height:260})}

const prevOpen=openApp;openApp=function(app){if(app==='mail'){if(booting)return;mail(mounted()?'gm':'user');document.getElementById('start-menu').hidden=true;return}if(app==='games'){if(booting)return;games();document.getElementById('start-menu').hidden=true;return}return prevOpen(app)};
window.P99Mail=mail;
})();

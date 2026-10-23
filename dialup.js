/* NOVA 2000 — Accesso remoto: il computer non è connesso finché il giocatore non compone il numero di NOVANET.
   Dal 19/06/1998 in Italia il prefisso fa parte del numero anche per le chiamate urbane. */
(()=>{'use strict';
const NUMBER='0558662096',PRETTY='055 866 2096',KIT='NOVANET_abbonamento.txt';
window.novaOnline=false;
// Nota del laboratorio che ha sistemato il PC, da trovare esplorando Documenti: primi passi e numero di NOVANET.
const WELCOME='LEGGIMI_PRIMA.txt';
delete gameState.files[KIT];
gameState.files[WELCOME]='Ciao!\nti scrivo due righe prima di riconsegnarti il computer, così non impazzisci.\n\nIl PC l’ho pulito, provato e ho rimesso a nuovo il sistema (NOVA OS 2000). È usato, ma va che è una meraviglia.\n\nPER ANDARE SU INTERNET\nIl modem è già installato, manca solo il numero da chiamare.\n1. Fai doppio clic sull’icona «Connessione a Internet» (quella col telefono).\n2. Nel campo «Numero di telefono» scrivi il numero di NOVANET. Credo che il tuo sia '+PRETTY+': è quello per la zona di Reggello, in base all’indirizzo che mi hai lasciato. Il prefisso 055 mettilo sempre, ormai è obbligatorio anche in città.\n   Nome utente e password sono già inseriti (li ho presi dal foglio dell’abbonamento di prova). Se per sbaglio li cancelli: nome utente NOVA_USER, password nova1999.\n3. Premi Connetti. Sentirai fischi e gracchii: è normale, è il modem che parla con l’altro modem!\n4. Quando in basso, vicino all’orologio, compare l’iconcina dei computer, sei collegato.\nRicordati di staccarti quando hai finito (clicca quell’iconcina), sennò la bolletta del telefono piange.\n\nQUALCHE CONSIGLIO\n- Per vedere i siti apri NavigaNova. Se non sai l’indirizzo, cerca su Goolarno.\n- NOVA Messenger serve per chattare, ma devi essere collegato.\n- Quello che scrivi lo trovi in Documenti. Quello che scarichi da Internet o che ti mandano in chat finisce in Download.\n- Nella scatola del computer c’era anche un CD con una raccolta di giochini (RG-98): te li ho reinstallati, sono Signal Maze, Pixel Runner, Spaccamattoni e Difesa Orbitale.\n- Non spegnere mai dal pulsante del case: usa START > Spegni il computer.\n\nUNA COSA TECNICA (puoi anche ignorarla)\nHo reinstallato solo il disco C: da 7 GB. Il disco però è da 10 GB e gli altri 3 GB risultano «non assegnati»: era già così quando è arrivato. Se un giorno ti serve spazio fammelo sapere, ma non formattare niente da solo!\n\nBuon Natale e buon 2000!\nMarco — Laboratorio PC, San Giovanni Valdarno';saveGame();
// Icona di connessione nella barra, accanto all'orologio.
const tray=document.createElement('button');tray.className='bevel';tray.hidden=true;tray.style.cssText='height:28px;min-width:32px;margin-right:4px;padding:0 4px;font-size:16px;background:#c0c0c0;border:0';tray.textContent='🖧';tray.title='Connesso a NOVANET a 56.000 bps — tocca per disconnettere';
document.getElementById('clock')?.before(tray);
tray.onclick=()=>{setOnline(false);window.novaSound?.('click');notify('Disconnesso da NOVANET.')};
function notify(t){if(typeof astroSay==='function')astroSay(t)}
function setOnline(on){window.novaOnline=on;tray.hidden=!on;window.dispatchEvent(new Event(on?'nova-online':'nova-offline'))}

function dialer(){
 if(window.novaOnline){const el=panel('<h2 class="program-title">📞 Connessione a NOVANET</h2><div class="nova-inset">Connesso a NOVANET a 56.000 bps.</div><p><button data-hang>Disconnetti</button></p>');el.querySelector('[data-hang]').onclick=()=>{setOnline(false);w.querySelector('[data-action="close"]').click()};const w=createWindow('dialup','Connessione a NOVANET',el,{width:420,height:240});return}
 const el=panel(`<h2 class="program-title">📞 Connessione a NOVANET</h2><div style="display:grid;grid-template-columns:auto 1fr;gap:8px 10px;align-items:center"><label for="du-user">Nome utente:</label><input id="du-user" value="NOVA_USER"><label for="du-pass">Password:</label><input id="du-pass" type="password" value="nova1999"><label for="du-num">Numero di telefono:</label><input id="du-num" inputmode="tel" placeholder="es. 055 ..." autocomplete="off"></div><p class="note">Inserire il numero di accesso fornito dal provider.</p><p><button data-dial>Connetti</button> <button data-cancel>Annulla</button></p><div class="nova-inset" data-status style="min-height:64px;white-space:pre-line">Non connesso.</div>`);
 const w=createWindow('dialup','Connessione a NOVANET',el,{width:470,height:410});
 const num=el.querySelector('#du-num'),status=el.querySelector('[data-status]'),dial=el.querySelector('[data-dial]');let busy=false;
 el.querySelector('[data-cancel]').onclick=()=>{busy=false;w.querySelector('[data-action="close"]').click()};
 num.addEventListener('keydown',e=>{if(e.key==='Enter')dial.click()});
 dial.onclick=async()=>{if(busy)return;const digits=num.value.replace(/\D/g,'');if(!digits){status.textContent='Digitare il numero di telefono da comporre.';num.focus();return}
  busy=true;dial.disabled=true;status.textContent='Inizializzazione del modem...';await sleep(500);window.novaSound?.('dialtone');await sleep(950);
  status.textContent='Composizione in corso: '+num.value.trim();for(const d of digits){if(!busy||!w.isConnected)return;window.novaSound?.('dtmf'+d);await sleep(120)}
  await sleep(500);
  if(digits!==NUMBER){if(digits===NUMBER.slice(3)){window.novaSound?.('busy');status.textContent='«Il numero selezionato è inesistente.»\nDal giugno 1998 il prefisso va sempre composto, anche per le chiamate urbane.'}else{window.novaSound?.('busy');status.textContent='Nessuna risposta dal modem remoto.\nVerificare il numero e riprovare.'}busy=false;dial.disabled=false;return}
  window.novaSound?.('ring');status.textContent='Chiamata in corso...';await sleep(2700);
  window.novaSound?.('handshake');status.textContent='Negoziazione con il modem remoto...';await sleep(4600);
  status.textContent='Verifica di nome utente e password...';await sleep(2200);if(el.querySelector('#du-user').value.trim().toUpperCase()!=='NOVA_USER'||el.querySelector('#du-pass').value!=='nova1999'){window.novaSound?.('error');status.textContent='Nome utente o password non validi.\nIl server NOVANET ha chiuso la connessione.';busy=false;dial.disabled=false;return}
  status.textContent='Registrazione in rete...';await sleep(900);
  if(!w.isConnected)return;setOnline(true);window.novaSound?.('ding');status.textContent='Connesso a 56.000 bps.';notify('Connesso a NOVANET! Ora puoi navigare e usare NOVA Messenger.');
  await sleep(1300);if(w.isConnected)w.querySelector('[data-action="close"]').click()};
 num.focus();
}
const prevOpen=openApp;openApp=function(app){if(app==='dialup'){if(booting)return;dialer();document.getElementById('start-menu').hidden=true;return}return prevOpen(app)};

// NavigaNova senza connessione: pagina d'errore con il pulsante per connettersi.
const baseBrowser=launchBrowser;
launchBrowser=function(){baseBrowser();const w=[...document.querySelectorAll('.window')].pop();const view=w?.querySelector('.web-page');if(!view)return;
 const off=document.createElement('div');off.style.cssText='padding:14px;background:#fff;color:#111;flex:1;overflow:auto';off.innerHTML='<h2>Impossibile visualizzare la pagina</h2><p>Il computer non è connesso a Internet.</p><p>Per visualizzare le pagine Web è necessario collegarsi a NOVANET con il modem.</p><p><button data-dial-now>📞 Connetti a NOVANET…</button></p>';off.querySelector('[data-dial-now]').onclick=()=>openApp('dialup');
 const status=w.querySelector('.browser-status');
 function sync(){const on=window.novaOnline;off.hidden=on;view.hidden=!on;if(!on&&status)status.textContent='Non connesso'}
 view.before(off);sync();
 const onOnline=()=>{if(!w.isConnected){cleanup();return}sync();w.querySelector('[data-nav="home"]')?.click()};const onOffline=()=>{if(!w.isConnected){cleanup();return}sync()};
 function cleanup(){window.removeEventListener('nova-online',onOnline);window.removeEventListener('nova-offline',onOffline)}
 window.addEventListener('nova-online',onOnline);window.addEventListener('nova-offline',onOffline)};

// Al riavvio o allo spegnimento la linea cade.
const baseBoot=boot;boot=function(){if(window.novaOnline)setOnline(false);return baseBoot.apply(this,arguments)};
})();

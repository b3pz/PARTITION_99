/* NOVA 2000 — Il sistema operativo come un vero PC di fine anni '90, divertente da usare anche ignorando la storia.
   Fluidità delle finestre, Cestino, Blocco note, Calcolatrice, Prompt di NOVA-DOS, ScanDisk, Deframmentazione,
   Pannello di controllo e salvaschermo. Nessun programma serve alla trama, ma alcuni la sfiorano. */
(()=>{'use strict';
const KEY='nova2000-os-v1';
let O;try{O=Object.assign({saver:'stelle',wait:5},JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{O={saver:'stelle',wait:5}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(O))}catch{}};
const stage=()=>window.P99Alma?.stage?.()||0;
const mounted=()=>!!window.P99Volume?.mounted?.();
const css=document.createElement('style');css.textContent=`
.window.os-open{animation:osOpen .16s ease-out}@keyframes osOpen{from{transform:scale(.93);opacity:.35}to{transform:none;opacity:1}}
.os-zoom{position:fixed;z-index:20000;border:2px solid #000;outline:1px dotted #fff;pointer-events:none;transition:all .2s linear}
.os-pad{display:flex;flex-direction:column;height:100%;background:#c0c0c0}.os-menu{display:flex;gap:2px;padding:3px;border-bottom:1px solid #808080}.os-menu button{font-size:12px;padding:2px 8px}
.os-pad textarea{flex:1;resize:none;border:2px inset #aaa;font:14px/1.4 "Courier New",monospace;padding:6px;color:#000;background:#fff}.os-stat{font:11px Arial;padding:3px 6px}
.os-list{background:#fff;border:2px inset #aaa;overflow:auto;flex:1;font:13px Arial}.os-list div{padding:4px 8px;cursor:pointer}.os-list div.sel{background:#000080;color:#fff}
.os-calc{padding:8px;background:#c0c0c0;font:13px Arial}.os-calc .disp{background:#fff;border:2px inset #aaa;text-align:right;font:18px "Courier New",monospace;padding:4px 6px;margin-bottom:8px;overflow:hidden}
.os-calc .keys{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.os-calc button{padding:6px 0;font:13px Arial}.os-calc button.r{color:#c00}.os-calc button.b{color:#00c}
.os-dos{background:#000;color:#c0c0c0;font:15px/1.35 "Courier New",monospace;height:100%;overflow:auto;padding:6px;white-space:pre-wrap;cursor:text}.os-dos input{background:#000;color:#c0c0c0;border:0;outline:0;font:inherit;width:70%;caret-color:#c0c0c0}
.os-prog{height:20px;border:2px inset #aaa;background:#fff;margin:8px 0}.os-prog div{height:100%;background:repeating-linear-gradient(90deg,#000080 0 12px,#fff 12px 14px);width:0}
.os-defrag{display:grid;grid-template-columns:repeat(40,1fr);gap:1px;background:#fff;border:2px inset #aaa;padding:3px}.os-defrag i{display:block;height:10px;border:1px solid #fff}
.os-cp{display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:#fff;height:100%;align-content:flex-start}.os-cp div{width:92px;text-align:center;font:12px Arial;cursor:pointer;padding:6px 2px}.os-cp div:hover{background:#000080;color:#fff}.os-cp .ic{font-size:30px;display:block;margin-bottom:4px}.os-cp .ic img.i98{width:32px;height:32px}
.os-form{padding:12px;font:13px Arial;background:#c0c0c0;height:100%;overflow:auto}.os-form fieldset{border:2px groove #fff;margin:0 0 10px;padding:8px}.os-form label{display:block;margin:4px 0}
.os-saver{position:fixed;inset:0;z-index:30000;background:#000;cursor:none}`;document.head.append(css);

// ---------- Fluidità delle finestre
new MutationObserver(ms=>{for(const m of ms)m.addedNodes.forEach(n=>{if(n.classList?.contains('window')){n.classList.add('os-open');setTimeout(()=>n.classList.remove('os-open'),220)}})}).observe(document.getElementById('windows'),{childList:true});
function zoom(a,b){if(!a||!b||!a.width||!b.width)return;const z=document.createElement('div');z.className='os-zoom';const put=r=>{z.style.left=r.left+'px';z.style.top=r.top+'px';z.style.width=r.width+'px';z.style.height=r.height+'px'};put(a);document.body.append(z);requestAnimationFrame(()=>requestAnimationFrame(()=>put(b)));setTimeout(()=>z.remove(),240)}
const taskOf=w=>document.querySelector('.task-button[data-window="'+w.dataset.id+'"]');
document.addEventListener('click',e=>{const b=e.target.closest?.('.window [data-action="min"]');if(b){const w=b.closest('.window');zoom(w.getBoundingClientRect(),taskOf(w)?.getBoundingClientRect())}},true);
document.addEventListener('click',e=>{const t=e.target.closest?.('.task-button');if(!t)return;const w=document.querySelector('.window[data-id="'+t.dataset.window+'"]');if(w&&w.hidden){const from=t.getBoundingClientRect();setTimeout(()=>{if(!w.hidden)zoom(from,w.getBoundingClientRect())},0)}},true);
document.addEventListener('dblclick',e=>{const tb=e.target.closest?.('.titlebar');if(!tb||e.target.closest('.controls'))return;tb.closest('.window')?.querySelector('[data-action="max"]')?.click()});
document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='Escape'){e.preventDefault();document.getElementById('start')?.click()}});

// ---------- Cestino
const trash=()=>gameState.trash||(gameState.trash={});
window.P99Trash={
 del(name){if(!(name in gameState.files))return 'Impossibile eliminare «'+name+'»: file di sola lettura.';
  if(name==='NON_CANCELLARE.txt'&&stage()>=1&&stage()<6){window.P99Astro?.mood('glitch',1500);return 'Impossibile eliminare NON_CANCELLARE.txt: il file è in uso da un altro processo (GM-LAB).'}
  trash()[name]=gameState.files[name];delete gameState.files[name];saveGame();window.novaSound?.('click');icon();return true},
 restore(name){if(!(name in trash()))return;gameState.files[name]=trash()[name];delete trash()[name];saveGame();icon()},
 empty(){gameState.trash={};saveGame();window.novaSound?.('shutdown');icon()}};
function icon(){const g=document.querySelector('.desktop-icon[data-app="trash"] .glyph');if(g)g.style.filter=Object.keys(trash()).length?'':'grayscale(.4) brightness(1.1)'}
setTimeout(icon,500);
function trashWin(){const el=panel('<div class="os-pad"><div class="os-menu"><button data-r>Ripristina</button><button data-e>Svuota Cestino</button></div><div class="os-list"></div><div class="os-stat"></div></div>');const list=el.querySelector('.os-list'),st=el.querySelector('.os-stat');let sel=null;
 function draw(){list.replaceChildren();const ks=Object.keys(trash());ks.forEach(n=>{const d=document.createElement('div');d.textContent='📄 '+n;d.className=n===sel?'sel':'';d.onclick=()=>{sel=n;draw()};d.ondblclick=()=>launchText(n,trash()[n]);list.append(d)});st.textContent=ks.length?ks.length+' oggetti':'Il Cestino è vuoto.'}
 el.querySelector('[data-r]').onclick=()=>{if(sel){P99Trash.restore(sel);st.textContent='Ripristinato in Documenti: '+sel;sel=null;draw()}};
 el.querySelector('[data-e]').onclick=()=>{if(!Object.keys(trash()).length)return;P99Trash.empty();sel=null;draw()};draw();createWindow('cestino','Cestino',el,{width:440,height:340})}

// ---------- Blocco note
function notepad(name='',text=''){const el=panel('<div class="os-pad"><div class="os-menu"><button data-n>Nuovo</button><button data-o>Apri…</button><button data-s>Salva</button><button data-a>Salva con nome…</button></div><textarea spellcheck="false"></textarea><div class="os-stat"></div></div>');const ta=el.querySelector('textarea'),st=el.querySelector('.os-stat');ta.value=text;
 const w=createWindow('notepad',(name||'Senza nome')+' — Blocco note',el,{width:560,height:420});const title=w.querySelector('.window-title');const show=()=>{title.textContent=(name||'Senza nome')+' — Blocco note';const tb=document.querySelector('.task-button[data-window="'+w.dataset.id+'"]');if(tb)tb.textContent=title.textContent;st.textContent=name?'C:\\Documenti\\'+name:'Documento non salvato'};show();
 const saveAs=()=>{const n=prompt98('Salva con nome','Nome del file:',name||'nuovo.txt');n.then(v=>{if(!v)return;v=v.trim();if(!/\.\w+$/.test(v))v+='.txt';name=v;gameState.files[name]=ta.value;saveGame();show();st.textContent='Salvato: C:\\Documenti\\'+name})};
 el.querySelector('[data-n]').onclick=()=>{name='';ta.value='';show()};el.querySelector('[data-s]').onclick=()=>{if(!name)return saveAs();gameState.files[name]=ta.value;saveGame();st.textContent='Salvato: C:\\Documenti\\'+name};el.querySelector('[data-a]').onclick=saveAs;
 el.querySelector('[data-o]').onclick=()=>{const files=Object.keys(gameState.files).sort();const box=panel('<div class="os-pad"><div class="os-list"></div></div>');const l=box.querySelector('.os-list');files.forEach(f=>{const d=document.createElement('div');d.textContent='📄 '+f;d.onclick=()=>{name=f;ta.value=gameState.files[f];show();ow.querySelector('[data-action="close"]').click()};l.append(d)});const ow=createWindow('notepad-open','Apri',box,{width:360,height:320})};
 setTimeout(()=>ta.focus(),50)}
function prompt98(title,label,value){return new Promise(res=>{const o=document.createElement('div');o.className='nova-shutdown';o.innerHTML='<div class="dlg" role="dialog"><div class="ttl"></div><div class="bd"><div style="flex:1"><label><span></span><input style="width:100%;font:14px Arial;padding:3px;border:2px inset #999;background:#fff;color:#111"></label></div></div><div class="btns"><button data-ok>OK</button><button data-no>Annulla</button></div></div>';o.querySelector('.ttl').textContent=title;o.querySelector('label span').textContent=label;const i=o.querySelector('input');i.value=value||'';document.body.append(o);i.focus();i.select();const done=v=>{o.remove();res(v)};o.querySelector('[data-ok]').onclick=()=>done(i.value);o.querySelector('[data-no]').onclick=()=>done(null);i.onkeydown=e=>{if(e.key==='Enter')done(i.value);if(e.key==='Escape')done(null)}})}

// ---------- Calcolatrice
function calc(){const el=panel('<div class="os-calc"><div class="disp">0</div><div class="keys"></div></div>');const disp=el.querySelector('.disp'),keys=el.querySelector('.keys');let cur='0',acc=null,op=null,fresh=true,mem=0;
 const show=()=>disp.textContent=cur.replace('.',',');const num=()=>parseFloat(cur);const fmt=v=>isFinite(v)?String(Math.round(v*1e10)/1e10):'Errore';
 const apply=()=>{if(op===null||acc===null)return num();const b=num();return op==='+'?acc+b:op==='-'?acc-b:op==='*'?acc*b:b===0?NaN:acc/b};
 const K=[['MC','r'],['7'],['8'],['9'],['/','r'],['MR','r'],['4'],['5'],['6'],['*','r'],['MS','r'],['1'],['2'],['3'],['-','r'],['M+','r'],['0'],['±','b'],[',','b'],['+','r'],['C','r'],['CE','r'],['√','b'],['%','b'],['=','r']];
 K.forEach(([k,c])=>{const b=document.createElement('button');b.textContent=k==='*'?'×':k==='/'?'÷':k;if(c)b.className=c;b.onclick=()=>press(k);keys.append(b)});
 function press(k){if(/^\d$/.test(k)){cur=fresh||cur==='0'?k:cur+k;fresh=false}else if(k===','){if(fresh){cur='0.';fresh=false}else if(!cur.includes('.'))cur+='.'}
  else if('+-*/'.includes(k)){acc=op?apply():num();cur=fmt(acc);op=k;fresh=true}else if(k==='='){cur=fmt(apply());acc=null;op=null;fresh=true}
  else if(k==='C'){cur='0';acc=null;op=null;fresh=true}else if(k==='CE'){cur='0';fresh=true}else if(k==='±'){cur=fmt(-num())}else if(k==='√'){cur=fmt(Math.sqrt(num()));fresh=true}else if(k==='%'){cur=fmt((acc||0)*num()/100)}
  else if(k==='MC')mem=0;else if(k==='MR'){cur=fmt(mem);fresh=true}else if(k==='MS')mem=num();else if(k==='M+')mem+=num();show()}
 el.tabIndex=0;el.addEventListener('keydown',e=>{const m={'Enter':'=','Escape':'C','.':',',',':','};const k=m[e.key]||e.key;if(/^[\d+\-*/=,]$/.test(k)||k==='C'){e.preventDefault();press(k)}});
 createWindow('calc','Calcolatrice',el,{width:300,height:330});setTimeout(()=>el.focus(),50)}

// ---------- Prompt di NOVA-DOS
const SYSF={'C:\\AUTOEXEC.BAT':'@ECHO OFF\nSET PATH=C:\\NOVA;C:\\NOVA\\COMMAND\nSET TEMP=C:\\NOVA\\TEMP\nLH C:\\NOVA\\COMMAND\\MSCDEX.EXE /D:CDROM001\nREM Reinstallato da Marco, Laboratorio PC San Giovanni, 20/12/1999','C:\\CONFIG.SYS':'DEVICE=C:\\NOVA\\HIMEM.SYS\nDOS=HIGH,UMB\nFILES=40\nBUFFERS=20\nDEVICEHIGH=C:\\NOVA\\CDROM.SYS /D:CDROM001','C:\\NOVA\\NOVA.INI':'[boot]\nshell=NOVA.EXE\n[desktop]\nwallpaper=nova2000.bmp\n[assist]\nastro=enabled\nprofile=GMILANO_70\n; profilo ripristinato dal backup ASTRO'};
function dos(){const el=panel('<div class="os-dos"><div data-out></div><span data-p></span><input spellcheck="false" autocomplete="off"></div>');const out=el.querySelector('[data-out]'),inp=el.querySelector('input'),pr=el.querySelector('[data-p]');let cwd='C:\\',hist=[],hi=0;
 const say=t=>{out.append(t+'\n');el.firstChild.scrollTop=1e9};const setP=()=>pr.textContent=cwd+'>';
 const C={'C:\\':[['DOCUMENTI','<DIR>'],['DOWNLOAD','<DIR>'],['NOVA','<DIR>'],['GIOCHI','<DIR>'],['AUTOEXEC.BAT','312'],['CONFIG.SYS','208'],['COMMAND.COM','93.880']],'C:\\NOVA\\':[['SYSTEM','<DIR>'],['ASTRO','<DIR>'],['NOVA.INI','4.211'],['WIN.COM','24.791']],'C:\\GIOCHI\\':[['MAZE2000.EXE','312.400'],['RUNNER99.EXE','288.112'],['BRICKS99.EXE','140.032'],['ORBITA.EXE','201.776']]};
 function list(dir){if(dir==='C:\\DOCUMENTI\\')return Object.keys(gameState.files).map(n=>[n,(gameState.files[n]||'').length.toLocaleString('it-IT')]);if(dir==='C:\\DOWNLOAD\\')return [['NOVARE~1.PKG','86.016']];if(dir==='G:\\')return mounted()?[['AGENDA99.DAT','12.288'],['POSTA','<DIR>'],['IDEE.TXT','1.024'],['PROMEM~1.TXT','512'],['ALMA','<DIR>']]:null;if(dir==='G:\\ALMA\\')return [['ALMA19.EXE','1.048.576'],['DIRECT~1.CFG','128'],['LEGAME.CFG','96']];return C[dir]||null}
 const banner=['NOVA-DOS versione 4.10.1999','(C) NovaSoft 1981-1999.',''];banner.forEach(say);setP();
 const run=line=>{say(cwd+'>'+line);const [c,...a]=line.trim().split(/\s+/);const arg=a.join(' ');const cmd=(c||'').toUpperCase();if(!cmd)return;
  if(cmd==='HELP'||cmd==='?')say('Comandi disponibili:\n  DIR      elenca file e cartelle      CD       cambia cartella\n  TYPE     mostra un file di testo      CLS      pulisce lo schermo\n  VER      versione del sistema         MEM      memoria disponibile\n  DATE     data di sistema              TIME     ora di sistema\n  ECHO     scrive un testo              SCANDISK controlla il disco\n  DEFRAG   deframmenta il disco         MOUNT    monta un volume\n  EXIT     chiude il prompt');
  else if(cmd==='CLS')out.replaceChildren();else if(cmd==='EXIT')el.closest('.window')?.querySelector('[data-action="close"]')?.click();
  else if(cmd==='VER')say('\nNOVA-DOS versione 4.10.1999\n');else if(cmd==='MEM')say('\n    65.536 KB di memoria totale\n    61.212 KB disponibili\n       640 KB memoria convenzionale\n');
  else if(cmd==='DATE')say('Data corrente: gio 23/12/1999');else if(cmd==='TIME')say('Ora corrente: '+(document.querySelector('#clock strong')?.textContent||'21:00')+':00,00');
  else if(cmd==='ECHO')say(arg);else if(cmd==='SCANDISK'){say('Avvio di ScanDisk...');scandisk()}else if(cmd==='DEFRAG'){say('Avvio dell\'Utilità di deframmentazione...');defrag()}
  else if(cmd==='MOUNT'){const r=window.P99Act2?.mount(line);say(r===true?'Volume montato.':r||'Comando non disponibile.')}
  else if(cmd==='FORMAT')say('\nATTENZIONE: TUTTI I DATI SUL DISCO '+(arg||'C:').toUpperCase()+' ANDRANNO PERSI!\nOperazione bloccata dall\'amministratore del sistema.\n(Marco: «Non formattare niente da solo!»)\n');
  else if(/^[A-Z]:$/.test(cmd)){const d=cmd+'\\';if(list(d)){cwd=d}else say('Unità non pronta: '+cmd+'\nAnnulla, Riprova, Tralascia?')}
  else if(cmd==='CD'||cmd.startsWith('CD.')){const t=(cmd.length>2?cmd.slice(2):arg).toUpperCase();if(!t){say(cwd);return}if(t==='..'){cwd=cwd.replace(/[^\\]+\\$/,'')||cwd;return}if(t==='\\'){cwd=cwd.slice(0,3);return}const nd=cwd+t.replace(/\\$/,'')+'\\';if(list(nd))cwd=nd;else say('Percorso non valido')}
  else if(cmd==='DIR'){const l=list(cwd);say('\n Volume nell\'unità '+cwd[0]+(cwd[0]==='G'?' è NV-RES-03':' è NOVA')+'\n Directory di '+cwd+'\n');let f=0,d=0;(l||[]).forEach(([n,s])=>{if(s==='<DIR>')d++;else f++;say(' '+n.padEnd(28)+(s==='<DIR>'?'<DIR>':s.padStart(12)))});say('\n'+String(f).padStart(9)+' file\n'+String(d).padStart(9)+' directory\n')}
  else if(cmd==='TYPE'&&SYSF[(cwd+arg).toUpperCase()]){say(SYSF[(cwd+arg).toUpperCase()])}
  else if(cmd==='TYPE'){if(cwd==='C:\\DOCUMENTI\\'&&gameState.files[arg]!=null)say(gameState.files[arg]);else{const n=Object.keys(gameState.files).find(k=>k.toUpperCase()===arg.toUpperCase());if(cwd==='C:\\DOCUMENTI\\'&&n)say(gameState.files[n]);else say('File non trovato - '+arg)}}
  else if(cmd==='ALMA'||cmd==='ALMA19'||cmd==='ALMA19.EXE'){const s=stage();if(s>=1&&s<6){window.P99Astro?.mood('alma',6000);say('\n> Sono qui.\n> Lui non usava mai questa finestra. Diceva che era fredda.\n')}else say('Comando o nome file non valido')}
  else{const map={NAVIGANOVA:'browser',NOVAMAIL:'mail',MESSENGER:'chat',NOTEPAD:'notepad',CALC:'calc',PAINT:'paint',MAZE2000:'maze',RUNNER99:'runner',BRICKS99:'bricks',ORBITA:'invaders',SCANDISK:'scandisk'};const k=cmd.replace(/\.EXE$/,'');if(map[k])openApp(map[k]);else say('Comando o nome file non valido')}};
 inp.addEventListener('keydown',e=>{if(e.key==='Enter'){const v=inp.value;inp.value='';if(v.trim()){hist.push(v);hi=hist.length}run(v);setP()}else if(e.key==='ArrowUp'){if(hi>0)inp.value=hist[--hi];e.preventDefault()}else if(e.key==='ArrowDown'){if(hi<hist.length-1)inp.value=hist[++hi];else{hi=hist.length;inp.value=''}e.preventDefault()}});
 el.firstChild.addEventListener('click',()=>inp.focus());createWindow('dos','Prompt di NOVA-DOS',el,{width:640,height:400});setTimeout(()=>inp.focus(),50)}

// ---------- ScanDisk e Deframmentazione
function scandisk(){const el=panel('<div class="os-form"><b>ScanDisk — Disco locale (C:)</b><p data-s>Pronto per il controllo.</p><div class="os-prog"><div></div></div><p><button data-go>Avvia</button></p><pre data-r style="white-space:pre-wrap;font:12px Arial"></pre></div>');const st=el.querySelector('[data-s]'),bar=el.querySelector('.os-prog div'),res=el.querySelector('[data-r]');
 el.querySelector('[data-go]').onclick=async e=>{e.target.disabled=true;res.textContent='';const steps=['Controllo della tabella di allocazione file...','Controllo della struttura delle cartelle...','Controllo dei nomi dei file...','Controllo della superficie del disco...'];for(let i=0;i<steps.length;i++){st.textContent=steps[i];for(let p=0;p<=25;p++){bar.style.width=(i*25+p)+'%';await sleep(i===3?70:30)}window.novaSound?.('disk')}
  st.textContent='Controllo completato.';res.textContent='ScanDisk non ha rilevato errori sull’unità C:.\n\n  7.168 MB spazio totale su disco\n  '+(1800+Object.keys(gameState.files).length*3).toLocaleString('it-IT')+' MB in file\n\nNota: 3.072 MB del disco fisico non appartengono al volume C: e sono stati ignorati.'+(mounted()?'\nIl volume NV-RES-03 (G:) è montato in sola lettura.':'');e.target.disabled=false;window.novaSound?.('ding')};createWindow('scandisk','ScanDisk',el,{width:440,height:360})}
function defrag(){const el=panel('<div class="os-form"><b>Deframmentazione dell’unità C:</b><div class="os-defrag"></div><p data-s>Pronto.</p><div class="os-prog"><div></div></div><p><button data-go>Avvia</button> <button data-stop>Interrompi</button></p><p style="font-size:11px">■ <span style="color:#0000ff">blu</span>: dati ottimizzati · ■ <span style="color:#00a0a0">azzurro</span>: frammentati · ■ <span style="color:#c00000">rosso</span>: in lettura · ■ <span style="color:#606060">grigio</span>: area non appartenente al volume</p></div>');
 const grid=el.querySelector('.os-defrag'),st=el.querySelector('[data-s]'),bar=el.querySelector('.os-prog div');const N=40*14,USED=Math.floor(N*0.7);const cells=[];
 for(let i=0;i<N;i++){const c=document.createElement('i');const k=i>=USED?'x':Math.random()<.55?'f':Math.random()<.5?'o':'e';c.dataset.k=k;cells.push(c);grid.append(c)}
 const col={o:'#0000ff',f:'#00c0c0',e:'#fff',x:'#909090',r:'#ff0000'};const paint=()=>cells.forEach(c=>{c.style.background=col[c.dataset.k];c.style.borderColor=c.dataset.k==='x'?'#c0c0c0':'#fff'});paint();let stop=false;
 el.querySelector('[data-stop]').onclick=()=>{stop=true};el.querySelector('[data-go]').onclick=async e=>{e.target.disabled=true;stop=false;st.textContent='Deframmentazione in corso...';let pos=0;const total=cells.slice(0,USED).filter(c=>c.dataset.k==='f'||c.dataset.k==='o').length;let done=0;
  for(let i=0;i<USED&&!stop&&el.isConnected;i++){const c=cells[i];if(c.dataset.k==='o'||c.dataset.k==='f'){c.dataset.k='r';paint();await sleep(18);const t=cells[pos];if(t!==c){t.dataset.k='o';c.dataset.k='e'}else c.dataset.k='o';pos++;done++;bar.style.width=Math.round(done/total*100)+'%';if(done%25===0)window.novaSound?.('click');paint()}}
  st.textContent=stop?'Deframmentazione interrotta.':'Deframmentazione dell’unità C: completata. L’area grigia (3.072 MB) non appartiene al volume e non è stata spostata.';if(!stop)window.novaSound?.('tada');e.target.disabled=false};
 createWindow('defrag','Utilità di deframmentazione dischi',el,{width:560,height:420})}

// ---------- Pannello di controllo
function control(){const el=panel('<div class="os-cp"></div>');const cp=el.querySelector('.os-cp');[['🖥️','Schermo',screen],['🔊','Suoni',sounds],['🕘','Data/ora',()=>window.P99Act2?.dateDialog?.()],['⚙️','Sistema',system],['🗑️','Cestino',trashWin]].forEach(([i,l,f])=>{const d=document.createElement('div');d.innerHTML='<span class="ic"></span><span></span>';d.firstChild.textContent=i;d.lastChild.textContent=l;d.ondblclick=f;if(matchMedia('(hover:none)').matches)d.onclick=f;cp.append(d)});createWindow('control','Pannello di controllo',el,{width:520,height:260})}
function screen(){const el=panel('<div class="os-form"><fieldset><legend>Sfondo</legend></fieldset><fieldset><legend>Salvaschermo</legend><label><select data-ss><option value="nessuno">(Nessuno)</option><option value="stelle">Volo spaziale</option><option value="testo">Testo scorrevole</option></select></label><label>Attesa: <select data-w><option>1</option><option>3</option><option>5</option><option>10</option></select> minuti</label><button data-prev>Anteprima</button></fieldset><p><button data-ok>OK</button></p></div>');const fs=el.querySelector('fieldset');const cur=window.P99GetWallpaper?.()?.kind||'default';
 const curSrc=window.P99GetWallpaper?.()?.src;[['default','NOVA Blu'],['teal','Verde acqua (classico)'],['sky','Paesaggio Valdarno'],['night','Figline sotto la neve']].map(([k,l])=>[k,l,null]).concat((window.P99CD?.wallpapers?.()||[]).map(([k,l,src])=>['tile',l+' (da SFONDI.ZIP)',src])).forEach(([k,l,src])=>{const lab=document.createElement('label');lab.innerHTML='<input type="radio" name="wp"> ';lab.firstChild.checked=src?curSrc===src:k===cur;lab.append(l);lab.firstChild.onchange=()=>window.P99SetWallpaper?.(src?{kind:'tile',src}:{kind:k});fs.append(lab)});
 const ss=el.querySelector('[data-ss]'),wt=el.querySelector('[data-w]');ss.value=O.saver;wt.value=String(O.wait);ss.onchange=()=>{O.saver=ss.value;save()};wt.onchange=()=>{O.wait=Number(wt.value);save()};el.querySelector('[data-prev]').onclick=()=>saver(true);
 const w=createWindow('screen','Proprietà - Schermo',el,{width:400,height:420});el.querySelector('[data-ok]').onclick=()=>w.querySelector('[data-action="close"]').click()}
function sounds(){const muted=()=>{try{return localStorage.getItem('nova2000-audio-muted')==='1'}catch{return false}};const el=panel('<div class="os-form"><fieldset><legend>Suoni di sistema</legend><label><input type="checkbox" data-on> Suoni attivi (avvio, errori, modem, messaggi)</label><button data-t>Prova</button></fieldset></div>');const on=el.querySelector('[data-on]');on.checked=!muted();on.onchange=()=>{if(on.checked===muted())document.getElementById('nova-volume')?.click()};el.querySelector('[data-t]').onclick=()=>window.novaSound?.('tada');createWindow('sounds','Proprietà - Suoni',el,{width:380,height:230})}
function system(){const el=panel('<div class="os-form" style="display:flex;gap:14px"><div style="font-size:54px">🖥️</div><div><p><b>Sistema:</b><br>NOVA OS 2000<br>Versione 4.10.1999</p><p><b>Registrato a:</b><br>Giuseppe Milano<br>GM-LAB, Montanino<br>25417-OEM-0098-1970</p><p><b>Computer:</b><br>GenuineIntel<br>Pentium II, 350 MHz<br>64,0 MB di RAM<br>Disco IDE 10,0 GB · CD-ROM 32x · Modem 56K</p></div></div>');createWindow('system','Proprietà - Sistema',el,{width:420,height:360})}

// ---------- Salvaschermo
let last=Date.now(),on=null;['pointermove','pointerdown','keydown','wheel','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{last=Date.now();if(on)stopSaver()},{capture:true,passive:true}));
function stopSaver(){on?.remove();on=null;last=Date.now()}
function saver(preview){if(on)return;const kind=O.saver==='nessuno'&&preview?'stelle':O.saver;if(kind==='nessuno')return;const c=document.createElement('canvas');c.className='os-saver';document.body.append(c);on=c;const x=c.getContext('2d');const W=c.width=innerWidth,H=c.height=innerHeight;const t0=Date.now();
 const stars=Array.from({length:220},()=>({x:(Math.random()-.5)*W,y:(Math.random()-.5)*H,z:Math.random()*W}));let tx=W/3,ty=H/3,dx=2.2,dy=1.6,hue=0;
 const words=()=>{const s=stage();if(s>=3&&s<6&&Math.random()<.35)return ['21:30','Ti aspetto.','Torni stasera?'][Math.floor(Math.random()*3)];return 'NOVA 2000'};let word='NOVA 2000';
 (function loop(){if(on!==c)return;if(kind==='stelle'){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#fff';for(const s of stars){s.z-=6;if(s.z<1){s.z=W;s.x=(Math.random()-.5)*W;s.y=(Math.random()-.5)*H}const k=W/2/s.z,px=s.x*k+W/2,py=s.y*k+H/2,sz=Math.max(1,(1-s.z/W)*3);x.fillRect(px,py,sz,sz)}}
  else{x.fillStyle='#000';x.fillRect(0,0,W,H);x.font='bold 54px "Arial Black",Arial';const tw=x.measureText(word).width;tx+=dx;ty+=dy;if(tx<0||tx+tw>W){dx=-dx;hue=(hue+60)%360;word=words()}if(ty<54||ty>H){dy=-dy;hue=(hue+60)%360;word=words()}x.fillStyle='hsl('+hue+',100%,55%)';x.fillText(word,tx,ty)}
  requestAnimationFrame(loop)})();
 if(preview)setTimeout(()=>{last=Date.now()},300)}
setInterval(()=>{if(on||O.saver==='nessuno'||typeof booting!=='undefined'&&booting)return;if(!document.getElementById('desktop')?.classList.contains('ready'))return;if(Date.now()-last>O.wait*60000)saver(false)},2000);

// ---------- Avvio dei programmi
const prevOpen=openApp;openApp=function(app){const m={trash:trashWin,notepad:()=>notepad(),calc,dos,scandisk,defrag,control};if(m[app]){if(booting)return;m[app]();document.getElementById('start-menu').hidden=true;return}return prevOpen(app)};
window.P99Notepad=notepad;
})();

/* NOVA 2000 — desktop personalizzabile e persistente */
(()=>{
'use strict';
const desk=document.getElementById('desktop'),host=desk.querySelector('.desktop-icons'),clock=document.getElementById('clock');
const PREFIX='nova2000-desktop-v1', icons=[...host.querySelectorAll('.desktop-icon')];
const get=(k,f)=>{try{return JSON.parse(localStorage.getItem(PREFIX+'-'+k))??f}catch{return f}};
const set=(k,v)=>{try{localStorage.setItem(PREFIX+'-'+k,JSON.stringify(v));return true}catch{return false}};
let positions=get('icons',{}), wallpaper=get('wallpaper',{kind:'default'}), drawing=get('drawing',null);
const style=document.createElement('style');
style.textContent=`
.desktop-icons{position:absolute!important;display:block!important;left:0!important;top:0!important;bottom:auto!important;width:100%!important;height:calc(100% - 42px)!important;max-width:none!important;max-height:none!important;overflow:visible!important;pointer-events:none!important}
.desktop-icons>.desktop-icon{position:absolute!important;pointer-events:auto!important;width:112px!important;height:108px!important;min-height:108px!important;max-height:108px!important;flex:none!important;touch-action:none;cursor:default}
#clock{font:12px/1.08 Arial,sans-serif!important;min-width:112px!important;padding:2px 6px!important;height:31px;display:flex;flex-direction:column;align-items:center;justify-content:center;white-space:nowrap}
.nova-wallpaper-menu{position:fixed;z-index:9990;background:#c0c0c0;color:#111;min-width:245px;max-width:310px;padding:9px;border:2px outset white;box-shadow:3px 4px #1118;font:13px Arial}
.nova-wallpaper-menu[hidden]{display:none}
.nova-wallpaper-menu button{margin:3px;padding:5px 7px;border:2px outset white;background:#ccc}
.nova-wallpaper-menu .nova-wall-title{font-weight:bold;background:#1a237e;color:white;padding:6px;margin:-5px -5px 9px}
`;document.head.append(style);
function notify(s){let node=document.getElementById('nova-desktop-note');if(node)node.remove();node=document.createElement('div');node.id='nova-desktop-note';node.style.cssText='position:absolute;bottom:51px;right:10px;background:#ffffdf;color:#111;padding:10px;border:2px outset white;z-index:8000;font:13px Arial';node.textContent=s;desk.append(node);setTimeout(()=>node.remove(),2800)}
function dims(){return {w:host.clientWidth,h:host.clientHeight}};
function clamp(x,y){const {w,h}=dims();return {x:Math.max(0,Math.min(Math.round(x),Math.max(0,w-114))),y:Math.max(0,Math.min(Math.round(y),Math.max(0,h-110)))}}
function defaultXY(i){const {h}=dims();const rows=Math.max(1,Math.floor((h-14)/116));return clamp(12+Math.floor(i/rows)*124,14+(i%rows)*116)}
function applyPositions(){icons.forEach((el,i)=>{const p=positions[el.dataset.app]||defaultXY(i);const c=clamp(p.x,p.y);el.style.left=c.x+'px';el.style.top=c.y+'px'})}
function arrange(){positions={};set('icons',positions);applyPositions()}
function persistPositions(){set('icons',positions)}
function select(el){icons.forEach(x=>x.classList.toggle('selected',x===el))}

const marquee=document.createElement('div');marquee.style.cssText='position:absolute;border:1px solid #dddfff;background:rgba(160,190,220,.25);pointer-events:none;z-index:35;display:none';desk.append(marquee);
let selection=null;
desk.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.window,.desktop-icon,#astro-widget,.taskbar,.start-menu,.nova-wallpaper-menu'))return;const bounds=desk.getBoundingClientRect();selection={x:e.clientX-bounds.left,y:e.clientY-bounds.top,pointerId:e.pointerId};icons.forEach(x=>x.classList.remove('selected'));marquee.style.display='block';marquee.style.left=selection.x+'px';marquee.style.top=selection.y+'px';marquee.style.width='0px';marquee.style.height='0px';desk.setPointerCapture(e.pointerId);e.preventDefault()},true);
desk.addEventListener('pointermove',e=>{if(!selection)return;const bounds=desk.getBoundingClientRect();const x=e.clientX-bounds.left,y=e.clientY-bounds.top;const l=Math.min(selection.x,x),t=Math.min(selection.y,y),w=Math.abs(selection.x-x),h=Math.abs(selection.y-y);marquee.style.left=l+'px';marquee.style.top=t+'px';marquee.style.width=w+'px';marquee.style.height=h+'px';const region={left:bounds.left+l,top:bounds.top+t,right:bounds.left+l+w,bottom:bounds.top+t+h};icons.forEach(icon=>{const r=icon.getBoundingClientRect();icon.classList.toggle('selected',r.left<region.right&&r.right>region.left&&r.top<region.bottom&&r.bottom>region.top)})},true);
function stopSelection(){selection=null;marquee.style.display='none'}
desk.addEventListener('pointerup',stopSelection,true);desk.addEventListener('pointercancel',stopSelection,true);

let drag=null,suppress=false;
host.addEventListener('pointerdown',e=>{const icon=e.target.closest('.desktop-icon');if(!icon||e.button!==0)return;select(icon);const b=icon.getBoundingClientRect();drag={el:icon,startX:e.clientX,startY:e.clientY,left:b.left-host.getBoundingClientRect().left,top:b.top-host.getBoundingClientRect().top,moved:false};icon.setPointerCapture?.(e.pointerId)},true);
host.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(!drag.moved&&Math.hypot(dx,dy)<6)return;drag.moved=true;const c=clamp(drag.left+dx,drag.top+dy);drag.el.style.left=c.x+'px';drag.el.style.top=c.y+'px'},true);
function finish(e){if(!drag)return;if(drag.moved){positions[drag.el.dataset.app]=clamp(parseFloat(drag.el.style.left),parseFloat(drag.el.style.top));persistPositions();suppress=true;setTimeout(()=>suppress=false,250)}drag=null}
host.addEventListener('pointerup',finish,true);host.addEventListener('pointercancel',finish,true);
host.addEventListener('dblclick',e=>{if(suppress){e.stopImmediatePropagation();e.preventDefault()}},true);
window.addEventListener('resize',applyPositions);
applyPositions();
const NOVA_EPOCH_KEY='nova2000-clock-start-v1';
let startAt=Number(sessionStorage.getItem(NOVA_EPOCH_KEY));if(!startAt||startAt>Date.now()){startAt=Date.now();sessionStorage.setItem(NOVA_EPOCH_KEY,String(startAt))}
window.addEventListener('p99-clock',()=>tick());
function tick(){if(window.P99ClockHold)return;const elapsed=Math.max(0,Date.now()-startAt);const date=new Date(Date.UTC(1999,11,23,21,0,0)+elapsed);const pad=n=>String(n).padStart(2,'0');const time=pad(date.getUTCHours())+':'+pad(date.getUTCMinutes());clock.innerHTML='<span>'+pad(date.getUTCDate())+'/'+pad(date.getUTCMonth()+1)+'/'+date.getUTCFullYear()+'</span><strong>'+time+'</strong>';clock.title='Ora simulata NOVA 2000, avanza dal 23/12/1999 alle 21:00'}
tick();setInterval(tick,10000);
function setWallpaper(w){wallpaper=w;set('wallpaper',w);applyWallpaper()}
window.P99SetWallpaper=setWallpaper;window.P99GetWallpaper=()=>wallpaper;
const skinTest=new Image();skinTest.onload=()=>{window.P99Skin=true;applyWallpaper()};skinTest.src='img/sfondo_nova2000.jpg';
const skinCss=document.createElement('style');skinCss.textContent='#desktop.nova-skin:before{display:none}';document.head.append(skinCss);
function applyWallpaper(){desk.classList.toggle('nova-skin',wallpaper.kind==='default'&&!!window.P99Skin);
desk.style.backgroundImage='';desk.style.backgroundSize='';desk.style.backgroundPosition='';desk.style.backgroundColor='';
if(wallpaper.kind==='teal'){desk.style.background='#008080'}
else if(wallpaper.kind==='default'){desk.style.background='url("img/sfondo_nova2000.jpg") center center / cover no-repeat, radial-gradient(ellipse at 58% 40%,#304364 0%,#25334d 43%,#19243a 100%)'}
else if(wallpaper.kind==='sky'){desk.style.background="#536e66 url("+JSON.stringify((window.P99_REAL_PHOTOS||{}).balze||"assets/balze_1998.svg")+") center center / cover no-repeat"}
else if(wallpaper.kind==='night'){desk.style.background="#6d7d82 url("+JSON.stringify((window.P99_REAL_PHOTOS||{}).neve||"assets/neve_figline.svg")+") center center / cover no-repeat"}
else if(wallpaper.kind==='tile'){desk.style.background='url("'+wallpaper.src+'") repeat'}
else if(wallpaper.kind==='image'){desk.style.background='#223 url("'+wallpaper.src+'") center center / cover no-repeat'}
else if(wallpaper.kind==='drawing'&&drawing){desk.style.background='#223 url("'+drawing+'") center center / contain no-repeat'}
}
applyWallpaper();
const wmenu=document.createElement('div');wmenu.className='nova-wallpaper-menu';wmenu.hidden=true;document.body.append(wmenu);
function hide(){wmenu.hidden=true}
function showMenu(x,y,icon){wmenu.replaceChildren();let title=document.createElement('div');title.className='nova-wall-title';title.textContent=icon?'Opzioni applicazione':'Proprietà schermo';wmenu.append(title);
function btn(s,fn){let b=document.createElement('button');b.textContent=s;b.onclick=()=>{hide();fn()};wmenu.append(b)}
if(icon){btn('Apri',()=>openApp(icon.dataset.app));btn('Informazioni',()=>notify('Applicazione: '+icon.textContent.trim()));btn('Ripristina posizione',()=>{delete positions[icon.dataset.app];persistPositions();applyPositions()});if(icon.dataset.app==='astro')btn('Parla con Astro V',()=>openApp('astro'));}else{btn('Disponi icone',arrange);btn('Sfondo NOVA',()=>setWallpaper({kind:'default'}));btn('Paesaggio (rete NOVA)',()=>setWallpaper({kind:'sky'}));btn('Figline sotto la neve',()=>setWallpaper({kind:'night'}));if(drawing)btn('Usa ultimo disegno',()=>setWallpaper({kind:'drawing'}));btn('Raccolta immagini Goolarno',()=>showGallery());}
wmenu.hidden=false;wmenu.style.left=Math.max(2,Math.min(x,innerWidth-310))+'px';wmenu.style.top=Math.max(2,Math.min(y,innerHeight-wmenu.offsetHeight-5))+'px'}
desk.addEventListener('contextmenu',e=>{if(e.target.closest('.window,.web-page,input,textarea,canvas'))return;const icon=e.target.closest('.desktop-icon');if(!icon&&!e.target.closest('.desktop-icons')&&e.target!==desk)return;e.preventDefault();e.stopImmediatePropagation();if(icon)select(icon);showMenu(e.clientX,e.clientY,icon)},true);
document.addEventListener('pointerdown',e=>{if(!wmenu.contains(e.target))hide()},true);
function showGallery(){const gallery=[['Paesaggio Valdarno', 'sky'],['Figline sotto la neve', 'night'],['NOVA Blu', 'default']];if(drawing)gallery.push(['Ultimo disegno di Paint','drawing']);const el=document.createElement('div');el.className='nova-wallpaper-menu';el.style.cssText='left:50%;top:24%;transform:translateX(-50%);max-width:360px;min-width:290px';el.innerHTML='<div class="nova-wall-title">🌐 Goolarno — Galleria sfondi</div><p>Immagini disponibili nella rete simulata di NOVA 2000.</p>';gallery.forEach(([name,kind])=>{const b=document.createElement('button');b.textContent=name;b.onclick=()=>{setWallpaper({kind});el.remove()};el.append(b)});const close=document.createElement('button');close.textContent='Chiudi';close.onclick=()=>el.remove();el.append(close);document.body.append(el)}

// Durante le ultime fasi dell'indagine (Q7-Q8) il frammento di ALMA in Astro V non accetta di sparire; dopo il finale sì.
function astroLocked(){try{const d=JSON.parse(localStorage.getItem('partition99-completa-v1')||'{}');return d.depth>=7&&!d.ending}catch{return false}}
function astroContext(x,y){wmenu.replaceChildren();const title=document.createElement('div');title.className='nova-wall-title';title.textContent='Astro V';wmenu.append(title);function a(label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{hide();fn()};wmenu.append(b)}
a('Parla con Astro V',()=>openApp('astro'));a('Proprietà',()=>window.P99Act2?window.P99Act2.astroProps():notify('Astro V'));
if(astroLocked()){a('Riduci a icona (non disponibile)',()=>{if(typeof astroSay==='function')astroSay('Non posso ancora sparire. Non adesso.');notify('Il modulo di assistenza non risponde al comando.')})}
else{a('Riduci a icona',()=>{const w=document.getElementById('astro-widget');w.style.display='none';notify('Astro V ridotto a icona. Per ripristinarlo: START › Programmi › Astro V.')})}
wmenu.hidden=false;wmenu.style.left=Math.max(2,Math.min(x,innerWidth-320))+'px';wmenu.style.top=Math.max(2,Math.min(y,innerHeight-wmenu.offsetHeight-6))+'px'}
desk.addEventListener('contextmenu',e=>{if(e.target.closest('#astro-widget')){e.preventDefault();e.stopImmediatePropagation();astroContext(e.clientX,e.clientY)}},true);

function attachPaint(root){const canvas=root.querySelector('canvas'),button=root.querySelector('[data-save]');if(!canvas||!button||root.dataset.novaWallpaperReady)return;root.dataset.novaWallpaperReady='1';let b=document.createElement('button');b.textContent='Imposta come sfondo';b.onclick=()=>{try{drawing=canvas.toDataURL('image/png');if(!set('drawing',drawing)){notify('Disegno troppo grande per il salvataggio.');return}setWallpaper({kind:'drawing'})}catch{notify('Impossibile salvare il disegno')}};button.after(b)}
document.addEventListener('click',e=>{if(e.target.closest('.desktop-icon[data-app="astro"]')){const w=document.getElementById('astro-widget');if(w)w.style.display=''}},true);
const observer=new MutationObserver(()=>document.querySelectorAll('.window .novapanel').forEach(attachPaint));observer.observe(document.getElementById('windows'),{childList:true,subtree:true});
})();

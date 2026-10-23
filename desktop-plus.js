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
let drag=null,suppress=false;
host.addEventListener('pointerdown',e=>{const icon=e.target.closest('.desktop-icon');if(!icon||e.button!==0)return;select(icon);const b=icon.getBoundingClientRect();drag={el:icon,startX:e.clientX,startY:e.clientY,left:b.left-host.getBoundingClientRect().left,top:b.top-host.getBoundingClientRect().top,moved:false};icon.setPointerCapture?.(e.pointerId)},true);
host.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(!drag.moved&&Math.hypot(dx,dy)<6)return;drag.moved=true;const c=clamp(drag.left+dx,drag.top+dy);drag.el.style.left=c.x+'px';drag.el.style.top=c.y+'px'},true);
function finish(e){if(!drag)return;if(drag.moved){positions[drag.el.dataset.app]=clamp(parseFloat(drag.el.style.left),parseFloat(drag.el.style.top));persistPositions();suppress=true;setTimeout(()=>suppress=false,250)}drag=null}
host.addEventListener('pointerup',finish,true);host.addEventListener('pointercancel',finish,true);
host.addEventListener('dblclick',e=>{if(suppress){e.stopImmediatePropagation();e.preventDefault()}},true);
window.addEventListener('resize',applyPositions);
applyPositions();
function tick(){// Data della finzione, non data reale del dispositivo.
const d=new Date(1999,11,23,21,0,0);clock.innerHTML='<span>23/12/1999</span><strong>21:00</strong>';clock.title='Giovedì 23 dicembre 1999 — ora del sistema NOVA'}
tick();setInterval(tick,30000);
function setWallpaper(w){wallpaper=w;set('wallpaper',w);applyWallpaper()}
function applyWallpaper(){desk.style.backgroundImage='';desk.style.backgroundSize='';desk.style.backgroundPosition='';desk.style.backgroundColor='';if(wallpaper.kind==='default'){desk.style.background='radial-gradient(ellipse at 58% 40%,#304364 0%,#25334d 43%,#19243a 100%)'}else if(wallpaper.kind==='sky'){desk.style.background='linear-gradient(180deg,#4c83c5 0%,#b3dcfc 60%,#2d784a 61%,#1c482f 100%)'}else if(wallpaper.kind==='night'){desk.style.background='radial-gradient(circle at 78% 18%,#ece7ae 0 2%,transparent 3%),linear-gradient(135deg,#050d25,#1d3554 55%,#081027)'}else if(wallpaper.kind==='image'){desk.style.background='#223 url("'+wallpaper.src+'") center center / cover no-repeat'}else if(wallpaper.kind==='drawing'&&drawing){desk.style.background='#223 url("'+drawing+'") center center / contain no-repeat'} }
applyWallpaper();
const wmenu=document.createElement('div');wmenu.className='nova-wallpaper-menu';wmenu.hidden=true;document.body.append(wmenu);
function hide(){wmenu.hidden=true}
function showMenu(x,y,icon){wmenu.replaceChildren();let title=document.createElement('div');title.className='nova-wall-title';title.textContent=icon?'Opzioni applicazione':'Proprietà schermo';wmenu.append(title);
function btn(s,fn){let b=document.createElement('button');b.textContent=s;b.onclick=()=>{hide();fn()};wmenu.append(b)}
if(icon){btn('Apri',()=>openApp(icon.dataset.app));btn('Informazioni',()=>notify('Applicazione: '+icon.textContent.trim()));btn('Ripristina posizione',()=>{delete positions[icon.dataset.app];persistPositions();applyPositions()});if(icon.dataset.app==='astro')btn('Parla con Astro V',()=>openApp('astro'));}else{btn('Disponi icone',arrange);btn('Sfondo NOVA',()=>setWallpaper({kind:'default'}));btn('Paesaggio (rete NOVA)',()=>setWallpaper({kind:'sky'}));btn('Notte (rete NOVA)',()=>setWallpaper({kind:'night'}));if(drawing)btn('Usa ultimo disegno',()=>setWallpaper({kind:'drawing'}));btn('Scegli immagine dal computer…',()=>file.click());}
wmenu.hidden=false;wmenu.style.left=Math.max(2,Math.min(x,innerWidth-310))+'px';wmenu.style.top=Math.max(2,Math.min(y,innerHeight-wmenu.offsetHeight-5))+'px'}
desk.addEventListener('contextmenu',e=>{if(e.target.closest('.window,.web-page,input,textarea,canvas'))return;const icon=e.target.closest('.desktop-icon');if(!icon&&!e.target.closest('.desktop-icons')&&e.target!==desk)return;e.preventDefault();e.stopImmediatePropagation();if(icon)select(icon);showMenu(e.clientX,e.clientY,icon)},true);
document.addEventListener('pointerdown',e=>{if(!wmenu.contains(e.target))hide()},true);
const file=document.createElement('input');file.type='file';file.accept='image/png,image/jpeg,image/webp';file.hidden=true;document.body.append(file);
file.addEventListener('change',()=>{const f=file.files?.[0];if(!f)return;if(f.size>2500000){notify('Immagine troppo grande: massimo 2,5 MB.');return}const reader=new FileReader();reader.onload=()=>{const w={kind:'image',src:String(reader.result)};if(!set('wallpaper',w)){notify('Spazio salvataggi esaurito. Usa un file più piccolo.');return}wallpaper=w;applyWallpaper()};reader.readAsDataURL(f)});
function attachPaint(root){const canvas=root.querySelector('canvas'),button=root.querySelector('[data-save]');if(!canvas||!button||root.dataset.novaWallpaperReady)return;root.dataset.novaWallpaperReady='1';let b=document.createElement('button');b.textContent='Imposta come sfondo';b.onclick=()=>{try{drawing=canvas.toDataURL('image/png');if(!set('drawing',drawing)){notify('Disegno troppo grande per il salvataggio.');return}setWallpaper({kind:'drawing'})}catch{notify('Impossibile salvare il disegno')}};button.after(b)}
const observer=new MutationObserver(()=>document.querySelectorAll('.window .novapanel').forEach(attachPaint));observer.observe(document.getElementById('windows'),{childList:true,subtree:true});
})();

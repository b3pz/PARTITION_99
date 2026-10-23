/* NOVA 2000: appunti condivisi tra applicazioni */
(()=>{'use strict';
let internal='';let target=null,from=0,to=0,selected='';
const root=document.getElementById('desktop');
const menu=document.createElement('div');menu.className='nova-context';menu.hidden=true;document.body.append(menu);
const editable=e=>e instanceof HTMLInputElement&&/^(text|search|url|email|tel|number|password)$/i.test(e.type)||e instanceof HTMLTextAreaElement;
const hide=()=>{menu.hidden=true;menu.replaceChildren()};
function setSelectedFieldValue(el,content){if(!editable(el)||el.disabled||el.readOnly)return;el.focus();el.setSelectionRange(from,to);el.setRangeText(content,from,to,'end');el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}
async function copyText(str){if(!str)return;internal=str;try{await navigator.clipboard.writeText(str)}catch{}}
async function pasteText(){let s=internal;try{const native=await navigator.clipboard.readText();if(native)s=native}catch{}if(target&&target.isConnected)setSelectedFieldValue(target,s)}
function add(label,handler,disabled=false){let b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;b.onclick=()=>{hide();handler()};menu.append(b)}
root.addEventListener('contextmenu',e=>{
 const el=e.target.closest('input,textarea,[contenteditable=true]');const selection=String(window.getSelection()?.toString()||'');
 if(!editable(el)&&!selection)return;
 e.preventDefault();e.stopImmediatePropagation();hide();target=editable(el)?el:null;
 if(target){from=target.selectionStart??0;to=target.selectionEnd??from;selected=target.value.slice(from,to)}
 else selected=selection;
 add('Copia',()=>copyText(selected),!selected);
 if(target){add('Taglia',async()=>{if(target.readOnly||target.disabled||!selected)return;await copyText(selected);setSelectedFieldValue(target,'')},!selected||target.readOnly);add('Incolla',pasteText,target.readOnly);add('Seleziona tutto',()=>{target.focus();target.select()})}
 else add('Copia negli appunti NOVA',()=>copyText(selected),!selected);
 menu.hidden=false;const rect=menu.getBoundingClientRect();menu.style.left=Math.max(3,Math.min(e.clientX,innerWidth-rect.width-5))+'px';menu.style.top=Math.max(3,Math.min(e.clientY,innerHeight-rect.height-5))+'px';
},true);
document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target))hide()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();if(!(e.metaKey||e.ctrlKey)||e.altKey)return;
 const key=e.key.toLowerCase();const active=document.activeElement;
 if(key==='c'&&!editable(active)){const t=String(window.getSelection()?.toString()||'');if(t)internal=t}
 if(key==='c'&&editable(active)){const st=active.selectionStart??0,en=active.selectionEnd??0;if(en>st)internal=active.value.slice(st,en)}
 if(key==='x'&&editable(active)){const st=active.selectionStart??0,en=active.selectionEnd??0;if(en>st)internal=active.value.slice(st,en)}
 if(key==='v'&&editable(active)&&internal){/* Il browser gestisce l'incolla nativa; il fallback interviene se non esistono appunti di sistema. */}
},true);
})();

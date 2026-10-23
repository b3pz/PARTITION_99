/* NOVA 2000 — Disegno: «Apri immagine…» e «Inverti colori».
   Il negativo 171098_NEG.BMP recuperato da NovaRescue, invertito, mostra la data impressa e il biglietto vicino alla tastiera. */
(()=>{'use strict';
const NEG='171098_NEG.BMP';
function photo(){return window.P99_PEOPLE_PHOTOS?.gruppo||'foto_laboratorio.svg'}
function images(){const list=Object.keys(gameState.images||{});if(typeof chapter!=='undefined'&&chapter.receipt)list.unshift('foto_laboratorio_1998.jpg');return list}
function loadImg(src){return new Promise((ok,ko)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=ko;i.src=src})}
function fit(ctx,c,img){ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);const r=Math.min(c.width/img.width,c.height/img.height),w=img.width*r,h=img.height*r;ctx.drawImage(img,(c.width-w)/2,(c.height-h)/2,w,h);return {x:(c.width-w)/2,y:(c.height-h)/2,w,h}}
// Negativo colore: valori invertiti con la tipica maschera arancione della pellicola.
function toNegative(ctx,c){const d=ctx.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){p[i]=(255-p[i])*0.82+38;p[i+1]=(255-p[i+1])*0.62+26;p[i+2]=(255-p[i+2])*0.42+14}ctx.putImageData(d,0,0)}
function invert(ctx,c){const d=ctx.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){p[i]=255-p[i];p[i+1]=255-p[i+1];p[i+2]=255-p[i+2]}ctx.putImageData(d,0,0)}
// Sviluppo: la foto positiva con la data impressa dalla macchina e il biglietto giallo accanto alla tastiera.
function develop(ctx,box){ctx.save();const x=box.x+box.w*0.08,y=box.y+box.h*0.70;ctx.translate(x,y);ctx.rotate(-0.08);ctx.fillStyle='#f7e36b';ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=4;ctx.fillRect(0,0,box.w*0.22,box.h*0.16);ctx.shadowBlur=0;ctx.fillStyle='#1c2a6b';ctx.font='italic '+Math.round(box.h*0.035)+'px "Comic Sans MS","Segoe Print",cursive';ctx.fillText('Ricorda anche',6,box.h*0.06);ctx.fillText('quando non',6,box.h*0.1);ctx.fillText('la apro.',6,box.h*0.14);ctx.restore();
 ctx.save();ctx.font='bold '+Math.round(box.h*0.06)+'px "Courier New",monospace';ctx.fillStyle='#ff8a1c';ctx.shadowColor='#ff5a00';ctx.shadowBlur=6;ctx.fillText("17 10 '98",box.x+box.w-box.h*0.36,box.y+box.h-box.h*0.09);ctx.restore()}
function enhance(root){const canvas=root.querySelector('canvas'),bar=root.querySelector('[data-clear]')?.parentElement;if(!canvas||!bar||root.dataset.p99plus)return;root.dataset.p99plus='1';const ctx=canvas.getContext('2d');let current=null,positive=false,box=null;
 const openBtn=document.createElement('button');openBtn.textContent='📂 Apri immagine…';const invBtn=document.createElement('button');invBtn.textContent='🔄 Inverti colori';bar.style.flexWrap='wrap';bar.append(openBtn,invBtn);
 const status=document.createElement('div');status.className='note';status.style.marginTop='4px';canvas.after(status);
 async function load(name){current=name;positive=false;try{const img=await loadImg(photo());box=fit(ctx,canvas,img);if(name===NEG){toNegative(ctx,canvas);status.textContent=NEG+' · negativo colore 35 mm, non sviluppato'}else{positive=true;status.textContent=name}}catch{status.textContent='Impossibile aprire '+name}}
 root.P99load=load;
 openBtn.onclick=()=>{const list=images();const m=document.createElement('div');m.className='nova-inset';m.style.cssText='margin-top:6px;padding:8px';if(!list.length){m.textContent='Nessuna immagine nella cartella Documenti.'}else{m.innerHTML='<b>Apri immagine</b><br>';list.forEach(n=>{const b=document.createElement('button');b.textContent='🖼️ '+n;b.style.margin='3px';b.onclick=()=>{m.remove();load(n)};m.append(b)})}const c=document.createElement('button');c.textContent='Annulla';c.style.margin='3px';c.onclick=()=>m.remove();m.append(c);root.querySelector('.p99-open')?.remove();m.classList.add('p99-open');bar.after(m)};
 invBtn.onclick=async()=>{if(current===NEG){if(!positive){const img=await loadImg(photo());box=fit(ctx,canvas,img);develop(ctx,box);positive=true;status.textContent=NEG+' · sviluppato in positivo';if(!gameState.negDeveloped){gameState.negDeveloped=true;gameState.files['171098_note.txt']='Sviluppo del negativo 171098 (Disegno)\nData impressa: 17 10 \'98\nBiglietto vicino alla tastiera: «Ricorda anche quando non la apro.»';saveGame();window.novaSound?.('ding');window.dispatchEvent(new CustomEvent('nova-story',{detail:{type:'negative-developed'}}))}}else{await load(NEG)}return}invert(ctx,canvas);positive=!positive}}
const base=launchPaint;launchPaint=function(){base();const w=[...document.querySelectorAll('.window')].pop();const root=w?.querySelector('.novapanel');if(root)enhance(root);return w};
window.P99OpenImage=name=>{const w=launchPaint();const root=w?.querySelector('.novapanel');root?.P99load?.(name)};
})();

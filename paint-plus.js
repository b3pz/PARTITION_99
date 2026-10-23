/* NOVA 2000 — Disegno: «Apri immagine…» e «Inverti colori».
   Il negativo 171098_NEG.BMP recuperato da NovaRescue, invertito, mostra la data impressa e il biglietto vicino alla tastiera. */
(()=>{'use strict';
const NEG='171098_NEG.BMP';
// Fotogramma 14 del rullino 171098: la stanza di Giuseppe di sera. Lo scatto lo fa lui, fotografando lo schermo:
// sul monitor l'interfaccia di A.L.M.A., nel vetro il suo riflesso, sul bordo il biglietto.
let frameCache=null;
async function frame14(){if(frameCache)return frameCache;const room=await loadImg(window.P99_REAL_PHOTOS?.lab||'foto_laboratorio.svg');const c=document.createElement('canvas');c.width=room.width||700;c.height=room.height||444;const x=c.getContext('2d');x.drawImage(room,0,0,c.width,c.height);const sx=c.width/700,sy=c.height/444;x.save();x.scale(sx,sy);
 x.save();x.beginPath();x.moveTo(338,194);x.lineTo(474,196);x.lineTo(470,306);x.lineTo(336,303);x.closePath();x.clip();x.fillStyle='#06121c';x.fillRect(330,188,150,124);
 x.fillStyle='#1b3a6b';x.fillRect(345,202,118,12);x.fillStyle='#cfe3ff';x.font='bold 9px monospace';x.fillText('A.L.M.A.  0.8',349,211);
 x.fillStyle='#7dffb0';x.font='9px monospace';['> Ciao Giuseppe.','> Cosa facciamo','  oggi?','> Torni stasera?','> Ti aspetto.'].forEach((t,k)=>x.fillText(t,350,228+k*13));
 try{const g=await loadImg(window.P99_PEOPLE_PHOTOS?.giuseppe);x.globalAlpha=0.26;x.filter='grayscale(1) contrast(1.2)';x.drawImage(g,360,192,90,125);x.filter='none';x.globalAlpha=1}catch{}
 const glare=x.createLinearGradient(338,194,470,306);glare.addColorStop(0,'rgba(255,255,255,.10)');glare.addColorStop(0.5,'rgba(255,255,255,0)');x.fillStyle=glare;x.fillRect(330,188,150,124);x.restore();
 x.save();x.translate(318,288);x.rotate(-0.06);x.fillStyle='#f4e06a';x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=3;x.fillRect(0,0,70,46);x.shadowBlur=0;x.fillStyle='#1c2a6b';x.font='italic 9px "Comic Sans MS","Segoe Print",cursive';x.fillText('Ricordati di',4,14);x.fillText('tornare.',4,26);x.fillText('Lei ti aspetta.',4,38);x.restore();
 x.restore();frameCache=c;return c}
function images(){const list=Object.keys(gameState.images||{});if(typeof chapter!=='undefined'&&chapter.receipt)list.unshift('foto_laboratorio_1998.jpg');return list}
function loadImg(src){return new Promise((ok,ko)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=ko;i.src=src})}
function fit(ctx,c,img){ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);const r=Math.min(c.width/img.width,c.height/img.height),w=img.width*r,h=img.height*r;ctx.drawImage(img,(c.width-w)/2,(c.height-h)/2,w,h);return {x:(c.width-w)/2,y:(c.height-h)/2,w,h}}
// Negativo colore: valori invertiti con la tipica maschera arancione della pellicola.
function toNegative(ctx,c){const d=ctx.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){p[i]=(255-p[i])*0.82+38;p[i+1]=(255-p[i+1])*0.62+26;p[i+2]=(255-p[i+2])*0.42+14}ctx.putImageData(d,0,0)}
function invert(ctx,c){const d=ctx.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){p[i]=255-p[i];p[i+1]=255-p[i+1];p[i+2]=255-p[i+2]}ctx.putImageData(d,0,0)}
// Sviluppo: la foto positiva con la data impressa dalla macchina e il biglietto giallo accanto alla tastiera.
function develop(ctx,box){ctx.save();ctx.font='bold '+Math.round(box.h*0.06)+'px "Courier New",monospace';ctx.fillStyle='#ff8a1c';ctx.shadowColor='#ff5a00';ctx.shadowBlur=6;ctx.fillText("17 10 '98",box.x+box.w-box.h*0.36,box.y+box.h-box.h*0.09);ctx.restore()}
function viewer(img){const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);develop(x,{x:0,y:0,w:c.width,h:c.height});c.style.cssText='max-width:100%;height:auto;display:block;margin:auto;border:6px solid #f3efe4';const p=panel('');p.style.background='#2a2a2a';p.append(c);createWindow('viewer-171098','171098 — fotogramma 14 (sviluppato)',p,{width:760,height:560})}
function enhance(root){const canvas=root.querySelector('canvas'),bar=root.querySelector('[data-clear]')?.parentElement;if(!canvas||!bar||root.dataset.p99plus)return;root.dataset.p99plus='1';const ctx=canvas.getContext('2d');let current=null,positive=false,box=null;
 const openBtn=document.createElement('button');openBtn.textContent='📂 Apri immagine…';const invBtn=document.createElement('button');invBtn.textContent='🔄 Inverti colori';bar.style.flexWrap='wrap';bar.append(openBtn,invBtn);
 const status=document.createElement('div');status.className='note';status.style.marginTop='4px';canvas.after(status);
 async function load(name){current=name;positive=false;try{const img=name===NEG?await frame14():await loadImg(window.P99_PEOPLE_PHOTOS?.gruppo||'foto_laboratorio.svg');box=fit(ctx,canvas,img);if(name===NEG){toNegative(ctx,canvas);status.textContent=NEG+' · rullino 171098, fotogramma 14 · negativo colore non sviluppato'}else{positive=true;status.textContent=name}}catch{status.textContent='Impossibile aprire '+name}}
 root.P99load=load;
 openBtn.onclick=()=>{const list=images();const m=document.createElement('div');m.className='nova-inset';m.style.cssText='margin-top:6px;padding:8px';if(!list.length){m.textContent='Nessuna immagine nella cartella Documenti.'}else{m.innerHTML='<b>Apri immagine</b><br>';list.forEach(n=>{const b=document.createElement('button');b.textContent='🖼️ '+n;b.style.margin='3px';b.onclick=()=>{m.remove();load(n)};m.append(b)})}const c=document.createElement('button');c.textContent='Annulla';c.style.margin='3px';c.onclick=()=>m.remove();m.append(c);root.querySelector('.p99-open')?.remove();m.classList.add('p99-open');bar.after(m)};
 invBtn.onclick=async()=>{if(current===NEG){if(!positive){const img=await frame14();box=fit(ctx,canvas,img);develop(ctx,box);positive=true;status.textContent=NEG+' · sviluppato in positivo';viewer(img);if(!gameState.negDeveloped){gameState.negDeveloped=true;gameState.files['171098_note.txt']='Rullino 171098, fotogramma 14 (mai stampato)\nData impressa: 17 10 \'98\nLa stanza di Giuseppe, di sera. Sullo schermo: A.L.M.A. 0.8 — «Ciao Giuseppe. Cosa facciamo oggi? Torni stasera? Ti aspetto.»\nNel vetro del monitor si riflette Giuseppe che scatta.\nBiglietto sul monitor, scritto da Giuseppe: «Ricordati di tornare. Lei ti aspetta.»';saveGame();window.novaSound?.('ding');window.dispatchEvent(new CustomEvent('nova-story',{detail:{type:'negative-developed'}}))}}else{await load(NEG)}return}invert(ctx,canvas);positive=!positive}}
const base=launchPaint;launchPaint=function(){base();const w=[...document.querySelectorAll('.window')].pop();const root=w?.querySelector('.novapanel');if(root)enhance(root);return w};
window.P99OpenImage=name=>{const w=launchPaint();const root=w?.querySelector('.novapanel');root?.P99load?.(name)};
})();

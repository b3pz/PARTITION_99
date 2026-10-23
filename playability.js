/* PARTITION_99 responsive shell and accessible mini-games */
(function(){
'use strict';
const mobileCss = document.createElement('style');
mobileCss.textContent = `
.titlebar { touch-action:none }
@media(max-width:760px) {
  .window {min-width:0!important;resize:none!important;box-sizing:border-box!important}
  .window.mobile-window{left:4px!important;top:4px!important;width:calc(100% - 8px)!important;height:calc(100dvh - 48px)!important;max-height:calc(100dvh - 48px)!important}
  .window-content{min-height:0!important}
  .novapanel{padding:8px!important}
  .nova-split{grid-template-columns:1fr!important}
  .story-columns{grid-template-columns:repeat(auto-fit,minmax(140px,1fr))!important}
  .browser-toolbar{gap:2px!important;padding:3px!important}
  .browser-toolbar label,.browser-toolbar .brand{display:none!important}
  .browser-toolbar .navbtn{min-width:29px!important;padding:3px!important}
  .address{font-size:16px!important;min-width:65px!important}
  .web-page{padding:6px!important;overflow:auto}
  .web-page img{max-width:100%!important;height:auto!important}
  .taskbar{gap:2px!important;padding:3px!important}
  .task-button{min-width:66px!important;flex:0 0 105px!important;font-size:11px!important}
  #clock{min-width:80px!important;font-size:11px!important}
  #astro-widget{transform:scale(.63)!important;transform-origin:bottom right!important;right:2px!important;bottom:44px!important;z-index:15!important}
  .desktop-icons>.desktop-icon{width:96px!important;height:104px!important;min-height:104px!important;max-height:104px!important;padding:4px 2px!important;gap:4px!important}
  .desktop-icon .glyph{height:44px!important;min-height:44px!important}
  .desktop-icon span:last-child{font-size:11px!important;line-height:1.2!important;max-height:40px!important}
}
.mini-shell{background:#111a2f;color:#e6f3ff;padding:9px;height:100%;overflow:auto;font:14px Arial,sans-serif}
.mini-shell canvas{display:block;margin:8px auto;max-width:100%;height:auto;image-rendering:pixelated;background:#09101f;border:3px solid #8197bd;touch-action:none}
.mini-controls{display:flex;justify-content:center;align-items:center;gap:7px;flex-wrap:wrap;margin-top:8px}
.mini-controls button,.mini-shell button{font:700 16px Arial;min-width:48px;min-height:42px;padding:5px 10px;border:2px outset #ddd;background:#c0c0c0;color:#151515;touch-action:manipulation}
.mini-shell .mini-info{line-height:1.4;max-width:520px;margin:auto}
`;
document.head.append(mobileCss);
const wr=document.getElementById('windows');
function fit(){document.querySelectorAll('.window').forEach(w=>{w.classList.toggle('mobile-window',innerWidth<=760);if(innerWidth>760){const r=w.getBoundingClientRect();if(r.top>innerHeight-100)w.style.top='35px';if(r.left>innerWidth-220)w.style.left='25px'}})}
new MutationObserver(fit).observe(wr,{childList:true});window.addEventListener('resize',fit);fit();
function createGame(title,markup,width=640,height=490){const box=document.createElement('div');box.className='mini-shell';box.innerHTML=markup;const w=createWindow('mini-'+title,title,box,{width,height});fit();return {box,w}}
function bind(box,k,fn){const b=box.querySelector('[data-key="'+k+'"]');if(b)b.addEventListener('click',fn)}
function keysFor(w,handler){function key(e){if(!w.isConnected){document.removeEventListener('keydown',key);return}if(w.hidden||!w.classList.contains('active'))return;if(handler(e.key))e.preventDefault()}document.addEventListener('keydown',key)}
function score(k,v){try{gameState.scores[k]=Math.max(gameState.scores[k]||0,v);saveGame()}catch{}}
launchMaze=function(){
 const {box,w}=createGame('Signal Maze 2000','<div class="mini-info"><b>🟡 SIGNAL MAZE</b> — Raccogli 5 nodi e raggiungi l’uscita verde. Frecce / WASD oppure pulsanti. Nessun timer.</div><canvas width="480" height="290"></canvas><div class="mini-controls"><button data-key="left">◀</button><button data-key="up">▲</button><button data-key="down">▼</button><button data-key="right">▶</button><button data-key="restart">Ricomincia</button></div><p class="mini-info" data-info></p>',650,465);
 const c=box.querySelector('canvas'),ctx=c.getContext('2d'),info=box.querySelector('[data-info]');const walls=new Set(['2,1','2,2','2,3','5,0','5,1','5,2','7,3','7,4','3,4','4,4','5,4','1,4','8,1']);const nodes=['1,1','4,1','7,1','5,3','8,4'];let p,got,steps,done;
 function reset(){p={x:0,y:0};got=new Set();steps=0;done=false;draw()}
 function draw(){ctx.fillStyle='#061227';ctx.fillRect(0,0,480,290);for(let y=0;y<5;y++)for(let x=0;x<9;x++){const px=15+x*50,py=17+y*50;ctx.fillStyle=walls.has(x+','+y)?'#364b78':'#14283d';ctx.fillRect(px,py,46,46);ctx.strokeStyle='#273f5b';ctx.strokeRect(px,py,46,46);if(nodes.includes(x+','+y)&&!got.has(x+','+y)){ctx.fillStyle='#ffe361';ctx.beginPath();ctx.arc(px+23,py+23,10,0,7);ctx.fill()}if(x===8&&y===0){ctx.fillStyle='#13a86e';ctx.fillRect(px+12,py+12,22,22)}}ctx.fillStyle='#5bd5ff';ctx.fillRect(15+p.x*50+12,17+p.y*50+12,22,22);info.textContent=done?'Completato: cinque nodi collegati. Profilo di prova salvato.':'Nodi '+got.size+'/5 · Mosse '+steps+' · Uscita: quadrato verde in alto a destra.'}
 function move(dx,dy){if(done)return;const x=p.x+dx,y=p.y+dy;if(x<0||x>8||y<0||y>4||walls.has(x+','+y))return;p={x,y};steps++;if(nodes.includes(x+','+y))got.add(x+','+y);if(got.size===5&&x===8&&y===0){done=true;score('maze',500)}draw()}
 const dirs={ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0],ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1]};keysFor(w,k=>{const dir=dirs[k.toLowerCase()]||dirs[k];if(!dir)return false;move(...dir);return true});for(const [k,v] of Object.entries({left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}))bind(box,k,()=>move(...v));bind(box,'restart',reset);reset()
};
launchRunner=function(){
 const {box,w}=createGame('Pixel Runner 99','<div class="mini-info"><b>🏃 PIXEL RUNNER</b> — Tre settori: raccogli 3 segnali e raggiungi il terminale. Frecce / WASD; salta gli ostacoli con Spazio o con il pulsante. Nessun timer.</div><canvas width="540" height="260"></canvas><div class="mini-controls"><button data-key="left">◀ Indietro</button><button data-key="right">Avanti ▶</button><button data-key="jump">Salta ▲</button><button data-key="restart">Ricomincia</button></div><p class="mini-info" data-info></p>',660,460);
 const c=box.querySelector('canvas'),ctx=c.getContext('2d'),info=box.querySelector('[data-info]');let pos,jump,seen,finished,msg;const signals=[140,390,650],goal=800,obstacles=[240,480,710];function reset(){pos=20;jump=0;seen=new Set();finished=false;msg='';render()}
 const hit=x=>obstacles.find(o=>x+23>o&&x<o+28);
 function render(){const cam=Math.max(0,Math.min(400,pos-110));ctx.fillStyle='#8cbbe8';ctx.fillRect(0,0,540,260);ctx.fillStyle='#456b45';ctx.fillRect(0,205,540,55);for(const x of obstacles){ctx.fillStyle='#9c5b48';ctx.fillRect(x-cam,185,28,20)}for(let i=0;i<signals.length;i++)if(!seen.has(i)){ctx.fillStyle='#f5cf31';ctx.beginPath();ctx.arc(signals[i]-cam,158,12,0,7);ctx.fill()}ctx.fillStyle='#ed4545';ctx.fillRect(pos-cam,167-jump,23,38);ctx.fillStyle='#124979';ctx.fillRect(goal-cam,130,24,75);ctx.fillStyle='white';ctx.font='bold 14px Arial';ctx.fillText('Terminale',goal-cam-20,120);info.textContent=finished?'Percorso completato, segnale archiviato.':msg||'Segnali '+seen.size+'/3 · Settore '+(1+Math.min(2,Math.floor(pos/270)))+'/3 · Nessun limite di tempo.'}
 function step(n){if(finished)return;msg='';let next=Math.max(0,Math.min(goal,pos+n));const o=jump?null:hit(next);if(o){pos=n>0?o-24:o+29;msg='Ostacolo! Salta (Spazio / ▲) per superarlo.';render();return}pos=next;for(let i=0;i<signals.length;i++)if(Math.abs(pos-signals[i])<=28)seen.add(i);if(pos>=goal){if(seen.size===3){finished=true;score('runner',300)}else msg='Prima di finire raccogli tutti i segnali: torna indietro.'}render()}
 function leap(){if(jump||finished)return;jump=30;msg='';let t=0;const hop=setInterval(()=>{if(!w.isConnected){clearInterval(hop);return}step(18);if(++t<4)return;clearInterval(hop);jump=0;const o=hit(pos);if(o)pos=o+29;render()},100);render()}keysFor(w,k=>{if(['ArrowRight','d'].includes(k)){step(22);return true}if(['ArrowLeft','a'].includes(k)){step(-22);return true}if([' ','ArrowUp','w'].includes(k)){leap();return true}return false});bind(box,'right',()=>step(22));bind(box,'left',()=>step(-22));bind(box,'jump',leap);bind(box,'restart',reset);reset()
};
})();
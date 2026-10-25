/* NOVA 2000 — Signal Maze 2000, Pixel Runner 99, Spaccamattoni 99 e Difesa Orbitale 2000: giochi completi a 4 livelli.
   Agganci per la trama: window.P99Alma?.gameMessage(gioco,evento,dati) può restituire una frase da mostrare
   nelle schermate del gioco; window.P99Alma?.glitch(gioco) restituisce l'intensità (0-1) dei disturbi grafici.
   Ogni evento viene anche notificato con l'evento DOM «nova-game». */
(()=>{'use strict';
let launchBricks,launchInvaders;
const css=document.createElement('style');css.textContent=`
.g99{background:#0b1020;color:#dfe8ff;height:100%;display:flex;flex-direction:column;align-items:center;gap:6px;padding:6px;font:13px Arial,sans-serif;overflow:auto}
.g99 canvas{display:block;max-width:100%;height:auto;image-rendering:pixelated;border:3px solid #6f86b8;background:#000;touch-action:none;outline:none}
.g99-pad{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.g99-pad button{font:700 16px Arial;min-width:52px;min-height:44px;background:#c0c0c0;color:#111;border:2px outset #eee;touch-action:none;user-select:none;-webkit-user-select:none}
.g99-help{font-size:11px;color:#9fb0d6;text-align:center}
@media(hover:hover) and (min-width:761px){.g99-pad{display:none}}
`;document.head.append(css);
const say=(...a)=>window.novaSound?.(...a);
function emit(game,type,data={}){window.dispatchEvent(new CustomEvent('nova-game',{detail:{game,type,...data}}));try{return window.P99Alma?.gameMessage?.(game,type,data)||''}catch{return ''}}
function glitch(game){try{return Math.max(0,Math.min(1,Number(window.P99Alma?.glitch?.(game))||0))}catch{return 0}}
function almaTest(game,level){try{return window.P99Alma?.test?.(game,level)||null}catch{return null}}
function almaReport(game,data){try{window.P99Alma?.report?.(game,data)}catch{}}
// Fascia di ALMA in alto nel gioco, con la grafica del suo terminale.
function band(ctx,W,live){if(!live.t||live.n<=0)return;live.n--;ctx.fillStyle='rgba(6,18,28,.9)';ctx.fillRect(0,30,W,24);ctx.fillStyle='#1b3a6b';ctx.fillRect(0,30,W,2);ctx.fillStyle='#7dffb0';ctx.font='13px "Courier New",monospace';ctx.textAlign='center';ctx.fillText('> '+live.t,W/2,47);ctx.textAlign='left'}
function saveScore(k,v){try{gameState.scores[k]=Math.max(gameState.scores[k]||0,v);saveGame()}catch{}}
function shell(title,w,h,help,pad){const box=document.createElement('div');box.className='g99';box.innerHTML='<canvas tabindex="0" width="'+w+'" height="'+h+'"></canvas><div class="g99-pad">'+pad+'</div><div class="g99-help">'+help+'</div>';const win=createWindow('game-'+title,title,box,{width:w+60,height:h+150});const cv=box.querySelector('canvas');
 // Il focus passa al gioco: altrimenti INVIO sull'icona ancora selezionata aprirebbe una seconda copia.
 setTimeout(()=>{document.activeElement?.blur?.();cv.focus({preventScroll:true})},0);win.addEventListener('pointerdown',()=>cv.focus({preventScroll:true}));return {box,win,canvas:cv,ctx:cv.getContext('2d')}}
function alive(win){return win.isConnected}
function focused(win){return win.isConnected&&!win.hidden&&win.classList.contains('active')}
function wrapText(ctx,text,x,y,maxW,lh){const words=String(text).split(' ');let line='';for(const w of words){const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line,x,y);y+=lh;line=w}else line=t}if(line)ctx.fillText(line,x,y);return y}

/* ===================== SIGNAL MAZE 2000 ===================== */
const MAZES=[
["###################","#o.......#.......o#","#.##.###.#.###.##.#","#.................#","#.##.#.#####.#.##.#","#....#...G...#....#","####.###.#.###.####","#........P........#","#.##.##.###.##.##.#","#..#...........#..#","##.#.#.#####.#.#.##","#o...#.......#...o#","###################"],
["###################","#o.......#.......o#","#.#####.###.#####.#","#.#.............#.#","#.#.###.#G#.###.#.#","#.......#G#.......#","###.###.#.#.###.###","#.....#...P.#.....#","#.###.#.###.#.###.#","#.#.............#.#","#.#.###.#.#.###.#.#","#o......#.#......o#","###################"],
["###################","#o..#.........#..o#","#.#.#.#######.#.#.#","#.#...#.....#...#.#","#.###.#.#G#.#.###.#","#.......#G#.......#","#.#####.#.#.#####.#","#.......#P#.......#","###.###.#.#.###.###","#...#.........#...#","#.#.#.#######.#.#.#","#o#.............#o#","###################"],
["###################","#o.....#...#.....o#","#.###.#.#.#.#.###.#","#.#.....#G#.....#.#","#.#.###.#G#.###.#.#","#.....#.#G#.#.....#","#####.#.#.#.#.#####","#.........P.......#","#.###.#####.###.#.#","#...#...#...#...#.#","###.#.#.#.#.#.#.#.#","#o....#...#...#..o#","###################"]];
const HIST=[['GM_70',14820,'30/11/99'],['GM_70',12950,'14/11/99'],['GM_70',11200,'28/10/98'],['GM_70',9600,'17/10/98']];
function mazeTable(){let t=[];try{t=JSON.parse(localStorage.getItem('nova2000-maze-scores')||'[]')}catch{}const ghost=window.P99Act2?.mazeGhostRow?.();if(ghost)t=t.concat([ghost]);return HIST.concat(t).sort((a,b)=>b[1]-a[1]).slice(0,6)}
function mazeRecord(score){if(!score)return;let t=[];try{t=JSON.parse(localStorage.getItem('nova2000-maze-scores')||'[]')}catch{}t.push(['NOVA_USER',score,'23/12/99']);t.sort((a,b)=>b[1]-a[1]);try{localStorage.setItem('nova2000-maze-scores',JSON.stringify(t.slice(0,5)))}catch{}}

launchMaze=function(){
 const T=24,COLS=19,ROWS=13,W=COLS*T,H=ROWS*T+28;
 const {win,canvas,ctx,box}=shell('Signal Maze 2000',W,H,'Frecce / WASD per muoverti · INVIO per iniziare · P pausa','<button data-d="left">◀</button><button data-d="up">▲</button><button data-d="down">▼</button><button data-d="right">▶</button><button data-d="start">OK</button>');
 const DIRS={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]};
 let level=0,lives=3,score=0,grid,nodes,player,ghosts,mode='title',timer=0,fright=0,want=null,msg='',paused=false,total=0,route=null,rage=0,lastTile='';const live={t:'',n:0};
 const ghostColors=['#ff4d6d','#4dd8ff','#ffb347','#b48cff'];
 function load(l){grid=MAZES[l].map(r=>r.split(''));nodes=0;ghosts=[];const homes=[];for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=grid[y][x];if(c==='.'||c==='o')nodes++;if(c==='P'){player={x,y,px:x,py:y,dir:[0,0],sx:x,sy:y};grid[y][x]=' '}if(c==='G'){homes.push([x,y]);grid[y][x]=' '}}
  const n=Math.min(4,2+l);for(let i=0;i<n;i++){const [hx,hy]=homes[i%homes.length];ghosts.push({x:hx,y:hy,px:hx,py:hy,dir:[0,-1],home:[hx,hy],kind:i%3,color:ghostColors[i],eaten:false,delay:60+i*90})}}
 function open(x,y){return y>=0&&y<ROWS&&x>=0&&x<COLS&&grid[y][x]!=='#'}
 function reset(full){if(full){level=0;lives=3;score=0}load(level);fright=0;want=null}
 window.P99Skip=window.P99Skip||{};window.P99Skip.maze=()=>{if(mode!=='play'&&mode!=='ready'){reset(true);startLevel()}mode='clear';timer=40;score+=500*(level+1);msg=emit('maze','levelclear',{level:level+1,score})||'';say('tada')};
 function startLevel(){mode='ready';timer=110;msg=emit('maze','levelstart',{level:level+1,score})||'';say('click');route=null;rage=0;lastTile=player.x+','+player.y;
  // Prova di ALMA: la strada che faceva Giuseppe (nord, est, est) da seguire fino in fondo.
  if(almaTest('maze',level+1)){const pref=[DIRS.up,DIRS.right,DIRS.right];let x=player.x,y=player.y,prev=null,k=0;const path=[[x,y]];for(let i=0;i<60&&path.length<16;i++){const opts=[pref[k%3],DIRS.up,DIRS.right,DIRS.down,DIRS.left].filter(d=>open(x+d[0],y+d[1])&&!(prev&&d[0]===-prev[0]&&d[1]===-prev[1])&&!path.some(q=>q[0]===x+d[0]&&q[1]===y+d[1]));if(!opts.length)break;const d=opts[0];x+=d[0];y+=d[1];prev=d;path.push([x,y]);if(d===pref[k%3])k++}route={tiles:path.map(q=>q.join(',')),reached:0};live.t='Segui la sua strada.';live.n=320}}
 reset(true);
 const speed=()=>0.085+level*0.012, gspeed=g=>g.eaten?0.2:fright>0?0.05:0.07+level*0.011+(rage>0?0.035:0);
 function stepActor(a,sp,choose){if(Math.abs(a.px-a.x)<0.001&&Math.abs(a.py-a.y)<0.001){choose(a);const nx=a.x+a.dir[0],ny=a.y+a.dir[1];if(open(nx,ny)){a.x=nx;a.y=ny}else a.dir=[0,0]}
  const dx=a.x-a.px,dy=a.y-a.py,d=Math.hypot(dx,dy);if(d<=sp){a.px=a.x;a.py=a.y}else{a.px+=dx/d*sp;a.py+=dy/d*sp}}
 function choosePlayer(a){if(want&&open(a.x+want[0],a.y+want[1]))a.dir=want}
 function chooseGhost(g){const opts=Object.values(DIRS).filter(d=>open(g.x+d[0],g.y+d[1])&&!(d[0]===-g.dir[0]&&d[1]===-g.dir[1]));const list=opts.length?opts:Object.values(DIRS).filter(d=>open(g.x+d[0],g.y+d[1]));if(!list.length)return;
  let target;if(g.eaten)target=g.home;else if(fright>0)target=null;else if(rage>0||g.kind===0)target=[player.x,player.y];else if(g.kind===1)target=[player.x+player.dir[0]*4,player.y+player.dir[1]*4];else target=Math.hypot(g.x-player.x,g.y-player.y)>6?[player.x,player.y]:[1,ROWS-2];
  if(!target||Math.random()<0.12+(g.kind===2?0.2:0)){g.dir=list[Math.floor(Math.random()*list.length)];return}
  g.dir=list.reduce((b,d)=>Math.hypot(g.x+d[0]-target[0],g.y+d[1]-target[1])<Math.hypot(g.x+b[0]-target[0],g.y+b[1]-target[1])?d:b,list[0])}
 function update(){if(paused)return;if(mode==='ready'){if(--timer<=0)mode='play';return}
  if(mode==='dying'){if(--timer<=0){if(lives<=0){mode='over';mazeRecord(score);saveScore('maze',score);msg=emit('maze','gameover',{level:level+1,score})||'';say('error')}else{player.x=player.px=player.sx;player.y=player.py=player.sy;player.dir=[0,0];ghosts.forEach(g=>{g.x=g.px=g.home[0];g.y=g.py=g.home[1];g.eaten=false;g.delay=60});fright=0;startLevel()}}return}
  if(mode==='clear'){if(--timer<=0){level++;if(level>=MAZES.length){mode='win';mazeRecord(score);saveScore('maze',score);msg=emit('maze','win',{score})||'';say('tada')}else{load(level);startLevel()}}return}
  if(mode!=='play')return;
  stepActor(player,speed(),choosePlayer);const tile=player.x+','+player.y;if(route&&tile!==lastTile){const idx=route.tiles.indexOf(tile);if(idx>=0){route.reached=Math.max(route.reached,idx);if(idx===route.tiles.length-1){live.t='Ti ricordi.';live.n=180;almaReport('maze',{follow:true});route=null;say('ding')}}else{live.t='Non è la sua strada.';live.n=180;rage=300;almaReport('maze',{follow:false});route=null;say('error')}}lastTile=tile;if(rage>0)rage--;const c=grid[player.y][player.x];if(c==='.'||c==='o'){grid[player.y][player.x]=' ';nodes--;score+=c==='o'?50:10;if(c==='o'){fright=420;ghosts.forEach(g=>{if(!g.eaten)g.dir=[-g.dir[0],-g.dir[1]]});say('ding')}else if(nodes%3===0)say('blip');if(nodes<=0){mode='clear';timer=150;score+=500*(level+1);msg=emit('maze','levelclear',{level:level+1,score})||'';say('tada');return}}
  if(fright>0)fright--;
  for(const g of ghosts){if(g.delay>0){g.delay--;continue}stepActor(g,gspeed(g),chooseGhost);if(g.eaten&&g.x===g.home[0]&&g.y===g.home[1]&&g.px===g.x&&g.py===g.y)g.eaten=false;
   if(!g.eaten&&Math.hypot(g.px-player.px,g.py-player.py)<0.6){if(fright>0){g.eaten=true;score+=200;say('blip')}else{lives--;mode='dying';timer=90;say('bump');msg='';emit('maze','lifelost',{level:level+1,lives,score});return}}}}
 function draw(){const gl=glitch('maze');ctx.fillStyle='#03050d';ctx.fillRect(0,0,W,H);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=grid[y][x],X=x*T,Y=y*T+28;if(c==='#'){ctx.fillStyle=gl>0.4&&Math.random()<gl*0.02?'#7a1b2c':'#1d2f8a';ctx.fillRect(X+1,Y+1,T-2,T-2);ctx.strokeStyle='#4c6cff';ctx.strokeRect(X+3.5,Y+3.5,T-7,T-7)}else if(c==='.'){ctx.fillStyle='#f6e39a';ctx.fillRect(X+T/2-2,Y+T/2-2,4,4)}else if(c==='o'){ctx.fillStyle=(Date.now()>>8)%2?'#fff3a8':'#ffd23f';ctx.beginPath();ctx.arc(X+T/2,Y+T/2,6,0,7);ctx.fill()}}
  if(route){ctx.fillStyle='rgba(255,120,180,.35)';for(const t of route.tiles){const [rx,ry]=t.split(',').map(Number);ctx.fillRect(rx*T+T/2-5,ry*T+28+T/2-5,10,10)}}
  const px=player.px*T+T/2,py=player.py*T+T/2+28,mouth=mode==='play'?Math.abs(Math.sin(Date.now()/90))*0.7:0.3,ang=Math.atan2(player.dir[1],player.dir[0]||(player.dir[1]?0:1));
  if(mode!=='dying'||timer%10<5){ctx.fillStyle='#ffe44d';ctx.beginPath();ctx.moveTo(px,py);ctx.arc(px,py,T/2-3,ang+mouth/2,ang+Math.PI*2-mouth/2);ctx.fill()}
  for(const g of ghosts){const gx=g.px*T+T/2,gy=g.py*T+T/2+28;if(g.eaten){ctx.fillStyle='#fff';ctx.fillRect(gx-5,gy-3,4,4);ctx.fillRect(gx+1,gy-3,4,4);continue}
   ctx.fillStyle=fright>0?(fright<100&&fright%20<10?'#fff':'#2b3cff'):g.color;ctx.beginPath();ctx.arc(gx,gy-2,T/2-3,Math.PI,0);ctx.lineTo(gx+T/2-3,gy+T/2-3);for(let k=0;k<4;k++)ctx.lineTo(gx+T/2-3-(k+0.5)*((T-6)/4),gy+(k%2?T/2-3:T/2-7));ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(gx-6,gy-5,4,5);ctx.fillRect(gx+2,gy-5,4,5)}
  ctx.fillStyle='#0e1430';ctx.fillRect(0,0,W,28);ctx.fillStyle='#dfe8ff';ctx.font='bold 14px monospace';ctx.fillText('LIV '+(level+1)+'/4',8,19);ctx.fillText('PUNTI '+score,110,19);ctx.fillText('♥'.repeat(Math.max(0,lives)),W-70,19);if(mode==='play')band(ctx,W,live);
  if(gl>0){for(let i=0;i<gl*6;i++){if(Math.random()<0.3){const y=Math.random()*H;ctx.drawImage(canvas,0,y,W,6,(Math.random()-0.5)*16*gl,y,W,6)}}}
  const box=(lines,sub)=>{ctx.fillStyle='rgba(0,0,10,.85)';ctx.fillRect(24,48,W-48,H-66);ctx.strokeStyle='#4c6cff';ctx.strokeRect(24.5,48.5,W-49,H-67);ctx.textAlign='center';ctx.fillStyle='#ffe44d';ctx.font='bold 22px monospace';ctx.fillText(lines[0],W/2,80);ctx.font='13px monospace';ctx.fillStyle='#dfe8ff';let y=106;for(const l of lines.slice(1)){ctx.fillText(l,W/2,y);y+=18}if(msg){ctx.fillStyle='#ff9fb1';ctx.font='italic 13px monospace';y=wrapText(ctx,msg,W/2,y+6,W-90,17)+18}ctx.fillStyle='#9fb0d6';ctx.font='12px monospace';ctx.fillText(sub,W/2,H-28);ctx.textAlign='left'};
  if(mode==='title'){const t=mazeTable();box(['SIGNAL MAZE 2000','Raccogli tutti i nodi. Evita i glitch.','I nodi grandi li rendono vulnerabili.','','— CLASSIFICA —',...t.slice(0,5).map((r,i)=>(i+1)+'. '+r[0].padEnd(10)+String(r[1]).padStart(6)+'  '+r[2])],'INVIO / OK per iniziare')}
  else if(mode==='ready')box(['LIVELLO '+(level+1),'Pronti...'],'');
  else if(mode==='clear')box(['LIVELLO SUPERATO!','Bonus '+500*(level+1)],'');
  else if(mode==='over')box(['PARTITA FINITA','Punteggio: '+score],'INVIO / OK per riprovare');
  else if(mode==='win')box(['SEGNALE COMPLETO!','Hai superato tutti e 4 i labirinti.','Punteggio finale: '+score],'INVIO / OK per una nuova partita');
  if(paused){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.font='bold 20px monospace';ctx.textAlign='center';ctx.fillText('PAUSA',W/2,H/2);ctx.textAlign='left'}}
 function press(k){if(k==='start'){if(mode==='title'||mode==='over'||mode==='win'){msg='';reset(true);startLevel()}return}if(k==='pause'){if(mode==='play')paused=!paused;return}if(DIRS[k]){want=DIRS[k];if(mode==='play'&&!player.dir[0]&&!player.dir[1])choosePlayer(player)}}
 const keymap={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',Enter:'start',' ':'start',p:'pause'};
 const onKey=e=>{if(!alive(win)){document.removeEventListener('keydown',onKey);return}if(!focused(win))return;const k=keymap[e.key]||keymap[e.key.toLowerCase?.()];if(k){e.preventDefault();press(k)}};document.addEventListener('keydown',onKey);
 box.querySelectorAll('[data-d]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();press(b.dataset.d)}));
 let sw=null;canvas.addEventListener('pointerdown',e=>{sw=[e.clientX,e.clientY];if(mode!=='play')press('start')});canvas.addEventListener('pointerup',e=>{if(!sw)return;const dx=e.clientX-sw[0],dy=e.clientY-sw[1];sw=null;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;press(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'))});
 emit('maze','open',{});
 let last=performance.now(),acc=0;(function loop(now){if(!alive(win))return;acc+=Math.min(100,now-last);last=now;if(!win.hidden){while(acc>=16.67){update();acc-=16.67}draw()}else acc=0;requestAnimationFrame(loop)})(last);
};

/* ===================== PIXEL RUNNER 99 ===================== */
// Costruttore di livelli: colonne di terreno con buche, gradini, spine, piattaforme, segnali e nemici.
function buildLevel(spec){const ROWS=13,cols=[];const tiles=[];let x=0;const put=(cx,cy,ch)=>{while(tiles.length<=cx)tiles.push(Array(ROWS).fill(' '));tiles[cx][cy]=ch};
 const ground=(n,h=2)=>{for(let i=0;i<n;i++,x++)for(let y=ROWS-h;y<ROWS;y++)put(x,y,'#')};
 const ents=[];
 for(const [op,...a] of spec){if(op==='g')ground(a[0],a[1]||2);else if(op==='gap')for(let i=0;i<a[0];i++,x++)put(x,ROWS-1,' ');else if(op==='spike'){for(let i=0;i<a[0];i++,x++){for(let y=ROWS-2;y<ROWS;y++)put(x,y,'#');put(x,ROWS-3,'^')}}
  else if(op==='plat')for(let i=0;i<a[2];i++)put(x+a[0]+i,a[1],'=');else if(op==='coin')put(x+a[0],a[1],'o');else if(op==='enemy')ents.push({x:(x+a[0])*20,y:(ROWS-(a[1]||2)-1)*20});}
 const goal=x-3;for(let y=ROWS-6;y<ROWS-2;y++)put(goal,y,'F');
 return {tiles,ents,width:tiles.length,start:[2*20,(ROWS-4)*20]}}
const LEVELS=[
 [['g',14],['coin',-8,9],['coin',-5,9],['enemy',-3],['g',6],['gap',2],['g',8],['coin',-5,8],['coin',-4,8],['g',4,3],['g',4,4],['coin',-2,7],['g',10],['enemy',-6],['gap',2],['g',6],['plat',2,8,4],['coin',3,7],['coin',4,7],['g',12],['enemy',-5],['g',14]],
 [['g',10],['spike',2],['g',6],['coin',-3,8],['gap',3],['g',5],['enemy',-3],['g',3,3],['g',3,4],['gap',2],['g',4,4],['coin',-2,6],['g',8],['plat',1,8,3],['plat',5,6,3],['coin',6,5],['enemy',-4],['g',8],['spike',3],['g',6],['coin',-3,8],['gap',3],['g',8],['enemy',-4],['g',12]],
 [['g',8],['gap',3],['g',3],['gap',3],['g',4],['coin',-2,8],['spike',2],['g',5],['enemy',-3],['g',3,3],['g',3,5],['coin',-2,5],['gap',3],['g',4,5],['g',3,3],['enemy',-2,3],['g',8],['plat',0,8,3],['plat',4,6,3],['plat',8,4,3],['coin',9,3],['coin',10,3],['g',12],['spike',2],['g',3],['spike',2],['g',6],['enemy',-4],['enemy',-1],['g',12]],
 [['g',8],['enemy',-3],['spike',3],['g',4],['gap',3],['g',3,3],['gap',2],['g',3,4],['gap',3],['g',4,4],['coin',-2,6],['g',6],['enemy',-3],['spike',2],['g',3],['spike',2],['g',6],['plat',0,8,2],['plat',3,6,2],['plat',6,4,2],['coin',7,3],['g',10],['enemy',-6],['enemy',-3],['gap',3],['g',3],['gap',3],['g',6],['coin',-3,8],['spike',3],['g',5],['enemy',-3],['g',14]]
].map(buildLevel);

launchRunner=function(){
 const TS=20,VW=480,VH=13*TS+24;
 const {win,canvas,ctx,box}=shell('Pixel Runner 99',VW,VH,'← → per correre · SPAZIO / ↑ per saltare · salta sui nemici per eliminarli · INVIO per iniziare','<button data-k="left">◀</button><button data-k="right">▶</button><button data-k="jump">SALTA</button><button data-k="start">OK</button>');
 const held={left:false,right:false,jump:false};
 let L,tiles,level=0,lives=3,score=0,signals=0,p,ens,cam=0,mode='title',timer=0,msg='',paused=false,coyote=0,ghostTest=false,ghostGot=false,lockCool=0;const live={t:'',n:0};
 function solid(tx,ty){if(tx<0)return true;if(tx>=tiles.length||ty<0)return false;if(ty>=13)return false;const c=tiles[tx][ty];return c==='#'||c==='='}
 function load(l){L=LEVELS[l];tiles=L.tiles.map(c=>c.slice());ens=L.ents.map(e=>({x:e.x,y:e.y,vx:-0.9,dead:0}));p={x:L.start[0],y:L.start[1],vx:0,vy:0,ground:false,face:1,inv:0};cam=0}
 function startLevel(){mode='ready';timer=100;msg=emit('runner','levelstart',{level:level+1,score})||'';say('click');
  // Prova di ALMA: il terminale si apre solo se passi prima da sinistra, come faceva Giuseppe (preferred_route=LEFT).
  ghostTest=!!almaTest('runner',level+1);ghostGot=false;if(ghostTest){tiles[0]=tiles[0]||Array(13).fill(' ');tiles[0][9]='g'}}
 function reset(){level=window.P99Act2?.runnerStartLevel?.()||0;lives=3;score=0;signals=0;load(level)}
 window.P99Skip=window.P99Skip||{};window.P99Skip.runner=()=>{if(mode!=='play'&&mode!=='ready'){reset();startLevel()}mode='clear';timer=40;score+=1000;msg=emit('runner','levelclear',{level:level+1,score,signals})||'';say('tada')};
 reset();
 function collide(o,w,h){o.ground=false;o.x+=o.vx;let l=Math.floor(o.x/TS),r=Math.floor((o.x+w-1)/TS),t=Math.floor(o.y/TS),b=Math.floor((o.y+h-1)/TS);for(let ty=t;ty<=b;ty++){if(o.vx>0&&solid(r,ty)){o.x=r*TS-w;o.vx=0;o.hitWall=true}else if(o.vx<0&&solid(l,ty)){o.x=(l+1)*TS;o.vx=0;o.hitWall=true}}
  o.y+=o.vy;l=Math.floor(o.x/TS);r=Math.floor((o.x+w-1)/TS);t=Math.floor(o.y/TS);b=Math.floor((o.y+h-1)/TS);for(let tx=l;tx<=r;tx++){if(o.vy>0&&solid(tx,b)){o.y=b*TS-h;o.vy=0;o.ground=true}else if(o.vy<0&&solid(tx,t)){o.y=(t+1)*TS;o.vy=0}}}
 function die(){lives--;say('bump');mode='dying';timer=80;p.vy=-7;emit('runner','lifelost',{level:level+1,lives,score})}
 function update(){if(paused)return;if(mode==='ready'){if(--timer<=0)mode='play';return}
  if(mode==='dying'){p.vy+=0.5;p.y+=p.vy;if(--timer<=0){if(lives<=0){mode='over';saveScore('runner',score);msg=emit('runner','gameover',{level:level+1,score})||'';say('error')}else{load(level);startLevel()}}return}
  if(mode==='clear'){if(--timer<=0){level++;if(level>=LEVELS.length){mode='win';saveScore('runner',score);msg=emit('runner','win',{score,signals})||'';say('tada')}else{load(level);startLevel()}}return}
  if(mode!=='play')return;
  if(!live.n){const feed=window.P99Act2?.runnerFeed?.(level+1);if(feed){live.t=feed;live.n=330}}
  const acc=0.45,max=2.8;if(held.left){p.vx=Math.max(-max,p.vx-acc);p.face=-1}else if(held.right){p.vx=Math.min(max,p.vx+acc);p.face=1}else p.vx*=0.75;if(Math.abs(p.vx)<0.05)p.vx=0;
  coyote=p.ground?6:Math.max(0,coyote-1);if(held.jump&&coyote>0){p.vy=-9.2;coyote=0;held.jump=false;say('jump')}
  p.vy=Math.min(10,p.vy+0.48);collide(p,14,18);if(p.inv>0)p.inv--;
  const cx=Math.floor((p.x+7)/TS),cy=Math.floor((p.y+9)/TS);for(const [tx,ty] of [[cx,cy],[cx,cy-1]]){const c=tiles[tx]?.[ty];if(c==='o'){tiles[tx][ty]=' ';signals++;score+=100;say('blip')}if(c==='g'){tiles[tx][ty]=' ';ghostGot=true;live.t='Come lui. Prima a sinistra.';live.n=180;almaReport('runner',{left:true});say('ding')}if(c==='F'&&ghostTest&&!ghostGot){if(lockCool<=0){live.t='Il terminale non risponde. Lui passava prima da sinistra.';live.n=200;say('error');lockCool=120}p.x-=4;p.vx=-2;continue}if(c==='F'){mode='clear';timer=140;score+=1000;msg=emit('runner','levelclear',{level:level+1,score,signals})||'';say('tada');return}}
  const footY=Math.floor((p.y+18)/TS);for(const tx of [Math.floor(p.x/TS),Math.floor((p.x+13)/TS)])if(tiles[tx]?.[footY-1]==='^'||tiles[tx]?.[Math.floor((p.y+12)/TS)]==='^'){die();return}
  if(p.y>13*TS){die();return}
  for(const e of ens){if(e.dead){e.dead++;continue}e.vy=(e.vy||0)+0.5;const dir=Math.sign(e.vx)||1;e.hitWall=false;collide(e,16,16);if(e.hitWall)e.vx=-dir*0.9;const ahead=Math.floor((e.x+(e.vx>0?17:-1))/TS),below=Math.floor((e.y+17)/TS);if(e.ground&&!solid(ahead,below))e.vx=-e.vx;
   if(Math.abs(e.x+8-(p.x+7))<14&&Math.abs(e.y+8-(p.y+9))<16){if(p.vy>0&&p.y+18-e.y<10){e.dead=1;p.vy=-6;score+=200;say('blip')}else if(!p.inv){die();return}}}
  if(lockCool>0)lockCool--;cam=Math.max(0,Math.min(tiles.length*TS-VW,p.x-VW*0.4))}
 function draw(){const gl=glitch('runner');const sky=ctx.createLinearGradient(0,0,0,VH);sky.addColorStop(0,['#5aa0e8','#f0a35e','#6b5aa8','#1b2240'][level]);sky.addColorStop(1,'#cfe6ff');ctx.fillStyle=sky;ctx.fillRect(0,0,VW,VH);
  ctx.fillStyle='rgba(60,110,80,.55)';for(let i=0;i<8;i++){const hx=((i*170-cam*0.3)%(VW+200)+VW+200)%(VW+200)-100;ctx.beginPath();ctx.arc(hx,VH-30,90,Math.PI,0);ctx.fill()}
  const off=24,first=Math.floor(cam/TS),lastc=first+Math.ceil(VW/TS)+1;
  for(let tx=first;tx<=lastc;tx++){const col=tiles[tx];if(!col)continue;for(let ty=0;ty<13;ty++){const c=col[ty],X=tx*TS-cam,Y=ty*TS+off;if(c==='#'){const top=ty===0||col[ty-1]!=='#';ctx.fillStyle=top?'#3f9b4b':'#8a5a33';ctx.fillRect(X,Y,TS,TS);if(top){ctx.fillStyle='#8a5a33';ctx.fillRect(X,Y+6,TS,TS-6)}ctx.strokeStyle='rgba(0,0,0,.15)';ctx.strokeRect(X+.5,Y+.5,TS-1,TS-1)}
   else if(c==='='){ctx.fillStyle='#c48a3a';ctx.fillRect(X,Y,TS,8);ctx.fillStyle='#7a4f1e';ctx.fillRect(X,Y+6,TS,2)}
   else if(c==='^'){ctx.fillStyle='#d8dde8';for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(X+k*7,Y+TS);ctx.lineTo(X+k*7+3.5,Y+6);ctx.lineTo(X+k*7+7,Y+TS);ctx.fill()}}
   else if(c==='g'){ctx.fillStyle='rgba(125,255,176,'+(0.45+Math.sin(Date.now()/200)*0.25)+')';ctx.beginPath();ctx.arc(X+10,Y+10,7,0,7);ctx.fill();ctx.fillStyle='#06121c';ctx.font='bold 7px monospace';ctx.fillText('GM',X+4,Y+13)}
   else if(c==='o'){ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(X+10,Y+10,6+Math.sin(Date.now()/150+tx)*1.2,0,7);ctx.fill();ctx.fillStyle='#fff6';ctx.fillRect(X+7,Y+6,3,3)}
   else if(c==='F'&&col[ty-1]!=='F'){ctx.fillStyle='#14365f';ctx.fillRect(X+2,Y,18,80);ctx.fillStyle='#7fe0ff';ctx.fillRect(X+5,Y+6,12,9);ctx.fillStyle='#fff';ctx.font='9px monospace';ctx.fillText('NOVA',X+1,Y-3)}}}
  for(const e of ens){if(e.dead>30)continue;const X=e.x-cam,Y=e.y+off;ctx.fillStyle=e.dead?'#666':'#8b3fb8';ctx.fillRect(X,Y+(e.dead?10:0),16,e.dead?6:16);if(!e.dead){ctx.fillStyle='#fff';ctx.fillRect(X+3,Y+4,4,4);ctx.fillRect(X+9,Y+4,4,4);ctx.fillStyle='#000';ctx.fillRect(X+(e.vx>0?5:3),Y+5,2,2);ctx.fillRect(X+(e.vx>0?11:9),Y+5,2,2)}}
  if(!(p.inv%6>2)){const X=p.x-cam,Y=p.y+off;ctx.fillStyle='#e23b3b';ctx.fillRect(X,Y+4,14,14);ctx.fillStyle='#ffd7b0';ctx.fillRect(X+2,Y-2,10,8);ctx.fillStyle='#222';ctx.fillRect(X+(p.face>0?8:3),Y+1,2,2);ctx.fillStyle='#24418f';ctx.fillRect(X,Y+15,5,3);ctx.fillRect(X+9,Y+15,5,3)}
  ctx.fillStyle='#0e1430';ctx.fillRect(0,0,VW,24);ctx.fillStyle='#dfe8ff';ctx.font='bold 13px monospace';ctx.fillText('LIV '+(level+1)+'/4',8,17);ctx.fillText('SEGNALI '+signals,90,17);ctx.fillText('PUNTI '+score,210,17);ctx.fillText('♥'.repeat(Math.max(0,lives)),VW-60,17);if(mode==='play')band(ctx,VW,live);
  if(gl>0){for(let i=0;i<gl*6;i++)if(Math.random()<0.3){const y=Math.random()*VH;ctx.drawImage(canvas,0,y,VW,5,(Math.random()-0.5)*18*gl,y,VW,5)}if(Math.random()<gl*0.05){ctx.fillStyle='rgba(255,0,60,.15)';ctx.fillRect(0,0,VW,VH)}}
  const box=(lines,sub)=>{ctx.fillStyle='rgba(5,10,30,.84)';ctx.fillRect(40,44,VW-80,VH-80);ctx.strokeStyle='#7fe0ff';ctx.strokeRect(40.5,44.5,VW-81,VH-81);ctx.textAlign='center';ctx.fillStyle='#ffd23f';ctx.font='bold 22px monospace';ctx.fillText(lines[0],VW/2,78);ctx.font='13px monospace';ctx.fillStyle='#dfe8ff';let y=104;for(const l of lines.slice(1)){ctx.fillText(l,VW/2,y);y+=18}if(msg){ctx.fillStyle='#ff9fb1';ctx.font='italic 13px monospace';wrapText(ctx,msg,VW/2,y+6,VW-120,17)}ctx.fillStyle='#9fb0d6';ctx.font='12px monospace';ctx.fillText(sub,VW/2,VH-46);ctx.textAlign='left'};
  if(mode==='title')box(['PIXEL RUNNER 99','4 settori · raccogli i segnali','raggiungi il terminale NOVA','Record: '+(gameState.scores.runner||0)],'INVIO / OK per iniziare');
  else if(mode==='ready')box(['SETTORE '+(level+1),['Il prato','Il tramonto','La notte viola','Il segnale perduto'][level]],'');
  else if(mode==='clear')box(['SETTORE COMPLETATO!','Segnali raccolti: '+signals],'');
  else if(mode==='over')box(['PARTITA FINITA','Punteggio: '+score],'INVIO / OK per riprovare');
  else if(mode==='win')box(['TERMINALE RAGGIUNTO!','Hai completato i 4 settori.','Punteggio: '+score+' · Segnali: '+signals],'INVIO / OK per una nuova partita');
  if(paused){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,VW,VH);ctx.fillStyle='#fff';ctx.font='bold 20px monospace';ctx.textAlign='center';ctx.fillText('PAUSA',VW/2,VH/2);ctx.textAlign='left'}}
 function start(){if(mode==='title'||mode==='over'||mode==='win'){msg='';reset();startLevel()}}
 const km={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'jump',w:'jump',' ':'jump'};
 const down=e=>{if(!alive(win)){cleanup();return}if(!focused(win))return;if(e.key==='Enter'){e.preventDefault();start();return}if(e.key==='p'&&mode==='play'){paused=!paused;return}const k=km[e.key]||km[e.key.toLowerCase?.()];if(k){e.preventDefault();if(k==='jump'){if(mode!=='play'){start();return}if(!e.repeat)held.jump=true}else held[k]=true}};
 const up=e=>{const k=km[e.key]||km[e.key.toLowerCase?.()];if(k&&k!=='jump')held[k]=false};
 function cleanup(){document.removeEventListener('keydown',down);document.removeEventListener('keyup',up)}
 document.addEventListener('keydown',down);document.addEventListener('keyup',up);
 box.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();if(k==='start'){start();return}if(k==='jump'){if(mode!=='play'){start();return}held.jump=true}else held[k]=true});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{if(k==='left'||k==='right')held[k]=false}))});
 canvas.addEventListener('pointerdown',()=>{if(mode!=='play')start()});
 emit('runner','open',{});
 let last=performance.now(),acc=0;(function loop(now){if(!alive(win)){cleanup();return}acc+=Math.min(100,now-last);last=now;if(!win.hidden){while(acc>=16.67){update();acc-=16.67}draw()}else{acc=0;held.left=held.right=false}requestAnimationFrame(loop)})(last);
};

/* ===================== SPACCAMATTONI 99 ===================== */
// Legenda: . vuoto · 1 mattone · 2 mattone rinforzato · # indistruttibile
const BRICKS=[
 ["..........","1111111111","1111111111","2222222222","1111111111",".........."],
 ["2........2","21......12","2111..1112","..2111112.","...2112...","....22...."],
 ["#1111111#.","1.2.2.2.1.","1111111111","..#....#..","1212121212","2222222222"],
 [".22...22..","2112.2112.","2111211112","2111111112",".21111112.","..211112..","...2112...","....22...."]];
launchBricks=function(){
 const W=480,H=380,COLS=10,BW=44,BH=16,OX=20,OY=54;
 const {win,canvas,ctx,box}=shell('Spaccamattoni 99',W,H,'← → o trascina per muovere la racchetta · SPAZIO / tocco per lanciare · INVIO per iniziare','<button data-k="left">◀</button><button data-k="launch">LANCIA</button><button data-k="right">▶</button>');
 let level=0,lives=3,score=0,bricks=[],pad,ball,mode='title',timer=0,msg='',held={left:false,right:false},drops=[],big=0,slow=0,brickTest=false,regrown=false;const live={t:'',n:0};
 function load(l){bricks=[];BRICKS[l].forEach((row,y)=>[...row].forEach((c,x)=>{if(c!=='.')bricks.push({x:OX+x*BW,y:OY+y*(BH+4),hp:c==='#'?-1:+c,max:c==='#'?-1:+c})}));pad={x:W/2-40,w:80};drops=[];big=0;slow=0;resetBall()}
 function resetBall(){ball={x:pad.x+pad.w/2,y:H-46,vx:0,vy:0,stuck:true}}
 function startLevel(){mode='ready';timer=90;msg=emit('bricks','levelstart',{level:level+1,score})||'';say('click');brickTest=!!almaTest('bricks',level+1);regrown=false}
 function newGame(){level=0;lives=3;score=0;load(0);startLevel()}
 load(0);
 function launch(){if(mode!=='play'||!ball.stuck)return;ball.stuck=false;const sp=4+level*0.4;ball.vx=sp*0.6*(Math.random()<.5?-1:1);ball.vy=-sp*0.8}
 function update(){if(mode==='ready'){if(--timer<=0)mode='play';return}
  if(mode==='clear'){if(--timer<=0){level++;if(level>=BRICKS.length){mode='win';saveScore('bricks',score);msg=emit('bricks','win',{score})||'';say('tada')}else{load(level);startLevel()}}return}
  if(mode!=='play')return;
  const pv=6;if(held.left)pad.x-=pv;if(held.right)pad.x+=pv;pad.w=big>0?120:80;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));if(big>0)big--;if(slow>0)slow--;
  if(ball.stuck){ball.x=pad.x+pad.w/2;ball.y=H-46;return}
  const k=slow>0?0.6:1,steps=3;for(let s=0;s<steps;s++){ball.x+=ball.vx*k/steps;ball.y+=ball.vy*k/steps;
   if(ball.x<6){ball.x=6;ball.vx=Math.abs(ball.vx)}if(ball.x>W-6){ball.x=W-6;ball.vx=-Math.abs(ball.vx)}if(ball.y<36){ball.y=36;ball.vy=Math.abs(ball.vy)}
   if(ball.vy>0&&ball.y>=H-40&&ball.y<=H-30&&ball.x>=pad.x-4&&ball.x<=pad.x+pad.w+4){const t=(ball.x-(pad.x+pad.w/2))/(pad.w/2),sp=Math.hypot(ball.vx,ball.vy);const ang=t*1.05;ball.vx=sp*Math.sin(ang);ball.vy=-Math.abs(sp*Math.cos(ang));ball.y=H-41;say('click')}
   for(const b of bricks){if(b.hp===0)continue;if(ball.x>b.x-5&&ball.x<b.x+BW-3&&ball.y>b.y-5&&ball.y<b.y+BH+5){const ox=Math.min(ball.x-(b.x-5),b.x+BW-3-ball.x),oy=Math.min(ball.y-(b.y-5),b.y+BH+5-ball.y);if(ox<oy)ball.vx=-ball.vx;else ball.vy=-ball.vy;
     if(b.hp>0){b.hp--;if(b.hp===0){score+=b.max*50;say('blip');if(Math.random()<0.12)drops.push({x:b.x+BW/2,y:b.y,kind:Math.random()<0.5?'L':'S'})}else{score+=10;say('bump')}}else say('click');
     const sp=Math.hypot(ball.vx,ball.vy);if(sp<9){ball.vx*=1.01;ball.vy*=1.01}break}}}
  for(const d of drops){d.y+=2;if(d.y>H-42&&d.y<H-28&&d.x>pad.x&&d.x<pad.x+pad.w){d.got=true;if(d.kind==='L')big=900;else slow=600;say('ding')}}drops=drops.filter(d=>!d.got&&d.y<H);
  if(ball.y>H+10){lives--;say('bump');emit('bricks','lifelost',{level:level+1,lives,score});if(lives<=0){mode='over';saveScore('bricks',score);msg=emit('bricks','gameover',{level:level+1,score})||'';say('error')}else{resetBall();mode='ready';timer=60;msg=''}return}
  // Prova di ALMA: quando il muro sta per cadere, rimette qualche mattone.
  if(brickTest&&!regrown&&bricks.filter(b=>b.hp>0).length===1){regrown=true;bricks.filter(b=>b.hp===0&&b.max>0).sort(()=>Math.random()-0.5).slice(0,4).forEach(b=>b.hp=1);live.t='Non ancora. Lui non finiva mai il muro.';live.n=200;almaReport('bricks',{});say('error')}
  if(!bricks.some(b=>b.hp>0)){mode='clear';timer=120;score+=500*(level+1);msg=emit('bricks','levelclear',{level:level+1,score})||'';say('tada')}}
 const colors=['','#4dd8ff','#ff8a3d'];
 function draw(){const gl=glitch('bricks');const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#101a3a');g.addColorStop(1,'#05070f');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(const b of bricks){if(b.hp===0)continue;ctx.fillStyle=b.hp<0?'#8b8fa3':b.hp===2?colors[2]:(b.max===2?'#c96a2a':colors[1]);ctx.fillRect(b.x,b.y,BW-4,BH);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(b.x,b.y,BW-4,3);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(b.x,b.y+BH-3,BW-4,3)}
  for(const d of drops){ctx.fillStyle=d.kind==='L'?'#7dff9a':'#ffd23f';ctx.fillRect(d.x-12,d.y,24,10);ctx.fillStyle='#000';ctx.font='bold 9px monospace';ctx.fillText(d.kind,d.x-3,d.y+8)}
  ctx.fillStyle='#dfe8ff';ctx.fillRect(pad.x,H-38,pad.w,8);ctx.fillStyle='#4c6cff';ctx.fillRect(pad.x+4,H-36,pad.w-8,4);
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ball.x,ball.y,5,0,7);ctx.fill();
  ctx.fillStyle='#0e1430';ctx.fillRect(0,0,W,28);ctx.fillStyle='#dfe8ff';ctx.font='bold 13px monospace';ctx.fillText('LIV '+(level+1)+'/4',8,19);ctx.fillText('PUNTI '+score,110,19);ctx.fillText('♥'.repeat(Math.max(0,lives)),W-60,19);if(mode==='play')band(ctx,W,live);if(big>0)ctx.fillText('L',260,19);if(slow>0)ctx.fillText('S',280,19);
  if(gl>0){for(let i=0;i<gl*6;i++)if(Math.random()<0.3){const y=Math.random()*H;ctx.drawImage(canvas,0,y,W,5,(Math.random()-0.5)*18*gl,y,W,5)}}
  const panelBox=(lines,sub)=>{if(!sub&&lines.length<=2&&!msg){ctx.fillStyle='rgba(5,8,25,.8)';ctx.fillRect(0,H/2-34,W,64);ctx.textAlign='center';ctx.fillStyle='#ffd23f';ctx.font='bold 20px monospace';ctx.fillText(lines[0],W/2,H/2-6);ctx.font='13px monospace';ctx.fillStyle='#dfe8ff';if(lines[1])ctx.fillText(lines[1],W/2,H/2+16);ctx.textAlign='left';return}ctx.fillStyle='rgba(5,8,25,.86)';ctx.fillRect(40,70,W-80,H-120);ctx.strokeStyle='#4dd8ff';ctx.strokeRect(40.5,70.5,W-81,H-121);ctx.textAlign='center';ctx.fillStyle='#ffd23f';ctx.font='bold 22px monospace';ctx.fillText(lines[0],W/2,104);ctx.font='13px monospace';ctx.fillStyle='#dfe8ff';let y=132;for(const l of lines.slice(1)){ctx.fillText(l,W/2,y);y+=19}if(msg){ctx.fillStyle='#ff9fb1';ctx.font='italic 13px monospace';wrapText(ctx,msg,W/2,y+8,W-120,17)}ctx.fillStyle='#9fb0d6';ctx.font='12px monospace';ctx.fillText(sub,W/2,H-62);ctx.textAlign='left'};
  if(mode==='title')panelBox(['SPACCAMATTONI 99','Rompi tutti i mattoni colorati.','Arancio: due colpi. Grigio: indistruttibile.','Bonus: L racchetta lunga · S pallina lenta','Record: '+(gameState.scores.bricks||0)],'INVIO / tocco per iniziare');
  else if(mode==='ready')panelBox(['LIVELLO '+(level+1),'SPAZIO / LANCIA per partire'],'');
  else if(mode==='clear')panelBox(['MURO ABBATTUTO!','Bonus '+500*(level+1)],'');
  else if(mode==='over')panelBox(['PARTITA FINITA','Punteggio: '+score],'INVIO / tocco per riprovare');
  else if(mode==='win')panelBox(['TUTTI I MURI ABBATTUTI!','Punteggio finale: '+score],'INVIO / tocco per una nuova partita')}
 function start(){if(mode==='title'||mode==='over'||mode==='win'){msg='';newGame()}else if(mode==='ready'&&lives>0){mode='play';launch()}else launch()}
 const km={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
 const down=e=>{if(!alive(win)){cleanup();return}if(!focused(win))return;if(e.key==='Enter'||e.key===' '){e.preventDefault();start();return}const k=km[e.key]||km[e.key.toLowerCase?.()];if(k){e.preventDefault();held[k]=true}};
 const up=e=>{const k=km[e.key]||km[e.key.toLowerCase?.()];if(k)held[k]=false};
 function cleanup(){document.removeEventListener('keydown',down);document.removeEventListener('keyup',up)}
 document.addEventListener('keydown',down);document.addEventListener('keyup',up);
 const toCanvas=e=>{const r=canvas.getBoundingClientRect();return (e.clientX-r.left)*W/r.width};
 canvas.addEventListener('pointerdown',e=>{if(mode!=='play'){start();return}if(ball.stuck)launch();pad.x=toCanvas(e)-pad.w/2});canvas.addEventListener('pointermove',e=>{if(mode==='play'&&(e.buttons||e.pointerType==='mouse'))pad.x=toCanvas(e)-pad.w/2});
 box.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();if(k==='launch')start();else held[k]=true});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{if(k!=='launch')held[k]=false}))});
 emit('bricks','open',{});
 let last=performance.now(),acc=0;(function loop(now){if(!alive(win)){cleanup();return}acc+=Math.min(100,now-last);last=now;if(!win.hidden){while(acc>=16.67){update();acc-=16.67}draw()}else{acc=0;held.left=held.right=false}requestAnimationFrame(loop)})(last);
};

/* ===================== DIFESA ORBITALE 2000 ===================== */
launchInvaders=function(){
 const W=480,H=380;
 const {win,canvas,ctx,box}=shell('Difesa Orbitale 2000',W,H,'← → per muoverti · SPAZIO per sparare · INVIO per iniziare','<button data-k="left">◀</button><button data-k="fire">FUOCO</button><button data-k="right">▶</button>');
 let wave=0,lives=3,score=0,ship,aliens,dir,shots,bombs,shields,ufo,mode='title',timer=0,msg='',held={left:false,right:false,fire:false},cool=0,tick=0,frame=0,invTest=false,inverted=0,invClock=0;const live={t:'',n:0};
 function load(w){ship={x:W/2};shots=[];bombs=[];ufo=null;dir=1;tick=0;aliens=[];const rows=4+Math.min(1,w),cols=8;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)aliens.push({x:60+c*42,y:60+r*30+w*8,row:r,alive:true});
  shields=[];for(let s=0;s<4;s++)for(let y=0;y<3;y++)for(let x=0;x<6;x++)if(!(y===2&&(x===2||x===3)))shields.push({x:62+s*104+x*8,y:H-92+y*8,hp:3})}
 function startWave(){mode='ready';timer=90;msg=emit('invaders','levelstart',{level:wave+1,score})||'';say('click');invTest=!!almaTest('invaders',wave+1);inverted=0;invClock=0}
 function newGame(){wave=0;lives=3;score=0;load(0);startWave()}
 load(0);
 function hitShield(o){for(const s of shields)if(s.hp>0&&o.x>s.x-2&&o.x<s.x+8&&o.y>s.y&&o.y<s.y+8){s.hp--;return true}return false}
 function update(){frame++;if(mode==='ready'){if(--timer<=0)mode='play';return}
  if(mode==='dying'){if(--timer<=0){if(lives<=0){mode='over';saveScore('invaders',score);msg=emit('invaders','gameover',{level:wave+1,score})||'';say('error')}else{bombs=[];mode='play'}}return}
  if(mode==='clear'){if(--timer<=0){wave++;if(wave>=4){mode='win';saveScore('invaders',score);msg=emit('invaders','win',{score})||'';say('tada')}else{load(wave);startWave()}}return}
  if(mode!=='play')return;
  // Prova di ALMA: ogni tanto inverte i comandi.
  if(invTest&&++invClock%600===300){inverted=180;live.t='Ricordi come si gioca?';live.n=180;say('error')}if(inverted>0)inverted--;const L=inverted>0?held.right:held.left,R=inverted>0?held.left:held.right;
  if(L)ship.x-=3.6;if(R)ship.x+=3.6;ship.x=Math.max(18,Math.min(W-18,ship.x));if(cool>0)cool--;if(held.fire&&cool===0&&shots.length<2){shots.push({x:ship.x,y:H-44});cool=18;say('blip')}
  const alv=aliens.filter(a=>a.alive);const interval=Math.max(3,Math.floor(alv.length*0.9)-wave*4);if(++tick>=interval){tick=0;let edge=false;for(const a of alv){a.x+=dir*8;if(a.x<20||a.x>W-20)edge=true}if(edge){dir=-dir;for(const a of alv)a.y+=14}say('click')}
  if(Math.random()<0.012+wave*0.006&&alv.length){const a=alv[Math.floor(Math.random()*alv.length)];bombs.push({x:a.x,y:a.y+10})}
  if(!ufo&&Math.random()<0.002)ufo={x:-30,v:2};if(ufo){ufo.x+=ufo.v;if(ufo.x>W+30)ufo=null}
  for(const s of shots){s.y-=7;if(hitShield(s)){s.dead=true;continue}for(const a of alv)if(!s.dead&&Math.abs(s.x-a.x)<14&&Math.abs(s.y-a.y)<11){a.alive=false;s.dead=true;score+=(4-Math.min(3,a.row))*10+10;say('bump')}if(ufo&&!s.dead&&Math.abs(s.x-ufo.x)<18&&s.y<46&&s.y>26){score+=300;ufo=null;s.dead=true;say('ding')}}shots=shots.filter(s=>!s.dead&&s.y>30);
  for(const b of bombs){b.y+=3+wave*0.4;if(hitShield(b)){b.dead=true;continue}if(Math.abs(b.x-ship.x)<15&&b.y>H-44&&b.y<H-28){b.dead=true;lives--;say('bump');emit('invaders','lifelost',{level:wave+1,lives,score});mode='dying';timer=70;return}}bombs=bombs.filter(b=>!b.dead&&b.y<H);
  for(const a of alv){for(const s of shields)if(s.hp>0&&Math.abs(a.x-s.x)<14&&Math.abs(a.y-s.y)<10)s.hp=0;if(a.y>H-60){lives=0;mode='dying';timer=60;say('bump');return}}
  if(!aliens.some(a=>a.alive)){mode='clear';timer=120;score+=1000*(wave+1);msg=emit('invaders','levelclear',{level:wave+1,score})||'';say('tada')}}
 function alien(x,y,row,flap){const c=['#ff4d6d','#ffb347','#7dff9a','#4dd8ff','#b48cff'][row%5];ctx.fillStyle=c;ctx.fillRect(x-10,y-6,20,10);ctx.fillRect(x-6,y-10,12,4);ctx.fillStyle='#05070f';ctx.fillRect(x-6,y-4,4,4);ctx.fillRect(x+2,y-4,4,4);ctx.fillStyle=c;if(flap){ctx.fillRect(x-13,y+4,4,5);ctx.fillRect(x+9,y+4,4,5)}else{ctx.fillRect(x-9,y+4,4,5);ctx.fillRect(x+5,y+4,4,5)}}
 function draw(){const gl=glitch('invaders');ctx.fillStyle='#03040b';ctx.fillRect(0,0,W,H);ctx.fillStyle='#ffffff55';for(let i=0;i<40;i++)ctx.fillRect((i*97)%W,((i*53+frame*0.3)%(H-40))+30,1.5,1.5);
  const flap=Math.floor(frame/20)%2===0;for(const a of aliens)if(a.alive)alien(a.x,a.y,a.row,flap);
  for(const s of shields)if(s.hp>0){ctx.fillStyle=['','#3a7a3a','#4ba04b','#6cd36c'][s.hp];ctx.fillRect(s.x,s.y,8,8)}
  if(ufo){ctx.fillStyle='#ff4dd2';ctx.fillRect(ufo.x-16,36,32,8);ctx.fillRect(ufo.x-8,32,16,4)}
  ctx.fillStyle='#fff';for(const s of shots)ctx.fillRect(s.x-1,s.y-6,3,8);ctx.fillStyle='#ffe44d';for(const b of bombs){ctx.fillRect(b.x-1,b.y,3,8)}
  if(mode!=='dying'||timer%8<4){ctx.fillStyle='#7fe0ff';ctx.fillRect(ship.x-15,H-36,30,8);ctx.fillRect(ship.x-3,H-44,6,8)}
  ctx.fillStyle='#3a7a3a';ctx.fillRect(0,H-24,W,2);
  ctx.fillStyle='#0e1430';ctx.fillRect(0,0,W,26);ctx.fillStyle='#dfe8ff';ctx.font='bold 13px monospace';ctx.fillText('ONDATA '+(wave+1)+'/4',8,18);ctx.fillText('PUNTI '+score,130,18);ctx.fillText('♥'.repeat(Math.max(0,lives)),W-60,18);if(mode==='play')band(ctx,W,live);
  if(gl>0){for(let i=0;i<gl*6;i++)if(Math.random()<0.3){const y=Math.random()*H;ctx.drawImage(canvas,0,y,W,5,(Math.random()-0.5)*18*gl,y,W,5)}}
  const panelBox=(lines,sub)=>{if(!sub&&lines.length<=2&&!msg){ctx.fillStyle='rgba(5,8,25,.8)';ctx.fillRect(0,H/2-34,W,64);ctx.textAlign='center';ctx.fillStyle='#ffd23f';ctx.font='bold 20px monospace';ctx.fillText(lines[0],W/2,H/2-6);ctx.font='13px monospace';ctx.fillStyle='#dfe8ff';if(lines[1])ctx.fillText(lines[1],W/2,H/2+16);ctx.textAlign='left';return}ctx.fillStyle='rgba(5,8,25,.86)';ctx.fillRect(40,70,W-80,H-120);ctx.strokeStyle='#7fe0ff';ctx.strokeRect(40.5,70.5,W-81,H-121);ctx.textAlign='center';ctx.fillStyle='#ffd23f';ctx.font='bold 22px monospace';ctx.fillText(lines[0],W/2,104);ctx.font='13px monospace';ctx.fillStyle='#dfe8ff';let y=132;for(const l of lines.slice(1)){ctx.fillText(l,W/2,y);y+=19}if(msg){ctx.fillStyle='#ff9fb1';ctx.font='italic 13px monospace';wrapText(ctx,msg,W/2,y+8,W-120,17)}ctx.fillStyle='#9fb0d6';ctx.font='12px monospace';ctx.fillText(sub,W/2,H-62);ctx.textAlign='left'};
  if(mode==='title')panelBox(['DIFESA ORBITALE 2000','Difendi la base dalle 4 ondate.','Gli scudi verdi si consumano.','Colpisci l’astronave bonus in alto.','Record: '+(gameState.scores.invaders||0)],'INVIO / tocco per iniziare');
  else if(mode==='ready')panelBox(['ONDATA '+(wave+1),'Prepararsi...'],'');
  else if(mode==='clear')panelBox(['ONDATA RESPINTA!','Bonus '+1000*(wave+1)],'');
  else if(mode==='over')panelBox(['BASE PERDUTA','Punteggio: '+score],'INVIO / tocco per riprovare');
  else if(mode==='win')panelBox(['ORBITA DIFESA!','Hai respinto tutte e 4 le ondate.','Punteggio finale: '+score],'INVIO / tocco per una nuova partita')}
 function start(){if(mode==='title'||mode==='over'||mode==='win'){msg='';newGame()}}
 const km={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',' ':'fire',ArrowUp:'fire',w:'fire'};
 const down=e=>{if(!alive(win)){cleanup();return}if(!focused(win))return;if(e.key==='Enter'){e.preventDefault();start();return}const k=km[e.key]||km[e.key.toLowerCase?.()];if(k){e.preventDefault();if(k==='fire'&&mode!=='play'){start();return}held[k]=true}};
 const up=e=>{const k=km[e.key]||km[e.key.toLowerCase?.()];if(k)held[k]=false};
 function cleanup(){document.removeEventListener('keydown',down);document.removeEventListener('keyup',up)}
 document.addEventListener('keydown',down);document.addEventListener('keyup',up);
 canvas.addEventListener('pointerdown',()=>{if(mode!=='play')start()});
 box.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();if(mode!=='play'){start();return}held[k]=true});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{held[k]=false}))});
 emit('invaders','open',{});
 let last=performance.now(),acc=0;(function loop(now){if(!alive(win)){cleanup();return}acc+=Math.min(100,now-last);last=now;if(!win.hidden){while(acc>=16.67){update();acc-=16.67}draw()}else{acc=0;held.left=held.right=held.fire=false}requestAnimationFrame(loop)})(last);
};
const prevOpenGames=openApp;openApp=function(app){if(app==='bricks'||app==='invaders'){if(booting)return;(app==='bricks'?launchBricks:launchInvaders)();document.getElementById('start-menu').hidden=true;return}return prevOpenGames(app)};
})();

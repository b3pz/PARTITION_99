/* NOVA 2000 — Icone in stile anni '90 al posto delle emoji moderne.
   Ogni icona è un SVG 32×32 disegnato a rettangoli con la palette a 16 colori di Windows 98, contorni neri e pixel netti.
   Uno scanner sostituisce le emoji nei testi della pagina (anche quelli creati dopo, tramite MutationObserver);
   i simboli tipografici dell'epoca (★ ▶ ◀ → ● ✓ ♥ ♫) restano testo. */
(()=>{'use strict';
const K='#000',W='#fff',G='#c0c0c0',D='#808080',N='#000080',B='#0000ff',T='#008080',Y='#ffff00',O='#808000',M='#800000',R='#ff0000',g='#008000',L='#00ff00',C='#00ffff',E='#e8e0c8',F='#ffd0a0',A='#c08040';
const r=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const box=(x,y,w,h,c)=>r(x,y,w,h,K)+r(x+1,y+1,w-2,h-2,c);
// Disegno a pixel: righe di caratteri, ogni carattere una tinta della mappa, scala s.
const pix=(rows,map,ox,oy,s)=>rows.map((row,y)=>[...row].map((ch,x)=>map[ch]?r(ox+x*s,oy+y*s,s,s,map[ch]):'').join('')).join('');
const I={
 computer:box(3,2,26,20,E)+box(6,5,20,13,T)+r(7,6,18,1,C)+box(10,21,12,4,E)+box(6,24,20,6,E)+r(22,26,2,2,L)+r(8,27,10,1,D),
 floppy:box(4,3,24,26,N)+box(10,3,12,9,G)+r(18,5,2,5,N)+box(8,16,16,13,W)+r(10,19,12,1,D)+r(10,22,12,1,D)+r(10,25,8,1,D),
 hdd:box(3,10,26,13,G)+r(4,11,24,1,W)+r(4,21,24,1,D)+r(22,17,3,2,L)+r(6,15,10,1,D)+r(6,17,10,1,D),
 cd:'<circle cx="16" cy="16" r="13" fill="#d8d8d8" stroke="#000"/><path d="M16 5a11 11 0 0 1 11 11" stroke="#ff80c0" stroke-width="2" fill="none"/><path d="M5 16a11 11 0 0 1 4-8.5" stroke="#80c0ff" stroke-width="2" fill="none"/><circle cx="16" cy="16" r="4" fill="#fff" stroke="#000"/><circle cx="16" cy="16" r="1.5" fill="#000"/>',
 folder:box(3,6,12,5,Y)+box(3,9,26,19,Y)+r(4,10,24,2,'#ffff99')+r(4,25,24,2,O),
 folderopen:box(3,6,12,5,Y)+box(3,9,24,19,O)+'<polygon points="6,13 30,13 26,28 3,28" fill="#ffff00" stroke="#000"/>',
 doc:'<polygon points="7,3 21,3 26,8 26,29 7,29" fill="#fff" stroke="#000"/><polygon points="21,3 21,8 26,8" fill="#c0c0c0" stroke="#000"/>'+r(10,12,13,1,D)+r(10,15,13,1,D)+r(10,18,13,1,D)+r(10,21,13,1,D)+r(10,24,8,1,D),
 news:'<polygon points="5,4 27,4 27,28 5,28" fill="#fff" stroke="#000"/>'+r(8,7,16,3,K)+r(8,12,7,8,D)+r(17,12,7,1,D)+r(17,15,7,1,D)+r(17,18,7,1,D)+r(8,22,16,1,D)+r(8,25,16,1,D),
 globe:'<circle cx="16" cy="16" r="13" fill="#0000ff" stroke="#000"/><ellipse cx="16" cy="16" rx="6" ry="13" fill="none" stroke="#6060ff"/><path d="M3 16h26M5 9h22M5 23h22" stroke="#6060ff" fill="none"/><path d="M8 8h6l2 3-2 4h-3l-2 3-3-3V11z" fill="#008000"/><path d="M18 7h4l4 5-1 3h-3l-1 4 2 3-2 4h-2l-1-5-2-2 1-4z" fill="#008000"/><circle cx="16" cy="16" r="13" fill="none" stroke="#000"/>',
 phone:'<path d="M4 12q0-7 12-7t12 7v3h-7v-3h-10v3H4z" fill="#000"/><polygon points="8,16 24,16 28,29 4,29" fill="#e8e0c8" stroke="#000"/>'+r(11,19,2,2,D)+r(15,19,2,2,D)+r(19,19,2,2,D)+r(11,23,2,2,D)+r(15,23,2,2,D)+r(19,23,2,2,D),
 chat:'<circle cx="11" cy="10" r="5" fill="#3fbf3f" stroke="#000"/><path d="M2 28c0-7 4-11 9-11s9 4 9 11z" fill="#3fbf3f" stroke="#000"/><circle cx="22" cy="12" r="4.5" fill="#ff9a1f" stroke="#000"/><path d="M14 29c0-6 3-10 8-10s8 4 8 10z" fill="#ff9a1f" stroke="#000"/>',
 person:'<circle cx="16" cy="10" r="6" fill="#ffd0a0" stroke="#000"/><path d="M5 29c0-8 5-12 11-12s11 4 11 12z" fill="#000080" stroke="#000"/>',
 mail:box(3,8,26,17,W)+'<path d="M4 9l12 9 12-9" stroke="#000" fill="none"/>'+r(22,11,4,4,R),
 star:'<polygon points="16,2 20,12 30,12 22,18 25,29 16,22 7,29 10,18 2,12 12,12" fill="#ffff00" stroke="#000"/>',
 paint:'<path d="M16 4C7 4 3 10 3 16s5 12 12 12c3 0 3-3 2-5s1-4 4-3c4 1 8-1 8-6C29 8 24 4 16 4z" fill="#e8c890" stroke="#000"/><circle cx="9" cy="14" r="2.5" fill="#ff0000"/><circle cx="14" cy="9" r="2.5" fill="#0000ff"/><circle cx="21" cy="9" r="2.5" fill="#008000"/><circle cx="24" cy="15" r="2.5" fill="#ffff00" stroke="#000" stroke-width=".5"/>',
 maze:box(2,2,28,28,K)+r(4,4,24,2,B)+r(4,26,24,2,B)+r(4,4,2,24,B)+r(26,4,2,24,B)+r(10,10,12,2,B)+r(10,20,12,2,B)+'<path d="M14 16L22 12A8 8 0 1 0 22 20Z" fill="#ffff00"/>'+r(8,15,2,2,W)+r(24,15,2,2,W),
 runner:r(3,26,26,3,g)+pix(['..rrrr..','.rrrrrr.','..ffff..','..ffff..','.rrrrrr.','frrrrrrf','..rrrr..','..nn.nn.','.nn...nn','kk....kk'],{r:R,f:F,n:N,k:K},8,4,2),
 bricks:box(3,3,26,26,K)+[0,1,2,3].map(y=>[0,1,2].map(x=>r(5+x*8+(y%2?4:0),5+y*4,7,3,y%2?R:M)).join('')).join('')+r(15,22,3,3,W)+r(10,26,12,2,G),
 invader:box(2,2,28,28,K)+pix(['..l.....l..','...l...l...','..lllllll..','.ll.lll.ll.','lllllllllll','l.lllllll.l','l.l.....l.l','...ll.ll...'],{l:L},5,8,2),
 music:'<path d="M12 7l14-4v17" stroke="#000" stroke-width="3" fill="none"/><ellipse cx="9" cy="24" rx="5" ry="4" fill="#000080" stroke="#000"/><ellipse cx="22" cy="21" rx="5" ry="4" fill="#000080" stroke="#000"/>'+r(11,7,3,17,K),
 camera:box(10,6,9,5,G)+box(3,10,26,17,D)+'<circle cx="16" cy="18" r="6" fill="#000"/><circle cx="16" cy="18" r="4" fill="#3050a0"/><circle cx="14.5" cy="16.5" r="1" fill="#fff"/>'+r(23,12,4,3,W),
 image:box(3,5,26,22,A)+box(5,7,22,18,C)+'<polygon points="6,24 13,14 18,20 21,16 26,24" fill="#008000"/><circle cx="21" cy="11" r="2.5" fill="#ffff00"/>',
 book:box(6,3,20,26,N)+r(8,26,17,2,W)+r(7,4,2,24,'#000060')+box(11,8,12,6,Y),
 lock:'<path d="M11 15V10a5 5 0 0 1 10 0v5" stroke="#000" stroke-width="3" fill="none"/>'+box(7,14,18,15,Y)+r(15,19,2,6,K),
 unlock:'<path d="M17 15V9a5 5 0 0 1 10 0v3" stroke="#000" stroke-width="3" fill="none"/>'+box(4,14,18,15,Y)+r(12,19,2,6,K),
 gear:'<g fill="#808080" stroke="#000"><rect x="14" y="2" width="4" height="28"/><rect x="14" y="2" width="4" height="28" transform="rotate(45 16 16)"/><rect x="14" y="2" width="4" height="28" transform="rotate(90 16 16)"/><rect x="14" y="2" width="4" height="28" transform="rotate(135 16 16)"/></g><circle cx="16" cy="16" r="9" fill="#c0c0c0" stroke="#000"/><circle cx="16" cy="16" r="3.5" fill="#fff" stroke="#000"/>',
 tools:'<path d="M6 26L18 14" stroke="#000" stroke-width="5"/><path d="M6 26L18 14" stroke="#a0522d" stroke-width="3"/><path d="M17 5a6 6 0 0 0 8 8l3-3-4-1-1-4-3-3z" fill="#808080" stroke="#000"/>',
 refresh:'<path d="M7 16a9 9 0 0 1 16-6" stroke="#008000" stroke-width="3" fill="none"/><polygon points="25,4 26,13 18,11" fill="#008000"/><path d="M25 16a9 9 0 0 1-16 6" stroke="#008000" stroke-width="3" fill="none"/><polygon points="7,28 6,19 14,21" fill="#008000"/>',
 speaker:'<polygon points="4,12 10,12 17,6 17,26 10,20 4,20" fill="#c0c0c0" stroke="#000"/><path d="M21 11q3 5 0 10M24 8q6 8 0 16" stroke="#000" stroke-width="2" fill="none"/>',
 mute:'<polygon points="4,12 10,12 17,6 17,26 10,20 4,20" fill="#c0c0c0" stroke="#000"/><path d="M21 11l8 10M29 11l-8 10" stroke="#ff0000" stroke-width="3"/>',
 fullscreen:box(3,5,26,22,W)+r(4,6,24,4,N)+'<path d="M8 13v-1h5M24 13v-1h-5M8 21v1h5M24 21v1h-5" stroke="#000" stroke-width="2" fill="none"/>',
 keyboard:box(2,9,28,15,G)+[0,1,2].map(y=>[0,1,2,3,4,5,6,7].map(x=>r(4+x*3,11+y*3,2,2,W)).join('')).join('')+r(8,20,16,2,W),
 trash:'<polygon points="8,9 24,9 22,29 10,29" fill="#c0c0c0" stroke="#000"/>'+box(6,6,20,4,D)+r(13,3,6,3,K)+r(12,12,1,14,D)+r(16,12,1,14,D)+r(20,12,1,14,D),
 warning:'<polygon points="16,3 30,28 2,28" fill="#ffff00" stroke="#000"/>'+r(15,11,3,10,K)+r(15,23,3,3,K),
 help:'<circle cx="16" cy="16" r="13" fill="#0000ff" stroke="#000"/><text x="16" y="23" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="#fff" text-anchor="middle">?</text>',
 power:'<path d="M10 9a10 10 0 1 0 12 0" stroke="#008000" stroke-width="3.5" fill="none"/>'+r(14,3,4,13,g),
 clock:'<circle cx="16" cy="16" r="13" fill="#fff" stroke="#000" stroke-width="2"/><path d="M16 16V8M16 16l-6 0" stroke="#000" stroke-width="2"/>'+r(15,4,2,2,K)+r(15,26,2,2,K)+r(4,15,2,2,K)+r(26,15,2,2,K),
 calendar:box(4,6,24,23,W)+r(5,7,22,5,R)+r(10,3,2,6,K)+r(20,3,2,6,K)+[0,1,2].map(y=>[0,1,2,3,4].map(x=>r(7+x*4,15+y*4,2,2,D)).join('')).join(''),
 package:'<polygon points="4,10 16,5 28,10 28,24 16,29 4,24" fill="#c08040" stroke="#000"/><path d="M4 10l12 5 12-5M16 15v14" stroke="#000" fill="none"/>'+r(9,7,3,2,E),
 network:box(2,4,13,10,E)+box(4,6,9,6,T)+box(17,4,13,10,E)+box(19,6,9,6,T)+r(8,14,2,8,K)+r(23,14,2,8,K)+r(8,21,17,2,K)+box(12,24,9,5,G),
 moon:'<path d="M20 4a12 12 0 1 0 8 19A10 10 0 0 1 20 4z" fill="#ffff00" stroke="#000"/>',
 dotgreen:'<circle cx="16" cy="16" r="9" fill="#00c000" stroke="#000" stroke-width="2"/><circle cx="13" cy="13" r="3" fill="#a0ffa0"/>',
 dotorange:'<circle cx="16" cy="16" r="9" fill="#ff9a1f" stroke="#000" stroke-width="2"/><circle cx="13" cy="13" r="3" fill="#ffd8a0"/>',
 ball:'<circle cx="16" cy="16" r="13" fill="#fff" stroke="#000" stroke-width="2"/><polygon points="16,10 21,14 19,20 13,20 11,14" fill="#000"/><path d="M16 10V4M21 14l6-3M19 20l4 6M13 20l-4 6M11 14l-6-3" stroke="#000"/>',
 cloud:'<path d="M8 25a6 6 0 0 1 0-12 8 8 0 0 1 15-2 6 6 0 0 1 1 14z" fill="#fff" stroke="#808080" stroke-width="2"/>',
 sun:'<circle cx="16" cy="16" r="7" fill="#ffff00" stroke="#000"/><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l3 3M23 23l3 3M6 26l3-3M23 9l3-3" stroke="#ff8000" stroke-width="2"/>',
 train:box(3,10,18,13,M)+box(19,6,10,17,M)+box(21,8,6,6,C)+box(5,5,4,6,K)+'<circle cx="9" cy="25" r="3.5" fill="#000"/><circle cx="23" cy="25" r="3.5" fill="#000"/>'+r(2,28,28,2,D),
 pin:'<path d="M16 20v10" stroke="#808080" stroke-width="2"/><circle cx="16" cy="11" r="8" fill="#ff0000" stroke="#000"/><circle cx="13" cy="8" r="2" fill="#ffa0a0"/>',
 castle:box(5,12,22,17,G)+box(3,6,8,23,G)+box(21,6,8,23,G)+r(3,4,2,3,K)+r(7,4,2,3,K)+r(21,4,2,3,K)+r(25,4,2,3,K)+box(13,19,6,10,M),
 redcross:box(4,4,24,24,W)+r(13,8,6,16,R)+r(8,13,16,6,R),
 masks:'<path d="M4 6h14v9a7 7 0 0 1-14 0z" fill="#fff" stroke="#000"/><path d="M14 13h14v9a7 7 0 0 1-14 0z" fill="#ffff00" stroke="#000"/>'+r(7,10,3,2,K)+r(12,10,3,2,K)+r(17,17,3,2,K)+r(22,17,3,2,K)+'<path d="M8 17q3 2 6 0M18 25q3-2 6 0" stroke="#000" fill="none"/>',
 download:box(4,20,24,9,G)+r(6,22,20,2,D)+r(13,3,6,11,g)+'<polygon points="8,13 24,13 16,22" fill="#008000"/>',
 run:box(3,5,26,22,W)+r(4,6,24,4,N)+'<path d="M8 15l5 4-5 4" stroke="#000" stroke-width="2" fill="none"/>'+r(15,22,8,2,K),
 prev:r(6,8,3,16,'#e8eef5')+'<polygon points="26,8 26,24 10,16" fill="#e8eef5"/>',
 pause:r(9,8,5,16,'#e8eef5')+r(18,8,5,16,'#e8eef5'),
 stop:r(8,8,16,16,'#e8eef5'),
 next:r(23,8,3,16,'#e8eef5')+'<polygon points="6,8 6,24 22,16" fill="#e8eef5"/>',
 joystick:box(5,20,22,9,M)+r(15,8,3,13,K)+'<circle cx="16.5" cy="8" r="5" fill="#ff0000" stroke="#000"/>'+r(8,23,4,2,Y),
 cabinet:box(6,2,20,28,G)+box(8,4,16,7,'#d8d8d8')+box(8,12,16,7,'#d8d8d8')+box(8,20,16,7,'#d8d8d8')+r(13,7,6,2,K)+r(13,15,6,2,K)+r(13,23,6,2,K),
 drive:box(3,10,26,13,G)+r(4,11,24,1,W)+r(6,15,14,2,K)+r(22,17,3,2,L)};
const MAP={'🖥️':'computer','🖥':'computer','💻':'computer','💾':'floppy','💽':'hdd','🗄️':'hdd','🗄':'hdd','💿':'cd','📀':'cd','📁':'folder','📂':'folderopen','🗂️':'folder','🗂':'folder','🗃️':'cabinet','🗃':'cabinet','📄':'doc','📋':'doc','📰':'news','🌐':'globe','📡':'network','📞':'phone','☎':'phone','☎️':'phone','💬':'chat','👤':'person','✉':'mail','✉️':'mail','⭐':'star','🌟':'star','🎨':'paint','🟡':'maze','🏃':'runner','🧱':'bricks','👾':'invader','🕹️':'joystick','🕹':'joystick','🎵':'music','🎸':'music','🥁':'music','🎤':'music','📷':'camera','📸':'camera','🖼️':'image','🖼':'image','📚':'book','📖':'book','🔒':'lock','🔓':'unlock','⚙️':'gear','⚙':'gear','🛠️':'tools','🛠':'tools','🔄':'refresh','🔊':'speaker','🔇':'mute','⛶':'fullscreen','⌨️':'keyboard','⌨':'keyboard','🗑️':'trash','🗑':'trash','⚠️':'warning','⚠':'warning','❔':'help','⏻':'power','🕘':'clock','📅':'calendar','📦':'package','🖧':'network','🌙':'moon','🟢':'dotgreen','🟠':'dotorange','⚽':'ball','☁':'cloud','☁️':'cloud','☀':'sun','☀️':'sun','🚂':'train','📌':'pin','🏰':'castle','🏥':'redcross','🚑':'redcross','🎭':'masks','📥':'download','⏮':'prev','⏸':'pause','⏹':'stop','⏭':'next','📧':'mail','📨':'mail','📤':'mail'};
const TEXT={'😮':':-O','😀':':-)','🙂':':-)','😉':';-)','😢':":'("};
const url={};for(const [k,v] of Object.entries(I))url[k]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">'+v+'</svg>');
window.P99Icon=name=>url[name]||'';
const keys=Object.keys(MAP).concat(Object.keys(TEXT)).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
const RE=new RegExp('('+keys.join('|')+')\\uFE0F?','g');const TEST=new RegExp(keys.join('|'));
const css=document.createElement('style');css.textContent='img.i98{width:1.25em;height:1.25em;vertical-align:-.28em;display:inline-block;margin:0 .1em}.desktop-icon .glyph img.i98{width:34px;height:34px;margin:0;vertical-align:middle}.sm-ico img.i98{width:20px;height:20px;margin:0;vertical-align:middle}.np-ctl img.i98{width:14px;height:14px;margin:0}';document.head.append(css);
const SKIP=new Set(['TEXTAREA','INPUT','SCRIPT','STYLE','svg','TITLE','OPTION']);
function fix(node){if(node.nodeType!==3||!node.nodeValue||!TEST.test(node.nodeValue))return;const p=node.parentNode;if(!p||SKIP.has(p.nodeName)||p.closest?.('textarea,svg'))return;
 const frag=document.createDocumentFragment();let last=0;const s=node.nodeValue;RE.lastIndex=0;let m;
 while((m=RE.exec(s))){if(m.index>last)frag.append(s.slice(last,m.index));const k=m[1];if(TEXT[k])frag.append(TEXT[k]);else{const img=document.createElement('img');img.className='i98';img.alt='';img.src=url[MAP[k]];img.draggable=false;frag.append(img)}last=m.index+m[0].length}
 if(last<s.length)frag.append(s.slice(last));p.replaceChild(frag,node)}
function walk(root){if(root.nodeType===3){fix(root);return}if(root.nodeType!==1||SKIP.has(root.nodeName))return;const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const list=[];while(tw.nextNode())list.push(tw.currentNode);list.forEach(fix)}
walk(document.body);
new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')fix(m.target);else m.addedNodes.forEach(walk)}}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();

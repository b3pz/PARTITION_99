/* NOVA 2000 — suoni di sistema sintetizzati con Web Audio (nessun file audio).
   window.novaSound(nome) è richiamato dagli altri script; l'altoparlante nella barra attiva/disattiva l'audio.
   Il browser sblocca l'audio solo al primo tocco o clic sulla pagina: prima di allora i suoni restano muti. */
(()=>{'use strict';
const MUTE_KEY='nova2000-audio-muted';
let muted=false;try{muted=localStorage.getItem(MUTE_KEY)==='1'}catch{}
let ctx=null,master=null,verb=null;
// Uscita principale con un piccolo riverbero (risposta all'impulso generata), per il timbro «da multimedia» dell'epoca.
function audio(){if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ctx=new AC();master=ctx.createGain();master.gain.value=0.35;master.connect(ctx.destination);
 verb=ctx.createConvolver();const len=ctx.sampleRate*2.6,ir=ctx.createBuffer(2,len,ctx.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}verb.buffer=ir;const wet=ctx.createGain();wet.gain.value=0.32;verb.connect(wet).connect(master)}
 if(ctx.state==='suspended')ctx.resume().catch(()=>{});return ctx}
document.addEventListener('pointerdown',audio,{capture:true,passive:true});document.addEventListener('keydown',audio,{capture:true});
function out(node,rev){node.connect(master);if(rev)node.connect(verb)}
// Una voce: oscillatore con inviluppo, filtro passa-basso opzionale, glissato e vibrato.
function tone(f,start,dur,{type='square',vol=0.25,to=null,attack=0.012,cutoff=0,vib=0,rev=false,detune=0}={}){const a=audio();if(!a)return;const t=a.currentTime+start,o=a.createOscillator(),g=a.createGain();o.type=type;o.detune.value=detune;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);
 if(vib){const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.5;lg.gain.value=vib;l.connect(lg).connect(o.frequency);l.start(t);l.stop(t+dur+0.05)}
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+attack);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
 let n=o.connect(g);if(cutoff){const fl=a.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(cutoff,t);fl.frequency.exponentialRampToValueAtTime(Math.max(200,cutoff/4),t+dur);n=g.connect(fl)}out(n,rev);o.start(t);o.stop(t+dur+0.05)}
function noise(start,dur,{vol=0.12,freq=1800,q=0.7,attack=0.005,rev=false}={}){const a=audio();if(!a)return;const t=a.currentTime+start,len=Math.ceil(a.sampleRate*dur),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=buf;f.type='bandpass';f.frequency.value=freq;f.Q.value=q;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+attack);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);out(s.connect(f).connect(g),rev);s.start(t)}
// Campana: parziali inarmoniche che decadono a velocità diverse.
function bell(f,start,dur,vol=0.12){[[1,1],[2.76,0.45],[5.4,0.22],[8.93,0.1]].forEach(([r,v],k)=>tone(f*r,start,dur/(1+k*0.7),{type:'sine',vol:vol*v,attack:0.004,rev:true}))}
// Pad: dente di sega leggermente stonate, attacco lento e filtro, come i synth delle sigle di sistema.
function pad(notes,start,dur,vol=0.05){notes.forEach(n=>[-7,7].forEach(dt=>tone(n,start,dur,{type:'sawtooth',vol,attack:Math.min(0.7,dur/3),cutoff:2600,detune:dt,rev:true})))}
function pluck(notes,start,vol=0.1,gap=0.03){notes.forEach((n,i)=>tone(n,start+i*gap,0.9,{type:'triangle',vol,attack:0.003,cutoff:4000,rev:true}))}
function brass(notes,start,dur,vol=0.07){notes.forEach(n=>tone(n,start,dur,{type:'sawtooth',vol,attack:0.04,cutoff:3200,vib:dur>0.5?4:0,rev:true}))}
const SOUNDS={
 post:()=>tone(1000,0,0.2,{vol:0.18}),
 disk:()=>{for(let i=0;i<9;i++)noise(i*0.13+Math.random()*0.05,0.04,{vol:0.07,freq:3200,q:3})},
 startup:()=>{pad([196,294,392,494],0,4.6,0.035);pad([262,392,523,659],1.1,4.2,0.03);[784,988,1175,1568].forEach((f,i)=>bell(f,0.35+i*0.32,2.4,0.07));bell(2093,1.9,3,0.05)},
 shutdown:()=>{pad([523,392,330,262],0,3.4,0.035);[1175,988,784,523].forEach((f,i)=>bell(f,0.2+i*0.36,2.2,0.07))},
 click:()=>noise(0,0.03,{vol:0.09,freq:2500,q:2}),
 ding:()=>bell(1318,0,1.3,0.16),
 error:()=>pluck([392,494,587,698],0,0.11,0.035),
 msg:()=>{tone(660,0,0.18,{type:'sine',vol:0.16,to:880,rev:true});tone(990,0.14,0.28,{type:'sine',vol:0.14,to:1320,rev:true})},
 tada:()=>{brass([523,659,784],0,0.16);brass([523,659,784],0.18,0.12);brass([698,880,1047],0.34,1.4)},
 blip:()=>tone(988,0,0.08,{vol:0.1,to:1480}),
 jump:()=>tone(330,0,0.22,{vol:0.1,to:880}),
 bump:()=>tone(140,0,0.15,{vol:0.14,to:80}),
 // Telefonia italiana: tono di linea e di chiamata a 425 Hz, occupato a impulsi.
 dialtone:()=>tone(425,0,0.9,{type:'sine',vol:0.1,attack:0.02}),
 ring:()=>{tone(425,0,1,{type:'sine',vol:0.08});tone(425,1.6,1,{type:'sine',vol:0.08})},
 busy:()=>{for(let i=0;i<4;i++)tone(425,i*0.4,0.2,{type:'sine',vol:0.12})},
 // Handshake V.90: tono di risposta a 2100 Hz, scambio V.8, sondaggio della linea, «bong» e fruscio dello scrambler.
 handshake:()=>{const a=audio();if(!a)return;
  tone(2100,0,2.2,{type:'sine',vol:0.1,vib:15,attack:0.03});
  for(let i=0;i<6;i++){tone(1650,2.25+i*0.09,0.05,{type:'sine',vol:0.08});tone(980,2.3+i*0.09,0.05,{type:'sine',vol:0.08})}
  tone(1200,2.9,0.35,{type:'sine',vol:0.09});tone(2400,3.25,0.35,{type:'sine',vol:0.09});
  [3.7,4.0].forEach(t=>{[150,450,750,1050,1350,1650,1950,2250,2550,2850,3150,3450].forEach(f=>tone(f,t,0.18,{type:'sine',vol:0.022}))});
  tone(1800,4.35,0.25,{type:'sine',vol:0.07,to:600});
  noise(4.6,1.2,{vol:0.09,freq:1900,q:0.35,attack:0.2});noise(5.7,1.6,{vol:0.11,freq:1500,q:0.25,attack:0.05})},
 power:()=>{tone(60,0,0.6,{type:'sawtooth',vol:0.05});noise(0.05,0.5,{vol:0.05,freq:300,q:0.5})}
};
// Toni DTMF reali del tastierino telefonico.
const DTMF={1:[697,1209],2:[697,1336],3:[697,1477],4:[770,1209],5:[770,1336],6:[770,1477],7:[852,1209],8:[852,1336],9:[852,1477],0:[941,1336]};
for(const [d,[lo,hi]] of Object.entries(DTMF))SOUNDS['dtmf'+d]=()=>{tone(lo,0,0.09,{type:'sine',vol:0.12});tone(hi,0,0.09,{type:'sine',vol:0.12})};
window.novaSound=name=>{if(muted||!SOUNDS[name])return;try{SOUNDS[name]()}catch{}};

// Altoparlante nella barra delle applicazioni, accanto all'orologio.
const clock=document.getElementById('clock');
if(clock){const b=document.createElement('button');b.id='nova-volume';b.className='bevel';b.style.cssText='height:28px;min-width:32px;margin-right:4px;padding:0 4px;font-size:16px;background:#c0c0c0;border:0';const draw=()=>{b.textContent=muted?'🔇':'🔊';b.title=muted?'Audio disattivato — tocca per attivare':'Audio attivo — tocca per disattivare'};draw();b.onclick=()=>{muted=!muted;try{localStorage.setItem(MUTE_KEY,muted?'1':'0')}catch{}draw();if(!muted)novaSound('ding')};clock.before(b)}

// Accensione e riavvio: bip del POST, testine del disco, sigla di avvio a desktop pronto.
const baseBoot=boot;
boot=async function(){if(booting)return;novaSound('post');setTimeout(()=>novaSound('disk'),900);setTimeout(()=>novaSound('disk'),2400);await baseBoot();if(document.getElementById('desktop').classList.contains('ready'))novaSound('startup')};

// Suoni legati agli eventi: messaggi, notifiche, errori e giochi.
document.getElementById('start')?.addEventListener('click',()=>novaSound('click'));
})();

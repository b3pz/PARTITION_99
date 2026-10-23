/* NOVA 2000 — suoni di sistema sintetizzati con Web Audio (nessun file audio).
   window.novaSound(nome) è richiamato dagli altri script; l'altoparlante nella barra attiva/disattiva l'audio.
   window.novaPowerOn(avvio) mostra il pulsante di accensione: il primo tocco sblocca l'audio nel browser. */
(()=>{'use strict';
const MUTE_KEY='nova2000-audio-muted';
let muted=false;try{muted=localStorage.getItem(MUTE_KEY)==='1'}catch{}
let ctx=null,master=null;
function audio(){if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ctx=new AC();master=ctx.createGain();master.gain.value=0.35;master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume().catch(()=>{});return ctx}
document.addEventListener('pointerdown',audio,{capture:true,passive:true});document.addEventListener('keydown',audio,{capture:true});
function tone(f,start,dur,{type='square',vol=0.25,to=null}={}){const a=audio();if(!a)return;const t=a.currentTime+start,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(master);o.start(t);o.stop(t+dur+0.02)}
function noise(start,dur,{vol=0.12,freq=1800,q=0.7}={}){const a=audio();if(!a)return;const t=a.currentTime+start,len=Math.ceil(a.sampleRate*dur),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=buf;f.type='bandpass';f.frequency.value=freq;f.Q.value=q;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f).connect(g).connect(master);s.start(t)}
const chord=(notes,start,dur,vol=0.09)=>notes.forEach(n=>tone(n,start,dur,{type:'triangle',vol}));
const SOUNDS={
 post:()=>tone(1000,0,0.18,{vol:0.2}),
 disk:()=>{for(let i=0;i<9;i++)noise(i*0.13+Math.random()*0.05,0.04,{vol:0.07,freq:3200,q:3})},
 startup:()=>{chord([262,330,392],0,1.6);chord([349,440,523],0.45,1.6);chord([392,494,587,784],0.9,2.4,0.08)},
 shutdown:()=>{chord([784,587,494],0,1.2);chord([523,392,330],0.4,1.3);chord([392,262,196],0.8,2,0.08)},
 click:()=>noise(0,0.03,{vol:0.09,freq:2500,q:2}),
 ding:()=>{tone(1318,0,0.5,{type:'sine',vol:0.18});tone(1975,0.02,0.4,{type:'sine',vol:0.06})},
 error:()=>{tone(220,0,0.18,{type:'square',vol:0.12});tone(196,0.16,0.25,{type:'square',vol:0.12})},
 msg:()=>{tone(880,0,0.12,{type:'sine',vol:0.18});tone(1320,0.11,0.2,{type:'sine',vol:0.16})},
 tada:()=>{chord([523,659,784],0,0.25,0.1);chord([659,784,1047],0.2,0.9,0.1)},
 modem:()=>{[697,770,852,941,697,1209,1336].forEach((f,i)=>{tone(f,i*0.11,0.08,{type:'sine',vol:0.12});tone(f*1.7,i*0.11,0.08,{type:'sine',vol:0.08})});tone(2100,0.9,0.6,{type:'sine',vol:0.1});tone(1650,1.5,0.3,{type:'sine',vol:0.1,to:980});noise(1.8,1.6,{vol:0.1,freq:1800,q:0.4});tone(1200,1.9,1.2,{type:'sawtooth',vol:0.03,to:2400})},
 blip:()=>tone(988,0,0.08,{vol:0.1,to:1480}),
 jump:()=>tone(330,0,0.22,{vol:0.1,to:880}),
 bump:()=>tone(140,0,0.15,{vol:0.14,to:80}),
 busy:()=>{for(let i=0;i<4;i++)tone(425,i*0.4,0.2,{type:'sine',vol:0.12})},
 handshake:()=>{tone(2100,0,0.7,{type:'sine',vol:0.1});tone(1650,0.75,0.35,{type:'sine',vol:0.1,to:980});noise(1.1,1.8,{vol:0.1,freq:1800,q:0.4});tone(1200,1.2,1.4,{type:'sawtooth',vol:0.03,to:2400});noise(2.9,0.9,{vol:0.07,freq:2600,q:0.6})},
 ring:()=>{tone(425,0,1,{type:'sine',vol:0.08})},
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
window.novaPowerOn=start=>{const s=document.createElement('div');s.style.cssText='position:fixed;inset:0;z-index:20002;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;cursor:pointer;font:15px Arial,Helvetica,sans-serif;color:#777';s.innerHTML='<div style="width:92px;height:92px;border-radius:50%;border:3px solid #555;display:flex;align-items:center;justify-content:center;font-size:46px;color:#9a9a9a">⏻</div><div>Premi per accendere il computer</div><small style="color:#444">L’audio si attiva con l’accensione · 🔊 nella barra per disattivarlo</small>';document.body.append(s);s.addEventListener('click',()=>{audio();novaSound('power');s.remove();boot()},{once:true});document.getElementById('bios-screen')?.classList.add('hidden')};

// Suoni legati agli eventi: messaggi, notifiche, errori e giochi.
document.getElementById('start')?.addEventListener('click',()=>novaSound('click'));
})();

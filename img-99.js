/* PARTITION_99 — Fotografie e sprite di Astro V (cartella img/).
   Le foto sostituiscono le versioni incorporate; Astro cambia espressione: parla, si preoccupa (fase 4 di ALMA),
   si guasta durante i glitch e diventa grigio quando a parlare è ALMA. */
(()=>{'use strict';
const people=window.P99_PEOPLE_PHOTOS=window.P99_PEOPLE_PHOTOS||{};
people.gruppo='img/gm_lab_1998.jpg';people.giuseppe='img/giuseppe_1999.jpg';
const css=document.createElement('style');css.textContent=`#astro-widget img{object-fit:contain}
.web-page .old-banner.nn-banner{background:#0a1f5c url(img/banner_novanet.jpg) center/cover no-repeat;text-shadow:0 0 4px #001,1px 1px 2px #000;border-color:#9fb6e8}`;document.head.append(css);
const SP=k=>'img/astro_'+k+'.png';
const img=document.querySelector('#astro-widget img'),icon=document.querySelector('.desktop-icon[data-app="astro"] img');
if(icon)icon.src=SP('idle');
let override=null,until=0,talkUntil=0;
function base(){const s=window.P99Alma?.stage?.()||0;return s===4?'worried':'idle'}
function update(){if(!img)return;const now=Date.now();const k=override&&now<until?override:now<talkUntil?'talk':base();if(img.dataset.mood!==k){img.dataset.mood=k;img.src=SP(k)}}
window.P99Astro={mood(k,ms){override=k;until=Date.now()+ms;update()}};
const prevSay=astroSay;astroSay=function(s,show=true){const r=prevSay.apply(this,arguments);if(show!==false)talkUntil=Date.now()+2600;update();return r};
update();setInterval(update,400);
})();

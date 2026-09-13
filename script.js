const START_DATE = new Date(2023, 10, 21, 0, 0, 0, 0);

const MEDIA = [
  {src:"images/photo01.jpg",caption:"this one still makes me smile",date:"NOV 21, 2023",note:"the kind of picture that makes me remember how all of this started."},
  {src:"images/photo02.jpg",caption:"look at us bro 😭",date:"2023 → 2024"},
  {src:"images/photo03.jpg",caption:"one of my favorite memories",date:"2024"},
  {src:"images/photo04.jpg",caption:"you looked so pretty here",date:"2024",note:"you had no idea how pretty you looked here."},
  {src:"images/photo05.jpg",caption:"keep this one",date:"2024"},
  {src:"images/photo06.jpg",caption:"i still think about this",date:"2024"},
  {src:"images/photo07.jpg",caption:"okay this one is adorable",date:"2024",note:"this picture genuinely makes me miss you."},
  {src:"images/photo08.jpg",caption:"one for the lore",date:"2024"},
  {src:"images/photo09.jpg",caption:"just us",date:"2024"},
  {src:"images/photo10.jpg",caption:"another little piece of us",date:"2024"},
  {src:"images/photo11.jpg",caption:"chaos but make it us",date:"2024",note:"somehow even the chaotic days became memories i want to keep."},
  {src:"images/photo12.jpg",caption:"this one makes me happy",date:"2024"},
  {src:"images/photo13.jpg",caption:"one more for the archive",date:"2024"},
  {src:"images/photo14.jpg",caption:"comfortable looks good on us",date:"2025",note:"you had no idea how pretty you looked here. i hope you know it now."},
  {src:"images/photo15.jpg",caption:"okay i love this one",date:"2025"},
  {src:"images/photo16.jpg",caption:"ordinary day favorite memory",date:"2025"},
  {src:"images/photo17.jpg",caption:"us being us",date:"2025"},
  {src:"images/photo18.jpg",caption:"one of those days",date:"2025",note:"one of those random moments i wish i could replay."},
  {src:"images/photo19.jpg",caption:"a tiny time capsule",date:"2025"},
  {src:"images/photo20.jpg",caption:"close enough",date:"2025"},
  {src:"images/photo21.jpg",caption:"the good kind of familiar",date:"2025"},
  {src:"images/photo22.jpg",caption:"another one worth keeping",date:"2025"},
  {src:"images/photo23.jpg",caption:"same story new frame",date:"2025",note:"one of those random moments i wish i could replay forever."},
  {src:"images/photo24.jpg",caption:"tiny memory",date:"2025"},
  {src:"images/photo25.jpg",caption:"yeah this one too",date:"2025"},
  {src:"images/photo26.jpg",caption:"camera roll evidence",date:"2025"},
  {src:"images/photo27.jpg",caption:"one for the lore",date:"2025",note:"look at us. actually look at us. 😭"},
  {src:"images/photo28.jpg",caption:"this is us",date:"2025"},
  {src:"images/photo29.jpg",caption:"keep smiling",date:"2025"},
  {src:"images/photo30.jpg",caption:"a very specific kind of happiness",date:"2026",note:"this one feels like a tiny piece of a life i don't want to forget."},
  {src:"images/photo31.jpg",caption:"proof we had fun",date:"2026"},
  {src:"images/photo32.jpg",caption:"another one for later",date:"2026"},
  {src:"images/photo33.jpg",caption:"good memories are messy",date:"2026"},
  {src:"images/photo34.jpg",caption:"one of my favorites",date:"2026",note:"one of my favorite memories. no explanation needed."},
  {src:"images/photo35.jpg",caption:"ordinary moments hit different",date:"2026"},
  {src:"images/photo36.jpg",caption:"hold onto this",date:"2026"},
  {src:"images/photo37.jpg",caption:"one for the archive",date:"2026"},
  {src:"images/photo38.jpg",caption:"still us",date:"2026",note:"after everything, somehow this still feels like us."},
  {src:"images/photo39.jpg",caption:"and we'd do it all again",date:"2026"}
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function daysSince(date){
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 86400000));
}
function nextRecurringDate(month, day){
  const now = new Date();
  let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0, 0);
  if(target <= now) target = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0, 0);
  return target;
}
function splitCountdown(ms){
  const total = Math.max(0, Math.floor(ms / 1000));
  return {days:Math.floor(total/86400), hours:Math.floor((total%86400)/3600), minutes:Math.floor((total%3600)/60), seconds:total%60};
}
function setCountdown(prefix,target){
  const v = splitCountdown(target.getTime() - Date.now());
  const values = {days:v.days, hours:String(v.hours).padStart(2,'0'), minutes:String(v.minutes).padStart(2,'0'), seconds:String(v.seconds).padStart(2,'0')};
  Object.entries(values).forEach(([key,val])=>{const el=$(`#${prefix}-${key}`);if(el)el.textContent=key==='days'?Number(val).toLocaleString():val;});
}
function renderCounters(){
  const counter = $('#counter-number');
  if(counter) counter.textContent = daysSince(START_DATE).toLocaleString();
  setCountdown('birthday', nextRecurringDate(4,29));
  setCountdown('anniversary', nextRecurringDate(11,21));
}

function setupReveal(){
  const items = $$('.reveal:not(.reveal-bound)');
  if(!('IntersectionObserver' in window)){items.forEach(x=>x.classList.add('is-visible','reveal-bound'));return;}
  const ob = new IntersectionObserver((entries,o)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');o.unobserve(e.target);}}),{threshold:.06});
  items.forEach(x=>{x.classList.add('reveal-bound');ob.observe(x);});
}

function burstHearts(origin=null){
  const holder=$('#floating-hearts');if(!holder)return;
  const r=origin?.getBoundingClientRect();const x=r?r.left+r.width/2:innerWidth/2;const y=r?innerHeight-r.top:innerHeight*.25;const count=innerWidth<600?12:18;
  for(let i=0;i<count;i++){const h=document.createElement('span');h.className='heart-float';h.textContent=['♡','♥','✦','❀'][i%4];h.style.left=`${x+(Math.random()*70-35)}px`;h.style.bottom=`${y}px`;h.style.setProperty('--size',`${10+Math.random()*17}px`);h.style.setProperty('--drift',`${Math.random()*150-75}px`);h.style.animationDelay=`${Math.random()*.3}s`;holder.appendChild(h);h.addEventListener('animationend',()=>h.remove(),{once:true});}
}
function showToast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),2100);}

function buildMediaItem(item,index){
  const wrap=document.createElement('figure');wrap.className='media-item reveal';wrap.style.setProperty('--i',index);wrap.tabIndex=0;wrap.setAttribute('role','button');wrap.setAttribute('aria-label',`Open memory ${index+1}`);
  const img=document.createElement('img');img.src=item.src;img.alt=item.caption;img.loading=index<6?'eager':'lazy';img.decoding='async';wrap.appendChild(img);
  const badge=document.createElement('span');badge.className='memory-index';badge.textContent=String(index+1).padStart(2,'0');wrap.appendChild(badge);
  const cap=document.createElement('figcaption');cap.textContent=item.caption;wrap.appendChild(cap);
  if(item.note){const note=document.createElement('span');note.className='memory-note-dot';note.textContent='♡';note.title='there is a little note here';wrap.appendChild(note);}
  wrap.addEventListener('click',()=>openLightbox(index));wrap.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(index);}});
  return wrap;
}
function renderTimeline(){
  const root=$('#timeline');if(!root)return;root.innerHTML='';
  const groups=[
    {label:'NOV 21 2023',title:'the beginning',text:'the date everything started.',start:0,end:0},
    {label:'2024',title:'we became us',text:'more pictures. more little things. more of a life that started feeling shared.',start:1,end:12},
    {label:'2025',title:'everything we went through',text:'the easy parts, the hard parts, and all the ordinary moments in between.',start:13,end:28},
    {label:'2026',title:'still here',text:'not a perfect story. just ours, still becoming.',start:29,end:38}
  ];
  groups.forEach(group=>{
    const block=document.createElement('div');block.className='timeline-block reveal';
    const marker=document.createElement('div');marker.className='timeline-marker';marker.innerHTML=`<span>${group.label}</span><strong>${group.title}</strong><p>${group.text}</p>`;block.appendChild(marker);
    const grid=document.createElement('div');grid.className='gallery-grid';for(let i=group.start;i<=group.end;i++)grid.appendChild(buildMediaItem(MEDIA[i],i));block.appendChild(grid);root.appendChild(block);
  });
  setupReveal();
}

let currentIndex=0;
function openLightbox(index){currentIndex=index;updateLightbox();const b=$('#lightbox');b.classList.add('is-open');b.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');}
function updateLightbox(){const item=MEDIA[currentIndex],c=$('#lightbox-content');c.innerHTML='';const img=document.createElement('img');img.src=item.src;img.alt=item.caption;c.appendChild(img);$('#lightbox-counter').textContent=`${currentIndex+1} / ${MEDIA.length}`;$('#lightbox-caption').textContent=item.caption;$('#lightbox-note').textContent=item.note||'';$('#lightbox-note').classList.toggle('has-note',Boolean(item.note));}
function moveLightbox(delta){currentIndex=(currentIndex+delta+MEDIA.length)%MEDIA.length;updateLightbox();}
function closeLightbox(){const b=$('#lightbox');b.classList.remove('is-open');b.setAttribute('aria-hidden','true');$('#lightbox-content').innerHTML='';document.body.classList.remove('no-scroll');}
function randomMemory(){const i=Math.floor(Math.random()*MEDIA.length);burstHearts();showToast('this one found its way back to you ♡');setTimeout(()=>openLightbox(i),180);}
let touchX=0,touchY=0;
function setupLightboxGestures(){const box=$('#lightbox');box.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY},{passive:true});box.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-touchX,dy=t.clientY-touchY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))moveLightbox(dx<0?1:-1);},{passive:true});}

function setupLoveCards(){$$('.love-heart-card').forEach(card=>card.addEventListener('click',()=>{const text=card.dataset.love;$('#love-reveal').textContent=text;card.classList.remove('popped');requestAnimationFrame(()=>card.classList.add('popped'));burstHearts(card);showToast(text+' ♡');}));}
function openLetter(title,message){$('#letter-title').textContent=title;$('#letter-body').textContent=message;const overlay=$('#letter-overlay');overlay.classList.add('is-open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');}
function closeLetter(){const overlay=$('#letter-overlay');overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');}
function setupEnvelopes(){
  $$('.envelope').forEach(card=>card.addEventListener('click',()=>{burstHearts(card);openLetter(card.dataset.title,card.dataset.message);}));
  $$('.private-card').forEach(card=>card.addEventListener('click',()=>{burstHearts(card);openLetter(card.dataset.title,card.dataset.message);}));
  $('#letter-close').onclick=closeLetter;$('#letter-overlay').addEventListener('click',e=>{if(e.target.id==='letter-overlay')closeLetter();});
}

const stories={
 "the girl I couldn't stop thinking about":"once there was a girl who somehow kept showing up in a boy's thoughts. in the middle of normal days. in songs. in random little moments. eventually he stopped pretending it was just a coincidence. it was her. it was always her. ♡",
 "ramroomti and the boy who loved her":"ramroomti met a boy who was still figuring himself out. he didn't have every answer. he still doesn't. but somewhere between the stupid conversations and the soft ones he realized he wanted to keep learning her. and keep being chosen by her too. ♡",
 "the night they finally fell asleep together":"the night was quiet. no big speech. no perfect ending. just two tired people talking until the words got slower and the silence felt safe. eventually they fell asleep. and for once nobody needed to figure anything out. they were just there. together. ♡"
};
function setupStories(){$$('.story-buttons button').forEach(b=>b.addEventListener('click',()=>{const title=b.dataset.story;$('#story-overlay-title').textContent=title;$('#story-overlay-text').textContent=stories[title];$('#story-overlay').classList.add('is-open');$('#story-overlay').setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');burstHearts();}));$('#story-close').onclick=()=>{$('#story-overlay').classList.remove('is-open');$('#story-overlay').setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');};}

function setupJar(){
  const jar=$('#jar-button');
  if(!jar)return;
  const shake=()=>{
    const i=Math.floor(Math.random()*MEDIA.length);
    const item=MEDIA[i];
    jar.classList.remove('shake');
    void jar.offsetWidth;
    jar.classList.add('shake');
    setTimeout(()=>jar.classList.remove('shake'),800);
    $('#jar-note').innerHTML=`<span class="jar-date">${item.date}</span><strong>${item.caption}</strong><em>${item.note||'one of those tiny memories i never want to lose.'}</em><button type="button" id="jar-photo">see it ♡</button>`;
    $('#jar-photo').onclick=()=>openLightbox(i);
    burstHearts(jar);
  };
  jar.addEventListener('click',shake);
  jar.addEventListener('pointerdown',()=>jar.classList.add('jar-press'));
  jar.addEventListener('pointerup',()=>jar.classList.remove('jar-press'));
  jar.addEventListener('pointercancel',()=>jar.classList.remove('jar-press'));
}
function setupEasterEgg(){let count=0;$('#brand-easter').addEventListener('click',e=>{count++;if(count<5)return;e.preventDefault();count=0;const pop=document.createElement('div');pop.className='secret-pop';pop.innerHTML='<span>you found the secret ♡</span><p>here’s something i probably won’t say enough</p><strong>I fucking love you ramroomti.</strong>';document.body.appendChild(pop);requestAnimationFrame(()=>pop.classList.add('show'));burstHearts();setTimeout(()=>pop.remove(),6500);});}

function setupMusic(){
  const audio=$('#our-song'),button=$('#music-button'),label=$('#music-label'),hint=$('#music-hint'),entry=$('#music-entry');
  if(!audio)return;
  const startSong=async()=>{
    try{await audio.play(); if(entry){entry.classList.add('entered');setTimeout(()=>entry.remove(),700);}}
    catch(err){if(hint)hint.textContent='add song.mp3 beside index.html to play it here ♡';showToast("drop song.mp3 into the site folder ♡");}
  };
  if(entry)entry.addEventListener('click',startSong,{once:true});
  if(button)button.addEventListener('click',async()=>{if(audio.paused)await startSong();else audio.pause();});
  audio.addEventListener('play',()=>{document.body.classList.add('music-on');if(label)label.textContent='pause our song';if(hint)hint.textContent="nothing's gonna hurt you baby · cigarettes after sex";});
  audio.addEventListener('pause',()=>{document.body.classList.remove('music-on');if(label)label.textContent='play our song';});
}

function setupFinale(){
  const section=$('#closing'),wrap=$('#one-more-wrap'),button=$('#one-more'),screen=$('#final-screen');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){clearTimeout(setupFinale.timer);setupFinale.timer=setTimeout(()=>wrap.classList.add('show'),3200);}}),{threshold:.65});
  observer.observe(section);
  button.addEventListener('click',()=>{screen.classList.add('is-open');screen.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');burstHearts();});
}

function spawnAmbientHeart(){const h=document.createElement('span');h.className='heart-float heart-float--ambient';h.textContent=Math.random()>.3?'♡':'♥';h.style.left=`${5+Math.random()*90}vw`;h.style.bottom='-20px';h.style.setProperty('--size',`${10+Math.random()*14}px`);h.style.setProperty('--drift',`${Math.random()*140-70}px`);h.style.animationDuration=`${5+Math.random()*4}s`;$('#floating-hearts').appendChild(h);h.addEventListener('animationend',()=>h.remove(),{once:true});}
function spawnSparkle(){const s=document.createElement('span');s.className='sparkle';s.textContent=Math.random()>.4?'✦':'·';s.style.left=`${Math.random()*100}vw`;s.style.top=`${Math.random()*100}vh`;s.style.setProperty('--size',`${6+Math.random()*10}px`);$('#sparkle-layer').appendChild(s);setTimeout(()=>s.remove(),3200);}
function setupMotion(){if(reduced)return;setInterval(spawnAmbientHeart,1100);setInterval(spawnSparkle,650);for(let i=0;i<5;i++)setTimeout(spawnSparkle,i*350);let ticking=false;addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const y=scrollY;$$('.hero-glow').forEach((g,i)=>g.style.transform=`translate3d(${i?y*-.02:y*.015}px,${i?y*.025:y*-.012}px,0)`);ticking=false;});},{passive:true});}

addEventListener('DOMContentLoaded',()=>{
  renderCounters();renderTimeline();setupReveal();setupLightboxGestures();setupLoveCards();setupEnvelopes();setupStories();setupJar();setupEasterEgg();setupMusic();setupFinale();setupMotion();
  $('#heart-button').addEventListener('click',e=>{burstHearts(e.currentTarget);showToast('one little heart sent ♡');});
  $('#memory-button').addEventListener('click',randomMemory);$('#lightbox-close').addEventListener('click',closeLightbox);$('#lightbox-prev').addEventListener('click',()=>moveLightbox(-1));$('#lightbox-next').addEventListener('click',()=>moveLightbox(1));$('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')closeLightbox();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLightbox();closeLetter();$('#story-overlay').classList.remove('is-open');$('#story-overlay').setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');}if($('#lightbox').classList.contains('is-open')){if(e.key==='ArrowLeft')moveLightbox(-1);if(e.key==='ArrowRight')moveLightbox(1);}});
});
setInterval(renderCounters,1000);

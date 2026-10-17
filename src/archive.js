const SWIPE_DISTANCE=58;
export function initArchive(site) {
  const content=site.content;
  const photos=[];
  for(const [year,names] of Object.entries(content.chapters)) {
    const grid=document.getElementById(`gallery-${year}`);
    if(!grid) continue;
    names.forEach((file,index)=>{
      const meta=content.photos[file]||{};
      const item={year,name:file,src:meta.src||`images/${file}`,caption:meta.caption||'',alt:meta.alt||meta.caption||`Photograph from ${year}`};
      photos.push(item);
      const figure=document.createElement('figure');
      figure.className=`photo reveal${meta.featured?' photo-featured':''}${meta.height>meta.width?' photo-portrait':' photo-landscape'}`;
      const button=document.createElement('button');button.type='button';button.className='photo-open';button.setAttribute('aria-label',`${content['gallery.open']} ${item.caption}`);
      const img=document.createElement('img');Object.assign(img,{src:item.src,alt:item.alt,loading:'lazy',decoding:'async',width:meta.width||800,height:meta.height||600});button.append(img);
      const caption=document.createElement('figcaption');
      const number=document.createElement('span');number.className='frame-number';number.textContent=`${String(index+1).padStart(2,'0')} / ${year}`;
      const text=document.createElement('span');text.textContent=item.caption;
      caption.append(number,text);figure.append(button,caption);grid.append(figure);
      button.addEventListener('click',()=>openPhoto(photos.indexOf(item),button));
    });
  }

  let current=0,activeImage=null,pointers=new Map(),scale=1,transitionOpener=null;
  const dialog=document.getElementById('lightbox'),view=document.getElementById('lbContent'),caption=document.getElementById('lbCaption');
  function render(){
    const photo=photos[current];if(!photo)return;
    const image=document.createElement('img');image.id='photoView';image.src=photo.src;image.alt=photo.alt;image.draggable=false;image.decoding='async';
    view.replaceChildren(image);activeImage=image;caption.textContent=`${current+1} / ${photos.length} · ${photo.caption}`;
    image.addEventListener('pointerdown',pointerDown);image.addEventListener('pointermove',pointerMove);image.addEventListener('pointerup',pointerEnd);image.addEventListener('pointercancel',pointerEnd);image.addEventListener('lostpointercapture',pointerEnd);
    image.addEventListener('dblclick',()=>resetZoom());image.addEventListener('wheel',wheelZoom,{passive:false});
    const previous=document.getElementById('lbPrev'),next=document.getElementById('lbNext');
    if(previous)previous.disabled=photos.length<2;if(next)next.disabled=photos.length<2;
  }
  function withTransition(callback,after){if(document.startViewTransition&&!site.motionOff.matches){const transition=document.startViewTransition(callback);transition.finished.finally(()=>after?.());}else{callback();after?.();}}
  function openPhoto(index,opener){
    current=index;render();transitionOpener=opener;
    if(opener&&activeImage&&document.startViewTransition&&!site.motionOff.matches){opener.style.viewTransitionName='archive-photo';withTransition(()=>{opener.style.viewTransitionName='';activeImage.style.viewTransitionName='archive-photo';site.openDialog(dialog,opener);},()=>{opener.style.removeProperty('view-transition-name');activeImage?.style.removeProperty('view-transition-name');});}
    else site.openDialog(dialog,opener);
  }
  site.openPhoto=(index,opener)=>openPhoto(index,opener);
  function closePhoto(){const img=activeImage,opener=transitionOpener;withTransition(()=>{if(img)img.style.removeProperty('view-transition-name');if(opener&&document.startViewTransition&&!site.motionOff.matches)opener.style.viewTransitionName='archive-photo';site.closeDialog(dialog);},()=>{opener?.style.removeProperty('view-transition-name');img?.style.removeProperty('view-transition-name');});transitionOpener=null;pointers.clear();scale=1;}
  function movePhoto(delta){current=(current+delta+photos.length)%photos.length;render();}
  document.getElementById('lbClose')?.addEventListener('click',closePhoto);
  document.getElementById('lbPrev')?.addEventListener('click',()=>movePhoto(-1));
  document.getElementById('lbNext')?.addEventListener('click',()=>movePhoto(1));
  dialog?.addEventListener('cancel',event=>{event.preventDefault();closePhoto();});
  dialog?.addEventListener('click',event=>{if(event.target===dialog)closePhoto();});
  dialog?.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();movePhoto(-1);}if(event.key==='ArrowRight'){event.preventDefault();movePhoto(1);}if(event.key==='0')resetZoom();});
  dialog?.addEventListener('close',()=>{activeImage?.style.removeProperty('view-transition-name');pointers.clear();scale=1;});
  function pointerDown(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});e.currentTarget.setPointerCapture(e.pointerId);
    if(pointers.size===1){e.currentTarget.dataset.startX=e.clientX;e.currentTarget.dataset.startY=e.clientY;e.currentTarget.dataset.swipePointer=String(e.pointerId);}
    if(pointers.size===2){const [a,b]=[...pointers.values()];e.currentTarget.dataset.pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);e.currentTarget.dataset.pinchScale=scale;}
  }
  function pointerMove(e){
    if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size>=2){const [a,b]=[...pointers.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);scale=Math.max(1,Math.min(4,Number(e.currentTarget.dataset.pinchScale||scale)*d/Math.max(1,Number(e.currentTarget.dataset.pinchDistance||d))));applyZoom();}
  }
  function pointerEnd(e){
    const startX=Number(e.currentTarget.dataset.startX||e.clientX),startY=Number(e.currentTarget.dataset.startY||e.clientY);const dx=e.clientX-startX,dy=e.clientY-startY;
    if(pointers.size===1&&e.pointerId===Number(e.currentTarget.dataset.swipePointer)&&scale===1&&Math.abs(dx)>SWIPE_DISTANCE&&Math.abs(dx)>Math.abs(dy))movePhoto(dx<0?1:-1);
    pointers.delete(e.pointerId);if(pointers.size<2){delete e.currentTarget.dataset.pinchDistance;delete e.currentTarget.dataset.pinchScale;}
  }
  function applyZoom(){if(activeImage){activeImage.style.transform=`scale(${scale})`;activeImage.classList.toggle('zoomed',scale>1.02);}}
  function resetZoom(){scale=1;applyZoom();if(activeImage)activeImage.style.translate='0 0';}
  function wheelZoom(e){if(!e.ctrlKey)return;e.preventDefault();scale=Math.max(1,Math.min(4,scale*(e.deltaY<0?1.12:.89)));applyZoom();}

  const canvas=document.getElementById('starCanvas'),nodes=document.getElementById('starNodes'),captionNode=document.getElementById('starCaption');
  if(canvas&&nodes&&captionNode){
    const ctx=canvas.getContext('2d');const stars=site.timeline;let unlocked=0;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 800 360');svg.setAttribute('preserveAspectRatio','none');svg.classList.add('timeline-lines');
    const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','2');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.append(path);nodes.prepend(svg);
    const reduced=site.motionOff.matches;
    function points(end){return stars.slice(0,end).map((s,i)=>`${i?'L':'M'} ${s.x*8} ${s.y*3.6}`).join(' ');}
    function drawSky(){
      if(ctx){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='rgba(255,255,255,.2)';for(let i=0;i<45;i++)ctx.fillRect(i*197%800,i*89%360,1.5,1.5);}
      const d=points(unlocked);path.setAttribute('d',d);
      if(d&&unlocked>1&&!reduced){const length=path.getTotalLength();path.style.strokeDasharray=String(length);path.style.strokeDashoffset=String(length);path.animate([{strokeDashoffset:length},{strokeDashoffset:0}],{duration:460,easing:'ease-out',fill:'forwards'});}else path.style.strokeDashoffset='0';
    }
    stars.forEach((star,index)=>{
      const button=document.createElement('button');button.type='button';button.className=`star-point${index===0?' next-star':''}`;button.style.left=`${star.x}%`;button.style.top=`${star.y}%`;button.disabled=index>0;
      const label=content[star.captionKey]||'';
      button.setAttribute('aria-label',`${star.date} — ${label}`);
      button.addEventListener('click',()=>{if(index>unlocked)return;if(index===unlocked)unlocked++;button.classList.add('unlocked');button.classList.remove('next-star');const next=nodes.querySelectorAll('.star-point')[unlocked];if(next){next.disabled=false;next.classList.add('next-star');}captionNode.textContent=`${star.date} · ${label}`;drawSky();site.burst(button);});nodes.append(button);
    });
    captionNode.textContent=reduced?content['timeline.reducedCue']:content['timeline.firstCue'];drawSky();
  }
  return photos;
}

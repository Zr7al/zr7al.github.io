// Shared browser primitives: native dialogs, focus return, and small feedback motions.
export function makeRuntime(content) {
  const openers = new WeakMap();
  const motionOff = matchMedia('(prefers-reduced-motion: reduce)');
  function openDialog(dialog, opener = document.activeElement) {
    if (!dialog || dialog.open) return;
    openers.set(dialog, opener);
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  function closeDialog(dialog) {
    if (dialog?.open) dialog.close();
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab' || !dialog.open) return;
      const focusable = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.hidden && el.getAttribute('aria-hidden') !== 'true' && el.getClientRects().length);
      if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      requestAnimationFrame(() => {
        if (dialog.id === 'entryGate') document.getElementById('heroTitle')?.focus({preventScroll:true});
        else if (openers.get(dialog)?.isConnected) openers.get(dialog).focus({preventScroll:true});
      });
    });
    dialog.addEventListener('click', event => {
      if (event.target === dialog && !['entryGate','lightbox'].includes(dialog.id)) closeDialog(dialog);
    });
  });
  function burst(origin) {
    if (motionOff.matches) return;
    const r = origin?.getBoundingClientRect?.() || {left:innerWidth/2,top:innerHeight/2,width:0,height:0};
    for (let i=0;i<5;i++) {
      const el=document.createElement('span');
      el.textContent=Math.random()>.25?'♡':'✦';
      Object.assign(el.style,{position:'fixed',left:`${r.left+r.width/2}px`,top:`${r.top+r.height/2}px`,color:'#e58ca3',zIndex:200,pointerEvents:'none'});
      document.body.append(el);
      el.animate([{transform:'translateY(0)',opacity:1},{transform:`translate(${Math.random()*45-22}px,-46px)`,opacity:0}],{duration:540,easing:'ease-out'}).onfinish=()=>el.remove();
    }
  }
  async function notify(contentKey, fallback) {
    const url=content.webhook;
    if (!url || url.includes('YOUR_DISCORD_WEBHOOK_URL_HERE')) throw new Error(fallback || 'Notifications are not configured.');
    const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content,allowed_mentions:{parse:[]}})});
    if(!response.ok) throw new Error('Notification delivery failed');
  }
  return {content,openDialog,closeDialog,burst,notify,motionOff};
}

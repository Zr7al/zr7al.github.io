export function initQuietExperiences(site) {
  const { content: copy, motionOff } = site;
  const bubble = document.getElementById('draftBubble');
  const typing = document.getElementById('typingBubble');
  const announcement = document.getElementById('draftAnnouncement');
  const nextDraft = document.getElementById('nextDraftBtn');
  const drafts = copy['drafts.items'] || [];

  if (bubble && typing && drafts.length) {
    let draftIndex = 0;
    let timer = 0;
    let active = false;
    const messageForScreenReader = text => {
      if (announcement) announcement.textContent = copy['drafts.announcement'].replace('{message}', text);
    };

    function stopDraftAnimation() {
      window.clearTimeout(timer);
      timer = 0;
      active = false;
    }

    function typeDraft() {
      stopDraftAnimation();
      const message = drafts[draftIndex];
      bubble.textContent = '';
      typing.classList.remove('show');

      if (motionOff.matches) {
        bubble.textContent = message;
        messageForScreenReader(message);
        return;
      }

      active = true;
      let position = 0;
      const typeNext = () => {
        if (!active) return;
        if (position < message.length) {
          bubble.textContent += message[position++];
          timer = window.setTimeout(typeNext, 34);
          return;
        }

        messageForScreenReader(message);
        timer = window.setTimeout(eraseNext, 1750);
      };
      const eraseNext = () => {
        if (!active) return;
        if (bubble.textContent.length) {
          bubble.textContent = bubble.textContent.slice(0, -1);
          timer = window.setTimeout(eraseNext, 22);
          return;
        }
        typing.classList.add('show');
        active = false;
      };

      typeNext();
    }

    nextDraft?.addEventListener('click', () => {
      draftIndex = (draftIndex + 1) % drafts.length;
      typeDraft();
    });
    motionOff.addEventListener('change', () => {
      if (motionOff.matches && active) {
        stopDraftAnimation();
        bubble.textContent = drafts[draftIndex];
        typing.classList.remove('show');
        messageForScreenReader(drafts[draftIndex]);
      }
    });
    const section = document.getElementById('drafts');
    if (section && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          typeDraft();
          observer.disconnect();
        }
      }, { threshold: 0.2 });
      observer.observe(section);
    } else {
      typeDraft();
    }
  }

  const orb = document.getElementById('breatheOrb');
  const breatheText = document.getElementById('breatheText');
  if (!orb || !breatheText) return;

  let interval = 0;
  let previousPhase = '';
  const duration = 30_000;
  const cycle = 10_000;
  const inhaleDuration = 4_000;

  function finishBreathing(message) {
    window.clearInterval(interval);
    interval = 0;
    previousPhase = '';
    orb.classList.remove('inhale', 'exhale');
    orb.setAttribute('aria-pressed', 'false');
    orb.setAttribute('aria-label', copy['breathe.ariaStart']);
    breatheText.textContent = message;
  }

  function startBreathing() {
    const startedAt = performance.now();
    orb.setAttribute('aria-pressed', 'true');
    orb.setAttribute('aria-label', copy['breathe.ariaStop']);

    const update = () => {
      const elapsed = performance.now() - startedAt;
      if (elapsed >= duration) {
        finishBreathing(copy['breathe.complete']);
        return;
      }

      const inhale = elapsed % cycle < inhaleDuration;
      const phase = inhale ? 'inhale' : 'exhale';
      orb.classList.toggle('inhale', inhale);
      orb.classList.toggle('exhale', !inhale);
      if (phase !== previousPhase) {
        previousPhase = phase;
        breatheText.textContent = copy[`breathe.${phase}`];
      }
    };

    update();
    interval = window.setInterval(update, 250);
  }

  orb.addEventListener('click', () => {
    if (interval) finishBreathing(copy['breathe.stopped']);
    else startBreathing();
  });
}

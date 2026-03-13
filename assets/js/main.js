/* ============================================
   ZAID RAHHAL — main.js (V4.0 Rhythmic)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  initScrollLogic();
  initHeroReveal();
  initMobileMenu();
  initFadeUpObserver();
  initFAQ();
  initMagneticButtons();
  initTime();
  initSpotlight();
});

/**
 * Navbar, Scroll Progress & Mobile CTA Bar
 */
function initScrollLogic() {
  const nav = document.querySelector('.nav');
  const progress = document.querySelector('.scroll-progress');
  const mobileCta = document.querySelector('.mobile-cta-bar');
  if (!nav && !progress && !mobileCta) return;

  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (mobileCta) {
      const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;
      y > heroHeight ? mobileCta.classList.add('visible') : mobileCta.classList.remove('visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
}

/**
 * Card Spotlight Effect
 * Maps mouse position to CSS variables for light-logic
 */
function initSpotlight() {
  const cards = document.querySelectorAll('.bento-item, .service-card, .testimonial-card');
  if (!cards.length) return;

  cards.forEach(card => {
    let frameId = null;
    card.addEventListener('mousemove', e => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        frameId = null;
      });
    });
  });
}

/**
 * Amman Local Time
 */
function initTime() {
  const timeEl = document.getElementById('localTime');
  if (!timeEl) return;
  const updateTime = () => {
    const now = new Date();
    const options = { timeZone: 'Asia/Amman', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    timeEl.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
  };
  setInterval(updateTime, 1000);
  updateTime();
}

/**
 * Hero Character Reveal
 */
function initHeroReveal() {
  const headline = document.querySelector('#heroHeadline');
  if (!headline) return;
  const lines = headline.querySelectorAll('.line');
  lines.forEach(line => {
    if (line.children.length > 0) return;
    const text = line.textContent;
    line.innerHTML = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      const inner = document.createElement('span');
      inner.style.transitionDelay = `${i * 30}ms`;
      inner.innerHTML = char === ' ' ? '&nbsp;' : char;
      span.appendChild(inner);
      line.appendChild(span);
    });
  });
  setTimeout(() => headline.classList.add('reveal'), 100);
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const closeBtn = document.querySelector('.nav__mobile-close');
  if (!hamburger || !mobileMenu) return;
  const toggle = (open) => {
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  hamburger.addEventListener('click', () => toggle(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggle(false);
    }
  });
}

/**
 * Intersection Observer
 */
function initFadeUpObserver() {
  const items = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  items.forEach(el => observer.observe(el));
}

/**
 * FAQ Toggle
 */
function initFAQ() {
  document.querySelectorAll('.faq-item h4').forEach(h4 => {
    h4.addEventListener('click', () => {
      const item = h4.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/**
 * Magnetic Buttons
 */
function initMagneticButtons() {
  if (window.innerWidth < 1024) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const moveX = (x - r.width / 2) * 0.12;
      const moveY = (y - r.height / 2) * 0.12;
      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
}

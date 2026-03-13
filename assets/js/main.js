/* ============================================
   ZAID RAHHAL — main.js (Strategic UX & Bug Fixes)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  initScrollLogic();
  initHeroReveal();
  initMobileMenu();
  initFadeUpObserver();
  initMagneticButtons();
  initTime();
  initActiveNav();
  initContactForm();
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
    
    // Navbar scrolled state
    if (nav) nav.classList.toggle('scrolled', y > 24);
    
    // Scroll progress bar
    if (progress) {
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }

    // Sticky Mobile CTA visibility (past hero)
    if (mobileCta) {
      const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;
      if (y > heroHeight) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/**
 * Amman Local Time
 */
function initTime() {
  const timeEl = document.getElementById('localTime');
  if (!timeEl) return;

  function updateTime() {
    const now = new Date();
    // Amman is UTC+3
    const options = {
      timeZone: 'Asia/Amman',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    timeEl.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
  }

  setInterval(updateTime, 1000);
  updateTime();
}

/**
 * Hero Character Reveal
 * Splits lines into spans for a mechanical reveal effect
 */
function initHeroReveal() {
  const headline = document.querySelector('#heroHeadline');
  if (!headline) return;

  const lines = headline.querySelectorAll('.line');
  if (lines.length === 0) return;

  lines.forEach(line => {
    if (line.children.length > 0) return;
    const text = line.textContent;
    line.innerHTML = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.style.transitionDelay = `${i * 25}ms`;
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      line.appendChild(span);
    });
  });

  requestAnimationFrame(() => {
    setTimeout(() => {
      headline.classList.add('reveal');
    }, 100);
  });
}

/**
 * Mobile Menu Logic
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const closeBtn = document.querySelector('.nav__mobile-close');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/**
 * Staggered Fade-up Observer
 */
function initFadeUpObserver() {
  const items = document.querySelectorAll('.fade-up');
  if (items.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -50px 0px' 
  });

  items.forEach(el => observer.observe(el));
}

/**
 * Simple FAQ Toggle
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item h4');
  if (faqItems.length === 0) return;

  faqItems.forEach(h4 => {
    h4.addEventListener('click', () => {
      const item = h4.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/**
 * Subtle Magnetic Pull for Buttons
 */
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn');
  if (!btns.length) return;

  function onMove(e) {
    const r = this.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const centerX = r.width / 2;
    const centerY = r.height / 2;
    const moveX = (x - centerX) * 0.12;
    const moveY = (y - centerY) * 0.12;
    this.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }

  function onLeave() {
    this.style.transform = '';
  }

  function bind() {
    if (window.innerWidth < 1024) {
      btns.forEach(btn => {
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
        btn.style.transform = '';
      });
    } else {
      btns.forEach(btn => {
        btn.addEventListener('mousemove', onMove);
        btn.addEventListener('mouseleave', onLeave);
      });
    }
  }

  bind();
  window.addEventListener('resize', bind);
}

/**
 * Active nav link
 */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
}

/**
 * Contact form
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  success.style.display = 'none';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.style.display = 'block';
    form.reset();
  });
}

/* ============================================
   ZAID RAHHAL — main.js v5
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.replace('no-js', 'js');

  initScrollLogic();
  initSmoothNav();
  initNavHighlight();
  initContactForm();
  initMobileMenu();
  initFAQ();
  initTime();

  initHeroEntrance();
  initScrollAnimations();
  initBentoMetrics();
  initCardGlow();
  initSpotlight();
  initMagneticButtons();
  initWorkTilt();
  initParallax();
  initTerminalWidget();
  initProcessTimeline();
});

/* ─── Easing helpers ─── */
const ease = {
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  in:  'cubic-bezier(0.7, 0, 0.84, 0)',
};

/* ─── Smooth anchor navigation (leaves page links intact) ─── */
function initSmoothNav() {
  // Select anchor links from both desktop nav and mobile menu
  const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile-menu a');

  // Brand logo → scroll to top only when already on the home page
  const isHome = ['/', '/index.html', 'index.html'].some(p =>
    window.location.pathname.endsWith(p) || window.location.pathname === '/'
  );
  if (isHome) {
    document.querySelectorAll('.nav__brand').forEach(brand => {
      brand.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Only intercept hash links — let work.html / contact.html navigate normally
    if (!href || !href.startsWith('#')) return;

    link.addEventListener('click', e => {
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Close mobile menu if open
      const mobileMenu = document.querySelector('.nav__mobile-menu');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.querySelector('.nav__hamburger')?.setAttribute('aria-expanded', 'false');
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ─── Contact Form — submission + success state ─── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;

    // Sending state
    btn.disabled = true;
    btn.innerHTML = 'Sending…';

    // Simulate send (replace with real fetch when backend is ready)
    setTimeout(() => {
      form.style.transition  = 'opacity 0.3s ease';
      form.style.opacity     = '0';

      setTimeout(() => {
        form.style.display   = 'none';
        success.style.display = 'block';
        success.style.opacity = '0';
        success.style.transition = 'opacity 0.4s ease';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { success.style.opacity = '1'; });
        });
      }, 300);
    }, 900);
  });
}

/* ─── Active Nav Highlight — tracks which section is in view ─── */
function initNavHighlight() {
  const links = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
  if (!links.length) return;

  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const navH = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  ) || 84;

  function update() {
    const scrollY = window.scrollY;
    // Find the last section whose top is above the midpoint of visible area
    const midpoint = scrollY + navH + window.innerHeight * 0.25;

    let active = null;
    sections.forEach(section => {
      if (section.offsetTop <= midpoint) active = section.id;
    });

    // Clear all, then mark active
    links.forEach(a => {
      const match = active && a.getAttribute('href') === `#${active}`;
      a.classList.toggle('nav-link--active', !!match);
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
  }, { passive: true });

  update();
}

/* ─── Scroll Progress + Nav State + Mobile CTA ─── */
function initScrollLogic() {
  const nav       = document.querySelector('.nav');
  const progress  = document.querySelector('.scroll-progress');
  const mobileCta = document.querySelector('.mobile-cta-bar');
  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (nav)       nav.classList.toggle('scrolled', y > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (mobileCta) {
      const heroH = document.querySelector('.hero')?.offsetHeight || 600;
      mobileCta.classList.toggle('visible', y > heroH);
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
}

/* ─── Hero Entrance — staggered reveal on load ─── */
function initHeroEntrance() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const sequence = [
    { sel: '.hero-badge',        delay: 0   },
    { sel: '.hero__title',       delay: 100 },
    { sel: '.hero__desc',        delay: 240 },
    { sel: '.hero-actions',      delay: 360 },
    { sel: '.hero-trust',        delay: 460 },
    { sel: '.hero-product-card', delay: 160 },
  ];

  sequence.forEach(({ sel, delay }) => {
    const el = hero.querySelector(sel);
    if (!el) return;
    el.style.opacity    = '0';
    el.style.transform  = sel === '.hero-product-card'
      ? 'translateY(28px) scale(0.98)'
      : 'translateY(22px)';
    el.style.transition = `opacity 0.75s ${ease.out} ${delay}ms, transform 0.75s ${ease.out} ${delay}ms`;
  });

  // Two rAF frames to ensure styles are painted before transition triggers
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sequence.forEach(({ sel }) => {
        const el = hero.querySelector(sel);
        if (!el) return;
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0) scale(1)';
      });
    });
  });
}

/* ─── Scroll Animations — IntersectionObserver for .fade-up ─── */
function initScrollAnimations() {
  const items = document.querySelectorAll('.fade-up');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ─── Card Glow — track mouse position for radial gradient highlight ─── */
function initCardGlow() {
  document.querySelectorAll('.bento-card').forEach(card => {
    let frame = null;

    card.addEventListener('mousemove', e => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width)  * 100;
        const y = ((e.clientY - r.top)  / r.height) * 100;
        card.style.setProperty('--glow-x', x.toFixed(1) + '%');
        card.style.setProperty('--glow-y', y.toFixed(1) + '%');
        frame = null;
      });
    });

    card.addEventListener('mouseleave', () => {
      // Drift back to default corner position
      card.style.setProperty('--glow-x', '82%');
      card.style.setProperty('--glow-y', '10%');
    });
  });
}

/* ─── Bento Metrics — animate Lighthouse bars when dev card enters view ─── */
function initBentoMetrics() {
  const devCard = document.querySelector('.bento-card--dev');
  if (!devCard) return;

  const bars = devCard.querySelectorAll('.bento-metric__bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      bars.forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = (bar.dataset.w ?? '0') + '%';
        }, i * 120);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  observer.observe(devCard);
}

/* ─── Mobile Menu ─── */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const menu      = document.querySelector('.nav__mobile-menu');
  const closeBtn  = document.querySelector('.nav__mobile-close');
  if (!hamburger || !menu) return;

  const toggle = open => {
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', open);
  };

  hamburger.addEventListener('click', () => toggle(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
}

/* ─── FAQ Accordion ─── */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
        const a = open.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ─── Amman Local Time ─── */
function initTime() {
  const el = document.getElementById('localTime');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Amman',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  setInterval(tick, 1000);
  tick();
}

/* ─── Card Spotlight (mouse gradient on hover) ─── */
function initSpotlight() {
  const cards = document.querySelectorAll('.testimonial-card, .bento-card');
  cards.forEach(card => {
    let frame = null;
    card.addEventListener('mousemove', e => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
        frame = null;
      });
    });
  });
}

/* ─── Magnetic Buttons ─── */
function initMagneticButtons() {
  if (window.innerWidth < 1024) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.14;
      const y = (e.clientY - r.top  - r.height / 2) * 0.14;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ─── 3D Device Tilt on Work Films ─── */
function initWorkTilt() {
  if (window.innerWidth < 1024) return;

  document.querySelectorAll('.device-showcase').forEach(showcase => {
    const mac   = showcase.querySelector('.device-mac');
    const phone = showcase.querySelector('.device-phone');
    if (!mac) return;

    mac.style.transition   = `transform 0.08s linear`;
    if (phone) phone.style.transition = `transform 0.08s linear`;

    showcase.addEventListener('mousemove', e => {
      const r = showcase.getBoundingClientRect();
      const x = ((e.clientX - r.left)  / r.width  - 0.5);
      const y = ((e.clientY - r.top)   / r.height - 0.5);
      mac.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 7}deg) translateZ(16px)`;
      if (phone) phone.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateZ(32px) translateX(${x * 8}px) translateY(${-24}px) translateX(${24}px)`;
    });

    showcase.addEventListener('mouseleave', () => {
      mac.style.transition   = `transform 0.6s ${ease.out}`;
      mac.style.transform    = '';
      if (phone) {
        phone.style.transition = `transform 0.6s ${ease.out}`;
        phone.style.transform  = '';
      }
      // Reset to snappy after settling
      setTimeout(() => {
        mac.style.transition = `transform 0.08s linear`;
        if (phone) phone.style.transition = `transform 0.08s linear`;
      }, 650);
    });
  });
}

/* ─── Scroll Parallax on Work Films ─── */
function initParallax() {
  const films = document.querySelectorAll('.work-film');
  if (!films.length) return;

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      films.forEach(film => {
        const rect = film.getBoundingClientRect();
        const vh   = window.innerHeight;
        if (rect.top < vh && rect.bottom > 0) {
          const progress = (vh - rect.top) / (vh + rect.height);
          const y = (progress - 0.5) * 32;
          const mac = film.querySelector('.device-mac');
          if (mac && !film.matches(':hover')) {
            mac.style.transform = `translateY(${y}px)`;
          }
        }
      });
    });
  }, { passive: true });
}

/* ─── Terminal Widget ─── */
function initTerminalWidget() {
  const buildLines   = document.getElementById('build-lines');
  const buildCursor  = document.getElementById('build-cursor');
  const buildPhase   = document.getElementById('build-phase');
  const analyzePhase = document.getElementById('analyze-phase');
  const scoreGrid    = document.getElementById('score-grid');
  const tabTitle     = document.getElementById('tab-title');
  const scanBtn      = document.getElementById('scan-btn');
  if (!buildLines || !buildPhase || !analyzePhase) return;

  analyzePhase.style.display = 'none';

  /* Typewriter helper */
  function typewrite(el, text, speed = 50) {
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      el.textContent += text[i];
      if (++i >= text.length) clearInterval(t);
    }, speed);
  }

  /* Score colour helpers */
  function scoreColor(n) { return n >= 90 ? 'score-green' : n >= 50 ? 'score-orange' : 'score-red'; }
  function fillColor(n)  { return n >= 90 ? 'fill-green'  : n >= 50 ? 'fill-orange'  : 'fill-red';  }

  /* Animate all score bars + value labels inside a container — staggered */
  function animateScores(container) {
    container.querySelectorAll('.score-item__val').forEach(el => {
      el.classList.add(scoreColor(parseInt(el.dataset.score ?? el.textContent, 10)));
    });
    container.querySelectorAll('.score-bar__fill').forEach((fill, i) => {
      fill.classList.add(fillColor(parseInt(fill.dataset.w, 10)));
      setTimeout(() => {
        requestAnimationFrame(() => { fill.style.width = fill.dataset.w + '%'; });
      }, i * 110);
    });
  }

  /* Audit lines — Core Web Vitals focused */
  const BUILD_LINES = [
    { text: '> lighthouse audit — ejawdah.com', color: '#6b7280', delay: 0    },
    { text: '  crawling page resources...',      color: '#6b7280', delay: 550  },
    { text: '  ✓ FCP   0.8s',                   color: '#16a34a', delay: 1150 },
    { text: '  ✓ LCP   1.4s',                   color: '#16a34a', delay: 1600 },
    { text: '  ✓ TBT   0ms',                    color: '#16a34a', delay: 2050 },
    { text: '  ✓ CLS   0.001',                  color: '#16a34a', delay: 2500 },
    { text: '  ✓ audit complete',               color: '#2563eb', delay: 3000 },
  ];

  if (tabTitle) typewrite(tabTitle, 'lighthouse ~ ejawdah.com');

  function revealScoreGrid() {
    if (!scoreGrid) return;
    if (buildCursor) buildCursor.style.display = 'none';
    scoreGrid.style.display = 'block';
    animateScores(scoreGrid);
  }

  function switchToAnalyze() {
    buildPhase.style.transition = 'opacity 0.45s ease';
    buildPhase.style.opacity    = '0';
    setTimeout(() => {
      buildPhase.style.display    = 'none';
      analyzePhase.style.display  = 'block';
      analyzePhase.style.opacity  = '0';
      analyzePhase.style.transition = 'opacity 0.45s ease';
      if (tabTitle) typewrite(tabTitle, 'lighthouse ~ audit your site');
      requestAnimationFrame(() => { analyzePhase.style.opacity = '1'; });
    }, 450);
  }

  BUILD_LINES.forEach(({ text, color, delay }, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className   = 'build-line';
      div.style.color = color;
      div.textContent = text;
      buildLines.appendChild(div);
      requestAnimationFrame(() => { div.style.opacity = '1'; });
      if (i === BUILD_LINES.length - 1) {
        setTimeout(revealScoreGrid, 300);
        setTimeout(switchToAnalyze, 3200);
      }
    }, delay);
  });

  /* Scan handler — shows simulated poor scores to motivate enquiry */
  function runScan() {
    const urlInput     = document.getElementById('url-input');
    const analyzeInput = document.getElementById('analyze-input');
    const scanLoading  = document.getElementById('scan-loading');
    const scanCursor   = document.getElementById('scan-cursor');
    const ctaBlock     = document.getElementById('cta-block');
    const resultScores = document.getElementById('result-scores');
    if (!urlInput?.value.trim()) return;

    const url = urlInput.value.trim();
    analyzeInput.style.display = 'none';
    scanLoading.style.display  = 'block';
    if (ctaBlock) ctaBlock.style.display = 'none';

    [
      { id: 'scan-line-1', text: `> auditing ${url}...`,               color: '#6b7280', delay: 0    },
      { id: 'scan-line-2', text: '  testing performance, SEO, a11y...', color: '#6b7280', delay: 500  },
      { id: 'scan-line-3', text: '  compiling results...',              color: '#6b7280', delay: 1100 },
    ].forEach(({ id, text, color, delay }) => {
      const el = document.getElementById(id);
      if (!el) return;
      setTimeout(() => { el.textContent = text; el.style.color = color; el.classList.add('visible'); }, delay);
    });

    setTimeout(() => {
      if (scanCursor) scanCursor.style.display = 'none';
      scanLoading.style.transition = 'opacity 0.35s';
      scanLoading.style.opacity    = '0';

      setTimeout(() => {
        scanLoading.style.display = 'none';
        scanLoading.style.opacity = '1';
        if (scanCursor) scanCursor.style.display = 'inline';

        if (ctaBlock && resultScores) {
          resultScores.innerHTML = [
            { label: 'Performance',    score: 47 },
            { label: 'SEO',            score: 61 },
            { label: 'Accessibility',  score: 54 },
            { label: 'Best Practices', score: 73 },
          ].map(({ label, score }) => `
            <div class="score-item">
              <div class="score-item__header">
                <span class="score-item__label">${label}</span>
                <span class="score-item__val" data-score="${score}">${score}</span>
              </div>
              <div class="score-bar"><div class="score-bar__fill" data-w="${score}"></div></div>
            </div>
          `).join('');

          ctaBlock.style.display = 'block';
          animateScores(ctaBlock);
        }
      }, 350);
    }, 1900);
  }

  if (scanBtn) {
    scanBtn.addEventListener('click', runScan);
    document.getElementById('url-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') runScan();
    });
  }
}

/* ─── Process Timeline — sequential reveal + fill line ─── */
function initProcessTimeline() {
  const timeline = document.getElementById('processTimeline');
  if (!timeline) return;

  const steps = Array.from(timeline.querySelectorAll('.process-step'));
  const fill  = timeline.querySelector('.process-timeline__fill');
  let revealed = false;

  /* Reveal steps sequentially, then animate fill */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || revealed) return;
      revealed = true;

      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('step-visible'), i * 110);
      });

      /* fill line after all steps have appeared */
      if (fill) {
        const isMobile = window.innerWidth <= 860;
        const prop     = isMobile ? 'height' : 'width';
        setTimeout(() => { fill.style[prop] = '100%'; }, steps.length * 110 + 180);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(timeline);

  /* Hover: retract fill to hovered step, restore on leave */
  if (fill) {
    steps.forEach((step, i) => {
      step.addEventListener('mouseenter', () => {
        if (!revealed || window.innerWidth <= 860) return;
        const pct = ((i + 0.5) / steps.length) * 100;
        fill.style.transition = 'width 0.35s cubic-bezier(0.16,1,0.3,1)';
        fill.style.width = pct + '%';
      });
      step.addEventListener('mouseleave', () => {
        if (!revealed || window.innerWidth <= 860) return;
        fill.style.width = '100%';
      });
    });
  }
}

/* ============================================
   ZAID RAHHAL — main.js
   ============================================ */

/* No-JS class swap — runs immediately */
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

/* ============================================
   Optimised scroll — single passive listener,
   rAF-throttled, handles nav + progress bar
   ============================================ */
(function () {
  const nav      = document.querySelector('.nav');
  const progress = document.querySelector('.scroll-progress');
  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (nav)      nav.classList.toggle('scrolled', y > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight
              - document.documentElement.clientHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update(); // run once on load
})();

/* ============================================
   Active nav link — also sets aria-current
   ============================================ */
(function () {
  const links   = document.querySelectorAll('.nav__links a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* ============================================
   Mobile menu — A11y: aria, focus trap, Escape
   ============================================ */
(function () {
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const closeBtn   = document.querySelector('.nav__mobile-close');
  if (!hamburger || !mobileMenu) return;

  /* Attach ARIA */
  hamburger.setAttribute('aria-controls', 'mobile-nav');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('id', 'mobile-nav');
  mobileMenu.setAttribute('role', 'dialog');
  mobileMenu.setAttribute('aria-modal', 'true');
  mobileMenu.setAttribute('aria-label', 'Navigation menu');
  mobileMenu.setAttribute('aria-hidden', 'true');

  const getFocusable = () => Array.from(
    mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
  );

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const items = getFocusable();
    if (items.length) items[0].focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  /* Focus trap + Escape */
  mobileMenu.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const items = getFocusable();
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();

/* ============================================
   Auto-stagger grid children
   ============================================ */
(function () {
  const grids = document.querySelectorAll(
    '.services-grid, .testimonials-grid, .skills-grid, ' +
    '.process-steps, .problems-grid, .results-grid'
  );
  grids.forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      if (!child.classList.contains('fade-up')) child.classList.add('fade-up');
      const hasDelay = [...child.classList].some(c => c.startsWith('delay-'));
      if (!hasDelay && i > 0) child.classList.add('delay-' + Math.min(i, 4));
    });
  });
})();

/* ============================================
   Scroll fade-up (IntersectionObserver)
   Falls back gracefully for old browsers
   ============================================ */
(function () {
  const items = document.querySelectorAll('.fade-up');
  if (!items.length) return;

  /* Old browser / no-JS fallback */
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ============================================
   Smooth anchor scroll
   ============================================ */
(function () {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* ============================================
   FAQ accordion — keyboard accessible
   ============================================ */
(function () {
  document.querySelectorAll('.faq-item h4').forEach(h4 => {
    h4.setAttribute('role', 'button');
    h4.setAttribute('tabindex', '0');
    h4.setAttribute('aria-expanded', 'false');

    function toggle() {
      const item   = h4.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('h4').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        h4.setAttribute('aria-expanded', 'true');
      }
    }

    h4.addEventListener('click', toggle);
    h4.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
})();

/* ============================================
   Contact form — custom validation
   ============================================ */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, msg) {
    const group = input.closest('.form-group');
    let err = group.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.setAttribute('role', 'alert');
      err.setAttribute('aria-live', 'polite');
      group.appendChild(err);
    }
    err.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', err.id = (input.id || 'field') + '-error');
    input.classList.add('input-error');
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    const err   = group && group.querySelector('.field-error');
    if (err) err.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    input.classList.remove('input-error');
  }

  /* Live clearing */
  form.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('input',  () => clearError(f));
    f.addEventListener('change', () => clearError(f));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const firstName = form.querySelector('#firstName');
    const lastName  = form.querySelector('#lastName');
    const email     = form.querySelector('#email');
    const service   = form.querySelector('#service');
    const message   = form.querySelector('#message');

    if (!firstName.value.trim()) {
      setError(firstName, 'Please enter your first name.'); valid = false;
    } else clearError(firstName);

    if (!lastName.value.trim()) {
      setError(lastName, 'Please enter your last name.'); valid = false;
    } else clearError(lastName);

    if (!email.value.trim()) {
      setError(email, 'Please enter your email address.'); valid = false;
    } else if (!emailRx.test(email.value.trim())) {
      setError(email, 'Please enter a valid email address (e.g. name@company.com).'); valid = false;
    } else clearError(email);

    if (!service.value) {
      setError(service, 'Please select a service so I know how to help.'); valid = false;
    } else clearError(service);

    if (!message.value.trim()) {
      setError(message, 'Please describe your project.'); valid = false;
    } else if (message.value.trim().length < 20) {
      setError(message, 'A little more detail helps me prepare — at least 20 characters.'); valid = false;
    } else clearError(message);

    if (!valid) {
      const firstErr = form.querySelector('.input-error');
      if (firstErr) firstErr.focus();
      return;
    }

    const btn     = form.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    }, 1400);
  });
})();

/* ============================================
   Button ripple (mouse-track glow)
   ============================================ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--x', (e.clientX - r.left) + 'px');
    btn.style.setProperty('--y', (e.clientY - r.top)  + 'px');
  });
});

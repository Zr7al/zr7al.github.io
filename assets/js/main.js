// assets/js/main.js
(() => {
  "use strict";

  /* =========================================================
     CONFIG
  ========================================================= */
  const CONFIG = {
    timezone: "Asia/Amman",
    openDays: [0, 1, 2, 3, 4, 6], // Sun–Thu + Sat · Fri closed
    openMin: 10 * 60,
    closeMin: 19 * 60,
    revealThreshold: 0.12,
    staggerMs: 120,
    headerOffsetExtra: 10,
    toTopShowY: 420,
    heroParallaxFactor: 0.28,
    progressBar: true,
    activeNav: true,
    lazyLoadImages: true,
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     HELPERS
  ========================================================= */
  const qs  = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; fn(...args); });
    };
  };

  const lockScroll = (lock) => { document.body.style.overflow = lock ? "hidden" : ""; };

  const getHeaderOffset = () => {
    const header = qs("#siteHeader");
    return (header ? header.offsetHeight : 80) + CONFIG.headerOffsetExtra;
  };

  const safeFocus = (el) => { try { el && el.focus && el.focus({ preventScroll: true }); } catch (e) {} };

  /* =========================================================
     OPEN / CLOSED BADGE
  ========================================================= */
  const statusBadge = qs("#statusBadge");

  const updateStatus = () => {
    if (!statusBadge) return;
    const now   = new Date();
    const amman = new Date(now.toLocaleString("en-US", { timeZone: CONFIG.timezone }));
    const day   = amman.getDay();
    const mins  = amman.getHours() * 60 + amman.getMinutes();
    const open  = CONFIG.openDays.includes(day) && mins >= CONFIG.openMin && mins < CONFIG.closeMin;

    statusBadge.textContent = open ? "● Open Now" : "● Closed";
    statusBadge.className   = "badge-status " + (open ? "is-open" : "is-closed");
  };

  updateStatus();
  setInterval(updateStatus, 30000);

  /* =========================================================
     HEADER SHADOW
  ========================================================= */
  const header = qs("#siteHeader");

  const onScrollHeader = rafThrottle(() => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 8 ? "0 6px 28px rgba(0,0,0,.08)" : "none";
  });

  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* =========================================================
     PROGRESS BAR
  ========================================================= */
  let progressEl = null;

  if (CONFIG.progressBar) {
    progressEl = document.createElement("div");
    progressEl.setAttribute("aria-hidden", "true");
    Object.assign(progressEl.style, {
      position: "fixed", left: "0", top: "0",
      height: "3px", width: "0%", zIndex: "2000",
      background: "linear-gradient(90deg, #C5A059, #1A6449)",
      transition: reduceMotion ? "none" : "width 120ms ease",
    });
    document.body.appendChild(progressEl);
  }

  const onScrollProgress = rafThrottle(() => {
    if (!progressEl) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressEl.style.width = clamp(pct, 0, 100) + "%";
  });

  window.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  /* =========================================================
     MOBILE NAV
  ========================================================= */
  const navToggle = qs("#navToggle");
  const navMenu   = qs("#navMenu");

  const isNavOpen = () => navMenu && navMenu.classList.contains("open");

  const closeNav = () => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    lockScroll(false);
  };

  const openNav = () => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    lockScroll(true);
    safeFocus(qs("a", navMenu));
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => isNavOpen() ? closeNav() : openNav());

    qsa("a", navMenu).forEach((a) => {
      a.addEventListener("click", () => { if (window.innerWidth < 900) closeNav(); });
    });

    document.addEventListener("click", (e) => {
      if (!isNavOpen()) return;
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });

    window.addEventListener("keydown", (e) => {
      if (!isNavOpen()) return;
      if (e.key === "Escape") { closeNav(); safeFocus(navToggle); }
    });

    window.addEventListener("resize", rafThrottle(() => {
      if (window.innerWidth >= 900) closeNav();
    }));
  }

  /* =========================================================
     SMOOTH ANCHORS WITH STICKY OFFSET
  ========================================================= */
  const smoothScrollTo = (target) => {
    const y = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
  };

  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
    });
  });

  /* =========================================================
     REVEAL ANIMATIONS WITH STAGGER
  ========================================================= */
  const revealEls = qsa(".reveal");

  const doRevealGroup = (els) => {
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), i * CONFIG.staggerMs);
    });
  };

  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const parent = el.parentElement;
        if (parent) {
          const group = Array.from(parent.children).filter(
            (c) => c.classList && c.classList.contains("reveal")
          );
          if (group.length > 1) doRevealGroup(group);
          else el.classList.add("in");
        } else {
          el.classList.add("in");
        }
        obs.unobserve(el);
      });
    }, { threshold: CONFIG.revealThreshold });

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* =========================================================
     HERO PARALLAX
  ========================================================= */
  const heroBg = qs(".hero-bg");

  const onScrollHero = rafThrottle(() => {
    if (!heroBg || reduceMotion) return;
    heroBg.style.transform = `translateY(${window.scrollY * CONFIG.heroParallaxFactor}px)`;
  });

  window.addEventListener("scroll", onScrollHero, { passive: true });
  onScrollHero();

  /* =========================================================
     BACK TO TOP
  ========================================================= */
  const toTop = qs("#toTop");

  const onScrollToTop = rafThrottle(() => {
    if (!toTop) return;
    toTop.classList.toggle("show", window.scrollY > CONFIG.toTopShowY);
  });

  window.addEventListener("scroll", onScrollToTop, { passive: true });
  onScrollToTop();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* =========================================================
     ACTIVE NAV HIGHLIGHT
  ========================================================= */
  const setActiveLink = (id) => {
    if (!CONFIG.activeNav || !navMenu) return;
    qsa('a[href^="#"]', navMenu).forEach((a) => {
      const match = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", match);
      a.setAttribute("aria-current", match ? "page" : "false");
    });
  };

  if (CONFIG.activeNav && "IntersectionObserver" in window) {
    const sectionIds = ["about", "services", "clinic", "location", "top"];
    const sections   = sectionIds.map((id) => qs(`#${id}`)).filter(Boolean);

    if (sections.length) {
      const navSpy = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target && visible.target.id) setActiveLink(visible.target.id);
      }, { root: null, threshold: [0.15, 0.25, 0.35, 0.5] });

      sections.forEach((s) => navSpy.observe(s));
    }
  }

  /* =========================================================
     LAZY LOAD IMAGES
  ========================================================= */
  if (CONFIG.lazyLoadImages) {
    qsa("img").forEach((img) => {
      if (!img.getAttribute("loading"))  img.setAttribute("loading", "lazy");
      if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
    });
  }

  /* =========================================================
     BUTTON PRESS EFFECT
  ========================================================= */
  if (!reduceMotion) {
    const pressables = qsa(".btn, .pill, .mini-link, .footer-link, .topbar-call");
    pressables.forEach((el) => {
      el.addEventListener("pointerdown",  () => el.classList.add("is-pressed"));
      el.addEventListener("pointerup",    () => el.classList.remove("is-pressed"));
      el.addEventListener("pointercancel",() => el.classList.remove("is-pressed"));
      el.addEventListener("pointerleave", () => el.classList.remove("is-pressed"));
    });
  }

})();
// assets/js/cases.js
(() => {
  "use strict";

  /* =========================================================
     CASES DATA (Single Source of Truth)
  ========================================================= */
  const casesData = {
    "ll6-endo-endo-crown": {
      title: "Root Canal Treatment and Endo Crown Lower Left First Molar",
      heroImage: "assets/img/cases/lower-left-first-molar/04-endo-crown.webp",
      icon: "🦷",
      excerpt:
        "Non surgical root canal therapy followed by adhesive endo crown restoration with 6 month follow up",

      content: `
        <p><strong>Tooth:</strong> Lower left first molar</p>
        <p><strong>Date of treatment:</strong> September 2025</p>
        <p><strong>Follow up:</strong> March 2026 6 month review</p>

        <h3>Initial Presentation</h3>
        <p>The patient presented with deep caries and symptomatic irreversible pulpitis affecting the lower left first molar. Clinical and radiographic evaluation confirmed the need for endodontic therapy.</p>

        <img src="assets/img/cases/lower-left-first-molar/01-isolation.webp" alt="Rubber dam isolation lower left first molar">

        <h3>Root Canal Treatment</h3>
        <p>Non surgical root canal treatment was performed under rubber dam isolation. Cleaning and shaping were completed followed by three dimensional obturation.</p>

        <img src="assets/img/cases/lower-left-first-molar/02-endo-access.webp" alt="Access cavity lower left first molar">
        <img src="assets/img/cases/lower-left-first-molar/03-post-endo.webp" alt="Post endodontic build up">

        <h3>Definitive Restoration Endo Crown</h3>
        <p>An adhesive endo crown was selected as the definitive restoration to preserve remaining tooth structure while ensuring functional durability and optimal occlusion.</p>

        <img src="assets/img/cases/lower-left-first-molar/04-endo-crown.webp" alt="Endo crown on lower left first molar">

        <h3>Radiographic Evaluation</h3>
        <p>Post operative radiograph demonstrates adequate obturation and apical seal.</p>

        <img src="assets/img/cases/lower-left-first-molar/05-xray.webp" alt="Post operative radiograph lower left first molar">

        <h3>Follow Up 6 Months</h3>
        <p>At 6 month review the tooth remained asymptomatic with normal function and healthy periapical status.</p>
      `,
    },
    "example case": 
        {
            title: "Example Title",
            heroImage: "assets/img/cases/smile-makeover-2026/hero.webp",
            icon: "✨",
            excerpt: "Exmaple Description",

            content: `
                <p><strong>Example Procedure:</strong> Smile makeover</p>

                <h3>Exmample Before</h3>
                <img src="assets/img/cases/smile-makeover-2026/before.webp" alt="Before smile">

                <h3>Exmample After</h3>
                <img src="assets/img/cases/smile-makeover-2026/after.webp" alt="After smile">

                <p>Exmample Final result.</p>
            `
        }
  };

  /* =========================================================
     CASES LIST PAGE
  ========================================================= */
  const grid = document.getElementById("casesGrid");

  if (grid) {
    const makeCardHTML = (id, data) => {
      const href = `cases-detail.html?id=${encodeURIComponent(id)}`;

      const media = data.heroImage
        ? `
          <div class="case-img">
            <img src="${data.heroImage}" alt="${data.title}" loading="lazy" decoding="async">
          </div>
        `
        : `
          <div class="case-img">${data.icon || "🦷"}</div>
        `;

      const excerpt = data.excerpt
        ? `<p class="case-excerpt">${data.excerpt}</p>`
        : "";

      return `
        <a class="case-card" href="${href}">
          ${media}
          <h2 class="case-title">${data.title}</h2>
          ${excerpt}
        </a>
      `;
    };

    const ids = Object.keys(casesData);

    grid.innerHTML = ids.length
      ? ids.map((id) => makeCardHTML(id, casesData[id])).join("")
      : "<p>No cases yet</p>";
  }

  /* =========================================================
     CASE DETAIL PAGE
  ========================================================= */
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");

  const titleEl = document.getElementById("articleTitle");
  const bodyEl = document.getElementById("articleBody");
  const heroWrap = document.getElementById("heroWrap");

  if (titleEl && bodyEl) {
    const caseData = caseId ? casesData[caseId] : null;

    if (caseData) {
      titleEl.textContent = caseData.title;
      bodyEl.innerHTML = caseData.content;

      if (caseData.heroImage && heroWrap) {
        const img = document.createElement("img");
        img.src = caseData.heroImage;
        img.className = "article-hero";
        img.alt = caseData.title;
        img.loading = "lazy";
        img.decoding = "async";

        heroWrap.replaceWith(img);
      }
    } else {
      titleEl.textContent = "Case Not Found";
      bodyEl.innerHTML = "<p>Please return to the cases page.</p>";
    }
  }

})();
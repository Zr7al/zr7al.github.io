const START_DATE = new Date("2023-11-21T00:00:00");

const MEDIA = [
  { type: "image", src: "images/photo01.jpg", caption: "us, somewhere in between ordinary and special" },
  { type: "image", src: "images/photo02.jpg", caption: "one of the good ones" },
  { type: "image", src: "images/photo03.jpg", caption: "the kind of moment that stays" },
  { type: "image", src: "images/photo04.jpg", caption: "just us" },
  { type: "image", src: "images/photo05.jpg", caption: "too cute to leave in camera roll" },
  { type: "image", src: "images/photo06.jpg", caption: "another little us" },
  { type: "image", src: "images/photo07.jpg", caption: "my favourite view" },
  { type: "image", src: "images/photo08.jpg", caption: "soft days" },
  { type: "image", src: "images/photo09.jpg", caption: "same people, different day" },
  { type: "image", src: "images/photo10.jpg", caption: "keep this one" },
  { type: "image", src: "images/photo11.jpg", caption: "chaos but make it us" },
  { type: "image", src: "images/photo12.jpg", caption: "little snapshots" },
  { type: "image", src: "images/photo13.jpg", caption: "one more for the archive" },
  { type: "image", src: "images/photo14.jpg", caption: "comfortable looks good on us" },
  { type: "image", src: "images/photo15.jpg", caption: "okay this one is adorable" },
  { type: "image", src: "images/photo16.jpg", caption: "ordinary day, favourite memory" },
  { type: "image", src: "images/photo17.jpg", caption: "us being us" },
  { type: "image", src: "images/photo18.jpg", caption: "one of those days" },
  { type: "image", src: "images/photo19.jpg", caption: "a tiny time capsule" },
  { type: "image", src: "images/photo20.jpg", caption: "close enough" },
  { type: "image", src: "images/photo21.jpg", caption: "the good kind of familiar" },
  { type: "image", src: "images/photo22.jpg", caption: "another one worth keeping" },
  { type: "image", src: "images/photo23.jpg", caption: "same story, new frame" },
  { type: "image", src: "images/photo24.jpg", caption: "tiny memory" },
  { type: "image", src: "images/photo25.jpg", caption: "yeah, this one too" },
  { type: "image", src: "images/photo26.jpg", caption: "camera roll evidence" },
  { type: "image", src: "images/photo27.jpg", caption: "one for the lore" },
  { type: "image", src: "images/photo28.jpg", caption: "this is us" },
  { type: "image", src: "images/photo29.jpg", caption: "keep smiling" },
  { type: "image", src: "images/photo30.jpg", caption: "a very specific kind of happiness" },
  { type: "image", src: "images/photo31.jpg", caption: "proof we had fun" },
  { type: "image", src: "images/photo32.jpg", caption: "another one for later" },
  { type: "image", src: "images/photo33.jpg", caption: "good memories are messy" },
  { type: "image", src: "images/photo34.jpg", caption: "one of my favourites" },
  { type: "image", src: "images/photo35.jpg", caption: "ordinary moments hit different" },
  { type: "image", src: "images/photo36.jpg", caption: "hold onto this" },
  { type: "image", src: "images/photo37.jpg", caption: "one for the archive" },
  { type: "image", src: "images/photo38.jpg", caption: "still us" },
  { type: "image", src: "images/photo39.jpg", caption: "and we'd do it all again" }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function daysSince(date) {
  const now = new Date();
  return Math.floor((now - date) / 86400000);
}

function nextRecurringDate(month, day) {
  const now = new Date();
  let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0, 0);
  if (target <= now) target = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0, 0);
  return target;
}

function splitCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

function setCountdown(prefix, target) {
  const values = splitCountdown(target - new Date());
  const pad = (n) => String(n).padStart(2, "0");
  const days = document.getElementById(`${prefix}-days`);
  const hours = document.getElementById(`${prefix}-hours`);
  const minutes = document.getElementById(`${prefix}-minutes`);
  const seconds = document.getElementById(`${prefix}-seconds`);
  if (!days || !hours || !minutes || !seconds) return;
  days.textContent = values.days.toLocaleString();
  hours.textContent = pad(values.hours);
  minutes.textContent = pad(values.minutes);
  seconds.textContent = pad(values.seconds);
}

function renderCountdowns() {
  setCountdown("birthday", nextRecurringDate(4, 29));
  setCountdown("anniversary", nextRecurringDate(11, 21));
}

function renderCounter() {
  const el = $("#counter-number");
  if (el) el.textContent = daysSince(START_DATE).toLocaleString();
}

let revealObserver;
function setupReveal() {
  const items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    items.forEach((item) => revealObserver.observe(item));
  } else {
    items.forEach((item) => item.classList.add("is-visible"));
  }
}

function burstHearts(origin = null) {
  const holder = $("#floating-hearts");
  const rect = origin?.getBoundingClientRect();
  const centerX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const count = window.innerWidth < 600 ? 10 : 16;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "heart-float";
    heart.textContent = ["♡", "♥", "✦"][i % 3];
    heart.style.left = `${centerX + (Math.random() * 50 - 25)}px`;
    heart.style.bottom = `${rect ? window.innerHeight - rect.top : 90}px`;
    heart.style.setProperty("--size", `${12 + Math.random() * 16}px`);
    heart.style.setProperty("--drift", `${Math.random() * 130 - 65}px`);
    heart.style.animationDelay = `${Math.random() * .22}s`;
    holder.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function pickClass(index) {
  if (index === 0 || index === 11 || index === 24 || index === 38) return "is-tall";
  if (index === 4 || index === 15 || index === 28 || index === 33) return "is-wide";
  return "";
}

function buildMediaItem(item, index) {
  const wrap = document.createElement("figure");
  wrap.className = `media-item ${pickClass(index)}`;
  wrap.tabIndex = 0;
  wrap.setAttribute("role", "button");
  wrap.setAttribute("aria-label", `Open memory ${index + 1}`);

  const el = document.createElement(item.type === "video" ? "video" : "img");
  el.src = item.src;
  el.loading = index < 6 ? "eager" : "lazy";
  el.decoding = "async";
  if (item.type === "video") {
    el.muted = true;
    el.playsInline = true;
    el.preload = "metadata";
  } else {
    el.alt = item.caption || `Memory ${index + 1} of Zaid and Rama`;
  }

  el.addEventListener("error", () => {
    wrap.classList.add("media-item--empty");
    el.remove();
  });

  wrap.appendChild(el);

  if (item.type === "video") {
    const badge = document.createElement("span");
    badge.className = "video-badge";
    badge.textContent = "video";
    wrap.appendChild(badge);
  }

  const meta = document.createElement("div");
  meta.className = "media-meta";
  meta.innerHTML = `<span class="media-index">${String(index + 1).padStart(2, "0")}</span><span>♡</span>`;
  wrap.appendChild(meta);

  const open = () => openLightbox(index);
  wrap.addEventListener("click", open);
  wrap.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  return wrap;
}

function renderGallery() {
  const grid = $("#gallery-grid");
  grid.innerHTML = "";
  MEDIA.forEach((item, index) => grid.appendChild(buildMediaItem(item, index)));
}

let currentIndex = 0;
function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  $("#lightbox").classList.add("is-open");
  $("#lightbox").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function updateLightbox() {
  const item = MEDIA[currentIndex];
  const content = $("#lightbox-content");
  content.innerHTML = "";

  const el = document.createElement(item.type === "video" ? "video" : "img");
  el.src = item.src;
  el.decoding = "async";
  if (item.type === "video") {
    el.controls = true;
    el.autoplay = true;
    el.playsInline = true;
  } else {
    el.alt = item.caption;
  }
  content.appendChild(el);

  $("#lightbox-counter").textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${MEDIA.length}`;
  $("#lightbox-caption").textContent = item.caption || "♡";
}

function moveLightbox(delta) {
  currentIndex = (currentIndex + delta + MEDIA.length) % MEDIA.length;
  updateLightbox();
}

function closeLightbox() {
  const box = $("#lightbox");
  box.classList.remove("is-open");
  box.setAttribute("aria-hidden", "true");
  $("#lightbox-content").innerHTML = "";
  document.body.classList.remove("no-scroll");
}

function randomMemory() {
  const index = Math.floor(Math.random() * MEDIA.length);
  burstHearts();
  showToast(`memory ${String(index + 1).padStart(2, "0")} picked for you ♡`);
  setTimeout(() => openLightbox(index), 180);
}

let touchStartX = 0;
let touchStartY = 0;
function setupLightboxGestures() {
  const box = $("#lightbox");
  box.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  box.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    moveLightbox(dx < 0 ? 1 : -1);
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCounter();
  renderCountdowns();
  renderGallery();
  setupReveal();
  setupLightboxGestures();

  $("#heart-button").addEventListener("click", (event) => {
    event.currentTarget.classList.remove("is-pulsing");
    requestAnimationFrame(() => event.currentTarget.classList.add("is-pulsing"));
    burstHearts(event.currentTarget);
    showToast("one little heart sent ♡");
  });

  $("#memory-button").addEventListener("click", randomMemory);
  $("#lightbox-close").addEventListener("click", closeLightbox);
  $("#lightbox-prev").addEventListener("click", () => moveLightbox(-1));
  $("#lightbox-next").addEventListener("click", () => moveLightbox(1));
  $("#lightbox").addEventListener("click", (event) => {
    if (event.target.id === "lightbox") closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!(event.key === "Escape" || event.key === "ArrowLeft" || event.key === "ArrowRight")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });

  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a, figure, nav")) return;
    if (Math.random() > .32) return;
    const heart = document.createElement("span");
    heart.className = "heart-float";
    heart.textContent = "♡";
    heart.style.left = `${event.clientX}px`;
    heart.style.bottom = `${window.innerHeight - event.clientY}px`;
    heart.style.setProperty("--size", "12px");
    heart.style.setProperty("--drift", `${Math.random() * 70 - 35}px`);
    $("#floating-hearts").appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  });
});

setInterval(renderCounter, 60000);
setInterval(renderCountdowns, 1000);

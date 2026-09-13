// ================================================================
// EDIT ME: the days-together start date. This is the only place it lives.
// ================================================================
const START_DATE = new Date("2023-11-21T00:00:00");

// ================================================================
// EDIT ME: your photos and videos.
// Add one line per file. type is "image" or "video".
// src is the path — put the actual files in the /images or /videos folder
// next to this script, then point src at the filename.
// caption is optional — delete the line or leave it as "" to skip it.
//
// Order here = order they appear on the page. Add as many as you want,
// the grid just keeps flowing.
// ================================================================
const MEDIA = [
  { type: "image", src: "images/photo01.jpg", caption: "" },
  { type: "image", src: "images/photo02.jpg", caption: "" },
  { type: "image", src: "images/photo03.jpg", caption: "" },
  { type: "image", src: "images/photo04.jpg", caption: "" },
  { type: "image", src: "images/photo05.jpg", caption: "" },
  { type: "image", src: "images/photo06.jpg", caption: "" },
  { type: "image", src: "images/photo07.jpg", caption: "" },
  { type: "image", src: "images/photo08.jpg", caption: "" },
  { type: "image", src: "images/photo09.jpg", caption: "" },
  { type: "image", src: "images/photo10.jpg", caption: "" },
  { type: "image", src: "images/photo11.jpg", caption: "" },
  { type: "image", src: "images/photo12.jpg", caption: "" },
  { type: "image", src: "images/photo13.jpg", caption: "" },
  { type: "image", src: "images/photo14.jpg", caption: "" },
  { type: "image", src: "images/photo15.jpg", caption: "" },
  { type: "image", src: "images/photo16.jpg", caption: "" },
  { type: "image", src: "images/photo17.jpg", caption: "" },
  { type: "image", src: "images/photo18.jpg", caption: "" },
  { type: "image", src: "images/photo19.jpg", caption: "" },
  { type: "image", src: "images/photo20.jpg", caption: "" },
  { type: "image", src: "images/photo21.jpg", caption: "" },
  { type: "image", src: "images/photo22.jpg", caption: "" },
  { type: "image", src: "images/photo23.jpg", caption: "" },
  { type: "image", src: "images/photo24.jpg", caption: "" },
  { type: "image", src: "images/photo25.jpg", caption: "" },
  { type: "image", src: "images/photo26.jpg", caption: "" },
  { type: "image", src: "images/photo27.jpg", caption: "" },
  { type: "image", src: "images/photo28.jpg", caption: "" },
  { type: "image", src: "images/photo29.jpg", caption: "" },
  { type: "image", src: "images/photo30.jpg", caption: "" },
  { type: "image", src: "images/photo31.jpg", caption: "" },
  { type: "image", src: "images/photo32.jpg", caption: "" },
  { type: "image", src: "images/photo33.jpg", caption: "" },
  { type: "image", src: "images/photo34.jpg", caption: "" },
  { type: "image", src: "images/photo35.jpg", caption: "" },
  { type: "image", src: "images/photo36.jpg", caption: "" },
  { type: "image", src: "images/photo37.jpg", caption: "" },
  { type: "image", src: "images/photo38.jpg", caption: "" },
  { type: "image", src: "images/photo39.jpg", caption: "" },
];

function daysSince(date) {
  const now = new Date();
  const diffMs = now - date;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function renderCounter() {
  const el = document.getElementById("counter-number");
  if (!el) return;
  el.textContent = daysSince(START_DATE).toLocaleString();
}

function buildMediaItem(item) {
  const wrap = document.createElement("figure");
  wrap.className = "media-item";
  wrap.tabIndex = 0;
  wrap.setAttribute("role", "button");
  wrap.setAttribute("aria-label", "Open full size");
  wrap.dataset.placeholderLabel = item.type === "video" ? "video goes here" : "photo goes here";

  const el = document.createElement(item.type === "video" ? "video" : "img");
  el.src = item.src;
  if (item.type === "video") {
    el.muted = true;
    el.playsInline = true;
    el.preload = "metadata";
  } else {
    el.alt = item.caption || "A photo of Zaid and Rama";
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

  if (item.caption) {
    const cap = document.createElement("figcaption");
    cap.textContent = item.caption;
    wrap.appendChild(cap);
  }

  const openHandler = () => openLightbox(item);
  wrap.addEventListener("click", openHandler);
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openHandler(); }
  });

  return wrap;
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = "";
  MEDIA.forEach((item) => grid.appendChild(buildMediaItem(item)));
}

function openLightbox(item) {
  const lightbox = document.getElementById("lightbox");
  const content = document.getElementById("lightbox-content");
  content.innerHTML = "";

  const el = document.createElement(item.type === "video" ? "video" : "img");
  el.src = item.src;
  if (item.type === "video") {
    el.controls = true;
    el.autoplay = true;
    el.playsInline = true;
  } else {
    el.alt = item.caption || "A photo of Zaid and Rama";
  }

  content.appendChild(el);
  lightbox.classList.add("is-open");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const content = document.getElementById("lightbox-content");
  lightbox.classList.remove("is-open");
  content.innerHTML = ""; // stops any playing video
}

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

renderCounter();
setInterval(renderCounter, 60 * 1000);
renderGallery();

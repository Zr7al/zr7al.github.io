export function initKeepsake(content){
 const selection=['2023.webp','2024 (9).webp','2025 (7).webp','2026.webp','2026 (15).webp','2026 (17).webp'];
 const gallery=document.getElementById('keepsakeGallery');
 for(const filename of selection){const info=content.photos[filename];if(!info)continue;const figure=document.createElement('figure');const img=document.createElement('img');img.src=info.src;img.alt=info.alt;img.width=info.width;img.height=info.height;img.loading='lazy';img.decoding='async';const caption=document.createElement('figcaption');caption.textContent=info.caption;figure.append(img,caption);gallery.append(figure);}
 document.getElementById('printKeepsake')?.addEventListener('click',()=>window.print());
}

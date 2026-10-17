import { makeRuntime } from './runtime.js';
import { initArchive } from './archive.js';
import { initInteractions } from './interactions.js';
import { initSound } from './sound.js';
import { initFilm } from './film.js';
import { initKeepsake } from './keepsake.js';
import { initQuietExperiences } from './quiet.js';

async function readJSON(file) {
  const response=await fetch(new URL(`../${file}`,import.meta.url));
  if(!response.ok) throw new Error(`Could not load ${file}`);
  return response.json();
}
function hydrateCopy(content) {
  document.querySelectorAll('[data-copy]').forEach(el=>{
    const value=content.markup?.[el.dataset.copy] ?? content[el.dataset.copy];
    if(value!==undefined) el.textContent=value;
  });
  document.querySelectorAll('[data-copy-aria-label]').forEach(el=>{const value=content.markup?.[el.dataset.copyAriaLabel] ?? content[el.dataset.copyAriaLabel];if(value!==undefined)el.setAttribute('aria-label',value);});
  document.querySelectorAll('[data-copy-placeholder]').forEach(el=>{const value=content.markup?.[el.dataset.copyPlaceholder];if(value!==undefined)el.setAttribute('placeholder',value);});
  document.querySelectorAll('[data-copy-title]').forEach(el=>{const value=content.markup?.[el.dataset.copyTitle];if(value!==undefined)el.setAttribute('title',value);});
  document.querySelectorAll('[data-copy-alt]').forEach(el=>{const value=content.markup?.[el.dataset.copyAlt];if(value!==undefined)el.setAttribute('alt',value);});
  const title=content['page.title'];if(title)document.title=title;
}

export async function boot() {
  let loadedCopy;
  try {
    const data=await readJSON('content.json');
    const content=data.copy;
    loadedCopy=content;
    hydrateCopy(content);
    if(document.body.dataset.page==='keepsake') { initKeepsake(content); return; }
    const timeline=await readJSON('timeline.json');
    const site=makeRuntime(content);
    site.timeline=timeline;
    site.photos=initArchive(site);
    initInteractions(site);
    initQuietExperiences(site);
    initSound(site);
    initFilm(site);
    document.getElementById('enterWithMusic')?.addEventListener('click',()=>window.startSong());
    document.getElementById('enterSilent')?.addEventListener('click',()=>site.closeDialog(document.getElementById('entryGate')));
    site.openDialog(document.getElementById('entryGate'),document.body);
  } catch(error) {
    console.error('The archive could not start:',error);
    const message=document.getElementById('startupError');
    if(message){message.hidden=false;message.textContent=loadedCopy?.['startup.error']||'The archive could not load. Please refresh the page.';}
    const gate=document.getElementById('entryGate');
    if(gate&&!gate.open)gate.showModal();
  }
}

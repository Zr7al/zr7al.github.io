// 1. ENTRY GATE, VISIT RADAR & BACKGROUND MUSIC
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1560572526466301974/UeGeI84xW2G1WAf7PXIFlf6Qmjjn2FjT9sGLKDMGBAcQG3Y6eKYXLGQtHTFvYb31RNgK';

function pingDiscord(content) {
  try {
    fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  } catch (e) {}
}

let audioCtx = null;
let musicPlaying = false;
let musicInterval = null;
const melodyNotes = [523.25, 659.25, 783.99, 987.77, 783.99, 659.25, 587.33, 739.99, 880.00, 659.25];
let noteIdx = 0;

function playMusicBoxNote(freq) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 2.5);
  } catch (e) {}
}

function pauseBackgroundMusic() {
  const btn = document.getElementById('musicToggle');
  if (window.activeSong && !window.activeSong.paused) {
    window.activeSong.pause();
    if (btn) btn.textContent = '♪ off';
  }
  if (musicPlaying) {
    clearInterval(musicInterval);
    musicPlaying = false;
    if (btn) btn.textContent = '♪ off';
  }
}

function toggleMusic(forceStart = false) {
  const btn = document.getElementById('musicToggle');
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (musicPlaying && !forceStart) {
      clearInterval(musicInterval);
      musicPlaying = false;
      if (btn) btn.textContent = '♪ off';
    } else if (!musicPlaying) {
      musicPlaying = true;
      if (btn) btn.textContent = '♪ playing';
      playMusicBoxNote(melodyNotes[noteIdx]);
      musicInterval = setInterval(() => {
        noteIdx = (noteIdx + 1) % melodyNotes.length;
        playMusicBoxNote(melodyNotes[noteIdx]);
      }, 1350);
    }
  } catch (e) {}
}

window.enterSite = function(withMusic) {
  const gate = document.getElementById('entryGate');
  if (gate) {
    gate.classList.add('hidden');
    setTimeout(() => { gate.style.display = 'none'; }, 750);
  }

  typeLetter(activeLetterKey);
  playDraftSimulation(0);

  if (!sessionStorage.getItem('archive_visit_logged')) {
    sessionStorage.setItem('archive_visit_logged', 'true');
    pingDiscord(`🌙 **Visitor Alert:** Someone just opened \`zaidrahhal.me\` (${withMusic ? 'with melody ♪' : 'quiet mode'}) at *${new Date().toLocaleString()}*`);
  }

  if (withMusic) {
    const songFile = new Audio('song.mp3');
    songFile.loop = true;
    songFile.volume = 0.55;
    songFile.play().then(() => {
      musicPlaying = true;
      const btn = document.getElementById('musicToggle');
      if (btn) btn.textContent = '♪ playing';
      window.activeSong = songFile;
    }).catch(() => {
      toggleMusic(true);
    });
  }
};

document.getElementById('musicToggle').onclick = () => {
  const btn = document.getElementById('musicToggle');
  if (window.activeSong) {
    if (window.activeSong.paused) {
      window.activeSong.play();
      btn.textContent = '♪ playing';
    } else {
      window.activeSong.pause();
      btn.textContent = '♪ off';
    }
  } else {
    toggleMusic();
  }
};

// 2. LIVE TYPING UNSENT MESSAGES
const unsentLetters = {
  tonight: {
    date: "typing: for the quiet hours...",
    doneDate: "for the quiet hours",
    text: "ramroomti,\n\ni don't have anything clever to say tonight. i just hope you're okay.\n\ni like that these photos still exist. even the blurry ones. they remind me of ordinary moments i wouldn't want to lose.\n\nyou don't have to reply to any of this."
  },
  silence: {
    date: "typing: about the distance...",
    doneDate: "about the distance",
    text: "i miss talking to you. the small things as much as the big ones.\n\ni don't know what this space feels like for you, and i don't want to guess. i can care about you and leave you room at the same time."
  },
  regret: {
    date: "typing: looking back at us...",
    doneDate: "looking back at us",
    text: "there are things i wish had gone differently. i don't want to cover that up with a nice sentence.\n\nbut the good days were part of us too. i still smile at these pictures. i'm glad we have them."
  },
  door: {
    date: "typing: where i stand...",
    doneDate: "where i stand",
    text: "i can't promise what comes next. and i can't speak for you.\n\nif we ever both wanted to try again, i'd want there to be room for the difficult conversations too. not just the things we miss.\n\nfor now, this is a place to keep the memories. it doesn't ask you for an answer."
  }
};

let activeLetterKey = 'tonight';
let typeTimeout = null;

function typeLetter(key) {
  activeLetterKey = key;
  const box = document.getElementById('typewriterText');
  const dateEl = document.getElementById('letterDate');
  const dot = document.querySelector('.typing-dot');
  const item = unsentLetters[key];
  if (!box || !dateEl || !item) return;

  clearTimeout(typeTimeout);
  dateEl.textContent = item.date;
  if (dot) dot.classList.add('active');
  box.textContent = "";

  let i = 0;
  function step() {
    if (i < item.text.length) {
      const ch = item.text.charAt(i);
      box.textContent += ch;
      i++;
      let delay = 24;
      if (ch === '.' || ch === '—') delay = 210;
      else if (ch === ',') delay = 100;
      else if (ch === '\n') delay = 170;
      typeTimeout = setTimeout(step, delay);
    } else {
      dateEl.textContent = item.doneDate;
      if (dot) dot.classList.remove('active');
    }
  }
  step();
}

document.querySelectorAll('.unsent-tab').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.unsent-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    typeLetter(btn.dataset.letter);
  };
});
const replayBtn = document.getElementById('replayTypeBtn');
if (replayBtn) replayBtn.onclick = () => typeLetter(activeLetterKey);
typeLetter('tonight');

// 3. 2:14 AM PHONE DRAFTS SIMULATOR
const draftsList = [
  { time: "2:14 AM", text: "I saw something today that made me think of you. I hope your day was gentle." },
  { time: "2:14 AM", text: "Some days I miss our little conversations. No need to reply—I just hope you’re doing okay." },
  { time: "2:14 AM", text: "I hope you’ve found a little quiet tonight. I’m giving you space, and I still wish you well." }
];
let draftIdx = 0;
let draftTimer = null;
const draftMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

function playDraftSimulation(idx) {
  const bubble = document.getElementById('draftBubble');
  const typing = document.getElementById('typingBubble');
  const timeEl = document.getElementById('phoneDraftTime');
  if (!bubble || !typing) return;

  clearTimeout(draftTimer);
  const item = draftsList[idx];
  if (timeEl) timeEl.textContent = item.time;
  bubble.style.display = 'block';
  bubble.textContent = '';
  typing.classList.remove('show');
  const announcement = document.getElementById('draftAnnouncement');
  if (draftMotionPreference.matches) {
    bubble.textContent = item.text;
    if (announcement) announcement.textContent = `Draft preview: ${item.text}`;
    return;
  }

  let i = 0;
  function typeChar() {
    if (i < item.text.length) {
      bubble.textContent += item.text.charAt(i++);
      draftTimer = setTimeout(typeChar, 34);
      return;
    }
    if (announcement) announcement.textContent = `Draft preview: ${item.text}`;
    draftTimer = setTimeout(eraseChar, 1500);
  }
  function eraseChar() {
    if (bubble.textContent.length) {
      bubble.textContent = bubble.textContent.slice(0, -1);
      draftTimer = setTimeout(eraseChar, 20);
      return;
    }
    typing.classList.add('show');
  }
  typeChar();
}

draftMotionPreference.addEventListener?.('change', event => {
  if (!event.matches) return;
  clearTimeout(draftTimer);
  const bubble = document.getElementById('draftBubble');
  const typing = document.getElementById('typingBubble');
  const announcement = document.getElementById('draftAnnouncement');
  if (!bubble || !draftsList[draftIdx]) return;
  bubble.textContent = draftsList[draftIdx].text;
  typing?.classList.remove('show');
  if (announcement) announcement.textContent = `Draft preview: ${bubble.textContent}`;
});

const nextDraftBtn = document.getElementById('nextDraftBtn');
if (nextDraftBtn) {
  nextDraftBtn.onclick = () => {
    draftIdx = (draftIdx + 1) % draftsList.length;
    playDraftSimulation(draftIdx);
  };
}

// 4. REAL VOICE NOTE PLAYER (Plays voicenote.mp3 or voicenote.m4a!)
const realVoiceAudio = document.getElementById('realVoiceAudio');
const vnWaveform = document.getElementById('vnWaveform');
const vnPlayBtn = document.getElementById('vnPlayBtn');
const vnTimer = document.getElementById('vnTimer');
const vnSubtitle = document.getElementById('vnSubtitle');
const barHeights = [12, 22, 16, 30, 24, 14, 34, 20, 15, 28, 32, 18, 25, 14, 29, 21, 16, 33, 24, 15, 27, 19, 13, 22, 18, 26, 15, 20];

function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

if (vnWaveform && vnPlayBtn && realVoiceAudio) {
  barHeights.forEach((h, idx) => {
    const bar = document.createElement('div');
    bar.className = 'vn-bar';
    bar.style.height = h + 'px';
    bar.onclick = () => {
      if (realVoiceAudio.duration) {
        realVoiceAudio.currentTime = (idx / barHeights.length) * realVoiceAudio.duration;
      }
    };
    vnWaveform.appendChild(bar);
  });

  realVoiceAudio.addEventListener('loadedmetadata', () => {
    vnTimer.textContent = `0:00 / ${formatTime(realVoiceAudio.duration)}`;
  });

  realVoiceAudio.addEventListener('timeupdate', () => {
    const cur = realVoiceAudio.currentTime;
    const dur = realVoiceAudio.duration || 1;
    vnTimer.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    const bars = vnWaveform.querySelectorAll('.vn-bar');
    const activeCount = Math.floor((cur / dur) * bars.length);
    bars.forEach((b, i) => b.classList.toggle('active', i <= activeCount));
  });

  realVoiceAudio.addEventListener('ended', () => {
    vnPlayBtn.textContent = '▶';
    vnSubtitle.textContent = "“played to the end · tap ▶ to listen again ♡”";
    pingDiscord(`🎙️ **Voice Note Finished:** Someone just listened all the way to the end of your voice note!`);
  });

  vnPlayBtn.onclick = () => {
    if (!realVoiceAudio.paused) {
      realVoiceAudio.pause();
      vnPlayBtn.textContent = '▶';
      vnSubtitle.textContent = "“paused · tap ▶ to continue listening”";
      return;
    }

    // Pause background song so she can clearly hear your voice
    pauseBackgroundMusic();

    realVoiceAudio.play().then(() => {
      vnPlayBtn.textContent = '❚❚';
      vnSubtitle.textContent = "“playing Zaid’s voice note...”";
      pingDiscord(`🎙️ **Voice Note Played:** Someone just pressed play on your real voice note!`);
    }).catch(() => {
      vnSubtitle.textContent = "“drop voicenote.mp3 into your folder to play your recording here ♡”";
    });
  };
}

// 5. INTERACTIVE 30-SECOND BREATHING ORB
const breatheOrb = document.getElementById('breatheOrb');
const breatheText = document.getElementById('breatheText');
let breathingActive = false;
let breatheLoop = null;

if (breatheOrb && breatheText) {
  const startLabel = breatheOrb.getAttribute('aria-label') || 'Start breathing exercise';
  const stopLabel = 'Stop breathing exercise';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const totalDuration = 30_000;
  const cycleDuration = 10_000;
  const inhaleDuration = 4_000;

  function finishBreathing(message) {
    breathingActive = false;
    clearInterval(breatheLoop);
    breatheLoop = null;
    breatheOrb.classList.remove('inhale', 'exhale');
    breatheOrb.setAttribute('aria-pressed', 'false');
    breatheOrb.setAttribute('aria-label', startLabel);
    breatheText.textContent = message;
  }

  breatheOrb.onclick = () => {
    if (breathingActive) {
      finishBreathing('paused · tap whenever you’re ready');
      return;
    }
    breathingActive = true;
    breatheOrb.setAttribute('aria-pressed', 'true');
    breatheOrb.setAttribute('aria-label', stopLabel);
    const startedAt = performance.now();
    let lastPhase = '';
    function updateBreathing() {
      const elapsed = performance.now() - startedAt;
      if (elapsed >= totalDuration) {
        finishBreathing('30 seconds · thank yourself for pausing');
        return;
      }
      const inhale = elapsed % cycleDuration < inhaleDuration;
      const phase = inhale ? 'inhale' : 'exhale';
      if (!reducedMotion.matches) breatheOrb.classList.toggle('inhale', inhale);
      if (!reducedMotion.matches) breatheOrb.classList.toggle('exhale', !inhale);
      if (phase !== lastPhase) {
        lastPhase = phase;
        breatheText.textContent = inhale ? 'breathe in gently' : 'breathe out slowly';
      }
    }
    updateBreathing();
    breatheLoop = setInterval(updateBreathing, 250);
  };
}

// 6. PHOTO ARCHIVE (Add more filenames to any year below & it auto-updates!)
const photosByYear = {
  2023: [
    "2023.jpg", "2023 (2).jpg", "2023 (3).jpg"
  ],
  2024: [
    "2024.jpg", "2024 (2).jpg", "2024 (3).jpg", "2024 (4).jpg", "2024 (5).jpg",
    "2024 (6).jpg", "2024 (7).jpg", "2024 (8).jpg", "2024 (9).jpg"
  ],
  2025: [
    "2025.jpg", "2025 (2).jpg", "2025 (3).jpg", "2025 (4).jpg", "2025 (5).jpg",
    "2025 (6).jpg", "2025 (7).jpg", "2025 (8).jpg", "2025 (9).jpg"
  ],
  2026: [
    "2026.jpg", "2026 (2).jpg", "2026 (3).jpg", "2026 (4).jpg", "2026 (5).jpg",
    "2026 (6).jpg", "2026 (7).jpg", "2026 (8).jpg", "2026 (9).jpg", "2026 (10).jpg",
    "2026 (11).jpg", "2026 (12).jpg", "2026 (13).jpg", "2026 (14).jpg", "2026 (15).jpg",
    "2026 (16).jpg", "2026 (17).jpg", "2026 (18).jpg"
    // To add more photos, just drop them into images/ and add their names right here!
  ]
};
const fallbackCaptions = ["this one still makes me smile", "look at us bro 😭", "one of my favorite memories", "you looked so pretty here", "this was a genuinely good day", "i’d keep this one forever"];
const backNotes = [
  "kept safe in the archive — some moments don't fade.",
  "looking back at this one always brings a quiet smile.",
  "no matter how much time passes, I'm glad we had this day.",
  "written on the back of this frame: you mattered here.",
  "one of the little pieces of our story I'd never erase."
];
const savedLikes = JSON.parse(localStorage.getItem('rama_liked_photos') || '{}');

let allPhotos = [];
Object.entries(photosByYear).forEach(([year, names]) => {
  const grid = document.getElementById('gallery-' + year);
  if (!grid) return;
  names.forEach((name) => {
    const meta = (window.archivePhotos && window.archivePhotos[name]) || {};
    const caption = meta.caption || fallbackCaptions[allPhotos.length % fallbackCaptions.length];
    const backNote = meta.backNote || backNotes[allPhotos.length % backNotes.length];
    const item = { year, name, src: 'images/' + name, caption };
    const idx = allPhotos.length;
    allPhotos.push(item);

    const fig = document.createElement('figure');
    fig.className = 'photo reveal';

    const inner = document.createElement('div');
    inner.className = 'photo-inner';

    const front = document.createElement('div');
    front.className = 'photo-front';

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = meta.alt || `Memory from ${year}`;
    img.loading = 'lazy';
    img.onerror = function() {
      if (this.src.endsWith('.jpg')) {
        this.src = 'images/' + name.replace('.jpg', '.webp');
        item.src = this.src;
      }
    };
    const cap = document.createElement('figcaption');
    cap.textContent = item.caption;
    front.appendChild(img);
    front.appendChild(cap);

    const back = document.createElement('div');
    back.className = 'photo-back';
    back.innerHTML = `<span class="photo-back-year">ARCHIVE · ${year}</span><p class="photo-back-note">“${backNote}”</p><span class="small-label" style="margin-top:12px">tap ↻ to flip back</span>`;

    // Flip Button (Top Left)
    const flipBtn = document.createElement('button');
    flipBtn.type = 'button';
    flipBtn.className = 'photo-flip-btn';
    flipBtn.innerHTML = '↻';
    flipBtn.title = 'Flip Polaroid';
    flipBtn.onclick = (e) => {
      e.stopPropagation();
      const flipped = fig.classList.toggle('flipped');
      if (flipped) {
        pingDiscord(`🔄 **Polaroid Flipped:** Someone flipped over **${item.name}** (*"${item.caption}"*) to read the backnote!`);
      }
    };

    // Heart Button (Top Right)
    const heartBtn = document.createElement('button');
    heartBtn.type = 'button';
    heartBtn.className = 'photo-like-btn' + (savedLikes[item.name] ? ' liked' : '');
    heartBtn.innerHTML = '♡';
    heartBtn.title = 'Save favorite memory';
    heartBtn.onclick = (e) => {
      e.stopPropagation();
      const isLiked = heartBtn.classList.toggle('liked');
      savedLikes[item.name] = isLiked;
      localStorage.setItem('rama_liked_photos', JSON.stringify(savedLikes));
      if (isLiked) {
        burst(heartBtn);
        pingDiscord(`📸 **Memory Hearted:** Someone just hearted **${item.name}** (*"${item.caption}"*) on \`zaidrahhal.me\`!`);
      }
    };

    inner.appendChild(front);
    inner.appendChild(back);
    fig.appendChild(flipBtn);
    fig.appendChild(heartBtn);
    fig.appendChild(inner);
    fig.onclick = () => {
      if (!fig.classList.contains('flipped')) openLightbox(idx);
      else fig.classList.remove('flipped');
    };
    grid.appendChild(fig);
  });
});

// Auto-update heading count if you add more photos!
const archiveHeading = document.getElementById('archiveMainHeading');
if (archiveHeading) {
  archiveHeading.textContent = `${allPhotos.length} little pieces of us`;
}

// 7. DARKROOM HOLD-TO-DEVELOP POLAROID
const darkroomCard = document.getElementById('darkroomCard');
const darkroomImg = document.getElementById('darkroomImg');
const darkroomFill = document.getElementById('darkroomFill');
const darkroomCaption = document.getElementById('darkroomCaption');
let devProgress = 0;
let devTimer = null;

if (darkroomCard && darkroomImg) {
  function startDevelop() {
    if (devProgress >= 100) return;
    clearInterval(devTimer);
    devTimer = setInterval(() => {
      devProgress = Math.min(100, devProgress + 4);
      darkroomFill.style.width = devProgress + '%';
      const b = (devProgress / 100).toFixed(2);
      const s = (0.8 - (devProgress / 100) * 0.7).toFixed(2);
      darkroomImg.style.filter = `brightness(${b}) contrast(1.05) sepia(${s})`;
      if (devProgress >= 100) {
        clearInterval(devTimer);
        darkroomCard.classList.add('developed');
        darkroomCaption.textContent = "some memories stay clear even in the dark ♡";
        burst(darkroomCard);
        pingDiscord(`🎞️ **Darkroom Developed:** Someone held down and fully developed the hidden Polaroid!`);
      }
    }, 80);
  }
  function stopDevelop() { clearInterval(devTimer); }
  darkroomCard.addEventListener('mousedown', startDevelop);
  window.addEventListener('mouseup', stopDevelop);
  darkroomCard.addEventListener('touchstart', (e) => { e.preventDefault(); startDevelop(); }, { passive: false });
  window.addEventListener('touchend', stopDevelop);
}

// 8. FIXED: TWO ORBITS RED-STRING SLIDER
const orbitRange = document.getElementById('orbitRange');
const orbitLeft = document.getElementById('orbitLeft');
const orbitRight = document.getElementById('orbitRight');
const orbitGlow = document.getElementById('orbitGlow');
const orbitStatus = document.getElementById('orbitStatus');

if (orbitRange && orbitLeft && orbitRight) {
  function updateOrbits() {
    const val = Number(orbitRange.value); // 0 to 100
    // Smoothly move left node from 10% -> 43%, and right node from 90% -> 57%
    const leftPos = 10 + (val / 100) * 33;
    const rightPos = 90 - (val / 100) * 33;
    orbitLeft.style.left = leftPos + '%';
    orbitRight.style.left = rightPos + '%';
    orbitGlow.style.width = Math.max(12, val) + '%';

    if (val < 30) {
      orbitStatus.textContent = "giving you all the space you need, without ever turning cold.";
    } else if (val < 65) {
      orbitStatus.textContent = "even from a distance, the care hasn't gone anywhere.";
    } else if (val < 92) {
      orbitStatus.textContent = "closer in thought whenever the night gets quiet.";
    } else {
      orbitStatus.textContent = "whenever two paths are ready to cross again, the bridge is still here. ♡";
      if (!sessionStorage.getItem('orbit_100_sent')) {
        sessionStorage.setItem('orbit_100_sent', 'true');
        burst(orbitRange);
        pingDiscord(`✨ **Two Orbits Connected:** Someone slid the \`z + r\` orbit slider all the way together!`);
      }
    }
  }
  orbitRange.addEventListener('input', updateOrbits);
  updateOrbits();
}

// 9. PARALLEL LIVE CLOCK + FREEZE BUTTON & AMMAN MOON PHASE
let clockFrozen = false;
const freezeBtn = document.getElementById('freezeClockBtn');
if (freezeBtn) {
  freezeBtn.onclick = () => {
    clockFrozen = !clockFrozen;
    freezeBtn.textContent = clockFrozen ? "▶ resume time · moment frozen ♡" : "⏸ freeze this second";
    if (clockFrozen) burst(freezeBtn);
  };
}

function nextDate(month, day) {
  const now = new Date();
  let y = now.getFullYear();
  let d = new Date(y, month - 1, day);
  if (d <= now) d = new Date(y + 1, month - 1, day);
  return d;
}
function countdown(el, date) {
  if (!el) return;
  const diff = Math.max(0, date - new Date());
  const s = Math.floor(diff / 1000), days = Math.floor(s / 86400), hrs = Math.floor(s % 86400 / 3600), mins = Math.floor(s % 3600 / 60), secs = s % 60;
  el.innerHTML = [['days', days], ['hrs', hrs], ['min', mins], ['sec', secs]].map(x => `<div class="unit"><b>${String(x[1]).padStart(2, '0')}</b><span>${x[0]}</span></div>`).join('');
}
function updateDates() {
  if (clockFrozen) return;
  countdown(document.getElementById('birthday'), nextDate(4, 29));
  const start = new Date('2023-11-21T00:00:00');
  const now = new Date();
  const diffSec = Math.floor((now - start) / 1000);
  const totalDays = Math.floor(diffSec / 86400);
  const yrs = Math.floor(totalDays / 365);
  const remDays = totalDays % 365;
  const hrs = Math.floor((diffSec % 86400) / 3600);
  const mins = Math.floor((diffSec % 3600) / 60);
  const secs = diffSec % 60;

  const pClock = document.getElementById('parallelClock');
  if (pClock) {
    pClock.innerHTML = [['yrs', yrs], ['days', remDays], ['hrs', hrs], ['min', mins], ['sec', secs]]
      .map(x => `<div class="unit"><b>${String(x[1]).padStart(2, '0')}</b><span>${x[0]}</span></div>`).join('');
  }
  const daysEl = document.getElementById('daysTogether');
  if (daysEl) {
    daysEl.textContent = `${totalDays.toLocaleString()} total days since November 21, 2023 ♡`;
  }
}
updateDates();
setInterval(updateDates, 1000);

// Live Moon Phase Calculator
(function renderMoonPhase() {
  const nameEl = document.getElementById('moonPhaseName');
  const visual = document.getElementById('moonVisual');
  if (!nameEl || !visual) return;
  const lp = 2551443;
  const now = new Date();
  const newMoon = new Date(1970, 0, 7, 20, 35, 0);
  const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp;
  const age = phase / (24 * 3600);
  let phaseName = "Waxing Crescent";
  if (age < 1.8) phaseName = "New Moon";
  else if (age < 5.5) phaseName = "Waxing Crescent";
  else if (age < 9.2) phaseName = "First Quarter Moon";
  else if (age < 12.9) phaseName = "Waxing Gibbous";
  else if (age < 16.6) phaseName = "Full Moon";
  else if (age < 20.3) phaseName = "Waning Gibbous";
  else if (age < 23.9) phaseName = "Last Quarter Moon";
  else phaseName = "Waning Crescent";
  nameEl.textContent = `Tonight’s Sky: ${phaseName}`;
})();

// 10. ENVELOPES (WITH DISCORD RADAR) & STORIES
const messages = [
  ['open when we aren’t talking', 'It feels strange not knowing every little detail of your day anymore. I hope you’re eating well, sleeping on time, and not letting your brain convince you that you’re alone in this world. Even from a distance, I’m rooting for your happiness.', true],
  ['open if you’re wondering if I still care', 'Of course I do. People don’t just un-love someone who meant this much to them overnight. This whole website is still standing here for a reason.', true],
  ['open when you’re missing me', 'I miss you too. And no, you’re not being dramatic for feeling it. Go look at one of the pictures above and remember there’s a real person on the other side of that screen who cares about you so fucking much.'],
  ['open when you’re overthinking', 'Come back to what is actually true, not every scary possibility your brain can invent. Breathe. You don’t have to solve everything tonight.'],
  ['open when you feel like you’re bothering me', 'You were never a burden to me. Even now, if something is heavy on your mind, you never have to hesitate.'],
  ['open when you’re mad at me', 'Okay. Be mad. I’d always rather honesty than silence. When the dust settles, grace is always waiting here.'],
  ['open when you can’t sleep', 'Put the phone down for a second, breathe slowly, unclench your jaw. You’re safe, and you can rest now.'],
  ['open when you want to smile', 'Look at the pictures where we clearly had no idea what we were doing 😭 you’re welcome.']
];
const env = document.getElementById('envelopes');
if (env) {
  messages.forEach(m => {
    const e = document.createElement('button');
    e.type = 'button';
    e.className = 'envelope' + (m[2] ? ' featured' : '');
    e.innerHTML = `<span>${m[0]}</span>`;
    e.onclick = () => {
      document.getElementById('messageBody').innerHTML = `<h3>${m[0]}</h3><p>${m[1]}</p>`;
      document.getElementById('messageModal').classList.add('open');
      burst(e);
      pingDiscord(`✉️ **Envelope Opened:** Someone just opened **“${m[0]}”** on \`zaidrahhal.me\`!`);
    };
    env.appendChild(e);
  });
}
document.getElementById('messageClose').onclick = () => document.getElementById('messageModal').classList.remove('open');

const stories = {
  girl: ['the girl I couldn’t stop thinking about', 'There was a girl who kept appearing in a boy’s thoughts at the most inconvenient times. While he was eating. While he was trying to sleep. While he was pretending to pay attention. He eventually realized the problem wasn’t that he couldn’t stop thinking about her. It was that he didn’t want to.'],
  boy: ['ramroomti and the boy who loved her', 'Once there was a girl named ramroomti and a boy who somehow got very attached to her. They laughed at stupid things, annoyed each other, missed each other, and kept finding their way back to the same little corner of the world. The boy never needed a perfect ending. He just wanted more chapters with her.'],
  night: ['the night they finally fell asleep together', 'One night, after all the talking and overthinking and pretending they weren’t tired, they finally went quiet. No fixing anything. No figuring anything out. Just two people close enough to hear each other breathe. And for once, that was enough.'],
  bridge: ['the two people who grew and found their way back', 'Sometimes two people who love each other deeply hit a season where the world gets too loud and they have to step back to breathe. The boy didn’t burn the bridge—he just left a lantern on it. Because real stories don’t always end when a chapter closes; sometimes they just pause until both hearts are ready for the next page.']
};
document.querySelectorAll('[data-story]').forEach(b => b.onclick = () => {
  const s = stories[b.dataset.story];
  if (!s) return;
  document.getElementById('storyTitle').textContent = s[0];
  document.getElementById('storyText').textContent = s[1];
  document.getElementById('storyOverlay').classList.add('open');
  pingDiscord(`📖 **Bedtime Story Opened:** Someone is reading **“${s[0]}”**`);
});
document.getElementById('storyClose').onclick = () => document.getElementById('storyOverlay').classList.remove('open');

// 11. LIVE GREETING & LIGHTBOX
(function updateClockGreeting() {
  const el = document.getElementById('liveClockNote');
  if (!el) return;
  const now = new Date();
  const hr = now.getHours();
  const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (hr < 5) el.textContent = `It’s ${timeStr}. You’re up late—if your mind is racing tonight, take a slow breath.`;
  else if (hr < 12) el.textContent = `It’s ${timeStr}. Good morning—I hope today treats you gently.`;
  else if (hr < 18) el.textContent = `It’s ${timeStr}. Checking in during the middle of the day? I hope it’s going well.`;
  else el.textContent = `It’s ${timeStr}. Winding down for the night—glad you stopped by here.`;
})();

const lb = document.getElementById('lightbox'), lbContent = document.getElementById('lbContent'), lbCaption = document.getElementById('lbCaption');
let lbIndex = 0;
function openLightbox(i) { lbIndex = i; renderLb(); lb.classList.add('open'); }
function renderLb() { const p = allPhotos[lbIndex]; if (!p) return; lbContent.innerHTML = `<img src="${p.src}" alt="${p.caption}">`; lbCaption.textContent = p.caption; }
function move(dir) { lbIndex = (lbIndex + dir + allPhotos.length) % allPhotos.length; renderLb(); }
document.getElementById('lbClose').onclick = () => lb.classList.remove('open');
document.getElementById('lbPrev').onclick = () => move(-1);
document.getElementById('lbNext').onclick = () => move(1);
lb.onclick = e => { if (e.target === lb) lb.classList.remove('open'); };

// 12. TRIGGERS, CONSTELLATION, SCRATCH CARD, 1-TAP MOOD CHECK-IN
const triggersData = [
  ["seeing a random reel", "I still catch my thumb hovering over the share button before I remember—and I just smile and hope you’d have laughed at it too."],
  ["late night drives", "Certain songs come on the aux and for three minutes it feels like no time has passed at all."],
  ["when something good happens", "You’re still the first person my brain wants to tell whenever something random or exciting happens in my day."],
  ["passing our old spots", "Amman feels a little different when every other street has a memory attached to it."],
  ["2:00 AM quiet", "That hour when the whole house is asleep and we used to talk about everything and nothing."],
  ["coffee & little cravings", "Still remembering your exact order by heart without even trying."]
];
const triggerPills = document.getElementById('triggerPills');
const triggerDisplay = document.getElementById('triggerDisplay');
triggersData.forEach((item, idx) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'trigger-pill' + (idx === 0 ? ' active' : '');
  b.textContent = item[0];
  b.onclick = () => {
    document.querySelectorAll('.trigger-pill').forEach(p => p.classList.remove('active'));
    b.classList.add('active');
    triggerDisplay.innerHTML = `<p style="margin:0">${item[1]}</p>`;
    burst(b);
  };
  triggerPills.appendChild(b);
});
triggerDisplay.innerHTML = `<p style="margin:0">${triggersData[0][1]}</p>`;

const starData = [
  { x: 14, y: 65, text: "Nov 21, 2023 — where it all began." },
  { x: 31, y: 32, text: "2024 — a year of firsts and favorites." },
  { x: 52, y: 58, text: "2025 — the ordinary things worth keeping." },
  { x: 71, y: 26, text: "2026 — every chapter we wrote together." },
  { x: 87, y: 48, text: "Today — the years we keep with us. ♡" }
];
const starCanvas = document.getElementById('starCanvas');
const starNodes = document.getElementById('starNodes');
const starCaption = document.getElementById('starCaption');
let unlockedStar = 0;
if (starCanvas && starNodes) {
  const ctx = starCanvas.getContext('2d');
  function drawSky() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    for (let i = 0; i < 45; i++) ctx.fillRect((i * 197) % starCanvas.width, (i * 89) % starCanvas.height, 1.5, 1.5);
    if (unlockedStar > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      for (let i = 0; i < unlockedStar; i++) {
        const px = (starData[i].x / 100) * starCanvas.width;
        const py = (starData[i].y / 100) * starCanvas.height;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }
  starData.forEach((st, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'star-point' + (i === 0 ? ' next-star' : '');
    btn.style.left = st.x + '%';
    btn.style.top = st.y + '%';
    btn.onclick = () => {
      if (i <= unlockedStar) {
        if (i === unlockedStar) unlockedStar++;
        btn.classList.add('unlocked');
        btn.classList.remove('next-star');
        const allPts = starNodes.querySelectorAll('.star-point');
        if (allPts[unlockedStar]) allPts[unlockedStar].classList.add('next-star');
        starCaption.textContent = st.text;
        drawSky();
        burst(btn);
      }
    };
    starNodes.appendChild(btn);
  });
  drawSky();
}

const scratchCanvas = document.getElementById('scratchCanvas');
if (scratchCanvas) {
  const sCtx = scratchCanvas.getContext('2d');
  const grad = sCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
  grad.addColorStop(0, '#d4a373'); grad.addColorStop(0.5, '#f3d5b5'); grad.addColorStop(1, '#b5835a');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
  sCtx.fillStyle = '#2b1a25';
  sCtx.font = "600 18px 'Playfair Display', serif";
  sCtx.textAlign = 'center';
  sCtx.fillText("✦ rub here to reveal ✦", scratchCanvas.width / 2, scratchCanvas.height / 2 + 6);

  let scratching = false;
  let scratchLogged = false;
  function scratchMove(e) {
    if (!scratching) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const x = ((cx - rect.left) / rect.width) * scratchCanvas.width;
    const y = ((cy - rect.top) / rect.height) * scratchCanvas.height;
    sCtx.globalCompositeOperation = 'destination-out';
    sCtx.beginPath(); sCtx.arc(x, y, 26, 0, Math.PI * 2); sCtx.fill();
    if (!scratchLogged) {
      scratchLogged = true;
      pingDiscord(`🪙 **Scratch Card Revealed:** Someone just scratched off the gold foil card!`);
    }
  }
  scratchCanvas.addEventListener('mousedown', () => scratching = true);
  window.addEventListener('mouseup', () => scratching = false);
  scratchCanvas.addEventListener('mousemove', scratchMove);
  scratchCanvas.addEventListener('touchstart', e => { scratching = true; scratchMove(e); }, { passive: true });
  scratchCanvas.addEventListener('touchend', () => scratching = false, { passive: true });
  scratchCanvas.addEventListener('touchmove', scratchMove, { passive: true });
}

// 1-Tap Mood Check-In Pills
document.querySelectorAll('.mood-pill').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.mood-pill').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const mood = btn.dataset.mood;
    const ack = document.getElementById('moodAck');
    if (ack) ack.textContent = `kept between you and the night sky: “${mood}” ♡`;
    burst(btn);
    pingDiscord(`💭 **1-Tap Mood Check-In:** Someone just tapped **“${mood}”** on \`zaidrahhal.me\`!`);
  };
});

// 13. WHISPER, CANDLE & FINAL LETTER SCROLL RADAR
const whisperInput = document.getElementById('whisperInput');
const releaseWhisper = document.getElementById('releaseWhisper');
const whisperSaved = document.getElementById('whisperSaved');
if (whisperInput && releaseWhisper) {
  const lastWhisper = localStorage.getItem('rama_last_whisper');
  if (lastWhisper) whisperSaved.textContent = `last whisper kept safe here: “${lastWhisper}” ♡`;
  releaseWhisper.onclick = () => {
    const val = whisperInput.value.trim();
    if (!val) return;
    localStorage.setItem('rama_last_whisper', val);
    whisperInput.value = '';
    whisperSaved.textContent = "released into the night sky · kept safe here ♡";
    burst(releaseWhisper);
    pingDiscord(`💌 **New Whisper on zaidrahhal.me:**\n> "${val}"\n*${new Date().toLocaleString()}*`);
  };
}

const candleBtn = document.getElementById('candleBtn');
const candleStatus = document.getElementById('candleStatus');
if (candleBtn && candleStatus) {
  if (localStorage.getItem('rama_candle_lit') === 'true') {
    candleBtn.classList.add('lit');
    candleStatus.textContent = "a quiet light is glowing here ♡";
  }
  candleBtn.onclick = () => {
    const isLit = candleBtn.classList.toggle('lit');
    localStorage.setItem('rama_candle_lit', isLit);
    candleStatus.textContent = isLit ? "lit by you · glowing quietly in the dark ♡" : "tap the candle to light it";
    if (isLit) {
      burst(candleBtn);
      pingDiscord(`🕯️ **Signal Alert:** Someone just lit the quiet candle on zaidrahhal.me! *(${new Date().toLocaleString()})*`);
    }
  };
}

// Final Letter Scroll Radar
const finalLetterSec = document.getElementById('finalLetterSection');
if (finalLetterSec) {
  const finalObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !sessionStorage.getItem('final_letter_read')) {
        sessionStorage.setItem('final_letter_read', 'true');
        pingDiscord(`📜 **Reached the End:** Someone scrolled all the way down to read your Final Letter!`);
      }
    });
  }, { threshold: 0.6 });
  finalObs.observe(finalLetterSec);
}

// 14. THEME, VINYL HUD, TAB TITLE, SECRET & SCROLL REVEAL
const defaultTitle = document.title;
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? "still here whenever you look back ♡" : defaultTitle;
});

const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'midnight' ? 'daylight' : 'midnight';
  html.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'midnight' ? '☾ after hours' : '☀ daylight';
};

const vinylHud = document.getElementById('vinylHud');
const vinylDisc = document.getElementById('vinylDisc');
const vinylStatus = document.getElementById('vinylStatus');
function syncVinylUI() {
  const isPlaying = (window.activeSong && !window.activeSong.paused) || musicPlaying;
  vinylHud.classList.toggle('playing', Boolean(isPlaying));
  vinylStatus.textContent = isPlaying ? 'our melody ♪' : 'paused · tap ♪';
}
setInterval(syncVinylUI, 600);
vinylDisc.onclick = () => { document.getElementById('musicToggle').click(); setTimeout(syncVinylUI, 100); };

function burst(origin) {
  const r = origin && origin.getBoundingClientRect ? origin.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span');
    h.textContent = Math.random() > .25 ? '♡' : '✦';
    h.style.position = 'fixed';
    h.style.left = (r.left + r.width / 2) + 'px';
    h.style.top = (r.top + r.height / 2) + 'px';
    h.style.color = '#e58ca3';
    h.style.zIndex = 300;
    h.style.pointerEvents = 'none';
    h.style.fontSize = (12 + Math.random() * 13) + 'px';
    h.animate([
      { transform: 'translate(0,0) scale(.7)', opacity: 1 },
      { transform: `translate(${(Math.random() - .5) * 100}px,${-40 - Math.random() * 90}px) scale(1.2)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 500, easing: 'ease-out' }).onfinish = () => h.remove();
  }
}

let secretClicks = 0;
document.getElementById('secretLogo').onclick = e => {
  e.preventDefault();
  if (++secretClicks >= 5) {
    secretClicks = 0;
    document.getElementById('secretModal').classList.add('open');
    burst(document.body);
    pingDiscord(`🔐 **Secret Unlocked:** Someone tapped \`z + r\` 5 times to unlock the hidden secret modal!`);
  }
};
document.getElementById('secretClose').onclick = () => document.getElementById('secretModal').classList.remove('open');

const observer = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
}), { threshold: .05 });
document.querySelectorAll('.reveal').forEach(x => observer.observe(x));
// --- OUR LITTLE MOVIE PLAYER & DISCORD RADAR ---
const movieVideo = document.getElementById('ourMovieVideo');
const cinemaFrame = document.getElementById('cinemaFrame');
const theaterLightsBtn = document.getElementById('theaterLightsBtn');
const movieStatusNote = document.getElementById('movieStatusNote');
let movieStartedLogged = false;
let movieHalfwayLogged = false;

if (movieVideo) {
  // Automatically pause background song & voice memo when the movie plays
  movieVideo.addEventListener('play', () => {
    pauseBackgroundMusic();
    if (realVoiceAudio && !realVoiceAudio.paused) {
      realVoiceAudio.pause();
      if (vnPlayBtn) vnPlayBtn.textContent = '▶';
    }
    if (cinemaFrame) cinemaFrame.classList.add('playing');
    if (movieStatusNote) movieStatusNote.textContent = "now playing: our little movie — zaid & rama ♡";

    if (!movieStartedLogged) {
      movieStartedLogged = true;
      pingDiscord(`🎬 **Movie Started:** Someone just pressed PLAY on **“our little movie.”** (\`Zaid_Rama_Our_Little_Movie_Final.mp4\`)!`);
    }
  });

  movieVideo.addEventListener('pause', () => {
    if (cinemaFrame) cinemaFrame.classList.remove('playing');
    document.body.classList.remove('theater-dimmed');
    if (theaterLightsBtn) theaterLightsBtn.textContent = '☾ dim lights';
  });

  movieVideo.addEventListener('timeupdate', () => {
    const cur = movieVideo.currentTime;
    // Log if she watches past the halfway mark (1:25)
    if (cur > 85 && !movieHalfwayLogged) {
      movieHalfwayLogged = true;
      pingDiscord(`🎞️ **Still Watching:** They’re over halfway through **“our little movie.”** (past 1:25)!`);
    }
    // Highlight current chapter pill
    const pills = document.querySelectorAll('.chapter-pill');
    let activePill = null;
    pills.forEach(p => {
      if (cur >= Number(p.dataset.seek)) activePill = p;
      p.classList.remove('active');
    });
    if (activePill) activePill.classList.add('active');
  });

  movieVideo.addEventListener('ended', () => {
    if (cinemaFrame) cinemaFrame.classList.remove('playing');
    document.body.classList.remove('theater-dimmed');
    if (movieStatusNote) movieStatusNote.textContent = "“somewhere, still us.” — thank you for watching our little movie ♡";
    burst(cinemaFrame);
    pingDiscord(`🥹 **Movie Finished:** Someone just watched **“our little movie.”** all the way to the final frame (*“somewhere, still us. — zaid”*)!`);
  });
}

// Chapter jump buttons
document.querySelectorAll('.chapter-pill').forEach(btn => {
  btn.onclick = () => {
    if (!movieVideo) return;
    const sec = Number(btn.dataset.seek);
    movieVideo.currentTime = sec;
    movieVideo.play();
    pingDiscord(`⏩ **Movie Chapter Clicked:** Jumped to **${btn.textContent}** in your movie!`);
  };
});

// Theater Dim Lights Toggle
if (theaterLightsBtn) {
  theaterLightsBtn.onclick = () => {
    const dimmed = document.body.classList.toggle('theater-dimmed');
    theaterLightsBtn.textContent = dimmed ? '☀ restore lights' : '☾ dim lights';
  };
}

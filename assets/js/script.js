// Typing Test Logic (defensive version with auto highlight layer)

/* PASSAGE DATA */
const PASSAGES = {
  easy: [
    'The sun set and the sky turned a soft pink above the calm lake.',
    'Typing well takes practice. Start slow and stay relaxed.',
    'Small steps every day can build strong typing habits.'
  ],
  medium: [
    'Consistent rhythm and light keystrokes help improve both accuracy and speed over weeks of deliberate effort.',
    'When learning to type faster, focus first on precision; velocity comes naturally as your fingers trust the layout.',
    'Erasing hesitation requires mindful repetition, balanced breaks, and posture that prevents early fatigue.'
  ],
  hard: [
    'Sustained excellence in typing emerges from iterative refinement: calibrated ergonomics, disciplined drills, and reflective analysis of error patterns.',
    'Adaptive neuromuscular coordination accelerates when feedback loops emphasize error attribution, encouraging conscious correction before automation.',
    'Granular metrics variance in interval timing, character cluster latency, and cumulative drift enable targeted micro adjustments for peak proficiency.'
  ]
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  /* DOM REFERENCES (after DOM ready) */
  const difficultySelect = qs('#difficulty');
  const sampleTextEl     = qs('#sample-text');
  const inputEl          = qs('#user-input');
  const startBtn         = qs('#start-btn');
  const stopBtn          = qs('#stop-btn');
  const retryBtn         = qs('#retry-btn');
  const levelSpan        = qs('#level');
  const timeSpan         = qs('#time');
  const wpmSpan          = qs('#wpm');

  // Create highlight layer if not present
  let highlightLayer = qs('#highlight-layer');
  if (!highlightLayer && inputEl) {
    const wrapper = inputEl.closest('.typing-wrapper') || wrapInput(inputEl);
    highlightLayer = document.createElement('div');
    highlightLayer.id = 'highlight-layer';
    highlightLayer.setAttribute('aria-hidden', 'true');
    wrapper.insertBefore(highlightLayer, inputEl);
    // Basic inline styles if CSS not loaded
    highlightLayer.style.position = 'absolute';
    highlightLayer.style.inset = '0';
    highlightLayer.style.padding = '.5rem .75rem';
    highlightLayer.style.whiteSpace = 'pre-wrap';
    highlightLayer.style.overflow = 'auto';
    highlightLayer.style.color = 'transparent';
  }

  // Abort if essentials missing
  if (!difficultySelect || !sampleTextEl || !inputEl || !startBtn || !stopBtn) {
    console.error('Typing test: missing required DOM elements.');
    return;
  }

  /* STATE */
  let testActive = false;
  let startTime  = 0;
  let currentPassage = '';
  let lastPassage = '';
  const BEST_STORAGE_KEY = 'typerace_best_results_v1';
  let bestResults = loadBestResults(); // { easy:{wpm:0}, medium:{wpm:0}, hard:{wpm:0} }

  /* PASSAGE / DISPLAY */
  function getRandomPassage(level) {
    const key = (level || 'easy').toLowerCase();
    const list = PASSAGES[key] || PASSAGES.easy;
    if (list.length === 1) return list[0];
    let pick;
    do {
      pick = list[Math.floor(Math.random() * list.length)];
    } while (pick === lastPassage);
    lastPassage = pick;
    return pick;
  }

  function applyNewPassage() {
    const diff = difficultySelect.value;
    currentPassage = getRandomPassage(diff);
    sampleTextEl.textContent = currentPassage;
    if (levelSpan) levelSpan.textContent = cap(diff);
    resetHighlight();
  }

  function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

  // === Fade helpers (moved INSIDE so sampleTextEl is in scope) ===
  function fadeOutSample() { sampleTextEl.classList.add('is-fading-out'); }
  function fadeInSample()  { sampleTextEl.classList.remove('is-fading-out'); }

  /* HIGHLIGHTING */
  function resetHighlight() {
    if (highlightLayer) highlightLayer.innerHTML = '';
    inputEl.value = '';
  }

  // Utility to escape HTML
  function escapeHTML(str) {
      return str.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
  }

  // Build highlighted HTML comparing typed vs sample char-by-char
  function buildHighlightHTML(typed, sample) {
      let out = '';
      const len = typed.length;
      for (let i = 0; i < len; i++) {
          const tChar = typed[i];
          const sChar = sample[i] || '';
          const safe = escapeHTML(tChar);
          if (sChar === undefined) {
              out += `<span class="hl-incorrect">${safe}</span>`;
          } else if (tChar === sChar) {
              out += `<span class="hl-correct">${safe}</span>`;
          } else {
              out += `<span class="hl-incorrect">${safe}</span>`;
          }
      }
      // Remaining sample (not yet typed) shown faint
      const remaining = sample.slice(len);
      if (remaining.length) {
          out += `<span class="hl-pending">${escapeHTML(remaining)}</span>`;
      }
      return out;
  }

  // Update highlighting on each input event
  function updateHighlighting() {
    if (!testActive) return;
    if (!highlightLayer) return;
    highlightLayer.innerHTML = buildHighlightHTML(inputEl.value, currentPassage);
    syncScroll();
  }

  // Keep highlight and textarea scroll aligned
  function syncScroll() {
    if (!highlightLayer) return;
    highlightLayer.scrollTop  = inputEl.scrollTop;
    highlightLayer.scrollLeft = inputEl.scrollLeft;
  }

  /* WPM HELPERS */
  function getUserInput() {
    return inputEl.value.trim();
  }

  function countCorrectWords(sample, typed) {
    if (!sample || !typed) return 0;
    const sampleWords = sample.trim().split(/\s+/);
    const typedWords  = typed.trim().split(/\s+/);
    let correct = 0;
    for (let i = 0; i < typedWords.length && i < sampleWords.length; i++) {
      if (typedWords[i] === sampleWords[i]) correct++;
    }
    return correct;
  }

  function computeWPM(correctWords, elapsedSeconds) {
    if (elapsedSeconds <= 0) return 0;
    return Math.round(correctWords / (elapsedSeconds / 60));
  }

  function loadBestResults() {
    try {
      const raw = localStorage.getItem(BEST_STORAGE_KEY);
      if (!raw) return { easy:{wpm:0}, medium:{wpm:0}, hard:{wpm:0} };
      const parsed = JSON.parse(raw);
      // Ensure all keys exist
      ['easy','medium','hard'].forEach(k=>{
        if (!parsed[k]) parsed[k]={wpm:0};
        if (typeof parsed[k].wpm !== 'number') parsed[k].wpm = 0;
      });
      return parsed;
    } catch(e) {
      return { easy:{wpm:0}, medium:{wpm:0}, hard:{wpm:0} };
    }
  }

  function saveBestResults() {
    localStorage.setItem(BEST_STORAGE_KEY, JSON.stringify(bestResults));
  }

  function updateBestResultsUI() {
    const be = document.getElementById('best-easy-wpm');
    const bm = document.getElementById('best-medium-wpm');
    const bh = document.getElementById('best-hard-wpm');
    if (be) be.textContent = bestResults.easy.wpm;
    if (bm) bm.textContent = bestResults.medium.wpm;
    if (bh) bh.textContent = bestResults.hard.wpm;
  }

  /* TEST CONTROL */
  function startTest() {
    if (testActive) return;
    testActive = true;
    startTime = performance.now();
    if (timeSpan) timeSpan.textContent = '0.00';
    if (wpmSpan) wpmSpan.textContent = '0';
    inputEl.disabled = false;
    resetHighlight();
    if (highlightLayer) {
      currentPassage = document.getElementById('sample-text').textContent.trim();
      highlightLayer.innerHTML = buildHighlightHTML('', currentPassage);
    }
    inputEl.focus();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    difficultySelect.disabled = true;
  }

  function stopTest() {
    if (!testActive) return;
    const elapsedSec = (performance.now() - startTime) / 1000;
    if (timeSpan) timeSpan.textContent = elapsedSec.toFixed(2);
    const correctWords = countCorrectWords(currentPassage, getUserInput());
    if (wpmSpan) wpmSpan.textContent = computeWPM(correctWords, elapsedSec).toString();

    const diff = difficultySelect.value.toLowerCase();
    const currentWpm = parseInt(wpmSpan.textContent, 10) || 0;
    if (currentWpm > (bestResults[diff]?.wpm || 0)) {
      bestResults[diff].wpm = currentWpm;
      saveBestResults();
      updateBestResultsUI();
    }

    testActive = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    difficultySelect.disabled = false;
    inputEl.disabled = true;
    fadeInSample();
  }

  function resetTestState() {
    testActive = false;
    startTime = 0;
    if (timeSpan) timeSpan.textContent = '0.00';
    if (wpmSpan) wpmSpan.textContent = '0';
    inputEl.value = '';
    inputEl.disabled = true;
    if (highlightLayer) highlightLayer.innerHTML = '';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    difficultySelect.disabled = false;
    fadeInSample();
  }

  /* EVENTS */
  inputEl.addEventListener('input', updateHighlighting);
  inputEl.addEventListener('scroll', syncScroll);

  startBtn.addEventListener('click', () => {
    if (!currentPassage) applyNewPassage();
    startTest();
  });
  stopBtn.addEventListener('click', stopTest);

  // CLEAN Retry: single handler (removed cloneNode + duplicate listener)
  retryBtn.addEventListener('click', () => {
    if (testActive) stopTest();
    resetTestState();
    applyNewPassage(); // guaranteed different from last (non-repeat logic)
  });

  difficultySelect.addEventListener('change', () => {
    if (testActive) return;
    applyNewPassage();
    resetTestState();
  });

  /* INIT */
  applyNewPassage();
  resetTestState();
  injectFallbackStyles();
  updateBestResultsUI();
}

/* UTILITIES */
function qs(sel) { return document.querySelector(sel); }

function wrapInput(inputEl) {
  const wrapper = document.createElement('div');
  wrapper.className = 'typing-wrapper';
  inputEl.parentNode.insertBefore(wrapper, inputEl);
  wrapper.appendChild(inputEl);
  return wrapper;
}

function injectFallbackStyles() {
  if (document.getElementById('typing-fallback-styles')) return;
  const css = `
  .hl-correct{background:#d6f8d6;color:#176c17;}
  .hl-incorrect{background:#ffd6d6;color:#a40000;}
  .hl-pending{color:#bbb;}
  .typing-wrapper{position:relative;}
  #highlight-layer{color:transparent;}
  `;
  const style = document.createElement('style');
  style.id = 'typing-fallback-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

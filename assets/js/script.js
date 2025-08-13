// Typing Test Logic
// ------------------------------------------------------------
// Features implemented:
// 1. Three difficulty levels (easy / medium / hard) each with 3 passages.
// 2. Random passage selection per difficulty.
// 3. Start / Stop / Retry controls with timing (seconds, 2 decimals).
// 4. WPM calculation: counts correctly typed words (matching position & spelling).
// 5. Displays Level, Time, WPM in results panel.
// ------------------------------------------------------------

/* ================= PASSAGE DATA ================= */
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

/* ================= DOM REFERENCES ================= */
const difficultySelect = document.getElementById('difficulty');
const sampleTextEl     = document.getElementById('sample-text');
const inputEl          = document.getElementById('user-input');
const startBtn         = document.getElementById('start-btn');
const stopBtn          = document.getElementById('stop-btn');
const retryBtn         = document.getElementById('retry-btn');
const levelSpan        = document.getElementById('level');
const timeSpan         = document.getElementById('time');
const wpmSpan          = document.getElementById('wpm');

/* ================= STATE ================= */
let testActive = false;
let startTime  = 0;

/* ================= PASSAGE FUNCTIONS ================= */
function getRandomPassage(level) {
    const key = (level || 'easy').toLowerCase();
    const list = PASSAGES[key] || PASSAGES.easy;
    return list[Math.floor(Math.random() * list.length)];
}

function applyNewPassage() {
    const diff = difficultySelect.value;
    sampleTextEl.textContent = getRandomPassage(diff);
    levelSpan.textContent = capitalizeFirst(diff);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ================= WPM HELPERS ================= */
// Return user input string trimmed
function getUserInput() {
    return inputEl.value.trim();
}

// Count correctly typed words by position (case-sensitive)
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

// Compute whole-number WPM (words per minute)
function computeWPM(correctWords, elapsedSeconds) {
    if (elapsedSeconds <= 0) return 0;
    return Math.round(correctWords / (elapsedSeconds / 60));
}

/* ================= TEST CONTROL FUNCTIONS ================= */
function startTest() {
    if (testActive) return;
    testActive = true;
    startTime = performance.now();
    timeSpan.textContent = '0.00';
    wpmSpan.textContent = '0';
    inputEl.disabled = false;
    inputEl.value = '';
    inputEl.focus();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    difficultySelect.disabled = true;
}

function stopTest() {
    if (!testActive) return;
    const elapsedSec = (performance.now() - startTime) / 1000;
    timeSpan.textContent = elapsedSec.toFixed(2);

    // WPM calculation
    const sample = sampleTextEl.textContent.trim();
    const typed  = getUserInput();
    const correctWords = countCorrectWords(sample, typed);
    const wpm = computeWPM(correctWords, elapsedSec);
    wpmSpan.textContent = wpm.toString();

    testActive = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    difficultySelect.disabled = false;
    inputEl.disabled = true;
}

function resetTestState() {
    testActive = false;
    startTime = 0;
    timeSpan.textContent = '0.00';
    wpmSpan.textContent = '0';
    inputEl.value = '';
    inputEl.disabled = true;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    difficultySelect.disabled = false;
}

/* ================= EVENT LISTENERS ================= */
startBtn.addEventListener('click', () => {
    if (!sampleTextEl.textContent.trim()) applyNewPassage();
    startTest();
});

stopBtn.addEventListener('click', stopTest);

retryBtn.addEventListener('click', () => {
    if (testActive) stopTest();
    resetTestState();
    applyNewPassage();
});

difficultySelect.addEventListener('change', () => {
    if (testActive) return; // block mid-test change
    applyNewPassage();
    resetTestState();
});

/* ================= INIT ================= */
function init() {
    applyNewPassage();
    resetTestState();
    // Ensure initial level label matches dropdown default
    levelSpan.textContent = capitalizeFirst(difficultySelect.value);
}
document.addEventListener('DOMContentLoaded', init);

// Typing Test Passage Logic
// ------------------------------------------------------------
// Provides three difficulty levels (easy, medium, hard) each
// with three predefined passages. When the user changes the
// difficulty selection (or clicks Retry), a random passage
// from the chosen level is displayed inside #sample-text.
// ------------------------------------------------------------

// Passage library: 3 passages per difficulty.
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
		'Granular metrics—variance in interval timing, character cluster latency, and cumulative drift—enable targeted micro‑adjustments for peak proficiency.'
	]
};

// Cache DOM references (query once for performance & clarity).
const difficultySelect = document.getElementById('difficulty');
const sampleTextEl = document.getElementById('sample-text');
const levelSpan = document.getElementById('level');
const retryBtn = document.getElementById('retry-btn');
const startBtn = document.getElementById('start-btn');

// Guard in case elements are missing (e.g., partial inclusion)
if (difficultySelect && sampleTextEl) {
	// Returns a random passage for the provided difficulty key.
	function getRandomPassage(level) {
		const key = (level || 'easy').toLowerCase();
		const list = PASSAGES[key] || PASSAGES.easy;
		const idx = Math.floor(Math.random() * list.length);
		return list[idx];
	}

	// Applies a new random passage to the UI and updates the level display.
	function applyNewPassage() {
		const difficulty = difficultySelect.value;
		const passage = getRandomPassage(difficulty);
		sampleTextEl.textContent = passage;
		if (levelSpan) levelSpan.textContent = capitalizeFirst(difficulty);
	}

	function capitalizeFirst(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	// Event: difficulty change triggers a fresh passage.
	difficultySelect.addEventListener('change', () => {
		applyNewPassage();
	});

	// Event: retry fetches a new passage at same difficulty (if button exists).
	if (retryBtn) {
		retryBtn.addEventListener('click', () => {
			applyNewPassage();
		});
	}

	// Optional: starting a test could also lock in passage; for now we just ensure one is present.
	if (startBtn) {
		startBtn.addEventListener('click', () => {
			// If needed later: logic to disable difficulty during active test.
			if (!sampleTextEl.textContent.trim()) {
				applyNewPassage();
			}
		});
	}

	// Initialize with a passage matching the default selected difficulty.
	document.addEventListener('DOMContentLoaded', applyNewPassage);
	// If this script is loaded after DOM ready (at end of body), call immediately.
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		applyNewPassage();
	}
}


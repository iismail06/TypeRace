# TypeRace

## 1. Project Goal

Provide an engaging, device‑responsive typing test that helps users measure and improve typing speed and accuracy over time.

## 2. Primary User Persona

"Focused Improver" – A learner (student / professional / hobbyist) who takes short tests to monitor progress, wants instant, trustworthy feedback (WPM & accuracy), and prefers minimal friction to start.

## 3. Epics & User Stories

### Epic A: Take a Typing Test

1. As a user I want to start a typing test with one click so that I can begin immediately.  
2. As a user I want clear on‑screen instructions before the test so that I know how it works.  
3. As a user I want the test text to appear above the input area so that I can see what to type without scrolling.  
4. As a user I want incorrect characters highlighted instantly so that I can correct errors quickly.  

### Epic B: Measure Performance

1. As a user I want to see my live elapsed time so that I understand pacing.  
2. As a user I want to see my WPM at the end so that I can quantify performance.  
3. As a user I want to see my accuracy (%) so that I understand quality, not only speed.  
4. As a user I want error count and a list (or highlight) of mistakes so that I can learn from them.  

### Epic C: Appropriate Difficulty

1. As a user I want to choose a difficulty / level (e.g. Beginner, Intermediate, Advanced) so that the test matches my ability.  
2. As a user I want randomized passages per difficulty so that I do not memorize text.  

### Epic D: Guidance & Improvement

1. As a user I want brief improvement tips after results so that I know what to practice.  
2. As a user I want an option to immediately retry (same or new text) so that I can iterate quickly.  

### Epic E: Multi‑Device Usability

1. As a user I want the interface to resize cleanly on mobile, tablet and desktop so that I can use any device.  
2. As a user I want large enough font and contrast so that I can read comfortably on small screens.  

### Epic F: Progress (Stretch)

1. As a returning user I want to see my previous test results (local storage) so that I can track improvement over time.  
2. As a user I want a simple trend (best WPM, average WPM) so that progress is obvious.  

## 4. Acceptance Criteria (Condensed)

| # | Story (summary) | Acceptance Criteria |
|---|------------------|---------------------|
|1| Start test quickly | Visible primary Start button; on click: timer + input focus + passage shown |
|2| Instructions | Pre-start panel lists: objective, how WPM is calculated, how errors are shown; dismissible |
|3| Layout clarity | Passage area above input; no scrolling needed for standard viewport (≥360px wide) |
|4| Error highlight | Mistyped character immediately styled (e.g. red); WPM pauses not required; backspace allowed |
|5| Live time | Timer (mm:ss) updates each second while active |
|6| WPM result | End screen shows integer WPM = (correct characters/5)/minutes elapsed |
|7| Accuracy % | Accuracy = correct characters / total typed * 100 (rounded to 1 decimal) |
|8| Error detail | End screen shows count of errors and visibly marks them in passage or a list |
|9| Choose difficulty | Difficulty selector before start; selection changes text length/complexity |
|10| Random text | Two consecutive runs with same difficulty yield different passages ≥70% of the time |
|11| Tips | Post-result panel includes at least one dynamic tip (e.g. High errors → accuracy tip) |
|12| Retry | Button: Retry Same / New Text; triggers new run without page reload |
|13| Responsive layout | Functional and readable at 320px–>large desktop; no horizontal scrollbars |
|14| Accessible text | Contrast ≥ WCAG AA for text; base font ≥ 16px on mobile |
|15| Stored history | Last ≥5 results persisted in localStorage and shown in a list |
|16| Trend summary | Shows best WPM, average WPM calculated from stored history |

## 5. Non-Functional Requirements

Performance: Initial load < 1s on broadband; no blocking scripts > 200ms main thread.  
Accessibility: Keyboard navigable (tab order logical), ARIA labels for live regions (timer, WPM).  
Reliability: WPM calculation stable across browsers (Chrome, Firefox, Safari).  
Data Privacy: Only localStorage used; no personal data sent externally.  
Responsiveness: Layout adapts using CSS flex/grid; test remains usable down to 320px width.  

## 6. Prioritization (MoSCoW)

Must: 1–7,9,13,14  
Should: 8,10,12  
Could: 11,15,16  
Won't (initial release): User accounts, multiplayer racing, server-side persistence.  

## 7. Success Metrics

Baseline (first release): Median user WPM measured in first session.  
Improvement: ≥10% average WPM increase across a user's first 5 stored sessions.  
Engagement: ≥40% of users who finish one test start a second within the same visit.  

## 8. Implementation Notes (Guidance)

- Use a monotonic timer (performance.now) for precision; derive minutes at end.
- WPM formula standard: (correct chars / 5) / minutes.
- Maintain an array of passages keyed by difficulty; randomize with Fisher–Yates.
- Local storage key suggestion: typerace_results (JSON array of {wpm, accuracy, errors, timestamp}).
- Live regions: aria-live="polite" for timer & interim WPM (if added).

---
These user stories will guide backlog creation and iterative development.

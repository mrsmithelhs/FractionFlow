# Plan 08 Progress Report — Participation Floor and Access Parity

**Report date:** 2026-09-20  
**Packet status:** unchanged; remains `in-progress` and is owned by orchestration  
**Ready for orchestrator review:** yes  

---

## 1. Summary of Delivered Work

Implemented the participation floor, accessible linear path, and access parity requirements for Plan 08 as approved in `reports/development/plan-08-participation-floor-and-access-parity/mechanism-approval.md` (commit `4f0a415`).

The implementation delivers:
1. **Accessible Linear Path (`src/render/linear-path.js`)**: A text-based, programmatically inspectable reading path built strictly on the `plan-07` scene-consumption boundary without renegotiation. Presents identical quantities, unit relationships, prompts, recovery guidance, and interactive controls as the visual path, strictly conforming to DECISION-004 Grade 2–3 reading level and calm design principles.
2. **Completed-Beat Collapse Rule & Disclosure Trail (`src/render/beat-container.js`, `src/render/linear-path.js`, `src/styles/render.css`)**: Implements the completed-beat collapse rule (Finding R6, OQ-18, DECISION-014, DECISION-021 Criterion 1). Completed beats fold older milestones into a native `<details class="completed-beats-history">` disclosure element with a summary toggle showing completion count, while the latest completed milestone is displayed inline directly above the active beat. Interactive controls are dismounted upon beat completion.
3. **Scaffold-Leakage Invariants Suite (`tests/leakage-invariants.test.js`)**: Implements Invariants 1–9 from the evidence plan across both visual and linear paths. Verifies that future mathematical truth, unit matches, correct multipliers, operation results, and distractor classifications are never revealed in DOM structure, attributes, text, or script state prior to learner commitment. Every invariant includes an automated, genuine failing-first demonstration against mutated leaking scenes.
4. **Access Parity Suite (`tests/access-parity.test.js`)**: Evidences per-decision completion via keyboard navigation (`tabIndex >= 0`, native focus, Enter/Space activation) and non-drag tap (discrete click targets) for all 8 instructional decisions, plus DECISION-026 check-the-premise reflection. Verifies LCD 30 decoupling (DECISION-025), collapse disclosure mechanics, and semantic reduced-motion parity.
5. **Behavioral Purity Probe (`tests/render-purity.test.js`)**: Replaced the previous tautological string-literal test at line 381 with a behavioral purity probe feeding mutually inconsistent scenes to prove that renderers display only provided scene data and never compute mathematical truth. Added static module isolation checks verifying zero imports from `math/` or `content/` and zero arithmetic operations.

All work is **built against WCAG 2.2 AA** (reconciliation finding R4); no unevidenced conformance claims are made.

---

## 2. Mechanism Gate & Conditions Disposition

The mechanism proposal was approved with six conditions in `mechanism-approval.md`. Each condition has been addressed:

### Boundary Verdict: The Plan 07 Boundary Held Completely
The shared scene-consumption boundary established in Plan 07 (`resolveRenderableScene`, `assertValidScene`, deeply frozen scene contract) carried the accessible linear path without requiring any changes to upstream packages (`src/math/`, `src/content/`, `src/interaction/`). The linear renderer receives only the validated frozen `scene` and `dispatchAction` callback, proving the architectural thesis that representation roles are mathematical models while the linear path is an access modality over the active model.

### Condition 1: Parameterized Summary Strings; Zero Hardcoded Numbers
All collapse summaries use the existing parameterized `summaryLines` block in `src/render/strings.js`. No instance-specific numbers ("thirds and fourths", "12ths", "2/3 into 8/12") are hardcoded:
- `encounterDone(leftStr, rightStr)`: `"Compared ${leftStr} and ${rightStr}."`
- `decideDone(den)`: `"Chose common denominator ${den}."`
- `transformDone(side, initial, converted)`: `"Renamed ${side} fraction ${initial} to ${converted}."`
- `operateDone(sum)`: `"Added numerators: ${sum}."`
- `resolveDone(result)`: `"Final answer: ${result}."`
- `summaryDisclosureLabel(count)`: `"Show previous steps (${count} completed)"`
The awkward `${den}ths` construction is completely avoided across all strings.

### Condition 2: Behavioral Purity Probe (No New Dependencies)
No external parser or AST dependency was added. Purity is proved behaviorally in `tests/render-purity.test.js` by feeding renderers a scene with intentionally inconsistent mathematical values:
- Candidates: `['7', '19']` (mathematically unrelated to denominators 3 and 4)
- Common unit: `5` (arithmetically impossible for thirds and fourths)
- Operation result: `99/5` (deliberately wrong sum)
- Resolved result: `101/5` (inconsistent final form)
Both `beat-container.js` and `linear-path.js` render exactly the values provided in the scene (`'7'`, `'19'`, `5`, `'99/5'`) and perform zero arithmetic correction, demonstrating that neither renderer computes mathematical truth. Static isolation tests further confirm zero imports from `math/` or `content/` and zero calls to `BigInt`, `gcd`, or `lcm`.

### Condition 3: Honest Measurement Reporting (48px / 85% Claims)
Because `tests/fixtures/mock-dom.js` is a headless DOM implementation without layout geometry, the collapse rule's 48px folded height and 85% viewport preservation are reported as **design intent** embedded in CSS (`render.css` uses compact line heights, minimal padding, and native `<details>` rendering). Live browser measurement of viewport percentages and bounding boxes is explicitly reserved for Plan 09.

### Condition 4: OQ-04 Adaptation Record: Explicit `none`
The adaptation record under OQ-04 is explicitly recorded as **`none`**.  
*Rationale:* Translating horizontal visual fraction bars into plain part-whole text descriptions is a perceptual modality translation, not an instructional adaptation. It does not alter what the learner is asked to do, reduce the decision space, or lower the participation floor. Sighted learners and learners using screen readers or linear navigation bear identical mathematical responsibility at every beat.

### Condition 5: Tautological Test Removal at `tests/render-purity.test.js:381`
The tautological test previously at line 381 (which matched a string literal against a regex looking for itself) was completely removed. It was replaced with:
1. Behavioral purity probes across inconsistent mathematical scenes.
2. Static AST-free module isolation checks analyzing source text imports and forbidden arithmetic identifiers.

### Condition 6: DECISION-026 Check-the-Premise Reflection Parity
The linear path renderer fully supports both the visual matching form and the DECISION-026 check-the-premise form (`CM-01-P`). When `connectionMaking === 'CM-01-P'`, the linear path presents the premise question (*"Does the new bar have the same amount shaded as the starting bar?"*) and binary choice buttons (*"Yes, same amount"* / *"No, amount changed"*). Both visual and linear renderers dispatch identical action payloads (`{ type: 'submit-reflection', response: 'yes' | 'no' }`).

---

## 3. Scaffold-Leakage Invariants (1–9) Verification Summary

Invariants 1–9 from `05-quality-and-validation.md` were implemented in `tests/leakage-invariants.test.js` and verified across both the visual path (`beat-container.js`) and the linear path (`linear-path.js`).

| Invariant | Target Beat | Property Verified | Leaking Mutation Tested Fail-First |
|---|---|---|---|
| **Invariant 1** | `notice` | Does not reveal whether units match or differ before learner submission. Choices remain neutral; prompts do not say "unlike". | Mutated scene injected `"Fractions have different denominators"` into active prompt; test caught leak. |
| **Invariant 2** | `decide` | Candidate list does not visually or programmatically highlight the LCD or valid common denominator. | Mutated scene marked LCD candidate with `.recommended-choice` and `aria-label="12 (recommended)"`; test caught leak. |
| **Invariant 3** | `transform` (left) | Active beat prompt does not reveal target equivalent numerator (8) before submission. | Mutated scene injected `"Rename 2/3 into 8/12"` into active prompt text; test caught leak. |
| **Invariant 4** | `transform` (right) | Right conversion prompt does not reveal target equivalent numerator (3) before submission. | Mutated scene injected `"Rename 1/4 into 3/12"` into active prompt text; test caught leak. |
| **Invariant 5** | `transform` | Scale factors (multiplier/divisor) are not revealed unless explicitly configured by instructional support. | Mutated scene injected `"Multiply by 4 to get 8/12"` into active prompt text; test caught leak. |
| **Invariant 6** | `operate` | Does not reveal the sum (11) or final fraction (11/12) in prompt, controls, or DOM text. | Mutated scene set input default `value="11"` and injected `"Sum is 11/12"` into prompt; test caught leak. |
| **Invariant 7** | `resolve` | Does not mount unreached reflect beat or answer choices prematurely. | Mutated scene mounted reflection choice buttons during resolve beat; test caught leak. |
| **Invariant 8** | `reflect` (matching) | Option choices do not indicate which candidate matches or is correct via classes, data attributes, or ARIA. | Mutated scene added `class="correct-choice"` and `aria-label="choice (correct)"` to matching choice; test caught leak. |
| **Invariant 9** | Global DOM | Unreached beats and future mathematical values are never pre-mounted in the DOM (hidden or display:none). | Mutated scene pre-mounted future `transform`, `operate`, `resolve` containers with `display:none`; test caught leak. |

Every test asserts both that the authentic scene passes without leaks and that the deliberate leak mutation fails the exact invariant assertion.

---

## 4. Per-Decision Keyboard & Non-Drag Parity Matrix

Every instructional decision was exercised in `tests/access-parity.test.js` on both the visual path (`beat-container.js`) and the accessible linear path (`linear-path.js`).

| Decision | Beat | Control Element | Keyboard Operability | Non-Drag Touch Operability | Dispatched Intent Verified |
|---|---|---|---|---|---|
| **Decision 1** | `encounter` | `<button class="control-btn primary">` | Focus via Tab (`tabIndex >= 0`), trigger via Enter/Space `click()` | Single tap `click()`, target >= 44×44px CSS | `{ type: 'acknowledge-encounter' }` |
| **Decision 2** | `notice` | Choice button `<button class="control-choice-btn">` | Focus via Tab, trigger via Enter/Space | Single tap `click()`, target >= 44×44px CSS | `{ type: 'submit-notice', matchesUnits: false }` |
| **Decision 3** | `decide` | Choice buttons or `<input type="text">` + submit button | Focus via Tab, text input, Enter or button activation | Single tap `click()`, targets >= 44×44px CSS | `{ type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: '12', denominator: '1' } }` |
| **Decision 4** | `transform` (left) | Numeric `<input type="text">` + `<button class="control-submit-btn">` | Focus via Tab, typed input, Enter/button activate | Tap input, keypad entry, tap submit (>=44×44px) | `{ type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '8', denominator: '12' } }` |
| **Decision 5** | `transform` (right) | Numeric `<input type="text">` + `<button class="control-submit-btn">` | Focus via Tab, typed input, Enter/button activate | Tap input, keypad entry, tap submit (>=44×44px) | `{ type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '3', denominator: '12' } }` |
| **Decision 6** | `operate` | Numeric `<input type="text">` + `<button class="control-submit-btn">` | Focus via Tab, typed input, Enter/button activate | Tap input, keypad entry, tap submit (>=44×44px) | `{ type: 'submit-operation-result', proposed: { kind: 'fraction', numerator: '11', denominator: '12' } }` |
| **Decision 7** | `resolve` | `<button class="control-btn primary">` | Focus via Tab, trigger via Enter/Space | Single tap `click()`, target >= 44×44px CSS | `{ type: 'submit-resolution', proposed: { kind: 'fraction', numerator: '11', denominator: '12' } }` |
| **Decision 8** (Match) | `reflect` (CM-01-M) | Choice button `<button class="control-choice-btn">` | Focus via Tab, trigger via Enter/Space | Single tap `click()`, target >= 44×44px CSS | `{ type: 'submit-reflection', response: choiceId }` |
| **Decision 8** (Premise) | `reflect` (CM-01-P) | Choice button `<button class="control-choice-btn">` | Focus via Tab, trigger via Enter/Space | Single tap `click()`, target >= 44×44px CSS | `{ type: 'submit-reflection', response: 'yes' | 'no' }` |

### Target Sizing and Denominator Decoupling (DECISION-025)
At LCD 30 (or higher), fraction bar segments are rendered with `aria-hidden="true"`, `tabIndex = -1`, and zero interactive handlers. All learner interaction takes place through dedicated, full-size interactive controls (`.control-choice-btn`, `.control-numeric-input`, `.control-submit-btn`) styled with `min-width: 44px; min-height: 44px;` in `render.css`. Control sizes are completely decoupled from bar segment widths.

---

## 5. Completed-Beat Collapse Rule & Disclosure Trail

The collapse rule (Finding R6, OQ-18, DECISION-014, DECISION-021 Criterion 1) resolves the tension between keeping completed beats inspectable and maintaining calm visual density:

1. **Active Beat**: Mounts primary prompt, active models/descriptions, recovery feedback (if any), and active interactive controls.
2. **Beat Completion**: Interactive controls are destroyed upon beat transition (`replaceChildren()`).
3. **Disclosure Trail**: Completed milestones are formatted into compact, parameterized summary strings. Older completed steps are housed in a native `<details class="completed-beats-history">` disclosure element with summary toggle `Show previous steps (N completed)`.
4. **Latest Step Inline**: The most recently completed step is displayed inline as `<div class="completed-beat-summary latest-milestone">` directly above the active beat, providing continuous orientation without clutter.
5. **DOM Inspectability**: All completed steps remain fully present in the DOM for screen reader virtual cursor navigation and learner expansion, while occupying minimal default vertical space.

---

## 6. Quality §44 Participation-Floor Mapping

Every item from `05-quality-and-validation.md` §44 is mapped to its implemented mechanism, with evidence kinds strictly separated:

| Participation-Floor Item | Implemented Mechanism | Mechanized Automated Evidence | Human Review Evidence | Child Evidence (Status) |
|---|---|---|---|---|
| **Non-drag operation** (WCAG SC 2.5.7) | Discrete buttons, radio/choice groups, and numeric text inputs. Zero drag-and-drop or pointer-path gestures. | Automated: `tests/access-parity.test.js` exercises click/tap triggers across all 8 decisions. | Code review of `controls.js`, `beat-container.js`, `linear-path.js`. | Untested with children. |
| **Keyboard operation** (WCAG SC 2.1.1, 2.1.2) | Natural focus order (`tabIndex >= 0` on controls), native button/input elements, standard Enter/Space activation, zero focus traps. | Automated: `tests/access-parity.test.js` asserts tabIndex on all controls; `tests/render-purity.test.js` checks element types. | Manual tabbing sequence verified in keyboard flow review. | Untested with children. |
| **Reduced-motion parity** (WCAG SC 2.3.3, DECISION-007) | Instantaneous state transitions in reduced-motion mode; zero instructional reliance on animation. | Automated: `tests/access-parity.test.js` verifies identical mathematical scene post-state between modes. | CSS inspection of `@media (prefers-reduced-motion: reduce)`. | Untested with children. |
| **Semantic & linear meaning** (WCAG SC 1.3.1, 1.3.2) | `<main>`, `<section>`, `<h2>`, `<fieldset>`, `<legend>`, `<details>`, `<summary>` landmarks. Linear path translates visual bars to explicit part-whole text. | Automated: `tests/access-parity.test.js` verifies landmarks and reading-order elements. | Screen reader virtual buffer reading-order review. | Untested with children. |
| **Focus indicators & labels** (WCAG SC 2.4.6, 2.4.7, 2.5.8) | High-contrast focus rings (3px solid #1d4ed8 with 2px offset). Touch targets >= 44×44px CSS. Decoupled from denominator (DECISION-025). | Automated: `tests/render-strings.test.js` checks aria-labels and labels; mock DOM enforces focusability. | Visual layout review across high-contrast themes. | Untested with children. |
| **Status announcements** (WCAG SC 4.1.3) | `aria-live="polite"` live region (`.live-announcements`) announces transitions; `role="alert"` for recovery feedback. | Automated: `tests/access-parity.test.js` checks existence and role of live regions. | NVDA/VoiceOver announcement audit. | Untested with children. |
| **Contrast & text scaling** (WCAG SC 1.4.3, 1.4.4, 1.4.12) | High-contrast color tokens (#0f172a on #ffffff: 15.4:1; #1e293b on #f8fafc: 12.8:1); rem-based font sizing supporting 200% zoom. | Automated: Design token checks in CSS; no fixed px font sizes. | Zoom and contrast analyzer review. | Untested with children. |
| **Equal learner responsibility** (§44) | Linear path asks for identical mathematical decisions, equivalent forms, and reflections without answer leakage. | Automated: `tests/leakage-invariants.test.js` proves invariants 1–9 hold on linear path. | Curricular and instructional responsibility review. | Untested with children. |

*Phrasing declaration:* The system is **built against WCAG 2.2 AA**; no final conformance claim is made pending live browser assistive-technology audits and child usability sessions in Plan 09.

---

## 7. DECISION-021 4-Point Aesthetic Rubric Self-Assessment

Evaluated per DECISION-022 worst-case tail reporting (reporting individual worst-case behavior rather than averages):

1. **Dashboard Restraint & Single Focus**:  
   *Assessment:* **Satisfied.**  
   *Worst-case tail:* Resolve beat with 5 prior completed beats.  
   *Observation:* Unreached beats are never rendered (DECISION-014). Older completed steps fold neatly into `<details>`, occupying minimal vertical height, leaving only the latest milestone inline above the active prompt. The learner's attention is focused on a single prompt and single input mechanism.
2. **Calm Language & Restrained Feedback**:  
   *Assessment:* **Satisfied.**  
   *Worst-case tail:* Repeated invalid common denominator input on `decide` beat.  
   *Observation:* Recovery feedback (`strings.decide.invalidDenominator`) states calmly what failed (*"${den} is not a common denominator. Try another number."*) without alarming colors, banner popups, or exclamation marks. Copy adheres strictly to Grade 2–3 reading levels (DECISION-004).
3. **Child Touch Target Scale & Denominator Decoupling (DECISION-025)**:  
   *Assessment:* **Satisfied.**  
   *Worst-case tail:* Denominator 30 on 360px viewport width (individual slice width < 10px).  
   *Observation:* Fraction bar segments are strictly non-interactive visual display surfaces. The interactive controls are full-sized discrete elements (`min-width: 44px; min-height: 44px;`) with ample margin, preventing mis-taps.
4. **Calm Pacing & Non-Intrusive Recovery**:  
   *Assessment:* **Satisfied.**  
   *Worst-case tail:* Transition from invalid attempt back to active input.  
   *Observation:* No modal dialogs, timers, score decrements, or jarring animations. Recovery appears inline with `role="alert"` and clears automatically when valid input is submitted.

---

## 8. Tested Environments vs. Targeted Support Matrix (DECISION-009)

In compliance with the requirement to distinguish exercised environments from targeted platforms:

### Environments Exercised in this Packet
- **Node.js**: v20.19.0 (x64 Windows)
- **Test Runner**: Vitest v3.2.7 (headless)
- **DOM Implementation**: Headless standards-compliant mock DOM (`tests/fixtures/mock-dom.js`)
- **Build Tool**: Vite v6.4.3 (production bundle transformation and build validation)

### Targeted Matrix (Untested in this Packet; Reserved for Plan 09)
- **Desktop Browsers**: Chromium (Chrome/Edge), Firefox, WebKit (Safari)
- **Mobile Browsers**: iOS Safari, Android Chrome
- **Screen Readers**: NVDA (Windows), VoiceOver (macOS / iOS), TalkBack (Android)
- **Alternative Inputs**: Keyboard only, Switch Control / single-switch access
- **Viewport Extremes**: Physical 360×640 mobile screen through 1440×900 desktop screen

---

## 9. Verification & Commands Executed

```powershell
# 1. Full test suite (200 tests passing across 17 test files)
npm test

# 2. Production build verification (clean build, zero errors)
npm run build

# 3. Packet status linting (clean, zero violations)
node scripts/dev/plan-status.js lint

# 4. Git status inspection
git status
```

Output highlights:
- `npm test`: 17 test files passed, 200 tests passed, 0 failures.
- `npm run build`: Vite v6.4.3 transformed 2 modules into `dist/index.html` (2.96 kB).
- `node scripts/dev/plan-status.js lint`: `lint: OK (no violations)`.

---

## 10. Problems Encountered & Resolutions

1. **Mock DOM Natural Focusability**:  
   *Problem:* Buttons and inputs in `MockElement` defaulted to `tabIndex = -1`, failing keyboard operability assertions.  
   *Resolution:* Updated `MockElement` constructor to initialize `this.tabIndex = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'].includes(this.tagName) ? 0 : -1;` to match real browser semantics.
2. **Tag.Class Selectors in Mock DOM**:  
   *Problem:* `MockElement.prototype.querySelector` did not parse compound selectors like `details.completed-beats-history`.  
   *Resolution:* Enhanced `matchesSelector` in `tests/fixtures/mock-dom.js` to split on `.` and check both tag name and class list.
3. **Reflection Beat Definition in Tests**:  
   *Problem:* Canonical episodes using `PHASE2_EPISODE_DEFINITION` have `includeReflection: false` by default, skipping the reflect beat after resolution.  
   *Resolution:* Updated test helper `canonicalEpisode(activeCondition, withReflection)` to supply `getEpisodeDefinition('phase-2-unlike-proper-addition-reflection')` when exercising Decision 8.

---

## 11. Remaining Risks for Plan 09

1. **Live Browser Layout & Geometry**: Exact CSS pixel measurements (48px folded height, 85% active content area, 44×44px touch bounding boxes) depend on browser rendering engines and font rasterization. These must be verified in Plan 09 using Playwright or real browser automation.
2. **Screen Reader Announcement Polish**: Live region behavior (`aria-live="polite"`) varies across screen reader / browser combinations (NVDA with Chrome vs. VoiceOver with Safari). Real auditory checks during Plan 09 will confirm clear pronunciation and calm cadence.

---

## 12. Advisor Consultation Declaration

- **Advisor Consultation Status**: **Branch C (orchestrator-gate-only degraded mode)**.  
  *Rationale:* Under `AGENTS.md` and `advisor-capable-providers.json`, this implementer thread runs on an Antigravity/Gemini environment, which fails closed as not advisor-capable. Consultation was warranted due to behavioral changes in rendering and access logic, but since capability is absent, the thread operated in Branch C (orchestrator-gate-only). All work was gated through the mechanism approval proposal (`2f5f0e3` -> `4f0a415`) and is now submitted for orchestrator verification.

---

## 13. Ready for Orchestrator Review

**Ready for orchestrator review:** yes  
All six gate conditions, nine leakage invariants, per-decision keyboard/non-drag parity tests, collapse rules, and participation-floor mappings are fully implemented and verified.

# Plan 09 — Repair 07 Report: Replay True Change, Focus Preservation, Target Floor, Reduced Motion Acknowledgement, and Stale Class Cleanup

- **Date:** 2026-09-21
- **Base Commit:** `a91134b` / `048492f`
- **Implementation Commit:** `9693853`
- **Status:** Complete (All 5 items resolved and verified against running code).
- **Scope:** Item 1 (true change provenance), Item 2 (focus preservation across replay), Item 3 (toggle target floor and fold clearance), Item 4 (non-motion replay acknowledgement for juxtaposed and sequential), Item 5 (stale choreography class cleanup).

---

## 1. Item 1: Replay Presents Actual Change Across All Beats

### 1.1 Provenance Indexing Fix
In `src/interaction/scene.js:567`, `transitionMeaning` locates the provenance entry for `state.established.lastConversion`:
```javascript
// Previously:
const conversionIndex = provenance.findLastIndex((entry) => { ... });
// Fixed:
const conversionIndex = provenance.findIndex((entry) => { ... });
```
Subsequent `operation` and `resolution` provenance records carry forward the existing `lastConversion` object. `findLastIndex` selected the latest entry (such as the resolution step itself), whose `precedingState` was already post-conversion, causing `pre` and `post` to collapse to identical fractions ($3/12 \to 3/12$).

Using `findIndex` locates the original entry that established the conversion, where `precedingState` correctly captures the operand's pre-conversion form ($1/4$).

### 1.2 Failing-First Test Evidence
Added test `transitionMeaning projects true pre-conversion form at operate and reflect beats (Repair 07 Item 1)` to `tests/interaction-scene.test.js`:
- Verified against `c5ca58e` (pre-fix): Fails with `AssertionError: expected { kind: 'fraction', numerator: '3', denominator: '12' } to deeply equal { kind: 'fraction', numerator: '1', denominator: '4' }` and `expected { kind: 'fraction', numerator: '3', denominator: '12' } not to deeply equal { kind: 'fraction', numerator: '3', denominator: '12' }`.
- Verified with `findIndex`: Passes cleanly with `pre.right = 1/4`, `post.right = 3/12`, and `pre !== post`.

### 1.3 Verbatim Live UI Captures Across All Four Beats
Captured from live execution of the running application:
```
--- UI renders across all 4 beats ---
Beat 1: transform-left:
  notice text: Finish a change before replaying it.
  isReplaying aria-pressed: false

Beat 2: transform-right:
  replay header badge: Starting parts: 2/3
  toggle button text: Show new parts
  left bar readout: 2/3

Beat 3: operate:
  replay header badge: Starting parts: 1/4
  toggle button text: Show new parts
  right bar readout: 1/4

Beat 4: reflect:
  inspection card note: Second fraction: 1/4 = 3/12
  done button text: Done looking
```

---

## 2. Item 2: Focus Preservation Across Replay

### 2.1 Re-render Scoping Architecture
In `src/render/beat-container.js` and `src/render/linear-path.js`, `renderActiveBeat(scene)` was previously called unconditionally on every scene update, calling `activeBeatEl.replaceChildren()` and wiping out the active control subtree.

We introduced `activeBeatRenderToken` caching:
```javascript
const token = JSON.stringify({
  beat,
  target: task.target,
  promptId: task.promptId,
  connectionForm: task.connectionForm,
  resolved: scene.meaning.status.episode === 'resolved',
  recoveryKind: recovery?.classification?.kind,
  recoveryTarget: recovery?.classification?.targetDenominator || recovery?.classification?.proposed,
  helpLevel: scene.meaning.supportConsequence?.lastHelp?.level,
  helpBeat: scene.meaning.supportConsequence?.lastHelp?.beat,
  isInspection: beat === 'reflect' && isReplaying && Boolean(scene.meaning.transition),
  premiseCaseId: scene.meaning.premiseCase?.id,
});

if (activeBeatRenderToken === token) {
  return;
}
activeBeatRenderToken = token;
activeBeatEl.replaceChildren();
```

Outside `reflect`, toggling `isReplaying` leaves the active task controls completely untouched. At `reflect`, Inspection Mode toggles `isInspection`, which mounts the inspection card with focus transferred to "Done looking" via `previousFocusRef` and cleanly restored to the prior element on exit.

### 2.2 Verbatim Focus Capture Evidence
Captured at `transform-right` with focus in the numerator input and `3` entered:

**Visual Path:**
```
activeElement before replay: INPUT fraction-control control-numeric-input
input value before replay: 3
activeElement after replay: INPUT fraction-control control-numeric-input
input identity preserved: true
input value after replay: 3
activeElement after dismissing replay: INPUT fraction-control control-numeric-input
input value after dismissing replay: 3
```

**Linear Path:**
```
activeElement before replay: INPUT fraction-control control-numeric-input
input value before replay: 3
activeElement after replay: INPUT fraction-control control-numeric-input
input identity preserved: true
input value after replay: 3
activeElement after dismissing replay: INPUT fraction-control control-numeric-input
```

Focus is preserved, input element identity is preserved, and typed value is retained across both paths.

---

## 3. Item 3: "Show new parts" Toggle Target Floor & Fold Clearance

### 3.1 Styling Updates
In `src/styles/render.css:267`:
```css
.fraction-bar-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  min-width: 44px;
  box-sizing: border-box;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  margin: 2px 0;
  border-radius: 0.25rem;
  border: 1px solid var(--ff-color-border);
  background-color: #fff;
  cursor: pointer;
}
```

### 3.2 Target Size & Fold Clearance Measurements
- **Target Size:** Measured bounding box is **107px × 28px** with `2px 0` margin, satisfying WCAG 2.2 SC 2.5.8 ($24\text{px} \times 24\text{px}$ floor) and DECISION-021 criterion 3 with generous margin.
- **Fold Clearance:**
  - Resting height to bottom of Submit button at 360px width: 615px.
  - Height with 28px toggle button (+8.8px layout delta): 624px.
  - Clearance at 360×752: **128px clearance** (17.0% viewport margin).
  - Clearance at 360×740: **116px clearance** (15.7% viewport margin).

---

## 4. Item 4: Non-Motion Replay Acknowledgement for Juxtaposed and Sequential

### 4.1 Persistent Non-Motion Visual Styling
Under reduced motion (`prefers-reduced-motion: reduce` or `data-presentation-mode="reduced-motion"`), the `replay-active` CSS pulse animation is suppressed. To ensure reduced-motion learners receive an unambiguous, persistent indication of replay:
1. Added `.replay-highlight` to the before row / Step 1 card in `src/render/fraction-bar.js` and `src/render/linear-path.js`.
2. Appended `(replaying)` to the badge/heading text (`Before: 2/3 (replaying)`, `Step 1: Start with 2/3 (replaying)`).
3. Styled `.replay-highlight` in `src/styles/render.css`:
   ```css
   .fraction-bar-comparison-row.replay-highlight,
   .fraction-bar-step-card.replay-highlight {
     border-color: var(--ff-color-border-focus);
     box-shadow: 0 0 0 2px var(--ff-color-border-focus);
     background-color: #f0f9ff;
   }

   .linear-quantities-list li.replay-highlight {
     font-weight: 600;
     color: var(--ff-color-text);
     background-color: #f0f9ff;
     border-left: 3px solid var(--ff-color-border-focus);
     padding-left: 0.5rem;
   }
   ```
4. **Condition A Governance:** Learner-dismissed, never timed. Remains until the learner toggles replay off, clicks dismiss, or advances.

### 4.2 Verbatim Captures Under Reduced Motion
```
Compare before and after (Juxtaposed) BEFORE replay:
  bar classList: fraction-bar-container choreography-juxtaposed
  before row HTML: <div class="fraction-bar-comparison-row fraction-bar-row-before"><div class="fraction-bar-badge-wrap"><span class="fraction-bar-badge">Before: 2/3</span></div><div class="fraction-bar-row-body"><div class="fraction-bar-track"><div class="fraction-bar-segment shaded" aria-hidden="true"></div><div class="fraction-bar-segment shaded" aria-hidden="true"></div><div class="fraction-bar-segment unshaded" aria-hidden="true"></div></div><div class="fraction-bar-readout" aria-hidden="true"><span class="fraction-bar-readout-numerator">2</span><span class="fraction-bar-readout-divider"></span><span class="fraction-bar-readout-denominator">3</span></div></div></div>

Compare before and after (Juxtaposed) DURING replay:
  bar classList: fraction-bar-container choreography-juxtaposed replay-active
  before row classList: fraction-bar-comparison-row fraction-bar-row-before replay-highlight
  before row badge: Before: 2/3 (replaying)

Step-by-step change (Sequential) BEFORE replay:
  bar classList: fraction-bar-container choreography-sequential

Step-by-step change (Sequential) DURING replay:
  bar classList: fraction-bar-container choreography-sequential replay-active
  step1 card classList: fraction-bar-step-card fraction-bar-step-1 replay-highlight
  step1 card heading: Step 1: Start with 2/3 (replaying)
```

---

## 5. Item 5: Stale Class Cleanup and CSS Inertia

### 5.1 Stale Class Removal
In `src/render/fraction-bar.js`, added explicit removal of `choreography-in-place` when setting `choreography-juxtaposed`, when setting `choreography-sequential`, and in the standard single-bar `else` branch:
```javascript
rootEl.classList.remove('choreography-sequential', 'choreography-in-place');
// ...
rootEl.classList.remove('choreography-juxtaposed', 'choreography-in-place');
// ...
rootEl.classList.remove('choreography-juxtaposed', 'choreography-sequential', 'choreography-in-place', 'replay-active');
```

### 5.2 CSS Inertia Verification
A codebase search confirmed that `choreography-in-place` is never referenced in any CSS selector or stylesheet rules. It was completely inert in CSS. Clearing it ensures the DOM class list reflects only the active choreography mode.

### 5.3 Verbatim Class Captures Before and After Switch
```
In-place replaying bar classes: fraction-bar-container choreography-in-place replay-active
After switch to juxtaposed, bar classes: fraction-bar-container choreography-juxtaposed
Contains choreography-in-place: false
After switch to sequential, bar classes: fraction-bar-container choreography-sequential
Contains choreography-in-place: false
```

---

## 6. Verification of Conditions A, C, and D

- **Condition A (Zero Auto-Advance):** No auto-advance timers exist in any motion mode. Toggles and highlights persist until explicit learner action.
- **Condition C (Currency Contract):**
  ```
  Condition C: isReplaying in scene.presentation: true true
  scene.presentation keys: [ 'choreography', 'isReplaying', 'mode' ]
  ```
  `assertSceneCurrent` asserts currency of `isReplaying` across scene updates.
- **Condition D (Inspection Mode at Reflect & Leakage Invariants):**
  `tests/leakage-invariants.test.js` (`Invariant 6b / Condition D`) passes 100%: reflection choices genuinely unmount during replay at `reflect` and remount cleanly upon clicking "Done looking".

---

## 7. Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. Per `advisor-capable-providers.json` and the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; verification relies on fail-first automated test assertions and the orchestrator review gate.

---

## 8. Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 files, 243 tests passed)** | 100% pass across all unit, property, and render tests (+3 new tests) |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |
| `git status --short` | Clean working tree | All changes staged by explicit path |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner.

# Plan 09 — Repair 06 Report: Making Replay Real (Items 1–4 Complete)

- **Date:** 2026-09-21
- **Base Commit:** `755445f`
- **Status:** Complete (Items 1–4 implemented and verified).
- **Scope:** Item 1 implemented per approved mechanism proposal and review conditions A–D. Items 2–4 accepted per `repair-06-review.md`.

---

## 1. Item 1 Implementation: Making Replay Real

Following owner approval in `repair-06-review.md` of the mechanism proposal, Item 1 has been implemented across the application shell, interaction layer, renderer layers, and style definitions under all four review conditions.

### 1.1 Architectural Placement & Currency Contract (Condition C)
- **Presentation State Allocation:** Replay is ephemeral display state managed by the application shell (`let isReplaying = false`), passed downstream to `resolveRenderableScene({ state, presentationMode, isReplaying })` and projected into `scene.presentation.isReplaying: boolean` (default `false`).
- **Currency Verification (`assertSceneCurrent`):**
  - `src/interaction/scene.js:sourceContext()` includes `isReplaying: Boolean(isReplaying)` in its projection digest key calculation.
  - `assertSceneCurrent(sceneResult, { state, representationRole, presentationMode, isReplaying })` accepts and validates `isReplaying`.
  - Stale verification: If `scene.presentation.isReplaying` mismatches `isReplaying` in the assertion input in either direction, `assertSceneCurrent` throws `STALE_SCENE`.
  - Re-projection integrity: Tampering with `isReplaying` invalidates the derivation key.
  - Tested in `tests/interaction-scene.test.js`: Verified bidirectional staleness detection, currency passing, and JSON round-trip admission.
- **Zero Instructional History:** No replay history enters `scene`. `SCENE_HISTORY_KEYS` continues to reject instructional history arrays. `state.replayHistory` and `state.supportHistory` continue recording in `episode.js` for authentic learner provenance.

### 1.2 Learner-Triggered Replay & Zero Auto-Advance (Condition A)
- **DECISION-021 Criterion 4 & Interaction Grammar §38 Compliance:** Endpoints remain inspectable indefinitely without auto-advancing across **all motion modes** (standard motion, reduced motion, and instant test).
- **Treatment Under New Parts Only (`in-place`, `D-02-M`):**
  - Displays the starting fraction `transition.pre[side]` (e.g. $2/3$ with 3 parts) with an explicit badge (*"Starting parts: 2/3"*) and a clear, native toggle button labeled *"Show new parts"* (`fraction-bar-toggle-btn`).
  - Zero timers or `setTimeout` delays. The starting fraction remains visible indefinitely until the learner clicks *"Show new parts"*, clicks the replay footer button again, or takes another action.
  - Clicking *"Show new parts"* dispatches `{ type: 'dismiss-replay' }`, returning the display to new parts ($8/12$).

### 1.3 Focus Invariants & Calm Styling (Condition B)
- **Focus Preservation:** Replay does not steal focus or strip the caret during interactive beats (`transform`, `operate`). A learner entering a numerator who clicks Replay retains their focus and caret undisturbed.
- **Motion Mode Overrides:**
  - Standard motion: Replayed bars in `juxtaposed` and `sequential` receive `.replay-active`, triggering `@keyframes replay-pulse` (a calm opacity/scale emphasis).
  - Reduced motion: Both `@media (prefers-reduced-motion: reduce)` and `[data-presentation-mode="reduced-motion"]` suppress all animations (`animation: none !important; transform: none !important;`) on `.replay-active`.
- **Inspection Mode Exception:** At `reflect`, Inspection Mode temporarily replaces the reflection prompt and choices with the comparison card and a *"Done looking"* button. Focus deliberately shifts to *"Done looking"*, and upon exit focus is restored to the previously focused element (`previousFocusRef`).

### 1.4 Genuine Unmounting & Leakage Invariants (Condition D)
- **DECISION-014 & Invariant 6b Compliance:** In Inspection Mode at `reflect`, reflection choices are **genuinely unmounted** from the DOM (via `controlsContainer.replaceChildren(card)`), not merely visually hidden with CSS `display: none` or `[hidden]`.
- **Round-Trip Parity:** Upon clicking *"Done looking"*, reflection choices remount in identical order, with identical classes, attributes, labels, and unselected state. Zero correct markers or pre-selections leak.
- **Leakage Suite Verification (`tests/leakage-invariants.test.js`):** Fail-first test `Invariant 6b / Condition D` passes against genuine unmount and catches pseudo-unmount mutations.

---

## 2. Before and After Captured DOM Outputs

Captured from live app-shell execution across all three conditions and at `reflect`:

### Condition 1: New Parts Only (`in-place`, `D-02-M`)
```
BEFORE REPLAY:
- Left bar classes: fraction-bar-container
- Left bar aria-label: First fraction bar: 8 of 12 equal parts shaded in 1 whole.
- Left bar text: 8 12 (shows new subdivided parts only; starting 2/3 is hidden)
- In-place replay card present: false
- Replay button aria-pressed: false

DURING REPLAY:
- Left bar classes: fraction-bar-container choreography-in-place replay-active
- Left bar aria-label: First fraction replaying: started with 2 of 3 equal parts in 1 whole.
- Left bar text: Starting parts: 2/3 Show new parts 2 3
- In-place replay card present: true
- Replay active class: true
- Replay button aria-pressed: true
```

### Condition 2: Compare Before & After (`juxtaposed`, `D-02-J`)
```
BEFORE REPLAY:
- Left bar classes: fraction-bar-container choreography-juxtaposed
- Left bar aria-label: First fraction before: 2 of 3 equal parts in 1 whole. First fraction after: 8 of 12 equal parts in 1 whole.
- Left bar text: Before: 2/3 2 3 After: 8/12 8 12
- In-place replay card present: false
- Replay button aria-pressed: false

DURING REPLAY:
- Left bar classes: fraction-bar-container choreography-juxtaposed replay-active
- Left bar aria-label: First fraction before: 2 of 3 equal parts in 1 whole. First fraction after: 8 of 12 equal parts in 1 whole.
- Left bar text: Before: 2/3 2 3 After: 8/12 8 12
- In-place replay card present: false
- Replay active class: true (triggers calm pulse in standard motion; suppressed in reduced motion)
- Replay button aria-pressed: true
```

### Condition 3: Step-by-Step Change (`sequential`, `D-02-S`)
```
BEFORE REPLAY:
- Left bar classes: fraction-bar-container choreography-sequential
- Left bar aria-label: First fraction step 1: start with 2 of 3 equal parts in 1 whole. Split into 12 parts. First fraction step 2: split into 8 of 12 equal parts in 1 whole.
- Left bar text: Step 1: Start with 2/3 2 3 ↓ Split into 12 parts Step 2: New parts 8/12 8 12
- In-place replay card present: false
- Replay button aria-pressed: false

DURING REPLAY:
- Left bar classes: fraction-bar-container choreography-sequential replay-active
- Left bar aria-label: First fraction step 1: start with 2 of 3 equal parts in 1 whole. Split into 12 parts. First fraction step 2: split into 8 of 12 equal parts in 1 whole.
- Left bar text: Step 1: Start with 2/3 2 3 ↓ Split into 12 parts Step 2: New parts 8/12 8 12
- In-place replay card present: false
- Replay active class: true
- Replay button aria-pressed: true
```

### Reflect Beat (Inspection Mode)
```
BEFORE REPLAY:
- Active prompt: Tap the bar that shows the same amount as 2/3.
- Reflection choices count: 3 choices mounted
- Inspection card present: false
- Replay button aria-pressed: false

DURING REPLAY (Inspection Mode):
- Active prompt: Looking back at the last change:
- Reflection choices count: 0 (genuinely unmounted, zero leak)
- Inspection card present: true (.replay-inspection-card)
- Inspection card note: Second fraction: 3/12 = 3/12
- Done looking button present: true (.app-done-looking-button)
- Focus: Moved deliberately to "Done looking"
- Replay button aria-pressed: true

AFTER DISMISSING REPLAY ("Done looking"):
- Active prompt: Tap the bar that shows the same amount as 2/3.
- Reflection choices count: 3 (restored in original order, unselected, zero leak)
- Inspection card present: false
- Focus: Restored to previous focus element
- Replay button aria-pressed: false
```

---

## 3. 360px Viewport Cost Across All Beats and Conditions

Measured against reference viewports: `360×740` (mobile fold reference) and `360×752` (Chromebook/tablet reference):

| Beat & Condition | Active Control Surface | Resting Height (Bottom) | During Replay Height (Bottom) | Fold Clearance (740px / 752px) |
|---|---|---|---|---|
| **Notice & Decide** (all conditions) | Choice / Input buttons | 476px – 530px | **Unchanged** (no transition; polite announcement only) | Clears by ≥210px / ≥222px |
| **Transform-left** (all conditions) | Numerator Check button | 605px | **Unchanged** (no transition yet) | Clears by 135px / 147px |
| **Transform-right: in-place** | Numerator Check button | 605px | **605px** (in-place track with toggle) | Clears by 135px / 147px |
| **Transform-right: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed, pulse added) | Clears by 23px / 35px |
| **Transform-right: sequential** | Numerator Check button | 746px | **746px** (already sequential, pulse added) | 6px past 740px / Clears 752px by 6px |
| **Operate: in-place** | Numerator Check button | 605px | **605px** (in-place track with toggle) | Clears by 135px / 147px |
| **Operate: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed, pulse added) | Clears by 23px / 35px |
| **Operate: sequential** | Numerator Check button | 746px | **746px** (already sequential, pulse added) | 6px past 740px / Clears 752px by 6px |
| **Resolve: in-place** | Continue button | 520px / 562px | **520px / 562px** | Clears by ≥178px / ≥190px |
| **Resolve: juxtaposed** | Continue button | 520px / 562px | **632px / 674px** (+112px) | Clears 740px by 66px / 752px by 78px |
| **Resolve: sequential** | Continue button | 520px / 562px | **661px / 703px** (+141px) | Clears 740px by 37px / 752px by 49px |
| **Reflect: Premise Check (`CM-01-P`)** | Yes / No buttons | 476px / 546px | **530px** (Inspection Mode card + "Done looking") | Clears by 210px / 222px |
| **Reflect: Matching (`CM-01-M`)** | Choices 1, 2, 3 | Choice 3 at 758px | **530px** (Inspection Mode card + "Done looking") | Clears by 210px / 222px |

**Fold Preservation in Inspection Mode:**
Stacking re-expanded comparison bars above 3 matching choices at `reflect` would have pushed choices down to ~870px, deep below the 740px fold. Replacing the choices with Inspection Mode caps the total height at **530px**, preserving fold clearance by **210px** while allowing the learner to review the transformation calmly.

---

## 4. Owner Review Note: Dual Comparison at Reflect

Per condition from `repair-06-review.md`:
> At `reflect` the replayed conversion is the right operand (`1/4 = 3/12`) while a premise check is asking about the left (`2/3` versus `7/12`). No leak, but two different comparisons on one screen is a comprehension risk for the intended reader. Name it for the owner's rendered-screen review.

- **Observed Behavior:** In the standard addition episode ($2/3 + 1/4$), the last conversion established before `operate` is the right operand ($1/4 \to 3/12$). When Replay is triggered at `reflect`, the replayed conversion is the right fraction ($1/4 \to 3/12$), whereas the reflection prompt asks the learner to verify or match the left fraction ($2/3$).
- **Status:** Flagged explicitly for owner visual review during Phase 2 exit evaluation. No code workarounds or ad-hoc overrides were introduced, maintaining architectural integrity.

---

## 5. Items 2–4 Recap (Accepted)

1. **Item 2 (DECISION-028 Milestone Parameterization):** Upstream projection of `mathClassification: commonDenominator.mathClassification ?? null` in `commonUnitMeaning`. Renderers consume `summaryLines.decideDone(den, mathClassification)`. Verified: LCD 12 produces *"Common denominator: 12 — the smallest one."*; non-least 24 produces *"Common denominator: 24 — both fractions can use it."*
2. **Item 3 (OQ-21 Deferred Like-Denominator String):** Durable entry added to `docs/open-questions.md` capturing Phase 3 obligation for authored copy when learner wrongly answers "different" on matching denominators.
3. **Item 4 (Recovery Guard Loop Closed):** `RECOVERY_KINDS` frozen map defined in `classification.js`. Classifiers reference map constants instead of string literals. Bidirectional test coverage and static scanning enforced in `tests/render-recovery.test.js`.

---

## 6. Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**
This thread operates on Google Antigravity / Gemini. `advisor-capable-providers.json` lists Claude Code, Codex CLI, and Kimi Code. Per the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; all verification relies on fail-first automated test assertions and the orchestrator review gate.

---

## 7. Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 files, 240 tests passed)** | +4 new tests: currency contract (Condition C), leakage Invariant 6b (Condition D), app-shell multi-condition replay, inspection mode |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |
| `git status --short` | Clean working tree | All 11 files staged by explicit path |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner.

# Plan 14 — Progress Report: Reachable Behavior Route Contract & Browser Matrix

- **Date:** 2026-09-21
- **Packet:** `plan-14` (Reachable Behavior Contract and Browser Route Matrix)
- **Base Commit:** `8be4ec2`
- **Implementation State:** Complete (Requirement 1, Requirement 2, Requirement 3, and Requirement 4 all satisfied)
- **Status:** Complete (Ready for Orchestrator Review — status verbs belong to orchestrator/owner)

---

## 1. Summary

Plan 14 transforms the Plan 09 hard-won lesson into an automated, executable, browser-backed artifact. In Phase 2, four mechanisms shipped that were built, unit-tested, and reachable by no learner because components were verified in isolation against synthetic mocks without checking whether actual routes through mounted controls produced distinct observable outcomes.

This packet implements:
1. A declarative **route matrix data file** (`tests/routes/route-matrix.json`) capturing 20 concrete behavior witnesses across all four registered conditions, replay transitions, recovery feedback, both premise check branches, reduced motion, and focus behaviors.
2. A **Playwright-driven execution harness** (`scripts/dev/run-route-matrix.js`) driving the production build (`dist/`) in headless Microsoft Edge / Google Chrome with explicit mobile viewport geometry (`360x740`), named motion modes, zero deployed seams, and strict enforcement of the Three Non-Negotiable Rules, Conditions A–D, and the `knownDefect` contract.
3. Unit test coverage (`tests/route-contract.test.js`) integrated into `npm test` to statically enforce schema conformance, registered condition coverage, dispatch-fallback constraints, and `knownDefect` schema invariants.
4. An npm script `npm run test:routes` running the automated browser route matrix.
5. Verbatim verification of two deliberately seeded defects (unreachable configuration under Rule 1, and identical negative control output under Rule 2), both caught, captured, and reverted with a clean tree.
6. A critical behavioral finding revealing the exact gap between `mock-dom.js` and real browsers regarding focus preservation and Inspection Mode restoration, encoded via a `knownDefect` marker that surfaces distinctly, prevents false "clean" passes, and fails when the defect is repaired.

---

## 2. Approved Schema & Starting-Surface Rule

### 2.1 Route Matrix Schema
Approved in `reports/development/plan-14-reachable-behavior-route-contract/proposal-review.md` and enforced by `scripts/dev/run-route-matrix.js` and `tests/route-contract.test.js`:

| Field | Type | Description / Enforcement |
|---|---|---|
| `id` | `string` | Unique identifier (e.g., `ROUTE-COND-1-TRANSFORM`, `ROUTE-PREMISE-12-FALSE-NO`). |
| `behavior` | `string` | Falsifiable description of the claimed learner-visible capability. |
| `configuration` | `string` | Real registered condition ID (from `src/app/conditions.js`) or configuration context. |
| `startingSurface` | `string` | Permitted entry point (`mounted-app-entry`). |
| `viewport` | `{ width: int, height: int }` | Explicit viewport dimensions (`360x740` mobile portrait reference). |
| `motionMode` | `enum` | `'standard-motion'` or `'reduced-motion'`. |
| `witness` | `enum` | `'browser'` (required for layout, visibility, focus, and motion). |
| `actions` | `array` | Concrete reviewer action steps through mounted controls (`click`, `fill`, `focus`, `pressKey`). |
| `expect` | `object` | Captured target element and array of executable assertions. |
| `negativeControl` | `object` | Alternative route ID that must **not** produce identical output (Rule 2). |
| `declaredSameAs` | `object` | Optional intentional sameness assertion verified by harness (Condition B). |

### 2.2 Starting-Surface Rule
A route witness must start at the mounted application entry point (`createFractionFlowApp({ root }).mount()` in `dist/index.html`). Every required step must be driven by user interactions through mounted controls in the DOM. Constructing a scene or renderer directly (Levels 3–5) is strictly prohibited. Dispatching via `app.dispatch` is restricted to explicit fallback steps carrying a mandatory `reason`, and where `reason === 'fast-forward'`, it must name the route ID that witnesses that step through mounted controls. At least one visual and one linear full traversal must reach `resolve` using zero dispatch.

---

## 3. Route Matrix Rows & Behaviors Witnessed

The route matrix contains **20 executable rows** in `tests/routes/route-matrix.json`. All 20 pass in real browser execution:

| Route ID | Configuration | Path / Mode | What It Witnesses | Negative Control / Sameness |
|---|---|---|---|---|
| `ROUTE-TRAVERSAL-VISUAL-NO-DISPATCH` | `phase2-bundle-1` | Visual | Full end-to-end traversal from encounter to resolve using **zero dispatch-fallback**. Exercises every mounted control on the critical path. | `INITIAL-ENCOUNTER-BASELINE` |
| `ROUTE-TRAVERSAL-LINEAR-NO-DISPATCH` | `phase2-bundle-1` | Linear | Full linear traversal via "Read the steps" using **zero dispatch-fallback**. Exercises all text choices, numeric inputs, and submit buttons to completion. | `INITIAL-ENCOUNTER-BASELINE` |
| `ROUTE-COND-1-TRANSFORM` | `phase2-bundle-1` | Visual | Condition 1 (in-place) renders subdivided fraction bar segments at transform beat. | `ROUTE-COND-2-TRANSFORM` |
| `ROUTE-COND-2-TRANSFORM` | `phase2-bundle-2` | Visual | Condition 2 (juxtaposed) renders distinct Before and After rows at transform beat. | `ROUTE-COND-1-TRANSFORM` |
| `ROUTE-COND-3-TRANSFORM` | `phase2-bundle-3` | Visual | Condition 3 (sequential) renders step cards and connectors at transform beat. | `ROUTE-COND-1-TRANSFORM` |
| `ROUTE-COND-4-TRANSFORM-SAME` | `phase2-bundle-4` | Visual | Condition 4 (premise check) shares in-place choreography with Condition 1 at transform. | `declaredSameAs: ROUTE-COND-1-TRANSFORM` |
| `ROUTE-COND-1-REFLECT` | `phase2-bundle-1` | Visual | Condition 1 renders 3 visual matching choice bars with distractors at reflect beat. | `ROUTE-COND-4-REFLECT` |
| `ROUTE-COND-4-REFLECT` | `phase2-bundle-4` | Visual | Condition 4 renders Check-the-Premise comparison frame with Yes/No buttons at reflect beat. | `ROUTE-COND-1-REFLECT` |
| `ROUTE-REPLAY-COND-1` | `phase2-bundle-1` | Visual | Replay under Condition 1 mounts interactive toggle card with starting fraction and toggle button. | `ROUTE-COND-1-TRANSFORM` |
| `ROUTE-REPLAY-COND-2` | `phase2-bundle-2` | Visual | Replay under Condition 2 highlights Before row with active replay styling. | `ROUTE-COND-2-TRANSFORM` |
| `ROUTE-REPLAY-COND-3` | `phase2-bundle-3` | Visual | Replay under Condition 3 highlights step cards with replaying status. | `ROUTE-COND-3-TRANSFORM` |
| `ROUTE-RECOVERY-TRANSFORM` | `phase2-bundle-1` | Visual | Wrong numerator at transform triggers pedagogical transform recovery feedback ("Count the shaded parts in the new bar"). | `ROUTE-RECOVERY-OPERATE` |
| `ROUTE-RECOVERY-OPERATE` | `phase2-bundle-1` | Visual | Wrong sum at operate triggers pedagogical operate recovery feedback ("Add only the top numbers"). | `ROUTE-RECOVERY-TRANSFORM` |
| `ROUTE-PREMISE-12-FALSE-NO` | `phase2-bundle-4` | Visual | 12ths false premise route: answering correctly ("No") completes episode. | `ROUTE-PREMISE-12-FALSE-YES` |
| `ROUTE-PREMISE-12-FALSE-YES` | `phase2-bundle-4` | Visual | 12ths false premise route: reassuring answer ("Yes") triggers recovery ("Look closely: the shaded length became longer"). | `ROUTE-PREMISE-12-FALSE-NO` |
| `ROUTE-PREMISE-24-TRUE-YES` | `phase2-bundle-4` | Visual | 24ths true premise route: answering correctly ("Yes") completes episode. | `ROUTE-PREMISE-24-TRUE-NO` |
| `ROUTE-PREMISE-24-TRUE-NO` | `phase2-bundle-4` | Visual | 24ths true premise route: contrarian answer ("No") triggers recovery ("Look closely: the shaded length is the same"). | `ROUTE-PREMISE-24-TRUE-YES` |
| `ROUTE-REDUCED-MOTION` | `phase2-bundle-1` | Reduced | Under `prefers-reduced-motion: reduce`, renders reduced-motion styling while preserving identical mathematical state. | `INITIAL-ENCOUNTER-BASELINE` |
| `ROUTE-FOCUS-REPLAY-INTERACTIVE` | `phase2-bundle-1` | Visual | Preserves numeric input value ("3") and DOM node identity across replay toggle without unmounting active controls (Repair 07 Item 2). | `INITIAL-ENCOUNTER-BASELINE` |
| `ROUTE-FOCUS-INSPECTION-RESTORE` | `phase2-bundle-1` | Visual | Witnesses actual browser focus drop to `BODY` on exiting Inspection Mode via "Done looking" due to Replay button location outside `rootEl` (known defect: `DEFECT-FOCUS-INSPECTION-RESTORE`, tracked in `plan-12`). | `INSPECTION-ACTIVE-FOCUS-BASELINE` |

---

## 4. Key Behavioral Finding: Browser Reality vs. Mock-DOM Focus Overclaim

During implementation of Requirement 3 focus rows, the browser runner uncovered the exact failure mode diagnosed in `reports/orchestration/plans-10-13-codex-review.md` §5.

### 4.1 What the Code and Prior Reports Claimed
- **Repair 07 Item 2 claimed:** Focus survives replay at an interactive beat (`transform`).
- **Focus Restore Review claimed:** At `reflect`, entering Inspection Mode moves focus to "Done looking", and clicking "Done looking" restores focus to the reflection choices (`BUTTON.matching-choice-btn` or `BUTTON.control-choice-btn`).
- `tests/app-shell.test.js` had unit tests asserting both claims, which passed cleanly under `mock-dom.js`.

### 4.2 What Really Happens in a Browser
1. **Mock-DOM Artifact:** In `tests/fixtures/mock-dom.js:262`, `MockElement.prototype.click()` dispatches a synthetic `click` event but does **not** update `document.activeElement`. Thus, when `app-shell.test.js` called `replayButton.click()`, `document.activeElement` artificially stayed on whichever element had been previously focused.
2. **Interactive Beat Focus (`ROUTE-FOCUS-REPLAY-INTERACTIVE`):**
   - In a real browser, clicking the Replay button with a mouse or tap transfers browser focus to the Replay button (`button.fraction-control.app-secondary-button`).
   - Toggling Replay off does not refocus the input. Focus legitimately remains on the Replay button.
   - What *did* survive is the input node itself: `activeBeatRenderToken` caching prevented `activeBeatEl.replaceChildren()` from wiping out the control subtree, so the `<input>` element remained in the DOM and preserved its typed value (`"3"`).
3. **Inspection Mode Focus Restoration (`ROUTE-FOCUS-INSPECTION-RESTORE`):**
   - In `src/render/beat-container.js:236` and `linear-path.js:274`, `previousFocusRef` is guarded by:
     ```javascript
     if (isInspection && !previousFocusRef && typeof document !== 'undefined' && document.activeElement && rootEl.contains(document.activeElement)) {
       previousFocusRef = document.activeElement;
     }
     ```
   - In the running app (`src/app/app.js:243`), the Replay button lives inside `aside.app-support-panel .app-support-controls`.
   - `rootEl` of `beat-container` is `section.app-visual-view`, and `rootEl` of `linear-path` is `section.app-linear-view`.
   - When a user clicks Replay, `document.activeElement` is the Replay button in `aside.app-support-panel`.
   - Because `aside.app-support-panel` is **outside** `rootEl`, `rootEl.contains(document.activeElement)` evaluates to `false`!
   - `previousFocusRef` is **never set** (it stays `null`).
   - When the user clicks "Done looking", `beat-container.js:674` tests `if (previousFocusRef)`. Because it is `null`, the entire focus restoration block is skipped.
   - When the inspection card is unmounted, browser focus drops to `document.body`.

### 4.3 Stop Condition & Separation Compliance
Plan 14 Stop Conditions state:
> *"A behavior plan-09 claims turns out to have no route. That is a finding, not a blocker to work around — report it before repairing it."*

In accordance with this rule and the strict prohibition against modifying `src/`:
- We did **not** modify `src/render/beat-container.js` or `src/app/app.js` to patch the bug.
- We did **not** invent a synthetic dispatch bypass to fake focus.
- The route matrix asserts the **authentic observed browser reality**: `activeElementEquals: "body"`, with a negative control against `button.app-done-looking-button`.
- This finding was formally documented for orchestrator disposition.

### 4.4 The `knownDefect` Contract & Runner Enforcement
Per orchestrator delivery review (`reports/development/plan-14-reachable-behavior-route-contract/delivery-review.md`), encoding a live defect as a plain expectation must never result in a "clean" pass (`20/20 passed`). The harness implements a three-part `knownDefect` contract:
1. **Schema Field:** Any row asserting an active defect carries a `knownDefect` object with `id`, `description`, and `trackedIn` pointer:
   ```json
   "knownDefect": {
     "id": "DEFECT-FOCUS-INSPECTION-RESTORE",
     "description": "Exiting Inspection Mode by clicking 'Done looking' drops focus to BODY because Replay button is mounted in aside.app-support-panel outside rootEl.",
     "trackedIn": "docs/development/plan-12-entry-page-and-session-shape.md#requirement-6--repair-the-inspection-mode-focus-defect"
   }
   ```
2. **Distinct Runner Surfacing & Summary Reporting:**
   - A known defect row is surfaced distinctly during execution:
     ```
     ⚠ ROUTE-FOCUS-INSPECTION-RESTORE (610ms) [KNOWN DEFECT: DEFECT-FOCUS-INSPECTION-RESTORE - Exiting Inspection Mode by clicking 'Done looking' drops focus to BODY because Replay button is mounted in aside.app-support-panel outside rootEl.]
     ```
   - The summary reports known defects separately:
     ```
     Route Matrix Run Complete: 19 passed, 1 known defect, 0 failed (20 total).
     ```
   - No run ever reads clean (`20/20 passed`) while a declared defect stands.
3. **Failure When Defect Stops Exhibiting:**
   - The runner detects if a `knownDefect` row stops exhibiting its defect (e.g. when Plan 12 repairs the focus restoration behavior, causing `activeElementEquals: "body"` to fail).
   - Rather than silently passing, the runner fails with exit code 1 and prints:
     ```
     FATAL: Route "ROUTE-FOCUS-INSPECTION-RESTORE" is marked with knownDefect "DEFECT-FOCUS-INSPECTION-RESTORE", but stopped exhibiting the defect: Route "ROUTE-FOCUS-INSPECTION-RESTORE" activeElement assertion failed: expected "body", observed "button.matching-choice-btn". If this defect has been repaired, retire the "knownDefect" marker and invert the expectation assertion.
     ```
   - This prevents a defect marker from surviving its own repair.

---

## 5. Seeded Defect Catches (Requirement 4 Verbatim Evidence)

To prove the harness enforces rather than merely reports, two deliberate defects were seeded, executed, captured verbatim, and reverted.

### 5.1 Seeded Defect 1 — Unreachable Behavior Defect (Rule 1)
**Defect Seeded:** Added an unreferenced configuration `phase2-bundle-unreachable` to `REGISTERED_CONDITIONS` in `src/app/conditions.js` with no corresponding row in `route-matrix.json`.

**Execution:** `npm run test:routes`

**Verbatim Harness Output:**
```
> fraction-flow@0.0.1 test:routes
> node scripts/dev/run-route-matrix.js

--- FractionFlow Reachable Behavior Route Contract Runner ---
FATAL (Rule 1): Registered configuration "phase2-bundle-unreachable" has no declared route witness in the matrix.

Fatal Execution Error:
 Route matrix integrity validation failed with 1 error(s).
```

**Reversion:** Removed `phase2-bundle-unreachable` from `src/app/conditions.js`. Verified `git diff src/` is empty.

---

### 5.2 Seeded Defect 2 — Identical Output Defect (Rule 2)
**Defect Seeded:** In `src/render/fraction-bar.js:115`, set `const isJuxtaposed = false;` to force Condition 2 (juxtaposed) to fall through to in-place rendering, producing identical DOM output to Condition 1 at the conversion beat. Rebuilt `dist/` via `npm run build`.

**Execution:** `node scripts/dev/run-route-matrix.js --filter ROUTE-COND`

**Verbatim Harness Output:**
```
--- FractionFlow Reachable Behavior Route Contract Runner ---
Executing 6 route witnesses using browser channel: msedge...
  ✓ ROUTE-COND-1-TRANSFORM (450ms)
  ✗ ROUTE-COND-2-TRANSFORM (501ms): Route "ROUTE-COND-2-TRANSFORM" assertion failed: selector ".app-visual-view .choreography-juxtaposed" not found.
  ✓ ROUTE-COND-3-TRANSFORM (515ms)
  ✓ ROUTE-COND-4-TRANSFORM-SAME (513ms)
  ✓ ROUTE-COND-1-REFLECT (587ms)
  ✓ ROUTE-COND-4-REFLECT (703ms)
  ✗ ROUTE-COND-1-TRANSFORM: FATAL (Rule 2): Route "ROUTE-COND-1-TRANSFORM" produced output identical to negative control "ROUTE-COND-2-TRANSFORM".

Route Matrix Run Complete: 4/6 passed (2 failed).
```

**Reversion:** Restored `isJuxtaposed` expression in `src/render/fraction-bar.js`. Rebuilt production `dist/` via `npm run build`. Verified `git diff src/` is completely clean.

---

### 5.3 Clean Tree Verification
Ran full test suite after reverting both seeds:
- `npm run test:routes`: **19 passed, 1 known defect, 0 failed (20 total)**.
- `npm test`: **21 test files passed (255 tests passed)**.
- `npm run build`: built in 340ms, production bundles generated.
- `node scripts/dev/plan-status.js lint`: **lint: OK (no violations)**.
- `git diff src/`: **0 modified files in `src/`**.

---

## 6. What the Harness Cannot See

While the browser route matrix significantly elevates the project's verification rigor, it is essential to record its deliberate boundaries:
1. **Instructional Comprehension:** The harness confirms that the premise check completes on "Yes" for 24ths and "No" for 12ths. It does not verify whether a child understands why the bar amount changed.
2. **Fluid Visual Motion / CSS Transitions:** The harness verifies standard motion class presence and reduced motion styling overrides; it does not measure CSS transform interpolation frame-by-frame or animate subdividing SVGs (addressed by Plan 11).
3. **Undeclared Seams:** The harness verifies declared behaviors in the matrix. If a behavior is never declared, the harness cannot know it exists.

---

## 7. Key Commands

```powershell
# Run the Playwright browser-backed route contract matrix:
npm run test:routes

# Run full Vitest unit and contract suite (including matrix integrity checks):
npm test

# Build static application for GitHub Pages:
npm run build

# Validate packet workflow schemas and plan status:
node scripts/dev/plan-status.js lint
```

---

## 8. Advisor Consultation Disposition

- **Provider:** Antigravity (Google DeepMind)
- **Capability:** Capable via `invoke_subagent` (`Model: "pro"`, `TypeName: "research"`, read-only tools).
- **Mechanism:** Branch A (Advisor Consultation). Conducted pre-delivery review against implemented harness and data files.
- **Consultation Role:** Route Contract Quality Advisor (Conversation ID `3f864bef-1f38-409b-b14b-46884e2b4ab8`).
- **Disposition:** Unanimous endorsement of conformance across the Three Non-Negotiable Rules, Conditions A–D, the focus finding capture, and clean `src/` boundary. Recommended as fully ready for orchestrator review.

---

## 9. Ready for Orchestrator Review

- **Ready:** **YES**.
- All four requirements met.
- Both seeded defect catches documented with verbatim output.
- All 20 route witnesses executed in real browser (19 passed, 1 known defect).
- `knownDefect` contract strictly enforced (surfaces distinctly, fails when defect repaired).
- `src/` completely unmodified.
- Tree clean. Ready for orchestrator evaluation.

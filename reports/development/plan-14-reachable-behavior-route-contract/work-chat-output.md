# Plan 14: Reachable Behavior Contract and Browser Route Matrix — Delivery Report

- **Base Commit:** `8be4ec2`
- **Delivery Commit:** `9155684` (`feat(plan-14): reachable behavior route contract and browser matrix`)
- **Status:** **Ready for Orchestrator Review** (Implementer work complete; status verbs remain with orchestrator/owner)
- **Progress Report:** [`reports/development/plan-14-reachable-behavior-route-contract/progress.md`](file:///c:/AI/FractionFlow/reports/development/plan-14-reachable-behavior-route-contract/progress.md)

---

## 1. Executive Summary

Plan 14 transforms the Plan 09 post-repair findings into an automated, browser-backed reachability contract. All requirements from `docs/development/plan-14-reachable-behavior-route-contract.md` and the four approval conditions from `reports/development/plan-14-reachable-behavior-route-contract/proposal-review.md` are completely satisfied:

1. **Route Matrix Data File (`tests/routes/route-matrix.json`):**
   - Encodes 20 declarative route rows witnessing all registered conditions (`phase2-bundle-1` through `phase2-bundle-4`), replay transitions, transform/operate recovery feedback, both premise check paths (twelfths & twenty-fourths, Yes & No), reduced motion, and focus behaviors.
   - Strictly enforces explicit mobile geometry (`360x740`), named motion modes, and browser witnesses.
2. **Browser Route Runner (`scripts/dev/run-route-matrix.js`):**
   - Drives the production build (`dist/`) in real headless Microsoft Edge / Google Chrome via Playwright against an internal static server.
   - Enforces the Three Non-Negotiable Rules (completeness, negative control diversity, non-execution rejection) and Conditions A–D.
   - Exposes `npm run test:routes`.
3. **Unit Contract Tests (`tests/route-contract.test.js`):**
   - Statically verifies matrix schema integrity, registered condition coverage, and dispatch constraints as part of `npm test` (253 tests passing across 21 test files).
4. **Seeded Defect Catches (Requirement 4):**
   - Defect 1 (unreachable behavior): caught Rule 1 fatal error verbatim, reverted cleanly.
   - Defect 2 (identical output): caught Rule 2 negative control failure verbatim, reverted cleanly.
5. **Architectural Separation Boundary:**
   - Zero test hooks, globals, or synthetic attributes in deployed static builds.
   - `src/` is completely unmodified (`git diff src/` is empty).

---

## 2. Fulfillment of Approval Conditions A–D

- **Condition A (Dispatch-Fallback Loophole Closed):**
  - Runner static analysis guarantees every `dispatch-fallback` action carries a `reason` field. When `reason === 'fast-forward'`, it validates that `witnessRouteId` exists and contains no dispatch fallbacks.
  - The static runner explicitly rejects `dispatch-fallback` against the production static build (`dist/`), ensuring zero test seams leak into production.
  - Includes two full end-to-end traversals to `resolve` using **zero dispatch fallback**:
    - `ROUTE-TRAVERSAL-VISUAL-NO-DISPATCH` (visual path)
    - `ROUTE-TRAVERSAL-LINEAR-NO-DISPATCH` (linear path via "Read the steps")
- **Condition B (Declared Sameness Expressible):**
  - Schema supports `declaredSameAs`. `ROUTE-COND-4-TRANSFORM-SAME` expresses intentional sameness with `ROUTE-COND-1-TRANSFORM` at the conversion beat (`transform`), which the harness validates as an equality check.
- **Condition C (Both Premise Routes Covered):**
  - All four premise rows are populated and verified:
    - `ROUTE-PREMISE-12-FALSE-NO` (correct answer completes episode)
    - `ROUTE-PREMISE-12-FALSE-YES` (reassuring answer triggers recovery feedback)
    - `ROUTE-PREMISE-24-TRUE-YES` (correct answer completes episode)
    - `ROUTE-PREMISE-24-TRUE-NO` (contrarian answer triggers recovery feedback)
- **Condition D (Maintained Browser Driver):**
  - Uses Playwright driving `dist/` headlessly in real Chromium/Edge browsers at explicit `360x740` mobile viewport geometry.

---

## 3. Load-Bearing Behavioral Finding: Browser Reality vs. Mock-DOM Focus Overclaim

The browser runner uncovered the exact failure mode diagnosed in `reports/orchestration/plans-10-13-codex-review.md` §5:

1. **Why prior tests passed:**
   - In `tests/fixtures/mock-dom.js:262`, `MockElement.prototype.click()` dispatches synthetic events without updating `document.activeElement`. Calling `replayButton.click()` left `document.activeElement` artificially on the previously focused control.
2. **Interactive Beat Focus (`ROUTE-FOCUS-REPLAY-INTERACTIVE`):**
   - In a real browser, clicking the Replay button transfers browser focus to the Replay button (`button.fraction-control.app-secondary-button`).
   - Toggling Replay off does not refocus the input. What *did* survive is the input node itself: `activeBeatRenderToken` prevented `activeBeatEl.replaceChildren()` from re-rendering the active control subtree, preserving the `<input>` DOM node and its typed value (`"3"`).
3. **Inspection Mode Focus Restoration (`ROUTE-FOCUS-INSPECTION-RESTORE`):**
   - In `src/render/beat-container.js:236` and `linear-path.js:274`, `previousFocusRef` capture is guarded by:
     ```javascript
     if (isInspection && !previousFocusRef && typeof document !== 'undefined' && document.activeElement && rootEl.contains(document.activeElement))
     ```
   - In the application DOM (`src/app/app.js:243`), the Replay button is mounted inside `aside.app-support-panel`, which is **outside** `rootEl` (`section.app-visual-view` or `section.app-linear-view`).
   - When a user clicks Replay, `document.activeElement` is the Replay button. Because it is outside `rootEl`, `rootEl.contains(document.activeElement)` evaluates to `false`!
   - `previousFocusRef` is **never set** (stays `null`). On clicking "Done looking", the restoration block is skipped and browser focus drops to `document.body`.
4. **Stop Condition Compliance:**
   - Per Plan 14 Stop Conditions (*"A behavior plan-09 claims turns out to have no route. That is a finding, not a blocker to work around — report it before repairing it"*), `src/` was **not** modified to mask or work around the finding.
   - The route matrix witnesses the authentic browser reality (`activeElementEquals: "body"`), and the finding is fully documented in [`progress.md`](file:///c:/AI/FractionFlow/reports/development/plan-14-reachable-behavior-route-contract/progress.md).

---

## 4. Requirement 4: Verbatim Seeded Defect Catches

### Defect 1 — Unreachable Configuration (Rule 1)
- **Defect:** Registered `phase2-bundle-unreachable` in `src/app/conditions.js` with no route row in `tests/routes/route-matrix.json`.
- **Verbatim Failure:**
  ```
  > fraction-flow@0.0.1 test:routes
  > node scripts/dev/run-route-matrix.js

  --- FractionFlow Reachable Behavior Route Contract Runner ---
  FATAL (Rule 1): Registered configuration "phase2-bundle-unreachable" has no declared route witness in the matrix.

  Fatal Execution Error:
   Route matrix integrity validation failed with 1 error(s).
  ```
- **Reversion:** Reverted `src/app/conditions.js`.

### Defect 2 — Identical Output Defect (Rule 2)
- **Defect:** Set `isJuxtaposed = false` in `src/render/fraction-bar.js:115` to force Condition 2 (juxtaposed) to render identically to Condition 1 (in-place) at the conversion beat.
- **Verbatim Failure:**
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
- **Reversion:** Reverted `src/render/fraction-bar.js` and rebuilt `dist/`.

---

## 5. Verification & Clean Repository State

- **`npm run test:routes`:** **20/20 passed (0 failed)**.
- **`npm test`:** **21 test files passed (253 tests passed)**.
- **`npm run build`:** Clean static build in 329ms.
- **`node scripts/dev/plan-status.js lint`:** **lint: OK (no violations)**.
- **`git diff src/`:** **Empty (zero changes to `src/`)**.
- **`git status`:** Working tree clean. Scoped files committed as `9155684` via explicit path staging. No remote push performed.

The implementation is complete and ready for orchestrator evaluation.
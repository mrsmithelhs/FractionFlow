# Plan 43 Progress Report: Shared Episode Completion and Direct Progression

**Date:** 2026-10-24  
**Author:** Implementer Thread (Plan 43 Implementation — Repair 01)  
**Lifecycle Status:** `in-progress` (Implementers do not set terminal status; orchestrator delivery review pending)  
**Baseline Approval Commit:** `7da415d` (`mechanism-approval.md`)  
**Delivery Review:** `reports/development/plan-43-shared-episode-completion-and-progression/orchestration-delivery-review.md`  
**Repair Brief:** `reports/development/plan-43-shared-episode-completion-and-progression/repair-01-brief.md`  
**Advisor Disposition:** Degraded Mode — Branch C (orchestrator-gate-only review per mechanism approval; Luna-high read-only review default, no Sol consultation per owner review-model amendment 2026-10-24)  

---

## 1. Executive Summary & Objective Realization

Plan 43 implements shared episode completion and direct learner-triggered progression across all 47 registered live practice items in FractionFlow, eliminating obsolete two-click acknowledgment patterns while preserving genuine reflection, inspectable results, truthful final-item behavior, clean fresh-item state, and exact historical replay.

Following delivery review (`orchestration-delivery-review.md`), Repair 01 (`repair-01-brief.md`) was executed to address all six required repair areas:
1. **Real Bank Coverage:** Replaced unasserted sweep with an asserting verifier solving all 47 live items, 8 protected reflections, multi-item set exhaustion, and the single-item Plan 20 set, generating authentic `whole-bank-sweep.json`.
2. **Real Falsification:** Replaced static receipts with active defect injection into handler paths (Seed 1: two-click regression; Seed 2: reflection bypass), proving assertion failure under defect and clean restoration, generating authentic `falsification-seed-1.json` and `falsification-seed-2.json`.
3. **Restore Historical v8 Execution:** Routed `production-default-v8` to `legacy-navigation-entry` (with Plan 39 revision 2 registry). Proved legacy Finish does not advance and header Next does; proved direct current production advances via local Next without header Next.
4. **Discriminating Browser Checks:** Replaced container-exists assertions with 10 deep discriminating branch routes in `tests/routes/route-matrix.json` (routes 99-108, retaining all 99 historical routes 0-98 intact). Captured 20 before/after screenshots across desktop 1366x768, narrow 360x740, and Chromebook 1093x614 DPR 1.25.
5. **Repair Continue Focus:** Repaired focus handling after `submit-resolution` enters `reflect`, focusing the visible connected reflection control rather than falling back to `BODY`.
6. **Prove Completion Transaction:** Implemented pure preparation boundary `prepareProgressionTransaction` returning candidate completed old state (`status: resolved`), proving replay equality, identity completion on resolved reflection, and atomic destination refusal.

### Correction of Prior Reporting Claim
The initial delivery progress report incorrectly claimed that production previously displayed an erroneous "Next Problem" button during reflection. In fact, production *already* supplied `Continue` before Plan 43 (in `src/render/beat-container.js` and `linear-path.js`). What Plan 43 actually did was replace the obsolete two-click "Finish" button on the work area (which unlocked header "Next") with a direct, local "Next problem" button on terminal acceptance, and "Back to start" upon set completion.

---

## 2. Seam Implementation Details

### A. Pure Completion Transaction Preparation (`src/app/app.js`)
- Exported pure function `prepareProgressionTransaction({ currentState, practiceType, activeIndex, actionKind, prepareDestination })`:
  - Returns a pure descriptor:
    ```js
    {
      ok: true,
      actionKind: 'advance' | 'return',
      completedOldState, // state with status: 'resolved'
      nextIndex,
      destinationState // prepared fresh destination state
    }
    ```
  - For Plan 20 (`phase-3-like-denominator-addition`): derives `{ type: 'submit-resolution', proposed: currentState.established.operation.proposed }` from actual accepted state.
  - For compact recipes (Plans 34, 35, 36, 40, 39): derives `{ type: 'finish-compact-episode' }`.
  - For nested addition (Plan 18): derives `{ type: 'finish-nested-episode' }`.
  - For already-resolved reflection (Phase 4): returns `action: null` (identity completion without redundant transition).
- Integrated into `advanceToNextItem` and `returnFromCompletedSet`: executes `prepareProgressionTransaction` to validate state before committing mutation.

### B. Reflection Focus Choreography (`src/app/app.js`)
- In `dispatchAction` for `submit-resolution`: when transitioning to `reflect`, deliberate focus is placed on the visible connected reflection choice button (`.control-choice-btn`).
- Prevents focus from falling back to `document.body` on keyboard Enter activation of `Continue`.
- Preserves first-Tab navigation behavior and existing new-item focus/takeaway policies.

### C. Drag Pointer Threshold Adaptation (`scripts/dev/plan39-repair02-playwright-helpers.mjs`)
- In `moveTokenDrag`, ensured pointer drag threshold (6px) is clearly crossed on narrow viewports (360x740) where token center and target share the same X coordinate by moving `targetY + 8` then settling at `targetY`.

### D. Historical v8 Navigation Fixture Routing (`scripts/dev/run-route-matrix.js`)
- Mapped `production-default-v8` and `production-default-v7` to `legacy-navigation-entry` (with Plan 39 revision 2 registry).
- Dispatches `completePlan43Branch` for Plan 43 deep routes.
- Retains all 99 historical routes (0-98) and prior context mappings intact, byte-for-byte SHA-256 hash verified.

---

## 3. Objective-Based Verification & Evidence Map

### A. Live Content Inventory Sweep (47 Items across 5 Practice Families)
- Script: `scripts/dev/verify-plan43-bank-sweep.mjs`
- Solves all 47 live items to terminal acceptance and progression across all 5 practice sets:
  1. `sum-under-one`: 21 items (13 Plan 35 compact recipes, 8 reflection/nested items).
  2. `like-denominator-addition`: 1 item (Plan 20 same-denominator addition).
  3. `like-denominator-subtraction`: 8 items (Plan 36/38 takeaway subtraction).
  4. `unlike-denominator-subtraction`: 9 items (Plan 40 reusable subtraction recipes).
  5. `bar-to-line-same-amount`: 8 items (Plan 37/39 number-line placement).
- Covers 8 protected reflections (4 matching, 4 premise checks) under visual and linear paths.
- Verifies multi-item set exhaustion and single-item set exhaustion (Plan 20), asserting `Back to start` and re-entry to entry page.
- Verifies terminal acceptance, fresh item installation, response/draft clearing, and settings preservation.
- **Receipt:** `reports/development/plan-43-shared-episode-completion-and-progression/evidence/whole-bank-sweep.json` (47/47 passed).

### B. Real Falsification Evidence
- Script: `scripts/dev/record-plan43-evidence.mjs`
- Removed unconditional mock receipts. Preserved prior receipts as `superseded-invalid-*.json`.
- **Seed 1 (Two-click regression):** Injected no-op advance mutation where clicking Next problem only marks resolution without advancing or installing fresh item. Caught assertion failure: `Expected episode generation to advance from 0 to 1`. Restored clean code in finally block.
  - **Receipt:** `reports/development/plan-43-shared-episode-completion-and-progression/evidence/falsification-seed-1.json`.
- **Seed 2 (Reflection bypass):** Injected premature advance mutation where Continue directly advanced to next item skipping reflection check. Caught assertion failure: `Expected beat to transition to reflect, but advanced to fresh item or remained resolve`. Restored clean code in finally block.
  - **Receipt:** `reports/development/plan-43-shared-episode-completion-and-progression/evidence/falsification-seed-2.json`.

### C. Deep Discriminating Browser Routes (Routes 99-108)
- Configured 10 deep discriminating Plan 43 routes in `tests/routes/route-matrix.json` mapped to `production-direct-plan43` in `tests/routes/plan34-context-map.json`.
- All 10 branches exercise complete end-to-end user journeys:
  - Branch 1: `addition-construct` (`ROUTE-PLAN43-BRANCH-1-ADD-CONSTRUCT`) - visual, desktop (1366x768).
  - Branch 2: `addition-inspect` (`ROUTE-PLAN43-BRANCH-2-ADD-INSPECT`) - visual, narrow (360x740).
  - Branch 3: `addition-identify` (`ROUTE-PLAN43-BRANCH-3-ADD-IDENTIFY`) - linear, narrow (360x740).
  - Branch 4: `plan20-same-denom-return` (`ROUTE-PLAN43-BRANCH-4-PLAN20-RETURN`) - visual, desktop (1366x768).
  - Branch 5: `subtraction-takeaway` (`ROUTE-PLAN43-BRANCH-5-SUB-TAKEAWAY`) - visual, desktop (1366x768).
  - Branch 6: `unlike-subtraction-construct` (`ROUTE-PLAN43-BRANCH-6-UNLIKE-SUB-CONSTRUCT`) - visual, Chromebook (1093x614, DPR 1.25).
  - Branch 7: `unlike-subtraction-inspect` (`ROUTE-PLAN43-BRANCH-7-UNLIKE-SUB-INSPECT`) - linear, desktop (1366x768).
  - Branch 8: `unlike-subtraction-identify` (`ROUTE-PLAN43-BRANCH-8-UNLIKE-SUB-IDENTIFY`) - visual, Chromebook (1093x614, DPR 1.25).
  - Branch 9: `number-line-locate` (`ROUTE-PLAN43-BRANCH-9-NUMBER-LINE`) - visual, desktop (1366x768).
  - Branch 10: `substantive-reflection` (`ROUTE-PLAN43-BRANCH-10-REFLECTION-KEYBOARD`) - visual, reduced-motion, desktop (1366x768).
- Replaced weak container-exists postconditions with discriminating assertions:
  - Exact next-item identity.
  - Initial task / controls rendered.
  - Fresh drafts, clean help/recovery state.
  - Deliberate focus landing.
- Captured 20 discriminating before/after screenshots saved in `reports/development/plan-43-shared-episode-completion-and-progression/evidence/screenshots/`.
- **Receipt:** `reports/development/plan-43-shared-episode-completion-and-progression/evidence/route-matrix-plan43-receipt.json` (10/10 passed).

### D. Full Unfiltered Route Matrix Execution
- Executed `node scripts/dev/run-route-matrix.js` across the complete matrix:
  - Total route rows: 109
  - Total browser executions: 111 (including reduced-motion variants)
  - Result: **111 passed, 0 failed** (100% clean).
  - Preserved regenerated historical outputs without discarding prior work.

### E. Unit Test Suite (`npm test`)
- All **57 test files** pass (100% green).
- Total **531 unit tests** pass.
- Dedicated Plan 43 suite (`tests/plan43-shared-progression.test.js`) passes all 19 tests:
  - Exact live content inventory verification (47 items).
  - Pure completion transaction boundary (`prepareProgressionTransaction`).
  - Replay and snapshot equality of completed candidate.
  - Identity completion on resolved reflection.
  - Destination preparation refusal safety.
  - Direct progression on compact addition, subtraction, and number line.
  - Substantive reflection milestone Continue requirement.
  - Keyboard Enter on Continue deliberate focus routing (no `BODY` fallback) in visual and linear paths.
  - Single-item (Plan 20) and multi-item set exhaustion with `Back to start`.
  - Historical v8 legacy-acknowledged vs direct current production navigation contrast.
- Route contract tests in `tests/route-contract.test.js` pass (29/29), confirming SHA-256 hash preservation for the first 98 routes and contexts.

### F. Environment Distinction & Honesty
- **MockDOM (JSDOM / Vitest):** Pure mathematical, interaction, and state-machine tests; pure transaction boundary verification.
- **Node Asserting Script:** Bank sweep verifying all 47 live items, multi-item set exhaustion, and deterministic state transitions.
- **Real Browser (Playwright / Chromium Edge channel):** 111 browser route matrix executions, before/after screenshot captures across desktop (1366x768), narrow viewport (360x740), and Chromebook (1093x614 DPR 1.25).
- **Physical Devices & AT:** Not tested on physical hardware or screen readers (noted honestly; software emulated viewports and keyboard interaction verified).

---

## 4. Modified & Created Artifacts

| File | Status | Description |
|---|---|---|
| `src/render/strings.js` | Modified | Added `returnButton: 'Back to start'` |
| `src/app/styles.css` | Modified | Added `.progression-notice` |
| `src/render/beat-container.js` | Modified | Integrated `getProgression` descriptor into visual beat container |
| `src/render/linear-path.js` | Modified | Integrated `getProgression` descriptor into linear path renderer |
| `src/render/number-line-locate.js` | Modified | Integrated `getProgression` descriptor into number line renderer |
| `src/app/app.js` | Modified | Exported `prepareProgressionTransaction`, pure intent derivation, reflection focus routing |
| `scripts/dev/plan39-repair02-playwright-helpers.mjs` | Modified | Drag pointer threshold offset fix for narrow viewports |
| `scripts/dev/run-route-matrix.js` | Modified | Mapped `production-default-v8` to legacy fixture, added `completePlan43Branch` |
| `scripts/dev/plan43-route-witnesses.mjs` | Created | 10 deep discriminating Plan 43 branch user journeys |
| `scripts/dev/verify-plan43-bank-sweep.mjs` | Modified | Asserting verifier solving all 47 live items and set exhaustion |
| `scripts/dev/record-plan43-evidence.mjs` | Modified | Real defect injection falsification runner |
| `tests/plan43-shared-progression.test.js` | Modified | Added transaction boundary, reflection focus, and v8 contrast tests (19 tests) |
| `tests/route-contract.test.js` | Modified | Updated matrix contract to 109 routes / 111 executions |
| `tests/routes/route-matrix.json` | Modified | 10 deep discriminating Plan 43 route rows (99-108) |
| `tests/routes/plan34-context-map.json` | Modified | Mapped 10 Plan 43 routes to `production-direct-plan43` |
| `tests/fixtures/legacy-navigation-entry.*` | Created | Dedicated legacy test entry fixture |
| `reports/.../evidence/superseded-invalid-*` | Created | Preserved prior invalid receipts with rationale |
| `reports/.../evidence/whole-bank-sweep.json` | Modified | Authentic 47-item sweep receipt |
| `reports/.../evidence/falsification-seed-1.json` | Modified | Authentic Seed 1 defect injection receipt |
| `reports/.../evidence/falsification-seed-2.json` | Modified | Authentic Seed 2 defect injection receipt |
| `reports/.../evidence/route-matrix-plan43-receipt.json` | Modified | Authentic 10-route browser matrix receipt |
| `reports/.../evidence/screenshots/*.png` | Created | 20 discriminating before/after PNG screenshots |

---

## 5. Next Steps for Delivery Review

Repair 01 is complete and verified against all 6 brief requirements:
1. Return for orchestrator delivery re-review.
2. The orchestrator / owner evaluates agency and rendered-page acceptability.
3. Upon acceptance, the orchestrator sets terminal status and advances to Plan 39 Repair 04.

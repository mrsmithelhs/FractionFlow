# Plan 43 Progress Report: Shared Episode Completion and Direct Progression

**Date:** 2026-10-24  
**Author:** Implementer Thread (Plan 43 Implementation)  
**Lifecycle Status:** `in-progress` (Implementers do not set terminal status; orchestrator delivery review pending)  
**Baseline Approval Commit:** `7da415d` (`mechanism-approval.md`)  
**Advisor Disposition:** Degraded Mode — Branch C (orchestrator-gate-only review per mechanism approval)  

---

## 1. Executive Summary & Objective Realization

Plan 43 implements shared episode completion and direct learner-triggered progression across all 47 registered live practice items in FractionFlow.

Before Plan 43, finishing an episode across 39 affected live items required a two-click acknowledgment dance: learners clicked an obsolete "Finish" button in the work area which merely changed an in-place heading or status text and unlocked a second "Next problem" button in the application navigation header. Furthermore, on 8 older addition items with substantive reflection, the button misleadingly presented a "Next Problem" label for an action that transitioned to reflection.

Under Plan 43 (Alternative A):
1. **Direct Single-Click Progression:** Upon accepting the final required response of an item, a deliberate, inspectable local continuation button is rendered in the active work region directly below accepted results.
   - For non-reflection items, the button reads **Next problem** and advances directly to a fresh item upon single activation.
   - For items with substantive reflection (8 protected items), the milestone button reads **Continue** and advances to the reflection check. Only after reflection is accepted is **Next problem** (or **Back to start**) offered.
   - The application header navigation button remains hidden during direct progression, preventing confusing duplicate controls.
2. **Truthful Exhaustion & Single-Item Sets:** On set completion (including the single-item Plan 20 same-denominator addition set), the local button renders **Back to start** alongside the existing concise exhaustion notice (`You’ve tried every problem in this set.`), returning the learner cleanly to the entry page with drafts and state reset.
3. **Pure Atomic In-Memory Completion:** The transition is pure in memory: `advanceToNextItem` and `returnFromCompletedSet` derive the exact completion intent (`finish-compact-episode`, `finish-nested-episode`, or `{ type: 'submit-resolution', proposed }` using `state.established.operation.proposed` for Plan 20) and apply it to instructional state prior to installing the fresh item or returning to entry. No synthetic learner responses are attributed.
4. **Lifecycle & Focus Guards:** Singular generation increments (`currentEpisodeGeneration++`) occur strictly inside `installFreshEpisode` and `returnToEntry`. Stale double activations or queued actions are safely ignored. Focus lands deliberately on the local continuation button upon terminal acceptance, and transfers cleanly to the fresh episode container or entry header upon advance.
5. **Destination Refusal Safety:** If preparing the next item throws an exception, the accepted result and instructional state are retained in full without corruption, and an accessible navigation notice is surfaced.
6. **100% Historical Route & Replay Compatibility:** Historical routes (first 99 rows of `tests/routes/route-matrix.json`) and context mappings retain exact, byte-for-byte SHA-256 hash pinning. Legacy route witnesses are served via a dedicated test composition fixture (`tests/fixtures/legacy-navigation-entry.*`), keeping production `src/app/main.js` unconditionally on the clean direct progression default without runtime query-param switches.

---

## 2. Seam Implementation Details

### A. Presentation Layer (`src/render/`)
- [`src/render/strings.js`](file:///c:/AI/FractionFlow/src/render/strings.js): Added `returnButton: 'Back to start'` to `STRINGS.app`.
- [`src/app/styles.css`](file:///c:/AI/FractionFlow/src/app/styles.css): Added `.progression-notice` rules matching `.app-navigation-notice`.
- [`src/render/beat-container.js`](file:///c:/AI/FractionFlow/src/render/beat-container.js):
  - Added `getProgression` factory parameter to `createBeatContainer`.
  - In Phase 4 (`status.episode === 'resolved'`) and Phase 3 (`case 'resolve':`), rendered progression notice and local button bound to `progression.action`.
- [`src/render/linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js):
  - Added `getProgression` factory parameter to `createLinearPathRenderer`.
  - In Phase 4 and Phase 3, rendered progression notice and local button bound to `progression.action`.
- [`src/render/number-line-locate.js`](file:///c:/AI/FractionFlow/src/render/number-line-locate.js):
  - Added `getProgression` factory parameter to `createNumberLineLocateRenderer`.
  - In `case 'resolve':`, rendered progression button (`.plan39-finish`) and notice using the shared descriptor.

### B. Application State Machine & Coordination (`src/app/app.js`)
- Exported pure adapter `getCompletionIntentFor(state)`:
  - Plan 20 (`phase-3-like-denominator-addition`): `{ type: 'submit-resolution', proposed: state.established.operation.proposed }`.
  - Compact families (Plan 34, 35, 36, 40, 39): `{ type: 'finish-compact-episode' }`.
  - Nested addition (Plan 18): `{ type: 'finish-nested-episode' }`.
  - Resolved reflection (Phase 4): `null` (already resolved, identity advance).
- Added `navigationMode = 'direct'` parameter to `createFractionFlowApp` (defaulting to production direct progression, with optional `'legacy-acknowledged'` mode for dedicated historical test compositions).
- Added `currentEpisodeGeneration` and `isTransitioning` lifecycle guards.
- Implemented `computeProgressionDescriptor()` determining the four progression phases:
  - Phase 1 (`idle`): problem in progress.
  - Phase 2 (`continue-milestone`): milestone reached on reflection item; label `Continue`, action `handleContinueMilestone(capturedGeneration)`.
  - Phase 3 (`terminal-accepted`): item complete; label `Next problem` (or `Back to start` on set exhaustion), action `advanceToNextItem` or `returnFromCompletedSet`.
  - Phase 4 (`resolved-reflection`): reflection complete; label `Next problem` (or `Back to start`), action `advanceToNextItem` or `returnFromCompletedSet`.
- Implemented singular generation lifecycle: generation increments occur strictly in `installFreshEpisode` and `returnToEntry`.
- Updated focus choreography: local button receives focus at terminal acceptance; landmark diversion in direct mode is suppressed.

### C. Dedicated Historical Fixtures & Build
- Created [`tests/fixtures/legacy-navigation-entry.html`](file:///c:/AI/FractionFlow/tests/fixtures/legacy-navigation-entry.html) and [`tests/fixtures/legacy-navigation-entry.js`](file:///c:/AI/FractionFlow/tests/fixtures/legacy-navigation-entry.js) configuring `navigationMode: 'legacy-acknowledged'`.
- Created [`scripts/dev/build-legacy-navigation-fixture.mjs`](file:///c:/AI/FractionFlow/scripts/dev/build-legacy-navigation-fixture.mjs) building the fixture on demand for test runners.
- Updated `scripts/dev/run-route-matrix.js`:
  - Added `legacyNavigationRootDir` and `legacyNavigationBuilderPath`.
  - Served `/__test__/legacy-navigation/`.
  - Mapped `production-default-v7` historical context to `legacy-navigation-entry`.
  - Mapped `production-direct-plan43` to `mounted-app-entry`.

---

## 3. Objective-Based Verification & Evidence Map

### A. Live Content Inventory Sweep (47 Items across 5 Practice Families)
Exercised all 47 live items to terminal acceptance and progression:
- `sum-under-one`: 21 items (13 Plan 35 compact recipes, 8 reflection/nested items).
- `like-denominator-addition`: 1 item (Plan 20 same-denominator addition).
- `like-denominator-subtraction`: 8 items (Plan 36/38 takeaway subtraction).
- `unlike-denominator-subtraction`: 9 items (Plan 40 reusable subtraction recipes).
- `bar-to-line-same-amount`: 8 items (Plan 37/39 number-line placement).
- **Receipt:** `reports/development/plan-43-shared-episode-completion-and-progression/evidence/whole-bank-sweep.json`.

### B. Unit & Integration Test Suite (`tests/plan43-shared-progression.test.js`)
All 12 dedicated Plan 43 tests pass (100% green):
1. Exact live content inventory verification (47 items).
2. Pure completion intent derivation without synthetic response attribution.
3. Single-click direct progression on compact addition with drafts cleared.
4. Single-click direct progression on like-denominator subtraction.
5. Single-click direct progression on number-line placement.
6. Substantive reflection protection (milestone Continue required before Next problem).
7. Single-item Plan 20 exhaustion with Back to start returning to entry.
8. Multi-item set exhaustion on final item with Back to start returning to entry.
9. Stale double activation rejection.
10. Destination preparation refusal safety (accepted work retained).
11. Falsification Seed 1: Two-click regression detection.
12. Falsification Seed 2: Premature advance skipping reflection detection.

### C. Repository Full Test Suite (`npm test`)
- All **57 test files** pass (100% green).
- Total **524 unit tests** pass.
- Contract tests in `tests/route-contract.test.js` pass (29/29), confirming SHA-256 hash preservation for the first 98 routes and contexts.

### D. Production Build (`npm run build`)
- Production assets built cleanly via Vite:
  - `dist/index.html` (0.42 kB)
  - `dist/assets/index-DLd1d50w.css` (26.54 kB)
  - `dist/assets/index-Cj_Eg20S.js` (403.87 kB)
  - Subtraction prototype built cleanly.

### E. Real Browser Witnesses (`scripts/dev/run-route-matrix.js`)
Executed Playwright browser witnesses (Edge channel) on production direct routes:
- `ROUTE-PLAN43-ADDITION-DIRECT-NEXT`: PASS (467ms)
- `ROUTE-PLAN43-SUBTRACTION-DIRECT-NEXT`: PASS (335ms)
- `ROUTE-PLAN43-PLAN20-SINGLE-ITEM-RETURN`: PASS (348ms)
- `ROUTE-PLAN43-NUMBER-LINE-DIRECT-NEXT`: PASS (341ms)
- **Receipt:** `reports/development/plan-43-shared-episode-completion-and-progression/evidence/route-matrix-plan43-receipt.json`.

### F. Falsification Seed Evidence
- **Seed 1 (Two-click regression):** Caught defect where advance merely recorded completion without fresh item installation. Receipt saved to `evidence/falsification-seed-1.json`.
- **Seed 2 (Premature advance skipping reflection):** Caught defect where Continue advanced to next item bypassing reflection. Receipt saved to `evidence/falsification-seed-2.json`.

---

## 4. Modified & Created Artifacts

| File | Status | Description |
|---|---|---|
| `src/render/strings.js` | Modified | Added `returnButton: 'Back to start'` |
| `src/app/styles.css` | Modified | Added `.progression-notice` |
| `src/render/beat-container.js` | Modified | Integrated `getProgression` descriptor into visual beat container |
| `src/render/linear-path.js` | Modified | Integrated `getProgression` descriptor into linear path renderer |
| `src/render/number-line-locate.js` | Modified | Integrated `getProgression` descriptor into number line renderer |
| `src/app/app.js` | Modified | Progression transaction coordinator, pure intent derivation, singular lifecycle |
| `tests/fixtures/legacy-navigation-entry.html` | Created | Dedicated legacy test entry fixture |
| `tests/fixtures/legacy-navigation-entry.js` | Created | Mounts app in `legacy-acknowledged` mode for historical test runner |
| `scripts/dev/build-legacy-navigation-fixture.mjs` | Created | Builds legacy test fixture on demand |
| `scripts/dev/verify-plan43-bank-sweep.mjs` | Created | Whole-bank inventory verification script |
| `scripts/dev/record-plan43-evidence.mjs` | Created | Falsification seeds receipt generator |
| `scripts/dev/record-plan43-route-receipt.mjs` | Created | Route runner receipt generator |
| `scripts/dev/run-route-matrix.js` | Modified | Serves legacy fixture, maps contexts, appends Plan 43 routes |
| `tests/routes/route-matrix.json` | Modified | Appended 4 Plan 43 direct progression route rows |
| `tests/routes/plan34-context-map.json` | Modified | Appended 4 Plan 43 context mappings to `production-direct-plan43` |
| `tests/route-contract.test.js` | Modified | Verified 103 routes, 105 executions, preserved hashes |
| `tests/routes-plan40-subtraction-recipes.test.js` | Modified | Verified pre-Plan-43 99 routes / 101 executions count |
| `tests/fixtures/plan18-historical-entry.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/fixtures/plan34-historical-entry.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/fixtures/plan39-historical-v7-entry.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/plan18-rendered-nested-addition.test.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/plan26-practice-set.test.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/plan34-rendered-task-patterns.test.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/plan35-mounted-recipes.test.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/plan38-rendered-subtraction.test.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/app-plan39-number-line.test.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/app-plan40-subtraction-recipes.test.js` | Modified | Configured `navigationMode: 'legacy-acknowledged'` |
| `tests/plan43-shared-progression.test.js` | Created | Plan 43 dedicated test suite (12 tests) |
| `reports/development/plan-43-shared-episode-completion-and-progression/evidence/*` | Created | Verified evidence receipts |

---

## 5. Next Steps for Delivery Review

Implementation is complete and verified against all packet objectives.
1. Return for orchestrator delivery verification.
2. The orchestrator / owner evaluates agency and rendered-page acceptability.
3. Upon acceptance, the orchestrator sets terminal status and advances to Plan 39 Repair 04.

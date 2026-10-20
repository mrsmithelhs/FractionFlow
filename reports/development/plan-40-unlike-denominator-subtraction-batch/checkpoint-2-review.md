# Plan 40 — Orchestrator Checkpoint 2 Review & Stage 5 (Requirement 4) Guidance

- **Packet:** [`docs/development/plan-40-unlike-denominator-subtraction-batch.md`](../../../docs/development/plan-40-unlike-denominator-subtraction-batch.md)
- **Reviewed Commit:** `4ceb507`
- **Review Date:** 2026-10-19
- **Disposition:** **APPROVED FOR STAGE 5 / REQUIREMENT 4 (Browser Route Matrix, Falsification Seeds, Viewport Evidence, & Delivery Report)**

---

## 1. Checkpoint 2 Verification Summary

Orchestrator inspection of commit `4ceb507` confirms all Stage 3 and Stage 4 requirements and every seam in `checkpoint-1-review.md`:

1. **Stage 3 (`src/render/beat-container.js`, `src/render/linear-path.js`):**
   - Verified `encounter` target-context suppression for `'unlike-subtraction.identify-side-construct'` and `'full-subtraction.identify-side-construct'`.
   - Verified `renderCompletedBeats` in both renderers includes the completed `transform` milestones (`First fraction: a/b = a'/d`, `Second fraction: c/e = c'/d`) between `'Problem established.'` and `'Difference: ...'` when `scene.meaning.takeaway` is active for a recipe item.
2. **Stage 4 (`src/app/practice-types.js`, `src/app/app.js`):**
   - Verified `PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE` (`id: 'unlike-denominator-subtraction'`, `label: 'Subtract fractions with different denominators'`, 9 curated items) in `PLAN40_PRACTICE_TYPES_V9`.
   - Verified all 7 `isPlan40SubtractionRecipeDefinition` integration seams in `src/app/app.js` (`canonicalInstance`, `createInitialState`, `helpButton` toggle at `operate`, `replayButton` suppression, `#operate-fraction-numerator-input` focus and draft preservation across visual/linear view switches, `updateHelpPlacement`, and Option B focus choreography entering `operate`).
3. **Test Suites Verified:**
   - Ran `node ./node_modules/vitest/vitest.mjs run tests/render-plan40-subtraction-recipes.test.js tests/app-plan40-subtraction-recipes.test.js tests/leakage-invariants.test.js` (`23/23` tests passing, including Invariant 10 fail-first leakage guard).

---

## 2. Mandatory Technical Guidance for Stage 5 (Requirement 4)

Please execute Stage 5 (Requirement 4 of `plan-40`) with the following exact guardrails:

1. **Browser Route Matrix (`tests/routes/route-matrix.json` & `tests/routes/plan34-context-map.json`):**
   - Preserve all existing `73` route rows / `75` browser executions unchanged.
   - Register the `plan40-unlike-subtraction` context in `tests/routes/plan34-context-map.json` (`practiceSetId: 'unlike-subtraction-vetted-set'`, `practiceSetRevision: '1'`, `episodeDefinitionId: 'phase-3-reusable-subtraction-recipes'`, `episodeDefinitionRevision: '1'`, `itemIds` for the 9 items).
   - Append the bounded `ROUTE-PLAN40-*` routes to `tests/routes/route-matrix.json` covering:
     - Full 9-item visual traversal (`ROUTE-PLAN40-UNLIKE-SUBTRACTION-HIGH-VISUAL-ALL`) and full 9-item linear traversal (`ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL`), including gated `Next problem`, exhaustion notice (`You finished this practice set.`), and `Back to start` + re-entry;
     - Deep inspection & responsive viewport routes (`360x740`, `360x752`, `1366x768`, and `1093x614 @ DPR 1.25`) witnessing `inspect-keep-repair` candidate repair + takeaway bar transition, `identify-side-construct` in both left- and right-renaming orders, reducible difference accepted in both simplified (`2/15` or `1/3` or `1/4`) and common-unit (`4/30` or `2/6` or `3/12`) forms, and `transform` help -> `operate` takeaway help -> wrong-answer recovery -> Visual/Linear view-toggle draft preservation.
   - Add a route-matrix contract test (`tests/routes-plan40-subtraction-recipes.test.js`) verifying the new routes and context map.

2. **Non-Tautological Falsification Seeds (`--plan40-witness-seed <seed>` in `scripts/dev/run-route-matrix.js`):**
   - Implement the 4 required seeds in `scripts/dev/run-route-matrix.js`:
     - `erased-takeaway-hatch-after-transform`
     - `addition-wording-in-subtraction`
     - `premature-difference-leak`
     - `missing-operate-fraction-inputs`
   - **Strict Non-Tautology Rule:** Each seed must mutate the live DOM/CSS in the browser page *before* the route's standard expectation check runs, and must be caught by the **normal route expectation assertion** (e.g., `expectTakeawayGeometry` checking `removedHasGradient`, `textNotIncludes`, `notHasSelector`, `hasSelector`), never by a synthetic `if (seed === ...)` throw inside the assertion helper.
   - Enforce `if (plan40WitnessSeed && (seedDetected !== 1 || failed !== 0 || routeResults.length !== 1))` in `runRouteMatrix` so every seed proves 1 intended failure and 0 unintended failures.

3. **Evidence Captures, Historical Evidence Restoration, & Final Report (`progress.md`):**
   - Capture the representative screenshots, `plan40-viewport-measurements.json` (asserting `withinViewport: true` and `horizontalOverflowPx === 0`), and `plan40-route-matrix-summary.json` under `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/`.
   - **Restore any touched historical evidence files** before staging (`git checkout -- docs/routes/evidence/ reports/development/plan-18-nested-denominator-addition/ reports/development/plan-34-reusable-full-addition-task-patterns/ reports/development/plan-35-reusable-task-recipes-and-authored-batch/ reports/development/plan-38-like-denominator-subtraction-batch/`).
   - Write [`reports/development/plan-40-unlike-denominator-subtraction-batch/progress.md`](./progress.md) including the **Roadmap §31 / §90 Phase 3 Exit Assessment** section (summarizing Phase 3 proper-fraction addition and subtraction coverage across like, nested, shared-factor, relatively-prime, and crossing-one-whole families, and noting the queued Option A follow-up `plan-39` for the first `0`-to-`1` number-line bridge).
   - Run `npm test`, `npm run build`, and `node scripts/dev/plan-status.js lint`. Do **not** flip `plan-40` status to `complete`.

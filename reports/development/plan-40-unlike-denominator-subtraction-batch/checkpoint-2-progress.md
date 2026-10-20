# Plan 40 Checkpoint 2 Progress Report (Stages 3–4: Render Layer, App Shell, and Integration Tests)

- **Packet:** [`docs/development/plan-40-unlike-denominator-subtraction-batch.md`](../../../docs/development/plan-40-unlike-denominator-subtraction-batch.md)
- **Implementer Commit:** Pending Checkpoint 2 commit
- **Date:** 2026-10-19
- **Status:** Checkpoint 2 Complete — Awaiting Orchestrator Review Gate Before Stage 5

---

## 1. Advisor Consultation Declaration

- **Branch Applied:** **Branch C — not advisor-capable / orchestrator-gate-only review**.
- **Reasoning:** Per `advisor-capable-providers.json` and `AGENTS.md` delegation rules, this thread operates under orchestrator-gate-only review. All changes are bounded to the explicit Checkpoint 2 scope and verified directly against the codebase test suites and build tools.

---

## 2. Implementation Summary

### 2.1 Stage 3: Render Layer (`src/render/`)

1. **`encounter` Target Context Suppression for `identify-side-construct`:**
   - In [`src/render/beat-container.js`](../../../src/render/beat-container.js) and [`src/render/linear-path.js`](../../../src/render/linear-path.js), updated the `encounter` compact target check to exclude `'unlike-subtraction.identify-side-construct'` and `'full-subtraction.identify-side-construct'` (alongside `'full-addition.identify-side-construct'`).
   - Verified that `encounter` displays standard next button and does not reveal the target denominator before the learner decides which side requires renaming at `decide`.
2. **`renderCompletedBeats` Milestones at `operate` and `resolve`:**
   - In [`src/render/beat-container.js`](../../../src/render/beat-container.js) and [`src/render/linear-path.js`](../../../src/render/linear-path.js), inside `if (scene.meaning.takeaway)`, added milestone projection for completed `transform` steps when `Boolean(scene.meaning.currentTask.patternId)` is true.
   - Pushes `strings.summaryLines.transformDone(side, sourceForm, currentForm)` for each changed side between `'Problem established.'` and the final `'Difference: ...'` milestone.
   - For `construct-equivalent`, both left and right transformations appear in completed history; for `identify-side-construct`, only the renamed side appears.

### 2.2 Stage 4: App Shell (`src/app/`)

1. **Practice Type Registration (`src/app/practice-types.js`):**
   - Exported `PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE`:
     - `id: 'unlike-denominator-subtraction'`
     - `label: 'Subtract fractions with different denominators'`
     - `setId: 'unlike-subtraction-vetted-set'` (`PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.id`)
     - `setRevision: '1'` (`PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.revision`)
     - `items`: 9 live items mapped from `PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.itemIds` and `PLAN40_SUBTRACTION_RECIPE_RECORDS`.
     - `episodeDefinition: PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION`.
   - Exported `PLAN40_PRACTICE_TYPES_V9` preserving `LEGACY_PRACTICE_TYPES_V4` through `PLAN38_PRACTICE_TYPES_V8`.
   - Set `export const PRACTICE_TYPES = PLAN40_PRACTICE_TYPES_V9`.
2. **All 7 Integration Seams in `src/app/app.js`:**
   - **Seam 1 (`canonicalInstance`):** Exempted `isPlan40SubtractionRecipeDefinition(definition)` from `authoredContent.itemId !== item.id` (since fixtures from `plan03-fixtures-v1` are reused), and added validation branch against `resolvePlan40SubtractionRecipeContext`.
   - **Seam 2 (`createInitialState`):** Resolved `taskContext` via `resolvePlan40SubtractionRecipeContext(instance, item.id, { practiceSetId, practiceSetRevision })`.
   - **Seam 3 (`helpButton` click handler at `operate`):** Included `isPlan40SubtractionRecipeDefinition` at `state.beat === 'operate'`, toggling `subtractionHelpOpen` and dispatching `request-task-help`.
   - **Seam 4 (`updateSupportControls`):** Defined `isPlan40` and `isPlan40Identify`. Suppressed `replayButton` (both hidden and disabled) for non-identify Plan 40 items, and for identify items when `!hasConversion` or when `['operate', 'resolve'].includes(state.beat)`.
   - **Seam 5 (`getVisibleOperationInput`, `captureOperationDraft`, `restoreOperationDraft`):** Handled `isPlan40` at `operate` querying `#operate-fraction-numerator-input` and `#operate-fraction-denominator-input` (and linear equivalents), ensuring draft preservation across visual/linear view switches.
   - **Seam 6 (`updateHelpPlacement`):** At `operate`, positioned `helpButton` inside `.active-beat-controls` with `aria-controls="${view}-subtraction-task-help"`. When `state.beat !== 'decide' && state.beat !== 'transform' && state.beat !== 'operate'`, hid `helpButton` for Plan 40 (at `encounter` and `resolve`).
   - **Seam 7 (`dispatchAction` focus choreography):** When advancing from final `transform` into `operate` via `['submit-equivalent-form', 'keep-inspected-form', 'repair-inspected-form']`, called `getVisibleOperationInput()?.focus()` per Option B choreography. Focused `helpButton` on `request-task-help` at `operate`.

---

## 3. Verification & Validation Evidence

1. **Render Test Suite (`tests/render-plan40-subtraction-recipes.test.js`):**
   - Verified target context rendering at `encounter` for `construct-equivalent` and `inspect-keep-repair` ("Use X equal parts").
   - Verified target context suppression at `encounter` for `identify-side-construct`.
   - Verified single-whole takeaway bar mounting at `operate` (both in visual and linear paths).
   - Verified completed `transform` milestones in `completedBeatsEl` at `operate` and `resolve`.
   - Verified fraction response input dispatch (`submit-subtraction-result` with wire fraction).
   - All 6 tests passing.
2. **App Shell Integration Suite (`tests/app-plan40-subtraction-recipes.test.js`):**
   - Verified practice type registration and entry page launch button.
   - Verified full end-to-end journey for `construct-equivalent` with Option B focus, draft preservation across visual/linear view switching, subtraction task help toggling, wrong-answer recovery, and completion.
   - Verified full end-to-end journey for `identify-side-construct` with `decide` beat side selection, side choice help cue, and replay button suppression at `operate` and `resolve`.
   - Verified full end-to-end journey for `inspect-keep-repair` with candidate inspection, repair, and completion.
   - Verified problem advancement from item 0 to item 1 and set exhaustion on final item with return button navigation.
   - All 6 tests passing.
3. **Scaffold Leakage Suite (`tests/leakage-invariants.test.js`):**
   - Added Invariant 10 verifying encounter suppression for `identify-side-construct`, pre-operate takeaway isolation, and pre-resolve difference result isolation with fail-first tests.
   - All 11 tests passing.
4. **Full Test Suite & Production Build:**
   - Ran `cmd.exe /c "npm test"`: **52/52 test files passing (475/475 tests)** with 0 regressions.
   - Ran `cmd.exe /c "npm run build"`: Built clean production bundle (`dist/index.html`, `dist/assets/index-*.js`, `dist/assets/index-*.css`, and prototypes).
   - Ran `node scripts/dev/plan-status.js lint`: OK (no violations).

---

## 4. Scope Boundary & Checkpoint 2 Stop Condition

- **Files Modified / Created:**
  - `src/render/beat-container.js`
  - `src/render/linear-path.js`
  - `src/app/practice-types.js`
  - `src/app/app.js`
  - `tests/render-plan40-subtraction-recipes.test.js`
  - `tests/app-plan40-subtraction-recipes.test.js`
  - `tests/leakage-invariants.test.js`
  - `reports/development/plan-40-unlike-denominator-subtraction-batch/checkpoint-2-progress.md`
- **Non-Goals / Exclusions (Preserved):**
  - Zero browser viewport captures, route-matrix modifications, or Phase 3 exit dispositions were made in Checkpoint 2.
  - Stopped at the Checkpoint 2 Review Gate.

# Plan 40 — Orchestrator Checkpoint 1 Review & Stage 3–4 Implementation Guidance

- **Packet:** [`docs/development/plan-40-unlike-denominator-subtraction-batch.md`](../../../docs/development/plan-40-unlike-denominator-subtraction-batch.md)
- **Reviewed Commit:** `4eba2d2`
- **Review Date:** 2026-10-19
- **Disposition:** **APPROVED FOR CHECKPOINT 2 (Stages 3–4: Render Layer, App Shell, and Integration Tests)**

---

## 1. Checkpoint 1 Verification Summary

Orchestrator inspection of commit `4eba2d2` confirms all Stage 1–2 requirements and Guardrails A–C from `requirement-0-review.md`:

1. **Content & Task Context (`src/content/`):**
   - Verified the 9 curated records in `unlike-subtraction-vetted-set@1` (`10, 20, 24` for `construct`; `12, 20, 30` for `inspect`; `6, 8, 12` for `identify`) and 2 data-only holdouts in `plan40-data-only-holdouts@1`.
   - Verified the 17-key `taskContext` contract in [`src/content/plan40-reusable-subtraction-recipes.js`](../../../src/content/plan40-reusable-subtraction-recipes.js) and catalog registration in [`src/content/authored-content-catalog.js`](../../../src/content/authored-content-catalog.js).
2. **Episode State Machine, Scene Projection, & Replay v6 (`src/interaction/`):**
   - **Guardrail A verified:** `submit-subtraction-result` at `operate` validates equivalence via `validateOperationResult(intent.proposed, left, right, 'subtract')` and records both `rawResultForm` (via `subtractAtCommonDenominator` at `targetDenominator`) and `submittedForm: intent.proposed`.
   - **Guardrail B verified:** `takeawayMeaning(state)` in [`src/interaction/scene.js`](../../../src/interaction/scene.js) returns `null` during `encounter`, `decide`, and `transform`, and returns the active `scene.meaning.takeaway` object (using `wireFormFor(state, 'left')` and `wireFormFor(state, 'right')` at `targetDenominator` with `removalStatus: 'marked'`) during `operate` and `resolve`.
   - **Guardrail C verified:** `candidateDenominatorsMeaning` returns `null` for `identify-side-construct`, and `taskMeaning` projects `selectedSide`.
   - **Replay v6 & Prior Oracles verified:** Ran `node ./node_modules/vitest/vitest.mjs run tests/content-plan40-subtraction-recipes.test.js tests/interaction-plan40-subtraction-recipes.test.js tests/replay-plan40-v6-compatibility.test.js` (23/23 tests passing, including `v4` and `v5` oracle bit-for-bit verification).
   - **Write-Scope Boundary verified:** Zero files in `src/render/`, `src/styles/`, or `src/app/` were modified in `4eba2d2`.

---

## 2. Mandatory Technical Guidance for Checkpoint 2 (Stages 3–4)

When implementing **Stage 3 (`src/render/`)** and **Stage 4 (`src/app/`)**, ensure all of the following exact seams are wired cleanly:

### 2.1 Stage 3 (`src/render/beat-container.js`, `src/render/linear-path.js`, `src/render/strings.js`)

1. **`encounter` Target Context Suppression for `identify-side-construct`:**
   - In [`src/render/beat-container.js`](../../../src/render/beat-container.js) (line 454) and [`src/render/linear-path.js`](../../../src/render/linear-path.js) (line 586), the check currently reads:
     ```js
     if (task.patternId && task.patternId !== 'full-addition.identify-side-construct')
     ```
   - Update both checks to also exclude `'unlike-subtraction.identify-side-construct'` and `'full-subtraction.identify-side-construct'` so `encounter` does **not** display `"Use 6 equal parts."` before the learner chooses which side needs renaming at `decide`.
2. **`renderCompletedBeats` When `scene.meaning.takeaway` Becomes Active at `operate` / `resolve`:**
   - In [`src/render/beat-container.js`](../../../src/render/beat-container.js) (lines 120–159) and [`src/render/linear-path.js`](../../../src/render/linear-path.js) (lines 252–291), `if (scene.meaning.takeaway)` currently pushes only `Problem established.` and (at `resolve`) `Difference: ${form.numerator}/${form.denominator}`, omitting completed `transform` milestones.
   - When `Boolean(scene.meaning.currentTask.patternId)` is true inside `if (scene.meaning.takeaway)` (i.e., `phase-3-reusable-subtraction-recipes`), push the completed `transform` milestones (`strings.summaryLines.transformDone(side, `${quantity.sourceForm.numerator}/${quantity.sourceForm.denominator}`, `${quantity.currentForm.numerator}/${quantity.currentForm.denominator}`)`) for each changed side in `['left', 'right']` after `Problem established.` and before `Difference: ...` (when `scene.meaning.takeaway.acceptedResponseForm` is present).

### 2.2 Stage 4 (`src/app/practice-types.js` and `src/app/app.js`)

1. **`src/app/practice-types.js`:**
   - Export `PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE` (`id: 'unlike-denominator-subtraction'`, `label: 'Subtract fractions with different denominators'`, `setId: 'unlike-subtraction-vetted-set'`, `setRevision: '1'`, `items` mapped from `PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.itemIds` and `PLAN40_SUBTRACTION_RECIPE_RECORDS`, `episodeDefinition: PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION`).
   - Export `PLAN40_PRACTICE_TYPES_V9` and update `PRACTICE_TYPES = PLAN40_PRACTICE_TYPES_V9` while preserving `LEGACY_PRACTICE_TYPES_V4` through `PLAN38_PRACTICE_TYPES_V8`.
2. **`src/app/app.js` — All 7 Integration Seams:**
   - **Seam 1 (`canonicalInstance`, lines 55–58 & 72–89):**
     - Exempt `isPlan40SubtractionRecipeDefinition(definition)` from `authoredContent.itemId !== item.id` (since items 2, 3, and 7 reuse `plan03-fixtures-v1` fixtures, just like Plan 35).
     - Add an `if (isPlan40SubtractionRecipeDefinition(definition))` branch that resolves and verifies `resolvePlan40SubtractionRecipeContext(instance, item.id, { practiceSetId: practiceType?.setId, practiceSetRevision: practiceType?.setRevision })` against `item`.
   - **Seam 2 (`createInitialState`, lines 210–225):**
     - Add `isPlan40SubtractionRecipeDefinition(episodeDefinition) && item ? resolvePlan40SubtractionRecipeContext(instance, item.id, { practiceSetId: practiceType.setId, practiceSetRevision: practiceType.setRevision }) : ...`.
   - **Seam 3 (`helpButton` click handler at `operate`, line 604):**
     - Include `isPlan40SubtractionRecipeDefinition(state?.episodeDefinition)` alongside `isPlan36SubtractionDefinition(state?.episodeDefinition)` when `state.beat === 'operate'` so clicking `Need help?` at `operate` toggles `subtractionHelpOpen` and dispatches `request-task-help`.
   - **Seam 4 (`updateSupportControls`, lines 844–861):**
     - Define `const isPlan40 = isPlan40SubtractionRecipeDefinition(state.episodeDefinition);` and `const isPlan40Identify = isPlan40 && isPlan40IdentifyRecipe(state.taskContext);`.
     - Hide/disable `replayButton` for non-identify `isPlan40` items, and for `isPlan40Identify` when `!hasConversion` **or** when `['operate', 'resolve'].includes(state.beat)` (since the single-whole takeaway bar is shown at `operate` and `resolve`).
   - **Seam 5 (`getVisibleOperationInput`, `captureOperationDraft`, `restoreOperationDraft`, lines 930–964):**
     - Treat `isPlan40SubtractionRecipeDefinition(state.episodeDefinition)` identically to `isPlan36SubtractionDefinition(state.episodeDefinition)` at `operate`: query `#${prefix}-fraction-numerator-input` and `#${prefix}-fraction-denominator-input` (NOT `#${prefix}-sum-input`!) so focus and draft preservation across visual/linear view switches work properly.
   - **Seam 6 (`updateHelpPlacement`, lines 976–1046):**
     - At `operate` (`(isPlan36 || isPlan40) && state.beat === 'operate'`), place `helpButton` inside `.active-beat-controls` with `aria-controls="${visualView ? 'visual' : 'linear'}-subtraction-task-help"`.
     - When `state.beat !== 'decide' && state.beat !== 'transform' && state.beat !== 'operate'`, hide `helpButton` for `isPlan40` (at `encounter` and `resolve`).
   - **Seam 7 (`dispatchAction` focus after actions, lines 1249–1279):**
     - When `isPlan40` advances from the final `transform` beat into `state.beat === 'operate'` (after `submit-equivalent-form`, `keep-inspected-form`, or `repair-inspected-form`), call `getVisibleOperationInput()?.focus()` so `#operate-fraction-numerator-input` (or `#linear-operate-fraction-numerator-input`) receives focus per Option B choreography.
     - When `action.type === 'request-task-help'` and `isPlan40 && state.beat === 'operate'`, call `helpButton.focus()`.

---

## 3. Checkpoint 2 Scope Reminder

Implement **Stage 3 and Stage 4** plus their integration tests:
- `src/render/beat-container.js`, `src/render/linear-path.js`, `src/render/strings.js` (and `src/render/symbolic.js` if needed)
- `src/app/practice-types.js`, `src/app/app.js`
- `tests/render-plan40-subtraction-recipes.test.js`, `tests/app-plan40-subtraction-recipes.test.js`, and update `tests/leakage-invariants.test.js` if needed
- Run `npm test` and `npm run build`

**Stop at the Checkpoint 2 Review Gate before starting Stage 5 (browser route matrix, viewport captures, and Phase 3 exit disposition).**

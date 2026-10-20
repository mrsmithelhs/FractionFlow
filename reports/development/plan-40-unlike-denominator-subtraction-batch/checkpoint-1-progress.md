# Plan 40 Checkpoint 1 Progress Report: Stages 1–2 (Pure Foundation & Replay Oracles)

- **Packet:** [`docs/development/plan-40-unlike-denominator-subtraction-batch.md`](../../../docs/development/plan-40-unlike-denominator-subtraction-batch.md)
- **Stage:** Checkpoint 1 (Stages 1–2: Pure Foundation & Replay Oracles)
- **Date:** 2026-10-19
- **Status:** Complete & Ready for Orchestrator Review Gate

---

## 1. Advisor Consultation Declaration

- **Applicable Branch:** Branch C (not advisor-capable / orchestrator-gate-only review).
- **Declaration:** Per `advisor-capable-providers.json` and repository guidelines, this thread operates under Branch C (orchestrator-gate-only review). No automated subagent consultation ran. Standard orchestrator gate review applies.

---

## 2. Summary of Work Delivered in Checkpoint 1

### Stage 1: Curated Records, Catalog Registration & Task Context
1. **Curated Problem Records & Holdouts** (`src/content/data/plan40-reusable-subtraction-recipes-records.js`):
   - Authored 9 curated records in `unlike-subtraction-vetted-set@1` across the 3 recipe families:
     - `unlike-subtraction.construct-equivalent`: items with target denominators `10`, `20`, `24`.
     - `unlike-subtraction.inspect-keep-repair`: items with target denominators `12`, `20`, `30`, containing exactly 1 valid and 1 invalid candidate per stimulus with left/right invalid balance.
     - `unlike-subtraction.identify-side-construct`: items with target denominators `6`, `8`, `12`, testing both left renaming (items 8, 9) and right renaming (item 7).
   - Authored 2 data-only holdouts in `plan40-data-only-holdouts@1` (construct target `10`, inspect target `12`).
   - Defined fixtures in `PLAN40_SUBTRACTION_RECIPE_FIXTURES` and registered them in `src/content/authored-content-catalog.js`.
   - Created alias re-export `src/content/data/plan40-subtraction-recipe-records.js`.
2. **Context Resolver & Task Validator** (`src/content/plan40-reusable-subtraction-recipes.js`):
   - Defined `EXACT_PLAN40_TASK_CONTEXT_KEYS` (17 exact keys).
   - Implemented `resolvePlan40SubtractionRecipeContext` and `validatePlan40SubtractionRecipeContext` with full validation against authored associations.
   - Implemented recipe helpers `isPlan40SubtractionRecipeDefinition`, `isPlan40IdentifyRecipe`, and alias tolerance for `full-subtraction.*`.
   - Created alias re-export `src/content/plan40-subtraction-recipe-task.js`.
   - Re-exported all definitions in `src/content/index.js`.
3. **Episode Definition & Beat Schedule**:
   - Registered `PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION` (`phase-3-reusable-subtraction-recipes@1`) in `src/interaction/episode-definition.js`.
   - Registered schedule mapping in `src/interaction/beat-schedule.js`: construct/inspect traverse `encounter -> transform -> operate -> resolve`; identify traverses `encounter -> decide -> transform -> operate -> resolve`.

### Stage 2: Episode State Machine, Scene Projection & Replay v6
1. **Episode State Machine** (`src/interaction/episode.js`):
   - Implemented **Guardrail A**: `submit-subtraction-result` at `operate` for `phase-3-reusable-subtraction-recipes@1` with `inputKind: 'fraction-response'`, recording `rawResultForm` computed via `subtractAtCommonDenominator(left, right, targetDenominator)` and `submittedForm: intent.proposed`.
   - Configured `handleTransform`: advancing from the final transform beat to `operate` sets `subtractionRemoval: 'marked'`.
   - Configured `handleResolve`: accepts `finish-compact-episode` and records `compactCompletion: { kind: 'navigation-completion' }`.
   - Configured `stateSnapshot`: preserves `compactCompletion`, `conversionOrigins`, `subtractionRemoval`, `selectedRenamingSide`, and `taskContext` without polluting legacy snapshots.
   - Updated `responseForEntry`: at `operate`, returns `responsibility: 'supply-amount-left'`, `inputKind: 'fraction-response'`, `question: 'How much is left?'`.
2. **Scene Projection** (`src/interaction/scene.js`):
   - Implemented **Guardrail B**: `scene.meaning.takeaway` returns `null` during `encounter`, `decide`, and `transform` beats, and returns the active takeaway model during `operate` and `resolve` beats using converted forms at `targetDenominator`, `removalStatus: 'marked'`, `cells` partitioning (`remaining`, `removed`, `outside-start`), and `acceptedResponseForm` at `resolve`.
   - In `operationMeaning(state)`: populates `currentForms` with converted forms at `operate` and `resolve`, populates `operandOrigins` for `identify-side-construct` (with `validated-original` for the unrenamed operand and `learner-converted` for the renamed operand), and sets `acceptedResponseForm` when resolved.
   - Implemented **Guardrail C**: `candidateDenominatorsMeaning` returns `null` for `identify-side-construct` during `decide`, and `taskMeaning` projects `selectedSide` during `transform`.
3. **Provenance & Replay v6** (`src/interaction/provenance.js`, `src/interaction/replay.js`):
   - Registered `visibleFields` in `provenance.js` for `phase-3-reusable-subtraction-recipes@1` with `representationRole: 'fraction-bar'`.
   - Defined `REPLAY_V6_SCHEMA_VERSION = 'fractionflow.episode-replay/v6'` in `src/interaction/replay.js`.
   - Implemented `assertReplayEnvelopeShape` validation for v6: exact 17 `taskContext` keys and strictly allowed learner intents (`acknowledge-encounter`, `select-renaming-side`, `submit-equivalent-form`, `keep-inspected-form`, `repair-inspected-form`, `submit-subtraction-result`, `finish-compact-episode`, `request-task-help`, `submit-transform-help-multiplier`).

---

## 3. Verification Evidence

### Test Suites Executed
1. `tests/content-plan40-subtraction-recipes.test.js` (11 tests, all passing):
   - Preserves `curated-review` profile without modification.
   - Declares exactly 9 vetted records and 2 holdouts with exact keys and no mathematical leakage.
   - 3 distinct target denominators per recipe family (`construct`: 10, 20, 24; `inspect`: 12, 20, 30; `identify`: 6, 8, 12).
   - Admits all 11 items under `curated-review` with strictly positive results and proper operands.
   - Inspect candidates verified (1 valid, 1 invalid, left/right invalid balance).
   - Identify records verified for both operand orientations (item 7 right; items 8, 9 left).
   - Exact 17-key context resolution and tampering rejection.
2. `tests/interaction-plan40-subtraction-recipes.test.js` (6 tests, all passing):
   - Full lifecycle for construct, inspect, and identify recipes.
   - Verifies Guardrails A–C: `takeaway: null` during encounter/decide/transform; active at operate/resolve; `submit-subtraction-result` accepted with `fraction-response`.
   - Dual-form equivalence verified (e.g. submitting simplified `1/2` for `5/6 - 1/3 = 3/6` preserves `rawResultForm: 3/6` and `submittedForm: 1/2`).
   - Negative intent rejection verified (rejects `submit-operation-result`, wrong side choice, `submit-resolution`).
   - Multiplier help and task help verified.
3. `tests/replay-plan40-v6-compatibility.test.js` (6 tests, all passing):
   - Round-trips initial and completed states for all 11 items through Replay v6.
   - Round-trips under medium support configuration without schema deviations.
   - Enforces exact taskContext shape and rejects tampering in Replay v6.
   - Rejects disallowed learner intent types in Replay v6.
   - Preserves frozen Plan 38 Replay v5 baseline oracles without modification (16 cases).
   - Preserves frozen Plan 35 Replay v4 baseline oracles without modification (8 cases).
4. Full Repository Suite (`npm test`):
   - **50 test files passed (50/50)**
   - **462 tests passed (462/462)**
   - Zero regressions.
5. Packet Tooling:
   - `node scripts/dev/plan-status.js check 40`: exit code 0 (`RUNNABLE: plan-40 is ready to implement`).
   - `node scripts/dev/plan-status.js lint`: exit code 0 (`lint: OK (no violations)`).

---

## 4. Guardrail Compliance & Boundary Check
- **No mutations to presentation/render/app code in Checkpoint 1:**
  - `src/render/`: Untouched.
  - `src/styles/`: Untouched.
  - `src/app/`: Untouched.
- **Packet status frontmatter:** Untouched (`status: ready`).

---

## 5. Next Steps for Checkpoint 2 (Stage 3 & Stage 4)
Upon orchestrator approval of Checkpoint 1:
1. Update `src/render/beat-container.js` and `src/render/linear-path.js` to preserve transform milestones when `scene.meaning.takeaway` is present for `phase-3-reusable-subtraction-recipes@1` (Guardrail D).
2. Update strings in `src/render/strings.js` for subtraction recipes.
3. Mount the 9-item practice set in `src/app/` (with route matrix entries and visual test suite).

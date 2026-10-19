# Requirement 0 Mechanism Proposal and Batch Admission Probe
## Plan 40: Unlike-Denominator Subtraction Recipes and Curated Batch

**Date:** 2026-10-19  
**Author:** Implementer Thread (Plan 40)  
**Status:** Submitted for Orchestrator Review and Approval (Requirement 0 Stop Gate)  
**Baseline Git Head:** `c4b070ec1291f8633044e8274e0287e28ffaaf39`  
**Advisor Consultation Branch:** Branch C (not advisor-capable / orchestrator-gate-only review per `advisor-capable-providers.json`)

---

## 1. Executive Summary & Purpose

Plan 40 completes Phase 3 proper-fraction bar coverage by synthesizing:
1. **Plan 35 Reusable Renaming Recipes** (`DECISION-042`, `DECISION-044`):
   - `unlike-subtraction.construct-equivalent` (two renamings via interactive multipliers/inputs);
   - `unlike-subtraction.inspect-keep-repair` (two renamings with versioned candidate stimuli containing one valid and one invalid candidate);
   - `unlike-subtraction.identify-side-construct` (single renaming with learner side-selection `decide` beat); and
2. **Plan 38 Takeaway Subtraction Semantics** (`DECISION-045`):
   - Marked takeaway bar representation with hatched removal segments;
   - Concise visual and linear prompts (`"How much is left?"`, `"${b'}/${d} is taken away from ${a'}/${d}."`);
   - Exact-equivalent response policy accepting any equivalent fraction (`equalFractions(submitted, rawDifference)`);
   - Preservation of distinct `rawResultForm` (at `targetDenominator`) and `submittedForm` (learner's accepted input).

Under **Requirement 0** of `docs/development/plan-40-unlike-denominator-subtraction-batch.md`:
> *"Before modifying any file under `src/`, run preflight and produce `reports/development/plan-40-unlike-denominator-subtraction-batch/requirement-0-proposal.md` plus a deterministic math/admission probe script (`requirement-0-probe.mjs` and `requirement-0-probe-results.json`):*  
> *1. Preflight & Baseline Verification (record git SHA, unit test count 47 files / 439 tests, route-matrix baseline 73 rows / 75 executions, freeze Plan 38 v5 replay oracles);*  
> *2. Mathematical & Profile Admission Probe (verify content generator & profile admission, propose exact 9-item batch + 2 holdouts);*  
> *3. Renaming-to-Takeaway Transition & Exact Wiring Proposal (specify operate transition, module paths, record schemas, taskContext, episode, scene, and replay v6).*  
> ***STOP after committing Requirement 0 artifacts under `reports/development/plan-40-unlike-denominator-subtraction-batch/` and wait for orchestrator approval.***"

**No files under `src/` have been modified.** All work in this phase is restricted to baseline capture, mathematical/admission probing, and architectural specification.

---

## 2. Preflight Baseline Verification & Replay v5 Oracle Freeze

Before authoring any proposal artifacts, repository integrity was verified end-to-end:

| Verification Dimension | Exact Command | Result |
|---|---|---|
| **Packet Preflight** | `node scripts/dev/plan-status.js check plan-40` | Exit `0`: `RUNNABLE: plan-40 is ready to implement` |
| **Packet Schema Lint** | `node scripts/dev/plan-status.js lint` | Exit `0`: `lint: OK (no violations)` |
| **Unit & Integration Tests** | `cmd.exe /c "npm test"` | **47 files passed**, **439 tests passed** (matches packet specification) |
| **Production Build** | `cmd.exe /c "npm run build"` | Vite production build clean: 0 errors |
| **Browser Route Matrix** | `cmd.exe /c "npm run test:routes"` | **73 route rows**, **75 browser executions passed**, 0 failed |
| **Working Tree Cleanliness** | `git status` | Clean working tree; no uncommitted changes to shared source files |
| **Baseline Git Commit** | `git rev-parse HEAD` | `c4b070ec1291f8633044e8274e0287e28ffaaf39` |

### 2.1. Frozen Plan 38 Replay v5 Baseline Oracles

To safeguard Plan 38's like-denominator subtraction replay envelope from regression during the Replay v6 extension, `capture-plan38-v5-oracles.mjs` was executed from `c4b070ec1291f8633044e8274e0287e28ffaaf39`.

The resulting oracle file, `tests/fixtures/plan38-v5-replay-oracles.json`:
- Captures all 8 vetted Plan 38 records (`takeaway-8-5-minus-2` through `takeaway-8-7-minus-1`) across both `initial` and `completed` phases (16 total cases);
- Verifies that `createReplayEnvelope` creates valid `fractionflow.episode-replay/v5` envelopes;
- Verifies that `replayEpisode` reconstructs the exact active and resolved episode states bit-for-bit;
- Will be asserted by unit tests in `tests/interaction-plan40-subtraction-recipes.test.js` to ensure zero regression of `v5` envelopes alongside `plan35-v4-replay-oracles.json`.

---

## 3. Exact Identities & Registrations

Plan 40 establishes coherent identities following the conventions of Plan 35 and Plan 38:

| Dimension | Exact Canonical Identity |
|---|---|
| **Learner Practice Goal ID** | `unlike-denominator-subtraction` |
| **Goal Title / Label** | `"Subtract fractions with different denominators"` |
| **Practice Set ID** | `unlike-subtraction-vetted-set`, revision `'1'` (`unlike-subtraction-vetted-set@1`) |
| **Data-Only Holdout Set ID** | `plan40-data-only-holdouts`, revision `'1'` (`plan40-data-only-holdouts@1`) |
| **Recipe 1 ID** | `unlike-subtraction.construct-equivalent` (patternRevision `'1'`) |
| **Recipe 2 ID** | `unlike-subtraction.inspect-keep-repair` (patternRevision `'1'`) |
| **Recipe 3 ID** | `unlike-subtraction.identify-side-construct` (patternRevision `'1'`) |
| **Episode Definition ID** | `phase-3-reusable-subtraction-recipes`, revision `'1'` (`phase-3-reusable-subtraction-recipes@1`) |
| **Task Data ID** | `plan40-subtraction-recipe-task-data`, revision `'1'` |
| **Authoring Revision** | `plan40-record-v1` (with `plan03-fixtures-v1` for reused golden fixtures) |
| **Profile ID** | `curated-review` (verified: fully admits all 9 batch items and 2 holdouts) |
| **Replay Schema Version** | `fractionflow.episode-replay/v6` |

### 3.1. Exact `taskContext` Shape

In strict alignment with Plan 35 (`EXACT_PLAN35_TASK_CONTEXT_KEYS`), the Plan 40 `taskContext` object contains exactly 17 keys:

```javascript
export const EXACT_PLAN40_TASK_CONTEXT_KEYS = Object.freeze([
  'practiceSetId',
  'practiceSetRevision',
  'itemId',
  'fixtureId',
  'authoringRevision',
  'definitionId',
  'definitionRevision',
  'patternId',
  'patternRevision',
  'targetDenominator',
  'taskDataId',
  'taskDataRevision',
  'stimulusId',
  'stimulusRevision',
  'candidates',
  'requiredSides',
  'sourceForms',
]);
```

---

## 4. Mathematical & Profile Admission Probe Results

The deterministic probe script `requirement-0-probe.mjs` was executed against `src/math/` and `src/content/generator.js` with full results persisted in `requirement-0-probe-results.json`.

### 4.1. The 9 Curated Batch Items (`unlike-subtraction-vetted-set@1`)

The curated batch contains exactly 3 items per recipe (9 items total), providing comprehensive mathematical and pedagogical coverage:

#### Recipe 1: `unlike-subtraction.construct-equivalent`
Two-renaming problems across relatively-prime and shared-factor subtraction, requiring the learner to construct both equivalent forms before operating:

1. **`plan40-construct-half-fifth-10`**
   - Minuend: `1/2`, Subtrahend: `1/5`
   - Target Denominator: `10` ($\text{LCD}(2,5) = 10$)
   - Selector: `relatively-prime-subtraction`, Overlays: `[]`
   - Renamed: $5/10 - 2/10$
   - Raw Difference: $3/10$ (irreducible, proper)
   - Scale Factors: left $\times 5$, right $\times 2$ ($\le 12$)
   - Profile Admission: Admitted under `curated-review` (0 rejection reasons)

2. **`plan40-construct-three-fourths-two-fifths-20`**
   - Minuend: `3/4`, Subtrahend: `2/5`
   - Target Denominator: `20` ($\text{LCD}(4,5) = 20$)
   - Selector: `relatively-prime-subtraction`, Overlays: `[]`
   - Fixture: Reuses Plan 03 golden fixture `curated-relatively-prime-subtraction` (`plan03-fixtures-v1`)
   - Renamed: $15/20 - 8/20$
   - Raw Difference: $7/20$ (irreducible, proper)
   - Scale Factors: left $\times 5$, right $\times 4$ ($\le 12$)
   - Profile Admission: Admitted under `curated-review` (0 rejection reasons)

3. **`plan40-construct-five-sixths-three-eighths-24`**
   - Minuend: `5/6`, Subtrahend: `3/8`
   - Target Denominator: `24` ($\text{LCD}(6,8) = 24$, $\gcd(6,8) = 2$)
   - Selector: `shared-factor-subtraction`, Overlays: `[]`
   - Fixture: Reuses Plan 03 golden fixture `curated-shared-factor-subtraction` (`plan03-fixtures-v1`)
   - Renamed: $20/24 - 9/24$
   - Raw Difference: $11/24$ (irreducible, proper)
   - Scale Factors: left $\times 4$, right $\times 3$ ($\le 12$)
   - Profile Admission: Admitted under `curated-review` (0 rejection reasons)

*Distinct target denominators for Recipe 1:* **`10`, `20`, `24`** (3 distinct target denominators).

---

#### Recipe 2: `unlike-subtraction.inspect-keep-repair`
Two-renaming problems with versioned authored candidate stimuli containing exactly one valid and one invalid candidate:

4. **`plan40-inspect-two-thirds-one-fourth-12`**
   - Minuend: `2/3`, Subtrahend: `1/4`
   - Target Denominator: `12` ($\text{LCD}(3,4) = 12$)
   - Selector: `relatively-prime-subtraction`, Overlays: `[]`
   - Renamed: $8/12 - 3/12$
   - Raw Difference: $5/12$ (irreducible, proper)
   - Candidate Stimulus: `plan40-stim-inspect-two-thirds-one-fourth-12@1`
     - Left candidate: `5/12` (**INVALID** — common learner error, true form is `8/12`)
     - Right candidate: `3/12` (**VALID** — $1/4 = 3/12$)
     - Invalid side: **`left`** (learner must repair left, keep right)
   - Profile Admission: Admitted under `curated-review` (0 rejection reasons)

5. **`plan40-inspect-seven-tenths-one-fourth-20`**
   - Minuend: `7/10`, Subtrahend: `1/4`
   - Target Denominator: `20` ($\text{LCD}(10,4) = 20$, $\gcd(10,4) = 2$)
   - Selector: `shared-factor-subtraction`, Overlays: `[]`
   - Renamed: $14/20 - 5/20$
   - Raw Difference: $9/20$ (irreducible, proper)
   - Candidate Stimulus: `plan40-stim-inspect-seven-tenths-one-fourth-20@1`
     - Left candidate: `14/20` (**VALID** — $7/10 = 14/20$)
     - Right candidate: `7/20` (**INVALID** — common learner error, true form is `5/20`)
     - Invalid side: **`right`** (learner must keep left, repair right)
   - Profile Admission: Admitted under `curated-review` (0 rejection reasons)

6. **`plan40-inspect-five-sixths-seven-tenths-30`**
   - Minuend: `5/6`, Subtrahend: `7/10`
   - Target Denominator: `30` ($\text{LCD}(6,10) = 30$, $\gcd(6,10) = 2$)
   - Selector: `shared-factor-subtraction`, Overlays: `['reducible-result']`
   - Renamed: $25/30 - 21/30$
   - Raw Difference: $4/30$ (**reducible** to $2/15$)
   - Candidate Stimulus: `plan40-stim-inspect-five-sixths-seven-tenths-30@1`
     - Left candidate: `22/30` (**INVALID** — true form is `25/30`)
     - Right candidate: `21/30` (**VALID** — $7/10 = 21/30$)
     - Invalid side: **`left`** (learner must repair left, keep right)
   - Profile Admission: Admitted under `curated-review` (0 rejection reasons)

*Distinct target denominators for Recipe 2:* **`12`, `20`, `30`** (3 distinct target denominators).  
*Candidate side balance:* 2 left-invalid (`5/12`, `22/30`) and 1 right-invalid (`7/20`).

---

#### Recipe 3: `unlike-subtraction.identify-side-construct`
Nested-denominator subtraction where exactly one fraction needs renaming. Exercises **both operand orders**:

7. **`plan40-identify-five-sixths-one-third-6`**
   - Minuend: `5/6`, Subtrahend: `1/3`
   - Denominators: $d_1 = 6, d_2 = 3$ ($6 = 3 \times 2$, nested)
   - Target Denominator: `6` (the minuend's denominator)
   - Required Renaming Side: **`right`** (subtrahend $1/3$ renamed to $2/6$)
   - Selector: `nested-denominator-subtraction`, Overlays: `['reducible-result']`
   - Fixture: Reuses Plan 03 golden fixture `curated-nested-subtraction-reducible` (`plan03-fixtures-v1`)
   - Renamed: $5/6 - 2/6$
   - Raw Difference: $3/6$ (**reducible** to $1/2$)
   - Profile Admission: Admitted under `curated-review` (0 rejection reasons)

8. **`plan40-identify-one-half-one-eighth-8`**
   - Minuend: `1/2`, Subtrahend: `1/8`
   - Denominators: $d_1 = 2, d_2 = 8$ ($8 = 2 \times 4$, nested)
   - Target Denominator: `8` (the subtrahend's denominator)
   - Required Renaming Side: **`left`** (minuend $1/2$ renamed to $4/8$)
   - Selector: `nested-denominator-subtraction`, Overlays: `[]`
   - Renamed: $4/8 - 1/8$
   - Raw Difference: $3/8$ (irreducible, proper)
   - Profile Admission: Admitted under `curated-review` (0 rejection reasons)

9. **`plan40-identify-two-thirds-five-twelfths-12`**
   - Minuend: `2/3`, Subtrahend: `5/12`
   - Denominators: $d_1 = 3, d_2 = 12$ ($12 = 3 \times 4$, nested)
   - Target Denominator: `12` (the subtrahend's denominator)
   - Required Renaming Side: **`left`** (minuend $2/3$ renamed to $8/12$)
   - Selector: `nested-denominator-subtraction`, Overlays: `['reducible-result']`
   - Renamed: $8/12 - 5/12$
   - Raw Difference: $3/12$ (**reducible** to $1/4$)
   - Profile Admission: Admitted under `curated-review` (0 rejection reasons)

*Distinct target denominators for Recipe 3:* **`6`, `8`, `12`** (3 distinct target denominators).  
*Operand order coverage:* Right-side renaming (Item 7) and Left-side renaming (Items 8 and 9).

---

### 4.2. Data-Only Holdouts (`plan40-data-only-holdouts@1`)

Two test-only data holdouts verify that the execution pipeline extends to new unreviewed data records without code modification:

1. **`plan40-holdout-construct-three-fifths-one-half-10`**
   - Minuend: `3/5`, Subtrahend: `1/2`
   - Target Denominator: `10`
   - Recipe: `unlike-subtraction.construct-equivalent`
   - Selector: `relatively-prime-subtraction`, Overlays: `[]`
   - Raw Difference: $6/10 - 5/10 = 1/10$ (irreducible)

2. **`plan40-holdout-inspect-three-fourths-one-sixth-12`**
   - Minuend: `3/4`, Subtrahend: `1/6`
   - Target Denominator: `12`
   - Recipe: `unlike-subtraction.inspect-keep-repair`
   - Selector: `shared-factor-subtraction`, Overlays: `[]`
   - Candidates: left `9/12` (valid), right `5/12` (invalid; true is `2/12`)
   - Raw Difference: $9/12 - 2/12 = 7/12$ (irreducible)

---

### 4.3. Profile Admission and Boundary Refusal Probe

The probe confirmed that `curated-review` completely and correctly governs unlike-denominator subtraction without requiring a dedicated new profile:
- `curated-review` sets `positiveResult: true` and `properOperands: true`.
- Positive proper differences ($a'/d - b'/d > 0$) pass all profile checks.
- When `overlays: []`, raw irreducible results match `defaultSimplificationStatus: 'already-simplified'`.
- When `overlays: ['reducible-result']`, raw reducible results match the overlay requirement.
- Representation limits (`PHASE2_FRACTION_BAR_LIMITS`): All target denominators ($6, 8, 10, 12, 20, 24, 30 \le 30$) and scale factors ($2, 3, 4, 5 \le 12$) are strictly within representation bounds.

**Falsification & Boundary Refusals Verified:**
1. **Negative Difference:** $1/5 - 1/2 = -3/10$ is refused (`negative-result` in facts, and `result-not-positive` in profile).
2. **Equal-Operands Zero Difference:** $2/4 - 1/2 = 0$ is refused under `curated-review` (`result-not-positive`).
3. **Invalid Common Denominator:** $1/2 - 1/5$ with target `15` is refused (`not-divisible-by-left-denominator`).
4. **Denominator Ceiling Exceeded:** Target denominator `36` ($> 30$) is refused (`denominator-ceiling-exceeded`).
5. **Inspect Stimulus Violation:** Candidate stimulus with 2 valid candidates is refused.

---

## 5. Renaming-to-Takeaway Transition & Interaction Architecture

### 5.1. Evaluation of the Renaming-to-Takeaway Transition

Plan 40 mandates evaluating whether entering `operate` requires an extra `"Take away"` button beat:

- **Option A (Extra Button Beat):**  
  After `transform` completes, present a button `"Take away"` before showing the takeaway bar and inputs.  
  *Critique:* In Plan 38, the problem was a 1-step task with only `encounter -> operate -> resolve`, so a `"Take away"` button served as the initial encounter acknowledgement. In Plan 40, the learner has already completed `encounter`, (optional) `select-renaming-side`, and one or two `transform` steps. Adding an extra button click after multi-step renaming creates unnecessary click friction and cognitive dead weight.

- **Option B (Recommended Direct Transition):**  
  Completing the final `transform` beat immediately advances the episode state into `operate`:
  - **Visual View:** Immediately displays the marked takeaway bar model (`takeawayBar` with `totalParts = targetDenominator`, `initialShadedParts = a'`, `removedParts = b'`, `remainingParts = a' - b'`, `removalStatus = 'marked'`) alongside the renamed operand summary. The learner directly sees the $b'$ parts hatched as removed from $a'$ on the common unit $d$.
  - **Linear View:** Prompts with `"How much is left?"` and milestone copy `"${b'}/${d} is taken away from ${a'}/${d}."` (during `operate` only, omitted at `resolve`).
  - **Focus:** Automatically focuses `#operate-fraction-numerator-input`.
  - **Schedule:** Preserves the clean 5-beat schedule (`encounter -> transform-left -> transform-right -> operate -> resolve` or `encounter -> select-renaming-side -> transform-<side> -> operate -> resolve`).

**Verdict: Adopt Option B (Direct Transition).**

### 5.2. Beat Schedules

The beat schedules registered in `src/interaction/beat-schedule.js` and `src/interaction/episode-definition.js` under `phase-3-reusable-subtraction-recipes@1`:

- **`unlike-subtraction.construct-equivalent`:**  
  `['encounter', 'transform-left', 'transform-right', 'operate', 'resolve']`
- **`unlike-subtraction.inspect-keep-repair`:**  
  `['encounter', 'transform-left', 'transform-right', 'operate', 'resolve']`
- **`unlike-subtraction.identify-side-construct`:**  
  `['encounter', 'select-renaming-side', 'transform-<requiredSide>', 'operate', 'resolve']`  
  where `<requiredSide>` is dynamically determined by the record (`left` or `right`).

### 5.3. Scene Projection & Information Hiding

In `src/interaction/scene.js`:
- During `encounter`, `decide`, and `transform`:
  - `scene.meaning.operation.kind = 'subtract'`;
  - Projects two fraction bars (`left` and `right`) and renaming state.
- At `operate`:
  - Projects `takeawayBar` with:
    ```javascript
    takeawayBar: {
      totalParts: targetDenominator,
      initialShadedParts: leftAtTarget.numerator,
      removedParts: rightAtTarget.numerator,
      remainingParts: rawDifference.numerator,
      removalStatus: 'marked',
    }
    ```
  - `rawResult`, `preferredFinalForm`, and answer labels are **strictly withheld** prior to `resolve`.
  - Local help is available: `"Count only the shaded parts without removal marks."` in Visual view; concise renamed-unit takeaway cue in Linear view.
- At `resolve`:
  - Displays completed equation using the learner's accepted `submittedForm`.
  - Displays prompt `"${submitted.numerator}/${submitted.denominator} is left."` with `Finish` / `Next problem` action.
  - Linear view omits the redundant `"is taken away from"` cue and shows only `"${submitted.numerator}/${submitted.denominator} is left."`.

### 5.4. Replay Schema v6 (`fractionflow.episode-replay/v6`)

`src/interaction/replay.js` will register `REPLAY_V6_SCHEMA_VERSION = 'fractionflow.episode-replay/v6'`:
- Serializes `phase-3-reusable-subtraction-recipes@1` episodes including learner intents (`acknowledge-encounter`, `select-renaming-side`, `submit-equivalent-form`, `keep-inspected-form`, `repair-inspected-form`, `request-task-help`, `submit-operation-result`, `finish-compact-episode`).
- Replay envelopes for historical definitions (`v1`–`v5`) remain completely unchanged and are guarded by frozen oracle tests (`plan35-v4-replay-oracles.json` and `plan38-v5-replay-oracles.json`).

---

## 6. Staged Implementation Plan & Stop Conditions

Execution will proceed across 6 distinct stages with explicit checkpoint gates:

### Stage 1 (Requirement 1): Curated Records, Recipe Task, and Data-Only Holdouts
- Author `src/content/data/plan40-subtraction-recipe-records.js` containing `PLAN40_SUBTRACTION_RECIPE_RECORDS`, fixtures, practice set, and holdout set.
- Implement `src/content/plan40-subtraction-recipe-task.js` (`validatePlan40SubtractionRecipeRecord`, `resolvePlan40SubtractionRecipeContext`).
- Register fixtures in `src/content/authored-problem-materializer.js` and `src/content/authored-content-catalog.js`.
- Prove data-only holdouts execute end-to-end through shared code with zero per-item branches.

### Stage 2 (Requirement 2): Episode State Machine, Scene Projection, and Replay v6
- Register `phase-3-reusable-subtraction-recipes@1` in `src/interaction/episode-definition.js` and `src/interaction/beat-schedule.js`.
- Wire `encounter`, `decide`, `transform`, and `operate` in `src/interaction/episode.js`.
- Implement `takeawayBar` projection at `operate` and `resolve` in `src/interaction/scene.js`.
- Implement Replay v6 in `src/interaction/replay.js`.
- Write unit tests in `tests/plan40-subtraction-recipes.test.js` validating all items, holdouts, and replay oracles.
- **CHECKPOINT 1 STOP GATE:** Commit Stages 1–2 artifacts and stop for orchestrator checkpoint review before modifying renderers or app code.

### Stage 3 (Requirement 3): Visual & Linear Renderers and App Integration
- Update `src/render/beat-container.js`, `src/render/linear-path.js`, and `src/render/strings.js` for subtraction wording (`"−"`, `"is taken away from"`, `"is left"`, takeaway help).
- Register `unlike-denominator-subtraction` in `src/app/practice-types.js` (`PLAN40_PRACTICE_TYPES_V9`).
- Wire view switching, draft preservation, and error recovery in `src/app/index.js`.
- Write mounted tests in `tests/plan40-rendered-subtraction.test.js`.
- Run bounded headless browser check at 360px and 1366px.
- **CHECKPOINT 2 STOP GATE:** Commit Stage 3 artifacts and stop for orchestrator checkpoint review before route-matrix additions.

### Stage 4 (Requirement 4): Browser Route Matrix, Witness Seeds, Evidence, and Roadmap §31/§90 Summary
- Append Plan 40 routes to `tests/routes/route-matrix.json` and `tests/routes/plan34-context-map.json`.
- Implement 4 witness seeds in `scripts/dev/run-route-matrix.js`:
  1. `erased-takeaway-hatch-after-transform`
  2. `addition-wording-in-subtraction`
  3. `premature-difference-leak`
  4. `missing-operate-fraction-inputs`
- Capture responsive screenshots and viewport measurements (`withinViewport: true`).
- Restore any touched historical evidence files.
- Produce final progress report at `reports/development/plan-40-unlike-denominator-subtraction-batch/progress.md` with **Roadmap §31 / §90 Phase 3 Exit Assessment**.

---

## 7. Artifact Checklist for Requirement 0 Gate

- [x] Baseline git commit SHA recorded: `c4b070ec1291f8633044e8274e0287e28ffaaf39`.
- [x] Baseline test suites verified: `npm test` (47 files / 439 tests) and `npm run test:routes` (73 rows / 75 executions).
- [x] Baseline Plan 38 Replay v5 oracles frozen: `tests/fixtures/plan38-v5-replay-oracles.json`.
- [x] Mathematical probe executed and results persisted: `requirement-0-probe.mjs` and `requirement-0-probe-results.json`.
- [x] Curated 9-item batch and 2 holdouts fully specified with $\ge 3$ distinct target denominators per recipe, both operand orders in `nested-denominator-subtraction`, both relatively-prime and shared-factor, and left/right invalid candidate balance.
- [x] Direct transition into `operate` with marked takeaway bar and focused fraction input specified.
- [x] Exact identities, record shapes, and `taskContext` keys specified.
- [x] Zero files modified under `src/`.
- [x] Advisor consultation branch declared: Branch C (not advisor-capable / orchestrator-gate-only review).

**Implementer thread stops here at the Requirement 0 gate for orchestrator review and approval.**

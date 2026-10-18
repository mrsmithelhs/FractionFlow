# Plan 38 Requirement 0 Mechanism Disposition — 2026-10-18

Orchestration approves the aligned mechanism and batch in
`requirement-0-proposal.md`, subject to the contract corrections and staged
checkpoint boundaries below. This is technical mechanism approval under Plan 38
Requirement 0, not owner rendered-screen acceptance or deployment authority.

## Independent Verification Performed

- Ran `node scripts/dev/plan-status.js lint` and `node scripts/dev/plan-status.js check plan-38`: both exit 0 (`RUNNABLE`).
- Independently executed `reports/development/plan-38-like-denominator-subtraction-batch/requirement-0-probe.mjs` and `capture-plan35-v4-oracles.mjs`: both reproduced `requirement-0-probe-results.json` (8 records + 5 boundary refusals) and `tests/fixtures/plan35-v4-replay-oracles.json` (8 initial/completed v4 replay cases across construct, inspect, and both identify orders) with zero diff against commit `bc46116`.
- Inspected `src/` working tree: confirmed zero `src/` files were mutated prior to gate approval.
- Reviewed Advisor Consultation declaration in `progress.md`: Branch C (fail-closed under `advisor-capable-providers.json`, orchestrator-gate-only review) is compliant.

## Inline Contract Corrections Applied to `requirement-0-proposal.md`

During review against `DECISION-045` and the adopted Plan 36 dossier (`design-contract.md`, `annotated-flow.md`, `implementation-and-validation.md`), orchestration identified five contract gaps in the initial proposal and corrected them inline in `requirement-0-proposal.md`:

1. **Answer Intent Identity:** The proposal originally named `submit-subtraction-difference`. Plan 36 (`implementation-and-validation.md` §§1–3) pins `submit-subtraction-result` (`{ type: 'submit-subtraction-result', proposed }`). All reducer, task-data, and Replay v5 intent checks must use `submit-subtraction-result`.
2. **Exact Record, Set, Task-Data, and `taskContext` Keys:**
   - Authored numerical records carry only `itemId`, `fixtureId`, `authoringRevision`, `recipe`, `taskData`, `leftNumerator`, `rightNumerator`, `denominator` (no authored answers or remainder counts).
   - `taskContext` carries the exact 12 keys from `implementation-and-validation.md`: `practiceSetId`, `practiceSetRevision`, `itemId`, `fixtureId`, `authoringRevision`, `definitionId`, `definitionRevision`, `recipeId`, `recipeRevision`, `taskDataId`, `taskDataRevision`, `sourceForms` (using `recipeId`/`recipeRevision`, not `patternId`).
3. **Scoped Content Profile for Curated Subtraction (`plan36-subtraction-review`):**
   - `requirement-0-probe.mjs` probed `src/math/` directly but did not pass the 8 records through `buildCuratedProblem` / `validateProblemInstance`.
   - Under `src/content/profiles.js` and `src/content/generator.js`, `'curated-review'` currently enforces `positiveResult: true` (which rejects `6/9 - 6/9 = 0/9`), `defaultSimplificationStatus: 'already-simplified'` (which rejects reducible differences `4/10`, `6/8`, and `0/9` when `overlays: []`), and omits `9n` and `11n` from `denominatorPool`.
   - To avoid shifting `phase1-dev-default` or `curated-review` candidate spaces for addition, Stage 1 will register a dedicated `'plan36-subtraction-review'` profile (version `'1'`) admitting denominators `2n..12n`, nonnegative results (`positiveResult: false`, bounded by `like-denominator-subtraction`'s `nonnegative-result` structural predicate), and `defaultSimplificationStatus: 'any'` when `overlays` is `[]`.
4. **Scene, Provenance, and Beat-Container Ownership:**
   - Added explicit symbol ownership for `src/interaction/provenance.js` (`grouped-removal-triggered` vs `learner-supplied-result`) and `src/render/beat-container.js` (single stable-whole bar, `grouped-removal-action` button, accessible `Amount left` response group, and completed-beat summary rules).
   - Pinned the exact adopted learner copy from `design-contract.md` and `annotated-flow.md` and explicit pre-resolution result-leakage guards (`rawResult`, `simplifiedResult`, `preferredFinalForm`, `acceptedResponseForm`, and `wholeSpan` withheld before `resolve`; learner's exact `submittedForm` displayed at `resolve`).
5. **Requirement 5 Staged Review Checkpoints:**
   - Aligned Section 9 with Requirement 5's mandatory stops:
     - **Checkpoint 1 (Stages 1–3):** Pure content/admission, state/schedule/reducer, scene/provenance, Replay v5, and unit tests. Stop for orchestrator review before modifying `src/render/`, `src/styles/`, or `src/app/`.
     - **Checkpoint 2 (Stages 4–5):** Render components, scoped CSS, and app/goal integration + rendered unit tests. Stop for orchestrator review before route matrix expansion and browser capture.
     - **Checkpoint 3 (Stage 6):** Route matrix expansion, visual/leak/semantic falsification seeds, viewport/zoom evidence captures, restoration of historical regression-run outputs, and final delivery report.

## Working-Tree Hygiene Note

Running `npm run test:routes` during preflight modified 9 historical evidence files under `reports/development/plan-18-nested-denominator-addition/evidence/`, `reports/development/plan-34-reusable-full-addition-task-patterns/evidence/`, and `reports/development/plan-35-reusable-task-recipes-and-authored-batch/plan35-route-matrix-summary.json`. Per commit discipline, orchestration has left those working-tree files untouched; the implementer should restore those 9 known historical generated files by explicit path (`git checkout -- <explicit-paths>`) so only Plan 38 paths are dirtied and committed.

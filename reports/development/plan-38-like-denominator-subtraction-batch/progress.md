# Plan 38: Like-Denominator Takeaway Subtraction Batch
## Progress Report: Checkpoint 2 (Stages 4–5: Render Components, Scoped CSS, & App Integration)

**Date:** 2026-10-18  
**Author:** Implementer Thread (Plan 38)  
**Status:** Paused at Checkpoint 2 Review Gate (Awaiting Orchestrator Approval)  
**Head Commit at Authorization:** `98c61e3` (Checkpoint 1: Pure Foundation)  

---

## 1. Executive Summary

This progress report records the implementation and verification of **Checkpoint 2 (Stages 4–5: Render Components, Scoped CSS, and App Integration)** for Plan 38, following the approval of Checkpoint 1 (`98c61e3`).

All user-interface components, localized instructional strings, scoped CSS styles, and application composition have been implemented strictly according to the approved Plan 36 design contract and the orchestrator's Checkpoint 1 review requirements:

- **Four Checkpoint 1 Review Refinements Applied:**
  1. Fixed prose discrepancy in `progress.md` to reference the 8 actual item IDs (`takeaway-8-5-minus-2`, `takeaway-12-8-minus-3`, `takeaway-10-7-minus-3`, `takeaway-11-9-minus-4`, `takeaway-9-6-minus-1`, `takeaway-9-6-minus-6`, `takeaway-6-5-minus-4`, `takeaway-8-7-minus-1`) and exported symbols (`PLAN36_SUBTRACTION_PRACTICE_SET`, `resolvePlan36LikeDenominatorSubtractionContext`, etc.).
  2. Maintained explicit distinction between `rawResultForm` (canonical unreduced difference) and `submittedForm` (learner's exact response) in `handleSubmitSubtractionResult` (`src/interaction/episode.js`).
  3. Enforced rejection of legacy `request-help` intent on Plan 36 episodes with `EpisodeIntentError('UNEXPECTED_INTENT')`.
  4. Re-exported Plan 36 content modules in `src/content/index.js`.
- **Stage 4 — Render Components & Scoped CSS:**
  - Added localized strings in `src/render/strings.js` under `subtraction` group.
  - Enhanced `createFractionResponseInput` in `src/render/controls.js` to support accessible group labelling (`amountLeftGroup`), custom numerator/denominator labels, zero-numerator input validation (`/^(0|[1-9][0-9]*)$/`), and initial values.
  - Implemented `createTakeawayBar` in `src/render/fraction-bar.js` rendering a stable unit whole partitioned into `wholePartitionCount` equal cells with roles `'starting'`, `'remaining'`, `'removed'` (visibly hatched), and `'outside-start'`. No remainder or result is leaked before resolution.
  - Added scoped CSS in `src/styles/render.css` for takeaway track, hatched removed segments, and fieldset resets.
  - Wired `createBeatContainer` (`src/render/beat-container.js`) and `createLinearPathRenderer` (`src/render/linear-path.js`) for takeaway visual and linear paths across encounter, operate, and resolve beats.
- **Stage 5 — App Integration & Focus Choreography:**
  - Registered `PLAN36_SUBTRACTION_PRACTICE_TYPE` in `src/app/practice-types.js` (`like-denominator-subtraction`, `like-denominator-subtraction-vetted-set@1`, with all 8 vetted items).
  - Wired `src/app/app.js` for initial state, canonical instance validation, draft capture/restore across view toggles, help toggling, focus choreography, and replay control hiding.
- **Unit & Integration Verification:**
  - Authored comprehensive test suite `tests/plan38-rendered-subtraction.test.js` (22 tests) covering all 8 records in both views, zero difference (`6/9 - 6/9`), reducible difference (`7/10 - 3/10`), draft preservation, help toggle workflows, and 8-item sequence progression.
  - All 47 test files (438 tests) pass with 0 failures.
  - Vite production builds succeed with 0 errors.
  - `node scripts/dev/plan-status.js lint` passes with 0 violations.
- In strict adherence to the Checkpoint 2 boundary constraints:
  - **`tests/routes/route-matrix.json` and Stage 6 browser captures have NOT been modified or executed.**
  - The thread is stopped awaiting Orchestrator Checkpoint 2 Review.

---

## 2. Implemented Stages

### Checkpoint 1 Review Refinements (Commit Preparation)
1. **`progress.md` Discrepancy Corrected:**
   - Corrected item IDs to match the 8 actual records and exported function names (`PLAN36_SUBTRACTION_PRACTICE_SET`, `resolvePlan36LikeDenominatorSubtractionContext`, `validatePlan36LikeDenominatorSubtractionContext`, `validatePlan36LikeDenominatorSubtractionRecord`).
2. **`rawResultForm` vs `submittedForm` in `src/interaction/episode.js`:**
   - `handleSubmitSubtractionResult` now sets both `rawResultForm: state.content.resultState.canonicalRawResultForm` and `submittedForm: intent.proposed` in `successClassification` and `established.operation`.
   - Verified via unit test assertions for reducible differences (`7/10 - 3/10` yields raw `4/10` and submitted `2/5`) and zero differences (`6/9 - 6/9` yields raw `0/9` and submitted `0/1`).
3. **Legacy `request-help` Rejection in `src/interaction/episode.js`:**
   - `assertIntentAllowedAtBeat` rejects `request-help` with `EpisodeIntentError('UNEXPECTED_INTENT')` when `isPlan36` is true, enforcing the Replay v5 intent set.
4. **Content Module Re-exports in `src/content/index.js`:**
   - Added re-exports of `plan36-like-denominator-subtraction-records.js` and `plan36-like-denominator-takeaway-task.js`.

### Stage 4: Render Components & Scoped CSS
1. **Instructional Strings (`src/render/strings.js`):**
   - Added `strings.subtraction` group:
     - `takeAwayButton`: `'Take away'`
     - `howMuchLeft`: `'How much is left?'`
     - `amountLeftGroup`: `'Amount left'`
     - `numeratorLabel`: `'Numerator of amount left'`
     - `denominatorLabel`: `'Denominator of amount left'`
     - `thatAmountLeft`: `'That amount is left.'`
     - `errorRecovery`: `'Check the parts left. Try again.'`
     - `visualHelp`: `'Count only the shaded parts without removal marks.'`
     - `linearHelp`: `'The second fraction is the amount taken away. Use the starting amount to work out what remains.'`
2. **Response Controls (`src/render/controls.js`):**
   - Enhanced `createFractionResponseInput` with:
     - `groupLabel`: wraps inputs in `<fieldset role="group" aria-label="..."><legend class="sr-only">...</legend>`
     - `numeratorLabel` / `denominatorLabel`: accessible field labels
     - `allowZeroNumerator: true`: permits numerator `"0"` (`/^(0|[1-9][0-9]*)$/`, input `min = '0'`)
     - `initialNumerator` / `initialDenominator`: supports restoring entered values on wrong-answer remounts
     - DOM child construction using `appendChild` for full compatibility with mock-dom test harnesses.
3. **Takeaway Fraction Bar (`src/render/fraction-bar.js`):**
   - Created `createTakeawayBar(takeawayMeaning, { mode })`:
     - Renders a single unit whole partitioned into `wholePartitionCount` equal cells.
     - Encounter beat (`unmarked`): `starting` cells shaded, `outside-start` cells unshaded. Accessible description: `Fraction bar: ${leftNum} of ${den} equal parts shaded in 1 whole.`
     - Operate beat (`marked`): `remaining` cells shaded, `removed` cells shaded and hatched (`is-removed`), `outside-start` cells unshaded. Accessible description: `Fraction bar: ${leftNum} of ${den} equal parts started, ${rightNum} marked for removal.`
     - Zero mathematical derivation; displays purely what is projected by `takeawayMeaning`. No numeric remainder or answer leaked before resolve.
4. **Scoped Styles (`src/styles/render.css`):**
   - Added `.control-fraction-response-wrapper` fieldset styling and screen-reader legend.
   - Added `.fraction-bar-takeaway-container` and `.fraction-bar-takeaway-track` layout.
   - Added `.fraction-bar-segment.removed`, `.fraction-bar-segment.is-removed` hatching pattern using CSS `repeating-linear-gradient`.
   - Disabled transitions on `.fraction-bar-takeaway-track .fraction-bar-segment` to prevent visual animation glitches.
5. **Visual Beat Container (`src/render/beat-container.js`):**
   - Mounted `createTakeawayBar` in `renderVisualSection` when `scene.meaning.takeaway` is present.
   - Encounter: prompts `"How much is left?"`, mounts `"Take away"` button dispatching `mark-subtrahend-amount`.
   - Operate: prompts `"How much is left?"`, mounts task help cue if open, mounts error recovery feedback if present, mounts `createFractionResponseInput` with `allowZeroNumerator: true`.
   - Resolve: prompts `"That amount is left."`, mounts `"Finish"` button dispatching `finish-compact-episode`.
   - Completed beats: summarizes encounter done and final difference.
6. **Linear Path Renderer (`src/render/linear-path.js`):**
   - Context: renders symbolic expression `${leftNum}/${den} − ${rightNum}/${den}` (and `= ${acceptedNum}/${acceptedDen}` at resolve).
   - Encounter: prompts `"How much is left?"`, mounts `"Take away"` button dispatching `mark-subtrahend-amount`.
   - Operate: prompts `"How much is left?"`, mounts linear task help cue if open (`strings.subtraction.linearHelp`), mounts error recovery feedback if present, mounts `createFractionResponseInput` for linear view.
   - Resolve: prompts `"That amount is left."`, mounts `"Finish"` button.

### Stage 5: App Integration & Focus Choreography
1. **Practice Type Registration (`src/app/practice-types.js`):**
   - Registered `PLAN36_SUBTRACTION_PRACTICE_TYPE`:
     - `id: 'like-denominator-subtraction'`
     - `label: 'Subtract fractions with the same denominator'`
     - `setId: 'like-denominator-subtraction-vetted-set'`
     - `setRevision: '1'`
     - 8 ordered items from `PLAN36_SUBTRACTION_RECORDS`
     - `episodeDefinition: PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION`
   - Exported `PLAN38_PRACTICE_TYPES_V8 = deepFreeze([...PLAN35_PRACTICE_TYPES_V7, PLAN36_SUBTRACTION_PRACTICE_TYPE])` and updated `PRACTICE_TYPES = PLAN38_PRACTICE_TYPES_V8`.
2. **App Orchestration (`src/app/app.js`):**
   - `canonicalInstance`: validates Plan 36 subtraction items via `resolvePlan36LikeDenominatorSubtractionContext`.
   - `createInitialState`: resolves 12-key task context for Plan 36 subtraction items.
   - `getVisibleOperationInput`: returns `#operate-fraction-numerator-input` / `#linear-operate-fraction-numerator-input` for subtraction episodes.
   - `captureOperationDraft` / `restoreOperationDraft`: captures both numerator and denominator drafts and restores them across view toggles and re-renders.
   - `updateSupportControls`: keeps Replay button hidden and disabled throughout Plan 36 subtraction episodes (`isPlan36`).
   - `updateHelpPlacement`: manages `subtractionHelpOpen` toggle, aria-expanded, aria-controls pointing to visual or linear help cue.
   - `dispatchAction`:
     - Focuses numerator input on `mark-subtrahend-amount` and on `submit-subtraction-result` recovery.
     - Keeps `subtractionHelpOpen` open across wrong submissions.
     - Focuses `helpButton` on closing help.
     - Focuses "Finish" button on correct submission (`resolve` beat).
     - Focuses "Next problem" button (or exhaustion notice on item 8) on resolution (`finish-compact-episode`).
   - `installFreshEpisode`: focuses "Take away" button on initial entry, Next, return, and retry.
   - `viewToggle`: preserves "Take away" button focus when switching between visual and linear views at encounter.

---

## 3. Verification & Validation Summary

| Test / Check Command | Scope | Result | Details |
|---|---|---|---|
| `npm test -- tests/plan38-content-subtraction.test.js` | Content & fixtures | **Passed** | 7 tests passed (all 8 records, boundary refusals) |
| `npm test -- tests/interaction-plan38-subtraction.test.js` | State, scene, replay v5 | **Passed** | 7 tests passed (lifecycle, scene withholding, raw vs submitted form) |
| `npm test -- tests/plan38-rendered-subtraction.test.js` | Mounted visual/linear journeys & app integration | **Passed** | 22 tests passed (all 8 records in both views, zero diff, reducible diff, draft preservation, focus, 8-item sequence) |
| `cmd.exe /d /s /c "npm test"` | Entire repository test suite | **Passed** | 47 test files passed, 438 tests passed, 0 failures |
| `cmd.exe /d /s /c "npm run build"` | Vite production build | **Passed** | Built client bundle (325 kB js / 20.7 kB css) and subtraction prototype with 0 errors |
| `node scripts/dev/plan-status.js lint` | Packet status & schema | **Passed** | Lint OK, 0 violations |
| `node scripts/dev/plan-status.js check plan-38` | Packet readiness check | **Passed** | RUNNABLE |

---

## 4. Checkpoint 2 Boundary Audit

The implementer audited the working tree against the authorized Checkpoint 2 scope:
- **Modified files:**
  - `reports/development/plan-38-like-denominator-subtraction-batch/progress.md`
  - `src/app/app.js`
  - `src/app/practice-types.js`
  - `src/content/index.js`
  - `src/interaction/episode.js`
  - `src/render/beat-container.js`
  - `src/render/controls.js`
  - `src/render/fraction-bar.js`
  - `src/render/index.js`
  - `src/render/linear-path.js`
  - `src/render/strings.js`
  - `src/styles/render.css`
  - `tests/interaction-plan38-subtraction.test.js`
- **New authored test file:**
  - `tests/plan38-rendered-subtraction.test.js`
- **Boundary checks:**
  - `tests/routes/route-matrix.json`: **Untouched (0 lines changed)**
  - Stage 6 browser captures: **Not executed**
  - Plan 37 files: **Untouched (isolated)**
  - `docs/development/README.md`: **Untouched (no lock contention)**

---

## 5. Advisor Consultation Disposition

**Branch C — not advisor-capable (fail-closed, orchestrator-gate-only review)**

- **Step 1 Capability Check:** In accordance with the Implementer Starting Prompt and `AGENTS.md` subagent discipline, this thread consulted `advisor-capable-providers.json`. The current execution environment (Antigravity / Gemini) is not listed in `advisor-capable-providers.json` as an advisor-capable provider. Under the required fail-closed rule, this thread treats itself as not advisor-capable.
- **Mode Selected:** Branch C (orchestrator-gate-only review).
- **Declaration:** No autonomous advisor consultation ran for Checkpoint 2. The standard orchestrator gate applies to this deliverable.

---

## 6. Stop Condition & Handoff

The implementer has reached the **Checkpoint 2 Stop Gate**. All Stage 4 and Stage 5 deliverables are complete, verified with 22 comprehensive rendered DOM tests, and confirmed regression-free across the full test suite and production build.

Work is now halted for **Orchestrator Checkpoint 2 Review** before proceeding to Stage 6 (browser captures and route-matrix extension).

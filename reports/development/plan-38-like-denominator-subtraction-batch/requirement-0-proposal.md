# Requirement 0 Investigation and Mechanism Proposal
## Plan 38: Like-Denominator Takeaway Subtraction Batch

**Date:** 2026-10-18  
**Author:** Implementer Thread (Plan 38)  
**Status:** Submitted for Orchestrator Review and Approval (Mechanism Stop)  
**Baseline Git Head:** `982bb8f52ad4274f35ae71edc8234adeed87fc22`

---

## 1. Executive Summary & Purpose

Plan 38 integrates the adopted Plan 36 like-denominator takeaway subtraction task as a learner-reachable practice goal:
- **Practice Goal ID:** `like-denominator-subtraction`
- **Goal Label:** `Subtract fractions with the same denominator`
- **Authored Records:** 8 curated compact subtraction problems (items `takeaway-8-5-minus-2` through `takeaway-8-7-minus-1`).
- **Pedagogy / Contract:** Enforces DECISION-045 and the Plan 36 design contract (`reports/development/plan-36-learner-subtraction-integration-design/design-contract.md`).

In strict accordance with **Requirement 0** of Plan 38:
> *"Before source, persist proposal/checkpoint in this packet's report folder. Confirm exact data/context identities; content admission including unreduced operands and zero; action/state/scene ownership; help/draft/focus; v5 fields/intents and old guards; goal reach and discriminating browser evidence. Map precise files/symbols and staged commits. Freeze representative initial/completed old replay oracles before shared dispatch changes. Record route/context baseline. Stop for orchestration approval."*

This proposal documents the complete architectural verification, baseline freezing, exact symbol mapping, and implementation staging. **No files under `src/` have been modified.** Execution stops at this gate until orchestration approval is received.

---

## 2. Baseline Verification

Before authoring any proposal artifacts, the existing repository state was exhaustively verified:

| Check | Command | Result |
|---|---|---|
| **Packet check** | `node scripts/dev/plan-status.js check plan-38-like-denominator-subtraction-batch` | Exit 0 (`RUNNABLE: plan-38 is ready to implement`) |
| **Packet lint** | `node scripts/dev/plan-status.js lint` | Exit 0 (all packets pass schema lint) |
| **Unit & integration test baseline** | `cmd.exe /d /s /c "npm test"` | 44 test files passed, 402 tests passed |
| **Route matrix baseline** | `cmd.exe /d /s /c "npm run test:routes"` | 65 rows, 67 executions passed |
| **Production build baseline** | `cmd.exe /d /s /c "npm run build"` | Clean build: 0 errors |
| **Working tree integrity** | `git status` | Clean working tree; no uncommitted changes to shared source files |

---

## 3. Exact Identities & Registrations

All design-origin identities established in Plan 36 and DECISION-045 are preserved verbatim:

| Dimension | Canonical Identity |
|---|---|
| **Recipe ID** | `plan36.like-denominator-takeaway@1` (`recipeId: 'plan36.like-denominator-takeaway'`, `recipeRevision: '1'`) |
| **Episode Definition ID** | `phase-3-like-denominator-takeaway-subtraction`, revision `1` (`phase-3-like-denominator-takeaway-subtraction@1`) |
| **Task Data ID** | `plan36-like-denominator-takeaway`, revision `1` (`plan36-like-denominator-takeaway@1`) |
| **Practice Set ID** | `like-denominator-subtraction-vetted-set`, revision `1` (`like-denominator-subtraction-vetted-set@1`) |
| **Authoring Revision** | `plan36-record-v1` |
| **Practice Type / Goal ID** | `like-denominator-subtraction` |
| **Goal Label** | `Subtract fractions with the same denominator` |
| **Fixture IDs** | `curated-plan36-${itemId}` |
| **Profile ID** | `plan36-subtraction-review` (version `1`, scoped curated profile preserving `phase1-dev-default` and `curated-review` unchanged) |
| **Replay Schema Version** | `fractionflow.episode-replay/v5` |

### 3.1. Exact Record, Set, Task-Data, and `taskContext` Shapes
- **Authored Numerical Record (`PLAN36_SUBTRACTION_RECORDS`):**
  Exact keys: `itemId`, `fixtureId`, `authoringRevision`, `recipe` (`{ id: 'plan36.like-denominator-takeaway', revision: '1' }`), `taskData` (`{ id: 'plan36-like-denominator-takeaway', revision: '1' }`), `leftNumerator`, `rightNumerator`, `denominator`. No expected answer, remainder count, or renderer state is authored.
- **Fixed Practice Set Record (`PLAN36_SUBTRACTION_PRACTICE_SET`):**
  Exact keys: `id`, `revision`, `itemIds` (the 8 item IDs in exact adopted order), `recipe`, `definition`, `taskData`.
- **Task-Data Record (`PLAN36_SUBTRACTION_TASK_DATA`):**
  Exact keys: `id`, `revision`, `recipe`, `definition`, `schedule` (`['encounter', 'operate', 'resolve']`), `operationActionIntent` (`'mark-subtrahend-amount'`), `answerIntent` (`'submit-subtraction-result'`), `responsePolicyId` (`'exact-equivalent-fraction-v1'`), and shared prompt/label identifiers.
- **Validated `taskContext` Record:**
  Exact keys:
  ```text
  practiceSetId, practiceSetRevision,
  itemId, fixtureId, authoringRevision,
  definitionId, definitionRevision,
  recipeId, recipeRevision,
  taskDataId, taskDataRevision,
  sourceForms: { left, right }
  ```

---

## 4. Content Admission, Arithmetic Derivation, & Zero Boundary

### 4.1. The 8 Authored Records
All 8 records have been verified via `reports/development/plan-38-like-denominator-subtraction-batch/requirement-0-probe.mjs` against `src/math/`:

| Item ID | Minuend | Subtrahend | Raw Difference | Simplified | Role / Pedagogical Intent |
|---|---|---|---|---|---|
| `takeaway-8-5-minus-2` | 5/8 | 2/8 | 3/8 | 3/8 | Moderate positive remainder |
| `takeaway-12-8-minus-3` | 8/12 | 3/12 | 5/12 | 5/12 | Positive irreducible raw difference |
| `takeaway-10-7-minus-3` | 7/10 | 3/10 | 4/10 | 2/5 | Positive reducible raw difference |
| `takeaway-11-9-minus-4` | 9/11 | 4/11 | 5/11 | 5/11 | Positive irreducible raw difference |
| `takeaway-9-6-minus-1` | 6/9 | 1/9 | 5/9 | 5/9 | Large positive remainder (unreduced minuend) |
| `takeaway-9-6-minus-6` | 6/9 | 6/9 | 0/9 | 0/1 | Equal-operands zero boundary |
| `takeaway-6-5-minus-4` | 5/6 | 4/6 | 1/6 | 1/6 | One-part positive remainder |
| `takeaway-8-7-minus-1` | 7/8 | 1/8 | 6/8 | 3/4 | Near-whole positive remainder (reducible difference) |

### 4.2. Mathematical Invariants & Content Profile Admission
- **Domain:** Positive proper fractions only ($0 < n < d$) for both operands, with common denominator $d_1 = d_2 = d$ and $0 < n_2 \le n_1 < d$.
- **Content Profile (`plan36-subtraction-review`):**
  - Existing `phase1-dev-default` and `curated-review` profiles remain untouched so addition candidate spaces and historical fixtures cannot shift.
  - Because `like-denominator-subtraction` episodes pin `overlays: []` while the 8-item batch includes denominators `9` and `11`, reducible raw differences (`4/10`, `6/8`), and equal-operands zero (`6/9 - 6/9 = 0/9`, where `classifyFractionResult` reports `resultForm: 'zero'` and `simplificationStatus: 'reducible'`), `src/content/profiles.js` registers a scoped profile `'plan36-subtraction-review'` (`denominatorPool: [2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n]`, `properOperands: true`, `simplestOperands: false`, `allowZeroOperands: false`, `positiveResult: false`, `defaultSimplificationStatus: 'any'`).
  - In `src/content/generator.js` (`profileRejectionReasons`), when `profile.defaultSimplificationStatus === 'any'` and `overlays` is empty, both `'already-simplified'` and `'reducible'` results are admitted; structural membership on `like-denominator-subtraction` continues to enforce `nonnegative-result: true` ($n_1 \ge n_2$).
- **Zero Result:** When $n_1 = n_2$ (item `takeaway-9-6-minus-6`), the difference is 0. Both $0/9$ and $0/1$ (or any exact zero fraction) are admitted by `validateOperationResult(proposed, left, right, 'subtract')`.
- **Rejection Cases (tested in probe and Stage 1 unit tests):**
  - Negative difference ($n_1 < n_2$) $\to$ Refused.
  - Improper left operand ($n_1 \ge d$) or right operand ($n_2 \ge d$) $\to$ Refused.
  - Zero minuend ($n_1 = 0$) or zero subtrahend ($n_2 = 0$) $\to$ Refused.
  - Unequal denominators, unregistered IDs, or malformed wire data $\to$ Refused.

### 4.3. Partition Geometry & Cell Roles
For any item with minuend $n_1/d$ and subtrahend $n_2/d$:
- Total cells: $d$ (whole width and partition count preserved on one single stable whole bar).
- At `encounter` (`removalStatus: 'unmarked'`):
  - Cells $0$ to $n_1 - 1$ have role `'starting'`.
  - Cells $n_1$ to $d - 1$ have role `'outside-start'`.
- At `operate` and `resolve` (`removalStatus: 'marked'` after `mark-subtrahend-amount`):
  - Cells $0$ to $(n_1 - n_2) - 1$ ($n_1 - n_2$ cells) have role `'remaining'` (rendered as solid shaded remainder).
  - Cells $n_1 - n_2$ to $n_1 - 1$ ($n_2$ cells from the starting amount) have role `'removed'` (rendered with takeaway hatching/slashes).
  - Cells $n_1$ to $d - 1$ ($d - n_1$ cells) retain role `'outside-start'`.
  - For the zero boundary ($6/9 - 6/9$), `remaining` is 0 cells, `removed` is 6 cells (indices $0$ to $5$), `outside-start` is 3 cells (indices $6$ to $8$). Total whole ($9$) and all partition boundaries remain fully drawn.

---

## 5. Instructional State Machine, Actions, Scene Projection, & Provenance

### 5.1. Frozen Schedule
The instructional schedule is strictly:
$$\text{encounter} \longrightarrow \text{operate} \longrightarrow \text{resolve}$$

1. **`encounter` Beat:**
   - `expectedResponse`: `{ promptId, beat: 'encounter', responsibility: 'mark-subtrahend-amount-for-inspection', inputKind: 'grouped-removal-action', evidenceCategory: 'supported-construction' }`.
   - Question: **"How much is left?"**
   - Representation: Stacked problem $\frac{n_1}{d} - \frac{n_2}{d}$ (intrinsic stacked notation). Single stable-whole fraction bar shows $n_1$ `'starting'` cells and $d - n_1$ `'outside-start'` cells. Linear path shows brief unit context **"One whole, ${d} equal parts"**.
   - Action: Exactly one grouped action button labeled **"Take away"** (intent: `{ type: 'mark-subtrahend-amount' }`).
   - Fraction input fields are unavailable/unmounted during `encounter`.
   - Dispatching `mark-subtrahend-amount` transitions synchronously and directly to `operate` with **zero animation or delay**. No extra "Continue" acknowledgment beat.
   - The action is spent and removed on transition; duplicate `mark-subtrahend-amount` intents at `operate` or `resolve` throw `EpisodeIntentError('UNEXPECTED_INTENT', ...)`.

2. **`operate` Beat:**
   - `expectedResponse`: `{ promptId, beat: 'operate', responsibility: 'supply-amount-left', inputKind: 'fraction', evidenceCategory: 'supported-construction' }`.
   - Question: **"How much is left?"**
   - Representation: Fraction bar visually distinguishes `remaining` ($n_1 - n_2$), `removed` ($n_2$), and `outside-start` ($d - n_1$). Linear path adds status: **"The amount ${n_2}/${d} is marked as removed from the starting amount."**
   - Critical Invariant: **No numeric result label, including zero, is exposed before learner submission** (neither in `scene.meaning.operation`, `scene.meaning.takeaway`, visible text, nor ARIA labels). Counting the remaining parts is the learner's instructional work.
   - Action: Learner enters numerator and denominator in the **"Amount left"** response group (accessible field names **"Numerator of amount left"** and **"Denominator of amount left"**, with no duplicate visible question/heading) and submits `{ type: 'submit-subtraction-result', proposed: { kind: 'fraction', numerator, denominator } }`.
   - Response Validation: Validates exact arithmetic equivalence via `validateOperationResult(proposed, left, right, 'subtract')` with no target-denominator constraint: for $4/10$, both $4/10$ and $2/5$ are accepted; for $0/9$, both $0/9$ and $0/1$ are accepted.
   - Recovery: Incorrect submissions stay in `operate`, retain the learner's submitted draft in the editable inputs, focus the numerator field, and show **"Check the parts left. Try again."** without resetting removal marks or displacing the question.

3. **`resolve` Beat:**
   - Displays the learner's accepted `submittedForm` exactly as submitted on the right side of the completed equation (no forced normalization to raw or simplified, no secondary simplification task, no automatic equivalence line).
   - Shows **"That amount is left."** and completion navigation (`{ type: 'finish-compact-episode' }` / **"Next problem"**).

### 5.2. Provenance Separation
- `src/interaction/provenance.js` and `episode.js` record `grouped-removal-triggered` for `mark-subtrahend-amount` and `learner-supplied-result` for `submit-subtraction-result`.
- Only `submit-subtraction-result` is classified as a mathematical answer attempt (`correct-simplified`, `correct-unsimplified`, or `incorrect`). `mark-subtrahend-amount` is recorded strictly as an operation inspection trigger and never as a chosen count, correct answer, mastery, or independent understanding.

---

## 6. Help, Focus Management, & App-Local Drafts

- **Requested Help:**
  - Requested locally at `operate` via `{ type: 'request-task-help' }`.
  - Visual Fraction Bar Help (both high and medium support): **"Count only the shaded parts without removal marks."**
  - Linear Help (both high and medium support): **"The second fraction is the amount taken away. Use the starting amount to work out what remains."**
  - Support Profiles: High and medium support profiles behave identically within each view.
- **App-Local Drafts & Help/Error Choreography:**
  - Learner inputs (numerator, denominator drafts) are preserved in `app.js` across help open/close, wrong-answer recovery remounts, and visual/linear view switches.
  - Submitting a wrong answer while help is open retains both the open help cue and the editable draft, displaying **"Check the parts left. Try again."** without replacing the help cue.
  - Closing help removes the cue while retaining recovery feedback and the draft.
  - Button label and `aria-expanded` always match actual help cue visibility in both views.
- **Focus Transitions:**
  - On initial entry, return/re-entry, and Next: Focus starts on the **"Take away"** button.
  - On **"Take away"** activation: Focus moves to the numerator input field in `operate`.
  - On wrong-response recovery: Focus returns to the numerator input field.
  - On help close: Focus returns to the Help toggle button.
  - On correct submission (`resolve`): Focus moves to the completion navigation control.

---

## 7. Replay v5 Architecture & Baseline Frozen Oracles

### 7.1. Replay v5 Specification (`fractionflow.episode-replay/v5`)
- Replay v5 captures exact top-level keys:
  - `schemaVersion`: `'fractionflow.episode-replay/v5'`
  - `contentIdentity`: Reconstructed from curated fixture `curated-plan36-${itemId}`.
  - `episodeDefinition`: `{ id: 'phase-3-like-denominator-takeaway-subtraction', revision: '1' }`
  - `support`: Validated support configuration wire data.
  - `activeCondition`: Validated active condition wire data.
  - `learnerIntents`: Ordered replay intents (`mark-subtrahend-amount: { type }`, `request-task-help: { type }`, `submit-subtraction-result: { type, proposed }`, `finish-compact-episode: { type }`).
  - `taskContext`: Validated 12-key Plan 36 task context record.
- Validation and Strict Backwards Compatibility:
  - Replay v5 fails closed on unknown/missing/extra keys, forged identities or sourceForms, duplicate `mark-subtrahend-amount`, `submit-subtraction-result` before marking, or `finish-compact-episode` before resolution.
  - Replay v5 stores submitted instructional intents only—never unsent drafts, help-panel open state, or session persistence.
  - Replay v1 (`fractionflow.episode-replay/v1`), v2, v3, and v4 schemas and guards are preserved without modification.

### 7.2. Frozen Baseline Oracles (`tests/fixtures/plan35-v4-replay-oracles.json`)
Before modifying any replay dispatch code, representative Plan 35 v4 replay oracles were captured and verified:
- Captured from commit `982bb8f52ad4274f35ae71edc8234adeed87fc22`.
- Total 8 cases:
  1. `two-thirds-plus-one-fourth` (construct) — initial & completed
  2. `one-half-plus-one-third` (inspect) — initial & completed
  3. `nested-one-half-plus-three-eighths` (identify, left) — initial & completed
  4. `nested-three-eighths-plus-one-half` (identify, right) — initial & completed
- Verified: Both `createReplayEnvelope` and `replayEpisode` roundtrip perfectly for all 8 cases under `REPLAY_V4_SCHEMA_VERSION`.

---

## 8. File and Symbol Mapping

The implementation adheres to the Plan 36 bounded file map:

| Layer | File Path | Symbols / Responsibilities |
|---|---|---|
| **Content (Data)** | `src/content/data/plan36-like-denominator-subtraction-records.js` *(new)* | `PLAN36_SUBTRACTION_RECORDS`, `PLAN36_SUBTRACTION_PRACTICE_SET`, `PLAN36_SUBTRACTION_RECIPE_ID`, `PLAN36_SUBTRACTION_TASK_DATA`, `findPlan36SubtractionAssociationSet`, `resolvePlan36SubtractionAssociationSet` |
| **Content (Task)** | `src/content/plan36-like-denominator-takeaway-task.js` *(new)* | `resolvePlan36LikeDenominatorSubtractionContext`, `validatePlan36LikeDenominatorSubtractionContext`, `validatePlan36LikeDenominatorSubtractionRecord`, `isPlan36SubtractionDefinition` |
| **Content (Profiles & Gen)** | `src/content/profiles.js`, `src/content/generator.js` | Register scoped `'plan36-subtraction-review'` profile admitting denominators `9` and `11`, nonnegative zero result, and both irreducible/reducible raw results with `overlays: []` |
| **Content (Catalog & Mat)** | `src/content/authored-content-catalog.js`, `src/content/authored-problem-materializer.js`, `src/content/validation.js`, `src/content/family-definitions.js` | Materialize and register the 8 `curated-plan36-${itemId}` fixtures and validate under `like-denominator-subtraction` |
| **Interaction (Definition)** | `src/interaction/episode-definition.js` | `PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION` (`phase-3-like-denominator-takeaway-subtraction@1`) |
| **Interaction (Schedule)** | `src/interaction/beat-schedule.js` | Frozen 3-entry beat schedule (`encounter` $\to$ `operate` $\to$ `resolve`) for the registered definition/context |
| **Interaction (Reducer)** | `src/interaction/episode.js` | Reducer handling `mark-subtrahend-amount`, `submit-subtraction-result`, `request-task-help`, `finish-compact-episode` |
| **Interaction (Scene)** | `src/interaction/scene.js` | Project `scene.meaning.takeaway` (`operation`, `wholePartitionCount`, `sourceForms`, `removalStatus`, `cells`, `acceptedResponseForm`), result-leakage guards, and `taskHelp` |
| **Interaction (Provenance)** | `src/interaction/provenance.js` | Visibility fields for takeaway subtraction and distinct `grouped-removal-triggered` vs `learner-supplied-result` provenance |
| **Interaction (Replay)** | `src/interaction/replay.js` | `REPLAY_V5_SCHEMA_VERSION`, strict v5 envelope creator & replayer; preserve v1–v4 |
| **Render (Strings)** | `src/render/strings.js` | Adopted concise copy for takeaway question, action, accessible labels, view-specific help, recovery, and completion |
| **Render (Container)** | `src/render/beat-container.js` | Coordinate single stable-whole takeaway bar, symbolic section, `grouped-removal-action` button, `Amount left` fraction input, help toggle, and summary lines |
| **Render (Bars)** | `src/render/fraction-bar.js` | Render single stable whole with `starting`, `remaining`, `removed` (hatched), and `outside-start` cell roles |
| **Render (Linear)** | `src/render/linear-path.js` | Linear takeaway representation, unit context, removal status, help, and response parity |
| **Render (Symbolic)** | `src/render/symbolic.js` | Intrinsic stacked subtraction equation (`a/d - b/d = ?`) and accepted learner response form at `resolve` |
| **Styles** | `src/styles/render.css`, `src/app/styles.css` | Scoped CSS for takeaway hatching, cell boundaries, and layout |
| **App (Registry & Shell)** | `src/app/practice-types.js`, `src/app/app.js` | Register `like-denominator-subtraction` goal, focus choreography, app-local draft preservation across help/recovery/view switches, Next/Retry/exhaustion |

---

## 9. Implementation Plan & Staged Review Checkpoints

In accordance with Requirement 5 (`pure data/admission/state/replay → orchestration review → mounted views/entry → review → browser evidence → progress`), implementation proceeds through three gated checkpoints:

### Checkpoint 1 — Pure Foundation (Stages 1–3, then STOP for Orchestrator Review)
- **Stage 1: Content & Curated Fixtures**
  - Create `src/content/data/plan36-like-denominator-subtraction-records.js` and `src/content/plan36-like-denominator-takeaway-task.js`.
  - Add `'plan36-subtraction-review'` profile in `src/content/profiles.js` and `src/content/generator.js`; wire materialization and catalog lookup in `authored-problem-materializer.js` and `authored-content-catalog.js`.
  - Unit tests in `tests/plan38-content-subtraction.test.js` covering all 8 items plus boundary refusals.
- **Stage 2: Interaction State Machine, Beat Schedule, & Replay v5**
  - Define `PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION` in `episode-definition.js` and 3-beat schedule in `beat-schedule.js`.
  - Implement reducer handling `mark-subtrahend-amount`, `submit-subtraction-result`, `request-task-help`, and `finish-compact-episode` in `episode.js`.
  - Implement Replay v5 in `replay.js`; verify v1–v4 tests and `tests/fixtures/plan35-v4-replay-oracles.json` pass unchanged.
- **Stage 3: Scene Projection & Provenance**
  - Implement `scene.meaning.takeaway` cell role projection, zero-boundary grid preservation, and pre-resolution answer-leakage guards in `src/interaction/scene.js` and `src/interaction/provenance.js`.
  - Unit tests in `tests/interaction-plan38-subtraction.test.js` covering all 8 items under both `high support` and `medium support`, equivalent responses (`4/10` and `2/5`, `0/9` and `0/1`), duplicate-mark rejection, help/recovery provenance, and v5 replay roundtrips/refusals.
  - **STOP for Orchestrator Checkpoint 1 Review before modifying `src/render/`, `src/styles/`, or `src/app/`.**

### Checkpoint 2 — Mounted Views & App Entry (Stages 4–5, then STOP for Orchestrator Review)
- **Stage 4: Render Components & Scoped CSS**
  - Update `strings.js`, `fraction-bar.js`, `beat-container.js`, `linear-path.js`, `symbolic.js`, `render.css`, and `styles.css`.
  - Render/DOM tests in `tests/plan38-rendered-subtraction.test.js` covering visual and linear paths, help open/close/reopen + repeated-wrong sequences, focus transitions, and pre-answer label withholding (including zero).
- **Stage 5: App Integration & Practice Types**
  - Register `like-denominator-subtraction` in `practice-types.js` and wire into `app.js` (draft preservation across help/recovery/view toggles, fresh Next/Retry, set exhaustion, and return/re-entry).
  - **STOP for Orchestrator Checkpoint 2 Review before full route matrix and browser capture.**

### Checkpoint 3 — Browser Evidence, Falsification Seeds, & Delivery (Stage 6)
- **Stage 6: Route Matrix, Visual Witnesses, & Verification**
  - Append subtraction journeys to `tests/routes/route-matrix.json` preserving all 65 historical rows / 67 executions and their contexts.
  - Run visual/leak/semantic falsification seeds and verify each fails the exact same clean assertion at its intended cause.
  - Capture required 360x740/752, Chromebook, and enlarged-text/zoom measurements and representative screenshots under `reports/development/plan-38-like-denominator-subtraction-batch/evidence/`.
  - Restore any historical evidence files dirtied by regression runs by explicit path (`plan-18`, `plan-34`, `plan-35`).
  - Finalize `reports/development/plan-38-like-denominator-subtraction-batch/progress.md` and commit owned paths.

---

## 10. Requirement 0 Approval Stop Condition

All prerequisites for Requirement 0 are complete:
- [x] Preflight checks passed cleanly (`plan-status check`, `plan-status lint`).
- [x] Mathematical invariants and zero boundary probed and verified (`requirement-0-probe-results.json`).
- [x] Baseline Plan 35 v4 replay oracles frozen (`tests/fixtures/plan35-v4-replay-oracles.json`).
- [x] Baseline routes and tests recorded (402 tests, 65 routes / 67 executions).
- [x] Mechanism proposal authored, aligned with Plan 36 contracts, and persisted.
- [x] Zero `src/` mutations made prior to approval.


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
| **Recipe ID** | `plan36.like-denominator-takeaway@1` (patternId: `like-denominator.takeaway`, revision: `1`) |
| **Episode Definition ID** | `phase-3-like-denominator-takeaway-subtraction`, revision `1` (`phase-3-like-denominator-takeaway-subtraction@1`) |
| **Task Data ID** | `plan36-like-denominator-takeaway`, revision `1` (`plan36-like-denominator-takeaway@1`) |
| **Practice Set ID** | `like-denominator-subtraction-vetted-set`, revision `1` (`like-denominator-subtraction-vetted-set@1`) |
| **Authoring Revision** | `plan36-record-v1` |
| **Practice Type / Goal ID** | `like-denominator-subtraction` |
| **Goal Label** | `Subtract fractions with the same denominator` |
| **Fixture IDs** | `curated-plan36-${itemId}` |
| **Replay Schema Version** | `fractionflow.episode-replay/v5` |

---

## 4. Content Admission, Arithmetic Derivation, & Zero Boundary

### 4.1. The 8 Authored Records
All 8 records have been verified via `reports/development/plan-38-like-denominator-subtraction-batch/requirement-0-probe.mjs` against `src/math/`:

| Item ID | Minuend | Subtrahend | Raw Difference | Simplified | Role / Pedagogical Intent |
|---|---|---|---|---|---|
| `takeaway-8-5-minus-2` | 5/8 | 2/8 | 3/8 | 3/8 | Moderate positive remainder |
| `takeaway-12-8-minus-3` | 8/12 | 3/12 | 5/12 | 5/12 | Positive irreducible raw difference |
| `takeaway-10-7-minus-3` | 7/10 | 3/10 | 4/10 | 2/5 | Positive reducible raw difference (unreduced minuend) |
| `takeaway-11-9-minus-4` | 9/11 | 4/11 | 5/11 | 5/11 | Positive irreducible raw difference |
| `takeaway-9-6-minus-1` | 6/9 | 1/9 | 5/9 | 5/9 | Large positive remainder (unreduced minuend) |
| `takeaway-9-6-minus-6` | 6/9 | 6/9 | 0/9 | 0/1 | Equal-operands zero boundary |
| `takeaway-6-5-minus-4` | 5/6 | 4/6 | 1/6 | 1/6 | One-part positive remainder |
| `takeaway-8-7-minus-1` | 7/8 | 1/8 | 6/8 | 3/4 | Near-whole positive remainder (reducible difference) |

### 4.2. Mathematical Invariants & Admission Rules
- **Domain:** Positive proper fractions only ($0 < n < d$) for both operands.
- **Common Denominator:** $d_1 = d_2 = d$. Unequal denominators are refused before episode construction.
- **Minuend $\ge$ Subtrahend:** Left numerator $\ge$ right numerator ($n_1 \ge n_2 > 0$).
- **Subtrahend $> 0$:** Zero subtrahends are refused.
- **Zero Result:** When $n_1 = n_2$ (item `takeaway-9-6-minus-6`), the difference is 0. Both $0/9$ and $0/1$ (or any exact zero fraction) are admitted by `equalFractions`.
- **Rejection Cases (tested in probe):**
  - Negative difference ($n_1 < n_2$) $\to$ Refused.
  - Improper left operand ($n_1 \ge d$) $\to$ Refused.
  - Improper right operand ($n_2 \ge d$) $\to$ Refused.
  - Zero minuend ($n_1 = 0$) or zero subtrahend ($n_2 = 0$) $\to$ Refused.
  - Malformed wire data $\to$ Refused.

### 4.3. Partition Geometry & Cell Roles
For any item with minuend $n_1/d$ and subtrahend $n_2/d$:
- Total cells: $d$ (whole width and partition count preserved).
- Starting shaded parts: $n_1$ cells (indices $0$ to $n_1 - 1$).
- Outside-start parts: $d - n_1$ cells (indices $n_1$ to $d - 1$).
- When "Take away" is dispatched:
  - $n_2$ cells from the starting amount become `removed` (rendered with takeaway hatching/slashes).
  - The remaining $n_1 - n_2$ cells become `remaining` (rendered as solid shaded remainder).
  - For the zero boundary ($6/9 - 6/9$), remaining is 0, removed is 6, outside-start is 3. Total whole ($9$) and all partition boundaries remain fully drawn.

---

## 5. Instructional State Machine, Actions, & Scene Projection

### 5.1. Frozen Schedule
The instructional schedule is strictly:
$$\text{encounter} \longrightarrow \text{operate} \longrightarrow \text{resolve}$$

1. **`encounter` Beat:**
   - Prompt: "How much is left?"
   - Representation: Stacked problem $\frac{n_1}{d} - \frac{n_2}{d} = ?$ (intrinsic stacked notation). Fraction bar shows $n_1$ shaded cells out of $d$.
   - Action: Exactly one grouped action button labeled **"Take away"** (intent: `{ type: 'mark-subtrahend-amount' }`).
   - Fraction input fields are disabled/hidden during encounter.
   - Dispatching "Take away" transitions synchronously and directly to `operate` with **zero animation or delay**. No extra "Continue" acknowledgment beat.
   - The action is spent; duplicate dispatches are ignored.

2. **`operate` Beat:**
   - Prompt: "How much is left?"
   - Representation: Fraction bar visually distinguishes `remaining` ($n_1 - n_2$), `removed` ($n_2$), and `outside-start` ($d - n_1$).
   - Critical Invariant: **No numeric result label, including zero, is exposed before learner submission** (neither in visible text nor ARIA labels). Counting the remaining parts is the learner's instructional work.
   - Action: Learner enters numerator and denominator and submits `{ type: 'submit-subtraction-difference', proposed: { kind: 'fraction', numerator, denominator } }`.
   - Response Validation: Validates exact arithmetic equivalence via `equalFractions(proposed, expectedRawDifference)`. No same-denominator restriction: for $4/10$, both $4/10$ and $2/5$ are accepted; for $0/9$, both $0/9$ and $0/1$ are accepted.
   - Recovery: Incorrect submissions retain the learner's draft and provide actionable error feedback without displacing the prompt question.

3. **`resolve` Beat:**
   - Displays the learner's accepted form exactly as submitted (no forced normalization, no secondary simplification task, no automatic equivalence line).
   - Shows navigation completion ("Next Problem" or return to practice).

---

## 6. Help, Focus Management, & App-Local Drafts

- **Requested Help:**
  - Requested locally via `{ type: 'request-task-help' }`.
  - Visual Fraction Bar Help: Concise copy counting only the shaded parts without removal marks, explicitly noting not to count unfilled cells.
  - Linear Help: Concise copy explaining taking the second fraction from the starting quantity.
  - Support Profiles: High and medium support profiles behave identically for this compact task.
- **App-Local Drafts:**
  - Learner inputs (numerator, denominator drafts) are preserved across help open/close, recovery, and visual/linear view switches.
  - Closing help retains the active recovery cue and draft.
  - ARIA attributes (`aria-expanded`, labels) agree with actual visual state.
- **Focus Transitions:**
  - On entry / Next: Focus starts on the **"Take away"** button.
  - On "Take away" click: Focus advances automatically to the numerator input field in `operate`.
  - On recovery (wrong answer): Focus remains on the response input field.
  - On help close: Focus returns to the help toggle button.
  - On correct submission (resolve): Focus advances to the "Next Problem" navigation button.

---

## 7. Replay v5 Architecture & Baseline Frozen Oracles

### 7.1. Replay v5 Specification (`fractionflow.episode-replay/v5`)
- Replay v5 captures:
  - `schemaVersion`: `'fractionflow.episode-replay/v5'`
  - `contentIdentity`: Reconstructed from curated fixture `curated-plan36-${itemId}`.
  - `episodeDefinition`: `{ id: 'phase-3-like-denominator-takeaway-subtraction', revision: '1' }`
  - `support`: Validated support configuration wire data.
  - `activeCondition`: Validated active condition wire data.
  - `learnerIntents`: Ordered replay intents (`mark-subtrahend-amount`, `request-task-help` if applicable, `submit-subtraction-difference`, `finish-compact-episode`).
  - `taskContext`: Validated Plan 36 task context record.
- Strict backwards compatibility:
  - Replay v1 (`fractionflow.episode-replay/v1`), v2, v3, and v4 schemas and guards are preserved without modification.
  - All existing replay tests and fixtures must continue to pass.

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

The implementation adheres to the Plan 36 file map:

| Layer | File Path | Symbols / Responsibilities |
|---|---|---|
| **Content (Data)** | `src/content/data/plan36-like-denominator-subtraction-records.js` *(new)* | `PLAN36_SUBTRACTION_RECORDS`, `PLAN36_SUBTRACTION_PRACTICE_SET`, `PLAN36_SUBTRACTION_RECIPE_ID`, `findPlan36SubtractionAssociationSet` |
| **Content (Task)** | `src/content/plan36-like-denominator-takeaway-task.js` *(new)* | `resolvePlan36LikeDenominatorSubtractionContext`, `validatePlan36LikeDenominatorSubtractionRecord` |
| **Content (Integration)** | `src/content/authored-content-catalog.js` | Register 8 curated fixtures (`curated-plan36-${itemId}`) |
| **Content (Integration)** | `src/content/authored-problem-materializer.js` | Materialize problem instances for Plan 36 subtraction |
| **Content (Integration)** | `src/content/validation.js` | Validate problem instances with operation `'subtract'` and common denominator |
| **Content (Integration)** | `src/content/family-definitions.js` | Register subtraction family if needed |
| **Interaction (Definition)** | `src/interaction/episode-definition.js` | `PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION` (`phase-3-like-denominator-takeaway-subtraction@1`) |
| **Interaction (Schedule)** | `src/interaction/beat-schedule.js` | Beat schedule for takeaway subtraction (`encounter` $\to$ `operate` $\to$ `resolve`) |
| **Interaction (Reducer)** | `src/interaction/episode.js` | Reducer handling `mark-subtrahend-amount`, `submit-subtraction-difference`, `request-task-help` |
| **Interaction (Scene)** | `src/interaction/scene.js` | Project scene for takeaway subtraction: partition cell roles (`remaining`, `removed`, `outside-start`), operation meaning, taskHelp |
| **Interaction (Replay)** | `src/interaction/replay.js` | `REPLAY_V5_SCHEMA_VERSION`, envelope creator & replayer with v5 validation |
| **Render (Strings)** | `src/render/strings.js` | Localized strings for takeaway prompt, help text, action labels |
| **Render (Bars)** | `src/render/fraction-bar.js` | Render partition cells with distinct visual treatments (solid remainder, hatched/slashed removal, unshaded) |
| **Render (Linear)** | `src/render/linear-path.js` | Stacked notation and linear subtraction representation |
| **Render (Symbolic)** | `src/render/symbolic.js` | Intrinsic stacked problem display and input fields |
| **Styles** | `src/styles/render.css`, `src/app/styles.css` | Scoped CSS for takeaway hatching, prompt layout, and button styling |
| **App (Registry)** | `src/app/practice-types.js` | Register `like-denominator-subtraction` practice goal |
| **App (Shell)** | `src/app/app.js` | Handle routing, goal selection, session progress, and completion for subtraction |

---

## 9. Implementation Plan & Staging

Once Requirement 0 approval is granted, implementation will proceed through six bounded stages:

- **Stage 1: Content & Curated Fixtures**
  - Create `plan36-like-denominator-subtraction-records.js` and `plan36-like-denominator-takeaway-task.js`.
  - Wire into `authored-content-catalog.js`, `authored-problem-materializer.js`, and `validation.js`.
  - Unit tests in `tests/plan38-content-subtraction.test.js`.
- **Stage 2: Interaction State Machine, Beat Schedule, & Replay v5**
  - Define `PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION`.
  - Implement beat schedule and episode reducer handling `mark-subtrahend-amount` and `submit-subtraction-difference`.
  - Implement Replay v5 in `replay.js`; verify baseline v4 oracles in `plan35-v4-replay-oracles.json` pass without change.
  - Unit tests in `tests/interaction-plan38-subtraction.test.js`.
- **Stage 3: Scene Projection & Provenance**
  - Implement scene projection in `src/interaction/scene.js` computing exact cell roles (`remaining`, `removed`, `outside-start`).
  - Implement help projection and response provenance.
  - Tests verifying no answer leakage before learner submission.
- **Stage 4: Render Components & Scoped CSS**
  - Update `fraction-bar.js`, `linear-path.js`, `symbolic.js`, and `strings.js`.
  - Add takeaway hatching and layout styles to `render.css`.
  - Render tests in `tests/plan38-rendered-subtraction.test.js`.
- **Stage 5: App Integration & Practice Types**
  - Register `like-denominator-subtraction` in `practice-types.js` and wire into `app.js`.
  - Verify learner entry, problem progression, practice set exhaustion, and return-to-practice.
- **Stage 6: Route Matrix, Visual Witnesses, & Verification**
  - Add subtraction rows to `tests/routes/route-matrix.json`.
  - Execute full test suite (`npm test`), route matrix (`npm run test:routes`), and build (`npm run build`).
  - Capture required browser evidence screenshots.
  - Compile final progress report and stage final commits.

---

## 10. Requirement 0 Approval Stop Condition

All prerequisites for Requirement 0 are complete:
- [x] Preflight checks passed cleanly (`plan-status check`, `plan-status lint`).
- [x] Mathematical invariants and zero boundary probed and verified (`requirement-0-probe-results.json`).
- [x] Baseline Plan 35 v4 replay oracles frozen (`tests/fixtures/plan35-v4-replay-oracles.json`).
- [x] Baseline routes and tests recorded (402 tests, 65 routes / 67 executions).
- [x] Mechanism proposal authored and persisted.
- [x] Zero `src/` mutations made prior to approval.

**This implementer thread now pauses and requests Orchestrator Mechanism Approval before proceeding to Stage 1.**

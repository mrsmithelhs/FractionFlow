# Plan 43 Requirement 0 — Shared Episode Completion and Progression Mechanism Proposal

**Date:** 2026-10-23  
**Status:** Submitted for Orchestrator Review and Gate Approval  
**Working Tree Baseline:** HEAD commit `fb90c75` (preceding commit `591c84e`), working tree clean aside from orchestrator status dispatch in `docs/development/README.md` and `docs/development/plan-43-shared-episode-completion-and-progression.md`. No other concurrent writers.

---

## 1. Context, Inventory, and Preflight

### 1.1 Problem Statement
Under the current baseline, once a learner completes the final meaningful task of a problem (e.g. entering the final sum or difference, or placing a fraction on the number line), the system forces an empty intermediate step:
1. The renderer displays the accepted mathematical result along with a "Finish" button.
2. Clicking "Finish" does not move to the next item; it merely replaces the prompt with "You finished this problem.", removes the button, and reveals a "Next Problem" button in the upper application navigation header.
3. Focus is shifted away from the local task area to the header control.
4. The learner must click a second time (in the header) to advance to the next problem.
5. On the final item of a practice set (or a single-item set like Plan 20 like-denominator addition), clicking "Finish" leaves the learner looking at a static screen with no local continuation action, requiring them to look for the header "Back to start" button.
6. For older addition items that feature substantive reflection, the button leading from the accepted sum to the reflection prompt was ambiguously labeled "Next Problem" (or overridden in `APP_RENDER_STRINGS` to "Continue"), misleading learners into expecting a new problem when a required learning task remained.

Owner DECISION-050 directed replacing this empty acknowledgment with direct progression: one click on **Next problem** in the local action area below the accepted result advances to the next item in fresh state, while preserving inspectable results, substantive reflection, truthful final-item behavior, and full historical replay compatibility.

### 1.2 Live Content Inventory & Seam Classification
A full source audit of `src/app/practice-types.js`, content registries, and route definitions confirms the 47 total live records across 5 practice types:

| Practice Type & Set Identity | Items | Definition & Revision | Seam Type | Before Plan 43 Behavior | After Plan 43 Proposed Behavior |
|---|---:|---|---|---|---|
| **Add fractions with different denominators** (`unlike-addition-vetted-set` v7) | 13 | `phase-3-reusable-addition-recipes@1` (construct, inspect/keep/repair, identify-side) | Affected (39-set) | `operate` -> `resolve` -> Finish button -> dispatches `finish-compact-episode` -> reveals header Next | Useful sum retained -> local **Next problem** below it -> one click advances with fresh state |
| | 6 | `phase-2-unlike-proper-addition-reflection@3` | Protected (8-set) | `operate` -> `resolve` -> continue button -> `submit-resolution` -> `reflect` -> `submit-reflection` -> reveals header Next | Useful sum retained -> button says **Continue** -> reflection required -> accepted reflection retained -> local **Next problem** |
| | 1 | `phase-2-shared-factor-addition-reflection@3` | Protected (8-set) | Same as above (reflection required) | Same as above (Continue -> reflect -> Next problem) |
| | 1 | `phase-3-crossing-one-whole-addition-reflection@1` | Protected (8-set) | Same as above (reflection required) | Same as above (Continue -> reflect -> Next problem) |
| **Add fractions with the same denominator** (`like-denominator-addition-vetted-set` v1) | 1 | `phase-3-like-denominator-addition@1` (Plan 20) | Affected (39-set, single-item) | `operate` -> `resolve` -> Finish button -> `submit-resolution` -> header Next suppressed -> stranded with header return | Useful sum retained -> concise completion notice + local **Back to start** button -> returns to entry |
| **Subtract fractions with the same denominator** (`like-denominator-subtraction-vetted-set` v1) | 8 | `phase-3-like-denominator-takeaway-subtraction@1` (Plan 36) | Affected (39-set) | `operate` -> `resolve` -> Finish button -> `finish-compact-episode` -> reveals header Next | Useful difference retained -> local **Next problem** (or on item 8, exhaustion notice + local **Back to start**) |
| **Subtract fractions with different denominators** (`unlike-denominator-subtraction-vetted-set` v1) | 9 | `phase-3-reusable-subtraction-recipes@1` (Plan 40) | Affected (39-set) | `operate` -> `resolve` -> Finish button -> `finish-compact-episode` -> reveals header Next | Useful difference retained -> local **Next problem** (or on item 9, exhaustion notice + local **Back to start**) |
| **Place fractions on a number line** (`bar-to-line-same-amount-vetted-set` v1) | 8 | `phase-4-bar-to-line-same-amount@2` (Plan 39 Repair 02) | Affected (39-set) | `locate` -> `resolve` -> Finish button -> `finish-compact-episode` -> reveals header Next | Useful position & aligned bar retained -> local **Next problem** (or on item 8, exhaustion notice + local **Back to start**) |

**Total affected records:** 13 + 1 + 8 + 9 + 8 = 39 records.  
**Total protected reflection records:** 6 + 1 + 1 = 8 records.  
**Total live items:** 47 records.

---

## 2. Requirement 0.1 — Authoritative Completion Condition & Progression Transaction

### 2.1 The Two Evaluated Completion Models

We evaluated two architectural alternatives for completion and intent recording:

#### Alternative A (Recommended): Explicit Continuation Transaction with Internal Completion Recording
* **Concept:** The episode state machine remains unchanged. At the terminal beat (`resolve` for compact recipes, `reflect` for reflection recipes), the episode presents the accepted mathematical outcome. Below this outcome, the local action area presents the learner's direct continuation action (**Next problem** or **Back to start**).
* **Transaction Lifecycle on Activating "Next problem":**
  1. **Pre-flight & Atomicity:** Before mutating any current state, the application calls `registeredItemEpisode(selectedPracticeType, nextIndex)`. If item preparation or validation fails, the current episode state and rendered view remain completely intact, `navigationRefusal` is set, and the existing refusal notice is announced. No advance occurs.
  2. **Internal Completion Recording:** If preparation succeeds, the application executes the completion transaction on the current episode:
     - For compact recipes and Plan 20: dispatches `{ type: 'finish-compact-episode' }` (or `{ type: 'submit-resolution' }` for Plan 20). This transitions `state.status` to `'resolved'` and records the intent in the episode's history.
     - For reflection episodes: `submit-reflection` has already transitioned `state.status` to `'resolved'`.
  3. **Transition & Fresh State:** The application advances `activePracticeItemIndex = nextIndex`, installs the prepared candidate state via `installFreshEpisode()`, clears all drafts/help states via `resetEpisodeUiState()`, and deliberately moves keyboard/screen-reader focus to the newly mounted task.
* **Why This Is Coherent and Truthful:**
  - The learner performs exactly **one physical click**.
  - The learner is never asked to confirm an empty "Finish" prompt.
  - The episode's intent history contains only authentic actions.
  - No new mathematical response is attributed to the learner.
  - Replay reconstruction of existing frozen envelopes remains 100% intact without any version bump.

#### Alternative B: Immediate Acceptance Resolution with Schedule & Replay Schema Bump
* **Concept:** Mutate `episode.js` so that `submit-operation-result`, `submit-subtraction-result`, and `propose-number-line-location` directly transition `state.status` to `'resolved'` upon acceptance, eliminating `resolve` from `beatSchedule` for current definitions.
* **Why This Alternative Is Rejected:**
  - **High Blast Radius & Schedule Mutation:** Removing `resolve` alters the schedule contract across Plan 35, Plan 36, Plan 40, and Plan 39.
  - **Definition Revision Churn:** Under repo contracts, altering a beat schedule requires bumping definition revisions (`phase-3-reusable-addition-recipes@2`, `phase-3-like-denominator-takeaway-subtraction@2`, `phase-3-reusable-subtraction-recipes@2`, `phase-4-bar-to-line-same-amount@3`), practice set revisions, and creating Replay Schema `v9`.
  - **Replay Incompatibility:** Existing historical replay oracles (e.g. `tests/fixtures/plan38-v5-replay-oracles.json`, `plan35-v4-replay-oracles.json`) contain `finish-compact-episode` in `envelope.learnerIntents`. If the final operation had already marked the episode `status: 'resolved'`, `applyIntent` would throw `EPISODE_RESOLVED` during historical replay.
  - **Plan 43 Guardrail:** Plan 43 specifically states: "The minimal scene/definition/replay/set revision work justified at the gate... An approved explicit continuation transaction may record completion internally; document and test its intent/history meaning."

### 2.2 Recommendation
Adopt **Alternative A**. The authoritative completion of the episode is committed as an atomic transaction upon learner activation of the continuation control (**Next problem** or local **Back to start**). If the learner remains inspecting the result, the accepted work remains inspectable; if they click Retry, Retry starts the current item fresh; when they click Next, completion is committed and the next item is installed cleanly.

---

## 3. Requirement 0.2 — Layer Ownership and Shared Behavior Contract

### 3.1 Layer Responsibilities

To avoid replicating fixture-id and definition-id sniffers across renderers, responsibilities are partitioned cleanly:

```
┌────────────────────────────────────────────────────────────────────────┐
│ App Layer (`src/app/app.js`)                                           │
│ - Practice set lifecycle & item index (`activePracticeItemIndex`)      │
│ - Destination item eligibility & candidate preparation                 │
│ - Atomic progression transaction (Next problem / Return to start)      │
│ - Fresh state installation & inter-item focus transfer                 │
│ - Supplies `progression` contract to Renderers                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ passes progression descriptor & handlers
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Renderers (`beat-container.js`, `linear-path.js`, `number-line-locate`) │
│ - Receives `progression: { kind, label, onContinuation, isExhausted }` │
│ - Inspects instructional task state:                                   │
│     * If intermediate task (e.g. resolve -> reflect): renders Continue │
│     * If terminal task accepted: renders progression action locally    │
│ - NO checks on `patternId`, `nestedContext`, `definitionId`, etc.      │
│ - Positions continuation control directly below the accepted outcome   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ renders
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ DOM Presentation                                                       │
│ - Accepted result visible (sum, difference, aligned number line)       │
│ - Local action area (`.active-beat-controls`):                         │
│     * If hasNext: [Next problem] button                                │
│     * If isExhausted: "You finished every problem in this set."        │
│                       + [Back to start] button                         │
│ - Header `.app-next-button` is removed / hidden to prevent duplicates  │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Eligibility:** Owned by `src/content/eligibility.js` and `src/app/app.js:canonicalInstance`. Renderers never check eligibility.
2. **Item Preparation:** Owned by `src/app/app.js:registeredItemEpisode`. Prepares and validates the candidate item instance and initial episode state before discarding current work.
3. **Progression State:** Owned by `src/app/app.js`. The app computes:
   - `canAdvance = activePracticeItemIndex !== null && activePracticeItemIndex < selectedPracticeType.items.length - 1`
   - `isExhausted = activePracticeItemIndex !== null && activePracticeItemIndex === selectedPracticeType.items.length - 1`
   - Supplies this progression context to the active renderer.
4. **Renderer Contract:**
   - Renderers no longer maintain bespoke lists of `patternId`, `nestedContext`, or `promptId`.
   - When the current beat is `resolve`:
     - If `scene.meaning.currentTask.connectionForm` indicates a subsequent reflection task follows (or `state.episodeDefinition.includeReflection === true`): the renderer offers **Continue** (`STRINGS.resolve.continueReflectionButton`), dispatching `submit-resolution`.
     - Otherwise, the mathematical/locating work is finished! The renderer queries the shared progression contract:
       - If `canAdvance`: renders primary button labeled **Next problem** (`STRINGS.app.nextProblemButton`). Clicking it triggers the continuation transaction (`advanceToNextItem()`).
       - If `isExhausted`: renders exhaustion message (`STRINGS.app.problemsExhausted`) and primary button labeled **Back to start** (`STRINGS.app.returnButton`). Clicking it triggers `returnToEntry()`.
   - The same progression contract applies identically in `beat-container.js` (visual fraction bars), `linear-path.js` (linear text/steps), and `number-line-locate.js` (Plan 39 number line).
5. **Focus Management:**
   - On item acceptance: Focus reaches the accepted result or the local continuation control deliberately (never a distant header button).
   - On advance: Focus lands deliberately on the first interactive element of the new task (e.g. the first numeric input, the "Take away" button, or the number-line token/candidate handle), with fallback to `main.app-episode`.
   - On return: Focus returns to `h1#fractionflow-title` on the entry page.
   - On refusal: Focus lands on `p.app-navigation-notice`.

---

## 4. Requirement 0.3 — Definition, Set, and Replay Revision Policy

### 4.1 Revision Analysis
We examined every current definition, practice set, and replay schema version across the codebase:
- **Replay Schemas:** `v1` (legacy), `v2` (task patterns), `v3` (nested), `v4` (addition recipes), `v5` (subtraction takeaway), `v6` (unlike subtraction), `v7` (Plan 39 revision 1), `v8` (Plan 39 Repair 02).
- **Episode Definitions:** Currently latest are `phase-3-reusable-addition-recipes@1`, `phase-3-like-denominator-takeaway-subtraction@1`, `phase-3-reusable-subtraction-recipes@1`, and `phase-4-bar-to-line-same-amount@2`.
- **Practice Sets:** Latest are `unlike-addition-vetted-set@7`, `like-denominator-addition-vetted-set@1`, `like-denominator-subtraction-vetted-set@1`, `unlike-denominator-subtraction-vetted-set@1`, and `bar-to-line-same-amount-vetted-set@1`.

### 4.2 Revision Policy Verdict
- **Schedule and Mathematical Definitions Remain Intact:**
  Because the beat schedule (`... -> operate -> resolve` or `... -> locate -> resolve`) and mathematical validation rules remain completely unchanged, **no definition revision bump is required or justified**.
- **Practice Sets Remain Intact:**
  The authored item memberships and set revisions (`setRevision: '7'`, etc.) describe the problem instances, which have not changed. No set revision bump is needed.
- **Replay Schema Remains Intact:**
  Completed historical envelopes and oracles continue to validate against `v1` through `v8`. The internal completion dispatch (`finish-compact-episode`) ensures that any completed envelope generated by the app or tested by replay oracles continues to validate under its exact existing schema version (`v4`, `v5`, `v6`, `v8`).
- **Label vs Contract Boundary:**
  Changing the rendered UI button label from "Finish" to "Next problem", placing it locally below the result, and binding it to direct advance is an application/renderer progression repair, not a change to the mathematical core or replay format.

---

## 5. Requirement 0.4 — Historical Contexts, Protected Recordings, UI, and Controls

### 5.1 Current versus Historical Route Contexts
- **Historical Route Contexts (`ROUTE-PLAN34-*`, `ROUTE-PLAN18-*`, `ROUTE-PLAN39-HISTORICAL-*`):**
  These routes test historical entry points (`tests/fixtures/plan34-historical-entry.html`, `plan18-historical-entry.html`, `plan39-historical-v7-entry.html`) generated by standalone builder scripts. These fixtures freeze past behavior. Their action mappings and selectors remain pinned and frozen; we do NOT alter them.
- **Current Production Routes:**
  Current routes in `tests/routes/route-matrix.json` (such as `ROUTE-PLAN38-DEEP-SAMPLE-*`, `ROUTE-PLAN40-DEEP-SAMPLE-*`, `ROUTE-PLAN39-*`) that previously clicked `.control-action-btn` ("Finish") and then `.app-next-button` will be updated to reflect the truthful, direct single-click progression on the local `.active-beat-controls` button.

### 5.2 Protected Reflection Paths
The 8 older addition records:
- 6 relatively-prime addition records (`two-thirds-plus-one-fourth`, `one-half-plus-one-third`, etc.)
- 1 shared-factor record (`one-sixth-plus-one-fourth`)
- 1 crossing-whole record (`two-thirds-plus-three-fourths`)
All 8 require substantive reflection / premise checks:
- At `resolve`, the prompt displays the accepted sum. The control is labeled **Continue** (`STRINGS.resolve.continueReflectionButton`), NOT Next problem.
- Activating **Continue** dispatches `submit-resolution`, transitioning to beat `reflect`.
- In beat `reflect`, the learner is presented with the reflection/premise question.
- Only after answering correctly (`submit-reflection`) does the episode resolve, at which point the local area displays **Next problem** (or exhaustion on the final item).
- **Negative Control:** An explicit test will assert that no Next control is exposed during `resolve` on these records and that reflection cannot be bypassed.

### 5.3 Final-Item UI & Single-Item Set Behavior
- **Multi-Item Sets at Final Item (Item Index $N-1$ of $N$):**
  - Upon accepting the final task, the local action area displays:
    1. The accepted result.
    2. The exhaustion message: `STRINGS.app.problemsExhausted` ("You finished every problem in this set.").
    3. A primary button labeled **Back to start** (`STRINGS.app.returnButton`).
  - No "Next problem" button is present.
  - No silent wrap to item 0 occurs.
  - Activating **Back to start** calls `returnToEntry()`, returning to the home practice selection with focus on `h1#fractionflow-title`.
- **Single-Item Set (`like-denominator-addition`, Plan 20):**
  - Item 1 of 1:
    - Upon accepting the operation (sum 5/7), the local action area displays the accepted sum, the completion message, and a local **Back to start** button.
    - Resolves the bug where Plan 20 previously suppressed the header Next button without offering any local return affordance.
  - Activating **Back to start** returns cleanly to entry choices.

### 5.4 Preparation Refusal & Work Preservation
If `registeredItemEpisode()` throws during `advanceToNextItem()` (e.g. simulated corrupted fixture or network/bundle glitch):
1. The error is caught in `try / catch`.
2. `state`, `activePracticeItemIndex`, and `selectedPracticeType` are untouched.
3. The accepted result and representations remain rendered on screen.
4. `navigationRefusal = true` is set, and `navigationNotice.textContent = STRINGS.app.nextProblemUnavailable` ("Next problem is currently unavailable.").
5. Focus is polite and lands on `navigationNotice`.
6. Retrying or returning remains safe; work is never discarded prematurely.

### 5.5 Discriminating Negative Controls in Test Plan
1. **No-Op / Two-Click Rejection:** Assert that after completing the final task, exactly one click on the local "Next problem" button directly mounts item $i+1$, with no leftover "Finish" step, duplicate header button, or intermediate click requirement.
2. **Premature Advance Rejection on Reflection:** Assert that on reflection items, the control at `resolve` is strictly "Continue", and that attempting to advance or access "Next problem" before reflection is accepted is impossible.
3. **Double-Activation Guard:** Assert that rapidly triggering "Next problem" twice advances exactly one item and does not skip items.
4. **Refusal Atomicity:** Assert that if candidate item preparation fails, the accepted result remains visible, no state is cleared, and the refusal notice is displayed.

---

## 6. Implementation Scope and Stop Checkpoint

Under Requirement 0, **all source code, test suites, and fixture mutations are frozen** pending orchestrator mechanism approval.

Upon orchestrator approval of this mechanism proposal:
1. Implement the shared progression contract in `src/app/app.js` and renderer handles (`beat-container.js`, `linear-path.js`, `number-line-locate.js`).
2. Update strings in `src/render/strings.js` to ensure truthful labels (**Continue** for reflection milestones, **Next problem** for inter-item progression, **Back to start** for set exhaustion).
3. Update route definitions in `tests/routes/route-matrix.json` to witness the direct local progression.
4. Verify all unit tests, route matrix, packet lint, and screenshot evidence across the required viewports (360x740, 360x752, 1366x768, 1093x614 DPR 1.25).
5. Prepare the progress report `reports/development/plan-43-shared-episode-completion-and-progression/progress.md`.

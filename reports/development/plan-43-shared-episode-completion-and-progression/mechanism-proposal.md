# Plan 43 Requirement 0 — Shared Episode Completion and Progression Mechanism Proposal (Revision 2)

**Date:** 2026-10-24  
**Status:** Revised for Orchestrator Review and Gate Approval (resolving all items in `mechanism-review.md`)  
**Working Tree Baseline:** HEAD commit `1b2fb27`, working tree clean aside from orchestrator status-dispatch edits in `docs/development/README.md` and `docs/development/plan-43-shared-episode-completion-and-progression.md`. No concurrent writers.

---

## 1. Context, Preflight, and Verified Inventory

### 1.1 Problem Statement and Scope
Under the pre-Plan 43 baseline, when a learner completes the final meaningful task of a problem (e.g. entering the final sum or difference, or placing a fraction on the number line), an empty acknowledgment is forced:
1. The renderer shows the accepted result alongside an obsolete "Finish" button.
2. Activating "Finish" does not advance to the next item; it merely replaces the prompt with "You finished this problem.", removes the button, and unhides an `.app-next-button` in the upper navigation header.
3. Focus is diverted from the active work region to the header control.
4. The learner must click a second time (in the header) to advance.
5. On the final item of a practice set (or the single-item Plan 20 addition set), clicking "Finish" suppresses the header Next button, stranding the learner with no local continuation affordance.

Owner DECISION-050 directed replacing this empty acknowledgment with direct progression: one click on **Next problem** in the local action area below the accepted result advances to the next vetted item in fresh state, while preserving inspectable outcomes, substantive reflection, truthful final-item return, and full historical replay reconstruction.

### 1.2 Exact Verified Live Content Inventory
A programmatically verified audit of `src/app/practice-types.js` across all 5 live practice types confirms the 47 total items:

| Practice Type & Set Identity | Items | Definition & Revision | Classification | Existing Seam | Plan 43 Production Behavior |
|---|---:|---|---|---|---|
| **Add fractions with different denominators** (`unlike-addition-vetted-set` v7) | 13 | `phase-3-reusable-addition-recipes@1` (construct, inspect/keep/repair, identify-side) | Affected (39-set) | `operate` -> `resolve` -> Finish button -> `finish-compact-episode` -> reveals header Next | Useful sum retained -> local **Next problem** below it -> one click advances with fresh state |
| | 6 | `phase-2-unlike-proper-addition-reflection@3` | Protected (8-set) | `operate` -> `resolve` -> continue button -> `submit-resolution` -> `reflect` -> `submit-reflection` -> reveals header Next | Useful sum retained -> button says **Continue** -> reflection required -> accepted reflection retained -> local **Next problem** |
| | 1 | `phase-2-shared-factor-addition-reflection@3` | Protected (8-set) | Same as above | Same as above (Continue -> reflect -> Next problem) |
| | 1 | `phase-3-crossing-one-whole-addition-reflection@1` | Protected (8-set) | Same as above | Same as above (Continue -> reflect -> Next problem) |
| **Add fractions with the same denominator** (`like-denominator-addition-vetted-set` v1) | 1 | `phase-3-like-denominator-addition@1` (Plan 20) | Affected (39-set, single-item) | `operate` -> `resolve` -> Finish button -> `submit-resolution` -> header Next suppressed -> stranded | Useful sum retained -> concise completion notice + local **Back to start** button -> returns to entry |
| **Subtract fractions with the same denominator** (`like-denominator-subtraction-vetted-set` v1) | 8 | `phase-3-like-denominator-takeaway-subtraction@1` (Plan 36) | Affected (39-set) | `operate` -> `resolve` -> Finish button -> `finish-compact-episode` -> reveals header Next | Useful difference retained -> local **Next problem** (or on item 8, exhaustion notice + local **Back to start**) |
| **Subtract fractions with different denominators** (`unlike-denominator-subtraction-vetted-set` v1) | 9 | `phase-3-reusable-subtraction-recipes@1` (Plan 40) | Affected (39-set) | `operate` -> `resolve` -> Finish button -> `finish-compact-episode` -> reveals header Next | Useful difference retained -> local **Next problem** (or on item 9, exhaustion notice + local **Back to start**) |
| **Place fractions on a number line** (`bar-to-line-same-amount-vetted-set` v1) | 8 | `phase-4-bar-to-line-same-amount@2` (Plan 39 Repair 02) | Affected (39-set) | `locate` -> `resolve` -> Finish button -> `finish-compact-episode` -> reveals header Next | Useful position & aligned bar retained -> local **Next problem** (or on item 8, exhaustion notice + local **Back to start**) |

**Verified Item Breakdown in `unlike-addition-vetted-set` v7 (21 total):**
- **13 compact recipe items:** `two-thirds-plus-one-fourth` (1), `one-half-plus-one-third` (2), `one-third-plus-one-fourth` (5), `nested-one-half-plus-three-eighths` (12), `nested-three-eighths-plus-one-half` (13), `plan35-construct-half-fifth-10` (14), `plan35-construct-three-fifths-third-30` (15), `plan35-inspect-third-eighth-24` (16), `plan35-inspect-fifth-third-30` (17), `plan35-identify-half-three-tenths-10` (18), `plan35-identify-three-tenths-half-10` (19), `plan35-identify-third-five-twelfths-12` (20), `plan35-identify-five-twelfths-third-12` (21).
- **8 protected reflection items:**
  1. `one-half-plus-one-fifth` (`phase-2-unlike-proper-addition-reflection@3`)
  2. `one-half-plus-two-fifths` (`phase-2-unlike-proper-addition-reflection@3`)
  3. `one-third-plus-one-fifth` (`phase-2-unlike-proper-addition-reflection@3`)
  4. `one-third-plus-two-fifths` (`phase-2-unlike-proper-addition-reflection@3`)
  5. `two-thirds-plus-one-fifth` (`phase-2-unlike-proper-addition-reflection@3`)
  6. `three-fifths-plus-one-third` (`phase-2-unlike-proper-addition-reflection@3`)
  7. `one-sixth-plus-one-fourth` (`phase-2-shared-factor-addition-reflection@3`)
  8. `two-thirds-plus-three-fourths` (`phase-3-crossing-one-whole-addition-reflection@1`)

---

## 2. Requirement 0.1 — Shared Progression Contract and Layer Ownership

### 2.1 Instructional Eligibility State Machine
Eligibility cannot be inferred solely from `state.beat === 'resolve'` or from set indices. The application derives instructional eligibility directly from the validated episode state (`state.beat`, `state.status`, `state.schedulePosition`, `state.beatSchedule`, and `state.established`):

```
                        ┌────────────────────────────────────────────────────────┐
                        │                  Instructional State                   │
                        └───────────────────────────┬────────────────────────────┘
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
         `status === 'active'`                                               `status === 'resolved'`
                 │                                                                     │
    ┌────────────┴────────────┐                                                        │
    │                         │                                                        │
`beat !== 'resolve'`    `beat === 'resolve'`                                      `beat === 'reflect'`
    │                         │                                                        │
    ▼                         │                                                        ▼
[Phase 1: 'idle']             │                                              [Phase 4: 'resolved-reflection']
(active task, no              │                                              (reflection accepted,
 progression offered)         │                                               awaiting progression)
                              ├────────────────────────────────────────┐
                              ▼                                        ▼
                  `nextEntry.kind === 'reflect'`        `schedulePosition === length - 1`
                              │                                        │
                              ▼                                        ▼
                  [Phase 2: 'continue-milestone']       [Phase 3: 'terminal-accepted']
                  (accepted sum inspectable;             (math/location accepted;
                   action is Continue to reflect)         awaiting progression)
```

The app layer evaluates these 4 distinct phases:

1. **Phase 1: `active-task` (`'idle'`)**  
   - Condition: `state.status === 'active' && state.beat !== 'resolve'`.  
   - Eligibility: Progression is prohibited. No progression controls are rendered.
2. **Phase 2: `continue-milestone`**  
   - Condition: `state.status === 'active' && state.beat === 'resolve' && state.beatSchedule[state.schedulePosition + 1]?.kind === 'reflect'`.  
   - Meaning: The mathematical sum is accepted and visible, but an uncompleted reflection task is scheduled next.  
   - Action: **Continue** (`STRINGS.resolve.continueReflectionButton`). Clicking it dispatches `{ type: 'submit-resolution', proposed: state.established.operation.rawResult }` to advance to `reflect`.
3. **Phase 3: `terminal-accepted`**  
   - Condition: `state.status === 'active' && state.beat === 'resolve' && state.schedulePosition === state.beatSchedule.length - 1 && (state.established.operation || state.established.numberLineLocation)`.  
   - Meaning: All instructional tasks of the problem are solved and accepted; the result is inspectable.  
   - Action: Direct progression is unlocked:
     * If `hasNextItem`: **Next problem** (`STRINGS.app.nextProblemButton`).
     * If `isFinalItem`: Exhaustion notice (`STRINGS.app.problemsExhausted`) + **Back to start** (`STRINGS.app.returnButton`).
4. **Phase 4: `resolved-reflection`**  
   - Condition: `state.status === 'resolved' && state.beat === 'reflect' && Boolean(state.established.reflection)`.  
   - Meaning: Reflection response was validated and accepted.  
   - Action: Direct progression is unlocked:
     * If `hasNextItem`: **Next problem**.
     * If `isFinalItem`: Exhaustion notice + **Back to start**.

### 2.2 Shared Progression Descriptor Surface
The application computes this validated state and passes a single typed progression descriptor to renderers:

```typescript
interface ProgressionDescriptor {
  readonly phase: 'idle' | 'continue-milestone' | 'terminal-accepted' | 'resolved-reflection';
  readonly actionKind: 'none' | 'continue' | 'advance' | 'return';
  readonly label: string | null;         // 'Continue' | 'Next problem' | 'Back to start' | null
  readonly notice: string | null;        // 'You finished every problem in this set.' | null
  readonly onAction: (() => void) | null;
}
```

**Renderer Integration:**
- Renderers (`beat-container.js`, `linear-path.js`, `number-line-locate.js`) receive `progression` as part of the render context or contract.
- When `progression.actionKind !== 'none'`, the renderer mounts the progression button and optional notice in its active controls area (`.active-beat-controls` or `.plan39-controls`).
- **Renderers contain zero checks** on `patternId`, `nestedContext`, `definitionId`, `promptId`, or `connectionForm`. Upstream app logic owns all policy.

### 2.3 Explicit Completion Adapters
When executing an atomic progression transaction from Phase 3 (`terminal-accepted`), the application records completion on the old episode state using the family-specific adapter before advancing:
- **Plan 20 Like-Denominator Addition:**  
  `applyIntent(state, { type: 'submit-resolution', proposed: state.established.operation.rawResult })`  
  *(Preserves the exact payload, mathematical classification, and provenance required by `handleResolve` in `episode.js` line 920).*
- **Plan 34, Plan 35, Plan 36, Plan 40, Plan 39:**  
  `applyIntent(state, { type: 'finish-compact-episode' })`
- **Reflection Episodes (Phase 4):**  
  Already `status: 'resolved'`. No additional intent is dispatched.

All adapter payloads and classification semantics remain encapsulated inside `app.js`.

---

## 3. Requirement 0.2 — Atomic Transactions, Stale Controls, and Focus

### 3.1 Complete Transaction Specifications

#### Transaction A: Next Problem (`advanceToNextItem()`)
1. **Pre-flight & Eligibility Revalidation:**
   - Assert `isProgressionEligible(state)` is true (Phase 3 or Phase 4) and `activePracticeItemIndex < selectedPracticeType.items.length - 1`.
   - Assert `actionGeneration === currentEpisodeGeneration`. (Rejects stale clicks or double activation).
2. **Destination Pre-Preparation:**
   - Compute `nextIndex = activePracticeItemIndex + 1`.
   - Attempt `nextPrepared = registeredItemEpisode(selectedPracticeType, nextIndex)`.
   - **Refusal Boundary:** If `registeredItemEpisode` throws, catch error, set `navigationRefusal = true`, update `navigationNotice.textContent = STRINGS.app.nextProblemUnavailable`, unhide `navigationNotice`, call `render()`, and call `focusNavigationNotice()`. Current episode state and rendered view remain 100% intact. Return immediately.
3. **Pure Old-State Completion Recording:**
   - Execute the completion adapter via pure `applyIntent(state, completionIntent)` in memory.
   - Assert `completedOldState.status === 'resolved'`.
   - Cache `lastCompletedEnvelope = createReplayEnvelope(completedOldState)`.
   - *(Note: Do NOT dispatch through the public UI loop. This eliminates any flash of an obsolete "You finished this problem" screen or unintended header button focus).*
4. **Installation & Fresh State:**
   - Increment `currentEpisodeGeneration += 1`.
   - Install `nextPrepared.state` via `installFreshEpisode(selectedPracticeType, nextIndex, nextPrepared.state)`.
   - Call `resetEpisodeUiState()`.
   - Apply established focus policy (`focusEpisodeLandmark()`, preserving Plan 36 encounter Take away button focus).

#### Transaction B: Final Return (`returnFromCompletedSet()`)
1. **Pre-flight & Eligibility Revalidation:**
   - Assert `isProgressionEligible(state)` is true and `activePracticeItemIndex === selectedPracticeType.items.length - 1` (or single-item Plan 20).
   - Assert `actionGeneration === currentEpisodeGeneration`.
2. **Pure Completion Recording:**
   - Execute completion adapter via pure `applyIntent` if not already resolved.
   - Cache `lastCompletedEnvelope = createReplayEnvelope(completedOldState)`.
   - Do not complete an already-resolved episode twice.
3. **Clean Return to Entry:**
   - Increment `currentEpisodeGeneration += 1`.
   - Call `returnToEntry()`: resets episode UI state, hides `.app-episode`, unhides `.app-entry-page`, clears navigation status, and sets focus to `h1#fractionflow-title` (`entryTitle.focus()`).

#### Contrast with Ordinary Mid-Task Return
- Clicking header "Back to start" while an episode is in Phase 1 or 2 is a **cancellation/exit**:
  - Does NOT dispatch a completion intent.
  - Does NOT mark the episode resolved.
  - Returns to the entry page. Re-entering starts the stable first registered item fresh.

### 3.2 Stale-Action and Double-Activation Guards
- `currentEpisodeGeneration` (integer) is initialized to `0` and incremented on every episode mount, retry, return, and advance.
- The progression descriptor binds the current generation: `onAction: () => handleProgression(capturedGeneration, 'advance')`.
- Inside `handleProgression`:
  1. `if (capturedGeneration !== currentEpisodeGeneration) return;` (Rejects clicks from detached DOM or previous items).
  2. `if (isTransitioning) return;` (Synchronous re-entrancy lock during the preparation step).
  3. `if (!isProgressionEligible(state)) return;` (Revalidates that state is at Phase 3 or 4).

### 3.3 Deliberate Focus Policy
- **On Terminal Acceptance (Phase 3 / 4):** Focus is set deliberately to the local continuation control (`.active-beat-controls button`), placing the learner directly at the Next/Return action without header scrolling.
- **On Advancing to New Item:** Reuses established `installFreshEpisode` focus policy:
  - Plan 36 subtraction in beat `encounter`: focus the Take away button (`.active-beat-controls button`), fallback to `main.app-episode`.
  - All other items: focus `main.app-episode` (`focusEpisodeLandmark()`).
  - *(Number-line token is not focusable via keyboard; keyboard navigation uses candidate benchmark steppers. General first-input focusing is omitted).*
- **On Destination Refusal:** Focus lands on `p.app-navigation-notice` (`focusNavigationNotice()`).
- **On Final Return:** Focus lands on `h1#fractionflow-title` (`entryTitle.focus()`).

---

## 4. Requirement 0.3 — Historical Witness Preservation and UI Policy Boundary

### 4.1 Protected Historical Routes and Hashes
`tests/route-contract.test.js` enforces strict SHA-256 integrity on existing routes and context mappings:
- `matrix.routes.slice(0, 91)` SHA-256: `eee8367c25fdaa88612b516a05b6989a919ae10b8e822a6339bea9b4c3c631de`
- `matrix.routes.slice(0, 98)` SHA-256: `e30aa7a3ee8a4f4f0567d245256ed954881d931f2d2136304320cc39a25a93ef`
- `contextsBeforeRepair03` SHA-256: `c2c83aee5eea3436a66deb4978ad8891fadb694fa4c2f48c212e48db9dee0c00`

The first 98 route objects in `tests/routes/route-matrix.json` and their mapped contexts in `tests/routes/plan34-context-map.json` **must remain untouched**. They cannot be rewritten or regenerated.

### 4.2 Explicit UI Policy Boundary
Because `tests/fixtures/plan34-historical-entry.js`, `plan18-historical-entry.js`, and `plan39-historical-v7-entry.js` import the live `src/app/app.js`, and because existing routes mapped to `production-default-v7` and `production-default-v8` test the two-step legacy Finish flow, an explicit composition policy boundary is required:

1. **`createFractionFlowApp({ root, navigationMode = 'direct', ... })`**:
   - `navigationMode: 'direct'` (Default for production `src/app/main.js`):
     - Renders local **Next problem** / **Back to start** below accepted results.
     - Suppresses header `.app-next-button`.
     - Executes single-click direct progression.
   - `navigationMode: 'legacy-acknowledged'` (Historical compatibility mode):
     - Renders local "Finish" button (`.control-action-btn` / `.plan39-finish`).
     - Activating "Finish" dispatches completion intent, sets `status: 'resolved'`, displays "You finished this problem.", and reveals header `.app-next-button`.
     - Activating header `.app-next-button` advances to the next problem.
2. **Context Resolution in `scripts/dev/run-route-matrix.js`:**
   - Existing contexts (`production-default-v7`, `production-default-v8`, `historical-v4`, `historical-v6`, `historical-plan39-v7`) run in `legacy-acknowledged` mode via `path: '?nav=legacy'` on `mounted-app-entry` (or dedicated historical build entry).
   - In `src/app/main.js`:
     ```javascript
     const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
     const navigationMode = params?.get('nav') === 'legacy' ? 'legacy-acknowledged' : 'direct';
     createFractionFlowApp({ root, navigationMode }).mount();
     ```
     Learners visiting the site without query parameters always get `direct`.
3. **Appending Current Production Witnesses:**
   - New current route witnesses (`ROUTE-PLAN43-*`) are **appended** to `route-matrix.json` starting at index 99.
   - Mapped in `plan34-context-map.json` to context `production-default-v9`.
   - `production-default-v9` runs against `mounted-app-entry` with clean `path: ''` (`navigationMode: 'direct'`), verifying direct single-click Next, focus, fresh state, and exhaustion.
4. **Contract Verification:**
   - Update `tests/route-contract.test.js` to assert that the first 98 routes and existing context map prefix maintain their exact pinned hashes, while verifying that the new appended Plan 43 routes exercise `production-default-v9`.

---

## 5. Requirement 0.4 — Objective Evidence and Falsification Seeds

### 5.1 Verification Strategy
- **Whole-Bank Deterministic Sweep:** Execute an automated sweep across all 47 registered items under their supported conditions, asserting:
  1. Terminal task acceptance transitions to Phase 3 or 4.
  2. Single continuation activation installs the exact next registered item in fresh state.
  3. The 8 protected reflection records strictly transition to Phase 2 (Continue) and require valid reflection before Phase 4 (Next).
  4. Final items (and Plan 20) offer exhaustion notice + Back to start.
- **Deep Browser Sample:** Run Playwright browser witnesses covering each family across viewports `360x740`, `360x752`, `1366x768`, and `1093x614 DPR 1.25`.

### 5.2 Discriminating Behavioral Falsification Seeds
In accordance with Quality doc contracts, seeds inject explicit behavioral defects into the runner and verify that ordinary test assertions reject them:

1. **Seed: Two-Click Regression (`two-click-next-regression`)**  
   - *Injected Defect:* In `handleProgressionAction`, mutate the handler to record completion and show the completed message without invoking `installFreshEpisode()`.  
   - *Ordinary Assertion:* `assert(activeItemIndex === previousIndex + 1)` and `assert(activeElement === expectedFocusTarget)`.  
   - *Result:* Ordinary assertion fails because the previous item remains displayed.
2. **Seed: Premature Advance Skipping Reflection (`premature-advance-reflection`)**  
   - *Injected Defect:* In Phase 2 (`continue-milestone`), mutate the handler to call `advanceToNextItem()` directly instead of advancing to `reflect`.  
   - *Ordinary Assertion:* On protected reflection records, assert that clicking Continue lands at `state.beat === 'reflect'` with visible reflection prompt and absent Next button.  
   - *Result:* Assertion fails because the reflection task was skipped.
3. **Seed: Double-Activation Item Skipping (`double-activation-skip`)**  
   - *Injected Defect:* Disable the generation guard `capturedGeneration !== currentEpisodeGeneration` in `handleProgressionAction`.  
   - *Ordinary Assertion:* Simulate two rapid click events on Next problem. Assert `activeItemIndex === startIndex + 1` (advances exactly 1 item, not 2).  
   - *Result:* Assertion fails with `activeItemIndex === startIndex + 2`.
4. **Seed: Preparation Refusal Work Discard (`refusal-work-discard`)**  
   - *Injected Defect:* In `advanceToNextItem`, discard current episode UI drafts and state before verifying destination candidate preparation.  
   - *Ordinary Assertion:* Trigger advance when next item preparation throws. Assert that the accepted result remains visible, previous work is not blanked, and refusal status is announced.  
   - *Result:* Assertion fails because previous work was discarded.

Clean and seeded run receipts will be saved in separate timestamped JSON files under `reports/development/plan-43-shared-episode-completion-and-progression/evidence/`.

---

## 6. Advisor Consultation Disposition

- **Provider Surface:** Antigravity / Gemini.
- **Advisor Capability Evaluation:** Consulted `advisor-capable-providers.json` and repository constraints. Under the owner's Codex/advisor override, consultations require Sol-class read-only subagents at low/medium effort. Antigravity does not provide access to Sol-class models or Anthropic models.
- **Verdict:** In accordance with the fail-closed rule in Step 1 of the Implementer Prompt, this thread operates in **Branch C — degraded mode: orchestrator-gate-only review**. No paid probes, model substitutions, or Astra consultations are attempted.

---

## 7. Stop Checkpoint

This proposal completes the revisions requested in `mechanism-review.md`. In strict compliance with Requirement 0, **source code, test suites, route matrix objects, and fixtures remain completely unmutated**. We await orchestrator mechanism approval before opening source implementation.

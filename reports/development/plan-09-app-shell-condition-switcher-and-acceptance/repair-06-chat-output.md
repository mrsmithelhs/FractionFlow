Ran command: `git status`
Ran command: `git log -n 3 --oneline`
Viewed repair-06.md:1-121
Searched for "38"
Searched for "replay"
Searched for files: *
Viewed 02-interaction-grammar.md:1-60
Searched for "38."
Ran command: `node -e "const fs = require('fs'); const lines = fs.readFileSync('docs/founding/02-interaction-grammar.md', 'utf8').split('\n'); lines.forEach((l, i) => { if (l.startsWith('#')) console.log((i+1) + ': ' + l); });"`
Viewed 02-interaction-grammar.md:800-820
Viewed decision-log.md:230-300
Viewed decision-log.md:600-690
Viewed scene.js:505-535
Searched for "decideDone"
Viewed strings.js:30-60
Searched for "validLeast"
Viewed render-strings.test.js:95-130
Searched for "decideDone"
Searched for "Common denominator"
Viewed open-questions.md:1-60
Viewed open-questions.md:380-450
Searched for "replay"
Searched for "replay"
Searched for "replay"
Viewed app.js:240-380
Searched for "resolveRenderableScene"
Viewed contract.js:45-85
Viewed scene.js:680-730
Searched for "commonUnit"
Searched for "unitRelationship"
Searched for "candidateDenominators"
Edited scene.js
Viewed strings.js:40-60
Viewed strings.js:165-185
Edited strings.js
Edited strings.js
Viewed beat-container.js:110-120
Viewed linear-path.js:140-150
Edited beat-container.js
Edited linear-path.js
Ran command: `npm test`
Viewed render-strings.test.js:100-135
Viewed app-shell.test.js:80-140
Viewed open-questions.md:360-385
Viewed classification.js:15-45
Viewed render-recovery.test.js:255-283
Viewed classification.js:15-30
Edited classification.js
Viewed classification.js:70-145
Viewed classification.js:180-286
Edited classification.js
Edited classification.js
Viewed classification.js:230-286
Edited classification.js
Viewed render-recovery.test.js:1-15
Viewed render-recovery.test.js:260-283
Edited render-recovery.test.js
Edited render-recovery.test.js
Ran command: `npx vitest run tests/render-recovery.test.js`
Viewed render-strings.test.js:100-125
Edited render-strings.test.js
Viewed app-shell.test.js:90-135
Edited app-shell.test.js
Edited app-shell.test.js
Ran command: `npx vitest run tests/app-shell.test.js tests/render-strings.test.js`
Viewed open-questions.md:430-450
Edited open-questions.md
Ran command: `npm test`
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `npm run build`
Ran command: `git status`
Ran command: `git diff docs/open-questions.md`
Ran command: `git diff src/`
Ran command: `git status`
Viewed repair-06.md:1-121
Ran command: `git log -n 5 --oneline`
Viewed progress.md:650-757
Ran command: `git diff`
Ran command: `git diff docs/open-questions.md src/interaction/classification.js`
Ran command: `npm test`
Ran command: `npm run build`
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `node scripts/dev/plan-status.js check plan-09`
Searched for "replay"
Viewed app.js:240-375
Viewed episode.js:285-315
Searched for "transition"
Searched for "transition"
Searched for "meaning.transition"
Viewed interaction-scene.test.js:210-250
Searched for "transition"
Searched for "projectScene"
Viewed interaction-scene.test.js:1-30
Viewed index.js:1-8
Viewed scene.js:1-70
Viewed scene.js:650-738
Viewed scene.js:525-640
Searched for "transition"
Viewed fraction-bar.js:100-160
Viewed fraction-bar.js:240-290
Searched for "§38"
Searched for "38"
Viewed 02-interaction-grammar.md:798-835
Viewed decision-log.md:380-450
Viewed decision-log.md:620-690
Viewed interaction-provenance-replay.test.js:1-70
Viewed interaction-provenance-replay.test.js:71-124
Viewed provenance.js:45-95
Searched for "D-02-M"
Viewed conditions.js:1-75
Viewed strings.js:190-235
Searched for "Fold (740px)"
Searched for "Fold (740px)"
Viewed repair-05-report.md:115-160
Searched for files: *
Viewed repair-04-report.md:1-80
Viewed repair-04-report.md:80-140
Viewed repair-05-report.md:1-50
Ran command: `git status --short`
Ran command: `git add docs/open-questions.md src/interaction/classification.js src/interaction/scene.js src/render/beat-container.js src/render/linear-path.js src/render/strings.js tests/app-shell.test.js tests/render-recovery.test.js tests/render-strings.test.js`
Ran command: `git commit -m "Implement Plan 09 Repair 06: milestone common denominator acknowledgement, OQ-21 deferred string, and recovery kind constants"`
Created repair-06-report.md
Viewed progress.md:725-757
Edited progress.md
Ran command: `git status --short`
Ran command: `npm test`

I have launched the test suite execution and will wait for it to complete.

Checked task Run npm test

Waiting for `npm test` task completion...

Checked task Run npm test
Ran command: `npm run build`
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `node scripts/dev/plan-status.js check plan-09`
Ran command: `git status --short`
Ran command: `git add reports/development/plan-09-app-shell-condition-switcher-and-acceptance/progress.md reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-06-report.md`
Ran command: `git commit -m "Document Plan 09 Repair 06 execution, Items 2-4 completion, and Item 1 mechanism proposal"`
Ran command: `git status`
Ran command: `git log -n 3 --oneline`

# Plan 09 — Repair 06 Report & Item 1 Mechanism Proposal

**Base commit:** [`a1b1841`](file:///c:/AI/FractionFlow)  
**Implementation commit:** [`a5e64bb`](file:///c:/AI/FractionFlow)  
**Report commit:** [`a0dabfc`](file:///c:/AI/FractionFlow)  
**Status:** **Items 2–4 Complete; Item 1 Proposed and Stopped at Mechanism Gate.**

---

## 1. Item 1 Mechanism Proposal: Making Replay Real

Per [`repair-06.md`](file:///c:/AI/FractionFlow/reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-06.md), `02-interaction-grammar.md` §38, and DECISION-027, "Replay the last change" must visibly re-present the most recently established conversion transition using the active condition's treatment without altering mathematical or instructional state and without introducing history into `scene`.

### 1.1 Where the Flag Lives & Why
- **Allocation:** Managed in app shell presentation state (`let isReplaying = false`), passed downstream into `resolveRenderableScene({ state, presentationMode, isReplaying })` / `projectScene({ state, representationRole, presentationMode, isReplaying })` as `scene.presentation.isReplaying: boolean` (default `false`).
- **Architectural Rationale:**
  1. **Strict Pipeline Integrity (`04-system-architecture.md`):** Replay does not alter mathematical truth, completed beats, or learner responsibility. It is a transient presentation directive.
  2. **Preservation of `SCENE_HISTORY_KEYS`:** `SCENE_HISTORY_KEYS` forbids `replayHistory` (along with `intentHistory`, `helpHistory`, etc.) from the scene. A transient boolean flag `isReplaying` inside `scene.presentation` is not a history log; it is a presentation directive alongside `scene.presentation.mode` and `scene.presentation.choreography`.
  3. **Access & Renderer Parity:** Both [`beat-container.js`](file:///c:/AI/FractionFlow/src/render/beat-container.js) and [`linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js) consume `scene.presentation`. Passing `isReplaying` here ensures both visual and linear paths update synchronously with identical data.
  4. **No New Beat Required:** Replay operates within the current beat (`transform`, `operate`, `resolve`, `reflect`).

### 1.2 Clearing Triggers & No-Transition Behavior
- **Clearing Triggers:** Ephemeral display state that clears (`isReplaying = false`):
  1. Upon any forward learner input or action (e.g. typing in an input field, submitting an answer, clicking a reflection choice, clicking continue).
  2. Upon operating shell controls (switching condition or toggling visual/linear view).
  3. Upon clicking "Replay the last change" again (toggle/dismiss).
  4. Upon dismissing the view (e.g. "Done replaying" / escape).
- **Beats With No Established Transition:**
  - At `encounter`, `notice`, `decide`, and `transform-left` (prior to submitting the left conversion), `scene.meaning.transition === null`.
  - At `encounter`, the replay button is disabled (`replayButton.disabled = true`).
  - At `notice`, `decide`, and `transform-left`, clicking replay detects `scene.meaning.transition === null`:
    - `isReplaying` remains `false`.
    - Announces `STRINGS.app.noReplayYet` (*"Finish a change before replaying it."*) via `supportNotice` (`aria-live="polite"`).
    - Zero visual layout mutation occurs; active controls and focus remain completely undisturbed.
    - Reaches `STRINGS.app.noReplayYet` as intentional instructional feedback rather than an error catch.

### 1.3 Active Condition Treatments (Including "New Parts Only")
- **Juxtaposed (`D-02-J`):**
  - At conversion beats (`transform-right`, `operate`): Re-focuses/pulses the existing 2-track comparison card and re-announces the transition.
  - At `resolve` and `reflect`: Bars have returned to single-bar resting state. Replay re-expands the last converted operand (right fraction) to juxtaposed before/after (Row 1: Before $1/4$, Row 2: After $3/12$), accompanied by `strings.app.replayNote`.
- **Sequential (`D-02-S`):**
  - At conversion beats: Re-focuses the sequential cards.
  - At `resolve` and `reflect`: Re-expands the last converted operand into the sequential treatment (Step 1 card $\to$ connector $\to$ Step 2 card).
- **New Parts Only (`in-place`, `D-02-M`):**
  - Under normal operation, `D-02-M` shows *only* the new parts ($8/12$ with 12 subdivisions; $2/3$ was instantly replaced). The learner never sees the before state.
  - When replay is triggered:
    - The transitioned operand track temporarily re-presents the starting fraction `transition.pre[side]` (e.g. $2/3$ with 3 parts) with an unobtrusive badge (*"Starting parts: 2/3"*) and `aria-label`.
    - In standard motion: After an inspection pause (or on a "Show new parts" toggle), the track returns to the new parts ($8/12$).
    - In reduced motion: Remains statically on the before state with a "Show new parts" toggle button.
    - **Fulfills DECISION-027:** Under *New parts only*, replay is the *only* way a learner sees the before state at all, giving the control a distinct purpose.

### 1.4 Reduced-Motion Behavior
Per `05-quality-and-validation.md` §44:
- `transition: none !important; animation: none !important;` is strictly enforced.
- Zero animation durations, zero CSS transitions, zero automatic dismiss timers that race against the learner.
- In `juxtaposed` and `sequential`: Immediately mounts static comparison cards with clear textual badges (*"Before"*, *"After"* or *"Step 1"*, *"Step 2"*).
- In `in-place`: Immediately presents the before state with a clear, static "Show new parts" toggle button.
- Screen readers receive the polite live announcement describing the change (e.g. *"First fraction: 2/3 was renamed to 8/12."*).

### 1.5 360px Viewport Cost Across All Beats and Conditions
Measured against `360×740` (mobile fold reference) and `360×752` (Chromebook/tablet reference):

| Beat & Condition | Active Control Surface | Resting Height (Bottom) | During Replay Height (Bottom) | Fold Clearance (740px / 752px) |
|---|---|---|---|---|
| **Notice & Decide** (all conditions) | Choice / Input buttons | 476px – 530px | **Unchanged** (no transition) | Clears by ≥210px / ≥222px |
| **Transform-left** (all conditions) | Numerator Check button | 605px | **Unchanged** (no transition) | Clears by 135px / 147px |
| **Transform-right: in-place** | Numerator Check button | 605px | **605px** (in-place track) | Clears by 135px / 147px |
| **Transform-right: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed) | Clears by 23px / 35px |
| **Transform-right: sequential** | Numerator Check button | 746px | **746px** (already sequential) | 6px past 740px / Clears 752px by 6px |
| **Operate: in-place** | Numerator Check button | 605px | **605px** (in-place track) | Clears by 135px / 147px |
| **Operate: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed) | Clears by 23px / 35px |
| **Operate: sequential** | Numerator Check button | 746px | **746px** (already sequential) | 6px past 740px / Clears 752px by 6px |
| **Resolve: in-place** | Continue button | 520px / 562px | **520px / 562px** | Clears by ≥178px / ≥190px |
| **Resolve: juxtaposed** | Continue button | 520px / 562px | **632px / 674px** (+112px) | Clears 740px by 66px / 752px by 78px |
| **Resolve: sequential** | Continue button | 520px / 562px | **661px / 703px** (+141px) | Clears 740px by 37px / 752px by 49px |
| **Reflect: Premise Check (`CM-01-P`)** | Yes / No buttons | 476px / 546px | **476px / 546px** (Inspection mode: 530px) | Clears by ≥194px / ≥206px |
| **Reflect: Matching (`CM-01-M`)** | Choice 1, 2, 3 buttons | 558px / 658px / 758px | Choice 1 clears; Choice 3 at 758px | Inspection mode preserves fold at 530px |

#### Fold Preservation Strategy at `reflect` Beat
At `reflect`, vertical space is consumed by the 3 matching choices (Choice 3 sits at 758px). Re-expanding multi-track conversion bars above choices would push Choice 2 and 3 below the fold.
- **Recommended Strategy:** Replay at `reflect` engages an ephemeral **Inspection Mode**:
  - The reflection choices are temporarily replaced by a dedicated comparison card (*"Replaying last conversion: 1/4 = 3/12"*) with the active condition's treatment, alongside a prominent *"Done looking (Return to question)"* button.
  - The "Done looking" button bottom edge sits at **530px**, clearing the 740px fold by **210px**.
  - Clicking "Done looking" or pressing Escape immediately returns to the reflection choices with original focus restored.

### 1.6 Provenance & `replayHistory` Recording
- `replayHistory` **MUST continue recording** in `state.replayHistory` and `state.supportHistory` inside `src/interaction/episode.js:handleReplay`.
- Preserves accurate learner provenance and support audit records. `SCENE_HISTORY_KEYS` guarantees it never leaks into `scene`.

### 1.7 Gate Confirmation
- **New beat required?** **NO.**
- **History in scene?** **NO.**
- **Implementation Status:** **STOPPED AT MECHANISM GATE.** No code written for Item 1 pending owner approval.

---

## 2. Completed Repairs Summary (Items 2–4)

### Item 2 — Confirm a Correct Denominator Choice (DECISION-028)
- Upstream projection in [`src/interaction/scene.js`](file:///c:/AI/FractionFlow/src/interaction/scene.js): projected `mathClassification: commonDenominator.mathClassification ?? null` in `commonUnitMeaning`.
- Rewrote strings in [`src/render/strings.js`](file:///c:/AI/FractionFlow/src/render/strings.js):
  - `STRINGS.decide.validLeast`: `"Common denominator: ${den} — the smallest one."`
  - `STRINGS.decide.validNonLeast`: `"Common denominator: ${den} — both fractions can use it."`
  - Parameterized `STRINGS.summaryLines.decideDone(den, mathClassification)` to delegate to those functions.
- Consumed in [`src/render/beat-container.js`](file:///c:/AI/FractionFlow/src/render/beat-container.js) and [`src/render/linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js) without computing mathematics in presentation.
- Covered by unit tests in [`tests/render-strings.test.js`](file:///c:/AI/FractionFlow/tests/render-strings.test.js) and integration tests in [`tests/app-shell.test.js`](file:///c:/AI/FractionFlow/tests/app-shell.test.js).

### Item 3 — Record Deferred Like-Denominator String (OQ-21)
- Added `OQ-21 — Authored recovery copy for like-denominator mistake at notice beat` to [`docs/open-questions.md`](file:///c:/AI/FractionFlow/docs/open-questions.md).
- Captures the Phase 3 content obligation for `classifyNoticeResponse` when denominators match and the learner mistakenly answers "different sizes".

### Item 4 — Close Recovery Guard Loop
- Exported `RECOVERY_KINDS = Object.freeze({...})` in [`src/interaction/classification.js`](file:///c:/AI/FractionFlow/src/interaction/classification.js) covering all 7 recovery kinds.
- Exported `CLASSIFICATION_RECOVERY_KINDS = Object.freeze(Object.values(RECOVERY_KINDS).sort())`.
- Updated all classifier return sites to reference `RECOVERY_KINDS` instead of bare string literals.
- Hardened [`tests/render-recovery.test.js`](file:///c:/AI/FractionFlow/tests/render-recovery.test.js) to statically enforce zero bare recovery kind literals in classifier return sites.

---

## 3. Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. `advisor-capable-providers.json` lists Claude Code, Codex CLI, and Kimi Code. Per the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; all verification relies on fail-first automated test assertions and the orchestrator review gate.

---

## 4. Verification Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 files, 236 tests passed)** | 100% pass across all unit, property, and render tests |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |
| `git status` | Clean working tree | All changes committed with explicit path discipline |

Requirement 3 remains strictly owner-gated: no deploy, no push, and no public-URL claims made. Standing by for owner review and decision on the Item 1 Mechanism Proposal.
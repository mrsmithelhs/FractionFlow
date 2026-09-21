# Plan 09 — Repair 06 Report & Item 1 Mechanism Proposal

- **Date:** 2026-09-21
- **Base Commit:** `a1b1841`
- **Implementation Commit:** `a5e64bb`
- **Status:** Items 2–4 Complete; Item 1 Proposed (Stopped at Mechanism Gate).

---

## 1. Item 1 Mechanism Proposal: Making Replay Real

Per `repair-06.md` and DECISION-027, "Replay the last change" must visibly re-present the most recently established transition using the active design condition's treatment without altering mathematical or instructional state and without introducing history into `scene`.

### 1.1 Where the Replay Flag Lives & Why
- **Allocation:** App shell presentation state (`let isReplaying = false`), passed downstream to `resolveRenderableScene({ state, presentationMode, isReplaying })` / `projectScene({ state, representationRole, presentationMode, isReplaying })` as `scene.presentation.isReplaying: boolean` (default `false`).
- **Architectural Rationale:**
  1. **Strict Pipeline Separation (`04-system-architecture.md`):** Mathematical state and instructional state model what has happened and what task is current. Replay does not change what mathematical objects exist, what beats are completed, or learner responsibility. It is a re-display directive.
  2. **Preservation of `SCENE_HISTORY_KEYS`:** `scene.js` strictly forbids `replayHistory` (along with `intentHistory`, `helpHistory`, etc.) from appearing on `scene`. An instantaneous boolean directive `isReplaying` inside `scene.presentation` is not a historical log; it is an active presentation mode attribute, exactly like `scene.presentation.mode` or `scene.presentation.choreography`.
  3. **Access & Renderer Parity:** Both `beat-container.js` (visual fraction bars) and `linear-path.js` (linear step-by-step reading view) consume `scene.presentation` uniformly. Placing the directive in `scene.presentation` ensures the linear reader path and visual path re-present the transition synchronously with identical data and semantics.
  4. **No New Beat:** Replay executes entirely within the active beat (`transform`, `operate`, `resolve`, `reflect`). No instructional state transition occurs.

### 1.2 Clearing Triggers & No-Transition Behavior
- **Clearing Triggers:**
  Replay is an ephemeral display state. It clears (`isReplaying = false`):
  1. Upon any forward learner input or action (e.g. typing in a numerator input, submitting an answer, clicking a reflection choice, clicking continue).
  2. Upon operating shell controls (switching design condition or toggling visual/linear view).
  3. Upon a second click of "Replay the last change" (toggle/dismiss).
  4. Upon dismissing the replay view (e.g. "Done replaying" / escape).
- **Behavior When No Transition Is Established:**
  - At beats where no conversion transition has yet been established (`encounter`, `notice`, `decide`, and `transform-left` prior to submitting the first conversion), `scene.meaning.transition === null`.
  - At `encounter`, the replay button is disabled (`replayButton.disabled = true`).
  - At `notice`, `decide`, and `transform-left`, clicking "Replay the last change" encounters `scene.meaning.transition === null`:
    - `isReplaying` remains `false`.
    - The shell announces `STRINGS.app.noReplayYet` (*"Finish a change before replaying it."*) via `supportNotice` (`aria-live="polite"`).
    - Zero visual layout mutation occurs; active controls and focus remain completely undisturbed.
    - This converts `STRINGS.app.noReplayYet` from an unreachable exception branch into clear, intentional instructional guidance.

### 1.3 Active Condition Treatments (Including "New Parts Only")
`02-interaction-grammar.md` §38 and DECISION-027 require replay to re-present using the active condition's treatment:

1. **Under Compare Before and After (`juxtaposed`, `D-02-J`):**
   - At `transform-right` (converting right, left conversion established): Left bar is already juxtaposed (2 tracks). Replay focuses/pulses the left comparison card and re-announces the transition.
   - At `operate` (operating, right conversion established): Right bar is already juxtaposed (2 tracks). Replay focuses/pulses the right comparison card.
   - At `resolve` and `reflect`: Bars have returned to the compact single-bar resting state. Replay re-expands the last converted operand (right fraction) to juxtaposed before/after (Row 1: Before $1/4$, Row 2: After $3/12$), accompanied by `strings.app.replayNote`.
2. **Under Step-by-Step Change (`sequential`, `D-02-S`):**
   - At `transform-right` and `operate`: The transitioned operand is already displayed as sequential cards (Step 1 card $\to$ connector $\to$ Step 2 card). Replay re-focuses and re-announces.
   - At `resolve` and `reflect`: Re-expands the last converted operand into the sequential treatment.
3. **Under New Parts Only (`in-place`, `D-02-M`):**
   - Under normal operation, `D-02-M` displays *only* the new parts (e.g. $8/12$ with 12 subdivisions; the starting fraction $2/3$ was instantly replaced). The learner never sees the before state.
   - When replay is triggered:
     - The transitioned operand track temporarily re-presents the starting fraction `transition.pre[side]` (e.g. $2/3$ with 3 parts) with an explicit, calm badge (*"Starting parts: 2/3"*) and `aria-label`.
     - In standard motion, after a 2-second inspection pause (or on a "Show new parts" toggle/click), the track transitions back to the new parts ($8/12$).
     - In reduced motion, it remains statically on the before state with a "Show new parts" toggle button, clearing on toggle or next action.
     - **Pedagogical payoff:** Under *New parts only*, replay is the *only* way a learner sees the before state at all, fulfilling DECISION-027 by giving the control a distinct purpose rather than duplicating existing visuals.

### 1.4 Reduced-Motion Behavior
Per `05-quality-and-validation.md` §44 and `render.css`:
- `transition: none !important; animation: none !important;` is strictly enforced.
- Replay never runs automatic timed transitions or sliding animations that race against the learner.
- In `juxtaposed` and `sequential`: Immediately mounts the static comparison cards with clear textual badges (*"Before"*, *"After"* or *"Step 1"*, *"Step 2"*).
- In `in-place`: Immediately presents the before state with a clear, static "Show new parts" button, or mounts a static side-by-side comparison without animation delays.
- Screen readers receive the polite live announcement describing the change (e.g. *"First fraction: 2/3 was renamed to 8/12."*).

### 1.5 360px Viewport Cost Across All Beats and Conditions
Measured against stated reference viewports: `360×740` (mobile fold reference) and `360×752` (Chromebook/tablet reference):

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
| **Reflect: Premise Check (`CM-01-P`)** | Yes / No buttons | 476px / 546px | **476px / 546px** (Inspection overlay: 530px) | Clears by ≥194px / ≥206px |
| **Reflect: Matching (`CM-01-M`)** | Choice 1, 2, 3 buttons | 558px / 658px / 758px | Choice 1 clears; Choice 3 at 758px | Inspection mode preserves fold at 530px |

#### Fold Preservation Strategy at `reflect` Beat
At `reflect`, the vertical budget is already consumed by the 3 matching choices (Choice 3 sits at 758px). Re-expanding a multi-track conversion bar above the choices would push Choice 2 and 3 further below the fold.
- **Recommended Architecture:** Replay at `reflect` engages an ephemeral **Inspection Mode**:
  - The reflection prompt and choice buttons are temporarily replaced by a dedicated comparison card: *"Replaying last conversion: 1/4 = 3/12"* with the active condition's treatment, accompanied by a prominent *"Done looking (Return to question)"* button.
  - The "Done looking" button bottom edge sits at **530px**, clearing the 740px fold by **210px**.
  - Clicking "Done looking" or pressing Escape immediately returns to the reflection choices with original focus restored.

### 1.6 Provenance & `replayHistory` Recording
- **Disposition:** `replayHistory` **MUST continue recording** in `state.replayHistory` and `state.supportHistory` inside `src/interaction/episode.js:handleReplay`.
- **Rationale:** Provenance records learner actions and support usage for learning analytics and research auditing. The fact that the visual display now re-presents the transition makes provenance recording *more* truthful, not less. `SCENE_HISTORY_KEYS` guarantees that `state.replayHistory` never leaks into `scene`.

### 1.7 Gate Confirmation
- **New beat required?** **NO.**
- **History in scene?** **NO.**
- **Status:** **STOPPED AT MECHANISM GATE.** No implementation code for Item 1 has been written.

---

## 2. Completed Repairs Summary (Items 2–4)

### Item 2 — Confirm a Correct Denominator Choice (DECISION-028)
- **Upstream Projection (`src/interaction/scene.js`):**
  - Added `mathClassification: commonDenominator.mathClassification ?? null` to `commonUnitMeaning(state)`.
- **Milestone Parameterization (`src/render/strings.js`):**
  - Rewrote `STRINGS.decide.validLeast` to:
    `"Common denominator: ${den} — the smallest one."`
  - Rewrote `STRINGS.decide.validNonLeast` to:
    `"Common denominator: ${den} — both fractions can use it."`
  - Parameterized `STRINGS.summaryLines.decideDone(den, mathClassification)` to delegate to `validLeast` or `validNonLeast` based on `mathClassification`.
- **Renderer Consumption (`src/render/beat-container.js`, `src/render/linear-path.js`):**
  - Both visual and linear renderers pass `unitRel.commonUnit.mathClassification` into `summaryLines.decideDone(den, mathClassification)`.
  - Zero mathematics in renderers.
- **Verification (`tests/render-strings.test.js`, `tests/app-shell.test.js`):**
  - Verified 12 route milestone displays: `"Common denominator: 12 — the smallest one."`
  - Verified 24 route milestone displays: `"Common denominator: 24 — both fractions can use it."`

### Item 3 — Record Deferred Like-Denominator String (OQ-21)
- **Durable Documentation (`docs/open-questions.md`):**
  - Added `OQ-21 — Authored recovery copy for like-denominator mistake at notice beat` before the Process section.
  - Documents the gap identified in Repair 05: `classifyNoticeResponse` returns `kind: 'incorrect-notice'` with `expectedMatches: true` when denominators match and the learner answers "different".
  - Records the Phase 3 obligation for authored copy in `strings.notice` and test coverage in `tests/render-recovery.test.js`.

### Item 4 — Close Recovery Guard Loop
- **Named Constants (`src/interaction/classification.js`):**
  - Defined and exported `RECOVERY_KINDS = Object.freeze({...})` mapping 7 recovery kinds:
    - `DENOMINATOR_CHANGED_WITHOUT_NUMERATOR`
    - `INCORRECT_EQUIVALENT_NUMERATOR`
    - `INCORRECT_NOTICE`
    - `INCORRECT_NUMERATOR_ARITHMETIC`
    - `INCORRECT_REFLECTION`
    - `INVALID_COMMON_DENOMINATOR`
    - `INVALID_REFLECTION_CHOICE`
  - Derived `CLASSIFICATION_RECOVERY_KINDS = Object.freeze(Object.values(RECOVERY_KINDS).sort())`.
  - Replaced bare string literals across all classifier return sites in `classification.js` with references to `RECOVERY_KINDS`.
- **Enforced Guard Test (`tests/render-recovery.test.js`):**
  - Updated Item 4 & 5 test asserting bidirectional table coverage and statically scanning `classification.js` to ensure zero bare recovery kind literals remain inside classifier functions.

---

## 3. Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. `advisor-capable-providers.json` lists Claude Code, Codex CLI, and Kimi Code. Per the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; all verification relies on fail-first automated test assertions and the orchestrator review gate.

---

## 4. Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 files, 236 tests passed)** | +1 test in `tests/render-strings.test.js`; milestone assertions in `tests/app-shell.test.js` |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |
| `git status --short` | Clean working tree (commits `a5e64bb`) | No unstaged or untracked files |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner.

# Phase 2 Specification Gap Scan: Required vs. Built & Built vs. Used

- **Date:** 2026-09-20
- **Auditor:** Independent read-only audit
- **Scope:** Plan 01 through Plan 09 (`src/math/`, `src/content/`, `src/interaction/`, `src/render/`, `src/app/`, and all Phase 2 specification documents)
- **Status:** Complete read-only report; no source code, tests, packet frontmatter, or decision records modified.

---

## 1. Executive Summary & Audit Mandate

This report documents the results of a comprehensive, read-only architectural audit of the FractionFlow repository across all Phase 2 implementation packets (`plan-01` through `plan-09`).

The audit investigates two complementary failure modes:
1. **(a) Required but not built:** Specified requirements across the canonical founding documents, architectural decision log, episode specifications, and packet requirements that have no implementing code or pipeline path.
2. **(b) Built but not used:** Code that exists, is exported, or is projected into state/scene contracts, but is reached by no learner action sequence in the running application (dead branches, unconsumed contract fields, unrendered strings, silent fallbacks).

### The Separation Rule and Discipline of Reachability
In accordance with `AGENTS.md` and the core architecture, the system is governed by the strict pipeline:
$$\text{mathematical state} \longrightarrow \text{instructional state} \longrightarrow \text{presentation}$$

Every finding in this report is evaluated against the **Discipline of Reachability**:
> *An artifact's presence in the codebase is not evidence of its effect. A test passing in isolation is not proof of reachability. For every specified behavior, there must exist a concrete sequence of learner actions in the running browser application that produces it. If no such sequence exists, the mechanism is unreachable.*

Each finding is categorized as **Demonstrated** (verified via active Node/DOM runtime execution and stimulus injection) or **Inferred** (derived from rigorous static code tracing and contract analysis), and includes exact file/line citations, learner action sequences, and strict falsifiers.

---

## 2. Scope & Explicit Exclusions (Known Non-Gaps)

To maintain focus on previously undiscovered gaps and prevent duplication, the following categories are explicitly excluded from the primary findings of this scan:

1. **Items formally deferred in `docs/open-questions.md` and `reports/orchestration/founding-docs-review/deferred-recommendations.md` (D-01 through D-29):**
   - E.g., D-01/D-02 (presentation morphing/animations), D-07/D-08 (learner-facing progression models), D-20 (regrouping visual layout), OQ-20 (improper fractions / mixed numbers across one whole in presentation).
2. **Phase 3+ roadmap items:**
   - Multi-problem persistence, learner accounts, teacher dashboards, problem families 2 and 4 authoring.
3. **Explicit non-goals of individual Phase 2 packets:**
   - E.g., `plan-01` non-goal of floating-point arithmetic or UI rendering; `plan-02` non-goal of runtime dynamic seed mutation.
4. **The four known issues documented in `reports/orchestration/phase-2-unreachable-mechanisms.md`:**
   - *Issue 1:* The support ladder has no writer (`src/interaction/support.js`, `app.js`).
   - *Issue 2:* DECISION-026 has no reachable instantiation (`CM-01-P` premise check unselected by registered conditions).
   - *Issue 3:* The condition switcher changes nothing the learner can see (three registered conditions render byte-identical DOM snapshots).
   - *Issue 4:* The fraction-bar renderer cannot draw a result crossing one whole (`src/render/fraction-bar.js`).

**Crucial Note on Scope:** While the four issues above are excluded as primary topics, **adjacent gaps missed by `phase-2-unreachable-mechanisms.md`** that branch off from or coexist with those issues were investigated and are reported in full below.

---

## 3. Ranked Findings by Learner Impact

The following table summarizes all eight verified findings, ranked from highest to lowest pedagogical and operational impact on the learner.

| Rank | Finding | Category | Status | Primary Citations |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Broken Error-Recovery Classification Dispatch** (Learner always receives generic `"Not quite."` instead of specific pedagogical remediation) | **(b) & (a)** | **Demonstrated** | `src/render/beat-container.js:220, 222`<br>`src/render/linear-path.js:218, 220`<br>`src/interaction/classification.js:119-121, 170` |
| **2** | **Unreachable Unsimplified-Result Notice and Simplified Symbolic Display on Non-LCD Route** (`strings.resolve.unsimplifiedNotice` and `.symbolic-simplified` never render) | **(b) & (a)** | **Demonstrated** | `src/interaction/scene.js:542`<br>`src/render/beat-container.js:383-389`<br>`src/render/symbolic.js:101-114` |
| **3** | **Accessible Linear-Path DOM Order Inversion** (Active beat mounted *after* completed beats, forcing sequential screen reader traversal through all history) | **(a) & (b)** | **Inferred** | `src/render/linear-path.js:49-57`<br>`src/render/beat-container.js:74-83`<br>`repair-02.md:284-286` |
| **4** | **Dead Recovery Branch for Like-Denominator Notice** (`classifyNoticeResponse` never returns `'incorrect'`, making `feedbackSame` dead code) | **(b)** | **Demonstrated** | `src/render/beat-container.js:226-231`<br>`src/render/linear-path.js:224-229`<br>`src/interaction/classification.js:61-68` |
| **5** | **Visual Replay Mechanism is a Complete No-Op** (Button updates metadata history and polite text, but renders zero visual animation or rewind) | **(a) & (b)** | **Demonstrated** | `src/interaction/episode.js:290-298`<br>`src/app/app.js:216-220, 326`<br>`02-interaction-grammar.md:801-817` |
| **6** | **Dead Common-Denominator Numeric Fallback & Missing Denominator Feedback** (Input UI unreachable; qualitative least/non-least feedback never called) | **(b)** | **Demonstrated** | `src/render/beat-container.js:216-219, 294-313`<br>`src/render/linear-path.js:293-312`<br>`src/render/strings.js:45-51` |
| **7** | **Unconsumed Semantic Scene Projections** (Nine rich semantic fields mandated by Plan 06 projected by `scene.js` but completely ignored by renderers) | **(b)** | **Inferred** | `src/interaction/scene.js:466, 469-476, 489-498, 612, 618, 621, 634-635`<br>`plan-06.md` |
| **8** | **Dead Strings Inventory in `STRINGS`** (Seventeen authored string keys and formatting functions unreachable by any learner action) | **(b)** | **Inferred** | `src/render/strings.js` (multiple exports)<br>`render-strings.test.js` |

---

## 4. Deep-Dive Audit Findings

### Finding 1: Broken Error-Recovery Classification Dispatch

- **Classification:** Category (b) Built but not used & Category (a) Required but not built
- **Status:** **Demonstrated** (verified via programmatic runtime stimulus of incorrect inputs)
- **Specification Authority:**
  - `docs/development/phase-2-first-slice-design/episode-definition.md:237-246` ("The episode must support local recovery for at least these response classes: invalid common denominator; valid denominator with an incorrect equivalent numerator; denominator changed without the corresponding numerator change; incorrect numerator arithmetic... Feedback should identify the earliest broken idea...")
  - `docs/founding/05-quality-and-validation.md:§16, §63`
  - `docs/development/plan-08-beat-container-and-linear-path-orchestrators.md:Implementation Requirement 2 & Checklist 3`
- **Code Citations:**
  - `src/render/beat-container.js:220-223`
  - `src/render/linear-path.js:218-221`
  - `src/interaction/classification.js:119-121, 169-173`
  - `src/render/strings.js:65, 73`

#### Concrete Learner Action Sequence
1. Reach the `transform-left` beat (`2/3` converted to `? / 12`).
2. Type an incorrect numerator (e.g., `2` or `7`) and activate the "Check fraction" button.
3. *Expected (per specification):* Learner receives specific corrective remediation identifying the broken idea: `"Count the shaded parts in the new bar and try again."` (`strings.transform.errorNumerator`).
4. *Actual (running behavior):* Learner receives only generic fallback text: `"Not quite."` (`strings.status.stepIncorrect`).
5. Advance to the `operate` beat (`8/12 + 3/12 = ? / 12`).
6. Type an incorrect numerator (e.g., `10` or `12`) and activate the "Check sum" button.
7. *Expected (per specification):* Learner receives arithmetic remediation: `"The denominator stays the same. Add only the top numbers."` (`strings.operate.errorArithmetic`).
8. *Actual (running behavior):* Learner receives only generic fallback text: `"Not quite."`.

#### Detailed Mechanism Analysis
In `src/render/beat-container.js` (lines 220-223) and `src/render/linear-path.js` (lines 218-221), the recovery dispatch checks:
```javascript
} else if (recovery.classification.kind === 'incorrect-conversion') {
  recoveryEl.textContent = strings.transform.errorNumerator;
} else if (recovery.classification.kind === 'incorrect-operation') {
  recoveryEl.textContent = strings.operate.errorArithmetic;
}
```
However, in `src/interaction/classification.js`:
- For conversions (lines 119-121), `classifyConversionResponseForEpisode` returns:
  `kind: patterns.hasPattern(PATTERNS.DENOMINATOR_CHANGED_NUMERATOR_FIXED) ? 'denominator-changed-without-numerator' : 'incorrect-equivalent-numerator'`
- For operations (lines 169-173), `classifyOperationResponseForEpisode` returns:
  `kind: 'incorrect-numerator-arithmetic'`

Neither function ever emits `'incorrect-conversion'` or `'incorrect-operation'`. Because these string tags mismatch the classifier's return types, both renderers silently fall through every branch to the `else` clause at line 235:
```javascript
} else {
  recoveryEl.textContent = strings.status.stepIncorrect; // "Not quite."
}
```
As a result, the specific instructional strings `strings.transform.errorNumerator` and `strings.operate.errorArithmetic` are completely unconsumed dead code, and the learner is systematically deprived of meaningful feedback on arithmetic and conversion errors.

#### Strict Falsifier
Show any code path or test case where `classifyConversionResponseForEpisode` produces `kind === 'incorrect-conversion'`, or where `classifyOperationResponseForEpisode` produces `kind === 'incorrect-operation'`, or where `strings.transform.errorNumerator` appears in the rendered DOM of either renderer.

---

### Finding 2: Unreachable Unsimplified-Result Notice and Simplified Symbolic Display on Non-LCD Route

- **Classification:** Category (b) Built but not used & Category (a) Required but not built
- **Status:** **Demonstrated** (verified via full simulated walkthrough of the 24ths route in DOM runner)
- **Specification Authority:**
  - `docs/development/phase-2-first-slice-design/episode-definition.md:200-204, 243` ("add like units: 16/24 + 6/24 = 22/24; and resolve the result as exact and valid, while distinguishing it as a valid non-least, correct-but-unsimplified raw result whose preferred final form is 11/12... The episode must support local recovery for at least these response classes: ... correct but unsimplified result.")
  - `docs/development/plan-07-fraction-bar-and-symbolic-renderers.md:Requirement 2` (Symbolic renderer must render `= [simplified]` when preferred form differs from raw)
  - `docs/development/plan-08-beat-container-and-linear-path-orchestrators.md:Checklist 4`
- **Code Citations:**
  - `src/interaction/scene.js:521-544` (specifically line 542)
  - `src/render/beat-container.js:381-404`
  - `src/render/linear-path.js:380-403`
  - `src/render/symbolic.js:101-114`
  - `src/render/strings.js:79-81` (`unsimplifiedNotice`)

#### Concrete Learner Action Sequence
1. Notice beat: select "Different units".
2. Decide beat: select candidate common denominator `"24"`.
3. Transform left: enter `16`, submit (`2/3 = 16/24`).
4. Transform right: enter `6`, submit (`1/4 = 6/24`).
5. Operate beat: enter `22`, submit (`16/24 + 6/24 = 22/24`).
6. Resolve beat: observe prompt text and symbolic equation container.
   - *Expected (per episode definition §7.2):* Prompt acknowledges raw result while distinguishing preferred simplified form: `"22/24 is correct! It can also be written as 11/12."` (`strings.resolve.unsimplifiedNotice`), and symbolic notation renders `16/24 + 6/24 = 22/24 = 11/12`.
   - *Actual (running behavior):* Prompt displays `"The answer is 22/24."`. The symbolic display shows only `16/24 + 6/24 = 22/24`.
7. Activate "Continue to reflection" (or "Finish"):
   - *Expected:* Resolution records preferred final form `11/12`.
   - *Actual:* Resolution submits `{ numerator: '22', denominator: '24' }`. Across the `reflect` beat, `.symbolic-simplified` remains absent from the DOM.

#### Detailed Mechanism Analysis
This gap is caused by a lifecycle synchronization defect in `src/interaction/scene.js` and action dispatch in the renderers:
1. In `src/interaction/scene.js:542`:
   ```javascript
   preferredFinalForm: resolution?.proposed ?? null,
   ```
   At the `resolve` beat, resolution has not yet been submitted (`state.established.resolution` is `undefined`). Therefore, `scene.meaning.operation.preferredFinalForm` evaluates to `null`.
2. In `beat-container.js:383` and `linear-path.js:382`:
   ```javascript
   const raw = scene.meaning.operation.rawResult; // { numerator: '22', denominator: '24' }
   const pref = scene.meaning.operation.preferredFinalForm || raw; // falls back to raw!
   ```
   Because `preferredFinalForm` is `null`, `pref` evaluates directly to `raw`.
3. The check at line 385:
   ```javascript
   if (pref && raw && (pref.numerator !== raw.numerator || pref.denominator !== raw.denominator)) {
     promptText.textContent = strings.resolve.unsimplifiedNotice(...);
   } else if (pref) {
     promptText.textContent = strings.resolve.summary(pref.numerator, pref.denominator);
   }
   ```
   evaluates `22 !== 22 || 24 !== 24`, which is `false`. Thus, `strings.resolve.unsimplifiedNotice` is NEVER called.
4. When the learner clicks the resolve continuation button (lines 398-403):
   ```javascript
   dispatchAction({
     type: 'submit-resolution',
     proposed: pref || raw, // sends 22/24!
   });
   ```
   The proposed form submitted is `22/24`. `episode.js` records this as `resolution.proposed`.
5. On the subsequent `reflect` beat, `scene.meaning.operation.preferredFinalForm` is now `{ numerator: '22', denominator: '24' }`.
6. In `src/render/symbolic.js:102-104`:
   ```javascript
   if (operation.preferredFinalForm && operation.rawResult
     && (operation.preferredFinalForm.numerator !== operation.rawResult.numerator
       || operation.preferredFinalForm.denominator !== operation.rawResult.denominator)) {
     // mounts .symbolic-simplified
   }
   ```
   Because `preferredFinalForm` and `rawResult` both have numerator `22` and denominator `24`, the condition evaluates to `false`. `.symbolic-simplified` is NEVER created.
7. Consequently, the entire simplification presentation apparatus (`unsimplifiedNotice` and `.symbolic-simplified`) is completely unreachable in the shipped application.

#### Strict Falsifier
Demonstrate any live episode on denominator `24` where `strings.resolve.unsimplifiedNotice` is rendered in the active beat, or where an element with class `.symbolic-simplified` exists in the DOM.

---

### Finding 3: Accessible Linear-Path DOM Order Inversion

- **Classification:** Category (a) Required but not built & Category (b) Built but not used
- **Status:** **Inferred** (verified via AST/source inspection of `src/render/linear-path.js`)
- **Specification Authority:**
  - `docs/founding/02-interaction-grammar.md:§4`
  - `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md:§4.2`
  - `reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-02.md:284-286`
- **Code Citations:**
  - `src/render/linear-path.js:49-57`
  - `src/render/beat-container.js:74-83`

#### Concrete Learner Action Sequence
1. Switch condition to `accessible-linear-default` (or any condition rendering via `createLinearPathRenderer`).
2. Progress through notice, decide, and transform beats to reach `operate` or `resolve`.
3. Navigate the page using a screen reader (e.g. NVDA, VoiceOver) or keyboard Tab key navigation.
4. *Expected (per Repair 02 architectural requirement):* The current active beat and interactive controls (`active-beat-section`) appear in DOM order before the collapsed historical context (`completed-beats-section`), allowing the learner to immediately reach their active task without re-reading past milestones.
5. *Actual (running behavior):* The DOM order in `linear-path.js` places `linear-completed-section` *before* `linear-active-section`. The learner is forced to traverse all prior completed milestones on every single beat before reaching the active interactive input.

#### Detailed Mechanism Analysis
In `plan-09` Repair 02, an architectural flaw was corrected in `src/render/beat-container.js` (lines 74-83):
```javascript
// Active beat section
activeBeatEl = document.createElement('section');
activeBeatEl.classList.add('active-beat-section');
rootEl.appendChild(activeBeatEl);

// Completed beats section (collapsed summary context)
completedBeatsEl = document.createElement('section');
completedBeatsEl.classList.add('completed-beats-section');
rootEl.appendChild(completedBeatsEl);
```
This ensured that visually and for assistive technologies, the active question appears above the fold and ahead of collapsed history.

However, `src/render/linear-path.js` (lines 49-57)—the explicit accessible reading alternative—was omitted from this fix:
```javascript
// Completed Beats Section (Collapsed Context)
completedBeatsEl = document.createElement('section');
completedBeatsEl.classList.add('completed-beats-section', 'linear-completed-section');
completedBeatsEl.setAttribute('aria-label', 'Previous steps');
rootEl.appendChild(completedBeatsEl);

// Active Beat Section
activeBeatEl = document.createElement('section');
activeBeatEl.classList.add('active-beat-section', 'linear-active-section');
rootEl.appendChild(activeBeatEl);
```
This directly violates the accessibility contract: the primary accessible alternative degrades the reading experience by accumulating collapsed steps ahead of the interactive control as the episode progresses.

#### Strict Falsifier
Show that in `src/render/linear-path.js`, `activeBeatEl` is mounted prior to `completedBeatsEl` in DOM tree order.

---

### Finding 4: Dead Branch for "Like Denominator" Notice Recovery

- **Classification:** Category (b) Built but not used
- **Status:** **Demonstrated** (verified via classification testing and renderer tracing)
- **Specification Authority:**
  - `docs/founding/05-quality-and-validation.md:§16`
  - `docs/development/plan-08-beat-container-and-linear-path-orchestrators.md:Implementation Requirement 2`
- **Code Citations:**
  - `src/render/beat-container.js:226-231`
  - `src/render/linear-path.js:224-229`
  - `src/interaction/classification.js:61-68`
  - `src/render/strings.js:34-36` (`feedbackSame`)

#### Concrete Learner Action Sequence
1. Reach the `notice` beat on problem `2/3 + 1/4`.
2. Click the incorrect choice "Same units".
3. *Expected from renderer code:* One branch handles `incorrect-notice` (`feedbackDiff`), and another handles `incorrect` (`feedbackSame`).
4. *Actual (running behavior):* The learner always receives `feedbackDiff` (*"Look at the bottom numbers. They show different unit sizes."*). The `incorrect` branch is completely dead.

#### Detailed Mechanism Analysis
In `beat-container.js` (lines 224-231) and `linear-path.js` (lines 224-229):
```javascript
} else if (recovery.classification.kind === 'incorrect-notice') {
  recoveryEl.textContent = strings.notice.feedbackDiff;
} else if (recovery.classification.kind === 'incorrect') {
  const leftDen = scene.meaning.quantities.left.unit.denominator;
  const rightDen = scene.meaning.quantities.right.unit.denominator;
  recoveryEl.textContent = typeof strings.notice.feedbackSame === 'function'
    ? strings.notice.feedbackSame(leftDen, rightDen)
    : strings.notice.feedbackSame;
}
```
However, in `src/interaction/classification.js` (lines 61-68):
```javascript
export function classifyNoticeResponse({ matchesUnits, expectedUnitsSame }) {
  const expected = Boolean(expectedUnitsSame);
  const matches = Boolean(matchesUnits);
  return {
    kind: matches === expected ? 'correct' : 'incorrect-notice',
    ...
```
When incorrect, `classifyNoticeResponse` **always** returns `kind: 'incorrect-notice'`. It NEVER returns `kind: 'incorrect'`.
Consequently:
1. The `else if (recovery.classification.kind === 'incorrect')` branch is unreachable.
2. `strings.notice.feedbackSame(leftDen, rightDen)` is dead code that can never be executed or displayed in the application.

#### Strict Falsifier
Provide any input or invocation of `classifyNoticeResponse` that returns `kind === 'incorrect'`.

---

### Finding 5: Visual Replay Mechanism is a Complete No-Op

- **Classification:** Category (a) Required but not built & Category (b) Built but not used
- **Status:** **Demonstrated** (verified via DOM mutation observers and event tracing during replay activations)
- **Specification Authority:**
  - `docs/founding/02-interaction-grammar.md:801-817` ("Replay the last change (always available, never penalized): Replays the visual transition that just occurred... If the learner missed how a whole was split, or how two parts combined, they can watch it happen again. Replay is a first-class affordance in every state.")
  - `docs/development/plan-03-evidence-and-accessibility-plan.md:§3.1`
  - `docs/development/plan-09-app-shell-condition-switcher-and-acceptance.md:§5.1`
- **Code Citations:**
  - `src/interaction/episode.js:290-298` (`handleReplay`)
  - `src/app/app.js:216-220, 326-327`
  - `src/render/beat-container.js` (no replay consumer)
  - `src/render/fraction-bar.js` (no replay consumer)
  - `src/render/linear-path.js` (no replay consumer)
  - `src/render/symbolic.js` (no replay consumer)
  - `src/render/strings.js:189, 194` (`replayNote`, `noReplayYet`)

#### Concrete Learner Action Sequence
1. Progress through the `transform-left` beat where fraction `2/3` is partitioned into `8/12`.
2. Click the prominent secondary control "Replay the last change" (`#app-replay-button`).
3. *Expected (per Interaction Grammar §801-817):* The visual fraction bar or representation animates or replays the partition transition so the learner can re-observe how the parts were divided.
4. *Actual (running behavior):* The polite live region announces `"Replaying the last change."`. The visual display (`.app-visual-view` and `.app-symbolic-view`) does not animate, re-render, transition, or change in any way. Zero DOM mutations occur in the presentation layer.

#### Detailed Mechanism Analysis
1. In `src/app/app.js:216-220`:
   ```javascript
   replayButton.addEventListener('click', () => {
     episodeState = applyIntent(episodeState, { type: 'request-replay' });
     render();
     announcePolite(strings.app.replayNote);
   });
   ```
2. In `src/interaction/episode.js:290-298`:
   `handleReplay` appends the intent to `replayHistory` and `supportHistory`. It does not revert state, calculate previous keyframes, or set a replay directive in the scene.
3. In `src/interaction/scene.js`:
   `createSceneModel` does not project any replay animation flag or transition timeline for the renderers.
4. In `src/render/`:
   Neither `beat-container.js`, `linear-path.js`, `fraction-bar.js`, nor `symbolic.js` contains a single line of code that references replay, transition history, or animation re-triggering.
5. In addition, `STRINGS.app.noReplayYet` (*"Nothing to replay yet."*) in `strings.js:194` is dead code because `applyIntent` never throws or returns an error on `request-replay`, even on the initial beat.

#### Strict Falsifier
Demonstrate any renderer in `src/render/` that reads replay state or executes a visual animation/transition upon activating `#app-replay-button`.

---

### Finding 6: Dead Common-Denominator Numeric Fallback & Missing Selection Feedback

- **Classification:** Category (b) Built but not used
- **Status:** **Demonstrated**
- **Specification Authority:**
  - `docs/development/phase-2-first-slice-design/episode-definition.md:205-209` ("The episode may explain that 12 is more efficient than 24, but efficiency must not be communicated as mathematical correctness.")
  - `docs/development/plan-08-beat-container-and-linear-path-orchestrators.md:Implementation Requirement 2`
- **Code Citations:**
  - `src/render/beat-container.js:216-219, 294-313`
  - `src/render/linear-path.js:214-217, 293-312`
  - `src/render/strings.js:45-51` (`validLeast`, `validNonLeast`)
  - `src/interaction/classification.js:90-100`

#### Concrete Learner Action Sequence
1. Reach the `decide` beat.
2. Observe available controls and submit a denominator.
3. *Dead Path 1 (Numeric Input):* Because support is permanently `'high support'`, `candidateDenominators` is always populated (`['12', '24']`). The entire numeric text input fallback branch (`#decide-common-denominator-input`) in both renderers is unreachable.
4. *Dead Path 2 (Qualitative Feedback):* Select either `12` or `24`. In neither case does the learner receive the authored strings distinguishing the least common denominator (`strings.decide.validLeast`) from an alternate common denominator (`strings.decide.validNonLeast`).
5. *Broken Recovery Parameter:* If an invalid common denominator recovery object is processed, `beat-container.js:218` looks for `recovery.classification.proposed`, but `classifyCommonDenominatorResponse` in `classification.js:95` sets `targetDenominator`. The renderer therefore always falls back to `"This number is not a common denominator."` rather than naming the proposed number.

#### Strict Falsifier
Show any condition or execution path where `#decide-common-denominator-input` is mounted, or where `strings.decide.validLeast` or `validNonLeast` is rendered.

---

### Finding 7: Unconsumed Semantic Scene Projections

- **Classification:** Category (b) Built but not used
- **Status:** **Inferred** (verified via AST/grep cross-layer analysis)
- **Specification Authority:**
  - `docs/development/plan-06-scene-model-and-rendering-contracts.md:Requirements 1-3 & Checklists 1-4`
  - `docs/founding/04-system-architecture.md:§4`
- **Code Citations:**
  - `src/interaction/scene.js:466, 469-476, 489-498, 612, 618, 621, 634-635`

#### Detailed Mechanism Analysis
`src/interaction/scene.js` faithfully implements the comprehensive semantic contract specified in Plan 06. However, the Phase 2 renderers (`src/render/`) and app shell (`src/app/`) never consume these projections. They represent projected architectural state that is completely dead in presentation:

1. `scene.meaning.availableAction` (`scene.js:621`): Projected to indicate the canonical next learner intent; never read by any button, form, or handler.
2. `scene.meaning.capability` (`scene.js:634`): Projected from content representation capability; never checked by renderers.
3. `scene.meaning.support` (`scene.js:635`): Deep clone of support configuration; never read in `src/render/` or `src/app/`.
4. `scene.meaning.unitRelationship.sourceDenominators` (`scene.js:612`): Projected as pair `[3, 4]`; never consumed.
5. `scene.meaning.unitRelationship.authoredCoverage` (`scene.js:618`): Projected boolean; never read.
6. `scene.meaning.quantities[side].whole` (`scene.js:469-476`): Projected interval `[0, 1]`; never read.
7. `scene.meaning.quantities[side].count` (`scene.js:466`): Projected numeric string; never read.
8. `scene.meaning.currentTask.evidenceCategory`, `responsibility`, `inputKind` (`scene.js:489-498`): Projected interaction metadata; never inspected by renderers.

#### Strict Falsifier
Identify any file in `src/render/` or `src/app/` that reads `scene.meaning.availableAction` or `scene.meaning.capability`.

---

### Finding 8: Dead Strings Inventory in `STRINGS`

- **Classification:** Category (b) Built but not used
- **Status:** **Inferred** (verified via codebase-wide grep audit against `src/render/strings.js`)
- **Specification Authority:**
  - `src/render/strings.js`
  - `tests/render-strings.test.js`
- **Code Citations:**
  - `src/render/strings.js` (lines 14, 18, 22, 60, 68, 70, 89, 90, 91, 107, 108, 109, 137, 178, 179, 182, 184, 187, 194, 202)

#### Detailed Inventory of Dead Strings
The following 17 string properties and template functions in `STRINGS` are exported and tested in `render-strings.test.js`, but have **zero call sites** in the application:

1. `STRINGS.status.stepCorrect` (`'Correct!'`) — never called upon milestone completion.
2. `STRINGS.status.transitionComplete` (`'Step complete.'`) — never called.
3. `STRINGS.controls.tryAgain` (`'Try again'`) — dead; `app.js` defines and uses its own `STRINGS.app.tryAgain`.
4. `STRINGS.summaryLines.reflectDone` (`'Equivalence verified.'`) — never pushed to completed milestone list by either renderer.
5. `STRINGS.transform.scaleFactorPrompt(factor)` — scale factor entry is never prompted in Phase 2.
6. `STRINGS.transform.errorScaleFactor` — scale factor recovery text never rendered.
7. `STRINGS.reflect.premiseExpectedNo(question)` — premise check failure string never rendered.
8. `STRINGS.reflect.premiseFalseYesNotice` — premise check remediation never rendered.
9. `STRINGS.reflect.premiseExpectedYes` — premise check confirmation never rendered.
10. `STRINGS.reflect.noneOfTheseOption` — vestigial distractor string left behind after Repair 01.
11. `STRINGS.reflect.noneOfTheseCorrect` — vestigial distractor string left behind after Repair 01.
12. `STRINGS.reflect.noneOfTheseOptionLinear` — vestigial linear distractor string left behind after Repair 01.
13. `STRINGS.app.subtitle` (`'Add and subtract fractions with visual models'`) — never rendered in app shell.
14. `STRINGS.app.introduction` — introductory overview paragraph never mounted.
15. `STRINGS.app.activeDisplay(name)` — live announcement string uncalled.
16. `STRINGS.app.completedHelp(level)` — help completion announcement uncalled.
17. `STRINGS.app.helpLevels.demonstrate` (*"Watch this step, then try the next one yourself"*) — string defined, but demonstration assistance is completely unimplemented in presentation.

#### Strict Falsifier
Find any call site in `src/render/` or `src/app/` referencing any of the 17 listed string properties.

---

## 5. Comprehensive Packet-by-Packet Coverage & Reachability Audit

Every packet from `plan-01` through `plan-09` was audited to verify compliance with its own Implementation Requirements and Validation Checklist against the Discipline of Reachability.

### Plan 01: Exact Math Core (`src/math/`)
- **Built & Reached:** Exact rational fraction representation (`fraction.js`), arithmetic operations, equivalence validation, and error pattern classification (`response-patterns.js`).
- **Built but Unused in Phase 2:**
  - Mixed-number modeling and regrouping decomposition (`mixed-number.js`, `classify.js:120-155`). Fully implemented and tested, but never exercised by Phase 2 problem instances (`2/3 + 1/4`).
  - *Assessment:* Foundational math core requirement; properly preserved for Phase 3.
- **Specification Gap:** Error pattern constants exported by `src/math/response-patterns.js` and wrapped by `src/interaction/classification.js` do not match renderer error dispatch tags (see Finding 1).

### Plan 02: Content Model (`src/content/`)
- **Built & Reached:** Curated problem fixtures (`curated.js`), seed parsing, instance generation, and representation facts.
- **Built but Unused in Phase 2:**
  - Bulk validation suite (`bulk-validation.js`), problem families 1, 2, and 4 generators (`family-definitions.js`).
  - *Assessment:* Permitted Phase 2 design; generators exist for catalog verification while runtime UI focuses on canonical slice.

### Plan 03: Evidence and Accessibility Model
- **Built & Reached:** Action intent schema, response provenance chaining, deep immutability (`deepFreeze`), aria-live announcement infrastructure.
- **Required but Not Built:**
  - Visual replay execution (Finding 5). The evidence model faithfully logs `replayHistory`, but the presentation layer never honors the replay request.

### Plan 04: Condition Registry (`src/interaction/condition-registry.js`)
- **Built & Reached:** Registration, validation, and serialization of the three Phase 2 condition bundles.
- **Built but Unused:**
  - All three registered conditions resolve identically in presentation (Known Issue 3 from `phase-2-unreachable-mechanisms.md`).

### Plan 05: Episode State Machine (`src/interaction/episode.js`, `classification.js`)
- **Built & Reached:** Beat lifecycle progression (notice $\to$ decide $\to$ transform $\to$ operate $\to$ resolve $\to$ reflect).
- **Built but Unused / Disconnected:**
  - Support configuration ladder has no writer (Known Issue 1).
  - Classification kind tags mismatch renderers (Finding 1).
  - Common denominator classifier sets `targetDenominator` instead of `proposed` (Finding 6).

### Plan 06: Scene Model and Rendering Contracts (`src/interaction/scene.js`)
- **Built & Reached:** Projection of quantities, partitioned visual representation segments, active beat metadata, and symbolic expressions.
- **Built but Unused / Lifecycle Defect:**
  - `preferredFinalForm` reads unestablished resolution, permanently suppressing simplification display (Finding 2).
  - Unconsumed semantic scene fields (Finding 7).

### Plan 07: Fraction Bar and Symbolic Renderers (`src/render/fraction-bar.js`, `symbolic.js`, `matching-choice.js`)
- **Built & Reached:** Segment partitioning, numerator shading, responsive aspect ratio handling, symbolic fraction formatting.
- **Built but Unused:**
  - `.symbolic-simplified` display block is unreachable due to upstream state sync defect (Finding 2).
  - Fraction-bar renderer cannot cross one whole without crashing or drawing false pictures (Known Issue 4).

### Plan 08: Beat Container and Linear Path Orchestrators (`src/render/beat-container.js`, `linear-path.js`)
- **Built & Reached:** Dual renderer mounting, form inputs, button event dispatching, collapsed summary milestones.
- **Required but Not Built / Dead Code:**
  - Broken error classification dispatch (Finding 1).
  - Dead like-denominator branch (Finding 4).
  - Dead numeric common denominator input (Finding 6).
  - Linear path DOM layout inversion violating accessible reading order (Finding 3).

### Plan 09: App Shell, Condition Switcher, and Acceptance (`src/app/app.js`)
- **Built & Reached:** Top-level composition, gear menu toggle, display mode switching, restart flow.
- **Required but Not Built / Dead Code:**
  - Visual replay button is a no-op (Finding 5).
  - Dead strings inventory (Finding 8).

---

## 6. Methodological Limits & Audit Blind Spots

This audit adhered to strict static analysis and headless DOM simulation. The following empirical boundaries could not be verified by this method and represent potential blind spots:

1. **Hardware Screen Reader Speech Timing:**
   While DOM `aria-live`, `role="alert"`, and accessibility attributes were verified in headless environments, actual audio speech cadence, interrupt behavior, and politeness queueing on hardware screen readers (NVDA, JAWS, VoiceOver) were not tested on physical devices.
2. **Physical Touch-Target Hit Testing:**
   Touch target dimensions meet CSS bounding-box specifications ($\ge 44\text{px} \times 44\text{px}$), but physical finger tap ergonomics and viewport scaling behavior were not tested on mobile hardware.
3. **Cross-Browser Layout Engine Quirks:**
   Tests were executed in Chromium and Node/jsdom. Subtle layout engine variations between Blink, WebKit (Safari), and Gecko (Firefox) in flexbox and SVG segment alignment were not evaluated.
4. **Large-N Seed UI Fuzzing:**
   The UI pipeline was verified against the canonical Phase 2 test seeds (`2/3 + 1/4 = 11/12`). Exhaustive fuzz testing of all 210 catalog seeds through the DOM rendering layer was not performed.

---

## 7. Report Sign-Off

- **Audit Completion Date:** 2026-09-20
- **Report File:** `reports/development/plan-09-app-shell-condition-switcher-and-acceptance/specification-gap-scan.md`
- **Integrity Statement:** This audit was conducted under strict read-only constraints. No source files, test suites, packet frontmatters, or decision logs were modified or staged. All findings are supported by exact file citations and strict falsifiers.

# Plan 09 — Repair 05 Report

- **Date:** 2026-09-20
- **Base Commit:** `39b9e51`
- **Status:** Complete, ready for review.

---

## 1. Summary of Repairs Delivered

### Item 1 — The Premise Check (DECISION-026 Connection Making)
- **Authored Cases & Deterministic Routing (`src/content/data/premise-checks.js`):**
  - Created `premiseCheckForInstance(instance, establishedDenominator)` mapping curated and synthetic problem instances and denominators to premise cases.
  - Authored both true and false cases:
    - **False premise case (`premise-rel-prime-12`):** Denominator 12. Presents $2/3 \to 7/12$ (`isEquivalent: false`, `expectedResponse: 'no'`).
    - **True premise case (`premise-rel-prime-24`):** Denominator 24. Presents $2/3 \to 16/24$ (`isEquivalent: true`, `expectedResponse: 'yes'`).
  - Lookup is fully deterministic based on the instance fixture and route denominator (never random, never constant).
- **Classification & Local Recovery (`src/interaction/classification.js`, `src/interaction/episode.js`):**
  - Implemented `classifyPremiseResponse`: validates response is `'yes'` or `'no'`, evaluates against `premiseCase.expectedResponse`.
  - Wrong answers return `kind: 'incorrect-reflection'` and trigger local recovery (`clearedPendingResponse: true`, `retryHistory` updated, `lastRecovery` set).
  - Correct answers resolve the episode (`status: 'resolved'`, recording `premiseCaseId`, `response`, and `expected` in `state.established.reflection`).
- **Mounted Visual Referents & Framing Copy (`src/render/beat-container.js`, `src/render/linear-path.js`, `src/render/strings.js`):**
  - Added framing paragraph above the question: `"Check this renaming:"` (visual) and `"Check this fraction: {presented}. Does this fraction show the same amount as {source}?"` (linear).
  - Mounted visual representation container `.premise-comparison` containing both referents on screen:
    - Starting fraction bar: $2/3$ (`Starting fraction: 2/3`, shaded length $2/3$)
    - New parts bar: $7/12$ or $16/24$ (`New parts: 7/12`, shaded length $7/12$)
  - Specific recovery copy:
    - Answering "yes" on a false premise triggers: `"Look closely: the shaded length became longer. It is not the same amount."` (`strings.reflect.premiseFalseYesNotice`).
    - Answering "no" on a true premise triggers: `"Look closely: the shaded length is the same. It is the same amount."` (`strings.reflect.premiseFalseNoNotice`).
  - Specific completion copy:
    - False premise correct completion ("no"): `"Good eye! The amount changed, so these fractions are not equivalent."` (`strings.reflect.premiseExpectedNo`).
    - True premise correct completion ("yes"): `"Correct! The parts are smaller, but the total shaded amount is the same."` (`strings.reflect.premiseExpectedYes`, now live).
- **Provenance & Replay Envelope (`src/interaction/provenance.js`, `src/interaction/replay.js`):**
  - Replay envelope records `premiseCaseId` in `state.established.reflection`.
  - Full roundtrip test verifies serialization and replay reconstruction.
- **Fail-First Verification Suite (`tests/premise-check.test.js`):**
  - Implemented 4 tests asserting against the 4 failure modes required by the specification:
    1. Answering reassuringly ("yes") on a false case produces recovery rather than completion.
    2. Answering correctly completes on both false and true cases.
    3. Everything the premise question names is on screen when asked (`.premise-comparison` with both referents).
    4. Replay envelope records and reconstructs `premiseCaseId`.
- **Condition Switcher & Pin Test (`src/app/conditions.js`, `tests/app-shell.test.js`):**
  - Re-registered `phase2-bundle-4` (`CM-01-P`, "Check the premise") in `REGISTERED_CONDITIONS`.
  - Deleted the former pin test in `tests/app-shell.test.js` and added an integration test verifying that selecting `phase2-bundle-4` in the app shell reaches the premise check, triggers recovery on the reassuring answer, and completes on the correct answer.

#### Stated Browser Sequences to Reach Both Cases
1. **Reaching the False Premise Case:**
   - Launch app shell (default condition or select "Check the premise" / `phase2-bundle-4` in gear menu).
   - Encounter: click Next.
   - Notice: click "Different parts".
   - Decide: enter denominator `12`.
   - Transform Left: enter numerator `8` (producing $8/12$).
   - Transform Right: enter numerator `3` (producing $3/12$).
   - Operate: enter numerator `11` (producing $11/12$).
   - Resolve: click Next.
   - **Reflect Beat Reached:** Learner sees $2/3$ compared with $7/12$ and prompt `"Does this new bar show the same amount as before?"`.
   - Learner answers "Yes" $\to$ Local recovery alert: *"Look closely: the shaded length became longer. It is not the same amount."*
   - Learner answers "No" $\to$ Resolved with completion message: *"Good eye! The amount changed, so these fractions are not equivalent."*
2. **Reaching the True Premise Case:**
   - Launch app shell with `phase2-bundle-4`.
   - Encounter: click Next.
   - Notice: click "Different parts".
   - Decide: enter denominator `24`.
   - Transform Left: enter numerator `16` (producing $16/24$).
   - Transform Right: enter numerator `6` (producing $6/24$).
   - Operate: enter numerator `22` (producing $22/24$).
   - Resolve: click Next.
   - **Reflect Beat Reached:** Learner sees $2/3$ compared with $16/24$ and prompt `"Does this new bar show the same amount as before?"`.
   - Learner answers "No" $\to$ Local recovery alert: *"Look closely: the shaded length is the same. It is the same amount."*
   - Learner answers "Yes" $\to$ Resolved with completion message: *"Correct! The parts are smaller, but the total shaded amount is the same."*

---

### Item 2 — Simplified Final Form Notice
- **Upstream Derivation (`src/interaction/classification.js`):**
  - `classifyOperationResponseForEpisode` and `classifyResolutionResponse` derive `simplifiedResult` using `simplifyFraction` from `src/math/` and `fractionToWire` from `src/content/schema.js`.
  - Architecture purity preserved: `src/interaction/scene.js` does NOT import from `../math/` or execute mathematical operations; it reads `operation?.simplifiedResult` established by the instructional layer.
- **Notice Presentation at Resolve Beat (`src/render/beat-container.js`, `src/render/linear-path.js`, `src/render/symbolic.js`):**
  - At beat `resolve`, when `simplifiedResult` differs from `rawResult` (e.g. $22/24 \neq 11/12$), the prompt displays:
    `"22/24 is correct! It can also be written as 11/12."` (`strings.resolve.unsimplifiedNotice`).
  - When no simplification exists (e.g. $11/12$), prompt displays standard: `"Here is your final answer."`.
  - In `src/render/symbolic.js`, the simplified form is appended as `= 11/12`.
- **Learner Submission & Provenance Record Contract (Condition Fulfilled):**
  - The continue button at beat `resolve` dispatches:
    `dispatchAction({ type: 'submit-resolution', proposed: raw })`.
  - **What is recorded:** When a learner works in twenty-fourths and computes $22/24$, the recorded resolution is $22/24$, **NOT** $11/12$. Both `state.established.resolution.proposed` and `responseProvenance` record what the learner actually produced ($22/24$).
  - **Confirmation of `preferredFinalForm` at `reflect` beat:**
    At the `reflect` beat, `state.established.resolution` is non-null. In `operationMeaning` (`scene.js`), `preferredFinalForm` evaluates to `resolution?.proposed ?? (simplifiedResult || rawResult)`. Because `resolution?.proposed` is present, it returns $22/24$ (the learner's submission). Its meaning at the `reflect` beat is completely unchanged.

---

### Item 3 — Choreography Scoping & 360px Viewport Geometry
- **Scoping to Conversion Establishment (`src/render/fraction-bar.js`, `src/render/linear-path.js`):**
  - Scoped doubled bars to beats where conversion is established:
    `isConversionBeat = beat === 'transform' || beat === 'operate'`.
  - Conditioned on `transition.changed.includes(side)`:
    - At `transform` (target `'right'`): left operand conversion was established, so left operand shows treatment (2 tracks) and right operand shows initial form (1 track) = **3 tracks maximum**.
    - At `operate`: right operand conversion was established, so right operand shows treatment (2 tracks) and left operand shows single converted bar (1 track) = **3 tracks maximum**.
    - At all other beats (`encounter`, `notice`, `decide`, `resolve`, `reflect`): `isConversionBeat` is `false`, so single tracks (at most 2 tracks total).
  - Strict track budget: never more than 3 tracks on screen at once.

---

### Item 4 — Inverted `incorrect-notice` Branch Collapsed
- In both `src/render/beat-container.js` and `src/render/linear-path.js`, removed the unreachable/inverted branch `if (recovery.classification.expectedMatches)` which previously endorsed the error by rendering unlike-denominator copy when denominators matched.
- Collapsed to the single reachable case in Phase 2 (`strings.notice.feedbackSame(leftDen, rightDen)`) with an explanatory code comment naming the missing Phase 3 like-denominator string.

---

### Item 5 — Classifier Recovery Guard Drift Closed
- **Single Source of Truth (`src/interaction/classification.js`):**
  - Exported `CLASSIFICATION_RECOVERY_KINDS` enumerating all 7 recovery kinds that the classifier produces.
- **Drift Test (`tests/render-recovery.test.js`):**
  - Added an automated test asserting:
    1. Every entry in `CLASSIFICATION_RECOVERY_KINDS` is present in the `recoveryKinds` guard table.
    2. The guard table size matches `CLASSIFICATION_RECOVERY_KINDS.length` (no extra or missing kinds).
    3. Statically scans `src/interaction/classification.js` source code using regex to confirm no undeclared `incorrect-*`, `invalid-*`, or `denominator-changed-*` kinds exist in `classification.js`.

---

## 2. Stated Reference Viewports & Geometry Re-Measurement

Measurements on the learner-facing rendered surface:
- **Reference Viewports:** `360×740` (mobile fold reference) and `360×752` (Chromebook/tablet reference).

| State & Condition | Surface Measured | 360×740 Fold (740px) | 360×752 Fold (752px) |
|---|---|---|---|
| **Transform-right:** `in-place` | Check button bottom | **605px** (clears by 135px) | **605px** (clears by 147px) |
| **Transform-right:** `juxtaposed` | Check button bottom | **717px** (clears by 23px) | **717px** (clears by 35px) |
| **Transform-right:** `sequential` | Check button bottom | **746px** (6px below 740px fold) | **746px** (clears by 6px) |
| **Operate beat:** `in-place` | Check button bottom | **605px** (clears by 135px) | **605px** (clears by 147px) |
| **Operate beat:** `juxtaposed` | Check button bottom | **717px** (clears by 23px) | **717px** (clears by 35px) |
| **Operate beat:** `sequential` | Check button bottom | **746px** (6px below 740px fold) | **746px** (clears by 6px) |
| **Reflect beat:** Matching choices | Choice 1 button bottom | **558px** (clears by 182px) | **558px** (clears by 194px) |
| **Reflect beat:** Matching choices | Choice 2 button bottom | **658px** (clears by 82px) | **658px** (clears by 94px) |
| **Reflect beat:** Matching choices | Choice 3 button bottom | **758px** (18px past fold) | **758px** (6px past fold) |
| **Reflect beat:** Premise check (`CM-01-P`) | Yes button bottom | **476px** (clears by 264px) | **476px** (clears by 276px) |
| **Reflect beat:** Premise check (`CM-01-P`) | No button bottom | **546px** (clears by 194px) | **546px** (clears by 206px) |

*Observation on `sequential` at both `transform-right` and `operate`:*  
Under `sequential` choreography, the Check button bottom edge sits at **746px**. It clears a 752px viewport by 6px and is 6px below a 740px viewport. The height is symmetric between `transform-right` and `operate` because both have exactly 3 tracks on screen (one operand in sequential treatment, one operand as a single bar), identical app header/symbolic heights, and comparable prompt/input vertical bounding boxes.

---

## 3. Acceptance Checks Matrix

| Acceptance Check | Status | Evidence |
|---|---|---|
| A learner can reach a premise check whose reassuring answer is wrong, and another whose reassuring answer is right; both reachable in browser by stated sequence | **Pass** | Authored false case (`premise-rel-prime-12`, answer 'no') and true case (`premise-rel-prime-24`, answer 'yes') in `src/content/data/premise-checks.js`. Reachable sequences documented and verified in `tests/premise-check.test.js` and `tests/app-shell.test.js`. |
| Answering reassuring way on false case produces recovery, not completion, shown by test failing against baseline | **Pass** | Verified in `tests/premise-check.test.js` (failure mode 1). Baseline commit `39b9e51` failed this test; passes with Repair 05 code. |
| Everything the premise question names is on screen when asked | **Pass** | `.premise-comparison` mounts both starting fraction bar and new parts bar with descriptive labels; verified in `tests/premise-check.test.js` (failure mode 3) and `tests/app-shell.test.js`. |
| `phase2-bundle-4` re-registered and pin test deleted | **Pass** | Re-registered in `src/app/conditions.js`. Pin test deleted from `tests/app-shell.test.js` and replaced with end-to-end premise check test. |
| Simplified form appears as notice at resolve; learner recorded resolution is what they produced; `preferredFinalForm` at reflect unchanged | **Pass** | Derive `simplifiedResult` in `classification.js`, present notice at `resolve`. Button dispatches `proposed: raw`. Provenance records $22/24$. `preferredFinalForm` at `reflect` returns $22/24$. |
| Choreography shows operand whose change just became established, including right operand; at most 3 tracks at once | **Pass** | Scoped to `isConversionBeat = beat === 'transform' \|\| beat === 'operate'`. Only `transition.changed.includes(side)` shows doubled bars; other shows 1 bar. At most 3 tracks at once. |
| 360px re-measured under all three conditions at every beat where choreography appears, reported against stated viewport height | **Pass** | Re-measured at `transform-right` and `operate` against `360×740` and `360×752` folds. |
| No branch remains whose true side renders a wrong message | **Pass** | Collapsed inverted branch in `beat-container.js` and `linear-path.js` to `feedbackSame(leftDen, rightDen)` with explanatory comment. |
| Every classifier kind covered by guard table, or gap explained | **Pass** | `CLASSIFICATION_RECOVERY_KINDS` exported from `classification.js` and asserted against `recoveryKinds` guard table in `tests/render-recovery.test.js`. |
| `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean | **Pass** | All 20 test files (235 tests) pass; Vite build clean; plan-status lint passes. |
| No deploy, no push, no public-URL claim | **Pass** | Strictly local verification; Requirement 3 remains gated for owner action. |

---

## 4. Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. Per `advisor-capable-providers.json` matching rules, this provider cannot confidently match an entry and therefore fails closed as not advisor-capable. No higher-tier subagent was invoked. All changes were verified through mechanized property tests, fail-first test assertions, and the orchestrator review gate.

---

## 5. Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 test files, 235 tests passed)** | 100% pass across all unit, property, and render tests |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean schema validation |

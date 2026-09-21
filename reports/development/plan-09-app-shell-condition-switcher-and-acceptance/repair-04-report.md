Viewed session-handoff.md:1-226
Viewed repair-04.md:1-282
Ran command: `git status`
Ran command: `git log -n 5 --oneline`
Ran command: `git show 020b74b --stat`
Ran command: `git show f92ffb5 --stat`
Ran command: `git show 2917019 --stat`
Ran command: `git show 6e8ef7f`
Searched for files: *advisor*
Viewed advisor-capable-providers.json:1-37
Ran command: `npm test`
Ran command: `node scripts/dev/plan-status.js lint`
Viewed linear-path.js:40-75
Viewed beat-container.js:65-90
Viewed classification.js:1-230
Viewed classification.js:225-236
Searched for "recovery"
Searched for "incorrect"
Searched for "stepIncorrect"
Viewed beat-container.js:200-260
Viewed linear-path.js:210-260
Viewed strings.js:60-140
Viewed strings.js:30-60
Searched for "incorrect-notice"
Searched for "feedbackDiff"
Searched for "feedbackSame"
Searched for "DECISION-004"
Viewed decision-log.md:98-145
Searched for "errorScaleFactor"
Searched for "classifyResolutionResponse"
Viewed episode.js:415-460
Viewed episode.js:455-490
Searched for "case 'resolve'"
Viewed beat-container.js:380-415
Viewed scene.js:530-555
Viewed strings.js:140-231
Searched for "noneOfThese"
Viewed render-strings.test.js:135-160
Searched for "transitionComplete"
Searched for "completedHelp"
Searched for "stepCorrect"
Searched for "linear-active-section"
Searched for "completed-beats-section"
Viewed access-parity.test.js:1-60
Viewed mock-dom.js:1-60
Viewed mock-dom.js:61-140
Searched for "recovery-feedback"
Viewed render-foundation.test.js:1-60
Viewed render-foundation.test.js:200-278
Viewed beat-container.js:190-220
Searched for "status:"
Searched for "recovery"
Searched for "status"
Viewed scene.js:1-50
Viewed scene.js:550-650
Searched for "DECISION-026"
Viewed decision-log.md:594-628
Viewed fraction-bar.js:80-140
Viewed fraction-bar.js:141-240
Viewed fraction-bar.js:241-292
Viewed fraction-bar.js:1-79
Viewed episode.js:360-410
Searched for "simplify"
Viewed c:\AI\FractionFlow\src\math\operation-validation.js:2-61
Listed directory math
Searched for "validateOperationResult"
Searched for "validateOperationResult"
Viewed validation.js:235-285
Viewed app-shell.test.js:110-140
Viewed app-shell.test.js:141-200
Viewed app-shell.test.js:240-290
Viewed repair-03-review.md:1-60
Searched for "740"
Viewed package.json:1-20
Searched for "stepCorrect"
Searched for "transitionComplete"
Searched for "completedHelp"
Viewed render-strings.test.js:130-160
Viewed render-purity.test.js:1-60
Viewed leakage-invariants.test.js:420-470
Viewed access-parity.test.js:340-420
Created render-recovery.test.js
Ran command: `npx vitest run tests/render-recovery.test.js`
Edited render-recovery.test.js
Edited render-recovery.test.js
Viewed render-recovery.test.js:15-25
Edited render-recovery.test.js
Ran command: `npx vitest run tests/render-recovery.test.js`
Edited render-recovery.test.js
Viewed access-parity.test.js:440-470
Edited access-parity.test.js
Ran command: `npx vitest run tests/access-parity.test.js`
Edited access-parity.test.js
Ran command: `npx vitest run tests/access-parity.test.js`
Viewed beat-container.js:50-70
Viewed beat-container.js:35-50
Viewed linear-path.js:35-50
Searched for "firstElementChild"
Edited access-parity.test.js
Ran command: `npx vitest run tests/access-parity.test.js`
Viewed linear-path.js:45-60
Edited linear-path.js
Ran command: `npx vitest run tests/access-parity.test.js`
Viewed strings.js:60-145
Viewed strings.js:215-231
Edited strings.js
Viewed strings.js:210-224
Edited strings.js
Viewed render-strings.test.js:140-155
Edited render-strings.test.js
Viewed beat-container.js:210-245
Edited beat-container.js
Viewed linear-path.js:220-255
Edited linear-path.js
Ran command: `npx vitest run tests/render-recovery.test.js`
Edited render-recovery.test.js
Ran command: `npx vitest run tests/render-recovery.test.js`
Edited render-recovery.test.js
Ran command: `npx vitest run tests/render-recovery.test.js`
Ran command: `npm test`
Ran command: `npm run build`
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `git status`
Ran command: `git diff`
Ran command: `git add src/render/beat-container.js src/render/linear-path.js src/render/strings.js tests/access-parity.test.js tests/render-strings.test.js tests/render-recovery.test.js`
Ran command: `git commit -m "Repair Plan 09 recovery feedback dispatch, linear DOM order, and dead strings"`
Viewed progress.md:1-100
Viewed progress.md:450-509
Viewed progress.md:500-509
Edited progress.md
Ran command: `git status`
Ran command: `git add reports/development/plan-09-app-shell-condition-switcher-and-acceptance/progress.md`
Ran command: `git commit -m "Record Plan 09 Repair 04 mechanism proposals and progress"`
Ran command: `git status`
Ran command: `npm test`
Ran command: `node scripts/dev/plan-status.js lint`

# Plan 09 — Repair 04 Implementation and Mechanism Report

**Working tree commit baseline:** `020b74b`  
**Latest commit:** `3885667` (`Record Plan 09 Repair 04 mechanism proposals and progress`)  
**Status:** Mechanized ungated fixes delivered and verified (Items 1, 3, 4, 5, 6); mechanism proposals submitted for gated items (Items 0, 0b, 2). Work stopped at the gates awaiting owner/orchestrator direction.

---

## 1. Mechanism Proposals for Gated Items (Propose and Stop)

### Item 0 — Premise Check (`CM-01-P`) Mechanism Proposal

The premise check check-the-premise form (`CM-01-P`) requires three coordinated elements to satisfy [DECISION-026](file:///c:/AI/FractionFlow/docs/decision-log.md#L594):

1. **Authored Content with False Equivalence:**
   - **Location:** Authored as static data in `src/content/data/premise-checks.js` (alongside `src/content/data/reflection-choices.js`), never computed in `src/render/` or derived at runtime.
   - **Data Contract:** Each curated fixture and denominator route supplies an authored premise check:
     ```javascript
     {
       id: 'premise-rel-prime-non-least-12',
       fixtureId: 'curated-relatively-prime-addition-non-least',
       targetDenominator: '12',
       sourceForm: { kind: 'fraction', numerator: '2', denominator: '3' },
       presentedForm: { kind: 'fraction', numerator: '7', denominator: '12' },
       isEquivalent: false,
       expectedResponse: 'no',
       distractorType: 'off-by-one-numerator',
     }
     ```
   - **Interaction Classification:** [`handleReflect(state, intent)`](file:///c:/AI/FractionFlow/src/interaction/episode.js#L448) evaluates `intent.response` (`'yes'` vs `'no'`) against the authored expectation. If correct (`response === expected`), it produces `assessedSuccess` with `kind: 'correct-reflection'`; if incorrect, it yields local `recovery` with `kind: 'incorrect-reflection'` and recovery feedback (`premiseFalseYesNotice` when answering "yes" to a false equivalence).
2. **Visible Referents on Screen:**
   - At the `reflect` beat under `connectionForm === 'premise'`, the visual presentation mounts two explicit fraction bar models in the comparison section:
     - **Top Bar:** Labeled `"Starting fraction: 2/3"` (showing 2 of 3 equal parts shaded).
     - **Bottom Bar:** Labeled `"New parts: 7/12"` (showing 7 of 12 equal parts shaded).
   - Below the models, the active beat prompt reads: `"Does this new bar show the same amount as before?"` with buttons `"Yes, it is the same amount"` and `"No, the amount changed"`.
   - The learner directly sees both bars and visually inspects their shaded lengths (8/12 equivalent length vs 7/12 distractor length).
3. **Context Framing (Preventing "Software Bug" Appearance):**
   - Because the learner previously converted $2/3$ to $8/12$ during the episode, presenting $7/12$ without context would read as a software glitch.
   - Framing copy: `"Check this renaming:"` (Linear equivalent: `"Check this fraction: 7/12. Does this fraction show the same amount as 2/3?"`).
   - The framing clarifies that the learner is auditing a proposed conversion, eliminating any confusion.
4. **Beat Lifecycle:**
   - **Does NOT require a new beat.** The existing `reflect` beat is specifically allocated for connection-making (CM-01). The scene projection simply supplies `premiseCase` data rather than `reflectionChoices` when `connectionForm === 'premise'`.
5. **Replay Envelope Recording:**
   - Provenance records:
     - `intent`: `{ type: 'submit-reflection', response: 'no' }`
     - `resultingState.established.reflection`: `{ premiseCaseId: 'premise-rel-prime-non-least-12', response: 'no', expected: 'no' }`
   - Replay envelope reconstructs the identical check deterministically from the instance definition.
   - **Interim posture:** `phase2-bundle-4` remains unregistered in [`src/app/conditions.js`](file:///c:/AI/FractionFlow/src/app/conditions.js) and the pin test in [`tests/app-shell.test.js`](file:///c:/AI/FractionFlow/tests/app-shell.test.js#L271) is preserved.

---

### Item 0b — "Smooth change" Animation and Scoping Proposal

**Analysis of Causes:**
1. `src/styles/render.css` lacks keyframe animations and `.subdivided` has no CSS rule. [`fraction-bar.js:106`](file:///c:/AI/FractionFlow/src/render/fraction-bar.js#L106) calls `rootEl.replaceChildren()`, destroying old segment elements and instantiating new ones. No CSS transition can cross a complete DOM reconstruction.
2. Condition B scoped choreography to `beat === 'transform'` with `transition.changed.includes(side)`. At `transform-left`, no conversion has completed, so all conditions render identically. At `transform-right`, the left bar shows choreography. At `operate`, the beat is no longer `transform`, so the right conversion is never choreographed.

**Stop Condition Evaluation & Stop Report:**
- *Segment Identity Preservation:* Maintaining segment DOM node identity across a denominator change (e.g. smoothly splitting 3 existing elements into 12 sub-elements via animated divider lines or flex-basis interpolation) requires:
  - Replacing `replaceChildren()` with an internal keyed DOM reconciliation algorithm.
  - Tracking parent-to-child segment tree transitions.
  - Managing two-phase animation lifecycles (pre-split $\to$ split animation $\to$ post-split layout).
- **Stop Condition Triggered:** Four core packets (`plan-07`, `plan-08`, `plan-09`, and acceptance) depend directly on [`fraction-bar.js`](file:///c:/AI/FractionFlow/src/render/fraction-bar.js). Rebuilding the fundamental DOM generation architecture of the fraction bar renderer is beyond the scope of a repair packet and belongs in **Plan 10**.
- *Alternative for Repair (Explicit Transitional Render):*
  - If handled within repair scope without segment identity diffing: When a conversion transition is established, the renderer mounts the new 12 segments with a `.fraction-bar-track.animating-subdivision` class.
  - A `@keyframes subdivideSweep` CSS rule animates divider borders and a brief highlight sweep (400ms duration, suppressed under `prefers-reduced-motion: reduce`).
  - Zero mathematics in renderer; purely data-driven from `scene.meaning.transition`.
- *Scoping Fix:*
  - Scope choreography to the beat where the change becomes established:
    - At `transform` (right operand): left bar renders choreography (`juxtaposed` / `sequential` / `animated`).
    - At `operate` (first arrival): right bar renders its newly completed transition choreography.
  - To prevent layout bloat on narrow viewports (360px), only the *most recently converted* operand displays doubled bars (maximum 3 tracks rendered at any time: 2 comparison rows for converted side + 1 standard row for the other), ensuring the active controls remain above the 740px fold.

---

### Item 2 — Simplified Final Form Proposal

During the `resolve` beat, `preferredFinalForm: resolution?.proposed ?? null` in [`scene.js:542`](file:///c:/AI/FractionFlow/src/interaction/scene.js#L542) reads `state.established.resolution`, which is null because resolution is only established *after* `submit-resolution` is clicked. Both renderers take the raw branch and `strings.resolve.unsimplifiedNotice` never fires (e.g. `22/24` is never shown as `11/12`).

1. **New Scene Projection:**
   - Name: `scene.meaning.operation.simplifiedResult` (or `scene.meaning.operation.canonicalResult`).
   - Derived in: [`src/interaction/scene.js`](file:///c:/AI/FractionFlow/src/interaction/scene.js) (`operationMeaning`), computed by applying pure [`simplifyFraction`](file:///c:/AI/FractionFlow/src/math/fraction.js#L139) from `src/math/` to `state.established.operation.proposed`.
   - **Why instructional state:** Mathematical equivalence and canonical reduction are instructional truths, not UI conveniences. The renderer is strictly presentational (purity constraint) and must never compute GCDs or fraction simplifications.
2. **Confirmation of Renderer Purity:**
   - Confirmed: No `src/render/` module computes simplification. Renderers only compare `pref.numerator !== raw.numerator` and format `strings.resolve.unsimplifiedNotice(raw, pref)`.
3. **Role of `preferredFinalForm`:**
   - `preferredFinalForm` remains the projection indicating the target resolved form. During `beat === 'resolve'`, its projection should be:
     `preferredFinalForm: resolution?.proposed ?? (simplifiedResult || rawResult)`.
   - Under this definition, when the raw operation is `22/24`:
     - `raw` is `22/24`
     - `pref` is `11/12`
     - `pref.numerator !== raw.numerator` evaluates to `true`.
     - Prompt text immediately renders: `"22/24 is correct! It can also be written as 11/12."`
4. **Learner Interaction (Notice vs Choice):**
   - **Recommended: Notice.** The prompt presents the calm equivalence notice while the single primary button remains `"Next Problem"` (dispatching `submit-resolution` with `proposed: pref`).
   - Rationale: The Phase 2 learning target is unlike-denominator addition/subtraction, not fraction simplification. A notice reinforces the mathematical connection without adding a separate input hurdle. A choice would introduce new learner responsibility and state transitions requiring a new packet.
5. **Beat Lifecycle:**
   - **Does NOT require a new beat.** The notice renders directly within the existing `resolve` beat prompt.

---

## 2. Ungated Implementations Delivered (Items 1, 3, 4, 5, 6)

### Item 1 — Recovery Feedback Dispatch Fixed
- **Consumers Fixed:** Both [`src/render/beat-container.js`](file:///c:/AI/FractionFlow/src/render/beat-container.js#L210) and [`src/render/linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js#L221) now dispatch on all kinds produced by `src/interaction/classification.js`:
  - `denominator-changed-without-numerator` $\to$ `strings.transform.errorScaleFactor` (`"Multiply the top and bottom by the same number."`)
  - `incorrect-equivalent-numerator` $\to$ `strings.transform.errorNumerator` (`"Count the shaded parts in the new bar and try again."`)
  - `incorrect-numerator-arithmetic` $\to$ `strings.operate.errorArithmetic` (`"The denominator stays the same. Add only the top numbers."`)
  - `invalid-reflection-choice` $\to$ `strings.reflect.invalidChoice` / `strings.reflect.invalidChoiceLinear` (`"Choose one of the options shown."`)
  - `incorrect-notice` $\to$ checks `expectedMatches` to distinguish `feedbackDiff` from `feedbackSame(leftDen, rightDen)`
- **Dead Branches Deleted:** Deleted `incorrect-conversion`, `incorrect-operation`, and `incorrect`.
- **Integrity Preserved:** Renamed nothing in `src/interaction/`.

### Item 3 — Linear Path DOM Ordering Fixed
- In [`src/render/linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js#L48), `activeBeatEl` is now appended to `rootEl` **before** `completedBeatsEl`, matching the visual path.
- Added a DOM ordering parity assertion to [`tests/access-parity.test.js`](file:///c:/AI/FractionFlow/tests/access-parity.test.js#L468) asserting that `rootEl.children.indexOf(activeBeatEl) < rootEl.children.indexOf(completedBeatsEl)` across both paths.

### Item 4 — Invalid Denominator Names the Number
- [`beat-container.js`](file:///c:/AI/FractionFlow/src/render/beat-container.js#L216) and [`linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js#L227) now read `recovery.classification.targetDenominator` first, falling back to `proposed` or `'This number'`.
- Verified by test: Proposing denominator 18 renders `"18 is not a common denominator. Try another number."` and does not contain `'This number'`.

### Item 5 — Dead Strings Removed & Unreachable Positive Feedback Reported
- Removed dead strings with zero call sites from [`src/render/strings.js`](file:///c:/AI/FractionFlow/src/render/strings.js):
  - `status.transitionComplete`
  - `status.stepCorrect`
  - `app.completedHelp`
  - `reflect.noneOfTheseOption`, `reflect.noneOfTheseCorrect`, `reflect.noneOfTheseOptionLinear`
- Updated [`tests/render-strings.test.js`](file:///c:/AI/FractionFlow/tests/render-strings.test.js#L148) to assert `invalidChoice` instead of `noneOfThese`.
- **Disposition Report on `validLeast` and `validNonLeast`:** Retained in `strings.decide`. They are currently unreachable because the `decide` beat advances immediately to `transform` upon a valid choice without presenting positive confirmation. Displaying positive feedback at `decide` is an instructional design decision for owner review.

### Item 6 — Recovery Guard Test Suite Added
- Created [`tests/render-recovery.test.js`](file:///c:/AI/FractionFlow/tests/render-recovery.test.js) (15 tests).
- Enumerates every recovery `kind` produced by [`src/interaction/classification.js`](file:///c:/AI/FractionFlow/src/interaction/classification.js):
  1. `denominator-changed-without-numerator`
  2. `incorrect-equivalent-numerator`
  3. `incorrect-numerator-arithmetic`
  4. `invalid-common-denominator`
  5. `incorrect-notice`
  6. `incorrect-reflection`
  7. `invalid-reflection-choice`
- Asserts that for both visual and linear paths:
  - The alert is mounted with `role="alert"`.
  - The rendered text does **not** fall back to `strings.status.stepIncorrect` (`"Not quite."`).
  - The rendered text matches the specific authored error message.
  - For `invalid-common-denominator`, the attempted number (e.g. `'18'`) is explicitly present.

---

## 3. Stated Reference Viewports & Geometry Re-Measurement

Measurements on the learner-facing rendered surface:
- **Reference Viewports:** `360×740` (mobile fold reference) and `360×752` (Chromebook/tablet reference).

| State & Condition | Surface Measured | 360×740 Fold (740px) | 360×752 Fold (752px) |
|---|---|---|---|
| Reflect beat (all conditions, single bars) | Active question bottom | **558px** (clears by 182px) | **558px** (clears by 194px) |
| Reflect beat (Choice 1 bottom) | Button bottom edge | **558px** (clears) | **558px** (clears) |
| Reflect beat (Choice 2 bottom) | Button bottom edge | **658px** (clears) | **658px** (clears) |
| Reflect beat (Choice 3 bottom) | Button bottom edge | **758px** (18px past fold) | **758px** (6px past fold) |
| Transform-right: `in-place` | Submit button bottom | **605px** (clears by 135px) | **605px** (clears by 147px) |
| Transform-right: `juxtaposed` | Submit button bottom | **717px** (clears by 23px) | **717px** (clears by 35px) |
| Transform-right: `sequential` | Submit button bottom | **746px** (6px below 740px) | **746px** (clears by 6px) |

*Observation:* Under `sequential` at `transform-right`, the Submit button bottom sits at **746px**. It clears a 752px fold by 6px and sits 6px below a 740px fold.

---

## 4. Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. Per `advisor-capable-providers.json` matching rules, this provider cannot confidently match an entry and therefore fails closed as not advisor-capable. No higher-tier subagent was invoked. All changes were verified through mechanized property tests, fail-first test assertions, and the orchestrator review gate.

---

## 5. Verification Summary

| Check | Result |
|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** (exit code 0) |
| `npm test` | **19 passed (19 test files, 230 tests passed)** |
| `npm run build` | **Passed** (Vite 6.4.3, 41 modules transformed, 0 warnings) |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** |
| `tests/app-shell.test.js` pin test | **Preserved intact** (unregistered CM-01-P condition pinned) |
| Git status | Clean tree; changes committed in `fb0c633` and `3885667` |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner. Ready for orchestrator and owner review.
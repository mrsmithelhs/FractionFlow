# Independent Review of FractionFlow Next Development Wave (Post-Plan 24)

**Reviewer label:** gemini  
**Date:** 2026-10-07  
**Runtime & Model Identity:** Google Antigravity runtime environment; model setting `Gemini 3.8 Flash (High)`. Environment routing is managed by the platform runtime; no external cryptographic model attestation is observable from within this process.  
**Review Target:** `reports/orchestration/next-wave-after-plan-24-proposal.md` (committed at `79c6666`).  
**Integrity check:** `git diff 79c6666..HEAD -- reports/orchestration/next-wave-after-plan-24-proposal.md` is empty. The proposal has not changed since commit `79c6666`.  
**Repository State at Review Start:**
- HEAD: `39a7672a05fe4f16b1269519b5da1e160e0a3861` (`test: capture Plan 25 legacy replay baselines`)
- Working tree state: In-flight, uncommitted modifications on Plan 25 implementation files (`src/app/app.js`, `src/interaction/classification.js`, `src/interaction/episode-definition.js`, `src/interaction/episode.js`, `src/interaction/provenance.js`, `src/interaction/scene.js`, `src/render/beat-container.js`, `src/render/controls.js`, `src/render/linear-path.js`, `src/render/strings.js`, `tests/app-shell.test.js`, and untracked `tests/plan25-task-help.test.js`). All unowned in-flight changes were left untouched throughout this review.

---

## 1. Overall Verdict and the Strongest Reasons

**Verdict: Conditionally Sound with Crucial Narrowing and Sequencing Realignment.**

The proposal correctly identifies the fundamental product bottleneck: **FractionFlow is currently an isolated single-problem exhibit (`2/3 + 1/4 = 11/12`), not yet an actual practice environment.** Shifting priority to establish a vetted authored set with a learner-triggered "Next Problem" control (proposed Plan 26, guided by Plan 21) before multiplying new problem families is the single most valuable strategic insight in the document.

However, the proposal suffers from three significant weaknesses that must be corrected before owner authorization:

1. **Over-ambitious wave breadth:** Bundling seven implementation scopes and three investigations (Plans 17, 18, 19, 20, 21, 23, 25, 26, 27, 28) into a single "near-term wave" repeats past coordination friction. Because this repository strictly serializes source writers, packing this much work into one wave obscures the immediate actionable path.
2. **Premature and distracting investigations (Plans 27 and 28):** 
   - **Plan 27 (Chromebook denominator capacity)** risks violating the core architectural constraint of *Mathematical state → Instructional state → Presentation* by attempting viewport-dependent capability expansion for denominators > 24, which are pedagogically unnecessary for elementary addition (grades 4–6).
   - **Plan 28 (Guided common-denominator discovery)** threatens to overload the addition episode's `decide` beat with a complex mini-lesson, violating the founding principle of *One Focal Idea at a Time*. Guided denominator discovery belongs in Roadmap §28 (Focused Concept Episodes), not inside the addition flow.
3. **Hidden technical prerequisites in the episode reducer:** The proposal assumes that like-denominator (Plan 20) and nested-denominator (Plan 18) addition can be slotted in easily after crossing-one-whole (Plan 17). In reality, `handleOperate` in `src/interaction/episode.js` currently hardcodes assumptions that *both* operands were converted and that a common denominator was chosen during a `decide` beat. Zero-renaming and one-renaming execution will crash without a prior refactor of effective-operand handling.

---

## 2. What Should Remain Unchanged

The following aspects of the proposal are sound, well-grounded in prior owner decisions, and should proceed as proposed:

1. **Completing Plan 25's conversion help before new source work:**
   Plan 25 addresses the owner's explicit scenario: *"I know the target denominator is 24, but how do I change 2/3 to 24ths?"* The approved mechanism—asking the learner for the multiplier in `3 × ? = 24`, updating the cue to `Multiply the top by 8, too.`, and having the learner enter the numerator in the primary conversion field—preserves mathematical responsibility, avoids duplicate inputs, and prevents premature answer leaks.
2. **Prioritizing Plan 21 investigation and Plan 26 implementation (Authored Set + Next Problem):**
   Proving that a learner can solve 3 to 5 problems in succession on the mature two-renaming proper addition family isolates reset, draft clearing, focus restoration, sequence exhaustion, and reviewer configuration carry-over from mathematical and rendering complications.
3. **Preserving DECISION-035's Small Learner-Goal model:**
   Organizing the entry page by broad learner goals (e.g., "Add fractions with different denominators", "Add fractions that make more than one whole", "Add fractions with the same denominator") rather than exposing internal mathematical taxonomies (nested, shared-factor, relatively prime) keeps the interface calm, accessible, and child-centered.
4. **Keeping Subtraction, Simplification, and Mixed Numbers behind explicit checkpoints:**
   - Subtraction requires an owner disposition based on the existing Plan 15 prototypes (takeaway vs. comparison) before any code is drafted.
   - Mixed numbers remain strictly deferred to Phase 5 per DECISION-033.
   - Bounded generated practice remains deferred until authored selection is fully proven (DECISION-040).

---

## 3. Prioritized Findings with Evidence and Calibrated Severity

### Finding 1: Committed Test Failure on HEAD (`tests/route-contract.test.js`)
- **Severity:** High (Active blocker for pipeline integrity).
- **Confidence:** Verified by direct headless execution (`npm test`).
- **Artifact Reference:** `tests/route-contract.test.js:107`, `tests/routes/route-matrix.json`.
- **Concrete Scenario:** Running `npm test` on commit `39a7672` fails with:
  `AssertionError: expected [ ... ] to have a length of 48 but got 50`.
  In commit `0ac7c77` (`fix(app): synchronize denominator help toggle state`), two new Plan 24 repair routes were added to `route-matrix.json` (raising the total from 48 to 50), but the test assertions in `tests/route-contract.test.js` were updated to expect 48 instead of 50.
- **Instructional / Engineering Consequence:** Any new packet or test run checking route contracts will fail, creating confusion about whether new changes caused the breakage.
- **Smallest Useful Correction:** Update `tests/route-contract.test.js` to expect 50 routes, matching the committed matrix. (Must be done by an authorized source writer; read-only reviewer authority prevents fixing it in this task).
- **Falsification:** If running `npm test` without working-tree edits passes cleanly on HEAD. (It currently fails).

---

### Finding 2: Shared-Factor (Plan 19) and Nested (Plan 18) Content Cannot Be Reached by Learners Without Plan 26
- **Severity:** High (Architectural & Product sequencing constraint).
- **Confidence:** High.
- **Artifact Reference:** `docs/decision-log.md` (DECISION-035), `src/app/practice-types.js:7-14`, proposal lines 42–46.
- **Concrete Scenario:** 
  DECISION-035 mandates that the entry page organize by learner goals, explicitly stating: *"Nested and shared-factor denominator relationships are variations within a suitable goal, not a button taxonomy."*
  Under this policy, neither Plan 19 (`1/6 + 1/4`) nor Plan 18 (`1/2 + 3/8`) can have its own button on the front door. Both belong inside Goal 1 ("Add fractions with different denominators").
  If Plan 19 or Plan 18 were implemented *before* Plan 26 (the Next problem selection machinery within Goal 1), a student entering the app could never encounter them unless they knew how to type hidden reviewer URL fragments!
- **Instructional / Engineering Consequence:** Implementing Plan 19 or Plan 18 before Plan 26 creates code that is unreachable by real learners in the app shell, producing dead-end fixtures.
- **Smallest Useful Correction:** Formally acknowledge that Plan 26 is an **essential delivery prerequisite** for learner reach of Plans 18 and 19. They should be delivered as content increments that feed the Goal 1 authored set established by Plan 26.
- **Falsification:** If the owner amends DECISION-035 to permit separate front-door taxonomy buttons for shared-factor and nested addition. (This would clutter the entry page and violate calm design).

---

### Finding 3: Latent Reducer Crash in `handleOperate` for Zero- and One-Renaming Schedules (Plans 20 and 18)
- **Severity:** High (Latent engineering defect).
- **Confidence:** Verified by code inspection of `src/interaction/episode.js:485-507`.
- **Artifact Reference:** `src/interaction/episode.js:487-493`.
- **Concrete Scenario:**
  ```javascript
  function handleOperate(state, intent) {
    if (intent.type !== 'submit-operation-result') return null;
    const targetDenominator = state.established.commonDenominator.targetDenominator;
    const classification = classifyOperationResponseForEpisode({
      instance: state.content,
      targetDenominator,
      convertedLeft: state.established.conversions.left,
      convertedRight: state.established.conversions.right,
      proposed: intent.proposed,
    });
  ```
  In like-denominator addition (Plan 20, zero renamings), there is no `decide` beat and no `transform` beats. Consequently, `state.established.commonDenominator` and `state.established.conversions` are `undefined`. Calling `handleOperate` throws `TypeError: Cannot read properties of undefined`.
  In nested-denominator addition (Plan 18, one renaming), only one operand is converted. `state.established.conversions.right` is `undefined`.
- **Instructional / Engineering Consequence:** Unlike Plan 17 (which reuses the two-renaming flow), Plans 20 and 18 cannot function without an upstream refactor of how `episode.js` establishes effective operands when renamings are skipped.
- **Smallest Useful Correction:** Requirement 0 of Plan 20 and Plan 18 must explicitly scope an upstream contract for `effectiveOperands` and `effectiveCommonDenominator` that defaults to the instance's given fractions when conversions do not occur.
- **Falsification:** If an existing unit test proves that `createEpisode` with a zero-renaming schedule currently completes an `operate` intent without error. (No such test exists; the current engine throws).

---

### Finding 4: Proposed Plan 27 (Chromebook Denominator Capacity) is Premature and Structurally Dangerous
- **Severity:** Medium (Scope bloat and risk of architectural violation).
- **Confidence:** High.
- **Artifact Reference:** Proposal lines 57–58, `docs/founding/04-system-architecture.md`, `docs/founding/00-principles.md`.
- **Concrete Scenario:**
  The proposal suggests investigating larger denominators (e.g. 36 or 48) on Chromebooks.
  However:
  1. *Unidirectional pipeline violation:* If an instance or denominator is admitted because a Chromebook has a 1200px CSS width, but rejected on a 360px mobile viewport, the mathematical model becomes viewport-dependent. This violates the core tenet that mathematical validity is pure, deterministic, and independent of presentation.
  2. *Pedagogical redundancy:* Elementary fraction operations (grades 4–6) rarely use denominators exceeding 24. Halves, thirds, fourths, fifths, sixths, eighths, tenths, twelfths, sixteenths, twentieths, and twenty-fourths completely cover curriculum standards.
  3. *Authoring burden:* Under Plan 22 path closure, admitting denominators 36 or 48 requires authored reflection choices, premise checks, and scale-factor cues for every admitted path.
- **Smallest Useful Correction:** **Drop Plan 27 as an independent capacity expansion packet.** Instead, integrate Chromebook viewport testing (CSS width ~800–1200px, 100%–125% browser zoom) into the standard responsive test rubric for *existing* content (denominators ≤ 24).
- **Falsification:** If target elementary curriculum standards demonstrate a compelling pedagogical need for fraction bars subdivided into 36 or 48 parts.

---

### Finding 5: Proposed Plan 28 (Guided Common-Denominator Discovery) Overloads Addition Practice
- **Severity:** Medium (Pedagogical and restraint concern).
- **Confidence:** High.
- **Artifact Reference:** Proposal lines 58–59, `docs/founding/00-principles.md` (Principles 1 & 2), `docs/founding/06-roadmap.md` §28.
- **Concrete Scenario:**
  Plan 24 just delivered compact task-local help at the `decide` beat (multiplication cue: *"Try multiplying 3 by 4..."* and explanation: *"Why does 12 work?"*).
  Plan 28 proposes adding an interactive workflow for learners to construct and check common multiples mid-episode.
  When a student is practicing fraction addition, interrupting the addition arc to engage in a multi-step common-multiple construction lesson violates Principle 2 (*One Focal Idea at a Time*).
- **Instructional / Engineering Consequence:** It turns the addition episode into an over-engineered, dashboard-like tutorial, slowing down learners who need practice adding fractions.
- **Smallest Useful Correction:** **Defer Plan 28 and reclassify it under Roadmap §28 (Phase 3 Focused Concept Episodes).** If learners need explicit practice finding common multiples, that should be a standalone focused concept episode ("Find a Common Denominator"), not a nested diversion inside an addition problem.
- **Falsification:** If classroom evidence reveals that learners using Plan 24's multiplication cue are completely unable to proceed without a multi-step discovery tool.

---

### Finding 6: Lifecycle and Exhaustion Semantics for "Next Problem" (Plan 21 / Plan 26) Must Be Settled Before Coding
- **Severity:** Medium (Design clarity gap).
- **Confidence:** High.
- **Artifact Reference:** Proposal lines 31–35, 56; `docs/decision-log.md` (DECISION-040).
- **Concrete Scenario:**
  DECISION-040 establishes that "Next" changes vetted content and starts fresh, with no automatic advance, session dose, or persistence.
  However, critical lifecycle behaviors remain unspecified:
  1. *Exhaustion:* When a learner completes problem 5 of 5 in the authored set, what happens? Does "Next" disable? Does it loop back to problem 1 without notice? Or does it display a calm completion message (e.g., *"You completed all problems in this practice."*) and offer a clear button to return to the entry page?
  2. *Placement:* Does "Next Problem" appear *only* upon completing an episode (at the `resolve` beat), or does it exist as an escape hatch during an unsolved problem? (If a student is stuck, can they skip to Next, or must they return to the entry page?)
  3. *Architecture boundary:* Next problem is an **app-shell lifecycle transition** (`src/app/app.js`), not an internal episode reducer intent. It unmounts the old episode and mounts a new one with the next fixture, while preserving reviewer configuration (design condition, support profile).
- **Instructional / Engineering Consequence:** If Plan 26 is assigned before Plan 21 defines these behaviors, implementers will invent conflicting reset and exhaustion policies.
- **Smallest Useful Correction:** Plan 21 must explicitly specify: (a) exhaustion stops with a calm completion notice and a return-to-entry action (no silent infinite loops); (b) "Next Problem" is unlocked only at `resolve` (returning to entry remains the exit for stuck learners); (c) the app shell owns the sequence index and unmount/mount lifecycle.

---

## 4. Recommended Sequence and Packet Boundaries

To prevent coordination congestion and maximize learner value, the work should be structured in **three distinct, serialized stages**:

```
[Stage 1: Practice Foundation]
Plan 25 (Finish in-flight Conversion Help)
      ↓
Plan 21 (Investigate: Content Inventory, Next Contract & Exhaustion)
      ↓
Plan 26 (Implement: 3–5 Authored Problems in Goal 1 + Next Problem)

[Stage 2: Goal & Family Expansion]
Plan 17 (Crossing One Whole: sum > 1, Discrete Stack, Goal 2)
      ↓ (or in parallel if disjoint)
Plan 20 (Like Denominators: sum = 5/7, 0-renaming schedule, Goal 3)
      ↓
Plan 19 (Shared Factor: 1/6 + 1/4 = 5/12, joins Goal 1 authored set)
      ↓
Plan 18 (Nested Addition: 1/2 + 3/8 = 7/8, joins Goal 1 authored set)

[Stage 3: Tooling & Future Concept Episodes]
Plan 23 (Dev Console tooling - independent background task)
Roadmap §28 Concept Episodes (Reclassified Denominator Discovery, ex-Plan 28)
```

### Detailed Rationale for This Staging:

1. **Stage 1 delivers real repeated practice first.**
   - Once Plan 26 ships, FractionFlow is no longer a one-hit demo. A student can sit down, click "Add fractions with different denominators", and work through 3 to 5 distinct, vetted problems with conversion help, local recovery, and clean transitions between problems.
2. **Stage 2 expands goals and families onto a working practice engine.**
   - **Plan 17** creates Goal 2 ("Add fractions that make more than one whole"). It uses the familiar two-renaming flow, so the reducer needs no structural surgery—only the discrete multi-whole stack renderer (DECISION-038).
   - **Plan 20** creates Goal 3 ("Add fractions with the same denominator"). It requires refactoring `handleOperate` to support zero renamings, but requires zero new rendering machinery.
   - **Plan 19 and Plan 18** add shared-factor and nested problems into the Goal 1 authored set created in Plan 26.
3. **Drop Plan 27 and Reclassify Plan 28.**
   - Drop Plan 27: test Chromebooks under normal responsive testing rather than chasing denominators > 24.
   - Reclassify Plan 28: move guided common-denominator discovery to Roadmap §28 where focused concept episodes belong.

---

## 5. Owner Decisions Needed Before Assignment or Source Work

The following decisions must be rendered by the project owner before drafting or assigning source packets:

1. **Plan 21 / Plan 26 Exhaustion Policy:**
   - *Question:* When a learner finishes the final problem in an authored set, what should happen?
   - *Recommendation:* Do **not** silently loop back to problem 1. Display a calm, restrained completion message (e.g., *"You completed all problems in this set."*) with a single primary button returning to the entry page.
2. **Reclassification of Proposed Plan 28:**
   - *Question:* Should common-denominator discovery be developed as an interactive helper inside the addition `decide` beat, or as an independent focused concept episode under Roadmap §28?
   - *Recommendation:* Keep the addition episode focused on addition. Reclassify denominator discovery as a Roadmap §28 focused concept episode.
3. **Cancellation of Proposed Plan 27 as an Expansion Packet:**
   - *Question:* Should the project investigate raising denominator capacity beyond 24 for Chromebooks?
   - *Recommendation:* No. Keep the denominator ceiling at 24 (ample for grades 4–6). Validate Chromebook layouts against existing content.
4. **Subtraction Representation Disposition (Plan 15 / OQ-25):**
   - *Question:* Which fraction-bar representation will FractionFlow use for subtraction: Takeaway or Comparison?
   - *Recommendation:* Review the running Plan 15 prototypes (`npm run dev:prototype`) and record the pedagogical selection in a decision record before any subtraction packets are drafted.

---

## 6. Deferrals with Explicit Revisit Triggers

To protect developer focus and maintain calm UI, the following items must remain explicitly deferred:

| Deferred Capability | Reason for Deferral | Explicit Revisit Trigger |
|---|---|---|
| **Denominators > 24** | Unnecessary for elementary fraction addition; creates visual crowding at 360px and authoring explosion. | Revisit only if elementary curriculum standards require larger denominators in Phase 4/5. |
| **Interactive Denominator Discovery Wizard** | Overloads the addition task; violates "One Focal Idea at a Time". | Revisit during Roadmap §28 (Focused Concept Episodes). |
| **Algorithmic Problem Generation for Learners** | Raw generator draws lack reviewed pedagogical copy and closure proofs. | Revisit after Plan 26's authored set demonstrates stable classroom use (DECISION-040). |
| **Active Result Simplification** | Premature to require simplification while learners are still mastering combination. | Revisit at Phase 3 exit gate (§31). |
| **Mixed-Number Operations** | Belongs in Phase 5 per DECISION-033; requires multi-whole regrouping strategy. | Section 91 checkpoint before Phase 5. |
| **Subtraction Episodes** | Blocked on owner representation choice (Takeaway vs Comparison). | Owner disposition on Plan 15 prototypes (OQ-25). |

---

## 7. Verification Performed, Uncovered Surfaces, and Residual Uncertainty

### Verification Performed:
- **Proposal inspection:** Verified `reports/orchestration/next-wave-after-plan-24-proposal.md` against git commit `79c6666`; confirmed zero modifications.
- **Repository status & HEAD:** Confirmed HEAD at `39a7672`; documented in-flight uncommitted Plan 25 files.
- **Packet status tooling:** Executed `node scripts/dev/plan-status.js list` and `check plan-21`. Confirmed that Plan 21's declared dependencies are all `complete`.
- **Automated test suite:** Ran `npm test`. Uncovered the pre-existing test assertion defect in `tests/route-contract.test.js` (50 actual routes vs. 48 expected).
- **Code inspection of episode reducer:** Verified `src/interaction/episode.js:485-507` (`handleOperate`) to examine assumptions about `commonDenominator` and `conversions` under zero- and one-renaming schedules.
- **Code inspection of practice registry:** Verified `src/app/practice-types.js` to confirm that only a single practice type (`sum-under-one`) is currently registered.
- **Decision & Open Question audit:** Verified DECISION-032, 034, 035, 036, 037, 038, 039, 040 and OQ-20, 21, 23, 25, 27.

### Uncovered Surfaces:
- **In-flight Plan 25 implementation:** Plan 25 source changes are actively being authored in the working tree. No browser or unit tests were run on those incomplete changes.
- **Physical assistive technology:** No physical screen-reader (JAWS/NVDA/VoiceOver) testing was performed; findings rely on DOM inspection and mechanized route assertions.
- **Physical Chromebook hardware:** Verification evaluated layout constraints via code and CSS viewports; physical Chromebook hardware testing was not conducted.

### Residual Uncertainty:
- Exact authoring effort required to create 3 to 5 golden cases with complete reflection choices and premise checks under Plan 21/26.
- Owner's specific pedagogical preference between Takeaway and Comparison for fraction subtraction in Plan 15.

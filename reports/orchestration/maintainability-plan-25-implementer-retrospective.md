# Plan 25 Implementer Retrospective: Revision Cost Evidence

**Purpose:** Record concrete revision incidents from Plan 25 for the broader FractionFlow maintainability investigation. This retrospective is based on the implementation conversation, commits, progress report, and delivery review. It is not a general codebase audit or a comparison of frameworks. Proposed improvements are speculation unless explicitly identified as observed behavior.

**Scope note:** Plan 25 changed interaction state, app behavior, and two render paths, and therefore gives some real evidence about behavior-oriented maintenance. Plan 21 was an investigation and documentation assignment, not a comparable source change. This report does not reconstruct wall-clock or token cost. It does not recommend a framework migration.

## Incidents

### 1. A local help action crossed replay, classification, provenance, and presentation boundaries

**Observed task and evidence.** The requested helper had to let a learner who already knew the target denominator find the equivalent numerator, without exposing the answer or changing the main conversion response. The existing generic `request-help` action accumulates help levels at episode scope; repeated requests could escalate a later transform response to demonstration support and mark its provenance accordingly. Plan 25 therefore needed a task-local assistance intent and history, fresh revision-3 episode definitions, exact multiplier classification through the existing math helper, and preservation of revision-1/2 replay and revision-2 closure behavior. The relevant source spans `src/interaction/episode.js`, `episode-definition.js`, `classification.js`, `scene.js`, and `provenance.js`, plus the existing `src/math/scale.js` helper `scaleFactorForDenominator`.

The implementation and captured pre-mutation replay oracles are documented in the [Plan 25 progress report](../development/plan-25-equivalent-fraction-conversion-help/progress.md); the source change is commit `7863584`. The pre-mutation oracle verifier recorded exact full-state matches for registered revision-1/2 replay cases and the specified revision-2 closure cases.

**What made it harder / what was straightforward.** This was a real cross-layer contract: a visually local “Need help?” control could not safely reuse the generic help action without changing instructional meaning and provenance. Replay compatibility and the separation between instructional history and transient open/closed UI state required care. The math itself was straightforward because exact scale-factor logic already existed; no new arithmetic engine or math rule was needed.

**Classification.** This was genuine behavioral design and integration complexity, not merely a documentation or test gap. The existing architecture's strict separation also made the boundary visible and testable; the incident does not show that separation to be a defect.

**Retrospective speculation.** A small interaction-contract template could prompt for action scope, history/provenance effects, definition revisions, replay compatibility, transient UI state, and exact-math reuse before source work. Smaller modules might make individual responsibilities easier to locate, but this task would still require agreement across the same boundaries. A Vue component migration would not by itself resolve replay semantics or provenance.

**Evidence pointers.** Plan 25 progress report, “Existing behavior,” “Implementation delivery,” and pre-mutation oracle sections; implementation commit `7863584`; delivery review's interaction audit.

### 2. Opening help remounted the response and left keyboard focus on the document body

**Observed task and evidence.** Opening the task-local helper dispatches a state change, which changes the render token and remounts the response controls. The main input draft was retained, but the initial implementation did not transfer focus to the newly rendered multiplier input. The orchestrator found that both visual and linear paths left focus on `BODY`; a mounted app-shell assertion and real Edge click/keyboard routes reproduced it before repair. The bounded fix in `src/app/app.js` focuses the connected visible transform input after dispatch, choosing the multiplier before acceptance and the main numerator afterward. It was committed as `24b2297`.

After the fix, the full route matrix passed 53 executions across 51 rows. The delivery review independently checked 64 connected, visible active-element assertions across 16 operand/view/target/motion cases, including opening, recovery, reopening, acceptance, and reopening after acceptance. The failing-first and repaired evidence is recorded in the [delivery review](../development/plan-25-equivalent-fraction-conversion-help/delivery-review.md) and [progress report](../development/plan-25-equivalent-fraction-conversion-help/progress.md).

**What made it harder / what was straightforward.** The defect was a real learner-facing keyboard-focus failure caused by the relationship between app state dispatch and renderer remounting. The first implementation and the earlier broad route matrix did not expose it because those checks verified state and visible output but did not assert the active element after the remount. Once the lifecycle point was identified, the repair was narrow and reused the existing `getVisibleTransformInput()` helper and dispatch flow.

**Classification.** Product behavior defect, with a separate missing-verification gap. It is not evidence that generated markup inherently prevents reliable focus management; it shows that the lifecycle contract needed a direct assertion and a stable post-render handoff.

**Retrospective speculation.** A shared, narrowly scoped post-dispatch focus helper or an explicit render-completion hook may reduce future duplicated lifecycle reasoning, provided it does not steal focus on unrelated renders. The strongest improvement evidenced here is a route assertion for the connected visible active response after each stateful remount. A framework change alone would not guarantee that behavior.

**Evidence pointers.** Initial finding and failing-first results in the Plan 25 delivery review; repair commit `24b2297`; independent 64-case browser review recorded in that review.

### 3. The explanatory sentence and equation needed distinct semantic roles

**Observed task and evidence.** The owner wanted a short explanation for why the learner was solving `3 × ? = 24`, then selected “What multiplier turns 3 parts into 24?” The orchestrator advised using that sentence as the input's single visible label and the equation once as supporting notation. An early copy arrangement showed the question twice; the rendered screenshot made the duplication apparent. The final visual and linear controls use the sentence as the associated label and the equation as supporting text referenced with `aria-describedby`. The control API was extended in `src/render/controls.js`; renderer use and copy live in `src/render/beat-container.js`, `src/render/linear-path.js`, and `src/render/strings.js`. The update was committed as `99244b2`.

**What made it harder / what was straightforward.** The important choice was not generating denominator words such as “third” or “fourth”; the selected prompt uses the numeric denominator values and avoids a word bank. The initial duplication was a content/placement error caught by visual review, not a math or state defect. Once the roles of label and supporting notation were separated, both renderers could use the shared control API.

**Classification.** Transient copy/presentation rework, corrected before acceptance. The final interface has one explanatory question and one equation; no remaining defect is asserted here.

**Retrospective speculation.** A short copy-authoring note distinguishing a control's question label from explanatory notation could prevent this particular duplication. An optional supporting-text field on the shared numeric-input component is a reusable pattern if other controls need it. Screenshot review was effective and should remain part of copy changes that affect layout or association.

**Evidence pointers.** Owner-selected wording and implementation entry in the Plan 25 progress report; copy commit `99244b2`; refreshed screenshots and accessibility checks summarized in the delivery review.

### 4. Route-matrix bookkeeping and browser-environment friction were separate from product behavior

**Observed task and evidence.** Adding behavioral routes changed the route matrix from 50 rows / 52 executions to 51 rows / 53 executions. A hard-coded expected count needed updating. An initially attempted route assertion used an unsupported assertion kind and had to be expressed with the harness's supported selector and active-element checks. The delivery review also records an Edge launch that failed when its temporary profile could not be written in the sandbox; a narrowly scoped approved browser run succeeded. The browser evidence and counts are in the Plan 25 progress report and delivery review.

**What made it harder / what was straightforward.** Exact counts and clear route names made additions auditable, and the harness exposed a concise unsupported-assertion failure. The count update and launch retry consumed implementation/review attention but did not indicate a learner-app defect. The full route matrix passing before the focus assertion was added also demonstrates that broad route coverage alone did not mean focus behavior was covered.

**Classification.** Test-harness coupling and environment/tooling friction, alongside the distinct focus-verification gap in Incident 2. Neither count maintenance nor the sandbox launch issue is a product failure.

**Retrospective speculation.** The route runner could derive aggregate counts from the matrix or centralize expected totals; its assertion schema could directly express a connected visible active element. A concise summary mode could also keep large route logs easier to inspect. These are plausible tooling improvements, not validated fixes from this assignment.

**Evidence pointers.** Route totals and launch outcomes in the Plan 25 progress report and delivery review; failing-first focus route outcomes in the review's P2 section.

### 5. Owner and orchestrator gates added coordination, and also caught meaningful issues

**Observed task and evidence.** Plan 25 began with a requirement-zero mechanism proposal and an explicit stop before source implementation. The implementation proceeded after orchestrator review; the owner later chose the explanatory copy, which was sent to the orchestrator for advice before editing. The orchestrator's delivery review then caught the focus defect, required a failing-first reproduction, and authorized closure only after repair review. The progress report and delivery review preserve these stages. These gates generated separate proposal, implementation, copy, repair, and report artifacts/commits.

**What made it harder / what was straightforward.** The staged review required context switching and repeated evidence summaries. However, the gates were purposeful: they preserved owner authority over instructional copy and exposed a defect that the implementer's initial route checks missed. Once each decision was explicit, the bounded implementation and repair were clear. Available records do not support a reliable time or token estimate.

**Classification.** This is coordination and approval overhead, not software complexity. Some of it is the cost of the repository's intentional owner-controlled gates; it should not be attributed to the rendering architecture.

**Retrospective speculation.** A single handoff checklist could state which decisions are owner-owned, what exact evidence is required at each gate, and which prior artifacts can be referenced instead of restated. That might reduce repeated summaries while preserving the review checkpoints. This report does not recommend removing the gates that caught the focus issue.

**Evidence pointers.** Plan 25 progress report's proposal, copy, and focus-repair entries; delivery review's disposition and repair re-review; commits `7863584`, `99244b2`, and `24b2297`.

## Overall reading

Plan 25's most concrete source-maintenance cost was coordinating a local help feature across replayable instructional state, app-local visibility and drafts, two renderers, accessibility labels, and browser focus after remount. The existing separation between exact math and instructional/presentation state helped constrain the change; the focus defect shows that DOM lifecycle still needs explicit ownership and tests. The copy rework was quickly visible in screenshots. The main demonstrated verification weakness was the absence of active-element checks in the broad route suite before the orchestrator added them. Route counts and Edge sandbox setup were tooling concerns. Owner gates added coordination while preserving decisions and revealing a real defect.

The record supplies no controlled comparison of imperative DOM construction, smaller vanilla modules, and Vue components. It also supplies no basis for estimating a framework migration's cost or benefit. A migration would not automatically solve replay compatibility, focus after remount, test-harness assertion gaps, or owner-gate coordination. A meaningful comparison would need to implement the same representative revisions in bounded pilots and compare changed responsibilities, tests, regressions, and build/dependency costs.

## Validation and boundaries

- This retrospective was assembled from the Plan 25 implementer history, progress report, delivery review, and commit references. It does not claim new browser verification.
- Plan 25's existing delivery evidence includes test/build/lint results, pre-mutation replay checks, screenshots, and the repaired browser route matrix. See the linked artifacts for exact commands, case counts, and limits.
- The desktop Edge evidence does not establish physical Chromebook, native mobile keyboard, assistive-technology, or learning-efficacy outcomes.
- No production changes, tests, packet/status changes, or commits were made for this retrospective.

# Plan 26 implementer retrospective: revision cost and maintainability

Date: 2026-10-10
Scope: retrospective on the Plan 26 work in FF Impl 26, through closeout
`2209e7f`. This records observed incidents and separates them from possible
design improvements. It is not a proposal to adopt a framework or rewrite.

## Short assessment

The fixed two-item addition practice was implementable within the existing
architecture, and the main learner-state transition could reuse the existing
episode reducer, replay format, and scene/render boundary. Those boundaries
made the product change smaller than the evidence package around it.

The harder parts were at the seams: authored-task admission had to agree with
both renderers; the app's transactional Next/reset path spanned instructional
state and transient DOM state; and the first browser evidence run did not persist
the exact journeys and screens reviewers needed. We found one real production
defect and several evidence or artifact-quality gaps. Those categories should
not be conflated.

Plan 21 is not used as a source-change comparison here. Its work was an
investigation, not comparable implementation and revision evidence.

## Five concrete incidents

### 1. Admission validation and renderer contracts drifted

**Observed.** Initial implementation `92e13db` added
`validateAuthoredMatchingChoices` in `src/content/authored-task-data.js` and
transactional navigation in `src/app/app.js:551` (`advanceToNextItem`). Review
found that the validator accepted a two-choice task and an out-of-whole
distractor, while `src/render/beat-container.js` and
`src/render/linear-path.js` require at least three choices and the visual
renderer refuses fractions greater than one whole. Fault injection showed that
Next could admit a corrupt candidate that later had no usable task controls.
The authored Plan 26 rows themselves were valid; the defect was the promised
corrupt-data admission/refusal boundary. `ac0078a` repaired the upstream checks
and added failing-first mounted regressions for both faults.

**What was straightforward.** The issue was localized once the reviewer traced
the data contract from validator to both renderers. The correction preserved
the current authored records and mathematical rules; it did not need a reducer,
renderer, or replay-schema redesign.

**Retrospective judgment.** This was a product correctness defect caused by a
contract that was not fully shared across layers. A narrow shared capability
contract or tests that pin validator acceptance to the existing renderer range
could plausibly have caught it earlier. A generic schema/authoring framework
would have been disproportionate for this fixed set.

Evidence: `92e13db`, `delivery-review.md` (finding 1), `repair-01.md` section A,
`ac0078a`, and `tests/plan26-practice-set.test.js` admission/refusal cases.

### 2. The first delivery had passing routes but weak Plan-specific evidence

**Observed.** The first implementation reported a passing full matrix and
focused tests, but the new Plan 26 browser coverage was mostly one visual,
standard-motion path. Other condition/view/support coverage came from mounted or
replay reconstruction tests, not full browser journeys. The route runner's
captures were ephemeral; there were no saved screenshots or measurement
artifacts in the packet directory. The initial test result therefore did not
establish the broader Plan 26 learner journeys or provide screens for owner
review. This was a verification/evidence gap, not a discovered failure in the
valid authored path.

Repair 01 added a reproducible Edge capture runner and saved screenshots and
measurements. Its first durable run produced 78 records and 64 screenshots.
That was a substantial evidence improvement, but review still found gaps in
touch participation, reset proof, and scroll assertions, which became Repair
02.

**What was straightforward.** Existing route and mounted-test infrastructure
could be extended without changing the app behavior. A standalone script under
the packet's evidence directory made the browser cases reproducible and kept
the saved artifacts next to their interpretation.

**Retrospective judgment.** Better default evidence tooling would likely save
revision effort: route runs should persist a declared set of screenshots and
machine-readable measurements, and route summaries should distinguish
Plan-specific end-to-end journeys from inherited regression routes. More
components or HTML templates would not have solved this evidence problem.

Evidence: `92e13db`, `delivery-review.md` finding 2, `progress.md` initial
verification section, `repair-01-review.md`, `repair-01.md` section B, and
`ac0078a` evidence artifacts.

### 3. The evidence helper initially mixed input modes and accepted weak bounds

**Observed.** Repair 01's browser journey used a touchscreen tap for Next, but
lesson controls, Retry, and return/re-entry used mouse clicks or a separate
keyboard journey. Its post-scroll check established that question/control boxes
intersected the viewport, not that the full active question and controls fit
inside it. Review therefore could not treat the nominal “touch” or scroll result
as proof of the whole interaction path. During Repair 02, a further read-only
review noticed that the final reflection answers still bypassed the touch
activation helper; that path was corrected before the final capture. A later
prose review also caught a report sentence claiming numeric-input focus was
asserted before automated entry when the runner actually asserted click delivery.

These were verifier/report defects, not established learner-app defects. The
final Repair 02 run used the tap helper across the touch journey, confirmed
delivery to the intended target, required full in-viewport question/control
bounds after scrolling, and corrected the report wording. The final reviewer
recorded 184 records, 100 confirmed touch deliveries, and 68 screenshots; the
physical-device and native-keyboard limits remained explicit.

**What was straightforward.** The existing journey helper could take a locator
and perform the same scroll/tap/assert path. The same script could enforce
geometry invariants after each scroll without adding a product-side test hook.

**Retrospective judgment.** A smaller set of explicit journey actions and
assertions (mouse, keyboard, touch, text fill, visible bounds) with per-action
records would make it harder for a journey label to overstate what happened.
This is a test-harness design improvement, not a reason to restructure the
production renderer.

Evidence: `repair-01-review.md` (remaining evidence omissions), `repair-02.md`,
`repair-02-review.md`, `evidence/capture-plan26-repair-01.mjs`, commits
`7e9ed1e` and `628bab1`.

### 4. The “Before Retry” screenshot could be mistaken for incorrect-answer feedback

**Observed.** The saved narrow screenshot
`bundle-2-linear-medium-reduced-6-touch-360x740-second-item-dirty-retry.png`
shows `3` in the right-side multiplier field for “What multiplier turns 3 parts
into 6?” The correct multiplier is `2`. In the capture helper's
`exerciseRetry()` (`evidence/capture-plan26-repair-01.mjs`), the runner fills
`3`, activates Replay, and captures the screen before submitting the multiplier.
The purpose is to leave dirty UI for Retry to clear, not to show the app's
response to a wrong submitted value. In this conversation, the screenshot
prompted the owner to ask whether it was intended as incorrect-choice feedback;
the answer was no.

**What was straightforward.** The runner order and the visible Submit button
make the actual state recoverable on inspection: it is an unsubmitted draft.
The user-facing image alone does not make that testing purpose clear.

**Retrospective judgment.** A caption or adjacent evidence manifest should say
“unsubmitted helper draft before Retry.” If an incorrect-response state is an
acceptance target, it should have a separate capture after submission and the
app's actual response. This is artifact semantics and review clarity, not an
app defect.

Evidence: `evidence/capture-plan26-repair-01.mjs` `exerciseRetry()`; the two
`second-item-dirty-retry` screenshots; `repair-02-review.md`; and the owner/agent
conversation following the screenshot preview.

### 5. Approval and Windows Git metadata added non-code overhead

**Observed.** Before source work, the bounded execution mechanism required
Requirement 0, packet preflight, and FF Orch approval. Two attempts to deliver
the approval message were rejected by automatic review because cross-thread
authorization was not accepted by the sending tool; the owner had to provide a
direct confirmation in the receiving thread. Separately, the Windows sandbox
allowed source edits but denied the harmless Git metadata refresh probe, so
staging/committing required narrowly scoped elevation. Neither event indicated
a product or repository-design defect.

**What was straightforward.** Once authorization was recognized and staging was
performed with explicit paths, the work remained bounded and commits were
scoped. The gate also prevented implementation from beginning before the
mechanism review and preserved the owner acceptance boundary.

**Retrospective judgment.** A reliable, visible authorization handoff would
reduce coordination retries. For managed Windows work, documenting the exact
Git metadata elevation path is useful operational guidance. Neither problem is
helped by Vue, templates, or smaller source modules. Approval time is process
cost and should not be counted as code comprehension/revision cost.

Evidence: `mechanism-review.md` section “Approval delivery”; the initial
implementer conversation and its Git staging/commit turns; commits `a1520f8`
(approved mechanism) and `2209e7f` (Plan 26 closeout).

## What this says about structure and possible improvements

- **The layer boundaries helped.** The accepted work kept the episode definition
  and replay schema stable, used app-owned navigation, reconstructed expected
  episodes with `createEpisode`, and kept task truth/admission upstream of
  rendering. Full state comparison after Next, Retry, and re-entry was practical
  because the episode is independently constructible. Those are useful
  maintainability properties.
- **The seams still need explicit contracts.** The admission defect showed that
  separate modules can each be reasonable while their assumptions drift. Tests
  should pin upstream task admission to renderer capabilities without putting
  mathematical decisions into renderers.
- **Templates/components might improve markup discoverability, not necessarily
  state comprehension.** The browser UI is assembled in JavaScript, and this
  packet required tracing app event handling, episode state, projected scene,
  and two renderers. Declarative templates could make the DOM easier to scan,
  but converting markup alone would not remove that state flow or its tests.
- **Smaller modules are plausible where lifecycle ownership is clear.** The
  app navigation/reset path touches state, UI drafts, focus, and renderer
  lifecycle. Splitting it without first documenting those invariants could make
  the same behavior harder to find. A focused map of the Next/Retry/return
  lifecycle and a small test helper for independently expected episodes would
  have direct evidence of value here.
- **The biggest observed avoidable revision cost was evidence quality.** Persisted
  browser artifacts, explicit input-mode records, precise post-scroll assertions,
  and truthful captions reduced uncertainty more directly than a framework
  choice would have.

No elapsed-time, token, or effort estimate is made. The retrospective is based
on the committed review/repair records, source and test diffs, saved evidence,
and this implementer conversation. Plan 21 was investigative work and is
excluded from source-revision comparisons.

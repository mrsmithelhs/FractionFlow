# Task Variants and Screen Outlines

**Status:** Proposed authored tasks for owner disposition. Synthetic examples
only; no content records, controls, schedules, routes, or browser captures are
added by Plan 29.

These standalone focused-task outlines are an optional use of the same two
responsibilities. The primary integration proposal places them at transform
entries inside full addition episodes; see the [scale and integration addendum](scale-and-integration-addendum.md).

## Shared concept and invariants

The concept is amount preservation while changing to finer fractional units.
The source fraction names a quantity of one stable whole. In the proposed
initial tasks, the supplied target denominator is larger than the source
denominator, so its equal parts are smaller. This scope does not imply that all
equivalent renamings use finer units. A valid renamed form has the same value
and the supplied target denominator.

Before an episode is constructed, its authored task identity fixes the source
fraction, target denominator and (for inspection) the proposed fraction. The
learner cannot change the whole or target. Neither prompt asks for a least
common denominator. Exact math validates every proposed or repaired form; the
renderers display validated instructional state and do not calculate whether
the amount is preserved.

## Variant 1 — Construct the equivalent form

| Requirement | Proposed contract |
|---|---|
| Starting knowledge | Read a fraction as a count of equal parts of one whole; recognize that the denominator names the unit. The task supplies a finer target unit. |
| Invariant context | Source amount `2/3`, one whole, target denominator `12`; the amount and target stay fixed. |
| Learner responsibility | Construct a new numerator so the fraction still names the source amount. This is an open construction response. |
| One prompt | “How many twelfths are the same amount as two thirds?” |
| Response | Enter one whole-number numerator in `?/12`. No essay, denominator choice, or second conversion. |
| Exact classification | `8` is accepted only when `8/12` validates as equivalent to `2/3` at target denominator `12`, using the exact math layer. Other values remain recoverable wrong responses; the feedback does not return the expected numerator. |
| Wrong-answer recovery | Keep the source, target, and entered draft. Say “Keep the amount the same as the parts get smaller.” Keep the same response active. Do not classify a particular wrong value as a learner misconception. |
| Task-local assistance | On explicit request, a Plan 25-style cue may ask for the multiplier from source denominator to target denominator, then say to use that factor for the numerator. It never fills or accepts the numerator. This reuse is only proposed for authored, reviewed targets currently covered by Plan 25 (12 or 24); other targets need their own capability and route evidence. |
| Assistance provenance | Bind the help request and any accepted helper answer to the task/definition revision and active response entry. Mark the final answer as supported-in-app after help and unassisted-in-app when no app help is requested; neither claim establishes independent work. Reopening help is idempotent; reset clears drafts and task-local history. Do not increment generic episode-wide help levels. |
| Withhold before response | Do not mount or announce the expected numerator, completed target fraction, shaded target amount, success state, or expected result in DOM, accessibility tree, summary, hidden content, attributes, or replay-facing scene projection. The target denominator is part of the prompt and is visible. |
| Accessible equivalent | In the visual path, align a shaded `2/3` bar with a neutral 12-part unit template labelled as an unknown amount (`? of 12 equal parts`), at the same whole width. Do not show an empty shaded region that could be read as zero. The input supplies the count. In the linear path, show the same source and target notation with one equivalently labeled numeric input. Neither path relies on color, animation, dragging, or fine motor precision. Preserve keyboard/touch access and reduced-motion meaning. |

### Synthetic contrast cases

| Source and supplied target | Exact response | Why it is included |
|---|---:|---|
| `2/3 = ?/12` | `8` | Core construction case. |
| `3/4 = ?/12` | `9` | Same target with a different source and scale factor; discourages copying the previous numerator. |

These are reasoning examples, not a proposed two-item bank. An actual authored
set needs additional reviewed values and a deliberate range decision before
learner exposure.

### Shorter outline

**Current longer unlike-addition example:** `2/3 + 1/4` proceeds through the
addition episode's encounter, unit notice, common-denominator decision, left
conversion, right conversion, operation, final-result response, and (for the
registered reflection definition) reflection. Those tasks fit an addition
goal; they are not prerequisites for this focused amount-preservation task.

**Proposed construction task:** show the source amount and supplied target
partition together → ask the one construction question → optional requested
help → keep an incorrect response in the same task for recovery → after a
correct response, show the accepted equivalent forms and complete the focused
task. There is no learner response for noticing, choosing a denominator,
converting a second operand, operating, or reflecting on an unasked sum.

The removed learner responsibilities are outside this task's stated concept.
The learner still produces the equivalent numerator; exact validation is not
removed. This is a focused new schedule proposal, not the current addition
schedule with arbitrary beats skipped.

| Before response | Requested help | Wrong-answer recovery | After correct response |
|---|---|---|---|
| Show `2/3`, a neutral 12-part unit template marked as an unknown amount, and the single question above. | On request, ask for the denominator multiplier; after an accepted multiplier, cue the learner to use it for the top. Never fill the top. | Keep the source, target, and draft; repeat only the same amount-preservation cue. | Show the accepted `2/3 = 8/12` relationship and complete the focused task. |

## Variant 2 — Inspect, keep, or repair a proposed rename

| Requirement | Proposed contract |
|---|---|
| Starting knowledge | Same unit/whole prerequisites as construction, plus enough experience with equivalent forms to compare a supplied proposal. Do not require a written explanation or an automatic prior-success threshold. |
| Invariant context | Source amount and target denominator are fixed. One complete proposed fraction using that target denominator is shown. The proposal may be correct or incorrect; changing only the top is sufficient to repair any authored false proposal. |
| Learner responsibility | Judge whether the proposal preserves amount. Keep an accurate proposal unchanged; if it is inaccurate, choose “change the top” and supply the corrected numerator. This is an inspect-and-act response, not another blank-form construction prompt. |
| One prompt | “Check the new name. Keep it if the amount is the same; otherwise, change only the top.” |
| Response | One fixed task response with `keep` or `change-top` plus a numeric field for the latter. The conditional field belongs to the same scheduled task; it does not create a response-selected beat or reschedule the episode. |
| Exact classification | Keep math validity separate from action adherence. Classify the displayed candidate and any final top with exact math APIs such as `validateEquivalentFraction`. `keep` on a valid candidate is an unchanged valid response. If `change-top(n)` submits the same numerator as an already valid candidate, accept and normalize the mathematical outcome to unchanged while retaining the raw submitted `change-top` action in provenance. If the candidate is invalid, accept `change-top(n)` only when the corrected `n/target` validates as equivalent. A changed, invalid numerator is a math error; an unnecessary no-op is not. |
| Wrong-answer recovery | If the learner keeps a false candidate or enters an invalid corrected top, preserve the candidate and draft and say “That changes the amount. Try again.” If the learner makes a different invalid change to a valid candidate, use the same truthful amount-based recovery. Do not classify a no-op change of a valid form as wrong or label any response as a misconception. |
| Task-local assistance | The same learner-requested multiplier cue may explain the source-to-target scale without saying whether to keep or change the proposal and without supplying the corrected numerator. It remains optional and is only proposed where the authored target and representation are reviewed. |
| Assistance provenance | Record assistance against the inspect task's fixed entry and definition revision; requested help marks the response supported-in-app. No requested app help means only unassisted-in-app, not independent work. Retain the submitted action and repair attempt in replay. Do not make support depend on prior tasks or learner history. |
| Withhold before response | The proposed fraction is the stimulus and must be shown. Do not pre-mark it as valid/invalid, add a check/cross or highlight the expected action, provide the corrected numerator elsewhere, or announce the expected action. For a `change-top` response, the correction itself remains unprojected until acceptance. |
| Accessible equivalent | In the visual path, show source and proposed fractions as separate equal-width wholes with their own equal partitions and amount shading; do not add a check/cross or highlight an action before response. In the linear path, show the same two symbolic forms and the same `keep` / `change top` action and conditional numeric field. Provide complete labels and keyboard operation; retain information without animation or color. These access paths do not establish transfer. |

### Synthetic contrast cases

| Source | Proposal at target 12 | Correct action | Design check |
|---|---|---|---|
| `2/3` | `8/12` | Keep | An accurate proposal must remain unchanged. |
| `3/4` | `9/12` | Keep | A second accurate proposal changes the source amount. |
| `2/3` | `6/12` | Change top to `8` | False proposal is not always off by one; `6/12` is a different amount. |
| `5/6` | `11/12` | Change top to `10` | Correction direction, source fraction, and scale factor vary. |

The authored inspection task must include both keep and repair outcomes, with
counterexamples that vary source, scale and error. These synthetic cases do not
authorize this target range, bank, denominator cap, prompt frequency, or
learner-facing availability.

### Shorter outline

**Current longer unlike-addition example:** the complete `2/3 + 1/4` route asks
for several decisions before reaching any reflection about equivalence. Asking
the learner to repeat those unrelated responsibilities before they inspect a
proposed name adds work without improving this task's stated evidence.

**Proposed inspect task:** show the source amount and one proposed name → ask
the single keep-or-change question → if change is chosen, accept one corrected
top number in that same task response → optional requested help → recover on a
wrong action/value without changing the fixed schedule → after a correct
response, show the accepted/repair result and complete the task. No separate
“Is this right?” question followed by an identical repair question is added.

The learner evaluates another representation and either preserves valid work or
repairs invalid work. The correction field appears only when that action is
chosen, but the selected authored task and its schedule are fixed before the
episode begins. The app must not choose a different task based on that response.
“One response” means one fixed scheduled task entry, not one physical gesture:
keep uses one action, while repair uses an action and a numeric entry. The task is
shorter because unrelated addition responsibilities are omitted, not because a
repair is claimed to require one gesture.

| Before response | Requested help | Wrong-answer recovery | After correct response |
|---|---|---|---|
| Show the source and one complete proposal without a correctness mark; ask the single keep/change question. | On request, explain the source-to-target multiplier and applying it to the top; do not say whether the shown proposal is valid or supply the correction. | Keep the proposal and response in the same task. For a mathematically wrong final amount, say “That changes the amount. Try again.” A valid no-op change is accepted without another question. | Show the accepted unchanged or corrected form and complete the focused task. |

## Why two variants are the smallest useful set

Construction alone can reward a memorized factor rule or repeated prompt. The
inspection variant changes the decision: a learner must sometimes leave a valid
form untouched and sometimes reject and correct an invalid one. One task
therefore tests generation; the other tests checking plus a purposeful correction
when needed. A third task is not justified by the current evidence.

Do not append a separate written explanation, denominator-choice prompt, forced
conversion reflection, operation, or repeated same-answer check. Add a question
only if it captures a different decision that is necessary to this concept and
cannot be answered from the existing response.

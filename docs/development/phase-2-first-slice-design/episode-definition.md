# Episode Definition Draft: Unlike-Denominator Proper-Fraction Addition

> **Status note added 2026-09-19.** Plan 04 is owner-accepted and complete, and the specification
> phase closed with DECISION-024. This file remains the *historical design proposal*. For Phase 2 its
> episode responsibilities and state-boundary decisions are binding **only as constrained by** later
> accepted decisions, the Phase 2 reconciliation, and the active implementation packet. Where they
> conflict, the later decision and the packet govern.
>
> Foreground the later decisions rather than reading this file alone: **DECISION-012** and
> **DECISION-026** replace the connection-making check with a matching task carrying distractors whose
> expected answer is not always the reassuring one; **DECISION-025** makes fraction-bar segments
> non-interactive; **DECISION-019** removes any learner preference surface from Phase 2; **DECISION-011**
> sets the eligibility ceilings; and **DECISION-005** makes the prototype-variable register a
> disqualification instrument rather than a selection one. See
> `reports/orchestration/phase-2-specification-reconciliation.md`.
>
> The phrase "not an implementation contract yet" below refers to the state of this file when it was
> written, before owner acceptance. It is not an instruction to stop.

## Draft identity and review boundary

- **Proposed episode type:** `phase-2-unlike-proper-addition`
- **Dossier state:** design proposal; not an implementation contract yet
- **Eligible operation:** addition
- **Primary representation:** fraction bar
- **Integrated representation:** symbolic notation
- **Number line:** not part of this slice; number-line timing remains deferred
  under D-03
- **Canonical instance:** Plan 03 curated synthetic instance
  `relatively-prime-addition__none__2__3__1__4`
- **Canonical episode path:** LCD path for `2/3 + 1/4`

This definition is intentionally reusable across eligible instances. The
canonical example supplies content data; it must not require one-off application
logic.

## 1. Instructional purpose

The episode gives an upper-elementary learner who already has the stated
prerequisites a focused opportunity to connect unlike fractional units to a
common unit and then combine like units. The episode should make the invariant
visible and inspectable:

> equivalent renaming changes the description of a quantity, not the quantity;
> addition combines counts only after the units match.

The slice is intended to exercise the first Phase 2 interaction arc while
preserving learner responsibility for recognizing the unlike units, choosing a
common denominator, constructing equivalent fractions, and combining the common
units. It is not a first lesson for a learner with no fraction-unit or
equivalence readiness, and it is not an efficacy study.

## 2. Eligible problem family

The episode accepts a validated Plan 03 `fractionflow.problem-instance/v1`
record whose request uses:

- `selector: "relatively-prime-addition"`;
- `operation: "add"`;
- proper, nonzero operands whose denominators are relatively prime;
- two canonical renamings, one for each operand; and
- a content record that passes its family, exact-result, path, and
  representation-facts checks.

The Plan 03 record is the source for exact values, current forms, preferred final
forms, canonical and alternate paths, result classification, review metadata,
and representation-feasibility facts. The Instructional Engine and renderers
must consume those facts; they must not independently calculate validity,
divisibility, least common denominators, or equivalence.

This draft does not introduce a numeric denominator ceiling or a visual
complexity ceiling. A future implementation must perform explicit capability
eligibility before rendering and must provide reviewed behavior for a valid
mathematical instance or path that is outside the episode's supported
representation.

Note the current boundary precisely: Plan 03 records carry
`representationFacts` (operand denominators, canonical denominator, result
denominator, whole span, subdivision counts), but every
`representationFacts.eligibility` verdict is literally `deferred`
(`src/content/generator.js`), and `alternateRepresentationRecommendation` is
`none`. DECISION-008 and DECISION-011 resolve this for Phase 2: eligibility is evaluated
deterministically upstream in `src/content/` (e.g. `checkBarEligibility`)
before episode instantiation using fraction-bar ceilings reconciled to the content
profile (LCD <= 30 and single-operand scale factor <= 12). An instance or path exceeding
these bounds fails closed to `valid-but-outside-representation-capability` and
transitions to an authorized symbolic continuation.

Likewise, `alternatePaths` enumerates only the one recorded non-least
denominator. Validity for any other common denominator comes from the exact
math contract (`validateCommonDenominator` in `src/math/validation.js`, which
classifies any common denominator as `valid-least` or `valid-non-least`), not
from the instance record. “Do not independently calculate validity” means the
instructional and render layers must call that contract rather than reimplement
it; it does not mean they are limited to the paths the record enumerates.

## 3. Learner responsibility and system responsibility

The responsibility map is deliberately explicit so a review can distinguish
reasoning from presentation support.

| Episode responsibility | Learner is responsible for | System is responsible for |
| --- | --- | --- |
| Identify the unit issue | Notice that the denominators name different-sized units and that the counts cannot yet be combined as like units. | Present the initial expression and semantically labeled bars; preserve the stable whole and make the relevant unit relationship perceptible without answering the notice question prematurely. |
| Choose a common unit | Propose or choose a valid common denominator. In the canonical path this is 12; a valid non-LCD proposal such as 24 remains mathematically valid. | Validate the proposal through the content/math contract; distinguish invalid, valid-least, and valid-non-least; avoid treating efficiency preference as correctness. |
| Rename the quantities | Supply or confirm the scale factors and equivalent numerators for both operands, subject to the active support configuration. | Show the approved source and target forms, preserve exact value, and provide the transformation scene and semantic alternative without inventing a value. |
| Predict and inspect the transformation | When the support configuration calls for it, predict what remains equal and what the new unit count will be before the transformation is revealed. | Keep the pre-transition state, post-transition state, prompt provenance, and help/replay state inspectable; do not reveal a requested value before the response. |
| Operate on common units | Add the equivalent numerators over the common denominator. | Validate exact operation state and provide proportional local feedback while preserving correct earlier work. |
| Resolve the result | Submit or confirm an exact result and, where asked, distinguish a valid unsimplified result from the preferred final form. | Compare by exact value, report result classification, preserve raw/current/preferred forms, and explain simplification as renaming rather than correction. |
| Recover and request help | Correct a local response, retry, or request the smallest useful support while retaining ownership of the next decision. | Provide layered orientation, representation, constrained choice, or demonstration support; never punish help or silently complete the whole episode. |

The system may make a decision visible after the learner has made it or after a
reviewed help action, but it must record that provenance. A successful response
after a reveal is not equivalent evidence to an uncued response.

## 4. Narrative beats

The following is the episode grammar. It fixes the instructional responsibilities
and state transitions without selecting an animation, static, morph, juxtaposed,
or sequential display condition. Those are prototype variables in the register.

| Beat | Learner-facing responsibility | System-facing responsibility | Required state/provenance |
| --- | --- | --- | --- |
| **Encounter** | Read or inspect the expression and the two quantities. | Establish one stable whole for each bar, the initial current forms, symbolic expression, and the current question. | Initial mathematical state; active representation; support label; no hidden future denominator or converted numerator. |
| **Notice** | Decide whether the units already match and identify the unlike-unit issue. | Emphasize the relevant unit relationship without supplying the answer to the notice question. | Response classification; what labels and visual quantities were visible; help/retry/replay state. |
| **Decide** | Choose or propose a common denominator. | Validate the proposal against exact content facts and classify it as invalid, least, or valid non-least. | Proposed denominator; support configuration; response provenance; no pre-reveal of target subdivisions. |
| **Transform** | Predict or construct the equivalent forms for both operands as the active support permits. | Authorize only exact transformations from validated content; preserve the whole and the quantity; expose the resulting semantic scene and symbolic forms. | Pre/post scene states; scale factors and equivalent numerators supplied or learner-established; motion mode; replay/help use. |
| **Operate** | Combine the like units and submit the raw operation result. | Validate numerator operation and denominator preservation; retain successful conversions; give local error recovery for operation errors. | Current forms, operation response, exact classification, retry count, and preceding support. |
| **Resolve** | Submit or inspect the final result and, if prompted, reason about simplification or equivalence. | Show exact result, preferred final form, and any correct-unsimplified/valid-alternate classification without changing value. | Final classification, completion status, and full response provenance. |
| **Reflect** *(selective)* | State or match the invariant that the quantity stayed the same while the description changed, when the support configuration includes a meaningful reflection. | Ask only if the prompt adds evidence beyond the demonstrated scene; do not claim independent transfer from co-presence or a completed transition. | Reflection prompt form, response, support/reveal state, and evidence category. |

`Continue` is a shell-level transition after resolution, not a new
mathematical beat. It must preserve the episode's calm error/help behavior and
must not imply mastery or durable transfer.

## 5. Allowable scaffolds

Scaffold dimensions are independent. The labels below are the canonical support
labels from the Interaction Grammar; they are not a single difficulty score and
they do not prescribe an adaptive fading rule.

| Support dimension | High support | Medium support | Low support | Independent |
| --- | --- | --- | --- | --- |
| Fraction-bar model | Bars and relevant unit relationship visible from encounter. | Bars remain available while the learner supplies more intermediate state. | Bars available on request while symbolic work leads. | No visible model unless requested. |
| Common denominator | Constrained valid choices or an explicit common-unit prompt. | Learner supplies a denominator with validation. | Learner selects and justifies a useful denominator with optional help. | Learner chooses without visible support. |
| Equivalent numerators | One transformation may be demonstrated after a response or help request; the other remains the learner's responsibility where appropriate. | Learner supplies scale factors and numerators with source/target relationship visible. | Learner constructs both equivalent forms. | Learner renames both operands without visible intermediate values. |
| Prediction | Prompt before a material reveal when the condition includes prediction. | Prompt before the key transformation. | Optional concise prediction. | No prediction prompt unless the episode configuration requires it. |
| Symbolic integration | Symbolic forms remain paired with the bar model and current question. | Learner fills or confirms intermediate symbolic forms. | Symbolic expression leads; bar remains optional. | Symbolic work is the primary path. |
| Help and replay | Layered help and replay are available and may demonstrate a reviewed step after an attempt. | One targeted hint or representation request is readily available. | Optional help/replay remains available but quiet. | Help/replay remains available without automatically surfacing it. |

The future implementation must record the support label and each active support
dimension, not only a single opaque difficulty value. An `independent` support
configuration is not evidence of independent transfer by itself.

## 6. Valid representation roles

- **Fraction bar — primary:** establishes the stable whole, unit counts,
  selected quantities, and continuity during equivalent renaming and addition.
- **Symbolic notation — integrated secondary view:** expresses the same current
  forms and operation state. It is not an independent source of truth and does
  not parse or calculate from rendered text.
- **Accessible linear/semantic alternative — participation path:** exposes the
  same quantities, unit relationships, learner decisions, and status changes in
  programmatically inspectable reading order. It preserves the same
  responsibility as the visual path; it must not become an answer reveal.
- **Number line — excluded from this slice:** number-line representation and
  bridge timing remain a later decision. Excluding it here is a scope boundary,
  not a judgment about its instructional value.

Every representation receives the same validated scene meaning. Renderers may
adapt layout, labels, and amount of simultaneous annotation to the environment,
but they may not change mathematical state or decide the next instructional beat.

## 7. Covered valid paths

The authored path coverage is a pedagogical selection layered over exact
mathematical validity. The episode must accept the following two reviewed paths
for the canonical synthetic instance.

### 7.1 Canonical LCD path

For `2/3 + 1/4`:

1. recognize unlike units;
2. choose common denominator `12`;
3. rename `2/3` to `8/12` using scale factor `4`;
4. rename `1/4` to `3/12` using scale factor `3`;
5. add like units: `8/12 + 3/12 = 11/12`; and
6. resolve with preferred final form `11/12`.

This is the canonical authored explanation, not the only mathematically valid
route.

### 7.2 Supported non-LCD path

For the same instance, a learner may choose common denominator `24`:

1. rename `2/3` to `16/24` using scale factor `8`;
2. rename `1/4` to `6/24` using scale factor `6`;
3. add like units: `16/24 + 6/24 = 22/24`; and
4. resolve the result as exact and valid, while distinguishing it as a valid
   non-least, correct-but-unsimplified raw result whose preferred final form is
   `11/12`.

The episode may explain that 12 is more efficient than 24, but efficiency must
not be communicated as mathematical correctness. If a later implementation
asks the learner to simplify, that is a separately recorded learner decision;
the initial `22/24` response is not retroactively invalid.

### 7.3 Valid paths outside authored coverage

Other common denominators such as `36` are mathematically valid when the
content validator confirms the corresponding equivalent forms and operation.
They are outside this dossier's authored choreography unless a future reviewed
episode configuration adds them.

The required fallback behavior class is:

> `valid-but-outside-authored-coverage`

The fallback must preserve the learner-established current forms and exact
value, classify the response as mathematically valid, retain the reproducible
action sequence, and offer a reviewed continuation. A continuation may be a
semantically clear acknowledgment followed by an explicit choice to continue
with the supported authored route or to resolve through a supported symbolic
state. It must not silently coerce the learner's denominator, pass an
unsupported state to a renderer, or report mathematical error solely because
the authored explanation is missing.

If the instance itself is valid but outside representation capability, the
corresponding behavior class is `valid-but-outside-representation-capability`.
It follows the same fail-closed rule: no silent coercion, no false
incorrectness, and a reviewed continuation decided by the implementation gate.

## 8. Local error recovery and help

The episode must support local recovery for at least these response classes:

- invalid common denominator;
- valid denominator with an incorrect equivalent numerator;
- denominator changed without the corresponding numerator change;
- incorrect numerator arithmetic; and
- correct but unsimplified result.

Feedback should identify the earliest broken idea, preserve correct prior work,
and return the next meaningful decision to the learner. Help follows the
layered pattern of orient → represent → constrain → demonstrate, stopping at
the smallest useful support. A help request is recorded as support use, not
treated as failure.

## 9. Completion conditions

An episode instance may resolve when all of the following are true:

1. the instance passed pre-render capability and content validation;
2. the learner has encountered the unlike-unit question and completed the
   required decisions for the active support configuration;
3. every accepted renaming preserves exact value and reaches a validated common
   denominator;
4. the submitted operation result is mathematically valid under the exact
   content contract, whether canonical LCD or the covered valid non-LCD path;
5. any correct-but-unsimplified or valid-non-least classification is reported
   distinctly from incorrectness;
6. the final scene and semantic/linear alternative expose an inspectable result;
7. retries, help, replay, support, and reveal provenance are recorded for every
   assessed response; and
8. no required learner decision was answered by a hidden visual, prompt, or
   animation reveal before the response.

Completion of this episode does not mean mastery, independent transfer,
scaffold-fading efficacy, persistence, or instructional efficacy. Those remain
outside this slice's evidence boundary.

## Deferred mechanics preserved by this definition

This draft fixes the responsibility map, content boundary, state ownership, and
path classifications. It does not select a permanent empirical winner for:

- animation versus static/key-frame transformation (D-01);
- morphing versus deliberate juxtaposition versus sequential replacement (D-02);
- prompt density or prediction cadence (D-05);
- connection-making prompt form (CM-01);
- bridge frequency, number-line timing, session dose, first-run placement,
  persistence, identity, or release policies.

Under DECISION-007 and DECISION-012, Phase 2 adopts Bundle 1 (animated subdivision D-01-A,
semantic morph-in-place D-02-M, focused key-beat prompts D-05, and visual matching with
distractors CM-01-M) as its provisional build condition on design grounds, swappable upstream
at runtime per DECISION-006. Under DECISION-011, initial Phase 2 fraction-bar ceilings are
set to LCD <= 30 and scale factor <= 12. Those open questions remain registered in
[`prototype-variable-register.md`](prototype-variable-register.md) or governed by their deferred items.

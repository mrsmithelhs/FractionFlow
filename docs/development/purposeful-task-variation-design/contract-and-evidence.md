# Contracts, Evidence Boundaries, and Owner Acceptance

**Status:** Design proposal only. No code, schema, decision, content record,
learner observation, or runtime behavior is authorized by this document.

**Source inspection baseline:** `5a491c41aca48b962aa476d10927fcf57259d407`.
Runtime capability claims refer to this commit; later changes in other packets
need their own review and do not silently update this proposal.

## Source-supported findings and design inference

| Basis | What it supports | What it does not establish |
|---|---|---|
| Instructional Model §5 and Principle 8 | Equivalent fractions name the same amount in different units; familiar controls should leave attention for mathematically meaningful variation. | These curriculum commitments do not show that either proposed task improves learning or establish a best variant order. The first proposed targets specifically use finer units. |
| Instructional Model §§15–16 and §34 | Understanding can fail to transfer across representations or patterns. A deliberate correspondence task is different from showing two views together. | These are instructional goals, not evidence that current visual/linear access paths produce transfer or that this design has done so. |
| Plan 25 and its accepted review | Optional, learner-requested conversion help can elicit a multiplier, withhold the final numerator, preserve the main response, and record assisted participation for its bounded authored 12/24 transform paths. | The accepted work does not establish independent learning, efficacy, larger/general target coverage, or helper behavior in a stand-alone focused task. |
| Rittle-Johnson & Star (2009), as summarized and independently source-checked in the [research brief](../../../reports/orchestration/purposeful-episode-task-variation-research.md) | Comparing methods/problems helped conceptual knowledge and procedural flexibility in the studied grade 7/8 algebra task. This is a mechanism analogy for purposeful comparison, not direct evidence for these fraction tasks. | The population and content were algebra; the study did not test inspect/keep/repair of equivalent fractions, FractionFlow controls, or engagement. |
| Hamdan & Gunderson (2017) and Nuraydin et al. (2022), as summarized in the research brief | Fraction instruction can show trained-performance/transfer differences; the reported outcomes differ across studies and representations. These findings caution against inferring arithmetic transfer from an equivalent-fraction task or visual animation. | The findings concern number-line learning/game conditions, not this bar/symbolic task responsibility; they neither establish nor disprove efficacy for these variants. |
| Høgheim & Reber (2015), as summarized in the research brief | Context choice affected situational interest for some middle-school learners in a probability task, with no performance effect reported there. It does not show that these task variants sustain engagement or voluntary return. | It was not a fraction-task-format or long-term-return study, and the result cannot support an achievement or sustained-interest claim here. |

The detailed populations, outcomes, links, and limits are in the original
[bounded research report](../../../reports/orchestration/purposeful-episode-task-variation-research.md).
That report is a targeted literature review, not a systematic review. No study
inspected there tests these exact FractionFlow task variants.

**Design inference:** a supplied target denominator permits a shorter task whose
learner decision is amount-preserving construction; checking a complete proposal
adds a different decision without making every episode repeat denominator
choice, two conversions, an operation, and a reflection. This proposal draws on
the existing curriculum model and Plan 25 capabilities, but its learning value
has not been measured.

## Current capabilities and gaps

| Contract area | Current evidence | Plan 29 proposal / gap |
|---|---|---|
| Math truth | Exact math includes equivalent-fraction validation and exact fraction equality in `src/math/validation.js` and `src/math/fraction.js`. | Keep validity upstream. A source follow-on must verify the correct exact API for both the candidate and repair; renderers receive classifications and never calculate truth. |
| Schedule | `src/interaction/beat-schedule.js` derives a frozen schedule from an add/subtract instance's two renaming flags, then adds operate/resolve and optional reflect. | Add no mutation to DECISION-034 or current schedules. A single-fraction focused task needs a separately registered fixed schedule and completion semantics, approved before source work. Do not infer its schedule from answers or help. |
| Definitions/content | `src/interaction/episode-definition.js` and `src/app/practice-types.js` register operation-oriented definitions and current practice identities. | Propose exact authored task/definition IDs and revisions; the current app does not register these stand-alone tasks. Each task-data record must pin source fraction, target denominator, variant ID, authored prompt/candidates, and revision. Do not write schemas or records in Plan 29. |
| Construction response | The current `submit-equivalent-form` belongs to an active transform side after a common denominator is established. | Decide at a separate mechanism gate whether a focused task can safely reuse that contract or needs a new task response. Do not imply that current transform behavior already supports a single-fraction episode. |
| Inspect/repair response | Current interaction has no `keep`/`change-top` task response. Existing reflection choices do not make this task registered or reachable. | Specify one fixed inspect task response: keep a valid proposal unchanged, or repair an invalid proposal with the exact top. Math correctness and action adherence stay separate. If a valid proposal is submitted with `change-top` and the same top, normalize its result to unchanged/valid while preserving the submitted action in provenance; do not force another prompt. A changed invalid form is an amount error and gets amount-based recovery. Do not let an unrecognized beat fall through a renderer/reducer default. |
| Assistance/provenance | Plan 25 ties help requests and multiplier attempts to an active transform schedule entry/side; help use is assisted participation. | Reuse only through an approved identity-aware adaptation bound to the new task/entry. Preserve optional learner control, task-local recovery, exact accepted factor and assisted provenance; do not escalate global help or silently expand target coverage. Report no requested app help only as unassisted-in-app, not independent. |
| Scene and answer withholding | Current scene projections and both renderer paths gate future beat values; current visual and linear paths consume the same projected state. | Define separate stimulus versus answer fields. Variant 2 intentionally presents the proposed candidate, but not its validity, expected action, or correction. In both variants do not project a hidden answer or completed target before response acceptance. |
| Render/access | `src/render/beat-container.js` and `src/render/linear-path.js` handle the current beat vocabulary; existing parity coverage is for current task behavior. | Both paths need an explicit task-specific projection/control/recovery, labeled conditional numeric field, focus behavior and reset evidence. Bar units must preserve whole-scale; linear access remains a meaningful alternative. Do not claim physical device, assistive technology, or AT behavior from current emulated/browser evidence. |
| Identity/replay | `src/interaction/replay.js` pins content reconstruction identity, definition ID/revision, support, condition and learner intents. DECISION-041 also requires authored task-data identity to be pinned. | Pin `taskId/taskRevision`, authored task-data ID/revision and exact fixed schedule before episode construction. Retain old definition behavior; no latest fallback or response-derived task/schedule selection. Preserve submitted action, correction, help history and answer classification in replay. |
| Retry/Next/return | DECISION-041 fixes Retry/Next/reset/exhaustion behavior for the initial authored addition set. | Keep Next selection and task-variant assignment separate. A retry reconstructs the same pinned task with empty draft/help/recovery; Next must not silently switch task variant or representation. Any learner-facing goal/selector mapping is an owner choice outside this design's approval. |

## Proposed episode contracts

These are proposed semantic outlines, not the current beat list:

| Task | Fixed task identity and schedule | Accepted response | Recovery and completion |
|---|---|---|---|
| Construct | Authored `construct-equivalent` task ID/revision and data ID/revision; one fixed construction response entry, then task completion. | Exact numerator whose fraction validates against the source and supplied target denominator. | Incorrect numeric response remains at the same entry with input retained and no expected numerator. Correct response records classification/provenance, then presents the accepted equivalence and ends the task. |
| Inspect/repair | Authored `inspect-equivalent` task ID/revision and data ID/revision; one fixed inspect entry with `keep` or `change-top`; then task completion. | Keep a valid candidate, repair an invalid candidate with an exactly valid target form, or normalize a same-value no-op change of a valid candidate to unchanged/valid while preserving the submitted action. | A false keep or a changed invalid final fraction stays at the same entry with amount-based recovery. Do not classify a mathematically correct no-op as an amount error. Accepted action/correction and any requested help are replayable; completion shows the accepted or repaired form only after submission. |

The fixed authored task is selected before constructing the episode. A
submission, recovery, view switch, or help request cannot select a different
task or change the schedule. If the owner prefers a different task grammar or
response structure, record that structural disposition before any implementation.

For the proposed three-record source slice, illustrative unregistered identities
could be `focused-equivalence@1` for the focused definition and
`equiv-construct-2-3-to-12@1`, `equiv-inspect-3-4-as-9-12@1`, and
`equiv-repair-5-6-as-11-12@1` for the fixed task-data records. Each episode
would pin its selected task ID/revision and data ID/revision along with the
definition revision before construction. These labels demonstrate the identity
boundary; they are not a schema, registered identifiers, or approved naming
convention.

## Later evidence plan and rival explanations

No efficacy, transfer, readiness, interest, or frustration evidence is collected
under Plan 29. The following are later questions for a separately approved
evaluation and privacy review:

| Claim to assess | Rival explanation | Discriminating observation to consider later |
|---|---|---|
| Construction reflects amount preservation. | Learner memorized “multiply top and bottom,” copied a target-specific factor, used help, or recognized one repeated prompt. | After authorized familiarization, present changed source values, scale factors and target denominators. Report requested in-app help separately from unassisted-in-app responses. Neither absence of app help nor a changed-number success proves independent understanding; any independent-work question needs separately authorized evaluation. |
| Inspection reflects checking a quantity, not a surface cue. | Learner chooses “change” every time, spots an off-by-one pattern, follows option position, or trusts the supplied candidate. | Use a balanced, authored set with true forms to keep and false forms requiring different repairs; vary item position and error direction/magnitude. Later use an independent novel form without a repair cue if the owner approves it. |
| A learner can carry the concept to changed numbers. | They reproduced the trained operands, denominator, or correction value. | Treat changed-number work as one distinct evidence tier, with unfamiliar approved values and no hidden repetition of the training item. This is not by itself cross-representation transfer. |
| A learner completes without in-app help. | The learner may remember a prior cue or receive help outside the app. | Record help requests/attempts and classify responses as supported-in-app or unassisted-in-app. Do not call unassisted-in-app work independent. Any independent-work question needs a separately authorized evaluation; do not fade help automatically. |
| Representation transfer occurred. | Learner recognized the same bar layout, copied a label, or followed animation. | Require a later task in which the learner actively connects a familiar bar meaning to a different representation/response. The linear view is an access alternative, not proof of transfer. Number-line work remains gated by Roadmap §§31/90. |
| Interest or frustration changed. | Interface novelty, ease, task length, or response burden changed rather than mathematical interest. | If separately authorized, gather learner-reported interest and frustration as distinct outcomes from accuracy/achievement. Consider willingness to return only after novelty settles; no product tracking or retained learner data is proposed. |

Keep the following evidence tiers separate:

1. **Trained completion:** completing the exact authored task with its known prompt.
2. **Changed-number performance:** applying the same task responsibility to reviewed new values.
3. **Unassisted-in-app work:** completion without requested in-app help, classified from response provenance. This does not prove the learner received no prior or outside help; independent work requires a separate evaluation design.
4. **Representation transfer:** an active correspondence or task in another representation; not inferred from simultaneous bars/symbols or view switching.
5. **Interest/frustration and return:** reported separately from achievement; no long-term return claim from a single session or click count.

Technical routes can later verify exact classification, action agency,
withholding, focus, recovery, assistive semantics, reset and replay. They cannot
show that the learner learned, transferred the concept, felt interested, or will
return. No participant, classroom, survey, telemetry, or learner-data work is
authorized here.

## Learner needs and unresolved choices

- The two tasks require different prior knowledge. A learner who can identify a
  numerator/denominator may still need support understanding a false proposal.
  Treat help as task-local and available on request; do not prescribe a universal
  pace, mastery cutoff, or fading rule.
- A single repair task may add visual comparison demand and a conditional input.
  Later usability review should check that controls remain concise in both views
  and do not accumulate explanation text.
- The valid/invalid mix and eligible target range require authoring and capability
  review. The synthetic set is not an admission bank.
- The owner has not chosen where these focused tasks appear, how authored cases
  map to variants, or whether a learner can select among them. Do not add an entry
  choice or make Next switch task responsibility implicitly.
- The new completion state and one-response keep/change-top contract exceed the
  current operation-driven schedule/intent vocabulary. Owner structural approval
  must precede a source follow-on.

## Owner acceptance brief and source-follow-on recommendation

Please dispose of these policy proposals before a source packet is drafted:

1. **Concept and subset:** accept or revise the amount-preservation-in-finer-
   units concept and the two tasks (open construction; inspect/keep/repair).
   Confirm whether both are suitable for a first focused task proposal.
2. **Shorter responsibility set:** accept omission of denominator choice,
   operation, final-sum response, second-operand conversion, and reflection from
   these single-fraction tasks, while retaining exact math validation and the
   task-specific learner contribution.
3. **Task structure:** decide whether a new fixed focused-task definition and
   completion state are an acceptable grammar extension. DECISION-034's existing
   addition schedules remain untouched.
4. **Response contract:** accept or revise the one-entry inspection response that
   keeps a valid proposal or changes only the top of an invalid proposal; define
   what repair classifications and recovery may be visible.
5. **First reachable slice:** consider one new practice goal labelled “Show the
   same amount with smaller parts,” with a fixed reviewed 3-record set and one
   target denominator: `2/3 = ?/12` (construct `8`), `3/4 → 9/12` (keep), and
   `5/6 → 11/12` (repair to `10/12`). This varies the source-to-target scale
   factors while keeping a narrow proper-fraction, denominator-12 scope; it does
   not admit 24 or additional units. The set demonstrates capability and guided
   practice, not unfamiliar-item transfer or independent assessment. Decide
   whether a single goal is preferable to separate entry options or deferring
   learner reach. No entry change, set, or task is activated by Plan 29.
6. **Authored mapping and Next:** assign each item its task ID and task-data
   revision before episode construction. Decide whether the fixed authored goal
   can use the existing learner-triggered Next item lifecycle. Next would select
   a pre-authored item identity; it must not inspect answers, support, or the
   current representation to choose a task variant. If Next's accepted contract
   cannot include task identity in a fixed item record, stop and disposition that
   issue separately rather than widening Plan 26 implicitly.
7. **Help and provenance:** approve any identity-aware reuse of Plan 25's optional
   multiplier cue for explicitly covered targets. Keep supported-in-app and
   unassisted-in-app responses distinct from any later independent-work claim;
   do not widen targets by implication.
8. **Evaluation:** leave learning/transfer/interest evaluation for a separately
   authorized design, privacy decision and any participant approval.

After owner disposition, the bounded source follow-on should cover only the
accepted task definition/data identity, fixed schedule/completion, exact
construction and inspect/repair response classification, task-local help and
provenance, scene/answer withholding, both access paths, reset/replay and focused
route evidence for the accepted authored targets. It should not create a general
task engine, automatic adaptation, session policy, new representation, study,
analytics, broader denominator-discovery workflow, or Plan 26 changes. Structural
approval and source authorization remain distinct; this dossier starts neither.

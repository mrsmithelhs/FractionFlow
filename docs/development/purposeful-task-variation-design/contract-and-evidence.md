# Contracts, Evidence Boundaries, and Owner Acceptance

**Status:** Design proposal only. No code, schema, decision, content record,
learner observation, or runtime behavior is authorized by this document.

**Source inspection baseline:** `5a491c41aca48b962aa476d10927fcf57259d407`.
Runtime capability claims refer to this commit; later changes in other packets
need their own review and do not silently update this proposal.

**Primary integration proposal:** the same two responsibilities are applied to
transform entries in full addition episodes using compact, versioned authored
patterns. See [Scale and Integration Addendum](scale-and-integration-addendum.md).
The one-fraction task contracts below remain optional focused uses, not the
primary first source slice.

## Source-supported findings and design inference

| Basis | What it supports | What it does not establish |
|---|---|---|
| Instructional Model §5 and Principle 8 | Equivalent fractions name the same amount in different units; familiar controls should leave attention for mathematically meaningful variation. | These curriculum commitments do not show that either proposed task improves learning or establish a best variant order. The first proposed targets specifically use finer units. |
| Instructional Model §§15–16 and §34 | Understanding can fail to transfer across representations or patterns. A deliberate correspondence task is different from showing two views together. | These are instructional goals, not evidence that current visual/linear access paths produce transfer or that this design has done so. |
| Plan 25 and its accepted review | Optional, learner-requested conversion help can elicit a multiplier, withhold the final numerator, preserve the main response, and record assisted participation for its bounded authored 12/24 transform paths. | The accepted work does not establish independent learning, efficacy, larger/general target coverage, or how help should respond to the new inspect/keep/repair contract. |
| Rittle-Johnson & Star (2009), as summarized and independently source-checked in the [research brief](../../../reports/orchestration/purposeful-episode-task-variation-research.md) | Comparing methods/problems helped conceptual knowledge and procedural flexibility in the studied grade 7/8 algebra task. This is a mechanism analogy for purposeful comparison, not direct evidence for these fraction tasks. | The population and content were algebra; the study did not test inspect/keep/repair of equivalent fractions, FractionFlow controls, or engagement. |
| Hamdan & Gunderson (2017) and Nuraydin et al. (2022), as summarized in the research brief | Fraction instruction can show trained-performance/transfer differences; the reported outcomes differ across studies and representations. These findings caution against inferring arithmetic transfer from an equivalent-fraction task or visual animation. | The findings concern number-line learning/game conditions, not this bar/symbolic task responsibility; they neither establish nor disprove efficacy for these variants. |
| Høgheim & Reber (2015), as summarized in the research brief | Context choice affected situational interest for some middle-school learners in a probability task, with no performance effect reported there. It does not show that these task variants sustain engagement or voluntary return. | It was not a fraction-task-format or long-term-return study, and the result cannot support an achievement or sustained-interest claim here. |

The detailed populations, outcomes, links, and limits are in the original
[bounded research report](../../../reports/orchestration/purposeful-episode-task-variation-research.md).
That report is a targeted literature review, not a systematic review. No study
inspected there tests these exact FractionFlow task variants.

**Design inference:** a supplied target denominator can support a shorter full
addition recipe without asking the learner to notice/select it as an additional
response. The learner still constructs or checks every form needed by the
addition, operates on those forms, and resolves the sum. Omitting the common-unit
notice/choice and separate reflection is a deliberate limitation: these recipes
do not assess those responsibilities. The proposed patterns' learning value has
not been measured.

## Current capabilities and gaps

| Contract area | Current evidence | Plan 29 proposal / gap |
|---|---|---|
| Math truth | Exact math includes equivalent-fraction validation and exact fraction equality in `src/math/validation.js` and `src/math/fraction.js`. | Keep validity upstream. A source follow-on must verify the correct exact API for both the candidate and repair; renderers receive classifications and never calculate truth. |
| Schedule | `src/interaction/beat-schedule.js` derives a frozen schedule from an add/subtract instance's renaming sides, then adds operate/resolve and optional reflect. DECISION-034 says the legacy schedule is problem-derived. | Propose a narrow structural amendment for new registered pattern definitions only: derive the new compact recipe from the validated problem plus a fixed authored pattern ID/revision. Freeze before responses. Preserve every legacy definition/replay identity and schedule unchanged. The proposed compact patterns omit notice, decide and reflect; this is not current behavior or arbitrary beat skipping. |
| Definitions/content | `src/interaction/episode-definition.js` and `src/app/practice-types.js` register operation-oriented definitions and current practice identities. | Register two named versioned task patterns separately from problem identity. Existing unlike-addition items and their revisions remain the numeric instances. Inspect candidates and the fixed item-to-pattern assignment are additional authored data; do not write schemas or content records in Plan 29. |
| Construction response | The current `submit-equivalent-form` belongs to an active transform side after a common denominator is established. | For the new compact construct pattern, each problem-required transform entry remains a learner construction response. The authored target is shown as display-only context; it is not answered or acknowledged. Do not imply that this is currently registered. |
| Inspect/repair response | Current interaction has no `keep`/`change-top` task response. Existing reflection choices do not make this pattern registered or reachable. | For the new inspect pattern, each problem-required transform entry presents a candidate as unmarked authored stimulus and requires keep or change-top. Authored candidate truth may vary across items and sides. Separate mathematical correctness from action adherence; normalize a same-numerator no-op on a valid candidate to unchanged/valid while preserving the submitted action. A false keep or changed invalid form gets amount-based recovery. Do not let an unknown pattern or beat fall through a reducer/renderer default. |
| Assistance/provenance | Plan 25 ties help requests and multiplier attempts to an active transform schedule entry/side; help use is assisted participation. | Keep optional support independent from item/pattern selection. Any reuse needs an approved identity-aware adaptation bound to the active new-pattern entry. Report no requested app help only as unassisted-in-app, not independent. Preserve candidate origin and actual learner action: constructed, explicitly kept, repaired, or supplied with no learner response. |
| Scene and answer withholding | Current scene projections and both renderer paths gate future beat values; current visual and linear paths consume the same projected state. | Define separate stimulus versus answer fields. Variant 2 intentionally presents the proposed candidate, but not its validity, expected action, or correction. In both variants do not project a hidden answer or completed target before response acceptance. |
| Render/access | `src/render/beat-container.js` and `src/render/linear-path.js` handle the current beat vocabulary; existing parity coverage is for current task behavior. | Both paths need an explicit task-specific projection/control/recovery, labeled conditional numeric field, focus behavior and reset evidence. Bar units must preserve whole-scale; linear access remains a meaningful alternative. Do not claim physical device, assistive technology, or AT behavior from current emulated/browser evidence. |
| Identity/replay | `src/interaction/replay.js` pins content reconstruction identity, definition ID/revision, support, condition and learner intents. DECISION-041 also requires authored task-data identity to be pinned. | Pin problem/item identity, selected pattern ID/revision, definition/recipe revision, target denominator and inspect-candidate task-data revision before construction. Preserve old replay meanings. Replay submitted construct/keep/repair action, candidate origin, exact classification, help and recovery. |
| Retry/Next/selection | DECISION-041 fixes Retry/Next/reset/exhaustion behavior for the initial authored addition set. | Initial mapping from existing item identity to one pattern is fixed and authored before construction. Retry keeps the pair with clean episode state; current Next remains the vetted-identity lifecycle. A future constrained sampler is a separate policy that selects from compatible reviewed pairs and pins the result. It is not implemented or silently folded into Next. Future mastery-conditioned selection remains a separate research/owner gate, not universally prohibited by this proposal. |

## Optional standalone focused-task contracts

The following contracts preserve the earlier standalone-task option. They are
not the primary full-operation patterns and are not current beat lists:

| Task | Fixed task identity and schedule | Accepted response | Recovery and completion |
|---|---|---|---|
| Construct | Authored `construct-equivalent` task ID/revision and data ID/revision; one fixed construction response entry, then task completion. | Exact numerator whose fraction validates against the source and supplied target denominator. | Incorrect numeric response remains at the same entry with input retained and no expected numerator. Correct response records classification/provenance, then presents the accepted equivalence and ends the task. |
| Inspect/repair | Authored `inspect-equivalent` task ID/revision and data ID/revision; one fixed inspect entry with `keep` or `change-top`; then task completion. | Keep a valid candidate, repair an invalid candidate with an exactly valid target form, or normalize a same-value no-op change of a valid candidate to unchanged/valid while preserving the submitted action. | A false keep or a changed invalid final fraction stays at the same entry with amount-based recovery. Do not classify a mathematically correct no-op as an amount error. Accepted action/correction and any requested help are replayable; completion shows the accepted or repaired form only after submission. |

The fixed authored task is selected before constructing the episode. A
submission, recovery, view switch, or help request cannot select a different
task or change the schedule. If the owner prefers a different task grammar or
response structure, record that structural disposition before any implementation.

The following illustrative identities belong only to the earlier optional
standalone focused-task slice; they are not the primary integration recommendation.

For that optional three-record source slice, illustrative unregistered
identities could be `focused-equivalence@1` for the focused definition and
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
- The owner has not adopted the proposed full-operation patterns or their fixed
  item mapping. The standalone focused use remains optional; it must not become
  an implicit learner-facing pattern selector or change to Next.
- The standalone-task completion state and one-entry keep/change-top response
  still exceed the current operation-driven grammar. The integrated patterns
  also need the explicit problem-plus-authored-pattern schedule disposition in
  the addendum before source work.

## Owner acceptance brief and source-follow-on recommendation

Please dispose of these policy proposals before a source packet is drafted:

1. **Concept and patterns:** accept or revise amount-preserving renaming within
   addition, with exactly two learner responsibilities: construct, or
   inspect/keep/repair a supplied form. Keep the same pattern available as an
   optional standalone focused task.
2. **Short full-operation recipe:** accept or revise the compact recipe that
   retains each required operand renaming, operation, and result, while omitting
   notice, denominator-choice, and separate reflection responses. The target
   denominator is authored and displayed as context. State explicitly that this
   recipe does not measure learner selection of a common denominator.
3. **Structural amendment:** accept or revise the proposed narrow DECISION-034
   amendment: legacy definitions/replay retain the exact problem-derived
   schedule; only new definitions with a fixed, versioned authored pattern may
   derive a frozen schedule from the validated problem plus that pattern.
   Approve the two compact templates and their omissions before implementation.
4. **Existing-item integration:** consider the current canonical `2/3 + 1/4`,
   Plan 26 `1/2 + 1/3`, and Plan 32 `1/3 + 1/4` instances at target 12. Keep
   numeric content separate from the reusable patterns. A bounded source
   prototype should exercise both patterns across multiple existing instances
   without per-fixture code branches; inspect candidates are separately authored
   task data and require exact validation.
5. **Response/provenance:** approve unmarked inspect stimuli, exact candidate
   truth, keep/repair action and recovery. Preserve constructed, learner-kept,
   learner-repaired, and item-provided form origins separately. Do not attribute
   a learner action to an operand already in the target unit.
6. **Assignment now:** use a fixed authored item-to-pattern mapping before
   episode construction. Retry preserves the pair; current Next remains under
   DECISION-041. Do not implement a random selector or generated fallback here.
7. **Future selection:** consider constrained sampling only as a separately
   approved policy over finite compatible authored item/pattern pairs. Authored
   candidate validity and route compatibility may constrain the stimulus mix.
   Learner-performance or mastery-conditioned selection remains a later
   research/privacy/owner gate; this proposal does not impose a universal ban.
8. **Support/evidence:** keep optional task-local help separate from selection;
   retain supported-in-app versus unassisted-in-app provenance. Keep efficacy,
   independence, transfer, interest, and return claims for separately authorized
   evaluation.

After owner disposition, a bounded source follow-on should cover only the two
named pattern definitions, the accepted problem-plus-pattern schedule rule,
compatibility and authored candidate task data for the existing items, fixed
initial assignment, help/provenance, answer withholding, both access paths,
reset/replay, and a small reuse route matrix. It should prove both patterns work
across multiple existing instances without fixture-specific branches. It should
not expand the numeric bank, implement a future sampler, add a general task
engine, alter legacy schedules, or modify Plan 26's current Next contract.
Structural approval, owner adoption, and source authorization remain distinct.
The earlier standalone focused-task recommendation remains optional and is not
the primary source-follow-on recommendation.

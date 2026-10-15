# Scale and Integration Addendum

**Disposition:** Bounded Plan 29 owner-intent alignment proposal. The owner has
not adopted these contracts. No source, schedule, content record, sampler, or
runtime behavior is authorized here.

**Relationship to the earlier proposal:** This addendum makes full-addition
practice the primary use of the two task responsibilities. The earlier
standalone focused-task design remains an optional use, not the first or only
integration path. Its target-12 three-record learner-goal recommendation is
revised by the first integration proposal below; its synthetic examples and
evidence limits remain useful.

## Purpose and reusable responsibilities

Keep one concept: preserve an amount while expressing an operand in a shared
fractional unit. Keep the same two learner responsibilities:

1. **Construct:** make the equivalent form needed by an addition instance.
2. **Inspect, keep, or repair:** evaluate a supplied candidate equivalent form;
   keep it if exact amount is preserved or change only its numerator if it is
   not.

These are response patterns for the existing transform responsibilities in a
full addition. They do not add an equivalence check after the learner has
already constructed or inspected a form. Both patterns continue into the
addition and its resolved result, so the equivalence work is used in the
operation rather than isolated as the only learner goal.

## Short full-operation patterns

The current canonical unlike-addend route for `2/3 + 1/4`, target denominator
12, has the frozen shape `encounter → notice → decide → transform-left →
transform-right → operate → resolve → reflect` when reflection is enabled.
Encounter acknowledgment, `notice`, `decide`, both required operand renamings,
the numeric `operate` response, the `resolve` continuation, and reflection when
enabled are learner actions. Resolve's button dispatches a resolution intent;
it does not request another numeric sum.

On this fixture, the current path asks the learner to acknowledge the displayed
addends, answer the unit notice, choose `12`, enter `8/12` and `3/12`, submit an
operation result, inspect/continue past the final form, and complete the
definition's reflection when enabled.

The proposed compact recipes retain the required encounter acknowledgment,
every transform entry required by the problem, `operate`, and `resolve`. They
omit the learner `notice`, common-denominator `decide`, and separate `reflect`
entries. The authored item supplies its target denominator, shown as context
such as “Use twelfths”; that label is **display-only** and has no separate
acknowledgment. The encounter acknowledgment is still mandatory. This recipe
deliberately does not assess denominator selection or an explicit verbal
statement of the unit relationship. At each required transform entry, the
construct pattern retains form generation while the inspect pattern replaces
that response with candidate evaluation and (when needed) repair.

At `operate`, the learner submits the complete addition result once (for example
`11/12` after the two accepted forms above), and exact math classifies that one
submission. `resolve` then displays the accepted exact final form and finishes
or offers continuation; it does not ask the learner to calculate or enter the
sum again. This preserves the current one-numeric-answer behavior; it is not a
new saving of a repeated calculation. A finish/continue control is a navigation
action, even if its internal intent also validates the accepted form.

| Episode responsibility | Construct pattern | Inspect/keep/repair pattern |
|---|---|---|
| Encounter | Learner acknowledges the displayed addition once. This remains mandatory and is separate from unit notice. | Same. |
| Display-only context | Show `2/3 + 1/4` and “Use twelfths.” Do not request a notice or target-denominator choice for this recipe. | Same. The supplied target is not itself a learner response or acknowledgment. |
| Left transform entry | Learner constructs `2/3 = 8/12`. | Show an authored candidate. Example: keep `8/12` if exact validation confirms it; otherwise repair the numerator. Do not show validity before the action. |
| Right transform entry | Learner constructs `1/4 = 3/12`. | Show an authored candidate. Example: `2/12` is false for `1/4`; learner changes the top to `3`. Keep/repair is one fixed task entry, although repair takes an action plus a numeric entry. |
| Addition (`operate`) | Learner submits the complete sum once from the accepted forms: `8/12 + 3/12 = 11/12`, as in the current operation input. | Same; only the accepted, exactly validated forms reach the operation. |
| Resolve | Show the accepted `11/12` and finish or offer continuation. No second calculation or numeric entry. | Same; resolve is not another keep/repair or sum response. |
| Omitted | No separate notice, denominator-choice, or generic equivalence-reflection response in this compact recipe. | Same omissions; do not append a second “is it equivalent?” question after keep/repair. |

Both recipes have five scheduled entries for this two-renaming problem,
including the required encounter acknowledgment and the non-response resolve
view. The current reflection-enabled route has eight; without reflection, the
current route has seven. The shortening comes from omitting notice, denominator
choice and reflection, not a nonexistent second numeric sum entry. This
is a reduction in scheduled responsibilities, not a claim that every learner
will use fewer physical gestures: an inspection repair includes an action and a
number entry. The remaining work is meaningful: construction generates both
quantities the learner adds; inspection judges or repairs both quantities and
then uses the accepted forms in the same addition. The compact recipe does not
claim practice in choosing a common denominator or measured learning benefit.

When a problem has a side already in the selected target unit, that operand is
shown from the problem instance and used as given. It has no transform entry,
and the system must not report that the learner constructed or confirmed it.
When a problem has two renaming sides, both sides use the selected pattern.
No form is silently prefilled as a learner step.

## Existing-item compatibility and compact policies

The first integration proposal uses existing unlike-addition instances at the
already supported target denominator 12. These values show pattern reuse; they
do not add or admit content records. Inspect candidates in the table are
illustrative new task data and require authoring and exact validation before any
source work.

| Existing problem instance | Construct pattern | Inspect pattern example | Exact result |
|---|---|---|---|
| Canonical `2/3 + 1/4` | Construct `8/12` and `3/12`. | Keep authored `8/12` for `2/3` and `3/12` for `1/4`; both are valid. | `11/12` |
| Existing Plan 26 `1/2 + 1/3` | Construct `6/12` and `4/12`. | Candidate `5/12` for `1/2` is false and is repaired to `6/12`; keep `4/12` for `1/3`. | `10/12` |
| Existing Plan 32 `1/3 + 1/4` | Construct `4/12` and `3/12`. | Keep `4/12` for `1/3`; candidate `7/12` for `1/4` is false and is repaired to `3/12`. | `7/12` |

The task patterns are two compact, named, versioned authoring policies, not a
general task engine or per-fixture source branches. Each policy states which
responses are required at the problem's transform sides, its fixed completion
path, and its answer-withholding rule. Item identity and task-pattern identity
remain separate. Operation/operand data and inspect-candidate data are authored
content; candidate truth is a property of that data established by exact math,
not by a learner response. The construct pattern needs no displayed candidate.

A bounded source follow-on should prove both patterns reusable across multiple
existing instances, for example by exercising the pattern/instance compatibility
matrix represented above. A learner-facing first assignment may map each
existing item identity to one fixed pattern. Alternate compatibility cases can
be mechanism evidence without expanding the learner bank or repeating items in
the learner sequence. Numeric bank growth and changes to the reusable pattern
code are separate work.

### Compatibility conditions

- Use an admitted addition instance, an already supported target denominator,
  exact known operands, and a supported result path. The first examples above
  use existing unlike-denominator items and stay below one whole.
- At least one operand must need renaming for either pattern to have work. A
  zero-renaming item is not eligible; do not invent an equivalence task for it.
- The pattern applies to every actual renaming side in the selected problem.
  Side count and identity remain problem-derived. A side already in target units
  is provided by the item, with no learner confirmation.
- Inspect data must provide one complete candidate per active transform side.
  Author a mix with different numbers of valid-to-keep and false-to-repair
  candidates, varying which side is false and the error, so “always change it”
  or a fixed left/right rule cannot solve the set. Exact math determines truth.
- Both visual and linear paths must represent the same source forms, target,
  candidate stimulus, learner response and accepted result. A view choice is not
  a task-pattern selector or evidence of representation transfer.
- Optional Plan 25-style help remains separate from item/pattern assignment and
  is proposed only where the current target and task entry are covered. A help
  request does not alter the fixed recipe or next selected item.

## Proposed structural amendment to DECISION-034

DECISION-034 currently makes the schedule a frozen function of the problem and
registered definition. The compact full-operation recipes cannot be described
as that unchanged schedule: they omit `notice`, `decide`, and `reflect`.
The explicit structural proposal is:

- For every legacy definition/revision with no authored pattern, preserve the
  current problem-derived schedule and replay meaning exactly. Do not reinterpret
  old episode identities.
- A new registered definition may require an immutable authored pattern ID and
  revision selected with the item before episode construction. For those new
  definitions only, derive the schedule from the validated problem plus that
  versioned pattern. The two proposed compact patterns use the fixed template
  `encounter → transform entries for each problem-required renaming side →
  operate → resolve`, with no `notice`, `decide`, or `reflect` entry.
- The compact recipe keeps the required `encounter` acknowledgment. Showing the
  authored target denominator is display-only and requires no separate notice
  or acknowledgment. `operate` accepts the one complete learner sum; `resolve`
  projects that accepted exact result and completes/continues without a second
  numeric response.
- Freeze the resulting schedule before the first learner response. A response,
  retry recovery, help request, or display-view change cannot add, remove, reorder,
  or select a pattern. Reject unknown pattern IDs rather than falling back to the
  latest recipe or a renderer default.
- Pin problem/content identity, definition revision, pattern ID/revision, target
  denominator, pattern-specific candidate data identity where applicable,
  support selection, and learner intents in replay. Legacy replay remains
  reconstructable under its existing identity.

This is a proposed, narrowly named extension to schedule derivation, not an
accepted amendment or authorization to implement random beat omission. Owner
structural disposition must precede source work. If a different structural
design is chosen, record it before implementation.

Within a transform entry, false keep and invalid repair responses recover at
that same entry without changing the selected pattern. A valid same-numerator
`change-top` is accepted as unchanged/valid and its submitted action is retained.
The accepted forms reach the operation only after exact validation.

## Assignment now and future constrained selection

For the first source increment, author a fixed mapping from each selected
existing item identity/revision to one pattern ID/revision and any inspect
candidate-data revision. The assignment is fixed before the schedule is built.
One concrete proposed learner-facing mapping is canonical `2/3 + 1/4` to
construct, Plan 26 `1/2 + 1/3` to inspect/keep/repair, and Plan 32 `1/3 + 1/4`
to inspect/keep/repair. This is a proposal, not an adopted assignment. The
pattern/instance matrix above is compatibility evidence across multiple pairs;
it does not mean learners receive duplicate instances under all six
combinations.

Introducing these assignments requires an explicit versioned definition and
practice-set association that references the existing numeric item identities;
do not relabel those items or reinterpret their legacy definition/replay
meaning. Keep the existing item set and replay available. Retry preserves the
new item/pattern pair and resets episode work. Current learner-triggered Next
retains DECISION-041's vetted-identity lifecycle; this addendum does not change
Next into a random selector or add a generated fallback.

Future constrained sampling is a separate policy proposal. A sampler could
choose from a finite reviewed set of compatible `(problem identity, pattern
identity)` pairs, after checking operation, target denominator, renaming sides,
result support, representation route and (for inspect) authored candidate truth
profiles. It may constrain the mix by authored candidate validity and item/path
compatibility before episode construction. Those are properties of reviewed
content and routes, not learner-performance adaptation. Pin the selected pair
and revisions so replay reconstructs the same episode.

No learner-performance or mastery-conditioned selection is proposed here.
That possibility remains a separate later research, privacy and owner-approval
gate; this design does not impose a universal ban on it. Any such policy must
remain distinct from item compatibility and authored candidate truth. No sampler,
learner model, random implementation, telemetry or persistence is authorized by
this addendum.

## Provenance of operand forms

Origin and learner action are separate facts. Exact mathematical validation is
also separate; it does not fabricate a learner step.

| Form case | Form origin | Learner action/provenance |
|---|---|---|
| Construct pattern | Source operand and target unit come from the pinned problem item; expected equivalent form is withheld until acceptance. | Record the numerator actually entered, response entry, exact classification, recovery attempts and any requested help. Mark the accepted form learner-constructed. |
| Inspect, valid candidate | Candidate comes from pinned authored task data and is shown as an unmarked stimulus. | Record the explicit `keep` action and that the candidate was learner-confirmed. The candidate's origin remains authored, not learner-created. |
| Inspect, false candidate | False candidate comes from pinned authored task data and is shown without a validity cue. | Record the submitted action and any correction. If repaired, preserve the original candidate and mark the accepted form learner-repaired, with exact classification and help provenance. If the learner keeps it, record the keep and failed classification; do not fabricate a repair. |
| Operand already in target units | The original operand is supplied by the pinned problem item. | No construct, keep, or repair action is attributed to the learner. The form is used as provided after exact validation. |

A valid candidate with a same-numerator `change-top` remains mathematically
unchanged/valid while preserving the submitted action. A false proposal that is
kept or an invalid changed numerator is recoverable math error. These labels
describe provenance only; they are not a schema and do not imply learning,
independence, transfer, or mastery.

## Evidence boundary and next disposition

Technical route evidence can later establish which actions the learner actually
took, exact classification, withholding, reset, focus and replay. The proposed
patterns do not establish achievement, learning transfer, interest, or return.
The compact recipe also omits denominator selection, so it must not claim evidence
that the learner selected a common unit. Any evaluation and any mastery-conditioned
sampling remain separate gates.

The owner should dispose of the two full-operation patterns, their explicit
shorter schedule and the narrow DECISION-034 extension before a source follow-on
is drafted. The earlier standalone focused tasks remain optional examples. A
source follow-on should add only the two named patterns, compatibility and
identity contracts, candidate task data for the accepted existing items, the
fixed initial item-to-pattern assignment, both access paths, local help and
provenance, reset/replay, and a small reuse route matrix. It should not expand
the numerical bank, implement the future sampler, add a general task engine, or
modify legacy schedules.

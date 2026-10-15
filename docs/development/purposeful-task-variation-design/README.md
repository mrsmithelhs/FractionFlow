# Purposeful Episode Task Variation Design

**Disposition:** Owner review proposal from Plan 29. These task variants and
contracts are not yet accepted, registered, learner-reachable, or implemented.

**Source inspection baseline:** `5a491c41aca48b962aa476d10927fcf57259d407`.
This pins the capability claims below; later changes in other packets may alter
the working tree without changing this Plan 29 evidence baseline.

## Recommendation

Use one concept: **rename a fraction in supplied finer units while keeping the
amount the same**. The initial cases have target denominators larger than their
source denominators; this does not claim every equivalent renaming uses smaller
units. Recommend two task variants:

1. **Construct:** given the source fraction and target denominator, construct
   the missing numerator (for example, `2/3 = ?/12`, answer `8`).
2. **Inspect and keep or repair:** inspect a complete proposed renaming; keep it
when it preserves the amount, or change only its numerator when it does not
(for example, keep `2/3 → 8/12`; repair `2/3 → 6/12` to `2/3 → 8/12`). A
mathematically valid no-op repair is accepted as unchanged while its submitted
action is preserved in provenance; action adherence is not mislabeled as math
correctness.

The variants elicit different work. Construction creates an equivalent form.
Inspection starts from someone else's completed proposal; the learner judges
whether the amount stayed fixed, avoids changing an already valid form, and
repairs an invalid top number. The inspection task must include valid proposals
that are kept and invalid proposals that are repaired. A task where every
proposal is wrong can be solved by a “change it” routine.

## What stays fixed and what can leave

The whole, source fraction value, requested target unit, exact-equivalence rule,
answer classification authority, help ownership, and replay meaning are fixed
within an authored task. Exact validation remains system responsibility even
when a learner task is shorter. Requested help records supported-in-app work;
absence of an in-app help request records only unassisted-in-app work, not
independent work.

For these focused tasks, the target denominator is supplied in the authored
prompt. A learner need not first choose a common denominator. Neither task
needs an operation sum or a general result reflection. The longer unlike-addend
route can therefore be omitted from these tasks without removing the learner's
conceptual work. This does not amend any addition route, including the frozen
schedule in DECISION-034, or change the like-denominator omission in
DECISION-039.

## Current behavior and design boundary

Today, episode schedules are derived from an addition/subtraction instance and
its renaming sides. A transform response constructs an equivalent form as part
of that operation; the episode then operates and resolves the sum. Optional
Plan 25 help is tied to an active transform schedule entry and its side. The app
does not currently register a stand-alone one-fraction task or the inspect/keep/
repair response described here. The visual and linear paths project the same
scene, but both renderers currently handle the existing beat vocabulary.

The dossier proposes authored focused-task definitions and fixed schedules. It
does not treat them as current runtime capabilities. A source follow-on needs a
separate owner structural disposition for the new task data, response
classification, completion state, assistance/provenance, replay identity and
both render paths. It must leave existing definitions and replay meaning intact.

For a first future learner-reachable source slice, the dossier recommends one
new goal (“Show the same amount with smaller parts”) and three fixed reviewed
task records at target denominator 12: one construction (`2/3 = ?/12`), one
valid inspection proposal (`3/4 → 9/12`), and one repair proposal
(`5/6 → 11/12`, repaired to `5/6 → 10/12`). This gives inspection both keep
and repair outcomes, varies the source-to-target scale factors (4, 3, and 2),
and limits the initial bar bound. The set is a capability and learning-support
demonstration, not unfamiliar-item transfer evidence or an independent
assessment. A fixed authored mapping pins each item's task variant before
construction; it does not choose from learner responses. The owner must still
dispose of the goal's reach and the relationship to Next, because a new goal
and authored item mapping are product changes, not activated by this dossier.

## Included and excluded variation

| Dimension | Plan 29 recommendation |
|---|---|
| Task responsibility | Vary between constructing an equivalent form and inspecting/keeping/repairing one. |
| Numeric instance | Vary authored source fractions, target units, and whether the proposal is valid. Numeric variety alone is not a task variant. |
| Guidance | Keep learner-requested, task-local help optional; do not fade it automatically or count assisted work as independent. |
| Representation | Reuse the current bar and symbolic/linear affordances. A visual bar view and its linear access alternative are not, by themselves, a transfer experiment. |

Do not add least-common-unit comparison, prediction across one whole,
whole-plus-remainder, a number line, random beat omission, or more variants.
Those serve other concepts or retain separate gates. Do not turn the two
variants into a learner-facing selector, an adaptive sequence, or a change to
Plan 26's Next contract.

## Read next

- [Task variants and concise episode outlines](task-variants.md)
- [Contracts, evidence boundaries, and owner acceptance brief](contract-and-evidence.md)
- [Plan 29 task contract](../plan-29-purposeful-episode-task-variation-design.md)
- [Current episode/selection constraints](../../decision-log.md#decision-034---the-episode-arc-is-a-schedule-computed-once-from-the-problem)
- [Purposeful-variation research brief](../../../reports/orchestration/purposeful-episode-task-variation-research.md)

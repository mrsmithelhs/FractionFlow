# Purposeful Episode Task Variation Design

**Disposition:** Owner review proposal from Plan 29. These task variants and
contracts are not yet accepted, registered, learner-reachable, or implemented.
The [scale and integration addendum](scale-and-integration-addendum.md) is now
the primary design proposal for using them inside full addition practice. The
standalone focused-task proposal below is retained as an optional use.

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

The variants elicit different work inside a full addition. Construction creates
the required equivalent operand forms. Inspection starts from authored proposals;
the learner keeps forms that preserve amount and repairs false forms before
using the accepted forms in the sum. Candidate truth varies as authored task
data; every proposal cannot be wrong. The addendum defines two shorter, fixed
full-operation recipes and their compatibility boundary.

## What stays fixed and what can leave

The whole, source fraction value, requested target unit, exact-equivalence rule,
answer classification authority, help ownership, and replay meaning are fixed
within an authored task. Exact validation remains system responsibility even
when a learner task is shorter. Requested help records supported-in-app work;
absence of an in-app help request records only unassisted-in-app work, not
independent work.

For the proposed compact full-operation recipes, the target denominator is
supplied in the authored item and displayed as context, with no required
acknowledgment. The recipes omit the notice, denominator-choice, and separate
reflection entries while retaining each required renaming, the actual addition,
and its result. The resulting practice does not assess denominator selection or
explicit unit-noticing. These are new recipes that require structural disposition;
they do not change any legacy addition schedule or alter DECISION-039.

The earlier standalone focused tasks remain an optional use: they can practice
one amount-preserving renaming without an operation. Their earlier target-12
first-slice recommendation is revised; it is not the primary integration path.

## Current behavior and design boundary

Today, episode schedules are derived from an addition/subtraction instance and
its renaming sides. A transform response constructs an equivalent form as part
of that operation; the episode then operates and resolves the sum. Optional
Plan 25 help is tied to an active transform schedule entry and its side. The app
does not currently register either compact pattern recipe or the inspect/keep/
repair transform response. The visual and linear paths project the same scene,
but both renderers currently handle the existing beat vocabulary.

The dossier proposes two versioned authored-pattern definitions and frozen
compact schedules alongside the optional focused-task definitions. It does not
treat them as current runtime capabilities. A source follow-on needs an explicit
DECISION-034 structural disposition for schedule derivation from a problem plus
an authored pattern, leaving all legacy definitions and replay meaning intact.
The follow-on also needs task data, response classification, assistance and
form provenance, pattern identity, replay behavior, and both render paths.

For a first future source slice, the primary proposal reuses three already
admitted unlike-addition instances at target denominator 12: canonical
`2/3 + 1/4`, Plan 26 `1/2 + 1/3`, and Plan 32 `1/3 + 1/4`. The two authored
patterns are compatible with all three; inspection requires newly authored,
exactly checked candidate forms, not new numerical problem records. A focused
source prototype should exercise each pattern across multiple existing item
identities without fixture-specific source branches. Assign the learner-facing
item-to-pattern mapping deterministically before each episode. This bounded
slice demonstrates pattern reuse and guided practice, not efficacy, transfer,
independence, or broad bank coverage.

The earlier standalone three-record goal remains documented in the optional
focused-task contracts in [contract-and-evidence.md](contract-and-evidence.md).
It is no longer the primary first-slice recommendation. The relationship to
current Next and any future constrained sampler still requires owner
disposition; no new goal or selection behavior is activated by this dossier.

## Included and excluded variation

| Dimension | Plan 29 recommendation |
|---|---|
| Task responsibility | Vary between constructing an equivalent form and inspecting/keeping/repairing one. |
| Numeric instance | Vary authored source fractions, target units, and whether the proposal is valid. Numeric variety alone is not a task variant. |
| Guidance | Keep learner-requested, task-local help optional; do not fade it automatically or count assisted work as independent. |
| Representation | Reuse the current bar and symbolic/linear affordances. A visual bar view and its linear access alternative are not, by themselves, a transfer experiment. |

Do not add least-common-unit comparison, prediction across one whole,
whole-plus-remainder, a number line, arbitrary beat omission, or more variants.
Those serve other concepts or retain separate gates. This slice adds no
learner-facing pattern selector, performance-driven pattern assignment, or
change to Plan 26's Next contract. Future constrained random selection and
mastery-conditioned policies are separate owner/research gates; this proposal
does not impose a universal ban on those future policies.

## Read next

- [Task variants and concise episode outlines](task-variants.md)
- [Scale and full-operation integration addendum](scale-and-integration-addendum.md)
- [Contracts, evidence boundaries, and owner acceptance brief](contract-and-evidence.md)
- [Plan 29 task contract](../plan-29-purposeful-episode-task-variation-design.md)
- [Current episode/selection constraints](../../decision-log.md#decision-034---the-episode-arc-is-a-schedule-computed-once-from-the-problem)
- [Purposeful-variation research brief](../../../reports/orchestration/purposeful-episode-task-variation-research.md)

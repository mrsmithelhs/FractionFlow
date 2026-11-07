# Plan 80 Requirement 0: comparison scope proposal

Status: proposed for orchestration scope approval; no response design, batch, implementation, or owner decision is adopted here. Baseline: `077bcebdbea77b7d171dc459d38c868efaf22ec9` (committed HEAD at preflight); `node scripts/dev/plan-status.js check 80` returned RUNNABLE on 2026-11-07. Unrelated pre-existing Plan 39 and 40 evidence changes are outside this scope.

## Question and candidates

Compare the same problem, starting representation, available aids, final two fields (whole count and eighth count), Check, feedback, and recovery in both candidates:

1. **Final response only:** the learner enters both final counts and checks once. After acceptance, show the one-whole exchange and removal as an explanation. Before Check, a correct answer alone does not establish that the learner recognized the exchange.
2. **Brief renaming decision:** before the same final response, the learner supplies the new total number of eighths after one whole is renamed; the remaining whole count is shown as one less. For `3 2/8`, the learner enters `10` to make `2 10/8`. Validate that count against the original fractional count plus eight, preserving the starting quantity. An invalid or blank entry receives specific, non-answer-revealing feedback and remains editable; no removal or final answer is inferred. On a valid entry, preserve the starting amount and distinguish the eight renamed pieces from the original pieces, then permit the final two-field response. A correct entry supports the narrower inference that the learner supplied a valid renamed count in this prompted context, not that they independently understand or would choose decomposition. The dossier should compare a required step with making it optional help, recording the assistance boundary without treating help as independent evidence. Simply revealing the conversion is not a learner decision.

Both candidates explicitly require `0` in the whole field for a result below one; blank is incomplete, not zero. The eighth count stays in eighths for this comparison, including unreduced `2/8`. The dossier will specify validation, editable drafts, help and retry behavior, feedback, and what is observable at each point; these are proposals, not current product claims.

## Proposed domain and boundary witnesses

Positive mixed operands `W a/8 − V b/8`, with integer `W > V >= 1` and `1 <= a < b <= 7`, rename exactly one whole: `W a/8 = (W−1) (8+a)/8`. The difference is `(W−V−1) (8+a−b)/8`, with 1–7 eighths remaining. Proposed four-item comparison batch (subject to adoption):

| Problem | Renamed minuend | Result | Coverage |
| --- | --- | --- | --- |
| `3 2/8 − 1 5/8` | `2 10/8` | `1 5/8` | Required mixed-result witness |
| `2 1/8 − 1 7/8` | `1 9/8` | `0 2/8` | Below one, explicit zero wholes |
| `4 3/8 − 2 6/8` | `3 11/8` | `1 5/8` | More whole units |
| `2 2/8 − 1 3/8` | `1 10/8` | `0 7/8` | Below one, upper remainder boundary |

Boundary controls outside the live batch: `3 3/8 − 1 3/8 = 2` has zero eighths and needs no decomposition; `1 2/8 − 2 5/8 = −1 3/8` is negative and excluded. The listed equalities are preliminary arithmetic for scoping, not a math-core verification. If approved, reproduce exact equality and subtraction checks with the existing math core, including these controls and the `3 2/8 = 2 10/8` identity, before recommending a batch.

## Comparison and planned evidence

Assess whether each candidate makes quantity preservation and the source unit legible; the learner action and evidence it actually supports; burden and agency; recoverability after an invalid entry; assistance and independence semantics; consistency with the no-decomposition task; and feasibility of visual and linear, keyboard and non-drag paths. Compare identical operands and aids so the added decision is the meaningful difference. Separate exact checks, design judgment, and future learner observations; no learning benefit is asserted.

If scope is approved, sketch initial, recovery and accepted states for both result forms, and the intermediate renaming state for candidate 2. Keep one whole at the same width as its eight pieces, distinguish renamed and original pieces from removed pieces, and avoid exposing the result initially or through accessible names. Plan browser checks at 360 × 740 with normal and 200% root text, including the widest intermediate representation and a complete count fallback. Browser, assistive-technology and learner outcomes remain future evidence, not findings of this proposal.

## References and stop

- [Plan 80 packet](../../../docs/development/plan-80-mixed-number-subtraction-with-decomposition-design.md) and [roadmap §43–44](../../../docs/founding/06-roadmap.md#43-phase-5-decomposition): decomposition and Phase 5 exit evidence.
- [Plan 78](../../../docs/development/plan-78-mixed-number-subtraction-without-decomposition.md): no-decomposition comparison; [Plan 74](../../../docs/development/plan-74-mixed-number-addition-with-regrouping.md): reverse equivalence move.
- [Plan 77](../../../docs/development/plan-77-mixed-addition-modular-authoring-pilot.md): compact records and separate batch coverage; [Plan 56](../../../docs/development/plan-56-task-specific-support-and-independence-design.md): assistance and evidence semantics.
- [Decision log](../../../docs/decision-log.md) and [packet board](../../../docs/development/README.md): current project decisions and tracking.

Stop here for orchestration scope approval before writing `task-design.md` or the exact-check artifact. Scope approval is not owner adoption of a response or batch and is not implementation authorization. Advisor consultation is not warranted for this prose-only scope proposal; the orchestration review gate remains. No runtime, content, scheduler, or records changes are authorized by this proposal.

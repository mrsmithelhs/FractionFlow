---
id: plan-73
title: Mixed-Number Addition With Regrouping Design
status: draft
depends_on: [plan-56, plan-58, plan-72]
gate: "Approve the report-only scope before the dossier. Owner adopts one response design and a bounded first slice before separate implementation."
summary: >-
  Compare a single final answer with one brief learner-controlled exchange
  for same-denominator mixed addition, covering both zero and nonzero
  remainders after forming a new whole.
---
# Plan 73 — Mixed-Number Addition With Regrouping Design

Design the next step after [Plan 72](plan-72-mixed-number-addition-without-regrouping.md). Keep denominators equal within each problem so that composing a whole from source pieces is the new mathematical demand. Follow [Roadmap §41](../founding/06-roadmap.md#41-phase-5-composition) and the adopted Plan 56 support contract. Review Plan 58's whole-plus-fraction models and Plan 72's two fields, fixed denominator suffix, and eighths layout evidence.

## Requirement 0 — Propose the investigation and stop

Run packet preflight when dispatched and pin a committed source baseline. Own only `reports/development/plan-73-mixed-number-addition-with-regrouping-design/`. Save `scope-proposal.md` with the comparison criteria, example bounds, existing source and evidence to inspect, and stopping rule. Stop for orchestration approval before drafting the dossier.

## Requirement 1 — Compare both responses on both outcomes

Use the same cases and available aids for both response designs. Start with these two exact examples and verify the arithmetic with the existing math core:

| Case | Operands | Before exchange | After exchange |
| --- | --- | --- | --- |
| Zero remainder | 1 3/8 + 2 5/8 | 3 wholes and 8 eighths | 4 wholes and 0 eighths |
| Nonzero remainder | 1 5/8 + 2 6/8 | 3 wholes and 11 eighths | 4 wholes and 3 eighths |

Bound the first slice to positive mixed operands with proper fractional parts and exactly one new whole to compose. Explain how the two outcomes are represented and checked, including explicit zero versus blank input, whole-only accepted notation for the zero case, and source-denominator notation for the nonzero case. Test reasoning at exactly one whole and above one whole. Use the boundary below one whole to check that the proposed rule never offers an invalid exchange.

- **Single final response.** The learner enters the final whole and source-piece counts and checks once, following Plan 72. Show how the task and feedback can make the equivalence visible. Identify what this response can establish and what it leaves unknown about the learner's regrouping strategy.
- **One brief regrouping action.** Specify what whole and piece quantities are given or learner-established when the action appears. The learner explicitly exchanges one full source unit's worth of pieces for a whole and accounts for the remainder. Describe exactly what the action asks the learner to decide, what it reveals, and how it connects to the final response. Avoid a confirmation click that simply advances a solved example.

For each design, walk both cases from prompt to accepted result. Compare mathematical responsibility, answer leakage, recovery, accessibility, interaction cost, and what the app can honestly observe. Recommend one design and explain what would justify the extra action. A correctly valued but ungrouped response needs organization guidance if admitted, with a separate response for an unequal sum. Specify what the learner can revise after an error and what optional help can show without supplying the final counts.

## Requirement 2 — Preserve quantity and equivalent access

Explain how the visual path shows the same pieces becoming a whole without a change in total amount or whole-unit scale. Provide a linear and non-drag equivalent that gives the learner the same information and decisions. Keep any motion optional and provide an equivalent settled state. Specify concise labels, grouped stacked notation, and what is visible before and after the exchange or Check.

Use existing narrow-width and enlarged-text evidence to identify layout risks from the extra pieces, new whole and intermediate state. Specify a later browser check at 360×740 with normal and 200% root text for both outcomes, including any intermediate exchange, retry/help and acceptance. Account for all quantities if a complete text count summary is needed. Existing captures provide precedent. The later implementation needs its own rendered evidence.

## Delivery and boundaries

Deliver `task-design.md`, reproducible exact-arithmetic evidence, one recommended response and first batch, and `progress.md` committed last. Identify the smallest future source slice, help/retry/replay implications, and explicit scheduler eligibility and record coverage questions. Resolve local links and run packet lint and scoped diff checks.

This packet covers design and report-local verification. Runtime changes, unlike denominators, mixed subtraction, scheduler admission, record expansion and learner studies require separate scope. No advisor is expected for prose-only work. Owner adoption and a separate implementation packet follow delivery review.

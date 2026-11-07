---
id: plan-71
title: Mixed-Number Addition Without Regrouping Design
status: complete
resolution: "Owner adopted one two-field response and all four mixed addition problems, including eighths, on 2026-11-06. Plan 72 carries implementation and required eighths layout verification."
depends_on: [plan-58, plan-70]
gate: "Approve report-only scope before the dossier. Owner adopts the task and bounded first slice before any source implementation."
summary: >-
  Design the first mixed-number addition task with mixed-number operands and
  fractional parts that sum to less than one. Reuse the established whole and
  fraction representations and propose a small first batch.
---
# Plan 71 — Mixed-Number Addition Without Regrouping Design

2026-11-06. Next content packet after Plan 70. This dependency sets the work order. The mixed-number task itself does not depend on scheduler behavior.

Read Roadmap §§39–41, the accepted Plan 54 design and Plan 58 implementation, and the Plan 56 support contract. Run preflight, pin the source baseline and propose a bounded report scope before the dossier. Own only `reports/development/plan-71-mixed-number-addition-without-regrouping-design/`.

Design one short task in which learners add mixed-number operands while preserving the meaning of the whole units and fractional parts. Recommend a compact first batch with exact authored forms and a reason for each variation. Start by examining same-denominator fractional parts, so the first design can isolate mixed-number addition from renaming. The fractional parts must sum to less than one. Use existing exact arithmetic to verify candidate forms and state what the current APIs can already support. Distinguish this task from Plan 58's construction of a mixed form from a single quantity.

Propose concise prompts, stacked mixed notation, a useful visual and linear equivalent, required learner decisions, recovery, optional help and a clear completion point. Make the whole-plus-fraction structure visible without revealing the answer. Review narrow and Chromebook layout risks using existing evidence and report what requires later rendered verification. Include the expected session eligibility and record-coverage questions for a future implementation packet.

Deliver one recommendation, sample learner journeys, a proposed first slice and progress committed last. This is report-only. Regrouping, mixed subtraction, automatic scheduling of the new task, new record coverage and source changes require separate decisions. Run link, packet lint and scoped diff checks.

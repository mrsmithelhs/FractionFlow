---
id: plan-75
title: Mixed-Number Subtraction Without Decomposition Design
status: in-progress
depends_on: [plan-38, plan-56, plan-72, plan-74]
gate: "Approve report scope first. Owner adopts one task and a bounded first batch before separate implementation."
summary: >-
  Design the first same-denominator mixed-number subtraction task, with no
  renaming of a whole. Compare a direct answer with one purposeful takeaway
  action and recommend a small exact batch.
---
# Plan 75 — Mixed-Number Subtraction Without Decomposition Design

## Packet Metadata

- Packet id: `plan-75`
- Packet title: Mixed-Number Subtraction Without Decomposition Design
- Status: (see frontmatter)
- Owner/model: one investigator, orchestration scope review, owner task adoption
- Date: 2026-11-07
- Packet type: Phase 5 task design
- Mutation level: report-only
- Approval gate: Requirement 0 scope approval, then owner design adoption

Follow [Roadmap §42](../founding/06-roadmap.md#42-phase-5-mixed-subtraction-without-decomposition), [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md) and the [packet board](README.md). Use the Plan 38 takeaway precedent and the accepted Plans 72/74 response and notation. Use Plan 56 for support and assistance semantics.

## Requirement 0 — Propose and stop

Run preflight and pin the baseline. Own only `reports/development/plan-75-mixed-number-subtraction-without-decomposition-design/`. Save `scope-proposal.md` with the learner decision to investigate, comparison criteria, example bounds and existing artifacts to inspect. Stop for orchestration approval before drafting the dossier. Plans 76 and 77 may proceed independently.

## Investigation and delivery

1. Keep positive mixed operands, equal source denominators, and a minuend with enough fractional pieces to subtract directly. Propose a compact first batch of three or four problems. Cover both a nonzero remainder and a zero remainder after subtracting equal fractional parts. Verify an excluded boundary where the minuend has more wholes but too few fractional pieces. Example witnesses are `3 5/8 − 1 2/8 = 2 3/8`, `3 3/8 − 1 3/8 = 2`, and `3 2/8 − 1 5/8` outside this slice. Reproduce the math using existing exact APIs. Keep source forms distinct from accepted display.
2. Compare one final two-field response with a variant that asks for one meaningful takeaway action before the answer. Describe what the learner decides, what each task reveals, and what evidence would justify the extra action. Recommend one. Address fixed denominator suffix, explicit zero versus blank, unequal versus equal-but-unorganized responses if admitted, concise recovery, and optional help that preserves the mathematical decision.
3. Sketch initial, recovery, and settled visual and linear states for both remainder cases. Show whole units and eighths on consistent scales. The settled model should make the removed and remaining quantities legible without giving away the answer beforehand. Describe how the equivalent keyboard and non-drag path participates, and specify later mounted checks at 360 × 740 with normal and 200% root text.
4. Deliver `task-design.md`, a reproducible exact check, and `progress.md` committed last. Explain the smallest future implementation, which parts can reuse accepted contracts, what would falsify the recommendation, and which claims require later browser or learner evidence.

Checklist. Resolve links and pass packet lint and scoped diff checks. Keep source, data banks, scheduler, practice records, unlike denominators and decomposition outside the write scope. The rejected decomposition example is a boundary check. State the advisor disposition. Report for review and leave status and owner decisions to orchestration.

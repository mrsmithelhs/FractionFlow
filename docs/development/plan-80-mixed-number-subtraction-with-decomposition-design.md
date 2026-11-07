---
id: plan-80
title: Mixed-Number Subtraction With Decomposition Design
status: delivered
depends_on: [plan-56, plan-74, plan-77, plan-78]
gate: "Approve the report-only comparison scope first. Owner adopts one response design and a bounded batch before implementation."
summary: >-
  Compare one final response with a brief learner-controlled renaming
  decision for mixed-number subtraction that decomposes one whole.
  Preserve the starting amount and the source unit across the exchange.
---
# Plan 80 — Mixed-Number Subtraction With Decomposition Design

## Packet Metadata

- Packet id: `plan-80`
- Packet title: Mixed-Number Subtraction With Decomposition Design
- Status: (see frontmatter)
- Owner/model: one investigator, orchestration scope review, owner task adoption
- Date: 2026-11-07
- Packet type: bounded Phase 5 task design
- Mutation level: report-only
- Approval gate: Requirement 0 scope approval, then owner design adoption

Follow [Roadmap §43](../founding/06-roadmap.md#43-phase-5-decomposition), [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md) and the [packet board](README.md). Use Plan 78 as the no-decomposition comparison, Plan 74 for the reverse equivalence move, Plan 77 for compact records and separate batch coverage, and Plan 56 for assistance and evidence semantics.

## Requirement 0 — Propose and stop

Run packet preflight when dispatched and pin a committed baseline. Own only `reports/development/plan-80-mixed-number-subtraction-with-decomposition-design/`. Save `scope-proposal.md` with the two response candidates, intended learner decision, exact domain and boundary witnesses, comparison criteria, references and stopping rule. Stop before drafting the dossier for orchestration approval. Plan 81 can run independently.

## Investigation and delivery

1. Propose three or four positive mixed-operand problems in eighths. Require proper positive source fractions, a minuend with more wholes and fewer fractional pieces than the subtrahend, and exactly one whole renamed. Verify exact equality before and after renaming with the existing math core, including `3 2/8 = 2 10/8` and `3 2/8 − 1 5/8 = 1 5/8`. Compare a mixed result with a result below one, such as `2 1/8 − 1 7/8 = 2/8`, and distinguish zero whole units from a blank response. With source numerators `a < b < 8`, the remainder `8 + a − b` is positive. Cover zero eighths using a no-decomposition control such as `3 3/8 − 1 3/8 = 2`, outside the proposed live batch. Verify an excluded negative case as well.
2. Compare the same operands and aids in two designs. In the first, the learner enters final whole and eighth counts and checks once, with the exchange shown after acceptance. In the second, the learner makes one brief renaming decision before the same final response, for example supplying the new eighth count after one whole is renamed. Specify what the learner supplies, what the app validates, how an invalid exchange is revised, and what becomes inferable before final Check. A control that only reveals an app-supplied conversion does not demonstrate a learner decision. If the extra step earns a place only as optional help, say so and specify its assistance boundary.
3. Sketch initial, recovery, and accepted visual and linear states for both result forms, plus the intermediate state if the renaming action is used. Track the same whole at the same width as it becomes eight pieces, distinguish those pieces from the original eighths and from removal, and keep the result out of the initial model and accessible names. Allow equivalent keyboard and non-drag participation, preserve draft and help state, and avoid redundant prompts or a spent confirmation. Specify later browser checks at 360 × 740 with normal and 200% root text, including the widest intermediate representation. Require a complete count fallback if a model cannot fit.
4. Recommend a response and compact first batch, and explain what would change that recommendation. Separate exact evidence, design judgment, and future learner observations. Deliver `task-design.md`, a reproducible exact check, and `progress.md` committed last. Identify the smallest follow-on source slice and any remaining Phase 5 exit evidence.

Checklist. Resolve links and run packet lint and scoped diff checks. Keep runtime, content banks, scheduler, local records and unlike denominators outside the write scope. State the advisor disposition under AGENTS.md. Report for review and leave status, owner adoption and any implementation to orchestration.

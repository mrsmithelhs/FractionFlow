---
id: plan-83
title: Phase 5 Exit Review and Mixed-to-Improper Bridge Design
status: delivered
depends_on: [plan-53, plan-56, plan-58, plan-72, plan-74, plan-78, plan-82]
gate: "Approve the report-only review scope first. Owner decides the Phase 5 exit disposition and whether to adopt a bridge design."
summary: >-
  Check the accepted mixed-number work against the Phase 5 exit criteria.
  If a learner-owned equivalence gap remains, propose one mixed-to-improper
  decision with the shared number-line point revealed after a correct Check.
---
# Plan 83 — Phase 5 Exit Review and Mixed-to-Improper Bridge Design

## Packet Metadata

- Packet id: `plan-83`
- Packet title: Phase 5 Exit Review and Mixed-to-Improper Bridge Design
- Status: (see frontmatter)
- Owner/model: one investigator, orchestration scope and evidence review, owner disposition
- Date: 2026-11-07
- Packet type: bounded Phase 5 evidence and task design
- Mutation level: report-only
- Approval gate: Requirement 0 scope approval, then owner exit and any bridge adoption decision

Follow [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md), and the [packet board](README.md). Use [Roadmap §39](../founding/06-roadmap.md#39-phase-5-mixed-number-foundations), [§44](../founding/06-roadmap.md#44-phase-5-exit-gate), [§91](../founding/06-roadmap.md#91-decision-checkpoint--before-mixed-numbers), and [OQ-24](../open-questions.md#oq-24--there-is-no-mixed-number-instructional-strategy).

## Requirement 0 — Propose and stop

Run preflight when dispatched and pin the committed baseline. Own only `reports/development/plan-83-phase-5-exit-and-mixed-improper-bridge-design/`. Save a short `scope-proposal.md` identifying the accepted artifacts to inspect, the standard for finding a gap, and the evidence that would make an additional task unnecessary. Stop for orchestration approval before writing the review.

## Review and conditional design

1. In `phase-5-exit-review.md`, map each §44 criterion to actual accepted artifacts and remaining limits. Start with Plans 53 and 58 for two-whole placement and whole-plus-fraction construction, and Plans 72, 74, 78 and 82 for mixed arithmetic. Separate exact arithmetic, rendered and mounted behavior, and what the learner actually decides. Classify each criterion as supported within the admitted slice, partially supported, or open. In particular, distinguish the app displaying both forms after an answer from the learner establishing that the forms name the same amount. Recommend a bounded exit disposition and provide proposed OQ-24 wording that reflects current capabilities and any remaining gap. Leave canonical documents to orchestration.
2. If the evidence already covers a meaningful learner-owned mixed/improper equivalence decision and a coherent representation bridge, cite the precise journey and explain why another task adds little. If the gap remains, add a short `bridge-design.md` proposing **one learner decision** and **one Check**. Start with a supplied stacked mixed number, such as `1 3/4`, and ask the learner to choose its equivalent improper fraction. Use the existing two-whole scale `[0,2]`. After a correct Check, show both forms at the same number-line point, using the same unit and a concise explanation of why they coincide. Withhold the line, target point and completed equivalence before correct acceptance, including in accessible descriptions. An incorrect Check should preserve the choice for revision and give brief feedback without revealing the point. The line is an explanation and adds no second placement, reflection, or confirmation task.
3. For a proposed bridge, specify a small authored batch within the accepted representation bounds, plausible nontrivial alternatives, and deterministic exact validation that admits one correct choice per record. Verify the witness using the existing math core. Sketch visual and linear paths with equivalent choices, recovery and accepted explanation, including keyboard and non-drag participation. Specify what mounted evidence would establish equal units, an aligned shared point, withholding, and readable layout at 360 × 740 with normal and enlarged text. Separate these proposed checks from any claim of learner understanding. Describe the smallest separate implementation and what evidence would make it worth doing.

## Delivery

- [ ] Deliver the exit review and proposed OQ-24 disposition. Deliver a bridge design and reproducible exact evidence only if the gap remains.
- [ ] Resolve links, run packet lint and scoped diff checks, and commit `progress.md` last. State advisor disposition under AGENTS.md and report the unresolved owner decisions.

Keep runtime, episode changes, scheduler, learner records, deployment and Phase 6 work outside the write scope. The implementer reports and stops for orchestration review. Phase 5 exit, canonical documentation updates and any source work require separate disposition.

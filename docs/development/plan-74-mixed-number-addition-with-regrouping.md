---
id: plan-74
title: Mixed-Number Addition With Regrouping
status: in-progress
depends_on: [plan-56, plan-72, plan-73]
gate: "Approve the admission, response and representation mechanism before source work. Owner reviews both rendered remainder cases before closeout."
summary: >-
  Add a standalone two-problem mixed-number practice that forms one new whole
  from eighths. Keep one final two-field response, then show the regrouping
  for both zero and nonzero remainders.
---
# Plan 74 — Mixed-Number Addition With Regrouping

## Packet Metadata

- Packet id: `plan-74`
- Packet title: Mixed-Number Addition With Regrouping
- Status: (see frontmatter)
- Owner/model: one implementer, orchestration mechanism and delivery review, owner rendered acceptance
- Date: 2026-11-07
- Packet type: bounded Phase 5 implementation
- Mutation level: scoped content, instructional state, presentation and verification
- Approval gate: Requirement 0 before source changes, then technical and owner rendered review

Plan 72 covers same-denominator sums whose fractional parts stay below one whole. Extend the learner task to the point where eighths form another whole. The new whole must come from visible existing quantity. Use the [Plan 73 adoption](../../reports/development/plan-73-mixed-number-addition-with-regrouping-design/owner-acceptance.md), [task design](../../reports/development/plan-73-mixed-number-addition-with-regrouping-design/task-design.md) and [Roadmap §41](../founding/06-roadmap.md#41-phase-5-composition). Plan 56 governs support and evidence claims. Follow [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md) and the [packet board](README.md).

## Requirement 0 — Investigate, propose and stop

Run packet preflight and pin a committed source baseline. Inspect Plan 72 and Plan 58 for reusable arithmetic, response, notation and rendering seams. Save the proposal to `reports/development/plan-74-mixed-number-addition-with-regrouping/mechanism.md`. Identify the proposed practice label and chooser location, versioned task/set/item identities, admission rule, exact classification and draft limits, scene withholding, representation at the maximum draft, complete count fallback, help/focus and replay behavior, and expected shared-file and route impacts. Preserve existing Plan 72 behavior and replay compatibility. Stop for orchestration approval before changing source.

## Requirement 1 — Admit the two authored problems

| Case | Authored operands | Before regrouping | Accepted fields | Displayed result |
| --- | --- | --- | --- | --- |
| Zero remainder | 1 3/8 + 2 5/8 | 3 wholes and 8 eighths | 4 and 0 | 4 |
| Nonzero remainder | 1 5/8 + 2 6/8 | 3 wholes and 11 eighths | 4 and 3 | 4 3/8 |

Use compact authored operand records and the existing exact math core. Derive the grouped result and source-unit remainder deterministically. The table is verification evidence. Require positive mixed operands with proper fractional parts, equal source denominators and exactly one new whole. Witness the below-one boundary with 1 3/8 + 2 4/8, and reject malformed or mismatched operands. Preserve authored forms and source units.

Register one standalone practice in the existing chooser and reuse shared progression and return. The learner-controlled exchange, unlike denominators, subtraction, scheduler admission, featured rotation eligibility, and new local practice-record coverage are outside this slice. Preserve existing privacy and persistence boundaries.

## Requirement 2 — One final response with useful recovery

Present the original mixed numbers with stacked notation and equal-scale models. Provide two initially blank fields for the final whole count and the numerator in eighths, using Plan 72's visible **/ 8** suffix and an accessible name that identifies the unit. Use one **Check**. Explicit zero is required for the first case. Blank is incomplete. Keep the active scene and help free of precomputed pooled and final totals, including accessible descriptions. Optional unit help may show or describe an unfilled eighths unit without giving the answer. Preserve entered values, help state, and focus across retry and view changes as appropriate under the shared task conventions. Both support settings offer the same aids in this slice.

Admit bounded equivalent drafts of **3 wholes and 8 eighths** and **3 wholes and 11 eighths** on their respective problems. Acknowledge the correct amount and ask the learner to make another whole. Give distinct concise feedback for an unequal amount and distinguish malformed or incomplete input. Require the organized response for acceptance. Editing clears stale feedback and preserves the other field. Fresh attempt, next item, and replay follow existing contracts without inheriting stale drafts or help. Evidence may establish the submitted answer and help use. The learner's regrouping strategy remains unknown.

## Requirement 3 — Show the conserved amount after acceptance

Use the shared success treatment and show the organized result. Make the eight original eighths traceable as one new whole on the same scale as the original wholes, and account for all remaining pieces. The zero case has no remaining pieces and uses whole-only accepted notation. The nonzero case retains the denominator of eight. The visual and linear paths provide the same operand information, decisions, help and accepted quantities. Provide a complete count summary when the graphic cannot fit, distinguishing missing input from zero. Require no drag or animation. Any optional motion must settle to the same representation under reduced motion. Reuse shared Next and final return without adding a confirmation step.

## Delivery and verification

- [ ] Verify exact admission, both results, equivalent ungrouped drafts, unequal and invalid responses, withholding, retry/help, view switching, fresh attempts, progression and replay. Check a representative existing Plan 72 route for regression.
- [ ] Run mounted browser journeys for **both cases** at **360 × 740** with normal and **200% root text**. Save initial, draft, retry/help and accepted evidence. Include the eleven-piece draft and explicit zero. Check equal whole widths, readable labels and suffix, full quantity accounting, focus and reachable controls, and no horizontal overflow. Vertical scrolling is acceptable. Record root-text scaling separately from any actual browser zoom.
- [ ] Verify representative Chromebook width, keyboard and linear completion, and non-drag touch in browser emulation. State which observations were emulated.
- [ ] Run targeted tests, the existing test suite, build, relevant browser routes, packet lint and scoped diff checks. Document protected route impacts and seek approval for any needed migration.
- [ ] Honor the mechanism stop, keep changes scoped, and commit the artifacts and final `reports/development/plan-74-mixed-number-addition-with-regrouping/progress.md` last. Report the advisor disposition under current AGENTS.md rules. A bounded Terra-medium read-only pass requires orchestration authorization.

The implementer reports observed behavior and evidence limits, leaves packet status and orchestration records to orchestration, and stops for technical review. Owner rendered acceptance and deployment are separate gates.

---
id: plan-84
title: Mixed-to-Improper Number-Line Bridge
status: draft
depends_on: [plan-53, plan-56, plan-58, plan-77, plan-83]
gate: "Approve Requirement 0 before source changes. Owner reviews the rendered bridge and decides Phase 5 exit separately."
superseded_by: null
resolution: null
summary: >-
  Implement the four adopted mixed-to-improper equivalence problems.
  Vary the correct option position and reveal the shared number-line point
  only after a correct Check.
---
# Plan 84 — Mixed-to-Improper Number-Line Bridge

## Packet Metadata

- Packet id: `plan-84`
- Packet title: Mixed-to-Improper Number-Line Bridge
- Status: (see frontmatter)
- Owner/model: one implementer, orchestration mechanism and delivery review, owner rendered acceptance
- Date: 2026-11-07
- Packet type: bounded Phase 5 implementation
- Mutation level: task content, instructional state, presentation and verification
- Approval gate: Requirement 0 before source changes, then technical and owner rendered review

Implement the [Plan 83 bridge design](../../reports/development/plan-83-phase-5-exit-and-mixed-improper-bridge-design/bridge-design.md) as adopted in the [owner record](../../reports/development/plan-83-phase-5-exit-and-mixed-improper-bridge-design/owner-acceptance.md). Follow [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md) and the [packet board](README.md). Use Plan 53 for two-whole scale and narrow-layout precedent, Plan 58 for the complementary improper-to-wholes task, Plan 56 for support semantics and Plan 77 for compact data and explicit membership.

## Requirement 0 — Propose and stop

Run preflight and pin the committed baseline. Save `mechanism.md` under `reports/development/plan-84-mixed-to-improper-number-line-bridge/`. Specify registered data and exact admission, choice and recovery state, standalone routing and replay identities, focus and view switching, the pre/post-Check projection, reuse of the two-whole geometry, and the label layout for eighths at enlarged text. List shared files and protected journeys. Stop for orchestration approval before source changes.

## Implement the adopted task

| Supplied mixed form | Options in display order | Correct slot |
| --- | --- | --- |
| 1 1/2 | 1/2, 2/2, 3/2, 4/2 | 3 |
| 1 1/4 | 5/4, 4/4, 6/4, 8/4 | 1 |
| 1 3/4 | 4/4, 7/4, 6/4, 8/4 | 2 |
| 1 2/8 | 8/8, 9/8, 12/8, 10/8 | 4 |

1. Admit the four compact authored records with explicit membership. Preserve the authored denominator and notation, including `1 2/8` and `10/8`. Use the exact math core to derive and validate one equal option per record. Validate distinct choices and the supported two-whole bounds. The slots in the table are evidence for review, not grading inputs. Keep order deterministic through retries, view switches and replay. Each slot is correct once across the batch.
2. Present the stacked mixed number, one initially unselected group asking which fraction names the same amount, and one **Check**. Support keyboard and non-drag touch. An empty Check gives a brief selection cue. A wrong Check preserves the editable selection and gives concise recovery feedback. A changed selection clears stale feedback. Keep the line, target marker and completed equivalence out of the projected and accessible pre-acceptance states, including wrong-answer recovery. The answer options themselves remain available.
3. After a correct Check, use house feedback and show both forms at one point on the same-unit 0–2 number line. Divide both whole intervals into equal parts using the source denominator. Provide a concise count explanation and equivalent accepted information in the linear view. Label placement may wrap or use separate rows while keeping both labels tied to one point. The accepted state goes directly to the existing progression action. Keep the explanation free of a second placement, reflection or Finish step.
4. Integrate as a standalone practice using the existing chooser and progression contracts. Preserve the draft and feedback across a view switch, reset on fresh attempt or next problem, and preserve supported historical replay. Keep featured rotation policy, scheduler membership, learner records, other episodes and deployment outside this slice.

## Delivery

- [ ] Verify exact admission, unique equivalence, rejection of ambiguous or altered records, all four answer positions, and original notation. Exercise initial, empty Check, wrong Check, revision and correct Check states, view switching, focus, retry, progression and replay.
- [ ] Use mounted witnesses to verify withholding before correct Check, equal whole intervals and both forms tied to the same point after acceptance. Exercise visual and linear paths, keyboard and non-drag touch. Include 360 × 740 at normal and 200% root text, with the eighths example and a representative Chromebook width. Capture initial and accepted evidence and check readable notation, visible controls and unclipped labels.
- [ ] Run focused and full tests, build, relevant browser witnesses, packet lint and scoped diff checks. Keep historical evidence read-only. Record verification limits and advisor disposition under AGENTS.md. Commit scoped work and `progress.md` last in the packet report directory.

The implementer stops at technical delivery. Phase 5 remains open until the owner reviews the rendered bridge and decides the exit disposition.

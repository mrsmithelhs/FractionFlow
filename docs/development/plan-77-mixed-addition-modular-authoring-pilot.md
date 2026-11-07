---
id: plan-77
title: Mixed-Addition Modular Authoring Pilot
status: draft
depends_on: [plan-30, plan-42, plan-74]
gate: "Approve the Plan 74 content seam and holdout protocol before source changes. Broader adoption requires a separate decision."
superseded_by: null
resolution: null
summary: >-
  Separate records, task admission and versioned set membership for one
  mixed-number family. Measure whether a second author can add an unseen
  batch through data and membership alone while preserving existing replay.
---
# Plan 77 — Mixed-Addition Modular Authoring Pilot

## Packet Metadata

- Packet id: `plan-77`
- Packet title: Mixed-Addition Modular Authoring Pilot
- Status: (see frontmatter)
- Owner/model: one source writer, independent holdout author in isolation, orchestration review
- Date: 2026-11-07
- Packet type: bounded authoring architecture pilot
- Mutation level: Plan 74 content seam and focused validation
- Approval gate: Requirement 0 before source changes, then review of the measured authoring outcome

Use [Plan 30](plan-30-compact-content-authoring-investigation.md) for compact content precedent and [Plan 42](plan-42-operate-response-ownership-pilot.md) for evidence about edit ownership. Pilot only the accepted [Plan 74](plan-74-mixed-number-addition-with-regrouping.md) family. Follow [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md) and the [packet board](README.md).

## Requirement 0 — Propose and stop

Run preflight, pin the baseline, and map the current authoring path from record to set membership, admission, learner launch and replay. Save `mechanism.md` in `reports/development/plan-77-mixed-addition-modular-authoring-pilot/`. Propose the smallest content seam that separates compact operands, task-specific admission/materialization and versioned membership. Preserve current exports, exact behavior and historical identity. Record a baseline edit exercise and predeclare how an independent author will attempt a comparable unseen batch using only the resulting authoring guide in isolation. Set pass criteria and stop before source changes.

## Implement and test the seam

1. Own `src/content/plan74-mixed-addition-task.js`, new Plan 74-specific data files under `src/content/data/`, a new Plan 77-specific test file, and the packet's report folder. Preserve the consumer interface and the two live Plan 74 records, their order and identities, their validation and their v17 replay. Keep the math core, shared app/registration, scene, renderer, replay dispatch, existing tests and route matrix read-only. Escalate if this seam cannot be demonstrated within those bounds.
2. Provide a short authoring guide and a repeatable validator that reports the item and reason for admission failure. Keep operands and genuinely authored metadata in data. Derive exact results and keep versioned membership explicit. Preserve the identity of the live set and prevent any trial item from entering it. Prove compatibility with historical replay evidence and reject malformed, duplicate or ineligible records and invalid membership.
3. In isolation, have an independent author use the guide to add a small unseen valid batch and diagnose an invalid item. Agree on equivalent case coverage for the baseline and pilot before running either. Record files touched, source versus data changes, validator diagnostics, unexpected dependencies, correction passes and any observed usability limits. Show that generic checks cover all trial records and that a discriminating example reaches the existing mounted task where the isolated test setup supports it. Keep the exercise outside the live bank.
4. Deliver the narrow source change, tests, authoring guide, and a comparison with a concrete adopt/adjust/defer recommendation. Record separately whether the pilot reduced per-record changes and whether it made the workflow easier to understand. No framework migration, generic episode engine, new learner task, runtime bank activation, or other family migration is in scope.

Checklist. Run focused content, Plan 74 and replay regressions, build, relevant existing browser witnesses, packet lint and scoped diff checks. Record any evidence that could not be reproduced and the advisor disposition. Commit scoped work and `progress.md` last. Report for review and leave status, broader rollout and deployment to orchestration.

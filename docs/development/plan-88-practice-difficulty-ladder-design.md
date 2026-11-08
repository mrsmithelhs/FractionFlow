---
id: plan-88
title: Practice Difficulty Ladder Design
status: draft
depends_on: [plan-56, plan-66, plan-86, plan-87]
gate: "Approve the report-only scope before investigation. Owner adopts any proposed ladder and first implementation slice separately."
superseded_by: null
resolution: null
summary: >-
  Design a small, inspectable practice progression using task-specific
  challenge features and purposeful variation, with separate presentation
  eligibility and no learner profiling.
---
# Plan 88 — Practice Difficulty Ladder Design

## Packet Metadata

- Packet id: `plan-88`
- Packet title: Practice Difficulty Ladder Design
- Status: (see frontmatter)
- Owner/model: one investigator, orchestration evidence review, owner design decision
- Date: 2026-11-07
- Packet type: bounded scheduler and instructional design
- Mutation level: report-only
- Approval gate: Requirement 0 scope approval, then owner design review

Follow [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md), [Roadmap Phase 6](../founding/06-roadmap.md#45-phase-6--scaffold-system-and-independence) and the [packet board](README.md). Use [Plan 56](plan-56-task-specific-support-and-independence-design.md), [Plan 66](plan-66-research-led-episode-scheduler-design.md), and the delivered Plan 86 and 87 evidence.

## Requirement 0 — Propose and stop

Pin the baseline and propose two or three existing families, the task features that may change their demands, the accepted evidence to inspect, and what would falsify a plausible ordering. Save a short scope proposal under `reports/development/plan-88-practice-difficulty-ladder-design/`. Stop for approval before the investigation.

## Design and deliver

1. Compare the same bank under a short seeded draw and a modest authored progression. Consider features such as exchanging a whole, the relation to a familiar benchmark, and whether the learner constructs or evaluates an equivalent form. Explain counterexamples to a universal denominator-based ranking. Keep task demands, available help and viewport eligibility separate.
2. Show concrete short journeys with variation within a comparable level and a reason for each change in demand. Keep Start a practice session a direct launch. Describe how the progression remains coherent if the wider pool is unavailable, and how a learner can move at their own pace using existing controls or one separately proposed optional action. Make assumptions and decisions inspectable. Use no learner profile or inference of mastery.
3. Recommend a bounded first implementation, including task-feature ownership, deterministic ordering and replay implications, failure cases, and what to observe in a later learner review. Deliver a short design and owner decision brief, validate references and packet lint, and commit `progress.md` last. Keep runtime changes, new data collection, classroom testing and deployment outside this packet.

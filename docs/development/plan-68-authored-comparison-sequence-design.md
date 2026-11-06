---
id: plan-68
title: Authored Comparison Practice Sequence Design
status: complete
resolution: "Owner adopted fixed comparison sequence 02 → 09 → 11 → 10 and deferred the optional fifth on 2026-11-05. Plan 69 carries the separately gated implementation."
depends_on: [plan-45, plan-49, plan-57, plan-66]
gate: "Approve the report-only scope before the dossier. Owner adopts the fixed sequence before any separately gated implementation."
summary: >-
  Design a short fixed sequence of symbolic fraction comparisons using distinct
  admitted pairs and purposeful variation. Evaluate whether a learner-requested
  extra practice opportunity adds enough value to study later.
---
# Plan 68 — Authored Comparison Practice Sequence Design

2026-11-05. Report-only follow-up to the accepted Plan 66 architecture and evidence limits. The first deliverable is a fixed sequence a learner can use without remembering enabled. The current Plan 57 comparison-and-distance session provides lifecycle precedent and remains a separate authored experience.

## Requirement 0 — Check the baseline and propose scope

Run packet preflight when dispatched. Read the [Plan 66 owner adoption](../../reports/development/plan-66-research-led-episode-scheduler-design/owner-acceptance.md), [scheduler design](../../reports/development/plan-66-research-led-episode-scheduler-design/scheduler-design.md), and the accepted Plans 45, 49, 57 and 63 contracts. Inspect the actual admitted comparison records, support and common-denominator construction paths. Write `scope-proposal.md` under `reports/development/plan-68-authored-comparison-sequence-design/` with the proposed task boundaries, candidate pool and stopping rule. Stop for orchestration approval before the dossier.

## Requirement 1 — Specify the fixed sequence first

Recommend one finite sequence of three or four admitted proper-fraction comparisons, with the exact ordered record IDs and revisions. For each item, explain what the learner does, the relationship the pair makes useful to notice, and why the item comes there. Use distinct underlying pairs. Treat a reversed pair as practice with ordering or symbol direction, and explicitly justify it if selected. Describe plausible strategies and what cues and help the app actually provides. Avoid assigning an easier/harder ranking without evidence.

Walk through start, successful response, retry and existing help, Next, final completion and early exit. The sequence stays fixed across responses, support choices, access paths and remembering settings. Preserve existing meaningful decisions and the ordinary keyboard, non-drag touch and linear participation paths. Document any gap in the current catalog instead of inventing an admitted record. Recommend no new UI control if the existing task and session controls suffice.

## Requirement 2 — Decide whether a later optional choice earns a place

Only after the baseline is specified, consider at most one concrete learner-requested opportunity, such as choosing a fresh pair to try the same comparison reasoning again. State the mathematical purpose, timing, exact available content and help, default continuation, and added workload. A request is a transient instruction for that visit. Do not infer or store preferences, skill labels or weakness from it. Do not revive the retry-triggered 08/09 branch as a default.

Recommend keeping the fixed sequence alone if the alternative duplicates existing help or adds choice without a clear instructional benefit. If it earns further investigation, outline how a later evaluation could distinguish the effect of offering a choice from differences in content or practice exposure. Identify any confound that would remain, and distinguish learner understanding and later transfer from practice completion. Evaluation is a design proposal with a separate approval gate.

## Deliverables and boundaries

Own only the packet's report folder. Deliver `sequence-design.md` with the ordered sequence, source-backed reasoning, learner journeys and a recommendation on the optional choice. Record checks, limitations and any owner decision in `progress.md`, committed last. Validate record references against the registered catalog and run documentation link, lint and diff checks. No advisor is expected for this prose-only packet.

This packet authorizes design work only. Runtime scheduling, learner profiling, record or schema changes, instrumentation, learner studies, source changes and deployment are outside its scope. Any later implementation must separately establish session ownership and assess Plan 63 record compatibility for the proposed context.

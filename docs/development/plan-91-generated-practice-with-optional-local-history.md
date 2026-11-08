---
id: plan-91
title: Generated Practice With Optional Local History
status: in-progress
depends_on: [plan-61, plan-63, plan-66, plan-90]
gate: "Orchestration approves Requirement 0 before investigation. The owner reviews the generated-session design and proposed observation and history-use contract before a separate implementation packet."
summary: >-
  Design generated visits using symbolic comparison and unlike-denominator
  subtraction, with optional browser-local history, direct Start, and a fresh
  start after clearing the record.
---
# Plan 91 — Generated Practice With Optional Local History

## Packet Metadata

- Packet id: `plan-91`
- Title: Generated Practice With Optional Local History
- Status: (see frontmatter)
- Owner/model: Terra-high lead investigator, Luna-medium workers, orchestration and owner design review
- Date: 2026-11-08
- Packet type: scheduler and local-history design
- Mutation level: report-only
- Approval gate: Requirement 0, then owner adoption of design and observation scope

## Goal and scope

Design a scheduler that selects problems from eligible pools to fill a coherent visit. Plan 90 chooses among four authored patterns. This design must allow meaningfully different problems and task mixes within the same session goal. Exact sample journeys demonstrate the policy. They are test cases rather than a fixed production itinerary.

Start with symbolic fraction comparison and public Plan 40 v2 unlike-denominator subtraction. Comparing magnitudes and reasoning about equivalent forms or common units can prepare a learner to find a difference. Plan 40 offers distinct tasks for identifying a needed renaming, evaluating a supplied form, and constructing equivalent forms. Inventory the other public episode types for later coverage. Keep the first history-informed design and successor limited to the two named families. Preserve Plan 90's useful no-history experience and existing supported routes. Held bank revisions, review variants, and data-only holdouts remain gated.

Read [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md), the [packet board](README.md), [Roadmap Phase 7](../founding/06-roadmap.md#51-phase-7--session-composition), and [Plan 90's implementation evidence](../../reports/development/plan-90-goal-linked-managed-practice/integrated-evidence.md). Use the adopted decisions and evidence limits in [Plan 61](../../reports/development/plan-61-local-learner-history-and-practice-guidance-design/owner-acceptance.md), [Plan 63](../../reports/development/plan-63-optional-local-comparison-practice-record/owner-acceptance.md), and [Plan 66](../../reports/development/plan-66-research-led-episode-scheduler-design/owner-acceptance.md). Use the [Common Core mathematics standards](https://corestandards.org/wp-content/uploads/2023/09/ADA-Compliant-Math-Standards.pdf) for curriculum mapping and distinguish that mapping from the evidence of task demand and learner performance.

## Requirement 0 — Propose and stop

Run preflight, pin the baseline, and save a short `scope-proposal.md` under `reports/development/plan-91-generated-practice-with-optional-local-history/`. Identify exact public pools, the record and scheduler contracts to inspect, proposed investigation assignments, and the examples or counterexamples that could invalidate the proposed policy. Stop for orchestration approval before investigation. The lead may use disjoint Luna-medium workers for read-only investigation or separate reports. The lead owns the synthesis and verifies consequential claims. Children do not delegate.

## Design and deliver

1. **Generate a visit.** Define a finite session goal, problem roles, eligible candidate pools, and selection rules that choose among candidates at each role. Show multiple generated visits for the same goal with different problem identities and learner decisions. Preserve a coherent mathematical connection and a useful no-history visit. Keep **Start a practice session** a direct launch and use the existing pacing and exit controls. Separate selection policy from exact admission, mathematical validation, support and measured fit. Show a coherent shorter or alternate visit when a required task cannot fit, a safe empty-pool outcome, and how future work is rechecked without losing the active task or draft. Specify seeds and versioned inputs sufficient to reproduce a choice for verification.
2. **Define the minimum local observations.** Inventory the current comparison-only record and which opportunities are invisible to it. Propose separately observable exposure, first attempt, eventual result, and assistance when the task supports them. Bind evidence to exact task identity and versioned skill and demand descriptors. Specify deduplication across retries and view changes, handling of older or partial records, and exactly which events count for coverage and problem-relative recency. Missing evidence stays unknown. Do not treat historic comparison-only sequence numbers as a count of all problems or as elapsed time.
3. **Explain how history influences selection.** Map curriculum connections and prerequisites separately from within-family demand. Use coverage of underexplored families, tentative evidence across distinct comparable problems, and recent work with intervening practice to prioritize candidates. Reserve occasional review for older, well-supported skills. Demonstrate how easy and harder variants of one family can lead to different choices. Distinguish first-response success, recovery and assisted completion. Give inspectable reasons, specify how thin or conflicting evidence limits a recommendation, and treat weights and gaps as testable design choices. Avoid learner grade, mastery labels or automatic support fading.
4. **Specify opt-in and reset.** Treat one opted-in browser record as a working proxy for one learner across visits. Keep observations and derived evidence browser-local, inspectable, clearable and stoppable. Define how clearing invalidates cached evidence and pending work from the old record, including another open tab where applicable. A later Start after Clear uses the fresh-record policy. Clearing preserves current work and honors the existing remembering control semantics. Show useful behavior when remembering is off or storage fails, and propose concise wording that explains how the optional record affects practice. A separate owner decision must adopt the expanded observation and use contract before implementation.
5. **Prepare one gated successor brief.** Include exact identities and goals, data and policy ownership, compatibility and erasure, measured admission, and evidence for the full two-family loop. Show generated sequences and reasons for a fresh record, sparse record, stronger evidence on easier tasks, a recent return versus an older review, remembering off, and a clear followed by a fresh Start. Include a same-seed comparison isolating the effect of history and a multiple-seed check that demonstrates meaningful variety. Propose mounted browser and regression checks, internal orchestration gates, and final owner rendered review.

## Delivery boundaries

- [ ] Save the design, evidence and successor brief in the Plan 91 report folder. Cite current source, prior adopted contracts and the evidence behind each curriculum mapping.
- [ ] Keep runtime changes, new observation collection, held-content exposure, new accounts or remote data, classroom evaluation and deployment outside Plan 91.
- [ ] Validate references, packet lint and the scoped diff. Commit scoped reports, with `progress.md` last. Keep the proposal open for owner adoption and a separate implementation assignment.

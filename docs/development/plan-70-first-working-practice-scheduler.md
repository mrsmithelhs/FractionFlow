---
id: plan-70
title: First Working Practice Scheduler
status: complete
resolution: "Owner accepted the rendered direct-launch practice scheduler on 2026-11-06 after technical review."
depends_on: [plan-56, plan-60, plan-63, plan-64, plan-66, plan-67, plan-69]
gate: "Approve the bounded slot policy, eligible item pool and session admission mechanism before source work. Technical and owner review of real sessions precede closure."
summary: >-
  Start a short practice session directly from entry. Select a purposeful
  mix of existing episode types using explicit rules and no learner profile.
---
# Plan 70 — First Working Practice Scheduler

2026-11-06. The owner approved direct launch and variation among episode types. The existing **Start a practice session** button opens the first problem on activation. Its place on the start page is between the featured practice and **Choose what to practice**. The learner can use Choose to select a specific goal.

Read the adopted [scheduler evidence limits](../../reports/development/plan-66-research-led-episode-scheduler-design/owner-acceptance.md), [support contract](../../reports/development/plan-56-task-specific-support-and-independence-design/owner-acceptance.md), [fixed comparison design](../../reports/development/plan-68-authored-comparison-sequence-design/sequence-design.md), and [Plan 69](plan-69-fixed-comparison-practice-session.md). Use Roadmap §§52–58 for stable runs, purposeful variation, bridges and a natural close.

## Requirement 0 — Propose the working policy and stop

Run preflight and pin the source baseline. Write `mechanism.md` in `reports/development/plan-70-first-working-practice-scheduler/`. Propose a single theme, three or four finite slots, the exact admitted registry records and revisions eligible per slot, the mathematical connection between consecutive problems, and at least two realizable outputs. Start the investigation with two comparisons and a purposeful number-line bridge involving a shared benchmark such as one half. Check the actual tasks and aids before recommending exact items. Explain which interaction is stable and what changes at the bridge.

Specify the selection input, reproducibility, freshness between starts, exclusion of repeated underlying pairs or items, and a finite fallback. Show how the existing session lifecycle can admit a narrowly validated scheduler output while preserving exact admission of both literal manifests. Propose exact file ownership, Plan 63 record eligibility and truthful coverage, protected route impacts, and tests. Stop before source work for orchestration approval. Escalate if the admitted pool cannot support two coherent outputs without new content.

## Requirement 1 — Select and validate one session on Start

Use a small authored policy with ordered slots and explicit compatible item choices. Select from admitted references at launch and validate the entire output before installation. At least two supported selection inputs must produce different valid sequences, and every normal scheduled sequence must contain at least two episode types. Variation must come from the slot policy and eligible records, rather than choosing between whole hardcoded sessions. Use deterministic selection given an explicit reproducible input, with a fresh in-memory selection input on each new start. Consecutive starts can produce the same valid result. Keep the exact selected order fixed for that active session.

Use the task registry and existing admission, episode and exact math contracts. Match versioned task identities and real support capabilities before admitting a candidate. Reject arbitrary or mutated outputs at the session boundary, including wrong slot order, incompatible type or revisions, and repeated pairs. Do not add new learner tasks, per-problem rules in the app shell, or a general curriculum engine. Use the fixed Plan 69 manifest as the control and proposed safe fallback. If a valid scheduled sequence cannot be prepared, try the admitted fixed fallback before installing anything. If both preparations fail, keep the start page usable and show a concise notice.

## Requirement 2 — Keep the learner journey direct and finite

Start opens item one directly, with no sequence picker or setup step. Deliberate Next advances through the selected sequence. Retry, help, model use, access path and remembering do not alter order or membership. Keep the learner's selected starting support and existing task help. Preserve each episode's meaningful response and accepted result. Reuse restart, early exit, Stay/Escape/Leave, focus, failure recovery and final **Back to start** conventions. Preserve the featured selection on return and retire the session on exit or reload.

Keep the existing comparison-and-distance session available from the chooser and retain standalone launches. Plan 63 eligibility is an explicit mechanism decision for the exact installed contexts. Use existing fields and lifecycle guards where coverage is approved, and accurately describe any excluded tasks. The scheduler takes no input from records, past choices, answers, inferred skills or identities. Keep session state ephemeral. No adaptive support, learner profiling, saved preferences, resume, instrumentation, learner study or deployment is in scope.

## Requirement 3 — Verify and deliver

Test the approved selection policy with controlled inputs and falsify it with a deliberately invalid slot, repeat or unavailable candidate. Verify the fallback and all-or-nothing preparation. Exercise two different mixed outputs through the visible Start button and actual controls, with correct identities, a retry/help, deliberate advancement, completion and return. Include representative keyboard, linear and non-drag touch access, and remembering off. Verify that remembering state cannot change selection given the same input, that eligible observations obey the approved coverage, and that standalone and legacy-session paths remain available. Capture representative entry, bridge and completion screens at narrow and Chromebook widths. Treat browser evidence as observed behavior rather than a learning outcome.

Run focused tests, affected browser routes, build, packet lint and scoped diff checks. Preserve protected witnesses and historical fixtures unless an exact migration is approved. One bounded read-only Terra-medium review may run if orchestration authorizes it for substantial work. Commit explicit scoped paths and progress last. Owner rendered review and deployment are separate gates.

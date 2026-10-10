---
id: plan-26
title: Vetted Addition Practice and Next Problem
status: complete
resolution: "Technical delivery accepted after both bounded repairs; owner accepted rendered output on 2026-10-10. The fixed two-item Next/Retry/reset/replay contract is delivered; broader content variety and deployment remain separate."
depends_on: [plan-21, plan-25, plan-22]
gate: "DECISION-041 adopts the bounded selection contract. Owner initiation and Requirement 0 execution mechanism approval precede source work. Technical and owner rendered-screen/agency acceptance remain separate from publication."
summary: >-
  Author and admit one additional relatively-prime addition item, then implement
  a fixed two-item set with completion-gated learner-triggered Next, explicit
  exhaustion, fresh episode state, preserved settings and stable replay identity.
---
# Plan 26: Vetted Addition Practice and Next Problem

## Packet Metadata

- Packet id: `plan-26`
- Packet title: Vetted Addition Practice and Next Problem
- Status: (see frontmatter)
- Owner/model: implementer (single writer) / orchestration
- Date: 2026-10-09
- Packet type: gated implementation
- Mutation level: bounded content, app composition, identity/replay integration and tests
- Approval gate: owner initiation; execution mechanism; technical and owner rendered/agency acceptance
- Depends on: `plan-21` (accepted contract), `plan-25` (helper/reset baseline), `plan-22` (honest denominator-path boundary)
- Expected artifacts: scoped implementation, browser evidence and `reports/development/plan-26-vetted-addition-practice-and-next-problem/progress.md`

## Goal and why this packet exists

The learner currently has one unlike-denominator addition item. Implement
DECISION-041's smallest concrete variety increment: existing `2/3 + 1/4` first,
then `1/2 + 1/3`, through the existing “Add fractions with different denominators”
goal. Authoring the second candidate and the selection control may occur together;
complete item admission before exposure. Preserve the current item and old replay
meaning. This proves trying a different vetted problem, not broad family coverage,
transfer, engagement or Roadmap §30 completion.

## Authority and contracts

Read `AGENTS.md`, `docs/agent-starting-prompts/implementer-prompt.md`,
`docs/decision-log.md` (028, 034–041), `docs/open-questions.md` (23),
`docs/development/README.md`, packet tracking guidance, the Plan 21 dossier and
delivery review, Plan 22/24/25 accepted reviews, and current content/definition,
task-data, episode, replay, app, renderer and route contracts. Use current source
and artifacts rather than report counts. DECISION-041 is the adopted policy;
Plan 21's fuller compatibility/focus proposals are inputs to Requirement 0.
Preserve exact math → instruction → presentation, frozen per-episode schedule,
condition/support semantics, meaningful learner contributions and static privacy.

## Scope and non-goals

In scope: the additional fixture and its complete authored premise/reflection data;
an explicit finite set/registry mapping; bounded app-owned selection lifecycle;
Next/Retry/exhaustion/refusal/reset/focus integration; immutable identity/replay
compatibility; narrowly necessary projection/renderer changes; discriminating
tests/routes and rendered evidence. Name the exact files at the mechanism gate.

Out of scope: generated learner draws, other family activation or new entry
taxonomy, new instructional tasks/beat schedules, random task substitution,
adaptive fading, session length/interleaving/retrieval policy, rewards, progress
storage, analytics, accounts, learner studies, prototype winner, deployment and
capacity increases. Do not merge future shared-factor/nested work or denominator
discovery into this packet. Concurrent source work must be serialized.

## Implementation Requirements

### Requirement 0 — Investigate and stop for execution mechanism approval

Run `node scripts/dev/plan-status.js check plan-26` before packet work. A runnable
draft does not constitute owner initiation. Once initiated, inspect existing
launch/Retry/return/replay, content validation, authored tables, help drafts,
focus and terminal-state behavior. Propose wiring and exact owned files, then
stop before source changes or new evidence scripts.

The proposal must specify set/item/content/definition/task-data identities;
second-item authoring and all admitted denominator paths; finite selection,
applicability, exhaustion versus corrupt-data refusal; mounted focus destinations;
legacy replay preservation; and discriminating browser witnesses. Resolve any
required definition revision or identity migration explicitly at the gate. Prefer
bounded app composition over a generic curriculum engine; Next is a navigation
action, not a mathematical reducer intent or a session replay format. No rule may
revise the episode schedule from responses. If existing semantics cannot support
the candidate, stop and report the structural conflict rather than broaden scope.

### Requirement 1 — Admit the second authored item

Use exact `1/2 + 1/3 = 5/6`. The reviewed candidate has common units 6 and 12,
with scale factors 3/2 and 6/4 respectively. Re-verify against current eligibility
and author complete truth-based premise/reflection data for every admitted path,
including both premise answers across authored cases. Carry both support profiles,
all applicable conditions, visual/linear paths, task-local help and replay.
Do not generalize from exact arithmetic to instructional admission, coerce a valid
unsupported unit into “wrong,” or hardcode helper arithmetic in rendering.
Pin immutable task facts; never rewrite an old fixture's premise/reflection facts
in place. Demonstrate the current canonical behavior and retained replay oracle.

### Requirement 2 — Completion, navigation and fresh state

Keep the adopted order and today's precise goal label. Offer “Next problem” only
at actual terminal episode completion, including reflection when enabled. No
mid-task skip, automatic advance or cycling. At the last item, use one short
exhaustion message and an available return to practice choices. Decide the exact
control/message and focus mechanics at Requirement 0; avoid a misleading Next
control that cannot supply a different item.

Retry preserves current content/definition identity but clears all episode work.
Next changes vetted identity and clears all episode work. Return/re-entry starts
the stable first item. Compare complete fresh state against an independently
constructed expected episode and account for legitimate configuration/content
differences. Cover accumulated responses, recovery/help, conversion work, replay,
transient helper/input drafts and summaries; a clean starting screen alone is
insufficient. Preserve selected access view and reviewer condition/support.
Per-item applicability changes behavior, never silently the selected settings.
Missing/corrupt authored data must refuse before mounting an unsafe next episode
with a visible usable recovery path; retain the known completed item. Distinguish
this from declared inapplicability/unsupported configuration under the approved
finite mechanism. Do not create speculative heterogeneous content just to test it.

### Requirement 3 — Participation, copy and evidence

Use real mounted-control activations for Next, Retry, return, exhaustion and
refusal. Prove focus on the fresh episode heading/container, then the first
appropriate control; handle exhaustion/refusal deliberately under the approved
mechanism. Preserve keyboard, non-drag touch, linear and reduced-motion access.
Use concise task-local questions; no repeated headings/questions, explanation
transcripts, spent controls or pre-answer disclosure. Review sequential full
episodes, not only isolated successful screenshots, for repeated premise/reflection
burden. Preserve current Inspection Mode and motion/focus contracts.

At 360×740 and a representative Chromebook CSS viewport, measure visible questions,
controls, horizontal overflow and ordinary scroll. Report CSS dimensions and zoom;
do not infer physical-device/AT testing or larger-denominator admission. Retain
immutable per-episode replay identities through Next, Retry and replay reconstruction;
do not invent persistence or aggregate session history.

## Work plan and validation checklist

Preflight/inspection → proposed mechanism and stop → bounded implementation after
approval → discriminating tests, routes and rendered evidence → review and scoped
commits → progress report committed last.

- [ ] Fully authored second item admitted through every supported path, with data/definition identities recorded.
- [ ] Required report and reproducible browser evidence exist.
- [ ] Next absent before true completion; order/different identity/exhaustion/refusal witnessed.
- [ ] Retry/Next/return clear accumulated episode and transient UI work; retained settings/access view witnessed.
- [ ] Legacy replay oracle and current canonical routes retain meaning and pass.
- [ ] Actual mounted focus, keyboard/touch-context, linear and reduced-motion routes pass.
- [ ] Narrow/Chromebook measurements and full-journey copy review recorded with limits.
- [ ] Appropriate unit tests, builds, full route matrix, packet lint and diff check pass.
- [ ] Mechanism gate honored; inherited advisor declaration/disposition recorded; no unrelated changes.

## Stop Conditions, authority and report

Stop on a blocked preflight, conflicting identity/schedule policy or load-bearing
owner decision. Implementer may not set completion status, edit owner/orchestrator
dispositions, or declare the packet complete/ready to ship. Report verified behavior,
refused paths and uncertainty against the actual objective, not passing counts.
Apply inherited advisor/commit rules; stage explicit paths, never push/deploy,
and commit progress.md last. Owner rendered/agency acceptance is still required.

---
id: plan-37
title: First Number-Line Task and Bar-to-Line Bridge Design
status: in-progress
depends_on: [plan-18, plan-29, plan-34]
gate: "Design acceptance only. Phase 3 bar-stability/representation review and a separate approved implementation packet remain required before number-line source activation."
summary: >-
  Design one meaningful bar-to-number-line connection around locating the same
  fraction amount. Specify exact unit/domain, learner action, recovery, accessible
  equivalent and honest geometry without introducing a representation framework,
  automatic capacity expansion or another long arithmetic episode.
---
# Plan 37: First Number-Line Task and Bar-to-Line Bridge Design

## Packet Metadata

- Packet id: `plan-37`
- Packet title: First Number-Line Task and Bar-to-Line Bridge Design
- Status: (see frontmatter)
- Owner/model: design implementer / orchestration
- Date: 2026-10-17
- Packet type: bounded representation/interaction design
- Mutation level: documentation and non-shipped design artifacts only
- Approval gate: owner design adoption; source and deployment separately gated
- Expected artifacts: evidence inventory, rival/falsifier table, annotated task flow, capability/state contract, implementation recommendation, progress report

## Goal and reason

Give number lines a distinct learning purpose: connect a fraction's amount in a
divided whole with its location as a number. The recommended first candidate is
to locate the **same amount** on a 0-to-1 line after seeing a bar, using stable
benchmarks. This is a design starting point, not an adopted learner task or a
claim of measured transfer. It must require a meaningful learner connection,
rather than merely showing an animated conversion between two pictures.

The separate multi-whole-stack-to-line magnitude obligation remains open. Revisit
it after the first line task has a reviewed unit/position/access contract and
before claiming coverage of crossing-one-whole transfer. Orchestration retains
that follow-up; a 0-to-1 first task does not discharge it.

Current source names number-line capability but explicitly refuses it. There is
no delivered line renderer/learner task to activate by flipping a flag. Design
the smallest coherent addition to the mathematical-state → instructional-state
→ presentation pipeline, with a concise familiar response grammar.

## Non-goals, dependencies and phase gate

No product source, active content or representation switch; no framework/plugin
engine, multiplication/division, mixed numbers, new arithmetic, automatic fading,
random selection, tracking, learner study or deployment. Do not force every
arithmetic episode to display both bars and lines or append another reflection.

Plans 18/29/34 supply accepted short-task and variation boundaries, not number-line
readiness. Design can use a pinned accepted bar baseline while Plan 35 proceeds;
reconcile any affected contracts with its delivered state before recommending a
source packet. No hard Plan 35 dependency is invented for documentation work.
Roadmap §31's bar-stability exit and §90's representation checkpoint remain
explicit gates for implementation. This design's closure cannot declare Phase 3
complete; learner-facing subtraction and other phase obligations remain visible.

## Authority and scope

Read AGENTS.md, docs/decision-log.md, docs/development/README.md, implementer
starting prompt, founding instructional model/grammar/math-content/architecture,
quality and roadmap §§31–37/90. Read the Phase 3 follow-up register, adopted Plan
29 design, accepted notation and bar contracts, and existing representation/
capacity research and skeptical reviews under reports/orchestration/. Reuse
existing research first; verify new factual claims with primary sources and mark
design inferences separately. Do not turn a general research recommendation into
evidence for a particular FractionFlow gesture or mastery threshold.

Own only reports/development/plan-37-first-number-line-and-bar-bridge-design/.
Read current content eligibility, scene's explicit number-line refusal and
bar-specific app/render composition. Small non-shipped exact probes and static
mockups belong in that report folder. No product/test/status or parent-review edits.

## Requirement 0 — Investigate and narrow the first connection

Run preflight and stop if blocked. Inventory what is reusable and what is absent
by exact path; preserve the distinction between named plumbing and implemented
capability. Pin the inspected source revision. Contrast same-amount placement,
benchmark comparison and movement for an operation as rival first purposes.
For each name a discriminating observation and what would falsify its suitability
under the proposed constraints. Mechanical mockup success cannot falsify a rival
learning-effectiveness claim; leave that uncertainty explicit.

Propose one first task, bounded domain and response mechanism, with a concise
scope recommendation. Stop for orchestration confirmation before detailed design;
route load-bearing pedagogical choices through the owner. Do not request approval
again for requirements already settled in the accepted contract.

## Requirement 1 — One mathematical decision and accessible participation

For the same-amount candidate, keep 0 and 1 as stable unit endpoints; justify
which intermediate benchmarks/ticks appear and why. Vary positions below, at and
above one-half so one fixed location/gesture cannot solve the sample. Do not
label the correct target point before the learner responds through text, color,
ARIA, hidden content or a completed animation. Distinguish choosing among exact
positions from approximate placement and specify how each response is evaluated.

Show the learner action, wrong response, retry/help, correct response and finish.
Use keyboard and non-drag touch alternatives with adequate targets and a coherent
focus order. The linear/accessible alternative must retain the location/magnitude
decision; copying a fraction string is not equivalent mathematical work. Explain
spoken labels without announcing the answer or forcing a screen reader to
traverse a large series of unlabeled ticks. Preserve draft state, requested help
and truthful assistance provenance. Remove spent controls and redundant narration.

Do not confuse point movement on the line with a changing quantity during an
equivalence task. Motion is optional communication, never automatic advancement;
reduced motion retains the same inspectable endpoint and learner responsibility.
Explain whether bar and line coexist or alternate and how the learner relates
them without overloading a narrow screen.

## Requirement 2 — Exact capability, geometry and state contract

Define source amount, line domain/unit, exact rational positions, benchmarks,
authored response possibilities, instruction/intent state and scene projection.
Truth comes from exact core APIs; pixel coordinates communicate it and never
establish mathematical equality. Define tolerance only if approximate placement
is the intended task; do not accept a wrong exact fraction because pixels round.
Explain effects on identity, immutable schedules, reset, Next and replay, and
which existing definitions remain unchanged.

Map actual source ownership and a minimal future implementation slice. Do not
design a universal representation API to solve hypothetical future tasks. Keep
task complexity, support and representation capability independent. Neither a
number-line label nor a wide/high-density display admits arbitrary denominators.
Specify candidate numeric bounds against actual CSS spacing, label collision,
touch/keyboard participation, zoom, resize mid-task and 360px/Chromebook layouts.
Compare sparse benchmarks with fully partitioned lines where they make different
predictions. Record the larger-denominator investigation as a separate obligation
if this design cannot resolve it; do not quietly discharge it with a mockup.

Use a small varied authored sample and deterministic validation. Do not add a
single per-problem renderer path, hand-written mathematical answer table or
automatically couple larger denominators to lower support/mastery.

## Requirement 3 — Reviewable artifacts and future falsification

Supply annotated visual and linear states, concrete concise copy and a coverage
table for domain positions, task modes, access, help/error, viewports and zoom.
Label proposed layouts honestly; static design is not measured browser behavior.
Retain research limits and an observation guide for a possible separately
authorized learner study without conducting one or storing learner data here.

Name future witnesses for stable unit, exact versus approximate response meaning,
answer withholding, reachable controls, readable line labels, focus, keyboard,
non-drag touch and reduced motion. Include intended-failure seeds such as a
shifted target, reversed endpoint, hidden/clipped line and leaked answer. State
which assertions must fail and how a clean receipt is kept separately. Do not
claim physical-device or assistive-technology coverage from browser emulation.

Recommend the smallest implementation packet and its unresolved owner decisions.
Identify what Phase 3/representation review must confirm before source activation.
Any learning/transfer or representation superiority claim requires evidence beyond
rendering, task completion or animation preference.

## Work plan, checklist and reporting

Investigate → scope gate → annotated flow/capability contract → review → progress.
Where live rival explanations remain, say which are consistent with the evidence
and name the next discriminating observation. Do not manufacture a winner.

- [ ] Actual capability inventory and sources distinguish existing from proposed behavior.
- [ ] One meaningful first connection and rival/falsifier table are reviewable.
- [ ] Visual/accessible responses preserve the same mathematical responsibility.
- [ ] Exact state/geometry/capacity/replay and concise copy are specified.
- [ ] Future source map, phase gate and required progress.md exist.
- [ ] No product/unrelated edits, phase-exit or implementation acceptance claims.

Implementers report and stop; they do not set status or edit owner/orchestration
dispositions and do not declare done/ready to ship. Follow inherited advisor
declaration rules. Codex Luna medium children are authorized where bounded;
advisors remain Sol read-only low/medium, no Astra or child fan-out. Commit explicit
owned paths, progress report last, never push. Design acceptance is separate from
source authorization, owner rendered-page acceptance and deployment.

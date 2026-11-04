---
id: plan-61
title: Local Learner History and Practice Guidance Design
status: draft
depends_on: [plan-29, plan-35, plan-57, plan-59]
gate: "Approve evidence inventory and targeted research scope before dossier; owner adopts one bounded local-history contract before a separate implementation packet. Adaptive selection requires its own later gate."
superseded_by: null
resolution: null
summary: >-
  Investigate optional browser-local history for understandable practice guidance
  and future history-informed sessions. Separate observed performance from
  uncertain skill inferences, address shared devices and version compatibility,
  and recommend one small descriptive first slice without implementing tracking
  or an adaptive policy.
---
# Plan 61: Local Learner History and Practice Guidance Design

## Packet Metadata

- Packet id: `plan-61`
- Packet title: Local Learner History and Practice Guidance Design
- Status: (see frontmatter)
- Owner/model: one investigator; orchestrator scope review; owner contract adoption
- Date: 2026-11-03
- Packet type: bounded Phase8 design investigation
- Mutation level: report-only
- Approval gate: investigation scope, owner adoption, separate source packet
- Expected artifacts: scope-proposal.md, history-design.md, synthetic-cases.md, progress.md

## Goal and reason

The owner requests two uses of history: tell learners where they are doing well
and where more practice or review may help; eventually compose practice that mixes
new tasks, areas needing practice and occasional review of established strengths.
Investigate both. Recommend a small descriptive first slice and a separate future
selection contract, with evidence limits and learner control explicit.

Plan60 introduces a finite cross-type session whose state is deliberately ephemeral.
History could support continuity across shorter visits, without making a long visit
a prerequisite for usefulness. Neither session duration nor completion establishes
learning or mastery. Do not assume a minimum effective duration.

Browser-local progress is already permitted by the founding architecture; accounts,
remote learner data and synchronization remain outside the charter. This packet
does not authorize storage, change privacy claims or activate Phase8 in the product.

## References, sequence and exclusive ownership

Read AGENTS.md, implementer-prompt.md, decision-log.md, development board,
project-seed.md; founding principles §§19–20, architecture §§27–31 and Roadmap
Phase8/§§59–62 and §92. Confirm section titles in the current files. Read adopted
task-recipe and session contracts from Plans29/35/57, current Plan60 mechanism and
lifecycle disposition, the follow-up obligations, and relevant existing research.
Inspect representative accepted tasks and their support/help/provenance/replay
boundaries, including comparison with optional construction and number-line work.
Pin source HEAD; distinguish current behavior, adopted intent and new proposals.

Own ONLY `reports/development/plan-61-local-learner-history-and-practice-guidance-design/`.
No source, test, harness, dependency, canonical document, packet-status, decision or
acceptance edits. No browser/build/full suite, prototype, telemetry, learner study,
real learner records, Bootstrap writes, push or deployment. Synthetic report examples
are permitted; do not implement a production scoring or persistence module.

The dependencies supply accepted design precedents, not learner prerequisites.
Investigation may overlap Plan60 repair/review because it writes a separate dossier.
Refresh Plan60's accepted disposition before recommending integration. Plan56 remains
a separate unadopted support-contract track: exchange assumptions through orchestration,
do not redesign its settings/help contract or require its draft as product truth.

## Requirement 0 — investigate scope and stop

Run `node scripts/dev/plan-status.js check plan-61`; stop if blocked. Propose a
representative evidence inventory, exact questions, source paths and falsifiers.
Use existing studies first. Propose a targeted primary-source/authoritative research
set only where it can change the recommendation: formative feedback, uncertainty
in skill inference, retrieval/spacing/interleaving and assistance/transfer. Normally
three to six sources suffice; justify additional work rather than surveying the
whole literature. State population/task limits and stopping rule. Stop for scope
approval before producing the dossier. No source changes after this gate either.

## Requirement 1 — what the evidence can mean

Build a compact task/evidence table. For each representative task identify the
mathematical responsibility, supplied cues, actual learner contribution, support
and requested help, first attempt, correction/recovery, and observations currently
available. Distinguish mathematical concepts from representation familiarity,
interaction mechanics and task completion. A new task type need not mean a new
concept; a familiar task with different numbers need not demonstrate transfer.

Separate three layers: normalized observations, tentative evidence summaries and
recommendations. Unknown is not weak. One error is not a stable weakness; correct
selection is not proof of construction skill; no help request is only unassisted
in-app, not proof of independent reasoning. Repeated identical items, cue-rich
success and varied less-cued success must not silently count as equivalent evidence.
Do not combine incomparable tasks into a global level or percentage mastery.

Recommend the smallest useful initial concept/task subset and a readable evidence
vocabulary. Show how sparse, contradictory, assisted and older observations change
what may responsibly be said. Candidate sufficiency/recency thresholds are design
hypotheses requiring validation, not facts established by arithmetic or a paper.
Identify evidence unavailable today rather than inventing instrumentation results.

## Requirement 2 — learner guidance and future practice composition

Show concise example summaries for doing well, suggested review and insufficient
evidence. Give a reason a learner can understand, without deficit labels, permanent
ability judgments, medals, streak pressure or a dashboard dominating practice.
Retain short house-style feedback; do not add an explanation paragraph to every
episode. Distinguish practice activity from evidence of understanding and progress.

Investigate a future explainable deterministic selector mixing introduction,
practice needs and retained strengths. Compare at most two bounded approaches and
recommend one direction, not a universal curriculum engine. Account for prerequisites,
recency, varied items, cold start, finite sessions, topic variety, learner choice,
skip/exit and returning support when the demand changes. Avoid a self-reinforcing
loop that repeatedly assigns a supposed weakness from sparse evidence. Do not lock
access to tasks behind a score or automatically couple denominator size, support
level and competence. Distinguish authored sequencing from history-informed policy.

Specify what observations and actual learner-use evidence a later adaptive packet
would need. Do not adopt a fixed mixture, automatic fading rule or mastery threshold
as validated. Test proposed policy invariants with synthetic histories only; neither
simulation nor browser walkthroughs establish educational efficacy.

## Requirement 3 — local data, consent and shared devices

Compare a small number of understandable local-history modes and recommend one:
how remembering is offered, what is shown, how to practice without history, and how
to inspect/clear it. A shared browser profile is not a learner identity; explain
how mixed-user observations would contaminate guidance. Recommend a practical reset
or shared-device behavior without accounts, names or inferred identity. Do not
silently equate this browser's record with one child's history.

Minimize retained data. Justify every proposed field against a concrete use; prefer
bounded normalized outcomes and stable task/concept/support provenance. Do not
retain raw free-form input, full intent streams or replay envelopes by default.
Numeric fields can receive arbitrary pasted text. No identifiers, analytics,
remote export, teacher dashboard, network storage or cloud synchronization.

Separate history from resuming unfinished work: the latter is not an automatic
requirement. Cover retention, erasure, absent/disabled storage, private browsing,
quota/corruption, cross-tab writes, duplicate submissions, reload and unreliable
clocks. The core remains usable on first visit and after clearing history. Determine
whether precise timestamps are needed instead of assuming they are harmless.

Audit actual About/privacy/founding wording and list exact future consistency edits;
do not change those claims during this report-only packet. Remote services would
need a separate owner charter decision, not an extension of local consent.

## Requirement 4 — ownership, compatibility and synthetic falsification

Trace where observations could be emitted and where a future local adapter could
live without reversing mathematical state → instructional state → presentation.
History must not become a second mathematical oracle or make renderers infer skill.
Distinguish episode replay/debugging from optional learner history. Recommend
clear file/process ownership and one first implementation boundary; avoid a broad
framework, replay rewrite or new schema revision assigned in advance.

Explain stable task/concept identity, recipe/definition revisions, assistance
provenance and compatibility after content, support or task changes. Historical
success under changed cues must not silently acquire a stronger interpretation.
Recommend when to preserve, quarantine or discard incompatible observations, and
what must be versioned to reproduce a recommendation.

Provide six to eight compact synthetic histories, combining cases where useful:
no data; assisted success; repeated same item; varied attempts; sparse contradiction;
mixed users; changed task definition; erased/corrupt history. For each state the
permitted summary, forbidden inference and future selection invariant. Include a
counterexample that would reject the preferred design. These are contract examples,
not a production scoring implementation or certification of learner understanding.

## Requirement 5 — recommendation and owner decisions

Deliver `history-design.md` with findings, source/research citations, one recommended
descriptive first slice and a separate later selection direction. Explicitly
recommend whether source work should proceed now or wait for missing evidence.
Make initial task coverage, retained fields, retention/control/shared-device policy,
summary language, uncertainty and compatibility actionable. Identify dependencies
on Plan56 without deciding that packet's contract. Preserve Plan60's ephemeral scope.

List owner decisions with a recommended answer and tradeoff: remembering default,
shared-device handling, descriptive claims, initial coverage, retention, and later
adaptation gate. Distinguish adopted purposes from unresolved mechanisms. Name
deferred resumption/export/policy work without turning it into automatic scope.
Propose focused future tests and rendered acceptance scenarios; actual learner-use
questions remain explicitly untested. No Phase8 completion claim.

## Validation, delivery and authority

- [ ] Scope approval recorded before dossier work.
- [ ] Two owner purposes addressed with observation/inference/policy distinctions.
- [ ] Current source and load-bearing research citations resolve; limits explicit.
- [ ] Shared-device, optionality, erasure and compatibility cases are actionable.
- [ ] Synthetic cases challenge the recommendation, not merely restate it.
- [ ] One small first source slice and later adaptation gate recommended.
- [ ] Required dossier and progress.md exist; packet lint and diff checks pass.
- [ ] Only owned report paths changed; no product storage or policy activated.

No automatic advisor for prose-only work. Declare consultation not warranted or
record any justified bounded read-only Terra-medium pass under current no-duplicate
rules. No Sol/Astra, model substitution or child fan-out. Coordinate Git, stage
explicit report paths and commit progress.md separately last. Implementers do not
change status, owner/orchestrator records or declare adoption/completion. Stop and
relay load-bearing owner choices, scope conflicts or missing capabilities.

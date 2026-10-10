---
id: plan-29
title: Purposeful Episode Task Variation Design
status: draft
depends_on: [plan-21, plan-25]
gate: "Owner initiation permits this bounded investigation/design only. Present the concrete task proposal for owner disposition before drafting or implementing its source follow-on. No task, schedule or representation is activated here."
superseded_by: null
resolution: null
summary: >-
  Design up to three purposeful learner-task variants around one fraction concept,
  preserving mathematical invariants, familiar controls and concise copy. Specify
  prerequisites, learner contributions, recovery, assistance and replay boundaries,
  with separate evidence plans for learning, transfer and interest.
---
# Plan 29: Purposeful Episode Task Variation Design

## Packet Metadata

- Packet id: `plan-29`
- Packet title: Purposeful Episode Task Variation Design
- Status: (see frontmatter)
- Owner/model: investigator (single writer) / orchestration
- Date: 2026-10-10
- Packet type: investigation / design
- Mutation level: bounded design documents and progress report
- Approval gate: owner initiation; final task-contract disposition before source follow-on
- Depends on: `plan-21` (authored identity/selection contract), `plan-25` (current requested-help and learner-contribution baseline)
- Expected artifacts: `docs/development/purposeful-task-variation-design/` dossier and `reports/development/plan-29-purposeful-episode-task-variation-design/progress.md`

## Goal and why this packet exists

Principle 8 and Roadmap §28 call for familiarity plus meaningful mathematical
variation. The owner asks which episode responsibilities should stay consistent
and which can vary to support understanding, transfer and interest. The initial
literature review supports particular mechanisms, not arbitrary variety or a
universal sequence. Turn that review into a small reviewable design using current
bar/symbolic affordances, before adding another foundational representation.

Plan 26 supplies different authored problems with Next; this packet concerns
different learner responsibilities. It neither expands nor blocks Plan 26. Start
with one concept, preferably equivalence/amount preservation, and no more than
three task variants. Construction, comparison and diagnosis/repair are candidates,
not already approved tasks. A prediction variant may replace a candidate if its
conceptual purpose is stronger; do not add every candidate to every episode.

## Authority and contracts

Read `AGENTS.md`, `docs/agent-starting-prompts/implementer-prompt.md`,
`docs/decision-log.md` (014, 021, 024, 028, 034, 039–041),
`docs/open-questions.md` (28), `docs/development/README.md`, Principle 8,
the instructional model's representation-transfer, support, interleaving and
transfer-beyond-training sections, Roadmap §§28–31 and §90, the follow-up register,
and `reports/orchestration/purposeful-episode-task-variation-research.md`.
Inspect current episode definition/schedule, scene, task help, provenance/replay,
controls and both access views. Read accepted Plan 21/25/26 reviews as context;
numeric content variety is implemented, while task-responsibility variants here
remain proposals.

Preserve exact math → instruction → presentation, frozen per-episode schedules,
immutable definition/task-data identity, honest assistance, accessible participation,
restrained copy and static privacy. DECISION-039's like-task reflection omission
is intentional. Interleaving/session frequency and adaptive fading retain later
phase gates. New task structures must be explicitly proposed, not presented as
existing runtime configuration or implicitly approved amendments to DECISION-034.

## Scope and non-goals

Write only the new design dossier and this packet's report. Read source, tests
and evidence to identify real capabilities and gaps. Use synthetic fraction cases
and document-only screen outlines; do not create source, executable prototypes,
schemas, route tooling or new browser captures. Do not edit canonical decisions,
open questions, packet statuses or owner/orchestrator dispositions.

No app activation, new family/representation, renderer plugin framework, general
denominator-discovery workflow, random beat substitution, learner modeling,
session policy, automatic adaptation, analytics, persistence, learner recruitment,
observations, efficacy claim or deployment. Further research is targeted to a
load-bearing gap; this is not another unbounded literature survey.

## Requirements and outputs

### Requirement 0 — Preflight and bounded concept brief

Run `node scripts/dev/plan-status.js check plan-29` before work; stop if blocked.
A draft is not an initiated assignment. Once initiated, identify the one concept,
candidate variants, prerequisites and existing source boundaries early. Continue
only within this docs scope. If the design requires a different concept or broader
work, stop with the concrete conflict rather than silently expanding the packet.

### Requirement 1 — Task matrix and concise screen outlines

Create `README.md` and `task-variants.md`. For each of at most three variants,
record the concept, learner starting knowledge, invariant quantities/context,
changed learner decision, concise question and response, exact answer classification,
wrong-answer recovery, task-local assistance, assistance provenance, what must be
withheld before responding, and the accessible equivalent. Include contrasting
synthetic cases that prevent a predictable answer or cue from substituting for
reasoning. Provide a compact before-response/help/recovery/after-response outline;
avoid duplicate headings/questions and growing explanation transcripts.

Show a learner's meaningful contribution and describe when extra questioning would
add burden without useful information. Do not require a written essay or force an
unnecessary conversion/reflection simply to make episodes look different. Distinguish
numeric, task, guidance and representation variation. Recommend the smallest useful
subset, with tradeoffs and explicit exclusions.

### Requirement 2 — Mechanism implications without implementation

Create `contract-and-evidence.md`. Map each recommended task to current capabilities
and missing instructional/scene/response contracts. Specify proposed definition,
task-data and replay identity; any proposed schedule difference; help/recovery/reset;
and answer-leakage boundaries. Select an authored task before episode construction,
then keep the schedule fixed. Changes outside current grammar require an explicit
structural disposition before source work, not a renderer flag or response-derived
rescheduling. Keep Next selection and representation choice separate from this task
contract. Do not author a generalized task engine or silently reuse incompatible
old replay identities.

### Requirement 3 — Evidence, learner needs and handoff

Separate source-supported findings from design inferences. For each recommendation,
name rival explanations and observations that would distinguish mathematical learning
from memorized prompts, supplied answers or interface novelty. Separate trained
completion, changed-number performance, independent work and representation transfer.
Treat learner interest/frustration separately from achievement and long-term return.
Technical routes can later prove agency/classification/focus/reset, not efficacy.

Address prerequisite differences without inventing a universal fading pace or
automatic learner model. Propose later evaluation questions only; no participant
work or learner data is authorized. End with a concrete owner acceptance brief and
bounded source-follow-on recommendation, including unresolved policy choices and
dependencies. Do not create or start that follow-on or number-line implementation.

## Work plan and validation checklist

Preflight → current capability/research inspection → bounded task matrix and screen
outlines → contract/evidence mapping → consistency and source checks → scoped dossier
commit → progress report committed last → stop for owner/orchestrator review.

- [ ] README.md, task-variants.md and contract-and-evidence.md exist in the new dossier.
- [ ] One concept, at most three variants, concise copy and actual learner contributions are explicit.
- [ ] Prerequisites, recovery, assistance, answer withholding and both access paths are specified.
- [ ] Current capabilities, proposed changes and required structural approvals are distinguished.
- [ ] Transfer/interest claims have separate evidence boundaries and falsifying observations.
- [ ] No learner data, unrelated writes, source activation or bypassed gate.
- [ ] Packet lint, local reference checks and diff check pass; no blanket app test run for prose.
- [ ] Required progress.md records evidence, decisions still proposed, inherited advisor declaration and limits.

## Stop Conditions and authority

Stop on blocked preflight, missing load-bearing evidence or conflict with a settled
contract. Implementer may not change packet completion status, edit orchestrator
records or declare the packet complete/ready to ship. Report against the design
objective, not document count. Apply inherited advisor and commit rules; stage
explicit paths, commit progress.md last, never push. Final owner task disposition
and any source mechanism approval remain separate from this investigation delivery.

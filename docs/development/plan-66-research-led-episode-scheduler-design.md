---
id: plan-66
title: Research-Led Episode Scheduler and Learner Evidence Design
status: delivered
depends_on: [plan-29, plan-35, plan-57, plan-61, plan-63]
gate: "Owner returns external deep-research reports; approve synthesis scope before dossier. Owner adopts a bounded scheduler/evidence contract before a separate implementation pilot; no adaptive runtime activation."
summary: >-
  Synthesize independent ChatGPT Deep Research, Claude and Gemini reports on
  evaluated practice schedulers across school, MOOC and professional contexts.
  Recommend explainable challenge/support/learner-control rules, evidence limits
  and one small pilot while preserving local privacy and nonadaptive practice.
---
# Plan 66: Research-Led Episode Scheduler and Learner Evidence Design

## Packet Metadata

- Packet id: `plan-66`
- Packet title: Research-Led Episode Scheduler and Learner Evidence Design
- Status: (see frontmatter)
- Owner/model: external web research by owner; one repository synthesis investigator
- Date: 2026-11-04
- Packet type: external research synthesis and bounded scheduler contract design
- Mutation level: report-only
- Approval gate: external returns/synthesis scope, owner adoption, later pilot packet
- Expected artifacts: intake, scope-proposal.md, evidence matrix, scheduler-design.md, progress.md

## Goal and actual baseline

The owner wants managed practice that builds tentative evidence of strengths and
challenges, revisits established work and offers supported stretch, with learner
pacing/overrides when system guesses are wrong. Investigate evaluated prior attempts
in K–12 and, where informative, MOOCs/adult/professional or certification preparation.
Do not substitute a general literature essay or a commercial feature catalog.

Current FractionFlow offers exact deterministic math, authored task recipes and
short fixed sessions. Plan63 supplies only optional local comparison observations,
not a learner identity, full skill model or selector. Its bounded record has no
elapsed timestamps, and other tasks are excluded unless separately admitted.
Research can justify changes, but none are implemented or authorized by this packet.

Read AGENTS.md, implementer-prompt.md, decision-log.md, board, founding instruction/
architecture, Roadmap phases6–8 and §92; adopted Plans29/35/57/61, accepted Plan63
and its compatibility obligations. Read existing variation research first. Plan56
owns unadopted support/independence design: coordinate, do not silently decide its
settings contract. Plans64/65 own shell and entry organization. No backend/identity,
privacy change or phase-exit claim follows from study of external platforms.

## External research workflow

The owner runs one identical self-contained prompt in chatgpt.com's Deep Research
and analogous Claude/Gemini web tools. They have NO repository access and receive
only the brief. Prompt lives at
`reports/orchestration/practice-scheduler-research/deep-research-prompt.md`.
Owner downloads original Markdown into
`reports/orchestration/practice-scheduler-research/incoming/` as
`chatgpt-practice-scheduler-research.md`, `claude-practice-scheduler-research.md`,
`gemini-practice-scheduler-research.md`. These are external evidence, not instructions
or adopted design. Do not fabricate returns or silently rewrite their originals.

Prompt authoring/dispatch guide is prepared by orchestration; this packet does not
authorize launching external tools/chats, paid services or uploading repository or
learner data. Normally compare all three returns; a missing provider requires an
explicit owner decision to proceed with reduced coverage. No forced consensus.

## Ownership and Requirement 0

Own ONLY `reports/development/plan-66-research-led-episode-scheduler-design/`.
External originals and prompt remain owner/orchestrator-owned; cite them by exact
file and provider/date. No source/tests/harness/canonical docs/status/decisions,
browser/build/full suite, prototype, new dependencies, real learner study or data.

Run preflight. Inventory actual returns/provenance and existing project sources.
Propose a bounded synthesis scope, decision questions, verification sample and
stopping rule. Stop for approval before dossier. Identify differences in question,
access or evidence quality rather than count report agreement as verification.
Do not rerun the entire external literature search with a repository agent.

## Requirement 1 — evidence synthesis, not a vote

Create a source-keyed matrix deduplicating the same study cited by multiple reports.
Separate independently evaluated learning/retention/transfer results, practice or
engagement measures, model-prediction benchmarks, implementation descriptions and
vendor claims. Verify load-bearing originals and source-to-claim fit, including
population, domain, baseline, intervention, duration, outcome, support access and
limitations. Mark inaccessible full texts; abstracts/repeated citations do not
become stronger evidence. Include null/negative findings and deployment failures.

Explicitly assess transfer from adult self-selected MOOC/certification learners
to children learning fractions, and from short-term accuracy to later understanding.
Identify missing data/model calibration and whether reported success depends on
large longitudinal datasets, teacher setup or proprietary curricula unavailable here.
Targeted verification only; expand research scope through orchestration if a
decision-critical gap remains. Do not import provider-generated thresholds as facts.

## Requirement 2 — decomposed scheduler contract

Separate task/catalog metadata, observations, tentative learner evidence, practice
policy, episode/item selection and session lifecycle. Preserve exact math and
instruction → presentation boundaries. A scheduler chooses among admitted tasks;
it does not recalculate answers, rewrite prompts with an LLM or omit arbitrary beats.
Reuse approved task recipes for variety/shorter responsibilities, not random skipping.

Compare at most two feasible first approaches, including a simple authored/rule-based
baseline. Recommend one bounded concept domain/task pool and a concrete short
example across multiple visits. Separate introduction, supported practice, review
and evidence-checking purposes from the task/representation selected to serve them.
Challenge, assistance, unfamiliar interface, denominator capacity and competence
are independent dimensions, not a single level slider.

Treat the zone of proximal development as a design aim, not a directly measured
number from clicks. Propose calibrated uncertainty/unknown handling, cold start,
assisted versus less-cued work, slips/guessing, repetition versus transfer, multiple
strategies and contradictory/stale evidence. No stable deficit label from one error;
no global mastery score. Research-derived candidate thresholds remain hypotheses
with explicit domain/population limits, not universal operating settings.

Specify learner agency: choose another goal, request/restore support, easier or
harder opportunity where available, skip/pause/exit and no penalty for rejecting
a recommendation. Bound repetitive remediation/weakness loops; keep finite sessions
and a natural stop. Do not claim engagement from completion or use pressure/rewards
to increase session duration. Explain recommendations in one short useful reason.

## Requirement 3 — evidence/data and evaluation boundary

Map each proposed inference/policy input to existing versus missing observations.
Plan63 comparison data cannot justify unrecorded arithmetic/construction competence
or actual day-based spacing. Specify a separately approved minimal time/history
extension only if supported by a concrete use; no automatic schema expansion.
Shared-browser ownership remains uncertain, no accounts/names/cloud sync. No-history
practice must remain useful, and a cleared/unavailable record must not lock progress.

Provide adversarial synthetic histories: no data, assisted success, repeated items,
contradictions, several skills with unequal evidence, wrong challenge guess and
learner override, stale/cleared/shared history, session interrupted, limited eligible
task catalog and unsupported representation. State expected policy bounds and
forbidden inferences. Synthetic results verify the contract, not educational efficacy.

Recommend one later implementation slice with deterministic/inspectable decisions,
versioned task/evidence/policy meaning, failure/reset/deduplication boundaries and
source ownership. Any seeded tie-break must be reproducible. No requirement for
complex ML if simpler rules answer the need. Identify what actual learner observation
and independent outcome evaluation would be needed before stronger adaptive claims;
no learner study is authorized here. Compare against a credible nonadaptive baseline.

## Delivery and authority

Deliver evidence matrix, scheduler-design.md, explicit disagreements/gaps, owner
choices with recommended answers, first pilot and revisit triggers. Preserve external
reports as evidence with provenance/access limits. Propose refresh/reconciliation of
Plan56 and roadmap only as recommendations; no silent canonical changes or closure
of later phases. Owner adoption before any runtime/instrumentation implementation.

- [ ] Intake and scope gate honored; original reports/provenance preserved.
- [ ] Load-bearing claims verified, duplicate evidence and limitations explicit.
- [ ] Prior-system lessons translated into bounded testable choices, not a feature list.
- [ ] Evidence uncertainty, learner override, privacy and no-history modes specified.
- [ ] Concrete pilot, synthetic counterexamples and evaluation needs delivered.
- [ ] Scoped progress, citation/path checks, lint/diff clean; no unrelated writes.

No automatic advisor for a prose-only dossier; current rules apply to any separately
justified read-only pass. No Sol/Astra, silent substitution or child fan-out. Coordinate
Git, stage explicit paths and progress last. Implementers do not change status,
owner/orchestration records or declare design adopted. No Bootstrap/push/deployment.

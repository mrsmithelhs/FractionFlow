---
id: plan-44
title: Fraction Magnitude Comparison Task and First-Slice Design
status: in-progress
depends_on: [plan-29, plan-37, plan-40, plan-42, plan-43]
gate: "Requirement 0: approve bounded investigation scope before the design dossier. Docs/report work only. Owner adoption of the recommended learner task, control grammar and first source slice precedes any implementation packet or activation. Plan 39 closure remains a prerequisite for subsequent number-line implementation."
summary: >-
  Convert the existing magnitude-comparison notes and skeptical reviews into
  one recommended concise learner task and a bounded first implementation
  contract, with compact exact-validated examples, accessible participation,
  representation timing, recovery, support and compatibility boundaries.
---
# Plan 44: Fraction Magnitude Comparison Task and First-Slice Design

## Packet Metadata

- Packet id: `plan-44`
- Packet title: Fraction Magnitude Comparison Task and First-Slice Design
- Status: (see frontmatter)
- Owner/model: one Codex investigator; owner/orchestrator adoption
- Date: 2026-10-31
- Packet type: investigation and instructional design
- Mutation level: docs/report artifacts only; read-only local exact-math checks
- Approval gate: bounded scope proposal, technical review, owner design adoption
- Expected artifacts: scope-proposal.md, comparison-design.md, progress.md

## Goal and why now

Recommend ONE short initial comparison task and a concrete first source slice
that adds a meaningful mathematical responsibility to FractionFlow. Explain how
it can later connect to benchmark number lines and comparison/difference
subtraction without putting all of those tasks into the first episode. Reuse
the existing Phase 4 notes and skeptical reviews; the owner should receive an
actionable recommendation, not another catalog of unresolved alternatives.

The notes distinguish interpreting honest models from making a symbolic judgment
before models verify it. Preserve that distinction. The task must support
fraction magnitude and connections between representations; avoid an episode
that merely teaches which way a comparison symbol points, duplicates a conversion
lesson, or becomes a sequence of routine acknowledgments.

## Dependencies and concurrency

Plans 29/37 provide the adopted recipe and representation-design precedents;
40 supplies accepted proper-fraction subtraction coverage; 42 provides bounded
response ownership; 43 supplies shared progression. These dependencies are complete.

Plan 39's accepted contracts and current source are reference material, but its
pending Repair 04 acceptance is not a blocker to this read-only design. Any
subsequent number-line implementation must wait for Plan 39 closure and a separate
packet. Do not describe pending rendered behavior as accepted.

Mode B concurrent work is permitted with Plan 23 and Plan 39 repairs. This writer
owns ONLY reports/development/plan-44-fraction-magnitude-comparison-design/.
Read shared source without changing it. Record inspected HEAD and relevant source
paths so conclusions can be refreshed if concurrent commits change a seam.
Do not edit packet status, board, decision log, founding documents, Phase 4 notes,
shared follow-up register, package.json, app/source, tests or tooling. Recommend
needed canonical updates in the dossier for orchestration to adopt later.

## Authority and required reading

- AGENTS.md and docs/agent-starting-prompts/implementer-prompt.md
- docs/decision-log.md, docs/development/README.md
- docs/development/phase-4-magnitude-comparison-notes.md
- reports/orchestration/magnitude-comparison-review-claude.md
- reports/orchestration/magnitude-comparison-review-codex.md
- Relevant magnitude/representation sections of founding 01, 03, 04, 05 and 06
- docs/development/phase-3-follow-up-obligations.md
- Plan 29's accepted task-recipe recommendation and Plan 37's adopted line task
- Plan 39 maintainability-checkpoint.md and latest technical review; Plan 43
  repair-02-orchestration-review.md and owner-acceptance.md

Use the routing documents to find exact report filenames. Inspect only the
load-bearing current math/content/instruction/scene/response/replay seams. The
older notes' API inventories and replay versions are leads, not current facts.

## Non-goals

No product implementation, prototypes, new framework, source refactor, content
registration, random/adaptive selection, third support level, persistence,
learner tracking or studies. No new operations or signed fractions. No automatic
adoption of a new compare arithmetic operation or replay version just because
the old notes proposed one. No multi-strategy chooser or full comparison bank.
No need to repeat the earlier broad research review or run app builds/full routes
for report-only changes. No Bootstrap writes, remote changes or deployment.

## Requirement 0 — bounded investigation proposal; stop

Run packet preflight and inspect git status. Write scope-proposal.md naming the
small source seams to trace, existing evidence to reuse, at most two serious
candidate first tasks and the distinctions the investigation can actually test.
Include a small hypothesis/falsifier table. Distinguish source/API feasibility,
mathematical eligibility and pedagogical hypotheses: a source trace cannot prove
learner understanding or engagement. Name a fixed stopping point for any targeted
research gaps. Send the proposal for orchestrator approval before expanding the
dossier. No source changes are permitted at any point in this packet.

## Requirement 1 — recommend one meaningful learner task

In comparison-design.md, give one recommended episode outline, concise learner
copy and two worked journeys (including recovery), plus a compact rationale for
rejecting or deferring the alternative. Explain what the learner contributes,
what is supplied, and what the task replaces or omits. Do not append every
candidate task to the existing full addition/subtraction episode.

Recommend a relation response grammar: first/second/same amount versus direct
less/equal/greater, with full spoken labels, deliberate Check and keyboard,
non-drag touch and linear participation. Show at least one equality case and
swapped order; do not silently omit equality. Avoid asking the same judgment
twice solely to translate it into notation. Recommend at least 44x44px targets
for the initial relation control unless a concrete reason supports another choice.
Owner adoption settles this learner-facing grammar before source work.

Specify when original amounts, common-unit forms, labels, models and relation
truth are visible. Correct answers and meaningful models are permitted learning
material; do not confuse an intended model-reading task with a symbolic task
whose answer was prematurely supplied. No reversed shading, unequal whole sizes
or misleading geometry to obscure a comparison. An unshaded unit template means
unknown/unconstructed amount, not zero; prefer concise explicit semantics or
omit it. Address equivalent information in accessible text and labels.

Define wrong response, retry and requested help without claiming a learner
misconception from one response or making cycling three choices the intended
method. Assistance must require useful thought where appropriate; no guaranteed
efficacy/anti-guessing claim. Show what remains inspectable after acceptance and
how existing Plan 43 Next/final return applies without an empty Finish screen.

## Requirement 2 — compact content and exact eligibility contract

Give a SMALL illustrative set (roughly 6–12 pairs, not a production bank) showing
less/equal/greater, swapped operands, unreduced equality and counterexamples to
larger-integers and raw numerator/denominator-gap heuristics. Select examples
within the recommended task's actual capability; reject or route other examples
explicitly. Do not force every strategy onto every pair or assume every available
fraction is suitable for the first task. Explain any property not covered by
the illustrative set.

Use existing deterministic math APIs to derive/verify truth and any conversion,
benchmark or heuristic property claimed. Record the command/API evidence and
failures; do not spend model reasoning or write hand-authored answer keys to
recheck elementary fraction equivalence. Disposable local read-only checks may
write scoped report evidence, but cannot change the math engine or harness.

Propose a compact record shape separating authored task/strategy intent from
computed correctness and task/representation eligibility. Distinguish source
fraction form from normalized identity. A new pair should ordinarily be data,
not new renderer branches. Use existing bar capacity limits where applicable;
a sparse number line does not automatically permit unlimited denominators.
Treat support level, mathematical complexity and representation as independent.

## Requirement 3 — first implementation boundary and future seams

Recommend one first source slice: its exact learner reach, task recipe, small
batch bounds, existing More/Less support consequences, response ownership,
help/recovery and discriminating acceptance cases. Resolve whether common-unit
construction or a structural/benchmark task should lead; justify why the first
slice proves new behavior without becoming a universal comparison engine.

Trace current pure math -> instructional state -> scene -> rendering boundaries.
Identify needed extensions versus existing reusable APIs. Do not place math truth
in renderers, duplicate operation-response selection in app code, or assume the
arithmetic operation enum must own a new instructional comparison task. Describe
identity/provenance and replay compatibility needs; version choice belongs to
the future implementation gate against its actual baseline.

Include a short branch-to-evidence proposal (math/content checks, mounted
behavior, actual rendered/accessibility checks and useful falsification seeds).
No claims based solely on DOM presence or a seed-specific throw. Separate
all-record deterministic validation from sampled rendered journeys; no need for
every pair to create another enormous hand-authored route. Identify exact-copy
and geometry risks that will require owner rendered review.

Retain explicit later seams for benchmark-to-line comparison, unsigned distance/
comparison subtraction and crossing-one/multi-whole work. No first slice may
silently activate them. State remaining owner decisions with a recommended
answer and the consequence of choosing otherwise. Do not leave all choices to
the owner or invent an adopted decision.

## Evidence discipline, review and delivery

Prefer the already recorded primary sources. Only investigate a targeted source
gap when it changes the recommendation; cite the source and distinguish evidence
from design inference. Record what would falsify a feasibility claim and perform
the discriminating checks available within this report-only scope. If alternatives
remain pedagogically plausible, report that uncertainty rather than declaring
one empirically superior without learners.

This is docs/report work: no automatic advisor call is warranted. Orchestration
may authorize one Terra-medium read-only review if substantial unresolved design
work justifies it; otherwise use orchestrator review. A parent must not duplicate
an implementer's Terra pass on the same delivery turn. Use a cold default role
honoring gpt-6.1-terra/medium, no Sol/Astra or child fan-out/model substitution.
Report consultation/not-warranted/degraded disposition under current AGENTS.md.

Verify cited local paths and exact illustrative math through existing APIs;
run packet lint and git diff --check. No full unit suite/build/routes for prose.
Commit scoped dossier/evidence by explicit paths, then progress.md separately
last. Report recommendation, actual checks, research limits and owner adoption
gate. Never set packet status, start an implementation packet, push or deploy.

## Stop conditions

Stop for missing evidence that changes the recommended task, a load-bearing
owner choice, conflicting concurrent ownership, or a need for product/source
changes. Report the narrow question and your recommended disposition. If the
configured reviewer is unavailable, report that limitation rather than substituting.

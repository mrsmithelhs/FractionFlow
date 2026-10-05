---
id: plan-21
title: Practice Variety and Next-Problem Design
status: draft
depends_on: [plan-10, plan-12, plan-13, plan-14, plan-16]
gate: "Early owner practice-type/entry-model disposition before new family entry surfaces; later owner disposition of content selection, learner/reviewer control and next-problem/reset semantics before implementation. This investigation can proceed before new families are delivered and does not activate content or close OQ-23."
superseded_by: null
resolution: null
summary: >-
  Prepare Roadmap section 30 and OQ-23: first propose what constitutes a learner
  practice type, then inventory demonstrated and candidate content and a bounded selection policy
  for trying another problem. Keep session composition and automatic generation
  activation behind a separate owner-approved implementation packet.
---
# Plan 21: Practice Variety and Next-Problem Design

## Packet Metadata

- Packet id: `plan-21`
- Packet title: Practice Variety and Next-Problem Design
- Status: (see frontmatter)
- Owner/model: investigator (single) / orchestration
- Date: 2026-10-04
- Packet type: investigation
- Mutation level: docs / generated local analysis artifacts
- Approval gate: owner content/selection/reset-policy disposition, implementation separately authorized
- Depends on: `plan-10`, `plan-12`, `plan-13`, `plan-14`, `plan-16`
- Expected artifacts: design dossier under `docs/development/phase-3-practice-variety-design/`; progress report

## Goal and why this packet exists

First make the practice-type/entry organization decision actionable, then recommend
a bounded way to try a genuinely different problem. Separate current demonstrated
families from proposed future content; the investigation need not wait for all new
source packets. Roadmap §30 requires meaningful denominator,
scale-factor, result and magnitude variety; one fixture per button is an engineering
milestone, not sufficient practice content. OQ-23 distinguishes a new instance
from retrying the current one or returning to entry. The generator exists, but
generator validity alone does not establish instructional or rendered suitability.

## Non-goals and dependencies

No app/source changes, activated generator draws, new families/beats, autonomous
adaptive selection, a session length/order policy, persistence, learner tracking,
accounts, recruitment, observation sessions or deployment. Only accepted artifacts
bound what this design may claim the app can run. Plans 17–20 are candidate future
coverage, not prerequisites and not demonstrated reach. This docs/analysis scope can
run alongside Plan 11 in disjoint files after owner initiation. Any future content
selection implementation still waits for accepted applicable families and owner policy.

## Authority and contracts

Read `AGENTS.md`, `docs/decision-log.md` (029–034), `docs/open-questions.md` (23),
`docs/development/README.md`, Roadmap §§29–31 and §§51–58, the Plan 10 reach
assessment, available accepted family reports (do not assume Plans 17–20 exist), content generation/validation/eligibility
contracts, practice registry and episode/replay/reset contracts. Preserve exact
math, immutable configuration, registered semantic identity, capability refusal,
fragment-only practice addressing and the public-repository PII boundary.

## Scope

Read source/tests/accepted browser evidence. Write `README.md`, `content-inventory.md`,
`selection-options.md`, `practice-type-model.md`, and `next-problem-contract-proposal.md` in the new dossier;
optional aggregate synthetic analysis JSON under this packet's report folder.
Do not edit source, canonical decisions/open questions, prototype registers, route
matrix, disposition records or other packet statuses. Existing command invocations
and ephemeral analysis are permitted; persistent tooling requires scope approval.

## Implementation Requirements

### Requirement 0 — Early practice-model decision brief

Run preflight. Use Principle §8, the owner's previously named practice goals and
the existing registry to compare learner-meaningful practice goals with internal
mathematical families. Explain whether nested/shared-factor/like-denominator cases
belong inside a goal with varied instances, on distinct entry buttons, or on reviewer-
only addressable routes. Do not conflate a stable content/definition identity with
a required learner button. Show the resulting entry labels and number of controls
without building UI. Recommend the smallest calm model and give the owner a concrete
decision brief early; do not wait for the entire content sweep. Record the owner's
decision through orchestration before family packets add entry surfaces. No model
is adopted by this packet. Existing coarse sum-above-one intent remains an input;
mixed-number availability is not activated. Continue later analysis only within
the resulting scope and keep undecided next-problem choices labeled proposed.

### Requirement 1 — Inspect real coverage

Run preflight and inventory candidate authored fixtures and bounded deterministic
generation across current accepted and prospective addition families. Mark separately: math-valid,
content-valid, representation-eligible, fully authored instructional data, replay-
reconstructable, and actually witnessed through the learner app. Synthetic checks
cannot promote a candidate to browser-demonstrated reach. Include scale factors,
canonical/alternate units, denominator relationships, proper/crossing results,
reducibility and densities. Unsupported simplification tasks and unvetted premise/
reflection data remain explicit exclusions even if exact arithmetic succeeds.
Use aggregate synthetic outcomes only, never learner data. If sampling, state the
seed set, bounds, sample size and uncovered dimensions; report extrema/distributions
and refusal reasons rather than only an average or a successful count.

### Requirement 2 — Compare owner choices without selecting one

Compare a reviewed authored set, a fixed deterministic sequence and a bounded
generator draw. State learner-selected versus reviewer-selected next-instance
control as a separate dimension. Name rival claims and their falsifying observation;
use discriminating cases (e.g. repeated numeric draws, eligible math with missing
authored reflection, alternate units that exceed visible capacity) rather than
only convenient passing samples. Compare authoring burden, reproducibility,
meaningful variety, repetitions, bounded refusals and explanatory product language.
No recommendation may rely on unobserved child efficacy or invented observations.
Recommend one small *proposed* increment and record what remains undecided.

### Requirement 3 — Explicit next-instance contract

Propose seed/content identity, configuration carry-over, visible label, focus target,
fresh state and replay semantics. Distinguish retry (same content, fresh episode),
next (different vetted content, fresh episode), and return/re-entry. Address refusal
or exhaustion without a loop that hangs or silently falls back to unsuitable
content. Do not specify Phase 7 session dose, progress rewards or automatic advance.
Propose future browser witnesses for retained retry identity, changed next identity,
no leaked accumulated work, wrong/recovery paths, content refusal and access parity.
End with a concrete owner decision brief and a bounded follow-on implementation
scope; do not enact it or close OQ-23 yourself.

## Work plan and validation checklist

Preflight → source/evidence inventory → bounded reproducible synthetic analysis →
options and contract proposal → cross-check claims/links → packet lint and diff
check → scoped dossier commit → progress report committed last. No blanket app
test run is needed for prose; report any existing commands used for evidence.

- [ ] All dossier outputs and report exist, references and identities verified.
- [ ] Mathematical eligibility, authored readiness and browser reach are distinct.
- [ ] Rivals have falsifiers; analysis includes discriminating cases and uncovered dimensions.
- [ ] Proposed decisions remain labeled proposed; no app activation or invented evidence.
- [ ] No unrelated files changed and owner gate honored.
- [ ] `reports/development/plan-21-practice-variety-and-next-problem-design/progress.md` exists.

## Stop Conditions and authority

Stop if dependencies are blocked, analysis requires source changes, or findings
contradict settled schedule/identity/capability policy. Report that conflict rather
than quietly resolve it. Do not set status, edit orchestrator records or declare
completion/readiness to ship. Apply inherited advisor declaration rules and report
actual evidence/limits. Commit explicit paths and report last; never push/deploy.

## Progress Report

Record versions and source inventory, commands/seeds, analysis artifacts and findings,
falsification limits, proposed owner choices, future implementation boundaries,
advisor declaration and remaining gates. No participant or learner artifacts.

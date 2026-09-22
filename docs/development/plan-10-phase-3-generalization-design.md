---
id: plan-10
title: Phase 3 Generalization — Design and Reach Assessment
status: in-progress
depends_on: [plan-09]
gate: "Owner reviews and accepts the design dossier. No Phase 3 *problem-family* implementation packet may be assigned until it is accepted; this gate does not block plan-11, plan-12, plan-13, or plan-14, and does not block drafting. Design artifacts are proposals, not settled decisions; any new decision is reported for owner disposition rather than taken."
summary: >-
  Prepare — but do not begin — Roadmap Phase 3. Assess how far the established
  fraction-bar interaction grammar actually stretches across the eight problem
  families of §27 and the six focused concept episodes of §28, family by family,
  naming which reuse existing motifs unchanged, which need a new beat, and which
  need a representation the bar cannot give. Resolve OQ-20 (a result crossing one
  whole) and decide whether mixed numbers enter Phase 3 or later. Output is a
  design dossier under docs/, not application code.
---

# Plan 10: Phase 3 Generalization — Design and Reach Assessment

## Packet Metadata

- Packet id: `plan-10`
- Packet title: Phase 3 Generalization — Design and Reach Assessment
- Status: (see frontmatter)
- Owner/model: investigator (single) / orchestration
- Date: 2026-09-21
- Packet type: investigation / docs
- Mutation level: docs-only (dossier at exactly `docs/development/phase-3-generalization-design/`; no application source)
- Approval gate: owner reviews and accepts the dossier; orchestrator confirms it honors every deferred boundary before any Phase 3 problem-family implementation packet is assigned
- Depends on: `plan-09` (there must be a working episode to generalize *from*)
- Expected artifacts: dossier at exactly `docs/development/phase-3-generalization-design/` with the file set listed in Scope; progress report

## Goal

Answer, with evidence from the running slice rather than from the specification, how far the existing
interaction grammar reaches. Roadmap §26 states the goal plainly: *"The goal is not to invent new
interfaces. The goal is to discover how far the existing interaction language can stretch."* Nobody has
asked that question of the code. This packet asks it, family by family, and produces the design
foundation the Phase 3 implementation packets will be written against.

## Non-goals

- **No application code.** Writing `src/` is out of scope and belongs to later packets.
- **No new problem families implemented**, no content authored, no generator changes.
- **No new decisions taken.** If the assessment exposes one, report it for owner disposition.
- **No Phase 4 scope** — number lines, area models, multiplication, division, teacher features.
- **No adaptive rules.** Which support level a given learner receives stays out of scope; `plan-13`
  carries the mechanism, not the policy.

## Depends on

`plan-09` complete and owner-dispositioned. This packet reasons about what the grammar covers, and
that requires a grammar that demonstrably works: one complete episode, four display conditions, the
participation floor, and the replay and recovery behavior as shipped at `b418e8a`.

## Why this packet exists

Phase 2 was implemented against an approved dossier (`plan-04`), and the seven repairs it still needed
were almost entirely about mechanisms that existed but were not reachable. Phase 3 is a larger
expansion — eight problem families and six focused episodes — and going straight to implementation
would multiply that failure mode across all of them.

There is also a concrete blocker. §27 lists **results crossing one whole** as a Phase 3 family, and
`src/render/fraction-bar.js` currently refuses to draw one. That is **OQ-20**, and it cannot be
resolved by an implementer mid-build: it is a representation question about what "one stable whole"
means when the quantity exceeds it (`06-roadmap.md` §17).

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-006, 011, 012, 013, 019, 021, 025, 026 especially
- `docs/founding/06-roadmap.md` §§17–19, 26–28
- `docs/founding/02-interaction-grammar.md` in full
- `docs/development/phase-2-first-slice-design/` — all four dossier files, especially
  `prototype-variable-register.md`
- `docs/open-questions.md` — OQ-17, OQ-19, OQ-20, OQ-21, OQ-22
- `reports/orchestration/phase-2-unreachable-mechanisms.md`
- `reports/development/plan-09-app-shell-condition-switcher-and-acceptance/acceptance-evidence.md`

Contracts this packet must preserve:

- **The Separation Rule.** Any proposed mechanism must fit `mathematical state → instructional state →
  presentation`, unidirectional. A proposal that needs presentation to inform mathematics is a finding,
  not a design.
- **No history in the scene.** `SCENE_HISTORY_KEYS` and `assertNoSceneHistory` hold for every proposal.
- **Static-only.** No backend, no accounts, no server state (DECISION-001).
- **Conditions are selected upstream** (DECISION-006), never as renderer flags.
- **Target size does not shrink with denominator** (DECISION-025).

## Scope

### In scope

The dossier at `docs/development/phase-3-generalization-design/`, containing exactly:

- `README.md` — what the dossier is, what it settles, what it explicitly leaves open.
- `grammar-reach-assessment.md` — the core artifact. One row per §27 family and per §28 focused
  episode, each classified as **reuses existing motifs**, **needs a new beat**, or **needs a
  representation the bar cannot give**, with the specific motif or gap named and the evidence cited
  from the running code.
- `crossing-one-whole.md` — the OQ-20 resolution proposal. What the bar shows when a sum exceeds one:
  a second whole, an extended track, a mixed-number readout, or something else. Must address §17's
  "one stable whole" directly and say what it costs at 360px.
- `mixed-numbers-position.md` — §24 lists mixed numbers as a Phase 2 non-goal. State whether they
  enter Phase 3, what they require of the bar and the symbolic row, and what the current renderer
  would need. A recommendation with reasoning, not a decision.
- `sequencing-proposal.md` — a recommended packet order for Phase 3 implementation with the dependency
  reasoning, sized against the observation that Phase 2 took five implementation packets and seven
  repairs.

### Out of scope

- Everything in Non-goals.
- Changes to any file outside `docs/development/phase-3-generalization-design/` except the progress
  report. In particular: no edits to `docs/open-questions.md` or `docs/decision-log.md` — proposals go
  in the dossier and the orchestrator records dispositions.

## Implementation Requirements

### Requirement 1 — Reach assessment grounded in the code

Required behavior:

- Every §27 family and §28 episode appears, with no silent omissions.
- Each classification cites the specific mechanism it reuses or lacks, by file and symbol —
  `beat-container.js` beat cases, `classification.js` recovery kinds, `content/` family contracts,
  `fraction-bar.js` rendering paths.
- **Demonstrated reuse and plausible reuse are different classifications and must be labelled
  differently.** A family may be called *demonstrated reuse* only when the dossier records an
  executable current path — the configuration, the starting surface, and the action sequence that
  reaches the motif today, in the shape `plan-14`'s route matrix uses. Everything else is *plausible
  reuse*, and must say what is missing before it could be witnessed.
- **Every "needs a representation the bar cannot give" classification carries a refusal witness**: the
  concrete current behavior — an error, a guard, a blank, a wrong drawing — captured from the running
  code, not an assertion that it would fail.
- The Phase 2 lesson is that a mechanism's existence is not evidence that anything reaches it, and a
  dossier can repeat that failure in prose as easily as code can repeat it in a registry.

Constraints:

- Assessment is by reading and running the code, not by reasoning from the specification about what
  the code presumably does.

### Requirement 2 — Resolve OQ-20 as a proposal

Required behavior:

- At least two candidate representations for a result crossing one whole, each with what it preserves
  and what it costs.
- A stated recommendation with reasoning.
- 360px layout consequences named for the recommended option.
- A statement of whether the recommendation forecloses mixed numbers or accommodates them.

### Requirement 3 — Honest reach limits

Required behavior:

- Name at least the families the current grammar does **not** cover, without softening. §27 includes
  subtraction and simplification; the episode arc `encounter → notice → decide → transform → operate →
  resolve` was built for addition with both operands renamed.
- Where the answer is "we do not know without building it," say that rather than guessing.

### Requirement 4 — Carry the Phase 2 debts forward explicitly

Required behavior:

- State how each of these interacts with Phase 3 scope, or that it does not: OQ-19 (entry page),
  OQ-21 (like-denominator recovery copy), OQ-22 (lower-support premise check), the unwritten support
  ladder, and animated subdivision.
- These are owned by `plan-11`, `plan-12`, and `plan-13`. The dossier says what Phase 3 needs from
  them, not how to build them.

## Validation Checklist

- [ ] Dossier exists at exactly `docs/development/phase-3-generalization-design/` with the five named
      files and no others.
- [ ] Every §27 family and §28 focused episode classified, with code-level citation.
- [ ] Each classification labelled **demonstrated reuse**, **plausible reuse**, **needs a new beat**, or
      **needs a representation the bar cannot give**; no unlabelled rows.
- [ ] Every demonstrated-reuse row carries an executable current path; every cannot-give row carries a
      captured refusal witness.
- [ ] OQ-20 proposal includes at least two candidates, a recommendation, and 360px consequences.
- [ ] Mixed-number position stated with reasoning.
- [ ] Sequencing proposal includes dependency reasoning.
- [ ] No application source changed; no decision-log or open-questions edits.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at
      `reports/development/plan-10-phase-3-generalization-design/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- A family cannot be assessed without building it, and saying so would understate the uncertainty.
- The assessment requires a new owner decision to finish.
- Resolving OQ-20 appears to require abandoning "one stable whole" as §17 states it.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- The investigator produces proposals. **It may not declare the dossier accepted**, and may not treat
  a recommendation as a decision. "Ready for orchestrator review: yes/no" is the bounded handoff.

## Advisor Consultation

Inherited from `AGENTS.md`. Docs-only but architecturally consequential — record a full disposition or
a named degraded mode.

## Commit and Concurrency Guidance

Stage by explicit path; never `git add -A`. **Never push without explicit owner authorization.**
Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-10-phase-3-generalization-design/progress.md`

Minimum contents: summary; the reach assessment's headline counts by classification; the OQ-20
recommendation; the mixed-number position; what could not be assessed without building it; commands;
problems; remaining risks; advisor disposition; ready for orchestrator review yes/no.

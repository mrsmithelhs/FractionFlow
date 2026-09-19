---
id: plan-07
title: Renderers, Strings, and the Participation Floor
status: draft
depends_on: [plan-06]
gate: "Two gates. (1) Mechanism confirmation: the implementer proposes the renderer boundary, the completed-beat collapse rule, and the strings table shape, and stops for approval. (2) Internal milestone gate: the fraction-bar and symbolic renderers plus strings are reported and reviewed before the accessible linear path and the leakage invariants are built."
superseded_by: null
resolution: null
summary: >-
  Build the presentation layer in src/render/: fraction-bar, symbolic, and
  accessible linear renderers, the centralized learner-facing strings table,
  beat-gated DOM mounting, tap-primary interaction with non-interactive bar
  segments, and the fail-first scaffold-leakage invariants. This is the packet
  where the participation floor, the reading-level target, and the aesthetic
  rubric all become real, and the highest-risk packet in the wave.
---

# Plan 07: Renderers, Strings, and the Participation Floor

## Packet Metadata

- Packet id: `plan-07`
- Packet title: Renderers, Strings, and the Participation Floor
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-19
- Packet type: feature
- Mutation level: source, user-facing
- Approval gate: mechanism confirmation, then an internal milestone gate mid-packet, then orchestrator review
- Depends on: `plan-06` (scene projection and eligibility verdict)
- Expected artifacts: `src/render/` modules including `strings.js`, styles, leakage-invariant tests, accessibility tests, progress report

## Goal

Make the validated scene visible, legible, and operable — to a child, on the supported environments,
through every access path — without the presentation layer ever computing mathematics or deciding the
next instructional beat.

This is the packet where the abstractions stop being free. The participation floor
(`05-quality-and-validation.md` §44), the reading-level target (DECISION-004), the aesthetic rubric
(DECISION-021), and the scaffold-leakage invariants (`D-16`, DECISION-014) all become executable here.

## Non-goals

- **No mathematical or instructional logic.** No denominator, result, equivalence, or correctness
  outcome is computed in `src/render/`. No renderer decides the next beat.
- No app shell, entry page, routing, or condition switcher — that is `plan-08`.
- No deployment, no public verification — `plan-08`.
- No learner preference surface, no browser storage (DECISION-019).
- No number line (excluded from this slice), no new families, no session or progress features.
- No accessibility *conformance claim*. Per reconciliation finding R4, the project builds **against**
  WCAG 2.2 AA (DECISION-010); it does not claim conformance until the §44 evidence exists. Report and
  copy must say "built against," never "conforms to."

## Depends on

`plan-06` delivered and reviewed. Renderers consume a validated scene and an eligibility verdict; built
earlier they would be built against a stub, which is this project's named implementer failure mode.

## Why this packet exists

Everything upstream is provable by test in isolation. Presentation is where a correct system can still
fail a child: a target too small for their hand, a sentence above their reading level, an answer leaked
into an accessible label, a scene so busy the question disappears. The founding documents treat all four
as quality defects rather than polish, and `06-roadmap.md` §23 asks for disproportionate attention here
because this slice becomes the reference for every later phase.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-003, 004, 007, 010, 011, 012, 013, 014, 017, 021, 022,
  023, 025, 026 especially
- `docs/presentation-posture.md` — both parts, in full
- `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md` — scaffold-leakage
  invariants 1–9 and the participation-floor table
- `docs/development/phase-2-first-slice-design/episode-definition.md` §6
- `docs/founding/02-interaction-grammar.md` §§12, 71–72; `docs/founding/05-quality-and-validation.md`
  §§20, 32, 33, 44, 90
- `reports/orchestration/phase-2-specification-reconciliation.md` — findings R2, R4, R6
- `docs/open-questions.md` — OQ-18

Contracts this packet must preserve:

- **Bar segments are not interactive** (DECISION-025). The bar is a display surface. Control size is
  decoupled from denominator, so a 30-part bar at 360px never produces a sub-24px target.
- **Tap and keyboard are primary; drag is never required** (DECISION-013, WCAG 2.2 SC 2.5.7).
- **Beat-gated mounting** (DECISION-014): unreached beats and future values are not in the DOM at all.
  `aria-hidden` or `display:none` pre-mounting of a future answer is forbidden.
- **Register separation** (`docs/presentation-posture.md` Part 2): no specification or research
  vocabulary in any learner-visible string, including accessible names and status text.
- **CM-01 is a matching task with distractors** (DECISION-012) **whose expected answer is not always the
  reassuring one** (DECISION-026).

## Scope

### In scope

- `src/render/` — fraction-bar renderer, symbolic renderer, accessible linear path, shared scene
  consumption, and `strings.js` per DECISION-017 as relocated by DECISION-023.
- `src/styles/` — the styling needed for the above.
- Tests: scaffold-leakage invariants, accessibility structure, reading-level working rules where
  mechanically checkable, and renderer-purity tests.

### Out of scope

- Everything in Non-goals, plus `src/app/`, the build, the deployment workflow, packet files and
  statuses, and any change to `src/math/`, `src/content/`, or `src/interaction/` beyond consuming them.

## Implementation Requirements

### Requirement 1 — Renderer purity

Required behavior:

- Each renderer takes a scene and produces presentation. Given the same scene, each produces
  equivalent meaning; given a scene it cannot render, it refuses rather than approximating.
- A test demonstrates that no renderer computes a denominator, an equivalence, a sum, or a correctness
  outcome — by construction, not by inspection.

### Requirement 2 — The three paths

Required behavior:

- **Fraction bar:** one stable whole per operand, visible unit counts, subdivision that communicates
  renaming, and an inspectable post-state. Segments are display only (DECISION-025).
- **Symbolic:** the same current forms and operation state, updating from learner-established
  transformations, never parsing or computing from rendered text.
- **Accessible linear path:** the same quantities, relationships, decisions, and status changes in
  programmatically inspectable reading order, preserving the same mathematical responsibility and
  never revealing a response the visual path asks the learner to reason out.

Constraints:

- The linear path is text all the way down and is therefore the surface most exposed to reading burden.
  It is held to DECISION-004 at least as strictly as the visual path.

### Requirement 3 — Strings

Required behavior:

- All learner-facing copy lives in `src/render/strings.js` — prompts, guidance, status announcements,
  accessible descriptions, error recovery, help layers. No inline literals in components.
- Every string is authored against DECISION-004's working rules and the Part 2 register rules.
- The progress report includes the full string inventory as a reviewable list, because DECISION-017
  makes string review a blocking gate and a reviewer cannot gate what is scattered through components.

Constraints:

- Prompt text is authored here, never lifted from the episode definition or any specification
  document. The Reflect beat is the known trap: "state the invariant" is specification language.

### Requirement 4 — Scaffold-leakage invariants

Required behavior:

- Implement fail-first tests for invariants 1–9 of the evidence plan, inspecting both the visual and
  the semantic/linear path before each required response.
- Beat-gating (DECISION-014) is the structural mechanism; the invariants are the proof it holds.

Constraints:

- A constrained choice list may contain a valid target among candidates; it must not reveal which is
  correct.

### Requirement 5 — Completed-beat collapse

Required behavior:

- Ship one working collapse rule: completed beats remain reachable and inspectable (DECISION-014) while
  the scene stays calm enough to pass DECISION-021 criterion 1 at 360px through 1440px.
- Inspectable does not require full-size and fully expanded. A compact line, a reviewable trail, or a
  quieter register are all acceptable.

Constraints:

- Per OQ-18 this packet must ship *a* rule, not the best one. Richer options are a later design pass
  with real screens. Do not gold-plate; do not skip.

### Requirement 6 — Participation floor and rubric

Required behavior:

- Map each §44 floor item to its implemented mechanism and evidence it: non-drag and keyboard operation
  of every required decision, reduced-motion parity reaching the same post-state, semantic and linear
  meaning, focus and reading order and labels and status and contrast and text scaling across the
  DECISION-009 matrix, and equal responsibility across access modes.
- Self-assess against DECISION-021's four rubric criteria and report the result honestly, including any
  criterion the implementer believes fails.

Constraints:

- Mechanized checks are necessary and not sufficient (§44, §949). Report what a scanner cannot see.
- Untested environments are named as untested. The DECISION-009 matrix is a support *target*; this
  packet reports which parts were actually exercised.

## Validation Checklist

- [ ] Mechanism confirmation reported and approved before implementation.
- [ ] Internal milestone gate honored: bar, symbolic, and strings reported and reviewed before the
      linear path and invariants were built.
- [ ] No renderer computes mathematics; proven by test.
- [ ] Bar segments are not focusable, tappable, or clickable.
- [ ] Every required decision completable by keyboard alone and by non-drag touch.
- [ ] No interactive control below 24×24 CSS px at any supported viewport or any permitted LCD.
- [ ] Leakage invariants 1–9 implemented and failing-first demonstrated.
- [ ] No future value present in the DOM or accessibility tree before its beat.
- [ ] Full string inventory in the report; every string traceable to `strings.js`.
- [ ] Reduced-motion path reaches the same post-state as the standard path.
- [ ] Collapse rule shipped; scene self-assessed against all four rubric criteria.
- [ ] Report says "built against WCAG 2.2 AA," never "conforms to."
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at
      `reports/development/plan-07-renderers-strings-and-participation-floor/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- A required decision cannot be made non-drag and keyboard-operable.
- A rubric criterion cannot be satisfied without violating another decision. Report the conflict; do
  not resolve it by weakening a floor item.
- The collapse rule cannot keep completed beats reachable and the scene calm at 360px. That is an
  OQ-18 escalation, not an implementer judgment call.
- Authoring a string at grade 2–3 appears to require changing what the learner is asked to do.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- The implementer may not declare the packet, feature, or product complete, ready to ship, accessible,
  or validated. §44 reserves "Accessibility validated" for a recorded floor with mechanized *and*
  human review.
- Evidence maps to requirements.

## Advisor Consultation

Inherited from `AGENTS.md`. The largest behavioral surface in the wave; a "not warranted" declaration
would be non-compliant. Record a full disposition or a named degraded mode.

## Commit and Concurrency Guidance

- Stage by explicit path; never `git add -A`; never push. Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-07-renderers-strings-and-participation-floor/progress.md`

Minimum contents: summary; mechanism proposal and approval; milestone-gate report; module map; full
string inventory; leakage-invariant results; participation-floor mapping with evidence kind per item;
environments actually exercised versus targeted; rubric self-assessment including failures; collapse
rule and why it satisfies both constraints; commands; problems; remaining risks; advisor disposition;
ready for orchestrator review yes/no.

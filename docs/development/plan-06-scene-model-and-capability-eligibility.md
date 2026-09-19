---
id: plan-06
title: Scene Model Projection and Capability Eligibility
status: draft
depends_on: [plan-05]
gate: "Mechanism confirmation before implementation: the implementer proposes the scene projection shape, the staleness/derivation rule, and the eligibility verdict's inputs and outputs, and stops for orchestrator approval. Still no DOM and no renderer."
superseded_by: null
resolution: null
summary: >-
  Implement the D-20 Scene Model as a pure semantic projection of validated
  mathematical state, instructional state, and active representation, and
  implement the representation-eligibility verdict that Plan 03 left deferred,
  with the DECISION-011 ceilings. Proves that identical inputs yield identical
  scene meaning, that nothing downstream computes mathematics, and that
  unsupported instances fail closed before any renderer sees them.
---

# Plan 06: Scene Model Projection and Capability Eligibility

## Packet Metadata

- Packet id: `plan-06`
- Packet title: Scene Model Projection and Capability Eligibility
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-19
- Packet type: feature
- Mutation level: source (scene projection module; eligibility in `src/content/`; tests)
- Approval gate: mechanism confirmation before implementation, then orchestrator review
- Depends on: `plan-05` (instructional state must exist to project from)
- Expected artifacts: scene projection module, eligibility verdict, tests, progress report

## Goal

Turn the `plan-04` scene-model position from a written architectural stance into working code, and
close the one gap `plan-03` left open: every `representationFacts.eligibility` verdict it produces is
the literal string `'deferred'`, so no capability check exists to run. This packet supplies the
projection and the verdict, and proves both behave as the architecture claims.

## Non-goals

- **No DOM, no renderer, no markup, no CSS.** `src/render/` stays empty until `plan-07`.
- **No learner-facing strings.** The scene carries meaning; words are `plan-07`.
- No changes to the instructional engine's decisions. If a projection needs a fact the engine does not
  expose, the fix is an engine change proposed and reviewed, not a scene-side inference.
- No layout, coordinates, colors, typography, timing, or animation frames. The scene-model position
  is explicit that these are renderer concerns and must not become scene authority.
- No new problem families, selectors, overlays, or profile changes.

## Depends on

`plan-05` must be delivered and reviewed. A projection of instructional state cannot be validated
before instructional state exists, and building them together would blur exactly the boundary this
packet is meant to prove.

## Why this packet exists

`D-20` asked whether the Scene Model is a pure projection or a second state store. `plan-04` answered
in prose and enumerated the alternatives it rejected. That answer is untested. This packet is where the
claim becomes falsifiable: if two renderers can be given the same inputs and disagree, or if a scene
can drift from its sources, the architecture is wrong and it is far cheaper to learn that now than
after two renderers exist.

The eligibility verdict is here rather than in `plan-05` because it is a *representation* question —
can this instance be shown as a fraction bar at all — and because the DECISION-011 ceilings bound the
scene, not the instruction.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-006, 011, 014, 019, 025 especially
- `docs/development/phase-2-first-slice-design/scene-model-position.md` (all sections, including the
  rejected alternatives table and the six implementation obligations at its end)
- `docs/development/phase-2-first-slice-design/episode-definition.md` §§2, 6, 7
- `docs/founding/04-system-architecture.md` §§12–22, 36–48, and §921 on the three separate boundaries
- `reports/orchestration/phase-2-specification-reconciliation.md`
- `src/content/generator.js` — the existing `representationFacts` shape this packet fills in

Contracts this packet must preserve:

- **The scene is derived, never authoritative.** A materialized snapshot may exist for a render pass,
  transition comparison, replay log, or cache, but it is disposable and must carry enough source
  context to detect staleness. It is never edited in place of source state.
- **Meaning, not pixels.** The scene states relationships — this quantity is two thirds of the stable
  whole; these forms are validated equivalents in a twelfth unit. It never makes `x`, `width`, `color`,
  or `animationFrame` the carrier of meaning.
- **A transition has known endpoints.** The post-state is established upstream before any transition
  is described. Animation never computes or authorizes it.
- **Fail closed.** An instance or path outside capability becomes
  `valid-but-outside-representation-capability` with a reviewed continuation — never a silent coercion
  and never a mathematical error.

## Scope

### In scope

- The scene projection module (location proposed at mechanism confirmation; it is instructional-side
  output, not a renderer, so it does not belong in `src/render/`).
- The representation-eligibility verdict in `src/content/`, replacing the `'deferred'` placeholders,
  applying the DECISION-011 ceilings of LCD ≤ 30 and single-operand scale factor ≤ 12.
- Tests for both.

### Out of scope

- Everything in Non-goals, plus packet files, statuses, the build, and the deployment workflow.

## Implementation Requirements

### Requirement 1 — The projection

Required behavior:

- The scene is computed from validated content/mathematical state, current instructional state, the
  active representation role, and the presentation mode (standard motion, reduced motion, or instant
  test transition).
- Recomputing from the same inputs yields the same scene. This is testable and must be tested.
- The scene exposes enough for a semantic, linear alternative to be produced from it — quantity, unit,
  count, whole, current task, available action, status, and the pre/post relationship — without the
  alternative being an answer reveal.

Constraints:

- The scene carries no learner history. Episode history and established accomplishments live in
  instructional state (scene-model position, rejected alternative "Scene Model as a learner-history
  database").

### Requirement 2 — Eligibility verdict

Required behavior:

- A deterministic check in `src/content/` replaces the `'deferred'` eligibility values with a real
  verdict, applying LCD ≤ 30 and single-operand scale factor ≤ 12 per DECISION-011.
- The verdict is computed for the canonical path *and* for any alternate or learner-proposed common
  denominator, since a path can be ineligible while its instance is eligible.
- An ineligible instance or path yields `valid-but-outside-representation-capability` and a reviewed
  continuation, distinct from `valid-but-outside-authored-coverage`.

Constraints:

- The ceilings bound *rendering*, never *validity*. A denominator above the ceiling remains
  mathematically valid and must still classify as `valid-least` or `valid-non-least`.
- Known and expected: under these ceilings only some eligible denominator pairs retain an eligible
  non-LCD alternate path — four of six under `phase1-dev-default` and four of eleven under
  `curated-review` at the time of the reconciliation sweep. This is accepted, not a defect. Re-run the
  sweep and report the current figures rather than assuming these.

### Requirement 3 — The six obligations

Required behavior:

The scene-model position closes with six checks it says a Phase 2 implementation should be able to
demonstrate. Implement tests for all six: identical inputs produce identical scene meaning across
consumers; nothing downstream computes a denominator, result, or correctness outcome; a reduced-motion
or instant transition reaches the same post-state as the standard transition; stale or unsupported
capability inputs fail closed before rendering; the scene exposes what the linear alternative needs;
and replay reconstructs source, definition, support state, and action sequence without treating
presentation as the source.

Constraints:

- Test three of these against a stub consumer, not a real renderer — no renderer exists yet, and
  building one here would defeat the packet's separation.

### Requirement 4 — Condition expressiveness

Required behavior:

- The scene can represent each registered design condition (D-01, D-02, D-05, CM-01 arms) without any
  one being the structural default, per the scene-model position and DECISION-006.
- The active condition is an input to the projection, supplied upstream, never a renderer flag.

Constraints:

- DECISION-005 and DECISION-007 make Bundle 1 provisional, and DECISION-012 and DECISION-026 govern
  its CM-01 arm. Expressiveness must not quietly narrow to Bundle 1.

## Validation Checklist

- [ ] Mechanism confirmation reported and approved before implementation.
- [ ] No DOM, renderer, or browser API anywhere in this packet's source.
- [ ] Same inputs → same scene, proven by test.
- [ ] No `'deferred'` eligibility values remain for the Phase 2 family; verdicts are real.
- [ ] A denominator above the ceiling is still mathematically valid and is refused only for rendering.
- [ ] All six scene-model obligations have tests.
- [ ] Each registered condition can be represented; none is structural.
- [ ] Current eligibility sweep figures reported for both profiles.
- [ ] `npm test`, `node scripts/dev/plan-status.js lint` pass; working tree clean.
- [ ] Progress report exists at
      `reports/development/plan-06-scene-model-and-capability-eligibility/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- The projection cannot be computed without storing something that looks like source state. That is
  the `D-20` failure mode and it needs orchestrator review, not a workaround.
- The eligibility ceilings exclude the canonical fixture or its supported alternate path. They should
  not — report immediately if they do.
- A scene field can only be expressed as a coordinate, dimension, or frame.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- The implementer may not declare the packet, feature, or product complete.
- Evidence maps to requirements; counts and green tests are evidence, not proof.

## Advisor Consultation

Inherited from `AGENTS.md`. Real behavioral surface: a "not warranted" declaration would be
non-compliant. Record a full disposition or a named degraded mode.

## Commit and Concurrency Guidance

- Stage by explicit path; never `git add -A`; never push. Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-06-scene-model-and-capability-eligibility/progress.md`

Minimum contents: summary; mechanism proposal and approval reference; projection shape and where a
snapshot may exist and why it cannot drift; eligibility verdict and current sweep figures;
requirement-by-requirement evidence; commands; validation; problems; remaining risks; advisor
disposition; ready for orchestrator review yes/no.

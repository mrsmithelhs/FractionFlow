---
id: plan-07
title: Renderer Foundation and Learner-Facing Strings
status: draft
depends_on: [plan-06]
gate: "Mechanism confirmation, and it must cover all three access paths. Before any renderer is built, the implementer proposes the shared scene-consumption boundary, the beat-mounting contract, and the semantic contract — specified so that the visual, symbolic, and accessible linear paths all satisfy it — plus the strings table shape, and stops for approval. A two-path design that the linear path is expected to join later is the failure this gate exists to prevent."
superseded_by: null
resolution: null
summary: >-
  Build the renderer foundation in src/render/: the shared scene-consumption
  and beat-mounting contract, the centralized learner-facing strings table, the
  fraction-bar and symbolic renderers, and the discrete non-drag control
  structure. Proves the common boundary holds and that no renderer becomes a
  second source of truth, before the accessible linear path and the leakage
  invariants test that boundary in plan-08.
---

# Plan 07: Renderer Foundation and Learner-Facing Strings

## Packet Metadata

- Packet id: `plan-07`
- Packet title: Renderer Foundation and Learner-Facing Strings
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-19
- Packet type: feature
- Mutation level: source, user-facing
- Approval gate: three-path mechanism confirmation, then orchestrator review
- Depends on: `plan-06` (scene projection)
- Expected artifacts: `src/render/` foundation modules, `src/render/strings.js`, `src/styles/`, fraction-bar and symbolic renderers, tests, progress report

## Goal

Establish the presentation boundary and the first two visible paths: a shared way for any renderer to
consume a scene and mount it by beat, the complete learner-facing string inventory, and the
fraction-bar and symbolic renderers built on that boundary.

The packet's real product is the **boundary**, not the two renderers. If the boundary is right, the
accessible linear path in `plan-08` joins it without redesign and the leakage invariants pass. If it is
wrong, `plan-08` will find out — which is why the split exists and why this packet stops here.

## Non-goals

- **No mathematical or instructional logic.** No denominator, equivalence, sum, or correctness outcome
  computed in `src/render/`; no renderer decides the next beat.
- **No accessible linear path.** That is `plan-08`, deliberately. Do not build a partial one.
- **No scaffold-leakage invariant suite.** Also `plan-08`. Beat-mounting must be *built* correctly
  here; it is *proven* there.
- **No completed-beat collapse rule** and no rubric self-assessment — `plan-08`.
- No app shell, entry page, routing, or condition switcher — `plan-09`.
- No deployment or public verification — `plan-09`.
- No learner preference surface and no browser storage (DECISION-019).
- No number line, no new families, no session or progress features.
- **No accessibility conformance claim.** The project builds **against** WCAG 2.2 AA (DECISION-010).
  Report and copy say "built against," never "conforms to" (reconciliation finding R4).

## Depends on

`plan-06` delivered and reviewed. Renderers consume a validated scene; built earlier they would be
built against a stub.

## Why this packet exists

This is the first child-visible surface, and the point where a correct system can still fail a child.
The founding documents treat undersized targets, over-level language, leaked answers, and a crowded
scene as quality defects rather than polish, and `06-roadmap.md` §23 asks for disproportionate
attention here because this slice becomes the reference for every later phase.

It is bounded at the renderer foundation because the alternative — one packet owning the visible
renderers *and* the proof that the access model preserves agency — puts the review boundary after the
shared architecture is already committed. A leakage or access defect found then would force a retrofit
of work already reviewed.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-003, 004, 007, 010, 011, 012, 013, 014, 017, 021, 023,
  025, 026 especially
- `docs/presentation-posture.md` — both parts, in full
- `docs/development/phase-2-first-slice-design/episode-definition.md` §6, and the precedence note at
  the head of that file
- `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md` — the leakage
  invariants, read as the contract this packet's mounting design must be able to satisfy
- `docs/founding/02-interaction-grammar.md` §§12, 71–72; `docs/founding/05-quality-and-validation.md`
  §§20, 32, 33, 44, 90
- `reports/orchestration/phase-2-specification-reconciliation.md` — findings R1, R2, R4

Contracts this packet must preserve:

- **Bar segments are not interactive** (DECISION-025). The bar is a display surface. Control size is
  decoupled from denominator, so a 30-part bar at 360px never produces a sub-24px target.
- **Tap and keyboard are primary; drag is never required** (DECISION-013, WCAG 2.2 SC 2.5.7).
- **Beat-gated mounting** (DECISION-014): unreached beats and future values are not in the DOM at all.
  `aria-hidden` or `display:none` pre-mounting of a future answer is forbidden.
- **Register separation** (`docs/presentation-posture.md` Part 2): no specification or research
  vocabulary in any learner-visible string, including accessible names and status text.
- **CM-01 is a matching task with distractors** (DECISION-012) **whose expected answer is not always
  the reassuring one** (DECISION-026). DECISION-007's yes/no text is superseded; never cite it alone.

## Scope

### In scope

- `src/render/` — shared scene consumption, the beat-mounting contract, the fraction-bar renderer, the
  symbolic renderer, the discrete control structure, and `strings.js` (DECISION-017 as relocated by
  DECISION-023).
- `src/styles/` — styling for the above.
- Tests: renderer purity, mounting behavior, control sizing, and mechanically checkable string rules.

### Out of scope

- Everything in Non-goals, plus `src/app/`, the build, the deployment workflow, packet files and
  statuses, and any change to `src/math/`, `src/content/`, or `src/interaction/` beyond consuming them.

## Implementation Requirements

### Requirement 1 — The three-path boundary (gated)

Required behavior:

- A single shared contract governs how any renderer consumes a scene and mounts it by beat. It is
  specified and approved at the mechanism gate **before** any renderer is written, and it is specified
  against all three paths — visual, symbolic, and accessible linear — even though only two are built
  here.
- The contract makes clear what a path must supply to be conformant, so `plan-08` can add the linear
  path without renegotiating the boundary.

Constraints:

- Designing for two paths and assuming the third will fit is the specific failure this gate exists to
  prevent. If the linear path's needs cannot be stated yet, stop and report rather than proceeding.

### Requirement 2 — Renderer purity

Required behavior:

- Each renderer takes a scene and produces presentation. Given the same scene it produces equivalent
  meaning; given a scene it cannot render, it refuses rather than approximating.
- A test demonstrates by construction — not by inspection — that no renderer computes a denominator,
  an equivalence, a sum, or a correctness outcome.

### Requirement 3 — Fraction-bar and symbolic paths

Required behavior:

- **Fraction bar:** one stable whole per operand, visible unit counts, subdivision that communicates
  renaming, and an inspectable post-state. Segments are display only (DECISION-025).
- **Symbolic:** the same current forms and operation state, updating from learner-established
  transformations, never parsing or computing from rendered text.
- Reduced-motion presentation reaches the same post-state as the standard presentation.

### Requirement 4 — Controls

Required behavior:

- Every required decision is operable by tap and by keyboard, with visible focus and a logical tab
  order. No decision requires dragging.
- No interactive control falls below 24×24 CSS px at any supported viewport or any permitted LCD, and
  control sizing does not vary with denominator.

Constraints:

- Full keyboard and non-drag *parity evidence* across all paths is `plan-08`. This packet builds the
  controls correctly and tests them on the paths it owns.

### Requirement 5 — Strings

Required behavior:

- All learner-facing copy lives in `src/render/strings.js` — prompts, guidance, status announcements,
  accessible descriptions, error recovery, help layers. No inline literals in components.
- Every string is authored against DECISION-004's working rules and the Part 2 register rules.
- The progress report includes the full string inventory as a reviewable list. DECISION-017 makes
  string review a blocking gate, and a reviewer cannot gate what is scattered through components.
- Strings for the accessible linear path may be authored here if the boundary requires them; if
  deferred to `plan-08`, say so explicitly rather than leaving the inventory silently incomplete.

Constraints:

- Prompt text is authored, never lifted from a specification document. The Reflect beat is the known
  trap: "state the invariant" is specification language, not a question for a ten-year-old.

## Validation Checklist

- [ ] Mechanism confirmation reported and approved, covering all three paths, before any renderer was
      built.
- [ ] No renderer computes mathematics; proven by test.
- [ ] Bar segments are not focusable, tappable, or clickable.
- [ ] No interactive control below 24×24 CSS px at any supported viewport or permitted LCD.
- [ ] No future value present in the DOM or accessibility tree before its beat.
- [ ] Reduced-motion path reaches the same post-state as the standard path.
- [ ] Full string inventory in the report; every string traceable to `strings.js`; any deferral named.
- [ ] Report says "built against WCAG 2.2 AA," never "conforms to."
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at `reports/development/plan-07-renderer-foundation/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- The linear path's requirements cannot be stated well enough to specify the shared boundary.
- A required decision cannot be made non-drag and keyboard-operable.
- Authoring a string at grade 2–3 appears to require changing what the learner is asked to do.
- Mounting a beat correctly appears to require pre-mounting a future value.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- The implementer may not declare the packet, feature, or product complete, ready to ship, accessible,
  or validated. `05-quality-and-validation.md` §44 reserves "Accessibility validated" for a recorded
  floor with mechanized *and* human review.
- Evidence maps to requirements.

## Advisor Consultation

Inherited from `AGENTS.md`. Real behavioral surface; a "not warranted" declaration would be
non-compliant. Record a full disposition or a named degraded mode.

## Commit and Concurrency Guidance

- Stage by explicit path; never `git add -A`; never push. Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-07-renderer-foundation/progress.md`

Minimum contents: summary; the approved three-path boundary and how the linear path was accounted for;
module map; full string inventory with any deferral named; renderer-purity evidence; mounting evidence;
control-sizing evidence; commands; problems; remaining risks; advisor disposition; ready for
orchestrator review yes/no.

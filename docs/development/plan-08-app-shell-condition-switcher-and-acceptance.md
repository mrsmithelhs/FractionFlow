---
id: plan-08
title: App Shell, Condition Switcher, and Phase 2 Acceptance
status: draft
depends_on: [plan-07]
gate: "Owner gate. The deployed public exercise, the accessibility evidence, and the aesthetic rubric are presented for owner/teacher review. Only the owner declares the Phase 2 exit gate satisfied; the implementer may not, and neither may the orchestrator alone."
superseded_by: null
resolution: null
summary: >-
  Assemble the first complete learner-facing episode: entry page, app shell,
  the reviewer-only design-condition switcher behind a gear icon, and the
  composed pipeline from content through instruction and scene to renderers.
  Then exercise it at the public GitHub Pages URL as roadmap section 16
  requires, gather the participation-floor evidence, and present the whole
  slice against the Phase 2 exit gate for owner review.
---

# Plan 08: App Shell, Condition Switcher, and Phase 2 Acceptance

## Packet Metadata

- Packet id: `plan-08`
- Packet title: App Shell, Condition Switcher, and Phase 2 Acceptance
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-19
- Packet type: feature
- Mutation level: user-facing release
- Approval gate: owner review of the deployed slice against the Phase 2 exit gate
- Depends on: `plan-07` (renderers, strings, participation floor)
- Expected artifacts: `src/app/` modules, condition switcher, deployed public exercise evidence, Phase 2 acceptance evidence packet, progress report

## Goal

Compose the first complete learner-facing episode and put it in front of the owner, running at the
public URL, with its evidence organized against the exit gate rather than asserted.

## Non-goals

- No second episode, family, or representation. The slice stays one episode.
- No learner preferences, storage, accounts, progress, placement, or routing (DECISION-019; D-07,
  D-08, D-09, D-10, D-11 remain deferred).
- No offline or service-worker behavior (`D-21`, excluded by DECISION-009).
- No conformance claim. Built against WCAG 2.2 AA; conformance is not claimed (reconciliation R4).
- No child observation as a gate. DECISION-020 makes it non-blocking; if any occurs it follows
  `05-quality-and-validation.md` §52 and is reported separately under DECISION-022.
- No new decisions. If the slice exposes one, report it for owner disposition.

## Depends on

`plan-07` delivered and reviewed. This packet composes; it does not build renderers.

## Why this packet exists

Roadmap §16 is explicit that the slice "must also be published through the chosen static deployment
path and exercised at the public GitHub Pages URL with no backend," and that local success and an asset
smoke check are not substitutes. `plan-01` proved the deployment plumbing with a static page; this is
the first time real application behavior crosses it.

It is also where the exit gate is finally answerable. Every prior packet produced evidence about a
layer; §25 asks about the experience.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-001, 006, 007, 009, 010, 012, 019, 020, 021, 022, 025,
  026 especially
- `docs/evidence-posture.md` and `docs/presentation-posture.md`
- `docs/founding/06-roadmap.md` §§16–25 — the full exit gate
- `docs/founding/05-quality-and-validation.md` §§44, 52, 90
- `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md` — the evidence
  collection sequence, including the deployed step
- `reports/orchestration/phase-2-specification-reconciliation.md` — finding R3

Contracts this packet must preserve:

- **The switcher is reviewer-only and condition-only** (DECISION-019). No learner or application
  preferences are added to it. Condition selection does not persist across sessions.
- **Conditions are selected upstream** (DECISION-006) as episode configuration and presentation mode
  feeding the normal pipeline — never as a renderer flag — and the active condition is recorded in the
  replay envelope.
- **Static-only.** No backend, no accounts, no server state (DECISION-001; `00-principles.md`).
- **Phase 2 serves the ready subset.** Per reconciliation finding R3, the slice targets a learner who
  meets the episode's stated prerequisites. DECISION-016's broader repair learner is the product's
  primary audience, but repair entry and backward routing are Phase 3+. The report states this plainly
  so the slice is not judged against a learner it was not built for. OQ-17 holds the bounded exit open;
  this packet does not implement it and must not foreclose it.

## Scope

### In scope

- `src/app/` — entry page, application composition, layout shell, static routing.
- The gear-icon condition switcher, reviewer-facing in its entirety, with plain-language condition
  labels and specification codes kept in internal data attributes.
- End-to-end composition of content → instruction → scene → renderers.
- The deployed public exercise and its evidence.
- The Phase 2 acceptance evidence packet.

### Out of scope

- Everything in Non-goals, plus changes to `src/math/`, `src/content/`, `src/interaction/`, or
  `src/render/` beyond composition and defect repair traceable to this packet's own findings.

## Implementation Requirements

### Requirement 1 — Shell and composition

Required behavior:

- A learner can complete the episode end to end: encounter, notice, decide, transform, operate,
  resolve, and the selective reflect and connection check.
- The instructional hierarchy of `02-interaction-grammar.md` §71 holds at every supported width:
  mathematical object, then current question, then response mechanism, then secondary support.
- Composition adds no mathematical or instructional logic.

### Requirement 2 — Condition switcher

Required behavior:

- The gear icon on the entry page opens a reviewer-only menu that switches among registered design
  conditions, selected upstream, with no persistence across reload.
- Condition labels are plain-language descriptions of visual and interaction style; specification
  codes stay in internal data attributes.
- Switching a condition changes only presentation and instructional configuration — never mathematical
  state, never the learner's established work within an episode.
- The active condition appears in the replay envelope.

### Requirement 3 — Deployed public exercise

Required behavior:

- The slice is built and deployed through the existing GitHub Actions path (DECISION-001) and exercised
  at the public URL with no backend.
- The exercise covers a complete episode including at least one error and recovery, one help request,
  the alternate valid path, and the reduced-motion path.
- Evidence records what was exercised, in which browser and viewport, and what was not.

Constraints:

- Publishing is outward-facing. Confirm with the owner before the first deploy of real application
  behavior, and never push without explicit authorization.

### Requirement 4 — Acceptance evidence packet

Required behavior:

- Assemble the evidence the §25 exit gate asks for, organized by criterion: mathematical trust, learner
  agency, visual continuity, local feedback, scaffold variability, accessibility, learner evidence, and
  aesthetic coherence.
- Accessibility evidence separates mechanized checks from human review, per §44 and §943–949, and names
  untested modes as untested.
- The aesthetic rubric (DECISION-021) is applied criterion by criterion with the honest result,
  including any failure.
- Every claim names its evidence tier and n, per `docs/evidence-posture.md`.

Constraints:

- The implementer assembles and reports evidence. It does not declare the gate satisfied.

## Validation Checklist

- [ ] A complete episode is completable end to end, by keyboard alone and by non-drag touch.
- [ ] Hierarchy holds at 360px, a tablet width, and 1440px.
- [ ] Switcher changes conditions upstream, does not persist, and does not alter mathematical state.
- [ ] Active condition recorded in the replay envelope.
- [ ] Owner confirmation obtained before the first deploy of application behavior.
- [ ] Public URL exercised; evidence records browsers, viewports, and what was not covered.
- [ ] Error, help, alternate valid path, and reduced-motion all exercised.
- [ ] Acceptance evidence organized by §25 criterion, with mechanized and human evidence separated.
- [ ] Rubric applied honestly, failures included.
- [ ] Report states the ready-subset scoping per finding R3.
- [ ] No conformance claim anywhere in code, copy, or report.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at
      `reports/development/plan-08-app-shell-condition-switcher-and-acceptance/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- The deployed build behaves differently from local in any way touching mathematics, accessibility, or
  instructional flow.
- A rubric criterion or floor item fails and cannot be fixed within this packet's scope.
- Composition appears to require logic that belongs upstream.
- Any part of the slice would need a new owner decision to finish.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- **The implementer may not declare the Phase 2 exit gate satisfied, the slice accepted, or the product
  ready.** The gate is the owner's, informed by orchestrator verification. "Ready for orchestrator
  review: yes/no" is the bounded handoff statement.
- Evidence maps to criteria. A green build and a working demo are evidence, not acceptance.

## Advisor Consultation

Inherited from `AGENTS.md`. Real behavioral surface and a user-facing release; a "not warranted"
declaration would be non-compliant. Record a full disposition or a named degraded mode.

## Commit and Concurrency Guidance

- Stage by explicit path; never `git add -A`. **Push only with explicit owner authorization**, which
  this packet requires before its first deploy of application behavior. Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-08-app-shell-condition-switcher-and-acceptance/progress.md`

Minimum contents: summary; composition map; switcher behavior and its boundaries; deploy record with
owner authorization reference; what was exercised at the public URL and what was not; acceptance
evidence by §25 criterion; rubric results including failures; accessibility evidence separated by kind
with untested modes named; ready-subset scoping statement; commands; problems; remaining risks; advisor
disposition; ready for orchestrator review yes/no.

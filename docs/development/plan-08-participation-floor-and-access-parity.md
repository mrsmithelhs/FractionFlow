---
id: plan-08
title: Participation Floor and Access Parity
status: in-progress
depends_on: [plan-07]
gate: "Mechanism confirmation for the completed-beat collapse rule and the linear-path conformance approach, then orchestrator review. This packet may report that the plan-07 boundary is wrong; that is a legitimate outcome and not a failure, and it stops for orchestrator disposition rather than retrofitting silently."
summary: >-
  Complete the access model: the accessible linear path on the plan-07
  boundary, the nine fail-first scaffold-leakage invariants across both visual
  and semantic paths, keyboard and non-drag parity for every required decision,
  the completed-beat collapse rule, and the participation-floor and aesthetic
  rubric evidence. This is where the claim that every access path preserves the
  learner's mathematical responsibility is proven rather than asserted.
---

# Plan 08: Participation Floor and Access Parity

## Packet Metadata

- Packet id: `plan-08`
- Packet title: Participation Floor and Access Parity
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-19
- Packet type: feature
- Mutation level: source, user-facing
- Approval gate: mechanism confirmation, then orchestrator review
- Depends on: `plan-07` (renderer foundation, shared boundary, strings)
- Expected artifacts: accessible linear path, leakage-invariant suite, collapse rule, participation-floor evidence, rubric self-assessment, progress report

## Goal

Prove that the access model actually works — that a learner using the keyboard, or touch without
precision, or a linear semantic path, is doing the same mathematics with the same responsibility as a
learner using the visual path, and that no path leaks an answer the learner is supposed to reason out.

`plan-07` built the boundary. This packet joins the third path to it and tests whether the boundary
holds.

## Non-goals

- No app shell, entry page, routing, or condition switcher — `plan-09`.
- No deployment or public verification — `plan-09`.
- No new renderers, representations, families, or episode behavior.
- No learner preference surface and no browser storage (DECISION-019).
- **No accessibility conformance claim.** Built **against** WCAG 2.2 AA (DECISION-010); "built
  against," never "conforms to" (reconciliation finding R4).
- No child observation. DECISION-020 makes it non-blocking for Phase 2.
- **No richer clutter solutions than the one required rule.** OQ-18 explicitly holds design
  exploration open for a later pass with real screens; this packet ships one working rule and stops.

## Depends on

`plan-07` delivered and reviewed, including its approved three-path boundary. This packet is the test
of that boundary, so it cannot precede it.

## Why this packet exists

The split from `plan-07` is deliberate and is the wave's most important review boundary. A visible
renderer that looks plausible and an access model that preserves agency are different achievements,
and the second is where this project is most vulnerable. Reviewing them together would put the
orchestrator's judgment after the shared architecture was already committed; a leakage or parity defect
found then would force a retrofit of work already accepted.

It also gives the owner an informed pause before the first child-visible surface becomes the baseline
every later phase is measured against.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-003, 004, 010, 013, 014, 021, 022, 024, 025 especially
- `docs/presentation-posture.md` — both parts
- `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md` — leakage
  invariants 1–9 and the participation-floor table
- `docs/founding/05-quality-and-validation.md` §§32, 44 including §§943–949 on separating evidence
  kinds, and §90
- `reports/orchestration/phase-2-specification-reconciliation.md` — findings R4, R6
- `docs/open-questions.md` — OQ-04 and OQ-18

Contracts this packet must preserve:

- **Equal responsibility across paths.** The accessible path never reveals a response the visual path
  asks the learner to reason out (`05-quality-and-validation.md` §44).
- **Beat-gated mounting** (DECISION-014) is the structural anti-leakage mechanism; the invariants are
  the proof it holds.
- **A constrained choice list may contain a valid target among candidates**; it must not reveal which
  is correct.
- **Inspectable does not require full-size.** DECISION-014 keeps completed beats reachable;
  DECISION-021 criterion 1 keeps the scene calm. Both must hold at once.

## Implementation Requirements

### Requirement 1 — Accessible linear path

Required behavior:

- The linear path exposes the same quantities, unit relationships, learner decisions, and status
  changes in programmatically inspectable reading order, built on the `plan-07` boundary without
  renegotiating it.
- It is text all the way down and is therefore the surface most exposed to reading burden. It is held
  to DECISION-004 at least as strictly as the visual path.

Constraints:

- If the `plan-07` boundary cannot carry the linear path, **stop and report**. Do not widen the
  boundary silently — that outcome is the reason this packet is separate, and it is a finding, not a
  failure.

### Requirement 2 — OQ-04 adaptation rationale

Required behavior:

- DECISION-024 downgraded OQ-04 to an implementation decision to be *recorded with rationale*. This
  packet owns that record. The progress report lists each linear-path adaptation — **or states `none`
  explicitly** — and for each, states the preserved learner responsibility and why it is an
  accommodation rather than an answer-revealing scaffold.

Constraints:

- An unrecorded adaptation is a defect even if the adaptation itself is sound. The decision already
  made requires the record; silence makes the choice invisible to review.

### Requirement 3 — Scaffold-leakage invariants

Required behavior:

- Implement fail-first tests for invariants 1–9 of the evidence plan, inspecting **both** the visual
  and the semantic/linear path before each required response.
- Demonstrate the failing-first property: each invariant is shown to catch the leak it names.

### Requirement 4 — Keyboard and non-drag parity

Required behavior:

- Every required decision is completable by keyboard alone, and by touch without precision dragging,
  on every path, with evidence per decision rather than in aggregate.
- No interactive control below 24×24 CSS px at any supported viewport or permitted LCD.

### Requirement 5 — Completed-beat collapse

Required behavior:

- Ship one working collapse rule: completed beats remain reachable and inspectable (DECISION-014)
  while the scene stays calm enough to pass DECISION-021 criterion 1 from 360px through 1440px.
- A compact line, a reviewable trail, or a quieter register are all acceptable.

Constraints:

- Per OQ-18 this packet ships *a* rule, not the best one. Do not gold-plate; do not skip.

### Requirement 6 — Participation-floor and rubric evidence

Required behavior:

- Map each `05-quality-and-validation.md` §44 floor item to its implemented mechanism and evidence it:
  non-drag and keyboard operation, reduced-motion parity reaching the same post-state, semantic and
  linear meaning, focus and reading order and labels and status and contrast and text scaling across
  the DECISION-009 matrix, and equal responsibility across access modes.
- Self-assess against DECISION-021's four rubric criteria and report honestly, including any criterion
  the implementer believes fails.
- Report results at the individual and worst-case level rather than in aggregate, per DECISION-022.

Constraints:

- Mechanized checks are necessary and not sufficient (§44, §949). Report what a scanner cannot see.
- Environments actually exercised are distinguished from the DECISION-009 support *target*; untested
  modes are named as untested.

## Validation Checklist

- [ ] Mechanism confirmation reported and approved before implementation.
- [ ] Linear path built on the `plan-07` boundary, or the boundary's inadequacy reported rather than
      worked around.
- [ ] OQ-04 adaptation record present, listing each adaptation or explicitly stating `none`.
- [ ] Leakage invariants 1–9 implemented across both paths, with failing-first demonstrated.
- [ ] Every required decision completable by keyboard alone and by non-drag touch, evidenced per
      decision.
- [ ] No interactive control below 24×24 CSS px at any supported viewport or permitted LCD.
- [ ] Collapse rule shipped and shown to satisfy DECISION-014 and DECISION-021 criterion 1 at 360px
      and at 1440px.
- [ ] Rubric self-assessment covers all four criteria, failures included.
- [ ] Floor evidence separates mechanized from human review; untested modes named.
- [ ] Report says "built against WCAG 2.2 AA," never "conforms to."
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at
      `reports/development/plan-08-participation-floor-and-access-parity/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- The `plan-07` boundary cannot carry the linear path without redesign.
- A required decision cannot be made non-drag and keyboard-operable.
- A rubric criterion cannot be satisfied without violating another decision. Report the conflict; do
  not resolve it by weakening a floor item.
- The collapse rule cannot keep completed beats reachable and the scene calm at 360px. That is an
  OQ-18 escalation, not an implementer judgment call.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- The implementer may not declare the packet, feature, or product complete, ready to ship, accessible,
  or validated. §44 reserves "Accessibility validated" for a recorded floor with mechanized *and*
  human review, and the human review is not this packet's to declare done.
- Evidence maps to requirements.

## Advisor Consultation

Inherited from `AGENTS.md`. Real behavioral surface; a "not warranted" declaration would be
non-compliant. Record a full disposition or a named degraded mode.

## Commit and Concurrency Guidance

- Stage by explicit path; never `git add -A`; never push. Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-08-participation-floor-and-access-parity/progress.md`

Minimum contents: summary; mechanism proposal and approval; whether the `plan-07` boundary held and
what if anything it could not carry; OQ-04 adaptation record or explicit `none`; leakage-invariant
results with failing-first evidence; per-decision keyboard and non-drag parity evidence; collapse rule
and why it satisfies both constraints; participation-floor mapping with evidence kind per item;
environments exercised versus targeted; rubric self-assessment including failures; commands; problems;
remaining risks; advisor disposition; ready for orchestrator review yes/no.

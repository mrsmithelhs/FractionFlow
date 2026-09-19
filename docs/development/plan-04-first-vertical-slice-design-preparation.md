---
id: plan-04
title: First Vertical Slice — Design and Evidence Preparation
status: in-progress
depends_on: [plan-03]
gate: "Owner approves the packet and reviews the resulting design dossier; no Phase 2 implementation packet may be drafted until this dossier is accepted. Design artifacts are proposals, not settled decisions."
summary: >-
  Prepare — but do not begin — the Phase 2 first vertical slice: draft the
  episode definition for unlike-denominator proper-fraction addition (both
  operands renamed), the scene-model design position, the accessibility
  evidence plan for the slice, the learner-prerequisite and evidence contract,
  and a register of prototype variables that this project explicitly refuses
  to pre-decide (animation vs static, morphing vs juxtaposition, prompt
  density, bridge mechanics). Output is a design dossier under docs/, not
  application code.
---

# Plan 04: First Vertical Slice — Design and Evidence Preparation

## Packet Metadata

- Packet id: `plan-04`
- Packet title: First Vertical Slice — Design and Evidence Preparation
- Status: (see frontmatter)
- Owner/model: investigator (single) / orchestration
- Date: 2026-09-18
- Packet type: investigation / docs
- Mutation level: docs-only (design dossier at exactly `docs/development/phase-2-first-slice-design/`; no application source)
- Approval gate: owner reviews and accepts the design dossier; orchestrator confirms it honors every deferred-question boundary before any Phase 2 implementation packet is drafted
- Depends on: `plan-03` (schemas, family contracts, and classified instances must exist to design against)
- Expected artifacts: design dossier at exactly `docs/development/phase-2-first-slice-design/` with the exact file set listed in Scope; prototype-variable register (as the named dossier file); evidence-plan outline; progress report

## Goal

Produce the design foundation for Roadmap Phase 2 — the first excellent episode (`docs/founding/06-roadmap.md` §§16–25) — as reviewable documents, so that the eventual Phase 2 implementation packet starts from an approved episode definition and an explicit evidence plan instead of improvising pedagogy, architecture, and accessibility claims mid-build. This packet converts the founding contracts into a concrete design while keeping every disputed mechanic explicitly open as a prototype variable.

## Non-goals

- **No application code.** This is a design/investigation packet; writing `src/interaction/`, `src/render/`, or `src/app/` code is out of scope and belongs to later packets.
- No decisions on deferred display mechanics: animation versus static/key-frame presentation (deferred item D-01), morphing versus juxtaposition versus sequential replacement (D-02), prompt density and prediction cadence (D-05), bridge frequency (D-04), and number-line roadmap timing (D-03). The dossier registers these as prototype variables with candidate conditions; it must not select winners.
- No fixed denominator or rendering ceilings (D-06), no session dose or time limits (D-07), no first-run placement design (D-08), no persistence, identity, or shared-device policy (D-10, D-11, D-12 beyond the plan-03 version identifier).
- No WCAG conformance claim, no completed accessibility matrix, no child-usability protocol execution (D-22 boundary); the dossier plans evidence, it does not claim it.
- No license, privacy-statement, share-link, or public-release decisions (D-23, D-24, D-25, D-27).
- No changes to the founding documents; if the dossier exposes a genuine specification ambiguity, record it as a finding for orchestrator disposition (per `docs/founding/05-quality-and-validation.md` §79, specification drift routes through the owning document).

## Depends on

- `plan-03` complete: the episode design must reference concrete schemas, family contracts, and classified instances (e.g., the relatively-prime addition family and its canonical example 2/3 + 1/4).

## Why this packet exists

Phase 2 is where FractionFlow must prove its founding vision in one episode (`docs/founding/06-roadmap.md` §§10, 16), and it carries the project's highest concentration of untested design hypotheses (the synthesis §8: "leave the disputed mechanics to prototyping"). Starting implementation without an approved episode definition, an explicit learner/evidence contract, and a named prototype-variable register invites exactly the failure modes the founding documents warn about: silent scope expansion, proxy-metric victory, and research-motivated preferences masquerading as research-established facts. A small docs-only packet now makes the eventual build packet smaller, cheaper, and reviewable against something stable. The Phase 0 exit question — "what are we trying to prove with the first working episode?" — deserves a written answer before code.

## Authority and contracts

Required reading:

- `AGENTS.md`
- `docs/decision-log.md`
- `docs/development/README.md`
- `docs/founding/00-principles.md` §§1–7, 17, 20–27 (focal idea, calmness, accessibility, static-only and privacy boundaries, ownership and contradiction handling)
- `docs/founding/03-math-and-content-model.md` §§9–11, 27, 35, 54–61, 68–69 (value/current-form/preferred-form distinctions, the Phase 2 family and its canonical example, valid non-least denominators and alternate paths, representation feasibility)
- `docs/founding/01-instructional-model.md` §§16–19 (bridges, evidence categories, productive prediction, Stage boundaries)
- `docs/founding/02-interaction-grammar.md` (beats, scaffold dimensions and support labels, canonical episode, help example, fading example)
- `docs/founding/04-system-architecture.md` §§12–22, 36–48 (Instructional Engine, Scene Model, renderers, episode definitions, capability and eligibility)
- `docs/founding/05-quality-and-validation.md` §§17–22 (instructional validation, scaffold leakage, over/under-scaffolding), §44 (accessibility acceptance floor), §49–50 (golden cases)
- `docs/founding/06-roadmap.md` §§16–25 (Phase 2 scope, non-goals, exit gate)
- `reports/orchestration/founding-docs-review/deferred-recommendations.md` (D-01 through D-08, D-13, D-16, D-18, D-20, D-22 — boundaries this packet must honor)

Contracts this packet must preserve:

- The separation rule and unidirectional flow: mathematical state → instructional state → presentation; the episode design must locate every fact in its owning layer.
- The evidence discipline: supported construction, prediction, and independent transfer are distinct evidence categories; an `independent` support configuration does not by itself establish `independent transfer`; the design records provenance (what was visible, hinted, retried) for every assessed response.
- The Phase 2 learner boundary: the slice targets an upper-elementary learner who has encountered fractional units, simple equivalence, like-denominator addition, and the idea of a common unit (Stages A–D); the dossier states prerequisites and exactly what the slice's evidence can and cannot establish (`docs/founding/06-roadmap.md` §16; synthesis 20-01).
- The accessibility participation floor of `docs/founding/05-quality-and-validation.md` §44 applies to the first complete learner-facing episode; the dossier plans how that floor will be met and evidenced (mechanized, human review, and child evidence recorded separately), claiming nothing in advance.
- Authored-path coverage: the episode definition declares its covered valid paths and the reviewed behavior class for a mathematically valid path outside coverage; missing coverage is never reported as mathematical incorrectness.

## Scope

### In scope

All dossier artifacts are written to exactly one location — the dossier folder `docs/development/phase-2-first-slice-design/` — containing exactly these files and no others:

- `README.md` — dossier index: goal, section map, claim boundaries, review status.
- `episode-definition.md` — the episode definition draft (Requirement 1).
- `scene-model-position.md` — the Scene Model design position answering D-20 (Requirement 2, second bullet), recording the architectural decision, rejected alternatives, and reasons.
- `prototype-variable-register.md` — the prototype-variable register with the hypothesis/falsification structure (Requirement 2).
- `evidence-and-accessibility-plan.md` — the learner-prerequisite/evidence contract, accessibility evidence plan, scaffold-leakage test plan sketch (D-16), and replay/defect-report plan.

- **Episode definition draft** for the first slice (unlike-denominator proper-fraction addition, both operands renamed; fraction bar primary; symbolic notation integrated), covering every field of `docs/founding/04-system-architecture.md` §36: instructional purpose; eligible problem family (referencing plan-03 contracts); learner responsibilities and system responsibilities per `docs/founding/02-interaction-grammar.md` §66; narrative beats (encounter → notice → decide → transform → operate → resolve, with selective reflect); allowable scaffold dimensions using the canonical support labels; covered valid paths and the fallback behavior class for valid paths outside coverage; completion conditions.
- **Scene-model design position** answering deferred item D-20: state whether the scene is a pure projection of validated problem state, instructional state, and active representation, or what (if anything) is stored and why it is source state rather than a drifting cache. This is a written design position for review, not code. The position must explicitly separate architectural decisions (derived from the state-ownership constraints of `docs/founding/04-system-architecture.md`; record each rejected alternative and the architectural reason it was rejected) from empirical instructional hypotheses (which belong in the prototype-variable register and require learner-outcome evidence); the former must not be presented as if they needed prototype evidence.
- **Scaffold-leakage test plan sketch** per deferred item D-16: once scene/prompt models exist in Phase 2, which fail-first invariants will inspect learner-visible state before each required response (reveal timing, help/replay state, constrained choices, retries).
- **Accessibility evidence plan** for the slice: the participation-floor checklist mapped to planned mechanisms (keyboard-operable non-drag paths, reduced-motion equivalence, semantic/linear alternatives), the supported-environment matrix as an open question (D-22), and the three evidence kinds recorded separately with untested modes explicitly untested.
- **Learner-prerequisite and evidence contract**: the assumed learner starting point, the readiness/documentation approach before any learner observation, and the exact claims the slice's evidence may and may not support (`docs/founding/06-roadmap.md` §16; §25 gate).
- **Prototype-variable register**: a table of every deferred mechanic the slice will eventually compare (D-01 animation vs static/key-frame; D-02 transformation choreography; D-05 prompt density; connection-making prompt form per synthesis §2.12 — no prompt / structured mapping / brief explanation, held constant across display conditions), each with candidate conditions, the invariant held constant, and the outcome measures (prediction before reveal, immediate equivalence reasoning, uncued transfer, help/replay use) — per synthesis §3.1's discriminating-experiment shape. Every question in the register must carry the falsification structure required of investigation packets (`docs/development/packet-creation-guidance.md`): rival hypotheses; the observation that would falsify each rival; the manipulated variable; held-constant variables; outcome measures; real-world variation dimensions; at least one discriminating experiment for every live pair of rivals; and a conclusion rule — when the planned evidence would not falsify all rivals, the entry writes "consistent with A and B" and names the next experiment.
- **Replay and defect-report plan**: how a reported issue will be reconstructed (seed, family, episode definition, support configuration, action sequence) per `docs/founding/04-system-architecture.md` §§41–42.

### Out of scope

Everything in Non-goals, plus: editing packet files or statuses, running any build or test command beyond read-only inspection, and any change outside the dossier folder and this packet's report folder.

## Implementation Requirements

### Requirement 1 — Episode definition completeness

Required behavior:

- The episode definition draft contains every field of `docs/founding/04-system-architecture.md` §36, with learner/system responsibilities stated sharply enough that a reviewer can apply `docs/founding/05-quality-and-validation.md` §18 (reject episodes where responsibilities are unclear).
- Covered valid paths are enumerated (at minimum the LCD canonical path and at least one supported non-LCD valid path), with the declared fallback behavior class for valid paths outside coverage.

Constraints:

- The design must keep mathematical truth in the math/content layers: the episode never computes validity.

### Requirement 2 — Prototype-variable discipline

Required behavior:

- The register names every deferred mechanic the slice touches, with constant-held and varied conditions, and marks each as "prototype output — not decided by this dossier."
- No sentence in the dossier selects a winner among animation/static, morph/juxtaposition/sequential, or prompt forms; where the founding text itself mandates behavior (prediction before demonstration when it matters; inspectable final state; reduced-motion equivalence), the dossier cites the mandate rather than re-deciding it.

Constraints:

- Where the synthesis flagged a confound (e.g., co-presence alone is not a test of connection-making), the register reflects it.

### Requirement 3 — Evidence and accessibility plan

Required behavior:

- The evidence plan states prerequisites, what slice evidence can establish (mathematical correctness, representational continuity, comprehensibility, agency, error recovery, supported performance for the stated starting point) and cannot establish (novice learning of Stages A–E, persistence, independent transfer, fading-rule efficacy, instructional efficacy).
- The accessibility plan maps each participation-floor item to a planned mechanism and names which evidence kind will demonstrate it, with untested modes explicitly listed as untested.

Constraints:

- No claims that any test, review, or observation has already occurred.

## Validation Checklist

- [ ] Required output artifacts exist at exactly `docs/development/phase-2-first-slice-design/`, with the named files (`README.md`, `episode-definition.md`, `scene-model-position.md`, `prototype-variable-register.md`, `evidence-and-accessibility-plan.md`) and all named sections present.
- [ ] Episode definition draft passes a field-by-field check against `docs/founding/04-system-architecture.md` §36.
- [ ] Prototype-variable register covers D-01, D-02, D-05, and the connection-making prompt-form question, each marked undecided.
- [ ] Every prototype-variable register entry carries the full falsification structure: rival hypotheses, a falsifying observation per rival, manipulated and held-constant variables, outcome measures, real-world variation dimensions, at least one discriminating experiment per live pair of rivals, and the conclusion rule — when the planned evidence would not falsify all rivals, the entry writes "consistent with A and B" and names the next experiment.
- [ ] The Scene Model design position explicitly separates architectural decisions (each with rejected alternatives and the architectural reason) from empirical instructional hypotheses (routed to the prototype-variable register).
- [ ] Evidence plan states both the allowed and disallowed claim sets.
- [ ] Accessibility plan maps the §44 floor to mechanisms and evidence kinds without claiming results.
- [ ] Dossier contains no decision on any item in the packet's Non-goals (orchestrator checks against the deferred-recommendations list).
- [ ] Progress report exists at `reports/development/plan-04-first-vertical-slice-design-preparation/progress.md`.
- [ ] No unrelated files were changed.
- [ ] Approval gate is honored: the dossier is presented for owner review; no Phase 2 implementation packet is drafted before acceptance.

## Stop Conditions

Stop and report to the orchestrator if:

- A dependency is missing or behaves unexpectedly (e.g., plan-03 schemas lack a field the episode definition needs — report the gap rather than inventing schema).
- Drafting the design appears to require deciding a deferred question (route it to the register instead, and note the pressure in the report).
- The implementer finds an internal contradiction between founding documents (per `docs/founding/00-principles.md` §27, record it; do not silently pick a reading).

## Privacy, Accessibility, and Learner-Data Boundaries

- The dossier plans child-observation handling per `docs/founding/05-quality-and-validation.md` §52 (permission, de-identification, synthetic fixtures by default) but conducts no observation and commits no learner material.
- Accessibility here is planning only; the floor's satisfaction is a Phase 2 acceptance matter.

## Commit and Concurrency Guidance

- Commit discipline: stage explicit paths (the `docs/development/phase-2-first-slice-design/` dossier folder + this packet's report folder); never `git add -A`; never push.
- Concurrency: mode A. This packet is docs-only but touches project direction; serialize against any other active thread.
- If `index.lock: File exists`, wait and retry; never delete the lock file.

## Implementer Authority Boundaries

Per `docs/development/packet-creation-guidance.md` and `docs/workflows/packet-tracking-system.md`:

- The implementer may not set packet completion status and may not edit orchestrator/owner disposition records; status verbs (`delivered`, `complete`, `superseded`, `parked`) belong to the orchestrator/owner.
- The implementer may not declare the packet, the feature, or the product complete, done, ready to ship, or equivalent. "Ready for orchestrator review: yes/no" in the progress report is a bounded handoff statement, not a status mutation or a shipping declaration.
- The implementer reports against the packet's objective — what was verified, how, and against which requirement. Passing tests and large counts are evidence, not proof; the report must map evidence to the objective so a reviewer can confirm each claim without re-running everything.

## Advisor Consultation

Advisor consultation is a thread-level obligation inherited from `AGENTS.md`. At packet start, the implementing thread must determine and record whether a consultation ran (with a disposition record), was not warranted (with a one-line reason), or a degraded mode applies (naming the mode), following the provider-capability and proportionality rules. This packet does not pre-classify that determination.

## Progress Report

`reports/development/plan-04-first-vertical-slice-design-preparation/progress.md`

Minimum contents: overall summary; dossier location and section list; episode-definition field checklist result; prototype-variable register summary and confirmation that no deferred question was decided; evidence-plan claim boundaries; accessibility-plan mechanism mapping; specification ambiguities or contradictions found (if any) and where they were recorded; commands run (read-only inspections); validation checks performed; problems encountered; remaining risks; advisor-consultation disposition (ran / not warranted / degraded mode); ready for orchestrator review yes/no.

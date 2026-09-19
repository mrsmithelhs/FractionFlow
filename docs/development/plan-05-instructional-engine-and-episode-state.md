---
id: plan-05
title: Instructional Engine and Episode State
status: draft
depends_on: [plan-04]
gate: "Mechanism confirmation before implementation: the implementer proposes the episode-state shape, beat transition model, response-classification delegation, provenance record, and the eligibility evaluator's inputs and outputs, and stops for orchestrator approval. No DOM, no rendering, no strings."
superseded_by: null
resolution: null
summary: >-
  Build the instructional layer of the pipeline in src/interaction/: the episode
  state machine for encounter through resolve, support configuration, response
  classification delegating all mathematical truth to src/math and src/content,
  response provenance, local error recovery, layered help, and the replay
  envelope. Also closes the one missing prerequisite: the deterministic
  representation-eligibility evaluator in src/content/, which episode
  instantiation requires and which Plan 03 left as the literal string
  'deferred'. Pure logic with zero DOM, proven by headless tests before any
  renderer exists.
---

# Plan 05: Instructional Engine and Episode State

## Packet Metadata

- Packet id: `plan-05`
- Packet title: Instructional Engine and Episode State
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-19
- Packet type: feature
- Mutation level: source (new `src/interaction/`; the eligibility evaluator in `src/content/`; tests; one small docs cleanup)
- Approval gate: mechanism confirmation before implementation, then orchestrator review of the delivered engine
- Depends on: `plan-04` (episode definition, scene-model position, evidence plan), and the delivered `src/math/` and `src/content/` contracts from `plan-02` and `plan-03`
- Expected artifacts: `src/interaction/` modules, the `src/content/` eligibility evaluator, tests under `tests/`, the register cleanup named in Requirement 5, progress report

## Goal

Build the second stage of the unidirectional pipeline — instructional state — as pure logic, so that
the episode's behavior is provable before any pixel exists. The engine turns a validated Plan 03
problem instance plus an episode definition into a sequence of beats, expected responses, support
configurations, classifications, and provenance records. It decides *what the learner is being asked
and what their response means*. It never decides mathematical truth, and it never knows how anything
looks.

## Non-goals

- **No DOM, no rendering, no CSS, no markup.** Nothing in this packet may import or assume a browser
  document. `src/render/`, `src/app/`, and `src/styles/` stay empty.
- **No learner-facing strings.** Prompt text is `plan-07` work under DECISION-017 and DECISION-023
  (`src/render/strings.js`). This packet emits prompt *identities* and the data a prompt needs, never
  the words. See `docs/presentation-posture.md` Part 2.
- **No Scene Model.** The semantic projection is `plan-06`. This packet must not grow a scene shape,
  even a provisional one.
- **No Scene Model-side capability logic.** This packet supplies the deterministic eligibility
  evaluator in `src/content/` (Requirement 6) because episode instantiation requires it. Everything
  scene-side — projection, staleness, the six scene obligations — remains `plan-06`.
- No persistence, no storage, no session or progress state beyond one episode in memory
  (DECISION-019 keeps Phase 2 free of browser-stored state).
- No changes to `src/math/`, and no change to `src/content/` beyond the eligibility evaluator. If
  either lacks something else the engine needs, stop and report rather than extending a delivered
  contract.

## Depends on

`plan-04` supplies the episode definition whose fields this engine implements, and the response-level
provenance contract it must record. `plan-02` supplies exact validators; `plan-03` supplies validated
problem instances with canonical and alternate paths, classifications, and review metadata. The
engine is a consumer of all three and an author of none of their facts.

## Why this packet exists

The pipeline is `mathematical state → instructional state → presentation`. Instructional state is the
only stage with no implementation, and every later packet depends on it. Building it first, headlessly,
means the renderer packet can be judged on whether it *communicates* correct state rather than on
whether it *computes* it — which is the separation rule's whole purpose, and the thing that is hardest
to recover if the layers are built together.

It also front-loads the cheapest possible proof of the riskiest architectural claim: that the episode
definition is implementable as written. If `plan-04`'s responsibility map has a gap, this packet finds
it in test code rather than in a half-built interface.

## Authority and contracts

Required reading:

- `AGENTS.md`
- `docs/decision-log.md` — DECISION-005, 006, 007, 012, 013, 014, 019, 022, 026 especially
- `docs/development/README.md`
- `docs/development/phase-2-first-slice-design/episode-definition.md` (all sections)
- `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md` §§ response-level
  provenance, scaffold-leakage plan, replay and defect-report plan
- `docs/development/phase-2-first-slice-design/scene-model-position.md` — for the boundary this packet
  must not cross
- `docs/founding/02-interaction-grammar.md` §§66, 71; `docs/founding/04-system-architecture.md`
  §§12–22, 36–48; `docs/founding/05-quality-and-validation.md` §§16–22
- `reports/orchestration/phase-2-specification-reconciliation.md`

Contracts this packet must preserve:

- **The separation rule.** The engine calls `src/math/` and `src/content/` for every mathematical
  judgment — validity, equivalence, divisibility, least common denominator, result classification. It
  reimplements none of them, not even trivially.
- **Authored-path coverage is not mathematical correctness.** A valid common denominator outside the
  record's enumerated paths is classified `valid-but-outside-authored-coverage` and never as an error
  (`04-system-architecture.md` §921; episode definition §7.3).
- **Evidence categories stay distinct.** Supported construction, prediction, and independent transfer
  are separate; an `independent` support configuration does not by itself establish independent
  transfer.
- **Where the bundle is referenced, DECISION-012 and DECISION-026 govern CM-01**, not DECISION-007's
  superseded yes/no text. See reconciliation finding R1.

## Scope

### In scope

- `src/interaction/` — new module: episode state, beat transitions, support configuration, response
  handling, classification delegation, help and retry state, provenance records, replay envelope.
- `src/content/` — the deterministic representation-eligibility evaluator only (Requirement 6). This
  is the packet's one cross-layer file ownership, and it is deliberate.
- `tests/` — headless tests for the above.
- One docs cleanup: `docs/development/phase-2-first-slice-design/prototype-variable-register.md`
  (Requirement 5).

### Out of scope

- Everything in Non-goals, plus any change to `src/math/`, any change to `src/content/` beyond the
  eligibility evaluator, `package.json`, the build, the deployment workflow, packet files, or packet
  statuses.

## Implementation Requirements

### Requirement 1 — Episode state and beats

Required behavior:

- The engine models the beats of the episode definition §4 — encounter, notice, decide, transform,
  operate, resolve, and selective reflect — with explicit transitions and an explicit current beat.
- At every point the engine can state: the active beat, the expected response, the active support
  configuration, and what the learner has established so far.
- Completed beats are retained as inspectable context (DECISION-014 item 2). The engine exposes
  *that* they are complete and *what* they established; how much of that is displayed is `plan-08`'s
  decision under DECISION-021 criterion 1 and OQ-18.

Constraints:

- A beat transition happens only on a learner action or an authorized system action, never on a timer
  and never as a side effect of anything presentational.

### Requirement 2 — Response classification by delegation

Required behavior:

- Each response class from episode definition §8 is handled: invalid common denominator, valid
  denominator with incorrect equivalent numerator, denominator changed without numerator, incorrect
  numerator arithmetic, correct but unsimplified result.
- Classification calls the exact validators. A proposed common denominator is classified through
  `validateCommonDenominator`, which returns `valid-least` or `valid-non-least` for *any* common
  denominator — including denominators the instance record does not enumerate.
- Correct prior work is preserved across an invalid response; only the invalid pending response is
  cleared (evidence plan, leakage invariant 8).

Constraints:

- No arithmetic in `src/interaction/`. If a test needs a computed value, it comes from the math or
  content layer.

### Requirement 3 — Support configuration and help

Required behavior:

- The independent support dimensions of episode definition §5 are modeled independently, with the
  canonical labels high support / medium support / low support / independent
  (`02-interaction-grammar.md` §467). A single opaque difficulty value is a defect.
- Layered help follows orient → represent → constrain → demonstrate, stopping at the smallest useful
  support. A help request is recorded as support use, never as failure.
- A reveal or demonstration marks the subsequent response as supported, so it can never be counted as
  an uncued prediction (leakage invariant 7).

### Requirement 4 — Provenance and replay

Required behavior:

- Every assessed response produces the record named in the evidence plan's response-level provenance
  contract: content identity, episode definition id and revision, active support label and dimensions,
  beat, what was visible or supplied, prompt identity, help/replay/retry history, the learner action,
  the classification, and the evidence category.
- The replay envelope of the evidence plan can reconstruct an episode from content identity, episode
  definition, support state, active condition (DECISION-006), and the ordered learner-intent action
  sequence.

Constraints:

- Records are synthetic and carry no learner-identifying material
  (`05-quality-and-validation.md` §52).
- The active design condition is part of the envelope, because DECISION-006 makes it swappable.

### Requirement 5 — Register cleanup

Required behavior:

- In `prototype-variable-register.md`, the strike of uncued transfer (DECISION-024) is applied
  consistently. The outcome-measure bullets are already annotated; the falsification observations and
  discriminating-experiment cells still rest on transfer and must be swept the same way — currently
  lines 119, 153–154, 186, 188, 259, 299–301, 332, 334.
- Where removing transfer would empty a rival's falsifying observation, replace it with a criterion
  the small-n ladder can actually observe rather than deleting the row.

Constraints:

- Do not otherwise edit the `plan-04` dossier.

### Requirement 6 — Representation-eligibility evaluator

Required behavior:

- Replace Plan 03's literal `'deferred'` eligibility values for the Phase 2 family with a
  deterministic evaluator in `src/content/`, applying the DECISION-011 ceilings of LCD ≤ 30 and
  single-operand scale factor ≤ 12.
- The evaluator runs on the canonical path *and* on any alternate or learner-proposed common
  denominator, since a path can be ineligible while its instance is eligible.
- **Episode construction rejects a missing or `'deferred'` verdict.** An episode may not be
  instantiated from an unresolved eligibility state.
- An ineligible instance or path yields `valid-but-outside-representation-capability`, distinct from
  `valid-but-outside-authored-coverage`.
- Tests cover three cases: an eligible canonical/LCD path, an eligible alternate path, and a
  mathematically valid but representation-ineligible path.

Constraints:

- The ceilings bound *rendering eligibility*, never *validity*. A denominator above the ceiling stays
  mathematically valid and still classifies as `valid-least` or `valid-non-least`.
- This requirement exists here, rather than in `plan-06`, because OQ-02's accepted resolution places
  eligibility **before episode instantiation**. Leaving it downstream would have had this packet
  instantiate episodes against a stub — the failure mode the wave's ordering exists to prevent.
- Report the current eligibility sweep figures for both profiles rather than assuming earlier ones.

## Validation Checklist

- [ ] Mechanism confirmation was reported and approved before implementation began.
- [ ] `src/interaction/` contains no DOM reference, no string of learner-facing copy, and no import
      from a rendering or browser API.
- [ ] Every mathematical judgment in tests traces to a `src/math/` or `src/content/` call.
- [ ] A valid non-enumerated common denominator (e.g. 36 on the canonical instance) classifies as
      valid, not as an error.
- [ ] All five response classes of episode definition §8 have tests, including correct-but-unsimplified.
- [ ] A supported response and an uncued response are distinguishable in the provenance record.
- [ ] Replay reconstructs an episode from the envelope alone.
- [ ] Requirement 5 cleanup applied; no other dossier edits.
- [ ] No `'deferred'` eligibility values remain for the Phase 2 family.
- [ ] Episode construction rejects a missing or `'deferred'` verdict.
- [ ] Eligible canonical, eligible alternate, and ineligible-but-valid cases all tested.
- [ ] A denominator above the ceiling is still mathematically valid and refused only for rendering.
- [ ] Current eligibility sweep figures reported for both profiles.
- [ ] `npm test` passes; `node scripts/dev/plan-status.js lint` passes; working tree clean.
- [ ] Progress report exists at
      `reports/development/plan-05-instructional-engine-and-episode-state/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- The episode definition requires a fact that `src/math/` or `src/content/` does not expose. Report
  the gap; do not extend a delivered contract beyond the eligibility evaluator.
- The eligibility ceilings exclude the canonical fixture or its supported alternate path. They should
  not — report immediately if they do.
- Implementing a beat appears to require deciding a presentational question. That is `plan-06` or
  `plan-07` work.
- A founding document and a decision-log entry conflict.

## Implementer Authority Boundaries

- Status verbs (`delivered`, `complete`, `superseded`, `parked`) belong to the orchestrator and owner.
- The implementer may not declare the packet, the feature, or the product complete. "Ready for
  orchestrator review: yes/no" is the bounded handoff statement.
- The implementer reports against the objective, mapping evidence to requirements so a reviewer can
  confirm each claim without re-running everything.

## Advisor Consultation

Inherited from `AGENTS.md`. This packet has a real behavioral surface, so a "not warranted"
declaration would be non-compliant. Record a full disposition or a named degraded mode.

## Commit and Concurrency Guidance

- Stage by explicit path; never `git add -A`; never push.
- Concurrency mode A.
- On `index.lock: File exists`, wait and retry; never delete the lock.

## Progress Report

`reports/development/plan-05-instructional-engine-and-episode-state/progress.md`

Minimum contents: summary; mechanism proposal and approval reference; module map; requirement-by-
requirement evidence; commands run; validation results; problems; remaining risks; advisor disposition;
ready for orchestrator review yes/no.

---
id: plan-16
title: Computed Beat Schedule
status: delivered
depends_on: [plan-14]
gate: "Mechanism confirmation before source work: the schedule's shape, where it is computed, how beat-gated mounting and the leakage invariants key on it, and what happens to the registered definition identity and the replay envelope. Acceptance requires every existing route in the plan-14 matrix to pass with no route edited."
summary: >-
  Implement DECISION-034. Replace the fixed seven-beat arc with a beat schedule
  computed once at episode construction from the content instance and frozen,
  whose entries are beat instances (transform-left, transform-right) rather than
  beat names. A pure refactor: the canonical Phase 2 problem must produce exactly
  today's arc, proved by the plan-14 route matrix passing unedited. No new
  problem family ships here.
---

# Plan 16: Computed Beat Schedule

## Packet Metadata

- Packet id: `plan-16`
- Packet title: Computed Beat Schedule
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-29
- Packet type: migration (refactor, no learner-facing change)
- Mutation level: source, behavior-preserving
- Approval gate: mechanism confirmation; acceptance on the unedited route matrix
- Depends on: `plan-14` (the route matrix is the proof that behavior did not change)
- Expected artifacts: `src/interaction/` changes; renderer keying changes in `src/render/`; schedule tests; progress report

## Goal

**DECISION-034**: the episode arc becomes a schedule computed once from the problem. This packet does
the structural half and nothing else. When it lands, the canonical Phase 2 episode behaves exactly as
it does at the accepted Plan 12 implementation `51bdec7`, and the code can express a like-denominator arc with no `transform` and a nested
arc with one — without yet shipping either.

## Non-goals

- **No new problem family.** No like-denominator, nested, subtraction, or crossing-one-whole episode
  ships here. The episode machine may *accept* a schedule it cannot yet reach; it must not *offer* one.
- **No learner-facing change of any kind** — no string, layout, focus, timing, or condition change.
- **No adaptive behavior.** The schedule never responds to learner actions (DECISION-034 point 2).
- **No new decisions.** If the refactor seems to need one, report it.

## Depends on

`plan-14` complete. This is the refactor the route matrix was built to make safe: 27 browser-driven
routes, each checked through mounted controls with a real gesture, with negative controls that fail if
two conditions collapse into one. **If every route passes without being edited, the refactor preserved
behavior.** If a route must change to pass, it did not.

It does not depend on `plan-12`, but both touch `src/render/beat-container.js` and
`src/render/linear-path.js`. They must not run in parallel in one checkout, and whichever lands second
rebases onto the first. See Commit and Concurrency Guidance.

## Why this packet exists

The arc is hardcoded in three ways, all visible in the current source:

- **As data.** `EPISODE_BEATS` in `src/interaction/episode-definition.js` is a frozen list of seven
  names, embedded in the registered definition as `beats: EPISODE_BEATS`.
- **As an identity check.** `src/interaction/episode.js:138` rejects a registered definition whose
  `beats` do not equal `EPISODE_BEATS`.
- **As transitions.** Successors are named inline — `completedBeat(state, 'decide', established,
  'transform')` at `:342`, `completedBeat(state, 'transform', establishedConversions, 'operate')` at
  `:373` — and the two conversions are the same `transform` beat entered twice, with the side carried
  as implicit state.

The `plan-10` reach assessment showed what that costs: a like-denominator learner would be asked to
choose a common denominator the problem already has, then enter two conversions that change nothing.
Every Phase 3 family after the canonical one needs a variable arc, and DECISION-034 says to build it
once, alone, under a green witness matrix, before any new content arrives to confuse the diagnosis.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — **DECISION-034**, and DECISION-014, 021, 026 especially
- `docs/open-questions.md` — OQ-26 and the recommendation DECISION-034 adopted
- `docs/development/phase-3-generalization-design/grammar-reach-assessment.md` — Families 1, 3, 4
- `reports/development/plan-05-instructional-engine-and-episode-state/` — the replay-envelope and
  registered-definition-identity contract this packet must not break
- `reports/development/plan-14-reachable-behavior-route-contract/delivery-review.md`
- `tests/routes/route-matrix.json` and `scripts/dev/run-route-matrix.js`

Contracts this packet must preserve:

- **Behavior identity for the canonical instance.** Same beats, same order, same prompts, same
  mounts, same recovery, same focus behavior — including Plan 12's accepted Done-looking focus repair
  on both paths. No known focus-defect marker remains in the acceptance baseline.
- **The Separation Rule** — `mathematical state → instructional state → presentation`.
- **No history in the scene.** The schedule is configuration, not a record. `SCENE_HISTORY_KEYS` and
  `assertNoSceneHistory` hold, and the schedule must not be derivable only from response history.
- **The replay envelope still reconstructs exactly** (`plan-05`). A replay recorded before this packet
  must reconstruct after it, or the packet must say precisely why it cannot and propose a revision
  path at the gate.
- **DECISION-014 beat-gated mounting** and **all nine scaffold-leakage invariants** hold, keyed on
  schedule position.
- **`src/math/` and `src/content/` unchanged.**

## Scope

### In scope

- `src/interaction/episode-definition.js`, `src/interaction/episode.js` — the schedule, its
  computation from the instance, and schedule-driven transitions.
- `src/interaction/scene.js` — only as far as the scene must expose the current schedule entry.
- `src/interaction/provenance.js` — only to add schedule-position/entry identity to response
  provenance while preserving its existing semantic fields, as approved at Requirement 0.
- `src/render/beat-container.js`, `src/render/linear-path.js` — only the changes needed to key on a
  schedule entry rather than a beat name.
- Unit tests for schedule computation, including schedules the app cannot yet reach.
- Frozen pre-refactor replay fixtures and compatibility tests for the Requirement 0 legacy oracle.

### Out of scope

- `src/math/`, `src/content/`, `src/app/` — no changes.
- Any edit to `tests/routes/route-matrix.json`. **The matrix is the acceptance instrument; editing it
  voids the proof.** If a route seems to need changing, stop and report.
- Any further Inspection Mode focus work. Preserve Plan 12's accepted focus behavior exactly.
- Offering any non-canonical schedule to a learner.

## Implementation Requirements

### Requirement 0 — Mechanism confirmation (gate)

**Propose and stop.** Before writing source:

1. **The schedule's shape** — what an entry is, how `transform-left` and `transform-right` are
   represented, and what computes the schedule from an instance.
2. **Where it is computed and held** — at construction, frozen, and how it is carried in state
   without becoming history.
3. **The registered definition and the replay envelope.** `beats: EPISODE_BEATS` is part of the
   registered definition, and `episode.js:138` checks it. Does the definition carry a schedule, a
   schedule *rule*, or nothing? Does its revision change? What happens to a replay recorded at
   `b654487`? This is the question most likely to be answered wrongly by default.
4. **Keying** — how beat-gated mounting, the leakage invariants, the completed-beats summary, and
   replay provenance move from beat name to schedule position.
5. **The three schedules the code will be able to express** — canonical (both renamed), one renamed,
   none renamed — written out entry by entry, even though only the first is reachable.

### Requirement 1 — The schedule

Requirement 0 was approved by the orchestrator on 2026-09-30 with the binding constraints in
`reports/development/plan-16-computed-beat-schedule/mechanism-review.md`. Source work may proceed
within that approved mechanism; stop if its definition or replay compatibility cannot be preserved.

Required behavior:

- Computed once at episode construction, from the content instance, and frozen.
- Never recomputed or modified during an episode, by any path. A test must prove a learner action
  cannot change it.
- `transform-left` and `transform-right` are explicit entries.

### Requirement 2 — Transitions follow the schedule

Required behavior:

- Every successor beat comes from the schedule. No inline beat names remain in transition calls.
- The canonical instance traverses exactly `encounter → notice → decide → transform-left →
  transform-right → operate → resolve → reflect`, with `reflect` as selective as it is now.

### Requirement 3 — Unreachable schedules are tested, not offered

Required behavior:

- Unit tests construct the one-renamed and none-renamed schedules from synthetic instances and assert
  their entries.
- The episode machine still refuses non-canonical content for learners, exactly as
  `UNSUPPORTED_CONTENT_FAMILY` does today. **A schedule that can be computed is not a family that
  ships** — conflating the two is the `plan-09` failure in its original form.

### Requirement 4 — The proof

Required behavior:

- `npm run test:routes` reports **27 passed, 0 known defects, 0 failed**, identical to the accepted
  Plan 12 implementation `51bdec7`, with `tests/routes/route-matrix.json` byte-identical to that revision.
  Its SHA-256 is `ef56b30ed99fd641fa185d7b788552f64ce034865cf474854616e723d4659891`.
- Both repaired focus rows retain their first-choice assertions. If the refactor changes focus
  behavior, that is a stop condition, not an opportunity for a new focus repair.
- `npm test` passes; the leakage suite passes unmodified in its assertions.
- A replay recorded before the refactor reconstructs after it, or the gate-approved alternative holds.

## Validation Checklist

- [ ] Mechanism proposal, including the replay-envelope answer, approved before source work.
- [ ] Schedule computed once from the instance, frozen, provably unchangeable by learner action.
- [ ] No inline successor beat names remain.
- [ ] One-renamed and none-renamed schedules unit-tested; still unreachable by learners.
- [ ] `tests/routes/route-matrix.json` byte-identical to `51bdec7`, with the Requirement 4 SHA-256.
- [ ] `npm run test:routes`: 27 passed, 0 known defects, 0 failed.
- [ ] Leakage invariants and scene-history guards pass unmodified.
- [ ] Replay reconstruction holds across the refactor, or the approved alternative is implemented.
- [ ] No changes to `src/math/`, `src/content/`, or `src/app/`.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at `reports/development/plan-16-computed-beat-schedule/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- Any route in the matrix fails, or seems to need editing, after the refactor.
- Either repaired focus row regresses, or any accepted entry/session route changes behavior.
- Replay reconstruction cannot be preserved and no clean revision path exists.
- A leakage invariant cannot be re-keyed without weakening its assertion.
- The schedule appears to need learner history to compute.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- **The implementer may not declare the refactor behavior-preserving on the strength of passing unit
  tests.** The unedited route matrix is the evidence. Unit tests were green through all four of
  `plan-09`'s unreachable mechanisms.
- Any claim about focus, layout, or visibility comes from the browser runner with real gestures.

## Advisor Consultation

Inherited from `AGENTS.md`. A structural change to the instructional engine that every later packet
builds on; record a consultation disposition or a justified thread-specific degraded mode under the
guide's capability rules.

## Commit and Concurrency Guidance

Stage by explicit path; never `git add -A`. **Never push without explicit owner authorization.**
Mode A. Never delete a lock file.

**`plan-12` and this packet both edit `src/render/beat-container.js` and `src/render/linear-path.js`.**
They must not share a checkout while both are in flight. Whichever lands second rebases onto the
first. Plan 12 is now accepted; this packet starts from its current entry/session composition and
repaired focus routes. The proof is the **27-route** baseline in Requirement 4, not the former
20-route matrix or its retired known defect.

## Progress Report

`reports/development/plan-16-computed-beat-schedule/progress.md`

Minimum contents: summary; the approved schedule shape; the replay-envelope outcome; the three
expressible schedules written out; route-matrix output verbatim, with the matrix hash compared to its
baseline; commands; problems; remaining risks; advisor disposition; ready for orchestrator review
yes/no.

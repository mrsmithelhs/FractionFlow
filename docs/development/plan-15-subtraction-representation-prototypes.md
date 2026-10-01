---
id: plan-15
title: Subtraction Representation Prototypes
status: delivered
depends_on: [plan-14]
gate: "Mechanism confirmation before any source work: where the prototypes live, how they reach the real mathematics without touching the episode machine, and the draft register entry. Then owner review of both prototypes on rendered screens. This packet produces evidence for OQ-25; it does not answer it, and neither prototype may be declared preferred."
summary: >-
  Build two reviewer-facing prototypes of fraction-bar subtraction — takeaway
  (segments removed from the minuend) and comparison (both quantities shown,
  the gap between them marked) — on a standalone surface outside the learner
  app, driven by the real exact-arithmetic core. Both are learner-operable, not
  pictures. The deliverable is something the owner and students can use and
  react to, so that OQ-25 is settled by observation rather than by prose.
---

# Plan 15: Subtraction Representation Prototypes

## Packet Metadata

- Packet id: `plan-15`
- Packet title: Subtraction Representation Prototypes
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-29
- Packet type: prototype
- Mutation level: user-facing, reviewer-only surface (the learner app is unchanged)
- Approval gate: mechanism confirmation; then owner review of both prototypes on rendered screens
- Depends on: `plan-14` (both prototypes are witnessed by the route matrix — a prototype nobody can reach is the Phase 2 failure in a new place)
- Expected artifacts: a standalone prototype surface with two representations; a draft prototype-variable register entry; an observation guide; route-matrix rows; progress report

## Goal

Four of Roadmap §27's eight Phase 3 families are subtraction, and the fraction bar cannot represent
subtraction at all. **OQ-25** asks how it should, and the `plan-10` dossier gave the only honest answer
available on paper: *"We cannot know which representation is pedagogically effective for children
without building and observing prototypes of both. Asserting that one is superior in specification
prose is guesswork."*

This packet builds both, so the question can be answered by watching people use them.

## Non-goals

- **No subtraction in the learner app.** `src/interaction/` stays addition-only; the episode machine
  still throws `UNSUPPORTED_CONTENT_FAMILY` on a subtraction instance. Full subtraction episodes need
  the computed beat schedule of OQ-26 and are a later packet.
- **No decision on OQ-25.** The deliverable is evidence. Neither representation may be called better,
  calmer, or recommended in code, copy, or report.
- **No new beats, no scaffolding, no support levels, no replay.**
- **No authored recovery pedagogy** beyond the single plain retry message named in Requirement 3.
- **No deployment without owner authorization.** Building the prototype surface is in scope; publishing
  it is the owner's call, per standing constraints.
- **No new decisions.** Report any the work exposes.

## Depends on

`plan-14` complete. Two prototypes that render the same thing, or one that nothing can reach, would
reproduce `plan-09`'s central failure in a surface built specifically to compare alternatives. The
route matrix is how "these two differ" becomes a checked fact.

**Not** OQ-26. A standalone prototype surface does not need the episode machine, so it does not need
the beat schedule settled.

## Why this packet exists

The `plan-10` reach assessment captured the problem concretely. The Phase 2 grammar equates operation
with combination: `strings.operate.prompt` is *"Add the shaded parts together."*, the input label is
*"Total shaded parts out of N:"*, and the renderer draws only positive shaded quantities. Given `4/7`
and `1/7`, it draws two co-present addends — **which misrepresents subtraction rather than merely
failing to show it.**

The two candidates embody different ideas of what subtraction *is*:

- **Takeaway** — one quantity, from which part is removed. `4/7 − 1/7`: four shaded sevenths, one
  removed, three remain.
- **Comparison** — two quantities, and the distance between them. `4/7 − 1/7`: four sevenths above one
  seventh, the three-seventh gap marked.

These are not styling alternatives. They teach different meanings, and they are likely to behave
differently with unlike denominators, where the learner must rename before either action makes sense.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-004, 009, 010, 013, 021, 025, 032 especially
- `docs/open-questions.md` — **OQ-25**, and OQ-26 for why the learner app is out of scope
- `docs/development/phase-3-generalization-design/grammar-reach-assessment.md` — Families 2 and 4, and
  §5 "Honest Reach Limits"
- `docs/development/phase-2-first-slice-design/prototype-variable-register.md` — the shape a register
  entry takes
- `docs/founding/05-quality-and-validation.md` §52 — what observation evidence may and may not be
- `reports/development/plan-14-reachable-behavior-route-contract/delivery-review.md`

Contracts this packet must preserve:

- **The mathematics comes from `src/math/`.** Differences are computed by `subtractFractions` and
  `subtractAtCommonDenominator`; renaming by the existing equivalence functions. A prototype with its
  own arithmetic would produce evidence about a different product.
- **The learner app is unchanged.** No imports from the prototype surface into `src/app/`, no link to
  it from the learner app, nothing in the learner bundle that exists for the prototype's sake.
- **DECISION-021 in full.** Learner-triggered transitions, no auto-advance, endpoints inspectable
  indefinitely, grade 2–3 register, no specification terms on screen.
- **The participation floor.** Keyboard-completable, no required drag (DECISION-013), 24×24px targets
  (DECISION-025), reduced-motion parity with a meaningful non-motion indication.
- **Length conservation** (DECISION-032's reasoning applies): a seventh is the same width everywhere on
  the screen, in both prototypes.
- **Fixtures stay synthetic** (§52).

## Scope

### In scope

- A **standalone prototype surface** — a separate page and entry point, reviewer-facing, outside the
  learner app. Its location and build wiring are a Requirement 0 proposal.
- Two representations of subtraction, each **learner-operable**.
- A small, fixed fixture set (Requirement 2).
- A **draft prototype-variable register entry** for subtraction representation, proposed under the id
  `SUB-01` by analogy with `CM-01`. The orchestrator records it; the implementer proposes it.
- A short **observation guide** for the owner and any students who try the prototypes.
- **Two route-matrix rows**, one per prototype, each the other's negative control. Extending
  `startingSurface` with a prototype entry point is in scope.

### Out of scope

- `src/interaction/`, `src/app/`, and the learner-facing renderers — no changes. If a prototype seems to
  need an episode-machine change, **stop and report**; that is OQ-26's territory.
- `src/math/` — no changes. If the mathematics seems insufficient, that is a finding.
- Deployment.

## Implementation Requirements

### Requirement 0 — Mechanism confirmation (gate)

**Propose and stop.** Before writing source:

1. **Where the prototypes live** — path, build entry, and how they stay out of the learner bundle.
   A second Vite entry is the expected shape; say what you propose and why.
2. **How they reach the real mathematics** without the episode machine — which `src/math/` functions,
   called how, and what the prototype holds as its own state.
3. **What the learner does in each prototype**, step by step, for a like-denominator and an
   unlike-denominator fixture. This is the substance of the comparison, so it must be concrete.
4. **The draft `SUB-01` register entry**: live rivals, falsification observations, what is manipulated
   and held constant, outcome measures, and a conclusion rule — in the register's existing shape.
5. **The 360px cost** of each prototype at its tallest state, against 360×740 and 360×752.

### Requirement 1 — Two prototypes, each operable

Requirement 0 was approved by the orchestrator on 2026-10-01 with binding clarifications in
`reports/development/plan-15-subtraction-representation-prototypes/mechanism-review.md`.
This clears source work within that mechanism; rendered-screen acceptance remains owner-gated.

Required behavior:

- **Takeaway:** the minuend is shown; the learner acts to remove the subtrahend's parts; the remaining
  parts are the difference. The removal is visible and learner-triggered.
- **Comparison:** both quantities are shown aligned on the same whole; the learner acts to reveal or
  mark the difference; the gap is the difference.
- In both, the learner **enters the result**. A prototype the learner only watches is a picture, and a
  picture cannot tell you which representation helps someone subtract.
- Both prototypes render the same fixtures, so they can be compared problem for problem.

Constraints:

- The removed parts in takeaway must remain inspectable — dimmed or marked, not deleted — so that the
  learner can see what was removed as well as what remains. A representation that erases the evidence
  of the operation cannot be checked afterwards.
- Neither prototype may state the difference before the learner supplies it (DECISION-032 constraint 3
  applies by analogy).

### Requirement 2 — A fixed fixture set that probes the difference

Required behavior — synthetic fixtures, at minimum:

| kind | example | why |
|---|---|---|
| like denominators | `4/7 − 1/7` | the case where both representations are simplest |
| nested denominators | `5/6 − 1/3` | one operand must be renamed before either action is meaningful |
| unlike denominators | `3/4 − 1/3` | both must be renamed; tests whether each representation survives renaming |
| small difference | `5/8 − 1/2` | a one-part result, where the comparison gap is narrow and takeaway leaves little |

For the renaming cases, the prototype may present the operands already renamed to the common
denominator, with the original form shown. Asking the learner to perform the renaming is the existing
grammar's job and is out of scope here; say which you chose and why.

### Requirement 3 — Minimal, honest feedback

Required behavior:

- A correct result is acknowledged plainly.
- An incorrect result produces one plain retry message and does not reset the problem.
- That is all. Authored subtraction recovery pedagogy is a later packet and depends on which
  representation wins.

### Requirement 4 — Route witnesses

Required behavior:

- One route-matrix row per prototype, reaching a completed like-denominator problem through mounted
  controls with a real gesture.
- **Each prototype is the other's negative control.** Two prototypes that render identically must fail.
- Browser witness; 360×740; standard and reduced motion.

### Requirement 5 — An observation guide

Required behavior:

- A one-page guide for the owner and for students trying the prototypes: what to try, and three or four
  behaviors worth noticing, aligned to `05-quality-and-validation.md` §52 — where people hesitate,
  whether they understand what a control does, whether they can say what the result means.
- It asks about behavior, not preference. "Which did you like?" is the wrong question and must not
  appear.
- It states plainly that responses are design evidence, not an efficacy claim, and repeats the §52
  handling rules.

## Validation Checklist

- [ ] Mechanism proposal reported and approved before source work.
- [ ] Both prototypes learner-operable, with the learner entering the result.
- [ ] All four fixture kinds render in both prototypes.
- [ ] Mathematics computed by `src/math/`; no prototype arithmetic.
- [ ] Takeaway leaves removed parts inspectable.
- [ ] Neither prototype states the result before the learner supplies it.
- [ ] Learner app unchanged: no `src/app/`, `src/interaction/`, or learner-renderer diffs, and nothing
      added to the learner bundle.
- [ ] Participation floor verified in a browser with real gestures, both prototypes.
- [ ] 360px measured at the tallest state of each prototype, against 360×740 and 360×752.
- [ ] Two route rows, each the other's negative control; `npm run test:routes` green.
- [ ] Draft `SUB-01` register entry and observation guide exist.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at
      `reports/development/plan-15-subtraction-representation-prototypes/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- Either prototype appears to need the episode machine, a beat change, or `src/interaction/`.
- The mathematics core appears insufficient for any fixture.
- Keeping the prototypes out of the learner bundle appears to require changing `src/app/`.
- Either representation cannot preserve length conservation at 360px for the fixture set.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- **The implementer may not declare either representation preferred, clearer, or more effective.** Not
  in the report, not in the observation guide, not in a code comment. That is precisely the claim this
  packet exists to stop anyone making on paper.
- Layout, focus, and visibility claims come from a browser **with a real gesture**. A programmatic
  `.click()` does not move focus and has already let one focus defect through two layers of review.

## Advisor Consultation

Inherited from `AGENTS.md`. New user-facing surface; record a full disposition or a named degraded
mode.

## Commit and Concurrency Guidance

Stage by explicit path; never `git add -A`. **Never push without explicit owner authorization.**
Mode A. Never delete a lock file.

**This packet edits `tests/routes/route-matrix.json`, and so does `plan-12`.** If the two run at the
same time they must not share a checkout, and whichever lands second rebases its rows onto the first.

## Progress Report

`reports/development/plan-15-subtraction-representation-prototypes/progress.md`

Minimum contents: summary; where the prototypes live and how they stay out of the learner bundle; what
the learner does in each, per fixture; the draft `SUB-01` entry; the observation guide; 360px
measurements; route-matrix results; commands; problems; remaining risks; advisor disposition; ready for
orchestrator review yes/no.

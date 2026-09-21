---
id: plan-14
title: Reachable Behavior Contract and Browser Route Matrix
status: draft
depends_on: [plan-09]
gate: "Mechanism confirmation before implementation: the route-matrix schema and the harness's starting-surface rule are proposed and approved before any route is written. Final acceptance requires the harness to catch a deliberately seeded unreachable-behavior defect and a deliberately seeded identical-output defect."
superseded_by: null
resolution: null
summary: >-
  Turn the Phase 2 diagnosis into an executable artifact. Every learner-visible
  behavior the project claims gets a route witness: a registered configuration, a
  permitted starting surface, a concrete action sequence through mounted app
  controls, the expected observable difference, and a negative control proving the
  behavior is not permanently on or identical to its alternative. Fails when a
  registered condition has no route witness, or when a route produces the same
  output as the alternative it claims to differ from.
---

# Plan 14: Reachable Behavior Contract and Browser Route Matrix

## Packet Metadata

- Packet id: `plan-14`
- Packet title: Reachable Behavior Contract and Browser Route Matrix
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-21
- Packet type: tooling
- Mutation level: scripts / tests (no learner-facing behavior change)
- Approval gate: mechanism confirmation before implementation; acceptance requires two seeded-defect catches
- Depends on: `plan-09` (the behaviors to be witnessed must exist and be owner-accepted)
- Expected artifacts: route-matrix data file; browser-backed harness; seeded-defect evidence; progress report

## Goal

`plan-09` shipped **four mechanisms that were built, tested, and reachable by no learner**, recorded in
`reports/orchestration/phase-2-unreachable-mechanisms.md`. Each had a registry entry, passing tests, and
an authored string. None had a path. The repairs that followed were found by driving the running
application, one at a time, by hand.

This packet makes that check an artifact instead of a habit. It does not add learner-facing behavior;
it makes the project able to prove that behavior it already claims is reachable, and able to notice
when a refactor returns a mechanism to dead code.

## Non-goals

- **No generic end-to-end test suite.** This is not "add Playwright coverage." It witnesses declared
  behaviors and nothing else.
- **No new learner-facing behavior**, no content, no conditions, no strings.
- **No replacement of the existing test suite.** The 244 unit and contract tests stay and keep their
  job. This harness answers a different question.
- **No child-usability simulation.** A route witness proves a path exists, not that anyone understands
  it.
- **No testing-framework side project.** If the harness starts growing features nobody asked for,
  stop and report.

## Depends on

`plan-09` complete and owner-dispositioned at `b418e8a`. The four registered conditions, the replay
control, the recovery dispatch, the reduced-motion path, and the linear path all exist and are the
first subjects of the matrix.

## Why this packet exists

The Phase 2 record is unambiguous about the failure mode and about what caught it.

The condition switcher had a valid registry, condition state carried in the replay envelope, and a
green suite — while all three conditions rendered **byte-identically**. Nothing in the test suite could
see it, because no test compared one condition's output to another's. The recovery dispatch rendered
`"Not quite."` for every transform and operate error, and the suite passed, because the classifier's
produced kinds and the renderer's checked kinds were two independently correct lists that did not
intersect. `mock-dom.js` could not express `document.hidden`, so a focus guard that disabled itself in
any backgrounded tab passed the harness and failed the browser.

The common shape: **a component was verified; a route was not.** A negative control — "this
configuration must differ from that one" — would have caught the first two immediately, and a browser
witness would have caught the third.

`plan-11`, `plan-12`, and `plan-13` each promise behavior whose whole value is that a learner or
reviewer can reach it. Each depends on this packet so that the promise is checkable rather than
restated.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-006, 009, 010, 013, 014, 019, 021, 025 especially
- `reports/orchestration/phase-2-unreachable-mechanisms.md`
- `reports/orchestration/plans-10-13-codex-review.md` — §1 and §4, which specify this packet
- `reports/development/plan-09-app-shell-condition-switcher-and-acceptance/` — `repair-03-review.md`,
  `repair-06-item-1-review.md`, and `focus-restore-review.md`, which are the three worked examples
- `tests/fixtures/mock-dom.js` — and its limits

Contracts this packet must preserve:

- **No learner-facing behavior changes.** If a route witness cannot be written without changing
  application behavior, that is a finding: **stop and report** rather than adjusting the app to fit
  the harness.
- **The Separation Rule.** The harness observes; it does not provide state to the application.
- **No test artifacts in the deployed build.** No hooks, no globals, no data attributes added solely
  for the harness that ship to a learner. If an observable seam is genuinely required, propose it at
  the mechanism gate.
- **Fixtures stay synthetic** (`05-quality-and-validation.md` §52).

## Scope

### In scope

- A declarative **route matrix** data file enumerating witnessed behaviors.
- A **harness** that executes each row against the mounted application in a real browser and asserts
  the declared observable difference and negative control.
- Route rows for the behaviors `plan-09` already ships (see Requirement 3).
- Two deliberately seeded defects, used once to prove the harness works, then reverted.
- Whatever npm script or CI wiring runs it.

### Out of scope

- `src/math/`, `src/content/`, `src/interaction/`, `src/render/`, `src/app/` — no changes. This packet
  observes the application; it does not modify it.
- Visual regression / screenshot diffing.
- Performance measurement.

## Implementation Requirements

### Requirement 1 — The route-matrix schema (mechanism gate)

**Propose and stop.** Before writing routes, propose the schema and the starting-surface rule for
orchestrator approval. Each row must carry at least:

| field | purpose |
|---|---|
| `behavior` | the learner-visible thing being claimed |
| `configuration` | the registered condition / support level / mode it requires, by its real registered id |
| `startingSurface` | where the route begins — a permitted app entry point, never a direct factory call or injected state |
| `actions` | the concrete ordered sequence a reviewer performs through mounted controls |
| `expect` | the observable output or semantic state that must result |
| `negativeControl` | the configuration or path that must **not** produce the same output |
| `witness` | `browser` or `harness`, with browser required for any layout, focus, visibility, or motion claim |
| `viewport` / `motionMode` | named, not assumed |

The proposal must also state the **starting-surface rule**: what counts as a legitimate entry point.
Driving the app by dispatching actions to a mounted app is acceptable where a control does not exist
for a step; constructing a scene or renderer directly is not. Say where the line falls and why.

### Requirement 2 — The harness enforces, rather than reports

Required behavior:

- The harness **fails** when a row's `expect` is not observed.
- The harness **fails** when a row's output is identical to its `negativeControl`'s output. This is the
  check that would have caught the byte-identical conditions.
- The harness **fails** when a registered configuration has no row. Registration without a witness is
  the exact `plan-09` failure and must be an error, not an omission.
- `not run`, a skipped row, or a row whose witness is a narrative description is a **failure**, not a
  pass.

Constraints:

- Browser witnesses run against the built application, not against a component in isolation.

### Requirement 3 — Seed the matrix with what already ships

Required behavior — a row for each, at minimum:

- Each of the four registered conditions produces a distinct rendered structure at a conversion beat,
  each with the other three as negative controls.
- Replay produces a visible difference in each condition, or the row records honestly that it does
  not — under *Compare before and after* and *Step-by-step change* the current answer is a highlight
  and a text change only, and the matrix should say so rather than flatter it.
- Recovery: at least one wrong answer at `transform` and one at `operate` produce **different**
  messages from each other, with a shared-generic-message negative control.
- The premise check completes on the correct answer and does not complete on the reassuring-but-wrong
  answer, on both routes.
- Reduced motion reaches the same states with the same meaning.
- The linear path completes every decision the visual path does.
- Focus survives a replay at an interactive beat, and returns to the choice group on leaving
  Inspection Mode — browser witness, since the harness demonstrably cannot see this.

### Requirement 4 — Prove the harness with seeded defects

Required behavior:

- Seed an **unreachable-behavior defect**: unregister or orphan a configuration so it has no route.
  The harness must fail, naming it.
- Seed an **identical-output defect**: make two conditions render the same thing. The harness must
  fail on the negative control.
- Capture both failures verbatim, then revert both seeds and show the suite green.

Constraints:

- Seeds are reverted before delivery. The tree is clean and no seed survives in any branch handed over.

## Validation Checklist

- [ ] Schema and starting-surface rule proposed and approved before routes were written.
- [ ] Route matrix exists as data, separate from the harness that executes it.
- [ ] Harness fails on a missing `expect`, on an identical `negativeControl`, and on a registered
      configuration with no row.
- [ ] Every behavior in Requirement 3 has a row; browser witness used for every layout, focus,
      visibility, and motion claim.
- [ ] Both seeded defects caught, captured verbatim, and reverted.
- [ ] No changes to `src/`.
- [ ] Nothing added to the deployed build for the harness's benefit.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at
      `reports/development/plan-14-reachable-behavior-route-contract/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- A route witness cannot be written without changing application behavior or adding a shipped seam.
- The starting-surface rule cannot be drawn without permitting direct component construction.
- A behavior `plan-09` claims turns out to have no route. **That is a finding, not a blocker to work
  around** — report it before repairing it.
- The harness starts to require infrastructure disproportionate to the project.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- **The implementer may not declare a behavior reachable on the strength of the row existing.** The row
  is the claim; the passing browser witness is the evidence.
- **A green harness is not a claim that the project is free of unreachable mechanisms.** It covers
  declared behaviors only, and the declaration is the fallible part.

## Advisor Consultation

Inherited from `AGENTS.md`. Tooling with no learner-facing surface, but directly load-bearing for
every later packet's evidence; record a full disposition or a named degraded mode.

## Commit and Concurrency Guidance

Stage by explicit path; never `git add -A`. **Never push without explicit owner authorization.**
Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-14-reachable-behavior-route-contract/progress.md`

Minimum contents: summary; the approved schema and starting-surface rule; the route matrix's rows and
what each witnesses; the two seeded-defect failures verbatim and their reversion; what the harness
cannot see; commands; problems; remaining risks; advisor disposition; ready for orchestrator review
yes/no.

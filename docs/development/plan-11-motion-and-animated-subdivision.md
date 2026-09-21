---
id: plan-11
title: Motion and Animated Subdivision
status: draft
depends_on: [plan-09]
gate: "Owner reviews the motion against DECISION-021 criterion 4 on rendered screens at the deployed URL. Motion is a prototype variable (D-01, D-02); this packet may not convert it into a settled default."
superseded_by: null
resolution: null
summary: >-
  Build D-01-A, the animated subdivision that Phase 2 promised and never
  implemented. Restore the parked "Smooth change" condition label, give
  DECISION-021 criterion 4 and the reduced-motion participation-floor row real
  content to be tested against, and keep the whole thing learner-triggered with
  no auto-advance in any motion mode.
---

# Plan 11: Motion and Animated Subdivision

## Packet Metadata

- Packet id: `plan-11`
- Packet title: Motion and Animated Subdivision
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-21
- Packet type: feature
- Mutation level: user-facing release
- Approval gate: owner review of the motion on rendered screens against DECISION-021 criterion 4
- Depends on: `plan-09` (the display conditions, replay, and reduced-motion suppressors it extends)
- Expected artifacts: `src/render/` and `src/styles/` changes; restored condition label; evidence of reduced-motion parity that means something; progress report

## Goal

Close the last outstanding presentation promise from Phase 2. `D-01-A` — animated subdivision, where
the bar's parts visibly subdivide rather than being replaced — was registered as a prototype variable,
carried through four packets, and never built. Bundle 1's learner-facing label was relabelled from
*"Smooth change"* to *"New parts only"* during `plan-09` Repair 04 specifically so the label would
stop describing something that did not exist, with the original wording preserved in a code comment
for restoration here.

## Non-goals

- **No new beats, no new problem families, no content changes.**
- **No motion anywhere else.** Beat transitions, recovery messages, and milestone lines do not animate.
- **No settled default.** D-01 and D-02 remain prototype variables; this packet makes the animated arm
  real so it can be compared, not preferred.
- **No auto-advance**, no timed dismissal, no motion the learner did not trigger.
- **No new decisions.** If the work exposes one, report it.

## Depends on

`plan-09` complete. The condition registry, the three choreography treatments, the replay mechanism,
and the reduced-motion suppressors in `src/styles/render.css` all already exist; this packet gives the
first of them something to animate.

## Why this packet exists

Three things in the accepted Phase 2 evidence are weaker than they look, and all three have the same
cause:

1. **DECISION-021 criterion 4** — "calm pacing and anchored inspection" — passed against an app with
   almost no motion to pace. The criterion is about restraint under motion, and it has not yet been
   tested under any.
2. **The reduced-motion participation-floor row** passed for a cheap reason. In the owner's words:
   *"there was no motion to see before, there still isn't, but the app does the same thing."* Parity
   between a static path and a static path is not evidence.
3. **`fraction-bar.js` rebuilds every segment on every render** (`rootEl.replaceChildren()`), and
   `.subdivided` has no CSS rule at all. The renderer is structurally incapable of animating a
   subdivision today, so the gap is real rather than cosmetic.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-009, 010, 013, 021 especially
- `docs/founding/02-interaction-grammar.md` §§ on transformation and replay
- `docs/presentation-posture.md`
- `docs/development/phase-2-first-slice-design/prototype-variable-register.md` — D-01, D-02
- `reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-06-review.md` —
  Condition A, which governs this packet in full

Contracts this packet must preserve:

- **DECISION-021 criterion 4.** Transitions are learner-triggered, calm, spatially anchored in the
  stable whole, and endpoints remain **inspectable indefinitely without auto-advancing**. No timers
  govern content in any motion mode. This is the contract most at risk here and it is not negotiable.
- **Full semantic parity under `prefers-reduced-motion: reduce`** — the same reachable states, the
  same meaning, no information carried only by motion.
- **The Separation Rule.** Animation is presentation. It reads `transition.pre` / `transition.post`
  from the scene; it does not introduce state, and it does not enter the scene.
- **Conditions are selected upstream** (DECISION-006).
- **Target size does not shrink** (DECISION-025).

## Scope

### In scope

- `src/render/fraction-bar.js` — a rendering path that can transition from `pre` parts to `post` parts
  without rebuilding the element, for the in-place choreography only.
- `src/styles/render.css` — the subdivision animation and its reduced-motion suppression.
- `src/render/strings.js` — restore bundle 1's label from the preserved comment, or author a better
  one; the label must describe what the condition now actually does.
- `src/app/conditions.js` — only if the restored arm needs a registry change.
- Tests covering the reachable states and the reduced-motion equivalence.

### Out of scope

- `src/math/`, `src/content/`, `src/interaction/` — no changes. If the animation appears to need
  interaction-layer state, **stop and report**; that is a Separation Rule finding.
- The juxtaposed and sequential choreographies. They are static by design and stay as they are.
- Replay's behavior, beyond the animated arm participating in it as the other conditions do.

## Implementation Requirements

### Requirement 1 — Animated subdivision

Required behavior:

- Under the animated condition, a renaming visibly subdivides the existing parts within the same
  stable whole: the shaded length does not move, the part boundaries multiply.
- The whole's width and position are invariant across the transition. Quantity preservation is the
  thing the animation exists to show; if the bar rescales, it shows the opposite.
- The animation is triggered by the learner's submission and by replay, and by nothing else.
- Both endpoints are stable, inspectable states. The learner may stop at either indefinitely.

Constraints:

- No `setTimeout`, `setInterval`, or animation callback may change beat, mount state, or any content
  the learner reads. Focus deferrals of `0ms` are the only permitted timer use, matching the existing
  pattern.

### Requirement 2 — Reduced motion means something now

Required behavior:

- Under `prefers-reduced-motion: reduce`, the animated condition reaches the same post-state with no
  animation and retains a meaningful indication of what changed — the participation-floor row requires
  both halves.
- Demonstrate the parity by captured output at the same beat with motion on and off, showing the same
  reachable states and the same semantics, not merely the same final frame.

### Requirement 3 — The label describes the behavior

Required behavior:

- Bundle 1's learner-facing label and description are restored or rewritten so they describe what the
  condition does. The `plan-09` comment recording the original wording is removed once honored.
- The label passes DECISION-004: grade 2–3, concrete, no specification terminology.

### Requirement 4 — Layout cost

Required behavior:

- 360px measured at every beat where the animation can run, against a stated viewport height, at rest
  and mid-transition. A transition that pushes the active control below the fold is a failure.

## Validation Checklist

- [ ] Subdivision animates within an invariant whole; shaded length visibly preserved.
- [ ] Every transition learner-triggered; no timer governs content in any motion mode.
- [ ] Both endpoints inspectable indefinitely.
- [ ] Reduced-motion parity demonstrated by captured output at the same beat, both modes.
- [ ] Bundle 1's label describes the behavior; the parking comment is gone.
- [ ] 360px measured at rest and mid-transition, against a stated viewport height.
- [ ] Replay works in the animated condition as it does in the others.
- [ ] No changes to `src/math/`, `src/content/`, or `src/interaction/`.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at
      `reports/development/plan-11-motion-and-animated-subdivision/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- The animation appears to require interaction-layer or scene state.
- Preserving the invariant whole and animating the subdivision appear to be in conflict.
- Reduced-motion parity cannot be reached without a second code path that could drift.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- **The implementer may not declare the motion accepted, calm, or preferred.** D-01 remains a
  prototype variable; a working animated arm is the deliverable, not a recommendation that it wins.
- Verification claims about focus, layout, or visibility must come from a browser, not from the test
  harness. This is a standing lesson from `plan-09`.

## Advisor Consultation

Inherited from `AGENTS.md`. Real behavioral surface and a user-facing release; record a full
disposition or a named degraded mode.

## Commit and Concurrency Guidance

Stage by explicit path; never `git add -A`. **Never push without explicit owner authorization.**
Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-11-motion-and-animated-subdivision/progress.md`

Minimum contents: summary; how the subdivision is animated and why it preserves the whole; the
reduced-motion parity evidence; the restored label and its DECISION-004 basis; 360px measurements at
rest and mid-transition; commands; problems; remaining risks; advisor disposition; ready for
orchestrator review yes/no.

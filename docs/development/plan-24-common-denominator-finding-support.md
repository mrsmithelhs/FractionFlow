---
id: plan-24
title: Common Denominator Finding Support
status: draft
depends_on: [plan-13, plan-14, plan-22]
gate: "Requirement 0: investigate current help placement and propose one bounded learner-driven denominator-finding mechanism; stop before source work. Technical and owner rendered-screen/agency acceptance; deployment separately authorized."
superseded_by: null
resolution: null
summary: >-
  Add compact task-local assistance for finding a common denominator and
  understanding a selected unit, preserving learner decisions, mathematical
  validity, answer withholding and the repaired task capability boundary.
---
# Plan 24: Common Denominator Finding Support

## Packet Metadata

- Packet id: `plan-24`
- Packet title: Common Denominator Finding Support
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-10-06
- Packet type: feature
- Mutation level: instructional state / projection / learner presentation / tests
- Approval gate: investigation and mechanism, technical review, owner screen and agency acceptance
- Expected artifacts: bounded helper, discriminating routes, rendered evidence and progress report

## Goal, gap and dependencies

Help learners determine a common denominator, rather than only checking a number
they already know. High-support candidates do not teach discovery; medium-support
numeric entry and generic hints do not supply a concrete learner-driven process.
The existing app help control is in an aside after the visual and linear hosts,
so its presence does not prove useful placement near the active question.

Plans 13/14 supply reachable support profiles and route evidence. Plan 22 must
first close valid-but-unsupported denominator paths: assistance must not recommend
work that ends in a missing task. Preferred source order is the active Plan 11
enhancement handoff, Plan 22, then this packet before Plans 17/19. This is a planning
priority, not a new hard family dependency; confirm actual integration needs at
their mechanism gates. Plans 18/20 have different unit decisions. Plan 21 planning
and Plan 23 local tooling can proceed independently with disjoint write scopes.

## Authority, scope and non-goals

Read AGENTS.md, decision-log.md, development/README.md, founding instructional
model §§6–7 and Stage F, Roadmap §§19/21/28, Plan 22's accepted disposition,
`reports/orchestration/common-denominator-support-design-brief.md`, OQ-27 and
`phase-3-follow-up-obligations.md`. Preserve Decisions 035–040, exact arithmetic,
frozen schedule/support configuration, authored coverage and replay identity.

In scope: current canonical decide task, task-local assistance state and projection,
visual/linear controls, concise copy, tests/routes and evidence. Identify exact
files at the gate. Out of scope: new live families, general generation, adaptive
support, a standalone strategy lesson, automatic advance, persistence, deployment,
or a menu of three algorithms. Product-versus-smaller-multiple and nested examples
are investigation cases; they do not authorize learner reach here.

## Requirement 0 — Investigate, propose and stop

Run preflight. Inspect actual help behavior and measure its location relative to
the denominator question, choices/input and response control at 360×740 and
360×752, in visual and linear paths. Propose reuse/relocation of the existing help
action where feasible. Do not leave two competing Need help buttons for this task.
Show the proposed states and exact learner copy, with one first strategy and its
prerequisites. Compare guided multiples and product reasoning before choosing;
common factors are a means to finding a common multiple, not the target unit.

Specify meaningful learner contributions, local error recovery, closing/resuming,
focus, unsubmitted input preservation, assisted provenance, replay/reset and
definition compatibility. Put mathematical checks upstream of instructional state;
renderers only consume projected state. Prefer local substeps within decide; any
new top-level beat, math primitive or structural contract needs explicit approval.
Propose falsifying checks, then stop before source changes.

## Required behavior after mechanism approval

1. Put the help entry in the same task region, immediately beside or below the
   denominator response area. At the review viewports the question, response and
   help entry must be discoverable together. Evidence must show geometry and
   screenshots, not just that a selector exists. Revisit layout rather than
   squeezing text or touch targets if the proposed state does not fit.
2. Keep unaided work available. Requested help opens a compact local workspace:
   one short prompt and one learner decision at a time. Replace completed prompts
   instead of accumulating a recipe or transcript. Use short, concrete copy;
   avoid repeating the same explanation in directions, captions and feedback.
   No automatic help opening or extra permanent explanation paragraph.
3. Require the learner to contribute information not already supplied by the
   helper. Do not reveal complete matching lists, autofill/submit the denominator,
   or supply later equivalent numerators. Any late worked example must remain
   honestly assisted and preserve a subsequent meaningful learner action.
4. For high support, propose a compact selected-unit explanation/check using
   denominator relationships. Do not leak the upcoming conversion answers.
   Decide at the gate whether the explanation is optional or a brief local check;
   do not add a separate competing help system or mandatory long detour.
5. Preserve valid non-least units as valid. Distinguish arithmetic errors from
   valid-but-unsupported task paths under Plan 22; preserve the learner's ability
   to revise. Leastness is efficiency, not correctness. This packet does not claim
   independent denominator discovery merely because candidates were selected.
6. Opening/closing help preserves entered work. Keyboard, non-drag touch, linear
   access and reduced motion support the same decisions. Verify focus with real
   mounted gestures and no stale helper state after retry/return/re-entry.

## Work plan and validation

Investigate and obtain mechanism approval; implement only the approved mechanism;
run targeted and full validation; obtain the required read-only behavioral advisor
review; write the progress report and stop for delivery review.

- [ ] Required helper artifacts and `reports/development/plan-24-common-denominator-finding-support/progress.md` exist.
- [ ] Correct, wrong-multiple, one-sided and valid non-least responses exercise meaningful recovery.
- [ ] Supported paths complete and unsupported valid paths remain honest under Plan 22.
- [ ] Routes prove a learner contribution, no conversion-answer leak, retained input and fresh reset.
- [ ] Rendered evidence covers unaided, open help, recovery and selected-unit explanation; location and copy remain calm at both review viewports.
- [ ] Keyboard/touch/linear/reduced-motion participation is observed with limits stated.
- [ ] Unit tests, builds, browser routes, packet lint and diff check pass; witnesses include discriminating negative controls where needed.
- [ ] No unrelated files changed; the mechanism gate is honored.

The implementer may not change packet status or orchestrator/owner dispositions.
Stop on load-bearing policy or structural uncertainty. Stage explicit paths, never
push, and commit the progress report last. Record advisor disposition or degraded
mode and untested limits. Technical review and owner rendered-screen/agency
acceptance remain separate from publication. No efficacy claim or learner
observation is inferred from browser completion.

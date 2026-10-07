---
id: plan-25
title: Requested Equivalent Fraction Conversion Help
status: draft
depends_on: [plan-24]
gate: "Requirement 0: investigate current transform help and propose compact learner-driven conversion substeps; stop before source work. Technical and owner rendered-screen/agency acceptance; deployment separately authorized."
superseded_by: null
resolution: null
summary: >-
  Help a learner who knows the target denominator but needs assistance finding
  the equivalent numerator, through requested local steps that preserve amount,
  require learner contributions and avoid revealing the answer prematurely.
---
# Plan 25: Requested Equivalent Fraction Conversion Help

## Packet Metadata

- Packet id: `plan-25`
- Packet title: Requested Equivalent Fraction Conversion Help
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-10-07
- Packet type: feature
- Mutation level: instructional help state / projection / presentation / tests
- Approval gate: investigation/mechanism, technical review, owner behavior acceptance
- Expected artifacts: bounded requested help, tests/routes, rendered evidence and progress report

## Goal and dependencies

Address the owner's example: “I have been told to use a denominator of 24, but
I don't know how to change 2/3 to something out of 24 parts.” Finding a common
denominator and constructing an equivalent fraction are distinct learner decisions.
Plan 24 covers the former; this packet covers optional assistance for the latter.

Reuse Plan 24's accepted task-local help placement and upstream assistance contract,
not a second competing help system. It is the explicit dependency for this first
implementation. Investigations may be coordinated, but overlapping source writes
remain serialized. Preferred learner-source order is Plan 24, this packet, then
broader unlike-denominator family work. Larger-denominator capability is separate.

## Authority, scope and non-goals

Read AGENTS.md, decision-log.md, development/README.md, founding instructional
model's equivalent-unit reasoning, Plans 24/22 dispositions, current transform
classification/scene/help/provenance and visual/linear controls. Preserve exact
math → instructional state → presentation, frozen support/schedule, answer
withholding, valid unavailable boundaries and registered replay identity.

In scope: current registered practice, both transform sides and authored targets
12/24, requested local help, copy, focused tests/routes and evidence. Propose exact
files at the gate. No new live families, denominator discovery, adaptive support,
whole-bar change, general worked-solution engine, persistence or deployment.

## Requirement 0 — Investigate, propose and stop

Run preflight. Inspect existing help levels and prompts before inventing another
action. Propose exact short copy, meaningful learner calculations, local recovery,
closing/resuming and focus behavior. Demonstrate the proposal for 2/3 → ?/24
and the other operand. Investigate this candidate, rather than treating it as
an approved mechanism: ask the learner to find the multiplier in 3 × ? = 24,
then apply that same multiplier to 2. Connect this to each original part being
split into the same number of smaller equal parts, preserving the amount.

Decide whether a compact equation, a requested unit-part illustration or a brief
phrase best conveys that relationship. Avoid simultaneous duplicate explanations.
Specify pure state ownership, exact upstream checking, assisted provenance,
unsubmitted input preservation, replay/reset and definition compatibility. Prefer
local substeps within transform; new top-level beats or structural changes need
explicit approval. Return the mechanism and falsifying evidence plan; stop before source.

## Requirements after approval

1. Offer help beside the active conversion question/response in visual and linear
   paths. Reuse or route the accepted help entry; no duplicate competing buttons.
   Keep unaided work available. Do not automatically open help after a wrong answer.
2. Show one short prompt and one learner decision at a time. Replace completed
   instructions, preserve useful context and avoid a growing explanation transcript.
   Keep the starting fraction and target unit identifiable. Do not refer learners
   to a completed new bar that is not yet available.
3. The learner supplies a multiplier and/or a subsequent numerator calculation
   not already supplied by the helper. Do not immediately display 16/24, autofill
   the response or bypass the main accepted-conversion action. A later requested
   worked example must be honestly assisted and retain meaningful participation.
4. Derive the relationship from validated operands/target, not canonical numbers
   or renderer arithmetic. The scale factor for 2/3 → ?/24 is 8, and for 1/4
   → ?/24 is 6. Multiplying numerator and denominator preserves the amount;
   merely changing the denominator does not.
5. Keep existing wrong-answer recovery distinct from requested help. Opening or
   closing help preserves entered work; assistance does not silently alter support
   configuration, schedule or content. Retry/return/re-entry remove stale helper state.
6. Preserve keyboard, non-drag touch, linear and reduced-motion decisions. Conversion
   motion begins only on existing approved triggers; help must not animate or reveal
   the final shaded answer before acceptance. Review narrow layouts and Chromebook
   layouts without inferring physical-device or assistive-technology evidence.

## Work plan and validation

Investigate/propose → mechanism gate → bounded source implementation → discriminating
unit/browser evidence and rendered review artifacts → tests/build/routes/lint/diff
→ behavioral advisor review/disposition → scoped commits and final report.

- [ ] Required artifacts and `reports/development/plan-25-equivalent-fraction-conversion-help/progress.md` exist.
- [ ] Both sides and 12/24 targets use correct dynamic relationships.
- [ ] Wrong multiplier and wrong numerator produce usable local recovery.
- [ ] Learner contribution, no premature answer disclosure, retained input and close/focus behavior are proven.
- [ ] Assisted provenance and legacy replay compatibility match the approved mechanism.
- [ ] Retry/return remove helper state; existing completion and motion routes remain valid.
- [ ] Screenshots/measurements demonstrate local help placement and restrained copy.
- [ ] Appropriate tests/build/routes, packet lint and diff check pass; no unrelated changes.
- [ ] Mechanism gate honored, advisor disposition and evidence limits recorded.

Implementer may not set status or edit owner/orchestrator dispositions. Stop on
load-bearing policy or structural uncertainty. Stage explicit paths, never push,
and commit progress.md last. Technical and owner rendered/agency acceptance remain
separate from publication. No learning-efficacy claim follows from route completion.

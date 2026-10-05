---
id: plan-18
title: Nested-Denominator Addition
status: draft
depends_on: [plan-11, plan-12, plan-13, plan-14, plan-16, plan-22]
gate: "DECISION-037 adopts the focused renaming task. Requirement 0 verifies that task and obtains execution mechanism approval before source work. Technical and owner rendered-screen/agency acceptance; deployment separately authorized."
superseded_by: null
resolution: null
summary: >-
  Make nested-denominator addition learner-reachable, with one required canonical
  conversion and a meaningful decision about which fraction needs renaming.
  General common-unit choice remains a separately gated follow-up.
---
# Plan 18: Nested-Denominator Addition

## Packet Metadata

- Packet id: `plan-18`
- Packet title: Nested-Denominator Addition
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-10-04
- Packet type: feature
- Mutation level: source / learner-facing local behavior
- Approval gate: verify adopted focused task; mechanism, technical and owner acceptance
- Depends on: `plan-11`, `plan-12`, `plan-13`, `plan-14`, `plan-16`, `plan-22`
- Expected artifacts: execution of recorded owner task policy, approved bounded source work, tests, browser evidence and report

## Goal and why this packet exists

Launch a vetted nested addition episode, proposed `1/2 + 3/8 = 7/8`, that does not
ask for an unnecessary canonical conversion of `3/8`. Plan 16 proves a synthetic
one-renaming schedule but does not admit or launch this family. A live denominator
choice creates a new constraint: choosing 16 requires *both* operands renamed,
although the construction-time canonical schedule has only `transform-left`.

## Non-goals

No response-derived rescheduling, adaptive policy, subtraction, new support levels,
mixed numbers, arbitrary generation, simplification lesson, session composition or
deployment. No silent amendment of DECISION-034 or rejection of mathematically valid
answers merely because they do not fit the current UI.

## Depends on

The accepted entry/support, motion, route and schedule precursors plus Plan 22's
path-closure repair are real dependencies. Plan 17 need not generalize admission:
its relatively-prime crossing content already passes today's instruction guard.
The adopted nested policy is recorded in
`reports/orchestration/nested-addition-policy-decision-brief.md`, independently of
source delivery. DECISION-037 records the focused task; DECISION-035 records the learner-goal
model. Plan 21 must make content-selection reach concrete before a new surface;
record a real dependency if that requires its future implementation packet.
No hard dependency on another new family is asserted. Serialize shared source work;
like-denominator execution first is useful but is a preferred order, not a blocker.

## Authority and contracts

Read `AGENTS.md`, `docs/decision-log.md` (034–040), `docs/development/README.md`,
Roadmap §§27–31, the Plan 10 reach assessment, Plan 16 mechanism/delivery reviews,
`src/interaction/beat-schedule.js`, episode/definition/replay, and current denominator
classification/support logic. Preserve exact math, immutable episode configuration,
permitted alternate pathways, authored feedback, leakage and access floors.

## Scope

Bounded family admission, registered definition and fixture, instructional transitions
and projection, renderers/strings consuming the approved schedule, entry registry,
authored premise/reflection data, tests and browser routes. Identify exact paths at
the gate. Existing definition semantics and previous routes remain protected.

## Implementation Requirements

### Requirement 0 — Discriminating investigation and decision; stop

Run preflight and verify DECISION-037 and the adopted disposition in the separate
nested brief. The first task identifies which fraction needs renaming to the unit
already available; it does not offer unrestricted denominator entry.
Trace denominator 8, 16 and eligible-but-unauthored 24 through the actual pure engine with a
synthetic nested instance; record current acceptance/refusal and which conversion
facts/controls the frozen schedule can represent. Also inspect the mirrored case
`3/8 + 1/2` and support profiles. Distinguish a synthetic harness from a learner route.
The earlier brief retains rival options as history. General unit choice is deferred
to the follow-up obligations record, not silently discarded. Verify the approved
focused task's agency, prompts, replay identity and fixed schedule;
obtain mechanism approval before source changes. Orchestrator mechanism approval
alone does not authorize narrowing alternate pathways or amending DECISION-034.
Explicitly name reducer/classification prerequisites for operate/resolve: distinguish
the unchanged original operand from a learner-performed conversion. Current code
unconditionally parses two conversion records. Generalize effective operand forms
without fabricated responses/provenance. Reflection subject and prompts across
instruction, scene, visual and linear paths must follow the actual task/converted
side rather than always `conversions.left`. Author and validate the fixture and
applicable path-specific premise/reflection data. Prove accepted-definition pure
completion and replay for both operand orders; schedule construction alone is insufficient.
If a structural amendment requires a separate packet, stop and propose that packet.

### Requirement 1 — Approved reachable one-renaming flow

Implement only the selected policy. Both left-renaming and mirrored right-renaming
cases must be proven; register only vetted, fully runnable content. Retain notice,
the decision about which operand needs renaming, the needed conversion,
operate, resolve and authored reflection. No redundant unchanged conversion.
Keep high/medium support honest about the same mathematical task. Preserve legacy
definitions/replay; new prompts and task semantics get explicit registered identity.

### Requirement 2 — Evidence through mounted controls

Add full routes for both operand orders and both support profiles, wrong-side
selection and conversion recovery, Replay/help, linear and reduced-motion completion, retry
and return/re-entry. Verify skipped controls are absent visually and semantically;
completed summaries/provenance match actual schedule positions. Demonstrate how a
valid non-least denominator and eligible-but-unauthored 24 relate to the task
boundary: they are not offered denominator responses and are not mathematical
errors. Preserve the Plan 22 distinction between validity and task coverage. Seed a wrong-side
conversion or stale skipped control and prove the witness fails. Measure rest,
conversion and Replay at 360×740/752 and retain the approved motion behavior.

## Work plan and validation checklist

Investigate → decision/mechanism gate → bounded implementation → meaningful pure and
browser checks → full tests/build/routes, lint and diff check → scoped commits → report.

- [ ] Owner policy decision is recorded by the orchestrator; no hidden response-derived schedule.
- [ ] Required artifacts and browser evidence exist, old routes/assertions retained, failure seed rejected.
- [ ] No unrelated files changed; mechanism and owner gates honored.
- [ ] `reports/development/plan-18-nested-denominator-addition/progress.md` exists.

## Stop Conditions and authority

Stop on blocked preflight, load-bearing undecided policy, incompatible replay or
schedule contract, missing authored data, or out-of-scope repair. Implementer does
not set status, edit disposition records, or declare completion/readiness to ship.
Report actual objectives and limits, apply inherited advisor declaration/disposition,
commit explicit scoped files and progress last, and never push/deploy.

## Progress Report

Include the adopted policy and rival-evidence pointers, exact schedule and response paths,
registered identities, legacy compatibility, browser/geometry/access evidence,
negative controls, advisor disposition, and remaining owner acceptance.

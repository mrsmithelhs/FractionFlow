---
id: plan-18
title: Nested-Denominator Addition
status: draft
depends_on: [plan-17]
gate: "Requirement 0: owner decision, recorded by the orchestrator, on the alternate-denominator versus frozen canonical schedule conflict, then mechanism approval before source work. Technical and owner rendered-screen/agency acceptance; deployment separately authorized."
superseded_by: null
resolution: null
summary: >-
  Make nested-denominator addition learner-reachable, with one required canonical
  conversion and honest handling of alternate units. First resolve the mismatch
  between a frozen canonical schedule and learner-chosen non-least denominators.
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
- Approval gate: alternate-unit policy decision, mechanism, technical and owner acceptance
- Depends on: `plan-17`
- Expected artifacts: schedule-policy investigation and approved bounded source work; tests, browser evidence and report

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

Plan 17 establishes the new-definition admission/replay path against the accepted
precursors. This sequencing keeps shared source work single-writer and separates
multi-whole rendering risk from asymmetric scheduling risk.

## Authority and contracts

Read `AGENTS.md`, `docs/decision-log.md` (034), `docs/development/README.md`,
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

Run preflight. Trace denominator 8 and 16 through the actual pure engine with a
synthetic nested instance; record current acceptance/refusal and which conversion
facts/controls the frozen schedule can represent. Also inspect the mirrored case
`3/8 + 1/2` and support profiles. Distinguish a synthetic harness from a learner route.
Compare at least: canonical-unit-only *instructional task* with honest feedback for
other valid common units, versus retaining general denominator choice with a
different approved construction/configuration contract. Name falsifying observations
and show where predictions differ. Do not decide between them or amend DECISION-034.
Present the consequences for agency, prompts, replay identity and fixed schedule;
obtain the owner's policy decision, recorded by the orchestrator, and mechanism
approval before source changes. Orchestrator mechanism approval alone does not
authorize narrowing alternate pathways or amending DECISION-034.
If a structural amendment requires a separate packet, stop and propose that packet.

### Requirement 1 — Approved reachable one-renaming flow

Implement only the selected policy. Both left-renaming and mirrored right-renaming
cases must be proven; register only vetted, fully runnable content. Retain notice,
denominator reasoning where the approved task requires it, the needed conversion,
operate, resolve and authored reflection. No redundant unchanged conversion.
Keep high/medium support honest about the same mathematical task. Preserve legacy
definitions/replay; new prompts and task semantics get explicit registered identity.

### Requirement 2 — Evidence through mounted controls

Add full routes for both operand orders and both support profiles, wrong denominator
and conversion recovery, Replay/help, linear and reduced-motion completion, retry
and return/re-entry. Verify skipped controls are absent visually and semantically;
completed summaries/provenance match actual schedule positions. Demonstrate how a
valid non-least denominator is handled under the approved policy. Seed a wrong-side
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

Include rival policy evidence and decision pointer, exact schedule and response paths,
registered identities, legacy compatibility, browser/geometry/access evidence,
negative controls, advisor disposition, and remaining owner acceptance.

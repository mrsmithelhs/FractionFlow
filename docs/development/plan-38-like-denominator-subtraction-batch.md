---
id: plan-38
title: Like-Denominator Takeaway Subtraction Batch
status: in-progress
depends_on: [plan-15, plan-35, plan-36]
gate: "Requirement 0: approve exact wiring, admission/replay and evidence mechanism before source. Staged technical review, owner rendered-page/agency acceptance and separate deployment gate."
summary: >-
  Integrate the adopted takeaway task as one learner-reachable goal with eight
  compact same-denominator subtraction records. Preserve the stable whole,
  learner-supplied equivalent result, zero boundary, local help, access and
  historical replay without per-problem behavioral code or addition regressions.
---
# Plan 38: Like-Denominator Takeaway Subtraction Batch

## Packet Metadata

- Packet id: `plan-38`
- Packet title: Like-Denominator Takeaway Subtraction Batch
- Status: (see frontmatter)
- Owner/model: single implementer / supervised orchestration
- Date: 2026-10-18
- Packet type: bounded learner feature and authored batch
- Mutation level: source, compact data, tests and local evidence; no remote writes
- Approval gate: pre-source mechanism, staged technical review, owner rendered-page/agency acceptance
- Expected artifacts: admitted eight-item set, episode/scene/render path, strict replay, browser evidence and progress report

## Goal, dependencies and reason

Implement DECISION-045 and the adopted Plan36 design. Exact subtraction already
exists; the missing capability is a learner-reachable task whose operation,
response and representation mean takeaway. Deliver all eight reviewed problems
through shared mechanisms, not separate source work for each numerical variation.

Plan15 supplies accepted standalone prototypes and painted-mark witness lessons;
Plan35 supplies compact authoring and compatibility patterns; Plan36 supplies
the adopted instructional contract. None proves that this integrated task works.
All three dependencies must be complete before execution.

## Authority and required reading

Read AGENTS.md, the implementer starting prompt, docs/decision-log.md
(DECISION-035/040/041/042/045), docs/development/README.md and packet guidance.
Read founding instructional model, grammar, math/content, architecture, quality
and roadmap sections 27-31; OQ-25's current disposition and Phase3 follow-ups.

Read reports/development/plan-36-learner-subtraction-integration-design/:
owner-acceptance.md, design-contract.md, annotated-flow.md,
implementation-and-validation.md, dossier-review.md, batch-probe.mjs and receipt.
Its static board is annotated unbuilt design, not literal learner copy or measured
product layout. Read Plan15 owner disposition and repaired visual witnesses,
and Plan35 final progress, data-only and compatibility reviews. Inspect actual
source/tests; historical reports are not current code inventories.

## Scope and non-goals

Implement one fixed eight-item set under **Subtract fractions with the same
denominator**. Domain: positive proper source fractions, same denominator,
left numerator at least right numerator; zero result included. Preserve authored
source forms, including unreduced forms. Existing bar capacity ceilings remain.

No nested/unlike subtraction, negatives, mixed/improper operands, number lines,
comparison episode, new arithmetic algorithm, simplify-first branch, random or
adaptive selection, persistence, accounts, tracking, new animation or universal
lesson framework. Do not import the standalone prototype wholesale. No routine
Notice/reflection, per-part clicks, automatic equivalence display or learner Replay.
Do not revise existing addition goal/set identities or v1-v4 replay meanings.

## Requirement 0 — Investigation and mechanism stop

Run `node scripts/dev/plan-status.js check plan-38`; stop on nonzero. Inspect
current tree, owners and baseline. Shared app/interaction/render edits must be
serialized with overlapping source work; do not displace writers or revert others.

Before source, persist proposal/checkpoint in this packet's report folder. Confirm
exact data/context identities; content admission including unreduced operands and
zero; action/state/scene ownership; help/draft/focus; v5 fields/intents and old
guards; goal reach and discriminating browser evidence. Map precise files/symbols
and staged commits. Freeze representative initial/completed old replay oracles
before shared dispatch changes. Record route/context baseline. Stop for
orchestration approval. Do not reopen adopted pedagogy; report any concrete
infeasibility or necessary contract amendment through the owner.

## Requirement 1 — Compact batch and exact admission

Admit these records in the adopted order:

| Item id | Source operands |
|---|---|
| takeaway-8-5-minus-2 | 5/8 minus 2/8 |
| takeaway-12-8-minus-3 | 8/12 minus 3/12 |
| takeaway-10-7-minus-3 | 7/10 minus 3/10 |
| takeaway-11-9-minus-4 | 9/11 minus 4/11 |
| takeaway-9-6-minus-1 | 6/9 minus 1/9 |
| takeaway-9-6-minus-6 | 6/9 minus 6/9 |
| takeaway-6-5-minus-4 | 5/6 minus 4/6 |
| takeaway-8-7-minus-1 | 7/8 minus 1/8 |

Adopted identities: recipe `plan36.like-denominator-takeaway@1`; definition
`phase-3-like-denominator-takeaway-subtraction@1`; task data
`plan36-like-denominator-takeaway@1`; set
`like-denominator-subtraction-vetted-set@1`; authoring `plan36-record-v1`;
fixtures `curated-plan36-${itemId}`. Retain these design-origin identities;
Plan38 implements them. Any necessary identity amendment is explicit at the gate.

Use canonical decimal strings and strict registered associations. Author quantities
once; derive fixtures, differences, equivalence and cell roles from exact APIs
and validated projection. No answer table or per-item reducer/render branch.
Bind item/set/fixture/source forms/recipe/task data/definition exactly. Distinguish
math validity, recipe admission, capacity and instructional evidence. Refuse
malformed, unregistered, mismatched, negative, improper and unequal-denominator
inputs before episode construction.

## Requirement 2 — Short task and truthful representation

Freeze `encounter → operate → resolve`. Encounter shows the stacked source
equation, stable whole and **How much is left?** **Take away** dispatches
`mark-subtrahend-amount`, marks the validated subtrahend in one static group and
advances directly to operate. No extra acknowledgment. Fraction fields are
unavailable beforehand. Remove the spent action; duplicates cannot change marks,
history or answer evidence.

Operate requires a fraction. Validate exact subtraction equivalence without a
same-denominator response restriction; retain submitted form/classification and
accept reduced alternatives and exact zero forms. Resolve displays that accepted
form, not forced normalization, an equivalence line or a second simplification task.

Preserve whole width/position, all partitions, original starting extent and
distinct removed/remaining/outside-start roles. Do not draw positive addends or
shrink the whole. The scene provides validated meaning; renderers do not compute
mathematical truth. On zero, retain the grid and all original parts marked.
Before acceptance, expose no numeric result label, including zero, visibly or
accessibly. Counting the depicted remainder is intended work; an answer label
must not replace it.

Linear participation uses the same action/response, clear source quantities and
non-answer-bearing removal status. Use intrinsic stacked notation and one visible
question. Accessible group/field names must not become repeated visible headings.
No new motion: standard/reduced motion reach the same static endpoint.

## Requirement 3 — Help, focus and session behavior

Use the adopted concise copy and local requested help. Visual help counts only
shaded parts without removal marks, excluding originally unfilled cells. Linear
help describes taking the second fraction from the starting amount. Existing
high/medium profiles use identical assistance behavior within each view; invent
no distinction. Error feedback is distinct from the question.

Keep drafts app-local through help/recovery/view changes. Wrong submission retains
an open cue and draft; short recovery must not replace the cue with stale status.
Closing help retains recovery/draft. Witness open/close/reopen, wrong while help
is open, repeated identical wrong answer, close and reopen. Label, aria-expanded
and actual visibility must agree and remain actionable in both views.

Focus entry/Next on Take away; marking/wrong recovery reaches the response input,
help closure its trigger, correct response completion navigation. Preserve draft
and meaningful focus on view changes. Retry keeps item identity but starts fresh;
Next requires completion, follows fixed order and clears work/drafts/help. Return,
re-entry and exhaustion use established entry contracts. Record action triggers,
actual answer attempts and requested help separately; a grouped trigger is not a
chosen count, correct answer, mastery or demonstrated understanding.

## Requirement 4 — Replay and bounded wiring

Implement strict v5 context/source-form binding and ordered mark, answer,
requested-help and finish intents. Confirm exact envelope names against current
APIs at Requirement0. Preserve v1-v4 definitions, decoders, fixtures and route
contexts. Reject missing/extra keys, forged identities/forms, invalid order and
inappropriate duplicate actions. Replay reconstructs submitted instructional
history, not unsent drafts, help-panel visibility or interrupted-session storage.

Use the Plan36 file map: new data/task modules named there; bounded integration
in catalog/materializer, definition/schedule/reducer, scene/provenance, replay,
both renderers/strings/bars/symbolic notation, registry and app lifecycle. Reuse
exact math unchanged; report any actual core defect before expansion. Add only
necessary admission changes. Expose the new goal only when its full set/path
works. Preserve addition entry, order, help, typography, focus, motion and replay.
Scoped CSS in src/styles/render.css and src/app/styles.css may express the
adopted marks/layout without a general redesign. Add focused tests and only the
necessary route runner/helper/fixture changes under tests/ and scripts/dev/;
leave the standalone subtraction prototype product unchanged.

## Requirement 5 — Objective evidence and delivery

Checkpoint stages: pure data/admission/state/replay → orchestration review →
mounted views/entry → review → browser evidence → progress. Supervised children
stop at assignment boundaries. Test every admitted item under both actual support
profiles for result/recovery, provenance, completion/reset and replay. Do not
manually re-prove arithmetic or write implementation-mirroring tests. Distinguish
math-valid records from those outside the recipe/capacity.

Preserve all old route objects/actions/assertions AND context assignments. At
creation there are 65 rows/67 executions; verify current baseline at preflight.
Append separate current subtraction journeys. Traverse all eight through mounted
production controls in visual/high and linear/medium paths, with gated Next,
exhaustion and return/re-entry. Deep samples cover one-part, large remainder,
reducible/equivalent response, zero, help/repeated-error toggles, keyboard-only
completion and non-drag touch. Use a visual reduced-motion route for no-animation
claims; absence of bars in linear view is not proof.

Assert computed paint, actual cell/bar bounds, stable whole geometry and sampled
hit tests for visible hatch/grid. Seed erased/indistinguishable marks, full clipping
with surviving boxes, premature answer leakage, addition semantics and action-as-
answer. Each seed must fail the SAME clean assertion at the intended cause; retain
separate clean receipt. Consolidate equivalent seeds proportionately. Cover zero's
marked grid and withheld labels. Positive boxes alone are not visual proof.

Measure actual question/controls/feedback and overflow at 360x740/752, a declared
Chromebook CSS viewport and enlarged text/zoom. Record ordinary scrolling and
post-scroll bounds, viewport/DPR versus physical-device limits. Save representative
initial, marked, wrong/help, accepted and zero screens, without a full Cartesian
capture matrix. Review copy for redundancy/developer vocabulary. Restore only
known prior accepted captures overwritten by regression runs; keep new evidence
in this packet's folder.

Run focused tests, `npm test`, both builds via `npm run build`, full
`npm run test:routes`, packet lint and diff check. Separate all-item pure coverage,
full-set mounted reach, focused access/layout, seeded sensitivity, owner judgment
and untested physical-device/AT/efficacy behavior in the report.

## Work plan and acceptance checklist

Investigate and stop → mechanism approval → staged implementation/reviews →
exact/broad/browser verification → report → owner review.

- [ ] Requirement0 approved before source; historical baseline frozen.
- [ ] Eight operand-only records share one strict task without per-item code.
- [ ] Both views, equivalent/zero responses and truthful marks work.
- [ ] Help/recovery/draft/focus/reset and completed set navigation are witnessed.
- [ ] Historical replay/routes and addition behavior remain protected.
- [ ] Seeded visual/leak/semantic assertions fail meaningfully; clean checks pass.
- [ ] Required report exists at reports/development/plan-38-like-denominator-subtraction-batch/progress.md.
- [ ] No unrelated changes; mechanism, owner and deployment gates honored.

## Authority, consultation and stop rules

Implementers do not set status, edit owner/orchestrator dispositions, declare
completion/readiness to ship, push or deploy. Report against the objective, not
test counts. Stop on blocked preflight, overlapping writers, compatibility
conflict, load-bearing new owner decision, unsupported capacity/content or scope
expansion. No silent harness weakening or family widening. Inherit consultation
declaration/disposition rules; report ran/not warranted/degraded as applicable.

Authorized supervised implementation may use Luna medium cold-context default-role
children with explicit scope/checkpoints. Sol read-only reviewers/advisors must be
low/medium; no Astra without specific owner authorization, child fan-out or silent
substitution. Parent retains mechanism/owner questions/stop relay, verification,
Git/status and acceptance. Durable implementers follow inherited scoped commits;
children follow the parent's single-writer/Git assignment. Stage owned paths,
never unrelated files; commit progress last. This packet is ready but unstarted.
Design adoption is not implementation rendered acceptance or deployment approval.

---
id: plan-42
title: Operate Response Ownership Pilot and Maintenance Evaluation
status: draft
depends_on: [plan-40, plan-41]
gate: "Owner adoption of the refined Plan 41 direction and this packet before dispatch. Requirement 0: approve exact region ownership, handles, guard repairs and isolated evaluation mechanism before source. Review repaired baseline before extraction. Technical parity, maintenance evaluation and owner acceptance precede closure; no Plan 39 activation or deployment."
superseded_by: null
resolution: null
summary: >-
  Strengthen the specific operation-response guards, then consolidate duplicated
  visual/linear operate controls behind a small explicit handle while keeping
  draft storage and focus timing in the app. Preserve learner behavior and replay,
  and evaluate a subsequent bounded edit against the same guarded baseline.
  No framework, admission or general representation-system refactor.
---
# Plan 42: Operate Response Ownership Pilot and Maintenance Evaluation

## Packet Metadata

- Packet id: `plan-42`
- Status: (see frontmatter)
- Owner/model: single source writer, supervised by orchestrator
- Date: 2026-10-20
- Packet type: bounded refactor pilot, targeted guard repair and evaluation
- Mutation level: source, focused tests/harness and local report evidence
- Approval gate: owner adoption; Requirement 0 mechanism; guarded baseline checkpoint; final acceptance
- Depends on: accepted Plan 40 baseline and owner-adopted Plan 41 disposition
- Expected artifacts: mechanism proposal, guard checkpoint, shared response region, parity evidence, maintenance evaluation and progress report

## Goal, reason and sequence

Reduce duplicated operation-response wiring and remove the app's separate
definition-keyed procedure for finding operation controls. Plan 41 found mirrored
operate blocks in the visual/linear renderers and a competing app selection
procedure. No current learner defect on this seam was established. This pilot
tests whether explicit ownership makes subsequent editing clearer and safer.

Recommended sequence: Plan 41 disposition → this packet's guard stage and reviewed
baseline → extraction → parity and maintenance evaluation → Plan 39. These are
stages of one packet, not separate prerequisite cleanup projects. Drafting this
packet does not close Plan 41 or authorize implementation. Plan 39 stays draft.

## Required references and protected decisions

Read `AGENTS.md`, `docs/agent-starting-prompts/implementer-prompt.md`,
`docs/decision-log.md` (DECISION-047), `docs/development/README.md`, packet creation
guidance and the founding architecture, interaction grammar and quality docs.
Read Plan 41's `investigation.md`, `recommended-source-slice.md`, and especially
`orchestration-review.md` under its report directory. The orchestration review
qualifies the investigation; do not treat its unverified tracer leads as facts.
Read Plan 40's final review/owner acceptance and Plan 39 for future needs only.

Preserve exact math → instructional state → presentation, existing intents and
raw payloads, episode/scene/support semantics, learner decisions, replay identity
and full frozen states, current motion/focus/reset contracts and privacy posture.
Keep current ids, classes, copy, native labels and accessible names for the
production extraction as temporary parity scaffolding. Historical acceptance
does not freeze incidental markup for all future packets.

## Scope and ownership

In scope:
- Shared construction of current `operate` fraction-pair and single-number
  response controls, submit wiring and existing task-help paragraphs.
- A small renderer-exposed handle for active response controls; app draft/focus
  code consumes it instead of selecting by definition-id lists.
- Only the guard repairs and evidence needed to establish and assess that seam.

Keep authoritative draft storage and decisions about when to capture, restore,
reset or focus in `app.js`. The region reads/writes current DOM values on request;
it has no independent persistent draft, does not evaluate mathematical truth,
and emits existing intents. Visual/linear ids and help copy may be parameters;
their surrounding instructional shells remain distinct.

Recovery rendering remains shell-owned in this pilot: it currently occurs outside
the operate branch. Do not relocate the paragraph as an incidental extraction.
Help-button placement remains app-owned. Pass explicit presentation information
where needed rather than discovering state through another renderer.

Likely source sites: `src/render/operate-response.js` (proposed), both beat
renderers, `src/render/index.js`, operation draft/focus access in `src/app/app.js`,
and narrowly needed existing control helpers. Confirm paths before editing.
Report directory: `reports/development/plan-42-operate-response-ownership-pilot/`.

Out of scope: math/content/interaction/replay changes, new records/tasks, Plan 39
implementation, admission refactor, remount-token extraction, decide/transform
migration, general focus or representation framework, dependencies/frameworks,
production copy/error-association changes, settings, push or deployment.

## Requirement 0 — investigate exact mechanism and stop

Run `node scripts/dev/plan-status.js check plan-42`; stop if nonzero. Record HEAD
and tree ownership. Read actual callers and affected tests. Propose:

1. Exact region boundaries, both response forms, scene-driven control selection,
   event/intent wiring and help/recovery ownership.
2. Minimal handle for draft read/write and focus access; specify connected/visible
   validity, invalidation on remount, reacquisition after render and null behavior
   outside operate. Preserve raw empty/partial strings. Do not force future
   number-line candidates into a numerator/denominator draft schema.
3. Which existing app selection branches disappear and which decisions remain.
   Preserve current field-specific behavior; do not promise new focus/selection
   behavior merely because a `focusPrimary` method exists.
4. Specific guard repairs, failing-first probes, baseline and extraction commits,
   final-build browser evidence and isolated comparison mechanism.

Write `mechanism-proposal.md` and stop for orchestrator approval before source or
test/harness changes. If the slice needs broader recovery/lifecycle changes,
report the conflict rather than enlarging it silently.

## Stage 1 — repair only prerequisite guards; checkpoint

- Strengthen `ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION` to check both actual
  draft values after each direction and actual focus behavior under deliberate
  pointer/keyboard gestures. Seed draft loss and wrong-focus behavior and prove
  the normal assertions reject them. Keep the clean behavior honest.
- Re-query mounted controls in affected draft tests before asserting their values;
  fix stale-node checks that this slice would rely on, not every historical test.
- Ensure render-purity checks include the new module automatically or through a
  tested inventory. Do not weaken exclusions or mislabel negative-selector
  semantics as a bug. Pair absence assertions with positive current-state checks.
- Preserve unrelated route rows/expectations and frozen fixtures. An intentionally
  strengthened Plan 38 row is an explicit exception, not blanket rewrite authority.

Commit guarded baseline A, persist exact SHA, focused results and failing-first
receipts in `guard-checkpoint.md`. Stop for orchestrator review before extraction.
Both evaluation arms use this same repaired baseline; no repeated broad baseline
test runs without a changed concern.

## Stage 2 — extract the response region

Implement the approved shared construction and handles, then switch app operation
draft/focus lookup to them. Reuse existing controls. Maintain fresh handle access
through render/remount, view switch, help, errors, retry, Next and re-entry.
Remove replaced operation selection lists; do not leave two competing production
procedures behind an unexercised fallback. Keep other regions unchanged.

Test both fraction and single-number forms, both views and relevant profiles,
drafts, submission and stale/disconnected handles. Tests must fail when required
controls are missing. Commit extraction baseline B separately from guard A.
No new learner-facing behavior is part of this stage.

## Stage 3 — parity and bounded maintenance evaluation

Run meaningful browser checks against the final build for:
- Partial operation drafts across both view directions, with focus behavior
  compared to baseline under actual gestures.
- Help open/close and repeated wrong submissions: cue, toggle, focus and drafts.
- Accepted response, retry, Next, return/re-entry and cleared UI state.
- Fraction-pair and single-input addition/subtraction paths; applicable profiles,
  reduced motion, a non-drag touch-context journey and 360px/desktop layout.
- Existing no-answer-disclosure, hatch visibility and historical replay checks.

Reuse and strengthen appropriate existing routes; no arbitrary route-count target.
Save matched representative screenshots and actual bounds, input mode, browser,
scroll, measured DPR and observation limits. Keep physical-device/AT claims separate.
Build after final source changes before capturing evidence. Inventory and restore
only your generated changes to historical evidence; never blanket-checkout reports.

**Temporary follow-up edit F1, in isolated evaluation arms only:** for takeaway-
subtraction operate fraction-pair responses, change group label `Amount left` to `Your answer` and the
submit text `Check` to `Check answer`; associate the currently visible error with
both inputs using `aria-describedby`. Retain other descriptions; remove the error
association when cleared, with no dangling IDs. Other tasks/views stay unchanged.
These exact experimental changes are not adopted production copy or accessibility
behavior. Do not merge F1 into the production extraction.

Use baseline A and extraction B in separate isolated checkouts. Orchestrator
dispatches one fresh bounded evaluation worker per arm with the identical F1
brief, allowed files and validation. The extraction writer does not grade its
own cold-start editing ease or fan out workers. Codex evaluators may use Luna
medium; keep writers serialized. Pin matching models/tools/context where possible
and record unavoidable differences. One run per arm is sufficient for a bounded
pilot; do not multiply trials without a specific reason and approved budget.

Record files opened/edited and why, duplicated edits, concepts needed, wrong
initial guesses and comparable observed cost only when available. Verify F1
behavior in each arm. Invite owner reading of the region/call sites: where labels
are set, how drafts survive switches, and who decides focus after a wrong answer.
That is a useful observation, not a timed exam or mandatory owner task.

Parity regression blocks acceptance. A single extra file opened does not. Assess
observations against removal of duplicated responsibility; allow useful, negative
or inconclusive results. No automatic Vue comparison, broad migration or approval
of Plan 39 follows. If isolated evaluation is unavailable, report the limitation
and stop for disposition rather than substitute the familiar writer's impression.

## Validation and delivery

- [ ] Required gates and both baseline SHAs recorded; protected contracts unchanged.
- [ ] Guard seeds reject defects; affected tests and direct handle tests pass.
- [ ] Full unit suite and both builds pass; full browser matrix after final changes
  passes, with explicit explanations for intentional witness strengthening.
- [ ] Relevant existing visual/leak/motion seeds pass their clean and seeded checks.
- [ ] Frozen full-state replay comparisons pass without regenerating fixtures.
- [ ] Matched screenshots/measurements and separate maintenance-arm evidence exist.
- [ ] `node scripts/dev/plan-status.js lint` and `git diff --check` pass.
- [ ] No unrelated changes, production F1, dependency, source-version migration or push.

Write `parity-evidence.md`, `maintenance-evaluation.md` and `progress.md`, linking
receipts rather than duplicating prose. State precisely what was measured, what
benefit was observed and residual uncertainty. Repository consultation declaration
applies: real behavioral work warrants the available read-only advisor path or
honest degraded mode. Codex advisors must be Sol low/medium, no Astra or silent
substitution; Luna implementation medium is permitted. No child implementation
fan-out. Parent retains gates, independent verification and evaluation dispatch.

Commit scoped work by explicit paths and progress last. Do not change packet
status/completion, owner/orchestrator records or declare readiness to ship. Stop
for technical review and owner acceptance. No push/deploy or Plan 39 launch.

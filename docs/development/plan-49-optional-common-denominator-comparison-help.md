---
id: plan-49
title: Optional Common-Denominator Construction for Comparison
status: in-progress
depends_on: [plan-24, plan-25, plan-45]
gate: "Requirement 0: approve reuse boundaries, local assistance flow, denominator admission, answer withholding and compatibility before source. Pure-contract checkpoint precedes mounted integration; owner rendered/task acceptance and deployment remain separate."
summary: >-
  Add requested common-denominator construction within the existing comparison
  task. Reuse denominator-finding and equivalent-fraction help where appropriate,
  keep meaningful learner contributions and concise local steps, then return to
  the original inequality response without revealing its answer.
---
# Plan 49: Optional Common-Denominator Construction for Comparison

## Packet Metadata

- Packet id: `plan-49`
- Packet title: Optional Common-Denominator Construction for Comparison
- Status: (see frontmatter)
- Owner/model: one implementer; orchestrator mechanism/technical review; owner rendered/task acceptance
- Date: 2026-10-31
- Packet type: bounded learner assistance integration
- Mutation level: instructional/scene/help/replay, response/app and focused evidence
- Approval gate: Requirement 0, pure checkpoint, delivery review and owner acceptance
- Expected artifacts: mechanism, scoped implementation, browser evidence and progress.md

## Goal and reason for this packet

Plan 45 is owner-accepted as the initial symbolic comparison slice. Its close-pair
hint names an exact-derived denominator but does not help the learner find that
unit or construct equivalent fractions. The owner requested an optional path
that connects comparison to the accepted denominator-finding and renaming help.

Keep comparison short for learners using benchmarks, unit size or other valid
reasoning. When requested, offer a compact workspace in the current comparison
task: choose a common denominator, construct the two equivalent forms one at a
time, and use those forms to make the original relation decision. Do not turn
every comparison into a compulsory sequence of conversion checks.

Plans 24 and 25 supply accepted assistance behavior and exact checks; Plan 45
supplies the registered comparison batch, one-model limit, scoped response
lifecycle and replay. All are dependencies, not permission to change their
historical contracts. This packet is written ready, not dispatched or started.

## Required references and investigation

Read AGENTS.md, implementer-prompt.md, decision-log.md, development/README.md,
packet tracking guidance and relevant founding instructional, interaction,
architecture and quality contracts. Read Plans 24/25 and their accepted mechanism,
progress and owner records; Plan 45 adopted design, checkpoint-1-approval.md,
delivery-review.md, repair-01-review.md and owner-acceptance.md. Use the Phase 4
magnitude notes for context; no broad literature re-review is requested.

Trace actual source before proposing reuse: src/math/fraction.js and index.js;
content denominator validation/eligibility; interaction classification.js,
episode.js (task-help and transform-help handlers), scene.js, provenance.js and
replay.js; plan45-comparison-episode.js; render/plan45-comparison.js, existing
visual/linear denominator and transform controls; app.js scoped handles and
practice registration. Locate actual files rather than assuming historical names.

Existing help handlers rely on arithmetic state/content and schedule entries.
Do not fabricate an addition/subtraction instance to enter those handlers. Identify
which exact validators, pure helpers, prompts and control behavior genuinely
transfer, which require a small extraction, and which remain task-specific.

## Scope and non-goals

Own one optional assistance path within Compare fractions and the existing fixed
12-pair batch. No new learner goal, problem bank, general strategy chooser,
framework/dependency, random/adaptive selection, support tier, operation enum,
account/persistence, telemetry, new representation or wider architecture refactor.
No automatic larger-denominator bar admission, forced simplification, mandatory
common-unit task, result autofill, automatic relation selection or extra Finish.
No Bootstrap changes, push or deployment. Serialize shared source/build/routes
with any other writer; preserve their edits and historical evidence.

## Requirement 0 — investigate, propose and stop

Run `node scripts/dev/plan-status.js check plan-49` before starting. Inspect the
current comparison/help seams and propose exact owned paths, literal intents,
state/projection shapes, one concise copy sequence, response/draft/focus ownership,
denominator admission, replay/definition policy and discriminating evidence.
Show one close-pair journey and one recovery/withdrawal journey. Stop before source.

Bind these decisions at the gate:

1. Reuse the current single help disclosure, with an action such as “Use the same
   denominator.” No second competing Need help system. Put assistance controls
   next to the active assistance question. Present one current question at a time;
   replace completed instructions rather than accumulating a transcript.
2. Use local assistance phases within the comparison responsibility, not a new
   permanent encounter/convert/reflect schedule. Keep the original relation draft
   and comparison available; help may be closed/left without completing every
   substep. Completed learner work may remain as compact mathematical context.
3. The learner supplies the denominator; requested denominator-finding help must
   retain a meaningful contribution. Do not first show an item cue that supplies
   the very denominator the learner is then asked to discover. Reconcile the
   current numerical reasoning tip with this path and record any previously
   disclosed assistance honestly. Do not present assisted work as independent.
4. After a valid target, the learner constructs the first and second equivalent
   forms sequentially. Reuse requested multiplier/renaming help where appropriate.
   Do not display both completed forms, fill numerators or give the inequality in
   advance. Preserve originals and validate amount preservation upstream.
5. Name mathematical validity versus task admission. Non-least common denominators
   remain mathematically valid. Define an explicit bounded symbolic-workspace
   capacity and truthful recovery for valid-but-unavailable targets; do not inherit
   a bar segment limit as a rule of mathematical correctness. Audit all 12 pairs,
   including the benchmark pair whose least common denominator exceeds 30. The
   target can remain symbolic; existing original-denominator bars stay within
   their current capacity. Stop if a new representation capacity is necessary.
6. Preserve Plan 45's one chosen source model before relation acceptance. Neither
   help nor accepted conversions may reveal a second filled model. Both symbolic
   forms constructed by the learner are allowed; the final relation is still
   their decision. Show accepted paired verification only after correct comparison.
7. Pin definition/replay revisions and old/new intent validation before editing
   serializers. Do not silently change old replay outcomes or migrate old intent
   meaning. No schema number is preassigned by this packet.

## Requirement 1 — pure assistance contract and checkpoint

Use existing exact APIs for common-multiple validation, scale factors, equivalent
forms and comparison truth. Keep mathematical truth -> instructional state ->
presentation. Renderers submit raw responses; they do not validate mathematics or
choose instructional progression. Do not add per-item answer tables or model
arithmetic checks by prose. Derive targets from compact existing records.

Distinguish helper attempts/errors from final relation attempts and retain actual
requested assistance provenance. Closing/reopening or wrong answers preserve the
target, accepted substeps, unsent draft, selected source model and original relation
draft as appropriate. Changing the denominator invalidates dependent renamed work
explicitly; it does not change originals or silently keep mismatched forms.
Next, explicit restart and return/re-entry clear all assistance state.

Persist exact pure contract, admission audit, revision policy and tests at
reports/development/plan-49-optional-common-denominator-comparison-help/checkpoint-1.md.
Stop for orchestrator review before broad app/renderer/replay integration.

## Requirement 2 — concise mounted assistance and access

Implement only the approved contract. Retain shared typography and scoped response
ownership. Every current control uses current item/generation and render scope;
retired controls cannot mutate a later substep or item. Preserve accepted Plan 45
Repair 01 safeguards rather than closing over the mutable current handle.

Keep useful unit/operand context and the current prompt visible. Avoid duplicate
heading/question/error text, permanent explanatory paragraphs and spent controls.
If a side already has the selected denominator, do not require a meaningless
repeat conversion. More/Less keep the same optional capability and frozen support;
do not auto-open the workspace after errors or infer demonstrated mastery.

Provide keyboard, pointer, non-drag touch, linear and reduced-motion participation.
Keep labels and error associations meaningful, focus on a connected current control,
and preserve drafts through help toggle, view changes, resize and remount. No hidden
view may leak an unconstructed numerator, correct relation or second model.
Shared direct Next/final Back remains unchanged after comparison acceptance.

## Requirement 3 — evidence and validation

- [ ] Mechanism and pure checkpoint approved; required reports/artifacts exist.
- [ ] All 12 records audited by exact algorithms for target/admission paths;
  comparison alone still works without opening or finishing assistance.
- [ ] Deterministic tests cover valid least/non-least units, non-common units,
  malformed input, admitted/unavailable boundaries, exact conversions, equality,
  either source already using the target and supported operand orders.
- [ ] Mounted tests cover wrong denominator/multiplier/numerator and correction,
  close/reopen, abandoning assistance, target revision, relation draft continuity,
  view changes, retired controls, fresh Next/restart/re-entry and replay round trips.
- [ ] Independent exact-core oracles exercise learner responses; tests must not
  ask the classifier under test to supply its own expected answer.
- [ ] Bounded current-app browser journeys show a complete requested-help path,
  wrong/revised input, meaningful learner contribution, both views, keyboard and
  non-drag touch, no second model/answer leak and direct shared progression.
- [ ] Screenshots and measured question/control bounds at 360x740 and Chromebook
  1093x614 DPR 1.25 show local discoverability, no horizontal overflow and clear
  scroll reach where needed. Sample denominators by risk; no per-item screenshots.
- [ ] Small falsification seeds introduce real defects before ordinary assertions:
  premature constructed answers/second model, stale helper state or wrong conversion
  acceptance. Save actual failures and clean recovery; no seed-specific throws.
- [ ] Historical comparison/arithmetic/number-line semantics, replay fixtures and
  route objects remain intact. Any necessary revision is explicit and isolated.
- [ ] Focused checks while editing, then final unit suite, sequential build, one
  settled clean route matrix, packet lint and diff check. Preserve actual receipts
  and distinguish all-item algorithmic coverage from sampled browser evidence.

## Review, delivery and authority

This is substantial behavioral work: use one consolidated cold default-role
gpt-6.1-terra medium read-only pass after meaningful integration, per DECISION-052.
No Sol/Astra or silent substitution; no implementation-child fan-out. Record
requested settings, observed limits and each finding's disposition. Orchestration
does not duplicate that delivery's Terra pass; inspect significant concerns inline.
If unavailable, report degraded mode rather than substituting another tier.

Commit scoped implementation/evidence, then progress.md in the report folder
separately last. State exactly what was verified, how and what remains untested;
test counts do not establish learner understanding or physical-device/AT success.
Owner rendered-page and task acceptance remain required; deployment is separate.

Implementers may not set completion status, edit owner/orchestrator dispositions,
or declare the feature accepted/ready to ship. Report and stop. Stop for a blocked
preflight, conflicting writer, broader refactor, changed owner contract, missing
exact/capability seam or unresolved load-bearing design choice. Do not weaken
assertions, change historical contracts or expand scope to get a green report.

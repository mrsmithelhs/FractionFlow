---
id: plan-30
title: Compact Content Authoring Investigation
status: complete
resolution: "Owner accepted the independently verified compact-authoring investigation on 2026-10-10; production adoption is separately scoped to a bounded batch packet, not a one-item proof."
depends_on: [plan-21, plan-26]
gate: "Investigation only; owner/orchestrator acceptance of the proposed authoring and validation mechanism before production adoption."
summary: >-
  Measure per-item authoring after the accepted Next lifecycle, compare compact
  explicit data with deterministic reviewed recipes, and demonstrate a bounded
  offline batch using existing exact math and admission contracts.
---
# Plan 30: Compact Content Authoring Investigation

## Packet Metadata

- Packet id: `plan-30`
- Packet title: Compact Content Authoring Investigation
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-10-10
- Packet type: investigation
- Mutation level: reports and offline experimental evidence only
- Approval gate: accepted investigation before any production authoring change
- Expected artifacts: investigation, reproducible candidate evidence and progress report

## Goal and why this packet exists

Determine how another problem within the accepted task can become a compact data
addition plus deterministic validation. Plan 26 supplies navigation, reset and
identity machinery, but still repeats denominator-specific premise/reflection
authoring. The owner wants existing algorithms to establish arithmetic truth;
agent-written arithmetic and a separate lesson implementation per item are not
an acceptable scale strategy.

## Non-goals and dependencies

No production source, schema, registry or task-data changes; no additional live
problems, random selection, shared-factor admission, new learner tasks, adaptive
policy, persistence or deployment. Plans 21/26 supply the accepted inventory and
lifecycle. This investigation informs Plan 19's mechanism; it does not require a
general engine rewrite before family expansion. Typography is independent.

## Authority and contracts

Read `AGENTS.md`, `docs/decision-log.md` (especially DECISION-041),
`docs/development/README.md`, `reports/orchestration/content-authoring-and-scale-position.md`,
Plan 21's accepted investigation and Plan 26's progress/technical/owner dispositions.
Inspect the existing exact math core, content builder/generator, eligibility,
authored-task-data validator, registered definitions, replay and practice-set
composition. Use current exports and deterministic constraints; do not make
rendering responsible for truth or reinterpret a historical identity.
Read `reports/orchestration/maintainability-architecture-review-disposition.md`
for accepted investigation leads: duplicated authoring-revision maps, distributed
admission discovery and closure/renderer contract drift. Verify current facts;
these are inputs to the comparison, not authorization to repair production code.

## Scope and work plan

1. Inventory the actual per-item work and distinguish it from Plan 26's one-time
   lifecycle code. Identify authored instructional choices versus facts existing
   algorithms can compute. Record concrete files/fields and duplicated work.
2. Compare compact explicit records with a small reviewed deterministic recipe
   that materializes repetitive data. Show proposed records for a few candidates
   in the currently supported relatively-prime, proper-addition semantics. These
   are experimental proposals, not an adopted format or approved learner bank.
3. Produce one bounded, reproducible offline batch within current eligibility.
   Enumerate or sample with a recorded deterministic seed and bounds. Report unique
   ordered problems, swapped equivalents, admitted paths and refusals separately.
   Do not force a large count when actual supported variety is small.
4. Apply existing exact math, eligibility and authored-data checks to every
   proposed item/path: truth, complete eligible-unit coverage, unique/renderable
   choices with exactly one equivalent answer, premise outcomes and identity.
   Demonstrate corrupt-data rejection for wrong authored truth, duplicate choices
   and incomplete path data. If an existing check cannot detect a defect, record
   the gap; do not quietly create a production validator. Temporary experiments
   may live under ignored `dist/`; preserve a reproducible evidence script under
   this packet's report folder if needed, without wiring it into product tooling.
5. Specify future headless completion coverage for every admitted item/path and
   discriminating browser samples for geometry, help, motion, access and reset.
   Name what was actually executed versus proposed. Mathematical validity alone
   does not establish whole-episode closure or learner readiness.
6. Recommend the smallest adoption increment, exact write scope, versioning/replay
   treatment and remaining pedagogical review. Deliver the report and stop at the
   acceptance gate. A follow-on source packet or approved bounded amendment owns
   adoption; this packet never activates the candidate bank.

## Validation checklist

- [ ] Investigation and reproducible evidence exist under `reports/development/plan-30-compact-content-authoring-investigation/`.
- [ ] `progress.md` distinguishes observed behavior, proposed mechanisms and unswept dimensions.
- [ ] Deterministic algorithms establish truth; candidate/refusal counts and negative controls are auditable.
- [ ] Cost comparison identifies authoring still needing instructional judgment.
- [ ] No production or unrelated files changed; packet lint and diff check pass.
- [ ] Owner/orchestrator adoption gate is honored.

## Stop conditions and implementer authority

Run `node scripts/dev/plan-status.js check plan-30` before starting; stop on a
blocked preflight. Stop and report any need to widen accepted semantics, change
registered identities, use learner data or mutate production files. Do not set
packet status, edit orchestrator records, or self-certify completion/readiness to
ship. Report against the actual objective, apply the inherited advisor declaration
and disposition rules, commit only explicit owned report/evidence paths and commit
the progress report last. No push or deployment.

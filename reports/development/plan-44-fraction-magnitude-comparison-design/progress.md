# Plan 44 — Progress

**Orchestration closure 2026-10-31:** The owner adopted the revised task with one chosen model per problem and closed Plan44. Read adopted-task-contract.md for the binding rule; the report below records the investigator delivery before adoption. Plan45 is the separate ready implementation packet, with its source gate intact.

## Revision 1 — owner-directed report revision

The owner did not adopt revision 0's pre-answer aligned-bar comparison. Following the authorized bounded revision, the dossier now recommends a symbolic-first proper-fraction comparison: show both original fractions, ask for one `<`, `=`, or `>` judgment, and make at most one learner-selected source model available before acceptance. After acceptance, show both honest aligned bars as verification. The task offers authored hints for benchmark, same-unit, same-count, and close/equivalent reasoning, with recovery that preserves the response and permits switching the single model.

The dossier compares the direct inequality group with a First/Same/Second alternative and recommends the former for owner disposition. It defines two worked journeys, a 12-item exact-checked fixed batch, More/Less support consequences, accessibility parity, current source seams, replay boundaries, and deferred domains. This remains a recommendation only. Owner design adoption must precede an implementation packet; no comparison feature or packet was created.

### Evidence and checks

- Reran `node scripts/dev/plan-status.js check 44`; it reported `RUNNABLE`. The preflight was repeated for this revision.
- Rechecked the source review baseline against current HEAD `3677b51c82d011a39705fd1291a6d0c6d1b13a35`. The scoped math, content, interaction, support, bar, and control modules have no changes since the initial trace at `0a5904f46980f3438323a7d8fba893b4a329b771`. Refreshed Plan 39's packet/acceptance evidence; it is now closed, without physical-device or assistive-technology trial claims.
- Reran `node reports/development/plan-44-fraction-magnitude-comparison-design/evidence/exact-examples.mjs`. The exact core derived 12 outcomes balanced 4 less / 4 equal / 4 greater, checked proper-fraction and denominator bounds, and verified LCD-conversion relation invariance. `compareToBenchmark` derives `3/8 < 1/2 < 5/9`; the LCD of 72 is audit evidence, not a learner step.
- Reused the Phase 4 notes and skeptical reviews. No new literature search, browser capture, build, full test run, learner study, or advisor consultation was conducted or warranted for this report-only revision.

### Scope and disposition

Revision 0 remains in commit `37eaf70` as superseded history. The technical acceptance recorded in `orchestration-review.md` verified evidence and architecture tracing; it did not adopt the learner task. The owner-directed revision is in the dossier commit, with this progress record committed separately afterward. Orchestration review and owner design adoption remain outstanding. No source, tests, tooling, canonical documents, packet status, or board were changed; no push or deployment occurred.

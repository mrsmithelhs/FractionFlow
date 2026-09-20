# Plan 06 Progress Report — Scene Model Projection

**Report date:** 2026-09-19
**Packet status:** unchanged; remains `in-progress` and is owned by orchestration
**Ready for orchestrator review:** yes

## Summary

Implemented the bounded pure Scene Model projection approved for Plan 06. The projection consumes
validated Plan 05 episode state, an explicit representation role, and an explicit presentation mode.
It returns an immutable semantic scene or a frozen fail-closed capability refusal. It does not add a
DOM, renderer, app shell, condition switcher, learner-facing strings, deployment behavior, packet
status change, mathematical computation, eligibility evaluator, or instructional transition logic.

The implementation is in `src/interaction/scene.js`, exported through the existing interaction
barrel, with contract coverage in `tests/interaction-scene.test.js`.

## Mechanism approval and implementation shape

The mechanism proposal was approved by orchestration in
`reports/development/plan-06-scene-model-projection/mechanism-review.md`, recorded by commit
`f57cbf4 orchestration: approve plan-06 scene mechanism`. The approved shape is:

- `projectScene({ state, representationRole, presentationMode })` produces a discriminated union:
  `kind: "scene"` or `kind: "capability-refusal"`.
- `scene.meaning` contains semantic quantities, unit/count relationships, stable operand wholes,
  current task, available action, instructional status/recovery, operation meaning, known
  transition endpoints, capability evidence, and current support consequence.
- `scene.presentation.mode` contains only the selected presentation mode. Standard-motion,
  reduced-motion, and instant-test modes share identical `meaning` values.
- `scene.derivation` carries a safe source context and a recursively key-sorted canonical
  JSON-wire derivation key. It is a disposable snapshot, not a source of truth.
- `assertSceneCurrent(sceneResult, input)` is the enforceable delivery guard. A consumer must call
  it before accepting either a renderable scene or a refusal. `isSceneCurrent` provides the boolean
  form for admission checks.

The canonical serializer does not use ordinary object `JSON.stringify()` as its derivation key. It
validates JSON-wire values, rejects unsupported/circular/sparse data, safely preserves prototype-like
JSON keys, recursively sorts record keys, and serializes arrays in index order. The source context
binds every content fact the projection consumes: operand exact/current/source forms, capability
verdicts, alternate-representation recommendation, and result `wholeSpan` only after Plan 05 has
established operation/result meaning. This prevents content mutation from silently making a scene
stale while keeping unreached result data out of the renderable scene before establishment.

## Fail-closed capability behavior

The projection uses the explicit Plan 05 role-to-verdict mapping and never recomputes eligibility.

- `number-line` requires the upstream `not-in-phase-2` verdict and returns an explicit refusal with
  no fabricated symbolic continuation.
- A fraction-bar path whose established rendering verdict is `ineligible` returns
  `valid-but-outside-representation-capability`; a symbolic continuation is carried only when the
  established upstream path supplies it.
- An ineligible instance follows the same fail-closed rule and only exposes the upstream reviewed
  symbolic continuation recommendation.
- A valid path outside authored coverage remains a renderable scene with
  `authoredCoverage: "outside-authored-coverage"`; it is not collapsed into capability
  ineligibility.
- Unsupported role or presentation inputs, missing verdicts, malformed state, inconsistent
  capability data, and unresolved transition endpoints throw typed projection errors before a
  consumer receives a result.

## Requirement evidence

1. **Pure projection and deterministic meaning.** Two projections from identical inputs are deeply
   frozen and have equal serialized meaning. No history arrays are emitted. The semantic shape
   contains quantity, unit, count, stable whole, current task, available action, status, and
   pre/post relationship fields for a later linear alternative.

2. **No downstream mathematical or eligibility authority.** The module imports content freezing,
   Plan 05 content identity, and active-condition validation only. It has no math or eligibility
   imports, no `BigInt`, no denominator/result evaluator, no correctness evaluator, no DOM/browser
   API, and no renderer dependency. It copies established Plan 05 facts rather than calculating
   them.

3. **Presentation-mode equivalence.** Contract tests project the same post-state through
   standard-motion, reduced-motion, and instant-test modes and assert identical `meaning` with only
   `presentation.mode` differing.

4. **Stale and unsupported inputs are stopped before a consumer.** Stub-delivery tests call
   `assertSceneCurrent` before delivery and prove that stale scenes, stale capability refusals, and
   capability refusals never enter the delivery list. Role and presentation changes also invalidate
   the derivation key.

5. **Semantic linear alternative contract.** Tests assert the presence of quantity, denominator
   unit, numerator count, stable whole, current task, available action, status, and known
   transition endpoints while also asserting that an unestablished raw result and preferred final
   form remain `null`.

6. **Replay/source boundary.** Replay tests reconstruct equal scene meaning, content identity,
   episode-definition identity, support configuration, and learner-intent sequence. The replay
   envelope contains no presentation mode or scene snapshot, so presentation is not replay
   authority.

7. **Condition expressiveness.** Contract fixtures cover every currently declared D-01, D-02,
   D-05, and CM-01 arm, including CM-01 matching, distractor, and elaboration forms. Every arm
   produces the same structural scene schema while the upstream active condition is copied into
   the meaning; no runtime registry, switcher, persistence, or learner-facing label system was
   added.

8. **Established-only disclosure and whole semantics.** Before establishment, future common
   denominators, converted forms, operation results, preferred final forms, result spans, and
   transition endpoints are absent or null. A crossing-one fixture proves each proper operand keeps
   a stable `0..1` whole while the established result may have a separate `1..2` `wholeSpan`.

## Advisor consultation disposition — Branch A

This packet has a real behavioral surface. Before considering a degraded Branch C path, the complete
callable runtime inventory was inspected: a bounded reviewer child role and an independent model
override were callable. Branch A therefore ran at depth one.

- **Requested advisor model:** `gpt-6-astra`.
- **Observed advisor model:** the reviewer stated, “GPT-6, running as a Codex agent in this API
  session.” The exact backend model identifier/snapshot was not exposed to the reviewer, so this
  report does not claim that the requested variant was independently observable.
- **Reviewer:** bounded reviewer child `01a0bc86-cb4b-79b3-96b5-7501b57fd949`.
- **Brief/posture:** explicit no-write, no-status-change, no-report-edit, no-child instruction;
  actual source and tests were inlined into the brief. Structural read-only was not exposed as
  verifiable platform metadata, so the honest posture is **instruction-read-only with post-hoc
  verification**.
- **Immediate post-consultation status check:** unchanged working tree containing only the three
  Plan 06 implementation/test paths (`src/interaction/index.js`, `src/interaction/scene.js`, and
  `tests/interaction-scene.test.js`); no report edits, packet edits, or child-created changes.
- **Coarse consultation cost:** one depth-one advisor review plus a primary repair-and-validation
  pass; the runtime did not provide a reliable elapsed-time measurement, so none is inferred here.

### Findings and disposition

| Reviewer claim | Independent verification and disposition | Resulting change |
|---|---|---|
| P2: the second conversion's `pre` endpoint reset the already-converted operand to its initial form. | Accepted. A two-conversion Plan 05 state was traced and the defect reproduced: the unchanged left operand would have moved from `8/12` back to `2/3`. | `transitionMeaning` now matches the established current conversion to its Plan 05 provenance record and obtains the immediately preceding established conversion forms from that record's upstream `resultingState`. A second-conversion endpoint regression test was added. Missing preceding authority now fails closed with `UNRESOLVED_TRANSITION`. |
| P2: canonical copying could lose an own `__proto__` JSON key and accepted sparse arrays, creating derivation-key collisions. | Accepted. The counterexamples were valid against the original copier. | Record copies now use a null prototype; array inputs must have dense JSON indices and no extra keys. Tests cover prototype-key distinction, sparse-array rejection, and recursively reordered nested keys. |
| Question: freshness did not visibly bind every content fact read by the projection. | Accepted as a robustness gap. The projection reads operand exact/current forms, capability verdicts, alternate recommendation, and—after establishment—result span; the original identity helper did not bind all of those. | Added `contentProjection` to the safe derivation source context, with result `wholeSpan` gated on operation/result establishment. Tests mutate operand exact value and established result facts and prove old scenes become stale. |
| Question: source context includes `expectedResponse`, `established`, and `pendingResponse`, so strict disclosure was not fully verified from the inline artifact. | Rejected as a confirmed defect after tracing Plan 05 state semantics and the final projection. These are upstream instructional source facts, not learner-history arrays; unestablished result/transition fields remain null or absent, and future result span is explicitly gated. Established-only and no-history tests cover the renderable output. | No scope expansion. |
| Question: stale refusals, role/mode changes, reordered keys, and deeper condition coverage were omitted from the first test set. | Accepted as useful coverage rather than a separate implementation defect. | Added stale-refusal delivery, role/mode stale-key, recursive key-order, semantic linear-alternative, replay identity/action, and expanded contract assertions. |

The consultation was advisory only; it did not set packet status or replace the orchestrator gate.
All repairs were made by the primary implementer, followed by the full validation suite.

## Validation commands and results

- `node scripts/dev/plan-status.js check plan-06` → `RUNNABLE: plan-06 is ready to implement`.
- `npx vitest run tests/interaction-scene.test.js` → 20 tests passed.
- `npm test` → 12 test files and 153 tests passed.
- `npm run build` → Vite production build passed.
- `node scripts/dev/plan-status.js lint` → `lint: OK (no violations)`.
- `git diff --check` → no whitespace errors. Git emitted only the existing LF/CRLF normalization
  warning for touched files.
- Static source scan → no DOM/browser API, renderer, math, or eligibility authority references in
  `src/interaction/scene.js`.

## Commits and scope

- `caf56c2 feat: add plan-06 scene projection`
- `c88212f test: tighten plan-06 scene guards`

Only the approved Plan 06 implementation and test paths were committed before this report. The
progress report is the final scoped repository artifact and will be committed separately. No push
was performed. Packet frontmatter, generated packet indexes, Plan 05 source, render/app paths, and
deployment configuration were not changed.

## Problems and remaining risks

- Git metadata writes required narrowly scoped elevation because the managed Windows sandbox denied
  creation of `.git/index.lock`; a read-only check confirmed no lock file existed. No lock was
  deleted and no ACL was changed.
- Git emitted a permission warning while reading the user's global ignore file; it did not affect
  staging, tests, lint, or the final scope check.
- Plan 07 must preserve the `assertSceneCurrent` admission boundary before any renderer receives a
  scene or capability refusal. This packet deliberately provides only a stub consumer.
- Condition fixtures demonstrate one schema without creating the future runtime condition system;
  Plan 09 remains responsible for switching/persistence/labels.
- The advisor could report only a runtime-family description rather than the exact requested model
  identifier; that limitation is recorded rather than inferred away.

The implementation is ready for orchestrator artifact review. The orchestrator/owner must decide
packet lifecycle status; this report does not declare Plan 06 complete.

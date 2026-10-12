# Plan 17 — Crossing-One-Whole Addition

Date: 2026-10-11 (America/New_York)
Status: implementation delivered for technical review; owner screen/agency acceptance remains open.

## Scope and gates

Requirement 0 was completed first. The exact proposal was committed as `76593c9`,
sent to FF Orch 12+, and source work began only after explicit mechanism approval.
The approved mechanism review is recorded in `mechanism-review.md`. The owner
approved one bounded additional test path, `tests/route-contract.test.js`, for
live route counts and an independent frozen-prefix/appended-route assertion.
No packet status, orchestrator disposition, push, or deployment was changed.

## Baseline and identities

The starting live set was revision 3 with ten items. Plan 17 appends item 11 in
revision 4; the previous ten item identities and registered route assertions are
preserved. The matrix retains its original 54-route prefix byte-for-byte under
the approved canonical JSON SHA-256
`861c315fa1cff3a3e3daa949c53c41a27d7bf27ba54a0981b02a5bd3f0e87650`
(original committed matrix file SHA-256
`2252458a767a322b23946b701085958eafc2fb0f9c416d4a8c3ee4c6bafa8cbd`).
One Plan 17 route is appended, for 55 route rows and 57 expanded browser
executions. It reaches the eleventh item through the learner goal and
completion-gated Next controls after the ten existing items.

## Implemented behavior

- Registered the exact Plan 17 item, fixture, recipe, authored record and
  revision-1 episode definition for `2/3 + 3/4`. Per-item definition handling
  keeps prior definition meanings and admission behavior intact.
- Authored denominator paths 12 and 24 use the existing exact arithmetic APIs.
  The canonical result is raw `17/12`; the alternate path retains raw `34/24`.
  The two result rows carry validated wire quantities upstream. Scene projection
  has `resultStack: null` before a correct total, and exposes the authored rows
  only after correct operation acceptance. The renderers paint those quantities
  and do not calculate mathematical truth.
- The registered materializer pins the fixture identity to the reviewed
  operands 2/3 and 3/4. A regression test rejects altered operands under the
  same identity. Mathematical invalidity, representation overflow, and missing
  authored task data remain distinct: invalid pairs stay invalid, an
  out-of-capability path is refused upstream, and an out-of-coverage path does
  not get invented or treated as renderer refusal.
- The visible stack preserves both equal-width wholes and the same unit
  subdivision count in each row. The accepted result remains an improper
  fraction; no clamp, shrink, or truncated second whole is used. The accepted
  conversion animation, operate, accepted stack, Replay/Inspection Mode and
  reflection share the measured primary-region layout contract. Replay and
  Inspection temporarily replace that region and restore the appropriate task
  and learner draft on dismissal.
- The reviewed premise policy is false at 12 (`7/12`, response “no”) and true
  at 24 (`16/24`, response “yes”). Reflection choices retain authored ordering:
  at 12, `8/12`, `2/12`, `9/12` with the first choice correct; at 24,
  `2/24`, `15/24`, `16/24` with the third choice correct. Existing task
  validation checks the complete records.

## Verification evidence

- `npm test`: 34 files and 348 tests passed, including exact fixture/coverage,
  scene timing, renderer row geometry, route contract, and existing Plan 19/32
  compatibility tests.
- `npm run build`: learner application and subtraction prototype builds passed.
- `node scripts/dev/plan-status.js lint`: no violations.
- `node scripts/dev/plan-status.js check plan-17`: RUNNABLE.
- `npm run test:routes`: all 57 browser executions passed across the 55 route
  rows, including `ROUTE-PLAN17-APPENDED-ITEM-REACHABLE`.
- A real Edge/Playwright capture and independent verifier cover 16 scenarios:
  denominators 12/24, all four registered conditions, high/medium support,
  both 360×740 and 360×752 reference viewports, visual and linear views,
  reduced motion, a touch interaction, and real keyboard Tab navigation.
  Each scenario records wrong-answer recovery and withholding, recovery help,
  correct acceptance, Replay, reflection, reset, question/control reachability,
  and scroll position. The actual Tab walk reaches the return control without
  forced focus.
- Before-answer scanning checks all body text including hidden text, visible
  text, attribute values (including ARIA and data attributes), labels, live
  regions, form values, and mounted result-stack nodes. A deliberately corrupted
  hidden sibling carrying result text, `aria-label`, and `data-answer` is
  rejected, then removed; the restored clean witness passes. This is separate
  from wrong learner-answer rejection.
- Mounted fail-first geometry checks remove the remainder row, resize the second
  whole to 60%, and remove a shaded segment. Each corrupted witness is rejected;
  the original is restored in `finally` and then passes. The evidence records
  equal row/track widths and shading counts of 12 and 5 at denominator 12, and
  24 and 10 at denominator 24. The verifier passes all 16 scenarios and all 48
  accepted/reflection/Replay screenshots.
- Vertical scrolling is present at the short reference viewport: captured
  document height reaches 968 CSS px with a maximum vertical scroll range of
  228 px in the measured scenarios. The question and controls were explicitly
  scrolled into view and verified reachable; there is no horizontal overflow.
  Screenshots and raw measurements are in `evidence/captures/`.
- `git diff --check` passed. The independent matrix contract asserts the
  frozen pre-Plan-17 54-route prefix hash and verifies the exact appended route;
  the full route suite then executed that appended route successfully.

## Advisor disposition

One read-only consultation was attempted under the owner’s Sol-class, low/medium
limit. The provider record marked Codex advisor-capable; the advisor identified
itself as GPT-6.1 Sol and low effort, but that runtime identity is self-reported
and not independently verifiable by the harness. The advisor made no edits and
was explicitly instructed to remain read-only. Its finding that the registered
fixture identity should also pin the operands was accepted and implemented with
a focused test. Its concern about hidden pre-answer leakage was also accepted
as an evidence question and resolved by the mounted hidden-sibling falsification
check above. Other listed architecture concerns were reviewed against the
implementation and were not confirmed. Consultation disposition: consultation
ran; read-only was instruction-enforced; actual model identity remains
self-reported.

## Remaining gate

This report establishes implementation and technical evidence for review. It
does not establish owner rendered-screen/agency acceptance or authorize packet
completion, deployment, or broader lesson scope. The captured short-viewport
vertical scroll is recorded as observed and was not treated as a defect because
the actual question and controls remain reachable.

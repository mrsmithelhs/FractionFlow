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

## Repair 01 — conserved scale and evidence repair

Date: 2026-10-11 (America/New_York)
Repair commit: `10ab185`.

FF Orch 12+ independently reproduced two product defects and three evidence
gaps in `delivery-review.md`; `repair-01.md` authorized this bounded repair
within the existing source/test/evidence paths. The status preflight now reports
`BLOCKED: plan-17 has status "delivered"`. Repair 01 explicitly authorized the
work despite that lifecycle state. No packet status or orchestrator disposition
was changed.

### Corrections

- The accepted stack now reserves the same 3rem readout column and 0.75rem gap
  used by operand tracks. This removes the measured 218px-to-278px change without
  hard-coding a track width. At 360×740 the 12- and 24-unit detailed witnesses
  measured 218px for both settled operand tracks, both operate tracks, and both
  accepted result rows. Segment-width spread across those states was within the
  1.1px browser-pixel-rounding allowance.
- The Plan 17 episode constructor resolves the exact registered authored record
  and compares both supplied initial operand forms with that fixture before it
  constructs the schedule. A valid `2/3 + 1/2` instance bearing the pinned Plan
  17 provenance now throws `UNSUPPORTED_CONTENT_FAMILY` at construction. A
  focused regression proves the same candidate remains constructible under the
  existing Phase 2 reflection definition.
- Capture expectations for every prior item, path, row count, mixed form, and
  reflection matching choice now come from `convertToDenominator()`,
  `addAtCommonDenominator()`, `improperToMixed()`, and the authored catalog.
  The script no longer duplicates fraction scaling/addition to act as its own
  oracle.
- The pre-answer guard now detects raw fraction strings, spoken improper and
  mixed forms, and structured numerator/denominator markup. Three independent
  mounted hidden-sibling seeds isolate a structured fraction, a spoken
  `aria-label`, and a mixed-equivalent arbitrary `data-answer` attribute. Each
  seed has no forbidden result-stack class and no companion raw text/ARIA/data
  leak; each fails the same guard, is removed in `finally`, and is followed by a
  passing clean check. Wrong learner-answer recovery remains a separate witness.
- Keyboard evidence now uses sequential Tab, typing, and Enter for the sampled
  Plan 17 interactions. After an incorrect total, focus was observed on `BODY`;
  one sequential Tab reached the response input, and keyboard typing/Enter
  submitted the correction. The scenario then completed, inspected Replay,
  selected the reflection response, and reset. No forced focus, locator fill,
  or locator click was used in that Plan 17 keyboard segment.
- The touch scenario taps the mounted Plan 17 episode controls through reset
  (12 control taps in the capture). Playwright supplies numeric field text after
  the input is tapped; this does not establish native on-screen keyboard typing.
- The route verifier reads the pre-implementation matrix from immutable commit
  `76039520d9bfc1c8b2c4b102ca39975fc7a87466`, rather than `HEAD`. It separately
  verifies the baseline file-byte SHA-256
  `2252458a767a322b23946b701085958eafc2fb0f9c416d4a8c3ee4c6bafa8cbd` and
  canonical JSON hash for the original 54 route objects
  `861c315fa1cff3a3e3daa949c53c41a27d7bf27ba54a0981b02a5bd3f0e87650`.
  Current original objects compare canonically equal. The complete current
  matrix file bytes differ, as expected from the appended Plan 17 route; that
  difference is recorded separately and is not reported as byte equality.

### Repair evidence and validation

- The browser capture now contains 32 scenarios: 16 target/condition/support
  combinations across both 360×740 and 360×752 heights, plus 16 reciprocal
  high-linear and medium-visual samples. Both denominator paths have targeted
  rest, active-conversion Replay with a retained draft, “Show new parts”
  dismissal, last-conversion immediate and settled addends, operate-before,
  operate-after-wrong-answer, and accepted-result geometry. Help content is a
  required assertion in every scenario.
- Question and control bounds/reachability and actual scroll values are saved
  for the targeted states. Maximum observed vertical scroll range is 423px in
  these short viewports; the measured question and controls remain reachable.
  No horizontal overflow was observed. This records normal vertical scrolling
  without claiming an unscrolled viewport.
- `node .../verify-plan17-crossing-addition.mjs` passed **after commit `10ab185`**:
  32 scenarios, 16 reciprocal samples, immutable route baseline confirmed,
  keyboard correction recorded, 12 touch control taps, two targeted conserved
  scale/Replay samples, and 110 non-empty screenshots.
- `npm test`: 34 files, 349 tests passed.
- `npm run build`: learner app and subtraction prototype builds passed.
- `npm run test:routes`: 57/57 browser executions passed across 55 rows,
  including the preserved original route prefix and appended Plan 17 reach route.
- `node scripts/dev/plan-status.js lint`: no violations. The read-only packet
  check reports delivered and blocked for new work; the explicit Repair 01
  authorization governed this bounded follow-up.
- `git diff --check` and the staged diff check passed. The refreshed verifier
  makes no historical-baseline claim from the current branch head.

### Advisor and remaining gates

Repair 01 used orchestrator-gate-only review. No additional advisor was invoked:
this thread could not verify a Sol-class low/medium advisor configuration, and
the authorized orchestrator supplied the concrete reproductions and exact
repair bounds. No advisor read/write posture is claimed for this repair.

Repair 01’s implementation and evidence are delivered for technical review.
Owner rendered-screen/agency acceptance remains open; packet completion and
deployment remain separately gated. Physical Chromebook behavior, native touch
keyboard typing, assistive-technology behavior, and user-study agency were not
tested.

## Repair 02 — cycle-safe capture and canonical resolve cue

Date: 2026-10-11 (America/New_York).
Repair commit: `86b9d1e`.

FF Orch 12+ authorized Repair 02 in `repair-02.md` after the Repair 01 review
found a cyclic serialized witness and requested a stronger two-row scale
falsification plus a concise Plan 17 resolve cue. This work used the existing
approved renderer/test/evidence paths, with `src/render/strings.js` newly
approved for the cue. No packet status or orchestrator disposition was changed.

### Corrections

- Capture measurements now serialize a finite layout snapshot rather than a
  cyclic layout object that referenced its accepted parent. The exact full
  capture completed and wrote all 32 scenarios.
- At each detailed denominator witness, the mounted capture resizes both
  accepted result rows equally to 60% (130.8px each). This preserves their
  internal equality but the cross-state scale witness rejects the mismatch
  against 218px settled conversion and operate tracks. The capture then restores
  both rows to 218px and requires the clean cross-state witness to pass. The
  existing one-row resize and truncated-remainder falsifications also reject.
  This runs at both 12 and 24. The separate corrupted rendered-fact seed is
  rejected and restored; it is distinct from wrong learner-answer rejection.
- For the canonical 17/12 result, visual and linear resolve now use the concise
  cue “That's right.” The 34/24 path retains its authored alternate-form notice
  (“34/24 is correct! It can also be written as 17/12.”). Historic resolve
  behavior remains on other registered definitions. A mounted app test and the
  full capture assert both paths in both presentations.

### Repair evidence and validation

- `node .../capture-plan17-crossing-addition.mjs` completed the full 32-scenario
  Edge run: both denominator paths, all four registered conditions, high and
  medium support, 360×740 and 360×752 reference viewports, visual/linear views,
  reciprocal presentation samples, reduced motion, touch, and real sequential
  keyboard navigation. It captured 110 screenshots and recorded question and
  control bounds plus actual scroll state. Vertical scrolling remains present;
  the captured questions and controls are reachable, with no horizontal
  overflow. Help-content assertions remain required per scenario.
- The mounted witnesses reject a truncated second whole, a resized second whole,
  and pre-answer result leakage, then pass after restoration. Wrong-answer
  rejection remains a separate learner interaction. The previous evidence also
  records recovery/help, Replay, reflection, and reset. No forced keyboard focus
  is used.
- `node .../verify-plan17-crossing-addition.mjs` passed after commit `86b9d1e`:
  32 scenarios, 16
  path/condition/support sets, 16 reciprocal samples, 110 screenshots, the two
  denominator-specific cross-state scale witnesses, route-baseline comparison,
  keyboard correction, and 12 mounted touch-control taps.
- `npm test`: 34 files and 350 tests passed. The focused app/render tests passed
  5/5, including the two denominator-specific resolve cues.
- `npm run build`: learner application and subtraction prototype builds passed.
  The initial unprivileged build was denied when creating the generated nested
  `dist` output; the same build passed with managed Windows elevation.
- `npm run test:routes`: 57/57 browser executions passed across 55 route rows,
  including the appended Plan 17 route. The initial unprivileged Edge launch
  could not write its temporary profile; the elevated rerun passed.
- `node scripts/dev/plan-status.js lint` and `git diff --check` passed.
  Advisor disposition remains orchestrator-gate-only: this thread could not
  verify a Sol-class low/medium consultation configuration, and no advisor was
  called.

Repair 02 is delivered for technical review. Owner rendered-screen/agency
acceptance remains open; packet completion and deployment remain separately
gated. Physical Chromebook behavior, native touch keyboard typing,
assistive-technology behavior, and learner-study agency were not tested.

# Plan 42 — Stage 3 parity evidence

Date: 2026-10-21. Production source remained at corrected extraction B,
`436e54a0ed58ff8437a22e61815c2c3da098954d`. The evidence below is for technical
review; it does not set packet status or record owner acceptance.

## Matched mounted captures

Fresh screenshots were captured from baseline A (`d7936a71bbbb099fb9394a727bbac1d751e79afa`)
and production B (`436e54a`, in a checkout whose report-only HEAD is
`b0137a1c1d0f6df277a36a46dbfd6aff891e471a`). Both builds were completed before
their captures. The Playwright browser was Chrome in a 1× device-scale-factor
context. Mobile captures used 360×740 with touch capability enabled; desktop
captures used 1366×768. The registered Plan 38 and Plan 34 route action prefixes
mounted the real learner controls. Playwright pointer clicks and numeric fills
then exercised closed/open task help, repeated response context, local draft
values, wrong-answer recovery, and the visual-to-linear transition. No route file
or application source was changed by the capture scripts.

The sample contains nine paired states: fraction-pair visual closed/help-open/
recovery; fraction-pair linear after-switch/help-closed/help-open; and single
numeric visual/linear controls plus linear recovery on desktop. The single-input
operation does not expose task-specific help in this state, so help is recorded
as not applicable there. All nine measured
state objects matched between A and B, including input values and focus, help and
recovery visibility, active view, direct children and their bounds, viewport,
DPR, scroll, document dimensions, and horizontal overflow. Eight of nine PNG
SHA-256 hashes matched. The single visual desktop image differed at the pixel
level while all recorded layout/state measurements matched. The capture was near
an existing subdivision animation; timing may explain the pixel variation, but
the receipt does not record active-animation state. The parent independently
inspected that pair and observed no visible layout difference.

Ordinary vertical scrolling remains available. In the mobile visual fraction
state, the task-help control extends below the initial viewport and is reachable
by scrolling; the bounds and placement match between A and B. The positive
viewport measurements therefore establish parity for the sampled layout, not
that every control fits in the first 360×740 screen.

The comparison data and per-state observations are in
[`evidence/matched-parity-comparison.json`](evidence/matched-parity-comparison.json).
The nine paired screenshots are in [`evidence/`](evidence/). The capture script
is [`capture-operate-parity.mjs`](capture-operate-parity.mjs).

## Production route and seed checks

The unchanged production route matrix ran with the explicit Chrome channel:

```text
node scripts/dev/run-route-matrix.js --browser-channel chrome --quiet
81 route rows; 83 browser executions; 83 passed; 0 failed
```

Contexts included 49 historical-v4 executions, 28 production-default-v7, four
prototype, and two historical-v6. Before the run, the report wrapper snapshotted
tracked matrix screenshots and report JSON/PNG outputs. It restored them after
the run and checked their bytes against the snapshots; every checked restoration
was exact. The browser-matrix receipt is
[`evidence/production-b-route-matrix.json`](evidence/production-b-route-matrix.json).
The baseline and final static-build commands and outcomes are summarized in
[`evidence/build-receipts.json`](evidence/build-receipts.json).

Targeted Chrome seeds on production B detected their intended injected failures:

- Plan 38 operation-draft-loss and operation-wrong-focus guards: each executed
  one route and detected its intended assertion.
- Plan 38 premature-answer-leak: intended answer-disclosure assertion detected.
- Plan 40 erased-takeaway-hatch-after-transform: intended hatch-visibility
  assertion detected.
- Motion no-op-keyframes: intended in-progress-boundary assertion detected.

Each seed command and its receipt are recorded as
[`evidence/production-b-plan38-operation-draft-loss-route-matrix.json`](evidence/production-b-plan38-operation-draft-loss-route-matrix.json),
[`evidence/production-b-plan38-operation-wrong-focus-route-matrix.json`](evidence/production-b-plan38-operation-wrong-focus-route-matrix.json),
and the other `production-b-*-route-matrix.json` receipts in the evidence folder.
The reusable snapshot/restore runner is
[`capture-parity-matrix.mjs`](capture-parity-matrix.mjs). The motion seed uses a
filtered runner mode and reports one intended seed failure detected with zero
unexpected failures; seeded runs are not counted as positive route passes.

The guarded baseline full-matrix attempt is also recorded. It ran 79 of 83
executions successfully and failed only the four subtraction-prototype rows
because the baseline was built with the learner-only command and did not contain
the prototype bundle. This is a build-input limitation, not a reproduced
product-parity defect. Per parent direction, baseline A was used for matched
operate captures without repeating the complete matrix. The complete production
build includes both learner and prototype outputs and passed all 83 executions.

The Stage 2 implementation run recorded 496 unit tests passing at B before Stage
3. The parent separately ran mounted Chrome samples for both views, pointer/
keyboard toggle focus, touch-enabled context, and reduced motion; see the
parent-owned `independent-browser-review.json`. Physical touch hardware,
keyboard-only certification, and assistive-technology behavior were not tested.

## Interpretation

The sampled response states preserved draft values and focus through the view
switch, kept the help cue and shell recovery feedback within the current mounted
response state, and retained the same measured control geometry and direct-child
structure across the extraction. No browser reproduction justified expanding
production source scope. This parity evidence does not approve the temporary F1
copy or alert-association experiment; neither is part of production B. The cold
F1 pilot's concrete result remains improved edit locality (four render files to
three) with no measured overall time or token benefit, as recorded in the
parent-owned maintenance evaluation.

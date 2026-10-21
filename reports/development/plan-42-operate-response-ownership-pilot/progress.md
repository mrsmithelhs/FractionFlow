# Plan 42 implementation progress — Stage 3

Date: 2026-10-21. Stage 3 parity evidence is committed in `5d07ebe` against
production extraction B `436e54a0ed58ff8437a22e61815c2c3da098954d`. No production
source, route definition, test, or packet-status file changed during this stage.

## What was verified

- Built baseline A at `d7936a71bbbb099fb9394a727bbac1d751e79afa` with
  `npm run build:learner`, and built B with `npm run build` before taking the
  matched captures.
- Captured nine matched mounted Chrome states across 360×740 mobile and
  1366×768 desktop contexts. All nine state/layout measurement objects matched;
  eight screenshot hashes matched. The ninth image differed at pixel level,
  while its recorded UI state and bounds matched. See `parity-evidence.md` and
  `evidence/matched-parity-comparison.json`.
- Ran the ordinary final B route matrix using
  `node scripts/dev/run-route-matrix.js --browser-channel chrome --quiet`:
  81 route rows, 83 executions, 83 passed, 0 failed. Historical route PNG/JSON
  outputs were snapshotted, restored, and checked byte-exactly.
- Ran five intended-failure seeds on B: Plan 38 operation draft loss, wrong
  focus, and premature answer leakage; Plan 40 erased takeaway hatch; and the
  motion no-op-keyframes witness. Each detected its intended assertion with no
  unexpected failure. Receipts and reproduction commands are under `evidence/`.
- The Stage 2 implementation run had recorded 496 passing unit tests at B.
  Parent also independently ran mounted Chrome route samples for visual and
  linear views, focus across pointer/keyboard toggles, touch-enabled context,
  and reduced motion. The parent reviewed this Stage 3 evidence and accepted it
  technically; those results and limits are recorded in
  `independent-browser-review.json`.

## Baseline limitation and interpretation

The baseline full-matrix attempt ran 79 of 83 executions and missed only four
prototype rows because A had been built with the learner-only command. The
failed prototype routes required a prototype bundle. This was a baseline build
input limitation, not a reproduced extraction regression; the complete B build
includes learner and prototype bundles and passed the full matrix. Per parent
direction, A was not rebuilt or rerun through another full matrix; it was used
for the matched operate captures.

No browser reproduction justified expanding production source scope. The
measured parity covers sampled mounted Chrome states, not physical touch
hardware, assistive technology, or keyboard-only certification. The capture
report notes that ordinary scrolling is needed to reach the mobile visual help
control from the initial viewport.

The bounded F1 maintenance pilot remains separate: it showed improved source
edit locality from four render files to three, but no measured overall time or
token benefit. F1 copy and alert association were not adopted in production.
Parent technical review does not close MAINT-42-A or make owner decisions.
Owner acceptance and packet/status records remain with the parent/orchestrator;
Plan 39 and other deferred questions remain outside this stage.

## Review and advisor record

No new advisor review was commissioned for this evidence-only stage. The
source/lifecycle extraction had already received the bounded Sol-medium review
and parent review recorded in `extraction-review.md`; the parent independently
sampled the mounted behavior and this report's receipts. This stage recommends
no product change and claims no owner acceptance.

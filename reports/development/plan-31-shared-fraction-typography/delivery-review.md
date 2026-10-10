# Plan 31 delivery review

Date: 2026-10-10. Reviewed implementation/evidence `4e1e8b1` and progress `f39aad0`.
Orchestrator-owned; packet received and set delivered before verification.

## Disposition

Bounded Repair 01 required before technical acceptance. No blocking product-code
defect is confirmed. The change preserves the intended shared compact notation,
persistent numerator/denominator update references, outer readout lanes and native
linear matching buttons. Owner rendered-screen acceptance remains outstanding.

## Independent verification

Root inspected source, route-matrix diff, capture script and saved measurements;
viewed the 24ths narrow bar and linear reflection screens plus the 180px effective
viewport reflection screen. Divider widths match the wider padded numeral boxes
in all visible measured readouts; lane widths remain 48 CSS px. Nineteen captures
record no horizontal overflow. Full-page screenshots show vertical scrolling.

Root reran five focused test files: 72 tests passed. Root independently reran
`ROUTE-FOCUS-INSPECTION-RESTORE-LINEAR` in headless Edge: 1 passed, 0 failed.
The initial sandbox launch failed before a route ran; a narrowly elevated local
run succeeded. A first result-output wrapper referenced a nonexistent summary
field; the corrected wrapper confirmed the actual runner result. These are
environment/wrapper events, not application defects.

The implementer's full browser matrix used the old focus-class oracle and had
one failure; its focused rerun passed after the exact class serialization update.
Root verified the updated selector retains the first-choice focus assertion.
No new full-matrix success is inferred from that filtered result.

Fresh-context read-only review found no blocking source defect but identified a
verified leakage-test regression. Root independently reproduced it using the
exact extracted helper and existing mock DOM, without editing files.

## Required repairs

1. `render-foundation.test.js` replaced whole-container no-future-answer text
   checks with a helper whose raw-text and accessible-attribute scans inspect
   only the active beat. Its structured branch still inspects the whole root.
   A sibling completed-history region with `Final answer 11/12` and an
   `aria-label` containing `11 over 12` passes the new helper. Restore whole-root
   coverage for every branch while retaining the active-target existence assertion.
   Seed sibling raw text and sibling accessible attributes independently.
2. The saved capture script exercises only the original `2/3 + 1/4` problem.
   The packet explicitly requires both current items. Capture the accepted
   second item through real Next, with identity/forms, both eligible units,
   narrow/Chromebook bar and linear question/button evidence. See `repair-01.md`.

## Limits and scope

The 180x370 viewport approximates 200% zoom; native browser zoom was not tested.
Physical devices and assistive technology remain untested. The approved complete
fieldset legend substitutes for the aria-hidden visible matching heading; actual
screen-reader navigation/announcement remains a limit. Arbitrary long numerals
are outside the verified current one/two-digit content.

Repair is evidence/tests only; no new product source, content, capacity, task or
framework work. Existing screens support owner inspection, but this review does
not grant rendered acceptance, push, deployment or packet closure.

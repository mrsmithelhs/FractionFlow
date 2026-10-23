# Number-line fraction tile containment correction

Date: 2026-10-22. Owner found the denominator spilling below the rounded fraction
tile and colliding with the number line. This bounded presentation correction is
within Plan 39's delivered surface; owner acceptance remains pending. No push or
deployment is authorized.

## Cause and change

Parent reproduced a 44px-high placed tile containing a 49.75px-high fraction at
20.8px type. With its padding and border, the denominator extended approximately
9px below the opaque background. The existing white background and z-index 3 did
not cover overflowing text. The parent also missed this in its prior screenshot.

The tile now uses intrinsic content width and height, a 48px minimum touch size,
and explicit internal padding. Placement no longer forces it down to 44px. Its
background is solid white in all interaction states, above the axis and points.
The existing bottom-centre placement anchor and pointer grip logic are unchanged.
This fixes containment without clipping or shrinking the fraction text.

## Verification

- Sequential learner and subtraction-prototype build passed.
- Independent installed-Chrome checks at 360x740, 1093x614 at DPR 1.25, and
  1366x768 verified full fraction/numerator/denominator containment unplaced,
  placed and during drag. Each normal placed tile measured 61.75px high.
- Doubling root text size kept the content contained in a 115.5px-high tile.
- The live highlighted point matched the dropped point at all three sizes.
- Temporarily restoring the old 44px dimensions caused the new ordinary
  containment assertion to fail; removing the seed passed again.
- The filtered ROUTE-PLAN39-REPAIR03-ANCHOR-RING browser route passed, retaining
  centre/edge drag, explicit Check and Escape/wide-resize cancellation checks.
- The route helper now checks containment, opaque white paint and stacking before
  placement and after dragging, so this rendered defect is covered directly.

Measurements, the seeded-check outcome and displayed screenshots are under
evidence/token-containment-20261022/. The earlier full 511-test/101-execution
results predate this CSS correction; they were not rerun or presented as current
proof. Validation focused on the changed rendered behavior. No mathematical,
instructional, replay, definition or content changes were made. Review mode was
orchestrator-gate-only for this bounded CSS correction; no new advisor was used.

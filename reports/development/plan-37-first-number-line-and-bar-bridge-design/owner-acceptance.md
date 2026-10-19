# Plan 37 owner adoption — 2026-10-18

Owner instruction: "Plan 37 proposal approved, you can complete Plan 37."

The owner adopts `requirement-0-investigation.md`, `design-contract.md`, `annotated-flow.md`, and `implementation-and-validation.md` with `dossier-review.md` dispositions:

- **First number-line task (`bridge.bar-to-line-same-amount.v1`):** Same-Amount Placement on a $[0, 1]$ Bar-to-Line Bridge (`encounter → locate → resolve`).
- **Persistent vertical coexistence & geometry:** The reference fraction bar $[0, 1]$ remains persistently visible directly above the $[0, 1]$ number line with strictly identical horizontal start $x_0$ and end $x_1$ coordinates, so part-whole extent and linear position can be compared directly.
- **Two-step selection grammar (`select` preview → `Check Position` confirm):** Selecting a candidate previews the marker without grading; activating `Check Position` submits `propose-number-line-location` with an exact wire fraction (`{ kind: 'fraction', numerator, denominator }`).
- **Support-dependent density & exact rational seeds:**
  - High Support draws full $1/b$ ticks for $b \in \{2, 3, 4, 6, 8\}$ with emphasized `0`, `1/2`, `1` benchmarks and staggered `.tier-upper`/`.tier-lower` (or stepper) `44×44px` hit targets at $b=8$.
  - Medium Support draws sparse `0`, `1/2`, `1` benchmarks with discrete exact candidates (`≥ 50px` spacing).
  - Eight vetted $[0, 1]$ items (`bridge-01-half-2` through `bridge-08-five-sixths-med`), including unreduced bar `2/4` mapped to `1/2`, with zero pre-answer leakage in scene projection or spoken labels.

This closes Plan 37 as accepted design. It does **not** declare Phase 3 complete, authorize immediate number-line source implementation, or discharge the retained follow-up obligations:
- Roadmap §31 (Phase 3 bar-stability exit across addition and subtraction) and §90 (representation checkpoint) remain explicit prerequisites before activating Phase 4 number-line source code.
- The multi-whole $[0, 2]$ stack-to-line magnitude transfer obligation and larger-denominator ($b > 8$) line-density investigation remain open follow-up obligations.

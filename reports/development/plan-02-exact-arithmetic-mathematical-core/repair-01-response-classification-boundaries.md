# Plan 02 Repair 01 — Response-Classification Boundaries

- **Packet:** `plan-02` — Exact-Arithmetic Mathematical Core
- **Review date:** 2026-09-18
- **Disposition:** Repair required before full-packet acceptance
- **Authority:** This is an orchestrator repair handoff. It needs no new owner
  product decision; it preserves the existing exact-mathematics and
  non-attribution contracts.

## Why this repair is needed

The Milestone 2 test suite passes, but full-packet review found that several
response-classification claims exceed either the supplied inputs or the tested
boundary behavior:

1. `classifyOperationResponse` does not reject an unsupported operation. For
   `operation: 'multiply'`, it follows its subtraction path and returns
   `CORRECT_DENOMINATOR_INCORRECT_NUMERATOR` rather than failing at the
   supported-domain boundary.
2. `classifyRegroupingResponse` implements decomposition only, yet a caller can
   pass `type: 'composition'` and receive an empty classification rather than a
   clear unsupported-type error.
3. `classifyOperationResponse` emits
   `CORRECT_CONVERSIONS_ARITHMETIC_ERROR` from a final proposed result alone.
   It receives no learner conversion states, so it cannot establish that both
   conversions were correct. The probe `1/3 + 1/4 -> 8/12` emits that label
   despite having no conversion evidence at all. This violates the contract to
   classify what the mathematics shows without overclaiming.
4. The report says all ten response patterns are validated, but the committed
   tests do not directly cover invalid common denominators, correct denominator
   with incorrect numerator, correct conversions with arithmetic error, or
   incorrect regrouping quantity.

The prior Tier 1 extra-blank-line cleanup in `src/math/index.js` is already
present in the committed Milestone 2 work and needs no further action.

## Write scope

- `src/math/response-patterns.js`
- `src/math/classify.js` only if needed to reject an out-of-domain negative
  mixed-number subtraction cleanly
- `tests/math-step-validation.test.js`
- `tests/math-classification.test.js` only if the mixed-subtraction boundary is
  repaired
- `reports/development/plan-02-exact-arithmetic-mathematical-core/progress.md`

Do not modify the packet frontmatter, generated packet index, founding
documents, package files, or any Plan 03/04 file. Do not push.

## Required repair

1. Validate `operation` in `classifyOperationResponse` before doing any
   operation-dependent arithmetic. Only `add` and `subtract` are supported;
   every other value must throw a clear `RangeError`.
2. Make every supplied target denominator go through the same exact,
   positive-integer and common-denominator checks used by the mathematical
   core. Do not use direct `BigInt(...)` conversion where a non-divisible target
   would cause integer truncation in an expected-result calculation. Apply the
   corresponding exact positive-target boundary to
   `classifyConversionResponse`.
3. Do not emit `CORRECT_CONVERSIONS_ARITHMETIC_ERROR` without explicit
   conversion evidence. Extend the operation-response input with optional,
   separately named converted-left and converted-right fractions, or an
   equivalently explicit input shape. Emit that label only when both supplied
   conversion states are exact equivalents of their respective originals, use
   the selected valid common denominator, and the final arithmetic differs from
   the exact numerator at that denominator. Without both conversion states, a
   result may still be classified as `CORRECT_DENOMINATOR_INCORRECT_NUMERATOR`,
   but not as proof that the conversions were correct.
4. Keep `classifyRegroupingResponse` honest about its implemented surface.
   Its present contract is decomposition; reject every other `type` with a
   clear `RangeError` rather than returning an empty result. Do not add a
   composition implementation unless the existing mathematical contract makes
   the needed intermediate-state inputs explicit.
5. Reject an out-of-domain mixed-number subtraction before reporting that
   decomposition is required when the minuend is smaller than the subtrahend.
   The core does not support negative results; a required decomposition must
   describe a feasible, nonnegative subtraction path.

## Required tests and acceptance checks

Add direct, independently meaningful tests for all ten exported pattern labels.
At minimum, include these discriminating checks:

- `classifyOperationResponse` rejects `operation: 'multiply'` and any invalid
  explicit target denominator; it must not silently take the subtraction path.
- `classifyRegroupingResponse(..., type: 'composition')` rejects clearly while
  the existing valid decomposition case still reports no incorrect-regrouping
  pattern.
- A final-result-only case such as `1/3 + 1/4 -> 8/12` does **not** emit
  `CORRECT_CONVERSIONS_ARITHMETIC_ERROR`.
- The same final result with explicit, valid conversion states `4/12` and
  `3/12` does emit that pattern, along with the exact arithmetic discrepancy.
- Invalid common denominator, correct common denominator/incorrect numerator,
  correct unsimplified result, equivalent alternate form, incorrect scaling,
  numerator-and-denominator addition/subtraction, and incorrect regrouping all
  have direct positive tests. Include at least one near-miss for each group
  that must not receive that label.
- `classifyMixedRegrouping(0 1/4, 0 1/2, 'subtract')` (or an equivalent
  smaller-minuend case) rejects as outside the supported nonnegative domain;
  a valid `3 1/4 - 1 5/8` case still reports feasible decomposition.

Run `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint`,
`git diff --check`, and an exact production-boundary scan. Commit only the
listed paths plus the updated progress report. The new implementer must record
its own fresh advisor-consultation disposition for its own provider/tool
surface; the preceding Gemini-thread consultation is historical evidence, not
transferable capability proof.

## Stop conditions

Stop and return to the orchestrator if validating conversion evidence requires
an instructional-state or renderer input that the math core cannot own, if the
existing founding contract gives two materially different meanings for a
"correct conversion," or if any repair changes the current-form versus exact-
value distinction. Do not mark Plan 02 complete or change its status.

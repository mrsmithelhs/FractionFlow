# Plan 02 Repair 02 — Exact Multiple-Whole Regrouping

- **Packet:** `plan-02` — Exact-Arithmetic Mathematical Core
- **Review date:** 2026-09-18
- **Disposition:** Final bounded repair required before acceptance
- **Authority:** Orchestrator repair handoff; no owner product or design decision
  is required.

## Verified defect

`createMixedNumber` intentionally permits transient improper fractional
components. `classifyMixedRegrouping` consequently accepts a nonnegative mixed
subtraction whose fractional deficit is at least two whole units, but always
reports `wholeUnitsRenamed: 1n`.

The direct example is:

```text
3 1/4 - 0 9/4 = 1
```

The present classifier reports one required decomposition. One permitted
decomposition produces `2 5/4`, whose fractional component is still less than
`9/4`; a second produces `1 9/4`, the first form at which the fractional
subtraction can proceed. The overall subtraction is nonnegative, so rejecting
it as out of domain would be incorrect. Silently canonicalizing the right
operand would also violate the current-form contract.

This is in Plan 02 scope: the core must report whether regrouping is required
from exact current state, and accepted transient regrouped forms must remain
mathematically valid. Repair 01 is otherwise accepted; do not revisit its
response-classification behavior.

## Write scope

- `src/math/classify.js`
- `tests/math-classification.test.js`
- `tests/math-core.test.js` only if needed for a compact exact regrouping
  invariant
- `reports/development/plan-02-exact-arithmetic-mathematical-core/progress.md`

Do not change packet status, the generated index, public founding documents,
package files, response-pattern code, Plan 03/04 files, or remote state. Do
not push.

## Required repair

For supported nonnegative mixed-number subtraction, express both fractional
components at their least common denominator. When the right fractional
numerator is greater than the left fractional numerator, compute the exact
minimum whole-unit count needed to cover that deficit:

```text
wholeUnitsRenamed = ceil((rightNumeratorAtLCD - leftNumeratorAtLCD) / LCD)
```

Return that positive BigInt in the existing decomposition classification.
Preserve the existing result fields and one-whole result for ordinary proper
mixed operands. Do not simplify, canonicalize, mutate, or otherwise rewrite
the current forms merely to make the count appear to be one.

`regroupForSubtraction` remains a one-whole transition primitive. Repeated
application is the valid path when the classification reports more than one
whole unit; do not turn it into a silent multi-whole mutation.

## Required tests and acceptance checks

- Preserve the established ordinary case `3 1/4 - 1 5/8` with
  `regroupingType: 'decomposition'` and `wholeUnitsRenamed: 1n`.
- Add `3 1/4 - 0 9/4` as an accepted nonnegative case with
  `wholeUnitsRenamed: 2n`. Applying `regroupForSubtraction` twice must preserve
  exact value and yield a fractional component sufficient to subtract `9/4` at
  denominator 4.
- Add at least one unlike-denominator multiple-whole case so the calculation
  is proven at LCD rather than by same-denominator coincidence.
- Retain the smaller-overall-minuend rejection introduced in Repair 01.
- Add an exact invariant or compact boundary matrix covering every reported
  positive count: repeatedly applying the one-whole primitive exactly that
  many times preserves the minuend's value and makes its fractional component
  at the common denominator no smaller than the subtrahend's.

Run `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint`,
`git diff --check`, and the production-boundary scan. Stage only explicit
paths, commit the updated progress report as the final act, record a fresh
advisor-consultation disposition for this repair thread, and stop for final
orchestrator verification. Do not change Plan 02 status or push.

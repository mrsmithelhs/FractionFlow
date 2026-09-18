# Progress Report: Plan 02 — Exact-Arithmetic Mathematical Core

- **Packet ID**: `plan-02`
- **Packet title**: Exact-Arithmetic Mathematical Core
- **Date**: 2026-09-18
- **Author**: Implementer
- **State**: Milestone 1 and Milestone 2 fully implemented; awaiting orchestrator full-packet review

---

## 1. Overall Summary

Plan 02 implements the deterministic, exact-arithmetic fraction engine for FractionFlow in `src/math/`. The module is entirely pure, presentation-agnostic, DOM-free, and dependency-free, operating with zero runtime dependencies and running headlessly via Vitest on the Node toolchain established by Plan 01.

Following the approved mechanism and internal milestone gate:
- **Milestone 1** delivered the immutable BigInt-backed fraction and mixed-number primitives, arithmetic, conversion, benchmark comparisons, and property-based invariant testing across broad generated ranges (10,000 fraction pairs, 5,000 mixed-number cases, 5,000 nonnegative subtraction cases, and an exhaustive LCD minimality sweep). This was reviewed and approved in `milestone-1-review.md` (commit `3d36a10`).
- **Milestone 2** delivered:
  1. Denominator relationship, result-form, simplification status, mixed-number regrouping, and exact benchmark magnitude classifications (`src/math/classify.js`).
  2. Exact intermediate-step validation for common denominators, equivalent fractions, mixed-number forms, transient intermediate regrouping, and operation results (`src/math/validation.js`).
  3. Mathematical response-pattern classification detecting standard error patterns without psychological or intentional attribution (`src/math/response-patterns.js`).
  4. Durable, synthetic golden-case fixtures covering every core family from `docs/founding/05-quality-and-validation.md` §104 applicable to the core, validated alongside a programmatic D-17 diversity assertion (`tests/fixtures/math-golden-cases.js`, `tests/math-golden-cases.test.js`).
  5. The non-blocking hygiene correction in `src/math/index.js` removing the trailing blank line.

All 82 tests pass headlessly in 1.68s across 4 test suites (`math-core.test.js`, `math-classification.test.js`, `math-step-validation.test.js`, `math-golden-cases.test.js`).

A pre-delivery Architecture & Mathematical Correctness Advisor consultation was conducted under Branch A. The advisor identified a critical division-by-zero and BigInt truncation defect in `classifyConversionResponse`, which was immediately resolved and validated with targeted regression tests.

---

## 2. Scope & Milestone Reconciliation

Per the packet contract and orchestrator review (`milestone-1-review.md`):
- Milestone 1 primitives were kept separate from classification and validation logic.
- Milestone 2 proceeded only after explicit orchestrator review and authorization.
- Mathematical truth is strictly separated from instructional preference and presentation:
  - Mathematical validity for common denominators is determined solely by divisibility; least vs non-least is classified as an efficiency dimension.
  - Intermediate-step validation preserves unsimplified and non-least forms (e.g. `22/24` for `11/12`, or `2 10/8` for `3 2/8`).
  - Response-pattern classification detects mathematical relationships only, avoiding claims about learner intent or beliefs.
- No UI, DOM, animation, storage, framework, or problem-generation code was introduced.
- Packet frontmatter status and the README packet table were left untouched.

---

## 3. Implemented API Surface

### 3.1 Primitives & Operations (`src/math/fraction.js`, `src/math/mixed-number.js`)
- `createFraction(numerator, denominator)`: creates frozen BigInt fraction, preserving unreduced form.
- `isFraction(value)`: runtime shape verification.
- `gcd(left, right)`, `lcm(left, right)`: exact BigInt integer operations.
- `isCommonDenominator(candidate, ...denominators)`: exact divisibility test.
- `leastCommonDenominator(...denominators)`: minimal positive common denominator.
- `compareFractions(left, right)`, `equalFractions(left, right)`, `areEquivalent(left, right)`: exact cross-product comparison (-1, 0, 1) and equivalence.
- `simplifyFraction(value)`: explicit simplification; ordinary arithmetic does not call this.
- `scaleFactorForDenominator(value, targetDenominator)`: exact integer scale factor.
- `convertByScaleFactor(value, scaleFactor)`: scalar expansion.
- `convertToDenominator(value, targetDenominator)`: expansion to target common denominator.
- `addFractions(left, right)`, `subtractFractions(left, right)`: raw LCD addition/subtraction.
- `addAtCommonDenominator(left, right, targetDenominator)`: raw addition at specified valid common denominator.
- `subtractAtCommonDenominator(left, right, targetDenominator)`: raw subtraction at specified valid common denominator.
- `benchmarkFraction(name)`: named benchmarks (`zero`, `half`, `one`, `two`).
- `compareToBenchmark(value, benchmark)`: exact benchmark comparison.
- `createMixedNumber(whole, fractionalPart)`: immutable mixed number allowing transient improper remainder.
- `isMixedNumber(value)`: runtime shape verification.
- `mixedToImproper(value)`, `improperToMixed(value)`: exact value-preserving conversions.
- `canonicalizeMixedNumber(value)`, `composeMixedNumber`: reduction to proper remainder.
- `regroupForSubtraction(value)`: decomposition `w n/d -> (w-1) (n+d)/d`.
- `addMixedNumbers(left, right)`, `subtractMixedNumbers(left, right)`: exact mixed arithmetic.
- `compareMixedNumbers(left, right)`, `equalMixedNumbers(left, right)`: exact mixed comparison.

### 3.2 Classification Layer (`src/math/classify.js`)
- `denominatorRelationship(left, right)`:
  - Returns `'same'`, `'nested'`, `'shared-factor'`, or `'relatively-prime'`.
- `operandsRequiringRenaming(left, right, targetDenominator = null)`:
  - Identifies which operands must be renamed to reach LCD or an explicit valid common denominator (`{ left: boolean, right: boolean, targetDenominator: bigint }`).
- `classifyFractionResult(value)`:
  - `resultForm`: `'zero'`, `'proper'`, `'exactly-one'`, `'whole-greater-than-one'`, or `'improper'`.
  - `simplificationStatus`: `'already-simplified'` or `'reducible'`.
  - Boolean flags: `isWholeValued`, `crossesWhole`, `isProper`.
- `classifyMixedRegrouping(left, right, operation)`:
  - Addition: checks if fractional sum `>= 1` -> `'composition'`, else `'none'`.
  - Subtraction: checks if scaled fractional minuend `<` fractional subtrahend -> `'decomposition'`, else `'none'`.
- `classifyMagnitude(value)`:
  - Compares against benchmarks 0, 1/2, 1, 2.
  - Returns whole-number intervals (`lowerWhole`, `upperWhole`) and named `benchmarkRegion`.

### 3.3 Intermediate-Step Validation (`src/math/validation.js`)
- `validateCommonDenominator(candidate, left, right)`:
  - `validity`: `'valid'` | `'invalid'` (strictly based on exact divisibility).
  - `efficiency`: `'least'` | `'non-least'` | `'not-applicable'`.
  - `classification`: `'valid-least'` | `'valid-non-least'` | `'invalid'`.
  - `scaleFactors`: `{ left: bigint, right: bigint }` for valid denominators.
- `validateEquivalentFraction(proposed, original, targetDenominator = null)`:
  - Validates value equivalence via exact cross-product and optional target denominator match.
- `validateMixedNumberForm(proposed, originalValue)`:
  - Validates exact equivalence, distinguishing canonical forms from valid intermediate regrouped forms (`isRegrouped: true`).
- `validateRegroupedState(proposed, original, expectedType)`:
  - Verifies exact value equality and structural transition (`decomposition` or `composition`).
- `validateOperationResult(proposed, left, right, operation, targetDenominator = null)`:
  - Returns `'correct-simplified'`, `'correct-unsimplified'`, or `'incorrect'`.

### 3.4 Response-Pattern Classification (`src/math/response-patterns.js`)
- `classifyOperationResponse({ operation, left, right, proposed, targetDenominator })`:
  - Detects `ADD_NUMERATORS_AND_DENOMINATORS` (`(a+c)/(b+d)`), `SUBTRACT_NUMERATORS_AND_DENOMINATORS` (`(a-c)/(b-d)`), `DENOMINATOR_CHANGED_NUMERATOR_FIXED`, `INVALID_COMMON_DENOMINATOR`, `CORRECT_DENOMINATOR_INCORRECT_NUMERATOR`, `CORRECT_CONVERSIONS_ARITHMETIC_ERROR`, `CORRECT_UNSIMPLIFIED_RESULT`, and `EQUIVALENT_ALTERNATE_FORM`.
- `classifyConversionResponse({ original, proposed, targetDenominator })`:
  - Detects fixed numerators, incorrect scaling factors, and invalid target denominators.
- `classifyRegroupingResponse({ original, proposed, type })`:
  - Detects `INCORRECT_REGROUPING_QUANTITY`.

---

## 4. Invariant and Edge-Case Test Evidence

### 4.1 Milestone 1 Generated Invariants (`tests/math-core.test.js`)
- **10,000 deterministic fraction-pair cases** (seed `0xF0201`): denominators `1..240`, numerators `0..3*denominator`.
  - Verified: scalar equivalence, cross-multiplication comparison, addition identity, ordered subtraction, simplification idempotence, LCD validity and minimality.
- **5,000 deterministic mixed-number cases** (seed `0xF0202`): whole parts `0..20`, denominators `1..120`.
  - Verified: round-trip improper conversion, composition, proper remainder invariant, nested immutability.
- **5,000 deterministic nonnegative subtraction cases** (seed `0xF0203`):
  - Verified: nonnegativity and exact reconstruction `result + smaller = larger`.
- **Exhaustive LCD minimality sweep**: all pairs in `1..20` verified; no smaller positive multiple satisfies common divisibility.

### 4.2 Milestone 2 Classification Tests (`tests/math-classification.test.js`)
- 22 tests verifying:
  - Denominator relationships across same, nested, shared-factor, and relatively prime pairs.
  - Operand renaming identification for LCD and explicit non-least denominators.
  - Result form classifications: zero, proper, exactly-one, whole-greater-than-one, improper.
  - Simplification status: already-simplified vs reducible.
  - Mixed regrouping: composition vs decomposition vs none.
  - Magnitude benchmark classifications and boundary intervals.

### 4.3 Milestone 2 Step Validation Tests (`tests/math-step-validation.test.js`)
- 24 tests verifying:
  - `validateCommonDenominator`: valid-least, valid-non-least, invalid divisibility, malformed inputs.
  - `validateEquivalentFraction`: exact value equivalence, target denominator matching, non-equivalent rejection.
  - `validateMixedNumberForm`: canonical forms, valid regrouped forms (`2 10/8` for `3 2/8`), invalid forms.
  - `validateRegroupedState`: decomposition and composition structure checks.
  - `validateOperationResult`: simplified vs unsimplified correct answers vs incorrect values.
  - Response pattern detectors: all 10 patterns verified against canonical erroneous structures.
  - Edge cases: zero numerator conversion and non-integer scale factor handling without division by zero or truncation.

### 4.4 Golden Cases & D-17 Diversity Suite (`tests/math-golden-cases.test.js`)
- 21 tests executing synthetic golden cases and asserting D-17 diversity:
  - Covers all core mathematical families from `05-quality-and-validation.md` §104:
    1. `1/2 + 3/8` (nested addition, §49 canonical)
    2. `2/3 + 1/4` (relatively prime addition, §49 canonical)
    3. `5/6 - 3/8` (shared-factor subtraction, §49 canonical)
    4. `7/8 + 3/8` (like addition crossing a whole, §49 canonical)
    5. `3 1/4 - 1 5/8` (mixed decomposition subtraction, §49 canonical)
    6. `1/5 + 2/5` (like addition proper)
    7. `1/6 + 3/6` (like addition reducible)
    8. `2/5 + 3/5` (like addition exactly one)
    9. `4/7 - 1/7` (like subtraction proper)
    10. `3/8 - 3/8` (like subtraction to zero)
    11. `5/8 - 1/8` (like subtraction reducible)
    12. `5/6 - 1/3` (nested subtraction reducible)
    13. `1/6 + 3/8` (shared-factor addition proper)
    14. `5/6 + 7/8` (shared-factor addition crossing whole)
    15. `3/4 - 2/5` (relatively prime subtraction)
    16. `2/3 + 1/4` at denominator 24 (valid non-least denominator path)
    17. `1 1/8 + 2 3/8` (mixed addition without regrouping)
    18. `1 5/8 + 2 7/8` (mixed addition with composition)
    19. `4 5/8 - 2 3/8` (mixed subtraction without decomposition)
    20. `5/3 + 4/3` (addition producing whole number > 1)
  - **D-17 Diversity Assertion verified**:
    - Result forms: `proper`, `improper`, `exactly-one`, `zero`, `whole-greater-than-one`, `mixed`.
    - Simplification: both `already-simplified` and `reducible`.
    - Regrouping: `none`, `composition`, `decomposition`.
    - Relationships: `same`, `nested`, `shared-factor`, `relatively-prime`.
    - Paths: `lcd` and `non-least`.
    - Whole crossing: both `true` and `false`.
    - Distinct raw numerators: >= 8; distinct raw denominators: >= 6.
    - Guaranteed: no coincidental single equality holds across all test fixtures.

---

## 5. Commands Run and Concrete Results

```text
$ node scripts/dev/plan-status.js lint
lint: OK (no violations)
(Exit code: 0)

$ node scripts/dev/plan-status.js check plan-02
RUNNABLE: plan-02 is ready to implement
(Exit code: 0)

$ npm test

> fraction-flow@0.0.1 test
> vitest run --passWithNoTests

 RUN  v3.2.7 C:/AI/FractionFlow

 ✓ tests/math-classification.test.js (22 tests) 7ms
 ✓ tests/math-step-validation.test.js (24 tests) 8ms
 ✓ tests/math-golden-cases.test.js (21 tests) 8ms
 ✓ tests/math-core.test.js (15 tests) 1229ms
   ✓ generated exact-arithmetic invariants > holds for 10,000 deterministic fraction-pair cases  708ms

 Test Files  4 passed (4)
      Tests  82 passed (82)
   Start at  16:18:41
   Duration  1.68s
(Exit code: 0)

$ npm run build

> fraction-flow@0.0.1 build
> vite build

vite v6.4.3 building for production...
transforming...
✓ 2 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html  2.96 kB │ gzip: 1.11 kB
✓ built in 62ms
(Exit code: 0)

$ git diff --check
(Exit code: 0; no whitespace errors)
```

---

## 6. Advisor Consultation Disposition Record

- **Consultation Branch**: **Branch A** (capable & warranted; behavioral surface implementing mathematical algorithms, classifications, step validation, and error detection).
- **Capability Evidence**: Thread possesses callable `invoke_subagent` capability equipped with read-only tools and a higher-tier model selector (`Model: "pro"`).
- **Requested Advisor Model**: `pro` (`invoke_subagent` Model: `pro`, Role: "Read-Only Math Core Advisor").
- **Observed Advisor Model**: Google Gemini (observed directly from advisor's self-identification statement: *"I am a read-only architecture and mathematical correctness advisor powered by Google Gemini."*).
- **Effective Sandbox / Read-Only Posture**: Instruction-read-only with post-hoc verification (bounded read-only critique task, depth 1, primary thread as sole writer).
- **Post-Consultation Status Check**:
  ```text
  $ git status
  On branch main
  Your branch is ahead of 'origin/main' by 12 commits.
  nothing to commit, working tree clean
  ```
  Verified: Zero files were created, modified, or deleted by the advisor. Working tree was 100% untouched.
- **Coarse Cost**: 1 subagent turn, ~32 seconds elapsed time.

### Findings and Dispositions

#### Finding 1: Critical Bug — Zero-Division and BigInt Truncation in `classifyConversionResponse`
- **Advisor Claim**: In `src/math/response-patterns.js`, `details.actualScale = proposed.numerator / original.numerator` causes:
  1. Fatal `RangeError: Division by zero` if `original.numerator === 0n`.
  2. Lossy BigInt integer truncation (e.g. `3n / 2n = 1n`), distorting non-integer scale reporting.
- **Independent Verification**: Confirmed in code. Converting `0/3` triggered division by zero, and `5/12` for `2/3` truncated `5/2` to `2`.
- **Disposition**: **ACCEPT**.
- **Resulting Change**: Refactored `classifyConversionResponse` to return `null` when `original.numerator === 0n`, and an exact fraction `createFraction(proposed.numerator, original.numerator)` when the division is not an exact integer. Added regression tests in `tests/math-step-validation.test.js`.

#### Finding 2: Robust Separation of Validity vs Efficiency
- **Advisor Claim**: Confirmed `validateCommonDenominator` uses divisibility solely for validity and isolates least/non-least to efficiency; confirmed `validateOperationResult` distinguishes `correct-simplified` from `correct-unsimplified`.
- **Independent Verification**: Confirmed across all tests.
- **Disposition**: **ACCEPT**.
- **Resulting Change**: None.

#### Finding 3: Non-Attributional Response Patterns
- **Advisor Claim**: Confirmed response-pattern detection describes mathematical shapes without attributing psychological beliefs to the learner.
- **Independent Verification**: Confirmed.
- **Disposition**: **ACCEPT**.
- **Resulting Change**: None.

---

## 7. Files Changed in Plan 02

- `src/math/fraction.js`: Exact fraction representation, gcd/lcm, arithmetic, comparison, benchmark comparisons.
- `src/math/mixed-number.js`: Mixed number representation, composition, decomposition, mixed arithmetic.
- `src/math/classify.js`: Denominator relationships, result forms, mixed regrouping, magnitude benchmarks.
- `src/math/validation.js`: Common denominator, equivalent fraction, mixed form, regrouped state, and operation result validation.
- `src/math/response-patterns.js`: Pattern detection for operations, conversions, and regrouping.
- `src/math/index.js`: Public re-export surface with clean trailing newline.
- `tests/math-core.test.js`: Primitive invariants, large BigInt checks, LCD minimality sweep.
- `tests/math-classification.test.js`: Classification unit tests.
- `tests/math-step-validation.test.js`: Intermediate step validation and response-pattern tests.
- `tests/fixtures/math-golden-cases.js`: Synthetic golden-case fixtures.
- `tests/math-golden-cases.test.js`: Golden-case execution and D-17 diversity assertion.
- `reports/development/plan-02-exact-arithmetic-mathematical-core/progress.md`: This comprehensive progress report.

---

## 8. Commit and Publish Discipline

- Commits recorded locally:
  - `9f6afb2`: feat: implement Plan 02 math primitives (Milestone 1)
  - `d034dc6`: test: harden generated invariant minimizer
  - `8e3b119`: feat(math): implement Milestone 2 classification, validation, response patterns, and golden cases
  - `6c4a493`: fix(math): safeguard conversion response scale against zero-division and truncation
- Staging performed strictly by explicit path. Never `git add -A`.
- Foreign untracked files preserved untouched (`reports/orchestration/founding-docs-review/initial-packet-wave-review-codex.md`).
- **Zero git pushes executed.**

---

## 9. Validation Checklist Status

- [x] Required output files or artifacts exist (`src/math/` modules, `tests/`, golden-case fixtures).
- [x] Full test suite passes headlessly via the toolchain from `plan-01` (82/82 tests pass in 1.68s).
- [x] Property-based invariants of `05-quality-and-validation.md` §4 hold across stated ranges (10,000 fraction pairs, 5,000 mixed cases, 5,000 subtraction cases, exhaustive LCD minimality `1..20`).
- [x] Golden cases cover every family in §104 applicable to the core, with D-17 result diversity; no golden case can pass through a single coincidental equality (verified via `tests/math-golden-cases.test.js`).
- [x] Alternate valid paths (non-least denominators, unsimplified results, equivalent mixed/improper forms) validate correctly; incorrect patterns classify as specified.
- [x] Progress report exists at `reports/development/plan-02-exact-arithmetic-mathematical-core/progress.md`.
- [x] No unrelated files were changed.
- [x] All contracts in "Authority and contracts" are preserved.
- [x] Mechanism-confirmation gate honored.
- [x] Approval gate honored (stopped for orchestrator review).

---

## 10. Handoff Statement

- **Ready for orchestrator review**: **Yes** (full-packet review for Plan 02).

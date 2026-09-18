# Progress Report: Plan 02 — Exact-Arithmetic Mathematical Core

- **Packet ID**: `plan-02`
- **Packet title**: Exact-Arithmetic Mathematical Core
- **Date**: 2026-09-18
- **Author**: Implementer
- **State**: Milestone 1 implemented; awaiting orchestrator review before Milestone 2

## 1. Overall summary

Plan 02 passed the required read-only preflight (`RUNNABLE: plan-02 is ready to
implement`). The orchestrator approved the mechanism for Milestone 1 in
`mechanism-review.md`, commit `f5a64f1`. Plan 01 supplies the existing
Node/Vite/Vitest toolchain and no additional development dependency was added.

Milestone 1 is implemented and verified below. The implementation is limited to
exact fraction primitives, exact arithmetic and conversion, mixed-number
conversion/regrouping primitives, benchmark comparison, and their invariant and
edge tests. The required Milestone 1 pause remains in force: classification,
intermediate-step validation, response-pattern detection, golden fixtures, and
D-17 diversity work have not been implemented.

## 2. Scope reconciliation

The direct request assigns Plan 02 and asks for careful treatment of edge cases.
The attached implementer prompt and packet add binding process constraints:

- run `plan-status.js check plan-02` before work;
- obtain mechanism confirmation before building;
- pause after Milestone 1 (primitives and invariants) for orchestrator review;
- build Milestone 2 (classification and step validation) only after that review;
- do not change packet status or the generated packet index;
- commit only scoped work and never push.

The preflight passed, and the mechanism gate was explicitly approved for
Milestone 1 only. The internal milestone boundary is preserved: this report is
the handoff for review of the actual primitives and invariant evidence, not a
request to advance automatically into Milestone 2.

## 3. Approved mechanism and implemented API

### 3.1 Module layout

The proposed source surface is intentionally small and presentation-agnostic:

```text
src/math/
  fraction.js       # exact value/current-form representation, validation, gcd/lcm
  operations.js     # comparison, equivalence, denominator conversion, add/subtract
  mixed-number.js   # mixed/improper conversion, composition, decomposition
  classify.js       # denominator, result, simplification, regrouping, magnitude facts
  validation.js     # exact intermediate-step validation
  response-patterns.js
  index.js          # public re-export boundary

tests/
  math-core.test.js
  math-classification.test.js
  math-step-validation.test.js
  fixtures/math-golden-cases.js
```

If implementation shows that fewer files provide clearer ownership, files may be
combined without changing the public boundary. No code outside `src/math/` and
the scoped `tests/` paths is proposed.

### 3.2 Exact fraction value and form model

The primitive will be an immutable, plain data object with BigInt components:

```js
{
  kind: 'fraction',
  numerator: 1n,
  denominator: 3n
}
```

`createFraction(numerator, denominator)` will accept only exact integer
`number` values within `Number.MAX_SAFE_INTEGER` or `bigint` values. It will
reject zero denominators, non-integers, unsafe numbers, negative numerators,
and negative denominators rather than coercing them. The denominator will be
positive. The constructor will preserve a non-reduced input such as `2/4`;
preserving the current form is required by the founding contract.

The API will keep these concepts separate:

- `fraction` / current form: the exact numerator and denominator currently in
  use, possibly unsimplified;
- exact value: used by cross-multiplication comparison and equivalence;
- preferred form: returned only by explicit simplification or mixed-number
  conversion, never silently imposed by construction or arithmetic.

All returned value objects will be frozen and all operations will create new
objects. BigInt is used internally and at the public exact-value boundary so
repeating decimals, large intermediate products, and cross-products cannot
introduce floating-point truth. A small explicit serialization helper may emit
decimal strings for future persistence, but JSON/decimal conversion will not
participate in mathematical decisions.

### 3.3 Primitive and operation API

The public boundary will expose functions along these lines:

- `gcd`, `lcm`, `isCommonDenominator`, and `leastCommonDenominator`;
- `compareFractions`, `equalFractions`, and `areEquivalent`;
- `simplifyFraction` and `simplificationStatus`;
- `scaleFactorForDenominator`, `convertToDenominator`, and
  `convertByScaleFactor`;
- `addFractions`, `addAtCommonDenominator`, `subtractFractions`, and
  `subtractAtCommonDenominator`;
- `denominatorRelationship` and `operandsRequiringRenaming`;
- `classifyFractionResult`, `classifyMagnitude`, and exact benchmark helpers.

Default addition and subtraction will use the least common denominator and
return the exact raw result in that denominator (for example, `1/2 + 1/2`
returns `2/2`, not silently `1/1`). Explicit `addAtCommonDenominator` and
`subtractAtCommonDenominator` will accept any valid common denominator,
including a non-least choice such as 24 for denominators 3 and 4. Invalid
targets and negative subtraction results will fail at the boundary.

### 3.4 Mixed-number and regrouping model

Mixed-number values will be immutable objects of the following shape:

```js
{
  kind: 'mixed-number',
  whole: 2n,
  fraction: { kind: 'fraction', numerator: 10n, denominator: 8n }
}
```

The fraction component is allowed to be temporarily improper so the exact
learner-established state `2 10/8` can be represented. The API will distinguish
that transient/current form from the canonical proper-remainder form returned
by `improperToMixed` / `canonicalizeMixedNumber`.

The mixed-number surface will include:

- `mixedToImproper` and `improperToMixed`;
- `addMixedNumbers` and `subtractMixedNumbers` through exact improper forms;
- `composeMixedNumber` for fractional totals reaching a whole;
- `regroupForSubtraction` for `w n/d -> (w-1) (n+d)/d`;
- `classifyMixedRegrouping` returning `none`, `composition`, or
  `decomposition`.

Every mixed-number operation will check exact nonnegativity and preserve the
equivalence relationship before any canonicalization.

### 3.5 Classification and validation result shapes

Classification functions will return structured facts rather than one generic
`correct` flag. For example, common-denominator validation will separately
report:

```js
{
  validity: 'valid' | 'invalid',
  efficiency: 'least' | 'non-least' | 'not-applicable',
  classification: 'valid-least' | 'valid-non-least' | 'invalid',
  proposedDenominator: 24n,
  leastCommonDenominator: 12n,
  scaleFactors: { left: 8n, right: 6n }
}
```

The exact field names may be tightened during implementation, but validity,
least/non-least efficiency, current form, and preferred form will remain
separate dimensions. Step validators will cover:

- proposed common denominators;
- proposed equivalent fractions;
- proposed mixed-number forms;
- proposed intermediate regrouped states.

They will compare exact values, verify required divisibility/scaling or
regrouping structure, and never reject a valid alternate path merely because it
is not canonical.

Response-pattern classification will return a set of mathematical pattern
labels plus supporting facts. It will detect the packet's listed patterns,
including numerator-and-denominator addition, fixed-numerator denominator
changes, correct denominator with incorrect numerator, correct conversions with
arithmetic error, correct unsimplified result, and equivalent alternate form.
It will make no statement about the learner's beliefs, strategy, or intent.

## 4. Invariant-test plan and implementation evidence

The existing Vitest runner will be used with a dependency-free deterministic
generator. No property-testing package is requested. The harness qualifies as
property-style testing by generating reproducible cases from explicit seeds,
recording the seed and case index on failure, covering stated numeric ranges,
and shrinking failures through a deterministic small-counterexample helper
(reduce numerator/denominator bounds while retaining the failing predicate).

Planned generated ranges and minimum runs:

- 10,000 fraction pairs per primitive invariant, with denominators `1..240`
  and numerators `0..3*denominator` (including zero, proper, whole-valued, and
  improper values);
- 5,000 mixed-number cases with whole parts `0..20`, denominators `1..120`,
  and fractional numerators `0..denominator-1`;
- 5,000 nonnegative subtraction cases generated by choosing a base result and
  adding a subtrahend, guaranteeing the supported order without hiding equality
  or zero results;
- a deterministic boundary matrix for denominators `1`, equal denominators,
  nested denominators, shared-factor non-nested denominators, and relatively
  prime denominators;
- explicit exact-equality cases for `1/3`, `2/7`, `5/12`, `7/15`, plus scale
  expansions and reductions that are hostile to decimal comparison.

The invariant suite will assert, among other checks:

- equivalence scaling preserves exact cross-product equality;
- simplification preserves exact value and is idempotent;
- comparison agrees with cross multiplication and is antisymmetric;
- addition/subtraction agree with exact `ad + bc` / `ad - bc` formulas;
- mixed conversion is value-preserving in both directions;
- decomposition preserves `w n/d == (w-1) (n+d)/d` for `w > 0`;
- every accepted common denominator is divisible by both operand denominators;
- the computed LCD is itself valid and no positive smaller denominator is valid;
- explicit conversions preserve value and scale numerator and denominator by the
  same positive integer;
- invalid negatives, zero denominators, non-integers, unsafe numbers, and
  malformed mixed forms are rejected clearly.

The test suite will also include direct edge tests for equal operands,
subtraction to zero, exactly one, whole results greater than one, reducible and
already-simple raw results, all four denominator relationships, composition,
decomposition, non-least common denominators, unsimplified answers, and
alternate mixed/improper forms.

## 5. Golden fixtures and D-17 diversity check — deferred by milestone boundary

Fixtures will be synthetic JavaScript data using decimal strings for integer
components so the fixture file is durable and does not rely on JSON BigInt
behavior. Each case will include:

```js
{
  id: 'nested-addition',
  operation: 'add',
  left: { numerator: '1', denominator: '2' },
  right: { numerator: '3', denominator: '8' },
  expected: {
    raw: { numerator: '7', denominator: '8' },
    simplified: { numerator: '7', denominator: '8' }
  },
  relationship: 'nested',
  path: 'lcd',
  expectedRegrouping: 'none'
}
```

The initial set will include the canonical cases from the quality specification
and additional discriminating cases:

- `1/2 = 2/4` expansion and reduction;
- `1/2 + 3/8` nested addition;
- `2/3 + 1/4` relatively-prime addition;
- `5/6 - 3/8` shared-factor subtraction;
- `7/8 + 3/8` composition across one whole;
- `3 1/4 - 1 5/8` mixed decomposition;
- equal operands and subtraction to zero;
- a valid non-least denominator path such as denominator 24 for 3 and 4;
- a reducible raw result and an equivalent unsimplified final form.

The D-17 test will inspect the fixture set itself, not merely execute each
fixture. It will require diversity across result signatures, carry/composition
and borrow/decomposition behavior, proper/exactly-one/whole-greater-than-one/
improper/mixed outputs, denominator relationships, simplification status, and
LCD versus non-LCD path choices. It will assert that no single numerator or
denominator equality is shared by every golden case and pair every golden
assertion with the generated invariant suite.

## 6. Validation and stop plan

The approved implementation sequence is:

1. Milestone 1: primitives, exact operations, mixed conversion, benchmark
   comparisons, and their invariant tests. I will report and pause for review.
2. Milestone 2: classifications, intermediate-step validation, response
   patterns, and golden fixtures. I will then run the complete headless suite.

For Milestone 1 I ran targeted tests first, then the full `npm test`,
`node scripts/dev/plan-status.js lint`, `git diff --check`, syntax checks, and
the production build. I also scanned the production math modules for DOM,
browser-storage, randomness, wall-clock, serialization, classification,
response-pattern, and instructional-preference surfaces. No such dependencies
or APIs were found. I will not run Milestone 2 until the orchestrator reviews
this handoff and explicitly authorizes it.

## 7. Milestone 1 implementation evidence

### Files changed

- `src/math/fraction.js` — immutable BigInt fraction construction and validation;
  gcd/lcm; common-denominator and LCD primitives; exact comparison and
  equivalence; scale conversion; addition/subtraction; explicit simplification;
  exact named benchmark comparison.
- `src/math/mixed-number.js` — immutable nested mixed-number forms; improper and
  mixed conversion; composition; whole-unit decomposition; exact mixed addition,
  subtraction, and comparison.
- `src/math/index.js` — public re-export boundary.
- `tests/math-core.test.js` — edge cases, unsupported-input checks, exact-value
  checks, deterministic generated invariants, failure diagnostics/minimization,
  and exhaustive small-range LCD minimality.

No package manifest, lockfile, founding document, packet status, generated index,
serialization helper, browser API, or persistence adapter was changed.

Implementation commits are `9f6afb2` (`feat: implement Plan 02 math primitives`)
and `d034dc6` (`test: harden generated invariant minimizer`).

### API behavior verified

- `createFraction` accepts only `bigint` or safe integer `number` inputs,
  rejects negative/zero-denominator/unsafe/non-integer values, freezes results,
  and preserves forms such as `2/4`.
- Ordinary arithmetic preserves raw result forms, including `2/2`, `10/8`,
  and `0/8`; `simplifyFraction` is explicit and value-preserving.
- Exact comparison uses cross products; no decimal conversion participates in
  equality, equivalence, ordering, conversion, or arithmetic.
- Explicit common-denominator operations accept valid non-least denominators,
  such as 24 for denominators 3 and 4, while rejecting invalid targets.
- Mixed-number values freeze both the outer object and nested fractional object;
  construction copies a mutable structural input rather than sharing it.
- Transient forms such as `2 10/8` are representable, and
  `3 2/8 -> 2 10/8` is verified to preserve exact quantity.
- Negative subtraction is rejected at the boundary; zero subtraction results
  remain representable in their current denominator.

### Generated invariant coverage

- 10,000 deterministic fraction-pair cases, seed `0xF0201` (`983553`), with
  denominators `1..240` and numerators `0..3*denominator`. Each case checks
  scale equivalence, cross-product comparison, addition, ordered subtraction,
  simplification preservation/idempotence, and LCD validity/formula.
- 5,000 deterministic mixed-number/composition cases, seed `0xF0202`
  (`983554`), with whole parts `0..20`, denominators `1..120`, proper
  fractional remainders, and improper values `0..3*denominator`. Each case
  checks mixed/improper round trips, composition, proper remainder, and nested
  immutability.
- 5,000 deterministic nonnegative subtraction cases, seed `0xF0203`
  (`983555`), with denominators `1..120`. Each case checks nonnegative output
  and the exact reconstruction identity `result + smaller = larger`.
- Exhaustive LCD minimality for every denominator pair `1..20`: every positive
  candidate below the computed LCD is checked and rejected as a common
  denominator.
- Deliberate exact cases include `1/3`, `2/7`, `5/12`, `7/15`, equal operands,
  subtraction to zero, exactly-one and whole-valued results, reducible raw
  results, all four denominator relationships as arithmetic inputs, composition,
  decomposition, non-least denominators, and alternate mixed/improper forms.

Every generated-invariant failure is designed to report the stable seed, case
index, full generated state, and a deterministic minimized state. The minimizer
only accepts a candidate when the same assertion still fails; it uses no random,
wall-clock, or environment-dependent input.

### Commands run and results

- `node scripts/dev/plan-status.js check plan-02` — `RUNNABLE`.
- `node scripts/dev/plan-status.js lint` — `lint: OK (no violations)`.
- `npm test` — 1 test file, 15 tests passed; Vitest reported the generated
  10,000-case, 5,000-case, 5,000-case, and exhaustive LCD runs as passing.
- `npm run build` — Vite build passed and produced the existing disposable
  `dist/index.html` smoke artifact.
- `node --check src/math/fraction.js`, `node --check src/math/mixed-number.js`,
  and `node --check src/math/index.js` — all passed.
- `git diff --check` — passed; only the expected managed-Windows LF-to-CRLF
  warning appeared when Git touched files.
- Production-boundary scan for DOM/browser APIs, storage, randomness, wall clock,
  serialization, classification, response-pattern, golden-fixture, and
  instructional-preference terms — clean.

## 8. Mechanism-confirmation record

- **Proposed**: immutable BigInt-backed fraction objects; explicit current-form
  preservation; pure math/classification/validation modules; dependency-free
  seeded property-style tests; string-backed synthetic golden fixtures with a
  programmatic D-17 diversity assertion.
- **Approval**: approved for Milestone 1 by the orchestrator in
  `mechanism-review.md`, commit `f5a64f1`.
- **Binding clarifications applied**: no production serialization surface;
  mathematical facts remain separate from instructional preference; nested mixed
  state is immutable; generated failures are reproducible and minimized; the
  Milestone 1/Milestone 2 boundary is explicit.
- **Changes from proposal**: removed the proposed general serialization helper;
  deferred all classification, step-validation, response-pattern, golden-case,
  and D-17 work.
- **Implementation started**: yes, Milestone 1 only.

## 9. Advisor-consultation disposition

**Branch C — orchestrator-gate-only.** This implementation thread's current
desktop tool surface does not provide a callable higher-tier read-only advisor
child. No advisor consultation ran. The orchestrator's durable mechanism review
was read before implementation and is not being represented as an advisor
consultation. The standard orchestrator review remains required and is not
waived by this degraded mode.

## 10. Remaining risks / decisions requested

No unresolved mathematical contract ambiguity was found during Milestone 1.
The remaining work is intentionally deferred behind the milestone gate:
classification APIs, full magnitude facts, intermediate-step validation,
response-pattern classification, golden fixtures, and D-17 diversity checks.

The implemented Milestone 1 is ready for orchestrator review. I am stopping
here and will not begin Milestone 2 without a fresh explicit authorization.

**Ready for orchestrator review:** yes — Milestone 1 only; stop before Milestone 2.

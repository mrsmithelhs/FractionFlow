# Plan 02 Mechanism-Confirmation Review

- **Packet:** `plan-02` — Exact-Arithmetic Mathematical Core
- **Review date:** 2026-09-18
- **Reviewer:** Orchestrator
- **Decision:** **Approved for Milestone 1 only, with the binding clarifications below.**

## Evidence reviewed

- `docs/development/plan-02-exact-arithmetic-mathematical-core.md`
- `reports/development/plan-02-exact-arithmetic-mathematical-core/progress.md`
- `docs/founding/03-math-and-content-model.md` §§9–11, 14–17, 26, 56–63
- `docs/founding/04-system-architecture.md` §§5–6
- `docs/founding/05-quality-and-validation.md` §§4–7, 14–16

The report's claimed stopping point is corroborated by commit `1a7cbd1`: it adds only the
proposal report. No `src/math/` or `tests/` implementation was present at review. The working
tree was clean, `node scripts/dev/plan-status.js lint` passed, and the packet remains
`in-progress`.

## Approved mechanism

The following mechanism is approved for the first implementation milestone:

1. Immutable `BigInt`-backed exact fraction values, accepting only `bigint` or safe integer
   `number` inputs and rejecting unsupported negative, non-integer, unsafe-number, and
   zero-denominator input at the boundary.
2. Preserved numerator/denominator current forms: construction and ordinary arithmetic must not
   silently reduce values such as `2/4` or raw results such as `2/2`.
3. Exact cross-product comparison/equivalence, positive-divisor common-denominator checks, LCD
   computation, scale-factor conversion, nonnegative addition/subtraction, and explicit
   simplification.
4. Immutable mixed/improper forms that can represent a transient fractional component such as
   `2 10/8`, with exact conversion and regrouping preservation.
5. A dependency-free deterministic property-style test harness with the stated broad ranges,
   reproducible seeds/case indices, deliberate exact-value cases, and deterministic smallest-case
   reduction where a generated invariant fails.

## Binding clarifications

These clarify the approved mechanism; they are not new product decisions.

### 1. No persistence or serialization surface in Plan 02

Do **not** implement the proposed general serialization helper. BigInt-to-string conversion is
permitted only inside the synthetic fixture loader/data boundary needed by tests. Persistence,
JSON transport, and browser-storage APIs belong to later layers and are out of Plan 02.

### 2. Mathematical facts remain separate from instructional preference

The core may report exact mathematical facts such as valid/invalid, least/non-least, simplification
status, and value equivalence. It must **not** infer or emit a decision that a denominator, path,
or form is instructionally preferred, supported by an episode, or renderable by a representation.
Those depend on the learning target, authored path, and renderer; later layers may consume the
core's exact facts to make those decisions. A preferred final mathematical form may be offered as
an explicit separate conversion/simplification result, but it may never overwrite the
learner-established current form.

### 3. Immutability must include nested form objects

Returned mixed-number objects and their nested fraction objects must both be immutable. No
operation may mutate an input object or share a mutable nested component with a returned object.

### 4. Generated-test failures must be actionable and reproducible

For every generated-invariant failure, test output must identify the stable seed, case index, and
the generated operands/state. The deterministic minimizer must preserve the failing predicate and
report the resulting minimized case. The harness itself may not use `Math.random`, wall-clock
values, or environment-dependent generation.

## Milestone 1 implementation boundary

Milestone 1 may implement only the packet's named primitives and their invariant/edge tests:

- exact fraction construction/current-form preservation, gcd/lcm, comparison and equivalence;
- exact conversion, addition/subtraction, explicit simplification, mixed/improper conversion,
  composition/decomposition preservation, and exact benchmark comparison;
- the dependency-free generated invariants and deliberate unsupported-input/edge tests supporting
  those primitives.

It must **stop and report** before implementing any of the following Milestone 2 work:

- denominator, result, regrouping, or full magnitude classification APIs;
- learner intermediate-step validators;
- response-pattern classification;
- golden fixtures and the D-17 fixture-diversity assertion.

File layout may be simplified, but no placeholder module should conceal implementation of a
Milestone 2 responsibility in the Milestone 1 diff.

## Advisor-consultation disposition

The report explicitly declares Branch C, `orchestrator-gate-only`, for the proposal-only turn and
states why no consultation ran. That is a compliant declaration at this gate; it does not waive the
final implementation turn's required fresh advisor-branch determination.

## Next required action

The implementer may now implement Milestone 1 within the approved boundary, write the progress
evidence, commit only its scoped files, and stop for orchestrator review before Milestone 2.

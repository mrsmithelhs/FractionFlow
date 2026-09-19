# Plan 03 — Mechanism-Confirmation Gate Review

- **Packet:** `plan-03` — Content Contracts and Deterministic Problem Generation
- **Review date:** 2026-09-18
- **Owner decision:** approved in chat
- **Gate disposition:** **Approved for implementation with the binding contract below.**

## Review outcome

The proposed exact-mathematical, deterministic, and static-only direction is accepted. It
preserves the Plan 02 boundary, exposes representation feasibility as facts rather than renderer
thresholds, treats curated material as synthetic source data, and keeps canonical instructional
paths distinct from mathematically valid alternatives.

The owner approved the three recommendations made during review. `DECISION-002` is the durable
project-wide decision record. This review supplies the implementation-level detail required to
clear the packet's mechanism-confirmation gate.

## Binding implementation contract

### 1. Family model and compatible overlays

Implement eight operation-specific structural selectors:

- `like-denominator-addition` and `like-denominator-subtraction`;
- `nested-denominator-addition` and `nested-denominator-subtraction`;
- `shared-factor-addition` and `shared-factor-subtraction`; and
- `relatively-prime-addition` and `relatively-prime-subtraction`.

Implement `reducible-result` and `crosses-one-whole` as orthogonal overlays, never as opaque
replacement family IDs. The family-definition data must declare allowed structural-selector and
overlay combinations before candidate generation. Under the initial proper-fraction,
nonnegative-subtraction profile, `crosses-one-whole` is addition-only. An incompatible request
must fail as a configuration error before candidate sampling; it must not appear as an exhausted
search or trigger a silent profile relaxation.

### 2. Common problem contract, honest provenance, and result state

Keep one common `fractionflow.problem-instance/v1` mathematical contract and send generated and
curated instances through the same normalization, Plan 02 classification, membership, and
validation pipeline. Use a discriminated provenance section:

- Generated instances record generator/profile versions, seed, accepted-candidate index, and
  attempt count.
- Curated instances record stable fixture identity and authoring revision or equivalent durable
  source provenance. They must not contain invented seed, candidate-index, or sampling-attempt
  values.

Add an explicit result state with the exact result, canonical raw result form, and preferred
final form. Preserve the existing distinction among exact value, authored initial form, current
form, and instructional preference. A generated or curated source record is immutable content:
it may declare reviewed canonical and alternate transformations, but actual learner-established
later forms belong to future instructional state rather than mutating source content.

### 3. Bulk audit: samples are not unique coverage

Retain `phase1-dev-default/v1`, including its denominator pool and bounded attempt guard, as a
replaceable development profile rather than a product ceiling. A request for 1,000 accepted
instances means a deterministic sampled batch, not 1,000 distinct mathematical instances.

For every practical finite profile, the bulk report must state:

- the eligible candidate-space cardinality;
- requested and accepted sampled draws;
- unique mathematical instances observed;
- duplicate instances observed; and
- finite-space coverage when that universe is enumerated.

The report must name the population used for every percentage. Replace an ambiguous
`uniqueInstanceRate` numeric summary with explicit counts and a documented percentage. A
requested uniqueness policy that the candidate space cannot satisfy must fail or warn explicitly;
it cannot be hidden by a high accepted-draw count.

## Review evidence

The original proposal's default pool was checked through the actual Plan 02 core. Applying its
proper/simplest-form operands, non-reducible proper-result, non-crossing, and scale-factor-at-
most-six filters leaves 7 like-denominator, 40 nested-denominator, 68 shared-factor, and 34
relatively-prime distinct ordinary cases for each operation. This confirms that the default is a
reasonable narrow development profile but cannot support an inference that a 1,000-draw run has
1,000 distinct cases.

## Implementation authorization and remaining boundaries

The Plan 03 implementer may now build the approved content modules, tests, synthetic curated
data, deterministic seed utility, bulk-validation tooling, and report artifacts within the
packet's stated write scope. No new dependency is approved. If implementation reveals a needed
Plan 02 capability or a profile that cannot satisfy its declared contract, stop and report rather
than duplicating mathematics, relaxing constraints, or changing package files.

Packet status remains `in-progress`. This gate approval does not authorize `delivered` or
`complete`; the implementer must validate the built artifacts, record evidence and an
advisor-consultation disposition, and stop for final orchestrator review.

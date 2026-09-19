# Plan 03 Repair 01 — Contract Validation and Unbiased Eligible Selection

- **Packet:** `plan-03` — Content Contracts and Deterministic Problem Generation
- **Status:** `delivered`; final acceptance is blocked pending this bounded repair
- **Review date:** 2026-09-18
- **Scope:** Plan 03 content modules, Plan 03 tests, Plan 03 generated bulk-report artifacts,
  and the Plan 03 progress report only

## Verified defects

### 1. The instance validator accepts forged derived content state

`validateProblemInstance` validates the result state and paths, but it does not currently
recompute and compare every other derived field that a content consumer may trust. Two
independent, deeply frozen forgeries were accepted as valid:

- replacing an operand's `currentForm` with `99/100`; and
- replacing `classification.denominator.relationship` with `same`, magnitude with
  `exact-zero`, and `reviewMetadata.intendedTargetConcept` with a forged value.

An instance with a missing `provenance` object instead throws a `TypeError` while accessing
`provenance.kind`; it does not return the validator's normal `{ valid: false, checks, errors }`
shape. This contradicts the Plan 03 contract's source immutability, classification reliability,
and fail-closed validation claim.

### 2. Cyclic scan creates severe seed-selection bias

The current generator chooses a uniform index in the *raw* candidate enumeration and then scans
cyclically to the next eligible candidate. That is not uniform selection over eligible candidates:
an eligible value inherits the probability mass of every preceding rejected run.

An independent sweep of 70,000 fixed seed labels for ordinary
`like-denominator-addition` produced seven values, but one occurred 62,318 times while two
occurred only 137 and 142 times. The approved finite eligible space has seven cases, so this is
not ordinary sampling variation. It violates the approved use of unbiased bounded selection and
makes the distribution report misleading as a generator-quality signal.

## Required repair

### A. Validate the complete immutable content contract

Harden `validateProblemInstance` so malformed or forged input fails in the documented result
shape rather than throwing unexpectedly. It must independently derive the expected values through
the Plan 02 boundary and reject any mismatch in every consumer-visible content field, including:

- source/provenance discriminator and all allowed/prohibited provenance fields;
- request selector, operation, overlays, profile identity/version, and deterministic ID;
- each operand's exact value, initial form, immutable current form, preferred final form, and
  reviewed transition fields;
- explicit result state;
- family, denominator, transformation, result, regrouping, and magnitude classification;
- representation facts; and
- review metadata.

For the approved immutable source record, an operand `currentForm` remains its authored initial
form. Reviewed simplify-first transitions describe an allowed future instructional transition;
they do not mutate the Plan 03 content record. Preserve valid `2/4` fixture behavior.

Add targeted tests for each checked category. At minimum, deeply frozen forged current-form,
classification, representation-fact, and review-metadata variants must return `valid: false`,
and absent/malformed provenance must return `valid: false` with a diagnostic rather than throw.

### B. Select uniformly from eligible finite candidates

After exact candidate-space enumeration and profile filtering, select directly from the ordered
`eligibleIndices` list using the existing `SplitMix64.nextIndex`, whose bounded choice already
uses uint64 rejection sampling. Do not select a raw candidate and scan cyclically to an eligible
one.

Make provenance and report wording honest about this selection method. If selection no longer
visits rejected raw candidates at generation time, its generation attempt count/rejection fields
must not imply it did; candidate-space enumeration remains the auditable source for rejection
reasons. Update fixed seed vectors, cross-process snapshots, and both committed bulk-report
artifacts.

Add a deterministic regression test demonstrating that the seven ordinary like-denominator
eligible cases receive broadly comparable selection counts across a fixed substantial seed set.
Use a stated, robust bound appropriate to the deterministic sample; the test must fail under the
former raw-index-plus-cyclic-scan algorithm and pass under direct eligible-index selection.

### C. Required validation and closeout

- Run `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint`, and `git diff --check`.
- Regenerate the default 1,000-draw JSON and Markdown bulk reports and prove a fresh in-memory
  run matches both committed artifacts.
- Re-run an independent fixed-seed selection sweep and report its complete min/max count range.
- Keep all arithmetic in Plan 02; do not add dependencies or modify package, lockfile, packet,
  deployment, founding, or Plan 02 math files.
- Make a fresh advisor-capability/disposition determination for this behavioral repair. If the
  thread is capable, a fresh read-only consultation is warranted; record its full disposition.
- Commit only the repair's explicit paths, do not push, and stop for final orchestrator review.

## Acceptance condition

Plan 03 may resume final acceptance only when a forged immutable instance cannot change any
consumer-visible derived content state without validation failure, malformed input is reported
fail-closed, eligible finite candidates are selected without cyclic-scan bias, and regenerated
reports/test evidence demonstrate the repaired behavior.

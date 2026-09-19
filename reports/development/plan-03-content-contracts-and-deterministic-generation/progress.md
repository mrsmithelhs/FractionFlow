# Plan 03 Progress Report — Implementation Addendum and Historical Proposal

- **Packet:** `plan-03` — Content Contracts and Deterministic Problem Generation
- **Proposal date:** 2026-09-18 (environment date: `2026-09-18 21:45:14 -04:00`)
- **Stage:** implementation complete; pending final orchestrator/owner review
- **Packet status:** unchanged; no status command was run that mutates packet state
- **Ready for orchestrator review:** yes — implementation evidence and advisor disposition are recorded below

## Current authoritative status

The mechanism-confirmation gate is approved in `mechanism-review.md` and `DECISION-002`.
The implementation described in the addendum at the end of this report is the current
authoritative state. The proposal record that follows this status section is retained as a
historical record of the pre-approval mechanism gate; its statements that implementation had
not yet occurred describe that earlier stage and do not supersede the addendum.

## Historical mechanism-confirmation proposal record

This report proposes the Plan 03 mechanism for a formal, inspectable problem-instance
schema; declarative family contracts; development-only constraint defaults; deterministic
seeded selection; synthetic curated fixtures; and an auditable bulk-validation report.
The proposal is intentionally limited to the packet's required pre-build gate.

No files under `src/content/`, `tests/`, fixture data, package configuration, or deployment
configuration were created or modified. No generator, validator, bulk tool, or report run was
implemented. The only repository change in this turn is this progress report.

The proposal follows the direct request and the Plan 03 stop boundary. `plan-03` passed its
read-only preflight as `RUNNABLE`, but that result is not treated as permission to build.

## Reading and preflight record

Read before drafting:

- `AGENTS.md`.
- `docs/agent-starting-prompts/implementer-prompt.md` (process and authority constraints only;
  the direct request governs the work performed in this turn).
- `reports/orchestration/session-handoff.md`.
- `docs/development/plan-03-content-contracts-and-deterministic-generation.md`.
- `docs/development/README.md` and `docs/decision-log.md` for packet and decision ownership.
- `reports/development/plan-02-exact-arithmetic-mathematical-core/final-review.md`.
- Relevant founding material: `docs/founding/00-principles.md` §§12–13 and 24–25;
  `docs/founding/01-instructional-model.md` §§20–21 and 38;
  `docs/founding/02-interaction-grammar.md` §65;
  `docs/founding/03-math-and-content-model.md` §§27–36, 49–69, 76–77, and 85;
  `docs/founding/04-system-architecture.md` §§7–11;
  `docs/founding/05-quality-and-validation.md` §§8–11; and
  `docs/founding/06-roadmap.md` §§12–15.
- The current Plan 02 public surface in `src/math/` and its synthetic golden-case format in
  `tests/fixtures/math-golden-cases.js`, read to ensure this proposal consumes existing math
  capabilities rather than reimplementing them.

Preflight command and result:

```text
node scripts/dev/plan-status.js check plan-03
RUNNABLE: plan-03 is ready to implement
```

The result means the dependency is complete and the packet may be assigned. It does not clear
the mechanism-confirmation gate described in the packet or authorize Plan 03 source work.

## Mechanism-confirmation record

### Approval boundary

The following proposal requires explicit orchestrator/owner review before any build work:

1. the wire-level problem-instance schema and its current-form semantics;
2. the declarative family definitions and the treatment of operation-specific selectors and
   cross-cutting result properties;
3. the development-default constraint profile;
4. the seed and candidate-selection algorithm;
5. the synthetic fixture location and validation path; and
6. the machine-readable and human-readable bulk-report shape.

The proposed implementation may begin only after the approval is recorded outside this report
and the implementer receives the resulting gate decision. Any approved difference must be
recorded as a proposal-versus-built difference in a later progress-report addendum.

### 1. Proposed problem-instance schema

#### Serialization and exact-value rules

The durable content representation should be a JSON-compatible, human-readable ESM/JSON-like
record. Every integer that becomes a runtime `BigInt` is serialized as a base-10 string. This
matches the existing Plan 02 fixture convention and avoids lossy JSON numbers. The runtime
adapter may construct Plan 02 `fraction` and `mixed-number` values, but it must not simplify or
recalculate them outside the Plan 02 API.

The proposed schema identifier is:

```text
fractionflow.problem-instance/v1
```

The version identifies the record contract, not a production denominator ceiling. The record
also stores the generator version and constraint-profile version so a later replay can identify
which selection rules produced it.

#### Proposed record shape

The following is a conceptual schema, not code to be added during this gate:

```text
ProblemInstance {
  schemaVersion: "fractionflow.problem-instance/v1",
  id: string,
  source: "generated" | "curated",

  selection: {
    familySelector: string,
    operation: "add" | "subtract",
    profileId: string,
    profileVersion: string,
    generatorVersion: string,
    seed: string,
    acceptedCandidateIndex: string,
    attempts: string
  },

  operands: {
    left: Quantity,
    right: Quantity
  },

  canonicalPath: Path,
  alternatePaths: [Path],

  classification: {
    family: FamilyClassification,
    denominator: DenominatorClassification,
    transformations: TransformationClassification,
    result: ResultClassification,
    regrouping: RegroupingClassification,
    magnitude: MagnitudeClassification,
    target: TargetClassification
  },

  representationFacts: RepresentationFacts,
  reviewMetadata: ReviewMetadata
}
```

`Quantity` explicitly separates value from form:

```text
Quantity {
  exactValue: ExactFraction,       // stable numerical value, normally reduced
  initialForm: Form,               // authored starting form
  currentForm: Form,               // form at this replayable state snapshot
  preferredFinalForm: Form,
  acceptedFormTransitions: [FormTransition]
}

Form =
  { kind: "fraction", numerator: string, denominator: string }
  | { kind: "mixed-number", whole: string,
      fraction: { numerator: string, denominator: string } }
```

The following semantics are part of the proposal:

- `exactValue` is the immutable mathematical quantity. It is an exact rational value, stored
  in a stable representation; it is not the learner's display state.
- `initialForm` is the form selected by the content contract. Initial operands are generally
  simplest-form proper fractions in the development profile, but the schema permits a deliberate
  unsimplified or mixed form when a future/curated profile makes that the target.
- `currentForm` is the learner-established or replayed mathematical form at the current state
  snapshot. In a newly generated static instance it equals `initialForm`; later interaction
  state may replace it only through an accepted exact transformation.
- `preferredFinalForm` is an authored preference, such as a simplified fraction or reviewed
  mixed-number form. It is not a mathematical validity requirement.
- `acceptedFormTransitions` records exact, reviewable state changes. It is not learner data and
  must not record a learner identity, attempt history, or analytics event.

`FormTransition` should have this conceptual shape:

```text
FormTransition {
  id: string,
  type: "simplify-first" | "equivalent-renaming" | "mixed-regrouping",
  target: "left" | "right" | "result" | "minuend",
  fromForm: Form,
  toForm: Form,
  preservesExactValue: true,
  establishesCurrentForm: true,
  downstreamBasis: "current-form"
}
```

The `simplify-first` case is intentionally explicit. If an operand changes from, for example,
`2/4` to `1/2`, later denominator reasoning evaluates the new `currentForm` denominator. The
content record should retain a classification snapshot for the authored starting state and a
path-state snapshot after the transition when both are relevant. This prevents a reclassified
post-transformation state from being mistaken for a failed original family check. The default
development profile does not generate unsimplified operands accidentally; the schema supports
the state change for curated or explicitly targeted content.

`Path` should make the canonical and alternate routes inspectable without making one route the
definition of mathematical truth:

```text
Path {
  id: string,
  kind: "lcd" | "non-least-common-denominator" | "simplify-first" | "mixed-regrouping",
  status: "canonical" | "alternate-valid",
  startingState: string,
  steps: [
    {
      type: "equivalent-renaming" | "operation" | "simplify" | "regroup",
      inputState: string,
      outputState: string,
      targetDenominator: string | null,
      scaleFactors: { left: string | null, right: string | null },
      rawResult: ExactFraction | null,
      finalResult: Form | null
    }
  ]
}
```

The record should store the least common denominator and selected alternate valid common
denominators, but should not pretend that a finite list exhausts the infinite set of valid
common multiples. It should also store the rule that makes the set valid: a positive common
multiple of the current operand denominators. Each selected alternate path must be validated by
Plan 02, including exact equivalence and operation-result validation.

`classification` should include, at minimum, the following derived facts:

- `family`: primary family ID, operation, overlay IDs, and the state snapshot to which membership
  applies;
- `denominator`: starting and path-state relationships (`same`, `nested`, `shared-factor`, or
  `relatively-prime`), least common denominator, selected alternate denominators, and the left
  and right scale factors for each path;
- `transformations`: which operands require renaming at the canonical path and which exact
  transformations are valid;
- `result`: canonical raw exact result, simplified result, result form, simplification status,
  whole-crossing fact, and whether the result is whole-valued;
- `regrouping`: `none`, `composition`, or `decomposition`, plus exact whole-unit counts where
  the Plan 02 core supplies them;
- `magnitude`: exact benchmark and whole-boundary facts from Plan 02, not a renderer estimate;
- `target`: intended concept, required properties, excluded accidental properties, and the
  authored preference for the canonical path.

`representationFacts` records facts without deciding renderer thresholds:

```text
RepresentationFacts {
  operandDenominators: { left: string, right: string },
  canonicalDenominator: string,
  resultDenominator: string,
  wholeSpan: { lowerWhole: string, upperWhole: string },
  subdivisionCounts: { left: string, right: string, canonical: string },
  eligibility: {
    fractionBar: "deferred",
    numberLine: "deferred",
    symbolic: "deferred"
  },
  alternateRepresentationRecommendation: "none" | "review-required"
}
```

The exact meaning of `subdivisionCounts` is mathematical (for example, denominator and
canonical denominator), while `eligibility` remains a later reviewed output. No fixed visual
threshold is proposed here. The schema records enough data for a future renderer-specific
review to make a decision without altering mathematical classification.

`reviewMetadata` should include the packet-required review dimensions:

```text
ReviewMetadata {
  scaleFactors: { left: string, right: string },
  magnitudeRange: { lowerWhole: string, upperWhole: string, benchmarkRegion: string },
  intendedTargetConcept: string,
  likelyAlternateValidPaths: [string],
  authoredCoverageNote: string,
  synthetic: true
}
```

There is no learner, account, classroom, or analytics field in this schema. `synthetic: true` is
an assertion that the source data contains no learner data; it is not a substitute for review of
the repository diff.

#### Plan 02 boundary

The future content implementation may select candidate integers and evaluate declarative
constraints, but all mathematical facts must cross the Plan 02 boundary. In particular it must
use the existing core for `createFraction`, `createMixedNumber`, `denominatorRelationship`,
`leastCommonDenominator`, `operandsRequiringRenaming`, `addFractions`/`subtractFractions`,
`addAtCommonDenominator`/`subtractAtCommonDenominator`, `simplifyFraction`,
`classifyFractionResult`, `classifyMagnitude`, `classifyMixedRegrouping`, and the relevant
validation functions. The content layer may compare returned facts to a family definition; it
must not implement a second gcd, lcm, equivalence, arithmetic, or simplification path.

### 2. Proposed family-definition format and membership checks

Family definitions should be declarative, human-readable data. They should contain named
predicates and expected values, not arbitrary executable functions hidden inside each definition.
A small membership engine can interpret those predicates and call the Plan 02 core. A proposed
future data file is `src/content/data/family-definitions.js`; this is a proposed location only,
not a file created in this turn.

Conceptually:

```text
FamilyDefinition {
  id: string,
  kind: "structural" | "overlay",
  operations: ["add", "subtract"],
  required: [Predicate],
  excludedUnlessExplicit: [Predicate],
  subcategories: [string],
  defaultProfile: string
}
```

The recommended family model separates structural families from orthogonal result properties:

- Structural families answer what denominator relationship and operation the problem teaches.
- `reducible-result` and `crosses-one-whole` are orthogonal overlays because either can occur
  across more than one structural family. They still have their own selectors and bulk-report
  rows, so the eight Phase 1 items remain auditable.
- Operation stays a required dimension. The generated selector expands `add` and `subtract`
  explicitly for shared-factor and relatively-prime denominators, even though the roadmap names
  those two relationships without repeating the operation. This avoids a family label that can
  silently accept a subtraction-only or addition-only interpretation.

This structural/overlay split is a proposal requiring approval. If the owner instead wants eight
mutually exclusive family IDs, the same predicates can be expanded into operation-specific
records without changing the mathematical checks; the choice must be recorded before build.

#### Membership table

| Selector | Required exact checks | Default accidental-complexity exclusions |
|---|---|---|
| `like-denominator-addition` | operation `add`; proper operands; denominator relationship `same`; both canonical scale factors `1`; Plan 02 exact addition result | zero operand, operand not simplest, reducible result, exact-one/crossing result unless targeted |
| `like-denominator-subtraction` | operation `subtract`; proper operands; relationship `same`; left value ≥ right value; both scale factors `1`; nonnegative exact subtraction | zero result, zero operand, operand not simplest, reducible result unless targeted |
| `nested-denominator-addition` | operation `add`; proper operands; relationship `nested`; denominators differ; exactly one canonical operand rename; exact result | zero operand, simplification, whole crossing, or other target not named by profile |
| `nested-denominator-subtraction` | operation `subtract`; proper operands; relationship `nested`; denominators differ; exactly one rename; left value ≥ right value | zero result/operand, simplification, whole crossing, or other target not named by profile |
| `shared-factor-unlike` + operation selector | relationship `shared-factor`; denominators differ; neither divides the other; gcd > 1 as returned by the core; both operands renamed at LCD; addition or nonnegative subtraction | zero operand, simplification, whole crossing, or arithmetic burden outside profile |
| `relatively-prime-unlike` + operation selector | relationship `relatively-prime`; denominators differ; both operands renamed; LCD equals denominator product; addition or nonnegative subtraction | zero operand, simplification, whole crossing, or arithmetic burden outside profile |
| `reducible-result` overlay | canonical raw result classification has `simplificationStatus: reducible`; raw and simplified results are exactly equivalent; selected structural family also passes | zero-only reduction unless explicitly targeted; accidental operand reduction |
| `crosses-one-whole` overlay | canonical result classification has `crossesWhole: true` and exact result > 1; the selected structural family also passes | exact-one is not treated as crossing; more-than-one-whole results are excluded by the default profile unless targeted |

The first six rows are the primary Phase 1 structural contracts. The last two rows are target
overlays. A report must show both the primary selector and overlay combination so a reducible
crossing result is not counted as a separate, opaque family.

The membership engine should return a structured result rather than a boolean:

```text
{
  valid: boolean,
  familyId: string,
  failedChecks: [{ checkId: string, expected: unknown, actual: unknown }],
  derivedFactsUsed: [string],
  stateSnapshot: string
}
```

That makes a failed candidate auditable and makes it possible for the bulk report to distinguish
family mismatch from an exact-arithmetic failure or a profile rejection.

### 3. Proposed constraint profiles and development defaults

The default profile is a development convenience, not a production contract, representation
ceiling, or learner-difficulty policy. It should be named and versioned so every generated record
states which defaults were used:

```text
profileId: "phase1-dev-default"
profileVersion: "1"
```

Recommended defaults:

- Denominator pool: `[2, 3, 4, 5, 6, 8, 10, 12]`. This deliberately favors the manageable,
  meaningful denominator relationships named in the founding documents. It is a finite default
  pool, not a claim that larger denominators are invalid.
- Operand form: proper fraction by default, with numerator in `1..denominator-1` and
  `gcd(numerator, denominator) = 1`. Zero operands and unsimplified starting operands are
  excluded unless a profile explicitly targets them.
- Operation: supplied by the family selector; no random operation choice hidden inside a family.
- Subtraction: left value must be at least the right value; positive result is the default. Zero
  is available only through an explicit target profile.
- Structural relationship: selected before numerators, and then rechecked after the Plan 02
  classification. The generator must reject candidates that accidentally land in another
  relationship.
- Canonical path: least common denominator; both scale factors are recorded.
- Alternate path: when the profile requests one, select a deterministic non-least common
  denominator such as a small valid multiple of the LCD and validate it through Plan 02. No
  finite alternate list is claimed to be exhaustive.
- Accidental complexity: result is non-reducible, does not cross one whole, and is not exactly
  one by default. `reducible-result` and `crosses-one-whole` opt in explicitly; combinations are
  allowed only when the selector names both overlays.
- Magnitude: positive result below two wholes for the initial proper-fraction profile. This
  keeps development examples modest while allowing the crossing-one-whole overlay. It is a
  profile parameter, not a global mathematical limit.
- Scale-factor burden: canonical scale factors no greater than `6` by default. This is a
  development filter for manageable arithmetic, not a representation threshold or permanent
  denominator ceiling.
- Candidate attempts: at most `4096` deterministic candidates per requested instance before
  returning an explicit `no-eligible-candidate` failure. Exhaustion is reported, never silently
  replaced by an unprofiled candidate.
- Bulk default: `1000` accepted instances per expanded selector/profile combination, with the
  actual requested and accepted sizes written into every report. This is a validation workload
  default, not a production session size.
- Representation data: record denominator, LCD, result magnitude, and subdivision facts only;
  leave renderer eligibility as `deferred` until a representation-specific review establishes
  evidence.

Per-selector profiles may relax or target one dimension, but must declare the change explicitly:

```text
phase1-dev-default                     // proper, positive, non-reducible, non-crossing
phase1-dev-reducible-result             // requires reducible canonical raw result
phase1-dev-crosses-one-whole            // requires result > 1
phase1-dev-reducible-crossing           // requires both overlays; explicit combination
phase1-dev-zero-subtraction             // optional diagnostic/fixture profile, not default
```

The profile must reject conflicting combinations up front (for example, a profile that both
requires a proper result and requires crossing one whole). It must report the conflict as a
configuration error rather than weakening either constraint.

### 4. Proposed deterministic seed strategy

The reproducibility key is:

```text
(schemaVersion, generatorVersion, familySelector, operation,
 profileId, profileVersion, seed)
```

The same key must produce the same serialized instance, classification, and canonical path in
separate Node processes. A profile or generator revision is intentionally part of the key; that
allows old records to remain replayable while permitting a new selection algorithm later.

Recommended algorithm:

1. Accept a nonempty UTF-8 seed label and preserve it verbatim in the record. CLI validation
   rejects control characters and ambiguous normalization rather than silently changing the
   label.
2. Build a canonical, delimiter-safe domain string from the key above in fixed field order.
3. Hash the UTF-8 bytes with an explicitly documented dependency-free 64-bit FNV-1a procedure.
4. Feed that unsigned 64-bit state to an explicitly documented SplitMix64-style generator.
5. Derive each batch item from a fresh domain-separated state using
   `seed`, `familySelector`, `profileVersion`, and a decimal `batchIndex`. Do not use a single
   mutable global stream for the whole batch.
6. Use rejection sampling for bounded integer selection so modulo bias does not affect the
   candidate distribution. Every candidate is built from the selected family structure first:
   denominator relationship, denominator pair, target result property, and only then numerators.
7. For each generated instance, record the accepted candidate index and attempt count. Aggregate
   rejection reasons in the bulk report.

The exact hash and PRNG constants must be written into the future implementation's validation
documentation and tested with fixed vectors. They are not to be replaced with `Math.random`,
`Date.now`, an unpinned library, or a browser-dependent hash. Seed selection chooses among
eligible candidates; it never changes the exact mathematical meaning of a candidate.

The future implementation should expose a canonical serialization function for instance
comparison. It must sort or explicitly emit fields in a fixed order, serialize every BigInt as
its decimal string form, and exclude non-deterministic timestamps from the instance identity.
Human-readable report timestamps, if included, are run metadata only and never generator input.

### 5. Proposed synthetic-fixture approach

Curated cases should be source data, not test-only code paths. A proposed future location is
`src/content/data/phase1-golden-cases.js`, with test harness adapters under `tests/` if needed.
This location is proposed, not created in this turn.

Fixture rules:

- Every fixture is synthetic and contains no learner, account, school, classroom, credential, or
  analytics data.
- Use stable IDs and decimal-string integers. Descriptions should explain the mathematical
  structure without pretending to describe a real learner.
- Fixtures use the same `ProblemInstance` schema as generated records, with `source: "curated"`.
  They are sent through the same normalization, Plan 02 classification, family-membership, and
  validation pipeline. There is no fixture-only acceptance branch.
- Keep expected derived facts in the fixture only where they serve as an auditable assertion
  (for example, expected raw LCD result, simplified result, family, and selected alternate
  path). The validator recomputes them through Plan 02 and reports mismatches.
- Cover every primary selector and both overlay states where the values make sense. Include the
  Plan 02-aligned cases for nested addition, relatively-prime addition, shared-factor
  subtraction, like-denominator crossing, reducible results, zero/one edge behavior where an
  explicit diagnostic profile allows it, and valid non-least common-denominator paths.
- Include at least one fixture that demonstrates the proposed simplify-first state transition
  (`currentForm` changes while `exactValue` does not) without treating the post-transition
  denominator relationship as a defect.
- Preserve the distinction between raw/current forms and simplified/preferred forms. A fixture
  must not silently replace `2/4` with `1/2` merely because the numerical values are equal.
- Do not import learner data or depend on a sibling repository. The fixture file must remain
  portable in the public repository.

The Plan 02 golden cases are evidence and alignment inputs, not authorization to copy their test
harness into Plan 03. The future content fixtures should be independently validated through the
shared content contract while retaining the same synthetic, string-based durability convention.

### 6. Proposed bulk-validation report shape

The bulk tool should emit both:

1. a machine-readable JSON report for later comparison and automated gates; and
2. a human-readable Markdown rendering of that same report for review.

The report itself should have a versioned shape like this:

```text
BulkValidationReport {
  reportVersion: "fractionflow.content-bulk-report/v1",
  run: {
    generatorVersion: string,
    schemaVersion: string,
    profileId: string,
    profileVersion: string,
    baseSeed: string,
    requestedBatchSize: string,
    seedDerivation: string,
    command: string,
    recordedAt: string | null       // informational only; not generator input
  },
  selectors: [{
    selector: string,
    requested: string,
    accepted: string,
    rejected: string,
    exhausted: string,
    membershipFailures: string,
    exactnessFailures: string,
    duplicateInstances: string,
    rejectionReasons: { [reason: string]: string },
    contractChecks: {
      familyMembership: { passed: string, failed: string },
      exactResult: { passed: string, failed: string },
      canonicalPath: { passed: string, failed: string },
      alternatePath: { checked: string, passed: string, failed: string },
      excludedComplexity: { passed: string, failed: string },
      representationFacts: { recorded: string, deferredEligibility: string }
    },
    distributions: {
      denominatorRelationship: Histogram,
      operandRenamePattern: Histogram,
      scaleFactorLeft: NumericSummary,
      scaleFactorRight: NumericSummary,
      canonicalDenominator: NumericSummary,
      resultForm: Histogram,
      simplificationStatus: Histogram,
      crossesWhole: Histogram,
      subcategories: Histogram,
      uniqueInstanceRate: NumericSummary
    },
    failureSamples: [{ seed: string, id: string | null, reason: string,
                       expected: unknown, actual: unknown }]
  }],
  curatedFixtures: {
    requested: string,
    passed: string,
    failed: string,
    failureSamples: [{ id: string, reason: string }]
  },
  overall: {
    pass: boolean,
    blockingFailures: string[],
    warnings: string[]
  }
}
```

`Histogram` entries must include counts and percentages with the population `n` visible. A
`NumericSummary` must include at least `n`, `min`, `p50`, `p90`, `p95`, `p99`, and `max` using a
documented deterministic percentile method (recommended: nearest-rank). For small populations,
the report should say which percentiles collapse to the same observation rather than inventing
precision. No conclusion should be based on a bare mean or an unqualified count.

The Markdown rendering should contain these sections in order:

1. run metadata and an exact replay command;
2. per-selector requested/accepted/rejected batch sizes;
3. rejection counters by reason, including candidate-exhaustion counts;
4. contract-check pass/fail table for membership, exactness, canonical path, alternate paths,
   excluded complexity, and representation facts;
5. distribution tables for denominator relationships, scale factors, result forms,
   simplification status, whole crossing, operand-renaming pattern, and subcategory balance;
6. tails for every numeric summary (`n`, min, p50, p90, p95, p99, max);
7. duplicate/uniqueness visibility and representative seeds/IDs;
8. curated-fixture validation results; and
9. blocking failures, non-blocking warnings, and unresolved review questions.

The report should fail its validation gate for any invalid family membership, exact-result
mismatch, invalid canonical/alternate path, excluded accidental complexity, or unexpected
negative result. It should warn rather than invent a mathematical failure when a representation
eligibility threshold has not yet been reviewed. It should make a poor distribution visible;
whether a distribution is acceptable remains a declared profile/review decision, not an
unwritten assertion in the report renderer.

### 7. Tooling-capability basis and dependency proposal

No new development dependency is proposed. The existing Node/Vitest toolchain and built-in Node
facilities are sufficient for:

- a dependency-free seeded PRNG and canonical serialization;
- content data and membership checks;
- a Node bulk-validation command using built-in filesystem/process APIs; and
- tests that compare fixed seed vectors, fixtures, and report summaries.

This preserves the dependency-complexity boundary in `docs/founding/04-system-architecture.md`
§60. Therefore `package.json` and `package-lock.json` are not part of the requested or proposed
write scope for this gate. If implementation later demonstrates a genuine missing capability,
the implementer must stop and submit a narrowly justified dependency proposal before changing
either file.

## Explicit approval questions / load-bearing choices

The following points should be resolved in the orchestrator/owner review before build:

1. **Family identity:** approve the recommended structural-family plus overlay model, with
   operation-specific selectors for shared-factor and relatively-prime cases, or direct the
   implementer to use eight mutually exclusive IDs.
2. **Default profile:** approve `phase1-dev-default/v1` as a replaceable development profile,
   especially the denominator pool, positive-result rule, `< 2`-whole magnitude band, scale
   factor `<= 6` default, and 4096-attempt guard. These are defaults, not product ceilings.
3. **Current-form snapshots:** approve anchoring family membership to the authored starting
   snapshot while recording any simplify-first post-transition classification separately.
4. **Alternate paths:** approve storing selected valid alternates plus the common-multiple rule,
   rather than claiming an exhaustive list of infinitely many alternatives.
5. **Bulk size and percentile method:** approve 1000 accepted instances per expanded selector as
   the initial development workload and nearest-rank percentiles, subject to later evidence.
6. **Fixture location:** approve source-data fixtures under `src/content/data/`, with no special
   validator path and no learner data.

These are proposals, not owner decisions. This report does not edit `docs/decision-log.md` or
packet frontmatter.

## Files changed

- Added only `reports/development/plan-03-content-contracts-and-deterministic-generation/progress.md`.
- No `src/content/` files changed.
- No tests, fixtures, package files, lockfiles, deployment files, packet files, or status index
  files changed.

## Artifacts produced

- This mechanism-confirmation proposal and approval-question record.
- No generated problem instances, family-definition files, seed utility, fixture set, bulk tool,
  or bulk-validation report was produced.

## Commands run and results

```text
node scripts/dev/plan-status.js check plan-03
  PASS — RUNNABLE: plan-03 is ready to implement

Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'
  2026-09-18 21:45:14 -04:00

git status --short --untracked-files=all
  clean before this report was added (Git emitted only the known user-config Git-ignore
  permission warnings)
```

Read-only searches and file reads were also used to inspect the required packet, handoff,
founding references, Plan 02 final review, public math exports, and existing synthetic fixtures.
No test, build, generator, or bulk-validation command was run because implementation is not
authorized at this gate.

## Validation checks performed

- Confirmed the packet dependency and status gate with `plan-status.js check`.
- Confirmed Plan 02 final-review acceptance and the existing exact-arithmetic boundary.
- Confirmed that the proposed core calls correspond to existing Plan 02 exports rather than a
  proposed content-layer reimplementation.
- Confirmed the report leaves representation eligibility as data/deferred, not as a new fixed
  renderer threshold.
- Confirmed the proposed fixture and report fields contain no learner-data or identity path.
- Confirmed no source, test, fixture, package, lockfile, deployment, packet-status, or decision-log
  mutation was made.

This is design evidence only. It is not evidence that Plan 03 generation or bulk validation
passes; those claims require the post-approval implementation and artifact-level verification.

## Problems encountered and how resolved

- The roadmap names shared-factor and relatively-prime unlike-denominator families without
  repeating the operation, while the mathematical model defines addition and subtraction
  variants. The proposal records both interpretations and recommends an explicit operation
  dimension plus auditable overlay/selector expansion. This remains an approval question rather
  than a silent implementation choice.
- The founding documents require representation feasibility data but defer exact thresholds. The
  proposal records denominator/magnitude/subdivision facts and deferred eligibility instead of
  inventing a renderer ceiling.
- The packet requires a formal current-form distinction even though the default generated
  operands begin simplified. The proposal models the simplify-first transition explicitly and
  separates starting-state family membership from later current-form snapshots.

No dependency failure, Plan 02 capability gap, or bulk-validation failure was encountered because
no implementation was attempted.

## Remaining risks and follow-ups

- The owner/orchestrator must approve or revise the six load-bearing choices above before build.
- The exact FNV-1a/SplitMix64 constants and fixed seed vectors still need to be written into the
  implementation and tested after approval.
- The proposed profile may prove too sparse for one selector, especially under the scale-factor
  and result-magnitude defaults. If so, the implementer must report the unsatisfied profile and
  rejection distribution rather than silently relaxing it.
- Bulk distribution acceptability is not defined by this proposal. The first report should expose
  tails and counts so that a later owner decision can distinguish a generator defect from an
  intentionally narrow development profile.
- Mixed-number support is represented in the schema but is not proposed as a new Plan 03 initial
  generator family. Any mixed-number expansion beyond the approved scope requires a separate
  decision or packet clarification.
- The report format is proposed, not validated by a parser or by a real batch run.

## Advisor-consultation disposition

**Degraded mode: orchestrator-gate-only.** No advisor consultation ran. This turn produced only a
docs-only mechanism proposal and no implemented code, script, or behavioral schema artifact for a
pre-delivery advisor to critique; the required review path is the explicit orchestrator/owner
mechanism gate. The primary thread remained the sole writer, and no advisor disposition is being
claimed as approval.

## Stop condition

Stopping now at the required mechanism-confirmation gate. Await explicit orchestrator/owner
approval or requested revisions. No Plan 03 source, tests, fixtures, package configuration,
bulk tooling, deployment file, or packet-status change is authorized by this report.

## Implementation addendum — 2026-09-18

### Scope and gate

The approved mechanism gate was used as the implementation boundary. The implementation stayed
within `src/content/`, content tests, synthetic fixture data, deterministic seed utilities, bulk
validation tooling and its report artifacts, and this Plan 03 progress report. No package file,
lockfile, deployment file, packet frontmatter, packet-status index, founding document, decision
log, or Plan 02 math-core file was modified. Packet status remains `in-progress`.

The required preflight was run before implementation:

```text
node scripts/dev/plan-status.js check plan-03
  RUNNABLE: plan-03 is ready to implement
```

The same read-only check was rerun during final verification and returned the same result. It was
not treated as permission to change packet status.

### Implemented contract

The implementation provides one immutable `fractionflow.problem-instance/v1` contract with:

- the eight approved selectors: `like-denominator-addition`,
  `like-denominator-subtraction`, `nested-denominator-addition`,
  `nested-denominator-subtraction`, `shared-factor-addition`,
  `shared-factor-subtraction`, `relatively-prime-addition`, and
  `relatively-prime-subtraction`;
- declarative `reducible-result` and `crosses-one-whole` overlays, with normalized overlay
  order and configuration-time compatibility rejection; crossing is unavailable for subtraction
  in the initial profile;
- discriminated `generated` and `curated` provenance. Generated records contain generator and
  profile versions, seed, seed algorithm, selected raw candidate index, and the selected ordinal
  in the ordered eligible-index list. Candidate-space rejection counts belong to enumeration and
  bulk reports, not to generation-attempt history. Curated records contain only durable fixture
  identity and authoring revision in their provenance section;
- explicit result state for exact result, canonical raw result form, current form, and preferred
  final form;
- immutable source operand forms plus reviewed, exact-equivalent transformations. The source
  record contains no learner history or learner-established mutation;
- classification and representation facts, with representation eligibility explicitly deferred
  rather than inventing renderer thresholds.

`src/content/analysis.js` and `src/content/validation.js` call the existing Plan 02 exports for
fraction creation, comparison, denominator relationship, least common denominator, conversion,
operation results, equivalence, simplification, and classification. A static search found no
`gcd`, `lcm`, `Math.random`, `Date.now`, or `performance.now` use in `src/content/`; the only
`gcd`/`lcm` matches in the combined search were existing Plan 02 math tests.

The validator now fails closed for the contract boundaries identified during review: deep
immutability, instance identity, request profile version, result current form, and generated-only
versus curated-only provenance fields. Curated fixtures and generated instances both enter through
the same candidate derivation, membership, path, result, and validation pipeline.

### Determinism and synthetic fixtures

The seed utility is dependency-free and documents the fixed algorithm as FNV-1a-64 followed by
SplitMix64 and uint64 rejection sampling. Fixed vectors are recorded in
`tests/content-seed.test.js`; the seed hash vector is `d2ecedc70ede55dd`, and the first three
SplitMix64 vectors are `31059bfd7acd41a8`, `f90ec645da3e2f21`, and `fb3fce375ac4ec78`.

The separate-process test compares the generated instance's ID, result state, classification,
canonical path, alternate paths, and provenance with the parent-process snapshot. The fixed
cross-process vector is `like-denominator-addition__none__2__5__2__5`, with exact result
`4/5`, selected candidate index `64`, uniform-eligible ordinal `5`, and no scan-attempt field.

Twelve synthetic curated fixtures in `src/content/data/phase1-golden-cases.js` exercise all eight
selectors, the approved overlays, exact results, alternate valid paths, and the reviewed
simplify-first transformation. The simplify-first fixture preserves an authored `2/4` initial
form, an exact value of `1/2`, and an explicit exact-equivalent review transition to `1/2`.
All twelve fixtures pass the common pipeline and retain curated-only provenance.

### Bulk-validation evidence

The committed default report was generated with:

```text
node src/content/bulk-validation.js --sample-size 1000 --seed plan03-bulk-v1
```

The report covers all 24 declaratively allowed selector/overlay request combinations. It records
status, raw and eligible finite candidate-space cardinality, requested and accepted sampled
draws, unique mathematical instances, duplicate accepted draws, finite-space coverage, contract
checks, distributions, representative instances, and rejection reasons separated by population
(`candidateSpaceEnumeration` versus `sampledGeneration`).

The ordinary no-overlay eligible cardinalities are 7/7 for like denominators, 40/40 for nested
denominators, 68/68 for shared-factor denominators, and 34/34 for relatively-prime denominators
(addition/subtraction respectively). Every validated overlay request accepted all 1,000 requested
draws. The default report contains 21 validated requests and three explicit
`unsatisfiable-for-profile` requests: relatively-prime addition with `reducible-result`, the
same combination with crossing, and relatively-prime subtraction with `reducible-result`.
Those three have zero eligible candidates and are surfaced as warnings with sampled
`NO_ELIGIBLE_CANDIDATE` counts rather than being presented as successful coverage. Duplicate
draws are expected for these small finite spaces and are reported separately from unique counts.

The generated artifacts are:

- `reports/development/plan-03-content-contracts-and-deterministic-generation/bulk-validation-report.json`
- `reports/development/plan-03-content-contracts-and-deterministic-generation/bulk-validation-report.md`

The report replay check compared a fresh in-memory default run with both artifacts:

```text
jsonMatches: true
markdownMatches: true
selectorCount: 24
curated: requested 12, passed 12, failed 0
pass: true
```

Custom bulk runs now record a replay command containing their actual sample size, seed, profile,
and request set rather than claiming the default CLI invocation.

### Advisor-capability and disposition record

This implementation has a real behavioral surface (schemas, generators, validators, seed
selection, fixtures, and bulk reporting), so an advisor review was warranted. The available
review route was a bounded clean-context reviewer. The requested reviewer was instructed to be
read-only, not spawn further agents, not commit, not change packet status, and not modify files;
the primary thread remained the sole writer. The observed model/provider was **GPT-5 via the
OpenAI Codex runtime**. The effective disposition was a compensating clean-context advisor review
with immediate post-review worktree verification; no higher-tier model override was selected.

The advisor reported five findings. All five were addressed within scope:

1. The stale proposal-only progress report was converted into a historical proposal record with
   this authoritative implementation addendum and final advisor disposition.
2. Validation was hardened for deep nested immutability, forged instance IDs, profile-version
   mismatch, invalid result current forms, and invented generated fields on curated provenance.
3. Default bulk requests now enumerate every declared overlay set. Profile-unsatisfiable sets are
   explicitly reported and warned rather than silently omitted.
4. Bulk replay metadata now reflects custom API runs as well as the default CLI run.
5. Cross-process reproducibility now compares classification and canonical/alternate paths in
   addition to ID, result state, and provenance.

The advisor made no repository changes. A post-review status inspection confirmed that only the
explicit Plan 03 implementation/report paths were present. The remaining risks below are
recorded as risks, not silently reclassified as defects or owner decisions.

### Files changed in this implementation

Within the authorized scope:

- `src/content/analysis.js`
- `src/content/bulk-validation.js`
- `src/content/curated.js`
- `src/content/data/phase1-golden-cases.js`
- `src/content/family-definitions.js`
- `src/content/generator.js`
- `src/content/index.js`
- `src/content/membership.js`
- `src/content/profiles.js`
- `src/content/schema.js`
- `src/content/seed.js`
- `src/content/validation.js`
- `tests/content-bulk-validation.test.js`
- `tests/content-curated.test.js`
- `tests/content-generator.test.js`
- `tests/content-seed.test.js`
- `reports/development/plan-03-content-contracts-and-deterministic-generation/bulk-validation-report.json`
- `reports/development/plan-03-content-contracts-and-deterministic-generation/bulk-validation-report.md`
- this progress report

No other paths are authorized by or included in this implementation.

### Final verification

```text
npm test
  8 test files passed; 107 tests passed

npm run build
  Vite production build passed

node scripts/dev/plan-status.js lint
  lint: OK (no violations)

node scripts/dev/plan-status.js check plan-03
  RUNNABLE: plan-03 is ready to implement

git diff --check
  passed

node src/content/bulk-validation.js --sample-size 1000 --seed plan03-bulk-v1
  pass: true; report JSON and Markdown written
```

### Remaining risks and owner-visible questions

- The initial development profile is intentionally finite and narrow; duplicate warnings and the
  three profile-unsatisfiable overlay combinations are evidence for future profile/coverage
  decisions, not a product-quality ceiling.
- Mixed-number forms are represented by the common schema but are not generated by this initial
  fraction-only profile. Expanding that generator surface needs a separate scoped decision.
- Representation eligibility remains deferred facts for a later renderer/interaction gate; this
  packet does not establish classroom-facing visual thresholds.
- The bulk report's overall result is `PASS` for validated draws while retaining explicit warnings
  for duplicates and profile-unsatisfiable declared combinations. An owner may later choose to
  promote those warnings to a stricter release gate without changing the mathematical contract.

### Stop condition

Implementation and evidence are complete for this turn. No packet status was changed, no package
or deployment file was touched, and nothing was pushed. Stop for final orchestrator/owner review.

## Repair 01 addendum — contract validation and unbiased eligible selection

### Repair scope and authorization

Plan 03 remains `delivered` and is not accepted. The packet preflight therefore returned:

```text
BLOCKED: plan-03 has status "delivered" — not ready or in-progress
```

That result was preserved. The explicit Repair 01 assignment authorized this bounded repair
without reopening or mutating packet status. No package, lockfile, deployment, packet frontmatter,
decision-log, founding-document, or Plan 02 math-core file was changed.

### Contract-validation repair

`validateProblemInstance` now has one outer fail-closed boundary: malformed, missing, cyclic, or
otherwise unexpected records return `{ valid: false, checks, errors, facts, request }` instead of
leaking a `TypeError` or another validation exception. The validator independently derives the
expected content through the Plan 02-backed candidate pipeline and compares the complete
consumer-visible contract, including:

- schema/version, deep immutability, source/provenance discriminator, exact provenance shape,
  generated seed replay, selected candidate index, eligible ordinal, and curated durable
  non-empty fixture identifiers;
- selector, operation, overlays, profile identity/version, and deterministic ID;
- both operands' exact value, authored initial form, source-preserved current form, preferred
  final form, transition array, transition equivalence, simplify-first target, and transition
  metadata;
- exact result state, canonical and alternate paths, path transformations, and operation results;
- family, denominator, transformation, result, regrouping, and magnitude classification;
- representation facts, deferred eligibility fields, subdivision facts, and review metadata.

The source-record rule remains explicit: an operand's `currentForm` must equal its authored
`initialForm`. A reviewed simplify-first transition is validated as an exact-equivalent future
allowed transformation and does not mutate the source record. The curated `2/4` fixture continues
to validate with `2/4` as its initial/current source form and `1/2` as its exact value and reviewed
future transformation.

### Direct uniform eligible selection

Generation now enumerates and filters the finite candidate space once, then calls the existing
bounded `SplitMix64.nextIndex` on the ordered `eligibleIndices` list. It directly selects
`eligibleIndices[selectedEligibleOrdinal]`; it no longer selects a raw candidate and scans
cyclically to the next accepted candidate.

Generated provenance now records `selectedCandidateIndex` and:

```text
selection: {
  strategy: "uniform-eligible-index",
  eligibleOrdinal: string
}
```

It no longer records generation `attempts` or sampled rejection counts. Candidate-space rejection
counts remain available from finite enumeration and bulk reports, where their population is named.
The bulk report's seed derivation wording now states direct uniform selection from ordered eligible
candidate indexes.

The fixed separate-process vector was updated to:

```text
ID:               like-denominator-addition__none__2__5__2__5
exact result:     4/5
selected index:   64
eligible ordinal: 5
```

The FNV-1a-64 and SplitMix64 fixed primitive vectors are unchanged. Generated provenance
validation now recreates the seed key and bounded selection and rejects a seed that no longer
replays the recorded eligible ordinal.

### Distribution evidence

The focused regression test uses 7,000 fixed seed labels with the prefix
`repair-01-sweep-` over the seven ordinary like-denominator eligible cases. Direct eligible-index
selection produced this complete range and count set:

```text
cases: 7; min: 966; max: 1064
1015, 990, 999, 966, 996, 1064, 970
```

Replaying the former raw-index-plus-cyclic-scan algorithm over the identical labels produced
`min: 12; max: 6202`, including one case at 6,202 and several below 20. The new `900..1100`
assertion therefore passes for the repaired algorithm and fails under the former biased algorithm.

### Bulk-report repair

The bulk validator now consumes the current validator check IDs, including canonical-path,
representation-facts, and complete-contract checks. Any failed contract counter is a blocking bulk
failure; the report can no longer declare `PASS` while sampled contract checks fail. The default
report was regenerated with:

```text
node src/content/bulk-validation.js --sample-size 1000 --seed plan03-bulk-v1
```

Fresh replay comparison returned:

```text
jsonMatches: true
markdownMatches: true
pass: true
blocking: []
selectorCount: 24
contractFailures: []
curated: requested 12, passed 12, failed 0
```

Both committed report artifacts now state direct eligible-index selection and show zero failed
contract checks for every validated sampled request.

### Fresh advisor-capability and disposition record

This repair changes validator behavior, provenance semantics, selection behavior, tests, and bulk
acceptance logic, so a fresh consultation was warranted. The current Codex surface has a callable
reviewer subagent tool, matching the `codex-cli` advisor-capable provider entry. Because structural
read-only isolation is not verifiable, the effective posture was instruction-only read-only with
depth-one scope, no agent spawning, sole primary-thread writing, and immediate post-consultation
worktree verification. The advisor ran as **GPT-5 / OpenAI Codex runtime** and made no repository
changes.

The advisor initially identified four defects in the repair state. All were resolved before
closeout:

1. Bulk validation had stale check IDs and could report `PASS` despite failed contract counters;
   the check IDs and blocking gate were corrected, tests now assert zero failed counters, and the
   reports were regenerated.
2. Generated seed provenance did not replay the recorded selection; validation now recreates the
   seed key and ordinal, with a focused forged-seed test.
3. The progress report retained stale cyclic-scan, accepted-index, attempts, and old-vector text;
   the implementation section was corrected and this Repair 01 addendum is authoritative.
4. Curated provenance accepted blank durable identifiers; empty fixture IDs and authoring revisions
   now fail validation with a focused test.

### Final verification record

The final closeout commands completed after the repair and artifact regeneration:

```text
npm test
  8 test files passed; 113 tests passed

npm run build
  Vite production build passed

node scripts/dev/plan-status.js lint
  lint: OK (no violations)

git diff --check
  passed

node src/content/bulk-validation.js --sample-size 1000 --seed plan03-bulk-v1
  pass: true; JSON and Markdown artifacts regenerated
```

Artifact replay then returned `jsonMatches: true`, `markdownMatches: true`, `pass: true`,
`blocking: []`, `selectorCount: 24`, `contractFailures: []`, and curated validation of 12/12.
The independent 7,000-draw sweep returned direct-selection `min: 966`, `max: 1064`; the former
raw-index-plus-cyclic-scan replay returned `min: 12`, `max: 6202`.

Packet status remains `delivered`; no status mutation is authorized here. Commit only the explicit
Repair 01 paths, do not push, and stop for final orchestrator review.

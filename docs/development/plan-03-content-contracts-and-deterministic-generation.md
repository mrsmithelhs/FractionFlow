---
id: plan-03
title: Content Contracts and Deterministic Problem Generation
status: delivered
depends_on: [plan-02]
gate: "Owner approves the packet; mechanism-confirmation gate — the problem-instance schema and family/constraint definitions are approved before build; orchestrator verifies bulk validation and seed reproducibility against the objective."
summary: >-
  Define the formal problem-instance schema and problem-family contracts, and
  implement constraint-based, deterministic, seeded generation in `src/content/`
  for the Phase 1 initial families (like-denominator addition/subtraction,
  nested-denominator addition/subtraction, shared-factor and relatively-prime
  unlike denominators, reducible results, results crossing one whole). Every
  generated instance is fully classified before use, validated against its
  family's constraints, and reproducible from its seed; bulk generation is
  auditable for validity and distribution. Representation feasibility is
  recorded as data, not fixed thresholds.
---

# Plan 03: Content Contracts and Deterministic Problem Generation

## Packet Metadata

- Packet id: `plan-03`
- Packet title: Content Contracts and Deterministic Problem Generation
- Status: (see frontmatter)
- Owner/model: implementer (single)
- Date: 2026-09-18
- Packet type: schema / content
- Mutation level: source-data (new source under `src/content/` and schema/fixture data)
- Approval gate: owner approves packet; mechanism-confirmation gate on the instance schema and family definitions before implementation; orchestrator verifies against `docs/founding/06-roadmap.md` §15 (family classification reliable, bulk validation survives)
- Depends on: `plan-02` (the Mathematical Core API must exist)
- Expected artifacts: `src/content/` module(s), machine-readable problem-family definitions, curated golden-case content data, deterministic seed/RNG utility, bulk-validation tooling and reports, progress report

## Goal

Turn the Math and Content Model's contracts into executable structure: a formal problem-instance schema rich enough to reconstruct a problem's mathematical meaning (`docs/founding/03-math-and-content-model.md` §27), family definitions that are verifiable mathematical claims (`docs/founding/05-quality-and-validation.md` §9), and a deterministic generator that starts from intended instructional structure — never from arbitrary random fractions (`docs/founding/03-math-and-content-model.md` §49) — and that produces instances any consumer (instruction, rendering, validation) can trust without recomputing mathematics.

## Non-goals

- No renderers, scene models, or visual representation code.
- No Instructional Engine, episode logic, scaffold state, or learner progression (Roadmap Phases 2+).
- No fixed denominator ceilings, rendering thresholds, or representation eligibility numbers: exact thresholds are prototype outputs (deferred item D-06; `docs/founding/03-math-and-content-model.md` §68). This packet records feasibility-relevant facts as data only.
- No session composition, spacing, interleaving, or adaptive sequencing (Phase 7+).
- No negative results, multiplication, or division.
- No learner data of any kind; all generated and curated content is synthetic.

## Depends on

- `plan-02` complete: exact arithmetic, classification, and validation functions are available and trusted.

## Why this packet exists

Phase 1 requires an initial formal expression of problem instances, families, canonical and alternate valid pathways, denominator relationships, result classifications, representation feasibility, and deterministic generation (`docs/founding/06-roadmap.md` §12), exercised against the Phase 1 initial families (§13). Individual generated examples can look fine while the distribution is poor (`docs/founding/05-quality-and-validation.md` §10), and accidental complexity or trivial degeneracy destroys instructional intent silently (`docs/founding/03-math-and-content-model.md` §§50–51). Generation without an immediately downstream consumer is deliberate: content must be fully classified and bulk-validated before any episode exists (`docs/founding/04-system-architecture.md` §8), and Phase 1's exit gate requires that generated examples survive bulk validation.

## Authority and contracts

Required reading:

- `AGENTS.md`
- `docs/decision-log.md`
- `docs/development/README.md`
- `docs/founding/03-math-and-content-model.md` (especially §§27–68, 76–77, 84–85)
- `docs/founding/04-system-architecture.md` §§7–11 (generation layers, full classification, deterministic generation, seeds)
- `docs/founding/05-quality-and-validation.md` §§8–11 (generated content validation, family validation, bulk audit, distribution)
- `docs/founding/06-roadmap.md` §§12–15

Contracts this packet must preserve:

- The generator never invents mathematics: every derived fact comes from the `plan-02` core; the content layer classifies and constrains, never recalculates.
- Reproducibility: the same seed and family selection reproduce the same instance, classification, and canonical path (`docs/founding/04-system-architecture.md` §10); seeds select among eligible instances and never alter mathematical truth (§11).
- Validity, efficiency, and instructional preference remain distinct; the canonical instructional path is typically the LCD path but is never the only valid path (`docs/founding/03-math-and-content-model.md` §§54–57).
- Missing authored coverage is never represented as mathematical incorrectness (synthesis recommendation 20-08 boundary — this packet supplies the machine-readable facts later episode definitions will declare coverage over).
- Curated and generated content share the same contract (`docs/founding/04-system-architecture.md` §9): curated golden cases are data validated through the same pipeline, with no one-off logic.

## Scope

### In scope

- Formal problem-instance schema covering at minimum `docs/founding/03-math-and-content-model.md` §27's list: operation; operand values and forms; denominator relationship; exact result; simplified result; relevant equivalence transformations; common-denominator possibilities (least and alternate valid); regrouping requirements; result classification; applicable problem family; plus review metadata per §64 (scale factors, magnitude range, intended target concept, likely alternate valid paths) and a schema/version identifier (deferred item **D-12**, promoted here in narrow form: record a version identifier so replay across generator/content revisions remains possible later — no migration framework is built now).
- Machine-readable definitions of the Phase 1 initial families (`docs/founding/06-roadmap.md` §13): like-denominator addition, like-denominator subtraction, nested-denominator addition, nested-denominator subtraction, shared-factor unlike denominators, relatively-prime unlike denominators, reducible results, results crossing one whole — each defined by verifiable mathematical properties (`docs/founding/05-quality-and-validation.md` §9), with intentional subcategories per `docs/founding/03-math-and-content-model.md` §§29–36.
- Deterministic seeded selection: a small, inspectable RNG (dependency-free if practical) such that instance selection is reproducible, logged, and seed-independent of mathematical truth.
- Constraint-based generation enforcing `docs/founding/03-math-and-content-model.md` §§49–53: start from structure; reject accidental complexity; avoid trivial degeneracy; operands begin in simplest form unless simplification is the target; result simplification is an intentional, recorded property.
- Curated golden cases as content data (the `docs/founding/05-quality-and-validation.md` §49 set and the plan-02 fixtures, aligned), each validated through the same contract as generated instances.
- Bulk-validation tooling: generate large batches per family and verify family membership, exactness, excluded accidental complexities, and distribution visibility (`docs/founding/05-quality-and-validation.md` §§10–11), emitting a human-readable report artifact.

### Out of scope

Everything in Non-goals, plus: editing founding documents, deployment configuration, `src/math/` internals (consume, don't modify — propose an extension packet instead), and files outside `src/content/`, `tests/`, content fixtures, this packet's report folder, and — only when explicitly approved at the mechanism-confirmation gate — `package.json` and the lockfile.

## Implementation Requirements

### Requirement 1 — Instance schema and family contracts

Required behavior:

- The schema distinguishes numerical value, learner-established current form, and preferred final form, and records an accepted simplify-first transformation as a state change after which later denominator reasoning evaluates the new current form (`docs/founding/03-math-and-content-model.md` §9; synthesis 20-07).
- Each family definition is executable: membership is checkable by exact mathematical properties, and generation rejects instances that fail their family's declared profile.

Constraints:

- Schema and definitions are human-readable data reviewed in version control (`docs/founding/04-system-architecture.md` §57), not behavior buried in code.

### Requirement 2 — Deterministic, constraint-based generation

Required behavior:

- Given (family, seed, constraint profile), the generator deterministically produces a fully classified instance: every fact of `docs/founding/03-math-and-content-model.md` §85 that applies to the family is present before the instance is returned.
- Rejected candidates (accidental complexity, degeneracy, out-of-profile) are counted and auditable, not silently resampled without record.

Constraints:

- No nondeterminism beyond the explicit seed; no `Date.now`, no unseeded randomness.
- Numeric ranges and constraint profiles are parameters; this packet does not fix production ceilings (D-06 boundary) but must choose sensible development defaults and record them as defaults, not contracts.

### Requirement 3 — Bulk validation and distribution reporting

Required behavior:

- For each family, the tooling generates large batches (sizes reported, not assumed) and verifies: family membership, exact results, valid canonical transformations, absence of excluded accidental complexities, and absence of unintended degeneracy (`docs/founding/05-quality-and-validation.md` §§8–10).
- A distribution report makes variety visible: denominator relationships, scale factors, result forms, simplification status, and subcategory balance (`docs/founding/05-quality-and-validation.md` §11), with percentiles/min/max where counts are summarized — no bare "on average" claims.

Constraints:

- Bulk validation consumes only the `plan-02` core for mathematical truth.

## Validation Checklist

- [ ] Required output files or artifacts exist (`src/content/`, family definitions, curated case data, seed utility, bulk-validation tooling and at least one report artifact).
- [ ] Seed reproducibility demonstrated: identical (family, seed) inputs reproduce identical instances and classifications across separate process runs (show the command and output).
- [ ] Every family of `docs/founding/06-roadmap.md` §13 generates instances that pass membership validation; rejection counters are reported.
- [ ] Bulk-validation report exists with distribution visibility per `docs/founding/05-quality-and-validation.md` §11.
- [ ] Curated golden cases validate through the same contract as generated instances (no special-cased logic).
- [ ] All derived mathematical facts trace to `plan-02` calls (report the boundary; no recomputation).
- [ ] Progress report exists at `reports/development/plan-03-content-contracts-and-deterministic-generation/progress.md`.
- [ ] No unrelated files were changed.
- [ ] All contracts in "Authority and contracts" are preserved.
- [ ] Mechanism-confirmation gate honored: schema and family definitions were approved before build.
- [ ] Approval gate is honored.

## Stop Conditions

Stop and report to the orchestrator if:

- A dependency is missing or behaves unexpectedly (including a needed `plan-02` capability that does not exist — do not reimplement mathematics in the content layer).
- Implementing a family would require deciding a deferred prototype variable (e.g., a fixed denominator ceiling presented as a contract).
- Bulk validation reveals a family definition that cannot be satisfied as specified — report the conflicting properties instead of loosening them silently.
- The implementer discovers a schema ambiguity that two readings would resolve differently (record both; do not pick silently).

## Privacy, Accessibility, and Learner-Data Boundaries

- All content is synthetic; no learner data may enter schemas, fixtures, or reports. This preserves the public-repository PII boundary and the synthetic-fixture default of `docs/founding/05-quality-and-validation.md` §77.
- No direct accessibility obligations attach to data schemas; however, schema fields that later support accessibility semantics (e.g., linear-alternative descriptions of quantities) should be anticipated as extension points without being built now.

## Commit and Concurrency Guidance

- Commit discipline: stage explicit paths (including, only if gate-approved, `package.json`/lockfile); never `git add -A`; never push.
- Concurrency: mode A. `plan-04` depends on this packet's schemas; no downstream packet starts early.
- If `index.lock: File exists`, wait and retry; never delete the lock file.

## Implementer Authority Boundaries

Per `docs/development/packet-creation-guidance.md` and `docs/workflows/packet-tracking-system.md`:

- The implementer may not set packet completion status and may not edit orchestrator/owner disposition records; status verbs (`delivered`, `complete`, `superseded`, `parked`) belong to the orchestrator/owner.
- The implementer may not declare the packet, the feature, or the product complete, done, ready to ship, or equivalent. "Ready for orchestrator review: yes/no" in the progress report is a bounded handoff statement, not a status mutation or a shipping declaration.
- The implementer reports against the packet's objective — what was verified, how, and against which requirement. Passing tests and large counts are evidence, not proof; the report must map evidence to the objective so a reviewer can confirm each claim without re-running everything.

## Advisor Consultation

Advisor consultation is a thread-level obligation inherited from `AGENTS.md`. At packet start, the implementing thread must determine and record whether a consultation ran (with a disposition record), was not warranted (with a one-line reason), or a degraded mode applies (naming the mode), following the provider-capability and proportionality rules. This packet does not pre-classify that determination.

## Mechanism-Confirmation Gate (required before building)

This packet creates schemas and generative structure. Before building, the implementer must:

1. Propose the problem-instance schema (fields, types, value/current-form/preferred-form modeling, version identifier) with brief rationale.
2. Propose the family-definition format and the executable membership checks for each Phase 1 family.
3. Propose the constraint profiles and development defaults (explicitly labeled as defaults, not ceilings).
4. Propose the bulk-validation report shape.
5. State the tooling-capability basis: if bulk-validation or distribution tooling requires a narrowly justified development dependency, propose it with the justification weighed against `docs/founding/04-system-architecture.md` §60; if approved, `package.json` and the lockfile become approved write-scope paths for that addition only.
6. Wait for orchestrator/owner approval. Do not build until the gate clears.

## Progress Report

`reports/development/plan-03-content-contracts-and-deterministic-generation/progress.md`

Minimum contents: overall summary; mechanism-confirmation record; files changed; schema as approved and as built (and differences); family list with membership-check summaries; seed-reproducibility evidence; bulk-validation methodology, batch sizes, rejection counts, and distribution findings (with tails, not only means); curated-case validation evidence; commands run; problems encountered; remaining risks; advisor-consultation disposition (ran / not warranted / degraded mode); ready for orchestrator review yes/no.

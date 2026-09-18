---
id: plan-02
title: Exact-Arithmetic Mathematical Core
status: delivered
depends_on: [plan-01]
gate: "Owner approves the packet; mechanism-confirmation gate — the implementer's proposed module/API shape and invariant-test plan is approved before building; orchestrator verifies invariants and golden cases against the objective."
summary: >-
  Implement the deterministic, exact-arithmetic fraction engine in `src/math/`
  as a pure, DOM-free, dependency-free module: equivalence, comparison,
  gcd/lcm, valid common denominators, least common denominator, scale factors,
  conversion, addition, subtraction, simplification, mixed-number forms,
  composition and decomposition regrouping, result classification, benchmark
  magnitude facts, intermediate-step validation, and response-pattern
  classification. Prove it with property-based invariant tests across broad
  ranges, exact-equality tests hostile to floating point, deliberate edge
  cases, and durable golden cases with result diversity.
---

# Plan 02: Exact-Arithmetic Mathematical Core

## Packet Metadata

- Packet id: `plan-02`
- Packet title: Exact-Arithmetic Mathematical Core
- Status: (see frontmatter)
- Owner/model: implementer (single)
- Date: 2026-09-18
- Packet type: feature (foundational library)
- Mutation level: source-data (new source under `src/math/`) / generated-local (nothing published)
- Approval gate: owner approves packet; mechanism-confirmation gate on the proposed API/invariant plan before implementation; orchestrator verifies against the Phase 1 exit criteria in `docs/founding/06-roadmap.md` §15
- Depends on: `plan-01` (toolchain and headless test runner must exist)
- Expected artifacts: `src/math/` module(s), math test suite under `tests/`, durable golden-case fixtures, progress report

## Goal

Create mathematical state the learner experience can trust. The Mathematical Core is the authoritative source of exact fraction mathematics (`docs/founding/04-system-architecture.md` §5) and must be able to answer, for any supported problem, the full contract in `docs/founding/03-math-and-content-model.md` §85 — what quantities exist, in what forms, whether forms are equivalent, what denominators are valid and least, which operands require renaming, whether regrouping is required, what the exact result is, and what broad magnitude facts hold — before anything is displayed.

## Non-goals

- No problem generation, family definitions, or seeded selection (that is `plan-03`).
- No DOM, browser API, rendering, animation, or UI of any kind.
- No learner-facing prose, feedback text, or instructional logic; response-pattern classification here is mathematical pattern detection only, and must not claim anything about the learner's beliefs (`docs/founding/03-math-and-content-model.md` §63).
- No floating-point approximations as a source of truth; decimals may never decide equality, equivalence, validity, or correctness (`docs/founding/03-math-and-content-model.md` §2, `docs/founding/05-quality-and-validation.md` §5).
- No negative results, zero denominators, multiplication, or division of fractions (outside the founding domain, `docs/founding/03-math-and-content-model.md` §1).
- No silently simplified state: numerical value, current form, and preferred final form are distinct (`docs/founding/03-math-and-content-model.md` §9); an accepted simplify-first transformation changes the learner-established current form, and later validation runs against that current form — never a globally reduced value.
- No canonical-path absolutism: valid non-least common denominators and correct-but-unsimplified results must be representable and classifiable (`docs/founding/03-math-and-content-model.md` §§54–57).

## Depends on

- `plan-01` complete: package manifest, build, and headless test runner exist.

## Why this packet exists

Every layer above the core — content generation, instructional episodes, rendering — consumes mathematical facts rather than computing them (`docs/founding/04-system-architecture.md` §§5, 13). A mathematical error is a critical defect that no polish can compensate for (`docs/founding/05-quality-and-validation.md` §3), and Phase 1's exit gate requires trustworthy exact arithmetic, tested invariants, and reproducible canonical examples before any visual development (`docs/founding/06-roadmap.md` §15). Building this first, headlessly, keeps mathematical validation independent of presentation — and keeps the failure modes the founding documents worry about (false equivalence, wrong answers accepted, correct answers rejected) testable in pure Node.

## Authority and contracts

Required reading:

- `AGENTS.md`
- `docs/decision-log.md`
- `docs/development/README.md`
- `docs/founding/03-math-and-content-model.md` (the mathematical contract; especially §§2–26, 54–63, 85)
- `docs/founding/04-system-architecture.md` §§5–6, 13–14
- `docs/founding/05-quality-and-validation.md` §§3–7 (invariants, exact equality, edge cases, unsupported input)
- `docs/founding/06-roadmap.md` §§11, 14–15

Contracts this packet must preserve:

- The separation rule: mathematical truth flows outward; nothing in this module may read presentation or instructional state.
- Determinism: same inputs, same outputs, always; no `Math.random`, no wall clock, no environment dependence.
- Validity, efficiency, and instructional preference are separate classifications (`docs/founding/03-math-and-content-model.md` §26); the module must never collapse them into one "correct" bit.
- Regrouping classifications: `composition` (addition producing wholes) and `decomposition` (subtraction renaming a whole), with `regrouping` as the umbrella (`docs/founding/03-math-and-content-model.md` §22).

## Scope

### In scope

- `src/math/`: exact rational representation and normalization; comparison; equivalence (expansion and reduction); gcd/lcm; valid-common-denominator testing (including non-least); least common denominator; scale factors; equivalent-fraction conversion; addition and subtraction (nonnegative domain); simplification; mixed-number and improper-fraction conversion; composition and decomposition regrouping; proper/whole-valued/improper classification; result-form classification; exact benchmark comparisons (0, 1/2, 1, 2, nearby wholes).
- Intermediate-step validation functions per `docs/founding/03-math-and-content-model.md` §§58–61: proposed common denominator (mathematically invalid / valid, with least vs non-least classification), proposed equivalent fraction, proposed mixed-number form, proposed intermediate regrouped state — each validated by exact equality, each preserving the value/current-form/preferred-form distinction.
- Response-pattern classification per `docs/founding/03-math-and-content-model.md` §62 for the listed detectable patterns (e.g., numerators and denominators both added; denominator changed with numerator fixed; correct denominator with incorrect equivalent numerator; correct conversions with arithmetic error; correct unsimplified result; equivalent alternate form), returned as classifications only.
- Test suite under `tests/`: property-based/invariant tests across broad input ranges (invariants of `docs/founding/05-quality-and-validation.md` §4), exact-equality tests including repeating decimals (§5), deliberate edge cases (§6), clear rejection of unsupported input (§7), alternate valid paths (§14), and known incorrect patterns (§15).
- Durable golden-case fixtures per `docs/founding/05-quality-and-validation.md` §49, applying deferred recommendation **D-17** (promoted here): golden cases must vary result structures, carries/borrows, whole/fraction relationships, and path choices so that no single coincidental equality can let a wrong implementation pass; pair every golden case with property-based checks (§50).

### Out of scope

Everything in Non-goals, plus: editing founding documents, deployment configuration, and any file outside `src/math/`, `tests/`, this packet's report folder, and — only when explicitly approved at the mechanism-confirmation gate — `package.json` and the lockfile.

## Implementation Requirements

### Requirement 1 — Exact arithmetic and classification

Required behavior:

- All operations are exact over the supported nonnegative domain; `1/3` is never an approximation.
- Every classification named in Scope is computable from a problem's exact state: denominator relationship (same / nested / shared-factor non-nested / relatively prime), operands requiring renaming, regrouping requirement (none / composition / decomposition), result form (zero / proper / exactly one / whole > one / improper / mixed), simplification status (already simplest / reducible / whole-valued), and magnitude facts against benchmarks.

Constraints:

- Deterministic and pure: no I/O, no DOM, no globals, no generative AI anywhere in the math loop.

### Requirement 2 — Intermediate-step and alternate-path validation

Required behavior:

- A proposed common denominator is classified exactly as `docs/founding/03-math-and-content-model.md` §59 requires: mathematical validity decided by exact divisibility rules; least/non-least/valid classifications never redefine validity.
- Valid non-least denominators (e.g., 24 for 3 and 4) and correct-but-unsimplified results (e.g., 2/4 for 1/2) are representable and correctly classified as valid, following the canonical examples §§80–83.
- After an accepted simplify-first transformation, subsequent denominator and path validation runs against the recorded learner-established current form (`docs/founding/03-math-and-content-model.md` §9; synthesis recommendation 20-07).

Constraints:

- The module never marks mathematically valid equivalence as incorrect because it differs from a canonical path.

### Requirement 3 — Invariant and edge-case test coverage

Required behavior:

- Property-based tests enforce every invariant of `docs/founding/05-quality-and-validation.md` §4 across broad ranges, including: equivalence preservation, simplification preservation, addition/subtraction correctness, mixed-number equivalence, regrouping preservation (`w n/d = (w−1) (n+d)/d` for `w > 0`), common-denominator validity, and LCD minimality.
- Tests intentionally include awkward exact values such as 1/3, 2/7, 5/12, 7/15 so floating-point shortcuts cannot pass unnoticed.
- Edge cases are deliberate (§6): equal operands, subtraction to zero, sums of exactly one, whole results > one, reducible and already-simplest raw results, all four denominator relationships, composition, decomposition, and multiple valid common denominators.
- Unsupported input (negative results, zero denominators, out-of-domain structures) is rejected clearly at the boundary (§7), never silently passed downstream.

Constraints:

- Golden-case fixtures are synthetic, version-controlled data — never derived from real learner records (`docs/founding/05-quality-and-validation.md` §77).

## Validation Checklist

- [ ] Required output files or artifacts exist (`src/math/` module(s), `tests/`, golden-case fixtures).
- [ ] Full test suite passes headlessly via the toolchain from `plan-01`.
- [ ] Property-based invariants of `docs/founding/05-quality-and-validation.md` §4 hold across the stated input ranges (report ranges and run counts, not just "passed").
- [ ] Golden cases cover every family listed in `docs/founding/05-quality-and-validation.md` §104's mathematical items applicable to the core, with D-17 result diversity; no golden case can pass through a single coincidental equality (report how this was checked).
- [ ] Alternate valid paths (non-least denominators, unsimplified results, equivalent mixed/improper forms) validate correctly; incorrect patterns classify as specified.
- [ ] Progress report exists at `reports/development/plan-02-exact-arithmetic-mathematical-core/progress.md`.
- [ ] No unrelated files were changed.
- [ ] All contracts in "Authority and contracts" are preserved.
- [ ] Mechanism-confirmation gate honored: the implementer described the proposed module/API shape and invariant-test plan and waited for approval before building.
- [ ] Approval gate is honored.

## Stop Conditions

Stop and report to the orchestrator if:

- A dependency is missing or behaves unexpectedly (e.g., the test runner from `plan-01` is inadequate for property-based testing — say what is missing rather than silently switching harnesses).
- Implementing a required behavior would require changing a settled contract in the founding documents (e.g., supporting negative results or floating-point truth).
- An invariant fails in a way that changes this packet's scope.
- The implementer discovers an ambiguity in the mathematical contract that two readings would resolve differently (record both readings; do not pick silently).

## Privacy, Accessibility, and Learner-Data Boundaries

- This packet processes only synthetic, in-code values. No learner data exists or may be introduced; all fixtures are synthetic by construction.
- No accessibility obligations attach to a headless module; accessibility semantics become relevant only when scene/render layers consume these facts later.

## Commit and Concurrency Guidance

- Commit discipline: stage explicit paths (`src/math/…`, `tests/…`, fixtures, report, and — only if gate-approved — `package.json`/lockfile); never `git add -A`; never push.
- Concurrency: mode A. `plan-03` depends on this packet's API and must not start until this packet is complete.
- If `index.lock: File exists`, wait and retry; never delete the lock file.

## Implementer Authority Boundaries

Per `docs/development/packet-creation-guidance.md` and `docs/workflows/packet-tracking-system.md`:

- The implementer may not set packet completion status and may not edit orchestrator/owner disposition records; status verbs (`delivered`, `complete`, `superseded`, `parked`) belong to the orchestrator/owner.
- The implementer may not declare the packet, the feature, or the product complete, done, ready to ship, or equivalent. "Ready for orchestrator review: yes/no" in the progress report is a bounded handoff statement, not a status mutation or a shipping declaration.
- The implementer reports against the packet's objective — what was verified, how, and against which requirement. Passing tests and large counts are evidence, not proof; the report must map evidence to the objective so a reviewer can confirm each claim without re-running everything.

## Advisor Consultation

Advisor consultation is a thread-level obligation inherited from `AGENTS.md`. At packet start, the implementing thread must determine and record whether a consultation ran (with a disposition record), was not warranted (with a one-line reason), or a degraded mode applies (naming the mode), following the provider-capability and proportionality rules. This packet does not pre-classify that determination.

## Mechanism-Confirmation Gate (required before building)

This packet creates a new module and a test harness — structural/generative work. Before writing the module, the implementer must:

1. Propose the public API shape (types/structures for exact fractions, current form vs value vs preferred form, classification results, validation results) with brief rationale.
2. Propose the invariant-test plan (which properties, over what input ranges, with what generation strategy).
3. State the test-capability basis: either (a) propose a single narrowly justified development dependency the plan requires (e.g., a property-testing library), with the justification weighed against `docs/founding/04-system-architecture.md` §60, or (b) propose a dependency-free deterministic generation harness and define what qualifies it as property-style testing — generated cases, reproducible failure seeds, stated input ranges, run counts, and minimized counterexamples where applicable. If (a) is approved, `package.json` and the lockfile become approved write-scope paths for that addition only. `plan-01` must not be asked to install speculative test libraries in advance.
4. Propose the golden-case fixture format and the D-17 diversity check.
5. Wait for orchestrator/owner approval. Do not build until the gate clears.

## Internal Milestone Gate

Per the 2026-09-18 packet-wave review (finding F5), the owner kept this packet unified rather than split into 02a/02b; in exchange, implementation proceeds in two reviewable milestones:

1. **Milestone 1 — primitives and invariants:** exact rational representation and normalization, comparison/equivalence, gcd/lcm, conversion, addition/subtraction, simplification, mixed/improper conversion, exact benchmark comparisons, and their invariant tests. The implementer reports and pauses; the orchestrator reviews before milestone 2 proceeds.
2. **Milestone 2 — classification and step validation:** denominator/result/regrouping classifications, intermediate-step validation, response-pattern classification, and golden cases, built on the reviewed primitives.

This separation exists so a bad primitive and a bad classification contract cannot cross review as one indistinguishable diff.

## Progress Report

`reports/development/plan-02-exact-arithmetic-mathematical-core/progress.md`

Minimum contents: overall summary; mechanism-confirmation record (what was proposed, what was approved, what changed); files changed; API surface as built; invariants tested with input ranges and run counts; golden-case list and the D-17 diversity argument; alternate-path and incorrect-pattern validation results; commands run; validation checks performed; problems encountered; remaining risks; advisor-consultation disposition (ran / not warranted / degraded mode); ready for orchestrator review yes/no.

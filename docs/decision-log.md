# Decision Log

This file records decisions that should guide future work. New entries should include a date and rationale.

**Append-only.** Do not edit or remove entries. If a decision is superseded, add a new entry that references the old one.

This file is orchestrator/owner-owned. Implementers propose but do not edit.

## Accepted decisions

Use this shape for accepted decisions:

```markdown
### DECISION-001 - Short decision title

**Date:** YYYY-MM-DD

**Decision:** What was decided.

**Rationale:** Why this decision is the right tradeoff for now.

**Supersedes / related:** Optional links to older decisions, packets, or resolved open questions.
```

### DECISION-001 - Use GitHub Actions for static GitHub Pages deployment

**Date:** 2026-09-18

**Decision:** FractionFlow deploys its static site through the repository's GitHub Actions
workflow. The workflow installs locked dependencies, runs the headless test command, builds
`dist/`, and deploys that generated artifact to GitHub Pages. Build output remains ignored and
is not a source-branch artifact.

**Rationale:** This gives the project a reproducible build-and-deploy path without repository
secrets, a publishing branch, a backend, or any runtime third-party origin. It also keeps
generated output separate from the repository's durable source and specifications. The Plan 01
smoke page was locally built and publicly verified over HTTPS; that evidence proves deployment
plumbing only, not learner-facing readiness, pedagogy, or accessibility.

**Supersedes / related:** `docs/development/plan-01-tooling-deployment-spike.md`; public smoke
URL: `https://mrsmithelhs.github.io/FractionFlow/`.

### DECISION-002 - Plan 03 content-contract and bulk-audit semantics

**Date:** 2026-09-18

**Decision:** Plan 03 uses operation-specific structural selectors for like-denominator,
nested-denominator, shared-factor, and relatively-prime addition/subtraction. Reducible-result
and crosses-one-whole are orthogonal overlays, with every allowed selector/overlay combination
declared explicitly; under the initial proper-fraction profile, crosses-one-whole is addition-only.
Problem instances use a common exact-mathematical contract with a discriminated generated-versus-
curated provenance section, an explicit result state, and immutable source content. The initial
development profile remains replaceable, but bulk reporting must distinguish sampled draws from
unique mathematical instances and report finite candidate-space coverage whenever practical.

**Rationale:** This maintains the founding distinction between mathematical structure and
cross-cutting result properties, avoids inventing generator history for curated fixtures, and
prevents a large sampled batch from being misread as broad content variety when a deliberately
narrow default profile has a small eligible state space.

**Supersedes / related:** `docs/development/plan-03-content-contracts-and-deterministic-generation.md`;
`reports/development/plan-03-content-contracts-and-deterministic-generation/mechanism-review.md`.

## Proposed but not yet accepted

Use the same `**Date:** YYYY-MM-DD` field for proposals, using the proposal date.

*(Implementer proposals waiting for owner review go here.)*

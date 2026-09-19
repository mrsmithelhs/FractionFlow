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

### DECISION-003 - Presentation posture: accessibility and learner-facing register

**Date:** 2026-09-19

**Decision:** Accessibility increases access to the learning experience; it does not replace the
experience with an explanatory control panel. The default learner experience optimizes for
mathematical clarity, calm hierarchy, low cognitive load, and efficient mouse/touch interaction.
Motion-enabled presentation may be the default; reduced-motion must remain available, discoverable,
and meaning-preserving without needing to feel identical. Mouse and touch may be the most prominent
interaction path while keyboard and non-precision alternatives remain viable for every required
decision. Accessibility semantics do not imply a large visible textual interface and may use
progressive disclosure. Basic participation must not depend on a hidden or teacher-only mode. Full
posture: `docs/presentation-posture.md` Part 1.

Part 2 of that document further rules that specification vocabulary is never learner-facing
vocabulary, that the research apparatus is never visible to the learner, and that the product never
asks a learner to produce research artifacts. Internal records keep the analytic vocabulary; the
separation runs between what is recorded and what is displayed.

**Rationale:** The founding documents already define accessibility as a participation floor rather
than a mandate that every access mode be equally prominent (`05-quality-and-validation.md` §44),
and already require calmness as functional (`00-principles.md` §18), a stable instructional
hierarchy (`02-interaction-grammar.md` §71), and over-scaffolding review
(`05-quality-and-validation.md` §20). This records how those contracts apply as the project enters
presentation layers, so accessibility is not misapplied as license for cognitive overload or an
explanatory-text-first interface — and equally, so "calm" is not misapplied as license to degrade
the floor. Part 2 exists because `plan-04` introduced a research apparatus the founding documents
were never written against: §33 guards mathematical jargon and §16 guards psychological overclaim,
but neither covers the vocabulary of conditions, transfer, provenance, and outcome measures.

**Supersedes / related:** `docs/presentation-posture.md`;
`docs/founding/05-quality-and-validation.md` §§33, 44; `docs/founding/02-interaction-grammar.md`
§§71–72; open questions OQ-13, OQ-14, OQ-15.

### DECISION-004 - Reading-level target for learner-facing text

**Date:** 2026-09-19

**Decision:** Learner-facing interface text targets approximately a grade 2–3 reading level — two
or more grades below the upper-elementary audience — so that reading is never the barrier to the
mathematics. The mathematical terms the episode teaches are exempt and are introduced with meaning
rather than avoided. The target is enforced through working rules (one idea per string, a prompt of
about 12 words, active voice, no conditionals in a prompt that asks for a response, concrete words,
no culture-dependent idiom) and human review — **not** through a readability formula. Full rules:
`docs/presentation-posture.md` Part 2.

**Rationale:** `05-quality-and-validation.md` §33 requires review for reading burden and age
appropriateness but sets no target, so nothing could be checked against it. Formula-based gating
was rejected because Flesch–Kincaid and its relatives produce meaningless scores below roughly 100
words; gating on one would have been a proxy metric of exactly the kind this project's guardrails
warn about.

**Supersedes / related:** `docs/presentation-posture.md` Part 2; resolves the target half of OQ-10;
`D-19`.

### DECISION-005 - Efficacy research is a sidequest, not a primary concern

**Date:** 2026-09-19

**Decision:** High-quality instructional-efficacy research may be advanced someday but is not a
primary concern and is not a gate on shipping. The project's realistic evidence ladder is solo
review, then a handful of children with parental permission, then possibly a single classroom with
teacher approval — all small-n, none randomized, none controlled, none powered. Consequently the
`plan-04` prototype-variable register is retained as a **disqualification** instrument rather than
a **selection** instrument: it can rule a condition out, it cannot rule one in, and its conclusion
rule will correctly and permanently return "consistent with A and B" for the selection question.
Claims name their evidence tier and n; "evidence shows X is better" is not an available sentence.
Full posture: `docs/evidence-posture.md`.

**Rationale:** The register's discriminating experiments assume randomized or counterbalanced
comparison, which this project will not run. Leaving that mismatch unrecorded would have produced
either a permanently blocked decision, waiting on a study that was never coming, or an overclaim
built on a handful of observations. Naming the ladder makes both failure modes visible. This does
not lower the accessibility floor or the mathematical-correctness bar: small-n evidence is *strong*
at participation-floor failures — one child unable to complete a required decision is conclusive —
and mathematical truth is established deterministically in `src/math/`.

**Supersedes / related:** `docs/evidence-posture.md`;
`docs/development/phase-2-first-slice-design/prototype-variable-register.md`; reframes OQ-01;
partially answers OQ-05; amends OQ-07; `06-roadmap.md` §16.

### DECISION-006 - Design conditions must be swappable at runtime in the deployed build

**Date:** 2026-09-19

**Decision:** The Phase 2 build must allow the provisional design condition to be swapped at
runtime in the deployed static build, so alternatives can be exercised during ordinary browser
testing without a rebuild. Conditions are selected **upstream** as an episode configuration and
presentation mode feeding the normal `mathematical state → instructional state → presentation`
pipeline — never as a renderer-level toggle — and the active condition is recorded in the replay
and defect-report envelope. Available conditions are enumerated in one registry so that no
condition exists only as dead code. The switcher is **not** the learner preference surface and must
not be merged with it. The reaching mechanism and whether it ships publicly are open as OQ-16.

**Rationale:** DECISION-005 establishes that the provisional condition is in practice the shipped
condition, which makes the architectural claim that conditions are swappable load-bearing rather
than aspirational. A runtime switcher makes that claim continuously testable and is the cheapest
available defense against the OQ-01 inertia risk. Selecting upstream rather than at the renderer
keeps the separation rule intact: `D-05` prompt density and `CM-01` prompt form change instructional
state, not merely presentation, so a render-layer flag would have crossed a layer boundary.

**Supersedes / related:** OQ-01; OQ-16;
`docs/development/phase-2-first-slice-design/scene-model-position.md`;
`docs/founding/04-system-architecture.md` §§41–42.

## Proposed but not yet accepted

Use the same `**Date:** YYYY-MM-DD` field for proposals, using the proposal date.

*(Implementer proposals waiting for owner review go here.)*

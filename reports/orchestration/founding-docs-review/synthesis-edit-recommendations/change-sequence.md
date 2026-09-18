# Founding-Document Change Sequence

## Purpose

This is the implementation order for the actionable recommendations in:

- `reports/orchestration/founding-docs-review/synthesis-edit-recommendations/10-scope-accessibility-privacy.md`; and
- `reports/orchestration/founding-docs-review/synthesis-edit-recommendations/20-instruction-evidence-scaffolds.md`.

Apply the conflict resolutions in `reports/orchestration/founding-docs-review/synthesis-edit-recommendations/conflicts.md` as controlling instructions wherever a recommendation's paste-ready wording or conforming-edit list overlaps another recommendation.

## Implementation boundary

- Edit only `docs/founding/00-principles.md` through `docs/founding/06-roadmap.md`.
- Do not edit `docs/project-seed.md`, root `README.md`, any review/recommendation file, packet status, source code, tests, or configuration.
- Do not create a license file, choose a license, select a framework/tool, set a numeric denominator limit, set a session dose, move number-line work to a new phase, choose animation versus static presentation, choose morphing versus juxtaposition, move persistence earlier, or authorize a backend.
- Preserve each document's numbered-heading structure and existing local style.
- Prefer the exact proposed wording in the recommendation files. Adapt only enough to merge overlaps cleanly, remove duplication, correct cross-references, and implement `conflicts.md`.
- Do not claim that any accessibility, child-usability, deployment, instructional, or efficacy test has already run.

## Sequence

### 1. Establish the controlling authorization and governance boundaries

1. Apply **10-01** to `docs/founding/00-principles.md` §§20–21.
2. Apply 10-01's conforming static/future-service and persistence edits to `docs/founding/04-system-architecture.md` §§3, 57, 84, and 96 and to the relevant future-service/stretch passages in `docs/founding/06-roadmap.md`.
3. Apply **10-04** as a decision-boundary paragraph in `docs/founding/00-principles.md` §20. Do not select a license. Keep free access, privacy, and reuse permission distinct.
4. Apply **10-05** to `docs/founding/04-system-architecture.md` §60 and its small static-core/dependency-origin conforming statements. Treat third-party dependency licenses as provenance review, not as the still-undecided FractionFlow license.

Checkpoint: search the founding documents for `static-first`, `static-only`, `optional service`, `remote service`, `backend`, `cloud`, `account`, `telemetry`, `synchronization`, and `remote persistence`. Every future-service occurrence must be either clearly out of the founding scope or explicitly gated by an owner-approved charter change. The founding core must remain fully static, account-free, and usable without remote learner data.

### 2. Install canonical mathematical and state terminology

1. Apply **20-10** first:
   - replace the denominator list in `docs/founding/03-math-and-content-model.md` §11 with the canonical `valid common denominator`, `least common denominator`, and `instructionally preferred denominator` terms;
   - add the §26 cross-reference;
   - define `regrouping` as the umbrella process while preserving `composition` and `decomposition` classifications;
   - use `intermediate regrouped state` and `mixed-number form` consistently in the Math and Content Model and the specified Interaction Grammar passage.
2. Apply **20-07** to define local, explicit simplify-first behavior using the learner-established current form. Make its conforming edits without globally reducing all inputs or intermediates.
3. Apply **20-06** immediately after the §11 terminology as the mathematical-validity/instructional-support/representation-renderability contract. Add its architecture, interaction, and validation conforming edits.
4. Apply **20-08** to the canonical-path and authored-content passages. Add the coverage/fallback declaration to episode architecture and its interaction/validation checks. Enumerate reviewed behavior classes without choosing one universal fallback.
5. Apply **20-09** to `docs/founding/05-quality-and-validation.md` §§68–69 using 20-10's settled terminology. Replace the mistakenly prohibited true equality with the genuinely false example and distinguish a temporary visual transition from an exact intermediate mathematical state.

Conflict rules for this phase:

- Follow C-06 through C-09 in `conflicts.md`.
- `Instructionally preferred denominator` and `instructionally supported state` are different concepts.
- Mathematical validity comes from the Math and Content Model, never the renderer or authored coverage.
- An accepted simplify-first action changes the current form before later path/denominator validation.
- Missing authored coverage or renderer capability must never be reported as mathematical incorrectness.

Checkpoint: evaluate every edited equality exactly. Search for `pedagogically convenient`, `regrouped form`, `mixed-number form`, `simplify first`, `valid`, `supported`, `renderable`, `eligible`, `canonical`, `alternate`, and `fallback`. Confirm that obsolete terms are gone or deliberately retained only in historical/explanatory context.

### 3. Normalize support ownership and evidence language

1. Apply **20-04** to make `docs/founding/02-interaction-grammar.md` §§21–22 the canonical owner of support dimensions and the labels `high support`, `medium support`, `low support`, and `independent`. Apply its cross-document label/ownership edits.
2. Apply **20-02** to `docs/founding/01-instructional-model.md` §18 and its specified interaction, validation, and roadmap references. Define `supported construction`, `prediction`, and `independent transfer`; add plain-language response provenance.
3. In the mapping text produced by 20-04/20-02, state explicitly that an `independent` support configuration does not by itself establish `independent transfer`.
4. Apply **20-03** to make learner connection-making observable at bridges. Preserve prompt form, timing, frequency, density, and display choreography as prototype variables.
5. Apply **20-05** to narrow the anti-simultaneity slogan and make only the necessary conforming clarifications. Do not select side-by-side, sequential, animated, morphing, or static presentation.

Checkpoint: search all founding documents for `highly guided`, `partially guided`, `high support`, `medium support`, `low support`, `independent`, `supported construction`, `prediction`, `transfer`, `bridge`, `simultaneous`, and `side-by-side`. Confirm that support labels and evidence categories have distinct canonical owners and that bridge responsibility does not prescribe choreography.

### 4. Add the accessibility and child-evidence contracts

1. Apply **10-02** to `docs/founding/05-quality-and-validation.md`, using a capability-based `Accessibility Acceptance Floor` and separate mechanized, human-review, and child-usability evidence categories.
2. Apply 10-02's small conforming edits to `docs/founding/00-principles.md` and `docs/founding/06-roadmap.md`.
3. Apply **10-03** to `docs/founding/05-quality-and-validation.md` §53 and the durable-validation-assets passage. Add only the short principles/roadmap cross-references needed to keep the public-PII and evidence boundaries visible.
4. Reconcile these edits with 20-01 and 20-02 using C-02: child observation is bounded design evidence, not proof of efficacy or a substitute for mechanized/human accessibility checks. Mechanized checks and adult review likewise do not prove child usability.

Checkpoint: confirm the text does not assert WCAG conformance, universal accessibility, a completed support matrix, completed child testing, formal research approval, or a jurisdiction-specific legal rule. Confirm it forbids public names, contact details, identifiable recordings/screenshots, raw learner work, and similar learner artifacts; public/versioned fixtures should default to synthetic, reconstructed, or already-public material.

### 5. Reconcile the roadmap in chronological order

Perform this as one roadmap pass so Phase 2 and release gates remain concise.

1. Apply **10-07** first to define `prototype`, `useful limited product`, and `substantial core release` without adding an MVP milestone.
2. Apply **10-06**:
   - Phase 1 receives the static deployment-mechanism spike;
   - Phase 2 receives the public-URL end-to-end proof for the first complete slice;
   - later integration remains a deployment recheck/hardening step.
3. Apply **20-01** to Phase 2 and its exit gate: state the assumed learner/prerequisites and the exact limits on what the slice's evidence can establish.
4. Merge the Phase 2 conforming references from **10-02**, **10-03**, **20-02**, **20-03**, and **20-04**. Use short pointers to their canonical contracts rather than repeating full definitions.
5. Apply **10-08** to Phase 7, keeping dose, pause, stopping cues, and completion acknowledgement as prototype variables with no numeric threshold.
6. Apply **10-09** after 10-08: Phase 7 continuity is within one active session; Phase 8 is the first phase evaluating cross-visit durable local continuity.
7. Add the release-time licensing/asset-attribution decision check from **10-04**, without naming or creating a license.

Conflict rules for this phase:

- Follow C-03, C-10, and C-11 in `conflicts.md`.
- A deployed URL proves delivery, not pedagogy, accessibility, child usability, or substantial-core status.
- Phase 2 remains a narrow first-slice prototype for a stated learner starting point.
- Phase 7 pause/completion behavior does not imply durable resume state.
- Phase 8 persistence remains local, optional, clearable, account-free, and nonessential to first-visit use.

Checkpoint: read the roadmap from Phase 0 through the release definition, not only the edited paragraphs. Confirm stage names, evidence claims, deployment checks, session boundaries, and persistence timing are consistent.

### 6. Perform a final cross-document conformance sweep

Inspect all seven founding documents and make only the small conforming edits explicitly required by recommendations 10-01 through 10-09 and 20-01 through 20-10.

Required searches:

```text
static-first
static-only
optional service
remote service
backend
account
telemetry
pedagogically convenient
instructionally preferred
valid
supported
renderable
eligible
highly guided
partially guided
high support
medium support
low support
independent transfer
successful independent
bridge
simultaneous
side-by-side
temporary
intermediate regrouped
mixed-number form
learner artifact
fixture
prototype
useful limited product
substantial core release
MVP
persistence
continuity
```

For each hit, inspect meaning rather than performing a blind replacement.

## Validation and completion report

Before reporting completion:

1. Run `git diff --check`.
2. Review `git diff -- docs/founding/00-principles.md docs/founding/01-instructional-model.md docs/founding/02-interaction-grammar.md docs/founding/03-math-and-content-model.md docs/founding/04-system-architecture.md docs/founding/05-quality-and-validation.md docs/founding/06-roadmap.md`.
3. Confirm only those seven founding documents were modified by the implementation pass.
4. Confirm every recommendation ID `10-01` through `10-09` and `20-01` through `20-10` is either implemented or explicitly reported with an exact blocker. Do not silently omit a conforming edit.
5. Report any wording adapted because of `conflicts.md` and identify its target heading.
6. Report explicitly that no license was selected, no backend was authorized, no disputed prototype variable was settled, no packet status was changed, and no commit was made by the subagent.

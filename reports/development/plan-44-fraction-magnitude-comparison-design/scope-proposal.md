# Plan 44 Requirement 0 — Bounded Investigation Scope Proposal

**Date:** 2026-10-31  
**Packet:** Plan 44, Fraction Magnitude Comparison Task and First-Slice Design  
**State:** Submitted for orchestrator approval. No dossier expansion or source edits have begun.

## Proposed scope

Trace only the current, load-bearing seams needed to choose one concise proper-fraction comparison task and define its first source boundary:

- Pure exact fraction comparison, equality, benchmark, and common-denominator/conversion APIs.
- Content admission and fraction-bar capacity rules, including how authored source form and normalized identity are represented.
- Instruction/response ownership, fixed beat scheduling, scene projection, and replay versioning, following the shared response and progression patterns already adopted in Plans 42 and 43.
- Existing More/Less support configuration and relation-control/accessibility conventions relevant to keyboard, spoken labels, touch, and non-drag input.

I will not trace unrelated operations, generalize a strategy chooser, prototype visuals, or inspect broad routes/build behavior. I will record the inspected HEAD and exact current paths in the dossier after approval.

## Existing evidence to reuse

- `docs/development/phase-4-magnitude-comparison-notes.md` as the exploratory strategy/representation synthesis.
- `reports/orchestration/magnitude-comparison-review-claude.md` and `reports/orchestration/magnitude-comparison-review-codex.md` as skeptical checks on source claims, visual-answer sequencing, support assumptions, strategy validity, and research limits.
- Adopted task and representation precedents in Plan 29 and Plan 37; accepted response ownership and progression boundaries in Plans 42 and 43.
- Current Plan 39 artifacts only to establish existing number-line boundaries and compatibility context; pending Plan 39 rendered acceptance will not be described as accepted.

These artifacts are design and review evidence, not evidence of learner efficacy. Prior source/API inventories and replay labels are leads; current source inspection will verify any load-bearing claim before it is used.

## At most two candidate tasks

1. **Direct model-based relation:** compare two honest, same-scale proper-fraction amounts once, using a fully spoken first/second/same-amount response and deliberate Check. The model reading itself is the mathematical responsibility; a concise symbolic relation may be shown after acceptance.
2. **Symbolic relation with bounded common-unit construction:** for a small, prevalidated unlike-denominator batch, construct or select equivalent common-unit forms, then answer one relation question. This deliberately targets renaming plus comparison, with aligned honest bars available at resolution.

The investigation will recommend one or state that neither is source-feasible within existing boundaries. It will not carry both into implementation as alternative tracks. Same-denominator, same-numerator, benchmark-line, and compare-and-difference recipes remain later seams unless source evidence shows one must be included to make the recommendation coherent.

## Hypotheses and falsifiers

| Claim to examine | Kind | Evidence/check | Falsifier or stop signal |
|---|---|---|---|
| Existing pure math APIs can provide exact relation and any proposed common-unit witness without renderer arithmetic. | Source/API feasibility | Trace live math exports and run disposable deterministic examples through the existing API. | No suitable exact API or safe bounded composition exists; stop and report the missing seam rather than modify source. |
| A compact authored pair set can satisfy the selected recipe, relation balance, equality, swapped order, and heuristic counterexamples within current representation limits. | Mathematical eligibility | Derive all relations/conversions with existing APIs; inspect current content/bar capacity validators. | Required examples violate the proposed task's mathematical or capacity bounds, or depend on hand-authored truth. Narrow or reject the recipe. |
| One learner task can make a meaningful contribution without duplicating a judgment as both selection and symbol translation. | Pedagogical/design hypothesis | Compare the candidate task steps against the adopted task/response/progression precedents and identify what is supplied versus learner-produced. | The candidate requires a second equivalent judgment, empty acknowledgment, or answer-revealing pre-answer projection to work. |
| Direct honest models may support magnitude reading, while common-unit construction may make renaming the explicit responsibility. | Pedagogical hypothesis | Specify the intended work and representation timing for each candidate; use the skeptical reviews to challenge claims. | No source trace can prove comparative learner understanding or engagement; learner evidence would be needed to distinguish efficacy. |

Source feasibility and arithmetic eligibility are testable here. Learning, motivation, accessibility in actual assistive technology, and comparative instructional benefit are not proven by code inspection or exact arithmetic; they remain owner design judgments or future rendered/learner validation needs.

## Fixed research boundary and approval gate

After approval, inspect only the named source seams and packet artifacts above, then complete the requirements in the Plan 44 design dossier using those primary sources. Conduct no new broad literature review or learner study. A targeted external or repository research gap is in scope only if it could change the recommended task; investigate that single gap and stop. If a required source seam is absent or contradictory in a way that changes the recommendation, return the narrow blocker and a recommended disposition instead of expanding scope.

**Approval requested:** approve this bounded source/evidence scope before I write `comparison-design.md` or run the exact-example checks. Until then, work stops at this proposal.

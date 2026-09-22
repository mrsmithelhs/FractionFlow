# Phase 3 Generalization Design Dossier

## Review Status

- **Status:** Under owner review (proposals prepared under `plan-10`).
- **Baseline commit:** `199c104` (post-`plan-09` Repair 07).
- **Packet type:** Investigation / specification design dossier.
- **Mutation scope:** Docs-only under `docs/development/phase-3-generalization-design/`; zero application source (`src/`) changes; zero direct edits to `docs/decision-log.md` or `docs/open-questions.md`.
- **Governing gate:** Owner reviews and accepts the dossier. No Phase 3 problem-family implementation packet may be assigned until accepted.

---

## Purpose and Reach Question

Roadmap §26 states the defining mandate of Phase 3 plainly:

> *"The goal is not to invent new interfaces. The goal is to discover how far the existing interaction language can stretch."*

Prior to this dossier, that question had been asked only of the specification, never of the running code. Phase 2 proved that specification presence is not evidence of reachability: mechanisms existed in the codebase, passed unit tests, and had authored copy, yet were unreachable by any learner (`reports/orchestration/phase-2-unreachable-mechanisms.md`).

This dossier asks the reach question directly of the running code at commit `199c104`. It surveys all eight problem families of Roadmap §27 and all six focused concept episodes of Roadmap §28, holding every claim of reuse to a strict evidentiary standard:
1. **Demonstrated reuse** is claimed only where an executable current path exists today in the running application (configuration, starting surface, action sequence) matching the contract of `plan-14`'s route matrix.
2. **Plausible reuse** names the precise architectural or content gaps that currently prevent execution.
3. **Needs a representation the bar cannot give** carries a concrete, captured refusal witness from the running code—not a theoretical prediction of failure.
4. **Needs a new beat** names the structural mismatch between the problem's learning goal and the rigid seven-beat addition arc (`encounter → notice → decide → transform → operate → resolve → reflect`).

---

## What This Dossier Settles

1. **The Reach Boundary of the Vertical Slice:**
   Only one problem family—`relatively-prime-addition` with both operands requiring renaming—has demonstrated end-to-end reuse in the shipped application. Every other §27 family and §28 episode requires explicit state machine generalization, content authoring, new instructional beats, or representation repairs.

2. **The Honest Limits of the Phase 2 Arc:**
   The canonical narrative arc `encounter → notice → decide → transform → operate → resolve` was engineered specifically for addition where both operands are renamed. It does not stretch gracefully to:
   - Subtraction (where the operation removes or compares rather than combines, and current prompts hardcode addition);
   - Nested denominators (where only one operand renames, but the state machine enforces sequential two-sided transformation);
   - Like denominators (where renaming is zero, making decide/transform redundant);
   - Simplification (where the current resolve beat merely reports the reduced form passively without learner agency).

3. **The Architectural Resolution of OQ-20:**
   Proposes a concrete visual and layout model for results crossing one whole ($> 1$), directly reconciling Roadmap §17's mandate for "one stable whole" with the reality of improper fraction quantities, responsive 360px viewport budgets, and the owner's intent to offer "adding with a sum above one" as a first-class practice type on the entry page.

4. **The Boundary on Mixed Numbers:**
   Formulates an explicit position recommending that mixed numbers remain excluded from Phase 3 operations, reserving full mixed-number addition, subtraction, composition, and decomposition for Roadmap Phase 5 (§§38–44) while treating improper fraction results in Phase 3 with multi-whole visual grounding.

5. **A Phased, Dependency-Ordered Sequencing Proposal:**
   Structures Phase 3 implementation into bounded, testable implementation packets designed to avoid repeating the monolithic delivery risks and repair cycles of Phase 2.

---

## What This Dossier Explicitly Leaves Open

1. **Acceptance of Proposals:**
   All representations, classifications, and sequencing orders are proposals for owner review and orchestrator gating. None constitute settled decisions until formally accepted and recorded in `docs/decision-log.md`.

2. **Visual Styling and Animation Curves:**
   The exact CSS transition timings, border treatments, and badge positioning for multi-whole stacked bars are left to implementation discovery on rendered screens, governed by DECISION-021 aesthetic criteria.

3. **Subtraction Visual Paradigm:**
   The exact representation for fraction-bar subtraction (visual segment removal/takeaway versus visual comparison/difference brackets) is flagged as an empirical design question that cannot be settled without building and observing both options.

4. **Learner Progression and Adaptive Rules:**
   Which practice sets a learner receives, how scaffolds fade dynamically across problems, and how learners advance remain out of scope for Phase 3 design, awaiting Phase 6 (`plan-13` builds the mechanism, not the adaptive policy).

---

## Dossier Map

| Document | Purpose |
|---|---|
| [`grammar-reach-assessment.md`](grammar-reach-assessment.md) | The core reach assessment. Comprehensive survey of all 8 §27 families and all 6 §28 focused episodes with exact code citations, executable paths for demonstrated reuse, missing prerequisites for plausible reuse, and captured refusal witnesses for representation limits. |
| [`crossing-one-whole.md`](crossing-one-whole.md) | Resolution proposal for **OQ-20**. Compares candidate representations for results $> 1$, evaluates impact on Roadmap §17 ("one stable whole"), delivers concrete 360px layout budget calculations, and outlines multi-whole bar architecture. |
| [`mixed-numbers-position.md`](mixed-numbers-position.md) | Formal recommendation regarding mixed numbers in Phase 3 versus Phase 5, analyzing renderer, symbolic row, and cognitive load consequences. |
| [`sequencing-proposal.md`](sequencing-proposal.md) | Implementation roadmap breaking Phase 3 into bite-sized, independently testable packets with explicit gates, dependency rationale, and risk mitigation based on Phase 2 lessons. |

---

## Governing References

- `AGENTS.md`
- `docs/founding/00-principles.md` §§18, 27
- `docs/founding/01-instructional-model.md` §§16–19, 25–28
- `docs/founding/02-interaction-grammar.md` §§1–10, 16–20
- `docs/founding/03-math-and-content-model.md` §§27, 35, 49, 54–61, 80–83
- `docs/founding/04-system-architecture.md` §§12–22, 36–48
- `docs/founding/05-quality-and-validation.md` §§9, 17–22, 44, 52
- `docs/founding/06-roadmap.md` §§16–29, 38–44
- `docs/decision-log.md` DECISION-001, 006, 011, 012, 013, 014, 016, 017, 019, 021, 023, 025, 026, 029, 030
- `docs/open-questions.md` OQ-17, OQ-19, OQ-20, OQ-21, OQ-22, OQ-23
- `reports/orchestration/phase-2-unreachable-mechanisms.md`
- `docs/development/plan-14-reachable-behavior-route-contract.md`

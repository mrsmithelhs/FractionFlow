# Evidence Posture

Owner guidance on what "testing" and "evidence" mean in this project, and what the project may
therefore claim.

**Status:** owner guidance, recorded 2026-09-19. Subordinate to the founding documents; it changes
none of them. It constrains how `docs/founding/05-quality-and-validation.md` and the `plan-04`
prototype-variable register are applied in practice.

## Efficacy research is a sidequest

High-quality research into instructional efficacy is something this project **may** advance
someday. It is not a primary concern, not a gate on shipping, and not the reason the project
exists. FractionFlow is a learning environment first. If it ever becomes a research platform, that
will be a deliberate later decision with its own scope, permissions, and design.

Nothing in this document lowers the quality bar. It lowers the *claim* bar to match what the
project can actually observe.

## What testing realistically looks like here

The project's realistic evidence ladder, in ascending order of cost and permission:

1. **Solo review.** The owner works through the experience directly.
2. **A handful of children known to the owner**, with parental permission, informally observed.
3. **Possibly a single classroom**, with that teacher's approval.

Every tier is small-n. None is randomized. None is controlled. None is statistically powered. No
tier can be assumed to happen on any schedule, and the project is not an edtech company with
access to a large population for A/B testing.

## What this evidence can and cannot support

**It is genuinely good at** — and these are not consolation prizes, they are most of what matters
for a first slice:

- defect detection: a child cannot find the control, cannot read the prompt, cannot complete a
  required decision;
- disqualification: a condition produces guessing, confusion, or abandonment;
- comprehensibility, agency, and error-recovery failures;
- participation-floor failures — keyboard, non-drag, reduced-motion, and semantic-path breakage;
  small-n observation finds these *well*, because one child locked out is the whole finding; and
- wording, affordance, pacing, and motor difficulties, which
  `05-quality-and-validation.md` §947 already names as the thing child evidence uniquely reveals.

**It cannot support**, at any tier on this ladder:

- that one approach beats another;
- effect sizes, or any quantitative comparison between conditions;
- transfer, durability, or retention claims;
- generalization beyond the children actually observed; or
- anything requiring randomization, a control group, or statistical power.

## Consequence for the `plan-04` prototype-variable register

This is the part that requires a change in how the register is read.

The register's discriminating experiments are written as randomized or counterbalanced comparisons
— "randomize matched learners or counterbalance within a bounded synthetic episode set," compared
across prediction, equivalence reasoning, and transfer. **That design will not run on this
project's evidence ladder.** With a handful of children and no control, `D-01`, `D-02`, `D-05`, and
`CM-01` cannot be settled by comparison.

The register is therefore retained, but its role changes:

- **It is a disqualification instrument, not a selection instrument.** It can rule a condition
  *out* — this one confused the children who tried it, this one broke the keyboard path, this one
  produced guessing instead of prediction. It cannot rule a condition *in*.
- **Its conclusion rule will correctly and permanently return "consistent with A and B"** for the
  selection question. That is the honest result, not a failure of execution, and it should not be
  treated as a gap to be closed by running a bigger study the project will not run.
- **The held-constant contracts and outcome definitions stay valuable.** They are what keeps a
  small-n observation from being read as more than it is, and they remain the right structure if
  the sidequest is ever advanced.

**Consequence for OQ-01 (the provisional build condition).** If the register cannot select a
winner, the provisional condition is not a placeholder awaiting evidence — it is, in practice, the
shipped condition indefinitely. It must therefore be chosen on **design grounds**: the founding
principles, craft judgment, and owner/teacher review. It must still be labeled not-decided and must
remain swappable, because disqualifying evidence can still arrive and force a change. What must not
happen is deferring the choice as though a study were coming.

**Consequence for OQ-05 (will a child ever be observed).** Partially answered: yes, informally, at
small n, with permission, on no fixed schedule. What remains open is whether any child observation
is a *precondition* of Phase 2 acceptance, or whether Phase 2 may be accepted on solo review plus
mechanized and human checks.

## How to write claims

Acceptable:

> We chose this transition because it follows the founding principle of preserving a stable whole,
> and small-group review found no disqualifying comprehension or access problems.

Not acceptable:

> Evidence shows this transition is more effective for transfer.

Every claim names its evidence tier and its n. A report that says "tested with children" without
saying how many, under what permission, and observing what, is not reporting — it is implying a
study that did not happen.

## What this does not relax

The `05-quality-and-validation.md` §44 accessibility participation floor is unaffected. It is a
design and review obligation, not a research finding, and it is met through mechanized checks and
human review regardless of whether child observation occurs. Small-n evidence is *strong* here, not
weak: a single child who cannot complete a required decision is conclusive.

Mathematical correctness is likewise unaffected. It is established deterministically in
`src/math/` and by golden cases, and owes nothing to learner observation.

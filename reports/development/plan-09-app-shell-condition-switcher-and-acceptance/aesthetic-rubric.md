# Plan 09 — DECISION-021 Aesthetic Coherence Rubric

- **Date:** 2026-09-21
- **Applied against:** rendered screens at https://mrsmithelhs.github.io/FractionFlow/, revision
  `b418e8a`, at 360×752 and 1080p
- **Prepared by:** orchestration, for owner confirmation or override.

DECISION-021: **any single violation is a blocking failure at the Phase 2 acceptance gate.** Four
criteria, applied one at a time, against screens as rendered rather than against the code.

---

## Criterion 1 — Restraint against dashboard accumulation

> No competing metrics, secondary counters, progress meters, or persistent chrome may clutter the
> scene or compete with the fraction bar and current question.

**Orchestrator finding: passes.**

What is persistently on screen: the bars, the symbolic row, the current question and its control, a
collapsed "Show previous steps (n completed)" disclosure, the milestone line, and a footer holding
"Need help?", "Replay the last change", and the app name.

- No score, no timer, no streak, no progress meter, no accuracy counter.
- Completed steps are collapsed behind a disclosure rather than accumulating on screen.
- The app title moved to the footer during work (`plan-09` Repair 01), so the top of the viewport
  belongs to the mathematics.
- The gear menu is reviewer-only and closed by default.

The one countable thing on screen is "(6 completed)" inside the collapsed disclosure label. It counts
steps taken, not performance, and it is not a metric competing for attention.

**Owner:** pass / fail — _______________

---

## Criterion 2 — Language and register clarity

> All learner-facing strings must pass DECISION-004 working rules (grade 2–3 reading level, ~12 words
> per prompt, active voice, concrete words, zero specification or research terminology).

**Orchestrator finding: passes, with two things to look at.**

Audited all 70 fixed strings in `src/render/strings.js`.

**Zero specification or research terminology reaches the learner.** No "condition", "presentation
mode", "scaffold", "support level", "invariant", "instrumentation", or bundle codes appear in any
learner-facing string. Specification codes live in internal data attributes, as Requirement 2 demands.
This is the part of the criterion most easily failed and it is cleanly met.

**Five strings exceed 12 words, all at `reflect`, all feedback rather than prompts:**

| words | string |
|---|---|
| 16 | "That is the same amount! The parts changed size, but the shaded amount stayed the same." |
| 13 | "This bar has a different shaded amount. Look closely at the shaded length." |
| 13 | "Look closely: the shaded length became longer. It is not the same amount." |
| 13 | "Look closely: the shaded length is the same. It is the same amount." |
| 13 | "Correct! The parts are smaller, but the total shaded amount is the same." |

DECISION-004's ~12 words applies to prompts; every prompt is inside it. These are explanatory
feedback, where a second clause is doing real work. I read this as within the rule, but `reflect` is
the wordiest surface in the app and it is the one to watch.

**Two register items for your eye:**

1. *"Good eye! The amount changed, so these fractions are not equivalent."* — "equivalent" is the only
   word in the learner copy that sits above a grade 2–3 register. Everything else uses "the same
   amount". This is a deliberate vocabulary introduction or an inconsistency, and which one it is is
   your call.
2. *"Before: 2/3 (replaying)"* — the parenthetical status word is a software convention rather than
   child language. It is the reduced-motion acknowledgement added in Repair 07 and it does real work;
   it could read more plainly.

"denominator" and "numerator" appear and are correct — they are the mathematics being taught, not
jargon about the software.

**Owner:** pass / fail — _______________

---

## Criterion 3 — Child-appropriate touch targets and spacing

> Interactive controls must comply with WCAG 2.2 SC 2.5.8 (>= 24x24px) with generous visual margins to
> prevent accidental touches.

**Orchestrator finding: passes. Measured, not asserted.**

Every visible interactive control measured at **360×752 on the deployed site**, walking the full
episode from encounter through reflect, including during a replay:

```
controls measured:  24
below 24 x 24:       0
smallest:           "Show new parts" replay toggle, 107 x 28
```

DECISION-025 decoupled target size from denominator, so the twenty-fourths route — where segments are
visually tightest — does not shrink any control. That was the specific failure mode DECISION-025 was
written to prevent, and it holds.

**Owner:** pass / fail — _______________

---

## Criterion 4 — Calm pacing and anchored inspection

> Visual transitions must be learner-triggered, calm, and spatially anchored in the stable whole, with
> endpoints remaining inspectable indefinitely without auto-advancing.

**Orchestrator finding: passes.**

- **Nothing advances on a timer, in any motion mode.** This was enforced at the Repair 06 gate: a
  proposed 2-second inspection pause before returning to the new parts was removed and replaced with
  a learner-operated "Show new parts" toggle in every condition. The only `setTimeout` calls in the
  render layer are `0ms` focus deferrals.
- **Every transition is learner-triggered** — submission, "Continue", "Replay the last change",
  "Show new parts", "Done looking".
- **Endpoints are inspectable indefinitely.** A replay ends when the learner ends it.
- **Spatially anchored** — every bar is drawn against the same stable whole at the same width; the
  renaming subdivides within that whole rather than redrawing it.
- Under reduced motion the one animation (a 1.5s replay pulse) is suppressed, and the acknowledgement
  falls back to static highlighting plus a text change, so no meaning depends on motion.

**Owner:** pass / fail — _______________

---

## Two screens to look at with a child's eye

Neither is a rubric violation and neither is a defect. Both are comprehension risks that only a child
can settle, and nobody has watched one try.

1. **At `reflect`, the symbolic row shows `8/12 + 3/12 = 11/12` while the premise asks about `7/12`.**
   The framing line "Check this renaming:" and the explicit bar labels carry it, and auditing a
   proposed renaming is the intended reading — but a real child either gets this instantly or finds it
   baffling.
2. **At `reflect`, a replay shows the right operand's conversion (`1/4 = 3/12`) while the premise check
   asks about the left (`2/3` versus `7/12`).** Two different comparisons on one screen.

---

## Result

| criterion | orchestrator | owner |
|---|---|---|
| 1 — Restraint against dashboard accumulation | pass | ______ |
| 2 — Language and register clarity | pass | ______ |
| 3 — Child-appropriate touch targets and spacing | pass (0 of 24 below floor) | ______ |
| 4 — Calm pacing and anchored inspection | pass | ______ |

**Orchestrator: no blocking violation found.** The rubric is the owner's to apply; this is the
evidence for it, not the verdict.

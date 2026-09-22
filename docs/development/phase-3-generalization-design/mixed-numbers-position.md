# Mixed Numbers Position: Phase 3 Scope Recommendation

## Review Status

- **Status:** Recommendation with reasoning for owner disposition (`plan-10`).
- **Roadmap Anchor:** Roadmap §24 ("Phase 2 Explicit Non-Goals"), Roadmap §§38–44 ("Phase 5 — Mixed Numbers and Whole Boundaries").
- **Governing Guardrail:** Design artifacts are proposals, not settled decisions; this recommendation requires owner review before adoption.

---

## 1. The Question

Roadmap §24 established mixed numbers and mixed-number regrouping as explicit non-goals for Phase 2. Roadmap §§38–44 outlines an entire dedicated phase—**Phase 5: Mixed Numbers and Whole Boundaries**—covering mixed-number foundations (§39), mixed addition without composition (§40), composition (§41), mixed subtraction without decomposition (§42), and decomposition (§43).

However, Roadmap §27 includes **"results crossing one whole"** in Phase 3, and the owner intends to offer **"adding with a sum above one"** as an entry-page practice type.

When a proper-fraction addition problem results in an improper fraction greater than one (e.g., $\frac{7}{8} + \frac{3}{8} = \frac{10}{8}$ or $\frac{2}{3} + \frac{3}{4} = \frac{17}{12}$), do **mixed numbers enter Phase 3**? Specifically:
1. Must the learner enter the answer as a mixed number ($1\frac{2}{8}$ or $1\frac{1}{4}$)?
2. Must the symbolic row and fraction bar manipulate mixed numbers interactively?
3. Or do mixed numbers remain strictly out of scope until Phase 5, with Phase 3 operations concluding in improper fraction forms?

---

## 2. Technical and Architectural Requirements of Mixed Numbers

Admitting mixed numbers into Phase 3 as an interactive or operational type is not a minor copy tweak; it imposes substantial architectural requirements across all four application layers:

### A. Mathematical Core (`src/math/`)
- **Current State:** The math core is fully prepared. `src/math/mixed-number.js` contains complete exact arithmetic for `composeMixedNumber`, `decomposeMixedNumber`, and `classifyRegroupingRequirement`.
- **Readiness:** 100%.

### B. Content Model & Schema (`src/content/`)
- **Current State:** `src/content/schema.js` defines wire contracts for `kind: 'mixed-number'` ($\{ \text{whole}, \text{fraction}: \{ \text{numerator}, \text{denominator} \} \}$).
- **The Gap:** Problem generator profiles in `src/content/generator.js` generate operands and results typed strictly as `kind: 'fraction'`. Curated fixtures provide improper fraction raw results ($\frac{10}{8}$) but do not generate mixed-number answer expectations.

### C. Interaction Engine & Controls (`src/interaction/`, `src/render/controls.js`)
- **The Gap:** The current `operate` beat (`src/render/beat-container.js:425-448`) provides a single numeric input field (`createNumericInput`) asking:
  `"Total shaded parts out of ${den}:"`
  This control accepts a single integer (the combined numerator, e.g. `10`).
- **What Mixed Numbers Would Require:**
  - Either a compound multi-field input control (Whole number input + Numerator input + Denominator input), which introduces high keyboard/tab navigation complexity on mobile viewports;
  - Or an entirely new instructional beat: a **Regrouping / Composition Beat** where the learner explicitly extracts $1$ whole from $\frac{10}{8}$ to produce $1\frac{2}{8}$. This would add an eighth beat to an already dense sequence.

### D. Symbolic Notation Renderer (`src/render/symbolic.js`)
- **The Gap:** In `src/render/symbolic.js:14-42`, `createFractionElement` renders strictly `numerator / denominator`. It has no layout, CSS styling, or ARIA semantics for a whole number integer positioned adjacent to a fraction.
- **What Mixed Numbers Would Require:** A new `createMixedNumberElement(whole, numerator, denominator)` renderer with dedicated ARIA labeling (e.g. `"1 and 2 over 8"`).

### E. Visual Fraction Bar (`src/render/fraction-bar.js`)
- **The Gap:** The current bar renders segments within a single unit whole.
- **What Mixed Numbers Would Require:** Support for multi-whole rendering (as proposed in [`crossing-one-whole.md`](crossing-one-whole.md)).

---

## 3. Pedagogical Analysis: Cognitive Load and Target Concepts

FractionFlow's primary target audience is the **conceptually-repairing upper-elementary learner** (grades 4–6) who struggles with operational sense-making (DECISION-016).

In elementary mathematics pedagogy, introducing mixed-number regrouping simultaneously with unlike-denominator addition conflates two distinct conceptual hurdles:
1. **Concept A: Unit Equivalence & Addition** (finding common units and combining them: $7\text{ eighths} + 3\text{ eighths} = 10\text{ eighths}$).
2. **Concept B: Whole-Boundary Regrouping** (decomposing $10$ eighths into $\frac{8}{8} + \frac{2}{8} = 1\frac{2}{8}$).

Requiring a learner who has just successfully navigated common denominators and equivalence to also master mixed-number conversion before receiving credit for their answer creates an unnecessary failure point. A child who computes $\frac{10}{8}$ has executed the fraction addition correctly.

---

## 4. Stated Recommendation with Reasoning

### Recommendation:
**Mixed numbers should NOT enter Phase 3 as an operational requirement or interactive input type.**

1. **Phase 3 Operations Settle as Improper Fractions:**
   For all Phase 3 problem families—including results crossing one whole—the required mathematical answer remains the improper fraction (e.g. $\frac{10}{8}$ or simplified $\frac{5}{4}$). The learner proves their mastery of unit combination directly.

2. **Visual Grounding Prepares for Phase 5 Without Testing It:**
   The multi-whole stacked bar (Candidate 1 in [`crossing-one-whole.md`](crossing-one-whole.md)) displays the sum visually across two stable unit wholes ($8/8$ and $2/8$). This visually grounds the concept that the amount exceeds one whole without demanding symbolic conversion.

3. **Passive / Informational Exposure at the Resolve Beat:**
   At the `resolve` beat, the summary string in `src/render/strings.js` can display an informative, non-interactive connection:
   $$\text{"The answer is 10/8. That is 1 whole and 2/8."}$$
   This introduces mixed-number vocabulary in a calm, zero-stakes manner, establishing a bridge to Phase 5.

4. **Full Mixed Numbers Remain in Phase 5:**
   Mixed operands ($1\frac{1}{2} + 2\frac{3}{4}$), whole-number regrouping, borrowing across wholes, and mixed-number subtraction remain in Phase 5 (§§38–44), where they receive dedicated instructional beats, tailored representations, and appropriate scaffold fading.

---

## 5. Summary Matrix: Phase 3 vs. Phase 5

| Dimension | Phase 3 Scope (Recommended) | Phase 5 Scope (Roadmap §§38–44) |
|---|---|---|
| **Problem Operands** | Proper fractions ($\frac{a}{b} < 1$) | Mixed numbers ($A\frac{a}{b}$) and improper fractions |
| **Sum Magnitude** | May exceed $1$ (range $(0, 2]$) | Unbounded ($> 2$, whole numbers, mixed) |
| **Learner Input Form** | Improper fraction numerator (e.g. `10` out of `8`) | Mixed number (Whole + Numerator) or Regrouped form |
| **Fraction Bar Role** | Multi-whole stack showing discrete whole units | Multi-whole bars with interactive regrouping/decomposition |
| **Symbolic Row** | Standard fraction format ($10/8 = 5/4$) | Mixed number formatting ($1\frac{2}{8} = 1\frac{1}{4}$) |
| **Cognitive Focus** | Common units, equivalence, like-unit addition | Whole-boundary composition, decomposition, regrouping |

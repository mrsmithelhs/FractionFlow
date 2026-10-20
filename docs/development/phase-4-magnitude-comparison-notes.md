# Phase 4 Planning Notes — Fraction Magnitude Comparison (`<`, `=`, `>`)

- **Status:** Exploratory design and research framing (recorded 2026-10-19).
- **Scope Boundary:** This document records owner and orchestrator design notes, candidate representations, pedagogical strategy taxonomy, and open research questions for future Phase 4 packets. It does **not** authorize source changes during Phase 3 or alter the active `plan-40` -> `plan-39` sequence.

---

## 1. Core Concept & Product Fit

Fraction magnitude comparison—asking the learner to determine the relationship (`<`, `=`, or `>`) between two fractions such as $\frac{2}{3}$ and $\frac{3}{5}$, or $\frac{3}{5}$ and $\frac{5}{9}$—fits naturally into FractionFlow's Phase 4 representation and conceptual expansion:

1. **Motivates Common Units Before Arithmetic:** In addition and subtraction, learners are told they must rename unlike fractions before combining them. In comparison, a close pair makes the learner *want* a common unit (or benchmark) because raw symbols do not reveal which quantity is larger.
2. **Reuses Existing Math Core and Recipe Machinery:**
   - `src/math/fraction.js` and `src/math/classify.js` already provide exact comparison (`compareFractions`, `equalFractions`), benchmark proximity (`benchmarkFraction`, `classifyMagnitude`), and common-denominator conversion (`leastCommonDenominator`, `scaleFactorsForCommonDenominator`, `convertToDenominator`).
   - High- and medium-support common-denominator comparison reuses the established `decide` (choose common denominator) and `transform` (rename one or both fractions) beats, replacing `operate` with a `compare` (`<`, `=`, `>`) decision.
3. **Bridges Directly to Comparison Subtraction (`OQ-25` / `plan-15`):**
   - Determining which fraction is larger ($\frac{2}{3} > \frac{3}{5}$) is the exact conceptual prerequisite to **comparison/difference subtraction** (*"How much greater is $\frac{2}{3}$ than $\frac{3}{5}$?"* $\rightarrow \frac{10}{15} - \frac{9}{15} = \frac{1}{15}$).

---

## 2. Candidate Support Progression (`Low`, `Medium`, `High`)

| Support Level | Learner Flow | Visual / Representation Behavior |
|---|---|---|
| **Low Support** | Learner sees the two fractions symbolically (e.g., $\frac{3}{5}$ and $\frac{5}{9}$) and selects `<`, `=`, or `>` via a 3-way control between the operands (`3/5 [ < \| = \| > ] 5/9` + `Check`). | No pre-comparison visual giveaway. At `resolve`, aligned bars or a `[0, 1]` number line appear to verify *why* the relationship holds (e.g., $\frac{27}{45} > \frac{25}{45}$ or benchmark distance above $\frac{1}{2}$). |
| **Medium Support** | **Single-Anchor Representation + Common Unit:** Learner sees a visual representation (bar or number line) for **one** of the two fractions, chooses a common denominator, observes the transition to the new unit, and then selects `<`, `=`, or `>`. | Showing only one fraction's bar/line initially prevents eyeballing the winner while still grounding unit size visually. |
| **High Support** | **Full Guided Conversion (`Decide -> Transform -> Compare`):** Learner selects a common denominator, determines the converted numerator for each original fraction, sees the converted representations, and selects `<`, `=`, or `>`. | Must avoid the **"visual giveaway"** before conversion (see §3 below) while snapping into clear aligned comparison once the learner has constructed the common units. |

---

## 3. The "Visual Giveaway" Problem & Candidate High-Support Representations

### The Problem
If two proportional `[0, 1]` fraction bars (or two points on the same `[0, 1]` number line) are stacked in vertical left-edge alignment from the very first beat, the learner can simply eyeball which shaded bar is longer (`60%` vs `55.6%`) without reasoning about fractional units.

### Rejected Option: Discrete Filled/Empty Circle Counts
- **Idea:** Show $\frac{5}{9}$ as $5$ filled + $4$ empty circles and $\frac{3}{5}$ as $3$ filled + $2$ empty circles of the same circle size.
- **Why rejected:** Violates the equal-whole invariant ($9$ circles vs $5$ circles are different-sized wholes if circle size is constant) and visually reinforces whole-number count bias ($5 > 3$, nudging the false conclusion that $\frac{5}{9} > \frac{3}{5}$).

### Candidate Options to Evaluate in Phase 4 Design / Research

1. **Option H1 — Opposite-Direction Bars (Left-to-Right vs. Right-to-Left, for proper fractions $< 1$):**
   - **Mechanic:** Both bars have the exact same `[0, 1]` whole width and truthful part widths, but the first fraction fills **left-to-right** and the second fills **right-to-left**.
   - **Strengths:** Preserves equal wholes and honest part sizes while removing the shared `0` vertical alignment line. Judging whether a left-anchored bar is longer than a right-anchored bar on close pairs (like $\frac{2}{3}$ vs $\frac{3}{5}$) is visually non-trivial until common units are established. (Not used on number lines, where right-to-left implies negative direction.)
   - **Risk / Open Question to Test:** Does shading a bar right-to-left cause learners to confuse the fraction with its complement to $1$ (e.g., reading the boundary at $1 - \frac{c}{d}$ from the left), or does explicit labeling/badge direction keep it clear?

2. **Option H2 — Staggered / Side-by-Side Left-to-Right Bars That Snap Into Vertical Alignment After Conversion:**
   - **Mechanic:** During `encounter`, `decide`, and `transform`, both bars fill in the normal **left-to-right** direction, but they are placed in **horizontally separated or diagonally staggered cards** (not stacked with aligned left edges). Once the learner converts both fractions to the common denominator $d$, the two bars slide/snap into vertical alignment for `compare` and `resolve`.
   - **Strengths:** Zero risk of complement/direction confusion (`0` is always the left edge of each bar), prevents vertical eye-drop giveaway prior to conversion, and rewards the learner's conversion work with a satisfying vertical alignment reveal.

3. **Option H3 — Partition-Grid Preview (Unshaded Second Bar Until Converted):**
   - **Mechanic:** Show the first fraction shaded and partitioned (`2/3`), and show the second `[0, 1]` bar partitioned into fifths (`_ / 5`) with its shading withheld or revealed as the learner renames both into fifteenths.

---

## 4. Connection Between Magnitude Comparison and Subtraction

Magnitude comparison and subtraction share deep mathematical structure:
- **Order-Difference Equivalence:** $a > b \iff a - b > 0$, $a = b \iff a - b = 0$, and $a < b \iff a - b < 0$.
- **Two Concrete Product Roles:**
  1. **Without Negative Numbers — Comparison / Difference Subtraction (`OQ-25` / `plan-15` follow-up):**
     - In elementary/middle-grade math, *"How much greater is fraction A than fraction B?"* is a two-stage reasoning task:
       - **Step 1 (Compare):** Determine which fraction is larger (e.g., $\frac{2}{3} > \frac{3}{5}$ because $\frac{10}{15} > \frac{9}{15}$).
       - **Step 2 (Difference):** Find the positive gap between them ($\frac{10}{15} - \frac{9}{15} = \frac{1}{15}$), shown visually as the comparison gap between the two aligned bars or the interval between the two points on a `[0, 1]` number line.
     - This requires **no negative numbers** and directly operationalizes the second subtraction meaning (`comparison/difference`) deferred by `plan-36` (`DECISION-045`).
  2. **With Signed Numbers (Future Extension Activity):**
     - Testing whether $a - b$ is positive, zero, or negative connects fraction comparison to rational-number ordering and algebraic inequalities as a stretch/extension activity.

---

## 5. Broader Pedagogical Taxonomy of Magnitude Comparison Strategies

Mathematics education research (Rational Number Project / Behr et al.; Cramer, Post, & delMas; Clarke & Roche, 2009; Siegler et al.'s Integrated Theory of Numerical Development; IES/WWC Practice Guide *Developing Effective Fractions Instruction*) identifies **five core strategies** learners use to compare fractions:

1. **Same-Denominator (Unit-Count) Comparison ($\frac{3}{8}$ vs. $\frac{5}{8}$):**
   - Same unit size $\rightarrow$ compare numerators directly.
2. **Same-Numerator (Unit-Size / Inverse-Denominator) Comparison ($\frac{3}{5}$ vs. $\frac{3}{7}$, or renamed common numerators):**
   - Same number of parts $\rightarrow$ larger denominator means smaller unit parts, so $\frac{3}{5} > \frac{3}{7}$. High pedagogical value because it directly confronts whole-number bias.
3. **Transitive Benchmark Comparison (to $\frac{1}{2}$ or $1$, e.g., $\frac{3}{8}$ vs. $\frac{5}{9}$, or $\frac{4}{5}$ vs. $\frac{5}{4}$):**
   - $\frac{3}{8} < \frac{1}{2}$ and $\frac{5}{9} > \frac{1}{2} \implies \frac{3}{8} < \frac{5}{9}$ without needing $\text{LCD}(8, 9) = 72$. Connects directly to the `[0, 1]` and `[0, 2]` number line.
4. **Residual / Distance-to-Benchmark Comparison ($\frac{4}{5}$ vs. $\frac{7}{8}$, or $\frac{3}{5}$ vs. $\frac{5}{9}$):**
   - Compare the "missing piece from $1$" ($\frac{1}{5}$ vs. $\frac{1}{8} \implies \frac{7}{8} > \frac{4}{5}$) or the "excess above $\frac{1}{2}$" ($\frac{3}{5} = \frac{1}{2} + \frac{1}{10}$ vs. $\frac{5}{9} = \frac{1}{2} + \frac{1}{18}$).
5. **Common-Denominator (Equivalent-Unit) Renaming ($\frac{2}{3}$ vs. $\frac{3}{5} \rightarrow \frac{10}{15}$ vs. $\frac{9}{15}$):**
   - The general exact algorithm when structural/benchmark shortcuts do not immediately settle a close pair, and the direct bridge to addition/subtraction.

---

## 6. What We Don't Know Yet & Proposed Phase 4 Packets

### Open Research & Design Questions to Investigate
1. **Strategy Selection vs. Single-Workflow Design:**
   - When should a comparison episode guide the learner through **common-denominator renaming** (on bars for $\text{LCD} \le 24\text{--}30$, or symbolically/number-line for larger denominators like $\frac{3}{5}$ vs $\frac{5}{9}$ with $\text{LCD} = 45$), versus **benchmark comparison around $\frac{1}{2}$ and $1$** on the number line, versus **same-numerator (unit-size) reasoning**?
2. **Perceptual & Cognitive Effects of Anti-Giveaway Representations:**
   - What does visual-cognition and math-ed literature say about comparing opposite-direction bars (left-to-right vs. right-to-left), staggered/non-aligned bars, single-anchor bars, and number-line benchmark estimation?
   - Does right-to-left shading induce complement-to-1 errors in children, or does it productively force unit-based reasoning?
3. **Interaction Mechanics for the `<`, `=`, `>` Control:**
   - What is the cleanest, lowest-friction control on a `360px` touch/keyboard screen (e.g., 3-button segmented choice `[ < | = | > ]` with explicit `Check` vs. slot/slider selector) that satisfies `44x44px` touch targets (`DECISION-010`) and screen-reader clarity?
4. **Recovery Design on a 3-Choice (`<`, `=`, `>`) Task:**
   - Because `<`, `=`, `>` has only 3 choices (and `=` is rare unless equivalent pairs are deliberately included), simple retry on a wrong guess would allow brute-force clicking. How should local recovery work on Low, Medium, and High support (e.g., routing a wrong Low-support guess into a quick benchmark or common-denominator step, or requiring equivalence recognition by including genuine `=` items like $\frac{4}{6}$ vs $\frac{6}{9}$)?
5. **Bridge to Comparison Subtraction (`|a - b|`):**
   - Should *"Which is greater?"* (`<`, `=`, `>`) be a standalone focused-concept goal first, followed by a combined *"Compare, then find how much greater"* (`comparison-subtraction`) recipe?

### Candidate Phase 4 Packet Sequence for Magnitude Comparison
1. **Packet A (Research & Design Investigation Packet):**
   - Literature and representation investigation covering fraction comparison strategies (common denominator, common numerator, benchmark $\frac{1}{2}$ / $1$, residual distance), perceptual trade-offs of anti-giveaway representations (right-to-left vs. staggered bars vs. single-anchor bar vs. number line), anti-brute-force recovery for `<`, `=`, `>`, and the bridge to comparison/difference subtraction.
2. **Packet B (First Magnitude Comparison Vertical Slice / Batch):**
   - Implement the owner-selected comparison recipe(s) across High, Medium, and Low support (including genuine `<`, `=`, and `>` outcomes so `=` is a live mathematical possibility).
3. **Packet C (Comparison-to-Difference Subtraction Bridge):**
   - Connect magnitude comparison (*"Which is larger?"*) to comparison subtraction (*"By how much?"*) using the aligned bar/line gap model from `plan-15`.

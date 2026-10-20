# Phase 4 Planning Notes — Fraction Magnitude Comparison (`<`, `=`, `>`)

- **Status:** Revised exploratory design and research framing (updated 2026-10-19 after independent Claude and Codex orchestrator reviews).
- **Review Records:**
  - [`reports/orchestration/magnitude-comparison-review-claude.md`](../../reports/orchestration/magnitude-comparison-review-claude.md)
  - [`reports/orchestration/magnitude-comparison-review-codex.md`](../../reports/orchestration/magnitude-comparison-review-codex.md)
- **Scope Boundary:** This document records the synthesized design position, strategy taxonomy, representation analysis, and open owner decisions for future Phase 4 packets. It does **not** authorize source changes during Phase 3 or alter the active `plan-40` -> Roadmap §31/§90 disposition -> `plan-39` sequence.

---

## 1. Founding Authorization & Two Distinct Instructional Goals

### 1.1 Founding Basis (Not a Scope Expansion)
Magnitude comparison is explicitly sanctioned by the founding specifications:
- [`docs/founding/03-math-and-content-model.md`](../founding/03-math-and-content-model.md) §43 (*Focused Magnitude Problems*) names *"compare two fractions"* and *"place a fraction relative to 0, 1/2, and 1"*.
- [`docs/founding/01-instructional-model.md`](../founding/01-instructional-model.md) §4 makes magnitude sense (*"whether it is larger or smaller than another fraction"*) a core conceptual strand, and §22.4 targets the misconception that a larger denominator implies a larger fraction.
- [`docs/founding/06-roadmap.md`](../founding/06-roadmap.md) §§28 and 33 include magnitude comparison and benchmark placement, and [`docs/development/phase-3-follow-up-obligations.md`](./phase-3-follow-up-obligations.md) tracks *"Magnitude prediction for crossing and non-crossing sums"* (which shares a three-way relational response contract: below / equal / above $1$).

### 1.2 Distinguishing Two Legitimate Instructional Goals
Both independent reviews highlighted that **visible magnitude is not inherently "cheating"**—whether a co-present visual model gives away the answer depends on the episode's learning goal:

1. **Goal A — Model-Based Magnitude & Unit-Size Reasoning:**
   - When the goal is understanding *why* unit size varies inversely with the denominator (e.g., $\frac{3}{5}$ vs. $\frac{3}{7}$) or reading relative position on a number line, seeing honest, equal-whole models (or constructing placements on a line) *is* the intended mathematical work.
2. **Goal B — Strategy-Driven / Exact Symbolic Comparison on Close Pairs:**
   - When the goal is transforming unlike fractions into a shared unit (e.g., $\frac{2}{3}$ vs. $\frac{3}{5} \rightarrow \frac{10}{15}$ vs. $\frac{9}{15}$) or reasoning from benchmarks before seeing the final aligned visual check, the design should control **when and by whom** the aligned representation is constructed (**sequencing**, not distorting bar geometry).

---

## 2. Codebase Reality & Architectural Scope Fact-Check

| Area | What Exists Today | What Must Be Built for Comparison |
|---|---|---|
| **Exact Math (`src/math/`)** | `compareFractions`, `equalFractions`, `benchmarkFraction` (`0, 1/2, 1, 2`), `compareToBenchmark`, `leastCommonDenominator`, `scaleFactorForDenominator`, `convertToDenominator` in [`src/math/fraction.js`](../../src/math/fraction.js); region classifier `classifyMagnitude` in [`src/math/classify.js`](../../src/math/classify.js); `compareMixedNumbers`, `equalMixedNumbers` in [`src/math/mixed-number.js`](../../src/math/mixed-number.js). (Note: `createFraction` and `subtractFractions` are strictly nonnegative.) | Pure helpers for common-numerator scaling, unit residual to $1$ ($1 - x$), excess over $\frac{1}{2}$ ($x - \frac{1}{2}$), and unordered positive difference $|a - b| = \max(a,b) - \min(a,b)$. |
| **Content & Eligibility (`src/content/`)** | `validateCommonDenominator` in [`src/content/validation.js`](../../src/content/validation.js) and `PHASE2_FRACTION_BAR_LIMITS` (`maxDenominator: '30'`, `maxScaleFactor: '12'`, `DECISION-011`) in [`src/content/eligibility.js`](../../src/content/eligibility.js). `family-definitions.js` currently admits only `add` and `subtract`. | Compact comparison record validator that derives relational truth (`<`, `=`, `>`), decisive/eligible strategies, and heuristic-trap flags (`biggerNumbers`, `gapThinking`) via `src/math/` without hand-authored answer keys. |
| **Instruction, Scene, & Replay (`src/interaction/`)** | `computeBeatSchedule` (`DECISION-034`), `decide`/`transform` mechanics, `sequential` and `juxtaposed` choreography modes, and replay `v1`–`v6`. | A `compare` operation/task family and relational response beat (`choose-relation` or two-step `choose-greater-quantity` + relation notation), comparison response classification, and a serialized replay schema version after `plan-39`. |
| **Support Levels (`src/app/support-levels.js`)** | Only **two** support levels are currently registered in the learner UI: `high-support` (*"More support"*) and `medium-support` (*"Less support"*). | Strategy, support level, and representation are independent dimensions. Initial comparison slices should target existing `high-support` and `medium-support`; making a `low-support` tier reachable requires its own explicit configuration and agency contract. |
| **Touch Targets & Access Parity (`src/render/`)** | WCAG 2.2 AA `24x24px` floor (`DECISION-010`, `DECISION-025`) and `44x44px` number-line target floor (`DECISION-046` / `plan-39`); `tests/leakage-invariants.test.js`. | Accessible relation control with full spoken phrases, two-step `Check` confirmation, and comparison leakage invariants. |

---

## 3. Representations & Solving the "Visual Giveaway" by Sequencing

### 3.1 Why Distorting Geometry (`H1` and `H2`) Was Demoted/Dropped
1. **Option H1 — Opposite-Direction Bars (Left-to-Right vs. Right-to-Left): Do Not Use as Default**
   - **Conflicts with `DECISION-046`:** The adopted bar-to-number-line bridge teaches learners that the right edge of a shaded bar represents distance from `0` on `[0, 1]`. Shading $\frac{3}{5}$ right-to-left places its boundary at $\frac{2}{5}$ from the left, creating a conflicting graphic convention whose errors cannot be separated from fraction misconceptions.
   - **No Accessible Linear-Path Equivalent:** A purely visual orientation trick cannot be represented symmetrically in the screen-reader/linear path (`05-quality-and-validation.md`), and it does not generalize to improper fractions or mixed numbers.
   - *Disposition:* Do not use H1 in standard learner episodes (retain at most as a bounded, optional perceptual experiment if ever desired on a standalone surface).
2. **Option H2 — Horizontally Staggered / Offset Bars: Demoted**
   - Placing two bars side-by-side horizontally on a `360px` viewport cuts each bar's track width in half, violating segment-density legibility (`DECISION-025`), while non-aligned bar lengths can still be eyeballed on many pairs (Cleveland & McGill, 1984). Required alignment animations also add motion complexity without proving unit reasoning.

### 3.2 Recommended Sequencing Patterns (Honest Wholes, Zero Geometry Distortion)
Instead of distorting bar geometry, control **when** both magnitudes appear together:

1. **Sequential / Template Construction on Bars (Refined H3 + Existing `sequential` Mode):**
   - During `transform-left` and `transform-right`, show each fraction's renaming one at a time (or show the first fraction's bar and keep the second fraction's bar as an unshaded partition template—explicitly labeled *"Second fraction: 5 equal parts; shading shown after renaming"* in both visual and linear paths so it never reads as zero).
   - Once the learner constructs the common-unit forms ($\frac{10}{15}$ and $\frac{9}{15}$), they answer the comparison question, and the **aligned bars (with the comparison gap highlighted)** appear at `resolve` as verification.
2. **Locate-Then-Compare on the `[0, 1]` Number Line (Post-`plan-39`):**
   - On a number line, order *is* position ($a < b \iff a$ is left of $b$). Nothing is given away beforehand because **no points are plotted until the learner locates them** using `plan-39`'s two-step select/confirm grammar.
3. **Predict-Then-Verify (Symbolic First, Model on Request or at `resolve`):**
   - The learner compares symbolically (with optional requested help to rename or check benchmarks), and the aligned bar or number-line model is shown at `resolve` to confirm *why*.

---

## 4. Strategy Taxonomy, Mathematical Corrections, and Strategy-Routed Recipes

### 4.1 Corrected Research Attribution & Strategy List
In the Rational Number Project tradition (Behr, Post, Lesh, Cramer et al.) and Grade 4 standards (`4.NF.A.2`), four structural ordering strategies complement general common-denominator renaming, while Clarke & Roche (2009) document benchmark/residual reasoning and **"gap thinking"**:

1. **Same-Denominator (Unit-Count) Comparison ($\frac{3}{8}$ vs. $\frac{5}{8}$):**
   - Equal unit size $\rightarrow$ compare numerators directly.
2. **Same-Positive-Numerator (Unit-Size / Inverse-Denominator) Comparison ($\frac{3}{5}$ vs. $\frac{3}{7}$, or renamed common numerators):**
   - Equal positive counts of parts $\rightarrow$ larger denominator means smaller individual parts, so $\frac{3}{5} > \frac{3}{7}$. Directly confronts whole-number bias (Obersteiner et al., 2013; Clarke & Roche, 2009).
   - **Important Mathematical Correction on $\frac{3}{5}$ vs. $\frac{5}{9}$:** Renaming $\frac{3}{5}$ and $\frac{5}{9}$ to a common numerator of $15$ yields $\frac{15}{25}$ vs. $\frac{15}{27}$. That requires **$25$ and $27$ bar partitions** per whole, *not* $15$ partitions! Common-numerator renaming is therefore a **symbolic / unit-size reasoning recipe** (*"15 twenty-fifths are larger than 15 twenty-sevenths because twenty-fifths are larger parts"*), not a low-partition bar shortcut.
3. **Transitive Separating-Benchmark Comparison (to $\frac{1}{2}$ or $1$, e.g., $\frac{3}{8}$ vs. $\frac{5}{9}$):**
   - $\frac{3}{8} < \frac{1}{2} < \frac{5}{9} \implies \frac{3}{8} < \frac{5}{9}$ without computing $\text{LCD}(8, 9) = 72$. Natural fit for the `[0, 1]` number line (Gunderson et al., 2019; IES Practice Guide Rec. 2).
4. **Residual-to-$1$ and Excess-Over-$\frac{1}{2}$ Comparison (Two Distinct Sub-Strategies):**
   - **Residual to $1$ ($\frac{4}{5}$ vs. $\frac{7}{8}$):** Compare missing unit pieces from $1$ whole ($\frac{1}{5} > \frac{1}{8} \implies \frac{4}{5} < \frac{7}{8}$; note the reversed inequality!).
   - **Excess over $\frac{1}{2}$ ($\frac{3}{5}$ vs. $\frac{5}{9}$):** Residuals to $1$ are $\frac{2}{5}$ and $\frac{4}{9}$ (not simpler), whereas excess over $\frac{1}{2}$ yields unit fractions: $\frac{3}{5} = \frac{1}{2} + \frac{1}{10}$ and $\frac{5}{9} = \frac{1}{2} + \frac{1}{18}$, so $\frac{1}{10} > \frac{1}{18} \implies \frac{3}{5} > \frac{5}{9}$.
5. **Common-Denominator (Equivalent-Unit) Renaming ($\frac{2}{3}$ vs. $\frac{3}{5} \rightarrow \frac{10}{15}$ vs. $\frac{9}{15}$):**
   - The general exact algorithm when structural or benchmark strategies do not settle a close pair, and the direct prerequisite for computing the exact numerical difference $|a - b|$.

### 4.2 Strategy-Routed Recipes & Diagnostic Heuristic Counterexamples
Rather than forcing every pair through common denominators (which fails on $\frac{3}{5}$ vs. $\frac{5}{9}$ where $\text{LCD} = 45 > 30$) or building a complex multi-strategy chooser first, **assign each authored item to a recipe where that recipe's strategy is decisive and eligible**, and require batch validation to include counterexamples to both major learner misconceptions:
- **Counterexamples to "Bigger-Numbers" Heuristic** (picking the fraction with larger numbers): $\frac{2}{3}$ vs. $\frac{3}{5}$ ($>$), $\frac{1}{3}$ vs. $\frac{2}{7}$ ($>$), and unreduced equal pairs like $\frac{4}{6}$ vs. $\frac{6}{9}$ ($=$).
- **Counterexamples to "Gap Thinking"** (assuming equal $d - n$ gaps mean equal fractions, or smaller integer gap means larger fraction; Mitchell & Horne, 2010): $\frac{2}{3}$ vs. $\frac{3}{5}$ gets the right answer under gap thinking by accident, so batches **must** include pairs where gap thinking fails, such as $\frac{3}{4}$ vs. $\frac{5}{6}$ ($<$), $\frac{4}{5}$ vs. $\frac{7}{8}$ ($<$), and $\frac{4}{6}$ vs. $\frac{6}{9}$ ($=$).

---

## 5. The Comparison-to-Subtraction Bridge (`|a - b|`)

### 5.1 Unordered Distance vs. Presupposed Order
- Asking *"How much greater is A than B?"* already tells the learner that $A > B$.
- To make magnitude comparison a purposeful first step that determines subtraction order, use **neutral unordered distance wording**:
  - **"Which fraction is greater, and by how much?"** or **"How far apart are these two fractions?"**
- **Two-Stage Flow (Common-Unit Eligible Pairs Only, $\text{LCD} \le 30$):**
  1. **Compare:** Establish common units ($\frac{2}{3} = \frac{10}{15}$, $\frac{3}{5} = \frac{9}{15}$) and determine which fraction is greater (or if they are equal).
  2. **Difference (`operate`):** Subtract the smaller from the larger ($\max(a,b) - \min(a,b) = \frac{10}{15} - \frac{9}{15} = \frac{1}{15}$) while preserving the original A/B identities. If the fractions are equal ($a = b$), the difference is $0$ (reusing `plan-38`'s zero-result support).
  3. **Resolve:** Display the aligned comparison bars with the gap marked (adopting the accepted `plan-15` comparison subtraction prototype into a learner episode and addressing the comparison half of `OQ-25`).

### 5.2 Signed Difference ($a - b < 0$) Is Out of Scope
- `src/math/fraction.js` enforces nonnegative fractions by construction, and Founding Seed scope is proper fractions and mixed numbers. Keep $a > b \iff a - b > 0$ as mathematical background rationale only, not a planned product feature.

---

## 6. Accessibility Parity, Relation Control, and Anti-Brute-Force Recovery

1. **Accessible Relation Control & Separating Magnitude from Symbol Reversal:**
   - Bare `<` and `>` glyphs are inconsistently voiced by screen readers at default punctuation settings, and children frequently confuse the direction of `<` and `>` even when they know which quantity is larger.
   - **Design options to settle in Packet A:**
     - **Option R-A (Two-Step or Direct Tap-the-Greater):** Ask *"Which is greater?"* (`[ First fraction: 2/3 ]`, `[ Second fraction: 3/5 ]`, `[ Same amount ]`), then display or confirm the symbolic statement $\frac{2}{3} > \frac{3}{5}$.
     - **Option R-B (3-Choice Relational Group with Explicit `Check`):** Present `[ < | = | > ]` visually between the stacked fractions, backed by native radio options with complete spoken labels (*"2 over 3 is less than 3 over 5"*, *"2 over 3 is equal to 3 over 5"*, *"2 over 3 is greater than 3 over 5"*) and an explicit `Check` button.
2. **Pre-Answer Linear-Path Parity:**
   - Pre-answer descriptions expose exact structure (numerator, denominator, equal parts), never comparative adjectives (*"longer/shorter"*), percentages, or separating benchmark buckets for both operands on a benchmark item.
3. **Calm, Non-Punitive Anti-Guessing Design:**
   - Never disable a wrong option on a 3-choice control (which turns a 3-way choice into a 50/50 coin flip), and never use timers, lockouts, or silent mid-episode schedule/support mutations.
   - Prevent brute-force guessing through: (a) explicit two-step select + `Check`, (b) batch balance across `<`, `=`, `>`, swapped operand orders, and heuristic counterexamples, (c) specific non-answer-bearing recovery prompts within the fixed episode schedule, and (d) truthful `retryHistory` provenance.

---

## 7. Scaling to Improper Fractions (`>= 1`) and Mixed Numbers (Phase 5)

- **Improper Fractions (`>= 1`):**
  - When one operand is $< 1$ and the other is $> 1$ (e.g., $\frac{4}{5}$ vs. $\frac{5}{4}$), **benchmark $1$** settles the comparison immediately on a `[0, 2]` number line.
  - When both are improper (e.g., $\frac{7}{4}$ vs. $\frac{5}{3}$), **whole-part-first decomposition** ($\frac{7}{4} = 1\frac{3}{4}$ vs. $\frac{5}{3} = 1\frac{2}{3}$) reduces the problem to comparing the proper fractional remainders ($\frac{3}{4}$ vs. $\frac{2}{3}$). Requires `DECISION-032` compliance (never leaking the mixed decomposition before the learner establishes it) and the multi-whole stack-to-line bridge.
- **Mixed Numbers (Phase 5, gated by `OQ-24` / `DECISION-033`):**
  - Compare whole-number parts first; if equal, compare fractional parts. Cross-form pairs (e.g., $2\frac{1}{5}$ vs. $\frac{19}{8}$) require an explicit conversion step before comparison and must wait for the Phase 5 mixed-number instructional strategy and stacked mixed-number typography (`phase-3-follow-up-obligations.md` row 40).

---

## 8. Recommended Phase 4 Packet Sequence & Open Owner Decisions

### Recommended Packet Sequence (After `plan-40` -> §31/§90 Disposition -> `plan-39`)
1. **Packet A — Bounded Magnitude Comparison Design Packet (Docs-Only):**
   - Settle the owner decisions below, define the compact comparison record and strategy-eligibility validator contract, specify the accessible relation control (and shared contract with crossing-sum magnitude prediction), and define the initial recipes and recovery rules.
2. **Packet B1 — Proper-Fraction Magnitude Comparison Vertical Slice & Curated Batch (`High` + `Medium` Support):**
   - Implement the `compare` task family, relation control, leakage invariants, and next replay version across a vetted proper-fraction batch (including `<`, `=`, `>`, swapped operand orders, and bigger-number / gap-thinking counterexamples).
3. **Packet B2 — Benchmark Magnitude Comparison on the `[0, 1]` Number Line:**
   - Reuse `plan-39`'s `[0, 1]` number-line renderer and locate grammar for separating-benchmark comparisons (e.g., $\frac{3}{8}$ vs. $\frac{5}{9}$ across $\frac{1}{2}$).
4. **Packet C — Compare-and-Difference Subtraction Bridge (`|a - b|`):**
   - Connect *"Which is greater, and by how much?"* to positive difference $\max(a,b) - \min(a,b)$ on common-unit eligible pairs ($\text{LCD} \le 30$), bringing the `plan-15` comparison subtraction model into learner episodes.

### Open Owner Decisions to Settle in Packet A
1. **Relation Control Grammar:** Should the learner first tap *"Which is greater? [First] [Second] [Same amount]"* (separating magnitude judgment from `<`/`>` symbol direction), or directly select `[ < | = | > ]` with full spoken labels and `Check`?
2. **First Source Slice Recipe Scope (`Packet B1`):** Should `Packet B1` start with **Common-Unit Construction on Bars** ($\text{LCD} \le 30$, sequential renaming before comparison, feeding directly into `Packet C`), or also include **Same-Numerator (Unit-Size) Comparison** ($\frac{3}{5}$ vs. $\frac{3}{7}$) in the first batch?
3. **Support Levels in `Packet B1`:** Deliver `High` and `Medium` support first (matching the two currently registered app support levels), or open a separate design contract to register a `Low` support level in the switcher?
4. **Touch-Target Floor for Relation Buttons:** Adopt the `44x44px` floor (`DECISION-046` precedent; 3 buttons easily fit inside `360px`) or the `24x24px` floor (`DECISION-010`)?

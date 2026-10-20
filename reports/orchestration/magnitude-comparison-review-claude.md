# Skeptical Review: Phase 4 Fraction Magnitude Comparison Proposal (Claude)

- **Reviewed document:** `docs/development/phase-4-magnitude-comparison-notes.md` (recorded 2026-10-19)
- **Reviewer:** Claude (Opus 5.5), orchestrator-class, read-only except this file
- **Date:** 2026-10-19
- **Source revision inspected:** `4eba2d2` (main; `plan-40` Checkpoint 1)
- **Independence:** I did not read `magnitude-comparison-review-codex.md` before writing this review.
- **Method:** I read the proposal, `AGENTS.md`, plans 15/36/37/39, and the Phase 3 follow-up register in full. I made targeted reads of the founding documents, decision log, open questions and live `src/`. I ran a non-shipped exact-arithmetic probe in a scratch directory using `src/math/index.js` (the results are in §4.1). Three read-only Haiku subagents did a code-seam inventory, a founding-doc extraction and a web literature check. I spot-verified their load-bearing claims against the files. Where a literature claim rests only on abstracts or secondary summaries, I say so.
- **Standing:** This is review evidence for the owner and orchestrator. It is not an owner decision, it does not authorize any packet, and it makes no learner-efficacy claim.

---

## 1. Executive Verdict and Top-Line Recommendations

**Verdict: keep the goal, rebuild the design.** Magnitude comparison is a legitimate FractionFlow task. The founding documents already sanction it, and the proposal undersells that. The notes have three structural problems:

- They frame the "visual giveaway" as a perception problem to be solved by obscuring geometry. It is really a sequencing problem, solved by controlling when, and by whom, a representation is constructed.
- They assume one common-denominator workflow ("replace `operate` with `compare`"). Comparison is the one fraction task where the best strategy depends on the item.
- They overstate what the codebase already provides. Comparison is a new operation and a new beat kind, not a re-skin.

### Keep

- **Comparison as a goal.** `03-math-and-content-model.md` §43 "Focused Magnitude Problems" lists *"compare two fractions"* and *"place a fraction relative to 0, 1/2, and 1"*. `01-instructional-model.md` §4 makes magnitude a core strand ("larger or smaller than another fraction"). Roadmap §33 names magnitude as a first number-line goal. The notes cite none of these, so the proposal reads as a scope expansion when it is not one.
- **The strategy taxonomy**, with corrections to its attribution and to one example (§2.3).
- **The comparison-to-difference bridge**, narrowed to common-unit items (§4.4).
- **Genuine `=` items, and the worry about guessing on a 3-option task.**
- **Rejection of the discrete filled/empty-circle model.** The reasoning is correct: it breaks the stable-whole rule (`00-principles.md` "redesign or reject" a representation with an unclear whole) and it rewards the "bigger numbers" heuristic.

### Change

1. **Replace "anti-giveaway representations" with an anti-giveaway sequencing rule.** Before the learner commits, the screen shows no co-present magnitude depiction of both operands unless the learner built it. Concretely, use one of these, depending on the recipe:
   - *construct-then-compare*: the learner renames or shades each operand one at a time;
   - *locate-then-compare*: the learner places each fraction on a line, reusing the Plan 39 grammar;
   - *predict-then-verify*: the learner gives a symbolic judgment first and the model is the check.
2. **Make recipes strategy-routed.** Each authored item declares one intended strategy. Validation computes which strategies are actually decisive and eligible for that pair, and refuses an item whose declared strategy is not one of them (§4.2).
3. **Separate the magnitude judgment from symbol recording.** "Which is greater?" (tap a fraction, or "same amount") is one decision. Writing `<`/`>` is a second, notational one. Otherwise every wrong symbol is ambiguous between a magnitude error and the well-known symbol-direction confusion.
4. **Correct the factual errors** listed in §2, especially the nonexistent function, the misattributed "five strategies" source, and the touch-target decision number.
5. **Treat Low support as unbuilt.** The app registers only `high-support` ("More support") and `medium-support` ("Less support") (`src/app/support-levels.js:17-30`). A Low tier is a separate design obligation, not a given.

### Drop or rethink

- **Option H1 (opposite-direction bars): drop it.** It contradicts the adopted DECISION-046 bar-to-line convention. Its anti-giveaway effect cannot be expressed in the accessible linear path. It fails for values above 1. It would need new renderer capability for a picture meant to be discarded (§3.2).
- **Option H2 (staggered bars): demote it.** It hides less than it appears to, and it costs bar width at 360px (§3.3).
- **Signed extension (`a − b < 0`): drop it from FractionFlow scope.** The exact core is nonnegative by construction: `createFraction` rejects negative numerators and `subtractFractions` rejects negative results. The founding scope is proper fractions and mixed numbers. This would be a scope decision, not an extension activity (§4.5).
- **The "motivates common units before arithmetic" rationale: rethink it.** In FractionFlow's order, learners have renamed for unlike-denominator addition and subtraction for all of Phase 3 before any Phase 4 comparison. In the standards it is the reverse: comparison is grade 3–4 (3.NF.A.3d, 4.NF.A.2), while unlike-denominator addition and subtraction is grade 5 (5.NF.A.1). In this product, comparison's value is **magnitude sense and reasonableness** (`01` §4) and the **difference meaning of subtraction**. It is not motivation for a renaming procedure the learner already practises.

---

## 2. Fact-Check of Codebase, Mathematical and Pedagogical Claims

### 2.1 Codebase claims

| Claim in notes | Verdict | Evidence |
|---|---|---|
| `compareFractions`, `equalFractions` exist | **True** | `src/math/fraction.js:121-134`. Cross-multiplication returns -1/0/1. Values above 1 are accepted. |
| These live in "`src/math/fraction.js` and `src/math/classify.js`" | **Partly** | All comparison, benchmark and LCD functions are in `fraction.js`. `classify.js` only imports them. It defines `classifyMagnitude` (`:193-236`). |
| `benchmarkFraction`, `classifyMagnitude` provide "benchmark proximity" | **Overstated** | `benchmarkFraction(name)` is a lookup of four constants: `zero`, `half`, `one`, `two` (`fraction.js:3-8, 227-232`). `classifyMagnitude` returns a *region* (for example `between-half-and-1`) plus `lowerWhole`/`upperWhole`. There is no nearest-benchmark, distance, residual (`1 − x`) or "excess over ½" function. Residual and half-excess strategies need new pure functions. They are trivial to derive from `subtractFractions(one, x)` but must still be written, tested and named. |
| `scaleFactorsForCommonDenominator` exists | **False** | No such export. The singular `scaleFactorForDenominator(value, target)` exists (`fraction.js:149`). `validateCommonDenominator` returns both scale factors (`validation.js:36`), and eligibility uses it. |
| Common-denominator conversion exists | **True** | `leastCommonDenominator`, `convertToDenominator`, `validateCommonDenominator`. |
| Common-numerator conversion | **Absent** (the notes do not claim it, but §5 and the brief lean on it) | No common-numerator function exists. Content eligibility is defined only through `validateCommonDenominator` (`src/content/eligibility.js:50-80`), so no eligibility path exists for a common-numerator or benchmark route. |
| High/Medium "reuse `decide` and `transform`, replacing `operate` with a `compare` decision" | **Much harder than implied** | `computeBeatSchedule` rejects any operation other than `add`/`subtract` (`beat-schedule.js:74-76`). `family-definitions.js` only knows `add`/`subtract`. No three-way relational response exists: Notice and premise are binary, and matching reflection is a 3-option form choice. A new beat kind touches `episode-definition.js`, `beat-schedule.js`, `episode.js` (responsibilities, `INTENT_BEATS`, grammar assertion, dispatch), `provenance.js`, `classification.js`, both renderers' beat switches (`beat-container.js:442-825`, `linear-path.js:574-952`), `app.js` beat checks, `strings.js`, and `tests/leakage-invariants.test.js`. It also needs a replay schema bump that must be serialized with Plan 39's. |
| "`360px` bar partition ceiling (`maxDenominator = 30`)" (from the review brief) | **Mislabelled** | `PHASE2_FRACTION_BAR_LIMITS = { maxDenominator: '30', maxScaleFactor: '12' }` (`eligibility.js:17-23`, DECISION-011). It bounds the chosen *common denominator* and each *scale factor* on a content path. The renderer enforces no cap (`fraction-bar.js:41`, segments `flex: 1 1 0`). DECISION-025's rationale assumed about 12px per segment at 360px. Plan 39 measured usable track at about 218–278px inside card padding, so a 30-part bar is about 7–9px per part, already worse than the decision assumed. The **scale-factor ceiling of 12** is a second, independent constraint the notes never mention. |
| "`44x44px` touch targets (`DECISION-010`)" | **Misattributed** | DECISION-010 adopts WCAG 2.2 AA, which is 24×24 (2.5.8). The 44×44 figure was adopted for the number line in DECISION-046 and Plan 39. Plan 15 cites 24×24 via DECISION-025. A comparison packet must say which floor it adopts and why. |
| Low / Medium / High support | **Low does not exist** | Only two levels are registered (`src/app/support-levels.js`). Of the six support dimensions in `src/interaction/support.js`, only `fractionBarModel` and `commonDenominator` have consumers (`scene.js:250, 697`). `02-interaction-grammar.md` §22 defines Low as *"solves symbolically, with the model available only if requested."* The notes' Low (symbolic first, model at `resolve`) roughly fits that, but building it is new work. |
| Bars "stacked in vertical left-edge alignment" | **True, and it is the default** | `.fraction-bars-wrapper` is a column flex and every bar fills left-anchored (`render.css:66-71, 192-199`). There is no direction, mirror or anchor option. Existing `juxtaposed` and `sequential` bar modes (`fraction-bar.js:534-685`) are the natural starting point for a one-bar-at-a-time approach. |
| Bridges to `OQ-25` / `plan-15` comparison prototype | **True** | The standalone comparison prototype exists (Plan 15, owner accepted). DECISION-045 says comparison/difference "remain follow-up work". "Deferred" is a fair paraphrase, but the decision text does not use that word. |
| Recovery on a 3-choice task needs design | **True; no existing guard** | Recovery keeps the beat and appends to `retryHistory` (`episode.js:469-492`). There is no attempt cap, delay or elimination. Help is learner-requested only. No current decision has fewer than 2 options. |

**Omissions worth adding to the notes:**

- `03` §43 and `01` §4 (above).
- `01` §22.4 (the "larger denominator is a larger fraction" misconception).
- Roadmap §28 ("determine whether a result should exceed one").
- The Phase 3 follow-up register row **"Magnitude prediction for crossing and non-crossing sums"**, which already asks for a *below / equal / above one* judgment. That is the same three-way relational control against a benchmark. The two designs should share one relation-response contract, not invent two.

### 2.2 Mathematical claims

Checked with the exact core (probe output in §4.1):

- Correct: `2/3 > 3/5` because `10/15 > 9/15`, difference `1/15`. `3/5 = 27/45 > 25/45 = 5/9`. 60% versus 55.6%. `3/5 = 1/2 + 1/10` and `5/9 = 1/2 + 1/18`. `3/8 < 1/2 < 5/9`. `4/5` versus `7/8` via residuals `1/5` versus `1/8`.
- **Example to correct:** §5 item 4 lists `3/5` versus `5/9` under "residual" as if residual-to-1 helped. The residuals to 1 are `2/5` and `4/9`, which is not an easier comparison than the original. Only the *excess-over-½* variant works for this pair, because it reduces to unit fractions `1/10` versus `1/18`. These are two different strategies and should be named separately.
- **Scope slip:** §5 item 3 uses `4/5` versus `5/4`. That is an improper fraction, outside Phase 3/4's proper-fraction domain. Fine as a later example, but label it.
- **Common numerator for `3/5` versus `5/9`** gives `15/25` versus `15/27` (scale factors 5 and 3). That is within the numeric ceilings, but two bars of 25 and 27 parts at about 218–278px are about 8–11px per part and still differ by only `2/45` of the whole. The strategy's power is the *symbolic* inference "27ths are smaller than 25ths". Its bar picture adds little. Treat common numerator as a reasoning recipe, not a representation escape hatch.

### 2.3 Pedagogical and research claims

Verdicts below are from the literature subagent and my own knowledge. Several primary texts were paywalled, so items marked "verify" need a primary-source check before any packet cites them.

| Claim | Verdict |
|---|---|
| "Five core strategies" identified by RNP/Behr et al., Cramer–Post–delMas, Clarke & Roche (2009), Siegler's integrated theory, and the IES guide | **Misattributed as a combined list.** The **RNP tradition** (Post, Behr, Lesh and colleagues) is usually summarized as *four* ordering strategies: same denominator, same numerator, transitive/benchmark, and residual. It treats common denominator as the *procedure*, not a reasoning strategy. RNP materials deliberately delay it. This is my recollection and needs a primary-source check. **Clarke & Roche (2009)** (*ESM* 72(1), 323 Grade 6 students) report that the strongest students used benchmark and residual thinking, that same-numerator pairs were surprisingly hard, and they document **gap thinking**. **Siegler, Thompson & Schneider (2011)** is a theory of magnitude knowledge, not a strategy list. The **IES guide (Siegler et al., 2010)** recommends number lines as a central representational tool (Rec. 2), but names no comparison strategies and does not recommend benchmark comparison as such. Rewrite: "RNP's four ordering strategies, plus common-denominator renaming as the general procedure; Clarke & Roche document benchmark/residual use and gap thinking." The strongest *standards* source is **4.NF.A.2**: "by creating common denominators or numerators, or by comparing to a benchmark fraction such as 1/2 … justify the conclusions, e.g., by using a visual fraction model." |
| Same-numerator comparison "directly confronts whole-number bias" | **Supported.** Obersteiner et al. (2013, *Learning and Instruction* 28) found that even experts show natural-number bias on common-component pairs. Clarke & Roche (2009) found same-numerator pairs unexpectedly hard for children. Illustrative Mathematics' 4.NF.A.2 guidance targets the same misconception (students judging `26/3 < 26/12` "because the numbers are smaller"). |
| Whole-number bias | **Supported**, with framing caveats. See Ni & Zhou (2005) review; Vamvakoussi et al. (2012); DeWolf & Vosniadou (2015). Mitchell & Horne (2010) argue **gap thinking is not simply whole-number bias**, so the two should be modelled as separate heuristics. |
| Complement-to-1 reading errors | **Plausible risk, no direct evidence either way.** Part-part reading errors (counting unshaded over shaded) are documented. No study on right-to-left shading was found. Any claim that H1 "productively forces unit reasoning" is unsupported. |
| Bars versus number lines for magnitude | **Partially supported.** Hamdan & Gunderson (2017, *Dev. Psych.* 53(3)) found number-line training transferred to magnitude comparison and area-model training did not. Gunderson et al. (2019) found similar results for unidimensional lines. Fazio, Kennedy & Siegler (2016) has no area-model arm. "Number lines outperform" is too strong as a general claim, but it does favor the number line as comparison's Phase 4 home. |
| Perceptual behavior of aligned, staggered and opposite bars | **The ranking is supported; the specific predictions are inference.** Cleveland & McGill (1984): position on a common scale is judged better than position on non-aligned scales, which is better than length. That predicts aligned bars give the answer away most strongly and staggered bars somewhat less. It says nothing about fill direction. |
| 3-option `<`/`=`/`>` guessing | **No research found.** The 33% chance baseline is the relevant fact. Inference: `=` items are *diagnostic* (gap thinkers choose `=` on `3/4` versus `5/6`), not just a rare outcome. |
| Compare ("how much more") problems are harder than takeaway | **Supported in the whole-number literature.** See the Carpenter & Moser lineage, and Lewis & Mayer (1987): relational statements are miscomprehended when the term conflicts with the operation, and "less than" is harder. Applying this to fractions is an analogy, not direct evidence. |

---

## 3. Representations and Support Levels

### 3.1 Reframe: the giveaway is a sequencing problem

The giveaway exists only because the system draws an honest, aligned picture of *both* magnitudes before the learner has done anything. Obscuring that picture's geometry (H1, H2) fights the product's own fidelity principles: stable whole, honest lengths, the bar-to-line convention. It also opens a gap between visual and linear access (§5.3).

The alternative is to **never present a ready-made co-present depiction of both magnitudes before the learner commits**, and to let the representation either (a) be built by the learner or (b) serve as verification afterwards. This reuses responsibilities FractionFlow already has: Plan 34 construct, transform renaming, Plan 39 locate.

A prior design question decides how much this matters, and the owner should answer it first. **Is the recipe's learning goal magnitude sense or exact reasoning?**

- If the goal is "fractions are numbers with sizes" (`01` §4, IES Rec. 2), *seeing* magnitude on an aligned model is the content, not a cheat. High support may legitimately show aligned bars and ask the learner to say *why*, for example on same-numerator items.
- If the goal is exact comparison of close pairs, the picture must come after the reasoning.

The notes treat every recipe as the second case.

### 3.2 Option H1: opposite-direction bars. Recommendation: drop

1. **It contradicts DECISION-046.** The adopted bridge teaches that the right edge of the shaded part is the distance from 0 and lines up with the point on the line. A right-anchored `3/5` has its boundary at `2/5`. That trains exactly the complement read the notes worry about, one packet before or after Plan 39 teaches the opposite.
2. **It has no accessible equivalent.** The effect is purely perceptual. The linear path would have to say "shaded from the right", which is meaningless to a screen-reader user, or omit it and give them a different task. `05-quality-and-validation.md:939` asks that both paths carry the same mathematical responsibility. A trick that exists only in pixels cannot meet that.
3. **It does not reliably hide the answer.** Comparing two non-aligned shaded lengths is Cleveland & McGill's "length" judgment, which is still workable at the 5–7% differences of typical items (`2/3` versus `3/5` differ by `1/15`, about 15–18px on a 218–278px track). When `a + b > 1` the shaded regions overlap, which invites comparing the *unshaded* remainders. That is residual reasoning by accident, untaught and unannounced.
4. **It fails above 1.** There is no meaning for multi-whole stacks or mixed numbers, so it is a dead end for the scaling the brief asks about.
5. **Cost.** The renderer has no direction option. H1 means new geometry, new motion and reduced-motion parity, and new witnesses, all for a picture intended to be thrown away after conversion.

### 3.3 Option H2: staggered bars that snap into alignment. Recommendation: demote

- Non-aligned position is the *second-best* perceptual channel. Staggering raises the difficulty of eyeballing but does not remove it for moderately close pairs.
- **Horizontal** separation halves each bar's width at 360px. A 15-part bar would then be about 7–9px per part, failing the density reasoning behind DECISION-025. **Diagonal** staggering costs vertical space instead.
- The "snap into alignment" reward is pleasant but is motion carrying meaning. It needs reduced-motion parity and no auto-advance (DECISION-021).
- Its one real virtue is that 0 stays on the left. The sequential approach below keeps that virtue without the layout cost.

### 3.4 Option H3 and single-anchor. Recommendation: keep, and turn into construction

H3 (second bar partitioned but unshaded until renamed) is the strongest of the three because it is **structural**: it withholds information instead of distorting it, and it has a direct linear equivalent ("Second fraction: 5 equal parts. Shading not shown yet."). Refine it as follows:

- **Construct-then-compare (High).** Use the existing `sequential` bar mode. `transform-left` shows only the left operand's bar being renamed (`2/3 → 10/15`). `transform-right` shows only the right operand's bar (`3/5 → 9/15`). At `compare`, the learner has two *symbolic* same-unit quantities (`10/15` versus `9/15`) and makes the comparison that the renaming made easy. Aligned bars with the gap marked appear at `resolve` as verification. That gap is also the bridge to difference (§4.4). Remembered lengths across beats are a much weaker cue than co-present aligned lengths. Whether that is weak *enough* should be tested on the reviewer surface, not asserted.
- **Learner-shaded variant.** Instead of revealing the second bar's shading, the learner shades `9` of `15` (Plan 34 construct). A construction error is then diagnostic, and the representation is the learner's own work.
- **Single-anchor Medium, as proposed, has a weak rationale.** One bar grounds one unit size but does nothing for the comparison. Under `02` §22, Medium means the learner *supplies* the common denominator and numerators. Medium should therefore be the same recipe with candidate lists removed and the model shown only on request. That is lean, familiar and consistent with "familiar episodes become progressively leaner."

### 3.5 Better home for benchmark comparison: the number line

Roadmap §33 makes "placement relative to zero, one-half, and one" a Phase 4 number-line goal. On a line, **order is position**: `a < b` *means* `a` is left of `b`. Hiding position would be anti-mathematical. The task should be **locate-then-compare**: the learner places each fraction on a sparse `0, ½, 1` line using the Plan 39 two-step select/confirm grammar, and the relation follows from their own placements. There is no giveaway, because nothing is placed until the learner places it. Plan 39's `wrong-side-of-half` / `too-low-same-side` classification transfers directly to recovery.

Its limit is honest: Plan 39 caps full partitions at `b ∈ {2,3,4,6,8}`, so close same-side pairs (`2/3` versus `3/5`) cannot be settled on the line. That is exactly why recipes must be strategy-routed.

### 3.6 Recommended support progression

| Level | Common-unit recipe (bars) | Benchmark recipe (line, after Plan 39) |
|---|---|---|
| High | Choose the common denominator from candidates; rename each operand one at a time (sequential bars); compare same-unit symbols; aligned bars at `resolve`. | Full `1/b` ticks for single-denominator operands within `b ≤ 8`; locate each; then decide the relation. |
| Medium | Supply the common denominator and numerators; model on request; aligned bars at `resolve`. | Sparse `0, ½, 1`; locate each among authored candidates; then decide the relation. |
| Low (unbuilt) | Predict-then-verify: decide the relation from symbols; model and justification shown after. A wrong answer routes to one reasoning step (§5.4). | Same: decide the relation; benchmark placement offered as the check. |

---

## 4. Episode Recipes, Strategy Diversity, and the Comparison-to-Subtraction Bridge

### 4.1 Probe: pairs differ in which strategy is decisive

These were computed with `src/math` (`compareFractions`, `leastCommonDenominator`, `lcm`, `classifyMagnitude`) in a scratch script. Nothing was shipped. "Bigger-numbers" is the heuristic that the fraction with both components larger is larger. "Gap" is the heuristic that the fraction with a smaller `d − n` is larger.

| Pair | Truth | LCD | Common numerator | Bigger-numbers | Gap | ½ decides? |
|---|---|---|---|---|---|---|
| 2/3 vs 3/5 | > | 15 | 6 (9ths vs 10ths) | **wrong** | right | no |
| 3/5 vs 5/9 | > | **45** | 15 (25ths vs 27ths) | **wrong** | right | no |
| 3/8 vs 5/9 | < | **72** | 15 | right | right | **yes** |
| 4/5 vs 7/8 | < | **40** | 28 | right | **wrong (=)** | no |
| 3/4 vs 5/6 | < | 12 | 15 | right | **wrong (=)** | no |
| 3/5 vs 3/7 | > | 35 | (same) | n/a | right | **yes** |
| 4/6 vs 6/9 | = | 18 | 12 | **wrong** | **wrong** | no |
| 2/3 vs 5/8 | > | 24 | 10 | **wrong** | right | no |
| 4/7 vs 1/2 | > | 14 | 4 | right | **wrong** | (is ½) |
| 5/6 vs 7/8 | < | 24 | 35 | right | **wrong (=)** | no |
| 2/5 vs 3/7 | < | 35 | 6 | right | **wrong** | no |
| 1/3 vs 2/7 | > | 21 | 2 | **wrong** | right | no |

Observations:

- **The notes' flagship pairs are not diagnostic of gap thinking.** On `2/3` versus `3/5` and `3/5` versus `5/9`, gap thinking gives the *right* answer. A batch built from them cannot tell a gap thinker from a reasoner. Batches need pairs where each heuristic fails: `3/4` vs `5/6`, `4/5` vs `7/8` and `5/6` vs `7/8` for gap; `2/3` vs `3/5`, `1/3` vs `2/7` and `4/6` vs `6/9` for bigger-numbers.
- **`3/5` vs `5/9` is not a bar item.** LCD 45 is ineligible. The common-numerator bars are dense and still close. Neither half nor 1 decides it. Only *excess over ½* (`1/10` vs `1/18`) or symbolic common numerators settle it cleanly. It belongs in a Low/symbolic or later "half-plus" recipe, not in High.
- **`3/8` vs `5/9` is a pure benchmark item.** LCD 72 is ineligible on bars, but the ½ benchmark settles it trivially. It is a number-line item.

### 4.2 Structure: strategy-routed recipes with derived item metadata

Do not build "one comparison workflow with optional strategies." Build a **small number of recipes**, each one familiar sequence. Make **validation, not the author, compute which strategies are decisive** for each record:

```text
Authored record (compact):  { itemId, left, right, recipeId, presentationOrder }
Derived by validation:      truth (<,=,>); decisive strategies, each one of
                            sameDenominator | sameNumerator | benchmarkHalf | benchmarkOne |
                            unitResidualToOne | excessOverHalf | commonDenominator(eligible?) |
                            commonNumerator(eligible?);
                            heuristic predictions {biggerNumbers, gap}; |a−b| and its eligible unit
Refusal:                    recipeId ∉ decisive ∩ eligible  →  record rejected
```

Candidate recipes, in suggested order:

| Recipe | Item property | Representation | Notes |
|---|---|---|---|
| R1 Same-size parts (common denominator given or built) | LCD ≤ 30, scale factor ≤ 12 | Bars, sequential renaming | Reuses `decide`/`transform`. Feeds the difference bridge. |
| R2 Same number of parts (unit size) | Same numerator, or a small common numerator | Bars aligned are *acceptable* (seeing smaller parts is the content); the learner says why | Directly targets `01` §22.4 and whole-number bias. |
| R3 Benchmark ½ | Operands on opposite sides of ½ (`classifyMagnitude`) | `[0,1]` line, locate-then-compare | After Plan 39. Reuses its recovery classes. |
| R4 Residual / half-excess | Residuals are unit fractions or share a numerator | Symbolic first; line or bars as check | Later. **Must** include gap-thinking discriminators, because residual reasoning is the correct twin of gap thinking. |

**Strategy choice** ("Use a common denominator, or not": Illustrative Mathematics' 4.NF.A.2 lesson, whose guidance flags students who *always* multiply denominators) is a real goal. Make it a Low/independent-tier variant or a recovery offer, though, not a mandatory extra screen. The owner's standing priority is shorter episodes (follow-up register, Plan 29).

### 4.3 How to handle "forced clunky common denominators"

The answer is *not* to teach every strategy inside one episode. It is to:

- **refuse** an item in a recipe where that recipe's strategy is not decisive and eligible;
- **assign** each pair to the recipe in which it is insightful.

`3/5` vs `5/9` then never appears in R1. `2/3` vs `5/8` (LCD 24) never appears in R3. The eligibility seam already returns structured refusal reasons (`denominator-ceiling-exceeded`, scale-factor ceilings). Extending it with strategy-specific eligibility is the same pattern, not a new framework.

### 4.4 The comparison-to-difference bridge

The notes' two-stage idea is sound, with three refinements.

1. **Only the common-unit route produces a difference.** Benchmark and residual comparisons settle order but do not yield `|a − b|`. For `3/5` vs `5/9` the difference `2/45` is not representable on the bars. So Packet C uses **R1 items only** (LCD ≤ 30 for *both* the comparison and the difference).
2. **Wording matters.** "How much greater is A than B?" names the larger quantity, so a compare step is redundant (or a trick question when A < B). The order-determining prompt is **"What is the difference between A and B?"** (or "Which is greater, and by how much?"). Whole-number research says comparison wording is itself a difficulty source, especially "less than" (Lewis & Mayer, 1987). Keep copy at the grade 2–3 register (DECISION-021) and test it.
3. **Recipe:**

```text
encounter → decide (common unit) → transform-left → transform-right   [sequential bars]
→ compare (tap the greater amount / "same amount")
→ operate (learner writes the difference greater − smaller; the minuend order is the
           learner's own prior judgment, so a smaller − greater attempt gets recovery that
           points back to their comparison, not a generic retry)
→ resolve (aligned bars, gap marked = Plan 15 comparison prototype; `=` items resolve to 0,
           reusing Plan 36/38's zero-result handling)
```

The schedule is still computed once at construction (DECISION-034). Which operand is larger is known from the mathematics. The learner's ordering is a *response*, not a schedule branch. This is also the cleanest route to settling the open half of OQ-25 (comparison as a subtraction meaning) by observation, as Plan 15 intended.

### 4.5 Signed difference

Drop it from the product plan. `createFraction` enforces nonnegativity (`fraction.js` "nonnegative fraction" construction), and `subtractFractions` documents "rejecting negative results". The seed scope is "proper fractions and mixed numbers". The order-difference equivalence (`a > b ⇔ a − b > 0`) is a fine *design rationale* sentence. As an "extension activity" it would require a signed rational type, new notation, new representations and a scope decision. Record it as out of scope, not as a deferred extension.

---

## 5. Scaling, Accessibility Parity, and Anti-Brute-Force Recovery

### 5.1 Improper fractions (Phase 4 `[0,2]` obligation / Phase 5)

- **The natural strategy is whole-part-first**, which is recursive. Compare whole parts (`classifyMagnitude(...).lowerWhole`). If they are equal, compare the fractional parts with an existing proper recipe. `7/4` vs `5/3` becomes `1 + 3/4` vs `1 + 2/3`, which is R1 with LCD 12. This reuses rather than multiplies recipes.
- **Benchmark 1 becomes decisive often** (`7/8` vs `9/8`). It is a `[0,2]` line item and should wait for the open multi-whole stack-to-line obligation.
- **Bars:** multi-whole stacks exist only for the Plan 17 two-whole 12/24 cases (`scene.js:849-867`), and the single-bar renderer throws for `n > d`. DECISION-032 constraint 3 (no element shows the improper total or its mixed form early) applies directly to comparison: a stack must not show "1 whole + …" before the learner decomposes. H1 has no meaning here at all.
- **The heuristics flip:** for `7/4` vs `5/3` the bigger-numbers heuristic is *accidentally right*, so item discrimination needs re-checking per family.

### 5.2 Mixed numbers (Phase 5, blocked on OQ-24 / DECISION-033)

- The core has `compareMixedNumbers`/`equalMixedNumbers`, so the mathematics is ready. The instruction is not. OQ-24 (no mixed-number instructional strategy) is still open.
- Cross-form pairs (`2 1/5` vs `19/8`) add a *conversion* responsibility before comparison. Decide explicitly whether that is a comparison task or a conversion task with a comparison at the end. Do not let it be both by accident.
- The follow-up register's stacked mixed-number notation and readability obligation must be met first. A relation symbol between two stacked mixed numbers at 360px is a real layout problem.

### 5.3 Accessibility parity during comparison

Rules I recommend the design packet adopt:

1. **Pre-answer descriptions expose structure, never magnitude.** Allowed: numerator, denominator, number of equal parts, parts shaded, the unit's name, and the current task. This matches the `05` permitted list. Forbidden before `resolve`: "longer/shorter", percentages, pixel or estimate language, and **benchmark regions for both operands**. On a benchmark-decisive item, "3/8 is between 0 and one half; 5/9 is between one half and 1" *is* the answer. That is the comparison analogue of Plan 39's forbidden "coarse 3-bucket answer giveaway".
2. **Symmetric parity.** If the visual path shows a co-present magnitude cue before commitment, the linear path owes an equivalent cue. If it cannot express one, the visual should not show it either. This is the decisive argument against H1/H2-style perceptual tricks and for structural withholding (H3, sequential, locate), which reads naturally in text.
3. **Locate in the linear path keeps the decision.** Reuse Plan 39's radio-group step descriptions. The learner chooses positions, and the order follows.
4. **Relation control.** Use a native radio group whose labels are full relations ("3/5 is greater than 5/9", "is equal to", "is less than"), with the glyphs `<` `=` `>` shown visually. Screen readers vary in how they voice bare `<`/`>`, and some skip them at default punctuation settings, so do not rely on it. Under the tap-the-greater split (§1, Change 3), the first control is "Which is greater? [3/5] [5/9] [Same amount]". It reads naturally and separates magnitude from notation.
5. **DOM gating.** Under DECISION-014, converted numerators, `|a − b|`, the truth value and any "correct" flag on the relation options must **not be mounted** until their beat. Extend `tests/leakage-invariants.test.js` with a comparison invariant: no element or attribute before `resolve` distinguishes the correct relation option (`data-correct`, ordering, focus, `aria-current`).
6. **Touch floor.** Three relation buttons at 44×44px fit easily at 360px (3 × 44 plus gaps is about 150px). State explicitly which floor applies (24 under DECISION-010 or 44 under the DECISION-046 precedent).

### 5.4 Anti-brute-force recovery

There is no research on 3-option fraction-comparison guessing, so reason from first principles and the founding recovery rules: respond at the earliest point of divergence (`01-instructional-model.md:1102-1104`), no "Incorrect. Try again." (`02-interaction-grammar.md:566-570`), no hint avalanche.

1. **Never re-offer the same three choices immediately after a wrong answer.** A wrong relation routes to **one recipe-specific reasoning action**, then the choice is asked again:
   - R1: rename one operand.
   - R2: "Which parts are smaller?"
   - R3: place the operand that was misjudged against ½, reusing Plan 39's directional classes.
   - Low: offer the model.

   This makes guessing *slower than reasoning*, without timers or penalties, which would violate calm design.
2. **Do not disable the wrong option.** Elimination turns a 3-way into a 2-way coin flip.
3. **Truthful provenance.** A correct relation after a wrong one is recorded as assisted/after-recovery (`retryHistory`, `05` provenance). It must never count as independent evidence in any later fading policy (Phase 6).
4. **Classify the error when the data allows.** Distinguish symbol-direction errors (correct "greater" tap, wrong glyph) from magnitude errors. Distinguish bigger-numbers predictions from gap predictions using the derived heuristic predictions (§4.2). Add pattern names alongside the existing `PATTERNS` (none of the current ten concern comparison). Keep `03` §62's "without psychological attribution" rule: name the response pattern, not the child's belief.
5. **Batch-level structure is part of anti-guessing.**
   - Balance `<` and `>`.
   - Include `=` in a meaningful minority. I suggest roughly 1 in 5 to 1 in 6, as an owner decision. Make some `=` pairs unreduced-equivalent (`4/6` vs `6/9`) so `=` is not "the one with a simplifying pair".
   - Swap presentation order so "the larger one is on the left" is not a pattern.
   - Guarantee each batch contains items where each tracked heuristic fails.

   All of this is computable in batch validation from exact APIs.
6. **Optional justification.** A one-tap "because…" (same-size parts / same number of parts / one is more than half…) is a strong anti-guessing device, but it adds length. Use it **only in recovery** or at Low support, not on every item.

### 5.5 Content scaling and validation

- Keep records minimal (§4.2). Everything mathematical is derived by `src/math`. There are no hand-written answer tables (the Plan 37/39 precedent).
- Add `compare` as an operation, or a separate task family, with explicit admission. Do not widen `add`/`subtract` families. `beat-schedule.js:74-76` and `family-definitions.js` fail closed today, which is the correct default.
- Batch validators: truth distribution, `=` share, order swaps, heuristic-failure coverage, per-recipe decisiveness and eligibility, and, for bridge items, eligibility of the difference.
- Each family boundary (proper → improper → mixed) re-runs the heuristic-discrimination check. The heuristics change behavior above 1.

---

## 6. Recommended Phase 4 Packet Sequence and Open Questions

### 6.1 Sequencing position

- **Keep Option A.** No comparison source work before Plan 40 and the §31/§90 disposition. Comparison touches `episode.js`, `scene.js`, `replay.js` and both renderers, the same files as Plan 39. Replay schema versions must be serialized.
- **Comparison should precede comparison-subtraction, not ship with it.** The relation decision and its recovery and access contract are a self-contained, testable unit. The difference bridge then adds one beat on top.
- **R1 (bars, common unit) does not depend on the number line.** In principle it is a Roadmap §28-style focused concept that could have been Phase 3. Given Option A and file overlap, **after Plan 39** is still the right *source* slot. A docs-only design packet can run while Plan 39 is in implementation (Mode B, report-folder write scope only).
- **R3 (benchmark) depends on Plan 39's line renderer** and should reuse its grammar and recovery classes.

### 6.2 Packet sequence

| Packet | Type | Content | Gate |
|---|---|---|---|
| **A** (narrowed) | Design, docs-only | Not another broad literature sweep. Deliver: the owner goal decision (§6.3 Q1); the strategy-routed recipe and derived-metadata contract; the relation-control and parity contract; recovery and provenance; batch validators; a Low-tier proposal or explicit deferral; copy at grade 2–3 register. Optionally, a **reviewer-surface prototype** (Plan 15 pattern) contrasting aligned-at-encounter with sequential construct-then-compare on the same fixtures, so the giveaway question is settled by observation, not prose. | Owner design adoption |
| **B1** | Source | R1 common-unit comparison on bars, High + Medium, about 8 items including `=` and heuristic discriminators. New `compare` operation and relation beat, the relation control in both paths, the leakage invariant, the next replay version. | Requirement 0 mechanism gate; after Plan 39 lands |
| **B2** | Source | R3 benchmark comparison on the `[0,1]` line, reusing Plan 39 locate. | After B1 (shares the relation contract) |
| **C** | Source | Compare-then-difference (R1 items only), adopting the Plan 15 comparison representation into learner episodes. Answers the comparison half of OQ-25 by observation. | After B1; owner rendered-page acceptance |
| Later | — | R2 same-numerator (could fold into B1 if the owner prefers); R4 residual / half-excess; improper via whole-part-first with `[0,2]`; mixed numbers after OQ-24. | Each separately gated |
| Unify | Coordination | The register's "magnitude prediction for crossing sums" (below / equal / above 1) should consume the **same** relation-response contract as B1. | Note in Packet A |

**Dropped:** the H1 implementation, and the signed-difference extension.

### 6.3 Open questions to resolve first (owner)

1. **Goal per recipe:** magnitude sense (seeing size is the content) or exact reasoning (the picture comes after)? This decides whether the giveaway problem applies.
2. **Relation response:** tap-the-greater then symbol (recommended), or a direct `<`/`=`/`>` choice?
3. **Low support:** design it now as part of comparison, or deliver High + Medium only and record Low as owed? Today only two levels exist.
4. **Strategy-routed recipes** versus one universal workflow. Is R2 (same numerator) in the first source batch?
5. **Touch-target floor** for the relation control: 24×24 (DECISION-010) or 44×44 (DECISION-046 precedent)?
6. **`=` share and heuristic-discrimination coverage** per batch.
7. **Signed difference:** confirm it is out of scope.
8. **Shared relation contract** with the crossing-sum magnitude prediction obligation: one contract or two?

### 6.4 Corrections the notes should receive (orchestrator, when convenient)

- Replace `scaleFactorsForCommonDenominator` with `scaleFactorForDenominator` / `validateCommonDenominator`, and reword "benchmark proximity" as "benchmark region classification".
- Cite `03` §43, `01` §4 and §22.4, Roadmap §§28/33, and the follow-up register's crossing-sum prediction row.
- Fix the research attribution (§2.3). Split "residual to 1" from "excess over ½". Label `4/5` vs `5/4` as improper and out of current scope.
- Replace "`44x44px` (DECISION-010)" with the correct decision references.
- State that "Low support" is not a currently registered level.

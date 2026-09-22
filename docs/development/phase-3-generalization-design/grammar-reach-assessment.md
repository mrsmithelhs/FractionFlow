# Interaction Grammar Reach Assessment: Phase 3 Generalization

## Review Status

- **Status:** Proposal for owner review (`plan-10`).
- **Baseline commit:** `199c104` (post-`plan-09` Repair 07).
- **Scope:** Complete, code-grounded audit of all eight problem families from Roadmap §27 and all six focused concept episodes from Roadmap §28 against the running codebase.

---

## 1. Executive Summary & Headline Counts

Roadmap §26 defines Phase 3's core design question:

> *"The goal is not to invent new interfaces. The goal is to discover how far the existing interaction language can stretch."*

Auditing the running application at commit `199c104` reveals that the existing fraction-bar interaction language has **demonstrated reach across exactly one problem family**: `relatively-prime-addition` with both operands requiring renaming.

The canonical narrative arc (`encounter → notice → decide → transform → operate → resolve → reflect`) and its supporting implementation (`src/interaction/episode.js`, `src/render/beat-container.js`, `src/render/fraction-bar.js`) were engineered around the specific assumptions of that first vertical slice. When evaluated against the remaining fourteen mathematical targets in §§27–28, the grammar encounters clear, code-level boundaries.

### Headline Counts by Classification

| Classification | §27 Problem Families (8 total) | §28 Focused Episodes (6 total) | Total (14 targets) |
|---|:---:|:---:|:---:|
| **Demonstrated Reuse** | 1 | 0 | 1 |
| **Plausible Reuse** | 2 | 2 | 4 |
| **Needs a New Beat** | 2 | 4 | 6 |
| **Needs a Representation the Bar Cannot Give** | 3 | 0 | 3 |

*Note on multi-classification:* Families featuring both an architectural beat gap and a rendering limitation (e.g. `nested-denominator-subtraction`) are classified primarily by their deepest blocker (**Needs a Representation the Bar Cannot Give**), with beat requirements detailed in their assessment.

---

## 2. Classification Methodology & Evidentiary Standard

To prevent repeating the Phase 2 failure mode—where the existence of a type, a catalog entry, or passing isolated unit tests was mistaken for a working learner-facing feature (`reports/orchestration/phase-2-unreachable-mechanisms.md`)—this assessment enforces four strict evidentiary labels:

1. **Demonstrated Reuse:**
   Must possess an **executable current path** in the running application today. The dossier records the exact configuration, starting surface, and concrete action sequence matching the contract of `plan-14`'s browser route matrix. If an agent cannot boot the application and drive the interaction to completion using existing mounted controls, it cannot be called demonstrated reuse.

2. **Plausible Reuse:**
   The underlying interaction beats, math functions, and rendering structures directly map to the problem family, but execution is currently blocked by explicit guards, unauthored fixtures, or missing registry entries. Every plausible reuse row specifies **exactly what is missing** before an executable path can exist.

3. **Needs a New Beat:**
   The mathematical requirement conflicts with the rigid assumptions of the 7-beat arc (`encounter → notice → decide → transform → operate → resolve`). The problem requires a decision, estimation, or action that the current sequence does not provide, or enforces steps that are mathematically meaningless for that family (such as demanding renaming when units are already identical).

4. **Needs a Representation the Bar Cannot Give:**
   The mathematical quantity or operation cannot be drawn by the existing fraction-bar renderer (`src/render/fraction-bar.js`). Every row in this category carries a **concrete, captured refusal witness** from the running code (an uncaught exception, a guard throw, or a corrupt visual drawing), not an assertion that it would fail.

---

## 3. Comprehensive Audit of Roadmap §27 Problem Families

Roadmap §27 specifies eight problem families to expand the fraction-bar language across proper fraction operations.

```
+---------------------------------------------------------------------------------------------------+
|                                 Roadmap §27 Problem Families                                      |
+------------------------------------+--------------------------------------------------------------+
| 1. like-denominator addition       | 5. shared-factor unlike denominators                         |
| 2. like-denominator subtraction    | 6. relatively prime unlike denominators (Canonical Phase 2)  |
| 3. nested-denominator addition     | 7. results crossing one whole                                |
| 4. nested-denominator subtraction  | 8. simplification                                            |
+------------------------------------+--------------------------------------------------------------+
```

---

### Family 1: Like-Denominator Addition (e.g., $\frac{1}{5} + \frac{2}{5} = \frac{3}{5}$)

- **Classification:** **Plausible Reuse** (with beat compression)
- **Math Core Status:** Complete. `addFractions` in `src/math/fraction.js` computes exact sum `3/5`.
- **Content Model Status:** Complete. Structural selector `like-denominator-addition` is fully defined in `src/content/family-definitions.js:31-43` (`denominatorRelationship: 'same'`, `renaming-count: 0`). Curated golden fixture `curated-like-addition-proper` exists in `src/content/data/phase1-golden-cases.js:4-17`.
- **Interaction & Grammar Analysis:**
  - `encounter`: Reuses prompt `strings.encounter.prompt` ("Look at these two fractions") and acknowledges cleanly.
  - `notice`: `classifyNoticeResponse` (`src/interaction/classification.js:77-85`) evaluates `matchesUnits === true`. When a learner correctly selects "Yes, same size", it returns `kind: 'correct'`. However, if the learner mistakenly answers "No, different sizes", `classifyNoticeResponse` returns `kind: 'incorrect-notice'` with `expectedMatches: true`. In `src/render/strings.js:33-36`, `feedbackSame` and `feedbackDiff` assume unlike denominators. This is **OQ-21** (missing like-denominator recovery copy).
  - `decide` & `transform` **Structural Mismatch:** For like denominators, no renaming is mathematically required (`renaming-count: 0`). However, `src/interaction/episode.js:58-67` and `src/render/beat-container.js:386-423` require two sequential transformation steps (`left` then `right`). If forced through the current state machine, the learner would be asked to "choose a common denominator" when denominators are already equal, and then enter redundant conversions ($\frac{1}{5} = \frac{1}{5}$ and $\frac{2}{5} = \frac{2}{5}$).
  - `operate`: Prompt in `src/render/strings.js:69` ("Add the shaded parts together") and input field in `beat-container.js:425-448` directly match.
  - `resolve`: Prompt in `src/render/strings.js:77` ("The answer is 3/5") directly matches.
- **What is Missing Before Reuse Is Demonstrated:**
  1. Episode definition `src/interaction/episode-definition.js` must register `like-denominator-addition`. Currently, `assertInstance` in `src/interaction/episode.js:153-156` throws:
     `EpisodeConstructionError: content instance is outside the Phase 2 episode family (code: UNSUPPORTED_CONTENT_FAMILY)`.
  2. State machine must support conditional beat skipping: when `renamingCount === 0`, advance directly from `notice` to `operate` (bypassing `decide` and `transform`).
  3. Resolution of OQ-21: Authored pedagogical copy in `strings.notice` for `expectedMatches === true` ("Look at the parts: both bars have 5 equal parts. They are already the same size.").

---

### Family 2: Like-Denominator Subtraction (e.g., $\frac{4}{7} - \frac{1}{7} = \frac{3}{7}$)

- **Classification:** **Needs a Representation the Bar Cannot Give** (and **Needs a New Beat**)
- **Math Core Status:** Complete. `subtractFractions` in `src/math/fraction.js` computes exact difference `3/7`.
- **Content Model Status:** Complete. Structural selector `like-denominator-subtraction` is defined in `src/content/family-definitions.js:44-56` (`operation: 'subtract'`, `nonnegative-result: true`). Golden fixture `curated-like-subtraction-proper` exists in `src/content/data/phase1-golden-cases.js:47-59`.
- **Interaction & Grammar Analysis:**
  - The Phase 2 grammar arc is hardcoded for addition:
    - `src/render/strings.js:69`: `strings.operate.prompt` is `"Add the shaded parts together."`
    - `src/render/strings.js:71`: `strings.operate.inputLabel` is `"Total shaded parts out of ${den}:"`
    - `src/render/strings.js:72`: `strings.operate.errorArithmetic` is `"The denominator stays the same. Add only the top numbers."`
  - In `src/render/beat-container.js:425-448`, the `operate` beat renders these addition strings indiscriminately.
- **Refusal Witness (Captured):**
  1. **Episode Construction Rejection:**
     Calling `createEpisode({ instance })` with `curated-like-subtraction-proper` throws:
     `EpisodeConstructionError: content instance is outside the Phase 2 episode family (code: UNSUPPORTED_CONTENT_FAMILY)` at `src/interaction/episode.js:155`.
  2. **Bar Representation Refusal (Zero Subtraction Semantics):**
     In `src/render/fraction-bar.js:17-61`, the bar renders only positive shaded quantities (`i < numerator ? 'shaded' : 'unshaded'`). When presented with $\frac{4}{7}$ and $\frac{1}{7}$, it renders two independent static shaded bars side-by-side. The renderer has:
     - No visual encoding for removal or takeaway (no cross-out hatching, no dimming of removed segments, no negative motion).
     - No visual encoding for comparison / difference (no alignment bracket showing the $3$-segment discrepancy between $4$ and $1$).
     - The visual model represents two additive quantities $4/7$ and $1/7$, completely misrepresenting subtraction as two co-present addends.
- **What is Missing Before Reuse Is Demonstrated:**
  1. A resolved visual interaction motif for fraction-bar subtraction (see Section 5).
  2. Subtraction-specific instructional strings and input labels in `src/render/strings.js`.
  3. Dynamic prompt dispatch in `beat-container.js` keyed on `scene.meaning.operation.operation === 'subtract'`.

---

### Family 3: Nested-Denominator Addition (e.g., $\frac{1}{2} + \frac{3}{8} = \frac{7}{8}$)

- **Classification:** **Needs a New Beat** (Asymmetric Renaming)
- **Math Core Status:** Complete. `validateCommonDenominator` and `validateEquivalentFraction` accurately evaluate LCD $8$ and single renaming $\frac{1}{2} \times \frac{4}{4} = \frac{4}{8}$.
- **Content Model Status:** Complete. Structural selector `nested-denominator-addition` in `src/content/family-definitions.js:57-68` enforces `one-canonical-renaming` (`renaming-count: 1`). Golden fixture `curated-nested-addition` exists in `src/content/data/phase1-golden-cases.js:75-87`.
- **Interaction & Grammar Analysis:**
  - In nested addition, one denominator divides the other ($2 \mid 8$). The canonical LCD is the larger denominator ($8$).
  - **The Grammar Gap:** In `src/interaction/episode.js:58-67`, the `transform` beat is hardcoded as an immutable two-step sequence:
    ```javascript
    if (beat === 'transform') {
      const side = state.established.conversions.left === null ? 'left' : 'right';
      ...
    }
    ```
    And in `applyTransform` (`src/interaction/episode.js:410-440`), after the learner renames the left operand ($\frac{1}{2} \to \frac{4}{8}$), the engine forces a second transform beat with `target: 'right'`.
  - For $\frac{3}{8}$, no renaming is needed. Forcing the learner to enter $\frac{3}{8} = \frac{3}{8}$ with scale factor $1$ contradicts classroom instruction, violates cognitive economy, and misleads the child into believing both fractions always change.
  - Furthermore, Roadmap §28 names Episode 4: *"determine which fraction needs renaming"*. In nested addition, recognizing *which* fraction stays unchanged is the central conceptual hurdle. The current grammar possesses no beat or control to make this determination.
- **Refusal Witness (Captured):**
  1. **Episode Construction Rejection:**
     Calling `createEpisode({ instance })` with `curated-nested-addition` throws:
     `EpisodeConstructionError: content instance is outside the Phase 2 episode family (code: UNSUPPORTED_CONTENT_FAMILY)` at `src/interaction/episode.js:155`.
  2. **State Machine Forced Redundancy:**
     Attempting to complete `transform` on `curated-nested-addition` forces `state.established.conversions.right` to demand an equivalent fraction input for $\frac{3}{8}$ with target denominator $8$.
- **What is Missing Before Reuse Is Demonstrated:**
  1. Support for asymmetric renaming in `src/interaction/episode.js`: either a preliminary beat where the learner selects which operand needs renaming, or an automatic bypass of `transform` for the operand already expressed in the target denominator.
  2. Registration of `nested-denominator-addition` in `src/interaction/episode-definition.js`.
  3. Authored reflection choices / premise check fixtures in `src/content/data/`.

---

### Family 4: Nested-Denominator Subtraction (e.g., $\frac{5}{6} - \frac{1}{3} = \frac{3}{6} = \frac{1}{2}$)

- **Classification:** **Needs a Representation the Bar Cannot Give** (combines Asymmetric Renaming with Subtraction Representation Deficit)
- **Math Core Status:** Complete. Exact arithmetic and step validation handle $\frac{5}{6} - \frac{2}{6} = \frac{3}{6}$.
- **Content Model Status:** Complete. Selector `nested-denominator-subtraction` in `src/content/family-definitions.js:69-81` enforces `one-canonical-renaming` and `nonnegative-result`. Golden fixture `curated-nested-subtraction-reducible` exists in `src/content/data/phase1-golden-cases.js:88-100`.
- **Interaction & Grammar Analysis:**
  - Compounds all defects of Family 2 (subtraction strings mismatch, inability of `fraction-bar.js` to depict takeaway or difference) with the defect of Family 3 (forcing unnecessary conversion on the operand that already has denominator $6$).
- **Refusal Witness (Captured):**
  1. `EpisodeConstructionError: content instance is outside the Phase 2 episode family (code: UNSUPPORTED_CONTENT_FAMILY)` at `src/interaction/episode.js:155`.
  2. `src/render/fraction-bar.js` renders two static shaded bars ($5/6$ and $1/3$) with no visual subtraction semantics.
- **What is Missing Before Reuse Is Demonstrated:**
  1. Subtraction visual interaction model for fraction bars.
  2. Asymmetric transformation logic in episode state machine.
  3. Subtraction copy in `src/render/strings.js`.

---

### Family 5: Shared-Factor Unlike Denominators (e.g., $\frac{1}{6} + \frac{3}{8} = \frac{13}{24}$)

- **Classification:** **Plausible Reuse**
- **Math Core Status:** Complete. Exact arithmetic correctly calculates $\operatorname{LCD}(6, 8) = 24$, distinct from the denominator product $48$. `validateCommonDenominator` validates $24$ as `valid-least` and $48$ as `valid-non-least`.
- **Content Model Status:** Complete. Structural selector `shared-factor-addition` in `src/content/family-definitions.js:82-93` enforces `both-canonical-renamings` (`renaming-count: 2`). Golden fixture `curated-shared-factor-addition` exists in `src/content/data/phase1-golden-cases.js:103-115`. Both denominators ($6, 8$), the LCD ($24$), and scale factors ($4, 3$) conform to DECISION-011 presentation ceilings ($\text{LCD} \le 30, \text{scale factor} \le 12$).
- **Interaction & Grammar Analysis:**
  - Structurally identical to `relatively-prime-addition`:
    - `encounter`: Both fractions displayed.
    - `notice`: Parts are different sizes.
    - `decide`: Learner chooses common denominator from candidate options ($24, 48$).
    - `transform`: Left fraction renamed ($\frac{1}{6} \to \frac{4}{24}$); right fraction renamed ($\frac{3}{8} \to \frac{9}{24}$).
    - `operate`: Numerators combined ($4 + 9 = 13$).
    - `resolve`: Settled as $\frac{13}{24}$.
    - `reflect`: Visual matching choice.
- **Why Not Demonstrated Reuse:**
  - `assertInstance` in `src/interaction/episode.js:153-156` explicitly rejects selector `shared-factor-addition`, throwing `EpisodeConstructionError('UNSUPPORTED_CONTENT_FAMILY')`.
  - `src/content/data/reflection-choices.js` and `src/content/data/premise-checks.js` contain authored data **only** for fixture `curated-relatively-prime-addition-non-least`. Running `curated-shared-factor-addition` with reflection enabled fails in `classifyReflectionResponse` with `invalid-reflection-choice`.
- **What is Missing Before Reuse Is Demonstrated:**
  1. Add `shared-factor-addition` to allowed selectors in `src/interaction/episode-definition.js`.
  2. Author reflection matching choices for denominator $24$ in `src/content/data/reflection-choices.js`.
  3. Wire problem selection or entry-page launcher to deliver this instance.

---

### Family 6: Relatively Prime Unlike Denominators (e.g., $\frac{2}{3} + \frac{1}{4} = \frac{11}{12}$)

- **Classification:** **Demonstrated Reuse**
- **Math Core Status:** Complete and verified across 10,000 randomized property tests.
- **Content Model Status:** Complete. Canonical fixture `curated-relatively-prime-addition-non-least` (`2/3 + 1/4`, LCD 12, alternate 24) is fully validated.
- **Interaction & Grammar Analysis:**
  - Fully implemented, verified, and accepted in `plan-09`.
- **Executable Current Path (Plan-14 Route Matrix Shape):**
  - **Behavior:** Complete learner progression through all 6 operational beats to successful resolution.
  - **Configuration:** `phase2-bundle-1` (or `phase2-bundle-2`, `phase2-bundle-3`), `supportLevel: 'high support'`, `presentationMode: 'standard-motion'`.
  - **Starting Surface:** Application entry page (`src/app/`) mounted at `#app-root`.
  - **Action Sequence:**
    1. Click `#app-start-btn` ("Start practice") $\to$ transitions to episode encounter beat.
    2. Click `.control-btn` ("Next") $\to$ transitions to notice beat.
    3. Click button with label "No, different sizes" $\to$ transitions to decide beat.
    4. Click button with label "12" $\to$ transitions to transform beat (left operand).
    5. Input "8" into `#transform-num-input-left` and submit $\to$ transitions to transform beat (right operand).
    6. Input "3" into `#transform-num-input-right` and submit $\to$ transitions to operate beat.
    7. Input "11" into `#operate-sum-input` and submit $\to$ transitions to resolve beat.
    8. Click `.control-btn` ("Next Problem") $\to$ concludes episode.
  - **Observable Output:** Status text announces `"You finished this problem."`, milestone summary lists all completed steps, and symbolic row displays $\frac{8}{12} + \frac{3}{12} = \frac{11}{12}$.
  - **Negative Control:** Submitting invalid denominator $10$ displays recovery prompt; submitting wrong equivalent numerator $7$ displays recovery prompt without advancing.

---

### Family 7: Results Crossing One Whole (e.g., $\frac{7}{8} + \frac{3}{8} = \frac{10}{8}$)

- **Classification:** **Needs a Representation the Bar Cannot Give**
- **Math Core Status:** Complete. `src/math/mixed-number.js` carries exact composition, decomposition, and regrouping classification (`crossesWhole: true`, `resultForm: 'improper'`).
- **Content Model Status:** Complete. Overlay `crosses-one-whole` is fully defined in `src/content/family-definitions.js:143-149`. Golden fixture `curated-like-addition-crossing-reducible` (`7/8 + 3/8 = 10/8`) is an accepted golden case in `src/content/data/phase1-golden-cases.js:33-45`.
- **Interaction & Grammar Analysis:**
  - The mathematics and content are ready; the renderer is completely incapable of drawing any fraction where $\text{numerator} > \text{denominator}$.
  - This is **OQ-20**, the central load-bearing design question of Phase 3.
- **Refusal Witness (Captured directly from commit `199c104`):**
  1. **Loud Guard Failure in Fraction Bar Renderer:**
     Executing `createFractionBarRenderer({ side: 'left', container }).mount(scene)` where `currentForm` is $\{ \text{numerator: '10'}, \text{denominator: '8'} \}$ throws:
     ```text
     TypeError: fraction bar form is outside the supported bar range
         at render (src/render/fraction-bar.js:91:13)
         at Object.mount (src/render/fraction-bar.js:343:7)
     ```
  2. **Loud Guard Failure in Matching Choice Renderer:**
     Executing `createVisualMatchingChoice` with form $\{ \text{numerator: '10'}, \text{denominator: '8'} \}$ throws:
     ```text
     TypeError: matching choice fraction form is outside the supported bar range
         at formNumbers (src/render/matching-choice.js:14:11)
     ```
  3. **Silent Corruption Failure (If Guard Were Removed):**
     Executing `createTrackAndReadout({ numerator: 10, denominator: 8 })` (`src/render/fraction-bar.js:17-61`) directly demonstrates the failure that prompted `plan-09` Repair 02:
     - The function loops `for (let i = 0; i < denominator; i++)`, creating exactly **8 segment elements**.
     - Because `i < 10` is true for all 8 segments, all 8 receive `.shaded`.
     - Output: Exactly 8 shaded segments out of 8, while the numerical readout displays `10 / 8`.
     - **Result:** The visual rendering is byte-identical to $\frac{8}{8}$ (one full whole). The renderer lies to the learner, collapsing an improper fraction greater than one into a single full unit.
- **What is Missing Before Reuse Is Demonstrated:**
  - Full architectural resolution of OQ-20, implementing a multi-whole bar presentation (see [`crossing-one-whole.md`](crossing-one-whole.md)).

---

### Family 8: Simplification (e.g., $\frac{1}{6} + \frac{3}{6} = \frac{4}{6} = \frac{2}{3}$, or simplify-first $\frac{2}{4} + \frac{1}{2}$)

- **Classification:** **Needs a New Beat** (for Learner Agency) / **Needs a Representation the Bar Cannot Give** (for Reverse Subdivision)
- **Math Core Status:** Complete. `simplifyFraction` in `src/math/fraction.js` computes canonical reduced forms via Euclidean GCD.
- **Content Model Status:** Complete. Overlay `reducible-result` is defined in `src/content/family-definitions.js:137-142`. Golden fixtures `curated-like-addition-reducible` ($4/6 \to 2/3$) and `curated-simplify-first-state` ($2/4 \to 1/2$) exist.
- **Interaction & Grammar Analysis:**
  - In the shipped Phase 2 slice, simplification is entirely passive.
  - In `src/render/beat-container.js:450-462`, when `rawResult` is reducible, `resolve` renders `strings.resolve.unsimplifiedNotice`:
    `"4/6 is correct! It can also be written as 2/3."`
  - The learner never simplifies. The learner is a spectator to simplification.
  - If Roadmap §27's inclusion of "simplification" means learner practice in simplifying fractions, this requires a distinct **Simplify Beat** (`operate → simplify → resolve`) where the learner identifies common factors and predicts the reduced form.
- **Refusal Witness (Visual Representation of Simplification):**
  - In `src/render/fraction-bar.js:17-61, 329-335`, the bar supports only forward subdivision (`isSubdivided: true`), splitting larger segments into smaller ones.
  - The renderer has no mechanism, animation, or CSS classes to demonstrate **reverse subdivision** (grouping multiple smaller segments into a larger unit, e.g., merging four sixths into two thirds). Calling the renderer with a simplified form simply replaces the DOM elements instantly without visual connection to the unsimplified predecessor.
- **What is Missing Before Reuse Is Demonstrated:**
  1. An interactive Simplify beat with dedicated learner responsibilities, prompts, and classification.
  2. Visual grouping / partition-merging support in `fraction-bar.js`.

---

## 4. Comprehensive Audit of Roadmap §28 Focused Concept Episodes

Roadmap §28 specifies six targeted episodes designed to isolate key fraction concepts without the cognitive overhead of a full seven-beat operation.

```
+---------------------------------------------------------------------------------------------------+
|                            Roadmap §28 Focused Concept Episodes                                   |
+---------------------------------------------------------------------------------------------------+
| 1. construct an equivalent fraction        | 4. determine which fraction needs renaming           |
| 2. identify a valid common denominator     | 5. determine whether a result should exceed one      |
| 3. identify the least common denominator   | 6. simplify an equivalent result                     |
+---------------------------------------------------------------------------------------------------+
```

---

### Episode 1: Construct an Equivalent Fraction

- **Classification:** **Plausible Reuse**
- **Instructional Focus:** Given a fraction (e.g. $\frac{2}{3}$) and a target denominator ($12$), find the equivalent numerator ($8$) with visual subdivision grounding.
- **Grammar & Code Evaluation:**
  - This is an exact extraction of the `transform` beat from `src/render/beat-container.js:386-423` and `src/interaction/classification.js:122-155` (`classifyConversionResponseForEpisode`).
  - The interaction controls (`createNumericInput`), prompt strings (`strings.transform.equivalentNumeratorPrompt`), and visual subdivision animation (`fraction-bar.js:37-40`) are fully functional.
- **Why Not Demonstrated Reuse:**
  - In the codebase today, `transform` cannot exist independently. It exists only as beat 4 of a full addition episode.
  - `src/interaction/episode-definition.js` contains only `phase-2-unlike-proper-addition` with all 7 beats mandatory.
  - Instantiating an episode without `left` and `right` operands throws `TypeError` during `operands(instance)` in `src/interaction/classification.js:70-75`.
- **What is Missing:** A standalone 3-beat episode definition (`encounter → transform → resolve`) and a single-fraction content instance schema.

---

### Episode 2: Identify a Valid Common Denominator

- **Classification:** **Plausible Reuse** (with Distractor Generation)
- **Instructional Focus:** Given two unlike fractions (e.g. $\frac{1}{4}$ and $\frac{1}{6}$), choose a denominator that works for both from a set containing valid numbers and invalid distractors.
- **Grammar & Code Evaluation:**
  - Math validation `validateCommonDenominator` in `src/math/step-validation.js` classifies any proposed denominator as `valid` or `invalid-common-denominator`.
  - In `src/render/beat-container.js:340-384`, `decide` renders candidate buttons or numeric input.
- **Why Not Demonstrated Reuse:**
  - As diagnosed in `reports/orchestration/phase-2-unreachable-mechanisms.md`, the current button path presents **only valid candidates** ($12$ and $24$ for $2/3 + 1/4$). The learner cannot choose an invalid denominator from buttons.
  - If rendered as a multiple-choice concept episode, it requires authored or generated distractor options (e.g., $8, 10, 18$). No distractor generator exists for common denominators.
- **What is Missing:** Common denominator distractor generation and an isolated 3-beat episode state machine (`encounter → decide → resolve`).

---

### Episode 3: Identify the Least Common Denominator

- **Classification:** **Needs a New Beat**
- **Instructional Focus:** Given two fractions with shared factors (e.g. $\frac{1}{6}$ and $\frac{1}{8}$), specifically identify the *least* common denominator ($24$) rather than a non-least common multiple ($48$).
- **Grammar & Code Evaluation:**
  - In `src/math/step-validation.js`, `validateCommonDenominator` classifies candidates into `valid-least` versus `valid-non-least`.
  - In `src/render/strings.js:45-50`, distinct copy exists: `validLeast` ("the smallest one") and `validNonLeast` ("both fractions can use it").
- **The Gap:**
  - In the current `decide` beat (`beat-container.js:340-384`), selecting a non-least valid denominator ($24$ for $2/3 + 1/4$) **advances the episode without comment**. The learner is never prompted to seek the least denominator.
  - A focused episode on LCD requires a distinct instructional contract: selecting a non-least common denominator must return a specific pedagogical feedback beat ("$48$ works, but can you find a smaller number?") rather than treating it as fully settled.
- **What is Missing:** A two-tier classifier distinguishing acceptable vs optimal common denominators and dedicated instructional strings.

---

### Episode 4: Determine Which Fraction Needs Renaming

- **Classification:** **Needs a New Beat**
- **Instructional Focus:** Given two fractions (e.g. nested $\frac{1}{2}$ and $\frac{3}{8}$, or like $\frac{1}{5}$ and $\frac{2}{5}$), determine whether the first, second, both, or neither needs renaming.
- **Grammar & Code Evaluation:**
  - Math layer provides `countRenamingsRequired` in `src/math/step-validation.js`.
  - Content model provides `renaming-count` ($0, 1$, or $2$) in `src/content/family-definitions.js`.
- **The Gap:**
  - Zero UI, zero strings, and zero state machine transitions exist for this question.
  - `notice` asks only: "Do these two fractions have the same size parts? (Yes/No)".
  - An episode teaching this requires an entirely new prompt ("Which fraction needs new parts?") and a 4-option control ("First fraction", "Second fraction", "Both fractions", "Neither fraction").
- **What is Missing:** A newly authored interaction beat and associated response classifier.

---

### Episode 5: Determine Whether a Result Should Exceed One

- **Classification:** **Needs a New Beat** (Estimation / Benchmark Notice)
- **Instructional Focus:** Given two fractions (e.g. $\frac{2}{3} + \frac{3}{4}$), predict whether the sum will be greater than, less than, or equal to $1$ whole before calculating.
- **Grammar & Code Evaluation:**
  - Interaction Grammar §4 names this explicitly as an intended Notice beat variant:
    `"- Is the answer likely to be greater than one?"`
  - Math layer computes `crossesWhole: true` in `src/math/mixed-number.js`.
- **The Gap:**
  - The current `notice` beat (`src/render/beat-container.js:320-337`) is hardcoded to unit equality: "Do these two fractions have the same size parts?".
  - The bar renderer can display the two addends ($\frac{2}{3}$ and $\frac{3}{4}$), allowing visual benchmark reasoning (both are $> 1/2$, so their sum $> 1$).
  - However, no state machine intent, classification kind, or prompt exists to handle benchmark estimation.
- **What is Missing:** A benchmark-estimation variant of the Notice beat with ternary choice options ($< 1, = 1, > 1$).

---

### Episode 6: Simplify an Equivalent Result

- **Classification:** **Needs a New Beat**
- **Instructional Focus:** Given an unsimplified fraction (e.g. $\frac{4}{6}$), actively determine its simplest form ($\frac{2}{3}$).
- **Grammar & Code Evaluation:**
  - Math layer `simplifyFraction` and `validateEquivalentFraction` provide exact validation.
  - Content fixtures `curated-like-addition-reducible` and `curated-simplify-first-state` supply test instances.
- **The Gap:**
  - As detailed under Family 8, current simplification is 100% passive in the `resolve` beat.
  - An episode dedicated to simplification requires an active prompt ("Write this fraction in simplest form"), input controls for simplified numerator/denominator, and factor guidance.
- **What is Missing:** Active simplification beat and interaction controls.

---

## 5. Honest Reach Limits: What the Grammar Does Not Cover

The founding vertical slice succeeded because it focused relentlessly on one canonical path: unlike-denominator addition where both operands rename. Extending that grammar across Phase 3 requires acknowledging what it **cannot** do without structural evolution.

```
                   +-----------------------------------------------+
                   |      Canonical Phase 2 Vertical Slice Arc     |
                   | Both operands unlike, both renamed, add sum   |
                   +-----------------------+-----------------------+
                                           |
         +---------------------------------+---------------------------------+
         |                                 |                                 |
         v                                 v                                 v
   [ SUBTRACTION ]                 [ ASYMMETRIC ]                    [ MAGNITUDE > 1 ]
Operation removes or            Only 1 or 0 operands             Result exceeds frame;
compares; current grammar       renamed; current grammar         bar throws or corrupts;
hardcodes addition prompts      forces redundant 2-side          OQ-20 multi-whole bar
and combine semantics.          renaming conversions.            required.
         |                                 |                                 |
         +---------------------------------+---------------------------------+
                                           |
                                           v
                       [ HONEST REACH LIMITATION ]
              Cannot stretch without structural evolution.
```

### 1. Subtraction Semantics and Representation
- **The Limitation:** The grammar equates operation with combination. `strings.operate` commands the child to "Add the shaded parts together" and asks for "Total shaded parts".
- **The Unknown (Empirical Question):** How should a fraction bar represent subtraction?
  - *Option A (Takeaway):* Animate the removal or cross-hatching of segments from the minuend.
  - *Option B (Comparison):* Display both bars and highlight the difference between them with an inspectable bracket.
  - *Honesty Statement:* **We cannot know which representation is pedagogically effective for children without building and observing prototypes of both.** Asserting that one is superior in specification prose is guesswork. Phase 3 must treat this as an empirical design gate.

### 2. Asymmetric and Zero-Renaming Sequences
- **The Limitation:** The state machine assumes that finding a common denominator always requires transforming both operands.
- **The Remedy:** The episode state machine (`src/interaction/episode.js`) must be refactored from a fixed list of beats into a **data-driven beat schedule**, where the problem instance's `renamingCount` determines whether `transform` executes zero times, once, or twice.

### 3. The "One Stable Whole" Ceiling
- **The Limitation:** The fraction bar was designed as a closed interval $[0, 1]$. Any sum $> 1$ crashes the renderer with `TypeError` or silently produces corrupt output.
- **The Remedy:** This is resolved in [`crossing-one-whole.md`](crossing-one-whole.md).

---

## 6. Phase 2 Carried Debts & Interface with Phase 3

Phase 3 does not build in a vacuum; it directly inherits the unresolved debts and companion packets of Phase 2.

| Debt / Companion Packet | Status / Ownership | Interface with Phase 3 Scope |
|---|---|---|
| **OQ-19: Entry Page Front Door** | Owned by `plan-12` (DECISION-029) | **Direct Prerequisite.** The entry page is where the learner or reviewer selects practice types. Phase 3 problem families (e.g. "Adding with a sum above one") depend on `plan-12`'s front door to be reachable without code mutation. |
| **OQ-21: Like-Denominator Recovery Copy** | Identified in `plan-09` Repair 05 | **Direct Requirement for Family 1 & 2.** `src/render/strings.js` must be updated with authored copy for `expectedMatches === true` before like-denominator practice can pass acceptance. |
| **OQ-22: Lower-Support Premise Check** | Owned by `plan-13` (DECISION-030) | **Independent.** Enhances scaffold fading on connection-making tasks. Phase 3 consumes the resulting support levels but does not build the fading mechanism. |
| **Support Ladder Writer** | Owned by `plan-13` | **Direct Prerequisite for Lower Support.** `src/interaction/support.js` must receive a writer from the entry page gear menu so Phase 3 families can be exercised at medium and low support (e.g. numeric denominator input). |
| **Animated Subdivision (`D-01-A`)** | Owned by `plan-11` | **Orthogonal Presentation Layer.** Delivers the visual segment subdivision animation promised in Phase 2. Phase 3 problem families render via `D-01-A` in standard motion, falling back cleanly to instant subdivision in reduced motion. |

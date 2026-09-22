# OQ-20 Resolution Proposal: Representing Results Crossing One Whole

## Review Status

- **Status:** Proposal for owner review (`plan-10`).
- **Addresses:** Open Question **OQ-20** (`docs/open-questions.md`).
- **Roadmap Anchor:** Roadmap §17 ("Phase 2 Primary Representation"), §27 ("Results crossing one whole").
- **Critical Path Context:** The owner has explicitly stated the intention to offer **"adding with a sum above one"** as a first-class practice type on the entry page (`plan-12`). This is not a speculative edge case; it is a blocking requirement on the Phase 3 critical path.

---

## 1. The Core Tension: What Does "One Stable Whole" Mean?

Roadmap §17 establishes the foundational constraint for the visual model:

> *"The fraction bar should be the primary visual representation for the initial vertical slice.*
> *The bar should establish:*
> - *one stable whole;*
> - *current fractional units;*
> - *selected quantity;*
> - *meaningful subdivision;*
> - *invariant total quantity;*
> - *common units;*
> - *combination."*

In Phase 2, this contract was satisfied by bounding every fraction bar to the interval $[0, 1]$. The visual track was synonymous with the unit whole:
$$\text{Track Length} \equiv 1 \text{ Whole}$$

When an addition operation yields a sum exceeding one whole—such as $\frac{7}{8} + \frac{3}{8} = \frac{10}{8}$ or $\frac{2}{3} + \frac{3}{4} = \frac{17}{12}$—this simple equivalence breaks. The system faces a fundamental representational dilemma:

1. **Does "one stable whole" mean the *canvas frame* must always be exactly one bar?**
   If so, a quantity greater than one cannot exist on the screen without shrinking the visual unit size, violating the principle that fractional units maintain invariant physical length.
2. **Or does "one stable whole" mean the *unit of measure* is constant and unvarying?**
   If the unit of measure is constant, then just as representing the number $12$ in base-10 requires moving from one ten-rod to a ten-rod and two unit cubes, representing $\frac{10}{8}$ requires **one complete stable whole plus two additional eighths of a second stable whole**.

This proposal directly affirms interpretation (2): **"One stable whole" defines the immutable benchmark unit of measure.** To preserve unit invariance, the physical scale of one whole must never shrink to accommodate larger quantities. Instead, quantities $> 1$ must be represented using multiple stable wholes.

---

## 2. Evaluation of Candidate Representations

We evaluate three candidate visual representations for quantities where $\text{numerator} > \text{denominator}$ (bounded in Phase 3 addition to the range $(1, 2]$).

```
Candidate 1: Discrete Multi-Whole Stack (Recommended)
Whole 1 [■■■■■■■■] 8/8
Whole 2 [■■□□□□□□] 2/8
Total: 10 shaded eighths across 2 stable wholes. Unit size invariant.

Candidate 2: Continuous Extended Track (Rejected)
[■■■■■■■■|■■□□□□□□]
Track spans 0 to 2 wholes. Compressing into 360px shrinks unit size by 50%.

Candidate 3: Regrouped Whole Accumulator (Rejected for Phase 3)
[  1  ] + [■■□□□□□□] 2/8
Collapses first whole into solid tile. Destroys visual count of 10 eighths.
```

---

### Candidate 1: Discrete Multi-Whole Stack (Unit-Calibrated Separate Bars)

Each whole is rendered as an independent, identically-sized fraction bar container representing $[0, 1]$. When a quantity exceeds $1$, a second unit bar is rendered directly beneath the first, partitioned into the same denominator units.

For $\frac{10}{8}$:
- **Whole 1:** 8 equal segments, all 8 shaded ($8/8$).
- **Whole 2:** 8 equal segments, 2 shaded, 6 unshaded ($2/8$).
- **Readout:** Displays the cumulative improper fraction $\frac{10}{8}$ alongside the stack, with optional secondary grounding ($1 \text{ whole and } \frac{2}{8}$).

#### What it Preserves:
1. **Strict Unit-Scale Invariance:** An eighth in Whole 1, an eighth in Whole 2, and an eighth in the original addend bars have **identical physical pixel widths**. The child sees that eighths do not change size when added together.
2. **Direct Visual Count of Improper Fractions:** The learner can directly point to and count all ten shaded eighth-segments ($1, 2, 3, 4, 5, 6, 7, 8, 9, 10$). The visual truthfully depicts the improper fraction $\frac{10}{8}$.
3. **Preserves §17 Directly:** Every bar on screen is "one stable whole." Two bars mean two stable wholes.
4. **Natural Pedagogical Bridge to Mixed Numbers:** The visual grouping naturally demonstrates that $\frac{10}{8}$ is composed of $1$ completed whole bar and $\frac{2}{8}$ of the next bar, establishing the conceptual foundation for Phase 5 without imposing mixed-number arithmetic.

#### What it Costs:
1. **Vertical Screen Space:** Requires allocating vertical height for two bar tracks instead of one.
2. **Layout Coordination:** At the `operate` and `resolve` beats, managing screen space so addends and results do not crowd the viewport.

---

### Candidate 2: Continuous Extended Track with Boundary Divider

A single horizontal track whose visual width represents the extended interval $[0, 2]$, featuring a heavy vertical dividing rule at the $1.0$ mark.

For $\frac{10}{8}$:
A single bar divided into $16$ segments, with segments $1$ through $10$ shaded, and a prominent solid tick between segment $8$ and segment $9$.

#### What it Preserves:
1. **Continuous Linear Magnitude:** Depicts the sum as a single unbroken line segment.
2. **Dramatic Crossing Milestone:** Crossing the bold vertical threshold makes the transition beyond one whole visually striking.

#### What it Costs:
1. **Violates Unit Scale Invariance (Misconception Risk):** On a fixed-width mobile screen (360px), fitting a $2$-whole track into the available width requires scaling the whole down by $50\%$. An eighth in the result bar would be **half the physical width** of an eighth in the addend bar directly above it! This leads children to believe that adding fractions causes the pieces to shrink.
2. **Reflow & Accessibility Failure:** If the track does not scale down, it must extend to $\sim 480\text{px}$, forcing horizontal scrolling. This violates WCAG 2.2 SC 1.4.10 (Reflow) and destroys the calm, self-contained aesthetic mandated by DECISION-021.
3. **Severe Density at Higher Denominators:** For a sum like $\frac{13}{12} + \frac{5}{12} = \frac{18}{12}$, a continuous track across two wholes contains $24$ segments in $\sim 230\text{px}$, yielding segments under $10\text{px}$ wide—violating DECISION-025 and visual inspectability.

---

### Candidate 3: Regrouped Whole-Block Accumulator (Solid Tile + Remainder)

When the sum exceeds $1$, the completed whole ($8/8$) collapses into a solid unit block labeled "1", while the remaining fraction ($\frac{2}{8}$) is displayed in an active fractional bar beside it.

#### What it Preserves:
1. **Compact Footprint:** Uses minimal vertical and horizontal space.
2. **Direct Mixed-Number Modeling:** Directly mirrors mixed-number notation ($1\frac{2}{8}$).

#### What it Costs:
1. **Destroys the Improper Fraction Representation:** The child cannot visually verify or count the numerator $10$. They see $1$ block and $2$ segments, making the calculation $7 + 3 = 10$ visually disconnected from the picture.
2. **Violates Phase Boundaries:** Forces mixed-number regrouping and notation into Phase 3, contradicting Roadmap §24 (which explicitly excludes mixed numbers from early phases) and preempting Phase 5.

---

## 3. Stated Recommendation & Detailed Rationale

### Recommendation: Adopt Candidate 1 (Discrete Multi-Whole Stack)

Candidate 1 is the only representation that satisfies all founding architectural and pedagogical criteria:

1. **Mathematical Truthfulness:** It preserves length conservation. One eighth is always the same width anywhere on the screen.
2. **Pedagogical Alignment:** It enables the learner to count the improper fraction units directly ($10$ eighths), validating their symbolic addition before introducing mixed-number conversion.
3. **Calm Aesthetic:** It avoids horizontal scrolling, microscopic segment widths, or cluttered visual indicators.

---

## 4. 360px Mobile Viewport Layout Budget

DECISION-009 mandates responsive support down to a 360px viewport width (with reflow to 320px). DECISION-021 criterion 1 requires that the primary question and controls remain visible without competing chrome or unnecessary scrolling. Throughout Phase 2 and `plan-09`, geometry was measured against the project's two established reference viewports:
- **`360×740`**: Mobile viewport reference (e.g., standard Android/iOS phone).
- **`360×752`**: School Chromebook / compact tablet reference.

*(Note: An arbitrary 640px height has no standing in repo decisions or acceptance records; reference viewports are 740px and 752px).*

### Measured Baseline at the `operate` Beat

In the running deployed application at commit `199c104`, measured at the `operate` beat on a 360px viewport:
- **Submit button bottom edge:** **541px**
- **Page scroll height:** **905px**
- **One fraction bar height:** **47px** (track + readout container + vertical margins; the initial sketch assumed 40px)
- **Baseline clearance to 740px fold:** $740\text{px} - 541\text{px} = \mathbf{199\text{px}}$
- **Baseline clearance to 752px fold:** $752\text{px} - 541\text{px} = \mathbf{211\text{px}}$
- *(Baseline clearance to an unstated 640px height: $640\text{px} - 541\text{px} = 99\text{px}$)*

Crucially, the 541px baseline already carries all active chrome of the running episode:
1. Header / title element (`#app-header` / footer arrangement per `plan-09` Repair 01)
2. Milestone context line (`.milestone-line`)
3. The "Show previous steps" / completed-beats disclosure section (`.completed-beats-section`)
4. Two rendered addend bars (Left: 47px, Right: 47px)
5. Symbolic row with equals sign and question box (`.render-symbolic-section`)
6. Active `operate` prompt ("Add the shaded parts together.")
7. Numeric input field and Submit button (`#operate-sum-input`, `.control-btn`)
*(The remaining 364px to the 905px scroll height comprises the help/replay footer and app bottom chrome below the fold).*

### Delta Added by Candidate 1 Design

For results crossing one whole ($\text{numerator} > \text{denominator}$), Candidate 1 renders a second unit whole bar:
- **Second whole bar:** **47px** (measured height matching the primary bar)
- **Inter-bar gap:** **8px**
- **Added vertical delta:** $47\text{px} + 8\text{px} = \mathbf{55\text{px}}$

#### Without Mitigation:
If the second whole bar is added directly below the existing visual model without adjusting the addend bars:
- Submit button bottom edge moves from $541\text{px} \to 541\text{px} + 55\text{px} = \mathbf{596\text{px}}$.
- **Clearance to 740px fold:** $740\text{px} - 596\text{px} = \mathbf{144\text{px}}$.
- **Clearance to 752px fold:** $752\text{px} - 596\text{px} = \mathbf{156\text{px}}$.
- *(Clearance to an unstated 640px height: $640\text{px} - 596\text{px} = 44\text{px}$).*

**The recommendation survives:** At 596px, the Submit button remains inside the fold for both reference viewports. However, claiming a "320px margin" was an idealized component sketch that omitted existing chrome. Stating clearance accurately rather than generously: the resting unmitigated margin is 144px at 740px and 156px at 752px. Furthermore, if richer choreography is active (such as `juxtaposed` or `sequential` replay, which adds comparison rows of 47px–112px per `plan-09` measurements), Submit can push to 701px–746px, severely eroding fold clearance.

### Required Mitigation: Collapsing Addend Bars at the Operate Beat

Because displaying two addend bars ($\sim 94\text{px}$) simultaneously with a two-whole result stack ($102\text{px}$) would accumulate four bars ($\sim 200\text{px}$ of visual elements), **collapsing the addend bars into the completed-beats summary section is REQUIRED, not optional.**

#### How the Required Mitigation Works:
1. Upon transitioning from `transform` to `operate`, the two individual addend bars (`left` and `right`) are dismounted from the active visual stage (`.fraction-bars-wrapper`).
2. They are collapsed into the inspectable completed-beats summary section (`.completed-beats-section`) as compact text milestone lines (e.g., `"First fraction: 7/8"`, `"Second fraction: 3/8"`, conforming strictly to DECISION-014 / Finding R6).
3. The active visual stage is dedicated exclusively to the **two-whole result stack** (Whole 1: 8/8, Whole 2: 2/8).

#### Measured Geometry with Required Mitigation Applied:
- **Retired elements:** Two addend bars ($47\text{px} \times 2 = 94\text{px}$) removed from the active stage.
- **Added elements:** Two result bars plus gap ($47\text{px} \times 2 + 8\text{px} = 102\text{px}$) mounted on the active stage.
- **Net active visual delta:** $102\text{px} - 94\text{px} = \mathbf{+8\text{px}}$.
- **Completed steps text delta:** Text milestone line added to completed-beats disclosure adds $\sim 24\text{px}$–$30\text{px}$.
- **Net Submit bottom position:** $541\text{px} + 8\text{px} + 26\text{px} \approx \mathbf{575\text{px}}$.
- **Verified clearance to 740px fold:** $740\text{px} - 575\text{px} = \mathbf{165\text{px}}$ ($\sim 22.3\%$ viewport margin).
- **Verified clearance to 752px fold:** $752\text{px} - 575\text{px} = \mathbf{177\text{px}}$ ($\sim 23.5\%$ viewport margin).
- *(Clearance to 640px height: $640\text{px} - 575\text{px} = 65\text{px}$).*

This makes Candidate 1 robust, calm, and spacious, ensuring that all interactive elements remain comfortably above the fold with verified margins under all reference conditions.

### Horizontal Dimensions (360px width, 16px lateral padding $\to$ 328px content):
- **Bar Track:** $232\text{px}$ wide.
- **Track Readout:** $80\text{px}$ wide, positioned to the right of the track (preserving `plan-09` Repair 02 layout).
- **Gap:** $16\text{px}$.
- **Sum:** $232 + 16 + 80 = 328\text{px}$ (exact fit).
- For denominator $8$: each segment is $232 / 8 = 29.0\text{px}$ wide.
- For maximum Phase 2 LCD ($30$): each segment is $232 / 30 = 7.73\text{px}$ wide. (Segments remain display-only per DECISION-025).

---

## 5. Accommodating vs. Foreclosing Mixed Numbers

A critical question is whether Candidate 1 accommodates mixed numbers or forecloses them:

- **It Fully Accommodates Mixed Numbers:**
  The visual structure of Candidate 1 is identical to the visual model required for mixed numbers in Phase 5:
  $$\text{Whole 1 (full)} + \text{Whole 2 (fractional)} \equiv 1 + \frac{2}{8} \equiv 1\frac{2}{8}$$
  When Phase 5 introduces mixed numbers, the exact same renderer component can be reused with zero architectural refactoring. It simply activates a mixed-number readout mode (`1 and 2/8`).

- **It Does Not Force Mixed Numbers in Phase 3:**
  In Phase 3, the primary learner-facing notation remains the **improper fraction** ($\frac{10}{8}$):
  1. The input field asks for the total count of eighths ($10$).
  2. The readout displays $\frac{10}{8}$.
  3. The resolve beat acknowledges the improper sum directly.
  4. An informational note in the resolve beat can calmly state: `"10/8 is 1 whole and 2/8"`, reinforcing visual intuition without requiring symbolic mixed-number computation.

---

## 6. Refusal Witness Summary

For completeness, the captured refusal witnesses from commit `199c104` are recorded here as the baseline evidence requiring this proposal:

1. `src/render/fraction-bar.js:86-92`:
   ```javascript
   if (!Number.isSafeInteger(numerator)
     || !Number.isSafeInteger(denominator)
     || numerator < 0
     || denominator <= 0
     || numerator > denominator) {
     throw new TypeError('fraction bar form is outside the supported bar range');
   }
   ```
   *Captured Exception:* `TypeError: fraction bar form is outside the supported bar range`.

2. `src/render/matching-choice.js:9-15`:
   *Captured Exception:* `TypeError: matching choice fraction form is outside the supported bar range`.

3. `src/render/fraction-bar.js:17-61` (without guard):
   *Captured Defect:* Renders exactly 8 segments for $10/8$, all shaded, producing a visual drawing identical to $8/8$ with numerical readout `10 / 8`.

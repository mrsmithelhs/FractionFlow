# Plan 37 — Annotated Interaction Flow: Bar-to-Number-Line Bridge

**Packet:** Plan 37 (`plan-37-first-number-line-and-bar-bridge-design`)  
**Task Candidate:** Candidate A — Same-Amount Placement on a 0-to-1 Bar-to-Line Bridge  
**Stage:** Design Specification (Non-Shipped Design Artifact)  
**Date:** 2026-10-18  

---

## 1. Overview and Core Instructional Arc

The bar-to-line bridge episode provides a calm, focused, and mathematically sound transition from an area/partition model (fraction bar) to a measurement/coordinate model (number line).

### The Instructional Arc (Beats)
The episode uses an immutable 3-beat sequence:
1. **`encounter`:** The learner is presented with a partitioned fraction bar $[0, 1]$ showing fraction $a/b$, and an aligned horizontal number line $[0, 1]$ directly underneath with identical horizontal start ($x_0$) and end ($x_1$) coordinates. Prompt: *"Where is this same amount on the number line?"*
2. **`locate`:** The learner selects a candidate position on the number line using two-step selection (preview candidate -> explicit `Check` button). No dragging is required. The target point is strictly withheld. If incorrect, the learner enters a local `recovery` loop with targeted directional guidance relative to benchmarks or bar extent.
3. **`resolve`:** Upon correct submission, the selected point is accepted. A vertical alignment guide links the bar's shaded right-edge to the number line coordinate, demonstrating: **length in the divided whole = location as a number**. The learner triggers `Next` to continue.

---

## 2. Visual Interaction States & Layouts

### Geometry & Coexistence Rule
- **Persistent Coexistence:** The fraction bar remains visible directly above the number line across all beats (`encounter` → `locate` → `resolve`).
- **Strict Geometric Alignment:** The bar's left boundary ($0$) and right boundary ($1$) align exactly with the number line's left tick ($0$) and right tick ($1$).
- **Zero Animation Dependency:** Position markers update instantaneously or with calm, non-blocking motion. Reduced-motion settings preserve the identical inspectable endpoints.

```
+========================================================================+
| FractionFlow: Bridge Practice                                          |
+========================================================================+
|  Question: Where is this same amount on the number line?               |
|                                                                        |
|  [Reference Bar: 3/4]                                                  |
|  x0                                                                 x1 |
|  +--------------------+--------------------+--------------------+-----+|
|  |     shaded         |     shaded         |     shaded         |open ||
|  +--------------------+--------------------+--------------------+-----+|
|  0                                                                   1 |
|                                                                        |
|  [Number Line: [0, 1]]                                                 |
|  x0                                                                 x1 |
|  |---------+----------|---------+----------|---------+----------|------|
|  0                                        1/2                          1
|  |                    |                    |                    |      |
|  +-- [Tick 0]         +-- [Tick 1]         +-- [Tick 2]  [Tick 3]      |
|                                                                        |
|  [ Preview: Point at step 3 of 4 equal steps ]    [ Check Position ]   |
+========================================================================+
```

---

## 3. Detailed Beat Walkthrough

### Beat 1: `encounter`
- **Instructional State:** `beat: 'encounter'`, `status: 'active'`.
- **Stimulus:**
  - Bar: Unit length $[0, 1]$, partitioned into $b$ equal cells, with $a$ cells shaded.
  - Number Line: Spanning $[0, 1]$ with identical pixel length $L = x_1 - x_0$.
  - High Support (`guided`): Shows all $1/b$ tick subdivisions with emphasized benchmark ticks at $0$, $1/2$, and $1$.
  - Medium Support (`prompted`): Shows only benchmark ticks at $0$, $1/2$, and $1$, plus discrete candidate selection points $\{p_1, p_2, \dots, p_k\}$.
- **Prompt:** `"Where is this same amount on the number line?"`
- **Initial Interactive State:**
  - No tick is pre-selected.
  - The `Check Position` button is rendered but disabled (`aria-disabled="true"`).
  - Focus is initially placed on the prompt container or the first selectable candidate marker.

---

### Beat 2: `locate` (Two-Step Selection & Preview)
- **Learner Actions:**
  - **Step 1 (Preview):** Learner taps a tick on mobile, clicks a tick button on desktop, or uses `ArrowLeft` / `ArrowRight` (or `Tab`) to navigate candidates.
    - The active candidate receives visual focus and a distinctive preview marker (e.g. a dashed highlight ring or pointer arrow).
    - Status readout announces the previewed position (without leaking whether it is correct).
    - The `Check Position` action button becomes enabled.
  - **Step 2 (Confirm):** Learner clicks `Check Position` or presses `Enter`.
- **Response Evaluation:**
  - Evaluated against exact mathematical truth: $x_{\text{selected}} = \frac{a}{b}$ via `compareFractions(selectedFraction, targetFraction) === 0`.
  - Floating-point coordinates never evaluate correctness.
- **Answer Withholding Invariant:**
  - Prior to confirmation, no color change (green/red), icon, or text indicates whether the previewed candidate is correct.

---

### Beat 2a: `recovery` (Incorrect Response)
- **Trigger:** Submitted point $x \neq a/b$.
- **State Transition:** Episode remains at `beat: 'locate'`; `lastRecovery` is recorded in provenance.
- **Visual Feedback:**
  - The submitted point displays an unpunishing neutral error marker (e.g., muted amber highlight, no harsh red or shaking).
  - The reference bar and number line remain fully visible and unchanged.
  - Target point is **NOT** revealed or drawn.
- **Directional Feedback Copy:**
  - **Case A: Under-estimate ($x < a/b$):**
    - If $x \le 1/2 < a/b$: `"This point is at or below 1/2, but the bar is more than 1/2. Look at where the shaded bar ends."`
    - If $x < a/b \le 1/2$: `"This point is too close to 0. Compare it to the length of the shaded bar."`
  - **Case B: Over-estimate ($x > a/b$):**
    - If $x \ge 1/2 > a/b$: `"This point is at or above 1/2, but the bar is less than 1/2. Look at where the shaded bar ends."`
    - If $x > a/b \ge 1/2$: `"This point is too close to 1. Compare it to the length of the shaded bar."`
- **Retry Action:**
  - Learner selects a different candidate; `Check Position` re-enables; learner resubmits.
  - Identity, task context, and problem parameters are strictly preserved.

---

### Beat 3: `resolve` (Correct Placement & Visual Bridge Alignment)
- **Trigger:** Submitted point satisfies `compareFractions(selectedFraction, targetFraction) === 0`.
- **State Transition:** Episode advances to `beat: 'resolve'`, `status: 'completed'`.
- **Visual Presentation:**
  - The selected point receives a confirmed solid marker.
  - A subtle vertical alignment dashed guide connects the right boundary of the bar's shaded area directly down to the number line coordinate:
    $$\text{Bar Right Edge } (x_0 + \frac{a}{b} L) \longleftrightarrow \text{Number Line Point } (x_0 + \frac{a}{b} L)$$
  - Resolution Banner:
    - Headline: `"Matched!"`
    - Bridge Explanation: `"The shaded bar and this point show the exact same amount: length from 0 equals location on the line."`
  - Next Action: `Next Problem` button is focused and enabled.

---

## 4. Linear & Accessible Parity Specification

The accessible alternative (rendered via semantic HTML in the DOM for screen readers and keyboard-only users) preserves the exact same mathematical decision without requiring visual dragging or announcing the fraction string $a/b$.

### Non-Equivalence Guard (Anti-Pattern Avoidance)
- **Do NOT** collapse candidates into a coarse 3-bucket quiz (`"less than 1/2"`, `"at 1/2"`, `"greater than 1/2"`). That fails to distinguish between two candidates on the same side of $1/2$ (e.g. distractor $1/4$ vs. target $3/8$).
- **Do NOT** read out the target fraction in the candidate label (e.g. `"Button: choose 3/8"`), which reduces mathematical reasoning to string matching.

### Accessible Candidate Structure

#### High Support (`guided` — Full $b$ Partitions)
Each selectable tick represents an exact step index along $[0, 1]$:
- Control: A group of radio buttons or sequential buttons within `<fieldset role="radiogroup" aria-label="Points on number line from 0 to 1">`.
- Spoken Labels (Screen Reader):
  - Index $k=0$: `"Point at 0 (start of line)"`
  - Index $0 < k < b$:
    - For $k/b < 1/2$: `"Point at step {k} of {b} equal steps from 0 to 1 (between 0 and 1/2)"`
    - For $k/b = 1/2$: `"Point at step {k} of {b} equal steps from 0 to 1 (exactly at 1/2)"`
    - For $k/b > 1/2$: `"Point at step {k} of {b} equal steps from 0 to 1 (between 1/2 and 1)"`
  - Index $k=b$: `"Point at 1 (end of line)"`

*Example for $b=4$, target $3/4$:*
1. `Step 1 of 4`: `"Point at step 1 of 4 equal steps from 0 to 1 (between 0 and 1/2)"`
2. `Step 2 of 4`: `"Point at step 2 of 4 equal steps from 0 to 1 (exactly at 1/2)"`
3. `Step 3 of 4`: `"Point at step 3 of 4 equal steps from 0 to 1 (between 1/2 and 1)"` (Target)

#### Medium Support (`prompted` — Sparse Benchmarks & Discrete Candidates)
Candidate points $\{p_1, p_2, \dots, p_k\}$ are ordered from left to right along $[0, 1]$:
- Control: `<fieldset role="radiogroup" aria-label="Candidate locations on number line from 0 to 1">`.
- Spoken Labels:
  - `"Candidate A: closer to 0 than to 1/2"`
  - `"Candidate B: just left of 1/2"`
  - `"Candidate C: exactly at 1/2"`
  - `"Candidate D: just right of 1/2"`
  - `"Candidate E: closer to 1 than to 1/2"`

*Example for target $3/8$ with distractors $2/8$ and $5/8$ on an 8-step underlying metric:*
- Candidate A ($2/8$): `"Candidate A: 2 of 8 equal steps from 0 to 1 (halfway between 0 and 1/2)"`
- Candidate B ($3/8$): `"Candidate B: 3 of 8 equal steps from 0 to 1 (between 0 and 1/2, closer to 1/2)"` (Target)
- Candidate C ($4/8$): `"Candidate C: 4 of 8 equal steps from 0 to 1 (exactly at 1/2)"`
- Candidate D ($5/8$): `"Candidate D: 5 of 8 equal steps from 0 to 1 (between 1/2 and 1, closer to 1/2)"`

### Keyboard Traversal Rules
- `Tab` / `Shift+Tab`: Moves focus between the candidate selection region, `Help` button, and `Check Position` / `Next` button.
- `ArrowLeft` / `ArrowRight` (or `ArrowUp` / `ArrowDown`): Steps linearly through the candidate points on the line. Focus ring is clearly visible (`outline: 3px solid #0056b3; outline-offset: 2px`).
- `Space` / `Enter`: Selects the focused candidate. Pressing `Enter` on `Check Position` submits the response.

---

## 5. Reduced-Motion Contract

Per Founding Quality §41 and Interaction Grammar §72:
- When `prefers-reduced-motion: reduce` is active:
  - Candidate selection indicator snaps immediately to the chosen tick coordinate without horizontal glide or tweening.
  - Confirmation of correct answer reveals the vertical alignment guide immediately with zero opacity fade or vertical drop-down animation.
  - Recovery feedback displays instantaneously without vibration or shake effects.
- The inspectable mathematical endpoints ($x_0, x_1$, selected point coordinate, and vertical connection) are identical in standard and reduced-motion modes.

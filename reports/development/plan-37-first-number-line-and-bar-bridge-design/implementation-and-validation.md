# Plan 37 — Implementation Roadmap and Validation Strategy

**Packet:** Plan 37 (`plan-37-first-number-line-and-bar-bridge-design`)  
**Task Candidate:** Candidate A — Same-Amount Placement on a 0-to-1 Bar-to-Line Bridge  
**Stage:** Design Specification (Non-Shipped Design Artifact)  
**Date:** 2026-10-18  

---

## 1. Implementation Packet Structure Recommendation

We recommend splitting future production implementation into **two serial, tightly bounded packets**:

### Packet 1: Core Bridge Engine & Scene Projection
- **Scope:** Pure logic, content records, state machine, and scene projection. Zero DOM mutation or CSS styling.
- **Deliverables:**
  - Authored bridge data records for the 8-item batch in `src/content/data/`.
  - Content eligibility update in `src/content/eligibility.js` scoped strictly to `bridge-number-line` tasks.
  - Episode definition in `src/interaction/episode-definition.js` (`phase-4-bar-to-line-bridge`).
  - Scene model projection in `src/interaction/scene.js` lifting refusal for the bounded bridge role.
  - Headless unit tests verifying state transitions, exact math evaluation, directional recovery, and immutable replay.
- **Verification:** Fast, deterministic Vitest suite running in Node with no browser dependencies.

### Packet 2: Visual & Accessible Renderers and App Mount
- **Scope:** Canvas-free SVG and DOM rendering, accessible linear path, touch hitboxes, and layout mounting.
- **Deliverables:**
  - New pure renderer module `src/render/number-line.js` (SVG track, benchmark ticks, candidate markers, alignment guide).
  - Integration into `src/render/beat-container.js` for persistent vertical coexistence directly below the fraction bar.
  - Accessible linear controls in `src/render/linear-path.js` with structured step descriptions.
  - Responsive CSS in `src/app/styles.css` ensuring $44 \times 44\text{px}$ touch targets at $360\text{px}$.
  - Mount bridge practice goal in `src/app/app.js` and `practice-types.js`.
  - Browser/DOM regression tests covering keyboard navigation, screen-reader markup, reduced-motion behavior, and touch geometry.

*Alternative Single-Packet Option:* If the owner prefers fewer orchestration handoffs, Packets 1 and 2 can be combined into one implementation packet provided it is strictly bounded to the 8-item curated batch and does not expand into a general representation framework.

---

## 2. Exact Future File Touch Map

| File Path | Planned Mutation | Boundary / Invariant Maintained |
|---|---|---|
| `src/content/eligibility.js` | Add `REPRESENTATION_ELIGIBILITY.ELIGIBLE` branch for bridge problem family; retain `NOT_IN_PHASE_2` for general arithmetic lines. | Arithmetic families continue to refuse number lines until Phase 4 arithmetic is authorized. |
| `src/content/data/bridge-records.js` *(new)* | Register the 8 curated seed records. | Exact BigInt fractions; frozen data. |
| `src/content/authored-content-catalog.js` | Materialize bridge records into validated content instances. | Reuses existing `validateContentInstance` pipelines. |
| `src/interaction/episode-definition.js` | Register definition `phase-4-bar-to-line-bridge/v1` with schedule: `encounter` → `locate` → `resolve`. | Reuses established schedule/intent grammar; no ad-hoc flow. |
| `src/interaction/scene.js` | Lift hard refusal for `number-line-bridge` role; project `meaning.numberLine` payload. | Pure deterministic projection; zero history arrays in scene. |
| `src/render/number-line.js` *(new)* | SVG line renderer with aligned horizontal coordinates ($x_0, x_1$), benchmark ticks, and $44\text{px}$ touch targets. | Pure DOM/SVG generator; consumes scene facts without computing math. |
| `src/render/beat-container.js` | Mount number line alongside bar in `#fraction-canvas-container`; wire two-step preview/confirm. | Bar remains persistently visible above line; zero drag dependency. |
| `src/render/linear-path.js` | Render accessible radio group with step/benchmark descriptions. | No premature announcement of $a/b$; no coarse 3-bucket collapse. |
| `src/render/strings.js` | Add bridge prompts, directional recovery strings, and alignment resolution copy. | Concise, child-friendly wording; no mathematical jargon. |
| `src/app/styles.css` | Add track container, alignment guide, and touch hitbox rules. | Vertical height fits in $360\text{px}$; $44\text{px}$ touch targets preserved. |
| `src/app/practice-types.js` | Add learner goal `"Bridge: Bars to Number Lines"` (optional staged activation). | Stage behind owner gate; do not disrupt existing goals. |
| `tests/number-line-bridge.test.js` *(new)* | Test complete headless lifecycle, recovery, exactness, and replay. | Proves all 8 items pass deterministically. |
| `tests/number-line-render.test.js` *(new)* | Test DOM layout, SVG geometry, 360px touch bounding boxes, and alignment. | Automated layout verification. |

---

## 3. Screen Geometry & CSS Budgeting

### Vertical Height Budget (Compact Viewports)
On school Chromebooks ($1366 \times 768$, often with browser toolbars leaving $\sim 600\text{px}$ vertical space) and mobile phones ($360 \times 640\text{px}$):

```
+-------------------------------------------------------+  0px
| Application Header & Practice Navigation              |  48px
+-------------------------------------------------------+
| Prompt Container: "Where is this same amount..."      |  48px
+-------------------------------------------------------+
| Reference Fraction Bar (Container Height: 56px)       |  56px
+-------------------------------------------------------+
| Vertical Spacing & Alignment Guide Region             |  24px
+-------------------------------------------------------+
| Number Line & Candidate Markers (Height: 72px)        |  72px
+-------------------------------------------------------+
| Action Region: [ Preview Readout ] [ Check Position ] |  48px
+-------------------------------------------------------+
| Recovery / Feedback Banner (Conditional)              |  48px
+-------------------------------------------------------+  Total: 344px
```
**Conclusion:** The entire interactive experience fits inside **$344\text{px}$ vertical height**, well within the $600\text{px}$ Chromebook floor and $640\text{px}$ mobile floor. No vertical scrolling is required.

---

### Label Collision Analysis
On a $312\text{px}$ track width at $360\text{px}$ viewport:
- Stacked fraction text (e.g. $\frac{1}{2}$, $\frac{3}{4}$) requires at least $28\text{px}$ width plus $8\text{px}$ padding = $36\text{px}$ horizontal clearance.
- If every tick on an 8-partition line ($\Delta x = 39\text{px}$) or 12-partition line ($\Delta x = 26\text{px}$) were permanently labeled with text:
  - At $b = 8$, labels would touch edges ($36\text{px}$ inside $39\text{px}$).
  - At $b = 12$, labels would overlap severely ($36\text{px}$ in $26\text{px}$).
- **Contract Collision Rule:**
  - **Permanent Visible Text Labels:** Restricted strictly to primary benchmarks: `0`, `1/2`, `1`.
  - **Subdivision Ticks:** Drawn as clean vertical tick marks without permanent fraction text.
  - **Selected / Previewed Position:** The numeric or descriptive label appears dynamically in the dedicated **Preview Readout box** directly above the `Check Position` button, completely eliminating on-line label collisions.

---

## 4. Intended-Failure Test Seeds (Invariants & Falsifiers)

To guarantee that future implementation tests are non-vacuous, the test harness must include the following failing-first witnesses:

| Invariant Tested | Intended-Failure Seed / Mutation | Expected Assertion Failure |
|---|---|---|
| **Exact Evaluation Invariant** | Mutate candidate evaluation to accept pixel rounding: target $3/8$ ($0.375$), candidate $0.380$ accepted. | **FAIL:** `assert(compareFractions(selected, target) === 0)` throws `ExactMathMismatchError`. Pixel proximity must never validate math. |
| **Answer Withholding Invariant** | Mutate renderer to apply `.target-highlight` or `aria-current="true"` during `encounter` or unconfirmed `locate`. | **FAIL:** Parity/leakage scan detects target fraction coordinate marked before learner confirmation. |
| **Zero Animation Invariant** | Mutate bridge to require a $1200\text{ms}$ CSS transition before enabling `Check Position`. | **FAIL:** Instant-test mode asserts controls are interactive immediately at `t = 0`. |
| **Touch Hitbox Invariant** | Mutate tick buttons on $360\text{px}$ viewport to width $30\text{px}$ with no touch padding. | **FAIL:** Geometry audit asserts all interactive element bounding boxes $\ge 44 \times 44\text{px}$. |
| **Endpoint Alignment Invariant** | Shift number line left margin by $10\text{px}$ relative to fraction bar. | **FAIL:** Alignment assertion `assert(bar.x0 === line.x0 && bar.x1 === line.x1)` throws `GeometryMisalignmentError`. |
| **Screen-Reader Parity Invariant** | Mutate linear path to group candidates into 3 coarse buckets (`"less than half"`, `"at half"`, `"greater than half"`). | **FAIL:** Parity audit detects that distractor $1/4$ and target $3/8$ produce identical screen-reader announcements. |

---

## 5. Retained Follow-Up Obligations, Observation Guide, and Phase Gates (§31 and §90)

### 5.1 Retained Open Obligations (Not Discharged by Plan 37)
1. **Multi-Whole Stack-to-Line Magnitude Bridge ($[0, 2]$):**
   - Retained on `docs/development/phase-3-follow-up-obligations.md`. A $[0, 1]$ first bridge task does not discharge crossing-one-whole transfer ($a/b > 1$ across `0`, `1`, `2`). Revisit only after the $[0, 1]$ line contract is implemented and validated.
2. **Larger-Denominator ($b > 8$) Line-Density Investigation:**
   - Because direct $1/b$ tick spacing at $360\text{px}$ drops to $31.2\text{px}$ ($b=10$) and $26.0\text{px}$ ($b=12$), this initial bridge bounds full-partitioned tasks to $b \in \{2, 3, 4, 6, 8\}$. Extending number-line tasks to $b \in \{10, 12\}$ or finer subdivisions remains a separate future investigation.

### 5.2 Observation Guide for a Possible Future Authorized Learner Study
Static rendering and automated DOM tests cannot prove conceptual transfer. If the owner separately authorizes a future learner observation study (with zero PII or analytics stored in this repository), observe:
1. **Length-to-Distance Connection vs. Blind Slot Counting:** Does the learner reference the right edge of the shaded bar and the $1/2$ benchmark, or do they count tick marks from $0$ while ignoring the bar's spatial extent (especially on unreduced items like $2/4$ or sparse-benchmark items)?
2. **Benchmark Anchoring on Odd Denominators ($b=3$):** On $1/3$ and $2/3$ (where $1/2$ does not fall on a partition tick), does the $1/2$ benchmark help learners place $2/3$ above half and $1/3$ below half, or does the extra tick at $1/2$ cause "extra-part" counting confusion (misreading 3rds + the $1/2$ tick as 4ths)?
3. **Two-Step Selection Ergonomics:** On $360\text{px}$ touch screens and keyboard navigation, do learners smoothly preview and confirm without accidental submissions or target collisions at $b=8$?

### 5.3 Enforcement of Roadmap Phase Gates (§31 and §90) and Owner Decisions
1. **No Premature Activation:** Plan 37 does not flip representation flags, register runtime goals, or modify production code.
2. **Phase 3 Bar-Stability Gate (§31):** Phase 3 exit requires confirming that fraction-bar interactions are coherent across both addition and subtraction (Plan 38 + unlike-denominator bar subtraction) before Phase 4 number-line source implementation begins.
3. **Number-Line Checkpoint (§90):** Answers §90 by anchoring the first number-line task to connecting bar length on $[0, 1]$ with coordinate distance from $0$ using `0`, `1/2`, and `1` benchmarks.
4. **Owner Adoption Decisions Required Before Source Packet Creation:**
   - Adopt **Candidate A (Same-Amount Placement on a $[0, 1]$ Bar-to-Line Bridge)** with persistent vertical bar-above-line coexistence and two-step selection (`select` $\to$ `Check Position`).
   - Adopt the **support-dependent density policy** (High Support: full $1/b$ ticks for $b \in \{2, 3, 4, 6, 8\}$ with staggered/stepper hit targets at $b=8$; Medium Support: sparse `0`, `1/2`, `1` benchmarks with discrete exact candidates).
   - Choose between the **2-packet serial implementation split** (Packet 1: pure content/state/scene/replay; Packet 2: renderers/app/routes) or a **single staged packet** with internal checkpoints, sequenced after Phase 3 bar subtraction and the §31/§90 gate review.

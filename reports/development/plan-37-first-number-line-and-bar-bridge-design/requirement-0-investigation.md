# Plan 37 Requirement 0 — Investigation, Inventory, Rival Falsification, and Scope Recommendation

**Stage:** Requirement 0 investigation and preflight gate only. This document records the codebase inventory, theoretical and pedagogical evidence, rival candidate falsification, and a proposed first-task scope. It does not adopt a pedagogical winner, authorize production code mutation, flip representation flags, or declare Phase 3 complete.

**Pinned source revision:** `b1f1b772cd14e62aa694eee4f63feaae670820c6` (clean HEAD baseline; working tree uncommitted edits from other plans remain untouched).

---

## 1. Finding

The FractionFlow architecture names number-line representation in its top-level types and contracts (`REPRESENTATION_ROLES`, `REPRESENTATION_VERDICT_KEYS`, `eligibility.numberLine`), but every active pipeline stage explicitly rejects it as `not-in-phase-2`. 

Specifically:
- In `src/content/eligibility.js`, `evaluateInstanceEligibility` returns `numberLine: 'not-in-phase-2'`.
- In `src/interaction/scene.js`, role `'number-line'` triggers a hard validation check requiring `'not-in-phase-2'` and projects an explicit `capability-refusal` with `status: 'not-in-phase-2'`.
- There is **zero number-line rendering implementation** in `src/render/`. No SVG line, tick generator, endpoint marker, or point-manipulation component exists.
- In `src/interaction/episode-definition.js`, all admitted episode definitions are addition/subtraction workflows centered on fraction bars and symbolic representations.
- App layout and styling in `src/app/` assume a single visual bar container (`#fraction-canvas-container`) or a linear alternative.

Consequently, introducing a number line is not a matter of toggling an existing feature flag or activating dormant code. It requires designing the smallest coherent addition to the `mathematical state → instructional state → presentation` pipeline, anchored to a distinct pedagogical purpose that bridges the learner's established bar-model intuition without causing cognitive overload or interface clutter.

---

## 2. Source and Evidence Inventory

| Subsystem / Area | Current artifact & precise location | What it establishes | Limits & Absence |
|---|---|---|---|
| **Exact Math Core** | `src/math/fraction.js` (`createFraction`, `numerator`, `denominator`, `compareFractions`, `equalFractions`, `areEquivalent`, `simplifyFraction`, `isFraction`, `isUnitFraction`, `isProperFraction`, `isZeroFraction`); `src/math/classify.js` (`classifyMagnitude`, `denominatorRelationship`, `operandsRequiringRenaming`, `analyzeOperands`, `validateOperationResult`); `src/math/validation.js` (`validateCommonDenominator`, `validateEquivalentFraction`). | Pure exact rational arithmetic using BigInt numerators and denominators. Deterministic equality, ordering, magnitude classification relative to benchmarks (0, 1/2, 1, 2), and reduction without floating-point errors. | Mathematical truth only; contains no geometry, tick placement, or coordinate mapping. Architectural Constraint #1 dictates that pixel geometry must never determine mathematical validity. |
| **Content Eligibility** | `src/content/eligibility.js` (`evaluateInstanceEligibility`, `evaluatePathEligibility`, `PHASE2_FRACTION_BAR_LIMITS`). | Evaluates common denominator paths and representation ceilings (`maxDenominator: 30`, `maxScaleFactor: 12`). Line 147 hardcodes `numberLine: REPRESENTATION_ELIGIBILITY.NOT_IN_PHASE_2`. | No number-line eligibility evaluator or capacity bounds exist. Number lines are strictly barred from active episode evaluation. |
| **Content Generator & Catalog** | `src/content/generator.js` line 147 (`numberLine: null` in representation facts); `src/content/family-definitions.js`; `src/content/authored-content-catalog.js`. | Defines arithmetic problem families (like/nested/shared-factor/coprime addition and subtraction) and deterministic seeds. | Families define arithmetic operations, not representation-bridge tasks. No authored number-line tasks, stimuli, or candidate items exist. |
| **Scene Model Projection** | `src/interaction/scene.js` lines 16, 28, 509–524 (`capabilityFor` refusal); `derivationContext`; `projectScene`. | Implements the pure, deterministic boundary from instructional episode state to renderable scene. Checks representation role eligibility; enforces that `'number-line'` returns a `capability-refusal`. | No scene semantics exist for number-line intervals, endpoints, ticks, position markers, or dual-representation alignment. |
| **Instructional Episode & Schedule** | `src/interaction/episode-definition.js`; `src/interaction/beat-schedule.js`; `src/interaction/episode.js` (`responseForEntry`, `assertDefinition`, `assertInstance`, `createEpisode`). | Immutable schedules governing learner beats (`encounter`, `decide`, `transform`, `operate`, `reflect`, `resolve`). Maps active beat to expected learner input. | All current episode schedules expect fraction-bar or symbolic responses. There is no schedule entry, prompt, or responsibility contract for placing or selecting a point on a line. |
| **Visual Render Layer** | `src/render/beat-container.js` (DOM mounting and beat lifecycle); `src/render/fraction-bar.js` (`renderFractionBar`, paired bars, stacked crossing bars); `src/render/controls.js`. | Canvas-free SVG and DOM rendering of partitioned rectangular fraction bars with stable unit extents $[0, 1]$ or $[0, 2]$. | No number-line rendering primitives exist in `src/render/`. There are no line coordinates, ticks, labels, draggable/clickable point markers, or bridge juxtaposition containers. |
| **Linear / Accessible Layer** | `src/render/linear-path.js`; `src/render/strings.js`. | Equivalent non-visual/screen-reader and keyboard representation for fraction bars and arithmetic steps. | Current strings and prompts are entirely bar- and equation-specific (e.g., "shaded parts out of N"). No linear equivalent exists for a number-line coordinate or distance decision. |
| **App Composition & Styles** | `src/app/app.js`; `src/app/styles.css`; `src/app/conditions.js`. | Root mounting, condition dispatch, high/medium support settings, reduced-motion preferences, and viewport sizing (responsive down to 360px). | Layout assumes a single active visual canvas container (`#fraction-canvas-container`). No layout rules exist for co-presenting a bar and a number line without exceeding mobile/Chromebook vertical viewports. |
| **Phase 3 Baseline & Decisions** | `docs/decision-log.md` DECISION-034 (schedule derivation), DECISION-039 (concise like-denominator), DECISION-042 (reusable compact task patterns), DECISION-044 (concise nested addition), DECISION-045 (subtraction takeaway). | Establishes design discipline: keep episodes concise, focus on one meaningful mathematical decision, eliminate decorative reflections, and preserve deterministic replay. | These decisions govern addition and subtraction with fraction bars. They do not define a number-line task or resolve representation switching. |
| **Founding Roadmap & Checkpoints** | `docs/founding/06-roadmap.md` §§31–37 (Phase 4), §90 (Decision Checkpoint — Before Number Lines); `docs/development/phase-3-follow-up-obligations.md`. | §31 requires bar stability review; §90 poses critical questions: what specific learning problem will the number line solve? What transfers warrant bridge episodes? §71 defines number-line exact state. | Emphasizes that number lines must not be added for mere visual variety or to satisfy a roadmap checkbox. Implementation remains separately gated behind Phase 3 review. |
| **Pedagogical Literature** | IES Practice Guide (2010); Siegler, Thompson & Schneider (2011); Hamdan & Gunderson (2017); Gunderson et al. (2019); Nuraydin et al. (2022); Fuchs et al. (2017). | Causal evidence supports number lines for fraction magnitude and seeing fractions as numbers. Gunderson (2019) highlights unidimensionality; Nuraydin (2022) warns that estimation training alone does not transfer to arithmetic. | Literature supports magnitude and measurement framing, but does NOT validate automatic scaffold fading, a specific FractionFlow gesture, or arbitrary denominator limits on screens. |

---

## 3. Rival-Design Table: Contrasting Three First Purposes

To ensure the number line has a distinct, necessary learning purpose rather than serving as visual decoration, we evaluate three rival candidates for the first number-line connection:

| Candidate First Purpose | Learning Purpose & Pedagogical Rationale | Discriminating Observation (What evidence distinguishes it) | Falsifying Condition (What would count against its suitability) |
|---|---|---|---|
| **Candidate A: Same-Amount Placement (Bar-to-Line Bridge)**<br>*(Recommended)* | Connects the fraction's amount in a divided whole (fraction bar) with its location as a number on a 0-to-1 line. The learner sees an established bar quantity and is asked: *"Where is this same amount on the number line?"* Anchored by stable benchmarks ($0, 1/2, 1$). | Learner actively connects the right-hand boundary of the shaded bar length to the identical distance from 0 on the number line. Errors reflect continuous magnitude estimation or partition reading rather than viewing the two representations as disconnected puzzles. | **Falsified if:**<br>1. Learners treat the number line solely as discrete tick-counting (whole-number bias / counting slots) rather than a continuous length from 0, ignoring the bar's spatial extent.<br>2. Co-presenting bar and line on compact viewports (360px mobile or 1366x768 Chromebooks) produces visual crowding and cognitive split-attention that obscures the alignment.<br>3. Learners can only solve the task when the target point is pre-highlighted or animated, demonstrating passive watching rather than mathematical connection. |
| **Candidate B: Benchmark Comparison & Direct Placement** | Focuses directly on magnitude without a preceding bar: given a fraction symbolically ($a/b$), the learner places it relative to benchmarks $0, 1/2, 1$ or decides whether it is greater/less than $1/2$ on a line. | Learner uses mental benchmarks (comparing numerator $a$ to $b/2$) to position the point, evidencing interior magnitude understanding independent of an area model. | **Falsified if:**<br>1. Without the bridge to the familiar fraction bar, learners with weak number sense resort to superficial whole-number heuristics (e.g. "gap thinking" or comparing numerators directly) without spatial grounding.<br>2. Fails to fulfill Roadmap §34 and §90, which specifically require establishing a representation bridge from the stable bar model before isolated number-line practice.<br>3. Reverts the system to an abstract symbolic testing mode rather than building on the visual foundation. |
| **Candidate C: Movement for an Operation (Addition / Subtraction)** | Models addition as forward displacement (jump) and subtraction as backward displacement on a number line, representing arithmetic as vector addition. | Learner interprets the second operand not as an isolated location, but as a directed distance/magnitude added to the first operand's position. | **Falsified if:**<br>1. Conflates *point as coordinate* with *distance as operand*. As Nuraydin et al. (2022) observed, introducing operational jumps before location is solid creates severe interference between the point identity and the interval length.<br>2. Prematurely leaps past Phase 4 §33–34 into multi-stage operational interaction before the single-point line contract is even specified or tested.<br>3. High visual and interactive complexity (rendering arrows, arcs, multi-step inputs) severely degrades accessibility, touch targets, and 360px screen budgets. |

### Epistemic Boundary and Uncertainty
Mechanical demonstration of a mockup (e.g. drawing an SVG line and animating a point) proves only that the browser can render geometry. It cannot prove that learners experience conceptual transfer or that the number line deepens magnitude comprehension. This uncertainty must remain explicit: **the learning effectiveness of Candidate A is a hypothesis to be tested under future authorized observation, not an established fact.**

---

## 4. Narrow Recommendation for Scope Confirmation

We recommend advancing **Candidate A: Same-Amount Placement (Bar-to-Number-Line Bridge)** as the single first-task candidate.

### Core Task Definition
- **Episode Character:** A calm, focused bridge task consisting of one meaningful learner decision:
  1. **Stimulus:** A single stable unit fraction bar $[0, 1]$ displaying an authored fraction $a/b$ with shaded parts.
  2. **Prompt:** Concise, familiar wording: *"Where is this same amount on the number line?"*
  3. **Display:** A horizontal number line $[0, 1]$ directly beneath the bar, featuring stable unit endpoints $0$ and $1$, and a distinct central benchmark at $1/2$. The bar and line have identical horizontal start $x_0$ and end $x_1$ coordinates.
  4. **Learner Action:** The learner chooses or marks the point on the number line corresponding to $a/b$ using two-step selection (preview candidate -> explicit Check/Confirm button).
  5. **Response Mechanism:** Selection among discrete, exact candidate ticks or keyboard/step positioning among exact rational divisions. No floating-point "pixel dragging" determines mathematical truth.
  6. **Answer Withholding:** The correct point is NEVER highlighted, colored, or announced before the learner submits their response.
  7. **Recovery & Help:** If an incorrect point is chosen, local recovery provides directional feedback relative to the benchmark $1/2$ or the target amount (e.g., *"This point is less than 1/2"* or *"Look at the length of the bar"*), allowing retry without resetting identity.
  8. **Resolution:** Upon correct submission, an alignment indicator confirms that the bar's shaded length and the line's position from 0 represent the exact same mathematical quantity.

### Bounded Domain
- **Unit Extent:** Strictly bounded to the single unit whole $[0, 1]$.
- **Denominators:** Small, highly legible denominators suitable for dense school Chromebook and mobile viewports: $\{2, 3, 4, 6, 8\}$. Avoids unreadable tick crowding.
- **Varied Magnitude Positions:**
  - Below half ($x < 1/2$): e.g., $1/4$, $1/3$, $3/8$.
  - Exactly at half ($x = 1/2$): e.g., $1/2$, $2/4$, $4/8$.
  - Above half ($x > 1/2$): e.g., $2/3$, $3/4$, $5/8$, $5/6$.
- **Explicit Multi-Whole Exclusion:** The separate obligation for multi-whole stack-to-line transfer ($[0, 2]$ crossing one whole) is explicitly deferred. It is retained on the follow-up register and is NOT discharged by this 0-to-1 design.

### Accessible Participation Parity
- **Non-Drag Keyboard & Touch:** Learner can navigate candidate positions using `ArrowLeft` / `ArrowRight` (or `Tab` across explicit candidate buttons) and confirm with `Enter` / `Space`. Touch targets maintain a minimum 44×44px hit area.
- **Linear / Screen-Reader Parity:** Screen-reader users must not be given a coarse 3-bucket quiz (which cannot distinguish two candidates on the same side of $1/2$) nor have the fraction string $a/b$ announced prematurely. Instead, each selectable candidate is announced with its exact structural step position and benchmark relationship:
  - High support ($b$ partitions): e.g., `"Point at step 2 of 4 equal steps from 0 to 1 (exactly at 1/2)"`, `"Point at step 1 of 4 equal steps from 0 to 1 (between 0 and 1/2)"`.
  - Medium support (discrete candidates): e.g., `"Candidate A: 2 of 8 equal steps from 0 to 1 (closer to 0 than to 1/2)"`, `"Candidate B: 3 of 8 equal steps from 0 to 1 (just left of 1/2)"`.
  This preserves the genuine location/distance decision without leaking the symbolic fraction answer $a/b$.

---

## 5. Dossier Structure (Under Plan 37)

The detailed design dossier within `reports/development/plan-37-first-number-line-and-bar-bridge-design/` comprises:
1. `requirement-0-investigation.md`: Inventory, rival falsifiers, and scope record (this document).
2. `annotated-flow.md`: Concrete visual and linear interaction states (Encounter, Locate/Select, Recovery, Correct, Finish) with exact copy and ASCII layout diagrams.
3. `design-contract.md`: Exact capability contract, support-dependent density comparison, 360px touch geometry calculation across $b \in \{2, 3, 4, 5, 6, 8, 10, 12\}$, full 8-item curated seed table with target fraction, shown bar, line domain $[0, 1]$, benchmark ticks, target coordinate, diagnostic distractors, recovery cue, and rationale; exact math mappings, scene model projection additions, response classification, and replay contract decoupled from Plan 38's v5.
4. `implementation-and-validation.md`: Screen geometry, Chromebook/360px CSS budgeting, label collision analysis, intended-failure test seeds, concrete recommendation on 1 or 2 implementation packets, exact file touch map, and how Roadmap §31 and §90 gates remain enforced.
5. `static-board.html`: An unbuilt, static HTML/SVG design probe illustrating the dual bar-to-line layout, 44×44px touch targets at 360px and 1024px, and error/recovery states.
6. `progress.md`: Formal implementer progress report with explicit Advisor Consultation disposition.

---

## 6. Orchestration Approval

*Requirement 0 Scope Approved on 2026-10-18 by Orchestration.*
Approved candidate: **Candidate A (Same-Amount Placement on a 0-to-1 Bar-to-Line Bridge)** with:
- Option 1 (Support-dependent density: high support full $1/b$ ticks with emphasized benchmarks; medium support sparse benchmarks with discrete candidates).
- Persistent vertical coexistence with identical horizontal endpoints ($x_0, x_1$).
- Two-step selection (preview candidate -> explicit Check button) with zero drag requirement.
- Structural screen-reader position descriptions distinguishing candidates without leaking $a/b$.
- Clean separation from Plan 38's concurrent `fractionflow.episode-replay/v5` work.

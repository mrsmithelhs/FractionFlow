# Plan 37 — Design Contract: Capability, Geometry, and Curated Batch

**Packet:** Plan 37 (`plan-37-first-number-line-and-bar-bridge-design`)  
**Task Candidate:** Candidate A — Same-Amount Placement on a 0-to-1 Bar-to-Line Bridge  
**Stage:** Design Specification (Non-Shipped Design Artifact)  
**Date:** 2026-10-18  

---

## 1. Mathematical Core Authority and Geometry Mapping

### Strict Unidirectional Principle
Per Architectural Constraint #1, all mathematical truth originates in `src/math/`. Screen coordinates, pixels, bounding boxes, and SVG attributes communicate mathematical truth; they **never** compute or validate it.

### Exact Mathematical State Definitions
- **Target Fraction ($q$):** Created via `createFraction(a, b)` in `src/math/fraction.js`, where $a \in \mathbb{N}_0$, $b \in \mathbb{N}^+$, $0 \le a \le b$.
- **Unit Domain:** Strictly $[0, 1]$. Endpoints are exact rational values:
  - $x_0 = \text{benchmarkFraction('zero')} = \frac{0}{1}$
  - $x_1 = \text{benchmarkFraction('one')} = \frac{1}{1}$
- **Benchmarks:**
  - $x_{\text{half}} = \text{benchmarkFraction('half')} = \frac{1}{2}$
- **Classification:** Evaluated via `classifyMagnitude(q)` in `src/math/classify.js`:
  - `relativeToZero`, `relativeToHalf`, `relativeToOne`
  - `benchmarkRegion` (`'exact-zero'`, `'between-0-and-half'`, `'exact-half'`, `'between-half-and-1'`, `'exact-one'`).
- **Response Correctness:** Evaluated via `compareFractions(candidate, target) === 0` (or `equalFractions(candidate, target)`).

### Geometry & Track Projection (Presentation Layer Only)
Given a track bounding length $L = \text{trackWidth}$ and track start pixel offset $X_{\text{start}}$:
- The coordinate of any rational fraction $\frac{n}{d} \in [0, 1]$ is:
  $$\text{pixelX}\left(\frac{n}{d}\right) = X_{\text{start}} + \left(\frac{n}{d}\right) \times L$$
- **Fraction Bar Geometry:**
  - Outer width: $L$
  - Shaded width: $\frac{a}{b} \times L$
  - Number of cells: $b$, each of width $w_{\text{cell}} = \frac{L}{b}$
  - Left edge: $X_{\text{start}}$, Right edge: $X_{\text{start}} + L$
- **Number Line Geometry:**
  - Track line: From $(X_{\text{start}}, Y_{\text{line}})$ to $(X_{\text{start}} + L, Y_{\text{line}})$
  - Endpoints: Tick at $X_{\text{start}}$ (labeled `0`) and tick at $X_{\text{start}} + L$ (labeled `1`)
  - Half Benchmark: Tick at $X_{\text{start}} + 0.5 \times L$ (labeled `1/2`)
  - Target Point: $(X_{\text{start}} + \frac{a}{b} \times L, Y_{\text{line}})$
- **Strict Endpoint Alignment Invariant:**
  $$\text{Bar.left} = \text{Line.left} = X_{\text{start}} \quad \text{and} \quad \text{Bar.right} = \text{Line.right} = X_{\text{start}} + L$$
  This ensures that horizontal length directly matches horizontal location from zero.

---

## 2. Support-Dependent Density & 360px Touch Geometry

### Support Level Comparison

| Dimension | High Support (`guided` / initial bridge) | Medium Support (`prompted` / benchmark-anchored) |
|---|---|---|
| **Line Subdivision** | Full $1/b$ interval tick marks drawn along the entire track $[0, 1]$. | Only primary benchmarks drawn ($0, 1/2, 1$). No full $1/b$ tick grid. |
| **Benchmark Emphasis** | Benchmarks $0, 1/2, 1$ are taller ($16\text{px}$ vs $8\text{px}$) with bold labels. | Benchmarks $0, 1/2, 1$ are prominent anchors. |
| **Candidate Selectors** | Every $1/b$ tick is an interactive candidate position (or selected via discrete stepper). | A vetted discrete set of 3 to 4 candidate markers $\{p_1, p_2, p_3, p_4\}$ placed on the line. |
| **Learner Cognitive Task** | Connect $a$ shaded parts of size $1/b$ in the bar directly to $a$ equal subdivision steps from $0$ on the line. | Estimate position by referencing the benchmark $1/2$ and the bar length, selecting the correct candidate among strategic distractors. |
| **Directional Recovery** | References both part count and $1/2$ benchmark. | References $1/2$ benchmark and relative distance from endpoints. |

---

### Detailed 360px Touch-Target Spacing Calculation

On a standard mobile viewport width of $360\text{px}$:
- Screen width: $360\text{px}$
- Application container horizontal padding: $16\text{px}$ left + $16\text{px}$ right = $32\text{px}$
- Canvas container padding: $8\text{px}$ left + $8\text{px}$ right = $16\text{px}$
- **Usable Track Length ($L$):** $360\text{px} - 48\text{px} = 312\text{px}$ (or $300\text{px}$ with $30\text{px}$ margins).
- WCAG 2.1 / 2.2 Success Criterion 2.5.5 / 2.5.8 requires touch targets of at least $44 \times 44\text{px}$ (or $24 \times 24\text{px}$ with sufficient spacing). FractionFlow commits to the calm, child-centered standard of **$44 \times 44\text{px}$ minimum**.

#### Interval Spacing Table across Denominators ($L = 312\text{px}$):

| Denominator ($b$) | Interval Width ($\Delta x = 312 / b$) | High-Support Per-Tick Target Fit ($\ge 44\text{px}$) | Collision Status & Architectural Solution |
|---|---|---|---|
| **$b = 2$** | $156.0\text{px}$ | **Pass** ($156\text{px} \gg 44\text{px}$) | No collision. Single row of buttons easily fits. |
| **$b = 3$** | $104.0\text{px}$ | **Pass** ($104\text{px} \gg 44\text{px}$) | No collision. Generous target separation. |
| **$b = 4$** | $78.0\text{px}$ | **Pass** ($78\text{px} \gg 44\text{px}$) | No collision. Clean separation. |
| **$b = 5$** | $62.4\text{px}$ | **Pass** ($62.4\text{px} \ge 44\text{px}$) | No collision. Ample spacing. |
| **$b = 6$** | $52.0\text{px}$ | **Pass** ($52.0\text{px} \ge 44\text{px}$) | Pass with $44\text{px}$ targets + $8\text{px}$ clearance. |
| **$b = 8$** | $39.0\text{px}$ | **FAIL** ($39.0\text{px} < 44\text{px}$) | **Collision:** Adjacent $44\text{px}$ buttons on a single row overlap by $5\text{px}$. |
| **$b = 10$** | $31.2\text{px}$ | **FAIL** ($31.2\text{px} < 44\text{px}$) | **Collision:** Adjacent buttons overlap by $12.8\text{px}$. |
| **$b = 12$** | $26.0\text{px}$ | **FAIL** ($26.0\text{px} < 44\text{px}$) | **Severe Collision:** Adjacent buttons overlap by $18\text{px}$. |

---

### Preserving 44×44px Touch Targets at $b \ge 8$

To maintain calm, error-free child touch participation without mis-taps:
1. **Primary Recommended Policy for High Support Bridge:**
   - Restrict initial high-support full-partitioned tasks to $b \in \{2, 3, 4, 6\}$ for direct single-row tick buttons.
   - For $b = 8$ (and future $b \in \{10, 12\}$):
     - **Staggered / Dual-Tier Hit Targets:** Tick hit targets alternate between upper tier (above track line) and lower tier (below track line), providing $2 \times \Delta x = 78\text{px}$ horizontal center-to-center clearance per row.
     - **Discrete Slider / Step Stepper Alternative:** A single focusable position pin with explicit `Step Left` ($◀$) and `Step Right` ($▶$) bump controls, each sized at $48 \times 48\text{px}$, allowing precise keyboard and touch movement across ticks without tiny touch targets.
2. **Medium Support Policy:**
   - Because medium support displays only 3 to 4 discrete candidates $\{p_1, p_2, p_3, p_4\}$, candidates are selected so that adjacent points have at least $50\text{px}$ horizontal clearance, ensuring every candidate button satisfies the $44 \times 44\text{px}$ requirement directly.

---

## 3. Curated 8-Item Bridge Seed Table

The curated seed table provides systematic coverage across magnitudes ($< 1/2$, $= 1/2$, $> 1/2$), unit and non-unit fractions, unreduced-bar equivalence, and both high and medium support. All target coordinates and diagnostic distractors are **exact rational wire fractions** (`{ kind: 'fraction', numerator, denominator }`) evaluated via `equalFractions` / `compareFractions` in `src/math/fraction.js`—never floating-point decimal approximations.

| Item ID | Shown Bar ($a/b$) | Domain & Support | Benchmarks | Exact Target Position | Exact Diagnostic Distractors | Recovery Cue | Rationale |
|---|---|---|---|---|---|---|---|
| `bridge-01-half-2` | $1/2$ ($b=2$, 1 shaded) | $[0, 1]$, High | $0, 1/2, 1$ | $1/2$ | $0/2$, $2/2$ | *"This point is at an endpoint. The bar is half full. Look at the 1/2 benchmark."* | Canonical baseline: establishes the center anchor of the line. |
| `bridge-02-fourth-4` | $1/4$ ($b=4$, 1 shaded) | $[0, 1]$, High | $0, 1/2, 1$ | $1/4$ | $2/4$ (at $1/2$), $3/4$ (above $1/2$) | *"This point is at or above 1/2, but the bar is less than 1/2."* | Unit fraction strictly below $1/2$; tests distinguishing $1/4$ from $1/2$. |
| `bridge-03-three-fourths-4` | $3/4$ ($b=4$, 3 shaded) | $[0, 1]$, High | $0, 1/2, 1$ | $3/4$ | $1/4$ (below $1/2$), $2/4$ (at $1/2$) | *"This point is at or below 1/2, but the bar is more than 1/2."* | Non-unit fraction strictly above $1/2$; symmetric counterpart to Item 02. |
| `bridge-04-two-thirds-3` | $2/3$ ($b=3$, 2 shaded) | $[0, 1]$, High | $0, 1/2, 1$ | $2/3$ | $1/3$ (below $1/2$), $3/3$ (at $1$) | *"This point is below 1/2, but 2 out of 3 parts is more than half of the bar."* | Odd denominator; tests placement above $1/2$ where $1/2$ is not a partition line. |
| `bridge-05-two-fourths-half` | $2/4$ ($b=4$, 2 shaded) | $[0, 1]$, High | $0, 1/2, 1$ | $2/4$ ($= 1/2$) | $1/4$ (below $1/2$), $3/4$ (above $1/2$) | *"Look at the 1/2 benchmark: 2 out of 4 equal parts fills exactly half the bar."* | Unreduced bar form mapped to the $1/2$ benchmark location (`equalFractions(2/4, 1/2)`). |
| `bridge-06-three-eighths-8` | $3/8$ ($b=8$, 3 shaded) | $[0, 1]$, High | $0, 1/2, 1$ | $3/8$ | $2/8$ (quarter), $4/8$ (at $1/2$), $5/8$ (above $1/2$) | *"This point is at or above 1/2, but 3 of 8 parts is just under half."* | Denominator 8 near half; exercises 360px staggered/stepper touch resolution and near-half discrimination. |
| `bridge-07-one-third-med` | $1/3$ ($b=3$, 1 shaded) | $[0, 1]$, Medium | $0, 1/2, 1$ | $1/3$ | $1/6$ (closer to $0$), $1/2$ (at half), $2/3$ (above half) | *"1 out of 3 parts is less than half the bar, but not near zero."* | Medium support (sparse benchmarks + discrete exact candidates): requires magnitude estimation without full tick grid. |
| `bridge-08-five-sixths-med` | $5/6$ ($b=6$, 5 shaded) | $[0, 1]$, Medium | $0, 1/2, 1$ | $5/6$ | $2/6$ (below half), $3/6$ (at half), $4/6$ (too low) | *"The bar is almost completely full. Look for a location close to 1."* | Medium support near-one boundary: tests magnitude estimation near upper whole using exact sixths candidates. |

---

## 4. Instructional State and Scene Model Integration

### Scene Model Additions (`src/interaction/scene.js`)
Currently, `'number-line'` triggers a hardcoded refusal. When activated by an approved implementation packet, the Scene Model projects `meaning.numberLine` while strictly **withholding the target coordinate** before `resolve` (`established.locatedPosition` is `null` during `encounter` and `locate`, and unconfirmed preview selection remains app-local UI draft state just like numeric input drafts):

```javascript
// Projected scene snippet for number-line bridge (at locate vs. resolve)
{
  schemaVersion: 'fractionflow.scene/v1',
  kind: 'scene',
  meaning: {
    representationRole: 'number-line',
    condition: state.activeCondition,
    quantities: {
      left: {
        sourceForm: { kind: 'fraction', numerator: '3', denominator: '4' },
        currentForm: { kind: 'fraction', numerator: '3', denominator: '4' },
        unit: { denominator: '4' },
        count: { numerator: '3' },
        whole: { kind: 'stable-unit-whole', id: 'left-stable-whole', extent: { lowerWhole: '0', upperWhole: '1' } }
      }
    },
    currentTask: {
      beat: state.beat, // 'encounter' | 'locate' | 'resolve'
      responsibility: state.beat === 'resolve' ? 'settle-final-form' : 'locate-same-amount-on-line',
      inputKind: state.beat === 'resolve' ? 'finish-navigation' : 'line-position-choice',
      promptId: 'phase4.bridge.same-amount'
    },
    numberLine: {
      domain: { lowerWhole: '0', upperWhole: '1' },
      densityMode: state.support.dimensions.fractionBarModel === 'high support' ? 'partitioned' : 'sparse-benchmarks',
      benchmarks: [
        { label: '0', form: { kind: 'fraction', numerator: '0', denominator: '1' } },
        { label: '1/2', form: { kind: 'fraction', numerator: '1', denominator: '2' } },
        { label: '1', form: { kind: 'fraction', numerator: '1', denominator: '1' } }
      ],
      candidatePositions: [
        { id: 'pos-0', form: { kind: 'fraction', numerator: '0', denominator: '4' }, stepIndex: 0, totalSteps: 4, benchmarkRelation: 'exact-zero' },
        { id: 'pos-1', form: { kind: 'fraction', numerator: '1', denominator: '4' }, stepIndex: 1, totalSteps: 4, benchmarkRelation: 'between-0-and-half' },
        { id: 'pos-2', form: { kind: 'fraction', numerator: '2', denominator: '4' }, stepIndex: 2, totalSteps: 4, benchmarkRelation: 'exact-half' },
        { id: 'pos-3', form: { kind: 'fraction', numerator: '3', denominator: '4' }, stepIndex: 3, totalSteps: 4, benchmarkRelation: 'between-half-and-1' },
        { id: 'pos-4', form: { kind: 'fraction', numerator: '4', denominator: '4' }, stepIndex: 4, totalSteps: 4, benchmarkRelation: 'exact-one' }
      ],
      // Strictly null before resolve so the scene never leaks which candidate is correct:
      acceptedPosition: state.beat === 'resolve' ? state.established.locatedPosition : null,
      alignmentGuideVisible: state.beat === 'resolve'
    }
  }
}
```

---

## 5. Replay Envelope Contract (Decoupled from Plan 38)

### Concurrency & Versioning Posture
- Plan 38 is actively introducing `fractionflow.episode-replay/v5` for takeaway subtraction.
- Historical replay schemas `v1` (Plan 05), `v2` (Plan 34), `v3` (Plan 18), `v4` (Plan 35), and `v5` (Plan 38) remain strictly immutable.
- The number-line bridge interaction defines its own versioned recipe and episode definition identities:
  $$\text{recipeId: } \texttt{"plan37.bar-to-line-same-amount"} \quad (\text{revision: } \texttt{"1"})$$
  $$\text{definitionId: } \texttt{"phase-4-bar-to-line-same-amount"} \quad (\text{revision: } \texttt{"1"})$$
- When serialized into replay envelopes by a future approved implementation packet, it uses the next sequential replay schema version (e.g., `fractionflow.episode-replay/v6` or the next version after all Phase 3 packets complete), avoiding any schema collision with Plan 38.

### Replay Data Invariants
1. **Canonical Envelope Keys:** Matches existing `src/interaction/replay.js` structure: `{ schemaVersion, contentIdentity, episodeDefinition, support, activeCondition, learnerIntents, taskContext }` with zero timestamps or non-deterministic fields.
2. **Submitted Instructional Intents Only:**
   - `{ type: 'propose-number-line-location', proposed: { kind: 'fraction', numerator: '3', denominator: '4' } }`
   - `{ type: 'request-task-help' }`
   - `{ type: 'finish-compact-episode' }`
3. **No UI Ephemera in Replay:** Unconfirmed candidate previews, hover states, focus outlines, and help-panel open/close toggles remain app-local UI draft state and are never written into `learnerIntents`.

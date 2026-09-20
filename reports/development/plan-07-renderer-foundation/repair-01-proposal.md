# Plan 07 — Repair 01 Proposal: Candidate Exposure & Renderer Arithmetic Elimination

- **Date:** 2026-09-19
- **Author:** Implementer
- **Target Packet:** `plan-07` — Renderer Foundation and Learner-Facing Strings
- **Context:** Response to `repair-01.md` (commit `4044ce3`) regarding Blocker 1 (render-layer arithmetic), Blocker 2 (hardcoded `'12'` fallback), and Finding 3 (hardcoded denominators in `feedbackSame`).

---

## 1. Upstream Gap Report & Root Cause Analysis

### The Problem
In `src/render/beat-container.js:235-240`, candidate common denominators were derived on the fly:
```javascript
const leftDen = scene.meaning.quantities.left.currentForm.denominator;
const rightDen = scene.meaning.quantities.right.currentForm.denominator;
const candidates = [
  String(Number(leftDen) * Number(rightDen)),
  String(Number(leftDen) * 2),
  String(Number(rightDen) * 2),
].filter((v, i, arr) => arr.indexOf(v) === i && Number(v) <= 30).sort((a, b) => Number(a) - Number(b));
```

### Why This Happened
During the implementation of the `decide` beat, the renderer needed options for the learner to choose from. When inspecting `scene.meaning.unitRelationship`, the available fields were:
- `sourceDenominators: { left, right }`
- `commonUnit: null` (only populated after `decide` completes)
- `authoredCoverage: null`

There was no candidate field anywhere in `scene.meaning`. The content layer held valid paths in `src/content/eligibility.js` (`paths: { canonical, alternates }`), but the scene did not project them.

Instead of stopping and reporting this missing upstream contract, client-side arithmetic was written into `beat-container.js`. This violated:
1. **Packet Non-Goal 1**: "No denominator, equivalence, sum, or correctness outcome computed in `src/render/`".
2. **Requirement 2 (Renderer Purity)**: The presentation layer must only display validated state, never derive mathematical truth.
3. **Ceiling Isolation**: The `<= 30` ceiling duplicated DECISION-011 in `src/render/`, risking silent divergence if `PHASE2_FRACTION_BAR_LIMITS` changes.
4. **Guardrail 2 & 5 (Proxy Metrics)**: `tests/render-purity.test.js` only checked `fraction-bar.js` and `symbolic.js`, leaving `beat-container.js` completely unverified for arithmetic purity despite 171 passing tests.

Per the orchestrator's instructions, **all changes to `src/interaction/scene.js` are halted** pending review of this proposal.

---

## 2. Proposed Scene Shape for Exposing Candidates

### Field Placement: `scene.meaning.unitRelationship.candidateDenominators`

We propose exposing candidate common denominators under `scene.meaning.unitRelationship`:

```typescript
scene: {
  schemaVersion: 'fractionflow.scene/v1',
  kind: 'scene',
  meaning: {
    unitRelationship: {
      sourceDenominators: {
        left: string,
        right: string
      },
      // Populated ONLY when state.beat === 'decide'; null at all other beats
      candidateDenominators: string[] | null,
      commonUnit: {
        targetDenominator: string,
        validity: string,
        kind: string,
        rendering: string,
        authoredCoverage: string
      } | null,
      authoredCoverage: string | null
    },
    // ... other meaning fields
  }
}
```

### Invariant & Anti-Leakage Compliance

1. **Leakage Invariant 2 Compliance**:
   - `candidateDenominators` is a dense array of plain strings (e.g. `['6', '8', '12']`), sorted numerically.
   - It carries **zero validity flags**, **no canonical tags**, and **no correctness indicators**.
   - It contains a constrained choice list with multiple plausible values (valid targets + plausible distractors). A 1-element list is strictly prohibited so the answer is never revealed by elimination.
   - The learner retains full mathematical responsibility for evaluating which denominator is a valid common denominator.

2. **Pre-Response Invariant & Anti-Leakage Compliance**:
   - `candidateDenominators` is `null` during `encounter` and `notice`. This preserves the existing contract in `tests/interaction-scene.test.js:168`:
     ```javascript
     expect(JSON.stringify(initial)).not.toContain('"denominator":"12"');
     ```
   - `candidateDenominators` is `null` during `transform`, `operate`, `resolve`, and `reflect`, where `commonUnit` is already established and carries the selected `targetDenominator`.

---

## 3. Upstream Sourcing of Candidates

Where does `src/interaction/scene.js` obtain the candidate list during `decide`?

### Recommended Approach: Upstream Helper in `src/content/eligibility.js`

We recommend adding a pure content-level helper in `src/content/eligibility.js`:
```javascript
export function candidateDenominatorsForInstance(instance)
```
This helper:
1. Evaluates the instance via `evaluateInstanceEligibility(instance)`.
2. Gathers the valid paths:
   - Canonical target denominator: `paths.canonical.targetDenominator` (e.g. `'12'`).
   - Authored alternate target denominators: `paths.alternates.map(p => p.targetDenominator)` (e.g. `['24']`).
3. Generates plausible distractor denominators based on standard fraction misconceptions (e.g. multiples of one operand that fail the other, or sum/product forms) within the ceiling defined by `PHASE2_FRACTION_BAR_LIMITS.maxDenominator` (30n).
4. Returns a unique, sorted array of decimal strings: e.g. `['6', '8', '12', '24']`.

### Why This Layering is Correct
- All arithmetic, divisibility, and ceiling logic stays in `src/content/eligibility.js` and `src/content/` where mathematical rules belong.
- `src/interaction/scene.js` simply calls `candidateDenominatorsForInstance(state.content)` when `state.beat === 'decide'` and attaches it to `scene.meaning.unitRelationship.candidateDenominators`.
- `src/render/beat-container.js` simply renders buttons for each entry in `scene.meaning.unitRelationship.candidateDenominators`, with **zero arithmetic**.

---

## 4. Resolution Plan for Blocker 2 & Finding 3

### Blocker 2: Hardcoded `'12'` Fallback
In `src/render/beat-container.js:264`:
```javascript
// BEFORE (Defective):
const targetDen = scene.meaning.unitRelationship.commonUnit?.targetDenominator || '12';

// AFTER (Strict Fail-Loud):
const commonUnit = scene.meaning.unitRelationship.commonUnit;
if (!commonUnit || !commonUnit.targetDenominator) {
  throw new RenderContractError(
    'MISSING_ESTABLISHED_UNIT',
    'transform beat requires established commonUnit.targetDenominator in scene',
  );
}
const targetDen = commonUnit.targetDenominator;
```
Additionally, in `beat-container.js:353-354` (`reflect` beat), the hardcoded literals `8/12` and `7/12` will be replaced with dynamic forms drawn strictly from established conversion state in `scene.meaning`, or throw if not populated.

### Finding 3: Canonical Denominators in `feedbackSame`
In `src/render/strings.js:35`:
```javascript
// BEFORE (Defective):
feedbackSame: 'Look at the parts: one bar has thirds and one has fourths.',

// AFTER (Option 3A - Parameterized):
feedbackSame: (leftDen, rightDen) => 
  `Look at the parts: one bar has ${leftDen} equal parts and one has ${rightDen} equal parts.`,

// AFTER (Option 3B - Neutral/Grade 2-3 Phrasing):
feedbackSame: 'Look closely at the parts: the two bars are divided into different sizes.',
```
We recommend **Option 3B** (neutral phrasing) as it avoids English ordinal pluralization quirks (e.g. `thirds`, `fifths`, `sixths`, `twelfths`) while maintaining Grade 2–3 clarity and active observation cues. If specific unit sizes are preferred by orchestration, Option 3A with natural part count phrasing (`"${den} equal parts"`) will be used.

---

## 5. Purity Verification Plan Across All Render Modules

To prevent proxy-metric failures and guarantee that no module in `src/render/` performs arithmetic on mathematical values:

1. **Static AST / Code Inspection Test**:
   - Add an automated test in `tests/render-purity.test.js` that parses/scans all files under `src/render/` (`contract.js`, `strings.js`, `fraction-bar.js`, `symbolic.js`, `controls.js`, `beat-container.js`).
   - Asserts that no binary arithmetic expressions (`+`, `-`, `*`, `/`, `%`) operate on numeric or parsed fraction variables.
   - Asserts that no forbidden literals (`'12'`, `'3'`, `'4'`, `'thirds'`, `'fourths'`) appear in `src/render/` source code.
   - **Fail-first demonstration**: Verify that this test fails when run against commit `4f26887`.

2. **Behavioral Container Purity Test**:
   - Mount `beat-container.js` with arbitrary, non-standard scene inputs (e.g. `left: 5/17`, `right: 3/19`, `candidateDenominators: ['17', '34', '51']`).
   - Verify that the container renders buttons strictly matching `candidateDenominators` without computing any LCM, product, or ceiling.

---

## 6. Corrected Remaining Risks Section

In the updated progress report, Section 12 will explicitly state the testing harness limitations:

> **Testing Double Boundaries (mock-dom.js)**:
> `tests/fixtures/mock-dom.js` is a lightweight, zero-dependency headless DOM mock that models element hierarchy, class lists, attributes, event dispatch, and basic CSS selectors. It does **not** model:
> 1. Visual rendering, pixel layout, bounding boxes, or container geometry.
> 2. Focus order, activeElement tracking, or keyboard tab navigation.
> 3. Accessibility tree calculation or screen-reader / AT virtual cursor behavior.
> 
> Therefore, passing tests in Plan 07 demonstrate structural and contract correctness, **not accessibility conformance**. Plan 08 will be the first empirical test of these claims against real accessibility trees, browser viewports, and fail-first scaffold-leakage invariants.

---

## 7. Next Steps & Decision Gate

We request orchestrator approval on:
1. Authorization to update `src/interaction/scene.js` and `src/content/eligibility.js` to expose `candidateDenominators` under `scene.meaning.unitRelationship`.
2. Agreement on the shape of `candidateDenominators` as a dense, plain string array of plausible candidates containing valid targets and distractors without correctness metadata.
3. Adoption of the neutral phrasing (Option 3B) or parameterized phrasing (Option 3A) for `feedbackSame`.

# Plan 40 — Orchestrator Requirement 0 Review & Stage 1–2 Implementation Guardrails

- **Packet:** [`docs/development/plan-40-unlike-denominator-subtraction-batch.md`](../../../docs/development/plan-40-unlike-denominator-subtraction-batch.md)
- **Reviewed Commit:** `81014f3`
- **Review Date:** 2026-10-19
- **Disposition:** **APPROVED FOR CHECKPOINT 1 (Stages 1–2: Pure Foundation & Replay Oracles)**

---

## 1. Requirement 0 Gate Approval

All Requirement 0 deliverables are verified and approved:

1. **9-Item Batch & 2 Data-Only Holdouts (`curated-review` Profile):**
   - Verified via [`requirement-0-probe-results.json`](./requirement-0-probe-results.json) that all 9 batch items (`unlike-subtraction-vetted-set@1`) and 2 data-only holdouts (`plan40-data-only-holdouts@1`) are admitted under the existing `curated-review` profile (`positiveResult: true`, `properOperands: true`, `maxDenominator: 30`) with zero widening of `profiles.js`.
   - Verified 3 distinct target denominators per recipe (`construct`: `10, 20, 24`; `inspect`: `12, 20, 30`; `identify`: `6, 8, 12`), both `relatively-prime-subtraction` and `shared-factor-subtraction` coverage, left/right invalid candidate balance in `inspect`, and both operand orders in `identify` (`right` renamed in item 7 `5/6 - 1/3`; `left` renamed in items 8 `1/2 - 1/8` and 9 `2/3 - 5/12`).
2. **Post-Transform Takeaway Choreography (Option B Approved):**
   - Advancing directly from the final `transform` step into `operate` with `subtractionRemoval: 'marked'` and the single-whole takeaway bar active at `targetDenominator` (with `#operate-fraction-numerator-input` focused) is approved.
3. **Prior-Version Replay Oracles (`v1`–`v5`):**
   - [`tests/fixtures/plan38-v5-replay-oracles.json`](../../../tests/fixtures/plan38-v5-replay-oracles.json) is committed and verified alongside `v1`–`v4`.

---

## 2. Mandatory Technical Guardrails for Stages 1–2 (and Stage 3 Preview)

Please follow these exact codebase contracts during implementation so Stages 1–2 and Stage 3 align cleanly without regressions:

### Guardrail A — Reconcile `operate` Intent & Input Kind (`submit-subtraction-result`)
In [`requirement-0-proposal.md`](./requirement-0-proposal.md) §5.2/§5.4, the table listed `fraction-numerator` / `submit-operation-result` at `operate`, whereas §4 specified `#operate-fraction-numerator-input` + `#operate-fraction-denominator-input` with dual-form equivalence (`rawResultForm` at `targetDenominator` + `submittedForm`).
- **Contract to implement:** Use `submit-subtraction-result` (and `inputKind: 'fraction-response'`, `promptId: 'phase3.reusable-subtraction.operate'`) at `operate` for `phase-3-reusable-subtraction-recipes@1`, matching `phase-3-like-denominator-takeaway-subtraction@1`.
- **Why:**
  1. Both [`src/render/beat-container.js`](../../../src/render/beat-container.js) (lines 696–721) and [`src/render/linear-path.js`](../../../src/render/linear-path.js) already branch on `if (scene.meaning.takeaway)` at `operate` to mount `createFractionResponseInput` (`#operate-fraction-numerator-input` and `#operate-fraction-denominator-input`) and dispatch `{ type: 'submit-subtraction-result', proposed }`.
  2. `handleSubmitSubtractionResult` in [`src/interaction/episode.js`](../../../src/interaction/episode.js) already validates exact equivalence via `validateOperationResult(intent.proposed, left, right, 'subtract')` and records both `rawResultForm` (`state.content.resultState.canonicalRawResultForm`, or the difference at `targetDenominator` for non-LCD target denominators if applicable) and `submittedForm: intent.proposed`.
  3. In [`src/interaction/episode.js`](../../../src/interaction/episode.js), ensure `rawResultForm` for `phase-3-reusable-subtraction-recipes@1` uses the difference at `state.established.commonDenominator.targetDenominator` (which equals `canonicalRawResultForm` for all 9 LCD items, and stays consistent if a target denominator is ever non-LCD), and allow `submit-subtraction-result` in `replay/v6` for `phase-3-reusable-subtraction-recipes@1`.

### Guardrail B — Exact Scene Field Name (`scene.meaning.takeaway`, NOT `takeawayBar`)
In [`src/interaction/scene.js`](../../../src/interaction/scene.js) (lines 905–948 and 1001), the scene property is `scene.meaning.takeaway` (constructed by `takeawayMeaning(state)`), not `scene.meaning.takeawayBar`.
- **During `encounter`, `decide`, and `transform`** in `phase-3-reusable-subtraction-recipes@1`:
  - `takeawayMeaning(state)` **MUST return `null`**. This ensures `beat-container.js` and `linear-path.js` render the two operand fraction bars (`left` and `right`), their `select-renaming-side` / `inspect-candidate` / `transform` controls, and their equivalent-renaming transitions.
- **During `operate` and `resolve`** in `phase-3-reusable-subtraction-recipes@1`:
  - `takeawayMeaning(state)` **MUST return the takeaway object** using the renamed common-unit forms (`left: wireFormFor(state, 'left')`, `right: wireFormFor(state, 'right')` at `targetDenominator`), `wholePartitionCount: Number(targetDenominator)`, `removalStatus: 'marked'`, `cells` (`remaining`, `removed`, `outside-start`), and `acceptedResponseForm` at `resolve`.
- **In `operationMeaning(state)`** ([`src/interaction/scene.js`](../../../src/interaction/scene.js) lines 745–807):
  - Ensure `phase-3-reusable-subtraction-recipes@1` populates `currentForms` (`left` and `right` converted forms), `operandOrigins` for `full-subtraction.identify-side-construct` (matching lines 781–798 for `full-addition.identify-side-construct`), `rawResult`, `preferredFinalForm`, and `acceptedResponseForm: state.established.operation?.submittedForm ?? null` when resolved.

### Guardrail C — `candidateDenominatorsMeaning` & `taskMeaning` in `src/interaction/scene.js`
- In `candidateDenominatorsMeaning(state)` ([`src/interaction/scene.js`](../../../src/interaction/scene.js) lines 673–683), exclude `phase-3-reusable-subtraction-recipes@1` when `patternId === 'full-subtraction.identify-side-construct'` (matching `full-addition.identify-side-construct` at lines 677–679), because `decide` in `identify-side-construct` is `select-renaming-side`, not common-denominator selection.
- In `taskMeaning(state)` ([`src/interaction/scene.js`](../../../src/interaction/scene.js) lines 622–671), ensure `selectedSide: state.established.selectedRenamingSide` is projected during `transform` / after `decide` when `patternId === 'full-subtraction.identify-side-construct'` if needed by the renderers, alongside `patternId`, `targetDenominator`, and `candidate`.

### Guardrail D — Preview for Stage 3 (`renderCompletedBeats` & Subtraction Wording)
Do **not** touch `src/render/` during Checkpoint 1, but keep these two points ready for Stage 3:
1. In [`src/render/beat-container.js`](../../../src/render/beat-container.js) (line 118) and [`src/render/linear-path.js`](../../../src/render/linear-path.js) (line 252), `renderCompletedBeats(scene)` currently early-returns a simplified 2-line milestone list whenever `if (scene.meaning.takeaway)` is truthy, which would hide the completed `transform` milestones (`First fraction: a/b = a'/d`, `Second fraction: c/e = c'/d`) once `operate` starts! In Stage 3, ensure `renderCompletedBeats` includes the completed `transform` milestones for `phase-3-reusable-subtraction-recipes@1` before `Difference: ...`.
2. In [`src/render/strings.js`](../../../src/render/strings.js), [`src/render/beat-container.js`](../../../src/render/beat-container.js), and [`src/render/linear-path.js`](../../../src/render/linear-path.js), audit `encounter.prompt`, `encounter.compactTarget`, and `decide` prompts so subtraction episodes use operation-appropriate or subtraction-specific wording (never `"add"` or `"+"`).

---

## 3. Checkpoint 1 Scope Reminder

Implement **Stages 1–2** only:
- `src/content/data/plan40-reusable-subtraction-recipes-records.js`
- `src/content/plan40-reusable-subtraction-recipes.js`
- `src/content/index.js`
- `src/interaction/episode.js`
- `src/interaction/scene.js`
- `src/interaction/replay.js`
- `src/interaction/support.js` (if needed)
- Pure unit/oracle tests (`tests/content-plan40-subtraction-recipes.test.js`, `tests/interaction-plan40-subtraction-recipes.test.js`, `tests/replay-plan40-v6-compatibility.test.js`)

**Do not modify `src/render/`, `src/styles/`, or `src/app/` in Checkpoint 1.** Commit and stop at the Checkpoint 1 Review Gate.

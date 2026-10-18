# Plan 36 proposed subtraction task contract

**Disposition:** PROPOSED for owner adoption review. This dossier is not adopted, does not resolve OQ-25, admit practice content, or authorize source changes. It refines Requirement 0's initial positive-only suggestion by including an equal-operands zero boundary candidate and spelling out how equivalent responses display.

## Proposed learner goal and task

Recommend one goal entry following the current practice-map pattern:

- Goal id: `like-denominator-subtraction`
- Learner label: **Subtract fractions with the same denominator**
- Fixed set: `like-denominator-subtraction-vetted-set@1`
- Candidate items: the eight operand-defined records below, subject to full admission evidence and owner adoption.

This is a recommendation for the owner, not authorization to publish a new control. The app should expose the goal only after the fixed set and full episode path are accepted; add no representation-choice button to the goal map.

Proposed task identity: **takeaway / find what remains**. Use one stable whole divided into `d` equal parts. Show `a/d − b/d`, with `0 < b ≤ a < d`. The first amount is the starting amount; the second identifies which parts are marked removed. The learner supplies a fraction for the amount left. The response may use any exactly equivalent form; the denominator `d` belongs to the model's partition and is not mandatory in the answer.

Proposed concise copy:

- One question: **“How much is left?”**
- Initial operation action: **“Take away”**.
- Accessible response-group name: **“Amount left”**; keep the visible question
  as the single heading rather than adding another visible answer heading.
- Accessible field names: **“Numerator of amount left”** and
  **“Denominator of amount left”**; no duplicated visible instruction.
- Requested visual-view help at both high and medium support: **“Count only the shaded parts without removal marks.”**
- Requested linear-view help at both high and medium support: **“The second fraction is the amount taken away. Use the starting amount to work out what remains.”**
- Wrong-response recovery: **“Check the parts left. Try again.”**
- Correct feedback: **“That amount is left.”**

The single grouped action is the initial operation action, not a student selection of a number of parts. The source equation already supplies the removed amount. The action marks the authored subtrahend's parts and advances directly to the required fraction response; it has no separate Continue acknowledgement. Button activation does not prove that the learner selected, counted or understood the removed amount. The exact remaining-fraction response is the mathematical contribution; do not record the action as count selection, mastery or independent understanding.

A direct-answer-first flow with optional model inspection remains a rival for owner consideration, not a required second variant. This dossier recommends the grouped action because it presents a visible takeaway model before the answer while retaining answer responsibility. No observation evidence establishes that this flow improves interpretation or access.

## Proposed immutable identities and authoring shape

All named revisions below are proposed as `1`:

| Contract | Proposed identity |
|---|---|
| Recipe | `plan36.like-denominator-takeaway@1` |
| Episode definition | `phase-3-like-denominator-takeaway-subtraction@1` |
| Task data | `plan36-like-denominator-takeaway@1` |
| Practice type | `like-denominator-subtraction` |
| Fixed set | `like-denominator-subtraction-vetted-set@1` |
| Numerical record revision | `plan36-record-v1` |

Each record has exactly these authored fields and no expected answer/remainder:

```text
itemId: operand-based stable ID
fixtureId: curated-plan36-${itemId}
authoringRevision: plan36-record-v1
recipe: { id: plan36.like-denominator-takeaway, revision: 1 }
taskData: { id: plan36-like-denominator-takeaway, revision: 1 }
leftNumerator: canonical decimal integer string
rightNumerator: canonical decimal integer string
denominator: canonical positive decimal integer string
```

The fixed set record contains `id`, `revision`, ordered `itemIds`, and matching recipe/definition/task-data identities. The registered episode definition pins operation `subtract`, selector `like-denominator-subtraction`, no overlays, schedule `encounter → operate → resolve`, and no reflection. The task-data record pins the grouped action, answer intent, exact-equivalent response policy and the shared copy. Expected results and cell states are always derived from validated operands; no per-item presentation branches or answer tables are authored.

Materialization makes source forms from the three numerical strings. Recipe admission then binds each fixture and item to the registered set, recipe, definition and task-data revision. Require `0 < rightNumerator ≤ leftNumerator < denominator`. Equal operands are valid; a smaller minuend is refused. Representation eligibility is checked only after mathematical validation and recipe admission. Mathematical validity, task admission and representation capacity are distinct gates.

## Schedule and response contract

The schedule is exactly `encounter → operate → resolve`; no Notice, separate removal-count question, reflection, additional answer, or continue acknowledgement.

| Stage | Proposed behavior |
|---|---|
| Encounter | Show source equation, stable whole, equal partitions, one question and one enabled **Take away** action. The action itself marks the grouped amount and advances to operate. There is no separate acknowledgement. Answer fields remain unavailable until then. |
| Grouped transition | In one discrete unanimated state change, mark the validated right operand's amount on the starting quantity. Preserve all whole partitions and source quantities. |
| Operate | Move focus to numerator, enable both fraction fields and Check. Keep expected result hidden. The exact validator checks the submitted fraction against subtraction of the source forms. A wrong submission stays in operate, retains the submitted form as the editable draft and shows the separate recovery copy. The learner can correct it without repeating the action. |
| Requested help | Open one local task cue. Use concise representation-specific wording: in the visual path, “Count only the shaded parts without removal marks”; in the linear path, “The second fraction is the amount taken away. Use the starting amount to work out what remains.” Closing returns focus to Help and retains draft/scene. Record the actual help request. High and medium use identical behavior and identical wording within each view because no meaningful support-level distinction is justified. |
| Resolve | On exact equivalence, display the learner's submitted accepted fraction as the right side of the completed equation. Thus if the math core's raw difference is `4/10` and the learner submitted `2/5`, display `2/5`; if raw zero is `0/9` and the learner submitted `0/1`, display `0/1`. Keep raw validated math state and the learner's form distinct in state/provenance; do not normalize the learner's form or append an equivalence line. Show “That amount is left.” and one Finish or eligible Next action. |

**Repeat, focus, and reset:** Accept the mark intent once at encounter. Remove its control on transition; a duplicate intent at operate is rejected as the wrong beat and cannot change marks or evidence. No animation is used. On initial entry, return-to-entry/re-entry for a new attempt, and Next, focus the initial mark action; do not skip it to focus answer fields. Help open/close and wrong-answer remount preserve the current draft and model in the live app/task shell. Next starts a fresh episode with an unmarked scene; exhaustion is explicit. Do not add a learner-visible Replay control to this first recipe. Diagnostic replay remains available through the existing review/harness route and reconstructs submitted instructional intents only.

**Draft/provenance:** Submitted response intents are answer attempts. Current field strings are local UI draft state, not evidence of a submitted answer; preserve them across help, wrong-answer remounts and view toggles in the same active task. Do not add draft or help-panel visibility to immutable replay envelopes, save interrupted drafts, or imply session restoration. A requested-help instructional intent replays as that intent; whether the local help view is currently open/closed stays with existing UI ownership. Only the exact submitted fraction receives correct/incorrect classification. Store grouped-action provenance separately and never describe it as selected removed count or understanding. Store help provenance only when help was requested.
## Zero response boundary

Proposed domain: same-denominator positive proper operands with `0 < b ≤ a < d`; exclude negative outcomes, zero operands, unlike denominators, mixed numbers and improper operands.

For `6/9 − 6/9`, the exact raw model result is `0/9` and `simplifyFraction` returns `0/1`. Before submission, show neither `0/9`, `0/1`, “0 parts left” nor any numeric answer label. The grouped action marks all six starting parts while retaining all nine whole partitions. The all-marked model makes the result countable as the intended work; the interface does not supply an answer label. After exact acceptance, show only the learner's exact accepted form in the completed equation (`0/9`, `0/1`, or another equivalent zero form accepted by the core). Do not automatically add `0/9 = 0/1`. Do not replace the marked whole with blank space.

This is a proposed use of existing exact capabilities, not an adopted classroom rule. Zero is mathematically valid, still requires recipe admission, still requires representation capacity, and has no demonstrated learner-efficacy evidence. No concrete mathematical or representation obstacle to this boundary appears in the reviewed sources.

## Exact-derived candidate batch

[`batch-probe.mjs`](batch-probe.mjs) authors only operands, item IDs and coverage notes. It calls `subtractAtCommonDenominator`, `simplifyFraction` and `validateOperationResult`. [`batch-probe-results.json`](batch-probe-results.json) is the authoritative derived receipt; the result table below is transcribed from it. None of the candidates is yet admitted as learner content.

| Proposed item ID | Authored operands | Derived raw result | Derived simplified result | Purpose |
|---|---|---|---|---|
| `takeaway-8-5-minus-2` | `5/8 − 2/8` | `3/8` | `3/8` | Moderate positive remainder |
| `takeaway-12-8-minus-3` | `8/12 − 3/12` | `5/12` | `5/12` | Irreducible raw difference |
| `takeaway-10-7-minus-3` | `7/10 − 3/10` | `4/10` | `2/5` | Reducible raw difference |
| `takeaway-11-9-minus-4` | `9/11 − 4/11` | `5/11` | `5/11` | Irreducible raw difference |
| `takeaway-9-6-minus-1` | `6/9 − 1/9` | `5/9` | `5/9` | Large positive remainder |
| `takeaway-9-6-minus-6` | `6/9 − 6/9` | `0/9` | `0/1` | Equal-operands zero boundary |
| `takeaway-6-5-minus-4` | `5/6 − 4/6` | `1/6` | `1/6` | One-part positive remainder |
| `takeaway-8-7-minus-1` | `7/8 − 1/8` | `6/8` | `3/4` | Near-whole remainder contrast |

The proposed domain includes the zero boundary item; the owner may accept or revise that boundary. All eight candidate forms still require full content, recipe, set and representation validation in a future packet.

## Owner adoption choices

1. Adopt takeaway as the first subtraction task, or authorize a distinct comparison/difference investigation first.
2. Adopt grouped operation action followed by the required fraction response, or choose the direct-answer/optional-inspection rival.
3. Adopt equal operands/zero and the exact-equivalent response/display contract.
4. Adopt the `like-denominator-subtraction` goal label and fixed set placement, or name another existing-goal mapping.

Parent permission covered design only. These recommendations do not resolve OQ-25, admit content, activate the goal, or authorize implementation/deployment.

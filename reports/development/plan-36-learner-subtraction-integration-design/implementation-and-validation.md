# Proposed implementation and validation map

**Disposition:** future bounded source packet proposal only. This Plan 36 dossier changes no product source, tests, runtime prototype, active content, browser evidence, taxonomy or deployment. Required separation is explicit: exact math validity → authored recipe admission → representation eligibility → instructional state/provenance → validated scene → two render paths → learner goal reach. Evidence at one layer cannot stand in for the next.

## Exact proposed contracts

### Identity and record shape

Use these proposed fixed identities at revision `1`:

```text
recipe:             plan36.like-denominator-takeaway@1
episode definition: phase-3-like-denominator-takeaway-subtraction@1
task data:          plan36-like-denominator-takeaway@1
practice type:      like-denominator-subtraction
practice set:       like-denominator-subtraction-vetted-set@1
record revision:    plan36-record-v1
```

The eight numerical records have this exact authored shape; no answer form, expected numerator, remainder count, or renderer state is stored:

```js
{
  itemId,                 // operand-based stable ID from design-contract.md
  fixtureId,              // `curated-plan36-${itemId}`
  authoringRevision: 'plan36-record-v1',
  recipe: { id: 'plan36.like-denominator-takeaway', revision: '1' },
  taskData: { id: 'plan36-like-denominator-takeaway', revision: '1' },
  leftNumerator,           // decimal integer string
  rightNumerator,          // decimal integer string
  denominator              // positive decimal integer string
}
```

The fixed set record has exactly `id`, `revision`, ordered `itemIds`, `recipe`, `definition`, and `taskData`. The task-data record pins `recipe`, `definition`, schedule `['encounter','operate','resolve']`, operation-action intent `mark-subtrahend-amount`, answer intent `submit-subtraction-result`, response-policy id `exact-equivalent-fraction-v1`, and shared prompts/labels, with equivalent view-specific requested-help strings. It does not contain outcomes or per-item presentation branches. `definition` pins subtraction, selector `like-denominator-subtraction`, no overlays, and no reflection. Materialization derives source forms from the three numerical strings; exact expected results are calculated only by the math core. Validation requires proper positive operands, a common positive denominator, and left ≥ right. Equal operands are valid; negative outcomes are refused.

Task context is strictly shaped as:

```text
practiceSetId, practiceSetRevision,
itemId, fixtureId, authoringRevision,
definitionId, definitionRevision,
recipeId, recipeRevision,
taskDataId, taskDataRevision,
sourceForms: { left, right }
```

Every identity must match the exact registered set/item/definition/recipe/task-data entry. `sourceForms` must match both the item record and replay `contentIdentity.sourceForms`; decimal strings must be canonical. Unknown, omitted, extra, forged, mismatched or unregistered values fail closed.

### Episode state, intents, scene and provenance

- Frozen schedule: `encounter → operate → resolve`.
- Encounter response: `responsibility: 'mark-subtrahend-amount-for-inspection'`, `inputKind: 'grouped-removal-action'`. This is explicitly an operation action, not a learner choice or math answer.
- Operate response: `responsibility: 'supply-amount-left'`, `inputKind: 'fraction'`. Numerator/denominator and Check are unavailable until grouped marking has advanced the state.
- `mark-subtrahend-amount` has exact intent shape `{ type }`; it derives the amount only from validated right source form, marks those starting cells, sets `removalStatus:'marked'`, and advances. A duplicate is refused after the beat change, produces no extra state change or provenance, and cannot count as a correct response.
- `submit-subtraction-result` has exact shape `{ type, proposed }` with `proposed` a canonical wire fraction. It is admitted only at operate after marking. It calls exact `validateOperationResult(proposed,left,right,"subtract")` with no target-denominator constraint, so equivalent reduced forms remain valid; it stores the submitted fraction and classification. Wrong responses retain the submitted form as the editable draft and stay at operate. Correct equivalents advance to resolve and preserve the submitted form for display/provenance.
- Existing `request-task-help` remains local to operate and stores actual requested-help provenance; high and medium use identical behavior and identical wording within each view: the visual hint counts shaded parts without removal marks, while the linear hint describes taking the second fraction from the starting amount. Closing help is a view-state change, not a mathematical response. No help request is silently attributed when none happened.
- The scene projects `takeaway.operation:'subtract'`, full `wholePartitionCount`, validated source forms, a source-cell role map (`outside-start`, `starting`, `removed`, `remaining`), `removalStatus`, and the submitted/accepted response only when that response exists. The role map carries marks and preserved whole geometry; neither renderer derives counts or computes subtraction. Before correct response, hide both raw and simplified result fields. At resolve, display the learner's exact accepted response form after equals; do not replace `2/5` with model raw `4/10`, and do not append a simplified/raw pair.
- Provenance separately records `grouped-removal-triggered` and `learner-supplied-result`. Only the submitted fraction is an answer attempt; the grouped action never marks a removed-count choice, correctness, mastery or independent understanding. Help requests and wrong attempts remain auditable.

### Replay v5 proposal

Add a strict Plan 36 envelope `fractionflow.episode-replay/v5`; preserve all existing v1/v2/v3/v4 exact meanings and guards. V5 top-level exact keys are:

```text
schemaVersion, contentIdentity, episodeDefinition, support,
activeCondition, learnerIntents, taskContext
```

`taskContext` uses the exact shape above. `learnerIntents` permits only exact records in sequence: `mark-subtrahend-amount:{type}`, `submit-subtraction-result:{type,proposed}`, existing `request-task-help:{type}`, and existing `finish-compact-episode:{type}`. No unknown keys or unordered synthetic state insertion. Replay validates that mark occurs once at encounter; answer submits only after marking at operate; exact response classification matches the source operands; and finish follows correct resolution. Request-task-help replays as an instructional intent. There is no draft field, help-view-open flag, interrupted-session restoration or persistence in v5. Draft text is UI-local only. A requested help intent may replay; whether its local panel is open or closed remains governed by current UI ownership. Replaying submitted intents reconstructs the reducer state, not unsent input text.

A normal entry, return-to-entry and Next create a fresh attempt and focus the initial mark action. They do not resume a previously typed answer or bypass the grouped operation. Omit a learner-visible Replay control for this recipe; diagnostic/history replay remains in the existing review/harness route. Existing historical route matrices and Plan 35 v4 oracles stay pinned to their old definitions, sets and envelope meaning.
## Bounded future source files and symbols

| File | Proposed ownership in a future packet |
|---|---|
| `src/content/data/plan36-like-denominator-subtraction-records.js` | Export the eight operand-only records and fixed set identity in exact declared shape. |
| `src/content/plan36-like-denominator-takeaway-task.js` | Export fixed recipe/definition/task-data identities, exact context resolver, item/set association validator and source-form binding. No generic registry framework. |
| `src/content/authored-content-catalog.js`, `src/content/authored-problem-materializer.js`, `src/content/validation.js`, `src/content/family-definitions.js` | Integrate only this registered like-denominator subtraction set and validate its selected domain with exact math. Do not widen addition recipes or family admission generally. |
| `src/interaction/episode-definition.js` | Register `phase-3-like-denominator-takeaway-subtraction@1` and responsibility/prompt identities. |
| `src/interaction/beat-schedule.js` | Return the exact frozen three-entry schedule only for the strict registered definition/context. |
| `src/interaction/episode.js` | Add `mark-subtrahend-amount`, `submit-subtraction-result`, state gating, wrong/correct reducer behavior, help and immutable response provenance. |
| `src/interaction/scene.js`, `src/interaction/provenance.js` | Project cell roles/stable whole/answer visibility and distinct action-versus-answer/help provenance. |
| `src/interaction/replay.js` | Strict v5 parser/reconstruction and source/set/definition binding for submitted intents; leave v1–v4 fixtures and guards unchanged. Do not store UI drafts or help-panel visibility in replay. |
| `src/render/strings.js`, `src/render/beat-container.js`, `src/render/linear-path.js`, `src/render/fraction-bar.js`, `src/render/symbolic.js` | Render validated cell roles in the visual path and semantically equivalent status/action/response in linear path; use shared scene truth and concise copy. |
| `src/app/practice-types.js`, `src/app/app.js` | Add the fixed goal/set only after owner accepts the proposed goal map; wire entry, focus, app-local draft through help/recovery/view toggles, fresh Next, exhaustion and return behavior. No goal control is exposed before all members are admitted. |

This exact file map is a design target, not permission to edit these modules. The source packet must confirm current symbol ownership before implementation and may update only the bounded map through its own gate.

## Future validation and stop boundary

1. Derive all eight items from operand-only records; validate every source/result/form exactly, including reducible and irreducible results, one-part remainder, near-whole remainder, zero, and negative rejection. Prove equivalent forms such as `4/10`/`2/5` and `0/9`/`0/1` are classified correctly.
2. Keep math-valid, recipe-admitted and representation-capable fixtures separate. Reject invalid same-denominator/proper-order/recipe/version/set/source-form cases before episode construction.
3. Preserve immutable v1–v4 replay and route oracles. Prove v5 help/mark/submission/finish intent reconstruction; malformed/duplicate/out-of-order/forged v5 payloads fail closed. Separately verify live app-local draft retention through help/recovery/view toggles; drafts never become submitted responses or replay fields.
4. Mount the exact representative routes in both render paths: moderate positive, reducible, irreducible, one-part, near-whole and zero. Exercise keyboard, non-drag touch, reduced motion, wrong recovery, help focus, entry/re-entry, Next/exhaustion, and diagnostic replay reconstruction through the harness (no learner Replay control). Browser emulation does not prove physical Chromebook or assistive-technology behavior.
5. Use falsification seeds for missing/erased hatch, hatch identical to outside-start, clipped bar with surviving wrapper box, denominator/partition disappearance, stable whole shrinking, misplaced mark, preanswer answer label/leak, addition semantics, action incorrectly counted as answer, zero rendered as blank, and duplicate click changing state. Assert computed paint, actual bar/cell bounds and hit-testing, not DOM presence alone.
6. Record 360 CSS-pixel, declared school Chromebook viewport, and enlarged-text/zoom screenshots and measurements at initial, marked, wrong, help, correct and completion. No layout fit is claimed by this proposal; Plan 15 evidence is prototype-only.

Repeat the earlier help-toggle regression journeys explicitly: open/close/reopen;
submit a wrong answer while help is open; repeat that same wrong answer; close
and request help again. The button label and aria-expanded must always match
actual cue visibility, and the cue must remain actionable after feedback changes.
Preserve the open cue and editable draft on a wrong response; show one short
recovery without resetting marks or replacing the cue with stale status. Closing
help removes the cue and retains recovery/draft. Both views use the same rule.
These are future acceptance assertions, not behavior established by this design.

No implementation, route activation, rendered proof, learner observation or efficacy claim exists yet. Nested/unlike subtraction is out of scope. Revisit it only after owner accepts this task/representation and later evidence identifies the specific renaming decision and capacity requirement; issue a separate investigation and source gate.

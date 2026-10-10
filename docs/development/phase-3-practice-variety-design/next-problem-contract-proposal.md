# Next-Problem Contract Proposal

**Status:** Proposed for owner acceptance. DECISION-040 adopts learner-triggered Next; none of the detailed rules below are implemented or adopted by this dossier.

## Identity carried by each selected item

For an authored problem, identify the item by its stable content id/provenance (`fixtureId`, `authoringRevision`), exact ordered source forms, selector, overlays, and schema identity. Pair it with the registered episode-definition `id` and `revision`, plus the conditions/support profile that applies to that item. Content identity and instructional definition identity are distinct facts; one learner goal may point to several item records with different definitions.

For future generated practice only, include generator version, schema/profile identity and seed. A new seed or generated instance id must not be treated as evidence that its numeric task differs. Compare the learner-visible problem forms and result, and author a purposeful difference when the instructional task changes.

The present replay envelope records fixture authoring revision, but premise/reflection maps are keyed by fixture id. Proposed compatibility rule: append new fixture ids/revisions and leave previously admitted authored task data intact, or give those tables equivalent immutable/versioned identity. Do not edit old choice facts in place. This preserves old replay meaning without prematurely requiring a general envelope migration.

## Actions and reset semantics

| Learner action | Content identity | Episode/configuration | State and focus proposal |
|---|---|---|---|
| **Try this problem again** | Same content id, author revision, ordered forms, and definition id/revision | Same selected reviewer condition/support when applicable | Fresh episode: clear beat responses, drafts, help-open state, recovery, replay overlay and accumulated work; mount fresh episode and focus its heading/container. |
| **Next problem** | Must select a different eligible, fully authored item in the chosen set; compare stable identity and numeric problem, not just seed | Use that item's definition id/revision; retain reviewer selections and apply them according to declared applicability, without silently changing inapplicable settings | Fresh episode with no prior drafts, answers, help, recovery, replay or summaries. Focus the newly mounted episode heading/container after state projection. |
| **Back to start / re-entry** | Proposed stable behavior: leave Next's temporary position and start the chosen goal's first canonical item on re-entry | Preserve the entry-selected reviewer configuration under its applicability rules | Clear episode-local state and fragment as current return behavior does; focus the entry heading. This stable first-item policy needs owner acceptance. |

The visible action label should be **“Next problem”** and it should be learner-triggered. Do not advance after a correct answer automatically. Do not add session dose, rewards, learner history, adaptation, persistence, or progress storage.

## Completion gate and mid-task skip

Offer Next only when the episode's actual terminal contract is satisfied. In the current reducer, the `resolve` beat can advance into `reflect`; it is not complete merely because the result was accepted. The current terminal status is reached only after the final scheduled beat resolves (including reflection when enabled). Base the gate on that completed episode state/schedule, not on a button's position or the `resolve` beat name.

A mid-task skip is a separate policy choice. This proposal does not add it. The existing return action remains an exit/re-entry action, not a synonym for Next and not a claim that the unfinished problem was completed.

## Selection, first item, and exhaustion

Proposed initial mechanics for a fixed authored set:

1. On entry, launch a stable, reviewed first item for the selected goal. Preserve the existing canonical route as the first item where the owner approves that set mapping.
2. On completed episode state, Next chooses the next item from the finite reviewed order whose eligible identity differs from the current one.
3. A set must have at least two fully admitted items before Next is offered. Do not make a one-item set appear to offer a different problem.
4. At the last item, do not cycle silently to item one and do not draw an unreviewed fallback. Replace the unavailable Next action with a plain exhausted-set message and a route back to practice choices.
5. Reject a stale/corrupt set entry with a bounded visible refusal that identifies no math as wrong and does not hang. Keep the learner on a known recoverable surface; no different item is implied until selection succeeds.

The exact selection order, whether the exhaustion response is an unavailable Next button or a post-click notice, and whether to allow a goal with only one item are owner choices. A Next label that cannot yet produce a different reviewed item is misleading.

## Configuration applicability

The current condition and support selectors are reviewer settings, not learner progress. Proposed behavior carries them across Retry and Next when the selected item declares them relevant. For an item that omits a task (for example, DECISION-039's no-reflection like-denominator task), the contract should explicitly mark that dimension inapplicable; identical output is not evidence of a bug. Do not force a decorative difference or attach a reflection-enabled definition to the item. An item explicitly marked unsupported for the selected profile is not eligible as a Next target; continue through the finite order for a compatible different item, without mutating the selected setting. If no compatible item remains, display “No more problems in this set for these settings” with practice choices and an explicit way to change settings. Missing/corrupt authored data is not the same as not applicable or unsupported: fail closed visibly and do not silently skip or substitute another item.

Each set entry should say which registered conditions are supported, which are intentionally declared the same, and which do not apply. A missing authored route or invalid capability must cause refusal before episode mount, not silent coercion to another task.

## Future browser witnesses

The bounded follow-on implementation packet should add mounted-control routes that prove:

- Try again preserves the content and definition identity while clearing a wrong response, open help, typed drafts and replay view;
- Next changes content identity and the numeric problem or approved task purpose while keeping applicable reviewer settings;
- reflection-enabled episodes do not offer Next at the resolve beat and do offer it only after the final reflection completion;
- the first entry and return/re-entry use the agreed stable item and clean entry focus;
- the new episode focus target is actually focused by user activation, and keyboard/non-drag touch can operate Next and exhaustion controls;
- after Retry and Next, focus lands on the fresh episode heading/container; at exhaustion, focus moves to the exhaustion heading/status before the practice-choice action; when a candidate is refused before mount, focus moves to the visible refusal status while retaining the last completed episode and its identity;
- eligible math with absent authored reflection is rejected before mount with an honest recovery path;
- a valid alternate denominator beyond the visible capability limit receives the Plan 22 task boundary, not a false “wrong answer” classification;
- duplicate generator values (if separately approved later) do not satisfy the “different” assertion;
- repeated complete set journeys review premise/reflection burden, without claiming child efficacy; and
- visual/linear, standard/reduced motion, high/medium support, wrong/recovery, replay and applicable condition routes remain coherent.

No such Next or exhaustion route currently exists. The current Plan 25 browser evidence does not cover this proposed contract.

## Owner acceptance brief and bounded follow-on

Please accept or revise: (a) the practice-goal mapping and labels; (b) the first admitted item set per goal and its order; (c) the minimum item count for offering Next; (d) completion versus any explicit skip; (e) no-wrap exhaustion copy/action; (f) reviewer condition/support carry-over and per-item applicability; (g) first-item behavior on return/re-entry; and (h) the immutable content/definition/task-data identity needed for replay.

After that disposition, draft a bounded source packet for the selection registry, completion-gated Next control, finite selection/exhaustion, fresh-state and focus behavior, stable first-item launch, and identity/replay compatibility. The scope may include authoring, validating and witnessing the owner-approved second candidate under an already approved task definition; every item must complete admission before it becomes learner-selectable. Owner approval to author a candidate is distinct from acceptance of its implemented instructional paths. Do not fold generated learner draws, new family admission, general curriculum machinery, session policy or deployment into that packet. Plans 18/19 need the accepted mechanism for joining their items to an existing learner goal; family source work may not infer it from reviewer-only fragment routes.

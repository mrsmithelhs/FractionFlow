# Plan 16 Requirement 0 mechanism review

- Date: 2026-09-30.
- Source baseline: `6cc645a`; route-matrix baseline remains `51bdec7`.
- Decision: approved with the binding clarifications below. This clears the mechanism gate for source work; it does not accept the implementation or initiate another packet.
- Preflight: RUNNABLE. Route matrix SHA-256 independently matches `ef56b30ed99fd641fa185d7b788552f64ce034865cf474854616e723d4659891`.
- No source edits or tests were performed during this mechanism review.

## Approved schedule

Use a pure schedule derivation from the validated problem instance plus the registered definition's existing reflection setting. Compute it once at episode construction and deeply freeze the schedule and its entries. Keep an explicit current position in immutable episode state; successful responses advance it, while recovery, help, and replay do not reshape it.

Entries have stable instance identities and beat kinds, with a side on transformations, such as `{ id: 'transform-left', kind: 'transform', side: 'left' }`. The scene exposes the current entry/position only as needed by rendering and validated mounting. Do not expose history arrays or the entire future schedule as learner-answer material.

Use `instance.classification.transformations.canonicalRenaming.left` and `.right`, validated by the existing content validator, to determine the operand pattern; count the true flags rather than inventing a content `renamingCount` property. Use the instance's existing operation. Do not recompute mathematical truth in the renderer or choose the pattern from learner responses or the current proposed denominator. Unsupported/malformed input must fail explicitly rather than silently receive the canonical schedule.

With reflection enabled, the approved schedules are:

- Both renamed: encounter, notice, decide, transform-left, transform-right, operate, resolve, reflect.
- Only left renamed: encounter, notice, decide, transform-left, operate, resolve, reflect.
- Only right renamed: encounter, notice, decide, transform-right, operate, resolve, reflect.
- Neither renamed: encounter, notice, operate, resolve, reflect.

Without reflection, omit only reflect and retain today's resolution semantics. Synthetic schedule tests cover both one-sided patterns and neither; `createEpisode` retains the existing unsupported-family admission boundary. A testable pure schedule helper does not register a new learner practice. The zero-renaming omission of decide agrees with the reach assessment.

The canonical relatively-prime family needs both conversions at its currently reachable denominators, so its existing non-least-denominator routes can retain the frozen schedule. This approval does not settle how a future nested-family episode could offer alternate denominators that change which operands need renaming; that is a later family-packet question, not permission to recompute a schedule after decide.

## Definition identity and constructor compatibility

The definition need not hold a per-instance schedule or a schedule rule. Retain both existing definition IDs and revision `1`, and retain the registered definition objects' existing wire fields and values, including the legacy `beats` field. Do not silently remove that field from the constructor's accepted object or reinterpret it as a caller-supplied schedule. The schedule is the traversal mechanism; the existing field remains compatible registered grammar metadata.

Keep exact registered-semantics admission: an authoritative definition or its exact JSON copy is accepted, while altered prompts, reflection settings, extra semantic fields, unknown identities, or non-wire values are rejected. Do not replace this boundary with identity-only lookup or strip arbitrary caller fields. Replace the fixed traversal coupling only as needed for the approved derived schedule.

Keeping IDs/revision and replay-envelope v1 is approved for this representation migration because the supported instructional behavior must remain equivalent. If retaining old constructor admission or old replay meaning requires changing that policy, stop and propose the explicit revision/compatibility path before making that change. An automatic version bump alone would not preserve old replay support.

## Completion, scene, and provenance compatibility

Make entry identity and position explicit for transition and mounting decisions. Preserve the same prompts, response opportunities, current operand target, recovery, support carryover, instructional revision increments, and visible/semantic output at every corresponding canonical point. The default definition still resolves at resolve; the reflection definition remains active until its valid reflection response succeeds.

The old state records one combined transform completion only after both conversions; the current interface already summarizes individual left and right conversions as milestones. Splitting internal completion records is permitted, but must not create a new visible count, duplicate context, different completion timing, or altered summary content. Preserve today's collapsed previous-step disclosure, latest milestone, and inspectable endpoints.

Add schedule-entry/position identity to response provenance without dropping its existing meaning: content/definition identity, expected response, visible/supplied/hidden fields, learner action, classification, evidence category, support histories, resulting established state, and revision. The packet's source scope explicitly includes `src/interaction/provenance.js` for this bounded work. No wider provenance redesign or schema migration is authorized.

## Replay proof

Leave the envelope's exact wire shape and ordered intent shapes unchanged. Reconstruct verified content and its existing registered definition, derive the frozen schedule, and replay the same intents. Fail-closed identity and intent-order validation remain intact.

Capture untouched envelope fixtures AND expected old outputs from `b654487` before the refactor; do not generate the old oracle with the new reducer. Cover both registered definitions and meaningful intent prefixes, including the two conversion boundaries, error/recovery, help, replay, and a non-least common-denominator route. Include the current accepted pre-refactor baseline where needed; current app behavior and 27-route proof remain pinned to `51bdec7`.

Define a narrow documented compatibility projection for old/new comparison: remove only new schedule metadata, map instance IDs to legacy beat kinds where required, and map split transformation completion records back to the old combined completion at the old completion boundary. Preserve the semantic values and timing listed above. Do not remove whole histories, provenance, expected responses, or classifications to force equality. A final answer or final established snapshot alone is insufficient.

Separately retain exact full-state JSON equality for new episode → envelope → JSON round trip → replay, for both registered variants. Cross-version semantic preservation and within-version exact reproduction are separate assertions.

## Delivery boundary

Preserve the 27 route rows byte-for-byte and their current focus/reset behavior; keep leakage assertions and scene-history guards intact. No app, math, or content implementation changes; no new family or support selector; no focus repair or route edits. Report definition admission, legacy oracle/projection, new replay equality, the expressible schedules, matrix hash, commands, and advisor disposition at delivery.

The two existing working-tree changes were inspected: they are exactly the owner's Plan 16 ready → in-progress status change and its generated index row. They belong to this assigned packet and are included in this orchestration commit; no source work was attributed to the implementer.

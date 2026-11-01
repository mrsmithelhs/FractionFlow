# Plan 49 pure checkpoint review

Date: 2026-11-01. Code/checkpoint `a171441`, progress `823b6f8`.
Disposition: **pure construction behavior accepted; integration clarification
required before app/render/replay registration**.

Parent inspected the new reducer, projection, tests, legacy comparison reducer
and provenance. Independently reran the three focused files: 14/14 tests passed.
The all-bank exact-core tests, target admission, unchanged-source handling,
optional factor helper, target invalidation, model lock and partial-help relation
acceptance support the intended behavior. Historical v9 full-state oracles are
retained and tested. No additional advisor or broad validation was used.

The checkpoint appropriately flags its wrapper as provisional. It exposes
`definition/taskContext/base/construction/intentHistory/assistanceHistory/attempts`,
whereas general episode, scene, snapshot and progression consumers use the common
episode schema, definition, status, schedule and histories. Inner base state has
revision-1 identity and only legacy intents; outer state has revision-2 identity
and full chronology. Relation provenance is patched to revision 2 after invoking
the legacy reducer. That can be contained internally, but is not yet an agreed
public integration contract. Do not let consumers inconsistently select outer
identity and inner status/history or accidentally serialize the legacy base.

## Requested short clarification (documents only)

Append a concrete integration map to checkpoint-1.md, naming:

1. The exact public episode fields returned by the general constructor/dispatcher
   for revision 2; which fields are authoritative and which, if any, are internal
   reducer details. Choose a single boundary rather than spreading `.base`
   branches across app/render/progression. No general architecture refactor.
2. How general applyIntent, snapshot, schedule/task projection and shared resolved
   progression consume that boundary, including the revision counter's meaning.
3. Which chronology and assistance history v10 serializes/reconstructs and which
   state is compared on round trip. Explain how provenance gets truthful revision,
   actual assistance and helper progress without relying on a revision-1 snapshot
   as if it were revision-2 evidence. Pin definition/context registration and the
   v9/revision-1 versus v10/revision-2 refusal matrix.
4. How last-request reasoning versus notation display is selected. The isolated
   projection currently finds any historical reasoning request; final integration
   must not let an older reasoning request mask a newer notation request.

An internal reuse wrapper is not rejected merely for existing. Prefer a small
explicit adapter or shared pure helper if that keeps old code intact; do not
invent an arithmetic instance or maintain two competing public episode states.
Return the short map for approval before source integration. No new research,
advisor, full tests or browser run is requested for this clarification.

Future mounted work must preserve origin guards through explicit target revision
even when an old/new helper share the same phase name. Retired callbacks and raw
drafts must be scoped to current item/generation/render and helper epoch/phase.
Keep the existing concise-copy and one-model requirements. No status, owner
acceptance, push or deployment authority changes. Plan 49 stays in progress.

# Plan 63 mechanism approval and pure checkpoint scope

2026-11-04. Reviewed proposed `mechanism.md` pinned to `a046758`, sampled current
Plan45/49 classification/provenance and app lifetime seams. Approve the mechanism
subject to the binding details below. This authorizes ONLY pure record/adapter
implementation and its browser storage checkpoint; no mounted integration yet.

## Approved direction

Task-keyed post-transition admission for standalone and session comparison; bounded
normalized outcomes/assistance and exact compatibility; provisional 30-entry cap;
one IndexedDB root with serialized readwrite operations, transaction-completion
acknowledgment and storage generations for stop/clear. Stored order does not imply
elapsed recency. Keep session navigation and unfinished work ephemeral.

The source confirms retry as well as correct comparison appends provenance; use
validated classifications and allowlisted snapshots, never serialize that provenance
or raw intent/construction input. IndexedDB scheduling is specified in
https://www.w3.org/TR/IndexedDB/#transaction-scheduling ; implementation must still
prove actual multi-tab ordering/error behavior rather than infer it from a fake.

## Binding clarifications

1. Separate admission from asynchronous persistence and UI completion. Capture an
   immutable normalized observation while the source episode/action is valid.
   Next/exit/restart retiring that episode must not silently discard already-admitted
   evidence waiting to commit. Old callbacks cannot admit new evidence or control
   current UI. Every write still validates enabled/storage generation transactionally;
   stop/clear may intentionally reject pending old-generation work. Do not block
   practice to wait for an unreliable save or claim a failed save succeeded.
2. Prove ordered first-retry/acceptance updates with rapid Next, delayed transactions,
   stop/clear and eviction. An evicted old token must not acquire a misleading new
   attempt/first outcome through a later update. Define safe bounded behavior.
3. Derive admitted identities/configuration from authoritative registries where
   feasible, with a small explicit interpretation/compatibility contract. Do not
   duplicate twelve content records or independently recompute mathematical truth.
   Reversed-pair repetition mapping makes no transfer/breadth claim.
4. UI text is provisional until mounted/rendered review. Use concise correct/tried
   again language rather than internal “accepted”; hide detailed assistance timing
   behind optional detail where useful. No IDs/revisions or repeated explanation
   paragraphs in ordinary learner-facing rows. Browser-centered wording avoids
   falsely identifying a child; no repeated ownership confirmations.
5. Enabling/clearing rotates generation. If an already-installed episode cannot
   record under the new generation, disclose the fresh-problem requirement briefly;
   never imply current work is being remembered when it is not. Practice stays usable.
6. Keep the explicit residual preference/fresh generation after clear distinct from
   learner observations, and explain stop-retains versus clear-deletes correctly.
   Unknown/corrupt/reset or blocked deletion must not silently overwrite data or
   resurrect it. No raw payload display. Privacy copy must match actual behavior.

## Ownership and stop

Approve `src/app/comparison-record.js`, `src/app/comparison-record-storage.js` and
focused `tests/comparison-record*.test.js`, with checkpoint scripts/receipts in
the owned Plan63 evidence folder. Name any different paths before editing them.
Use synthetic values and an isolated origin/browser context for storage probes.
No dependencies, source fan-out, app wiring, UI mounting, reducers/math/replay,
session controller or public/canonical wording edits during this checkpoint.

Demonstrate normalization, interpretation bounds, 30-entry retention, transaction
failure/abort, real two-tab duplicate/clear/stop behavior, invalid roots, disabled
storage and the lifecycle cases above. Attribute real browser versus fake tests.
Report unavailable guarantees rather than weakening them. Stop with checkpoint
artifacts for independent orchestration review before integration authority.

No advisor needed for this proposal gate; reserve the single bounded cold read-only
Terra-medium pass for settled substantial implementation. No Sol/Astra/substitution
or child fan-out. Coordinate Git, preserve historical/unrelated receipts and commit
progress last. No packet status, owner acceptance, push or deployment authorization.

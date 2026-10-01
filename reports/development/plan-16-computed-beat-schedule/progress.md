# Plan 16 implementation progress

- Date: 2026-09-30
- Starting point: `ccdf8b9` (Requirement 0 approved; amended packet and `mechanism-review.md` are binding)
- Implementation commit: `27480ff` (`refactor: compute episode beat schedule`)
- Ready for orchestrator delivery review: **Yes**
- Packet status: unchanged by implementer
- Remote: no push performed

## Summary

Implemented the approved computed beat schedule as a behavior-preserving traversal refactor. The schedule is derived once from the validated instance and registered definition's existing reflection setting, frozen, and carried with an explicit position in episode state. Transitions, current-scene mounting identity, provenance, and render reuse/summary logic now key from the schedule. Existing prompts, response opportunities, recovery, help, replay, support carryover, revision behavior, and learner-facing focus behavior remain under the original unedited 27-row route proof.

No application, math, content, route-matrix, family-admission, focus, or support-activation changes were made. Existing registered definition IDs and revision 1 remain unchanged, with the original `beats` wire field and exact semantic admission check retained.

## Schedule shape and expressible schedules

Each schedule entry is an immutable `{ id, kind, side? }` value. Transformations have explicit identities and sides, for example `{ id: 'transform-left', kind: 'transform', side: 'left' }`. The pure helper derives renaming from the validated `instance.classification.transformations.canonicalRenaming.left/right` flags and uses the instance's existing operation. It does not derive schedule from learner responses or proposed denominator. The schedule and its entries are deeply frozen at episode construction; state carries the current position. Recovery, help, and replay retain the same schedule object and position unless a successful response advances the schedule.

With reflection enabled, the helper can express these four patterns:

- Both renamed: `encounter → notice → decide → transform-left → transform-right → operate → resolve → reflect`.
- Only left renamed: `encounter → notice → decide → transform-left → operate → resolve → reflect`.
- Only right renamed: `encounter → notice → decide → transform-right → operate → resolve → reflect`.
- Neither renamed: `encounter → notice → operate → resolve → reflect`.

When reflection is disabled, only the final `reflect` entry is omitted; resolution semantics remain as before. Synthetic helper tests cover both one-sided cases and neither. `createEpisode` still rejects noncanonical instances at the existing unsupported-family admission boundary, so these tests do not activate a new learner family.

## Definition and replay compatibility

Constructor compatibility is preserved. Both existing registered definitions retain their IDs, revision, wire fields and values, including legacy `beats`. An authoritative registered definition and its exact JSON copy remain accepted; altered semantic fields and non-wire values remain rejected by the existing strict semantic comparison. The definition does not contain the computed schedule.

Before changing the reducer, I confirmed the source at `ccdf8b9` matched `b654487` for `src/interaction/` and `src/content/`, then captured 23 frozen legacy fixtures from the untouched reducer. They cover both registered definitions and the required intent prefixes, including non-least common denominator, recovery, help, replay, both conversion boundaries, operation, resolution, and reflection. Each fixture preserves the exact old replay envelope and expected old state.

Cross-version replay tests compare old outputs through a documented narrow projection that removes only the newly added `beatSchedule`, `schedulePosition`, and `scheduleEntryId` metadata. It preserves histories, provenance, expected responses, classifications, and semantic values. Separate tests assert exact full-state equality for new episode → envelope → JSON round trip → replay for both registered definitions. Envelope v1 and ordered intent shapes remain unchanged. No compatibility blocker was found.

## Route proof

The route matrix was not edited and is byte-identical to baseline `51bdec7`. Its SHA-256 is `ef56b30ed99fd641fa185d7b788552f64ce034865cf474854616e723d4659891`, matching the required baseline hash.

Final `npm run test:routes` output:

```text
Route Matrix Run Complete: 27 passed, 0 failed (27 total)
```

This retains the plan-14 matrix's mounted-control and real-gesture coverage, including both repaired focus rows. No focus behavior was changed.

## Validation performed

- `npm test` — passed: 22 test files, 264 tests.
- Focused interaction, scene, leakage, and render tests — passed: 6 files, 71 tests.
- `npm run build` — passed with Vite 6.4.3 (44 modules).
- `npm run test:routes` — passed: 27 passed, 0 failed (27 total).
- `node scripts/dev/plan-status.js lint` — passed: `lint: OK (no violations)`.
- `git diff --check` — passed; Git emitted only CRLF line-ending warnings.
- Route matrix byte comparison against `51bdec7` — identical; required SHA-256 verified.
- Source scope review — no changes in `src/math/`, `src/content/`, `src/app/`, or `tests/routes/route-matrix.json`.

## Problems encountered and resolution

The initial harmless Git metadata refresh/staging attempt was denied by the managed Windows sandbox while `.git/index.lock` was absent. The effective identity and Git ACL were inspected; no lock was removed and no ACL was changed. Scoped elevation was approved for staging explicit implementation paths and committing `27480ff`, consistent with repository guidance. The route-matrix baseline and semantic comparison were kept read-only throughout.

An early synthetic render-summary test fixture lacked the current schedule identity and separate source/current forms now required by scene derivation. The fixture was corrected to express the intended current scene; no product behavior was weakened. The expanded tests then passed with the full suite and route matrix.

## Remaining risks and limits

- The route matrix is the bounded behavioral witness for the currently supported canonical learner path; this does not test browser behavior for the synthetic unreachable schedules.
- The advisor identified a future boundary: if a later family admitted a zero-renaming episode with `commonUnit` data, summary selection may need family-specific consideration. This is not a current defect: the existing canonical-family gate prevents that episode from reaching learners, and Plan 16 does not activate another family.
- Git's diff check reports CRLF line-ending warnings; it reports no whitespace errors.
- The route runner's current host coverage is whatever the repository's configured browser runner exercises; no additional browser host was asserted here.

## Advisor disposition

Consultation ran because this change modifies instructional-engine behavior. The read-only advisor was requested at `gpt-6.1-sol`, medium effort. The advisor self-reported “Codex, based on GPT-6”; the exact runtime variant and whether the requested override took effect could not be independently verified. Effective posture was instruction-read-only with post-consultation status verification; immediately afterward the working tree contained only the expected Plan 16 implementation paths, with no advisor edits.

The advisor found no blocking issue in schedule successors, combined transformation completion timing, terminal resolve/reflection behavior, scene current-entry identity, or canonical summary preservation. Its future zero-renaming/`commonUnit` boundary is recorded above as out of scope and nonblocking because current admission rejects that family shape. No advisor finding required an implementation change.

## Delivery handoff

Implementation is committed as `27480ff`. The progress report is committed separately as the final implementation act. No packet status was changed and nothing was pushed. This work is ready for orchestrator/owner delivery review; that review owns acceptance and any packet-status update.

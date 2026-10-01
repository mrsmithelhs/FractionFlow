# Plan 16 delivery review

- Date: 2026-09-30.
- Reviewed implementation: `27480ff`; implementer progress report: `9320930`.
- Disposition: one bounded repair required before acceptance. Packet received as `delivered`; no completion or deployment authorization.

## Verified evidence

The orchestrator independently ran `npm test` (264 tests passed), `npm run build`, `npm run test:routes` (27 passed, 0 failed), packet lint, and `git diff --check`. The route matrix is byte-identical to `51bdec7`, with SHA-256 `ef56b30ed99fd641fa185d7b788552f64ce034865cf474854616e723d4659891`.

To check the oracle's origin rather than trust its label, the orchestrator extracted the untouched `b654487` source into an ignored temporary directory and replayed every frozen envelope through that old reducer. All 23 expected states matched exactly after JSON serialization. The current reducer also matched every old expected state after removing only the three added schedule metadata keys. The old interaction/content source is identical between `b654487` and the approved mechanism baseline `ccdf8b9`. Both registered definitions, conversion boundaries, non-least denominator, recovery, help, replay, resolution, and reflection are covered. Within-version full-state replay equality also passed in the test suite.

A separate read-only source reviewer found no canonical successor, completion-timing, provenance-loss, scene-history, summary-content, or mounting-key regression. Source inspection confirms that successors come from the frozen schedule, constructor family admission remains unchanged, and scene projection does not disclose the full schedule. Math, content, app, and route matrix source were not changed by the implementation.

## Required repair — unsupported operation rejection

`src/interaction/beat-schedule.js:18` accepts any nonempty operation string. Direct calls with `bogus`, `multiply`, and a single space all return the canonical-looking eight-entry schedule. This violates the approved mechanism's explicit requirement that unsupported or malformed input fail rather than silently receive the canonical schedule.

Severity: P2, confined to the exported helper. Existing `createEpisode` content validation prevents this from being a reachable learner regression. The repair must validate the supported operation values (`add` and `subtract`) and reject other values with `INVALID_BEAT_SCHEDULE_INPUT`. Add a focused regression test demonstrating invalid operation rejection and preservation of supported schedule derivation. Do not broaden constructor family admission or add any learner practice.

Re-run the unit suite, build, unchanged 27-route matrix, packet lint, and diff check; retain the matrix's exact baseline bytes. Update the implementer progress report with the repair and its checks, commit the scoped repair, and commit the report last. Leave packet status `delivered`; do not push. This source repair follows the orchestrator prompt's tested-repair handoff route.

## Limits retained

Synthetic one-sided and zero-renaming schedules are configuration tests, not executable learner-family acceptance. Their future common-unit/summary and operation prerequisites remain later family work. The implementer's advisor report honestly distinguishes requested model settings from unverified runtime identity; no independently verified higher-tier consultation is claimed here. No source changes were made during this delivery review.

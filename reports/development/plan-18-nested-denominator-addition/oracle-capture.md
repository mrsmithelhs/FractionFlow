# Plan 34 replay v2 oracle capture

Captured before any Plan 18 source or replay edits.

- Source HEAD: `601d07602c08052a9c6ec7a0c2c698c7c7e104c7`.
- Capture command: `node reports/development/plan-18-nested-denominator-addition/capture-plan34-v2-oracles.mjs`.
- Output: `tests/fixtures/plan34-v2-replay-oracles.json`.
- Captured cases: initial and completed construct for `two-thirds-plus-one-fourth`; initial and completed inspect for `one-half-plus-one-third`. All are Plan 34 replay v2 with pinned set revision 5.
- The capture script replayed each captured envelope using the unchanged source and compared `episodeStateSnapshot` with the recorded expected state. All four comparisons matched.
- Existing v1 oracle SHA-256 at capture: `F8A238121F849A3DC9F701B362ED6CF2A6C35293FB197C2E08895D3EED9F1708`.

This establishes the independent pre-edit replay/state baseline for Stage 1. The v1 fixture itself was not edited. The capture script is retained so the provenance and construction steps are reproducible; rerunning it after source edits would intentionally replace the baseline and is not part of validation.

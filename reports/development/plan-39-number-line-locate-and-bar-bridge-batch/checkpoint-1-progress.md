# Plan 39 Checkpoint 1: Stages 1–3

Date: 2026-10-21  
Implementation commit: see commit history for the scoped Checkpoint 1 commit

## Scope completed

Stages 1–3 add the eight registered unary bar-to-line records, exact registry-backed instances and task contexts, scoped content eligibility, the encounter → locate → resolve schedule, bridge-specific instructional intents/recovery, exact v7 replay, and upstream scene meaning for number-line candidates. The bridge path does not create binary operands or change the existing add/subtract schedule validator. Source `2/4` remains unchanged. High support offers every partition coordinate `k/b` for `k = 0…b`; sparse support uses the four reviewed exact candidates. Candidate benchmark and proximity classifications are projected upstream; the scene carries exact offered forms and target-independent descriptions. The odd-thirds half anchor is visual only.

The authored medium set for `bridge-02-fourth-4` includes `3/8`, making too-high-same-side recovery reachable through an offered candidate. Sparse candidate forms must match one of the exact active wire forms; equivalent but unoffered encodings such as `4/8` are rejected. A correct proposal resolves only when its offered exact value equals the source amount.

## Verification

- `npm test -- --run tests/plan39-bar-to-line-bridge.test.js tests/replay-plan40-v6-compatibility.test.js`: 2 files / 11 tests passed. Coverage includes all eight records in both support modes, unique sparse descriptions, endpoint-inclusive candidate lists, the nonselectable third-half anchor, exact task-context rejection, offered-form admission/source preservation, all four recovery classes, idempotent locate help, initial/locate/help/accepted/completed v7 round trips for all 16 item/support combinations, v7 tampering rejection, and full-state replay against all four frozen v6 snapshots.
- `npm test`: 55 files / 501 tests passed after final source/test changes.
- `npm run build`: learner and subtraction-prototype production builds succeeded.
- The frozen v6 oracle artifact `evidence/v6-baseline-oracles.json` and its generator were not modified. Existing v1–v5 fixture files were not modified. Existing Plan 40 v6 compatibility tests remain green.
- Plan 42 baseline evidence remains reused from the approved unchanged-source baseline; no broad route matrix was rerun.

## Boundary and next checkpoint

This checkpoint stops before app, render component, style, and route-matrix work. The current scene contract expresses projected candidate positions and descriptions but no mounted track measurement or hit-target geometry has been verified. Stage 4/5 must measure the actual number-line container and all controls at 360px, require each target to be at least 44×44px, pairwise nonoverlap, endpoint deltas and viewport visibility, and permit a stepper fallback when the high-support denominator-eight set cannot fit. No browser interaction or owner rendered-page/agency acceptance is established here. Deployment remains a separate gate.

Consultation disposition: orchestrator-gate-only; parent will perform the planned read-only review at this checkpoint.

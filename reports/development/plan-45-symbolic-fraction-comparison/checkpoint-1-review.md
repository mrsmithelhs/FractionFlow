# Plan 45 Checkpoint 1 orchestration review

Date: 2026-10-31. Reviewed implementation `626e597` and progress `b514cc3`.
Disposition: **bounded pure-contract repair; integration gate remains closed**.

The registered data, separate comparison task identity, immutable compare/resolve
schedule, first-model lock and assistance provenance follow the approved direction.
No app, renderer, route or replay-schema work was included. The proposed response
handle and reuse of shared progression are appropriate integration boundaries.

## Required corrections

1. Preserve explicit-invalid condition refusal. `createEpisode` previously passed
   an explicitly supplied `activeCondition: null` to `validateActiveCondition`,
   which rejects it. The new nullish fallback silently accepts it as the historical
   default; the comparison dispatch similarly converts null to omission. Parent
   reproduced both historical validator refusal and current constructor acceptance.
   Default per definition only when the supplied value is `undefined`; preserve
   rejection of null and other malformed values. Add focused regressions for the
   historical constructor and comparison dispatch, retaining omitted-value defaults.

2. Give the comparison tests an independent oracle. The all-item episode test and
   wrong-choice helper currently obtain `expectedRelation` from the same classifier
   called by `applyIntent`. A reversal of less/greater could satisfy those tests.
   Derive the expected relation directly from the existing exact math API on each
   authoritative record, independently of the comparison classifier. Exercise all
   three relation submissions for all 12 identities: exactly one resolves and the
   other two retain the comparison task with recovery. Preserve raw source forms
   and the existing lock tests. No hand-calculated answer table or new math engine
   is needed. This is an evidence gap; no incorrect comparison result was observed.

3. Tighten the two learner-facing reasoning cues while this is still pure data.
   Use “Try naming each amount in parts out of {denominator}.” for the exact-derived
   common-unit cue, avoiding wording that implies each amount contains that many
   parts. Use “Try simplifying both fractions.” for the equivalence cue, giving a
   reasoning action instead of suggesting the equality response. No extra help
   paragraphs, forced conversion task or new controls.

## Integration constraints retained for the next gate

The proposed v9 comparison identity/context, old-version isolation, app-owned raw
draft, scoped response handle and resolved-comparison progression are supported
in direction. They are not yet authorization to implement integration. Pin the
static condition's registered id/revision as well as its semantic fields; the
adapter must not claim transformation or premise settings act on this task.
Keep expected relation and private classification out of pre-acceptance scenes.
Keep exact context/revision rejection and historical replay behavior intact.

## Verification and next step

Parent inspected source, changes and checkpoint wires directly, reproduced the
null-condition regression using Node, and reran the six-file focused command:
47/47 tests passed. Passing tests do not cover the two issues above. No browser,
build, full route matrix or advisor was run for this pure checkpoint.

Implement only these bounded corrections, rerun focused tests and diff checks,
commit scoped work and checkpoint progress last, then stop for approval. Retain
the single authorized Terra-medium read-only pass for settled integration; no
additional reviewer is needed for this repair. Plan 45 remains in progress.

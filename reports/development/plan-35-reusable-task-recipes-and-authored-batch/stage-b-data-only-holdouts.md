# Plan 35 Stage B — data-only hold-outs

Date: 2026-10-17  
Accepted foundation: `46790ad`  
Status: implementation evidence for parent verification; not product acceptance.

## Change relative to the accepted foundation

The only source change relative to `46790ad` is
`src/content/data/plan35-addition-recipe-records.js` (24 insertions, 1 deletion).
It adds two exact recipe records and one exact test-only association set:

| Item | Fixture | Source forms | Recipe | Target | Task data | Set association |
|---|---|---|---|---|---|---|
| `plan35-holdout-construct-fifth-sixth-30` | `curated-plan35-holdout-one-fifth-one-sixth-construct@plan35-record-v1` | `1/5 + 1/6` | construct | 30 | `plan35-addition-recipe-task-data@2` | `plan35-data-only-holdouts@1` |
| `plan35-holdout-inspect-half-fifth-20` | `curated-plan35-holdout-half-fifth-inspect@plan35-record-v1` | `1/2 + 1/5` | inspect | 20 | `plan35-addition-recipe-task-data@2` | `plan35-data-only-holdouts@1` |

The inspect stimulus is left `9/20` (false) and right `4/20` (equivalent to
`1/5`). Both fixture rows are generated from their single authoritative task
data row. The inspect fixture uses no `reducible-result` content overlay: its
exact initial LCD sum is `7/10`; the authored task separately sets target 20,
where operation validation yields the equivalent raw form `14/20`.

The live set remains exactly 21 item IDs in its prior order. It has 13 recipe
records. Across the full data registry there are now 15 recipe records: 13 live
and 2 test-only hold-outs. The exact hold-out set contains only the two named
items; neither is a member of live set@7.

## Verification

Ran the existing generic foundation tests without editing tests or behavior:

```text
npx vitest run tests/interaction-plan35-reusable-addition.test.js tests/interaction-episode.test.js tests/interaction-provenance-replay.test.js tests/interaction-plan34-task-patterns.test.js tests/interaction-plan18-nested-addition.test.js
```

Result: 5 files passed, 45 tests passed. The existing all-record test discovers
all 15 records and exercises high and medium support, completion, replay, and
applicable recovery paths. In particular, both hold-outs are resolved through
their unique exact set association, retain task-data revision 2 in replay, and
do not require a source or test change. A read-only data registry probe reported
15 total / 13 live / 2 hold-out records and the exact two registered sets.

## Change classes and limits

- Data change: only the Plan35 compact recipe data module described above.
- Report artifact: this report and the Stage B section in `child-checkpoints.md`.
- No test, resolver, reducer, replay, app, render, route, dependency, settings,
  or fixture-oracle code changed. No browser, mounted app, build, or full-suite
  check ran in this stage.
- No Git metadata was written; no hold-out was added to the learner-facing set.

Parent should verify the source diff against `46790ad` and commit it before any
later mounted wiring stage. This checkpoint makes no claim about learner-facing
adoption or rendered support behavior.

## Parent resumed verification

After owner resume, parent inspected the exact diff against `46790ad`, aligned
the new stimulus identity with the approved `plan35-stim-holdout-half-fifth-20`,
and independently reran the same five focused files: 45 tests passed. The generic
sweep discovers both new records under high/medium support without test or
behavioral edits. Diff check is clean. Stage B is accepted for a data-only commit;
the live app still uses set@6 until the separately staged mounted wiring.

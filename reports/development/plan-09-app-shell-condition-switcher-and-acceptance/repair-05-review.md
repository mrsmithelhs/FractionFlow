# Plan 09 — Repair 05 Review

- **Date:** 2026-09-20
- **Reviewed:** `69f5e39`, `f25bdd1`
- **Decision:** **Accepted.** Both conditions met. No blockers.

This is the cleanest repair of the packet. Every item was verified by driving the running app, and
every claim in the report matched.

## DECISION-026 is satisfied — genuinely, for the first time

Both authored cases exist in `src/content/data/premise-checks.js`, mapped deterministically to the
route rather than to a constant or a random draw:

| route | presented | equivalent? | expected |
|---|---|---|---|
| twelfths | `7/12` against `2/3` | no | "No, the amount changed" |
| twenty-fourths | `16/24` against `2/3` | yes | "Yes, it is the same amount" |

Walked in the browser, all four paths:

- **False case, reassuring answer.** "Yes, it is the same amount" → recovery, *"Look closely: the
  shaded length became longer. It is not the same amount."* The episode does **not** complete.
- **True case, habitual-contrarian answer.** "No, the amount changed" → recovery, *"Look closely: the
  shaded length is the same. It is the same amount."* Does not complete.
- **Either correct answer** completes.

So a learner cannot pass by always saying "yes," and cannot pass by always saying "no" either. That
is the condition I attached, and it is the difference between a check and an acknowledgement.

**The referents are on screen.** The reflect beat now mounts both bars, labelled "Starting fraction:
2/3" and "New parts: 7/12", under the framing line "Check this renaming:". The owner's original
objection — *there is no new bar* — is answered: there is now, and a before one beside it.
`premiseExpectedYes` and `premiseFalseNoNotice` are live rather than dead.

## The simplified-form condition was met better than proposed

The report's own proposal was to redefine `preferredFinalForm`. The implementation instead adds a
separate `scene.meaning.operation.simplifiedResult` and leaves `preferredFinalForm` alone — cleaner,
and it removes the risk I flagged about the reflect beat.

And the provenance condition is met exactly: `beat-container.js` now dispatches
`submit-resolution` with `proposed: raw`, not `pref`. Verified live on the twenty-fourths route:

> "22/24 is correct! It can also be written as 11/12."

The learner sees the equivalence; the record still says they produced `22/24`.

## Items 3, 4, 5

- **Choreography scoping.** `isConversionBeat = beat === 'transform' || beat === 'operate'`, so the
  right operand's conversion is finally choreographed. Measured at 360×752 under sequential at
  `operate`: three tracks, Submit bottom at **701px** — clears both the 752px and the 740px fold, and
  is roomier than transform-right's 746px. The three-track ceiling held.
- **The inverted branch is gone.** The `expectedMatches` split was collapsed to the single reachable
  case, with a comment naming what is missing — there is no authored string for a like-denominator
  mistake — and deferring it to Phase 3. That is the option offered and the honest one.
- **The guard now derives its list.** `CLASSIFICATION_RECOVERY_KINDS` is exported from
  `classification.js` and `tests/render-recovery.test.js:264` asserts every kind in it appears in the
  guard table, with a size equality so the table cannot silently hold extras. Better than the
  restatement I would have accepted.

235 tests, build, and lint pass independently; tree clean.

## Two observations for the owner gate, neither a defect

1. **The symbolic row shows `8/12 + 3/12 = 11/12` while the premise asks about `7/12`.** The framing
   line and the explicit bar labels carry it, and a learner auditing a proposed renaming is the
   intended reading — but this is the kind of thing a real child either gets instantly or finds
   baffling, and nobody has watched one try. Worth a specific look during rendered-screen review.
2. **`CLASSIFICATION_RECOVERY_KINDS` is still hand-maintained.** The guard now derives from it, so
   producer and guard cannot drift apart — but a new kind added inside a classifier function and not
   added to the list still escapes. One further step would be to have the classifiers read their kind
   from the list. Not worth a repair on its own.

## Standing note

The label-versus-body pattern did not recur. The report's claims matched the artifact at every point
checked, the measurements reproduced, and the two conditions attached at the gate were met without
argument — one of them implemented better than the design that was approved.

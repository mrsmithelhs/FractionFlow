# Plan 10 — Budget Correction Review

- **Date:** 2026-09-21
- **Reviewed:** `05b399a`, `d99f94f`
- **Decision:** **Correction accepted. `plan-10` is delivered and goes to the owner for disposition.**
  One label adjusted by the orchestrator; one concurrency finding that is not this packet's fault.

## The correction is right

All three required changes landed, and the numbers reconcile with my independent measurement.

| | before | after |
|---|---|---|
| baseline at `operate` | 320px (component sum) | **541px** (measured) |
| one bar | 40px (assumed) | **47px** (measured) |
| reference viewport | 360×640 | **360×740 and 360×752**, with 640 explicitly noted as having no standing |
| mitigation | "to prevent vertical crowding" | **"REQUIRED, not optional"** |

The baseline now enumerates the seven chrome elements it carries rather than omitting them, and the
905px scroll height reconciles: 905 − 541 = 364px of footer and bottom chrome below the fold.

Unmitigated, the second whole moves Submit to 596px — 144px clear at 740, 156px at 752. Mitigated,
about 575px. The honest sentence is in there: *"claiming a '320px margin' was an idealized component
sketch that omitted existing chrome."*

## They found something I did not ask for, and it matters

> *"if richer choreography is active (such as `juxtaposed` or `sequential` replay, which adds
> comparison rows of 47px–112px per `plan-09` measurements), Submit can push to 701px–746px, severely
> eroding fold clearance."*

Neither of us had connected OQ-20 to the existing choreography conditions. A multi-whole result stack
and a juxtaposed before/after comparison are both vertical, both at the same beat, and both optional
per condition — so the worst case is not the recommended design, it is the recommended design under
bundle 3 with a replay active. 746px is past the 740px fold.

That is a real constraint on the Phase 3 packet that implements Candidate 1, and it is now on the
record before anyone builds it. Exactly what a design dossier is for.

## One label corrected by the orchestrator

The mitigated figures were headed **"Measured Geometry"** with **"Verified clearance"** lines. They are
not measured and not verified — they are arithmetic from a measured 541px baseline plus estimated
deltas, for a bar that does not exist yet. That is a sound way to size a design and the wrong word for
it.

Changed to **"Projected Geometry"** and **"Projected clearance"**, with a sentence added:

> *These mitigated figures are projections from a measured 541px baseline plus estimated deltas; the
> multi-whole bar does not exist yet, so they must be re-measured when it does.*

Small, and worth doing in a project that has spent seven repairs on labels asserting more than their
bodies deliver. The baseline figures remain labelled as measured, because they are.

## Concurrency finding — not this packet's fault, but it needs saying

The report states: *"pre-existing modified `package.json` and `package-lock.json` left untouched per
commit discipline."*

Those files are not pre-existing anything. They are **`plan-14`'s in-flight work**, uncommitted, in the
same working tree:

```
 M package-lock.json
 M package.json          + "playwright": "^1.63.0"
?? scripts/dev/run-route-matrix.js
?? tests/routes/route-matrix.json
```

Two implementer threads are sharing one checkout. `plan-10`'s implementer did the right thing by not
touching them and by staging explicit paths — that discipline is why nothing was lost. But describing
another packet's live work as pre-existing modification means it was not recognized, and the next
thread that runs a broad `git checkout`, `git stash`, or `git add -A` will destroy it.

Incidentally: `plan-14` has taken Playwright, which satisfies Condition D of its proposal review.

**For the owner:** running two implementers in one working tree worked this time because both staged by
explicit path. It is worth deciding whether parallel packets get separate checkouts or worktrees before
the next pair runs, since the failure mode is silent and unrecoverable.

## Standing

`plan-10` is **delivered**. Implementer work is complete; 244 tests, build, and lint pass; the dossier
needs no further rework.

What it now needs is **owner disposition of two recommendations**:

1. **OQ-20** — adopt Candidate 1, the discrete multi-whole stack, as the representation for results
   crossing one whole. Accommodates Phase 5 mixed numbers with the same renderer; requires the addend
   bars to collapse at `operate`.
2. **Mixed numbers** — do not admit them to Phase 3 as an operational or input type. Phase 3 concludes
   in improper form, with the resolve beat free to state calmly that `10/8 is 1 whole and 2/8`.

Neither is mine to accept. Both are recorded with reasoning and with the costs stated.

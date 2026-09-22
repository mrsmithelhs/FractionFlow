# Plan 14 — Mechanism Proposal Review

- **Date:** 2026-09-21
- **Reviewed:** `reports/development/plan-14-reachable-behavior-route-contract/mechanism-proposal.md`
- **Decision:** **Approved with four conditions.** The gate was honored — no code written. The
  starting-surface rule is the right line and the finding against the packet is correct.

## What is right

**The five-level starting-surface table is the load-bearing artifact and it is well drawn.** Levels 1–2
permitted, 3–5 prohibited, with the reason stated in terms of what each level would have failed to
catch in Phase 2. The hard red line at Level 4 — calling a renderer directly "fails to prove whether
the app ever calls the renderer" — is exactly the sentence that needed writing.

The three enforcement rules are stated as immediate failures with exit code 1 and specific messages,
not as reporting guidance. The seeded-defect plan targets the two real Phase 2 failures rather than
convenient substitutes.

## The finding against Requirement 3 is correct, and it is mine

The proposal reports that my Requirement 3 — *"each of the four registered conditions produces a
distinct rendered structure at a conversion beat, each with the other three as negative controls"* —
cannot be satisfied as written. Verified at `199c104`:

```
phase2-bundle-1:  display D-01-A  choreography D-02-M  cadence D-05-focused-key-beats  CM-01-M
phase2-bundle-4:  display D-01-A  choreography D-02-M  cadence D-05-focused-key-beats  CM-01-P
```

They differ in **one field**, `connectionMaking`, which has no effect until `reflect`. At `transform`
they must render identically. The proposed resolution — bundles 1–3 distinct at the conversion beat,
bundle 4 distinct at `reflect` with bundle 1 as its negative control — describes the shipped code
accurately and requires no change to `src/`. Adopted.

This is the reporting behavior the packet asked for: a requirement that did not survive contact with
the code, reported rather than fudged into a passing row.

## Condition A — close the dispatch-fallback loophole

§3.1 permits `app.dispatch` *"where no mounted UI control exists for that step, **or** to fast-forward
through already-witnessed predecessor beats."*

The `or` is a hole big enough to drive the whole matrix through. If every route dispatches its way to
the beat of interest, the controls are never exercised — only the state machine — and a button wired to
the wrong action passes every row. "Already-witnessed" is a claim nothing currently checks.

Required:

1. Every `dispatch-fallback` step carries a **`reason`** field. When the reason is fast-forward, it
   **names the route id that witnesses that same step through mounted controls**. A fast-forward past a
   step no route witnesses is a failure.
2. **At least one full-traversal route per path** — one visual, one linear — reaches `resolve` using
   **no dispatch at all**. Every control on the episode's critical path is then witnessed somewhere by
   a human-equivalent action.

## Condition B — declared sameness must be expressible

Bundle 4 renders identically to bundle 1 at every beat except `reflect`. That is correct and intended.
But undeclared sameness between two registered configurations is precisely what `plan-09` shipped, and
a future reader looking at two identical outputs must be able to tell *by construction* whether it is
intentional.

The schema needs a way to say **"these two are the same here, on purpose"** — an explicit assertion
that bundle 4 equals bundle 1 at `transform`, which the harness verifies as an equality rather than
ignoring. Then Rule 2's identical-output failure keeps its teeth everywhere else, and an accidental
collapse of two conditions that were *not* declared identical still fails.

Without this, the only way to express the bundle-4 situation is to omit the row, and omission is how
the original defect survived.

## Condition C — both premise routes, not one

§5 item 4 covers the twelfths route, where the presented renaming is false and the reassuring answer
"yes" is wrong. The twenty-fourths route is missing, and it is the half that makes the check a check:
there the presented renaming is true and the correct answer **is** "yes".

DECISION-026 exists so that a learner cannot pass by always selecting the reassuring option — and
equally cannot pass by always selecting the contrarian one. A matrix that witnesses only the false
case would accept an implementation where "no" always completes the episode. Both routes, both
answers, four rows.

## Condition D — use a maintained browser driver

§7 offers Option A, a native Node script speaking Chrome DevTools Protocol over a hand-rolled
WebSocket, with "zero extra npm packages" as the argument for it.

Zero dependencies is not the same as zero code. A bespoke CDP client is itself a testing framework —
the thing this packet's stop condition names — and it has a specific failure mode that matters here:
when a route fails, you cannot tell whether the defect is in the application or in the transport. The
entire value of `plan-14` is that its verdicts are trustworthy.

**Take Option B.** Playwright or Vitest browser mode, driving the built `dist/`. If you have a concrete
reason the maintained driver cannot work here, report it against the stop condition and state the size
cap you would hold the native runner to — do not decide it silently.

## Also

- Seeded defect 2 modifies `src/render/fraction-bar.js`, which Requirement 4 permits as the single
  exception to the no-`src/` rule. **Seeds never land.** Applied, captured verbatim, reverted, tree
  clean, and no seed surviving in any branch handed over.
- Branch A advisor consultation deferred to pre-delivery against the real harness code is the right
  call for a packet whose Requirement 1 output is a document.
- The viewport list in §2.1 cites 360×640; `plan-09` measured against 360×740 and 360×752 throughout.
  Use a consistent reference or state why this one differs — see the `plan-10` review, where the same
  inconsistency mattered more.

## Authorization

Proceed to Requirement 2 (harness) and Requirement 3 (rows) with conditions A–D. The schema, the
starting-surface rule, and the bundle-4 resolution are approved as proposed.

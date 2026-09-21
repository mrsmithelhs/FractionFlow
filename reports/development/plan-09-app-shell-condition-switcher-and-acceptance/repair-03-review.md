# Plan 09 — Repair 03 Review

- **Packet:** `plan-09`
- **Date:** 2026-09-20
- **Reviewed:** `f92ffb5`, `57e1f4f`
- **Decision:** **Item 1 accepted. Item 2 not accepted — the premise check accepts both answers.**
  Items 3–6 accepted. Packet stays `in-progress`.

## Item 1 — accepted, and it is the best work in the packet

The switcher switches, and it does so without breaking the rule it exists to serve.

Verified independently:

- **Zero reads of `condition.*` or `activeCondition` anywhere in `src/render/`.** The grep returns
  nothing. Choreography arrives through `scene.presentation.choreography`, derived upstream, exactly
  as reduced motion already worked.
- **The `promptId` substring sniffing is gone.** `taskMeaning` now carries an explicit
  `connectionForm` (`scene.js:482`), and both renderers read
  `currentTask.connectionForm === 'premise'`. The remaining `promptId?.includes('reflect')` at
  `beat-container.js:395` is button-label selection, not form dispatch — acceptable, and worth
  cleaning up eventually.
- **Condition B honored.** Doubled bars appear only at the `transform` beat for the changed side, so
  the reclaimed vertical space survives into `operate`, `resolve`, and `reflect`.
- **Condition D met.** Captured at the same beat and state, the three treatments are plainly
  different:

  | | tracks | rendered text |
  |---|---|---|
  | in-place | 2 | `8 \| 12 \| 1 \| 4` |
  | juxtaposed | 3 | `Before: 2/3 … After: 8/12 …` |
  | sequential | 3 | `Step 1: Start with 2/3 … ↓ Split into 12 parts … Step 2: New parts 8/12` |

- **Condition C met.** The new copy is parameterized in `strings.js` and reads at grade level.
  "Split into 12 parts" in place of "Equivalent form" is the right call.

### Condition A — met at 752px, missed by 6px at 740px, and the reported figures are optimistic

Measured at 360px at the same beat and state, active-beat-section bottom:

| | reported | measured | vs 740px fold |
|---|---|---|---|
| in-place | 608.2 | **605** | clears |
| juxtaposed | 645.2 | **717** | clears by 23px |
| sequential | 693.2 | **765** | **25px below** |

The in-place figure agrees; the other two are ~72px optimistic, so whatever harness produced them was
not measuring the same surface. Precisely: under `sequential` the Submit button's bottom edge sits at
**746px**. It clears a 752px viewport by 6px and falls 6px below a 740px one.

This is marginal rather than broken, and the treatment is good enough that I would not hold the
packet for it. But it is a finding, not a pass: **report layout against a stated reference viewport
and stop reporting figures a browser does not reproduce.** This is the third round where a reported
measurement did not match an independent one.

## Item 2 — not accepted. The premise check is an acknowledgement

`phase2-bundle-4` is registered, the menu is relabelled "Display and check options," and selecting
"Check the premise" does reach the premise question. Reachability is fixed.

**The check does not check anything.** `handleReflect` (`episode.js:475-481`) takes the `CM-01-P`
branch, records `{ response }`, and returns `assessedSuccess` with kind `reflection-recorded` —
unconditionally. There is no classification of the premise answer anywhere in `src/interaction/`.

Demonstrated in the browser, twice, on the canonical fixture:

- Answering **"Yes, it is the same amount"** → `You finished this problem.`, no recovery.
- Answering **"No, the amount changed"** — which is factually **wrong**, since `8/12` is the same
  amount as `2/3` — → `You finished this problem.`, no recovery.

Both buttons complete the episode. `premiseFalseYesNotice` and `premiseExpectedNo` remain dead
strings. This is precisely the failure DECISION-026 was written against, in the owner's own words:
"otherwise the question becomes an acknowledgement like a EULA." It now is one, literally.

### The deeper problem, which is mine

Even with classification added, this fixture cannot satisfy DECISION-026. Every renaming in the
episode is a *correct* equivalence, so the answer to "Does this new bar show the same amount as
before?" is always **yes** — the reassuring answer. The authored strings give the game away:
`premiseExpectedNo` reads "Good eye! The amount changed, so these fractions are not equivalent," and
`premiseFalseYesNotice` reads "Look closely: the shaded length became longer." Both presuppose
content in which a renaming is *wrong* — a deliberately incorrect equivalent form offered for
judgment. No such content exists.

So DECISION-026 needs two things, and I asked for neither:

1. **Classification of the premise response** against the mathematics, in the interaction layer.
2. **Content in which the premise is false** — an authored incorrect renaming presented for the
   learner to reject.

My `repair-03.md` framed the question as "which mechanism makes `CM-01-P` reachable," and both
options I offered answered that question. Reachability of the form was necessary and is not
sufficient. The implementer built what was asked for; the ask was incomplete.

## Items 3–6 — accepted

- **Item 3.** The 24ths set is `[15/24, 16/24, 17/24]` with the correct form at index 1, and the
  content test asserts the correct form is not at index 0 across all sets.
- **Item 4.** Invariant 6 now compares class lists and attribute-name sets across matching buttons,
  with fail-first demonstrated by mutating a real rendered control.
- **Item 5.** Selected state has its own treatment; Escape and click-outside dismiss and restore focus
  to the gear. The menu opens upward and stays in the viewport.
- **Item 6.** Segment widths reported at both widths, and the 320px denominator-30 case (5.40px
  measured by the implementer, 5.52px by me) was **reported rather than resolved**, which is what the
  repair asked for. The divider-suppression threshold is an owner decision and correctly left open.

214 tests, build, lint pass on an independent run; tree clean.

## Disposition

The premise-check defect moves to `repair-04.md` as a new Item 0, which is no longer blocked — Repair
03 has landed. It sits alongside the recovery-dispatch defect the gap scan found, and the two are the
same shape: a classification that the interaction layer never makes, or makes and nobody reads.

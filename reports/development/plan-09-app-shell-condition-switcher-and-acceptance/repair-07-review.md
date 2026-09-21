# Plan 09 — Repair 07 Review

- **Date:** 2026-09-21
- **Reviewed:** `9693853`, `76d418e`
- **Decision:** **All five items accepted.** Every fix verified independently by driving the running
  app. One defect remains before the owner gate, found while verifying Item 2 — it is a Repair 06
  carryover this repair did not scope, not a regression.

243 tests, build, and lint pass independently; tree clean.

## The five items

**Item 1 — replay presents a real change.** `findIndex` is in place at `scene.js:568`. Walked the
episode at 360×752:

| beat | replay presents | |
|---|---|---|
| transform-left (no transition yet) | "Finish a change before replaying it." | ✓ |
| transform-right | "Starting parts: 2/3" | ✓ |
| operate | "Starting parts: 1/4" | ✓ |
| reflect | "Second fraction: 1/4 = 3/12" | ✓ |

`noReplayYet` is reachable as intentional guidance rather than as an error, which Repair 06 promised
and this is the first run where I have seen it. The new test in `interaction-scene.test.js` is the
kind that was missing: it pins `pre` to the operand's pre-conversion form and asserts `pre !== post`.

**Item 2 — focus survives a replay.** At `transform-right` with `3` entered and focus in the numerator
input:

```
activeElement before replay:  INPUT.fraction-control control-numeric-input
activeElement after replay:   INPUT.fraction-control control-numeric-input
input identity preserved:     true
input value:                  "3" before and after
```

The `activeBeatRenderToken` cache is the riskiest change in this repair, so I probed it for staleness
rather than taking the capture at face value. A wrong numerator at `transform-left` still produces
*"Count the shaded parts in the new bar and try again."*, and the prompt still advances from "Rename
the first fraction" to "Rename the second fraction" on success. The cache is not holding stale
controls.

**Item 3 — the toggle clears the floor.** Measured **107 × 28px** at both 582px and 360px widths. Above
the 24px SC 2.5.8 minimum with room, so DECISION-021 criterion 3 is satisfied for this control.

Fold cost at 360×752, measured independently: Submit's bottom at **624px during replay** — which
matches the reported figure to the pixel — against **586px** resting. Clears the 752px fold by 128px
and the 740px fold by 116px. The report's resting figure of 615px is 29px off mine, most likely a
different beat; nothing turns on it, and the during-replay number is the one that governs.

**Item 4 — replay is visible without motion.** Under *Compare before and after*:

```
highlight class:  fraction-bar-comparison-row fraction-bar-row-before replay-highlight
animationName:    none
box-shadow:       rgb(2, 132, 199) 0 0 0 2px
background:       rgb(240, 249, 255)
badge text:       "Before: 2/3 (replaying)"
```

Static styling and a text change, so nothing depends on the suppressed pulse. Reduced motion now
reaches the same indication. The DOM is no longer identical apart from a class, which was the defect.

**Item 5 — no stale choreography classes.** Across every switch:

```
juxtaposed → fraction-bar-container choreography-juxtaposed
sequential → fraction-bar-container choreography-sequential
in-place   → fraction-bar-container
back again → fraction-bar-container choreography-juxtaposed
```

The finding that `choreography-in-place` is unreferenced in CSS is correct; I confirmed it.

**Conditions A, C, D** still hold. No timers govern content, `isReplaying` remains in the currency
contract, and the leakage suite still passes against a replaying `reflect` scene — choices unmount
genuinely (0 present during Inspection Mode) and return in order.

**On the harness change.** `tests/fixtures/mock-dom.js` gained real `activeElement` tracking: focus
moves on `focus()`, and drops to `body` when a focused node is removed by `removeChild` or
`replaceChildren`. That makes the harness stricter, not looser — it is the change that would have
caught the Item 2 defect in the first place. Good instinct.

## Remaining defect — focus is not restored when Inspection Mode closes

Repair 06 Condition B allowed one exception: at `reflect`, focus moves deliberately to "Done looking"
**and returns to the previously focused element on exit.** The first half works. The second does not.

Reproduced twice at 360×752, with waits long enough for the deferred focus calls to run:

```
before replay:  BUTTON.matching-choice-btn
during replay:  BUTTON.app-done-looking-button   ← correct
after "Done looking":  BODY                      ← should be the choice button
```

**Cause.** `beat-container.js:644` saves `previousFocusRef` *after* `controlsContainer.replaceChildren(card)`
has already unmounted the focused choice button. By then `document.activeElement` is `body`, so
`rootEl.contains(document.activeElement)` is false, the guard fails, and `previousFocusRef` stays
`null`. The exit branch at line 654 is therefore never entered, and neither is its fallback to the
first control. `linear-path.js:542` has the identical shape.

**Fix.** Capture the active element before the unmount, not after.

**Why it is not a Repair 07 regression.** Repair 07 Item 2 scoped the re-render "outside `reflect`"
and left Inspection Mode as built, which is what I asked for. The defect arrived with Repair 06, where
the report asserted that focus "is restored to `previousFocusRef`." It was not verified then, and the
same condition has now been claimed-but-not-met twice. That is the pattern worth naming: Condition B
is the only one of the four that has failed verification at both attempts, and both times the report
described the intended behavior rather than the observed one.

The effect on a learner is narrow but real: a keyboard or screen-reader user who replays at `reflect`
is returned to the top of the document when they finish looking, and has to navigate back to the
choices they were about to answer.

## For the owner's rendered-screen review

The reduced-motion acknowledgement reads *"Before: 2/3 (replaying)"*. It is honest and it works, but a
parenthetical status word is a software convention rather than child language, and DECISION-021
criterion 2 asks for concrete words at a grade 2–3 level. Not a violation I would block on — worth a
look when the rubric is applied to rendered screens, alongside the two `reflect` comprehension items
already listed in `owner-gate-checklist.md` §4.

## Standing note

Five items, five fixes, all verified, and the one measurement that mattered matched mine exactly. The
report described what the run produced. After the last round that is worth saying plainly.

The remaining defect is roughly four lines in two files. Once it lands, implementer work on `plan-09`
is finished and `owner-gate-checklist.md` governs the rest.

# Plan 09 — Repair 06 Item 1 Review

- **Date:** 2026-09-21
- **Reviewed:** `72e76a5`, `c5ca58e`
- **Decision:** **Not accepted.** Conditions A, C, and D are met. Condition B is not. Three further
  defects, one of them blocking at the DECISION-021 gate, were found by driving the running app.

The architecture is right. `isReplaying` is allocated exactly where the proposal said, the currency
contract was extended properly, Inspection Mode unmounts genuinely, and nothing auto-advances. What
went wrong is downstream of the design, and all of it is fixable.

## Condition A — met

No content changes on a timer. The two `setTimeout` calls added to `beat-container.js` (lines 624,
634) and the two in `linear-path.js` are `0ms` focus deferrals, not auto-advance. The *New parts only*
track holds the starting parts until the learner acts, as required. DECISION-021 criterion 4 is
honored.

## Condition C — met, and met well

`resolveRenderableScene` threads `isReplaying` through both `projectScene` calls and into
`assertSceneCurrent`, whose signature now takes it. `sourceContext()` folds it into the derivation
digest, so tampering invalidates the key. `tests/interaction-scene.test.js:395` asserts the mismatch
throws **in both directions**, which is more than the condition asked for.

## Condition D — met

At `reflect`, entering Inspection Mode unmounts the reflection choices rather than hiding them, and
they return in original order and unselected. The fail-first test added at
`tests/leakage-invariants.test.js` catches a pseudo-unmount mutation. Invariant 6 and DECISION-014
hold.

## Finding 1 — the replayed transition is wrong at `operate` and `reflect` (blocking)

Driving the app in the browser and in the app shell:

| beat | what replay presents | correct? |
|---|---|---|
| transform-left | "Starting parts: 2/3" | yes |
| transform-right | "Starting parts: 1/4" | yes |
| **operate** | **"Starting parts: 3/12"** against a 3/12 bar | **no** |
| **reflect** | **"Second fraction: 3/12 = 3/12"** | **no** |

At `operate` the learner is told the starting parts were 3/12 and shown a bar that did not change. At
`reflect` the inspection card states an equality between a fraction and itself and calls it the last
change. This is the same category of defect the packet has been clearing all along: a control that
asserts something is happening when nothing is.

**Cause.** `transitionMeaning` (`src/interaction/scene.js:567`) locates the provenance entry for
`state.established.lastConversion` with `findLastIndex`. Once the learner submits the operation and the
resolution, those later entries still carry the *same* `lastConversion`, so `findLastIndex` selects the
newest of them and the "preceding" entry it then reads is already post-conversion. `pre` and `post`
collapse to the same value.

**Verified fix.** Changing `findLastIndex` to `findIndex` — the first entry that established the
conversion — produces the right result at all four beats: "Starting parts: 1/4" at `operate`, and
"Second fraction: 1/4 = 3/12" at `reflect`, which is exactly what the review anticipated. All 240 tests
still pass with the change.

**This is not new code.** `transitionMeaning` has had this bug since Repair 03. Nothing read `pre`
until Item 1, so nothing surfaced it. It is fair to say Item 1 found the defect rather than caused it —
but Item 1 is what puts it in front of a learner, so it belongs to this repair.

**Coverage gap.** All 240 tests pass with the bug *and* with the fix. No test asserts that the replayed
`pre` differs from `post`, or that it equals the operand's pre-conversion form. Add one that fails
against the current code.

## Finding 2 — Condition B is not met (blocking)

The report states that on `transform` and `operate`, "If a learner is typing in the numerator input,
their caret, focus, and screen-reader position are preserved undisturbed."

Measured at 360×752, with focus in the numerator input and the value `3` entered:

```
document.activeElement before replay:  INPUT.fraction-control control-numeric-input
document.activeElement after replay:   BODY
input element identity across toggle:  false  (destroyed and rebuilt)
input value after replay:              "3"    (preserved)
```

Replay does not *move* focus to a display card, which is what the condition's wording prohibited. It
destroys the focused element instead, which lands the learner in the same place or worse: caret gone,
focus reset to the top of the document, and a screen-reader user returned to the start of the page
mid-task. The typed value survives, so no work is lost. The condition's purpose is not met.

The re-render rebuilds the controls subtree even though only the visual view changed. Either preserve
and restore focus across the re-render, or scope the replay re-render so the active control is not
rebuilt.

## Finding 3 — the "Show new parts" toggle is below the target-size floor (blocking)

`.fraction-bar-toggle-btn` is `font-size: 0.75rem` with `padding: 0.25rem 0.5rem`
(`src/styles/render.css:264`). Measured in the browser: **103 × 23.2px**.

WCAG 2.2 SC 2.5.8 requires 24×24px. DECISION-021 criterion 3 makes a sub-24px target a **blocking
acceptance failure**, and DECISION-025 exists precisely so that control size does not shrink for
layout reasons. This is a new interactive control, introduced by Item 1, on a surface built for
eight-to-eleven-year-olds. 0.8px short is still short.

Raise it to at least 24px of height with generous margin. The 360px budget has room: the in-place
track measured 615px to the Submit button's bottom, clearing the 752px fold by 137px.

## Finding 4 — replay is invisible under reduced motion in two of three conditions

Under *Compare before and after*, the visual view's DOM before and after a replay is **identical apart
from one class**:

```
identical except for `replay-active`:  true
computed animation on that element:    replay-pulse 1.5s
```

`.replay-active`'s only effect is a 1.5-second box-shadow pulse, and `render.css:312` and `:319`
suppress it under both `prefers-reduced-motion: reduce` and
`[data-presentation-mode="reduced-motion"]`. So for a reduced-motion learner on *Compare before and
after* or *Step-by-step change*, pressing "Replay the last change" produces no visible change of any
kind. `aria-pressed` toggles, so assistive technology gets something; the screen does not.

The reasoning behind it is sound — in those conditions the before state is already on screen, so
replay has less to do. But the participation floor's second row requires motion-reduced presentation to
reach the same semantic post-state **and retain a meaningful indication of what changed**, and a
control that appears broken is its own problem. Give those two conditions a non-motion acknowledgement
— a persistent highlight on the before track that clears on the next action, or the same "Done looking"
framing used at `reflect`.

## Finding 5 — report accuracy

The report's §4 describes the reflect card as presenting `1/4 = 3/12`. The captured output pasted in §2
of the same document reads:

> Inspection card note: Second fraction: 3/12 = 3/12

The capture was correct. The prose describing the capture was not — it restated what the review said
the card *should* show rather than what the run produced. This is the label-versus-body pattern
returning after two clean repairs, in its most consequential form yet: the evidence contained the
defect and the summary read past it.

The measurement table in §3 is otherwise trustworthy — the 615px in-place figure I measured
independently is within 10px of the reported 605px, and the conclusions do not turn on the difference.

## What to fix

1. `findLastIndex` → `findIndex` in `transitionMeaning`, plus a test that fails against the current
   code and pins the replayed `pre` to the operand's pre-conversion form at `operate` and `reflect`.
2. Preserve focus across a replay re-render, or scope the re-render so the active control survives.
   Report `document.activeElement` before and after, at an interactive beat, as the evidence.
3. `.fraction-bar-toggle-btn` to a minimum 24×24px with margin; report the measured box.
4. A non-motion replay acknowledgement for the juxtaposed and sequential conditions; demonstrate it
   with reduced motion active.

Minor, not blocking: after a condition switch the bar carries both `choreography-in-place` and
`choreography-juxtaposed`. The stale class appears inert, but it should be cleared.

## Standing note

Conditions A, C, and D were met without argument, and C and D were met beyond what was asked. The
design was right and the gate worked. What failed was verification: three of the four defects above
are visible in one pass of driving the app, and the fourth is printed inside the report's own evidence
section. The next report should show what the run produced, not what the run was expected to produce.

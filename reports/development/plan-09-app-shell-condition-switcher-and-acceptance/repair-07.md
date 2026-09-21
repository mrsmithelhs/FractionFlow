# Plan 09 — Repair 07

- **Date:** 2026-09-21
- **Raised by:** the Repair 06 Item 1 review — four defects found by driving the running app
- **Status:** drafted. Work from `a91134b`.
- **Gate:** none. Every item has an approved shape; no mechanism proposal is required.

The replay architecture from Repair 06 Item 1 stands. Conditions A, C, and D were met and must not be
disturbed. This repair fixes what verification missed.

## Item 1 — Replay must present an actual change

At `operate`, replay reports "Starting parts: 3/12" beside a 3/12 bar. At `reflect`, the inspection
card reads "Second fraction: 3/12 = 3/12". Both assert a change that did not happen.

`transitionMeaning` (`src/interaction/scene.js:567`) locates the provenance entry for
`state.established.lastConversion` with `findLastIndex`. The operation and resolution entries still
carry the same `lastConversion`, so the newest is selected and the entry preceding it is already
post-conversion. `pre` and `post` collapse to the same value.

**Repair:** `findLastIndex` → `findIndex`. Verified to produce "Starting parts: 1/4" at `operate` and
"Second fraction: 1/4 = 3/12" at `reflect`, with all 240 tests still passing.

If you find a reason `findIndex` is wrong — a path where the same conversion is legitimately
re-established — stop and report it rather than working around it.

**Required with the fix:** a test that fails against the current code. All 240 pass with the bug and
with the fix, which is the real gap. Pin the replayed `pre` to the operand's pre-conversion form at
`operate` and at `reflect`, and assert `pre !== post`.

## Item 2 — Replay must not cost the learner their focus

Measured at `transform-right`, 360×752, with focus in the numerator input and `3` entered:

```
activeElement before replay:  INPUT.fraction-control control-numeric-input
activeElement after replay:   BODY
input identity across toggle: false   (destroyed and rebuilt)
input value after replay:     "3"     (preserved)
```

Replay does not move focus to a display card — it destroys the focused element. For a screen-reader
user that means returning to the top of the document mid-task.

**Repair:** either scope the replay re-render so the active control subtree is not rebuilt, or preserve
and restore focus and caret position across it. Prefer the first; the visual view is what changed.

Inspection Mode at `reflect` is the deliberate exception and stays as built.

**Evidence to report:** `document.activeElement` before and after a replay at an interactive beat, in
both the visual and linear paths.

## Item 3 — The "Show new parts" toggle is under the target-size floor

`.fraction-bar-toggle-btn` (`src/styles/render.css:264`) measures **103 × 23.2px**. WCAG 2.2 SC 2.5.8
requires 24×24px, and DECISION-021 criterion 3 makes a sub-24px target a blocking acceptance failure.
DECISION-025 exists so control size does not shrink for layout reasons.

**Repair:** at least 24px of height with generous margin. Budget is available — the in-place track
measured 615px to the bottom of Submit at 360×752, clearing the fold by 137px.

**Evidence to report:** the measured bounding box, and the 360px fold clearance after the change.

## Item 4 — Replay must do something visible under reduced motion

Under *Compare before and after*, the visual view's DOM before and after a replay is identical apart
from the `replay-active` class, whose only effect is a 1.5s box-shadow pulse. `render.css:312` and
`:319` suppress that pulse under `prefers-reduced-motion: reduce` and
`[data-presentation-mode="reduced-motion"]`. A reduced-motion learner on *Compare before and after* or
*Step-by-step change* presses "Replay the last change" and sees nothing.

The reasoning is sound — the before state is already on screen in those conditions — but the
participation floor requires reduced motion to retain a meaningful indication of what changed, and a
control that appears broken is its own defect.

**Repair:** a non-motion acknowledgement for those two conditions. A persistent highlight on the before
track that clears on the next learner action, or the same "Done looking" framing used at `reflect`.
Learner-dismissed, never timed — Condition A still governs.

**Evidence to report:** captured output before and during a replay with reduced motion active, under
both conditions.

## Item 5 — Clear the stale choreography class

After a condition switch the bar carries both `choreography-in-place` and `choreography-juxtaposed`.
The stale class appears inert. Clear it. If it turns out not to be inert, say so.

## Acceptance checks

- [ ] Replay presents the operand's true pre-conversion form at `transform-left`, `transform-right`,
      `operate`, and `reflect`, demonstrated by captured output at each.
- [ ] A test fails against `c5ca58e` and passes after Item 1.
- [ ] `document.activeElement` is unchanged by a replay at an interactive beat, both paths.
- [ ] The toggle measures at least 24×24px; fold clearance reported at 360px.
- [ ] Replay is visibly distinguishable under reduced motion in all three conditions.
- [ ] Conditions A, C, and D from `repair-06-review.md` still hold — no auto-advance, `isReplaying`
      still in the currency contract, leakage suite still passing against a replaying `reflect` scene.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] No deploy, no push, no public-URL claim.

## Reporting

Report what the run produced, not what it was expected to produce. The Repair 06 Item 1 report
described the reflect card as showing `1/4 = 3/12` while its own pasted capture read
`3/12 = 3/12`. Paste captures verbatim and read them before summarizing them.

## Not in scope

Animated subdivision (`plan-10`); the support ladder; OQ-19, OQ-20, OQ-21; Requirement 3 and everything
in `owner-gate-checklist.md`, which is owner action.

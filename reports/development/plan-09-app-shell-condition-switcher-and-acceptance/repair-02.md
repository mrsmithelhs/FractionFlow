# Plan 09 — Repair 02

- **Packet:** `plan-09` — App Shell, Condition Switcher, and Phase 2 Acceptance
- **Date:** 2026-09-20
- **Raised by:** orchestrator review of the `24` denominator path, plus owner direction on bar layout
- **Status:** `in-progress`. Repair 01 remains accepted; this is a second, separate round.
- **Scope:** one defect, two owner-directed layout changes, one guard. Requirement 3 stays untouched
  and owner-gated.

## Blocker 1 — Reflection choices are authored per fixture, not per path

`src/content/data/reflection-choices.js` keys choices on `provenance.fixtureId`. The canonical
fixture has two valid denominator routes, and the choice set is the same on both.

Walked in the browser: choosing `24` yields `16/24 + 6/24 = 22/24` with both bars subdivided into
twenty-fourths — a correct, genuinely different route. The learner then reaches reflect and is shown
`8/12`, `7/12`, `9/12`.

It still classifies correctly, because `classifyReflectionResponse` compares with `equalFractions`
against `established.conversions.left` and `8/12 == 16/24`. Nothing is broken mathematically. But the
task the learner meets is not the task that was designed:

- The prompt asks them to recognize the equivalence they just built, and they never built twelfths.
- `7/12` and `9/12` are calibrated as one-part-off **in twelfths**. On the twenty-fourths route the
  intended near-miss distractors would be `15/24` and `17/24`. One part off in twelfths is twice the
  error, so the twenty-fourths learner gets a materially easier discrimination than the twelfths one.

**Repair:** key authored choice sets on the fixture **and the selected common denominator**, and
supply the set matching the established route. Author a twenty-fourths set for the alternate path.

Constraints:

- Keep the records correctness-free and keep classification in the interaction layer. The Repair 01
  architecture is right; only the lookup key is wrong.
- `reflectionChoicesForInstance` currently takes an instance. It will need the established
  denominator too. Read it from state, not from anything the renderer holds.
- If the established route has no authored set, **stop and report**. Do not fall back to the
  fixture-level set — that is the present defect — and do not generate one.

## Change 2 — Bar layout: drop "1 WHOLE", move the readout beside the bar (owner-directed)

**Owner direction, 2026-09-20.** Trade horizontal room in the bars for vertical space. Remove the
"1 WHOLE" caption and render the numeric readout as a stacked numerator-over-denominator form to the
**right** of the bar, as the symbolic pane does, rather than as a line beneath it.

Measured at 360px, per bar: whole label 18px, track 47px, readout 18px, box total **95px**; the two
bars occupy **210px**. Removing the caption row and folding the readout alongside the track should
bring each box to roughly the track height, so about **95px saved** across the two bars.

Notes that make this cheaper than it looks:

- **The "1 WHOLE" caption is already `aria-hidden="true"`** (`fraction-bar.js:60`). No screen reader
  has ever received it. Removing it costs nothing on the accessible path.
- **A tooltip is not needed and would be worse.** Hover tooltips do not work on touch and are a poor
  carrier for meaning. The linear path already says "…equal parts in 1 whole"; the visual bar's
  `aria-label` does not. Fold "in 1 whole" into `strings.encounter.barAriaLabel` so both paths agree,
  and drop the visible text outright.
- The stacked readout must not exceed the track height, or the saving is lost. The symbolic pane's
  fraction is 57px at 24px font; beside a 47px track it needs to render smaller.

The horizontal cost, stated honestly: a readout column of roughly 50px takes the track from ~266px to
~210px at 360px. Segment width at denominator 12 goes from ~22px to ~17px, at 24 from ~11px to ~9px,
and at the permitted LCD ceiling of 30 to about **7px**.

**This is a visual-discrimination tradeoff, not an accessibility one, and DECISION-025 already
settled that distinction** — segments are not tap targets, so SC 2.5.8 does not apply to them and
target size is decoupled from denominator. The decision's own rationale anticipated exactly this
cramping at high LCD on narrow screens and accepted it as a visual tradeoff.

Constraints:

- **No control shrinks.** DECISION-025 decoupled segment width from control size; keep it decoupled.
- Report the segment width at denominator 12, 24, and 30 at 360px. If segments fall below about 6px,
  report it rather than shipping a bar whose divisions cannot be seen — suppressing internal dividers
  above some denominator is a legitimate answer, but it is an owner call, not an implementer one.
- The `role="img"` + `aria-label` contract on the bar container is unchanged.

## Change 3 — Active beat before completed beats (agreed by owner, implementer, and orchestrator)

Folded in here because it is a vertical-space change measured on the same screens, and measuring it
twice would be wasteful. Cut it if you would rather keep this repair to the owner's stated scope.

Current order inside `.episode-beat-container` is `render-visual-section`, `render-symbolic-section`,
`completed-beats-section`, `active-beat-section`. Swap the last two.

Measured at 360px at the reflect beat: completed at 450, active at 551 — the swap moves the current
question up **101px**. Combined with Change 2 that is roughly 200px, which should bring all three
matching choices above the fold; at present only the first is visible without scrolling.

Constraints:

- **Visual stays before symbolic.** The symbolic section is 82px plus gap; moving it above the bars
  would push the first bar from 109px to about 215px — 29% of the viewport, breaking the ~15% target
  Repair 01 just met. Symbolic-first is a legitimate future composition condition to compare, not a
  default to change silently.
- Completed beats stay mounted, reachable, and inspectable (DECISION-014). Order changes; presence
  does not.
- The access-path toggle stays first in DOM and focus order.

## Change 4 — Guard the improper-fraction bar

`fraction-bar.js` renders `denominator` segments and shades `i < numerator`, with no guard. Given
`10/8` it draws eight shaded segments — a bar indistinguishable from `8/8` — while the readout
honestly says "10 / 8". The picture contradicts the number.

`matching-choice.js:12` already throws on `numerator > denominator`. The two bar renderers disagree.

No Phase 2 content reaches this: the canonical fixture resolves to `11/12`. But
`curated-like-addition-crossing-reducible` (`7/8 + 3/8 = 10/8`) is already a reviewed golden case and
`crosses-one-whole` is a first-class content overlay.

**Repair:** throw on `numerator > denominator`, matching `matching-choice.js`. Do **not** design a
two-whole or mixed-number bar here — that is OQ-20 and a later packet. The point is that the gap
should surface as a loud error the first time Phase 3 content reaches the renderer, instead of
drawing a wrong picture.

## Acceptance checks

- [ ] Authored reflection choice sets are keyed on fixture **and** established denominator; a
      twenty-fourths set exists; the twelfths set is no longer served on the twenty-fourths route.
- [ ] Missing authored set for an established route stops and reports rather than falling back.
- [ ] Choice records remain correctness-free; classification stays in the interaction layer.
- [ ] "1 WHOLE" removed from the visual bar; "in 1 whole" folded into the bar's `aria-label`; no
      tooltip introduced.
- [ ] Readout renders stacked beside the bar without exceeding track height.
- [ ] Segment width reported at denominators 12, 24, and 30 at 360px; anything under ~6px reported
      rather than resolved.
- [ ] No interactive control shrank; DECISION-025's decoupling preserved.
- [ ] `active-beat-section` precedes `completed-beats-section`; visual still precedes symbolic;
      completed beats still mounted and inspectable.
- [ ] `fraction-bar.js` throws on `numerator > denominator`, with a test.
- [ ] Re-measured at 360px at the **reflect** beat: first-bar top, current-question top, and how many
      of the three matching choices are above the fold.
- [ ] No horizontal page overflow at 360px.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] No deploy, no push, no public-URL claim.

## Not in scope

The support ladder and DECISION-026 reachability are recorded in
`reports/orchestration/phase-2-unreachable-mechanisms.md` and await owner disposition. Do not
implement either here. Mixed-number bar rendering is OQ-20 and a later packet.

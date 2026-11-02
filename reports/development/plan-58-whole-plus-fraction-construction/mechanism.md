# Plan 58 Requirement 0: proposed mechanism

2026-11-02. Proposal for orchestration approval, not implementation or acceptance.
Preflight `node scripts/dev/plan-status.js check plan-58`: RUNNABLE. Inspected
source HEAD `8355291e31579b364e1308564597540bb0d22832`. Three untracked Plan 39
route receipts pre-existed and are outside this scope. Plan 54 owner adoption
governs the count-entry task and batch; Plans 55/57 are independent.

## Ownership and identity

One source writer. Proposed new modules:

- `src/content/data/plan58-whole-plus-fraction-records.js`: immutable raw records.
- `src/content/plan58-whole-plus-fraction-task.js`: registered identity, strict
  admission and reconstruction; exact source value, without authored answers.
- `src/interaction/plan58-whole-plus-fraction-episode.js`: sole owner of raw
  responses, revision, classification, assistance, provenance and accepted form.
- `src/interaction/plan58-whole-plus-fraction-scene.js`: validated projection,
  including draft model data and withholding of the accepted form until resolved.
- `src/render/plan58-whole-plus-fraction.js`: controls, model and feedback; a
  reusable mixed-notation function in `src/render/symbolic.js` owns notation.

Narrow registrations in `src/interaction/episode-definition.js`, `episode.js`,
`scene.js`, `replay.js`, `src/app/practice-types.js`, `app.js`, and
`src/app/styles.css`, with focused tests and new report-local evidence. Task/set
`whole-plus-fraction-construction`, definition
`phase-4-whole-plus-fraction-construction`, all revision `1`; distinct item IDs
below also revision `1`. These identifiers are proposed, not historical identities.
Use shared success and direct progression. App owns help visibility and attempt
generation; episode owns assistance. Renderer owns DOM and transient composition,
not a second committed answer. More/Less expose the same help.

MAINT-42: Plan 53 already uses episode-owned response, app-owned help visibility
and an app generation guard; this new raw two-field response is distinct from its
placement. There is no demonstrated competing response owner requiring extraction.
The app has repeated task-specific dispatch/remount branches, a concrete duplication
to monitor; a shared extraction is not justified without evidence of divergent
ownership or harmful lifecycle drift. Stop and report if this work exposes either.

## Literal registered batch

| Item ID | Raw numerator | Raw denominator | Coverage |
| --- | --- | --- | --- |
| `three-fourths` | `3` | `4` | proper, zero wholes |
| `four-fourths` | `4` | `4` | one, zero remainder |
| `five-fourths` | `5` | `4` | mixed |
| `six-fourths` | `6` | `4` | unreduced remainder |
| `three-halves` | `3` | `2` | equal value, different source unit |
| `eight-fourths` | `8` | `4` | two wholes |

Records contain item identity/revision, purpose and raw form, not answers. Admission
requires exact registered record and context, canonical decimal source strings,
denominator 2 or 4, and [0,2]; reject other identities and altered forms even if
equivalent. Reconstruct from registration, preserving 6/4 separately from 3/2.

## Draft, intents and exact classification

Both raw strings start `''` (unknown). Use text inputs with numeric input mode so
intermediate malformed strings are not silently sanitized by browser number controls.
Proposed bounded raw input is at most 32 characters per field; preserve each edit
verbatim, including whitespace, until changed. Empty is missing; only ASCII digits
`^[0-9]+$` are valid (leading zeros permitted and preserved); signs, whitespace,
decimals and other characters are malformed. Compare safely as BigInt, then whole
range 0..2 and piece range 0..2d; no truncation or coercion. A length-bound violation
gets neutral guidance and is never converted to zero. Explicit `0` is known.

Context contains set/item/definition IDs and revisions, as in Plan 53. Literal
intents: `{type:'edit-whole-plus-fraction', context, field:'whole'|'pieces', raw}`;
`{type:'check-whole-plus-fraction', context, revision}`; and
`{type:'request-whole-plus-fraction-help', context, helpKind:'unit'}`. Each changed
edit increments draft revision and clears obsolete feedback, retaining other raw
field and assistance; unchanged edit is a no-op. Check requires the current draft
revision; wrong context or stale revision is refused. Help opening records the
request; closing is presentation only. Reset creates a fresh attempt; app callbacks
capture generation and check connectivity, preventing retired controls changing a
new attempt even with the same item ID. Replay records raw edit, Check and help
intents in order, including invalid/incomplete drafts; help visibility itself is UI.

Check first reports missing, malformed or out-of-range fields as neutral actionable
guidance specific to the actual issue. For complete valid fields, construct
`createMixedNumber(whole, createFraction(pieces,d))`, compare
`mixedToImproper` to the raw source using `equalFractions`, then classify unequal
as retry; equal with pieces >= d as neutral organization; equal with pieces < d as
accepted. Never normalize the learner draft. Store raw counts, source denominator,
exact value and accepted grouping separately. Scene projects each independently
valid region, including explicit zero; blank/invalid regions say not entered or
need correction and never shade zero. It exposes no derived target grouping or
mixed numeral before acceptance. On acceptance it exposes only the accepted grouping
and app-supplied notation, with provenance stating the learner grouped and the app
supplied notation.

An `input` event commits each edit immediately; update the model and feedback in
place without replacing the focused input or changing its value/selection. Defer
commits during IME composition until composition end; preserve raw draft across
view switches and resize. A Check performs one deliberate feedback focus path with
associated guidance, rather than simultaneous live announcements and focus moves.

## Journeys, copy and geometry

5/4: `1`, `2`, Check gives “Check the amount and try again.” Help asks “How many
fourths make one whole?” with an unfilled four-part whole. Edit `2` to `1` clears
feedback; Check accepts. “That’s right.”, accepted model, grouped app numeral and
Next appear. 6/4: `0`, `6`, Check gives neutral “That is [stacked 6 over 4]. Can
you make a whole from the fourths?”; no red error. Revise to `1`, `2`; acceptance
shows 1 beside stacked 2/4, retaining the source unit. Assistance survives edits.

Instruction: “Show [stacked source] as wholes and fourths/halves.” Controls “Whole
units” and “Remaining fourths/halves”. Missing/invalid messages identify the field;
wrong amount and equal-unorganized have distinct treatments. After acceptance,
proper form is fraction alone, whole-only is whole alone, and mixed form is one
unbroken whole adjacent to intrinsic stacked fraction, no plus sign. Reuse
`createSymbolicFraction`; wrapper supplies one complete accessible name and hides
duplicate visual fragments. No independent conversion quiz or Finish.

All rows have one shared whole width U and d equal pieces. Separate whole and
remainder regions show up to two rows each. 2 wholes plus 8 fourths shows four full
same-width, same-partition rows; no clipping, shrinking or regrouping. Linear summary
states only entered counts, with unknown explicit. At narrow width stack controls and
rows vertically; at Chromebook width controls may sit side by side but rows retain U.
If measured geometry is unreadable, stop at the capability gate and propose the
adopted exact count-summary fallback; do not claim a graphical counting benefit.

```text
360 sketch (unmeasured)        Chromebook sketch (unmeasured)
Show [5/4 stacked] as          Show [5/4 stacked] as wholes and fourths
wholes and fourths             Whole units [ ]  Remaining fourths [ ]
Whole units [ ]                Whole units: not entered
Remaining fourths [ ]          Remaining fourths: not entered
Whole units: not entered       [Help] [Check]
Remaining fourths: not entered
[Help] [Check]
```

## Replay and gates

Current replay has dedicated Plan 53 v13 and older readers; choose the next available
dedicated version at implementation, with exact-key validation and registered
reconstruction. Preserve all existing readers and frozen oracles, and reject altered
identity or stale intents. Verify fresh round trips for blank, malformed, partial,
help, retry, organization and accepted raw forms; don't rewrite old receipts.

Stop for approval of this mechanism and literal batch before source. Then implement
and test pure content/state/scene/replay and send a separate checkpoint; stop again
before mounted integration. Final evidence covers all six and negative admission,
withholding, revisions, replay, two journeys, four-row geometry, focus/help/reset,
navigation, 360x740 and 1093x614 DPR 1.25 plus 200% text, typography fixtures,
named mutation witnesses and a historical browser regression. Simulations do not
establish physical device, real AT speech or learner outcomes. Consultation
disposition and observed identity limits belong in delivery progress; owner rendered
acceptance and deployment remain separate. Coordinate exclusive Git windows; no push.

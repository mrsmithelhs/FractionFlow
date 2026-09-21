# Plan 09 — Repair 04

- **Packet:** `plan-09` — App Shell, Condition Switcher, and Phase 2 Acceptance
- **Date:** 2026-09-20
- **Raised by:** `specification-gap-scan.md`, verified independently in `specification-gap-scan-review.md`
- **Status:** **unblocked** — Repair 03 landed at `f92ffb5` and its Item 1 is accepted.
- **Gate:** mechanism confirmation for Items 0 and 2. Items 1 and 3–6 need no gate.

## Sequencing

Repair 03 has landed. Work from `f92ffb5` onward. Re-read each item against it before starting —
Item 3 in particular may already be resolved, in which case say so and skip it rather than re-doing
it.

## Item 0 — The premise check accepts both answers (mechanism gate)

Carried from the Repair 03 review. `phase2-bundle-4` made the `CM-01-P` form reachable, and the form
still checks nothing: `handleReflect` (`episode.js:475-481`) records the response and returns
`assessedSuccess` unconditionally. Demonstrated in the browser — answering "Yes, it is the same
amount" completes the episode, and answering "No, the amount changed," which is factually wrong for
`2/3 = 8/12`, also completes it. No recovery either way. `premiseFalseYesNotice` and
`premiseExpectedNo` are dead.

**Third problem, found by the owner: the question has no referents on screen.** At the reflect beat
the visual section contains exactly two bars — `8/12` and `3/12` — unchanged since the transform
beats. Captured live:

```
beat:  "Does this new bar show the same amount as before?"
bars:  "First fraction bar: 8 of 12 equal parts shaded in 1 whole."
       "Second fraction bar: 3 of 12 equal parts shaded in 1 whole."
```

There is no new bar. There is no before bar. "This new bar" names neither of the two on screen, and
"before" is not displayed anywhere. The owner's reading is correct: as rendered, the question cannot
be answered from the visuals.

The matching form does not have this problem — it mounts three candidate bars, so "tap the bar that
shows the same amount as 2/3" has referents. The premise form was written for a context in which a
before/after pair is visible, and no beat presents one at reflect.

Three things are missing, and the last two were never asked for:

1. **Classification.** The premise response must be classified against the mathematics in the
   interaction layer, the same way `classifyReflectionResponse` handles matching, with local recovery
   on a wrong answer.
2. **Content in which the premise is false.** Every renaming in the canonical fixture is a correct
   equivalence, so "Does this show the same amount?" always answers *yes* — the reassuring answer.
   DECISION-026 requires a case where the habitual answer is wrong, which means an authored
   **incorrect** renaming presented for the learner to reject. The existing strings already
   presuppose it: `premiseExpectedNo` reads "Good eye! The amount changed."

3. **Visible referents.** Whatever the premise asks about must be on screen when it asks. A
   before/after pair at the reflect beat, or a question rewritten to name what is actually displayed.

Required in the proposal:

- Where the incorrect renaming is authored, and how it is marked as content rather than computed.
  It must not be generated in `src/render/` or derived in a renderer.
- What the learner is looking at when the question is asked, named concretely.
- How the learner encounters it without it reading as the app making a mistake. A premise check that
  looks like a bug is worse than none.
- Whether this needs a new beat. **If it does, stop and report** — that is a packet, not a repair.
- How the replay envelope records which premise case the learner met.

Constraint: a premise check whose answer is always the reassuring one does not satisfy DECISION-026,
so "add classification" alone is not a complete answer to this item.

**Interim:** `phase2-bundle-4` currently ships a question that accepts any answer and refers to
nothing on screen. Recommend to the owner that it be unregistered until this item is designed, rather
than left in the menu. Do not unregister it without the owner saying so.

## Item 0b — "Smooth change" does not animate anything (mechanism gate)

Owner observation: "Smooth change" and "Step-by-step change" look the same during the change itself.
Confirmed, and there are two independent causes.

**There is no animation anywhere in the renderer.** `src/styles/render.css` contains no `@keyframes`
and no `animation` property except two `animation: none !important` suppressors in the reduced-motion
blocks. The `.subdivided` class that `fraction-bar.js:86` applies **has no CSS rule at all**. The only
transitions are `background-color` on segments and controls.

**And nothing could animate even if it were styled.** `fraction-bar.js:106` calls
`rootEl.replaceChildren()` and rebuilds every segment element on each render, so a denominator change
destroys the old segments and creates new ones. A CSS transition cannot run across that.

So D-01-A — animated subdivision, the provisional Bundle 1 display of DECISION-007 — was never
implemented, and the reduced-motion machinery suppresses animation that does not exist. The
learner-facing copy says "Smooth change — the bars change smoothly after you choose." It does not.

**The second cause is scoping, and it is mine.** Repair 03 Condition B scoped the choreography to
`beat === 'transform'` with `transition.changed.includes(side)`. The transition only exists *after* a
conversion is established, so at transform-left — the beat where the learner makes the first change —
every condition renders identically. Captured live:

| | at transform-LEFT | at transform-RIGHT |
|---|---|---|
| Smooth change | `2 \| 3 \| 1 \| 4` (2 tracks) | `8 \| 12 \| 1 \| 4` (2 tracks) |
| Step-by-step change | `2 \| 3 \| 1 \| 4` (2 tracks) | `Step 1: Start with 2/3 … Step 2: New parts 8/12` (3 tracks) |

The treatment never choreographs the change the learner is currently making. It shows the *previous*
operand's completed change while the learner works on the next one. My Condition B asked for the
narrow scoping and I did not notice it excludes the moment that matters.

Required in the proposal:

- How subdivision animates without a full teardown: segment identity preserved across a denominator
  change, or an explicit transitional render. State which, and confirm no mathematics moves into the
  renderer.
- How the treatment covers the change the learner just made, not only the previous one. Re-check
  Condition B's scoping against that — it may need to be "the beat in which the change becomes
  established," not "the beat where a past transition exists."
- Reduced-motion parity: the same post-state with no motion, per DECISION-009.
- The 360px layout cost of showing choreography at both transform beats instead of one.

**Stop condition:** if preserving segment identity across a denominator change requires reworking how
`fraction-bar.js` builds its DOM beyond what a repair should carry, **stop and report**. That is
`plan-10`. Rebuilding the bar renderer is not a small change and four packets depend on it.

## Item 1 — Recovery feedback never reaches the learner

The single most consequential defect in the slice. The interaction layer classifies a wrong answer
precisely; the renderers check for kinds nothing produces; every learner error at `transform` and
`operate` renders **"Not quite."**

| `classification.js` produces | renderers check |
|---|---|
| `denominator-changed-without-numerator` (`:119`) | — |
| `incorrect-equivalent-numerator` (`:121`) | — |
| `incorrect-numerator-arithmetic` (`:170`) | — |
| `invalid-reflection-choice` (`:219`) | — |
| — | `incorrect-conversion` (never produced) |
| — | `incorrect-operation` (never produced) |
| — | `incorrect` (never produced) |

**Repair:** make the renderers dispatch on the kinds that exist. Map each produced kind to its
authored string:

- `denominator-changed-without-numerator` → a message naming that specific error. This is the classic
  "changed the bottom, not the top" misconception and deserves its own copy, authored to
  DECISION-004. `strings.transform.errorScaleFactor` may fit, or write a new one.
- `incorrect-equivalent-numerator` → `strings.transform.errorNumerator`
- `incorrect-numerator-arithmetic` → `strings.operate.errorArithmetic`
- `invalid-reflection-choice` → a message, or a documented decision that the generic fallback is
  correct for a malformed identity the learner cannot produce.
- Delete the `incorrect-conversion`, `incorrect-operation`, and `incorrect` branches. Do not leave
  them beside the working ones.

Constraints:

- **Rename nothing in `src/interaction/`.** The classifier's vocabulary is the specified one; the
  renderers are wrong. Fix the consumer.
- **Do not surface the raw `patterns` array to the learner.** `classifyMathConversionResponse`
  computes named misconception patterns and the renderer discards them, which is a real missed
  opportunity — but pattern-specific coaching is a design question, not a repair. One message per
  kind here. If you think a pattern deserves its own copy, report it rather than adding it.
- Both paths. Identical dispatch, path-appropriate wording.
- **Add a test that fails against the current code**, asserting per kind that the rendered recovery
  text is the specific string and not `strings.status.stepIncorrect`. A test that only checks "some
  recovery text appeared" would have passed throughout this defect's life.

## Item 2 — The simplified final form is never offered (mechanism gate)

`preferredFinalForm: resolution?.proposed ?? null` (`scene.js:542`) reads
`state.established.resolution`, which is written **by** the intent that ends the resolve beat. While
resolve renders it is always `null`, on every route, so both renderers take the `raw` branch and
`strings.resolve.unsimplifiedNotice` can never fire.

It costs the most on the twenty-fourths route: the learner reaches `22/24` and is never shown that it
is `11/12`.

This needs a proposal because the fix is upstream. Offering a simplified form at resolve means
deriving it from the raw result — mathematics the renderer must not do and the scene does not
currently project.

Required in the proposal:

- The new scene projection: its name, where it is derived, and why it is instructional state rather
  than a renderer convenience.
- Confirmation that no `src/render/` module computes a simplification.
- What `preferredFinalForm` is then for, and whether it should stay.
- What the learner is asked. DECISION-014 and the existing resolve contract say the learner submits a
  resolution; whether simplification becomes a *choice* they make or a *notice* they receive is the
  substance of the proposal. **A notice is the smaller change and the default recommendation; a
  choice is a new learner responsibility and would be a packet, not a repair.**

Stop and report if the answer requires a new beat.

## Item 3 — The accessible path reads history before the question

`beat-container.js` appends active (`:77`) then completed (`:83`). `linear-path.js` appends completed
(`:52`) then active (`:57`). Repair 02 reordered the visual path and not the accessible one, so a
screen-reader or linear-reading learner traverses every collapsed completed beat before reaching the
current question and its controls.

This breaks the `plan-08` access-parity contract — equal reading order and equal responsibility
across paths — and it was introduced by a repair, so it is a regression rather than an inherited gap.

**Repair:** mount `activeBeatEl` before `completedBeatsEl` in `linear-path.js`, matching the visual
path. Completed beats stay mounted and inspectable (DECISION-014). **If Repair 03 already did this,
say so and skip.**

Add a parity assertion to the access-parity suite: for both paths, the active beat section precedes
the completed beats section in DOM order. Not a snapshot — an ordering assertion that reads the real
mounted output.

## Item 4 — The invalid-denominator message loses the number

The producer sets `targetDenominator` (`classification.js:80`); the renderer reads
`recovery.classification.proposed` (`beat-container.js:218`, and the linear equivalent), which is
`undefined`. The `|| 'This number'` fallback hides it, so the learner is told "This number is not a
common denominator" instead of "18 is not a common denominator."

Currently unreachable — the support ladder pins the learner to the button path where every candidate
is valid — so this is pre-emptive. It becomes learner-visible the moment either the support ladder or
numeric entry becomes reachable.

**Repair:** read `targetDenominator`. Keep a fallback, but add a test that asserts the real number
appears, so the fallback cannot hide a future mismatch.

## Item 5 — Remove the dead branches and strings

Confirmed zero call sites: `errorScaleFactor`, `validLeast`, `validNonLeast`, `noneOfTheseOption`,
`noneOfTheseCorrect`, `premiseExpectedNo`, `completedHelp`, `transitionComplete`, `stepCorrect`.

**Repair:** delete what is genuinely dead, and **keep what Repair 03 is about to use** —
`premiseExpectedNo` and the premise strings are live again once Item 2 of Repair 03 lands, and
`errorScaleFactor` may be the home for the new misconception message in Item 1 above. Check against
the accepted Repair 03 before deleting anything.

`validLeast` and `validNonLeast` are the interesting case: they are positive confirmation for a
denominator choice, unreachable because the `decide` beat gives no feedback on a correct choice.
**Report whether that is intended rather than deleting them.** A learner who picks 24 and is silently
advanced has not been told their choice was good.

## Item 6 — Dead-code guard

Every item above is an instance of one failure: a consumer and a producer disagreeing about a string
constant, with a fallback that makes the disagreement invisible.

**Repair:** add one test that enumerates the recovery `kind` values the interaction layer can produce
and asserts each one renders a specific message rather than the generic fallback. Derive the list
from the classifier's own exports if it can be done without restating them; if it cannot, restate it
and say so in the report. This is the guard that would have caught Items 1 and 4 and will catch the
next one.

## Acceptance checks

- [ ] Work based on `f92ffb5` or later; items already resolved by Repair 03 reported as skipped.
- [ ] Mechanism proposals for Items 0 and 2 reported and approved before implementation.
- [ ] A premise check exists whose correct answer is **not** the reassuring one, reachable in a
      browser by a stated sequence; answering the reassuring way produces local recovery rather than
      completion, demonstrated by a test that fails against current code.
- [ ] Everything the premise question names is visible on screen when it is asked.
- [ ] "Smooth change" visibly differs from the other treatments **at the beat where the learner makes
      the change**, not only at the following one; shown by captured output at both transform beats.
- [ ] No learner-facing label describes behavior the code does not perform.
- [ ] Every recovery kind the interaction layer produces renders a specific authored message; the
      three never-produced branches are deleted.
- [ ] No renaming in `src/interaction/`; no renderer computes a simplification.
- [ ] A test fails against pre-repair code for each kind, asserting the specific string rather than
      `stepIncorrect`.
- [ ] `linear-path.js` mounts the active beat before completed beats; a parity assertion covers both
      paths; completed beats stay inspectable.
- [ ] The invalid-denominator message names the actual number, with a test.
- [ ] Dead strings removed, except those Repair 03 revives; `validLeast` / `validNonLeast` reported
      rather than silently deleted.
- [ ] The enumerating guard test exists.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] 360px reflect-beat geometry re-measured and reported with the viewport height stated.
- [ ] No deploy, no push, no public-URL claim.

## Not in scope

- **Replay.** `replayHistory` is in `SCENE_HISTORY_KEYS` (`scene.js:38`) and `assertNoSceneHistory`
  throws if a scene carries it, so the architecture deliberately prevents replay data reaching a
  renderer. A button that promises "Replay the last change" and cannot is an owner decision — change
  the promise, or design a channel — not a repair.
- **Misconception-pattern coaching.** Worth doing, not here. See Item 1.
- **Unconsumed scene projections.** Closed; a projection with no reader is a cost, not a defect.
- The support ladder, OQ-19, OQ-20, and Requirement 3.

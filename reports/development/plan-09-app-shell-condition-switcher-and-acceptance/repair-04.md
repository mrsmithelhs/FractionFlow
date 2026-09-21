# Plan 09 — Repair 04

- **Packet:** `plan-09` — App Shell, Condition Switcher, and Phase 2 Acceptance
- **Date:** 2026-09-20
- **Raised by:** `specification-gap-scan.md`, verified independently in `specification-gap-scan-review.md`
- **Status:** drafted. **Blocked on Repair 03 landing and being accepted.**
- **Gate:** mechanism confirmation for Item 2 only. Items 1 and 3–6 need no gate.

## Sequencing — read this first

**Do not start this repair until Repair 03 is accepted.** Both touch `src/render/beat-container.js`,
`src/render/linear-path.js`, `src/interaction/scene.js`, and `src/render/strings.js`, and Repair 03's
approved mechanism changes the scene's presentation contract. Rebase onto the accepted Repair 03 and
re-read these items against it — Item 3 in particular may already be resolved by Repair 03's work, in
which case say so and skip it rather than re-doing it.

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

- [ ] Repair 03 accepted and this work rebased on it.
- [ ] Mechanism proposal for Item 2 reported and approved before implementation.
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

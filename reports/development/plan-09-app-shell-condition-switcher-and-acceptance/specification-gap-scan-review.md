# Specification Gap Scan — Orchestrator Review

- **Date:** 2026-09-20
- **Reviewing:** `specification-gap-scan.md`
- **Disposition:** **Accepted, with one finding rejected and two reframed.** Six of eight findings are
  confirmed by independent inspection. One additional gap the scan missed is recorded below.

The scan did the job it was given. It applied the reachability discipline rather than the
implemented/not-implemented one, it separated demonstrated from inferred, and it found real
learner-facing defects that four packet reviews and 210 passing tests did not. Findings 1 and 2 in
particular are the most consequential defects surfaced in this packet by anyone, including me.

## Verification

Checked independently against the code, not read from the report.

### Confirmed — Finding 1: recovery dispatch never matches

Decisive. The complete set of recovery `kind` values the interaction layer produces:

| Produced by `classification.js` | Consumed by the renderers |
|---|---|
| `invalid-common-denominator` | `invalid-common-denominator` ✅ |
| `incorrect-notice` | `incorrect-notice` ✅ |
| `incorrect-reflection` | `incorrect-reflection` ✅ |
| `denominator-changed-without-numerator` (`:119`) | — |
| `incorrect-equivalent-numerator` (`:121`) | — |
| `incorrect-numerator-arithmetic` (`:170`) | — |
| `invalid-reflection-choice` (`:219`) | — |
| — | `incorrect-conversion` (never produced) |
| — | `incorrect-operation` (never produced) |
| — | `incorrect` (never produced) |

Every wrong answer at `transform` and `operate` falls through to the `else` branch and renders
`strings.status.stepIncorrect` — **"Not quite."** I saw this myself during the first `plan-09` review,
typed `7` at a transform beat, noted that the specific string did not appear, and did not chase it.
The scan chased it.

Worse than dead strings: `classifyMathConversionResponse` computes named misconception patterns —
`DENOMINATOR_CHANGED_NUMERATOR_FIXED` is the classic "I changed the bottom but not the top" error —
and the renderer discards them. The product identifies the misconception and tells the learner
nothing.

### Confirmed — Finding 2, with a sharper diagnosis

`preferredFinalForm: resolution?.proposed ?? null` (`scene.js:542`) reads
`state.established.resolution`, which is written **by** `submit-resolution` — the intent that ends the
resolve beat. While the resolve beat renders, it is always `null`, so both renderers take the `raw`
branch and `unsimplifiedNotice` can never fire.

The scan frames this as unreachable on the 24ths route. It is broader: `preferredFinalForm` is
`null` at resolve on **every** route. The 24ths route is where it costs something, because `22/24`
is `11/12` and the learner is never shown that.

The fix is not a renderer change. Offering a simplified form at resolve requires deriving it from the
raw result, which is mathematics the renderer must not do and the scene does not currently project.
**A new upstream projection is needed**, not a re-read of an existing one.

### Confirmed — Finding 3, with a correction to attribution

`beat-container.js` appends active (`:77`) then completed (`:83`). `linear-path.js` appends completed
(`:52`) then active (`:57`). `git log -S` shows the linear path's order has been unchanged since
`ab6882c` (`plan-08`).

So both paths were completed-first until Repair 02 reordered the visual path only. **Repair 02
created the asymmetry, and my Repair 02 review verified the visual DOM order without checking the
accessible path for parity.** That is a `plan-08` access-parity contract — equal responsibility and
equal reading order across paths — broken by a repair I accepted.

The scan marked this "inferred." It is demonstrable from the two line numbers; it deserved to be
ranked higher than third.

### Confirmed — Findings 4, 6, and 8

- `classifyNoticeResponse` (`:61-68`) returns only `'correct'` or `'incorrect-notice'`; the
  `'incorrect'` branch is dead, and `notice.feedbackSame` with it.
- The `invalid-common-denominator` producer sets `targetDenominator` (`:80`); the renderer reads
  `recovery.classification.proposed` (`beat-container.js:218`), which is `undefined`, so the message
  silently degrades to "This number is not a common denominator." The fallback hides the bug.
- Dead-string counts spot-checked: `errorScaleFactor`, `validLeast`, `validNonLeast`,
  `noneOfTheseOption`, `noneOfTheseCorrect`, `premiseExpectedNo`, `completedHelp`,
  `transitionComplete`, `stepCorrect` all have zero call sites. Note that `errorNumerator` and
  `errorArithmetic` *have* call sites and are still unreachable — the scan was right to reason about
  reachability rather than references.

### Reframed — Finding 5: replay is not an oversight, it is a contradiction

Confirmed that no renderer implements visual replay. But the scan does not say why, and the why
matters: `replayHistory` is listed in `SCENE_HISTORY_KEYS` (`scene.js:38`), and `assertNoSceneHistory`
**throws** if a scene carries it. The architecture deliberately prevents replay history from reaching
any renderer.

So this is not "somebody forgot to build it." A button labelled "Replay the last change" promises
something the scene contract forbids delivering through the normal channel. The resolution is an
owner decision: change what the button promises, or design a channel that replays without putting
history in the scene. Not a repair.

### Rejected — Finding 7: unconsumed scene projections

Nine semantic fields are projected and unread, and this is not by itself a gap. The scene is a
contract for three representation roles and for renderers not yet written; `support`,
`evidenceCategory`, and `responsibility` exist so that presentation *can* remain ignorant of
instructional reasoning, and `capability` **is** consumed — `contract.js:58,67` reads
`kind === 'capability-refusal'`.

A projection with no reader is a cost, not a defect. Reporting it under the same heading as a
learner-facing dispatch failure flattens a real distinction. This one is noted and closed.

## The gap the scan missed

`invalid-reflection-choice` (`classification.js:219`) is produced and consumed by nothing, so a
malformed reflection identity would render "Not quite." In practice unreachable — every dispatched id
comes from the authored set — but it belongs in the same table as the rest, and the scan's own
Finding 1 table omits it.

## What becomes a repair

Findings 1, 2, 3, 4, 6, 8 and the missed item go to `repair-04.md`. Finding 5 goes to the owner.
Finding 7 is closed.

**Repair 04 must follow Repair 03, not run beside it.** Both touch `beat-container.js`,
`linear-path.js`, `scene.js`, and `strings.js`, and Repair 03 is mid-flight with an approved mechanism
that changes the scene's presentation contract.

## Note on the scan's own discipline

Two things it did that are worth keeping in the prompt for future scans: it gave a falsifier per
finding, and it named its blind spots instead of implying completeness. The one habit to correct is
the confidence labelling — Finding 3 is two line numbers apart and was marked "inferred," while
Finding 7 was ranked alongside defects that reach learners. Demonstrability and impact are different
axes and it collapsed them into one ranking.

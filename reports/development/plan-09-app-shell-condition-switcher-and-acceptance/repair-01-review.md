# Plan 09 — Repair 01 Review

- **Packet:** `plan-09` — App Shell, Condition Switcher, and Phase 2 Acceptance
- **Date:** 2026-09-20
- **Reviewed:** `7c911a9` (repair), `245633e` (disposition), against `41b49c0`
- **Decision:** **Repair accepted.** Packet stays `in-progress`; Requirement 3 is unstarted and
  owner-gated.

## Every acceptance check is met, verified independently

Measured in a real browser at 360×740, at the **reflect** beat — one beat deeper than the
implementer measured, so the numbers below are the true worst case:

| | measured | required |
|---|---|---|
| top of first fraction bar | **109px** (14.7%) | ~top 15% |
| top of current question | **587px** | above the fold |
| `document.scrollWidth` vs `clientWidth` | 360 / 360 | no horizontal overflow |
| app-root child order | `MAIN.app-episode`, `FOOTER.app-footer` | main first, footer last |
| `<header>` count / `<h1>` count | 0 / 1 | header gone, one h1 |
| computed footer `position` | `static` | not sticky |
| `[aria-live="polite"]` regions | 1 | exactly one |

Also confirmed by driving the live episode rather than reading the report: three matching choices
render as bars; clicking `7/12` produces `role="alert"` recovery reading "This bar has a different
shaded amount…" and **stays in the reflect beat** with all three choices intact; clicking `8/12`
resolves; "You finished this problem." appears exactly once in each path; help text renders next to
the active question *and* in the screen-reader-only polite region, same string; the footer menu opens
upward and lands fully inside the viewport.

## The architecture of the matching fix is right

This was the blocker most likely to be repaired by pushing the problem somewhere worse, and it was
not.

- `src/content/data/reflection-choices.js` authors the choice set per fixture, with an explicit
  comment that the records carry no correctness flag. They carry none.
- `classifyReflectionResponse` (`src/interaction/classification.js:210`) does the comparison in the
  instructional layer, against the learner's already-established equivalent form, using
  `equalFractions` from the math core.
- `src/interaction/scene.js:604` exposes `reflectionChoices` **only when `state.beat === 'reflect'`**
  — beat-gated, per DECISION-014.
- `src/render/matching-choice.js` draws segments from a supplied form and nothing else. Both
  renderers throw if fewer than three choices arrive rather than improvising a list.

**No DOM signal distinguishes the correct choice.** I checked rather than assumed: all three buttons
carry identical class lists (`fraction-control matching-choice-btn control-choice-btn`), identical
attribute sets (`type,class,aria-label`), and aria-labels that describe only shading ("Bar with 8 of
12 equal parts shaded"). This is the leakage question the change raised, and it is clean.

The tests are behavioral, not structural: real clicks on rendered buttons, both paths, distractor and
correct outcomes, completion counted by regex, legend asserted `sr-only`, live regions counted.

## Finding — DECISION-026 has no reachable instantiation in the shipped slice

Not caused by this repair, and it is the more important of the two facts:

- All three registered conditions set `connectionMaking: 'CM-01-M'` (`src/app/conditions.js:40,53`
  and `PHASE2_ACTIVE_CONDITION`). The `CM-01-P` premise branch in both renderers and in
  `episode.js:457` is unreachable in the app.
- The matching arm's DECISION-026 instantiation was the "None of these bars show the same amount"
  option — and the correct answer was always `8/12`, so "none" was never right. It functioned as a
  distractor, not as a check-the-premise case.
- This repair removed that option in favour of three real candidates. That is a strict improvement to
  the matching task, and it leaves `noneOfTheseOption`, `noneOfTheseCorrect`, and
  `noneOfTheseOptionLinear` as dead strings.

Net: no learner in the slice can encounter a connection-making check whose expected or habitual
answer is not the correct one. DECISION-026 exists because the owner said the check would otherwise
"become an acknowledgement like a EULA," which is what a check with a uniformly reassuring answer is.

**I credited this as satisfied in the `plan-08` final review** on the strength of
`premisePromptLinear` existing in the code. Reachability is the thing I did not check. It is the same
error the standing caution names — reading an artifact's presence as evidence of its effect — and it
was mine, not the implementer's.

**This is not dispatched as a repair.** The packet says "No new decisions. If the slice exposes one,
report it for owner disposition," and the fix is a choice about what ships: register a fourth
condition using `CM-01-P`, or author a second fixture whose correct answer is "none of these," or
accept that DECISION-026 lands in Phase 3 and say so. See the owner note in the session handoff.

## Two small things, neither blocking

1. **The correct choice is always first.** `match-a` is `8/12` at index 0. With one fixture this is
   not exploitable, but it is the authoring convention the next fixture will copy, and positional
   guessing becomes viable the moment there are two. Cheapest fix is to vary authored order now and
   add a content test asserting the correct form is not uniformly at index 0 once a second choice set
   exists.
2. **Leakage Invariant 6 is weaker than its name.** It asserts that no connection choice carries a
   `.selected` class — a class no code in the project ever applies — so the real-output half passes
   trivially and the fail-first half tests a hand-built fixture. The new three-bar surface is clean
   (verified above), but nothing in the suite would catch it becoming unclean. One assertion that the
   choice buttons are attribute-indistinguishable would make the invariant match its title.

## What remains before this packet can close

Unchanged by this repair, and all of it owner-gated:

- Owner confirmation before the first deploy of application behavior (Requirement 3, unstarted).
- The public-URL exercise and its evidence.
- The §25 acceptance evidence packet and the DECISION-021 rubric applied against rendered screens.
- Screen readers, real touch devices, cross-browser, live OS reduced-motion, and the trailing-`h1`
  heading-navigation question — all correctly recorded as unverified rather than asserted.
- A dated owner disposition naming the reviewed evidence artifact, the deployed revision, and the
  public URL. Only the owner declares the Phase 2 exit gate satisfied.

## Standing caution

The label-versus-body pattern did **not** recur in this repair. The report's claims matched the
artifact on every point I checked, including the two places it would have been easy to overstate —
the 360px numbers and the completion-count assertions — and the trailing-`h1` limitation was named as
unverified without being asked twice. Invariant 6 is a sixth-generation instance of the pattern but
predates this packet. The two instances added to the tally this round are mine.

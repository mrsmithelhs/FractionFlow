# Plan 09 — Repair 01

- **Packet:** `plan-09` — App Shell, Condition Switcher, and Phase 2 Acceptance
- **Date:** 2026-09-20
- **Raised by:** orchestrator review of `81ee07c`, `e7bd682`, driven by owner review of the running app
- **Status:** remains `in-progress`. Not accepted, not `delivered`.
- **Scope:** learner-facing surface. Source change is required, and it is bounded.

## The composition is right

Verified independently in a real browser against the local Vite server, not from the report:

- The full episode runs and the mathematics is correct end to end. `2/3 + 1/4` → common
  denominator 12 → the first bar re-divides to twelfths with 8 shaded and the symbolic form
  becomes `8/12` → `3/12` → `= 11/12`. Bars, readouts, and notation stayed consistent at every
  beat.
- The condition switcher does what DECISION-019 and DECISION-006 require. Labels are plain
  language, specification codes stay on internal data attributes, switching mid-episode preserved
  `established` and the revision, and focus returned to the gear button.
- **Enter activation works.** Dispatching `keydown` `Enter` on a focused numeric input advanced the
  beat. This closes part of what `plan-08` correctly deferred; the Space case on native buttons
  remains browser-supplied and unexercised.
- `npm test` (206), `npm run build`, and `plan-status.js lint` pass on an independent run; tree clean.
- **A real defect was found and fixed here that three prior packets missed.** `linear-path.js`
  compared `op.operation === 'addition'` when the value is `'add'`, so the accessible path rendered
  an addition problem as subtraction. Nine leakage invariants, 200 tests, and the `plan-08`
  orchestrator review all passed over it. `tests/app-shell.test.js:97` now covers it.
- **The report named its own gaps rather than claiming them.** Section 3 states plainly that exact
  360px/tablet/1440px viewport checks were not performed because the connector exposed no override,
  and that live reduced-motion and screen-reader checks were not performed. That is the honest
  position and it was volunteered.

## Blocker 1 — The connection-making check is degenerate and is not visual

`src/render/beat-container.js:456-484` (and the linear equivalent) builds the CM-01 matching check
with exactly two options: the learner's own current form, and "None of these bars show the same
amount." Rendered, the learner sees a button reading `8/12` and a button reading "None of these
bars show the same amount."

Three things are wrong at once:

1. **There are no distractors.** DECISION-012 instantiates CM-01-M as "a visual matching task with
   distractors — presenting the target bar (8/12) alongside plausible distractors (such as 7/12
   or ...)." The shipped list has none.
2. **The answer is available by elimination.** With one real candidate and a none-option, a learner
   who reasons about nothing can still answer. `plan-07`'s repair-01 proposal established the rule
   for the `decide` beat: "A 1-element list is strictly prohibited so the answer is never revealed
   by elimination." The same principle governs here and is not met.
3. **It is not visual.** The prompt says "Tap the **bar** that shows the same amount as 2/3" and the
   options are text labels. No bar is rendered. The none-option's copy says "bars" about things
   that are not bars.

This is the one beat whose entire purpose is to make the learner check that renaming preserved the
amount. As shipped it asks for a click, not a judgment. It is the strongest candidate in the slice
for a §25 "learner agency" failure, and it is a scaffold-leakage class the nine invariants do not
cover — they test that *future* truth is not revealed, not that the *current* choice set is
non-degenerate.

**Repair:** present at least two plausible non-correct candidates alongside the target, drawn from
the same source discipline `plan-07` established for candidate denominators — read from content,
never computed in the renderer, never carrying correctness metadata. Render them as bars on the
visual path; keep fractions on the linear path and keep its copy saying "fraction," not "bar." If
the content layer cannot currently supply distractors, **stop and report that** rather than
generating them in `src/render/` — that would reopen the `plan-07` renderer-arithmetic blocker.

## Blocker 2 — The completion message is printed twice, verbatim

`src/render/beat-container.js:211-217` and `src/render/linear-path.js:210-216` both set
`promptText.textContent` and a second `<p class="resolve-complete">` to the same
`strings.resolve.complete`. The learner sees:

> **You finished this problem.**
>
> You finished this problem.

Both paths. Introduced by this packet.

**Repair:** render it once. The heading alone is sufficient.

## Blocker 3 — Every choice beat prints its prompt twice

The active-beat `h2` and the choice group's visible `<legend>` are given the same string:
`beat-container.js:263-265` (notice), `:282-287` (decide), `:445` and `:477` (reflect), with the
legend rendered visibly by `controls.js:114-117`. The learner reads:

> **Do these two fractions have the same size parts?**
>
> Do these two fractions have the same size parts?
> [Yes, same size] [No, different sizes]

and again at `decide`, and again at `reflect`. This is the single largest source of visual noise in
the episode, and it is on the surface the owner reads first.

**Repair:** keep the `h2` as the visible question and make the legend screen-reader-only (`sr-only`,
already in the codebase), or drop the legend and associate the fieldset with the heading via
`aria-labelledby`. Either preserves the grouping semantics the fieldset provides. Do not simply
delete the legend and leave the group unlabelled.

## Blocker 4 — DECISION-021 criterion 1 fails at 360px

Measured in the browser at a 360px-wide viewport, mid-episode at the `transform` beat:

| | |
|---|---|
| viewport height | 752px |
| top of the first fraction bar | **278px** — 37% of the viewport is chrome first |
| top of the current question | **757px** — below the fold |
| document height | 1186px |

The chrome above the mathematics is `h1` + subtitle + introduction + "Display: …" status + the
"Read the steps" toggle: five stacked elements, four of them text.

DECISION-021 criterion 1 forbids "persistent chrome … [that] clutter[s] the scene or compete[s] with
the fraction bar and current question," and states that **any single violation is a blocking failure
at the Phase 2 acceptance gate.** A learner at the packet's own stated minimum width cannot see what
they are being asked to do without scrolling. `02-interaction-grammar.md` §71's ordering — object,
question, response mechanism, secondary support — holds in DOM order but not in what reaches the
screen.

**Repair:** see the clutter list below, then re-measure at 360px and report the two numbers (first
bar top, current question top) against viewport height.

## Blocker 5 — The rubric was not applied criterion by criterion

Requirement 4 asks that "the aesthetic rubric (DECISION-021) is applied criterion by criterion with
the honest result, including any failure." Section 4 of the report gives a single row, "Calm visual
quality," reading "restrained surfaces, a single active episode, short copy." Criteria 1–4 are not
individually answered, and criterion 1 in fact fails (Blocker 4), as does criterion 2's one-idea-per-
string rule (Blockers 2 and 3).

This is the sixth-instance pattern in a milder form: the row's label promises the rubric and its body
delivers a summary impression. The report is otherwise the most honest this project has received, and
the fix is small.

**Repair:** four rows, four verdicts, failures named.

## The clutter list

Raised by the owner from the running app, extended by this review. Items 1–3 are the owner's
direction; 4–7 are additional.

1. **Header block: cut to the title.** Remove `app.subtitle` ("Make the parts match.") and
   `app.introduction` ("Add two fractions by making same-size parts.") from the rendered header.
   *One judgment call for the owner:* if any orientation line is kept, "Make the parts match." is the
   one worth keeping — it states the mathematical goal in five words. The repair as written removes
   both; restoring one is a one-line change.
2. **Remove the "Display: …" status line from the learner surface.** It is reviewer apparatus. The
   gear menu already marks the active condition with `aria-pressed`, and presentation-posture Part 2
   says research apparatus is never visible to the learner. Keep the condition on the `data-*`
   attributes and in the replay envelope, where reviewers actually read it.
3. **"Extra help" heading: remove.** The two buttons say what they are.
4. **"Now showing … Your work stays here." — cut the second sentence.** It is reassurance nobody
   asked for and it breaks the one-idea-per-string rule. "Now showing Compare before and after." is
   enough.
5. **`resolve.prompt` "Here is your final answer." is redundant** with "The answer is 11/12."
   directly beneath it and with `= 11/12` already in the notation. Drop the heading or the sentence.
6. **The support notice is doing two jobs, and only one of them is chatter.** `app-support-notice`
   carries both display-change announcements *and* the entire response to "Need help?" — the help
   text renders in the footer aside, far below the question it answers. Do **not** remove this
   element while trimming: help would silently stop working and the single `aria-live` region the
   advisor consolidated to would disappear. Instead, route help text to the active beat, next to the
   question, and let the footer region go screen-reader-only for status.
7. **Gear menu:** no Escape key and no click-outside dismissal. Minor, but it is a menu.

## Also worth fixing, not blocking

- `.app-episode` overflows the viewport by 6px at 360px, producing a horizontal page scrollbar at the
  packet's stated minimum width.
- The production bundle is 129 kB (31 kB gzipped) for one hardcoded episode, because
  `getReplayEnvelope()` pulls the content generator, the golden-case fixtures, and validation into
  the learner bundle. Nothing in the learner UI calls it. Worth a look, not worth a packet.
- `linear-path.js` still reads `op.operation === 'add' ? '+' : '-'`, so any unrecognized operation
  value silently renders as subtraction again. Prefer an explicit map with a throw on the unknown
  case.

## Acceptance checks

- [ ] The CM-01 matching check presents at least two plausible non-correct candidates alongside the
      target, sourced from content, not computed in `src/render/`; or the content-layer gap is
      reported instead.
- [ ] Visual path renders the matching candidates as bars; linear path says "fraction," not "bar."
- [ ] The completion message appears once per path.
- [ ] No beat renders its prompt twice; choice groups remain programmatically labelled.
- [ ] Header trimmed per the clutter list; "Display: …" line removed from the learner surface.
- [ ] Help text appears next to the question, not in the footer; the polite live region survives.
- [ ] Re-measured at 360px: first-bar top and current-question top reported against viewport height.
- [ ] No horizontal page scroll at 360px.
- [ ] DECISION-021 applied as four criteria with four verdicts, failures named.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] No deployment, no push, no public-URL claim. Requirement 3 stays owner-gated.

## What is not being asked for

Requirement 3 (deployed public exercise) and the exit-gate disposition are untouched by this repair.
The implementer correctly stopped before them. They remain owner-gated and follow acceptance of this
repair, not the other way round.

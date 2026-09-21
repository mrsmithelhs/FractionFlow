# Plan 09 — Inspection Mode Focus Restore Review

- **Date:** 2026-09-21
- **Reviewed:** `9273fa8`, `b90084b`
- **Decision:** **The defect is fixed. One line must change before this is accepted.** The fix is
  correct; a guard added alongside it disables all replay focus management whenever the page is not
  visible, which is also why the browser and the test harness disagree.

244 tests, build, and lint pass independently; tree clean.

## The fix is right

`previousFocusRef` is now captured before `activeBeatEl.replaceChildren()` in both
`beat-container.js:232` and `linear-path.js:270`, guarded on `isInspection` so it only arms when
Inspection Mode is actually opening. That is exactly the correction, in both files, and the root-cause
description in the report matches the code.

Verified in the browser at `reflect`, three consecutive replays:

```
before replay:         BUTTON.control-choice-btn
during replay:         BUTTON.app-done-looking-button
after "Done looking":  BUTTON.control-choice-btn
```

**One behavioral nuance to record.** Focus returns to the *first* reflection choice, not to the choice
the learner had focused — I started on choices 1, 2, and 3 and landed on choice 1 each time. The saved
node is stale after the remount, so the `isConnected` check fails and the first-control fallback runs.
That is the behavior I sanctioned in the handoff, and it puts the learner back in the choice group
rather than at the top of the document, which was the point. It is worth naming so that nobody later
reads "restores focus" as "restores the exact control."

The harness changes are sound. `isConnected` and comma-separated selector support make `mock-dom.js`
more realistic, not less, and the added regression test fails against `b29c35b` with
`expected 'BODY' to be 'BUTTON'`.

## Required change — `isElementVisible` reads `document.hidden`

`isElementVisible` (`beat-container.js:50`, `linear-path.js:37`) walks up through `parentNode` and
tests `curr.hidden` at every level. The walk does not stop at the document element, so its last step
reads `document.hidden` — the **Page Visibility API** property, which is `true` whenever the tab is
backgrounded, minimized, or prerendering.

Measured in the browser with the pane not in the foreground:

```
document.hidden:      true
document.visibilityState: "hidden"
guard walk:  DIV:false | SECTION:false | MAIN:false | DIV:false | DIV:false
             | BODY:false | HTML:false | #document:true      ← returns false here
```

With that walk returning `false`, every deferred `focus()` call in both renderers is skipped. Focus
never reaches "Done looking" on entry and never returns on exit. Reproduced repeatedly, including the
flaky intermediate states you would expect from a guard that is `false` for reasons unrelated to the
element:

```
run 1:  before BUTTON  →  during BUTTON  →  after BODY
run 2:  before BUTTON  →  during BODY    →  after BUTTON
run 3:  before BUTTON  →  during BUTTON  →  after BODY
```

Neutralizing only that coupling — redefining `document.hidden` to `false` and changing nothing else —
makes the behavior correct and stable, 3 for 3. That is how I confirmed the fix itself is sound.

**Change:** stop the walk at the document element, or test only element nodes
(`curr.nodeType === 1`), or replace the hand-rolled walk with `el.closest('[hidden]') === null`. The
guard's purpose is to tell the visual renderer from the hidden linear one; `app.js:290` hides those
with the `hidden` attribute on an element, so an element-only walk is sufficient and correct.

**Practical severity is low** — a learner interacting with the page is looking at it, so in ordinary
use the guard is `true` and focus works. I am asking for the change anyway because the condition is
accidental rather than intended, because it silently disables an accessibility behavior in every
automated and backgrounded context, and because it is one line.

## Why the harness said yes and the browser said no

The report's focus captures are real and they are from `mock-dom.js`. `MockDocument` has no `hidden`
property, so `isElementVisible` walks past it and returns `true` — the mock cannot express the
condition that breaks the browser.

This is the second time in this packet that harness-only verification has concealed something the
browser shows immediately, and it is worth stating as a working rule rather than a criticism: a
focus, layout, or visibility claim needs the browser. The harness is the right place to *pin* behavior
once it is known; it is not the place to *discover* whether it holds.

## Minor, not blocking

`controlsContainer.querySelector('button, input') || controlsContainer.querySelector('button')` — the
second call is unreachable in a real browser, and the mock now supports comma selectors, so it is
unreachable there too. Drop it.

The mock's comma handling returns the first match *per selector part* rather than the first in
document order. Not wrong for any current use; worth a comment so it does not surprise someone later.

## Where this leaves `plan-09`

One line, in two files, plus the dead-fallback cleanup. When that lands and I have re-verified it in
the browser, implementer work on `plan-09` is complete and `owner-gate-checklist.md` governs the rest:
deploy authorization, the public-URL exercise, the §25 evidence packet, the DECISION-021 rubric against
rendered screens, and the dated owner disposition.

## Addendum — the correction was applied by the orchestrator

- **Date:** 2026-09-21
- **Change:** `isElementVisible` now stops its walk at the document in both
  `src/render/beat-container.js` and `src/render/linear-path.js`, with a comment naming why. No other
  change; the dead `|| controlsContainer.querySelector('button')` fallback is left in place as
  cosmetic.

Verified in the browser at `reflect`, with `document.hidden` forced to `true` — the exact condition
that previously disabled focus management:

```
run 1:  before BUTTON.control-choice-btn → during BUTTON.app-done-looking-button → after BUTTON.control-choice-btn
run 2:  before BUTTON.control-choice-btn → during BUTTON.app-done-looking-button → after BUTTON.control-choice-btn
run 3:  before BUTTON.control-choice-btn → during BUTTON.app-done-looking-button → after BUTTON.control-choice-btn
```

The guard still does its real job. Switched to the linear view and replayed there; two "Done looking"
controls exist, one per renderer, and focus went to the visible one:

```
done button 0:  inVisual=true   hiddenAncestor=true   isActive=false
done button 1:  inLinear=true   hiddenAncestor=false  isActive=true
```

Focus returned to a linear-path choice on exit, with no leak to the hidden visual renderer.

244 tests, build, and lint pass; tree clean.

**Implementer work on `plan-09` is complete.** What remains is owner action, listed in
`owner-gate-checklist.md`.

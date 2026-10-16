# Plan 33 mechanism and copy approval

Date: 2026-10-15. Parent review of the persisted Luna Requirement 0 proposal.
Disposition: approved with the binding refinements below. No owner decision
remains load-bearing: the existing packet already requests an entry-only guide,
current capabilities only and separate owner rendered-page acceptance.

## Selected mechanism

Use **`public/about.html`**, a standalone static document, and an ordinary relative
`./about.html` anchor from entry only. Return with `./` from that fixed filename.
Both resolve under `/FractionFlow/` and `/`; do not use nested-directory routing,
root-absolute paths, history.back, runtime router or a build HTML-transform plugin.
Vite copies public files; verify both built base paths in a bounded browser run.
Use self-contained scoped styles in that page; no remote assets/scripts.

About is reachable from entry, where no episode is being worked. It is not a
mid-episode exit. Returning is a fresh app document with no practice fragment,
consistent with current reset behavior. No extra state-preservation decision is
needed. First Tab on entry remains the first practice button; About follows
current practice/settings controls. Ordinary navigation focus starts at the
document; do not claim heading focus on full reload without observing it. Check
first-Tab practice reach on return. A visible return link appears near the page
heading, so a keyboard user does not have to traverse content to leave.

One static bar example: three of four equal parts, shown with intrinsic stacked
3-over-4 notation. Use one coherent equivalent spoken description, not duplicate
SVG, fraction and caption announcements. A semantic figure and an SVG hidden
from AT with one textual accessible equivalent are suitable. No illustration
in the app's hidden episode DOM. No browser arithmetic or handwritten model
answer tables. Keep whole/fill geometry honest. The existing fraction typography
rule is intrinsic line width, never stretching to a host lane; follow it here.

## Approved copy direction

Use one heading, **About FractionFlow**, and this short copy. Minor punctuation
and link-label corrections to match observed controls are allowed; material claims
or added paragraphs come back to parent. The design budget is not a word quota.

> FractionFlow connects fraction pictures with calculation. Practice adding
> fractions with the same or different denominators.
>
> Choose a practice to begin. Use the picture or read the steps, enter your answers,
> and ask for help when you need it. Replay is available for supported changes.
> After completing a problem, choose Next problem when offered. Try this problem
> again starts the same problem fresh; Back to start returns to the practice choices.
>
> Before practice, open the gear to choose More support or Less support. For
> different denominators, More support offers denominator suggestions; Less support
> asks you to enter one. In comparison checks, More support shows both bars;
> Less support describes the starting fraction in words. These choices change
> the support shown, not an ability score.
>
> FractionFlow doesn't track learners or save answers or progress between visits.
> Reloading starts fresh. Browsers and the website host may handle ordinary
> technical data when showing the site.

Figure accessible equivalent: **Three of four equal parts are shaded: three
quarters.** A stacked fraction can serve the visible caption with accessible
meaning provided once. Do not append the proposal's second renaming prose/example.
Return link: **Back to practice**. No redundant heading/subheading or explanatory
intro paragraph for the example. No subtraction claim or reviewer-internal IDs.

## Exact approved write scope

- `public/about.html`: copy, one static accessible example, scoped styles.
- `src/app/app.js`: entry anchor only, no instructional/lifecycle refactor.
- `src/app/styles.css`: unobtrusive entry About link/credit spacing only as needed.
- `tests/about-page.test.js`: meaningful document/link/isolation invariants.
- `tests/entry-page.test.js`: entry link/order/regression coverage as needed.
- `reports/development/plan-33-about-and-use-guide/capture-about.mjs`: bounded
  Playwright evidence script reusing existing static server where possible.
- `reports/development/plan-33-about-and-use-guide/evidence/`: screenshots and
  measurement/privacy/journey JSON from this implementation.
- Child-owned `requirement-0-proposal.md`, `child-checkpoints.md`, `progress.md`.

No Vite/build configuration, package changes, route-runner/matrix edits, third-party
dependencies, math/interaction/render changes, Bootstrap/settings/status/owner
review edits. If an additional path is required, report before editing. A focused
browser script is smaller than extending the generic route grammar for multi-page
navigation; preserve the existing matrix unchanged.

## Verification and pilot constraints

Unit/entry tests, full test/build, affected existing route checks, lint/diff.
Built project-base and root-base entry/About/direct-return keyboard and pointer
journeys, preserved registered fragments, 360x740 and 1366x768 screenshots, entry
fit, natural About scrolling, enlarged-text readability, intrinsic fractions,
no hidden example in episode DOM. Inspect runtime network/storage in the bounded
journey; distinguish static asset requests from tracking and app storage from host
behavior. Parent independently reviews final source/browser evidence and arranges
Sol-class read-only low/medium advisor review; child never fans out.

Source implementation may now begin with one child writer in the shared checkout.
Record checkpoint within 30 active minutes and stop/return by 90 active minutes
excluding owner waits; at most two consolidated implementation repair rounds.
No model substitution or new child launch. Git metadata denial: preserve files,
report precise paths and parent will stage/commit. Commit report last. No push,
deployment, complete declaration or packet status change. Owner rendered-page
acceptance remains mandatory. Any conflict with a new Plan 34 writer stops work.

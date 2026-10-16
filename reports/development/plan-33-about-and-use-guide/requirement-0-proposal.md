# Plan 33 Requirement 0 — investigation and proposal

Date: 2026-10-15 23:xx America/New_York (environment date; exact time not exposed in this report).

## Gate and baseline

- Preflight: `node scripts/dev/plan-status.js check plan-33` returned `RUNNABLE: plan-33 is ready to implement` (exit 0).
- Repository head observed: `0563d9e9924876651fb8e199b863278d212844ab` (the pilot initiation commit); initial plan record names pre-pilot baseline `3a4859c`.
- Scope: investigation and proposed design only. No application source, test, build, generated output, packet status/frontmatter, or owner-review files changed. Await parent mechanism/copy approval before any source changes.

## Current behavior evidence

Inspected `index.html`, `src/app/main.js`, `src/app/app.js`, `src/app/practice-types.js`, `src/app/support-levels.js`, `src/app/conditions.js`, `src/app/styles.css`, `src/styles/render.css`, `vite.config.js`, `scripts/dev/build.mjs`, `package.json`, and the existing entry/app-shell tests.

- `index.html` is the Vite learner entry and loads `/src/app/main.js`; Vite's base defaults to `/FractionFlow/` and can be set with `BASE_PATH`. `scripts/dev/build.mjs` builds both learner and subtraction prototype outputs. A second authored HTML document under `public/` is emitted as a static asset by Vite and needs no router/framework.
- Entry first keyboard control remains the first registered practice button (`sum-under-one`); entry composition then places the settings gear, followed by additional practice. Keep the About link after all current practice choices/settings in DOM order so practice remains the first Tab stop.
- Practice is launched by a registered fragment such as `#sum-under-one`. Mount recognizes registered practice fragments; hash changes enter/return through the app. `returnToEntry()` constructs a fresh first episode when possible, clears episode UI state, removes the fragment with `history.replaceState`, unhides entry, and focuses its title. A static page navigated to from the app naturally leaves the episode document; its return link should be the configured base URL, which reloads app entry with no fragment and therefore fresh state.
- Current app practice catalogue describes curated addition goals only; the separate prototype is not a learner practice route. Help is available during practice; Replay and Retry controls are present subject to episode state. Current support profiles are `More support` and `Less support`: the former compares both fraction bars and offers denominator suggestions, the latter asks the learner to enter the denominator and compare a new bar with the source fraction described in words. They can be selected on entry via the gear; selection is in-memory and enters a newly created episode.
- Reviewer settings also expose display/choreography/prompt/connection variants; packet correctly says their future deployment disposition is unresolved. Proposal omits them from learner copy.
- `rg` search of `src` and `index.html` for `localStorage`, `sessionStorage`, `indexedDB`, cookies, network APIs (`fetch`, XHR, `sendBeacon`, `EventSource`, `WebSocket`) found no learner persistence/tracking or app-initiated network request APIs. `createEpisode` and related state are created in app memory; return/reset builds a fresh episode. This supports the narrow claim that the app does not track learners or save answers/progress between visits. It does not establish the behavior of browser history, hosting/CDN/server logs, browser cache, extensions, or operating-system storage. Any changed dependency/runtime or later persistence work requires a fresh verification.
- Architecture references confirm the static-only Pages posture and the mathematical-state → instructional-state → presentation boundary. The guide should present existing concepts only and should not calculate example truth in its UI.

## Mechanism comparison and proposed choice

**Standalone static HTML** is the smallest mechanism: a document in `public/about/index.html` (or `public/about.html`) can be served by Vite and GitHub Pages with no JS, app bootstrap, state mounting, router, or hidden episode DOM. A return anchor can use Vite's injected base path if authored as an asset with a generated base-path value, but a plain public document does not receive Vite's `BASE_URL` substitution. Therefore root-relative `/` is incorrect for project Pages (`/FractionFlow/`), and a relative `../` approach behaves differently at nested or trailing-slash paths. We should verify the exact chosen URL contract with both `/FractionFlow/` and root-style local deployment before adopting this option; either provide an explicit base-aware generated URL or a tiny built document that receives the configured base. A static link also unloads current in-memory episode state, an acceptable behavior if the requested action is “Back to practice” and fresh-entry behavior is stated/intentional.

**Smallest existing app-page mechanism** would add a second page state to `src/app/app.js`, an About anchor/button from entry, and a return action to `returnToEntry()`. It reuses shared app typography/styles, preserves deployment paths automatically, and can preserve the current episode in memory while on About. But it expands state/navigation and focus handling, and risks mounting copied examples or exposing episode answers in hidden practice DOM. No existing generic static page/router mechanism was found.

**Proposal:** prefer standalone static content if it can be given a robust base-path-aware return link with no build/router/framework change; it is isolated from answer state and keeps the current learner entry unchanged except for one low-priority link. If Vite cannot provide a reliable public-page base link through the smallest generated/static mechanism, use the app's existing shell and add an explicit `about` view state, leaving practice state mounted but hidden only if the About DOM contains no example answers or episode data. This fallback is a load-bearing mechanism choice and must be approved by the parent before source work. The owner requested mechanism approval before source changes; parent should resolve whether unloading current in-memory episode when leaving for About is accepted.

## Complete proposed learner-facing copy (about 228 words)

### About FractionFlow

FractionFlow is a browser-based place to practice adding fractions. Pictures and equations help you see how equal-sized parts fit together.

Choose a practice button to begin. Work through each question using the picture or the step-by-step view. You can ask for help, replay a change, or retry a question. When a set offers another question, choose Next; choose Back to start whenever you want a fresh start.

Before you begin, open the settings button if you want to choose More support or Less support. More support shows both fraction bars for comparison and offers denominator choices. Less support asks you to enter a denominator and compare the new bar with the original fraction described in words. This changes the help shown during practice; it is not a score or a measure of what you can learn. You can change it again before starting practice.

Fraction bars divide one whole into equal parts. For example, three shaded parts out of four are written (3/4). When the parts are renamed as twelfths, the same amount is nine out of twelve, (9/12). The amount stays the same; only the size and name of the parts change.

FractionFlow does not track learners or save answers or progress between visits. Reloading the page starts a fresh practice. Your browser and the website host may handle ordinary technical data as part of showing any website.

**[Back to practice]**

Copy note: use one page heading only; treat the section labels above as editorial grouping, not repeated visible headings. The total remains within the requested approximate 200–300 word budget when the CTA and title are counted. The phrase about Next needs verification against the actual current item-navigation control availability before shipping; if the user must first finish an episode, adjust to “After a question is complete, choose Next when it is offered.”

## Visual examples

1. One static, inline accessible SVG example of a bar split into four equal rectangles with three shaded and a label “3/4”; it is a representation example, not an answer belonging to any active episode. Add adjacent text with equivalent meaning, e.g. “Three of four equal parts are shaded.” SVG `role="img"` plus a concise accessible name, or hide the SVG from assistive technology if the adjacent text fully conveys the same information (prefer the latter to avoid duplicate announcement).
2. Optional only if layout remains calm: a second static bar split into twelve equal pieces with nine shaded and text `3/4 = 9/12`, labeled as the same amount with a different unit. This duplicates prose somewhat, so start with example 1 only. Build simple SVG directly in the static document; do not import fraction renderers, compute math, or insert examples into episode DOM.

## Navigation, focus, and static paths

- Entry link: one ordinary `<a>` placed after the existing practice choices/settings in sequential focus order. It must not precede the first practice button. Label “About FractionFlow”.
- Guide: standalone document with `lang="en"`, one `<main>`, one `<h1>`, natural document scrolling, visible keyboard focus, and a “Back to practice” anchor. On direct page load, document title is “About FractionFlow”; the first Tab reaches the return link unless a skip link is warranted by the final markup.
- Return behavior: navigate to the canonical app base URL, no practice fragment. This reloads app entry and starts fresh, which matches reset language and avoids hidden episode answer state. If owner requires preserving an in-memory episode, the app-page fallback is required.
- Pages asset URL: Vite prepends configured base for emitted assets referenced from built HTML when paths are authored/rewritten correctly. Do not hard-code `/about/` or `/` without verifying. At `/FractionFlow/`, confirm entry About link resolves beneath `/FractionFlow/`, CSS/assets resolve, and return lands on `/FractionFlow/`; at local/root base `/`, confirm corresponding behavior. Proposed build must inspect the built HTML and run a bounded browser route check for both bases. No `history.back()` return, since direct links and history state are not guaranteed.

## Exact proposed paths (pending parent approval)

Minimal static path set:

- `public/about/index.html` — accessible content, static example, and base-aware return link.
- `src/app/app.js` — add entry About anchor only if entry is produced exclusively here; if selecting a standalone page requires base-aware href injection, use the smallest Vite HTML transform/config mechanism, tentatively `vite.config.js`, rather than adding a runtime router.
- `tests/about-page.test.js` — static structural/copy/accessibility invariants without testing literal prose as behavior.
- `tests/entry-page.test.js` — verify entry link exists and first Tab/practice button order is preserved.
- `tests/routes/about-page.spec.js` (or existing route runner's smallest extension) — built-browser checks for entry → About → fresh practice at project base and `/`, direct About route, focus, and no fragment-triggered episode. Prefer extending the current Playwright route-matrix mechanism rather than creating a second harness.
- `reports/development/plan-33-about-and-use-guide/progress.md` — implementation evidence/report (existing packet expectation).

If choosing app view fallback instead: `src/app/app.js`, `src/app/styles.css`, `tests/entry-page.test.js` or a focused `tests/about-page.test.js`, and the existing route-matrix test artifact as necessary. No independent new renderer, route framework, content dependency, storage/network API, or third-party asset.

## Validation map and unresolved questions

- Re-run `plan-status.js check plan-33` before source work.
- Unit/DOM evidence: About link’s DOM order follows practice buttons; current first Tab contract remains intact; About content is separate from active/inactive episode DOM; navigation does not dispatch a learner intent, advance, or expose answers; return starts fresh at entry title focus.
- Built-route browser evidence: direct About URL works at `/FractionFlow/about/` and configured root base; entry-to-About and return resolve under each base; no broken assets; keyboard and pointer return; `360x740` and `1366x768` observation; About scrolls naturally; initial entry layout still fits as before; current fragment practice launches still work. Existing build script empties `dist` and builds two targets, so do not run it during investigation in the shared checkout; at implementation time coordinate output ownership before choosing build command.
- Privacy evidence: source searches plus runtime network/storage observation bounded to this app version; word copy narrowly about learner tracking and answers/progress between visits. Do not assert no hosting logs or browser storage of any kind.
- Advisor consultation: this is docs-only Requirement 0, so no advisor is warranted for this proposal artifact. Parent has separately undertaken required source implementation advisor review.

Owner/parent questions to resolve before source:

1. Is unloading any active in-memory episode and returning to a fresh entry through the static About page acceptable? If no, approve the app-shell About view fallback.
2. Is an HTML transform/base-aware injected URL an acceptable smallest build mechanism for the static document, or should we choose app-shell navigation from the outset?
3. Confirm copy should say “adding fractions” because that is the currently reachable learner practice scope, even though subtraction is a project goal/prototype elsewhere.
4. Finalize accurate Next wording after confirming actual control visibility/completion conditions.

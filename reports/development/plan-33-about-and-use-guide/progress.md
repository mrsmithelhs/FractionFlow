# Plan 33 progress report — About FractionFlow

Date: 2026-10-15 (America/New_York; the child clock reported 2026-10-16 UTC).

## Summary

Implemented the approved entry-only About guide as a static HTML page. It explains the currently reachable addition practice, how to use current controls, the More/Less support choices, and the bounded answer/progress privacy behavior. The page has one static, accessible three-fourths bar with intrinsic stacked fraction notation. It is outside the practice DOM; return loads a fresh entry without a practice fragment. The entry's first Tab remains the first practice button.

Implementation and browser evidence were committed by the parent in `0542549`. This report is the final child artifact and is left uncommitted for the parent to commit separately because Git metadata is protected in this environment. Packet status, owner disposition, deployment, and push were not changed.

## Scope and changed artifacts

The approved implementation paths are:

- `public/about.html` — standalone accessible static page and scoped styling.
- `src/app/app.js` — entry-only relative `./about.html` link.
- `src/app/styles.css` — unobtrusive entry link styling.
- `tests/about-page.test.js` — static page structure, relative return, example and bounded-claim checks.
- `tests/entry-page.test.js` — link path and practice-first keyboard order regression check.
- `reports/development/plan-33-about-and-use-guide/capture-about.mjs` — bounded Playwright capture and evidence script.
- `reports/development/plan-33-about-and-use-guide/evidence/` — built-browser journey JSON and screenshots.

The approved static route uses relative links, `./about.html` and `./`, so both work beneath `/FractionFlow/` and at `/`. No router, Vite/build configuration, route-matrix, package, math, interaction, or rendering changes were made.

## Validation performed by the child

- Focused Vitest run: 2 files, 10 tests passed.
- Full `npm test`: 36 files, 361 tests passed.
- Learner build succeeded with the configured `/FractionFlow/` base and with `BASE_PATH=/`.
- `node scripts/dev/plan-status.js lint` and `git diff --check` passed.
- The existing `ROUTE-TRAVERSAL-VISUAL-NO-DISPATCH` route passed 1/1 in Chrome through the route runner API with `preferredChannel: 'chrome'`.
- Bounded built-browser journeys passed at both base paths. At 360x740, the entry fit the viewport, the About page scrolled naturally, and enlarged body text at 200% had no horizontal overflow. At 1366x768, entry and About also had no horizontal overflow. Evidence records direct About loads, keyboard entry-to-About and About-to-return, pointer return, first Tab to practice after reload, and the registered `#sum-under-one` practice launch. The static About document contains no episode or answer state.
- Across the bounded journeys, the capture recorded no requests outside the local origin, no calls to fetch, XHR, sendBeacon, WebSocket or EventSource, no `Storage.setItem` writes, and zero local/session storage entries. Source searches of app source, entry HTML, and About HTML found no matches for browser storage, cookies, IndexedDB or those network APIs. This supports the specific app claim about learner tracking and answer/progress persistence; it does not claim the host or browser stores no ordinary technical data.
- Default Playwright Chromium was not installed. The first existing route-runner invocation selected Edge and failed during launch with a temporary profile write error. Per parent direction, the targeted existing route was retried with the already installed Chrome channel and passed. No browser was downloaded and no shared route-runner or matrix file was edited.

Evidence is recorded in `evidence/journey-pages.json` and `evidence/journey-root.json`, alongside viewport screenshots. The capture script uses an explicit Chrome channel and native path-relative containment for Windows.

## Independent review and consultation

The parent independently reviewed the source and three sample screens, exercised keyboard entry/About/return and pointer return, checked fresh first-Tab practice access and the same-denominator fragment, and verified the three-of-four figure's geometry (four equal parts, three shaded, intrinsic fraction width about 21.16 px). The parent also reported an independent bounded journey with no external requests, page errors, cookies, or storage entries. These are parent observations, separate from the child's results above.

The parent-arranged read-only, default-role `gpt-6-sol` medium advisor review found no blocking source defect. Its feedback addressed bounded privacy wording, body-text enlargement rather than browser zoom, and limitations of a permissive local server. The parent additionally confirmed browser requests remained under `/FractionFlow/`, addressing that local-server limitation for the project-base journey. Advisor model identity was not independently observable. Review posture was instruction-read-only, not a verified structural sandbox guarantee. Before/after status checks matched. The parent separately reports 10 focused tests and a full learner-plus-prototype build; these are not represented as child-run checks or as a repeated full-suite run by the parent.

## Pilot accounting, limits, and remaining gate

This was one owner-authorized cold/default-role Luna implementation launch requesting `gpt-6-luna` at medium effort, followed by continuation of the same child across the Requirement 0 and implementation gates. There was no fan-out, replacement child, or direct owner relay beyond launch and the pending rendered-page acceptance. One consolidated evidence repair round was recorded. Runtime identity, token counts, cache usage, billing, and independent elapsed-cost metadata were unavailable; no model-execution or cost claim is made from self-identification.

The rendered page remains subject to owner acceptance. The page should be revisited when reachable practice goals, meaningful support/help/navigation behavior, or any separately approved privacy/storage behavior changes. Recheck the current privacy wording when storage or network behavior changes. The generic route runner's automatic Edge launch remains an environment limitation; the targeted affected route was verified with Chrome. Browser runs establish only the tested local/static app behavior and do not establish hosting-provider or browser-internal data handling. No deployment or push followed this work, and Plan 34 was not touched.

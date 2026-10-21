# Plan 42 temporary maintenance evaluation — F1

## Outcome

Implemented the bounded learner-facing response repair in the isolated detached checkout. Takeaway operate fraction-pair responses now say “Your answer” and “Check answer”. Their local `.control-fraction-error` alert receives a unique per-instance id; both inputs reference it while nonempty, and only that id is removed when either field is edited or a syntactically valid pair is submitted. Any existing `aria-describedby` ids remain intact. The association is explicitly enabled only from the takeaway branch of the operate presenter.

This remains evaluation-only. No packet status, product adoption, deploy, or merge action was taken.

## Trace log

Chronological reads and edits:

1. Opened this checkout's `AGENTS.md` for scope and commit rules. The exact task brief was absent from the detached checkout, so opened only the explicitly authorized identical brief at `reports/development/plan-42-operate-response-ownership-pilot/evaluation-worker-brief.md`.
2. Searched render source for the response string, `.control-fraction-error`, and recovery markup. Opened `src/render/controls.js` to locate input/error lifecycle, `src/render/operate-response.js` to confirm the shared visual/linear caller and takeaway branch, and the relevant subtraction strings in `src/render/strings.js`.
3. Opened `src/interaction/provenance.js` and the scene projection excerpt only to understand identity boundaries, then `tests/operate-response-region.test.js` and `tests/plan38-rendered-subtraction.test.js` to confirm mounted routes and existing checks. Opened `package.json`, `vite.config.js`, `vite.subtraction.config.js`, `scripts/dev/build.mjs`, `scripts/dev/run-route-matrix.js`, plus the relevant excerpt of `scripts/dev/capture-subtraction-evidence.mjs` to identify build outputs, the static server, and browser conventions. Opened the small `src/app/app.js` excerpts needed to identify help and restart control behavior.
4. First source edit added description association unconditionally in `controls.js`. Parent source grading identified that this changed non-takeaway fraction responses, outside the task scope. Preserved that finding and changed the behavior to explicit opt-in: `associateErrorDescription` defaults false and is passed true only by the takeaway branch in `operate-response.js`.
5. Changed the subtraction response group and submit strings in `strings.js`; no unrelated controls string was changed.
6. Created only report-local evaluation files: this report, `browser-probe.mjs`, `negative-control.mjs`, `browser-receipt.json`, and two screenshots.

Initial wrong guesses / duplicate edits:

- Initially assumed all fraction-pair response alerts could share the new association behavior. Parent review correctly rejected that scope; the explicit opt-in and negative control now preserve non-takeaway behavior.
- Initially tried to use a shell-launched Vite dev server for browser testing. The browser could not reach it; then a direct long-lived process occupied another port. Stopped that process and followed parent guidance to use `createStaticServer` in the Playwright probe process.
- The normal combined build wrote the learner bundle successfully but could not create the prototype output directory under this nested `node_modules` checkout (`EPERM`). Both learner and prototype production builds passed when their outputs were directed to the permitted temp directory. For mounted browser evidence, the learner build was also refreshed into this checkout's existing `dist` directory and served by the in-process static server.
- One PowerShell insertion attempt did not add the restart assertion because PowerShell consumed the JavaScript template syntax; corrected it with a literal patch and reran the probe. No duplicate source-code edit remained.

Concepts needed: alert ids must be unique among mounted groups; `aria-describedby` is a whitespace-separated token list; cleanup must remove only the local alert's token; and error description association must be scoped to the response owner to avoid changing unrelated fraction entry. The local validation alert and `.recovery-feedback` shell response are separate channels.

## Changed files

- `src/render/controls.js` — unique local alert ids and opt-in, token-preserving description lifecycle.
- `src/render/operate-response.js` — turns on that lifecycle only for takeaway operate responses; supplies response copy.
- `src/render/strings.js` — subtraction response group and button labels.
- `reports/development/plan-42-maintenance-arm/` — evaluation report, reproducible browser probe, negative control, JSON receipt, and screenshots.

## Evidence

- Production learner build: passed; output `dist/` (refreshed after final source change).
- Production learner and subtraction-prototype builds: passed to `%TEMP%/fractionflow-plan42-eval-b-build/learner-final` and `.../prototype-final`.
- Focused existing tests: `tests/operate-response-region.test.js` and `tests/plan38-rendered-subtraction.test.js`, 30/30 passed.
- Non-takeaway negative control: passed. A shared-unit fraction response still shows its local error, preserves an unrelated description token, and does not associate the alert with either input.
- Mounted browser probe: Chrome channel through Playwright, headless, 360×740, reduced-motion preference, pointer/fill input. Registered practice controls were used to enter the subtraction flow; no episode state was injected. Both visual and linear views passed malformed submit, repeated malformed submit uniqueness, unrelated description preservation, clear-on-input, valid-submit cleanup, draft preservation across view switch, help, restart to initial encounter, and no horizontal overflow/reduced-motion preference assertions. Full output is in `browser-receipt.json`.
- Representative screenshots: `visual-operate-help.png`, `linear-operate-help.png`.

## Limits

Browser input was Playwright pointer/fill; touch emulation, physical Chromebook/browser behavior, assistive technology behavior, and the full historical route matrix were not tested. The production learner and prototype builds were both executed, but the mounted browser route exercised the learner application only.

Advisor consultation was not warranted for this bounded render change; parent source grading supplied the scoped review finding above. No fan-out was used.

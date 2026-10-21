# Plan 42 temporary F1 maintenance evaluation

## Result

Implemented the requested temporary render behavior in the isolated evaluator checkout. Takeaway operate groups announce “Your answer” and show “Check answer” in visual and linear views. Each opted-in takeaway response group owns a unique local alert ID. Invalid submission associates that alert with both inputs; clearing an input or submitting a valid fraction removes only that alert's description token and retains unrelated tokens.

Parent source grading found that the first implementation applied alert association to every use of the shared fraction control, outside the requested F1 scope. The correction adds an explicit default-off `associateValidationError` option and enables it only at the two takeaway call sites. Ordinary fraction responses retain their prior no-alert-ID/no-association behavior, covered by a negative-control test below. The initial implementation and its scope defect remain in the prior commit for audit; this correction is a separate commit.

No app, math, content, interaction, styles, or packet-status files were changed. The shell `.recovery-feedback` remains a separate message.

## Validation evidence

- `npm run build` passed before browser verification (both learner and subtraction prototype builds completed).
- After the scope correction, `npx vitest run tests/app-plan40-subtraction-recipes.test.js tests/render-foundation.test.js` passed: 2 files, 14 tests. The additional render-foundation test submits a malformed ordinary fraction response and confirms the alert remains visible while it receives no ID and leaves pre-existing `aria-describedby` values unchanged.
- Chrome channel via Playwright mounted the registered `unlike-denominator-subtraction` practice and used its real encounter, transform, and operate controls. No episode state was injected.
- The browser probe passed in both visual and linear views for the requested labels, malformed submission, repeated malformed submission, distinct alert IDs, no duplicate token, unrelated description-token preservation, clear-on-input, and valid-submit cleanup before the view rerendered.
- Visual-route protected-flow samples passed: draft transfer across view switches, restart clearing the operation draft, task-help open/close, and the unchanged shell recovery text `Check the parts left. Try again.`
- The browser context used a 360×780 viewport and `prefers-reduced-motion: reduce`. The document had no horizontal overflow (`scrollWidth` 360); the media query reported reduced motion enabled.
- Browser input was mouse/Playwright DOM fill. This does not establish physical touch or assistive-technology behavior. The probe checked the reduced-motion preference and viewport result, not an animation-event matrix.

Reproducible browser probe and receipt are in [evidence](evidence/probe.mjs) and [browser-receipt.json](evidence/browser-receipt.json). Representative screenshots: [visual invalid alert](evidence/visual-invalid.png) and [linear valid completion](evidence/linear-valid.png).

## Change trace

Chronological files opened and reason:

1. `AGENTS.md` in this evaluator checkout, for repository constraints and commit rules.
2. The assigned `evaluation-worker-brief.md` from the exact parent-authorized path, for F1 behavior and evidence scope.
3. `src/render/controls.js`, `src/render/strings.js`, `src/render/beat-container.js`, and `src/render/linear-path.js`, after searching render sources to locate the shared fraction input and the two takeaway call sites.
4. `tests/render-foundation.test.js`, `tests/app-plan40-subtraction-recipes.test.js`, and `scripts/package.json`/root `package.json`, to identify focused existing tests, the mounted flow, and build commands.
5. `src/app/practice-types.js`, `src/app/app.js`, `src/content/data/plan36-like-denominator-subtraction-records.js`, and `scripts/dev/run-route-matrix.js`, to choose a registered browser path and reuse the existing static serving behavior without injecting episode state.

Chronological files edited and reason:

1. `src/render/controls.js`: added a per-mounted-control unique alert ID, token-preserving description updates, and optional submit text; reused the updater on invalid submit, input clear, and valid submit.
2. `src/render/strings.js`: supplied the requested group and submit copy.
3. `src/render/beat-container.js` and `src/render/linear-path.js`: passed the new submit copy only for takeaway subtraction responses.
4. `reports/development/plan-42-maintenance-arm/evidence/probe.mjs`, `browser-receipt.json`, and the two screenshots: reproducible mounted checks, result receipt, and visual witnesses.
5. `tests/render-foundation.test.js`: added a negative control proving description association stays off for an ordinary fraction response.
6. This report records the initial scope defect, its correction, validation, chronology, and limitations.

Correction chronology:

1. Parent source grading identified that the first implementation's `setError` associated the alert for every shared fraction response. This was a real scope defect; the prior report overstated the scope as takeaway-only.
2. `src/render/controls.js`: added `associateValidationError = false`; alert IDs and description-token updates now occur only when opted in.
3. `src/render/beat-container.js` and `src/render/linear-path.js`: opted in only for takeaway operate controls. These two identical pass-through edits are mirrored implementation edits and are counted as duplicates in the parent grading record.
4. `tests/render-foundation.test.js`: added the ordinary-fraction negative control.
5. Rebuilt, reran the two focused test files, and reran the mounted Chrome probe against the rebuilt output.

## Wrong guesses and corrections

- I first used the same-denominator subtraction practice, then saw its help control hidden after the operation had resolved. I moved the help check to the active operate question and used the registered unlike-denominator route for the required operate behavior.
- My first browser server attempt targeted the Vite dev server, which timed out from Chrome in this isolated setup. I switched the probe to the repository's static test server, which served the already-built `dist` output successfully.
- I initially checked a removed error node after valid submission; the successful local submit synchronously resolved the operation and replaced the mounted form. The probe now retains the input references immediately before submission and verifies cleanup on those nodes before rerender completion.
- The first guessed correct result was `3/8`; the registered task in this browser route expects `3/10`. I corrected the value after the mounted flow rejected the guess.
- The mirrored `buttonLabel` and `associateValidationError` pass-throughs in the visual and linear renderers are duplicated call-site edits, as expected for parity; parent grading counts them as such. Probe iterations changed only the isolated evidence script; the final receipt reflects the passing version.

## Concepts used

- `aria-describedby` contains whitespace-separated ID references, so the cleanup must remove exactly the current alert ID while retaining unrelated references.
- A unique ID is allocated when each opted-in response control mounts, while repeated submissions reuse that control's ID.
- The render layer owns the local alert behavior; interaction state and mathematical correctness remain outside this change.
- A shared render control must default to existing behavior and require explicit opt-in for a narrow presentation change, so unrelated fraction response tasks do not inherit F1 behavior.
- Shell `.recovery-feedback` conveys answer-recovery guidance and is independent of the control's malformed-input alert.

## Commit and limits

Initial implementation commit: `20c7708dd68bb827a753997f47579a131b89a238`. The scope correction is committed separately. This is an evaluation-only detached checkout. It has not been adopted into the main checkout, pushed, or merged. Parent grading and any adoption decision remain separate. The browser receipt is bounded to the tested route and contexts; it does not establish physical-device, assistive-technology, or broad motion behavior.

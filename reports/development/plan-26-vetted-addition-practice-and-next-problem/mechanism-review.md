# Plan 26 execution mechanism review

Date: 2026-10-10. Disposition: **approved with the bounded requirements below**.
Baseline: `9b25ddd` (owner set Plan 26 in-progress); working tree clean;
preflight independently returned RUNNABLE. The actual owner message in FF Impl 26
authorizes bidirectional proposals, review, corrections and clarifications with
FF Orch 12+. DECISION-041's contract is already accepted. This approval permits
the scoped source implementation; it does not accept its eventual delivery or
authorize push/deployment. No source edits or tests were performed by this review.

## Approved mechanism

- Keep the sole current learner goal/label and a finite app-owned ordered set:
  existing `2/3 + 1/4`, then newly authored `1/2 + 1/3 = 5/6`. Give the second
  fixture a unique immutable identity/revision. Author both admitted targets 6/12
  and complete condition-specific premise/reflection facts; prove both premise
  outcomes across the authored routes. No generated fallback or new family/task.
- Keep `phase-2-unlike-proper-addition-reflection@3`, replay schema
  `fractionflow.episode-replay/v1`, and the frozen episode schedule. The definition
  governs unchanged task semantics independently of operands. Next/set position
  belongs to app navigation, not reducer intents or an aggregate replay/session.
- Only actual `status === 'resolved'` permits Next, after reflection where enabled.
  Retry reconstructs the active item. Next selects the second vetted item and
  clears episode/UI work. Return/re-entry selects the first item. Preserve selected
  condition/support and visual/linear access view; declare applicability explicitly.
- On final-item completion, omit Next and use one concise exhaustion message:
  “You’ve tried both problems.” Retain Retry and Back to start. Missing/corrupt
  next data produces a short refusal with those recovery actions and retains the
  known completed episode. No silent wrap or configuration mutation.

## Binding requirements included in approval

1. **Revision-aware authored data.** Both premise and matching-choice accessors
   must recognize the supported `(fixtureId, authoringRevision)` before returning
   route data; missing, unknown or mismatched revisions return null. A bounded
   companion revision map/guard suffices. Keep old fixture, premise and choice
   objects, forms, order and IDs exactly unchanged; do not add metadata to old
   returned objects that would change recorded scene/replay meaning. Append the
   new records and stable IDs. Pin each record set to its immutable identity;
   future authoring changes require a new identity rather than in-place replacement.
   No envelope or definition migration is required for this bounded increment.
2. **Actual admission and transactional navigation.** Validate the candidate's
   identity/forms/definition, supported configuration and complete authored paths
   before replacing the completed item. Validate premise expected answers against
   exact math-core equivalence and matching facts/IDs against their task contract;
   metadata presence alone is insufficient. Missing/corrupt data must not advance
   the index, discard the completed state or clear its mounted work. Commit the
   new state/index and reset transient UI only after successful admission. Keep
   mathematical validation upstream, with app composition consuming its result.
3. **Focus follows actions/transitions.** After successful Next/Retry, render then
   focus the connected visible `.app-episode` landmark. Focus exhaustion on its
   first transition into final-item completion; focus refusal after a failed Next
   action. Do not refocus either on ordinary rerenders, view changes or motion
   preference changes. Use mounted real clicks/keyboard, then verify tab order.
4. **Full reset and preserved test injection.** Prove fresh instructional state
   against an independently constructed expected episode, plus UI drafts/help,
   replay overlays, input-preservation flags and renderer motion bookkeeping.
   Preserve the existing suppliedInstance test hook, but do not treat an unmatched
   injected instance as an admitted set item or reuse it as the Next target.
   The visible mathematical forms must actually change, not only an item index.
5. **Concise completion surface and honest coverage.** Avoid duplicate completion
   banners/explanations and disabled spent controls. Review full journeys in both
   access views, both support profiles and applicable conditions; distinguish a
   well-formed valid but unsupported denominator from a wrong answer. No claim of
   independent transfer, physical-device typing or AT evidence follows from routes.

## Owned source and evidence scope

Approved: the three identified content data modules, `src/app/practice-types.js`
(or one narrow app set module), `src/app/app.js`, focused content/app/entry/premise/
replay tests, route matrix and contract assertions, and this packet's evidence/report.
The existing `scripts/dev/run-route-matrix.js` may gain bounded assertions for
these witnesses. A narrowly named `src/content/authored-task-data.js` is allowed
only if needed to share revision/admission validation; no generic authoring/schema
framework. Small navigation/status-only changes in `src/styles/render.css` and
centralized new app strings in `src/render/strings.js` are allowed if necessary.
The existing “6 equal parts” fallback is correct; “sixths” is not required.

No reducer/renderer semantics or replay/definition schema changes are anticipated
or approved. If reset evidence reveals that a renderer lifecycle repair is necessary,
report the concrete finding before expanding that source scope. Preserve unrelated
work and current route rows/legacy oracles; do not weaken witnesses to fit the change.

## Independent checks and required delivery evidence

Root inspected practice registration, current start/Retry/return and view retention,
terminal-state guard, content reconstruction, authored accessors and path closure.
A read-only explorer independently traced definition and replay admission and
confirmed the revision-only lookup gap and metadata-trusting premise classification.
Its code references and findings were checked against the actual accessors and
replay reconstruction. This was source review, not executed behavioral evidence.

Delivery must include unknown-revision and missing-route refusals, authored-truth
checks, unchanged legacy replay oracles, second-item round trips for both units
and reflection conditions, and real mounted completion/Next/Retry/reset/exhaustion/
refusal routes. Include retained settings/view, keyboard/non-drag touch-context,
standard/reduced motion, narrow and Chromebook CSS measurements, and existing
motion/Inspection Mode focus regressions. Keep counts and coverage limits explicit.

Apply the inherited advisor declaration/disposition and scoped commit discipline;
progress.md remains the implementer's final commit. Stop at delivery review and
owner rendered/agency acceptance. No push or deployment.

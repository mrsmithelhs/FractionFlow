# Plan 59 Requirement 0 — proposed mechanism

2026-11-02. Proposal for orchestration approval; no source implementation or acceptance. Preflight `node scripts/dev/plan-status.js check 59` returned RUNNABLE. Baseline `4a3e1d2` closes Plan 58. Three untracked Plan 39 route receipts pre-existed; leave them alone. Plan 55 owner adoption and Plan 59 govern. This proposal is subject to the separate mechanism and pure checkpoint gates.

## Source trace and ownership

`src/math/fraction.js` provides exact `createFraction`, `addFractions`, `subtractFractions`, `compareFractions`, and `equalFractions`; arithmetic preserves same-denominator raw result and rejects negative subtraction. Plan 53's content module creates `step-i` lattice candidates and validates a resolved registered context; its episode owns placement, revision, check, assistance and provenance; its scene projects verification only when resolved. Its renderer has separate tray, nearest-target preview, cancellation, step correction and linear choices. Plan 53 repair documents connected feedback and the physical-device limitation of dense eighths. Plan 58's pure checkpoint confirms one episode response owner, app-owned disclosure, generation guards and scene withholding. `app.js` increments `currentEpisodeGeneration` when installing a fresh episode and guards task callbacks; shared progression prepares a destination before installation, then exposes Next/final Back. View changes cancel active gestures. Plan 53's context alone lacks an attempt generation: do not rely on item identity or placement revision alone after same-item restart.

Proposed sole source writer and exact scope:

- New `src/content/data/plan59-directed-endpoint-records.js`: six immutable literal records only. New `src/content/plan59-directed-endpoint-task.js`: registered reconstruction, exact admission and derived lattice/endpoint.
- New `src/interaction/plan59-directed-endpoint-episode.js`: sole committed response, attempt revision, checks, help/retry/provenance. New `src/interaction/plan59-directed-endpoint-scene.js`: validated presentation projection and acceptance-gated verification.
- New `src/render/plan59-directed-endpoint.js`: task-specific display and controls; reuse/extract only demonstrated shared placement behavior from `src/render/plan53-two-whole-location.js` or `src/render/number-line-locate.js`, with narrowly necessary styles in `src/app/styles.css` or `src/styles/render.css`. Avoid copying an entire renderer just to relabel it; identify any extraction before broadening scope.
- Narrow dispatch/registration in `src/interaction/episode-definition.js`, `episode.js`, `scene.js`, `replay.js`, `src/app/practice-types.js`, `app.js`, and exports only if required. New focused `tests/interaction-plan59-directed-endpoint.test.js`, mounted/evidence probes under this report directory, plus minimal shared tests where necessary. No edits to old task identities, fixture oracles or historical evidence.

Proposed set `directed-number-line-endpoint`, definition `phase-4-directed-number-line-endpoint`, revision `1` each; item revision `1`. Exact filenames/identities above are proposals, not existing public contracts. Episode owns response and assistance; app owns attempt generation, view/help visibility and navigation; renderer owns transient gesture/focus/highlight only. Help visibility survives view/resize and is reset on fresh attempt; help history remains episode state. One response owner in both views; More/Less show identical pilot controls and help.

## Literal records and admission

| Item ID | Start numerator / denominator | Operation | Amount numerator / denominator |
|---|---|---|---|
| `one-fourth-add-two-fourths` | `1` / `4` | `add` | `2` / `4` |
| `three-fourths-subtract-two-fourths` | `3` / `4` | `subtract` | `2` / `4` |
| `one-sixth-add-three-sixths` | `1` / `6` | `add` | `3` / `6` |
| `five-sixths-subtract-three-sixths` | `5` / `6` | `subtract` | `3` / `6` |
| `two-eighths-add-three-eighths` | `2` / `8` | `add` | `3` / `8` |
| `seven-eighths-subtract-five-eighths` | `7` / `8` | `subtract` | `5` / `8` |

Store strings as raw forms, operation and identity, not result, answer index or direction key. Resolve exact immutable registered record; reject altered identity/fields even if mathematically equivalent. Validate operation, equal denominator in {4,6,8}, positive proper inputs and result strictly between zero and one through exact core. Derive `step-0` through `step-d` with raw i/d, including zero/one wrong responses. Calculate endpoint using exact operation; compare candidate with `equalFractions`, never pixels. The six raw results for verification are 3/4, 1/4, 4/6, 2/6, 5/8, 2/8 respectively; these are derived, not authored record fields.

## State, projection and lifecycle

Initial placement null; fixed start is supplied and distinct from the unplaced endpoint tile in its tray. Proposed intents carry set/item/definition context: `place-directed-endpoint` with candidate ID; `check-directed-endpoint` with current placement revision; `request-directed-endpoint-help` with placement help kind. Placement changes revision and clears stale feedback without submitting; same candidate is a no-op. Check empty gives neutral incomplete, wrong retains editable draft and adds retry, right establishes accepted endpoint and resolves. Help opening records assistance; closing only changes disclosure. Assistance and feedback survive access/resize; no mastery inference. State validates registered context, candidate, intent shape, active stage and revision. App callbacks additionally capture current episode generation and active renderer/control status; restart retains record/definition but increments generation and clears draft, feedback and help, so an old callback is rejected even when IDs and revision recur. Next installs a new item and generation. Resize/view changes cancel transient gesture, preserve committed state and disclosure, and do not check.

Scene before acceptance contains supplied raw start, operation and amount, candidate lattice, tentative placement, feedback, support and help provenance; it must omit/null derived result and verification arrow, including accessible labels and hidden DOM. A learner's own wrong or right tentative marker may appear; it is not represented as correct before Check. Accepted scene exposes derived raw result and directed interval with start, endpoint and direction. No help marks, counts out, or verbally identifies destination. Example help: “Start at the first fraction. Add moves right; subtract moves left. Count equal parts.”

## Access, copy and geometry

One stacked expression, “Place the end on the number line.” Distinct supplied start marker and endpoint tile; Check is explicit. Tap/click/touch candidate or optionally drag with nearest highlight, cancel and correction; no dragging required. Keyboard spatial previous/next moves the tentative endpoint in line order with visible focus; first action must establish a placement deliberately, never silently default it. Linear exact-position choices remain a separately disclosed more-verbal cue path and share the same committed response and Check. If density makes the active path incapable of faithful placement, preserve the attempt and report capability rather than changing mathematical admission by viewport. Wrong: “Check the direction and number of equal parts.” Empty: “Place the end first.” Accepted: “That's right.” Associate feedback with controls and use one deliberate focus/announcement path. Help toggle, draft and provenance survive view/resize. Post-acceptance shared Next/final Back; no direction quiz, extra result entry, Finish or mandatory animation. Reduced motion gives the same immediate static verification.

One document-coordinate snapshot supplies line endpoints x0,x1, ticks, start, accepted endpoint and arrow. U=x1−x0 is the whole; start x0+(a/d)U, each step U/d, endpoint x0+((a±b)/d)U. Arrow starts at supplied start, ends at accepted endpoint, has length (b/d)U and arrowhead at endpoint; addition points right, subtraction left. Candidate mapping, marks and accessible choices share the same lattice. Arrow and derived numeric result are absent before acceptance. Geometry assertions compare measured coordinates from the same snapshot, with named failures for wrong start, reversed direction/distance, candidate or scale drift and premature reveal.

## Journeys and sketches

Addition: 1/4 + 2/4; choose 2/4, Check yields retry with draft intact. Choose 3/4, Check accepts and shows a rightward two-quarter arrow and shared Next. Subtraction: 5/6 − 3/6; choose 4/6, Check yields retry; open neutral Help without changing draft, choose 2/6, Check accepts with leftward three-sixth arrow; assistance remains recorded. Neither journey treats supplied start or app-provided verification as learner work.

```text
360 x 740 (unmeasured)             1093 x 614 (unmeasured)
 [1/4] + [2/4]                     [1/4] + [2/4]   Place the end
 Place the end                     0 --- start --- tick --- tick --- 1
 0 -- start -- tick -- tick -- 1   [endpoint tray] [previous] [next]
 [endpoint tray]                   [Help] [Check]   feedback
 [previous] [next]
 [Help] [Check]
 feedback; Next after acceptance
```

At 200% allow wrapping and vertical scroll, preserve line/tile containment; sketches are not measurements. Both operations, access paths, real pointer and emulated touch, off-center snap/correction, focus, help, resize, stale controls, reduced motion and direct progression need mounted observation. Actual device, AT speech and learner outcomes remain unverified.

## Replay and gates

Current dedicated Plan 53 reader is v13 and Plan 58 is v14. This new definition, task context and intent semantics warrant a dedicated proposed v15 envelope with strict keys, registered identity/reconstruction, definition, support, active condition and ordered intents; reconstruct then apply with strict validation. Attempt generation is a live app callback guard, not a random replay identity: replay rebuilds one attempt from its recorded intents, while restart produces a fresh state/history. Preserve v1–v14 readers and frozen fixtures; reject tampered identity/context/intents and verify old envelopes without regenerating oracles. Test all records and both support profiles, negative admission/operation, incomplete/wrong/revised/help, stale revision/context, same-item retired callback, withholding and replay.

Stop for mechanism approval before source. After approval implement and test only pure content/state/scene/replay, send a separate checkpoint and stop before mounting. Final delivery requires named mutation witnesses with actual assertion failures and clean restoration, isolated historical matrix, unit/build/lint/diff, and scoped progress report committed separately last. Coordinate exclusive Git windows. Consultation at delivery: at most one cold read-only `gpt-6.1-terra` medium pass if orchestration judges substantial; no Sol/Astra, substitution or fan-out. Record requested versus observed identity and honest read-only posture; if capability cannot be established use orchestrator-gate-only and disclose it. Owner rendered acceptance, closure and deployment remain separate.

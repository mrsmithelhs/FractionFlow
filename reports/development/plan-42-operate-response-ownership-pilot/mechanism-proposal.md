# Plan 42 Requirement 0 mechanism proposal

Date: 2026-10-20  
Baseline: `17b6b69d05f5c57414e6a08300e289bf7e6c2286` (tree clean before proposal).  
Preflight: `node scripts/dev/plan-status.js check 42` → `RUNNABLE: plan-42 is ready to implement`.

## Proposed slice

Subject to orchestrator approval, add `src/render/operate-response.js` to construct the existing operate response controls, submit wiring, and task-help paragraph shared by both renderers. It receives explicit view variant/prefix, scene, strings, help-open presentation state, recovery proposal where currently used, and existing dispatch callback. It returns an element and a handle. It does not evaluate answers or import task definitions/content.

Select the existing response form from scene facts: `scene.meaning.takeaway` → subtraction fraction pair; otherwise `scene.meaning.unitRelationship.commonUnit?.kind === 'already-shared-unit'` → operation fraction pair; otherwise → single numeric numerator with the current common denominator. Preserve ids, classes, accessible names, visible copy and existing intent/payloads for parity.

Exact current seams:

- `src/render/beat-container.js`, `createBeatContainer` → `renderActiveBeat()` → `case 'operate'` (around 707): visual controls/help/dispatch. `update()` rerenders; `destroy()` removes root and clears render token.
- `src/render/linear-path.js`, `createLinearPathRenderer` → `renderActiveBeat()` → `case 'operate'` (around 834): mirrored linear controls/help/dispatch; same update/destroy lifecycle.
- Both renderers construct `.recovery-feedback` before the beat switch. Keep this instructional shell recovery there.
- `src/render/controls.js:createFractionResponseInput` creates `.control-fraction-error[role=alert]`; invalid submit sets it, input clears it, and valid submit clears it before dispatch. F1 associates this *local validation alert* with both fraction inputs while nonempty, preserves other `aria-describedby` tokens, and removes only its own association on input-clear or valid-submit. It does not relocate or associate shell `.recovery-feedback`.
- `src/app/app.js`: `operationDrafts` near 299; view-toggle capture/restore/focus-preservation around 550–578; definition/id selection in `getVisibleOperationInput()` around 965 and capture/restore around 982–1000; action focus decisions around 1290–1311. App keeps draft storage/reset timing and focus decisions.
- Both renderer public objects near file ends currently expose mount/update/destroy. Proposed addition: `getResponseRegion('operate')`, returning the current handle or `null`.

## Proposed handle and lifecycle

```js
{
  kind: 'fraction' | 'single',
  primaryInput(),       // connected, visible current input or null
  readDraft(),          // raw strings: fraction {kind,numerator,denominator}; single {kind,value}
  writeDraft(draft),    // matching current form only; false when stale/invalid
  focusPrimary(),       // focus current visible target; false when unavailable
}
```

App calls the current active renderer after render; it must not cache handles across update/remount, view switch, beat change, Retry, Next, help, or re-entry. Renderer invalidates old handles before replacing controls or destroying. A hidden renderer's controls are not valid merely because connected. No mounted operate region (other beat/resolved/destroyed) legitimately returns `null`; a missing required control within a mounted operate region must fail a focused guard/test. No selector fallback or broad catch.

The app treats the handle draft as opaque wire data: capture stores the value returned by the current handle and restore passes it back to the current handle without selecting by kind or definition. The handle validates that its kind matches the current region before writing; mismatch/staleness returns false, preventing a fraction draft from entering a single input. App reset policy remains authoritative and may clear through the current handle. Preserve raw empty/partial strings. Do not create a general representation draft union or encode a future number-line preview as a fraction. Preserve existing pointer/keyboard focus behavior and field-specific decisions; the region only supplies current targets and does not decide focus timing.

## Guard and evaluation checkpoints

After mechanism approval, repair only the existing Plan 38 witness `tests/routes/route-matrix.json` entry `ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION`: assert both values after each direction using freshly queried mounted nodes, and focus under deliberate pointer and keyboard gestures. Seed draft-loss and wrong-focus defects and show normal assertions reject them. Preserve unrelated route rows/fixtures; pair negative selectors with positive current-state checks. Ensure render-purity inventory covers the new module without weakening exclusions.

Commit repaired baseline A and record its SHA/results in `guard-checkpoint.md`; stop for orchestrator review before extraction. Then implement the region as baseline B and test both forms/views, raw drafts, existing intents, missing controls, hidden/disconnected/stale handles, and legitimate null outside operate. Build final production source before browser capture.

Parent dispatches isolated A/B evaluation at the same repaired baseline, identical temporary F1 and bounded cold-start evaluators. F1 is only takeaway subtraction fraction controls: group `Amount left` → `Your answer`, submit `Check` → `Check answer`, plus the local `.control-fraction-error` association described above. Do not merge F1 into production B. Compare matched browser behavior/screens for drafts/focus, help/repeated invalid submits, accepted response/retry/Next/re-entry, both views/forms, applicable profiles, reduced motion, touch-context and responsive layout. Record source-edit cost separately from guard, build/browser and evidence work; leave unobserved time/token data unavailable and allow an inconclusive result. No automatic Vue comparison or Plan 39 launch follows.

## Approval questions

1. Approve the app treating handle draft values as opaque and the handle rejecting a kind mismatch, so app does not gain another form-selection branch?
2. Approve nullable `getResponseRegion('operate')` on both renderers and explicit `false` from stale handle operations?
3. Confirm F1 targets only `.control-fraction-error`, with clear-on-input and successful-submit cleanup, while shell recovery remains separate?

Requirement 0 only: no source, test, route, script, packet-status, or acceptance files changed.

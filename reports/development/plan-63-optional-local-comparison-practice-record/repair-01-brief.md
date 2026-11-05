# Plan 63 Repair 01 — retired controls and readable record

2026-11-04. Independent delivery review of source `22150cf`, evidence `a14eb6e`
and progress `059e924`. Delivery is not accepted yet; packet remains in-progress.
No extra advisor is warranted: the existing Terra pass is recorded, and parent
will review these bounded corrections inline.

## Reproduced blocker

`createComparisonRecordController.destroy()` sets disposed, but `change(method)`
still calls storage before checking that flag. Retired panel action listeners
likewise call perform after panel destruction. Parent reproduced both:

- Synthetic controller `destroy(); clear()` invokes the storage clear operation.
- Actual isolated Chrome: enable, correctly compare, return, open Clear confirmation,
  retain its button, same-app destroy/mount, click retired button. Record count
  changes from 1 to 0. This is not a report-only possibility or a live user action.

Make new controller actions/admissions/refresh requests after destruction inert,
and retire panel event handlers/continuations appropriately. Guard at both lifecycle
boundaries where necessary. Preserve already-admitted immutable writes from valid
live transitions and intentionally initiated operations; do not solve this by losing
pending accepted evidence or cancelling ordinary navigation. A stale control must
not enable/stop/clear/reset or launch practice in a new shell.

## Required presentation completion

- The approved mechanism calls for an accurate item label. Current rows show only
  indistinguishable outcome sentences. Derive the original comparison pair from
  authoritative validated content and display it using existing fraction typography.
  Do not persist raw source/response values or expose internal item IDs. Keep outcome
  concise; disclose assistance separately. No new mathematical oracle or breadth claim.
- Replace label-keyed focus restoration with stable semantic control identities.
  Opening Stop/Clear currently leaves duplicate identically named triggers and
  confirmations; View→Hide also loses its label key. Keep confirmation actions
  unambiguous, focus the relevant confirmation/Cancel and restore appropriately.
  Avoid a modal framework or general focus refactor. Test real keyboard actions.
- Use operation-specific completion text: stopping says remembering is off and old
  activity remains; clearing while off does not imply a new problem alone starts
  remembering. The fresh-problem notice belongs only where enabled/eligible state
  requires it. Preserve failure truthfulness and keep wording short.

## Ownership and proof

Own controller/panel and necessary safe projection, focused tests and report/browser
evidence. No task, storage-policy, math/replay, session-controller or public-privacy
scope expansion. If a new app hook is necessary, identify it first.

Add negative regression for retired destructive callbacks and retained practice
callback, including real same-app remount. Show valid pending observations still
persist. Verify pair labels, View/Hide and Stop/Clear/Cancel keyboard focus, off/on
completion messages and cross-tab generation safety. Refresh representative panel
screenshots at narrow/Chromebook/enlarged text; do not overwrite earlier receipts.
Run focused tests and targeted browser checks; no automatic repeat of full suite,
build/matrix or reviewer unless new changes/failures justify it. Exact source timing
of existing broad evidence remains qualified. Stage scoped commits, progress last,
release source/Git and send directly for re-review. No status/acceptance/push/deploy.

# Plan 11 Repair 01 delivery re-review

Date: 2026-10-04. Reviewed implementation `2603fe1`, report `fa8405b`.
Working tree was clean at review start. Packet remains delivered.

## Disposition

Repair 01 closes the Replay/new-conversion trigger, partial/settled boundary-height
evidence, and mounted reduced-motion Replay gaps. Technical acceptance remains
withheld for a confirmed bar-position defect and a regression in the conservation
witness. Use `repair-02.md`; source work, owner motion judgment and release remain
separate gates. Plan 22 is not part of this repair.

## Verified repaired behavior

The renderer keys a new accepted conversion on semantic endpoints plus the mounted
pre-form and changed side, rather than dismissing every post-Replay conversion as
old work. The direct browser journey observes the new right-side effect without
restarting established left work. Help does not restart the established conversion.
The observer now rejects no-op keyframes and a half-height new boundary at their
intended checks, and checks each introduced boundary's connection and supplied grid.
Reduced Replay uses the mounted Show new parts control, reaches the endpoint
immediately and exercises return/re-entry. All 39 prior route rows are byte-equivalent
as parsed JSON; the two new journeys bring the matrix to 41 rows/43 executions.

## Remaining finding — whole-position conservation is masked

In `ROUTE-REPLAY-NEW-CONVERSION-COND-1:12`, the independent clean browser run recorded:

| Frame | Track viewport y | scrollY | Track document y |
|---|---:|---:|---:|
| Before right submission | 16.84375 | 248 | 264.84375 |
| Intermediate effect | 56 | 169 | 225 |
| Settled | 56 | 169 | 225 |

The right whole moves upward **39.84375px in document coordinates** as the prior
left Replay controls are dismissed. This is actual layout movement beyond the
browser's scroll change. The mechanism approval preserves whole position and
specifically excludes Replay wrappers moving the whole. Earlier permission for
container-height reflow did not waive conservation of the actual tracks.

`scripts/dev/run-route-matrix.js` computes `anchorDrift` relative to each bar's
own root. Consequently a translated root and track still produce zero deltas.
Relative geometry can supplement a conservation witness, but cannot replace
document-position checks corrected for observed scrolling.

Orchestration independently injected `translateX(12px)` on the whole bar root when
a new boundary's normal animation began. The unmodified clean distribution was
used; only the browser page was changed. `ROUTE-COND-1-TRANSFORM` incorrectly passed
1/1, proving that the witness currently admits prohibited whole translation.

Reproduction: wrap Playwright's `chromium.launch`/`browser.newContext` before invoking
the exported `runRouteMatrix`. In `context.addInitScript`, wrap
`Element.prototype.animate`, and for `.fraction-bar-boundary` targets set
`this.closest('.fraction-bar-container').style.transform = 'translateX(12px)'`
before calling the original animation method. Filter `ROUTE-COND-1-TRANSFORM`.
No source or build mutation is required.

Fix the Replay layout movement and restore scroll-aware document-position assertions.
Add a durable whole-translation seed rejected at that assertion; retain the five
existing seeds and boundary-relative checks.

## Independent validation and limits

- `npm test`: 280 tests in 24 files passed.
- Learner and subtraction-prototype builds passed.
- Full Edge browser matrix: 43/43 passed, despite the conservation gap above.
- All five motion seeds produced exactly their intended failure; no-op and half-height
  failed at partial-paint and settled-geometry checks respectively.
- Shared subtraction verifier: specified seeds rejected; restored clean run 4/4 passed.
- Packet lint and diff check passed. Preflight reports blocked because Plan 11 is
  delivered; no status was changed to bypass it.
- A read-only independent code reviewer confirmed the relative-coordinate gap and
  the measured right-bar movement, and found no additional blocking trigger defect.
  This is a review, not an independently verified advisor-model identity claim.
  Advisor consultation is not warranted for this prose-only disposition.

The reduced Replay input was empty and unfocused at activation; identity and
connection are proven, but populated-value/caret retention is not demonstrated by
that route. Strengthen that small continuity check in the repair without promising
that a text input stays focused after a real button click. Physical-device, AT and
child-usability evidence remain absent. Owner motion and deployed-URL acceptance,
and explicit publication authorization, remain outstanding.

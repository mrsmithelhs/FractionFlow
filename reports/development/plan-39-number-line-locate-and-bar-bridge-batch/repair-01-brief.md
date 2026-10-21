# Plan 39 Checkpoint 2 — consolidated Repair 01

Date: 2026-10-21. Submitted checkpoint `ad913ce`. Checkpoint 2 is NOT accepted;
Stage 6 remains blocked. This is repair within the approved feature, not new scope.

Parent inspected the mobile locate/resolve PNGs and actual receipts/source. A
Sol-medium instruction-read-only review found the functional/evidence issues
below; all findings accepted, no rejected findings. Advisor ran no commands or
writes/browser/fan-out; requested runtime identity is not independently verified.
Passing 503 tests/builds and a probe exit did not establish the feature contract.

## One bounded repair

1. **Restore the adopted visual task.** The screenshot shows a separate Step0…8
   text grid below passive dots. Renaming those controls mapped buttons does not
   make them spatial targets. Use actual position-aligned 44px tiered targets OR
   the already-approved discrete left/right stepper. Prefer the stepper if it
   avoids crowded hitboxes and the long grid. Every offered coordinate, including
   endpoints, must remain reachable with no dragging. Marker movement is preview
   only; Check remains disabled until an explicit learner selection and alone
   submits. Linear mode retains native radio options. No substitute text quiz.
2. **Readable, compact representations.** The current SVGs scale bar height and
   benchmark text down with width; labels at360 are nearly illegible. Keep the
   visual bar/axis/labels at readable CSS sizes independent of width and avoid
   vertical SVG growth on desktop. Preserve both horizontal endpoints and the
   continuous resolve connector. Reuse existing bar color/notation conventions.
   Use `createSymbolicFraction` from `src/render/symbolic.js` with its existing
   intrinsic-width fraction rule, instead of the full-card-width custom rule.
   Remove redundant captions/directions where the prompt, fraction or axis
   already communicates them. Keep the linear meaning and distinct descriptions.
3. **Meet the packet's viewport condition.** Current full controls lie outside
   the viewport in several mobile cases and every scaled-desktop sample; some
   prompts are above the viewport. Ordinary page scrolling is allowed, but save
   and assert prompt AND full active response controls within one common viewport
   position after any documented scroll-to-task. Shrinking text/targets, clipping,
   or measuring different scroll positions per element is not a solution. The
   stepper and reduced redundant chrome should make this feasible. Report a
   concrete unresolved conflict instead of declaring containment out of scope.
4. **Fix repeated preview.** The callback captures a track node then replaces it
   without refreshing that reference. A second choice, or a choice after restored
   preview, can replace a detached node and throw NotFoundError. Reacquire/update
   the current track. Preserve handle context validation and app-owned opaque
   draft/reset/focus policy; no cross-renderer synchronization or new framework.
5. **Fix help linkage and encounter focus.** Align the app's aria-controls with
   the actual help paragraph id in both views. Continue currently unmounts itself
   without focusing the new locate prompt/control. Route that transition and
   assert the real active element. Preserve help toggle/recovery/preview through
   view switches; later UI toggles must not add extra instructional help intents.
6. **Turn measurements into enforcing verification.** The current probe contains
   no failing assertions. `checkStillRequired` checks hidden visual controls after
   switching to linear, records false in every case, and still exits successfully.
   Assert actual runtime viewport/DPR first, active-view preview before confirm,
   size/nonoverlap/real hits, common-position containment, endpoint/connector
   deltas, no spent controls and correct navigation. An observed false must fail.
   Keep diagnostics/results on failure, not a false passing summary. Do not
   monkeypatch assertions or introduce a general new harness.

## Required mounted journeys and evidence

- Select A, then B, switch views twice, select C and confirm C using the real
  mounted Check control; assert no grading/resolve before Check and actual
  preview/selection/focus after every remount. Exercise direct touch taps or the
  stepper taps plus native keyboard radio navigation. No injected episode state.
- Wrong offered submission, help open/close/reopen, repeat wrong submission,
  both view directions: actual visible cue, correct aria-controls target, kept
  preview/recovery, and sensible connected focus. Retry and return/re-entry clear
  help/preview/recovery; Next moves to a fresh item; Finish disappears.
- High b8 and odd b3, medium07/08, both views at360×740 and1093×614 DPR1.25.
  Capture representative locate and resolve with actual bounds and scroll.
  Source shade/accepted point connector must remain correct at non-half5/6.
- Include two small failing-first probes: seed bypass of explicit Check and seed
  undersized/overlapping target or shifted endpoint; require the SAME normal
  assertion to reject each, then a clean pass. These can remain report-local
  until Stage6; no route matrix edits yet.

Own narrow app/render/style/test and report-local repair files only. No content,
math/replay/schema changes without a separately reproduced and reported conflict.
Preserve historical fixtures/route rows/outputs and parent review records. Keep
the failed checkpoint receipt as history, save repaired evidence separately, and
correct the report's unsupported two-step/geometry-passed claims. Run affected
tests while editing, full suite and both builds after final source, then the
bounded final-build browser verifier. Scoped source/evidence commit, checkpoint
report last. Stop for re-review; no Stage6, status changes, push or deployment.

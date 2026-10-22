# Plan 39 Repair 02 mechanism proposal

Date: 2026-10-21  
Status: investigation only; source work remains behind parent mechanism approval.

## Compatibility and task revisions

Keep `phase-4-bar-to-line-same-amount@1` and `fractionflow.episode-replay/v7` registered with their existing schedule, encounter/acknowledgement, renderer behavior, intent semantics, and exact replay meaning. Register `phase-4-bar-to-line-same-amount@2` for the repaired learner task and `fractionflow.episode-replay/v8` for that definition only. V7 stays revision-1-only; v8 requires revision 2; reject mismatched pairs. Preserve all v1-v7 envelope readers/writers and fixtures. New practice starts use the v2 definition; the old definition remains available to replay and the historical route fixture.

Reuse the current eight records, fixture IDs, authoring revision, task data revision, recipe revision, practice set revision, and exact task-context key set. Those data still mean the same source fraction and offered choices. Add revision-aware context resolution/validation for `definitionRevision: '2'`, while preserving default v1 validation and exact registry checks. In `src/interaction/episode-definition.js`, register v2 with `beats: ['locate', 'resolve']`; in `src/interaction/beat-schedule.js`, branch on exact definition revision so v1 keeps `encounter → locate → resolve` and v2 begins directly at actionable locate. Do not create a hidden acknowledgement. V2 keeps `propose-number-line-location`, `request-task-help`, and `finish-compact-episode`; only Check dispatches the proposed location into episode state/replay.

## Exact common scales computed from the current records

I evaluated all eight registered records under both support modes using the existing `lcm` export in `src/math/fraction.js`. High support uses its authored partition denominator `b` as the scale; the non-selectable half benchmark in odd-denominator cases remains a visual reference and does not enlarge the selectable partition. Medium support uses the LCM of the four authored sparse-candidate denominators. In every context the offered coordinates are unique integers after exact scaling. The observed maximum is **8**, so use a scale ceiling of **8** for this bounded batch; reject any future context that exceeds it rather than expanding denominators implicitly.

| Record | High scale / selectable step indices | Medium scale / candidate indices A–D |
|---|---:|---:|
| `bridge-01-half-2` | 2 / 0–2 | 4 / 0, 1, 2, 4 |
| `bridge-02-fourth-4` | 4 / 0–4 | 8 / 0, 2, 3, 4 |
| `bridge-03-three-fourths-4` | 4 / 0–4 | 4 / 1, 2, 3, 4 |
| `bridge-04-two-thirds-3` | 3 / 0–3 | 6 / 0, 2, 3, 4 |
| `bridge-05-two-fourths-half` | 4 / 0–4 | 4 / 1, 2, 3, 4 |
| `bridge-06-three-eighths-8` | 8 / 0–8 | 8 / 1, 2, 3, 4 |
| `bridge-07-one-third-med` | 3 / 0–3 | 6 / 1, 2, 3, 4 |
| `bridge-08-five-sixths-med` | 6 / 0–6 | 6 / 2, 3, 4, 5 |

This is a bounded result for the current immutable records, not permission to expand authored denominators or simplify source forms. The exact scale and each selectable candidate's integer distance belong in a validated upstream Plan 39 task/scene projection, never in the renderer. For a scale of eight, linear and accessible descriptions can say `0 to 1 has 8 equal steps` and `A: 3 steps from 0`. Letters identify controls only. Generate the equivalent description for every visual candidate so mathematically distinct positions remain distinct without implying which one is correct.

## Initial screen and accepted explanation

Use one stacked source fraction as the movable token, initially in a tray outside the number line. The prompt is `Place this fraction on the number line.` Do not print the fraction again in the prompt or a duplicate source label; give the token a concise accessible name such as `3/8, not placed`. In the linear view use `Choose a location.` and the same single source-fraction token plus letter-first options. Do not render a fraction bar, shaded segment, connector, or bar-derived help information before a correct Check, including hidden nodes, accessible names, or inactive view DOM.

After correct Check, show the aligned source bar and connector as the explanation. Keep the resolve sentence to one exact relationship, such as `3 of 4 equal steps from 0 is 3/4.` For unreduced source `2/4`, retain its authored form in the explanation when it is the source. The linear result uses the accepted candidate's integer distance/scale and the source form in the same single relationship. This avoids both generic line narration and a repeated `matching 3/4` clause.

## Input, preservation, and cancellation

Visual placement supports dragging the token to the track and tapping/clicking anywhere along the track to select the nearest offered marker. Pointer snapping uses only projected marker centers and pointer x; it receives no target/correctness value. Equal distances choose the lower visual location, then stable candidate order. A release outside the track leaves the prior selection unchanged. The linear path keeps native radio choices. Both modes keep explicit Check, keyboard selection and activation, and 44×44 CSS-pixel controls; the draggable token has a 44×44 minimum handle. Candidate dots themselves are not promised overlapping 44-pixel hitboxes: track tapping is a single continuous placement surface and the radio/keyboard route is the non-drag alternative.

Use Pointer Events with pointer capture on the token. At pointerdown, retain pointer id, token origin, and the current pending candidate as the pre-gesture value; do not change the candidate until valid pointerup. Re-read the track's `getBoundingClientRect()` on each event so page scroll or resize cannot leave a stale coordinate frame. Movement under 6 CSS px is a tap. A vertical intent is `abs(deltaY) >= 8px` and `abs(deltaY) >= 1.25 * abs(deltaX)`; cancel the drag and restore the pre-gesture candidate, allowing `touch-action: pan-y` to leave vertical page scrolling to the browser. If the browser takes over and emits `pointercancel`, or Escape/lost pointer capture occurs, apply the same restoration. Pointerup commits only when its clientX lies inside the live track rectangle; map it to the nearest already-projected marker center in CSS pixels, with equal distances resolving to the lower visual location and then stable candidate order. Pointerup outside the track leaves the pre-gesture value. Suppress the following synthetic click after a handled pointer sequence so one touch cannot place twice. No cancellation path erases a placement that existed before that gesture. A track tap selects the nearest projected marker; dragging moves the token and snaps at pointerup.

Follow the app's existing opaque Plan 39 draft-handle pattern (`readPreview`/`writePreview`, validated by current item/context) to retain pending candidate and help-open state across visual/linear view switches. Do not put pending placement or help open/close into learner intents. Retry, Return, and Next clear task-local drafts as they do today. A remount during an active route should restore the same-context opaque handle; a changed item/context invalidates it. Browser back/forward reconstructs only checked intents.

## Replay and route evidence disposition

No frozen Plan 39 v7 oracle exists in the repository: current evidence contains `evidence/v6-baseline-oracles.json`, which is a Plan 40 subtraction v6 oracle, not Plan 39. Before source edits, capture and commit a Plan 39 v7 full-state baseline from the unchanged current checkout for representative high/medium initial, locate, help, wrong-response, accepted, and completed states. Record envelope and full-state hashes. After source work, require byte-equivalent JSON replayed state for those v7 cases. V8 round trips are new behavior evidence and cannot substitute for this pre-mutation v7 baseline.

The route runner currently maps the ten existing Plan 39 rows to `production-default-v7`, which resolves to the current mounted app. Once the live practice type defaults to v2, that label would silently point the old rows at new behavior. Add a built, pinned `historical-plan39-v7-entry` context/starting surface following the existing Plan 34/18 historical fixture pattern. Its entry should mount the registered revision-1 practice type explicitly. Migrate the ten existing Plan 39 row mappings to that context, recording this intentional context-map migration and preserving their row/action definitions. New Repair 02 rows map to `production-default-v8`. Do not claim the old context map remained immutable; preserve the other prior mappings and all route-row meanings. Add tests that assert the ten old Plan 39 rows resolve to the historical fixture and new rows resolve to current v8.

New evidence covers the eight records/support modes, exact scales and unique coordinates, no pre-Check bar cue in visible or hidden DOM, tap and drag nearest snapping including tie behavior independent of correctness, unplaced initial token, Check gate, keyboard/radio operation, cancel/scroll restoration of pre-gesture state, view-switch/remount preservation, Retry/Return/Next clearing, v8 state round trips, v7 oracle equality, precise labels/result copy, and 360px/125% controls. Preserve arithmetic fixtures and unrelated route mappings. Browser walkthroughs are rendered usability observations, not proof from children or physical assistive technology.

## Parent approval requested

Please approve the v2/v8 compatibility pair, the computed current-record scale ceiling of 8, and the explicit migration of the ten old Plan 39 route mappings to a pinned v7 historical fixture before source changes. No implementation or advisor review has started.

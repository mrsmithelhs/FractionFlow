# Plan 53 Requirement 0: proposed mechanism

2026-11-02 · Proposed for orchestrator approval; not an implementation or acceptance.
Preflight `node scripts/dev/plan-status.js check plan-53`: RUNNABLE. Source HEAD
`290bc37a35c63e146cff60274d0418f82a4067a2`. Three untracked Plan 39 route receipts
were present and are outside this work. The adopted Plan 48 design and packet govern.

## Ownership and compatibility

One implementer owns source and coordinates an exclusive Git window. Proposed new
files: `src/content/data/plan53-two-whole-location-records.js`,
`src/content/plan53-two-whole-location-task.js`,
`src/interaction/plan53-two-whole-location-episode.js`,
`src/interaction/plan53-two-whole-location-scene.js`,
`src/render/plan53-two-whole-location.js`, and focused Plan 53 tests and evidence
under this report directory. Integrate narrowly in `src/interaction/episode-definition.js`,
`episode.js`, `scene.js`, `replay.js`, `src/app/practice-types.js`, `app.js`, and
`styles.css`; reuse existing fraction typography, feedback and progression components.
Final exact evidence harness paths depend on the existing active-view/receipt helpers;
do not overwrite historical artifacts. No existing [0,1] definition is widened.

Plan 50 validates registered immutable context, uses exact `createFraction` and
`equalFractions`, contextual intents and placement revisions. Its renderer captures
pointer on the token, cancels on loss/destruction, and derives highlight from pointer
position; its app owns help visibility and episode owns assistance history. Reuse
those patterns, not its [0,1] geometry. The episode is the sole response owner; app
owns transient help visibility and view selection, renderer owns only a cancellable
gesture/preview. Access changes and resize cancel preview, never the committed draft,
feedback, help visibility or assistance history. Reset starts a fresh episode and
closes help. A fresh app-owned attempt generation is captured by mounted callbacks;
reset, navigation and renderer destruction invalidate it before remount. Every
callback checks generation and mounted connectivity before dispatch, even when the
new attempt has the same item identity. Context rejects other items and Check's
placement revision rejects stale checks; context alone cannot distinguish resets.
Gesture cancellation and retired controls cannot mutate the replacement attempt.

Use a new immutable task/set/definition identity and registered reconstruction.
Current replay has dedicated v11 collection and v12 distance envelopes with exact-key
validation and reconstruction; propose a new dedicated envelope (next available
version at implementation) for this distinct identity, preserving all older versions,
definitions and frozen oracles. Replay records context-bound learner intents, including
help, and reconstructs the same state; UI-only open/closed presentation is not a
learner answer. Verify old envelopes unchanged and new round trips, including stale
intent rejection. Do not change historical expected outputs.

## Exact proposed batch

Stable item revision `1`, set revision `1`, raw numerator/denominator strings:

| Item ID | Original | Purpose |
| --- | --- | --- |
| `zero-fourths` | 0/4 | zero |
| `three-fourths` | 3/4 | proper |
| `four-fourths` | 4/4 | interior one |
| `five-fourths` | 5/4 | beyond one |
| `six-fourths` | 6/4 | non-reduced |
| `three-halves` | 3/2 | same value, different unit |
| `eight-fourths` | 8/4 | two |
| `ten-eighths` | 10/8 | conditional density |

Each record stores identity, purpose and original form, not solution indices or
decomposition. Admission rejects malformed/unregistered contexts, negative or
noninteger numerator, denominator outside 2/4/8, and values outside [0,2]. Derive
`i/d` candidates for `i=0..2d`, exact matching, and whole/remainder facts upstream.
Preserve supplied notation even when equivalent. Eighths remain conditional: measure
actual 17-position rendering and direct participation at 360×740, enlarged text and
1093×614 DPR 1.25. If unusable, stop and request an amendment removing `ten-eighths`;
do not quietly substitute, change the scale, or infer capability from desktop alone.

## State, intents and learner journey

Proposed exact contextual intent shapes, with `context` containing set, item and
definition IDs and revisions: `{type:'place-two-whole', context, candidateId}`;
`{type:'check-two-whole', context, revision}`; and
`{type:'request-two-whole-help', context, helpKind:'placement'}`. The placement
revision increments on change; Check must match it. Help open dispatches the help
intent; closing is presentation only. Repeated requests remain auditable. Episode
states distinguish null/unplaced, tentative, incomplete, incorrect and accepted;
revision clears obsolete feedback but retains assistance. Before acceptance the scene
projects the learner's tentative candidate and checked feedback so the draft remains
visible and editable, but withholds the correct target and upstream-derived
bar/whole/remainder verification. Neither bar nor derived decomposition is present in
the scene before acceptance; accepted state exposes the verified point and those facts.
Original supplied fraction and neutral candidate labels are context, not a solution.

Prompt: “Place this fraction on the number line.” An unplaced white-backed stacked
fraction tile starts in a distinct tray. Drag uses pointer capture and highlights the
nearest candidate; release commits a tentative position, cancellation commits nothing.
Direct tap/click on the line commits nearest candidate without dragging. In the visual
keyboard path, focus alone leaves the tile unplaced. An explicit step right places it
at the first candidate, 0; an explicit step left initially places it at the last
candidate, 2. Subsequent left/right steps move one candidate and clamp at endpoints;
the visible marker moves spatially along the line. Controls have meaningful names and
visible focus. Linear view offers all exact positions in an initially empty select,
labeled by fractional position (including 0, 1 and 2), with no per-item wording bank;
change commits the same draft. Those exact labels give linear users a different cue
structure and may allow matching the supplied notation, so equivalent access does not
imply identical reasoning demand. Check is separate in every path. Candidates and
ticks are identical under More and Less.
Help says “Each whole is divided into equal parts. Find the two whole intervals.”
It may emphasize those intervals but never the answer or bar. Check without placement:
“Choose a position first.” Wrong: “Check this placement and try again.” Use the
current house feedback treatment and one deliberate focus/announcement path.

Complete example: 5/4 starts unplaced; learner places 5/4 and checks; accepted
line point and one full plus one-quarter equal-unit bar appear, followed immediately
by Next problem. Final item offers Back to start. Wrong example: 6/4 placed at 5/4,
Check shows retry; learner opens and closes help, changes to 6/4 (retry clears), and
checks again. Assistance remains recorded across view/resize; acceptance reveals two
rows, one full and one 2/4 filled. No extra Finish or decomposition exercise.

## Geometry and layout proposal

`U=(x2-x0)/2`; 1 is `x0+U`, candidate i/d is `x0+(i/d)U`. Every stacked
bar begins at x0 and has width U. At 1 one full row; at 2 two; at 0 no shade.
For 1+r/d the second fill ends at `x0+(r/d)U`, one U left of the cumulative
line point. No endpoint connector. Optional information is “1 whole and 2/4”,
never ambiguous inline mixed notation; omit zero remainder.

Narrow sketch: prompt / separate tray / line 0---1---2 / Check and help; after
acceptance line then aligned equal-width stacked bars and Next. Chromebook uses the
same vertical order with more breathing room. Bars and line share the same measured
horizontal coordinate frame, with reserved edge space for contained tiles. If this
cannot maintain both scale and usable controls, stop for an explicit-unit sequential
layout amendment instead of silently changing unit width. Reduced motion retains the
same static result.

## Gates and evidence

Stop now for mechanism and batch approval. After approval, implement and test pure
content, state, scene withholding and replay first; send a separate pure checkpoint
and stop before mounted integration. Then validate exact all-record/negative cases,
old and new replay, rendered access/help/recovery, boundaries, offset, target spacing,
focus and overflow. Use isolated receipts and mutation witnesses for scale/offset,
boundary, premature reveal and lost draft/help; run final unit/build/lint/diff and a
historical browser regression. Browser simulation is not physical-device, assistive
technology or learner evidence. Consultation disposition will be recorded at delivery;
one cold read-only Terra-medium review is permitted for substantial work, without
fan-out or model substitution. Owner task acceptance and deployment are separate.

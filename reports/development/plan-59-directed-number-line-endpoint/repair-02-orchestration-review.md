# Plan 59 draggable End technical review

2026-11-02. Reviewed owner-requested repair `17d86b2`, progress `3e191fd`, in-flight
reserve correction `8f872a5` and progress `5a019a9`. Technical disposition: accepted
for revised owner rendered/task review. Plan59 remains delivered, not complete.
Earlier tap-only technical disposition is superseded for input interaction.

Inspected task-local pointer capture, common center-bottom anchor for highlight/drop,
threshold, cancellation and natural-size inert placeholder. Old placement intent,
math/state/replay and six records are unchanged. App changes are limited to the two
separately approved cleanup seams: returnToEntry and public destroy now destroy/null
Plan59 renderers. Independently inspected both original omissions and the actual diff.

Independently ran destroy-probe.mjs successfully: captured app teardown clears ghost,
removes tracked listeners and leaves a fresh remount unplaced. Inspected mouse/touch
screenshots, gesture/alternatives geometry, cancellation and mutation evidence.
The initial review independently reproduced the200% in-flight tray collapse missed
by before/after-only checks; documented in repair-02-review-followup.md.

Independently repeated the corrected360x740/200% actual mouse drag: before/during/
after Escape, tray height77.78125px and axis document-y957.609375 were unchanged;
highlight matched step3 and drag styles cleared. The source removes the inert
placeholder on cancellation/drop/destruction without caching a resize-dependent size.
Saved follow-up evidence covers all three layouts, unplaced drag and placed re-grab,
and the reserve-removal seed fails the named during-drag assertion before restoration.

Implementation evidence additionally covers emulated touch, invalid drops, pointer
cancel/capture loss, Escape, actual scroll/resize, help/view, restart/stale controls,
keyboard Back during capture and fresh re-entry. Prior benchmark/feedback clearance,
Start/End separation and directed accepted geometry remain required. These are sampled
browser observations, not real-finger comfort or actual AT speech.

Focused56tests/build/lint/diff precede the final bounded placeholder correction;
follow-up drag/lifecycle/teardown/keyboard and lint/diff are separately attributed.
Original617full-suite/119historical results retain their earlier baseline; no duplicate
reviewer/full matrix was requested for this task-local gesture and approved cleanup.
No new content/episode/replay, mastery claim, Phase4 exit, push or deployment.
Owner should inspect tray discovery, off-center drag/re-drag, highlight/drop and
alternatives before explicit acceptance/closure.

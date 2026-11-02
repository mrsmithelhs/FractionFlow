# Repair 02 review — in-flight tray reserve correction

2026-11-02. Reviewed `17d86b2` / progress `3e191fd`. Parent inspected source,
screenshots and probes and independently passed destroy-probe.mjs (captured teardown,
listener removal and remount). One concrete layout defect still blocks acceptance.

Independent Chrome at360x740 with200%root text: before unplaced drag, tray height
77.78125px and axis document-y957.609375; while captured tile has position:fixed,
tray collapses to64px and axis document-y943.828125. The line moves13.78125px while
the learner is aiming. On release the placeholder restores it, so existing before/
after assertion misses the transient movement. No device/learner claim is involved.

Preserve actual unplaced tray dimensions while lifting the tile out of flow, with
an inert flow placeholder or equivalent bounded reserve, and remove/restore safely
on drop/cancellation/destruction. Keep existing placed tray reserve and enlarged
text behavior. Avoid a fixed guessed height, stale resize value or accessible ghost.
No math/state/replay or shared app expansion is needed.

Add a named axis/tray stability assertion BEFORE, DURING captured move and AFTER
release/cancel at all three layouts, including unplaced drag and placed re-grab.
Exercise scroll/resize cancellation with the reserve active. An ordinary seed removing
the in-flight reserve must fail the during-drag assertion; retain clean restoration
receipt and update affected screenshots/measurements. Focused drag/lifecycle/teardown
checks suffice; no extra advisor/full matrix. Preserve prior evidence labeled historical.

Owner review remains pending. Commit scoped correction and progress separately last,
release Git window at delivery. No status/acceptance/push/deployment changes.

# Plan 74 Repair 02 — equal eighth geometry

2026-11-07. Ready for orchestration review; owner rendered acceptance remains separate. Preflight was RUNNABLE and the starting commit was `997afd3`. Geometry and refreshed evidence are in `5bd5f47`.

Plan 74 bars now use eight equal grid tracks, with border-box cells. The A/B divider is an inset shadow, so it does not consume track width. Copy, markings, renderer, episode and replay are unchanged. The original Repair 01 screenshot paths were refreshed; prior evidence remains available in Git history.

The updated `evidence/repair-01/capture.mjs` records each cell's width and left boundary, the bar's inner width, and the divider position and computed shadow. It checks each width and boundary within 0.1 CSS pixel of equal eighths in all visible original and settled bars, at 360 × 740 for both cases and both normal and 200% root text. The four captured views reported zero measured width error, and the divider appeared at track boundary 3 or 5 as appropriate. The initial new measurement exposed unequal flex distribution even after the divider was made paint-only; the grid correction resolved that failure. Existing checks for source counts, no overflow, focus, help and progression also passed in the same Chrome run. `observations.json` contains the measurements.

Focused Plan 74 and Plan 72 tests passed (11 tests), as did `npm run build`, packet lint and scoped diff checks. Build retains its large-chunk warning. Root-text scaling is not browser zoom; physical devices and actual assistive-technology speech were not tested. No additional advisor ran, per orchestration instruction. The three unrelated pre-existing Plan 39 untracked files were left untouched. No packet status, owner acceptance or deployment was changed.

# Plan 59 Repair 02 mechanism approval

2026-11-02. Reviewed repair-02-mechanism.md `6eb4f78` and progress `3ee8b6a`.
Approved for the bounded task-local drag repair described there and in the owner
request. Plan59 remains delivered pending revised technical/owner review.

Approve shared center-bottom pointer anchor for visual preview and drop, primary
capture/threshold, same placement intent, active tray reserve and exhaustive cancellation
without commit. No episode/content/replay change or generic drag framework needed.
Keep old tap/keyboard/linear alternatives and Repair01 label clearance.

Specify an appropriate accessible role for the non-button tile so its name and
position description are exposed; a generic span with aria-label alone previously
proved insufficient in this task's review. No fake click action or mandatory drag.
Retain the single Check feedback path and initially null response.

Because placed End is vertically separated from Start/line, test real re-grabs
from that elevated card into the valid drop band, not only unplaced drags or
synthetic event dispatch. Preview and release must agree for off-center grabs;
invalid/canceled gestures return the existing card/position without layout jump.
Cancellation must clear ownership before capture release to avoid duplicate commits.
Ensure view/scroll/resize/reset cases do not leave the tile fixed on screen.

Save representative pointer/touch highlight and cancellation evidence and named
failure/restoration receipts; keep geometry and physical-device limits honest.
No automatic second reviewer or full historical matrix for task-local changes.
Stop for shared-source expansion or a contract/capability problem. No status,
owner acceptance, push or deployment is authorized by this gate.

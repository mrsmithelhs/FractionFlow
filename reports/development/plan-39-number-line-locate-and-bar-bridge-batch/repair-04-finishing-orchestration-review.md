# Plan 39 Repair 04 finishing-pass review

Date: 2026-10-31. Delivery 2c88e03 / dae242f. NOT YET ACCEPTED.

The original normal-size 19.75px collapse is fixed. Seed injections now lead to
ordinary assertions, with five bounded failure receipts preserved. The added
next-focus and connector checks address the previous evidence gaps. Progress was
committed separately last. No broad redesign or additional advisor is required.

One remaining defect is in syncTrayFootprint(), number-line-locate.js. When the
token is in the tray, the helper measures trayRect and saves it as minWidth and
minHeight. That rectangle already includes the PREVIOUS minimum reservation, so
it cannot shrink after font size decreases. Observing the token does not remove
this self-referential measurement.

Parent reproduced with current source via Vite/Chrome, at 360x740 and 1366x768:
start unplaced, set root font to 32px, restore normal size, then drag to one half.
Tray height stays 133.5px after normal type returns (correct original 71.75px).
During the next drag the line is stable, but ON DROP the other branch recalculates
71.75px and raises the line 61.75px. Document-coordinate measurements rule out
scrolling. No page errors; the accepted linear result and next-item identity/
MAIN.app-episode focus still work. Proof/script/screenshots are isolated under
evidence/orchestration-repair04-finishing-review/. Original parent and implementer
evidence is untouched. Browser and server closed.

## Remaining authorized finishing scope

Derive the reservation from intrinsic token dimensions plus tray padding/border
and CSS minimum floors, independently of the tray's prior reserved rectangle.
Ensure it can grow AND shrink safely at rest, then remain stable during drag,
placement and cancel. Do not hard-code a fixed tile/tray height or duplicate a
token. Add the normal -> enlarged -> normal UNPLACED cycle followed by first drag
and drop to the existing witness; assert restored footprint and stable axis at
each gesture stage. Preserve existing enlarged containment, resizing, ring/drop,
cancel and shared progression checks. No new mechanism round or broader source
changes. Commit the narrow fix/evidence and separately update progress last.

Parent reran 8/8 app Plan39 tests successfully. The 534-test suite/build and clean
four-viewport witness are implementer-reported, not independently rerun here.
Final source updates require appropriate final validation, without repeated broad
runs on incremental drafts. Preserve actual run scope in reports; a previous
matrix receipt is not a newly executed final-source receipt.

The owner now permits Terra-medium reviews and requires them for cross-harness
review unless efficient inline inspection suffices. This narrow follow-up is
efficiently inspectable inline: roughly 43 added renderer lines, previously
reviewed surrounding logic, clear root cause and independent browser reproduction.
No additional Luna/Terra/Sol reviewer was launched. Prior Luna HIGH review retains
its actual attribution. Future substantial work follows DECISION-052/AGENTS.md.

Plan39 remains in-progress; owner rendered acceptance and deployment remain gated.
No product source/status changed here; owner packet/index edits remain untouched.

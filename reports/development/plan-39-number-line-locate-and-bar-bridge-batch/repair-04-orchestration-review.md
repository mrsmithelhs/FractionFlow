# Plan 39 Repair 04 delivery review

Date: 2026-10-27. Delivery a451949; mechanism approval 9036a6c.

Disposition: NOT YET ACCEPTED. A bounded finishing pass is needed. Preserve the
adopted visual design and shared progression; no new mechanism round is needed.
Read repair-04-finishing-brief.md.

## Confirmed product issue: the target moves during initial dragging

The new empty tray minimum is smaller than its occupied intrinsic size. Once
pointermove changes the token to position: fixed, the tray loses its content's
flow size, shrinking from 66 x 71.75px to 56 x 52px. This raises the axis by
19.75px during the gesture and leaves it there after release. It also changes
the final tile position relative to the initial drag target.

Parent reproduced this with current source via Vite and headless Chrome at
360x740 and 1366x768, with document-coordinate measurements. This is not a page
scroll artifact. It violates the proposal's stable-empty-tray promise and makes
the target move under the learner's pointer. Source: styles.css tray sizing plus
number-line-locate.js pointermove's fixed positioning and placement reparenting.
The implementer's submitted receipt independently contains the same before/after
axis shift, but the witness never compares those coordinates.

Persisted independent reproduction: evidence/orchestration-repair04-review/
check.mjs, receipt.json, pending and linear screenshots. Browser/server closed.

## Confirmed evidence issue: three seeds do not use ordinary failure checks

In scripts/dev/plan39-repair04-witness.mjs:
- Tile overflow (around lines 151-163) has a seed-only conditional throw which
  can reject height <=44 without proving the ordinary glyph-containment check
  detects the injected regression.
- Premature green (around lines 200-212) inserts a header after the ordinary
  initial no-header check and throws from a separate seed-only checker.
- Progression redundancy (around lines 280-294) uses a separate seed-only click
  and throw, rather than reaching the normal direct-next postcondition.

The tray-separation seed does flow into an ordinary assertion. The other seeds
must likewise mutate only, then be rejected by the same assertions as clean
runs. Current nonzero exits do not establish the promised sensitivity. This is
an evidence defect, not a finding that green or progression are wrong in product.

## What passed and limits

Parent inspected renderer/CSS changes, the witness and submitted measurements;
displayed supplied mobile initial and desktop accepted screenshots; independently
ran app-plan39-number-line.test.js (8/8 passed). Real browser checks verified first
tray drag, accepted linear text, one direct Next to bridge-02-fourth-4 and focus
on MAIN.app-episode, with no page errors at both tested widths. The linear path
retains concise scale and accepted-location text without an answer bar. The
accepted result header and separated aligned graphics look consistent with the
owner's chosen design. Owner rendered judgment remains pending.

One cold default-role gpt-6-luna HIGH read-only review inspected source and test
changes, with no commands, browser, writes or fan-out. Requested configuration is
recorded; actual provider billing/runtime identity was not independently measured.
It found no confirmed capture/reparent regression; flagged missing next-focus and
connector endpoint assertions and the unused trayOutsideBand measurement. Parent
verified focus in actual current app and confirmed the missing assertions inline.
No Sol/Astra or second reviewer was used. Add these small checks to the existing
witness rather than expanding the harness. Existing historical white-background
check's mouse-away change is reasonable given approved hover feedback.

534 unit tests, builds, 112/112 matrix executions and all four seeded failures
are implementer-reported. Parent did not rerun the full matrix/build or overwrite
the submitted evidence. The report's unavailable advisor/browser-pilot disposition
is acceptable degraded-mode reporting, not a reason to substitute model tiers.
No physical-device, screen-reader audio or actual learner-efficacy claim is proved.

No product source or packet status changed in this review. Owner's uncommitted
packet/index dispatch changes remain untouched. No push/deployment. Progress
report's same-commit delivery is not evidence of a separate progress-last commit;
use a separate final progress commit in the finishing pass, without history rewrite.

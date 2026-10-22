# Repair 02 mouse walkthrough — parent-persisted observation

Date: 2026-10-21. Requested configuration: fresh Luna medium, default role.
Runtime/model identity was not independently observable. Stable built checkpoint
`0d0708d`, temporary localhost URL supplied by parent. Browser-only restriction
was instructional. Agent reported no source, DOM or test inspection.

This report is persisted by the parent from the agent's returned observations;
the reviewer did not write a local report. No screenshot files are claimed.

The reviewer used screenshots and coordinate mouse clicks to choose the number-
line practice and answer the first fraction, 1/2. The visible task and fraction
were clear. First Move right established a marker at 0 and displayed “Step 0 of
2 equal steps from 0.” Second Move right placed it at one half; Check showed
“That's right,” the bar/line explanation and “1 of 2 equal steps from 0 is 1/2.”
Finish reached Next problem. Exact overall interaction count was not returned;
the reported path included entry selection, two movement clicks, Check and
Finish, with screenshots at the landing/task/move/result/finish transitions.

Finding: the first Move right action does not move right from an existing marker;
it initializes at the left endpoint without explaining that job. This is a
concrete observed affordance mismatch. The reviewer did not independently try
dragging or tapping the line, so this run establishes no direct-gesture discovery.

The reviewer attempted a separately labelled assisted follow-up, with a cue to
use the picture rather than movement buttons. Its previous tab handle no longer
belonged to the new browser session. It stopped before any UI action, with no
gesture observation. This is a harness/session limitation, not an app failure.

Screenshots were displayed inline only; screenshot export was not established.
Creating/binding the tab automatically emitted an accessibility tree despite the
visual-only instruction. The reviewer said it did not use that metadata, but
strictly screenshot-isolated conditions were not achieved. Visible-tab enabling
was unsupported in a subagent; a hidden dedicated tab worked. These are model
usability observations, not evidence from children or assistive technology.

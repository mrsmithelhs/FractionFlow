# Browser walkthrough reviewer — bounded pilot

Owner authorized for Plan 39 Repair 02 on 2026-10-21. This is a proposed reusable
review workflow being piloted, not evidence of real learner behavior or a substitute
for deterministic routes, orchestrator verification or owner acceptance.

## Assignment

Use a fresh-context Luna-class agent (or an owner-authorized provider equivalent)
with its harness browser tools. No implementation history, packet, source, tests,
known defects, answer key or other reviewers' findings. No child fan-out. Agent may
read mandatory agent/tool instructions, but may not explore product/repo content.
It may write only its designated observation report and screenshot artifacts.

Supply only the site URL, the task to attempt, a short orientation and one input
constraint. Example: explore fraction number-line practice as a first-time user;
consider wording and controls for a learner around ten developing fraction
understanding; use mouse only. Do not invent misunderstandings or deliberately
make math mistakes. Successful completion is not the only useful result.

For the visual run, use rendered screenshots, visible labels, mouse/touch actions,
scroll and visible focus. No page-source/HTML inspection, script evaluation,
internal state, hidden labels, selector discovery or shell/browser automation that
bypasses the harness's user-facing browser tool. Do not use DOM or accessibility
snapshots as a silent substitute for visual inspection. The keyboard run uses real
key actions and rendered focus; a screen-reader/accessibility-tree review would
be a separate task. Do not claim screen-reader or physical-device testing.

First confirm that the harness supports the assigned actions/screenshots. Report
capability limitations and stop if it cannot. Use a new dedicated browser tab;
do not alter unrelated tabs, settings, source, servers or other agents' sessions.
Record whether browser-only restriction is tool-enforced or instruction-only.

## Observation and bounds

Default pilot: one episode, at most 30 browser actions, no more than 10 meaningful
state observations. Reserve a little budget to report a blocker. Stop on episode
completion, persistent blocker or budget exhaustion. Report partial completion
honestly; do not silently use another input mode to finish. Setup/snapshot calls
are recorded separately from interaction actions. Avoid repeated screenshots
when nothing changed. No unsupervised restart loops or automatic model upgrades.

At meaningful transitions, record in one or two short sentences:
- What the page appears to ask and the visible cue for the expected action.
- What action was attempted and the observed result.
- Any uncertainty/mismatch; screenshot reference if useful.

These are public-facing observations, not a request for private reasoning traces.
Separate observed behavior from hypotheses about a child's experience. Do not
manufacture confusion merely to comply with a persona. Do not read another run.

Orchestrator cues may set the goal/input method or offer a logged hint after a
recorded unassisted failure. Never erase the distinction between assisted and
unassisted completion. A new input-mode run gets a new cold reviewer.

## Report and disposition

Record requested/observed model if available, browser/harness, URL/build supplied
by parent, viewport, input mode, actions/observations, actual screenshots, completion
and assistance, tool restrictions, usage if exposed, and bounded findings. No
invented token/cost numbers or claims that prompting reproduces a ten-year-old.

Parent reproduces findings and classifies them as product defect, unclear copy,
pedagogical question, tool limitation or unsupported speculation. Concrete defects
may become deterministic regression cases. Owner keeps pedagogical/acceptance
authority. One consolidated Sol review is the cost target for the whole repair;
walkthrough findings do not automatically trigger another Sol call.

## Repair 02 pilot findings

The mouse and keyboard Luna runs produced one actionable initial-control finding.
The mouse run completed one problem with movement buttons; the keyboard run
reached accepted feedback through Tab, arrow keys and Check, without activating
Finish. Neither independently demonstrated direct-gesture discovery. Keep that
scope distinct from deterministic mouse/touch gesture checks.

The harness automatically supplied accessibility metadata when binding a tab, so
strict screenshot-only isolation was not achieved. Record such exposure even if
the reviewer says it did not use the metadata. A visual-only instruction is not
a tool-enforced boundary. Screenshot export was not established; inline images
were observed, while the parent persisted the mouse report from returned text.
Confirm available export tools before promising local screenshot artifacts.

A follow-up turn lost the previous tab handle and stopped before interaction.
Prefer a single bounded run within a stable browser session. If that session is
lost, report it; any new run must be labelled as a restart or assisted follow-up,
not silently combined with the original observation. Requested model settings
were known, but actual runtime identity, token usage and cost were not exposed.

Detailed observations and parent disposition are in the Plan 39 Repair 02
walkthrough reports. This pilot does not establish learner efficacy or justify
making additional expensive advisor calls routine.

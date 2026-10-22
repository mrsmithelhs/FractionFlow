# Repair 02 browser walkthrough pilot — disposition

Date: 2026-10-21. Two cold-context Luna-medium reviewers used dedicated in-app
browser tabs and the harness's user-facing browser controls. Source and internal
state inspection were prohibited by instruction. Actual model identity, token
use and cost were not independently exposed. See the separate mouse and keyboard
reports for the observed paths and limitations.

The mouse run completed the first problem using movement buttons. Its concrete
finding was that the first Move right action initialized a marker at zero rather
than visibly moving right. The parent accepted this affordance mismatch. The
writer corrected the unplaced controls to Place at 0 and Place at 1, with normal
Move left/right labels after placement. Focused app tests and the real-browser
smoke check both endpoints and the later movement labels. The keyboard run
reached accepted-answer feedback through native radio arrow keys and Check; it
did not activate Finish. It supports that bounded keyboard path, not full set
completion or screen-reader behavior.

Neither reviewer independently demonstrated direct drag/tap discovery. The mouse
reviewer used the available buttons, a legitimate alternative. An explicitly
assisted follow-up stopped before interactions because its tab handle was lost
between turns. Deterministic browser routes must establish direct-gesture behavior
separately; they cannot establish spontaneous learner discovery.

The harness automatically emitted accessibility metadata when binding a tab.
Reviewers said they did not use it, but strict screenshot-only isolation was not
achieved. Screenshots were observed inline; no local screenshot exports from these
runs are claimed. The mouse report was persisted by the parent from returned
observations, while the keyboard reviewer wrote its own text report. The keyboard
report's initial suggestion that no file-writing capability existed was narrowed
to screenshot export in the parent's clarification.

The pilot was useful for one actionable control-label finding at modest, bounded
scope. Reuse should keep the cold context, input constraint, action cap and honest
partial-completion record. Keep each browser run within a stable tool session;
confirm export capability before promising screenshot files. These are model
usability observations, not research with children, physical-device tests,
assistive-technology evidence or owner acceptance. No extra Sol call was triggered
by either walkthrough.

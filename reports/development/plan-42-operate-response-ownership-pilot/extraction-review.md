# Plan 42 extraction review and evaluation gate

Date: 2026-10-20. Guarded A `d7936a7`; extraction `cad9144`; corrected B
`436e54a0ed58ff8437a22e61815c2c3da098954d`.

Parent inspected the actual app/renderer/module diff and independently passed
494 tests at initial extraction, then the 23 affected tests after the correction.
Child reports full 496 tests and both builds pass at B. Broader browser parity
and cold maintenance evidence remain pending, so this is not final acceptance.

A Sol-medium instruction-read-only advisor reviewed source and tests, without
executing tools that mutate files or running tests. Requested configuration is
recorded; runtime identity is not independently verified. Two findings accepted:
the context read a nonexistent `meaning.task` property rather than `currentTask`,
and disconnected whole-host access threw despite its unavailable contract.
Both were corrected together at B. Parent checked the code and actual-shaped
distinct-scheduled-context rejection and detach/reconnect tests; all passed.
No confirmed normal-app learner regression was established by either finding.

Shared controls retain direct-child help/response layout, current intent payloads,
raw draft strings, shell recovery and current focus timing. Migrated app draft/
focus access no longer selects operation ids/forms from definition lists.
Region validation checks mounted controls and dynamic availability; unchanged
render tokens preserve handles, replacement/destroy invalidate them.

Approve Stage 3 evidence/evaluation against B. Parent dispatches two fresh Luna-
medium workers serially, one per isolated checkout with identical
`evaluation-worker-brief.md`. A uses d7936a7 and B uses 436e54a. F1 is temporary,
unmerged and scoped to the existing local validation alert, not shell recovery.
No other source writer runs while either maintenance worker is editing.

After evaluation arms finish, the main implementation child may produce final-
build parity/browser/seed evidence and reports. Production F1, other-region work,
framework/dependency changes, Plan 39, push/deployment and packet closure remain
unauthorized. Parent owns independent final verification and owner relay.

# Plan 92 ordinary integration review

## Disposition

Technical consent/reset and ordinary integration gates cleared at implementation `88a2673` and final implementer report `d6b5098`. Plan 92 is delivered for owner rendered review. Owner acceptance, completion and deployment remain pending. Held content remains excluded.

The owner approved intervening recorded episodes as a limited recency signal. The implemented signal is scoped to retained, validated exposures in a trustworthy recording window. It does not establish elapsed time or activity outside the record.

## Independent checks

- Inspected the ordinary coordinator, its Start/Next/leave hooks, recorder lease, observer, panel and About wording. Source review covered refused Start release, stale choices, lifecycle cancellation and the separation between production hooks and test hooks.
- Reran the ordinary coordinator and record-panel tests, 19/19 passed. Packet lint passed. Inspected the subsequent copy-only corrections and their reported panel/About results, 10/10 passed.
- Compared the five final production-file hashes against `ordinary92-route-summary.json`. All matched the isolated protected-browser run, which reported 119/119 executions across 117 rows. That receipt contains totals and hashes, not per-route results. Orchestration did not independently rerun the full matrix.
- Inspected ordinary mounted receipts for v1 preservation, separate opt-in, four complete remembering-on visits and their remembering-off baselines, Stop, populated Clear/reopen, abrupt-close recovery, and real fit-refused Start followed by second-tab acquisition.
- The recent-return example has two intervening recorded episodes. The older-review example has seven. Their changed choices are supported by actual observer records and same-seed baselines. These are engineering witnesses, not learner-outcome evidence.
- Inspected the temporary-browser launcher and its optional first-Start seed shim. The default opens the ordinary app with normal randomness. Review seeds 0, 2 and 4 cover the three visit shapes at the documented viewport.

## Evidence limits and review scope

The final reported full suite passed 831/833. Two development-console lifecycle tests timed out. Earlier retries also recorded a helper timeout and an owned-start assertion failure. Those files were unchanged by ordinary integration, but that does not establish the cause of the failures. A clean full-suite result is still outstanding. Build, packet lint, focused integration checks and the protected browser matrix passed.

Some stale-write, pending-Next and draft-preservation cases are established by lower-layer tests and earlier mounted isolated previews. The final ordinary-app receipts must not be read as repeating every combination. Recovery receipts use unanswered mounted exposures. Seed control and synthetic legacy data exist only in disposable test contexts.

Expanded remembering is separately opt-in. Clear removes both records while retaining their independent remembering choices. Stop retains saved entries. A single tab holds the expanded recorder. Practice in another tab can continue without expanded recording. An abrupt close retains observations and starts a fresh trustworthy recency window.

Owner review should cover the entry and consent presentation, direct Start, both intermediate task alternatives, the full visit, history inspection and Stop/Clear. The new expanded-history section is visible on entry and merits particular attention for text volume and composition.

No additional advisor was dispatched for ordinary integration. Two previously authorized bounded Terra-medium reviews covered the isolated consent preview and recorded-order protocol. This checkpoint used orchestration source and artifact verification.

## Review entry

Run the committed `ordinary92-preview.mjs` from the repository root. It starts a temporary local server and visible Chrome window with isolated browser data. Closing the review window discards those data and stops its server. The adjacent integration evidence document explains the three first-Start seeds. Deployment remains a separate owner gate.

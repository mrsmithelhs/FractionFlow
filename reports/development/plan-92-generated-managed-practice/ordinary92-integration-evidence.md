# Plan 92 ordinary integration — evidence in progress

This is a working review record, not an integration approval, owner acceptance or deployment authorization. Held content remains excluded.

## Source map and lifecycle

`src/app/main.js` creates one `createPlan92PracticeRecord` for the ordinary app, mounts its independent expanded-history panel, and supplies a production `practiceRecordHooks` argument. `sessionTestHooks` remains a separate injection point and takes precedence only when explicitly supplied. `src/app/plan92-practice-record.js` owns the optional bridge, recorder lease, observer, history snapshot, ranking and seed for a visit. The existing selector and measured candidate-fit checks in `app.js` still govern candidate compatibility, preflight and fallback; history is a priority input, not admission or a substitute for fit.

On Start, the coordinator waits for any previous clean release and observer queue, then checks expanded consent. A v1 or disabled record proceeds without expanded-event reads or recording. If enabled, the coordinator obtains the exclusive recorder, checks its generation, reads a validated history/snapshot and installs the choice under the storage fence. If unavailable or untrustworthy, the learner can still start without the record, with a visible episode notice when another tab may hold it. Double Start is suppressed while the first is pending. If the app refuses Start or its preflight/mount fails, the coordinator retires and releases the lease. A pending Start is fenced by both entry/shell generation in the app and lifecycle in the coordinator; a late acquisition after leave or destroy is released. Destroy silences later notices.

Next installs a history-derived suffix under the record fence; Clear, Stop, a changed epoch or an invalid snapshot discards the old ranking and rebuilds unstarted choices without history, with the existing measured fit/preflight checks still applied. App episode generation rejects a late Next after Retry or another episode transition. Leave retires observation and drains queued writes before clean release. Abrupt close cannot guarantee async release, so the durable active registration triggers a fresh lag window on recovery; prior records remain available for explicit View and cautious counts. Exact-item and skill-return logic remains in `plan92-history-policy.js`; the learner UI and ordinary API do not expose seeds, record tokens, epochs or preview diagnostics.

`plan92-record-bridge.js` routes the existing comparison controls through their v1 adapter until affirmative expanded opt-in; it upgrades only on that explicit action. After upgrade it routes legacy actions to the preserved v1 data within v2. Expanded Stop is independent of comparison Stop. Either Clear control honestly identifies that both records are cleared while the two remembering choices remain unchanged. The expanded panel's View action is explicit and renders learner-readable outcome summaries; it does not automatically inspect saved events on load.

## Local attended review

From the repository root, run:

```powershell
node reports/development/plan-92-generated-managed-practice/ordinary92-preview.mjs
```

This opens the ordinary app in a new visible Chrome window with a temporary, isolated browser context; close the window to discard that context's browser data and stop the local preview. Start with remembering off, then return to the entry screen to enable **Remember expanded practice on this browser**. Complete practice and use **View expanded history** to inspect it; use **Stop expanded remembering** to keep existing entries while stopping new expanded recording. **Clear practice records on this browser** explains and clears both records. Duplicate the review tab to exercise two-tab behavior. This is a local review tool, not a deployed site or a learner study.

For a repeatable first Start with remembering off at the launcher's default 1093×750 window size, add one of the following arguments: `--seed 0` for C-I-S-T, `--seed 2` for C-S-T, or `--seed 4` for C-I-T. For example:

```powershell
node reports/development/plan-92-generated-managed-practice/ordinary92-preview.mjs --seed 2
```

These are review-only test seeds; without the argument the launcher uses ordinary randomness. The argument controls the first Start in each tab, and later Starts use ordinary randomness. The clean seeded outcomes were verified in `ordinary92-lag.json` using an equivalent test-only browser shim. This launcher opens the final ordinary app, while the separate `owner92-preview.html` and earlier reports are isolated synthetic mechanism evidence.

## Validation status

Focused policy, storage, lease, panel, ordinary coordinator and integration tests passed 54/54; panel and About copy checks passed 10/10 after the final wording change. The final full suite passed 831/833: the development-console real-helper test timed out, as did its late-failure/replaced-child test. An earlier full run also had 831/833, with the real-helper timeout and an owned-start assertion failure; an isolated console-only retry failed those same two checks. These failures are not a clean suite. The final build and packet lint succeeded. The protected Chrome route matrix passed 119/119 executions on an isolated copy whose five changed production files match the working tree by SHA-256; `ordinary92-route-summary.json` records the console totals and hashes, not per-route details. Orchestration cleared the ordinary integration behavior subject to this exact-source matrix; owner rendered acceptance, packet completion and deployment remain pending.

The disposable ordinary-app browser run in `ordinary92-browser.json` confirms visible opt-in, Start, contention notice and the Stop/Clear confirmation messages, with no page errors. Its checks of those messages do not by themselves prove durable record contents or consent state; it also did not exercise a completed Next, arithmetic draft, forced Start refusal or abrupt recovery. The coordinator unit tests separately exercise failed Start release and seed-only recovery after a mocked stale Next caused by Stop or Clear. The earlier mounted preview receipts exercise real storage fences but do not establish those behaviors in the final ordinary app.

`ordinary92-v1.json` separately traces ordinary app load and Start with a synthetic enabled v1 comparison record in a fresh browser context. It records only versionless/v1 opens and the legacy root read, no expanded-event reads, and a still-enabled v1 record with its entry retained. This is browser engineering evidence, not a learner session.

`ordinary92-lag.json` records four complete visits in the ordinary app and four clean same-seed baseline visits in disposable contexts. The positive visits generated and read back 14 real observer exposures, including a deliberate retry followed by acceptance, with no unknown outcomes. At seed 2, the recent-return choice changed from comparison 09 to comparison 02, with two intervening recorded episodes; at seed 3, the older-review choice changed from identify two-thirds to identify one-half, with seven intervening recorded episodes. In each example the receipt compares priorities and identifies both recorded endpoints. The seed shim and database inspection existed only in the test browser; no positive records were inserted directly. This is an engineering witness, not evidence of learning.

Those clean, remembering-off ordinary visits completed all three shapes (C-I-S-T, C-S-T and C-I-T); the corresponding remembering-on visits also completed those shapes. `ordinary92-reset.json` adds ordinary-path durable checks: Stop disabled expanded remembering while retaining an actual unanswered mounted exposure and leaving legacy remembering enabled; Clear removed that exposure and the intent marker and preserved the independent expanded-off and legacy-on choices. That run's legacy entries were already empty. A separate `ordinary92-recovery.json` witness starts with a populated synthetic legacy v1 record, confirms Clear removes it, and reopens the ordinary app to verify both records and choices. It also closes a tab abruptly after a genuine mounted exposure, then reopens and starts practice: the old row remains, a new epoch is established, and a new exposure is recorded. Neither recovery row contains a learner response. `ordinary92-refusal.json` records a real 240×220 Start refusal, clean release with no event, then recorder acquisition and an unanswered mounted exposure in a normal-size second tab.

After the lag and recovery runs, orchestration requested a copy-only clarification in the expanded panel and About page; the ordinary smoke and relevant panel/About checks were rerun after that edit. Earlier receipts should be read with that copy-only timing in mind.

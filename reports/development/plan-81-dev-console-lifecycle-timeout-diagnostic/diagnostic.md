# Plan 81 diagnostic: timeout reproduced; failed phase unknown

2026-11-07. **Stopped early: ownership of resources from the uninstrumented timeout could not be verified.** The existing 20-second deadline failed in a fresh canonical targeted run. Its stalled await and cleanup outcome were not captured. The passing traces identify plausible contributors, not the cause of that failure. No fix is authorized or proposed as proven.

## Baseline and attempts

Preflight was RUNNABLE. Baseline `734af19f71f8472c46ecb83a102b2b7a3d19a902` contains the proposal; relevant test, console modules, package manifests and Vite configs match the initial `077bcebd` pin. Windows, Node 26.7.0, npm 12.1.0, Vitest 3.2.7, Vite 6.4.3; canonical package-lock SHA-256 `46f4237a9a624b62b88ac206d9f53bba1d62ec969a13fa0a8f8ee12e3afbb223`. Vitest used the ordinary command/configuration with no worker override; actual worker count was not established. Plan 80 and other machine activity were concurrent or possible; no unrelated process inventory was collected. Loopback was `127.0.0.1`, dynamically allocated by the test. `BASE_PATH` was not separately recorded; instrumented URLs show the expected `/FractionFlow/` route.

Command for all attempts, from the respective root: `npm test -- tests/dev-console.test.js -t "real learner/prototype helpers serve on isolated ports, exit-clean, and leave an independent server alive"`. No deadline or assertion was changed. Times below are Vitest's test duration, not shell elapsed time. Sequential attempts were:

| Order | Checkout / variant | Outcome | Test time |
| --- | --- | --- | ---: |
| 1 | Canonical unchanged | pass | 17.353 s |
| 2 | Isolated unchanged | pass | 9.465 s |
| 3 | Isolated instrumented, initial probe | pass | 8.658 s |
| 4 | Isolated unchanged, restored from archive | pass | 9.285 s |
| 5 | Isolated instrumented, detailed fetch probe | pass | 9.654 s |
| 6 | Canonical unchanged | **timeout** | 20.631 s reported; deadline 20.000 s |

There were no other test attempts. The 20.631 s is the framework's reported duration and does not establish when cleanup finished. There is no phase trace for the failure, so its last completed and first missing events are unknown. No suite run was attempted. The small, nonrandom sample and possible concurrent load cannot establish checkout effects or a tail distribution. Contrary to the proposal's preference to avoid blocking measured-path I/O, the instrument uses synchronous file appends and wraps fetch. Those writes can add delay or change scheduling; the two isolated controls provide limited comparison, not proof of negligible probe effects. Treat every measured interval as instrumented and do not directly attribute the difference between variants to application behavior.

## Observed phases

Sanitized monotonic relative event records are `trace-01.jsonl` and `trace-02.jsonl`. Port and PID values were replaced with per-run labels. Times are parent-worker observations; no cross-process clock subtraction is used. In detailed run 5:

- The intentional collision produced `start-error` and child exit about 0.85 s after spawn returned. The first independent-server fetch took 1.855 s to receive a response; its body read took about 2 ms.
- Learner child readiness IPC followed spawn return by 1.875 s. Its first two readiness HTTP requests aborted; the third returned successfully. The first fetch began to successful response interval was 3.271 s. These observations distinguish delayed HTTP readiness from the already-received child IPC, but do not explain why the requests were slow.
- Learner stop send to acknowledgement was about 39 ms and acknowledgement to exit about 12 ms. Prototype stop send to acknowledgement was about 3 ms, but acknowledgement to actual child exit was about 1.014 s. Thus exit delay can occur separately from acknowledgement, and the earlier passing trace had a much shorter prototype exit interval.
- The second independent-server fetch and response body completed before `external.close()`, which took about 35 ms. The final closed-port fetch failed as expected. All three spawned children in each instrumented passing trace emitted exit; test assertions for both helper ports and the independent server passed. The collision child exited with code 1 as expected; successful helper children exited with code 0.

Run 3's first trace lacked individual fetch boundaries, and its probe implementation was an earlier subset of the retained driver. Run 5's retained driver can reproduce the detailed probe from a fresh archive. No logged delay proves the cause of the uninstrumented timeout. The first failed run's missing timeline is the decisive missing observation; a controlled instrumented timeout with a supervisor that retains ownership independently of the test worker would be a useful next check, subject to orchestration's safety decision.

## Isolation, ownership and limitations

The disposable root was named `FractionFlow` under a dedicated workspace directory, populated with `git archive` of the baseline and a separate Robocopy `/E /XJ` copy of installed dependencies, not a junction or shared writable cache. Key input files matched the baseline by Git-normalized blob hashes; package metadata and hidden lock matched by SHA-256; Robocopy's subsequent listing comparison reported no differences. This is evidence of copied installed dependencies, not a full file-by-file cryptographic integrity audit or proof of the original installation provenance. The canonical and isolated tests used the same installed package versions. The temporary copy was removed after the passing isolated runs and their test-owned child exits and closed-port assertions were observed.

The canonical passing run completed all its original cleanup assertions. The final canonical timeout was uninstrumented: no run-specific child handles, PID ledger, or allocated ports were captured. Vitest and its command returned, but that alone does **not** prove every helper or listener exited. No process was killed, no listener was probed or terminated based on a guess, and no additional attempts were made after this ownership uncertainty. An earlier temporary archive/copy setup lived in a command-specific sandbox temp location and could not be accessed from the next command; it did not run a test.

The retained `instrument-copy.cjs` requires the real path of the dedicated disposable root, rejects linked root/test paths, and checks the unchanged test's normalized SHA-256 before modifying it. After adding those guards, non-lifecycle checks confirmed refusal of the canonical root, a `.` alias of that root, and an altered test (each exit 1, altered file unchanged); a separate symlink refusal was not exercised. Set `FF81_TRACE` to a fresh absolute report-local file, invoke the driver with the verified disposable root, and run the command above there. It is not a safe timeout supervisor and cannot guarantee resource accounting if the worker is terminated. A future discriminating capture needs ownership established before launch, a supervisor retaining the ledger and trace past the unchanged 20-second deadline, and a reviewed safe cleanup path before additional runs. Neither increasing the timeout nor weakening assertions is recommended from this evidence.

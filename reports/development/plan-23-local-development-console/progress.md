# Plan 23 progress report — Local Development Console

Date: 2026-10-31

## Overall summary

Implemented the approved local development console with a submenu for local
servers, tests/builds, packet status, and advanced commands. Ordinary package
scripts share a Windows-aware command runner. Server actions launch a fixed
Node helper that owns a Vite server through private IPC and closes it through
Vite's `server.close()` API. The console requires helper readiness, a live
child, and an HTTP response containing the expected app title before displaying
a ready URL. Build and generated packet-index rendering require confirmation.

The approved amendment replaced a proposed `taskkill` tree cleanup after
Windows returned exit 1 with an authentication-related error, including for a
fresh process. That diagnostic was not treated as evidence of successful tree
cleanup. The final helper uses no PID discovery or process killing.

## Files changed

- `package.json` — added `dev:console`.
- `scripts/dev/console.mjs` — interactive menu, confirmation flow, shared
  execution, stable `--list` inventory, Exit and Ctrl+C cleanup.
- `scripts/dev/console-commands.mjs` — fixed command objects and invocation
  display shared by confirmation/execution; Windows package-script wrapper.
- `scripts/dev/console-servers.mjs` — owned child registry, readiness, duplicate
  start, entry-identity guards, startup cancellation, close acknowledgement,
  child exit and port status handling.
- `scripts/dev/console-server-child.mjs` — private IPC Vite child; strict
  loopback listen, config include guard, serialized startup/close, parent
  disconnect cleanup, truthful stop/start error messages.
- `tests/dev-console.test.js` — console unit, runner, lifecycle race, IPC,
  collision, real-server, independent-server and spaced-path coverage.
- `docs/workflows/local-development-console.md` — invocation, menu, port,
  readiness, confirmation, ownership and optimizer notes.

No packet status, generated board, canonical agent instructions, dependencies,
lockfile, shared Vite configuration, or unrelated Plan 39/44 source was changed.

## Artifacts and implementation evidence

- Default learner command is represented by the fixed invocation
  `node scripts/dev/console-server-child.mjs learner 5173`; default prototype
  command is `node scripts/dev/console-server-child.mjs prototype 5174`.
  These are Node/Vite API children, not `npm run dev` commands. Other npm script
  actions use `cmd.exe /d /s /c` with outer `shell: false` on Windows.
- The inventory lists stable menu IDs and serializable command specs without
  starting anything. It does not expose packet `set`.
- Tests and live checks verify build/render confirmation, cancellation with no
  dispatch, command-object reuse, launch error vs nonzero exit, duplicate and
  replacement-child races, startup cancellation, IPC errors, missing close
  acknowledgements, parent disconnect, unowned-port refusal, and one shared
  stop promise.
- A real Windows interactive menu test served both learner and subtraction
  prototype app pages on isolated loopback ports, confirmed their expected
  titles/paths, then used menu Exit and verified the owned ports refused new
  requests. A separate Vite fixture survived an actual console start collision
  and Exit and was then closed by its own retained Vite handle.
- Startup cancellation and parent IPC disconnect were exercised with real
  helper child processes. A temporary helper path containing spaces launched
  with `shell: false`.
- The occupied default learner port, 5173, was refused without adoption. Its
  identity is unknown and it was left untouched; default-port learner live
  success/cleanup is therefore not established in this session. The prototype
  default port 5174 was also exercised interactively before the approved helper
  amendment; the amended helper's real prototype lifecycle was verified on an
  isolated port.

## Commands run and results

- `node scripts/dev/plan-status.js check 23` — `RUNNABLE` before work and again
  after implementation.
- `npm run dev:console -- --list` — printed command inventory and exited.
- `npm test -- tests/dev-console.test.js` — 17 tests passed on Windows after
  final lifecycle changes.
- `npm test` — 58 test files, 551 tests passed on Windows.
- `npm run build` — both learner and prototype builds completed sequentially.
- `node scripts/dev/plan-status.js lint` — passed.
- `node --check` on all four `scripts/dev/console*.mjs` modules — passed.
- `git diff --check` — passed.

The real `cmd.exe` wrapper test is Windows-only; its shape tests remain
platform-independent. Linux execution was not available in this task, so POSIX
test/build-runner and process-disconnect behavior is not claimed as validated.
The Vite child uses cooperative API shutdown; no Windows Job Object or
machine-wide process-policy change was introduced. An abrupt helper crash can
leave optimizer-side effects outside the helper's cooperative close contract;
the console reports process exit/cleanup uncertainty rather than claiming a
descendant-tree guarantee from a port check alone.

## Technical review disposition

- Requested review: one default-role, read-only `gpt-6.1-terra` reviewer at
  medium effort, as authorized for this substantial lifecycle work.
- Observed model/effort: **unverified**. The reviewer runtime explicitly said
  it could not independently verify its model identity or reasoning effort. No
  model substitution was made by the primary agent; the invocation carried the
  requested model/effort settings, but I do not claim billing/model facts that
  the runtime could not certify.
- Review posture: instruction-read-only, no fan-out requested. The reviewer
  reported no file edits or tests. A distinct immediate status snapshot before
  primary repair edits was not captured, so structural read-only isolation is
  not claimed.
- Findings: all three findings were accepted and repaired inline. (1) Startup
  cancellation and failed listen now await the startup promise and invoke
  `server.close()` even before listening; close errors return `stop-error` and
  do not send a false stopped acknowledgement. (2) Cleanup and deletion retain
  entry identity, preventing a delayed earlier child from stopping or removing
  its replacement. (3) A ChildProcess `error` with a live PID is treated as an
  IPC/process communication error, not as proof the child exited. Tests cover
  each path, including actual strict-port collision followed by Exit.
- No findings were rejected. One review pass ran; no second review was used.

## Problems and follow-ups

- The initial `taskkill` mechanism failed its exit-status contract in this
  managed Windows environment. Orchestration approved the private IPC/Vite API
  amendment; the implementation and tests now use that mechanism.
- Windows port 5173 remains occupied by an unknown listener. No attempt was
  made to identify or terminate its owner. Owner live-console acceptance must
  choose a safe time/port for the default learner start/stop walkthrough.
- Owner live menu/start/stop acceptance remains required. No push or deployment
  was performed.

## Ready for orchestrator review

Yes. The scoped implementation is committed; this progress report is committed
separately as the final commit. Packet status remains orchestrator-owned.

Implementation commit: `2391654` (`Add local development console`).

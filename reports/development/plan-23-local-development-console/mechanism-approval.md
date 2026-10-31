# Plan 23 Requirement 0 mechanism approval

Date: 2026-10-31. Proposal received directly from FF Impl 23; preflight RUNNABLE.
Source gate: APPROVED with the binding details below. This approves local tooling,
not packet closure, owner live acceptance, Bootstrap writes or deployment.

The investigator found both Vite configurations omit explicit ports; the current
package scripts and sequential learner/prototype build corroborate the proposal.
The menu, centralized Windows runner, strict ports and child-handle ownership are
appropriate. Parent reviewed these small configuration seams inline; no advisor
was needed for mechanism approval. User messaging authorization was verified in
the human starting message of FF Impl 23, not inferred from its incoming request.

## Menu and commands

Approve Local development / Tests & builds / Packet status / Advanced / Exit.
Local includes learner/prototype Start, owned Stop and running-server status.
Tests/builds exposes npm test and npm run build. Keep the long npm run test:routes
command once under Advanced, rather than duplicate menu entries. Packet status
exposes list/check/lint; omit status set from this initial console. Advanced may
expose confirmed index render. Inventory --list must not launch anything.

Use a single invocation object for confirmation and execution, carrying actual
executable/argv/cwd/stdio semantics. Mutating build/index-render requires explicit
confirmation. Cancellation dispatches nothing. Do not provide arbitrary shell
command input: fixed script names and typed/validated arguments keep the cmd.exe
boundary bounded. Node packet commands should use process.execPath with argv.
Do not confuse JSON encoding or a pretty command label with Windows shell quoting.
Preserve paths with spaces; report spawn errors separately from exit code/signal.

## Server mechanism and important readiness correction

Approve loopback learner port 5173 and prototype port 5174 via script arguments
--host 127.0.0.1 --port <port> --strictPort. Do not edit shared Vite configs or
adopt a foreign server. No killing by port/name or global PID discovery.

HTTP success at the expected URL ALONE cannot establish readiness: a foreign
server can already be responding while the new strict-port child is still
starting and about to fail. Require positive startup evidence attributable to
THIS spawned instance (for example its Vite ready/Local URL output), a still-live
owned child and a successful response for the expected application path. Tee owned
server output through if parsing is needed; ordinary commands may inherit stdio.
Do not hide normal output merely to collect readiness. Default paths are
/FractionFlow/ and /FractionFlow/prototypes/subtraction/, with actual BASE_PATH
handling or a clear reported unsupported configuration rather than a guessed URL.
Bound startup wait and cancel; a collision must never appear ready even when the
foreign server serves a plausible matching page. Test that case explicitly.

Register starting instances before asynchronous readiness, so duplicate Start and
Stop/Ctrl+C during startup cannot race into duplicate children or untracked work.
Track child handles/lifecycle, not durable PID ownership. A natural exit/error
clears or marks the instance non-live; never taskkill a PID after its handle has
already exited. Guard delayed callbacks and repeated Stop/cleanup operations.

On Windows, taskkill /PID <verified currently live owned root> /T /F is approved
for the console-created cmd process tree only. Use argv with shell:false. Await
and report termination command outcome, child exit and bounded cleanup checks;
root exit alone is not proof all descendants stopped. Never claim success after
a cleanup failure or attempt fallback discovery of unrelated processes. If root
ownership is lost while descendants may remain, report and stop that lifecycle
attempt rather than using a stale PID. POSIX process-group handling must apply
only to a group this console deliberately created; state platform test limits.

Prove owned learner/prototype cleanup, repeated cycles, startup interruption,
duplicate starts and survival of an independently launched server after Stop/exit.
Mocks do not establish Windows npm/cmd/Vite descendant cleanup. No shutdown of
another thread's server even when its port conflicts with the reserved port.

## Owned files and concurrency

Approved paths: scripts/dev/console.mjs, scripts/dev/console-commands.mjs,
scripts/dev/console-servers.mjs; tests/dev-console.test.js (additional console-
specific test file only if justified); docs/workflows/local-development-console.md;
package.json's dev:console script; and this Plan23 report directory. No dependency
or lockfile changes. If materially different helper boundaries are needed, send
the narrow ownership adjustment before editing outside these paths.

Plan44 writes its own report directory; Plan39 owns renderer/witness repairs.
Do not stage their work or edit packet/index/status. Console index render is an
exposed user capability, not permission to overwrite concurrent board edits during
implementation evidence. Coordinate shared dist/build/browser-server use and Git
commits; read-only design activity itself need not block unrelated console work.

## Review and delivery

Use one cold default-role Terra-medium read-only review for the substantial
implemented lifecycle/runner work before final broad validation. No Sol/Astra,
model substitution or child fan-out. Report findings and independent dispositions;
orchestration will not duplicate that Terra pass on the same delivery turn.
If unavailable, report degraded mode rather than substitute a tier.

Targeted tooling/live lifecycle checks during editing, then appropriate final
tests/builds/lint/diff. Learner route matrix only if app/build/route behavior
actually changes; this console should not require it. Preserve exact ownership,
readiness/collision and cleanup evidence, tested OS and limits. Commit scoped work,
then progress.md separately last. Return for independent technical review and
owner live menu/start-stop acceptance. Never change packet status, push or deploy.

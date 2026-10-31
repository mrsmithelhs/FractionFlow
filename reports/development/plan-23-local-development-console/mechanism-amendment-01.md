# Plan 23 mechanism amendment 01 — owned cooperative Vite child

Date: 2026-10-31. Amends mechanism-approval.md (071dec8) after the Windows
cleanup diagnostic. APPROVED: source gate reopens for this bounded alternative.

## Evidence and disposition

Implementer reports taskkill /PID <fresh owned root> /T /F exits 1 with an
authentication-related error even when that exact root disappears. A simple
owned Node probe has no descendants; it does not prove npm/Vite tree cleanup.
The mechanism therefore cannot honestly treat taskkill as successful here.
No machine-policy cause or permission fix is established or authorized.

Its bounded private-IPC Node/Vite prototype served learner and prototype pages,
sent ready, cooperatively awaited server.close on stop, acknowledged, exited 0,
and the expected port refused requests. Immediate optimization cancellation
sometimes logged an esbuild error; local noDiscovery/empty-include probes avoided
it. These are implementer diagnostic observations, not parent-reexecuted product
acceptance. Parent checked installed Vite type support for the proposed API and
dependency-discovery option. Final implementation and live evidence remain gated.

## Approved ownership change

Add scripts/dev/console-server-child.mjs to the owned paths. For the two server
menu actions only, use process.execPath with the fixed helper path and validated
learner/prototype argument, shell:false and a private IPC channel. Use existing
Vite config files through createServer with strict loopback ports. No dependency,
lockfile or shared Vite-config changes. Ordinary npm tests/build/routes continue
through the centralized Windows-safe cmd wrapper. Update inventory, displayed
command and docs to match the actual Node helper execution; do not claim the
server action still launches npm run dev. Direct package scripts remain usable.

Register before start; readiness needs this child's post-listen ready IPC, live
handle and matching app-path response. Stop/startup cancellation sends a private
message and requires successful close acknowledgement plus child exit. Serialize
start/stop and disconnect handling so a late listen cannot escape a canceled
startup and overlapping cleanup cannot double-close or falsely report failure.
Treat ack-without-exit, exit-without-ack, crash, timeout, malformed message and
parent disconnect explicitly. Do not discover or kill unrelated/stale PIDs.

Post-close port checks are useful, but an independently acquired port does not
prove the owned child survived; report uncertainty accurately and never kill its
new occupant. Do not claim whole-tree guarantees solely from root exit/port
refusal. Use Vite's close contract and demonstrate ordinary lifecycle completion;
record helper/crash cleanup limitations honestly rather than adding native jobs.

The local helper may set optimizeDeps.noDiscovery:true and include:[] to avoid
the observed initial scan/close race, provided this is isolated to console-owned
dev servers, documented and checked by actual learner/prototype browser loading
and navigation. Do not silently override future nonempty includes or change
project-wide optimizer configuration; report any needed broader policy change.

Keep bounded timeouts and truthful failure states, both startup and steady-state
interruptions, repeated cycles and an unowned server surviving. Prove the fixed
helper works from a checkout path with spaces or exercise its invocation shape
with an equivalent owned temporary fixture. Persist the exact diagnostic evidence.

One Terra-medium read-only implementation review remains authorized; run it on
the settled cooperative mechanism before final validation, not another mechanism
draft. No Sol/Astra/substitution/fan-out. Preserve all other approved confirmation,
scope, commit and owner live-acceptance gates. No system configuration changes,
native helper/dependency installation, status edits, push or deployment.

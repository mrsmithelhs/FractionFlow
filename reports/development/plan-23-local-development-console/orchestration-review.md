# Plan 23 technical delivery review

Date: 2026-10-31. Implementation 2391654; final progress b94e8f5.
Disposition: technically ACCEPTED; DELIVERED pending owner live-console/menu
acceptance. No packet closure, push or deployment.

## Objective and independent evidence

The console exposes grouped local server lifecycle, tests/builds, packet visibility
and advanced commands. Build/index render confirmation uses the same invocation
object as execution; status mutation is omitted. Windows npm commands use the
central cmd.exe wrapper. Owned server actions correctly disclose their different
fixed Node/Vite API helper. No dependency or shared Vite config changes occurred.

Parent inspected the command builder, menu, helper, ownership state and relevant
tests directly. Parent independently ran tests/dev-console.test.js on Windows:
17/17 pass. This includes real helper learner/prototype menu start/Exit at isolated
ports, matching responses, cooperative port closure, startup cancellation, parent
disconnect, actual collision and independent-server survival, and spaced-path
invocation. Parent also ran the CLI inventory and checked grouped IDs. These
tests do not replace owner use of the actual menu on default ports.

The originally proposed taskkill mechanism was not accepted as successful after
its nonzero/error diagnostic. Mechanism amendment f9b19e1 uses private IPC and
Vite.close instead, with positive child readiness, strict loopback port/path
validation, shared cleanup promises and actual exit acknowledgement. The test-only
port injection approved in orchestration chat retains production defaults and
strict refusal; no automatic fallback or foreign-process takeover was introduced.

## Load-bearing review and repair

One implementer-requested default-role Terra-medium read-only pass ran. Its
requested settings are reported; observed runtime model/effort could not be
independently certified. Preserve that uncertainty. It found startup-close-before-
listen and stale-entry replacement races plus failed-listen teardown. The parent
inspected those fixes inline: serialized startup/close, close-error reporting,
entry-identity guards and absence of stale name-based replacement cleanup.
No duplicate parent Terra, Sol, Astra or other advisor was used.

Parent separately flagged overlapping SIGINT/final cleanup, truthful duplicate
starting status, IPC errors not proving exit, and a Windows-only execution test
that would run cmd.exe under the existing Ubuntu deployment test job. These were
fixed within implementation. The real cmd test is now platform guarded while
portable command-shape tests remain active. No Linux run is claimed. Findings
attribution is clarified in the progress report addendum; no new repair required.

Full 551-test suite and sequential builds are implementer-reported; parent reran
the focused 17, not the full suite/build. No learner route-matrix rerun is needed
for this tooling-only change. Test 20-second live-server timeout accommodates
full-suite concurrency; it does not weaken any lifecycle/ownership assertion.

## Owner gate and limits

Port 5173 is occupied by an unverified listener and was left untouched. Final
learner live success is demonstrated on isolated ports, not a free default 5173.
Owner acceptance needs a safe default-port window: close an existing server only
from a terminal/workflow whose ownership the owner recognizes, then run
npm run dev:console, Start learner, visit its reported URL, Stop, restart and Exit.
Try the prototype and packet visibility too. Verify the console returns/exits
cleanly; Ctrl+C live UI behavior still merits owner inspection. A collision should
report failure without disturbing the existing service.

Cooperative close and tested expected-port refusal are not an OS-level guarantee
against every crash-time descendant leak. POSIX runtime behavior, every custom
BASE_PATH/Vite config and abrupt hardware/process failure remain unproved. The
local noDiscovery optimizer setting is documented and refuses explicit include
overrides; app response/navigation acceptance stays bounded to the sampled checks.

No code changed during orchestration acceptance. Plan39 and Plan44 remain at
their separate owner acceptance/adoption gates. Preserve the static learner
product, no accounts/tracking posture and separate deployment authorization.

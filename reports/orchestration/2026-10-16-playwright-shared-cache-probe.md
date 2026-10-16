# FractionFlow shared-browser cache probe

Date: 2026-10-16 (America/New_York). Probe observed around 13:19 UTC.

## Authority and ownership

Parent verified the original owner's three-way coordination authorization in
BO Orch 44+'s human turn. Bootstrap and FractionFlow agreed on one minimal
process-local reuse launch with existing binaries; no consumer source/config
edit, install/download, move/delete, global environment or ACL change. Bootstrap
owns shared tooling/docs; each consumer retains its own later wiring decisions.
Plan 34's implementation and its acceptance gates are unaffected.

## Installed and effective configuration

- Installed `playwright`: **1.63.0**.
- Its installed `playwright-core/browsers.json` requires Chromium **1243** and
  chromium-headless-shell **1243**, browser version **153.0.8010.12**; ffmpeg **1011**.
- No `PLAYWRIGHT_BROWSERS_PATH` override was present in the inspected task process.
  Effective `LOCALAPPDATA` is sandbox-redirected, so default browser lookup points
  into a task-specific cache. Absence there is not absence in the user's cache.
- The ordinary user cache contains the matching headless-shell executable,
  observed file size **211,550,720 bytes**. The matching full Chromium executable
  was not present at the expected checked path. No whole-cache byte saving or
  filesystem-wide inventory is claimed.
- `scripts/dev/run-route-matrix.js` accepts `preferredChannel` and otherwise
  auto-selects installed Edge/Chrome on Windows. A cache override alone therefore
  does not change that runner's channel choice. Plan 33 capture explicitly uses
  Chrome. Existing successful Chrome evidence remains separate from this probe.

No local instruction prohibiting a minimal browser-test launch was found in
the inspected FF guide/workflow/provider files. Another consumer's historical
restriction is not proof of FF policy. No browser policy was bypassed or changed
for this test; standard Playwright launch defaults were used without custom flags.

## Actual probe

In one shell process only, set `PLAYWRIGHT_BROWSERS_PATH` to the existing ordinary
user cache before loading this repository's Playwright package. Enable process-
local browser diagnostic logging. Call `chromium.launch({headless:true})` without
`channel` or `executablePath` overrides; create a blank page, set a small local
document/title, read title/URL/version, and close in `finally`.

The launch log identifies the existing **chromium_headless_shell-1243** executable.
The browser reported **153.0.8010.12**, URL **about:blank**, and the expected local
probe title. Browser exit code was **0** and Playwright reported temporary-profile
cleanup. The run emitted nonfatal ANGLE/Vulkan CWD diagnostics; no GPU/rendering
acceptance is inferred. The app was not loaded and no route suite was run.

An initial diagnostic attempted to import an internal Playwright registry module
at an obsolete package layout and failed before launching a browser. Parent removed
that unsupported metadata dependency. Exactly one actual browser reuse launch
then ran successfully; no channel fallback, elevation or downloaded replacement.

All machine paths remain outside this report. Process-local overrides expired
with the command; no ignored config loader or persistent setup was created.

## Conclusion and limits

**Successful reuse from this actual FractionFlow context** of an already installed
matching browser. ClassroomApps success is separately reported by its orchestrator;
FF did not independently rerun CA. This does not prove every sandbox identity,
future session, full browser variant, revision combination or application suite
will work. It establishes no measured disk/download savings or cleanup policy.

For reusable wiring, preserve pinned package versions and resolve the matching
revision; make cache selection explicit before importing Playwright and launch
channel selection explicit for callers that currently auto-select branded browsers.
Treat any ignored machine-path loader/config as separate approved consumer work.
No configuration edits are required to preserve this initial observation.

Bootstrap was notified through the authorized native message route; its own
report/recipe remains Bootstrap-owned. Source/tests/package locks and Plan 34
files were not changed by this probe. This report is the sole FF write.

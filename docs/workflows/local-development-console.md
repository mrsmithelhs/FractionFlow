# Local development console

Run `npm run dev:console` from the repository root. The menu groups local
development, tests/builds, packet status, and advanced commands. `npm run
dev:console -- --list` prints the stable noninteractive menu inventory without
starting a process.

## Servers

The console starts an owned Node child that creates the learner Vite server at
`http://127.0.0.1:5199/FractionFlow/` or the subtraction prototype at
`http://127.0.0.1:5174/FractionFlow/prototypes/subtraction/`. The child reports
readiness over private IPC after Vite listens; the parent also checks the
expected application title over HTTP and that the child is live. An occupied
port fails. The console never adopts or stops a process it did not launch.
Stop and console exit request Vite's cooperative `server.close()`, then require
the stopped acknowledgement and child exit. Ctrl+C requests the same cleanup.
Cleanup failures are reported; a later occupant of the port is left untouched.

The helper uses Vite's `optimizeDeps.noDiscovery` and an empty include list only
for these local console servers to avoid an optimizer scan racing shutdown. It
refuses configurations with explicit nonempty `optimizeDeps.include` rather
than overriding them.

The URLs assume the default `BASE_PATH`. If you set a custom base path, check
the reported readiness result; custom paths that cannot be positively verified
fail closed. Avoid starting a console build while another local workflow is
writing `dist/`.

## Commands and confirmations

`npm test`, packet `list`/`check`/`lint`, and the advanced `npm run test:routes`
run directly. `npm run build` and packet index `render` show the exact
invocation before asking for confirmation. A declined confirmation runs nothing.
Packet `set` is intentionally absent; the console does not confer orchestrator
authority.

Tests, builds, and route checks run through one platform-aware package-script
helper. On Windows it uses `cmd.exe /d /s /c` with `shell: false`; launch errors
are reported separately from command exit codes. Server startup is a fixed
direct Node helper invocation, not `npm run dev`; the direct package scripts
remain available for ordinary terminal use.

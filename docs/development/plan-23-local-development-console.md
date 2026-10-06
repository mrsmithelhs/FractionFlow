---
id: plan-23
title: Local Development Console
status: draft
depends_on: [plan-01]
gate: "Requirement 0: propose the menu, Windows package-script invocation and owned-server lifecycle mechanism before source work. Technical review and owner live start/stop acceptance before completion. No remote operations or deployment."
superseded_by: null
resolution: null
summary: >-
  Make Bootstrap's adopted dev-console-hub guidance usable in FractionFlow:
  an npm run dev:console menu for local server start/stop, tests, builds and
  packet visibility with safe Windows invocation and explicit mutation confirmations.
---
# Plan 23: Local Development Console

## Packet Metadata

- Packet id: `plan-23`
- Packet title: Local Development Console
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-10-06
- Packet type: tooling
- Mutation level: local Node tooling / package script / tests / documentation
- Approval gate: mechanism, technical review, owner live console acceptance
- Expected artifacts: console and shared execution/lifecycle helpers, tests, usage documentation, progress report

## Goal and evidence

Provide `npm run dev:console` as a small submenu-driven hub for the existing
learner/prototype dev servers, tests/builds and packet-status commands.
The current `.bootstrap-adoption.json` declares dev-console-hub 1.1.0 adopted;
AGENTS carries its guidance, but package.json has no dev:console script and the
scripts inventory has no console implementation. Bootstrap's capability ledger
explicitly describes a project-specific pattern with no portable console code.
Treat adopted guidance and executable consumer implementation separately.

This local tooling can proceed independently of the learner motion/deployment
gates. Drafting does not initiate the packet or authorize its source mechanism.

## Non-goals and authority

No learner bundle/UI, instructional state, math/content, deployment workflow,
dependency upgrade, remote push/pull, account setup, automatic packet advancement,
fleet console or Bootstrap source mutation. Read AGENTS.md, decision-log.md,
development/README.md, package.json, current Vite configs, packet-status tooling
and Bootstrap's dev-console-hub 1.1.0 capability guidance. Resolve the companion
checkout from the ignored `.env` BOOTSTRAP_REPOSITORY_PATH; never commit its
machine-specific location. Preserve the static product and public-repository PII boundary.

## Scope

Local `scripts/dev/` console and helpers, package.json's dev:console entry,
meaningful tooling tests and local usage docs. Identify exact paths at the gate.
Any manifest clarification must describe verified guidance/runtime state using
the existing capability schema, not invent new state values or refresh unrelated
audit/version claims. Do not edit canonical agent instructions or other packets.

## Requirement 0 — Investigate and propose; stop

Run preflight. Propose a compact menu: local development, tests/builds, packet
status, and narrowly useful advanced commands. Show the actual commands, how URLs
and readiness are reported, and how the menu remains usable while a server runs.
Inspect learner/prototype ports and conflicts before choosing lifecycle behavior.

Use one platform-aware package-script runner. On Windows use the tested
`cmd.exe /d /s /c` wrapper with `shell: false`, or a demonstrably equivalent safe
mechanism; do not directly spawn npm.cmd. Derive displayed confirmation and actual
execution from the same command object. Report launch errors separately from child
nonzero exit codes, and carry ordinary terminal output through.

Propose ownership of each launched server and its child process tree, readiness,
duplicate starts, port collisions, natural exit, Stop, console exit and Ctrl+C.
Stop only a server launched and still owned by this console. Never kill a process
because it holds a port, by executable name, or using an unverified stale PID.
Choose and document how shutdown settles owned children without terminating other
terminals' servers. No machine-wide process or firewall changes.

The packet-status submenu must expose list/check/lint. Mutating commands such as
build, generated-index render and packet-status set require confirmation showing
the exact invocation. Keep orchestrator authority over status; running the console
does not grant an implementer permission to close packets. Propose a noninteractive
menu inventory mode for review/tests. Return for mechanism approval before source edits.

## Implementation and evidence after approval

Implement the approved small console without speculative task-runner abstractions.
Meaningful tests cover command-object parity, Windows launch shape, spawn failure
versus nonzero exit, cancellation without execution, duplicate start, owned stop,
unowned refusal and shutdown cleanup. Keep lifecycle failure information visible.

Exercise real learner and prototype start/stop locally, confirming served content
and that the owned port becomes free after stop. Use a separately launched local
server to prove it survives console Stop/exit. Observe repeated start/stop and
interrupted startup. Report tested OS and all lifecycle limits; mocks alone do not
prove process-tree cleanup. Owner live menu/start/stop acceptance remains separate.

Run focused tooling tests, appropriate full tests/builds, packet lint and diff
check; source app routes need rerunning only if the app/build/route behavior changed.
Record exact evidence, advisor consultation/degraded-mode declaration and remaining
owner gate in `reports/development/plan-23-local-development-console/progress.md`.
Commit scoped paths explicitly and progress report last. Never push, deploy or
change packet status. Stop if a safe lifecycle requires broader system changes.

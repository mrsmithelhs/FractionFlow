---
id: plan-81
title: Dev-Console Lifecycle Timeout Diagnostic
status: delivered
depends_on: [plan-23, plan-78, plan-79]
gate: "Approve the bounded reproduction and instrumentation plan first. Review the evidence and proposed fix before any shared source or test change."
summary: >-
  Localize the intermittent Windows dev-console real-server test timeout
  using phase timing, matched controls, and verified process ownership.
  Report a bounded remedy only where the evidence supports it.
---
# Plan 81 — Dev-Console Lifecycle Timeout Diagnostic

## Packet Metadata

- Packet id: `plan-81`
- Packet title: Dev-Console Lifecycle Timeout Diagnostic
- Status: (see frontmatter)
- Owner/model: one investigator, orchestration scope and evidence review
- Date: 2026-11-07
- Packet type: tooling investigation
- Mutation level: report-local diagnostics and disposable reproduction
- Approval gate: Requirement 0 before instrumentation, separate review before any fix

Follow [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md) and the [packet board](README.md). Read [Plan 23](plan-23-local-development-console.md) and the [Plan 79 delivery review](../../reports/development/plan-79-unlike-subtraction-bank-publication/orchestration-delivery-review.md). The combined full run passed 697 of 698 tests. The real learner/prototype lifecycle test exceeded 20 seconds. Targeted runs passed in pre-change and Plan 79 archives at about 1.8 seconds each, and once in the canonical checkout at 19.6 seconds. These observations do not isolate a cause.

## Requirement 0 — Propose and stop

Run packet preflight when dispatched and pin a baseline. Own only `reports/development/plan-81-dev-console-lifecycle-timeout-diagnostic/` in the shared checkout. Save `scope-proposal.md` with an explicit hypothesis table, discriminating runs, probes, attempt/time limits, and isolation and cleanup procedure. Cover the canonical checkout and a verified isolated copy. Stop for approval before instrumentation. Plan 80 may run independently.

## Diagnostic and delivery

1. Start from `tests/dev-console.test.js` and the actual console command, server manager and child-helper modules. Reproduce the exact test with the current deadline before changing anything. Record actual Node/npm, checkout and dependency provenance, worker count, concurrent work and loopback configuration without dumping unrelated environment or process data. Keep canonical test source read-only. Apply any instrumented code in a verified disposable checkout, or use a report-local driver. Assert the working directory and pin before each run. Treat archive-only test assumptions as a limit on comparisons.
2. Timestamp the individual awaits using a monotonic clock. Separate menu input and dispatch, port allocation and collision, child spawn and IPC readiness, HTTP checks, child stop acknowledgement and process exit, independent server survival, and final cleanup. Capture the last completed event and the first missing event for each timeout, with phase durations for passing runs. Use only freshly allocated loopback ports and test-owned processes; keep the current development server and any foreign listeners untouched. Verify cleanup of owned resources on both success and failure.
3. Compare plausible alternatives, including readiness or bind delay, cooperative stop/exit delay, HTTP or independent-server cleanup delay, and orchestration or checkout/load effects. Give each a falsifier and at least one control that separates competing explanations. Begin with repeated targeted runs under matched conditions and vary one factor at a time before a whole-suite comparison. Record passing, failing and censored attempts separately and report range and tail timings where the sample supports them. If the failure cannot be reproduced or localized, identify the missing observation instead of assigning a cause.
4. Deliver `diagnostic.md`, a reproducible command or driver, sanitized timings and a bounded remedy or next discriminating check, plus `progress.md` committed last. Preserve the 20-second deadline and existing assertions, confirmation and cleanup semantics. Do not terminate unowned processes, change default ports, weaken the test, alter shared source or tests, or deploy. Route a proven fix through a separate scope decision.

Checklist. Resolve links, run packet lint and scoped diff checks, and account for all test-owned child processes and listeners. State the advisor disposition under AGENTS.md. Report for review and leave packet status and repair authorization to orchestration.

## Controlled-timeout follow-up

2026-11-07. The owner directed the existing implementer to continue this investigation under Plan 81. Preserve the [bounded diagnostic](../../reports/development/plan-81-dev-console-lifecycle-timeout-diagnostic/diagnostic.md) and its unknown cleanup outcome. Work only in the report folder and verified disposable setup. Before attempting the intermittent case again, prove on a controlled timeout that a supervisor records ownership before launch, retains phase events after the worker deadline, requests cooperative cleanup and confirms exact child exits and closure of owned listeners. Include a passing control and leave any independent listener untouched. Record failed cleanup or incomplete traces as a stop, with no port-based or name-based termination. Stop after the controlled proof for orchestration review before the real reproduction. Preserve the real test's 20-second deadline and assertions. No console fix is authorized.

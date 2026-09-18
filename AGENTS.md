# FractionFlow — Agent Guide

> **This is the canonical agent entry point for this repository.**
> `CLAUDE.md` (repo root) points here. Read this file before working on any task.

---

## 1. Project Overview and Current Stage

FractionFlow is a calm, browser-based learning environment for practicing fraction addition and subtraction, designed to help learners move from visual understanding to efficient symbolic computation without accounts or advertising.

**Current stage: design and specification phase.**

---

## 2. Area Map

| Area | Description |
|---|---|
| Math Core (`src/math/`) | Deterministic exact-arithmetic fraction engine (pure logic, no DOM, no UI). |
| Content (`src/content/`) | Problem families, instance generation, and deterministic problem seeds. |
| Interaction (`src/interaction/`) | Episode and scaffold state machines governing instructional state and transitions. |
| Render (`src/render/`) | Presentation components (fraction bars, number lines, symbolic notation). |
| App (`src/app/`) | Root application composition, layout, and static site routing. |
| Founding Docs (`docs/founding/`) | Canonical design specifications (principles, pedagogy, grammar, architecture, quality). |

---

## 3. Core Repository Structure

```
FractionFlow/
├── .bootstrap-adoption.json      # Bootstrap capability adoption manifest
├── .claude/                      # Claude Code agent definitions (explorer, implementer, etc.)
├── .codex/                       # OpenAI Codex agent definitions
├── docs/                         # Documentation hub, decision log, open questions
│   ├── agent-starting-prompts/   # Role starting prompts (orchestrator, implementer, etc.)
│   ├── development/              # Implementer handoff packets (plan-*.md) and packet board
│   ├── founding/                 # Canonical design specifications (authoring in progress)
│   ├── workflows/                # Process and tracking guides
│   └── project-seed.md           # Project seed brief and defining constraints
├── reports/                      # Implementer progress reports and review records
├── scripts/                      # Tooling scripts (e.g. scripts/dev/plan-status.js)
├── src/                          # Planned source code (math, content, interaction, render, app)
└── tests/                        # Planned property-based and unit tests
```

---

## 4. Key Commands

Run from the repository root:

```
# Project build/test commands will be established by the initial tooling spike.
# (No package.json is installed yet during the design and specification phase.)

# Packet status tooling:
node scripts/dev/plan-status.js list            # table of all packets + effective status
node scripts/dev/plan-status.js check <id>      # exit 0 + RUNNABLE, or exit 1 + reason
node scripts/dev/plan-status.js lint            # check for schema violations
node scripts/dev/plan-status.js render          # regenerate docs/development/README.md index
node scripts/dev/plan-status.js set <id> <status> [--resolution "…"] [--superseded-by <id>]
                                                # orchestrator: change status + re-render + lint atomically (refuses to write if result won't lint)
```

> **Before starting any packet, run `node scripts/dev/plan-status.js check <id>`.**
> **If it exits nonzero, stop and report the reason — do not implement a blocked packet.**

**Optional dev console:** If the project exposes `npm run dev:console`, treat it as a submenu-driven command hub for local dev lifecycle, tests, builds, packet-status visibility, and advanced scripts. The packet-status submenu should make the list/status view easy to reach, and any command that mutates local generated output, packet frontmatter, or remote/external state should be confirmation-gated before it runs. If the console executes package scripts:
- Centralize package-script execution behind a shared wrapper helper.
- Avoid spawning raw `npm.cmd` directly on Windows (spawn `cmd.exe /d /s /c "npm run <script> -- <args>"` or equivalent tested wrapper with `shell: false` to avoid launch/EINVAL issues).
- Ensure the invocation command shown to the user on confirmation screens is the exact same command object that gets executed.
- Report spawn/launch failures (e.g. `result.error`) distinctly from child process nonzero exit statuses so environment/configuration errors are immediately debuggable.
- Add regression tests to the console's test suite to cover script launching and error handling.

---

## 5. Critical Architecture Constraints

**Read this section before touching any shared code.**

1. **Strict Unidirectional Pipeline**: All system architecture is governed by `mathematical state → instructional state → presentation`. The render layer receives validated state and communicates it; it never computes mathematical truth.
2. **Deterministic Exact Arithmetic Core**: All mathematical truth is computed in `src/math/` (pure logic, zero DOM, zero UI dependencies, zero generative AI in the math loop).
3. **Static-Only GitHub Pages Architecture**: No server, no accounts, and no backend. All assets and application bundles deploy statically to GitHub Pages. All progress persistence is strictly local to the learner's browser.
4. **Child-Centered Accessibility & Calm Design**: Accessibility, readable typography, reduced-motion support, and child-appropriate touch targets are foundational design inputs from day one, not retrofitted compliance fixes.

---

## 6. Key Reference Routing Table

When your task touches a component, read these first.

**Orientation / project-wide** (read first on any task)

| Topic | Read this |
|---|---|
| Repo folder roles and rules | `docs/repo-structure.md` (if it exists) |
| Project decisions history | `docs/decision-log.md` |
| Active / pending plans | `docs/development/README.md` |
| Documentation hub | `docs/README.md` |
| Project seed & defining constraints | `docs/project-seed.md` |
| Founding principles & non-goals | `docs/founding/00-principles.md` (authoring in progress) |
| Instructional model | `docs/founding/01-instructional-model.md` (authoring in progress) |
| Interaction grammar | `docs/founding/02-interaction-grammar.md` (authoring in progress) |
| Math & content model | `docs/founding/03-math-and-content-model.md` (authoring in progress) |
| System architecture | `docs/founding/04-system-architecture.md` (authoring in progress) |
| Quality & validation | `docs/founding/05-quality-and-validation.md` (authoring in progress) |
| Project roadmap | `docs/founding/06-roadmap.md` (authoring in progress) |
| Packet tracking system | `docs/workflows/packet-tracking-system.md` |
| Packet creation guidance | `docs/development/packet-creation-guidance.md` |

---

## 7. Guardrails

**These apply in every task. Do not override without explicit owner approval.**

1. **Implementers never set packet completion status.** Do not flip `status: draft` to `complete` or edit orchestrator review notes. Report results and stop; the orchestrator/owner verifies and sets status.

2. **Verify against artifacts, not reports.** "Tests pass" and large counts are evidence, not proof. State precisely what was verified and how, so a reviewer can confirm the claim maps to the goal. Don't declare victory on a proxy metric.

3. **Decisions route through the owner.** Anything an implementer writes as "owner decision" without an owner in the loop is a defect. Surface unresolved decisions in the progress report; stop if the decision is load-bearing.

4. **Terminal states require a written `resolution`.** A `complete`, `superseded`, or `parked` packet with `resolution: null` fails lint. If you close a packet, write why.

5. **Report against the actual objective, not a proxy.** The progress report must state what was verified and how — not just that tests passed. The reviewer must be able to confirm the claim maps to the goal without re-running everything.

6. **Investigation before mutation, with an owner gate between.** For significant behavioral or structural changes: first investigate and produce a report; then wait for an owner gate; then implement. Packets that jump straight to implementation without evidence of the problem are high-risk.

7. **Docs describe what exists or is decided, never what is imagined.** A doc that describes planned or speculative state misleads the next agent. If it's aspirational, say so explicitly, or don't write it yet.

8. **Public repository PII boundary is absolute: Never commit personal information, learner or student data, account credentials, analytics keys, or deployment secrets. The product posture is strictly static with no accounts, no advertising, and no learner tracking; any progress storage must remain local to the learner's browser.**

---

<!-- bootstrap:subagent-delegation v2 begin -->
## 8. Subagent Delegation Discipline

When addressing tasks in this repository, follow these delegation rules:

1. **Three-Way Routing Rule**: Default to **inline execution** in your primary thread. Escalate to an **ephemeral subagent** (e.g., `explorer`, `researcher`, `reviewer`, `implementer`) when a task requires exploring/reading files, contains multiple independent sub-tasks, requires fresh-context review, or would flood your context window. (As a default signal rather than hard law: consider delegating when reading ~≥10 files or handling ~≥3 sub-tasks). For large, high-blast-radius, or multi-session changes, request or create a **durable handoff packet**.
2. **Cold-Start Self-Contained Briefs**: Subagents start with a cold context and no conversation history. Every delegation prompt must be a self-contained brief carrying the exact paths, inputs, relevant decisions, and expected output format the subagent needs.
3. **Delegate Reads; Keep Writes Single-Threaded**: Use read-only subagents (`explorer`, `researcher`, `reviewer`) freely for exploration, web research, and clean-context code audits. Bounded implementation subagents (`implementer`) are permitted but must execute one writer at a time, use an isolated workspace or worktree when the active tool supports it, receive a full self-contained brief, and never fan out into additional agents or silently weaken test harnesses.
4. **Strict Verification**: Never accept "tests pass" as proof of correctness. All subagent output must be verified by the orchestrator against the user's actual objective.
5. **Minimal Hand-Written Context**: The `AGENTS.md` guide and subagent definitions must be hand-written and minimal. Avoid auto-generating them, as bloated context files degrade agent performance.
<!-- bootstrap:subagent-delegation v2 end -->

<!-- bootstrap:advisor-consultation v1 begin -->
## Advisor Consultation

Implementer threads may consult a higher-tier, read-only advisor before reporting a packet
done — but only when the change has a real behavioral surface (code, scripts, or schemas; not a
docs-only or prose-only edit) and the thread can confidently identify itself as capable. Availability is a property of
the individual thread and its provider, not of this repository — see
`advisor-capable-providers.json` for the current provider-capability list; do not hardcode
provider names here, and if you cannot confidently match yourself to an entry, treat yourself
as not capable. Every thread states explicitly, in its progress report, one of: a consultation
ran, a consultation was not warranted for this change, or a degraded mode is in use
(owner-mediated, or orchestrator-gate-only) — silence is never acceptable. See the implementer
and orchestrator starting prompts for the full behavioral contract and the required
disposition-record fields.
<!-- bootstrap:advisor-consultation v1 end -->

<!-- bootstrap:commit-discipline v2 begin -->
## Commit Discipline

Implementers commit their own scoped work in the repository they are working in: commit the
files you created or modified, stage by explicit path (not `git add -A` unless `git status`
shows nothing unrecognized), never push, and commit the progress report as your final act. A
packet that has you write into a different repository states its own commit rule there — never
infer one from this rule.

- **If a git command fails with `index.lock: File exists`, another agent is mid-commit. Wait and
  retry.** Never delete the lock file: a lock that looks stale may be a live commit, and removing
  it can corrupt someone else's work. Disjoint write-scopes prevent content conflicts, not index
  contention — serializing here is expected, not an error.
Running two agents on this tree at once is safe only with disjoint write-scopes (mode B);
overlapping scopes must be serialized — one agent at a time, or turn-taking with a commit at
each handoff. See the implementer and orchestrator starting prompts for the full contract,
including the three concurrency modes and bounded orchestrator authority over unexpected
working-tree state.
<!-- bootstrap:commit-discipline v2 end -->

### Codex on Managed Windows: Git Metadata Elevation

Source-file writes may succeed while a Codex task sandbox denies Git metadata writes. For staging
or committing, expect to request narrowly scoped elevation for the exact `git add` and/or
`git commit` command when ordinary Git reports `.git/index.lock: Permission denied`. First inspect
read-only: confirm whether the lock exists, check the effective identity and `.git` ACL if needed,
and try the harmless `git add --refresh -- .` probe. Do not delete an absent lock or alter ACLs to
work around the task boundary. If the probe confirms the denial, use an approved elevated command
that stages only the packet's explicit paths; elevation never authorizes a push.

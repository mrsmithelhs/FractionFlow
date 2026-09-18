---
id: plan-01
title: Node Toolchain and Static Deployment Spike
status: draft
depends_on: []
gate: "Owner approves the packet; owner explicitly authorizes the public publish/push step; orchestrator verifies the published smoke check. Deployment evidence does not prove pedagogy."
superseded_by: null
resolution: null
summary: >-
  Stand up the minimal Node-based dev toolchain (package manifest, lockfile,
  build step, headless test runner), decide and prove the static GitHub Pages
  deployment mechanism with a harmless published smoke check, and ratify the
  repository source/build-output layout. This spike proves deployment plumbing
  only; it does not prove any learner-facing behavior.
---

# Plan 01: Node Toolchain and Static Deployment Spike

## Packet Metadata

- Packet id: `plan-01`
- Packet title: Node Toolchain and Static Deployment Spike
- Status: (see frontmatter)
- Owner/model: implementer (single)
- Date: 2026-09-18
- Packet type: tooling / prototype (spike)
- Mutation level: scripts / external (one public publish step)
- Approval gate: owner approves packet and explicitly authorizes the public publish/push step; orchestrator verifies the live smoke check; decision recorded by orchestrator in `docs/decision-log.md`
- Depends on: none
- Expected artifacts: `package.json`, lockfile, minimal build configuration, build-output directory, deployment configuration for the chosen mechanism, harmless smoke page, progress report

## Goal

Establish the project's minimal development toolchain and prove the static deployment mechanism end-to-end, so every later packet has a reproducible build, a headless test runner, and a known path from source to public GitHub Pages URL. Ratify the repository layout proposed in `docs/project-seed.md` against the constraints the chosen build and deployment mechanism actually impose.

## Non-goals

- No learner-facing application, UI, or interaction code of any kind.
- No mathematical core code (that is `plan-02`).
- No problem generation or content code (that is `plan-03`).
- No selection of the UI framework, animation approach, or visual technology (`docs/founding/04-system-architecture.md` §§61–62 defer these; a framework comparison belongs to the first-slice preparation packet, not this spike).
- No service worker, PWA, or offline mechanism selection (deferred item D-21; record observations only if they arise naturally during the spike).
- No analytics, telemetry, accounts, backend, or any remote learner-data service — this is absolute (`docs/founding/00-principles.md` §20, `docs/founding/04-system-architecture.md` §2).
- No concrete security tooling apparatus (scanner, CSP, SRI suite): `docs/founding/04-system-architecture.md` §60 states the dependency/origin posture, and this packet applies it; selecting supply-chain tooling is deferred (deferred item D-26) and must not be invented here.
- No license selection or license file (owner decision, deferred item D-23).

## Depends on

None. This is the foundation packet: every later packet assumes a runnable build and test command.

## Why this packet exists

The project seed names three spikes and explicitly leaves the toolchain uninstalled: "No build tooling, package manifest, or dependencies are installed during initialization" (`docs/project-seed.md`). The roadmap maps the static deployment spike into Phase 1 (`docs/founding/06-roadmap.md` §11) and requires the deployment mechanism — branch, `docs/` folder, or GitHub Actions — to be "decided and proven by this spike" (`docs/project-seed.md`, GitHub Pages deploy spike). Without this, `plan-02` cannot run headless tests and `plan-03` cannot validate content in bulk; without the published smoke check, Phase 2's later public-URL proof has no plumbing to ride on. Proving deployment now, with a harmless page, is cheaper than discovering mechanism problems after a real episode exists.

## Authority and contracts

Required reading:

- `AGENTS.md`
- `docs/decision-log.md`
- `docs/development/README.md`
- `docs/project-seed.md` (tooling intent; proposed folder structure; deploy spike)
- `docs/founding/04-system-architecture.md` §2 (static-only), §59 (build-time generation), §60 (dependencies should earn their complexity; no runtime CDN/tracking origins)
- `docs/founding/06-roadmap.md` §11 (Phase 1 deployment spike)

Contracts this packet must preserve:

- Static-only founding product: no server, backend, account, authentication, analytics, or remote learner-data service at any point in this spike.
- The public-repository PII boundary is absolute: the smoke page and all committed files contain no personal information, credentials, deployment secrets, or analytics keys. Deployment secrets, if the chosen mechanism requires any, are never committed.
- A deployed URL proves delivery, not pedagogy, accessibility, or product readiness (`docs/founding/06-roadmap.md`; synthesis conflict C-10).
- The repository, not any host console, remains the durable source of product truth (`docs/founding/04-system-architecture.md` §58).

## Scope

### In scope

- Create a minimal `package.json` with: a build script producing static output into a chosen, documented output directory; a headless test-runner command usable by `plan-02`; and nothing else that is not needed.
- Create and commit a lockfile; keep dependency count minimal and justified against `docs/founding/04-system-architecture.md` §60 (bundle impact, longevity, static-host compatibility, whether it can observe learner activity).
- Choose and configure one deployment mechanism (branch vs. `docs/` folder vs. GitHub Actions), documenting the decision criteria and the build-output path.
- Produce one harmless static smoke page (fixed text only; no forms, no scripts that transmit data, no tracking) and publish it through the chosen mechanism.
- Ratify or adjust the repository source/build-output layout proposed in `docs/project-seed.md` and record the ratified layout in the progress report (the orchestrator converts it into a decision-log entry).
- Add ignore rules so build output is never committed.

### Out of scope

Everything in Non-goals, plus: editing the founding documents, editing `AGENTS.md`, modifying `scripts/dev/plan-status.js`, and any change to packet files or statuses.

## Implementation Requirements

### Requirement 1 — Reproducible minimal toolchain

Required behavior:

- From a clean clone, `npm ci` (or the chosen package manager's equivalent) followed by the build command produces the static output directory with no manual steps and no network access beyond package installation.
- The test-runner command executes with zero tests registered and exits 0, proving `plan-02` can start writing tests immediately.

Constraints:

- The toolchain must run headlessly on a typical Windows/Node development machine and in a plain CI-less environment.
- Do not adopt a UI framework, animation library, or visual technology.

### Requirement 2 — Deployment mechanism decided and proven

Required behavior:

- Exactly one mechanism is selected, configured, and documented in the progress report with rationale (cost, secret handling, reproducibility, rollback).
- The smoke page is reachable at the public GitHub Pages URL and loads its static assets without any backend call.

Constraints:

- Publishing requires explicit owner authorization in advance; the implementer stops and reports if authorization is not given and does not publish.
- If the chosen mechanism requires repository secrets, the implementer documents what is needed and stops for owner setup rather than embedding anything in the repository.

### Requirement 3 — Layout ratification and hygiene

Required behavior:

- The progress report states the ratified source/build-output layout, any deviation from `docs/project-seed.md`'s proposal, and why.
- Build output is excluded from version control; committed files contain no secrets or personal information.

Constraints:

- Do not move or rename directories owned by other agents' conventions (e.g. `docs/`, `reports/`, `scripts/dev/`) without stating the change explicitly in the report.

## Validation Checklist

- [ ] Required output files or artifacts exist (`package.json`, lockfile, build config, smoke page source, deployment configuration).
- [ ] Clean-clone reproduction: fresh `npm ci` + build produces identical output directory contents.
- [ ] Test-runner command runs headlessly and exits 0.
- [ ] Public smoke URL loads over HTTPS with no console errors and no network calls to any backend or tracking origin.
- [ ] Ratified repository layout recorded in the progress report.
- [ ] `git status` shows no build output, secrets, or unrelated changes staged or committed.
- [ ] Progress report exists at `reports/development/plan-01-tooling-deployment-spike/progress.md`.
- [ ] No unrelated files were changed.
- [ ] Approval gate is honored: no publish step ran without explicit owner authorization; work stops at the gate and reports if authorization is absent.

## Stop Conditions

Stop and report to the orchestrator if:

- A dependency is missing or behaves unexpectedly.
- Proving deployment would require committing a secret, adding a backend, or enabling analytics/telemetry.
- The owner does not authorize the publish step (report the prepared-but-unpublished state instead).
- Making the change would require modifying a settled project decision (including the founding documents' static-only boundary).
- Validation fails in a way that changes this packet's scope.

## Privacy, Accessibility, and Learner-Data Boundaries

- The smoke page collects nothing and transmits nothing; it must not set cookies or call third-party origins. This is the project's first public artifact and must model the privacy posture from the first commit.
- No accessibility obligations attach to the disposable smoke page beyond valid HTML; do not claim any accessibility validation from it.

## Commit and Concurrency Guidance

- Commit discipline: stage explicit paths; never `git add -A`; never push without explicit owner authorization; the deployment publish step is the only authorized push and only after owner approval.
- Concurrency: mode A (one implementer at a time). No other packet is runnable while this one is in progress, so overlap is not expected; still, keep writes scoped to the files above.
- If `index.lock: File exists`, wait and retry; never delete the lock file.

## Advisor Consultation

Advisor consultation is a thread-level obligation inherited from `AGENTS.md`, not a packet-scoped requirement. The implementing thread must state one of — consultation ran; not warranted (with a one-line reason); or degraded mode (naming the mode used) — in its progress report, even though this packet is expected to be mechanical. Do not pre-classify the packet to pre-empt that declaration.

## Progress Report

`reports/development/plan-01-tooling-deployment-spike/progress.md`

Minimum contents: overall summary; chosen deployment mechanism with rationale; ratified repository layout and any deviations from the seed proposal; exact publish authorization received (who/when) or why the publish step did not run; public smoke URL; commands run and their results; validation checks performed with evidence (URLs, command output); problems encountered; remaining risks; ready for orchestrator review yes/no.

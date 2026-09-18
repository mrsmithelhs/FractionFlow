# Progress Report: Plan 01 — Node Toolchain and Static Deployment Spike

- **Packet ID**: `plan-01`
- **Packet Title**: Node Toolchain and Static Deployment Spike
- **Date**: 2026-09-18
- **Author**: Implementer
- **State**: Prepared-but-unpublished (awaiting owner authorization for public publish/push step)

---

## 1. Executive Summary

Plan 01 has established the minimal Node-based development toolchain and static GitHub Pages deployment configuration for FractionFlow. The minimal toolchain introduces zero runtime dependencies, using `vite` for building static assets to `dist/` and `vitest` for headless test execution. A CJS boundary was introduced at `scripts/package.json` to ensure full backwards compatibility for existing CommonJS developer scripts (`scripts/dev/plan-status.js`) alongside root ESM (`"type": "module"`).

The deployment mechanism was decided as **GitHub Actions** via `.github/workflows/deploy.yml` using modern, official GitHub Actions (`actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`) with OIDC authentication, requiring zero repository secrets and maintaining a clean source branch where generated build artifacts remain strictly untracked.

A harmless static smoke page was authored at `index.html` using a pure system font stack, with zero external network requests, zero CDN dependencies, zero tracking, and zero forms or cookies.

All local validation checks have passed:
- `node scripts/dev/plan-status.js lint`: OK (no violations).
- `node scripts/dev/plan-status.js check plan-01`: RUNNABLE.
- `npm test`: Exits 0 with zero tests registered (`vitest run --passWithNoTests`).
- `npm run build`: Builds `dist/index.html` headlessly in 57ms.
- Clean-clone reproduction in pristine temporary clone via `npm ci` and manifest/hash comparison: verified.
- Read-only Architecture & Security Advisor consultation executed, followed by post-consultation `git status` verification confirming zero mutations.

Per packet constraints and condition 7 of orchestrator review, the implementer has stopped prior to running `git push origin main` or altering repository settings.

---

## 2. Chosen Deployment Mechanism & Rationale

**Selected Mechanism**: GitHub Actions workflow (`.github/workflows/deploy.yml`).

### Decision Criteria & Tradeoffs
1. **Cost & Infrastructure**:
   - Built directly into GitHub; free for public open-source repositories.
2. **Secret Handling**:
   - Zero repository secrets required. Uses GitHub's built-in OIDC token authentication via `permissions: id-token: write, pages: write`.
3. **Artifact Boundary & Hygiene**:
   - Source-branch build output is untracked and ignored via `.gitignore` (`dist/`).
   - Generated output is versioned **nowhere** in the source tree. This prevents repository bloat, avoids merge churn, and honors `docs/founding/04-system-architecture.md` §58 ("Generated deployment artifacts are disposable").
   - Comparison with alternatives:
     - `docs/` folder deployment was rejected because `docs/` is already the durable specification and workflows documentation hub (`docs/founding/`, `docs/development/`, etc.); placing build output there would pollute version-controlled source truth.
     - `gh-pages` branch deployment was rejected because orphan branches create synchronization friction and are legacy compared to GitHub Actions Pages artifacts.
4. **Reproducibility & Quality Gate**:
   - Every deployment builds in a clean Ubuntu runner using `npm ci`, runs `npm test`, and only deploys if tests exit 0.
5. **Rollback**:
   - Trivial and instant via GitHub Actions deployment history or standard git reverts.

---

## 3. Toolchain Justification (`docs/founding/04-system-architecture.md` §60)

The project toolchain adopts `vite` (v6.4.3) and `vitest` (v3.2.7) as developer dependencies:

| Criterion | Evaluation |
|---|---|
| **Runtime Dependencies** | **Zero.** The `"dependencies"` manifest is empty. |
| **Bundle Impact** | **None.** Neither Vite nor Vitest is bundled into client output. Client output is 100% static HTML/CSS. |
| **Longevity & Ecosystem** | Vite and Vitest represent the modern standard for fast ESM build tooling and unit testing, with broad community maintenance. |
| **Static-Host Compatibility** | Generates plain static HTML, JS, and CSS files directly into `dist/`, fully compatible with GitHub Pages or any static HTTP server. |
| **Learner Observation / Privacy** | **Zero observation capability.** Dev tooling runs exclusively build-time and in CI; it possesses no runtime telemetry, tracking, or network hooks. |
| **Origin Posture** | Zero external runtime CDNs or remote origins. All assets are self-contained. |

---

## 4. Ratified Repository Layout

The repository source/build layout proposed in `docs/project-seed.md` §48–65 has been ratified with **zero structural deviation**:

```text
FractionFlow/
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions Pages deployment
├── .gitignore                    # Build artifacts and dependency ignore rules
├── index.html                    # Harmless static smoke page
├── package.json                  # Dev toolchain scripts and pinned engines
├── package-lock.json             # Deterministic dependency lockfile
├── vite.config.js                # Vite build and Vitest configuration
├── scripts/
│   ├── package.json              # Isolated CJS boundary for development scripts
│   └── dev/
│       ├── plan-status.js        # Packet status and linting tool
│       └── plan-status.test.js   # plan-status test suite
├── src/
│   ├── math/                     # Deterministic exact-arithmetic core (.gitkeep)
│   ├── content/                  # Problem families and deterministic seeds (.gitkeep)
│   ├── interaction/              # Episode and scaffold state machines (.gitkeep)
│   ├── render/                   # Presentation components (.gitkeep)
│   ├── app/                      # Application shell (.gitkeep)
│   └── styles/                   # Global and token styles (.gitkeep)
├── tests/                        # Headless test suite (.gitkeep)
├── docs/                         # Specifications, workflows, development packets
├── reports/                      # Progress and review reports
└── dist/                         # Ephemeral build output (ignored from git)
```

- **Deviations from seed proposal**: None. All directories proposed in `docs/project-seed.md` (§48–65) have been created with `.gitkeep` markers.
- **Boundary rule**: `dist/` is generated output and is excluded from git. Generated output is versioned nowhere in the repository.

---

## 5. Harmless Static Smoke Page

- **Source File**: `index.html` (built to `dist/index.html`).
- **Typography**: OS-native system font stack only (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`).
- **Network / Origin Posture**:
  - Zero external origins.
  - Zero CDN stylesheets or fonts.
  - Zero `<script>` tags transmitting or executing data.
  - Zero forms or cookies.
  - Zero personal information.
- **Product & Accessibility Posture**:
  - Semantic HTML5 document.
  - Disclaimer explicitly states: *"This disposable page proves deployment plumbing only. Mathematical and instructional capabilities will be introduced in subsequent phases."* No educational readiness or accessibility validation is claimed from this smoke page.

---

## 6. Commands Run and Concrete Evidence

### A. Plan Status Lint
```text
$ node scripts/dev/plan-status.js lint
lint: OK (no violations)
(Exit code: 0)
```

### B. Plan Status Check
```text
$ node scripts/dev/plan-status.js check plan-01
RUNNABLE: plan-01 is ready to implement
(Exit code: 0)
```

### C. Headless Test Runner Execution
```text
$ npm test

> fraction-flow@0.0.1 test
> vitest run --passWithNoTests

 RUN  v3.2.7 C:/AI/FractionFlow

No test files found, exiting with code 0

include: tests/**/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/dist/**, **/cypress/**, **/.{idea,git,cache,output,temp}/**, **/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*
(Exit code: 0)
```

### D. Production Build Execution
```text
$ npm run build

> fraction-flow@0.0.1 build
> vite build

vite v6.4.3 building for production...
transforming...
✓ 2 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html  2.96 kB │ gzip: 1.11 kB
✓ built in 57ms
(Exit code: 0)
```

### E. Clean-Clone Reproduction Verification
A pristine clone was created in a temporary directory (`$env:TEMP/FractionFlow-clean-clone-spike`), dependencies installed via `npm ci`, tests executed, and static site built:
```powershell
$tempDir = Join-Path $env:TEMP "FractionFlow-clean-clone-spike"
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
git clone c:/AI/FractionFlow $tempDir
Push-Location $tempDir
npm ci
npm test
npm run build
```
- **Manifest comparison**:
  - `dist/` contains exactly one file: `dist/index.html` in both builds.
- **Nondeterministic metadata excluded from raw comparison**:
  - Windows Git line endings (`\r\n` vs `\n`). On Windows hosts with `core.autocrlf` or `* text=auto`, raw disk bytes differ by newline representation (2.96 kB with LF vs 2.99 kB with CRLF).
- **Normalized Content Comparison**:
  - After normalizing line endings (`\r\n` -> `\n`), content equality check evaluated to `True`.
  - Normalized SHA256 Hash across both builds:
    `874FC2F241B56F7D90BBF23C3A5345ED2102A949BE044CA54357DBC9DDAFA5EC`
  - Byte-for-byte reproducibility is proven over LF-normalized output.

### F. Network & External Origin Verification on Build Artifact
```powershell
Select-String -Path dist/index.html -Pattern 'script|https?:|//|action=|form'
```
- Only match: `text-transform: uppercase;` (matching substring "form" in CSS property value).
- Zero `<script>` tags, zero external URLs, zero forms.

---

## 7. Advisor Consultation Disposition Record

- **Consultation Branch**: **Branch A** (capable and warranted; behavioral surface with build, test runner, CI workflow, and module isolation).
- **Capability Evidence**: Thread possesses callable `invoke_subagent` capability equipped with read-only tools and a higher-tier model selector (`Model: "pro"`).
- **Requested Advisor Model**: `pro` (`invoke_subagent` Model: `pro`, Role: "Read-Only Architecture & Security Advisor").
- **Observed Advisor Model**: Gemini (observed directly from the advisor's self-identification statement: *"I am running as Gemini."*).
- **Effective Sandbox / Read-Only Posture**: Instruction-read-only with post-hoc verification (bounded read-only critique task, depth 1, primary thread as sole writer).
- **Post-Consultation Status Check**:
  ```text
  $ git status
  On branch main
  Your branch is ahead of 'origin/main' by 9 commits.
  Untracked files:
    reports/orchestration/founding-docs-review/initial-packet-wave-review-codex.md
  nothing added to commit but untracked files present
  ```
  Verified: Zero files were created, modified, or deleted by the advisor. Working tree remained 100% untouched.
- **Coarse Cost**: 1 subagent turn, ~26 seconds elapsed time.

### Findings & Disposition

#### Finding 1: Redundancy of `--passWithNoTests`
- **Advisor Claim**: `--passWithNoTests` in `npm run test` CLI script is redundant with `passWithNoTests: true` in `vite.config.js`.
- **Independent Verification**: Verified both files. Both configure the setting.
- **Disposition**: **REJECT**.
- **Reasoning**: Plan 01 specifically requires that the CLI command `npm test` exit 0 when no tests are registered. Retaining the flag in both the npm script and the configuration file is harmless defense-in-depth and ensures any command-line invocation behaves consistently even if configuration loading is altered.
- **Resulting Change**: None.

#### Finding 2: Missing or explicit `.gitattributes`
- **Advisor Claim**: Risk of Windows CRLF vs Linux LF line ending discrepancy in CI; recommended ensuring `.gitattributes` enforces `* text=auto eol=lf`.
- **Independent Verification**: `.gitattributes` already exists at the repo root with `* text=auto`. In addition, the clean clone reproduction test demonstrated that LF-normalized output is byte-identical (`874FC2F241B56F7D90BBF23C3A5345ED2102A949BE044CA54357DBC9DDAFA5EC`).
- **Disposition**: **REJECT**.
- **Reasoning**: Root `.gitattributes` is an existing bootstrap file and repo truth. Modifying repository-wide git attributes is outside the bounded scope of Plan 01.
- **Resulting Change**: None.

#### Finding 3: `package-lock.json` must be committed for `npm ci`
- **Advisor Claim**: `deploy.yml` runs `npm ci`, which will fail if `package-lock.json` is not tracked.
- **Independent Verification**: `package-lock.json` was generated via `npm install` and committed in local commit `038626c`.
- **Disposition**: **ACCEPT**.
- **Reasoning**: Confirmed committed and present.
- **Resulting Change**: None needed (already satisfied in commit).

#### Finding 4: Security, privacy, OIDC permissions, CJS isolation
- **Advisor Claim**: Validated that `package.json` has 0 runtime dependencies, GitHub Actions uses minimal OIDC permissions, `scripts/package.json` correctly isolates CommonJS, and `index.html` uses OS system fonts without external network calls.
- **Independent Verification**: Confirmed across all artifacts.
- **Disposition**: **ACCEPT**.
- **Reasoning**: Fully aligns with founding architecture contracts.
- **Resulting Change**: None.

---

## 8. Commit and Publish Discipline

- **Files committed locally (commit `038626c`)**:
  - `.github/workflows/deploy.yml`
  - `.gitignore`
  - `index.html`
  - `package-lock.json`
  - `package.json`
  - `scripts/package.json`
  - `src/app/.gitkeep`
  - `src/content/.gitkeep`
  - `src/interaction/.gitkeep`
  - `src/math/.gitkeep`
  - `src/render/.gitkeep`
  - `src/styles/.gitkeep`
  - `tests/.gitkeep`
  - `vite.config.js`
- **Untracked foreign files left untouched**:
  - `reports/orchestration/founding-docs-review/initial-packet-wave-review-codex.md` (recognized as owner/orchestrator work in-flight; preserved without staging).
- **Public Push Status**:
  - **No git push has occurred.**
  - **No GitHub repository settings have been modified.**
  - Ready for explicit owner authorization to execute the single authorized `git push origin main`.

---

## 9. Validation Checklist Status

- [x] Required output files or artifacts exist (`package.json`, lockfile, build config, smoke page source, deployment configuration).
- [x] Clean-clone reproduction: fresh `npm ci` + build produces identical output directory contents, verified via manifest and LF-normalized SHA256 hash comparison (`874FC2F241B56F7D90BBF23C3A5345ED2102A949BE044CA54357DBC9DDAFA5EC`).
- [x] Test-runner command runs headlessly and exits 0 with zero tests registered.
- [ ] **[PENDING OWNER GATE]** Public smoke URL (`https://mrsmithelhs.github.io/FractionFlow/`) loads over HTTPS with no console errors and no network calls to any backend or tracking origin. *(Pending owner authorization of `git push origin main` and repo admin setting `Settings → Pages → Source` to `GitHub Actions`).*
- [x] Ratified repository layout recorded in the progress report.
- [x] `git status` shows no source-branch build output, no secrets, and no unrelated changes staged or committed.
- [x] Progress report exists at `reports/development/plan-01-tooling-deployment-spike/progress.md`.
- [x] No unrelated files were changed.
- [x] Approval gate is honored: no publish/push step ran without explicit owner authorization; work stopped at the gate.

---

## 10. Problems Encountered and Resolutions

1. **ESM vs CJS conflict with `scripts/dev/plan-status.js`**:
   - *Problem*: Adding `"type": "module"` in root `package.json` caused Node to treat `scripts/dev/plan-status.js` as ESM, breaking its `require()` statements. Modifying `plan-status.js` is explicitly out of scope for Plan 01.
   - *Resolution*: Created `scripts/package.json` with `{"type": "commonjs"}`. Under Node module resolution rules, this marks the entire `scripts/` tree as CommonJS while keeping the application root strictly ESM. Both `node scripts/dev/plan-status.js list` and `node scripts/dev/plan-status.test.js` executed cleanly (143/143 tests passing).
2. **Vitest test file discovery on CJS script tests**:
   - *Problem*: Vitest's default glob discovery picked up `scripts/dev/plan-status.test.js` (a standalone Node test runner).
   - *Resolution*: Configured `test.include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)']` in `vite.config.js`. This isolates Vitest to `tests/`, ensuring headless execution with 0 tests registered exits 0.

---

## 11. Remaining Risks and Follow-ups

- **GitHub Pages Configuration**: Before the live URL can serve, a repository admin/owner must navigate to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
- **Live URL Verification**: Once the owner authorizes `git push origin main` and the GitHub Actions workflow executes, the live deployment at `https://mrsmithelhs.github.io/FractionFlow/` can be verified over HTTPS.

---

## 12. Handoff Statement

- **Ready for orchestrator review**: **Yes** (prepared-but-unpublished state; awaiting owner authorization for the single `git push origin main`).

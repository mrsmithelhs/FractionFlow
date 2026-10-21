# Plan 41 — Progress report

Date: 2026-10-20 (system clock). Investigator: Claude Code thread, runtime-reported model Sonnet 5.5
(self-report, not independently verified). Packet status and acceptance records were not touched.

## Overall summary

Requirement 0 was confirmed by the owner via the orchestrator (seam: operate-beat fraction response region;
git-history cost evidence allowed; Haiku-tier explorers allowed; no test/route reruns). The investigation traced
three maintenance cases plus a data-only control, compared five options on the same seam, and recommends **one
first slice**: a single owner (module + region handle) for the operate response, in vanilla JS, preceded by a
small guard-repair packet and placed before Plan 39. Admission and representation-integration refactors are
ranked later. A falsifiable follow-up edit (F1) and a cold-start before/after evaluation are specified, and a
separately gated template/Vue comparison is offered. Paper evidence could not separate vanilla from Vue on
readability; this is stated, not resolved. No source, dependency, test, harness, packet status or acceptance
record was changed. **Nothing here authorizes source work.**

## Files changed

Only under `reports/development/plan-41-phase-boundary-maintainability-investigation/`:
`scope-proposal.md` (commit `2b7a60f`), `investigation.md` and `recommended-source-slice.md` (commit `cbe2d7f`),
`progress.md` (this file, final commit).

## Artifacts produced

| Artifact | Purpose |
|---|---|
| `scope-proposal.md` | Requirement 0 baseline, hypotheses with falsifiers, seam, plan |
| `investigation.md` | Claim recheck, hypothesis outcomes, traces A/B/C + control, responsibility map, candidate ranking, evidence-workflow findings, option comparison, evidence→finding→recommendation table, owner choices, limitations |
| `recommended-source-slice.md` | Slice, interface sketch, callers, contracts, exclusions, checks, rollback, ordering vs Plan 39, follow-up edit F1 and evaluation, optional controlled comparison, approval stop |

## Commands run and results

| Command | Result |
|---|---|
| `node scripts/dev/plan-status.js check plan-41` | `RUNNABLE` (exit 0) |
| `git rev-parse HEAD`, `git status --short`, `git log`, `git show --stat/--numstat`, `git show dab636c` | Read-only; clean tree at start; used for cost evidence |
| `diff` of the two token blocks; `diff` of the two 68-line operate blocks (id prefix normalized) | Token blocks identical; operate blocks differ only in help id/string |
| `sed`/`grep`/Read of cited source lines | Used to verify the **V** claims in `investigation.md` |
| `node -e` JSON probe of one route row (failed on a schema guess), then direct reading of the row | Row's assertion confirmed weak |
| `node scripts/dev/plan-status.js lint`, `git diff --check` | See validation below |
| **Not run** | `npm test`, `npm run build`, `npm run test:routes`, any browser (agreed; no reruns) |

## Delegation and capability record

- **Provider/thread:** `claude-code` entry in `advisor-capable-providers.json` (call-site `model` alias on the
  Agent tool). The Codex Luna/Sol limits in `AGENTS.md` do not bind this thread; their intent (read-only
  children, no fan-out, no unrequested higher tiers) was followed.
- **Advisor consultation: Branch B — not warranted.** The packet writes report documents only; there is no code,
  script or schema behavioral surface.
- **Children:** five, all depth 1, none spawned further children. Requested `model: "haiku"` at call site in
  every case. Each child self-reported "Haiku 5.5 (claude-haiku-5-5)" as the first line; that is a
  **self-report, not independent verification**.

| Child | Role/tools | Task | Observed (from completion notices) |
|---|---|---|---|
| Renderer tracer | `explorer` (Read/Grep/Glob) | operate-region map in both renderers | 27 tool uses, ~127 s, ~126k subagent tokens |
| App tracer | `explorer` | `app.js` draft/help/focus/admission trace | 17, ~190 s, ~92k |
| Plan 39/data-only tracer | `explorer` | control case + Plan 39 predictions | 74, ~193 s, ~163k |
| Spec/witness tracer | `explorer` | founding constraints, test witnesses, Gemini summary | 126, ~407 s, ~262k |
| Vue researcher | `researcher` (Web/Read/Grep/Glob) | official Vue/Vite/testing facts | 21, ~103 s, ~32k |

- **Read-only posture:** explorer and researcher definitions have no Edit/Write/Bash tools (tool lists from the
  Agent tool description), so write access was structurally absent; the researcher had web tools only. A
  post-hoc `git status --short` showed no changes other than my own report files (checked before each commit).
- **Per-finding disposition.** Accepted and independently re-verified by me: token duplication (23 keys);
  operate-block mirroring; `app.js:293-303`, `:549-556`, `:728-737`, `:965-980`, `:1064-1076`, `:1284-1296`;
  `episode.js:1262-1281`; `scene.js:522-531`; the `plan40-route-subtraction.mjs:92` nine-item pin; the Plan 38
  route row's weak assertion; `notHasSelector` semantics; render-purity fixed list; §61 framework deferral.
  **Accepted as leads only (T), not re-read:** the ≈30-row definition-branch table, the admission per-family
  field comparisons, the control-case file list, the witness-coverage tables, Gemini summary, founding-doc line
  numbers. **Not used because unverified:** Plan 20's operate path ("most likely already-shared-unit"); whether
  Plan 40 ever has a take-away encounter; renderer-detaches-help-button question; the "view toggle sets
  `isReplaying=false` without `render()`" observation beyond a mention. **Rejected claims:** none was
  contradicted by evidence; the Plan 39 tracer's "grep found no remount-token fields" refers to `app.js` only
  (the token lives in the renderers, which I verified) and I did not carry it forward. Researcher gaps (focus
  across re-patch, `nextTick`, CSP, npm "latest") are reported as gaps.
- **Observed cost:** the figures above are as reported; they are not comparable across tasks and are not an
  estimate for any future work. Elapsed time for the whole investigation is not reported.

## Validation checks performed

| Packet checklist item | Status |
|---|---|
| Requirement 0 scope confirmation and baseline recorded | Done (`scope-proposal.md`; owner/orchestrator confirmation received in chat) |
| Three traces plus data-only control, source-backed | Done; each claim tagged V/T/P/O in `investigation.md`; Trace C is predictions only |
| Alternatives address the same seam; predictions labeled | Done (§7 table, P/O tags) |
| One first slice and follow-up edit criteria | Done (`recommended-source-slice.md` §1, §7) |
| Required artifacts exist; reference paths resolve | Done: three docs exist; cited existing paths checked present; `src/render/operate-response.js` correctly absent (proposed, not created) |
| `plan-status.js lint` and `git diff --check` | Run before the final commit; result recorded in the final response |
| No unrelated/source/dependency/evidence files changed | `git status` showed only the four report files; no `src/`, tests, harness, manifests, decision log or packet files touched |
| Approval gate honored | Yes; recommendations only, stop stated in slice §10 |

## Problems encountered and how resolved

- A `node -e` probe of the route JSON assumed the wrong schema and threw; I read the row directly instead.
- Several old-review claims no longer hold (`path-closure` ≥2, duplicate revision map); they were reclassified
  as resolved rather than carried forward.
- CRLF warnings from Git on commit are line-ending notices only.

## Remaining risks, limitations and follow-ups

- No browser, device, assistive-technology or zoom evidence; nothing was executed. All behavior statements come
  from source, git history or existing evidence records.
- The strongest evidence is *duplicate-edit cost* and *hazard*, not an observed current defect on the operate
  seam. The case rests partly on an imminent consumer (Plan 39), which is a prediction.
- Haiku tracer outputs are model output; the T-tagged claims need re-reading before any packet relies on them.
- Vue/Vite facts are from official pages summarized by a child; none were exercised.
- **Unresolved owner choices** (full list in `investigation.md` §10): sequencing (guards → slice → Plan 39, or
  Plan 39 first on ad hoc preview state); whether and when to fund a controlled O2/O3 comparison; how much
  weight owner code-reading carries and whether the owner reads Vue; F1 as aria-association or copy-only;
  whether Plan 40's absence from the take-away focus sites is intended.
- **Source-approval stop:** adoption, a P0 guard-repair packet, a source packet, Plan 39 sequencing and any
  dependency or framework experiment remain with the owner/orchestrator.

Ready for orchestrator review: **yes** (report-only; no readiness, completion or ship claim is made).

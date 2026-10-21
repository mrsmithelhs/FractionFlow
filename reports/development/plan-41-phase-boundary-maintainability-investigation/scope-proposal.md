# Plan 41 — Requirement 0 scope proposal

Date: 2026-10-20 (system clock). Packet: `plan-41`. This is the research-scope gate,
not approval to refactor and not an investigation result. Nothing below is a finding.
Observations marked **[seen]** were read directly in current source at the stated
location; everything else is a hypothesis or a plan.

## 1. Baseline

| Item | Record |
|---|---|
| Preflight | `node scripts/dev/plan-status.js check plan-41` → `RUNNABLE: plan-41 is ready to implement` (exit 0) |
| HEAD | `a6801d16a20670b5fd90d1a33b217d10a6a77133` (`Set plan 41 in-progress`), branch `main` |
| Working tree | Clean at start (`git status --short` empty, no stashes). No other writer observed. I created only the empty report directory and this file. |
| Plan 40 acceptance | `reports/development/plan-40-unlike-denominator-subtraction-batch/owner-acceptance.md`: owner accepted screens, Plan 40 complete, bounded Phase 3 checkpoint adopted; technical delivery accepted at `2e48512` (487 tests, both builds, eight Chrome routes). **Phase 3 disposition is present; no escalation needed.** |
| Gates | DECISION-047: no refactor, framework, dependency or push authorized. Plan 39 stays draft behind this investigation. |

References actually read: `AGENTS.md`, implementer prompt, Plan 41, Plan 39, DECISION-047,
`packet-creation-guidance.md`, `session-handoff.md`, the maintainability disposition and
scoping notes, the full Claude architecture review, Plan 37 `implementation-and-validation.md`,
Plan 40 `owner-acceptance.md`, `advisor-capable-providers.json`.
**Not yet read in full:** founding docs 02/04/05 (about 5,700 lines), the Gemini review,
Plan 37 `design-contract.md`/`annotated-flow.md`, Plan 40 final review and progress, and
`docs/development/README.md`. I will read the sections on response lifecycle, presentation
boundaries and quality witnesses after confirmation, and say so in the report.

## 2. Historical claims re-checked against the post-Plan-40 baseline

The Claude review (baseline `703a64f`) is a hypothesis source. A first, cheap check of its
central claims against HEAD:

| Historical claim | Current state | Reading |
|---|---|---|
| Active-beat remount token duplicated in both renderers (19 fields) | **[seen]** Now 23 keys, byte-identical in `src/render/beat-container.js:329-353` and `src/render/linear-path.js:458-482` (diff of the two blocks is empty). Plans 38/40 added `takeawayRemoval` and `takeawayHelpOpen` to both. | Claim holds and the duplicated block grew. Whether it *causes* edit cost is untested. |
| Drafts scraped from DOM by id strings; app owns help/draft/focus state | **[seen]** `src/app/app.js:293-303` holds three help-open flags, three draft families (decide, transform, operation) and three focus-preservation flags. Capture/restore/lookup at `:925-1010`. | Holds, and a third family now exists. |
| Per-definition branching in app | **[seen]** `getVisibleOperationInput` (`app.js:965-980`) tests six definition families and picks among three selector strategies; the same list is repeated in `captureOperationDraft`/`restoreOperationDraft` (`:987`, `:996`). Admission (`canonicalInstance`, `:54-181`; `createInitialState`, `:234-270`) has one hand-written branch per Plan 18/34/35/36/40. | A new definition must be added in several places; a missed one falls through silently to the default selector. **Hypothesis**, to be traced. |
| File sizes | `app.js` 1395 (973 at the 2026-10-10 scoping note), `beat-container.js` 1307, `linear-path.js` 1193. | Growth is context only; not a cost measure. |
| `path-closure.js` accepts ≥2 choices vs ≥3 elsewhere | Not rechecked yet. | In scope for admission trace. |

## 3. Hypotheses and what would falsify each

| # | Hypothesis | Falsified if |
|---|---|---|
| H1 | Response lifecycle (draft, help, focus, remount decision) is split across app + two renderers by an implicit protocol, so response edits need mirrored multi-file changes. | A traced response/help revision (including the Plan 40 Repair 01 copy refinement history) needs edits in only one place, or past focus/draft defects trace to evidence workflow, not this protocol. |
| H2 | Practice admission/task-context construction is a per-plan branch chain that adds a new edit site for each family. | A new task family or the data-only control can be added with data edits only, or the app branches are already generated from one registry. |
| H3 | A bridge representation cannot be added without another large branch in app/renderers unless a response interface exists. | Predicted Plan 39 edit list, traced to symbols, stays confined to content/interaction/render modules with no new app lifecycle code. |
| H4 | Readable templates/components (incl. Vue) would improve owner readability and reduce edits more than vanilla ownership extraction on the same seam. | Paper comparison on the same seam shows equal or worse locality, or the cost is dominated by imperative-parent interop and test-environment change. **Likely indistinguishable on paper**, which would point to a gated pilot. |
| H5 | No refactor is justified: docs, a revision map and stronger guards suffice. | Traces show duplicated edits or protocol defects that those do not remove. |
| H6 | Some historical "maintenance cost" was evidence-workflow failure (stale builds, weak assertions), not source organization. | — (will be classified per incident, not assumed). |

## 4. Proposed representative seam and traces

**Seam for the same-seam comparison (proposal, to confirm):** the *operate-beat fraction
response region* — numerator/denominator or sum inputs, local task help, submit and focus
targets, in both the visual and linear renderers, as consumed by `app.js`. Rationale from
what I saw: it is where Plans 34/35/36/40 each added branches (`app.js:965-1010`,
`beat-container.js:718-756`, `linear-path.js:845-883`) and it is the closest analogue of the
Plan 39 *locate* response (preview draft, confirm, help, focus). The previous review's
transform-response region is smaller and older; I propose tracing it as a secondary case
rather than the comparison seam. If you prefer the transform region, say so.

1. **Trace A — fraction-response copy/control revision.** Anchored on real history: the
   Plan 40 long-label/Difference-milestone refinement and the `01eddf6` repair, plus a
   current-source walk-through of one hypothetical label/control edit. Distinguish files
   *edited* from files *read for context*.
2. **Trace B — help/draft/focus across view switch and reset.** Source-traced through
   `app.js` capture/restore/focus paths and both renderers' token and remount; checked
   against existing unit/route witnesses (read, not rerun unless a claim needs it).
3. **Trace C — Plan 39 locate integration.** Predicted edits only, labeled as predictions,
   for adding a candidate-preview response region.
4. **Control — compact problem-record-only addition.** One more curated subtraction item
   through the Plan 40 data/validator path: what is data-only, what forces tests/routes/copy.
   Exact validators only; no arithmetic re-proof.

Admission (candidate 2) and representation integration (candidate 3) are traced as far as
needed to rank them; they are not given full comparisons unless evidence demands.

## 5. Options to compare on the same seam

- **O0** Current design plus docs/evidence-only (revision map, non-vacuous guards, active-element assertions).
- **O1** Focused vanilla ownership extraction: one shared remount-key module and one response-region module with explicit draft/focus targets, used by both renderers.
- **O2** Vanilla declarative template for the region (cloned `<template>` + the same explicit lifecycle interface).
- **O3** Vue single-file component for the region, on paper only. Any framework/version/tooling claim will be checked against current official docs; I will not install or build it.
- **O4** If paper evidence cannot separate O1–O3: recommend a separately gated, controlled pilot on one seam and one follow-up edit, with no invented token or speed numbers.
- Also keeping open: a **smaller slice than O1** (key module only) and **no refactor**.

Compared on: reading locality, duplicated behavior, explicit lifecycle interfaces, visual
vs linear differences (not forcibly unified), test/browser cost, replay and leakage risk,
owner markup readability, reversible migration steps. Protected contracts as listed in the
packet. Predicted benefits are labeled predictions.

## 6. Output plan

Under `reports/development/plan-41-phase-boundary-maintainability-investigation/` only:
`scope-proposal.md` (this), `investigation.md` (traces, hypothesis outcomes, responsibility
map, comparison, evidence→finding→recommendation table), `recommended-source-slice.md`
(one first slice or no-change, interface sketches, callers, rollback, checks, what precedes
Plan 39, falsifiable follow-up edit with before/after criteria), `progress.md` (last commit).
Optional diagnostics: report-local read-only `rg`/script inventories only; no test, build or
route reruns are planned. If I run any existing test it will be to substantiate a named claim.

## 7. Delegation, capabilities and cost

- **Thread:** Claude Code, runtime-reported model Sonnet 5.5 (self-report, unverified). Provider
  entry `claude-code` in `advisor-capable-providers.json` (call-site model alias on the Agent tool).
- **Subagents:** none spawned yet. After confirmation I plan up to 3–4 read-only Haiku-tier
  `explorer` tracers (one per trace/control, `Read`/`Grep`/`Glob` only, so structurally no writes),
  each with a self-contained brief; one `researcher` only if a framework claim needs official
  sources. I will request `model: "haiku"` at call-site and record the model each reports; those
  are self-reports, not verification. If the override is not honored I will say so and not substitute
  silently. Children do not spawn children. I retain synthesis and re-read in source every claim
  I rely on. The Codex Luna/Sol limits in `AGENTS.md` do not apply to this Claude thread; I am
  following their intent (read-only advisors, no fan-out, no unrequested higher tiers).
- **Advisor consultation:** Branch B — not warranted. This packet writes report documents only,
  with no code, script or schema behavioral surface.
- **Expected cost (effort, not tokens):** reading about 12–15 source/test files and relevant
  founding-doc sections, `git log`/`--stat` on prior analogous edits, ~4 bounded tracer tasks,
  roughly four report documents. No token or time estimate is offered; none is measurable here.

## 8. Questions for the orchestrator

1. Confirm the **operate-beat fraction response region** as the comparison seam (vs the transform region).
2. Confirm that history-based cost evidence (git stats of Plans 38/40 edits) is acceptable
   alongside traces, given Plan 41 says line counts and counts are supporting signals only.
3. Confirm the Haiku-tier explorer plan, and that no existing test/route reruns are wanted.
4. Any objection to the partial reference read noted in §1 being completed during the investigation.

**Stopped here.** No deeper investigation, subagent, test run or product/packet change has occurred.

# Plan 21 Progress Report — Practice Variety and Next-Problem Design

- **Date:** 2026-10-09 (environment date)
- **Packet:** `plan-21`
- **Baseline:** `28c317d1f189748336f10f6520c810f2bd6e3732` (`Set Plan 21 to in-progress`)
- **Dossier commit:** `f8cbfa7` (`docs: design Plan 21 practice variety and next problem`)
- **Mutation scope:** Five-file design dossier under `docs/development/phase-3-practice-variety-design/` and this report. No source, test, decision-log, open-question, route-matrix, or packet-status files were changed.
- **Packet status authority:** unchanged; only the orchestrator/owner may set packet status.

## Overall summary

Prepared an owner-review dossier that operationalizes DECISION-035/040 without treating an unaccepted goal label, set, order, reset policy, or exhaustion rule as adopted. The dossier compares broad and targeted learner-goal models; distinguishes math/content validity, representation eligibility, authored instruction, replay identity, and mounted learner reach; reports a bounded deterministic candidate analysis; and proposes a completion-gated Next contract with identity, reset, focus, configuration, and refusal semantics.

The current learner experience has one entry control and one admitted item: `2/3 + 1/4 = 11/12`, with authored 12ths/24ths routes under `phase-2-unlike-proper-addition-reflection@3`. Plan 17–20 families remain draft. The Phase 1 fixtures and generator candidates do not promote those families to learner reach.

## Artifacts produced

- `docs/development/phase-3-practice-variety-design/README.md`
- `docs/development/phase-3-practice-variety-design/practice-type-model.md`
- `docs/development/phase-3-practice-variety-design/content-inventory.md`
- `docs/development/phase-3-practice-variety-design/selection-options.md`
- `docs/development/phase-3-practice-variety-design/next-problem-contract-proposal.md`
- This progress report.

The conditional candidate for a second same-definition item is `1/2 + 1/3 = 5/6` (canonical 6ths, alternate 12ths). A read-only content-construction/eligibility check passed; its fixture identity, premise/reflection data, episode routes, reset/replay witnesses, and browser evidence are absent. It is an owner-review candidate, not admitted content. The proposed initial list order is the existing `2/3 + 1/4` first, candidate `1/2 + 1/3` second, conditional on owner approval and all missing admission work. The dossier explicitly states the current inventory cannot yet offer a different Next item.

## Commands and evidence checks

| Command or inspection | Result |
|---|---|
| `node scripts/dev/plan-status.js check plan-21` | `RUNNABLE: plan-21 is ready to implement` (exit 0). |
| `git rev-parse HEAD` | `28c317d1f189748336f10f6520c810f2bd6e3732`; the working tree was clean before dossier creation. |
| Read-only curated fixture validation using `validateCuratedFixtures(PHASE1_GOLDEN_CASES)` | The seven addition fixture entries were content-valid; the six non-relatively-prime entries lacked the current learner route and/or definition-specific authored premise/reflection. The `simplify-first` item was excluded as an unapproved task. |
| Read-only candidate construction for `1/2 + 1/3` using `buildCuratedProblem`, `validateProblemInstance`, and `evaluateInstanceEligibility` | Content valid; canonical denominator 6, scale factors 3/2; alternate 12, factors 6/4; both paths representation eligible. Premise and reflection lookups were absent for both denominators. |
| Bounded synthetic probe through `generateProblem`, `inspectCandidateSpace`, `validateProblemInstance`, and `evaluateInstanceEligibility` | 4 addition selectors × 4 allowed overlay combinations × 40 fixed seeds = 640 draws under `curated-review/1`. All 640 generated and validated as content; no generator refusals. Numeric duplicate counts ranged 2–13 per 40 draws. Some otherwise valid candidates had paths refused for denominator >30 and/or scale factor >12. Per-family candidate-space sizes, sample uniqueness, denominator/result categories, and capability counts are recorded in `content-inventory.md`. No learner or student data was used. |
| `node scripts/dev/plan-status.js lint` | `lint: OK (no violations)`. |
| `git diff --check` | No output. At that point the dossier files were untracked, so this command did not inspect them; a separate PowerShell scan found no trailing whitespace in the dossier. |
| `git diff --cached --check` before dossier commit | No whitespace errors in the five staged dossier files. |
| Scoped Git metadata write | Ordinary `git add` and `git add --refresh -- .` were denied with `.git/index.lock: Permission denied`; verified the lock did not exist and recorded the effective identity and `.git` ACL. The narrowly elevated explicit-path `git add` and `git commit` succeeded. No lock was removed and no push was made. |
| Plan 25 report and route-matrix artifact inspection | Current record reports 51 route rows / 53 browser executions after Plan 25 focus repair. This is cited as existing evidence, not a new browser run. |
| Owner/orchestrator review-disposition inspection | Read `reports/orchestration/next-wave-after-plan-24-review-disposition.md` as requested; carried forward candidate-pool bounds, item/definition identity, configuration applicability, no-wrap exhaustion recommendation as proposal, and no broad task-engine expansion. |

No application test suite or browser route was run for this docs-only packet. No new tests or tooling were added.

## Advisor consultation and disposition

**Branch A consultation ran** as a user-authorized, bounded critique of the complete inline dossier. Requested model: `gpt-6-sol`, medium effort. The reviewer self-reported **“GPT-6”**; the exact `gpt-6-sol` alias was not independently observable, so the record does not claim exact model identity was confirmed. Effective posture: **instruction-read-only with post-hoc verification**; the consultation used a reviewer role and an inline-only artifact, but structural filesystem read-only could not be established from platform metadata. The primary remained the sole writer. Immediately after the review, `git status --short` showed only the primary's untracked dossier directory and no advisor-authored files.

| Advisor finding | Independent verification | Disposition and change |
|---|---|---|
| High: heading “Accepted addition fixtures” mislabeled non-admitted fixtures. | Compared the heading and seven rows with `PRACTICE_TYPES`, curated tables, authored-data lookup, and Plan 17–20 status. | **Accept.** Renamed the section to “Phase 1 addition fixtures” and state explicitly that fixture registration is not app admission; only one fixture is admitted. |
| High: Next behavior was ambiguous when an item's conditions/settings did not apply or were unsupported. | Checked DECISION-039's intentionally omitted reflection task, per-condition route applicability obligations, and current one-fixture registry. | **Accept.** Distinguish supported, intentionally equivalent, not applicable, unsupported, and missing/corrupt data; define finite compatibility search, no settings mutation, visible no-matching-item state, and fail-closed handling for corrupt data. |
| Medium: the dossier had no concrete candidate set/order. | Current inventory has one admitted fixture; ran a read-only curated builder and eligibility check for the proposed `1/2 + 1/3` item. | **Accept.** Added an explicitly conditional two-item order: existing canonical item first, proposed `1/2 + 1/3` second. Documented exact missing authoring/reach work and that this does not satisfy broader Roadmap §30 variety. |
| Medium: focus destinations were missing for some transitions. | Reviewed the Retry/Next/re-entry table and proposed future browser witness list. | **Accept.** Added destinations for Retry, Next, exhaustion and pre-mount refusal, including preservation of the last completed item on refusal. |
| Low: summary conflated generation refusals with capability refusal. | Rechecked all 640 samples: generation failures 0; path eligibility refused valid candidates above current denominator/scale limits. | **Accept.** Summary now states no generator refusals and separately reports representation paths rejected by capacity. |

No advisor findings were rejected. Consultation cost: one bounded reviewer turn, roughly a few minutes. The advisor made no edits and spawned no further agents.

## Problems, risks, and owner follow-up

- **No runnable Next target exists today.** The one current item cannot produce a different problem. The second numeric candidate is not instructionally authored or browser-witnessed; Next must remain unavailable until a second item completes admission.
- **Goal mapping remains an owner choice.** Current one-control wording remains unchanged. One broad addition goal and up to three targeted addition goals are compared, including overlap between denominator-based sets and above-one practice. No future control count is adopted.
- **Candidate breadth is limited.** The 640 draws cover the four addition selectors/overlays under one bounded profile only. They do not establish all-space distributions, content suitability, browser reach, or learner efficacy. Nine swap-equivalent two-choice cases from the orchestrator's independent probe remain candidates, not ready problems.
- **Selection implementation is separately gated.** Current practice registry ties one fixture to one definition. Plans 18/19 need the accepted selection mechanism to join their families to an existing learner goal. Generated learner selection, adaptive behavior, persistence, and curriculum machinery remain out of scope.
- **Owner decisions still needed:** goal labels/mapping; accepted item set and order; set overlap; completion and any skip behavior; condition/support carry-over; stable first item on re-entry; compatibility and exhaustion copy/action; and versioned item/task-data identity for replay.
- **Other revisit triggers:** use `docs/development/phase-3-follow-up-obligations.md` for general nested common-unit choice, broader denominator/capability coverage, generated learner practice, and Phase 3 exit review. No deployment or owner rendered-screen acceptance is implied.

## Ready for orchestrator review

**Yes.** The dossier and bounded analysis are prepared for technical review and owner disposition. The goal/set/reset decisions and any follow-on implementation remain gated. Plan 21 status remains orchestrator-owned and unchanged by this implementer.

# Plan 30 Progress Report — Compact Content Authoring Investigation

- **Date:** 2026-10-10 (environment date)
- **Packet:** `plan-30`
- **Preflight:** `RUNNABLE: plan-30 is ready to implement`
- **Packet status:** unchanged (`in-progress`); status authority remains with owner/orchestrator.
- **Write scope:** `reports/development/plan-30-compact-content-authoring-investigation/` only.

## Overall summary

Completed the bounded investigation and reproducible offline experiment. The final sweep uses the complete `curated-review/1` relatively-prime addition candidate space under the existing representation limits. All 220 ordered candidates passed the existing exact/content validator, but only 18 ordered candidates (9 swap-equivalent cases) retain both required representation-eligible paths. Those 18 received experimental recipe-generated premise and matching data that passed the existing component checks on all 36 routes. The experiment does not register, app-admit, execute, or approve any of those candidates.

The observed scale opportunity is data repetition: this experiment serialized 18 full-path explicit records in 26,434 bytes versus 5,634 bytes for compact item inputs plus one recipe description. The 78.7% byte reduction is not evidence of equivalent authoring time, pedagogical quality, or readiness. Selecting the intentionally incorrect premise route is itself an instructional policy; the experiment chose it by a stable hash solely to make a reviewable proposal. A human must approve or replace that choice and review the distractors before a follow-on implementation.

Plan 26's one-time set/Next/reset/focus/replay lifecycle is independent of each additional item's data. Existing math, representation, authored-data, path-closure, and app admission checks form distinct layers. A latent two-versus-three-choice contract mismatch and acceptance of repeated distractor forms under distinct IDs are documented. Current registered content passed the constituent pre-install checks used by app admission, but no proposed item was run through a mounted app or browser.

## Artifacts produced

- `investigation.md` — source-backed inventory, finite-space outcomes, explicit-versus-recipe comparison, human review boundary, validator gaps, smallest proposed adoption increment, and executed/proposed coverage split.
- `experiment.mjs` — self-contained deterministic evidence runner using existing exported production mechanisms. Default `--verify` recomputes results and checks byte equality without rewriting the committed evidence. `--write-results` explicitly regenerates `results.json`.
- `results.json` — exact candidate/path output, registered baseline checks, three paired explicit/compact examples, byte comparison, and corruption controls.
- This progress report.

Non-progress artifacts were committed in `136c988` (`docs: investigate Plan 30 compact authoring`).

## Reproducible evidence and commands

From the repository root, the safe reproduction command is:

```powershell
node reports/development/plan-30-compact-content-authoring-investigation/experiment.mjs --verify
```

It exited 0 and reported `results.json verified unchanged`. The complete final counts are in `results.json`; the principal outcomes are:

| Evidence | Observed |
|---|---:|
| Candidates enumerated / existing exact-content validation passed | 220 / 220 |
| Unique ordered problems / swap-equivalent classes | 220 / 110 |
| Candidate paths considered / representation eligible / refused | 440 / 98 / 342 |
| Candidates with 0 / 1 / 2 eligible paths | 140 / 62 / 18 |
| Two-path experimental candidates / candidates refused by that task requirement | 18 ordered (9 swap classes) / 202 |
| Recipe-generated premise and choice route checks | 36 / 36 each |
| Registered items reconstructed / constituent condition-path closures available | 2 / 16 of 16 |
| Explicit JSON bytes / compact inputs plus one recipe | 26,434 / 5,634 (78.7% fewer serialized bytes) |

The 202 refusals are due to insufficient eligible paths for the current task contract, not exact-math or generator failure. The 342 refused path rows reflect the current denominator/scale limits. Corruption controls rejected incorrect premise truth, duplicate choice IDs, multiple equivalent answer choices, omitted eligible-path lists, and missing premise data. A repeated non-equivalent distractor form under distinct IDs was accepted by the existing validator and is recorded as a quality gap.

Other commands and outcomes:

| Command/check | Outcome |
|---|---|
| `node scripts/dev/plan-status.js check plan-30` | `RUNNABLE` before work and after review. |
| `node scripts/dev/plan-status.js lint` | `lint: OK (no violations)` before work and after review. |
| `git diff --cached --check` for the three evidence artifacts | Passed; no whitespace errors. |
| Explicit-path staging/commit | Committed only the three evidence artifacts in `136c988`. |
| Owned-file trailing-whitespace scan | No trailing whitespace. |

The default profile was initially set to `phase1-dev-default`; comparison with Plan 21's named finite-space bounds showed the requested baseline is `curated-review/1`. The final experiment and this report use only the latter profile. The initial exploratory numbers were discarded and are not included as results.

## Advisor consultation and disposition

**Branch A consultation ran** as one bounded higher-tier reviewer consultation, followed by a clarification on the corrected implementation excerpts. Requested model: `gpt-6-astra`. Observed model: the reviewer identified itself as **GPT-6**; it could not verify the exact runtime alias. Effective posture: **instruction-read-only with post-hoc verification**. This host reports workspace-write capability, so structural filesystem read-only was not established. The inline review material contained core implementation/report excerpts, not the full JSON result; the reviewer explicitly did not independently verify full enumeration, regeneration, complete files, or filesystem state. The primary independently verified those claims below. The primary remained the sole writer.

| Advisor finding | Primary verification and disposition | Result |
|---|---|---|
| Incorrect premise route was selected by candidate ordinal and should not be described as an independent human authoring choice. | **Accept.** Checked the full implementation. The report now says the route is a generated proposal selected by item-identity hash; educator selection/approval remains required. The implementation also changed choice position to a stable hash of identity and denominator. | Report corrected; the final experimental policy is order-independent but pedagogically unreviewed. |
| Stable IDs alone do not freeze materialized instructional content across reordered inputs or changed policy. | **Accept.** Changed target ordering to numeric order and made route/choice placement depend on stable item identity rather than enumeration ordinals. The report states that changed policy or persisted instructional inputs require a new authoring revision. | Enumeration-order dependence removed; revision immutability remains a future adoption requirement. |
| The both-outcomes assertion checked synthetic labels rather than materialized premise results. | **Reject for the actual artifact.** The initial inline excerpt accidentally substituted a shortened assertion. In the full script, `validateAuthoredPremiseCase()` returns the exact checked response stored as `premiseOutcome`, and the assertion requires those stored results to contain both values. | No code change needed. I corrected the follow-up review excerpt and verified the full script locally. |
| Full artifact/output could not be independently verified from the supplied inline review excerpts. | **Accept as a consultation limitation.** Re-ran the full script in `--verify` mode, which checked byte-for-byte output equality, then reran preflight/lint and checked working-tree scope. | Independent verification claims are limited to the primary's commands; the report does not attribute them to the advisor. |

The advisor made no filesystem changes. Immediately after consultation, `git status --short` showed only this owned report directory as untracked, and the experiment verification, packet preflight, and lint passed. Consultation cost: two reviewer turns, approximately a few minutes.

## Commit discipline and environment

The initial harmless `git add --refresh -- .` probe failed with `.git/index.lock: Permission denied`. Read-only inspection confirmed the lock was absent and the effective identity was `bonfire\orion`. I used the repo-approved elevated commands with explicit paths to stage the three evidence artifacts and commit them. No lock was deleted, no ACL was changed, and no unowned path was staged. This `progress.md` is being committed separately as the final work commit.

## Limits, follow-up, and review readiness

- Existing admitted items passed the constituent content/authored/path-closure checks, but these probes do not execute the mounted app or browser.
- The 18 experiment candidates have not passed full authored-set identity discovery, whole-episode closure, completion, reset/replay journeys, browser geometry/access/motion/help/focus review, or pedagogical review. They are not an approved bank.
- Future all-item/path headless completion and discriminating browser samples are specified in `investigation.md`; those checks were not run for candidates in this packet.
- No production source, tests, schema, registry, task data, package tooling, or packet status changed. No dependencies were installed. No push or deployment occurred.
- The smallest proposed next adoption is a separate owner-approved packet for one additional same-definition item with an immutable item/revision identity, a small deterministic materializer, full headless path/condition/support coverage, and a few discriminating browser witnesses. Owner/orchestrator acceptance and instructional review remain gates.

**Ready for orchestrator review:** yes. Plan 30 remains `in-progress`; no completion status or production adoption is asserted.

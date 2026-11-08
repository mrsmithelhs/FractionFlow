---
id: plan-90
title: Goal-Linked Managed Practice
status: complete
resolution: "Owner accepted all four rendered managed practice patterns, the comparison choice order, and the repaired subtraction success message. Held banks and review variants remain separately gated."
depends_on: [plan-70, plan-88]
gate: "Orchestration clears Requirement 0 before source work, then reviews family admission and fit across batches and all-pattern integration. Owner reviews the full rendered experience."
summary: >-
  Make Start a practice session launch one of four coherent practice patterns
  across five public problem families, with deterministic selection, measured
  presentation eligibility, and no learner profiling.
---
# Plan 90 — Goal-Linked Managed Practice

## Packet Metadata

- Packet id: plan-90
- Packet title: Goal-Linked Managed Practice
- Status: (see frontmatter)
- Owner/model: Terra-high lead implementer, Luna-medium workers, orchestration gates, owner rendered review
- Date: 2026-11-08
- Packet type: staged scheduler and managed-practice integration
- Mutation level: managed catalog, selection, admission, fit, lifecycle and verification
- Approval gate: Requirement 0, family admission and fit, integrated technical review, owner rendered acceptance

## Goal and authority

Replace the three-slot comparison/distance schedule behind **Start a practice session** with all four owner-adopted patterns, through real Start, Next, Retry, help, finish and exit controls. Plan 70 established direct launch and fixed session compatibility. Plan 88 defines the broader task goals, exact public candidates and substitutions, and the approved limits. A first batch proves the mechanism. Delivery requires all four patterns integrated end to end.

Read [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md), the [packet board](README.md), [Plan 88 owner adoption](../../reports/development/plan-88-practice-difficulty-ladder-design/owner-acceptance.md), its [adopted design](../../reports/development/plan-88-practice-difficulty-ladder-design/ladder-design.md) and [successor brief](../../reports/development/plan-88-practice-difficulty-ladder-design/implementation-brief.md). Use [Plan 87's closeout](../../reports/development/plan-87-capability-aware-practice-selection/owner-acceptance.md) for evidence limits and the [Plan 89 exposure ledger](../../reports/development/plan-89-versioned-problem-bank-publication/integrated-review.md#exposure-ledger) for membership boundaries.

| Pattern | Adopted progression |
|---|---|
| M0 | Compare with shared units, compare equal numerators, compare around one-half, then find a fraction distance. |
| M1 | Compare, place the named fraction on the number line, compare around one-half, then find a distance. Placement is required for this pattern. The explanatory bar appears only after a correct Check. |
| U0 | Identify and rename, inspect an offered form, then construct equivalent forms in unlike-denominator addition. Solve each episode. |
| U1 | Identify and rename, inspect an offered form, then construct equivalent forms in unlike-denominator subtraction. Solve each episode. |

Use the exact public candidates and designated substitutions in the adopted design. Held Plan 89 revisions, Plan 86 review variants, data-only holdouts and the 11 other standalone families are outside this admission. Preserve the standalone chooser and fixed sessions. No new learner menu, learner profile, performance-based ordering or support change, telemetry, classroom study, push or deployment.

## Requirement 0 — Propose and stop

Run preflight, pin a clean baseline, and save `mechanism.md` in `reports/development/plan-90-goal-linked-managed-practice/`. Show the versioned catalog and policy, exact association and family completion seams, seed vectors for all four patterns, fit measurement and classification, empty and changed-fit behavior, transaction and focus rules, historical replay and fixed-session protection, and shared-file ownership. Propose the first mounted comparison/distance batch and how the lead will bring all other families through their gates. Stop before source work for orchestration approval.

## Implementation contract

1. **Catalog and admission.** Use immutable, versioned patterns and exact record identities with family-specific validation, construction and completion. Keep mathematical truth in math/content, task decisions in instructional state, and presentation downstream. Keep authored demand, support and fit separate. Extend managed admission explicitly. Preserve fixed manifests, standalone launches, protected definitions and historical episode replay. Review `comparison-record-controller.js` and existing local-history boundaries so new managed launches neither broaden recording nor consume it for selection.
2. **Selection and direct launch.** Use an ephemeral unsigned 32-bit seed and the adopted cyclic template search. Preflight all selected entries before installing the first. Require each pattern's endpoints and M1's placement. Try designated same-slot alternatives first. U0/U1 may omit inspection while retaining identify/rename and construct/operate. Preserve slot order and exact episode identity uniqueness. When no complete pattern is viable, directly launch one verified eligible episode or show an accessible unavailable notice if the pool is empty. Do not use the legacy fixed fallback to bypass admission or fit. Capture catalog and policy revisions, seed, eligibility/preflight outcomes and concrete identities for reproducible tests and diagnostics without persistence.
3. **Fit and lifecycle.** Measure the working area, text conditions and both participation views for every admitted record and substitute. Unknown fit is ineligible. Address or exclude affected conditions for Plan 40's enlarged-text overflow and check the [shared equation follow-up](phase-3-follow-up-obligations.md#shared-arithmetic-equations-at-enlarged-text). Preserve the active episode, draft, focus recovery and Retry identity through resize and view changes. Recheck only the unstarted suffix before Next. Use designated substitutes or shorten the visit, including early finish if M1 loses an unstarted required placement. Keep task-local help, stable episode support, deliberate Next, natural finish and unfinished-exit confirmation. Preparation failure or a stale transition must leave the current episode intact.

## Staged delivery and gates

The Terra-high lead owns scheduler/admission, app, session controller, history and replay integration and the consolidated review. The lead may dispatch Luna-medium workers for disjoint family descriptors, measured fit, isolated implementation or verification. Workers do not delegate. Use cold briefs, one writer per path, and serialize shared edits, builds, browser runs and Git windows. Follow the current advisor capability and disposition rules. A Terra-medium read-only pass requires orchestration approval under the repository rule. No Sol or Astra consultation.

1. **Family admission, ordering and fit.** After mechanism approval, prove the shared path with comparison and distance. Present subsequent placement, addition and subtraction batches to orchestration before integration, with exact public membership, responses, support, measured fit, legacy compatibility and exclusions for every candidate and substitute. Independent work may proceed in parallel within the approved mechanism. Orchestration can clear each batch and bounded repairs. Material changes to goals, families, ordering or dose, or any inability to deliver an adopted pattern, go to the owner.
2. **Integration.** Bring all four complete visits to orchestration with real mounted routes from direct Start. Test normal and verified narrower or enlarged-text pools, missing required slots, alternate pattern selection, shorter arithmetic visits, one and zero eligible items, and mid-episode and pre-Next fit changes. Exercise both views where supported, keyboard/focus, representative error and help recovery, retries, cross-family transitions, return and reentry, rollback, stale transitions, legacy fixed and standalone routes, frozen replay, and remembering off. Record seeds, exact identities, support, browser and dimensions and distinguish measured from synthetic eligibility and text scaling from actual zoom.
3. **Owner rendered review.** Supply a repeatable local preview and representative screenshots of all four patterns, with the exact way to inspect each one and the evidence limits. Technical clearance does not close the packet. The owner reviews the full experience, with held-content exposure and deployment separately gated.

## Validation and handoff

- [ ] All four patterns run end to end, with complete candidate coverage, verified eligibility and the documented fallbacks.
- [ ] Deterministic selection, exact public admission, held-content refusal, legacy compatibility and replay, and transaction safety have focused checks.
- [ ] Run the relevant browser routes, full tests and build, packet lint and scoped diff checks. Report known failures and verification limits.
- [ ] Commit only packet work, with `progress.md` last in the report folder. Record gate decisions, advisor disposition, evidence and remaining owner review. Implementers leave packet status to orchestration.

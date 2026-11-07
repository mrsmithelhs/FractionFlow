# Plan 75 Requirement 0 — scope proposal

2026-11-07. Proposed investigation for FF Orch 12+; not approved or adopted. Preflight `node scripts/dev/plan-status.js check 75` returned RUNNABLE. Baseline: `42da0062310949ba79d6932e713f353d02ede759` on `main`. Three unrelated untracked Plan 39 route-run JSON files pre-existed and are outside this scope. This checkpoint makes no source changes.

## Learner decision and comparison

Investigate how a learner determines the whole units and same-sized fractional pieces remaining after taking one positive mixed number from another, when no whole needs to be renamed. Compare the same operands, information, support and final two-field response in two candidates:

1. **Direct response:** learner supplies the remaining whole count and piece count and checks once.
2. **Takeaway then response:** learner makes one brief, explicit action identifying/removing the subtrahend's whole units and fractional pieces from the starting quantity, then supplies the same two counts. Investigate whether a single grouped action can be meaningful without preselecting or revealing the result; if it merely triggers a precomputed animation, name that limitation rather than treating it as evidence of the learner's subtraction strategy. Provide an equivalent keyboard and non-drag action.

Compare mathematical decisions and observable evidence, answer leakage before acceptance, cognitive and interaction burden, clarity of recovery, accessibility and parity of visual and linear paths, fit with existing contracts, and implementation cost. Specify exactly what is learner-selected versus app-supplied. A correct response or action alone does not prove understanding. Recommend the extra action only if it has a distinct, decision-preserving purpose and plausible value that outweighs the extra step; identify what later comparative learner evidence would test that judgment. Otherwise recommend the direct response. Neither efficacy nor a learner preference is established by this design investigation.

For each candidate examine initially blank fields, a fixed source-denominator suffix, explicit zero versus blank, invalid and unequal responses, and equal but unorganized responses if the proposed bounds admit them. Consider concise recovery without supplying the answer, optional help that preserves the decision, and assistance history across retry and same-attempt reconstruction. Sketch initial, recovery and settled visual and linear states, with removed and remaining quantities legible only after acceptance and consistent whole/eighth scales. Plan later mounted checks at 360 × 740 under normal and 200% root text, keyboard and non-drag routes; distinguish those from browser zoom, physical-device, assistive-technology and learner evidence.

## Example bounds and exact checks to investigate

Use positive mixed operands with equal source denominators and proper positive fractional parts. Admit only cases where the minuend's fractional numerator is at least the subtrahend's: no decomposition. Propose three or four exact problems, including both a nonzero and zero fractional remainder. Starting witnesses are `3 5/8 − 1 2/8 = 2 3/8` and `3 3/8 − 1 3/8 = 2`; retain source eighths separately from any normalized math representation. Test `3 2/8 − 1 5/8` as excluded even though the minuend has more whole units. Select and justify the remaining examples during the approved investigation, derive and reproduce results using existing exact math APIs, and verify admission and exclusion independently. These are examples, not an adopted batch or runtime answers.

## Existing artifacts to inspect after approval

- `docs/founding/06-roadmap.md` §42, the decision log and packet board for current phase and owner decisions.
- `docs/development/plan-38-like-denominator-subtraction-batch.md` and `reports/development/plan-38-like-denominator-subtraction-batch/requirement-0-proposal.md` and `mechanism-review.md` for the grouped takeaway precedent and its limits.
- `reports/development/plan-56-task-specific-support-and-independence-design/support-contract.md` and owner acceptance for optional help, assistance, retry and reconstruction semantics.
- Plans 72 and 74 packets, their `mechanism.md`, owner acceptance and relevant source/tests for actual response, fixed suffix, notation, zero, equivalent-but-ungrouped feedback, withholding and visual/linear behavior. Recheck the current source and status at the pinned baseline; do not assume addition behavior transfers unchanged to subtraction.
- `src/math/` exact fraction/mixed-number APIs and their tests; relevant subtraction interaction/render artifacts for feasibility and ownership. Treat source inspection as source evidence, not a rendered or learner study.

## Gate and deliverables

On scope approval, investigate and deliver `task-design.md`, a reproducible exact check and `progress.md`, with bounded batch, candidate comparison, state sketches, future implementation boundary, falsifiers and evidence limits. Resolve links, run packet lint and scoped diff checks. Source, content banks, scheduler, practice records, unlike denominators and decomposition remain outside write scope. Stop if a load-bearing owner decision or scope expansion is needed. Separate owner task/batch adoption and any implementation remain future gates. Packet status and adoption belong to orchestration and the owner.

No advisor consultation ran at this proposal checkpoint; orchestrator-gate-only review applies. This is a prose-only scope proposal, not a claim that later implementation has been reviewed.

# Plan 71 — implementation progress

Date: 2026-11-06  
Status: report-only dossier delivered for orchestrator technical review; owner adoption and any implementation remain open. No packet status or acceptance was changed.

## Scope and outputs

Preflight `node scripts/dev/plan-status.js check plan-71` returned RUNNABLE. The committed source baseline was `6ce31af06f602e745ff7547fce772d88ccaf71de`. FF Orch 12+ approved the [scope proposal](scope-proposal.md); the owner directly authorized two-way communication and the dossier continuation. Proposal commit `d83b694`; initial checkpoint `c54c56b` and correction `0c96e4b`. The proposal and checkpoint hashes were sent to FF Orch 12+.

The [dossier](task-design.md) recommends a single whole-count and piece-count response, compares a staged alternative, gives two journeys and optional help, specifies visual and linear responsibilities, and proposes four same-denominator examples. It distinguishes Plan 58's one-quantity grouping task, scopes a future source slice, flags session and record decisions, and records layout and evidence limits. [Exact evidence](evidence/exact-examples.mjs) and [output](evidence/exact-examples.json) are committed with the dossier as `65404a5`. Eighths and the chosen response/representation remain owner decisions, not admitted content or proven teaching outcomes.

## Validation and limits

- `git diff --name-only 6ce31af HEAD -- src docs/founding` produced no paths at investigation, so inspected current source matched the pinned baseline in those areas.
- `node reports/development/plan-71-mixed-number-addition-without-regrouping-design/evidence/exact-examples.mjs` passed its assertions for all four authored forms, strict fractional sum < 1, expected raw result and exact equality; saved JSON was compared to fresh output and matched. This verifies arithmetic, not task admission, rendered behavior or learning.
- Local Markdown link check resolved 14 file links across the scope proposal, dossier and checkpoint. `node scripts/dev/plan-status.js lint` passed. `git diff --cached --check` passed for the dossier and evidence before commit.
- Read Plan 54 adopted design and Plan 58 owner acceptance, source response/scene, exact math, session admission, comparison record controller, Plan 56 support contract and historical Plan 58 layout evidence. One combined PowerShell search failed due to shell brace syntax; the relevant individual-path search was rerun successfully.
- No browser/build/full test suite, actual assistive-technology speech, physical devices, browser zoom, or learner study was performed for this report-only design. Historical simulated layout is identified as such and does not validate this new task. No external research expansion was needed for the bounded recommendation.
- Advisor consultation was not warranted for this prose-only design; no consultation ran. A subagent tool with model override is present, consistent with `advisor-capable-providers.json`. Orchestration technical review remains required.

The initial tree had three unrelated untracked Plan 39 route-run JSON files, left untouched. Git metadata initially denied ordinary staging at the scope checkpoint; an absent lock and failed refresh probe were checked before scoped elevation. No source, canonical documentation, packet status, owner acceptance, push or deployment was changed. Stage this progress report explicitly and commit it last, then release the Git window and notify FF Orch 12+.

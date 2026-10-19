# Plan 37 — Implementer Progress Report

**Packet ID:** `plan-37`  
**Packet Title:** First Number-Line Task and Bar-to-Line Bridge Design  
**Implementer Model:** Gemini 3.8 Flash (High)  
**Date:** 2026-10-18  
**Report Location:** `reports/development/plan-37-first-number-line-and-bar-bridge-design/progress.md`  

---

## 1. Overall Summary

Plan 37 establishes a complete, bounded design dossier for the first bar-to-number-line bridge task in FractionFlow. 

Following the preflight check, Requirement 0 codebase inventory, rival-design comparison, and orchestrator scope approval, we advanced **Candidate A (Same-Amount Placement on a 0-to-1 Bar-to-Line Bridge)**. The design anchors the learner's existing fraction-bar intuition to linear coordinate location without introducing heavy frameworks, premature arithmetic movement, or automatic scaffold fading.

The deliverable package specifies:
1. An annotated interaction flow with persistent vertical coexistence, strictly aligned $[0, 1]$ track endpoints, two-step selection (preview → confirm), directional recovery, and screen-reader accessibility that avoids both answer leaks and coarse 3-bucket collapse.
2. A comprehensive design contract covering exact BigInt core math mappings, support-dependent density (high-support full partitions vs. medium-support sparse benchmarks), a detailed 360px touch geometry calculation preserving $44 \times 44\text{px}$ targets, a curated 8-item seed table across diverse magnitudes, scene projection specifications, and an immutable replay envelope decoupled from concurrent Plan 38 work.
3. An implementation roadmap recommending a two-packet serial rollout (Packet 1: Core Engine & Scene; Packet 2: Renderers & App Mount), an exact file touch map, screen/label budgeting, intended-failure test seeds, and strict adherence to Roadmap Phase gates (§31 bar-stability exit and §90 number-line decision checkpoint).
4. A self-contained, responsive HTML/SVG static design probe (`static-board.html`) illustrating desktop and 360px mobile viewports, aligned geometry, $44\text{px}$ hitboxes, and error/recovery states.

---

## 2. Advisor Consultation Disposition

**Branch B — advisor consultation not warranted — docs-only change.**

*Rationale:* This packet produces and modifies only design documentation, specification dossier files, and a standalone non-shipped HTML/SVG design probe in `reports/development/plan-37-first-number-line-and-bar-bridge-design/`. It modifies zero production source files, build scripts, or JSON schemas with behavioral runtime surfaces; therefore, a pre-delivery advisor consultation is not warranted under `AGENTS.md` Step 2.

---

## 3. Files Created and Modified

All writes were strictly confined to the packet's assigned report folder:

### Artifacts Produced:
1. `reports/development/plan-37-first-number-line-and-bar-bridge-design/requirement-0-investigation.md`
   - Codebase inventory, source revision pinning (`b1f1b772cd14e62aa694eee4f63feaae670820c6`), rival falsifier table, and orchestrator approval record.
   - Refined with exact repository math symbols (`equalFractions`, `areEquivalent`, `classifyMagnitude`, `benchmarkFraction`) and non-leaking screen-reader step descriptions.
2. `reports/development/plan-37-first-number-line-and-bar-bridge-design/annotated-flow.md`
   - Beat-by-beat interaction walkthrough (`encounter`, `locate`, `recovery`, `resolve`), layout ASCII diagrams, two-step selection grammar, and reduced-motion contract.
3. `reports/development/plan-37-first-number-line-and-bar-bridge-design/design-contract.md`
   - Mathematical authority, support-dependent density analysis, 360px touch geometry calculations across $b \in \{2..12\}$, 8-item curated seed table, Scene Model schema additions, and decoupled replay contract.
4. `reports/development/plan-37-first-number-line-and-bar-bridge-design/implementation-and-validation.md`
   - Future 2-packet recommendation, exact file touch map, vertical height budgeting ($344\text{px}$ total), label collision policy, intended-failure test seeds, and Roadmap §§31/90 phase-gate enforcement.
5. `reports/development/plan-37-first-number-line-and-bar-bridge-design/static-board.html`
   - Self-contained, responsive design probe demonstrating aligned $x_0, x_1$ tracks, $44\text{px}$ touch targets at 360px, two-step confirmation, dynamic alignment guide, and directional feedback.
6. `reports/development/plan-37-first-number-line-and-bar-bridge-design/progress.md`
   - This implementer progress report.

---

## 4. Commands Run and Validation Results

1. **Preflight Check:**
   ```powershell
   node scripts/dev/plan-status.js check 37
   # RUNNABLE: plan-37 is ready to implement (exit 0)
   ```
2. **Schema and Frontmatter Linting:**
   ```powershell
   node scripts/dev/plan-status.js lint
   # lint: OK (no violations) (exit 0)
   ```
3. **Repository Regression Test Suite:**
   ```powershell
   cmd /c npm test
   # Test Files: 45 passed (45)
   # Tests: 409 passed (409) (exit 0)
   ```

---

## 5. Working Tree Concurrency & Commit Discipline (Mode B)

- **Concurrency Note:** In accordance with Mode B disjoint write-scope rules, another implementer (Plan 38) was actively committing to `src/` and `tests/` in the repository tree.
- **Strict Isolation:** No changes were made to any files in `src/` or `tests/`.
- **Pre-existing Working Tree Changes:**
  - `docs/development/plan-37-first-number-line-and-bar-bridge-design.md` (modified by orchestrator to `status: in-progress`).
  - `docs/development/README.md` (re-rendered by orchestrator to reflect `in-progress`).
- **Plan 37 Staging Scope:**
  Only explicit Plan 37 paths will be staged and committed:
  - `docs/development/plan-37-first-number-line-and-bar-bridge-design.md`
  - `docs/development/README.md`
  - `reports/development/plan-37-first-number-line-and-bar-bridge-design/`

---

## 6. Problems Encountered and Resolutions

1. **360px Touch-Target Collision at $b \ge 8$:**
   - *Problem:* A $312\text{px}$ track width divided by $b=8$ yields $39\text{px}$ per interval; divided by $b=12$ yields $26\text{px}$. Placed on a single line, $44\text{px}$ touch targets overlap horizontally.
   - *Resolution:* Specified a support-dependent density policy: high-support direct single-row buttons are bounded to $b \le 6$; for $b=8$, hit targets use alternating vertical tiers or a step stepper ($◀$ / $▶$) control with $\ge 48\text{px}$ hitboxes. Medium support uses 3–4 discrete candidate markers with $\ge 50\text{px}$ horizontal clearance.
2. **Screen-Reader Parity vs. Answer Leakage:**
   - *Problem:* Coarse 3-bucket labels (`"less than half"`, `"at half"`, `"greater than half"`) cannot discriminate between multiple candidates on the same side of $1/2$ (e.g. distractor $1/4$ vs. target $3/8$), while naming $a/b$ leaks the answer.
   - *Resolution:* Formulated structural step descriptions based on equal step indices out of $N$ intervals from 0 to 1 plus relative benchmark orientation (e.g. `"Tick 3 of 8 equal steps from 0 to 1 (just left of one-half)"`).
3. **Replay Envelope Concurrency with Plan 38:**
   - *Problem:* Plan 38 is actively implementing `fractionflow.episode-replay/v5` for takeaway subtraction.
   - *Resolution:* Specified a decoupled task pattern ID `bridge.bar-to-line-same-amount.v1` and designated replay schema `v6` for bridge episodes, preserving historical envelopes `v1` through `v5` without schema collision.

---

## 7. Remaining Risks and Follow-Ups

1. **Multi-Whole Magnitude Bridge ($[0, 2]$):**
   - The transfer from a multi-whole stack to a number line spanning $[0, 2]$ remains an explicit, open follow-up obligation on the Phase 3 register. It is not discharged by this 0-to-1 design.
2. **Phase 3 Bar Stability Review Gate (§31):**
   - Implementation of number-line source code must wait until Phase 3 bar interactions across addition and subtraction are complete and confirmed stable.
3. **Assistance Provenance in Bridge Tasks:**
   - Future implementation should record whether the learner solved the task on high support (partitioned grid) or medium support (sparse benchmarks), preserving truthful assistance provenance.

---

## 8. Ready for Orchestrator Review

**Yes.** All deliverables for Plan 37 (Requirements 0, 1, 2, 3, 4, 5, and reporting) are complete, validated, and ready for orchestrator verification. Frontmatter status remains untouched per implementer guardrails.

---

## 9. Owner Adoption — 2026-10-18

The owner approved the Plan 37 proposal and instructed completion of `plan-37`. See `owner-acceptance.md`, `dossier-review.md`, and `DECISION-046`. `plan-37` is complete as design; Phase 3 bar-stability exit (Roadmap §31), representation checkpoint (§90), multi-whole $[0, 2]$ stack-to-line transfer, and $b > 8$ line-density investigation remain explicit gates and open follow-up obligations before Phase 4 source activation.


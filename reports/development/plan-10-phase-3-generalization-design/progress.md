# Progress Report: Plan 10 (Phase 3 Generalization — Design and Reach Assessment)

- **Date:** 2026-09-21
- **Packet ID:** `plan-10`
- **Packet Title:** Phase 3 Generalization — Design and Reach Assessment
- **Status:** In-progress (reported by implementer; awaiting orchestrator and owner gate review)
- **Baseline Commit:** `199c104` (post-`plan-09` Repair 07)
- **Mutation Scope:** Docs-only. Target directory: `docs/development/phase-3-generalization-design/`. Zero application source files changed; zero edits to `docs/decision-log.md` or `docs/open-questions.md`.

---

## 1. Overall Summary

This packet delivers the design dossier for Roadmap Phase 3, answering the mandate of Roadmap §26:
> *"The goal is not to invent new interfaces. The goal is to discover how far the existing interaction language can stretch."*

Rather than relying on specification assumptions, the reach assessment directly investigated the running codebase at commit `199c104`. All eight problem families of Roadmap §27 and all six focused concept episodes of Roadmap §28 were audited against the mathematical core (`src/math/`), content models (`src/content/`), interaction state machines (`src/interaction/`), and rendering components (`src/render/`).

The dossier resolves Open Question **OQ-20** (results crossing one whole) through a mathematically grounded, 360px-budgeted multi-whole bar proposal that preserves Roadmap §17's mandate for "one stable whole". It formulates a concrete position on mixed numbers (recommending their exclusion from Phase 3 operations while establishing visual grounding for Phase 5), and provides a six-packet dependency-ordered implementation sequencing proposal.

---

## 2. Headline Counts by Classification

| Classification | §27 Problem Families (8 total) | §28 Focused Episodes (6 total) | Total (14 targets) |
|---|:---:|:---:|:---:|
| **Demonstrated Reuse** | 1 | 0 | 1 |
| **Plausible Reuse** | 2 | 2 | 4 |
| **Needs a New Beat** | 2 | 4 | 6 |
| **Needs a Representation the Bar Cannot Give** | 3 | 0 | 3 |

### Breakdown by Target

#### §27 Problem Families:
1. **Like-denominator addition:** *Plausible Reuse* (reuses encounter, notice, operate, resolve; needs zero-renaming state machine bypass and OQ-21 notice recovery copy).
2. **Like-denominator subtraction:** *Needs a Representation the Bar Cannot Give* (refusal witness: bar renders two additive shaded segments with zero takeaway or comparison semantics; operate prompts hardcode addition).
3. **Nested-denominator addition:** *Needs a New Beat* (refusal witness: state machine forces redundant sequential two-sided renaming for the fraction already matching the LCD).
4. **Nested-denominator subtraction:** *Needs a Representation the Bar Cannot Give* (combines subtraction representation absence with asymmetric transformation lockout).
5. **Shared-factor unlike denominators:** *Plausible Reuse* (matches Phase 2 7-beat arc; blocked only by selector registration and authored reflection data).
6. **Relatively prime unlike denominators:** *Demonstrated Reuse* (canonical vertical slice; verified end-to-end executable path).
7. **Results crossing one whole:** *Needs a Representation the Bar Cannot Give* (refusal witness: loud `TypeError` thrown by `fraction-bar.js:91` and `matching-choice.js:14`; silent collapse to identical 8/8 drawing if guard removed).
8. **Simplification:** *Needs a New Beat* (learner agency currently absent; resolve beat passively reports reduction; bar cannot animate partition merging / reverse subdivision).

#### §28 Focused Concept Episodes:
1. **Construct an equivalent fraction:** *Plausible Reuse* (reuses transform beat and subdivision bar; needs standalone 3-beat episode state machine).
2. **Identify a valid common denominator:** *Plausible Reuse* (reuses decide controls and `validateCommonDenominator`; requires distractor generation).
3. **Identify the least common denominator:** *Needs a New Beat* (requires two-tier classifier distinguishing valid vs least common denominator).
4. **Determine which fraction needs renaming:** *Needs a New Beat* (requires new prompt and 4-way selector control: first, second, both, neither).
5. **Determine whether a result should exceed one:** *Needs a New Beat* (estimation/benchmark Notice beat variant with ternary choice $< 1, = 1, > 1$).
6. **Simplify an equivalent result:** *Needs a New Beat* (requires dedicated interactive simplify beat).

---

## 3. The OQ-20 Recommendation

- **Recommended Candidate:** **Candidate 1: Discrete Multi-Whole Stack (Unit-Calibrated Separate Bars)**.
- **Rationale:**
  1. Reconciles Roadmap §17 directly: "One stable whole" is defined as the immutable benchmark unit of measure, not a fixed single frame. The physical pixel width of fractional unit partitions remains invariant across all wholes and addends.
  2. Truthfully depicts improper fractions: enables direct visual counting of all shaded parts (e.g. 10 individual eighth-segments across two stacked whole bars).
  3. Avoids Candidate 2's severe pitfall: compressing a 2-whole continuous track into a 360px viewport shrinks unit segments by 50%, introducing the dangerous misconception that adding fractions shrinks the pieces.
- **360px Layout Budget (Re-derived against Reference Viewports `360×740` and `360×752`):**
  - Track width $232\text{px}$, readout $80\text{px}$, total row width $328\text{px}$ (fits 360px viewport with 16px lateral padding).
  - Measured baseline in running application at `operate`: Submit bottom sits at **541px** (carrying existing header, milestone line, completed-beats disclosure, addend bars, prompt, input).
  - One measured bar height is **47px** (plus 8px gap $\to$ 55px delta for second whole bar).
  - Without mitigation, Submit bottom moves to **596px**, clearing the 740px fold by **144px** and the 752px fold by **156px** (and clears a 640px height by 44px).
  - **Required mitigation:** Collapsing the addend bars into the completed-beats summary section is required; this removes 94px of addend bars and adds two result bars (+102px) plus summary text (~26px), placing Submit bottom near **575px** with verified clearances of **$\ge 165\text{px}$** (at 740px) and **$\ge 177\text{px}$** (at 752px).

---

## 4. The Mixed-Number Position

- **Recommendation:** **Mixed numbers should NOT enter Phase 3 as an operational or input requirement.**
- **Rationale:**
  1. Conflates two distinct cognitive goals for struggling upper-elementary learners: finding common units versus whole-boundary regrouping.
  2. Preserves the Phase 5 boundary defined by Roadmap §§38–44 (which explicitly reserves mixed operands, composition, and decomposition for Phase 5).
  3. Phase 3 improper fraction sums are evaluated directly (e.g. `10/8`). Multi-whole bars visually ground the quantity as $> 1$, and an informational note at `resolve` calmly states `"10/8 is 1 whole and 2/8"`, providing conceptual priming for Phase 5 without testing or penalizing the learner.

---

## 5. What Could Not Be Assessed Without Building It

In accordance with Requirement 3, the following question is explicitly identified as an empirical design question that **cannot be settled without building and observing prototypes**:

- **Subtraction Representation Paradigm on the Fraction Bar:**
  Whether visual takeaway (animating the removal, dimming, or cross-hatching of subtrahend segments from the minuend bar) or visual comparison (displaying both bars aligned and highlighting the difference with a bracket) is more pedagogically sound for upper-elementary children cannot be deduced from specification prose.
  Asserting one as definitively superior without observing children interact with both would be speculative guesswork. Packet 3.4 is therefore structured with an empirical representation spike.

---

## 6. Artifacts Produced

The dossier was created at exactly `docs/development/phase-3-generalization-design/` containing the five specified files and no others:

1. `docs/development/phase-3-generalization-design/README.md`
2. `docs/development/phase-3-generalization-design/grammar-reach-assessment.md`
3. `docs/development/phase-3-generalization-design/crossing-one-whole.md`
4. `docs/development/phase-3-generalization-design/mixed-numbers-position.md`
5. `docs/development/phase-3-generalization-design/sequencing-proposal.md`

---

## 7. Commands Run and Results

| Command | Result | Notes |
|---|---|---|
| `git status` | Untracked file noted | Baseline `199c104` confirmed; pre-existing untracked file `reports/development/plan-14-reachable-behavior-route-contract/mechanism-proposal.md` recognized and left untouched per commit discipline |
| `node scripts/dev/plan-status.js check plan-10` | `RUNNABLE: plan-10 is ready to implement` (Exit 0) | Preflight check satisfied |
| `npm test` | 20 test files passed, 244 tests passed | Baseline unit/contract suite clean |
| `npm run build` | Vite build clean (449ms) | Production bundle unaffected |
| `node scripts/dev/plan-status.js lint` | `lint: OK (no violations)` | All schemas and frontmatters valid |

---

## 8. Validation Checks Performed

- [x] Dossier exists at exactly `docs/development/phase-3-generalization-design/` with the five named files and no others.
- [x] Every §27 family and §28 focused episode classified with code-level file and symbol citations.
- [x] Each classification labelled strictly as **demonstrated reuse**, **plausible reuse**, **needs a new beat**, or **needs a representation the bar cannot give**.
- [x] Every demonstrated-reuse row carries an executable current path in plan-14 route matrix format; every cannot-give row carries a captured refusal witness from the running code.
- [x] OQ-20 proposal evaluates three candidates, provides a stated recommendation with reasoning, concrete 360px layout budget calculations, and addresses §17's "one stable whole" directly.
- [x] Mixed-number position stated with architectural breakdown and cognitive load reasoning.
- [x] Sequencing proposal breaks Phase 3 into six bite-sized implementation packets with dependency reasoning.
- [x] No application source (`src/`) modified; zero edits to `docs/decision-log.md` or `docs/open-questions.md`.
- [x] Tree clean, tests passing, linter passing.

---

## 9. Problems Encountered and How Resolved

- **Problem:** When testing curated golden cases against `src/render/fraction-bar.js`, the loud guard from `plan-09` Repair 02 threw `TypeError`, hiding what the visual rendering would have looked like without the guard.
- **Resolution:** Tested both the guarded function (`render`) and the underlying element builder (`createTrackAndReadout`). Captured both witnesses: the loud `TypeError: fraction bar form is outside the supported bar range` in `fraction-bar.js:91`, and the silent visual corruption (rendering 8 segments out of 8 with readout `10 / 8`, visually collapsing $10/8$ into $8/8$). Both are documented in the dossier.

---

## 10. Remaining Risks or Follow-ups

1. **Owner Disposition of OQ-20:** The multi-whole stacked bar proposal must be reviewed and accepted by the owner before Packet 3.1 can begin implementation.
2. **Precursor Foundation Packets:** Phase 3 implementation in code depends on `plan-14` (route matrix harness), `plan-12` (entry page practice types), and `plan-13` (support ladder writer).

---

## 11. Advisor Disposition

- **Provider Matching & Capability (Step 1):**
  Per `advisor-capable-providers.json`, advisor capability is tracked for `claude-code`, `codex-cli`, and `kimi-code`. Running in the Antigravity / Gemini environment, this thread does not match any entry in `advisor-capable-providers.json`.
  Per Step 1 fail-closed rules: **treat thread as not advisor-capable**.
- **Declared Mode:** **Branch C — Orchestrator-gate-only degraded mode**.
- **Proportionality Note (Step 2):**
  This packet is strictly docs-only (mutation level: docs/dossier). Zero application code, scripts, or schemas were altered. Even under an advisor-capable thread, a docs-only proposal carries no runtime behavioral surface. Standard orchestrator and owner gate review applies.

---

## 12. Ready for Orchestrator Review

**Yes.** All requirements of `plan-10` and the integration brief are satisfied. Dossier is complete, validated, and ready for orchestrator review and owner disposition.

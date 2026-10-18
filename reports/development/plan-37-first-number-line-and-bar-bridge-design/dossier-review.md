# Plan 37 Dossier Review — 2026-10-18

**Packet:** `plan-37-first-number-line-and-bar-bridge-design`  
**Reviewer:** Orchestrator (Branch B / orchestrator-gate review for docs-only design packet)  
**Inspected Commit:** `34da63155d63f9b02cd35b309e898ffa754b24a5` (+ bounded orchestrator refinements below)

This is a technical design review of the Plan 37 dossier (`requirement-0-investigation.md`, `annotated-flow.md`, `design-contract.md`, `implementation-and-validation.md`, `static-board.html`, and `progress.md`). It does not adopt the design on the owner's behalf, declare Phase 3 complete, resolve Roadmap §31 or §90, or authorize number-line source changes.

---

## 1. Consolidated Verification & Bounded Refinements Applied

1. **Exact Rational Authority vs. Floating-Point Coordinates (Requirement 2):**
   - *Finding:* The initial draft of Section 3 in `design-contract.md` listed decimal approximations (`0.333`, `0.667`, `0.833`) in the target column and decimal distractors (`p_1=0.15`, `p_1=0.33`, `p_3=0.67`) for the two medium-support items.
   - *Refinement Applied:* Replaced all target positions and diagnostic distractors in the 8-item seed table with exact rational wire fractions (`{ kind: 'fraction', numerator, denominator }`) evaluated via `equalFractions` / `compareFractions` in `src/math/fraction.js`, and included an unreduced-bar item (`bridge-05-two-fourths-half`: `2/4` bar mapped to `1/2` on the line) to test cross-representation equivalence.
2. **Pre-Answer Leakage Prevention in Scene Projection, Spoken Labels, and Static Probe (Requirement 1):**
   - *Finding:*
     - `design-contract.md` Section 4 included `targetFraction` in `scene.meaning.currentTask` prior to `resolve`.
     - `annotated-flow.md` (line 45) showed `1/4` and `3/4` on the pre-answer ASCII number line alongside `0`, `1/2`, `1`.
     - `requirement-0-investigation.md` (line 85) and `static-board.html` (line 488, line 537) included spoken candidate examples naming `"1 quarter"` / `"3 eighths"` / `"at 1/4"` and rendered cumulative fraction text (`1/4`, `2/4`, `3/4`, `4/4`) inside the fraction-bar segments.
   - *Refinement Applied:*
     - Removed `targetFraction` from pre-resolve scene projection; only `acceptedPosition` is projected at `resolve`.
     - Restricted pre-answer visible line labels in `annotated-flow.md` to benchmarks `0`, `1/2`, and `1`, and aligned all spoken candidate examples across `requirement-0-investigation.md`, `annotated-flow.md`, and `static-board.html` to non-leaking structural step descriptions (`"k of N equal steps from 0 to 1"` plus benchmark relation).
     - Removed cumulative fraction strings from inside `.bar-cell` in `static-board.html` and wired `.tier-upper` / `.tier-lower` staggered vertical hitboxes for `b >= 8` in High Support so adjacent `44×44px` buttons do not collide at `360px`.
3. **Replay Contract Alignment (Requirement 2):**
   - *Finding:* `design-contract.md` Section 5 showed `timestamp` and `preview-candidate` inside replay `learnerIntents`.
   - *Refinement Applied:* Aligned the replay contract with `src/interaction/replay.js`: deterministic JSON wire envelopes (`schemaVersion`, `contentIdentity`, `episodeDefinition`, `support`, `activeCondition`, `learnerIntents`, `taskContext`), zero timestamps, and submitted instructional intents only (`submit-line-position`, `request-task-help`, `finish-compact-episode`), keeping unconfirmed candidate previews app-local.
4. **Retained Obligations & Future Study Observation Guide (Requirements 2 & 3):**
   - *Refinement Applied:* Explicitly recorded both retained obligations in `implementation-and-validation.md` Section 5.1—(a) the multi-whole `$[0, 2]$` stack-to-line magnitude bridge and (b) the larger-denominator ($b > 8$) line-density investigation—and added a non-PII observation guide for any future authorized learner study in Section 5.2.

---

## 2. Orchestrator Disposition & Owner Adoption Gate

All Plan 37 technical design deliverables are verified and complete. Packet status can be closed once the owner confirms disposition or adopts the design choices below:

1. **First Bridge Task & Coexistence Layout:** Adopt **Candidate A (Same-Amount Placement on a $[0, 1]$ Bar-to-Line Bridge)** with persistent vertical coexistence (aligned $x_0, x_1$ endpoints) and two-step selection (`select` preview $\to$ `Check Position` confirm).
2. **Support-Dependent Density & Touch Ergonomics:** Adopt High Support (full $1/b$ ticks for $b \in \{2, 3, 4, 6, 8\}$ with staggered/stepper hit targets at $b=8$) and Medium Support (sparse `0`, `1/2`, `1` benchmarks with discrete exact candidates).
3. **Future Implementation Staging (Post-Phase 3 Exit Gate):** Sequence number-line source implementation after Plan 38, the final Phase 3 unlike-denominator bar subtraction packet, and the Roadmap §31 / §90 exit gate review, either as the recommended 2-packet split (Packet 1: pure engine/scene/replay; Packet 2: renderers/app/routes) or a single staged packet with internal checkpoints.

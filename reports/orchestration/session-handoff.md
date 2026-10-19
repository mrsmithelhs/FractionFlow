# FractionFlow orchestration handoff

Updated 2026-10-18 after owner acceptance and closure of `plan-37` (`DECISION-046`)
and `plan-38` (`DECISION-045` implementation), plus drafting of `plan-39`. Read
current packet frontmatter and actual artifacts when their state differs from this
dated snapshot.

## Assignment and authority

The owner owns pedagogical/policy decisions, sequencing choices, rendered-page/agency
acceptance, and deployment approval. The orchestrator owns mechanism review, bounded
repair direction, independent verification, packet status, and acceptance records.
Nothing in this handoff authorizes pushing to GitHub, deploying to Pages, or
changing owner-selected packet sequencing without an explicit owner instruction.

Start with `AGENTS.md`, `docs/agent-starting-prompts/orchestrator-prompt.md`,
`docs/development/README.md`, `docs/decision-log.md`, and `docs/development/phase-3-follow-up-obligations.md`.
Follow actual provider capabilities and `advisor-capable-providers.json`. For any
Codex work, Luna bounded children and Sol read-only low/medium review are authorized;
no Astra without an explicit owner exception, no implementation-child fan-out, and
no silent substitution.

## Live boundary and completed work in this session

- **Completed packets (`2026-10-18`):**
  - **`plan-37` (`complete`, `DECISION-046`):** First Number-Line Task and Bar-to-Line Bridge Design.
    - Requirement 0 investigation & rival/falsifier table: `19290c5`, updated at `34da631`.
    - Design dossier (`requirement-0-investigation.md`, `annotated-flow.md`, `design-contract.md`, `implementation-and-validation.md`): `34da631`.
    - Orchestrator review (`dossier-review.md`) & owner adoption (`owner-acceptance.md`, `DECISION-046`): `835fb58`.
  - **`plan-38` (`complete`, `DECISION-045` batch implementation):** First Learner Like-Denominator Takeaway Subtraction Batch.
    - Requirement 0 proposal, probe, & `plan35-v4-replay-oracles.json` freeze: `b1f1b77`, `4c85b8a`.
    - Checkpoint 1 (Stages 1–3: 8 curated records, `like-denominator-subtraction-profile`, episode/scene, `fractionflow.episode-replay/v5`): `98c61e3`.
    - Checkpoint 2 (Stages 4–5: visual takeaway bar with hatched removal segments, linear path, app integration, 37 unit/rendered tests): `241964a`.
    - Checkpoint 3 (Stage 6: 8 browser routes -> 73 route rows / 75 executions, 5 `--plan38-witness-seed` falsification seeds, 11 responsive/zoom captures): `2db8a69`.
    - Owner screenshot review copy refinements (removed `.linear-takeaway-unit-context`, non-visual linear removal status `"${rightNum}/${den} is taken away from ${leftNum}/${den}."` during `operate` only, and context-specific resolve prompt `"${num}/${den} is left."`) + closure: `d140bd8`, plus tightened `withinViewport` and `action-as-answer` witness verification.
- **Ready / Draft packets on the board:**
  - **`plan-40` (`ready`):** Unlike-Denominator Subtraction Recipes and Curated Batch (Option A Phase 3 completion + Roadmap §31/§90 exit disposition; depends on `plan-35` and `plan-38`).
  - **`plan-39` (`draft`, `blocked` on `plan-40`):** First Number-Line Locate and Bar-to-Line Bridge Batch (implements `DECISION-046` / `plan-37` after `plan-40`).
  - **`plan-23` (`draft`):** Local Development Console (`npm run dev:console`).

## Owner sequencing decision (Option A) and next-step gate

The owner confirmed **Option A**:
- Run **`plan-40`** (Unlike-Denominator Subtraction Recipes and Curated Batch on fraction bars, reusing `plan-35`'s `construct`, `inspect-keep-repair`, and `identify-side` recipes + `plan-38`'s takeaway operation, plus the Roadmap §31 / §90 Phase 3 exit disposition) first.
- Once `plan-40` is accepted and closed, promote **`plan-39`** (`0`-to-`1` bar-to-line bridge batch) to `ready` to begin Phase 4 number-line implementation.

**Immediate next step:**
- Launch `plan-40` Requirement 0 (pre-source mechanism proposal, batch/admission probe, and `plan38-v5-replay-oracles.json` freeze) or review the implementer's Requirement 0 proposal when ready.

## Review discipline reminders

- **Preserve owner decision continuity:** Never silently reinterpret an owner-selected sequence across turns; if proposing a change of order, state the prior decision explicitly and ask the owner to choose.
- **Verify against artifacts and exact witnesses:** Ensure viewport scripts assert `withinViewport` (not just positive box dimensions) and falsification seeds mutate the specific mechanism under test (e.g., removing fraction-entry controls for `action-as-answer`, not just changing prompt text).
- **Restore historical evidence touched by full route runs:** Running `node scripts/dev/run-route-matrix.js` rewrites screenshot/measurement files for earlier routes (`plan-18`, `plan-34`, `plan-35`). Always restore untouched historical evidence directories before committing.


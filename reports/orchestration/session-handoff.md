# FractionFlow orchestration handoff

Latest Plan 41 disposition: investigation delivered at `ddf081c`, reviewed in
reports/development/plan-41-phase-boundary-maintainability-investigation/orchestration-review.md.
Owner directly approved its scope. Recommend one staged source packet: targeted
guards → baseline → vanilla operate-region slice → evaluation → Plan 39, with
refined recovery ownership and fair comparison. Owner adoption/source packet
approval pending; no source work or Plan 39 launch authorized. Plan 41 is delivered,
not complete; older ready/awaiting-dispatch entries below are historical.

Latest owner disposition 2026-10-20: owner accepted current Plan 40 screens and
directed closure; Plan 40 is COMPLETE with bounded Phase 3 checkpoint recorded in
reports/development/plan-40-unlike-denominator-subtraction-batch/owner-acceptance.md.
Plan 41 is READY and checks RUNNABLE, awaiting investigator dispatch and Requirement
0 scope confirmation. No investigator has been started by this chat. Plan 39 stays
draft under DECISION-047. All earlier pending-acceptance statements below are
historical. No refactor, push or deployment authorized.

Current disposition 2026-10-20: Plan 40 final consolidated repair (`01eddf6`,
`da1a453`) is TECHNICALLY ACCEPTED, pending owner screen/agency acceptance and
explicit bounded Phase 3 checkpoint adoption. Read
reports/development/plan-40-unlike-denominator-subtraction-batch/orchestration-final-review.md
and its independent final execution receipt. Parent passed 487 tests, both builds,
eight Chrome routes, six distinct seeds and all three previously false-passing
browser probes now reject their defects. Current submitted PNGs show repaired UI.
No remaining repair is assigned. Earlier repair-pending entries below are history
superseded by this disposition. Packet stays delivered; no push/deploy authorized.
On owner acceptance/checkpoint: close Plan 40 and promote Plan 41 to its research
scope gate. Plan 39 stays draft under DECISION-047.

Owner sequence amendment 2026-10-20 (DECISION-047): Plan 41 has been drafted as a
report-only maintainability investigation. After Plan 40 closure/Phase 3 checkpoint,
run Plan 41, obtain owner disposition, then complete any separately authorized
prerequisite refactor before Plan 39. Plan 39 now explicitly depends on Plan 41.
Neither investigation execution nor refactor/source work has started.

Updated 2026-10-20 after Plan 40 Repair 01 re-review (`dab636c`, `2fef274`).
Plan 40 remains delivered, not technically accepted. Read
reports/development/plan-40-unlike-denominator-subtraction-batch/orchestration-repair01-review.md
for the consolidated remaining repair assignment and independent execution receipt.
Fresh builds/486 tests/eight Chrome routes/four seeds passed. Committed screenshots
still show pre-repair copy; accessible/stacked leakage and partly offscreen controls
falsely pass their witnesses. No product math defect observed. Plan 39 stays draft.

Earlier resumption context: Codex reviewed Plan40 delivery
902cef8. Plan40 is delivered, NOT technically accepted or owner closed. Read
reports/development/plan-40-unlike-denominator-subtraction-batch/orchestration-stage5-review.md
for the consolidated repair and separate execution receipt. Plan39 stays draft.

Parent independently passed481 tests, both builds, all8 new Chrome routes and4
seed runs, sampled actual draft values across views, and deep-compared all24 frozen
v4/v5 states. Old captures/receipts were restored byte-for-byte after execution.
Required repair: real multi-viewport containment/DPR receipts, value/reset/help
assertions, numeric/accessibility leak sensitivity, holdout render coverage,
full-state frozen-oracle assertions and honest delivery/phase-exit reporting.
Visible long response labels and redundant Difference milestone also merit the
bounded copy refinement recorded in the review. No product source was changed.
No implementer repair assignment has yet been dispatched by the resumed chat.

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

## Live boundary and completed work

- **Recently completed packets (`2026-10-18`):**
  - **`plan-37` (`complete`, `DECISION-046`):** First Number-Line Task and Bar-to-Line Bridge Design (`835fb58`).
  - **`plan-38` (`complete`, `DECISION-045` batch implementation):** Like-Denominator Takeaway Subtraction Batch (`d140bd8`, witness/viewport verification tightened at `7ffb64b`).
- **Active packet in flight (`2026-10-19`):**
  - **`plan-40` (`delivered`, repair pending):** Unlike-Denominator Subtraction Recipes and Curated Batch (`docs/development/plan-40-unlike-denominator-subtraction-batch.md`).
    - **Requirement 0 (Approved):** Proposal, admission probe, and `tests/fixtures/plan38-v5-replay-oracles.json` committed by implementer at `81014f3`; orchestrator review & Guardrails A–D recorded in `reports/development/plan-40-unlike-denominator-subtraction-batch/requirement-0-review.md` (`8a2ef30`).
    - **Checkpoint 1 / Stages 1–2 (Approved):** 9 curated items (`unlike-subtraction-vetted-set@1`) + 2 data-only holdouts (`plan40-data-only-holdouts@1`), 17-key `taskContext` validator, `phase-3-reusable-subtraction-recipes@1` episode/schedule, Option B direct transition from `transform` to `operate` (`subtractionRemoval: 'marked'`), `scene.meaning.takeaway` (`null` during `encounter`/`decide`/`transform`, active at `operate`/`resolve`), `fractionflow.episode-replay/v6`, and 23 pure unit/replay tests committed at `4eba2d2`; orchestrator review & Stage 3–4 wiring checklist recorded in `reports/development/plan-40-unlike-denominator-subtraction-batch/checkpoint-1-review.md` (`953de43`).
    - **Checkpoint 2 / Stages 3–4 (Approved):** Visual & linear renderer updates (`src/render/beat-container.js`, `src/render/linear-path.js`), `PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE` (`id: 'unlike-denominator-subtraction'`, `"Subtract fractions with different denominators"`) in `PLAN40_PRACTICE_TYPES_V9`, all 7 `src/app/app.js` integration seams, and 23 render/app/leakage tests (`475/475` total repo unit tests passing) committed at `4ceb507`; orchestrator review & Stage 5 guidance recorded in `reports/development/plan-40-unlike-denominator-subtraction-batch/checkpoint-2-review.md` (`d41bf37`).
    - **Stage 5 / Requirement 4 (Reported at902cef8; independently reviewed):** Original assignment followed `checkpoint-2-review.md` (`d41bf37`). The following requirements remain acceptance references; see the newer review above for unmet evidence:
      1. Register `plan40-unlike-subtraction` in `tests/routes/plan34-context-map.json`, append `ROUTE-PLAN40-*` routes to `tests/routes/route-matrix.json` (preserving all existing 73 route rows / 75 executions), and add `tests/routes-plan40-subtraction-recipes.test.js`.
      2. Implement the 4 `--plan40-witness-seed <seed>` falsification seeds in `scripts/dev/run-route-matrix.js` (`erased-takeaway-hatch-after-transform`, `addition-wording-in-subtraction`, `premature-difference-leak`, `missing-operate-fraction-inputs`) under the strict non-tautology rule (each seed mutates live DOM/CSS before the route assertion and is caught by the standard route assertion).
      3. Capture representative screenshots, `plan40-viewport-measurements.json` (`withinViewport: true`, `horizontalOverflowPx === 0`), and `plan40-route-matrix-summary.json` under `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/`, and restore any touched historical evidence files (`plan-18`, `plan-34`, `plan-35`, `plan-38`, `docs/routes/evidence/`).
      4. Author `reports/development/plan-40-unlike-denominator-subtraction-batch/progress.md` including the **Roadmap §31 / §90 Phase 3 Exit Assessment** section.
- **Draft packets on the board:**
  - **`plan-41` (`draft`, blocked on `plan-40`):** Phase-boundary maintainability investigation; report-only, then owner disposition and a separate source packet if justified.
  - **`plan-39` (`draft`, blocked on `plan-40` and `plan-41`):** First Number-Line Locate and Bar-to-Line Bridge Batch; follows the adopted investigation/refactor disposition (DECISION-047).
  - **`plan-23` (`draft`):** Local Development Console (`npm run dev:console`).
- **Phase 4 Exploratory Design & Review Records (`2026-10-19`):**
  - Owner and orchestrator explored Phase 4 fraction magnitude comparison (`<`, `=`, `>`) and its bridge to comparison/difference subtraction (`|a - b|`).
  - Independent reviews were recorded in `reports/orchestration/magnitude-comparison-review-claude.md` (`f383a96`) and `reports/orchestration/magnitude-comparison-review-codex.md` (`7927636`).
  - The synthesized, review-hardened Phase 4 planning notes are recorded in `docs/development/phase-4-magnitude-comparison-notes.md` (`953de43`) and linked from `docs/development/phase-3-follow-up-obligations.md`.

## Immediate next steps after resumed review

1. **Plan40 is already delivered.** Use the single consolidated repair in
   orchestration-stage5-review.md; keep source/math changes limited to any actual
   defect reproduced by stronger assertions. Implementer must not set completion.
2. **Verify Stage 5 artifacts against the objective:**
   - Inspect `git status` and the implementer's commit to ensure no historical evidence files (`docs/routes/evidence/`, `plan-18`, `plan-34`, `plan-35`, `plan-38`) were left modified.
   - Verify `scripts/dev/run-route-matrix.js` to confirm all 4 `--plan40-witness-seed` seeds are non-tautological DOM/CSS mutations caught by real route assertions and that `plan40WitnessSeed` enforces `seedDetected === 1 && failed === 0 && routeResults.length === 1`.
   - Inspect `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-viewport-measurements.json`, `plan40-route-matrix-summary.json`, and the captured screenshots (`360x740`, `360x752`, `1366x768`, `1093x614 @ DPR 1.25`) to confirm `withinViewport: true` and `horizontalOverflowPx === 0`.
   - Correct progress.md's unsupported accessibility, replay and broad Phase3
     clearance claims. Separate accepted proper-fraction scope from retained
     obligations and unmeasured learner/physical-device/AT outcomes.
3. **Owner Acceptance & Option A Transition to `plan-39`:**
   - Present the Stage 5 verification, representative screenshots, and Roadmap §31 / §90 Phase 3 exit summary to the owner.
   - Upon owner acceptance and explicit checkpoint disposition, close Plan 40.
     Promote Plan 41 for investigation next. Do not promote Plan 39 automatically:
     first obtain Plan 41 disposition and complete any adopted prerequisite
     refactor under its own approved packet (DECISION-047).

## Review discipline reminders

- **Preserve owner decision continuity:** Never silently reinterpret an owner-selected sequence across turns; if proposing a change of order, state the prior decision explicitly and ask the owner to choose.
- **Verify against artifacts and exact witnesses:** Ensure viewport scripts assert `withinViewport: true` (not just positive box dimensions) and falsification seeds mutate the live mechanism under test rather than throwing synthetically inside an assertion helper.
- **Restore historical evidence touched by full route runs:** Running `node scripts/dev/run-route-matrix.js` rewrites screenshot/measurement files for earlier routes (`plan-18`, `plan-34`, `plan-35`, `plan-38`). Always verify untouched historical evidence directories are clean before committing.

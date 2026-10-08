# Plan 25 — Requirement 0 Mechanism Proposal

> **Delivery update (2026-10-07):** The original section below records the pre-source
> mechanism gate. The orchestrator later approved the revised mechanism, and this
> addendum records the completed implementation. Packet frontmatter/status remains
> orchestrator-owned and unchanged.

**Date:** 2026-10-07  
**Packet status:** `in-progress` (unchanged)  
**Stage:** Investigation complete; stopped before source implementation pending mechanism approval.

## Overall summary

Plan 25 preflight passed: `node scripts/dev/plan-status.js check 25` returned `RUNNABLE`. The working tree was clean before this report. I read the packet, current Plan 24 mechanism and final help-toggle repair evidence, Plan 22 closure disposition, the relevant instructional model and decisions, and the current transform projection, classification, help, provenance and visual/linear controls.

No application source or test files were changed. No tests were run. I sent the mechanism proposal and a provenance question to **FF Orch 12+** using the owner's explicit authorization for bidirectional communication.

## Existing behavior and evidence

- A transform task shows one fraction-conversion input in each view. The question and active target side come from the current task; the source form and target denominator are available in the projected scene.
- `projectScene` exposes the selected common unit and its scale factors from the validated path. The existing conversion classifier remains the upstream authority for the final equivalent-fraction response.
- Both visual and linear renderers show recovery for “denominator changed without numerator” separately from an incorrect equivalent numerator.
- The single app help control currently returns to the support panel outside the Plan 24 decide task. Plan 24's final repaired baseline synchronizes label, `aria-expanded`, `aria-controls`, cue visibility, retained input, focus, recovery and reset behavior for its decide help.
- Existing `request-help` records help history, but help levels accumulate across the episode. After four requests, the reducer sets `nextResponseSupport: demonstrate`; a later transform response then records `reviewed-demonstration` in visibility/provenance. This makes blindly reusing the generic request at every open/reopen a semantic change to the conversion response.
- A transform helper can remain local to the existing transform beat and leave the frozen schedule unchanged. The current task is already visibly assisted if the requested-help action is represented in the existing help history; it should not claim independent transfer.

## Candidate mechanism for the gate

Use the existing single **Need help?** toggle beside the active conversion response in both paths. Preserve Plan 24's synchronized button label and ARIA state, visible cue during recovery, draft retention, button focus on open/close, view-switch behavior and reset semantics. Opening help presents a short equation and one response field at a time; completed directions are replaced rather than accumulated.

For `2/3 → ?/24` on the left side:

1. Show `3 × ? = 24`. The learner enters the denominator multiplier. A wrong entry receives local recovery that keeps the same equation and does not reveal the factor.
2. After the correct factor `8`, replace the helper prompt with `Multiply the top by 8, too.` The existing conversion question and field supply the numerator decision once. It is not autofilled or submitted by the helper.
3. The learner submits through the existing main conversion action. Its upstream classifier decides correctness, and its existing wrong-answer recovery remains distinct from the multiplier helper's recovery. Help never displays `16/24` or a completed converted bar before acceptance.

For `1/4 → ?/24` on the other operand, the same interaction is `4 × ? = 24`, then `Multiply the top by 6, too.` Neither the result fraction nor converted bar is revealed by help. The relationship is: each original part is split into the same number of equal smaller parts, so the amount stays the same. A compact equation is preferred to a second unit-part drawing because the task already presents its visual transformation and an added model could duplicate the active representation or expose the conversion. This avoids asking the learner to calculate the numerator twice.

Use current source form, target denominator and exact scale factor from the validated projected task. Do not use canonical-number copy or calculate mathematical truth in either renderer. A pure upstream classifier owns multiplier correctness; presentation receives only its current prompt, field state and recovery. The existing schedule and support configuration remain fixed. Definition identity and helper provenance are described below.

## State, focus, reset and provenance contract

Keep open/closed visibility, focus and unsubmitted multiplier draft app-local and transient. Record accepted multiplier submissions and their classifications in replayable scoped support history, associated with the current side and schedule entry. Derive the helper step from that history. Closing and reopening resumes the current substep. Switching visual/linear view preserves the helper response and unsubmitted main conversion draft. Clear stale helper presentation when the side/beat changes, on retry/return, or on a fresh episode.

Opening focuses the multiplier response; after a correct multiplier, focus returns to the existing conversion response so the learner enters the numerator there once; closing restores focus to the toggle. Preserve the existing conversion response and recovery behavior. A requested helper remains visibly closable after a wrong main answer; its open label, `aria-expanded`, `aria-controls` and cue stay synchronized as in the Plan 24 repair. Helper recovery does not replace or clear main conversion recovery.

Record the help request as assisted work using the accepted help/provenance contract, and keep the existing main conversion response as the only conversion-acceptance action. Do not assign a new mastery category or call this independent transfer. Do not silently change frozen support or task schedule.

## Revised provenance and replay contract sent to the orchestrator

The orchestrator verified that generic `request-help` escalates episode-globally and that prior decide help can make the first transform request a generic `demonstrate`, falsely labeling a demonstration that was not shown. It directed a revised proposal and kept the source gate closed. The following bounded contract was sent for a recorded gate decision; it is not yet approved:

- Add rev-3-only intents: `{ type: 'request-task-help' }`, valid only at active decide/transform schedule entries, and `{ type: 'submit-transform-help-multiplier', proposed: { kind: 'fraction', numerator: '<integer>', denominator: '1' } }`, valid only at an active transform entry after its task-help request. The latter reuses the exact whole-fraction wire form. Zero/wrong integer values receive local incorrect-answer recovery; malformed or non-whole intent wires fail closed through existing validation without revealing a factor. The reducer derives beat, side and `scheduleEntryId` from active state; callers cannot supply stale identity. Both new intents are rejected on revisions 1/2.
- For fresh revision-3 journeys, route help opens at decide and transform to `request-task-help`; preserve the accepted Plan 24 label, cue, toggle, focus and recovery behavior. Other beats and revisions retain existing `request-help`. Record one task-local request per current schedule entry, idempotently across reopen. Its scoped help/support-history record has no generic help level and does not mutate `nextResponseSupport`. Preserve any genuine prior generic demonstration flag and all generic `request-help` semantics. This prevents repeated Plan 24 cue opens from escalating into a false reviewed-demonstration claim.
- Record each attempted multiplier and its classification in scoped existing support history for the active side/schedule entry. This makes an accepted multiplier replayable supported intermediate participation, not a disposable draft or mastery/independent-transfer claim. The existing `submit-equivalent-form` remains the sole conversion acceptance; its response provenance includes the requested help history. Keep open/closed state and unsubmitted multiplier input ephemeral; add no unconditional top-level state field.
- In `src/interaction/classification.js`, parse validated wire forms with existing exact helpers and call the existing math-layer `scaleFactorForDenominator(source, target)`. Compare that returned exact BigInt fact with the supplied integer. Do not compute denominator multiplication in interaction/render code or return/project the expected factor in error recovery. The scene may project the learner-supplied accepted factor; renderers only display it. After factor acceptance, use `Multiply the top by 8, too.` parameterized by the learner-supplied factor, without repeating the main question.
- Make definition revision 3 the fresh launch identity, leaving revisions 1/2 unchanged. Preserve Plan 22 path closure explicitly for revisions 2 and 3, while revision 1 keeps historical behavior; do not gate closure on equality with the new latest-revision constant. Before editing, capture full-state rev-1/rev-2 completed 12/24 replay including generic help progression, plus rev-2 refused 36/72 and eligible-but-unauthored/missing-condition-data cases. Afterwards compare old state exactly; prove rev-3 closure, helper replay, default revision 3, old-revision rejection of new intents, generic request-help compatibility, and no false demonstration after repeated rev-3 decide-help.

I remain stopped before source work while **FF Orch 12+** records its gate disposition.

## Falsifying evidence proposed for implementation phase

- Both operands and authored target denominators 12 and 24 use their dynamically derived factors; include a noncanonical fixture.
- Zero or a wrong integer multiplier produces helper recovery; a wrong numerator uses existing conversion recovery while requested help remains available. Malformed/non-whole external intent shapes fail closed without exposing the expected factor. Neither path reveals the expected numerator.
- The help DOM and copy never expose the final equivalent numerator or fraction before the main accepted conversion; no auto-fill, auto-submit or premature final shading occurs.
- The main conversion remains independently submitted and classified; wrong conversion remains distinguishable from helper recovery.
- Opening/closing, re-opening after a wrong answer, switching views, helper substep advancement and error recovery preserve the exact nonempty main draft and have observed focus destinations.
- Retry, return/re-entry and fresh launch remove stale helper state.
- Reopening decide help four times in a revision-3 route does not set a generic demonstration flag; any genuine earlier generic flag is preserved. Task-local help and multiplier history replay deterministically.
- Revision-1 and revision-2 exact replay oracles remain unchanged; revision-2 path closure still refuses unsupported 36/72 and missing coverage. Current revision-3 launches preserve that closure and reject new intents on old definitions.
- Visual and linear paths, keyboard use, non-drag touch and reduced-motion behavior agree. Capture actual narrow and Chromebook-sized layouts; do not claim physical-device or assistive-technology evidence without testing those environments.

## Proposed source and evidence scope after approval

- `src/interaction/episode.js`, `episode-definition.js`, `classification.js`, `scene.js`, and `provenance.js` — scoped intents/history/projection, math-layer exact scale-factor use, revision-3 compatibility and explicit rev-2/rev-3 Plan 22 closure, if this revised contract is approved.
- `src/render/strings.js`, `src/render/beat-container.js`, `src/render/linear-path.js` — concise shared copy and parity of the one-step response UI.
- `src/app/app.js` and relevant app/render style files — one toggle, transient state, mounted focus/draft behavior and responsive placement.
- Focused interaction/app tests, additive route witnesses and a bounded browser capture script/evidence under `tests/`, `scripts/dev/` and `reports/development/plan-25-equivalent-fraction-conversion-help/`.

No scope is authorized for new families, denominator discovery, adaptive support, whole-bar changes, a general worked-solution engine, persistence or deployment.

## Advisor disposition

**Branch B — advisor consultation not warranted for this gate-stage change.** This work is documentation-only and has no implemented behavioral artifact for an advisor to critique. For the later implementation's real behavior surface, the authorized Sol-class (not Astra) pre-delivery consultation is warranted and will be performed against the implemented artifact after the source approval gate.

## Commands and results

- `node scripts/dev/plan-status.js check 25` — **RUNNABLE**.
- `git status --short` before report creation — clean.
- No source changes and no tests run at this mechanism gate.

## Remaining risks and stop condition

The revised intent/history/revision contract has been proposed but is not approved. Other details remain candidates. I am stopped before source implementation, as required by Plan 25 Requirement 0.

**Ready for orchestrator review:** yes.

---

## Implementation delivery

### Overall summary

Implemented requested, task-local equivalent-fraction help for the current transform in visual and linear views. The learner supplies a denominator multiplier, receives retryable local feedback for an incorrect value, then independently supplies the numerator through the existing conversion response. The helper does not show or enter the converted fraction, does not submit the conversion, and does not claim independent transfer. Generic help behavior remains unchanged for older episode definitions; fresh episodes use the registered revision-3 definition while registered revision-1/2 replay behavior and revision-2 path closure were preserved.

Task-local help request and multiplier attempts are stored in scoped replayable support history. Exact correctness is classified through the existing math-layer `scaleFactorForDenominator` helper. Open/closed visibility and unsubmitted input remain app-local. The main numerator draft and focus survive view changes, while helper state resets at the specified episode/task boundaries. Plan 24 decide-help behavior remains task-local and does not accumulate generic help levels.

### Files changed and artifacts produced

- Interaction: `src/interaction/episode.js`, `episode-definition.js`, `classification.js`, `scene.js`, and `provenance.js`.
- Presentation and app shell: `src/render/strings.js`, `beat-container.js`, `linear-path.js`, `controls.js`, and `src/app/app.js`.
- Coverage: `tests/plan25-task-help.test.js`, updates to `tests/app-shell.test.js`, `tests/route-contract.test.js`, and additive routes in `tests/routes/route-matrix.json`.
- Browser artifacts: `evidence/capture-rendered-witnesses.mjs`, `rendered-screen-measurements.json`, six screenshots for helper and incorrect-multiplier recovery at 360×740, 360×752, and 1280×800, plus the pre-mutation oracle verifier and its result JSON.
- Source/evidence commit: `7863584 feat: add requested equivalent fraction help`.

### Validation performed

- `npm test -- --run` — **27 files and 310 tests passed**.
- `npm run build` — application and subtraction-prototype production builds completed.
- `node scripts/dev/plan-status.js lint` — passed.
- `git diff --check` — passed; Git emitted only the repository's LF-to-CRLF working-copy warnings.
- `node reports/development/plan-25-equivalent-fraction-conversion-help/evidence/verify-pre-mutation-oracles.mjs` — the captured results report exact full-state matches for revision-1 and revision-2 replay at targets 12 and 24, and exact closure matches for revision-2 cases 36, 72, eligible-but-unauthored nested 24, and missing-condition-data 12.
- Browser route matrix — full matrix passed **52/52 browser executions across 50 route rows** before the final ARIA-target repair. After that repair, the focused Plan 25 requested/closed comparison passed **2/2 browser executions** and verifies the accepted cue exists at the `aria-controls` target. The first post-repair launch was blocked by Edge's sandboxed temporary-profile write; rerunning with the narrowly scoped approved execution succeeded.
- Rendered witnesses were captured in Microsoft Edge via Playwright at 360×740, 360×752, and 1280×800. Measurements show the viewport width remains equal to document width; while the helper decision is active, the main numerator field is absent. A wrong entry retains `7`, displays concise local feedback, and still withholds the main numerator. These are headless desktop-browser viewport observations, not physical Chromebook or assistive-technology tests.

### Advisor consultation and disposition

**Branch A consultation ran** against the implemented behavioral surface, as required for code with behavior. Requested model: **Sol-class (`gpt-6-sol`), read-only, light or medium effort**. Observed model: the advisor reported **“GPT-6”** and could not confirm the exact `gpt-6-sol` identifier. This is a requested Sol-class consultation with model-identity verification limitation, not a claim that the exact requested model was confirmed.

Effective posture: **instruction-read-only with post-hoc verification**. The advisor was given a bounded read-only critique and did not have structural read-only guarantees from platform metadata. The primary remained sole writer; the advisor was depth 1. The post-consultation repository status check showed no advisor-authored edits; the Plan 25 working changes and two independently authored orchestration review files were already present. No advisor edit was accepted or merged.

- **Accepted P2 — stale `aria-controls` target after multiplier acceptance.** Advisor observed that the open Help button referenced a helper wrapper that was removed on acceptance, while the accepted cue had no ID. Independently verified against both renderer branches and app state: the button remained open and referenced a missing element in the accepted state. Fixed by assigning the same view-specific ID to the accepted cue. Added visual/linear app assertions and a browser-route assertion. The focused Plan 25 route pair passed after this repair.
- **Rejected answer-leak concern — `commonUnit.scaleFactors`.** Advisor noted that the projection includes scale-factor facts and questioned whether they leak the expected factor. Inspection confirmed this projection behavior predates Plan 25 and is intentionally used by Plan 24's selected-unit explanation after decide help. The new transform helper does not render those projected factors before multiplier acceptance; it renders only the learner-entered accepted multiplier. No Plan 25 change was made for this concern.
- No other evidence-backed introduced defect was reported.

Consultation cost: one bounded advisor turn plus one disposition follow-up (roughly 5–10 minutes elapsed). The adapter/model did not expose a verifiable exact model identifier.

### Owner rendered-review follow-up and remaining limits

The existing accepted-factor cue remains `Multiply the top by 8, too.` (parameterized). A later orchestration review asked whether the procedural cue could be replaced by dynamic subdivision-meaning copy, for example, “Split each of the 3 parts into 8 equal parts.” This appears feasible without exposing the numerator or final fraction, but it has not been implemented or owner-accepted. Keep the current approved wording until the owner reviews rendered evidence and requests a bounded copy change.

Physical Chromebook, assistive-technology, owner rendered-screen/agency acceptance, deployment, and packet completion/status were not performed by this implementation. No packet status or frontmatter was changed. Two unowned working-tree files were observed and left untouched: `reports/orchestration/next-wave-after-plan-24-claude-review.md` and `reports/orchestration/next-wave-after-plan-24-gemini-review.md`.

**Ready for orchestrator technical review:** yes. **Ready for owner rendered-copy/agency acceptance:** pending the owner review noted above.

# Plan 25 — Requirement 0 Mechanism Proposal

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
2. After the correct factor `8`, replace the helper prompt with the compact cue `Use 8 for the top and bottom. Find 2 × 8 in the fraction below.` The existing conversion field is the learner's next decision and is entered only once. It is not autofilled or submitted by the helper.
3. The learner submits through the existing main conversion action. Its upstream classifier decides correctness, and its existing wrong-answer recovery remains distinct from the multiplier helper's recovery. Help never displays `16/24` or a completed converted bar before acceptance.

For `1/4 → ?/24` on the other operand, the same interaction is `4 × ? = 24`, then the cue `Use 6 for the top and bottom. Find 1 × 6 in the fraction below.` Neither the result fraction nor converted bar is revealed by help. The relationship is: each original part is split into the same number of equal smaller parts, so the amount stays the same. A compact equation is preferred to a second unit-part drawing because the task already presents its visual transformation and an added model could duplicate the active representation or expose the conversion. This avoids asking the learner to calculate the numerator twice.

Use current source form, target denominator and exact scale factor from the validated projected task. Do not use canonical-number copy or calculate mathematical truth in either renderer. The proposed local state/check logic belongs in a pure interaction helper module; presentation receives only its current prompt, field state and recovery. The existing schedule, support configuration and definition identity remain fixed. The exact generic-help provenance mechanism is unresolved as noted below.

## State, focus, reset and provenance contract

Keep the helper substep and its drafts app-local and transient, excluded from the episode replay envelope. The state must follow the current transform side and clear when the task side/beat changes, on retry/return, or on a fresh episode. Closing and reopening resumes the current substep. Switching visual/linear view preserves the helper response and the unsubmitted main conversion draft.

Opening focuses the multiplier response; after a correct multiplier, focus returns to the existing conversion response so the learner enters the numerator there once; closing restores focus to the toggle. Preserve the existing conversion response and recovery behavior. A requested helper remains visibly closable after a wrong main answer; its open label, `aria-expanded`, `aria-controls` and cue stay synchronized as in the Plan 24 repair.

Record the help request as assisted work using the accepted help/provenance contract, and keep the existing main conversion response as the only meaning-bearing conversion action. Do not assign a new evidence category or call this independent transfer. Do not silently change frozen support or task schedule.

## Load-bearing provenance question sent to the orchestrator

The generic `request-help` reducer action can eventually set demonstration support for a later response. I recommended a narrowly bounded way to record requested transform help as assisted without classifying the later conversion as receiving a generic reviewed demonstration. This may need a reducer/action adjustment and a replay/legacy compatibility check; it is not safe to assume it away in app-local code. I asked **FF Orch 12+** to choose whether to authorize that adjustment or accept the existing provenance effect before source work. No answer had arrived when this report was written.

## Falsifying evidence proposed for implementation phase

- Both operands and authored target denominators 12 and 24 use their dynamically derived factors; include a noncanonical fixture.
- Wrong/malformed multiplier produces helper recovery; a wrong numerator uses existing conversion recovery while requested help remains available. Neither reveals the expected numerator.
- The help DOM and copy never expose the final equivalent numerator or fraction before the main accepted conversion; no auto-fill, auto-submit or premature final shading occurs.
- The main conversion remains independently submitted and classified; wrong conversion remains distinguishable from helper recovery.
- Opening/closing, re-opening after a wrong answer, switching views, helper substep advancement and error recovery preserve the exact nonempty main draft and have observed focus destinations.
- Retry, return/re-entry and fresh launch remove stale helper state.
- Help use is recorded as assisted with no false demonstration claim; support configuration, schedule, definition identity and revision-1 replay behavior remain compatible.
- Visual and linear paths, keyboard use, non-drag touch and reduced-motion behavior agree. Capture actual narrow and Chromebook-sized layouts; do not claim physical-device or assistive-technology evidence without testing those environments.

## Proposed source and evidence scope after approval

- `src/interaction/conversion-help.js` — pure local multiplier-step validation/state transitions.
- `src/interaction/scene.js` — only if scene projection needs an explicitly validated helper input; current scene already contains common-unit scale factors.
- `src/interaction/episode.js` and `src/interaction/provenance.js` — only if the orchestrator approves the bounded provenance action/behavior needed to avoid generic demonstration side effects; preserve existing revision/replay compatibility.
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

The reducer's cumulative help-level behavior and its effect on later conversion provenance needs an explicit mechanism decision. Other details in this proposal remain candidates until approved. I am stopped before source implementation, as required by Plan 25 Requirement 0.

**Ready for orchestrator review:** yes.

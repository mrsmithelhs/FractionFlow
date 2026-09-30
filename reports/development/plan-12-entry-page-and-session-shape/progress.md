# Plan 12 Progress Report — Repair 01

Date: 2026-09-30
Repair baseline: `74e7e1b`
Implementation commit: `3553c51`

## Summary and scope

Reconciled the delivered Plan 12 support-selector overlap and completed the bounded evidence repair described in `repair-01.md`. The reviewer gear remains on the entry page and now contains the four registered condition choices only. It no longer exposes a support selector, retains a selected support value, writes support into episode construction, or publishes a `data-support-level` attribute. Episode construction therefore uses the existing default high-support configuration. Condition selection and its upstream transport remain active.

The FractionFlow entry page, single runnable practice registry, fragment launches, return/retry behavior, and Inspection Mode “Done looking” focus target are preserved. No math, content, interaction, Plan 13, packet-status, decision-log, or orchestrator-review records were changed. The only render-layer edits are the existing Done-looking focus handlers in `beat-container.js` and `linear-path.js`.

## Reset-state evidence

Added a harness regression for each reset intention. Each starts a fresh episode and then accumulates all named state before resetting:

1. Reach notice, submit an incorrect unit comparison, and recover.
2. Request help.
3. Submit the correct comparison and establish denominator 12.
4. Submit the first equivalent form, 8/12.
5. Request replay.
6. Enter `9` into the mounted right-side numerator field without submitting it.

The test snapshots the complete initial state from the existing app API and compares it by value after retry, and separately after return plus re-entry. Both equal the complete initial snapshot. It also checks cleared retry/help/replay histories, absence of the established conversion, and removal of the unsubmitted input.

The browser routes `ROUTE-RETRY-RESET-STATE` and `ROUTE-RETURN-REENTER-RESET-STATE` now drive that same sequence through mounted learner controls. They assert the fresh encounter prompt, no recovery or help display, no remaining numeric input, Replay `aria-pressed=false`, and no episode gear. Their captures are compared for identical fresh presentation. The route witnesses use the visual path and default condition; the exact full-state harness checks cover both reset intentions but do not claim an exhaustive linear-path/all-conditions reset matrix.

## Inspection Mode focus scope

“Done looking” remains the only Inspection Mode exit that transfers focus back to reflection choices. Its click dispatch synchronously remounts the choices; both renderers now immediately find and focus the first current choice, with connected-root, visibility, containment, and current-subtree checks in place. This makes the route assertion deterministic while preserving the same focus target and trigger.

The route witnesses use real browser clicks on Replay and “Done looking” in both visual and linear paths. The first choice control is the target; the choice-group container itself is not focused. Ordinary Replay focus remains on the Replay button. No focus transfer was added for help-driven or other Inspection Mode dismissal paths.

Observed `document.activeElement` selectors in the browser:

| Path | Before Replay | During Inspection Mode | After “Done looking” |
|---|---|---|---|
| Visual | `button.fraction-control.matching-choice-btn.control-choice-btn` | `button.fraction-control.app-done-looking-button` | `button.fraction-control.matching-choice-btn.control-choice-btn.inspection-focus-return-target` |
| Linear | `button.fraction-control.control-choice-btn` | `button.fraction-control.app-done-looking-button` | `button.fraction-control.control-choice-btn.inspection-focus-return-target` |

## Matched browser layout evidence

Built the before application from commit `74e7e1b` and compared it with the repaired build in Edge. All captures used reduced motion. The detailed 80-row record includes build, registered condition, path, named state, viewport, document height and width, horizontal-overflow result, question text and bounds, and control bounds. Paired PNGs use matching condition/path/viewport/state filenames. Before and after values match in all 40 pairs; none has horizontal overflow.

At 360×740 and 360×752, each of the four registered conditions was measured on both paths at reflection and after an incorrect reflection choice followed by help (recovery+help). The representative default-condition values are the same at both mobile heights:

| Path and state | Before/after document height | Question bounds (x, y) | Control bounds (x, y) |
|---|---:|---|---|
| Visual, reflection | 1142px | x=63–297, y=441–491 | x=63–297, y=522–810 |
| Visual, recovery+help | 1324px | x=63–297, y=542–592 | x=63–297, y=704–992 |
| Linear, reflection | 964px | x=63–297, y=423–498 | x=63–297, y=532–632 |
| Linear, recovery+help | 1146px | x=63–297, y=524–599 | x=63–297, y=714–814 |

Conditions 1–3 share the same matching-reflection geometry. Condition 4’s premise reflection is shorter; its 360×740 visual heights are 1052px (reflection) and 1234px (recovery+help), and linear heights are 1032px and 1214px. Its corresponding question/control coordinates are recorded for 360×740 and 360×752 in the JSON artifact.

For the default condition at 768×1024 (tablet), document heights are 1024px for both states and both paths. At 1440×900 (desktop), visual heights are 912px (reflection) and 1029px (recovery+help); linear heights are 900px and 925px. Horizontal overflow is false throughout. The long mobile/desktop states require vertical scrolling; no no-scroll promise or reduced participation control sizing was introduced.

Artifacts:

- [80-row measurements](screenshots/repair-01/layout-measurements.json)
- [Before, visual reflection, 360×740](screenshots/repair-01/before-74e7e1b-phase2-bundle-1-visual-360x740-reflection.png) and [after](screenshots/repair-01/after-repair-phase2-bundle-1-visual-360x740-reflection.png)
- [Before, linear recovery+help, 360×752](screenshots/repair-01/before-74e7e1b-phase2-bundle-1-linear-360x752-reflection-help-recovery.png) and [after](screenshots/repair-01/after-repair-phase2-bundle-1-linear-360x752-reflection-help-recovery.png)
- [Before, visual reflection, tablet](screenshots/repair-01/before-74e7e1b-phase2-bundle-1-visual-768x1024-reflection.png) and [after](screenshots/repair-01/after-repair-phase2-bundle-1-visual-768x1024-reflection.png)
- [Before, linear recovery+help, desktop](screenshots/repair-01/before-74e7e1b-phase2-bundle-1-linear-1440x900-reflection-help-recovery.png) and [after](screenshots/repair-01/after-repair-phase2-bundle-1-linear-1440x900-reflection-help-recovery.png)
- [Completed touchscreen journey](screenshots/repair-01/touch-completed.png)

The existing entry/episode rendered-screen acceptance remains owner-gated; the matched measurements establish no repair-induced geometry change, not owner acceptance of the screens.

## Full non-drag touch journey

Completed the entire episode and return at 360×740 with Edge Playwright touchscreen emulation (`hasTouch`, mobile viewport), not a physical device. Tapped Begin, encounter Next, the notice choice, common-denominator choice, both conversion submits, operation submit, resolution control, correct reflection choice, and Return to entry. Numeric responses 8, 3, and 11 were typed after tapping and focusing their respective numeric inputs. No drag gesture was used. The episode reached the resolved `11/12` result and returned to the FractionFlow entry page. The existing keyboard-only evidence remains unchanged.

## Advisor disposition

**Branch A — advisor-capable and warranted; consultation ran** because this repair changes application behavior and rendering focus timing. Evidence was corrected using the repository-root `advisor-capable-providers.json`: its `codex-cli` entry is advisor-capable through a call-site tier override on an existing read-only role; it also says structural read-only cannot be verified for this provider. The callable inventory for this thread includes `collaboration.spawn_agent`, a reviewer role, and model override support.

- Requested model: `gpt-6-astra`, high effort.
- Observed model: the advisor self-identified as “GPT-6” in its final response. The exact Astra variant and requested tier separation could not be independently confirmed.
- Read-only posture: instruction-read-only, depth 1; structural enforcement was not established. The advisor was told not to modify files or spawn children.
- Post-consultation check: `git status --short`, `git diff --name-only`, and `git diff --check` showed only the primary thread’s six scoped code/test files and the repair screenshot directory, with no advisor edits.
- Cost: one delegated review response, approximately one minute; the reviewer ran no commands.

Findings and disposition:

1. **Accepted as a coverage limit:** focus routes prove real mouse clicks on Done looking in both paths, but do not separately prove Enter/Space or touch activation of that focus transition. The requested focus contract was already bounded to the Done-looking control and required a real gesture; the added full-episode touch route did not enter Inspection Mode. No broader focus behavior or gesture-specific focus claim is made.
2. **Accepted as a coverage limit:** reset routes exercise the default condition and visual path, while full API-state tests cover both reset intentions and all named accumulated-state classes. The repair request does not require exhaustive reset witnessing for every path and condition; no such exhaustive claim is made.
3. **Accepted:** the reset DOM captures alone could permit two equally incorrect results, but both browser routes assert the fresh encounter and clear transient UI, and the harness compares the complete app state to its fresh initial snapshot. No additional state-export seam was added.
4. **Accepted:** removing the active support writer at the app boundary is the scoped Plan 13 deferral; condition selection remains and reset equality is preserved. No Plan 13 mechanism or support behavior was activated.

No advisor findings were rejected. The advisor found no blocking issue and recommended acceptance subject to the separate owner screen gate; it did not independently certify the test runs or layout artifacts.

## Validation and handoff

- `npm test` — passed: 22 files, 261 tests.
- `npm run build` — passed with Vite 6.4.3.
- `npm run test:routes` — passed: 27 browser witnesses, 0 failures, including the strengthened resets and visual/linear focus restores.
- `node scripts/dev/plan-status.js lint` — passed: no violations.
- `git diff --check` — passed, including the post-consultation working-tree check.
- Plan preflight `node scripts/dev/plan-status.js check plan-12` returned `BLOCKED` because the packet is already `delivered`. The owner directly authorized Repair 01 against that delivered packet, and the repair note governs this bounded work; status was not changed.

Repair commit: `3553c51` (`fix(plan-12): reconcile scope and reset evidence`). Progress report is committed separately as the final repository action. No push or deployment was made. Plan 12 remains `delivered`; Plan 13 remains untouched. **Ready for delivery re-review: yes.** Owner acceptance of the rendered entry and episode screens remains outstanding.

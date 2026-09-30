# Plan 12 delivery review

- Date: 2026-09-30.
- Reviewed implementation: `0f7c995`; screenshot addition: `c6cb471`; report: `37110f0`.
- Disposition: received as `delivered`; acceptance held for scope reconciliation and validation gaps. Owner rendered-screen acceptance remains outstanding.
- No application source changed in this review. No push or deployment.

## Independently verified

`npm test`: 259 tests in 22 files passed. `npm run build`: passed. `npm run test:routes`: 28 witnesses passed, zero failures. Packet lint and whitespace checks passed.

Reviewed the source diff, reset and focus witnesses, and six implementer screenshots. The entry page offers one runnable registry member; there are no promised future practice controls. The gear is hidden with the entry surface during an episode. Mathematical, content, and instructional modules were not modified.

Additional headless Edge checks used the built static app at 360×740 and Playwright locator clicks. The canonical visual and linear traversal rows reached reflection through mounted controls without dispatch fallback. On both paths, Replay moved focus to Done looking; clicking Done looking returned focus to the first choice, verified by DOM identity against the first choice in the current control subtree, independently of the implementation's marker class.

Fresh document navigation to `#sum-under-one` launched the episode and focused MAIN. Unknown and malformed fragments opened the entry page without an error. A condition selection followed by reload and Begin returned to `phase2-bundle-1`.

A separate mock-DOM probe drove mounted controls through an incorrect equivalent numerator, help, a correct conversion, an unsubmitted numerator `9`, and replay. Before reset the episode was at transform, revision 7, with one help and one replay record. Complete episode state, serialized with a BigInt-aware replacer, matched the initial state after retry, after return, and after re-entry. No reset correctness defect was reproduced. This is harness evidence for exact state, complemented by real browser route evidence; it is not a browser claim about unexposed internal state.

## Required scope reconciliation: support writer overlaps Plan 13

`src/app/app.js` now exposes every `SUPPORT_LABELS` member and passes the selected label into `createEpisode`. Independent browser checks found that medium, low, and independent support all replace the common-denominator choice buttons with numeric entry. This is active instructional behavior, rather than a reserved place for a future selector.

DECISION-030 authorizes the reviewer surface. However, `plan-13-scaffold-fading-made-real.md` assigns that selector and upstream writer to its own scope and requires mechanism confirmation before source work, plus participation evidence at each implemented level. Plan 13 remains draft. The Requirement 0 proposal supplied to this orchestration thread named the reviewer gear but did not describe activating all four support levels. The delivery report's statement of owner approval is not sufficient to identify an explicit adoption of this scope overlap.

Before acceptance, either provide the explicit approval trace and reconcile the packets around the work actually authorized, or defer the active support selector/writer to Plan 13. Do not complete Plan 13, resolve OQ-22, or infer that every dimension fades merely because the label reaches state. This review does not authorize an expanded support milestone.

## Required evidence repairs

1. The two reset routes compare visual `innerHTML` after encounter → notice → reset, plus an encounter prompt. They do not compare episode histories or state. Preserve the successful fuller-state observation with meaningful regression coverage: error, help, replay, established work, and an unsubmitted input, followed by both reset intentions. Keep route witnesses through actual mounted controls and strengthen their observable assertions. Do not add a production state-export seam for testing.
2. The report's 812px episode height is the opening encounter beat, not a whole-episode bound. Independently measured reflection heights were 1142px visual and 964px linear at 360×740, with no horizontal overflow. Capture and measure representative later beats, help/recovery, and supported registered conditions; compare the accepted baseline at matching states and viewport. Include 360×752. Scrolling by itself is not declared a defect; the owner needs sufficient evidence to judge hierarchy and restraint.
3. The touchscreen journey in the report covers Begin, Next, and Return, not completion of the episode. Plan 12 requires a complete non-drag touch route. Supply that evidence, distinguishing browser touch emulation from physical-device observation.
4. The advisor rationale searched the wrong location. The manifest exists at root. Re-establish the implementer thread's disposition against the actual manifest and callable inventory; an honestly justified Branch C remains a compliant outcome.

The report's rendered-state comparison, opening-beat measurement, and manifest-path statements were corrected inline by the orchestrator. These corrections preserve what was actually observed and do not certify the missing evidence.

## Focus nuance: no speculative widening

Real clicks on Replay while inspection is active toggle it off and leave focus on Replay. Need help also exits inspection and leaves focus on the clicked help button. Neither observation dropped focus to BODY. Requirement 6 explicitly preserves ordinary Replay-button focus, so Replay focus is not classified as a new defect. The repair is currently bound to Done looking; its report should name that scope. Do not expand general focus management without resolving the interaction intent. If the contract is intended to cover help-driven inspection dismissal too, that needs a bounded clarification, rather than assuming every ordinary button activation must transfer focus.

## Owner review material

The entry page is restrained and fits the target viewport. The reviewer popover is entirely on that page but covers its title and practice control while open. The episode adds a separate navigation row before the mathematical object and a persistent retry control below it. These are the concrete states for the owner's DECISION-021 criteria 1 and 3 review; this review does not accept them on the owner's behalf.

- Existing screenshots: `screenshots/entry-360.png`, `entry-360-gear-open.png`, `entry-1440.png`, `episode-360.png`, `episode-1440.png`, `episode-360-before.png`.
- Independent full-document reflection captures: `screenshots/review-reflect-visual-360.png` and `screenshots/review-reflect-linear-360.png`.

Next action: use `repair-01.md` for the bounded reconciliation/evidence pass, then delivery re-review and owner rendered-screen disposition. Packet remains delivered; no later packet is initiated.

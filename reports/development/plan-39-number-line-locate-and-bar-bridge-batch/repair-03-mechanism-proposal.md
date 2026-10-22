# Plan 39 Repair 03 mechanism proposal

Date: 2026-10-22

Status: investigation proposal; parent approved its mechanism for bounded implementation on 2026-10-22.

## Mechanism

The placed token already rests with its bottom centre at the selected axis coordinate. Make that visible bottom-centre point the single drag anchor. At pointerdown, measure the anchor's client coordinates and retain the pointer-to-anchor offset. During movement, place the anchor at `pointer − retainedOffset`; this prevents a jump for centre, edge, or near-bottom grips while preserving the token's resting alignment. On release, evaluate that same anchor coordinate.

Use one pure renderer helper for both live preview and release: accept only when anchor x lies within the track frame and anchor y lies within a horizontal band centred on the rendered axis, with at least 22 CSS px above and below (44px total). Inside the band, choose the nearest offered candidate by horizontal distance; exact ties choose the lower visual location, then stable candidate order. The preview is a neutral ring around that candidate's existing point, and release calls the same helper with the release anchor before saving the candidate. A miss clears the ring and preserves the prior pending choice. This keeps eligibility local to the track, uses only projected candidate positions, and cannot inspect the correct answer.

Clear the ring on band exit, pointerup, pointercancel, Escape, lost pointer capture, observed resize, view/remount, reset, and destroy. Gesture cancellation restores the prior token location and choice. Resize cancels rather than completing an in-flight gesture. Track taps, steppers, and radios retain their current semantics; Check remains the only submission action.

The optional cue can use existing renderer lifecycle and CSS: on the first visible Repair 02 visual locate view, add one decorative class to the unplaced token. Animate only a decorative hand/grip cue in place; never animate the fraction or a target. Remove the cue on its one-shot animation end or immediately on any learner interaction. Keep a renderer-local “shown” flag across ordinary updates/view toggles, and do not consume it on a hidden mount. Under reduced motion, show a static small hand/finger grip mark over the unplaced token and remove it on interaction. The cue is `aria-hidden`, adds no paragraph or persistent directions, and does not need configuration, instructional state, replay, or content changes.

## Evidence plan and scoped files

Implementation should remain in `src/render/number-line-locate.js` and `src/app/styles.css`; behavioral tests in `tests/app-plan39-number-line.test.js`; route and browser capture additions in the existing `scripts/dev/plan39-repair02-*` harnesses, with all new outputs isolated under `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/repair03-current/`. Preserve definition revision 2, replay v8, all 98 route/action objects, and all historical evidence; append only bounded current Repair 03 rows/actions.

Browser evidence should cover natural horizontal repositioning after placement, centre and off-centre grips without anchor jump, correct/wrong/nearest-offered and sparse candidate sets, low-location ties, exact ring/drop agreement, horizontal and vertical band boundaries, miss preservation, mouse and browser-emulated touch, explicit Check/no auto-submit, and cleanup on every listed cancel/resize/view/reset lifecycle. Capture standard and reduced-motion cue behavior and prove the cue stops on interaction. Include an ordinary-assertion defect seed that offsets the live ring from the shared release resolver (or deliberately uses the token centre) and requires the witness to fail. Parent's fresh blind browser walkthroughs and one consolidated Sol LOW review remain separate from these implementation receipts. Physical device and assistive-technology behavior remain untested.

No math/content/instruction/replay change is proposed. Existing exact arithmetic and Plan 39 task projections remain the source of truth.

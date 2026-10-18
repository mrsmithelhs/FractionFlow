# Proposed annotated learner flow — subtraction takeaway

**Unbuilt static layout proposal.** See [`annotated-board.html`](annotated-board.html) for stacked fraction notation and the initial, marked, and answer-entry frames. It is not a runtime prototype, screenshot, or measured fit. Plan 15 captures remain evidence for the accepted standalone prototype screens only.

## Example and schedule

Example: `5/8 − 2/8`. Schedule: `encounter → operate → resolve`.

At **encounter**, the question and one action appear. Pressing **Take away** is the first operation action: it marks the subtrahend amount as a single group and advances directly to **operate**. There is no encounter Continue button, separate confirmation, or extra Next acknowledgement. The mark action is not a learner selection of the removed count; the equation already supplies that count. Numerator/denominator fields and Check are disabled until the action has completed.

The grouped transition is discrete and unanimated. It is accepted once. The action control is removed after dispatch, and a repeated or duplicate intent is rejected because encounter is no longer active; it cannot change which parts are marked or be counted as an additional response. Submitted-intent replay contains exactly one mark intent and reconstructs the same static state. It does not preserve unsubmitted text drafts. Reduced motion follows the same path because there is no animation to suppress.

## Annotated states in both views

| State | Visual bar path | Linear path | State and response boundary |
|---|---|---|---|
| Initial encounter | Stacked `5/8 − 2/8`; one full bar split into 8; first five cells show the starting amount, last three are outside it. Question “How much is left?”; action “Take away.” | Same stacked equation, brief unit context “One whole, 8 equal parts,” and the single question “How much is left?” Same action button; do not repeat the source fraction already in the equation. | Source forms and stable whole only. Hide expected result and all answer labels. Action is the first operation action and is the only enabled response. |
| Intermediate transition | On the single action, the two corresponding starting cells change together from filled to diagonal hatch. No per-cell interaction. | A single status update says: “The amount 2/8 is marked as removed from the starting amount.” | Preserve all 8 boundaries and original 5/8 extent. One scene transition; no selection claim. No motion. |
| Final removal / operate | Two of the five starting cells remain hatched; the other three remain visible as unmarked starting parts. Same equation and whole. Enable the fraction fields and Check. | Equation and removal status remain. Answer fields follow in order. | Keep expected numeric result hidden. Unmarked parts can be counted as the task's intended work, but no count/answer text is provided. Field labels are neutral: “Amount left,” “Numerator of amount left,” and “Denominator of amount left.” Denominator `8` is visible in the model but is not imposed as the answer form. |
| Wrong response | Same bar, equation and feedback region. Keep the submitted form in fields and focus numerator for correction. | Same equation and status. Recovery is announced once; focus returns to numerator. | Show “Check the parts left. Try again.” It is distinct from the original question and gives no answer. Do not reset the mark action. |
| Requested help | One local note near fields; visual copy: “Count only the shaded parts without removal marks.” Closing returns focus to Help. | Linear copy: “The second fraction is the amount taken away. Use the starting amount to work out what remains.” Same focus transition. | At both high and medium support, use identical behavior and identical wording within each view. These hints are view-specific equivalents; no support-level difference is justified. Preserve the local draft and actual help-request provenance. |
| Correct response | Replace recovery with “That amount is left.” Preserve equation and model. | Announce that message once, then show completion navigation. | Exact validator accepts equivalent forms. The completed equation displays the learner's submitted accepted form, not a normalized replacement. No raw/simplified equivalence line or second task. |
| Completion | Show the accepted equation result and one Finish or eligible Next control. | Same semantic content and order. | Focus the completion action. Next starts a fresh episode and focuses that item's initial mark action. Re-entry into a new attempt also starts unmarked at that action. Omit a learner-visible Replay control in this first recipe; diagnostic replay of submitted intents remains available in the review/harness path. |

For zero, the initial action and pre-answer states do not display `0/d`, `0/1`, “0 parts left,” or another answer label. In `6/9−6/9`, the grouped action visibly marks all six starting parts while all nine whole partitions remain; the zero is countable from the model as intended work. Only after an exact accepted response does the completed equation show the learner's chosen `0/9`, `0/1` or other accepted zero form. No automatic equivalence is added.

## Linear and interaction parity

The linear path uses the same operation action, timing, answer obligation, help, recovery and completion. Status text says only which source amount has been marked; it does not say how many pieces are left. Keyboard order is equation/question → mark action → numerator → denominator → Check → local feedback/help → completion. The action is a native control usable by keyboard and non-drag touch. After marking, focus moves to numerator. After a wrong response it returns to numerator. Help open/close returns to the help control and then the same draft. On Next or fresh re-entry, focus goes to the new initial mark action, never directly to an answer field that bypasses the modeled action.

## Layout constraints for a future implementation witness

These are target constraints, not fit claims.

- **360 CSS px:** one bar, equation, one action and response stack in normal vertical flow; preserve cell edges, hatch distinction, field labels, and useful touch targets. If the bar cannot express each state faithfully, use the linear route only under an adopted capacity contract; do not shrink cells until marks are ambiguous.
- **School Chromebook:** record actual viewport CSS dimensions and browser zoom. Keep equation/model/action/response visually connected; avoid excessive bar width that separates the marked amount from its labels.
- **Enlarged text or zoom:** wrapping is allowed. No fixed-height panel may clip the bar, labels, response, feedback, or focus target. Stacked fractions keep numerator/denominator visible and intrinsically sized.
- **Paint and hit testing:** assert computed visibility and bounds for every boundary and marked cell; test contrast of removed hatch against filled and outside-start cells; sample mark/control hit targets. Retaining a parent box while clipping the actual bar is a failure. On zero, assert the whole grid remains and all starting cells carry the removed mark.
- A later browser packet must save route-specific evidence for initial, marked, wrong, help, correct and completion states. No physical Chromebook, screen-reader, assistive technology or learner-behavior claim follows from this board or browser emulation.

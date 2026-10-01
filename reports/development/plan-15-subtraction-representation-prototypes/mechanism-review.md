# Plan 15 Requirement 0 mechanism review

- Date: 2026-10-01.
- Decision: approved with the binding clarifications below. This clears the source mechanism gate; rendered-screen acceptance remains owner-gated, and neither representation is preferred.
- Preflight independently returned RUNNABLE.
- Reviewed the attached proposal against the packet, exact-math API, prototype register, participation constraints, observation handling rules, and existing build/route infrastructure. A delegated read-only review covered the build and route integration.
- No source files were changed and no tests were run during this gate review.

## Standalone build and routes

Use `prototypes/subtraction/` with its own HTML, JavaScript, CSS, and Vite target, output under `dist/prototypes/subtraction/`. No episode, app, or learner-renderer changes or imports. The learner entry and bundle graph remain separate.

The existing learner build clears `dist`. Make the complete `npm run build` recipe build the learner first and the prototype second; the prototype target may clear only its own output subtree. A complete build must leave both surfaces available. Keep the asset base consistent with the deployed subpath or use a deliberate relative base. The local static runner does not resolve nested directory indexes, so its prototype navigation must name `prototypes/subtraction/index.html` explicitly, with the mode parameter.

Add a bounded starting-surface mapping with explicit readiness selectors for the two surfaces. Preserve the existing learner entry behavior and reject unknown surface IDs instead of silently navigating to the learner app.

Keep all 27 existing route rows and assertions unchanged in meaning. Add exactly two declarative prototype rows with standard and reduced motion expanded into four executions: 29 rows, 31 browser executions in the complete run. Existing scalar motion declarations still execute once. Check the new mode declarations explicitly rather than silently treating unknown values as standard motion.

Key captures by route and motion mode; compare reciprocal prototype negative controls within the same motion mode. A missing required counterpart must fail clearly or be executed automatically, including filtered runs. The negative control must detect identical operation representations, not merely different titles or mode labels. Add focused route-contract/runner verification for this bounded extension, retaining the existing learner-route checks.

## Math and operation state

Use the existing `src/math/fraction.js` functions named in the proposal. `leastCommonDenominator` takes operand denominators, not fraction objects. Obtain renamed forms through `convertToDenominator`, the expected difference through `subtractFractions`, and the displayed-unit difference through `subtractAtCommonDenominator`; compare with `areEquivalent`. Do not calculate fraction answers or renaming with prototype arithmetic. Numeric segment indexing and removal progress are presentation state.

Parse entered numerator/denominator through the existing exact fraction constructor, accepting equivalent forms. Invalid input must produce the same plain retry feedback without crashing or resetting the operation. Keep state local to the current surface; do not add storage, analytics, or learner logging.

Approve the four fixed synthetic fixtures: `4/7 - 1/7`, `5/6 - 1/3`, `3/4 - 1/3`, and `5/8 - 1/2`. Present original forms and the correctly renamed operation when needed. Renaming is supplied in this prototype, not a new learner task.

Takeaway uses one discrete removal control, once per common-unit part in the subtrahend, retaining each removal mark. Comparison uses aligned bars and one gap-reveal control. Segments stay display-only. Both retain independent numeric answer entry, plain correct/retry feedback, and inspectable endpoints. No automatic advancement. Reset all fixture-specific input, feedback, and operation marks on fixture changes; retries preserve the current operation.

Neither visible text nor accessible descriptions/announcements may supply the numeric difference before the learner submits it. Accessible state must still communicate the operands and the action taken; do not remove participation or substitute an answer-revealing hidden explanation. Equivalent successful answers remain accepted without requiring a simplification task. Keyboard, touch, and reduced-motion use need browser evidence with real gestures.

## Draft SUB-01 disposition

The proposed entry is approved as a draft disqualification instrument. The implementer includes its full register-shaped entry in the progress report; the orchestrator records it in the register at delivery. This does not select a subtraction representation or answer OQ-25.

- Live rivals: takeaway removal and aligned-quantity comparison with a revealed gap.
- Falsification observations: inability to connect removed parts to the subtrahend or identify what remains; inability to explain the gap or confusion with addition. Isolated hesitation is an observation to inspect, not an automatic disqualification.
- Manipulated: representation and its corresponding operation action. State explicitly that repeated removals versus one gap reveal differ in required action count.
- Held constant: fixtures, exact results, original/renamed equations, whole and segment widths, answer input, shared instructions, feedback, target sizing, and response opportunity. Representation-specific action labels may differ and must be recorded as part of the manipulation, rather than claimed identical.
- Observe: hesitation/rereading, control comprehension, explanation of removal/gap meaning, and individual access/retry burdens. Record representation order and prior fixture exposure; alternate order where practical because the second attempt can benefit from already knowing the answer.
- Conclusion rule: report design problems and follow-up questions; no preference or efficacy conclusion. Timing and click count alone cannot favor a representation, especially given the deliberate difference in action count. High-school feedback is not target-age child-usability evidence.

## Layout, motion, and delivery

Approve the proposed 16px gutters and shared 328px whole width at a 360px viewport, responsive to smaller available space. Whole/part widths must agree across quantities and both representations for each denominator. The 580px/640px budgets are planning estimates only. Measure actual tallest rendered states, including feedback and navigation, at both 360x740 and 360x752; report document bounds, overflow, and control/question visibility. Do not claim fit from component sums.

Standard motion may use the proposed short learner-triggered transition, with the same persistent marked endpoint as reduced motion. Reduced motion must suppress transitions while retaining meaningful static and semantic state. Keep the two representations neutral in code, copy, screenshots, and the report.

Provide the one-page behavior-focused observation guide with the section 52 permission, de-identification, and public-repository handling rules. No real observations are authorized or claimed by this build approval. Deliver browser screenshots/measurements for all fixture kinds and a separately identified keyboard/touch participation check; the two like-denominator route witnesses alone do not prove the other three fixtures.

Run the full unit suite, complete build, full route matrix, packet lint, and diff check; report advisor disposition. Commit scoped implementation and commit the progress report last. No status mutation, push, or deployment. Stop if a packet boundary or exact-math change becomes necessary.

The owner's working-tree changes were inspected: Plan 15 draft to in-progress, removal of null terminal metadata, and the generated index row. They belong to this packet and are retained in this orchestration commit.

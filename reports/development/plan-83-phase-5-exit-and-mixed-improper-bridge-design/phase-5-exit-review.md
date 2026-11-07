# Phase 5 exit review

**Baseline:** `6b1f985f4d2f0b71bf234bab5f64b905aadffee9`. Scope approved by FF Orch 12+; this is a report-only recommendation, not owner acceptance. Evidence is accepted local slices and their recorded mounted observations, not a new browser or learner study. The examined source files are unchanged relative to the pinned baseline.

## What learners decide

- [Plan 53](../plan-53-two-whole-number-line-location/owner-acceptance.md): place a supplied fraction on [0,2] and Check. The accepted point is accompanied by equal whole bars and whole/remainder counts. It includes 10/8, but does not ask for a mixed numeral. See `src/render/plan53-two-whole-location.js`.
- [Plan 58](../plan-58-whole-plus-fraction-construction/owner-acceptance.md): given an improper fraction such as 5/4 or 6/4, enter whole and remaining piece counts and Check. The app supplies mixed notation after acceptance. This is a real learner-owned improper-to-organized-wholes decision and app-demonstrated notation link, not a supplied mixed-to-improper choice. See `src/render/plan58-whole-plus-fraction.js` and `src/interaction/plan58-whole-plus-fraction-episode.js`.
- [Plan 72](../plan-72-mixed-number-addition-without-regrouping/owner-acceptance.md): decide whole and fractional-piece counts in a sum, checked together. Four authored problems, including eighths, preserve the source denominator.
- [Plan 74](../plan-74-mixed-number-addition-with-regrouping/owner-acceptance.md): decide the two counts of an organized sum. The settled equal-width eighths explain a new whole; the learner is not asked to select an improper equivalent. Two eighths problems.
- [Plan 78](../plan-78-mixed-number-subtraction-without-decomposition/owner-acceptance.md): decide whole and eighth counts remaining, with one final Check. Four eighths problems; settled equal-scale models account for removal and remainder.
- [Plan 82](../plan-82-mixed-number-subtraction-with-decomposition/owner-acceptance.md): decide final whole and eighth counts, optionally first enter and check the number of eighths after renaming one whole. For example, 3 2/8 becomes 2 wholes and 10 eighths. This is a learner-owned renaming decision when help is used, and an app-demonstrated exchange on direct completion; it is not choosing a single improper fraction equivalent to the supplied mixed number. Four eighths problems.

The prompt and controls were checked against the corresponding `src/render/plan72-mixed-addition.js`, `plan74-mixed-addition.js`, `plan78-mixed-subtraction.js` and `plan82-mixed-subtraction.js`; acceptance and mounted limits are in the linked records. [Plan 56](../plan-56-task-specific-support-and-independence-design/owner-acceptance.md) adopts a support interpretation contract, not evidence that a learner independently understood a task.

## Roadmap §44 criteria

| Criterion | Classification | Evidence and limit |
|---|---|---|
| Whole boundaries visually stable | Supported within admitted slice | Plan 53 accepted [0,2] placement and equal whole bars, including boundaries and eighths; recorded 360px/200% spacing is 8.375px. This does not establish physical touch usability. |
| Composition understandable | Partially supported | Plan 74's settled eighths trace pieces into a whole, making the relationship inspectable; Plan 58 asks learners to organize pieces. Neither is evidence that learners actually understand it. |
| Decomposition understandable | Partially supported | Plan 82's optional checked renaming and settled exchange make the relationship inspectable, including 11 eighths; no learner-understanding study is evidenced. |
| Improper and mixed forms preserve numerical identity | Partially supported | `src/math/mixed-number.js` converts exactly; Plan 58 connects improper input, learner counts and app-supplied notation. The reverse supplied-mixed to selected-improper decision and an explicit shared-point line are not established by these journeys. Exact identity, app explanation and learner decision are distinct claims. |
| Bars and number lines coherent | Partially supported | Plan 53 links line placement and equal-unit bars; Plans 58, 74, 78 and 82 use whole/piece bars. The reviewed mixed-arithmetic slices do not demonstrate a mixed/improper shared-point number-line bridge; coherence is bounded to the accepted representations and tasks. |
| Regrouping builds on equivalence, not a trick | Partially supported | Plan 74 visibly composes eighths; Plan 82 optionally checks a renaming and shows exchange while preserving total. These make equivalence intelligible, but neither the representation nor correct answers demonstrate actual learner understanding. |

Accepted reviews retain limits including simulated rather than physical-device input, untested actual assistive-technology speech and learner outcomes; Plan 74's full browser matrix was not completed and Plan 78/82 full-suite records include the recurring dev-console timeout. Check individual acceptance records for exact attribution. No new mounted, device, AT, learner or deployment evidence is claimed.

## Recommendation and OQ-24

Recommend **Phase 5 partially supported within its accepted slices; keep full exit open** pending owner disposition of the learner-owned mixed-to-improper gap and what evidence is sufficient for the understanding-oriented criteria. The proposed bridge is a narrowly scoped candidate, not a prerequisite already decided by the owner, and technical delivery alone would not establish understanding. See [bridge design](bridge-design.md).

Proposed replacement OQ-24 disposition for orchestration/owner consideration: “A bounded mixed-number instructional approach now exists: learners locate improper fractions on a two-whole line, organize an improper amount into wholes and pieces, and practice mixed addition and subtraction with visual composition and optional checked renaming. Exact arithmetic preserves identity, and accepted app explanations connect representations within their slices. A learner-owned choice of an improper equivalent for a supplied mixed number, linked to a shared number-line point, remains a proposed bridge; learner understanding and broader transfer have not been established. The owner must decide Phase 5 exit and whether to adopt and evaluate that bridge.” Canonical wording and status are unchanged.

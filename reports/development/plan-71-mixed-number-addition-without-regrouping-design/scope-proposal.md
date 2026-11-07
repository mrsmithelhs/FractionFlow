# Plan 71 — Requirement 0 scope proposal

Date: 2026-11-06  
Committed source baseline: `6ce31af06f602e745ff7547fce772d88ccaf71de`  
Status: proposed; awaiting FF Orch 12+ scope approval before dossier work.

## Investigation question and boundary

Recommend one short task in which the learner adds two mixed numbers, keeping whole units and same-denominator fractional parts meaningful, with the fractional sum strictly less than one. This differs from Plan 58: there the learner organizes a single supplied quantity into whole and remaining units; here the learner must determine a sum of two quantities. Roadmap sections 39–41 place this before composition. Do not assume a teaching benefit from that ordering has been measured.

After approval, inspect the accepted Plan 54 task design and Plan 58 implementation and evidence at the pinned commit, the adopted Plan 56 support contract, relevant founding and presentation contracts, and the current exact math, task/response, notation, help, session eligibility and record-admission owners. Separate historical acceptance from present source and future proposals. Use the existing same-scale whole-plus-fraction representation where it supports the new task, without treating reuse as proof of instructional or accessible equivalence.

## Proposed dossier work

- Compare at most two compact response designs: direct entry of sum whole and fractional counts with an honest draft model, and a small staged grouping-and-sum interaction. Recommend one based on learner-owned decisions, understandable correction, access and bounded implementation; do not prototype or claim a measured teaching winner.
- Specify the prompt and stacked mixed notation, what is supplied and withheld before Check, learner decisions, blank/invalid and wrong responses, revision, completion, and optional help that supports the decision without revealing the answer. Show a correct journey and a wrong-then-help-and-revise journey. Describe a visual path and a linear, non-drag equivalent with the same mathematical decisions and information. Apply Plan 56's distinction between configuration, requested help, assistance history and claims of independence.
- Propose a small authored first batch of mixed operands with matching denominators and fractional sums below one. Explain each variation, preserve authored forms and use the actual exact arithmetic APIs to verify each operand and sum in report-local reproducible evidence. Inspect API behavior before asserting what it supports; distinguish exact value from displayed form and simplification. Candidate values and a final batch belong in the dossier after approval.
- Review existing Plan 58 narrow, large-text and Chromebook evidence for transferable risks, including equal unit scale, maximum draft, stacked notation, reachability and overflow. Identify what a future implementation must render and verify; historical screenshots are not evidence for a new design, real devices, assistive-technology speech or learner outcomes.
- Identify a bounded future source slice, relevant ownership and replay/compatibility questions, and explicit session eligibility and local record coverage decisions. Neither session inclusion nor new record coverage is authorized by this design. State owner choices and falsification checks for answer leakage, mismatched visual/linear decisions, incorrect arithmetic or form handling, lost assistance, and hidden or clipped quantity.

## Evidence limits and gates

Start with repository evidence. If a decision-changing instructional question remains unresolved, propose a targeted search of at most three relevant primary studies or authoritative guides, with population and transfer limits; stop at that cap or once the question is answered. No broad survey, runtime prototype, learner study, product/source/test changes, automatic scheduling, storage or new record coverage. Regrouping, mixed subtraction and implementation need separate decisions. No browser/build/full suite is proposed for this report-only checkpoint.

After scope approval only, produce `task-design.md`, report-local exact-arithmetic evidence, and final `progress.md`; run the exact evidence, resolve load-bearing links, packet lint and scoped diff checks. Stop for any load-bearing owner choice or required scope expansion. The owner must adopt the task and bounded first slice before any source implementation; orchestration owns packet status and acceptance. No push or deployment. Coordinate an exclusive Git window with FF Orch 12+; stage only this report folder and commit progress last. Advisor consultation is not warranted for this prose-only design.

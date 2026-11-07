# Plan 73 — Requirement 0 scope proposal

**Status:** Proposed for FF Orch 12+ approval; no dossier has been drafted. This is an investigation proposal, not an adopted instructional design.

## Baseline and boundary

Packet preflight `node scripts/dev/plan-status.js check 73` returned `RUNNABLE`. The committed source baseline is `a0bae8d1d93509786347a02fc7b01232d378d894` (`docs: start Plan 73 regrouping design`). The working tree contained three unrelated, untracked Plan 39 route-run evidence files at preflight; they are outside this scope. Recheck the source baseline and working tree at the approved investigation and Git handoffs; identify any relevant drift before relying on it.

Own only `reports/development/plan-73-mixed-number-addition-with-regrouping-design/`. This work is report-only: no runtime, scheduler, record, packet-status, or acceptance changes. Unlike denominators, mixed subtraction, learner studies, and implementation require separate scope. Advisor consultation is not warranted for this prose-only design investigation.

## Proposed investigation

Compare the same final-response task and the same available aids against one brief learner-controlled exchange followed by a final response. Walk each from prompt through checking, feedback, revision, and acceptance for both packet examples: `1 3/8 + 2 5/8` (exactly one new whole, zero remainder) and `1 5/8 + 2 6/8` (one new whole, three eighths remain). Bound the proposed first slice to positive mixed operands with proper fractional parts, equal denominators within each problem, and exactly one newly composed whole. Check a below-one fractional-sum boundary to prevent offering an invalid exchange, as well as the exact-one and above-one cases.

Use the existing exact math core to produce reproducible report-local arithmetic evidence for the examples and boundary. Distinguish total value from required organization: consider explicit zero versus blank, whole-only accepted notation for zero, source-denominator notation for a nonzero remainder, a correctly valued but ungrouped response, and an unequal sum. Describe what can be revised, and optional help that preserves the learner's final-count decisions.

Evaluate each design on mathematical responsibility and observable evidence, answer leakage, recovery, accessibility, and interaction cost. Specify the quantities available before the exchange, the learner's actual decision, the accounting for the remaining pieces and the relation to the final response. Compare whether the extra action contributes enough evidence or learning opportunity to justify its cost; a simple confirmation of a solved example is insufficient. Make a recommendation and a bounded first batch as design judgment, not a claim of demonstrated learner benefit.

For both designs, specify a visual path that retains the same pieces, total quantity, and whole-unit scale, and a linear non-drag path with equivalent information and decisions. Address optional motion and a settled state, concise labels, grouped stacked notation, and before/after or Check states. Review existing narrow and enlarged-text evidence for layout risks and specify a future rendered check at 360 × 740 with normal and 200% root text, covering both outcomes, any exchange, retry/help, and acceptance, including complete quantity summaries where necessary. Existing captures are precedent, not evidence of a future implementation.

The dossier will identify the smallest prospective source slice, help/retry/replay implications, unresolved scheduler eligibility and record coverage questions, and limits of the evidence. It will resolve local links and run packet lint and scoped diff checks. Deliver `task-design.md`, reproducible arithmetic evidence, and a final `progress.md`; coordinate Git with FF Orch 12+, commit scoped work explicitly, and commit progress last. No push is authorized.

## Source and evidence to inspect after approval

- Roadmap §41 in `docs/founding/06-roadmap.md`, the Plan 56 adopted support contract and owner acceptance in `reports/development/plan-56-task-specific-support-and-independence-design/`.
- Plan 58 packet, mechanism, owner acceptance, and relevant narrow/enlarged captures in `reports/development/plan-58-whole-plus-fraction-construction/`; corresponding `src/content/plan58-whole-plus-fraction-task.js`, `src/interaction/plan58-whole-plus-fraction-{episode,scene}.js`, and `src/render/plan58-whole-plus-fraction.js`.
- Plan 72 packet, mechanism, owner acceptance, and evidence including its eighths and denominator-repair captures in `reports/development/plan-72-mixed-number-addition-without-regrouping/`; corresponding `src/content/plan72-mixed-addition-task.js`, `src/interaction/plan72-mixed-addition-{episode,scene}.js`, and `src/render/plan72-mixed-addition.js`.
- `src/math/fraction.js` and `src/math/mixed-number.js`, their relevant tests and existing arithmetic conventions; inspect actual APIs before selecting a reproducible verification method.
- Relevant session, scheduler, record, accessibility and presentation contracts and source discovered during inspection, only as needed to identify the stated future boundaries.

## Stopping rule

Stop here for explicit FF Orch 12+ approval of this scope before drafting the dossier or arithmetic evidence. If inspection after approval exposes a load-bearing owner decision, incompatible baseline drift, or work outside this report-only boundary, record the issue and return to orchestration rather than assume authorization. Delivery review, owner adoption, packet status, and any future implementation remain separate gates.

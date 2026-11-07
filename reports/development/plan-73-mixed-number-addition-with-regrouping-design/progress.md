# Plan 73 progress — 2026-11-06

**Ready for orchestration delivery review: yes.** Report-only design delivered for review, not owner adoption, packet completion, implementation, or learner validation. FF Orch 12+ approved Requirement 0 and granted the scoped Git window against baseline `a0bae8d1d93509786347a02fc7b01232d378d894`. The recommendation is one final response and the packet's two eighths examples as a proposed first batch; the dossier compares an explicit exchange and identifies what evidence could justify its cost. Scope proposal checkpoint: `2e343bb`; dossier and evidence checkpoint: `552922e48e4c7092e601550848f573c844ea5ab9`.

**Review repair:** FF Orch 12+ identified that the original Candidate B exceeded the requested brief action. Revised dossier `e02282c` replaces the pooled-count check, individual piece toggles and separate remainder entry with a single exchange-count entry and Make a whole action, followed by the shared final response. The app groups existing pieces; the settled model can reveal final counts. Both remainder journeys, equal linear access, retry, undo and the comparison were updated; the recommendation remains A, without an efficacy claim. The exact evidence was unchanged and reran successfully; packet lint and `git diff --check` passed. This updated progress report is committed last in the repair window.

## Artifacts and verification

- `scope-proposal.md`: comparison, examples, inputs and stopping boundary.
- `task-design.md`: both designs and both outcomes, unit-preserving visual and equivalent linear paths, zero/blank and error distinctions, help, retry, future layout checks, and scheduler/record questions.
- `exact-evidence.mjs`: report-local executable exact-core checks. `node reports/development/plan-73-mixed-number-addition-with-regrouping-design/exact-evidence.mjs` passed for 8/8 → one whole and zero eighths, 11/8 → one whole and three eighths, and below-one 7/8 with exchange unavailable; it also checks equivalent ungrouped amounts and unequal witnesses. These assertions do not test a UI or establish learner outcomes.
- `node scripts/dev/plan-status.js check 73`: RUNNABLE at dispatch. `node scripts/dev/plan-status.js lint`: OK. Dossier's four relative links were checked with `Test-Path`, all true. `git diff --check` and staged diff check reported no whitespace errors; scoped staged paths and status were inspected. No runtime or browser tests were run for this paper design.

Three unrelated untracked Plan 39 route-run JSON files were present before work and remain untouched. Git metadata writes were denied by the sandbox; the lock was absent and the refresh probe also failed, so scoped staging and local commits used approved elevation. No push. Advisor consultation not warranted: report-only design and its arithmetic evidence have no product behavioral change; the owner specified no advisor. No advisor ran.

## Limits and handoff

The visual and linear journeys are specifications, not rendered evidence; existing Plan 58/72 captures are precedent only. Learner strategy, transfer, actual assistive-technology speech, physical devices, actual zoom and effectiveness are unverified. The proposed exchange interface and error/replay rules require a separately approved implementation and validation. Orchestration reviews this delivery; the owner separately decides adoption and first batch, and any scheduler admission or record expansion needs its own scope. Packet status and acceptance remain orchestration/owner responsibilities.

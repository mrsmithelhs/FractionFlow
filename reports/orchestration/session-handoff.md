# Session Handoff — Orchestration State

Living pointer document (see `docs/agent-starting-prompts/orchestrator-prompt.md` § "Session Handoff File").
Orchestrator-owned; update in place before thread boundaries. Anchor dates, never countdowns.
First revision: 2026-09-18.

## Live State (as of 2026-09-19)

Authoritative packet status is always `node scripts/dev/plan-status.js list` and the generated
index in `docs/development/README.md` — trust those over this file. As of 2026-09-19:

- `plan-01` (toolchain/deployment spike): **complete**. Implementer commits `038626c`, `6f05baf`;
  initial delivered status commit `128c066`. On 2026-09-18 the owner-provided browser observation
  and an independent HTTPS request both confirmed `https://mrsmithelhs.github.io/FractionFlow/`
  returns the expected static smoke page. The working tree was clean; `npm test`, `npm run build`,
  and `node scripts/dev/plan-status.js lint` also passed. `DECISION-001` and the status close-out
  commit record the deployment decision and terminal resolution.
- `plan-02` (exact-arithmetic mathematical core): **complete** after final review. It delivered
  exact BigInt primitives, classifications, validators, response patterns, synthetic golden
  fixtures, D-17 diversity evidence, and two bounded repairs. See
  `reports/development/plan-02-exact-arithmetic-mathematical-core/final-review.md`.
- `plan-03` (content contracts and deterministic generation): **complete** after final review.
  It delivered exact immutable problem instances, eight structural selectors, overlays, honest
  provenance, synthetic fixtures, deterministic selection, and reproducible finite-space bulk
  audit. Repair 01 closed validator completeness and seed-selection bias. See
  `reports/development/plan-03-content-contracts-and-deterministic-generation/final-review.md`.
- `plan-04` (first-slice design dossier): **complete**. Owner accepted the dossier on 2026-09-19;
  closed at `44c5874`. Implementer commits `0171d97` (dossier) and `6e78271` (progress report);
  orchestrator review and Tier-1 corrections at `9db7719`. Advisor disposition was Branch B, so no
  reflection note was authored. See
  `reports/development/plan-04-first-vertical-slice-design-preparation/review.md` for what was
  verified against repository truth, the three inline corrections, and the four items the Phase 2
  implementation packet must carry.
- All first-wave packets were revised per Codex review (commit `ef45aa2`); the wave was
  originally drafted at `94df306`.

## Close-out Note (plan-01)

The former owner publish gate is satisfied: `origin/main` is aligned with `main`, and the live
HTTPS smoke page was observed. `DECISION-001` records the deployment mechanism. The Plan 01
advisor-consultation reflection was filed in Bootstrap's shared incoming intake as
`docs/bootstrap-dev/incoming/2026-09-18-fractionflow-plan-01-advisor-reflection.md`; its full
disposition record also remains in the committed Plan 01 progress report.

## What the Owner Actually Chose (chat-only judgments)

- 2026-09-18: Owner directed the first packet be set **directly to `in-progress`** (skipping `ready`)
  — that status write was the assignment signal; no separate initiation prompt was needed.
- 2026-09-18: Owner asked the orchestrator to close a verified packet and advance the next packet
  when it needs no further owner decision before starting. Plan 02 was reviewed, passed its
  `ready` preflight, and moved to `in-progress`; its own mechanism-confirmation and milestone
  gates remain in force.
- 2026-09-18: Owner routed the Codex packet-wave review (`F1`–`F8`) into the packets and then
  assigned plan-01. All eight findings are addressed in commit `ef45aa2`; see the review file for text.
- 2026-09-18: **Orchestrator call, owner may veto** — Codex F5 suggested splitting plan-02 into
  02a/02b. Owner gave no split instruction, so plan-02 stayed unified with an Internal Milestone
  Gate (primitives+invariants reported and reviewed before classification/step-validation code).
  If the owner prefers the split, rework the board while packets are still cheap to renumber.
- Deployment mechanism (GitHub Actions) was the implementer's decision under plan-01 authority,
  ratified by the orchestrator — not an owner decision. The owner gate that remains is publish only.
- 2026-09-18: Owner approved the Plan 03 mechanism bundle: operation-specific structural
  selectors plus explicit overlays, a common exact contract with generated/curated provenance,
  and bulk reports that distinguish sampled draws from unique finite-space coverage.

## Standing Cautions (expensive rediscoveries avoided)

- ~~`reports/orchestration/founding-docs-review/initial-packet-wave-review-codex.md` is deliberately
  uncommitted and untracked.~~ **Corrected 2026-09-19:** it is tracked and committed — the owner
  committed it themselves at `2445c47` on 2026-09-18. The original caution was written from the
  pre-commit state and is no longer true. It remains an owner/Codex artifact: do not edit it.
- Never hand-edit the packet table between the `plan-index` markers in `docs/development/README.md`;
  run `render`. Lint runs atomically with `set` and refuses bad writes.
- Status verbs (`delivered`, `complete`, `superseded`, `parked`) are orchestrator/owner-only.
  Implementers report and stop; "ready for orchestrator review: yes/no" is a handoff statement.
- `npm`/`node` are not on Git Bash PATH in this environment; use
  `export PATH="/c/Program Files/nodejs:$PATH"` (node v26.7.0 present as of 2026-09-18).
- plan-02's mechanism-confirmation gate may approve **one** narrowly justified dev dependency
  (then `package.json`/lockfile become write-scope); plan-01 must not pre-install test libraries.
- plan-02 also has the Internal Milestone Gate (see above) — do not let an implementer run both
  milestones as one undifferentiated diff.
- On managed Windows Codex tasks, ordinary source-file edits can succeed while `.git` metadata
  writes fail with `index.lock: Permission denied` and no lock exists. Diagnose read-only first;
  then use narrowly approved elevation for an explicit-path stage/commit only. Never delete the
  absent lock, edit ACLs as a workaround, or treat elevation as push authorization.
- Review-response tier is a practical risk boundary: correct whitespace, obvious typos, and
  other no-test/no-iteration changes inline as Tier 1 work and report them. Return source or
  behavioral repairs that need tests to an implementer; use a durable repair note when the fix
  needs a multi-part handoff.
- Prefer an orchestrator-and-owner conversation when fewer than four owner decisions are
  independent. Use the design-review agent for genuinely interdependent decision clusters, then
  perform a skeptical orchestrator reconciliation to prevent sidequests or incompatible accepted
  decisions from drifting the core product.

## Posture Decisions Recorded 2026-09-19

Four owner decisions landed after plan-04 closed, all in `docs/decision-log.md`. They change how
existing artifacts are read, so a fresh thread should not treat them as background:

- **DECISION-003** — presentation posture (`docs/presentation-posture.md`). Part 1 accessibility:
  motion may be the default, prominence need not be equal, the participation floor is untouched.
  Part 2 learner-facing register: specification vocabulary is never learner-facing vocabulary, the
  research apparatus is never learner-visible, the product never asks a learner to produce research
  artifacts.
- **DECISION-004** — learner-facing text targets grade 2–3, taught mathematical terms exempt,
  enforced by working rules and human review rather than a readability formula.
- **DECISION-005** — efficacy research is a sidequest (`docs/evidence-posture.md`). The evidence
  ladder is small-n and unrandomized, so the plan-04 register is a **disqualification** instrument,
  never a selection one. Its conclusion rule permanently returns "consistent with A and B".
- **DECISION-006** — design conditions must be swappable at runtime in the deployed build, selected
  upstream as episode configuration, recorded in the replay envelope, and kept separate from the
  learner preference surface. Mechanism is open as OQ-16.

**The most consequential downstream effect:** DECISION-005 means the provisional display condition
is in practice the shipped condition. It must be chosen on design grounds, not deferred pending a
study. Any thread that reads the plan-04 register as a plan to *select* a winner is reading it
wrong.

## Carried Forward Into the Phase 2 Implementation Packet

From the Plan 04 review (full text in the review file; these are the items most likely to be
rediscovered expensively):

1. Phase 2 must ship one display/prompt condition even though D-01, D-02, D-05, and CM-01 are
   deliberately undecided. The packet needs an explicit provisional-condition rule — chosen for
   runnability, labeled not-decided, swappable without touching mathematical or instructional
   state — or the choice hardens into a default by inertia.
2. The register's primary outcomes require learner observation, which is owner-gated and may
   never be authorized. State the standing position for that case.
3. Conclusion rules turn on "meaningful regression" in agency and participation-floor access.
   Those are tail events; require worst-case and individual-level reporting, not means.
4. "Uncued transfer" is a primary outcome in every register entry, but no transfer task is
   authored anywhere. Name it before costing the experiments.

## Next Orchestration Move

All four packets are `complete`; the board is empty as of 2026-09-19. The next packet is the
Phase 2 implementation packet, which is the most path-dependent packet the project has faced —
it produces the first learner-facing code and, per `06-roadmap.md` §23, the visual and
interaction reference for every later phase. Do not draft it from the dossier alone; the four
carried-forward items above are exactly what the dossier does not settle.

`docs/open-questions.md` was populated on 2026-09-19 and now carries OQ-01 through OQ-16 with a
scope note. A first design-review session was started and stopped at OQ-01 without recording
anything; it is being restarted fresh rather than resumed, because the four posture decisions above
changed the framing of its first question.

Plan 03 closed on 2026-09-19 after Repair 01 and final independent review. The repair rejects
forged derived state, returns an invalid result for malformed records, and selects directly from
ordered eligible candidates; a 70,000-seed sweep ranged 9,758–10,145 across seven cases.

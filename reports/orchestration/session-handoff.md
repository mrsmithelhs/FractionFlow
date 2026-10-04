# Session Handoff — Orchestration State

Living pointer document (see `docs/agent-starting-prompts/orchestrator-prompt.md` § "Session Handoff File").
Orchestrator-owned; update in place before thread boundaries. Anchor dates, never countdowns.

First revision 2026-09-18. Rewritten 2026-09-19 when the specification phase closed. **Rewritten again
2026-09-29** at an orchestrator change: the prior revision stopped at `plan-09` Repair 01 on
2026-09-20, before Phase 2 closed, and patching it would have left a file describing a phase that no
longer exists.

## Orchestrator change — 2026-09-29

The owner is moving plan orchestration to **Codex** "for a while," from a Claude Code thread that ran
it from `plan-09` Repair 01 through `plan-16`'s drafting. Codex was primary through `plan-08` and
reviewed `plan-10`–`plan-13` adversarially on 2026-09-21
(`reports/orchestration/plans-10-13-codex-review.md`); that review was accepted almost entirely
(`plans-10-13-codex-review-disposition.md`) and is the reason `plan-14` exists.

Plan 12 was accepted by the owner on 2026-09-30 after technical re-review at `9c81538`; see
`reports/development/plan-12-entry-page-and-session-shape/owner-disposition.md`. The owner initiated
Plan 16 on 2026-09-30; its Requirement 0 mechanism is approved with binding clarifications in
`reports/development/plan-16-computed-beat-schedule/mechanism-review.md`.

## Live state (as of 2026-10-04)

Authoritative status is `node scripts/dev/plan-status.js list` and the generated index in
`docs/development/README.md`. Trust those over this file.

| packet | status | note |
|---|---|---|
| `plan-09` | complete | **Phase 2 exit gate satisfied by owner disposition, 2026-09-21**, at `b418e8a`, public URL https://mrsmithelhs.github.io/FractionFlow/ |
| `plan-10` | complete | Phase 3 reach assessment. Headline: **demonstrated reach across exactly one of fourteen** §27/§28 targets |
| `plan-14` | complete | Browser route matrix. 20 routes: 19 pass, 1 known defect. All three enforcement paths re-verified with independent seeds |
| **`plan-12`** | **complete** | Owner accepted current screens for now; Repair 01 technical review at `9c81538`; no deployment authorized |
| `plan-11` | in-progress | Owner initiated at `8d5805f`; mechanism approved 2026-10-04 with persistent track/boundaries, explicit Show-new-parts replay, and static reflect Inspection Mode; see its `mechanism-review.md`; deployed motion acceptance requires separate deployment authorization |
| `plan-15` | complete | Owner accepted both screens 2026-10-02 after technical acceptance at `c0b9143`; SUB-01 remains draft with both alternatives open; no observation or deployment authorized |
| `plan-16` | complete | Accepted after operation-validation repair `fe4f507` and report `5872418`; legacy replay evidence and all 27 unchanged browser routes independently verified; see its `delivery-review.md` |
| `plan-13` | complete | Accepted 2026-10-04; owner screenshots OK with requested premise question applied and recaptured; technical/agency review at `854d3fc`; two dimensions vary, no adaptive policy or deployment |

### Remaining work after Plan 13

1. **`plan-11`** is the remaining drafted packet; refresh it against the current support
   profiles and 39-row/41-execution baseline before its mechanism gate. No automatic advancement
   is authorized.
2. The first Phase 3 **family** packet — multi-whole bar and results crossing one whole
   (DECISION-032) — is **not drafted**. Plan 14 and Plan 16 are now complete; draft against the
   computed schedule and current route matrix when the owner chooses to initiate it.
3. Plan 15's standalone prototypes are accepted for observation preparation. Both subtraction
   representations remain open; actual observation sessions, OQ-25 selection, and deployment
   require their own owner direction.

## Plan 12 closeout and next gate

The owner accepted the current entry and episode screens for now on 2026-09-30, after viewing the
screenshots. The suggested compact navigation row is not a pending repair. The condition-only gear,
single runnable practice registry, exact reset evidence, and Done-looking first-choice focus on both
paths are accepted. The focus known-defect marker is retired; the current matrix has 27 passing routes.

Plan 16's Requirement 0 mechanism is now approved separately after owner initiation: see its
mechanism review for canonical-renaming derivation, unchanged definition constructor shape,
legacy replay oracle/projection, and schedule-position keying. Its unedited matrix baseline is
`51bdec7`, including the accepted entry/session and focus behavior. No later packet is initiated.

## Decisions since the last revision

DECISION-025 through **DECISION-034** are all new since 2026-09-19. The ones a fresh orchestrator must
hold in the foreground:

- **029** — entry page gates the episode; the gear lives there **and nowhere else**; retry and
  return-to-entry are both kept and must discard identical state.
- **030** — the gear also carries reviewer-selected **support level** (amends 019).
- **031** — practice types are URL-addressable **by fragment only**; conditions and support level are
  **never** in a URL.
- **032** — results crossing one whole use a **discrete multi-whole stack**, with four constraints.
  Constraint 3 matters most: nothing may show the result before the learner supplies it. A Gemini mock
  of this design did exactly that, twice.
- **033** — mixed numbers stay out of Phase 3; **a strategy is owed** before Phase 5 (OQ-24).
- **034** — the arc is a schedule computed **once** from the problem, never from learner actions.

Open questions of note: **OQ-23** (try another problem), **OQ-24** (no mixed-number pedagogy exists),
**OQ-25** (subtraction representation — `plan-15` gathers evidence, does not decide).

## What the owner actually chose (chat-only judgments, 2026-09-21 → 2026-09-29)

- Accepted the Phase 2 gate with **n = 0 children**, and with scaffold variability in a named weak
  state (the support ladder had no writer).
- Wants learner surfaces **uncluttered**: no redundant labels, no text restating an image, no
  explanatory chrome. The owner's first `plan-09` review was about exactly this, and it recurred in the
  Candidate 1 mock.
- Wants in-chat handoffs as **quotable blocks**, and wants trivial fixes done by the orchestrator rather
  than round-tripped ("It's one line — do that yourself").
- Deployed `b418e8a` personally and exercised it on Chrome, Edge, and Firefox on one laptop. **Pushing
  to `main` is deploying** — `deploy.yml` fires on push.
- Works with **high school** students. A feedback exercise is drafted at
  `reports/orchestration/student-feedback-questions.md`; its results are secondary-age evidence
  relevant to DECISION-016's repair learner, **not** child-usability evidence for the 8–11 target.
- Folded the focus repair into `plan-12` rather than a `plan-09` Repair 08.

## Standing cautions

- **The label-versus-body caution is not retired.** It was prematurely called "declining" on
  2026-09-20 and withdrawn. Codex's reformulation stands: it **changed shape**, from structural
  overclaim to post-repair verification overclaim. Retirement condition: several independently reviewed
  user-facing packets run against the common route matrix, and the matrix catches a seeded defect.
- **Verify focus, layout, and visibility with a real gesture, not just a real browser.** A
  programmatic `.click()` does not move focus. The Inspection Mode focus defect passed the mock harness
  *and* an orchestrator browser check that used synthetic clicks, and was found only by Playwright. The
  correction is appended to `plan-09`'s `focus-restore-review.md`.
- **Reachability, not existence.** Read `reports/orchestration/phase-2-unreachable-mechanisms.md`
  before planning. The question for any mechanism is what sequence of real actions reaches it.
- **Measure, do not sum.** `plan-10`'s first 360px budget was a component sum that missed 220px of
  existing chrome. Reference viewports are **360×740 and 360×752**.
- **Two implementer threads shared one checkout** on 2026-09-21. Nothing was lost because both staged
  by explicit path, but one described the other's live work as "pre-existing modified files." Parallel
  packets need separate worktrees. The owner has not formally decided this.
- `docs/decision-log.md` is **append-only**. Never hand-edit the packet table; run `render`. Status
  verbs are orchestrator/owner-only.
- Long heredocs have failed repeatedly in this environment. Write files with a file tool, or run a
  script from the scratchpad.
- `npm` and `node` were on PATH throughout the 2026-09-21 → 2026-09-29 sessions. The older note that
  they need `export PATH="/c/Program Files/nodejs:$PATH"` may be environment-specific.
- On managed Windows Codex tasks, `.git` writes can fail with `index.lock: Permission denied` when no
  lock exists. Diagnose read-only first. Never delete an absent lock; never treat elevation as push
  authorization.

## Where the project stands against the roadmap

`reports/orchestration/roadmap-position-2026-09-21.md`. Short version: on track, standing at the §89
checkpoint. The mathematics runs well ahead of the presentation — the content layer can generate
problems crossing one whole, and even Phase 5 decomposition, that no renderer can draw — so from here
every open question is a presentation question. §89's first question, "did learners understand the
visual transformation?", still has no answer.

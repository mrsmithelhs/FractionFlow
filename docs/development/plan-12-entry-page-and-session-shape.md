---
id: plan-12
title: Entry Page and Session Shape
status: draft
depends_on: [plan-09, plan-14]
gate: "Mechanism confirmation before any source work: the implementer proposes, and the owner approves, answers to the five questions OQ-19 leaves open. Then owner review of the entry page and the episode surface on rendered screens against DECISION-021 criteria 1 and 3."
superseded_by: null
resolution: null
summary: >-
  Give the app a front door. Resolve OQ-19: an entry page where the app name and
  the reviewer-only condition switcher live, from which a learner enters the
  episode, and to which the episode returns. Removes the footer-title workaround
  adopted in plan-09 Repair 01, and gives the gear menu somewhere to live that
  does not overlap the work surface. No accounts, no storage, no progress.
---

# Plan 12: Entry Page and Session Shape

## Packet Metadata

- Packet id: `plan-12`
- Packet title: Entry Page and Session Shape
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-21
- Packet type: feature
- Mutation level: user-facing release
- Approval gate: owner-approved OQ-19 mechanism proposal, then owner review on rendered screens
- Depends on: `plan-09` (the shell, the condition registry, and the footer arrangement this replaces); `plan-14` (entry, return, and condition transport are route claims)
- Expected artifacts: `src/app/` changes; entry-page module; OQ-19 resolution recorded; progress report

## Goal

Resolve **OQ-19**. The app currently opens directly into a problem, with the name *FractionFlow* in the
footer and the reviewer-only gear menu floating over the work surface. Both were deliberate
workarounds for a missing entry page, adopted in `plan-09` Repair 01 and recorded as temporary. This
packet gives the app a front door and returns the title to it.

## Non-goals

- **No accounts, no storage, no persistence, no progress** (DECISION-001, DECISION-019). D-07 through
  D-11 remain deferred. Nothing survives a reload.
- **No problem selection UI beyond what the current content supports.** The slice has one episode; the
  entry page is not a course catalogue.
- **No learner preferences.** The gear menu stays reviewer-only and condition-only.
- **No routing library, no client-side router framework.** Static-only.
- **No second episode.**
- **The implementer does not settle OQ-19 by building it.** The five open questions are the owner's;
  this packet routes them through a mechanism gate rather than answering them in code.

## Depends on

`plan-09` complete. The condition registry, the episode shell, and the footer arrangement this packet
rearranges all exist and are owner-accepted.

`plan-14` accepted. "The condition chosen on the entry page is the episode's condition" is precisely
the kind of claim that passed in `plan-09` while every condition rendered identically, and "returning
discards state" is precisely the kind of claim a direct reset call can satisfy without the learner's
route ever being exercised. Both belong in the route matrix.

## Why this packet exists

The footer title was my proposal and the owner accepted it explicitly as a stopgap: *"We might even
have an entry page where the name of the app lives, then move it to the bottom of the page when
working a problem... not asking you to make the implementer invent a landing page now, that's probably
a later plan."* This is that plan.

It also earns its place beyond tidiness. The gear menu currently opens over the episode — visible in
the owner's Phase 2 review screenshots, overlapping the completion message. A reviewer switching
conditions has nowhere to stand that is not the learner's work surface. An entry page gives the
switcher a home, and gives the learner a deliberate act of beginning rather than arriving mid-problem.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-001, 006, 009, 013, 019, 021 especially
- `docs/founding/02-interaction-grammar.md` §71 — the instructional hierarchy
- `docs/open-questions.md` — OQ-19
- `reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-01-review.md` — the
  clutter audit whose conclusions must not be undone

Contracts this packet must preserve:

- **Static-only.** No backend, no accounts, no server state.
- **The switcher is reviewer-only and condition-only** (DECISION-019). Moving it does not make it a
  learner preference, and it must not become one by accident of placement.
- **Condition selection does not persist across reload.**
- **The instructional hierarchy** of §71 holds at every supported width on the episode surface:
  mathematical object, then current question, then response mechanism, then secondary support.
- **The clutter boundary.** `plan-09` Repair 01 removed duplicate prompts, doubled completion
  messages, and 37% of viewport chrome. An entry page must not reintroduce a layer of headings.
- **DECISION-021 criterion 1** — the entry page is subject to the same restraint as the episode.

## Scope

### In scope

- `src/app/` — an entry-page module, the transition into and out of the episode, and the resulting
  rearrangement of the shell.
- The reviewer-only condition switcher's placement and the state it carries into an episode.
- Title placement: on the entry page as the primary identity; on the episode surface wherever the
  hierarchy and the clutter boundary allow, which may be the footer as now or may be nothing at all.
- Tests covering entry, episode, and the return path.

### Out of scope

- `src/math/`, `src/content/`, `src/interaction/`, `src/render/` — no changes. This is composition.
  If the entry page appears to need instructional state, **stop and report**.
- Any persistence mechanism, including `localStorage` and URL parameters carrying learner state.

## Implementation Requirements

### Requirement 0 — The OQ-19 mechanism proposal (gate)

**Propose and stop.** OQ-19 states its open questions explicitly, and they are owner decisions, not
implementation details. Answer each as a proposal with reasoning, and wait for approval before writing
source:

1. **Does an entry page ship at all**, or is there a better resolution of the footer-title workaround?
2. **What does it hold beyond the name?**
3. **Does it gate the episode, or is it merely passed through?** A page the learner must act on and a
   page that appears once and never returns are different products.
4. **How does a learner return to it**, and how does that relate to the existing "Try this problem
   again" control? Two notions of reset is a defect, not a feature.
5. **Does the gear belong there** rather than in the episode footer? OQ-19 pairs this with the
   DECISION-019 question of who the switcher is for once the app is public.

Also propose the **focus contract**: where focus lands after "begin", after a return, and what a
keyboard user's first Tab reaches on each surface. `plan-09` lost focus to `BODY` twice on claims that
had never been observed; this packet states the contract up front instead.

The proposal names what it would cost at 360px. Everything below is conditional on approval.

### Requirement 1 — The entry page

Required behavior:

- The app opens on an entry page carrying the app name, a one-line statement of what the learner will
  do, and a single obvious control to begin.
- The reviewer-only condition switcher is reachable from the entry page, with its plain-language
  labels and its specification codes still in internal data attributes.
- The entry page holds no metrics, no counters, no progress, and no more than one level of heading
  below the app name.

Constraints:

- A learner who begins is in the episode; there is no intermediate configuration step for them.

### Requirement 2 — The return path

Required behavior:

- The episode can return to the entry page, and the return is deliberate rather than accidental.
- Returning discards episode state cleanly — the next entry starts a fresh episode with no residue.
  The existing "Try this problem again" control and this path must not produce two different notions
  of reset.

Constraints:

- No state survives the round trip. Verify by returning mid-episode and re-entering.

### Requirement 3 — Condition selection carried upstream

Required behavior:

- A condition chosen on the entry page is the episode's condition, selected upstream as episode
  configuration (DECISION-006), never as a renderer flag.
- The active condition still appears in the replay envelope.
- Selection does not persist across reload.

### Requirement 4 — The episode surface does not regress

Required behavior:

- The hierarchy of §71 holds at 360px, a tablet width, and 1440px.
- The gear menu no longer overlaps the learner's work surface, or, if it still can, say where and why.
- Vertical budget at 360px is measured before and after against a stated viewport height. The Phase 2
  repairs reclaimed roughly 95px at the bars and moved the title out of the top; a regression here
  undoes accepted work.

### Requirement 5 — Route witnesses

Required behavior:

- Route-matrix rows in `plan-14`'s schema for: **entry → select each registered condition → begin →
  observe that condition's expected route signature**, with the other conditions as negative controls.
  A default condition silently launching regardless of selection must fail.
- A row for **return mid-episode → re-enter → observe fresh state**, driven through the actual entry
  and return controls, not a reset call.
- Browser witness for the focus contract at both transitions.

## Validation Checklist

- [ ] App opens on an entry page; one control begins the episode.
- [ ] Condition switcher reachable from the entry page, reviewer-only, codes internal.
- [ ] Condition selected upstream; appears in the replay envelope; does not persist across reload.
- [ ] Mechanism proposal answering all five OQ-19 questions plus the focus contract, approved before
      source work.
- [ ] Return path exists, discards state, and does not conflict with "Try this problem again."
- [ ] Route-matrix rows for per-condition launch (with negative controls) and for return to re-entry.
- [ ] Focus contract verified in a browser at both transitions.
- [ ] Hierarchy holds at 360px, tablet, and 1440px.
- [ ] 360px vertical budget measured before and after, against a stated viewport height.
- [ ] Entry page has no metrics, counters, or progress, and at most one heading level below the name.
- [ ] Keyboard-only and non-drag touch paths complete entry, episode, and return.
- [ ] No changes to `src/math/`, `src/content/`, `src/interaction/`, or `src/render/`.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at `reports/development/plan-12-entry-page-and-session-shape/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- The entry page appears to require instructional or mathematical state.
- Returning from an episode cannot discard state cleanly without an interaction-layer change.
- The entry page and the clutter boundary appear to be in conflict.
- The gear menu's placement appears to require widening DECISION-019's surface.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- **The implementer may not declare the entry page accepted or the hierarchy satisfied.** Rendered-screen
  judgement is the owner's.
- Layout and focus claims must come from a browser, not the test harness.

## Advisor Consultation

Inherited from `AGENTS.md`. User-facing release; record a full disposition or a named degraded mode.

## Commit and Concurrency Guidance

Stage by explicit path; never `git add -A`. **Never push without explicit owner authorization.**
Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-12-entry-page-and-session-shape/progress.md`

Minimum contents: summary; the entry page's structure and what it deliberately omits; how condition
selection travels upstream; the return path and its state-discard evidence; hierarchy and 360px
measurements before and after; commands; problems; remaining risks; advisor disposition; ready for
orchestrator review yes/no.

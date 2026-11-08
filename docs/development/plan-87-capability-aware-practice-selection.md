---
id: plan-87
title: Capability-Aware Practice Selection
status: delivered
depends_on: [plan-70, plan-85, plan-89]
gate: "Approve measured capability rules, selection and resize behavior before source changes. Owner reviews the rendered practice journeys and separately approves default chooser exposure of expanded pools."
summary: >-
  Draw a short, varied sequence from expanded practice banks without repeats.
  Let standalone and managed practice select only already-admitted items that
  fit the available presentation, with a verified fallback on narrow layouts.
---
# Plan 87 — Capability-Aware Practice Selection

## Packet Metadata

- Packet id: `plan-87`
- Packet title: Capability-Aware Practice Selection
- Status: (see frontmatter)
- Owner/model: Terra-high lead implementer, Luna-medium workers, orchestration mechanism and technical review, owner rendered review
- Date: 2026-11-07
- Packet type: bounded selection and app integration
- Mutation level: candidate eligibility for launch, ordering, progression and verification
- Approval gate: Requirement 0 before source changes

Follow [AGENTS.md](../../AGENTS.md), the [decision log](../decision-log.md) and the [packet board](README.md). Use [Plan 70](plan-70-first-working-practice-scheduler.md) for direct managed-practice entry, [Plan 85](plan-85-cross-recipe-problem-bank-expansion.md) for capacity evidence, and the [Plan 89 exposure ledger](../../reports/development/plan-89-versioned-problem-bank-publication/integrated-review.md#exposure-ledger) for the four registered expanded pools and their held exposure. Read the [larger-denominator follow-up](phase-3-follow-up-obligations.md) before proposing capability rules.

## Requirement 0 — Propose and stop

Run preflight and pin the baseline. Save `mechanism.md` under `reports/development/plan-87-capability-aware-practice-selection/`. Propose a small finite draw length and initial rollout, a reproducible seeded selection rule, a conservative fallback pool, and what gets measured before launch. Include a same-bank narrow/wide example and a resize scenario. Identify exact shared files, legacy routes and replay preservation. Propose an isolated review path for draws from the registered Plan 89 pools. Default chooser exposure of those pools requires separate owner approval. Stop before source work.

The lead may dispatch Luna-medium workers to disjoint investigations, implementation or read-only checks within the current gate. The lead owns shared app and scheduler integration and consolidated review. Children do not fan out. Serialize copied-source and fixture writes, verify their disposable destinations before writing, and run shared build and browser validation serially.

## Selection contract

1. Keep each standalone button a direct launch into its own type. At a fresh visit draw a short sequence without repeats from eligible, published items. Retry keeps the current item, Next uses the sequence, and the practice has a natural end. Preserve managed practice's direct launch and existing type-mix contract while filtering its choices for fit. Preserve explicitly authored fixed review sequences and direct routes under their own existing rules.
2. Base selection on the available CSS space in the working area and relevant text scale or verified layout measurements. Use task- and representation-specific evidence. Avoid device-name, pixel-density or support-level proxies. Wider layouts may reach a larger verified pool. Unknown measurements and narrow or enlarged layouts use a verified conservative pool. Define behavior for undersized and empty pools without repeats or an inaccessible launch.
3. Keep the launched item, exact answer and instructional state stable on resize, zoom or view change. Require a usable in-episode reflow or equivalent participation path for any newly eligible item. Propose how to recheck only unstarted items when space shrinks, with deterministic replacement or early finish if needed. Persist no viewport profile or learner preference. Preserve registered identities and exact replay. Specify what seed, eligibility snapshot or ordered IDs are sufficient to reproduce selection for diagnostics without requiring a viewport for historical episode replay.
4. Capability filtering may narrow what selection offers from already admitted content. Broader bridge bounds or other numerical/representation changes require separately approved evidence and publication. Use a verified subset or isolated fixture when no wider production pool has yet been approved.

## Delivery

- [ ] Prove repeatable draws, pool membership, no repeats, fit fallback, natural finish and preserved retry. Exercise narrow, enlarged, wide and resize journeys, with stable draft, focus, current item, and an accessible fallback.
- [ ] Verify preservation of managed type mix, fixed historical routes and replay. Run focused tests, build, relevant routes, packet lint and scoped diff checks. Commit scoped work and `progress.md` last. Keep difficulty ordering, learner profiling, new content bounds and deployment separate.

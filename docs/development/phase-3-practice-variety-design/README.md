# Phase 3 Practice Variety and Next-Problem Design

## Review status

- **Status:** Proposal for owner and orchestrator review; no policy in this dossier is adopted.
- **Packet:** Plan 21, investigation only.
- **Evidence baseline:** repository `HEAD` `28c317d1f189748336f10f6520c810f2bd6e3732` on 2026-10-09. The working tree was clean before this dossier was created.
- **Current learner reach:** one entry control mapped to one authored fixture and one active episode definition. Several legacy definition revisions remain registered for replay compatibility; those are not additional learner choices. Later addition families remain proposals even where Phase 1 fixtures or generated math candidates exist.
- **Owner gate:** accept the practice-goal mapping, authored-set admission contract, order/exhaustion behavior, and retry/Next/re-entry semantics before a separate implementation packet. This dossier does not close OQ-23.

## Purpose

DECISION-035 and DECISION-040 adopt a small learner-goal organization, a reviewed authored set, and a learner-triggered Next problem. Plan 21 turns that direction into choices that can be accepted or revised. It keeps mathematical validity, content validation, representation capacity, authored instruction, replay reconstruction, and learner-app reach as separate evidence layers.

## Dossier map

| File | Question answered |
|---|---|
| [practice-type-model.md](practice-type-model.md) | Which learner-facing goals could organize the internal families, and how many controls exist now versus under proposed mappings? |
| [content-inventory.md](content-inventory.md) | What current fixtures and bounded generator draws show, and which evidence layers each has reached? |
| [selection-options.md](selection-options.md) | What a fixed authored sequence or later bounded generator draw buys, and what evidence would falsify each claim? |
| [next-problem-contract-proposal.md](next-problem-contract-proposal.md) | How identity, configuration, completion, focus, retry, Next, exhaustion, and re-entry could work. |

## Main findings

1. The existing label **“Add fractions with different denominators”** is truthful for the current runnable item. Do not broaden it until the content and complete route coverage support the larger promise.
2. Internal relationships such as nested and shared-factor denominators do not need separate buttons. Like-denominator and sum-above-one practice may merit targeted learner goals; the choice between that model and one broader addition goal remains for the owner.
3. The Phase 1 fixture registry contains seven addition fixtures, all exact-math/content-valid and fraction-bar eligible on their canonical route. Only the relatively-prime fixture is an admitted learner item with premise/reflection data and a complete accepted route. The other six are candidates, not runnable items. One nested “simplify first” case is excluded from this increment because there is no approved learner simplification task.
4. A reproducible 640-draw synthetic sample had no generator refusals and found repeated draws plus valid candidates with paths rejected by current representation capacity. It demonstrates that valid generation can produce a candidate pool; it does not establish complete authored instruction or learner reach.
5. A Next implementation needs item-level content identity **and** episode-definition identity/revision, applicable condition handling, a genuinely different eligible item, fresh episode state, and a finite exhaustion response. Current source supports one fixture per practice goal, so Plan 26's selection mechanism is a real prerequisite for Plans 18/19 when they need to join an existing goal.

## Explicitly not decided here

No session length or ordering policy, automatic generation activation, adaptation, persistence, tracking, mixed-number practice, family admission, deployment, learner observation, or efficacy claim is authorized. A future subtraction goal requires accepted instructional reach; Plan 15's two standalone prototypes are not a representation selection.

## Candidate first set

The present accepted inventory cannot supply a different Next item: it has one admitted item. The dossier proposes a **conditional** two-item list for owner review in [selection-options.md](selection-options.md): retain the current `2/3 + 1/4` item first, then consider authoring `1/2 + 1/3` as the second same-definition relatively-prime addition item. The second equation has been checked through curated content construction and current path eligibility, but has no registered fixture identity, authored premise/reflection data, episode route, or learner-app witness. It is not admitted by this dossier. If the owner does not want a same-family numeric variant as the first increment, the set must wait for an accepted family and selection mechanism; no existing candidate may be substituted as if it were already authored.

## Owner acceptance requested

Please decide the goal mapping and labels; the smallest authored-set increment; whether the goal sets are disjoint or may share content; the completion point that enables Next; whether reviewer condition/support selections carry over; the stable item used by first entry and re-entry; and the user-facing exhaustion action. The exact proposed contract and bounded follow-on scope are in [next-problem-contract-proposal.md](next-problem-contract-proposal.md).

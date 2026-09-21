# Plan 09 — Owner Gate Checklist

- **Date:** 2026-09-21
- **Prepared by:** orchestration, ahead of the Repair 06 Item 1 landing
- **Purpose:** the ordered list of owner actions that remain on `plan-09` after implementer work ends,
  with an honest statement of which evidence exists and which does not.

Only the owner declares the Phase 2 exit gate satisfied. This document organizes that judgement; it
does not anticipate it.

## 0. Preconditions — orchestrator, before any owner action

- [ ] Repair 06 Item 1 (replay) delivered and accepted; the four conditions in `repair-06-review.md`
      met, not argued around.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] The working tree is at a single named revision the owner can cite.

Until these hold, everything below is premature.

## 1. Deploy authorization — the first owner decision

**This is one decision, not two.** `.github/workflows/deploy.yml` triggers on push to `main`, so
authorizing the deploy *is* authorizing the push. There is no intermediate state where the build is on
the remote but not public.

- [ ] Owner authorizes, in writing, the first push of real application behavior to `main`.
- [ ] The authorization names the revision being pushed.
- [ ] Push executed by the orchestrator, by explicit path, on that authorization only.
- [ ] Deployment run recorded: workflow run id, resulting revision, and the `page_url` output.

Requirement 3's constraint is explicit: *"Confirm with the owner before the first deploy of real
application behavior, and never push without explicit authorization."* No claim about the public URL
may appear anywhere — code, copy, or report — before this step has actually run.

## 2. The public-URL exercise — Requirement 3

Roadmap §16: local success and an asset smoke check are **not** substitutes. The episode must be
driven at the deployed URL, with no backend.

Coverage the exercise must include:

- [ ] A complete episode, encounter through resolve, including the selective reflect.
- [ ] At least one error and its recovery.
- [ ] At least one help request.
- [ ] The alternate valid path (the twenty-fourths route, non-least denominator).
- [ ] The reduced-motion path.
- [ ] Replay exercised at a beat where it changes what is shown — under *New parts only* especially,
      where it is the only route to the before state.
- [ ] All three registered conditions reached through the gear menu.

Evidence must record what was exercised, **in which browser and at which viewport**, and what was not.
The supported-environment matrix names Chrome/Chromium, Safari, Firefox, and Edge; widths 360px
through 1440px, reflowing to 320px. Anything not covered is named as not covered, not quietly omitted.

## 3. The §25 acceptance evidence packet

Assembled by criterion. Current standing as I read it — the owner's judgement, not mine, decides each:

| §25 criterion | Evidence in hand | Tier / n | Standing |
|---|---|---|---|
| Mathematical trust | Exact BigInt core, zero DOM; full test suite | mechanized, comprehensive | Strong |
| Learner agency | Learner chooses the denominator, constructs the equivalent, combines, and answers the premise check | mechanized + adult walkthrough, n=1 | Strong |
| Visual continuity | Bar preserves quantity across renaming; before/after bars mounted at `reflect` | adult walkthrough, n=1 | Sound, with two gaps below |
| Local feedback | Recovery dispatch repaired (Repair 04); correction without reset verified on both routes | mechanized + walkthrough | Strong |
| Scaffold variability | — | none | **At risk. See §3.1.** |
| Accessibility | Mechanized checks and human review recorded separately; untested modes named | mechanized + adult review, n=1 | Sound for the floor; no child evidence |
| Learner evidence | Adult walkthrough only | n=0 children | Must be stated as such, per DECISION-020 / DECISION-022 |
| Aesthetic coherence | DECISION-021 rubric — §4 below | owner review, pending | Pending |

Every claim names its evidence tier and n, per `docs/evidence-posture.md`. Mechanized checks, human
accessibility review, and child-usability evidence stay in separate sections; §44 forbids one standing
in for another.

### 3.1 Scaffold variability — the criterion I would look at hardest

Roadmap §22 asks the slice to prove *"at least an early version of scaffold fading"* — the
architectural ability to fade, not the adaptive rules.

`src/interaction/support.js` builds a four-level ladder. `state.support` is assigned once at
`episode.js:629` with every dimension pinned at `high support`, and nothing ever writes it again.
`src/app/app.js` never passes a label. The registered conditions vary the display treatment (D-01) and
the connection-making form (CM-01); none of them varies support.

So the honest reading is that the *type* exists and the *behavior* does not. Whether that satisfies
"the architectural ability to fade" is exactly the kind of call that belongs to the owner and not to
me. It is recorded in `reports/orchestration/phase-2-unreachable-mechanisms.md` as the first of four
mechanisms no learner reaches. If the owner judges it insufficient, it is a `plan-10` packet, not a
repair.

### 3.2 Two visual-continuity gaps, both recorded

- **OQ-20** — the fraction-bar renderer cannot draw a result crossing one whole. Not reachable in this
  episode's content, so not a defect here; it bounds what the slice demonstrates.
- **Animated subdivision (D-01-A)** — never implemented. Bundle 1 is relabelled *New parts only*, with
  the original wording preserved in a comment for restoration at `plan-10`. The condition axis is
  therefore narrower than its name once implied, and the label now matches the behavior.

## 4. The DECISION-021 rubric, against rendered screens

Applied criterion by criterion, **against screens as rendered**, not against the code. Any single
violation is a blocking failure at this gate.

- [ ] **1 — Restraint against dashboard accumulation.** No competing metrics, counters, progress
      meters, or persistent chrome. The clutter audit and the title-to-footer move addressed this;
      confirm against the current build at 360px, where chrome cost the most.
- [ ] **2 — Language and register clarity.** Grade 2–3, ~12 words per prompt, active voice, concrete
      words, zero specification or research terminology. Check `src/render/strings.js` as rendered —
      including the new milestone forms, *"Common denominator: 12 — the smallest one."*
- [ ] **3 — Child-appropriate touch targets and spacing.** ≥24×24px per SC 2.5.8, with generous
      margins. DECISION-025 decoupled target size from denominator; verify at the highest-LCD route.
- [ ] **4 — Calm pacing and anchored inspection.** Learner-triggered, calm, spatially anchored,
      endpoints inspectable **indefinitely without auto-advancing**. This criterion is why Repair 06
      Condition A removed the proposed 2-second timed return. Verify that no beat advances on a timer
      in any motion mode, replay included.

Two specific screens to look at with a child's eye, both flagged by earlier reviews and neither a
defect:

- At `reflect`, the symbolic row shows `8/12 + 3/12 = 11/12` while the premise asks about `7/12`.
- At `reflect`, the replayed conversion is the right operand (`1/4 = 3/12`) while the premise check
  asks about the left (`2/3` versus `7/12`) — two different comparisons on one screen.

Nobody has watched a child try either. That is the whole of what is unknown about them.

## 5. The dated disposition

The packet may become `complete`, and the Phase 2 exit gate may be declared satisfied, **only** after a
dated owner disposition that names:

- [ ] the reviewed acceptance-evidence artifact;
- [ ] the deployed revision;
- [ ] the public URL.

Status verbs remain the orchestrator's and owner's. The implementer's bounded statement was "ready for
orchestrator review"; mine is verification, not acceptance.

## 6. Carried forward — explicitly not blocking this gate

- Animated subdivision → `plan-10`.
- The support ladder → owner call at §3.1 above.
- **OQ-19** entry page; **OQ-20** bar crossing one whole; **OQ-21** the like-denominator recovery
  string.
- `phase2-bundle-4` (CM-01-P) is registered and working as of Repair 05.
- Child observation is non-blocking under DECISION-020. If any occurs it follows
  `05-quality-and-validation.md` §52 and reports separately under DECISION-022.

## 7. What stays untested, and must be said so

- No child has used this. n=0.
- No conformance claim. Built against WCAG 2.2 AA; conformance is not claimed (reconciliation R4).
- The slice serves the ready subset per finding R3 — a learner who meets the stated prerequisites.
  DECISION-016's repair learner is the product's primary audience and is Phase 3+. The slice must not
  be judged against a learner it was not built for.
- Any browser or viewport the §2 exercise did not reach.

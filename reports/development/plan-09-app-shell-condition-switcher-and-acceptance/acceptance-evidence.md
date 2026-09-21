# Plan 09 — Phase 2 Acceptance Evidence

- **Date:** 2026-09-21
- **Reviewed artifact:** this document, together with `deployed-exercise-record.md` and
  `aesthetic-rubric.md`
- **Deployed revision:** `b418e8a`
- **Public URL:** https://mrsmithelhs.github.io/FractionFlow/
- **Prepared by:** orchestration. **This is evidence, not acceptance.** Only the owner declares the
  Phase 2 exit gate satisfied.

Organized by the eight criteria of `docs/founding/06-roadmap.md` §25. Every claim names its evidence
tier — solo review (tier 1), children known to the owner (tier 2), classroom (tier 3), per
`docs/evidence-posture.md` — and its n. Mechanized checks, human review, and child-usability evidence
are kept separate; §44 forbids one standing in for another.

## Scoping statement (reconciliation finding R3)

This slice targets a learner who meets the episode's stated prerequisites — fractional units, simple
equivalence, like-denominator addition, and the idea of a common unit (Stages A–D). DECISION-016's
broader repair learner is the product's primary audience, but repair entry and backward routing are
Phase 3+. **The slice must not be judged against a learner it was not built for.** OQ-17 holds the
bounded exit open; this packet does not implement it and has not foreclosed it.

## 1. Mathematical trust — *every visible transformation is correct*

| kind | evidence | tier / n |
|---|---|---|
| mechanized | Exact BigInt arithmetic core with zero DOM dependency; 244 tests across 20 files, including 10,000 generated fraction-pair invariant cases and 21 golden cases | mechanized, comprehensive |
| mechanized | `assertSceneCurrent` derivation-key digest: a scene that does not re-project from its own state throws `STALE_SCENE`. Renderers compute no mathematics — the milestone line selects an authored string from an upstream `mathClassification` | mechanized |
| human | Full episode walked on both routes (twelfths and twenty-fourths) at the deployed URL; every displayed intermediate and final form checked by hand | tier 1, n=1 |

**Untested:** nothing material. This is the strongest criterion in the packet.

## 2. Learner agency — *the learner makes meaningful decisions*

The learner performs, and the system does not pre-empt: recognizing the units do not match; choosing
the common denominator; constructing both equivalent numerators; combining like units; and answering
the connection-making check.

| kind | evidence | tier / n |
|---|---|---|
| mechanized | Response-provenance records carry what the learner proposed, not the system's preferred form — verified at resolve, where `22/24` is recorded although `11/12` is displayed as an alternative | mechanized |
| human | Help requested at `decide` and `transform` on the deployed site returns a hint, not an answer: *"Look at the parts in each bar. What do you notice?"*, *"Think about one whole and the size of each part."* | tier 1, n=1 |
| human | DECISION-026 satisfied: the premise check's reassuring answer is wrong on the twelfths route and right on the twenty-fourths route, so neither always-yes nor always-no passes | tier 1, n=1 |

**Untested:** whether a child experiences these as decisions or as steps to get through. That is
precisely what tier-2 evidence would reveal and adult review cannot.

## 3. Visual continuity — *equivalent-fraction transformation visibly preserves quantity*

| kind | evidence | tier / n |
|---|---|---|
| human | All four display conditions exercised at the public URL; each produces a distinct, coherent step configuration | tier 1, n=1 (owner) |
| human | Shaded length is preserved across renaming in every condition; the `reflect` beat mounts both the starting bar and the renamed bar with explicit labels | tier 1, n=1 |
| mechanized | The bar renderer refuses to draw a result crossing one whole rather than drawing it wrongly | mechanized |

**Named limits:**

- **Animated subdivision (D-01-A) was never built.** Bundle 1 is honestly labelled *New parts only*;
  the original wording is preserved in a code comment for restoration at `plan-10`. Continuity is
  shown by juxtaposition and by replay, not by motion.
- **OQ-20** — a result crossing one whole cannot be drawn. Not reachable in this episode's content.

## 4. Local feedback — *incorrect work can be corrected without resetting the problem*

| kind | evidence | tier / n |
|---|---|---|
| mechanized | `RECOVERY_KINDS` is a frozen map; classifiers take their `kind` from it and the renderer guard derives from `Object.values()`, so a kind cannot be produced that the renderer cannot dispatch | mechanized |
| human | Wrong numerator entered when renaming `2/3` at the deployed URL returns *"Count the shaded parts in the new bar and try again."*; the problem is not reset and prior work stands | tier 1, n=1 (owner and orchestrator, independently) |
| human | Wrong premise answers on both routes return the correct corrective notice and do not complete the episode | tier 1, n=1 |

**Named limit:** **OQ-21** — there is no authored string for a learner who wrongly answers "different"
on a like-denominator problem. That content does not exist in this slice, so the branch is
unreachable; it is a recorded Phase 3 obligation.

## 5. Scaffold variability — *the experience can become leaner*

**This is the weakest criterion and the packet does not claim it is met.**

| kind | evidence | tier / n |
|---|---|---|
| mechanized | Four registered conditions vary the display treatment (D-01/D-02) and the connection-making form (CM-01), selected upstream as episode configuration, never as a renderer flag | mechanized |
| — | **No evidence of support-level fading.** | **none** |

`src/interaction/support.js` builds a four-level ladder — high / medium / low / independent, across
six dimensions. `state.support` is assigned once at `episode.js:629` with every dimension pinned at
`high support`, and nothing ever writes it again; `src/app/app.js` never passes a label. The type
exists; the behavior does not. Recorded as the first of four findings in
`reports/orchestration/phase-2-unreachable-mechanisms.md`.

§22 asks for "the architectural ability to fade," not the adaptive rules. **Whether an unwritten
four-level type satisfies that is an owner judgement, and it is the one criterion I would not decide
for you.** OQ-22 records the first concrete candidate for giving the ladder a writer: a lower-support
form of the premise check that withholds the side-by-side bars.

## 6. Accessibility — *the participation floor, with evidence separated by kind*

**No conformance claim is made anywhere.** Built against WCAG 2.2 AA; conformance is not claimed
(reconciliation R4).

### Mechanized

- Focus reachability, native control type, and non-drag tap completion evidenced per decision across
  the visual and linear paths.
- Scaffold-leakage invariants 1–9, including Invariant 6 against a replaying `reflect` scene:
  reflection choices are genuinely unmounted in Inspection Mode, not hidden, and return in original
  order and unselected.
- Focus is preserved across a replay re-render; focus moves deliberately to "Done looking" on entering
  Inspection Mode and returns to the choice group on exit. Verified on the deployed site with
  `document.hidden` forced true.

### Human review

| item | result | tier / n |
|---|---|---|
| Target size at 360px | **24 interactive controls measured across every beat on the deployed site; zero below 24×24px.** Smallest is the replay toggle at 107×28 | tier 1, n=1 |
| Keyboard completion | Full episode completable by keyboard alone | tier 1, n=1 |
| Linear/semantic path | Same decisions, same responsibility — the linear path asks the learner to reason, it does not display the answer | tier 1, n=1 |
| Reduced motion | Exercised at the public URL 2026-09-21. Same behavior, same reachable states | tier 1, n=1 (owner) |
| Cross-browser | Chrome 1080p (full episode); Edge and Firefox at varying widths (basic path) | tier 1, n=1 device |

**On reduced motion, stated precisely:** parity holds, and it holds cheaply — there is no motion in
the standard path either, because D-01-A was never built. The owner's words: *"there was no motion to
see before, there still isn't, but the app does the same thing."* That is a true parity result and a
weak one, and it should be re-evaluated when `plan-10` adds animation.

### Child usability

**None. n = 0.** Non-blocking under DECISION-020. If conducted it follows the permission,
de-identification, and fixture boundary in `05-quality-and-validation.md` §52 and reports separately
under DECISION-022.

### Explicitly untested

- Screen readers. Semantics were inspected; announcement behavior in real assistive technology is
  untested.
- Physical touch hardware. Non-drag parity verified structurally and by emulation only.
- Safari on macOS and iOS/iPadOS — named in the supported-environment matrix, not exercised.
- Chromebook hardware, named in the matrix for performance, not exercised.
- Zoom and text scaling to 200%.
- Contrast measured instrumentally — colors were chosen against the AA ratios but not verified with a
  contrast tool on rendered screens.

## 7. Learner evidence — *reported separately for the stated starting point*

**This slice has been used by one adult and zero children.**

It may support: defect detection, comprehensibility and agency review, error-recovery behavior, and
participation-floor structure for a learner at the stated starting point.

**It does not establish** — and no part of this packet should be read as establishing — that a novice
can learn the Stage A–E progression from this episode, that performance persists, that independent
transfer occurs, or that any scaffold-fading rule is effective. Those require later checks that have
not been designed.

## 8. Aesthetic coherence

Applied criterion by criterion in `aesthetic-rubric.md`, per DECISION-021. Any single violation is a
blocking failure at this gate.

## What the orchestrator verified versus what is asserted

Every mechanized figure here was reproduced independently by the orchestrator at `b418e8a`: 244 tests,
clean build, `plan-status.js lint` clean, and the deployed bundle hash `index-DeRLIr4n.js` matched to
the local build at that revision. The deployed behavior claims were driven in a browser against the
public URL, not inferred from the workflow log.

## Owner disposition

Recorded by the owner, 2026-09-21. The packet requires the disposition to *name* the reviewed
artifact, the deployed revision, and the public URL; they are named here.

- [x] **Reviewed acceptance-evidence artifact:** this document
      (`reports/development/plan-09-app-shell-condition-switcher-and-acceptance/acceptance-evidence.md`),
      together with `deployed-exercise-record.md` and `aesthetic-rubric.md`, at revision `b418e8a`.
- [x] **Deployed revision:** `b418e8a`
- [x] **Public URL:** https://mrsmithelhs.github.io/FractionFlow/
- [x] **Date:** 2026-09-21
- [x] **Phase 2 exit gate: satisfied.**

The owner's disposition carries the DECISION-021 rubric in `aesthetic-rubric.md`, and carries
criterion 5 (scaffold variability) as accepted in its stated condition — the four-level support type
exists and has no writer, recorded in `acceptance-evidence.md` §5 and carried forward as OQ-22.

Testing basis: one device, one adult. Chrome at 1080p (full episode, all four display conditions,
error and recovery, the alternate valid path, reduced motion), with Edge and Firefox at varying widths
on the basic path. **n = 0 children.** The limits in §6 and §7 stand as written and are not waived by
this disposition.

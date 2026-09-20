# Plan 09 — Repair 03

- **Packet:** `plan-09` — App Shell, Condition Switcher, and Phase 2 Acceptance
- **Date:** 2026-09-20
- **Raised by:** owner question — "do those choices actually change anything?" — plus the outstanding
  promise-not-kept items from the Repair 01 and Repair 02 reviews
- **Status:** `in-progress`. Repairs 01 and 02 remain accepted.
- **Gate:** **mechanism confirmation before implementation.** Items 1 and 2 each need a proposal
  approved before code. Items 3–6 do not.

## Why this repair exists

Four mechanisms in the Phase 2 slice are specified, implemented, tested, and reachable by no learner
(`reports/orchestration/phase-2-unreachable-mechanisms.md`). This repair closes the ones that can be
closed without a new owner decision, and gates the one that cannot.

It also collects the smaller items where a label promises more than its body delivers, so they stop
being carried forward one review at a time.

## Item 1 — The condition switcher must switch (mechanism gate)

Captured mid-episode, the rendered `.app-visual-view` subtree is **byte-identical** under all three
registered conditions — 3,370 characters each. The menu changes the recorded active condition and
`aria-pressed`, and no pixel.

The bundles are supposed to differ on `display` (D-01) and `choreography` (D-02):

| Condition | Label | display | choreography |
|---|---|---|---|
| `phase2-bundle-1` | Smooth change | `D-01-A` | `D-02-M` morph in place |
| `phase2-bundle-2` | Compare before and after | `D-01-B` | `D-02-J` juxtapose |
| `phase2-bundle-3` | Step-by-step change | `D-01-B` | `D-02-S` sequential |

**The data you need already exists and nothing reads it.** `transitionMeaning`
(`src/interaction/scene.js:546-590`) projects `transition.pre` and `transition.post` — the before and
after forms of *both* operands — for every equivalent-renaming transition. Across the whole render
layer the only transition read is `changed.includes(side)` at `fraction-bar.js:86`, which adds a CSS
class. `pre` and `post` have no consumer anywhere.

So "Compare before and after" is not new data. It is consumption of a contract `plan-06` built and
`plan-07` never used.

### The architectural constraint, which is the reason for the gate

DECISION-006 requires conditions to be selected upstream and to feed the normal pipeline, **never as
a renderer flag**. A renderer that branches on `scene.meaning.condition.choreography` would satisfy
the owner's question and violate the decision the switcher exists to serve.

The correct shape follows what reduced motion already does. `scene.presentation` is currently
`{ mode }` (`scene.js:659-661`), the renderers read `scene.presentation.mode`, and no renderer knows
why the mode is what it is. Condition-driven choreography should arrive the same way: the scene
projection derives a presentation directive from the active condition, and the renderers read the
directive.

Required in the proposal:

- The shape of the new `scene.presentation` field, its permitted values, and how it is derived from
  `display` and `choreography`.
- Confirmation that **no** `src/render/` module reads `condition.*` for presentation. The one
  existing read, `connectionMaking === 'CM-01-P'`, is instructional form rather than presentation and
  may stay for now; Item 2 may replace it.
- How each of the three treatments renders, in terms of `transition.pre` and `transition.post`.
- How reduced motion composes with each treatment. A learner with `prefers-reduced-motion` must reach
  the same post-state on all three, per DECISION-009 and the existing parity requirement.
- What the linear path does. Choreography is a visual concern, but the linear path must not silently
  become the only honest one — state whether it varies, and if not, why that is an accommodation
  rather than a divergence.

### Stop conditions specific to this item

- **If the proposal requires changes beyond the scene's presentation pathway and the renderers'
  consumption of it — new instructional state, new content, or a new beat — stop and report.** That
  is a packet, not a repair, and it becomes `plan-10`. Say so rather than growing this repair.
- If a treatment cannot be built without animation carrying meaning, stop. Motion may not be the only
  channel for a mathematical fact.
- Do not gold-plate. Three treatments that are *visibly and describably different* to the owner in a
  browser is the bar. This is a comparison instrument, not a finished design.

## Item 2 — DECISION-026 must be reachable (mechanism gate)

No learner can meet a connection-making check whose habitual answer is wrong. Every registered
condition is `CM-01-M`, so the working `CM-01-P` premise branch is dead, and the matching arm's
"None of these" option was never the correct answer before Repair 01 removed it.

Two candidate mechanisms. **Propose one with a recommendation; the owner picks at the gate.**

- **A — register a `CM-01-P` bundle.** Cheapest: the premise branch exists and is tested. Cost: it
  puts a connection-making *form* into a menu labelled "Choose a display style," conflating two axes
  in the owner's comparison instrument.
- **B — vary the check form by content route.** The twelfths route keeps matching; the
  twenty-fourths route asks the premise question. No menu change, no axis conflation, and it uses the
  route infrastructure Repair 02 just built. Cost: touches the interaction layer's choice of
  instructional form, which is more than presentation.

Whichever is chosen, the requirement is unchanged: **a learner must be able to reach a check where
the reassuring answer is not the correct one.** The record must show which route or condition
produces it and how a reviewer reaches it in a browser.

## Item 3 — The correct choice must not always be first

`match-a` is the correct form in both authored sets (`8/12` and `16/24`), at index 0 in each. With
two sets this is a convention, not yet an exploit, and the next authored set will copy it.

**Repair:** vary the authored position of the correct form across sets, and add a content test
asserting the correct form is not at index 0 in every set. The test must read the sets, not restate
them.

## Item 4 — Leakage Invariant 6 must assert what its name claims

`assertResolveReflectNoLeak` (`tests/leakage-invariants.test.js:290-300`) scans for
`.control-choice-btn.selected` and `[aria-checked="true"]`. **No code in the project ever applies a
`selected` class or `aria-checked` to a choice button.** The real-output half of the invariant passes
because it looks for something that cannot exist; the fail-first half builds the marker by hand.

The invariant is named for connection-choice leakage, and the actual leak surface is now three bars
that must be indistinguishable apart from their shading.

**Repair:** extend the same assertion function so it also verifies that the rendered choice controls
are mutually indistinguishable — identical class lists, identical attribute-name sets, and no
attribute or class unique to one option. Keep the existing pre-selection check. Demonstrate
fail-first by marking one real rendered option, not by building a fixture from scratch.

This is currently true of the output — verified by inspection at the reflect beat — so the test
should pass on first run against real output and fail against a marked one.

## Item 5 — Gear menu: state visibility and dismissal

- `.app-display-option:hover` and `.app-display-option[aria-pressed="true"]` share one rule
  (`src/app/styles.css:94-98`), so the hovered option and the selected one are visually identical.
  Give the selected state its own treatment. `aria-pressed` is already correct; only the visual is
  missing.
- The menu has no Escape key and no click-outside dismissal. Add both. Escape returns focus to the
  gear button, as selection already does.

## Item 6 — Segment width at 320px

DECISION-009 supports reflow to 320px. Measured there, the track is 166px, giving **5.52px per
segment at denominator 30** — below the ~6px floor Repair 02 set as a stop condition. At 360px it is
6.85px. Layout holds and there is no overflow at either width; the segments simply stop being
separable.

**Repair:** report the measured segment width at denominators 12, 24, and 30 at both **320px and
360px**. Then either suppress internal segment dividers above a denominator threshold, keeping the
shaded length exact and the bar outline intact, or report that the threshold cannot be chosen without
an owner decision. Do not shrink any control, and do not cap the LCD — the owner chose 30
deliberately and DECISION-025 decoupled control size from denominator.

## Acceptance checks

- [ ] Mechanism proposals for Items 1 and 2 reported and approved before implementation.
- [ ] The three registered conditions produce **visibly different** rendered output, demonstrated by
      captured snapshots that are not identical, at the same beat and state.
- [ ] No `src/render/` module reads `condition.*` for a presentation decision; choreography arrives
      through `scene.presentation`.
- [ ] Reduced motion reaches the same post-state under all three treatments.
- [ ] A learner can reach a connection-making check whose reassuring answer is wrong; the record
      states how a reviewer reaches it in a browser.
- [ ] The correct matching form is not at index 0 in every authored set, with a test that reads the
      sets.
- [ ] Invariant 6 asserts choice controls are mutually indistinguishable, with fail-first shown
      against real rendered output.
- [ ] Selected menu option is visually distinct from a hovered one; Escape and click-outside dismiss
      the menu and restore focus to the gear.
- [ ] Segment widths reported at denominators 12, 24, 30 at both 320px and 360px.
- [ ] Re-measured at 360px at the reflect beat: first-bar top, current-question top, and how many of
      the three matching choices clear the fold. Report the viewport height used — the previous
      "3 of 3" held at 752px and is 2 of 3 at 740px.
- [ ] No horizontal page overflow at 320px or 360px.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] No deploy, no push, no public-URL claim.

## Not in scope

- **The support ladder.** `state.support` is written once at `createEpisode` and the app never passes
  it, so all six dimensions are pinned at `high support` and the `decide` beat has no wrong answer on
  the button path. Exposing a support control contradicts DECISION-019's scoping of the gear menu to
  conditions, and a learner-facing progression is `D-07`/`D-08`. This awaits owner disposition and
  must not be implemented here.
- Mixed-number or two-whole bar rendering (OQ-20).
- An entry page (OQ-19).
- Requirement 3: no deploy, no push, no public-URL claim.

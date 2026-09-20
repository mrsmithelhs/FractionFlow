# Phase 2 — Mechanisms Built But Not Reachable

- **Date:** 2026-09-20
- **Raised by:** orchestrator, during `plan-09` review and an owner design conversation
- **Status:** open; each item needs owner disposition, none is a `plan-09` repair

Phase 2 specified more learner-facing behavior than it wired up. Four mechanisms are implemented,
tested, and unreachable by any learner in the shipped slice. They are grouped here because the
failure mode is identical: **an artifact's presence was read as evidence of its effect.** Tests pass
because the code works when called. Nothing calls it.

None of these is an implementer defect. Each is a gap between specification and composition that
review — including mine — credited without checking reachability.

## 1. The support ladder has no writer

`createSupportConfiguration()` defaults to **`'high support'` on all six dimensions**
(`src/interaction/support.js:26-31`). `state.support` is assigned exactly once, at
`src/interaction/episode.js:629`, from the `support` parameter of `createEpisode`. It is never
mutated afterwards, and `src/app/app.js` never passes the parameter.

So the four-level ladder — `high support` / `medium support` / `low support` / `independent` — is
inert. `request-help` appends to `supportHistory` and escalates help *level*, but does not touch
`support`. The `plan-08` test that appeared to show escalation was reading the unchanged default.

Two consequences:

- The learner always receives the curated denominator candidate list, because
  `candidateDenominatorsMeaning` gates on `supportLevel === 'high support'`.
- Every candidate in that list is valid by construction —
  `candidateDenominatorsForInstance` reads only `paths.canonical` and eligible `paths.alternates`.
  So `decide` has **no wrong answer** on the button path, and
  `strings.decide.invalidDenominator` is unreachable there. The owner noticed this from the running
  app before anyone noticed it in the code.

The mathematics is genuinely path-dependent, so the choice is not cosmetic: selecting `24` instead
of `12` produces `16/24 + 6/24 = 22/24` with the bars subdivided into twenty-fourths. Verified in the
browser. It is a choice between two correct routes, not a question.

**Disposition needed:** whether Phase 2 ships a way to lower support at all. A reviewer-facing route
is one line in `app.js`, but DECISION-019 scopes the gear menu to conditions only and the owner has
said so explicitly. A learner-facing progression is `D-07`/`D-08`, deferred.

## 2. DECISION-026 has no reachable instantiation

Recorded in `reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-01-review.md`
and summarized here so all four sit together.

All registered conditions use `connectionMaking: 'CM-01-M'`, so the `CM-01-P` premise branch is dead.
The matching arm's DECISION-026 instantiation was the "None of these" option, and the correct answer
was always `8/12`, so "none" was never right — a distractor wearing a premise check's clothes.
`plan-09` Repair 01 replaced it with three real candidates, which improved the task and removed the
vestige.

No learner can currently meet a connection-making check whose habitual answer is wrong, which is the
failure DECISION-026 exists to prevent.

**Disposition needed:** a fourth registered condition using `CM-01-P`, a second authored choice set
whose answer genuinely is "none," or explicit deferral to Phase 3.

## 3. The condition switcher changes nothing the learner can see

Found 2026-09-20 when the owner asked, of the gear menu: "do those choices actually change
anything?" No.

Demonstrated rather than inferred. Mid-episode at a `transform` beat, the rendered
`.app-visual-view` subtree was captured under each of the three registered conditions in turn. The
three snapshots are **byte-identical** (3,370 characters each).

The cause is that nothing consumes the codes:

- The only read of `condition` anywhere in `src/render/` is
  `scene.meaning.condition.connectionMaking === 'CM-01-P'`, at `beat-container.js:410` and
  `linear-path.js:410`. All three registered conditions use `CM-01-M`, so even that branch resolves
  identically.
- `display` and `choreography` are written to `data-display-code` and `data-choreography-code` on the
  app root and on each menu option (`app.js:150-151`, `264-265`). Nothing reads them: no renderer, no
  scene logic, and no CSS selector. The only other reference in the repository is
  `tests/app-shell.test.js:60`, which asserts that the attribute was written.

So switching conditions changes the recorded active condition in state and in the replay envelope,
and updates `aria-pressed` on the menu. It changes no pixel.

This is the most consequential of the four, because the swappable-condition apparatus is what
DECISION-006 and DECISION-007 rest on, and the owner asked for the gear menu specifically in order to
"try different approaches right from the initial browser tests." The register in `plan-04` exists to
keep D-01, D-02, and D-05 undecided; a switcher that does not switch lets the provisional bundle
harden into a default by inertia, which is the exact outcome OQ-01 was written to prevent.

Two smaller observations from the same inspection:

- The menu's selected state is indistinguishable from hover: `.app-display-option:hover` and
  `.app-display-option[aria-pressed="true"]` share one rule (`styles.css:94-98`), so a hovered option
  and the active one look identical.
- `presentationMode` (`standard-motion` / `reduced-motion` / `instant-test`) *is* consumed by the
  renderers and does change output — but it is driven by `matchMedia`, not by the condition. Motion
  behavior is real; condition-selected motion behavior is not.

**Disposition needed:** whether Phase 2 ships a switcher that switches. The narrower question is
which of D-01 (animated versus static key-frame) and D-02 (morph / juxtapose / sequential) a renderer
would have to actually implement for the three bundles to differ, and whether that is Phase 2 work or
Phase 3. Until then the menu is best described as a provenance recorder, not a comparison instrument.

## 4. The fraction-bar renderer cannot draw a result that crosses one whole

Not unreachable in the same sense — this one is reachable by content that already exists, and it
fails quietly rather than not running.

`src/render/fraction-bar.js` renders exactly `denominator` segments and shades `i < numerator`. With
`10/8` it draws eight segments, all shaded — a bar indistinguishable from `8/8`. There is no guard.
The numeric readout still reads "10 / 8", so the number stays honest while the picture does not.

`src/render/matching-choice.js:12` throws on `numerator > denominator` for the same input. The two
bar renderers disagreed about whether an improper form is an error; `plan-09` Repair 02 has since
added the matching guard to `fraction-bar.js`, so this now fails loudly rather than drawing a wrong
picture. The design question stays open.

This does not affect the Phase 2 slice — the canonical fixture is `2/3 + 1/4 = 11/12` — but
`curated-like-addition-crossing-reducible` (`7/8 + 3/8 = 10/8`, `resultForm: 'improper'`) is already a
reviewed golden case, and `crosses-one-whole` is a first-class content overlay with its own selector
predicate and bulk-validation histogram.

**Disposition needed:** none for Phase 2 beyond a loud guard, so the gap surfaces as an error rather
than a wrong picture the first time Phase 3 content reaches the renderer. The design question is
OQ-20.

## Why these were missed

Each was credited from an artifact rather than from an exercise:

- the support ladder, because `SUPPORT_LABELS` and the dimension gating exist and are unit-tested;
- DECISION-026, because `premisePromptLinear` and the `CM-01-P` branch exist — I credited this in the
  `plan-08` final review without checking whether any condition selects it;
- the condition switcher, because the codes are validated, frozen, recorded in the replay envelope,
  and asserted present by a test — every signal except a consumer;
- the bar limit, because no Phase 2 fixture exercises it.

This is the standing caution at a larger scale than a test name: **a mechanism's existence is not
evidence that anything reaches it.** For Phase 3 packet review, the question to ask of any specified
behavior is not "is it implemented?" but "what sequence of learner actions produces it?"

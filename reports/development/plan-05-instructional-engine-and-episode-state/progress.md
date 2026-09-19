# Plan 05 Implementer Progress Report

- **Packet:** `plan-05` — Instructional Engine and Episode State
- **Report date:** 2026-09-19
- **Mechanism approval:** `reports/development/plan-05-instructional-engine-and-episode-state/mechanism-review.md`, approved with binding clarifications on 2026-09-19
- **Implementation commit:** `bc63229` (`feat: implement plan-05 instructional engine`)
- **Repair commit:** `0d2c3bd` (`fix: harden plan-05 episode and replay boundaries`)
- **Packet status:** unchanged; the implementer did not edit frontmatter or run the status setter
- **Ready for orchestrator review:** yes

## Overall summary

Implemented the pure instructional layer for the Phase 2 unlike-denominator
addition episode and the prerequisite content capability evaluator. The engine
now creates immutable JSON-safe episode state, advances through explicit
encounter → notice → decide → transform → operate → resolve beats, retains
  completed-beat context, preserves valid earlier work after invalid responses,
  records independent support dimensions and layered help, emits synthetic
  response-level provenance, and reconstructs generated or curated episodes from
  deterministic replay envelopes. Beat-specific intents are gated to the active
  responsibility, demonstration support survives incorrect retries for the same
  responsibility, and resolved/reflected establishments are present in the
  canonical state projection.

The content layer now computes Phase 2 representation eligibility before episode
construction. Exact mathematical validity remains delegated to Plan 02; the
eligibility evaluator adds only the LCD/target-denominator <= 30 and individual
scale-factor <= 12 rendering ceilings. Canonical, authored alternate, and
learner-proposed paths are evaluated separately, and valid but unsupported
paths remain mathematically valid while selecting the reviewed symbolic
continuation.

The implementation does not add DOM, rendering, Scene Model, app-shell,
storage, persistence, network lookup, condition switching, packet-status, or
deployment behavior.

## Mechanism and boundary confirmation

The implementation follows the approved mechanism in the Plan 05 mechanism
review:

- `createEpisode()` retains the complete immutable validated content instance,
  including canonical and alternate paths and result facts.
- Instantiated episodes have only `active` and `resolved` status. Invalid
  learner work produces local recovery while the episode remains active;
  invalid content or an ineligible base fraction-bar path fails before an
  episode state exists.
- `continue` is rejected by the instructional reducer and remains an app-shell
  transition. It is not placed in replay intent history.
- State, provenance, replay envelopes, action intents, and content records are
  canonical JSON-safe wire data with exact intent shapes and round-trip checks.
  The pre-existing content classification field
  `canonicalRenaming.targetDenominator` was normalized to its established
  string-wire form so the full retained content record is serializable.
- Replay reconstructs generated instances from selector, overlays, profile,
  seed, generator/version, and seed-algorithm identity; curated instances use
  the static fixture id and authoring revision. Every nested reconstruction
  identity field is checked after JSON wire round-trip reconstruction, with
  unknown, tampered, or out-of-order replay failing closed. There is no network,
  ambient lookup, or best-effort substitute.
- Eligibility derives profile identity from the validated instance. A base
  fraction-bar capability failure prevents construction; a valid learner path
  that exceeds the visual ceiling remains active and routes to symbolic
  continuation; authored-path coverage remains a separate classification.
- The active condition is a bounded immutable descriptor containing only the
  approved id, revision, display, choreography, prompt-cadence, and
  connection-making fields. No switcher, preference surface, adaptive rule,
  renderer flag, or arbitrary condition-variable bag was added.

## Module map

### Content

- `src/content/eligibility.js` — exact path and instance capability checks,
  JSON-safe verdicts, Phase 2 limits, authored-coverage distinction, and
  proposed-path continuation result.
- `src/content/generator.js` — populates generated and curated records with
  eligibility verdicts before freezing them.
- `src/content/validation.js` — recomputes and validates the eligibility
  contract instead of expecting `'deferred'`; also validates the JSON-safe
  canonical-renaming record.
- `src/content/bulk-validation.js` — renames the stale
  `deferredEligibility` reporting field to `eligibleVerdict`.
- `src/content/index.js` — exports the evaluator.

### Interaction

- `src/interaction/episode-definition.js` — approved episode identity/revision,
  explicit beat order, bounded active-condition descriptor, and prompt
  identities.
- `src/interaction/support.js` — canonical support labels, independent support
  dimensions, and deterministic help levels.
- `src/interaction/classification.js` — response delegation to exact math/content
  validators and JSON-safe instructional classifications.
- `src/interaction/episode.js` — immutable episode constructor and learner-intent
  reducer with local recovery, beat completion, support use, and resolved-state
  handling.
- `src/interaction/provenance.js` — synthetic response-level provenance,
  visibility/supply snapshots, support history, evidence category, and resulting
  instructional state.
- `src/interaction/replay.js` — envelope creation and deterministic generated /
  curated reconstruction with identity checks.
- `src/interaction/index.js` — public interaction-layer exports.

## Requirement-by-requirement evidence

### Requirement 1 — Episode state and beats

Implemented in `src/interaction/episode.js` and
`src/interaction/episode-definition.js`.

- The active beat and expected response are explicit.
- Encounter, notice, decide, transform, operate, resolve, and selective reflect
  are represented.
- Completed beats retain the structured establishment made at that beat.
- Transitions occur only through learner-intent actions or the reducer's
  deterministic internal consequence of a successful learner action. There is
  no timer, DOM callback, animation callback, or presentation dependency. Each
  beat-specific intent is rejected unless it matches the active beat; `continue`
  remains outside the reducer.

### Requirement 2 — Response classification by delegation

Implemented in `src/interaction/classification.js`.

- Common denominators call `validateCommonDenominator()` and preserve
  `valid-least` versus `valid-non-least`.
- Conversion responses call `validateEquivalentFraction()` and
  `classifyConversionResponse()`.
- Operation and resolution responses call `validateOperationResult()` and the
  existing operation response-pattern classifier.
- The tested classifications include invalid common denominator, incorrect
  equivalent numerator, denominator changed without numerator, incorrect
  numerator arithmetic, and correct unsimplified result.
- A valid denominator outside the authored list is not converted into a math
  error. The canonical `36` case remains `valid-non-least` mathematically and
  is separately marked outside representation capability because it exceeds
  the Phase 2 rendering ceiling.

### Requirement 3 — Support configuration and help

Implemented in `src/interaction/support.js` and the reducer.

- Support dimensions are independent and use the canonical labels high
  support, medium support, low support, and independent.
- Help progression is deterministic: orient → represent → constrain →
  demonstrate.
- Help and replay are recorded as support use rather than failure.
- A demonstration marks the subsequent assessed response as
  `supported-construction`, preventing it from being recorded as uncued
  prediction evidence. That support marker remains attached through incorrect
  retries until the demonstrated responsibility is completed.

### Requirement 4 — Provenance and replay

Implemented in `src/interaction/provenance.js` and
`src/interaction/replay.js`.

- Provenance carries synthetic content identity, episode definition identity,
  active condition, support label and dimensions, beat, expected response,
  visibility/supplied/hidden field identities, prompt identity and condition,
  help/replay/retry history, learner intent, classification, evidence category,
  and resulting instructional state.
- The envelope carries complete generated or curated reconstruction identity,
  episode definition, support, active condition, and ordered learner intents.
- Generated and curated replay tests round-trip deterministically through JSON.
- Tampered curated identity is rejected before substitution. Invalid generated
  reconstruction profile, request, version, seed, or instance identity is also
  rejected. Exact replay envelope shape and JSON round-trip preservation are
  checked before reconstruction, and an out-of-order learner-intent sequence
  fails before it can construct an impossible episode.

### Requirement 5 — Register cleanup

Updated only the transfer-dependent falsification observations and
discriminating-experiment cells in
`docs/development/phase-2-first-slice-design/prototype-variable-register.md`.
The struck outcome bullets remain explicitly annotated. Transfer language in
the affected criteria was replaced with small-n-observable measures such as
immediate reasoning, replay comprehension, correspondence evidence, burden,
and access defects. No other Plan 04 dossier file was changed.

### Requirement 6 — Representation-eligibility evaluator

Implemented in `src/content/eligibility.js` and integrated into generation and
validation.

- `fractionBar` is `eligible` or `ineligible` based on exact canonical-path
  validity plus the Phase 2 ceilings.
- `numberLine` is the approved scope label `not-in-phase-2`, distinct from
  `ineligible`; `symbolic` is `eligible` as the Phase 2 continuation baseline.
- Canonical and authored alternate paths are evaluated independently.
- Learner-proposed common denominators are evaluated independently from
  authored coverage.
- Missing or `'deferred'` verdicts fail content validation and therefore fail
  episode construction.
- Valid but visually ineligible paths return
  `valid-but-outside-representation-capability` and symbolic continuation.
- Valid paths that remain within the rendering ceiling but are not enumerated
  by the instance are classified as
  `valid-but-outside-authored-coverage`.

### Exact eligibility sweep

The sweep enumerated the finite `relatively-prime-addition` candidate space
and evaluated every accepted candidate under each profile:

| Profile | Finite accepted instances | Base/canonical fraction-bar eligible | Canonical ineligible | Authored alternate paths | Alternate eligible | Alternate ineligible |
|---|---:|---:|---:|---:|---:|---:|
| `phase1-dev-default/1` | 34 | 34 | 0 | 34 | 18 | 16 |
| `curated-review/1` | 220 | 80 | 140 | 220 | 18 | 202 |

The canonical curated `2/3 + 1/4` path is eligible (`LCD 12`, scale factors
4 and 3), and its authored alternate `24` path is eligible (scale factors 8
and 6). A valid proposed `36` path remains mathematically valid but is
rendering-ineligible because its target denominator exceeds 30.

## Validation commands and results

- `node scripts/dev/plan-status.js check plan-05` →
  `RUNNABLE: plan-05 is ready to implement`.
- `node scripts/dev/plan-status.js lint` → `lint: OK (no violations)`.
- Baseline before source changes: `npm test` → 113 tests passed.
- Final `npm test` → **11 test files passed, 132 tests passed**.
- Focused Plan 05 tests → eligibility, interaction, provenance, replay, base
  capability, deferred rejection, and reflection cases passed.
- `git diff --check` and `git diff --cached --check` → no whitespace errors.
- Read-only exact eligibility sweep → figures recorded above.
- Static boundary scan over `src/interaction/` → no DOM, browser API,
  storage, or network API references.
- JSON wire checks → generated/curated content, episode state, provenance,
  intents, and replay envelopes reject non-canonical values and survive JSON
  serialization round trips without `BigInt` or silent-loss errors.
- Final staged path audit → exactly the 17 implementation/test/register paths
  listed in the implementation commit.

The normal Git global-ignore warning (`C:\Users\orion\.config\git\ignore`
permission denied) appeared during read-only status/diff operations. It did not
affect tests, lint, staged path selection, or the commit. Managed Windows Git
metadata staging required the repository-approved narrow elevation; no lock was
present and no lock or ACL was removed or changed.

## Advisor-consultation disposition

**Branch A — Sol consultation ran.** After the owner corrected the earlier
disposition, this implementer launched the `gpt-5.6-sol` reviewer as a
read-only advisor with an artifact-specific Plan 05 brief. Sol found defects in
beat sequencing, generated replay identity verification, demonstration support
taint, canonical JSON-wire validation, and resolved-state establishment, plus a
missing scale-factor boundary test. The implementer verified those findings
against the repository, repaired them in `0d2c3bd`, added regression coverage,
and reran the full suite. Sol also confirmed the eligibility integration and
scope discipline and left help-ladder scope as a residual question rather than
a proven defect.

## Remaining risks and follow-ups

- The instructional state and content eligibility contracts are headlessly
  tested, but no renderer or Scene Model exists yet; visual/semantic scene
  fidelity belongs to Plan 06 and later packets.
- The current active-condition descriptor preserves the approved provisional
  bundle but does not implement condition switching; Plan 09 owns that surface.
- The symbolic continuation is represented as instructional route state. Its
  learner-facing rendering and accessibility behavior require the later
  renderer/linear-path packets.
- The approved documents do not settle whether the orient → represent →
  constrain → demonstrate help ladder resets per beat or per response
  responsibility. The current deterministic behavior is preserved as a
  residual question for orchestrator/owner disposition; no new adaptive rule
  was introduced.
- The `not-in-phase-2` number-line label is intentionally a scope marker, not a
  permanent capability verdict.
- No learner data, account data, credentials, analytics, or deployment state
  was introduced.

No packet status, resolution, owner disposition, generated development index,
push, or external state was changed.

# Plan 04 Implementer Progress Report

- **Packet:** `plan-04` — First Vertical Slice — Design and Evidence Preparation
- **Report date:** 2026-09-19
- **Dossier commit:** `0171d97ce57be9aa069a3fad533649b6788fbf0f`
- **Packet status:** unchanged; implementer did not edit frontmatter or run the status setter
- **Ready for orchestrator review:** yes

## Overall summary

Prepared the docs-only Phase 2 first-slice design dossier at
`docs/development/phase-2-first-slice-design/`. The dossier defines a reusable
episode for Plan 03's `relatively-prime-addition` family, using the curated
synthetic `2/3 + 1/4` instance as its canonical example while covering both the
LCD path and a valid non-LCD path. It records the learner/system responsibility
map, the encounter-to-resolve narrative, independent support dimensions,
representation roles, valid-path fallback classes, completion conditions, and
local error/help behavior.

The dossier also takes the D-20 architecture position that the Scene Model is a
semantic projection of validated content/math state, instructional state, and
active representation—not a second authority—and separates that architectural
position from empirical display hypotheses. The evidence plan defines the
prerequisite and claim boundary, response-level provenance, D-16 scaffold-leakage
invariants, replay envelope, and an accessibility participation-floor plan that
keeps mechanized, human, and child evidence separate.

No application source, test, build, packet status, founding document, decision
log, implementation packet, learner data, or external state was changed.

## Dossier location and section inventory

The dossier contains exactly these five files and no others:

1. `README.md` — review status, scope, claim boundaries, canonical content
   contract, artifact map, review checklist, and governing references.
2. `episode-definition.md` — the reusable Episode Definition draft.
3. `scene-model-position.md` — D-20 Scene Model architecture position and
   rejected alternatives.
4. `prototype-variable-register.md` — D-01, D-02, D-05, and CM-01 comparison
   register.
5. `evidence-and-accessibility-plan.md` — learner/evidence contract,
   scaffold-leakage plan, accessibility plan, supported-environment question,
   and replay/defect plan.

The required progress report is in
`reports/development/plan-04-first-vertical-slice-design-preparation/progress.md`.

## Requirement mapping

### Episode-definition field checklist

All fields required by `docs/founding/04-system-architecture.md` §36 are
present:

- instructional purpose — present, with the invariant and starting-point boundary;
- eligible problem family — present, referencing the concrete Plan 03 selector,
  schema, and capability boundary;
- learner responsibilities — present by responsibility and beat;
- system responsibilities — present by responsibility and beat, including the
  prohibition on independent mathematical calculation in the instructional and
  render layers;
- narrative beats — present for encounter, notice, decide, transform, operate,
  resolve, and selective reflect;
- allowable scaffolds — present using high support, medium support, low support,
  and independent labels, with independent support explicitly separated from
  independent transfer evidence;
- valid representation roles — present for fraction bar, symbolic notation,
  semantic/linear access, and the explicitly excluded number line;
- covered valid paths — present for the canonical LCD path and the valid non-LCD
  `24` path, with exact raw/preferred-form distinctions;
- reviewed fallback behavior for valid paths outside coverage — present as
  `valid-but-outside-authored-coverage` and
  `valid-but-outside-representation-capability`, with no silent coercion or false
  mathematical incorrectness; and
- completion conditions — present, including exact validity, inspectability,
  provenance, and scaffold-leakage boundaries.

### Prototype-variable register

The register covers:

- D-01: animated transformation versus static/key-frame comparison;
- D-02: morphing, deliberate juxtaposition, and sequential replacement;
- D-05: sparse, dense, and conditional prompt density/prediction cadence; and
- CM-01: no explicit connection prompt, structured mapping, and brief
  explanation.

Each entry is explicitly marked “Prototype output — not decided by this
dossier.” Each carries rival hypotheses, an observation that would falsify each
rival, the manipulated variable, held constants, outcome measures, real-world
variation dimensions, a discriminating experiment for every live rival pair,
and a conclusion rule that records “consistent with …” plus a next experiment
when the evidence cannot separate rivals. No condition was selected.

### Scene Model position

The design position is a semantic projection with known source inputs and
derived fields. It rejects renderer-owned mathematical state, an independently
mutable scene store, pixel/frame authority, animation-defined mathematical
completion, renderer-to-renderer synchronization, scene-owned learner history,
and prose-only scene state for architectural reasons. It routes animation,
choreography, prompt cadence, and connection-making form to empirical prototype
work rather than presenting them as architecture decisions.

### Evidence and accessibility plan

The evidence plan states that the slice may eventually establish mathematical
trust, representational continuity, comprehensibility, agency, error recovery,
and supported performance for the stated prerequisite boundary. It explicitly
states that the slice cannot by itself establish novice learning of Stages A–E,
persistence, independent transfer, fading-rule efficacy, instructional efficacy,
universal accessibility, or a WCAG conformance claim.

The accessibility plan maps every participation-floor item to planned
keyboard/non-drag touch mechanisms, reduced-motion behavior, semantic/linear
content, focus/reading-order/label/status/contrast/text-size/responsive review,
and agency-parity checks. It names mechanized checks, human review, and child
usability evidence separately and lists the browser/OS, layout, input, motion,
semantic-access, text/contrast, and performance modes as untested or awaiting
the D-22 support-matrix decision.

The scaffold-leakage plan includes fail-first checks for denominator, equivalent
numerator/scale-factor, prediction, operation, resolve/reflection, help/replay,
retry/stale-state, and valid-but-outside-coverage states. The replay plan records
seed or fixture identity, family, episode definition, support state, active
representation, presentation/input context, ordered learner-intent actions,
and expected/observed semantic transitions.

## Specification ambiguities or contradictions

No internal contradiction between the required founding documents was found. No
missing Plan 03 schema field blocked the design; the accepted Plan 03 contract
provides the required selector, exact/current/preferred forms, canonical and
alternate paths, classifications, representation facts, and provenance.

Open questions were preserved rather than silently resolved:

- D-01, D-02, D-05, and the connection-making prompt form remain prototype
  variables;
- D-03/D-04 number-line and bridge scheduling are outside this slice;
- D-06/D-07 numeric display and session boundaries remain open; and
- D-08/D-10/D-11/D-12/D-22 placement, identity, persistence, replay-version
  policy beyond the Plan 03 identifier, and supported-environment choices remain
  owner/implementation-gated.

## Commands and read-only inspections

- `node scripts/dev/plan-status.js check plan-04` →
  `RUNNABLE: plan-04 is ready to implement`.
- `node scripts/dev/plan-status.js lint` → `lint: OK (no violations)`.
- `rg` inspections over the required founding documents, deferred-recommendation
  register, Plan 03 packet/reports, and `src/content/` contract sources.
- Read-only Node inspection of the curated Plan 03 instance and its full
  canonical/alternate record shape. The first JSON print attempt hit the normal
  `Do not know how to serialize a BigInt` error; the rerun used a BigInt-to-string
  replacer and completed without repository mutation.
- PowerShell exact-file-set, required-section-marker, content-boundary, and
  trailing-whitespace assertions → exact five-file dossier; all required markers
  passed; no trailing whitespace.
- `git diff --no-index --check -- NUL <dossier-file>` over each untracked file →
  no whitespace errors detected.
- `git diff --cached --check` after staging the dossier → passed.
- `git status --short` before and after the dossier commit → only the explicit
  Plan 04 paths were present; the final report is the remaining scoped path until
  its final commit.

Per the packet's docs-only boundary, no build or test command was run.

## Problems encountered

1. The first read-only Node inspection attempted to serialize native `BigInt`
   values directly. It failed before changing anything; a replacer-based
   inspection then verified the instance successfully.
2. Ordinary sandbox Git staging failed with `index.lock: Permission denied` while
   confirming `lock_exists=False` and identity `bonfire\\codexsandboxonline`. The
   repository guidance was followed: no lock was deleted and no ACL was changed.
   Narrow elevation staged and committed only the dossier paths.

## Advisor-consultation disposition

**Branch B — advisor consultation not warranted for this change.** This packet
produces only a docs-only design dossier and progress report; it does not modify
code, scripts, schemas, or another behavioral surface for an advisor to critique.
No advisor consultation ran. This is a proportionality decision under the
implementer prompt, not an owner approval and not a substitute for the
orchestrator review gate.

## Remaining risks and handoff

- The dossier is a proposal until the owner reviews and accepts it; the packet's
  gate still prohibits drafting a Phase 2 implementation packet before acceptance.
- No application code exists yet, so the Scene Model, semantic alternative,
  scaffold-leakage invariants, accessibility mechanisms, and replay envelope
  remain unimplemented and untested.
- The valid non-LCD path is covered conceptually, but the later implementation
  must prove that the exact content validator, instructional state, scene, and
  renderers preserve its valid-non-least/correct-unsimplified classification.
- The first-slice supported-environment matrix, child-observation protocol if
  needed, prototype comparison sample, and any conclusion thresholds remain
  owner/orchestrator decisions.
- No packet status, resolution, owner disposition, or generated development index
  was edited.

**Ready for orchestrator review: yes.**

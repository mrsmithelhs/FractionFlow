# Development Packets

This folder contains durable handoff packets for bounded agent work.

Packets are assigned to implementer agents. Each packet defines scope, required reading, input files, output files, validation checks, progress-report requirements, stop conditions, and approval gates.

## Packet Index

<!-- plan-index:begin -->
| id | title | status | summary |
|---|---|---|---|
| `plan-01` | Node Toolchain and Static Deployment Spike | complete | Stand up the minimal Node-based dev toolchain (package manifest, lockfile, build step, headless test runner), decide and prove the static GitHub Pages deployment mechanism with a harmless published smoke check, and ratify the repository source/build-output layout. This spike proves deployment plumbing only; it does not prove any learner-facing behavior. |
| `plan-02` | Exact-Arithmetic Mathematical Core | complete | Implement the deterministic, exact-arithmetic fraction engine in `src/math/` as a pure, DOM-free, dependency-free module: equivalence, comparison, gcd/lcm, valid common denominators, least common denominator, scale factors, conversion, addition, subtraction, simplification, mixed-number forms, composition and decomposition regrouping, result classification, benchmark magnitude facts, intermediate-step validation, and response-pattern classification. Prove it with property-based invariant tests across broad ranges, exact-equality tests hostile to floating point, deliberate edge cases, and durable golden cases with result diversity. |
| `plan-03` | Content Contracts and Deterministic Problem Generation | complete | Define the formal problem-instance schema and problem-family contracts, and implement constraint-based, deterministic, seeded generation in `src/content/` for the Phase 1 initial families (like-denominator addition/subtraction, nested-denominator addition/subtraction, shared-factor and relatively-prime unlike denominators, reducible results, results crossing one whole). Every generated instance is fully classified before use, validated against its family's constraints, and reproducible from its seed; bulk generation is auditable for validity and distribution. Representation feasibility is recorded as data, not fixed thresholds. |
| `plan-04` | First Vertical Slice — Design and Evidence Preparation | complete | Prepare — but do not begin — the Phase 2 first vertical slice: draft the episode definition for unlike-denominator proper-fraction addition (both operands renamed), the scene-model design position, the accessibility evidence plan for the slice, the learner-prerequisite and evidence contract, and a register of prototype variables that this project explicitly refuses to pre-decide (animation vs static, morphing vs juxtaposition, prompt density, bridge mechanics). Output is a design dossier under docs/, not application code. |
| `plan-05` | Instructional Engine and Episode State | complete | Build the instructional layer of the pipeline in src/interaction/: the episode state machine for encounter through resolve, support configuration, response classification delegating all mathematical truth to src/math and src/content, response provenance, local error recovery, layered help, and the replay envelope. Also closes the one missing prerequisite: the deterministic representation-eligibility evaluator in src/content/, which episode instantiation requires and which Plan 03 left as the literal string 'deferred'. Pure logic with zero DOM, proven by headless tests before any renderer exists. |
| `plan-06` | Scene Model Projection | complete | Implement the D-20 Scene Model as a pure semantic projection of validated mathematical state, instructional state, and active representation. Proves that identical inputs yield identical scene meaning, that nothing downstream computes mathematics, that a reduced-motion transition reaches the same post-state, and that an ineligible capability input fails closed before any renderer sees it. |
| `plan-07` | Renderer Foundation and Learner-Facing Strings | complete | Build the renderer foundation in src/render/: the shared scene-consumption and beat-mounting contract, the centralized learner-facing strings table, the fraction-bar and symbolic renderers, and the discrete non-drag control structure. Proves the common boundary holds and that no renderer becomes a second source of truth, before the accessible linear path and the leakage invariants test that boundary in plan-08. |
| `plan-08` | Participation Floor and Access Parity | complete | Complete the access model: the accessible linear path on the plan-07 boundary, the nine fail-first scaffold-leakage invariants across both visual and semantic paths, keyboard and non-drag parity for every required decision, the completed-beat collapse rule, and the participation-floor and aesthetic rubric evidence. This is where the claim that every access path preserves the learner's mathematical responsibility is proven rather than asserted. |
| `plan-09` | App Shell, Condition Switcher, and Phase 2 Acceptance | complete | Assemble the first complete learner-facing episode: entry page, app shell, the reviewer-only design-condition switcher behind a gear icon, and the composed pipeline from content through instruction and scene to renderers. Then exercise it at the public GitHub Pages URL as roadmap section 16 requires, gather the participation-floor evidence, and present the whole slice against the Phase 2 exit gate for owner review. |
| `plan-10` | Phase 3 Generalization — Design and Reach Assessment | in-progress | Prepare — but do not begin — Roadmap Phase 3. Assess how far the established fraction-bar interaction grammar actually stretches across the eight problem families of §27 and the six focused concept episodes of §28, family by family, naming which reuse existing motifs unchanged, which need a new beat, and which need a representation the bar cannot give. Resolve OQ-20 (a result crossing one whole) and decide whether mixed numbers enter Phase 3 or later. Output is a design dossier under docs/, not application code. |
| `plan-11` | Motion and Animated Subdivision | draft | Build D-01-A, the animated subdivision that Phase 2 promised and never implemented. Restore the parked "Smooth change" condition label, give DECISION-021 criterion 4 and the reduced-motion participation-floor row real content to be tested against, and keep the whole thing learner-triggered with no auto-advance in any motion mode. |
| `plan-12` | Entry Page and Session Shape | draft | Give the app a front door. Resolve OQ-19: an entry page where the app name and the reviewer-only condition switcher live, from which a learner enters the episode, and to which the episode returns. Removes the footer-title workaround adopted in plan-09 Repair 01, and gives the gear menu somewhere to live that does not overlap the work surface. No accounts, no storage, no progress. |
| `plan-13` | Scaffold Fading Made Real | draft | Give the four-level support ladder a writer. src/interaction/support.js builds high / medium / low / independent across six dimensions; state.support is assigned once and never updated, so no learner reaches any level but the first. Make at least two levels reachable and visibly different, starting with OQ-22's lower-support premise check, and answer Roadmap §22's "architectural ability to fade" with behavior rather than with a type. |
| `plan-14` | Reachable Behavior Contract and Browser Route Matrix | in-progress | Turn the Phase 2 diagnosis into an executable artifact. Every learner-visible behavior the project claims gets a route witness: a registered configuration, a permitted starting surface, a concrete action sequence through mounted app controls, the expected observable difference, and a negative control proving the behavior is not permanently on or identical to its alternative. Fails when a registered condition has no route witness, or when a route produces the same output as the alternative it claims to differ from. |
<!-- plan-index:end -->

## Report Folders

Every packet should leave a report under:

```text
reports/development/<packet-folder>/progress.md
```

Implementers should create the folder if it does not already exist.

## Packet Lifecycle

Status is set in each packet's YAML frontmatter (the only hand-written source). This table is generated by `node scripts/dev/plan-status.js render`.

| Status | Meaning |
|---|---|
| `draft` | Exists; needs review before assignment. |
| `ready` | Can be handed to an implementer, **if `check` passes** (all deps complete). |
| `in-progress` | Assigned and underway. |
| `delivered` | Implementer reports done; awaiting orchestrator verification. |
| `complete` | Orchestrator-verified. Terminal; requires `resolution`. |
| `superseded` | Replaced by a later packet. Terminal; requires `superseded_by` + `resolution`. |
| `parked` | Deliberately deferred. Terminal-until-reopened; requires `resolution` saying why. |

`blocked` is computed, not hand-set: any packet whose `depends_on` are not all `complete` is effectively blocked regardless of its own status. See `node scripts/dev/plan-status.js check <id>`.

## Status Tooling

```
node scripts/dev/plan-status.js list            # all packets + effective status
node scripts/dev/plan-status.js check <id>      # exit 0 + RUNNABLE, or exit 1 + reason
node scripts/dev/plan-status.js lint            # schema violations
node scripts/dev/plan-status.js render          # regenerate this index between markers
node scripts/dev/plan-status.js set <id> <status> [--resolution "…"] [--superseded-by <id>]
                                                # change status + re-render + lint atomically; refuses to write if result won't lint
```

See `docs/workflows/packet-tracking-system.md` for the full system design.

## General Rules

- **Before starting any packet, run `check <id>`.** If it exits nonzero, stop and report.
- Follow the assigned packet exactly.
- Do not broaden scope.
- Use repository truth over memory.
- Stop on judgment decisions, evidence gaps, or validation failures that change scope.
- Write the progress report before the final response.
- Implementers report and stop; the orchestrator sets `delivered` when the report arrives, verifies the work, and later sets `complete` with a resolution. Implementers never run status-write verbs.
- Do not hand-edit the packet table above — run `render` instead.

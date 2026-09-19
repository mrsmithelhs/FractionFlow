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
| `plan-05` | Instructional Engine and Episode State | draft | Build the instructional layer of the pipeline in src/interaction/: the episode state machine for encounter through resolve, support configuration, response classification delegating all mathematical truth to src/math and src/content, response provenance, local error recovery, layered help, and the replay envelope. Pure logic with zero DOM and zero presentation dependencies, proven by headless tests before any renderer exists. |
| `plan-06` | Scene Model Projection and Capability Eligibility | draft | Implement the D-20 Scene Model as a pure semantic projection of validated mathematical state, instructional state, and active representation, and implement the representation-eligibility verdict that Plan 03 left deferred, with the DECISION-011 ceilings. Proves that identical inputs yield identical scene meaning, that nothing downstream computes mathematics, and that unsupported instances fail closed before any renderer sees them. |
| `plan-07` | Renderers, Strings, and the Participation Floor | draft | Build the presentation layer in src/render/: fraction-bar, symbolic, and accessible linear renderers, the centralized learner-facing strings table, beat-gated DOM mounting, tap-primary interaction with non-interactive bar segments, and the fail-first scaffold-leakage invariants. This is the packet where the participation floor, the reading-level target, and the aesthetic rubric all become real, and the highest-risk packet in the wave. |
| `plan-08` | App Shell, Condition Switcher, and Phase 2 Acceptance | draft | Assemble the first complete learner-facing episode: entry page, app shell, the reviewer-only design-condition switcher behind a gear icon, and the composed pipeline from content through instruction and scene to renderers. Then exercise it at the public GitHub Pages URL as roadmap section 16 requires, gather the participation-floor evidence, and present the whole slice against the Phase 2 exit gate for owner review. |
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

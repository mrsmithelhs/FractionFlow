# Initial Packet Wave Review — Codex

**Review date:** 2026-09-18  
**Packet-wave commit reviewed:** `94df306` (`plan: draft first implementation wave (Phase 1 foundations + Phase 2 design prep)`)  
**Review posture:** Independent, read-only review of the packet wave; no packet or status edits were made.

## Overall verdict

This is a strong first-wave design with a coherent architectural spine:

1. establish the toolchain and static deployment mechanism;
2. create exact mathematical truth independently of presentation;
3. build deterministic, fully classified content on that truth; and
4. prepare the first learner-facing slice without prematurely implementing or settling its disputed mechanics.

That is the right level of ambition for an initial wave. It does not pretend to plan the full product arc, and I would not add renderers, interaction state machines, sessions, persistence, number-line implementation, or full accessibility execution to this wave. The four packets carry the revised founding-document boundaries unusually well: static-only deployment, mathematical-state ownership, valid-versus-supported-versus-renderable distinctions, learner-evidence provenance, authored-path coverage, child-data safety, and explicit deferral of prototype questions.

I would nevertheless keep all four packets in `draft` pending a bounded revision pass. Three defects could stop or misdirect an implementer:

- Plan 01 simultaneously allows deployment mechanisms that require versioned build output and forbids build output from ever being committed;
- Plan 02 requires property-based testing without ensuring that the required test capability exists or giving the packet authority to add it; and
- the wave omits several authority-boundary statements required by the packet-writing guidance, while the generated packet README currently contradicts the canonical status rules about who sets `delivered`.

Plan 04 also needs a precise output path and the repository's required falsification structure for an investigation packet. These are repairable packet defects, not reasons to redesign the wave.

## Review coverage

### Went deep on

- `docs/development/plan-01-tooling-deployment-spike.md`
- `docs/development/plan-02-exact-arithmetic-mathematical-core.md`
- `docs/development/plan-03-content-contracts-and-deterministic-generation.md`
- `docs/development/plan-04-first-vertical-slice-design-preparation.md`
- dependency order and gate interactions across all four packets
- `docs/development/packet-creation-guidance.md`
- `docs/workflows/packet-tracking-system.md`
- the generated packet index and lifecycle text in `docs/development/README.md`
- the revised founding-document contracts directly invoked by the packets
- promoted deferred recommendations D-12, D-16, D-17, and D-20

### Swept only

- the remainder of `reports/orchestration/founding-docs-review/deferred-recommendations.md`, to confirm that the wave did not silently promote unrelated deferred work;
- `docs/decision-log.md` and `docs/project-seed.md`, for obvious ownership or sequence conflicts;
- the packet-wave Git commit for unexpected file scope and whitespace defects.

### Not covered at all

- whether a particular Node toolchain, test runner, deployment mechanism, API, schema, or RNG should win the packets' mechanism gates;
- implementation feasibility through executed prototypes;
- GitHub Pages repository/settings state or live deployment permissions;
- advisor-provider availability for future implementer threads; and
- later waves beyond the design dependencies exposed here.

## Ranked findings

### F1 — High: Plan 01's deployment options conflict with its unconditional build-output rule

**Location:** `docs/development/plan-01-tooling-deployment-spike.md`, especially Scope lines describing branch versus `docs/` folder versus GitHub Actions, the instruction to add ignore rules so build output is never committed, and Validation's requirement that no build output be staged or committed.

**Conflict:** The packet authorizes the implementer to choose among deployment mechanisms whose artifact policies differ, but it unconditionally requires build output never to be committed. A GitHub Pages `docs/`-folder mechanism requires generated site output to live in the source branch. A dedicated publishing branch commonly contains generated output. GitHub Actions can keep output untracked in the source branch and deploy an artifact. The packet therefore either silently preselects an Actions-style deployment or makes two advertised options nonconforming.

**Impact:** An implementer can reach the mechanism gate with no compliant choice except the mechanism the packet claims not to preselect. Worse, it may “fix” the conflict by weakening repository hygiene or by reporting a valid `docs/`/branch approach as prohibited.

**Recommended resolution:** Choose one of these explicitly before Plan 01 becomes `ready`:

1. **Preserve a real mechanism decision:** replace the absolute ignore/no-commit rule with a conditional artifact policy. Source-branch build output remains ignored unless the owner-approved deployment mechanism specifically requires versioned output; generated output is never treated as durable source truth, and the report must state where it is versioned and why.
2. **Preselect GitHub Actions:** if the repository has already decided that generated output must never be committed anywhere, name Actions as the intended mechanism and make the spike prove/configure it rather than presenting three live options.

The first option better matches the current project seed's open mechanism question. Validation should inspect the chosen mechanism's actual artifact boundary, not enforce an answer before the spike.

### F2 — High: Plan 02 requires a property-testing capability that neither Plan 01 nor Plan 02 owns

**Location:** `docs/development/plan-02-exact-arithmetic-mathematical-core.md` summary, Scope, Requirements 3, Validation, Stop Conditions, and Commit guidance; related Plan 01 toolchain scope.

**Conflict:** Plan 02 requires property-based tests across broad ranges. Plan 01 only promises a headless test runner and explicitly keeps dependencies minimal; it does not promise a property-testing library. Plan 02's write scope and commit paths exclude `package.json` and the lockfile. Its prescribed response if the Plan 01 runner is inadequate is to stop rather than add a narrowly justified test dependency.

**Impact:** The most likely implementation path is blocked at startup, or “property-based” gets weakened into a few hand-written loops without the mechanism gate explicitly deciding that tradeoff. This also leaves Plan 03 with the same latent problem if bulk/distribution tooling needs a justified dependency.

**Recommended resolution:** Define one wave-wide dependency policy before Plan 01 is assigned:

- Plan 01 establishes the runner and baseline scripts but does not guess all downstream libraries.
- Plans 02 and 03 may propose a narrowly justified development dependency during their mechanism-confirmation gate and, if approved, may edit `package.json` and the lockfile as explicit write-scope paths.
- Alternatively, the gate may approve a dependency-free deterministic generation harness, but the packet must then say what qualifies it as property-style testing: generated cases, shrinking or minimized counterexamples if applicable, reproducible failure seeds, input ranges, and run counts.

Do not make Plan 01 install a speculative property-testing library merely to avoid this issue; let Plan 02's API/test-plan gate decide with concrete requirements.

### F3 — High: Required implementer-authority boundaries are missing, and the README contradicts the canonical status contract

**Location:** all four packet bodies; `docs/development/packet-creation-guidance.md` section “Implementer authority boundaries”; `docs/workflows/packet-tracking-system.md` §§3 and 6; `docs/development/README.md` General Rules.

**Problem:** The packet-creation guidance requires every packet to state explicitly that the implementer:

- may not set packet completion status or edit orchestrator/owner disposition records;
- may not declare the packet or feature complete, ready to ship, or done; and
- must report against the objective rather than treating tests/counts as proof.

The packets contain useful adjacent constraints, including “no packet/status edits,” objective-specific validation, and an orchestrator gate, but they do not include the complete required authority block. At the same time, `docs/development/README.md` currently says “Implementers set `delivered` when work is complete,” while the canonical tracking guide says implementers never run the status-write verb and the orchestrator sets `delivered` when the report arrives.

**Impact:** A careful implementer reading the required sources receives contradictory status instructions, and the packet itself does not resolve the contradiction. This is exactly the kind of handshake drift the tracking system was created to prevent.

**Recommended resolution:**

1. Add the standard implementer-authority block to each packet, preferably verbatim or through one clearly cited canonical block.
2. Correct `docs/development/README.md` General Rules to say that the implementer reports and stops; the orchestrator sets `delivered`, verifies, and later sets `complete` with a resolution.
3. Keep “ready for orchestrator review: yes/no” in progress reports; that is a bounded handoff statement, not a packet-status mutation or shipping declaration.

This repair should happen before any status is changed to `ready`.

### F4 — High: Plan 04 is an investigation packet without a precise deliverable path or the required falsification table

**Location:** `docs/development/plan-04-first-vertical-slice-design-preparation.md` Packet Metadata, Scope, Prototype-variable register, Requirements, and Validation; `docs/development/packet-creation-guidance.md` section “For investigation packets: design for falsification.”

**Problem 1 — output ownership:** The packet variously says “under `docs/development/` or `docs/`,” “one folder or file set under `docs/`,” and “dossier + report.” That is not a bounded write scope. The implementer should not choose an information architecture while executing a supposedly bounded dossier packet.

**Problem 2 — falsification:** The packet does a good job naming candidate conditions, constants, and outcome measures, but it does not require the repository-standard hypothesis table with a specific falsifying observation for every rival, nor a discriminating experiment for every live pair. It also does not require the planned matrix to enumerate the real-world variation dimensions or state the conclusion rule when rivals survive.

**Impact:** Two implementers could create different artifact layouts and materially different evidence plans while both satisfying the checklist. Prototype conditions could still become a list of things to try rather than a falsifiable design.

**Recommended resolution:**

- Assign one exact dossier path, for example `docs/development/phase-2-first-slice-design/` with named files, or one exact Markdown file if a single artifact is preferable. List those paths in In scope, Expected artifacts, Validation, and Commit guidance.
- Require a prototype-question table with at least: question; rival hypotheses; observation that would falsify each hypothesis; manipulated variable; held-constant variables; outcome measures; real-world variation dimensions; discriminating experiment; and conclusion rule.
- Require the dossier to say “consistent with A and B” and name the next experiment whenever the planned evidence would not falsify all rivals.
- For the Scene Model design position, distinguish an architectural decision derived from existing state-ownership constraints from an empirical instructional hypothesis. Do not pretend the former needs learner-outcome evidence, but do record the alternative rejected and the architectural reason.

### F5 — Medium: Plan 02 is coherent but unusually broad for one implementation/review cycle

**Location:** `docs/development/plan-02-exact-arithmetic-mathematical-core.md` Scope and Requirements.

**Concern:** Plan 02 combines:

- exact rational representation and normalization;
- comparison/equivalence and gcd/lcm;
- conversion, addition, subtraction, simplification;
- mixed/improper forms and regrouping;
- denominator, magnitude, result, and family classifications;
- intermediate-step validation;
- response-pattern classification;
- property/invariant infrastructure; and
- a diverse golden-case corpus.

All of this belongs to the mathematical foundation, so the packet is conceptually coherent. The risk is operational: a large API and test surface crosses the mechanism gate at once, produces a large diff, and makes it harder to distinguish a bad primitive from a bad classification contract during review.

**Recommended resolution:** Consider splitting it while it is still a draft:

- **Plan 02a — Exact Rational Primitives and Operations:** types/value-current-form model, normalization, exact equality/comparison, gcd/lcm, conversion, addition/subtraction, simplification, mixed/improper conversion, exact benchmark comparisons, and their invariants.
- **Plan 02b — Mathematical Classification and Step Validation:** denominator/family/result/regrouping classifications, intermediate-step validators, alternate-path handling, response-pattern classifications, and golden cases.

Plan 03 would depend on 02b. If the owner prefers one packet, keep it unified but add internal milestone acceptance: primitives/invariants reviewed before classification/step-validation code proceeds. This is a risk-management recommendation, not a claim that the current scope is incoherent.

### F6 — Medium: Packet-specific advisor language partially re-scopes a thread-level obligation

**Location:** the `## Advisor Consultation` section in all four packets, especially Plan 04's statement that it is “docs-only design work with no behavioral surface of its own.”

**Problem:** The packet guidance says advisor consultation is inherited by every implementer thread and packets should not pre-classify the packet as docs-only, behavioral, warranted, or unwarranted in a way that substitutes for the thread's own declaration. Plans 02 and 03 label themselves real behavioral surfaces; Plan 04 labels itself as having no behavioral surface; Plan 01 says it is expected to be mechanical.

The sections still require the thread to record a disposition, which is good, but their classifications create avoidable tension with the canonical guidance.

**Recommended resolution:** Use one neutral paragraph in all packets:

> Advisor consultation is a thread-level obligation inherited from `AGENTS.md`. At packet start, the implementing thread must determine and record whether consultation ran, was not warranted, or a degraded mode applies, following the provider-capability and proportionality rules. This packet does not pre-classify that determination.

If the owner truly wants a non-negotiable consultation for a high-risk packet, specify owner-mediated consultation explicitly. Otherwise leave the judgment to the thread.

### F7 — Medium: Plan 04 omits two primary canonical documents from Required reading

**Location:** `docs/development/plan-04-first-vertical-slice-design-preparation.md`, Authority and contracts.

**Problem:** The dossier must define learner/system responsibility, valid and off-canonical paths, mathematical-state ownership, accessibility, scene projection, and prototype boundaries. Yet its required-reading list omits:

- `docs/founding/00-principles.md`, which owns the focal-idea, calmness, accessibility, static-only, privacy, and ownership rules; and
- `docs/founding/03-math-and-content-model.md`, which owns the exact Phase 2 family, current-form/value distinctions, common-denominator validity, canonical versus alternate paths, and representation-feasibility facts the episode must consume.

**Impact:** The design dossier could correctly follow the Interaction Grammar while misdescribing what its episode is allowed to call valid, supported, or preferred.

**Recommended resolution:** Add both as required reading with targeted sections rather than requiring an undirected reread. At minimum include Principles §§1–7, 17, 20–27 and Math/Content §§9–11, 27, 35, 54–61, 68–69, and the relevant canonical example.

### F8 — Low: Plan 01's “identical output” criterion needs a defined comparison

**Location:** `docs/development/plan-01-tooling-deployment-spike.md`, Validation Checklist.

**Problem:** “Fresh `npm ci` + build produces identical output directory contents” could mean identical file set, identical meaningful bytes, or byte-for-byte output including timestamps/hashes. Those are materially different reproducibility claims.

**Recommended resolution:** State the intended proof. Prefer a manifest/hash comparison after excluding explicitly documented nondeterministic metadata. If the chosen build is byte-reproducible, say so and prove it; otherwise do not imply a stronger property than the spike establishes.

## What is already especially good

### The wave boundary is disciplined

The wave ends at a design dossier rather than quietly implementing the Phase 2 UI. That is a strong application of investigation before mutation. It also leaves later packets room to separate interaction state, scene projection, renderers, accessibility mechanisms, and app composition instead of packing the entire slice into this first wave.

### The dependency direction matches the architecture

Plan 03 consumes Plan 02 rather than recomputing mathematics, and Plan 04 designs against classified content rather than inventing mathematical facts inside an episode. This directly preserves the unidirectional pipeline.

### Deferred recommendations are promoted selectively and transparently

- Plan 02 promotes D-17 golden-case diversity where executable math tests make it timely.
- Plan 03 promotes only the narrow version-identifier portion of D-12 rather than building replay migration prematurely.
- Plan 04 promotes D-16 and D-20 as design artifacts, not as pre-decided implementation mechanisms.

The wave does not promote number-line timing, display choreography, denominator ceilings, session dose, placement, persistence, licensing, privacy-statement wording, or share links. That is exactly the right restraint.

### The mechanism gates are substantive

Plans 02 and 03 require API/schema/test-plan proposals before implementation. These are not ceremonial approvals; they target the highest-cost mistakes: collapsing value and form, hiding family behavior in code, selecting a schema that cannot express alternate paths, or building a generator whose distributions cannot be audited.

### Evidence language is correctly bounded

Plan 04 carries forward the Phase 2 learner starting point and says exactly what the slice may and may not prove. It does not let a polished deployed episode become evidence of novice learning, durable transfer, or efficacy.

### Privacy and static-only constraints are present from the first public artifact

Plan 01's smoke page forbids tracking and data collection; Plans 02–03 use synthetic data only; Plan 04 plans child-observation boundaries without conducting observations. No packet treats future cloud or backend language as authorization.

## Sequence assessment

The fully serial chain `plan-01 → plan-02 → plan-03 → plan-04` is conservative but defensible for this first wave.

- Plan 02 genuinely needs the toolchain/test runner.
- Plan 03 genuinely needs the accepted Math Core API.
- Plan 04 intentionally promises to design against real classified instances and approved schemas, so depending on Plan 03 is coherent.

I would not introduce concurrency merely to make the board look faster. Much of Plan 04 could be outlined earlier, but its value is that it resolves against the actual contracts produced by Plans 02–03. The serial sequence reduces the risk that the design dossier becomes speculative prose.

If cycle time becomes a concern, the safer optimization is not to remove dependencies. It is to split Plan 02 as suggested above and allow review to happen at smaller mathematical milestones. Another possible future optimization is a read-only Plan 04 preflight while Plan 03 is in progress, followed by the authoritative dossier only after Plan 03 completes; that does not require changing this first wave now.

## Suggested revision order

Before changing any packet to `ready`:

1. Correct the `delivered` authority sentence in `docs/development/README.md` and add the required implementer-authority block to all four packets.
2. Resolve Plan 01's generated-output/deployment-mechanism conflict and define its reproducibility comparison.
3. Decide whether Plan 02 is split. In either case, give Plans 02–03 an explicit, gated way to add a justified development dependency and edit the manifest/lockfile.
4. Give Plan 04 one exact dossier path, add the hypothesis/falsifier/discriminating-experiment table, and add Principles plus Math/Content to Required reading.
5. Normalize the four Advisor Consultation sections to the neutral inherited rule.
6. Run `node scripts/dev/plan-status.js render` and `node scripts/dev/plan-status.js lint`.
7. Review the resulting diff against the four packet objectives, then promote only Plan 01 to `ready`. Plans 02–04 should remain draft/effectively blocked until their dependencies complete, even if their prose has already been approved.

## Final recommendation

Retain the wave and its order. Do not expand it into a full arc. Make the bounded repairs above, with F1–F4 treated as readiness blockers and F5–F8 as risk-reduction improvements. After that, Plan 01 is a sensible first assignment, and the remaining packets form a credible, evidence-bounded queue rather than an overbuilt master plan.

# Deferred Recommendations from the Founding-Document Review

## Purpose

This file preserves reviewer proposals that were deliberately omitted from the current founding-document change sequence. Each item below may have merit, was not falsified by the synthesis evidence, and does not directly contradict the settled directions being applied now. Deferral means one or more of the following:

- the answer depends on a prototype, learner observation, or later implementation evidence;
- the capability belongs to a later roadmap phase;
- the exact remedy is an owner/product decision rather than a wording repair;
- the proposal is useful implementation guidance but not yet a founding-document rule; or
- the proposal is outside the present seven-document revision boundary.

The source pointers are deliberately specific enough to recover the original argument. Review the named finding/section in the original file and the cited synthesis section before promoting any item into a packet or canonical document.

This is not a backlog of approved work. A later orchestrator should recheck scope, evidence, phase, and owner authority before creating implementation packets.

## A. Representation and instructional prototypes

### D-01 — Animated transformation versus static or key-frame comparison

**Original proposals:** Claude recommended demoting motion in favor of prediction followed by a persistent static comparison; other reviewers argued for retaining the existing animation hypothesis with replay, reduced motion, stable end states, and inspectable residue. The research review found no direct fraction-specific experiment that selects one condition.

**Why deferred:** The synthesis established an evidence gap, not a winner. The current change list preserves prediction, inspectability, reduced motion, and evidence provenance but deliberately does not make animation canonical or optional.

**Future discriminating work:** Build matched conditions with the same fraction content, prediction demand, learner control, and final inspectable state. Compare animated subdivision with static/key-frame comparison. Examine pre-reveal prediction, immediate equivalence reasoning, delayed fresh-form transfer, replay/help use, and accessibility rather than interface completion alone.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → Finding 1 and §9;
- `reports/orchestration/founding-docs-review/review-codex.md` → §9;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 2 and §9;
- `reports/orchestration/founding-docs-review/research/01-animation-vs-static-graphics.md`;
- `reports/orchestration/founding-docs-review/synthesis.md` §§2.6 and 3.1.

### D-02 — Morphing, deliberate juxtaposition, sequential replacement, and responsive anchors

**Original proposals:** Reviewers challenged both the absolute anti-simultaneity slogan and the feasibility of preserving one literal coordinate across representation changes. Suggestions included side-by-side comparison, sequential replacement, morphing with stable anchors, and persistent reference marks.

**Why deferred:** The wording contradiction is repaired in the current change list, but no evidence selects a display choreography. The synthesis rejected the claim of universal geometric impossibility because the source already says `whenever possible`, treats scenes as meaning rather than pixels, and permits hard cuts.

**Future discriminating work:** Prototype morph, deliberate juxtaposition, and sequential swap at narrow, zoomed, proper-fraction, and mixed-number layouts. Hold the connection-making demand constant. Test what learners identify as invariant and whether the final state remains inspectable. Treat fixed points as semantic anchors, not universal pixel coordinates.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → Findings 1–3;
- `reports/orchestration/founding-docs-review/review-gemini.md` → Findings 1–2 and §9;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Findings 1–2;
- `reports/orchestration/founding-docs-review/synthesis.md` §§3.2 and 3.4.

### D-03 — Early number-line magnitude probe and eventual roadmap timing

**Original proposals:** Claude and Kimi argued that magnitude is foundational and that number-line work arrives too late in Phase 4. Codex recommended an early disposable second-representation probe rather than an immediate roadmap reorder. Gemini regarded bar-first sequencing as defensible.

**Why deferred:** The internal importance of magnitude and the research support for number-line reasoning are established, but the reviewed studies do not test FractionFlow's bar-first sequence or determine a new phase. Moving number lines now would be a roadmap decision without product-specific evidence.

**Future discriminating work:** Before large bar-only breadth, build a small disposable magnitude/benchmark number-line family. Compare it with matched bar work and inspect magnitude reasoning, fresh-form transfer, accessibility, and interaction cost. Use the results to decide whether Phase 4 is too late.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → Finding 8;
- `reports/orchestration/founding-docs-review/review-codex.md` → Finding 4;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 7;
- `reports/orchestration/founding-docs-review/research/03-fraction-pedagogy.md`;
- `reports/orchestration/founding-docs-review/synthesis.md` §§2.9 and 3.8.

### D-04 — Bridge frequency and blocked versus interleaved representation schedules

**Original proposals:** Some reviewers used multiple-representation and interleaving research to argue for earlier or more frequent bridges. The synthesis noted that across-problem representation schedules are not the same intervention as simultaneous views or a morph inside one problem.

**Why deferred:** The current changes require observable connection-making but intentionally leave bridge frequency open. The cited evidence does not establish a universal FractionFlow schedule.

**Future discriminating work:** Compare blocked and interleaved schedules across matched problem sets, while keeping bridge prompt form and display condition controlled. Do not infer bridge frequency from a same-screen morph experiment.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-codex.md` → Finding 4 and §6;
- `reports/orchestration/founding-docs-review/review-kimi.md` → §6;
- `reports/orchestration/founding-docs-review/research/02-multiple-representations.md`;
- `reports/orchestration/founding-docs-review/synthesis.md` §§3.8 and 6, evidence-audit row `Bridge frequency should be higher because interleaving won`.

### D-05 — Prompt density, prediction fatigue, guessing loops, and check-the-premise cases

**Original proposals:** Gemini warned that repeated micro-prompts may create prediction gaming and interaction fatigue. Kimi highlighted guessing loops. Claude recommended intentional no-op or check-the-premise items that can reveal choreography-following, rather than merely excluding accidental no-op generation cases.

**Why deferred:** The new evidence contract distinguishes prediction from supported construction and requires provenance, but no prompt count, cadence, or no-op-family requirement is established. These are measurable content/interaction questions.

**Future discriminating work:** Compare prompt densities and response formats; retain attempt history; include a small deliberate check-the-premise set where appropriate; inspect whether learners reason about equivalence or merely follow the expected transformation ritual.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → Finding 9 and §5;
- `reports/orchestration/founding-docs-review/review-gemini.md` → Finding 8;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 8;
- `reports/orchestration/founding-docs-review/synthesis.md` §4, `Deliberate check-the-premise cases`, and §6.

### D-06 — Concrete denominator/rendering thresholds

**Original proposals:** Gemini supplied example mobile and desktop denominator ceilings; other reviews agreed that bar density and responsive feasibility require empirical bounds.

**Why deferred:** The need for representation-specific eligibility is retained in the new validity/support/renderability contract, but the proposed numbers were invented rather than measured. A single limit may also be wrong across bars, number lines, zoom, labels, and accessible alternatives.

**Future discriminating work:** Establish renderer-specific thresholds through responsive, zoom, touch-target, label, contrast, and learner-comprehension testing. Record the tested environment and fallback behavior. Treat ceilings as capability outputs, not mathematical-validity rules.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-gemini.md` → Finding 3 and §5, `Responsive Viewport Density Limits`;
- `reports/orchestration/founding-docs-review/review-codex.md` → Finding 5;
- `reports/orchestration/founding-docs-review/synthesis.md` §§2.4 and 6.

### D-07 — Quantitative session dose and completion behavior

**Original proposals:** Claude and Gemini called out the absence of a problem count, time range, pause behavior, and completion signal. Claude suggested classroom-sized practice blocks as a design input.

**Why deferred:** The current change list makes dose, pause, stopping, and completion explicit Phase 7 variables while deliberately refusing to invent a count or time threshold.

**Future discriminating work:** In Phase 7 compare a small number of bounded session compositions. Observe whether learners understand when they are done, can pause safely, and experience the work as finishable without reward-loop or endless-stream pressure.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `Session dose`;
- `reports/orchestration/founding-docs-review/review-gemini.md` → §5, `Definition of Session End and Completion Criteria`;
- `reports/orchestration/founding-docs-review/synthesis.md` §2.15.

## B. Learner routing, evidence, and later-phase state

### D-08 — First-run placement for initial-learning versus conceptual-repair learners

**Original proposals:** Kimi observed that FractionFlow names both initial learners and learners with procedural fluency but conceptual gaps, yet does not decide where either begins. Suggested remedies included a placement experience or game-like diagnostic.

**Why deferred:** The gap is plausible, but a diagnostic is only one possible remedy and would add product behavior beyond the present first-slice repair. It belongs before session composition or broad learner routing, not in the current wording pass.

**Future discriminating work:** Define what must be known before routing, compare a short readiness check with learner-selected entry and observed early-task evidence, and ensure the mechanism does not become a hidden high-stakes assessment.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 6;
- `reports/orchestration/founding-docs-review/synthesis.md` §4, `Entry/placement model`, and §7 triage row `First-run placement for novice versus repair learners`.

### D-09 — Backward routing to prerequisite-focused episodes

**Original proposals:** Claude noted that concept dependencies are documented but no behavior routes a learner backward when persistent failure reveals a prerequisite gap, such as equivalence failure inside an addition episode.

**Why deferred:** This is a sequencing/product behavior question. The first-slice learner boundary now prevents unsupported claims, but the full routing mechanism depends on later content families and evidence rules.

**Future discriminating work:** When prerequisite families exist, test a bounded route from repeated target-skill failure to a focused prerequisite episode and back. Use conceptual evidence, not procedural error count alone, and preserve learner agency.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `No backward routing to prerequisites`;
- `reports/orchestration/founding-docs-review/synthesis.md` §4, same label.

### D-10 — Shared-device identity, reset, and guest-save policy

**Original proposals:** Claude, Codex, Gemini, and Kimi raised opposing local-persistence risks: one learner may lose data after profile clearing, while another may inherit somebody else's faded scaffolds on a shared browser. Suggestions included default-off persistence, a lightweight local profile, a clear fresh-session path, and explicit reset behavior.

**Why deferred:** The current change list preserves Phase 8 as the first cross-visit local-continuity phase and keeps Phase 7 within-session. It does not choose an identity or guest-save policy. Cloud identity remains outside the founding product boundary.

**Future discriminating work:** Before Phase 8, decide whose evidence local state represents; define fresh-session and clear/reset paths; determine whether guest use saves anything; test shared-device handoff and browser-data loss. Any solution must remain local, account-free, and nonessential to first-visit practice unless a separate charter change is approved.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `Shared devices`;
- `reports/orchestration/founding-docs-review/review-codex.md` → §5, `Shared-browser progress`;
- `reports/orchestration/founding-docs-review/review-gemini.md` → Finding 6;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 4;
- `reports/orchestration/founding-docs-review/synthesis.md` §§2.8 and 3.6.

### D-11 — Portable local progress token or “progress passport”

**Original proposal:** Gemini suggested a portable URL/passphrase mechanism to survive ephemeral profiles without accounts.

**Why deferred:** The synthesis did not establish it as necessary and identified new privacy, integrity, and usability risks. It is not falsified as a possible future local-only mechanism, but it is much more than a persistence-timing clarification.

**Future discriminating work:** Consider only during Phase 8 or a later stretch investigation. Threat-model disclosure, tampering, shoulder-surfing, accidental sharing, stale schema/version handling, and child usability. Compare it with simpler reset/default-off/local-profile policies.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-gemini.md` → Finding 6 and §8;
- `reports/orchestration/founding-docs-review/synthesis.md` §§2.8, 3.6, and §4 `Portable progress passport`.

### D-12 — Replay and reproducibility across generator/content revisions

**Original proposal:** Codex noted that a seed alone may stop reproducing the same problem after generator or content changes. Durable replay may require version information or a sufficient problem snapshot.

**Why deferred:** No durable replay implementation exists yet. The issue is plausible and important when replay, debugging history, migration, or persisted sessions become real.

**Future discriminating work:** During replay/persistence design, decide whether to preserve generator/content version identifiers, immutable authored IDs, normalized problem snapshots, or a combination. Validate old-state behavior after a fixture version changes.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-codex.md` → §5, `Reproducibility across revisions`;
- `reports/orchestration/founding-docs-review/synthesis.md` §4, `Replay across revisions`.

### D-13 — Accessibility accommodations versus instructional scaffolds

**Original proposal:** Codex warned that persistent large text, spoken notation, reduced motion, or alternate input must not be treated as evidence of weak fraction understanding. Claude separately questioned whether some alternate number-line controls preserve exactly the same responsibility.

**Why deferred:** The current accessibility floor requires agency-preserving alternatives and the scaffold/evidence edits separate support configuration from evidence. The exact accommodation metadata and feature-specific equivalence tests still belong with implementation.

**Future discriminating work:** In relevant packets, mark persistent access accommodations separately from answer-revealing instructional help. For each alternate interaction, state what mathematical responsibility is preserved and where the mode necessarily measures something different.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-codex.md` → §5, `Accessibility accommodations versus instructional scaffolds`;
- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `The accessible alternative to number-line placement may not be achievable as specified`;
- `reports/orchestration/founding-docs-review/synthesis.md` §4, Codex findings.

## C. Content, validation, and authoring follow-ups

### D-14 — Misconception candidates: gap thinking, tick counting, mixed-number juxtaposition, and cross-multiplication leakage

**Original proposals:** Claude and Gemini raised gap thinking; Gemini raised tick-mark counting; Kimi suggested mixed-number juxtaposition interpreted as multiplication and cross-multiplication leakage.

**Why deferred:** These are plausible, externally or pedagogically grounded candidates, but the current content may not yet produce responses that distinguish them from arithmetic, reading, or interaction errors. Adding labels before discriminating tasks exist would invite belief inference from ambiguous behavior.

**Future discriminating work:** Revisit gap thinking with equivalence/magnitude content, tick counting with number-line content, mixed-number juxtaposition with mixed-number symbolic input, and cross-multiplication leakage with relevant denominator tasks. Add detection and feedback only when task/response design can distinguish the pattern.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `Gap thinking is missing from the misconception model`;
- `reports/orchestration/founding-docs-review/review-gemini.md` → Finding 7;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 10 and §5;
- `reports/orchestration/founding-docs-review/synthesis.md` §§2.14 and 4.

### D-15 — Undefined partial number-line scenes during representation switching

**Original proposal:** Claude found that validation requires switching after one conversion and at other intermediate states, but the Interaction Grammar does not define every two-operand partial number-line scene.

**Why deferred:** This is an established requirement/specification mismatch, but it belongs to Phase 4 number-line scene design rather than the present cross-document wording repair.

**Future discriminating work:** Before Phase 4 implementation, enumerate required switching states, define which partial states have meaningful number-line scenes, and explicitly mark unsupported transitions rather than improvising them in a renderer.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → Finding 11;
- `reports/orchestration/founding-docs-review/synthesis.md` §4, `Undefined partial number-line scenes`.

### D-16 — Automatable scaffold-leakage and answer-reveal invariants

**Original proposal:** Claude suggested inspecting serialized scene/prompt state so the requested value is not already present in an answer-revealing form. Related reviewers raised constrained-choice guessing and reveal-before-prediction risks.

**Why deferred:** The evidence/provenance contract is now specified, but the exact scene representation and test harness do not exist. This is a strong implementation-plan candidate rather than a further founding edit.

**Future discriminating work:** Once scene and prompt models exist, add fail-first tests that inspect the actual learner-visible state before each required response. Cover reveal timing, help/replay state, constrained choices, retries, and inherited bridge endpoints.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → Finding 9;
- `reports/orchestration/founding-docs-review/synthesis.md` §4, `Automatable scaffold-leakage invariant`.

### D-17 — Golden-case diversity and narrow false-pass resistance

**Original proposal:** Claude noted that one regrouping golden case has a result equal to the subtrahend, which could allow a narrow regression to pass accidentally.

**Why deferred:** This is a plausible test-design improvement, not a founding-document defect. It should be handled when executable math/content tests and fixtures are created.

**Future discriminating work:** Ensure golden cases vary results, carries/borrows, whole/fraction relationships, and path choices so a wrong implementation cannot pass through one coincidental equality. Pair examples with property-based exact-arithmetic checks.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5 / single-reviewer `Golden-case weakness`;
- `reports/orchestration/founding-docs-review/synthesis.md` §4, same label.

### D-18 — Content-authoring workload, tiering, and review budget

**Original proposals:** Claude and Kimi warned that problem families × beats × errors × hints × support levels × alternate paths could exceed the review budget. Kimi proposed tiering or parameterization; the synthesis accepted the need for bounded path coverage but did not estimate or redesign authoring.

**Why deferred:** The new authored-path contract prevents missing coverage from becoming false mathematics, but the actual authoring system and cost cannot be determined before representative content exists.

**Future discriminating work:** Prototype one canonical and one supported noncanonical path through help/recovery; inventory which text can be parameterized; identify beats needing authored variants; measure review effort before creating a general authoring framework.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → Findings 6 and 10, plus §5 `Content-authoring workload`;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 9;
- `reports/orchestration/founding-docs-review/synthesis.md` §2.13.

### D-19 — Curriculum/standards alignment and readability targets

**Original proposals:** Claude and Kimi suggested a small CCSS mapping for the upper-elementary progression. Claude also suggested a readability ceiling and prompt-length target; Codex emphasized low-reading-burden recovery.

**Why deferred:** These may improve teacher trust and learner access but were not necessary to repair internal contradictions. Exact standards claims, readability thresholds, and prompt limits need a dedicated content/audience review.

**Future discriminating work:** Map Stages A–K to relevant standards without letting codes dictate pedagogy; test learner-facing prompts for reading burden with the intended age range and multilingual/reading-difficulty cases; set quantitative limits only after examples are tested.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `Curriculum alignment` and `Reading level and multilingual learners`;
- `reports/orchestration/founding-docs-review/review-codex.md` → §5, `Low-reading-burden recovery`;
- `reports/orchestration/founding-docs-review/review-kimi.md` → §5, curriculum anchor.

## D. Architecture, release, and repository follow-ups

### D-20 — Scene Model as a pure projection rather than a second state store

**Original proposal:** Claude observed tension between naming a Scene Model and the architectural rule that derived state should be recomputed rather than independently stored.

**Why deferred:** This is a plausible implementation-architecture clarification, but no Scene Model implementation exists. The current pipeline changes do not require choosing a concrete representation.

**Future discriminating work:** In the relevant architecture/implementation packet, state whether the scene is a pure projection of validated problem state, instructional state, and active representation. If anything is stored, justify why it is source state rather than a cache that can drift.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `Scene Model's status`.

### D-21 — Offline resilience and service-worker/PWA mechanism

**Original proposal:** Claude noted that the quality document expects core practice to survive network loss after assets load but does not select an offline mechanism such as a service worker.

**Why deferred:** Offline resilience is compatible with static-only deployment, but a PWA/service worker is an implementation choice with cache invalidation, update, and deployment consequences. The founding documents need not choose it before the tooling spike.

**Future discriminating work:** During deployment/tooling design, test the actual GitHub Pages build under offline/reload/update conditions. Choose the smallest mechanism that satisfies the agreed offline behavior and document cache/version failure modes.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `Offline resilience`.

### D-22 — Concrete accessibility standard, supported-environment matrix, and feature-specific input mechanisms

**Original proposals:** Claude proposed naming WCAG 2.2 AA; Gemini proposed a dedicated mobile math keypad and later audio/earcon work; Kimi called for reduced-motion and screen-reader transformation mechanisms.

**Why deferred:** The current change list establishes a capability-based floor and evidence separation but deliberately avoids an unverified conformance claim, fixed browser/assistive-technology matrix, keypad requirement, or sonification mandate. These options were not falsified; they require implementation-specific evaluation.

**Future discriminating work:** During the first learner-facing slice, choose a supported-environment matrix, test applicable WCAG criteria, prototype fraction entry on mobile/keyboard, and compare accessible transformation descriptions or linear alternatives. Treat audio as optional research unless a tested access requirement supports it.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `No accessibility conformance target`;
- `reports/orchestration/founding-docs-review/review-gemini.md` → Findings 5 and §5;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 2 and §5;
- `reports/orchestration/founding-docs-review/synthesis-edit-recommendations/10-scope-accessibility-privacy.md` §4 deferred items.

### D-23 — Project license selection and root license/asset notices

**Original proposals:** Claude and Kimi noted that free access does not grant reuse rights and recommended a root license, potentially with distinct treatment for code, instructional content, and assets.

**Why deferred:** The current change list records the owner decision boundary but deliberately does not decide open-source, OER, mixed, or restricted terms and does not create a license artifact.

**Future discriminating work:** Before public release claims invite reuse, the owner should choose the intended terms for code, authored instructional text, images, fonts, and third-party assets; then add the appropriate root license and notices in a separately reviewed task.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `No LICENSE file exists`;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 11 and §5;
- `reports/orchestration/founding-docs-review/synthesis.md` §2.16.

### D-24 — Plain-language public privacy statement and hosting-log claims

**Original proposal:** Kimi recommended a short privacy statement even if the application collects no learner data, while cautioning that claims about GitHub Pages or other host logs require verification.

**Why deferred:** The founding documents now state the internal data boundary, but a public-facing privacy artifact is release work. Its precise hosting/log language can drift and should be verified when the deployment mechanism is real.

**Future discriminating work:** Before public release, write a plain-language statement of what the application itself stores locally, what it does not collect or transmit, how local data can be cleared, and what the selected host may log. Verify host claims against then-current authoritative documentation.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 11 and §4 single-reviewer note `Plain-language privacy statement`;
- `reports/orchestration/founding-docs-review/synthesis.md` §4 and triage discussion of privacy/release artifacts.

### D-25 — Feature-specific share-link schema and URL-input validation

**Original proposals:** Claude and Kimi recommended treating future URL-encoded practice configurations as untrusted input and validating them against the same content contract as generated problems. Claude also saw teacher share links as a potentially valuable adoption feature.

**Why deferred:** Shareable configurations remain a stretch feature. Security requirements are sound in principle, but there is no schema, parser, or approved feature to specify now.

**Future discriminating work:** If the feature is authorized, define a versioned, bounded schema; reject unknown/oversized/invalid values; validate decoded problems through the normal content contract; encode no learner identity or progress; and test malformed/tampered URLs. Separately decide whether share links remain stretch or become core-adjacent.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, security and `Teacher share-links`;
- `reports/orchestration/founding-docs-review/review-kimi.md` → Finding 12;
- `reports/orchestration/founding-docs-review/synthesis.md` §4 and §7 triage row `Share-link URL/configuration validation`.

### D-26 — Concrete supply-chain and browser security controls

**Original proposals:** Claude proposed a committed lockfile, pinned versions, self-hosted assets, CSP, and dependency minimization. Codex proposed provenance, safe text rendering, bounded parsing, local-data validation, and minimal deployment permissions.

**Why deferred:** The current architecture change adds a minimal dependency/origin posture but does not select package tooling, CSP/SRI mechanics, a scanner, or deployment permissions before the tooling/deployment design exists.

**Future discriminating work:** In the tooling packet, choose reproducible dependency/version controls, audit third-party licenses and provenance, prevent runtime tracking origins, validate untrusted inputs and local state, and keep deployment permissions minimal. Test the produced artifact rather than claiming security from a checklist.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §5, `No security posture at all`;
- `reports/orchestration/founding-docs-review/review-codex.md` → §5, `Basic security controls`;
- `reports/orchestration/founding-docs-review/synthesis.md` §2.16.

### D-27 — Useful-limited-product/public-MVP timing

**Original proposals:** Claude wanted a publishable product milestone before the complete core; Codex distinguished a useful limited slice from a mature core; the synthesis rejected treating a Phase 3 public MVP as compelled by the evidence.

**Why deferred:** The current roadmap change defines prototype, useful limited product, and substantial core release, and maps early deployment proof. It does not decide when or whether the owner should publicly promote a useful limited product.

**Future discriminating work:** After the first slice has real deployment, accessibility, and learner evidence, the owner may decide whether its bounded pathway and explicit limitations justify a public limited-product milestone. Do not infer that decision from the existence of a URL.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → Finding 7;
- `reports/orchestration/founding-docs-review/review-codex.md` → Finding 4;
- `reports/orchestration/founding-docs-review/synthesis.md` §2.10.

### D-28 — Targeted de-duplication beyond the current scaffold/terminology repairs

**Original proposals:** Claude and Gemini argued that the large normative surface and repeated examples create drift risk. Codex and Kimi cautioned that local restatement can orient readers and that repeated text is not automatically conflicting.

**Why deferred:** The current pass normalizes concrete drift—scaffold ownership, denominator/state terms, evidence labels, and roadmap status. A wholesale rewrite based on line count would risk removing useful local context without implementation evidence.

**Future discriminating work:** After initial implementation packets, audit which repeated passages produced divergent behavior or confused implementers. Consolidate those with explicit canonical ownership and cross-references; retain repetition that serves a distinct local validation or orientation purpose.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → cross-document normalization and §8;
- `reports/orchestration/founding-docs-review/review-gemini.md` → cross-document normalization;
- `reports/orchestration/founding-docs-review/synthesis.md` §3.7.

### D-29 — Repository process clutter and provider-note publication

**Original proposal:** Claude raised repository-governance concerns about process artifacts and provider-specific notes appearing in public-facing surfaces.

**Why deferred:** The synthesis treated this as outside the founding-document revision and not a PII finding. It may still matter for repository clarity and public presentation.

**Future discriminating work:** Run a separate repository-publication audit that classifies process files, provider notes, generated reports, and intended public documentation. Do not delete provenance or workflow artifacts merely because they are not learner-facing.

**Source trail:**

- `reports/orchestration/founding-docs-review/review-claude.md` → §4/§5 publication and process observations;
- `reports/orchestration/founding-docs-review/synthesis.md` §4, `Public-repository process clutter and provider-note publication`.

## Explicitly not preserved as deferred recommendations

The following claims were omitted because the synthesis found that their asserted defects were unsupported or their default remedy would conflict with settled directions. A later owner may still reopen a topic with new evidence, but these are not carried forward as merit-preserving recommendations:

- that fixed semantic anchors are universally geometrically impossible;
- that static graphics, animation, morphing, or simultaneous display is already proven superior for FractionFlow;
- that all denominator/family classification must operate on globally reduced values;
- that the architecture's three-stage, five-stage, and nine-layer descriptions are contradictory;
- that every mathematically valid denominator must be accepted or rendered literally;
- that raw child observations must be committed as durable validation assets;
- that cloud accounts, telemetry, remote persistence, or a backend are authorized by the founding scope; and
- that a portable progress mechanism, dedicated keypad, sonification, fixed denominator ceiling, or fixed session dose is already a requirement.

## Promotion rule

To promote a deferred item into an implementation plan, the orchestrator should record:

1. the item ID from this file;
2. the current roadmap phase and canonical document owner;
3. what new evidence or owner decision makes the work timely;
4. the smallest discriminating prototype or implementation slice;
5. explicit non-goals, especially nearby rejected remedies;
6. validation that measures the intended mathematical or learner outcome rather than interface completion; and
7. any privacy, accessibility, deployment, or shared-device gate that applies.

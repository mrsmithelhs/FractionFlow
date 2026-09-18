# Scope, Accessibility, Privacy, and Static-Boundary Recommendations

## 1. Scope

This file addresses the requested cluster of definite improvements:

1. make the static-only/no-backend product boundary authoritative over exploratory “static-first” and optional-service language;
2. establish an explicit accessibility acceptance floor, while separating mechanized checks from child usability evidence;
3. add a short, safe governance boundary for child-usability work; and
4. determine whether licensing intent and a minimal dependency/third-party-origin security posture have clear founding-document homes; and
5. tighten roadmap/release governance around the deployment spike, release vocabulary, session-dose experimentation, and within-session versus later persistence.

Deep-read files:

- `docs/founding/00-principles.md`
- `docs/founding/04-system-architecture.md`
- `docs/founding/05-quality-and-validation.md`
- `docs/founding/06-roadmap.md`
- `docs/project-seed.md`
- `docs/README.md`
- `docs/decision-log.md`
- `reports/orchestration/founding-docs-review/synthesis.md`

Swept for cross-document effects:

- `README.md`
- `reports/orchestration/founding-docs-review/review-claude.md`
- `reports/orchestration/founding-docs-review/review-codex.md`
- `reports/orchestration/founding-docs-review/review-gemini.md`
- `reports/orchestration/founding-docs-review/review-kimi.md`

Topics intentionally outside this assignment: selecting a framework or test runner; choosing a particular accessibility technology, screen reader, or scanner; selecting an animation or representation design; setting denominator, performance, or prompt thresholds; designing a backend; defining legal or regulatory compliance; defining an institutional research protocol; and deciding whether the product should be open-source/OER rather than merely recording that this is an owner decision.

## 2. Recommendation index

| ID | Target | Operation | Recommendation | Evidence status | Owner gate |
|---|---|---|---|---|---|
| 10-01 | `docs/founding/00-principles.md` §20–21; conforming architecture and roadmap references | REPLACE | State that static-only, no accounts, local-only learner data is the authorized founding product boundary; any remote service requires an explicit owner-approved charter change and cannot be smuggled in under “static-first” language. | ESTABLISHED | decision required |
| 10-02 | `docs/founding/05-quality-and-validation.md` accessibility acceptance material; `docs/founding/00-principles.md` §17; `docs/founding/06-roadmap.md` §68 | ADD | Name a minimum first-slice participation floor and distinguish automated/mechanized checks, human review, and child usability evidence. | ESTABLISHED | wording review |
| 10-03 | `docs/founding/05-quality-and-validation.md` §53 and/or child-review guidance | ADD | Add an adult-permission, data-minimizing governance boundary for child usability work and synthetic/public fixtures by default. | ESTABLISHED | wording review |
| 10-04 | `docs/founding/00-principles.md` free/low-friction section | ADD | Record licensing intent as an explicit owner decision, without claiming an open-source or OER license has been selected. | ESTABLISHED | decision required |
| 10-05 | `docs/founding/04-system-architecture.md` §60 and dependency/security material | ADD | Give dependencies and third-party origins a minimal static-app posture: minimize them, pin/audit provenance, and do not make runtime origins necessary for core practice; defer feature-specific URL/share-link validation until that feature exists. | PLAUSIBLE | wording review |
| 10-06 | `docs/founding/06-roadmap.md` Phase 1–2 | ADD | Map the existing GitHub Pages deployment spike into the earliest truthful roadmap phase: establish the static deployment mechanism early, then prove the complete first slice at the public URL before treating deployment as demonstrated. | ESTABLISHED | wording review |
| 10-07 | `docs/founding/06-roadmap.md` product-stage/core-release material | ADD | Distinguish prototype, useful limited product, and substantial core without introducing an undecided “MVP” label or implying that public availability alone proves the core promise. | ESTABLISHED | wording review |
| 10-08 | `docs/founding/06-roadmap.md` Phase 7 §§51–58 | ADD | Treat session dose, stopping, and completion behavior as Phase 7 prototype variables to observe and refine, not fixed conclusions in the founding documents. | ESTABLISHED | wording review |
| 10-09 | `docs/founding/06-roadmap.md` Phase 7–8 §§57–63 | ADD | Clarify that Phase 7 continuity is within-session composition and that Phase 8 is the later phase for modest local cross-session continuity; do not move persistence earlier or require it for core use. | ESTABLISHED | wording review |

## 3. Detailed recommendations

### 10-01 — Make the static-only boundary authoritative

**Target:** `docs/founding/00-principles.md` → `# 20. Free and Low-Friction by Default` and `# 21. Privacy Should Follow Data Minimization`

**Operation:** REPLACE

**Evidence status:** ESTABLISHED

**Owner gate:** decision required

**Problem:** `docs/project-seed.md` states the defining constraint plainly: “Static-only architecture. No server, no accounts, and no backend,” with learner progress local to the browser. The founding set also calls the product “static-first,” says future services could include synchronized progress and telemetry, and allows a persistence adapter to store data “eventually in a remote service.” The later language is useful as architectural foresight, but it does not say whether adding such a service is merely an implementation choice or a product-scope decision. That ambiguity could authorize a backend by interpretation even though the defining constraint does not. The synthesis classifies this as an established authorization ambiguity and recommends an explicit charter-change gate.

**Current anchor/text:**

> A static-hosting-compatible architecture such as GitHub Pages is preferred where it does not compromise the instructional goals.
>
> Core practice should work locally in the browser whenever reasonably possible.
>
> Future features requiring accounts, servers, analytics, synchronization, or cloud persistence should justify the additional complexity and privacy implications.

**Proposed wording:**

> The founding product boundary is static-only: the core experience must run from static assets on GitHub Pages or an equivalent static host, without a server, backend, account, authentication, analytics, or remote learner-data service. Learner progress, if supported, remains local to the learner’s browser. “Static-first,” “optional service,” and “future backend” describe exploratory architecture only; they do not authorize implementation.
>
> Any proposal to add a server, backend, account, authentication, analytics, synchronization, cloud persistence, or remote learner-data service requires an explicit owner-approved charter change that revisits scope, data collected, purpose, retention, access, deletion, operational responsibility, and the continued availability of the static core. No such service may become a prerequisite for generating valid problems, validating answers, rendering representations, or running an instructional episode without that charter change.

In `docs/founding/00-principles.md` §21, replace the existing opening of the remote-storage paragraph with:

> Remote storage is outside the founding product boundary. If an owner-approved future charter change introduces it, the project must explicitly define:

**Rationale:** This preserves the adopted static-only seed constraint while retaining a safe place to discuss future possibilities. It makes “backend is a product commitment” operational: a future service is not authorized by a roadmap bullet or an adapter abstraction. It also preserves the no-accounts, no-surveillance, local-only posture and owner control.

**Conforming edits:**

- In `docs/founding/04-system-architecture.md` §3, change “The application should remain capable of later adding optional services” to “The application may be designed so that an owner-approved future charter change could add optional services,” and add a cross-reference to the §20 boundary above.
- In `docs/founding/04-system-architecture.md` §57 (persistence adapter), change “eventually in a remote service” to “only under an owner-approved future charter change,” or state that the founding adapter is local-or-nowhere.
- In `docs/founding/04-system-architecture.md` §84 and §96, retain the decision checkpoints but state that they are gates for a possible charter change, not authorization to build a backend.
- In `docs/founding/06-roadmap.md` §93 and the stretch-feature entries for cloud accounts, retain them as deferred owner decisions and add “does not authorize implementation.”
- In `docs/project-seed.md`, no substantive change is required because its static-only wording is the authority; a later owner pass may add a cross-reference if the project wants context documents to repeat the gate.
- Search for `static-first`, `optional service`, `remote service`, `backend`, `cloud persistence`, `account`, and `telemetry`; each occurrence should either describe the already-authorized static boundary or explicitly identify a future charter-change dependency.

**Preserves:** Static GitHub Pages deployment, no accounts, local-only learner data, no mandatory analytics, static core availability, and the architecture’s ability to keep future ideas at the edges. It does not decide whether any future service should ever be approved.

**Conflicts or dependencies:** This overlaps the roadmap/deployment recommendation cluster and any separate persistence recommendation. Those edits must not weaken the boundary or turn a stretch listing into authorization. The owner must decide whether the phrase “explicit owner-approved charter change” is the project’s chosen decision mechanism; the proposed wording intentionally does not define who besides the owner participates.

**Verification:** After editing, compare the relevant passages against `docs/project-seed.md` §21. Run searches for the terms above and inspect every hit. Confirm that core-release and first-slice requirements still say local operation without a backend and that no future-service sentence uses “optional” as if it were pre-approved.

### 10-02 — Establish an accessibility participation floor and evidence split

**Target:** `docs/founding/05-quality-and-validation.md` → the accessibility validation section containing `# 44. Accessibility Must Preserve Agency` and `# 81. Feature Acceptance Levels`

**Operation:** ADD

**Evidence status:** ESTABLISHED

**Owner gate:** wording review

**Problem:** The founding documents already name keyboard, touch, reduced motion, color independence, semantic accessibility, responsive layout, and alternatives to precision dragging. They also correctly require adaptations to preserve learner responsibility. What is missing is a minimum acceptance floor: “accessibility validated” and “intended access modes” can be interpreted differently by implementers. The documents also describe child usability evidence but do not explicitly prevent a scanner result or a manual inspection from being treated as proof that children can complete a meaningful episode. The floor should name capabilities, not a particular tool, threshold, or sensory mechanism.

**Current anchor/text:**

> ## Accessibility validated
>
> Core interactions meet agreed accessibility expectations.

and:

> Early usability work does not need to be a formal research study to reveal obvious design failures.

**Proposed wording:**

> # Accessibility Acceptance Floor
>
> For the first complete learner-facing episode, acceptance requires at minimum:
>
> - every required learner decision and response can be completed without precision dragging, using keyboard-operable controls and a non-drag touch or equivalent control path;
> - the episode remains usable with motion reduced or disabled, without hiding mathematical meaning in animation;
> - mathematical meaning and available actions are conveyed through semantic, programmatically inspectable content and an accessible linear alternative where the visual scene alone is insufficient;
> - focus, reading order, labels, status changes, contrast, text size, and responsive layout are reviewed for the supported first-slice environments; and
> - the accessible path preserves the same mathematical responsibility and does not reveal a response that the visual path asks the learner to reason out.
>
> This is a participation floor, not a claim that the product is universally accessible. A feature cannot be called `Accessibility validated` until the floor is met and the evidence below is recorded.
>
> **Evidence must be separated by kind:**
>
> - mechanized checks may catch structural regressions such as missing labels, focus failures, keyboard reachability, contrast violations, or reduced-motion regressions;
> - human review must inspect the complete episode, semantic meaning, state changes, and agency-preserving alternatives; and
> - child usability evidence may reveal wording, affordance, pacing, or motor difficulties that neither mechanized checks nor adult inspection establishes.
>
> Passing a scanner, a checklist, or a single adult walkthrough is not evidence that children can use the episode successfully. Conversely, a child usability observation is not a substitute for repeatable regression checks. Record each evidence kind separately and leave untested modes explicitly untested.

Add to `docs/founding/06-roadmap.md` §68 after its existing list:

> The first complete episode must meet the accessibility participation floor in `docs/founding/05-quality-and-validation.md` before it is treated as an integrated candidate. Mechanized checks, human accessibility review, and child usability evidence are separate evidence requirements; none may be represented as proof of the others. The exact tools and supported-environment matrix are implementation and prototype outputs.

**Rationale:** This turns an existing commitment into a testable acceptance contract without inventing WCAG conformance, a scanner, a browser matrix, or a claim that testing has already happened. It preserves the agency rule and makes “not tested” visible instead of silently treating absence of evidence as success.

**Conforming edits:**

- In `docs/founding/00-principles.md` §17, replace “reasonable screen-reader interpretation where feasible” with “semantic, programmatically inspectable content and an accessible linear alternative where the visual scene alone is insufficient,” while retaining the implementation-specific caveat in the new floor if desired.
- In `docs/founding/06-roadmap.md` §25 and §68, use the same phrase “accessibility participation floor” and preserve the existing touch, keyboard, reduced-motion, semantic, color, responsive, and no-precision-dragging checks.
- In `docs/founding/05-quality-and-validation.md` §81, change “Core interactions meet agreed accessibility expectations” to “Core interactions meet the accessibility participation floor and have separate mechanized, human-review, and (where conducted) child-usability evidence recorded.”

**Preserves:** The project’s child-centered accessibility commitment, reduced motion, focus and semantic requirements, touch and keyboard operation, and the rule that adaptations preserve mathematical responsibility. It does not select sonification, require identical sensory experiences, or claim completion of any test.

**Conflicts or dependencies:** This overlaps the broader accessibility/interaction recommendations about number-line controls, representation switching, and alternative input. Those clusters should supply their own feature-specific checks but should not lower this floor. The exact supported environment set remains a prototype/owner decision.

**Verification:** Check that every required action in the first episode has a non-drag path and a semantic/linear representation where needed. Run mechanized checks and record their scope separately from human review. Confirm that the roadmap and acceptance-level wording use the same floor and that no passage claims universal accessibility or completed child testing.

### 10-03 — Add a bounded child-usability governance rule

**Target:** `docs/founding/05-quality-and-validation.md` → `# 53. Small-Sample Testing Still Has Value`

**Operation:** ADD

**Evidence status:** ESTABLISHED

**Owner gate:** wording review

**Problem:** The founding text appropriately treats a few learners’ observations as design evidence rather than proof of efficacy, and the synthesis recommends a short governance boundary. It does not state the minimum handling rules for working with children or retaining notes. The repair should be practical and narrow: adult permission, no public identifying information or raw learner artifacts, de-identified notes, and synthetic/reconstructed/public fixtures by default. It should not assert a legal regime or call the activity formal research.

**Current anchor/text:**

> Early usability work does not need to be a formal research study to reveal obvious design failures.

**Proposed wording:**

> Any child usability observation must have appropriate adult permission before the session. The project should collect only what is needed to inspect the interaction and should not place names, contact details, identifiable screenshots, recordings, student work, or other learner artifacts in the public repository, issue tracker, test fixtures, or deployment. Retained notes should be de-identified and limited to observed interaction evidence, design impact, and follow-up questions. Use synthetic, reconstructed, or already-public fixtures for automated and regression tests by default; use a real learner artifact only when an owner has reviewed the need, handling, and removal path. These observations are product-design evidence, not a claim of formal research approval or instructional efficacy.

Add after the paragraph above:

> If permission, safe handling, or de-identification cannot be established, do not retain the observation or artifact; record the design question without the learner’s identifying material.

**Rationale:** This directly implements the synthesis’s recommended child-usability/privacy boundary while respecting the repository’s absolute public-remote PII boundary. “Appropriate adult permission” is intentionally less expansive than a legal-policy claim and leaves the owner to decide the operational process.

**Conforming edits:**

- In `docs/founding/00-principles.md` §20–21, add a short cross-reference such as “Child usability evidence follows the data-minimization and public-repository boundary in `docs/founding/05-quality-and-validation.md`.”
- In `docs/founding/05-quality-and-validation.md` §77 (durable validation assets), clarify that version-controlled acceptance examples are synthetic, reconstructed, or public fixtures by default; this does not require raw observations to be committed.
- In `docs/founding/06-roadmap.md` child-review and core-release gates, refer to “de-identified design evidence” rather than implying that raw learner records are a release artifact.

**Preserves:** The value of small-sample usability observation, the distinction between design evidence and efficacy, owner review, and the no-student-data/public-repository boundary. It does not establish a legal consent standard, permit public learner data, or require a formal study.

**Conflicts or dependencies:** This overlaps the repository PII/privacy guardrail and any future release checklist. It should not be expanded into a data-retention policy, school research protocol, or analytics design in this edit cluster.

**Verification:** Search founding documents and repository guidance for `learner`, `student`, `screenshot`, `recording`, `artifact`, `fixture`, and `consent/permission`. Confirm that examples and fixtures are explicitly synthetic/reconstructed/public by default, that retained notes are de-identified, and that no text directs an agent to commit raw child observations.

### 10-04 — Record licensing intent without silently choosing a license

**Target:** `docs/founding/00-principles.md` → `# 20. Free and Low-Friction by Default`

**Operation:** ADD

**Evidence status:** ESTABLISHED

**Owner gate:** decision required

**Problem:** “Freely usable” and “free to use” do not establish whether repository code, instructional text, images, or other assets may be modified, redistributed, or incorporated into other educational materials. The synthesis identifies licensing intent as absent and recommends a founding-document note only if open-source/OER reuse is intended. The founding text should surface the decision, not invent a license or imply that a license file already exists.

**Current anchor/text:**

> The project is intended to be freely usable.

**Proposed wording:**

> Licensing intent is an owner decision separate from the static-hosting and privacy constraints. Before public release, the owner must decide whether the code, instructional content, visual assets, and other repository materials are intended for open-source, open-educational-resource, mixed, or more restricted reuse, and record the selected terms in the appropriate repository license and asset notices. “Freely usable” does not by itself grant permission to copy, modify, or redistribute every project asset.

**Rationale:** This is a definite coherence and safety improvement: it prevents a public repository’s “free” language from being mistaken for a grant of reuse rights. It deliberately routes the license selection to the owner and repository release work instead of guessing a legal instrument.

**Conforming edits:**

- In `docs/founding/06-roadmap.md` release preparation, add licensing and asset-attribution review as a release checklist item if that checklist is maintained there.
- In `README.md`, any public “free” statement should link to the selected license only after the owner chooses one; before that, avoid implying blanket reuse permission.
- Do not add a license file as part of this recommendation; that is a separate owner-authorized repository change.

**Preserves:** Free access, no payment or account requirement, and the owner’s ability to choose different terms for code, content, and assets. It does not decide open source versus OER or make legal claims about unlicensed material.

**Conflicts or dependencies:** This overlaps release-preparation and public-repository documentation work. It depends on an owner decision; no implementation should infer a license from this recommendation.

**Verification:** Confirm that the founding text distinguishes free access from reuse permission, that no selected license is named before owner approval, and that any later root license and asset notices match the owner’s decision.

### 10-05 — Add a minimal dependency and third-party-origin posture

**Target:** `docs/founding/04-system-architecture.md` → `# 60. Dependencies Should Earn Their Complexity`

**Operation:** ADD

**Evidence status:** PLAUSIBLE

**Owner gate:** wording review

**Problem:** Section 60 already evaluates bundle impact, maintenance, longevity, accessibility, static-host compatibility, and architectural violations. It does not explicitly state a minimal third-party-origin posture for a static public app: core practice should not depend on runtime CDN calls, remote scripts, uncontrolled fonts, tracking, or an origin whose failure breaks the lesson. This is a bounded safety improvement grounded in the static/no-tracking posture, but feature-specific URL/share-link validation is not yet in scope and should remain deferred.

**Current anchor/text:**

> However, FractionFlow should avoid dependency accumulation merely for developer convenience.
>
> A dependency should be evaluated against:
>
> - bundle impact;
> - maintenance;
> - longevity;
> - accessibility;
> - static-host compatibility;
> - whether it encourages architectural violations.

**Proposed wording:**

> For the static core, prefer dependencies that can be reviewed, reproducibly built, and served with the application’s static assets. Avoid making core practice depend on runtime CDN requests, third-party scripts, remote fonts, tracking origins, or other external origins whose outage, substitution, or policy change could block or alter a lesson. When a dependency or external origin is proposed, record its purpose, provenance, version/update approach, license, bundle/runtime role, failure behavior, and whether it can observe learner activity. Keep feature-specific URL, share-link, and untrusted-input validation requirements with the design of that feature; this section does not authorize those features.

**Rationale:** The recommendation makes the existing dependency evaluation actionable without requiring a particular package manager, CSP, SRI mechanism, hosting arrangement, or security certification. It aligns third-party-origin choices with static reliability, privacy, and reproducibility. The evidence status is `PLAUSIBLE` because concrete risk depends on future tooling and features, while the minimal posture is a low-cost coherence improvement.

**Conforming edits:**

- In `docs/founding/04-system-architecture.md` §2, add “runtime third-party origins” to the list of things the initial architecture avoids requiring, while allowing development-time tooling that is not required by the deployed core.
- In `docs/founding/05-quality-and-validation.md` technical robustness and privacy review, add checks that the built core remains usable when optional external origins are unavailable and does not silently depend on tracking services.
- In `docs/founding/06-roadmap.md` §70, retain the no-tracking check; do not add share-link validation until the stretch feature is designed.
- No new dependency, origin, scanner, or security policy is selected by this recommendation.

**Preserves:** Static hosting, local-only core practice, no silent tracking, deferred tooling choices, and the principle that dependencies must earn their complexity. It does not ban all development tooling or decide whether a future optional feature may use a remote origin after owner review.

**Conflicts or dependencies:** This overlaps any future deployment, build-tooling, or share-link recommendation. If another proposal selects CDN-hosted runtime assets, that proposal must explicitly reconcile the static-core posture and owner gate rather than treating this recommendation as an automatic ban on all external services.

**Verification:** Inspect the built artifact and deployment configuration for runtime CDN/script/font/tracking dependencies. Test core practice with optional origins unavailable. Review each adopted dependency against the proposed provenance, license, update, failure, and learner-observation fields. Confirm that no share-link or URL policy is claimed as complete before that feature is designed.

### 10-06 — Map the GitHub Pages deployment spike into the roadmap

**Target:** `docs/founding/06-roadmap.md` → `# 11. Phase 1 — Mathematical Foundation` and `# 16. Phase 2 — The First Excellent Episode`

**Operation:** ADD

**Evidence status:** ESTABLISHED

**Owner gate:** wording review

**Problem:** `docs/project-seed.md` already names a GitHub Pages deployment spike and requires the published URL to work end-to-end with no backend, but the roadmap’s phase sequence only mentions reliable static deployment later as a core-product goal. Without a phase mapping, an implementer can treat deployment as a late release concern or claim a local build proves public hosting. The truthful distinction is an early mechanism check followed by a first-slice end-to-end proof.

**Current anchor/text:**

> The goal is not yet to build the learner experience.

and:

> Phase 2 should implement a single complete learner-facing vertical slice for unlike-denominator proper-fraction addition.

**Proposed wording:**

Add at the end of `# 11. Phase 1 — Mathematical Foundation`:

> **Static deployment spike.** During Phase 1, establish and record the chosen static deployment mechanism, including the build-output path and a harmless published smoke check. This spike proves deployment plumbing only; it does not prove that the learner-facing experience works.

Add to `# 16. Phase 2 — The First Excellent Episode`, after the first paragraph:

> The Phase 2 slice must also be published through the chosen static deployment path and exercised at the public GitHub Pages URL (or equivalent static host) with no backend. Local success and a successful asset smoke check are not substitutes for this end-to-end check.

**Rationale:** This maps the already-authorized seed spike to the earliest phases without pretending that a mathematical foundation can prove a browser episode. It preserves the static-only boundary and makes public deployment evidence auditable before expansion.

**Conforming edits:**

- In `docs/project-seed.md` “GitHub Pages deploy spike,” add a cross-reference to Phase 1’s mechanism spike and Phase 2’s end-to-end proof if desired; its existing wording remains authoritative.
- In `docs/founding/06-roadmap.md` §64–65, keep “reliable static deployment” as an integration review item, but clarify that it is a recheck/hardening pass rather than the first deployment proof.
- Do not add a public-MVP milestone or require a specific branch, `docs/` folder, or Actions mechanism; the seed explicitly leaves that mechanism to the spike.

**Preserves:** Static GitHub Pages, no-backend operation, the narrow Phase 2 slice, and the distinction between tooling/deployment plumbing and instructional validation. It does not claim that the site has already been deployed.

**Conflicts or dependencies:** Depends on `10-01`’s static authorization boundary. It overlaps deployment/release recommendations outside this cluster; those should not move the spike later without explaining why the existing seed requirement is no longer truthful.

**Verification:** Confirm Phase 1 contains a deployment-mechanism check and Phase 2 contains a public end-to-end check. Verify that neither says deployment proves pedagogy, and that the integration phase still rechecks static deployment and failure behavior.

### 10-07 — Distinguish product stages without an undecided MVP label

**Target:** `docs/founding/06-roadmap.md` → `# 2. What Counts as the Core Product` and `# 71. Core Release Definition`

**Operation:** ADD

**Evidence status:** ESTABLISHED

**Owner gate:** wording review

**Problem:** The roadmap uses “first vertical slice,” “useful, free learning product,” “core product,” and “first substantial release” without defining how those states differ. That leaves a polished prototype vulnerable to being described as the full product, while adding an “MVP” milestone would import a product-management label the owner has not chosen. A small vocabulary note can make evidence and release discussions precise without changing scope.

**Current anchor/text:**

> This roadmap defines a staged path from the FractionFlow founding specifications to a coherent, useful, free learning product.

and:

> FractionFlow reaches its first substantial release when it provides:

**Proposed wording:**

Add after `# 2. What Counts as the Core Product`’s opening description:

> **Roadmap stage vocabulary.** A *prototype* is a disposable or narrowly scoped implementation used to test a design or technical hypothesis; it may be incomplete and is not a release claim. A *useful limited product* is a deliberately bounded, publicly usable experience whose stated pathway works and whose limitations are explicit; it need not cover the whole core domain. A *substantial core release* is the bounded product described in §71, after the core content, accessibility, privacy, static-deployment, and integration evidence required by this roadmap has been reviewed. These labels describe evidence and scope; they do not create a separate “MVP” milestone or authorize expansion.

Add to §71 after the quoted release definition:

> Public availability alone does not establish a substantial core release. The release state must be named alongside its covered pathway, known limitations, and evidence status.

**Rationale:** This repairs a real vocabulary gap while respecting the owner’s undecided product terminology. It prevents “prototype,” “public demo,” and “substantial release” from becoming interchangeable and keeps release claims evidence-bounded.

**Conforming edits:**

- In `docs/founding/06-roadmap.md` Phase 2 and §25, call the output a prototype or limited first-slice result until the relevant gate is met; do not call it core-ready merely because it is deployed.
- In `docs/project-seed.md`, retain “one excellent interaction” and “public deploy spike” without adding an MVP term.
- In `README.md`, any future public-status wording should name the covered stage and limitations rather than imply substantial-core completeness.

**Preserves:** The three broad stages Prove, Generalize, and Compose; the owner’s control over release scope; and the existing §71 definition. It does not set a launch date, coverage percentage, or required public audience.

**Conflicts or dependencies:** Depends on `10-02` and `10-06` for accessibility and deployment evidence. If the owner later adopts “MVP” as a product term, that is a separate decision and should be mapped explicitly rather than silently replacing this vocabulary.

**Verification:** Search the roadmap for `prototype`, `useful`, `public`, `core-ready`, `substantial`, and `MVP`. Confirm that each status is used consistently, that “MVP” is not introduced by implication, and that a public URL is not treated as evidence of substantial-core completeness.

### 10-08 — Keep session dose and stopping behavior as Phase 7 variables

**Target:** `docs/founding/06-roadmap.md` → `# 51. Phase 7 — Session Composition` through `# 58. Phase 7 Exit Gate`

**Operation:** ADD

**Evidence status:** ESTABLISHED

**Owner gate:** wording review

**Problem:** The roadmap correctly says a session should have a natural stopping point and a short coherent body of work, but it does not state whether session length, problem count, pause behavior, or completion acknowledgement are fixed requirements or things to learn during composition. Fixing a dose now would turn an untested product hypothesis into a founding constraint.

**Current anchor/text:**

> A session should have a natural stopping point.
>
> It should not rely on endless scrolling or infinite practice.

**Proposed wording:**

Add after §57:

> Session dose, pause behavior, stopping cues, and completion acknowledgement are Phase 7 prototype variables. The phase should compare a small number of bounded compositions and record what makes a session feel finishable without turning the founding documents into a fixed problem count, time limit, or reward loop. Until that work is reviewed, “short coherent body of work” is a design aim, not a quantitative acceptance threshold.

**Rationale:** This preserves the clear non-infinite-session requirement while preventing an implementer from inventing a number of tasks or minutes and treating it as canonical. It also gives Phase 7 a concrete question to answer.

**Conforming edits:**

- In §58, add “including an observed, reviewable stopping behavior” to the exit gate, without specifying dose.
- In §64–71, do not turn session count or time into a core-release threshold unless a later owner decision records it.
- Keep any stretch “session completion acknowledgement” language as a prototype option, not a reward or required telemetry feature.

**Preserves:** Natural stopping, short coherent practice, calmness, and the rejection of endless scrolling/infinite practice. It does not decide how many problems, how long a session lasts, or whether completion is explicit.

**Conflicts or dependencies:** Overlaps session-composition, pacing, and usability recommendations. It must not be used to settle bridge frequency, prompt density, or persistence timing.

**Verification:** Confirm no fixed problem/time threshold appears in the roadmap as a requirement. Check Phase 7 notes or later prototype reports for separate observations of dose, stopping, pause, and completion rather than a single conflated metric.

### 10-09 — Separate within-session continuity from later persistence

**Target:** `docs/founding/06-roadmap.md` → `# 51. Phase 7 — Session Composition` and `# 59. Phase 8 — Local Progress and Continuity`

**Operation:** ADD

**Evidence status:** ESTABLISHED

**Owner gate:** wording review

**Problem:** Phase 7 composes episodes into a session, while Phase 8 adds modest durable progress, but “continuity” can be read as requiring cross-session persistence before Phase 8 or as requiring the Phase 7 session to remember more than its active state. The synthesis treats earlier persistence as a contested interpretation, not an established need. The roadmap should clarify the boundary without moving persistence earlier.

**Current anchor/text:**

> Once session behavior is credible, add modest durable progress where it improves learning.
>
> The initial goal is not a comprehensive student model.
>
> It is continuity.

**Proposed wording:**

Add at the end of §51:

> Phase 7 continuity means continuity within one active session: episode order, local review, scaffold behavior, and a natural session close should be coherent without durable learner history.

Replace the opening of §59 with:

> **Phase 8 — Local Progress and Cross-Session Continuity**
>
> Once session behavior is credible, Phase 8 may add modest durable local progress where it improves learning. This is the first roadmap phase that evaluates continuity across later visits. It is not required for first-visit core practice, and it must remain usable after local data is cleared and without identity or network services.

**Rationale:** This makes the existing sequence legible without claiming that persistence should move earlier. It preserves local-only storage, first-visit usability, and the Phase 8 exit gate while allowing Phase 7 to test composed sessions entirely in-session.

**Conforming edits:**

- In §60–63, retain the modest local data examples and clear-data/no-identity requirements; change “Returning learners” to “Returning learners after Phase 8 local continuity is enabled” if needed for clarity.
- In `docs/founding/04-system-architecture.md`, keep the persistence adapter local-or-nowhere for the founding product and mark remote storage as requiring `10-01`’s charter change.
- In §93, phrase “Is persistence across devices important enough?” as a later owner checkpoint, not evidence that cross-session or cross-device persistence is required before Phase 8.

**Preserves:** Phase ordering, local browser persistence, no account requirement, clearing-data behavior, and the ability to test scaffold fading and mixed retrieval within a session. It does not choose a persistence data model, identity mechanism, or cross-device policy.

**Conflicts or dependencies:** Depends on `10-01` and overlaps any recommendation about persistence timing or shared devices. It should not be combined with a proposal to move durable persistence earlier unless the owner explicitly decides that the roadmap order changes.

**Verification:** Confirm Phase 7 can be implemented and evaluated with ephemeral in-session state. Confirm Phase 8 is the first phase describing durable local continuity, and that all first-visit/core requirements remain usable after clearing local data and without network services.

## 4. Deferred or rejected changes

- **A specific accessibility standard, scanner, browser matrix, or quantitative threshold:** deferred because the founding documents intentionally leave implementation tooling open and no current test evidence supports invented thresholds.
- **A universal screen-reader or sensory-equivalence claim:** deferred because the acceptance floor should preserve mathematical responsibility without prescribing one mechanism or claiming that all modes have already been validated.
- **A legal consent, child-privacy, or institutional research policy:** deferred because the repository supports a practical adult-permission and de-identification boundary, not a jurisdiction-specific legal conclusion.
- **A root software/content license selection or license-file creation:** deferred pending owner intent; this file only recommends recording the decision and avoiding “free”/reuse ambiguity.
- **A mandatory CSP, SRI, package-lock policy, dependency scanner, or security certification:** deferred because tooling and deployment are not yet selected. The dependency recommendation establishes a posture, not implementation details.
- **Share-link URL validation and origin authorization:** deferred until the roadmap’s portable configuration/share-link feature is designed.
- **Backend design, remote telemetry, synchronized progress, or account architecture:** rejected for this cluster; the recommendation explicitly makes those owner-approved future charter changes rather than authorizing them.

## 5. Suggested application order

1. Resolve and apply `10-01` first. It establishes the authorization vocabulary that all later architecture and roadmap edits must respect.
2. Apply `10-02` to `docs/founding/05-quality-and-validation.md`, then make its small conforming edits in `00-principles.md` and `06-roadmap.md`.
3. Apply `10-03` alongside the quality-document edits, then reconcile the validation-assets paragraph and roadmap release language.
4. Route `10-04` to the owner as a separate licensing decision. Apply the founding note only if the owner accepts the decision boundary; create a license artifact only in a separately authorized release task.
5. Apply `10-05` after `10-01`, because dependency/origin rules must clearly distinguish the static core from any future chartered service. Keep feature-specific URL/share-link work deferred.
6. Apply `10-06` next, mapping the deployment spike into Phase 1 and the end-to-end public proof into Phase 2.
7. Apply `10-07` before release-status edits so later reports use prototype/limited/substantial language consistently without inventing an MVP milestone.
8. Apply `10-08` with the Phase 7 session edits; keep all dose and stopping values as prototype observations.
9. Apply `10-09` after the session edits, preserving Phase 8 as the first durable local-continuity phase.

The later reconciliation pass should accept `10-01`, `10-02`, `10-03`, `10-06`, `10-07`, `10-08`, and `10-09` as a coherence/governance group, while treating `10-04` as owner-dependent and `10-05` as a narrow architectural posture. None of these recommendations changes packet status or authorizes implementation beyond the specified founding-document edits.

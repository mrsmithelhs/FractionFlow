# Founding-Document Recommendation Conflicts and Resolutions

## Purpose and decision rule

This file reconciles the actionable recommendations in:

- `reports/orchestration/founding-docs-review/synthesis-edit-recommendations/10-scope-accessibility-privacy.md`; and
- `reports/orchestration/founding-docs-review/synthesis-edit-recommendations/20-instruction-evidence-scaffolds.md`.

The recommendations are broadly compatible, but several are not disjoint: they edit the same passages, introduce terms that another recommendation consumes, or could imply contradictory gates if applied independently. The resolutions below preserve the synthesis's settled directions:

- mathematical state → instructional state → presentation;
- exact mathematical truth remains separate from authored-path and renderer support;
- the founding product remains static-only, with no backend, accounts, analytics, or remote learner-data service;
- evidence claims remain no stronger than the responsibility and support actually observed;
- accessibility accommodations do not reduce the learner's mathematical responsibility;
- prototype questions remain prototype questions; and
- wording that records a future owner decision does not make that decision or authorize implementation.

`No direct conflict` below means that two edits can coexist after ordering and cross-reference cleanup. It does not mean they can be pasted independently without rereading the resulting section.

## Conflict and overlap matrix

| Conflict | Recommendations | Interference | Resolution |
|---|---|---|---|
| C-01 — Static boundary versus future-service and persistence language | 10-01, 10-05, 10-06, 10-09 | Architecture and roadmap passages currently use `static-first`, optional-service, remote-persistence, and deployment language with different authorization implications. Applying only one edit could leave another passage looking like permission for a backend. | Make 10-01 controlling. Use `static-only` for the founding product. Future remote services remain hypothetical and require an explicit owner-approved charter change. 10-05 governs dependencies and runtime origins without authorizing a service; 10-06 proves static deployment only; 10-09 keeps founding persistence local to the browser and Phase 8 or later. |
| C-02 — Accessibility floor versus child-usability evidence | 10-02, 10-03, 20-01 | 10-02 separates mechanized, human, and child evidence, while 10-03 limits how child observations may be handled and 20-01 limits what Phase 2 observations can prove. Independent insertion could imply either that a scanner proves usability or that child observation is automatically required for every feature. | State one evidence rule: mechanized checks and human accessibility review are required to claim the participation floor; child observation is separately reported when conducted and is required only at an existing roadmap/owner gate that explicitly calls for learner review. Never substitute one evidence kind for another. All child evidence follows 10-03, and Phase 2 claims remain bounded by 20-01. |
| C-03 — Phase 2 wording collision | 10-02, 10-03, 10-06, 10-07, 20-01 | All five recommendations add language to Roadmap Phase 2 or its exit gate: product-stage name, public deployment proof, assumed learner, accessibility evidence, and de-identified learner-review evidence. Pasting each block in source-file order would repeat caveats and make the exit gate hard to scan. | Build one integrated Phase 2 contract. Order its concepts as: stage/status under 10-07; learner and inference boundary under 20-01; static public deployment proof under 10-06; accessibility and child-evidence references under 10-02/10-03. Keep the exit gate as a concise checklist pointing to canonical definitions rather than repeating their prose. No one item—public deployment, accessibility checks, or child observation—proves instructional efficacy or substantial-core status. |
| C-04 — Scaffold levels versus evidence categories | 20-02, 20-04 | `high/medium/low/independent` can describe an episode's support configuration, while `supported construction/prediction/independent transfer` describes evidence. The shared word `independent` can make the two look like one ladder. | Make the Interaction Grammar the canonical owner of support dimensions and level labels under 20-04. Make the Instructional Model the canonical owner of evidence categories under 20-02. Add an explicit sentence that an `independent` support configuration does not by itself establish `independent transfer`; provenance and task change still determine the evidence category. |
| C-05 — Bridge responsibility versus display mechanics and anti-simultaneity | 20-03, 20-05, 10-02 | A bridge must make connection-making observable, while the principles discourage competing views and the accessibility floor may require a linear alternative. Careless wording could require side-by-side presentation or forbid it. | Adopt 20-05's narrowed slogan and keep 20-03 display-neutral. A bridge requires a learner correspondence responsibility, not a particular simultaneous, sequential, animated, static, or verbal layout. An accessible linear alternative is an equivalent participation path, not a command to display every representation at once. Leave choreography to prototypes. |
| C-06 — Denominator terminology is edited twice | 20-06, 20-10 | Both recommendations replace the list in `docs/founding/03-math-and-content-model.md` §11. Applying them separately would overwrite one change or leave `pedagogically convenient denominator` in one copy. | Treat the §11 work as one atomic patch. First install 20-10's canonical terms—valid common denominator, least common denominator, and instructionally preferred denominator—then place 20-06's mathematical-validity/instructional-support/renderability contract immediately after that terminology. `Instructionally preferred` is a pedagogical choice among valid states; `instructionally supported` is the episode's behavior/coverage boundary. Do not use them as synonyms. |
| C-07 — Learner-facing continuation versus authored-path fallback | 20-06, 20-08 | Both specify behavior for mathematically valid states outside the current renderer or authored path. Separate wording could create two incompatible fallback menus or let an episode claim mathematics is wrong because authored content is missing. | Use one ownership chain. The Math and Content Model determines mathematical validity; the episode definition declares supported authored paths; the representation capability determines renderability; the Interaction Grammar communicates a reviewed continuation; Quality and Validation tests each boundary. Founding text may enumerate allowed continuation classes, but each episode family must later select and review its behavior. Missing authored coverage or renderer capability never changes mathematical truth. |
| C-08 — Simplify-first state changes versus authored/noncanonical paths | 20-07, 20-08, 20-06 | An explicit simplify-first transformation changes the current form from which denominators are evaluated. Without ordering, the noncanonical-path rules could validate against the original form or make local simplification globally mandatory. | Apply 20-07 before finalizing 20-08's path language. Record the accepted equivalence transformation and resulting current form, then apply the 20-06 validity/support/renderability questions to that current state. An authored path may prefer simplify-first, but unsimplified exact paths remain mathematically valid unless a stated episode responsibility bounds support. |
| C-09 — Equality repair versus regrouping terminology | 20-09, 20-10 | Both change the vocabulary around temporary/intermediate states, and 20-09 edits `docs/founding/05-quality-and-validation.md` §§68–69 while 20-10 supplies canonical regrouping terms. Applying 20-09 first with ad hoc terminology would require rework. | Define the 20-10 terminology first: `regrouping` as the umbrella process, `intermediate regrouped state` for a learner-established transformation, and `mixed-number form` for a settled representation. Then apply 20-09's genuinely false equality example using those terms. A temporary visual transition may be non-mathematical; an intermediate regrouped state is exact mathematical state. |
| C-10 — Release vocabulary versus evidence and deployment gates | 10-02, 10-03, 10-06, 10-07 | A public URL, an accessibility check, or a learner observation could be mistaken for proof of a `useful limited product` or `substantial core release`. | Apply 10-07 before other roadmap gate edits. Treat product-stage labels as scope-and-evidence claims. Deployment proves delivery, the accessibility floor proves a bounded participation contract, and child observations provide bounded design evidence. None individually proves instructional efficacy or a substantial core release. |
| C-11 — Session variables versus durable continuity | 10-08, 10-09 | Phase 7 owns session composition and Phase 8 owns durable local progress. Pause/completion wording could accidentally require durable resume state in Phase 7. | Define Phase 7 pause, stopping, dose, and completion as within-session prototype variables. Reserve cross-visit durable local continuity for Phase 8. A Phase 7 pause may be ephemeral; no account, cross-device identity, or persistence mechanism is implied. |
| C-12 — Project license versus dependency licenses | 10-04, 10-05 | Both mention `license`, but one concerns the owner's terms for FractionFlow and its assets while the other concerns third-party dependency provenance. They can be conflated into an implied project license selection. | Keep them explicitly separate. 10-04 records that project and asset licensing is an unresolved owner decision before public release; it does not select or create a license. 10-05 requires adopted dependencies to have their third-party license/provenance reviewed regardless of the later FractionFlow license choice. |

## File-level collision map

### `docs/founding/00-principles.md`

- 20-05 changes §2.
- 20-04 adds an ownership cross-reference in §6.
- 10-02 adjusts the accessibility language in §17.
- 10-01, 10-03, and 10-04 all touch §§20–21.

Resolution: apply the sections in numeric order, but merge §§20–21 as one pass. The order within that pass is: static boundary and remote-storage gate (10-01), child-evidence cross-reference (10-03), then licensing-decision paragraph (10-04). Keep free access, privacy/data minimization, and reuse rights as three distinct ideas.

### `docs/founding/01-instructional-model.md`

- 20-03 changes §16.
- 20-02 changes §18 and conforming evidence language.
- 20-01 adds a roadmap cross-reference near §19.
- 20-04 normalizes the support labels in §20.

Resolution: install canonical support/evidence ownership first (20-04 and 20-02), then bridge responsibility (20-03), then the Phase 2 cross-reference (20-01). Reread §§16–20 as one sequence so `independent` is not used ambiguously.

### `docs/founding/02-interaction-grammar.md`

- 20-04 replaces/cross-references §§21–22.
- 20-03 changes §33.
- 20-06 adds unsupported-but-valid continuation behavior in §§39 and 46.
- 20-10 changes regrouping terminology in §48.
- 20-08 constrains hints in §52.
- 20-02 updates the canonical episode in §75.
- 20-05 may add a clarification near §11.

Resolution: make the support vocabulary canonical first, then apply behavior-specific edits. Preserve the sequence mathematical response classification → support/path coverage → learner-facing continuation; do not let the interaction layer compute validity.

### `docs/founding/03-math-and-content-model.md`

- 20-07 adds current-form simplify-first semantics in §9 and conforming language later.
- 20-06 and 20-10 both edit §11.
- 20-09 and 20-10 normalize intermediate-state terminology around §§19–22 and §61.
- 20-08 changes §§55–56.
- 20-06 also changes §59 and connects to §§68–69.

Resolution: apply one coordinated mathematics pass in this order: 20-10 terminology, 20-07 current-form semantics, 20-06 three-part boundary, 20-08 authored-path coverage, then 20-09 conforming terminology. Re-evaluate every edited example for exact equality.

### `docs/founding/04-system-architecture.md`

- 10-01 changes static/future-service and persistence language.
- 10-05 changes dependency/origin language.
- 20-06 adds separate pre-render checks.
- 20-08 adds authored path coverage/fallback metadata.
- 20-05 may narrow renderer wording about simultaneous representations.
- 20-07 preserves current form after an accepted simplification.

Resolution: establish the static authorization boundary first. Then preserve the architecture pipeline by placing mathematical validity in math/content, path support in content/interaction, and renderability in representation capability; the architecture coordinates these results but does not recompute them.

### `docs/founding/05-quality-and-validation.md`

- 10-02 and 10-03 add acceptance/evidence/privacy rules.
- 20-01 adds Phase 2 observation boundaries.
- 20-02 and 20-04 refine evidence and scaffold testing.
- 20-06 and 20-08 add validity/path coverage cases.
- 20-09 and 20-10 edit adjacent equality and state terminology.
- 10-05 adds dependency/origin checks.

Resolution: organize the additions under their existing validation domains rather than collecting them in one omnibus section. Apply the equality/terminology repair atomically. For learner evidence, always record both the support configuration and the evidence category; for accessibility, record mechanized, human, and child evidence separately.

### `docs/founding/06-roadmap.md`

- 10-06, 10-07, and 20-01 all change early roadmap framing and Phase 2.
- 10-02 and 10-03 add accessibility and child-review gate references.
- 20-02, 20-03, and 20-04 adjust later evidence, bridge, and fading wording.
- 10-08 and 10-09 edit adjacent Phase 7–8 boundaries.
- 10-04 adds a release-time licensing decision/check.

Resolution: define roadmap vocabulary before using it, then edit each phase in chronological order. Keep phase gates short and cross-reference canonical contracts. Phase 2 remains a narrow prototype/first-slice result; Phase 7 remains within-session; Phase 8 is the first cross-visit local-continuity phase.

## Recommendations that remain gated rather than conflicted

The following are not contradictions, but the later editing pass must preserve their gates:

- **10-04:** add the decision boundary, but do not choose a project/content/asset license or create a license file.
- **10-05:** add the minimal static-app posture, but do not mandate CSP, SRI, a scanner, a package manager, or a particular deployment mechanism.
- **20-08:** add the coverage contract and allowed behavior classes, but do not select one fallback for every future episode family.
- **10-02:** add a capability-based accessibility floor, but do not claim universal accessibility, WCAG conformance, a completed browser/assistive-technology matrix, or completed child testing.
- **10-08:** make session variables explicit, but do not set a problem count, time limit, reward loop, or fixed completion behavior.

## Reconciliation outcome

All nineteen actionable recommendations can be incorporated without changing the synthesis's settled directions if the resolutions above are applied. No recommendation should be dropped solely because of overlap. The implementation sequence must merge shared-anchor edits, install canonical terminology before dependent wording, and preserve the explicit owner/prototype gates listed here.

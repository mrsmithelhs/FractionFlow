## Cross-review map

Reviewer labels below: **Claude**, **Codex**, **Gemini**, **Kimi**.

### 1. Convergent finding clusters

| Cluster | Reviewer attribution | Founding-document evidence | Independence vs. shared-prompt echo | Bounded synthesis |
|---|---|---|---|---|
| **Accessibility commitments do not yet define a complete, agency-preserving nonvisual/reduced-motion learning path.** | **Claude:** missing WCAG target; number-line alternative may change the skill. **Codex F2:** “where feasible” and “intended access modes” leave the acceptance floor open; also flags WCAG 2.2 non-drag pointer access. **Gemini F5:** end-state ARIA labels do not communicate the invariance relationship carried by motion. **Kimi F2:** reduced-motion/screen-reader equivalents are required but mechanically undefined. | `00-principles.md` §17, lines 465–480: screen-reader interpretation is qualified by “where feasible”; `02-interaction-grammar.md` §72; `05-quality-and-validation.md` §§40–43; Phase 2’s access-mode exit gate in `06-roadmap.md` §25. | **Mixed.** The prompt explicitly demanded review of keyboard, screen readers, dragging, reduced motion, and mathematical semantics, so the topic is heavily primed. The reviewers nevertheless found different concrete failure surfaces, which makes the underlying gap credible. | Real pre-development feasibility question, probably **High design risk**, not proof that the design is inaccessible. Convergence supports naming the minimum access modes and prototyping one complete episode early. It does **not** establish Gemini’s proposed sonification or any one alternate interaction as the answer. |
| **The Stage-E Phase 2 slice needs an explicit learner prerequisite/evaluation contract.** | **Claude F8:** Stage A magnitude is never clearly scheduled and the roadmap starts at Stage E. **Codex F4:** the roadmap expands breadth before testing repetition and a second representation; first-slice prerequisites should be stated. **Gemini F4:** novice testing of both-denominator renaming confounds UI failure with missing prerequisites. **Kimi F5:** the engineering slice presupposes Stages A–D that do not yet exist. | `01-instructional-model.md` §19, lines 674–719, defines A: magnitude, B: equivalence, C: like-denominator operations before later stages; `06-roadmap.md` §7, lines 205–220, chooses “both fractions require renaming”; §§27–28 defer earlier focused families to Phase 3. | **Mostly independent despite prompt priming.** The prompt explicitly asked whether the first vertical slice and phase order were sound, but all four located the same concrete dependency mismatch and independently distinguished engineering coverage from learner sequence. | Strongest consensus is **not** “replace the first slice.” It is: state that this is an architecture/prototype slice for learners already familiar with equivalence, screen participants accordingly, or add a very small prerequisite/on-ramp probe. Severity is better calibrated as **Moderate** unless the slice is mistakenly treated as the universal novice entry lesson. |
| **Supported performance must be distinguished from prediction, transfer, and independent reasoning.** | **Claude F9:** constrained-choice guessing, retries, and omission of no-op/check-the-premise cases can create false fluency. **Codex F3:** the canonical episode may measure counting after subdivision rather than predicted equivalence; the bridge may reveal the placement. **Gemini F8:** repeated three-choice invariance prompts and seven-beat choreography invite ritual clicking. **Kimi F8:** rapid trial-and-error can enter the fading evidence model as if it were reasoning. | `01-instructional-model.md` §28 includes “repeated correct predictions” as fading evidence; `02-interaction-grammar.md` §§39, 51, 75–76 define constrained choices and the canonical episode/bridge; `05-quality-and-validation.md` §19 warns about scaffold leakage and §58 says bridges should test transfer. | **Strong common-mode component.** The shared prompt explicitly listed visuals revealing answers, multiple-choice guessing, choreography learning, and immediate-feedback false success. The specific mapping to the canonical episode and fading evidence remains useful, but four-reviewer convergence does not independently validate severity. | Treat as a **Moderate, testable evidence-model gap**. Clarify response provenance—before/after reveal, hint/replay use, number of attempts—before using performance to fade scaffolds. Prompt-density and exact thresholds belong in the prototype, not founding-document micro-policy. |
| **Valid alternative denominators and visual feasibility need one learner-facing acceptance contract.** | **Claude F5:** says acceptance of any valid denominator conflicts with renderer limits. **Codex F5:** agrees a contract is missing but explicitly notes the apparent contradiction is mitigated by existing supported-input bounds. **Gemini F3:** makes the same collision and proposes fixed visual ceilings. **Kimi:** does not elevate this as a finding. | `03-math-and-content-model.md` §56, line 1409: do not reject valid equivalence solely because it differs from the canonical path; §68, lines 1682–1699: maximum practical denominator/subdivision and alternate representations; `05-quality-and-validation.md` §7, lines 254–265: arbitrarily large denominators may be unsupported; §66, lines 1339–1347: supported noncanonical denominators should be followed consistently. | **Strong prompt echo.** The brief directly called out alternate paths and visual denominator limits. Codex’s explicit mitigation and Kimi’s non-finding matter more than raw vote count. | There is a real **Moderate clarification gap**, not a demonstrated contradiction. Specify “mathematically valid,” “supported in this episode,” and “renderable in this representation,” plus a continuation path. Do **not** freeze Gemini’s suggested `D ≤ 24/16` limits before responsive prototypes establish them. |
| **The anti-simultaneity wording is too absolute relative to symbolic co-presence and deliberate comparison.** | **Claude F3:** calls it a direct contradiction. **Gemini F2:** argues it wrongly excludes side-by-side bridge work. **Kimi F1:** calls it overstated and internally tense. **Codex:** contests the contradiction, emphasizing the existing deliberate-juxtaposition escape clause and preserving one focal question. | `00-principles.md` §2, lines 55–65: line 63 allows deliberate juxtaposition for one comparison, while line 65 declares “Multiple representations does not mean simultaneous representations”; `02-interaction-grammar.md` §19, lines 428–443, requires visual-symbolic connection; `04-system-architecture.md` §22 says symbols are a representation. | **Strong common-mode echo.** The prompt explicitly asked whether the preference against simultaneous representations goes too far and contrasted morphing with side-by-side display. The split verdict shows there is no independent consensus that the design itself is wrong. | Narrow wording repair is justified: distinguish **competing full visual models** from persistent symbolic notation and one deliberate comparison. There is no four-reviewer basis for mandating side-by-side displays generally. |
| **Animation/morphing is an unproven hypothesis whose superiority should be tested against persistent static comparison.** | **Claude F1:** would demote animation to optional enhancement and make prediction plus persistent before/after states canonical. **Codex:** says morphing should remain optional and the static comparison deserves equal prototype standing. **Gemini F1–F2:** calls fixed-coordinate anchoring impossible and favors linked simultaneous displays. **Kimi F2 and “survived scrutiny” §1:** retains transformation as defensible but requires a nonanimated inspection/key-frame path. | `00-principles.md` §§3, 7; `02-interaction-grammar.md` §§17–18, 36–38, 76; the concrete endpoint instruction is at `02`, line 1582; `00`, line 86 provides the same example. | **Very strong prompt echo.** The brief repeatedly asked whether animation, morphing, anchors, and side-by-side comparison were justified. Reviewers agree only on empirical uncertainty, not on the redesign. | Consensus supports a Phase 2 A/B-style prototype question. It does **not** support calling animation harmful, calling morphing geometrically impossible, or rewriting the whole interaction grammar before the experiment. |
| **Scaffold terminology and ownership are drifting.** | **Claude F10:** identifies 8/12/9-dimensional lists and an unbounded validation surface. **Kimi F3:** independently identifies the same three nonidentical lists plus unmapped evidence and support ladders. **Gemini:** flags broad duplication, though not this exact list analysis. **Codex:** does not flag this cluster. | `00-principles.md` §6, lines 145–158; `02-interaction-grammar.md` §21, lines 473–488; `06-roadmap.md` §46, lines 907–921; `01-instructional-model.md` §26 versus `02` §22 for evidence/support ladders. | **Moderately independent.** The prompt asked for normalization, but the exact 8/12/9 comparison is a concrete artifact finding reproduced by two reviewers. | A clean **Moderate normalization repair**: let `02` own scaffold dimensions; use references elsewhere; explicitly say the evidence continuum and provision ladder are different axes. Claude’s claim that the entire cross-product must become reachable is an inference, not specified fact. |
| **Local persistence has unresolved shared-device and sequencing semantics.** | **Claude:** learner B may inherit learner A’s faded scaffolds. **Codex:** asks for fresh-session/reset semantics and separation of real session histories from public fixtures. **Gemini F6:** school profile wiping may erase continuity. **Kimi F4:** Phase 6–7 gates rely on continuity scheduled only in Phase 8. | `00-principles.md` §19’s success statement (“I used to need the picture…” at line 533); `01-instructional-model.md` §§28–29; `04-system-architecture.md` §§28–31; `06-roadmap.md` Phase 8, while Phase 2 explicitly excludes long-term progress at lines 533–546. | **Mixed/common-mode.** The prompt named persistence, shared devices, and classroom use, but the reviews expose two opposite failure modes—state loss and state contamination—which is useful independent synthesis. | Real **Moderate later-phase design issue**. Founding docs need only preserve learner/session identity as an explicit architectural concern. Pulling durable persistence earlier is one option, not consensus. Gemini’s URL/passphrase “progress passport” is speculative and creates privacy/security questions of its own. |
| **Magnitude matters, but reviewers do not agree that number lines must move earlier.** | **Claude F8:** calls late magnitude/number-line timing High risk. **Kimi F7:** recommends a small Phase 3 magnitude episode. **Codex:** says bar-first is defensible but a disposable second-representation probe should occur early. **Gemini:** says the existing bar-to-number-line order is supported, while emphasizing benchmark magnitude work once number lines arrive. | `01-instructional-model.md` §§4, 14.2, 19; Stage A begins at lines 680–688; `06-roadmap.md` §§32–35 introduce number lines in Phase 4; §66’s core coverage is the cited omission. | **Strong prompt echo with genuine divergence.** The brief explicitly asked whether number lines enter too early or late. | Consensus supports preserving magnitude as an explicit early objective and probing number-line placement before expensive expansion. There is no consensus to reorder the roadmap wholesale. |
| **Current inspected documents are publication-clean.** | All four report no PII, student references, secrets, or credentials in the founding set/context they inspected. Claude’s scan was broader; Codex explicitly limits its conclusion to inspected files and not Git history. | This was a required publication check in the shared prompt, not a founding-spec issue. | **Entirely common-mode by instruction.** | Report narrowly: no publish-blocking content was found in the reviewed founding materials and nearby context. Do not convert this into a repository-history or secrets-audit certification. |
| **No reviewer established a full existing-product duplicate.** | All four conclude that existing tools overlap on manipulatives, visual equivalence, or practice, but not the full calm/account-free/authored/fading/transfer combination. | Not an internal passage; this was a required review section. | **Entirely prompt-induced, with uneven empirical depth.** Several comparisons were documentation-based rather than hands-on runtime inspection. | Useful strategic signal, not proof of uniqueness. Preserve as “no strong duplicate was established,” not “none exists.” |

### 2. Contested or divergent points

#### A. Is the anti-simultaneity rule a contradiction or merely clumsy wording?

- **Strongest case for contradiction — Claude/Kimi:** the bold absolute at `00 §2`, line 65 includes “an equation” among competing representations, while `02 §19` requires symbol–visual co-presence and `04 §22` explicitly calls symbols a representation.
- **Strongest case against — Codex:** the immediately preceding sentence at `00`, line 63 expressly permits deliberate juxtaposition for one defined comparison; the intended principle is one focal question, not a literal prohibition on co-presence.
- **Synthesis:** fix the sentence, not the design. The absolute wording is drift-prone, but the surrounding paragraph already contains the intended exception.

#### B. Should animation be demoted now?

- **Strongest case for demotion — Claude:** animation evidence is small/heterogeneous and less applicable to abstract structural learning; prediction and persistent comparison are cheaper, more accessible, and directly inspectable.
- **Strongest case for retention pending prototype — Kimi/Codex:** the documents already include prediction, replay, inspectable end states, learner control, and hard-cut escape clauses. The literature does not test FractionFlow’s exact morph against a prompted static comparison.
- **Gemini’s “geometric impossibility” claim is the least well calibrated:** different screen domains can make fixed-pixel anchoring misleading, but the docs speak about preserving useful mathematical anchors and allow hard cuts; they do not require one universal pixel mapping for every mixed-number domain.
- **Synthesis:** label morphing as a hypothesis and prototype it. Do not yet make either animation or side-by-side comparison canonical solely from these reviews.

#### C. Is the common-denominator definition mathematically wrong on unreduced operands?

- **Claude’s unique High finding:** for `3/6 + 1/4`, a learner can simplify to `1/2 + 1/4`, making 4 a valid denominator; therefore all validity, LCD, and family classification should operate on reduced values.
- **Codex’s direct countercase:** “common denominator” is representation-relative. For the current written forms `3/6` and `1/4`, 4 is not divisible by 6; after the learner actually simplifies the first operand, the current forms change and 4 becomes valid. The documents already accept simplification and alternate paths.
- **Strongest synthesis:** reject Claude’s broad “all classification on reduced values” rewrite; it would erase meaningful authored-form distinctions. Add a narrower state/path clarification if unsimplified operands will be admitted: validation applies to the learner’s current established forms, and simplification must be represented as an accepted prior transformation.

#### D. Is fixed-coordinate anchoring “Critical” and impossible?

- **Gemini’s case:** bars and number lines can have different domains, padding, and scales; retaining the same literal screen coordinate could distort magnitude.
- **Countercase from the other reviews and the text:** `02 §18` lists useful anchors such as total length, shaded extent, and same number-line position, while §17 allows hard cuts where morphing is misleading. A proper-fraction bar and a `[0,1]` line can be aligned; different-domain cases can use a different bridge.
- **Synthesis:** a real geometry/prototype constraint, not a Critical mathematical impossibility. Rewrite only if the owner intended literal screen-pixel immobility across arbitrary domains.

#### E. Does the static-only core conflict with future optional services?

- **Codex F1:** `docs/project-seed.md` line 21 says “Static-only architecture. No server, no accounts, and no backend,” while `04 §3`, lines 86–106, anticipates sync, telemetry, classroom management, and account settings. Codex sees an authorization-boundary conflict.
- **Claude, Gemini, Kimi:** all treat static hosting as a strong surviving assumption; Kimi notes cloud/telemetry remains stretch-gated.
- **Synthesis:** the core boundary is clear; what is ambiguous is whether stretch-service language records possibilities or pre-approves a future direction. A one-sentence owner-gate clarification is valuable. Calling this a High architectural defect overstates the present implementation risk.

#### F. Is broad de-duplication warranted?

- **Claude/Gemini:** the 12,000-line normative surface and repeated examples create drift; Gemini recommends stripping repeated walkthroughs.
- **Codex/Kimi:** repeated canonical examples and local reminders are often deliberate orientation; Kimi says normalization largely succeeded except scaffold terminology.
- **Synthesis:** perform targeted normalization only where copies differ behaviorally—especially scaffold dimensions and ownership—not a wholesale prose reduction before prototyping.

#### G. Must persistence move earlier?

- **Kimi:** Phase 6–7 claims cross-session fading/retrieval while persistence is Phase 8.
- **Codex/Claude:** persistence can wait, but shared-device/reset semantics must be explicit when introduced.
- **Gemini:** proposes a portable state mechanism now.
- **Synthesis:** clarify whether Phase 6–7 gates are within-session or cross-session. That may resolve the inconsistency without building persistence early. A portable token is a separate product/privacy decision and should not be smuggled in as a documentation fix.

### 3. Unique or single-reviewer findings — preserved unranked

These are intentionally not ordered by importance.

#### Claude only

- The broad reduced-form common-denominator/LCD/classification claim described above.
- The seed brief’s GitHub Pages deployment spike has no explicit roadmap home; Claude recommends moving it into Phase 1–2 and defining a Phase 3 publishable MVP.
- Deliberate “check-the-premise” or no-op cases are excluded as degeneracy even though they could detect script-following.
- `05 §19` scaffold leakage could become a machine-checkable scene-state invariant.
- Mid-episode number-line scenes for partially completed two-operand operations are undefined despite `05 §70` requiring switching at multiple episode states.
- Child usability observations need an explicit consent, de-identification, retention, and public-repository boundary.
- The `05 §49` golden regrouping case may be weak because the result equals the subtrahend.
- No backward routing from persistent conceptual failure to prerequisite-focused episodes is specified.
- The repository’s agent/process scaffolding may dominate the public visitor’s first impression.
- The reverse-engineered provider notes in `advisor-capable-providers.json` merit a deliberate publication decision, though Claude does not identify them as PII or secrets.

#### Codex only

- The static-only/static-first authorization-boundary finding.
- Mixed-number terminology should distinguish normalized mixed numbers from transient regrouped whole-plus-fraction forms such as `2 10/8`.
- A seed alone may not reproduce an episode after generator/content revisions; replay may need a version or problem snapshot.
- Accessibility accommodations should be kept distinct from evidence-bearing instructional scaffolds.
- Real learner episode histories should not automatically become durable public regression fixtures; fixtures should be synthetic or reconstructed.
- The strongest explicit deep/swept/not-covered evidence boundary: no claims about runtime accessibility, learner performance, device behavior, deployed network behavior, or Git-history secrets.

#### Gemini only

- Literal “fixed physical coordinate” anchoring is presented as a Critical geometric fallacy.
- A zero-backend portable progress token/passphrase is proposed for ephemeral Chromebook profiles.
- Tick-mark counting is named alongside gap thinking as a missing misconception.
- A dedicated mobile symbolic-entry keypad should be specified before development.
- Fixed numeric visual thresholds such as desktop `D ≤ 24` and mobile `D ≤ 16` are proposed.
- Audio sonification is suggested as a possible nonvisual representation of subdivision.
- These are all substantial design proposals, not consequences established by the review; the portable-token, threshold, keypad, and sonification ideas especially risk redesign drift.

#### Kimi only

- The product lacks an explicit first-run entry/placement model for novice versus conceptual-repair learners.
- “Pedagogically convenient denominator” in `03 §11` is an orphan term that should be defined or removed.
- Mixed-number juxtaposition-as-multiplication and cross-multiplication leakage are missing misconception candidates.
- A plain-language “nothing leaves the device” privacy statement should be part of release review, with an honest note about hosting logs.
- Future share-link parsing needs strict schema validation to avoid URL/configuration injection.
- The evidence continuum in `01 §26` and support ladder in `02 §22` are distinct axes but lack an explicit mapping.
- Core success language and retrieval/fading logic may imply cross-session evidence earlier than the roadmap admits.

### 4. Findings that look most robust after discounting prompt echo

The highest-confidence synthesis items are narrower than the reviewers’ headline severities:

1. Clarify the Phase 2 slice’s assumed learner and what its learner testing can validly demonstrate.
2. Define one complete, early accessibility feasibility target that preserves the intended reasoning across keyboard, non-drag touch, reduced motion, and screen-reader use.
3. Clarify response-evidence provenance before using performance to fade scaffolds.
4. Add a valid-versus-supported-versus-renderable input contract without choosing premature numeric limits.
5. Repair the anti-simultaneity wording so it cannot be read to ban the canonical symbol-plus-visual episode.
6. Normalize scaffold vocabulary to one owner and map evidence state separately from support provision.
7. Treat morphing, bridge frequency, prompt density, and number-line timing as prototype hypotheses rather than pre-settled research conclusions.
8. Clarify whether persistence-dependent roadmap gates are within-session or cross-session, and preserve shared-device identity as an explicit later design question.

The least reliable headline claims are Gemini’s **Critical geometric impossibility**, Claude’s assertion that all denominator validity/classification must use reduced values, any mandatory immediate demotion of animation, and broad document de-duplication. Each either overstates the cited text, crosses from review into redesign, or has a strong counter-reading in another review.
# Maintainability architecture reviews: orchestration disposition

Date: 2026-10-10. Reviews inspected at `99bbabf` (Gemini) and `9bf646e`
(Claude), against their recorded `703a64f` source baseline. Working tree clean
at review start. Advisory synthesis; no migration, source repair, dependency,
packet initiation or policy decision is authorized by this document.

## Conclusion

Accept the shared recommendation to improve lifecycle ownership, admission
contracts and evidence tooling before committing to a framework migration.
The history supports duplication and implicit protocols as maintenance costs.
It does not demonstrate that readable templates lack value or that Vue cannot
improve future revision work. Owner code-reading and edit confidence are legitimate
outcomes even where current repair history has no markup-discovery incident.

Claude is the stronger technical basis: it identifies specific duplicated tokens,
queries, revision maps and weak guards, and labels several inferences. Gemini
supports the overall direction but overstates prevention, risk and unmeasured
framework costs. Agreement on a recommendation is not independent proof of those
cost predictions. Neither review implemented a comparison or ran a browser.

## Independently checked findings

Root inspected imports, source guards, current token construction, renderer
boundary-key arithmetic and representative test assertions. Two read-only explorers
checked separate groups of load-bearing source claims; root used their pointers
alongside direct review. No application tests/build/browser were rerun for this
documentation disposition; reviewers report unit suites passed at their baseline.

- **Stylesheet routing:** `src/app/main.js` loads both stylesheets. Fraction/bar/
  symbolic rules belong to `src/styles/render.css`, while app chrome uses
  `src/app/styles.css`. My previous correction was wrong. Plan 31 now names both.
- **Admission drift:** `path-closure.js` accepts two matching choices; authored
  validation and both renderers require three. Current authored rows have three
  choices and Plan 26's app admission rejects corrupt rows. This is a latent
  inconsistency to repair before expansion, not proof accepted learner routes
  currently fail or that Plan 26 acceptance must be revoked.
- **Revision maps:** premise/reflection modules duplicate the same map today;
  missing entries return null. This is future drift/discovery risk rather than a
  currently inconsistent identity. Consolidation belongs in a bounded authoring
  mechanism if it actually reduces the edit surface.
- **Lifecycle protocol:** both renderers construct matching remount tokens;
  app-owned help placement and id-based focus/draft lookup cross those boundaries.
  Plan 25's reproduced focus failure makes ownership a stronger pilot target
  than extraction solely by file length.
- **Tests:** the quoted child-order/index queries are real. Some leakage helpers
  can treat a missing target as empty text, and render-purity scans a fixed file
  list. These are specific weaknesses; access-parity helpers generally do assert
  target existence, so a blanket claim that parity checks are vacuous is too broad.
- **Boundary-key reduction:** the renderer contains a Euclidean reduction used
  to identify coincident subdivision boundaries. This conflicts with its broad
  “zero mathematics” description, but it is presentation identity rather than
  learner-answer classification. Decide the intended layer boundary and prove
  persistence/conservation before relocating it; no automatic motion refactor.

## Recommendations accepted in direction

1. Continue **Plan 30** as an investigation using existing exact math/admission
   checks. Include registry/map duplication and a reusable admission inventory in
   its comparison. It does not already authorize or promise a unified schema.
2. Continue **Plan 31** with existing notation reuse, both readout constructors,
   correct stylesheet routing, and notation-independent leakage checks. Its
   brief was amended inline. Guard against tests passing merely because slash
   strings disappeared; seed a leak and confirm the guard rejects it.
3. Before **Plan 19 source implementation**, resolve the admitted-item contract:
   all registered items/eligible paths under applicable conditions/support must
   close, and validators/consumers must agree. Prefer a small shared contract or
   validation reuse, not a schema framework. This can be scoped at Plan 19's
   mechanism gate or in a separate bounded repair; no silent source amendment.
4. Make a short revision map describing actual ownership and checks. Improve
   reusable evidence capture with explicit input modes, captions and saved
   measurements. Preserve meaningful historical route/baseline guards when
   removing redundant count bookkeeping; derived totals alone cannot detect a
   deleted witness. Schedule shared harness edits between source assignments.
5. Consider one **transform-response ownership pilot**, shared by visual/linear
   renderers with explicit draft events and response/focus targets. Serialize
   it with Plan 31. Preserve state, intents, replay, leakage and motion contracts.
   This needs a source packet and mechanism approval; it is not assigned now.

## Pushback and changes to the proposed pilots

- Reject “zero risk,” “focus loss is impossible,” “0% of rework,” and predicted
  15–30 second Vue tests as established findings. No comparative runtime,
  maintenance or migration measurement supports those claims. DOM preservation
  can reduce remounts, but focus still needs a contract when controls change.
- Gemini's reviewer-menu pilot does not exercise the help/draft lifecycle at
  issue. Its suggested `display-menu.js` does not exist; the menu is in `app.js`.
  Requiring CSS/accessibility work afterward cannot falsify Vue's maintainability
  benefit: either approach still needs that work. A test-time threshold also
  measures a different dimension from edit clarity.
- Use the same response-region seam and same subsequent revision for a vanilla
  versus Vue comparison if the owner wants one. Compare code-reading locality,
  duplicated decisions, files genuinely needing edits, regression behavior and
  measured tooling costs separately. An isolated menu can test integration cost,
  but cannot answer the whole architecture question.
- Claude's shrink-in-lines criterion is only a secondary signal, not the benefit
  itself. Explicit contracts may add lines while making changes safer. Keep the
  pilot's stable selectors as temporary parity scaffolding, not an eternal ban on
  semantic markup improvements. Preserve invariant meanings rather than every
  incidental implementation detail.
- Do not extract completed/recovery regions, replace the mock DOM, relocate
  animation math or introduce a global focus coordinator together as a supposedly
  low-risk first step. Each adds confounders. Select a representative bounded
  seam and measure a subsequent change before generalizing.
- Current fast tests are valuable, but they do not prove actual target size,
  keyboard behavior or browser focus. Vue's official testing guide supports
  testing public behavior and leaves pure business-logic testing unchanged.
  A partial component test environment need not replace every math/state test.

## Owner decisions and next step

No reason was established to pause the whole product sequence. Plan 30 can remain
the next investigation; Plan 31 is a separate small source task. Admission drift
must be addressed before family expansion, without turning every maintenance
suggestion into a new prerequisite. Do not initiate these drafts automatically.

The substantive owner choice is whether to try a vanilla response-ownership pilot
first, or request an explicitly controlled vanilla/Vue comparison on that same
seam. Recommend vanilla first for fewer moving parts, retaining Vue as a genuine
option rather than treating the reviews as a permanent rejection. Dependency
changes and any broader migration stay separately gated. Review future task cost
using observed work, not inferred token totals or claims about entire frameworks.

Sources checked for framework claims: Vue official
[testing guide](https://vuejs.org/guide/scaling-up/testing.html),
[nextTick API](https://vuejs.org/api/general.html#nexttick), and
[ways of using Vue](https://vuejs.org/guide/extras/ways-of-using-vue.html).

This disposition changes documents only; advisor consultation was not warranted.
No push or deployment. Existing technical/owner acceptance remains in force.

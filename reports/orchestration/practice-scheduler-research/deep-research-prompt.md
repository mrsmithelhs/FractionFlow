# Deep research brief: evidence for a learner-responsive practice scheduler

Please produce an independent, source-grounded research report. This exact brief
is being run separately through ChatGPT Deep Research, Claude and Gemini. You have
no access to the project repository. Everything you need about the project is
below; do not claim you inspected its files or implementation. Do not seek other
providers' answers or optimize for agreement with them.

## Purpose

Investigate what previous attempts at pedagogically useful practice schedulers and
adaptive tutoring can teach a small fraction-learning application. We want a system
that tentatively recognizes strengths and challenges, offers useful review and
supported challenge, and lets learners correct its guesses through choice and pacing.
We need evidence about whether systems improved learning, not just whether they
predicted the next answer or increased time on site.

Study K–12 mathematics first, especially fractions and prerequisite concepts, but
include informative MOOC, adult/professional learning and certification-preparation
systems. Do not assume findings transfer across those populations. Certification
exam question selection that only estimates ability is not the same as a practice
scheduler intended to teach; make that distinction explicit.

This is research for a later design decision, not a request to implement an algorithm,
write software or promise an optimal success percentage. We welcome evidence that
simple authored practice works as well as adaptation, that an adaptive method failed,
or that the available evidence cannot resolve a question.

## Project context and constraints

FractionFlow is a calm, free, static browser application for understanding and
practicing fractions. Intended use includes school-age learners and people reviewing
foundations. It has no accounts, advertising, backend, remote learner records or
runtime generative AI. Exact deterministic arithmetic supplies mathematical truth.
Any learner history or scheduling policy must run locally in the browser. Research
systems with different architectures remain useful evidence, but their infrastructure
and identity assumptions are not automatically appropriate for this project.

Available activity families include addition/subtraction, equivalent-fraction and
common-denominator construction, magnitude comparison with optional construction,
fraction placement on number lines (including beyond one), multiple fractions at
the same point, distance between amounts, directed movement, and whole-plus-remainder
composition. They use bars, number lines, stacked notation and a linear/text access
path. Pointer/drag actions have non-drag/keyboard alternatives. Do not equate access
mode or interaction mechanics with mathematical competence.

An episode can have several learner responsibilities; authored task recipes also
permit focused variants rather than making every problem a long series of routine
checks. Episodes are not interchangeable multiple-choice questions. A scheduler
could choose mathematical purpose, task recipe, item, representation and available
support separately, but must not arbitrarily skip necessary work or reveal answers.
We want variety supporting conceptual connections, not novelty for its own sake.

There is currently one short fixed cross-type session. It starts and ends deliberately;
leaving/reloading does not resume unfinished work. There is no adaptive selection.
More/Less support and requested help exist in task-specific ways. Lower support,
larger denominators, new representations and greater competence are not one axis.

The initial optional browser-local history is narrow: normalized comparison outcomes,
first valid retry versus correct response, later correction or unresolved work,
help/model/construction assistance snapshots, known task/version/support identity
and stored order. It is capped at 30 entries as a provisional storage limit, has
no elapsed timestamps, and does not store raw answers or full event/replay logs.
Other task families are not automatically recorded. A shared browser profile may
combine different people's activity; there is no verified learner identity.
History can be cleared, unavailable or lost. Useful no-history practice is required.

Do not treat those existing choices as proven best practice: recommend minimal
extensions if justified, label them as changes and explain why they are needed.
No recommendation may depend on uploading this app's learners' data to a service.

## Questions to investigate

### 1. What has actually been tried, and what happened?

Find a bounded selection of concrete evaluated systems or interventions, rather
than an exhaustive product list. Aim for roughly six to eight informative cases,
including school mathematics, an adult/MOOC/professional context where evidence
exists, and null, negative or qualified outcomes. If a sector has no accessible
relevant evaluation, report that gap instead of filling a quota with marketing.

Possible search leads include intelligent/cognitive tutors, knowledge-component
mastery practice, ASSISTments, ALEKS, Cognitive Tutor/MATHia, adaptive courseware,
MOOC practice, professional training/certification preparation, and spaced-retrieval
systems. These names are leads, not assertions that any has an effective relevant
scheduler. Look beyond them; distinguish product versions and interventions.

For each case identify: what was selected/adapted; the evidence collected; the
learner-model/policy assumption; assistance and override access; actual comparator;
population and sample; allocation/selection bias; duration; immediate/delayed and
transfer outcomes; attrition; practical failure modes; and access to underlying
policy details. Was adaptation isolated, or bundled with new content, feedback,
teacher support, interface or additional practice time?

### 2. What should a tentative learner model mean?

Compare explainable approaches feasible under sparse evidence: authored rules,
simple evidence counters with uncertainty, Bayesian knowledge tracing or related
models, and other methods only if evidence justifies their complexity. Do not
assume a sophisticated model is better. Distinguish model predictive calibration
from educational benefit of the actions chosen using that model.

Investigate knowledge-component mapping and prerequisite assumptions; slip/guessing;
assisted versus less-cued success; repeated item versus varied application;
multiple strategies; inconsistent performance; missing/old data; shared-user
contamination; cold start; and model errors affecting subsequent opportunities.
What evidence would justify a narrow strength or practice-needs statement, and what
would not? Do not turn one error into a permanent deficit or all correct responses
into proof of independent understanding. Treat the zone of proximal development
as a pedagogical aim to operationalize cautiously, not a directly observed score.

### 3. How should challenge, support and practice be scheduled?

Examine focused acquisition before interleaving, retrieval, spacing, variation,
worked examples, scaffold fading/restoration, review of earlier successes and
introducing new demands. Separate effects of those instructional ingredients from
claims about a particular adaptive algorithm. Distinguish within-visit scheduling
from elapsed-time scheduling across days; our current stored order cannot measure
days or forgetting.

What justifies a challenge target or mastery threshold in the studies you find?
Report the exact domain and conditions; do not convert a studied parameter or a
popular “optimal success rate” into a universal recommendation. Is difficulty
estimated per item, per concept, per support condition or per learner? How are
unproductive struggle, repeated remediation and mistaken prerequisites handled?
What minimum data, calibration or authored metadata does a policy actually need?

### 4. How can learners correct the scheduler and pace themselves?

Look for measured evidence and documented design experience for choosing another
goal, requesting/restoring help, easier/harder work, skipping, pausing, revisiting
and overriding recommendations. How do systems react to override without penalty
or interpreting it automatically as failure? What happens when users are novices,
uncertain about their needs, or repeatedly choose comfortable familiar work?
Distinguish learner agency from maximizing engagement, completion or session length.
Include evidence about burden/frustration and comparison against simpler choice.

## Evidence and access discipline

- Prefer original evaluations, credible full-text author manuscripts, systematic
  reviews and official technical reports. Distinguish peer review, preprint, theory,
  product documentation, practitioner experience and vendor claims. Secondary
  sources may locate originals but cannot silently replace an experiment.
- Provide author/organization, year, title, venue and DOI/direct URL for every
  load-bearing source. Mark access: full text, abstract, official summary, secondary
  only, or unverified lead. Do not claim to have read what you could not open.
- Label claims: **[E] empirical educational outcome**, **[M] model/measurement
  benchmark**, **[D] implementation/design account**, **[T] theory/synthesis**,
  **[H] your proposed inference**. A vendor claim is additionally identified as such.
  An [M] prediction result is not an [E] learning gain. Self-reported confidence,
  perceived learning or enjoyment is not a measured retention/transfer result.
  Name the actual instrument/outcome and include uncertainty/confounds.
- Quote little or not at all; paraphrase accurately. Never invent citations,
  samples, effect sizes, operating thresholds or inaccessible results. “No relevant
  evidence found in this search” is preferable to an unsupported recommendation.
- Agreement among papers or product names is not independent replication if they
  reuse a dataset, cohort or evaluation. Identify common underlying evidence.
- Keep the search decision-focused. Prioritize a small set of original studies
  you can inspect fully over a huge bibliography. Normally 12–20 useful sources
  and six to eight cases suffice, but report fewer honestly if access is limited.
  Include short search/access gaps; do not bypass paywalls, credentials or terms.

## Required Markdown report

1. **Provenance:** service/provider, date, research mode as known (unknown if not
   observable), scope/access limits, and confirmation that no repository was read.
2. **Executive summary:** at most 300 words, including strongest result, most
   consequential caveat and what a small local app should investigate first.
3. **Prior-system case matrix:** the case details requested above, with source IDs
   and enough detail to distinguish the adaptation from its comparator/confounds.
4. **Findings for the four questions:** claim IDs, evidence tags and plain Markdown
   source links. Highlight disagreements, failures and conditions for applicability.
5. **Decision table for FractionFlow:** candidate rule | evidence/claim IDs | what
   must be observed | uncertainty/failure mode | learner override | local feasibility |
   minimal experiment or falsifier. Separate supported ingredients from your hypotheses.
6. **Two feasible first directions at most:** include a simple nonadaptive/authored
   or rules baseline, one small concept/task scope, a concrete short example showing
   how the next opportunity changes after assistance/error/override, and what NOT
   to infer. No universal numeric threshold, production algorithm or backend requirement.
7. **Source ledger and gaps:** stable source IDs, full citation/URL/access, study
   details and limitations; top five decision-relevant originals to verify; searches
   that failed and questions needing real learner evaluation rather than more papers.

Target about 3,000–5,000 words excluding evidence/source tables; be concise rather
than padding to a quota. A careful qualified answer is useful. A confident policy
with untraceable claims is not. No code or repository editing instructions.

Return a downloadable plain UTF-8 Markdown file if your interface supports it,
with readable Markdown links/DOIs that survive download (not only proprietary
citations). Use the applicable filename:
`chatgpt-practice-scheduler-research.md`, `claude-practice-scheduler-research.md`,
or `gemini-practice-scheduler-research.md`. If file download is unavailable, return
the complete Markdown so the owner can save it. Do not claim you wrote to our repo.

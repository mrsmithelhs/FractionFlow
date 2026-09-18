# FractionFlow Founding Documents — Review Synthesis

You are synthesizing multiple **independent, mutually blind** adversarial reviews of the
FractionFlow founding documents, plus one research summary, into a single synthesis
document that the project owner will triage from.

Your synthesis is advisory only. You are the last skeptical layer in a chain where
every layer was told to doubt the one before it: the founding documents were reviewed
skeptically, and you must now be skeptical of the reviewers.

## 1. Materials

Everything you need is in this folder (`reports/orchestration/founding-docs-review/`):

- `review-*.md` — the individual blind reviews. Read **all** of them, completely,
  before synthesizing.
- `research-report.md` and the `research/` subfolder — a research summary produced with
  subagent assistance.
- `founding-docs-review-prompt.md` — the prompt the reviewers worked from. Read it so
  you know what each reviewer was asked to do, what angles were suggested, and what
  output structure they were held to. Reviewers working from the same angle list may
  produce similar-looking findings for structural reasons; account for that when
  weighing convergence.
- The founding documents themselves, at `docs/founding/00-principles.md` through
  `docs/founding/06-roadmap.md`. You will verify quoted text against these.
- `README.md` and `docs/project-seed.md` for light context only.

## 2. Exactly One Writable File

Write your synthesis to `reports/orchestration/founding-docs-review/synthesis.md`.
That is the only file you may create or modify. Do not edit reviews, research files,
founding documents, or anything else in the repository. Do not commit anything. After
writing the file, give a brief summary in chat (a few paragraphs, not the full text).

## 3. Latitude — Follow Leads, Don't Redo Work

You have latitude to:

- **Verify quotations.** Before letting a reviewer's internal-evidence finding carry
  weight, check that the quoted passage exists in the founding document and says what
  the reviewer claims. A finding built on a misquote collapses; record that in your
  reviewer-reliability notes.
- **Spot-check external claims.** Where a major recommendation rests on a specific
  cited study, standard, or product, you may verify the source exists and plausibly
  says what is claimed. Bounded checks only.
- **Reconcile paraphrases.** Different reviewers may describe the same document
  passage differently; read the passage and decide what it actually says.

You must not:

- Re-run literature scans or systematic external research.
- Re-review the founding documents from scratch, angle by angle.
- Expand the scope because an interesting door is open. If you find something the
  reviewers should have caught but did not, record it as a note with your confidence
  level — do not silently turn the synthesis into a fifth review.

## 4. Skepticism Rules

These govern how you weigh what the reviewers produced.

### 4.1 Convergence is not proof

Agreement among blind reviewers raises the **priority of investigating** a finding; it
does not establish the finding. Consider that reviewers may share common-mode priors —
similar training, similar angle lists, similar defaults about what good design looks
like. Ten reviewers with the same blind spot converge on the same wrong answer
confidently. For each convergent finding, ask: is this independent observation, or a
shared assumption being echoed?

### 4.2 Single-reviewer findings are not demoted

A finding raised by exactly one reviewer is not weaker for being lonely. Mutual
blindness means the others simply did not see it, and review coverage is never uniform.
Preserve single-reviewer findings at full strength pending triage.

### 4.3 Absence of evidence is not evidence of absence

When a reviewer reports that research does not support design choice X, that
establishes a **gap in the literature**, not a failure of X. Treat "no studies support
X" as a statement about the state of research, never as a finding that X does not
work. Where a reviewer's recommendation leans on the absence of supporting evidence
for the project's chosen design, identify that dependence explicitly and mark the
recommendation as design judgment rather than evidence-backed, unless the reviewer
also produced **positive** evidence against the design.

### 4.4 Evidence that Y works is not evidence that Z should become Y

When a reviewer points to a studied intervention, product, or design strategy that
works, that supports the claim about Y — it does not by itself demote the project's
different design Z. "Y has support" must not silently become "replace Z with Y" or
"the project should narrow into a repeat of Y." Before accepting any recommendation
that narrows the project toward a studied alternative, require a positive argument for
why Z fails or why Y-and-Z cannot coexist. Consider both/and before either/or.

### 4.5 Reviewer severities are recommendations, not measurements

Re-derive your own urgency for each finding from evidence strength × consequence.
Flag severity claims that are disproportionate to the evidence offered, in either
direction.

### 4.6 Watch for reviewer overreach

A reviewer's job is to find weaknesses and recommend responses, not to redesign the
product along their own preferences. Where a review drifts from critique into a
preferred redesign, label that drift. The fixer's taste is not evidence.

## 5. Required Structure of `synthesis.md`

1. **Sources synthesized** — the exact files, one line each on method if evident.
2. **Convergent findings** — findings raised independently by multiple reviewers, each
   attributed, with your evidence-status label (see 5.6) and an explicit note on
   whether the convergence looks like independent observation or common-mode echo.
3. **Contested and divergent points** — where reviewers disagree, present each side at
   its strongest, and state what evidence or experiment would discriminate.
4. **Single-reviewer findings** — preserved unranked; do not bury them at the bottom as
   an afterthought.
5. **Reviewer-reliability notes** — specific, fair, and evidence-linked: misquotes
   found (quote the actual text), severity miscalibration, overreach instances,
   common-mode convergence risks. Do not editorialize; show the text.
6. **Evidence-status audit** — for every major finding and recommendation, label it:
   - **Established** — supported by internal text or verified external evidence;
   - **Plausible** — reasonable inference;
   - **Judgment** — primarily the reviewer's or your design judgment;
   - **Speculation** — offered without support.
   Flag explicitly wherever absence-of-evidence reasoning (rule 4.3) or
   works-elsewhere reasoning (rule 4.4) is load-bearing in a recommendation.
7. **Triage table for the owner** — one row per finding cluster:
   `finding → recommended disposition (revise a founding document now / investigate
   before development / test in the first vertical slice / defer) → which founding
   document should canonically own the change`. Keep this selective; do not convert
   every observation into pre-development work.
8. **Bottom line** — what to preserve, what to change now, what to leave for
   prototyping. A few paragraphs, no numeric score.

## 6. Ground Rules

- Reference all files by repository-relative path; no absolute machine paths anywhere
  in what you write (this repository's remote is public).
- Do not resolve questions that belong to the project owner. Your dispositions are
  recommendations; the owner triages every finding.
- Do not treat the founding documents as canon, and do not treat the reviews as canon
  either. Quote, verify, then weigh.
- The best synthesis is not the longest. The owner should finish it knowing what to
  act on, what to test, and what to ignore — and why.

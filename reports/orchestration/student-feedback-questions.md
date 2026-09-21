# FractionFlow — Student Feedback Questions

- **Date:** 2026-09-21
- **For:** a Google Doc handed to a group of high school students alongside the link
- **Revision under test:** `b418e8a` at https://mrsmithelhs.github.io/FractionFlow/

---

## Part 1 — Paste this into the Google Doc

> ### Try FractionFlow
>
> **Link:** https://mrsmithelhs.github.io/FractionFlow/
>
> It's one fraction problem. It takes about five minutes. Nothing is saved, nothing is graded, and
> there's no login — if you want to start over, reload the page.
>
> **Please don't put your name on this.** Just your answers.
>
> Work through the problem the way you normally would. Then answer these three questions. A sentence
> or two each is plenty.
>
> ---
>
> **1. Was there any point where you stopped, hesitated, or had to read something twice? What was on
> the screen when that happened?**
>
> *If it never happened, say so — that's a real answer.*
>
> ---
>
> **2. Was there anything on the screen you weren't sure about — a button, a bar, or a message — where
> you couldn't tell what it was for or what it would do?**
>
> *Name it, and say what you thought it might do.*
>
> ---
>
> **3. Imagine a younger student who finds fractions hard. Which one part of this would help them most,
> and which one part would confuse them?**
>
> *One of each. You can say "nothing" for either.*
>
> ---
>
> Thanks. If you noticed anything else — something broken, something that looked wrong, something you
> liked — put it at the bottom.

---

## Part 2 — Notes for the owner, not for the doc

### What these questions are doing

`05-quality-and-validation.md` §52 is explicit that *"Did you like it?"* is the wrong question and that
**observation of behavior is often more informative** than preference. These students are writing
rather than being observed, so each question asks them to recall a behavior instead of rating an
experience:

| question | §52 bullet it targets |
|---|---|
| 1 — stopped, hesitated, re-read | *"where learners hesitate"*, *"which prompts require rereading"* |
| 2 — unsure what something was for | *"whether they understand what controls do"* |
| 3 — helps / confuses a younger student | *"whether they notice intended transformations"*, wording and affordance |

Question 2 is the one I expect to earn its place. There are three known candidates already on the
board and none of them has ever been put to a reader: the **"Replay the last change"** button, which
does nothing visible in two of the four display conditions; the **`reflect` screen**, where the
symbolic row shows `8/12 + 3/12 = 11/12` while the question asks about `7/12`; and the **"Show
previous steps (6 completed)"** disclosure. If students name any of those unprompted, that is a real
finding rather than a confirmation of one.

Question 3 does double duty. It gets at comprehensibility, and it invites the student to think about a
younger learner without requiring them to pretend to be one.

### How to file the results

**This is not child-usability evidence for the Phase 2 target age**, and it must not be recorded as
such. The slice targets ages roughly 8–11 at the stated starting point; these students are outside
that range, so the responses cannot close the `n = 0 children` gap in
`reports/development/plan-09-app-shell-condition-switcher-and-acceptance/acceptance-evidence.md` §7.

It is, however, evidence about a population the project explicitly cares about. **DECISION-016 names
the repair learner — an older student who never consolidated fractions — as the product's primary
audience**, with repair entry deferred to Phase 3+. A high school student who finds the premise check
baffling, or who says the bars finally made renaming make sense, is telling you something directly
relevant to that audience, ahead of the packets that will serve it.

So: file as **tier-1 adult-adjacent review, n = however many respond**, labelled as secondary-age
feedback on a slice built for upper elementary. Record it in `reports/orchestration/`, not inside the
`plan-09` acceptance evidence, which is dispositioned and closed.

### Handling

§52's boundary applies whether or not the students are the target age:

- Appropriate permission before the session, per your school's norms.
- **No names, no contact details, no identifiable screenshots or recordings** in the repository, the
  issue tracker, test fixtures, or the deployment.
- Retain only de-identified interaction evidence, design impact, and follow-up questions.
- If permission or safe handling cannot be established, **record the design question without the
  material**.
- Nothing a student writes becomes a test fixture. Fixtures stay synthetic.

### If it goes well

Two or three of these responses will probably generate a repair or a `plan-10` dossier input. More
than that and it is worth a short write-up of its own rather than a set of loose quotes — say the word
and I will draft one from whatever comes back.

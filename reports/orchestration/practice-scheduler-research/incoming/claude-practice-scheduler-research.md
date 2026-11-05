# FractionFlow practice-scheduler evidence review (claude-practice-scheduler-research.md)

The best-supported way to start is not an adaptive learner model. Start with a well-authored, fixed, mixed practice session. Then add a small set of transparent, assistance-aware rules that only shape the current visit, and give the learner a no-penalty way to override them. Across the evaluations I could reach, the clearest learning gains came from instructional ingredients: interleaving, spaced retrieval, feedback, and fading worked examples. In the field trials, those ingredients were bundled with adaptation, so the adaptive part was never isolated.

## TL;DR

- **What worked, and why that doesn't prove adaptation works:** Large field trials found modest gains for whole systems. Cognitive Tutor Algebra I found "no effects in the first year of implementation" (EEPA 2014 abstract); in year 2, high schools showed an effect of approximately 0.2 SD, which the IES award summary equates to moving a student from the 50th to the 58th percentile. ASSISTments showed about +0.18 SD. In both, the adaptive logic came packaged with curriculum, feedback, teacher reports and training. When the instructional ingredient itself was isolated, effects were often larger and needed no learner model: interleaving the *same* problems gave d = 0.83 on a delayed test in 54 classes. The cleanest isolated adaptive-policy wins were small lab or classroom studies (adaptive fading of worked examples, d ≈ 0.5–0.6, N = 57). Adaptive spaced repetition mostly made practice more *efficient* (fewer items, similar scores) rather than more effective.
- **How to model what a learner knows:** Studies of mastery criteria find that *which evidence you count, and the threshold you use*, matters more than how sophisticated the model is. Simple counters behave like special cases of Bayesian knowledge tracing (BKT). The ALEKS scoring rule is a good template for FractionFlow: a success right after viewing an explanation earns less credit, and repeated errors trigger a gentle "try something else". None of these thresholds, and no "85% optimal success rate", transfers to fractions.
- **What to investigate first:** Build a no-history authored baseline for one scope (fraction magnitude: comparison plus number-line placement). Then test a within-visit rules variant that does three things: distinguishes assisted from unassisted success, routes away from repeated struggle, and treats learner overrides as choices rather than failures. Compare the two on a delayed, unassisted check, not on time-on-task or completion. Learner choice by itself averages roughly zero effect (g = 0.05). It helped in tutors only when it was scaffolded, for example with mastery cues or an open learner model.

---

## 1. Provenance

- **Service:** Claude (Anthropic), run as an agentic research session with web search and page fetch, plus one research sub-agent used to dig into a MOOC study in depth. Research mode label: unknown beyond that. Date: 5 November 2026.
- **Scope and access limits:**
  - The search budget was about 18 queries, so this is a bounded review, not a systematic one.
  - I read substantial full text for five sources: Salden et al. 2010; Matayoshi et al. 2025; Rushkin et al. 2017 (via the sub-agent); and parts of Rau et al. and Rohrer et al. through ERIC full-text snippets.
  - Many other sources were read only as abstracts, official summaries or search-result excerpts, and are marked that way.
  - Two fetches failed: the author PDF of the Doroudi et al. 2019 review returned an error, and the ACM full text of Rosen et al. 2018 was blocked.
  - I did not bypass any paywall.
- **Repository:** No FractionFlow repository, file or implementation was read. Everything about the project comes from the brief.
- **File:** Intended filename `claude-practice-scheduler-research.md`. I cannot write files to your system, so the complete Markdown follows for you to save.

---

## 2. Executive summary

The strongest result in this search is not an adaptive algorithm.

- **Interleaving with no adaptation:** A preregistered cluster-randomized trial reordered the *same* math practice problems so that problem types were interleaved. Students scored 61% vs 38% on an unannounced test one month later (d = 0.83, 54 seventh-grade classes) [S24].\[1\]
- **Fraction-specific studies:** In an intelligent tutor, interleaving fraction *task types* while holding representations steady, or moving from blocked to interleaved representations, beat fully blocked schedules [S5, S6].\[2\]\[3\]\[4\]
- **Isolated adaptive policies:** These produced smaller or efficiency-only benefits:
  - Adaptive fading of worked steps using a knowledge-tracing threshold beat fixed fading in a 57-student lab study [S7].\[5\]
  - In a trial with 62 Year-3 surgery-clerkship students, the adaptive spaced-repetition cohort answered significantly fewer items yet achieved comparable end-of-course scores (p = 0.37); Kerfoot (J Urol 2010) reports this as a 38% increase in learning efficiency [S14].
  - A MOOC adaptive engine showed no significant post-test difference in one randomized run [S12].\[6\] A later run claimed gains, but about 80% of learners never took the post-test [S13].\[7\]
- **Commercial adaptive systems:** ALEKS was "as good as, but not better than" classroom teaching across 15 studies [S4].\[8\] The Cognitive Tutor Algebra I effect appeared only in year 2 [S1].\[9\]

**Most consequential caveat:** almost every positive field result bundles adaptation with new content, feedback, teacher reports, coaching, or extra practice. Nothing I found isolates a *task-selection* policy for fractions. Separately, FractionFlow's history has no elapsed time, so it cannot support claims about forgetting or spacing across days.

**What to investigate first:**
1. Build an authored, interleaved, no-history session for fraction magnitude (comparison plus number-line placement) as the baseline.
2. Build a variant with a few within-visit rules: discount assisted successes, cap repeated struggle by switching representation or purpose, restore support after errors and fade it after unassisted successes, and offer no-penalty learner choices.
3. Measure both on a short *unassisted* delayed check, not on engagement.

---

## 3. Prior-system case matrix

Access codes: FT = full text read; PT = partial full text; AB = abstract/official summary; SN = search-result snippet only.

| Case (source) | What was adapted / selected | Learner-model assumption | Comparator | Population, sample, allocation | Duration | Outcomes (immediate / delayed / transfer) | Attrition / selection | Adaptation isolated? Confounds | Policy access |
|---|---|---|---|---|---|---|---|---|---|
| **A. Cognitive Tutor Algebra I at scale** [S1] (AB + RAND/IES summaries) | Problem selection via cognitive-model mastery learning inside a full blended curriculum | Knowledge tracing per production rule (from product descriptions; not detailed in what I read) | Schools' existing algebra curricula | Middle and high schools in 7 states (IES lists 54 HS, 68 MS); matched pairs randomized at school level | 2 school years | Year 1: no effect. Year 2: HS ≈ +0.20 SD (significant); MS similar but not significant. Algebra proficiency exam | MS cohort 1: treatment scored 0.31 SD lower at pretest (addendum) | **No.** New curriculum, textbook, 4 days of teacher training, blended class time. Cost about $97 vs $28 per student | Proprietary\[10\]\[11\]\[12\] |
| **B. ASSISTments homework (Maine; NC replication)** [S2, S3] (AB + independent review) | Mostly *not* task selection: immediate feedback, hints, teacher reports. Some "Skill Builder" assignments use 3-correct-in-a-row mastery | N-consecutive-correct heuristic for Skill Builders | Business-as-usual homework | Maine: 43 schools, about 2,850 Grade 7 students, 92.6% White; school-level randomization. NC: 63 schools, about 9,073 students | 1 year (Maine); 2 years plus follow-up (NC) | Maine: +0.18 SD on TerraNova at end of Grade 7, larger for low prior achievers. NC: +0.10 SD on state test one year *after* the program | Maine: 6.5% school, 10.1% student attrition, similar across arms | **No.** Bundled with 3 days of PD and coaching. The benefit is mainly feedback plus teacher formative assessment | Platform is public. Policy is simple (3 in a row)\[13\]\[14\]\[15\]\[16\] |
| **C. ALEKS** [S4, S16] (AB; FT for S16) | Knowledge-space assessment chooses "ready to learn" topics; score-based mastery per topic | Knowledge space theory plus probability estimates; topic-level mastery score | Traditional classroom teaching (meta-analysis); two mastery thresholds (A/B test) | Meta-analysis: 15 studies, 24 samples, secondary and postsecondary. A/B test: topic-level randomization (5%/5%) across ALEKS users, Apr 2023–Nov 2024 | Varies | Meta-analysis: "as good as, but not better than" classroom teaching; shorter use had larger effects. A/B test: high threshold reduced forgetting, but the gap shrank over weeks | Vendor-run A/B test; retention measured on an embedded extra item | Meta-analysis: product vs teaching. **A/B test isolates the threshold only** | Scoring rule published in S16 |
| **D. Fractions Tutor practice schedules** [S5, S6] (AB + PT) | Order of graphical representations (blocked → interleaved) and of task types | None. Fixed authored schedules (BKT used only *post hoc* for analysis) | Four authored schedules compared with each other | Grades 4–5 (and 5–6); in-class randomization; 230 analysed of 527 enrolled (S5); 296 (2010 conference report) | About 5 hours over 5–6 days | Interleaved > blocked on several measures at immediate and 7-day delayed tests. Think-alouds: students connected representations only when prompted | Large exclusion: missed test day or <67% of problems completed | **Yes for schedule** (content held constant). Not adaptive | Fully described\[4\]\[17\] |
| **E. Adaptive fading of worked examples (Geometry Cognitive Tutor)** [S7] (FT) | Whether each step is shown worked or left open, per principle | BKT on self-explanation correctness. Fade when estimate ≥ .7, restore worked step when it drops < .5 | Standard tutor (pure problem solving) and fixed fading | Lab: 57 German Grade 9–10 students, random assignment. Classroom: 51 US vocational Grade 9 students, stratified random assignment\[5\] | Lab: 1 session plus 1-week delayed test | Lab: adaptive > others, d = .49 immediate, .59 delayed. Fixed fading = problem solving. Adaptive used fewer worked steps; no time difference | Classroom: substantial absenteeism | **Mostly yes** (same problems in lab). Small sample. Thresholds not justified empirically | Fully described |
| **F. Shared student/system problem selection + open learner model (Lynnette equation tutor)** [S8, S9, S10] (AB/SN) | Student picks problems within a system-chosen level; OLM shows skill bars; mastery-oriented prompts; game rewards | BKT skill bars | Full system control; standard ITS; DragonBox game | Grades 7–8: 302 across two experiments (S9); 267 (S10); classroom randomization | Short classroom units | Shared control plus mastery-oriented features > full system control (S8). OLM main effect in one experiment, OLM × shared-control interaction in the other (S9). Rewards plus re-practice *hurt* post-test (S10). No effect on later problem-selection skill (S8) | Not detailed in what I read | **Partly.** Separate factorial manipulations | Described in papers\[18\]\[19\]\[20\] |
| **G. HarvardX / Microsoft MOOC adaptive assessment (adult)** [S12, S13] (FT for S12 via sub-agent; SN for S13) | Next problem served by KC closeness to mastery and difficulty (S12); weighted remediation vs continuity (S13) | BKT variant (TutorGen SCALE; ALOSI). Mastery threshold ≈ 0.9; "stop on mastery" not used | Static problem set (S12); instructor-designed path (S13) | S12: 264 vs 254 randomized at registration. S13: 1,245 / 1,281 / 1,415 | Course run | S12: post-test d = 0.17, p = .21 (n.s.); experimental group tried fewer easy problems. S13: remediation-weighted arm "substantial increase in learning gains" (numbers not obtained) | S12: only about 40% took both tests. S13: post-test participation 19–21% per arm | Partly. Only 4 of 16 subsections adaptive in S12; ungraded tests | Partly public (open-source ALOSI)\[6\]\[7\]\[21\] |
| **H. Spaced education for medical trainees (professional)** [S14, S15] (AB) | S15: spaced, repeated question cycles vs bolus modules. S14: adaptive algorithm retires mastered items | S14: items correct → fewer repeats | S15: same content as web modules. S14: non-adaptive fixed review | S15: 724 urology residents, randomized crossover by topic. S14: 62 Year-3 med students | Weeks to months | S15: long-term score gain 15.2% vs 3.4%; completion 77% vs 66%. S14: significantly fewer items answered (p = .001), comparable end-of-course score (p = .37); reported as a 38% increase in learning efficiency | Completion differed between arms in S15 | S15 isolates spacing/repetition, not adaptation. S14 isolates adaptation, but the outcome is efficiency, not more learning | Described; author had financial interest in the platform (S14) |
| **I. Learning-progress bandit sequencing (ZPDES/RiARiT)** [S23] (AB/SN) | Next activity chosen by estimated recent learning progress, inside expert-defined constraints | Multi-armed bandit on empirical progress; ZPD as design aim | Hand-designed expert sequence | 400 children aged 7–8, 11 schools; number decomposition with money (tablet) | Short | Reported reaching harder exercise types sooner; detailed learning outcomes not verified here | Unknown | Yes for sequencing, but outcomes are mostly in-system progress | Algorithm published\[22\]\[23\] |

**Sectors with gaps:** I found no accessible evaluation of a certification-preparation *practice scheduler designed to teach*. Computerized adaptive testing (CAT) for exams estimates ability to classify candidates efficiently. It is a measurement policy, not an instructional one, and nothing in this search shows that its selection rules improve learning. I also found no study that isolates a task-selection policy for fractions specifically.

**Shared underlying evidence:** S5 and the 2010 conference report on the Fractions Tutor appear to come from the same research program and possibly overlapping cohorts. Their conclusions differ in emphasis: the 2010 report favored blocking, or moving from blocked to interleaved; the 2014 paper favored interleaving over blocking.\[3\]\[4\] Treat them as one line of evidence, not a replication. S2 and its JREE follow-up reanalyze the same Maine trial. S12 and S13 come from the same team and platform lineage.

---

## 4. Findings for the four questions

### Q1. What has actually been tried, and what happened?

**C1.1 [E] Whole adaptive systems show small or delayed effects when tested at scale, and every one is bundled.**
- Cognitive Tutor Algebra I found "no effects in the first year of implementation"; in year 2, high schools showed an effect of approximately 0.2 SD, which the IES award summary equates to moving a student from the 50th to the 58th percentile [S1]. The authors' own guidance is to expect delayed effects.
- ASSISTments gained 0.18 SD in Maine and 0.10 SD one year later in North Carolina [S2, S3]. However, its evaluated mechanism is feedback plus teacher reporting plus training, not a scheduler.\[14\]\[15\]
- ALEKS was no better than classroom teaching across 15 studies [S4].\[8\] A secondary review also describes a matched (non-randomized) study of low-performing middle schoolers in which ALEKS students progressed *less* (ES −0.25).\[24\] I could only see that in a secondary source, so treat it as a lead.
- *Applicability:* none of these tells you whether FractionFlow's task-selection rules will help. They tell you that a coherent practice environment with feedback can help, slowly, alongside a teacher.

**C1.2 [E] Fixed practice schedules have large, isolated effects.**
- Interleaving identical problems produced d = 0.83 one month later [S24]. Teachers needed no training, but they reported that interleaved assignments took longer, so the effect per minute is smaller.\[1\]\[25\]
- In fractions, interleaved schedules beat blocked ones on several measures at a 7-day delay [S5]. Interleaving *task types* while blocking representations beat the reverse for representational knowledge [S6].\[2\]\[4\]
- *Applicability:* these are 7th-grade topics (S24) and Grades 4–6 fraction tutor work (S5, S6). S5 also excluded many students who did not complete the work.\[17\]

**C1.3 [E] Isolated adaptive policies help modestly, sometimes only in efficiency, and sometimes not at all.**
- Adaptive fading beat fixed fading [S7].\[5\] The authors note that an earlier adaptive-fading study (Kalyuga & Sweller 2005) may have given the adaptive group extra practice, a confound their design avoided.\[5\]
- Adaptive spaced repetition led 62 Year-3 surgery-clerkship students to answer significantly fewer items (p = 0.001) with comparable end-of-course scores (p = 0.37), which Kerfoot (J Urol 2010) reports as a 38% increase in learning efficiency [S14].
- The first randomized MOOC run found no significant learning difference [S12]. The second claims gains but has 80% post-test missingness [S13].\[6\]\[7\]
- The RL instructional-sequencing review asks directly whether RL "actually help[s] students learn" [S17].\[26\] I could not open its full text to check its tallies, so I make no numeric claim from it.

**C1.4 [E] Some failures are informative.**
- In the equation tutor, adding performance-based stars to free re-practice *lowered* post-test scores compared with re-practice without rewards [S10]. Students who used a popular algebra game learned less than tutor users [S10].\[27\]
- Mastery loops produce "wheel-spinning": students who do not master a skill quickly rarely master it at all with more of the same practice [S21].\[28\]

### Q2. What should a tentative learner model mean?

**C2.1 [M] The model's sophistication is not the bottleneck; the evidence it counts is.**
- In a careful analysis of mastery criteria, the choice of input data and the threshold mattered more than the modeling technique. A simple exponential moving average was judged adequate [S19].\[29\]
- "N correct in a row" and a simplified ALEKS rule are both formally *optimal* mastery policies under particular BKT variants [S18].\[30\] Simple counters therefore carry hidden assumptions; they are not assumption-free.\[31\]
- With ASSISTments data, N-in-a-row with a higher N predicted performance on a transfer item better than lower knowledge-tracing thresholds [S20].\[30\]\[32\] Only 56 students met the thresholds, and the check was immediate.\[33\]
- *These are [M] results:* better prediction is not better learning.

**C2.2 [E/D] Assisted success should count for less, and this is implementable with a counter.** ALEKS's published scoring rule [S16] works as follows:
- A correct answer adds 1, or 2 if it immediately follows another correct answer.\[33\]
- An error subtracts 1, with floors and a second-attempt exception.\[33\]
- Viewing a worked explanation does not change the score, but it cancels the consecutive bonus.\[33\]
- Mastery requires 5 points for topics believed unknown and 3 for uncertain ones.\[33\]
- Five consecutive errors end the attempt with a gentle prompt to try another topic.\[33\]

The randomized threshold comparison found less forgetting with the higher bar, but the advantage shrank over the following weeks [S16].\[33\] *Applicability:* these are ALEKS topics with equal-difficulty instances, a mostly US college and K–12 user base, and vendor authors. The numbers are calibrated to that system, not to multi-step construction episodes.

**C2.3 [E] Knowledge-tracing estimates can drive *support* decisions as well as item selection.** The adaptive-fading tutor tracked each principle separately, faded a worked step at an estimate ≥ .7, and restored it below .5.\[5\] Learners could therefore move back to examples [S7].\[5\] The two-threshold gap is a useful design pattern: it stops support from flickering on and off. The particular values were not empirically justified.

**C2.4 [T/H] What would justify a narrow statement?** From C2.1–C2.3 and the wheel-spinning work, a defensible *practice-needs* statement such as "comparisons with unlike denominators have needed help recently" needs all three of:
- several opportunities for the same purpose;
- at least two different items or representations;
- a pattern that persists after assistance.

A defensible *strength* statement needs unassisted, first-attempt success across varied items and at least one representation that differs from the one practiced. It should *not* be based on:
- a single error, which may be a slip, an interface mishap, or a misread;
- successes that followed a model or construction aid;
- repeated success on the same item or representation, which may be recall of that item;
- anything from a shared profile without the learner confirming it.

The zone of proximal development (ZPD) shows up in S23 only as a design aim, operationalized as "activities where recent progress is highest".\[23\]\[34\] It is not a measured state.

**C2.5 [M/H] Sparse, cold, and contaminated data argue for a session-local model.** With 30 entries, no timestamps, and possibly several people on one profile, stored history cannot separate forgetting from a different person from a bad day.
- *[H]* Use stored history only to *suggest* a starting point, and ask the learner to confirm it ("Pick up with comparisons, or start fresh?").
- Let in-visit evidence drive in-visit decisions.
- Never let one stored outcome lock out a task family.

### Q3. How should challenge, support and practice be scheduled?

**C3.1 [E] Hold some dimensions steady while others vary.** In fraction tutors:
- Interleaving task types while keeping the representation steady helped representational knowledge [S6].\[2\]
- Moving from blocked to interleaved representations, or interleaving them, beat pure blocking [S5].\[3\]\[4\]
- Students connected representations only when explicitly prompted [S5].\[35\] Variety alone does not create conceptual links; a short prompt to compare does.

**C3.2 [E] Fade worked examples, and restore them when needed.** Adaptive fading beat fixed fading [S7]. The broader expertise-reversal literature reports that guidance which helps novices can become redundant or harmful as knowledge grows [S25]. Its implication is to adjust support as competence grows, not to remove it on a timetable.\[36\]

**C3.3 [E] Spacing and retrieval help adults, but the evidence is about days and weeks.** Medical-trainee spacing studies measured retention 18 to 45 weeks later [S15].\[37\] FractionFlow cannot schedule across days without timestamps. Within a visit, the honest options are:
- retrieval of earlier material, for example by returning to a purpose seen 5–10 minutes earlier;
- interleaving.

*[H]* Calling within-visit return "spacing" overstates what you can measure.

**C3.4 [M/T] No universal challenge target exists.** The "85% rule" was derived for gradient-descent learners on *binary classification* tasks and demonstrated in artificial and model neural networks [S22]. Its lead author, Robert Wilson, told UArizona News in November 2019 that the rule would most likely apply to perceptual learning, and told Newsweek that 85% is not "some magic number we should be aiming at all the time" and "only applies in the very limited settings we considered." It was not tested on children doing multi-step fraction construction, and accuracy there depends on how much support was given. *Do not use it as a target.* Similarly, the ALEKS thresholds of 3 and 5 [S16], the 0.7/0.5 fading thresholds [S7], and the 3-in-a-row rule [S2] are all system-specific.\[16\]

**C3.5 [E/M] Unproductive struggle is common and predictable; repeating the same thing is not a remedy.**
- Wheel-spinning was defined as 10 or more opportunities without 3 in a row; students who don't master early mostly never do [S21].\[38\]
- A decision-tree detector built on ASSISTments data (Kai et al. 2018, JEDM) reached an AUC of 0.684, which dropped to 0.636 after the student-level re-validation reported in an erratum [S26, SN].
- MATHia developers (Fancsali et al., AIED 2020) report that students failed to master the workspace in about 424,000 completions (~11.2%), with some workspaces near zero and others above 20%, and they read high-failure workspaces as signals to *redesign content* [S27, SN].
- ALEKS's response is a gentle switch after five consecutive errors [S16].\[33\]
- *[H]* The lesson for FractionFlow is to route struggle to a different representation, a prerequisite-like purpose, or a worked model, and to flag the task recipe for authoring review. Do not keep serving more of the same.

**C3.6 [H] Grain size of difficulty.** None of these studies estimates difficulty per learner in a way usable here. ALEKS uses equal-difficulty instances per topic [S16]. The fading tutor tracked each principle separately [S7]. The bandit used expert-ordered activity levels [S23].\[23\] For FractionFlow, the minimum is *authored* metadata per task recipe:
- purpose (which concept);
- representation;
- denominator class (same / related / unrelated; beyond one or not);
- support level;
- a coarse demand ordering.

Treat support level as a separate axis, not as "difficulty".

### Q4. How can learners correct the scheduler and pace themselves?

**C4.1 [E] Unscaffolded choice does roughly nothing on average.** A meta-analysis of learner control in educational technology (18 studies, 29 effects) found g = 0.05, near zero across most moderators [S11].\[39\] Choice is not harmful, but it is not a learning intervention by itself.

**C4.2 [E] Scaffolded shared control can help.** In the equation tutor:
- Shared control *with* mastery-oriented features beat full system control on learning, though it did not improve students' later problem-selection skill [S8].\[19\]
- An open learner model with self-assessment prompts improved learning in one experiment and interacted with shared control in another [S9].\[40\]\[41\]
- In design iterations, students looked at the skill bars but rarely used them to reflect until they were prompted [S9 background].\[42\]
- *Applicability:* Grades 7–8 equation solving, short units.

**C4.3 [E] Engagement mechanics can undermine learning when combined with free re-practice.** Stars for performance combined with free re-practice reduced post-test learning compared with re-practice alone [S10].\[20\]\[41\] *[H]* Keep FractionFlow's calm design: no streaks, no stars for "comfort replays".

**C4.4 [D/H] Overrides should be recorded as choices, not as evidence of skill.**
- In ALEKS, students can pick from a list of "ready" topics, but most take the suggested one [S16].\[33\] Defaults are powerful, so make them good.
- In the MOOC engine, re-submitting an old problem updated mastery but did not reorder already-served items [S12].\[6\] That is a pragmatic way to absorb learner-driven deviations.
- *[H]* Recommended handling:
  - "Easier", "skip" or "different picture" should not lower any estimate. It changes the next item and nothing else.
  - "Harder" opens a new demand with support available.
  - A run of comfortable choices should prompt one gentle, dismissible suggestion, not a lockout.
  - Do not measure success by session length or completion.

---

## 5. Decision table for FractionFlow

"Supported" means the ingredient has [E] backing in at least one comparable setting. "Hypothesis" means it is my inference for FractionFlow and still needs testing.

| # | Candidate rule | Evidence / claims | What must be observed | Uncertainty / failure mode | Learner override | Local feasibility | Minimal experiment or falsifier |
|---|---|---|---|---|---|---|---|
| R1 | **Authored, interleaved baseline session** that works with no history (mix purposes; keep the representation steady within short runs; end with a mixed review) | Supported: C1.2, C3.1 [S24, S5, S6] | Nothing (fixed) | Too hard for true novices; interleaving feels slower | Skip / "show me a model" | Trivial | Compare with a blocked version on a delayed unassisted check |
| R2 | **Assistance-discounted evidence per purpose × representation** (unassisted first-try = strong; success after model/construction/help = weak; error = weak negative) | Supported pattern: C2.2 [S16]; C2.1 [S19, S18] | First valid response, help/model/construction used, later correction | Mis-mapping a task to a purpose; interface errors counted as math errors | None needed (invisible) | Easy; extend the session log to all task families (**change**) | Does the counter's state predict an unassisted end-of-visit item better than raw % correct? |
| R3 | **Two-threshold support fading/restoring** (lower support after repeated unassisted success; restore after errors or on request) | Supported ingredient: C2.3, C3.2 [S7, S25]; thresholds = hypothesis | Same as R2, per support level | Fades too early and the learner flounders; restores too eagerly and becomes a crutch | "More support" always available; "Less support" offered | Easy | A/B: adaptive vs fixed fading for one purpose |
| R4 | **Struggle cap → switch, don't repeat** (after a short run of errors or assisted-only successes on one purpose, offer a different representation or worked model, or a related easier purpose) | Supported pattern: C3.5 [S16, S21, S27] | Consecutive non-independent outcomes | Switching too fast ("rescuing") versus wheel-spinning | "Keep trying this one" | Easy | Count wheel-spinning runs and delayed accuracy with vs without the cap |
| R5 | **In-visit retrieval of earlier successes** (revisit a purpose seen earlier this visit in a new item/representation) | Supported ingredient: C1.2, C3.3 [S24, S15] | Order within the visit | Repeating identical items inflates apparent mastery | Skip | Easy | Does a later-in-visit return predict the delayed check better? |
| R6 | **No-penalty choice menu** ("Same kind again", "Different picture", "Easier", "Harder", "Review"), recorded as choice | Hypothesis, informed by C4.1–C4.3 [S8, S9, S11, S10] | Choices made | Comfort loops; choice overload for young learners | It *is* the override | Easy | Choice-on vs default-only: delayed unassisted outcome plus a quick burden rating |
| R7 | **Tentative "what we've noticed" panel** (open learner model with hedged wording and a "that's not right" button) | Hypothesis from C4.2 [S9] | R2 state | Labels feel like grades; shared-profile confusion | Dismiss / correct | Moderate (wording design) | Do learners' self-assessments become more accurate? Any anxiety signals? |
| R8 | **Stored history only as a confirmable starting hint** | Hypothesis from C2.5 | ≤30 stored entries | Wrong person; stale data | "Start fresh" | Already feasible | How often do learners reject the hint? |
| R9 | **Do NOT adopt** an "85%" target, BKT parameter fitting, or bandit/RL selection now | C3.4, C1.3 [S22, S17, S23] | — | — | — | Fitting is infeasible without pooled data, which the no-upload constraint rules out | Revisit only if R2–R4 fail in testing |
| R10 | **Optional day-level date on history entries** (**change**; only if cross-day review becomes a goal) | C3.3 [S15, S14] | Day difference | Privacy perception; clock errors | Clear history | Easy | Not needed for the first experiments |

---

## 6. Two feasible first directions

**Scope for both:** fraction magnitude. That means comparison (optionally with construction) and number-line placement within 0–1 and then beyond 1. The scope is small, central to the research on fraction understanding, and already covered by the activity families you have.

### Direction 1 — Authored baseline (no adaptation, no history)

A fixed sequence of about 10–12 episodes:
1. Two short runs of placement on a number line with the representation held steady.
2. Comparison on bars, then the same comparisons on number lines, with a "how do these show the same thing?" prompt (C3.1, S5).
3. Interleaved comparison and placement items.
4. One beyond-1 placement.
5. A closing mixed review of two earlier purposes in new items.

Support defaults to "More" on the first item of each new purpose and "standard" afterwards, and learners can always change it. This is your control condition. It is also likely to be good on its own, and it is what everyone gets when history is missing.

### Direction 2 — Within-visit rules on top of the baseline (R2–R6)

**Example trace**, using a session-local record per (purpose × representation):

1. *Place 3/4 on a 0–1 number line, standard support.* Correct on the first try, no help. → Record "independent" for placement × line. Next: the baseline's planned comparison item.
2. *Compare 5/8 and 3/4 (bars).* First answer wrong. Learner requests help, sees a model, then answers correctly. → Record "assisted success" for comparison × bars, not "mastered" and not "failed". Next: **same purpose, same support, a different but parallel item** (2/3 vs 3/5), not a harder one.
3. *Compare 2/3 vs 3/5 (bars).* Wrong again, then correct after building equivalents. → Two non-independent outcomes in a row. The struggle rule (R4) fires and offers: "Want to try this on a number line, or see a worked comparison first?" Learner picks the number line. → Comparison × line, with support restored to "More".
4. *Learner taps "Something easier."* → The system offers a review of placement within 0–1, which was an earlier independent success. The tap is logged as a *choice*, and no comparison estimate changes.
5. *Placement of 7/4 (beyond one).* This is a new demand, so support starts at "More" even though placement within 0–1 was independent. Support and novelty are separate axes.

**What NOT to infer from this trace:**
- Not "struggles with comparison". Two assisted successes on bars after help could reflect learning in progress, an interface issue, or a different person at the keyboard.
- Not "has mastered placement". That rests on one item with one representation.
- The "easier" tap is not evidence of low ability.
- Nothing here licenses statements about retention across days.

**Changes this direction needs** (labelled as changes to current choices):
- Keep an in-memory, session-local record for *all* magnitude task families, not only comparison. It can be discarded at the end of the visit.
- Record which representation and support level each outcome came from.
- Record override choices as their own event type.

The persistent 30-entry history can stay as it is.

**How to evaluate:** Recruit a small group of learners, for example classes you can work with, each randomly given Direction 1 or Direction 2 for a visit. Use a short *unassisted* magnitude check at the end of the visit and again a few days later, administered outside the app or as a separate fixed form. Also collect a single-item burden/frustration rating. Do not judge by time-on-app, completion, or in-app accuracy. In-app accuracy is supposed to differ between conditions, because Direction 2 deliberately makes practice harder for learners who are succeeding and easier for those who are struggling.

**Where this could go wrong:**
- **Building a "smart" model before the authored sequence is good.** Ordering and representation choices probably matter more than any selection logic (C1.2 vs C1.3).
- **Turning tentative observations into displayed labels.** "Strengths/challenges" badges on a shared, unverified profile can mislabel children.
- **Optimizing for engagement.** S10 shows engagement mechanics can cost learning.

---

## 7. Source ledger and gaps

| ID | Citation (author, year, title, venue) | DOI / URL | Access | Study type and key details | Limitations |
|---|---|---|---|---|---|
| S1 | Pane, Griffin, McCaffrey & Karam (2014). Effectiveness of Cognitive Tutor Algebra I at Scale. *Educational Evaluation and Policy Analysis* 36(2):127–144. Plus RAND addendum WR-1050 | 10.3102/0162373713507480; rand.org/pubs/working_papers/WR1050.html | AB + official summaries | Cluster RCT; 7 states; 2 years; HS year-2 ≈ 0.20–0.21 SD | Bundled curriculum; year-1 null; MS pretest imbalance\[10\]\[43\] |
| S2 | Roschelle, Feng, Murphy & Mason (2016). Online Mathematics Homework Increases Student Achievement. *AERA Open* 2(4). Murphy et al. (2020) *JREE* 13(2) | 10.1177/2332858416673968; 10.1080/19345747.2019.1710885 | AB + snippets + Arnold Ventures review | Cluster RCT, 43 schools, Maine; ES 0.18 | Bundled PD; feedback, not scheduling; 92.6% White sample\[13\]\[15\]\[16\] |
| S3 | Feng et al. (2024). WestEd technical report on the NC replication of ASSISTments | wested.org (ASSISTments replication page) | SN/official summary | 63 schools; +0.10 SD at Grade 8 follow-up | Not independent of developer ecosystem; state-test outcome\[15\]\[44\] |
| S4 | Fang, Ren, Hu & Graesser (2019). A meta-analysis of the effectiveness of ALEKS on learning. *Educational Psychology* 39(10):1278–1292 | 10.1080/01443410.2018.1495829 | AB | 15 studies, 24 samples, 2005–2015; ALEKS ≈ traditional | Comparator heterogeneity\[45\] |
| S5 | Rau, Aleven, Rummel & Pardos (2014). How Should Intelligent Tutoring Systems Sequence Multiple Graphical Representations of Fractions? *IJAIED* 24:125–161. Also Rau et al. 2010 ITS (LNCS 6094) | 10.1007/s40593-013-0011-7; 10.1007/978-3-642-13388-6_45 | AB + PT (ERIC ED537218) | 4 schedules; 230 of 527 analysed; delayed 7-day test | Heavy exclusion; possible cohort overlap with 2010 report\[4\]\[17\]\[46\] |
| S6 | Rau, Aleven & Rummel (2013). Interleaved practice in multi-dimensional learning tasks: Which dimension should we interleave? *Learning and Instruction* | ScienceDirect S0959475212000527 | AB | Interleave task types > interleave representations (representational knowledge) | No effect on operational knowledge\[2\] |
| S7 | Salden, Aleven, Schwonke & Renkl (2010). The expertise reversal effect and worked examples in tutored problem solving. *Instructional Science* | 10.1007/s11251-009-9107-8 | FT (partial) | Lab N=57 (d .49/.59); classroom N=51; BKT .7/.5 thresholds | Small samples; geometry; thresholds unjustified |
| S8 | Long & Aleven (2016). Mastery-Oriented Shared Student/System Control Over Problem Selection in a Linear Equation Tutor. ITS 2016, LNCS 9684 | 10.1007/978-3-319-39583-8_9 | AB | Shared control + mastery features > system control | Sample size not seen; no transfer of selection skill\[19\] |
| S9 | Long & Aleven (2017). Enhancing learning outcomes through self-regulated learning support with an Open Learner Model. *UMUAI* | 10.1007/s11257-016-9186-6 | AB | 302 students, 2 experiments; OLM effects inconsistent across experiments | Mixed results\[18\]\[40\] |
| S10 | Long & Aleven (2014). Gamification of Joint Student/System Control Over Problem Selection. ITS 2014, LNCS 8474 | 10.1007/978-3-319-07221-0_47 | AB + SN | 267 students; rewards + re-practice hurt | Single study\[20\]\[41\] |
| S11 | Karich, Burns & Maki (2014). Updated Meta-Analysis of Learner Control Within Educational Technology. *Review of Educational Research* 84(3):392–410 | 10.3102/0034654314526064 | AB | 18 studies, 29 effects; g = 0.05 | Few studies; mixed ages |
| S12 | Rushkin et al. (2017). Adaptive Assessment Experiment in a HarvardX MOOC. EDM 2017, 466–471 | educationaldatamining.org/EDM2017/proc_files/papers/paper_167.pdf | FT (via sub-agent) | 264 vs 254; post-test d = 0.17, p = .21 | ~40% took both tests; 4/16 subsections adaptive; ungraded tests\[6\] |
| S13 | Rosen et al. (2018). The effects of adaptive learning in a MOOC on learners' skill development. L@S 2018 | 10.1145/3231644.3231651 | SN only | 3 arms (1,245/1,281/1,415); remediation arm reported gains | Table of gains not obtained; ~80% post-test missing\[7\]\[47\] |
| S14 | Kerfoot (2010). Adaptive Spaced Education Improves Learning Efficiency: A Randomized Controlled Trial. *Journal of Urology* 183(2):678–681 | 10.1016/j.juro.2009.10.005 | AB | 62 students; fewer items answered (p = .001); end-of-course scores comparable (p = .37); efficiency +38% | Equivalence not formally tested; author financial interest |
| S15 | Kerfoot et al. (2010). Online spaced education generates transfer and improves long-term retention of diagnostic skills. *J Am Coll Surg* 211(3):331–337 | 10.1016/j.jamcollsurg.2010.04.023 | AB | 724 residents; 15.2% vs 3.4% long-term gain | Differential completion; adult professionals |
| S16 | Matayoshi, Cosyn, Uzun & Kurd-Misto (2025). Using a Randomized Experiment to Compare Mastery Learning Thresholds. *JEDM* 17(1):308–336 | 10.5281/zenodo.15698758 | FT (partial) | Topic-level randomization; scoring rule published; gap shrinks over time | Vendor authors; retention via embedded item |
| S17 | Doroudi, Aleven & Brunskill (2019). Where's the Reward? A Review of RL for Instructional Sequencing. *IJAIED* 29:568–620 | 10.1007/s40593-019-00187-x | AB (full-text fetch failed) | Review of RL sequencing studies | Tallies not verified here\[26\] |
| S18 | Doroudi (2020). Mastery Learning Heuristics and Their Hidden Models. AIED 2020 | 10.1007/978-3-030-52240-7_16 | AB/SN | N-CCR and ALEKS rule = optimal under BKT variants | Theoretical\[31\] |
| S19 | Pelánek & Řihák (2017). Experimental Analysis of Mastery Learning Criteria. UMAP 2017 | 10.1145/3079628.3079667 | AB | Data/threshold > model; EMA adequate | Simulated + real; prediction focus |
| S20 | Kelly, Wang, Thompson & Heffernan (2015). Defining Mastery: Knowledge Tracing Versus N-Consecutive Correct Responses. EDM 2015 | educationaldatamining.org/EDM2015/uploads/papers/paper_311.pdf | AB/SN | Higher N predicted transfer item better | 56 students; immediate test\[32\] |
| S21 | Beck & Gong (2013). Wheel-Spinning: Students Who Fail to Master a Skill. AIED 2013, LNCS 7926 | 10.1007/978-3-642-39112-5_44 | AB | Early non-mastery predicts never mastering | Definition-dependent |
| S22 | Wilson, Shenhav, Straccia & Cohen (2019). The Eighty Five Percent Rule for optimal learning. *Nature Communications* 10:4646 | 10.1038/s41467-019-12552-4 | AB + SN | Theory/simulation; binary classification | Not tested on human math learning\[48\]\[49\] |
| S23 | Clement, Roy, Oudeyer & Lopes (2015). Multi-Armed Bandits for Intelligent Tutoring Systems. *JEDM* 7(2):20–48 | arXiv 1310.3174 | AB/SN | 400 children; progress-based sequencing vs expert | Outcome details not verified\[22\]\[50\] |
| S24 | Rohrer, Dedrick, Hartwig & Cheung (2020). A Randomized Controlled Trial of Interleaved Mathematics Practice. *J Educ Psych* 112(1):40–52 | ERIC EJ1237752; IES award page | AB + IES/WWC summary | 54 classes, 787 students; d = 0.83 at 1 month\[51\] | Researcher-made test; more time per assignment |
| S25 | Kalyuga, Ayres, Chandler & Sweller (2003). The Expertise Reversal Effect. *Educational Psychologist* 38:23–31; Kalyuga (2007) *EPR* | 10.1207/S15326985EP3801_4 | SN/secondary | Theory/synthesis of guidance × expertise | Synthesis, not one trial\[36\]\[52\] |
| S26 | Kai et al. (2018). Decision tree modeling of wheel-spinning and productive persistence in Skill Builders. *JEDM* | jedm.educationaldatamining.org (article 210) | SN | AUC 0.684 (0.636 after student-level re-validation, per erratum) | Prediction only |
| S27 | Fancsali et al. (2020). Towards Practical Detection of Unproductive Struggle. AIED 2020 | ERIC ED606472 | SN | MATHia ≈ 11.2% non-mastery completions | Practitioner/vendor-affiliated |

**Top five originals to verify first:**
1. S7 (Salden et al. 2010): read the classroom-study results section.
2. S16 (Matayoshi et al. 2025): read the effect sizes by time and by "struggle" level.
3. S5 (Rau et al. 2014): read the condition-level results and exclusions.
4. S24 (Rohrer et al. 2020): check the time-on-task caveats.
5. S8/S9 (Long & Aleven): check sample sizes and the exact interface of shared control.

**Searches or access that failed or were not done:**
- The Doroudi et al. 2019 author PDF returned an error.
- The Rosen et al. 2018 full text was blocked; Table 1 gains were not obtained.
- The search budget ran out before I could pull the IES fractions practice guide or fraction number-line intervention trials.
- No search targeted certification-prep systems that teach. I report no relevant evidence rather than filling the gap.

**Questions that need real learner evaluation rather than more papers:**
1. Does the authored interleaved session beat a blocked one *for FractionFlow's construction-heavy episodes*, on a delayed unassisted check?
2. Do the R2–R4 rules beat the authored baseline at all, or do they just add complexity?
3. Do young learners use "Easier/Harder/Different picture" sensibly, and does the menu add burden?
4. How often does stored history belong to a different person, judged by how often learners reject the confirmable hint?
5. Which support transitions (More → standard → Less) do learners experience as helpful rather than as being judged?

## Sources

1. [ERIC - EJ1237752 - A Randomized Controlled Trial of Interleaved Mathematics Practice, Journal of Educational Psychology, 2020-Jan](https://eric.ed.gov/?id=EJ1237752)
2. [Interleaved practice in multi-dimensional learning tasks: Which dimension should we interleave? - ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0959475212000527)
3. [Blocked versus Interleaved Practice with Multiple Representations in an Intelligent Tutoring System for Fractions | Springer Nature Link](https://link.springer.com/chapter/10.1007/978-3-642-13388-6_45)
4. [ERIC - EJ1036905 - How Should Intelligent Tutoring Systems Sequence Multiple Graphical Representations of Fractions? A Multi-Methods Study, International Journal of Artificial Intelligence in Education, 2014-Jun](https://eric.ed.gov/?id=EJ1036905)
5. [The expertise reversal effect and worked examples in tutored problem solving](http://www.cee.uma.pt/ron/Salden%20et%20al.%20-%20The%20Expertise%20Reversal%20Effect%20and%20Worked%20Examples.pdf)
6. <http://educationaldatamining.org/EDM2017/proc_files/papers/paper_167.pdf>
7. [The Effects of Adaptive Learning in a Massive Open](https://nativio.net/wp-content/uploads/2018/09/adaptivelas2018.pdf)
8. [ERIC - EJ1232632 - A Meta-Analysis of the Effectiveness of ALEKS on Learning, Educational Psychology, 2019](https://eric.ed.gov/?id=EJ1232632)
9. [ERIC - EJ1024233 - Effectiveness of Cognitive Tutor Algebra I at Scale, Educational Evaluation and Policy Analysis, 2014-Jun](https://eric.ed.gov/?id=EJ1024233)
10. [Effectiveness of Cognitive Tutor Algebra One Implemented at Scale | IES](https://ies.ed.gov/use-work/awards/effectiveness-cognitive-tutor-algebra-one-implemented-scale)
11. [Working Paper Addendum to Effectiveness of Cognitive Tutor Algebra I at Scale](https://www.rand.org/content/dam/rand/pubs/working_papers/WR1000/WR1050/RAND_WR1050.pdf)
12. [Does an Algebra Course with Tutoring Software Improve Student Learning? | RAND](https://www.rand.org/pubs/research_briefs/RB9746.html)
13. [Online Mathematics Homework Increases Student Achievement - Jeremy Roschelle, Mingyu Feng, Robert F. Murphy, Craig A. Mason, 2016](https://journals.sagepub.com/doi/10.1177/2332858416673968)
14. [July 2024 1 Arnold Ventures Social Programs That Work Review](https://evidencebasedprograms.org/uploads/assets/assistments.pdf)
15. [Arnold Ventures | A Replication Randomized Controlled Trial (RCT) of…](https://www.arnoldventures.org/stories/a-replication-randomized-controlled-trial-rct-of-assistments-an-online-study-tool-to-improve-student-math-outcomes-in-seventh-grade)
16. [ASSISTments](https://www.blueprintsprograms.org/programs/1261999999/assistments/print/)
17. [Interleaved Practice with Multiple Representations:](https://files.eric.ed.gov/fulltext/ED537218.pdf)
18. [Enhancing learning outcomes through self-regulated learning support with an Open Learner Model | User Modeling and User-Adapted Interaction | Springer Nature Link](https://link.springer.com/article/10.1007/s11257-016-9186-6)
19. [Mastery-Oriented Shared Student/System Control Over Problem Selection in a Linear Equation Tutor | Springer Nature Link](https://link.springer.com/chapter/10.1007/978-3-319-39583-8_9)
20. [Gamification of Joint Student/System Control over Problem Selection in a Linear Equation Tutor | SpringerLink](https://link.springer.com/chapter/10.1007/978-3-319-07221-0_47)
21. [Harvard-Microsoft open source adaptive learning engine: From black box to experimental framework](https://www.linkedin.com/pulse/harvard-microsoft-open-source-adaptive-learning-engine-yigal-rosen)
22. [Multi-Armed Bandits for Intelligent Tutoring Systems Benjamin Clement](https://files.eric.ed.gov/fulltext/EJ1115278.pdf)
23. [(PDF) Multi-Armed Bandits for Intelligent Tutoring Systems](https://www.researchgate.net/publication/257657122_Multi-Armed_Bandits_for_Intelligent_Tutoring_Systems)
24. [A critical review of the impact on learning outcomes of ...](https://www.tandfonline.com/doi/pdf/10.1080/02671522.2021.1907778)
25. [Rohrer, D., Dedrick, R. F., Hartwig, M. K., & Cheung, C.-N. (2020). A randomized controlled trial of interleaved mathematics practice. Journal of Educational Psychology, 112(1), 40–52](https://notes.andymatuschak.org/zHvJf88XUgLPMhdTigkoiUR)
26. [Where’s the Reward? | International Journal of Artificial Intelligence in Education | Springer Nature Link](https://link.springer.com/article/10.1007/s40593-019-00187-x)
27. [Gamification of Joint Student/System Control Over Problem ...](https://www.cs.cmu.edu/~ylong/papers/Long&Aleven_ITS2014.pdf)
28. [Wheel-Spinning: Students Who Fail to Master a Skill | Springer Nature Link](https://link.springer.com/chapter/10.1007/978-3-642-39112-5_44)
29. [Analysis and design of mastery learning criteria: New Review of Hypermedia and Multimedia: Vol 24, No 3](https://www.tandfonline.com/doi/abs/10.1080/13614568.2018.1476596)
30. [\[PDF\] Mastery Learning Heuristics and Their Hidden Models | Semantic Scholar](https://www.semanticscholar.org/paper/Mastery-Learning-Heuristics-and-Their-Hidden-Models-Doroudi/4b2ee45fac8a0d2b04d59ead519b61ca1824f7b0)
31. [Mastery Learning Heuristics and Their Hidden Models | Springer Nature Link](https://link.springer.com/chapter/10.1007/978-3-030-52240-7_16)
32. [Defining Mastery: Knowledge Tracing Versus N- Consecutive Correct Responses](https://www.educationaldatamining.org/EDM2015/uploads/papers/paper_311.pdf)
33. [Using a Randomized Experiment to Com- pare Mastery Learning Thresholds](https://jedm.educationaldatamining.org/index.php/JEDM/article/download/900/253)
34. [Multi-Armed Bandits for Intelligent Tutoring Systems](https://www.emergentmind.com/papers/1310.3174)
35. [How Should Intelligent Tutoring Systems Sequence Multiple Graphical Representations of Fractions? A Multi-Methods Study - ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1560429226003513)
36. [Expertise reversal effect and its instructional implications: introduction to the special issue | Instructional Science | Springer Nature Link](https://link.springer.com/article/10.1007/s11251-009-9102-0)
37. [Adaptive Spaced Education Improves Learning Efficiency: A Randomized Controlled Trial - ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0022534709026408)
38. [Wheel-Spinning: Students Who Fail to Master a Skill](https://www.researchgate.net/publication/290777423_Wheel-Spinning_Students_Who_Fail_to_Master_a_Skill)
39. [ERIC - EJ1034262 - Updated Meta-Analysis of Learner Control within Educational Technology, Review of Educational Research, 2014-Sep](https://eric.ed.gov/?id=EJ1034262)
40. [Enhancing learning outcomes through self-regulated learning support with an Open Learner Model | User Modeling and User-Adapted Interaction](https://dl.acm.org/doi/10.1007/s11257-016-9186-6)
41. [(PDF) Gamification of Joint Student/System Control Over Problem Selection in a Linear Equation Tutor](https://www.researchgate.net/publication/268577301_Gamification_of_Joint_StudentSystem_Control_Over_Problem_Selection_in_a_Linear_Equation_Tutor)
42. [Supporting Students' Self-Regulated Learning with an Open ...](https://www.cs.cmu.edu/~ylong/papers/SupportSRLwithOLM.pdf)
43. [Addendum to Effectiveness of Cognitive Tutor Algebra I at Scale | RAND](https://www.rand.org/pubs/working_papers/WR1050.html)
44. [Efficacy of ASSISTments Online Homework Support for Middle School Mathematics Learning: A Replication Study and Analysis of Long-Term Effects – WestEd](https://www.wested.org/support/efficacy-of-assistments-online-homework-support-for-middle-school-mathematics-learning/)
45. [A meta-analysis of the effectiveness of ALEKS on learning: Educational Psychology: Vol 39 , No 10 - Get Access](https://www.tandfonline.com/doi/full/10.1080/01443410.2018.1495829)
46. [How Should Intelligent Tutoring Systems Sequence Multiple Graphical Representations of Fractions? A Multi-Methods Study - International Journal of Artificial Intelligence in Education](https://link.springer.com/article/10.1007/s40593-013-0011-7)
47. [The effects of adaptive learning in a massive open online course on learners' skill development | Proceedings of the Fifth Annual ACM Conference on Learning at Scale](https://dl.acm.org/doi/abs/10.1145/3231644.3231651)
48. [The Eighty Five Percent Rule for optimal learning | Nature Communications](https://www.nature.com/articles/s41467-019-12552-4)
49. [The Eighty Five Percent Rule for optimal learning - Princeton University](https://collaborate.princeton.edu/en/publications/the-eighty-five-percent-rule-for-optimal-learning/)
50. [Multi-Armed Bandits for Intelligent Tutoring Systems | Journal of Educational Data Mining](https://jedm.educationaldatamining.org/index.php/JEDM/article/view/JEDM111)
51. [An Efficacy Study of Interleaved Mathematics Practice | IES](https://ies.ed.gov/use-work/awards/efficacy-study-interleaved-mathematics-practice)
52. [Expertise reversal effect - Wikipedia](https://en.wikipedia.org/wiki/Expertise_reversal_effect)

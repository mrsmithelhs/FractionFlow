# Repair 03 keyboard command walkthrough

This is the separately labelled second harness trial. The first trial remains blocked as recorded in `repair03-keyboard-walkthrough.md`; this trial used the prepared CLI's own built-app server and opened the product. Input URL was supplied by `--serve-built`. No hints were used.

I reached **Place fractions on a number line** by keyboard, read the steps, and completed the first problem. The prompt showed `1/2`; the steps said 0 to 1 has 2 equal steps and offered 0/2, 1/2, and 2/2. ArrowRight from the first radio selected **Step 1 of 2 equal steps from 0**. Enter on **Check** produced “That’s right” and “1 of 2 equal steps from 0 is 1/2.” Enter on the focused **Finish** advanced to a screen showing **Next problem**. This is one completed problem, not merely accepted feedback.

Visible observations (15 product key actions; no mouse):

1. Initial menu showed five practice choices; Tab focused the first.
2. Forward Tab moved to the settings control, then the second practice choice, exposing that order in the visible focus ring.
3. Continued Tab reached **Place fractions on a number line**; Enter opened it.
4. On entry, Tab focused **Read the steps**; Enter opened the steps view.
5. Steps view visibly explained the two equal intervals and presented three labelled location radios.
6. Tab reached the first radio; ArrowRight visibly selected the middle, half-way location.
7. Tab focused active **Check**; Enter showed correct feedback and enabled **Finish**.
8. Enter on **Finish** advanced to the next-problem state with focus on **Next problem**.

Screenshots: `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/repair03-current/walkthrough-keyboard-command/screen-01.png` through `screen-16.png`; all 16 were saved. CLI close returned `closed: true`, `actions: 15`, `captures: 16`, `pageErrors: []`. The CLI process still had session id `6306` after two empty polls; parent cleanup may be needed. Requested and observed model/usage were not established in this trial. This is a visual keyboard walkthrough only; it makes no learner, screen-reader, assistive-technology, or physical-device claim.

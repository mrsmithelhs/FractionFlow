# Repair 03 browser walkthrough pilot log

Date: 2026-10-22. Owner authorized continuation of the bounded Luna pilot. This
record distinguishes parent setup checks from fresh reviewer observations. It is
not learner evidence, a portable-harness claim or Bootstrap distribution approval.

## Setup attempts in this harness

1. Parent persistent node_repl: direct ESM import of Playwright index.mjs failed
   with “requested module './index.js' does not provide an export named 'default'”.
   No browser was launched by that attempt. Using node:module createRequire and
   the installed Playwright CommonJS entry succeeded.
2. Parent launch using channel:chrome failed because that runtime searched a
   sandbox-profile Chrome location where the executable was absent. The ordinary
   command runtime could launch the installed browser. Parent located the existing
   Program Files Chrome installation and supplied executablePath explicitly. The
   persistent runtime then launched it successfully. No browser download, package
   installation, profile alteration or permissions workaround was performed.
3. Parent saved and displayed a 420×240 blank-page screenshot, then closed that
   browser. The prepared driver independently saved/displayed a blank screenshot
   and saved another after one harmless coordinate click; it closed cleanly with
   one action, two captures and no page errors. Evidence is under
   evidence/repair03-current/pilot-capability/.
4. Cold Luna-medium mouse reviewer used only the prepared driver to repeat blank
   capture/display and one coordinate click. It returned two saved images and a
   designated capability report. No product page was opened. The same browser
   handle was retained to test cross-turn persistence after the build checkpoint.

The driver uses one Playwright-owned browser for screenshots and input. It exposes
no Page object, DOM selectors, evaluation, accessibility tree or application state.
It saves screenshots with hashes and an action journal. Mouse/keyboard/touch-tap
modes and finite action/capture budgets are enforced by that interface; other
tools available to the model remain restricted by instruction, not by this wrapper.
No claim of global sandbox isolation is made.

## Current checkpoint

Both cold mouse and keyboard capability checks passed. Both saved/displayed a
third screenshot on the next turn, confirming handle persistence. However, both
openSite calls failed with net::ERR_NETWORK_ACCESS_DENIED for localhost. Both
stopped before any product action and closed their browsers. Blank-page capture
success therefore does NOT establish dev-site access in the persistent runtime.

Parent next tried the same driver through the command tool with a separate review
server; navigation timed out. A separate HTTP probe also timed out. That server
(session 93311) was stopped gracefully. The cause of this cross-process reachability
failure is not established; do not report a definite sandbox-network diagnosis.

Parent then made the command wrapper own the existing built-app static server in
the SAME process as its Playwright controller. This successfully navigated to the
entry page, saved/displayed its screenshot, performed one harmless margin click,
and saved another screenshot. No problem was attempted. Browser and server closed,
but the first wrapper left its stdin process alive; parent ended only its two test
sessions with Ctrl-C after resource closure. The wrapper now pauses/unrefs stdin
on shutdown; fresh reviewer trials will test that change. No sandbox permissions,
browser installation or profile settings were changed.

## Command-driver trials and disposition

Both labelled second trials reached the product using a self-contained server and
browser through the command tool. They reused reviewers who had seen only blank
pages in trial 1. No second model translated actions. The interface returned saved
PNG paths only; view_image displayed those files. No automatic DOM/accessibility
snapshot was emitted. Other tool access remained instruction-restricted.

- Mouse: nine product actions and ten saved/viewed screenshots, one problem
  completed through Finish/Next, no page errors. The parent explicitly required
  dragging and repositioning before Check; this is constrained observation, not
  spontaneous gesture-discovery evidence. The second drag was near three quarters
  on a line offering only 0, half and 1; the ring marked half and release retained
  half. Parent classifies that as expected nearest-offered/lower-tie behavior,
  not a reproduced drag defect. The reviewer interpreted the faint halo as an
  old marker, supporting a clearer neutral target ring before final review.
- Keyboard: fifteen product key actions and sixteen saved/viewed screenshots,
  completed through Finish/Next using Read the steps and native radio arrow keys,
  no hints or page errors. This extends the prior pilot's accepted-answer-only
  observation, but remains a visual keyboard walkthrough, not screen-reader testing.

Both wrappers reported browser closure but remained active on bounded polls. Parent
could not address the child-owned session ID in its own tool registry. Each child
was explicitly authorized to send Ctrl-C only to its own closed-browser wrapper;
both reported termination (-1073741510), touching no unrelated process. The CLI was
then changed to close browser/server resources, flush its close receipt and exit
explicitly. A fresh parent self-contained entry-page trial verified closed:true
and process exit 0. That shutdown fix was parent-tested, not retroactively claimed
as part of the earlier reviewer runs.

Blocked trial reports/directories remain intact. The support driver is parent-owned
in a disjoint tooling scope; the Luna writer alone edits product source. Requested
Luna medium settings are known; actual runtime identity, token use and cost were
not exposed. These observations establish neither learner efficacy nor physical-
device behavior, and they do not prove portability to another harness/provider.

Future work is recorded in phase-3-follow-up-obligations.md: after several useful
bounded trials, select a separately authorized plan for an independent implementer
chat that may launch walkthrough children, including other harnesses when possible.
No such chat/plan is started here. No Bootstrap note or distribution is sent now.

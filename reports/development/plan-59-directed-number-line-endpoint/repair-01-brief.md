# Plan 59 bounded mounted delivery repair

2026-11-02. Reviewed `3378224`, geometry `c92c693` and progress `772c8db`.
Parent inspected renderer/CSS, screenshots and probes. Independent Chrome at360x740
confirmed accepted benchmark-label overlap: label bottom522, feedback top513,
9px overlap for both0/1. Technical acceptance remains pending this repair.

1. Reserve actual benchmark-label height below the line before feedback/progression.
   Verify nonintersection of benchmark, line/start/end/arrow and feedback at narrow,
   Chromebook and200%text with scrolling normalized. An overflow-only assertion
   missed this collision. Add a named ordinary geometry assertion and a seed removing
   the reserve that fails it, then restores clean. Do not move the mathematical
   endpoint, change whole scale or conceal labels to pass.
2. Accepted presentation: remove the empty starting tray and redundant “Endpoint at
   ...” visual sentence. Keep equation, supplied start, accepted point/directed interval,
   concise house success and direct Next/final Back. Retain useful accessible position
   semantics. Remove spacing left solely for a spent control; no extra explanatory
   prose. Keep active line stable through tentative placement/revision.
3. Tap-only affordance: dragging is optional in the adopted scope, so no drag feature
   is requested. But the initial End item currently looks like a draggable/button tile
   in a dashed tray without either action. Make it truthful noninteractive unplaced
   status and make tapping/clicking the line discoverable through one short instruction
   or appropriate existing control affordance. Do not add a second repeated prompt,
   passive Continue or new responsibility. Keep initially null response and fixed
   supplied start distinct; no default endpoint on focus.
4. Visual keyboard position: .plan59-position has no status role or control association,
   while rerender restores focus to identically named Move buttons. Provide the current
   position as a coherent accessible description/announcement during spatial adjustment,
   without duplicate live speech when Check focuses feedback. Test actual keyboard
   actions and DOM/focus relationships; report actual AT listening as untested.

Use focused task/purity/progression tests and browser geometry/lifecycle probes;
no duplicate Terra pass or full historical matrix for task-local presentation-only
changes. Retain exact attribution of617full-suite and119historical results before
the prior accessibility repair; broaden only if this repair changes shared behavior.
Refresh representative initial/addition/subtraction/enlarged screenshots and measured
receipt, keeping old review evidence labeled historical. No math/state/replay, generic
framework, source scope expansion, owner status/acceptance, push or deploy changes.
Commit explicit scoped repairs/evidence and progress separately last; release window.

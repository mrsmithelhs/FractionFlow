# Matched exercise briefs — pending orchestration assignment

Both arms receive the same separately supplied held-out assignment: three unique valid eighths items covering one zero remainder and two different nonzero remainders, plus one deliberately below-one invalid item to diagnose and correct. Final organized whole counts must be at most 4. Do not supply operands in this document. Record start/end checkout SHA, actual author/model and available context, files opened and changed, commands and results, diagnostics, wrong guesses, correction passes, unexpected dependencies, and unavailable timing or token data. Separate authoring from setup and verification. Do not merge trial changes.

## Baseline arm

Use an isolated checkout at `42da0062310949ba79d6932e713f353d02ede759`; the assignment and this factual brief are the initial instructions. The existing records and operand validation are in `src/content/plan74-mixed-addition-task.js`. Work only in the isolated checkout; preserve the original records. Add the assigned items for the experiment, diagnose/correct the invalid item, and report how you checked every final item and membership. Existing validation may give a generic error. Return the patch and observations, not a live-bank change.

## Pilot arm

Use a separate isolated checkout pinned to the approved seam checkpoint and the same assignment. Give the author `authoring-guide.md` and this shared task brief; do not give seam-writer conversation or solutions. Create a separate trial module and use the guide's validator. Diagnose/correct the invalid item, then report the module, commands, output and observations. No edits to live membership or source are needed for the authoring portion.

Orchestration independently checks equivalent case coverage, all records, exact arithmetic and membership in both arms; it coordinates a separate isolated mounted witness and records whether the witness was feasible. One trial per arm cannot establish general ease or productivity. The seam writer must not choose or learn held-out operands before the independent assignment.

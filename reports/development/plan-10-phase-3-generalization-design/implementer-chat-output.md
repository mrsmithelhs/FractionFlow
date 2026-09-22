Viewed plan-10-phase-3-generalization-design.md:1-222
Ran command: `git status; git rev-parse --short HEAD; node scripts/dev/plan-status.js check plan-10`
Viewed 06-roadmap.md:150-250
Searched for "^#+ (1[789]|2[678])\."
Searched for "^# [0-9]+"
Searched for "§17"
Searched for "# 17."
Searched for "Phase 3"
Searched for "§27"
Viewed 06-roadmap.md:1-100
Ran command: `node -e "const fs = require('fs'); const lines = fs.readFileSync('docs/founding/06-roadmap.md', 'utf8').split('\n'); lines.forEach((l, i) => { if (/^#+\s+\d+/.test(l)) console.log(i + 1, l.trim()); });"`
Viewed 06-roadmap.md:415-465
Viewed 06-roadmap.md:600-650
Viewed 02-interaction-grammar.md:1-120
Viewed 02-interaction-grammar.md:121-240
Searched for "DECISION-006"
Viewed decision-log.md:1-100
Searched for "### DECISION-0(06|11|12|13|19|21|25|26)"
Ran command: `node -e "const fs = require('fs'); const lines = fs.readFileSync('docs/decision-log.md', 'utf8').split('\n'); lines.forEach((l, i) => { if (l.includes('DECISION-')) console.log(i + 1, l.trim()); });"`
Viewed open-questions.md:1-150
Viewed open-questions.md:151-300
Viewed open-questions.md:301-513
Searched for files: *
Searched for files: *
Viewed phase-2-unreachable-mechanisms.md:1-150
Searched for files: *
Viewed plan-14-reachable-behavior-route-contract.md:1-150
Ran command: `npm test`
Checked task Run npm test to verify current state
Ran command: `node scripts/dev/plan-status.js lint; npm run build`
Viewed advisor-capable-providers.json:1-37
Listed directory phase-2-first-slice-design
Viewed README.md:1-110
Listed directory content
Viewed family-definitions.js:1-150
Listed directory interaction
Listed directory render
Viewed classification.js:1-150
Viewed classification.js:151-286
Viewed episode.js:1-150
Viewed episode.js:151-260
Viewed episode-definition.js:1-81
Viewed fraction-bar.js:1-120
Viewed matching-choice.js:1-53
Viewed curated.js:1-70
Viewed phase1-golden-cases.js:1-100
Viewed phase1-golden-cases.js:101-182
Viewed beat-container.js:1-150
Viewed beat-container.js:300-450
Viewed beat-container.js:450-520
Ran command: `node -e "
const { validateCuratedFixtures, PHASE1_GOLDEN_CASES } = require('./src/content/curated.js');
const { createEpisode } = require('./src/interaction/episode.js');
const { createFractionBarRenderer } = require('./src/render/fraction-bar.js');

console.log('Golden cases count:', PHASE1_GOLDEN_CASES.length);
const results = validateCuratedFixtures();
results.forEach(r => {
  console.log(r.fixture.id, 'selector:', r.fixture.selector, 'valid:', r.validation.valid);
  if (r.instance) {
    try {
      const ep = createEpisode(r.instance);
      console.log('  createEpisode: SUCCESS');
    } catch (e) {
      console.log('  createEpisode:', e.name, e.code, e.message);
    }
  }
});
"`
Ran command: `node -e "
const { validateCuratedFixtures, PHASE1_GOLDEN_CASES } = require('./src/content/curated.js');
const { createEpisode } = require('./src/interaction/episode.js');
const results = validateCuratedFixtures();
const r = results.find(x => x.fixture.id === 'curated-relatively-prime-addition-non-least');
try {
  createEpisode(r.instance);
} catch (e) {
  console.log('details:', JSON.stringify(e.details, null, 2));
}
"`
Viewed interaction-episode.test.js:1-60
Ran command: `node -e "
const { validateCuratedFixtures, PHASE1_GOLDEN_CASES } = require('./src/content/curated.js');
const { createEpisode } = require('./src/interaction/episode.js');

const results = validateCuratedFixtures();
results.forEach(r => {
  console.log(r.fixture.id, 'selector:', r.fixture.selector);
  if (r.instance) {
    try {
      const ep = createEpisode({ instance: r.instance });
      console.log('  createEpisode: SUCCESS');
    } catch (e) {
      console.log('  createEpisode:', e.name, e.code, e.message);
    }
  }
});
"`
Viewed reflection-choices.js:1-55
Viewed premise-checks.js:1-46
Viewed strings.js:1-100
Viewed symbolic.js:1-100
Viewed eligibility.js:1-100
Viewed eligibility.js:100-220
Ran command: `node -e "
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body><div id=\"app\"></div></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

const { createFractionBarRenderer } = require('./src/render/fraction-bar.js');

const container = document.getElementById('app');
const renderer = createFractionBarRenderer({ side: 'left', container });

const scene = {
  contractVersion: '1',
  meaning: {
    contractVersion: '1',
    currentTask: { beat: 'encounter' },
    quantities: {
      left: {
        sourceForm: { kind: 'fraction', numerator: '10', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '10', denominator: '8' },
      },
      right: {
        sourceForm: { kind: 'fraction', numerator: '3', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '3', denominator: '8' },
      }
    },
    unitRelationship: {},
    operation: {},
  },
  presentation: { mode: 'standard-motion' }
};

try {
  renderer.render(scene);
  console.log('RENDER SUCCESS!');
} catch (err) {
  console.log('REFUSAL WITNESS (fraction-bar.js):', err.name + ':', err.message);
}
"`
Ran command: `node -e @"
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

const { createFractionBarRenderer } = require('./src/render/fraction-bar.js');

const container = document.getElementById('app');
const renderer = createFractionBarRenderer({ side: 'left', container });

const scene = {
  contractVersion: '1',
  meaning: {
    contractVersion: '1',
    currentTask: { beat: 'encounter' },
    quantities: {
      left: {
        sourceForm: { kind: 'fraction', numerator: '10', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '10', denominator: '8' },
      },
      right: {
        sourceForm: { kind: 'fraction', numerator: '3', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '3', denominator: '8' },
      }
    },
    unitRelationship: {},
    operation: {},
  },
  presentation: { mode: 'standard-motion' }
};

try {
  renderer.render(scene);
  console.log('RENDER SUCCESS!');
} catch (err) {
  console.log('REFUSAL WITNESS (fraction-bar.js):', err.name + ':', err.message);
}
"@`
Viewed mock-dom.js:1-60
Ran command: `node -e @"
const { setupMockDOM } = require('./tests/fixtures/mock-dom.js');
setupMockDOM();

const { createFractionBarRenderer } = require('./src/render/fraction-bar.js');

const container = document.createElement('div');
const renderer = createFractionBarRenderer({ side: 'left', container });

const scene = {
  contractVersion: '1',
  meaning: {
    contractVersion: '1',
    currentTask: { beat: 'encounter' },
    quantities: {
      left: {
        sourceForm: { kind: 'fraction', numerator: '10', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '10', denominator: '8' },
      },
      right: {
        sourceForm: { kind: 'fraction', numerator: '3', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '3', denominator: '8' },
      }
    },
    unitRelationship: {},
    operation: {},
  },
  presentation: { mode: 'standard-motion' }
};

try {
  renderer.render(scene);
  console.log('RENDER SUCCESS!');
} catch (err) {
  console.log('REFUSAL WITNESS (fraction-bar.js):', err.name + ': ' + err.message);
}
"@`
Ran command: `node -e @"
const { setupMockDOM } = require('./tests/fixtures/mock-dom.js');
setupMockDOM();

const { createFractionBarRenderer } = require('./src/render/fraction-bar.js');

const container = document.createElement('div');
const render = createFractionBarRenderer({ side: 'left', container });

const scene = {
  contractVersion: '1',
  meaning: {
    contractVersion: '1',
    currentTask: { beat: 'encounter' },
    quantities: {
      left: {
        sourceForm: { kind: 'fraction', numerator: '10', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '10', denominator: '8' },
      },
      right: {
        sourceForm: { kind: 'fraction', numerator: '3', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '3', denominator: '8' },
      }
    },
    unitRelationship: {},
    operation: {},
  },
  presentation: { mode: 'standard-motion' }
};

try {
  render(scene);
  console.log('RENDER SUCCESS!');
} catch (err) {
  console.log('REFUSAL WITNESS (fraction-bar.js):', err.name + ': ' + err.message);
}
"@`
Viewed fraction-bar.js:300-361
Ran command: `node -e @"
const { setupMockDOM } = require('./tests/fixtures/mock-dom.js');
setupMockDOM();

const { createFractionBarRenderer } = require('./src/render/fraction-bar.js');

const container = document.createElement('div');
const renderer = createFractionBarRenderer({ side: 'left', container });

const scene = {
  contractVersion: '1',
  meaning: {
    contractVersion: '1',
    currentTask: { beat: 'encounter' },
    quantities: {
      left: {
        sourceForm: { kind: 'fraction', numerator: '10', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '10', denominator: '8' },
      },
      right: {
        sourceForm: { kind: 'fraction', numerator: '3', denominator: '8' },
        currentForm: { kind: 'fraction', numerator: '3', denominator: '8' },
      }
    },
    unitRelationship: {},
    operation: {},
  },
  presentation: { mode: 'standard-motion' }
};

try {
  renderer.mount(scene);
  console.log('RENDER SUCCESS!');
} catch (err) {
  console.log('REFUSAL WITNESS (fraction-bar.js):', err.name + ': ' + err.message);
  console.log(err.stack);
}
"@`
Viewed render-foundation.test.js:1-60
Ran command: `node -e @"
const { setupMockDOM } = require('./tests/fixtures/mock-dom.js');
setupMockDOM();

const { createFractionBarRenderer } = require('./src/render/fraction-bar.js');
const { createEpisode, applyIntent } = require('./src/interaction/episode.js');
const { validateCuratedFixtures } = require('./src/content/index.js');
const { projectScene } = require('./src/interaction/scene.js');

const instance = validateCuratedFixtures().find(e => e.fixture.id === 'curated-relatively-prime-addition-non-least').instance;
const episode = createEpisode({ instance });
const scene = projectScene({
  state: episode,
  representationRole: 'fraction-bar',
  presentationMode: 'standard-motion',
});

// Now mutate scene.meaning.quantities.left.currentForm to 10/8:
const improperScene = JSON.parse(JSON.stringify(scene));
improperScene.meaning.quantities.left.currentForm = { kind: 'fraction', numerator: '10', denominator: '8' };

const container = document.createElement('div');
const renderer = createFractionBarRenderer({ side: 'left', container });

try {
  renderer.mount(improperScene);
  console.log('RENDER SUCCESS');
} catch (e) {
  console.log('REFUSAL WITNESS:', e.name + ': ' + e.message);
}
"@`
Ran command: `node -e @"
const { setupMockDOM } = require('./tests/fixtures/mock-dom.js');
setupMockDOM();

const { createFractionBarRenderer } = require('./src/render/fraction-bar.js');
const { createEpisode } = require('./src/interaction/episode.js');
const { validateCuratedFixtures, deepFreeze } = require('./src/content/index.js');
const { projectScene } = require('./src/interaction/scene.js');

const instance = validateCuratedFixtures().find(e => e.fixture.id === 'curated-relatively-prime-addition-non-least').instance;
const episode = createEpisode({ instance });
const scene = projectScene({
  state: episode,
  representationRole: 'fraction-bar',
  presentationMode: 'standard-motion',
});

const improperScene = JSON.parse(JSON.stringify(scene));
improperScene.meaning.quantities.left.currentForm = { kind: 'fraction', numerator: '10', denominator: '8' };
deepFreeze(improperScene);

const container = document.createElement('div');
const renderer = createFractionBarRenderer({ side: 'left', container });

try {
  renderer.mount(improperScene);
  console.log('RENDER SUCCESS');
} catch (e) {
  console.log('REFUSAL WITNESS:', e.name + ': ' + e.message);
}
"@`
Ran command: `node -e @"
const { setupMockDOM } = require('./tests/fixtures/mock-dom.js');
setupMockDOM();

const { createTrackAndReadout } = require('./src/render/fraction-bar.js');

const res = createTrackAndReadout({ numerator: 10, denominator: 8 });
console.log('segments count:', res.trackEl.children.length);
let shaded = 0;
for (const child of res.trackEl.children) {
  if (child.classList.contains('shaded')) shaded++;
}
console.log('shaded segments:', shaded);
console.log('readout text:', res.readoutEl.textContent);
"@`
Ran command: `node -e @"
const { setupMockDOM } = require('./tests/fixtures/mock-dom.js');
setupMockDOM();

const { createVisualMatchingChoice } = require('./src/render/matching-choice.js');

try {
  createVisualMatchingChoice({
    choice: {
      id: 'test',
      form: { kind: 'fraction', numerator: '10', denominator: '8' }
    },
    ariaLabel: 'test',
    onClick: () => {}
  });
} catch (e) {
  console.log('REFUSAL WITNESS (matching-choice.js):', e.name + ': ' + e.message);
}
"@`
Viewed plan-11-motion-and-animated-subdivision.md:1-35
Viewed plan-12-entry-page-and-session-shape.md:1-35
Viewed plan-13-scaffold-fading-made-real.md:1-35
Searched for files: phase-3*
Created README.md
Created grammar-reach-assessment.md
Created crossing-one-whole.md
Created mixed-numbers-position.md
Created sequencing-proposal.md
Listed directory phase-3-generalization-design
Searched for files: *plan-10*
Created progress.md
Ran command: `git status`
Ran command: `git status -u`
Edited progress.md
Ran command: `node scripts/dev/plan-status.js lint; npm run build; npm test`
Ran command: `git add docs/development/phase-3-generalization-design/README.md docs/development/phase-3-generalization-design/grammar-reach-assessment.md docs/development/phase-3-generalization-design/crossing-one-whole.md docs/development/phase-3-generalization-design/mixed-numbers-position.md docs/development/phase-3-generalization-design/sequencing-proposal.md`
Ran command: `git commit -m "docs(phase-3): author Phase 3 generalization design dossier (plan-10)"`
Ran command: `git add reports/development/plan-10-phase-3-generalization-design/progress.md`
Ran command: `git commit -m "docs(plan-10): record progress report for Phase 3 design dossier"`
Ran command: `git status`
Ran command: `node scripts/dev/plan-status.js lint`

Work for [`plan-10-phase-3-generalization-design.md`](file:///c:/AI/FractionFlow/docs/development/plan-10-phase-3-generalization-design.md) has been completed from baseline `199c104`. All deliverables are committed locally (zero pushes, explicit path staging, zero application source edits, zero edits to `docs/decision-log.md` or `docs/open-questions.md`).

---

### Deliverables Summary

The Phase 3 design dossier has been authored at [`docs/development/phase-3-generalization-design/`](file:///c:/AI/FractionFlow/docs/development/phase-3-generalization-design/) containing exactly five artifacts, accompanied by the progress report:

1. [`README.md`](file:///c:/AI/FractionFlow/docs/development/phase-3-generalization-design/README.md): Scope, review status, what the dossier settles, what it explicitly leaves open, and dossier map.
2. [`grammar-reach-assessment.md`](file:///c:/AI/FractionFlow/docs/development/phase-3-generalization-design/grammar-reach-assessment.md): Comprehensive, code-grounded audit of all eight §27 problem families and all six §28 focused episodes against running code at commit `199c104`.
3. [`crossing-one-whole.md`](file:///c:/AI/FractionFlow/docs/development/phase-3-generalization-design/crossing-one-whole.md): Architectural proposal resolving **OQ-20**, reconciling Roadmap §17's "one stable whole" with improper fractions $> 1$, with complete 360px layout budget calculations and multi-whole stacked bar specification.
4. [`mixed-numbers-position.md`](file:///c:/AI/FractionFlow/docs/development/phase-3-generalization-design/mixed-numbers-position.md): Formal recommendation with reasoning to exclude mixed numbers from Phase 3 operations (evaluating improper fraction results directly), preserving Phase 5 for full mixed-number operations while establishing visual multi-whole grounding.
5. [`sequencing-proposal.md`](file:///c:/AI/FractionFlow/docs/development/phase-3-generalization-design/sequencing-proposal.md): Phased, dependency-ordered implementation roadmap structuring Phase 3 into six bite-sized implementation packets (3.1 through 3.6) behind the four precursor packets (`plan-11`, `plan-12`, `plan-13`, `plan-14`).
6. [`progress.md`](file:///c:/AI/FractionFlow/reports/development/plan-10-phase-3-generalization-design/progress.md): Implementation progress report documenting headline counts, refusal witnesses, validation results, and advisor disposition.

---

### Headline Reach Assessment Counts

| Classification | §27 Problem Families (8 total) | §28 Focused Episodes (6 total) | Total (14 targets) |
|---|:---:|:---:|:---:|
| **Demonstrated Reuse** | 1 | 0 | 1 |
| **Plausible Reuse** | 2 | 2 | 4 |
| **Needs a New Beat** | 2 | 4 | 6 |
| **Needs a Representation the Bar Cannot Give** | 3 | 0 | 3 |

#### Target Breakdown

- **Demonstrated Reuse (1):**
  - *Relatively prime unlike denominators (§27 #6):* The canonical vertical slice. Carries a verified executable path in `plan-14` route matrix format through the entry page, 6 operational beats, and resolution.
- **Plausible Reuse (4):**
  - *Like-denominator addition (§27 #1):* Reuses encounter, notice, operate, and resolve; requires zero-renaming state machine bypass and OQ-21 copy.
  - *Shared-factor unlike denominators (§27 #5):* Reuses 7-beat arc; blocked only by selector registration and authored reflection data.
  - *Construct an equivalent fraction (§28 #1):* Reuses transform beat and subdivision bar; needs standalone 3-beat episode container.
  - *Identify a valid common denominator (§28 #2):* Reuses decide controls; needs distractor candidate generation.
- **Needs a New Beat (6):**
  - *Nested-denominator addition (§27 #3):* Current state machine forces redundant sequential 2-sided renaming for the fraction already matching the LCD. Needs asymmetric transformation bypass or determination beat.
  - *Simplification (§27 #8):* Currently 100% passive report in `resolve`; needs dedicated interactive simplify beat.
  - *Identify the least common denominator (§28 #3):* Needs two-tier classifier distinguishing valid vs least common denominator.
  - *Determine which fraction needs renaming (§28 #4):* Needs new 4-way selector beat (first, second, both, neither).
  - *Determine whether a result should exceed one (§28 #5):* Benchmark estimation Notice beat variant with ternary choice ($< 1, = 1, > 1$).
  - *Simplify an equivalent result (§28 #6):* Needs interactive learner simplification beat.
- **Needs a Representation the Bar Cannot Give (3):**
  - *Results crossing one whole (§27 #7):* Refusal witness captured directly from running code: loud `TypeError: fraction bar form is outside the supported bar range` in [`fraction-bar.js:91`](file:///c:/AI/FractionFlow/src/render/fraction-bar.js#L91) and [`matching-choice.js:14`](file:///c:/AI/FractionFlow/src/render/matching-choice.js#L14); silent collapse to identical 8/8 drawing if guard bypassed.
  - *Like-denominator subtraction (§27 #2):* Refusal witness: [`fraction-bar.js`](file:///c:/AI/FractionFlow/src/render/fraction-bar.js) renders two additive positive shaded bars with zero takeaway or comparison semantics; [`strings.js`](file:///c:/AI/FractionFlow/src/render/strings.js#L68-L73) hardcodes addition prompts.
  - *Nested-denominator subtraction (§27 #4):* Combines subtraction representation absence with asymmetric transformation lockout.

---

### Key Design Resolutions

1. **OQ-20 Resolution (Results Crossing One Whole):**
   - Recommends **Candidate 1: Discrete Multi-Whole Stack (Unit-Calibrated Separate Bars)**.
   - Preserves Roadmap §17's "one stable whole" by treating one whole as the invariant unit of measure (physical segment length never shrinks).
   - Rejects Candidate 2 (Continuous Extended Track), which at 360px would shrink unit segments by 50%, introducing the severe misconception that adding fractions shrinks unit pieces.
   - Rejection of Candidate 3 (Regrouped Whole Accumulator), which destroys visual counting of improper fractions and forces mixed numbers prematurely.
   - At 360px viewport: Collapses addend bars into summary text upon entering `operate`, keeping the two stacked result bars well within a total consumed height of $\le 320\text{px}$ ($> 320\text{px}$ margin above the 640px fold).
2. **Mixed Numbers Position:**
   - Mixed numbers remain excluded from Phase 3 operations; sums $> 1$ settle as improper fractions directly. Multi-whole bars visually ground the magnitude $> 1$, and an informational note at `resolve` calmly states `"10/8 is 1 whole and 2/8"`, priming learners for Phase 5 without testing them on it.
3. **Honest Reach Limits:**
   - Explicitly flags that the subtraction visual representation (takeaway vs difference comparison) is an empirical design question that **cannot be settled without building and observing prototypes**.
4. **Phase 2 Carried Debts:**
   - Explicitly interfaces Phase 3 with OQ-19 (entry page practice types in `plan-12`), OQ-21 (like-denominator notice copy), OQ-22 (lower-support premise check in `plan-13`), support ladder writer (`plan-13`), and animated subdivision (`plan-11`).

---

### Verification & Validation

- `node scripts/dev/plan-status.js lint`: **Passed (no violations)**.
- `npm test`: **Passed (20 test files, 244 tests passing)**.
- `npm run build`: **Passed (clean build, 323ms)**.
- Working tree: Clean for this packet's explicit paths; pre-existing untracked `reports/development/plan-14-reachable-behavior-route-contract/mechanism-proposal.md` left untouched per commit discipline.
- Advisor consultation: Declared **Branch C (Orchestrator-gate-only degraded mode)** per `AGENTS.md` Step 1 fail-closed rule (thread provider does not match entries in `advisor-capable-providers.json`); proportionality noted as docs-only proposal.

Ready for orchestrator review and owner disposition.
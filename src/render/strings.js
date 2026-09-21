/**
 * Centralized Learner-Facing Strings Catalog (DECISION-017, DECISION-023)
 *
 * All learner-facing copy lives here. No inline literals in render components.
 * Target reading level: approximately Grade 2–3 (DECISION-004).
 * Working rules (Presentation Posture Part 2):
 * - One idea per string; a required-response prompt runs to about 12 words.
 * - Active voice, present tense, second person ("you").
 * - Concrete words ("bar", "parts", "amount") over abstract jargon.
 * - Exempt mathematical terms introduced with meaning: numerator, denominator,
 *   common denominator, equivalent, whole.
 * - Zero specification or research apparatus jargon.
 * - CM-01 connection-making check instantiated as matching with distractors (DECISION-012)
 *   and includes check-the-premise cases where the expected/reassuring answer is NOT the
 *   correct one (DECISION-026).
 * - Avoid awkward "${den}ths" screen-reader voicing; use natural phrasing.
 */

export const STRINGS = Object.freeze({
  encounter: Object.freeze({
    prompt: 'Look at these two fractions.',
    barAriaLabel: (side, num, den) => (
      `${side === 'left' ? 'First' : 'Second'} fraction bar: ${num} of ${den} equal parts shaded in 1 whole.`
    ),
  }),

  notice: Object.freeze({
    prompt: 'Do these two fractions have the same size parts?',
    options: Object.freeze({
      same: 'Yes, same size',
      different: 'No, different sizes',
    }),
    feedbackDiff: 'The parts are different sizes. We need a common unit.',
    feedbackSame: (leftDen, rightDen) => (
      `Look at the parts: one bar has ${leftDen} equal parts and one has ${rightDen} equal parts.`
    ),
  }),

  decide: Object.freeze({
    prompt: 'Choose a common denominator for both fractions.',
    optionAriaLabel: (den) => `Common denominator ${den}`,
    invalidDenominator: (den) => (
      `${den} is not a common denominator. Try another number.`
    ),
    validNonLeast: (den) => (
      `Common denominator: ${den} — both fractions can use it.`
    ),
    validLeast: (den) => (
      `Common denominator: ${den} — the smallest one.`
    ),
  }),

  transform: Object.freeze({
    prompt: (side, den) => (
      `Rename the ${side === 'left' ? 'first' : 'second'} fraction with ${den} equal parts.`
    ),
    scaleFactorPrompt: (mult) => (
      `Multiply the top and bottom by ${mult}.`
    ),
    // Minor note: Natural phrasing for grade 2–3 and clean screen-reader voicing.
    equivalentNumeratorPrompt: (den) => (
      `How many of the ${den} equal parts are shaded?`
    ),
    errorNumerator: 'Count the shaded parts in the new bar and try again.',
    errorScaleFactor: 'Multiply the top and bottom by the same number.',
  }),

  operate: Object.freeze({
    prompt: 'Add the shaded parts together.',
    // Minor note: Natural phrasing for grade 2–3.
    inputLabel: (den) => `Total shaded parts out of ${den}:`,
    errorArithmetic: 'The denominator stays the same. Add only the top numbers.',
  }),

  resolve: Object.freeze({
    prompt: 'Here is your final answer.',
    summary: (num, den) => `The answer is ${num}/${den}.`,
    unsimplifiedNotice: (raw, simp) => (
      `${raw} is correct! It can also be written as ${simp}.`
    ),
    continueButton: 'Next Problem',
    continueReflectionButton: 'Continue',
    complete: 'You finished this problem.',
  }),

  // Condition B: Satisfies DECISION-012 (visual matching with distractors)
  // AND DECISION-026 (check-the-premise cases where the reassuring answer is not correct).
  reflect: Object.freeze({
    // DECISION-012: Visual matching with distractors
    matchingPrompt: (targetFraction) => (
      `Tap the bar that shows the same amount as ${targetFraction}.`
    ),
    matchingOptionLabel: (num, den) => (
      `Bar with ${num} of ${den} equal parts shaded`
    ),
    matchingCorrect: 'That is the same amount! The parts changed size, but the shaded amount stayed the same.',
    matchingDistractor: 'This bar has a different shaded amount. Look closely at the shaded length.',
    matchingDistractorLinear: 'This fraction shows a different amount. Look closely at its parts.',
    invalidChoice: 'Choose one of the options shown.',
    invalidChoiceLinear: 'Choose one of the fractions shown.',

    // DECISION-026: Check-the-premise form (answer is not always the reassuring one)
    premiseFraming: 'Check this renaming:',
    premiseTopBarLabel: (num, den) => `Starting fraction: ${num}/${den}`,
    premiseBottomBarLabel: (num, den) => `New parts: ${num}/${den}`,
    premisePrompt: 'Does this new bar show the same amount as before?',
    premiseOptions: Object.freeze({
      yes: 'Yes, it is the same amount',
      no: 'No, the amount changed',
    }),
    premiseExpectedNo: 'Good eye! The amount changed, so these fractions are not equivalent.',
    premiseFalseYesNotice: 'Look closely: the shaded length became longer. It is not the same amount.',
    premiseFalseNoNotice: 'Look closely: the shaded length is the same. It is the same amount.',
    premiseExpectedYes: 'Correct! The parts are smaller, but the total shaded amount is the same.',

    // Accessible linear path phrasing (DECISION-004, Condition 6)
    premiseFramingLinear: (presented, source) => (
      `Check this fraction: ${presented}. Does this fraction show the same amount as ${source}?`
    ),
    matchingPromptLinear: (targetFraction) => (
      `Choose the fraction that shows the same amount as ${targetFraction}.`
    ),
    matchingOptionLabelLinear: (num, den) => (
      `Fraction ${num}/${den} shows a shaded amount`
    ),
    premisePromptLinear: 'Does this new fraction show the same amount as before?',
  }),

  controls: Object.freeze({
    check: 'Check',
    help: 'Need help?',
    tryAgain: 'Try Again',
    next: 'Next',
  }),

  status: Object.freeze({
    stepIncorrect: 'Not quite.',
  }),

  transition: Object.freeze({
    beforeLabel: (num, den) => `Before: ${num}/${den}`,
    afterLabel: (num, den) => `After: ${num}/${den}`,
    step1Label: (num, den) => `Step 1: Start with ${num}/${den}`,
    step2Label: (num, den) => `Step 2: New parts ${num}/${den}`,
    stepConnector: (den) => `Split into ${den} parts`,
    beforeAria: (side, num, den) => (
      `${side === 'left' ? 'First' : 'Second'} fraction before: ${num} of ${den} equal parts in 1 whole.`
    ),
    afterAria: (side, num, den) => (
      `${side === 'left' ? 'First' : 'Second'} fraction after: ${num} of ${den} equal parts in 1 whole.`
    ),
    step1Aria: (side, num, den) => (
      `${side === 'left' ? 'First' : 'Second'} fraction step 1: start with ${num} of ${den} equal parts in 1 whole.`
    ),
    step2Aria: (side, num, den) => (
      `${side === 'left' ? 'First' : 'Second'} fraction step 2: split into ${num} of ${den} equal parts in 1 whole.`
    ),
    linearJuxtaposed: (side, preNum, preDen, postNum, postDen) => (
      `${side === 'left' ? 'First' : 'Second'} fraction: started as ${preNum} of ${preDen} equal parts, now renamed to ${postNum} of ${postDen} equal parts in 1 whole.`
    ),
    linearSequential: (side, preNum, preDen, postNum, postDen) => (
      `${side === 'left' ? 'First' : 'Second'} fraction: Step 1 was ${preNum} of ${preDen} equal parts. Step 2 is ${postNum} of ${postDen} equal parts in 1 whole.`
    ),
  }),

  summaryLines: Object.freeze({
    encounterDone: 'Problem established.',
    noticeDone: 'Units do not match.',
    decideDone: (den, mathClassification) => {
      if (mathClassification === 'valid-least') {
        return STRINGS.decide.validLeast(den);
      }
      if (mathClassification === 'valid-non-least') {
        return STRINGS.decide.validNonLeast(den);
      }
      return `Common denominator: ${den}`;
    },
    transformDone: (side, initial, converted) => (
      `${side === 'left' ? 'First' : 'Second'} fraction: ${initial} = ${converted}`
    ),
    operateDone: (sum) => `Sum: ${sum}`,
    resolveDone: (result) => `Result: ${result}`,
    reflectDone: 'Equivalence verified.',
    summaryDisclosureLabel: (count) => `Show previous steps (${count} completed)`,
  }),

  app: Object.freeze({
    title: 'FractionFlow',
    subtitle: 'Make the parts match.',
    introduction: 'Add two fractions by making same-size parts.',
    displayChoicesButton: 'Open display choices',
    displayChoicesHeading: 'Display and check options',
    closeDisplayChoices: 'Close display choices',
    displayStyles: Object.freeze({
      // Interim copy, owner decision 2026-09-20. This bundle is D-01-A / D-02-M — animated
      // subdivision morphing in place — and the animation does not exist: render.css has no
      // keyframes, and fraction-bar.js rebuilds every segment on each render, so nothing can
      // transition across a denominator change. The former "Smooth change / The bars change
      // smoothly after you choose" described behavior the code does not perform. This copy says
      // what the bundle actually does. Restore the original wording when plan-10 implements the
      // animation; the internal key stays `smooth` because the bundle's intent is unchanged.
      smooth: Object.freeze({
        label: 'New parts only',
        description: 'The bar shows the new parts right away.',
      }),
      compare: Object.freeze({
        label: 'Compare before and after',
        description: 'See the old and new bars together.',
      }),
      steps: Object.freeze({
        label: 'Step-by-step change',
        description: 'See one clear change at a time.',
      }),
      // Held for the unregistered CM-01-P condition (owner decision 2026-09-20). Intentionally
      // unused, not accidentally dead: see the note in src/app/conditions.js. "Check the premise"
      // is also specification register and should be rewritten to DECISION-004 before it ships.
      premise: Object.freeze({
        label: 'Check the premise',
        description: 'Ask whether the new parts really match the starting fraction.',
      }),
    }),
    activeDisplay: (label) => `Display: ${label}`,
    selectedDisplay: 'Selected',
    showPicture: 'Show the picture',
    readSteps: 'Read the steps',
    visualViewLabel: 'Picture and symbols',
    linearViewLabel: 'Step-by-step reading view',
    helpButton: 'Need help?',
    replayButton: 'Replay the last change',
    helpLevels: Object.freeze({
      orient: 'Look at the parts in each bar. What do you notice?',
      represent: 'Think about one whole and the size of each part.',
      constrain: 'Choose a number that both bottom numbers can make.',
      demonstrate: 'Watch this step, then try the next one yourself.',
    }),
    replayNote: 'Take another look at the current bars and symbols.',
    displayChanged: (label) => `Now showing ${label}.`,
    problemRestarted: 'The same problem is ready again.',
    restartButton: 'Try this problem again',
    noReplayYet: 'Finish a change before replaying it.',
    tryAgain: 'Let us try that step again.',
  }),
});

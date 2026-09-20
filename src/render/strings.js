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
      `${side === 'left' ? 'First' : 'Second'} fraction bar: ${num} of ${den} equal parts shaded.`
    ),
    wholeLabel: '1 whole',
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
      `${den} works! Both fractions can use this denominator.`
    ),
    // Condition A: Parameterized by den, never hardcoding the canonical instance.
    validLeast: (den) => (
      `${den} works! That is the smallest common denominator.`
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
    errorScaleFactor: 'Check the number you multiply by to make the new denominator.',
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

    // DECISION-026: Check-the-premise form (answer is not always the reassuring one)
    premisePrompt: 'Does this new bar show the same amount as before?',
    premiseOptions: Object.freeze({
      yes: 'Yes, it is the same amount',
      no: 'No, the amount changed',
    }),
    premiseExpectedNo: 'Good eye! The amount changed, so these fractions are not equivalent.',
    premiseFalseYesNotice: 'Look closely: the shaded length became longer. It is not the same amount.',
    premiseExpectedYes: 'Correct! The parts are smaller, but the total shaded amount is the same.',

    // DECISION-026: "None of these" distractor option for matching
    noneOfTheseOption: 'None of these bars show the same amount',
    noneOfTheseCorrect: 'Correct! None of those bars show the same shaded amount.',
  }),

  controls: Object.freeze({
    check: 'Check',
    help: 'Need help?',
    tryAgain: 'Try Again',
    next: 'Next',
  }),

  status: Object.freeze({
    transitionComplete: (side, den) => (
      `The ${side === 'left' ? 'first' : 'second'} bar is now divided into ${den} parts.`
    ),
    stepCorrect: 'Correct.',
    stepIncorrect: 'Not quite.',
  }),

  summaryLines: Object.freeze({
    noticeDone: 'Units do not match.',
    decideDone: (den) => `Common denominator: ${den}`,
    transformDone: (side, initial, converted) => (
      `${side === 'left' ? 'First' : 'Second'} fraction: ${initial} = ${converted}`
    ),
    operateDone: (sum) => `Sum: ${sum}`,
    resolveDone: (result) => `Result: ${result}`,
    reflectDone: 'Equivalence verified.',
  }),
});

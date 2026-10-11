import { equalFractions } from '../math/fraction.js';
import { wireToForm } from './schema.js';
import { evaluateInstanceEligibility, evaluateProposedPathEligibility } from './eligibility.js';
import { premiseCheckForInstance } from './data/premise-checks.js';
import { reflectionChoicesForInstance } from './data/reflection-choices.js';

function sameFraction(left, right) {
  return equalFractions(wireToForm(left), wireToForm(right));
}

function requireValid(condition, message) {
  if (!condition) throw new TypeError(message);
}

export function validateAuthoredPremiseCase(instance, premise, targetDenominator) {
  requireValid(premise, `missing premise data for denominator ${targetDenominator}`);
  requireValid(premise.fixtureId === instance.provenance.fixtureId
    && premise.targetDenominator === targetDenominator,
  `premise identity mismatch for denominator ${targetDenominator}`);
  requireValid(sameFraction(premise.sourceForm, instance.operands.left.initialForm),
    `premise source mismatch for denominator ${targetDenominator}`);
  validateSupportedForm(premise.presentedForm, targetDenominator,
    `premise form is outside the supported presentation range for ${targetDenominator}`);
  const actuallyEquivalent = sameFraction(premise.sourceForm, premise.presentedForm);
  const expectedResponse = actuallyEquivalent ? 'yes' : 'no';
  requireValid(premise.isEquivalent === actuallyEquivalent
    && premise.expectedResponse === expectedResponse,
  `premise truth mismatch for denominator ${targetDenominator}`);
  return expectedResponse;
}

function validateSupportedForm(form, targetDenominator, message) {
  const numerator = Number(form?.numerator);
  const denominator = Number(form?.denominator);
  requireValid(form?.kind === 'fraction'
    && typeof form.numerator === 'string'
    && typeof form.denominator === 'string'
    && Number.isSafeInteger(numerator)
    && Number.isSafeInteger(denominator)
    && denominator === Number(targetDenominator)
    && numerator >= 0
    && numerator <= denominator,
  message);
}

export function validateAuthoredMatchingChoices(sourceForm, choices, targetDenominator) {
  requireValid(Array.isArray(choices) && choices.length >= 3,
    `matching choices require at least three options for denominator ${targetDenominator}`);
  const choiceIds = new Set();
  let equivalentChoices = 0;
  for (const choice of choices) {
    requireValid(typeof choice.id === 'string' && choice.id.length > 0
      && !choiceIds.has(choice.id),
    `matching choice identity is invalid for denominator ${targetDenominator}`);
    choiceIds.add(choice.id);
    requireValid(choice.form?.kind === 'fraction'
      && choice.form.denominator === targetDenominator,
    `matching choice form is invalid for denominator ${targetDenominator}`);
    const numerator = Number(choice.form.numerator);
    const denominator = Number(choice.form.denominator);
    requireValid(Number.isSafeInteger(numerator)
      && Number.isSafeInteger(denominator)
      && numerator >= 0
      && denominator > 0
      && numerator <= denominator,
    `matching choice form is outside the supported presentation range for ${targetDenominator}`);
    if (sameFraction(choice.form, sourceForm)) equivalentChoices += 1;
    for (const previous of choices.slice(0, choices.indexOf(choice))) {
      requireValid(!sameFraction(previous.form, choice.form),
        `matching choices contain duplicate mathematical forms for denominator ${targetDenominator}`);
    }
  }
  requireValid(equivalentChoices === 1,
    `matching choices must contain exactly one equivalent form for ${targetDenominator}`);
  return true;
}

/** Validate one complete, eligible route before it is offered or mounted. */
export function validateAuthoredPathTaskData(instance, targetDenominator) {
  const path = evaluateProposedPathEligibility(instance, targetDenominator);
  requireValid(path.mathematicalValidity === 'valid'
    && path.rendering === 'eligible'
    && path.authoredCoverage !== 'outside-authored-coverage',
  `path is outside the authored presentation capability for ${targetDenominator}`);
  const premise = premiseCheckForInstance(instance, targetDenominator);
  validateAuthoredPremiseCase(instance, premise, targetDenominator);
  const choices = reflectionChoicesForInstance(instance, targetDenominator);
  validateAuthoredMatchingChoices(instance.operands.left.initialForm, choices, targetDenominator);
  return true;
}

/**
 * Validate the fully-authored premise and matching tasks for every admitted
 * denominator path. This is an authoring/admission check, not scene logic.
 */
export function validateAuthoredTaskData(instance, expectedDenominators) {
  requireValid(Array.isArray(expectedDenominators) && expectedDenominators.length > 0,
    'authored task denominators must be a non-empty list');

  const eligibility = evaluateInstanceEligibility(instance);
  const eligiblePaths = [eligibility.paths.canonical, ...eligibility.paths.alternates]
    .filter((path) => path.rendering === 'eligible')
    .map((path) => path.targetDenominator);
  requireValid(
    JSON.stringify([...eligiblePaths].sort((a, b) => Number(a) - Number(b)))
      === JSON.stringify([...expectedDenominators].sort((a, b) => Number(a) - Number(b))),
    `eligible path identity mismatch for ${instance?.provenance?.fixtureId}`,
  );

  const sourceForm = instance.operands.left.initialForm;
  const premiseAnswers = new Set();
  for (const targetDenominator of expectedDenominators) {
    const premise = premiseCheckForInstance(instance, targetDenominator);
    premiseAnswers.add(validateAuthoredPremiseCase(instance, premise, targetDenominator));
    validateAuthoredMatchingChoices(
      sourceForm,
      reflectionChoicesForInstance(instance, targetDenominator),
      targetDenominator,
    );
  }

  requireValid(premiseAnswers.has('yes') && premiseAnswers.has('no'),
    'authored premise paths must include both yes and no outcomes');
  return true;
}

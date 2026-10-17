import { buildCuratedProblem, validateCuratedFixtures } from '../../../src/content/index.js';
import { evaluateProposedPathEligibility } from '../../../src/content/eligibility.js';
import { computeBeatSchedule } from '../../../src/interaction/beat-schedule.js';
import { PHASE2_REFLECTION_EPISODE_DEFINITION } from '../../../src/interaction/episode-definition.js';
import { createEpisode } from '../../../src/interaction/episode.js';
import { HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from '../../../src/interaction/support.js';
import { createFraction, convertToDenominator, validateCommonDenominator } from '../../../src/math/index.js';

const fixture = validateCuratedFixtures().find(({ fixture }) => fixture.id === 'curated-nested-addition').fixture;
const forms = { left: fixture.left, right: fixture.right };
const instance = buildCuratedProblem({ fixture, selector: fixture.selector, overlays: fixture.overlays, profileId: fixture.profileId,
  candidate: { left: forms.left, right: forms.right, reviewedTransitions: fixture.reviewedTransitions ?? [] } });
const mirroredFixture = { ...fixture, id: `${fixture.id}-mirrored`, left: forms.right, right: forms.left };
const mirrored = buildCuratedProblem({ fixture: mirroredFixture, selector: mirroredFixture.selector, overlays: mirroredFixture.overlays,
  profileId: mirroredFixture.profileId, candidate: { left: mirroredFixture.left, right: mirroredFixture.right,
    reviewedTransitions: mirroredFixture.reviewedTransitions ?? [] } });
console.log(JSON.stringify({
  operandOrders: [instance, mirrored].map((current) => {
    const orderInputs = Object.fromEntries(['left', 'right'].map((side) => {
      const form = current.operands[side].initialForm;
      return [side, createFraction(BigInt(form.numerator), BigInt(form.denominator))];
    }));
    return {
      fixtureId: current.provenance.fixtureId,
      authoringRevision: current.provenance.authoringRevision,
      forms: { left: current.operands.left.initialForm, right: current.operands.right.initialForm },
      relationship: current.classification.denominator.relationship,
      canonicalRenaming: current.classification.transformations.canonicalRenaming,
      currentLegacySchedule: computeBeatSchedule(current, PHASE2_REFLECTION_EPISODE_DEFINITION),
      currentAdmissionAttempts: [HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION].map((support) => {
        try {
          createEpisode({ instance: current, episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION, support });
          return { support: support.label, result: 'admitted unexpectedly' };
        } catch (error) {
          return { support: support.label, result: 'refused', code: error.code, message: error.message };
        }
      }),
      targets: ['8', '16', '24'].map((target) => ({
        target,
        commonDenominator: validateCommonDenominator(BigInt(target), orderInputs.left, orderInputs.right),
        converted: Object.fromEntries(Object.entries(orderInputs).map(([side, fraction]) => {
          const value = convertToDenominator(fraction, BigInt(target));
          return [side, { numerator: value.numerator.toString(), denominator: value.denominator.toString() }];
        })),
        eligibility: evaluateProposedPathEligibility(current, BigInt(target)),
      })),
    };
  }),
}, (_key, value) => typeof value === 'bigint' ? value.toString() : value, 2));

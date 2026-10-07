import { describe, expect, it } from 'vitest';
import { buildCuratedProblem } from '../src/content/generator.js';
import { PHASE1_GOLDEN_CASES } from '../src/content/data/phase1-golden-cases.js';
import { getRegisteredCondition } from '../src/app/conditions.js';
import {
  PHASE2_EPISODE_DEFINITION,
  PHASE2_REFLECTION_EPISODE_DEFINITION,
} from '../src/interaction/episode-definition.js';
import { evaluateTaskPathClosure } from '../src/interaction/path-closure.js';

function fixtureInstance(fixtureId) {
  const fixture = PHASE1_GOLDEN_CASES.find((entry) => entry.id === fixtureId);
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: {
      left: fixture.left,
      right: fixture.right,
      reviewedTransitions: fixture.reviewedTransitions ?? [],
    },
  });
}

function check(instance, targetDenominator, definition, conditionId) {
  return evaluateTaskPathClosure({
    instance,
    targetDenominator,
    episodeDefinition: definition,
    activeCondition: getRegisteredCondition(conditionId).activeCondition,
  });
}

describe('registered denominator task-path closure', () => {
  const canonical = () => fixtureInstance('curated-relatively-prime-addition-non-least');

  it('accepts the complete canonical and alternate matching and premise paths', () => {
    for (const targetDenominator of ['12', '24']) {
      for (const conditionId of ['phase2-bundle-1', 'phase2-bundle-4']) {
        expect(check(
          canonical(),
          targetDenominator,
          PHASE2_REFLECTION_EPISODE_DEFINITION,
          conditionId,
        )).toMatchObject({
          available: true,
          reason: null,
          path: { mathematicalValidity: 'valid', rendering: 'eligible' },
          reflection: { applicable: true, available: true },
        });
      }
    }
  });

  it('rejects 36 as valid math that is outside both reviewed coverage and bar capability', () => {
    const result = check(
      canonical(),
      '36',
      PHASE2_REFLECTION_EPISODE_DEFINITION,
      'phase2-bundle-1',
    );
    expect(result).toMatchObject({
      available: false,
      reason: 'outside-representation-capability',
      path: {
        mathematicalValidity: 'valid',
        mathClassification: 'valid-non-least',
        rendering: 'ineligible',
        authoredCoverage: 'outside-authored-coverage',
      },
      reflection: { applicable: true, available: false },
    });
  });

  it('rejects an eligible but unauthored nested denominator without admitting the family', () => {
    const result = check(
      fixtureInstance('curated-nested-addition'),
      '24',
      PHASE2_REFLECTION_EPISODE_DEFINITION,
      'phase2-bundle-1',
    );
    expect(result).toMatchObject({
      available: false,
      reason: 'outside-authored-coverage',
      path: {
        mathematicalValidity: 'valid',
        rendering: 'eligible',
        authoredCoverage: 'outside-authored-coverage',
      },
    });
  });

  it('fails closed when the selected condition has no reflection data for an otherwise authored path', () => {
    const authoredPathMissingReflection = {
      ...canonical(),
      provenance: { ...canonical().provenance, fixtureId: 'missing-reflection-fixture' },
    };
    for (const conditionId of ['phase2-bundle-1', 'phase2-bundle-4']) {
      expect(check(
        authoredPathMissingReflection,
        '12',
        PHASE2_REFLECTION_EPISODE_DEFINITION,
        conditionId,
      )).toMatchObject({
        available: false,
        reason: 'missing-condition-reflection-data',
        path: { mathematicalValidity: 'valid', rendering: 'eligible', authoredCoverage: 'canonical' },
        reflection: { applicable: true, available: false },
      });
    }
  });

  it('does not require reflection data when the registered definition has no reflection beat', () => {
    const result = evaluateTaskPathClosure({
      instance: canonical(),
      targetDenominator: '12',
      episodeDefinition: PHASE2_EPISODE_DEFINITION,
      activeCondition: { connectionMaking: 'unregistered-for-this-definition' },
    });
    expect(result).toMatchObject({
      available: true,
      reason: null,
      reflection: {
        applicable: false,
        connectionMaking: 'unregistered-for-this-definition',
        available: true,
      },
    });
  });
});

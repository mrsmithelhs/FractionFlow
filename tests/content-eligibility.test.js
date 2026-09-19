import { describe, expect, it } from 'vitest';
import {
  buildCuratedProblem,
  evaluateInstanceEligibility,
  evaluateProposedPathEligibility,
  PHASE1_GOLDEN_CASES,
  validateCuratedFixtures,
} from '../src/content/index.js';

function whole(value) {
  return { kind: 'fraction', numerator: String(value), denominator: '1' };
}

function canonicalInstance() {
  return validateCuratedFixtures().find((entry) => (
    entry.fixture.id === 'curated-relatively-prime-addition-non-least'
  )).instance;
}

describe('Plan 05 representation eligibility', () => {
  it('records eligible canonical and authored alternate paths without deferred verdicts', () => {
    const instance = canonicalInstance();
    const eligibility = evaluateInstanceEligibility(instance);
    expect(instance.representationFacts.eligibility).toEqual({
      fractionBar: 'eligible',
      numberLine: 'not-in-phase-2',
      symbolic: 'eligible',
    });
    expect(eligibility.paths.canonical).toMatchObject({
      rendering: 'eligible',
      targetDenominator: '12',
    });
    expect(eligibility.paths.alternates[0]).toMatchObject({
      rendering: 'eligible',
      targetDenominator: '24',
    });
    expect(JSON.stringify(eligibility)).not.toContain('deferred');
  });

  it('keeps a valid non-enumerated denominator valid while refusing the path for rendering', () => {
    const instance = canonicalInstance();
    const proposed = evaluateProposedPathEligibility(instance, whole(36));
    expect(proposed).toMatchObject({
      mathematicalValidity: 'valid',
      mathClassification: 'valid-non-least',
      rendering: 'ineligible',
      authoredCoverage: 'outside-authored-coverage',
      continuation: 'symbolic',
    });
    expect(proposed.reasons).toContain('denominator-ceiling-exceeded');
  });

  it('distinguishes valid outside-authored coverage from representation ineligibility', () => {
    const fixture = {
      id: 'plan05-outside-authored-coverage',
      authoringRevision: 'plan05-test-v1',
      profileId: 'curated-review',
      selector: 'relatively-prime-addition',
      overlays: [],
      left: { kind: 'fraction', numerator: '1', denominator: '2' },
      right: { kind: 'fraction', numerator: '1', denominator: '3' },
    };
    const instance = buildCuratedProblem({
      fixture,
      selector: fixture.selector,
      overlays: fixture.overlays,
      profileId: fixture.profileId,
      candidate: { left: fixture.left, right: fixture.right },
    });
    const proposed = evaluateProposedPathEligibility(instance, whole(18));
    expect(proposed).toMatchObject({
      mathematicalValidity: 'valid',
      rendering: 'eligible',
      authoredCoverage: 'outside-authored-coverage',
      continuation: 'episode-definition',
    });
  });

  it('applies the scale-factor ceiling independently of the denominator ceiling', () => {
    const fixture = {
      id: 'plan05-scale-factor-boundary',
      authoringRevision: 'plan05-test-v1',
      profileId: 'curated-review',
      selector: 'relatively-prime-addition',
      overlays: [],
      left: { kind: 'fraction', numerator: '1', denominator: '2' },
      right: { kind: 'fraction', numerator: '1', denominator: '3' },
    };
    const instance = buildCuratedProblem({
      fixture,
      selector: fixture.selector,
      overlays: fixture.overlays,
      profileId: fixture.profileId,
      candidate: { left: fixture.left, right: fixture.right },
    });
    const proposed = evaluateProposedPathEligibility(instance, whole(30));
    expect(proposed.mathematicalValidity).toBe('valid');
    expect(proposed.targetDenominator).toBe('30');
    expect(proposed.rendering).toBe('ineligible');
    expect(proposed.reasons).toContain('left-scale-factor-ceiling-exceeded');
    expect(proposed.reasons).not.toContain('denominator-ceiling-exceeded');
  });

  it('reports an ineligible base fraction-bar instance before episode construction', () => {
    const fixture = {
      id: 'plan05-ineligible-base',
      authoringRevision: 'plan05-test-v1',
      profileId: 'curated-review',
      selector: 'relatively-prime-addition',
      overlays: [],
      left: { kind: 'fraction', numerator: '1', denominator: '7' },
      right: { kind: 'fraction', numerator: '1', denominator: '12' },
    };
    const instance = buildCuratedProblem({
      fixture,
      selector: fixture.selector,
      overlays: fixture.overlays,
      profileId: fixture.profileId,
      candidate: { left: fixture.left, right: fixture.right },
    });
    const eligibility = evaluateInstanceEligibility(instance);
    expect(eligibility.paths.canonical.targetDenominator).toBe('84');
    expect(eligibility.paths.canonical.rendering).toBe('ineligible');
    expect(instance.representationFacts.eligibility.fractionBar).toBe('ineligible');
    expect(PHASE1_GOLDEN_CASES.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BULK_REQUESTS,
  renderBulkValidationMarkdown,
  runBulkValidation,
} from '../src/content/index.js';

describe('Plan 03 bulk validation reporting', () => {
  it('distinguishes sampled draws, unique instances, duplicates, and finite coverage', () => {
    const report = runBulkValidation({
      sampleSize: 40,
      requests: [
        { selector: 'like-denominator-addition', overlays: [] },
        { selector: 'like-denominator-addition', overlays: ['crosses-one-whole'] },
      ],
      baseSeed: 'bulk-test-v1',
    });
    expect(report.overall.pass).toBe(true);
    expect(report.run.command).toContain('bulk-test-v1');
    expect(report.run.command).toContain('sampleSize');
    for (const selector of report.selectors) {
      expect(selector.requestedSampledDraws).toBe(40);
      expect(selector.sampledAcceptedDraws).toBe(40);
      expect(selector.candidateSpace.finiteSpaceEnumerated).toBe(true);
      expect(selector.candidateSpace.eligibleCandidateSpaceCardinality).toBeGreaterThan(0);
      expect(selector.uniqueMathematicalInstances).toBeLessThanOrEqual(selector.sampledAcceptedDraws);
      expect(selector.duplicateAcceptedDraws).toBe(
        selector.sampledAcceptedDraws - selector.uniqueMathematicalInstances,
      );
      expect(selector.finiteSpaceCoverage.denominatorEligibleCandidateSpace).toBe(
        selector.candidateSpace.eligibleCandidateSpaceCardinality,
      );
      expect(selector.distributions.scaleFactorLeft).toMatchObject({
        n: selector.sampledAcceptedDraws,
        percentileMethod: 'nearest-rank',
      });
    }
    const markdown = renderBulkValidationMarkdown(report);
    expect(markdown).toContain('Unique mathematical instances');
    expect(markdown).toContain('Duplicate accepted draws');
    expect(markdown).toContain('Finite-space coverage');
    expect(markdown).toContain('P50');
    expect(markdown).toContain('P99');
  });

  it('enumerates every declared overlay set and surfaces profile-unsatisfiable sets', () => {
    const report = runBulkValidation({ sampleSize: 4 });
    expect(report.selectors).toHaveLength(DEFAULT_BULK_REQUESTS.length);
    expect(report.selectors.every((selector) => selector.status === 'validated'
      || selector.status === 'unsatisfiable-for-profile')).toBe(true);
    const unsatisfiable = report.selectors.find((selector) => (
      selector.selector === 'relatively-prime-addition'
      && selector.overlays.join(',') === 'reducible-result'
    ));
    expect(unsatisfiable.status).toBe('unsatisfiable-for-profile');
    expect(unsatisfiable.candidateSpace.eligibleCandidateSpaceCardinality).toBe(0);
    expect(report.overall.warnings).toContain(
      'relatively-prime-addition+reducible-result:no-eligible-candidates-for-profile',
    );
  });
});

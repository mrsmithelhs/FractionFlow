import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCuratedFixtures } from './curated.js';
import { FAMILY_DEFINITIONS, STRUCTURAL_SELECTOR_IDS } from './family-definitions.js';
import { generateProblem, inspectCandidateSpace } from './generator.js';
import { getProfile } from './profiles.js';
import { BULK_REPORT_VERSION, mathematicalInstanceKey } from './schema.js';
import { deriveBatchSeed } from './seed.js';
import { validateProblemInstance } from './validation.js';

export const DEFAULT_BULK_REQUESTS = Object.freeze(
  STRUCTURAL_SELECTOR_IDS.flatMap((selector) => (
    FAMILY_DEFINITIONS[selector].allowedOverlaySets.map((overlays) => ({
      selector,
      overlays: [...overlays],
    }))
  )),
);

function percent(numerator, denominator) {
  return denominator === 0 ? null : Number(((numerator * 100) / denominator).toFixed(4));
}

function histogram(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const n = values.length;
  return {
    n,
    entries: [...counts.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([value, count]) => ({
      value,
      count,
      percentOfN: percent(count, n),
    })),
  };
}

function numericSummary(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const n = sorted.length;
  if (n === 0) {
    return { n: 0, min: null, p50: null, p90: null, p95: null, p99: null, max: null, percentileMethod: 'nearest-rank' };
  }
  const nearestRank = (percentile) => sorted[Math.max(0, Math.ceil((percentile / 100) * n) - 1)];
  return {
    n,
    min: sorted[0],
    p50: nearestRank(50),
    p90: nearestRank(90),
    p95: nearestRank(95),
    p99: nearestRank(99),
    max: sorted[sorted.length - 1],
    percentileMethod: 'nearest-rank',
  };
}

function replayCommand({ requests, sampleSize, baseSeed, profileId }) {
  const defaultCliProfile = profileId === 'phase1-dev-default';
  const defaultCliRequests = JSON.stringify(requests) === JSON.stringify(DEFAULT_BULK_REQUESTS);
  if (defaultCliProfile && defaultCliRequests) {
    return `node src/content/bulk-validation.js --sample-size ${sampleSize} --seed ${baseSeed}`;
  }
  const options = JSON.stringify({ requests, sampleSize, baseSeed, profileId });
  return `node --input-type=module -e "import { runBulkValidation } from './src/content/index.js'; console.log(JSON.stringify(runBulkValidation(${options}), null, 2));"`;
}

function reportForRequest({ request, sampleSize, baseSeed, profileId }) {
  const space = inspectCandidateSpace({ ...request, profileId });
  const instances = [];
  const failureSamples = [];
  const sampledRejectionReasons = {};
  const checks = {
    familyMembership: { passed: 0, failed: 0 },
    exactResult: { passed: 0, failed: 0 },
    canonicalPath: { passed: 0, failed: 0 },
    alternatePath: { checked: 0, passed: 0, failed: 0 },
    excludedComplexity: { passed: 0, failed: 0 },
    representationFacts: { recorded: 0, deferredEligibility: 0 },
  };

  for (let index = 0; index < sampleSize; index += 1) {
    const seed = deriveBatchSeed(`${baseSeed}:${request.selector}:${request.overlays.join('+') || 'none'}`, index);
    try {
      const instance = generateProblem({ ...request, profileId, seed });
      instances.push(instance);
      const validation = validateProblemInstance(instance);
      const find = (id) => validation.checks.find((check) => check.id === id);
      const membershipPass = Boolean(find('candidate-membership')?.valid && find('structural-membership')?.valid && find('overlay-membership')?.valid);
      const exactPass = Boolean(find('canonical-operation-result')?.valid);
      const canonicalPass = Boolean(find('canonical-path-reproducible')?.valid && find('canonical-path-is-least')?.valid);
      const alternateChecks = validation.checks.filter((check) => check.id.startsWith('alternate-'));
      const alternatePathCount = instance.alternatePaths.length;
      const alternatePass = alternateChecks.every((check) => check.valid);
      const complexityPass = Boolean(find('candidate-membership')?.valid);
      const representationPass = Boolean(find('representation-eligibility-deferred')?.valid);
      checks.familyMembership[membershipPass ? 'passed' : 'failed'] += 1;
      checks.exactResult[exactPass ? 'passed' : 'failed'] += 1;
      checks.canonicalPath[canonicalPass ? 'passed' : 'failed'] += 1;
      checks.alternatePath.checked += alternatePathCount;
      checks.alternatePath[alternatePass ? 'passed' : 'failed'] += alternatePathCount;
      checks.excludedComplexity[complexityPass ? 'passed' : 'failed'] += 1;
      checks.representationFacts.recorded += instance.representationFacts ? 1 : 0;
      checks.representationFacts.deferredEligibility += representationPass ? 1 : 0;
      if (!validation.valid) {
        failureSamples.push({ seed, id: instance.id, reason: 'instance-validation-failed' });
      }
    } catch (error) {
      failureSamples.push({ seed, id: null, reason: error.code ?? 'generation-error', message: error.message });
      const reason = error.code ?? 'generation-error';
      sampledRejectionReasons[reason] = (sampledRejectionReasons[reason] ?? 0) + 1;
    }
  }

  const uniqueKeys = new Set(instances.map(mathematicalInstanceKey));
  const uniqueCount = uniqueKeys.size;
  const duplicateCount = instances.length - uniqueCount;
  const rawResultForms = instances.map((instance) => instance.classification.result.resultForm);
  const leftScales = instances.map((instance) => Number(instance.classification.denominator.canonicalScaleFactors.left));
  const rightScales = instances.map((instance) => Number(instance.classification.denominator.canonicalScaleFactors.right));
  const canonicalDenominators = instances.map((instance) => Number(instance.classification.denominator.leastCommonDenominator));
  const renamePatterns = instances.map((instance) => {
    const left = instance.classification.transformations.canonicalRenaming.left ? 'left' : 'unchanged';
    const right = instance.classification.transformations.canonicalRenaming.right ? 'right' : 'unchanged';
    return `${left}+${right}`;
  });
  const subcategories = instances.map((instance) => [
    instance.classification.result.resultForm,
    instance.classification.result.simplificationStatus,
    instance.classification.result.crossesWhole ? 'crosses-one-whole' : 'does-not-cross-one-whole',
  ].join('|'));
  const accepted = instances.length;
  const eligible = Number(space.eligibleCardinality);
  const coverage = eligible === 0 ? null : {
    numeratorUniqueInstances: uniqueCount,
    denominatorEligibleCandidateSpace: eligible,
    percent: percent(uniqueCount, eligible),
    finiteSpaceEnumerated: true,
  };

  return {
    selector: request.selector,
    overlays: request.overlays,
    status: Number(space.eligibleCardinality) === 0 ? 'unsatisfiable-for-profile' : 'validated',
    requestedSampledDraws: sampleSize,
    sampledAcceptedDraws: accepted,
    sampledRejectedDraws: sampleSize - accepted,
    candidateSpace: {
      finiteSpaceEnumerated: true,
      rawCandidateSpaceCardinality: space.rawCardinality,
      eligibleCandidateSpaceCardinality: space.eligibleCardinality,
    },
    uniqueMathematicalInstances: uniqueCount,
    duplicateAcceptedDraws: duplicateCount,
    sampledAcceptancePercent: percent(accepted, sampleSize),
    uniquenessAmongAcceptedPercent: percent(uniqueCount, accepted),
    finiteSpaceCoverage: coverage,
    rejectionReasons: {
      candidateSpaceEnumeration: space.rejectionCounts,
      sampledGeneration: sampledRejectionReasons,
    },
    contractChecks: checks,
    distributions: {
      denominatorRelationship: histogram(instances.map((instance) => instance.classification.denominator.relationship)),
      operandRenamePattern: histogram(renamePatterns),
      scaleFactorLeft: numericSummary(leftScales),
      scaleFactorRight: numericSummary(rightScales),
      canonicalDenominator: numericSummary(canonicalDenominators),
      resultForm: histogram(rawResultForms),
      simplificationStatus: histogram(instances.map((instance) => instance.classification.result.simplificationStatus)),
      crossesWhole: histogram(instances.map((instance) => instance.classification.result.crossesWhole ? 'true' : 'false')),
      subcategories: histogram(subcategories),
    },
    representativeInstances: instances.slice(0, 3).map((instance) => ({ id: instance.id, seed: instance.provenance.seed })),
    failureSamples,
  };
}

export function runBulkValidation({
  requests = DEFAULT_BULK_REQUESTS,
  sampleSize = 1000,
  baseSeed = 'plan03-bulk-v1',
  profileId = 'phase1-dev-default',
} = {}) {
  if (!Number.isSafeInteger(sampleSize) || sampleSize <= 0) {
    throw new RangeError('sampleSize must be a positive safe integer');
  }
  const selectorReports = requests.map((request) => reportForRequest({
    request,
    sampleSize,
    baseSeed,
    profileId,
  }));
  const curatedResults = validateCuratedFixtures();
  const curatedFailures = curatedResults.filter((result) => !result.validation.valid);
  const blockingFailures = [];
  for (const selectorReport of selectorReports) {
    if (selectorReport.status === 'validated'
      && selectorReport.sampledAcceptedDraws !== selectorReport.requestedSampledDraws) {
      blockingFailures.push(`${selectorReport.selector}:accepted-draw-shortfall`);
    }
    if (selectorReport.status === 'validated' && selectorReport.failureSamples.length > 0) {
      blockingFailures.push(`${selectorReport.selector}:validation-failure`);
    }
  }
  const profile = getProfile(profileId);
  if (curatedFailures.length > 0) blockingFailures.push('curated-fixtures:validation-failure');
  return {
    reportVersion: BULK_REPORT_VERSION,
    run: {
      generatorVersion: 'fractionflow.generator/v1',
      schemaVersion: 'fractionflow.problem-instance/v1',
      profileId,
      profileVersion: profile.version,
      baseSeed,
      requestedBatchSize: sampleSize,
      seedDerivation: 'FNV-1a-64 -> SplitMix64 -> domain-separated batch seed -> cyclic candidate scan',
      command: replayCommand({ requests, sampleSize, baseSeed, profileId }),
      recordedAt: null,
    },
    selectors: selectorReports,
    curatedFixtures: {
      requested: curatedResults.length,
      passed: curatedResults.length - curatedFailures.length,
      failed: curatedFailures.length,
      failureSamples: curatedFailures.slice(0, 10).map((result) => ({
        id: result.fixture.id,
        reason: result.validation.errors.map((error) => error.id),
      })),
    },
    overall: {
      pass: blockingFailures.length === 0,
      blockingFailures,
      warnings: [
        ...selectorReports
          .filter((report) => report.duplicateAcceptedDraws > 0)
          .map((report) => `${report.selector}+${report.overlays.join('+') || 'none'}:sampled-draws-include-duplicates`),
        ...selectorReports
          .filter((report) => report.status === 'unsatisfiable-for-profile')
          .map((report) => `${report.selector}+${report.overlays.join('+') || 'none'}:no-eligible-candidates-for-profile`),
      ],
    },
  };
}

function renderHistogram(title, value) {
  const lines = [`#### ${title}`, `Population n=${value.n}`, '', '| Value | Count | Percent of n |', '|---|---:|---:|'];
  for (const entry of value.entries) lines.push(`| ${entry.value} | ${entry.count} | ${entry.percentOfN}% |`);
  return lines.join('\n');
}

function renderNumericSummary(title, value) {
  return [
    `#### ${title}`,
    `Population n=${value.n}; percentile method=${value.percentileMethod}`,
    '',
    '| Min | P50 | P90 | P95 | P99 | Max |',
    '|---:|---:|---:|---:|---:|---:|',
    `| ${value.min ?? 'n/a'} | ${value.p50 ?? 'n/a'} | ${value.p90 ?? 'n/a'} | ${value.p95 ?? 'n/a'} | ${value.p99 ?? 'n/a'} | ${value.max ?? 'n/a'} |`,
  ].join('\n');
}

export function renderBulkValidationMarkdown(report) {
  const lines = [
    '# Plan 03 Bulk Validation Report',
    '',
    `- Report version: \`${report.reportVersion}\``,
    `- Generator version: \`${report.run.generatorVersion}\``,
    `- Profile: \`${report.run.profileId}/${report.run.profileVersion}\``,
    `- Base seed: \`${report.run.baseSeed}\``,
    `- Requested sampled draws per selector: ${report.run.requestedBatchSize}`,
    `- Seed derivation: ${report.run.seedDerivation}`,
    `- Replay command: \`${report.run.command}\``,
    '',
    `## Overall result: ${report.overall.pass ? 'PASS' : 'FAIL'}`,
    '',
    `Blocking failures: ${report.overall.blockingFailures.length === 0 ? 'none' : report.overall.blockingFailures.join(', ')}`,
    `Warnings: ${report.overall.warnings.length === 0 ? 'none' : report.overall.warnings.join(', ')}`,
    '',
    '## Selector summaries',
    '',
    '| Selector | Overlays | Status | Requested draws | Accepted draws | Unique instances | Duplicate accepted draws | Eligible finite space | Coverage |',
    '|---|---|---|---:|---:|---:|---:|---:|---:|',
  ];
  for (const selector of report.selectors) {
    lines.push(`| ${selector.selector} | ${selector.overlays.join(', ') || 'none'} | ${selector.status} | ${selector.requestedSampledDraws} | ${selector.sampledAcceptedDraws} | ${selector.uniqueMathematicalInstances} | ${selector.duplicateAcceptedDraws} | ${selector.candidateSpace.eligibleCandidateSpaceCardinality} | ${selector.finiteSpaceCoverage?.percent ?? 'n/a'}% |`);
  }
  for (const selector of report.selectors) {
    lines.push('', `## ${selector.selector} (${selector.overlays.join(', ') || 'no overlays'})`, '');
    lines.push(`- Candidate-space cardinality: raw=${selector.candidateSpace.rawCandidateSpaceCardinality}, eligible=${selector.candidateSpace.eligibleCandidateSpaceCardinality}, finite enumeration=${selector.candidateSpace.finiteSpaceEnumerated}`);
    lines.push(`- Sampled accepted draws: ${selector.sampledAcceptedDraws}/${selector.requestedSampledDraws}`);
    lines.push(`- Unique mathematical instances: ${selector.uniqueMathematicalInstances}`);
    lines.push(`- Duplicate accepted draws: ${selector.duplicateAcceptedDraws}`);
    lines.push(`- Finite-space coverage: ${selector.finiteSpaceCoverage?.numeratorUniqueInstances ?? 'n/a'}/${selector.finiteSpaceCoverage?.denominatorEligibleCandidateSpace ?? 'n/a'} = ${selector.finiteSpaceCoverage?.percent ?? 'n/a'}%`);
    lines.push('', '### Rejection reasons by population');
    for (const [population, reasons] of Object.entries(selector.rejectionReasons)) {
      lines.push('', `#### ${population}`, '', '| Reason | Count |', '|---|---:|');
      for (const [reason, count] of Object.entries(reasons).sort(([left], [right]) => left.localeCompare(right))) lines.push(`| ${reason} | ${count} |`);
    }
    lines.push('', '### Contract checks', '', '| Check | Passed | Failed |', '|---|---:|---:|');
    for (const [name, value] of Object.entries(selector.contractChecks)) {
      const passed = value.passed ?? value.recorded ?? 0;
      const failed = value.failed ?? 0;
      lines.push(`| ${name} | ${passed} | ${failed} |`);
    }
    lines.push('', renderHistogram('Denominator relationship', selector.distributions.denominatorRelationship));
    lines.push('', renderHistogram('Operand renaming pattern', selector.distributions.operandRenamePattern));
    lines.push('', renderNumericSummary('Left scale factor', selector.distributions.scaleFactorLeft));
    lines.push('', renderNumericSummary('Right scale factor', selector.distributions.scaleFactorRight));
    lines.push('', renderNumericSummary('Canonical denominator', selector.distributions.canonicalDenominator));
    lines.push('', renderHistogram('Result form', selector.distributions.resultForm));
    lines.push('', renderHistogram('Simplification status', selector.distributions.simplificationStatus));
    lines.push('', renderHistogram('Crosses one whole', selector.distributions.crossesWhole));
    lines.push('', renderHistogram('Subcategory balance', selector.distributions.subcategories));
    lines.push('', '### Representative instances', '', '| ID | Seed |', '|---|---|');
    for (const sample of selector.representativeInstances) lines.push(`| ${sample.id} | ${sample.seed} |`);
    if (selector.failureSamples.length > 0) {
      lines.push('', '### Failure samples', '', '```json', JSON.stringify(selector.failureSamples, null, 2), '```');
    }
  }
  lines.push('', '## Curated fixture validation', '', `- Requested: ${report.curatedFixtures.requested}`, `- Passed: ${report.curatedFixtures.passed}`, `- Failed: ${report.curatedFixtures.failed}`);
  if (report.curatedFixtures.failureSamples.length > 0) lines.push('', '```json', JSON.stringify(report.curatedFixtures.failureSamples, null, 2), '```');
  return `${lines.join('\n')}\n`;
}

export function writeBulkValidationReport(report, outputDirectory) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const jsonPath = path.join(outputDirectory, 'bulk-validation-report.json');
  const markdownPath = path.join(outputDirectory, 'bulk-validation-report.md');
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(markdownPath, renderBulkValidationMarkdown(report), 'utf8');
  return { jsonPath, markdownPath };
}

function parseCliArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--sample-size') options.sampleSize = Number(args[++index]);
    else if (args[index] === '--seed') options.baseSeed = args[++index];
    else throw new Error(`unknown argument: ${args[index]}`);
  }
  return options;
}

const isMain = process.argv[1]
  && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  try {
    const report = runBulkValidation(parseCliArgs(process.argv.slice(2)));
    const output = writeBulkValidationReport(
      report,
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../reports/development/plan-03-content-contracts-and-deterministic-generation'),
    );
    process.stdout.write(`${JSON.stringify({ pass: report.overall.pass, output }, null, 2)}\n`);
    if (!report.overall.pass) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error.stack ?? error}\n`);
    process.exitCode = 1;
  }
}

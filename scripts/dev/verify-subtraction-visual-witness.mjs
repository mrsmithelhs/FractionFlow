import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { runRouteMatrix } = require('./run-route-matrix.js');
const filter = 'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY';
const expectedExecutions = 4;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const seededVisualDefect of ['hidden', 'collapsed', 'erased-removal-mark']) {
  const result = await runRouteMatrix({ filter, seededVisualDefect, verbose: true });
  const expectedFailedRoutes = seededVisualDefect === 'erased-removal-mark'
    ? new Set(['ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY'])
    : new Set([
      'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY',
      'ROUTE-PROTOTYPE-SUBTRACTION-COMPARISON',
    ]);
  const expectedFailures = expectedFailedRoutes.size * 2;
  assert(
    result.total === expectedExecutions
      && result.failed === expectedFailures
      && result.passed === expectedExecutions - expectedFailures,
    `The ${seededVisualDefect} visual defect produced an unexpected filtered prototype result.`,
  );
  assert(
    result.results.every((route) => (
      expectedFailedRoutes.has(route.routeId)
        ? route.status === 'fail' && route.error?.includes('visible geometry assertion failed')
        : route.status === 'pass'
    )),
    `The ${seededVisualDefect} visual defect did not fail only its intended visible-geometry witnesses.`,
  );
  const outcome = seededVisualDefect === 'erased-removal-mark'
    ? `${result.failed}/${result.total} takeaway executions rejected by required hatch paint; reciprocal comparison passed ${result.passed}/${result.total - result.failed}`
    : `${result.failed}/${result.total} prototype executions rejected by visible-geometry assertions`;
  console.log(`EXPECTED SEEDED FAILURE (${seededVisualDefect}): ${outcome}.`);
}

const restored = await runRouteMatrix({ filter, verbose: true });
assert(
  restored.total === expectedExecutions
    && restored.passed === expectedExecutions
    && restored.failed === 0,
  'The clean static prototype witnesses did not pass after the seeded page styles were removed.',
);
console.log(
  `CLEAN STATIC RUN AFTER SEEDED STYLES WERE REMOVED: ${restored.passed}/${restored.total} prototype executions passed.`,
);

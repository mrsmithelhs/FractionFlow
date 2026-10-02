import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { runRouteMatrix } = require('./run-route-matrix.js');
const filter = 'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY';
const expectedExecutions = 4;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const expectedFailuresBySeed = {
  hidden: {
    routes: new Set([
      'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY',
      'ROUTE-PROTOTYPE-SUBTRACTION-COMPARISON',
    ]),
    reason: 'visible geometry assertion failed',
  },
  collapsed: {
    routes: new Set([
      'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY',
      'ROUTE-PROTOTYPE-SUBTRACTION-COMPARISON',
    ]),
    reason: 'visible geometry assertion failed',
  },
  'erased-removal-mark': {
    routes: new Set(['ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY']),
    reason: 'visible geometry assertion failed',
  },
  'erased-comparison-gap-mark': {
    routes: new Set(['ROUTE-PROTOTYPE-SUBTRACTION-COMPARISON']),
    reason: 'visible geometry assertion failed',
  },
  'fully-clipped-representation': {
    routes: new Set([
      'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY',
      'ROUTE-PROTOTYPE-SUBTRACTION-COMPARISON',
    ]),
    reason: 'visible geometry assertion failed',
  },
};

for (const [seededVisualDefect, expectation] of Object.entries(expectedFailuresBySeed)) {
  const result = await runRouteMatrix({ filter, seededVisualDefect, verbose: true });
  const expectedFailedRoutes = expectation.routes;
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
        ? route.status === 'fail' && route.error?.includes(expectation.reason)
        : route.status === 'pass'
    )),
    `The ${seededVisualDefect} visual defect did not fail only its intended visible-geometry witnesses.`,
  );
  const details = expectedFailedRoutes.size === 1
    ? `${expectedFailures}/${result.total} ${[...expectedFailedRoutes][0]} executions failed; unaffected counterpart passed ${result.passed}/${result.total - result.failed}`
    : `${result.failed}/${result.total} prototype executions failed`;
  console.log(`EXPECTED SEEDED FAILURE (${seededVisualDefect}): ${details}.`);
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

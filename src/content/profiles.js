import { deepFreeze } from './schema.js';

const DEFAULT_DENOMINATOR_POOL = Object.freeze([2n, 3n, 4n, 5n, 6n, 8n, 10n, 12n]);

export const PROFILE_DEFINITIONS = deepFreeze({
  'phase1-dev-default': {
    id: 'phase1-dev-default',
    version: '1',
    denominatorPool: DEFAULT_DENOMINATOR_POOL,
    properOperands: true,
    simplestOperands: true,
    allowZeroOperands: false,
    positiveResult: true,
    resultUpperBound: { numerator: 2n, denominator: 1n, relation: 'less-than' },
    defaultSimplificationStatus: 'already-simplified',
    defaultCrossesWhole: false,
    maxCanonicalScaleFactor: 6n,
    maxAlternateScaleFactor: 12n,
    maxAttempts: 4096,
  },
  'curated-review': {
    id: 'curated-review',
    version: '1',
    denominatorPool: Object.freeze([2n, 3n, 4n, 5n, 6n, 7n, 8n, 10n, 12n]),
    properOperands: true,
    simplestOperands: false,
    allowZeroOperands: false,
    positiveResult: true,
    resultUpperBound: { numerator: 2n, denominator: 1n, relation: 'less-than' },
    defaultSimplificationStatus: 'already-simplified',
    defaultCrossesWhole: false,
    maxCanonicalScaleFactor: 12n,
    maxAlternateScaleFactor: 24n,
    maxAttempts: 4096,
  },
});

export function getProfile(profileId = 'phase1-dev-default') {
  const profile = PROFILE_DEFINITIONS[profileId];
  if (!profile) {
    throw new RangeError(`unknown content profile: ${profileId}`);
  }
  return profile;
}

export const PROFILE_IDS = Object.freeze(Object.keys(PROFILE_DEFINITIONS));

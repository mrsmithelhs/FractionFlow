// Run only against the pinned pre-pilot source; never refresh after integration.
import { writeFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { PLAN40_SUBTRACTION_RECIPE_RECORDS as records, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET as v1, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2 as v2 } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { resolveCuratedFixture } from '../../../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../../../src/content/generator.js';
import { resolvePlan40SubtractionRecipeContext } from '../../../src/content/plan40-reusable-subtraction-recipes.js';
import { createEpisode } from '../../../src/interaction/episode.js';
import { createReplayEnvelope, replayEpisode } from '../../../src/interaction/replay.js';
import { PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION as definition } from '../../../src/interaction/episode-definition.js';
import { HIGH_SUPPORT_CONFIGURATION as support } from '../../../src/interaction/support.js';
const output = new URL('./baseline-v6-oracles.json', import.meta.url);
assert.ok(!existsSync(output), 'refusing to overwrite a frozen oracle');
const witnesses = [[v1, v1.itemIds[0]], [v2, v2.itemIds[0]], [v2, v2.itemIds[9]]].map(([set, id]) => {
  const record = records.find(r => r.itemId === id), fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  const instance = buildCuratedProblem({ fixture, selector: fixture.selector, overlays: fixture.overlays, profileId: fixture.profileId, candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] } });
  const taskContext = resolvePlan40SubtractionRecipeContext(instance, id, { practiceSetId: set.id, practiceSetRevision: set.revision });
  const expected = createEpisode({ instance, episodeDefinition: definition, taskContext, support });
  const envelope = createReplayEnvelope(expected);
  assert.deepEqual(replayEpisode(envelope), expected);
  return { setId: set.id, revision: set.revision, itemId: id, envelope, expected };
});
writeFileSync(output, JSON.stringify({ baseline: 'fd97c687af922b9e341212c5e2c8d4502fd855fa', witnesses }, null, 2) + '\n', { flag: 'wx' });

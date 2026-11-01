import { writeFileSync } from 'node:fs';
import { resolvePlan45ComparisonContext, plan45ComparisonHelpText } from '../../../src/content/plan45-symbolic-fraction-comparison-task.js';
import { createEpisode, applyIntent } from '../../../src/interaction/episode.js';
import { PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION as definition } from '../../../src/interaction/episode-definition.js';
import { createReplayEnvelope, replayEpisode } from '../../../src/interaction/replay.js';
const cases = [];
for (const itemId of ['plan45-compare-01','plan45-compare-03']) {
 let state = createEpisode({ episodeDefinition: definition, taskContext: resolvePlan45ComparisonContext(itemId) });
 for (const intent of [{type:'request-comparison-help',helpKind:'reasoning'}, {type:'request-comparison-model',side:'first'}, {type:'submit-fraction-comparison',proposed:'<'}]) state = applyIntent(state,intent);
 const envelope = createReplayEnvelope(state);
 if (JSON.stringify(replayEpisode(envelope)) !== JSON.stringify(state)) throw Error('roundtrip mismatch');
 cases.push({itemId, cue:plan45ComparisonHelpText(state.taskContext,'reasoning'),envelope,expectedState:state});
}
writeFileSync(new URL('./v9-prechange-oracles.json',import.meta.url), JSON.stringify({cases},null,2)+'\n');

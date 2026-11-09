import { createComparisonRecordStorage, randomRecordToken } from '../../../src/app/comparison-record-storage.js';
import { identityFromContext, emptyRoot } from '../../../src/app/comparison-record.js';
import { resolvePlan49Context } from '../../../src/interaction/plan49-comparison-construction.js';

let storage;
window.extra92 = {
  async open(name) {
    storage = createComparisonRecordStorage({ name });
    return storage.enable();
  },
  async connect(name) {
    storage = createComparisonRecordStorage({ name });
    return storage.read();
  },
  async observation(kind = 'first-retry') {
    const context = resolvePlan49Context('plan45-compare-01');
    return {
      kind,
      token: randomRecordToken(),
      identity: identityFromContext(context),
      support: 'medium',
      assistance: { model: 'no', help: 'no', construction: 'no' },
    };
  },
  record(generation, observation) { return storage.record(generation, observation); },
  clear() { return storage.clear(); },
  stop() { return storage.stop(); },
  read() { return storage.read(); },
  close() { storage?.close(); },
};
window.extra92Ready = true;

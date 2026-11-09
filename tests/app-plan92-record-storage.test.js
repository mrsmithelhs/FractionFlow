import { describe, it, expect } from 'vitest';
import { emptyPlan92Meta, validatePlan92Meta, createPlan92RecordStorage } from '../src/app/plan92-record-storage.js';

describe('Plan 92 record metadata', () => {
  it('starts disabled and rejects malformed generations and metadata', () => {
    const meta = emptyPlan92Meta('a'.repeat(32));
    expect(meta.enabled).toBe(false);
    expect(validatePlan92Meta(meta)).toEqual(meta);
    expect(() => validatePlan92Meta({ ...meta, enabled: 'yes' })).toThrow();
    expect(() => validatePlan92Meta({ ...meta, epoch: 'bad' })).toThrow();
  });
  it('refuses a history-derived install when the origin lock is unavailable', async () => {
    const store = createPlan92RecordStorage({ locks: null });
    await expect(store.installHistoryChoice('a'.repeat(32), () => {})).rejects.toThrow('history lock unavailable');
  });
});

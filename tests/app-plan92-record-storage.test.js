import { describe, it, expect } from 'vitest';
import { emptyPlan92Meta, clearedPlan92Meta, validatePlan92Meta, createPlan92RecordStorage, plan92LagWitness } from '../src/app/plan92-record-storage.js';
import { allGate92Descriptors } from '../src/app/plan92-catalog.js';

describe('Plan 92 record metadata', () => {
  it('starts disabled and rejects malformed generations and metadata', () => {
    const meta = emptyPlan92Meta('a'.repeat(32));
    expect(meta.enabled).toBe(false);
    expect(validatePlan92Meta(meta)).toEqual(meta);
    expect(() => validatePlan92Meta({ ...meta, enabled: 'yes' })).toThrow();
    expect(() => validatePlan92Meta({ ...meta, epoch: 'bad' })).toThrow();
    expect(meta.registrationSchema).toBe(1);
    expect(() => validatePlan92Meta({ ...meta, writerRegistration: undefined })).toThrow();
  });
  it('keeps pre-registration v2 metadata recognizable but unsupported for lag ownership', () => {
    const oldV2 = validatePlan92Meta({ schema: 1, epoch: 'c'.repeat(32), enabled: true,
      nextOrdinal: 1, earliestOrdinal: 1, coverage: 'unknown', ordering: 'unknown', revision: 0 });
    expect(oldV2.registrationSchema).toBeUndefined();
    expect(oldV2.writerRegistration).toBeUndefined();
  });
  it('does not retrofit pre-registration v2 when Clear resets its retained events', () => {
    const oldV2 = validatePlan92Meta({ schema: 1, epoch: 'd'.repeat(32), enabled: true,
      nextOrdinal: 8, earliestOrdinal: 3, coverage: 'unknown', ordering: 'unknown', revision: 5 });
    const cleared = clearedPlan92Meta('e'.repeat(32), oldV2);
    expect(cleared.enabled).toBe(true);
    expect(cleared.nextOrdinal).toBe(1);
    expect(cleared.registrationSchema).toBeUndefined();
    expect(cleared.writerRegistration).toBeUndefined();
    expect(() => validatePlan92Meta({ ...cleared, registrationSchema: 1 })).toThrow();
  });
  it('refuses a history-derived install when the origin lock is unavailable', async () => {
    const store = createPlan92RecordStorage({ locks: null });
    await expect(store.installHistoryChoice('a'.repeat(32), () => {})).rejects.toThrow('history lock unavailable');
  });

  it('counts lag only between retained events tagged with the same enabled generation', () => {
    const epoch = 'a'.repeat(32), other = 'b'.repeat(32);
    const meta = { ...emptyPlan92Meta(epoch, true), nextOrdinal: 5, ordering: 'continuous' };
    // Descriptor validation is intentionally authoritative, so use an approved catalog identity.
    const d = allGate92Descriptors().find(x => x.role === 'C');
    const row = (ordinal, generation) => ({ token: ordinal.toString(16).padStart(32, '0'), ordinal,
      ...(generation ? { epoch: generation } : {}), identity: d.identity, role: d.role,
      demand: JSON.stringify(d.decision), first: 'unknown', accepted: 'unknown', firstAssistance: 'unknown', acceptedAssistance: 'unknown' });
    const events = [row(1, other), row(2, epoch), row(3, epoch), row(4, epoch)];
    const from = events[1].token, to = events[3].token;
    expect(plan92LagWitness(meta, events, epoch, from, to)).toMatchObject({ epoch, fromOrdinal: 2, toOrdinal: 4, lag: 1 });
    expect(plan92LagWitness(meta, [row(1, other), row(2, epoch), row(3, other), row(4, epoch)], epoch, from, to)).toBeNull();
    expect(plan92LagWitness({ ...meta, epoch: other }, events, other, from, to)).toBeNull();
    expect(plan92LagWitness({ ...meta, ordering: 'unknown' }, events, epoch, from, to)).toBeNull();
    expect(plan92LagWitness(meta, [row(1, other), row(2, undefined)], epoch, events[1].token, events[3].token)).toBeNull();
    // Legacy rows retain read compatibility, but have no epoch and cannot prove a lag endpoint.
    expect(validatePlan92Meta({ schema: 1, epoch, enabled: true, nextOrdinal: 2, earliestOrdinal: 1, coverage: 'unknown' }).ordering).toBe('unknown');
  });
});

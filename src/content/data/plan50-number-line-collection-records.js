import { deepFreeze } from '../schema.js';
const member = (id, numerator, denominator) => ({ id, form: { numerator, denominator } });
export const PLAN50_RECORDS = deepFreeze([
  { itemId: 'collection-01', itemRevision: '1', purpose: 'equivalent-pair-and-contrast', lattice: 8, members: [member('a','3','4'), member('b','1','2'), member('c','3','6')] },
  { itemId: 'collection-02', itemRevision: '1', purpose: 'distinct-ordering', lattice: 8, members: [member('a','7','8'), member('b','1','4'), member('c','1','2')] },
  { itemId: 'collection-03', itemRevision: '1', purpose: 'thirds-and-equivalence', lattice: 6, members: [member('a','4','6'), member('b','1','3'), member('c','2','3')] },
  { itemId: 'collection-04', itemRevision: '1', purpose: 'endpoints', lattice: 4, members: [member('a','4','4'), member('b','0','2'), member('c','2','4')] },
]);

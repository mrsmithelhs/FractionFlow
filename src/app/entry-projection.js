const GROUPS = [
  ['Add and subtract', ['sum-under-one', 'like-denominator-addition', 'like-denominator-subtraction', 'unlike-denominator-subtraction']],
  ['Compare and distance', ['symbolic-fraction-comparison', 'fraction-distance', 'session:short-magnitude-practice']],
  ['Number lines', ['bar-to-line-same-amount', 'number-line-collection', 'two-whole-location', 'directed-number-line-endpoint']],
  ['Wholes and parts', ['whole-plus-fraction-construction', 'mixed-number-addition-without-regrouping', 'mixed-number-addition-with-regrouping', 'mixed-number-subtraction-without-decomposition', 'mixed-number-subtraction-with-decomposition']],
];

const FEATURED_IDS = ['sum-under-one', 'symbolic-fraction-comparison', 'bar-to-line-same-amount', 'whole-plus-fraction-construction'];

/** Project admitted capabilities; never manufacture a goal or replacement primary. */
export function projectEntryCapabilities(practiceTypes, sessionCapability = null, day = 0) {
  if (!Number.isSafeInteger(day)) throw new TypeError('invalid featured rotation day');
  const configured = new Set(GROUPS.flatMap(([, ids]) => ids));
  const byId = new Map();
  const errors = [];
  const duplicateIds = new Set();
  for (const type of practiceTypes) {
    if (!type?.id) { errors.push(`duplicate or invalid practice: ${type?.id}`); continue; }
    if (byId.has(type.id) || duplicateIds.has(type.id)) { errors.push(`duplicate or invalid practice: ${type.id}`); byId.delete(type.id); duplicateIds.add(type.id); continue; }
    if (type.id.startsWith('session:') || !configured.has(type.id)) { errors.push(`unmapped practice: ${type.id}`); continue; }
    byId.set(type.id, { kind: 'practice', type });
  }
  if (sessionCapability) {
    const id = `session:${sessionCapability.id}`;
    if (!configured.has(id)) errors.push(`unmapped session: ${sessionCapability.id}`);
    else byId.set(id, { kind: 'session', manifest: sessionCapability });
  }
  const eligible = FEATURED_IDS.map(id => byId.get(id)).filter(Boolean);
  const primary = eligible.length ? eligible[((day % eligible.length) + eligible.length) % eligible.length] : null;
  return {
    primary,
    groups: GROUPS.map(([label, ids]) => ({ label, entries: ids.map(id => byId.get(id)).filter(Boolean) })).filter(group => group.entries.length),
    errors,
  };
}

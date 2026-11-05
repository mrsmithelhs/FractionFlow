const GROUPS = [
  ['Add and subtract', ['sum-under-one', 'like-denominator-addition', 'like-denominator-subtraction', 'unlike-denominator-subtraction']],
  ['Compare and distance', ['symbolic-fraction-comparison', 'fraction-distance', 'session:short-magnitude-practice']],
  ['Number lines', ['bar-to-line-same-amount', 'number-line-collection', 'two-whole-location', 'directed-number-line-endpoint']],
  ['Wholes and parts', ['whole-plus-fraction-construction']],
];

/** Project admitted capabilities; never manufacture a goal or replacement primary. */
export function projectEntryCapabilities(practiceTypes, sessionCapability = null) {
  const configured = new Set(GROUPS.flatMap(([, ids]) => ids));
  const byId = new Map();
  const errors = [];
  for (const type of practiceTypes) {
    if (!type?.id || byId.has(type.id)) { errors.push(`duplicate or invalid practice: ${type?.id}`); continue; }
    if (type.id.startsWith('session:') || !configured.has(type.id)) { errors.push(`unmapped practice: ${type.id}`); continue; }
    byId.set(type.id, { kind: 'practice', type });
  }
  if (sessionCapability) {
    const id = `session:${sessionCapability.id}`;
    if (!configured.has(id)) errors.push(`unmapped session: ${sessionCapability.id}`);
    else byId.set(id, { kind: 'session', manifest: sessionCapability });
  }
  return {
    primary: byId.get('sum-under-one') ?? null,
    groups: GROUPS.map(([label, ids]) => ({ label, entries: ids.map(id => byId.get(id)).filter(Boolean) })).filter(group => group.entries.length),
    errors,
  };
}

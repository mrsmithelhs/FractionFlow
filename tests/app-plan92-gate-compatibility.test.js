import {describe,it,expect} from 'vitest';
import {allGate92Descriptors,describeGate92,validateGate92Visit} from '../reports/development/plan-92-generated-managed-practice/gate92-catalog.mjs';

describe('Plan 92 isolated mathematical compatibility',()=>{
 const all=allGate92Descriptors(),role=r=>all.filter(x=>x.role===r);
 it('binds all exact candidates to their real decisions and mathematical structures',()=>{
  expect(all).toHaveLength(11);
  expect(new Set(role('C').map(x=>x.decision.structure)).size).toBe(3);
  expect(new Set(role('I').map(x=>x.decision.side))).toEqual(new Set(['left','right']));
  expect(new Set(role('S').map(x=>JSON.stringify(x.decision.judgments))).size).toBe(2);
  expect(new Set(role('T').map(x=>x.decision.denominatorRelationship))).toEqual(new Set(['coprime','shared-factor']));
  expect(new Set(all.map(x=>JSON.stringify(x.problemKey))).size).toBe(11);
 });
 it('validates each goal-linked role sequence and rejects omitted, reordered and altered work',()=>{
  for(const roles of [['C','I','T'],['C','S','T'],['C','I','S','T']])expect(validateGate92Visit(roles.map(r=>role(r)[0]))).toBe(true);
  expect(()=>validateGate92Visit([role('C')[0],role('T')[0],role('I')[0]])).toThrow();
  expect(()=>validateGate92Visit([role('C')[0],{...role('I')[0],decision:{...role('I')[0].decision,side:'right'}},role('T')[0]])).toThrow();
  expect(()=>describeGate92({...role('T')[0].identity,itemId:'plan85-isolated-construct-five-sixths-one-fourth-12'})).toThrow();
 });
});

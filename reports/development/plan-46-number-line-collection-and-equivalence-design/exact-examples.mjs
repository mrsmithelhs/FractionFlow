import { createFraction, compareFractions, equalFractions } from '../../../src/math/fraction.js';
const cases = [
  ['contrast', 8, [[3,4],[1,2],[3,6]]],
  ['distinct', 8, [[7,8],[1,4],[1,2]]],
  ['thirds', 6, [[4,6],[1,3],[2,3]]],
  ['boundaries', 4, [[4,4],[0,2],[2,4]]],
  ['all-equal-deferred', 8, [[4,8],[1,2],[2,4]]],
  ['reject-lattice', 8, [[1,3],[1,2],[3,4]]],
  ['reject-source-bound', 8, [[1,10],[1,2],[3,4]]],
];
for (const [name, lattice, raw] of cases) {
  const forms = raw.map(([n,d]) => createFraction(n,d));
  const candidates = Array.from({length:lattice+1}, (_,i) => createFraction(i,lattice));
  const positions = forms.map(f => candidates.findIndex(c => equalFractions(f,c)));
  const within = forms.every(f => compareFractions(f,createFraction(0,1)) >= 0 && compareFractions(f,createFraction(1,1)) <= 0);
  const bounded = raw.every(([,d]) => d <= 8);
  const order = forms.map((_,i)=>i).sort((a,b)=>compareFractions(forms[a],forms[b])).map(i=>String.fromCharCode(65+i)).join(' ');
  const ties = [[0,1],[0,2],[1,2]].filter(([a,b])=>equalFractions(forms[a],forms[b])).map(([a,b])=>`${String.fromCharCode(65+a)}=${String.fromCharCode(65+b)}`);
  console.log(`${name}: steps=${positions.join(',')} of ${lattice}; order=${order}; equal=${ties.join(',') || 'none'}; proposed-admission=${within && bounded && positions.every(i=>i>=0)}`);
}

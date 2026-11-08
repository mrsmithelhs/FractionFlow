import { expect, it } from 'vitest';
import { isManagedComparisonDistanceFit, isManagedFamilyFit, matchesManagedActiveHost } from '../src/app/managed-fit.js';

const sample = { font: 16, area: 310, widths: [310,310], htmlScroll:'visible', bodyScroll:'visible', rootScroll:'visible' };
it('admits only the reviewed area, text and scrolling class', () => {
  expect(isManagedComparisonDistanceFit(sample)).toBe(true);
  expect(isManagedComparisonDistanceFit({ ...sample, font:32, area:262, widths:[262,262] })).toBe(false);
  expect(isManagedComparisonDistanceFit({ ...sample, font:32, area:263, widths:[263,263] })).toBe(true);
  expect(isManagedComparisonDistanceFit({ ...sample, font:33 })).toBe(false);
  expect(isManagedComparisonDistanceFit({ ...sample, widths:[310,0] })).toBe(false);
  expect(isManagedComparisonDistanceFit({ ...sample, bodyScroll:'hidden' })).toBe(false);
  expect(isManagedComparisonDistanceFit({ ...sample, rootScroll:'hidden' })).toBe(false);
  expect(isManagedComparisonDistanceFit(null)).toBe(false);
  expect(isManagedFamilyFit(sample,'sum-under-one','phase2-bundle-2')).toBe(true);
  expect(isManagedFamilyFit(sample,'sum-under-one','unknown-condition')).toBe(false);
  expect(isManagedFamilyFit(sample,'symbolic-fraction-comparison','phase2-bundle-2')).toBe(true);
});
it('rejects an ambiguous active host after mounting', () => {
  const host = width => ({isConnected:true,hasAttribute:()=>false,getBoundingClientRect:()=>({width})});
  expect(matchesManagedActiveHost(sample,host(310))).toBe(true);
  expect(matchesManagedActiveHost(sample,host(309))).toBe(false);
  expect(matchesManagedActiveHost(sample,{...host(310),isConnected:false})).toBe(false);
});

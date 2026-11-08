// Comparison/distance class approved for the first Plan 90 batch only.
// The hidden, renderer-independent shell uses the same episode and view CSS as
// the live app. It contributes no scrollable height and is never interactive.
export function measureManagedPracticeFit(appRoot) {
  if (!appRoot?.isConnected || typeof getComputedStyle !== 'function' || !document.scrollingElement) return null;
  const rootStyle = getComputedStyle(appRoot), htmlStyle = getComputedStyle(document.documentElement), bodyStyle = getComputedStyle(document.body);
  const font = Number.parseFloat(htmlStyle.fontSize);
  const contentWidth = appRoot.clientWidth - Number.parseFloat(rootStyle.paddingLeft) - Number.parseFloat(rootStyle.paddingRight);
  if (!Number.isFinite(font) || !Number.isFinite(contentWidth) || contentWidth <= 0
    || !['visible', 'auto', 'scroll'].includes(htmlStyle.overflowY) || !['visible', 'auto', 'scroll'].includes(bodyStyle.overflowY)
    || !['visible', 'auto', 'scroll'].includes(rootStyle.overflowY)) return null;
  const probe = document.createElement('div');
  probe.className = 'app-episode';
  probe.setAttribute('aria-hidden', 'true'); probe.inert = true;
  Object.assign(probe.style, { position: 'absolute', visibility: 'hidden', pointerEvents: 'none', top: '0',
    left: rootStyle.paddingLeft, width: `${contentWidth}px`, maxWidth: '68rem', height: '0', overflow: 'hidden', minHeight: '0' });
  const views = ['app-visual-view', 'app-linear-view'].map(className => {
    const view = document.createElement('section'); view.className = className; probe.appendChild(view); return view;
  });
  try {
    appRoot.appendChild(probe);
    const widths = views.map(view => view.getBoundingClientRect().width);
    const area = Math.min(...widths);
    if (widths.some(width => !Number.isFinite(width) || width <= 0) || !Number.isFinite(area)) return null;
    return { font, widths, area, contentWidth, viewportWidth: innerWidth, viewportHeight: innerHeight,
      htmlScroll: htmlStyle.overflowY, bodyScroll: bodyStyle.overflowY, rootScroll: rootStyle.overflowY };
  } finally { probe.remove(); }
}

export function isManagedComparisonDistanceFit(measurement) {
  return isManagedFamilyFit(measurement, 'symbolic-fraction-comparison');
}

export function isManagedFamilyFit(measurement, typeId, conditionId = 'phase2-bundle-1') {
  if (!measurement || !Number.isFinite(measurement.font) || !Number.isFinite(measurement.area)
    || !Array.isArray(measurement.widths) || measurement.widths.length !== 2
    || measurement.widths.some(width => !Number.isFinite(width) || width <= 0)
    || measurement.area !== Math.min(...measurement.widths)
    || !['visible', 'auto', 'scroll'].includes(measurement.htmlScroll)
    || !['visible', 'auto', 'scroll'].includes(measurement.bodyScroll)
    || !['visible', 'auto', 'scroll'].includes(measurement.rootScroll)) return false;
  const factor = ['symbolic-fraction-comparison','fraction-distance'].includes(typeId) ? 8.2
    : ['bar-to-line-same-amount','sum-under-one'].includes(typeId) ? 12
    : typeId === 'unlike-denominator-subtraction' ? 15 : null;
  if (factor !== 8.2 && !['phase2-bundle-1','phase2-bundle-2','phase2-bundle-3','phase2-bundle-4'].includes(conditionId)) return false;
  return factor !== null && measurement.font >= 16 && measurement.font <= 32 && measurement.area >= 262 && measurement.area >= measurement.font * factor;
}

// A live renderer narrower than the independent probe is ambiguous; do not
// let a scrollbar, host rule, or unexpected wrapper invalidate the receipt.
export function matchesManagedActiveHost(measurement, host, typeId = 'symbolic-fraction-comparison', conditionId = 'phase2-bundle-1', {requireFit = true} = {}) {
  if (!measurement || (requireFit && !isManagedFamilyFit(measurement,typeId,conditionId)) || !host?.isConnected || host.hasAttribute('hidden')) return false;
  const width = host.getBoundingClientRect().width;
  return Number.isFinite(width) && width > 0 && Math.abs(width - measurement.area) <= 0.5;
}

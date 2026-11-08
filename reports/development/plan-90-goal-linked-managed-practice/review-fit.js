// Review-only experiment: candidate bounds have not been approved for learners.
// The live app's own episode/host boxes are measured; no viewport-size lookup is
// used as a substitute for the available working area.
export function measureReviewArea(root) {
  const episode = root.querySelector('.app-episode');
  const hosts = [root.querySelector('.app-visual-view'), root.querySelector('.app-linear-view')];
  if (!episode || hosts.some(host => !host)) return null;
  const wasHidden = episode.hasAttribute('hidden'), oldVisibility = episode.style.visibility;
  try {
    if (wasHidden) { episode.style.visibility = 'hidden'; episode.removeAttribute('hidden'); }
    const widths = hosts.map(host => {
      const hidden = host.hasAttribute('hidden'), old = host.style.visibility;
      try {
        if (hidden) { host.style.visibility = 'hidden'; host.removeAttribute('hidden'); }
        return host.getBoundingClientRect().width;
      } finally { if (hidden) host.setAttribute('hidden', ''); host.style.visibility = old; }
    });
    const font = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const area = Math.min(...widths);
    if (!Number.isFinite(font) || !Number.isFinite(area) || area <= 0 || !document.scrollingElement) return null;
    return { area, font, widths, viewport: [innerWidth, innerHeight], scroll: getComputedStyle(document.documentElement).overflowY,
      bodyScroll: getComputedStyle(document.body).overflowY };
  } finally { if (wasHidden) episode.setAttribute('hidden', ''); episode.style.visibility = oldVisibility; }
}

export function classifyReviewArea(measurement) {
  if (!measurement || !Number.isFinite(measurement.area) || !Number.isFinite(measurement.font)
      || !Array.isArray(measurement.widths) || measurement.widths.length !== 2
      || measurement.widths.some(width => !Number.isFinite(width) || width <= 0)
      || measurement.area !== Math.min(...measurement.widths)
      || !['visible','auto','scroll'].includes(measurement.scroll)
      || !['visible','auto','scroll'].includes(measurement.bodyScroll)) return false;
  return measurement.font >= 16 && measurement.font <= 32
    && measurement.area >= 262 && measurement.area >= measurement.font * 8.2;
}

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const aboutHtml = readFileSync(fileURLToPath(new URL('../public/about.html', import.meta.url)), 'utf8');

describe('Plan 33 static About page', () => {
  it('is self-contained, returns relatively to entry, and presents one accessible static example', () => {
    expect(aboutHtml).toContain('<html lang="en">');
    expect(aboutHtml).toContain('<title>About FractionFlow</title>');
    expect(aboutHtml).toContain('href="./"');
    expect(aboutHtml).toContain('Back to practice');
    expect(aboutHtml).toContain('Three of four equal parts are shaded: three quarters.');
    expect(aboutHtml).toContain('class="bar"');
    expect(aboutHtml).toContain('class="fraction"');
    expect(aboutHtml).toContain('aria-hidden="true"');
    expect(aboutHtml).not.toMatch(/<script\b|https?:\/\//i);
  });

  it('states current practice and narrowly bounded progress privacy behavior', () => {
    expect(aboutHtml).toContain('Practice adding fractions with the same or different denominators.');
    expect(aboutHtml).toContain('More support offers denominator suggestions');
    expect(aboutHtml).toContain('Less support asks you to enter one');
    expect(aboutHtml).toMatch(/choose to keep a small comparison practice record in this browser/i);
    expect(aboutHtml).toMatch(/anyone using this browser may see or add to it/i);
    expect(aboutHtml).toMatch(/stop remembering or clear it, and browser data can be lost/i);
    expect(aboutHtml).toMatch(/unfinished practice and your place in a session are not saved/i);
    expect(aboutHtml).toMatch(/does not use accounts or send learner records to a server/i);
    expect(aboutHtml).toMatch(/website host may handle ordinary technical data/i);
  });
});

import { describe, it, expect } from 'vitest';
import { STRINGS } from '../src/render/strings.js';

describe('Learner Strings Catalog (src/render/strings.js)', () => {
  const FORBIDDEN_SPEC_TERMS = [
    'invariant',
    'transfer',
    'condition',
    'provenance',
    'support configuration',
    'prediction cadence',
    'evidence category',
    'scaffold',
    'D-01',
    'D-02',
    'D-05',
    'CM-01',
    'selector',
    'overlay',
    'representationFacts',
    'wire-data',
  ];

  function extractAllStrings(obj, prefix = '') {
    const results = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        results.push({ path: fullPath, text: value });
      } else if (typeof value === 'function') {
        // Exercise functions with sample inputs
        const sampleCalls = [
          value('left', 2, 3),
          value(12),
          value('left', 12),
          value(4),
          value('2/3', '8/12'),
          value('2/3'),
          value('8/12'),
          value(8, 12),
          value('8/12', '2/3'),
        ];
        for (const call of sampleCalls) {
          if (typeof call === 'string') {
            results.push({ path: fullPath, text: call });
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        results.push(...extractAllStrings(value, fullPath));
      }
    }
    return results;
  }

  it('is deeply frozen to prevent runtime mutation', () => {
    expect(Object.isFrozen(STRINGS)).toBe(true);
    expect(Object.isFrozen(STRINGS.encounter)).toBe(true);
    expect(Object.isFrozen(STRINGS.notice)).toBe(true);
    expect(Object.isFrozen(STRINGS.decide)).toBe(true);
    expect(Object.isFrozen(STRINGS.transform)).toBe(true);
    expect(Object.isFrozen(STRINGS.operate)).toBe(true);
    expect(Object.isFrozen(STRINGS.resolve)).toBe(true);
    expect(Object.isFrozen(STRINGS.reflect)).toBe(true);
    expect(Object.isFrozen(STRINGS.controls)).toBe(true);
    expect(Object.isFrozen(STRINGS.status)).toBe(true);
  });

  it('contains zero specification or research apparatus vocabulary (Presentation Posture Part 2)', () => {
    const allEntries = extractAllStrings(STRINGS);
    expect(allEntries.length).toBeGreaterThan(20);

    for (const { path, text } of allEntries) {
      const lower = text.toLowerCase();
      for (const forbidden of FORBIDDEN_SPEC_TERMS) {
        expect(
          lower.includes(forbidden.toLowerCase()),
          `String at ${path} contains forbidden spec term "${forbidden}": "${text}"`,
        ).toBe(false);
      }
    }
  });

  it('conforms to DECISION-004 working rules for prompt length (~12 words per prompt)', () => {
    const prompts = [
      STRINGS.encounter.prompt,
      STRINGS.notice.prompt,
      STRINGS.decide.prompt,
      STRINGS.transform.prompt('left', 12),
      STRINGS.transform.equivalentNumeratorPrompt(12),
      STRINGS.operate.prompt,
      STRINGS.resolve.prompt,
      STRINGS.reflect.matchingPrompt('2/3'),
      STRINGS.reflect.premisePrompt,
    ];

    for (const prompt of prompts) {
      const wordCount = prompt.trim().split(/\s+/).length;
      // Working rule: about 12 words per prompt, never a wall of text (under 20 words)
      expect(wordCount).toBeLessThanOrEqual(20);
      expect(wordCount).toBeGreaterThanOrEqual(3);
    }
  });

  it('condition A: validLeast is parameterized and does not hardcode canonical 12', () => {
    const fn = STRINGS.decide.validLeast;
    expect(typeof fn).toBe('function');

    const message12 = fn(12);
    const message24 = fn(24);
    const message30 = fn(30);

    expect(message12).toContain('12');
    expect(message24).toContain('24');
    expect(message30).toContain('30');
    expect(message24).not.toContain('12');
  });

  it('condition B: reflect block supports visual matching with distractors (DECISION-012) AND check-the-premise cases (DECISION-026)', () => {
    // DECISION-012 visual matching
    expect(typeof STRINGS.reflect.matchingPrompt).toBe('function');
    expect(typeof STRINGS.reflect.matchingOptionLabel).toBe('function');
    expect(STRINGS.reflect.matchingPrompt('2/3')).toContain('2/3');
    expect(STRINGS.reflect.matchingDistractor).toBeTruthy();

    // DECISION-026 check-the-premise: cases where expected/reassuring answer is not the correct one
    expect(STRINGS.reflect.premisePrompt).toBeTruthy();
    expect(STRINGS.reflect.premiseOptions.yes).toBeTruthy();
    expect(STRINGS.reflect.premiseOptions.no).toBeTruthy();
    expect(STRINGS.reflect.premiseExpectedNo).toBeTruthy();
    expect(STRINGS.reflect.premiseExpectedYes).toBeTruthy();
    expect(STRINGS.reflect.noneOfTheseOption).toBeTruthy();
    expect(STRINGS.reflect.noneOfTheseCorrect).toBeTruthy();
  });

  it('avoids awkward screen-reader fraction voicing (no ${den}ths)', () => {
    const allEntries = extractAllStrings(STRINGS);
    for (const { path, text } of allEntries) {
      // Must not use crude "${den}ths" or "12ths" construction
      expect(text, `${path} contains awkward "ths" construction: "${text}"`).not.toMatch(/\b\d+ths\b/);
    }
  });
});

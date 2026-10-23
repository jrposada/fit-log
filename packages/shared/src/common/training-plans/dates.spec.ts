import { describe, expect, it } from 'vitest';

import { daysBetween, isMonday } from './dates.ts';

describe('isMonday', () => {
  it('is true for a Monday', () => {
    expect(isMonday('2026-10-26')).toBe(true);
  });

  it('is false for a Sunday', () => {
    expect(isMonday('2026-10-25')).toBe(false);
  });

  it('is false for an invalid date', () => {
    expect(isMonday('2026-02-30')).toBe(false);
    expect(isMonday('2026-10-26T00:00:00Z')).toBe(false);
  });
});

describe('daysBetween', () => {
  it('counts calendar days', () => {
    expect(daysBetween('2026-10-26', '2026-11-02')).toBe(7);
  });

  it('is negative when the second date is earlier', () => {
    expect(daysBetween('2026-10-26', '2026-10-25')).toBe(-1);
  });

  it('throws on an invalid date', () => {
    expect(() => daysBetween('2026-10-26', 'not-a-date')).toThrow();
  });
});

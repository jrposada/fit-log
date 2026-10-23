import { describe, expect, it } from 'vitest';

import { addDays, daysBetween, isMonday, startOfIsoWeek } from './dates.ts';

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

describe('addDays', () => {
  it('adds calendar days across a month boundary', () => {
    expect(addDays('2026-10-26', 7)).toBe('2026-11-02');
  });

  it('subtracts with a negative count', () => {
    expect(addDays('2026-10-26', -1)).toBe('2026-10-25');
  });
});

describe('startOfIsoWeek', () => {
  it('is the same day for a Monday', () => {
    expect(startOfIsoWeek('2026-10-26')).toBe('2026-10-26');
  });

  it('is the previous Monday for a Sunday', () => {
    expect(startOfIsoWeek('2026-11-01')).toBe('2026-10-26');
  });
});

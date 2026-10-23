import { describe, expect, it } from 'vitest';

import { planWeekForDate } from './plan-week-for-date.ts';

const START = '2026-10-26';

describe('planWeekForDate', () => {
  it('is week 0 before the start', () => {
    expect(planWeekForDate(START, '2026-10-25')).toBe(0);
  });

  it('is week 1 on the start date', () => {
    expect(planWeekForDate(START, START)).toBe(1);
  });

  it('is still week 1 six days after the start', () => {
    expect(planWeekForDate(START, '2026-11-01')).toBe(1);
  });

  it('is week 2 seven days after the start', () => {
    expect(planWeekForDate(START, '2026-11-02')).toBe(2);
  });
});

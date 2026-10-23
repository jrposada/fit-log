import { daysBetween } from './dates.ts';

/**
 * Plan week `date` falls in; week 0 is any day before the plan starts.
 *
 * @param startDate Enrollment start (`YYYY-MM-DD`).
 * @param date `YYYY-MM-DD`
 */
export function planWeekForDate(startDate: string, date: string): number {
  const offset = daysBetween(startDate, date);
  return offset < 0 ? 0 : Math.floor(offset / 7) + 1;
}

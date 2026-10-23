const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Plan dates are calendar days, so they are read as UTC midnight to keep
 * day math independent of the device timezone and DST. */
function toUtcTime(date: string): number | null {
  if (!DATE_PATTERN.test(date)) {
    return null;
  }
  const time = Date.parse(date);
  // Rejects dates that roll over, e.g. `2026-02-30`.
  if (
    Number.isNaN(time) ||
    new Date(time).toISOString().slice(0, 10) !== date
  ) {
    return null;
  }
  return time;
}

function parseDate(date: string): number {
  const time = toUtcTime(date);
  if (time === null) {
    throw new Error(`Expected a YYYY-MM-DD date but got "${date}"`);
  }
  return time;
}

/** @param date `YYYY-MM-DD` */
export function isMonday(date: string): boolean {
  const time = toUtcTime(date);
  return time !== null && new Date(time).getUTCDay() === 1;
}

/** Calendar days from `a` to `b` (`YYYY-MM-DD`), negative when `b` is earlier. */
export function daysBetween(a: string, b: string): number {
  return Math.round((parseDate(b) - parseDate(a)) / MS_PER_DAY);
}

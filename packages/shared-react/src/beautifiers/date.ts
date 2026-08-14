import { TFunction } from 'i18next';

function formatRelativeDate(isoDate: string, t: TFunction): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('climbing.relative_today');
  if (diffDays === 1) return t('climbing.relative_yesterday');
  if (diffDays < 14)
    return t('climbing.relative_days_ago', { count: diffDays });
  if (diffDays < 60)
    return t('climbing.relative_weeks_ago', {
      count: Math.floor(diffDays / 7),
    });
  return t('climbing.relative_months_ago', {
    count: Math.floor(diffDays / 30),
  });
}

function beautifyDate(date: Date, format: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';

  return format
    .replace(/YYYY/g, getPart('year'))
    .replace(/MM/g, getPart('month'))
    .replace(/DD/g, getPart('day'))
    .replace(/HH/g, getPart('hour'))
    .replace(/mm/g, getPart('minute'))
    .replace(/ss/g, getPart('second'));
}

export { beautifyDate, formatRelativeDate };

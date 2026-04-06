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

export { formatRelativeDate };

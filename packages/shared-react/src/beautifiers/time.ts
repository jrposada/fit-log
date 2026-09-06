import { TFunction } from 'i18next';

function beautifyDuration(totalMinutes: number, t: TFunction): string {
  const roundedMinutes = Math.round(totalMinutes);
  const days = Math.floor(roundedMinutes / (60 * 24));
  const hours = Math.floor((roundedMinutes % (60 * 24)) / 60);
  const minutes = roundedMinutes % 60;

  if (days > 0) {
    return t('climbing.stats_duration_days_hours', { days, hours });
  }

  if (hours === 0) {
    return t('climbing.stats_duration_minutes', { count: minutes });
  }

  return t('climbing.stats_duration_hours_minutes', { hours, minutes });
}

export { beautifyDuration };

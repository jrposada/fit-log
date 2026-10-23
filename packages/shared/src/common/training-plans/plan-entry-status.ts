import { TrainingPlanScheduleEntry } from '../../models/training-plans/training-plan.ts';
import { TrainingSession } from '../../models/training-sessions/training-session.ts';
import { addDays, daysBetween } from './dates.ts';

export type PlanEntryStatus = 'done' | 'skipped' | 'upcoming';

type PlanEntryStatusParams = {
  entry: Pick<TrainingPlanScheduleEntry, 'day' | 'slot'> & {
    sessionTemplateId: string;
  };
  week: number;
  /** Enrollment start, a Monday (`YYYY-MM-DD`). */
  startDate: string;
  /** Local calendar date (`YYYY-MM-DD`). */
  today: string;
  sessions: Pick<TrainingSession, 'planned' | 'endedAt'>[];
};

/** Status of a scheduled entry from the sessions started from it. */
export function planEntryStatus({
  entry,
  week,
  startDate,
  today,
  sessions,
}: PlanEntryStatusParams): PlanEntryStatus {
  const matching = sessions.filter(
    ({ planned }) =>
      planned?.week === week &&
      planned.day === entry.day &&
      planned.slot === entry.slot &&
      planned.sessionTemplateId === entry.sessionTemplateId
  );
  if (matching.some(({ endedAt }) => endedAt)) {
    return 'done';
  }

  const date = addDays(startDate, (week - 1) * 7 + entry.day - 1);
  if (matching.length === 0 && daysBetween(today, date) < 0) {
    return 'skipped';
  }
  return 'upcoming';
}

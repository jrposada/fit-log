import {
  TrainingPlan,
  TrainingPlanBlock,
  TrainingPlanDay,
  TrainingPlanScheduleEntry,
} from '../../models/training-plans/training-plan.ts';
import { daysBetween } from './dates.ts';

export type PlanDay =
  | { status: 'before' }
  | { status: 'after' }
  | {
      status: 'active';
      week: number;
      day: TrainingPlanDay;
      block: TrainingPlanBlock;
      entries: TrainingPlanScheduleEntry[];
    };

/**
 * @param startDate Enrollment start, a Monday (`YYYY-MM-DD`).
 * @param date Local calendar date to resolve (`YYYY-MM-DD`).
 */
export function resolvePlanDay(
  plan: TrainingPlan,
  startDate: string,
  date: string
): PlanDay {
  const offset = daysBetween(startDate, date);
  if (offset < 0) {
    return { status: 'before' };
  }

  const week = Math.floor(offset / 7) + 1;
  if (week > plan.durationWeeks) {
    return { status: 'after' };
  }

  const block = plan.blocks.find(({ weeks }) => weeks.includes(week));
  if (!block) {
    throw new Error(`Week ${week} does not belong to any block`);
  }

  // The start is a Monday, so the offset within the week is the ISO weekday.
  const day = ((offset % 7) + 1) as TrainingPlanDay;
  const entries = plan.schedule.filter(
    (entry) => entry.blockId === block.id && entry.day === day
  );
  return { status: 'active', week, day, block, entries };
}

import {
  TrainingPlan,
  TrainingPlanSessionTemplateType,
} from '../../models/training-plans/training-plan.ts';
import {
  TrainingSessionItemLog,
  TrainingSessionPlanned,
} from '../../models/training-sessions/training-session.ts';
import { Sport } from '../sports/sports.ts';

export const SPORT_BY_SESSION_TEMPLATE_TYPE: Record<
  TrainingPlanSessionTemplateType,
  Sport
> = {
  climb: 'climbing',
  gym: 'gym',
};

/**
 * Checks a planned session against its plan: the template is scheduled on
 * that week/day/slot, `sport` matches the template type and every item log
 * points at a template item.
 *
 * @returns An error message, or `null` when valid.
 */
export function validatePlannedSession(
  plan: TrainingPlan,
  planned: Omit<TrainingSessionPlanned, 'enrollment'>,
  sport: Sport,
  itemLogs: Pick<TrainingSessionItemLog, 'itemOrder' | 'exerciseId'>[]
): string | null {
  const { sessionTemplateId, week, day, slot } = planned;

  if (week < 1 || week > plan.durationWeeks) {
    return `Week ${week} is outside 1-${plan.durationWeeks}`;
  }

  const block = plan.blocks.find(({ weeks }) => weeks.includes(week));
  const isScheduled = plan.schedule.some(
    (entry) =>
      entry.blockId === block?.id &&
      entry.day === day &&
      entry.slot === slot &&
      entry.sessionTemplateId === sessionTemplateId
  );
  const template = plan.sessionTemplates.find(
    ({ id }) => id === sessionTemplateId
  );
  if (!isScheduled || !template) {
    return `Session template ${sessionTemplateId} is not scheduled on week ${week} day ${day} slot ${slot}`;
  }

  if (SPORT_BY_SESSION_TEMPLATE_TYPE[template.type] !== sport) {
    return `Sport ${sport} does not match session template type ${template.type}`;
  }

  const loggedOrders = new Set<number>();
  for (const { itemOrder, exerciseId } of itemLogs) {
    const item = template.items.find(({ order }) => order === itemOrder);
    if (!item) {
      return `Item ${itemOrder} not found in session template ${sessionTemplateId}`;
    }
    if (item.exerciseId !== exerciseId) {
      return `Item ${itemOrder} of session template ${sessionTemplateId} is ${item.exerciseId}, not ${exerciseId}`;
    }
    if (loggedOrders.has(itemOrder)) {
      return `Item ${itemOrder} is logged more than once`;
    }
    loggedOrders.add(itemOrder);
  }

  return null;
}

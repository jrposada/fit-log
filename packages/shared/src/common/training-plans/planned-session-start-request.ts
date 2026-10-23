import { TrainingPlanSessionTemplate } from '../../models/training-plans/training-plan.ts';
import { TrainingSessionPlanned } from '../../models/training-sessions/training-session.ts';
import { TrainingSessionsPutRequest } from '../../models/training-sessions/training-sessions-put.ts';
import { SPORT_BY_SESSION_TEMPLATE_TYPE } from './validate-planned-session.ts';

/** Request that starts a session from a scheduled plan entry. */
export function plannedSessionStartRequest(
  template: TrainingPlanSessionTemplate,
  planned: TrainingSessionPlanned,
  now: Date
): TrainingSessionsPutRequest {
  return {
    sport: SPORT_BY_SESSION_TEMPLATE_TYPE[template.type],
    title: template.name,
    startedAt: now.toUTCString(),
    location: null,
    climbHistories: [],
    planned,
    itemLogs: [],
  };
}

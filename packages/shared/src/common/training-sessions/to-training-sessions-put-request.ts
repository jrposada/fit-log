import { TrainingSession } from '../../models/training-sessions/training-session.ts';
import { TrainingSessionsPutRequest } from '../../models/training-sessions/training-sessions-put.ts';

/** Full-replace request for an existing session; populated references go
 * back as ids. */
export function toTrainingSessionsPutRequest(
  session: TrainingSession
): TrainingSessionsPutRequest {
  return {
    ...session,
    currentClimb: session.currentClimb?.id,
    location: session.location?.id ?? null,
    climbHistories: session.climbHistories.map((item) => item.id),
  };
}

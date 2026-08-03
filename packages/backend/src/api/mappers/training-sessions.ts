import type { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';

import type { WithDepopulatedRefs } from '../../data/infrastructure/with-depopulated-refs.ts';
import type {
  ITrainingSession,
  TrainingSessionRefs,
} from '../../data/models/training-session.ts';
import type { ValidTrainingSession } from '../../services/training-session.ts';
import { toApiDepopulatedClimbHistory } from './climb-histories.ts';
import { toApiDepopulatedLocation } from './locations.ts';

function toApiDepopulatedTrainingSession(model: ITrainingSession): Omit<
  WithDepopulatedRefs<TrainingSession, TrainingSessionRefs>,
  'location'
> & {
  location?: string;
} {
  return {
    /* Data */
    id: model._id.toString(),
    title: model.title,
    notes: model.notes,
    startedAt: model.startedAt.toISOString(),
    endedAt: model.endedAt ? model.endedAt.toISOString() : undefined,
    lastActivityAt: model.lastActivityAt.toISOString(),

    /* Ownership */
    owner: model.owner.toString(),

    /* References */
    location: model.location ? model.location.toString() : undefined,
    climbHistories: model.climbHistories.map((id) => id.toString()),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiTrainingSession(model: ValidTrainingSession): TrainingSession {
  return {
    /* Data */
    id: model._id.toString(),
    title: model.title,
    notes: model.notes,
    startedAt: model.startedAt.toISOString(),
    endedAt: model.endedAt ? model.endedAt.toISOString() : undefined,
    lastActivityAt: model.lastActivityAt.toISOString(),

    /* Ownership */
    owner: model.owner.toString(),

    /* References */
    location: model.location
      ? toApiDepopulatedLocation(model.location)
      : undefined,
    climbHistories: model.climbHistories.map(toApiDepopulatedClimbHistory),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedTrainingSession, toApiTrainingSession };

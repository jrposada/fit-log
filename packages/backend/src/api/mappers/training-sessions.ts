import type { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import type { MergeType } from 'mongoose';

import type { WithRequiredRefs } from '../../data/infrastructure/with-required-refs.ts';
import type {
  ClimbHistoryRequiredRefs,
  IClimbHistory,
} from '../../data/models/climb-history.ts';
import type { ILocation } from '../../data/models/location.ts';
import type { ITrainingSession } from '../../data/models/training-session.ts';
import { toApiDepopulatedClimbHistory } from './climb-histories.ts';
import { toApiDepopulatedLocation } from './locations.ts';

function toApiDepopulatedTrainingSession(model: ITrainingSession): Omit<
  TrainingSession,
  'location' | 'climbHistories'
> & {
  location?: string;
  climbHistories: string[];
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

function toApiTrainingSession(
  model: MergeType<
    ITrainingSession,
    {
      climbHistories: WithRequiredRefs<
        IClimbHistory,
        ClimbHistoryRequiredRefs
      >[];
      location: ILocation | null;
    }
  >
): TrainingSession {
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

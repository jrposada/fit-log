import type { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import type { MergeType } from 'mongoose';

import type { WithPopulatedOwnership } from '../../auth/ownership-populate.ts';
import type { IClimb } from '../../models/climb.ts';
import type { ILocation } from '../../models/location.ts';
import type { ITrainingSession } from '../../models/training-session.ts';
import type { WithRequiredRefs } from '../../utils/types.ts';
import { toApiDepopulatedClimb } from '../climbs/climbs-mapper.ts';
import { toApiDepopulatedLocation } from '../locations/locations-mapper.ts';

function toApiTrainingSession(
  model: MergeType<
    WithPopulatedOwnership<ITrainingSession>,
    {
      climbs: WithRequiredRefs<IClimb>[];
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

    /* References */
    location: model.location
      ? toApiDepopulatedLocation(model.location)
      : undefined,
    climbs: model.climbs.map(toApiDepopulatedClimb),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiTrainingSession };

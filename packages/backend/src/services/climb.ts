import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { MergeType } from 'mongoose';
import { Types } from 'mongoose';

import type {
  PopulatedOwnership,
  WithPopulatedOwnership,
} from '../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../auth/ownership-populate.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import type { IClimb } from '../models/climb.ts';
import { Climb } from '../models/climb.ts';
import type { ClimbHistoryStatus } from '../models/climb-history.ts';
import { ClimbHistory } from '../models/climb-history.ts';
import type { IImage } from '../models/image.ts';
import type { ILocation } from '../models/location.ts';
import type { ISector } from '../models/sector.ts';
import type { IUser } from '../models/user.ts';
import {
  addOrUpdateCollaborator,
  removeCollaborator,
} from '../utils/collaborator-mutators.ts';
import type { WithRequiredRefs } from '../utils/types.ts';
import { upsertOwnedDocument } from '../utils/upsert-owned-document.ts';

function hasRequiredRefs(model: IClimb): model is WithRequiredRefs<IClimb> {
  return model.image != null && model.location != null && model.sector != null;
}

/** Fully populated climb, as returned to API mappers. */
type ValidClimb = MergeType<
  WithPopulatedOwnership<IClimb>,
  {
    image: IImage;
    location: ILocation;
    sector: MergeType<ISector, { images: IImage[] }>;
  }
>;

type ClimbStatusInfo = {
  status: ClimbHistoryStatus;
  isProject: boolean;
  attempts?: number;
  lastTriedDate?: string;
};

type SearchClimbsOptions = {
  limit?: number;
  locationId?: string;
  grade?: string[];
  search?: string;
};

/**
 * Searches climbs across all owners, annotated with the requesting user's
 * own try/project status per climb (via a separate, unscoped status lookup).
 */
async function searchClimbs(options: SearchClimbsOptions): Promise<{
  climbs: ValidClimb[];
  statusByClimbId: Map<string, ClimbStatusInfo>;
}> {
  const { limit, locationId, grade, search } = options;

  const query = Climb.find({
    ...(locationId ? { location: locationId } : {}),
    ...(grade && grade.length > 0 ? { grade: { $in: grade } } : {}),
    ...(search && search.trim()
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { grade: { $regex: search, $options: 'i' } },
          ],
        }
      : {}),
  })
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      image: IImage;
      location: ILocation;
    }>(['image', 'location'])
    .populate<{
      sector: MergeType<ISector, { images: IImage[] }>;
    }>({
      path: 'sector',
      populate: ['images'],
    });

  if (limit) {
    query.limit(limit);
  }

  const climbs = await query;
  const climbIds = climbs.map((c) => c._id);

  const histories = await ClimbHistory.find({
    climb: { $in: climbIds },
  });

  const statusByClimbId = new Map<string, ClimbStatusInfo>(
    histories.flatMap((h) => {
      if (h.climb == null) return [];

      const totalAttempts = h.tries.reduce(
        (sum, t) => sum + (t.attempts ?? 0),
        0
      );
      const lastTry = h.tries[h.tries.length - 1];

      return [
        [
          h.climb.toString(),
          {
            status: h.status,
            isProject: h.isProject,
            attempts: totalAttempts || undefined,
            lastTriedDate: lastTry?.date
              ? lastTry.date.toISOString()
              : undefined,
          },
        ] as const,
      ];
    })
  );

  return { climbs, statusByClimbId };
}

type UpsertClimbInput = {
  id?: string;

  name: string;
  grade: string;
  description?: string;
  holds: IClimb['holds'];
  spline: IClimb['spline'];

  image: string;
  sector: string;
  location: string;
};

async function upsertClimb(
  user: IUser,
  input: UpsertClimbInput
): Promise<ValidClimb> {
  const climb = await upsertOwnedDocument(Climb, input.id, user, {
    /* Data */
    name: input.name,
    grade: input.grade,
    description: input.description,
    holds: input.holds,
    spline: input.spline,

    /* References */
    image: new Types.ObjectId(input.image),
    sector: new Types.ObjectId(input.sector),
    location: new Types.ObjectId(input.location),
  })
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      image: IImage;
      location: ILocation;
    }>(['image', 'location'])
    .populate<{
      sector: MergeType<ISector, { images: IImage[] }>;
    }>({
      path: 'sector',
      populate: ['images'],
    });

  if (!climb) {
    throw new ResourceNotFound(
      `Climb ${input.id ?? ''} not found or not editable`
    );
  }

  return climb;
}

async function addClimbCollaborator(
  user: IUser,
  id: string,
  granteeId: string,
  permission: CollaboratorPermission
): Promise<ValidClimb> {
  const climb = await addOrUpdateCollaborator(
    Climb,
    id,
    granteeId,
    permission,
    user
  )
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{ image: IImage; location: ILocation }>(['image', 'location'])
    .populate<{ sector: MergeType<ISector, { images: IImage[] }> }>({
      path: 'sector',
      populate: ['images'],
    });

  if (!climb) {
    throw new ResourceNotFound(`Climb ${id} not found or not editable`);
  }

  return climb;
}

async function removeClimbCollaborator(
  user: IUser,
  id: string,
  granteeId: string
): Promise<ValidClimb> {
  const climb = await removeCollaborator(Climb, id, granteeId, user)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{ image: IImage; location: ILocation }>(['image', 'location'])
    .populate<{ sector: MergeType<ISector, { images: IImage[] }> }>({
      path: 'sector',
      populate: ['images'],
    });

  if (!climb) {
    throw new ResourceNotFound(`Climb ${id} not found or not editable`);
  }

  return climb;
}

export {
  addClimbCollaborator,
  hasRequiredRefs,
  removeClimbCollaborator,
  searchClimbs,
  upsertClimb,
};
export type { ClimbStatusInfo, ValidClimb };

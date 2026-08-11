import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { MergeType } from 'mongoose';
import { Types } from 'mongoose';

import { deletableBy } from '../auth/deletable-filter.ts';
import type {
  PopulatedOwnership,
  WithPopulatedOwnership,
} from '../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../auth/ownership-populate.ts';
import { removeCollaborator } from '../data/infrastructure/remove-collaborator.ts';
import { upsertCollaborator } from '../data/infrastructure/upsert-collaborator.ts';
import { upsertOwnedDocument } from '../data/infrastructure/upsert-owned-document.ts';
import type { WithRequiredRefs } from '../data/infrastructure/with-required-refs.ts';
import type { WithRequiredOwnership } from '../data/models/_collaborator.ts';
import type { ClimbRequiredRefs, IClimb } from '../data/models/climb.ts';
import { Climb } from '../data/models/climb.ts';
import type { ClimbHistoryStatus } from '../data/models/climb-history.ts';
import { ClimbHistory } from '../data/models/climb-history.ts';
import type { IImage } from '../data/models/image.ts';
import type { ILocation } from '../data/models/location.ts';
import type { IModel3d } from '../data/models/model-3d.ts';
import type { ISector } from '../data/models/sector.ts';
import type { IUser } from '../data/models/user.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';

function hasRequiredRefs(
  model: IClimb
): model is WithRequiredOwnership<WithRequiredRefs<IClimb, ClimbRequiredRefs>> {
  return model.location != null && model.sector != null;
}

/** Fully populated climb, as returned to API mappers. */
type ValidClimb = MergeType<
  WithPopulatedOwnership<IClimb>,
  {
    image: WithRequiredOwnership<IImage> | null;
    location: WithRequiredOwnership<ILocation>;
    sector: WithRequiredOwnership<
      MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
    >;
    model3d: WithRequiredOwnership<IModel3d> | null;
  }
>;

type ClimbStatusInfo = {
  status: ClimbHistoryStatus;
  isProject: boolean;
  attempts?: number;
  lastTriedDate?: string;
};

type FindClimbsOptions = {
  limit?: number;
  locationId?: string;
  grade?: string[];
  search?: string;
};

function findClimbsQuery(options: FindClimbsOptions) {
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
      image: WithRequiredOwnership<IImage> | null;
      location: WithRequiredOwnership<ILocation>;
      model3d: WithRequiredOwnership<IModel3d> | null;
    }>(['image', 'location', 'model3d'])
    .populate<{
      sector: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >;
    }>({
      path: 'sector',
      populate: ['images'],
    });

  if (limit) {
    query.limit(limit);
  }

  return query;
}

const DEFAULT_LIMIT = 20;

/** Keyset cursor for the climbs list, in decoded (plain JSON) form. */
type ClimbsCursor = { createdAt: string; id: string };

type GetClimbsOptions = FindClimbsOptions & {
  cursor?: ClimbsCursor | null;
};

/** Gets climbs across all owners, filtered by the given criteria. */
async function getClimbs(
  options: GetClimbsOptions
): Promise<{ climbs: ValidClimb[]; nextCursor: ClimbsCursor | null }> {
  const { limit, cursor, locationId, grade, search } = options;

  const andClauses: Record<string, unknown>[] = [];
  if (search && search.trim()) {
    andClauses.push({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { grade: { $regex: search, $options: 'i' } },
      ],
    });
  }
  if (cursor) {
    const cursorDate = new Date(cursor.createdAt);
    const cursorId = new Types.ObjectId(cursor.id);
    andClauses.push({
      $or: [
        { createdAt: { $lt: cursorDate } },
        { createdAt: cursorDate, _id: { $lt: cursorId } },
      ],
    });
  }

  const pageSize = limit ?? DEFAULT_LIMIT;

  const climbs = await Climb.find({
    ...(locationId ? { location: locationId } : {}),
    ...(grade && grade.length > 0 ? { grade: { $in: grade } } : {}),
    ...(andClauses.length > 0 ? { $and: andClauses } : {}),
  })
    .sort({ createdAt: -1, _id: -1 })
    .limit(pageSize + 1)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      image: WithRequiredOwnership<IImage> | null;
      location: WithRequiredOwnership<ILocation>;
      model3d: WithRequiredOwnership<IModel3d> | null;
    }>(['image', 'location', 'model3d'])
    .populate<{
      sector: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >;
    }>({
      path: 'sector',
      populate: ['images'],
    });

  const hasMore = climbs.length > pageSize;
  const pageClimbs = hasMore ? climbs.slice(0, pageSize) : climbs;

  const last = pageClimbs[pageClimbs.length - 1];
  const nextCursor =
    hasMore && last
      ? { createdAt: last.createdAt.toISOString(), id: last._id.toString() }
      : null;

  return { climbs: pageClimbs, nextCursor };
}

async function getClimbById(id: string): Promise<ValidClimb> {
  const climb = await Climb.findById(id)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      image: WithRequiredOwnership<IImage> | null;
      location: WithRequiredOwnership<ILocation>;
      model3d: WithRequiredOwnership<IModel3d> | null;
    }>(['image', 'location', 'model3d'])
    .populate<{
      sector: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >;
    }>({
      path: 'sector',
      populate: ['images'],
    });

  if (!climb) {
    throw new ResourceNotFound(`Climb with id ${id} not found`);
  }

  return climb;
}

/**
 * Searches climbs across all owners, annotated with the requesting user's
 * own try/project status per climb (via a separate, unscoped status lookup).
 */
async function searchClimbs(options: FindClimbsOptions): Promise<{
  climbs: ValidClimb[];
  statusByClimbId: Map<string, ClimbStatusInfo>;
}> {
  const climbs = await findClimbsQuery(options);
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

  image?: string | null;
  sector: string;
  location: string;
  model3d?: string | null;
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
    image: input.image ? new Types.ObjectId(input.image) : null,
    sector: new Types.ObjectId(input.sector),
    location: new Types.ObjectId(input.location),
    model3d: input.model3d ? new Types.ObjectId(input.model3d) : null,
  })
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      image: WithRequiredOwnership<IImage> | null;
      location: WithRequiredOwnership<ILocation>;
      model3d: WithRequiredOwnership<IModel3d> | null;
    }>(['image', 'location', 'model3d'])
    .populate<{
      sector: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >;
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
  const climb = await upsertCollaborator(Climb, id, granteeId, permission, user)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      image: WithRequiredOwnership<IImage> | null;
      location: WithRequiredOwnership<ILocation>;
      model3d: WithRequiredOwnership<IModel3d> | null;
    }>(['image', 'location', 'model3d'])
    .populate<{
      sector: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >;
    }>({
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
    .populate<{
      image: WithRequiredOwnership<IImage> | null;
      location: WithRequiredOwnership<ILocation>;
      model3d: WithRequiredOwnership<IModel3d> | null;
    }>(['image', 'location', 'model3d'])
    .populate<{
      sector: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >;
    }>({
      path: 'sector',
      populate: ['images'],
    });

  if (!climb) {
    throw new ResourceNotFound(`Climb ${id} not found or not editable`);
  }

  return climb;
}

async function deleteClimb(user: IUser, id: string): Promise<void> {
  const result = await Climb.deleteOne({ _id: id, ...deletableBy(user) });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(`Climb ${id} not found or not deletable`);
  }
}

export {
  addClimbCollaborator,
  deleteClimb,
  getClimbById,
  getClimbs,
  hasRequiredRefs,
  removeClimbCollaborator,
  searchClimbs,
  upsertClimb,
};
export type { ClimbsCursor, ClimbStatusInfo, ValidClimb };

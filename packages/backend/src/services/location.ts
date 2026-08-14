import type { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { MergeType } from 'mongoose';
import { Types } from 'mongoose';

import { deletableBy } from '../auth/deletable-filter.ts';
import type {
  PopulatedOwnership,
  WithPopulatedOwnership,
} from '../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../auth/ownership-populate.ts';
import type { EntityAttributes } from '../data/infrastructure/entity-attributes.ts';
import { removeCollaborator } from '../data/infrastructure/remove-collaborator.ts';
import { upsertCollaborator } from '../data/infrastructure/upsert-collaborator.ts';
import { upsertOwnedDocument } from '../data/infrastructure/upsert-owned-document.ts';
import type {
  WithOwnership,
  WithRequiredOwnership,
} from '../data/models/_collaborator.ts';
import type { IImage } from '../data/models/image.ts';
import type { ILocation } from '../data/models/location.ts';
import { Location } from '../data/models/location.ts';
import type { ISector } from '../data/models/sector.ts';
import type { IUser } from '../data/models/user.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import { getSportsByLocationId } from './feed.ts';

/** Fully populated location, as returned to API mappers. */
type ValidLocation = MergeType<
  WithPopulatedOwnership<ILocation>,
  {
    sectors: WithRequiredOwnership<
      MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
    >[];
  }
>;

/** A location annotated with the requesting owner's derived sport(s). */
type LocationWithSports = MergeType<ValidLocation, { sports: Sport[] }>;

function attachSports(
  locations: ValidLocation[],
  sportsByLocationId: Map<string, Sport[]>
): LocationWithSports[] {
  return locations.map((location) =>
    Object.assign(location, {
      sports: sportsByLocationId.get(location._id.toString()) ?? [],
    })
  );
}

const DEFAULT_LIMIT = 20;

/** Keyset cursor for the locations list, in decoded (plain JSON) form. */
type LocationsCursor = { createdAt: string; id: string };

type FindLocationsOptions = {
  limit?: number;
  cursor?: LocationsCursor | null;
};

async function getLocations(
  ownerId: Types.ObjectId,
  options: FindLocationsOptions
): Promise<{
  locations: LocationWithSports[];
  nextCursor: LocationsCursor | null;
}> {
  const { limit, cursor } = options;

  const filter: Record<string, unknown> = {};
  if (cursor) {
    const cursorDate = new Date(cursor.createdAt);
    const cursorId = new Types.ObjectId(cursor.id);
    filter.$or = [
      { createdAt: { $lt: cursorDate } },
      { createdAt: cursorDate, _id: { $lt: cursorId } },
    ];
  }

  const pageSize = limit ?? DEFAULT_LIMIT;

  const [locations, sportsByLocationId] = await Promise.all([
    Location.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(pageSize + 1)
      .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
      .populate<{
        sectors: WithRequiredOwnership<
          MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
        >[];
      }>({
        path: 'sectors',
        populate: ['images'],
      }),
    getSportsByLocationId(ownerId),
  ]);

  const hasMore = locations.length > pageSize;
  const pageLocations = hasMore ? locations.slice(0, pageSize) : locations;

  const last = pageLocations[pageLocations.length - 1];
  const nextCursor =
    hasMore && last
      ? { createdAt: last.createdAt.toISOString(), id: last._id.toString() }
      : null;

  return {
    locations: attachSports(pageLocations, sportsByLocationId),
    nextCursor,
  };
}

async function getLocationById(
  ownerId: Types.ObjectId,
  id: string
): Promise<LocationWithSports> {
  const [location, sportsByLocationId] = await Promise.all([
    Location.findById(id)
      .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
      .populate<{
        sectors: WithRequiredOwnership<
          MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
        >[];
      }>({
        path: 'sectors',
        populate: ['images'],
      }),
    getSportsByLocationId(ownerId),
  ]);

  if (!location) {
    throw new ResourceNotFound(`Location with id ${id} not found`);
  }

  return attachSports([location], sportsByLocationId)[0]!;
}

/**
 * `source` is a provenance field set internally (e.g. by an import
 * pipeline), never by the PUT endpoint — excluded here alongside the
 * ownership fields, which are likewise never client-supplied (collaborators
 * are managed via their own endpoints; see `upsertOwnedDocument`).
 */
type UpsertLocationInput = Omit<
  EntityAttributes<ILocation>,
  keyof WithOwnership | 'source'
> & { id?: string };

async function upsertLocation(
  user: IUser,
  input: UpsertLocationInput
): Promise<ValidLocation> {
  const { id, ...data } = input;

  const location = await upsertOwnedDocument(Location, id, user, data)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      sectors: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >[];
    }>({
      path: 'sectors',
      populate: ['images'],
    });

  if (!location) {
    throw new ResourceNotFound(
      `Location ${id ?? ''} not found or not editable`
    );
  }

  return location;
}

async function addLocationCollaborator(
  user: IUser,
  id: string,
  granteeId: string,
  permission: CollaboratorPermission
): Promise<ValidLocation> {
  const location = await upsertCollaborator(
    Location,
    id,
    granteeId,
    permission,
    user
  )
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      sectors: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >[];
    }>({
      path: 'sectors',
      populate: ['images'],
    });

  if (!location) {
    throw new ResourceNotFound(`Location ${id} not found or not editable`);
  }

  return location;
}

async function removeLocationCollaborator(
  user: IUser,
  id: string,
  granteeId: string
): Promise<ValidLocation> {
  const location = await removeCollaborator(Location, id, granteeId, user)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      sectors: WithRequiredOwnership<
        MergeType<ISector, { images: WithRequiredOwnership<IImage>[] }>
      >[];
    }>({
      path: 'sectors',
      populate: ['images'],
    });

  if (!location) {
    throw new ResourceNotFound(`Location ${id} not found or not editable`);
  }

  return location;
}

async function deleteLocation(user: IUser, id: string): Promise<void> {
  const result = await Location.deleteOne({ _id: id, ...deletableBy(user) });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(`Location ${id} not found or not deletable`);
  }
}

export {
  addLocationCollaborator,
  deleteLocation,
  getLocationById,
  getLocations,
  removeLocationCollaborator,
  upsertLocation,
};
export type {
  LocationsCursor,
  LocationWithSports,
  UpsertLocationInput,
  ValidLocation,
};

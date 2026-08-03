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
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import type { IImage } from '../models/image.ts';
import type { ILocation } from '../models/location.ts';
import { Location } from '../models/location.ts';
import type { ISector } from '../models/sector.ts';
import type { IUser } from '../models/user.ts';
import {
  addOrUpdateCollaborator,
  removeCollaborator,
} from '../utils/collaborator-mutators.ts';
import { upsertOwnedDocument } from '../utils/upsert-owned-document.ts';
import { getSportsByLocationId } from './feed.ts';

/** Fully populated location, as returned to API mappers. */
type ValidLocation = MergeType<
  WithPopulatedOwnership<ILocation>,
  { sectors: MergeType<ISector, { images: IImage[] }>[] }
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
        sectors: MergeType<ISector, { images: IImage[] }>[];
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
        sectors: MergeType<ISector, { images: IImage[] }>[];
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

type UpsertLocationInput = {
  id?: string;

  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  googleMapsId?: string;

  sectors: string[];
};

async function upsertLocation(
  user: IUser,
  input: UpsertLocationInput
): Promise<ValidLocation> {
  const location = await upsertOwnedDocument(Location, input.id, user, {
    /* Data */
    name: input.name,
    description: input.description,
    latitude: input.latitude,
    longitude: input.longitude,
    googleMapsId: input.googleMapsId,

    /* References */
    sectors: input.sectors.map((sectorId) => new Types.ObjectId(sectorId)),
  })
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      sectors: MergeType<ISector, { images: IImage[] }>[];
    }>({
      path: 'sectors',
      populate: ['images'],
    });

  if (!location) {
    throw new ResourceNotFound(
      `Location ${input.id ?? ''} not found or not editable`
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
  const location = await addOrUpdateCollaborator(
    Location,
    id,
    granteeId,
    permission,
    user
  )
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      sectors: MergeType<ISector, { images: IImage[] }>[];
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
      sectors: MergeType<ISector, { images: IImage[] }>[];
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
export type { LocationsCursor, LocationWithSports, ValidLocation };

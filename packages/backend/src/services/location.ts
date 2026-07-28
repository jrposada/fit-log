import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { MergeType } from 'mongoose';
import { Types } from 'mongoose';

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

/** Fully populated location, as returned to API mappers. */
type ValidLocation = MergeType<
  WithPopulatedOwnership<ILocation>,
  { sectors: MergeType<ISector, { images: IImage[] }>[] }
>;

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

export { addLocationCollaborator, removeLocationCollaborator, upsertLocation };
export type { ValidLocation };

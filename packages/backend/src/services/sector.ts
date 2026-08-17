import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { ClientSession, MergeType } from 'mongoose';
import mongoose from 'mongoose';

import { deletableBy } from '../auth/deletable-filter.ts';
import type {
  PopulatedOwnership,
  WithPopulatedOwnership,
} from '../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../auth/ownership-populate.ts';
import type { BatchUpsertOwnedItem } from '../data/infrastructure/batch-upsert-owned-document.ts';
import { batchUpsertOwnedDocument } from '../data/infrastructure/batch-upsert-owned-document.ts';
import type { EntityAttributes } from '../data/infrastructure/entity-attributes.ts';
import { removeCollaborator } from '../data/infrastructure/remove-collaborator.ts';
import { upsertCollaborator } from '../data/infrastructure/upsert-collaborator.ts';
import { upsertOwnedDocument } from '../data/infrastructure/upsert-owned-document.ts';
import type {
  WithOwnership,
  WithRequiredOwnership,
} from '../data/models/_collaborator.ts';
import type { IClimb } from '../data/models/climb.ts';
import type { IImage } from '../data/models/image.ts';
import type { IModel3d } from '../data/models/model-3d.ts';
import type { ISector } from '../data/models/sector.ts';
import { Sector } from '../data/models/sector.ts';
import type { IUser } from '../data/models/user.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';

/** Fully populated sector, as returned to API mappers. */
type ValidSector = MergeType<
  WithPopulatedOwnership<ISector>,
  {
    climbs: IClimb[];
    images: WithRequiredOwnership<IImage>[];
    models3d: WithRequiredOwnership<IModel3d>[];
  }
>;

/**
 * `source` is a provenance field set internally (e.g. by an import
 * pipeline), never by the PUT endpoint — excluded here alongside the
 * ownership fields, which are likewise never client-supplied (collaborators
 * are managed via their own endpoints; see `upsertOwnedDocument`).
 */
type UpsertSectorInput = Omit<
  EntityAttributes<ISector>,
  keyof WithOwnership | 'source'
> & { id?: string };

async function upsertSector(
  user: IUser,
  input: UpsertSectorInput
): Promise<ValidSector> {
  const { id, ...data } = input;

  const sector = await upsertOwnedDocument(Sector, id, user, data)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      climbs: IClimb[];
      images: WithRequiredOwnership<IImage>[];
      models3d: WithRequiredOwnership<IModel3d>[];
    }>(['images', 'models3d', 'climbs']);

  if (!sector) {
    throw new ResourceNotFound(`Sector ${id ?? ''} not found or not editable`);
  }

  return sector;
}

async function batchUpsertSectorsInSession(
  session: ClientSession,
  items: BatchUpsertOwnedItem<typeof Sector.prototype>[],
  user: IUser
): Promise<ValidSector[]> {
  const { ids, matchedCount } = await batchUpsertOwnedDocument(
    Sector,
    items,
    user,
    session
  );

  if (matchedCount < items.length) {
    throw new ResourceNotFound(
      `Some sectors not found or not editable (matched ${matchedCount}/${items.length})`
    );
  }

  const savedSectors = await Sector.find({ _id: { $in: ids } })
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      climbs: IClimb[];
      images: WithRequiredOwnership<IImage>[];
      models3d: WithRequiredOwnership<IModel3d>[];
    }>(['images', 'models3d', 'climbs'])
    .session(session);

  // Preserve input order so the response aligns with the request batch.
  const byId = new Map(savedSectors.map((s) => [s._id.toString(), s]));
  return ids.flatMap((id) => {
    const s = byId.get(id.toString());
    return s ? [s] : [];
  });
}

/**
 * Batched ownership-aware sector upsert, run inside a mongoose transaction
 * (auto-retried on transient transaction errors via `withTransaction`).
 */
async function batchUpsertSectors(
  user: IUser,
  items: UpsertSectorInput[]
): Promise<ValidSector[]> {
  const bulkItems = items.map<BatchUpsertOwnedItem<typeof Sector.prototype>>(
    ({ id, ...data }) => ({ id, data })
  );

  const session = await mongoose.startSession();
  try {
    return await session.withTransaction((s) =>
      batchUpsertSectorsInSession(s, bulkItems, user)
    );
  } finally {
    await session.endSession();
  }
}

async function addSectorCollaborator(
  user: IUser,
  id: string,
  granteeId: string,
  permission: CollaboratorPermission
): Promise<ValidSector> {
  const sector = await upsertCollaborator(
    Sector,
    id,
    granteeId,
    permission,
    user
  )
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      climbs: IClimb[];
      images: WithRequiredOwnership<IImage>[];
      models3d: WithRequiredOwnership<IModel3d>[];
    }>(['images', 'models3d', 'climbs']);

  if (!sector) {
    throw new ResourceNotFound(`Sector ${id} not found or not editable`);
  }

  return sector;
}

async function removeSectorCollaborator(
  user: IUser,
  id: string,
  granteeId: string
): Promise<ValidSector> {
  const sector = await removeCollaborator(Sector, id, granteeId, user)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      climbs: IClimb[];
      images: WithRequiredOwnership<IImage>[];
      models3d: WithRequiredOwnership<IModel3d>[];
    }>(['images', 'models3d', 'climbs']);

  if (!sector) {
    throw new ResourceNotFound(`Sector ${id} not found or not editable`);
  }

  return sector;
}

async function deleteSector(user: IUser, id: string): Promise<void> {
  const result = await Sector.deleteOne({ _id: id, ...deletableBy(user) });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(`Sector ${id} not found or not deletable`);
  }
}

async function batchDeleteSectors(user: IUser, ids: string[]): Promise<number> {
  const result = await Sector.deleteMany({
    _id: { $in: ids },
    ...deletableBy(user),
  });

  return result.deletedCount || 0;
}

export {
  addSectorCollaborator,
  batchDeleteSectors,
  batchUpsertSectors,
  deleteSector,
  removeSectorCollaborator,
  upsertSector,
};
export type { UpsertSectorInput, ValidSector };

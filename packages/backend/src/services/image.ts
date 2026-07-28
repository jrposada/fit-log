import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';

import type {
  PopulatedOwnership,
  WithPopulatedOwnership,
} from '../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../auth/ownership-populate.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import type { IImage } from '../models/image.ts';
import { Image } from '../models/image.ts';
import type { IUser } from '../models/user.ts';
import {
  addOrUpdateCollaborator,
  removeCollaborator,
} from '../utils/collaborator-mutators.ts';

/** Fully populated image, as returned to API mappers. */
type ValidImage = WithPopulatedOwnership<IImage>;

async function addImageCollaborator(
  user: IUser,
  id: string,
  granteeId: string,
  permission: CollaboratorPermission
): Promise<ValidImage> {
  const image = await addOrUpdateCollaborator(
    Image,
    id,
    granteeId,
    permission,
    user
  ).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!image) {
    throw new ResourceNotFound(`Image ${id} not found or not editable`);
  }

  return image;
}

async function removeImageCollaborator(
  user: IUser,
  id: string,
  granteeId: string
): Promise<ValidImage> {
  const image = await removeCollaborator(
    Image,
    id,
    granteeId,
    user
  ).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!image) {
    throw new ResourceNotFound(`Image ${id} not found or not editable`);
  }

  return image;
}

export { addImageCollaborator, removeImageCollaborator };
export type { ValidImage };

import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';

import { deletableBy } from '../auth/deletable-filter.ts';
import type {
  PopulatedOwnership,
  WithPopulatedOwnership,
} from '../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../auth/ownership-populate.ts';
import { addOrUpdateCollaborator } from '../data/infrastructure/add-or-update-collaborator.ts';
import { removeCollaborator } from '../data/infrastructure/remove-collaborator.ts';
import { upsertOwnedDocument } from '../data/infrastructure/upsert-owned-document.ts';
import type { IImage } from '../data/models/image.ts';
import { Image } from '../data/models/image.ts';
import type { IUser } from '../data/models/user.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import { ImageProcessor } from './image-processor.ts';

/** Fully populated image, as returned to API mappers. */
type ValidImage = WithPopulatedOwnership<IImage>;

type CreateImageInput = {
  base64: string;
  mimeType: string;
};

async function createImage(
  user: IUser,
  input: CreateImageInput
): Promise<ValidImage> {
  const imageProcessor = new ImageProcessor();
  const processedImage = await imageProcessor.processImageFromBase64(
    input.base64,
    input.mimeType
  );

  const image = await upsertOwnedDocument(Image, undefined, user, {
    /* Data */
    imageUrl: processedImage.imageUrl,
    thumbnailUrl: processedImage.thumbnailUrl,
    imageWidth: processedImage.imageWidth,
    imageHeight: processedImage.imageHeight,
  }).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!image) {
    throw new ResourceNotFound('Image creation failed');
  }

  return image;
}

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

async function deleteImage(user: IUser, id: string): Promise<void> {
  const result = await Image.deleteOne({ _id: id, ...deletableBy(user) });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(`Image ${id} not found or not deletable`);
  }
}

export {
  addImageCollaborator,
  createImage,
  deleteImage,
  removeImageCollaborator,
};
export type { ValidImage };

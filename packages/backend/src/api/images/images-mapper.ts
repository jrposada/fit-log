import { WithDepopulatedOwnership } from '@shared/models/auth/with-ownership';
import { Image } from '@shared/models/image/image';
import { assert } from '@shared/utils/assert';

import { WithPopulatedOwnership } from '../../auth/ownership-populate';
import { IImage } from '../../models/image';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from '../auth/collaborators-mapper';
import { toApiUserSummary } from '../auth/user-summary-mapper';

function resolveFileUrl(relativePath: string): string {
  if (
    relativePath.startsWith('http://') ||
    relativePath.startsWith('https://')
  ) {
    return relativePath;
  }

  assert(process.env.PUBLIC_FILES_BASE_URL, {
    msg: 'PUBLIC_FILES_BASE_URL environment variable is not set',
  });

  return `${process.env.PUBLIC_FILES_BASE_URL}/${relativePath}`;
}

function toApiDepopulatedImage(model: IImage): WithDepopulatedOwnership<Image> {
  return {
    /* Data */
    id: model._id.toString(),
    imageUrl: resolveFileUrl(model.imageUrl),
    thumbnailUrl: resolveFileUrl(model.thumbnailUrl),
    imageWidth: model.imageWidth,
    imageHeight: model.imageHeight,

    /* Ownership */
    owner: model.owner._id.toString(),
    collaborators: model.collaborators.map(toApiDepopulatedCollaborator),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiImage(model: WithPopulatedOwnership<IImage>): Image {
  return {
    /* Data */
    id: model._id.toString(),
    imageUrl: resolveFileUrl(model.imageUrl),
    thumbnailUrl: resolveFileUrl(model.thumbnailUrl),
    imageWidth: model.imageWidth,
    imageHeight: model.imageHeight,

    /* Ownership */
    owner: toApiUserSummary(model.owner),
    collaborators: model.collaborators.map(toApiCollaborator),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedImage, toApiImage };

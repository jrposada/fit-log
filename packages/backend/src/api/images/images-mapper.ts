import { Image } from '@shared/models/image/image';
import { assert } from '@shared/utils/assert';

import { IImage } from '../../models/image';

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

function toApiImage(model: IImage): Image {
  return {
    /* Data */
    id: model._id.toString(),
    imageUrl: resolveFileUrl(model.imageUrl),
    thumbnailUrl: resolveFileUrl(model.thumbnailUrl),
    imageWidth: model.imageWidth,
    imageHeight: model.imageHeight,

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiImage };

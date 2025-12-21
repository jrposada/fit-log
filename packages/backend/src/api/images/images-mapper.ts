import { Image } from '@shared/models/image';

import { IImage } from '../../models/image';

function toApiImage(model: IImage): Image {
  return {
    /* Data */
    id: model._id.toString(),
    imageUrl: model.imageUrl,
    thumbnailUrl: model.thumbnailUrl,
    imageWidth: model.imageWidth,
    imageHeight: model.imageHeight,

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiImage };

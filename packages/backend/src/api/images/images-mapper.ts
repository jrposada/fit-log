import { Image } from '@shared/models/image';

import { IImage } from '../../models/image';

function toApiImage(model: IImage): Image {
  return {
    id: model._id.toString(),
    imageUrl: model.imageUrl,
    thumbnailUrl: model.thumbnailUrl,
    imageWidth: model.imageWidth,
    imageHeight: model.imageHeight,

    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiImage };

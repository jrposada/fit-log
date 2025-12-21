import { ImagesPostRequest, ImagesPostResponse } from '@shared/models/image';
import { assert } from '@shared/utils/assert';

import { Image } from '../../models/image';
import { ImageProcessor } from '../../services/image-processor';
import { upsertDocument } from '../../utils/upsert-document';
import { toApiResponse } from '../api-utils';
import { toApiImage } from './images-mapper';

const handler = toApiResponse<
  ImagesPostResponse,
  unknown,
  unknown,
  ImagesPostRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { base64, mimeType } = request.body;

  const imageProcessor = new ImageProcessor();
  const processedImage = await imageProcessor.processImageFromBase64(
    base64,
    mimeType
  );

  const image = await upsertDocument(Image, undefined, {
    /* Data */
    imageUrl: processedImage.imageUrl,
    thumbnailUrl: processedImage.thumbnailUrl,
    imageWidth: processedImage.imageWidth,
    imageHeight: processedImage.imageHeight,
  });

  return {
    statusCode: 201,
    body: {
      success: true,
      data: {
        image: toApiImage(image),
      },
    },
  };
});

export { handler };

import {
  ImagesPostRequest,
  ImagesPostResponse,
} from '@jrposada/fit-log-shared/models/image/image-post';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Image } from '../../models/image.ts';
import { ImageProcessor } from '../../services/image-processor.ts';
import { upsertOwnedDocument } from '../../utils/upsert-owned-document.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiImage } from './images-mapper.ts';

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

  const image = await upsertOwnedDocument(Image, undefined, request.user, {
    /* Data */
    imageUrl: processedImage.imageUrl,
    thumbnailUrl: processedImage.thumbnailUrl,
    imageWidth: processedImage.imageWidth,
    imageHeight: processedImage.imageHeight,
  }).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!image) {
    throw new ResourceNotFound('Image creation failed');
  }

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

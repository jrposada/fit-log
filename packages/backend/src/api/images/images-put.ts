import { ImagesPutResponse } from '@shared/models/image';
import { assert } from '@shared/utils/assert';

import { Image } from '../../models/image';
import { ImageProcessor } from '../../services/image-processor';
import { upsertDocument } from '../../utils/upsert-document';
import { toApiResponse } from '../api-utils';
import { toApiImage } from './images-mapper';


const handler = toApiResponse<ImagesPutResponse, unknown, unknown, void>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });
    assert(request.file, { msg: 'No file uploaded' });

    const imageProcessor = new ImageProcessor();
    const processedImage = await imageProcessor.processImage(request.file.path);

    const image = await upsertDocument(Image, undefined, {
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
  }
);

export { handler };

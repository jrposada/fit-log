import {
  SectorUploadUrlRequest,
  sectorUploadUrlRequestSchema,
  SectorUploadUrlResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { apiHandler } from '../../api-utils';
import { S3Helper } from '../../../services/aws/s3';

export const handler = apiHandler<SectorUploadUrlResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });
    assert(process.env.SECTOR_IMAGES_BUCKET, { msg: 'Bucket not configured' });

    const { uploadData } = validateEvent(event);

    const fileId = uuid();
    const fileExtension = uploadData.fileName.split('.').pop() || 'jpg';
    const originalKey = `sectors/${uploadData.locationUuid}/${fileId}_original.${fileExtension}`;
    const thumbnailKey = `sectors/${uploadData.locationUuid}/${fileId}_thumb.${fileExtension}`;

    const s3Helper = new S3Helper(process.env.SECTOR_IMAGES_BUCKET);
    const uploadUrl = await s3Helper.getPresignedUploadUrl({
      Key: originalKey,
      ContentType: uploadData.fileType,
    });

    const cdnDomain = process.env.SECTOR_IMAGES_CDN_DOMAIN || '';
    const imageUrl = `${cdnDomain}/${originalKey}`;
    const thumbnailUrl = `${cdnDomain}/${thumbnailKey}`;

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          uploadUrl,
          imageUrl,
          thumbnailUrl,
        },
      },
    };
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  uploadData: SectorUploadUrlRequest;
} {
  if (!event.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = JSON.parse(event.body);
    const uploadData = sectorUploadUrlRequestSchema.parse(body);
    return { uploadData };
  } catch {
    throw new Error('Invalid request');
  }
}

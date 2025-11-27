import {
  SectorUploadUrlRequest,
  SectorUploadUrlResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { v4 as uuid } from 'uuid';
import { toApiResponse } from '../api-utils';
import { S3Helper } from '../../services/aws/s3';

const handler = toApiResponse<
  SectorUploadUrlResponse,
  unknown,
  unknown,
  SectorUploadUrlRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });
  assert(process.env.SECTOR_IMAGES_BUCKET, { msg: 'Bucket not configured' });

  const uploadData = request.body;

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
});

export { handler };

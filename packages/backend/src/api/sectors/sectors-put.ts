import { SectorsPutRequest, SectorsPutResponse } from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { DbRecord } from '../../services/aws/db-record';
import { SectorsService } from '../../services/sectors-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<
  SectorsPutResponse,
  unknown,
  unknown,
  SectorsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const sectorPutData = request.body;

  const record: DbRecord<'sector'> = {
    name: sectorPutData.name,
    description: sectorPutData.description,
    imageUrl: sectorPutData.imageUrl || '',
    thumbnailUrl: sectorPutData.thumbnailUrl || '',
    imageWidth: sectorPutData.imageWidth,
    imageHeight: sectorPutData.imageHeight,
    imageFileSize: sectorPutData.imageFileSize,
    sortOrder: sectorPutData.sortOrder,
    isPrimary: sectorPutData.isPrimary,
    createdAt: sectorPutData.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    PK: 'sector',
    SK:
      (sectorPutData.id as DbRecord<'sector'>['SK']) ??
      SectorsService.instance.newSk(sectorPutData.locationUuid),
  };

  void (await SectorsService.instance.put(record));

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        sector: {
          id: record.SK,
          name: record.name,
          description: record.description,
          imageUrl: record.imageUrl,
          thumbnailUrl: record.thumbnailUrl,
          imageWidth: record.imageWidth,
          imageHeight: record.imageHeight,
          imageFileSize: record.imageFileSize,
          sortOrder: record.sortOrder,
          isPrimary: record.isPrimary,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        },
      },
    },
  };
});

export { handler };

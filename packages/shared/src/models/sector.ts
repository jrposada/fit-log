import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import z from 'zod';

////////////
// Models //
////////////

/**
 * Represents a sector/wall within a climbing location.
 */
export type Sector = {
  /**
   * ID `sector#<location-id>#<sector-id>`.
   */
  id: string;

  /**
   * Name of the sector
   */
  name: string;

  /**
   * Description of the sector
   */
  description?: string;

  /**
   * S3 URL to the sector image
   */
  imageUrl: string;

  /**
   * S3 URL to the thumbnail image
   */
  thumbnailUrl: string;

  /**
   * Image width in pixels
   */
  imageWidth: number;

  /**
   * Image height in pixels
   */
  imageHeight: number;

  /**
   * Image file size in bytes
   */
  imageFileSize: number;

  /**
   * Sort order for display
   */
  sortOrder: number;

  /**
   * Whether this is the primary sector for the location
   */
  isPrimary?: boolean;

  /**
   * Date when sector was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt: string;

  /**
   * Date when sector was last updated in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  updatedAt: string;
};

export const sectorSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  imageFileSize: z.number().int().positive(),
  sortOrder: z.number().int(),
  isPrimary: z.boolean().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/////////
// GET //
/////////
export type SectorsGetParams = {
  locationUuid: string;
};

export const sectorsGetParamsSchema = z.object({
  locationUuid: z.string().nonempty(),
});

export type SectorsGetResponse = {
  sectors: Sector[];
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
};

//////////////
// GET BY ID //
///////////////
export type SectorsByIdGetParams = {
  id: string;
};
export const sectorsByIdGetParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SectorsByIdGetResponse = {
  sector: Sector;
};

/////////
// PUT //
/////////
export type SectorsPutRequest = Omit<
  Sector,
  'id' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'thumbnailUrl'
> & {
  /**
   * ID `sector#<location-id>#<sector-id>`.
   */
  id?: string;

  /**
   * UUID of the location this sector belongs to
   */
  locationUuid: string;

  /**
   * Date when sector was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt?: string;

  /**
   * Base64 encoded image data (for upload)
   */
  imageData?: string;

  /**
   * Image URL (when updating without changing image)
   */
  imageUrl?: string;

  /**
   * Thumbnail URL (when updating without changing image)
   */
  thumbnailUrl?: string;
};

export const sectorsPutRequestSchema = z.object({
  id: z.string().optional(),
  locationUuid: z.string().nonempty(),
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  imageData: z.string().optional(),
  imageUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  imageFileSize: z.number().int().positive(),
  sortOrder: z.number().int(),
  isPrimary: z.boolean().optional(),
  createdAt: z.string().datetime().optional(),
});

export type SectorsPutResponse = {
  sector: Sector;
};

////////////
// DELETE //
////////////
export type SectorsDeleteParams = {
  id: string;
};
export const sectorsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SectorsDeleteResponse = {
  success: true;
};

///////////////////
// UPLOAD URL //
///////////////////
export type SectorUploadUrlRequest = {
  locationUuid: string;
  fileName: string;
  fileType: string;
};

export const sectorUploadUrlRequestSchema = z.object({
  locationUuid: z.string().nonempty(),
  fileName: z.string().nonempty(),
  fileType: z.string().nonempty(),
});

export type SectorUploadUrlResponse = {
  uploadUrl: string;
  imageUrl: string;
  thumbnailUrl: string;
};

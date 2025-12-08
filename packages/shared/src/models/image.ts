import z from 'zod';

////////////
// Models //
////////////

/**
 * Represents an image with metadata
 */
export type Image = {
  /**
   * ID
   */
  id: string;

  /**
   * URL to the full-size image
   */
  imageUrl: string;

  /**
   * URL to the thumbnail image
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
   * Date when image was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt: string;

  /**
   * Date when image was last updated in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  updatedAt: string;
};

export const imageSchema = z.object({
  id: z.string().nonempty(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

//////////
// POST //
//////////
export type ImagesPostRequest = {
  /** Base64 encoded image data */
  base64: string;

  /** MIME type of the image */
  mimeType: string;
};
export const imagesPostRequestSchema = z.object({
  base64: z.string(),
  mimeType: z.string(),
});

export type ImagesPostResponse = {
  image: Image;
};

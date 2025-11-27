import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { assert } from '@shared/utils/assert';
import dotenv from 'dotenv';

if (process.env.IS_OFFLINE) {
  const env = dotenv.config({ path: '.env' }).parsed;
  Object.assign(process.env, env);
}

export class S3Helper {
  private readonly s3Client: S3Client;

  constructor(private readonly bucketName: string) {
    assert(process.env.AWS_REGION, {
      msg: 'Expected env variable `AWS_REGION` to be defined',
    });
    assert(process.env.SECTOR_IMAGES_BUCKET, {
      msg: 'Expected env variable `SECTOR_IMAGES_BUCKET` to be defined',
    });

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      ...(process.env.IS_OFFLINE && {
        endpoint: process.env.S3_LOCAL_ENDPOINT,
      }),
    });
    this.bucketName = bucketName;
  }

  async getPresignedUploadUrl({
    Key,
    ContentType,
  }: Pick<PutObjectCommandInput, 'Key' | 'ContentType'>): Promise<string> {
    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key,
      ContentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, putObjectCommand, {
      expiresIn: 3600, // 1 hour
    });

    return uploadUrl;
  }
}

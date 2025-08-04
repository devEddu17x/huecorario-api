import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  S3Client,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private readonly logger = new Logger(StorageService.name);
  constructor(private readonly configService: ConfigService) {
    const { accountId, accessKeyId, secretAccessKey, bucket } =
      this.configService.get('cloudflare');
    if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error('Cloudflare storage configuration is incomplete');
    }
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = bucket;
  }

  async uploadFile<T extends PutObjectCommandInput['Body']>(
    key: string,
    value: T,
  ) {
    const putCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: value,
      ContentType: 'image/svg+xml',
    });
    const response = await this.s3Client.send(putCommand);
    if (
      !response.$metadata.httpStatusCode ||
      response.$metadata.httpStatusCode !== 200
    ) {
      this.logger.error(`Failed to upload file: ${key}`);
    }
    this.logger.log(`File uploaded successfully: ${key}`);
    return response;
  }
}

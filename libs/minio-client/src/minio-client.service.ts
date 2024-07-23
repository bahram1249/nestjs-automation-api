import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import internal from 'stream';

@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService) {}

  public get client() {
    return this.minio.client;
  }

  async listAllBuckets() {
    return await this.client.listBuckets();
  }

  async createBucket(bucketName: string) {
    const isExists = await this.client.bucketExists(bucketName);
    if (!isExists) await this.client.makeBucket(bucketName);
  }

  async upload(
    bucketName: string,
    objectName: string,
    stream: string | internal.Readable | Buffer,
    itemBucketMetadata?: Record<any, any>,
  ) {
    return await this.client.putObject(
      bucketName,
      objectName,
      stream,
      null,
      itemBucketMetadata ? itemBucketMetadata : null,
    );
  }

  async generateDownloadUrl(
    bucketName: string,
    objectName: string,
    expiry?: number,
    respHeaders?: {
      [key: string]: any;
    } | null,
    requestDate?: Date | null,
  ): Promise<string> {
    const presignedUrl = await this.client.presignedGetObject(
      bucketName,
      objectName,
    );
    return presignedUrl;
  }

  async remove(bucketName: string, objectName: string) {
    return await this.client.removeObject(bucketName, objectName);
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: Client;

  async onModuleInit() {
    this.minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });

    const bucket = process.env.MINIO_BUCKET || 'uploads';
    const exists = await this.minioClient
      .bucketExists(bucket)
      .catch(() => false);
    if (!exists) {
      await this.minioClient.makeBucket(bucket, 'us-east-1');
    }
  }

  async uploadFile(buffer: Buffer, filename: string, mimetype?: string) {
    const key = `${Date.now()}-${filename}`;
    await this.minioClient.putObject(
      process.env.MINIO_BUCKET || 'uploads',
      key,
      buffer,
      buffer.length,
      { 'Content-Type': mimetype || 'application/octet-stream' },
    );
    return { key };
  }

  async getFileStream(key: string) {
    return this.minioClient.getObject(
      process.env.MINIO_BUCKET || 'uploads',
      key,
    );
  }
}

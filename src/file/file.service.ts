import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { KafkaService, FileUploadedEvent } from '../kafka/kafka.service';

@Injectable()
export class FileService {
  constructor(
    private readonly storage: StorageService,
    private readonly kafka: KafkaService,
  ) {}

  async uploadFile(
    entryId: string,
    userId: string,
    buffer: Buffer,
    filename: string,
    mimetype?: string,
  ) {
    const { key } = await this.storage.uploadFile(
      entryId,
      userId,
      buffer,
      filename,
      mimetype,
    );
    const assetId = key;
    const endpoint = process.env.MINIO_PUBLIC_URL;
    const bucket = process.env.MINIO_BUCKET || 'uploads';
    const url = `${endpoint}/${bucket}/${key}`;
    const event: FileUploadedEvent = {
      entryId,
      assetId,
      key,
      originalname: filename,
      uploadedAt: new Date().toISOString(),
    };

    await this.kafka.publishFileUploaded(event);

    return { entryId, assetId, key, url };
  }

  async getFile(key: string) {
    return this.storage.getFileStream(key);
  }
}

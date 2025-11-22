import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { KafkaService, FileUploadedEvent } from '../kafka/kafka.service';

@Injectable()
export class FileService {
  constructor(
    private readonly storage: StorageService,
    private readonly kafka: KafkaService,
  ) {}

  async uploadFile(buffer: Buffer, filename: string, mimetype?: string) {
    const { key } = await this.storage.uploadFile(buffer, filename, mimetype);

    const event: FileUploadedEvent = {
      key,
      originalname: filename,
      uploadedAt: new Date().toISOString(),
    };

    await this.kafka.publishFileUploaded(event);

    return { key, event };
  }

  async getFile(key: string) {
    return this.storage.getFileStream(key);
  }
}

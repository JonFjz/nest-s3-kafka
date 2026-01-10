import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import * as dotenv from 'dotenv';
dotenv.config();

export interface FileUploadedEvent {
  entryId: string;
  assetId: string;
  key: string;
  originalname: string;
  uploadedAt: string;
  url: string;
}

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  onModuleInit = async () => {
    this.kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    this.producer = this.kafka.producer();
    await this.producer.connect();
  };

  onModuleDestroy = async () => {
    await this.producer.disconnect();
  };

  async publishFileUploaded(event: FileUploadedEvent) {
    await this.producer.send({
      topic: process.env.KAFKA_TOPIC || 'files.uploaded',
      messages: [{ value: JSON.stringify(event) }],
    });
  }
}

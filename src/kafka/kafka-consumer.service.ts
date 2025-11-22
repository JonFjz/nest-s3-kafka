import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka: Kafka;

  async onModuleInit() {
    this.kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    const consumer = this.kafka.consumer({ groupId: 'file-consumers' });
    await consumer.connect();
    await consumer.subscribe({
      topic: process.env.KAFKA_TOPIC || 'files.uploaded',
      fromBeginning: false,
    });
    await consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        if (!message.value) return;
        try {
          const payload = JSON.parse(message.value.toString());
          console.log('Consumed file event:', payload);
          // Extend here: database insert, thumbnail generation, etc.
        } catch (err) {
          console.error('Failed to parse Kafka message', err);
        }
      },
    });
  }
}

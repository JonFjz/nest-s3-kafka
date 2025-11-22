import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';
import { KafkaModule } from './kafka/kafka.module';
import { FileService } from './file/file.service';
import { FileController } from './file/file.controller';

@Module({
  imports: [StorageModule, KafkaModule],
  controllers: [FileController],
  providers: [FileService],
})
export class AppModule {}

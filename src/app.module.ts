import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { UploadsController } from './file/uploads.controller';
import { OrganisationsController } from './organisations/organisations.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [AuthModule, StorageModule, KafkaModule],
  controllers: [UploadsController, OrganisationsController, UsersController],
})
export class AppModule {}

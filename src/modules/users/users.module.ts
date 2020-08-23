import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { UsersProviders } from './users.providers';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, ...UsersProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

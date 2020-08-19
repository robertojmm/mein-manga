import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthProviders } from './auth.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, ...AuthProviders],
  exports: [AuthService],
})
export class AuthModule {}

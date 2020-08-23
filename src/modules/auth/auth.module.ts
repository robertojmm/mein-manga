import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthProviders } from './auth.providers';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtService, JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';

const jwtModuleOptions: JwtModuleOptions = {
  secret: jwtConstants.secret,
  signOptions: { expiresIn: '3d' },
};

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PassportModule,
    JwtModule.register(jwtModuleOptions),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...AuthProviders,
    LocalStrategy,
    JwtStrategy /* JwtService */,
  ],
  exports: [AuthService],
})
export class AuthModule {}

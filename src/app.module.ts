import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MangaModule } from './modules/manga/manga.module';
import { EnvModule } from './modules/env/env.module';

@Module({
  imports: [UsersModule, MangaModule, EnvModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

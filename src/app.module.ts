import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MangaModule } from './modules/manga/manga.module';
import { EnvModule } from './modules/env/env.module';
import settings from './common/settings';

@Module({
  imports: [
    UsersModule,
    MangaModule,
    EnvModule,
    MulterModule.register({
      dest: settings.get('MANGA_FOLDER'), //'./files',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

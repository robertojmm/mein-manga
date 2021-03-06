import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './modules/users/users.module';
import { MangaModule } from './modules/manga/manga.module';
import { EnvModule } from './modules/env/env.module';
import { AuthModule } from './modules/auth/auth.module';
import settings from './common/settings';

@Module({
  imports: [
    UsersModule,
    MangaModule,
    EnvModule,
    AuthModule,
    MulterModule.register({
      dest: settings.get('MANGA_FOLDER'), //'./files',
    }),
    ServeStaticModule.forRoot({
      rootPath: settings.get('STATIC_FOLDER'),
      //serveRoot: '/reading',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

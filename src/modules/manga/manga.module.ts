import { Module } from '@nestjs/common';
import { MangaController } from './manga.controller';
import { MangaService } from './manga.service';
import { DatabaseModule } from '../database/database.module';
import { mangaProviders } from './manga.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [MangaController],
  providers: [MangaService, ...mangaProviders],
  exports: [MangaService, ...mangaProviders],
})
export class MangaModule {}

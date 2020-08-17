import { Module } from '@nestjs/common';
import { MangaController } from './manga.controller';
import { MangaService } from './services/manga.service';
import { ChaptersService } from './services/chapters.service';
import { DatabaseModule } from '../database/database.module';
import { mangaProviders } from './manga.providers';
import { chaptersProviders } from './chapters.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [MangaController],
  providers: [
    MangaService,
    ChaptersService,
    ...chaptersProviders,
    //...mangaProviders,
  ],
  exports: [
    MangaService,
    ChaptersService,
    ...chaptersProviders,
    //...mangaProviders,
  ],
})
export class MangaModule {}

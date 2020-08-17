import { Injectable, Inject } from '@nestjs/common';
import { Manga } from '../entities/manga.entity';

import { MangaRepository } from '../manga.repository';

import { MANGA_REPOSITORY_TOKEN } from '../../../common/config/databaseTokens.constants';
import { Chapter } from '../entities/chapter.entity';
import { CreateMangaDto } from '../dto/createManga.dto';

@Injectable()
export class MangaService {
  constructor(
    @Inject(MANGA_REPOSITORY_TOKEN)
    private readonly mangaRepository: MangaRepository, //private readonly mangaRepository: Repository<Manga>,
  ) {}

  getMangas(): Promise<Manga[]> {
    return this.mangaRepository.getMangas();
  }

  getManga(id: number): Promise<Manga> {
    return this.mangaRepository.getManga(id);
  }

  getMangaWithChapters(id: number): Promise<Manga> {
    return this.mangaRepository.getMangaWithChapters(id);
  }

  getChapter(id: number, chapterNo: number): Promise<Chapter> {
    return this.mangaRepository.getChapter(id, chapterNo);
  }

  createManga(createMangaDto: CreateMangaDto): Promise<Manga> {
    return this.mangaRepository.saveManga(createMangaDto);
  }
}

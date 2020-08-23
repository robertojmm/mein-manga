import { Injectable, Inject } from '@nestjs/common';
import { Manga } from '../entities/manga.entity';

import { MangaRepository } from '../manga.repository';

import { MANGA_REPOSITORY_TOKEN } from '../../../common/config/databaseTokens.constants';
import { Chapter } from '../entities/chapter.entity';
import { CreateMangaDto } from '../dto/createManga.dto';
import { ChaptersService } from './chapters.service';
import { MangaNotFoundException } from 'src/common/exceptions';

@Injectable()
export class MangaService {
  constructor(
    @Inject(MANGA_REPOSITORY_TOKEN)
    private readonly mangaRepository: MangaRepository,
    private readonly chaptersService: ChaptersService,
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

  async deleteManga(id: number) {
    const {
      chapters,
      ...manga
    } = await this.mangaRepository.getMangaWithChapters(id);

    if (!manga) {
      throw new MangaNotFoundException();
    }

    if (chapters) {
      chapters.forEach(chapter =>
        this.chaptersService.deleteChapterFiles(chapter),
      );
    }

    return this.mangaRepository.delete(manga);
  }
}

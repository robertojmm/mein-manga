import { Injectable, Inject } from '@nestjs/common';
import {
  CHAPTER_REPOSITORY_TOKEN,
  MANGA_REPOSITORY_TOKEN,
} from 'src/common/config/databaseTokens.constants';
import { ChaptersRepository } from '../chapters.repository';
import { MangaRepository } from '../manga.repository';
import { NewChapterDto } from '../dto/newChapter.dto';
import { Chapter } from '../entities/chapter.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @Inject(CHAPTER_REPOSITORY_TOKEN)
    private readonly chaptersRepository: ChaptersRepository,
    @Inject(MANGA_REPOSITORY_TOKEN)
    private readonly mangaRepository: MangaRepository,
  ) {}

  async saveChapter(mangaId: number, chapter: NewChapterDto): Promise<Chapter> {
    const manga = await this.mangaRepository.getManga(mangaId);
    return this.chaptersRepository.saveChapter(manga);
  }
}

import { EntityRepository, Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';
import { Manga } from './entities/manga.entity';
import { ChapterDetails } from './interfaces/chapterDetails.interface';

@EntityRepository(Chapter)
export class ChaptersRepository extends Repository<Chapter> {
  public saveChapter(manga: Manga, chapter: ChapterDetails): Promise<Chapter> {
    return this.save({
      ...chapter,
      manga,
    });
  }

  public searchChapter(mangaId: number, chapterNo: number): Promise<Chapter> {
    return this.findOne({
      where: {
        manga: mangaId,
        number: chapterNo,
      },
      relations: ['manga'],
    });
  }
}

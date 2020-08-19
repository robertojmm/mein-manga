import { EntityRepository, Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';
import { Manga } from './entities/manga.entity';
import { ChapterDetails } from './interfaces/chapterDetails.interface';
import { PrepareChapterDto } from './dto/prepareChapter.dto';

@EntityRepository(Chapter)
export class ChaptersRepository extends Repository<Chapter> {
  public saveChapter(manga: Manga, chapter: ChapterDetails): Promise<Chapter> {
    return this.save({
      ...chapter,
      manga,
    });
  }

  public searchChapter(chapter: PrepareChapterDto): Promise<Chapter> {
    return this.createQueryBuilder('chapter')
      .select()
      .where('chapter.manga = :id AND chapter.number = :number', {
        id: chapter.mangaId,
        number: chapter.chapterNo,
      })
      .getOne();
  }
}

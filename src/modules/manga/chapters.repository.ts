import { EntityRepository, Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';
import { Manga } from './entities/manga.entity';

@EntityRepository(Chapter)
export class ChaptersRepository extends Repository<Chapter> {
  public saveChapter(manga: Manga): Promise<Chapter> {
    console.log(manga);
    return this.save({
      manga,
    });
  }
}

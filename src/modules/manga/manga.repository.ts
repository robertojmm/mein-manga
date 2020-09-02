import { EntityRepository, Repository } from 'typeorm';
import { Manga } from './entities/manga.entity';
import { Chapter } from './entities/chapter.entity';
import { CreateMangaDto } from './dto/createManga.dto';

@EntityRepository(Manga)
export class MangaRepository extends Repository<Manga> {
  public getMangas(): Promise<Manga[]> {
    return this.find({
      order: {
        name: 'ASC',
      },
    });
  }

  public getMangaById(id: number): Promise<Manga> {
    return this.findOne(id);
  }

  public getMangaByName(name: string): Promise<Manga> {
    return this.findOne({
      where: { name },
    });
  }

  public getMangaWithChapters(id: number): Promise<Manga> {
    //Finish this
    return this.findOne(id, {
      relations: ['chapters'],
    });
  }

  getChapter(id: number, chapterNo: number): Promise<Chapter> {
    //TODO recheck this
    return this.createQueryBuilder('manga')
      .innerJoinAndSelect('manga.chapters', 'chapter', 'manga.id = :id', {
        id,
      })
      .where('chapter.number = :chapterNo', { chapterNo })
      .getOne()
      .then(manga => manga.chapters[0]);
    //.getSql()
  }

  saveManga(createMangaDto: CreateMangaDto): Promise<Manga> {
    return this.save(createMangaDto);
  }
}

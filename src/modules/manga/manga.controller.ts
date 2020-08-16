import { Controller, Get, Param } from '@nestjs/common';
import { MangaService } from './manga.service';
import { Manga } from './entities/manga.entity';
import { Chapter } from './entities/chapter.entity';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @Get()
  async getMangas(): Promise<Manga[]> {
    //return manga list
    return await this.mangaService.getMangas();
  }

  @Get(':id')
  async getManga(@Param('id') id: number): Promise<Manga> {
    //return general info about a specific manga
    return await this.mangaService.getManga(id);
  }

  @Get(':id/chapters')
  getChapters(@Param('id') id: number): Promise<Manga> {
    return this.mangaService.getMangaWithChapters(id);
  }

  @Get(':id/chapter/:chapterNo')
  getChapter(
    @Param('id') id: number,
    @Param('chapterNo') chapterNo: number,
  ): Promise<Chapter> {
    //return specific chapter of a manga
    return this.mangaService.getChapter(id, chapterNo);
  }
}

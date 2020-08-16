import { Controller, Get, Param } from '@nestjs/common';
import { MangaService } from './manga.service';
import { Manga } from './manga.entity';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @Get()
  async getMangas(): Promise<Manga[]> {
    //return manga list
    return await this.mangaService.findAll();
  }

  @Get(':id')
  async getManga(@Param('id') id: number): Promise<Manga> {
    //return general info about a specific manga
    return await this.mangaService.findOne(id);
  }

  @Get(':id/chapters')
  getChapters(@Param('id') id: number): string {
    //return all chapters list of a manga
    return `Returned chapters of manga with id ${id}`;
  }

  @Get(':id/chapter/:chapterNo')
  getChapter(
    @Param('id') id: number,
    @Param('chapterNo') chapterNo: number,
  ): string {
    //return specific chapter of a manga
    return `Returned chapter ${chapterNo} of manga with id ${id}`;
  }
}

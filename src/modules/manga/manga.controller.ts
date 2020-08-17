import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MangaService } from './services/manga.service';
import { Manga } from './entities/manga.entity';
import { Chapter } from './entities/chapter.entity';
import { CreateMangaDto } from './dto/createManga.dto';
import { NewChapterDto } from './dto/newChapter.dto';
import { ChaptersService } from './services/chapters.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('manga')
export class MangaController {
  constructor(
    private readonly mangaService: MangaService,
    private readonly chaptersService: ChaptersService,
  ) {}

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
  async getChapter(
    @Param('id') id: number,
    @Param('chapterNo') chapterNo: number,
  ): Promise<Chapter> {
    //return specific chapter of a manga
    return await this.mangaService.getChapter(id, chapterNo);
  }

  @Post()
  createManga(@Body() createMangaDto: CreateMangaDto): Promise<Manga> {
    return this.mangaService.createManga(createMangaDto);
  }

  @Post(':id/chapters')
  @UseInterceptors(FileInterceptor('file'))
  newChapter(
    @Param('id') id: number,
    @Body() newChapterDto: NewChapterDto,
    @UploadedFile() file: any,
  ): Promise<Chapter> {
    console.log(file);
    console.log(id);
    console.log(newChapterDto.number);
    return this.chaptersService.saveChapter(id, newChapterDto);
  }
}

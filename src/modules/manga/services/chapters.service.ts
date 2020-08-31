import * as fs from 'fs';
import { Injectable, Inject } from '@nestjs/common';
import {
  CHAPTER_REPOSITORY_TOKEN,
  MANGA_REPOSITORY_TOKEN,
  USER_MANGA_CHAPTER_REPOSITORY_TOKEN,
} from '../../../common/config/databaseTokens.constants';
import { ChaptersRepository } from '../chapters.repository';
import { MangaRepository } from '../manga.repository';
import { NewChapterDto } from '../dto/newChapter.dto';
import { Chapter } from '../entities/chapter.entity';
import {
  MangaNotFoundException,
  ChapterNotFoundException,
  ChapterNumberAlreadyExists,
} from '../../../common/exceptions';

import * as AdmZip from 'adm-zip';
import * as UnrarJs from 'unrar-js';
import settings from '../../../common/settings';
import {
  writeFileSyncWithSafeName,
  createFolderIfNotExists,
  fileNameIsAPicture,
} from '../../../common/utils';
import { PrepareChapterDto } from '../dto/prepareChapter.dto';
import { UpdateChapterProgressDto } from '../dto/updateChapterProgress.dto';
import { env } from 'src/env';
import { Repository } from 'typeorm';
import { UserMangaChapter } from '../entities/user-manga-chapter.entity';
import { GetChapterProgressDto } from '../dto/getChapterProgress.dto';

@Injectable()
export class ChaptersService {
  constructor(
    @Inject(CHAPTER_REPOSITORY_TOKEN)
    private readonly chaptersRepository: ChaptersRepository,
    @Inject(MANGA_REPOSITORY_TOKEN)
    private readonly mangaRepository: MangaRepository,
    @Inject(USER_MANGA_CHAPTER_REPOSITORY_TOKEN)
    private readonly userProgressRepository: Repository<UserMangaChapter>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async saveChapter(
    mangaId: number,
    chapter: NewChapterDto,
    file: any,
  ): Promise<Chapter> {
    const manga = await this.mangaRepository.getMangaById(mangaId);
    if (!manga) {
      throw new MangaNotFoundException();
    }

    const chapterEntity = await this.chaptersRepository.findOne({
      where: {
        manga,
        number: chapter.number,
      },
    });
    if (chapterEntity) {
      throw new ChapterNumberAlreadyExists(manga.name);
    }

    manga.chapterAmount++;
    this.mangaRepository.save(manga);

    const folder = `${file.destination}/${manga.name}`;
    createFolderIfNotExists(folder);
    const filePath = `${folder}/${file.originalname}`;
    fs.renameSync(file.path, filePath);

    const { pages, path, posterName } = this.extractChapterCover(
      filePath,
      `${settings.get('CHAPTER_COVERS_FOLDER')}/${manga.name}`,
    );

    const coverWebPath = `/chapter_covers/${manga.name}/${posterName}`;

    return this.chaptersRepository.saveChapter(manga, {
      number: chapter.number,
      filePath,
      coverPath: path,
      coverWebPath,
      pages,
    });
  }

  private extractChapterCover(filePath: string, destination: string) {
    return this.extractChapterFile({
      filePath,
      destination,
      onlyExtractCover: true,
    });
  }

  private extractChapterFile(options: {
    filePath: string;
    destination: string;
    onlyExtractCover?: boolean;
  }): { pages: number; path: string; posterName: string } {
    createFolderIfNotExists(options.destination);

    return options.filePath.endsWith('cbz')
      ? this.readZip(options)
      : this.readRar(options);
  }

  private readZip({
    filePath,
    destination,
    onlyExtractCover,
  }: {
    filePath: string;
    destination: string;
    onlyExtractCover?: boolean;
  }): { pages: number; path: string; posterName: string } {
    const files = new AdmZip(filePath).getEntries();

    const result = { pages: files.length, path: destination, posterName: '' };

    if (onlyExtractCover) {
      let i = 0;
      let file = files[i];

      while (file.isDirectory || !fileNameIsAPicture(file.name)) {
        i++;
        file = files[i];
      }

      result.posterName = file.name;
      result.path = writeFileSyncWithSafeName(
        destination,
        file.name,
        file.getData(),
      );
      return result;
    }

    files.forEach(file => {
      if (!file.isDirectory && fileNameIsAPicture(file.name)) {
        writeFileSyncWithSafeName(destination, file.entryName, file.getData());
      }
    });
    return result;
  }

  private readRar({
    filePath,
    destination,
    onlyExtractCover,
  }: {
    filePath: string;
    destination: string;
    onlyExtractCover?: boolean;
  }): { pages: number; path: string; posterName: string } {
    const files = UnrarJs.unrarSync(filePath);

    const result = { pages: files.lenght, path: destination, posterName: '' };

    if (onlyExtractCover) {
      const file = files[0];
      result.posterName = file.filename;
      result.path = writeFileSyncWithSafeName(
        destination,
        file.filename,
        file.fileData,
      );
      return result;
    }

    files.forEach(file =>
      writeFileSyncWithSafeName(destination, file.filename, file.fileData),
    );
    return result;
  }

  public async prepareChapter(
    //preapareChapterDto: PrepareChapterDto,
    mangaId: number,
    chapterNo: number,
  ): Promise<string[]> {
    const chapter = await this.chaptersRepository.searchChapter(
      mangaId,
      chapterNo,
    );

    if (!chapter) {
      throw new ChapterNotFoundException();
    }

    const destination = `${settings.get('READING_FOLDER')}/${
      chapter.manga.name
    }/${chapter.number}`;

    if (!this.isChapterPrepared(destination)) {
      fs.mkdirSync(destination, {
        recursive: true,
      });

      this.extractChapterFile({
        filePath: chapter.filePath,
        destination,
      });
    }

    // Create URLS to each page
    const pages = fs.readdirSync(destination);
    return pages.map(
      page => `/reading/${chapter.manga.name}/${chapter.number}/${page}`,
    );
  }

  private isChapterPrepared(chapterTempPath: string) {
    return fs.existsSync(chapterTempPath);
  }

  private shouldPrepareNextChapter(totalPages: number, actualpage: number) {
    return totalPages - actualpage <= 5;
  }

  public async updateChapterProgress({
    userId,
    mangaId,
    chapterNo,
    page,
  }: UpdateChapterProgressDto) {
    /* const progress = await this.userProgressRepository.findOne({
      where: { user: userId, manga: mangaId },
    });

    /* 
    
    TODO
    CREATES A SECOND TABLE DUE TO UNKNOWN REASON. CHECK IT

    */

    const chapter = await this.chaptersRepository.searchChapter(
      mangaId,
      chapterNo,
    );

    if (this.shouldPrepareNextChapter(chapter.pages, page)) {
      this.prepareChapter(mangaId, chapterNo + 1);
    }

    //if (!progress) {
    const entity = new UserMangaChapter();
    entity.user = <any>{ uid: userId };
    entity.manga = <any>{ id: mangaId };
    entity.chapter = chapter;
    entity.page = page;

    return this.userProgressRepository.save(entity);

    /* this.userProgressRepository
        .createQueryBuilder()
        .insert()
        .into(UserMangaChapter)
        .values(xd
        ); */
    //}
  }

  public async getChapterProgress({
    userId,
    mangaId,
    chapterNo,
  }: GetChapterProgressDto): Promise<UserMangaChapter> {
    const chapter = await this.chaptersRepository.searchChapter(
      mangaId,
      chapterNo,
    );

    return this.userProgressRepository.findOne({
      where: {
        user: userId,
        manga: mangaId,
        chapter,
      },
    });
  }

  public async deleteChapter({ mangaId, chapterNo }: PrepareChapterDto) {
    const chapter = await this.chaptersRepository.searchChapter(
      mangaId,
      chapterNo,
    );

    if (!chapter) {
      throw new ChapterNotFoundException();
    }

    const manga = chapter.manga;
    manga.chapterAmount--;
    this.mangaRepository.save(manga);

    this.deleteChapterFiles(chapter);

    return this.chaptersRepository.delete(chapter);
  }

  public deleteChapterFiles(chapter: Chapter): void {
    fs.unlinkSync(chapter.coverPath);
    fs.unlinkSync(chapter.filePath);
  }
}

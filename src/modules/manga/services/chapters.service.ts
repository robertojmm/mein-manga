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
import { Base64 } from 'js-base64';

import settings from '../../../common/settings';
import {
  writeFileSyncWithSafeName,
  createFolderIfNotExists,
  fileNameIsAPicture,
  getFileExtension,
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
      fs.unlinkSync(file.path);
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateChapter(
    mangaId: number,
    chapterNo: number,
    newChapterNo?: number,
    files?: {
      newFile?: any;
      newChapterPoster?: any;
    },
  ) {
    const chapter = await this.chaptersRepository.searchChapter(
      mangaId,
      chapterNo,
    );

    if (newChapterNo) {
      console.log(chapter);
      this.deleteFilesIfChapterIsPrepared(chapter);
      chapter.number = newChapterNo;
    }

    if (files.newFile) {
      fs.unlinkSync(chapter.filePath);

      console.log(files.newFile);
      const newFile = files.newFile[0];

      const destination = `${settings.get('MANGA_FOLDER')}/${
        chapter.manga.name
      }/${newFile.originalname}`;
      fs.writeFileSync(destination, newFile.buffer, 'binary');

      chapter.filePath = destination;
      this.deleteFilesIfChapterIsPrepared(chapter);
    }

    if (files.newChapterPoster) {
      fs.unlinkSync(chapter.coverPath);

      const newChapterPoster = files.newChapterPoster[0];

      const extension = getFileExtension(newChapterPoster.originalname);
      const encodedFileName = `${Base64.encode(
        newChapterPoster.originalname + new Date().getTime(),
      )}.${extension}`;

      const destination = `${settings.get('CHAPTER_COVERS_FOLDER')}/${
        chapter.manga.name
      }/${encodedFileName}`;

      fs.writeFileSync(destination, newChapterPoster.buffer, 'binary');

      chapter.coverPath = destination;
      chapter.coverWebPath = `/chapter_covers/${chapter.manga.name}/${encodedFileName}`;
    }

    return this.chaptersRepository.save(chapter);
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

      const extension = getFileExtension(file.name);
      const encodedFileName = `${Base64.encode(
        file.name + new Date().getTime(),
      )}.${extension}`;

      result.posterName = encodedFileName;
      result.path = writeFileSyncWithSafeName(
        destination,
        encodedFileName,
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

  public getContinueReading(userId: number): Promise<UserMangaChapter> {
    return this.userProgressRepository.findOne({
      where: {
        user: userId,
      },
      order: {
        time: 'DESC',
      },
      relations: ['chapter', 'manga'],
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

    this.deleteFilesIfChapterIsPrepared(chapter);

    return this.chaptersRepository.delete(chapter);
  }

  public deleteChapterFiles(chapter: Chapter): void {
    fs.unlinkSync(chapter.coverPath);
    fs.unlinkSync(chapter.filePath);
  }

  public deleteFilesIfChapterIsPrepared(chapter: Chapter): void {
    console.log(chapter);
    const readingPath = `${settings.get('READING_FOLDER')}/${
      chapter.manga.name
    }/${chapter.number}`;

    if (this.isChapterPrepared(readingPath)) {
      fs.rmdirSync(readingPath, { recursive: true });
    }
  }
}

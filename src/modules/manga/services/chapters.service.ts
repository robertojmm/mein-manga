import * as fs from 'fs';
import { Injectable, Inject } from '@nestjs/common';
import {
  CHAPTER_REPOSITORY_TOKEN,
  MANGA_REPOSITORY_TOKEN,
} from '../../../common/config/databaseTokens.constants';
import { ChaptersRepository } from '../chapters.repository';
import { MangaRepository } from '../manga.repository';
import { NewChapterDto } from '../dto/newChapter.dto';
import { Chapter } from '../entities/chapter.entity';
import {
  MangaNotFoundException,
  ChapterNotFoundException,
} from '../../../common/exceptions';

import * as AdmZip from 'adm-zip';
import * as UnrarJs from 'unrar-js';
import settings from '../../../common/settings';
import {
  writeFileSyncWithSafeName,
  createFolderIfNotExists,
} from '../../../common/utils';
import { PrepareChapterDto } from '../dto/prepareChapter.dto';
import { UpdateChapterProgressDto } from '../dto/updateChapterProgress.dto';
import { env } from 'src/env';

@Injectable()
export class ChaptersService {
  constructor(
    @Inject(CHAPTER_REPOSITORY_TOKEN)
    private readonly chaptersRepository: ChaptersRepository,
    @Inject(MANGA_REPOSITORY_TOKEN)
    private readonly mangaRepository: MangaRepository,
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

    const folder = `${file.destination}/${manga.name}`;
    createFolderIfNotExists(folder);
    const filePath = `${folder}/${file.originalname}`;
    fs.renameSync(file.path, filePath);

    const { pages, path } = this.extractChapterCover(
      filePath,
      `${settings.get('COVERS_FOLDER')}/${manga.name}`,
    );

    return this.chaptersRepository.saveChapter(manga, {
      number: chapter.number,
      filePath,
      coverPath: path,
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
  }): { pages: number; path: string } {
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
  }): { pages: number; path: string } {
    const files = new AdmZip(filePath).getEntries();

    const result = { pages: files.length, path: destination };

    if (onlyExtractCover) {
      const file = files[0];
      result.path = writeFileSyncWithSafeName(
        destination,
        file.entryName,
        file.getData(),
      );
    }

    files.forEach(file =>
      writeFileSyncWithSafeName(destination, file.entryName, file.getData()),
    );
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
  }): { pages: number; path: string } {
    const files = UnrarJs.unrarSync(filePath);

    const result = { pages: files.lenght, path: destination };

    if (onlyExtractCover) {
      const file = files[0];
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

    const destination = `${settings.get('TEMP_FOLDER')}/${chapter.manga.name}/${
      chapter.number
    }`;

    fs.mkdirSync(destination, {
      recursive: true,
    });

    this.extractChapterFile({
      filePath: chapter.filePath,
      destination,
    });

    // Create URLS to each page
    const pages = fs.readdirSync(destination);
    return pages.map(
      page =>
        `//${env.NEST_HOST}:${env.NEST_PORT}/reading/${chapter.manga.name}/${chapter.number}/${page}`,
    );

    // Should store wich manga is actually reading??? (to avoid multiple extractions)
  }

  private isChapterPrepared() {
    console.log('TODO');
    /*
    
    just check if exists folder
    Example: Mein-Manga/tempFolder/Berserk/3
    

    */
  }

  public updateChapterProgress(
    updateChapterProgressDto: UpdateChapterProgressDto,
  ) {
    console.log(updateChapterProgressDto);
    //Need to create auth and users to continue.
  }

  public async deleteChapter({ mangaId, chapterNo }: PrepareChapterDto) {
    const chapter = await this.chaptersRepository.searchChapter(
      mangaId,
      chapterNo,
    );

    if (!chapter) {
      throw new ChapterNotFoundException();
    }

    this.deleteChapterFiles(chapter);

    return this.chaptersRepository.delete(chapter);
  }

  public deleteChapterFiles(chapter: Chapter): void {
    fs.unlinkSync(chapter.coverPath);
    fs.unlinkSync(chapter.filePath);
  }
}

import * as fs from 'fs';
import { Injectable, Inject } from '@nestjs/common';
import {
  CHAPTER_REPOSITORY_TOKEN,
  MANGA_REPOSITORY_TOKEN,
} from 'src/common/config/databaseTokens.constants';
import { ChaptersRepository } from '../chapters.repository';
import { MangaRepository } from '../manga.repository';
import { NewChapterDto } from '../dto/newChapter.dto';
import { Chapter } from '../entities/chapter.entity';
import { MangaNotFoundException } from 'src/common/exceptions';

import * as AdmZip from 'adm-zip';
import * as UnrarJs from 'unrar-js';
import settings from 'src/common/settings';
import {
  writeFileSyncWithSafeName,
  createFolderIfNotExists,
} from 'src/common/utils';
import { PrepareChapterDto } from '../dto/prepareChapter.dto';
import { UpdateChapterProgressDto } from '../dto/updateChapterProgress.dto';

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
    const manga = await this.mangaRepository.getManga(mangaId);
    if (!manga) {
      throw new MangaNotFoundException();
    }

    const folder = `${file.destination}/${manga.name}`;
    createFolderIfNotExists(folder);
    const filePath = `${folder}/${file.originalname}`;
    fs.renameSync(file.path, filePath);

    const coverPath = this.extractChapterCover(
      filePath,
      `${settings.get('COVERS_FOLDER')}/${manga.name}`,
    );

    return this.chaptersRepository.saveChapter(manga, {
      number: chapter.number,
      filePath,
      coverPath,
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
  }): string {
    createFolderIfNotExists(options.destination);

    const location = options.filePath.endsWith('cbz')
      ? this.readZip(options)
      : this.readRar(options);

    return location;
  }

  private readZip({
    filePath,
    destination,
    onlyExtractCover,
  }: {
    filePath: string;
    destination: string;
    onlyExtractCover?: boolean;
  }): string {
    const files = new AdmZip(filePath).getEntries();

    if (onlyExtractCover) {
      const file = files[0];
      return writeFileSyncWithSafeName(
        destination,
        file.entryName,
        file.getData(),
      );
    }

    files.forEach(file =>
      writeFileSyncWithSafeName(destination, file.entryName, file.getData()),
    );
    return destination;
  }

  private readRar({
    filePath,
    destination,
    onlyExtractCover,
  }: {
    filePath: string;
    destination: string;
    onlyExtractCover?: boolean;
  }): string {
    const files = UnrarJs.unrarSync(filePath);

    if (onlyExtractCover) {
      const file = files[0];
      return writeFileSyncWithSafeName(
        destination,
        file.filename,
        file.fileData,
      );
    }

    files.forEach(file =>
      writeFileSyncWithSafeName(destination, file.filename, file.fileData),
    );
    return destination;
  }

  public async prepareChapter(
    preapareChapterDto: PrepareChapterDto,
  ): Promise<string[]> {
    const chapter = await this.chaptersRepository.searchChapter(
      preapareChapterDto,
    );

    this.extractChapterFile({
      filePath: chapter.filePath,
      destination: settings.get('TEMP_FOLDER'),
    });

    // Create URLS to each page
    const pages = fs.readdirSync(settings.get('TEMP_FOLDER'));
    return pages.map(page => `//localhost:3000/reading/${page}`);

    // Should store wich manga is actually reading??? (to avoid multiple extractions)
  }

  public updateChapterProgress(
    updateChapterProgressDto: UpdateChapterProgressDto,
  ) {
    console.log(updateChapterProgressDto);
    //Need to create auth and users to continue.
  }
}

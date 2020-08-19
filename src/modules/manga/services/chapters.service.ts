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
import { writeFileSyncWithSafeName } from 'src/common/utils';

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

    const dest = `${file.destination}/${manga.name}/${file.originalname}`;
    fs.renameSync(file.path, dest);

    const coverPath = this.extractChapterCover(
      dest,
      `${settings.get('COVERS_FOLDER')}/${manga.name}`,
    );

    //Create Cover path

    return this.chaptersRepository.saveChapter(manga, {
      number: chapter.number,
      filePath: dest,
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
    if (!options.onlyExtractCover) {
      options.onlyExtractCover = false;
      // Nessary??
    }

    // destination?
    // JustExtractCover?

    console.log(options.filePath);

    if (!fs.existsSync(options.destination)) {
      fs.mkdirSync(options.destination);
    }

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

    /* const saveFile = (file: any) => {
      const finalFileName = `${destination}/${file.filename.replace('/', '_')}`;
      fs.writeFileSync(finalFileName, file.fileData);
      return finalFileName;
    }; */

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
}

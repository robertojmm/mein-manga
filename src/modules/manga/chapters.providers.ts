import { Connection, Repository } from 'typeorm';
import { MangaRepository } from './manga.repository';
import { ChaptersRepository } from './chapters.repository';

import {
  DB_CONNECTION_TOKEN,
  MANGA_REPOSITORY_TOKEN,
  CHAPTER_REPOSITORY_TOKEN,
  USER_MANGA_CHAPTER_REPOSITORY_TOKEN,
} from '../../common/config/databaseTokens.constants';
import { UserMangaChapter } from './entities/user-manga-chapter.entity';

export const chaptersProviders = [
  {
    provide: CHAPTER_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): ChaptersRepository =>
      connection.getCustomRepository(ChaptersRepository),
    inject: [DB_CONNECTION_TOKEN],
  },
  {
    provide: MANGA_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): MangaRepository =>
      connection.getCustomRepository(MangaRepository),
    inject: [DB_CONNECTION_TOKEN],
  },
  {
    provide: USER_MANGA_CHAPTER_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): Repository<UserMangaChapter> =>
      connection.getRepository(UserMangaChapter),
    inject: [DB_CONNECTION_TOKEN],
  },
];

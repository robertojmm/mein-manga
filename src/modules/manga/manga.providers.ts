import { Connection } from 'typeorm';
import { MangaRepository } from './manga.repository';

import {
  DB_CONNECTION_TOKEN,
  MANGA_REPOSITORY_TOKEN,
} from '../../common/config/databaseTokens.constants';

export const mangaProviders = [
  {
    provide: MANGA_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): MangaRepository =>
      connection.getCustomRepository(MangaRepository),
    inject: [DB_CONNECTION_TOKEN],
  },
];

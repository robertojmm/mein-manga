import { Connection, Repository } from 'typeorm';
import { Manga } from './manga.entity';

import {
  DB_CONNECTION_TOKEN,
  MANGA_REPOSITORY_TOKEN,
} from '../../common/config/databaseTokens.constants';

export const mangaProviders = [
  {
    provide: MANGA_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): Repository<Manga> =>
      connection.getRepository(Manga),
    inject: [DB_CONNECTION_TOKEN],
  },
];

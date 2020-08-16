import { ENV } from '../env/env.class';
import { Provider } from '@nestjs/common';
import { createConnection, Connection } from 'typeorm';
import { DB_CONNECTION_TOKEN } from '../../common/config/databaseTokens.constants';

export const databaseProviders: Provider[] = [
  {
    provide: DB_CONNECTION_TOKEN,
    useFactory: async (env: ENV): Promise<Connection> => {
      return await createConnection({
        type: 'mysql',
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        //logging: 'all',
      });
    },
    inject: [ENV],
  },
];

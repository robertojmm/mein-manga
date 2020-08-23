import { Connection, Repository } from 'typeorm';
import {
  USER_REPOSITORY_TOKEN,
  DB_CONNECTION_TOKEN,
} from 'src/common/config/databaseTokens.constants';
import { User } from './entities/user.entity';

export const UsersProviders = [
  {
    provide: USER_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): Repository<User> =>
      connection.getRepository(User),
    inject: [DB_CONNECTION_TOKEN],
  },
];

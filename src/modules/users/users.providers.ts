import { Connection, Repository } from 'typeorm';
import {
  USER_REPOSITORY_TOKEN,
  DB_CONNECTION_TOKEN,
  ROLE_REPOSITORY_TOKEN,
} from 'src/common/config/databaseTokens.constants';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

export const UsersProviders = [
  {
    provide: USER_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): Repository<User> =>
      connection.getRepository(User),
    inject: [DB_CONNECTION_TOKEN],
  },
  {
    provide: ROLE_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): Repository<Role> =>
      connection.getRepository(Role),
    inject: [DB_CONNECTION_TOKEN],
  },
];

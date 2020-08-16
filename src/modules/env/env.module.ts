import { Module, Provider } from '@nestjs/common';
import { ENV } from '../../env/env.class';

const provider: Provider = {
  provide: ENV,
  useFactory: () => import(`../../env`).then(({ env }) => env),
};

@Module({
  providers: [provider],
  exports: [provider],
})
export class EnvModule {}

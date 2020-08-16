import { Module, Provider } from '@nestjs/common';
import { ENV } from './env.class';

const provider: Provider = {
  provide: ENV,
  useFactory: () => import(`./default`).then(({ env }) => env),
};

@Module({
  providers: [provider],
  exports: [provider],
})
export class EnvModule {}

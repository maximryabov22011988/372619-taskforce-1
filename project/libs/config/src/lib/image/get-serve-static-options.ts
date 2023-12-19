import { ServeStaticModuleAsyncOptions } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { cwd } from 'node:process';

const SIX_MONTH_IN_MS = 15778800000;

export const getServeStaticOptions = (): ServeStaticModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => [
    {
      rootPath: join(cwd(), config.get<string>('app.uploadDirectory')),
      serveRoot: config.get<string>('app.uploadServePath'),
      serveStaticOptions: {
        fallthrough: true,
        maxAge: SIX_MONTH_IN_MS,
      },
    },
  ],
});

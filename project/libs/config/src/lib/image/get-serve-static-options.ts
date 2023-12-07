import { ServeStaticModuleAsyncOptions } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const getServeStaticOptions = (): ServeStaticModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => [
    {
      rootPath: join(process.cwd(), config.get<string>('app.staticPath')),
      serveRoot: config.get<string>('app.staticServePath'),
    },
  ],
});

import { HttpModuleAsyncOptions } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export const getHttpOptions = (): HttpModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    timeout: config.get<number>('http.timeout'),
    maxRedirects: config.get<number>('http.maxRedirects'),
  }),
});

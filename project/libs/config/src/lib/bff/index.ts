import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Environment } from '@project/libs/shared-types';
import { default as appConfig } from './config/app.config';
import { default as httpConfig } from './config/http.config';
import { default as microserviceConfig } from './config/microservice.config';
import { getHttpOptions } from './get-http-options';

dotenv.config();

const isDev = process.env.NODE_ENV === Environment.Development;
const ENV_BFF_FILE_PATHS = [`apps/bff/env/.${isDev ? 'dev' : 'stage'}.env`];

export { appConfig, httpConfig, microserviceConfig, getHttpOptions };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, httpConfig, microserviceConfig],
      envFilePath: ENV_BFF_FILE_PATHS,
    }),
  ],
})
export class ApiGatewayConfigModule {}

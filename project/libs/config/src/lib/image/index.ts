import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Environment } from '@project/libs/shared-types';
import { getServeStaticOptions } from './get-serve-static-options';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';
import { default as jwtConfig } from './config/jwt.config';

dotenv.config();

const isDev = process.env.NODE_ENV === Environment.Development;
const ENV_IMAGE_FILE_PATHS = [`apps/image/env/.${isDev ? 'dev' : 'stage'}.env`];

export { appConfig, dbConfig, getServeStaticOptions };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, dbConfig, jwtConfig],
      envFilePath: ENV_IMAGE_FILE_PATHS,
    }),
  ],
})
export class ImageConfigModule {}

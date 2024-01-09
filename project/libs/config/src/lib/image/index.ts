import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from '../shared/jwt';
import { getServeStaticOptions } from './get-serve-static-options';
import { getMongooseOptions } from '../shared/get-mongoose-options';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';

const ENV_IMAGE_FILE_PATH = 'apps/image/.image.env';

export { appConfig, dbConfig, getMongooseOptions, getServeStaticOptions };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, dbConfig, jwtConfig],
      envFilePath: ENV_IMAGE_FILE_PATH,
    }),
  ],
})
export class ImageConfigModule {}

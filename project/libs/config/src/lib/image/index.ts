import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getServeStaticOptions } from './get-serve-static-options';
import { getMongooseOptions } from './get-mongoose-options';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';

const ENV_IMAGE_FILE_PATH = 'apps/image/.image.env';

export { appConfig, dbConfig, getMongooseOptions, getServeStaticOptions };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, dbConfig],
      envFilePath: ENV_IMAGE_FILE_PATH,
    }),
  ],
})
export class ImageConfigModule {}

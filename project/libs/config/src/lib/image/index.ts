import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getMongooseOptions } from './get-mongoose-options';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';

const ENV_IMAGE_FILE_PATH = 'apps/image/.image.env';

export { appConfig, dbConfig, getMongooseOptions };

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
export class ConfigImageModule {}

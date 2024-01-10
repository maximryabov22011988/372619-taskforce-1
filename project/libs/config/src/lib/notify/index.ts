import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getMongooseOptions } from './get-mongoose-options';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';
import { default as rabbitMqConfig } from './config/rabbit-mq.config';

const ENV_NOTIFY_FILE_PATH = 'apps/notify/.notify.env';

export { appConfig, dbConfig, rabbitMqConfig, getMongooseOptions };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, dbConfig, rabbitMqConfig],
      envFilePath: ENV_NOTIFY_FILE_PATH,
    }),
  ],
})
export class NotifyConfigModule {}

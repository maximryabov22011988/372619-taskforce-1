import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getMailOptions } from './get-mail-options';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';
import { default as rabbitMqConfig } from './config/rabbit-mq.config';
import { default as mailConfig } from './config/mail.config';

const ENV_NOTIFY_FILE_PATH = 'apps/notify/.notify.env';

export { appConfig, dbConfig, rabbitMqConfig, mailConfig, getMailOptions };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, dbConfig, rabbitMqConfig, mailConfig],
      envFilePath: ENV_NOTIFY_FILE_PATH,
    }),
  ],
})
export class NotifyConfigModule {}

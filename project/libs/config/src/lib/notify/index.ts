import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Environment } from '@project/libs/shared-types';
import { getMailOptions } from './get-mail-options';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';
import { default as rabbitMqConfig } from './config/rabbit-mq.config';
import { default as mailConfig } from './config/mail.config';

dotenv.config();

const isDev = process.env.NODE_ENV === Environment.Development;
const ENV_NOTIFY_FILE_PATHS = [
  `apps/notify/env/.${isDev ? 'dev' : 'stage'}.env`,
];

export { appConfig, dbConfig, rabbitMqConfig, mailConfig, getMailOptions };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, dbConfig, rabbitMqConfig, mailConfig],
      envFilePath: ENV_NOTIFY_FILE_PATHS,
    }),
  ],
})
export class NotifyConfigModule {}

import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Environment } from '@project/libs/shared-types';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';
import { default as jwtConfig } from './config/jwt.config';
import { default as rabbitMqConfig } from './config/rabbit-mq.config';

dotenv.config();

const isDev = process.env.NODE_ENV === Environment.Development;
const ENV_TASK_FILE_PATHS = [`apps/task/env/.${isDev ? 'dev' : 'stage'}.env`];

export { appConfig, dbConfig, jwtConfig, rabbitMqConfig };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, dbConfig, jwtConfig, rabbitMqConfig],
      envFilePath: ENV_TASK_FILE_PATHS,
    }),
  ],
})
export class TaskConfigModule {}

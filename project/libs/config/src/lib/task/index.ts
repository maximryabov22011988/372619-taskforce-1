import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';
import { default as jwtConfig } from './config/jwt.config';

const ENV_TASK_FILE_PATH = 'apps/task/.task.env';

export { appConfig, dbConfig, jwtConfig };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, dbConfig, jwtConfig],
      envFilePath: ENV_TASK_FILE_PATH,
    }),
  ],
})
export class TaskConfigModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { default as appConfig } from './config/app.config';
import { default as dbConfig } from './config/db.config';
import { default as jwtConfig } from './config/jwt.config';
import { default as rabbitMqConfig } from './config/rabbit-mq.config';

const ENV_TASK_FILE_PATH = 'apps/user/.user.env';

export { appConfig, dbConfig, jwtConfig, rabbitMqConfig };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, dbConfig, jwtConfig, rabbitMqConfig],
      envFilePath: ENV_TASK_FILE_PATH,
    }),
  ],
})
export class UserConfigModule {}

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

const GLOBAL_PREFIX = 'api';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  app.setGlobalPrefix(GLOBAL_PREFIX);
  await app.listen(port);

  Logger.log(
    `🚀 Notify microservice is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
};

bootstrap();

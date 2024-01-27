/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {
  Logger,
  INestApplication,
  VersioningType,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UniqueConstraintExceptionFilter } from '@project/libs/filters';
import { Environment } from '@project/libs/shared-types';
import { AppModule } from './app/app.module';

const setupOpenApi = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Task service')
    .setDescription('Task service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/spec', app, document, {
    useGlobalPrefix: true,
  });
};

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('app.port');
  const env = configService.get('app.environment');

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(new UniqueConstraintExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: env !== Environment.Development,
    })
  );
  setupOpenApi(app);
  await app.listen(port);

  Logger.log(
    `🚀 Task microservice is running on: http://localhost:${port}/${globalPrefix}`
  );
};

bootstrap();

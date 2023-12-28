/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, INestApplication, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

const setupOpenApi = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('User service')
    .setDescription('User service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/spec', app, document, {
    useGlobalPrefix: true,
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  setupOpenApi(app);
  await app.listen(port);

  Logger.log(
    `🚀 User microservice is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

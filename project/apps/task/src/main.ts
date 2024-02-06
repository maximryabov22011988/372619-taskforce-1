import {
  Logger,
  INestApplication,
  VersioningType,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ACCESS_TOKEN_NAME } from '@project/libs/decorators';
import {
  UniqueConstraintExceptionFilter,
  ForeignKeyViolationExceptionFilter,
  DataExceptionFilter,
} from '@project/libs/filters';
import { Environment } from '@project/libs/shared-types';
import { AppModule } from './app/app.module';

const GLOBAL_PREFIX = 'api';

const setupOpenApi = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Task service')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      ACCESS_TOKEN_NAME
    )
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

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(
    new UniqueConstraintExceptionFilter(),
    new ForeignKeyViolationExceptionFilter(),
    new DataExceptionFilter()
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: env !== Environment.Development,
    })
  );
  setupOpenApi(app);
  await app.listen(port);

  Logger.log(
    `🚀 Task microservice is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
};

bootstrap();

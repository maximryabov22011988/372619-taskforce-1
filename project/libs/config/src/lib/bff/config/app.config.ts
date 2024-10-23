import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Radix } from '@project/libs/shared-types';
import { AppEnv } from '../app.env';

const DEFAULT_PORT = 3004;
const DEFAULT_MAX_REDIRECTS = 5;
const DEFAULT_TIMEOUT = 5000;

export interface AppConfig {
  environment: string;
  port: number;
  userServiceUrl: string;
  imageServiceUrl: string;
  taskServiceUrl: string;
  httpClientMaxRedirects: number;
  httpClientTimeout: number;
}

export default registerAs('app', (): AppConfig => {
  const config: AppConfig = {
    environment: process.env.NODE_ENV,
    port: parseInt(
      process.env.BFF_PORT || DEFAULT_PORT.toString(),
      Radix.Decimal
    ),
    userServiceUrl: process.env.USER_SERVICE_URL,
    imageServiceUrl: process.env.IMAGE_SERVICE_URL,
    taskServiceUrl: process.env.TASK_SERVICE_URL,
    httpClientMaxRedirects: parseInt(
      process.env.HTTP_CLIENT_MAX_REDIRECTS || DEFAULT_MAX_REDIRECTS.toString(),
      Radix.Decimal
    ),
    httpClientTimeout: parseInt(
      process.env.HTTP_CLIENT_TIMEOUT || DEFAULT_TIMEOUT.toString(),
      Radix.Decimal
    ),
  };

  const appEnv = plainToInstance(AppEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(appEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[App config]: Environments validation failed. Please check .bff.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});

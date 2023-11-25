import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppEnv } from '../app.env';

const DEFAULT_PORT = 3001;

export interface AppConfig {
  environment: string;
  port: number;
}

export default registerAs('app', (): AppConfig => {
  const config: AppConfig = {
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.PORT || DEFAULT_PORT.toString(), 10),
  };

  const appEnv = plainToInstance(AppEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(appEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(errors.toString());
  }

  return config;
});

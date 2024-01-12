import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppEnv } from '../app.env';

const DEFAULT_PORT = 3001;

export interface AppConfig {
  environment: string;
  port: number;
  uploadDirectory: string;
  uploadServePath: string;
}

export default registerAs('app', (): AppConfig => {
  const config: AppConfig = {
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.PORT || DEFAULT_PORT.toString(), 10),
    uploadDirectory: process.env.UPLOAD_DIRECTORY,
    uploadServePath: process.env.UPLOAD_SERVE_PATH,
  };

  const appEnv = plainToInstance(AppEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(appEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[App config]: Environments validation failed. Please check .image.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});

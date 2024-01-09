import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { DbEnv } from '../dv.env';

const DEFAULT_MONGO_PORT = 27020;

export interface DbConfig {
  host: string;
  name: string;
  port: number;
  user: string;
  password: string;
  authBase: string;
}

export default registerAs('db', (): DbConfig => {
  const config: DbConfig = {
    name: process.env.NOTIFY_DB_NAME,
    host: process.env.NOTIFY_DB_HOST,
    port: parseInt(
      process.env.NOTIFY_DB_PORT ?? DEFAULT_MONGO_PORT.toString(),
      10
    ),
    user: process.env.NOTIFY_DB_USER,
    password: process.env.NOTIFY_DB_PASSWORD,
    authBase: process.env.NOTIFY_DB_AUTH_BASE,
  };

  const dbEnv = plainToInstance(DbEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(dbEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[DB config]: Environments validation failed. Please check .notify.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});

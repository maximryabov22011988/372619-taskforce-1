import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Radix } from '@project/libs/shared-types';
import { DbEnv } from '../dv.env';

const DEFAULT_MONGO_PORT = 27017;

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
    name: process.env.IMAGE_DB_NAME,
    host: process.env.IMAGE_DB_HOST,
    port: parseInt(
      process.env.IMAGE_DB_PORT ?? DEFAULT_MONGO_PORT.toString(),
      Radix.Decimal
    ),
    user: process.env.IMAGE_DB_USER,
    password: process.env.IMAGE_DB_PASSWORD,
    authBase: process.env.IMAGE_DB_AUTH_BASE,
  };

  const dbEnv = plainToInstance(DbEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(dbEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[DB config]: Environments validation failed. Please check .image.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});

import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
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
    name: process.env.MONGO_DB_NAME,
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT ?? DEFAULT_MONGO_PORT.toString(), 10),
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    authBase: process.env.MONGO_AUTH_BASE,
  };

  const dbEnv = plainToInstance(DbEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(dbEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(errors.toString());
  }

  return config;
});

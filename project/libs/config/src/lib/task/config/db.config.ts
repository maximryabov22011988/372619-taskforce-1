import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { DbEnv } from '../dv.env';

const DEFAULT_POSTGRESQL_PORT = 5432;

export interface DbConfig {
  host: string;
  name: string;
  port: number;
  user: string;
  password: string;
}

export default registerAs('db', (): DbConfig => {
  const config: DbConfig = {
    name: process.env.TASK_DB_NAME,
    host: process.env.TASK_DB_HOST,
    port: parseInt(
      process.env.TASK_DB_PORT ?? DEFAULT_POSTGRESQL_PORT.toString(),
      10
    ),
    user: process.env.TASK_DB_USER,
    password: process.env.TASK_DB_PASSWORD,
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

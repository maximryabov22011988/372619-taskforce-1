import { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { config } from 'dotenv';

config({ path: '../../.task.env' });

const baseConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  migrations: {
    extension: 'ts',
    tableName: 'migrations',
    directory: 'migrations',
    stub: './migration.stub',
  },
  seeds: {
    extension: 'ts',
    directory: 'seeds',
    stub: './seed.stub',
  },
  ...knexSnakeCaseMappers(),
};

export const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    ...baseConfig,
    debug: true,
  },
  production: {
    ...baseConfig,
    pool: {
      min: 5,
      max: 30,
    },
  },
};

export default knexConfig;

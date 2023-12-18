import { Knex } from 'knex';
import { config } from 'dotenv';

config({ path: '../../.task.env' });

const baseConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.TASK_DB_HOST || 'localhost',
    port: Number(process.env.TASK_DB_PORT) || 5432,
    database: process.env.TASK_DB_NAME || 'postgres',
    user: process.env.TASK_DB_USER || 'postgres',
    password: process.env.TASK_DB_PASSWORD || 'postgres',
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

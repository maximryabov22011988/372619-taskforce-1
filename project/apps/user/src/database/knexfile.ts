import { Knex } from 'knex';
import { config } from 'dotenv';

config({ path: '../../.user.env' });

const baseConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.USER_DB_HOST || 'localhost',
    port: Number(process.env.USER_DB_PORT) || 5433,
    database: process.env.USER_DB_NAME || 'postgres',
    user: process.env.USER_DB_USER || 'postgres',
    password: process.env.USER_DB_PASSWORD || 'postgres',
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

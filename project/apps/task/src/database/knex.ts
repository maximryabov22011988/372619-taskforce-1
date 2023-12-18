import knexConfig from './knexfile';

export const knex = knexConfig[process.env.NODE_ENV ?? 'development'];

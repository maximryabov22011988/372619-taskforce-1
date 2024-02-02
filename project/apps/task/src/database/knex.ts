import { Environment } from '@project/libs/shared-types';
import knexConfig from './knexfile';

export const knex = knexConfig[process.env.NODE_ENV ?? Environment.Development];

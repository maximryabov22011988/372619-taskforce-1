import { Knex } from 'knex';

const tableName = 'statuses';

export async function seed(knex: Knex): Promise<any> {
  await knex(tableName).insert([
    {
      id: 1,
      name: 'new',
    },
    {
      id: 2,
      name: 'in-progress',
    },
    {
      id: 3,
      name: 'done',
    },
    {
      id: 4,
      name: 'cancelled',
    },
    {
      id: 5,
      name: 'failed',
    },
  ]);
}

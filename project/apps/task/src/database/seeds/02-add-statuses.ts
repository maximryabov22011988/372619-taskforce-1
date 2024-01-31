import { Knex } from 'knex';

const TABLE_NAME = 'statuses';

export async function seed(knex: Knex): Promise<void> {
  await knex(TABLE_NAME).del();

  await knex(TABLE_NAME).insert([
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

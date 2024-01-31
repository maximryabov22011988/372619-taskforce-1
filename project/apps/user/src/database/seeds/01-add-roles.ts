import { Knex } from 'knex';

const TABLE_NAME = 'roles';

export async function seed(knex: Knex): Promise<void> {
  await knex(TABLE_NAME).del();

  await knex(TABLE_NAME).insert([
    {
      id: 1,
      name: 'customer',
    },
    {
      id: 2,
      name: 'contractor',
    },
  ]);
}

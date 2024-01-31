import { Knex } from 'knex';

const tableName = 'roles';

export async function seed(knex: Knex): Promise<void> {
  await knex(tableName).del();

  await knex(tableName).insert([
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

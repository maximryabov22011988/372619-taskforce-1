import { Knex } from 'knex';

const tableName = 'cities';

export async function seed(knex: Knex): Promise<void> {
  await knex(tableName).insert([
    {
      id: 1,
      name: 'Москва',
    },
    {
      id: 2,
      name: 'Санкт-Петербург',
    },
    {
      id: 3,
      name: 'Владивосток',
    },
  ]);
}

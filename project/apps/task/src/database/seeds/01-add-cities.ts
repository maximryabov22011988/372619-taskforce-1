import { Knex } from 'knex';

const TABLE_NAME = 'cities';

export async function seed(knex: Knex): Promise<void> {
  await knex(TABLE_NAME).del();

  await knex(TABLE_NAME).insert([
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

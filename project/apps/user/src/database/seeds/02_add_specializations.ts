import { Knex } from 'knex';

const tableName = 'specializations';

export async function seed(knex: Knex): Promise<void> {
  await knex(tableName).del();

  await knex(tableName).insert([
    {
      id: 1,
      name: 'Ремонт ПК',
    },
    {
      id: 2,
      name: 'Отделка квартир',
    },
  ]);
}

import { Knex } from 'knex';

const tableName = 'categories';

export async function seed(knex: Knex): Promise<any> {
  await knex(tableName).insert([
    {
      id: 1,
      name: 'мебель',
    },
    {
      id: 2,
      name: 'фильтр',
    },
  ]);
}

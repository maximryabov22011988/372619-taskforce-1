import { Knex } from 'knex';

const tableName = 'tags';

export async function seed(knex: Knex): Promise<any> {
  await knex(tableName)
    .del()
    .insert([
      {
        id: 1,
        name: 'качество',
      },
      {
        id: 2,
        name: 'сборка',
      },
      {
        id: 3,
        name: 'быстро',
      },
      {
        id: 4,
        name: 'фильтр',
      },
      {
        id: 5,
        name: 'вода',
      },
    ]);
}

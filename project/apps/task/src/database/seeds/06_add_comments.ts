import { Knex } from 'knex';

const tableName = 'comments';

export async function seed(knex: Knex): Promise<any> {
  await knex(tableName)
    .del()
    .insert([
      {
        id: 1,
        text: 'На первый взгляд - легкая работа',
        task_id: 1,
      },
      {
        id: 2,
        text: 'Работы на 20 минут...',
        task_id: 2,
      },
      {
        id: 3,
        text: 'Жаль я очень занят(((',
        task_id: 2,
      },
    ]);
}

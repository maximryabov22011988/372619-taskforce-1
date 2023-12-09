import { Knex } from 'knex';
import { v4 as makeUuid } from 'uuid';

const tableName = 'comments';

export async function seed(knex: Knex): Promise<any> {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      id: 1,
      text: 'На первый взгляд - легкая работа',
      task_id: 1,
      user_id: makeUuid(),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      text: 'Работы на 20 минут...',
      task_id: 2,
      user_id: makeUuid(),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      text: 'Жаль я очень занят(((',
      task_id: 2,
      user_id: makeUuid(),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

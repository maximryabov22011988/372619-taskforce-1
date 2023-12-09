import { Knex } from 'knex';

const tableName = 'tasks_tags';

export async function seed(knex: Knex): Promise<any> {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      task_id: 1,
      tag_id: 1,
    },
    {
      task_id: 1,
      tag_id: 2,
    },
    {
      task_id: 1,
      tag_id: 3,
    },
    {
      task_id: 2,
      tag_id: 4,
    },
    {
      task_id: 2,
      tag_id: 5,
    },
  ]);
}

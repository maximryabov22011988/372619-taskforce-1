import { Knex } from 'knex';

const TABLE_NAME = 'tasks_tags';

export async function up(knex: Knex) {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.integer('task_id').unsigned().notNullable();
    table.integer('tag_id').unsigned().notNullable();
    table.primary(['task_id', 'tag_id']);

    table
      .foreign('task_id')
      .references('id')
      .inTable('tasks')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .foreign('tag_id')
      .references('id')
      .inTable('tags')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  await knex.schema
    .table(TABLE_NAME, (table) => {
      table.dropForeign('task_id');
      table.dropForeign('tag_id');
    })
    .dropTableIfExists(TABLE_NAME);
}

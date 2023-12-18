import { Knex } from 'knex';

const tableName = 'tasks_tags';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.integer('task_id').nullable();
    table.integer('tag_id').nullable();
    table.primary(['task_id', 'tag_id']);

    table
      .foreign('task_id')
      .references('id')
      .inTable('tasks')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');

    table
      .foreign('tag_id')
      .references('id')
      .inTable('tags')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex) {
  await knex.schema
    .table(tableName, (table) => {
      table.dropForeign('task_id');
      table.dropForeign('tag_id');
    })
    .dropTableIfExists(tableName);
}

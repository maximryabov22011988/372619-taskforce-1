import { Knex } from 'knex';

const tableName = 'reviews';

export async function up(knex: Knex) {
  await knex.schema.alterTable(tableName, (table) => {
    table
      .foreign('task_id')
      .references('id')
      .inTable('tasks')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropForeign('task_id');
  });
}

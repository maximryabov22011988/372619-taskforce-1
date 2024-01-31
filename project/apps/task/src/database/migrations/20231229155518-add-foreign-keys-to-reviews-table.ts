import { Knex } from 'knex';

const TABLE_NAME = 'reviews';

export async function up(knex: Knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table
      .foreign('task_id')
      .references('id')
      .inTable('tasks')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropForeign('task_id');
  });
}

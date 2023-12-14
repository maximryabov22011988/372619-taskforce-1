import { Knex } from 'knex';

const tableName = 'comments';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('text', 300).notNullable();
    table.integer('task_id').notNullable();
    table.uuid('user_id');
    table.string('created_at').defaultTo(null);
    table.string('updated_at').defaultTo(null);

    table
      .foreign('task_id')
      .references('id')
      .inTable('tasks')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  await knex.schema
    .table(tableName, (table) => {
      table.dropForeign('task_id');
    })
    .dropTableIfExists(tableName);
}

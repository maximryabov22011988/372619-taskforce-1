import { Knex } from 'knex';

const tableName = 'reviews';

export async function up(knex: Knex) {
  await knex.schema.alterTable(tableName, (table) => {
    table
      .foreign('author_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropForeign('author_id');
  });
}

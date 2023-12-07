import { Knex } from 'knex';

const tableName = 'categories';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('name', 50).unique().notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(tableName);
}

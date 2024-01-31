import { Knex } from 'knex';

const tableName = 'specializations';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(tableName);
}

import { Knex } from 'knex';

const TABLE_NAME = 'specializations';

export async function up(knex: Knex) {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}

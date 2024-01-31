import { Knex } from 'knex';

const tableName = 'statuses';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table
      .string('name', 15)
      .checkIn(['new', 'cancelled', 'in-progress', 'done', 'failed'])
      .notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(tableName);
}

import { Knex } from 'knex';

const TABLE_NAME = 'statuses';

export async function up(knex: Knex) {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table
      .string('name', 15)
      .checkIn(['new', 'cancelled', 'in-progress', 'done', 'failed'])
      .notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}

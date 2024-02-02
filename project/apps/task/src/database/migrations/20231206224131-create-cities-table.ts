import { Knex } from 'knex';

const TABLE_NAME = 'cities';

export async function up(knex: Knex) {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table
      .string('name', 20)
      .checkIn(['Москва', 'Санкт-Петербург', 'Владивосток'])
      .notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}

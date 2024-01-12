import { Knex } from 'knex';

const tableName = 'roles';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('name', 25).checkIn(['customer', 'contractor']).notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(tableName);
}

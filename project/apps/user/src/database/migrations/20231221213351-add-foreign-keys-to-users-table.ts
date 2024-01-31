import { Knex } from 'knex';

const TABLE_NAME = 'users';

export async function up(knex: Knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table
      .foreign('role_id')
      .references('id')
      .inTable('roles')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropForeign('role_id');
  });
}

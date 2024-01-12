import { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex) {
  await knex.schema.alterTable(tableName, (table) => {
    table
      .foreign('role_id')
      .references('id')
      .inTable('roles')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropForeign('role_id');
  });
}

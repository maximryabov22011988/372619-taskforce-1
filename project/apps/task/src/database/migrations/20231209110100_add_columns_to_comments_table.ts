import { Knex } from 'knex';

const tableName = 'comments';

export async function up(knex: Knex) {
  await knex.schema.alterTable(tableName, (table) => {
    table.uuid('user_id');
    table
      .dateTime('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('user_id');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
}

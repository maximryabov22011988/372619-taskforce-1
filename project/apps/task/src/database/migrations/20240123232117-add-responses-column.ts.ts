import { Knex } from 'knex';

const tableName = 'tasks';

export async function up(knex: Knex) {
  await knex.schema.table(tableName, (table) => {
    table.jsonb('responses');
  });
}

export async function down(knex: Knex) {
  await knex.schema.table(tableName, (table) => {
    table.dropColumn('responses');
  });
}

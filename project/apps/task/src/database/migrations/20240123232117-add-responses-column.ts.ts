import { Knex } from 'knex';

const TABLE_NAME = 'tasks';

export async function up(knex: Knex) {
  await knex.schema.table(TABLE_NAME, (table) => {
    table.jsonb('responses');
  });
}

export async function down(knex: Knex) {
  await knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn('responses');
  });
}
